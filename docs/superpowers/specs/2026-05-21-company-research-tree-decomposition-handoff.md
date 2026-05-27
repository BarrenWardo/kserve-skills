# Handoff — Company Research Tree Decomposition

**Last updated:** 2026-05-21
**Branch:** `feat/company-research-tree`
**Last commit:** `0b4d5fe` (pushed to `BarrenWardo/kserve-skills`)

---

## Status

**Phase:** Design complete. Ready for implementation plan.

**Pipeline position:** Phase 2 (Planning) → about to begin Phase 4 (Task List) via `superpowers:writing-plans`. Phase 3 (Annotation) closed — all 22 review issues addressed and tracker deleted.

---

## What's Done

- Design doc: `docs/superpowers/specs/2026-05-21-company-research-tree-decomposition-design.md`
- All 22 review issues (CRITICAL / HIGH / MEDIUM) resolved and committed:
  - `6e95bf1` — initial design + 22 issues addressed
  - `28894fd` — Worker self-sanitization (3rd defense layer)
  - `a1fc0c6` — two-timer per-Worker timeout
  - `bea81bf` — #8 error budget >5; #10 schema registry reframed internal-only
  - `757ccbb` — #13 reframed: single-tenant resume w/ explicit user prompt
  - `0b4d5fe` — tracker deleted

---

## Next Action

Invoke `superpowers:writing-plans` skill to produce the implementation plan from the design doc. The plan should:

- Translate design doc sections into ordered build phases.
- Decompose the 1,295-line monolith `company-research/SKILL.md` into the file tree specified in design doc §File Layout.
- Sequence sub-skill creation (parent SKILL.md, wave coordinators, 17 step files, reference files, scripts, schema registry, dependency YAML).
- Identify acceptance test runs needed (per design doc §Acceptance Criteria).
- Flag any pre-implementation prerequisites (env setup, test company list, platform access for trigger tests).

---

## Key Design Decisions (Carry Forward)

### Architecture
- **Tree topology:** parent `company-research/SKILL.md` + 3 wave coordinators + 17 step sub-skills + reference files.
- **Parallel mode** (Claude Code / OpenCode / Codex): Task tool spawns Workers per step; wave coordinators gate handoffs.
- **Sequential fallback** (Claude.ai): single-agent execution in 3 phases (A: foundation, B: 17 step reads in chunks ≤7, C: synthesis) with `PHASE [A|B|C] COMPLETE` checkpoints. Inline checker after each step in Phase B.

### Safety / Production
- **Three-layer injection defense:** Worker self-sanitize + Sanitizer gate #1 regex on Wave 1+2 + Sanitizer gate #2 + Checker #8 on Wave 3.
- **Two-timer per-Worker timeout:** no-progress 2-min primary + 8-min wall-clock backstop.
- **Hard-fail when subagent tools missing** (no silent mid-run degradation).
- **Error budget:** 0–5 `RETRY_EXHAUSTED` proceed; >5 → HARD-FAIL with `PRELIMINARY` banner. Acceptance test uses 6.
- **Trust-boundary preamble** required at top of every step file. Lint-enforced via `scripts/lint-trust-preamble.sh`.
- **Schema registry (`output-schemas.json`):** INTERNAL ONLY — used by parent, wave coordinators, Workers for envelope validation. NOT a cross-skill contract. Cold-email and sibling skills parse rendered Markdown defensively. Explicitly out of scope: cold-email/sibling integration via schema.
- **Dependency DAG (`dependencies.yaml`):** validated by `scripts/validate-deps.sh` at CI. Detects cycles, orphans, dangling refs. Adding a step requires updating both YAML and wave coordinator.

### State / Resume
- **Single-tenant deployment model:** each employee = own AI plan = own filesystem. Cross-user contamination impossible by construction.
- **Disk-cache state persistence:** `company-research/.state/<run-id>.json`. Sanitized Wave 1+2 outputs persisted before Wave 3 spawn.
- **Run-ID formula:** `sha1(canonical-company-name + start-timestamp-ISO8601)`. No user-handle. Start-timestamp (not date) prevents collision between stale partial and deliberate fresh runs same day.
- **Resume UX:** orchestrator at §3 scans `.state/`, prompts `"Found in-progress run for <company> started at <HH:MM> (completed through <last_wave>). Resume? [y/n]"`. Yes → load cache. No → discard, start fresh.
- **24h TTL:** cross-day resume not supported. Forces conscious re-run.

### Rollback
- `--skill company-research-legacy` installs pre-decomposition behavior on a fresh machine. Verified in acceptance criteria.

---

## Open Items Worth Flagging in the Plan

- **#21 trigger-matching test currently covers 3 platforms** (Claude Code / OpenCode / Codex). Claude.ai is the sequential-mode platform per §6 but not listed in the trigger probe matrix. User accepted as-is ("satisfied with all issues & fixes"). Consider whether to add Claude.ai as a 4th probe row during implementation, or defer to post-deploy verification.

---

## Standing Constraints (User Verbatim)

- "This is a production grade skill, once deployed it can be a massive disaster if it doesn't work properly."
- "Hard-fail when subagent tools missing (no silent mid-run degradation)."
- CLAUDE.md Prime Directive: "Never produce final output until the human has reviewed and approved a written plan."

---

## Recovery / Environment Notes

- **GateGuard hook bypass** (if fact-forcing gate blocks legitimate edits):
  `ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force,pre:bash:gateguard-fact-force,pre:write:gateguard-fact-force`
  or `ECC_GATEGUARD=off`.
- **Fork remote:** `fork` → `https://github.com/BarrenWardo/kserve-skills.git`
- **Upstream:** `KServe-FMS/skills`

---

## How to Resume

1. Open this file.
2. Open design doc: `docs/superpowers/specs/2026-05-21-company-research-tree-decomposition-design.md`.
3. Confirm `feat/company-research-tree` branch checked out and up to date.
4. Invoke `superpowers:writing-plans` to begin implementation plan.
