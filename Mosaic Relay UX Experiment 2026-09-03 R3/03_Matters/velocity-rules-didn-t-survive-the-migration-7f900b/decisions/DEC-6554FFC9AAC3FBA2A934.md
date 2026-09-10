---
decision_id: DEC-6554FFC9AAC3FBA2A934
matter_id: MAT-20260908-7f900b
title: Human review (or validated sample) of backfilled low-risk alerts
decision_type: legal_decision
chosen_path: Human review (or validated sample) of backfilled low-risk alerts
rationale: 'With suspected activity and an unvalidated model, human or sampled review
  is the most defensible path and the least exposed to later scrutiny.


  A defensible record that the backfill was actually checked, supporting program adequacy
  and any later scrutiny.'
decision_maker: Unattributed lawyer
conditions:
- Do not auto-close the backfilled low-risk population on the model alone; review
  it or validate a statistically sound sample before closure.
- Is the fraud model's low-risk scoring during the gap reliable enough to support
  auto-closing backfilled alerts? — must be not met
not_decided: []
linked_paths:
- 03_Matters/velocity-rules-didn-t-survive-the-migration-7f900b/issues.md
mitigation_ids: []
review_packet_ids: []
revises_decision_id: null
decided_at: '2026-09-08T01:16:33+00:00'
next_review_at: null
last_reviewed_at: '2026-09-08T01:16:33+00:00'
risk_level: unknown
review_status: fresh
staleness_reason: ''
privilege: privileged_and_confidential
source_action_key: choice:26727f520f613834ff9e1105ec717d1e:decision
recorded_event_id: EVT-DEC-6554FFC9AAC3FBA2A934
recording_complete: true
recommendation_disposition: not_applicable
recommendation_disposition_reason: ''
recommendation_version_id: null
map_basis:
  issue_id: ISS-ab368ed3f3-f30e694f455d7706
  analysis_id: IAN-88dad2c0115335c5179e83c8
  analysis_revision: 057e3a5e282022525ab5303f105a83964cd1e47343d3a026faa7cc91f81f18c3
  analysis_path: 03_Matters/velocity-rules-didn-t-survive-the-migration-7f900b/conversations/inquiries/RUN-20260908-5c43c8.md
  output_revision: 9a9b9b43ce0858b68d2e04d2ed0005cd4358944ec219c395f24ec6cba33a8353
  selected_option_id: OPT-093cf39cc3d7d85b2cbb
  selected_option_revision: 16d8807e5398b0791405b30f43730cf042da797bba37070c0ffb624b4fe0aac2
  use_historical_basis: false
  canonical_option:
    option_id: OPT-093cf39cc3d7d85b2cbb
    option_revision: 16d8807e5398b0791405b30f43730cf042da797bba37070c0ffb624b4fe0aac2
    title: Human review (or validated sample) of backfilled low-risk alerts
    kind: conditional_path
    condition_summary: Do not auto-close the backfilled low-risk population on the
      model alone; review it or validate a statistically sound sample before closure.
    requirements:
    - condition_id: CON-15b9c49a2e8df961b26f
      state: not_met
    combination: all
    consequence: A defensible record that the backfill was actually checked, supporting
      program adequacy and any later scrutiny.
    trade_off: Ops is six people; full human review of tens of thousands of alerts
      is a real capacity cost and delay, which is the cost Marcus is trying to avoid.
    remaining_work:
    - Assess model reliability for the gap period
    - Design and run the review or sampling protocol
    - Document the review decision
    recommendation: recommended
    recommendation_reason: With suspected activity and an unvalidated model, human
      or sampled review is the most defensible path and the least exposed to later
      scrutiny.
    effects:
    - target_option_id: OPT-323c3446cb4592acc36a
      trigger: implementation_complete
      condition_id: null
      condition_state: met
      reason: Choosing human review does not immediately exclude auto-close; auto-close
        remains possible until the review/sampling protocol is actually built and
        run. Only once the review is implemented does it replace the auto-close route.
    risk_assessment: risk_to_review
    claim_ids: []
    work_item_ids: []
  input_basis:
    business_question: 52576a5fa6ad6c90aa9128764439298598a85ddd73dce847a5b166c75b6536a9
    issue: c0fd0edba62ad132ab1bd8b790010321aa8d3ca1cd9f78ef99d4da3b44737fe1
    facts: b6396dc7004662ff3e7a1890fe18155127c987fd00379e7574404bc07bd8a4c0
    assumptions: 31b223a4e83d56f88afcfbe580f1b2aa1e7426b6b521dfd9333c5af62418329e
    questions: 8094a72504679f7bb78bece8d58a99e0722b24d065cd26315d84299bf8448c1d
    ? projection:eyJpbmNsdWRlZF9yb2xlcyI6IFsiQWN0aXZlIG1hdHRlciByZWNvcmQiLCAiQ3VycmVudCBidXNpbmVzcyBxdWVzdGlvbiAoY2Fub25pY2FsIHNjb3BlKSIsICJDdXJyZW50IG1hdHRlciB3b3JrIHN0YXRlIiwgIlNoYXJlZCBtYXAgYW5kIGNoYXQgcXVlc3Rpb25zIiwgIlN1cHBvcnRpbmcgcXVlc3Rpb25zIChhbnN3ZXJlZCBpcyBub3QgaW5kZXBlbmRlbnRseSB2ZXJpZmllZCBvciBpc3N1ZSByZXNvbHZlZCkiLCAiYWNjZXB0ZWRfbGF3eWVyX2NvbnRyaWJ1dGlvbnMiLCAiY29tcGFueV9jb250ZXh0IiwgImNvbnZlcnNhdGlvbl90YXJnZXQiLCAiY3VycmVudF9mYWN0cyIsICJoaXN0b3JpY2FsX3F1ZXN0aW9uX2NoYW5nZXNfbm90X2N1cnJlbnRfc2NvcGUiLCAiaXNzdWVzIiwgIm1hdHRlcl9sb2NhbF9wcmVmZXJlbmNlcyIsICJvcmlnaW5hbF9yZXF1ZXN0X2hpc3RvcmljYWxfbm90X2N1cnJlbnRfZmFjdHMiLCAid29ya2luZ19hc3N1bXB0aW9ucyJdLCAibWFuaWZlc3RfcHJlc2VudCI6IHRydWUsICJwYXRocyI6IFtdLCAicmVmZXJlbmNlX2lkcyI6IFtdfQ==
    : 00c3b3e22646c72d33d32289ae0b26011e0b8bb35190103901d0b0498cec18e3
    ? context:eyJjYW5vbmljYWxfZnVsbCI6IG51bGwsICJwYXRoIjogIjAwX1N5c3RlbS9jb21wYW55Lm1kIiwgInJlZmVyZW5jZV9pZCI6ICJjb21wYW55Lm1kIiwgInJvbGUiOiAiY29tcGFueV9jb250ZXh0IiwgInN1cHBsaWVkX2NoYXJzIjogNTEwMH0=
    : 6744b9060361decbeccc7357967b8b74b8dc44bb933a04bba737a3b9e1fa35e0
request_fingerprint: 9b62895cf6ea9c41be71525890377e71a8bdcb3b8fcd5e3178995c147bf1babd
issue_id: ISS-ab368ed3f3-f30e694f455d7706
---
# Human review (or validated sample) of backfilled low-risk alerts

## Chosen path

Human review (or validated sample) of backfilled low-risk alerts

## Rationale

With suspected activity and an unvalidated model, human or sampled review is the most defensible path and the least exposed to later scrutiny.

A defensible record that the backfill was actually checked, supporting program adequacy and any later scrutiny.

## Recommendation disposition

Not Applicable

## Conditions

- Do not auto-close the backfilled low-risk population on the model alone; review it or validate a statistically sound sample before closure.
- Is the fraud model's low-risk scoring during the gap reliable enough to support auto-closing backfilled alerts? — must be not met

## Not decided

- None recorded
