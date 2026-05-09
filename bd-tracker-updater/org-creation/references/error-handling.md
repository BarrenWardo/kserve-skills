# BD Org Creation — Response Handling

## Success (HTTP 200)

Parse the JSON response. Extract `Org_id` and confirm to the user:

```
✅ [companyName] saved to BD Tracker successfully.

Organisation ID: [Org_id]
```

If `Org_id` is absent from the response, warn the user:

```
⚠️ BD Tracker returned HTTP 200 but no Organisation ID in the response.
Response received: [response body]
The record may still have been created — please verify manually in the BD Tracker.
```

## Error (HTTP 300 or non-200)

**Auto-retry up to 3 times** before surfacing the error to the user.

- Retry 1: wait 1 second, then resubmit
- Retry 2: wait 3 seconds, then resubmit
- Retry 3: wait 9 seconds, then resubmit

If all 3 retries fail, report to the user:

```
❌ BD Tracker returned an error after 3 attempts.

Error summary:
- HTTP Status: [status code]
- Response: [response body]

Payload sent:
[display the full JSON payload that was submitted]

Options:
  1. Correct — tell me which field to fix, I'll resubmit
  2. Cancel
```

If user chooses **Correct**: ask which field to change, collect new value, re-validate, re-display summary, resubmit on confirmation. Auto-retry logic applies again on the new submission.
If user chooses **Cancel**: stop and acknowledge.

## Network / Connection Error

**Auto-retry up to 3 times** before surfacing the error to the user (same retry logic as above).

If all 3 retries fail:

```
❌ Could not reach BD Tracker after 3 attempts.
Error: [error detail]

Endpoint: $BD_Tracker_Base_URL$BD_Tracker_Endpoint

Options:
  1. Retry again
  2. Show payload — display the JSON so I can submit manually
```

If user chooses **Show payload**: display the full JSON payload and stop.
If user chooses **Retry again**: attempt 3 more times, same pattern. If this second round also fails, do not offer "Retry again" — instead respond:

```
❌ BD Tracker is still unreachable after multiple attempts.
The service may be temporarily unavailable. Please try again later or contact support.
```
