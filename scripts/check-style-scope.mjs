import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";

// This baseline is the website before the catalog replacement.
const baseline = "4440f6197fdb3a84cc4eee8cbe8fa9b055322191";
const classOnly = [
  "src/components/Header.tsx",
  "src/layouts/MainLayout.tsx",
  "src/views/Home.tsx",
  "src/components/content/ContentCard.tsx",
  "src/components/AuthModal.tsx",
  "src/views/Products.tsx",
  "src/views/ContentIndex.tsx",
  "src/views/StaticPage.tsx",
  "src/components/content/ContentDetail.tsx",
];
const presentation = [
  ...classOnly, "src/index.css", "src/styles/catalog-theme.css",
  "public/fonts/IRANSans-web.woff", "public/images/aptus-brand.svg", ".gitattributes",
  ".github/workflows/ci.yml", "scripts/check-style-scope.mjs",
  "scripts/browser-smoke.mjs", "scripts/catalog-visual-qa.mjs", "docs/catalog-visual-style.md",
];
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
const changed = git("diff", "--name-only", baseline, "HEAD").trim().split("\n").filter(Boolean);
assert.deepEqual(changed.filter(path => !presentation.includes(path)), [],
  "A visual-only update must preserve original website files, content, media, routes and backend.");

function withoutClasses(source, path) {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = ts.transform(file, [context => {
    const hasClass = (node, name) => ts.isJsxElement(node) &&
      node.openingElement.attributes.properties.some(attr => ts.isJsxAttribute(attr) &&
        attr.name.getText(file) === "className" && attr.initializer &&
        ts.isStringLiteral(attr.initializer) && attr.initializer.text.split(/\s+/).includes(name));
    const visit = node => {
      // The only new website wrapper: a decorative cover backdrop around the original hero copy.
      if (path === "src/views/Home.tsx" && hasClass(node, "aptus-cover")) {
        const elements = node.children.filter(child => ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child));
        assert.equal(elements.length, 2);
        const backdrop = elements[0];
        assert.ok(ts.isJsxSelfClosingElement(backdrop) && backdrop.tagName.getText(file) === "img");
        const attrs = Object.fromEntries(backdrop.attributes.properties.filter(ts.isJsxAttribute).map(attr =>
          [attr.name.getText(file), attr.initializer?.getText(file)]));
        assert.equal(attrs.src, "{GALLERY_ITEMS[0].image}");
        assert.equal(attrs.alt, '""');
        assert.equal(attrs["aria-hidden"], '"true"');
        assert.ok(hasClass(elements[1], "aptus-cover-copy"));
        return ts.visitNode(elements[1], visit);
      }
      // Shared brand mark intentionally matches the catalog; all other existing image sources stay unchanged.
      if (path === "src/components/Header.tsx" && ts.isJsxAttribute(node) &&
          node.name.getText(file) === "src" && node.initializer &&
          ts.isStringLiteral(node.initializer) && node.initializer.text === "/images/aptus-brand.svg") {
        return ts.factory.updateJsxAttribute(node, node.name, ts.factory.createStringLiteral("/images/logo.png"));
      }
      if (ts.isJsxText(node) && !node.text.trim()) return undefined;
      if (ts.isJsxAttribute(node) && node.name.getText(file) === "className") return undefined;
      return ts.visitEachChild(node, visit, context);
    };
    return root => ts.visitNode(root, visit);
  }]);
  try {
    return ts.createPrinter({ removeComments: true }).printFile(result.transformed[0]);
  } finally {
    result.dispose();
  }
}
for (const path of classOnly) {
  assert.equal(withoutClasses(readFileSync(path, "utf8"), path),
    withoutClasses(git("show", baseline + ":" + path), path),
    path + " must preserve original sections, copy, media, links and behavior after approved presentation changes.");
}
assert.equal(git("rev-parse", "HEAD:public/fonts/IRANSans-web.woff").trim(),
  "5d54cae73079fe0786d61da2a2ab94245bbb4666");
console.log("PASS: original website sections, copy, media, routes, data, auth and CMS preserved; approved cover wrapper and catalog brand verified.");
