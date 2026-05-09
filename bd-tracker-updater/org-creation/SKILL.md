---
name: bd-tracker-updater-org-creation
description: >
  Creates a new organisation (company prospect) in the KServe BD Tracker via webhook.
  Handles three input modes: company-research report in context, raw data provided by user,
  or no data (guided field-by-field collection).
---

# BD Tracker — Org Creation

Creates a new organisation entry in the KServe BD Tracker.

**Endpoint:** `$BD_Tracker_Base_URL$BD_Tracker_Endpoint`
**Auth:** None
**Content-Type:** `application/json`

| Variable | Description |
|---|---|
| `BD_Tracker_Base_URL` | Base URL of the n8n instance |
| `BD_Tracker_Endpoint` | Webhook path for org creation |

Set both in your environment before using this skill.

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

1. Extract 15 fields from context (3 are hardcoded — do not extract `formType`, `bdName`, `websiteExist`)
2. Map extracted values to API field names (see `references/fields.md` — Extraction Mapping table)
3. Hardcode these fields — never extract or ask user:
   - `formType` = `"Company"`
   - `bdName` = `"VBDE"`
   - `websiteExist` = `"Yes"` (website is always mandatory)
4. For each required field (`companyName`, `lob`, `website`, `turnover`, `location`): if not found in context, **stop and ask the user** before proceeding. Do not set required fields to `"NA"`.
5. Set any optional field not found in context to `"NA"`
6. Proceed to Step 3

---

## Step 2B: Guided Collection (No Data)

Ask in this order — one question at a time, wait for each answer:

1. "What is the company name?"
2. "What is the line of business? Choose from the approved list or propose a new one if nothing fits." *(show approved LOB list from `references/fields.md`)*
3. "What is the company's website? (main domain only — e.g. kserve.co.in)"
4. "What is the company's latest annual turnover? (Crore, numbers only — e.g. 2.5)"
5. "Where is the company based? (City, Country — e.g. Mumbai, India)"

After required fields are collected, ask once for optional fields:

> "Any additional details? (say 'skip' to submit these as NA)
> - Year in existence (numbers only — e.g. 12)
> - Director names
> - Number of branches
> - Company review (1–2 sentences overall)
> - Product/service rating (1–2 sentences)
> - KServe services to pitch
> - Customer care number
> - Social media (e.g. Instagram - 10K Followers, Linkedin - 5K Followers)
> - Tracxn rating (number only — e.g. 4.5)
> - Acquisitions (short pointers — e.g. Acquired by Reliance 2023)"

After the user responds:
- If user says "skip": set all optional fields to `"NA"`
- If user provides some details: extract and map those values; set any optional field not mentioned to `"NA"`
- No optional field may be absent or blank in the payload

Hardcode: `formType` = `"Company"`, `bdName` = `"VBDE"`, `websiteExist` = `"Yes"`.

---

## Step 3: Show Pre-Submit Summary

Display before submitting:

```
Here's what I'll submit to the BD Tracker:

| Field             | Value             |
|-------------------|-------------------|
| Company Name      | [companyName]     |
| Line of Business  | [lob]             |
| BD Manager        | VBDE              |
| Website           | [website]         |
| Turnover (Cr)     | [turnover]        |
| Location          | [location]        |
| Year in Existence | [yearInExistence] |
| Directors         | [nameOfDirectors] |
| Branches          | [numberOfCompanyBranches] |
| Review            | [Review]          |
| Rating            | [rating]          |
| Services          | [services]        |
| Customer Care No. | [customerCareNumber] |
| Social Media      | [socialMedia]     |
| Tracxn            | [Tracxn]          |
| Acquisitions      | [acquisitions]    |
| Form Type         | Company           |

Submit? (yes / no / correct [field name])
```

- **yes** → validate then submit (Step 4)
- **no** → respond "Understood. Submission cancelled — nothing was sent to the BD Tracker. Let me know if you'd like to resubmit." Then stop.
- **correct [field name]** → ask for corrected value, update summary, re-display

---

## Step 4: Validate

Check all required fields before submitting.

Read `bd-tracker-updater/org-creation/references/fields.md` — Required Fields table — for exact validation rules.

If any required field is invalid: tell the user which field failed and why. Ask for the corrected value. Update the field, re-display the full summary, and prompt "Submit? (yes / no / correct [field name])" again. Repeat until all required fields pass — there is no limit on correction rounds.

---

## Step 5: Submit

Construct the JSON payload using all 18 fields. See `bd-tracker-updater/org-creation/references/examples.md` for payload structure.

POST to `$BD_Tracker_Base_URL$BD_Tracker_Endpoint` with:

```json
{
  "Content-Type": "application/json"
}
```

---

## Step 6: Handle Response

Read `bd-tracker-updater/org-creation/references/error-handling.md` for exact response handling.
