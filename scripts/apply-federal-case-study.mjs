import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

async function read(path) {
  return readFile(path, "utf8");
}

async function write(path, content) {
  await writeFile(path, content);
  console.log(`updated ${path}`);
}

function ensureLinkImport(content) {
  if (/from ["']next\/link["']/.test(content)) return content;
  return `import Link from "next/link";\n${content}`;
}

function insertBeforeClosingMain(content, snippet, label) {
  if (content.includes(label)) return content;
  const index = content.lastIndexOf("</main>");
  assert.ok(index >= 0, `Could not find </main> for ${label}`);
  return `${content.slice(0, index)}${snippet}\n${content.slice(index)}`;
}

function addRouteAfter(content, marker, route) {
  if (content.includes(route)) return content;

  const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(["']${escaped}\\/?["']\\s*,?)`);
  const match = content.match(pattern);
  assert.ok(match, `Could not find route marker ${marker}`);

  const quote = match[0].trim().startsWith("'") ? "'" : '"';
  const separator = match[0].includes(",") ? "" : ",";
  return content.replace(
    pattern,
    `${match[0]}${separator}\n  ${quote}${route}${quote},`,
  );
}

const federalWorkSnippet = `
      <section
        aria-labelledby="federal-contracting-case-study"
        style={{
          width: "min(1120px, calc(100% - 2rem))",
          margin: "3rem auto 0",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          border: "1px solid rgba(111, 174, 255, 0.28)",
          borderRadius: "1.1rem",
          background: "linear-gradient(135deg, rgba(19, 48, 82, 0.9), rgba(10, 23, 40, 0.92))",
        }}
      >
        <p style={{ margin: 0, color: "#83b8ff", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.78rem" }}>
          Full case study
        </p>
        <h2 id="federal-contracting-case-study" style={{ margin: "0.7rem 0 0", fontSize: "clamp(1.75rem, 4vw, 2.8rem)" }}>
          Federal Contracting Performance
        </h2>
        <p style={{ maxWidth: "760px", margin: "1rem 0 0", color: "#bdc9da", lineHeight: 1.7 }}>
          See how 19.2 million public award rows were modeled, compressed, reconciled, and translated into decision-ready Power BI measures covering $2.27 trillion in obligations.
        </p>
        <Link
          href="/work/federal-contracting-performance/"
          style={{ display: "inline-flex", marginTop: "1.25rem", padding: "0.75rem 1rem", borderRadius: "0.7rem", background: "#f3f7fd", color: "#0b1728", fontWeight: 750, textDecoration: "none" }}
        >
          Read the Federal Contracting case study →
        </Link>
      </section>
`;

const federalHomeSnippet = `
      <section
        aria-labelledby="home-federal-case-study"
        style={{
          width: "min(1120px, calc(100% - 2rem))",
          margin: "2rem auto clamp(3rem, 7vw, 6rem)",
          padding: "clamp(1.4rem, 4vw, 2.2rem)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "1rem",
          background: "rgba(14, 31, 52, 0.86)",
        }}
      >
        <p style={{ margin: 0, color: "#83b8ff", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.78rem" }}>
          New detailed case study
        </p>
        <h2 id="home-federal-case-study" style={{ margin: "0.65rem 0 0", fontSize: "clamp(1.6rem, 4vw, 2.65rem)" }}>
          Federal Contracting Performance
        </h2>
        <p style={{ maxWidth: "750px", margin: "0.9rem 0 0", color: "#bdc9da", lineHeight: 1.7 }}>
          A transparent walkthrough of the model, KPI logic, reconciliation, results, and limitations behind the 19.2-million-row Power BI portfolio build.
        </p>
        <Link
          href="/work/federal-contracting-performance/"
          style={{ display: "inline-flex", marginTop: "1.15rem", color: "#d9eaff", fontWeight: 750, textUnderlineOffset: "0.22em" }}
        >
          Explore the case study →
        </Link>
      </section>
`;

let workPage = ensureLinkImport(await read("app/work/page.tsx"));
workPage = insertBeforeClosingMain(
  workPage,
  federalWorkSnippet,
  'id="federal-contracting-case-study"',
);
await write("app/work/page.tsx", workPage);

let homePage = ensureLinkImport(await read("app/page.tsx"));
homePage = insertBeforeClosingMain(
  homePage,
  federalHomeSnippet,
  'id="home-federal-case-study"',
);
await write("app/page.tsx", homePage);

let sitemap = await read("app/sitemap.ts");
sitemap = addRouteAfter(
  sitemap,
  "/work/washington-ev-market",
  "/work/federal-contracting-performance",
);
await write("app/sitemap.ts", sitemap);

let exporter = await read("scripts/export-static.mjs");
exporter = addRouteAfter(
  exporter,
  "/work/washington-ev-market",
  "/work/federal-contracting-performance/",
);
await write("scripts/export-static.mjs", exporter);

let liveChecker = await read("scripts/check-live-site.mjs");
if (!liveChecker.includes("/work/federal-contracting-performance/")) {
  const marker = `  { path: "/work/washington-ev-market/", contains: ["Washington EV Market Overview"] },`;
  assert.ok(liveChecker.includes(marker), "Could not find live-check page marker");
  liveChecker = liveChecker.replace(
    marker,
    `${marker}\n  { path: "/work/federal-contracting-performance/", contains: ["Federal Contracting Performance", "19.2M", "independent public data"] },`,
  );
  await write("scripts/check-live-site.mjs", liveChecker);
}

const packageJson = JSON.parse(await read("package.json"));
const verifyRelease = packageJson.scripts?.["verify:release"];
assert.equal(typeof verifyRelease, "string", "verify:release script is missing");
if (!verifyRelease.includes("verify-federal-case.mjs")) {
  packageJson.scripts["verify:release"] =
    `${verifyRelease} && node scripts/verify-federal-case.mjs`;
  await write("package.json", `${JSON.stringify(packageJson, null, 2)}\n`);
}

let renderedTests = await read("tests/rendered-html.test.mjs");
if (!renderedTests.includes("renders the dedicated federal contracting case study")) {
  renderedTests += `

test("renders the dedicated federal contracting case study", async () => {
  const response = await render("/work/federal-contracting-performance/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Federal Contracting Performance/i);
  assert.match(html, /19\\.2M/);
  assert.match(html, /\\$2\\.27T/);
  assert.match(html, /68\\.2%/);
  assert.match(html, /22\\.9%/);
  assert.match(html, /FY2023/);
  assert.match(html, /FY2024/);
  assert.match(html, /FY2025/);
  assert.match(html, /independent public data/i);
  assert.match(html, /not presented as[\\s\\S]*Confia Solutions/i);
  assert.match(html, /federal-contracting-dashboard\\.jpg/i);
  assert.doesNotMatch(html, /\\.pbix/i);

  const [workResponse, homeResponse] = await Promise.all([
    render("/work/"),
    render("/"),
  ]);
  assert.match(await workResponse.text(), /href="\\/work\\/federal-contracting-performance\\/?"/i);
  assert.match(await homeResponse.text(), /href="\\/work\\/federal-contracting-performance\\/?"/i);
});
`;
  await write("tests/rendered-html.test.mjs", renderedTests);
}

console.log("FEDERAL_CASE_STUDY_INTEGRATION_APPLIED");
