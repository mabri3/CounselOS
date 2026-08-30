# Progress — guided skills

Update this file after EACH step. Only change the line for the step being updated.

Before starting, read this file. Do not redo steps marked `done`; begin at the first pending step. After each step, run its verification, then immediately change its line to `- [x] ... — done`. On failure, write `— FAILED: <what happened>` and follow the blocker policy in the prompt. Do not batch progress updates at the end.

If a step says `done` but its verification now fails, stop and report instead of reapplying the edit.

## Starting state

- [x] Handoff plan written — done
- [x] Baseline backend result recorded: 70 passed and four pre-existing sample-vault failures — done
- [x] Baseline frontend typecheck and production build passed — done

## Implementation

- [x] Step 1: Add the skill registry and record contract — done
- [x] Step 2: Add ordered questions, draft generation, and evidence collection — done
- [x] Step 3: Add evidence-backed repeated-work suggestions — done
- [x] Step 4: Wire the skills API and runtime — done
- [x] Step 5: Apply one skill to chat and persist the disclosure — done
- [x] Step 6: Add frontend contracts and API functions — done
- [x] Step 7: Build the guided Skills page — done
- [x] Step 8: Add chat discovery, builder routing, and applied-skill labels — done
- [x] Step 9: Update documentation and run complete verification — done
- [x] Acceptance check: Browser demo completed and recorded — done
- [x] Graph update and final diff check — done

## Work log

- 2026-08-28: Plan and clean-context handoff created. No application code changed.
- 2026-08-28: `./scripts/verify.sh` reported 70 passed and four pre-existing failures caused by current sample-vault data. Frontend `npm run typecheck && npm run build` passed separately.
- 2026-08-28: Step 1 failed first with missing `app.skills`, then passed: 4 selected tests passed with the exact registry/invocation/Markdown command.
- 2026-08-28: Step 2 failed first with missing `skill_builder`; after implementation, the focused command passed 5 tests. The reader also skips the known malformed Harbor transcript.
- 2026-08-28: Step 3 failed first because `suggestions()` did not exist, then passed all 4 hostile-output suggestion tests.
- 2026-08-28: Step 4 first returned HTTP 404 for all Skills API routes, then passed all 4 focused API tests after runtime and router wiring.
- 2026-08-28: Step 5 first failed all 5 selected skill/disclosure tests, then passed all 5. The two named tests omitted by the exact filters also passed directly.
- 2026-08-28: Step 6 frontend contract, API, and pure-helper changes passed `npm run typecheck`.
- 2026-08-28: Step 7 passed frontend typecheck and production build. The build includes the dynamic `/skills` route.
- 2026-08-28: Step 8 passed frontend typecheck and production build with slash discovery, builder routing, and persisted applied-skill labels in both chats.
- 2026-08-28: Step 9 focused backend proof passed 46 tests; frontend typecheck and production build passed with `/skills`; full verification reported 96 passed and only the three known Apex annotation failures. The former Harbor parsing failure now passes after the chat-safe frontmatter delimiter fix.
- 2026-08-28: Browser acceptance passed in `MAT-DEMO-BEACON`: ordered questions, early build plus final optional question, unsaved editable draft, explicit save, slash discovery, immediate and reloaded applied-skill label, existing chat controls, and the honest mock suggestion warning were all observed. Suggestion review left the saved skill hash and modification time unchanged.
- 2026-08-28: `graphify update .` rebuilt the code graph with 1,896 nodes and 3,566 edges; `git diff --check` passed.
- 2026-08-28: Final review fixed the rules-question **Something else** toggle. Frontend typecheck and production build passed again; Graphify reported no further topology change and `git diff --check` passed again.
- 2026-08-28: Follow-up in-app browser audit covered every main page, all Matters views, all Settings sections, the full Skills flow, both slash menus, Beacon reload state, and 1,024/768-pixel layouts. It fixed duplicate existing-skill suggestions, stale suggestion cards, missing progress and empty-result text, technical wording, and stacked admin-rail width. Focused proof passed 47 tests; frontend typecheck/build passed; full verification reported 97 passed and only the three known Apex annotation failures.
- 2026-08-28: Final Graphify refresh rebuilt 1,899 nodes and 3,573 edges; `git diff --check` passed.
- 2026-08-28: Real-provider legal use cases passed in the in-app browser for product-launch advice, customer-response risk review, cross-matter decision review, reload persistence, and evidence-backed skill suggestions. The review found that chat-based decision checks changed `audited_at` despite a no-change instruction. A regression test failed before the fix and passed after chat checks became read-only; the live repeat kept both decision-file hashes unchanged.
- 2026-08-28: Post-fix proof passed 50 focused backend tests plus frontend typecheck/build. Full verification reported 98 passed and the same three Apex annotation failures. Graphify rebuilt 1,925 nodes and 3,600 edges; `git diff --check` passed.
