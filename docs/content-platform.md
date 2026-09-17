# APTUS Content Platform

## Goal

Repeated website content (products, news, projects/work) uses one structured model so editors can create a listing card and a full detail page from the admin panel without changing application code.

## Reference research

The information architecture was informed by current precast/construction websites including Elematic, Metromont, Tindall, High Concrete Group, and Wells. The implementation is original to APTUS; the references were used to identify common content patterns such as visual indexes, technical facts, case studies, editorial pages, media galleries, and calls to action.

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

## Languages

English (`en`), Persian (`fa`), and Turkish (`tr`) are stored as separate records using the same content type + slug. There is no cross-language content fallback, which prevents English body copy from appearing inside Persian or Turkish pages.

## Database and API

APTUS uses self-hosted PostgreSQL behind a Node/Express API. The React browser app never receives database credentials and never connects directly to PostgreSQL.

PostgreSQL stores:

- user accounts, roles and admin profiles
- login sessions
- products/news/projects and their media metadata
- editable standard page content
- analytics counters

Uploaded CMS files are stored in a persistent server volume and served from `/uploads`.

The frontend retains bundled seed content as a read-only baseline/fallback for public pages, while saved CMS content is stored in PostgreSQL.

## Deployment

The supported deployment path is Docker Compose using `docker-compose.yml`. See `docs/self-hosted-postgres.md` for setup, backups, Adminer access and HTTPS/reverse-proxy guidance.

## Git workflow

Feature work is developed with focused commits on a `development/*` branch. The verified final tree is squashed to one release commit before landing on `new`.
