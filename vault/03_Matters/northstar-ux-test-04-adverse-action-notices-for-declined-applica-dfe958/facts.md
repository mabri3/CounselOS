---
matter_id: MAT-20260830-dfe958
record_type: facts
facts:
- fact_id: FACT-20260830-3939d9
  text: 'Intake response: partly'
  status: active
  material: true
  source_ids:
  - CONV-20260830-d03be5
  supersedes: null
  created_at: '2026-08-30T08:36:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260830-6d1c2c
sources:
- source_id: CONV-20260830-d03be5
  kind: conversation
  label: Current matter chat
  path: null
  version: ''
  location: ''
  created_at: '2026-08-30T08:36:35+00:00'
  withdrawn_at: null
  action_id: ACT-20260830-6d1c2c
support: []
assumptions: []
conflicts: []
actions:
- action_id: ACT-20260830-6d1c2c
  summary: Saved an intake response
  actor: assistant
  created_at: '2026-08-30T08:36:35+00:00'
  status: applied
  created:
    facts:
    - FACT-20260830-3939d9
    sources:
    - CONV-20260830-d03be5
    support: []
    assumptions: []
review:
  segments:
  - kind: equal
    text: '# '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '# Known '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: facts
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      - '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Product
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ': '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'Northstar Pay is designing a real-time financing decision flow for approval,
      conditional approval, and decline.


      - Business goal: provide useful customer information without exposing fraud
      controls or causing confusion.


      - Notice concept: the product may show general decline reasons and may send
      a written notice by email or postal mail.


      - Decision inputs may include credit-report information, application data, bank-account
      information, fraud signals, and automated models.


      - Decision ownership: some applications are declined by Northstar Pay; others
      are declined by a lending partner.


      - Actors: Northstar Pay, lending partners, customers, credit-reporting vendors,
      and customer support teams.


      - Timing: Product wants to launch before the holiday shopping season.


      ## Facts that are not confirmed


      - The legal creditor and applicant-facing decision-maker for each product and
      each decline type.


      - Which entity obtains or uses a consumer report, and the identity of each reporting
      vendor.


      - Whether the product is open-end or closed-end credit, including the treatment
      of pay-in-4 and longer-term installments.


      - Whether conditional approval changes price, amount, term, or other material
      terms and is therefore a counteroffer, or whether it is a final approval.


      - The exact event that ends an application, including abandonment before decision
      and abandonment after a decision.


      - The launch states and any state-specific denial-notice overlays.


      - Whether email delivery has valid Electronic Signatures in Global and National
      Commerce Act (ESIGN) consent and access procedures, and whether in-app messaging
      is only a courtesy message or the required written notice.


      - The exact model inputs, reason codes, override rules, and the mapping from
      internal codes to principal reasons.


      - Contractual allocations among Northstar Pay, lenders, consumer-reporting vendors,
      fraud vendors, and support teams.


      - Notice timing, retention period, translation needs, accessibility requirements,
      and escalation process.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      ## Assumptions


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '1. This is a consumer-credit product covered by the Equal Credit Opportunity
      Act (ECOA) and Regulation B. Not verified against product documents.


      2. Fair Credit Reporting Act (FCRA) adverse-action duties may apply when a consumer
      report contributes to the decision. Not verified against data flows.


      3. Creditor identity may differ by flow. This is a working assumption, not a
      conclusion.


      4. Electronic delivery must satisfy ESIGN and any applicable state requirements.
      Not verified against consent records.


      5. A real-time decline screen is not assumed to replace a legally required written
      notice. Treat as a courtesy or interim message until confirmed.


      ## Unverified leads and evidence limits


      The existing first-pass research is an unverified lead for launch planning. '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: 'No '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: source
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
    text: package, lender agreement, model card, reason-code dictionary, state matrix,
      or consent evidence was provided in the intake. These gaps reduce confidence
      in exact issuer, timing, and wording conclusions but do not prevent a useful
      launch design. The fact record must be updated when Product confirms ownership,
      structure, state list, reason mappings, and delivery evidence
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '.

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
# # Known facts

- Product: Northstar Pay is designing a real-time financing decision flow for approval, conditional approval, and decline.

- Business goal: provide useful customer information without exposing fraud controls or causing confusion.

- Notice concept: the product may show general decline reasons and may send a written notice by email or postal mail.

- Decision inputs may include credit-report information, application data, bank-account information, fraud signals, and automated models.

- Decision ownership: some applications are declined by Northstar Pay; others are declined by a lending partner.

- Actors: Northstar Pay, lending partners, customers, credit-reporting vendors, and customer support teams.

- Timing: Product wants to launch before the holiday shopping season.

## Facts that are not confirmed

- The legal creditor and applicant-facing decision-maker for each product and each decline type.

- Which entity obtains or uses a consumer report, and the identity of each reporting vendor.

- Whether the product is open-end or closed-end credit, including the treatment of pay-in-4 and longer-term installments.

- Whether conditional approval changes price, amount, term, or other material terms and is therefore a counteroffer, or whether it is a final approval.

- The exact event that ends an application, including abandonment before decision and abandonment after a decision.

- The launch states and any state-specific denial-notice overlays.

- Whether email delivery has valid Electronic Signatures in Global and National Commerce Act (ESIGN) consent and access procedures, and whether in-app messaging is only a courtesy message or the required written notice.

- The exact model inputs, reason codes, override rules, and the mapping from internal codes to principal reasons.

- Contractual allocations among Northstar Pay, lenders, consumer-reporting vendors, fraud vendors, and support teams.

- Notice timing, retention period, translation needs, accessibility requirements, and escalation process.

## Assumptions

1. This is a consumer-credit product covered by the Equal Credit Opportunity Act (ECOA) and Regulation B. Not verified against product documents.

2. Fair Credit Reporting Act (FCRA) adverse-action duties may apply when a consumer report contributes to the decision. Not verified against data flows.

3. Creditor identity may differ by flow. This is a working assumption, not a conclusion.

4. Electronic delivery must satisfy ESIGN and any applicable state requirements. Not verified against consent records.

5. A real-time decline screen is not assumed to replace a legally required written notice. Treat as a courtesy or interim message until confirmed.

## Unverified leads and evidence limits

The existing first-pass research is an unverified lead for launch planning. No source package, lender agreement, model card, reason-code dictionary, state matrix, or consent evidence was provided in the intake. These gaps reduce confidence in exact issuer, timing, and wording conclusions but do not prevent a useful launch design. The fact record must be updated when Product confirms ownership, structure, state list, reason mappings, and delivery evidence.
