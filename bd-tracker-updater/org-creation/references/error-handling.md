# BD Org Creation — Response Handling

## Success (HTTP 200)

Confirm to the user:

```
✅ [companyName] saved to BD Tracker successfully.
```

## Error (HTTP 300)

Report to the user and wait for their choice:

```
❌ BD Tracker returned an error (HTTP 300).

Payload sent:
[display the full JSON payload that was submitted]

Options:
  1. Retry — resubmit the same payload
  2. Correct — tell me which field to fix
  3. Cancel
```

If user chooses **Retry**: resubmit the same payload unchanged.
If user chooses **Correct**: ask which field to change, collect new value, re-validate, re-display summary, resubmit on confirmation.
If user chooses **Cancel**: stop and acknowledge.

## Network / Connection Error

If the HTTP request fails to connect (timeout, DNS resolution failure, connection refused):

```
❌ Could not reach BD Tracker.
Error: [error detail]

Webhook URL: https://n8n.kserve.dpdns.org/webhook/f50d69d1-edac-461b-8db3-0d8c81930e60

Options:
  1. Retry
  2. Show payload — display the JSON so I can submit manually
```

If user chooses **Show payload**: display the full JSON payload and stop.
