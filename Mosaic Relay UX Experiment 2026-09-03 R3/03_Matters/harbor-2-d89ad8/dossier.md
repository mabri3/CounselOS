---
matter_id: MAT-20260909-d89ad8
record_type: dossier
editable: true
source_revision: 03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-20260910-ba5580.md
updated_at: '2026-09-10T00:48:13+00:00'
content_hash: ba95937a7fd060b190147278f6f4d08eb2a63e13e6d1cf9b57d096d2d1c70eff
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

- Mosaic Relay's existing money transmission licenses and Harbor's MTLs are transferable or can be maintained through the acquisition without new state approval
- The KYC pass/fail results are sufficient to satisfy Mosaic Relay's own BSA/AML program obligations without the underlying documents
- The transaction monitoring repoint can be completed and validated before close without a monitoring gap

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

Latest review: `03_Matters/harbor-2-d89ad8/research/RES-20260910-fab195.md`

- Retrieved external authority: [The Bank Secrecy Act | FinCEN.gov](https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act) [source:SRC-af5274560289d39360e8]
  Available excerpt:
  > [Skip to main content](https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act#main-content)
  > 
  > ![Dot gov](https://www.fincen.gov/libraries/uswds/dist/img/icon-dot-gov.svg)
  > 
  > **The .go
- Retrieved external authority: [FFIEC BSA/AML General Definitions](https://bsaaml.ffiec.gov/references/definitions) [source:SRC-fc7c66beed9827627409]
  Available excerpt:
  > # BSA/AML General Definitions
  > 
  > ### [A](https://bsaaml.ffiec.gov/references/definitions\#A "Go to terms starting with A") [B](https://bsaaml.ffiec.gov/references/definitions\#B "Go to terms starting wi
- Retrieved external authority: [How To Get A Money Transmitter License (MTL) in the U.S. - Fenergo](https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license) [source:SRC-b48d8d40f5a0cfe9a200]
  Available excerpt:
  > [Skip to main content](https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license#main-content)
  > 
  > - [Careers](https://www.fenergo.com/careers)
  >   - [Life at\\
  >      Fenergo](https://www.f
- Retrieved external authority: [Bank Secrecy Act (BSA) - OCC.gov](https://www.occ.gov/topics/supervision-and-examination/bsa/index-bsa.html) [source:SRC-30cc26daff751516bebc]
  Available excerpt:
  > [Skip to main content](https://www.occ.gov/topics/supervision-and-examination/bsa/index-bsa.html#main_content)[Return to top of page](https://www.occ.gov/topics/supervision-and-examination/bsa/index-b
- Retrieved external authority: [PDF REENGINEERING NONBANK SUPERVISION - CSBS](https://www.csbs.org/chapter-four-overview-of-money-service-business) [source:SRC-00e489d1e0295d2fad25]
  Available excerpt:
  > CONFERENCE OF STATE BANK SUPERVISORS
  > 
  > # REENGINEERING NONBANK
  > 
  > # SUPERVISION
  > 
  > ## Chapter Four: Overview of Money Services Business
  > 
  > ### October 2019
  > 
  > ---
  > 
  > About This Paper
  > 
  > This paper, Reengineering N
- Retrieved external authority: [PDF 8.1 Bank Secrecy Act, Anti-Money Laundering, and Office of ... - FDIC](https://www.fdic.gov/risk-management-manual-examination-policies/section-8-1.pdf) [source:SRC-23325868d05d711df7ea]
  Available excerpt:
  > BANK SECRECY ACT, ANTI-MONEY LAUNDERING,
  > AND OFFICE OF FOREIGN ASSETS CONTROL
  > 
  > Section 8.1
  > 
  > INTRODUCTION TO THE BANK
  > SECRECY ACT
  > 
  > The Financial Recordkeeping and Reporting of Currency
  > and Foreign Tran

## Options or working recommendation

## Working position

The Harbor Pay migration needs legal and compliance review before the planned close. The leading concern is that an asset purchase generally requires Mosaic Relay to confirm its own authority to operate in each state; the current plan to use or assume Harbor's licenses is not established as legally effective.

The second concern is BSA/AML readiness. Mosaic Relay has not confirmed whether its AML/CIP program permits reliance on Harbor's prior KYC, and underlying records are missing for some pre-2023 users. Harbor's open alerts and SAR history also remain unread. These gaps make a day-one migration without re-verification or account restrictions difficult to support.

Transaction monitoring continuity is also material because Harbor's vendor ends at close. The repointed feed should be tested and validated before migrated users receive full access. The $50 bonus is lower priority but still needs review once its eligibility, funding, terms, and disclosures are known.

## Plausible alternatives

A narrower launch could exclude the four new markets, restrict users whose KYC evidence is incomplete, or delay full product access until alert review and monitoring validation finish. A full day-one launch remains possible only if state licensing, AML/CIP reliance, alert handling, and monitoring continuity are confirmed.

## Material facts and assumptions

Reported facts include the asset-purchase structure, the current plan to rely on Harbor's licenses, the lack of a compliance answer on KYC reliance, and the unread alerts and SAR history. The analysis assumes both entities conduct regulated money-transmission activity and that Mosaic Relay will become the operating provider immediately after close. It does not assume that Harbor's licenses transfer or that Harbor's KYC is sufficient.

## What could change this view

The view could change if state counsel confirms an effective licensing path for each affected state, compliance confirms permissible reliance with adequate records or remediation, diligence clears the alerts and SAR history, and testing shows no monitoring gap. The bonus structure remains unknown.

## Support limit

This is generated analysis based on reported matter facts. No external authority was retrieved.

## Next counsel action

Before close planning proceeds, obtain a state-by-state licensing determination for the four new markets and review the open alerts and SAR history.

## Work product links

No work product yet.
