# One-shot implementation prompt

Copy the prompt below into a new implementation task in this repository.

---

Implement the complete decision map redesign in `/Users/bharris/Programs/counsel-os-mvp`.

Read and follow:

1. `AGENTS.md`, `frontend/AGENTS.md`, `docs/PRD.md`, `CODEX_HANDOFF.md`.
2. `docs/DESIGN_LANGUAGE.md`, including the September 5 Matter A reference amendment at the end.
3. `docs/decision-map-redesign.blueprint.md`.
4. `docs/decision-map-redesign.build-plan.md`.
5. `docs/decision-map-redesign.tracking.md`.

This is an implementation request. Carry it through integration, review, correction and proportionate verification. Do not stop at another plan or a static mockup. Keep the app runnable. Preserve all pre-existing changes in this dirty shared tree. Do not commit, push, deploy or create a pull request.

The feature must let a lawyer open an issue and see:

- What the issue means and why it affects the business.
- The applicable law, contract, policy or legal test, with actor, jurisdiction, material exceptions and actual source support where available.
- Facts or questions that change the answer, including Unknown and Conflicting states.
- Multiple conditional paths and business alternatives, with consequences and remaining work.
- The distinction between exploring an option, a hypothetical scenario, an agent recommendation and an explicit recorded decision.

Use the reference visuals at:

`output/matter-ui-design-survey/designs/06-map.png`

`output/matter-ui-design-survey/designs/02-issue.png`

`output/matter-ui-design-survey/designs/01-understand.png`

`output/matter-ui-design-survey/designs/07-scenario.png`

Actually open the images. Keep the white Matter A surface, shared fonts and state tokens, serif headings, curved labelled links, compact cards, selected detail below the graph, and outline below that. The new focused map has three readable graph columns: Law or test / What changes the answer / Possible paths. Issue explanation is above; consequences and actions are below. Do not force five wide columns or fit the whole matter to unreadable text. Keep the first fork readable at 1280 × 900. Compare actual screenshots with the supplied designs.

The interactive blueprint is at `/Users/bharris/.codex/visualizations/2026/09/06/01a07422-fe4b-7f13-80a1-7f6b74558425/decision-map-blueprint.html`. It demonstrates interactions with fictional content. It is not application code and not a substitute for actual data, API wiring, source references or record integrity. If the preview file is unavailable, use the full behavior and geometry in the blueprint Markdown.

Critical diagnosis: normal issue chat/research currently does not save options or test/condition structure. Existing populated map fixtures inserted options directly. Implement the real production generation → prose preservation → optional structure parsing → saved issue analysis → derived map path. Reuse the existing inquiry/research/scenario/decision services. Do not invent populated data or add a separate legal rule engine.

Preserve useful prose and previous valid analysis when optional structure, sources or tools fail. A late run must not replace newer analysis. Resolve claims by exact saved output revision. Keep current-analysis pointers per issue and prevent lost updates across concurrent issues. Use issue-local canonical input hashes, excluding generated output/claim-link/status/dossier writes; broad shared-file revision equality must not invalidate unrelated issues. Freeze research target and actual input context at enqueue time. The pointed output is the sole current structured analysis; legacy options are labelled fallback/history. Define non-circular server analysis/option digests and persist exact canonical decision basis plus a request fingerprint. Split mixed all/any logic into separate routes or preserve it as incomplete prose. Do not run a model on page load.

Keep `focusedIssueId` separate from `selectedNodeId`. Clicking a child must retain the issue, ancestors and sibling choices. The visual graph and complete grouped outline must expose the same identities and relationships. Unknown does not choose a path. Clicking an option only previews it. Sources and hypotheses must return to the same context. Keep one existing conversation instance and preserve unsent text.

Record this path opens the existing decision modal. Only its final explicit action writes. Persist the exact analysis/option revision and frozen canonical basis alongside the lawyer's chosen wording. Validate that it belongs to the matter. Keep source-action-key retries safe. A different payload with the same key conflicts. Refresh failure must not create another decision. Regeneration must preserve the old recorded basis. Do not automatically resolve the issue, approve work, send a response or close the matter.

Use the parallel-plan-executor skill. Freeze contracts and capture the dirty-tree baseline before agents write. Follow C0–C6 from the build plan with exact file ownership. Maximum three active workers plus the coordinator. Workers must not spawn agents, start services, run full suites/builds, edit shared types outside ownership or modify the tracking file. The coordinator owns shared contract files, route integration, scripts, tests with shared side effects, graphify and the ledger.

Requested pools: Terra High (`gpt-5.6-terra`, high) for the graph/UI; Sol High (`gpt-5.6-sol`, high) for generation and persistence; Sol Medium (`gpt-5.6-sol`, medium) for issue/form work and a fresh separate combined-review instance. Research by Luna High is complete and recorded in the blueprint. Do not repeat it without a concrete gap.

The original user also said “Xai”. Check the tracking file for a later resolved model name before dispatch. If it remains unresolved, ask one concise question identifying this ambiguity. Do not silently substitute Terra xhigh, Astra or an xAI/Grok model. Complete C0 and other independent authorized preparation while waiting. Resolve that pool before assigning its chunk. Record actual provider/model/effort and any runtime limitation. Do not pretend all requested models ran if one was unavailable.

Waves: C0 contract/baseline; C1 generation + C3 graph + C4 issue/form in parallel; C2 projection/decision after C1; C5 serial route integration; C6 fresh read-only Sol Medium review and scoped corrections. Review the C0 incremental diff, not all unrelated uncommitted changes. Do not add extra reviewers or create artificial tasks just to use slots.

Update `docs/decision-map-redesign.tracking.md` after each accepted chunk. Record state, actual owner/model/effort, changed files, focused checks, evidence, findings and next action. A worker report is not proof until the coordinator checks it. Add the frozen `docs/decision-map-redesign.contract.md` at C0 and final `docs/decision-map-redesign.verification.md` at completion.

Use an isolated synthetic vault for all mutation tests. Never change reference matter `MAT-20260904-abf788`, the real active vault or its settings to make the design look populated. Do not stop pre-existing services. Prove production analysis publication through normal service/UI paths, using a provider double only at the provider boundary. Then run one configured-model analysis on synthetic data with public search disabled, and state any real blocker honestly.

Run focused meaningful checks as you implement. After integration run the required backend pytest, frontend typecheck/build, map aggregate and new focused checks. Walk `docs/ACCEPTANCE_TESTS.md`, covering this feature deeply and unrelated routes proportionately. Verify desktop visuals, issue/path/source/scenario/decision roundtrips, unknown/partial/missing states, long titles, shared facts, stale late results, exact decision versions and retry safety. Do not weaken tests or rerun broad suites without cause. Run `graphify update .` once after application code changes. Record tool limits.

Finish with the verified result, screenshots, test outcomes, actual model routing and clear remaining limits. Leave the tracking file truthful. Do not claim full completion with unresolved material failures, fake branch generation, unreadable labels, or unwired controls.
