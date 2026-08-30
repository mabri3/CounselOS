---
matter_id: MAT-20260830-d76eef
record_type: work_product
work_product_type: legal_memo
author: Themis
reviewer: Alex Morgan
status: draft
privilege: privileged_and_confidential
review:
  segments:
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '# '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '19. Counsel edits — reviewed by Alex Morgan


      # Editorial decision:


      # The pilot recommendation is narrowed to an ACH-first path. Debit-card autopay
      remains a fallback design that needs separate processor and network review.
      This edit is generated analysis for product discussion. It is not a final legal
      conclusion.


      # Priority edit 1 — authorization and consent:


      # Do not ship a generic “recurring payments” checkbox. Show the rail, the authorization
      amount or exact variable-amount method, payment dates, the next amount and date,
      the cancellation path, and the effect of an incentive in the same review step.
      Capture the exact text, timestamp, customer action, channel, and version. Treat
      the bracketed formula in the draft as a missing fact, not as approved copy.


      # Priority edit 2 — changed amounts:


      # For a refund, partial dispute, returned payment, or account adjustment, recalculate
      the next amount before any withdrawal. Compare the amount shown in the app with
      the amount in the reminder. If they do not match, or if the source event is
      unresolved, pause the withdrawal and all retries, notify the customer, and route
      the item to the designated escalation owner. Path A notice controls apply where
      Path B''s method or notice record is not confirmed.


      # Priority edit 3 — failed payments and backup methods:


      # Start with customer notice and a self-service “pay now” or “change method”
      option. Use bounded retries only after the retry count, interval, fees, rail
      rules, and state limits are confirmed. Do not charge a backup method unless
      the customer gave separate, specific authorization for that method and the record
      identifies the authorization relied upon. A backup method is not implied by
      primary autopay consent.


      # Priority edit 4 — cancellation and service:


      # Make cancellation visible in the same place as enrollment and available in
      the app. Give an immediate confirmation with the effective cycle and remaining
      loan balance. Customer service must be able to see the authorization version,
      next amount/date, notices, delivery status, retries, disputes, and cancellation
      timestamp. A complaint about authorization or amount mismatch pauses collection
      activity until reviewed.


      # Launch disposition:


      # Proceed only with a gated pilot after the partner map, state/product scope,
      authorization copy, reminder delivery, retry policy, dispute pause, cancellation
      cutoff, incentive terms, and evidence retention are confirmed. If any gate fails,
      delay that state, product, partner, or rail. [Unverified lead] The specific
      legal result may vary by jurisdiction and payment rail.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'Autopay Enrollment and Payment Authorization — Launch Advice


      **To:** Alex Morgan, Product Counsel, Northstar Pay

      **Matter:** Northstar UX Test — 05 — Autopay Enrollment and Payment Authorization

      **Status:** Privileged & Confidential — Attorney Work Product

      **Date:** 2026-08-30

      **Verification status:** All legal propositions in this memo are **unverified
      leads** pending jurisdiction, product, and partner confirmation. No citations
      are included because none have been verified; do not rely on this memo as final
      legal advice without that confirmation.


      ---


      ## 1. Executive Summary


      Northstar Pay wants to make autopay enrollment easier for installment-loan customers
      to reduce missed payments while preserving customer control over the repayment
      method. The proposed experience enrolls customers at checkout or in the app,
      shows the next payment amount and date, allows payment-method changes, sends
      pre-withdrawal reminders, and may offer an enrollment incentive. The product
      team is also considering retrying failed payments and using a backup payment
      method.


      **Recommendation (conservative pilot):**


      1. **Path B (variable-amount authorization with a precise disclosed method)
      for ACH only**, paired with reliable pre-withdrawal reminders that display the
      current amount. Use Path B only where the disclosed method can be stated precisely
      and the servicer can guarantee reminder delivery with records.

      2. **Path A (fixed-amount authorization plus advance notice on any change)**
      whenever the variable-amount method cannot be stated precisely or the servicer''s
      notice capability is unconfirmed — including for debit-card rails.

      3. **No automatic backup payment method** without separate, specific authorization
      obtained at or before enrollment.

      4. **Pause disputed or unclear withdrawals** until resolved; do not retry or
      pull from a backup method while a dispute is open.

      5. **Self-service cancellation** effective before the next scheduled withdrawal,
      with confirmation.


      The six-week launch is an internal planning target, not an approval deadline.
      The launch gates in Section 15 should govern timing, not the calendar.


      ---


      ## 2. Business Goal and Scope


      - **Goal:** Reduce missed payments on installment loans by making autopay enrollment
      easy, while giving customers control over the bank account or debit card used
      for repayment.

      - **Proposed experience:** Autopay selection at checkout or in the app; display
      of next payment amount and date; payment-method changes; pre-withdrawal reminders;
      possible enrollment discount or incentive.

      - **Actors:** Customers, Northstar Pay, payment processors, banks, lending partners,
      servicing vendors.

      - **Timing:** Six weeks (internal planning target only).


      ---


      ## 3. Facts, Assumptions, and Missing Facts


      ### Supplied facts'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Payment amounts can change after refunds, partial disputes, returned
      payments, or account adjustments.

      - The product team is considering retrying failed payments and using a backup
      payment method when the primary method fails.

      - The requester is Alex Morgan, product counsel for Northstar Pay (fictional
      BNPL company).

      - The six-week launch is an internal planning target, not an approval deadline.


      ### Assumptions (open, to be confirmed)'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Initial rollout is US-only.

      - Both ACH bank accounts and debit cards may be offered as autopay payment methods.

      - Customers can enroll at checkout or in the app.

      - The loan servicer may send notices and reminders.

      - No customer-specific account data was supplied for this review.


      ### Missing facts (to be gathered before launch)'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'Exact states in scope; loan products in scope (pay-in-4 vs. longer-term
      installments); payment processors involved; lending partners involved; servicer
      roles and responsibilities; fee and discount/incentive terms; proposed authorization
      copy; notice channels and timing; retry count and intervals; backup-method sequencing;
      cancellation cutoffs (how far before a withdrawal cancellation remains effective);
      complaint/escalation ownership.


      **Labeling convention:** Statements below marked *[Lead]* are unverified legal
      leads; *[Assumption]* restates an open assumption; *[Analysis]* is generated
      analysis, not verified law.


      ---


      ## 4. Issue Map


      1. **Recurring ACH authorization** (Regulation E / NACHA) — written authorization
      content and retention; notice of varying amounts; stop-payment rights; error
      resolution. *[Lead]*

      2. **Debit-card recurring payments** (Regulation E / card-network rules) — stored
      credentials, retries, merchant-initiated transactions; differences from ACH
      on cancellation and disputes. *[Lead]*

      3. **Consent and enrollment UX** — clear, conspicuous, affirmative consent;
      no pre-checked boxes or dark patterns; authorization must state amount (or variable-amount
      method), timing, and cancellation method; E-SIGN/UETA. *[Lead]*

      4. **Failed payments, retries, and backup methods** — permissible retry counts
      and fees; whether a backup method requires separate authorization. *[Lead]*

      5. **Enrollment incentive** — credit, UDAP/UDAAP, and state incentive concerns;
      disclosure of terms. *[Lead]*

      6. **Reminders and notices** — timing, content, channel; messaging consent (TCPA/communications
      preferences). *[Lead]*

      7. **Cancellation rights** — self-service, timing before next withdrawal, confirmation.
      *[Lead]*

      8. **Servicing, collections, vendor oversight** — servicer/processor responsibilities;
      state servicing and collections conduct; credit-reporting accuracy; partner-map
      confirmation per company rollout policy. *[Lead]*

      9. **State-by-state availability** — no state is automatically available; the
      autopay experience must be validated per state/product/partner. *[Lead]*


      **Open issue questions:**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '1. Do payment amount changes require fresh consent, or is advance notice
      sufficient? How do refunds, partial disputes, returned payments, and account
      adjustments affect the scheduled amount and required notices?

      2. Are the proposed reminders legally sufficient (content, timing, channel)
      and operationally reliable (delivery, servicer coordination)?

      3. How is the enrollment incentive presented — clear, non-misleading, adequately
      disclosed?

      4. What evidence of consent, authorization, and cancellation must be retained,
      for how long, and in what form?


      ---


      ## 5. Enrollment Flow and Authorization Language


      ### 5.1 General principles *[Lead/Analysis]*'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Consent must be affirmative, unbundled from other consents, and not pre-selected.

      - The authorization must state: the amount (or the precise method by which a
      variable amount is determined), the timing/schedule of withdrawals, the rail
      (ACH or debit), the customer''s right to cancel and how, and (for ACH) the bank-account
      identity.

      - Present the authorization immediately before or at the moment of the affirmative
      action, with the key terms visible without scrolling where feasible.


      ### 5.2 ACH — Path B (recommended where method is precise and reminders are
      reliable)


      Sample authorization copy (draft for legal review, not final):


      > "I authorize Northstar Pay [and its servicing partner, if applicable] to electronically
      debit my bank account identified above on the scheduled payment dates in amounts
      that may vary. The amount of each withdrawal will be [PRECISE METHOD — e.g.,
      ''my remaining balance divided by the number of remaining scheduled installments,
      adjusted for refunds, resolved disputes, returned payments, and account adjustments
      applied to my account'']. I will see the exact amount of my next withdrawal
      in the reminder sent before each withdrawal and in the app. I may cancel this
      authorization at any time before the next scheduled withdrawal by [self-service
      method], and I may stop payment through my bank."


      **Conditions for using Path B:**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- The bracketed method must be a real, formulaic calculation the servicing
      system actually performs — not a vague catch-all.

      - Pre-withdrawal reminders must display the current amount and date, with delivery
      records.

      - If the method cannot be stated precisely, fall back to Path A.


      ### 5.3 ACH — Path A (fallback)


      > "I authorize Northstar Pay [and its servicing partner] to electronically debit
      my bank account identified above in the amount of $[X] on [date/schedule]. If
      the amount or date of any withdrawal changes for any reason (including refunds,
      disputes, returned payments, or account adjustments), I will receive advance
      notice before the withdrawal. I may cancel this authorization at any time before
      the next scheduled withdrawal by [self-service method]."


      Path A requires a notice obligation on every change; a missed notice is a compliance
      failure. Use it when Path B''s conditions are not met, or where state law requires
      specific advance notice of changed amounts. *[Lead]*


      ### 5.4 Debit card


      - Recommend **Path A only** for debit rails: fixed-amount authorization plus
      advance notice on changes. Card-network rules on recurring and variable debit
      transactions are stricter, and a variable-amount debit authorization is more
      likely to be challenged. *[Lead/Analysis]*

      - Stored-credential and merchant-initiated transaction rules must be confirmed
      with the processor and card networks before launch. *[Lead]*

      - Cancellation and dispute rights differ from ACH; the enrollment copy should
      not imply identical mechanics across rails.


      ---


      ## 6. E-SIGN and Consent Capture


      - Electronic consent and disclosures require E-SIGN compliance: reasonable demonstration
      of the customer''s ability to access the electronic record, and affirmative
      consent to receive it electronically. *[Lead]*

      - Capture and retain: the exact authorization text presented, timestamp, channel,
      UI state (no pre-checked boxes), and the customer''s affirmative action.

      - If disclosures are delivered by the servicer rather than Northstar Pay, confirm
      contractually who is responsible for E-SIGN compliance and evidence. *[Assumption:
      servicer may send notices — to be confirmed.]*


      ---


      ## 7. Next Payment Amount and Date Display


      - Display the next payment amount and date at enrollment and persistently in
      the app. *[Analysis]*

      - When the amount changes, the displayed amount must update before the withdrawal;
      the display and the reminder should agree. A stale display alongside a different
      withdrawal is a UDAAP and authorization-sufficiency risk. *[Lead/Analysis]*

      - For Path B, the display is the primary mechanism showing the customer the
      current variable amount; for Path A, it supplements the advance notice.


      ---


      ## 8. Reminders and Changed-Amount Notices


      - **Timing:** Reminders should precede each withdrawal by enough time for the
      customer to act (cancel, change method, or fund the account). Confirm the specific
      interval against state requirements and NACHA/card-network rules. *[Lead — interval
      unverified]*

      - **Content:** Current amount, date, payment method (last four digits), and
      how to cancel or change the method.

      - **Changed amounts (refunds, partial disputes, returned payments, adjustments):**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Path B: the reminder showing the new amount functions as the changed-amount
      notice, provided the method was precisely disclosed at enrollment.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- Path A: a separate advance notice of the changed amount is required before
      the withdrawal.

      - **Channel:** Confirm messaging consent and preferences (TCPA and communications-preference
      rules for calls/texts; email per notice terms). *[Lead]*

      - **Disputed or unclear withdrawals:** Pause the withdrawal and any retries
      until resolved; notify the customer of the pause. Do not treat a disputed amount
      as a routine "adjustment."


      ---


      ## 9. Payment-Method Changes


      - Customers should be able to change the autopay payment method self-service,
      effective before the next withdrawal, with confirmation.

      - A payment-method change should generate a new or amended authorization referencing
      the new instrument (new bank account or card). *[Lead]*

      - Changes requested after the cutoff for the next withdrawal should be queued
      for the following cycle and communicated clearly — the cutoff itself is a missing
      fact to confirm.


      ---


      ## 10. Failed Payments, Retries, and Backup Methods


      - **Retries:** Retry practices must be disclosed and bounded. Confirm permissible
      retry counts and intervals under Reg E, NACHA rules, card-network rules, and
      state law; confirm any returned-payment fee against state limits and disclose
      it. *[Lead — specifics unverified]*

      - **Backup payment method:** Do **not** automatically charge a backup method
      without separate, specific authorization. Recommended pattern: at enrollment,
      offer an optional, separately-consented backup method with its own authorization
      copy ("If my primary payment method fails, I authorize Northstar Pay to charge
      my backup [card/account] for the same amount, after notifying me"). Absent that
      separate consent, a failed payment should trigger a reminder and customer action,
      not an automatic alternate charge. *[Lead/Analysis]*

      - **Disputes:** No retries or backup charges while a dispute is open.

      - **UDAAP check:** Aggressive retry counts, compounding fees, or surprise backup
      charges are the highest-risk features in this proposal. *[Analysis]*


      ---


      ## 11. Cancellation


      - Self-service cancellation in the app, effective before the next scheduled
      withdrawal, with written confirmation. *[Lead]*

      - The cutoff (how far before a withdrawal cancellation remains effective) is
      a missing fact; set it as close to the withdrawal as operationally feasible
      and disclose it.

      - Cancellation of autopay is not cancellation of the loan obligation — copy
      should say so clearly without being coercive.

      - Retain evidence of cancellation requests, timestamps, and confirmations.


      ---


      ## 12. Incentive Presentation


      - The enrollment discount/incentive must state its terms clearly: amount, duration,
      conditions, and what happens if the customer later cancels autopay. *[Lead]*

      - Check state credit/incentive rules for installment products and any partner-bank
      constraints on incentives. *[Lead — unverified]*

      - UDAAP review of the combined experience: an incentive paired with low-friction
      enrollment increases dark-pattern scrutiny. Avoid urgency framing ("enroll now
      or lose your discount") and ensure the incentive does not obscure the authorization
      terms. *[Analysis]*


      ---


      ## 13. Customer-Service Scripts and Escalation


      Recommended script elements (drafts for review):


      - **Enrollment questions:** Restate amount method, schedule, cancellation right,
      and incentive terms; read the authorization language if asked.

      - **Amount-change calls:** Explain the change, the source (refund/dispute/return/adjustment),
      the new amount and date, and confirm the reminder was sent.

      - **Failed payment:** State what happened, any fee, the retry policy, and options
      (pay now, change method, set up backup with separate consent).

      - **Dispute:** Confirm the withdrawal is paused, no retries will occur, explain
      the resolution timeline and escalation path.

      - **Cancellation:** Process immediately if before cutoff; confirm in writing;
      explain any remaining balance and non-autopay options without pressure.


      **Escalation:** Define ownership for complaints, disputes, and regulator inquiries
      (missing fact). Route autopay authorization disputes and repeated failed-payment
      complaints to a named escalation owner with legal visibility.


      ---


      ## 14. Servicing and Vendor Controls


      - Confirm the partner map per state/product before launch (company rollout policy):
      responsible entity, servicer, processor, and contract terms may differ by state
      and product. No state is automatically available.

      - Contractual allocation of: authorization capture and retention, reminder delivery,
      notice obligations, retry execution, dispute pausing, cancellation processing,
      and complaint handling.

      - Vendor oversight: audit rights, delivery-rate reporting for reminders and
      notices, error-resolution SLAs, and credit-reporting accuracy if late payments
      are reported.

      - The same customer-facing experience may not be usable in every state; plan
      for state-specific variants.


      ---


      ## 15. Evidence Retention


      Retain, with timestamps and tamper-evident storage:


      - The exact authorization text presented, UI state, and affirmative consent
      action (E-SIGN evidence).

      - Payment-method change authorizations.

      - Reminder and changed-amount notice delivery records (Path A: per change; Path
      B: per withdrawal).

      - Cancellation requests and confirmations.

      - Retry and backup-charge records, including the authorization relied upon.

      - Dispute pauses and resolutions.


      Retention period: per applicable law, contract, dispute, credit-reporting, tax,
      and litigation needs, under a documented retention schedule — not an indefinite
      default. Account closure should trigger a review for deletion, suppression,
      or restricted retention. *[Per company data-practices policy]*


      ---


      ## 16. Launch Gates (Six-Week Target)


      Do not launch in a state/product/partner combination until all of the following
      are confirmed:


      1. **Partner map confirmed** for that combination (entity, servicer, processor,
      contract terms).

      2. **Authorization copy finalized** — Path B only if the variable-amount method
      is precise and formulaic; otherwise Path A.

      3. **Reminder capability verified** — delivery rates, timing, and records, tested
      end-to-end with the servicer.

      4. **Retry policy bounded and disclosed** — counts, intervals, fees checked
      against state limits.

      5. **Backup method** — either disabled at launch or gated behind separate specific
      authorization.

      6. **Dispute-pause workflow** operational.

      7. **Cancellation** self-service, with cutoff set and disclosed.

      8. **Incentive terms** disclosed and UDAAP-reviewed.

      9. **Evidence retention** implemented for all items in Section 15.

      10. **State validation** completed for each state in scope.


      If gates are not met at week six, delay the affected states/products rather
      than launching a non-compliant experience — the target is internal, not an approval
      deadline.


      ---


      ## 17. Prioritized Implementation Checklist


      **P0 — blocking**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- [ ] Confirm states, products, and partner map.

      - [ ] Draft and legally review authorization copy (Path B ACH; Path A debit/fallback).

      - [ ] Confirm servicer reminder delivery capability and records.

      - [ ] Disable automatic backup-method use absent separate authorization.

      - [ ] Implement dispute-pause workflow.

      - [ ] Implement self-service cancellation with cutoff and confirmation.


      **P1 — before launch**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- [ ] E-SIGN consent-capture evidence build.

      - [ ] Retry policy: counts, intervals, fee disclosure, state-limit check.

      - [ ] Changed-amount notice flow (Path A) / reminder-amount display (Path B).

      - [ ] Incentive terms disclosure and UDAAP review.

      - [ ] Customer-service scripts and escalation ownership.

      - [ ] Evidence-retention implementation.


      **P2 — shortly after launch**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- [ ] Delivery-rate monitoring and vendor reporting.

      - [ ] Complaint/dispute trend review with legal visibility.

      - [ ] State-variant experience planning for later rollouts.


      ---


      ## 18. Recommendation Summary


      Adopt the conservative pilot: **Path B for ACH only**, with a precise disclosed
      variable-amount method and reliable pre-withdrawal reminders; **Path A fixed-amount
      plus advance notice** where the method or notice capability is unconfirmed (including
      debit); **no automatic backup method** without separate authorization; **pause
      disputed or unclear withdrawals**; **self-service cancellation**. All legal
      propositions herein are unverified leads pending jurisdiction, product, and
      partner confirmation; this memo is generated analysis for Alex Morgan''s review,
      not final legal advice, and contains no citations by design.

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
# 19. Counsel edits — reviewed by Alex Morgan

# Editorial decision:

# The pilot recommendation is narrowed to an ACH-first path. Debit-card autopay remains a fallback design that needs separate processor and network review. This edit is generated analysis for product discussion. It is not a final legal conclusion.

# Priority edit 1 — authorization and consent:

# Do not ship a generic “recurring payments” checkbox. Show the rail, the authorization amount or exact variable-amount method, payment dates, the next amount and date, the cancellation path, and the effect of an incentive in the same review step. Capture the exact text, timestamp, customer action, channel, and version. Treat the bracketed formula in the draft as a missing fact, not as approved copy.

# Priority edit 2 — changed amounts:

# For a refund, partial dispute, returned payment, or account adjustment, recalculate the next amount before any withdrawal. Compare the amount shown in the app with the amount in the reminder. If they do not match, or if the source event is unresolved, pause the withdrawal and all retries, notify the customer, and route the item to the designated escalation owner. Path A notice controls apply where Path B's method or notice record is not confirmed.

# Priority edit 3 — failed payments and backup methods:

# Start with customer notice and a self-service “pay now” or “change method” option. Use bounded retries only after the retry count, interval, fees, rail rules, and state limits are confirmed. Do not charge a backup method unless the customer gave separate, specific authorization for that method and the record identifies the authorization relied upon. A backup method is not implied by primary autopay consent.

# Priority edit 4 — cancellation and service:

# Make cancellation visible in the same place as enrollment and available in the app. Give an immediate confirmation with the effective cycle and remaining loan balance. Customer service must be able to see the authorization version, next amount/date, notices, delivery status, retries, disputes, and cancellation timestamp. A complaint about authorization or amount mismatch pauses collection activity until reviewed.

# Launch disposition:

# Proceed only with a gated pilot after the partner map, state/product scope, authorization copy, reminder delivery, retry policy, dispute pause, cancellation cutoff, incentive terms, and evidence retention are confirmed. If any gate fails, delay that state, product, partner, or rail. [Unverified lead] The specific legal result may vary by jurisdiction and payment rail.Autopay Enrollment and Payment Authorization — Launch Advice

**To:** Alex Morgan, Product Counsel, Northstar Pay
**Matter:** Northstar UX Test — 05 — Autopay Enrollment and Payment Authorization
**Status:** Privileged & Confidential — Attorney Work Product
**Date:** 2026-08-30
**Verification status:** All legal propositions in this memo are **unverified leads** pending jurisdiction, product, and partner confirmation. No citations are included because none have been verified; do not rely on this memo as final legal advice without that confirmation.

---

## 1. Executive Summary

Northstar Pay wants to make autopay enrollment easier for installment-loan customers to reduce missed payments while preserving customer control over the repayment method. The proposed experience enrolls customers at checkout or in the app, shows the next payment amount and date, allows payment-method changes, sends pre-withdrawal reminders, and may offer an enrollment incentive. The product team is also considering retrying failed payments and using a backup payment method.

**Recommendation (conservative pilot):**

1. **Path B (variable-amount authorization with a precise disclosed method) for ACH only**, paired with reliable pre-withdrawal reminders that display the current amount. Use Path B only where the disclosed method can be stated precisely and the servicer can guarantee reminder delivery with records.
2. **Path A (fixed-amount authorization plus advance notice on any change)** whenever the variable-amount method cannot be stated precisely or the servicer's notice capability is unconfirmed — including for debit-card rails.
3. **No automatic backup payment method** without separate, specific authorization obtained at or before enrollment.
4. **Pause disputed or unclear withdrawals** until resolved; do not retry or pull from a backup method while a dispute is open.
5. **Self-service cancellation** effective before the next scheduled withdrawal, with confirmation.

The six-week launch is an internal planning target, not an approval deadline. The launch gates in Section 15 should govern timing, not the calendar.

---

## 2. Business Goal and Scope

- **Goal:** Reduce missed payments on installment loans by making autopay enrollment easy, while giving customers control over the bank account or debit card used for repayment.
- **Proposed experience:** Autopay selection at checkout or in the app; display of next payment amount and date; payment-method changes; pre-withdrawal reminders; possible enrollment discount or incentive.
- **Actors:** Customers, Northstar Pay, payment processors, banks, lending partners, servicing vendors.
- **Timing:** Six weeks (internal planning target only).

---

## 3. Facts, Assumptions, and Missing Facts

### Supplied facts

- Payment amounts can change after refunds, partial disputes, returned payments, or account adjustments.
- The product team is considering retrying failed payments and using a backup payment method when the primary method fails.
- The requester is Alex Morgan, product counsel for Northstar Pay (fictional BNPL company).
- The six-week launch is an internal planning target, not an approval deadline.

### Assumptions (open, to be confirmed)

- Initial rollout is US-only.
- Both ACH bank accounts and debit cards may be offered as autopay payment methods.
- Customers can enroll at checkout or in the app.
- The loan servicer may send notices and reminders.
- No customer-specific account data was supplied for this review.

### Missing facts (to be gathered before launch)

Exact states in scope; loan products in scope (pay-in-4 vs. longer-term installments); payment processors involved; lending partners involved; servicer roles and responsibilities; fee and discount/incentive terms; proposed authorization copy; notice channels and timing; retry count and intervals; backup-method sequencing; cancellation cutoffs (how far before a withdrawal cancellation remains effective); complaint/escalation ownership.

**Labeling convention:** Statements below marked *[Lead]* are unverified legal leads; *[Assumption]* restates an open assumption; *[Analysis]* is generated analysis, not verified law.

---

## 4. Issue Map

1. **Recurring ACH authorization** (Regulation E / NACHA) — written authorization content and retention; notice of varying amounts; stop-payment rights; error resolution. *[Lead]*
2. **Debit-card recurring payments** (Regulation E / card-network rules) — stored credentials, retries, merchant-initiated transactions; differences from ACH on cancellation and disputes. *[Lead]*
3. **Consent and enrollment UX** — clear, conspicuous, affirmative consent; no pre-checked boxes or dark patterns; authorization must state amount (or variable-amount method), timing, and cancellation method; E-SIGN/UETA. *[Lead]*
4. **Failed payments, retries, and backup methods** — permissible retry counts and fees; whether a backup method requires separate authorization. *[Lead]*
5. **Enrollment incentive** — credit, UDAP/UDAAP, and state incentive concerns; disclosure of terms. *[Lead]*
6. **Reminders and notices** — timing, content, channel; messaging consent (TCPA/communications preferences). *[Lead]*
7. **Cancellation rights** — self-service, timing before next withdrawal, confirmation. *[Lead]*
8. **Servicing, collections, vendor oversight** — servicer/processor responsibilities; state servicing and collections conduct; credit-reporting accuracy; partner-map confirmation per company rollout policy. *[Lead]*
9. **State-by-state availability** — no state is automatically available; the autopay experience must be validated per state/product/partner. *[Lead]*

**Open issue questions:**

1. Do payment amount changes require fresh consent, or is advance notice sufficient? How do refunds, partial disputes, returned payments, and account adjustments affect the scheduled amount and required notices?
2. Are the proposed reminders legally sufficient (content, timing, channel) and operationally reliable (delivery, servicer coordination)?
3. How is the enrollment incentive presented — clear, non-misleading, adequately disclosed?
4. What evidence of consent, authorization, and cancellation must be retained, for how long, and in what form?

---

## 5. Enrollment Flow and Authorization Language

### 5.1 General principles *[Lead/Analysis]*

- Consent must be affirmative, unbundled from other consents, and not pre-selected.
- The authorization must state: the amount (or the precise method by which a variable amount is determined), the timing/schedule of withdrawals, the rail (ACH or debit), the customer's right to cancel and how, and (for ACH) the bank-account identity.
- Present the authorization immediately before or at the moment of the affirmative action, with the key terms visible without scrolling where feasible.

### 5.2 ACH — Path B (recommended where method is precise and reminders are reliable)

Sample authorization copy (draft for legal review, not final):

> "I authorize Northstar Pay [and its servicing partner, if applicable] to electronically debit my bank account identified above on the scheduled payment dates in amounts that may vary. The amount of each withdrawal will be [PRECISE METHOD — e.g., 'my remaining balance divided by the number of remaining scheduled installments, adjusted for refunds, resolved disputes, returned payments, and account adjustments applied to my account']. I will see the exact amount of my next withdrawal in the reminder sent before each withdrawal and in the app. I may cancel this authorization at any time before the next scheduled withdrawal by [self-service method], and I may stop payment through my bank."

**Conditions for using Path B:**

- The bracketed method must be a real, formulaic calculation the servicing system actually performs — not a vague catch-all.
- Pre-withdrawal reminders must display the current amount and date, with delivery records.
- If the method cannot be stated precisely, fall back to Path A.

### 5.3 ACH — Path A (fallback)

> "I authorize Northstar Pay [and its servicing partner] to electronically debit my bank account identified above in the amount of $[X] on [date/schedule]. If the amount or date of any withdrawal changes for any reason (including refunds, disputes, returned payments, or account adjustments), I will receive advance notice before the withdrawal. I may cancel this authorization at any time before the next scheduled withdrawal by [self-service method]."

Path A requires a notice obligation on every change; a missed notice is a compliance failure. Use it when Path B's conditions are not met, or where state law requires specific advance notice of changed amounts. *[Lead]*

### 5.4 Debit card

- Recommend **Path A only** for debit rails: fixed-amount authorization plus advance notice on changes. Card-network rules on recurring and variable debit transactions are stricter, and a variable-amount debit authorization is more likely to be challenged. *[Lead/Analysis]*
- Stored-credential and merchant-initiated transaction rules must be confirmed with the processor and card networks before launch. *[Lead]*
- Cancellation and dispute rights differ from ACH; the enrollment copy should not imply identical mechanics across rails.

---

## 6. E-SIGN and Consent Capture

- Electronic consent and disclosures require E-SIGN compliance: reasonable demonstration of the customer's ability to access the electronic record, and affirmative consent to receive it electronically. *[Lead]*
- Capture and retain: the exact authorization text presented, timestamp, channel, UI state (no pre-checked boxes), and the customer's affirmative action.
- If disclosures are delivered by the servicer rather than Northstar Pay, confirm contractually who is responsible for E-SIGN compliance and evidence. *[Assumption: servicer may send notices — to be confirmed.]*

---

## 7. Next Payment Amount and Date Display

- Display the next payment amount and date at enrollment and persistently in the app. *[Analysis]*
- When the amount changes, the displayed amount must update before the withdrawal; the display and the reminder should agree. A stale display alongside a different withdrawal is a UDAAP and authorization-sufficiency risk. *[Lead/Analysis]*
- For Path B, the display is the primary mechanism showing the customer the current variable amount; for Path A, it supplements the advance notice.

---

## 8. Reminders and Changed-Amount Notices

- **Timing:** Reminders should precede each withdrawal by enough time for the customer to act (cancel, change method, or fund the account). Confirm the specific interval against state requirements and NACHA/card-network rules. *[Lead — interval unverified]*
- **Content:** Current amount, date, payment method (last four digits), and how to cancel or change the method.
- **Changed amounts (refunds, partial disputes, returned payments, adjustments):**
- Path B: the reminder showing the new amount functions as the changed-amount notice, provided the method was precisely disclosed at enrollment.
- Path A: a separate advance notice of the changed amount is required before the withdrawal.
- **Channel:** Confirm messaging consent and preferences (TCPA and communications-preference rules for calls/texts; email per notice terms). *[Lead]*
- **Disputed or unclear withdrawals:** Pause the withdrawal and any retries until resolved; notify the customer of the pause. Do not treat a disputed amount as a routine "adjustment."

---

## 9. Payment-Method Changes

- Customers should be able to change the autopay payment method self-service, effective before the next withdrawal, with confirmation.
- A payment-method change should generate a new or amended authorization referencing the new instrument (new bank account or card). *[Lead]*
- Changes requested after the cutoff for the next withdrawal should be queued for the following cycle and communicated clearly — the cutoff itself is a missing fact to confirm.

---

## 10. Failed Payments, Retries, and Backup Methods

- **Retries:** Retry practices must be disclosed and bounded. Confirm permissible retry counts and intervals under Reg E, NACHA rules, card-network rules, and state law; confirm any returned-payment fee against state limits and disclose it. *[Lead — specifics unverified]*
- **Backup payment method:** Do **not** automatically charge a backup method without separate, specific authorization. Recommended pattern: at enrollment, offer an optional, separately-consented backup method with its own authorization copy ("If my primary payment method fails, I authorize Northstar Pay to charge my backup [card/account] for the same amount, after notifying me"). Absent that separate consent, a failed payment should trigger a reminder and customer action, not an automatic alternate charge. *[Lead/Analysis]*
- **Disputes:** No retries or backup charges while a dispute is open.
- **UDAAP check:** Aggressive retry counts, compounding fees, or surprise backup charges are the highest-risk features in this proposal. *[Analysis]*

---

## 11. Cancellation

- Self-service cancellation in the app, effective before the next scheduled withdrawal, with written confirmation. *[Lead]*
- The cutoff (how far before a withdrawal cancellation remains effective) is a missing fact; set it as close to the withdrawal as operationally feasible and disclose it.
- Cancellation of autopay is not cancellation of the loan obligation — copy should say so clearly without being coercive.
- Retain evidence of cancellation requests, timestamps, and confirmations.

---

## 12. Incentive Presentation

- The enrollment discount/incentive must state its terms clearly: amount, duration, conditions, and what happens if the customer later cancels autopay. *[Lead]*
- Check state credit/incentive rules for installment products and any partner-bank constraints on incentives. *[Lead — unverified]*
- UDAAP review of the combined experience: an incentive paired with low-friction enrollment increases dark-pattern scrutiny. Avoid urgency framing ("enroll now or lose your discount") and ensure the incentive does not obscure the authorization terms. *[Analysis]*

---

## 13. Customer-Service Scripts and Escalation

Recommended script elements (drafts for review):

- **Enrollment questions:** Restate amount method, schedule, cancellation right, and incentive terms; read the authorization language if asked.
- **Amount-change calls:** Explain the change, the source (refund/dispute/return/adjustment), the new amount and date, and confirm the reminder was sent.
- **Failed payment:** State what happened, any fee, the retry policy, and options (pay now, change method, set up backup with separate consent).
- **Dispute:** Confirm the withdrawal is paused, no retries will occur, explain the resolution timeline and escalation path.
- **Cancellation:** Process immediately if before cutoff; confirm in writing; explain any remaining balance and non-autopay options without pressure.

**Escalation:** Define ownership for complaints, disputes, and regulator inquiries (missing fact). Route autopay authorization disputes and repeated failed-payment complaints to a named escalation owner with legal visibility.

---

## 14. Servicing and Vendor Controls

- Confirm the partner map per state/product before launch (company rollout policy): responsible entity, servicer, processor, and contract terms may differ by state and product. No state is automatically available.
- Contractual allocation of: authorization capture and retention, reminder delivery, notice obligations, retry execution, dispute pausing, cancellation processing, and complaint handling.
- Vendor oversight: audit rights, delivery-rate reporting for reminders and notices, error-resolution SLAs, and credit-reporting accuracy if late payments are reported.
- The same customer-facing experience may not be usable in every state; plan for state-specific variants.

---

## 15. Evidence Retention

Retain, with timestamps and tamper-evident storage:

- The exact authorization text presented, UI state, and affirmative consent action (E-SIGN evidence).
- Payment-method change authorizations.
- Reminder and changed-amount notice delivery records (Path A: per change; Path B: per withdrawal).
- Cancellation requests and confirmations.
- Retry and backup-charge records, including the authorization relied upon.
- Dispute pauses and resolutions.

Retention period: per applicable law, contract, dispute, credit-reporting, tax, and litigation needs, under a documented retention schedule — not an indefinite default. Account closure should trigger a review for deletion, suppression, or restricted retention. *[Per company data-practices policy]*

---

## 16. Launch Gates (Six-Week Target)

Do not launch in a state/product/partner combination until all of the following are confirmed:

1. **Partner map confirmed** for that combination (entity, servicer, processor, contract terms).
2. **Authorization copy finalized** — Path B only if the variable-amount method is precise and formulaic; otherwise Path A.
3. **Reminder capability verified** — delivery rates, timing, and records, tested end-to-end with the servicer.
4. **Retry policy bounded and disclosed** — counts, intervals, fees checked against state limits.
5. **Backup method** — either disabled at launch or gated behind separate specific authorization.
6. **Dispute-pause workflow** operational.
7. **Cancellation** self-service, with cutoff set and disclosed.
8. **Incentive terms** disclosed and UDAAP-reviewed.
9. **Evidence retention** implemented for all items in Section 15.
10. **State validation** completed for each state in scope.

If gates are not met at week six, delay the affected states/products rather than launching a non-compliant experience — the target is internal, not an approval deadline.

---

## 17. Prioritized Implementation Checklist

**P0 — blocking**

- [ ] Confirm states, products, and partner map.
- [ ] Draft and legally review authorization copy (Path B ACH; Path A debit/fallback).
- [ ] Confirm servicer reminder delivery capability and records.
- [ ] Disable automatic backup-method use absent separate authorization.
- [ ] Implement dispute-pause workflow.
- [ ] Implement self-service cancellation with cutoff and confirmation.

**P1 — before launch**

- [ ] E-SIGN consent-capture evidence build.
- [ ] Retry policy: counts, intervals, fee disclosure, state-limit check.
- [ ] Changed-amount notice flow (Path A) / reminder-amount display (Path B).
- [ ] Incentive terms disclosure and UDAAP review.
- [ ] Customer-service scripts and escalation ownership.
- [ ] Evidence-retention implementation.

**P2 — shortly after launch**

- [ ] Delivery-rate monitoring and vendor reporting.
- [ ] Complaint/dispute trend review with legal visibility.
- [ ] State-variant experience planning for later rollouts.

---

## 18. Recommendation Summary

Adopt the conservative pilot: **Path B for ACH only**, with a precise disclosed variable-amount method and reliable pre-withdrawal reminders; **Path A fixed-amount plus advance notice** where the method or notice capability is unconfirmed (including debit); **no automatic backup method** without separate authorization; **pause disputed or unclear withdrawals**; **self-service cancellation**. All legal propositions herein are unverified leads pending jurisdiction, product, and partner confirmation; this memo is generated analysis for Alex Morgan's review, not final legal advice, and contains no citations by design.
