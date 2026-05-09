# BD Org Creation — Field Reference

## Required Fields

Must have real data. Cannot be `"NA"`. Validate before submitting.

| Field | Type | Description | Validation Rule |
|---|---|---|---|
| `companyName` | String | Company name | Non-empty string |
| `lob` | String | Line of business | Non-empty. Examples: "NBFC", "BFSI", "Insurance", "eCommerce", "EdTech", "Automobile", "Healthcare", "Fintech", "Real Estate" |
| `bdName` | String | BD Manager's full name | Non-empty string |
| `formType` | String | Form type | Always `"Company"` — hardcoded, never ask user |
| `websiteExist` | String | Whether company has a website | Must be `"Yes"` or `"No"`. Normalize on input: accept yes/no/YES/NO, always submit as `"Yes"` or `"No"` |
| `website` | String | Company website URL | Required (non-empty) when `websiteExist` = `"Yes"`. Set to `"NA"` when `websiteExist` = `"No"` |
| `turnover` | Decimal | Annual revenue in Crore | Must parse as a positive number. Examples: `10.3`, `233`, `0.5`. Strip any "Cr" / "crore" text before storing |
| `location` | String | Company's primary city | Non-empty string. Examples: "Mumbai", "Delhi", "Pune", "Thane" |

## Optional Fields

Submit as `"NA"` if not available. Never leave blank — always include in payload.

| Field | Type | Description | Example Value |
|---|---|---|---|
| `yearInExistence` | String | Years since company established | `"23"`, `"5"`, `"40"` |
| `nameOfDirectors` | String | Director names, comma-separated | `"JD Mam, Rakesh Shetty"` |
| `numberOfCompanyBranches` | String | Total branch count | `"3"`, `"12"`, `"50+"` |
| `Review` | String | Company or product review text | `"Product quality is excellent"` |
| `rating` | String | Rating with platform context | `"4.5 on Google"`, `"3.8 on Glassdoor"` |
| `services` | String | KServe services to pitch | `"Customer Service, AI Bot"`, `"Lead Generation"` |
| `customerCareNumber` | String | Company's customer care number | `"1800-260000"` |
| `socialMedia` | String | Social media presence summary | `"50M followers on Instagram"` |
| `Tracxn` | String | Tracxn platform rating | `"Tracxn rating 4.5"` |
| `acquisitions` | String | Acquisition or major investment info | `"Acquired by Reliance 2023"`, `"No"` |

## Extraction Mapping (Research Report → API Field)

When extracting from a company-research report output, map sections to API fields:

| Research Report Section | API Field |
|---|---|
| Company name / report header | `companyName` |
| Industry / sector / vertical | `lob` |
| Website URL present | `websiteExist` = `"Yes"` + populate `website` |
| No website found | `websiteExist` = `"No"` + `website` = `"NA"` |
| Turnover / revenue figures | `turnover` (extract numeric value in Crore) |
| City / head office / registered address | `location` |
| Year founded / MCA incorporation year | `yearInExistence` |
| Directors / board members | `nameOfDirectors` |
| Branch count / office locations count | `numberOfCompanyBranches` |
| Product or service reviews | `Review` |
| Star ratings / Google ratings | `rating` |
| Social media section | `socialMedia` |
| Tracxn data | `Tracxn` |
| Acquisitions / funding section | `acquisitions` |
