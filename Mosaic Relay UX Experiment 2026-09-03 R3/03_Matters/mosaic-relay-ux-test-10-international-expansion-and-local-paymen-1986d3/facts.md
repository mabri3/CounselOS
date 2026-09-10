---
matter_id: MAT-20260904-1986d3
record_type: facts
facts:
- fact_id: FACT-20260904-aeb8fc
  text: Mosaic Relay is not a bank, does not hold deposits, and works through external
    payment and infrastructure providers.
  status: active
  material: true
  source_ids:
  - REQ-20260904-f3ea43
  supersedes: null
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- fact_id: FACT-20260904-09bcfd
  text: The proposed experience uses one global onboarding flow, local payment options
    at checkout, automated currency conversion, and cross-border payouts to sellers
    and contractors.
  status: active
  material: true
  source_ids:
  - REQ-20260904-f3ea43
  supersedes: null
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- fact_id: FACT-20260904-fcb184
  text: Product development would begin this quarter, with a pilot in six months and
    broader release after operational testing.
  status: active
  material: true
  source_ids:
  - REQ-20260904-f3ea43
  supersedes: null
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- fact_id: FACT-20260904-85b988
  text: The business goal is to help existing customers expand without building separate
    payment operations for each country.
  status: active
  material: true
  source_ids:
  - REQ-20260904-f3ea43
  supersedes: null
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- fact_id: FACT-20260904-6c8909
  text: Which specific countries are the target for this international expansion?
    This drives everything downstream — licensing, AML/KYC, privacy, and disclosures
    are all country-specific. — The target countries are not yet selected. Treat the
    country list as a launch gate. Do not approve a country until its licensing, funds
    flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements
    are documented.
  status: active
  material: true
  source_ids:
  - MSG-20260904-836731
  supersedes: null
  created_at: '2026-09-04T01:07:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-c107d1
- fact_id: FACT-20260904-dde1ce
  text: In the proposed cross-border flow, who holds customer funds at each step —
    does Mosaic Relay ever take custody of funds, or do acquiring/local payment providers
    and payout providers hold and move all funds? — Not yet determined — funds flow
    is still being designed
  status: active
  material: true
  source_ids:
  - MSG-20260904-d2c73d
  supersedes: null
  created_at: '2026-09-04T01:08:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-7b93f6
- fact_id: FACT-20260904-a70799
  text: Which Mosaic Relay entity would contract with merchants, sellers, and local
    payment providers in the new countries — a single global entity, or local/regional
    entities per country? — Not yet determined — contracting structure is still being
    designed
  status: active
  material: true
  source_ids:
  - MSG-20260904-f04806
  supersedes: null
  created_at: '2026-09-04T01:09:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-61dbdb
- fact_id: FACT-20260904-ec5383
  text: Which payout provider(s) would carry the cross-border payouts to sellers and
    contractors? — Not yet determined — payout provider not yet selected
  status: active
  material: true
  source_ids:
  - MSG-20260904-743c45
  supersedes: null
  created_at: '2026-09-04T01:09:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b0da94
- fact_id: FACT-20260904-96fbd3
  text: Where will customer and merchant data be located for the new countries — stored
    in existing Mosaic Relay data centers/regions, or in-country/local data storage?
    — Not yet determined — data locations not yet decided
  status: active
  material: true
  source_ids:
  - MSG-20260904-1e1681
  supersedes: null
  created_at: '2026-09-04T01:10:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-96093f
sources:
- source_id: REQ-20260904-f3ea43
  kind: immutable_request
  label: Original request
  path: 03_Matters/mosaic-relay-ux-test-10-international-expansion-and-local-paymen-1986d3/request.md
  version: ''
  location: ''
  created_at: '2026-09-04T01:06:19+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-871515
- source_id: MSG-20260904-836731
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T01:07:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-01289d
- source_id: MSG-20260904-d2c73d
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T01:08:04+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b92919
- source_id: MSG-20260904-f04806
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T01:09:21+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b8d5ee
- source_id: MSG-20260904-743c45
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T01:09:51+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-073ce5
- source_id: MSG-20260904-1e1681
  kind: conversation_message
  label: Matter intake response
  path: null
  version: ''
  location: ''
  created_at: '2026-09-04T01:10:48+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-77f9dd
support:
- support_id: SUP-20260904-46ef5d
  fact_id: FACT-20260904-aeb8fc
  source_id: REQ-20260904-f3ea43
  relationship: support
  statement: Mosaic Relay is not a bank, does not hold deposits, and works through
    external payment and infrastructure providers.
  location: ''
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- support_id: SUP-20260904-e3cf2c
  fact_id: FACT-20260904-09bcfd
  source_id: REQ-20260904-f3ea43
  relationship: support
  statement: The proposed experience uses one global onboarding flow, local payment
    options at checkout, automated currency conversion, and cross-border payouts to
    sellers and contractors.
  location: ''
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- support_id: SUP-20260904-edd782
  fact_id: FACT-20260904-fcb184
  source_id: REQ-20260904-f3ea43
  relationship: support
  statement: Product development would begin this quarter, with a pilot in six months
    and broader release after operational testing.
  location: ''
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- support_id: SUP-20260904-eee8f0
  fact_id: FACT-20260904-85b988
  source_id: REQ-20260904-f3ea43
  relationship: support
  statement: The business goal is to help existing customers expand without building
    separate payment operations for each country.
  location: ''
  created_at: '2026-09-04T01:06:32+00:00'
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
assumptions:
- assumption_id: ASM-20260904-194d54
  text: Mosaic Relay's existing acquiring/processing partners and local payment providers
    will carry the licensed money-transmission activity in each new country (agent/partner-of-record
    model), rather than Mosaic Relay obtaining new licenses itself.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T01:06:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- assumption_id: ASM-20260904-d35f45
  text: The 'several new countries' are within Mosaic Relay's existing footprint (North
    America, UK, EU, selected other markets) unless stated otherwise.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T01:06:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
- assumption_id: ASM-20260904-a0aa11
  text: Cross-border payouts to sellers and contractors are made through external
    payout providers rather than Mosaic Relay holding funds.
  reason: Needed to continue
  material: true
  status: open
  created_at: '2026-09-04T01:06:32+00:00'
  resolved_at: null
  withdrawn_at: null
  action_id: ACT-20260904-b60a82
conflicts: []
actions:
- action_id: ACT-20260904-871515
  summary: Linked Original request
  actor: system
  created_at: '2026-09-04T01:06:19+00:00'
  status: applied
  created:
    facts: []
    sources:
    - REQ-20260904-f3ea43
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-b60a82
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:06:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-aeb8fc
    - FACT-20260904-09bcfd
    - FACT-20260904-fcb184
    - FACT-20260904-85b988
    sources: []
    support:
    - SUP-20260904-46ef5d
    - SUP-20260904-e3cf2c
    - SUP-20260904-edd782
    - SUP-20260904-eee8f0
    assumptions:
    - ASM-20260904-194d54
    - ASM-20260904-d35f45
    - ASM-20260904-a0aa11
  source_action_key: chat:RUN-20260904-eba90d:tool:b940b12b9cd90fbf46a6ab64
- action_id: ACT-20260904-01289d
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T01:07:32+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-836731
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-c107d1
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T01:07:32+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-6c8909
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-3c3319:answers
- action_id: ACT-20260904-20593a
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:07:42+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-3c3319:tool:137349e1ac0fd44ad388a96d
- action_id: ACT-20260904-b92919
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T01:08:04+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-d2c73d
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-7b93f6
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T01:08:04+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-dde1ce
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-4761f0:answers
- action_id: ACT-20260904-2bc7da
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:09:00+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-4761f0:tool:b1f47e498613cf56f4ae4385
- action_id: ACT-20260904-b8d5ee
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T01:09:21+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-f04806
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-61dbdb
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T01:09:21+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-a70799
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-8887f2:answers
- action_id: ACT-20260904-967007
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:09:32+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-8887f2:tool:8e44b5326ee6e5771c36e288
- action_id: ACT-20260904-073ce5
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T01:09:51+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-743c45
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-b0da94
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T01:09:51+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-ec5383
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-677e75:answers
- action_id: ACT-20260904-c19d30
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:10:03+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-677e75:tool:9c2ae212d7369780d75f491f
- action_id: ACT-20260904-77f9dd
  summary: Linked Matter intake response
  actor: system
  created_at: '2026-09-04T01:10:48+00:00'
  status: applied
  created:
    facts: []
    sources:
    - MSG-20260904-1e1681
    support: []
    assumptions: []
  source_action_key: null
- action_id: ACT-20260904-96093f
  summary: Recorded intake question answers
  actor: user
  created_at: '2026-09-04T01:10:48+00:00'
  status: applied
  created:
    facts:
    - FACT-20260904-96fbd3
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-9b04f8:answers
- action_id: ACT-20260904-bf3149
  summary: Applied an Intake Agent turn
  actor: assistant
  created_at: '2026-09-04T01:11:00+00:00'
  status: applied
  created:
    facts: []
    sources: []
    support: []
    assumptions: []
  source_action_key: chat:RUN-20260904-9b04f8:tool:a9f7fd6fdb721997e17d9c3c
working_ask: 'Advise on the required regulatory analysis before Mosaic Relay launches
  international expansion (cards, ACH, and selected local payment methods in several
  new countries; one global onboarding flow, local checkout options, automated currency
  conversion, cross-border payouts to sellers and contractors). Deliverable: a country-approval
  gate framework — the minimum facts and documentation each candidate country must
  clear (licensing/agent, funds flow, AML/KYC, privacy, consumer, tax, sanctions,
  disclosure, payout) before it can be added to the launch list.'
issues:
- Money transmission / licensing exposure in each target country (Mosaic Relay is
  not a bank and does not hold deposits, but cross-border payouts and local payment
  acceptance may still trigger licensing or agent/partner-of-record structures)
- 'Cross-border AML/KYC controls: sanctions screening, KYB/KYC for merchants and recipients,
  transaction monitoring across jurisdictions'
- 'Consumer protection and funds-flow disclosures: cancellation rights, local disclosures,
  payout restrictions'
- 'Privacy and data protection: data locations, cross-border data transfers, controller/processor
  allocation'
- 'Contracting structure: which entity contracts with merchants, sellers, and local
  payment providers'
- Marketing limits and local disclosure requirements
- 'Country-approval gate: no country is approved until its licensing, funds flow,
  AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements
  are documented'
open_questions:
- Target country list (launch gate; not yet selected)
- Funds-flow diagram and who holds customer funds at each step (still being designed)
- Contracting entity structure (still being designed)
- Payout provider selection (not yet selected)
- Data locations for new countries (not yet decided)
public_research_questions:
- What are the money-transmission licensing or agent/partner-of-record requirements
  for a non-bank payment infrastructure provider in each candidate country?
- What cross-border AML/KYC, sanctions screening, and transaction monitoring obligations
  apply to cross-border payouts to sellers and contractors?
- What consumer protection, funds-flow disclosure, and payout restriction requirements
  apply to local payment methods in each candidate country?
intake_answers:
- answer_id: ANS-20260904-397f62
  question_id: target_countries
  question: Which specific countries are the target for this international expansion?
    This drives everything downstream — licensing, AML/KYC, privacy, and disclosures
    are all country-specific.
  answer: The target countries are not yet selected. Treat the country list as a launch
    gate. Do not approve a country until its licensing, funds flow, AML/KYC, privacy,
    consumer, tax, sanctions, disclosure, and payout requirements are documented.
  values:
  - The target countries are not yet selected. Treat the country list as a launch
    gate. Do not approve a country until its licensing, funds flow, AML/KYC, privacy,
    consumer, tax, sanctions, disclosure, and payout requirements are documented.
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-836731
  source_action_key: chat:RUN-20260904-3c3319
  answered_at: '2026-09-04T01:07:32+00:00'
  answer_fact_id: FACT-20260904-6c8909
- answer_id: ANS-20260904-eecad6
  question_id: funds_flow_holder
  question: In the proposed cross-border flow, who holds customer funds at each step
    — does Mosaic Relay ever take custody of funds, or do acquiring/local payment
    providers and payout providers hold and move all funds?
  answer: Not yet determined — funds flow is still being designed
  values:
  - undetermined
  status: answered
  record_target: fact
  source_id: MSG-20260904-d2c73d
  source_action_key: chat:RUN-20260904-4761f0
  answered_at: '2026-09-04T01:08:04+00:00'
  answer_fact_id: FACT-20260904-dde1ce
- answer_id: ANS-20260904-b1bd7b
  question_id: contracting_entity
  question: Which Mosaic Relay entity would contract with merchants, sellers, and
    local payment providers in the new countries — a single global entity, or local/regional
    entities per country?
  answer: Not yet determined — contracting structure is still being designed
  values:
  - undetermined
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-f04806
  source_action_key: chat:RUN-20260904-8887f2
  answered_at: '2026-09-04T01:09:21+00:00'
  answer_fact_id: FACT-20260904-a70799
- answer_id: ANS-20260904-a3fa04
  question_id: payout_provider
  question: Which payout provider(s) would carry the cross-border payouts to sellers
    and contractors?
  answer: Not yet determined — payout provider not yet selected
  values:
  - undetermined
  status: answered
  record_target: fact
  source_id: MSG-20260904-743c45
  source_action_key: chat:RUN-20260904-677e75
  answered_at: '2026-09-04T01:09:51+00:00'
  answer_fact_id: FACT-20260904-ec5383
- answer_id: ANS-20260904-2c4a7a
  question_id: data_locations
  question: Where will customer and merchant data be located for the new countries
    — stored in existing Mosaic Relay data centers/regions, or in-country/local data
    storage?
  answer: Not yet determined — data locations not yet decided
  values:
  - undetermined
  status: answered
  record_target: jurisdiction_scope
  source_id: MSG-20260904-1e1681
  source_action_key: chat:RUN-20260904-9b04f8
  answered_at: '2026-09-04T01:10:48+00:00'
  answer_fact_id: FACT-20260904-96fbd3
intake_state: complete
review:
  segments:
  - kind: equal
    text: '# Known Facts


      - Mosaic Relay is not a bank, does not hold deposits, and works through external
      payment and infrastructure providers.

      - The proposed experience uses one global onboarding flow, local payment options
      at checkout, automated currency conversion, and cross-border payouts to sellers
      and contractors.

      - Product development would begin this quarter, with a pilot in six months and
      broader release after operational testing.

      - The business goal is to help existing customers expand without building separate
      payment operations for each country.

      - Which specific countries are the target for this international expansion?
      This drives everything downstream — licensing, AML/KYC, privacy, and disclosures
      are all country-specific. — The target countries are not yet selected. Treat
      the country list as a launch gate. Do not approve a country until its licensing,
      funds flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout
      requirements are documented.

      - In the proposed cross-border flow, who holds customer funds at each step —
      does Mosaic Relay ever take custody of funds, or do acquiring/local payment
      providers and payout providers hold and move all funds? — Not yet determined
      — funds flow is still being designed

      - Which Mosaic Relay entity would contract with merchants, sellers, and local
      payment providers in the new countries — a single global entity, or local/regional
      entities per country? — Not yet determined — contracting structure is still
      being designed

      - Which payout provider(s) would carry the cross-border payouts to sellers and
      contractors? — Not yet determined — payout provider not yet selected

      - Where will customer and merchant data be located for the new countries — stored
      in existing Mosaic Relay data centers/regions, or in-country/local data storage?
      — Not yet determined — data locations not yet decided


      ## Assumptions


      - [Assumption] Mosaic Relay''s existing acquiring/processing partners and local
      payment providers will carry the licensed money-transmission activity in each
      new country (agent/partner-of-record model), rather than Mosaic Relay obtaining
      new licenses itself.

      - [Assumption] The ''several new countries'' are within Mosaic Relay''s existing
      footprint (North America, UK, EU, selected other markets) unless stated otherwise.

      - [Assumption] Cross-border payouts to sellers and contractors are made through
      external payout providers rather than Mosaic Relay holding funds.

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

- Mosaic Relay is not a bank, does not hold deposits, and works through external payment and infrastructure providers.
- The proposed experience uses one global onboarding flow, local payment options at checkout, automated currency conversion, and cross-border payouts to sellers and contractors.
- Product development would begin this quarter, with a pilot in six months and broader release after operational testing.
- The business goal is to help existing customers expand without building separate payment operations for each country.
- Which specific countries are the target for this international expansion? This drives everything downstream — licensing, AML/KYC, privacy, and disclosures are all country-specific. — The target countries are not yet selected. Treat the country list as a launch gate. Do not approve a country until its licensing, funds flow, AML/KYC, privacy, consumer, tax, sanctions, disclosure, and payout requirements are documented.
- In the proposed cross-border flow, who holds customer funds at each step — does Mosaic Relay ever take custody of funds, or do acquiring/local payment providers and payout providers hold and move all funds? — Not yet determined — funds flow is still being designed
- Which Mosaic Relay entity would contract with merchants, sellers, and local payment providers in the new countries — a single global entity, or local/regional entities per country? — Not yet determined — contracting structure is still being designed
- Which payout provider(s) would carry the cross-border payouts to sellers and contractors? — Not yet determined — payout provider not yet selected
- Where will customer and merchant data be located for the new countries — stored in existing Mosaic Relay data centers/regions, or in-country/local data storage? — Not yet determined — data locations not yet decided

## Assumptions

- [Assumption] Mosaic Relay's existing acquiring/processing partners and local payment providers will carry the licensed money-transmission activity in each new country (agent/partner-of-record model), rather than Mosaic Relay obtaining new licenses itself.
- [Assumption] The 'several new countries' are within Mosaic Relay's existing footprint (North America, UK, EU, selected other markets) unless stated otherwise.
- [Assumption] Cross-border payouts to sellers and contractors are made through external payout providers rather than Mosaic Relay holding funds.
