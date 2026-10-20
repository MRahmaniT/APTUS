# Catalog layout applied to the original website

Reference: APTUS-Catalog `75c645424c5ac5dba0d27c15e889d07a1aeebf91`.
Website content baseline: `4440f6197fdb3a84cc4eee8cbe8fa9b055322191`.

The existing website keeps its three homepage sections, five application links, six home products,
product/design pages, news, projects, about pages, library, translations, CMS and PostgreSQL API.
All original text and media remain. The cover repeats the first existing gallery photo as a
decorative background. The shared header brand now uses the catalog's actual vector mark,
including its embedded logo fonts, instead of the old unrelated icon.

The theme implements the catalog's finished layouts and shared component dimensions:
- Floating capsule header, navigation pills and glass dropdowns.
- Continuous photographic cover, white title and orange vertical rule.
- Five image/caption application cards, preserving all original gallery links.
- Full-width introduction panel, orange statistics and three-column product grid.
- Inset image/caption cards with the catalog's borders, shadows, spacing and footer action.
- AIPS image/text panel pair, index/detail reading grids and specification cards.
- Photo-backed footer banner with all existing website footer links and contact material.

`scripts/check-style-scope.mjs` checks every changed path against the original site. It compares
component syntax with classes removed and explicitly normalizes only the approved decorative
cover wrapper and shared brand asset. Source data, API, routes and account/CMS logic stay exact.

Web CI runs typecheck/build, the original database/API integration test, 81 route/language/viewport
checks, and a rendered comparison with a pinned checkout of the actual catalog. Screenshots and
computed style comparisons are attached as `website-visual-qa`.
