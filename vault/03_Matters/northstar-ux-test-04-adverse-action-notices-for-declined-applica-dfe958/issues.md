---
review:
  segments:
  - kind: equal
    text: '# Issue Map — Adverse Action Notices for Declined Applications


      ## Framing

      Launch-readiness analysis of Northstar Pay''s real-time approval / conditional
      approval / decline experience. Core deliverable: a practical notice and communications
      design that preserves accurate principal reasons while protecting fraud controls.
      Decision-maker may be Northstar Pay or a lending partner depending on flow —
      duties must be mapped per entity.


      ## Assumptions (flagged, unverified)

      1. Consumer credit covered by ECOA/Regulation B (adverse action notice duties).

      2. FCRA adverse-action duties apply when consumer-report information is used
      (§615(a) for credit decisions; §615(a)(1) reasons, bureau contact info, "free
      report" rights).

      3. Bank/lending-partner model where the partner may be the creditor in some
      flows and Northstar Pay in others.

      4. Electronic delivery of written notices is acceptable where ESIGN/UETA consent
      requirements are satisfied; otherwise postal mail.


      ## Issue 1 — Who is the creditor / decision-maker per flow?

      - Regulation B duties (notice, timing, principal reasons) attach to the creditor.

      - If a lending partner makes the decline, the partner generally owes the Regulation
      B notice; Northstar Pay may owe FCRA §615(a) duties if it takes adverse action
      based on a consumer report it obtained (e.g., fraud/identity screens, its own
      model).

      - Risk: dual or missing notices when both entities act on the application.


      ## Issue 2 — What triggers "adverse action"?

      - Decline: clearly adverse action.

      - Conditional approval: is it a counteroffer (Reg B §1002.2(a)(1) — counteroffer
      with notice of right to original terms if counteroffer not accepted) or a final
      approval on different terms?

      - Abandoned applications after decision: Reg B treats an incomplete application
      or applicant silence after counteroffer as specific scenarios with their own
      notice duties.

      - Real-time in-app message vs. written notice: does the in-app message satisfy
      the 30-day written notice, or is it a courtesy message with the written notice
      to follow?


      ## Issue 3 — Content: principal reasons vs. fraud controls

      - Regulation B §1002.9(b)(2) and FCRA §615(a) require specific principal reasons;
      "insufficient credit history," "high obligations," "unable to verify identity"
      are candidate reason codes.

      - Fraud-based declines: tension between accurate reasons and not tipping fraud
      controls. FCRA still requires accurate principal reasons when a consumer report
      is used; generic "does not meet our requirements" is generally insufficient.
      Need mapping of internal reason codes to compliant, non-revealing principal
      reasons.

      - Model-based decisions: document the mapping from model outputs to reason codes
      (also relevant to ECOA/Reg B model-risk expectations and any state requirements).


      ## Issue 4 — Timing and channel

      - Regulation B: 30 days from completed application (or counteroffer non-acceptance).

      - FCRA §615(a): "reasonable time" after adverse action — practice treats this
      as prompt, often aligned with the credit decision.

      - Email vs. postal mail: ESIGN consent for electronic written notices; state
      variations; delivery/retention evidence.


      ## Issue 5 — Vendor and partner responsibilities

      - Credit-reporting vendors: furnish bureau contact info, reason codes; accuracy.

      - Servicing/support scripts: consistent explanation of reasons; dispute handling
      (FCRA §611/§623 duties if furnisher).

      - Contract allocation: who issues, who retains records, who handles disputes
      and bureau disputes.


      ## Issue 6 — State overlay

      - State notice/disclosure requirements beyond federal (e.g., state credit statutes,
      credit-reporting notice rules in CO, CA, NY, TX, WA, GA, IL — current pay-in-4
      states); longer-term installment products may implicate state lending statutes
      with their own denial-notice rules.


      ## Facts needed (before launch language)

      1. Product structure per flow: who is the creditor (Northstar Pay vs. partner)
      for pay-in-4 vs. longer-term installments, by state.

      2. Which entity pulls the consumer report and which entity makes each decline
      type (credit, fraud, identity, partner).

      3. Model inputs and internal reason codes; mapping to principal reasons.

      4. Whether conditional approval is a counteroffer or final approval on modified
      terms.

      5. Notice channel and consent posture (ESIGN); timing of in-app message vs.
      written notice.

      6. State launch list for the new flow.

      7. Handling of abandoned applications post-decision.

      8. Vendor contracts: notice issuance, records, dispute routing.


      ## Research plan

      1. Regulation B adverse action: definition, counteroffer rules, incomplete/abandoned
      application rules, notice content and timing (§§1002.2, 1002.9, 1002.10, 1002.13).

      2. FCRA §615(a) adverse action notice content and timing; interplay with Reg
      B; fraud-screen declines.

      3. Dual-notice risk in bank-partner models; who owes what when both entities
      act.

      4. Reason-code adequacy: guidance on specificity; examples of compliant principal
      reasons for fraud/identity declines.

      5. ESIGN/electronic delivery of adverse action notices.

      6. State-specific denial notice requirements for launch states and installment
      products.

      7. Vendor/furnisher duties and contract allocation checklist.

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: false
  authors: []
  comment_events: []
---
# Issue Map — Adverse Action Notices for Declined Applications

## Framing
Launch-readiness analysis of Northstar Pay's real-time approval / conditional approval / decline experience. Core deliverable: a practical notice and communications design that preserves accurate principal reasons while protecting fraud controls. Decision-maker may be Northstar Pay or a lending partner depending on flow — duties must be mapped per entity.

## Assumptions (flagged, unverified)
1. Consumer credit covered by ECOA/Regulation B (adverse action notice duties).
2. FCRA adverse-action duties apply when consumer-report information is used (§615(a) for credit decisions; §615(a)(1) reasons, bureau contact info, "free report" rights).
3. Bank/lending-partner model where the partner may be the creditor in some flows and Northstar Pay in others.
4. Electronic delivery of written notices is acceptable where ESIGN/UETA consent requirements are satisfied; otherwise postal mail.

## Issue 1 — Who is the creditor / decision-maker per flow?
- Regulation B duties (notice, timing, principal reasons) attach to the creditor.
- If a lending partner makes the decline, the partner generally owes the Regulation B notice; Northstar Pay may owe FCRA §615(a) duties if it takes adverse action based on a consumer report it obtained (e.g., fraud/identity screens, its own model).
- Risk: dual or missing notices when both entities act on the application.

## Issue 2 — What triggers "adverse action"?
- Decline: clearly adverse action.
- Conditional approval: is it a counteroffer (Reg B §1002.2(a)(1) — counteroffer with notice of right to original terms if counteroffer not accepted) or a final approval on different terms?
- Abandoned applications after decision: Reg B treats an incomplete application or applicant silence after counteroffer as specific scenarios with their own notice duties.
- Real-time in-app message vs. written notice: does the in-app message satisfy the 30-day written notice, or is it a courtesy message with the written notice to follow?

## Issue 3 — Content: principal reasons vs. fraud controls
- Regulation B §1002.9(b)(2) and FCRA §615(a) require specific principal reasons; "insufficient credit history," "high obligations," "unable to verify identity" are candidate reason codes.
- Fraud-based declines: tension between accurate reasons and not tipping fraud controls. FCRA still requires accurate principal reasons when a consumer report is used; generic "does not meet our requirements" is generally insufficient. Need mapping of internal reason codes to compliant, non-revealing principal reasons.
- Model-based decisions: document the mapping from model outputs to reason codes (also relevant to ECOA/Reg B model-risk expectations and any state requirements).

## Issue 4 — Timing and channel
- Regulation B: 30 days from completed application (or counteroffer non-acceptance).
- FCRA §615(a): "reasonable time" after adverse action — practice treats this as prompt, often aligned with the credit decision.
- Email vs. postal mail: ESIGN consent for electronic written notices; state variations; delivery/retention evidence.

## Issue 5 — Vendor and partner responsibilities
- Credit-reporting vendors: furnish bureau contact info, reason codes; accuracy.
- Servicing/support scripts: consistent explanation of reasons; dispute handling (FCRA §611/§623 duties if furnisher).
- Contract allocation: who issues, who retains records, who handles disputes and bureau disputes.

## Issue 6 — State overlay
- State notice/disclosure requirements beyond federal (e.g., state credit statutes, credit-reporting notice rules in CO, CA, NY, TX, WA, GA, IL — current pay-in-4 states); longer-term installment products may implicate state lending statutes with their own denial-notice rules.

## Facts needed (before launch language)
1. Product structure per flow: who is the creditor (Northstar Pay vs. partner) for pay-in-4 vs. longer-term installments, by state.
2. Which entity pulls the consumer report and which entity makes each decline type (credit, fraud, identity, partner).
3. Model inputs and internal reason codes; mapping to principal reasons.
4. Whether conditional approval is a counteroffer or final approval on modified terms.
5. Notice channel and consent posture (ESIGN); timing of in-app message vs. written notice.
6. State launch list for the new flow.
7. Handling of abandoned applications post-decision.
8. Vendor contracts: notice issuance, records, dispute routing.

## Research plan
1. Regulation B adverse action: definition, counteroffer rules, incomplete/abandoned application rules, notice content and timing (§§1002.2, 1002.9, 1002.10, 1002.13).
2. FCRA §615(a) adverse action notice content and timing; interplay with Reg B; fraud-screen declines.
3. Dual-notice risk in bank-partner models; who owes what when both entities act.
4. Reason-code adequacy: guidance on specificity; examples of compliant principal reasons for fraud/identity declines.
5. ESIGN/electronic delivery of adverse action notices.
6. State-specific denial notice requirements for launch states and installment products.
7. Vendor/furnisher duties and contract allocation checklist.
