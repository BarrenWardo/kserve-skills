---
name: bd-tracker-updater
description: >
  Use when saving or logging a company prospect to KServe's BD Tracker. Trigger on phrases
  like "add to BD tracker", "save company to tracker", "log this company", "record in BD",
  "submit company data", "update BD form", or "push to tracker". Routes to the correct
  sub-skill based on the operation type.
---

# BD Tracker Updater

KServe's BD Tracker is the central system for logging and tracking business development prospects. This skill suite handles all API operations against the BD Tracker system.

## Sub-Skills

| Operation | Sub-Skill | Use When |
|---|---|---|
| **Create organisation** | `org-creation` | Adding a new company prospect to the tracker |

## Quick Routing

- **"Add [company] to BD tracker"** → `org-creation`
- **"Save company to tracker"** → `org-creation`
- **"Log this company"** → `org-creation`
- **"Record in BD"** → `org-creation`
- **"Submit company data"** → `org-creation`
- **"Update BD form"** → `org-creation`
- **"Push to tracker"** → `org-creation`

## Common Setup

### Webhook Base URL

```
https://n8n.kserve.dpdns.org
```

### Authentication

No authentication required. All BD Tracker webhooks are publicly accessible.

## Routing Instructions

When the user's request matches any Quick Routing phrase above:

1. Identify the correct sub-skill from the routing table
2. Read the sub-skill's `SKILL.md` from `bd-tracker-updater/<sub-skill>/SKILL.md`
3. Follow the sub-skill instructions exactly
