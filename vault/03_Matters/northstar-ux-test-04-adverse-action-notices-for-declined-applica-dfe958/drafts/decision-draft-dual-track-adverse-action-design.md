---
matter_id: MAT-20260830-dfe958
record_type: decision_draft
status: draft_not_recorded
decision_owner: Alex Morgan
privilege: privileged_and_confidential
---
# Fictional internal decision draft — not recorded

**Status:** Draft for review by Alex Morgan. This is a fictional internal decision draft. It has **not** been recorded as a durable decision. Recording requires an explicit instruction from Alex Morgan.

**Matter:** Northstar UX Test — 04 — Adverse Action Notices for Declined Applications
**Decision owner:** Alex Morgan
**Prepared by:** Brian Harris (analysis and drafting)

## Decision question

Should Northstar Pay adopt the dual-track adverse-action notice design for the new real-time application flow before the holiday shopping season?

## Proposed decision

Adopt the dual-track adverse-action notice design for **limited launch planning only**. Do **not** enable any customer-facing decline path until the five gates below are verified.

Key design elements of the adopted design:

1. **The in-app real-time message is interim.** It is a courtesy/interim communication only and does not satisfy the legally required written notice unless and until Legal verifies otherwise for a specific product and channel.
2. **The written notice must use email only where confirmed ESIGN consent and access/retention procedures exist; otherwise postal mail.** No other electronic channel is approved for the required written notice.
3. **Any Northstar Pay FCRA report-user role must be analyzed separately from a lending partner's creditor notice.** If Northstar Pay independently uses a consumer report (e.g., for fraud or identity screening), its own FCRA §615(a) duties are assessed independently, even when the partner issues the creditor's Regulation B notice.

## Rationale

- The dual-track design preserves accurate, useful principal reasons while protecting fraud controls, and creates a control record (the written notice) for every adverse action.
- The per-flow matrix prevents dual or missing notices in the bank-partner model, where the decision-maker may be Northstar Pay or a lending partner depending on flow.
- Planning-only scope lets Product build toward the holiday window without exposing the company to notice risk before the gates are confirmed.

## Conditions (launch gates — all five must be verified before customer-facing enablement)

1. **Per-flow creditor / report-user matrix** confirmed for every product, state, outcome, and decision path.
2. **Counteroffer classification** — conditional approval classified as counteroffer or final approval on modified terms.
3. **Current federal and state requirements** verified against current authoritative text, including state overlays for the launch-state list.
4. **Reason-code mapping** — versioned mapping from model/rules output to truthful principal reasons approved by Legal.
5. **ESIGN consent evidence** confirmed for email delivery, with postal mail as the default where consent is absent.

## Owners

- **Decision and final legal approval:** Alex Morgan
- **Analysis and drafting:** Brian Harris
- **Product:** [CONFIRM — named owner]
- **Compliance:** [CONFIRM — named owner]
- **Operations:** [CONFIRM — named owner]
- **Each lender partner:** [CONFIRM — named owner per partner]

## Assumptions (flagged, unverified)

1. The product is consumer credit covered by ECOA/Regulation B.
2. FCRA adverse-action duties may apply when consumer-report information contributes to a decision.
3. Creditor identity may differ by flow (Northstar Pay vs. lending partner).
4. Electronic delivery requires valid ESIGN consent; otherwise postal mail.

## Missing facts

- Product structure and creditor per flow (pay-in-4 vs. longer-term installments, by state).
- Which entity obtains/uses a consumer report per decision type.
- Counteroffer vs. final-approval classification for conditional approvals.
- Launch-state list and state-specific denial-notice overlays.
- Model inputs, internal reason codes, and mapping to principal reasons.
- ESIGN consent and access-procedure evidence.
- Handling of applications abandoned after a decision.

## Unverified legal leads

- Regulation B adverse-action definition, counteroffer, incomplete-application, and timing rules.
- FCRA §615(a) notice content and timing.
- ESIGN/UETA electronic-delivery requirements.
- State-specific denial-notice requirements for launch states.

## Review note

The state list, current federal text, model mapping, and consent evidence **remain unverified**. All legal references in this draft are first-pass leads and must be checked against current authoritative sources and actual product evidence before the decision is recorded or any customer-facing path is enabled.

## Distinction from a recorded decision

This document is a fictional internal decision draft prepared for review and editing. It is not a recorded decision. No approval, delivery, or matter closure is effected by this draft. Recording this decision requires an explicit instruction from Alex Morgan.
