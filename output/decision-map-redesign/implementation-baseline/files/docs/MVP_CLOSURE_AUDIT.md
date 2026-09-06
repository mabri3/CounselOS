# MVP closure audit

Status: post-review repairs verified 2026-08-30  
Canonical executor: `docs/core-intake-provider-completion.handoff-prompt.md`  
Canonical progress: `docs/core-intake-provider-completion.handoff-progress.md`

## Purpose

This file is the single proof that no unfinished MVP work is hidden in a stale
plan, status report, progress file, acceptance section, or application
placeholder.

Do not infer completion from an old check mark. During Step 0, add one row for
every unfinished, failed, stale, or ambiguous item found in:

- `current.md`;
- `CODEX_HANDOFF.md`;
- `docs/PRD.md`;
- every `docs/*PLAN*.md` file;
- every `docs/*.handoff-plan.md` file;
- every `docs/*STATUS*.md` file;
- every `docs/*.handoff-progress.md` file;
- every unchecked item in `docs/ACCEPTANCE_TESTS.md`;
- real `TODO`, `FIXME`, placeholder, stub, or “not implemented” markers in
  application source.

## Allowed dispositions

Each row must end in exactly one of these states:

1. **Verified complete** — current automated or browser evidence proves the
   required behavior.
2. **Verified historical/superseded** — current evidence proves that the old
   item no longer describes active work. Name the replacing behavior or plan.
3. **Later** — the item matches an explicit Later category in `current.md`.

`Pending`, `failed`, `unverified`, `omitted`, and “moved to another
plan” are not completion states. Do not create a new Later category without
user approval.

## Source inventory

Populate this table in Step 0. Include every matching file, even when all of
its rows are later found complete.

| Source | Why it is in the audit | Inventory status |
|---|---|---|
| `current.md` | Active queue and exit conditions | audited; final queue update waits for independent review |
| `docs/BUILD_PLAN.md` | Active and historical build requirements | audited; dated correction added |
| `docs/ACCEPTANCE_TESTS.md` | Automated and browser acceptance | audited; canonical closure rows cite current test and browser evidence |
| `docs/IMPLEMENTATION_STATUS.md` | Historical implemented/not-implemented claims | audited; dated current correction added |
| `docs/*.handoff-progress.md` | Resumable implementation claims | audited; stale active claims have dated corrections or supersession notes |
| Other plan/status files found by Step 0 | Must not hide a second backlog | audited; active scope is canonical closure, completed checkpoints are historical, approved exclusions match Later |
| Application markers found by Step 0 | Must not leave active stubs or placeholders | audited; form placeholders and `.stub-note` are presentation helpers, not unimplemented behavior |
| `docs/core-intake-provider-completion.handoff-{plan,progress,prompt}.md` | Canonical closure requirements | audited |
| `docs/matter-led-mvp.handoff-{plan,progress}.md` | Prior intake and dossier claims | audited |
| `docs/live-agent-ux-repair.handoff-{plan,progress}.md` | Pending browser payoff | audited |
| `docs/continuous-legal-awareness.handoff-{plan,progress}.md` and `docs/CONTINUOUS_LEGAL_AWARENESS_BUILD_PLAN.md` | Awareness implementation and browser claims | audited |
| `docs/matter-work-state.handoff-{plan,progress}.md` | Stale pending work-state plan | audited |
| `docs/document-review-word-like.handoff-{plan,progress}.md` and `docs/DOCUMENT_REVIEW_BUILD_PLAN.md` | Document review implementation and historical failure | audited |
| `docs/matter-page.handoff-{plan,progress}.md` | Matter page implementation claims | audited |
| `docs/matter-workflow-reliability.handoff-{plan,progress}.md` and `docs/MATTER_WORKFLOW_RELIABILITY_BUILD_PLAN.md` | Workflow reliability claims | audited |
| `docs/friction-audit-ui.handoff-{plan,progress}.md` and `docs/FRICTION_AUDIT_IMPLEMENTATION_PLAN.md` | UI audit claims | audited |
| `docs/attention-audit-matter-records.handoff-{plan,progress}.md` and `docs/ATTENTION_AUDIT_IMPLEMENTATION_PLAN.md` | Matter-record attention claims | audited |
| `docs/today-attention.handoff-{plan,progress}.md` | Today attention claims | audited |

## Item matrix

Add one row for every item found. Use a stable audit ID. Cite the exact source
heading or line, the final disposition, and direct evidence.

| Audit ID | Source item | Required result | Final disposition | Evidence |
|---|---|---|---|---|
| CORE-01 | Adaptive intake and direct Chat opening | Contextual background Intake Agent run | Verified complete | Fresh isolated-vault BSA/AML browser walk; intake and chat-run tests |
| CORE-02 | Source-linked records, corrections, conflicts, supersession, undo | Preserve record and transcript history | Verified complete | Matter-record, chat-history, tool, and assembled lifecycle tests in the 482-test suite |
| CORE-03 | Safe useful dossier revision | Provisional and material updates preserve lawyer edits | Verified complete | Dossier content-hash and partial-output tests; fresh-vault dossier creation |
| CORE-04 | Per-agent provider/model/effort | Persist and route immutable run selection | Verified complete | Agent/settings/routing/restart tests; distinct Intake and Research selections in isolated vault |
| CORE-05 | Five provider catalog | Honest readiness for Mock, compatible, OpenCode Go, Codex, Antigravity | Verified complete | Shared conformance and adapter tests; browser showed all five honest readiness states |
| CORE-06 | Polaris matter research | Public-only outbound query and local private synthesis | Verified complete | Outbound-policy, intelligence-security, research lifecycle, and failure tests |
| HIST-01 | `BUILD_PLAN.md` says execution did not start | Preserve history and add correction | Verified historical/superseded | 2026-08-30 status correction in `docs/BUILD_PLAN.md` |
| HIST-02 | Matter-led intake acceptance claim is false | Preserve history and add correction | Verified historical/superseded | Dated resolution in matter-led progress plus isolated browser proof |
| HIST-03 | Work-state progress remains pending after later implementation | Verify replacing behavior and mark superseded | Verified historical/superseded | Dated resolution in work-state progress; full current suite passes |
| HIST-04 | Document-review progress preserves three failures | Resolve from fresh full suite | Verified historical/superseded | Dated resolution; 482 current backend tests pass |
| HIST-05 | Continuous-awareness build header conflicts with completed progress | Re-audit and correct | Verified historical/superseded | Current awareness implementation and privacy tests pass; its completed progress is the replacing record |
| HIST-06 | `IMPLEMENTATION_STATUS.md` contains old scaffold claims | Reconcile with current product | Verified historical/superseded | 2026-08-30 current correction added without erasing scaffold history |
| ACCEPT-A | Command center | Load state, intake, stage move, and research | Verified complete | Current isolated Today/new-matter run; matter, stage, and research API tests in the 495-test suite |
| ACCEPT-B | Matter workspace | Header, tree, editor, upload, and exact lifecycle | Verified complete | Current isolated matter/tree/dossier run; vault, review, export, ingestion, and matter-action tests |
| ACCEPT-C | Chat | Offline/real provider answers, typed mutations, traces, and decision boundary | Verified complete | Current real-provider intake run; chat, runner, tool, and durable-run tests; focused recovery check |
| ACCEPT-D | Research | Context, packet, labels, and useful no-search result | Verified complete | Research, intelligence security, outbound-policy, citation-failure, and dossier tests |
| ACCEPT-E | Decisions | Register, stale/review states, reason, and matter link | Verified complete | Decision, work-state, API, and prior isolated decision browser evidence in this acceptance file |
| ACCEPT-F | Automations | Schedule list/run and chat-created definitions | Verified complete | Scheduler, automation API, agent/tool, and inbox-watcher tests; prior isolated automation evidence |
| ACCEPT-G | Integrity | Rebuild, path boundary, handler allow-list, and atomic writes | Verified complete | Index rebuild, vault security, tool registry, symlink, and write-failure tests |
| ACCEPT-HN | Matter-led through attention-audit sections | Preserve and recheck completed feature walks | Verified complete | Dated browser evidence under sections H–N plus current focused checks and 495-test suite |
| ACCEPT-O | Continuous Legal Awareness | Complete Watch-to-Briefing-to-lawyer-outcome loop | Verified complete | `continuous-legal-awareness.handoff-progress.md` Step 8 and acceptance; current awareness/privacy/partial-result tests |
| ACCEPT-P | Workflow reliability | Exact file, lifecycle, research, company, and progress behavior | Verified complete | Dated isolated evidence under section P plus current workflow and persistence tests |
| ACCEPT-Q | Middle pane, labels, and vault selection | Complete UI state and safe vault lifecycle | Verified complete | Current isolated pane/tree/dossier/provider run; chat recovery, active-context, and vault-management tests, including provider closure |
| ACCEPT-R | Provider, intake, dossier, Polaris, and exhaustive closure | Complete the canonical payoff and proof gate | Verified complete | Current isolated provider/intake/dossier run; 495 tests; five focused frontend checks; typecheck/build; graph update |
| MARKER-01 | `frontend/lib/stubs.ts` imports and `.stub-note` CSS | Determine whether labels are real UI helpers or dead placeholder behavior | Verified historical/superseded | Source inspection shows data conversion/constants and muted help-text styling; frontend checks and build pass |
| LATER-01 | Explicit `current.md` Later list | Keep only exact approved Later categories | Later | `current.md` → Work Queue → Later |

## Closure gate

- [x] Every source in the inventory was read and marked audited.
- [x] Every discovered item has one matrix row.
- [x] Every non-Later row is verified complete or verified historical/superseded.
- [x] Every Later row matches an existing category in `current.md`.
- [x] Every active non-Later acceptance or progress checkbox is checked; obsolete checkboxes have dated evidence-backed historical/superseded dispositions.
- [x] No row is pending, failed, unverified, omitted, or deferred to a new plan.
- [x] All automated checks pass after the final code change.
- [x] The final isolated browser walk passes after the final code change.
- [x] The independent Sol Medium review has no unresolved material finding; two P1 findings were corrected and re-reviewed, and no Sol High escalation was required.
- [x] Stale source documents contain dated correction or supersession notes.
- [x] `current.md` has no remaining Now or Next work and only Later remains.

## Independent review result — 2026-08-30

The original read-only reviewer found two P1 issues: Tavily could receive raw matter
text before the Polaris privacy check, and an unavailable selected provider
lost its safe readiness detail. The coordinator moved the shared privacy check
before every external call, made Polaris primary with Tavily only as fallback,
and preserved only fixed `ProviderAdapterError` text in failed chat runs. The
62 affected tests passed. The reviewer confirmed both findings were resolved,
found no new material issue, and did not request Sol High escalation.

## Post-review remediation — 2026-08-30

The later Opus review found seven code defects, four compliance gaps, and four
minor lifecycle issues. All were reproduced or confirmed. The repair pass:

- protects lawyer-edited dossiers and preserves the queue-time hash;
- uses one dossier schema and writes labeled research support;
- translates OpenCode Go tool history to Messages protocol blocks;
- rejects explicit provider overrides without their own model;
- documents the canonical provider IDs and OpenCode credential names;
- snapshots one provider selection on each research run;
- closes cached and workspace providers on settings or vault changes;
- scopes automatic research deduplication to one intake conversation;
- prevents a closed Codex provider from restarting;
- runs every focused frontend check from one command;
- adds cancellation, timeout, oversized-output, selection, vault-close, and
  data-loss regression tests;
- replaces aggregate acceptance claims with section-specific evidence.

The browser run also found and fixed one adjacent issue: intake stop no longer
depends on a model-generated question ID starting with `intake-`.
