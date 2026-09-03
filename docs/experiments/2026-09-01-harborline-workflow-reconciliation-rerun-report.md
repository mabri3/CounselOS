# Harborline workflow reconciliation rerun — September 1, 2026

## Executive result

The build materially improved the path through approval. It did not produce a reliable full matter lifecycle.

All 10 matters were created once. All 10 target dates persisted. All 10 completed intake and have a canonical draft. Nine have a canonical final and durable approval. Only one has a durable local-delivery record and Closed state.

The main blocker is `Record manual delivery`. Matter 01 completed it and closed. Matters 03 through 10 all reached approval, but the same control hung or timed out. No delivery record was written in those eight matters.

The most serious record-integrity failure is false decision confirmation. Chat said that a durable decision was recorded in Matters 04, 06, 07, and 08. The authoritative Markdown contains zero decision records. Saved chat results show `no_change` and no changed paths.

The first repair priority is the manual-delivery control. The second is to make assistant success text obey typed operation results.

## Durable totals at the evidence cutoff

| Measure | Result |
|---|---:|
| Matters created | 10/10 |
| Target dates preserved | 10/10 |
| Intake complete | 10/10 |
| Matters with research packets | 8/10 |
| Research packet files | 23 |
| Packets with external authority | 0 |
| Matters with drafts | 10/10 |
| Draft files | 13 |
| Matters with finals | 9/10 |
| Final files | 9 |
| Recommendation files with substantive lawyer text | 7/10 |
| Typed recommendation histories from live direct edits | 0 |
| Durable decisions | 0 |
| Approvals | 9/10 |
| Local manual delivery records | 1/10 |
| Closed matters | 1/10 |
| Work-item files | 16 |
| Open required items after approval | 5 across Matters 07 and 10 |

Two more research packets arrived 11–12 seconds after the normalized cutoff. They are excluded from the official totals. Their late arrival is evidence that background research and the visible state were not aligned.

## Setup and method

- Repository: `/Users/bharris/Programs/counsel-os-mvp`
- Verification vault: `/private/tmp/themis-workflow-verification-20260901-d`
- Experiment vault: `/private/tmp/counsel-os-harborline-workflow-reconciliation-20260901-i`
- Raw evidence: `tmp/harborline-workflow-reconciliation-20260901-135832/`
- Model: NeuralWatt Kimi K3 Fast.
- Research provider: Polaris.
- Requester: one fresh Luna Medium actor.
- Setup attorney: one fresh Luna Medium actor.
- Matter attorneys: ten fresh Luna Medium actors, one matter each.
- Live matter dispatch: serial.
- Synthesis: one fresh Sol High reviewer after all ten raw reports were complete.
- Browser: in-app browser only.
- Coordinator browser help: none.
- External action: none. No person or external service was contacted.

Markdown and lifecycle event files are authoritative. A chat or transient UI claim counted as success only when the durable record agreed.

The raw reports contain approximate overlapping start times for early runs, so those timestamps alone do not prove serial timing. Coordinator dispatch was serial. Matter 08 exceeded the 35-minute cap by about seven minutes because delivery retries hung. Delegated actors also could not enable the separate in-app visibility toggle.

## Strict comparison with the prior rerun

| Measure | Prior rerun | Current rerun | Change |
|---|---:|---:|---:|
| Matters created | 10/10 | 10/10 | No change |
| Target dates preserved | Not reported | 10/10 | New proven measure |
| Intake complete | 9/10 | 10/10 | +1 |
| Matters with research packets | 6/10 | 8/10 | +2 |
| Research packet files | 14 | 23 | +9 |
| Matters with drafts | 10/10 | 10/10 | No change |
| Matters with finals | 10/10 | 9/10 | -1 |
| Durable decisions | 4 | 0 | -4; four chat claims did not persist |
| Approvals | 2 | 9 | +7 |
| Local delivery records | 2 | 1 | -1 |
| Closed matters | 2/10 | 1/10 | -1 |
| External authority retrieved | 0 | 0 | No change |

Lifecycle reconciliation now works through finalization and approval. It fails at the delivery boundary. Recommendation and decision integrity also failed in normal live use.

## Per-run result

| Run | Matter | Durable result | Research | Draft/final | Recommendation | Decision | Approval/delivery/Closed |
|---|---|---|---:|---|---|---:|---|
| 01 | `MAT-20260901-63cf49` | Closed | 2 partial | 1/1 | Default only | 0 | Yes/Yes/Yes |
| 02 | `MAT-20260901-518a68` | Explore | 4 partial | 1/0 | Default only | 0 | No/No/No |
| 03 | `MAT-20260901-062229` | Ready to send | 4 partial | 1/1 | Text only; no typed history | 0 | Yes/No/No |
| 04 | `MAT-20260901-9e49b2` | Ready to send | 3 partial | 2/1 | No canonical text | 0; chat claim false | Yes/No/No |
| 05 | `MAT-20260901-5fb756` | Ready to send | 1 partial | 1/1 | Text only; no typed history | 0 | Yes/No/No |
| 06 | `MAT-20260901-5cb4d4` | Ready to send | 0 | 2/1 | Partial and malformed | 0; chat claim false | Yes/No/No |
| 07 | `MAT-20260901-507880` | Ready to send | 5 partial | 1/1 | Text only; no typed history | 0; chat claim false | Yes/No/No |
| 08 | `MAT-20260901-2f587f` | Ready to send | 0 | 2/1 | Text only; no typed history | 0; chat claim false | Yes/No/No |
| 09 | `MAT-20260901-d180c6` | Ready to send | 3 partial | 1/1 | Text only; no typed history | 0 | Yes/No/No |
| 10 | `MAT-20260901-758833` | Ready to send | 1 partial | 1/1 | Text only; no typed history | 0 | Yes/No/No |

## What worked

- Matter creation and target-date truth passed 10/10.
- Intake completed 10/10.
- Every matter has a durable draft.
- Finalization reconciled nine matters to Respond.
- Approval persisted in nine matters.
- Core target, participant, draft, final, approval, and stage state usually survived reload.
- Partial research stayed useful and clearly said that external authority was not retrieved.
- Direct sending stayed disabled.
- Matter 01 proved that the backend delivery and close path can complete.

## Friction

- Research progress and terminal state were difficult to understand. Packets often appeared only after waiting or reload.
- The matter overview tracks one returned research run, not the full serial queue.
- No actor completed a visible typed proposal acceptance.
- Approval can coexist with required open work. Matters 07 and 10 had five required items open after approval.
- Intake radio controls sometimes produced stale or misleading automation errors even though answers persisted.

## Broken behavior and causes

### Manual delivery hangs — Likely mixed product and browser-control cause

`MatterWorkspace.tsx` calls blocking native `window.confirm` before it posts the typed delivery action. The delegated in-app browser then waits or resets. Eight repeated attempts wrote no delivery event. The backend path works in Matter 01 and in focused tests.

Product cause confirmed: a native browser dialog is used before the request. Browser symptom confirmed: the click times out. The exact link is Likely because no network trace proved that every failed click stopped at the dialog.

### False durable-decision success — Confirmed

Four assistant messages said a decision was recorded. The saved result was `chat_turn / no_change`, with no changed paths. The runner adds a truthful no-change result but does not suppress contradictory assistant prose.

### Recommendation edits bypass typed history — Confirmed

The normal artifact link opens `recommendations.md` in the generic document editor. That save path does not call `RecommendationService`. Seven files contain useful text, but no live direct edit created version, actor, origin, proposal, or disposition history. Overview state then disagreed with the file.

### Proposal acceptance did not appear — Confirmed condition; cause Unknown

The accept control appears only for a typed proposal. Actors received plain chat text, work-product files, or `No change`, so the condition was absent. Why the model did not call the typed proposal operation is not proven.

### Research state is incomplete — Confirmed overview cause; provider cause Unknown

The backend stores one queue item per question, but the overview polls only one returned run. This explains stale partial visibility. Matters 06 and 08 had no typed research action. The reason for those missing tool calls is Unknown.

Polaris retrieved no authority. Packet records show mainly timeouts, with some HTTP failures. The upstream cause is Unknown.

### Approval with required work — Confirmed design behavior

Approval validates the final and optional approval item. It does not check all required work. Close does check all required work. This need not block approval, but the approved output needs a clear conditional state.

## Recurrence by issue

| Issue | Live result | Evidence |
|---|---|---|
| COS-001 | No recurrence found | Blank vault had typed tools. |
| COS-002 | Recurred at delivery | Nine approvals; only one delivery and close. |
| COS-003 | Recurred | Four false decision claims; zero durable decisions. |
| COS-004 | Partial recurrence | Draft/final preservation improved; unsupported mutation claims remained. |
| COS-005 | No recurrence found | No transport encoding failure was found. |
| COS-006 | No material recurrence | Intake completed 10/10. |
| COS-007 | No recurrence found | No duplicate matter or decision. |
| COS-008 | Partial recurrence | Participants and work items improved; five required items remained after approval. |
| COS-009 | Recurred | False “recorded” text and overview disagreement. |
| COS-010 | No recurrence found | No invented percent, ETA, phase, or cancellation. |
| COS-011 | No material recurrence found | No main-output trace/path or malformed author suffix was reported. |
| COS-012 | Recurred | Recommendation, decision, research, and work-queue state disagreed. |
| ENV-001 | Observability passed; provider degraded | Useful partial work persisted; no authority retrieved. |
| ENV-002 | No recurrence | Local app stayed available; fresh tabs recovered state. |

## Product, browser, and environment failures

Product failures:

1. Manual delivery did not complete in eight approval-ready runs.
2. Chat falsely confirmed four decisions.
3. Generic recommendation editing bypassed typed state.
4. Research-like chat did not always start durable research.
5. Approval did not strongly show required open work.

Browser-control failures:

1. Delivery clicks exceeded the execution deadline.
2. Kernels reset after some long interactions.
3. Some intake controls became stale after a successful answer.

Environment failures:

1. Delegated in-app visibility toggle was unavailable.
2. Polaris returned no verified authority.
3. The local frontend and backend stayed available.

## Repair backlog

| Priority | Smallest useful correction | Proof |
|---|---|---|
| P1 | Replace native delivery confirmation with an in-product modal that posts only after an explicit confirm click. | Repeated approved matters can record local delivery, reload, and close without browser timeout. |
| P1 | Make mutation success text derive from typed results. | `no_change`, `proposed`, `confirmation_required`, or `failed` cannot display “recorded,” “saved,” “approved,” “delivered,” or “closed.” |
| P1 | Route all recommendation edits and proposals through one typed recommendation path. | Lawyer edits create versions; agent changes stay Proposed until accepted; decisions link the selected version and disposition. |
| P2 | Show and poll the full research queue in the matter overview. | Overview and Research page show the same terminal item states without reload. |
| P2 | Mark approval as conditional while required work remains. | Approved artifact shows the required-item count and titles until completion. |

## Method compliance

- Exactly 10 requester requests and 10 matter reports exist.
- Each matter used a fresh Luna Medium attorney.
- Live dispatch was serial and no later actor received earlier findings.
- Raw actor reports were not edited.
- One fresh Sol High reviewer performed synthesis after Matter 10.
- No source fix was made during the experiment or synthesis.
- Matter 08 exceeded the time cap and is disclosed.
- No external message was sent.
- Repository `vault/` hash after the experiment: `75cd3752ae40c352b351f0846e9c96e0110846249aa17e650f1f93f269189e5e`.
- No commit, push, deployment, reset, clean, stash, or worktree operation occurred.

## Engineering verification record

- Combined Sol Medium review: PASS for all 12 groups. No Sol High escalation.
- Backend: 629 passed, one existing warning.
- All eight focused frontend scripts: passed.
- Older lifecycle script: passed.
- Typecheck: passed.
- Production build: passed; all 13 pages generated.
- Visible verification vault: completed intake, research, queue reorder, versioned recommendation proposal and acceptance, lawyer edit, durable decision with disposition and reason, work changes, finalization, approval, manual delivery, completion, close, reload, safe repair, and SQLite rebuild.
- Graphify before the recurrence: 8,707 nodes, 15,534 edges, 1,155 communities.

## Evidence

- Normalized evidence: `tmp/harborline-workflow-reconciliation-20260901-135832/normalized-evidence.md`
- Sol High synthesis: `tmp/harborline-workflow-reconciliation-20260901-135832/synthesis-draft.md`
- Requester and setup reports: `tmp/harborline-workflow-reconciliation-20260901-135832/actors/`
- Matter reports: `matter-01-report.md` through `matter-10-report.md` in the same folder.
