# Catalog content mapped to the website

Reference: MRahmaniT/APTUS-Catalog at 75c645424c5ac5dba0d27c15e889d07a1aeebf91.

The website keeps its navigation, three homepage sections, five application cards, six homepage product cards, product listing groups, detail templates, routes, CMS, accounts, news, projects and protected library.

The cover, application photographs, product names and captions, component galleries, technical PDFs, company introduction, system description, dimensions, contact information and footer now come from the catalog in Persian, English and Turkish. Assets are bundled under /catalog-assets/ as ordinary Git files.

Existing product URLs are retained for compatibility. /slabs now presents the catalog's purlin; /modular presents its longitudinal beam; /architectural-panels presents its wall base. Single-storey/double-storey/multi-storey URLs retain their slots and are labeled as span designs. Only the single-span design receives the catalog's standard dimensions; other layouts explicitly require project-specific engineering.

News and project records without a catalog equivalent retain their content. Server CMS records and locally edited records take precedence; untouched local seed records refresh to the catalog defaults without clearing browser storage.

Validation verifies source asset hashes, preserved routes/backend/account/CMS code, all public product pages, responsive layouts in three languages, technical PDF links, authentication and protected library access.
