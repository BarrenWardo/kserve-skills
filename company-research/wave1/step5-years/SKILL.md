---
name: company-research-step5-years
description: >
  Internal worker for company-research Step 5 (Years in Existence). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 5 — Years in Existence

## Inputs

None.

## Instructions

Find the incorporation / founding year. Calculate age from today.

## Output schema

See `schemas.step-5` in `company-research/output-schemas.json`. Fields summarized:
- `years_in_existence`: integer years since founding (nullable)
- `founded_year`: integer founding year (nullable)

## Output format

```
📅 YEARS IN EXISTENCE
[Founded XXXX | X years old]
Source(s): [URL] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
