# Current Project State

Last updated: 2026-08-29

## Active Goal

Complete integration and isolated browser acceptance for Continuous Legal
Awareness and Decision Maintenance. The implementation and focused feature
tests are present. Final combined verification is still pending.

## Why This Goal Now

Attorney interviews and code review support one next product loop: company context plus issue-spotting intake plus a concise, sourced dossier. The user approved this direction and asked for a build plan that avoids answer gates and broad orchestration.

## Work Queue

### Now

- [ ] Run the assembled awareness tests and full backend/frontend verification.
- [ ] Complete the awareness browser walk against a temporary vault copy.

### Next

- [ ] Add one-question-at-a-time issue-spotting intake using the existing matter chat and intake agent.
- [ ] Mark the intake conversation explicitly and link derived facts to its stable message IDs.
- [ ] Preserve fact corrections by superseding prior facts without changing the intake transcript.
- [ ] Generate `dossier.md` and show its executive summary and counsel action on the matter page.
- [ ] Add Company setup in Settings, backed by `vault/00_System/company.md`.
- [ ] Verify graceful best-effort dossier delivery when facts, citations, or research tools are incomplete.

### Later

- External Slack, Jira, Asana, and email intake connectors after manual paste becomes a measured bottleneck.
- Commercial legal-research integration after pilot source-verification needs are measured.
- Native provider adapters after the OpenAI-compatible path is reliable.
- Better retrieval and external legal research integrations after the local research flow is useful.
- Selection-based rewrite and diff after the focused Markdown editor is validated.
- Cloud tenancy, Tauri packaging, team collaboration, and permissions after the local workflow proves value.
- Token streaming and general Wave 5 polish after the dossier loop works end to end.

### Blocked

- None.

## Active Assumptions

| Assumption | Basis | Confidence | Invalidating evidence |
|---|---|---:|---|
| The local web app is the current product boundary. | `docs/PRD.md`, `docs/ARCHITECTURE.md` | high | A user-approved scope change. |
| Mock mode is the baseline because it needs no model key. | `.env.example`, `README.md` | high | Startup requires a configured external provider. |
| Markdown is authoritative and SQLite is disposable. | `AGENTS.md`, `docs/ARCHITECTURE.md` | high | Code or an approved design decision makes another store authoritative. |

## Verified Evidence

- Continuous Legal Awareness has Markdown-backed Watches, native and Polaris
  adapters, local outbound privacy checks, durable scans and developments,
  Briefing items, saved views, digests, review packets, and mitigations.
- The awareness API exposes providers, sources, Watches, scans, Briefing,
  digests, review packets, and matter mitigations.
- Watch scans keep per-provider checkpoints and useful partial results.
- Company-specific matching uses current local knowledge after public
  collection. Private context is not passed to Polaris or native discovery.

- FastAPI backend, Next.js frontend, Markdown vault, and SQLite index are the documented architecture — `docs/ARCHITECTURE.md`.
- Six sample matters, four agents, twelve tools, and two schedules exist in `vault/`.
- Core API routes are documented for health, configuration, matters, files, chat, decisions, and automations — `docs/API.md`.
- Thirteen backend tests pass — `./scripts/verify.sh`.
- Frontend typecheck and the Next.js production build pass — `./scripts/verify.sh`.
- Health, config, matters, decisions, and automations return HTTP 200 with the six-matter sample vault.
- Browser Acceptance Scenarios A through G pass in mock mode.
- A live OpenAI-compatible provider request returned a valid function tool call through the existing provider interface — `docs/IMPLEMENTATION_STATUS.md`.
- The third pane rendered Markdown headings, emphasis, links, quotes, and lists; formatted edits generated Markdown; save persisted after reload.
- Immutable `request.md` rendered as formatted read-only content with no toolbar or Save button.
- `./scripts/verify.sh` reports 13 passing backend tests, a passing frontend typecheck, and a successful production build.

## Recent Changes

- Made the Today attention washes the shared app palette, documented the semantic color rules, and treated legacy decision status `current` as not needing review.
- Added the Issue-Spotting Intake to Decision-Ready Dossier checkpoint to `docs/BUILD_PLAN.md`.
- Added repository and runtime agent rules for best-effort answers, source honesty, graceful degradation, and focused clarification.
- Completed Wave 0 and the mock-mode MVP acceptance walk.
- Made setup select Python 3.11 or newer and made direct `pytest` collection reliable.
- Opened command-center research results directly in the matter editor.
- Added an editable companion for empty or image-only PDF and DOCX extractions.
- Prevented new schedules from running immediately and prevented mock scheduled tasks from creating schedule copies.
- Replaced the plain Markdown preview with a Lexical-backed WYSIWYG editor and a Formatted/Markdown toggle in the third pane.
- Made immutable Markdown read-only at the vault document boundary and added a regression test.

## Open Questions

- Confirm the planned execution order before implementation begins.

## Exit Conditions

- [ ] Company context is editable in Settings and remains sourced from `vault/00_System/company.md`.
- [ ] Intake issue-spots and asks one material question at a time without becoming a completeness gate.
- [ ] The exact intake exchange remains available as a read-only matter conversation.
- [ ] Derived facts show their source and corrections preserve the superseded fact.
- [ ] A lawyer can stop intake early and still receive a useful, labeled `dossier.md`.
- [ ] The matter page shows a concise dossier summary and the next decision or action for counsel.
- [ ] Research or citation failure does not suppress usable work product or fabricate support.
- [ ] Backend tests, frontend typecheck, frontend build, and the focused browser demo pass.

## Next Resume Action

After user approval, implement the active checkpoint in the order defined in `docs/BUILD_PLAN.md`, starting with the frozen-request issue-spotting probe.
