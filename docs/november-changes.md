# November website revisions

- The homepage starts with six expanding panels: the three type families and catalog facade designs. Published projects replace up to three facade panels after an editor signs in. Editors also see the separate five-panel applications gallery.
- Full About Aptus is at `/about`. The footer shows a short About summary on the right and contact/map on the left. The catalog PDF is linked at the end of the AIPS introduction.
- News and events use separate paginated image cards. `Featured: true` in a news record's Specs prioritizes it. Event categories (Events, Exhibitions, رویداد, نمایشگاه) open an event dialog. A future ISO `eventEnd` can announce the event once per browser session.
- Each type family has a detail page with the catalog's 18 height–span combinations. The two double-span pages label this table as a single-span reference until their dimensions are confirmed. Legacy type links redirect to the matching detail.
- Guests can read article summaries. Members can read full published articles and the protected library. Only admins/managers can access projects and site statistics or see the applications gallery. The relevant API endpoints apply the same permissions. Public signup always creates a member.

## Verification-code delivery

The API supports both email and SMS. Configure an HTTPS delivery adapter for each required channel:

```
OTP_SECRET=<a long random secret shared by API instances>
OTP_EMAIL_WEBHOOK_URL=https://your-email-adapter.example/send
OTP_EMAIL_WEBHOOK_TOKEN=<adapter credential>
OTP_SMS_WEBHOOK_URL=https://your-sms-adapter.example/send
OTP_SMS_WEBHOOK_TOKEN=<adapter credential>
```

For local development, put these values in the ignored `.env.dev` file. For Docker/production, use the ignored `.env.server` file; Docker Compose forwards these values into the API container. Restart the stack after changing them.

The adapter receives JSON `{channel,to,code,expiresInSeconds}` and must send the message before responding successfully. Credentials stay on the server. Codes are HMAC-protected, expire after five minutes, permit five attempts, and are consumed atomically. Resends have a one-minute cooldown and a limit of three per destination per ten minutes. The public API never returns or logs a code. A verified code creates an ordinary member account, never an administrator. Phone identities are established by verification rather than by trusting editable profile phone fields.

When no adapter is configured, the login form opens directly in password mode. Password login is also available as an alternative when code delivery is enabled. No provider credentials are included in this repository, and real email/SMS delivery has not been exercised by automated tests.

The normal launcher applies migration 002 on installations that do not have verification-code tables yet. This revision requires no new schema migration. Test delivery uses only a loopback mock in CI; it is not imported or enabled by the production server.
