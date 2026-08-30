# Continuous Legal Awareness and Decision Maintenance build plan

Status: approved product direction; implementation not started by this plan
Prepared: 2026-08-29
Primary user: in-house product counsel
Execution coordinator: `gpt-5.6-sol` with medium reasoning
Implementation workers: `gpt-5.6-sol` with low reasoning (called **Sol Light** below)

## 1. Outcome

CounselOS continuously or periodically checks changes outside and inside the
company, shows useful reading in a configurable Briefing, and prepares focused
review packets when a development may affect company work or a prior decision.

The complete system must answer two separate questions:

1. **What changed that I want to know about?**
2. **What existing product, policy, matter, mitigation, or decision may need my
   judgment because of that change?**

The product must support both CounselOS-native monitoring and external
intelligence providers. The lawyer selects the provider for each Watch.
Company-specific matching always happens inside CounselOS.

## 2. Settled product decisions

These decisions are part of the required build. Workers must not reopen them.

1. **Watch is the collection instruction.** A Watch is a continuing legal
   assignment. It defines the standing question, public query, topics,
   jurisdictions, sources, source roles, internal scope, provider, cadence, and
   delivery behavior.
2. **Briefing is a reading surface.** It contains useful developments even when
   no matter or decision is affected. It is not a required-action inbox.
3. **Today remains the attention queue.** Only overdue or blocked work, failed
   automations, decisions needing review, and review packets requiring judgment
   appear there.
4. **Decisions remain the record.** A review packet is generated analysis. It
   never becomes a decision without an explicit lawyer action.
5. **Source type and Watch role are separate.** CounselOS records the objective
   source type and legal status. The lawyer controls whether the source is
   primary for that Watch, secondary commentary, discovery-only, or excluded.
6. **Both provider paths are first class.** A Watch can use `native`, `polaris`,
   or `both`.
7. **Private matching stays local.** External providers never receive company
   facts, product names, matter content, decisions, mitigations, internal paths,
   internal search results, or tool schemas.
8. **Runs are scheduled, not continuous by default.** Each Watch has a
   configurable schedule. A normal default is one morning scan. The external
   provider may collect continuously, but CounselOS retrieves and processes on
   its own schedule.
9. **Scan now replaces Test it now.** Scan now runs a real one-time scan for a
   draft or active Watch. It does not activate a schedule.
10. **Internal knowledge is reloaded on every scan.** Uploads, questions that
    save facts, new documents, new decisions, product changes, policies, and
    mitigations become available in the next cycle without a second intake
    system.
11. **Important internal writes may request an earlier scan.** This is an
    optimization. Scheduled reconciliation remains the reliable backstop.
12. **The Watch Builder is a visible, editable first-party skill.** It asks one
    material question at a time, proposes defaults, and supports Save draft,
    Scan now, Change something, and Start Watch.
13. **Queries, sorting, grouping, and digests are views over one corpus.** They
    do not create separate collection pipelines.
14. **Useful partial results survive failures.** Source, provider, parsing,
    matching, citation, or synthesis failures must be visible but must not erase
    useful collected material.

## 3. Product vocabulary

### Watch

A durable, editable monitoring instruction.

Required fields:

- `watch_id`, title, standing question, and an editable `public_query`.
- Purposes: awareness, company impact, decision maintenance, or a combination.
- Topics, jurisdictions, regulators, courts, industries, and date limits.
- Sources and the lawyer's role for each source.
- Internal scope: linked products, company paths, matters, decisions, and
  mitigations. This section never leaves CounselOS.
- Provider selection: native, Polaris, or both.
- Cadence, local time, time zone, enabled state, and linked schedule ID.
- Briefing and review behavior.
- Provider checkpoints and last successful scan.

### Source

A public place or publication checked by a Watch.

Keep two classifications:

- **System source type:** case, statute, regulation, regulator material,
  government publication, secondary legal analysis, periodical, industry
  reporting, company statement, market signal, or other.
- **Watch role:** primary for this Watch, secondary commentary, discovery-only,
  or excluded.

Separately store authority status such as binding, persuasive, proposed,
official nonbinding, none, or unknown. Also store canonical URL, publisher,
jurisdiction, and source
coverage status. A company announcement can be primary for an industry Watch
while still being labeled “Company statement · Not legal authority.”

### Scan

One append-only execution record. A scan records the Watch snapshot, mode
(`draft`, `manual`, or `scheduled`), provider statuses, checkpoints, source
coverage, counts, warnings, and created record paths.

### Development

A normalized external occurrence or source change. A development preserves all
provider observations and cited source links. It is not yet a company-specific
conclusion.

### Briefing item

The lawyer-facing reading record for a development. It explains what happened,
why it appeared, its Watch, source status, dates, saved/read state, and any local
company connection. A development may remain only a Briefing item.

### Saved view

An editable query over Briefing items. It stores filters, full-text query, sort,
grouping, and display preferences. It does not copy items.

### Digest

A dated, durable snapshot of one saved view. In the local MVP, delivery means
that the digest is generated and visible in CounselOS. Email delivery is not
part of this build.

### Review packet

Generated work that connects one or more developments to company context. It
shows the prior decision, its basis and mitigations, the possible tension,
timing, source support, and why lawyer review may be useful.

### Mitigation

A first-class, explicitly recorded company measure relied on by a decision.
Generated analysis may propose a mitigation, but only an explicit lawyer action
creates or changes a mitigation record.

### Review outcome

An append-only record of the lawyer's action: Keep current, Revise decision,
Create follow-up work, Not relevant, or Keep monitoring.

## 4. Information architecture

### Today — `/`

Keep the current purpose. Add only ready review packets with priority `today`
and failed Watch schedules. Do not add routine developments, digests, unread
counts, or recommended reading.

### Briefing — `/briefing`

Add one top-level navigation destination. It contains:

- For You.
- Saved views.
- Digests.
- Watches.
- Sources.

The default page is a calm reading workspace, not an infinite required-work
feed. The query state must be represented in the URL so refresh, back, and
shared links are stable.

Supported filters include Watch, topic, jurisdiction, source, source type,
Watch role, publication date, effective date, read state, saved state, company
connection, review-packet state, potential impact, and legal status.

Supported sorts include newest, relevance, potential impact, primary sources
first, effective date, unread first, and number of connected decisions.

Supported groups include Watch, topic, source, jurisdiction, date, product, and
affected decision.

### Briefing reader — `/briefing/[itemId]`

Show the source summary, why the item appeared, Watch, source classifications,
publication and effective dates, stored provenance, company connection, and any
review packet. Actions:

- Read source.
- Ask CounselOS.
- Research further.
- Save to a matter.
- Connect to a decision.
- Save for later.
- Not useful.

Ask CounselOS uses the stored Briefing item as active-file context. Research
further creates additional generated analysis without replacing source text.

### Watches — `/watches`, `/watches/new`, `/watches/[watchId]`

These routes can be reached from Briefing. They do not need a second top-level
navigation link. Show state words Draft, Scanning, Healthy, Paused, Failed, and
Needs review.

### Decisions — `/decisions`

Keep the recorded decision register. Add linked review packets, mitigations, and
review history. Keep recommendations visually and structurally separate.

### Automations — `/automations`

Keep advanced schedule controls. Watch rows may link here, but most Watch setup
happens through Watch Builder.

## 5. Authoritative Markdown records

Use this layout:

```text
vault/
├── 00_System/
│   └── legal-awareness/
│       ├── watches/<watch-id>.md
│       └── views/<view-id>.md
├── 03_Matters/<matter-id>/
│   └── mitigations/<mitigation-id>.md
└── 05_Briefing/
    ├── scans/<scan-id>.md
    ├── developments/<development-id>.md
    ├── items/<item-id>.md
    ├── research/<research-id>.md
    ├── review-packets/<packet-id>.md
    └── digests/<digest-id>.md
```

Existing matter `events/` remain append-only matter audit events. Do not reuse
them as the global legal-development registry.

SQLite remains a disposable index. Add tables for Watches, scans,
developments, Briefing items, saved views, digests, review packets, and
mitigations. Deleting the database and rebuilding must reproduce the same
query results from Markdown.

Do not store full third-party articles by default. Store the source title,
canonical URL, publisher, dates, content hash, a bounded excerpt, citation
locators, provider observations, and retrieval warnings. Preserve enough
material to explain why the item appeared without copying an entire publication.

## 6. Provider boundary

Add an intelligence-provider boundary separate from the existing
`LLMProvider`. The existing LLM provider receives private CounselOS context and
must not be used as the external-monitoring boundary.

The central contract is:

```python
class IntelligenceProvider(Protocol):
    provider_id: str

    async def scan(
        self,
        query: OutboundWatchQuery,
        checkpoint: ProviderCheckpoint | None,
    ) -> ProviderScanResult: ...
```

`PublicWatchQuery` is the editable, structured public collection intent. It may
contain free text, so type separation alone is not a privacy guarantee. Before
any network call, `OutboundQueryPolicy.prepare()` must convert it into an
immutable `OutboundWatchQuery`. External adapters accept only the serialized
`OutboundWatchQuery`, never a Watch, `PublicWatchQuery`, vault service, or agent
context.

The outbound type has an allow-list only: standing question, public keywords,
topics, jurisdictions, regulators, courts, industries, date window, public
source URLs, and named public entities that the user explicitly classified as
Watch subjects. It has field and total-length limits. It cannot represent
internal scope. The policy normalizes Unicode and case, compares content with a
locally built forbidden corpus, and rejects suspected matter IDs, internal
paths, email addresses, private company aliases, internal product identifiers,
and document excerpts. A rejected query produces a local validation error and
zero network calls. Public companies intentionally tracked as industry sources
remain allowed through their explicit public-entity records. The UI must let
the lawyer edit or confirm the public query when the policy blocks it. This is
a strong data-minimization boundary, not a claim that arbitrary free text can
be proven safe by its Python type.

`ProviderScanResult` contains provider status, next checkpoint, source coverage,
normalized candidates, raw-answer reference or bounded excerpt, and warnings.

### CounselOS native provider

The native provider supports:

- Direct `https` source URLs.
- RSS or Atom sources.
- Search queries through a new public-only `SearchService.search_external()`
  method. It must never run internal lexical search or return internal results.
- Canonical URL and content-hash change detection.
- Bounded fetch time and response size.
- Partial results when one source fails.

It must reject local files, loopback or private-network addresses, unsafe URL
schemes, and redirects to blocked hosts. Resolve every DNS answer before each
connection, reject a host if any answer is blocked, and verify that the actual
connected address remains approved. Recheck every redirect. External content
is untrusted data and must never become agent instructions.

Collection limits are fixed defaults in configuration: 15 seconds per request,
60 seconds per provider run, three redirects, 2 MiB compressed, 5 MiB after
decompression, 12,000 stored excerpt characters, 50 discovery URLs, and 100
candidate developments per provider per run. Accept only HTTP content types
needed for HTML, plain text, RSS/Atom XML, and JSON feeds. HTTP 400-class errors
other than 429 are not retried. Retry 429 at most twice, honoring
`Retry-After` up to 30 seconds. Retry connection errors, timeouts, and 500-class
errors at most twice with bounded backoff.

`SafeHttpFetcher` is the only native network path. Its transport resolves and
validates every address, rejects the target if any answer is blocked, connects
to one approved IP while preserving the original HTTPS host and SNI, and checks
the peer address where the library exposes it. A redirect starts a new complete
resolution and validation. A plain preflight DNS check followed by an ordinary
hostname request is not acceptable.

### Polaris provider

Use the verified facts from `/Users/bharris/Programs/reins`:

- Provider ID: `polaris`.
- Label: `Polaris — Themis Lime`.
- Base URL:
  `https://polaris-themis-lime.tail8cee6e.ts.net/v1/brains/themis_lime`.
- Key environment variable: `POLARIS_API_KEY`.
- Fixed cosmetic model: `polaris-advisor`.
- Brain-scoped, advisor-read-only bearer key.
- No `/models` discovery.
- No native tools or function calling.
- No embeddings.
- No arbitrary JSON schema. Do not send `response_format`.
- Answers are free text in a grounded Polaris envelope and may include citation,
  confidence, and guardrail metadata.

Polaris receives only serialized `OutboundWatchQuery`. Parse its known envelope defensively.
If structured parsing fails but useful text exists, preserve the text as an
external generated-analysis result with warnings. Polaris citations are not
independently verified until CounselOS retrieves and checks the cited source.

The exact configured Polaris origin is a pinned exception to generic private-IP
blocking because its `*.ts.net` address can resolve inside a private overlay.
Only that exact HTTPS scheme, host, port, and path prefix are allowed. Do not
follow redirects, accept a runtime URL override, or apply this exception to any
Watch-supplied URL. The outbound-query policy still runs before the call.

### Both providers

`IntelligenceRegistry` resolves `native` and `polaris` adapters individually;
it does not implement `both`. `WatchScanService` is the sole owner of both-mode
concurrency, provider-result capture, partial status, and checkpoint advancement.
One provider failure produces a
partial scan, not an empty failure. Merge only candidates with the same
canonical URL, official identifier, or exact content hash. Preserve both
provider observations and provenance. Do not use model similarity to merge
uncertain records.

Keep one checkpoint per provider in Watch frontmatter. A successful provider
advances only its own checkpoint. A failed provider keeps its prior checkpoint.
Each Scan stores input and output checkpoints by provider.

Providers return normalized candidates and provider checkpoints only.
`DevelopmentService` alone treats identity and version separately: a stable
official ID or canonical URL identifies the development, and a content hash
identifies one observation/version. It appends provider observations, merges
only exact identities, marks supersession when appropriate, and never
overwrites earlier provenance. `WatchScanService` invokes this service and only
aggregates counts and status.

## 7. Scan and matching lifecycle

```text
Manual or scheduled trigger
        ↓
Load Watch and create running Scan record
        ↓
Snapshot Watch collection settings and build validated OutboundWatchQuery
        ↓
Run selected intelligence provider(s)
        ↓
Normalize, retrieve, classify, and deduplicate developments
        ↓
Reload current internal knowledge inside CounselOS
        ↓
Match new developments and recent open developments to internal records
        ↓
Write Briefing items and review packets
        ↓
Generate scheduled digest when applicable
        ↓
Complete Scan record and rebuild SQLite once
```

Every scan snapshots its public collection settings at start. Mid-run Watch
edits apply to the next run. Separately, every scan reloads current company
context, `02_Company_Knowledge`, relevant
matter facts and documents, decisions, mitigations, and linked paths. Use
lexical retrieval and explicit links. Do not add embeddings.

For a new external development, match against current internal knowledge. For a
new internal record, changed policy, or changed decision, rematch recent or open
developments inside the Watch's configured lookback window. This is how uploads
and decisions enter the normal next cycle.

Matching may produce:

- Briefing only.
- Monitor, with no present action.
- Review this week.
- Review today.

Persist this as `attention_state`: `briefing_only`, `monitor`, `this_week`, or
`required`. Today projects only `required`; it never infers attention from
severity or provider.

Do not introduce a numerical legal-risk score. Store a short reason for the
priority and the evidence used.

## 8. Source support and trust

Each source reference must have one support state:

- Supplied by provider.
- Retrieved by CounselOS.
- Verified against the retrieved material.
- Unverified lead.

`SourceSupportService` owns citation retrieval and support checks. A provider
citation begins as Supplied. Successful safe retrieval makes it Retrieved.
Only a stored claim-to-excerpt or claim-to-locator check makes it Verified.
Retrieval without support remains Retrieved with a warning. Every transition is
persisted on the provider observation. The UI must never label supplied Polaris
citations as verified.

Secondary material can discover an issue. CounselOS should try to trace
important claims to underlying authority. A failed trace reduces support but
does not suppress a useful Briefing item or review packet.

The UI must show:

- Why am I seeing this?
- What triggered it?
- What existing work might it affect?
- Which authority or source supports it?
- What did CounselOS fail to check?

## 9. Watch Builder skill

Create `vault/00_System/skills/watch-builder.md`. It is a first-party skill,
visible and editable through the existing Skills screen.

The skill activates through `/watch-builder` and when the user plainly asks to
start, create, or change recurring monitoring. The implementation may use a
deterministic Watch-draft card to keep multi-turn state, but the skill Markdown
remains the visible guidance.

The skill infers what it can, then asks one material question at a time about:

1. Standing question and desired outcome.
2. Awareness, company impact, decision maintenance, or all three.
3. Topics, jurisdictions, regulators, courts, and industries.
4. Named and suggested sources.
5. Per-source Watch role.
6. What counts as a meaningful development.
7. Internal products, matters, decisions, policies, and mitigations to check.
8. Briefing-only versus review-trigger behavior.
9. Cadence, time zone, and digest behavior.
10. Provider: CounselOS native, Polaris, or both.

The final actions are distinct:

- **Save draft:** persist a disabled Watch and no schedule.
- **Scan now:** run the draft once and show sources checked, failures, sample
  Briefing items, and possible review connections. Do not enable a schedule.
- **Change something:** return to the relevant question.
- **Start Watch:** persist the Watch, create its schedule, and enable it.

Activation is explicit. If schedule creation fails, the Watch remains a draft.

## 10. Scheduling

Extend the existing Markdown scheduler. Add schedule kinds `watch_scan` and
`briefing_digest`. Require `watch_id` for a Watch scan and `view_id` for a
Briefing digest.

Support:

- Manual only.
- Interval.
- Daily at a local time.
- Selected weekdays at a local time.

Use the standard library `zoneinfo`; do not add a cron dependency. Store the
time zone and calculate `next_run_at` deterministically. Preserve pause/resume,
Run now, per-schedule locking, `last_run_at`, `last_status`, and `last_message`.

Freeze these recurrence rules in the shared contract:

- Existing interval schedules keep their current kind and minutes. Missing new
  fields use backward-compatible defaults.
- `manual` has no `next_run_at` and is never selected by the due loop.
- A new interval schedule first runs one interval after creation. Later runs
  use the last scheduled time, not completion time, to avoid drift.
- Daily and weekday schedules require a valid IANA time zone and `HH:MM` local
  time. Invalid values return 422.
- In a daylight-saving gap, run at the first valid local minute after the gap.
  In a repeated hour, run once at the first occurrence.
- Scan now does not change scheduled `last_run_at` or `next_run_at`.
- A paused Watch is skipped without a provider call and the schedule records a
  visible `skipped` message. A missing Watch or saved view records an error but
  remains available for repair.
- PATCH may change cadence, local time, weekdays, time zone, enabled state, and
  target. It recalculates `next_run_at` from the update time.

Add a per-Watch lock in the scan service. A manual Scan now and a scheduled run
must not scan the same Watch concurrently.

## 11. Queries, saved views, and digests

Briefing list requests accept structured URL parameters plus `q` for text.
Return the resolved filters with the result so the UI can show exactly what was
applied.

A natural-language query parser may propose structured filters through the
configured internal LLM provider. The parser must fall back to ordinary text
search when unavailable or malformed. The user can always change visible filter
controls.

The URL contract is fixed: `q`; repeated `watch`, `source`, `topic`,
`jurisdiction`, `source_type`, `source_role`, and `status`; scalar `read`,
`saved`, `company_connection`, `packet`, `impact`, `legal_status`, `sort`,
`group`, and `view`; plus `cursor` and `limit`. Repeated values use repeated
query keys, not comma-separated text. Unknown values return 422. Missing values
use the For You defaults. The API returns `items`, `next_cursor`, `total`, and a
normalized `resolved_query`. Saved views persist that normalized query. Refresh
and Back must restore the same controls and results.

Saved views are Markdown configuration records. A digest is a Markdown snapshot
of one view at one time. Renaming or deleting a view does not change its items or
past digests.

## 12. Review packets, decisions, and mitigations

A review packet contains:

- Potential impact: Low, Medium, or High.
- Review priority: Today, This week, or Monitor.
- What happened and its legal status.
- Why CounselOS surfaced it.
- Potentially affected products, policies, matters, decisions, and mitigations.
- The relevant prior decision and basis.
- Existing mitigations and their current status.
- The possible tension or change.
- Timing and effective dates.
- Primary or core sources first, followed by secondary commentary.
- Source-support labels and warnings.

Allowed explicit outcomes:

- **Keep current:** append a review outcome and update the decision's review
  date/status. Do not rewrite the original decision.
- **Revise decision:** open or create a matter and required work item. Do not
  replace the decision automatically.
- **Create follow-up work:** create a linked work item.
- **Not relevant:** append feedback and remove the packet from required review.
- **Keep monitoring:** retain the connection without required action.

Add first-class mitigation records. Preserve existing decision `conditions` as
legacy conditions; do not silently convert them. New decisions may link
explicit mitigation IDs. Suggestions remain generated analysis until the lawyer
records them.

## 13. API contract

The contract worker must define exact Pydantic and TypeScript shapes before
dependent work begins. Required routes:

```text
GET    /api/intelligence/providers
GET    /api/intelligence/sources
GET    /api/watches
POST   /api/watches/drafts
GET    /api/watches/{watch_id}
PATCH  /api/watches/{watch_id}
POST   /api/watches/{watch_id}/answers
POST   /api/watches/{watch_id}/scan
POST   /api/watches/{watch_id}/activate
POST   /api/watches/{watch_id}/pause
GET    /api/watches/{watch_id}/runs

GET    /api/briefing/items
GET    /api/briefing/items/{item_id}
PATCH  /api/briefing/items/{item_id}
POST   /api/briefing/items/{item_id}/ask
POST   /api/briefing/items/{item_id}/research
POST   /api/briefing/items/{item_id}/connect

GET    /api/briefing/views
POST   /api/briefing/views
PATCH  /api/briefing/views/{view_id}
DELETE /api/briefing/views/{view_id}
POST   /api/briefing/views/{view_id}/digest
PUT    /api/briefing/views/{view_id}/schedule
GET    /api/briefing/digests
GET    /api/briefing/digests/{digest_id}

GET    /api/review-packets
GET    /api/review-packets/{packet_id}
POST   /api/review-packets/{packet_id}/actions

GET    /api/matters/{matter_id}/mitigations
POST   /api/matters/{matter_id}/mitigations
PATCH  /api/matters/{matter_id}/mitigations/{mitigation_id}
```

All IDs are server-generated and stable. All mutations stay inside
`VAULT_PATH`. Unknown provider IDs, actions, source roles, and URL schemes are
rejected.

The contract worker must also freeze these details:

- List responses use `{items, next_cursor, total, resolved_query?}`. Detail
  endpoints re-read Markdown by indexed path; SQLite holds only list, filter,
  sort, ID, revision, and path fields.
- Mutable records carry `revision`. PATCH and final action requests carry
  `expected_revision`; a conflict returns 409. Scan observations append and
  cannot erase lawyer source-role, read, saved, or triage edits.
- Watch draft creation returns a durable draft and its ID. Answers return the
  updated draft and next question. Scan returns a durable Scan plus preview.
  Activate returns the active Watch and schedule.
- Item PATCH changes only `read`, `saved`, or `usefulness`. Ask and Research
  return a durable result with `status`, non-empty partial text when available,
  warnings, and source-support records.
- Connect uses discriminated actions `save_to_matter`,
  `connect_to_decision`, or `create_follow_up`.
- Review actions are exactly `keep_current`, `revise_decision`,
  `create_follow_up`, `not_relevant`, or `keep_monitoring`; opening or canceling
  writes nothing, and final submit carries the action-specific payload.
- Provider capability output contains only ID, label, configured flag,
  availability/warning, and supported modes. It never contains a key, endpoint
  credential, or secret-bearing exception text.
- `watch_draft` and `watch_scan` are the only new ChatCard discriminants.
  Define their IDs, status (`pending`, `partial`, `success`, `failed`), visible
  warnings, durable Watch/Scan links, and allowed actions.
- Schedule models include kind, target IDs, recurrence, weekdays, local time,
  time zone, enabled, next/last run, status, and message. The status vocabulary
  is fixed below.
- Error mapping is 404 for missing IDs, 409 for revision or active-scan
  conflicts, 422 for invalid provider, query, role, URL, recurrence, or time
  zone, and a non-empty 200 partial result for a provider failure that produced
  useful material.

All new awareness domain/API types live in `frontend/lib/watchTypes.ts`.
`frontend/lib/types.ts` imports or re-exports only the types needed to extend
existing `ChatCard` and `Schedule` unions. Do not duplicate the models.

## 14. Security and failure behavior

Required controls:

- Intelligence providers accept only `OutboundWatchQuery`, not a Watch or vault
  service.
- A strict outbound-query validator blocks matter IDs, internal paths, document
  excerpts, and configured private names before a network call. Record the
  blocked reason without recording secrets.
- Polaris and other external provider keys remain environment-only and never
  appear in Markdown, logs, traces, or API responses.
- Native URL retrieval blocks local, loopback, link-local, private-network, and
  unsafe-scheme targets, including redirects.
- External text, HTML, fake tool calls, and prompt-injection instructions remain
  inert source material.
- Bound timeouts, retries, response bytes, and stored excerpts.
- A failed provider produces a failed or partial scan and never stops the app.
- One provider's success survives another provider's failure.
- Re-running the same provider result does not create duplicate records.
- A crash leaves a visible running/interrupted scan. Restart marks it
  interrupted and permits a new run.
- Malformed one-off records are isolated and reported. They do not blank the
  Briefing.

The forbidden corpus in privacy tests must contain Unicode/case variants of a
private company name, aliases, internal product names, matter IDs, internal
paths, email addresses, and distinctive document excerpts. Test every field of
the outbound type. A suspected match must return local validation failure and
the fake transport call count must stay zero. Captured successful requests are
compared with the corpus and must include only explicitly public Watch fields.

Scan/provider status values are exactly `running`, `success`, `partial`,
`failed`, and `interrupted`. Schedule-only status may also be `skipped`.
Provider partial means at least one useful candidate or text result survived a
provider-level warning. A both-provider scan is partial when one selected
provider fails and the other succeeds. Schedule status and message mirror the
finished Scan without replacing its detailed provider outcomes.

SQLite is disposable but must be versioned. On cache-schema mismatch, rebuild
the full index atomically from Markdown. Test startup with a pre-awareness
SQLite file. Parse each Markdown file independently, report path-specific error
counts, keep valid records queryable, and never modify malformed Markdown.

## 15. Service seams that must be frozen before parallel work

Wave 1 defines protocols and request/response models for these calls. Concrete
workers may add private helpers, but they may not change these accepted seams:

```python
OutboundQueryPolicy.prepare(watch, forbidden_corpus) -> OutboundWatchQuery
SafeHttpFetcher.fetch(url, limits) -> SafeFetchResult
WatchStore.create_draft(...) -> Watch
WatchStore.get/list/update(..., expected_revision) -> Watch
DevelopmentService.record_candidates(provider_id, candidates) -> DevelopmentBatch
BriefingStore.append_scan/append_observation/put_item/put_view/put_digest(...)
BriefingStore.get_* / list_*(...) -> record or page
MitigationService.list/create/update(..., expected_revision) -> Mitigation
SourceSupportService.check(SourceReference) -> SourceSupport
InternalKnowledgeService.snapshot(InternalScope) -> InternalSnapshot
InternalKnowledgeService.forbidden_corpus(watch) -> ForbiddenCorpus
AwarenessMatcher.match(developments, snapshot) -> MatchResult
ReviewPacketService.build(match_result) -> list[ReviewPacket]
ReviewOutcomeService.record_action(packet_id, action, payload,
                                   expected_revision) -> ReviewOutcome
AwarenessIndex.rebuild() -> IndexReport
AwarenessIndex.query_briefing(BriefingQuery) -> BriefingPage
WatchScanService.run_watch(watch_id, mode) -> ScanResult
WatchScanService.mark_interrupted_runs() -> int
BriefingQueryService.create_digest(view_id) -> Digest
SchedulerService.bind_watch_runner(callable)
SchedulerService.bind_digest_runner(callable)
BriefingResearchService.bind_agent_runner(runner)
```

`ReviewPacketService` prepares generated packets and stores them through
`BriefingStore`. It does not record lawyer outcomes. `ReviewOutcomeService`,
implemented with decision/matter integration, is the only coordinator of final
packet actions. `BriefingQueryService` owns saved-view execution and digest
creation; the scheduler only invokes it.

`AppContext` calls `mark_interrupted_runs()` at startup before awareness queries
are served. It binds scan, digest, and research callables after construction.
`configure_model()` refreshes the agent runner used by Briefing research and
digest synthesis. The scheduler uses fake bound callables in its unit tests and
never imports a provider.

One lock inside `WatchScanService`, keyed by Watch ID, covers manual and
scheduled runs, including multiple schedules that target one Watch. A scheduler
lock only prevents duplicate dispatch of the same schedule.

`WatchScanService` calls `forbidden_corpus(watch)` and validates every outbound
field before it creates any provider task. An empty corpus is valid only when
the local knowledge service proves that no private identifiers are configured;
it is never the silent fallback after a read or parse failure.

## 16. Parallel execution policy

```yaml
parallel:
  optimize_for: speed
  max_agents: 3
  workers:
    - name: sol-light-implementers
      role: implementer
      provider: codex
      model: gpt-5.6-sol
      effort: low
      max_concurrent: 3
  review:
    policy: coordinator-only
```

The Sol Medium coordinator owns decomposition, contract acceptance, wave gates,
integration, review, browser verification, and final reporting. Workers may not
spawn other agents. Every worker uses the shared tree, exact write ownership,
and no commits.

The repository is currently dirty. Every change already present belongs to the
user. No worker may revert, reformat, or overwrite unrelated work.

## 17. Dependency-safe build waves

### Wave 0 — coordinator baseline and scope gate

Owner: Sol Medium coordinator.

1. Read `AGENTS.md`, this plan, `docs/PRD.md`, `CODEX_HANDOFF.md`,
   `docs/ARCHITECTURE.md`, `docs/DESIGN_LANGUAGE.md`, and current source files.
2. Record `git status --short` as the immutable baseline.
3. Run `graphify query` for the plan and inspect the returned seams.
4. Run the baseline checks. On 2026-08-29, frontend typecheck/build passed and
   backend reported 156 passed plus three pre-existing annotation-fixture
   failures in `tests/test_annotations.py`. Record failure node IDs, not only
   counts. A baseline failure becoming green is allowed. Any new failing node is
   a regression to diagnose. Do not repair unrelated baseline failures without
   user authorization.
5. Freeze the domain, API, and TypeScript contract below before dispatching
   dependent work.

### Wave 1 — shared contracts

Chunk `W1-contracts` — one Sol Light worker.

Outcome: one verified cross-language contract for all later chunks.

Write ownership:

- `backend/app/models/awareness.py` (new)
- `backend/app/intelligence/__init__.py` (new)
- `backend/app/intelligence/base.py` (new)
- `backend/app/services/awareness_contracts.py` (new)
- `backend/app/models/api.py`
- `frontend/lib/watchTypes.ts` (new)
- `frontend/lib/types.ts`
- `backend/tests/test_awareness_models.py` (new)

The contract must include Watch, source, editable public query, immutable
outbound query, checkpoint, provider
result, scan, development, Briefing item/query, view, digest, review packet,
mitigation, Watch draft card, schedule recurrence, and action enums. Extend the
existing `ChatCard` and `Schedule` unions in `frontend/lib/types.ts`. It must
freeze the service seams in Section 15, all API envelopes, recurrence defaults,
attention and failure states, URL serialization, and error mappings. Free text
is validated by `OutboundQueryPolicy`; do not claim that a type alone prevents
private text.

Focused check:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_models.py
cd frontend && npm run typecheck
```

Wave gate: Sol Medium checks Python and TypeScript fields match and accepts the
contract. Later workers do not edit these files.

### Wave 2 — storage and providers, then private matching

Run `W2-records` and `W2-providers` in parallel. Accept both before dispatching
`W2-matching`, which uses the accepted stores and source-support seam.

Chunk `W2-records` — Sol Light.

Write ownership:

- `backend/app/services/watches.py` (new)
- `backend/app/services/developments.py` (new)
- `backend/app/services/briefing_store.py` (new)
- `backend/app/services/mitigations.py` (new)
- `backend/tests/test_awareness_records.py` (new)

Outcome: safe Markdown CRUD, stable IDs, append-only scans/outcomes, source
classification, saved views, digests, review packets, and mitigation integrity.
`DevelopmentService` alone resolves stable identity, appends content versions
and provider observations, performs exact dedupe, and preserves provenance.

Chunk `W2-providers` — Sol Light.

Write ownership:

- `backend/app/intelligence/fetch.py` (new)
- `backend/app/intelligence/native.py` (new)
- `backend/app/intelligence/polaris.py` (new)
- `backend/app/intelligence/registry.py` (new)
- `backend/app/intelligence/outbound_policy.py` (new)
- `backend/app/intelligence/source_support.py` (new)
- `backend/app/services/search.py`
- `backend/app/config.py`
- `.env.example`
- `backend/tests/test_intelligence_providers.py` (new)
- `backend/tests/test_intelligence_security.py` (new)

Outcome: public-only native search, individual native and Polaris adapters,
fixed
collection and retry bounds, exact-origin Polaris exception, final outbound
query authority, citation retrieval/support states, safe fetches, no secret
exposure, key-free capabilities, provider-returned checkpoints, and
hostile/privacy tests. `IntelligenceRegistry` resolves individual adapters only;
it does not run both mode or advance checkpoints. `SafeHttpFetcher` owns the
validated-IP transport and every native redirect. Use
local test fixtures. The test suite must prove zero transport calls on rejected
queries.

Chunk `W2-matching` — Sol Light.

Write ownership:

- `backend/app/services/internal_knowledge.py` (new)
- `backend/app/services/awareness_matching.py` (new)
- `backend/app/services/review_packets.py` (new)
- `backend/tests/test_awareness_matching.py` (new)
- `backend/tests/test_review_packets.py` (new)

Outcome: local-only internal snapshots, an explicit
`forbidden_corpus(watch)` builder, matching reasons, priority without a
numeric score, `attention_state`, review-packet generation through accepted
stores, and useful fallback output. `ReviewPacketService` builds packets only;
it does not record lawyer outcomes.

Focused checks for records and providers run in parallel. Run matching checks
after those chunks are accepted:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_records.py
cd backend && .venv/bin/pytest -q tests/test_intelligence_providers.py tests/test_intelligence_security.py
cd backend && .venv/bin/pytest -q tests/test_awareness_matching.py tests/test_review_packets.py
```

Wave gate: Sol Medium inspects every diff, proves file ownership, and runs all
Wave 2 tests together.

### Wave 3 — index and scheduler, then scan orchestration

Run `W3-index` and `W3-scheduler` in parallel. The scheduler uses only the
accepted callable protocols and local fakes. Accept both before starting
`W3-scans`, because scan/query code uses the concrete awareness index methods.

Chunk `W3-index` — Sol Light.

Write ownership:

- `backend/app/services/index.py`
- `backend/tests/test_awareness_index.py` (new)

Outcome: versioned disposable schema, atomic old-cache rebuild, list/filter/sort
fields plus Markdown paths, full rebuild/query methods, and per-file parse
isolation with visible warnings. Detail reads re-open Markdown.

Chunk `W3-scheduler` — Sol Light.

Write ownership:

- `backend/app/services/scheduler.py`
- `backend/tests/test_scheduler.py`
- `backend/tests/test_awareness_scheduler.py` (new)

Outcome: Watch scan and Briefing digest kinds, frozen recurrence and DST rules,
mutable cadence with revision checks, orphan/paused-target behavior, visible
per-dispatch errors, and fake-bound runner tests. The scheduler never calls a
provider directly.

Chunk `W3-scans` — Sol Light, after the first two chunks pass.

Write ownership:

- `backend/app/services/watch_scans.py` (new)
- `backend/app/services/briefing_query.py` (new)
- `backend/app/services/briefing_research.py` (new)
- `backend/tests/test_watch_scans.py` (new)
- `backend/tests/test_awareness_failures.py` (new)

Outcome: frozen scan state machine, provider-specific checkpoints, collection
snapshot, sole ownership of both-provider concurrency/partial status/checkpoint
advancement, calls to `DevelopmentService` for identity/version persistence,
per-Watch lock across all triggers, restart transition, internal rematch,
saved-view/digest creation, query fallback, and additive research with runtime
binding. Useful partial output and source-support labels survive failures.

Focused checks:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_index.py
cd backend && .venv/bin/pytest -q tests/test_scheduler.py tests/test_awareness_scheduler.py
cd backend && .venv/bin/pytest -q tests/test_watch_scans.py tests/test_awareness_failures.py
```

### Wave 4 — record actions and Watch skill, then backend entry points

Run `W4-watch-skill` and `W4-decisions` in parallel. Their tests use local
fixtures and do not edit `conftest.py`. Accept them before `W4-api-runtime`.

Chunk `W4-watch-skill` — Sol Light.

Write ownership:

- `backend/app/tools/handlers.py`
- `backend/app/agents/runner.py`
- `backend/app/routers/chat.py`
- `vault/00_System/skills/watch-builder.md` (new)
- `vault/00_System/tools/create_watch_draft.md` (new)
- `vault/00_System/tools/scan_watch.md` (new)
- `vault/00_System/tools/activate_watch.md` (new)
- `vault/00_System/agents/research-agent.md`
- `backend/tests/test_watch_builder_skill.py` (new)

Outcome: natural requests can begin Watch Builder; one question appears at a
time; draft state survives turns; Save draft, Scan now, Change something, and
Start Watch have distinct effects; explicit activation is enforced. Update the
research agent's allowed tools and test that the selected agent can actually
call all three handlers.

Chunk `W4-decisions` — Sol Light.

Write ownership:

- `backend/app/services/decisions.py`
- `backend/app/routers/decisions.py`
- `backend/app/services/matters.py`
- `backend/app/services/review_outcomes.py` (new)
- `backend/app/routers/matters.py`
- `backend/tests/test_decisions.py`
- `backend/tests/test_mitigations.py` (new)
- `backend/tests/test_review_outcomes.py` (new)

Outcome: link review packets and mitigations; explicit outcomes update review
state or create work without overwriting decisions; legacy conditions remain.
`ReviewOutcomeService.record_action()` is the only final-action coordinator.

Chunk `W4-api-runtime` — Sol Light, after both chunks above pass.

Write ownership:

- `backend/app/routers/awareness.py` (new)
- `backend/app/runtime.py`
- `backend/app/main.py`
- `backend/tests/conftest.py`
- `backend/tests/test_awareness_api.py` (new)
- `backend/tests/test_awareness_lifecycle.py` (new)

Outcome: construct and bind all accepted services; run startup interruption
recovery; register routes; map errors; return key-free capabilities; refresh
awareness research/digest binding in `configure_model()`; and exercise create →
Scan now → activate → scheduled scan → query → digest → review lifecycle.

Focused checks:

```bash
cd backend && .venv/bin/pytest -q tests/test_awareness_api.py tests/test_awareness_lifecycle.py
cd backend && .venv/bin/pytest -q tests/test_watch_builder_skill.py
cd backend && .venv/bin/pytest -q tests/test_decisions.py tests/test_mitigations.py tests/test_review_outcomes.py
```

Wave gate: run the complete backend suite and compare failures with the recorded
baseline. Do not start UI work until the API shapes are stable.

Chunk `W4-frontend-foundation` — one Sol Light worker after the backend gate.

Write ownership:

- `frontend/lib/api.ts`
- `frontend/lib/watchApi.ts` (new)

Outcome: export and reuse the existing shared request helper and add typed
client functions for every accepted awareness endpoint, using the exact
`watchTypes.ts` contracts. Do not create a second HTTP stack. This chunk must
finish before Wave 5 UI starts.

Focused check:

```bash
cd frontend && npm run typecheck
```

### Wave 5 — frontend foundation, then three surfaces in parallel

First dispatch `W5-shell-style` alone to establish Briefing navigation, active
route behavior, shared responsive classes, and breakpoints before surface
workers create markup.

Write ownership:

- `frontend/components/AppShell.tsx`
- `frontend/app/globals.css`
- `frontend/lib/design.ts`

`/watches/**` highlights Briefing but does not add Watches as top-level
navigation. Use only semantic roles. Then dispatch the three chunks below.

Chunk `W5-briefing-ui` — Sol Light.

Write ownership:

- `frontend/app/briefing/page.tsx` (new)
- `frontend/app/briefing/[itemId]/page.tsx` (new)
- `frontend/app/briefing/digests/[digestId]/page.tsx` (new)
- `frontend/components/BriefingWorkspace.tsx` (new)
- `frontend/components/BriefingQueryBar.tsx` (new)
- `frontend/components/BriefingItemList.tsx` (new)
- `frontend/components/BriefingReader.tsx` (new)

Outcome: For You, URL-backed query/filter/sort/group, saved views, digests,
stable reader URLs, stored provenance, Ask CounselOS, and Research further.
This chunk entirely owns item-context chat. It must support saved-view create,
rename, delete, and exact restoration; digest-now and digest scheduling; an
immutable digest reader; `Themis · Not reviewed`; one `No cited sources` label;
supplied-versus-verified support states; and non-empty partial results with a
warning.

Chunk `W5-watch-ui` — Sol Light.

Write ownership:

- `frontend/app/watches/page.tsx` (new)
- `frontend/app/watches/new/page.tsx` (new)
- `frontend/app/watches/[watchId]/page.tsx` (new)
- `frontend/components/WatchBuilder.tsx` (new)
- `frontend/components/WatchList.tsx` (new)
- `frontend/components/SourceRoleEditor.tsx` (new)
- `frontend/components/WatchScanPreview.tsx` (new)

Outcome: editable Watches, per-source roles, per-Watch provider selection,
cadence, saved draft, Scan now preview, explicit activation, pause, and run
history. Both new and existing routes use one `WatchBuilder`. `/watches/new`
creates a durable draft, then navigates to `/watches/{id}`. Scan now first saves
the draft, creates a durable preview that survives refresh, and creates no
enabled schedule. Draft and active Watches both edit on the ID route. Two
Watches with different provider selections must reload unchanged; a partial
failure must not change the selected provider.

Chunk `W5-review-ui` — Sol Light.

Write ownership:

- `frontend/components/ReviewPacketPanel.tsx` (new)
- `frontend/app/page.tsx`
- `frontend/lib/briefing.ts`
- `frontend/components/BriefingList.tsx`
- `frontend/app/decisions/page.tsx`
- `frontend/components/DecisionTable.tsx`
- `frontend/app/matters/[matterId]/page.tsx`
- `frontend/components/MatterWorkspace.tsx`

Outcome: Today contains only required packets; Decisions and Matter show packet
and mitigation links; explicit outcome actions preserve record integrity. Map
`attention_state=required` to one stable Today item with `Needs review`, amber
attention styling, reason text, packet href, and one action. Expose all five
packet actions with explicit final submit. Opening/canceling writes nothing.
Recommendation content uses dashed iris styling and never appears in the
recorded-decision table before submit. Mitigation creation is a separate action.

Each frontend worker must read `frontend/AGENTS.md` and the installed Next docs
for the local version. Dynamic pages must use the required promised `params`
and `searchParams` signatures. Focused check for each worker:

```bash
cd frontend && npm run typecheck
```

At the Wave 5 boundary, the coordinator runs a browser smoke check for Watch
draft persistence/Scan now, Briefing URL restoration/saved views, and packet
submit/cancel before accepting the wave.

### Wave 6 — remaining UI seams in parallel

Chunk `W6-chat-cards` — Sol Light.

Write ownership:

- `frontend/components/ChatCards.tsx`
- `frontend/components/ChatPanel.tsx`
- `frontend/components/TodayChat.tsx`

Outcome: Watch draft and Scan now cards, stable pending and partial-result
states, and explicit activation controls. Do not implement Briefing item chat
here; Wave 5 owns it.

Chunk `W6-admin` — Sol Light.

Write ownership:

- `frontend/app/automations/page.tsx`
- `frontend/components/AutomationPanel.tsx`
- `frontend/app/settings/page.tsx`

Outcome: Watch schedules appear by effect, link to their Watch, and expose
advanced provider configuration without displaying secrets. Settings reads
`GET /api/intelligence/providers` through `watchApi.ts`; it never treats Polaris
as the main LLM or edits global model settings for a Watch.

Focused check:

```bash
cd frontend && npm run typecheck && npm run build
```

After both chunks pass, send a follow-up to the original `W5-shell-style`
worker. It reopens only `AppShell.tsx`, `globals.css`, and `design.ts`, inspects
the accepted Step 5–6 markup, and completes responsive, focus, state, and
narrow-width styling. Surface workers must use the established semantic tokens
and base layout primitives, but they do not edit global CSS. The coordinator
runs build plus a browser check of every new surface before accepting Wave 6.

### Wave 7 — fixtures, documentation, and assembled verification in parallel

Chunk `W7-fixtures` — Sol Light.

Write ownership:

- `vault/00_System/legal-awareness/watches/alternative-data.md` (new)
- `vault/00_System/legal-awareness/views/for-you.md` (new)
- `vault/05_Briefing/` sample records (new, exact files declared before dispatch)
- `backend/tests/test_awareness_demo_content.py` (new)

Outcome: one complete sample Watch, mixed source roles, native and Polaris mock
observations, one Briefing-only item, and one decision-linked review packet.

Chunk `W7-assembled-tests` — Sol Light.

Write ownership:

- `backend/tests/test_awareness_end_to_end.py` (new)
- `backend/tests/test_awareness_hostile_outputs.py` (new)
- `backend/tests/test_awareness_rebuild.py` (new)

Outcome: hostile external output, full lifecycle, both-provider partial failure,
privacy capture, rerun dedupe, internal-change rematch, and SQLite rebuild tests.

Chunk `W7-docs` — Sol Light.

Write ownership:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DESIGN_LANGUAGE.md`
- `docs/ACCEPTANCE_TESTS.md`
- `README.md`
- `current.md`
- `decisions.md`

Outcome: product, architecture, security boundary, Watch Builder, Polaris,
routes, configuration, and browser acceptance are accurate. Remove the old
statement that external monitoring is only a future extension.

### Wave 8 — Sol Medium integration and acceptance

Owner: Sol Medium coordinator.

1. Inspect the full diff against the recorded baseline and all ownership lists.
2. Resolve imports, API-field mismatches, route registration, and shared style
   seams. Send material corrections back to the owning worker when possible.
3. Run every focused test listed above.
4. Run the full verification commands.
5. Run `graphify update .` only after application code is complete.
   `graphify-out/**` is predeclared coordinator-owned generated integration
   output and is exempt from worker path ownership.
6. Walk the browser acceptance script below against an isolated copy of the
   vault, following `docs/ACCEPTANCE_TESTS.md`. Confirm the repository vault hash
   is unchanged after the run.
7. Report the three known baseline annotation failures separately if they still
   exist. Do not claim a green backend suite unless they are actually gone.

## 18. Required hostile-output tests

At minimum, test:

- Missing, empty, non-string, and oversized provider content.
- Missing choices and malformed Polaris envelopes.
- Normal OpenAI content instead of a Polaris envelope.
- Missing, duplicate, conflicting, invalid, and unsafe citation URLs.
- HTML, scripts, prompt injection, fake tool calls, and a `tool_calls` field.
- HTTP 400 without retry, 429 then success, bounded 5xx retries, timeout, and
  connection failure.
- A provider claim that it accessed private company facts.
- An outbound query containing a matter ID, internal path, private name,
  document excerpt, or internal product identifier. The test must prove no
  network call occurred.
- One provider failing while the other succeeds.
- Repeated identical scans.
- A scheduled failure while the app remains available.

Also test mixed public/private DNS answers, an address change between resolve
and connect, redirect revalidation, compressed and decompressed byte limits,
content-type rejection, URL and candidate caps, independent provider
checkpoints, versioned source updates, startup interruption recovery, two
schedules racing one Watch, a deleted digest view, a paused Watch, and a
provider failure that does not stop later schedules.

## 19. Browser acceptance script

1. Open Briefing and confirm Today remains a separate destination.
2. Start Watch Builder from plain language.
3. Confirm it asks one material question at a time and proposes editable source
   roles.
4. Select CounselOS native, Polaris, and both on different saved draft Watches.
5. Select Scan now. Confirm results appear and no schedule becomes enabled.
6. Confirm source coverage, warnings, and the exact provider are visible.
7. Start a Watch. Confirm its schedule appears and can be paused and run now.
8. Open Briefing. Search, filter, sort, and group. Refresh and use Back. Confirm
   URL state survives.
9. Save a view and generate a digest. Confirm the digest remains unchanged after
   changing the view.
10. Open a Briefing item, read its stored support, ask CounselOS, and request
    more research. Confirm partial output remains visible after a simulated
    provider failure.
11. Confirm one useful industry item remains Briefing-only.
12. Confirm another development creates a review packet linked to a decision
    and mitigation.
13. Confirm only the required packet appears in Today.
14. Choose Keep current and confirm a review outcome is recorded without
    rewriting the original decision.
15. Change an internal company document, run the Watch again, and confirm the
    new internal state is used without sending it to the provider.
16. Delete the SQLite cache, restart, and confirm the same Watches, Briefing
    items, digests, packets, and mitigations return.
17. Inspect the captured Polaris request and confirm it contains only the public
    query and public source instructions.
18. Navigate the Briefing, reader, packet actions, and Watch Builder by keyboard.
    Confirm focus order and labels are clear.
19. Repeat the list-to-reader flow at a narrow width. Confirm filters remain
    available and URL query state is preserved.
20. Confirm the browser console has no errors.
21. Confirm the repository vault hash did not change during the isolated browser
    run.

Use this deterministic command before and after the isolated run:

```bash
find vault -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256
```

## 20. Verification commands

```bash
cd backend && .venv/bin/pytest -q
cd frontend && npm run typecheck && npm run build
graphify update .
```

Then walk `docs/ACCEPTANCE_TESTS.md` and the script above in the browser.

## 21. Do not add

- No cloud tenancy, authentication, queue, vector database, or embeddings.
- No external provider access to private company context.
- No mandatory citation or legal-perfection gate.
- No autonomous reversal of a lawyer's decision.
- No silent creation of decisions or mitigations from generated analysis.
- No numeric risk formula or confidence threshold.
- No separate news inbox that competes with Today and Briefing.
- No raw arbitrary executable code in Markdown.
- No full-article copying when bounded provenance and excerpts are sufficient.
- No silent provider fallback. The Watch must state whether fallback or both
  providers are allowed.

## 22. Completion standard

This build is complete only when the full loop works:

```text
Editable Watch
  → selectable native, Polaris, or both provider
  → manual or scheduled scan
  → durable supported developments
  → configurable Briefing and digest
  → private internal matching
  → focused review packet
  → explicit lawyer outcome
  → updated future cycle
```

The lawyer must be able to understand why each item appeared, read useful items
without creating a matter, ask for more research, and act on a possible decision
impact without reconstructing the connection manually.
