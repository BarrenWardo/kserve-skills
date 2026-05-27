---
name: company-research-step2-line-of-business
description: >
  Internal worker for company-research Step 2 (Line of Business). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 2 — Line of Business

## Inputs

None.

## Instructions

Find: industry, core products/services, business model (B2B / B2C / B2G), key customer segments.

## Output schema

See `schemas.step-2` in `company-research/output-schemas.json`. Fields summarized:
- `industry`: primary industry classification
- `subindustry`: more specific subindustry/sector
- `services_offered`: array of core products/services
- `bd_framing` (optional): one-line BD-framing summary

## Output format

```
📋 LINE OF BUSINESS
[Summary]
Source(s): [URL] | [URL] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
