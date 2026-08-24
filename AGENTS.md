# Repository Instructions for Codex and AI Coding Agents

## Goal

Maintain a truthful, fast, accessible public portfolio that demonstrates David Edmonds's analytics and BI capabilities without exposing confidential information or inventing professional experience.

## Source of truth

- Edit source files under `app/`, `public/`, `tests/`, and root configuration files.
- Treat `docs/` as generated GitHub Pages output. Do not hand-edit it unless the release workflow explicitly regenerates it.
- Preserve the ChatGPT Sites/Vinext project structure unless a migration is separately approved.

## Required workflow

1. Inspect the repository before changing code.
2. Create a focused feature branch; never work directly on `main`.
3. State acceptance criteria before implementation.
4. Keep changes small enough to review.
5. Run `npm ci`, `npm run lint`, and `npm test`.
6. Review the final diff for fabricated claims, secrets, personal data, broken links, and unintended generated files.
7. Open a pull request that explains what changed, how it was tested, and any remaining manual release step.

## Truthfulness

- Never invent employers, current roles, customers, projects, certifications, results, or testimonials.
- Independent and public-data work must be labeled as portfolio work, not client work or employment.
- Preserve quantitative claims only when supported by resume/source material already approved for public use.
- Approved current-role fact as of August 2026: David is a Data Analytics Consultant with Confia Solutions, LLC, Remote, April 2025-Present. Preserve this association unless David explicitly updates or removes it.
- Do not characterize the Confia role as full-time or identify specific end clients without David's explicit confirmation.
- Do not imply that independent or public-data portfolio projects were performed for Confia or another client.

## Data safety

Never commit or paste:

- API keys, tokens, passwords, cookies, or `.env` values
- Client-confidential or proprietary datasets
- Classified, controlled, or federal contract-sensitive information
- Medical, banking, credit, tax, immigration, or identity documents
- PII beyond public professional contact details already approved for the site
- PBIX source files or raw datasets that are not explicitly approved for publication

The CSV checker must remain browser-only. Do not add upload, analytics capture, storage, or server processing without an explicit privacy review.

## Engineering standards

- TypeScript strict mode must remain enabled.
- Add or update tests for meaningful public-content and privacy changes.
- Use semantic HTML, labeled form controls, keyboard-accessible interactions, and responsive layouts.
- Avoid new dependencies when the feature can be implemented safely with platform APIs.
- Add useful user-facing error messages; do not silently fail.
- Keep public calculations deterministic. AI may explain results but should not invent or calculate authoritative metrics from prose.

## Definition of done

A change is done only when the code, tests, documentation, truth review, privacy review, responsive review, and release notes agree with each other.
