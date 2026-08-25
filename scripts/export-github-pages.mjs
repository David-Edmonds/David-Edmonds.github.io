import { createHash } from "node:crypto";
import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const clientDir = join(distDir, "client");
const serverEntry = join(distDir, "server", "index.js");
const outputDir = join(root, "docs");
const origin = "https://david-edmonds.github.io";
const resumeSize = 8_565;
const resumeSha256 = "f5aeff11a397bb19fe508b7f4baa2592ad79d0faf428220ff90648728d1d9d8d";

const htmlRoutes = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/tools",
  "/work",
  "/work/washington-ev-market",
];

async function copyDirectoryContents(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    await cp(join(source, entry.name), join(destination, entry.name), {
      recursive: entry.isDirectory(),
      force: true,
    });
  }
}

async function writeResponse(worker, pathname, destination, accept) {
  const response = await worker.fetch(
    new Request(`${origin}${pathname}`, { headers: { accept } }),
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

  if (response.status >= 500) {
    throw new Error(`Rendering ${pathname} failed with HTTP ${response.status}`);
  }

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
  };
}

await access(clientDir);
await access(serverEntry);
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await copyDirectoryContents(clientDir, outputDir);

const workerUrl = pathToFileURL(serverEntry);
workerUrl.searchParams.set("static-export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

for (const route of htmlRoutes) {
  const destination = route === "/"
    ? join(outputDir, "index.html")
    : join(outputDir, route.slice(1), "index.html");
  const result = await writeResponse(worker, route, destination, "text/html");
  if (result.status !== 200 || !/^text\/html\b/i.test(result.contentType)) {
    throw new Error(`Unexpected response for ${route}: ${result.status} ${result.contentType}`);
  }
}

const notFound = await writeResponse(
  worker,
  "/__static_export_missing__",
  join(outputDir, "404.html"),
  "text/html",
);
if (notFound.status !== 404 || !/^text\/html\b/i.test(notFound.contentType)) {
  throw new Error(`Unexpected 404 response: ${notFound.status} ${notFound.contentType}`);
}

const robots = await writeResponse(worker, "/robots.txt", join(outputDir, "robots.txt"), "text/plain");
if (robots.status !== 200 || !/^text\/plain\b/i.test(robots.contentType)) {
  throw new Error(`Unexpected robots response: ${robots.status} ${robots.contentType}`);
}

const sitemap = await writeResponse(worker, "/sitemap.xml", join(outputDir, "sitemap.xml"), "application/xml");
if (sitemap.status !== 200 || !/xml/i.test(sitemap.contentType)) {
  throw new Error(`Unexpected sitemap response: ${sitemap.status} ${sitemap.contentType}`);
}

await writeFile(join(outputDir, ".nojekyll"), "");

const resumePath = join(outputDir, "david-edmonds-resume.pdf");
const [homeHtml, toolsHtml, resumeInfo, resumeBuffer] = await Promise.all([
  readFile(join(outputDir, "index.html"), "utf8"),
  readFile(join(outputDir, "tools", "index.html"), "utf8"),
  stat(resumePath),
  readFile(resumePath),
]);

if (!homeHtml.includes("Senior Data Analyst &amp; BI Professional") || !homeHtml.includes("Confia Solutions, LLC")) {
  throw new Error("Generated homepage is missing the approved positioning or current employer.");
}
if (!toolsHtml.includes("CSV quality checker") || !toolsHtml.match(/never uploaded/i)) {
  throw new Error("Generated tools page is missing the CSV checker or privacy statement.");
}
const actualResumeHash = createHash("sha256").update(resumeBuffer).digest("hex");
if (resumeInfo.size !== resumeSize || actualResumeHash !== resumeSha256) {
  throw new Error(`Generated resume does not match the reviewed release asset (${resumeInfo.size} bytes, ${actualResumeHash}).`);
}

console.log(`Static GitHub Pages export written to ${outputDir}`);
