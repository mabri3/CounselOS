# Progress — Core intake, Polaris research, and per-agent model routing

Read this file before starting or resuming. Do not redo a completed step unless its verification now fails. Update one line immediately after each step. On failure, write `— FAILED: <evidence>` and follow the blocker policy in the handoff prompt.

- [x] Step 0: Preflight, plan audit, and truthful baseline — done (2026-08-30: dirty tree preserved; graph query completed; 454 backend tests, frontend typecheck/build, and workspace UX checks passed)
- [x] Step 1: Freeze provider, catalog, and per-agent selection contracts — done (provider catalog, immutable selection, agent override, run snapshot, and typed intake-turn contracts added; focused tests: 43 passed)
- [x] Step 2: Implement OpenCode Go, Codex CLI, and Antigravity CLI adapters — done (19 focused adapter tests passed)
- [x] Step 3: Route every agent run through its persisted selection — done (immutable run snapshot and routed timeout fallback; combined Wave 1 backend checks: 74 passed)
- [x] Step 4: Add per-agent controls and honest provider readiness UI — done (provider-admin check and TypeScript typecheck passed)
- [x] Step 5: Replace fixed intake with a contextual background Intake Agent run — done (2026-08-30: adaptive intake lifecycle tests passed; isolated browser walk showed a request-specific BSA/AML summary and one material question with no fixed counter)
- [x] Step 6: Connect source-linked records and safe dossier revisions — done (2026-08-30: source, correction, conflict, supersession, grouped undo, partial dossier, and content-hash guard tests passed)
- [x] Step 7: Use Polaris for privacy-safe on-demand matter research — done (2026-08-30: public-query privacy, supplied-source labeling, local synthesis, persistence, and graceful-failure tests passed)
- [x] Step 8: Pass hostile-output and assembled-lifecycle tests — done (2026-08-30: `./scripts/verify.sh` passed 482 backend tests, frontend typecheck, and production build)
- [x] Step 9: Pass isolated browser acceptance and reconcile stale plans — done (2026-08-30: fresh blank vault created; five-provider readiness, distinct agent selections, direct Chat opening, contextual first turn, and adaptive Skip observed)
- [x] Step 10: Close every non-Later audit item and empty Now/Next — done (2026-08-30: closure audit reconciled; only the approved Later list remains)
- [x] Step 11: Pass independent Sol Medium review and any required Sol High escalation — done (2026-08-30: reviewer found two P1 issues; both were corrected, 62 focused tests passed, and reviewer confirmed resolution with no escalation)
- [x] Post-implementation review: Correct all confirmed Opus findings — done (2026-08-31: dossier edit safety, canonical sections, provider tool loops and routing, resource cleanup, research snapshots, intake reruns, durable chat actions, hostile tests, and focused frontend checks corrected)
- [x] Acceptance check: Complete the BSA/AML intake-to-Polaris-to-dossier demo with no non-Later work remaining — done (isolated browser proof plus 495-test final suite, five focused frontend checks, typecheck, and production build)

## Worker ownership

- W1-A — provider adapters/catalogs; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: provider conformance and adapter tests; review: coordinator then combined independent review.
- W1-B — agent persistence/run routing; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: agent/settings/routing tests; review: coordinator then combined independent review.
- W1-C — provider and Agent administration UI; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: provider-admin script and typecheck; review: coordinator then combined independent review.
- W2-A — adaptive intake, records, and dossier; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: intake/records/dossier lifecycle tests; review: coordinator then combined independent review.
- W2-B — Polaris matter research; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: intelligence/research/security tests; review: coordinator then combined independent review.
- W2-C — new-matter and intake UI; owner `sol-medium-implementers`; exact paths from the canonical prompt; check: adaptive-intake/workspace scripts and typecheck; review: coordinator then combined independent review.
