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
];
const presentation = [
  ...classOnly, "src/index.css", "src/styles/catalog-theme.css",
  "public/fonts/IRANSans-web.woff", ".gitattributes",
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
    const visit = node => {
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
    path + " may change CSS classes only; sections, copy, images and behavior must be preserved.");
}
assert.equal(git("rev-parse", "HEAD:public/fonts/IRANSans-web.woff").trim(),
  "5d54cae73079fe0786d61da2a2ab94245bbb4666");
console.log("PASS: original website structure, content, assets, routes, data, auth and CMS preserved.");
