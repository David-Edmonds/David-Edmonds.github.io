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

test("server-renders the professional portfolio and both featured dashboards", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>David Edmonds — Data Analytics &amp; BI Consultant<\/title>/i);
  assert.match(html, /Complex data\./);
  assert.match(html, /Washington EV Market Overview/);
  assert.match(html, /Federal Contracting Performance/);
  assert.match(html, /src="\/federal-contracting-dashboard\.jpg"/);
  assert.match(html, /PBIX and source files are not published/);
  assert.match(html, /Reporting time &amp; cost calculator/);
  assert.doesNotMatch(html, /CSV quality checker/);
});

test("keeps the public portfolio sanitized and preserves the Tableau case study", async () => {
  const [caseResponse, pageSource, publicFiles] = await Promise.all([
    render("/work/washington-ev-market"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readdir(new URL("../public/", import.meta.url)),
  ]);

  assert.equal(caseResponse.status, 200);
  const caseHtml = await caseResponse.text();
  assert.match(caseHtml, /Washington EV Market Overview/);
  assert.match(caseHtml, /public\.tableau\.com/);
  assert.doesNotMatch(pageSource, /\.pbix/i);
  assert.equal(publicFiles.some((name) => name.toLowerCase().endsWith(".pbix")), false);
  await access(new URL("../public/federal-contracting-dashboard.jpg", import.meta.url));
});
