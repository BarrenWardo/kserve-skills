# BD Org Creation — Response Handling

## Success (HTTP 200)

Parse the JSON response. Extract `Org_id` and confirm to the user:

```
✅ [companyName] saved to BD Tracker successfully.

Organisation ID: [Org_id]
```

The `Org_id` confirms the record was created in the system.

## Error (HTTP 300 or non-200)

**Auto-retry up to 3 times** before surfacing the error to the user.

- Retry 1: resubmit immediately
- Retry 2: resubmit after retry 1 fails
- Retry 3: resubmit after retry 2 fails

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
If user chooses **Retry again**: attempt 3 more times, same pattern.
