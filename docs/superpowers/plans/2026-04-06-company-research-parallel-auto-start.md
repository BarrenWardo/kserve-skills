# Company Research — Parallel Auto-Start Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the parallel-mode confirmation prompt from `company-research/SKILL.md` so that when parallel tools are detected, the skill announces PARALLEL mode and begins immediately — no user confirmation required.

**Architecture:** Three targeted text replacements in a single Markdown file. No new files, no structural changes. The wave architecture, sanitizer gate, and progress status board are untouched.

**Tech Stack:** Markdown/YAML (skills repo — no build step, changes take effect immediately)

**Spec:** `docs/superpowers/specs/2026-04-06-company-research-parallel-auto-start-design.md`

---

### Task 1: Replace the default fallback rule (line 56)

**Files:**
- Modify: `company-research/SKILL.md:56`

Current line 56:
```
If unsure, default to **SEQUENTIAL** — it is always safe, just slower.
```

- [ ] **Step 1: Make the edit**

Replace line 56 with:

```
Use **SEQUENTIAL** only when: (a) subagent tools are confirmed unavailable on the platform, or (b) the user explicitly requests sequential mode. If unsure whether tools are available, attempt tool detection — default to SEQUENTIAL only if detection fails.
```

- [ ] **Step 2: Verify the change**

Open `company-research/SKILL.md` and confirm:
- Line 56 no longer contains "If unsure, default to **SEQUENTIAL**"
- The new text is present and reads exactly as above
- Surrounding lines (55 and 57) are unchanged (blank lines on both sides)

- [ ] **Step 3: Commit**

```bash
git add company-research/SKILL.md
git commit -m "feat(company-research): tighten SEQUENTIAL fallback — only use when tools unavailable or explicitly requested"
```

---

### Task 2: Replace the auto-upgrade detection block (lines 58–65)

**Files:**
- Modify: `company-research/SKILL.md:58-65`

Current text (lines 58–65):
```
**Auto-upgrade detection.** Before starting any research run, test whether subagent tools (`Task`, `spawn_agent`, or platform equivalent) are available. If they are available and SEQUENTIAL was assumed or defaulted to, offer the user a choice before proceeding:

```
⚡ Parallel mode available. I can run 19 research workers across 3 waves (~3× faster).
Continue in SEQUENTIAL (current), or switch to PARALLEL?
```

Wait for confirmation. Never auto-switch without user confirmation. If the user doesn't respond or declines, continue in SEQUENTIAL.
```

- [ ] **Step 1: Make the edit**

Replace the entire block (lines 58–65) with:

```
**Auto-start detection.** Before starting any research run, test whether subagent tools (`Task`, `spawn_agent`, or platform equivalent) are available. If they are available, announce and immediately start PARALLEL mode — no confirmation required:

```
⚡ Parallel mode detected — running 19 workers across 3 waves (~3× faster).
```

Then proceed directly to spawning Wave 1 and posting the progress status board. Do not wait for user input.
```

- [ ] **Step 2: Verify the change**

Open `company-research/SKILL.md` and confirm:
- "Auto-upgrade detection" is gone — replaced with "Auto-start detection"
- "offer the user a choice" is gone
- "Wait for confirmation. Never auto-switch without user confirmation." is gone
- "If the user doesn't respond or declines, continue in SEQUENTIAL." is gone
- The announcement reads: `⚡ Parallel mode detected — running 19 workers across 3 waves (~3× faster).`
- "Do not wait for user input." is present
- Line 67 (`**PARALLEL:** Spawn in three waves after user confirms.`) is still intact (will be changed in Task 3)

- [ ] **Step 3: Commit**

```bash
git add company-research/SKILL.md
git commit -m "feat(company-research): auto-start parallel mode on detection — remove confirmation gate"
```

---

### Task 3: Update the PARALLEL trigger line (line 67)

**Files:**
- Modify: `company-research/SKILL.md:67`

Current line 67:
```
**PARALLEL:** Spawn in three waves after user confirms.
```

- [ ] **Step 1: Make the edit**

Replace line 67 with:

```
**PARALLEL:** Announce mode and spawn in three waves immediately upon tool detection.
```

- [ ] **Step 2: Verify the change**

Open `company-research/SKILL.md` and confirm:
- "after user confirms" is gone
- Line reads: `**PARALLEL:** Announce mode and spawn in three waves immediately upon tool detection.`
- Line 68 (Wave 1 description) is unchanged

- [ ] **Step 3: Verify overall cohesion**

Read lines 49–91 of `company-research/SKILL.md` end to end and confirm:
- No remaining references to "user confirms", "Wait for confirmation", or "auto-switch" in this section
- The flow reads: detect tools → announce → spawn Wave 1 → post status board
- SEQUENTIAL fallback is still present and triggered only by tool absence or explicit user request
- The progress status board block (lines 79–89 approx) is untouched

- [ ] **Step 4: Commit**

```bash
git add company-research/SKILL.md
git commit -m "feat(company-research): update PARALLEL trigger line — spawn immediately on detection"
```
