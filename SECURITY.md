# Security Notes

## Free MVP

- No payment processing is enabled.
- No secrets or API keys belong in client-side code.
- The generation endpoint validates tool, language, tone and input size.
- The current account/history data is local to the browser and is not a secure authentication system.

## Before public production use

- Add server-side authentication and authorization.
- Move persistent user data to a trusted database.
- Add rate limiting at the server/edge layer.
- Add abuse/spam protection and request monitoring.
- Store AI provider credentials only in server-side environment variables.
- Add dependency auditing and automated security checks.
