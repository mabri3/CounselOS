---
matter_id: MAT-20260903-7576cf
record_type: dossier
editable: true
source_revision: 03_Matters/mosaic-relay-ux-test-01-risk-based-merchant-onboarding-for-a-mar-7576cf/dossier-revisions/DOS-20260903-d8a9a2.md
updated_at: '2026-09-03T21:55:34+00:00'
content_hash: f1fcb4d53d20a9b752276e72e3aa7d758eca9e799c0b5a2b0c1df67756fbbb0d
---
# Matter dossier

## Matter summary

Mosaic Relay, a payment infrastructure provider, is designing a risk-based onboarding flow for a marketplace customer to onboard sellers in the US, UK, and EU. The proposed flow would allow low-risk sellers to begin limited card acceptance within minutes, with enhanced review completed within one to three business days when needed. Mosaic Relay is not a bank and does not hold deposits, but the flow involves cross-border card acceptance and payouts with expected monthly volume up to $3M. Counsel is involved because the money transmission licensing requirements for platforms that route funds directly to sellers without holding them are unresolved and could materially affect the launch timeline and compliance posture.

## Decision question

Can Mosaic Relay lawfully enable limited card acceptance and seller payouts for a marketplace customer in the US, UK, and EU without holding funds, and what licensing, verification, and control conditions must be satisfied before launch in 1–3 months?

## Material facts

- Mosaic Relay is not a bank and does not hold or take deposits.
- The proposed flow provides a limited approval or review status within minutes, with enhanced review completed within one to three business days when needed.
- The customer would collect legal name, business name, address, tax details, ownership information, government identification, bank/payment destination details, and expected transaction volume.
- Mosaic Relay would run KYB/KYC checks, sanctions screening, identity verification, and fraud-risk scoring before enabling card acceptance and seller payouts.
- The business goal is to reduce onboarding time while allowing low-risk sellers to begin limited activity quickly.
- In which jurisdictions will the marketplace and its sellers operate? This drives money transmission, KYB/KYC, sanctions, and beneficial-owner requirements. — US, UK, and EU
- What seller categories and business types will the marketplace onboard, and does that include any high-risk categories (e.g., gambling, adult content, crypto, firearms, money services)? — General retail / services only
- What ownership percentage will trigger beneficial-owner verification for business sellers? — 25% (US FinCEN CDD standard)
- What are the expected transaction patterns — typical ticket sizes, monthly volumes, and cross-border activity? — Expected average ticket is about $75, with a $10–$500 range. A new marketplace may start at roughly 20,000 transactions per month and grow to $3M monthly volume. Sellers may be in the US, UK, and EU, with some cross-border card acceptance and payouts. No cash activity is expected.
- What is the target launch date for this onboarding flow? — 1-3 months
- What record-retention periods does Mosaic Relay currently apply (or plan to apply) for KYB/KYC and transaction records? — 6 years (UK/EU standard)
- How should the enhanced-review (1-3 business day) path be triggered — what conditions escalate a seller out of the minutes-level limited approval? — Both automated and manual
- When does the business need the legal answer? — Before a planned launch
- In the limited-approval window, does Mosaic Relay or the marketplace hold or control seller funds before enhanced review completes, or do funds flow directly to the seller's payout destination? — Direct to seller
- What sanctions-screening scope and frequency does Mosaic Relay plan to apply to sellers and beneficial owners? — Initial + ongoing re-screening
- What disclosures does Mosaic Relay plan to give sellers about the onboarding, review, and payout process? — Full terms + funds-flow disclosure
- What specific conditions trigger enhanced review (risk-score threshold, document flags, manual triggers)? — Automated risk-score threshold: Document/verification flags: Manual review triggers
- How frequently does Mosaic Relay plan to re-screen sellers and beneficial owners against sanctions lists? — Weekly
- Which countries or regions are in scope? — Multiple regions
- Specific risk-score threshold value and document/verification flag definitions for enhanced review — Escalate at a modeled risk score of 70/100 or higher; any sanctions potential match, failed identity or liveness check, inconsistent legal name/address/tax data, missing ownership evidence, unverifiable payout destination, or manual analyst concern also escalates. Do not enable acceptance or payouts while a potential sanctions match or identity failure remains unresolved.
- Is there any other fact that would materially change the advice? — No additional facts are confirmed. Treat seller categories, geographic coverage by country, retention and deletion rules, ownership thresholds outside the US, transaction patterns, licensing model, vendor locations, and escalation procedures as assumptions to validate before launch.

## Assumptions

- Mosaic Relay acts as a payment facilitator/infrastructure provider rather than holding funds, consistent with the company profile
- Mosaic Relay acts as a payment facilitator/infrastructure provider rather than holding funds, consistent with its profile and the direct-to-seller funds flow.
- The 6-year retention period is applied consistently across US, UK, and EU operations.
- The 25% beneficial-owner threshold applies across all three jurisdictions, though EU/UK rules may differ in detail.
- Seller categories are general retail/services only (no high-risk categories such as gambling, adult content, crypto, firearms, or money services).
- Beneficial-owner verification threshold is 25% consistent with the US FinCEN CDD standard.
- Record-retention period of 6 years applies across US, UK, and EU operations.
- Seller categories are general retail/services only (reported, not yet confirmed against high-risk list)
- Weekly re-screening cadence is sufficient for the cross-border US/UK/EU footprint
- Direct-to-seller funds flow avoids a holding-based money-transmission licensing trigger
- Seller categories are general retail/services only (no high-risk categories confirmed).
- Beneficial-owner threshold of 25% applies across all in-scope jurisdictions, though EU/UK rules may differ from US FinCEN CDD.
- Weekly re-screening cadence is sufficient for the risk profile; frequency may need to be higher for higher-risk sellers.
- Mosaic Relay's 6-year retention applies to KYB/KYC and transaction records across all in-scope jurisdictions.
- Seller categories are general retail/services only (no high-risk categories confirmed)
- Geographic coverage by country within US/UK/EU is not fully specified
- Retention and deletion rules beyond the 6-year UK/EU standard are not defined
- Ownership thresholds outside the US are not defined
- Licensing model (money transmission) is not confirmed
- Vendor locations are not specified
- Escalation procedures beyond the stated triggers are not fully defined

## Issues and workstreams

- Money transmission licensing exposure depends on jurisdiction and whether Mosaic Relay or the marketplace holds funds; direct-to-seller flow reduces but does not eliminate exposure
- Beneficial-owner verification scope depends on ownership thresholds and entity types; 25% US standard may not match UK/EU requirements
- Risk-based shortcut (minutes-level approval) must be reconciled with KYB/KYC and sanctions obligations; hard rule against acceptance/payouts on unresolved sanctions match or identity failure is the key control
- Sanctions screening scope and frequency depend on geographic coverage and customer base; weekly re-screening confirmed
- Cross-border payouts and $3M monthly volume keep money-transmission and sanctions exposure in scope
- Ongoing re-screening requires a defined cadence (weekly) and a mechanism to act on new sanctions hits
- Retention and deletion rules (6 years UK/EU) need to be reconciled with US and GDPR data minimization obligations

## Open questions

- Which specific US states will the marketplace and its sellers operate in, and do any of those states require money transmitter licenses for platforms that route funds directly to sellers without holding them?
- What are the UK and EU definitions of regulated payment services and acquiring, and do any exclusions apply to Mosaic Relay's direct-to-seller model?
- Does the marketplace or Mosaic Relay ever take possession or control of buyer funds, even momentarily, during settlement?
- What are the acquiring partner's licensing and compliance requirements, and how do they allocate responsibility for money transmission and sanctions screening?
- What are the specific seller categories, geographic coverage by country, and cross-border activity patterns that could trigger additional licensing or regulatory obligations?

## Research and source support

Latest review: `03_Matters/mosaic-relay-ux-test-01-risk-based-merchant-onboarding-for-a-mar-7576cf/research/RES-20260903-a7741d.md`

- Internal support: **Facts** — Known Facts Mosaic Relay is not a bank and does not hold or take deposits. The proposed flow provides a limited approval or review status within minutes, with enhanced review completed within one to…
- Internal support: **Dossier** — Matter dossier Matter summary Mosaic Relay, a payment infrastructure provider, is designing a risk-based onboarding flow for a marketplace customer to onboard sellers in the US, UK, and EU. The flow…
- Internal support: **Dos 20260903 404C82** — Matter dossier Matter summary Mosaic Relay, a payment infrastructure provider, is designing a risk-based onboarding flow for a marketplace customer to onboard sellers in the US, UK, and EU. The flow…
- Supplied source: **Supplied public legal research** — BOTTOM LINE — This question cannot be answered from the assembled context, and under the governing posture it must be escalated rather than answered. The provided materials contain no…

## Options or working recommendation

# Recommendation — Risk-Based Merchant Onboarding

## Executive recommendation
Proceed with a controlled, jurisdiction-gated pilot for general retail and services sellers. Permit minutes-level limited activity only after required identity and sanctions checks return clear results. Keep payouts disabled until enhanced review is complete and the seller's payout destination is verified. Treat this as a working recommendation, not a recorded decision.

## Required onboarding data
Collect the seller's legal name, trading name, formation and registration details, business address, operating locations, tax identification details, entity type, industry and goods/services, expected ticket size and volume, cross-border activity, ownership chart, each beneficial owner and control person, government ID and date of birth where required, sanctions-screening identifiers, and verified payout destination. Capture the marketplace relationship, seller terms acceptance, consent and notices, source and time of each check, result, reviewer, and reason for any override.

## Risk-based shortcut
For general retail/services sellers with no red flags, allow limited card acceptance after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative cap on volume, transaction count, and duration. Do not allow payouts during the limited window unless the payout destination and control person checks are complete. Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity or liveness, inconsistent legal name/address/tax data, missing ownership evidence, an unverifiable payout destination, unexpected velocity, or manual analyst concern. A potential sanctions match or identity failure is a hard stop for acceptance and payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions, and abnormal patterns should require enhanced review before any activity.

## Beneficial-owner standard
Use a 25% ownership threshold as the US baseline plus the control-person prong. Verify identity with documentary or reliable non-documentary evidence, reconcile ownership and control information, and record the method and result. Do not assume the US threshold is sufficient for UK/EU operations: map local rules, register checks, control definitions, and any lower or different thresholds before launch. Marketplace-led verification may be used only with written standards, audit rights, access to evidence, change notification, and Mosaic Relay oversight.

## Sanctions and fraud controls
Screen the seller, beneficial owners, control persons, and payout recipient against applicable US, UK, EU, and partner-required lists before activation. Re-screen at least weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership, blocking, rescreening, and release authority. Feed fraud and transaction monitoring into the same hold and review workflow.

## Disclosures and recordkeeping
Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, what data is collected and why, vendor involvement, screening and review timing, limited-activity limits, reasons for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention practices. Retain KYB/KYC, ownership, screening, decision, and transaction records for at least six years as the current cross-jurisdiction working standard, subject to a documented legal basis, minimization, deletion exceptions, and local requirements.

## Activation criteria
Enable limited card acceptance only when seller identity, business information, sanctions screening, fraud controls, and required marketplace attestations are complete and clear. Enable full acceptance only after enhanced review closes all flags. Enable payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination verification, and any acquiring-partner conditions are satisfied. Suspend or hold on new sanctions alerts, identity failure, material data change, unexplained velocity, or adverse review.

## Assumptions and missing facts
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace; verify the actual contracts and operational flow. Validate country-level coverage, seller categories, non-US ownership thresholds, licensing status and partner allocation, vendor locations and transfer terms, retention/deletion rules, escalation SLAs, chargeback/refund handling, payout timing, and acquiring-partner requirements.

## Unverified leads
The saved research is model-only and has no external authority retrieved. Treat references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law, and any CTA/BOI reporting position as leads for counsel to verify against current primary sources and the applicable contracts. A 50-state and country-by-country survey was not completed.

## Decision status
Recommendation only. No durable decision recorded. Lawyer review is required before launch.

## Executive recommendation
Proceed with a controlled, jurisdiction-gated pilot for general retail and services sellers. Permit minutes-level limited activity only after required identity and sanctions checks return clear results. Keep payouts disabled until enhanced review is complete and the seller's payout destination is verified. Treat this as a working recommendation, not a recorded decision.

## Required onboarding data
Collect the seller's legal name, trading name, formation and registration details, business address, operating locations, tax identification details, entity type, industry and goods/services, expected ticket size and volume, cross-border activity, ownership chart, each beneficial owner and control person, government ID and date of birth where required, sanctions-screening identifiers, and verified payout destination. Capture the marketplace relationship, seller terms acceptance, consent and notices, source and time of each check, result, reviewer, and reason for any override.

## Risk-based shortcut
For general retail/services sellers with no red flags, allow limited card acceptance after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative cap on volume, transaction count, and duration. Do not allow payouts during the limited window unless the payout destination and control person checks are complete. Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity or liveness, inconsistent legal name/address/tax data, missing ownership evidence, an unverifiable payout destination, unexpected velocity, or manual analyst concern. A potential sanctions match or identity failure is a hard stop for acceptance and payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions, and abnormal patterns should require enhanced review before any activity.

## Beneficial-owner standard
Use a 25% ownership threshold as the US baseline plus the control-person prong. Verify identity with documentary or reliable non-documentary evidence, reconcile ownership and control information, and record the method and result. Do not assume the US threshold is sufficient for UK/EU operations: map local rules, register checks, control definitions, and any lower or different thresholds before launch. Marketplace-led verification may be used only with written standards, audit rights, access to evidence, change notification, and Mosaic Relay oversight.

## Sanctions and fraud controls
Screen the seller, beneficial owners, control persons, and payout recipient against applicable US, UK, EU, and partner-required lists before activation. Re-screen at least weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership, blocking, rescreening, and release authority. Feed fraud and transaction monitoring into the same hold and review workflow.

## Disclosures and recordkeeping
Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, what data is collected and why, vendor involvement, screening and review timing, limited-activity limits, reasons for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention practices. Retain KYB/KYC, ownership, screening, decision, and transaction records for at least six years as the current cross-jurisdiction working standard, subject to a documented legal basis, minimization, deletion exceptions, and local requirements.

## Activation criteria
Enable limited card acceptance only when seller identity, business information, sanctions screening, fraud controls, and required marketplace attestations are complete and clear. Enable full acceptance only after enhanced review closes all flags. Enable payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination verification, and any acquiring-partner conditions are satisfied. Suspend or hold on new sanctions alerts, identity failure, material data change, unexplained velocity, or adverse review.

## Assumptions and missing facts
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace; verify the actual contracts and operational flow. Validate country-level coverage, seller categories, non-US ownership thresholds, licensing status and partner allocation, vendor locations and transfer terms, retention/deletion rules, escalation SLAs, chargeback/refund handling, payout timing, and acquiring-partner requirements.

## Unverified leads
The saved research is model-only and has no external authority retrieved. Treat references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law, and any CTA/BOI reporting position as leads for counsel to verify against current primary sources and the applicable contracts. A 50-state and country-by-country survey was not completed.

## Decision status
Recommendation only. No durable decision recorded. Lawyer review is required before launch.

## Executive recommendation
Proceed with a controlled, jurisdiction-gated pilot for general retail and services sellers. Permit minutes-level limited activity only after required identity and sanctions checks return clear results. Keep payouts disabled until enhanced review is complete and the seller's payout destination is verified. Treat this as a working recommendation, not a recorded decision.

## Required onboarding data
Collect the seller's legal name, trading name, formation and registration details, business address, operating locations, tax identification details, entity type, industry and goods/services, expected ticket size and volume, cross-border activity, ownership chart, each beneficial owner and control person, government ID and date of birth where required, sanctions-screening identifiers, and verified payout destination. Capture the marketplace relationship, seller terms acceptance, consent and notices, source and time of each check, result, reviewer, and reason for any override.

## Risk-based shortcut
For general retail/services sellers with no red flags, allow limited card acceptance after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative cap on volume, transaction count, and duration. Do not allow payouts during the limited window unless the payout destination and control person checks are complete. Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity or liveness, inconsistent legal name/address/tax data, missing ownership evidence, an unverifiable payout destination, unexpected velocity, or manual analyst concern. A potential sanctions match or identity failure is a hard stop for acceptance and payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions, and abnormal patterns should require enhanced review before any activity.

## Beneficial-owner standard
Use a 25% ownership threshold as the US baseline plus the control-person prong. Verify identity with documentary or reliable non-documentary evidence, reconcile ownership and control information, and record the method and result. Do not assume the US threshold is sufficient for UK/EU operations: map local rules, register checks, control definitions, and any lower or different thresholds before launch. Marketplace-led verification may be used only with written standards, audit rights, access to evidence, change notification, and Mosaic Relay oversight.

## Sanctions and fraud controls
Screen the seller, beneficial owners, control persons, and payout recipient against applicable US, UK, EU, and partner-required lists before activation. Re-screen at least weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership, blocking, rescreening, and release authority. Feed fraud and transaction monitoring into the same hold and review workflow.

## Disclosures and recordkeeping
Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, what data is collected and why, vendor involvement, screening and review timing, limited-activity limits, reasons for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention practices. Retain KYB/KYC, ownership, screening, decision, and transaction records for at least six years as the current cross-jurisdiction working standard, subject to a documented legal basis, minimization, deletion exceptions, and local requirements.

## Activation criteria
Enable limited card acceptance only when seller identity, business information, sanctions screening, fraud controls, and required marketplace attestations are complete and clear. Enable full acceptance only after enhanced review closes all flags. Enable payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination verification, and any acquiring-partner conditions are satisfied. Suspend or hold on new sanctions alerts, identity failure, material data change, unexplained velocity, or adverse review.

## Assumptions and missing facts
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace; verify the actual contracts and operational flow. Validate country-level coverage, seller categories, non-US ownership thresholds, licensing status and partner allocation, vendor locations and transfer terms, retention/deletion rules, escalation SLAs, chargeback/refund handling, payout timing, and acquiring-partner requirements.

## Unverified leads
The saved research is model-only and has no external authority retrieved. Treat references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law, and any CTA/BOI reporting position as leads for counsel to verify against current primary sources and the applicable contracts. A 50-state and country-by-country survey was not completed.

## Decision status
Recommendation only. No durable decision recorded. Lawyer review is required before launch.

## Executive recommendation
Proceed with a controlled, jurisdiction-gated pilot for general retail and services sellers. Permit minutes-level limited activity only after required identity and sanctions checks return clear results. Keep payouts disabled until enhanced review is complete and the seller's payout destination is verified. Treat this as a working recommendation, not a recorded decision.

## Required onboarding data
Collect the seller's legal name, trading name, formation and registration details, business address, operating locations, tax identification details, entity type, industry and goods/services, expected ticket size and volume, cross-border activity, ownership chart, each beneficial owner and control person, government ID and date of birth where required, sanctions-screening identifiers, and verified payout destination. Capture the marketplace relationship, seller terms acceptance, consent and notices, source and time of each check, result, reviewer, and reason for any override.

## Risk-based shortcut
For general retail/services sellers with no red flags, allow limited card acceptance after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative cap on volume, transaction count, and duration. Do not allow payouts during the limited window unless the payout destination and control person checks are complete. Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity or liveness, inconsistent legal name/address/tax data, missing ownership evidence, an unverifiable payout destination, unexpected velocity, or manual analyst concern. A potential sanctions match or identity failure is a hard stop for acceptance and payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions, and abnormal patterns should require enhanced review before any activity.

## Beneficial-owner standard
Use a 25% ownership threshold as the US baseline plus the control-person prong. Verify identity with documentary or reliable non-documentary evidence, reconcile ownership and control information, and record the method and result. Do not assume the US threshold is sufficient for UK/EU operations: map local rules, register checks, control definitions, and any lower or different thresholds before launch. Marketplace-led verification may be used only with written standards, audit rights, access to evidence, change notification, and Mosaic Relay oversight.

## Sanctions and fraud controls
Screen the seller, beneficial owners, control persons, and payout recipient against applicable US, UK, EU, and partner-required lists before activation. Re-screen at least weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership, blocking, rescreening, and release authority. Feed fraud and transaction monitoring into the same hold and review workflow.

## Disclosures and recordkeeping
Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, what data is collected and why, vendor involvement, screening and review timing, limited-activity limits, reasons for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention practices. Retain KYB/KYC, ownership, screening, decision, and transaction records for at least six years as the current cross-jurisdiction working standard, subject to a documented legal basis, minimization, deletion exceptions, and local requirements.

## Activation criteria
Enable limited card acceptance only when seller identity, business information, sanctions screening, fraud controls, and required marketplace attestations are complete and clear. Enable full acceptance only after enhanced review closes all flags. Enable payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination verification, and any acquiring-partner conditions are satisfied. Suspend or hold on new sanctions alerts, identity failure, material data change, unexplained velocity, or adverse review.

## Assumptions and missing facts
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace; verify the actual contracts and operational flow. Validate country-level coverage, seller categories, non-US ownership thresholds, licensing status and partner allocation, vendor locations and transfer terms, retention/deletion rules, escalation SLAs, chargeback/refund handling, payout timing, and acquiring-partner requirements.

## Unverified leads
The saved research is model-only and has no external authority retrieved. Treat references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law, and any CTA/BOI reporting position as leads for counsel to verify against current primary sources and the applicable contracts. A 50-state and country-by-country survey was not completed.

## Decision status
Recommendation only. No durable decision recorded. Lawyer review is required before launch.

## Executive recommendation
Proceed with a controlled, jurisdiction-gated pilot for general retail and services sellers. Permit minutes-level limited activity only after required identity and sanctions checks return clear results. Keep payouts disabled until enhanced review is complete and the seller's payout destination is verified. Treat this as a working recommendation, not a recorded decision.

## Required onboarding data
Collect the seller's legal name, trading name, formation and registration details, business address, operating locations, tax identification details, entity type, industry and goods/services, expected ticket size and volume, cross-border activity, ownership chart, each beneficial owner and control person, government ID and date of birth where required, sanctions-screening identifiers, and verified payout destination. Capture the marketplace relationship, seller terms acceptance, consent and notices, source and time of each check, result, reviewer, and reason for any override.

## Risk-based shortcut
For general retail/services sellers with no red flags, allow limited card acceptance after automated KYB/KYC, identity, sanctions, and fraud checks pass. Apply a conservative cap on volume, transaction count, and duration. Do not allow payouts during the limited window unless the payout destination and control person checks are complete. Escalate at risk score 70/100 or higher, a potential sanctions hit, failed identity or liveness, inconsistent legal name/address/tax data, missing ownership evidence, an unverifiable payout destination, unexpected velocity, or manual analyst concern. A potential sanctions match or identity failure is a hard stop for acceptance and payouts until resolved. High-risk categories, complex ownership, high-risk jurisdictions, and abnormal patterns should require enhanced review before any activity.

## Beneficial-owner standard
Use a 25% ownership threshold as the US baseline plus the control-person prong. Verify identity with documentary or reliable non-documentary evidence, reconcile ownership and control information, and record the method and result. Do not assume the US threshold is sufficient for UK/EU operations: map local rules, register checks, control definitions, and any lower or different thresholds before launch. Marketplace-led verification may be used only with written standards, audit rights, access to evidence, change notification, and Mosaic Relay oversight.

## Sanctions and fraud controls
Screen the seller, beneficial owners, control persons, and payout recipient against applicable US, UK, EU, and partner-required lists before activation. Re-screen at least weekly and on material changes, list updates, ownership changes, payout changes, and risk events. Define fuzzy-match handling, disposition evidence, escalation ownership, blocking, rescreening, and release authority. Feed fraud and transaction monitoring into the same hold and review workflow.

## Disclosures and recordkeeping
Give sellers clear terms and a funds-flow notice. Explain Mosaic Relay's role, that it is not a bank and does not hold deposits, what data is collected and why, vendor involvement, screening and review timing, limited-activity limits, reasons for holds or rejection, payout prerequisites, support and appeal routes, and privacy/retention practices. Retain KYB/KYC, ownership, screening, decision, and transaction records for at least six years as the current cross-jurisdiction working standard, subject to a documented legal basis, minimization, deletion exceptions, and local requirements.

## Activation criteria
Enable limited card acceptance only when seller identity, business information, sanctions screening, fraud controls, and required marketplace attestations are complete and clear. Enable full acceptance only after enhanced review closes all flags. Enable payouts only after beneficial-owner/control verification, sanctions clearance, payout-destination verification, and any acquiring-partner conditions are satisfied. Suspend or hold on new sanctions alerts, identity failure, material data change, unexplained velocity, or adverse review.

## Assumptions and missing facts
Assume direct-to-seller funds flow and no custody by Mosaic Relay or the marketplace; verify the actual contracts and operational flow. Validate country-level coverage, seller categories, non-US ownership thresholds, licensing status and partner allocation, vendor locations and transfer terms, retention/deletion rules, escalation SLAs, chargeback/refund handling, payout timing, and acquiring-partner requirements.

## Unverified leads
The saved research is model-only and has no external authority retrieved. Treat references to FinCEN CDD, UK MLR 2017/PSC, EU AMLD, state money-transmission law, and any CTA/BOI reporting position as leads for counsel to verify against current primary sources and the applicable contracts. A 50-state and country-by-country survey was not completed.

## Decision status
Recommendation only. No durable decision recorded. Lawyer review is required before launch.

## Next counsel action

Record manual delivery of the approved response.

## Work product links

- Draft: [Mosaic Relay UX Test — 01 — Counsel Report](03_Matters/mosaic-relay-ux-test-01-risk-based-merchant-onboarding-for-a-mar-7576cf/work-product/draft/mosaic-relay-ux-test-01-counsel-report-eb78b3.md)
- Final: [Mosaic Relay UX Test — 01 — Counsel Report](03_Matters/mosaic-relay-ux-test-01-risk-based-merchant-onboarding-for-a-mar-7576cf/work-product/final/mosaic-relay-ux-test-01-counsel-report-eb78b3-e96ee4.md)
