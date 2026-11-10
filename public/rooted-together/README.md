# Rooted Together

A seven-day Scripture devotional at https://david-edmonds.github.io/rooted-together/.

GitHub Pages serves the reading app. The existing role-authenticated service stores completion, readiness, meeting plans, and the shared Together workspace. Personal connection links authorize each person's own progress and shared answer; neither can overwrite the other person's answer. Comments append to a shared thread, use retry-safe IDs, and update every few seconds while Together is open.

Personal plans, private preparation and journal notes stay in browser storage, with backup/import. Text written in the clearly labelled shared answer and comment boxes is sent to the shared service. Old private answers are never automatically published.

Completion can save locally and continue when a connection is unavailable. Pending status is labelled honestly and syncs under the matching personal link later. The app's service worker is scoped to this folder and excludes the cross-origin API.

The release workflow generates docs/rooted-together from public/rooted-together; do not hand-edit docs. No personal links or private keys are stored in this repository.
