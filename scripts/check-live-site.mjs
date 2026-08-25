import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const siteUrl = new URL(process.env.SITE_URL ?? "https://david-edmonds.github.io/");
const expectedResumeBytes = 8_565;
const expectedResumeSha256 =
  "f5aeff11a397bb19fe508b7f4baa2592ad79d0faf428220ff90648728d1d9d8d";

const pageChecks = [
  { path: "/", contains: ["Confia Solutions, LLC", "Senior Data Analyst"] },
  { path: "/about/", contains: ["Data Analytics Consultant", "Confia Solutions, LLC"] },
  { path: "/contact/", contains: ["Contact", "David Edmonds"] },
  { path: "/services/", contains: ["Services", "Power BI"] },
  { path: "/tools/", contains: ["CSV quality checker", "never uploaded"] },
  { path: "/work/", contains: ["Federal Contracting Performance", "Washington EV Market Overview"] },
  { path: "/work/federal-contracting-performance/", contains: ["Federal Contracting Performance", "19.2M", "independent public data"] },
  { path: "/work/washington-ev-market/", contains: ["Washington EV Market Overview"] },
];

const requiredAssets = [
  { path: "/robots.txt", contentType: /text\/plain/i },
  { path: "/sitemap.xml", contentType: /(?:application|text)\/xml/i },
];

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchWithRetry(url, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "David-Analytics-Lab-site-health/1.0",
          accept: "*/*",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      });

      if (response.status >= 500 && attempt < attempts) {
        await sleep(attempt * 1_500);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await sleep(attempt * 1_500);
      }
    }
  }

  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

function sameOriginInternalLinks(html) {
  const links = new Set();
  const pattern = /href=["']([^"'#?]+(?:\?[^"'#]*)?)["']/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const href = match[1].trim();
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

    const url = new URL(href, siteUrl);
    if (url.origin === siteUrl.origin) {
      url.hash = "";
      links.add(url.href);
    }
  }

  return links;
}

async function checkHtmlPage(check) {
  const url = new URL(check.path, siteUrl);
  const response = await fetchWithRetry(url);
  assert.equal(response.status, 200, `${url.href} returned ${response.status}`);
  assert.match(
    response.headers.get("content-type") ?? "",
    /text\/html/i,
    `${url.href} did not return HTML`,
  );

  const html = await response.text();
  for (const expected of check.contains) {
    assert.match(
      html,
      new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      `${url.href} is missing expected text: ${expected}`,
    );
  }

  assert.doesNotMatch(
    html,
    /chatgpt\.site/i,
    `${url.href} still contains a stale chatgpt.site URL`,
  );

  return { url, html };
}

async function checkInternalLink(url) {
  const response = await fetchWithRetry(url);
  assert.ok(
    response.status >= 200 && response.status < 400,
    `${url} returned ${response.status}`,
  );
}

async function checkResume() {
  const url = new URL("/david-edmonds-resume.pdf", siteUrl);
  const response = await fetchWithRetry(url);
  assert.equal(response.status, 200, `${url.href} returned ${response.status}`);
  assert.match(
    response.headers.get("content-type") ?? "",
    /application\/pdf/i,
    `${url.href} did not return a PDF`,
  );

  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-", "Résumé is not a valid PDF header");
  assert.equal(
    bytes.length,
    expectedResumeBytes,
    `Résumé size changed: expected ${expectedResumeBytes}, received ${bytes.length}`,
  );

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  assert.equal(
    sha256,
    expectedResumeSha256,
    `Résumé checksum changed: expected ${expectedResumeSha256}, received ${sha256}`,
  );

  return bytes.length;
}

async function main() {
  console.log(`Checking ${siteUrl.href}`);

  const internalLinks = new Set();
  for (const pageCheck of pageChecks) {
    const { url, html } = await checkHtmlPage(pageCheck);
    console.log(`PASS page ${url.pathname}`);
    for (const link of sameOriginInternalLinks(html)) internalLinks.add(link);
  }

  for (const asset of requiredAssets) {
    const url = new URL(asset.path, siteUrl);
    const response = await fetchWithRetry(url);
    assert.equal(response.status, 200, `${url.href} returned ${response.status}`);
    assert.match(
      response.headers.get("content-type") ?? "",
      asset.contentType,
      `${url.href} returned an unexpected content type`,
    );
    console.log(`PASS asset ${url.pathname}`);
  }

  const resumeBytes = await checkResume();
  console.log(`PASS résumé ${resumeBytes} bytes, checksum verified`);

  for (const link of [...internalLinks].sort()) {
    await checkInternalLink(link);
  }
  console.log(`PASS ${internalLinks.size} internal links`);
  console.log("LIVE_SITE_HEALTH_PASSED");
}

main().catch((error) => {
  console.error("LIVE_SITE_HEALTH_FAILED");
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
