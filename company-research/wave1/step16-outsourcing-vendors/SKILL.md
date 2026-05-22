---
name: company-research-step16-outsourcing-vendors
description: >
  Internal worker for company-research Step 16 (Current Outsourcing Vendors). DO NOT invoke as a standalone skill.
  Invoked only by the parent wave coordinator with a spawn prompt. Triggering this skill
  outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 16 — Current Outsourcing Vendors

## Inputs

None.

## Instructions

Knowing which BPO vendors are already embedded changes the pitch angle from "you need this" to "here's why KServe is better."

**Sources (try in order):**
1. News: `"[company name]" "outsourcing" OR "BPO" OR "vendor" OR "BPO partner"` — ET, Mint, Business Standard
2. Job postings from Step 7B: scan JD language for "coordinate with outsourcing vendor," "manage BPO partner," "work with third-party vendor"
3. LinkedIn company updates / press releases on company website
4. General search: `"[company name]" "call center partner" OR "back office partner" OR "collections agency"`

**Find:**
- Named outsourcing/BPO vendors already in use
- Functions being outsourced (CS, collections, back-office, lead gen, etc.)
- Any indication of contract vintage (fresh engagement vs. long-standing)
- If no vendor found: explicitly state "No outsourcing vendor relationships found in public record"

**BD framing rules:**
- No vendor found → greenfield; pitch as first mover, zero displacement risk
- Competitor BPO vendor found → displacement pitch; lead with KServe's AI differentiation and cost-per-transaction comparison
- Non-BPO vendor found (in-house only, freelance) → expansion pitch; they've started outsourcing, KServe can professionalize it
- KServe-adjacent industry client found → name-drop the relevant case study in outreach

**Worker note:** If no results found after all 4 source attempts, explicitly state "No outsourcing vendor relationships found in public record" — do not infer absence from general company maturity signals.

## Output schema

See `schemas.step-16` in `company-research/output-schemas.json`. Fields summarized:
- `vendors_detected`: array of objects, each with `vendor`, `service`, `evidence`

## Output format

```
🏭 CURRENT OUTSOURCING VENDORS
Vendors detected:
  [Vendor name] — [function outsourced] — [source]
  [Or: "No outsourcing vendor relationships found in public record"]
BD signal: [greenfield / displacement / expansion angle — specific pitch implication]
Source(s): [URLs] | Confidence: HIGH/MED/LOW | Checked: YYYY-MM-DD
```
