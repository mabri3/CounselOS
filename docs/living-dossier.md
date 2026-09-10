# Living dossier

The matter documents hold memory. The dossier synthesizes that memory into a useful current view. Conversation remains the record of the discussion, including side discussions and abandoned ideas.

## Update rules

- Substantive current-matter discussion that establishes or changes a working theory uses the existing `save_work_product` tool with `kind=recommendation`. No separate request to save is needed. The built-in counsel contract tells the agent to read the saved position, synthesize the whole current view once, and exclude hypothetical or unrelated threads. An explicit request not to update records takes priority.
- `recommendations.md` holds that synthesis: leading theory, live alternatives, facts and assumptions, questions that could change the view, support limits, and reasons for material changes. Optional `next_action` records one suggested step with the recommendation version.
- The first recommendation becomes the working record. Later agent updates follow the existing proposal rule. The dossier shows the proposal beside the saved position with an explicit label. Acceptance and direct lawyer edits remain separate. Recommendations never record decisions, approve work, or send documents.
- Required work, explicit matter actions, and response lifecycle controls take priority over a suggested step. Where these do not supply an action, the current recommendation's step replaces the generic stage text.
- Task creation, completion, assignment, priority changes, and stage or lifecycle actions refresh the dossier's work-state sections. Existing research and work-product saves also use this projection.
- Work-product links include the current draft, current final, and other saved drafts. Unkept previews and historical/proposed versions are excluded. No saved document means no link.
- Dossier hashes continue to protect lawyer edits. A conflicting projection remains a separate revision. A failed projection must not undo a successfully saved task or recommendation.

This uses the current model turn and existing typed save tool. It does not add another agent or model call, infer advice by matching words in chat, or rebuild the dossier from every message. Selection of material changes remains a model judgment; the saved-record projection is deterministic.

## Verification on September 9, 2026

- Full backend run: 1,262 passed before the final narrow heading and draft-preservation adjustments. The subsequent affected-subsystem run passed 95 tests. After preserving the suggested step through direct edits, all 23 recommendation and living-dossier checks passed.
- Frontend type check and isolated production build passed. Existing frontend edits were preserved.
- The configured provider saved Harbor's working view through chat run `RUN-20260909-944e72`. One unrelated attempted workspace action failed; the recommendation save succeeded. The generated result contained an obsolete date, which was removed in a new generated recommendation version. The earlier version and transcript remain available.
- Browser inspection confirmed the saved theory, alternatives, support limits, one next-action section, and the accurate absence of work-product links. No Harbor draft or decision was created.
- Regression coverage is in `backend/tests/test_living_dossier.py`: chat-to-dossier save with the dossier selected, visible proposals, task/stage updates, multiple drafts and excluded previews, lawyer edit preservation, reserved headings, and updating the working view while preserving a draft.
- The code graph update completed. Graphify skipped its optional HTML view because both the full graph and grouped view exceeded its size limit.

## Research publication

Version-2 research first saves the main agent's useful prose and optional
`research-synthesis` structure in a packet. Bad optional structure does not erase
the prose. Publication then updates the existing recommendation, dossier and
originating conversation, with separate receipts for each effect.

When a saved position already exists, research creates a proposed recommendation.
The dossier presents that latest proposal before the dated earlier position.
It does not record a decision. Generated assumptions can be retired by their
real saved IDs and provenance. A legal conclusion cannot create a reported
business fact. Unreconciled assumptions stay explicitly separate from assumptions
relied on by the new answer.

Question or fact changes make the result historical. Intervening advice changes
make it review-only. Lawyer edits remain intact, with a generated dossier revision
available for review. A stable publication key reuses the same revision and
conversation message after interruption. Publication retry uses the saved packet;
it does not need a new search or model answer.

The originating conversation receives the answer and links without another user
message. The UI refreshes that conversation after completion while preserving a
newer draft, context choice and open document. Named saved-file links survive
output cleanup. Retrieved copies and publication revisions are read-only.

A short plan to investigate is not a completed answer. The shared loop makes one
bounded request to continue the work. If that still yields only a plan, publication
keeps the partial output visible and does not adopt it as advice. This is an
execution-completeness check, not a legal-accuracy gate.

## Problem breakdown

A substantive intake, matter conversation, or research answer can save an optional problem breakdown. It holds the business objective, proposed method, linked activities and questions, material coverage notes, alternatives and changes from an earlier breakdown. The main agent produces it in the existing answer loop.

The exact generated version lives in `problem_analysis` frontmatter on its saved inquiry or research packet. `workspace.md` stores only the current reference. A changed fact or selected source shows Needs review. Late or scoped results stay historical. The shared panel offers discussion and reassessment through the existing conversation and read-only access to the earlier version.

This is generated analysis. It does not create reported facts, change the controlling business question, accept a recommendation, record a decision or overwrite lawyer prose. Invalid optional structure leaves the useful answer and prior valid breakdown available.
