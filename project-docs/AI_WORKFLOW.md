# David AI Build Lab — Operating Workflow

This repository is the first production project in David's AI build system. The goal is to use ChatGPT for planning and review, Codex for repository changes, GitHub for version control, and the smallest necessary set of external services.

## Tool routing

| Need | Use |
|---|---|
| Clarify an idea, compare options, or write acceptance criteria | ChatGPT conversation |
| Multi-step research or a durable report | ChatGPT Work |
| Implement, test, refactor, or review repository code | Codex |
| Store code, issues, pull requests, and release history | GitHub |
| Current portfolio hosting | ChatGPT Sites / existing GitHub Pages workflow |
| Database, login, storage, or server-side records | Supabase, only when a real feature needs it |
| Alternate app preview/production hosting | Vercel, only if the project migrates from the current Sites stack |
| Social scheduling | Buffer |
| Human-editable content operations | Airtable, only when the custom content system is built |

## Standard build loop

1. **Brief** — define the user, problem, outcome, constraints, and acceptance criteria.
2. **Issue** — create one GitHub issue per meaningful feature or bug.
3. **Branch** — use `feature/`, `fix/`, `content/`, or `chore/` plus a short description.
4. **Implement** — ask Codex to inspect first, then change the smallest viable surface.
5. **Verify** — run lint, tests, build, privacy checks, and responsive review.
6. **Pull request** — explain the decision, not just the files changed.
7. **Release** — merge only after checks pass; regenerate generated hosting output through the approved workflow.
8. **Learn** — record defects, user feedback, and the next highest-value improvement.

## Reusable Codex task format

```text
Repository: David-Edmonds/David-Edmonds.github.io

Goal:
[One outcome]

Context:
[Why it matters and relevant existing behavior]

Acceptance criteria:
- [Observable result]
- [Observable result]

Constraints:
- Inspect the repository before editing.
- Work on a new branch; do not change main directly.
- Do not fabricate professional claims.
- Do not expose secrets or sensitive data.
- Preserve the existing Sites/Vinext architecture unless explicitly told otherwise.
- Run npm ci, npm run lint, and npm test.
- Open a pull request with test results and any manual release step.
```

## Service rule

Use this order to avoid unnecessary complexity:

1. Native ChatGPT capability
2. Existing connected app
3. Official API
4. Small visual automation
5. Custom code

Do not add Supabase, Vercel, Airtable, Zapier, Make, or n8n merely because they are available. Add a service only when a defined feature needs it.
