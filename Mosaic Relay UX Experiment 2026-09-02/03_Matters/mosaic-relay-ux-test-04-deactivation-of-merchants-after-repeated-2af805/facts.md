---
matter_id: MAT-20260902-2af805
record_type: facts
facts:
- fact_id: FACT-20260902-aa588a
  text: Mosaic Relay wants to deactivate merchants whose chargeback rate remains above
    a defined threshold for three consecutive months.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-8dd06d
  text: The proposed experience would warn the merchant, require a remediation plan,
    restrict new payment methods, and then disable processing if performance does
    not improve.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-441e3a
  text: Warnings would begin after the first month above threshold, and deactivation
    would occur after the third month unless a documented exception is approved.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-d6ac0e
  text: Existing refunds and dispute responses would remain available for 90 days
    after deactivation.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-bcc2d0
  text: The merchant agreement permits suspension for excessive disputes but does
    not define the notice content, cure period, or appeal process.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-4802e9
  text: Mosaic Relay has network monitoring obligations and wants a consistent process.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-515efe
  text: Some merchants sell digital goods, while others sell physical goods or recurring
    services.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-4485cf
  text: Actors include merchants, their customers, Mosaic Relay Risk and Support,
    card networks, acquiring banks, and marketplace customers.
  status: active
  material: true
  source_ids:
  - REQ-20260902-f39bb2
  supersedes: null
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- fact_id: FACT-20260902-92b542
  text: 'How should the chargeback metric be defined for triggering warnings and deactivation?
    — Use network-specific thresholds (Visa/Mastercard monitoring program levels):
    Use an internal Mosaic Relay-defined threshold: Exclude false/friendly-fraud disputes
    that are successfully rebutted: Exclude pending authorizations from the metric'
  status: active
  material: true
  source_ids:
  - MSG-20260902-f37f11
  supersedes: null
  created_at: '2026-09-02T14:54:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-85245a
- fact_id: FACT-20260902-9b23e0
  text: exclude them (metric tracks chargebacks only).
  status: active
  material: true
  source_ids:
  - MSG-20260902-603fdc
  supersedes: null
  created_at: '2026-09-02T14:55:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-faa706
- fact_id: FACT-20260902-30b084
  text: Can marketplace customers override a Mosaic Relay deactivation decision? —
    Override only with documented exception approval
  status: active
  material: true
  source_ids:
  - MSG-20260902-5f5384
  supersedes: null
  created_at: '2026-09-02T14:56:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-a799ba
- fact_id: FACT-20260902-e5c903
  text: What cure period and appeal process should merchants have before deactivation?
    — 30-day cure with written appeal
  status: active
  material: true
  source_ids:
  - MSG-20260902-0d35c8
  supersedes: null
  created_at: '2026-09-02T14:56:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-cef4b5
- fact_id: FACT-20260902-27a5d9
  text: What is the target launch date and which jurisdictions/networks apply first?
    — No launch date is set. Assume an initial U.S. launch covering Visa and Mastercard
    programs through Mosaic Relay's acquiring-bank partners; confirm applicable jurisdictions,
    network programs, and local notice rules with Risk and Compliance before rollout.
  status: active
  material: true
  source_ids:
  - MSG-20260902-6d63bd
  supersedes: null
  created_at: '2026-09-02T14:56:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-e58635
sources:
- source_id: REQ-20260902-f39bb2
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-04-deactivation-of-merchants-after-repeated-2af805/request.md
  version: ''
  location: ''
  created_at: '2026-09-02T14:54:14+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-5b5620
- source_id: MSG-20260902-f37f11
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:54:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-c71c97
- source_id: MSG-20260902-603fdc
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:55:46+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-4dd6e1
- source_id: MSG-20260902-5f5384
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:56:09+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-f1adcf
- source_id: MSG-20260902-0d35c8
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:56:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-835346
- source_id: MSG-20260902-6d63bd
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-02T14:56:56+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-70d24a
support:
- support_id: SUP-20260902-b3a44d
  fact_id: FACT-20260902-aa588a
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Mosaic Relay wants to deactivate merchants whose chargeback rate remains
    above a defined threshold for three consecutive months.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-139a6d
  fact_id: FACT-20260902-8dd06d
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: The proposed experience would warn the merchant, require a remediation
    plan, restrict new payment methods, and then disable processing if performance
    does not improve.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-85718a
  fact_id: FACT-20260902-441e3a
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Warnings would begin after the first month above threshold, and deactivation
    would occur after the third month unless a documented exception is approved.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-f2d74e
  fact_id: FACT-20260902-d6ac0e
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Existing refunds and dispute responses would remain available for 90
    days after deactivation.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-4135ed
  fact_id: FACT-20260902-bcc2d0
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: The merchant agreement permits suspension for excessive disputes but
    does not define the notice content, cure period, or appeal process.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-9858fc
  fact_id: FACT-20260902-4802e9
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Mosaic Relay has network monitoring obligations and wants a consistent
    process.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-6ac129
  fact_id: FACT-20260902-515efe
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Some merchants sell digital goods, while others sell physical goods or
    recurring services.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- support_id: SUP-20260902-350661
  fact_id: FACT-20260902-4485cf
  source_id: REQ-20260902-f39bb2
  relationship: support
  statement: Actors include merchants, their customers, Mosaic Relay Risk and Support,
    card networks, acquiring banks, and marketplace customers.
  location: ''
  created_at: '2026-09-02T14:54:23+00:00'
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
assumptions:
- assumption_id: ASM-20260902-03d75a
  text: The defined chargeback threshold and three-month window are treated as business-set
    parameters pending confirmation of network-specific thresholds.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:54:23+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- assumption_id: ASM-20260902-7b2c68
  text: Deactivation is a contractual suspension/termination right under the merchant
    agreement, not a new regulatory obligation.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:54:23+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-6555cf
- assumption_id: ASM-20260902-35a35c
  text: Network-specific thresholds (Visa/Mastercard monitoring program levels) and
    an internal Mosaic Relay-defined threshold are both used, with the internal threshold
    treated as the operative trigger pending confirmation of how the two interact.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-02T14:55:09+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260902-20cc90
conflicts: []
actions:
- action_id: ACT-20260902-5b5620
  summary: Linked Original request
  actor: system
  created_at: '2026-09-02T14:54:14+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260902-f39bb2
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-6555cf
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:54:23+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-aa588a
    - FACT-20260902-8dd06d
    - FACT-20260902-441e3a
    - FACT-20260902-d6ac0e
    - FACT-20260902-bcc2d0
    - FACT-20260902-4802e9
    - FACT-20260902-515efe
    - FACT-20260902-4485cf
    sources: []
    support:
    - SUP-20260902-b3a44d
    - SUP-20260902-139a6d
    - SUP-20260902-85718a
    - SUP-20260902-f2d74e
    - SUP-20260902-4135ed
    - SUP-20260902-9858fc
    - SUP-20260902-6ac129
    - SUP-20260902-350661
    assumptions:
    - ASM-20260902-03d75a
    - ASM-20260902-7b2c68
  source_action_key: chat:RUN-20260902-efee94:tool:132549a1dcac87d94f5889cd
- action_id: ACT-20260902-c71c97
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:54:57+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-f37f11
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-85245a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:54:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-92b542
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-cdcda0:answers
- action_id: ACT-20260902-20cc90
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:55:09+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260902-35a35c
  source_action_key: chat:RUN-20260902-cdcda0:tool:8802c67da90e6534a7e997bf
- action_id: ACT-20260902-4dd6e1
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:55:46+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-603fdc
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-faa706
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:55:46+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-9b23e0
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-220249:answers
- action_id: ACT-20260902-f1b44d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:55:55+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-220249:tool:48957f87d1d77b10a3c928af
- action_id: ACT-20260902-f1adcf
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:56:09+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-5f5384
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-a799ba
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:56:09+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-30b084
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-7f72b3:answers
- action_id: ACT-20260902-2992d7
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:56:17+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-7f72b3:tool:948a36e4b44b7a1e3dc8a5f6
- action_id: ACT-20260902-835346
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:56:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-0d35c8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-cef4b5
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:56:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-e5c903
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-4e5bbf:answers
- action_id: ACT-20260902-a19712
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:56:40+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-4e5bbf:tool:f151da6af186286c58e69fa9
- action_id: ACT-20260902-70d24a
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-02T14:56:56+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260902-6d63bd
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260902-e58635
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-02T14:56:56+00:00'
  status: applied
  created:
    facts:
    - FACT-20260902-27a5d9
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-c99a98:answers
- action_id: ACT-20260902-24aa9d
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-02T14:57:04+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260902-c99a98:tool:8aea4c25f4247dc1348e581b
working_ask: Mosaic Relay wants to deactivate merchants whose chargeback rate remains
  above a defined threshold for three consecutive months. The proposed experience
  would warn the merchant, require a remediation plan, restrict new payment methods,
  and then disable processing if performance does not improve. Existing refunds and
  dispute responses would remain available for 90 days. Legal advice is requested
  on the metric, warning and termination notices, cure and appeal rights, refund and
  dispute obligations after deactivation, and any required reporting or customer communications.
issues:
- 'Notice and cure: merchant agreement does not define notice content, cure period,
  or appeal process for suspension/deactivation.'
- 'Post-deactivation obligations: refund and dispute response obligations after deactivation
  (90-day window) need legal framing.'
- 'Reporting and customer communications: any required reporting to networks/banks
  or customer communications after deactivation is undefined.'
- 'Timing and scope: target launch date and affected jurisdictions/networks are undefined;
  confirm with Risk and Compliance before rollout.'
open_questions:
- Confirmation of applicable jurisdictions, network programs, and local notice rules
  with Risk and Compliance before rollout.
- How the internal Mosaic Relay threshold interacts with network-specific thresholds
  (which is the operative trigger).
public_research_questions:
- What are the current Visa and Mastercard chargeback monitoring program thresholds
  and timelines (e.g., VAMP, VFMP, MCM) that would apply to a U.S. merchant?
- What notice, cure, and appeal requirements do card networks impose on acquirers/processors
  before terminating or deactivating a merchant for excessive chargebacks?
- What post-termination refund and dispute-response obligations apply to a payment
  processor under card network rules and U.S. law?
intake_answers:
- answer_id: ANS-20260902-1107c4
  question_id: q_metric
  question: How should the chargeback metric be defined for triggering warnings and
    deactivation?
  answer: 'Use network-specific thresholds (Visa/Mastercard monitoring program levels):
    Use an internal Mosaic Relay-defined threshold: Exclude false/friendly-fraud disputes
    that are successfully rebutted: Exclude pending authorizations from the metric'
  values:
  - network_thresholds
  - internal_threshold
  - exclude_friendly_fraud
  - exclude_pending_auth
  status: answered
  record_target: fact
  source_id: MSG-20260902-f37f11
  source_action_key: chat:RUN-20260902-cdcda0
  answered_at: '2026-09-02T14:54:57+00:00'
  answer_fact_id: FACT-20260902-92b542
- answer_id: ANS-20260902-c09690
  question_id: q_consumer_complaints
  question: Are consumer-law complaints included in the chargeback metric?
  answer: No, exclude them (metric tracks chargebacks only)
  values:
  - exclude
  status: answered
  record_target: fact
  source_id: MSG-20260902-603fdc
  source_action_key: chat:RUN-20260902-220249
  answered_at: '2026-09-02T14:55:46+00:00'
  answer_fact_id: FACT-20260902-9b23e0
- answer_id: ANS-20260902-db9a1d
  question_id: q_marketplace_override
  question: Can marketplace customers override a Mosaic Relay deactivation decision?
  answer: Override only with documented exception approval
  values:
  - override_exception
  status: answered
  record_target: fact
  source_id: MSG-20260902-5f5384
  source_action_key: chat:RUN-20260902-7f72b3
  answered_at: '2026-09-02T14:56:09+00:00'
  answer_fact_id: FACT-20260902-30b084
- answer_id: ANS-20260902-3b0c1d
  question_id: cure_appeal
  question: What cure period and appeal process should merchants have before deactivation?
  answer: 30-day cure with written appeal
  values:
  - 30_day
  status: answered
  record_target: fact
  source_id: MSG-20260902-0d35c8
  source_action_key: chat:RUN-20260902-4e5bbf
  answered_at: '2026-09-02T14:56:32+00:00'
  answer_fact_id: FACT-20260902-e5c903
- answer_id: ANS-20260902-2c6e6c
  question_id: q_timing_scope
  question: What is the target launch date and which jurisdictions/networks apply
    first?
  answer: No launch date is set. Assume an initial U.S. launch covering Visa and Mastercard
    programs through Mosaic Relay's acquiring-bank partners; confirm applicable jurisdictions,
    network programs, and local notice rules with Risk and Compliance before rollout.
  values:
  - No launch date is set. Assume an initial U.S. launch covering Visa and Mastercard
    programs through Mosaic Relay's acquiring-bank partners; confirm applicable jurisdictions,
    network programs, and local notice rules with Risk and Compliance before rollout.
  status: answered
  record_target: target_date
  source_id: MSG-20260902-6d63bd
  source_action_key: chat:RUN-20260902-c99a98
  answered_at: '2026-09-02T14:56:56+00:00'
  answer_fact_id: FACT-20260902-27a5d9
intake_state: complete
---
# Known Facts

- Mosaic Relay wants to deactivate merchants whose chargeback rate remains above a defined threshold for three consecutive months.
- The proposed experience would warn the merchant, require a remediation plan, restrict new payment methods, and then disable processing if performance does not improve.
- Warnings would begin after the first month above threshold, and deactivation would occur after the third month unless a documented exception is approved.
- Existing refunds and dispute responses would remain available for 90 days after deactivation.
- The merchant agreement permits suspension for excessive disputes but does not define the notice content, cure period, or appeal process.
- Mosaic Relay has network monitoring obligations and wants a consistent process.
- Some merchants sell digital goods, while others sell physical goods or recurring services.
- Actors include merchants, their customers, Mosaic Relay Risk and Support, card networks, acquiring banks, and marketplace customers.
- How should the chargeback metric be defined for triggering warnings and deactivation? — Use network-specific thresholds (Visa/Mastercard monitoring program levels): Use an internal Mosaic Relay-defined threshold: Exclude false/friendly-fraud disputes that are successfully rebutted: Exclude pending authorizations from the metric
- exclude them (metric tracks chargebacks only).
- Can marketplace customers override a Mosaic Relay deactivation decision? — Override only with documented exception approval
- What cure period and appeal process should merchants have before deactivation? — 30-day cure with written appeal
- What is the target launch date and which jurisdictions/networks apply first? — No launch date is set. Assume an initial U.S. launch covering Visa and Mastercard programs through Mosaic Relay's acquiring-bank partners; confirm applicable jurisdictions, network programs, and local notice rules with Risk and Compliance before rollout.

## Assumptions

- [Assumption] The defined chargeback threshold and three-month window are treated as business-set parameters pending confirmation of network-specific thresholds.
- [Assumption] Deactivation is a contractual suspension/termination right under the merchant agreement, not a new regulatory obligation.
- [Assumption] Network-specific thresholds (Visa/Mastercard monitoring program levels) and an internal Mosaic Relay-defined threshold are both used, with the internal threshold treated as the operative trigger pending confirmation of how the two interact.
