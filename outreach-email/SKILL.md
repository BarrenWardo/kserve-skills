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
