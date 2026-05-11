# KServe Skills

> **Private repository.** Internal agent skills for KServe's BD team. Not for public distribution.

Agent skills for KServe's business development and sales intelligence workflows.
Compatible with Claude Code, Claude.ai, OpenCode, Codex, and any platform that supports the [skills](https://github.com/vercel-labs/skills) standard.

## Install

```bash
npx skills add KServe-FMS/skills
```

Install a specific skill:

```bash
npx skills add KServe-FMS/skills --skill company-research
npx skills add KServe-FMS/skills --skill bd-tracker-updater
npx skills add KServe-FMS/skills --skill apollo
```

## Available Skills

| Skill | Description |
|---|---|
| `company-research` | Researches a prospect company and produces a full BD intelligence report — turnover, directors, reviews, KServe fit assessment, and actionable outreach briefing |
| `bd-tracker-updater` | Saves a company prospect to KServe's BD Tracker via webhook — extracts fields from a research report, raw data, or guided collection; validates, previews, and submits |
| `apollo` | Calls Apollo.io APIs for sales intelligence — people enrichment from LinkedIn profile URLs via People Match API |

---

## `apollo`

### How to use

Trigger with a LinkedIn profile URL to enrich person data:

- `"Enrich this person: https://www.linkedin.com/in/username/"`
- `"Look up this person on Apollo"`
- `"Get Apollo data for this profile"`

The skill validates the URL, calls the Apollo.io People Match API, and returns the enriched person JSON.

### What you need

```
APOLLO_API_KEY=<your-apollo-io-api-key>
```

---

## `company-research`

### How to use

Once installed, just ask naturally in any supported AI platform:

- `"Research Reliance Retail for BD"`
- `"Look up Bajaj Finance — potential outsourcing client"`
- `"Do a BD profile for Zepto, their website is zepto.co"`
- `"Get me info on this company: www.meesho.com"`
- `"Check out HDFC Ergo for a KServe pitch"`

The skill confirms the right company with you first, then runs the full research automatically.

## What you get

A structured BD intelligence report covering 20 sections:

| Section | What it contains |
|---|---|
| ✅ Verification | Confirmed company identity before research begins |
| 📋 Line of Business | Industry, business model (B2B/B2C/B2G), key segments |
| 💰 Turnover | Revenue in ₹ Crores with financial year and MCA source |
| 📍 Head Office | Registered address (MCA) cross-referenced with operating address |
| 📅 Years in Existence | Incorporation year and company age |
| 👔 Directors | MCA-verified names, DINs, LinkedIn profiles, and BD-relevant decision-makers (★-flagged) |
| 🧑‍💼 Decision-Maker Dossiers | 3-line brief per ★-flagged director: background, LinkedIn activity, likely first objection |
| 🗺️ Branches & Offices | Location count, key cities, international presence |
| 💼 Job Postings | Active roles as outsourcing intent signals — functions hiring, KServe-relevant openings, BD signal |
| 🛠️ Technology Stack | CRM, support tool, review management tool, and marketing automation detected via BuiltWith/job postings |
| ⭐ Reviews & Reputation | Five sub-sections: Product reviews, Service reviews, Employee reviews, General reputation, and Review Handling Methodology — each with sentiment trend (Improving/Worsening/Stable) |
| 🎯 Overall Rating | Synthesized reputation score (1–10) with rationale and sample size caveat |
| 🤝 KServe Fit | 3–5 services ranked HIGH/MEDIUM fit with explicit evidence; excluded services noted with reason |
| 📈 ICP Score | Scored 0–100 across 10 dimensions; Tier 1–3 classification with recommended action |
| 📞 Customer Care | Published support number (or absence as a BD signal) |
| 📱 Social Media | Follower counts and platform-calibrated engagement signal |
| 📊 Tracxn / Funding Profile | Tracxn score, Crunchbase employee count, per-round funding timeline, investor tier classification |
| 🔀 M&A, Funding & Ownership | Recent acquisitions, PE ownership structure, GeM supplier status, fund vintage BD signal |
| 🧠 BD Briefing | Things to know, conversation starters, trigger signals, objection responses, and Next Best Action |
| 📝 Data Quality | Per-field confidence (HIGH/MED/LOW), source dates, data gaps |

Every data point includes a source URL and freshness timestamp. High-stakes fields (turnover, directors) are MCA-verified.

---

## `bd-tracker-updater`

### How to use

Trigger after a company-research report, with raw data, or with no data at all:

- `"Add this company to BD tracker"`
- `"Save Reliance Retail to BD tracker"`
- `"Log this company"` *(after a research report is in context)*
- `"Record in BD"`
- `"Push to tracker"`

The skill detects what data is already available, fills any gaps, shows a pre-submit summary, and fires the API only after you confirm.

### What you need

Set these env vars in your environment before using:

```
BD_Tracker_Base_URL=<your-n8n-instance-url>
BD_Tracker_Endpoint=<webhook-path>
```

### What it submits

18 fields per company:

| Field | Rule |
|---|---|
| Company Name | Required — non-empty |
| Line of Business | Required — must match 15-item approved list; case-insensitive input normalised on submit |
| Website | Required — main domain only (e.g. `kserve.co.in`); paths, `www.`, and trailing slashes stripped |
| Turnover (Cr) | Required — JSON number, latest year (e.g. `2.5`) |
| Location | Required — `"City, Country"` format |
| Year in Existence | Optional — numbers only |
| Directors | Optional — comma-separated names |
| Branches | Optional — count |
| Review | Optional — 1–2 sentence company overview |
| Rating | Optional — 1–2 sentence product/service rating |
| Services | Optional — KServe services to pitch |
| Customer Care No. | Optional — phone number |
| Social Media | Optional — `"Platform - XK Followers"` format |
| Tracxn | Optional — number only |
| Acquisitions | Optional — short pointers |
| BD Manager | Always `"VBDE"` — hardcoded |
| Form Type | Always `"Company"` — hardcoded |
| Website Exists | Always `"Yes"` — hardcoded |

Optional fields not available default to `"NA"` automatically.

## Adding New Skills

Drop a new directory with a `SKILL.md` file into this repo. The skills CLI will automatically discover it.

```
skills/
├── company-research/
│   └── SKILL.md
├── your-new-skill/      ← add here
│   └── SKILL.md
```

See [CHANGELOG.md](./CHANGELOG.md) for version history and [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Versioning

This repo follows semantic versioning:

| Bump | When to use |
|---|---|
| **Patch** (1.x.Y) | Typo fixes, instruction clarifications, Checker criteria wording |
| **Minor** (1.X.0) | New skills added, new sub-sections within an existing step, new Checker criteria, new output fields, new steps |
| **Major** (X.0.0) | Workflow restructuring, breaking changes to output format |
