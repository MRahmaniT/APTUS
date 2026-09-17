# Supabase setup for APTUS

The frontend is migrated away from Firebase/Firestore. The old remote Firebase project is **not** deleted by this code change, so it remains available if you later discover data that needs to be exported.

From the previous code, Firestore was only used for:

- `users` — role/profile records
- `cms` — shared page content such as the home hero title/subtitle
- `analytics` — daily view counts

## 1. Create the Supabase project

Create a Supabase project for APTUS. The browser application uses the Project URL and the publishable/anon key; never put a service-role key in Vite environment variables.

Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
VITE_SITE_URL=http://localhost:5173
```

Use the production website URL for `VITE_SITE_URL` in production.

## 2. Run migrations

Run these SQL files in order from the Supabase SQL editor or Supabase CLI:

1. `supabase/migrations/001_content_platform.sql`
2. `supabase/migrations/002_site_settings.sql`
3. `supabase/migrations/003_public_policy_permissions.sql`

They create:

- user profiles + roles
- products/news/projects
- content media
- five selectable template keys
- daily analytics
- shared site settings
- `content-media` storage bucket
- row-level security policies

## 3. Configure authentication

In Supabase Auth:

- enable Email/Password
- optionally enable Google OAuth
- add localhost and production URLs to allowed redirect URLs

The app can run without Supabase credentials in local seed mode, but real admin persistence requires Supabase.

## 4. Bootstrap the first manager

Create/sign up the first account through the website, then promote it once in the Supabase SQL editor:

```sql
update public.profiles
set role = 'manager'
where id = (
  select id from auth.users
  where email = 'YOUR_ADMIN_EMAIL'
  limit 1
);
```

After signing in again, the footer shows **Content Studio** and **Analytics** links.

## 5. Content workflow

Open `/admin/content` as an admin/manager.

For every product, news item, or project/work item you can edit:

- title
- slug
- locale
- category
- abstract (used by the listing hover card)
- full body text
- cover image
- image/video media
- highlights
- specifications
- CTA
- SEO title/description
- draft/published status
- detail template

Available detail templates:

- Showcase
- Editorial
- Technical
- Case Study
- Gallery

## 6. Existing/seed content

The application includes a baseline catalogue for the current products plus sample news/projects. The baseline is merged with database content by slug, so the site remains populated while you migrate entries gradually.

When an editor saves a baseline item while Supabase is connected, the real database row with the same slug takes precedence over the baseline version.

## 7. If old Firestore data exists

Before deleting the old Firebase project, inspect/export the `users`, `cms`, and `analytics` collections. The new Supabase schema does not automatically delete or mutate Firebase data.

For user accounts, passwords cannot be copied as plain text. Create/migrate accounts through an authentication migration process or ask users to reset passwords in Supabase.

## 8. Lockfile note

Firebase is removed from the application source and `package.json`. The existing npm/bun lockfiles may still contain historical Firebase package entries until the next local dependency refresh. Running `npm install` (and, if Bun is used, the equivalent Bun install) will rewrite those lockfiles; this does not change the application code or database migration.
