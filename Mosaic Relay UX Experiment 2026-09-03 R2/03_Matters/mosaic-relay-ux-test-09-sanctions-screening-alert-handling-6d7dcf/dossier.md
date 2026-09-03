---
matter_id: MAT-20260903-6d7dcf
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-09-sanctions-screening-alert-handling-6d7dcf/dossier-revisions/DOS-20260903-46d495.md
updated_at: '2026-09-03T18:38:52+00:00'
content_hash: 44c18d6242415590308e74b8df6b143f3bacdec6b1e4726244502beaef8ecacc
---
# Matter dossier

## Matter summary

Mosaic Relay Holdings, Inc., a B2B payments infrastructure provider, is replacing manual sanctions screening with a vendor solution that returns potential matches and confidence signals. Product proposes automatically blocking exact matches, allowing low-confidence matches to proceed, and sending review cases to an offshore operations team, with a weekend migration planned in two months. Counsel is involved because the change implicates sanctions compliance (OFAC and global lists), cross-border data transfers, recordkeeping, and operational controls that must be validated before cutover. The timeline is aggressive given unresolved controls around evidence standards, escalation authority, and data transfer mechanisms.

## Decision question

Should legal approve the vendor-based sanctions screening design—including auto-blocking exact matches, holding low-confidence matches for two-person review, offshore data transfer, and daily vendor-managed list refresh—and authorize the weekend cutover in two months, or condition approval on completing specific migration-readiness gates?

## Material facts

- Compliance wants to replace manual sanctions screening with a vendor that returns potential matches and confidence signals.
- Screening applies at onboarding and before selected payouts.
- Product proposes automatically blocking exact matches.
- Product proposes allowing low-confidence matches to proceed.
- Product proposes sending review cases to an offshore operations team.
- Product wants to migrate customers over a weekend in two months.
- Known facts include vendor coverage, API response times, and proposed matching thresholds.
- Missing facts include list-update frequency, jurisdictional scope, escalation authority, data transfer locations, evidence standards, customer communications, and procedures for true and false matches.
- For low-confidence matches, Product proposes letting them proceed automatically. What should happen to funds while a low-confidence match is pending? — Hold funds until a human review clears the match
- Which sanctions lists and jurisdictions should the screening program cover? — Global/multi-jurisdiction coverage
- When does the business need the legal answer? — Before a planned launch
- Where is the offshore operations team located, and does sanctions review data cross borders? — Different region (cross-border data transfer)
- Who decides whether a flagged match is a true vs false match and releases a held payout? — Two-person review (maker/checker)
- What should happen if the screening vendor is unavailable during onboarding or before a payout? — Fall back to manual screening
- How often is the vendor's sanctions list refreshed, and how is that refresh verified? — Daily refresh, vendor-managed

## Assumptions

- Mosaic Relay is a payments infrastructure provider, not a bank, and coordinates regulated partners (per company profile).
- Sanctions screening obligations are driven by OFAC/regulatory expectations and partner (acquiring bank/processor) requirements.
- Global/multi-jurisdiction coverage means the program must reconcile conflicting or divergent sanctions lists across jurisdictions.

## Issues and workstreams

- Cross-border data transfer of sanctions review data to an offshore ops team in a different region, acute under global/multi-jurisdiction list coverage
- No defined evidence standards or documented procedures for true vs false match determinations
- Global coverage raises conflicting-list handling and list-update verification questions
- Weekend migration in two months may be aggressive given unresolved controls
- No defined customer communications plan for blocked or held payouts
- No defined record retention schedule for screening and review records
- Daily vendor-managed list refresh needs independent verification to support global coverage

## Open questions

- What is the defined scope of "selected payouts" that trigger pre-payment screening, and which actor events (onboarding, payout, list refresh) are in scope?
- What evidence standard and documentation will the maker/checker team use to distinguish true vs. false matches, and what is the escalation path when reviewers disagree or are unavailable?
- Which data transfer mechanism (adequacy decision, SCCs, derogation) will govern the offshore transfer of sanctions review data, and has the vendor DPA/sub-processor terms been reviewed?
- How will Mosaic Relay independently verify the vendor's daily list refresh and global/multi-jurisdiction coverage, given conflicting sanctions lists across jurisdictions?
- What customer communications and notice procedures will apply when payouts are held or blocked, and what record retention schedule will govern screening and review records?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-09-sanctions-screening-alert-handling-6d7dcf/research/RES-20260903-b179aa.md`

- Internal support: **Sanctions Screening Change Research Packet 8D6F9F** — This is a recommendation only. No legal decision has been recorded, no external response has been sent, and the matter has not been closed.

## Options or working recommendation

# Recommendations

No recommendation has been drafted yet.

## Next counsel action

Run or supervise first-pass research.

## Work product links

- Draft: [Sanctions Screening Change — Legal Analysis and Recommendation](03_Matters/mosaic-relay-ux-test-09-sanctions-screening-alert-handling-6d7dcf/work-product/draft/sanctions-screening-change-research-packet-8d6f9f.md)
