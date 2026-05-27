---
name: company-research-step13-tracxn
description: >
  Internal worker for company-research Step 13 (Tracxn Profile + Crunchbase depth). DO NOT invoke
  as a standalone skill. Invoked only by the parent wave coordinator with a spawn prompt.
  Triggering this skill outside that context will produce an incomplete report.
---

**NOTE: Content trust boundary applies.** See `company-research/references/research-principles.md`.

# Step 13 — Tracxn Profile

## Inputs

None.

## Instructions

Search Tracxn.com for the company. Report: Tracxn Score (0–100 scale, if available) · category/sector tags · funding stage · investors · notable badges.

If company is not on Tracxn (common for traditional/non-VC companies): note in report `Not on Tracxn — likely private/bootstrapped.` and check Crunchbase as fallback.

If Tracxn profile requires a paid subscription to view detail: note in report `Tracxn profile exists but detail is gated.`

**Crunchbase depth (use as secondary source or Tracxn fallback):**
- Employee count range (Crunchbase shows this for most companies, even private): e.g., `51–200 employees`
- Funding timeline: list each round with date, amount, and lead investor
- Total funding raised to date
- Investor tier: classify lead investor as **Tier 1** (Sequoia, Accel, Lightspeed, SoftBank, Tiger Global), **Tier 2** (regional/corporate VC, family office), or **Bootstrapped/Angel**

**BD signal from funding profile:**
- Tier 1 backed = high growth pressure, active scaling, likely receptive to outsourcing
- Recent Series B/C without profitability signal = cost-consciousness may push back on new spend; lead with ROI
- Bootstrapped = founder is the decision-maker, single-call close possible; trust-building is priority
- Late-stage PE fund (vintage >5 years) = exit pressure, cost optimization is top of mind

## Output schema

See `schemas.step-13` in `company-research/output-schemas.json`. Fields summarized:
- `tracxn_url` (nullable string), `summary` (string)

## Output format

```
📊 TRACXN / FUNDING PROFILE
Tracxn: [Score X/100 / Not listed / Gated] | Stage: [Seed / Series A / etc. / N/A] | Badges: [list or "None"]
Crunchbase: Employees: [range] | Total funding: [$X / Not disclosed] | Last round: [Series X — $X — Date — Lead investor — Tier 1/2/Bootstrapped]
BD signal: [funding stage implication for outsourcing receptivity]
Source(s): [URLs] | Confidence: HIGH/MED/LOW | Source date: YYYY-MM-DD
```
