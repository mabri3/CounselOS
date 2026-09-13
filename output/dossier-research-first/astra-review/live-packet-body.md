# Research this issue for the dossier: Vendor termination, export, and

## Question

Research this issue for the dossier: Vendor termination, export, and continuity: Apply the synthetic vendor contract's access-loss and export conditions to launch continuity.. This is a hard operational cutoff: if console access ends at termination and export must be requested in writing beforehand, a missed or unplanned termination event can strand launch-critical access and data regardless of legal clearances.

## Working Analysis

## Vendor termination, export, and continuity — position for launch continuity

**Practical position.** The supplied synthetic contract (expressly not law — it is contract application, not public law) is a hard operational cutoff, and the fixture text is stricter than its summary. Console access ends **immediately** when the agreement terminates, and a complete export is available **only** if Kestrel receives Northstar's written export request **before** termination. The single exception is narrow: it applies only where termination results **solely** from Kestrel's uncured material breach and only if Northstar has paid all undisputed invoices — and even then it gives only a **read-only export portal for ten calendar days**. No other termination route (Northstar-side termination, expiry, mutual exit, payment dispute, vendor shutdown or insolvency) receives any post-termination access at all. Because termination can be unplanned, "we'll transition if it happens" is not a control. For the November 2, 2026 launch, the continuity condition is: a **written-requested, complete, verified export of the launch-critical console data must already exist before any termination can occur**, backed by an exit runbook and, if obtainable, a short addendum adding notice/cure and a wind-down/export window.

### What the contract actually decides

| Contract term | Effect | Launch consequence |
|---|---|---|
| §3 — the Kestrel console is Northstar's retrieval route for account status and cancellation audit records | The console is a system of record for operationally needed data | Stranded records block cancellation operations and audit capability, not just migration |
| §4 — routine exports while the agreement is active | An export channel exists **now** | Use it now, on a recurring basis; never wait for a termination event |
| §5 — access ends immediately at termination; complete export only if the written request is received beforehand | Pre-termination-only export right | A missed or defective request has no cure; "generally" in the fact summary corresponds to §6's narrow exception, not a general grace period |
| §6 — breach-only exception: termination results solely from Kestrel's uncured material breach + all undisputed invoices paid → read-only portal, 10 calendar days | Narrow, conditional, and contestable | Cannot be planned around; treat as a bonus, never the plan |

Gaps in the supplied text: no notice period, cure window, termination triggers, export format, delivery timeline, completeness definition, deletion/survival terms, or the recipient/method for the written request. Each is a named ask for the addendum and, until closed, a missing protection.

### Why a missed termination is unrecoverable

- **Planned exits:** the request must be in writing *before* termination; after termination there is nothing to request.
- **Unplanned exits:** §6 requires a causal posture ("results **only** from" Kestrel's breach) that a mixed dispute, an unpaid invoice, or a contested causation story can defeat — and it buys only ten days, read-only.
- **Every other route gets zero access.** Legal clearances elsewhere (cancellation, privacy) cannot restore stranded access: this is a sequencing problem, not a liability problem — no claim restores the data before launch.

### What standard practice would add (public research; practice commentary, read directly — relevance, not authority for this contract)

- **Exit packages commonly negotiated:** termination for convenience with 30–90 days' notice and transition assistance of 30–90 days including read-only access and migration cooperation (a June 2026 practitioner guide; a practitioner exit-clause checklist).
- **Portability terms:** machine-readable format; completeness including metadata and configurations; the right to export at any time during the term; final export within a fixed post-termination window (~30 days); no extra export fees (practitioner guide).
- **Distress planning:** assess vendor risk, preserve portability, keep a documented exit strategy and continuity plan; escrow or independent copies make data "accessible, portable, and recoverable if the original provider suffers a setback" (Escode guidance; ISC2 Insights) — and a law-firm commentary frames the core question bluntly: whether you can get your data out, in a usable format, "before the lights go off."
- **Legal perimeter:** the U.S. has no federal equivalent to the EU Data Act's switching rights; post-hoc leverage is limited to general instruments (e.g., California's UCL § 17200 for unconscionably one-sided terms, FTC scrutiny of switching barriers, implied good-faith duties) (practitioner guide). The launch is U.S./California scope, so the EU switching regime does not apply now — but would become relevant if EU users are added.

### Launch conditions (all **Proposed**; owners unassigned — role proposals only; dates counted back from the November 2, 2026 launch event)

| # | Work | Why | Proposed owner role | Needed by | Evidence to proceed | Fallback |
|---|---|---|---|---|---|---|
| 1 | Send Kestrel the written export request (account status + cancellation audit records; machine-readable format; specify scope, recipient, and delivery confirmation) | §5 makes this the only reliable export path | Legal (contract owner) | Proposed: 2026-09-19 (within a week; ~6 weeks pre-launch) | Sent request + acknowledgment; open-items list | Re-send via multiple channels/account manager; capture any routine exports |
| 2 | Complete and verify the baseline export; reconcile against console fields; store independently; set recurring cadence | "Complete export" is undefined; a verified copy must predate any termination | Product/Engineering (data owner) with Legal | Proposed: 2026-10-05 (28 days pre-launch); recurring after | Reconciliation note; independent copy; cadence schedule | Export what the console allows; document gaps for the addendum |
| 3 | Addendum ask: notice/cure; wind-down/transition assistance (read-only access + export support, ≥30–90 days); format/timeline/completeness; deletion certification | Closes the gaps that make §5 unstoppable | Legal (commercial) | Proposed: draft by 2026-10-12 (21 days pre-launch) | Draft addendum; counterparty response | If refused: document reliance on recurring exports + runbook; revisit before renewal |
| 4 | Exit runbook + termination-signal monitoring (named owner; same-business-day written request on any signal; monitor payment/insolvency/renewal signals; alternate access for account status) | Unplanned termination is the exact scenario §5/§6 penalize | Product/Engineering with Legal and Finance | Proposed: 2026-10-19 (14 days pre-launch) | Runbook; monitoring checklist; a dry-run of the trigger | Calendar alerts for notice/renewal dates; weekly exports meanwhile |
| 5 | Register row in the launch conditions register (condition, evidence, owner, date, status) | The decision question requires dated, owned conditions | Launch review / Legal ops | Before the launch review | Register entry with status | Track in launch review minutes |

### Coverage across the matter

This result **updates the vendor termination, export, and continuity issue** with the bounded position above, and **feeds the launch conditions register** with one dated condition plus evidence requirements. Subscription enrollment/cancellation, privacy, accessibility, and brand clearance remain **unchanged and not addressed here** — one linkage worth noting when the register is built: the stranded console data (cancellation audit records) is also operationally relevant to the cancellation issue, though no position is taken on it here.

### Remaining gaps

1. The supplied text may not be the entire negotiated agreement — if separate master terms, order forms, or a DPA contain notice/cure or wind-down provisions, the position improves; pull them.
2. **Current export status is unknown** — whether any request has been made or export performed. This is the single fact that would change the condition set fastest.
3. The written-request recipient/method is unspecified in the supplied text; confirm it and use multiple channels.
4. External support is practice commentary and vendor guidance, read directly; it benchmarks market practice but does not construe this contract.

**Next action:** Send the written export request to Kestrel now — covering account status and cancellation audit records in machine-readable form — log delivery and acknowledgment, and open the addendum conversation on notice/cure and a wind-down export window in parallel. If an export has already been requested or performed, that changes the condition set immediately.

## Sources surfaced

- Source details could not be formatted. Review the research warning metadata.

## Last-mile work for counsel

- Confirm the facts that could change the recommendation.
- Verify any authority that will carry the final answer.
- Decide the acceptable risk and the business path.

## Research status

- Question answered: Yes
- External authority retrieved: Yes
- Internal support used: Yes
- Model-only: No
- Assumptions: See the Working Analysis.
- Remaining gaps: Verify material facts and any authority used for the final answer.
