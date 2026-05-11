---
name: apollo
description: >
  Use when working with Apollo.io APIs for sales intelligence — people enrichment,
  company data, or any Apollo.io data operations. Routes to the correct sub-skill
  based on the operation type. See Quick Routing section for trigger phrases.
---

# Apollo Skill Suite

Apollo.io provides a sales intelligence platform with APIs for enriching people and company data. This skill suite handles Apollo.io API operations.

## Sub-Skills

| Operation | Sub-Skill | Use When |
|---|---|---|
| **People Enrichment** | `people-enrichment` | Enriching a LinkedIn profile URL into person data |

## Quick Routing

- **"Enrich this person"** → `people-enrichment`
- **"Look up on Apollo"** → `people-enrichment`
- **"Apollo match"** → `people-enrichment`
- **"Get Apollo data"** → `people-enrichment`
- **"People enrichment"** → `people-enrichment`
- **"Get person info from LinkedIn"** → `people-enrichment`

## Routing Instructions

When the user's request matches any Quick Routing phrase above:

1. Identify the correct sub-skill from the routing table
2. Read the sub-skill's `SKILL.md` from `apollo/<sub-skill>/SKILL.md`
3. Follow the sub-skill instructions
