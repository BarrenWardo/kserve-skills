# BD Org Creation — Example Payloads

## Complete Payload (All Fields with Real Data)

```json
{
  "companyName": "Kserve BPO",
  "websiteExist": "Yes",
  "website": "kserve.co.in",
  "lob": "NBFC",
  "bdName": "Sangita",
  "turnover": 10.3,
  "location": "Mumbai",
  "yearInExistence": "23",
  "nameOfDirectors": "JD Mam, Rakesh Shetty",
  "Review": "Product review was very good",
  "numberOfCompanyBranches": "3",
  "rating": "4.5 rating on Google",
  "services": "Customer Service",
  "customerCareNumber": "1800-260000",
  "socialMedia": "50M followers on Instagram",
  "Tracxn": "Tracxn rating 4.5",
  "acquisitions": "No acquired by anyone",
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
  "bdName": "Darryl",
  "turnover": 45.2,
  "location": "Pune",
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

## No-Website Payload

When `websiteExist` is `"No"`, set `website` to `"NA"`:

```json
{
  "companyName": "Local Finance Co",
  "websiteExist": "No",
  "website": "NA",
  "lob": "BFSI",
  "bdName": "Priya",
  "turnover": 5.0,
  "location": "Thane",
  "yearInExistence": "8",
  "nameOfDirectors": "Ramesh Shah",
  "Review": "NA",
  "numberOfCompanyBranches": "2",
  "rating": "NA",
  "services": "Lead Generation",
  "customerCareNumber": "NA",
  "socialMedia": "NA",
  "Tracxn": "NA",
  "acquisitions": "NA",
  "formType": "Company"
}
```
