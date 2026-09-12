Continue from this snapshot. Read the current instructions in your environment. Check relevant live state before you change anything. Do not ask the user to repeat settled decisions. New user instructions take precedence over this handoff.

# Counsel OS dossier generation: continuation snapshot

## 1. Current request and authority

The user requested this handoff with `$continue-in-new-task`. Prepare for manual transfer. They did not ask to create a new task or archive the source task.

The earlier request to build an editable, general-purpose Dossier generation skill was implemented and reported complete. The latest substantive request was: “do you think the last run is as good as the previous dossier?” That review is complete. It found a routing bug, but the user has not yet authorized a fix after the review.

At this checkpoint, no additional implementation or Harbor dossier regeneration is authorized. Do not treat this handoff as permission to change the application or the matter. If the user supplies a new implementation request with this snapshot, follow that request within its scope.

The next likely work is to fix intent routing and assess dossier quality through the actual shared action. That is a proposed continuation, not an approved task.

## 2. Workspace and checkpoint

- Checked at 2026-09-11 23:59 UTC, or 16:59 America/Los_Angeles. Final small checks continued just after that time.
- Repository and worktree: `/Users/bharris/Programs/counsel-os-mvp`.
- Branch: `main`.
- HEAD: `cbac9f39dffd2ffa24f5ae123e332e929a8df770`.
- Commit subject: `Integrate matter memory and solution paths into Counsel OS`.
- Source Codex task: `01a091d3-1f7b-70d3-9a68-fc7206635ff7`.
- Active vault: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3`.
- User's browser URL: `http://localhost:3000/experimental/chat?matter=MAT-20260909-d89ad8`.

The worktree has many modified and untracked files. It includes this work, earlier work, user data, and other changes. No commit was made in this task. Preserve all existing changes. Do not reset, blanket-revert, or stage everything. Recheck `git status --short` before editing overlapping files.

Important implementation files and live-vault records are untracked. A new Git worktree at HEAD will not contain them automatically. Local attachments and `/tmp` evidence also will not transfer automatically. Work in the source checkout unless the user requests another location and the required state is transferred safely.

## 3. Product goal and user decisions

The user first asked to run the frontend and backend. They then supplied an Opus review of the Harbor Pay dossier and an older dossier. They wanted to understand the differences and improve the product for any area of law, not just payments or this acquisition.

Settled decisions:

- Build a separate, editable skill named Dossier generation.
- Keep Answer, Research, and Draft useful as separate skills. Do not enlarge them merely to hold dossier instructions.
- The dossier skill may use relevant supporting skills.
- A plain-language request to generate a dossier should return the full dossier in chat, not only a plan or file link.
- Existing programmatic update triggers are acceptable. They should call the same shared generation action.
- Keep record protection, source limits, scope, and edit-conflict checks in code. Put writing guidance in the editable skill.
- Organize the document around the whole matter and its issues. A narrow research update must not erase other workstreams.
- Use compact, conclusion-first CRAC where useful: current answer, rule and support, application, and next step. CREAC can add explanation; IRAC can support exploratory analysis. These are writing structures, not mandatory headings for every paragraph.
- Preserve the exact saved decision question. Distinguish reported facts, assumptions, proposed advice, accepted advice, and recorded decisions.
- Keep the audit record, but do not show old positions as competing current advice. Use collapsed history where appropriate.
- Favor useful legal detail, ranking, support, and concrete work over long explanations.

The user explicitly said “Build it.” That implementation approval was used for the feature described below. The later quality review did not authorize further changes.

### Original review concerns to retain

Opus praised more honest sourcing and better licensing analysis. It also identified lost non-licensing coverage; contradictions from appended old positions; reported facts treated as assumptions; “Proposed next action: Unknown” despite an action table; weak authority selection; missing substantive research; and vague dates such as “Now” or “Before close.”

The broad goal is issue continuity, honest source labels, useful actions, and lawyer-readable analysis across legal areas. Do not convert Harbor-specific examples into hardcoded law rules. Do not claim all original concerns are solved.

Opus's legal claims were not independently verified in this work. Its suggestions about SAR review and confidentiality, filing clocks, OFAC screening, Reg E notices, GLBA marketing, licensing duration, and adopted state law remain research leads, not established findings.

## 4. Instructions that must carry forward

Use short, direct user-facing sentences and common words when practical. Put the result first. Explain necessary technical terms. Ask one question at a time. If an explanation is difficult, add a “Simple explanation” section. Do not alter code, legal quotations, commands, or file names to simplify them.

The newest user instructions add a strict delegation rule:

- Start child agents without parent conversation history.
- If supported, explicitly set `fork_turns: "none"`. Do not omit it. Do not use `all` or numbered history unless the user expressly requests transfer.
- Give a narrow, self-contained brief with the task, relevant facts, files, limits, approvals, and checks. Do not paste this whole handoff into a subagent brief.
- Apply the same rules to follow-up briefs and further delegation.
- If a tool cannot start a fresh agent, work in the current task or use another supported method. Do not silently copy history.

Before changing the app, read `/Users/bharris/Programs/counsel-os-mvp/docs/PRD.md` and `/Users/bharris/Programs/counsel-os-mvp/CODEX_HANDOFF.md`, plus current applicable instructions.

Project rules:

- Reduce the product lawyer's cognitive load. Produce an organized, researched, editable starting point. Do not add legal-perfection machinery.
- Do not add mandatory verifier agents, confidence gates, votes, generic legal disclaimers, or refusal behavior just because the work is legal.
- Keep advice separate from recorded decisions.
- Missing citations or failed tools must not erase useful output. Label supplied sources, verified sources, unverified leads, assumptions, and generated analysis honestly.
- On execution limits, make a final answer-only attempt from collected information. Clarification is optional, not a completeness gate.
- Prefer a prompt, context, or tool fix before a new service, pipeline stage, or agent.
- Markdown is authoritative. SQLite is a disposable index. Keep the MVP runnable and modules focused.
- `/Users/bharris/Programs/counsel-os-mvp/backend/frontmatter.py` is an intentional shim. Do not install `python-frontmatter` or replace its imports.
- Application file operations must remain inside `VAULT_PATH`.
- Do not add auth, cloud tenancy, queues, embeddings, Tauri, native Word redlining, or a plugin marketplace.
- Follow `/Users/bharris/Programs/counsel-os-mvp/docs/DESIGN_LANGUAGE.md`. Reuse semantic roles from `/Users/bharris/Programs/counsel-os-mvp/frontend/lib/design.ts` and `/Users/bharris/Programs/counsel-os-mvp/frontend/app/globals.css`. Use state words with color.
- Use `apply_patch` for local edits. Preserve unrelated work. Do not use destructive Git commands without clear authority.
- For codebase questions, first use `graphify query "<question>"` when the graph exists. Use `path` or `explain` for focused relationships. Dirty graph output is not a reason to skip it. Use the wiki index for broad navigation. After application changes, run `graphify update .`.
- Normal verification is backend pytest, frontend typecheck/build, and relevant browser acceptance checks in `/Users/bharris/Programs/counsel-os-mvp/docs/ACCEPTANCE_TESTS.md`.
- Give concise progress updates during work. Do not create a separate Codex task unless explicitly asked.

## 5. Completed implementation

The main narrative is `/Users/bharris/Programs/counsel-os-mvp/docs/living-dossier.md`. It includes earlier continuity work and the editable generation action. It does not replace the later routing-bug finding in this snapshot.

### Shared skill and writer

- Starter skill: `/Users/bharris/Programs/counsel-os-mvp/backend/app/blank_vault_template/00_System/skills/dossier-generation.md`.
- Installed live skill: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/00_System/skills/dossier-generation.md`.
- Composition: `/Users/bharris/Programs/counsel-os-mvp/backend/app/skills/dossier.py`.
- Context: `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py`.
- Shared writer: `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation.py`.
- Chat response: `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_chat.py`.

The skill uses `Uses: answer`. The resolver captures at most four direct supporting skills, their full text, and revision hashes. It does not recurse or execute Markdown code. Missing supporting guidance gives a warning. Startup installs the main skill only when missing; it does not overwrite a customized copy.

The writer makes one bounded model call without tools. It uses saved inputs and the selected provider. It does not start new research merely to refresh the dossier. It returns the full Markdown in chat, with a saved revision link or preview status as appropriate.

Captured inputs include saved matter records, exact question, issue IDs, prior dossier, reported facts, assumptions, advice, decisions, work, current direction, and research. Preview capture uses raw metadata/index reads, not a read path that repairs records. Restricted-source context withholds old unrestricted synthesis.

The context layer retains omitted issue sections using saved issue IDs. A mention in an overview is not enough. Retention stops at the next peer or parent heading, so it does not drag in a stale tail. Bold-only canonical headings are normalized outside fenced code. Exact issue markers such as `<!-- issue:ISS-... -->` remain in source but are hidden in rendering.

Publication rechecks input basis and dossier hash under existing locks. An intervening change produces a review revision, including for first creation. Stable publication keys use `dossier-generation:<run_id>`. Saved metadata includes frozen guidance, inputs, provider, metrics, and warnings. Preview does not save or consume pending work. Checkpoint or publication failure preserves useful generated text.

Automatic refresh uses operation-owned pending markers. It is not a new queue. A write operation consumes only its own fresh markers. Restricted, hypothetical, and preview chat does not trigger an unrestricted automatic save. Model calls run outside the record lock.

### Integration and existing files

Main integration points:

- `/Users/bharris/Programs/counsel-os-mvp/backend/app/skills/registry.py` and `/Users/bharris/Programs/counsel-os-mvp/backend/app/runtime.py`: skill installation and lookup.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/experimental_chat.py`, `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/experimental_chat.py`, and `/Users/bharris/Programs/counsel-os-mvp/frontend/components/experimental/ExperimentalSkills.tsx`: shared skill editor. The skill is not injected into every ordinary chat.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/chat.py` and `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/chat_runs.py`: explicit generation, frozen context, full response, automatic refresh, and scope handling.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier.py`: saved-record projection, pending markers, edit protection, and nonrecursive generated updates.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research.py` and `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research_runs.py`: shared generation after research publication. Research owns its marker from stage start to avoid a premature duplicate call.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/dependencies.py`: request-owned generation flush.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/matters.py`, `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/workspace.py`, and `/Users/bharris/Programs/counsel-os-mvp/backend/app/routers/files.py`: function-scoped dependencies complete refresh before the HTTP response and UI reload. Ordinary file saves use the shared workspace lock.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/agents/dispatch_budget.py`: dossier inputs cannot be discarded as old conversation on overflow.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/providers/mock.py`: deterministic dossier output for tests.
- `/Users/bharris/Programs/counsel-os-mvp/frontend/components/workspace/ClaimMarkdown.tsx` and `/Users/bharris/Programs/counsel-os-mvp/frontend/scripts/check-citation-reading.ts`: hide exact issue markers without changing saved Markdown or code examples.

The dedicated skill work did not enlarge the existing experimental Answer, Research, or Draft guidance. Those files already have other uncommitted changes; do not assume they are clean or revert them.

### Earlier work in this conversation

Scoped research continuity was implemented before the dedicated skill. It preserves untouched issues and source links, uses honest coverage labels, extracts useful next actions, and collapses old positions and assumptions.

Relevant files:

- `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_research.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/research_publication.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/scripts/refresh_dossier_research.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_research_continuity.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/tests/manual/serve_dossier_continuity.py`.
- `/Users/bharris/Programs/counsel-os-mvp/frontend/lib/markdownDisclosures.ts`.

Harbor's saved dossier was refreshed from its saved research packet during that earlier continuity work. It was not regenerated through the later dedicated skill. Do not confuse those two events.

## 6. Latest review: evidence and unfixed bug

The reviewed run is `RUN-20260911-30a30c`, for matter `MAT-20260909-d89ad8`.

- Created: `2026-09-11T23:28:51+00:00`.
- Finished: `2026-09-11T23:31:04+00:00`.
- Request, exactly: `Genrate a dossier`.
- Provider: `codex`; model: `gpt-5.6-sol`; reasoning: `medium`.
- Applied skills: only `matter-paths`, not `dossier-generation`.
- Frozen context had no `dossier_inputs`. There was no dossier-generation result.
- Scope was `scenario`. Active hypothetical path: `SCN-406906c91ab0aba4313b54a6`.
- Mainline path: `SCN-490c71c86d9c658974321c1e`, the Mosaic-operated migration.
- The active hypothetical assumed a partner bank held customer funds. No source exclusions were recorded.
- The response began `# Draft dossier: Harbor Pay acquisition migration`. It expressly said it used the hypothetical and did not change the current transaction plan or record a decision.

The cause is in `/Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation.py`, near line 18. `_COMMAND` is an anchored regular expression requiring exact verbs. `requested()` recognizes that expression or the explicit `/dossier-generation` command.

Read-only reproduction during review:

```python
requested(ChatRequest(message="Genrate a dossier"))   # False
requested(ChatRequest(message="Generate a dossier"))  # True
```

The misspelling bypassed the shared action. Ordinary chat answered under the inherited hypothetical path. The code still had this behavior at the handoff checkpoint. This is brittle routing, not user error and not proof of poor writing by the new skill.

Even a correctly spelled request on the non-mainline path should be a preview. Do not silently switch scope or adopt the mainline to make it save.

### Quality verdict already given

The latest draft was a better overview, but not yet a better working dossier.

It restored breadth: identity records, alerts and suspicious activity reports, monitoring, communications, and the bonus appeared in the main analysis. Its opening was clearer, and it stated the hypothetical scope.

It lost useful depth: detailed licensing reasoning and transition conditions, the owner/timing/evidence/fallback work table, saved source links, coverage states, and the intended rule/application structure.

The proposed quality target is the new breadth and readability plus the earlier depth, source links, and concrete work plan. CRAC should organize the substance, not make it thinner. This proposed target has not yet been implemented after the review.

No code, skill, or matter changes were made during that review. No misspelling regression test or routing fix has been added since discovery. No fresh Harbor generation through the intended action has been done.

## 7. Exact review materials

These local files are the main evidence. Do not rely on an open browser tab alone.

- Latest run and full response: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260911-30a30c.md`.
- Frozen run context: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/context/RUN-20260911-30a30c.md`.
- Current canonical dossier: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier.md`.
- Current saved revision: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-c993ab2326efd727cc3d.md`.
- Earlier long, licensing-heavy comparison: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-4cc39b05492c9b214333.md`.
- Saved licensing research: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md`.
- Its research run: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/research/runs/RUN-20260911-d08e84.md`.
- Original conversation: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md`.
- Another conversation exists at `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/CONV-20260911-20d4ea.md`. Check metadata before assigning a run to either conversation.
- User's pasted old-dossier attachment: `/Users/bharris/.codex/attachments/1d2e5aae-bda0-4b15-b326-947e2b520f82/pasted-text.txt`. It existed at this checkpoint.

The canonical dossier still points to `DOS-c993ab2326efd727cc3d`, updated `2026-09-11T21:15:53+00:00`. Its recorded content hash is `a0c90a373f8cf91351373874a70856bf77a2e51bdd276b26f0870804a57a2351`. The latest chat run did not replace it.

The current dossier includes the matter summary, reported facts, issue/workstream material, collapsed earlier assumptions/history, coverage table, research links, and next action. Its broad issue list and coverage-row mapping still differ. Do not claim complete canonical issue-map reconciliation.

The older `DOS-4cc39b05492c9b214333` was created at `2026-09-11T16:50:48+00:00`. It has richer licensing checks, state triggers, true-provider conditions, funds-flow questions, and a work table. It also has the old Unknown next-action field and appended-position problems.

The research packet retrieved four sources: a CSBS model act, a New York DFS licensing page, an OCC preemption alert, and a Fenergo vendor page. The saved status did not establish claim support: zero passages were reviewed or verified. Do not describe the older dossier as verified legal analysis.

Reported matter background includes an asset acquisition targeted for November 15, 240,000 consumers and 12,000 business accounts, one account/balance/full product set on day one, no re-verification, missing pre-2023 identity documents, monitoring software ending at close, about 40 open alerts, unread SAR history, and a $50 first-transfer bonus. The saved license counts and “four new markets” claim may need reconciliation. These are reported facts, not verified legal findings. Do not invent jurisdictional conclusions or dates.

## 8. Verification already performed

Do not rerun a broad suite merely to resume from this snapshot. Use checks proportionate to any newly authorized change.

Feature tests:

- `/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_generation.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_generation_chat.py`.
- `/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_generation_integrity.py`.
- Manual isolated fixture: `/Users/bharris/Programs/counsel-os-mvp/backend/tests/manual/serve_dossier_generation.py`.

Results:

- Full backend run: 1,522 passed and 8 failed in 747.26 seconds. Log: `/tmp/counsel-dossier-generation-pytest.log`.
- Three failures were old call-count expectations in `/Users/bharris/Programs/counsel-os-mvp/backend/tests/test_continuity_recovery.py`. They were updated to distinguish the extra dossier call and passed on focused reruns. Original functional assertions were retained.
- Five baseline failures remain outside this feature's completed work:
  - `tests/test_matter_action_api.py::test_research_run_api_forwards_source_action_key[None]`.
  - `tests/test_matter_action_api.py::test_research_run_api_forwards_source_action_key[ISS-TARGET]`.
  - `tests/test_workspace_interactions.py::test_q5_scenario_runner_and_executor_deny_mutations_and_alias_then_adopt`.
  - `tests/test_workspace_interactions.py::test_q5_saved_scenario_and_recovery_remain_read_only`.
  - `tests/test_workspace_interactions.py::test_q5_direct_scenario_retry_cannot_unlock_actual_scope`.
- The first two concern source serialization expectations missing `collection_enabled`; the other three concern existing scenario-research tool expectations. Do not silently broaden work to fix them.
- A later affected-subsystem run passed 369 tests in 234.76 seconds. Log: `/tmp/counsel-dossier-verified.log`.
- After the final heading adjustment, a narrower run passed 48 tests.
- The full suite was not rerun after these final adjustments. Do not report a fully green backend suite.

The 369-test command, run from `/Users/bharris/Programs/counsel-os-mvp/backend`, was:

```bash
.venv/bin/pytest -q tests/test_dossier_generation.py tests/test_dossier_generation_chat.py tests/test_dossier_generation_integrity.py tests/test_dossier_research_continuity.py tests/test_continuity_recovery.py tests/test_chat_runs.py tests/test_experimental_chat.py tests/test_research*.py tests/test_living_dossier.py tests/test_workspace_records.py tests/test_workspace_files.py tests/test_workspace_actions.py tests/test_workspace_drafting.py tests/test_workspace_lifecycle.py tests/test_workspace_team.py
```

The final 48-test command used the three generation test files, `test_dossier_research_continuity.py`, and `test_living_dossier.py` from that same backend directory.

Frontend typecheck and isolated production build passed from `/Users/bharris/Programs/counsel-os-mvp/frontend`:

```bash
npm run typecheck
PHASE2_DIST_DIR=.next-dossier-generation-build npm run build
node --experimental-strip-types scripts/check-citation-reading.ts
node --experimental-strip-types scripts/check-markdown-disclosures.ts
node --experimental-strip-types scripts/check-chat-sections.ts
```

Test-generated TypeScript includes were removed. The pre-existing dirty `/Users/bharris/Programs/counsel-os-mvp/frontend/next-env.d.ts` import was restored to its earlier `.next-citation-reading-build/types/...` form, not reset to Git HEAD.

Browser checks used an isolated fixture. Editing the skill to request “Counsel snapshot” changed both manual output and automatic generation after a task mutation. The full dossier survived reload. Employment, privacy, and trademark sections remained visible. Issue markers were hidden in rendering but preserved in source. These were focused checks, not a claim that every acceptance scenario was walked.

Two configured-model previews used a temporary fictional illustration-studio matter with `openai_compatible` / `deepseek-v4-flash`. They checked full output, CRAC structure, breadth, and reported signed-contract facts. The first overstated what a missing saved permission/privacy record implied. A narrow skill instruction was added and retested: a missing record is not proof that the right, permission, or approval does not exist. Both starter and live skill copies received that controlled change. No new legal research was performed, and this was not a broad legal-quality benchmark.

`git diff --check` passed. `graphify update .` completed after application changes. Log: `/tmp/counsel-dossier-graphify-final.log`; 15,100 nodes, 29,703 edges, 1,524 communities. Zero-node warnings for JSON configuration files did not require action.

## 9. Runtime and ongoing work

At this checkpoint:

- Frontend `http://127.0.0.1:3000` returned HTTP 200. Listener PID: 35951.
- Backend `http://127.0.0.1:8000/api/health` returned HTTP 200. Reload parent PID: 14669; worker PID: 31084.
- `/health` without `/api` returned 404. Use the correct health endpoint; this was not a backend outage.
- PIDs can change. Verify targets before stopping anything.
- No implementation agents, broad tests, goals, or automations are active from this task.
- Implementation agents Zeno (`01a09299-d1a7-7431-b454-85599f0c9621`) and Singer (`01a09299-d234-7ac2-8618-04cf8a3eb11a`) were closed.
- Temporary fixture servers on 8199 and 3199 were stopped. Temporary browser tab4 was closed. The original user tab was left intact.
- No new task was created, no source task was archived, and no application or project-instruction files were changed to prepare this handoff.

## 10. Proposed continuation, only if authorized

1. Read current instructions and verify the source checkout and live state. Do not rebuild the completed feature or ask again whether the skill should be separate or general-purpose.
2. If the user asks for the routing fix, first reproduce `Genrate a dossier` as a failing regression. Find the smallest general solution for natural-language intent to reach the shared action. Do not hardcode Harbor or only add a list of this user's misspellings.
3. Preserve negative requests, discussion about generation, skill-edit requests, source restrictions, and hypothetical scope. Do not silently change the active approach to force a save.
4. Prove the end-to-end route with applied skill, frozen dossier inputs, trace, full response, and correct save-versus-preview behavior. A plausible document alone does not prove the intended action ran.
5. Separately assess the actual action's output against the earlier dossier. If changes are requested, retain useful legal depth, source links, coverage state, and owner/date/evidence/fallback work while improving CRAC organization. Do not invent support, owners, dates, or legal conclusions to fill fields.
6. Regenerate or save the current Harbor dossier only with appropriate user direction. A preview on the hypothetical path is not a current-matter update. Ask one scope question only if it would materially affect the requested result.
7. Run focused tests and relevant frontend/browser checks. Update the graph after application changes. Report the known baseline failures separately.

## 11. Continuity limits

This snapshot consolidates the available conversation and checked local evidence. It is not a fresh audit of every changed file or a legal research report. Test results describe completed earlier runs; only small state checks were done for this handoff. The attachment exists locally, but external environments may not have it. Temporary logs may expire. The user may change the live matter, skill, branch, providers, or servers after this checkpoint.

Use saved records and current files to resolve any later difference. Keep useful output and record integrity. Await new user direction where this snapshot marks work as proposed rather than authorized.
