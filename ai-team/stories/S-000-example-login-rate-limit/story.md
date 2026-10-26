# S-000: Block repeated failed logins (EXAMPLE)
Status: Ready

User story: As an account owner, I want repeated failed login attempts to be blocked, so that nobody can guess my password by trying many times.

Acceptance Criteria:
- [ ] Given 5 failed logins from the same client within 15 minutes, when the client tries again, then the login is refused with a clear message.
- [ ] Given a blocked client, when 15 minutes have passed, then the client can log in again.
- [ ] Given a client with some failed attempts, when it logs in successfully, then its failed-attempt count resets.
- [ ] The message never reveals whether the account exists.

Out of scope:
- Locking the account itself (only the client is blocked).
- CAPTCHA and email alerts.

Assumptions:
- 5 attempts per 15 minutes is acceptable (common default; the stakeholder can change it).
- A single server is enough for now, so attempt counts can live in memory.

Acceptance:
_Filled by the product-owner after the review._
