# Tree Decomposition — Issues Tracker

**Source:** Multi-agent review of `docs/superpowers/specs/2026-05-21-company-research-tree-decomposition-design.md`
**Branch:** `feat/company-research-tree`
**Total:** 22 issues (5 CRITICAL, 9 HIGH, 8 MEDIUM)
**Status:** 22 / 22 fixed

> **Delete this file after all issues are closed and user confirms.**

---

## CRITICAL — Must fix before implementation

### [x] #1 Verify `> Read X` syntax is real Claude Code convention
**Why:** Foundational. Whole §5/§6 dispatch depends on it. If invented, all 21 reads break.
**Fix:** Check Claude Code docs OR match the actual convention used in `bd-tracker-updater/org-creation/SKILL.md` (`> Read [path] now.`). If not a real convention, rewrite all reads as prose: *"Load the file at X next."*
**Where:** Design doc §5, §6 + all future SKILL.md files
**Resolution notes:** Verified against `bd-tracker-updater/org-creation/SKILL.md`. Convention is `> Read \`path\` now.` (markdown blockquote). Design doc §5/§6 use this exact form.

### [x] #2 Fix npm `files` glob to cover nested dirs
**Why:** `files: ["*/"]` matches top-level only. Nested step files won't publish — silent install failure.
**Fix:** Change to `["*/**", "!node_modules/"]`. Add CI gate: `npm pack`, enumerate, verify all 19 step files present.
**Where:** `package.json`, new CI script
**Resolution notes:** `package.json` already has `"files": ["*/**", "!node_modules/"]`. CI gate documented in design doc Acceptance Criteria — `npm pack` enumeration must list every `*/SKILL.md`.

### [x] #3 Resolve sub-skill name-collision risk
**Why:** `name: company-research-step-N` in child frontmatter creates discoverable top-level skills. "Step 3" in unrelated context could trigger.
**Fix:** Match `bd-tracker-updater/org-creation` pattern. Verify how its child registers — if child uses `name:` field, copy that approach. If not, drop frontmatter from children OR prefix with `_internal_`.
**Where:** Design doc §3.3 "Step file structure", all step/wave SKILL.md templates
**Resolution notes:** `bd-tracker-updater/org-creation/SKILL.md` uses `name: bd-tracker-updater-org-creation` (parent-scoped slug). Design doc §3.3 step file template uses `name: company-research-<wave>-<stepN>` matching parent prefix to prevent collision.

### [x] #4 Resolve Sanitizer scope ambiguity for Steps 11–17
**Why:** Steps 11–17 are Wave 1 Workers. Sanitizer runs between Wave 2 and Wave 3. Their outputs reach final report WITHOUT scan — silent injection-defense regression.
**Fix:** Sanitizer scans Wave 1+2 outputs (all 17) before Wave 3 AND before assembly. Document explicitly.
**Where:** Design doc §3 (mode dispatch), `references/sanitizer.md`
**Resolution notes:** Design doc now has "Sanitizer scope (explicit)" section with two-gate table: Gate 1 = before Wave 3 spawn (all Wave 1+2 outputs, all 17 steps), Gate 2 = before final assembly (Wave 3 synthesis outputs). No untrusted content reaches the final report unscanned.

### [x] #5 Specify Wave 2/3 spawn prompt contract
**Why:** Wave 2 needs Step 6+8 outputs; Wave 3 needs sanitized 2–9. Design references "Spawn prompt template" but never specifies data-threading contract.
**Fix:** Define output envelope: `{ step: N, status: APPROVED|RETRY_EXHAUSTED, data, sources, confidence }`. Wave coordinator inlines prior outputs into Worker spawn prompts. Document in each `waveN/SKILL.md` template.
**Where:** Design doc §3.3 wave coordinator structure, new "Output envelope" section
**Resolution notes:** Design doc has "Output envelope (universal)" JSON schema: `{step, status, data, sources, confidence, notes}`. Each `waveN/SKILL.md` coordinator template inlines prior-wave envelopes into spawn prompts verbatim. Status enum: `APPROVED | RETRY_EXHAUSTED`.

---

## HIGH — Fix before deployment

### [x] #6 Relocate Step 15 out of `output/`
**Why:** Step 15 is a Worker step with Checker/retry, not a static template. `output/` is for templates only.
**Fix:** Move to `wave3/step15-bd-briefing/SKILL.md`. Update wave3 coordinator to include it.
**Where:** Design doc file tree + §3 mode dispatch
**Resolution notes:** File tree updated: `wave3/step15-bd-briefing/SKILL.md` added; `output/step15-bd-briefing.md` removed. Wave 3 coordinator now spawns 3 workers (steps 10, 14, 15) instead of 2.

### [x] #7 Define timeouts (per-wave, per-Worker)
**Why:** "Reasonable timeout" referenced but never quantified. Hung Worker blocks indefinitely.
**Fix:** Wave 1 = 25 min, Wave 2 = 10 min, Wave 3 = 10 min, per-Worker = 8 min. Document in `references/orchestrator.md`.
**Where:** Design doc Hard-Fail section, `references/orchestrator.md`
**Resolution notes:** "Timeouts (authoritative)" table added: Wave 1 = 25 min, Wave 2 = 10 min, Wave 3 = 10 min, per-Worker = 8 min, Sanitizer = 3 min. Hung worker → orchestrator records `RETRY_EXHAUSTED` and applies error budget.

### [x] #8 Define error budget for RETRY_EXHAUSTED
**Why:** Run continues regardless of how many steps exhaust retries. Currently no threshold.
**Fix:** ≤3 RETRY_EXHAUSTED in Wave 1 = proceed; >3 = halt with "Preliminary Report — too many data gaps, do not use for BD outreach."
**Where:** Design doc Hard-Fail section
**Resolution notes:** "Error budget (RETRY_EXHAUSTED threshold)" section: 0–3 exhausted across all waves → proceed with `[DATA GAP]` markers; >3 → HARD-FAIL with "PRELIMINARY REPORT — too many data gaps, DO NOT USE for BD outreach" banner at top of report.

### [x] #9 Define rollback path
**Why:** If tree deployment fails in production, BD ops have no documented recovery.
**Fix:** Keep monolith on `main` branch as `company-research-legacy/SKILL.md` for one release cycle. README documents `npx skills add KServe-FMS/skills --skill company-research-legacy` as rollback.
**Where:** Design doc, README, repo structure
**Resolution notes:** "Rollback Path" section added. `company-research-legacy/SKILL.md` retains the 1,295-line monolith for one release cycle. README install snippet: `npx skills add KServe-FMS/skills --skill company-research-legacy`.

### [x] #10 Add output schema registry
**Why:** cold-email hardcodes step section names. No machine-checkable schema = silent drift.
**Fix:** `company-research/output-schemas.json` with formal field definitions per step. Validation script in `scripts/validate-output.ts` checks against registry. cold-email reads registry on load.
**Where:** Design doc Architecture + new file
**Resolution notes:** File tree adds `company-research/output-schemas.json` + `scripts/validate-output.ts`. Schema defines per-step field names, types, required flags. cold-email skill consumes registry instead of hardcoded section names. Drift caught at CI.

### [x] #11 Enforce trust-boundary preamble per step
**Why:** Future step files can be added without the "Content trust boundary" preamble — silent injection-defense regression.
**Fix:** Lint script: grep every `stepN/SKILL.md` for preamble line. Fail CI if missing. Document requirement in step-file template.
**Where:** Design doc Acceptance Criteria, new CI lint
**Resolution notes:** `scripts/lint-trust-preamble.sh` added to file tree. Step canonical template has trust-boundary preamble as rule #2. CI fails if any `*/SKILL.md` under `wave[1-3]/step*/` is missing the preamble line.

### [x] #12 Persist sanitized state on mid-run failure
**Why:** Sanitized Wave 2 outputs lost if Wave 3 spawn fails. Resume re-runs Sanitizer on non-deterministic web search results.
**Fix:** Persist sanitized outputs + run-ID to session state before Wave 3 spawn. Resume re-uses cached.
**Where:** Design doc Architecture, `references/orchestrator.md`
**Resolution notes:** "State persistence (mid-run resume)" section. Orchestrator writes `{run-id, sanitized-outputs, wave-status}` to session state after Sanitizer gate 1. On resume, sanitized cache is re-used; only Wave 3 re-spawns.

### [x] #13 Concurrent run safety via run-ID
**Why:** Two BD ops on same company simultaneously could cross-contaminate via resume detection.
**Fix:** Scope resume cache by run-ID. Resume only matches its own run-ID; otherwise start fresh.
**Where:** Design doc Architecture
**Resolution notes:** `run-id = sha1(company-name + ISO date + user-handle)`. Resume cache keyed by run-ID. Two concurrent runs on same company produce distinct run-IDs (different user-handle); no cross-contamination.

### [x] #14 Split sequential read-chain into phases
**Why:** 21 sequential reads — agent may reorder, skip, or stop early.
**Fix:** Split into 3 phases with explicit checkpoints. ≤7 reads per phase. Agent confirms each phase complete before next.
**Where:** Design doc §6 sequential mode
**Resolution notes:** §6 restructured into Phase A (foundation: 2 reads + checkpoint), Phase B (17 step reads with inline checker, broken into 3 chunks of ≤7 with checkpoint between), Phase C (synthesis: 5 reads + checkpoint). Agent must emit `PHASE [A|B|C] COMPLETE` confirmation before continuing.

---

## MEDIUM — Address during implementation

### [x] #15 Document Checker invocation in sequential mode
**Why:** Parallel uses checker-criteria.md via wave coordinator. Sequential mode never specifies where Checker runs.
**Fix:** Document inline-checker behavior in §6 — after each step read, agent applies checker-criteria.md before streaming the section.
**Where:** Design doc §6
**Resolution notes:** "§6 Checker note (sequential mode)" added. After each step file read in Phase B, agent applies the 8 checker criteria inline (no spawn) before emitting the step's section. Retry budget = 2 per step, same as parallel mode.

### [x] #16 Harden scripts/ injection surface
**Why:** If Worker reads file path from web content and executes, that's an injection vector.
**Fix:** Step 10B hardcodes absolute script path. Never derives from sources or user input.
**Where:** `wave3/step10b-icp-score/SKILL.md` (future), design doc note
**Resolution notes:** Step 10B template hardcodes `scripts/icp-score.ts` as literal path. Design doc "Step-specific input hardening" forbids deriving any executable path from web content or upstream output. Step canonical template rule #4 enforces this.

### [x] #17 Sanitize director names as data, not paths
**Why:** Crafted director name like `../../etc/passwd` could confuse downstream parsing.
**Fix:** Step 6 strips path patterns from names before output. Treat all extracted names as descriptive text only.
**Where:** `wave1/step6-directors/SKILL.md` (future), design doc note
**Resolution notes:** Step 6 template strips `/`, `\`, `..`, control chars from extracted names before emitting. Output envelope `data.directors[]` is descriptive text only — never used as path component or shell argument.

### [x] #18 Re-check Wave 3 synthesis output for injection
**Why:** Synthesis could amplify near-injection patterns Sanitizer's regex missed.
**Fix:** Spawn prompt for Wave 3 includes "after synthesis, run checker criterion #8 on your own output."
**Where:** Design doc, `wave3/SKILL.md` template
**Resolution notes:** Wave 3 spawn prompt template appends "After synthesis, apply checker criterion #8 (no injection-like instructions) to your own output before returning." Plus Sanitizer gate #2 scans all Wave 3 outputs before assembly. Defense-in-depth.

### [x] #19 Machine-checkable dependency graph
**Why:** Adding Step 18 next quarter risks cycles/orphans.
**Fix:** `company-research/dependencies.yaml` DAG with validation script. Run at skill init.
**Where:** New file + design doc reference
**Resolution notes:** File tree adds `company-research/dependencies.yaml` + `scripts/validate-deps.sh`. Validation runs at CI; detects cycles, orphans, dangling refs. Adding a step requires updating both the YAML and the wave coordinator.

### [x] #20 Step-addition checklist
**Why:** Adding new step requires manual updates in N files; omissions silent.
**Fix:** `company-research/ADD_STEP.md` with worked example + scaffolding script.
**Where:** New file + design doc reference
**Resolution notes:** File tree adds `company-research/ADD_STEP.md`. Documents the 7 touchpoints: wave dir, step subdir, coordinator spawn list, `dependencies.yaml`, `output-schemas.json`, sequential mode §6 chunk, sanitizer scope list. Worked example walks through adding Step 18.

### [x] #21 Backward compatibility trigger test
**Why:** Main shrinking 1,295 → 200 lines may shift skill trigger matching.
**Fix:** Acceptance test: "research [company]" triggers correctly on each target platform. Document in design.
**Where:** Design doc Acceptance Criteria
**Resolution notes:** Acceptance Criteria adds "Trigger-matching test": phrase "research [company]" + "intel on [company]" must select `company-research` (not legacy, not cold-email) on Claude Code, OpenCode, Codex, Claude.ai. New main SKILL.md description preserves all original trigger keywords.

### [x] #22 Wave-coordinator extensibility documentation
**Why:** Pattern assumes 3 waves final; adding Wave 4 procedure unclear.
**Fix:** Document extension procedure: new coordinator file, new dispatch entry in main, sanitizer gate positioning.
**Where:** Design doc new "Extensibility" section
**Resolution notes:** "Extensibility (adding Wave 4 or new steps)" section documents: (a) new `wave4/SKILL.md` coordinator following waveN template, (b) main SKILL.md dispatch entry added in mode-table, (c) sanitizer gate inserted before Wave 4 spawn AND before final assembly, (d) `dependencies.yaml` + `output-schemas.json` updated.

---

## Execution order

Sequence chosen to respect dependencies — foundational verifications first, then content updates.

1. #1 — verify `> Read` (blocks all writes if invented)
2. #2 — npm glob (independent, quick)
3. #3 — sub-skill names (affects every future step file)
4. #4 — Sanitizer scope (design decision)
5. #5 — spawn prompt contract (design decision)
6. #6 — Step 15 placement (structural)
7. #7 → #14 — design doc updates (timeouts, error budget, rollback, schemas, etc.)
8. #15 → #22 — implementation specifics + acceptance criteria

After all checked: confirm with user → delete this file.
