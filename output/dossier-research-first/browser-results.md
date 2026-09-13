# Step 12 browser acceptance results

Date: 2026-09-11 America/Los_Angeles  
Fixture: `MAT-DEMO-BEACON` in `output/dossier-research-first/browser-vault`  
Ports: backend 8199, frontend 3199

## Result by blueprint step

1. PASS — Opened the experimental chat and sent `Generate a dossier for this matter.` through the real composer.
2. PASS — The setup card showed three priorities, five mapped issue answers, three first-issue selectors, All-five scope, external-source choice, other-matter choice, public topic, and research options.
3. PASS — Changed priority 1 to `Confirm launch blockers and named owners`, selected All five, enabled external sources, supplied a public topic, and used the real Start control.
4. PASS — The fixture boundary reported three active workers with three distinct saved run IDs.
5. PASS — Releasing the first gate produced a first publication while two different workers remained active. The exact first-revision button opened that saved revision.
6. PASS — The first dossier showed the full checklist, cited reported facts, and proposed October 15, 2026 with the Product launch brief as its basis.
7. PASS — Real link clicks opened `launch-brief.md`, `issues.md`, and the saved external passage. The external view showed the synthetic written-consent rule and exception.
8. PASS — Entered `Unsent draft: confirm owner before launch.` and edited the open dossier in the real editor before later work completed.
9. PASS — The all-five update completed. The draft, chosen external document context, open document tabs, and lawyer edit survived. The later dossier appeared as a review revision.
10. PASS — Navigation away, reload, and return restored all-five completion, exact revision links, the draft, context, tabs, and edit.
11. PASS after repair — A mature saved dossier first exposed an internal 50,000-character validation defect. The generated research messages are now bounded while their full frozen context remains attached. A clean request then stopped with three interrupted children, survived a same-vault backend restart without `--reset`, resumed the same child IDs, and completed.
12. PASS after repair — The standard matter chat showed setup, three live workers, current running state after reload, and final exact revision. A saved card initially showed stale setup after reload; one scoped hydration read now restores the saved request state before active-only polling continues.
13. PASS — `Generate the dossier using saved material only.` added one writer call and no planning or research-worker call. `Generate dossier without saving.` added one writer call, showed `Dossier preview generated; no matter records changed.`, and added no request or revision. An earlier looser phrase entered the generic source-choice card but did not start research; the exact supported preview command was then used.
14. PASS — Each completed parent has unique child IDs and unique publication keys/paths. Successful retries reused their saved child IDs. The fixture contains five parent files: three completed requests and two preserved partial requests from the validation defect investigation. Those partial requests are separate user attempts, not duplicate children or publications.
15. PASS — The relevant existing acceptance areas were walked: B (editor save/reload), C (saved chat and trace), D (research source states), G (vault isolation), H (background research, editable dossier, revisions), and the isolated-browser procedure. Other historical product areas were not claimed as newly exercised.

## Boundary counts

The saved final boundary counters are in `browser-boundary-counts.json` and the fixture vault record `00_System/dossier-research-browser-stats.md`.

- First all-five completion: 23 model calls, 1 planning call, 5 worker starts, 20 research-model calls, 2 writer calls, and 5 fetched passages.
- After the stop/restart/resume proof: 39 model calls, 4 planning calls, 11 cumulative worker starts, 29 cumulative research-model calls, and 3 writer calls.
- After standard-chat completion: 50 model calls, 5 planning calls, 14 cumulative worker starts, 38 cumulative research-model calls, and 4 writer calls.
- Final after saved-only and preview: 53 model calls, 5 planning calls, 14 cumulative worker starts, 38 cumulative research-model calls, and 6 writer calls.

The worker-start counter includes interrupted attempts. Completed model calls were not repeated during same-child resume.

## Artifacts

- `browser-standard-all-five-complete.png` — saved five-of-five request rendered through the actual standard matter-chat component, with exact first/latest revision controls and completed issue rows.
- `browser-standard-saved-preview.png` — saved standard matter-chat no-save preview with its exact user command and generated result.
- `browser-backend.log` and `browser-frontend.log` — owned fixture service logs.

## Limits and safety record

- Model, search, and fetch boundaries were deterministic fakes. This proves application behavior, not legal research quality.
- The full browser used a desktop viewport. Narrow-screen and 200% zoom checks were not part of this blueprint.
- During the first fixture smoke attempt, the fixture incorrectly used `ActiveContextManager`. Before the request failed, it rebuilt the disposable SQLite index in the saved active Mosaic Relay vault. No server started, no active-vault pointer changed, and no Markdown source file was changed. The fixture was changed to construct `AppContext` directly from the owned path and now rejects both configured and saved-active vault paths. The two cache temporary files created by that rebuild were left untouched because later instructions prohibited further writes in the active vault.
- The real Harbor dossier still matches the saved baseline SHA-256 `43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2`. The active pointer remained `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3` with SHA-256 `7116f19dcdb721ad716f5e95e46f144b5ad55f4973e3bb8787fe809d1feadcd2`.
- The accidental initial phrase `Generate a hypothetical preview of the dossier without saving.` did not match the supported direct command form and opened a source-choice card. No research started. The exact documented command `Generate dossier without saving.` passed.

All execution-owned servers were stopped. Ports 8199 and 3199 were clear after cleanup. The temporary browser tabs and screenshot processes were also closed.
