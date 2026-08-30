---
review:
  segments:
  - kind: equal
    text: '# Intake Orientation — Servicing and Collections Contact Strategy Test


      ## Business objective


      Northstar Pay''s Product team wants to redesign servicing and collections communications
      for customers with missed payments. The stated business goal is twofold: improve
      repayment rates on delinquent accounts, and help customers understand their
      repayment options so they can avoid unnecessary escalation. The redesign is
      a product change to the customer-facing delinquency experience, not a change
      to the underlying credit products, and it will be tested over an eight-week
      window before any broader rollout. Legal''s role is to define the communication
      rules, vendor oversight requirements, escalation process, and product controls
      needed to run the test safely.


      ## Eight-week test scope


      Product wants to test the new contact strategy over the next eight weeks. The
      test will exercise the redesigned communication flow end to end: early- and
      late-delinquency messaging tiers, customer self-service options (payment link,
      hardship-request form, payment-date change), and — possibly — placement of accounts
      that remain delinquent with a third-party collections vendor. The eight-week
      window means legal review must be front-loaded: contact-engine controls, message
      templates, and vendor arrangements need to be in place before the test starts,
      not iterated in mid-test. Whether third-party placement is actually in scope
      for the test, or deferred, is an open question that materially changes the legal
      workload.


      ## Participants


      The participants identified in the request are Northstar Pay, its bank and lending
      partners, customers, servicing agents, and collections vendors. The lending
      partners matter because the responsible entity for servicing and collections
      communications may differ by product and state — in some configurations the
      partner is the creditor of record and Northstar acts as servicer or program
      manager, which changes who must send required notices and how vendor oversight
      flows. Servicing agents will be the human touchpoint for phone calls and hardship
      conversations. The collections vendor, if used, is a "debt collector" under
      the FDCPA even where Northstar itself is not, and its conduct will be attributed
      to Northstar through contract terms and regulator scrutiny.


      ## Channels


      The proposed flow uses four channels: in-app notifications, email, text messages,
      and possibly phone calls. Each channel carries its own rules. SMS and prerecorded
      or artificial-voice calls to wireless numbers implicate the TCPA''s consent
      requirements and revocation rights. Email and app notifications are lower-risk
      channels but still must not disclose debt status to third parties who may see
      the device or inbox. Phone calls raise call-recording consent issues in all-party-consent
      states, quiet-hours rules, and third-party-disclosure risks when phone numbers
      are shared. The contact engine must apply channel-specific rules rather than
      treating all channels alike.


      ## Customer options


      Customers in the flow may receive a payment link, a hardship-request form, or
      an option to change a payment date. Each option has legal consequences. Payment
      links must be secure, branded, and must not leak account data to anyone other
      than the customer. Hardship requests likely trigger servicing obligations —
      once a customer submits a hardship form, escalation should pause pending review,
      and the intake and decision workflow should be confirmed with the relevant lending
      partner. Payment-date changes may implicate loan-modification or re-aging rules
      depending on the product and partner, and the customer-facing experience must
      clearly disclose any fees or consequences of the change before acceptance.


      ## Known facts


      The request identifies several known facts about the customer base that the
      contact engine must handle: customers may have multiple loans (so per-loan messaging
      could stack into harassment-level frequency unless deduplicated); phone numbers
      may be shared across customers or household members (creating third-party-disclosure
      risk on calls and texts); customers have language preferences that must be respected;
      and some contact information may be disputed, requiring suppression until verified.
      The team is also already considering automated contact limits, quiet hours,
      employer-contact restrictions, and differentiated messaging for early versus
      late delinquency — these are the right control categories and legal should help
      set the specific parameters.


      ## Legal issue map


      **Consent and channel rules (TCPA).** SMS and prerecorded/artificial-voice calls
      to a cell phone generally require prior express consent; the scope of consent
      obtained at origination matters (consent for servicing contacts is broader than
      consent for marketing). Customers must be able to revoke consent for texts and
      calls, and revocation must be honored promptly. Quiet hours of 8 a.m.–9 p.m.
      local time are the federal floor for calls and texts; several states impose
      stricter limits.


      **FDCPA-style conduct.** Northstar as creditor is likely not an FDCPA "debt
      collector" for its own first-party communications, but the collections vendor
      is, and several states (notably California''s Rosenthal Act) extend FDCPA duties
      to first-party collectors. Content limits apply: no false or misleading statements,
      no unfair practices, no disclosure of the debt to third parties, and no employer
      contact for consumer debts. Shared phone numbers make third-party-disclosure
      risk concrete — the flow must verify the customer''s identity before revealing
      account details.


      **Validation notices and disputes.** If a "debt collector" (including the vendor)
      initiates collection, a validation notice is generally required within five
      days of the initial communication, and disputes must pause escalation pending
      verification. Even in first-party flows, dispute handling must suppress escalation
      and route to a review workflow.


      **Contact frequency and harassment.** There is no bright-line federal cap on
      contact frequency, but repeated multi-channel daily contact invites harassment
      claims. The contact engine should enforce per-channel and aggregate caps with
      early- vs. late-delinquency tiers.


      **Permissible message content.** Messages must identify the sender, avoid disclosing
      debt status to third parties who may see the device, and avoid "overshadowing"
      language that rushes or contradicts validation/dispute rights.


      **Call recording.** All-party-consent states (including California and Washington
      — both live states) require consent before recording calls; either obtain a
      consent prompt or disable recording by state.


      **Third-party placement.** The placement trigger should be documented (e.g.,
      a delinquency-day threshold, post-validation, post-hardship-review). Vendor
      oversight requires a written agreement with FDCPA/FCRA/GLBA compliance representations,
      audit rights, complaint monitoring, chain-of-attorney rules, and state licensing/collection-agency
      registration checks.


      **Multi-loan, language, and disputed-contact handling.** The contact engine
      must dedupe across loans, respect language preferences, and suppress disputed
      contact information.


      ## Assumptions


      - The bank or lending partner is the creditor of record in at least some product/state
      configurations, and the responsible entity for communications may differ by
      partner. The partner map is still being finalized per the company profile, so
      this remains an open implementation fact to confirm.

      - The test runs in the currently live pay-in-4 states (California, Colorado,
      Georgia, Illinois, New York, Texas, Washington) unless Product says otherwise;
      longer-term installment products have a smaller approved state list.

      - Call recording is only "possibly" in scope; if it is not proposed, that issue
      drops out.

      - Third-party placement is also "possible" rather than confirmed; the legal
      workload differs significantly depending on whether placement is in the eight-week
      test.


      ## Missing facts


      - Whether third-party placement is in scope for the test, and if so, the proposed
      delinquency-day trigger and candidate vendor(s).

      - Whether phone calls will be recorded, and in which states.

      - The consent language currently obtained at origination and its scope for servicing/collections
      contacts.

      - The partner-by-product/state map, which determines the responsible entity
      for notices.

      - Current contact-frequency parameters Product is considering, and whether any
      caps already exist in the servicing system.

      - The hardship-form intake and decision workflow, and partner expectations for
      handling hardship requests.

      - Whether any state-specific collection notices or licenses apply in the live
      states.


      ## Unverified leads (not yet confirmed by research)


      - The specific states among the live seven that impose stricter quiet hours
      or contact-frequency limits beyond the federal floor.

      - The current text of state Rosenthal-style statutes extending FDCPA duties
      to first-party collectors in the live states.

      - State collection-agency licensing/registration requirements applicable to
      the vendor in each live state.

      - Current CFPB guidance or enforcement posture on digital-channel collections
      messaging and multi-channel frequency.

      - Specific all-party call-recording consent state list as applied to this footprint.


      These leads require research verification before being relied on for the test
      design.

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
# Intake Orientation — Servicing and Collections Contact Strategy Test

## Business objective

Northstar Pay's Product team wants to redesign servicing and collections communications for customers with missed payments. The stated business goal is twofold: improve repayment rates on delinquent accounts, and help customers understand their repayment options so they can avoid unnecessary escalation. The redesign is a product change to the customer-facing delinquency experience, not a change to the underlying credit products, and it will be tested over an eight-week window before any broader rollout. Legal's role is to define the communication rules, vendor oversight requirements, escalation process, and product controls needed to run the test safely.

## Eight-week test scope

Product wants to test the new contact strategy over the next eight weeks. The test will exercise the redesigned communication flow end to end: early- and late-delinquency messaging tiers, customer self-service options (payment link, hardship-request form, payment-date change), and — possibly — placement of accounts that remain delinquent with a third-party collections vendor. The eight-week window means legal review must be front-loaded: contact-engine controls, message templates, and vendor arrangements need to be in place before the test starts, not iterated in mid-test. Whether third-party placement is actually in scope for the test, or deferred, is an open question that materially changes the legal workload.

## Participants

The participants identified in the request are Northstar Pay, its bank and lending partners, customers, servicing agents, and collections vendors. The lending partners matter because the responsible entity for servicing and collections communications may differ by product and state — in some configurations the partner is the creditor of record and Northstar acts as servicer or program manager, which changes who must send required notices and how vendor oversight flows. Servicing agents will be the human touchpoint for phone calls and hardship conversations. The collections vendor, if used, is a "debt collector" under the FDCPA even where Northstar itself is not, and its conduct will be attributed to Northstar through contract terms and regulator scrutiny.

## Channels

The proposed flow uses four channels: in-app notifications, email, text messages, and possibly phone calls. Each channel carries its own rules. SMS and prerecorded or artificial-voice calls to wireless numbers implicate the TCPA's consent requirements and revocation rights. Email and app notifications are lower-risk channels but still must not disclose debt status to third parties who may see the device or inbox. Phone calls raise call-recording consent issues in all-party-consent states, quiet-hours rules, and third-party-disclosure risks when phone numbers are shared. The contact engine must apply channel-specific rules rather than treating all channels alike.

## Customer options

Customers in the flow may receive a payment link, a hardship-request form, or an option to change a payment date. Each option has legal consequences. Payment links must be secure, branded, and must not leak account data to anyone other than the customer. Hardship requests likely trigger servicing obligations — once a customer submits a hardship form, escalation should pause pending review, and the intake and decision workflow should be confirmed with the relevant lending partner. Payment-date changes may implicate loan-modification or re-aging rules depending on the product and partner, and the customer-facing experience must clearly disclose any fees or consequences of the change before acceptance.

## Known facts

The request identifies several known facts about the customer base that the contact engine must handle: customers may have multiple loans (so per-loan messaging could stack into harassment-level frequency unless deduplicated); phone numbers may be shared across customers or household members (creating third-party-disclosure risk on calls and texts); customers have language preferences that must be respected; and some contact information may be disputed, requiring suppression until verified. The team is also already considering automated contact limits, quiet hours, employer-contact restrictions, and differentiated messaging for early versus late delinquency — these are the right control categories and legal should help set the specific parameters.

## Legal issue map

**Consent and channel rules (TCPA).** SMS and prerecorded/artificial-voice calls to a cell phone generally require prior express consent; the scope of consent obtained at origination matters (consent for servicing contacts is broader than consent for marketing). Customers must be able to revoke consent for texts and calls, and revocation must be honored promptly. Quiet hours of 8 a.m.–9 p.m. local time are the federal floor for calls and texts; several states impose stricter limits.

**FDCPA-style conduct.** Northstar as creditor is likely not an FDCPA "debt collector" for its own first-party communications, but the collections vendor is, and several states (notably California's Rosenthal Act) extend FDCPA duties to first-party collectors. Content limits apply: no false or misleading statements, no unfair practices, no disclosure of the debt to third parties, and no employer contact for consumer debts. Shared phone numbers make third-party-disclosure risk concrete — the flow must verify the customer's identity before revealing account details.

**Validation notices and disputes.** If a "debt collector" (including the vendor) initiates collection, a validation notice is generally required within five days of the initial communication, and disputes must pause escalation pending verification. Even in first-party flows, dispute handling must suppress escalation and route to a review workflow.

**Contact frequency and harassment.** There is no bright-line federal cap on contact frequency, but repeated multi-channel daily contact invites harassment claims. The contact engine should enforce per-channel and aggregate caps with early- vs. late-delinquency tiers.

**Permissible message content.** Messages must identify the sender, avoid disclosing debt status to third parties who may see the device, and avoid "overshadowing" language that rushes or contradicts validation/dispute rights.

**Call recording.** All-party-consent states (including California and Washington — both live states) require consent before recording calls; either obtain a consent prompt or disable recording by state.

**Third-party placement.** The placement trigger should be documented (e.g., a delinquency-day threshold, post-validation, post-hardship-review). Vendor oversight requires a written agreement with FDCPA/FCRA/GLBA compliance representations, audit rights, complaint monitoring, chain-of-attorney rules, and state licensing/collection-agency registration checks.

**Multi-loan, language, and disputed-contact handling.** The contact engine must dedupe across loans, respect language preferences, and suppress disputed contact information.

## Assumptions

- The bank or lending partner is the creditor of record in at least some product/state configurations, and the responsible entity for communications may differ by partner. The partner map is still being finalized per the company profile, so this remains an open implementation fact to confirm.
- The test runs in the currently live pay-in-4 states (California, Colorado, Georgia, Illinois, New York, Texas, Washington) unless Product says otherwise; longer-term installment products have a smaller approved state list.
- Call recording is only "possibly" in scope; if it is not proposed, that issue drops out.
- Third-party placement is also "possible" rather than confirmed; the legal workload differs significantly depending on whether placement is in the eight-week test.

## Missing facts

- Whether third-party placement is in scope for the test, and if so, the proposed delinquency-day trigger and candidate vendor(s).
- Whether phone calls will be recorded, and in which states.
- The consent language currently obtained at origination and its scope for servicing/collections contacts.
- The partner-by-product/state map, which determines the responsible entity for notices.
- Current contact-frequency parameters Product is considering, and whether any caps already exist in the servicing system.
- The hardship-form intake and decision workflow, and partner expectations for handling hardship requests.
- Whether any state-specific collection notices or licenses apply in the live states.

## Unverified leads (not yet confirmed by research)

- The specific states among the live seven that impose stricter quiet hours or contact-frequency limits beyond the federal floor.
- The current text of state Rosenthal-style statutes extending FDCPA duties to first-party collectors in the live states.
- State collection-agency licensing/registration requirements applicable to the vendor in each live state.
- Current CFPB guidance or enforcement posture on digital-channel collections messaging and multi-channel frequency.
- Specific all-party call-recording consent state list as applied to this footprint.

These leads require research verification before being relied on for the test design.
