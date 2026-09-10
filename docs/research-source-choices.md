# Research source choices

## Native search — September 9, 2026

In experimental chat, choose the chat model and effort, then ask for external
research. `run_research` presents a source card without starting a search. The
card saves the exact provider, model and effort from that chat turn. Changing
the composer model afterward does not change an existing proposal. Start
research confirms that proposal, and retries keep its selection.

The new card defaults to Native search first. Codex uses live native search;
Antigravity uses its web tools; OpenCode Go uses the installed OpenCode CLI's
websearch/webfetch tools. OpenAI endpoints use Responses web_search with the
selected model and effort. Unknown compatible endpoints are not presumed to
support this contract. Unsupported models and provider account restrictions
are failures, not reasons to silently choose another model.

Native discovery receives only the approved public query. URLs returned by a
model remain unverified leads until page text is retrieved. Public pages are
read with the existing DNS-pinned HTTPS fetcher. Playwright renders pages when
direct reading fails or returns too little text; its requests also pass through
the checked fetcher. Browser sessions are disposable and use no saved login.

Allow Firecrawl fallback is off by default. When selected, it permits page
scraping after direct/browser reading fails, and search after native discovery
or source retrieval fails. Successful native retrieval does not call Firecrawl.
Configured search services remain an explicit alternative. Neither native
search nor existing subscriptions are represented as free.

The completed chat card shows the saved model and retrieval steps. Packets
retain source excerpts, source copies, search choices and native generated
analysis. Partial output remains available if a later step fails. No source
retrieval is labelled successful solely because a model supplied a URL.

Playwright and Chromium are installed by `scripts/setup.sh`. On an existing
installation, install backend requirements and run
`backend/.venv/bin/python -m playwright install chromium`.

Verification: `backend/tests/test_native_research.py` checks native CLI arguments,
the OpenAI Responses contract, source extraction, consent-controlled fallback,
Playwright rendering, and model/effort propagation into saved research. The
isolated browser fixture is `output/research-scope/serve_native_fixture.py`.
Live public discovery succeeded with Codex Sol, Antigravity Gemini and OpenCode
Go MiniMax. OpenCode Go DeepSeek returned a regional-hosting opt-in requirement;
no account setting was changed. OpenAI API transport was tested with simulated
responses, not a paid live request.

Final checks for this change: the full backend run passed 1,297 tests and found
two old exact-shape assertions that omitted the new scope fields. Those assertions
now check the new defaults explicitly; all 24 native-search and matter-action
tests pass on rerun, including two additional page-fallback consent tests.
TypeScript and the production build pass. The isolated browser flow confirms
the saved model, explicit fallback choice, completed packet, and reload persistence.
Polaris remains available through Configured search services; its existing
research adapter is unchanged. Unknown compatible endpoints do not gain native
search merely because they accept an OpenAI-style request.

Research uses the current matter by default. Chat and direct research controls
offer two independent options before starting a requested run:

- External sources: show selected providers and a possible-cost notice. The
  notice covers fallback calls and retries. No price is invented.
- Other active matters: show a sensitive-information notice. Saved material
  from other matters can become part of the new research packet.

Both options can be selected, or neither. Explicit wording such as “search
externally” or “search other matters” preselects the matching chat option.
It does not start research. Start research records the choice for that request.
Cancel leaves the matter and queue unchanged. Automatic intake research and
legacy API calls without a scope use the current matter only.

Chat can propose a short public query. The user reviews or edits it before an
external search. Direct controls ask for this query when external search is
selected. The existing outbound privacy check still runs. Consent does not
permit sending private matter identifiers to search providers. Analysis uses
the existing configured model; normal model usage can also have costs.

The research run and packet save `search_scope`. The run also saves the notices
shown and the named provider sequence. Adding or changing providers requires a
new choice for new work; queued work uses its saved list. Resume and retry keep
the original run's scope. Stable action keys prevent duplicate confirmation
requests from starting a second run.

Cross-matter retrieval searches each active matter through the existing index.
It freezes the selected records when the run is queued. Archive and trash,
chat transcripts, run records, and dossier revisions are not cross-matter
research sources. Prior research packets can supply historical internal
analysis, not new verified authority. Source paths and excerpts remain linked.
The prompt separates prior matter facts and decisions from the current matter.

Matter chat file/search tools ask before reading other matters. Research agent
tools cannot start an extra search workflow outside the confirmed run. These
checks are not authentication, ethical walls, or a full vault permission system.
Existing lawyer-selected context, direct document navigation, and standalone
Watch workflows remain separate features.

When selected external retrieval fails, useful analysis remains available and
the chat card says Partial. When external search was not selected, the run says
that internal research was saved and no external search was selected.

## Verification

`backend/tests/test_research_scope.py` covers all four source choices, real
cross-matter indexing and saved excerpts, no external calls without consent,
provider-change rejection, model-argument isolation, durable card confirmation,
repeat confirmation, and archive/trash exclusion. Existing retrieval tests now
grant external permission explicitly. Network responses in tests are simulated.

`output/research-scope/serve_fixture.py` starts an isolated, no-key browser
fixture. It never uses the active-vault pointer or real matters. The browser
checks cover notices, an editable public query, cancellation, chat preselection,
and confirmed cross-matter research with external search off. Confirmation stays
complete after reload. A saved cross-matter source opens its own matter document
without replacing the current chat.

Before the native-search change, all 1,287 backend tests passed. The production build and TypeScript check passed. Adaptive intake, chat recovery,
and research-queue checks pass. The older `check:workspace-ux` script stops at
an unchanged Matters-page text assertion: it expects “in flight, … closed.”,
while HEAD already uses “in flight / … closed”. This is not a new failure.

## Not scheduled

Exact price estimates, spending limits and new database integrations: add when
a provider with a known charging contract is selected for integration. Use the
existing provider boundary and the explicit per-request choice.

Per-matter access rules and ethical walls: add when the single-user workspace
has a concrete sharing or restricted-matter requirement. Today's consent notice
must not be represented as that protection.

Skills used: senior-mindset for evidence and trust-boundary review; demo-first
and practical-simplicity to reuse the existing cards, queue, index and providers
without adding billing or permission infrastructure.

## Main-agent investigation (execution version 2)

New research runs save two roles. `main_selection` owns the analysis, evidence
requests, follow-up and answer. `collector_selection` supplies public evidence
locations. The collection role cannot publish advice. Configured search services
remain an alternative to native collection. A missing collector does not replace
the main model. Existing records without `execution_version` retain their legacy
path; reading them does not migrate them.

The source card saves external-source permission, other-matter permission, the
public topic, exact model selections, and focused follow-up permission. The
public topic is a boundary, not permission for unrelated searches. Server checks
reject known private identifiers. They do not prove semantic topic relevance.
The main agent remains responsible for relevance. Ordinary drafting uses the
same main-agent behavior and does not require a research job.

The existing runner supplies `collect_research_evidence` and
`read_research_source` only inside a server-authorized investigation. Limits are
three batches, four propositions per batch, sixteen source URLs, twelve main
turns plus one final attempt, 600 active seconds, and 48,000 evidence characters.
Opening previews count against that character limit. Local reads stay within the
matter and the saved permitted active-matter roots. Search snippets, fetched
pages and supported propositions remain separate concepts.

An evidence request can specify an exact HTTPS `public_url`. The reader preserves
links for the next main-agent request. It stores the fetched bytes before document
extraction. Literal passage reads include the source hash, offsets, and PDF page
number when selected. OCR means optical character recognition: extracting letters
from an image. OCR can misread numbers and negation.

PDF prerequisites are the declared PyMuPDF Python dependency and `tesseract` on
PATH for scanned pages. There is no runtime installation. Text extraction runs
first. Pages with little text or a large image can use OCR. Each file is limited
to 5 MB, 30 pages, six OCR pages, a 45-second extraction process and an eight-second
OCR call per page. Completed page results, images, warnings and original bytes
are retained. Unsupported, damaged, encrypted or truncated material remains an
unread lead, not silently verified evidence.

Checkpoints live in the existing Markdown run record. They retain call keys,
messages, source snapshots, request results, selected passages, publication
receipts and consumed budgets. Completed results replay locally. Restart marks
unfinished calls `outcome_unknown`. An explicit retry can incur another charge;
there is no exactly-once billing claim. Restart conservatively charges the saved
maximum duration of an unfinished timed operation. Ordinary main chat uses the
same journal in the existing chat-run storage. The synchronous API keeps its
existing error and typed-action behavior while journaling its main execution.

See [verification](main-agent-research-dossier.verification.md) for actual results
and limits. In particular, scripted fixtures do not establish live model quality.
