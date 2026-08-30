# Counsel OS friction-audit implementation plan

## 1. Thesis

This work must make Counsel OS tell one clear story: what needs the lawyer, why it needs the lawyer, and the next real action. The plan fixes misleading behavior and high-friction presentation. It keeps the working file tree, chat, editor, agent permissions, decision record, and automation runner. It does not build authentication, external integrations, citation gates, or a larger automation system.

The implementation uses one Sol Medium coordinator and up to three Sol Light implementers at one time. All agents use the same working tree. Each implementer has exact file ownership. The coordinator reviews every chunk and owns final integration.

## 2. Payoff moment

A lawyer opens an Explore matter, sees the question, proposed path, evidence, and decision action without hunting, then records an edited decision through one explicit action and sees the correct matter and review reason in the register.

## 3. Demo script

1. Open Today, Workspace, and Matters with the same vault.
2. Confirm that each count has a precise scope. Today shows all attention items. Workspace states how many matters await judgment. Matters shows separate overdue, waiting, and agent-working counts.
3. Confirm that Today does not say work is waiting on someone else when the page lists work for the lawyer.
4. Confirm that the Coming up section does not claim there is nothing to do.
5. Open Project Apex at 1280 by 720.
6. Confirm that the question, proposed path, and primary action are visible without a 60-pixel overview window.
7. Select Review and decide. Confirm that a focused review state opens. It must not only put text in chat.
8. Open Record this decision. Confirm that the proposed path is prefilled, unresolved assumptions stay outside the decision text, and no decision is written before submit.
9. Edit and record the decision. Confirm that the register shows the real matter title and the complete review reason.
10. Open a saved long chat answer. Confirm that the answer appears before a closed Actions taken disclosure and that Focus answer widens the reading area without changing records.
11. Open a research note answer. Confirm that headings, emphasis, code, lists, and links render as Markdown.
12. Open Settings. Confirm that only controls with real behavior are shown. There must be no fake people, access, integrations, citation gate, spend gate, retention, or reconnect state.
13. Open Agents. Confirm that the default view uses plain language, technical permissions are under Advanced controls, and only Save and Discard remain.
14. Open Skills, Automations, and Matters. Confirm the simplified entry actions, honest run labels, consistent dates, and conditional Owner column.
15. Confirm that the browser-test matter is absent from all normal views.
16. Complete the relevant browser acceptance tests with no console errors.

## 4. Build

### Agent policy

```yaml
parallel:
  optimize_for: speed
  max_agents: 3
  implementers:
    role: implementer
    provider: codex
    model: gpt-5.6-sol
    effort: low
    max_concurrent: 3
  coordinator:
    role: coordinator_and_reviewer
    provider: codex
    model: gpt-5.6-sol
    effort: medium
  review:
    policy: coordinator-only
```

“Sol Light” means `gpt-5.6-sol` with `low` effort. The Sol Medium coordinator uses the same model with `medium` effort. Workers must not spawn agents. No agent may commit, push, deploy, reformat unrelated code, or undo existing user changes.

Workers must not run frontend typecheck, build, or browser checks in parallel. Those commands share TypeScript and Next.js generated state. The coordinator runs them after all workers in a wave have stopped. The only permitted repository deletion is the narrow, recoverable test-data cleanup in Chunk F: first verify its ID and title, then confirm that `git ls-files` contains the exact directory so Git can restore it. No other destructive repository cleanup is permitted. The coordinator may remove only the temporary directories that this plan creates, after validating their paths.

### Shared product decisions

- Use **Themis** as the user-facing assistant name. Keep `agent_id: counsel-copilot` and describe its role as “Counsel Copilot” in the Agents screen.
- Do not force one number across Today, Workspace, and Matters. Use one shared matter-attention rule and precise scoped labels.
- A recommendation may prefill a proposed decision. Unresolved facts and assumptions must remain separate. Recording still requires the user to press the record button.
- Keep the matter tree, chat, and editor. Use progressive disclosure and a reading-focus control.
- Keep Skills as the product term for now. Do not rename it to Playbooks because playbooks already have a different meaning.
- Keep Stages and Timeline. Make the table the default Matters view and fix its ordering. Do not remove a view without use evidence.
- Keep valid risk metadata. Show missing or `unknown` risk as “Not assessed.” Never use failure red for high risk.
- Hide settings that only persist a value but do not control the claimed behavior. Preserve their saved Markdown keys for reversibility.

### Wave 1 — three independent Sol Light chunks

#### Chunk A: attention language, matter lists, and dates

Outcome: Today, Workspace, and Matters use the same matter-attention rules and honest scoped wording. Matters opens as a useful table with clear filters and consistent dates.

Own only:

- `frontend/lib/design.ts`
- `frontend/lib/briefing.ts`
- `frontend/app/page.tsx`
- `frontend/app/workspace/page.tsx`
- `frontend/app/matters/page.tsx`
- `frontend/components/StageBoard.tsx`
- `frontend/components/MattersTable.tsx`
- `frontend/components/MattersTimeline.tsx`
- `frontend/lib/research.ts`

Required changes:

1. Add shared pure helpers for matter attention and visible date/date-time formatting. Export `formatShortDate`, `formatLongDate`, `formatDateTime`, and `formatTime`; keep the existing helpers as compatible aliases where callers still need them. Use `en-US` presentation consistently. Keep raw ISO values in Markdown and explicit traces.
2. Keep Today’s total broad: overdue matters, matters awaiting judgment, stale decisions, and failed schedules. State the breakdown in the subhead.
3. Change Workspace copy to “N matters await your judgment.” Do not link text that implies it equals Today’s broader total.
4. Keep Matters counts separate by state. Label the second filter group `Scope`, show active filters, and add Clear filters.
5. Replace “Coming up — nothing to do yet” with “Coming up.”
6. Replace generic next-action fallback copy with the existing stage-specific `matterAction()` detail when possible. Do not invent a new workflow system.
7. Make Table the default Matters view. Sort open overdue and soonest-due matters first, then open no-date matters, then closed matters. Keep Stages and Timeline.
8. Use sentence case for table headings. Hide Owner only when all visible rows have one owner. Show blank or `unknown` risk as “Not assessed.”
9. Remove the duplicate column-level “Themis is working” label. Keep the per-matter signal and count/filter.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run TypeScript or Next.js checks while other frontend workers are active because they share generated state.

#### Chunk B: settings and agent truth

Outcome: Settings shows only real controls. Agents uses plain language, one rule set, advanced technical permissions, and two clear edit actions.

Own only:

- `frontend/lib/stubs.ts`
- `frontend/app/settings/page.tsx`
- `frontend/app/agents/page.tsx`
- `frontend/lib/api.ts` only if the visible-settings mapping requires it

Required changes:

1. Reduce `DEFAULT_SETTINGS` to real model controls. Hide General, Matters, Data & retention, People & access, and Integrations. Hide citation-every-claim, maximum-tool-calls, spend, retention, backup, privilege, and external-connection claims.
2. Do not delete old keys from `vault/00_System/settings.md`. The backend merge behavior preserves them.
3. Keep Company as the existing separate, functional section. Initialize `section` to a remaining section such as `agents`, and make `update()` target `current.id`; it must not retain the removed `general` ID.
4. Put reasoning effort under `Advanced model options`. Keep the complete provider model catalog available. Do not hard-code Fast/Balanced/Careful mappings.
5. Present the configured `counsel-copilot` agent as “Themis” with the role “Counsel Copilot.” Keep its underlying ID and Markdown heading unchanged.
6. Change “not a prompt template” to “Standing Markdown instructions used whenever this agent runs.”
7. Put tool permissions and file-path details under `Advanced controls`. Do not change the backend allow-list or save format.
8. Keep the PRD rule: an agent records a durable decision only after an explicit user instruction. Remove any conflicting UI statement.
9. Replace Load from file, Reset to default, and Discard with one `Discard changes` action backed by the last loaded/saved snapshot. Keep `Save agent`.
10. When switching agents with unsaved changes, use one clear browser confirmation. Do not add versioning or an approval workflow.
11. Remove normal-surface storage paths and build versions. Keep technical paths only inside Advanced controls.
12. On the Settings page, saving a changed provider/model value and reloading must show the saved value. This proves that the remaining section ID is used for writes.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run TypeScript or Next.js checks while other frontend workers are active.

#### Chunk C: decision register and research Markdown

Outcome: The register shows the correct matter and complete review reason. Research answers render formatted Markdown.

Own only:

- `frontend/components/DecisionTable.tsx`
- `frontend/app/decisions/page.tsx`
- `frontend/app/matters/[matterId]/research/page.tsx`

Required changes:

1. Build a `matter_id` to matter map in `DecisionsPage` and pass it to `DecisionTable`.
2. Show the real matter title in the Matter column. Use the ID only as an honest fallback when the matter cannot be found.
3. Show the complete review reason as wrapping text. Do not shorten it or rely on a tooltip.
4. State the recommendation-versus-recorded-decision rule once on the page.
5. Render research note answers with the existing `react-markdown` and `remark-gfm`. Do not enable raw HTML.
6. Keep recommendation cards outside the recorded-decision table.
7. Leave the research-note time call site unchanged during the parallel chunk. At the Wave 1 gate, the coordinator must replace its direct `en-GB` call with Chunk A's `formatTime` helper.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run TypeScript or Next.js checks while other frontend workers are active.

### Wave 1 gate — Sol Medium coordinator

1. Inspect every changed path against ownership.
2. Compare every worker-reported file with the pre-wave snapshot. Replace the research page's direct `en-GB` time format with `formatTime` from Chunk A.
3. Run:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend && npm run typecheck && npm run build
```

4. Reject the wave if settings still make a claim that only writes an unused key, if recommendations enter the register, or if the scoped counts are described as one identical number.

### Wave 2 — three independent Sol Light chunks

#### Chunk D: matter workspace, decision path, and chat reading

Outcome: The lawyer can see and use the decision path at laptop size. Chat supports the work without hiding it.

Own only:

- `frontend/components/MatterWorkspace.tsx`
- `frontend/components/RecordDecisionModal.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/MatterTree.tsx`
- `frontend/components/DocumentPanel.tsx`
- `frontend/lib/matterActions.ts`
- `frontend/app/globals.css`

Required changes:

1. Reorder the overview: question, proposed path, primary decision action, then open questions, evidence, artifacts, trace, and history.
2. Give the overview a useful minimum share of the center pane. It must not collapse to 60 pixels when saved chat is long.
3. Start the document pane collapsed unless the route explicitly requests a file or research document. Opening a file expands it. Keep the tree available, with non-core folders collapsed by default.
4. Change Review and decide from a chat seed into a focused review state inside the overview. Show the question, proposed path, unresolved questions, evidence, and record action.
5. Parse only an explicitly labelled proposed path from `recommendations.md`:
   - Remove Markdown emphasis from a line only for matching.
   - Treat a first substantive paragraph beginning `No recommendation` or `No launch recommendation` as no proposal and return an empty string.
   - Accept only a same-line `Working path:` or `Recommended path:` label.
   - Take the text after the label, then remove sentences beginning `Counsel must confirm`, `Confirm`, `Pending`, or `Open question`.
   - Do not synthesize a decision from a numbered section, `orientation.next_action`, or the first arbitrary non-heading lines.
   - Project Apex must prefill the limited-launch sentence without its `Counsel must confirm...` sentence. Relay must prefill its labelled migration path. Pulse and Beacon must have no prefill.
   Keep all unresolved assumptions outside `chosen_path`.
6. Keep the proposed decision prefilled. Default the decider to `detail.legal_owner` only. If it is missing, require entry. Remove the hard-coded Brian Harris fallback. Require both decision and decider before submit.
7. Opening or cancelling the modal must not write a decision. Keep `createDecision()` behind the final explicit button.
8. Put the assistant answer before the trace. Render the trace in a closed `<details>` labelled `Actions taken (N)`.
9. Show a human applied-skill label instead of making a raw slash command the dominant user message. Preserve the stored message and provenance.
10. Add `Focus answer` and `Restore workspace` controls that collapse and restore side panes. Focus mode must not write any record.
11. Remove build-path text from the normal document footer. Keep the document name and saved/unsaved state. Preserve raw Markdown mode and the accessible Track Changes label.
12. Reduce redundant resize and collapse controls where the new default makes them unnecessary. Do not remove keyboard access.
13. Add CSS for the fixed navigation contract from Chunk E: `.nav-group`, `.nav-primary`, and `.nav-admin`. This chunk owns `globals.css`; Chunk E owns the matching markup.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run TypeScript, Next.js, or browser checks while Worker E is active. The coordinator performs these checks at the Wave 2 gate.

#### Chunk E: navigation, Skills, Automations, and remaining identity copy

Outcome: The navigation separates daily work from administration, Skills has one entry path, and Automations never claims to reconnect a service it cannot reconnect.

Own only:

- `frontend/components/AppShell.tsx`
- `frontend/components/SkillBuilder.tsx`
- `frontend/components/AutomationPanel.tsx`
- `frontend/app/automations/page.tsx`
- `frontend/components/TodayChat.tsx`
- `frontend/components/UploadIntentCard.tsx`

Required changes:

1. Use Themis in Today chat and upload intent. Chunk D owns the same change in matter chat. Chunk C owns it in research. Do not rename agent IDs.
2. Keep Today, Workspace, Matters, Decisions, Skills, and Automations as daily navigation. Render them inside `<span className="nav-group nav-primary">`; render Agents and Settings inside `<span className="nav-group nav-admin">`. Chunk D owns the matching CSS. Do not invent an Assistant route.
3. Keep the term Skills. On the home state, show one primary `Build a skill` action and one secondary `Find repeated work` action. Remove duplicated entry buttons. Explain: “A skill is reusable guidance for one chat request.”
4. Rename failed automation action to `Retry now` and paused action to `Run once`. Do not claim either reconnects or resumes anything.
5. Keep create and run behavior. Do not add pause, resume, edit, delete, or integration reconnection APIs.
6. Use the shared date helpers from Chunk A for automation and Today date-time copy.

Worker check: self-review the owned diff and return the exact changed-file list. Do not run TypeScript or Next.js checks while Worker D is active.

#### Chunk F: demo-data cleanup and product documentation

Outcome: Browser-test data no longer changes the demo, and the product documents state the implemented decision rule and deferred work consistently.

Own only:

- `vault/03_Matters/referral-launch-browser-check-e78bd8/`
- `backend/tests/test_demo_content.py`
- `docs/ACCEPTANCE_TESTS.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/IMPLEMENTATION_STATUS.md` if status text changes

Required changes:

1. Before deletion, verify that the exact directory contains `matter_id: MAT-20260828-e78bd8` and title `Referral launch browser check`. Stop if either value differs.
2. Delete only that exact test-only matter directory. Do not touch any other matter.
   Before deletion, run `git ls-files -- 'vault/03_Matters/referral-launch-browser-check-e78bd8/**'` and require at least one result. This is the plan's only deletion exception because the tracked directory is recoverable from Git.
3. Add a demo-content test that rejects committed matters whose ID or title contains known browser-test markers.
4. Update browser-testing instructions to use a temporary copied vault and to remove the temporary directory after the check.
5. Align `DESIGN_LANGUAGE.md` with the PRD: an agent may record only after the user explicitly instructs it to record a durable decision. It may never turn a recommendation into a decision on its own.
6. Add the demo-script checklist from this plan to Acceptance Tests. Do not add dated observed results. The coordinator adds those only after the final browser walk. Keep historical observation notes intact.

Focused check:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest tests/test_demo_content.py
```

### Wave 2 gate and integration — Sol Medium coordinator

1. Inspect every changed path against ownership and the baseline dirty tree.
2. Resolve imports and shared wording. Do not redesign accepted chunks.
3. Verify that no visible control claims behavior that is only stored and ignored.
4. Verify that Themis is the user-facing name while Counsel Copilot remains the configured role and stable agent ID.
5. Run the full checks:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/backend && .venv/bin/python -m pytest
cd /Users/bharris/Programs/counsel-os-mvp/frontend && npm run typecheck && npm run build
cd /Users/bharris/Programs/counsel-os-mvp && graphify update .
```

6. Walk Acceptance Tests A, B, C, E, F, H, I, J, K, and L in the browser, plus the demo script above. Use the isolated browser procedure below. Never edit SQLite directly.
7. Test the matter page at 1280×720, 1024 pixels wide, and 768 pixels wide. Test keyboard access to disclosures and pane controls. Check the browser console.
8. Record observed results in a new dated section of `docs/ACCEPTANCE_TESTS.md`.

Before each wave, the coordinator must create a temporary snapshot outside the repository with `mktemp -d` and `rsync -aR` every path owned by that wave. Run this from the repository root and pass every owned path as a quoted argument, for example:

```bash
wave_snapshot_dir=$(mktemp -d)
rsync -aR -- 'frontend/lib/design.ts' 'frontend/lib/briefing.ts' "$wave_snapshot_dir/"
```

Use the complete ownership list for the actual wave, not only the example paths. Each worker must return the exact list of files it changed. At the wave gate, compare each reported file with its snapshot copy using `diff -u` for files or `diff -ru` for directories before accepting it. Also compare the worker list with `git status --short`. Do not rely on Git status alone because target files already contain user changes.

### Isolated browser acceptance procedure

Run the final browser walk against a copied vault. This prevents acceptance actions and SQLite indexing from changing the repository vault.

1. After Chunk F's deletion has been accepted, start one terminal or persistent command session with this complete command. It creates the copy, records a repository-vault hash, starts a fresh backend, verifies the real vault on exit, and removes only the guarded temporary copy. The fresh backend forces the disposable SQLite index to rebuild from Markdown:

```bash
set -e
counsel_repo='/Users/bharris/Programs/counsel-os-mvp'
cd "$counsel_repo"
acceptance_vault_dir=$(mktemp -d)
rsync -a --exclude '.counsel_os_cache.db' 'vault/' "$acceptance_vault_dir/"
repo_vault_hash_before=$(find vault -type f ! -name '.counsel_os_cache.db' -print | LC_ALL=C sort | while IFS= read -r path; do shasum "$path"; done | shasum | awk '{print $1}')
cleanup_acceptance_vault() {
  cd "$counsel_repo"
  repo_vault_hash_after=$(find vault -type f ! -name '.counsel_os_cache.db' -print | LC_ALL=C sort | while IFS= read -r path; do shasum "$path"; done | shasum | awk '{print $1}')
  if test "$repo_vault_hash_before" != "$repo_vault_hash_after"; then
    echo 'Repository vault changed during isolated acceptance.'
    return 1
  fi
  case "$acceptance_vault_dir" in
    /tmp/*|/var/folders/*) rm -rf -- "$acceptance_vault_dir" ;;
    *) echo "Unsafe temporary path: $acceptance_vault_dir"; return 1 ;;
  esac
}
trap cleanup_acceptance_vault EXIT
cd "$counsel_repo/backend"
VAULT_PATH="$acceptance_vault_dir" FRONTEND_ORIGIN='http://localhost:3100' SCHEDULER_ENABLED=false .venv/bin/python -m uvicorn app.main:app --port 8100
```

2. In a separate terminal, start the frontend on its isolated port:

```bash
cd /Users/bharris/Programs/counsel-os-mvp/frontend
NEXT_PUBLIC_API_BASE_URL='http://localhost:8100/api' npm run dev -- --port 3100
```

3. At `http://localhost:3100`, first record the original provider, model, and effort. Change one valid value, save, reload, and verify the change. Restore all original values, save, reload, and verify the restoration. Complete this restoration before any acceptance test that needs the configured real provider. Then complete the remaining browser walk.
4. Stop the frontend. Stop the backend last. The backend session's exit trap must report a matching repository-vault hash and remove the copied vault. A hash mismatch is a blocker; the copy is kept for diagnosis.

### Completion map for all 36 audit items

- Implement now: 2, 3, 4, 5, 6, 8, 9, 10, 19, 20, 21, 25, 32, 35.
- Implement as low-risk polish in the same run: 16, 17, 18, 26, 27, 28, 29, 30.
- Hide misleading stubs now; park full systems: 7, 11, 13, 33.
- Apply the accepted partial treatment: 1, 12, 14, 15, 22, 23, 24, 31, 34, 36.

## 5. Parked backlog

- **Authentication, roles, and privilege walls:** build only after multi-user deployment is approved. Until then, do not show access controls that do not bind.
- **Slack, mail, Drive, calendar, and e-signature connections:** build only when a real connector and connection-state API exist.
- **Full automation lifecycle:** add pause, resume, edit, delete, and reconnect only after users need to manage more than create and run schedules and the backend contract exists.
- **Citation-per-claim enforcement:** do not build for the MVP. Reconsider only after observed unsupported-output failures and an explicit PRD change.
- **Spend and configurable step enforcement:** add only after there is real cost telemetry or repeated runaway execution. A step limit must still end with the best available answer.
- **Rename Skills to Playbooks:** reconsider only after the existing playbook concept is merged or renamed through a deliberate vocabulary migration.
- **Remove Stages, Timeline, or the Workspace board:** use observed navigation behavior first. The current plan makes Table the default and keeps the alternatives.
- **Authenticated current-user attribution:** until auth exists, use the known legal owner or require the decider to type a name.
- **Automatic conversion of long chat answers into documents:** add only after users repeatedly ask to save chat output. Explicit draft creation already exists.
- **New frontend test framework:** add only when UI behavior can no longer be verified economically through pure helpers, typecheck/build, and the browser acceptance walk.
