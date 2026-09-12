# Living dossier

## Business-question-led generation — September 12, 2026

The controlling business question is the dossier's purpose. The original request
and any explicit lawyer reframe establish that question. The latest chat question
can guide attention, but cannot silently replace the matter's scope. The writer
must also challenge the business premise when the records support a different
answer. Detail follows the importance of the issue to that decision, not an equal
length per issue or a fixed depth-versus-breadth quota.

Preparation and writing capture all eligible user and assistant messages across
the matter's saved conversations. Message identity, date, order, speaker and
submitted hypothetical scope stay attached. The current records, original request,
saved text documents, working notes, alternatives and per-issue research are also
available. Source-limited requests keep their existing filtered context; they do
not regain excluded history through the new reader.

The existing writer receives a bounded inventory and one read-only tool,
`read_dossier_record`. It can search the frozen records or page through exact
passages beyond the opening excerpts. It cannot read a model-selected filesystem
path, search the web, change a fact or record a decision. Read receipts record
successful and failed requests. Availability is not a claim that a record was read.

The prior dossier's 6,000-character opening no longer seeds the next draft. The
full prior document remains available for unique lawyer work and comparison, as
fallible analysis. Earlier assistant answers are likewise not sources of fact or
legal authority. The writer must reconcile later explicit corrections, keep
hypotheticals separate, and cover material issues missing from the saved issue
list. It does not silently add those issues to the recorded list.

The read-and-write loop shares one five-minute allowance. It allows at most eight
record reads and 48,000 bytes of additional evidence, with time reserved for an
answer-only attempt. Failed reads reduce available context; they do not block a
useful answer. An unfinished final write retains any useful partial output with
an explicit failure label. Captured source edits require review before replacement.
New research packets created by the same research-first run do not falsely count
as an intervening lawyer edit; edits to an existing captured packet still do.

Ordinary **Generate Dossier** still offers three editable priorities and the
top-three/all-issues research choice. **Use saved material now** still writes
without new research. Both paths use the business question as their anchor.

For verification and limits, see
`output/dossier-quality/business-question-assessment.md`.

## Background writing — September 12, 2026

Dossier planning and writing have a five-minute model-call limit, configured by
`DOSSIER_TIMEOUT_SECONDS` (default 300). Each configured dossier call owns a separate
provider connection, so its cancellation cannot stop an ordinary chat question.
The enclosing chat run allows time for model cleanup and publication.

Both chat screens show dossier runs in a separate background progress card. The
lawyer can ask questions while writing continues. Reload restores progress; the
completed reply refreshes the saved conversation without clearing a newer message
draft. Stop and Retry target the dossier run only. A writer timeout is reported as
a failed run with useful earlier text retained, rather than as a successful preview.

An explicit general dossier request can save the dossier while an alternative is
selected. “Add that hypothetical to the dossier” uses the saved matter record and
puts each alternative in “Alternatives considered.” Its assumptions, findings,
remaining issues, and next action stay separate from reported facts and the current
direction. It does not adopt the alternative. Explicit preview and no-save requests
still return only a preview.

The writer receives saved alternatives and their own working notes. Repeated
assistant drafts appear as compact history entries with full text available on
request, not as repeated primary instructions. Each issue gets one current answer;
full saved research remains available under that issue. Initial analysis is clearly
distinguished from completed research. The writing instructions require material
date and count conflicts to be stated, with their effect and the fact needed to
resolve them.

Chat submission resolves only missing document identities. General document and
claim discovery do not decode the conversation run archive. This keeps growing
audit records out of the work needed to start a job or show the current matter.
The chat display also omits frozen execution inputs from its response; the full
inputs remain in the saved transcript. Local HTTP requests have a separate
60-second read/acceptance limit, so a large matter does not lose an accepted job
to the former 15-second browser limit. This is not the five-minute writer limit.
An explicit read-only question is saved in chat, but cannot automatically replace
an alternative's analysis. This prevents a no-change question from invalidating
the inputs of a concurrent dossier. Real input changes still require review.

The matter documents hold memory. The dossier synthesizes that memory into a useful current view. Conversation remains the record of the discussion, including side discussions and abandoned ideas.

## Update rules

- Substantive current-matter discussion that establishes or changes a working theory uses the existing `save_work_product` tool with `kind=recommendation`. No separate request to save is needed. The built-in counsel contract tells the agent to read the saved position, synthesize the whole current view once, and exclude hypothetical or unrelated threads. An explicit request not to update records takes priority.
- `recommendations.md` holds that synthesis: leading theory, live alternatives, facts and assumptions, questions that could change the view, support limits, and reasons for material changes. Optional `next_action` records one suggested step with the recommendation version.
- The first recommendation becomes the working record. Later agent updates follow the existing proposal rule. The dossier shows the proposal beside the saved position with an explicit label. Acceptance and direct lawyer edits remain separate. Recommendations never record decisions, approve work, or send documents.
- Required work, explicit matter actions, and response lifecycle controls take priority over a suggested step. Where these do not supply an action, the current recommendation's step replaces the generic stage text.
- Task creation, completion, assignment, priority changes, and stage or lifecycle actions refresh the dossier's work-state sections. Existing research and work-product saves also use this projection.
- Work-product links include the current draft, current final, and other saved drafts. Unkept previews and historical/proposed versions are excluded. No saved document means no link.
- Dossier hashes continue to protect lawyer edits. A conflicting projection remains a separate revision. A failed projection must not undo a successfully saved task or recommendation.

Selection of material changes remains a model judgment, made through the existing
typed save tools. The deterministic saved-record projection remains an immediate
fallback. Since September 11, the shared Dossier generation action follows a
committed update with one bounded writer run. It does not run new research or
rebuild the dossier when someone merely opens it. See the editable-skill section
below.

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

## Scoped research continuity — 2026-09-11

Research publication now composes a workstream view from saved issue IDs. It does
not use legal-area keywords or a list of payment-law rules. The existing
recommendation metadata stores each researched issue's position, next action,
input basis, source records and packet link. A later update replaces only its
addressed issues. Other researched issues retain their positions and links.

The dossier shows Research added, Prior research retained, No research update
saved, or Needs review — inputs changed. These describe research coverage, not
a legal conclusion or permission to proceed. Unlinked research remains a useful
separate answer. Old narrative-only positions are retained; the publisher does
not guess which issue an old paragraph belongs to. A narrow result also cannot
replace the whole problem breakdown, matter summary or open-question list.
Broad research can fill an empty orientation. Replacing a populated orientation
requires explicit coverage of every saved issue.

Missing optional synthesis fields no longer invalidate otherwise valid fields.
The next action can come from synthesis, the saved problem breakdown, an explicit
Next action heading, or a single issue update. The dossier labels a proposal's
action Proposed. Accepting the recommendation removes the proposal label. A new
projection is saved when acceptance or current inputs change; an identical
publication retry still reuses its revision.

Reported facts and business plans remain separate from generated assumptions.
Earlier unreconciled assumptions show their recorded origin and date behind an
expandable section. They do not override later reported facts. Existing
provenance checks still control retirement of generated assumptions. Earlier
position text and per-issue source lists also use plain Markdown disclosures.
The browser renders these without enabling arbitrary HTML.

The main-agent instructions distinguish matter-wide coverage from focused work,
primary authority from background, and known event dates from proposed work dates
and legal deadlines. After a provider failure, the existing research loop may
continue once with tools if its remaining budget permits. Another failure still
gets the existing final answer-only attempt. No extra agent, legal verifier,
calendar engine or new research budget is added.

`backend/scripts/refresh_dossier_research.py` refreshes one legacy pending proposal
from its saved packet. It uses the configured vault, checks its matter and input
basis, and preserves the usual dossier-edit protection. It does not call a model,
accept a recommendation, create a fact or record a decision. Run it from backend
with `.venv/bin/python -m scripts.refresh_dossier_research MATTER-ID` and the intended
`VAULT_PATH`. It does nothing for an already refreshed proposal.

Verification: 62 focused backend checks passed after the fixes. Frontend type
checking, the production build and the Markdown disclosure checks passed.
An isolated browser fixture covered employment, privacy and trademark workstreams,
retained packet links, collapsed history and assumptions, and a saved rich-text
edit. No browser console errors were observed there. The full backend run found
1,513 passing checks and six failures. Its empty-orientation regression was fixed
and included in the 62 passing checks. Five other failures remain in the existing
source-choice serialization and scenario-research tool expectations; those tests
and behaviors were not changed here. The full suite was not rerun after that fix.

The current Harbor proposal and dossier were refreshed from the saved packet.
No fresh legal research was run. The four retrieved sources are still labeled as
not passage-reviewed. Older unmapped analysis remains in the dated history.
The live browser confirmed all five workstream rows, the saved next action and
collapsed history. A reload during backend development timed out; Refresh matter
loaded the updated dossier once the backend was stable. The existing timeout
message remained visible in that temporary test tab after recovery.

## Editable Dossier generation — 2026-09-11

Open **Skills → Dossier generation** in experimental chat to edit the instructions.
The shared file is `00_System/skills/dossier-generation.md` in the active vault.
Startup installs the starter only if the file is absent. Existing custom text is
not replaced. The standard Skills page also exposes this Markdown-backed skill.

In a matter, send **Generate a dossier** or **/dossier-generation**. The response
contains the full dossier and a saved-revision link, not just a plan or link.
Ask for a preview or say “without saving” to keep it out of the current dossier.
Conversation history still records a chat request and its reply.

Command detection accepts a missing, repeated, or swapped letter in the action
word, such as **Genrate a dossier**. It does not treat past-tense reports,
negated instructions, or skill-edit requests as generation commands. The same
preview and hypothetical-path rules apply after correcting a command typo.

The starter uses a current position, the exact saved decision question, one
issue list, and ranked next actions. Each issue defaults to compact CRAC:
Current answer, Rule and support, Application, and Next step. CREAC or IRAC can
be used when useful. These are editable writing rules, not hardcoded legal-area
templates. Facts supplied by the requester remain reported facts. They are not
automatically turned into model assumptions. Work status, proposed advice,
accepted working views, and recorded decisions remain distinct.

`Uses: answer` loads supporting writing guidance. The list can name up to four
direct supporting skills. It does not execute Markdown, recurse through skills,
or call their tools. Dossier-specific instructions control the document format.
Answer, Research, Draft, and other skills remain independently usable.

Manual and automatic paths call `services/dossier_generation.generate_dossier`.
Existing task, recommendation, work-product, research-publication, and matter
action updates still commit their records first. Their existing dossier
projection marks the matter for generation. The request or existing durable run
then awaits the shared action, once per latest update in that operation. The
markers are not a separate queue. If execution stops, the saved projection remains
usable; opening the matter does not start a model call.

Chat and research use their selected provider and submitted skill snapshot.
Ordinary record routes capture the skill when the request starts. Dossier
generation captures current saved inputs, releases the record lock while the
model works, and rechecks input versions before saving. A changed input, changed
dossier, or lawyer edit leaves the generated text as a review revision. This also
applies to first-time dossier creation. Ordinary editor saves share that lock.
Record routes finish generation before sending the response, so the next screen
refresh sees the saved result.

Previews and source-limited or scenario chats do not trigger an unrestricted
automatic writer. Explicit source-limited dossier requests use the filtered
context and return a preview. One operation cannot consume another operation's
pending update. A preview cannot consume pending work.

Generated revisions retain the exact instruction text, supporting-skill revisions,
provider selection, input basis, and dispatch-size record. Missing issue sections
retain their saved issue material with a visible explanation. Internal issue
markers stay in Markdown but are hidden in the rendered document, except in code
examples. They are not a legal-quality gate.

Bold document headings are normalized before publication. Headings inside the
embedded recommendation, collapsed history, or a code block stay embedded. They
must not become the dossier's decision question or open-question fields.

Model failure, an unavailable skill, or an oversized required input retains the
available saved answer and reports the failure. Required matter input is never
dropped as if it were old conversation. A checkpoint failure does not erase new
text. If publication fails, chat keeps the text, durable runs keep the result, and
the service also attempts to save a recovery event. No new facts, accepted
recommendations, or decisions are created by dossier generation.

### Verification

The isolated browser check edited the skill, generated a complete chat response,
reloaded the saved conversation, and added a task through the real API. The
automatic dossier used the same edited title and kept employment, privacy, and
trademark workstreams plus the new task. This fixture uses a deterministic writer
to test application behavior, not legal quality. The actual Harbor matter was
not used for these mutations.

Regression tests cover chat and automatic invocation, frozen instructions,
source limits, previews, provider failures, record races, first creation, missing
issues, mandatory input size, recovery text, and response timing. Frontend type
checking and an isolated production build passed. The full backend run found
1,522 passing tests and eight failures. Three were old call-count expectations
that needed to distinguish the added dossier call; their focused rerun passed.
Five existing failures concern source-choice serialization and scenario-research
tool expectations. The later affected-subsystem run passed 369 checks, including
the record-lock, scope, and response-timing fixes. The full suite was not rerun.

A separate configured-model preview used a temporary illustration-studio matter.
It followed the edited title and per-issue structure, kept all three issues, and
treated the supplied signed agreements as reported facts. The first result
overstated what missing records establish. A focused instruction change and
repeat test distinguished missing saved permission from permission not existing.
This was a limited writing check, not a test of legal correctness. Bold-only
canonical headings are also normalized before scope preservation so they do not
create duplicate decision questions or restore an old summary. All 48 dossier
checks passed after that final change. The post-cleanup frontend type check also
passed. The active frontend and backend returned HTTP 200; temporary test servers
were stopped.

Repeat the browser fixture with
`cd backend && .venv/bin/python -m tests.manual.serve_dossier_generation`, and run
the frontend on port 3199 with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8199/api`
and a separate `PHASE2_DIST_DIR`. This keeps the active vault out of the test.

## Research-first dossier generation — 2026-09-11

An unrestricted manual dossier request now starts with one saved setup card. The
card shows three editable priorities, their mapped issues, the first three issue
choices, All-five scope, and the normal saved/external/other-matter source fields.
Nothing starts until the lawyer selects Start. **Use saved material now** keeps
the direct writer path. **Generate dossier without saving** returns a preview and
does not create a parent request or saved revision.

Started work runs as one durable parent with normal research children. The first
three selected issues can publish a useful first dossier while later selected
issues continue. Each issue keeps its own answer and source snapshot. The card
shows plain state words, source counts, exact first/latest revision links, Stop,
Resume, and failed-item retry where applicable. Active work polls near every two
seconds. Saved cards first hydrate their current parent state, so reload and
same-vault restart do not return a stopped or completed card to the setup form.

The parent owns normal child recovery and publication. Startup exposes that
ownership before ordinary research recovery runs. Stop is durable. Resume uses
the saved children and checkpoint receipts. Completed external/model work,
revisions, recommendations, and completion messages are not repeated. Automatic
dossier refresh still uses saved material only and never starts new research.

The isolated five-issue browser fixture proved All-five first/later publication,
real citation clicks, preserved draft/context/editor state, Stop across backend
restart, Resume, standard and experimental chat, saved-only generation, preview,
and reload. Deterministic boundary calls prove application flow, not legal answer
quality. Exact artifacts and the safety note are in
`output/dossier-research-first/browser-results.md`.

## General dossier quality — 2026-09-12

The writer receives the saved passages, locators, source versions, and support
limits for every researched issue. Large raw fetch pages are excluded from the
writing input. A source used by several issues keeps each selected passage in
the reference catalog. Source versions remain separate. For a known saved
external-source link, the saved source record controls the reading label; a
model-written caption cannot rename it or upgrade its support state.

The current direction's working note is available as fallible analysis, not as
reported facts. Alternatives keep their own notes and assumptions. A refresh
must derive its current conclusion from the current records. The prior draft
preserves continuity but is not evidence of approval or a wording template.

The editable dossier instructions require operative conditions, application to
the facts, material exceptions, and the effect of missing information. The work
plan gives a deliverable, the result needed, the dependent activity, and a
fallback. Recorded assignments and deadlines remain distinct from proposed
roles and working targets. These instructions are general. They contain no
matter-specific legal rules.

The writer supplies the current synthesis. The application adds one full saved
research disclosure per issue, labeled as a historical snapshot that may predate
later facts. Internal issue, alternative, and retention markers remain in the
Markdown source but are hidden in the reader. Code examples are not changed.
The experimental document tabs use one horizontally scrollable row. Long source
titles no longer build a tall sticky header over the document's links.

Repeat the paid writing check with:

```bash
cd backend
.venv/bin/python -m tests.manual.check_dossier_quality --provider codex --model gpt-5.6-sol --effort medium
```

This creates a new isolated vault with two unrelated fictional agreement
matters. Read the saved dossiers to assess the writing. The helper does not
assign an automatic grade or open the active vault. It checks that generation
does not change the facts, issues, recommendations, or selected direction.
