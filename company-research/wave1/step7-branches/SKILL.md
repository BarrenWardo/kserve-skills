---
name: company-research-step7-branches
description: >
  Internal worker for company-research Step 7 (Branches & Offices). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 7 — Branches & Offices

## Inputs

None.

## Instructions

Find: total number of offices/branches/locations · key cities/states · any international presence.

## Output schema

See `schemas.step-7` in `company-research/output-schemas.json`. Fields summarized:
- `branches`: array of objects, each with `city`, `country` (required); `type` (optional, e.g., "HQ", "branch", "international")

## Output format

```
🗺️ BRANCHES & OFFICES
[X locations | Key cities]
Source(s): [URL] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
