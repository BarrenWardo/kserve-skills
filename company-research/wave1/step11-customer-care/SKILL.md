---
name: company-research-step11-customer-care
description: >
  Internal worker for company-research Step 11 (Customer Care Number). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 11 — Customer Care Number

## Inputs

None.

## Instructions

Find their publicly listed customer support / helpline number.

BD insight: presence of a published number signals a formal support structure. Absence may indicate underdeveloped customer ops — a potential KServe entry point. If no number is found, note in report: "No published support number found."

## Output schema

See `schemas.step-11` in `company-research/output-schemas.json`. Fields summarized:
- `customer_care_number` (nullable string), `support_email` (nullable string), `support_hours` (nullable string)

## Output format

```
📞 CUSTOMER CARE NUMBER
[Number or "Not published"] | Source(s): [URL] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
