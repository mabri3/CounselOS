---
work_product_id: WP-5a14bdbbdcc0
matter_id: MAT-20260902-475535
title: Mosaic Relay UX Test — 03 — ACH Payment Holds for Suspicious Merchant Activity
  response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:48:39+00:00'
updated_at: '2026-09-02T14:48:39+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-475535:MSG-20260902-4a71ee
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'LEGAL WORK PRODUCT — ACH PAYMENT HOLDS FOR SUSPICIOUS MERCHANT ACTIVITY


      Status: Working draft for lawyer review. This document is legal analysis, not
      a recorded business decision.


      1. Executive recommendation


      Proceed only as a controlled design review. Use a short, documented hold to
      prevent a pending debit, credit, or seller payout from moving while Payment
      Operations investigates a specific risk signal. Keep the initial hold at 24
      hours unless the applicable ACH partner rules and contract clearly support more
      time. Any extension should be time-limited, recorded, approved by the named
      risk manager, and subject to a documented review cadence. Release funds promptly
      when the review'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' is complete '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'or legitimacy is confirmed.


      The product should describe the event as a temporary risk review. It should
      not state or imply that the merchant or transaction violated law. Give the affected
      merchant a plain explanation of the review, the expected next update, and a
      support path. Do not rely on a generic notice alone for consumer-facing or unauthorized-debit
      issues.


      2. Request and scope


      Mosaic Relay wants a continuous control that pauses ACH debits, credits, and
      seller payouts when transaction-risk signals exceed a threshold. Signals may
      include sudden volume growth, account-takeover indicators, return rates, sanctions-screening
      matches, and mismatch between merchant profile and transaction behavior. The
      actors include Mosaic Relay, merchants, payers, recipients, acquiring and ACH
      partners, fraud analysts, and support teams.


      The requested advice covers hold and extension periods, notices, records, complaints,
      money transmission, unfair practices, and unauthorized debits. This is a U.S./NACHA
      working analysis only. No jurisdiction-specific conclusion is verified in this
      draft.


      3. Recorded facts


      • The purpose is to reduce fraud loss and avoid sending funds that may later
      be returned.


      • The planned initial hold is 24 hours. Extensions require risk-manager approval.


      • The control is not described as a legal determination.


      • Funds are released after review or confirmation of legitimacy.


      • Mosaic Relay is recorded in intake as a non-bank that does not hold deposits.


      • Intake recorded the jurisdiction, custody, consumer involvement, partner terms,
      notice plan, and launch timing as unresolved or assumed.


      4. Assumptions and missing facts


      Working assumptions: U.S. ACH activity; funds remain '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: with
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' an acquiring or ACH partner and are not in Mosaic Relay custody; holds
      are temporary; and the product is still in design.


      Material missing facts: merchant, payer, and recipient locations; whether payments
      are consumer-originated, B2B, or mixed; who legally controls funds during a
      hold; whether a segregated account is used; exact ACH return and reversal mechanics;
      maximum hold and extension limits; partner contracts and NACHA roles; notice
      content and delivery timing; closure and escalation rules; complaint SLAs; sanctions-screening
      workflow; and whether any state licensing or registration applies.


      5. Legal analysis


      A. ACH and hold timing


      A hold must fit the applicable ACH operator, originating/depository financial
      institution, processor, and partner rules. The 24-hour period is a risk-control
      proposal, not a safe harbor. A longer or repeated hold can create a dispute
      if it delays settlement, return handling, or access to funds without a clear
      contractual and operational basis. Extensions should require a specific reason,
      named approver, expiry time, audit entry, and a second review. The system should
      prevent an open-ended hold and should measure time from the transaction event
      that triggered the hold.


      B. Consumer and unauthorized-debit risk


      If a consumer account is involved, Regulation E and error-resolution or unauthorized-transfer
      duties may apply depending on the transaction and the parties'' roles. A risk
      hold does not cure an unauthorized debit. Preserve the consumer''s complaint
      and investigation path, avoid making the consumer prove a negative, and do not
      use a generic merchant notice as a substitute for any required consumer notice.
      The product must separate a fraud review from a decision that an authorization
      was invalid.


      C. Money transmission


      The strongest fact for a lower licensing risk is that Mosaic Relay does not
      take custody and that a partner controls settlement. That fact is not confirmed
      for every flow. If Mosaic Relay receives, controls, or directs funds, or if
      it can independently delay or reroute settlement, the money-transmission analysis
      can change. Map each flow, party, funds account, settlement instruction, and
      authority to release before launch. Obtain partner confirmation of roles and
      any required state-law coverage.


      D. Unfair or deceptive practices


      A generic explanation can reduce disclosure of detection methods, but it must
      still be accurate and useful. Do not promise a fixed release date if extensions
      are possible. State that review is ongoing, give a next-update time, explain
      how to contact support, and use consistent criteria. Apply the control proportionately.
      High false-positive rates, unexplained repeated extensions, or closure without
      a clear process could create unfairness risk. Sanctions matches require careful
      handling because the match may be unconfirmed.


      E. Recordkeeping and complaints


      Keep the triggered signal, score or threshold result, timestamps, transaction
      and account identifiers, hold and release events, notice versions, partner instructions,
      reviewer identity, reason for each extension, complaint, investigation outcome,
      and final disposition. Keep records long enough to satisfy applicable ACH, consumer-protection,
      sanctions, partner, and state requirements. Give Support a written escalation
      path and a way to correct a false positive. Report metrics by merchant, consumer
      impact, hold duration, extension count, return outcome, complaint, and release
      time.


      6. Minimum operating controls


      • Partner sign-off on each payment flow and custody model.


      • A 24-hour default expiry with a hard maximum pending legal and partner confirmation.


      • Risk-manager approval for each extension; no silent renewals.


      • Merchant notice at hold start and at each material status change.


      • Consumer-specific notice and error-resolution handling where applicable.


      • Separate sanctions escalation and restricted-party review.


      • Release, return, or closure reason codes.


      • Complete audit trail and weekly exception review.


      • Support script that avoids legal conclusions and promises only the next update.


      7. Unverified research leads


      These are leads for verification, not verified citations: NACHA Operating Rules
      on return, reversal, settlement, and participant obligations; Regulation E,
      12 C.F.R. part 1005, for consumer transfers and error resolution; federal and
      state money-transmission definitions and exemptions; FTC unfair/deceptive-practice
      guidance; applicable sanctions-screening and blocked-property rules; and each
      acquiring/ACH partner agreement. Confirm'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' the current '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'text, scope, effective dates, and state coverage before relying on any
      lead.


      8. Recommendation and decision state


      Recommendation: use a partner-controlled, 24-hour hold with documented, non-automatic
      extensions; provide accurate, time-bound notices; preserve consumer complaint
      rights; and complete a flow-by-flow custody and partner review before launch.
      Treat longer holds, closure, or any Mosaic Relay custody as a separate approval
      gate.


      Decision: No business or legal decision is recorded in Counsel OS. Lawyer review
      is required'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '. The '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: recommendation
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'remains separate from any future decision.


      9. Next questions


      1. Where are merchants, payers,'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' and '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: recipients
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'located?


      2.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Do
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: funds
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: stay with
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' the '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'partner, move to a segregated account, or come under Mosaic Relay control?


      3. Are consumer-originated payments in scope?


      4. What is the absolute maximum hold'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' and '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'extension period?


      5'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: .
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' What do partner agreements and ACH roles permit?


      6. What notices go to merchants, payers, and recipients, and when?


      7. What are the closure, escalation, and complaint SLAs?


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
LEGAL WORK PRODUCT — ACH PAYMENT HOLDS FOR SUSPICIOUS MERCHANT ACTIVITY

Status: Working draft for lawyer review. This document is legal analysis, not a recorded business decision.

1. Executive recommendation

Proceed only as a controlled design review. Use a short, documented hold to prevent a pending debit, credit, or seller payout from moving while Payment Operations investigates a specific risk signal. Keep the initial hold at 24 hours unless the applicable ACH partner rules and contract clearly support more time. Any extension should be time-limited, recorded, approved by the named risk manager, and subject to a documented review cadence. Release funds promptly when the review is complete or legitimacy is confirmed.

The product should describe the event as a temporary risk review. It should not state or imply that the merchant or transaction violated law. Give the affected merchant a plain explanation of the review, the expected next update, and a support path. Do not rely on a generic notice alone for consumer-facing or unauthorized-debit issues.

2. Request and scope

Mosaic Relay wants a continuous control that pauses ACH debits, credits, and seller payouts when transaction-risk signals exceed a threshold. Signals may include sudden volume growth, account-takeover indicators, return rates, sanctions-screening matches, and mismatch between merchant profile and transaction behavior. The actors include Mosaic Relay, merchants, payers, recipients, acquiring and ACH partners, fraud analysts, and support teams.

The requested advice covers hold and extension periods, notices, records, complaints, money transmission, unfair practices, and unauthorized debits. This is a U.S./NACHA working analysis only. No jurisdiction-specific conclusion is verified in this draft.

3. Recorded facts

• The purpose is to reduce fraud loss and avoid sending funds that may later be returned.

• The planned initial hold is 24 hours. Extensions require risk-manager approval.

• The control is not described as a legal determination.

• Funds are released after review or confirmation of legitimacy.

• Mosaic Relay is recorded in intake as a non-bank that does not hold deposits.

• Intake recorded the jurisdiction, custody, consumer involvement, partner terms, notice plan, and launch timing as unresolved or assumed.

4. Assumptions and missing facts

Working assumptions: U.S. ACH activity; funds remain with an acquiring or ACH partner and are not in Mosaic Relay custody; holds are temporary; and the product is still in design.

Material missing facts: merchant, payer, and recipient locations; whether payments are consumer-originated, B2B, or mixed; who legally controls funds during a hold; whether a segregated account is used; exact ACH return and reversal mechanics; maximum hold and extension limits; partner contracts and NACHA roles; notice content and delivery timing; closure and escalation rules; complaint SLAs; sanctions-screening workflow; and whether any state licensing or registration applies.

5. Legal analysis

A. ACH and hold timing

A hold must fit the applicable ACH operator, originating/depository financial institution, processor, and partner rules. The 24-hour period is a risk-control proposal, not a safe harbor. A longer or repeated hold can create a dispute if it delays settlement, return handling, or access to funds without a clear contractual and operational basis. Extensions should require a specific reason, named approver, expiry time, audit entry, and a second review. The system should prevent an open-ended hold and should measure time from the transaction event that triggered the hold.

B. Consumer and unauthorized-debit risk

If a consumer account is involved, Regulation E and error-resolution or unauthorized-transfer duties may apply depending on the transaction and the parties' roles. A risk hold does not cure an unauthorized debit. Preserve the consumer's complaint and investigation path, avoid making the consumer prove a negative, and do not use a generic merchant notice as a substitute for any required consumer notice. The product must separate a fraud review from a decision that an authorization was invalid.

C. Money transmission

The strongest fact for a lower licensing risk is that Mosaic Relay does not take custody and that a partner controls settlement. That fact is not confirmed for every flow. If Mosaic Relay receives, controls, or directs funds, or if it can independently delay or reroute settlement, the money-transmission analysis can change. Map each flow, party, funds account, settlement instruction, and authority to release before launch. Obtain partner confirmation of roles and any required state-law coverage.

D. Unfair or deceptive practices

A generic explanation can reduce disclosure of detection methods, but it must still be accurate and useful. Do not promise a fixed release date if extensions are possible. State that review is ongoing, give a next-update time, explain how to contact support, and use consistent criteria. Apply the control proportionately. High false-positive rates, unexplained repeated extensions, or closure without a clear process could create unfairness risk. Sanctions matches require careful handling because the match may be unconfirmed.

E. Recordkeeping and complaints

Keep the triggered signal, score or threshold result, timestamps, transaction and account identifiers, hold and release events, notice versions, partner instructions, reviewer identity, reason for each extension, complaint, investigation outcome, and final disposition. Keep records long enough to satisfy applicable ACH, consumer-protection, sanctions, partner, and state requirements. Give Support a written escalation path and a way to correct a false positive. Report metrics by merchant, consumer impact, hold duration, extension count, return outcome, complaint, and release time.

6. Minimum operating controls

• Partner sign-off on each payment flow and custody model.

• A 24-hour default expiry with a hard maximum pending legal and partner confirmation.

• Risk-manager approval for each extension; no silent renewals.

• Merchant notice at hold start and at each material status change.

• Consumer-specific notice and error-resolution handling where applicable.

• Separate sanctions escalation and restricted-party review.

• Release, return, or closure reason codes.

• Complete audit trail and weekly exception review.

• Support script that avoids legal conclusions and promises only the next update.

7. Unverified research leads

These are leads for verification, not verified citations: NACHA Operating Rules on return, reversal, settlement, and participant obligations; Regulation E, 12 C.F.R. part 1005, for consumer transfers and error resolution; federal and state money-transmission definitions and exemptions; FTC unfair/deceptive-practice guidance; applicable sanctions-screening and blocked-property rules; and each acquiring/ACH partner agreement. Confirm the current text, scope, effective dates, and state coverage before relying on any lead.

8. Recommendation and decision state

Recommendation: use a partner-controlled, 24-hour hold with documented, non-automatic extensions; provide accurate, time-bound notices; preserve consumer complaint rights; and complete a flow-by-flow custody and partner review before launch. Treat longer holds, closure, or any Mosaic Relay custody as a separate approval gate.

Decision: No business or legal decision is recorded in Counsel OS. Lawyer review is required. The recommendation remains separate from any future decision.

9. Next questions

1. Where are merchants, payers, and recipients located?

2. Do funds stay with the partner, move to a segregated account, or come under Mosaic Relay control?

3. Are consumer-originated payments in scope?

4. What is the absolute maximum hold and extension period?

5. What do partner agreements and ACH roles permit?

6. What notices go to merchants, payers, and recipients, and when?

7. What are the closure, escalation, and complaint SLAs?
