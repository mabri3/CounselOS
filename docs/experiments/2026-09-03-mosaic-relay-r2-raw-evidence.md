# Mosaic Relay R2 — Normalized Live-Run Evidence

## Method and completion

The test used the dedicated visible-UI vault `Mosaic Relay UX Experiment 2026-09-03 R2`. Mosaic Relay is fictional. Ten requested matter runs completed as distinct attorney matters. A first run-03 matter (`MAT-20260903-f37f48`) is incomplete because its in-app browser connection ended before it could record its prepared decision. A fresh independent retry (`MAT-20260903-97c9c3`) supplied the valid run-03 completion. This does not split a matter across attorneys.

Every actor used the in-app browser directly. Common non-product issue: the in-app browser's control runtime often timed out during long waits but actors reconnected to the same visible tab. Browser visibility toggling was unavailable in a subagent thread. No actor used APIs, source, database, vault files, network calls, hidden DOM, headless browsing, direct writes, or code changes. No real person was contacted.

Common external environment result: public research often timed out. The UI commonly saved a partial packet and stated `Partial research is saved; no public source was retrieved.` This is a positive graceful-degradation behavior unless a separate artifact/state failure is stated below.

## Setup evidence

- The visible in-app browser created a new vault, preserved the prior vault, saved the Mosaic Relay profile, and showed `Company profile · Saved` and `No unsaved changes`.
- **F-S01:** Selecting `Leave blank` for the optional website repeated the website question. `Review draft now` recovered it; delay 2–3 seconds.

## Run 01 — Marketplace Seller Onboarding Refresh (completed/closed)

Evidence: `MAT-20260903-724266`; phases `Just came in → Research → Waiting on your judgment → Being drafted → Ready to send → Closed`. Facts/issues, partial research, lawyer recommendation, decision, final response, manual delivery, and closure were visibly confirmed.

- **F-01:** `Add participant` did not immediately show Marcus after the first click. Re-enter/retry after a wait showed him. Expected direct saved-state feedback.
- **B-01 candidate:** In `Open artifact`, after focus and `ControlOrMeta+End`, typed note appeared before original title and damaged the Markdown heading. Two Undo actions restored it before save. Expected append at end.
- **B-02 candidate:** Closed banner said `Matter closed`, but `Open work queue` showed `1 open work items` and a `Complete` control for `First-pass US-only launch review`. No normal recovery was used.

## Run 02 — Contractor Background-Check Integration (completed/closed)

Evidence: `MAT-20260903-e03847`; final state Closed; 32 documents. Guided intake, three partial research workstreams, revised draft, recommendation, durable decision, approved final response, manual delivery and closure were visibly confirmed.

- **F-02:** Operations showed `Working…` / `Still working…`; typical generated operations took 18–26 seconds and research took about 85 seconds, with little intermediate information.
- **F-03:** Each guided answer repeated the full orientation and priority list, creating a long transcript and scrolling burden.
- **F-04:** `Continue from saved research` only filled the composer and showed `Prepared request · Not sent. Review it, then select Send.` A second explicit send was required.
- **F-05 candidate:** Queue said `Open work queue · 0 open work items` though facts/recommendation/decision contained clear vendor, state-matrix, dispute, and launch responsibilities.
- Briefing search `background check FCRA` returned `0 developments`; this is a repeated empty-state observation.

## Run 03 — ACH Debit for Subscription Collections (valid retry completed/closed)

Evidence: `MAT-20260903-97c9c3`; facts, issue map, separate recommendation/decision, reviewed draft, approved final response, manual delivery, required-work completion, and closure confirmed.

- **B-03:** The structured intake card stated `The next intake question could not be restored automatically. Send a message to continue.` `Retry intake question` resumed processing, but the error appeared again and the account-mix question could not be answered as a card.
- **B-04 candidate:** Overview repeatedly showed `No research packet is saved yet` after legal issue analysis. Expected a visible research packet/artifact.
- **B-05:** Recommendation editor showed `Version 1 · Lawyer · Lawyer edit`, while overview said `No working recommendation is saved yet`. Expected one consistent saved-recommendation state.

## Run 04 — Payout Hold and Account Deactivation (completed/closed)

Evidence: `MAT-20260903-61b4b7`; saved facts, issue map, owner mapping, recommendation/decision, finalized/approved response, local delivery, closure, Decisions and Workspace verification.

- **F-06:** Guided intake had many sequential questions, 9–12 seconds each, and repeated the contract-rights topic.
- **B-06:** Chat research/drafting showed `Themis.ai could not finish this request.`, `Saved response`, and `The request stopped before completion. No tool work completed.` `Retry` did not save a research packet. Actor manually completed remaining artifacts.
- **B-01 corroboration:** In issue-map editing, `Control+End` placed inserted content before existing content.

## Run 05 — Refunds for Split Payments (completed/closed)

Evidence: `MAT-20260903-bad495`; intake created work items; partial research and analysis saved; recommendation version 2 and decision saved; final response approved/delivered; seller-term draft completed; matter closed.

- **F-07:** Briefing showed `0 developments`, `0 unread`, and no saved research.
- **F-08:** Attempt to save seller amendment as canonical work product failed with `save_work_product failed: Reopen the delivered response before changing its canonical work product.` The app saved it as a separate editable draft; the final response stayed protected.
- **F-09:** Closure initially displayed `Complete required work before closing the matter: Draft seller term amendments...`. It recovered after completing required work and was a correct guard, but the required-work condition was not obvious until closure.

## Run 06 — Privacy Controls for Risk Data (completed but not closed)

Evidence: `MAT-20260903-63c4be`; intake, eventual research, data-flow/work items, canonical draft, recommendation, decision and approved internal final response saved. Final stage `Ready to send`.

- **F-10:** `Continue in background` disappeared as orientation completed. Low impact.
- **F-11:** most saves/work-product generation took 10–30 seconds with `Working`/`Still working`.
- **F-12:** Dossier after research/recommendation/decision still said `Research has not been added yet` and `No work product yet`; chat and canonical artifact had current work. Expected dossier state to reflect saved work.
- **B-07:** Three research chat attempts showed `Themis.ai could not finish this request` and `No tool work completed`; a fresh chat with combined research/drafting eventually succeeded.
- **B-08:** `Close matter` showed `Recording…` then failed with `move_matter_stage failed: Use the close matter action so delivery and required work are checked.` Retrying direct close after saving/opening current work product still failed. Expected close or a visible reason/action. No closure occurred.

## Run 07 — Bank-Level Security Marketing Claim (completed through finalization; not closed)

Evidence: `MAT-20260903-dcaeb3`; saved facts, issue map, research memo, substantiation file, surface inventory, approved wording, recommendation, six work items, response/final, local delivery record, and decision. Stage Ready to send / waiting on Security & Compliance.

- **F-13:** `Add participant` and `Assign owner` stayed disabled for 1–2 seconds after valid input; saved list updated only after waiting.
- **B-01 corroboration:** In document review, `ControlOrMeta+End` put a redline note at document start and damaged heading; recovery was close without saving.
- **F-14:** Research queue remained `Still working…` >1 minute then partial.
- **B-09:** After local delivery, app said `move_matter_stage failed: Use the close matter action so delivery and required work are checked.`, but no close-matter button was visible. Searches found only document-close controls. No recovery.

## Run 08 — Consumer Dispute Intake and Communications (completed/closed)

Evidence: `MAT-20260903-5311e9`; intake, draft, research packet, recommendation, decision, final response, manual delivery and closure visibly saved. Closed final state.

- **F-15:** Nine guided questions were serialized; each took 12–14 seconds (`Answer saved`), about two minutes and 18 interactions.
- **F-16:** Recommendation stayed `Still working…` >100 seconds. `Continue in background` and later artifact verification recovered.
- **F-17:** finalization controls showed `Working…` for 25 seconds.
- **B-10:** Chat decision request failed twice with `Themis.ai · Failed` / `The request stopped before completion. No tool work completed.` Manual `Record durable decision` succeeded.

## Run 09 — Sanctions Screening Alert Handling (work complete but not closed)

Evidence: `MAT-20260903-6d7dcf`; partial research, seven work items, recommendation, separate conditional decision, final response, and local delivery were saved. Matter ended `Waiting on your judgment` / board `Waiting on you`.

- **B-11:** Edit workflow showed `Unsaved changes`, then `Saved`, but a typed attorney note was absent after save. Repeated second attempt also did not persist. Expected visible content saved.
- **B-12:** Delivery confirmation said `awaiting your approval` and `your click performs the delivery action`, yet no delivery button was visible. A second chat instruction then reported `Delivery complete`; direct-control wording and controls conflicted.
- **B-13:** `Close matter` on prepared closure then retry did not change stage. It remained `Waiting on your judgment`; chat also showed `Themis.ai · Failed` / `No tool work completed`.
- **F-18:** stage changed from `Being researched` to `Waiting on your judgment` despite recorded decision and delivery, producing misleading board/header state.

## Run 10 — Promotional Referral Credits (completed through finalization; delivery/closure intentionally not marked)

Evidence: `MAT-20260903-ee48cf`; research packet, issue map, owned work items, recommendation, edited final response and followed decision saved. Final draft locked. Stage/header `Waiting on Marketing` / `Waiting on your judgment`.

- **F-19:** generated actions took 10–20 seconds; research/drafting 35–80 seconds, requiring navigation away/back to confirm background work.
- **B-14:** approval confirmation rendered literal text `[ Approve ] [ Edit ] [ Hold ]`; no accessible actionable controls were present. Chat and `Record decision` were the workaround.
- **B-15:** finalization/delivery instructions rendered `[ Finalize ] [ Edit ]` and `[ Mark Delivered ] [ Hold ]` as text only. Finalize worked through chat; no delivery was recorded due to no visible direct control.
- **B-16:** final state conflicted: header `Waiting on Marketing`, stage `Waiting on your judgment`, decision said `Risk level: medium`, and lawyer risk combobox showed `Set risk`.

## Repeat patterns to investigate (not causal claims)

1. Editor keyboard selection/typed-content reliability: B-01 in runs 01/04/07 and B-11 in run 09.
2. Close lifecycle control/state mismatch: B-08, B-09, B-13, while runs 01/02/03/04/05/08 did close. B-02 may be related but needs state classification.
3. Chat execution failures that preserve no tool work: B-06/B-07/B-10/B-13.
4. Stale or contradictory derived workspace state: B-05, F-12, F-18, B-16.
5. Intended action controls rendered unavailable or as static text: B-12/B-14/B-15.
6. Long serialized/waiting state: F-02/F-06/F-11/F-14/F-15/F-16/F-17/F-19.
7. Briefing returned zero developments in every requested lookup. This might be a correct empty vault, not necessarily a product defect.

