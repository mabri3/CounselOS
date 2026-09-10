---
matter_id: MAT-20260904-6f3f88
record_type: facts
facts:
- fact_id: FACT-20260904-281269
  text: Mosaic Relay wants to send targeted emails to merchants and platform administrators
    based on transaction volume, dispute rates, payout behavior, onboarding status,
    and fraud-risk indicators.
  status: active
  material: true
  source_ids:
  - REQ-20260904-35b6a8
  supersedes: null
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- fact_id: FACT-20260904-df8023
  text: 'Example use cases: recommending dispute tools to merchants with rising chargebacks;
    promoting faster onboarding to businesses that have not completed verification.'
  status: active
  material: true
  source_ids:
  - REQ-20260904-35b6a8
  supersedes: null
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- fact_id: FACT-20260904-164843
  text: Business goal is to increase feature adoption and reduce avoidable operational
    problems without sending irrelevant messages.
  status: active
  material: true
  source_ids:
  - REQ-20260904-35b6a8
  supersedes: null
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- fact_id: FACT-20260904-54d3c5
  text: Messages would be sent weekly, with event-triggered emails after a transaction
    or account review.
  status: active
  material: true
  source_ids:
  - REQ-20260904-35b6a8
  supersedes: null
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- fact_id: FACT-20260904-f5e7e6
  text: Mosaic Relay collects payment, onboarding, identity, risk, and operations
    data to provide its services.
  status: active
  material: true
  source_ids:
  - REQ-20260904-35b6a8
  supersedes: null
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- fact_id: FACT-20260904-6525d7
  text: Which jurisdictions will the targeted email recipients be in? This drives
    which consent, profiling, and unsubscribe rules apply (e.g., GDPR/UK GDPR vs.
    US CAN-SPAM). — Not sure yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-d89e4d
  supersedes: null
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-49990a
- fact_id: FACT-20260904-2f3bbc
  text: Are the email recipients consumers or business contacts (merchants/platform
    administrators acting in a business capacity)? — Business contacts only
  status: active
  material: true
  source_ids:
  - MSG-20260904-d89e4d
  supersedes: null
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-49990a
- fact_id: FACT-20260904-585ba9
  text: What is the current consent or legal-basis position for using service data
    to send these marketing emails? — Not sure
  status: active
  material: true
  source_ids:
  - MSG-20260904-d89e4d
  supersedes: null
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-49990a
- fact_id: FACT-20260904-e3e1be
  text: Does the targeting model use sensitive-data fields (identity documents, sanctions
    screening results, fraud-risk scores, or other special-category data) to select
    recipients? — Uses risk/fraud scores
  status: active
  material: true
  source_ids:
  - MSG-20260904-d89e4d
  supersedes: null
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-49990a
- fact_id: FACT-20260904-e28819
  text: What opt-out/unsubscribe and preference controls currently exist for these
    recipients? — None yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-d89e4d
  supersedes: null
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-49990a
- fact_id: FACT-20260904-b35d9d
  text: What do Mosaic Relay's customer contracts or instructions say about using
    platform-customer data (merchant/recipient data) for Mosaic's own marketing? This
    affects whether Mosaic can rely on its customers' consent or must obtain its own.
    — Not sure
  status: active
  material: true
  source_ids:
  - MSG-20260904-2eb68d
  supersedes: null
  created_at: '2026-09-04T00:58:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b3652b
- fact_id: FACT-20260904-423595
  text: What retention period applies to the targeting data and suppression lists?
    — No retention policy yet
  status: active
  material: true
  source_ids:
  - MSG-20260904-2eb68d
  supersedes: null
  created_at: '2026-09-04T00:58:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b3652b
- fact_id: FACT-20260904-641ec7
  text: When does the business need the legal answer? — Continue with assumptions
  status: active
  material: true
  source_ids:
  - MSG-20260904-0f6f48
  supersedes: null
  created_at: '2026-09-04T00:58:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b15189
sources:
- source_id: REQ-20260904-35b6a8
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-09-targeted-product-emails-using-transactio-6f3f88/request.md
  version: ''
  location: ''
  created_at: '2026-09-04T00:56:47+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-43ace5
- source_id: MSG-20260904-d89e4d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:57:33+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-4a1f2f
- source_id: MSG-20260904-2eb68d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:58:10+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-34c180
- source_id: MSG-20260904-0f6f48
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T00:58:41+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-de2257
support:
- support_id: SUP-20260904-31c0e3
  fact_id: FACT-20260904-281269
  source_id: REQ-20260904-35b6a8
  relationship: support
  statement: Mosaic Relay wants to send targeted emails to merchants and platform
    administrators based on transaction volume, dispute rates, payout behavior, onboarding
    status, and fraud-risk indicators.
  location: ''
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- support_id: SUP-20260904-1b8958
  fact_id: FACT-20260904-df8023
  source_id: REQ-20260904-35b6a8
  relationship: support
  statement: 'Example use cases: recommending dispute tools to merchants with rising
    chargebacks; promoting faster onboarding to businesses that have not completed
    verification.'
  location: ''
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- support_id: SUP-20260904-405a3c
  fact_id: FACT-20260904-164843
  source_id: REQ-20260904-35b6a8
  relationship: support
  statement: Business goal is to increase feature adoption and reduce avoidable operational
    problems without sending irrelevant messages.
  location: ''
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- support_id: SUP-20260904-50ee2e
  fact_id: FACT-20260904-54d3c5
  source_id: REQ-20260904-35b6a8
  relationship: support
  statement: Messages would be sent weekly, with event-triggered emails after a transaction
    or account review.
  location: ''
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
- support_id: SUP-20260904-43806e
  fact_id: FACT-20260904-f5e7e6
  source_id: REQ-20260904-35b6a8
  relationship: support
  statement: Mosaic Relay collects payment, onboarding, identity, risk, and operations
    data to provide its services.
  location: ''
  created_at: '2026-09-04T00:56:57+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-894731
assumptions:
- assumption_id: ASM-20260904-7d677b
  text: Recipients are business contacts (merchants/platform admins), not consumers
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:56:57+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-894731
- assumption_id: ASM-20260904-4b6290
  text: Mosaic Relay is the data controller for its own marketing emails
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:56:57+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-894731
- assumption_id: ASM-20260904-0505cf
  text: Recipients are merchants and platform administrators (business contacts),
    not consumers.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:56:57+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-894731
- assumption_id: ASM-20260904-191a04
  text: Recipients are merchants and platform administrators (business contacts),
    not consumers
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:57:41+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-427540
- assumption_id: ASM-20260904-9255da
  text: Risk/fraud scores used for targeting are derived from service data but do
    not themselves constitute special-category data unless they reveal sensitive attributes
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:57:41+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-427540
- assumption_id: ASM-20260904-eb62a6
  text: Mosaic Relay is the data controller for its own marketing emails.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:58:24+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-877c85
- assumption_id: ASM-20260904-b5e110
  text: Risk/fraud scores used for targeting are derived from service data but do
    not themselves constitute special-category data unless they reveal sensitive attributes.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T00:58:24+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-877c85
conflicts: []
actions:
- action_id: ACT-20260904-43ace5
  summary: Linked Original request
  actor: system
  created_at: '2026-09-04T00:56:47+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260904-35b6a8
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-894731
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:56:57+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-281269
    - FACT-20260904-df8023
    - FACT-20260904-164843
    - FACT-20260904-54d3c5
    - FACT-20260904-f5e7e6
    sources: []
    support:
    - SUP-20260904-31c0e3
    - SUP-20260904-1b8958
    - SUP-20260904-405a3c
    - SUP-20260904-50ee2e
    - SUP-20260904-43806e
    assumptions:
    - ASM-20260904-7d677b
    - ASM-20260904-4b6290
    - ASM-20260904-0505cf
  source_action_key: chat:RUN-20260904-9c5eec:tool:833fedf3ade0a4e4d616c08e
- action_id: ACT-20260904-4a1f2f
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:57:33+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-d89e4d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-49990a
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:57:33+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-6525d7
    - FACT-20260904-2f3bbc
    - FACT-20260904-585ba9
    - FACT-20260904-e3e1be
    - FACT-20260904-e28819
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-14301a:answers
- action_id: ACT-20260904-427540
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:57:41+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260904-191a04
    - ASM-20260904-9255da
  source_action_key: chat:RUN-20260904-14301a:tool:3a117c72b4af4b5e2582251d
- action_id: ACT-20260904-34c180
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:58:10+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-2eb68d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-b3652b
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:58:10+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-b35d9d
    - FACT-20260904-423595
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-d7103e:answers
- action_id: ACT-20260904-877c85
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:58:24+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions:
    - ASM-20260904-eb62a6
    - ASM-20260904-b5e110
  source_action_key: chat:RUN-20260904-d7103e:tool:16dd53dc548bb259972fe488
- action_id: ACT-20260904-de2257
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T00:58:41+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-0f6f48
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-b15189
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T00:58:41+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-641ec7
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-195de5:answers
- action_id: ACT-20260904-1092db
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T00:58:49+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-195de5:tool:e52a298bd38e81124157b58f
working_ask: 'Advise on permitted use of service data for targeted product emails
  to merchants/platform admins (business contacts), covering: purpose limitation,
  consent/legal basis, profiling and sensitive-data restrictions, message classification,
  customer-vs-Mosaic responsibility, retention, and suppression/preference controls.'
issues:
- Use of service data for marketing vs. the purpose for which it was collected (purpose
  limitation)
- Consent vs. legitimate-interest legal basis across jurisdictions
- Profiling and sensitive-data restrictions (GDPR Art. 22, special categories) given
  risk/fraud-score targeting
- 'Message classification: transactional/service vs. marketing (CAN-SPAM, PECR, GDPR)'
- Allocation of responsibility between Mosaic Relay and its platform customers
- Suppression, unsubscribe, and preference-management controls (none exist today)
- Retention of targeting data and suppression lists (no policy yet)
open_questions:
- Jurisdiction of targeted email recipients
public_research_questions:
- GDPR/UK GDPR and PECR requirements for B2B marketing email, consent vs. legitimate
  interest, and profiling restrictions
- US CAN-SPAM requirements for commercial email to business contacts, including unsubscribe
  obligations
- Special-category data and Art. 22 automated decision-making treatment of fraud/risk
  scores in marketing targeting
intake_answers:
- answer_id: ANS-20260904-942098
  question_id: jurisdiction
  question: Which jurisdictions will the targeted email recipients be in? This drives
    which consent, profiling, and unsubscribe rules apply (e.g., GDPR/UK GDPR vs.
    US CAN-SPAM).
  answer: Not sure yet
  values:
  - not_sure
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-d89e4d
  source_action_key: chat:RUN-20260904-14301a
  answered_at: '2026-09-04T00:57:33+00:00'
  answer_fact_id: FACT-20260904-6525d7
- answer_id: ANS-20260904-84fd38
  question_id: recipient_type
  question: Are the email recipients consumers or business contacts (merchants/platform
    administrators acting in a business capacity)?
  answer: Business contacts only
  values:
  - business
  status: answered
  record_target: fact
  source_id: MSG-20260904-d89e4d
  source_action_key: chat:RUN-20260904-14301a
  answered_at: '2026-09-04T00:57:33+00:00'
  answer_fact_id: FACT-20260904-2f3bbc
- answer_id: ANS-20260904-6f776f
  question_id: consent_status
  question: What is the current consent or legal-basis position for using service
    data to send these marketing emails?
  answer: Not sure
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260904-d89e4d
  source_action_key: chat:RUN-20260904-14301a
  answered_at: '2026-09-04T00:57:33+00:00'
  answer_fact_id: FACT-20260904-585ba9
- answer_id: ANS-20260904-bfb3cc
  question_id: sensitive_data
  question: Does the targeting model use sensitive-data fields (identity documents,
    sanctions screening results, fraud-risk scores, or other special-category data)
    to select recipients?
  answer: Uses risk/fraud scores
  values:
  - risk_scores
  status: answered
  record_target: fact
  source_id: MSG-20260904-d89e4d
  source_action_key: chat:RUN-20260904-14301a
  answered_at: '2026-09-04T00:57:33+00:00'
  answer_fact_id: FACT-20260904-e3e1be
- answer_id: ANS-20260904-89b255
  question_id: optout_controls
  question: What opt-out/unsubscribe and preference controls currently exist for these
    recipients?
  answer: None yet
  values:
  - none
  status: answered
  record_target: fact
  source_id: MSG-20260904-d89e4d
  source_action_key: chat:RUN-20260904-14301a
  answered_at: '2026-09-04T00:57:33+00:00'
  answer_fact_id: FACT-20260904-e28819
- answer_id: ANS-20260904-07314e
  question_id: customer_instructions
  question: What do Mosaic Relay's customer contracts or instructions say about using
    platform-customer data (merchant/recipient data) for Mosaic's own marketing? This
    affects whether Mosaic can rely on its customers' consent or must obtain its own.
  answer: Not sure
  values:
  - not_sure
  status: answered
  record_target: fact
  source_id: MSG-20260904-2eb68d
  source_action_key: chat:RUN-20260904-d7103e
  answered_at: '2026-09-04T00:58:10+00:00'
  answer_fact_id: FACT-20260904-b35d9d
- answer_id: ANS-20260904-c94627
  question_id: retention
  question: What retention period applies to the targeting data and suppression lists?
  answer: No retention policy yet
  values:
  - no_policy
  status: answered
  record_target: fact
  source_id: MSG-20260904-2eb68d
  source_action_key: chat:RUN-20260904-d7103e
  answered_at: '2026-09-04T00:58:10+00:00'
  answer_fact_id: FACT-20260904-423595
- answer_id: ANS-20260904-a8c4e5
  question_id: intake-recovery-timing
  question: When does the business need the legal answer?
  answer: Continue with assumptions
  values:
  - continue_with_assumptions
  status: answered
  record_target: fact
  source_id: MSG-20260904-0f6f48
  source_action_key: chat:RUN-20260904-195de5
  answered_at: '2026-09-04T00:58:41+00:00'
  answer_fact_id: FACT-20260904-641ec7
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay wants to send targeted emails to merchants and platform administrators
      based on transaction volume, dispute rates, payout behavior, onboarding status,
      and fraud-risk indicators.

      - Example use cases: recommending dispute tools to merchants with rising chargebacks;
      promoting faster onboarding to businesses that have not completed verification.

      - Business goal is to increase feature adoption and reduce avoidable operational
      problems without sending irrelevant messages.

      - Messages would be sent weekly, with event-triggered emails after a transaction
      or account review.

      - Mosaic Relay collects payment, onboarding, identity, risk, and operations
      data to provide its services.

      - Which jurisdictions will the targeted email recipients be in? This drives
      which consent, profiling, and unsubscribe rules apply (e.g., GDPR/UK GDPR vs.
      US CAN-SPAM). — Not sure yet

      - Are the email recipients consumers or business contacts (merchants/platform
      administrators acting in a business capacity)? — Business contacts only

      - What is the current consent or legal-basis position for using service data
      to send these marketing emails? — Not sure

      - Does the targeting model use sensitive-data fields (identity documents, sanctions
      screening results, fraud-risk scores, or other special-category data) to select
      recipients? — Uses risk/fraud scores

      - What opt-out/unsubscribe and preference controls currently exist for these
      recipients? — None yet

      - What do Mosaic Relay''s customer contracts or instructions say about using
      platform-customer data (merchant/recipient data) for Mosaic''s own marketing?
      This affects whether Mosaic can rely on its customers'' consent or must obtain
      its own. — Not sure

      - What retention period applies to the targeting data and suppression lists?
      — No retention policy yet

      - When does the business need the legal answer? — Continue with assumptions


      ## Assumptions


      - [Assumption] Recipients are business contacts (merchants/platform admins),
      not consumers

      - [Assumption] Mosaic Relay is the data controller for its own marketing emails

      - [Assumption] Recipients are merchants and platform administrators (business
      contacts), not consumers.

      - [Assumption] Recipients are merchants and platform administrators (business
      contacts), not consumers

      - [Assumption] Risk/fraud scores used for targeting are derived from service
      data but do not themselves constitute special-category data unless they reveal
      sensitive attributes

      - [Assumption] Mosaic Relay is the data controller for its own marketing emails.

      - [Assumption] Risk/fraud scores used for targeting are derived from service
      data but do not themselves constitute special-category data unless they reveal
      sensitive attributes.

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
# Known Facts

- Mosaic Relay wants to send targeted emails to merchants and platform administrators based on transaction volume, dispute rates, payout behavior, onboarding status, and fraud-risk indicators.
- Example use cases: recommending dispute tools to merchants with rising chargebacks; promoting faster onboarding to businesses that have not completed verification.
- Business goal is to increase feature adoption and reduce avoidable operational problems without sending irrelevant messages.
- Messages would be sent weekly, with event-triggered emails after a transaction or account review.
- Mosaic Relay collects payment, onboarding, identity, risk, and operations data to provide its services.
- Which jurisdictions will the targeted email recipients be in? This drives which consent, profiling, and unsubscribe rules apply (e.g., GDPR/UK GDPR vs. US CAN-SPAM). — Not sure yet
- Are the email recipients consumers or business contacts (merchants/platform administrators acting in a business capacity)? — Business contacts only
- What is the current consent or legal-basis position for using service data to send these marketing emails? — Not sure
- Does the targeting model use sensitive-data fields (identity documents, sanctions screening results, fraud-risk scores, or other special-category data) to select recipients? — Uses risk/fraud scores
- What opt-out/unsubscribe and preference controls currently exist for these recipients? — None yet
- What do Mosaic Relay's customer contracts or instructions say about using platform-customer data (merchant/recipient data) for Mosaic's own marketing? This affects whether Mosaic can rely on its customers' consent or must obtain its own. — Not sure
- What retention period applies to the targeting data and suppression lists? — No retention policy yet
- When does the business need the legal answer? — Continue with assumptions

## Assumptions

- [Assumption] Recipients are business contacts (merchants/platform admins), not consumers
- [Assumption] Mosaic Relay is the data controller for its own marketing emails
- [Assumption] Recipients are merchants and platform administrators (business contacts), not consumers.
- [Assumption] Recipients are merchants and platform administrators (business contacts), not consumers
- [Assumption] Risk/fraud scores used for targeting are derived from service data but do not themselves constitute special-category data unless they reveal sensitive attributes
- [Assumption] Mosaic Relay is the data controller for its own marketing emails.
- [Assumption] Risk/fraud scores used for targeting are derived from service data but do not themselves constitute special-category data unless they reveal sensitive attributes.
