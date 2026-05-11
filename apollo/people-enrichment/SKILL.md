---
name: apollo-people-enrichment
description: >
  Enrich a LinkedIn profile URL into structured person data using Apollo.io People
  Match API. Trigger on phrases like "enrich this LinkedIn profile", "get person
  data from LinkedIn", "Apollo match this URL", "look up this person on Apollo".
---

# Apollo — People Enrichment

Enriches a LinkedIn profile URL into person data (name, title, company, email, phone, location, etc.) using Apollo.io People Match API.

## API Reference

**Endpoint:** `POST https://api.apollo.io/api/v1/people/match`

**URL Query Parameters:**

| Parameter | Required | Description |
|---|---|---|
| `linkedin_url` | Yes | URL-encoded LinkedIn profile URL |

**Headers:**

| Header | Value |
|---|---|---|
| `x-api-key` | `$APOLLO_API_KEY` |
| `Accept` | `application/json` |

**Example curl:**

```bash
curl --request POST \
  --url 'https://api.apollo.io/api/v1/people/match?linkedin_url=URL_ENCODED_LINKEDIN_URL' \
  --header 'Accept: application/json' \
  --header "x-api-key: $APOLLO_API_KEY" \
  --max-time 30 \
  --connect-timeout 10
```

## Workflow

0. Verify `$APOLLO_API_KEY` environment variable is set — if not, stop and report the missing key
1. Collect LinkedIn profile URL(s) from the user
2. Validate each URL matches `https://www.linkedin.com/in/` prefix — if not, ask for a valid LinkedIn profile URL
3. Enrich each profile: URL-encode the LinkedIn URL, then call People Match API
4. If multiple URLs: process in parallel using subagents (one per URL)
5. Return all API response JSONs to the user

## Error Handling

| Status | Meaning | Action |
|---|---|---|
| 200 | Success | Return JSON to user |
| 401 | Invalid or missing API key | Tell user `$APOLLO_API_KEY` is invalid |
| 429 | Request limit reached | Tell user their request limit has been reached and to log in at https://app.apollo.io for more info |
| 4xx/5xx | Other API error | Return error message from response to user |

## Response

The API returns a detailed JSON object with person data. Fields include but are not limited to: name, title, company, email, phone, location, social profiles, and more. Present the full JSON response to the user.
