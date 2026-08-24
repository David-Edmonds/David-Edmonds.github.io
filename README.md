# David Edmonds — Data Analytics & BI Portfolio

A public, decision-focused portfolio for **David Edmonds**, a senior data analyst and BI professional specializing in Power BI, Tableau, SQL, Excel, KPI reporting, data quality, reporting improvement, and operational analytics.

**Live site:** [david-edmonds.github.io](https://david-edmonds.github.io/)

## What is included

- Washington EV Market Overview Tableau case study
- Federal Contracting Performance Power BI portfolio build
- Current Data Analytics Consultant role with Confia Solutions, LLC
- Sanitized defense analytics experience
- Reporting time and cost calculator
- Browser-only CSV quality checker
- Downloadable professional resume
- Multi-page responsive portfolio built with the ChatGPT Sites/Vinext stack

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Before opening a pull request:

```bash
npm run lint
npm test
```

`npm test` builds the site and runs the rendered-HTML checks in `tests/`.

## Repository structure

```text
app/                  Source pages and components
app/tools/            Browser-based analytics tools
public/               Public images and resume PDF
tests/                Rendered-page and privacy checks
docs/                 Generated GitHub Pages export
project-docs/AI_WORKFLOW.md   ChatGPT/Codex operating workflow
project-docs/ROADMAP.md       Prioritized product roadmap
AGENTS.md              Repository instructions for Codex and other agents
```

## Publishing rule

`app/` is the source of truth. The `docs/` directory is generated output for GitHub Pages and should not be hand-edited. Build and review source changes first, then regenerate the public export through the established Sites/build workflow.

## Truth and privacy rules

- Do not invent employers, clients, engagements, results, testimonials, or credentials.
- Approved current-role fact as of August 2026: Data Analytics Consultant with Confia Solutions, LLC, Remote, April 2025-Present. Do not imply full-time status or named end clients without explicit confirmation.
- Clearly label public-data and independent portfolio projects.
- Never commit client data, federal contract-sensitive information, classified material, protected health information, financial records, PII, credentials, API keys, or confidential source files.
- The CSV quality checker operates entirely in the visitor's browser. It does not upload or store the selected file.
- Only public, synthetic, or properly sanitized examples belong in this repository.

See [AGENTS.md](AGENTS.md) for the required AI-assisted development workflow.
