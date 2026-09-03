---
matter_id: MAT-20260903-63c4be
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-risk-data-63c4be/dossier-revisions/DOS-20260903-638fb8.md
updated_at: '2026-09-03T17:48:40+00:00'
content_hash: a55250fcd8fff02c126d3c123313bd4ed033fb9457f7c1c0ea6ec22f50082d3c
---
# Matter dossier

## Matter summary

Mosaic Relay Holdings, Inc. (a fictional B2B payments infrastructure provider) plans to combine onboarding data, transaction history, device signals, sanctions results, dispute records, and payout behavior into a unified risk-scoring model. The score would drive onboarding decisions, transaction review, payout controls, and account deactivation affecting business customers, individual payers, sellers, and contractors. Engineering proposes a shared data model with a ten-week launch timeline and seven-year retention of risk events. Counsel must determine what privacy controls, notices, rights workflows, and governance safeguards are required before legal can approve the launch.

## Decision question

Can Mosaic Relay launch a combined risk-scoring system in ten weeks that retains risk events for seven years, and if so, what specific data minimization, storage limitation, individual rights, and automated-decision safeguards must be implemented to satisfy GDPR, CCPA/CPRA, and other applicable privacy regimes given that jurisdictions are not yet scoped and the system will make or support decisions affecting individuals' access to payment services?

## Material facts

- Mosaic Relay plans to combine onboarding information, transaction history, device signals, sanctions results, dispute records, and payout behavior to improve fraud and risk scoring.
- The risk score would support onboarding, transaction review, payout controls, and account deactivation.
- Engineering proposes a shared data model and a launch in ten weeks.
- Mosaic Relay plans to retain risk events for seven years.
- Actors include Mosaic Relay, its business customers, individual payers, sellers, contractors, risk vendors, and support teams.
- The intended data fields and current vendor contracts are known.
- Which jurisdictions will the risk-scoring program cover at launch and in the near term? This drives which privacy regimes (GDPR Art. 22, CCPA/CPRA, LATAM laws) apply. — Global / not yet scoped
- Does the risk score drive automated decisions, or does a human review before action? (This may differ by use case — onboarding, transaction review, payout controls, account deactivation.) — Not yet determined
- Do the current vendor contracts and data-source permissions permit combining this data into a shared risk model? — Not yet reviewed / unknown
- When does the business need the legal answer? — Before a planned launch
- Are there deletion exceptions to the seven-year retention of risk events (e.g., cleared sanctions hits, resolved disputes, data subject to deletion requests)? — Some categories deleted earlier (e.g., cleared sanctions, resolved disputes)
- Jurisdiction coverage at launch and near term — Global at launch; exact jurisdictions are not yet scoped. Design must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- Access roles for the shared risk model and score — Least privilege with role-based access: risk operations may view scores and reason codes; model administrators and engineering may manage features and models only as needed; support sees limited status and approved explanations, not raw sensitive signals; risk vendors receive only minimum fields under contract; business customers receive only the decision outcome and required explanation. Log, review, and revoke access.
- Which data fields are sensitive — Treat sanctions results, dispute records, device signals, payout behavior, transaction history, and identity or onboarding attributes as sensitive or high-risk. Minimize collection, separate raw signals from derived scores, and apply stronger access, notice, retention, and audit controls.
- Should individual payers, sellers, and contractors be able to access, correct, or delete their risk data, and how? — Full access/correction/deletion workflows for individuals
- Should the risk score be explainable to individuals and to business customers, and to what degree? — Full explanation to individuals and business customers
- What notices, consent, or opt-out steps should apply to the combined risk scoring? — Notice plus opt-out for certain uses
- When the business needs the legal answer relative to the ten-week launch — Before the planned launch in ten weeks. Legal needs a go/no-go package before engineering freezes the shared model and launch plan.
- Jurisdiction coverage is Global at launch; exact jurisdictions are not yet scoped; design must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- Some risk-event categories are deleted earlier than seven years (e.g., cleared sanctions, resolved disputes).
- Access is least-privilege and role-based: risk ops view scores/reason codes; model admins and engineering manage features/models only as needed; support sees limited status and approved explanations, not raw sensitive signals; risk vendors receive minimum fields under contract; business customers receive only decision outcome and required explanation; access is logged, reviewed, and revocable.
- Sanctions results, dispute records, device signals, payout behavior, transaction history, and identity/onboarding attributes are treated as sensitive or high-risk; minimize collection, separate raw signals from derived scores, and apply stronger access, notice, retention, and audit controls.
- Individual payers, sellers, and contractors have full access/correction/deletion workflows for their risk data.
- The risk score is fully explainable to individuals and business customers.
- The combined risk scoring uses notice plus opt-out for certain uses.
- Legal needs a go/no-go package before engineering freezes the shared model and launch plan (launch in ten weeks).
- Lawyer decision recorded: do not approve the launch as proposed; approve only a gated, purpose-limited launch after jurisdiction scoping, vendor permissions/contracts, data minimization and retention limits, least-privilege access, individual rights workflows, notices and opt-out, full explanations, human review and automated-decision safeguards, and model-governance controls are completed and verified.

## Assumptions

- Jurisdictions are not yet specified; analysis will differ materially between US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes.
- Whether the score produces automated decisions or feeds human review is not yet established and drives ADM obligations.
- Whether the combined data constitutes a consumer report under FCRA is not yet established.
- Whether current vendor contracts permit the secondary combination of data into a shared model is not yet established.
- Exact launch jurisdictions are not yet specified; analysis must branch between US-only (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22 ADM) regimes, with LATAM assessed before launch.
- Jurisdictions are not yet specified; analysis must branch for US-only and EU/UK coverage, with Latin America assessed before launch.
- Whether the risk score drives automated decisions or human-reviewed action is not yet determined; this determines whether GDPR Art. 22 / ADM obligations apply.
- Whether current vendor contracts and data-source permissions permit combining data into a shared model is not yet reviewed.
- Jurisdiction scope is not yet finalized; analysis must branch for US-only and EU/UK coverage, with LATAM assessed before launch.
- The seven-year retention of risk events is subject to earlier deletion for cleared sanctions and resolved disputes.
- The risk score is treated as sensitive/high-risk data requiring stronger controls.
- Analysis branches for US (CCPA/CPRA, FCRA-adjacent) and EU/UK (GDPR Art. 22); LATAM requires additional analysis if in scope at launch.
- The score may drive automated decisions for at least some features; if all decisions are human-reviewed, ADM obligations are reduced.
- The combined data could constitute a consumer report under FCRA for eligibility purposes.
- Mosaic Relay is the controller for the combined model; if business customers are controllers of end-user data, notice/rights obligations shift.
- The seven-year retention is assumed to have a legal basis; not yet confirmed.
- Mosaic Relay is a data controller for the combined risk data it processes (not solely a processor for business customers).
- The combined risk data does not constitute a consumer report under FCRA; if it does, FCRA adverse-action and permissible-purpose obligations attach.
- The risk score is used for fraud and risk management (a legitimate interest / operational purpose), not for credit eligibility or employment decisions.
- The seven-year retention is not independently justified by a specific legal or regulatory requirement.
- Business customers are separate controllers of their end-user data, so Mosaic Relay needs contractual authority to combine and process that data.
- A1: Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not itself hold deposits or provide deposit accounts.
- A2: Regulatory classification (money transmission, FCRA consumer-report characterization) and partner obligations are material assumptions to surface, not established facts.
- A3: The combined risk data includes personal data of individuals (payers, sellers, contractors) in jurisdictions where privacy regimes apply.
- A4: The shared model and score are used for the four stated features (onboarding, transaction review, payout controls, account deactivation) and not yet for other purposes.
- A5: The ten-week launch timeline is fixed and legal must deliver a go/no-go package before engineering freezes the model and launch plan.

## Issues and workstreams

- Distinguishing permitted operational use from secondary use of combined risk data
- Automated decision-making / profiling obligations (GDPR Art. 22, CCPA/CPRA, state ADM laws) depending on whether the score drives automated vs. human-reviewed decisions
- Data-source permissions and vendor contract scope for combining data into a shared model
- Retention of risk events for seven years vs. data minimization and deletion obligations, with earlier deletion for cleared sanctions and resolved disputes
- Access controls and role-based limits across support teams, risk vendors, and business customers
- Individual rights workflows (access, correction, deletion, opt-out) for payers, sellers, contractors
- Model explainability and governance for the risk score
- Customer instructions/notices and consent or opt-out steps
- Whether the combined data constitutes a consumer report under FCRA
- Controller relationship for business customers' end-user data

## Open questions

- **Jurisdiction scope**: Which specific countries/states will the system cover at launch? This determines whether GDPR Art. 22 (automated decisions), CCPA/CPRA, state ADM laws, or LATAM privacy regimes apply, and whether the seven-year retention is defensible.
- **Automated vs. human-reviewed decisions**: Will the risk score drive fully automated decisions (e.g., automatic account deactivation) or will humans review before action? This triggers different legal obligations under GDPR Art. 22 and emerging US state ADM laws.
- **Vendor contract permissions**: Do current contracts with data sources (identity vendors, sanctions providers, fraud vendors) permit combining their data into a shared risk model, and do they impose retention or use restrictions?
- **FCRA applicability**: Does the combined risk score constitute a "consumer report" under the Fair Credit Reporting Act when used for onboarding or account decisions, which would impose additional notice, consent, and dispute obligations?
- **Controller/processor roles**: When Mosaic Relay processes end-user data (payers, sellers, contractors) on behalf of business customers, who is the controller and who is the processor, and does this vary by use case or jurisdiction?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-risk-data-63c4be/research/RES-20260903-83efcc.md`

- Internal support: **Facts** — Known Facts Mosaic Relay plans to combine onboarding information, transaction history, device signals, sanctions results, dispute records, and payout behavior to improve fraud and risk scoring. The…

## Options or working recommendation

# Recommendations

No recommendation has been drafted yet.

## Next counsel action

Review, decide, and deliver the response.

## Work product links

- Draft: [Mosaic Relay UX Test — 06 — Privacy Controls for Risk Data response](03_Matters/mosaic-relay-ux-test-06-privacy-controls-for-risk-data-63c4be/work-product/draft/mosaic-relay-ux-test-06-privacy-controls-for-risk-data-response-ec4f63.md)
