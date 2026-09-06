# Single-lawyer workspace — implementation progress

Orchestrator: gpt-6-astra / medium.
Plan: docs/single-lawyer-workspace.handoff-plan.md
Prompt: docs/single-lawyer-workspace.handoff-prompt.md

All 14 approved single-lawyer items and eleven starter templates are implemented and verified. All packages and material repairs are independently accepted. The full backend suite passes (1,040 tests), both frontend check groups pass, the normal build passes, and the final 22-check browser audit has no page errors. See `docs/single-lawyer-workspace.verification.md` for evidence and limits. Earlier entries below are historical.
Only the orchestrator edits this tracker. Mark a package accepted only after its checks and integration obligations are met.

| Wave / package | Assigned model / effort | Status | Evidence / next action |
| --- | --- | --- | --- |
| 0 Baseline | Astra Medium coordinator | Accepted | 865 backend tests; frontend UX/typecheck/build pass. See execution baseline below. |
| 1 A Contracts and persistence | Astra High | Accepted | 45 focused + 68 adjacent tests; typecheck; independent repairs verified. |
| 1 Contract review | Astra Low, independent | Accepted | `/root/a_review` independently verified original failure cases, 45 tests and typecheck. |
| 1a I0 Connected-question slice | Astra High | Accepted | 292 tests, frontend checks/build, independent boundary review, configured-model Q1 and browser direct-edit/receipt proof. |
| 2 B Evidence, context, inquiry | Astra High | Accepted | Evidence repairs independently verified; final upload lifecycle15pass unchanged assertions. Integrated; actual upload/context browser evidence is recorded in the verification report. |
| 2 C Scenarios and flow | Terra High | Accepted | 73 focused pass; independent immutable-history/list/fact-link repairs verified. |
| 2 D Prior work, notes, watches | Terra High | Accepted | 9 package + 52 adjacent pass; independent starter/default/prior-work repairs verified. |
| 2b J Draft/revision/export lifecycle | Astra High | Accepted |142relatedpass; independent preview/export/retry repairs verified in62focusedchecks. |
| 3 E Understand and issue UI | Terra High | Accepted | Originalownerpending/stale/Seenrepairs; independentrecheck accepted. Integrated and checked in the browser. |
| 3 F Exploration UI | Terra High | Accepted | State/edit/recoveryrepairs pass; independentreviewfoundnomaterialissue. Integrated and checked in the browser. |
| 3 G Evidence/context UI | Sol Medium | Accepted | Citation/context/per-fileuploadrepairs independentlyverified; own/UX/typecheckpass. |
| 4 H Reuse UI | Sol Medium | Accepted | Templateidentity/state repairs independentlyverified; twoownchecks/typecheckpass. |
| 4b K Conversation and draft layout | Terra High | Accepted | Fourreviewrepairs+StrictMode/late-templaterestore independentlyverified. |
| 5 I Integration and finish | Astra High | Accepted | All 14 items integrated; actual chat/browser journeys and final repairs verified. |
| 6 Review / repair | Astra Low + original owners | Accepted | All material findings repaired by their original roles and independently accepted. |
| 7 Final verification | Astra Medium coordinator | Complete | 1,040 backend pass; frontend checks and normal build pass; 22 browser checks, no page errors; graph updated. |

## Approved scope
Editable output templates and all eleven starter outputs are approved, including the outside-counsel brief and six additional single-lawyer outputs. D owns template storage/versioning, H template editing, B/J generation, K Draft selection, and I shared integration. T1–T5 evidence is in the verification report; outside-counsel output does not unpark team collaboration.
Founder interview decisions are incorporated: conditional likely answer first; targeted deeper signals; evidence-based disagreement; saved scenarios with selective adoption of real facts; analysis changes offer a draft update before creating a revision; prior drafts and readable change reasons are retained. S1–S4 are implemented and checked, including the final persisted declined-update indicator.
Build original items 1–11 and 14–16. Park only 12–13 (collaboration).
Conversation and editable work product are required foundations across all 14 items. Complete memo, supplied-clause revision, and transaction-checklist journeys through natural language. Preserve one conversation and lawyer edits across Understand / Discuss / Draft.
No commercial validation gate. No application work performed by the plan author.
Files/context preservation is required: B owns ingestion and manifest behavior, G owns the library/context panel, and I owns shared attachment/drop wiring. F1–F4 must pass; no selection removal deletes a source file.
The connected interaction contract is required from the first usable build: canonical business question, bidirectional chat/direct edits, linked supporting answers, hypothetical isolation, action receipts and whole-matter artifact synthesis. Q1–Q7 are required in I0 and final integration; X1–X3 are final acceptance journeys.

## Resume ledger
- All A/I0/B/C/D/E/F/G/H/J/K packages and assembled workspace repairs are accepted. Current evidence: `docs/single-lawyer-workspace.verification.md`.
- Backend is frozen. Final full suite: 1,040 passed, one existing warning, 376.42 seconds.
- No active implementation remains. All source is released. Independent review, final browser verification and normal frontend build are complete.
- Root owns build/server coordination, evidence, tracker and graph update. All application writes used isolated copied vaults; both protected vault hashes are unchanged.
- Exact role/model assignments were preserved. No model substitution or usage reset was authorized or used.
- Failed historical attempts below remain evidence. Do not repeat accepted packages from those older pending notes.

## Update format
For each accepted package add date, worker ID/model/effort, changed paths, exact test commands/results, review findings and repairs, ownership transfers, and next package. Keep failed or blocked checks visible. Do not replace this ledger with a vague completion summary.

## Execution baseline — 2026-09-04

- Existing dirty tracked files: this tracker, `docs/single-lawyer-workspace.handoff-plan.md`, and `docs/single-lawyer-workspace.handoff-prompt.md` (530 insertions, 59 deletions total before execution). Preserve these edits.
- Existing untracked paths: `.tmp/`, `Mosaic Relay UX Experiment 2026-09-03 R3/`, and `output/deck/vc/Themis-VC-Pitch-September-2026-v{3,4,5,6,7}.pptx`. No application files were dirty at baseline.
- Selected vault: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3`. Do not change `.counsel-os/active-vault.json`.
- Existing app listeners include Python on 8002 and 8090 and Node on 3000. Do not stop them. The normal backend launcher prefers the saved pointer over `VAULT_PATH`; browser verification must use an isolated pointer as well as an isolated vault.
- `graphify query 'How do dossier question updates, canonical matter records, chat runs, document review, and workspace UI connect?'` succeeded. Wiki index is absent. Graph identified existing dossier, record, chat, review and runtime seams.
- `cd frontend && npm run typecheck && npm run build`: passed before code changes.
- Plain `cd backend && pytest -q` failed during collection because the shell Python lacks FastAPI. The existing `backend/.venv` has the application packages. `cd backend && .venv/bin/pytest -q` is running against isolated fixture vaults.
- Existing `npm run check:workspace-ux`: running; module-type warnings are informational.

### Contract inventory before A

- Canonical question: `DossierService.orientation().decision_question` reads the `Decision question` section. `update_orientation`, `update_from_intake`, `propose_update`, `apply_revision`, and `_write_current` require ownership-aware preservation. Existing dossier revisions/events remain history.
- Facts and issue prose: `MatterRecordService`; A owns new workspace projection/issue identity, C later owns record-service reconciliation. No second fact store.
- Durable chat: `routers/chat.py`, `services/chat_runs.py`, `agents/runner.py`; I0 and I exclusively own integration.
- Draft/review/export: existing `WorkProductService`, `DocumentReviewService`, `DocumentExportService`; J owns their behavior, I their shared route/tool wiring.
- Templates: existing `SkillDefinition` and `SkillRegistry` in `backend/app/skills/registry.py`; D owns storage. A must freeze eleven exact seed paths, snapshots and callback contracts. I owns seed manifest/initialization and Skills entry integration.
- Existing workspace helper `frontend/lib/matter-workspace.ts` stays separate from new contract modules. `frontend/components/workspace/` does not yet exist.
- Next action: finish baseline checks, then dispatch A with its exact eight owned files. All feature packages remain pending.

### Baseline accepted

- `cd backend && .venv/bin/pytest -q`: **865 passed**, one existing Starlette deprecation warning, 188.27 seconds.
- `cd frontend && npm run check:workspace-ux`: **passed**, informational Node module-type warnings only.
- Protected content hashes (all files except disposable `.counsel_os_cache*`): repository `vault/` 717 files, `73e351aa87699dd42261d638b067253ad61a731cd766e5118380b22c482b2f1c`; selected experiment vault 998 files, `4fca060ef3ddc0bb8ad84140ac1fe04686fe91b075d466f4261522af4ce5071a`.
- Next action: A contracts/persistence, followed by independent Astra Low review. Coordinator continues integration and browser-test preparation without editing A-owned files.

### Isolated verification setup

- Disposable fixture vault/launcher: `/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-single-lawyer-hhdu5aid/`. Backend PID 2540, tool session 68299, listens on 8107; frontend test port reserved as 3107. The launcher passes a separate pointer path to `ActiveContextManager`; no selected-vault change.
- `/api/health` confirms the disposable vault and mock provider. This is infrastructure proof only.
- Configured provider connection probe: `openai_compatible` / `deepseek-v4-flash` returned a real non-empty reply to a fictional connection-test message. Credentials are present and were not printed. Full configured-model workspace journeys remain pending.
- Required I0 ownership extension identified by coordinator: `backend/app/services/chat_runs.py` must freeze the business-question/target snapshot at submission alongside its existing dossier hash and source action key. Assign exclusively to I0 when that package starts, then release to I.

### Reproduced pre-change defects for assigned packages

- B / F4: real isolated `POST /api/matters/MAT-DEMO-BEACON/uploads` with two successive `same-name.txt` uploads returns 201 both times and replaces the first file bytes with the second. Mixed valid TXT + unsupported EXE returns only 400 even though the valid TXT was saved. B must preserve both originals and report individual batch outcomes. Initial probe of singular `/upload` with plural field returned 422 and made no change; corrected probe used the actual plural route signature.
- G / source compatibility: `frontend/lib/research.ts` ignores `Retrieved external authority` source lines and then numbers the later recognized source from 1. This can bind a claim to the wrong source. G owns repair with positional legacy fixtures and exact-source support states.
- I/K editor seam: `DocumentPanel` currently clears local edits on active-path changes and has no parent snapshot callback; selection goes only to `DocumentReview`. A was asked to freeze local snapshot/selection callbacks so I can preserve edits and K can keep one editor/composer mounted.
- I0 / Q1 live baseline: actual `/api/chat`, configured `openai_compatible` / `deepseek-v4-flash`, isolated Relay fixture. Explicit question change returned 200 and claimed the dossier had changed, but before/after canonical question was identical. Generic `write_markdown` returned a success/no_change replacement proposal; the model treated it as applied. The reply also exposed a process-style sentence and asked unnecessary follow-up choices. Evidence: `/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-scope-baseline-f1ii2_ye/result.json`. This is a reproduced failure, not acceptance. The temporary probe's teardown closed its provider on a different event loop and exited 1; later live harnesses must close providers within the request loop/lifespan. No user vault was touched.

### A initial checks and review

- A reports `cd backend && .venv/bin/pytest -q tests/test_workspace_records.py tests/test_dossier.py`: 32 passed; adjacent matter-record/research tests: 68 passed; frontend typecheck and diff whitespace check passed. These checks do not establish connected interaction acceptance.
- Independent read-only `/root/a_review` reproduced malformed business-question ownership metadata crashing GET and selected ranges beyond text length passing validation. Repairs returned to original owner A; no ownership transfer. Missing snapshot `issues_revision` and `question_changes` fields were repaired in both Python and TypeScript; final recheck pending.
- Next action: review A repairs, accept contract only after material findings clear, then dispatch I0. All later waves remain pending.

### A accepted; ownership transfer to I0

- Original implementer `/root/a_contracts`, Astra High, repaired malformed ownership metadata projection and explicit saved/local selection bounds. Reviewer `/root/a_review`, Astra Low, independently reproduced original cases and accepted both repairs. `cd backend && .venv/bin/pytest -q tests/test_workspace_records.py tests/test_dossier.py`: **45 passed**; `cd frontend && npm run typecheck`: **passed**. Prior adjacent record/research checks: **68 passed**.
- A eight-file ownership is released; no consumer may modify those files without a new exclusive transfer. Contract is `docs/single-lawyer-workspace.contract.md`. A remains the original owner for later repairs.
- I0 receives its exact Wave 1a files plus coordinator-assigned `backend/app/services/chat_runs.py`, `backend/app/agents/output.py`, bundled agents `counsel-copilot.md` and `intake-agent.md`, and five exact bundled tools `change_business_question.md`, `propose_business_question.md`, `act_on_question_proposal.md`, `restore_business_question.md`, `answer_workspace_question.md` under `backend/app/blank_vault_template/00_System/tools/`. These extra paths connect real tool schemas, queued scope snapshots and truthful output receipts. No other worker is writing application files.
- I0 must pass real-route/runner Q1–Q7, frontend refresh/direct-edit parity, and regression checks before releasing shared ownership to B/I. Coordinator retains tracker, graph output and final browser evidence ownership.

### Downstream inspection notes while I0 runs

- G: legacy `cleanExcerpt` may replace frontmatter-like source text with a generated description while storing it in `Citation.quote`. Preserve the exact available excerpt separately from any display explanation; do not present a manufactured description as a quote.
- B: ingestion batch IDs currently hash only content versions; matter upload path and companion path are fixed by basename, and persisted batch attachments omit extraction state. Same-name preservation and durable per-file results must account for both source and companion files, while keeping existing callers compatible.
- Browser fixtures are prepared outside the repository at `/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-single-lawyer-hhdu5aid/browser-inputs`: fictional settlement facts, a notice clause, transaction checklist and unsupported file. These are test inputs, not acceptance results.

### I0 additional exclusive tool declaration

- Coordinator assigned `backend/app/blank_vault_template/00_System/tools/select_conversation_scope.md` to I0 on request. It is a narrow same-assistant capability declaration, not a second classifier agent or pipeline. Selected/trusted scenario context must permanently restrict the run and recovery; model output cannot widen it. A verbatim instruction quote proves source provenance, not universal mutation authority. Narrow commands still enforce target/revision and actual explicit instruction. No UI mode picker or second confirmation. Existing route/runner compatibility must be checked; failures may not be hidden by weakening tests.

### Additive A callback repair during I0

- Coordinator found that issue persistence exists but Understand/IssueNavigator props lacked a state-edit callback. A receives exclusive ownership of only `frontend/lib/workspaceTypes.ts` and `docs/single-lawyer-workspace.contract.md` for an additive optional revision-checked issue-update callback. I0 notified; no shared-file overlap. E will render these controls and I will wire durable updates. No backend changes authorized in this repair.

- Additive A callback repair accepted by coordinator inspection: shared `IssueUpdateCallback(issueId, IssueUpdate): Promise<IssueNode[]>`, optional transitional `onIssueUpdate` on both components and `issuesRevision` on navigator. Final E/I wiring is required, including conflicts and retained unsaved edits. A reports frontend typecheck passed. The two files are released again; no ongoing A writer.

- Concurrent external artifact noticed during I0: untracked `output/deck/vc/Themis-VC-Pitch-September-2026-v8.pptx` appeared after the initial baseline. No agent here owns or edits that path. Preserve it as unrelated work.

### I0 research publication ownership extension

- I0 now exclusively owns `backend/app/services/research.py` and `backend/app/services/research_runs.py` for narrow queue-time business-question revision propagation into dossier publication. This is required for Q3 before I0 acceptance. Broader research/evidence changes remain B scope. On release, research.py transfers to B; research_runs.py returns to later I. Add regressions in I0-owned `test_workspace_interactions.py`.
- G exact-excerpt defect reproduced via actual `parseMemo`: stored excerpt `--- matter_id: MAT-DEMO-BEACON record_type: matter` is returned as `Citation.quote = The saved facts and assumptions for this matter.` This manufactured description must become a separately labelled explanation, with the source excerpt preserved.

### A optional-record repair during I0 regression checks

- Existing `test_agents.py::test_agent_context_skips_broken_optional_decision_details` exposed `WorkspaceService.get -> recap -> _output_revisions` propagating FileNotFoundError while scanning an optional decision. I0 now reads only needed question context. A exclusively owns `backend/app/services/workspace.py` and `backend/tests/test_workspace_records.py` to make optional output scanning degrade to useful GET, record read failures and avoid writes/fabricated output events. Independent recheck pending. No overlap with I0.
- I0 early adjacent test pass: 106 passed / 3 failed before repairs (optional decision and internal intake-recovery context). Worker repaired behavior, no test expectations weakened; rerun pending. First frontend typecheck found four optional-field errors, repairs in progress.

### I0 protocol fixture transfer

- Adjacent agents/chat-runs/action-permissions rerun: 133 passed, 2 failed. Message ordering fix pending (system scope guidance must precede final user message). One existing intake fixture calls mutation without the now-required scope declaration.
- Assign `backend/tests/test_chat_runs.py` exclusively to I0 for ONLY the provider sequence in `test_new_matter_runs_contextual_typed_intake_to_records_and_dossier`: call select_conversation_scope(actual, exact user quote) before intake mutation. All record/context assertions remain unchanged, no bypass flag. This is an explicit fixture protocol change, not hidden weakening of behavior. Rerun pending.

- A optional-output repair reports **52 passed** including six new failure/recovery cases and exact existing broken-decision fixture. Reviewer `/root/a_review` rechecks read-only. A service/test ownership released. A has temporary exclusive ownership of Python/TS workspace model files and contract doc solely for additive typed `ChangeRecap.output_read_failures` parity; E will show a concise warning while retaining useful saved work.

- A optional-output repair accepted: independent `/root/a_review` reran all 52 tests and tested malformed output in an isolated vault. GET retained question, reported unavailable file, wrote nothing; recovery of unchanged version stayed seen, changed version appeared as changed output. No material finding remains for this repair.

- A warning schema parity accepted: Python `OutputReadFailure` and default-empty `ChangeRecap.output_read_failures`, matching optional TS property, E presentation instruction. Typecheck and Python default checks pass; all A ownership released.
- I0 core runner/tools/UI reported stable. New actual-HTTP Q1/Q2/Q4/Q5/Q7 fixtures: 9 passed; Q3 chat stale protection passes, deterministic research resolver fixture repair pending. Frontend typecheck passes. Coordinator configured-model Q1 replay is running in fresh temporary fixture (session 59733), not acceptance until result inspected.

### I0 configured-model and browser evidence

- Configured `openai_compatible` / `deepseek-v4-flash` actual `POST /api/chat` Q1 replay: **passed**. Exact requested question saved; trace contains only `select_conversation_scope` and `change_business_question`; one applied receipt with trusted message ID and before/after revisions; no research. Evidence `/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-question-live-pjjb72mp/result.json`. Same-loop provider teardown exits 0. Reply is still verbose due existing default caveat guidance; B owns that planned repair. Full multi-turn live journey remains pending.
- I0 reported combined focused/adjacent tests: **191 passed**, one existing warning. Includes actual research-run stale orientation after direct edit. Extra edge tests pending before release.
- Coordinator build `NEXT_PUBLIC_API_BASE_URL=http://localhost:8107/api npm run build`: **passed**. Own test servers restarted: backend session46613/PID9542 port8107, frontend session82485 port3107. Old own sessions68299/13475 stopped. User servers untouched.
- Browser actual build at1440: Beacon Edit question -> Save -> Saved status -> reload preserves exact new question. Chat->Overview->Chat retains an unsent test note; cleared afterward. Browser logs empty. Direct-edit activity receipt was missing from Chat; sent to I0 for repair before acceptance. The final Understand/Discuss/Draft layout remains later E/K/I work.

### I0 edge-case repairs and boundary review

- Read-only `/root/a_review` now checks I0 authority, scenario capability/recovery and stale-run boundaries. No full later-feature review yet.
- I0 added `test_q3_later_intake_preserves_question_and_summary`; **201 other tests pass**, this new case fails in A dossier logic. Legacy Summary is restored but generated Matter summary remains and wins orientation. A exclusively owns `backend/app/services/dossier.py` and `backend/tests/test_dossier.py` for effective-summary preservation across heading versions. I0 failing assertion stays unchanged.
- I0 direct-edit receipt UI repair: durable A receipts without source_message_id passed into same ChatPanel and shown with Open saved record; no synthetic conversation message. Frontend typecheck passed. Coordinator rebuild session18678 pending, prior own frontend82485 stopped. Typed conflict messages now retained/displayed by API error handling.

### I0 review repair status

- Reviewer P2: generic write could create missing workspace.md with forged current answer. I0 reports path guard repaired for canonical workspace/dossier/flow and revision/scenario roots, resolved symlinks and custom handler aliases; ordinary notes still allowed. Independent recheck pending.
- Reviewer P2: identical queued source_action_key submission created a new run/message and failed action_key_conflict. I0 reports dedup before freeze/save, same-payload original run replay, changed-payload409; active/completed regressions pending/rechecking.
- A legacy effective-summary repair reports **54 passed** with exact I0 Q3; preserves aliases across explicit/legacy scope, same-scope updates remain, original old-scope output kept in a historical revision. A dossier/test ownership released. Reviewer rechecks all three repairs.
- Coordinator rebuilt receipt UI successfully and restarted own frontend as session33887 port3107. Browser receipt now shows Business question saved plus Open saved record, which opens the actual dossier with the saved question. No synthetic message. Empty CUA fill did not trigger input change; keyboard Select All/Backspace cleared the temporary test note, not an app persistence defect.

- Reviewer independent checks accept canonical write guards, ordinary note writes, queued active/completed replay, changedpayload409 and Q3. New alias fixture failure was a dangling test symlink, repaired by creating its target directory. Final green/recovery recheck pending.
- Additional I0 direct scenario replay regression `test_q5_direct_scenario_retry_cannot_unlock_actual_scope`: implementer passes; reviewer rechecks saved scope checkpoint on same-key direct request.
- Coordinator `npm run check:workspace-ux`: **failed** at scripts/check-workspace-ux.ts:259 named complete refresh callback assertion. I0 wrapper expanded refresh but changed callback shape; repair assigned to consolidate workspace snapshot reload inside existing `refreshAfterChatRun` and retain direct prop. Do not weaken existing check. Final frontend rerun/build pending.

### I0 final checks before release

- I0 reports **292 passed**, one existing warning, 71.66s: interactions + workspace records + dossier + agents + chat runs + action permissions + research + watch builder + matter action tools, no deselection. Frontend typecheck and full `npm run check:workspace-ux` pass after preserving named complete refresh callback.
- Reviewer `/root/a_review` accepted all material I0/A repairs; independently reran direct scenario retry restriction, generic alias/path protection with ordinary note success, and late-intake summary preservation. All three passed, no material finding.
- Final I0 build session14803 pending. Implementer edits frozen, release report pending. Backend feature waves will begin after release/build.
- Concurrent unrelated `brand_pitch.md` gained six lines of brand copy during execution (not owned or written by this team). Preserve it along with v8 deck. No application ownership conflict.

### I0 accepted; B/C/D ownership dispatched

- Final coordinator I0 production build **passed**. I0 final report releases all assigned files. Independent direct-scenario recovery review already passed (its final report pending note was stale).
- Transfer context.py/research.py to B. C owns only scenario/flow services, matter_records.py and two new tests. D owns reuse/skill/watch/packet services, skill registry, two new tests and eleven exact starter files. No agents may touch shared routes/runtime/tools/models/manifest or tracker. No concurrent frontend builds.
- All three workers must preserve accepted scope/receipt/question invariants and report required I integration seams. J starts when first Wave2 slot is free.

- I0 final build passed; own frontend now restarted (latest session in tool log) with accepted UI. B/C/D active exactmodels/ownership as dispatched. B requests I integration for runner tool-read manifests and WorkspaceActionsService existing-run binding; D will share TemplateUse/note projection API with B.
- B plans Answer.md defaultv0.3.0 + exactlegacyv0.2.0 migration. Manifest counterpart remains I-exclusive: set manifest files[00_System/Answer.md] to exact new DEFAULT_ANSWER_CONTRACT. Existing seed-equality test must remain pending until this integration, not weakened.

### J baseline reproduction while backend packages run

- Isolated existing DocumentExportService export of matter-a/memo.md then matter-b/memo.md returns the same `.exports/memo.docx`; first exported bytes are replaced. J must bind export output to selected source identity/version and preserve prior export files, with cross-matter/same-title regression. No user file used.
- D/B agreed submission resolver `resolve_template_use(template_id, *, output_type, overrides=None) -> TemplateUse` with omitted/default selection, actual-content revision/hash and immutable instructions. I will wire routes and missing-only startup installation.

### D required shared assumption-impact field

- D requested reliable structured assumption IDs on ReviewPacket. Coordinator temporarily owns ONLY `backend/app/models/awareness.py` for additive `ReviewPacket.affected_assumption_ids: list[str] = Field(default_factory=list)`. D continues raw watch metadata links and packet projection; I later wires shared API/frontend. No overlapping writer; field preserves old records via empty default. Ownership returns to I after edit.

### Wave2 integration seams and transient test failure

- B exposes build_run_context -> context/manifest/excluded_paths/withhold_unattributed_history, source/extracted alias exclusions, and immutable final save_manifest. I must freeze at submission, enforce exclusions for all tools/attachments, append actual tool reads and save final manifest even failure/recovery. Preserve audience/constraints when withholding rawhistory.
- C exposes save/get/list/readonly_overlay/find_relevant/adopt_fact_changes/persist_analysis; Flow get/save/proposed_fact_changes/accept_proposed_fact_changes. I binds real read-only runs and typed persistence; late scenario analysis remains historical, actual correction also works without scenario origin.
- C test collection temporarily failed because D removed skills/registry.py while replacing it. Coordinator required immediate runnable restoration and atomic writes; C must not edit D file. Rerun pending restoration.

- Post-I0 protected vault hash check: repository717files and selectedexperiment998files both exactly match baseline hashes. Active pointer unchanged; all browser/live probes remain disposable.

- D registry restored and compiles; delete/add replacement caused transient missing-module window. C rerun **69 passed** (C scenario/flow + A workspace + matter records).
- C I0 interaction rerun found three Q1 context failures. B identified heading drift only (canonical current text/revision still supplied), restored Current business question (canonical scope)/Supporting questions headings without editing assertions. B I0 regression rerun pending.

### Wave2 coordinator review and test ownership

- C coordinator review found retry ordering gaps in scenario adoption and flow acceptance (fact saved before metadata failure could block retry on stale revisions), missing durable flow replay receipt, empty/irrelevant revision-map bypass, and scenario create/update/analysis idempotency gaps. Returned to original C owner with regressions for partial/full retry, changedpayload, deterministic keyed creation, required update revisions and late analysis history. C API shape remains target; not accepted yet.
- B owns `backend/tests/test_ingestion_limits.py` additionally for two deliberate batch semantics updates: mixed partialfailure and first-source eventfailure now inspect truthful per-file outcomes while preserving source/index/rebuild assertions. Single-upload size/security/rollback behavior must remain tested. No other shared tests transferred.

### D ready integration signatures (tests/release pending)

- Registry resolver returns a dict from TemplateUse.model_dump (not a model instance); B notified. Resolve omitted template by output-type default, unavailable ambiguity includes choices; preserve literal snapshot on artifact. I owns seed copying/startup and route/run use.
- WorkspaceReuseService: prior_work(matter_id,query,selected_paths=None,limit=8), explicit_prior_work(candidates,selected_paths), draft_practice_note(goal,correction,name), save_practice_note(draft), practice_note_projection(skill_id), list_practice_notes(), apply_practice_note(matter_id,skill_id), applied_practice_notes(matter_id), create_assumption_watch(matter_id,request,assumption_ids,decision_ids=None), assumption_watches(matter_id). H/I use these explicit actions/projections; discovered notes are not applied automatically.

### C/D released; J and review dispatched

- C releases five files, focused **72 passed** after coordinator retry repairs. It added backward-compatible optional action_metadata to MatterRecordService.apply_update to store adoption/correction/flow fingerprints. Full suite attempted during concurrentintegration showed failures but complete output/count unavailable; do not claim fullsuitepass or all failures unrelated.
- D releases reuse/registry/watch/packet services, two tests and eleven seeds; **38 focused passed**, compile/diffcheck pass. Existing skills context-header failure routed to B (restored).
- Read-only `/root/a_review` reviews C/D failure/retry/version/snapshot boundaries and D missing-only installation scope. Actual D resolver currently returns TemplateUse object despite handoff prose claimingdict; B/J/I must normalize actual `.model_dump()` once.
- J `/root/j_drafting` Astra High starts with exclusive work_product.py/document_review.py/document_export.py/test_work_product.py/test_workspace_drafting.py. B remainsactive; reviewer thirdworker. No C/Dactivewriter untilreview repair transfer.

### C/D independent review findings (19 focused tests pass; missing coverage)

- C P2: same-key changed late analysis overwrites immutable scenario history. C P2: recursive scenario list includes revision records as duplicates. C P2: flow edge fact_ids accept foreign/missing IDs. Original C receives exclusive scenario/flow services and two tests for repairs; matter_records.py remains released unless requested.
- D P2: missing actual missing-only starter installer, absent effective starter defaults and is_default projection. D P2: prior_work response lacks A differences/matter_id/revision fields. D repair queued until slot free; no acceptance yet. Reviewer stopped and changed nofiles.
- D resolver actual return TemplateUse verified; contradictory handoff prose corrected for B/J/I.

### Review repairs and J integration contracts

- C original-owner repairs released: **73 passed**, compile/diffcheck; immutablehistory fingerprint/replay, canonical-only scenario list, selectedmatter factlink validation. Independent recheck pending.
- D receives exclusive registry.py/workspace_reuse.py/two D tests/eleven seeds if needed for installer/effective defaults/is_default and PriorWorkCandidate field repairs; no watch/packet/sharedmodel changes authorized.
- J reports63 existing relevant tests pass plus oldtest expecting changedpayload sourcekey success. Coordinator approved owned test change to expect conflict with originalbytes preserved and exactpayloadreplay success. J exposes document review revision separately from contenthash; I freezes/passes both. Dirtylocal target saves usefulproposal separately and returns conflict with proposal_path; I/K must display recovery.
- B manifest lifecycle: freeze full build_run_context return atsubmission(finalrunID/time); provider uses exact frozen.context + template snapshot + filteredhistory and excludedpaths enforcement. record_tool_read only AFTER actualtext appendedtomodel, update in-progress frozenobject inrunrecoverystate. save_manifest only atfinal completion/failure/cancel/recovery, immutable afterward. publish_result compares frozen.publication_baseline, NOT manifest.source_revisions (different hashes).

### J additive review-state contract transfer

- Coordinator temporarily owns only Python workspace model, TS workspaceTypes and contract doc for additive review-state fields requested/confirmed by J: ConversationTarget.artifact_review_revision, WorkProductReference.review_revision, LocalEditorSnapshot.review_revision. Existing artifact_revision/base_revision remain contenthash. J returns WorkProductService.reference.review_revision and DocumentReviewService.get revision/fullreview plus artifact_revision/content. I freezes both; K propagates editor snapshot. No other owner writes these files.

- J review-state additive fields pass Python defaults and frontend typecheck; coordinator releases the three contract files. J notified to map target artifact_review_revision to expected_review_revision. I/K must wire both content/review revisions.
- B final required I seams: AnswerContractResponse must retain optional custom-text update_proposal and display it; manifest exactv0.3.0 constant must match. Source target validation must include real uploaded/extracted/research source IDs as well as canonical fact-source IDs, without promoting source to fact; exact A validator extension may be assigned at I integration.

### D repair and shared draft/reassessment contract

- D released installer/default/priorwork repairs: **9 D tests +52 related pass**; actual missing-only installer present, custombytes/default preservation and all11 freshinstall/defaulttested. Reviewer nowrechecks C/D originals.
- J revise_draft(update_offer_id,reason,version_change) matches B offered artifact/base, accepts workspace offer only in successful documenttransaction, rollback preserves previousworkspacebytes. B/J coordinating exact metadata shape.
- J packet methods prepare_outside_counsel_packet and export_outside_counsel_packet require full reviewed brief/cover revisions and separately selected attachments with original-byte SHA256. export_original preserves exact selectedfile at identity/versionpath. Persist individual exportoutcomes; exported means preparedfordownload, notsent/delivered/approved. I/K must label accurately.

### C/D accepted; B review repairs

- Independent reviewer reran 21 combined C/D tests and direct reproductions. C immutable history, canonical scenario list and flow fact links pass. D missing-only installer preserves a customized starter, installs ten missing starters, repeats without changes, and respects explicit defaults. All C/D material findings accepted.
- B broad checks report 220 passed with only reserved manifest seed equality pending I. Independent 22 focused tests passed but reviewer reproduced two missing cases: excluded supporting answer remains in prompt; new source records do not mark frozen old output historical. Original B owns repairs and regressions.
- J reports 80 relevant tests passed, with final reopen check pending. Added global action-key binding, preview isolation, mixed accept/reject export and partial packet coverage. I must project list_drafts into workspace response and retain recoverable proposal_paths; final chat/browser journeys remain pending.

### J review and integration preparation

- Independent J review reproduced preview fallback selecting an unkept preview as effective current draft when no pointer existed. Original J repaired stored-pointer and fallback filtering; explicit Keep remains the selection action. Regression recheck pending.
- Independent J review reproduced accepted-text export including a Source links URL from a pending insertion. Original J owns selected-effective-text export repair and DOCX/PDF regressions.
- Coordinator broader backend run is in progress (session68398). Do not treat its partial output as a final result.
- Inspected initialization seam: backend/app/vault_manager.py::_populate copies manifest bundled_trees. I receives this exact extra file only if needed, plus manifest.json and frontend/app/skills/page.tsx. Runtime can call missing-only installer for upgrades. Skills page currently composes only SkillBuilder. No other initialization file exists at services/initialization.py.

- B normalized library projection to A MatterFileEntry fields and enums, including readable failed entries with stable path identity. I wraps upload per-file results without dropping successful source records.
- E dispatch attempted after reviewer completion, but collaboration tool rejected it with `agent thread limit reached` despite only B/J showing running. No E worker exists and no E ownership transferred yet. Continue backend repair/rechecks, then retry dispatch when workers release. No model substitution authorized.

### Broad backend check before frontend waves

- Coordinator `cd backend && .venv/bin/pytest -q`: **982 passed, 7 failed, one existing warning, 220.10s**. Run overlapped final B/J repairs; this is not final integration acceptance.
- Failures: Answer.md manifest equality (I exact seed); blank-vault shipped-agent contract parity (I registry/bundle seam, preserve user vault); three chat_history providers issue mutating tools before scope declaration (I explicit provider protocol update with behavior assertions retained); legacy save retry (J repair in progress); batch preview returns saved instead of preview (B repair assigned, retain existing assertions).

- Blank-vault parity cause inspected: AgentRegistry intentionally preserves vault-local `instructions`, while runtime_contract is bundled separately and ContextBuilder injects it. I0 appended scope guidance to bundled seed bodies, so fresh-vault body now differs from unchanged repository vault body. Preserve user-vault bytes and custom instructions. I must resolve managed-guidance placement or explicitly revise the parity fixture to assert effective runtime contracts plus preserved local instructions, with rationale; do not silently drop source assertions.

### B released; E/F frontend ownership

- B final batch workflow repair:15passed including original endpoint apply/undo/finalize assertions. Upload state is now separate upload_state, workflow state remains preview/applied/withdrawn. B files released; integration seams listed in final tool report.
- J released142relatedpass38.97s, allfivefiles. Preview edits and accepted-text citation leaks repaired; independent recheck pending.
- E `/root/e_understand` TerraHigh dispatched four E paths; F `/root/f_exploration` TerraHigh dispatched four F paths. G attempt rejected threadlimit while retained completedreviewer stilllisted; no Gownership yet. No model substitution.
- Coordinator adds E requested optional reading-surface/history callbacks in workspaceTypes and contract plus J preview/proposal_paths fields. No overlap; workers cannot edit contracts. I must wire these props, not leave required sections unreachable.

### Frontend contract additions verified

- E question history/restore and reading context/source props added. F explicit actual correction callback, canonical factchoices, flow proposedFactChanges/currentRevisions/acceptancecallback added. Scenario onAnalyze now takes third sourceActionKey for retry identity. Optional props are transitional; final I must wire all required actions.
- Coordinator frontend typecheck passed after E/F additions (before compatible third analysis argument change). E/F notified to use actual shared types, not private intersection workarounds.
- Repeated G dispatch hit threadlimit with E/F running and completed reviewer retained. No G agent or model substitution. Reviewer performs useful J/B recheck in retained slot; G will start as soon as a slot is available.

### J accepted; all three screen workers active

- Independent reviewer accepts J preview/revision/Keep rollback, DOCX/PDF accepted-text links, and legacy exact retry; also B original batch endpoint lifecycle. **62 focused tests passed**, original repros independently verified. No remaining material finding in reviewed scope.
- G `/root/g_evidence` SolMedium dispatch now succeeded after slot release. Owns exact five G files. E/F/G run in parallel against current shared contracts; all required integrated/browser journeys remain pending.
- Understand onMarkSeen callback added after E request; forwards existing markWorkspaceSeen, no new persistence.

### E/F screen review; H ownership

- E released ownstaticcheck/typecheck/diffpass. Coordinator identified recap Seen state not bound torevision; left_open questions lose Answer; not_saved greennotice; editors usefreshpropsrevision ratherthanfrozeneditbase; explicitparentnull visuallyfallsback. E receivesexclusive samefourfilesrepair. Integration/browsernotaccepted yet.
- F released ownstaticcheck/typecheck/diffpass. Coordinator queued original-owner repairs (Fnotactive untilslotfree): all notices unconditionally prefix Saved andgreen evenqueued/not_saved; newunsavedflow labeledSaved; inputs remainenabled duringawaitsave thencompletion clears/replaceslateredits; stalecomparison missesaddedsourcekeys; flowconflict lacks usablecopy/refresh/rebase recovery; scenariolinks renderedinert rawpaths. Add onOpenArtifact and flowrefresh callbacks via coordinator ifneeded. SamefourFfiles only afterexclusive transfer.
- H `/root/h_reuse` SolMedium dispatched exactfivecomponents/twocheckscripts; readsacceptedD/J/Acontracts. Erepair/G/H active. K waitsE/F/Gcontracts.

### Screen repair rechecks and H labels

- E original repairs released; coordinator reran Understandcheck successfully and inspected revision/parent/Seen/state fixes. One remaining E repair queued: Business question textarea staysenabled while Saveawaits and completionclears questionDraft, losingtexttypedafterrequest. Disable thattextarea duringbusy (or preservepostsubmitgeneration); samefourfilesoriginalowner when slotfree. No other E reviewed finding remains.
- F original-owner repairturn active samefourpaths with queued state/typing/stalemap/recovery/sourcelink/correction-baseline fixes. Shared Scenario onOpenArtifact and Flow onRefresh added foractualrecovery.
- G active ContextTray earlyreview sent: failureeffecteraseschoices, undefinedselectedtogglewrong, optimisticpendingstate, technicalemptycopy. G repairswithinownership before release.
- H earlyreview identified rawIDentryrequired forwatchassumptions. Coordinator added labeledassumptionchoices pluspractice-notename/watchtitle/state/assumptionlabels/decisiontitles projections; I suppliesexistingrecorddata. H mustpresent choices/names, localpendingguards andrevision-awareappliedstate.

### Frontend E/F/G released; K ownership

- E final textarea busyguard released; owncheck/typecheck/diffpass. F allcoordinatorstate/typing/stalemap/recovery/sourcelink/correctionbase repairs released; owncheck/typecheckpass. F transientstraybrace fixedbefore finalchecks.
- G releasedfivefiles; owncheck, existingworkspaceUX, fulltypecheckpass. Contextretainedfailure/undefinedtogglefixed; legacyVerifiedisnotstoredverification; callbackrefslimitfocuslifecycletoopen/close. I mustwireactualfiles/manifests/additiveuploads.
- K `/root/k_draft_layout` TerraHigh dispatched exactfourKpaths; one mountedconversation, responsivecomposition/editorbridge/templatepreviewandtargetstate. Hactive. Read-only reviewer performs E/F/G independentreview; no assembledbrowserclaims yet.
- H previewreview correction: queuedresults mustnotclaimartifactcreated; unsavedtemplateinstructionmustnotcarryoldhash; savefirstbeforepreviewifdirty; preservependingedits. Coordinatoradded onOpenArtifact tobothHtemplateprops foractualsavedpreviewopens.

### Independent E/F/G review in progress

- Reviewer remaining E finding: Understand supporting-answer and IssueNavigator saves use a single pending-ID while allowing a second item save. Starting B re-enables pending A; typing into A then Acompletiondeletesnewtext. Original E repair queued afterreviewreleases slot: globalpendinglock orper-IDpendingSet withdeferredtwo-itemregression.
- H requested and receivedoptional PriorWork date/status/kind/snippet and OutputTemplate status/failure_detail fields matchingDoutput. K requested and receivedcurrenttarget/questionrevision plusKeep/updateoffer/conflictrecovery asynccallbacks. I mustwireall; nofakeversions/actions.

### E/G original-owner review repair transfers

- Independent E/F/Greview finished: threeownchecks/typecheckpass but twoP2s reproduced. Eglobalpending/per-itemrace repair nowactive. G malformedcolon-freesourcefirstrow shiftssecondsourceordinal1instead2; originalG repair nowactive. Reviewer changednofiles, Fhasnoremainingfinding inthisscope.
- H releasedallsevenfiles, twofocusedchecks/typecheck/diffpass. All11templatecontrols aredata-driven; explicitsavebeforeunsavedtemplatepreview avoidsoldhashmislabel. Coordinatornotes Hpreviewresult labels stillneed failure-state review (noartifact+failed mustnotPreparing/promisecompletion). Hreviewpendingoriginalownerrepairsthennotaccepted.

### E/F/G component acceptance; H repair

- Independent E per-itempending recheck accepted; G exactexecutedmalformed-sourceordinalrecheck accepted. Threefocusedchecks andtypecheckpreviouslygreen; finalassembledbrowser stillpending. F independentreviewfoundnoremainingmaterialissue inreviewedscope.
- H twoP2s independentlyconfirmed: Atemplate savecompletion mutates Beditorbase/savedTemplate; failed/not_saved preview renderedPreparing andpromisedcompletion. OriginalH repairactiveallsevenfiles, tests mustchangeincorrectstateexpectationwhilepreservingotherassertions. Reviewerfoundnoothermaterialpriorwork/note/watchdefect.
- Inspected existingbuilders for I: WatchBuilder(watchId?) cancompose D createdwatch; SkillBuilder(initialGoal) hasnoinitialdraft prop, so I mayrequestexclusiveextension ifneeded tocompose explicitDpractice-note draft/save; no neweditorneeded.

### H repair release; K original-owner repair

- H released generation/identity guards acrosssave/preview/copy/default plus truthfulterminalpreviewfailurelabels; twoownscripts/typecheck/diffpass. Independentrecheckactive.
- K independentreview4P2: awaitclosure usesoldactivepath soresulttakesovernewselection; dirtysnapshot overridesexplicitdifferent/mattertarget; keynotboundtotarget/template/revisions sochangedpayloadconflicts; failedpreviewpreparinglabel. OriginalK exclusive4filerepairactive. Coordinator alsoaskedSSR-safe preferenceinitialization (no localStorage-dependentfirsthydrationrender, no blankinitialwrite).

### H accepted; additional I seams inspected

- Reviewer Hrecheck accepted identity/generationguards includingA->B->A and executedactualpreviewState helpers: failed/not_saved/cancelled/completed/unknown-withoutartifact notPreparing; queuedPreparing; actualartifactopenable. BothHscripts pass. No remainingHmaterialfinding.
- Iadditional exactfrontend path: frontend/app/settings/page.tsx owns visible Answer.md editor/restore/save; assign toI solely toexpose Bcustomtextupdate_proposal withoutoverwritingcustomtext. AnswerContractResponse/sharedTSprojection mustretainit. Skillsentry exactpath frontend/app/skills/page.tsx alreadyinspected.
- Ialso receives frontend/lib/workspaceApi.ts forrealnewcalls and backend/app/models/workspace.py / frontend/lib/workspaceTypes.ts onlynecessaryfinalprojectionseams aftercoordinatorreleases; Afilevalidators mayneed actualuploaded/researchsource support. No Iwriterstarted yet.

### K frozen repair review; G required mixed-upload bridge

- Kfrozenoriginal4repairs plusSSR-safe effectrestore/fullrequestfingerprint testspassownscript/typecheck. Independentrecheckactive.
- Coordinatorintegrationinspectionfound G onUploadPromise<void> unconditionalbatchSaved cannotshowunsupportedfilemixedoutcome becausefailedfilehasnosavedlibraryrecord. RequiredF1bridge assignedoriginalG: AonUpload nowreturns FileUploadBatch|void; G rendersactualperfile outcomes andretainsretrywithoutallSavedclaim. IreturnsrealBnormalizedoutcomes. Legacyvoidcompatible; no unrelatedscope.

### All packages accepted; full integration dispatched

- Independentfinal KSSR/Gmixedupload recheck accepted. Root ran allsixnewNode/TSscripts together: **allpassed**. Module-typeless warning is existingexecutionstyle, notreasontoalterprojectmoduletype. These arecomponent/helperchecks, notassembledbrowserproof.
- `/root/i_integration` AstraHigh received fullprompt/contract/ledger and detailedB/C/D/J/UIseams. OwnsuserWave5exactfiles afterallwritersreleased. Additionalcoordinatorassignedpaths: backend/app/blank_vault_template/manifest.json; backend/app/vault_manager.py ifneeded; backend/app/models/workspace.py; backend/app/services/workspace.py actualsourcevalidation/projection; frontend/lib/workspaceTypes.ts,workspaceApi.ts; frontend/app/skills/page.tsx,frontend/app/settings/page.tsx; test_chat_history.py only3explicitproviderprotocolupdates; test_blank_vault_parity.py onlyexplicitmanagedcontract/localinstructionparityrepair ifneeded. Existingbundledcopilot/intakeagent and6I0tooldeclarations maybeupdated. Anyothernewtool/helper/sharedcomponentpathrequirescoordinatorexclusiveassignment beforeedit.
- I mustreturnactualFileUploadBatch toG, freezefullBcontextatsubmit/recovery andfinalizemanifestonlyafteractualsuppliedtoolreads, wireCactualcorrection/flowacceptreadonlyscenario, Dmissingstarters/naturaltemplating/reusewatch, Jcontent+reviewrevision/safeproposals/preview/updateoffers/packetexports, onechat/EditorthroughthreeviewsandallAprops. FullactualHTTPQ/X/S/T tests plusallnewroutes real, existingworkflowspreserved.
- Root keepsfinalbrowser/liveDeepSeek journey/screenshots/fullacceptance/graphupdate/protectedvaulthashes. I asksrootbefore .nextbuild/serverrestart. User8002/8090/3000untouched. No commit/push/deploy/send.

### I bounded tool declarations assigned

- I confirmed onlyI0routes/runtime wereconnected and iswiringallacceptedservices. Assignedexactnewbundled toolfiles workspace_action.md and manage_output_template.md underbackend/app/blank_vault_template/00_System/tools. They useexistingassistant/registry/handlers, no newagent/service. Groupedworkspace subactions mustenforce scenario-safe capability at executor/runner/recovery, no generictool bypass of I0readonlyboundary.
- Rootwillnotbuild.nextuntilIreportsfrontendtypecheckclean; rootownscoordinatedrestart. I mayrunbackendtests/typecheck/scripts whilewiring.

- I received exclusive ownership of backend/app/blank_vault_template/00_System/tools/save_work_product.md for typed new-document, output-template, selected-range and source-copy arguments. Existing write guards and the single assistant path remain required.

- I now owns frontend/components/SkillBuilder.tsx for a bounded prefilled practice-note draft and caller-provided save callback. Ordinary skill creation remains supported. Backend early probe ready: all 17 workspace_interactions route tests pass; terminal manifests and full lifecycle checks remain pending.

- Concurrent unrelated work is still present: brand_pitch.md and additional lean-canvas/pitch decks (through v11). No team ownership or edits to these files. Preserve them.

### I early configured-provider probe — defects retained

- Real DeepSeek multi-turn HTTP probe in a copied fixture vault completed; evidence: /var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-workspace-live-no8t_47i/result.json. Scope and supporting answer saved, with a linked reported fact. Customized template generated a durable editable memo with the three requested headings; reusable template stayed unchanged. This is not full journey acceptance: the harness initially omitted conversation_id between turns and is corrected for the next run.
- Live failures sent to I: untyped workspace_action.values causes repeated guessed arguments; a same-run fact write makes frozen-baseline correction fail; explicit hypothetical save request produced analysis without saving; reply contains process narration; artifact template_use.overrides discarded submitted length override. Memo used the old renewal date after failed correction. Repair and a same-conversation rerun are required.

### I broad regression and second live pass

- Coordinator ran `cd backend && .venv/bin/pytest -q`: **992 passed, 9 failed, 1 warning, 298.97s** against early assembly. Five known integration obligations remain: manifest Answer contract parity, bundled/local agent parity, and three provider fixtures missing the initial scope declaration. New failures: valid context subfolder lacks the chat label expected by one old tree test; three legacy direct-tool draft tests expect targetless canonical revision. I owns repairs without weakening actual HTTP target/revision guards.
- I additionally owns the one chat-history tree test adjustment to select actual conversation files while preserving its chat label/path/content assertions. New persisted context folder is a legitimate tree-layout change. No blanket test relaxation.
- Second configured-provider probe used one conversation throughout: `/var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-workspace-live-vf_u0mvl/result.json`. Corrected renewal date21Oct2026 is actually saved and in the memo; one-off length override retained in artifact metadata, reusable template unchanged. Scenario save still blocked at runner's execution guard despite narrowed exposed schema and executor exception; exact missing subaction exception sent to I. Supplied research heading “Verified primary sources” also copied into memo without a current verification event; prompt/source-status repair requested. Not final acceptance.

- Original J /root/j_drafting receives exclusive backend/app/services/work_product.py and focused test_workspace_drafting.py for the two outside-counsel packet create_draft calls to retain source_run_id from draft_context. I requested this seam and does not edit those files.

- Original J released packet source_run_id forwarding: regression failed before fix; all27drafting tests pass after fix and diff check passes. Only assigned service/test changed. Existing independent reviewer a_review now rechecks the bounded repair read-only; fresh assembled reviewer still required later.

- J packet run-ID repair independently accepted: three packet/retry/export/partial/preview checks pass. I frontend reports typecheck and all6scripts pass; coordinator production build now running, I frontend frozen until result.
- Live scenario-resume evidence: saved hypothetical and later actual fact are durable; memo unchanged after fact change. Still no durable update offer, and explicit selected memo update request produced prose-only edits with a redundant confirmation request. I must repair prompt/tool use so requested proposals are persisted through document review. Evidence at live vf_u0mvl/scenario-resume.json.

### Assembled browser pass in progress

- Coordinator production build passed. Backend8107 now uses configured openai_compatible with isolated fixture vault/pointer; session34715. Frontend3107 session33648. User servers unchanged.
- Verified unsent composer text across Understand/Discuss/Draft, reload restoration of Draft+unsent text, mixed library upload TXT Saved / PDF Saved·Partial text(page2 unavailable) / EXE Not saved, second inquiry batch additive selection, originals/partial-state/selection after reload, name search, exact extracted page1 and original link, Files drawer Escape focus return and keyboard wrap. Screenshots are under isolated root/screenshots.
- Browser defects routed I: context tray missing unselected available file choices; open file leaves drawer over result; originalTXT editor lacks content/review hashes for guarded source copy; narrow page overflow/sticky chat overlay. I reports parent wiring/CSS repairs; rebuild/recheck pending.
- Actual configured browser clause run RUN-20260905-d1ba3b saved a separate45day clause with10day termination/defined terms preserved; original bytes unchanged. However source-copy action first failed and model fell back to ordinary draft, so required source-copy lineage is not accepted yet. Evidence isolated root/browser-clause-evidence.json.
- T1 UI copy/edit works and retains fields after failure, but Save returns500: flat audience field passed to SkillRegistry.update_output_template instead of defaults. Exact route repair requested from I. Keep current unsaved editor open for retry after backend restart.

- Fresh assembled independent reviewer /root/assembled_review AstraLow dispatched read-only after initial assembled build/typecheck/scripts and live/browser probes. It has fullscope/contract/tracker/currentinventory and known I repairs. I continues final parent/backend seams; rootbrowser continues. No reviewer writes. T1 firstretry foundremaining3flatdefaultfields; I nowhandlesall7 andfullHfixture, rootretry pending.

### Final review and second browser build

- Fresh read-only reviewer accepted initial exclusion, direct fact correction/update-offer/scenario-match, same-conversation shortcuts, source overlay manifest, inspect publication and useful-answer persistence-failure repairs.59 regression tests and one final scenario-save failure case pass. A later actual retry audit found a material immutable-manifest defect: successful retry tool reads are absent from the first terminal manifest. I owns a per-attempt identity repair; independent recheck required.
- Build43482 passed; frontend3107 session20632, backend8107 session32399/PID35696. Latest scenario-save catch needs next backend restart. Root full pytest session65621 is running with one failure pending summary. Old frontend UX check fails at the recommendation-routing source-pattern assertion; I owns that script to preserve semantics with final composition.
- Actual browser template copy/edit/save/preview/Open/Keep passed. Customized three-heading memo uses saved template version2 and one-off200-word override; reusable350-word default unchanged. Kept label and removal of Keep control verified.
- Actual browser lawyer memo edit survives view switches. A save during run submission triggers stale-target protection; useful proposal retained, both lawyer edits and unsent text preserved. Rebase uses an explicit prepared request in the same conversation, currently running.
- Second narrow check still failed at actual390px: long issue/source buttons overflow to505px and sticky conversation covers the question. K original-owner narrow normal-flow repair released; I owns global wrapping. Rebuild/review pending.
- Final configured-model scenario/correction/offer/revision probe started in copied disposable vault /var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-scenario-final-cn1vqt5b, session74841.

### Browser recovery, reuse, flow, and final live revision

- Full backend result:1015passed1failed445.33s. Only remaining old author fixture omitted scope and selected document revisions; I updated those inputs and retained all author/direction assertions, focused test passes. Another full final run is required after late repairs.
- Retry manifest fix independently accepted: five tests plus actual failure/retry/new-read/completed-write probe. Attempt1 remains immutable, attempt2 shows actual reads, one logical run/conversation/user message and one completed draft.
- Old frontend aggregate exposed real recommendation-loading fallback to generic editor. I fixed typed loading branch; entire aggregate passes without editing its assertion. Build45716 and build15075 passed. Currentfrontend11277.
- Actual390/768/1024px widths now have scrollWidth belowinnerWidth and no narrowstickyoverlay. Screenshots recorded. K normal-flow narrow repair accepted by reviewer.
- Actual60day clause source-copy succeeded with supplied_original lineage, content/review revisions and exact unchanged original. Evidence browser-clause-final.json. Memo rebase succeeded through configuredchat with both lawyer notes preserved; sixpendingchanges displayed, oneaccepted. Accepted-text Word export contains onlyacceptedwording and bothnotes, zero pendingtracknodes; rawMarkdown markers exposed Jexport normalization defect, originalJ repairactive. I original RevisionPlugin emphasisoffsetmap fixed misplaced deletion display; freshbrowser recheck pending.
- Scenario saved/analyzed in sameconversation; actualflow actors/relationship/timing/custody/ownership/uncertainty saved. Explored issue state survivedreload. Prior work returned source/date/differences; explicitInclude saved. Practice note edited/saved viaexistingbuilder and explicitlyapplied to matter; noautomaticapply.
- Final configured scenario/actualfact probe produced durable scenario and update offer with unchanged memo, but explicitrevision initiallygaveonlyprose. Iplacedselecteddocumentproposal rule besidecurrentuserinstruction; identicallastturn recheck now saved realpendingrevision withoutsecondpermission. Evidence /var/folders/xb/kzc31shn1pz2s_5l2fy6d7rh0000gn/T/themis-scenario-final-cn1vqt5b/requested-revision-recheck.json.
- Checklist actualbrowser request running; frontendrefresh tests runrecovery. Remainingledgerstillpending; nofullacceptanceclaim.


### Final recovery and export repair checks

- Original J repaired Markdown export projection. Independent review now passes exact identifiers/URLs, code literals, triple emphasis, selected-source omission, tracked changes and comment anchors in DOCX/PDF and both export modes. 76 related tests pass; reviewer export/packet subset21passes. No remaining export finding.
- I repaired redline position mapping for literal intraword underscores and URLs; real Lexical checks pass. Actual browser markup now aligns with the words.
- Browser-created Harbor Relay matter exposed a missing intake answer/question projection in Understand. I added real saved-answer and stable-question projection, preserved explicit lawyer scope, and removed a duplicate answered-state write that broke partial recovery. Independent HTTP checks pass, including injected failure and exactly one reported fact. Actual UI follow-up is running after restart; older pre-repair replies are not invented into a current summary.
- Failed actual checklist request now restores its saved fallback and Retry after reload. Root clicked Retry once. It preserved useful output but source-copy save failed on the supplied Markdown checklist; exact error sent to I. This journey is not yet accepted.
- Composer File drop was absent. Original I wired the same additive upload/retry path into the one ChatPanel. Root native CUA drag instrumentation shows the tool replaces File data with text/plain and chromium/x-drag-id (destination files=0), including a same-origin fixture. Thus native CUA file-drag is not claimed as passed. I owns new frontend/scripts/check-workspace-file-drop.ts and package registration for a real browser File/DataTransfer check in the isolated fixture only. Picker checks continue separately.
- Temporary frontend/public/__acceptance_drop_fixture.html is coordinator-owned test instrumentation, not a product change; remove before delivery. Temporary HTTP3108 is coordinator-owned. User ports/vaults remain untouched.
- Build17330 and build29812 pass. Current frontend3107 session75952; isolated backend8107 session55938/PID41936. Full final pytest session66938 is running to final-pytest-after-repairs.log. Browser ledger remains pending where not directly shown.


### Final assembled source, watch, and file evidence

- Full backend suite after recovery/export/intake repairs: **1031 passed, 1 existing warning, 422.26s**. Later source-copy/routing seams pass four focused HTTP tests independently (17.10s). Final UI build27818 passed.
- New actual Harbor supporting answer saved a linked reported revocation fact and stable next fund-control question. Understand Leave open survived reload. Explore why exposed omitted-agent routing on a real intake matter; I repaired frozen queued agent selection, independently rechecked same-key replay and actual UI routing.
- Composer uploads from Discuss and Draft saved both files and retained unsent text; Understand inquiry picker mixed validTXT Saved with26MB Not saved/25MB-limit explanation. Library same-name upload ultimately saved a unique digest path, retaining earlier source. Shared drawer previously claimed composer files were unselected; I unified durable selections and removed deselected composer references. Real browser File drop check runs in a separate headless Chromium on the same isolated Relay fixture; nativeCUAFiledata limitation remains separate.
- Uploaded original Markdown source-copy guard repaired by I. Private companion target is now visible when opening the original checklist, which stays read-only. Actual checklist chat rerun is active; switched displayed document to memo during generation and typed a retained unsent note.
- Actual evidence drawer now shows the exact saved notice passage with SourceID SRC-08BC38EA54A72041, supplied label, original30-daynotice and10-daytermination, saved-extracted locator and honest unknown retrieval date. Screenshot evidence-final.png. No fake verification.
- E reading-surface worker restored at original TerraHigh role, exclusive UnderstandPanel/check-workspace-understand. F restored TerraHigh, exclusive ScenarioPanel/check-workspace-exploration. Both render saved Markdown, preserve full text with reversible long-content disclosure, and bound tables/code. Reviewer caught short-tall clipping without expand; both added length guard and regressions. Own scripts/typechecks pass. Root final narrow verification pending.
- Scenario explicit adoption changed only facts.md among baseline canonical/draft files; saved memo/clauses unchanged, update offer visible. Reassessment uses same conversation and may fail with useful saved output when provider unavailable. Recent configured-provider scenario/packet attempts failed before work; these attempts are not marked acceptance.
- J independently verified assumption-watch integration through real AppContext/HTTP/pipeline in copied temporary vault: explicit draftwatch→activate→simulateddevelopment→required/openlinkedreviewpacket, allfourrecordeddecisions byte-identical. Only providerresult simulated and labeled. Evidence j-assumption-watch-acceptance-7s95gbbs/summary.json; browserproof pending.
- Temporary public drop fixture removed before build27818. Concurrent unrelated pitch/lean-canvas edits now throughv12 remain preserved. Parent artifact restoration forcingDraft despite savedUnderstand was reproduced and I repaired quiet artifact restoration; nextbuild running.


### Final acceptance evidence and two last repairs

- Final frozen backend suite: **1034 passed, 1 existing Starlette warning, 396.31 seconds**. Frontend typecheck, workspace UX checks and all six new checks pass. Final H build passes. Graph refresh completed after H; later application edits need a fresh update.
- Actual chat checklist retry completed in the original conversation and logical run. The chosen supplied Markdown produced a separate review copy. Opening a fresh supplied Markdown now preserves exact original bytes. Selected checklist changes were accepted; remaining changes stayed pending and all tasks stayed open.
- The actual outside-counsel run produced a separate brief and cover email. The lawyer selected only the original notice clause, supplied a reason, reviewed the packet and prepared two Word files plus that original. Exact original bytes were preserved. No file was sent.
- Memo accepted-text export was regenerated after the export repair. Both lawyer notes remain, only accepted wording is applied, pending Word track nodes are absent, and raw Markdown markers are removed. The 60-day clause retains the 10-day termination period and supplied-original lineage.
- Harbor actual chat preserved the left-open fund-control question and linked the reported revocation answer. A follow-up returned a copy-ready question and reason. The excluded source is omitted in the actual next-run manifest, including source aliases and indirect history.
- Template copy/default/stale-save checks passed in the browser. A stale version-3 editor retained local text after conflict; version-4 remote edit survived. A later save restored the name. H original Sol Medium repaired the disabled-save status using the returned saved state. Independent Astra Low review and focused checks pass; final browser saw version 6 say it is disabled and unavailable. The fixture was re-enabled afterward.
- Original I ownership reactivated for a final saved/failed split: flow acceptance POST succeeded and persisted the selected fact, but a later page refresh stalled and showed a failure on the completed operation. I investigates the actual backend stall as well as the receipt path. No repeated fact mutation by root.
- Restored original F role as /root/f_flow_diagram_repair, Terra High, exclusive BusinessFlow.tsx and check-workspace-exploration.ts. Current ordered editable list is present, but the required simple diagram was omitted. Add a small native diagram beside the equivalent list; no new framework. Independent review and browser check remain required.
- Root continues watch/review packet, recap, research snapshot and navigation checks. These remaining checks are not marked passed by the automated suite.


### Resume and final browser findings

- User said continue after an agent usage-limit interruption. Original I and the independent reviewer resumed at their required models. No model substitution, reset purchase, commit or deployment occurred.
- Flow diagram repair independently accepted: native named route and optional recorded details, equivalent editable list, React escaping and narrow layout. It is visible in the actual application.
- I confirmed the delayed status cause with a profile: a status read parsed 328 Markdown files through the full matter projection. The existing direct matter path reduced the same copied-fixture status lookup from about 2.9 seconds to about 0.02 seconds. All55 chat-run tests pass, including missing/foreign/traversal records. Independent review accepted this repair.
- The fact receipt now returns before optional refresh, removes only server-confirmed accepted proposals and preserves other choices. Independent callback fault tests pass. The configured reassessment ConnectError remains a separate truthful failure.
- Actual watch browser check passed in the J copied fixture: Settings loaded the canonical /private/var path, Briefing displayed the labelled simulated development, Today linked the required packet, Decisions displayed affected assumption/prior basis and explicit review actions, Watch Builder displayed one successful development/briefing/connection. The recorded decision SHA256 remained4da7cc64c74f4ea5a35d7904239462ca6e3587f75c4f09fbd03f97e8e90e92b7. Only the isolated active pointer changed and it was restored to the main copied fixture afterward. An initial /var alias was correctly rejected; no product change was needed.
- Browser final flow Save succeeded, but immediate fact acceptance exposed a stale source-map sibling: flow refresh did not refresh workspace.source_revisions. Original I owns MatterWorkspace.tsx/check-transport-preservation.ts for authoritative flow/source-map pairing and the same saved-response/optional-refresh pattern in immediate sibling callbacks. Required operations remain awaited.
- Root found InquiryActions had no assembled import despite the accepted component. Original I must connect it to the current target and existing same-conversation action path. This closes reachable Explain, Stress-test and Ask the business actions; no second assistant.
- Legacy browser Run research reached the actual HTTP route and failed500: a synchronous route called asyncio.create_task without a running loop. Original I receives exclusive routers/matters.py research-start handler and focused test_research.py regression. No other router ownership is transferred. Final backend suite must run after this repair.
- Final evidence draft is docs/single-lawyer-workspace.verification.md with selected safe artifacts under output/single-lawyer-workspace-acceptance. The draft is explicitly not final acceptance yet.

### Final saved-snapshot and declined-update controls

- I restored the saved-research snapshot notice in Draft and preserved nonempty composer text as a separate prepared request. The independent reviewer accepted selected-artifact and revision binding, local-edit preservation, and no automatic submission. Typecheck, both UI groups, and the isolated production build passed. Final browser check follows.
- Actual browser decline of the 60-day clause offer preserved draft bytes but removed the required earlier-facts label. I now owns the minimal workspace projection and backend regression. Original K role was restored as `/root/k_declined_indicator_repair` (Terra High), owning DraftWorkspace and its existing UI check only. Existing declined state will display earlier facts without repeating the offer. Independent review and browser reload proof remain required.

- S3 repair released and independently accepted: I projects the latest offered/declined state only for the current draft revision. Two new HTTP cases first failed, then passed; the existing accepted-revision journey also passed. K renders “Earlier facts · Draft retained” and omits offer controls for a declined update. Actual browser reload confirmed the label remained.
- Final snapshot browser check passed: correct selected cover email, nonempty message preserved, explicit append only, no submission, and nine protected draft/decision files unchanged. Keep current message dismissed the prepared text. Mark seen then reload produced “No new saved work”; Understand and the unsent message remained. CUA viewport override reset. Final full suite and normal build are still finishing.

- Final navigation rerun passed all functional paths and the new 390px prepared-request check, but captured React hydration error 418 on Today after local midnight. The existing Today page renders the current date in static output; the client date can differ later. Original I is restored with exclusive Today page and initial-load check ownership for a small stable-initial-render repair. Do not suppress the warning. Backend remains frozen.

- Today repair frozen and independently accepted. The original server output said September 4 while the browser said September 5 and emitted React 418. The actual-page regression reproduced this before the change. The page now has a stable initial date field and fills the browser-local date after mount, with no warning suppression. Regression and typecheck pass. The backend final result remains 1,040 passed in 376.42 seconds.

### Completed — 2026-09-05

- Final backend: `cd backend && .venv/bin/pytest -q` — 1,040 passed, one existing warning, 376.42 seconds.
- Final frontend: typecheck, workspace UX, all six single-lawyer checks, isolated production build, then normal `npm run build` all passed. The final normal build has no test API override.
- Final actual-browser audit: 22 checks passed, no page errors. Includes navigation, all Settings sections, flow at four widths, keyboard return, reduced-motion preference, and a 390px prepared request with unsent text intact. Configured chat work and export evidence are detailed in the verification report.
- The final declined-update label and quiet return-visit recap passed after reload. Nine draft/decision records remained unchanged across the draft-update control checks.
- Protected vault hashes match the initial baseline (717 and 998 files). Existing user pointer and servers remained untouched. Own test servers stopped; viewport override reset. No commit, push, deployment or external message.
- `graphify update .` and `git diff --check` passed after final application changes. Unrelated pitch and canvas work remains preserved.
- All approved work is complete. The evidence report distinguishes real configured-model runs, deterministic provider fixtures, actual browser actions, and automated boundary checks. Historical failures and test limitations are retained.
