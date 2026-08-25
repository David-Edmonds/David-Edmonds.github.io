import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

const docsDir = path.resolve("docs");
const pagePath = path.join(
  docsDir,
  "work",
  "federal-contracting-performance",
  "index.html",
);

await access(pagePath);
const html = await readFile(pagePath, "utf8");

assert.match(html, /Federal Contracting Performance/i);
assert.match(html, /19\.2M/);
assert.match(html, /\$2\.27T/);
assert.match(html, /68\.2%/);
assert.match(html, /22\.9%/);
assert.match(html, /independent (?:public[- ]data|portfolio)/i);
assert.match(html, /different denominators/i);
assert.match(html, /not presented as[\s\S]*Confia Solutions/i);
assert.match(html, /federal-contracting-dashboard\.jpg/i);
assert.match(html, /href=["']\/contact\/?["']/i);
assert.doesNotMatch(html, /\.pbix/i);
assert.doesNotMatch(html, /chatgpt\.site/i);

console.log("FEDERAL_CASE_STUDY_RELEASE_VERIFIED");
