# Source Priority

Use this table for every step. Each step lists which sources to try in order of preference.

| Step | Primary | Secondary | Fallback |
|---|---|---|---|
| 2 — Line of Business | Company website (About page) | LinkedIn company page | News articles · Industry directories |
| 3 — Turnover | MCA filings (AOC-4 Annual Return, MGT-7 Board Report) | Tofler · Zauba Corp | News articles · Annual reports |
| 4 — Head Office | MCA registered address | Company website | Google Maps Business listing |
| 5 — Years in Existence | MCA company master data | Company website (Our Story / About) | LinkedIn Founded year · Wikipedia |
| 6 — Directors | MCA director listing | Tofler | Company website (Leadership) · LinkedIn |
| 6B — Dossiers | LinkedIn profiles of ★-flagged directors | Company website bio · News/conference mentions | Conference speaking history · Industry press mentions |
| 7 — Branches | Company website | Google Maps | News · LinkedIn (employees by location) |
| 7B — Job Postings & Workforce Signals | Naukri (site:naukri.com "[company]") · LinkedIn company page (headcount) | LinkedIn Jobs · Indeed India · Crunchbase (employee range) | Company careers page |
| 7C — Tech Stack | BuiltWith · Wappalyzer | Job posting tech mentions | Company website footer vendor tags |
| 8 — Reviews | Google Business · Trustpilot · AmbitionBox · Glassdoor | Amazon · Flipkart · App Store · Google Play · Justdial | AppFollow · AppBot (app reviews) · job postings (Step 8E tool detection only) |
| 9 — Rating | Synthesized from Step 8 output | — | If Step 8 produced < 15 total reviews across all platforms, mark rating Confidence: LOW and note sample size. If zero reviews, write "Rating: N/A". |
| 10 — KServe Fit | Synthesized from Steps 2–9 output (Wave 3 worker — requires Sanitizer gate complete) | — | If Step 10 is RETRY_EXHAUSTED, Step 15 must omit Section C (Trigger Signals). |
| 10B — ICP Score | Synthesized from Steps 2–10 output — no new searches | — | If Step 7B was not run, assign 3/10 for job postings dimension with note "Step 7B not run". |
| 11 — Customer Care | Company website | Google Business · Justdial | App Store / Play Store listing |
| 12 — Social Media | Direct platform search (LinkedIn, Instagram, Facebook, X, YouTube) | Social Blade (trends) | Company website social links |
| 13 — Tracxn | Tracxn.com | Crunchbase (always check as secondary for employee count + funding timeline) | — |
| 14 — M&A, Funding, Legal Risk & Key Partnerships | News (last 12 months) · consumerforum.in · sebi.gov.in · rbi.org.in · Company website Partners page · LinkedIn company updates | Tracxn · Crunchbase · MCA filings · gem.gov.in · Tofler / Zauba Corp (MCA compliance) | ET · Mint · Business Standard |
| 15 — BD Briefing | Synthesized from Steps 2–14 output — no new searches | — | If ≥ 4 steps exhausted retries, open with partial-data warning. If Step 10 is RETRY_EXHAUSTED, omit Trigger Signals. If Step 8 RETRY_EXHAUSTED, skip review-based Conversation Starters. |
| 16 — Outsourcing Vendors | News (ET · Mint · BS): `"[company]" "outsourcing" OR "BPO" OR "vendor"` | Step 7B JD language scan | LinkedIn updates · company website press releases |
| 17 — Competitive Landscape | Tracxn "Similar companies" | Crunchbase "Competitors" tab | News/industry rankings: `"[company] competitors"` |
