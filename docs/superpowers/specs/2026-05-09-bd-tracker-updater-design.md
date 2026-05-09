# BD Tracker Updater Skill — Design Spec

**Date:** 2026-05-09  
**Status:** Approved  
**Skill:** `bd-tracker-updater`

---

## Problem

KServe BD team needs to log company prospects into the BD Tracker via webhook API. Currently manual/ad-hoc. Need an agent skill that collects company data, validates it, and fires the API call.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Trigger mode | Standalone skill | Not integrated into company-research; called independently |
| Input mode | Detect and adapt | Works with research report context, raw data dump, or no data (guided) |
| Required fields | 8 must have real data | companyName, lob, bdName, formType, websiteExist, website, turnover, location |
| Optional fields | Default to "NA" | All remaining 10 fields sent as "NA" if unavailable |
| formType | Always "Company" | Hardcoded — fixed value for this API |
| File structure | Multi-file (postmark pattern) | Router SKILL.md + sub-skill per API + references/ — prevents context overload |

---

## File Structure

```
bd-tracker-updater/
├── SKILL.md                        ← router: trigger phrases, API index, routing
└── org-creation/
    ├── SKILL.md                    ← full BD org creation flow
    └── references/
        ├── fields.md               ← all 18 fields with types, required/optional, validation
        ├── examples.md             ← sample payloads (complete + partial with NA)
        └── error-handling.md       ← 200/300 response handling
```

---

## API Reference

**Endpoint:** `POST https://n8n.kserve.dpdns.org/webhook/f50d69d1-edac-461b-8db3-0d8c81930e60`  
**Auth:** None  
**Content-Type:** `application/json`  
**Success:** HTTP 200 → "Company saved successfully"  
**Error:** HTTP 300 → error state

---

## Top-Level SKILL.md (`bd-tracker-updater/SKILL.md`)

**Purpose:** Thin router. Describes available BD Tracker APIs. Routes agent to correct sub-skill.

**Contains:**
- Trigger phrases: "add to BD tracker", "save company", "log this company", "update BD form", "record in BD", "submit to tracker", "push to tracker"
- API index table: API name | sub-skill | when to use
- Routing rules: phrase → sub-skill name

**Does NOT contain:** field definitions, validation logic, payload structure.

---

## Org Creation Sub-Skill (`bd-tracker-updater/org-creation/SKILL.md`)

**Purpose:** Full implementation for the BD Company Form API.

**Flow:**

```
Invoked → Detect input mode
    ├── Research report in context  →  extract all matchable fields
    ├── Raw data provided           →  extract all matchable fields
    └── No data                     →  ask required fields one by one
          ↓
    Show extracted/collected fields as prefilled summary
    Ask user to confirm or correct
          ↓
    Validate required fields (non-empty, correct types)
    Fill "NA" for any optional field not provided
          ↓
    Show full payload preview → "Submit? (yes/no)"
          ↓
    POST to webhook
    Report result
```

**Input detection rules:**
- Research report = look for structured sections with company name, turnover, directors, location, etc.
- Raw data = unstructured text mentioning company details
- No data = user only said "add company" with no details

**Directs agent to load references:**
- `Read references/fields.md` — for field definitions and validation rules
- `Read references/examples.md` — for payload structure reference
- `Read references/error-handling.md` — on error response

---

## Fields Reference (`references/fields.md`)

### Required Fields (must have real data before submitting)

| Field | Type | Validation |
|---|---|---|
| `companyName` | String | Non-empty |
| `lob` | String | Non-empty (e.g., NBFC, BFSI, eCommerce) |
| `bdName` | String | Non-empty — BD Manager's name |
| `formType` | String | Always `"Company"` — hardcoded, never ask user |
| `websiteExist` | String | Must be `"Yes"` or `"No"` (case-insensitive input, normalize on submit) |
| `website` | String | Required if websiteExist = "Yes"; skip if "No" |
| `turnover` | Decimal | Must parse as number (in Crore, e.g., 10.3) |
| `location` | String | Non-empty city name |

### Optional Fields (send "NA" if unavailable)

| Field | Type | Description |
|---|---|---|
| `yearInExistence` | String | Years since establishment (e.g., "23") |
| `nameOfDirectors` | String | Director names, comma-separated |
| `numberOfCompanyBranches` | String | Count of branches |
| `Review` | String | Company/product review text |
| `rating` | String | Rating (e.g., "4.5 on Google") |
| `services` | String | KServe services to pitch (e.g., "Customer Service, AI Bot") |
| `customerCareNumber` | String | Company's customer care number |
| `socialMedia` | String | Social media follower info |
| `Tracxn` | String | Tracxn rating if available |
| `acquisitions` | String | Acquisition info or "No" |

---

## Examples Reference (`references/examples.md`)

Two examples:
1. **Complete payload** — all 18 fields with real data (from the API docs sample)
2. **Partial payload** — 8 required fields filled, optionals as "NA"

---

## Error Handling Reference (`references/error-handling.md`)

| HTTP Code | Meaning | Agent action |
|---|---|---|
| 200 | Success | Confirm: "Company [name] saved to BD Tracker successfully." |
| 300 | Error | Report error, show payload that was sent, offer to retry or correct data |
| Network error | Unreachable | Report connection failure, suggest retrying or checking URL |

---

## Trigger Phrases

```
add [company] to tracker
save to BD tracker
log this company
update BD form
record in BD
submit to tracker
push to tracker
bd-tracker-updater
```

---

## Out of Scope

- Integration with company-research (standalone only in v1)
- Authentication (API is public)
- Batch submission (one company per invocation)
- Edit/update existing records (this API is create-only)
