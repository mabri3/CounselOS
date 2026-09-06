# Single-lawyer workspace verification

Date: 2026-09-05. Implementation and verification are complete. No material repair remains open.

## Scope and test boundary

The build implements the 14 approved single-lawyer items and eleven output-template starters. Understand, Discuss and Draft share one saved matter conversation. Collaboration items 12 and 13 remain excluded.

All writes in the acceptance run used copied temporary vaults. The repository vault, the lawyer's selected vault, its saved pointer, and the existing servers were protected. Their final content hashes match the initial hashes. Unrelated pitch decks, lean canvases, `brand_pitch.md`, and existing temporary files were preserved.

Evidence is in `output/single-lawyer-workspace-acceptance/`. Screenshots show the actual application. Automated provider fixtures are distinguished below from configured-model runs.

## Engineering checks

| Check | Observed result |
| --- | --- |
| `cd backend && .venv/bin/pytest -q` | 1,040 passed in 376.42 seconds. One existing Starlette deprecation warning. |
| `cd frontend && npm run typecheck` | Passed. |
| `cd frontend && npm run check:workspace-ux` | Passed. |
| `cd frontend && npm run check:single-lawyer-workspace` | All six new checks passed. |
| `cd frontend && NEXT_PUBLIC_API_BASE_URL=http://localhost:8107/api npm run build` | Passed against the isolated acceptance service. |
| `cd frontend && npm run build` | Passed after browser verification, with normal settings and no test API override. |
| `npm run check:workspace-file-drop` | Passed in headless Chromium against the actual isolated application. |
| Independent review | Original owners repaired findings. A separate Astra Low reviewer checked the repairs and found no remaining test weakening or debug code. The flow diagram, receipt, source-map, inquiry, research-route, prepared-request, declined-update and midnight date repairs were independently accepted. |

The shell's default Python lacks the application packages. The existing backend virtual environment was used. No package was installed to replace the local frontmatter shim.

## Connected interaction evidence

`backend/tests/test_workspace_interactions.py` exercises Q1–Q7 through the real HTTP routes, queued chat service, runner and tools with a deterministic provider. It covers explicit question changes, proposal reject/apply, stale proposals, history restore, late intake/research results, linked reported answers, ambiguity, hypothetical write denial, leave-open state and retry without duplicate facts.

`backend/tests/test_workspace_lifecycle.py` covers the integrated memo/clause/checklist paths, frozen templates, preview/Keep, source-copy lineage, dirty edit recovery, correction offers, explicit revisions, source exclusions, optional persistence failures, run restart/retry, stable intake questions and same-conversation shortcuts. Additional context, records, scenario, flow, reuse, drafting, evidence and template suites cover the hostile inputs and saved-record boundaries.

Configured-model evidence used `openai_compatible` with `deepseek-v4-flash`. The corrected multi-turn probe kept one conversation while changing scope, answering a supporting question, correcting a date and producing a memo. The saved memo used 21 October 2026, the current business question, the requested audience and the saved template snapshot. A separate configured probe saved a scenario, recorded a later actual fact, left the memo unchanged, offered an update, and saved a proposed revision only after an explicit request.

## Observed browser journeys

| Area | Actual observation |
| --- | --- |
| New inquiry and understanding | Created Harbor Relay from an incomplete fictional request. The configured model saved a useful conditional answer and supporting question. Understand displayed formatted saved text, facts and the issue map. |
| Scope and questions | Direct question edit and history restore survived reload. The original request remained. A reported revocation answer retained its source message and stable question link. Fund control stayed open. Explore why continued the same conversation. |
| Context and files | Picker uploads worked in all three views. Full, partial and failed files had separate outcomes. Search found files. Exact saved PDF text and the original were available. Removing a selection did not remove a source. The actual next-run manifest marked the excluded file omitted and withheld indirect source-derived context. |
| File drop | The separate Chromium check used actual `File`, `DataTransfer`, React handlers, upload APIs and context records. It checked additive batches, one composer, unsent text, selected inquiry uploads, unselected library uploads, and retry with the same file bytes. |
| Evidence | The notice passage displayed `SRC-08BC38EA54A72041`, a supplied-source label, the original 30-day notice and 10-day termination text, and an honest unknown retrieval date. |
| Flow and inquiry | The native flow diagram and equivalent edit list showed the same named route and recorded details. Save then explicit fact acceptance used current source versions and returned a saved receipt. Actual selected-issue Stress-test saved a focused objection. Ask the business returned an editable question, which was edited and copied without sending. Nine protected draft and decision files stayed unchanged. |
| Scenarios | Saved and reopened the late-partner-approval scenario. Analysis remained hypothetical. Explicit adoption changed the selected fact; saved memos and clauses stayed unchanged. A draft-update offer became visible. |
| Draft update and return visit | Draft showed the saved-research snapshot notice. Preparing an update targeted the selected cover email and preserved the unsent message. Explicit append kept the original text and did not submit. Nine draft and decision files stayed unchanged. A declined clause update retained its earlier-facts label after reload and did not repeat the offer. Mark seen followed by reload showed no new saved work. |
| Prior work and practice notes | Prior work showed date, source, status and differences. Inclusion was explicit. A practice note was edited, saved through the existing builder and explicitly applied. |
| Memo | A real template preview became an editable memo. Open and Keep worked. Direct lawyer edits survived view changes and a stale generated proposal. Explicit rebase preserved both lawyer notes. One proposed change was accepted; others stayed pending. |
| Supplied clause | The successful 60-day request made a separate review copy with supplied-original lineage. The 10-day termination period and other terms remained. The original text file stayed byte-identical. |
| Checklist | The retried request completed in the same conversation and logical run. It made a separate review copy. Selected additions were accepted; other proposals stayed pending. No task was marked complete. Opening a fresh Markdown original preserved its bytes. |
| Exports | Regenerated memo Word export contained accepted text and both lawyer notes, with no pending track nodes or raw Markdown markers. Checklist PDF used explicit markup. The actual one-page PDF and a LibreOffice render of the actual accepted-text Word export were visually checked; neither clipped or overlapped text. Export regression tests separately checked native Word/PDF changes and comment positions. |
| Outside counsel | Actual chat created a brief and separate short cover email. The outgoing selection included only the original notice clause. A reason and explicit packet review preceded preparation. The packet contained two Word files and the exact selected original. Nothing was sent. |
| Templates | All eleven starters appeared in Skills and Draft. Copy/edit/save/default/preview/Keep and one-run length override worked. A stale editor retained local text while preserving the newer saved version. Disabling a template produced a truthful unavailable status. Older artifacts kept their original template snapshot. |
| Assumption watch | Loaded the copied watch fixture through Settings. Briefing, Today, the impact packet and Watch Builder showed the labelled simulated result. The affected assumption and prior basis were visible. The recorded decision remained byte-identical after browser review. |
| Responsive reading | Actual widths 1440, 1024, 768 and 390 were checked. The repaired narrow reading and scenario surfaces fit. A separate final browser audit passed 22 navigation, Settings, flow-width, reduced-motion preference, keyboard and narrow prepared-request checks with no page errors. Drawer keyboard wrap and Escape focus return passed. Unsent composer text and saved view survived reload. |

## Honest limits and retained failures

- Some configured-provider attempts failed before useful tool work. Failed attempts remain in history. The successful checklist retry and outside-counsel run are the acceptance evidence; earlier failed runs are not counted as successful.
- Native computer-use drag replaced file data with text data. It did not perform a valid file drop. The separate real-browser File/DataTransfer check passed; these are different forms of evidence.
- An early pre-repair checklist original acquired review metadata. That historical failure was retained. Current original-preservation acceptance uses a fresh upload and the successful guarded copy tests.
- One watch development is a clearly labelled deterministic provider result. The existing scan, matching, briefing and impact-packet pipeline ran against real saved records. All four recorded decision files stayed byte-identical. It is not a live external-development search.
- Search was disabled in the configured-model acceptance environment. Supplied sources and generated analysis were not presented as newly verified external authority.
- Component scripts and backend tests do not establish every visual or legal conclusion. This report does not claim legal perfection or measured productivity gains.

The full progress log retains failed checks, ownership transfers and repair evidence. No commits, pushes or deployment were made.


## Current legacy regression coverage

The historical boxes in `docs/ACCEPTANCE_TESTS.md` remain historical. The current full suite covers matter stages and shared work state, research/no-search/partial results, source ingestion, canonical drafts and review/export, decision integrity, schedule state, path safety, atomic writes, index rebuild, guided skills, watch scans and vault switching. Representative suites are `test_matters.py`, `test_matter_state.py`, `test_research.py`, `test_document_review.py`, `test_work_product.py`, `test_matter_lifecycle.py`, `test_decisions.py`, `test_scheduler.py`, `test_vault.py`, `test_skills.py`, `test_watch_scans.py` and `test_vault_management.py`.

Current browser evidence covers Today, Workspace, Matters, Decisions, Skills, Agents, Automations, every Settings section, copied-vault switching, the new workspace paths, the watch packet, and the affected research/draft path. These observations supplement the tests; they do not relabel every old manual example as a new browser run.

The final browser walk found and repaired a real research-start error that earlier service-level tests had missed. Both `/research` and `/research-runs` now execute on the application event loop. New HTTP tests start each route, wait for completion and inspect the saved packet. The current configured-model browser run returned a partial saved packet with an honest zero-counted-support label.

## Final closure evidence

The final navigation run returned `{"passed":true,"checks":22,"pageErrors":[]}`. It also verified a 390px prepared request without loss of unsent text. A Today date mismatch appeared when the test crossed local midnight. The actual-page regression first failed, then passed after a stable initial render was added; the browser rerun confirmed the error was gone. No warning was suppressed.

`draft-controls-integrity.json` records nine unchanged draft and decision files across preparation and explicit append of the update request. The declined clause showed “Earlier facts · Draft retained” after reload. The declined offer did not repeat. The last recap showed “No new saved work” after Mark seen and reload.

The test servers on 8107, 3107 and 3108 were stopped. Existing user servers were left alone. The browser viewport override was reset. The knowledge graph was updated after the final application change, and `git diff --check` passed.

The final normal production build passed after the isolated browser service was stopped. No test API address was left in the generated normal build. The two protected vaults still match their recorded baseline hashes.
