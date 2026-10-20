# Catalog visual style, original website

The website baseline is commit `4440f6197fdb3a84cc4eee8cbe8fa9b055322191` on `new`.
The catalog is a visual reference only. The original website's sections, order, navigation,
text, images, product data, languages, URLs, accounts, CMS and PostgreSQL API are preserved.

The theme in `src/styles/catalog-theme.css` applies the catalog's gray/orange palette,
local IRANSans font, translucent rounded header, pill buttons, rounded image/text cards,
panels, forms and footer to the existing website components. Components only add CSS classes.
The website retains its React/TypeScript implementation.

Run `npm ci`, `node scripts/check-style-scope.mjs`, `npm run typecheck` and `npm run build`.
The scope check compares every changed path against the original website and compares the
five components as TypeScript syntax trees after removing CSS class attributes.

Web CI also runs the original API/CMS smoke check and browser checks against the built site:
three viewport sizes, Persian/English/Turkish, nine original public routes, original homepage
sections and images, mobile navigation, member signup/login and protected library access.
Screenshots are attached to each workflow run as `website-visual-qa`.

Original website images use Git LFS: run `git lfs pull` if your checkout contains pointer files.
The catalog font is bundled directly and does not require an external font service.
