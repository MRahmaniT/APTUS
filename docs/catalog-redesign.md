# APTUS catalog-based website

The source is MRahmaniT/APTUS-Catalog at commit 75c645424c5ac5dba0d27c15e889d07a1aeebf91. The existing APTUS website starts from branch new at commit 4440f6197fdb3a84cc4eee8cbe8fa9b055322191. Completed work is delivered on main2, leaving new unchanged.

## Frontend and appearance

All frontend TypeScript and TSX source is converted to JavaScript and JSX; Vite/React and the existing Express/PostgreSQL content platform remain in place. The catalog's four original CSS layers, local fonts, logo and orange/gray palette supply the design for the homepage, header, footer, cards and controls. Website extensions are in src/website.css. The source index points to src/main.jsx.

The catalog's original JavaScript renderer is adapted as src/catalog/app.js. It mounts inside the React homepage and removes its listeners on unmount. Shared header/footer are React components so language selection, sign-in, roles, the CMS, news, projects and the protected library stay integrated. Existing type, part, facade, benefits and document query links work on the homepage in Persian, English and Turkish.

## Shared content

src/catalog/ holds the original catalog content and translations. src/catalog/adapter.js maps its nine components, system description and facade gallery to 33 CMS-compatible records (11 per language). Product images, galleries, descriptions and highlights come from the catalog. Contact and location defaults use the same company address and phone; placeholder sales email/telephone are removed. All 103 source assets are copied into public/catalog/assets, including technical PDFs, documents and font licenses, with hashes recorded in catalog-source.json.

Existing authored server content and editorial content remain available through the CMS. Bundled product examples are replaced by catalog records. Browser-cached seed examples are refreshed while custom local records are retained. The catalog's application images remain illustrative applications, not claims of completed projects. Legacy component slugs map to the corresponding catalog component. CMS editors can save the new baseline records to the server as before.

## Checks and operation

Run npm ci, npm run check, npm run build, and the existing API/database commands. npm run typecheck remains an alias for the JavaScript/integrity check for launcher compatibility. CI checks launchers, JavaScript/assets, the production bundle, API syntax, real PostgreSQL migrations, authentication and CMS operations, and browser behavior at desktop, tablet and mobile widths. Browser checks include localized routes, catalog deep links/controls, sign-in, member library access and editor screens. Screenshots are uploaded as CI artifacts.

Use the existing ./dev.sh or ./aptus.sh launchers and Docker Compose configuration. Server API contracts, authentication, role authorization and database schema are unchanged.
