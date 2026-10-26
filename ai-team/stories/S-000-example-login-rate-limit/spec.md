# Spec: S-000 Login Rate Limiting (EXAMPLE)

Goal: Limit failed logins to 5 attempts per client per 15 minutes to block brute-force attacks (S-000).

Risk level: 🟡 - security-relevant, but in-memory storage is easy to replace later. Threat model required.

Files:
- `src/auth/rateLimit.js` (create)
- `src/auth/routes.js` (change: apply the middleware to `POST /login`)

Technical Steps:
1. In `rateLimit.js`, create an in-memory Map: `failedAttempts: ip -> { count, firstAttemptTime }`.
2. Export middleware `checkRateLimit(req, res, next)`.
3. If `count >= 5` and `now - firstAttemptTime < 15 min`, respond `429` with the JSON below.
4. On successful login, delete the entry for that IP.
5. On failed login, increment `count`, setting `firstAttemptTime` on the first failure.
6. Every hour, delete entries older than 15 minutes, to avoid unbounded memory growth.

API Contract:
```json
// 429 Too Many Requests
{ "error": "too_many_attempts", "message": "Too many failed attempts. Try again in 15 minutes." }
```

Edge Cases:
- The client changes IP: accepted limitation, logged in `ai-team/RISKS.md`.
- A correct login after the 15-minute window must be allowed.
- Memory growth under many distinct IPs: handled by the hourly cleanup.
- Requests behind a proxy: read the client IP as configured in `ai-team/ARCHITECTURE.md`, never from a raw `X-Forwarded-For` header.

Acceptance Criteria for Tester:
- [ ] 5 failed logins, then a 6th request, returns 429 with the message above.
- [ ] After the window passes (use a fake clock), login is allowed again.
- [ ] A successful login resets the counter.
- [ ] The response is identical for existing and non-existing accounts.
- [ ] Entries older than 15 minutes are removed by the cleanup.

Status: Ready for implementation
