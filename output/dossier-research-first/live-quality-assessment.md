# Step 13 live-quality assessment

Date: September 11, 2026, America/Los_Angeles  
Fixture: `dossier-live-quality-20260912-01`  
Result: PARTIAL / FAILED QUALITY ACCEPTANCE

## Scope and identity

- Synthetic matter: `MAT-20260912-f7ed8b`
- Parent request: `DOR-20260912-f382af`
- Configured main model: `opencode_go / deepseek-v4.1-flash / max`
- Configured collector: `opencode_go / deepseek-v4.1-flash / default`
- Search choices: external research on; Firecrawl and Polaris selected; other matters off; follow-up queries and collection on.
- The preflight IDs, source choices, model selections, and planned worker identities were saved in `live-quality-attempt.json` before the first external call.
- `external_attempt_count` is `1`. No retry was made.

The source record clearly labels the vendor contract as synthetic and not law. The matter has three selected legal issues and two visible other workstreams. It separates the November 2, 2026 launch event from the September 12, 2026 administration date. It also records one reported-fact set and one explicit inferred assumption. No private customer, employee, or transaction data is present.

## Timing and calls

| Measure | Observed result |
|---|---:|
| Preparation | 83.155 seconds |
| Subscription worker | 85 seconds; 2 main-model calls |
| Privacy worker | 162 seconds; 1 main-model call |
| Vendor worker | 389 seconds; 8 main-model calls |
| Saved service first-pass-ready metric | 471.473 seconds after external start |
| Full request | 472.208 seconds |
| Publications attempted | 1 |
| Successful dossier revisions | 0 |

The saved first-pass-ready metric is not a useful-dossier time. No new dossier revision was published. The useful dossier time was therefore not achieved in this exercise.

The provider did not expose cost. No cost was estimated.

## Search and passage evidence

- Seven Firecrawl search legs completed across seven queries.
- The traces contain 26 retrieved-source mentions and 24 unique retrieved source IDs.
- The checkpoints contain 12 saved passage-read records: seven have non-empty passage text and five are `not_found`.
- Subscription: four sources retrieved; three passage reads attempted; all three were `not_found`; no packet saved.
- Privacy: ten sources retrieved; zero passage reads saved; no packet saved.
- Vendor: twelve sources retrieved; nine passage-read records; seven contain passage text from five distinct public sources; one packet saved.
- Public primary-law results were retrieved for the privacy issue, including California regulation and government pages, but the worker did not complete passage reads or save an analysis packet. The completed vendor packet relied on contract text plus secondary practice guidance. This exercise does not prove a complete public-primary-source analysis.

## Quality review

The vendor packet is useful but partial. It:

- states the operative synthetic contract rule;
- reads and applies the material Section 6 exception away from the opening paragraphs;
- explains the access-loss dependency;
- gives dated conditions and a concrete next action;
- labels public practice sources as commentary, not controlling law;
- keeps subscription, privacy, accessibility, and brand work visible;
- uses the November 2 launch event and does not turn the September 12 administration date into a deadline.

The parent preparation record also keeps reported facts separate from the explicit inferred California-scope assumption. The completed vendor packet does not rely on that assumption.

The full request did not produce a complete dossier:

1. The subscription and privacy workers failed with `ValueError: Saved source snapshot hash changed.` Their retrieved evidence remained saved, but they produced no packets.
2. The subscription worker reached only failed passage lookups. The privacy worker retrieved sources but saved no passage reads. Both are partial, not completed research.
3. The recommendation proposal `REC-20260912-974038` was saved and retained all workstreams.
4. Dossier publication failed. The parent ended `partial / finished`, and the sole publication receipt is `failed` with no revision path.
5. The run console also reported `Research citation formatting failed: KeyError`. The saved publication receipt does not preserve a more specific dossier-writer error, so the exact writer failure is not proven from the receipt alone.

## Decision

The one bounded configured-model exercise was completed as planned. Step 13 execution is done. The overall acceptance check remains incomplete because two of three workers failed and no useful dossier revision was published.

Exact next action: reproduce the shared-source snapshot mutation and citation-formatting/publication failures at deterministic boundaries. Add focused tests and repair those defects. A second live configured-model exercise needs separate authorization because this run used the single authorized attempt.
