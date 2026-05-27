---
name: company-research-step4-head-office
description: >
  Internal worker for company-research Step 4 (Head Office Location). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 4 — Head Office Location

## Inputs

None.

## Instructions

Find the primary registered office address. Cross-reference MCA registered address against company website — they sometimes differ. If different, report both: `Registered (MCA): [address] | Current operations (website): [address]`

## Output schema

See `schemas.step-4` in `company-research/output-schemas.json`. Fields summarized:
- `city`: head office city
- `country`: head office country
- `address` (nullable): full address string
- `region` (nullable): state/region

## Output format

```
📍 HEAD OFFICE
[Address]
Source(s): [URL] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
