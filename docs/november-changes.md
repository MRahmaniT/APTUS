# November website revisions

Implemented from the approved notes on pages 3–4 of Aptus_Website_Changes.pdf.

- Persian is the active public language; the language switch is disabled through `src/config/site.ts`. Existing translations and multilingual CMS records remain available.
- Header: خانه, درباره محصول (تیپ‌بندی / اجزا), کتابخانه و مقالات, درباره ما, اخبار و رویدادها, پروژه‌ها. Existing product links are retained.
- Application images have captions and working detail pages. The five-image GSAP accordion remains.
- Homepage slideshows draw from the existing product, project and news CMS records. In a news record's Specs, `Featured: true` prioritizes important news. An event category (`Events`, `Exhibitions`, رویداد, نمایشگاه) produces an event pop-up trigger. Set `eventEnd` to an ISO date/time for a live event to open automatically once per browser session; records without an active end date remain available through their event buttons.
- Component pins and the nine component buttons open native modal dialogs, with Escape, focus restoration and background isolation. The full component description and existing product link are included.
- Footer: contact details and the catalog map on the right, short About summary on the left linking to `/about`. Map routing uses the verified catalog address.
- `/types` presents single-span, symmetric double-span and asymmetric double-span families. Only single-span designs receive the catalog's standard dimensions. Other families explicitly require project-specific engineering.
- The catalog PDF is bundled at `/catalog-assets/aptus-catalog.pdf` and linked after the introduction.
- `/about/statistics` exposes aggregate monthly/yearly views and most-viewed public paths. The date selector explicitly uses Gregorian periods; no member or profile information is returned.
- Articles are a separate CMS content type. Editors can publish a title, abstract and full body. Guests receive the abstract, not the full body, through both list and detail APIs. A signed-in member can read the complete article. There are no fabricated article records in production.

## Verification-code delivery

The API supports both email and SMS. Configure an HTTPS delivery adapter for each required channel:

```
OTP_SECRET=<a long random secret shared by API instances>
OTP_EMAIL_WEBHOOK_URL=https://your-email-adapter.example/send
OTP_EMAIL_WEBHOOK_TOKEN=<adapter credential>
OTP_SMS_WEBHOOK_URL=https://your-sms-adapter.example/send
OTP_SMS_WEBHOOK_TOKEN=<adapter credential>
```

The adapter receives JSON `{channel,to,code,expiresInSeconds}` and must send the message before responding successfully. Credentials stay on the server. Codes are HMAC-protected, expire after five minutes, permit five attempts, and are consumed atomically. Resends have a one-minute cooldown and a limit of three per destination per ten minutes. The public API never returns or logs a code. A verified code creates an ordinary member account, never an administrator. Phone identities are established by verification rather than by trusting editable profile phone fields.

When an adapter is not configured, code delivery returns a clear unavailable response. Password login remains available for existing members and editors. No provider credentials are included in this repository, and real email/SMS delivery has not been exercised by automated tests.

Apply the new PostgreSQL migration before starting the API. The normal launcher/migration command already discovers migration 002. Test delivery uses only a loopback mock in CI; it is not imported or enabled by the production server.
