---
name: bd-tracker-updater-org-creation
description: >
  Creates a new organisation (company prospect) in the KServe BD Tracker via webhook.
  Handles three input modes: company-research report in context, raw data provided by user,
  or no data (guided field-by-field collection).
---

# BD Tracker — Org Creation

Creates a new organisation entry in the KServe BD Tracker.

**Endpoint:** `POST https://n8n.kserve.dpdns.org/webhook/f50d69d1-edac-461b-8db3-0d8c81930e60`
**Auth:** None
**Content-Type:** `application/json`

---

## Field Reference

Before proceeding, read the field definitions:

> Read `bd-tracker-updater/org-creation/references/fields.md` now.

---

## Step 1: Detect Input Mode

Scan the current conversation context:

| Mode | Detection Signal | Action |
|---|---|---|
| **Research report** | Structured sections present — company name, turnover, directors, location from a company-research output | Extract fields from report → Step 2A |
| **Raw data** | User provided unstructured company details in their message | Extract fields from message → Step 2A |
| **No data** | User only said a trigger phrase with no company details | Ask field-by-field → Step 2B |

---

## Step 2A: Extract (Research Report or Raw Data)

1. Extract all 18 fields from context
2. Map extracted values to API field names (see `references/fields.md` — Extraction Mapping table)
3. Set `formType` = `"Company"` (always hardcoded)
4. Set any field not found in context to `"NA"`
5. Proceed to Step 3

---

## Step 2B: Guided Collection (No Data)

Ask for required fields in this order — one question at a time, wait for each answer:

1. "What is the company name?"
2. "What line of business? (e.g., NBFC, BFSI, eCommerce, Insurance, Healthcare)"
3. "Which BD Manager is handling this? (full name)"
4. "Does the company have a website? (Yes / No)"
5. If Yes → "What is the website URL?"
6. "What is the company's annual turnover in Crore? (number only, e.g., 10.3)"
7. "Which city is the company based in?"

After all required fields collected, ask once for optional fields:

> "Any additional details to add? (directors, branches, review, rating, KServe services to pitch, customer care number, social media, Tracxn rating, acquisitions info)
> Say 'skip' to submit with these fields as NA."

If user provides optional details: extract and map each one.
If user says 'skip': set all remaining optional fields to `"NA"`.

---

## Step 3: Show Pre-Submit Summary

Display before submitting:

```
Here's what I'll submit to the BD Tracker:

| Field             | Value |
|-------------------|-------|
| Company Name      | [companyName] |
| Line of Business  | [lob] |
| BD Manager        | [bdName] |
| Website Exists    | [websiteExist] |
| Website           | [website] |
| Turnover (Cr)     | [turnover] |
| Location          | [location] |
| Year in Existence | [yearInExistence] |
| Directors         | [nameOfDirectors] |
| Branches          | [numberOfCompanyBranches] |
| Review            | [Review] |
| Rating            | [rating] |
| Services          | [services] |
| Customer Care No. | [customerCareNumber] |
| Social Media      | [socialMedia] |
| Tracxn            | [Tracxn] |
| Acquisitions      | [acquisitions] |
| Form Type         | Company |

Submit? (yes / no / correct [field name])
```

- **yes** → validate then submit (Step 4)
- **no** → cancel
- **correct [field name]** → ask for the corrected value, update summary, re-display

---

## Step 4: Validate

Check all required fields before submitting.

Read `bd-tracker-updater/org-creation/references/fields.md` — Required Fields table — for exact validation rules.

If any required field is invalid: tell the user exactly which field and the rule it broke. Ask for correction. Re-display the summary. Do not submit until all required fields pass validation.

---

## Step 5: Submit

Construct the JSON payload using all 18 fields. See `bd-tracker-updater/org-creation/references/examples.md` for payload structure.

POST to:
```
https://n8n.kserve.dpdns.org/webhook/f50d69d1-edac-461b-8db3-0d8c81930e60
```

Headers:
```json
{
  "Content-Type": "application/json"
}
```

---

## Step 6: Handle Response

Read `bd-tracker-updater/org-creation/references/error-handling.md` for exact response handling.
