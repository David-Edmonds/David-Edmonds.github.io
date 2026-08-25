import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders a concise multi-page professional homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>David Edmonds — Senior Data Analyst &amp; BI Professional<\/title>/i);
  assert.match(html, /Complex data\./);
  assert.match(html, /Washington EV Market Overview/);
  assert.match(html, /Federal Contracting Performance/);
  assert.match(html, /src="\/federal-contracting-dashboard\.jpg"/);
  assert.match(html, /href="\/services"/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/tools"/);
  assert.match(html, /Open the analytics lab/);
  assert.match(html, /Confia Solutions, LLC/);
});

test("renders every main page and keeps the public portfolio truthful and sanitized", async () => {
  const [caseResponse, federalResponse, workResponse, servicesResponse, aboutResponse, toolsResponse, contactResponse, workSource, aboutSource, layoutSource, chromeSource, publicFiles] = await Promise.all([
    render("/work/washington-ev-market"),
    render("/work/federal-contracting-performance"),
    render("/work"),
    render("/services"),
    render("/about"),
    render("/tools"),
    render("/contact"),
    readFile(new URL("../app/work/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteChrome.tsx", import.meta.url), "utf8"),
    readdir(new URL("../public/", import.meta.url)),
  ]);

  for (const response of [caseResponse, federalResponse, workResponse, servicesResponse, aboutResponse, toolsResponse, contactResponse]) assert.equal(response.status, 200);
  const caseHtml = await caseResponse.text();
  const federalHtml = await federalResponse.text();
  const workHtml = await workResponse.text();
  const toolsHtml = await toolsResponse.text();
  assert.match(caseHtml, /Washington EV Market Overview/);
  assert.match(caseHtml, /public\.tableau\.com/);
  assert.match(federalHtml, /Federal Contracting Performance/i);
  assert.match(federalHtml, /19\.2M/);
  assert.match(federalHtml, /\$2\.27T/);
  assert.match(federalHtml, /different denominators/i);
  assert.match(federalHtml, /not presented as[\s\S]*Confia Solutions/i);
  assert.doesNotMatch(federalHtml, /\.pbix/i);
  assert.match(workHtml, /PBIX and source files are not published/);
  assert.match(workHtml, /CURRENT ROLE · CONFIA SOLUTIONS/);
  assert.match(workHtml, /Recruiting &amp; Operational Analytics/);
  assert.match(toolsHtml, /Reporting time &amp; cost calculator/);
  assert.match(toolsHtml, /CSV quality checker/);
  assert.match(toolsHtml, /never uploaded/i);
  assert.match(`${workSource}\n${aboutSource}`, /Confia Solutions/i);
  assert.match(workSource, /CURRENT ROLE · CONFIA SOLUTIONS, LLC/);
  assert.match(aboutSource, /Data Analytics Consultant \| Confia Solutions, LLC/);
  assert.match(workSource, /TABLEAU CASE STUDY/);
  assert.match(workSource, /POWER BI PUBLIC-DATA CASE STUDY/);
  assert.match(layoutSource, /https:\/\/david-edmonds\.github\.io/);
  assert.match(layoutSource, /worksFor/);
  assert.match(layoutSource, /Confia Solutions, LLC/);
  assert.match(chromeSource, /Confia Solutions, LLC/);
  assert.doesNotMatch(`${workSource}\n${aboutSource}\n${layoutSource}\n${chromeSource}`, /Confia[^\n]*(full[- ]time|named end client|client name)/i);
  assert.doesNotMatch(workSource, /(href|src)=[^\n]*\.pbix/i);
  assert.equal(publicFiles.some((name) => name.toLowerCase().endsWith(".pbix")), false);
  await access(new URL("../public/federal-contracting-dashboard.jpg", import.meta.url));
});
