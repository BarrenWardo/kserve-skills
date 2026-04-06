# Design: Company Research — Parallel Auto-Start

**Date:** 2026-04-06
**Skill:** `company-research/SKILL.md`
**Status:** Approved

---

## Problem

The current auto-upgrade detection block requires user confirmation before switching to PARALLEL mode. This creates unnecessary friction: on platforms where parallel tools are available, the user must reply to a prompt before research begins. The default also leans toward SEQUENTIAL ("if unsure, default to SEQUENTIAL"), which means any ambiguity keeps the slower mode active.

## Goal

When parallel tools are available, start in PARALLEL mode immediately — no confirmation required. Announce the mode to the user, then proceed. Only use SEQUENTIAL when tools are confirmed unavailable or the user explicitly requests it.

---

## Design

### Change 1 — Remove confirmation gate (lines 58–65)

**Current text:**
```
**Auto-upgrade detection.** Before starting any research run, test whether subagent tools (`Task`, `spawn_agent`, or platform equivalent) are available. If they are available and SEQUENTIAL was assumed or defaulted to, offer the user a choice before proceeding:

⚡ Parallel mode available. I can run 19 research workers across 3 waves (~3× faster).
Continue in SEQUENTIAL (current), or switch to PARALLEL?

Wait for confirmation. Never auto-switch without user confirmation. If the user doesn't respond or declines, continue in SEQUENTIAL.
```

**Replace with:**
```
**Auto-start detection.** Before starting any research run, test whether subagent tools (`Task`, `spawn_agent`, or platform equivalent) are available. If they are available, announce and immediately start PARALLEL mode — no confirmation required:

⚡ Parallel mode detected — running 19 workers across 3 waves (~3× faster).

Then proceed directly to spawning Wave 1 and posting the progress status board. Do not wait for user input.
```

### Change 2 — Update the default fallback rule (line 56)

**Current text:**
```
If unsure, default to **SEQUENTIAL** — it is always safe, just slower.
```

**Replace with:**
```
Use **SEQUENTIAL** only when: (a) subagent tools are confirmed unavailable on the platform, or (b) the user explicitly requests sequential mode. If unsure whether tools are available, attempt tool detection — default to SEQUENTIAL only if detection fails.
```

### Change 3 — Update the PARALLEL trigger line (line 67)

**Current text:**
```
**PARALLEL:** Spawn in three waves after user confirms.
```

**Replace with:**
```
**PARALLEL:** Announce mode and spawn in three waves immediately upon tool detection.
```

---

## What Does Not Change

- Progress status board format (lines 79–89) — posts after Wave 1 spawns, unchanged
- PARALLEL/SEQUENTIAL mode detection table — unchanged
- Wave structure (Wave 1 → Wave 2 → Sanitizer → Wave 3) — unchanged
- SEQUENTIAL mode execution — still fully functional when conditions require it
- Partial-run resume logic — unchanged

---

## Scope

Three targeted text replacements in `company-research/SKILL.md`. No structural changes to the skill.
