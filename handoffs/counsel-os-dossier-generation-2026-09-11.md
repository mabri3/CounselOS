# Counsel OS dossier generation — continuation handoff

Continue from this snapshot. Read the current instructions in your environment. Verify live state before changing anything. Do not ask the user to repeat settled decisions. New user instructions take precedence.

## Goal and authorization

The user requested a manual handoff with `$continue-in-new-task`. Do not create a new Codex task or archive the source task. No new implementation or Harbor dossier regeneration is authorized by this snapshot.

The earlier approved work implemented an editable, general-purpose **Dossier generation** skill. The latest substantive review asked whether the last Harbor dossier run was as good as the previous dossier. That review is complete. It found a natural-language routing bug and quality tradeoffs, but the user has not yet authorized a fix.

The likely next task, only if explicitly requested, is to fix intent routing and then assess dossier quality through the actual shared generation action.

## Repository and live state

- Repository: `/Users/bharris/Programs/counsel-os-mvp`
- Branch: `main`
- HEAD: `cbac9f39dffd2ffa24f5ae123e332e929a8df770`
- Active vault: `/Users/bharris/Programs/counsel-os-mvp/Mosaic Relay UX Experiment 2026-09-03 R3`
- Frontend: `http://127.0.0.1:3000`
- Backend health: `http://127.0.0.1:8000/api/health` — currently HTTP 200
- Frontend and backend development processes are currently running. PIDs may change.
- Worktree has extensive pre-existing and current uncommitted changes (212 status entries at the handoff check). Preserve them. Do not reset, blanket-revert, or stage everything.

Before app changes, read:

1. `docs/PRD.md`
2. `CODEX_HANDOFF.md`
3. Applicable current project instructions and `current.md`

For codebase questions, run `graphify query "..."` first when `graphify-out/graph.json` exists. After application changes, run `graphify update .`.

## Settled product decisions

- Keep Dossier generation as a separate editable skill.
- Keep Answer, Research, and Draft as separate skills.
- A plain-language dossier request must return the full dossier in chat, not only a plan or link.
- Programmatic update triggers may call the same shared generation action.
- Keep record protection, source limits, scope, and edit-conflict checks in code. Keep writing guidance in the editable skill.
- Organize the dossier around the whole matter and its issues. Narrow research must not erase other workstreams.
- Use conclusion-first CRAC where useful; CRAC/CREAC/IRAC are writing structures, not mandatory headings everywhere.
- Preserve the exact saved decision question.
- Distinguish reported facts, assumptions, proposed advice, accepted advice, and recorded decisions.
- Keep audit history, but do not show old positions as competing current advice.
- Do not add legal-perfection gates, verifier agents, votes, confidence thresholds, generic disclaimers, or refusal behavior.
- Missing citations or failed tools must not erase useful output. Label source and support status honestly.
- Markdown is authoritative; SQLite is a disposable index. Keep file operations inside `VAULT_PATH`.
- Use `apply_patch` for edits. Preserve unrelated changes.

## Completed implementation

Important files:

- Starter skill: `backend/app/blank_vault_template/00_System/skills/dossier-generation.md`
- Installed live skill: `Mosaic Relay UX Experiment 2026-09-03 R3/00_System/skills/dossier-generation.md`
- Composition: `backend/app/skills/dossier.py`
- Context: `backend/app/services/dossier_generation_context.py`
- Writer: `backend/app/services/dossier_generation.py`
- Chat response: `backend/app/services/dossier_generation_chat.py`
- Narrative: `docs/living-dossier.md`

The skill uses `Uses: answer`, captures up to four direct supporting skills, and does not execute Markdown code. The writer makes one bounded model call without tools. It returns the full Markdown response and saves a revision when publication is allowed. Preview does not save or consume pending work. Publication rechecks input basis and dossier hash under existing locks. Failures preserve useful generated text.

Integration includes skill installation and lookup, explicit chat generation, automatic refresh markers, frozen context, scope handling, edit protection, research publication, workspace/file refresh, dispatch-budget preservation, deterministic mock output, and hiding exact issue markers in rendering while preserving source Markdown.

Earlier research continuity work is in:

- `backend/app/services/dossier_research.py`
- `backend/app/services/research_publication.py`
- `backend/scripts/refresh_dossier_research.py`
- `backend/tests/test_dossier_research_continuity.py`

Do not confuse the earlier Harbor dossier refresh from saved research with the later dedicated-skill run.

## Latest routing bug

Reviewed run:

- Run: `RUN-20260911-30a30c`
- Matter: `MAT-20260909-d89ad8`
- Exact request: `Genrate a dossier`
- Provider/model: `codex` / `gpt-5.6-sol`, medium reasoning
- Applied skill: only `matter-paths`; `dossier-generation` was not applied
- Frozen context: no `dossier_inputs`
- Scope: hypothetical scenario `SCN-406906c91ab0aba4313b54a6`; mainline is `SCN-490c71c86d9c658974321c1e`

Cause: `backend/app/services/dossier_generation.py` has an anchored exact-verb regular expression. `requested()` recognizes the exact expression or `/dossier-generation`, so the typo bypasses the shared action and ordinary chat answers under the inherited hypothetical path.

Read-only reproduction:

```python
requested(ChatRequest(message="Genrate a dossier"))  # False
requested(ChatRequest(message="Generate a dossier"))  # True
```

If authorized to fix it, first add a failing regression test. Use a general intent-routing solution. Do not hardcode Harbor or only add this one misspelling. Preserve negative requests, discussion about generation, skill-edit requests, source restrictions, and hypothetical scope. A correctly spelled request on a non-mainline path should remain a preview; do not silently switch scope or save it.

Prove the route with applied skill, frozen dossier inputs, trace, full response, and correct save-versus-preview behavior.

## Latest quality review

The latest draft improved breadth and readability but was not yet a better working dossier.

It restored identity records, alerts and suspicious activity reports, monitoring, communications, and the bonus. It had a clearer opening and stated the hypothetical scope.

It lost useful depth: detailed licensing reasoning and transition conditions, owner/timing/evidence/fallback work table, saved source links, coverage states, and the intended rule/application structure.

Target, only if later authorized: combine the new breadth and readability with the earlier depth, source links, coverage state, and concrete work plan. Do not invent legal support, owners, dates, or conclusions. Claims from the prior review remain research leads, not verified findings.

## Evidence files

- Latest run: `Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/runs/RUN-20260911-30a30c.md`
- Frozen context: `Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/conversations/context/RUN-20260911-30a30c.md`
- Canonical dossier: `Mosaic Relay UX Experiment 2026-09-03 R3/03_Matters/harbor-2-d89ad8/dossier.md`
- Current revision: `.../dossier-revisions/DOS-c993ab2326efd727cc3d.md`
- Older comparison: `.../dossier-revisions/DOS-4cc39b05492c9b214333.md`
- Licensing research: `.../research/RES-20260911-0a5f07.md`
- Research run: `.../research/runs/RUN-20260911-d08e84.md`
- Original conversation: `.../conversations/CONV-20260909-5299cf.md`
- Earlier pasted dossier: `/Users/bharris/.codex/attachments/1d2e5aae-bda0-4b15-b326-947e2b520f82/pasted-text.txt`

The four retrieved research sources were a CSBS model act, New York DFS licensing page, OCC preemption alert, and Fenergo vendor page. Zero passages were reviewed or verified. Do not call the older dossier verified legal analysis.

## Verification state

Earlier feature verification is documented in the snapshot source. Do not claim a fully green backend suite.

- Affected-subsystem run: 369 passed.
- Narrow final run: 48 passed.
- Full earlier run: 1,522 passed and 8 failed; five baseline failures remained outside the feature and three old call-count expectations were repaired in focused work.
- Frontend typecheck, isolated production build, citation/Markdown/chat checks passed.
- `git diff --check` passed.
- `graphify update .` completed after earlier application changes.

The five known baseline failures were two source-serialization expectations involving missing `collection_enabled`, and three existing scenario-research tool expectations. Do not expand scope to fix them unless asked.

## Next action

Wait for explicit user direction. If the user authorizes the routing fix, inspect current files and live state, reproduce the typo failure, add the smallest general regression-tested fix, verify end to end, run focused tests, and update the graph. Regenerate or save the Harbor dossier only with appropriate scope direction. A hypothetical preview is not a current-matter update.

Use this handoff as a snapshot. Read applicable instructions in the receiving task, verify live state, and continue only the authorized work. Do not assume uncommitted changes, local attachments, or temporary logs transfer to another environment.
