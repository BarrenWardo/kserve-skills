# Outreach Email Skill — Design Spec

## Overview

New skill suite `outreach-email` for KServe skills monorepo. First sub-skill: `cold-email` — generates personalized cold outreach emails to decision-makers at prospect companies, using company-research data and DM contact details from Apollo enrichment.

Pipeline position: `company-research` → `apollo` (DM enrichment) → **`outreach-email`** → `bd-tracker-updater`

## Directory Structure

```
outreach-email/
├── SKILL.md                    # Parent router — routes to sub-skills
└── cold-email/
    └── SKILL.md                # Cold email generator
```

No `package.json` changes needed — `files: ["*/"]` auto-includes `outreach-email/`.

## Parent Router (`outreach-email/SKILL.md`)

Pattern: match `apollo/SKILL.md` and `bd-tracker-updater/SKILL.md`.

- YAML frontmatter: name `outreach-email`, description covering email generation
- Context: brief description of the skill suite
- Sub-skills table with `cold-email` entry
- Quick routing table: trigger phrase → sub-skill
- Routing instructions: detect intent → read sub-skill SKILL.md → follow

## Sub-Skill (`outreach-email/cold-email/SKILL.md`)

### Purpose

Generate personalized cold outreach emails to decision-makers at a prospect company. The skill identifies the best-fit DM(s) with verified emails, then crafts tailored emails referencing the company's specific pain points, the DM's role and likely objections, and KServe's relevant services.

### Input Requirements

The skill requires the following in context:

1. **Company research report** — specifically needs these sections:
   - Step 2 (Line of Business — industry context)
   - Step 3 (Turnover — scale/financial framing)
   - Step 6B (Decision-Maker Dossiers — role, background, likely objections)
   - Step 7B (Job Postings — hiring pressure signals)
   - Step 8 (Reviews & Reputation — complaint themes, pain point evidence)
   - Step 10 (KServe Services Fit — which services match)
    - Step 10B (ICP Score — priority tier)
    - Step 15 (BD Intelligence Briefing — Section E: Next Best Action for recommended outreach sequence)
2. **Contact details** — verified emails for decision-makers (from Apollo people-enrichment or other source)

If these are not present in context, the skill asks the user to provide them before proceeding.

### Approach

Single-pass generation (Approach A from design). No checker gates or template slots — the LLM generates the email based on reasoning over the research data. This keeps the skill simple (~150 lines), flexible, and adapts to each unique prospect situation.

### Workflow Steps

1. **Input verification** — scan context for company-research report and DM contact details. If missing, stop and ask user to provide them.

2. **DM selection** — from the Decision-Maker Dossiers (Step 6B), identify DMs who meet ALL criteria:
   - Their role is relevant to the outsourcing decision (service owner, cost gatekeeper, or final decision-maker)
   - They have a verified business email in the contact details
   - Their likely objection can be addressed by KServe's services
    - Step 15, Section E (Next Best Action) should guide priority

   Select the best 1-2 candidates. If none qualify, explain why and suggest concrete next steps (e.g., re-run Apollo enrichment, manual LinkedIn lookup, deprioritise).

3. **Email drafting** — for each selected DM, generate a tailored cold email with these sections:
   - **Subject line** — specific to the DM's role and the company's pain point (not generic). Must earn an open.
   - **Opening** — reference their specific role and recent company context. Shows genuine research, not a blast.
   - **Pain point** — the most relevant problem from the report that falls under this DM's purview. Evidence specific: "3,500+ complaints about claim settlement delays" not "we heard you have some customer issues."
   - **KServe positioning** — the matching service from Step 10 (KServe Fit), framed as solving their specific pain point. Include relevant detail about KServe's approach, not generic BPO claims.
   - **Objection handling** — directly pre-empt the DM's likely objection from the dossier (Step 6B). Diffuse it naturally within the narrative, not as a separate FAQ section.
   - **CTA** — always reply-based only: "If this sounds relevant, reply and I'll share more details." No calendar links, no call booking, no website CTAs.

4. **Output presentation** — display each email with metadata.

### Email Quality Criteria (implicit — applied during drafting, not as a separate gate)

The email must:
- Reference the DM's specific role and responsibility
- Reference a concrete, verifiable pain point from the report
- Position the relevant KServe service as the solution
- Address the DM's likely objection
- End with a reply-only CTA
- Feel like it was written for one person, not a template

### Platform-Adaptive Execution

This skill is always **SEQUENTIAL** (single-thread). There are no parallel workers — email drafting is a reasoning task that benefits from full context. No PARALLEL mode needed.

### Output Format

If one DM qualifies:

```
## Email to: [DM Name] — [Role]
**To:** [email]
**Subject:** [subject line]

[Full email body — 3-4 paragraphs, no more than ~250 words]

---
*Why this approach:* [1-2 sentence rationale — why this DM was chosen, what pain point was targeted, why this angle was used]
```

If multiple DMs qualify, present them sequentially with a summary at top:

```
*Drafting emails for 2 decision-makers: [Name 1] → [service angle], [Name 2] → [service angle]*

## Email to: [Name 1] …
…
## Email to: [Name 2] …
```

### Example Output (ICICI Lombard — Sanjeev Mantri)

```
*Drafting emails for 1 decision-maker: Sanjeev Mantri → Claims processing & CS outsourcing*

## Email to: Sanjeev Mantri — MD & CEO
**To:** sanjeev.mantri@icicilombard.com
**Subject:** ICICI Lombard's claims resolution — a process partnership worth 15 minutes

Sanjeev,

ICICI Lombard's 17% GWP growth this year is impressive — and your cloud migration shows the organisation isn't afraid to restructure how work gets done.

But 3,500+ consumer complaints about claim settlement delays and 200+ unanswered customer calls are a brand risk that scales with growth. For a company built on "Nibhaye Vaade," every unresolved claim erodes the promise.

KServe handles claims processing and customer service for BFSI companies. We combine AI-powered triage with trained ops teams so claims move faster and CS backlogs clear — without ICICI Lombard needing to build more internal capacity. Our approach is tech-enabled, not headcount-heavy, so it fits the digital-first direction you've already set.

I know ICICI Group has historically preferred in-house operations. That's fair. What I'm suggesting is a small pilot — one process, measurable KPIs, 90 days. If it works, you scale. If it doesn't, there's no disruption.

If this sounds relevant, reply and I'll share a one-page pilot proposal tailored to ICICI Lombard's claims volume.

Best,
Rohit Sharma
rohit.sharma@kserve.co.in

---
*Why this approach:* Sanjeev is the final decision-maker and a 28-year insurance veteran. The email acknowledges ICICI Lombard's strengths first (growth, cloud leadership), then leads with the #1 customer complaint (claims), and directly pre-empts his likely objection ("we do things in-house"). The CTA is a low-friction reply request, not a commitment.
```

### What's NOT Included

- No follow-up email sequences (future scope)
- No warm intro / referral emails (future scope)
- No subject line A/B testing
- No tracking or analytics
- No integration with email sending platforms
- No PARALLEL execution mode

## README Update

Add to the Available Skills table in `README.md`:

```markdown
| `outreach-email` | Generates personalized cold outreach emails to prospect decision-makers using company research data and DM contact details |
```

And a usage section:

```markdown
## `outreach-email`

### How to use

Trigger after you have company research and DM contact details:

- `"Write a cold email to the right person at ICICI Lombard"`
- `"Generate outreach for the decision-maker at this company"`
- `"Draft a personalized email for [DM name]"`

The skill reads the company research and DM dossiers from context, identifies the best-fit decision-maker with a verified email, and drafts a personalized cold outreach email.
```

## Implementation Order

1. Create `outreach-email/SKILL.md` (parent router)
2. Create `outreach-email/cold-email/SKILL.md` (sub-skill)
3. Update `README.md`
4. Commit on new branch
5. Open PR
