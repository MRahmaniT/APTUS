# APTUS Content Platform

## Goal

Move repeated website content (products, news, projects/work) into one structured content model so editors can create a listing card and a full detail page from the admin panel without changing code.

## Reference research

The information architecture was informed by current precast/construction websites including Elematic, Metromont, Tindall, High Concrete Group, and Wells. The implementation is original to APTUS; the references are used only to identify common content patterns:

- visual listing cards with title/summary/image
- filterable product, project, and article indexes
- project detail pages with facts/specifications
- editorial news/article pages
- media-heavy product and case-study pages
- strong calls to action at the end of detail pages

## Reusable content types

- `product` — precast products and structural systems
- `news` — news, press, articles, exhibitions, events
- `project` — completed work, case studies, application/work areas

Every item has two presentations:

1. **Card / low-detail view**: title, abstract, cover image, category and optional date.
2. **Detail view**: body, media, highlights, specifications, CTA and one of five templates.

## Detail templates

1. `showcase` — slideshow/hero media first, then narrative copy.
2. `editorial` — article-first layout for news and thought leadership.
3. `technical` — specification-forward product layout with structured facts.
4. `case-study` — project story with highlights/metrics and media.
5. `gallery` — visual-first image/video gallery with supporting copy.

## Database decision

Use Supabase/Postgres for CMS data, auth, role-based access and media storage. Reasons:

- friendly table editor for non-developers
- relational schema for content + media
- JSONB for flexible specifications/highlights
- built-in authentication
- row-level security for editor/admin permissions
- storage buckets for images and videos
- Postgres remains portable if the project moves later

The frontend includes a local seed fallback so development still works before Supabase environment variables are configured.

## Git workflow

Feature work is developed on `development/cms-content-platform` using focused commits. The final reviewed tree is squashed to one release commit before landing on `new`.
