# BD Org Creation — Example Payloads

## Complete Payload (All Fields with Real Data)

```json
{
  "companyName": "Kserve BPO",
  "websiteExist": "Yes",
  "website": "kserve.co.in",
  "lob": "NBFC",
  "bdName": "VBDE",
  "turnover": 10.3,
  "location": "Mumbai, India",
  "yearInExistence": "23",
  "nameOfDirectors": "JD Mam, Rakesh Shetty",
  "Review": "Kserve BPO is a well-established outsourcing firm with strong client retention and diversified service offerings.",
  "numberOfCompanyBranches": "3",
  "rating": "Rated 4.5 on Google with consistent positive feedback on service quality and responsiveness.",
  "services": "Customer Service, AI Bot",
  "customerCareNumber": "1800-260000",
  "socialMedia": "Instagram - 50K Followers, Linkedin - 12K Followers",
  "Tracxn": "4.5",
  "acquisitions": "Partnered with Jio 2024, Acquired SmallCo BPO 2022",
  "formType": "Company"
}
```

## Partial Payload (Required Fields Only — Optional as "NA")

```json
{
  "companyName": "Bajaj Finance",
  "websiteExist": "Yes",
  "website": "bajajfinserv.in",
  "lob": "NBFC",
  "bdName": "VBDE",
  "turnover": 45.2,
  "location": "Pune, India",
  "yearInExistence": "NA",
  "nameOfDirectors": "NA",
  "Review": "NA",
  "numberOfCompanyBranches": "NA",
  "rating": "NA",
  "services": "NA",
  "customerCareNumber": "NA",
  "socialMedia": "NA",
  "Tracxn": "NA",
  "acquisitions": "NA",
  "formType": "Company"
}
```

## Success Response

On HTTP 200, the API returns a JSON object. Extract and display `Org_id`:

```json
{
  "Org_id": "ORG-20240509-001",
  "message": "Company saved successfully"
}
```

Display to user:
```
✅ Bajaj Finance saved to BD Tracker successfully.

Organisation ID: ORG-20240509-001
```
