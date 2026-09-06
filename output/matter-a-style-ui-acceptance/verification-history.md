# Matter A UI verification

Status: C1–C9 integrated. Frontend aggregates, typecheck and production build pass. Backend full suite: 1190 passed, two timing failures; both unchanged failing tests passed in a focused retry. Browser acceptance is in progress; browser-ledger.json is authoritative. Fresh independent review is starting. Historical progress below is not the current result.

Current evidence: implementation.diff, test-diff.patch, checks.json, control-audit.json, state-audit.json, and browser-ledger.json in output/matter-a-style-ui-acceptance. All implementation writers stopped. Latest C9 correction adds a narrow sticky Editing label using existing active-document identity. Latest checks: typecheck/workspace-ux/accordion/navigation/build 20260905-1535 all pass.

Desktop next-action top499.78px at measured1280×900. Mobile next-action top623.26px at390×844 with no page overflow. Mobile visually moves the action before the answer while DOM reading order remains question → answer/qualification → action; this tradeoff needs independent review against the ordered blueprint. Full answer is not clipped or removed. Long answer fixture reveals END OF FULL FIXTURE ANSWER and both links; missing supplied claims honestly disable links, and adding fixture claims restores source lookup.

Word export rendered cleanly. PDF export contains the correct A draft and references, but a long path clips at the right edge. Export backend is unchanged; record as existing export limit, not a UI pass for layout. B remains unsaved and separate.

Harness correction: BaseHTTPMiddleware request logging caused intermittent in-app fetch failures despite200 responses. Replaced acceptance-only logger with a pure ASGI send wrapper and restarted owned API as session77425. Normal8000/3000 services remain untouched. A root navigation to nonexistent /research caused one expected404; the actual shared route is /matters/<id>/research. Neither historical harness failure is counted as an application regression.

Browser observed: full issue/source/disposition journey, one chat-run shortcut, 34-record map, scenario cancel/analyze with unchanged actual facts, two dirty drafts/revisions/source, template preview then explicit keep, explicit file inclusion, business prepare/copy then external-record action, source-only comparison, lower sections/focus/retained form, explicit finalize/approve/manual-delivery fixture actions with separate closure control. Remaining rows are labelled honestly in the ledger. No actual message was sent.

Cleanup and final protected hashes are pending. Protected vaults matched C0 before browser work.

Runtime: coordinator gpt-6-astra low, verified from the current session turn_context. Actual workers Terra high: c1_review (C1/C5), c2_documents (C2/C4/C8), c3_conversation (C3/C6/C7). A fresh independent Sol medium reviewer is pending combined implementation and evidence.

## Baseline and isolation

Evidence directory: `output/matter-a-style-ui-acceptance/`. `baseline-status.txt`, `baseline-hashes.json`, `baseline-owned-source.json`, `ownership.json`, and `protected-before.json` preserve the preflight evidence. All 47 source screenshots and all 12 final numbered design images were viewed. Inventories from all four clusters were read. The Discuss inventory’s old disabled-composer inference is superseded by its final correction and blueprint.

Normal services: 3000/8000, not owned. Acceptance services: 3123/8123; dedicated temporary vault and separate active pointer are in environment.json. Health confirmed actual isolated vault and mock provider, config confirmed disabled search/scheduler. Fixture MAT-20260905-f025e4 has six issues, shared questions, sources, work products and a decision. Workflow fixtures are prepared: conversation, comments/tracked changes, business flow, historical scenario, completed/partial research, duplicate title with legitimate final version, answered question, handoff, comparison and a second empty matter. No reference matter action is authorized or used.

Next generated a known tsconfig include/next-env delta for isolated output; restore only this generated delta after verification.

## Contracts and control map

Frozen contracts are blueprint sections 3 and 4.4. No new persistent state/API is authorized. C1 alone owns sectionNavigation?: React.ReactNode; C9 consumes it and supplies the exact reveal DOM hooks. All original control destinations are mapped in the five survey inventories and chunk handoffs. Each acceptance report will record retained/relocated controls.

## Check ledger

Pending stable combined implementation. No broad suite run during preflight.

## Browser B01–B26

All pending. Browser access succeeded via an owned in-app tab. 200% zoom waived.

## Interim control audit

`output/matter-a-style-ui-acceptance/audit_controls.cjs` compares JSX event-handler expressions against the C0 source. Accepted C1 and C2 retain every handler expression. C3 retains all old handlers and adds latest-answer navigation. This is static evidence, not browser completion. Final audit will run after C9.

Known fixture preparation correction: finalizing an earlier draft was rejected by the canonical-draft rule. The current duplicate-title draft was finalized successfully through the existing service. No application code changed for this fixture.

Owned API was restarted after adding isolated request logging and a deterministic template-preview provider. New session63970; old21960 stopped cleanly. Health reverified the isolated vault/mock provider. Application providers and backend source remain unchanged.

Browser capture calibration: initial tab1 capture was corrupt and is NOT acceptance evidence. A fresh in-app tab using the documented Playwright/screenshot API captures correctly. Browser page zoom is1.1; viewport override1408×990 produces measured CSS1280×900. Acceptance measurements use actual innerWidth/innerHeight, not the override input. Old tab1 closed. Avoid mixing native-style getAX/getScreenshot with the calibrated capture API.

## Control destinations after leaf implementation

| Existing work | Current destination | Preserved boundary |
|---|---|---|
| Answer, qualification, next action, ranked review | Understand orientation and compact review rows | Full text and actual issue IDs |
| Issue claims/questions/options/disposition | Selected issue detail | Revision checks and explicit save/cancel |
| Sources, revisions, cited passages | Reference preview and Evidence drawer | Opening does not include context or select editable target |
| Draft tabs, comments, tracked changes, save/export | Draft document surface | Existing editor and exact document identity |
| History, run status, attachments, composer | One mounted conversation in Discuss | Stored chronological order and separate reset callbacks |
| Files and inquiry context | Files & context drawer | Library destination, open action and explicit inquiry inclusion stay separate |
| Templates and saved defaults | Optional template library/editor | Preview, overrides, reusable save and keep remain distinct |
| Business requests, external records, replies | Business reply panel | Copy is not sent; explicit external-record action |
| Handoff and comparison | Continuity panels | Frozen scope/references, saved history and explicit actions |
| Hypotheticals and actual corrections | Exploration panels | Separate baseline, analysis, adoption and actual fact correction |
| Business flow, prior work, practice notes, watches | Lower exploration/reuse panels | Local drafts and existing save/include actions |
| Research/recommendations/review packets | Work and records panels; existing shared routes | All states and actions retained |
| Local/whole map, outline and selected detail | Separate map route | Full IDs/edges and one route conversation |

The section index, frame and lower-control relocation are pending C9. Root-added `check-matter-a-navigation.ts` will verify native non-submit buttons and exactly one reveal callback with the supplied ID.

Protected data rechecked before browser work: both vault roots and active pointer match C0 exactly (`protected-pre-browser-check.json`).

## Combined check update — 2026-09-05

All C1–C9 files are integrated and static audits are accepted. Typecheck and production build passed. The named frontend aggregates now pass after focused test repairs. The backend suite is still running; no browser acceptance is claimed yet. See the chronological checks.json ledger for all intermediate failures.

Root corrected CSS-migration assertions to inspect the imported CSS modules and retained behavior. The old accordion test described an already removed Overview/Chat frame at C0; it now renders each actual hidden slot for every view and discussion state, while retaining document-close recovery and navigation checks. Transport harness bindings for existing handleEditorSnapshot and localStorage use were missing at C0; these were supplied without changing production code. Intake-conversation fallback and scenario-baseline assertions now match their actual C0 contracts. Map and tab text assertions follow readable labels while still invoking exact identity callbacks. Fresh Sol review of every test diff remains required.

Root found two actual CSS omissions: narrow conversation retained grid column2, and map controls lost wrap/bounds. Exact Terra owners corrected them. No application file outside ownership changed. globals.css is byte-identical to C0.

The clean in-app browser loaded an honest unavailable-matter state while API requests returned200. This is under investigation. It is not counted as a pass or silently dismissed.
