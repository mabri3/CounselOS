# Decision map redesign tracking

Date: 2026-09-05. Status: planning package complete and reviewed. Application implementation has not started.

## Scope

Deliver a reference-grounded visual blueprint, a concrete build plan, a one-shot prompt, and this tracking file. The user also mentioned implementation in the same request. The coordinator asked for scope and, with no answer received, stated the plan-first interpretation based on the user's final request for a one-shot prompt. This package is a handoff; no application implementation is claimed.

## Planning evidence

| ID | Work | Owner | State | Evidence |
| --- | --- | --- | --- | --- |
| P0 | Read project constraints and current map | Coordinator | Done | PRD, handoff, design language, graphify query, source inspection |
| P1 | Locate reference images | Coordinator | Done | Task “Implement Matter A UI rebuild”; `output/matter-ui-design-survey/designs/06-map.png`, `02-issue.png` |
| P2 | Inspect live map without record changes | Coordinator | Done | 34-record map. Selecting owner-information issue shows only business question and issue; details have title, state, and actions |
| P3 | Research interaction references | Luna High | Done | GOV.UK branching/form guidance, OMG DMN, focus/context references |
| P4 | Audit records and generation path | Sol High | Done | `map_contract_audit`; normal option writer absent, scenario-only generation, unlinked decisions, moving focus found |
| P5 | Audit visual fidelity | Terra High | Done | `map_visual_audit`; fixed clipped cards/straight lines/flat outline findings incorporated |
| P6 | Create blueprint, proposed contract, plan and prompt | Coordinator | Done | Deliverables below; final frozen code contract belongs to implementation C0 |
| P7 | Inspect blueprint interactions and review plan | Coordinator + fresh Sol Medium | Done | Preview actions verified; six plan findings addressed; reviewer recheck found no remaining substantive defect; no implementation checks claimed |

## Deliverables

- `docs/decision-map-redesign.blueprint.md`: product interaction, source/design findings, exact visual direction, proposed data/persistence contract, evidence and limits.
- `docs/decision-map-redesign.build-plan.md`: thesis, demo, C0–C6 file ownership, waves, routing, checks and deferred work.
- `docs/decision-map-redesign.one-shot.md`: complete copyable implementation prompt.
- `output/decision-map-redesign/decision-map-blueprint.html`: repository copy of the interactive preview fragment.
- Inline source: `/Users/bharris/.codex/visualizations/2026/09/06/01a07422-fe4b-7f13-80a1-7f6b74558425/decision-map-blueprint.html`.
- `output/decision-map-redesign/planning-verification.md`: planning/prototype evidence and limits.

## Routing

Actual planning agents: `gpt-5.6-luna` high, `gpt-5.6-sol` high, `gpt-5.6-terra` high. Maximum three workers plus coordinator. No nested agents.

The request includes “Xai”. That is not a callable model name in this session. A question asked whether this means Terra xhigh, Astra or xAI/Grok. No answer has been received. Do not silently substitute another model. Resolve it before the affected C3 dispatch, then write exactly one implementer assignment and adjust waves if needed. Sol Medium maps to `gpt-5.6-sol` medium.

## Build status

| Chunk | Outcome | Depends on | Planned owner | State | Evidence |
| --- | --- | --- | --- | --- | --- |
| C0 | Baseline and frozen executable contract | — | Coordinator | Not started | Planning hashes are not implementation preflight |
| C1 | Normal analysis/research creates saved branches | C0 | Sol High | Not started | — |
| C2 | Map projection and exact decision basis | C0, C1 | Sol High | Not started | — |
| C3 | Focused graph, layout and outline | C0, model resolution | Terra High provisional | Not started; routing unresolved | Never dispatch dual owners |
| C4 | Issue entry and decision form | C0 | Sol Medium | Not started | — |
| C5 | Route and application integration | C1–C4 | Coordinator | Not started | — |
| C6 | Independent review, corrections, final evidence | C5 | Fresh Sol Medium + coordinator | Not started | — |

For each future chunk, record actual model/effort, start/end, changed paths, checks actually run, reviewer findings and disposition, evidence links, remaining risk and next action. Keep the plan's V1–V10 gates separate from chunk completion. A completed component is not a passed browser demo.

## Planning review corrections

The fresh Sol Medium reviewer identified six material plan gaps. The coordinator added: issue-local input hashes with self-write exclusions; exact current-pointer precedence over legacy fallback; defined option digests and canonical map basis/request fingerprint; enqueue-time target/input capture; split mixed all/any logic; and an explicit C3 dispatch hold until model resolution. The final correction check found all six resolved and no remaining substantive defect.

## Preservation

This is a dirty shared tree. `output/decision-map-redesign/planning-baseline.json` records the starting HEAD, status, and application hashes. Existing changes belong to earlier work. No commit, push, deployment, active-vault change, or legal record mutation is part of planning.

Final check: 243 application source hashes unchanged. Git status adds only the four planning documents and `output/decision-map-redesign/`. The inline preview and repository copy match. Preview JavaScript syntax check passed. The owned preview server on 8766 exited 0; both temporary inspection tabs were closed; the viewport override was reset. Existing app services were not stopped. See `output/decision-map-redesign/planning-final-check.json`.
