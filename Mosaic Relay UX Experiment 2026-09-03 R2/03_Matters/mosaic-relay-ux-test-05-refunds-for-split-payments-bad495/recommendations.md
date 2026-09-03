---
matter_id: MAT-20260903-bad495
record_type: recommendations
current_recommendation_version_id: REC-20260903-0fad1e
recommendation_versions:
- version_id: REC-20260903-30ff92
  number: 1
  content: 'Proceed with the split-payment partial-refund tool, but do not launch
    until the seller term amendments are drafted and effective and the launch conditions
    are met. The core architecture (immutable ledger source of truth, prorated fee
    reversal, negative-balance holds, refund-reduces-dispute, named-approver overrides)
    is sound and consistent. The single material gap is that seller terms are silent,
    so the tool''s behavior is not contractually supported; that must be closed before
    launch. Launch conditions: (1) seller term amendments drafted and effective; (2)
    fee-reversal absorption decided and reflected in terms and disclosure; (3) timing
    language validated against card-network and NACHA deadlines with issuance-vs-posting
    disclosure; (4) ledger immutability and daily reconciliation implemented with
    the double-recovery invariant enforced; (5) negative-balance and payout-hold controls
    implemented with seller notice and contractual right; (6) chargeback sequencing
    implemented so refund and dispute flows share the same snapshot; (7) override
    workflow implemented with named-approver approval and auditable events; (8) tax
    treatment confirmed by tax counsel; (9) regulated-actor confirmation of who holds
    funds and owns the buyer/seller relationship.'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-03T17:20:01+00:00'
- version_id: REC-20260903-0fad1e
  number: 2
  content: 'Proceed with the split-payment partial-refund tool, but do not launch
    until seller term amendments are drafted and effective and all launch conditions
    below are met. Required rules: refund only selected line items and never exceed
    the remaining refundable amount; allocate each refund back to the original card
    or ACH tender and seller allocation snapshot; prorate the platform fee using the
    approved formula and state who absorbs or credits it; distinguish refund issuance
    from bank posting and do not promise one uniform window until card-network and
    ACH rules are verified; show buyer amount, tender, seller allocation, status,
    and timing caveat; notify each affected seller of amount, fee treatment, timing,
    negative balance, and dispute effect; use append-only ledger events with versioned
    snapshots and a refunded-plus-disputed-not-greater-than-funded invariant; allow
    a negative seller balance only with a contractual payout hold, notice, recovery
    rule, and write-off approval; link refund and chargeback records to one snapshot
    and stop duplicate recovery; permit support overrides only with a named approver,
    reason, evidence, and audit trail; confirm tax treatment and record retention
    before launch. Owners: Legal—seller terms, buyer/seller notices, timing and disclosure
    review; Product—policy and fee-absorption choice; Engineering—ledger invariants,
    idempotency, reconciliation, and dispute links; Payments Ops—card/ACH network
    validation and exception runbook; Risk—chargeback and negative-balance controls;
    Tax/Finance—tax treatment and accounting. This is a working recommendation, not
    a recorded decision.'
  actor: Lawyer
  origin: lawyer_edit
  created_at: '2026-09-03T17:21:25+00:00'
recommendation_updated_at: '2026-09-03T17:21:25+00:00'
recommendation_updated_by: Lawyer
proposed_recommendation: null
---
Proceed with the split-payment partial-refund tool, but do not launch until seller term amendments are drafted and effective and all launch conditions below are met. Required rules: refund only selected line items and never exceed the remaining refundable amount; allocate each refund back to the original card or ACH tender and seller allocation snapshot; prorate the platform fee using the approved formula and state who absorbs or credits it; distinguish refund issuance from bank posting and do not promise one uniform window until card-network and ACH rules are verified; show buyer amount, tender, seller allocation, status, and timing caveat; notify each affected seller of amount, fee treatment, timing, negative balance, and dispute effect; use append-only ledger events with versioned snapshots and a refunded-plus-disputed-not-greater-than-funded invariant; allow a negative seller balance only with a contractual payout hold, notice, recovery rule, and write-off approval; link refund and chargeback records to one snapshot and stop duplicate recovery; permit support overrides only with a named approver, reason, evidence, and audit trail; confirm tax treatment and record retention before launch. Owners: Legal—seller terms, buyer/seller notices, timing and disclosure review; Product—policy and fee-absorption choice; Engineering—ledger invariants, idempotency, reconciliation, and dispute links; Payments Ops—card/ACH network validation and exception runbook; Risk—chargeback and negative-balance controls; Tax/Finance—tax treatment and accounting. This is a working recommendation, not a recorded decision.
