import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");

const htmlFiles = [
  "index.html",
  "404.html",
  "about/index.html",
  "contact/index.html",
  "services/index.html",
  "tools/index.html",
  "work/index.html",
  "work/washington-ev-market/index.html",
];

function internalTargetToFile(target) {
  const clean = target.split(/[?#]/, 1)[0];
  if (!clean || !clean.startsWith("/")) return null;
  if (clean === "/") return join(docs, "index.html");
  if (/\.[a-z0-9]+$/i.test(clean)) return join(docs, clean.slice(1));
  return join(docs, clean.slice(1), "index.html");
}

test("static export contains every public route and approved positioning", async () => {
  for (const file of htmlFiles) await access(join(docs, file));

  const [home, tools, work, about, sitemap, robots] = await Promise.all([
    readFile(join(docs, "index.html"), "utf8"),
    readFile(join(docs, "tools/index.html"), "utf8"),
    readFile(join(docs, "work/index.html"), "utf8"),
    readFile(join(docs, "about/index.html"), "utf8"),
    readFile(join(docs, "sitemap.xml"), "utf8"),
    readFile(join(docs, "robots.txt"), "utf8"),
  ]);

  assert.match(home, /<title>David Edmonds — Senior Data Analyst &amp; BI Professional<\/title>/i);
  assert.match(home, /Confia Solutions, LLC/);
  assert.match(home, /href="\/tools"/);
  assert.match(tools, /CSV quality checker/);
  assert.match(tools, /never uploaded/i);
  assert.match(work, /CURRENT ROLE · CONFIA SOLUTIONS, LLC/);
  assert.match(about, /Data Analytics Consultant \| Confia Solutions, LLC/);
  assert.match(sitemap, /https:\/\/david-edmonds\.github\.io\/tools/);
  assert.match(robots, /Sitemap: https:\/\/david-edmonds\.github\.io\/sitemap\.xml/);
  assert.doesNotMatch(`${home}\n${tools}\n${work}\n${about}`, /http:\/\/localhost/i);
});

test("every root-relative link and asset in generated HTML resolves", async () => {
  const missing = [];

  for (const file of htmlFiles) {
    const html = await readFile(join(docs, file), "utf8");
    const targets = new Set(
      [...html.matchAll(/(?:href|src)="(\/[^"\s]+)"/g)].map((match) => match[1]),
    );

    for (const target of targets) {
      const path = internalTargetToFile(target);
      if (!path) continue;
      try {
        await access(path);
      } catch {
        missing.push(`${file}: ${target}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

test("published resume is the full reviewed PDF", async () => {
  const resumePath = join(docs, "david-edmonds-resume.pdf");
  const [info, header] = await Promise.all([
    stat(resumePath),
    readFile(resumePath).then((buffer) => buffer.subarray(0, 5).toString("ascii")),
  ]);

  assert.equal(header, "%PDF-");
  assert.ok(info.size >= 20_000, `Resume PDF is unexpectedly small: ${info.size} bytes`);
});
