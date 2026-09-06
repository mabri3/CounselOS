# Themis.ai live-result defect repair — final report

Date: 2026-09-02

## Result

The requested code changes and engineering gates are complete. The live release gate is **not met**.

The required Harborline ten-matter experiment stopped after seven attempts. Two fresh attorneys received the visible application error `Failed to fetch` after one retry. A later read-only health check found the frontend available and the backend health port unavailable. This is a documented runtime environment stop condition, not a completed ten-matter result.

## Delivered implementation

- C1: user-facing chat claims now reconcile with typed mutation results in immediate, history, timeout, and useful-partial paths.
- C2: the generic file and review routes reject indexed recommendation files; the typed recommendation panel remains the only supported route.
- C3: Matter Workspace has a full, polling research queue view and a compact summary.
- C4: Polaris failures expose only safe HTTP status data when it exists. Timeouts do not get invented status values.
- C5: all planned destructive confirmations use the shared accessible in-page dialog. Matter Workspace now includes recommendation routing, research state, conditional approval wording, and local-only manual delivery confirmation.

## Required routing and review

| Item | Assigned route | Result |
|---|---|---|
| C1 | Terra high | Accepted after one bounded correction and the required Sol-high escalation for the remaining decision phrase. |
| C2 | Terra high | Accepted. |
| C3 | Terra medium | Accepted. |
| C4 | Terra medium | Accepted. |
| C5 | Terra high | Accepted after removal of the confirmation bypass. |
| Combined review | Fresh Terra extra-high | All six review groups passed after corrections. |
| Escalation | Sol high, C1 only | Used once, after the documented second truth-result review finding. |

No commit, push, deployment, credential change, provider change, repository-vault write, or external delivery was performed.

## Engineering evidence

- Backend: `646 passed`; one existing Starlette/httpx deprecation warning.
- Frontend check scripts: all passed; existing Node module-type warnings only.
- Typecheck: passed.
- Production build: passed; 16 routes generated.
- Graphify update: passed; 8,966 nodes, 15,831 edges, 1,203 communities.
- `git diff --check`: passed.
- Tracked repository `vault/` content hash: `888514391970769d224fcb04b7496c7f9ce6aabbabf44343389bc9e0d60d0864`, equal to the Wave 0 baseline.

## Visible verification

- The fresh-vault lifecycle demo passed its core path: in-page cancellation, local-only manual delivery, conditional approval state, close blocking while required work remained, and persisted closure.
- Three independent manual-delivery recurrences passed. Each cancelled cleanly, recorded one local delivery after confirmation, and reloaded without duplicate delivery.
- The demo actor could not complete separate research, recommendation, and decision-path visual checks before its in-app browser session closed. This is not counted as a pass.

## Harborline experiment

Raw evidence: `tmp/harborline-live-result-recurrence-20260902/normalized-evidence.md`.

| Measure | Result |
|---|---|
| Planned matters | 10 |
| Attempted matters | 7 |
| Completed to safe boundary | 2 |
| Created but blocked during work | 3 |
| Blocked before creation | 2 |
| Not started | 3 |

Confirmed live product defects include unreadable merged draft text, duplicate draft records, premature decision-success language, stale lifecycle or queue state, stalled research without a visible completion/recovery path, and a saved deadline later rejected as unrelated. Recurrent friction includes long waits, auto-submitting or unclear intake controls, repeated save controls, and generic action errors.

The `Failed to fetch` stop is an environment/runtime failure. Browser connection resets, unavailable Chrome, and blank Safari accessibility state are also environment or tool failures. The evidence does not establish a technical root cause for them.

## Retry after runtime recovery

After this report was first written, a read-only log check found that the frontend had remained alive while Uvicorn had stopped cleanly. Restarting only the missing backend restored `/api/health`, `/api/ready`, and the dedicated-vault endpoint. Two fresh attorneys then created one new matter each: `MAT-20260902-7aec87` and `MAT-20260902-8a80f2`.

This rules out a persistent matter-creation defect. Both retries still stalled after intake: one stayed `Just came in` / `Waiting on Lawyer`, and the other stayed `Being researched` for more than 40 seconds after reload. Intake records and drafts persisted. The retry changes the diagnosis: availability was a stopped local backend process; stalled downstream processing remains a separate unresolved P1 workflow issue.

Read-only diagnosis after the retry found a likely reason for the long research wait. A run calls configured external research before it writes the useful fallback packet. The current default permits 90 seconds per attempt and two retries; it can then try a second external provider. The retry-07 queue still had one run `running` and its second batch item `queued`. This proves the queue had not reached its fallback or completion path. It does not prove which external call is slow; that needs request-level timing or a bounded live failure record.

## DeepSeek Flash configuration retry

The model catalog confirmed that `deepseek-v4-flash` is available. The workspace had a research fallback override that selected `kimi-k3-fast` for every research run, even though the Markdown Research Agent had another model setting. In the dedicated test vault only, the override was disabled and `research-agent` was set to `openai_compatible` / `deepseek-v4-flash` / `default`.

A fresh visible matter, `MAT-20260902-368a85`, confirmed that new research-run records selected DeepSeek V4 Flash. One run saved a partial research packet in approximately 11 seconds. A second run in that batch remained running after the bounded observation window, which preserves the separate external-research delay finding. The external-provider timeout was not increased: 90 seconds is per attempt, not the overall research budget, and increasing it would increase silent wait without proving a better first-pass result.

## Release-blocking repair backlog

| Priority | Repair | Acceptance condition |
|---|---|---|
| P0 | Restore live application availability and recovery. | Three fresh attorneys can open Settings and create separate matters after a cold start without `Failed to fetch` or duplicate creation. |
| P1 | Reconcile lifecycle and research state. | After reload, work has the correct phase; research reaches complete or failed; failure has Retry and Continue without research. |
| P1 | Protect artifact content and identity. | A long memo reopens with intact layout, and retrying save does not duplicate it. |
| P1 | Make decision claims match durable records. | Chat says `recorded` only after persistence; reload shows the same decision and keeps recommendations separate. |
| P2 | Make intake and save controls deterministic. | Choices require explicit Send, disabled controls reject input, and repeated save controls have unique accessible names. |

After P0 and P1 repair, run the complete fresh ten-matter experiment again before release.
