---
work_product_id: WP-20260904-3941c7
matter_id: MAT-20260904-75af25
title: Mosaic Relay — Consumer and Merchant Disclosures for Payment Risk Holds (Working
  Draft)
record_type: work_product
state: final
summary: ''
created_at: '2026-09-04T00:43:01+00:00'
updated_at: '2026-09-04T00:43:01+00:00'
immutable: true
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: 'WORKING LEGAL RESPONSE


      Scope and conclusion


      This is a US-only first pass for a non-bank payment-infrastructure provider.
      Mosaic Relay should not launch a multi-week payout hold based only on an opaque
      score. The safer launch pattern is a short, documented review window with a
      human escalation path, specific reason codes, clear notice, a defined maximum
      duration, and a prompt release or documented extension. This is a working recommendation
      only. It is not a recorded decision.


      Known facts


      Mosaic Relay provides payout controls and risk scoring. It does not hold deposits
      or operate as a bank. A hold may begin within minutes after a transaction and
      may last hours to several weeks. The proposed merchant notice is “review required,”
      with a general explanation and secure document submission. The business purpose
      is loss prevention while preserving a path for legitimate merchants to resume
      payouts.


      Working assumptions and missing facts


      The analysis assumes Mosaic Relay’s direct counterparty is the merchant or platform,
      not the end consumer, and that US law is the initial scope. The following facts
      remain open and can change the answer: who owns the held funds; whether the
      merchant agreement authorizes holds; whether a human reviews before or during
      the hold; the precise notice time; appeal rights; interest and fee treatment;
      what happens when documents are unavailable; the states where merchants, sellers,
      and payers are located; and whether an acquiring or processing partner imposes
      additional rules. Confirm these before launch.


      Merchant disclosure language


      Use a notice that is specific enough to be useful without revealing fraud-detection
      controls:


      “Your payout is temporarily on hold while we review activity associated with
      this account. The review may relate to unusual transaction activity, elevated
      dispute risk, or incomplete verification. We have not made a final finding of
      wrongdoing. The amount currently affected is [amount or calculation method].
      The review started on [date and time]. Please provide [document list] through
      [secure portal]. We will provide an update by [date and time], and we will release
      the payout or explain the next step as soon as the review is complete. If you
      believe this is incorrect, submit an appeal at [channel]. We will not request
      passwords, private keys, or full payment credentials.”


      Avoid “we may hold funds for as long as necessary,” “our systems flagged you,”
      or a bare “review required” label. Give the merchant a plain-language reason
      category, not sensitive model thresholds. State whether the hold affects the
      merchant’s own funds or funds payable to other persons once that fact is confirmed.


      Consumer or seller communication


      If held amounts belong to sellers or consumers, require a separate notice through
      the merchant or another responsible channel. The notice should identify the
      affected payment or payout, the date, amount, current status, expected next
      update, available dispute or escalation route, and whether the person must do
      anything. Do not imply that a consumer committed fraud merely because a model
      produced a risk signal. Coordinate the message with the merchant agreement and
      the acquiring partner’s rules.


      Timing and duration controls


      Set an initial review target measured from the hold timestamp, with an update
      even when the review is incomplete. Use a short initial window, such as 24 to
      72 hours, for ordinary review. Any extension should have a documented reason,
      a new deadline, an owner, and a senior escalation. Do not use “multiple weeks”
      as an unbounded default. Require release when the stated reason is resolved,
      and a final written outcome when the review closes. Preserve an emergency path
      for credible fraud or legal requests, but still provide periodic status updates
      and a final disposition.


      Automation fairness and transparency


      Treat the score as a triage input, not the final decision. Test false-positive
      rates across relevant merchant and seller groups. Monitor whether document requests,
      hold length, and release rates differ by protected or proxy characteristics.
      Give the affected merchant a meaningful human review route and a way to correct
      inaccurate data. Use stable reason codes, version the scoring model, log overrides,
      and prohibit staff from adding unsupported reasons after the fact. Provide an
      explanation that a reasonable recipient can act on, while protecting confidential
      detection methods.


      Funds handling and escalation


      First determine whether the amount is the merchant’s own receivable or money
      owed to an underlying seller or consumer. Map custody, settlement, safeguarding,
      chargeback, escheatment, and insolvency consequences with payments counsel and
      each acquiring or processing partner. Mosaic Relay should not represent that
      it safeguards funds unless it actually does so. Keep held amounts traceable
      by transaction, owner, account, currency, and status. Escalate immediately when
      ownership is unclear, a consumer-facing amount is affected, the hold exceeds
      its limit, a legal or regulator request arrives, or the merchant cannot provide
      documents for reasons outside its control. Use least-disruptive alternatives,
      such as a partial release or reserve, where supported.


      Records needed to justify a hold


      For each hold, retain: transaction and payout identifiers; amount and asserted
      owner; trigger category; score and model version; source data relied on; timestamp
      and actor that placed the hold; notice content and delivery time; documents
      requested and received; human reviewer and review steps; reason for every extension;
      appeal, correction, and escalation events; release, reserve, or denial outcome;
      fees or interest treatment; partner notifications; and retention or deletion
      dates. Keep an audit trail that cannot be silently overwritten. Link each record
      to the governing contract version and the applicable state or partner rule.


      Recommendation, separate from decision


      Recommendation: launch only a bounded pilot after contract review and funds-ownership
      mapping. Use human review within the initial window, clear reason codes, a maximum
      duration with documented extensions, no unexplained fees, secure document handling,
      and a complete audit record. Prepare merchant-facing and, if needed, seller
      or consumer-facing notices before activation.


      Decision status: no durable decision is recorded. Counsel must decide whether
      the risk and operating controls are acceptable after confirming the open facts.


      Unverified leads for last-mile research


      These are research leads, not verified authorities: Federal Trade Commission
      Act Section 5 and state unfair or deceptive acts and practices laws; state money-transmission
      and safeguarding rules; state automated-decision or AI transparency laws, including
      possible California, Colorado, or Illinois requirements; Regulation E or other
      consumer-payment rules if consumer funds are involved; acquiring-network and
      processor operating rules; and contract good-faith limits on discretionary holds.
      Verify the current text, effective dates, scope, exemptions, and any private
      rights of action against the exact Mosaic Relay structure before relying on
      them.


      Next steps


      1. Pull the current merchant agreement and partner terms.

      2. Map ownership and custody for each payout flow.

      3. Confirm state footprint and whether any consumer-facing payments are in scope.

      4. Set the initial review deadline, extension authority, appeal route, and release
      rules.

      5. Validate model monitoring, reason codes, and the record schema with operations
      and compliance.

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
final_id: FINAL-20260904-155819
finalized_at: '2026-09-04T00:43:07+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-07-consumer-disclosures-for-payment-risk-ho-75af25/work-product/draft/mosaic-relay-consumer-and-merchant-disclosures-for-payment-risk--3941c7.md
source_content_hash: ea992084877b483e2541e6bcdbd55c9bd35b53858aa3e071f7a3a9c525544157
---
WORKING LEGAL RESPONSE

Scope and conclusion

This is a US-only first pass for a non-bank payment-infrastructure provider. Mosaic Relay should not launch a multi-week payout hold based only on an opaque score. The safer launch pattern is a short, documented review window with a human escalation path, specific reason codes, clear notice, a defined maximum duration, and a prompt release or documented extension. This is a working recommendation only. It is not a recorded decision.

Known facts

Mosaic Relay provides payout controls and risk scoring. It does not hold deposits or operate as a bank. A hold may begin within minutes after a transaction and may last hours to several weeks. The proposed merchant notice is “review required,” with a general explanation and secure document submission. The business purpose is loss prevention while preserving a path for legitimate merchants to resume payouts.

Working assumptions and missing facts

The analysis assumes Mosaic Relay’s direct counterparty is the merchant or platform, not the end consumer, and that US law is the initial scope. The following facts remain open and can change the answer: who owns the held funds; whether the merchant agreement authorizes holds; whether a human reviews before or during the hold; the precise notice time; appeal rights; interest and fee treatment; what happens when documents are unavailable; the states where merchants, sellers, and payers are located; and whether an acquiring or processing partner imposes additional rules. Confirm these before launch.

Merchant disclosure language

Use a notice that is specific enough to be useful without revealing fraud-detection controls:

“Your payout is temporarily on hold while we review activity associated with this account. The review may relate to unusual transaction activity, elevated dispute risk, or incomplete verification. We have not made a final finding of wrongdoing. The amount currently affected is [amount or calculation method]. The review started on [date and time]. Please provide [document list] through [secure portal]. We will provide an update by [date and time], and we will release the payout or explain the next step as soon as the review is complete. If you believe this is incorrect, submit an appeal at [channel]. We will not request passwords, private keys, or full payment credentials.”

Avoid “we may hold funds for as long as necessary,” “our systems flagged you,” or a bare “review required” label. Give the merchant a plain-language reason category, not sensitive model thresholds. State whether the hold affects the merchant’s own funds or funds payable to other persons once that fact is confirmed.

Consumer or seller communication

If held amounts belong to sellers or consumers, require a separate notice through the merchant or another responsible channel. The notice should identify the affected payment or payout, the date, amount, current status, expected next update, available dispute or escalation route, and whether the person must do anything. Do not imply that a consumer committed fraud merely because a model produced a risk signal. Coordinate the message with the merchant agreement and the acquiring partner’s rules.

Timing and duration controls

Set an initial review target measured from the hold timestamp, with an update even when the review is incomplete. Use a short initial window, such as 24 to 72 hours, for ordinary review. Any extension should have a documented reason, a new deadline, an owner, and a senior escalation. Do not use “multiple weeks” as an unbounded default. Require release when the stated reason is resolved, and a final written outcome when the review closes. Preserve an emergency path for credible fraud or legal requests, but still provide periodic status updates and a final disposition.

Automation fairness and transparency

Treat the score as a triage input, not the final decision. Test false-positive rates across relevant merchant and seller groups. Monitor whether document requests, hold length, and release rates differ by protected or proxy characteristics. Give the affected merchant a meaningful human review route and a way to correct inaccurate data. Use stable reason codes, version the scoring model, log overrides, and prohibit staff from adding unsupported reasons after the fact. Provide an explanation that a reasonable recipient can act on, while protecting confidential detection methods.

Funds handling and escalation

First determine whether the amount is the merchant’s own receivable or money owed to an underlying seller or consumer. Map custody, settlement, safeguarding, chargeback, escheatment, and insolvency consequences with payments counsel and each acquiring or processing partner. Mosaic Relay should not represent that it safeguards funds unless it actually does so. Keep held amounts traceable by transaction, owner, account, currency, and status. Escalate immediately when ownership is unclear, a consumer-facing amount is affected, the hold exceeds its limit, a legal or regulator request arrives, or the merchant cannot provide documents for reasons outside its control. Use least-disruptive alternatives, such as a partial release or reserve, where supported.

Records needed to justify a hold

For each hold, retain: transaction and payout identifiers; amount and asserted owner; trigger category; score and model version; source data relied on; timestamp and actor that placed the hold; notice content and delivery time; documents requested and received; human reviewer and review steps; reason for every extension; appeal, correction, and escalation events; release, reserve, or denial outcome; fees or interest treatment; partner notifications; and retention or deletion dates. Keep an audit trail that cannot be silently overwritten. Link each record to the governing contract version and the applicable state or partner rule.

Recommendation, separate from decision

Recommendation: launch only a bounded pilot after contract review and funds-ownership mapping. Use human review within the initial window, clear reason codes, a maximum duration with documented extensions, no unexplained fees, secure document handling, and a complete audit record. Prepare merchant-facing and, if needed, seller or consumer-facing notices before activation.

Decision status: no durable decision is recorded. Counsel must decide whether the risk and operating controls are acceptable after confirming the open facts.

Unverified leads for last-mile research

These are research leads, not verified authorities: Federal Trade Commission Act Section 5 and state unfair or deceptive acts and practices laws; state money-transmission and safeguarding rules; state automated-decision or AI transparency laws, including possible California, Colorado, or Illinois requirements; Regulation E or other consumer-payment rules if consumer funds are involved; acquiring-network and processor operating rules; and contract good-faith limits on discretionary holds. Verify the current text, effective dates, scope, exemptions, and any private rights of action against the exact Mosaic Relay structure before relying on them.

Next steps

1. Pull the current merchant agreement and partner terms.
2. Map ownership and custody for each payout flow.
3. Confirm state footprint and whether any consumer-facing payments are in scope.
4. Set the initial review deadline, extension authority, appeal route, and release rules.
5. Validate model monitoring, reason codes, and the record schema with operations and compliance.
