Continue from this snapshot. Read the current instructions in your environment. Check relevant live state before you change anything. Do not ask the user to repeat settled decisions. New user instructions take precedence over this handoff.

# Counsel OS: completed dossier and research repairs

## 1. Goal, current request, and authority

The product goal is an editable, general-purpose matter dossier that helps a lawyer understand the whole matter and take useful next steps. The user wanted this to work across legal areas, not only for Harbor Pay or payments.

Earlier work built a separate Dossier generation skill and its shared writer. This task then repaired the live Harbor chat timeout. The latest substantive user request was: “Lets fix the dossier and the related research failures.” That repair is complete and verified.

The current request is to use the continue-in-new-task skill. This is a handoff for manual transfer. The user did not ask to create a new task, archive this task, commit changes, or replace Harbor's saved dossier.

There is no unfinished repair job at this checkpoint. The next likely product step is a real-model dossier preview and quality comparison. That is a proposed next step, not an approved regeneration or new research run. Do not invent more implementation work merely because this snapshot is pasted into a new task.

This snapshot supersedes the older handoff's statements that the typo-routing bug is unfixed, that related backend failures remain, and that repair approval is missing. The user later authorized those repairs, and they now pass. It does not turn the deferred quality comparison into completed work.

## 2. Workspace and live checkpoint

Checked on 2026-09-12 at about 01:14 UTC, which is 2026-09-11 at 18:14 America/Los_Angeles.

- Repository and working directory: /Users/bharris/Programs/counsel-os-mvp
- Branch: main
- HEAD: cbac9f39dffd2ffa24f5ae123e332e929a8df770
- Commit subject from the inherited snapshot: Integrate matter memory and solution paths into Counsel OS
- Source Codex task: 01a092e5-b690-7ea1-8cf9-2f9f5a169637
- Earlier feature/review task: 01a091d3-1f7b-70d3-9a68-fc7206635ff7
- Active vault: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3
- Harbor matter: MAT-20260909-d89ad8
- User's browser URL: http://127.0.0.1:3000/experimental/chat?matter=MAT-20260909-d89ad8

Before writing this handoff, git status with all untracked files reported 85 tracked changes, 389 untracked files, and no staged changes. This is a heavily modified checkout containing feature work, prior fixes, live matter records, and other user changes. These counts are a checkpoint, not a list of files owned by this repair.

No commit was made. Preserve all changes. Do not reset, blanket-revert, clean, or stage everything. Several essential application files and live-vault records are untracked. A fresh Git worktree at HEAD will not contain the working implementation or data automatically. Continue in the source checkout unless the user requests a different location and the needed state is safely transferred.

At this checkpoint:

- Frontend http://127.0.0.1:3000/ returned HTTP 200 in 0.079 seconds. Listener PID: 35951.
- Backend http://127.0.0.1:8000/api/health returned HTTP 200 in 0.004 seconds. Reload parent PID: 36180; worker PID: 42617.
- Use /api/health, not /health. A health response alone does not prove that a large matter loads quickly.
- No listeners remain on temporary test ports 3199 or 8199.
- The user's original browser tab remains intact. The isolated test tab was closed.
- No repair test process, coding agent, goal, or automation remains active from this task.
- Process IDs and live records can change. Check exact targets before stopping anything.

Harbor's canonical dossier file is:
 /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier.md

Its complete-file SHA-256 was checked again for this handoff:
43e981a01383ccc2a4531516146ddbce7f0ec3a78f1b3d4c09f6c2de88e086b2

The file was not regenerated or replaced during either repair. This does not mean it is clean relative to Git HEAD; it already contained earlier user and feature work.

## 3. User instructions and accepted product decisions

Use ASD-STE100 Simplified Technical English where practical. Use short, direct sentences and common words. Put the result first. Explain necessary technical terms. Ask only one question at a time. Add a “Simple explanation” section when an explanation is difficult. Do not rewrite code, commands, legal quotations, or file names to simplify them.

Before changing the application, read the current applicable instructions and:

- /Users/bharris/Programs/counsel-os-mvp/AGENTS.md
- /Users/bharris/Programs/counsel-os-mvp/docs/PRD.md
- /Users/bharris/Programs/counsel-os-mvp/CODEX_HANDOFF.md

Preserve these settled product choices:

- Dossier generation is a separate, editable skill. Keep Answer, Research, and Draft useful as separate skills.
- It can use supporting skills, but writing guidance belongs in the editable skill. Record protection, source restrictions, scope, and edit-conflict checks belong in code.
- A plain-language generation request returns the full dossier in chat, not only a plan or file link.
- Existing programmatic refresh triggers use the same shared generation action.
- Organize around the whole matter. Narrow research must not erase unrelated workstreams.
- Use conclusion-first CRAC where useful: current answer, rule and support, application, and next step. CREAC and IRAC can help where appropriate. These are writing structures, not mandatory headings in every paragraph.
- Preserve the exact saved decision question. Keep reported facts, assumptions, proposed advice, accepted advice, and recorded decisions separate.
- Preserve the audit history, but do not present old positions as competing current advice. Collapsed history is appropriate.
- Useful depth, issue ranking, source links, and concrete work matter more than lengthy explanation.
- A missing saved permission or approval record does not prove that the permission or approval does not exist.

Engineering and safety constraints:

- Reduce the lawyer's cognitive load. Produce an organized, researched, editable starting point, not legal-answer theater.
- Do not add mandatory verifier agents, generic disclaimers, confidence gates, multi-agent votes, or refusal behavior because the work is legal.
- Missing citations and tool failures must not discard useful output. Label supplied sources, verified sources, unverified leads, assumptions, and generated analysis honestly.
- On execution limits, make a final answer-only attempt from collected information. Clarification is optional, not a completeness gate.
- Prefer a focused prompt, context, or tool fix over new machinery.
- Keep Markdown authoritative and SQLite disposable. Keep the MVP runnable.
- Preserve /Users/bharris/Programs/counsel-os-mvp/backend/frontmatter.py as the intentional compatibility shim. Do not install python-frontmatter.
- Application file operations must stay inside VAULT_PATH.
- Do not introduce auth, cloud tenancy, a queue, embeddings, Tauri, native Word redlining, or a plugin marketplace.
- Follow /Users/bharris/Programs/counsel-os-mvp/docs/DESIGN_LANGUAGE.md. Reuse semantic roles from /Users/bharris/Programs/counsel-os-mvp/frontend/lib/design.ts and /Users/bharris/Programs/counsel-os-mvp/frontend/app/globals.css. State words must accompany colors.
- Use apply_patch for local edits. Preserve unrelated changes.
- For codebase questions, first use graphify query when graphify-out/graph.json exists. Use path or explain for focused relationships, and the wiki index for broad navigation. Dirty graph output is not a reason to skip it. Run graphify update . after application changes.
- Normal verification is backend pytest, frontend typecheck/build, and relevant browser checks from /Users/bharris/Programs/counsel-os-mvp/docs/ACCEPTANCE_TESTS.md.
- Use applicable skills. The completed repairs used focused-fix and senior-mindset to keep changes narrow and prove behavior.

Delegation rules:

- Start child agents without parent conversation history.
- If supported, explicitly set fork_turns: "none". Do not omit it or copy history unless the user expressly asks.
- Give only the relevant task, facts, files, limits, approvals, and checks in a self-contained brief. Do not paste this whole handoff into a subagent brief.
- Apply those rules to follow-up briefs and further delegation.
- If the tool cannot start a fresh agent, work in the current task or use another supported method. Follow current tool limits on whether delegation is available.
- Do not create a separate user-visible Codex task unless explicitly asked.

## 4. Existing dossier architecture to preserve

The main design and implementation narrative is:
 /Users/bharris/Programs/counsel-os-mvp/docs/living-dossier.md

Essential files:

- Starter skill: /Users/bharris/Programs/counsel-os-mvp/backend/app/blank_vault_template/00_System/skills/dossier-generation.md
- Installed editable skill: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/00_System/skills/dossier-generation.md
- Skill composition: /Users/bharris/Programs/counsel-os-mvp/backend/app/skills/dossier.py
- Shared writer and request routing: /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation.py
- Frozen inputs and heading/issue handling: /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py
- Full chat response: /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_chat.py
- Saved record projection and publication protection: /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier.py
- Earlier scoped research continuity: /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_research.py

The skill uses Uses: answer. Composition captures up to four direct supporting skills with full text and revision hashes. It does not recurse or execute Markdown code. Startup installs the main skill only if missing, not over a customized copy.

The shared writer makes one bounded model call without tools. It uses saved inputs and the selected provider. A refresh does not itself start new research. It returns the full Markdown with either a saved revision link or preview status.

Frozen inputs include the exact question, issue IDs, prior dossier, facts, assumptions, advice, decisions, work, direction, and research. Restricted-source context withholds old unrestricted synthesis. Preview reads do not repair or mutate matter records.

Issue continuity uses saved issue IDs. A mention in an overview is insufficient. Retention stops at the next peer or parent heading. Exact issue markers stay in Markdown but are hidden in rendering.

Publication rechecks the input basis and dossier hash under existing locks. Intervening edits produce a review revision. Stable publication keys use dossier-generation:<run_id>. Preview does not save or consume pending work. Failure handling retains useful generated text.

Automatic refresh uses operation-owned pending markers, not a new queue. Research owns its marker from stage start. Restricted, hypothetical, and preview chat does not trigger an unrestricted automatic save. Model calls run outside the record lock.

Chat, durable runs, saved-record mutations, and research publication already use this shared action. These integrations were not rebuilt by the latest repair. See the design document and existing callers before changing them.

Earlier continuity work refreshed Harbor from its saved research packet. That was not a new Harbor generation through the later dedicated skill. Do not confuse those events.

## 5. Completed repairs

### A. Live Harbor chat timeout

Evidence and details:
 /Users/bharris/Programs/counsel-os-mvp/output/chat-load-fix/verification.md

The backend was running, but repeated reads parsed large Markdown records repeatedly. Harbor held about 33 MB of records, including a conversation of about 10.6 MB. Frontmatter parsing accounted for over 90% of the measured load time.

The focused repair is in:

- /Users/bharris/Programs/counsel-os-mvp/backend/app/services/vault.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_vault.py

The reader caches parsed records, checks file metadata on each read, returns separate mutable copies, and prevents duplicate parallel parsing with a lock. Limits are 256 files and 32 MiB of source bytes. Parsed metadata adds memory beyond that byte limit. No storage migration or new service was added.

A failing nine-reads/nine-parses case became one parse. Tests cover parallel reads, metadata isolation, edits, replacement, deletion, symlink escape, mid-parse changes, limits, and separate vaults.

The actual Harbor chat then loaded its title, history, files, saved conversation, and enabled input without the timeout banner. Reload also passed. Warm HTTP samples improved from 5.882/7.224 seconds for matter/workspace to 0.452/0.851 seconds. These are samples, not guarantees; cold records must still be parsed.

The older report lists 14 backend failures from that stage. They are historical findings, now resolved by repair B.

### B. Dossier routing and related research failures

Final evidence:
 /Users/bharris/Programs/counsel-os-mvp/output/dossier-research-fix/verification.md

Production changes were limited to three existing implementation areas:

1. /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation.py
   - The observed “Genrate a dossier” request now reaches the shared action.
   - Matching accepts an exact action verb or one missing, repeated, or swapped letter within the existing constrained command form.
   - It deliberately does not accept arbitrary insertion or substitution, which could misread “Created a dossier” or “Wrote a dossier” as commands.
   - Negated requests, reading requests, skill edits, and past-tense reports remain excluded.
   - No model-based intent service or Harbor-specific exception was added.
   - Existing source restrictions and save-versus-preview rules remain.

2. /Users/bharris/Programs/counsel-os-mvp/backend/app/services/dossier_generation_context.py
   - Bold research headings inside managed recommendations or collapsed history were being promoted into root dossier fields.
   - Heading normalization now skips the managed recommendation span, nested details blocks, and code fences.
   - Root Matter summary and Open questions headings are recognized alongside the existing root fields.
   - The original research-orientation test passes without weakening its assertions.
   - No live dossier rewrite or migration was performed.

3. /Users/bharris/Programs/counsel-os-mvp/backend/app/agents/runner.py
   - One execution-guard condition now includes SCENARIO_RESEARCH_TOOLS, matching the tools already offered and registered.
   - A hypothetical scenario can propose research source choices.
   - Proposing choices neither starts research nor changes saved matter records. Source confirmation remains a separate action, and matter writes remain blocked.
   - This file has many older changes; do not attribute its whole Git diff to this repair.

Some failures were incorrect or outdated tests, not application regressions:

- Main-agent tests now require exactly three calls, including the existing no-tools dossier-writing call.
- The 1,000-page source test keeps the investigation's 400,000-character aggregate limit. It separately bounds the dossier call by the dispatch limit. Whole-source and manifest exclusions still apply to all calls. A repeated wait must not add another model call.
- API expectations include the existing collection_enabled: false field.
- The finalization retry test now counts all saved stage-event IDs. The UI's last-six-event window cannot prove a total event count. It still requires exactly one new event, the same final file, and a no-change retry.
- Scenario tests permit source proposals while asserting no research run and unchanged matter facts/dossier.
- A scope regression supplies actual scenario execution state, covering the previously missed runner guard.

Changed regression test files for this repair:

- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_dossier_generation_chat.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_main_agent_research.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_source_library_lifecycle.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_matter_action_api.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_workspace_interactions.py
- /Users/bharris/Programs/counsel-os-mvp/backend/tests/test_research_scope.py

Documentation was updated in /Users/bharris/Programs/counsel-os-mvp/docs/living-dossier.md. No new model call or service was added by this repair. The earlier vault-cache changes were preserved.

## 6. Verification already completed

The final full backend run passed: 1,575 tests, zero failures, zero errors, zero skipped tests, and six dependency deprecation warnings. Console duration: 942.98 seconds.

The machine-readable result was checked again for this handoff:
 /Users/bharris/Programs/counsel-os-mvp/output/dossier-research-fix/pytest.xml

Command, from /Users/bharris/Programs/counsel-os-mvp/backend:

    .venv/bin/pytest -q --tb=short --junitxml=../output/dossier-research-fix/pytest.xml

This run completed after all application and test edits. The former 14 failures are not outstanding. Earlier partial-run counts in older documents do not override this result.

Other completed checks:

- Before repair, new typo and embedded-heading tests produced six failures; they passed afterward.
- Dossier and source-library group: 85 passed.
- Durable-chat regression proves that a typo request on a non-mainline hypothetical path returns a full preview, preserves the direction, and leaves dossier, facts, issues, and recommendations unchanged.
- Frontend typecheck passed.
- Frontend production build passed with an isolated build directory.
- git diff --check passed for repair files.
- graphify update . completed after application/test edits: 15,141 nodes, 29,776 edges, 1,542 communities. Five zero-node JSON warnings did not require changes.

Frontend commands, from /Users/bharris/Programs/counsel-os-mvp/frontend:

    npm run typecheck
    PHASE2_DIST_DIR=.next-dossier-research-build npm run build

Generated configuration changes were restored to their pre-run state. /Users/bharris/Programs/counsel-os-mvp/frontend/tsconfig.json has no Git diff. The pre-existing dirty /Users/bharris/Programs/counsel-os-mvp/frontend/next-env.d.ts currently imports ./.next/dev/types/routes.d.ts and ./.next/dev/types/root-params.d.ts. Do not restore the older handoff's build-directory imports or reset this file to HEAD.

Browser verification used:
 /Users/bharris/Programs/counsel-os-mvp/backend/tests/manual/serve_dossier_generation.py

An isolated temporary vault and deterministic writer ran on backend port 8199 and frontend port 3199. No paid model or Harbor records were used.

Observed in the actual UI:

- “Genrate a dossier” returned the complete dossier, the exact saved question, and employment, customer privacy, and trademark workstreams.
- The saved revision link opened the correct read-only document.
- “Genrate a dossier without saving.” returned a full preview and explicit no-save status.
- The fixture dossier's SHA-256 stayed unchanged before/after preview.
- Saved output and preview remained after reload. Input was enabled and no timeout appeared.
- The temporary servers shut down cleanly and the test tab was closed.

A real Harbor workspace read also returned HTTP 200 during repair verification. The whole historical A-G browser acceptance workflow was not repeated. These results prove tested application behavior, not the legal quality of a new real-model Harbor dossier.

Do not rerun a 16-minute suite merely to acknowledge this snapshot. Run checks proportionate to new changes or changed live evidence.

## 7. Deferred dossier quality work and source materials

The earlier quality review found that an ordinary-chat draft was a better overview, but not yet a better working dossier. It restored breadth and readability but lost licensing depth, source links, coverage states, and the owner/timing/evidence/fallback work table.

That reviewed run was:
 /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260911-30a30c.md

Its frozen context is:
 /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/context/RUN-20260911-30a30c.md

Historical findings from that run:

- Exact request: Genrate a dossier
- Provider/model/reasoning: codex / gpt-5.6-sol / medium
- Applied skill: matter-paths, not dossier-generation
- No frozen dossier_inputs or dossier-generation result
- Scope: scenario
- Hypothetical path: SCN-406906c91ab0aba4313b54a6, assuming a partner bank held customer funds
- Mainline path: SCN-490c71c86d9c658974321c1e, the Mosaic-operated migration

The typo-routing cause is now fixed. That old response still cannot establish the dedicated skill's output quality. The historical path IDs do not prove the current selected scope. Check live records before any future generation, and never switch to mainline merely to force a save.

Comparison sources:

- Saved revision associated with the unchanged canonical dossier: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-c993ab2326efd727cc3d.md
- Earlier licensing-heavy dossier: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-4cc39b05492c9b214333.md
- Saved licensing research: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md
- Its research run: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/research/runs/RUN-20260911-d08e84.md
- Original saved conversation: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
- Another saved conversation: /Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/CONV-20260911-20d4ea.md
- User's old-dossier attachment, confirmed to exist: /Users/bharris/.codex/attachments/1d2e5aae-bda0-4b15-b326-947e2b520f82/pasted-text.txt

Read run metadata before assigning a run to a conversation. New live activity may exist after the reviewed run.

The original Opus review praised more honest sourcing and improved licensing analysis. It raised lost non-licensing coverage, contradictory appended positions, reported facts treated as assumptions, an Unknown next-action field despite an action table, weak authority selection, missing substantive research, and vague dates.

The desired direction is new breadth/readability plus earlier depth, source links, coverage state, and concrete work. CRAC should organize substance, not make it thinner. Do not claim all those quality concerns or canonical issue-map/coverage differences are solved.

The historical licensing packet retrieved four sources: a CSBS model act, a New York DFS page, an OCC alert, and a vendor page. Its saved status had zero reviewed or verified passages. Do not call the older dossier verified legal analysis. The Opus review's legal suggestions remain unverified research leads. Do not invent authorities, owners, dates, permissions, or legal conclusions to fill gaps.

Earlier feature work used two real-model previews on a temporary fictional illustration-studio matter. Those were limited structure/wording checks, not a Harbor comparison or broad legal-quality benchmark. The latest repairs used a test writer for browser generation and did not start new Harbor research or regenerate its dossier.

## 8. Next action

1. Read this snapshot and applicable instructions. Confirm the source checkout and any live state relevant to a new request.
2. If the user only pastes this handoff, acknowledge that the repair is complete. No further implementation is pending. Do not repeat completed work.
3. If the user asks to assess dossier quality, first inspect the saved sources and current scope. A read-only review does not authorize generation.
4. If the user asks for a new preview, use the actual shared dossier action and preserve the selected scope and source restrictions. Verify its applied skill, frozen inputs, full response, and preview status. Then compare it with the earlier dossier for breadth, depth, support, and practical next steps.
5. Regenerate or replace Harbor's saved dossier only within an explicit request that authorizes that action. A hypothetical preview is not a saved current-matter update.
6. If a new failure is reported, reproduce it against the current files, make the smallest correct repair, and verify it in proportion to risk. Do not reclassify the resolved failures as still open.

## 9. Continuity limits and historical references

This is a checkpoint, not a fresh audit of every changed file or a legal research report. The full tests were completed before this handoff; only small read-only state checks were run to prepare it.

Earlier context was available through a conversation summary and this user-supplied snapshot:
 /Users/bharris/.codex/attachments/7d272a7a-1a37-4800-80d9-1c8525df72ff/pasted-text.txt

A durable earlier handoff is:
 /Users/bharris/Programs/counsel-os-mvp/handoffs/dossier-generation-2026-09-11-2359-01a091d3.md

Those earlier materials are useful for historical detail. Their pending-bug, old-test-count, old-PID, and old-TypeScript-import statements are superseded by this snapshot.

Local attachments, untracked files, ignored test outputs, and temporary evidence do not transfer automatically to another environment. Provider credentials were not copied; use the existing configured settings and environment if a later authorized task needs them.

The user can change records, providers, skills, servers, or the branch after this checkpoint. Resolve differences from current saved files and live evidence. Keep settled decisions, preserve useful output, and do not expand authorization.
