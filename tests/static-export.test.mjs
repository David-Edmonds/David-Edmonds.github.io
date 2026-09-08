import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");
const resumeSize = 8_565;
const resumeSha256 = "f5aeff11a397bb19fe508b7f4baa2592ad79d0faf428220ff90648728d1d9d8d";

test('sales projects connect through a scoped planner case study', async () => {
  const routes=['sales-profitability','sql-sales-investigation','profit-scenario-planner'];
  for(const route of routes){
    const html=await readFile(join(docs,`work/${route}/index.html`),'utf8');
    assert.match(html,/Connected sales projects/);
    for(const related of routes) assert.ok(html.includes(`href="/work/${related}"`));
    assert.match(html,/separate monthly example/);
    assert.match(html,/does not import or forecast the dashboard results/);
  }
  const planner=await readFile(join(docs,'work/profit-scenario-planner/index.html'),'utf8');
  for(const value of ['$15,000.00','$17,512.50','$2,512.50','$94,762.50']) assert.ok(planner.includes(value));
  assert.match(planner,/not a forecast of demand/);
  assert.match(planner,/href="\/tools\/profit-planner"/);
  assert.match(await readFile(join(docs,'work/index.html'),'utf8'),/href="\/work\/profit-scenario-planner"/);
  const brief=await readFile(join(docs,'work/executive-brief/index.html'),'utf8');
  assert.match(brief,/Sales grew faster than profit/);
  assert.match(brief,/\$302,455\.59/);
  assert.match(brief,/does not prove whether pricing/);
  assert.match(brief,/href="\/executive-brief\.pdf"/);
  assert.match(await readFile(join(docs,'tools/profit-planner/index.html'),'utf8'),/href="\/work\/profit-scenario-planner"/);
  assert.match(await readFile(join(docs,'review/index.html'),'utf8'),/name="project_connections"/);
});

test('profit planner publishes complete results and keeps assumptions local', async () => {
  const html=await readFile(join(docs,'tools/profit-planner/index.html'),'utf8');
  assert.match(html,/Profit Scenario Planner/);
  assert.match(html,/\$17,513/);
  assert.match(html,/Break-even units/);
  assert.match(html,/Download scenario summary/);
  const source=await readFile(join(root,'app/tools/profit-planner/Planner.tsx'),'utf8');
  assert.doesNotMatch(source,/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
  assert.match(await readFile(join(docs,'tools/index.html'),'utf8'),/href="\/tools\/profit-planner"/);
  assert.match(await readFile(join(docs,'sitemap.xml'),'utf8'),/tools\/profit-planner/);
  for (const [path,title] of [['sales-profitability','Sales &amp; Profitability in Excel'],['sql-sales-investigation','SQL Sales Investigation']]) {
    const page=await readFile(join(docs,`work/${path}/index.html`),'utf8');
    assert.ok(page.includes(`name="twitter:title" content="${title} | David Edmonds"`));
  }
});

test('review exports a noindex form with local-only response download', async () => {
  const html = await readFile(join(docs, 'review/index.html'), 'utf8');
  const script = await readFile(join(docs, 'review/review.js'), 'utf8');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.match(html, /Stop before sending a message or submitting an inquiry/);
  assert.match(html, /Downloading does not send it/);
  assert.equal((html.match(/<fieldset>/g) || []).length, 3);
  assert.doesNotMatch(html + script, /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
  assert.match(script, /new Blob/);
  assert.match(script, /URL.revokeObjectURL/);
  for (const match of html.matchAll(/<(?:input|select|textarea) id="([^"]+)"/g)) {
    assert.ok(html.includes(`for="${match[1]}"`), `Missing label: ${match[1]}`);
  }
  assert.deepEqual(await readFile(join(docs, 'review/review.js')), await readFile(join(root, 'public/review/review.js')));
});

test("worked example and capability download are published without upload behavior",async()=>{
 const analyzer=await readFile(join(docs,'tools/what-changed/index.html'),'utf8');
 assert.match(analyzer,/id="worked-example"/);
 assert.match(analyzer,/Changed unique IDs/);
 assert.match(analyzer,/\$116,000/);assert.match(analyzer,/\$145,000/);assert.match(analyzer,/\$22,000/);
 assert.match(analyzer,/does not prove a newly acquired customer/);
 assert.match(analyzer,/Nothing is uploaded/);
 const services=await readFile(join(docs,'services/index.html'),'utf8');
 assert.match(services,/href="\/david-edmonds-capability-statement.pdf"/);
 assert.deepEqual(await readFile(join(docs,'david-edmonds-capability-statement.pdf')),await readFile(join(root,'public/david-edmonds-capability-statement.pdf')));
 for(const file of ['page.tsx','WorkedExample.tsx']){
  const source=await readFile(join(root,'app/tools/what-changed',file),'utf8');
  assert.doesNotMatch(source,/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
 }
});

const htmlFiles = [
  "index.html",
  "404.html",
  "about/index.html",
  "contact/index.html",
  "services/index.html",
  "tools/index.html",
  "tools/what-changed/index.html",
  "tools/profit-planner/index.html",
  "work/index.html",
  "work/sales-profitability/index.html",
  "work/profit-scenario-planner/index.html",
  "work/executive-brief/index.html",
  "work/sql-sales-investigation/index.html",
  "work/federal-contracting-performance/index.html",
  "work/washington-ev-market/index.html",
];

test("Excel case study publishes its reviewed package and Work omits decorative numbering", async () => {
  const work = await readFile(join(docs, "work/index.html"), "utf8");
  const page = await readFile(join(docs, "work/sales-profitability/index.html"), "utf8");
  assert.match(work, /href="\/work\/sales-profitability"/);
  assert.doesNotMatch(work, /<span>0[1-9]<\/span>|0[1-9] · FEATURED/);
  assert.match(page, /fictional Northstar Supply data/);
  assert.match(page, /does not identify the business cause/);
  for (const file of ["sales-profitability-dashboard.xlsx", "sales-profitability-package.zip", "dashboard.pdf", "dashboard.png", "README.md"]) {
    const published = await readFile(join(docs, "sales-profitability", file));
    const source = await readFile(join(root, "public/sales-profitability", file));
    assert.deepEqual(published, source);
  }
});

test("each case study publishes three scoped findings with evidence", async () => {
  for (const route of ["sales-profitability", "sql-sales-investigation", "federal-contracting-performance", "washington-ev-market"]) {
    const html = await readFile(join(docs, `work/${route}/index.html`), "utf8");
    assert.match(html, /id="key-findings"/);
    assert.equal((html.match(/class="finding-metric"/g) || []).length, 3, route);
    assert.equal((html.match(/<span>Decision to inform<\/span>/g) || []).length, 3, route);
  }
  const ev = await readFile(join(docs, "work/washington-ev-market/index.html"), "utf8");
  assert.match(ev, /July 30, 2026/);
  assert.match(ev, /not registration dates/);
  const federal = await readFile(join(docs, "work/federal-contracting-performance/index.html"), "utf8");
  assert.match(federal, /id="validated-results"/);
  assert.match(federal, /id="quality-control"/);
});

test("video is available with controls, captions, transcript and exact exported assets", async () => {
  const page = await readFile(join(docs, "work/sales-profitability/index.html"), "utf8");
  assert.match(page, /<video[^>]*controls=""[^>]*preload="none"/);
  assert.match(page, /<track kind="captions"/);
  for (const name of ["dashboard-demo.mp4", "dashboard-demo.vtt", "demo-poster.jpg", "demo-transcript.md"]) {
    assert.deepEqual(await readFile(join(docs, "sales-profitability", name)), await readFile(join(root, "public/sales-profitability", name)));
  }
  const captions = await readFile(join(docs, "sales-profitability/dashboard-demo.vtt"), "utf8");
  assert.match(captions, /^WEBVTT/);
  assert.match(captions, /00:01:12\.000/);
  const transcript = await readFile(join(docs, "sales-profitability/demo-transcript.md"), "utf8");
  assert.match(transcript, /exported workbook views, not a recording of mouse clicks/);
});

test("SQL investigation, walkthrough and three homepage projects form a complete path", async () => {
  const home=await readFile(join(docs,"index.html"),"utf8");
  const sql=await readFile(join(docs,"work/sql-sales-investigation/index.html"),"utf8");
  const excel=await readFile(join(docs,"work/sales-profitability/index.html"),"utf8");
  assert.match(home,/home-project-grid/);
  assert.match(home,/Take the walkthrough/);
  assert.match(home,/Read the SQL investigation/);
  assert.match(home,/Washington EV Market Overview/);
  assert.match(home,/Federal Contracting Performance/);
  assert.match(excel,/id="walkthrough"/);
  assert.match(excel,/aria-pressed="true"/);
  assert.match(excel,/These are guided previews/);
  assert.match(sql,/576 fictional monthly records/);
  assert.match(sql,/arithmetic, not causality/);
  assert.equal((sql.match(/href="\/sql-sales\/queries\/[^"]+">Read SQL/g)||[]).length,5);
  const results=JSON.parse(await readFile(join(docs,"sql-sales/results/results.json"),"utf8"));
  assert.equal(results["01_performance"][1].revenue,8242432.31);
  assert.equal(results["01_performance"][0].revenue_growth,null);
  assert.equal(results["04_category_pressure"][0].category,"Furniture");
  await access(join(docs,"sql-sales/sql-sales-project.zip"));
  await access(join(docs,"sales-profitability/walkthrough-filtered.png"));
});

function internalTargetToFile(target) {
  const clean = target.split(/[?#]/, 1)[0];
  if (!clean || !clean.startsWith("/")) return null;
  if (clean === "/") return join(docs, "index.html");
  if (/\.[a-z0-9]+$/i.test(clean)) return join(docs, clean.slice(1));
  return join(docs, clean.slice(1), "index.html");
}

test("static export contains every public route and approved positioning", async () => {
  for (const file of htmlFiles) await access(join(docs, file));

  const [home, tools, work, about, federalCaseStudy, evCaseStudy, sitemap, robots] = await Promise.all([
    readFile(join(docs, "index.html"), "utf8"),
    readFile(join(docs, "tools/index.html"), "utf8"),
    readFile(join(docs, "work/index.html"), "utf8"),
    readFile(join(docs, "about/index.html"), "utf8"),
    readFile(join(docs, "work/federal-contracting-performance/index.html"), "utf8"),
    readFile(join(docs, "work/washington-ev-market/index.html"), "utf8"),
    readFile(join(docs, "sitemap.xml"), "utf8"),
    readFile(join(docs, "robots.txt"), "utf8"),
  ]);

  assert.match(home, /<title>David Edmonds \| Data Analytics &amp; BI Consultant<\/title>/i);
  assert.match(home, /Confia Solutions, LLC/);
  assert.match(home, /href="\/tools"/);
  assert.match(tools, /CSV quality checker/);
  assert.match(tools, /never uploaded/i);
  assert.match(work, /CURRENT ROLE · CONFIA SOLUTIONS, LLC/);
  assert.match(about, /Data Analytics Consultant \| Confia Solutions, LLC/);
  assert.match(federalCaseStudy, /Federal Contracting Performance/i);
  assert.match(federalCaseStudy, /different denominators/i);
  assert.match(federalCaseStudy, /not presented as[\s\S]*Confia Solutions/i);
  assert.match(federalCaseStudy, /https:\/\/david-edmonds\.github\.io\/federal-contracting-dashboard\.jpg/);
  assert.match(evCaseStudy, /https:\/\/david-edmonds\.github\.io\/washington-ev-dashboard\.png/);
  assert.match(sitemap, /https:\/\/david-edmonds\.github\.io\/tools/);
  assert.match(sitemap, /https:\/\/david-edmonds\.github\.io\/work\/federal-contracting-performance/);
  assert.match(robots, /Sitemap: https:\/\/david-edmonds\.github\.io\/sitemap\.xml/);
  assert.doesNotMatch(`${home}\n${tools}\n${work}\n${about}\n${federalCaseStudy}\n${evCaseStudy}`, /http:\/\/localhost/i);
  assert.doesNotMatch(`${home}\n${tools}\n${work}\n${about}\n${federalCaseStudy}\n${evCaseStudy}`, /chatgpt\.site/i);
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

test("published resume exactly matches the reviewed PDF", async () => {
  const resumePath = join(docs, "david-edmonds-resume.pdf");
  const [info, buffer] = await Promise.all([
    stat(resumePath),
    readFile(resumePath),
  ]);

  assert.equal(buffer.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.equal(info.size, resumeSize);
  assert.equal(createHash("sha256").update(buffer).digest("hex"), resumeSha256);
});

test("consulting offers and project inquiries retain a clear contact path", async () => {
  for (const [route, topic, source] of [
    ["sales-profitability", "analysis", "sales"],
    ["sql-sales-investigation", "analysis", "sql"],
    ["federal-contracting-performance", "dashboards", "federal"],
    ["washington-ev-market", "dashboards", "ev"],
    ["executive-brief", "health-check", "brief"],
  ]) {
    const html = await readFile(join(docs, `work/${route}/index.html`), "utf8");
    assert.ok(html.includes(`/contact?topic=${topic}&amp;from=${source}#inquiry`), route);
    assert.match(html, /Discuss a similar project/);
  }
  const contact = await readFile(join(docs, "contact/index.html"), "utf8");
  assert.match(contact, /id="inquiry-topic"/);
  assert.match(contact, /id="inquiry-goal"/);
  assert.match(contact, /Nothing is sent until you send it there/);
  assert.match(contact, /mailto:boldproofanalytics@gmail.com\?subject=/);
  const services = await readFile(join(docs, "services/index.html"), "utf8");
  assert.equal((services.match(/>Discuss this service/g) || []).length, 3);
  for (const label of ['Reporting Health Check','Dashboard Build','Reporting Automation']) {
    assert.ok(services.includes(label));
    assert.ok(contact.includes(label));
  }
  const brief = await readFile(join(docs, 'work/executive-brief/index.html'), 'utf8');
  assert.doesNotMatch(brief, /CURRENT PROJECT/);
  const source = await readFile(join(root, 'app/contact/InquiryDraft.tsx'), 'utf8');
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/);
});
