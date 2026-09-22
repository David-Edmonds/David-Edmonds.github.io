# Startup Operations Tableau case study

Prepared for https://david-edmonds.github.io/work/startup-operations/ with discovery links on the homepage and Work gallery.

## Scope

Seven actual Tableau screenshots, an editable packaged workbook, dashboard explanations, analytic definitions, synthetic-data labels and refresh limitations. The workbook is an independent fictional-data project. No Tableau Public upload or live connection is included.

The public workbook copy removes two temporary local source-directory paths. Both embedded Hyper extracts remain byte-identical to the latest locally saved Expanded workbook. The original workbook in David's folder remains unchanged.

## Validation

- Dependency installation completed with npm ci. Local Windows build required the matching Lightning CSS native package installed without changing package.json or package-lock.json. This local install re-resolved some installed dependencies; clean locked Linux CI remains required before merge.
- ESLint: zero errors, image-element warnings consistent with existing static-page image usage.
- Production build and static export passed.
- All 20 rendered/analytic tests and 14 static-export tests passed.
- Federal case-study verification passed.
- Desktop 1440px and mobile 390px: homepage, Work gallery and case page load without horizontal overflow; all seven case screenshots load.
- Extra tsc check reports missing Cloudflare environment types in existing db/index.ts and worker/index.ts, outside this change.
- No generated docs should be committed in the feature change; the existing main-branch workflow regenerates them after merge.

## Release

Obtain publication approval for this scope, push the focused branch, open a pull request, inspect clean CI, then merge only within approved scope. Verify the live case page, homepage/Work links, all seven previews and workbook download after the Pages workflow completes. Prepared locally is not published.
