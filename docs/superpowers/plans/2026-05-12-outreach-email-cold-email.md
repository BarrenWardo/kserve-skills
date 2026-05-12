# Outreach Email — Cold Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `outreach-email` skill suite with `cold-email` sub-skill to the KServe skills monorepo.

**Architecture:** Parent router at `outreach-email/SKILL.md` (following `apollo/SKILL.md` pattern) dispatches to `outreach-email/cold-email/SKILL.md` which contains the full workflow for generating personalized cold outreach emails from company research data.

**Tech Stack:** Markdown/YAML only. No build or test needed — pure skills standard.

---

### Task 1: Parent router (`outreach-email/SKILL.md`)

**Files:**
- Create: `outreach-email/SKILL.md`

- [ ] **Step 1: Create the directory and write the router SKILL.md**

```bash
mkdir -p /Users/jd/Downloads/skills/outreach-email
```

Content for `outreach-email/SKILL.md`:

```markdown
---
name: outreach-email
description: >
  Use when generating personalized outreach emails to decision-makers at a
  prospect company. Trigger on phrases like "write a cold email", "draft
  outreach", "generate email for [DM name]", "compose a personalized email",
  "send an email to the decision-maker", or any request to write an outreach
  email to a prospect. Uses company research data and DM contact details to
  craft tailored emails. Routes to the correct sub-skill based on the
  operation type.
---

# Outreach Email Skill Suite

Generates personalized outreach emails to prospect decision-makers using company research data and DM contact details. Part of the KServe BD pipeline: company-research → apollo (DM enrichment) → outreach-email → bd-tracker-updater.

## Sub-Skills

| Operation | Sub-Skill | Use When |
|---|---|---|
| **Cold Email** | `cold-email` | Sending a first-time cold outreach email to a prospect DM |

## Quick Routing

- **"Write a cold email to [company]"** → `cold-email`
- **"Draft outreach for [DM name]"** → `cold-email`
- **"Generate email for the decision-maker"** → `cold-email`
- **"Compose a personalized email to [company]"** → `cold-email`
- **"Cold email to the right person at [company]"** → `cold-email`

## Routing Instructions

When the user's request matches any Quick Routing phrase above:

1. Identify the correct sub-skill from the routing table
2. Read the sub-skill's `SKILL.md` from `outreach-email/<sub-skill>/SKILL.md`
3. Follow the sub-skill instructions exactly
```

- [ ] **Step 2: Commit**

```bash
git add outreach-email/SKILL.md
git commit -m "feat(outreach-email): add parent router SKILL.md"
```

---

### Task 2: Cold email sub-skill (`outreach-email/cold-email/SKILL.md`)

**Files:**
- Create: `outreach-email/cold-email/SKILL.md`

- [ ] **Step 1: Create the sub-skill directory**

```bash
mkdir -p /Users/jd/Downloads/skills/outreach-email/cold-email
```

- [ ] **Step 2: Write the cold-email sub-skill**

Content for `outreach-email/cold-email/SKILL.md`:

```markdown
---
name: cold-email
description: >
  Generate a personalized cold outreach email to the best-fit decision-maker
  at a prospect company. Requires company research data and DM contact details
  in context. Identifies the DM(s) with a verified email whose role is most
  relevant to the outsourcing decision, then drafts one tailored email per
  selected DM referencing company pain points, the DM's likely objections, and
  KServe's relevant services.
---

# Cold Email Generator

Generates tailored cold outreach emails to prospect decision-makers. Part of the KServe BD pipeline: company-research → apollo (DM enrichment) → outreach-email → bd-tracker-updater.

**Compatible with:** Claude.ai · Claude Code · Claude Desktop (MCP) · Cowork · OpenCode · Codex · Cursor · VS Code Agent · Any AI agent platform

---

## About KServe

KServe is an AI-powered Business Process Outsourcing (BPO) company headquartered in Thane, Maharashtra, India. KServe helps businesses grow and operate more efficiently by taking over key business functions — powered by integrated AI technology that delivers faster turnaround, higher accuracy, and better outcomes than traditional BPO.

### Services

| Service | What KServe does |
|---|---|
| **Lead Generation** | Identifies and sources potential customers for the client's sales pipeline |
| **Lead Qualification** | Evaluates leads to determine fit, intent, and readiness to buy — so the client's sales team focuses only on high-value prospects |
| **Customer Onboarding** | Manages the end-to-end process of welcoming and activating new customers on behalf of the client |
| **Staff Augmentation** | Provides trained, dedicated staff who work as an extension of the client's own team — without the overhead of in-house hiring |
| **Customer Service** | Handles inbound and outbound customer interactions across voice, chat, email, and other channels |
| **Back-Office Operations** | Takes over internal processing tasks — data entry, documentation, verification, and admin workflows |
| **Collection** | Manages payment follow-ups, outstanding dues, and recovery processes on behalf of the client |
| **Market Research** | Gathers competitive intelligence, customer insights, and market data to support the client's business decisions |

> All services can be augmented with KServe's AI technology — enabling automation, smarter routing, predictive insights, and higher throughput at lower cost.

### Target Industries

BFSI · NBFC · Banking & Securities · Insurance · eCommerce · Education / EdTech · Automobile · Energy & Utilities · Healthcare · Media & Entertainment · Real Estate · Retail · Manufacturing · Tours & Travel · Hospitality · Agriculture · Immigration · Accounting · Fintech · Food & Beverages · Supply Chain Management · Logistics

---

## Input Requirements

This skill requires the following in context before it can generate an email:

1. **Company research report** — specifically needs these sections:
   - Step 2 (Line of Business — industry context)
   - Step 3 (Turnover — scale/financial framing)
   - Step 6B (Decision-Maker Dossiers — role, background, likely objections)
   - Step 7B (Job Postings — hiring pressure signals)
   - Step 8 (Reviews & Reputation — complaint themes, pain point evidence)
   - Step 10 (KServe Services Fit — which services match)
   - Step 10B (ICP Score — priority tier)
   - Step 17 (Competitive Landscape — market pressure context)
2. **Contact details** — verified business emails for decision-makers (from Apollo people-enrichment or other source)

If these are not present in context, stop and ask the user to provide them before proceeding.

---

## Workflow

This skill is always **SEQUENTIAL** (single-thread). No parallel workers needed.

### Step 1 — Input verification

Scan the conversation context for a company-research report and DM contact details. Verify the required sections (above) are present.

- If both are present → proceed to Step 2
- If only the research report is present but no contact details → ask the user for DM emails
- If neither is present → ask the user to provide the company research report first

### Step 2 — DM selection

From the Decision-Maker Dossiers (Step 6B) and the contact details, identify DMs who meet **ALL** of these criteria:

1. Their role is relevant to an outsourcing decision:
   - **Service Owner** (e.g., Chief Customer Experience, Head of Operations) — highest relevance
   - **Cost Gatekeeper** (e.g., CFO) — medium relevance
   - **Final Decision-Maker** (e.g., MD/CEO) — medium relevance
   - **Distribution Stakeholder** (e.g., Chief Retail) — lower relevance unless pain matches
2. They have a **verified business email** in the provided contact details
3. Their likely objection (from Step 6B dossiers) can be addressed by one of KServe's services

Use the recommended outreach sequence from the report (Step 15) as a tiebreaker. Prefer the person closest to the operational pain (service owner) over the final decision-maker — a warm handoff from the operational lead carries more weight.

Select the best **1–2 candidates**. If none qualify, explain why and suggest next steps.

### Step 3 — Email drafting

For each selected DM, generate a tailored cold email with the following structure:

**Subject line** — Specific to the DM's role and the company's most relevant pain point. Must earn an open. Examples:
- "ICICI Lombard's claims resolution — a process partnership worth 15 minutes"
- "[Company]'s [pain point] — how we solve it for BFSI companies"

**Opening** — Reference their specific role and a concrete recent company achievement or context. Shows genuine research, not a blast. Example:
> "Sanjeev, ICICI Lombard's 17% GWP growth this year is impressive — and your cloud migration shows the organisation isn't afraid to restructure how work gets done."

**Pain point** — The most relevant problem from the report that falls under this DM's purview. Be specific: cite numbers (complaint counts, open roles, churn rates, complaint themes). Not generic. Example:
> "But 3,500+ consumer complaints about claim settlement delays and 200+ unanswered customer calls are a brand risk that scales with growth."

**KServe positioning** — The matching service from Step 10 (KServe Fit), framed as solving that specific pain point. Include relevant detail about KServe's approach. Do not use generic BPO claims. Example:
> "KServe handles claims processing and customer service for BFSI companies. We combine AI-powered triage with trained ops teams so claims move faster and CS backlogs clear — without you needing to build more internal capacity."

**Objection handling** — Directly pre-empt the DM's likely objection (from Step 6B). Diffuse it naturally within the narrative, not as a separate FAQ section. Examples:
- If objection is "we do things in-house": acknowledge their preference, suggest a small pilot
- If objection is "our metrics are already best-in-class": acknowledge their efficiency, frame as capacity scaling not replacement
- If objection is "service quality is core to our brand": acknowledge the brand promise, present the quality framework

**CTA** — Always reply-based only:
> "If this sounds relevant, reply and I'll share more details."

No calendar links, no call booking, no website CTAs, no PDF attachments.

### Step 4 — Quality check (self-review before output)

Before presenting the email, verify it meets these criteria:
- [ ] References the DM's specific role and responsibility
- [ ] References a concrete, verifiable pain point from the report (with numbers where available)
- [ ] Positions the relevant KServe service as the solution
- [ ] Addresses the DM's likely objection
- [ ] Ends with a reply-only CTA (no links, no bookings)
- [ ] Feels like it was written for one person, not from a template

If any check fails, revise the email before output.

---

## Output Format

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

---

## Example

Given the ICICI Lombard company research report and these verified emails:
- sanjeev.mantri@icicilombard.com (MD & CEO)
- gopal.balachandran@icicilombard.com (CFO)
- anand.singhi@icicilombard.com (Chief Retail & Government)

### DM selection

1. **Girish Sehgal** — best role match (Customer Experience & Operations) but **no verified email** → excluded
2. **Sanjeev Mantri** — final decision-maker, has verified email, objection ("we do things in-house") addressable with pilot framing → selected
3. **Gopal Balachandran** — cost gatekeeper, has verified email, objection ("expense ratios are best-in-class") addressable → could be secondary
4. **Anand Singhi** — distribution stakeholder, lower relevance for CS/claims pain point → lower priority

**Result:** 1 email — Sanjeev Mantri.

### Output

```
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
[Your Name]
KServe

---
*Why this approach:* Sanjeev is the final decision-maker with a 28-year insurance background. The email acknowledges ICICI Lombard's strengths first, then leads with the #1 customer complaint, and pre-empts the in-house objection with a low-friction pilot CTA. No external links — everything is a reply away.
```

- [ ] **Step 3: Commit**

```bash
git add outreach-email/cold-email/SKILL.md
git commit -m "feat(outreach-email): add cold-email sub-skill with full workflow"
```

---

### Task 3: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add `outreach-email` to the Available Skills table**

Find the table in README.md and add a row after `apollo`:

```markdown
| `outreach-email` | Generates personalized cold outreach emails to prospect decision-makers using company research data and DM contact details |
```

- [ ] **Step 2: Add `outreach-email` usage section after the `apollo` section**

Append to README.md:

```markdown
## `outreach-email`

### How to use

Trigger after you have company research and DM contact details:

- `"Write a cold email to the right person at ICICI Lombard"`
- `"Generate outreach for the decision-maker at this company"`
- `"Draft a personalized email for [DM name]"`

The skill reads the company research and DM dossiers from context, identifies the best-fit decision-maker with a verified email, and drafts a personalized cold outreach email.

### What you need

A company research report (from `company-research` skill) and verified DM emails (from `apollo` skill).
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add outreach-email skill to README"
```
