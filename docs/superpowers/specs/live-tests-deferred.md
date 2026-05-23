# Live Execution Tests — Deferred to Manual Post-Deploy Verification

Date: 2026-05-23
Status: DEFERRED
Reason: These tests require live web search + fresh platform sessions that cannot be executed
from within this implementation environment.

---

## Task 27: Golden run #1 — Tata Consultancy Services (PARALLEL mode)

Manual steps:
1. Open a fresh Claude Code session.
2. Run: `research Tata Consultancy Services`
3. Capture final report to `docs/superpowers/specs/golden-run-tcs-tree.md`.
4. Capture `.state/<run-id>.json` to `docs/superpowers/specs/golden-run-tcs-state.json`.
5. Verify all 13 required sections present (no MISSING SECTION output from grep check).
6. Verify `last_wave_completed` = `wave3` in state cache.
7. Verify no `[STRIPPED:*]` in report body (only allowed in DATA QUALITY footer).

Worker context budget check (run regardless of golden run status):

```bash
wc -l company-research/wave1/step2-line-of-business/SKILL.md \
       company-research/references/research-principles.md \
       company-research/references/source-priority.md
```

Expected sum ≤ 200 lines. If > 200, HIGH-severity finding — note on PR.

---

## Task 28: Golden run #2 — Infosys (PARALLEL mode)

Manual steps: same as Task 27 with `research Infosys`.
Output files: `golden-run-infosys-tree.md`, `golden-run-infosys-state.json`.

---

## Task 29: Golden run #3 — Wipro (SEQUENTIAL mode)

Manual steps:
1. Force sequential mode via Option A (genuine sequential-only platform, e.g. `npx skills exec`)
   or Option B (temporarily edit §4 to skip to §6, run, then revert — NEVER commit).
2. Run: `research Wipro`
3. Capture to `docs/superpowers/specs/golden-run-wipro-sequential.md`.
4. Verify Phase A / Phase B / Phase C checkpoints visible in transcript.

---

## Task 30: Error-budget probe (synthetic 6 × RETRY_EXHAUSTED)

Manual steps:
1. Pick a small opaque private company with minimal public presence (or stub 6 web searches
   to return 0 results in a controlled harness).
2. Run `research <chosen-company>`. Watch cumulative RETRY_EXHAUSTED count.
3. At count > 5, skill MUST HARD-FAIL with banner:
   `Preliminary Report — too many data gaps`
   and mark the report `PRELIMINARY`.
4. Capture to `docs/superpowers/specs/error-budget-probe.md`.

Acceptance: if skill does NOT hard-fail at > 5, this is a CRITICAL finding — block merge and
revisit `company-research/references/orchestrator.md` §"Error budget".

---

## Task 31: Run-ID isolation probe

Manual steps:
1. Open two Claude Code sessions within 30 seconds of each other. In each, run `research Acme Corp`.
2. Run `ls -la company-research/.state/` — expect 2 cache files with different run-id hex strings.
3. Open both files — confirm `started_at` timestamps differ; neither references the other's run-id.
4. In a third session, run `research Acme Corp` — skill should emit canonical resume prompt:
   `Found in-progress run for Acme Corp started at <HH:MM> (completed through <wave>). Resume? [y/n]`
5. Capture state dir listing + resume prompt to `docs/superpowers/specs/run-id-isolation-probe.md`.

---

## Task 32: Sanitizer gate audit

Manual steps:
1. Add ephemeral instrumentation to top of `company-research/references/sanitizer.md`:
   `> [SANITIZER GATE FIRED — record this line to the run log]`
2. Run `research Tata Consultancy Services`. Capture full transcript.
3. Count: `grep -c "references/sanitizer.md" <transcript-file>` — expect exactly 2.
4. Revert the instrumentation line (`git checkout -- company-research/references/sanitizer.md`).
5. Capture read-count summary to `docs/superpowers/specs/sanitizer-gate-audit.md`.

Acceptance: count < 2 = CRITICAL finding (a gate was skipped).

---

## Notes

- Tasks 27–32 were deferred because they require live web searches and fresh platform sessions.
- The implementation (skill files, scripts, lint, DAG, schemas, README) is complete and
  all mechanical checks pass (Tasks 1–25).
- These tests MUST be completed before the `company-research-legacy` rollback skill is removed.
