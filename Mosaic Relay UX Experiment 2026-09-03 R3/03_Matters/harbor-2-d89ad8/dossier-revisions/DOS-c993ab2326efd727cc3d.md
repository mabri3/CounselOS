---
publication_key: research:RUN-20260911-d08e84:55935ebb618a3419f18a3f43027cdc18aa00aae9c94768d9e36c451f2698083c:view:a0c90a373f8cf91351373874a70856bf77a2e51bdd276b26f0870804a57a2351:base:20a392ce26a3eefe7af46bf21bb396615326ac0eeb417c9c32c8ad6a1e306c95
revision_id: DOS-c993ab2326efd727cc3d
matter_id: MAT-20260909-d89ad8
record_type: dossier_revision
status: applied
base_content_hash: 20a392ce26a3eefe7af46bf21bb396615326ac0eeb417c9c32c8ad6a1e306c95
content_hash: a0c90a373f8cf91351373874a70856bf77a2e51bdd276b26f0870804a57a2351
created_at: '2026-09-11T21:15:53+00:00'
immutable: true
---
# Matter dossier

## Matter summary

Mosaic Relay is acquiring Harbor Pay in an asset purchase targeted to close Nov 15 (~10 weeks out). The plan involves migrating 240,000 consumer and 12,000 business accounts into Mosaic’s app on day 1, relying on Harbor’s prior KYC (for which underlying documents are missing for pre-2023 users), assuming Harbor’s 38 state MTLs to create a combined 44-state footprint, and launching a $50 welcome bonus campaign. Harbor has ~40 open alerts and unreviewed SARs, and its transaction-monitoring SaaS contract terminates at close.

## Decision question

Does any part of the Harbor Pay acquisition migration need legal review before the Nov 15 close?

## Material facts

- Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).
- Migration moves 240k consumer users and 12k business accounts into Mosaic Relay's app on day 1 post-close, with one unified account and balance and full access to Mosaic's product set.
- Plan is no re-verification; Harbor users were already KYC'd by Harbor.
- Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay holds 41; combined footprint is 44 states, opening four new markets.
- Harbor's KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail results for everyone but not the underlying documents for users onboarded before 2023.
- Harbor's transaction monitoring is a third-party SaaS whose contract terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's engine on day 1.
- Marketing wants a 'Welcome' campaign with a $50 bonus on first transfer, launching close+1.
- Diligence flagged ~40 open alerts and 'a handful' of SARs from the last year at Harbor; nobody has read them yet.

## Assumptions

This answer did not identify any assumptions it relies on. Reported facts remain in Material facts.

<details>
<summary>Earlier assumptions awaiting reconciliation</summary>

These saved assumptions have not been reconciled with this answer. They do not override later reported facts.

- Generated assumption (2026-09-09): Mosaic Relay's existing money transmission licenses and Harbor's MTLs are transferable or can be maintained through the acquisition without new state approval
- Generated assumption (2026-09-09): The KYC pass/fail results are sufficient to satisfy Mosaic Relay's own BSA/AML program obligations without the underlying documents
- Generated assumption (2026-09-09): The transaction monitoring repoint can be completed and validated before close without a monitoring gap
- Generated assumption (2026-09-09): Harbor Pay is a licensed money transmitter subject to state MTL regimes and federal BSA/AML obligations (not yet confirmed).
- Generated assumption (2026-09-09): Mosaic Relay is itself a licensed money transmitter in 41 states (per the request).
- Generated assumption (2026-09-09): The acquisition is structured as an asset or stock purchase, which affects whether Harbor's licenses and SAR/alert obligations transfer (structure not yet confirmed).

</details>

## Issues and workstreams

- Money transmission licensing and state regulatory approval for the four new markets and the combined footprint
- BSA/AML program continuity: KYC records gap (missing underlying documents pre-2023), monitoring repoint, and unread open alerts and SARs
- Consumer protection and funds-flow disclosures for migrated accounts
- Marketing compliance for the $50 welcome bonus campaign
- Data migration and privacy/data protection obligations for transferring customer personal data

## Open questions

- Whether the four new markets require new state money transmission licenses or regulatory approval before onboarding those customers
- Whether the ~40 open alerts and SARs indicate unresolved suspicious activity that must be addressed before or at close
- Whether the missing pre-2023 KYC underlying documents create a compliance gap under Mosaic Relay's BSA/AML program
- Whether the $50 welcome bonus is structured as a deposit, incentive, or referral and whether it triggers disclosure or state requirements
- Whether the acquisition structure (asset vs. stock) affects license portability and regulatory approval

## Research and source support

Latest review: `03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md`

Retrieval alone does not establish claim support.

<details>
<summary>Money transmission licensing: whether Mosaic Relay can operate under the combined 44-state footprint and whether Harbor&#x27;s MTLs transfer/survive the acquisition — sources</summary>

[Research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)

- Retrieved; passage not reviewed: [[PDF] CSBS Money Transmission Modernization Act](03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md)
- Retrieved; passage not reviewed: [Money Transmitter Licensing | Department of Financial Services](03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md)
- Retrieved; passage not reviewed: [OCC Confirms National Bank Act Preempts State Money Transmitter ...](03_Matters/harbor-2-d89ad8/research/sources/SRC-e6c1e4e85e004ccbe413-e75b998a6dec.md)
- Retrieved; passage not reviewed: [How To Get A Money Transmitter License (MTL) in the U.S. - Fenergo](03_Matters/harbor-2-d89ad8/research/sources/SRC-b48d8d40f5a0cfe9a200-fcb5e16956fb.md)

</details>

## Options or working recommendation

### Latest research-based proposal — not yet accepted

### Saved overall view

The Harbor Pay migration needs legal and compliance review before the planned close. The leading concern is that an asset purchase generally requires Mosaic Relay to confirm its own authority to operate in each state; the current plan to use or assume Harbor's licenses is not established as legally effective.

The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether its AML/CIP program permits reliance on Harbor's prior KYC, and underlying records are missing for some pre-2023 users. Harbor's open alerts and SAR history also remain unread. These gaps make a day-one migration without re-verification or account restrictions difficult to support.

Transaction monitoring continuity is also material because Harbor's vendor ends at close. The repointed feed should be tested and validated before migrated users receive full access. The $50 bonus is lower priority but still needs review once its eligibility, funding, terms, and disclosures are known.

### Workstream positions

Research progress is separate from the lawyer's conclusion.

| Workstream | Current analysis | Research state |
|---|---|---|
| Money transmission licensing: whether Mosaic Relay can operate under the combined 44-state footprint and whether Harbor's MTLs transfer/survive the acquisition | Do not rely on transferability without an applicable state rule, approval, or written regulator position.  The answer must be determined state by state and must cover more than technical change-of-control rules.  This path is possible only if Harbor remains the real provider and the relevant states permit the arrangement. The unified Mosaic account design may conflict with that position.  The result depends on the contracts and actual funds flow. Custody alone should not be treated as a licensing exemption or transfer mechanism. Next: Identify the four Harbor-only states and complete one matrix covering license authority, transaction filings, interim operation, bank custody, outstanding obligations, and license surrender. [Full research](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md) | Research added. 4 sources retrieved; 0 with passages read. |
| BSA/AML and KYC: whether relying on Harbor's prior KYC (with missing underlying documents for pre-2023 users) satisfies Mosaic Relay's independent CIP/AML obligations | No separate issue position saved. The saved overall view remains available. | No research update saved. |
| SAR and alert handling: obligations to review, file, and manage Harbor's ~40 open alerts and SARs, and successor liability | No separate issue position saved. The saved overall view remains available. | No research update saved. |
| Monitoring vendor transition: continuity of transaction monitoring when the SaaS contract terminates at close | No separate issue position saved. The saved overall view remains available. | No research update saved. |
| Marketing compliance: the $50 welcome bonus offer and any state money transmission or consumer protection implications | No separate issue position saved. The saved overall view remains available. | No research update saved. |

### Latest research update

Research updated: Money transmission licensing: whether Mosaic Relay can operate under the combined 44-state footprint and whether Harbor's MTLs transfer/survive the acquisition. Other workstreams retain their prior position.

[Read the full research answer](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md) — 4 sources retrieved; 0 with passages read.

<details>
<summary>Earlier saved position — 2026-09-09T20:57:53+00:00</summary>

**Working position**

The Harbor Pay migration needs legal and compliance review before the planned close. The leading concern is that an asset purchase generally requires Mosaic Relay to confirm its own authority to operate in each state; the current plan to use or assume Harbor's licenses is not established as legally effective.

The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether its AML/CIP program permits reliance on Harbor's prior KYC, and underlying records are missing for some pre-2023 users. Harbor's open alerts and SAR history also remain unread. These gaps make a day-one migration without re-verification or account restrictions difficult to support.

Transaction monitoring continuity is also material because Harbor's vendor ends at close. The repointed feed should be tested and validated before migrated users receive full access. The $50 bonus is lower priority but still needs review once its eligibility, funding, terms, and disclosures are known.

**Plausible alternatives**

A narrower launch could exclude the four new markets, restrict users whose KYC evidence is incomplete, or delay full product access until alert review and monitoring validation finish. A full day-one launch remains possible only if state licensing, AML/CIP reliance, alert handling, and monitoring continuity are confirmed.

**Material facts and assumptions**

Reported facts include the asset-purchase structure, the current plan to rely on Harbor's licenses, the lack of a compliance answer on KYC reliance, and the unread alerts and SAR history. The analysis assumes both entities conduct regulated money-transmission activity and that Mosaic Relay will become the operating provider immediately after close. It does not assume that Harbor's licenses transfer or that Harbor's KYC is sufficient.

**What could change this view**

The view could change if state counsel confirms an effective licensing path for each affected state, compliance confirms permissible reliance with adequate records or remediation, diligence clears the alerts and SAR history, and testing shows no monitoring gap. The bonus structure remains unknown.

**Support limit**

This is generated analysis based on reported matter facts. No external authority was retrieved.

</details>

## Next counsel action

Proposed: Identify the four Harbor-only states and complete one matrix covering license authority, transaction filings, interim operation, bank custody, outstanding obligations, and license surrender.

## Work product links

No work product yet.

## Current solution direction

Current direction: Mosaic-operated migration (SCN-490c71c86d9c658974321c1e).

Previous approach: SCN-406906c91ab0aba4313b54a6.
