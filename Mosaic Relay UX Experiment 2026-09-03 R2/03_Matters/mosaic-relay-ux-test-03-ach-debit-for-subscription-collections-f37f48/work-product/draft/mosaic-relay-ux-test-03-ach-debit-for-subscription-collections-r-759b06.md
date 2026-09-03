---
work_product_id: WP-20260903-759b06
matter_id: MAT-20260903-f37f48
title: NACHA Operating Rules Requirements for Recurring ACH Debit Authorization, Advance
  Notice, and Record Retention
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T16:36:49+00:00'
updated_at: '2026-09-03T16:38:06+00:00'
immutable: false
source_action_key: null
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
    text: 'Executive summary


      Recommendation: do not launch the 30-day pilot until the five controlling facts
      and the platform role are confirmed. A controlled US-only pilot may proceed
      only after the requirements below are implemented and evidenced.


      Scope and assumptions


      US-only. Mosaic Relay acts as or coordinates with the ODFI/originator and the
      originating bank is a regulated partner. The platform role, consumer/business
      mix, fixed/variable amount, cancellation propagation, authorization record format,
      notice timing, retry logic, and unauthorized-return process are unconfirmed.
      These assumptions are not verified sources.


      Required approval conditions


      1. Authorization: obtain clear, affirmative authorization for recurring ACH
      debits. State the amount or explain how variable amounts are determined, frequency,
      start date, account, and revocation method. Capture the authorization record
      and a reproducible audit trail, including versioned screen/text, timestamp,
      user identity, account token, IP/device evidence where appropriate, and confirmation.
      Do not use prechecked consent.


      2. Recurring debit and notice: identify fixed versus variable amounts. For variable
      amounts, provide NACHA advance notice (10 days before the first debit and 7
      days before later debits, unless a valid exception applies) and disclose changes.
      For consumer accounts, deliver the Reg E disclosures and any required written
      authorization/terms. Confirm the originator/ODFI allocation.


      3. Cancellation and stop: provide a simple platform cancellation path and a
      separate stop-payment path. Record the request time, effective cutoff, and confirmation.
      Propagate the stop to Mosaic Relay before the next file; reconcile cancellations
      against scheduled debits. Never retry after revocation or an unauthorized claim.


      4. Returns, retries, and unauthorized activity: define return-code handling
      for R07, R10, and R29. Place an immediate hold on further debits after an unauthorized
      return or revocation, investigate, and document resolution. Retry only under
      a documented NACHA-compliant policy with authorization and notice analysis for
      each retry. For consumer accounts, support Reg E error claims and the 60-day
      unauthorized-transfer resolution process.


      5. Recordkeeping and controls: retain authorization (or a record) for at least
      2 years in a reproducible format; preserve notices, confirmations, cancellations,
      returns, retries, and investigation records with access controls and an export
      path. Confirm whether the originating bank or other party has a longer retention
      duty.


      Journey versus operations comparison


      Proposed journey: enter bank account -> consent to recurring debits -> confirmation
      -> cancel on platform. Operations must add: validate authorization and account
      token; assign owner and cutoff; schedule fixed/variable notice; send ACH file;
      reconcile returns; stop future debits on cancellation; route unauthorized returns
      to review; retain evidence; and report exceptions. The journey is incomplete
      until each customer action has an operations owner and timestamped control.


      Open facts that could change the answer


      Consumer/business mix; platform role (originator, third-party sender, service
      provider); fixed/variable debit amount; cancellation channel and propagation
      SLA; notice timing and method; authorization record format and retention; retry
      limits; R07/R10/R29 treatment; state licensing/money-transmission scope; processor/ODFI
      allocation; data retention/security; and transaction volume.


      Decision posture


      Launch decision: HOLD pending confirmation of the above facts and evidence of
      the controls. Recommendation is separate from the formal decision. Reassess
      when Product supplies the missing facts.

      '
    change_id: CHG-20260903-7460f7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:38:06+00:00'
  - kind: insert
    text: '# NACHA Operating Rules Requirements for Recurring ACH Debits


      ## Question


      What are the current NACHA Operating Rules requirements for recurring ACH debit
      authorization, advance notice, and 2-year record retention?


      ## Answer in brief


      For recurring ACH debits, the NACHA Operating Rules require (1) a valid authorization
      from the account holder, (2) advance notice of variable-amount debits (10 calendar
      days before the first debit and 7 calendar days before each subsequent debit),
      and (3) retention of the authorization (or a reproducible record of it) for
      2 years from the date of the last debit. Where consumer accounts are involved,
      Regulation E/EFTA adds separate authorization, stop-payment, and error-resolution
      requirements on top of the NACHA rules. This answer states the NACHA baseline;
      the Reg E overlay applies only if consumer accounts are in scope, which remains
      unresolved for the pilot.


      ## 1. Authorization


      - A recurring ACH debit must be supported by a valid authorization from the
      account holder. The authorization must clearly identify the account, the amount
      (or the method for determining the amount), the timing/frequency of the debits,
      and the account holder''s agreement to recurring debits.

      - For consumer accounts, the authorization must be in writing or "similarly
      authenticated" (an electronic signature compliant with E-SIGN). A copy of the
      authorization must be provided to the consumer.

      - The authorization must be obtained before the first debit. Prechecked or implied
      consent does not satisfy the requirement; consent must be clear and affirmative.

      - The account holder may revoke authorization at any time. Continued debits
      after revocation are unauthorized and expose the originator and ODFI to return
      liability and NACHA enforcement.


      ## 2. Advance notice


      - **Variable amounts:** If the debit amount varies, NACHA requires notice of
      the amount and scheduled date at least 10 calendar days before the first debit
      and at least 7 calendar days before each subsequent debit.

      - **Fixed amounts:** If the amount is fixed, notice of the schedule at the time
      of authorization may suffice; the recurring schedule should be documented in
      the authorization.

      - The fixed-versus-variable distinction is a controlling fact for the pilot
      and remains unresolved. If amounts are variable, the 10-day/7-day advance-notice
      process must be implemented.


      ## 3. Record retention


      - The ODFI (originating bank) must retain the original authorization, or a reproducible
      record of it, for 2 years from the date of the last debit.

      - The record must be capable of being reproduced accurately and provided to
      the RDFI or the account holder upon request.

      - For an electronic authorization to satisfy this requirement, the record should
      include a reproducible audit trail (e.g., versioned screen/text, timestamp,
      user identity, account token, and IP/device evidence where appropriate) and
      be retained for the full 2-year period.


      ## 4. Related return and retry rules (context for the authorization/notice framework)


      - Returned debits may be reinitiated only under specific conditions. NACHA limits
      reinitiation to two attempts following the first return, and only where the
      return was for insufficient funds (R01) or uncollected funds (R09).

      - Returns coded R07 (authorization revoked), R10 (customer advises not authorized),
      or R29 (corporate customer advises not authorized) must not be reinitiated without
      new authorization.

      - Retries may constitute new debits requiring fresh authorization and notice;
      each retry should be analyzed for authorization and notice compliance.


      ## 5. Reg E/EFTA overlay (applies only if consumer accounts are in scope)


      - Preauthorized ACH debits from consumer accounts are "preauthorized EFTs" under
      Reg E, requiring written or electronic authorization and delivery of a copy
      to the consumer.

      - Consumers may stop payment of a preauthorized EFT by notifying their bank
      at least 3 business days before the scheduled debit.

      - Consumers have 60 days from the periodic statement to report unauthorized
      or incorrect transfers; the bank must investigate and provisionally credit within
      10 business days if it cannot resolve the error immediately.

      - Consumer liability for unauthorized EFTs is capped at $50 if reported within
      2 business days, $500 within 60 days, and unlimited thereafter. Continued debits
      after revocation are unauthorized.


      ## Facts that could change this answer


      1. **Consumer vs. business account mix:** If any consumer accounts are in scope,
      Reg E/EFTA applies on top of NACHA, adding stop-payment, 60-day error resolution,
      and specific authorization-language requirements. If business-only, only NACHA
      rules apply. This is the single most material unresolved fact.

      2. **Fixed vs. variable debit amount:** Variable amounts trigger the 10-day/7-day
      advance-notice requirement; fixed amounts may only require notice of the schedule
      at authorization.

      3. **Platform''s role in the ACH flow:** Whether the platform is the originator,
      a third-party sender, or a service provider determines who bears the NACHA authorization,
      notice, and recordkeeping obligations, and whether additional NACHA third-party-sender
      registration or money-transmission licensing applies.

      4. **Authorization record format:** An electronic authorization that lacks a
      reproducible audit trail (no timestamp, IP address, or user action) may not
      satisfy NACHA''s 2-year retention requirement.

      5. **Retry logic for returned debits:** Retrying R07/R10/R29 returns without
      new authorization violates NACHA rules; retries of R01/R09 returns are capped
      at two attempts.


      ## What would change this


      - **Working assumption:** This analysis assumes Mosaic Relay is not the originator
      and does not hold funds, but coordinates as a technology provider between the
      platform and the originating bank. If Mosaic Relay is the originator or holds
      funds, money-transmission licensing and additional NACHA obligations apply,
      materially changing the compliance burden.

      - **Open fork:** The consumer vs. business account mix is unresolved. Consumer
      accounts trigger the full Reg E/EFTA overlay; business-only accounts are governed
      by NACHA alone. This is the most material unresolved fact.

      - **Open fork:** The platform''s role (originator, third-party sender, or service
      provider) is unresolved and determines who owns the authorization, notice, and
      recordkeeping duties.

      - **Not examined:** The proposed authorization screen, debit schedule, return-handling
      procedures, and cancellation flow were referenced in the matter files but not
      provided for review. The ODFI agreement between Mosaic Relay (or the platform)
      and the originating bank was not reviewed; it governs authorization retention,
      return handling, and liability allocation.

      - **Not examined:** No external authority was retrieved for this packet (external
      research timed out). The NACHA and Reg E requirements above are stated from
      general knowledge of the ACH regulatory framework and should be verified against
      the current NACHA Operating Rules before final approval.

      '
    change_id: CHG-20260903-7460f7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:38:06+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T16:38:06+00:00'
last_source_action_key: chat:RUN-20260903-6f1916:tool:16f4c7852e3ded346352f065
---
# NACHA Operating Rules Requirements for Recurring ACH Debits

## Question

What are the current NACHA Operating Rules requirements for recurring ACH debit authorization, advance notice, and 2-year record retention?

## Answer in brief

For recurring ACH debits, the NACHA Operating Rules require (1) a valid authorization from the account holder, (2) advance notice of variable-amount debits (10 calendar days before the first debit and 7 calendar days before each subsequent debit), and (3) retention of the authorization (or a reproducible record of it) for 2 years from the date of the last debit. Where consumer accounts are involved, Regulation E/EFTA adds separate authorization, stop-payment, and error-resolution requirements on top of the NACHA rules. This answer states the NACHA baseline; the Reg E overlay applies only if consumer accounts are in scope, which remains unresolved for the pilot.

## 1. Authorization

- A recurring ACH debit must be supported by a valid authorization from the account holder. The authorization must clearly identify the account, the amount (or the method for determining the amount), the timing/frequency of the debits, and the account holder's agreement to recurring debits.
- For consumer accounts, the authorization must be in writing or "similarly authenticated" (an electronic signature compliant with E-SIGN). A copy of the authorization must be provided to the consumer.
- The authorization must be obtained before the first debit. Prechecked or implied consent does not satisfy the requirement; consent must be clear and affirmative.
- The account holder may revoke authorization at any time. Continued debits after revocation are unauthorized and expose the originator and ODFI to return liability and NACHA enforcement.

## 2. Advance notice

- **Variable amounts:** If the debit amount varies, NACHA requires notice of the amount and scheduled date at least 10 calendar days before the first debit and at least 7 calendar days before each subsequent debit.
- **Fixed amounts:** If the amount is fixed, notice of the schedule at the time of authorization may suffice; the recurring schedule should be documented in the authorization.
- The fixed-versus-variable distinction is a controlling fact for the pilot and remains unresolved. If amounts are variable, the 10-day/7-day advance-notice process must be implemented.

## 3. Record retention

- The ODFI (originating bank) must retain the original authorization, or a reproducible record of it, for 2 years from the date of the last debit.
- The record must be capable of being reproduced accurately and provided to the RDFI or the account holder upon request.
- For an electronic authorization to satisfy this requirement, the record should include a reproducible audit trail (e.g., versioned screen/text, timestamp, user identity, account token, and IP/device evidence where appropriate) and be retained for the full 2-year period.

## 4. Related return and retry rules (context for the authorization/notice framework)

- Returned debits may be reinitiated only under specific conditions. NACHA limits reinitiation to two attempts following the first return, and only where the return was for insufficient funds (R01) or uncollected funds (R09).
- Returns coded R07 (authorization revoked), R10 (customer advises not authorized), or R29 (corporate customer advises not authorized) must not be reinitiated without new authorization.
- Retries may constitute new debits requiring fresh authorization and notice; each retry should be analyzed for authorization and notice compliance.

## 5. Reg E/EFTA overlay (applies only if consumer accounts are in scope)

- Preauthorized ACH debits from consumer accounts are "preauthorized EFTs" under Reg E, requiring written or electronic authorization and delivery of a copy to the consumer.
- Consumers may stop payment of a preauthorized EFT by notifying their bank at least 3 business days before the scheduled debit.
- Consumers have 60 days from the periodic statement to report unauthorized or incorrect transfers; the bank must investigate and provisionally credit within 10 business days if it cannot resolve the error immediately.
- Consumer liability for unauthorized EFTs is capped at $50 if reported within 2 business days, $500 within 60 days, and unlimited thereafter. Continued debits after revocation are unauthorized.

## Facts that could change this answer

1. **Consumer vs. business account mix:** If any consumer accounts are in scope, Reg E/EFTA applies on top of NACHA, adding stop-payment, 60-day error resolution, and specific authorization-language requirements. If business-only, only NACHA rules apply. This is the single most material unresolved fact.
2. **Fixed vs. variable debit amount:** Variable amounts trigger the 10-day/7-day advance-notice requirement; fixed amounts may only require notice of the schedule at authorization.
3. **Platform's role in the ACH flow:** Whether the platform is the originator, a third-party sender, or a service provider determines who bears the NACHA authorization, notice, and recordkeeping obligations, and whether additional NACHA third-party-sender registration or money-transmission licensing applies.
4. **Authorization record format:** An electronic authorization that lacks a reproducible audit trail (no timestamp, IP address, or user action) may not satisfy NACHA's 2-year retention requirement.
5. **Retry logic for returned debits:** Retrying R07/R10/R29 returns without new authorization violates NACHA rules; retries of R01/R09 returns are capped at two attempts.

## What would change this

- **Working assumption:** This analysis assumes Mosaic Relay is not the originator and does not hold funds, but coordinates as a technology provider between the platform and the originating bank. If Mosaic Relay is the originator or holds funds, money-transmission licensing and additional NACHA obligations apply, materially changing the compliance burden.
- **Open fork:** The consumer vs. business account mix is unresolved. Consumer accounts trigger the full Reg E/EFTA overlay; business-only accounts are governed by NACHA alone. This is the most material unresolved fact.
- **Open fork:** The platform's role (originator, third-party sender, or service provider) is unresolved and determines who owns the authorization, notice, and recordkeeping duties.
- **Not examined:** The proposed authorization screen, debit schedule, return-handling procedures, and cancellation flow were referenced in the matter files but not provided for review. The ODFI agreement between Mosaic Relay (or the platform) and the originating bank was not reviewed; it governs authorization retention, return handling, and liability allocation.
- **Not examined:** No external authority was retrieved for this packet (external research timed out). The NACHA and Reg E requirements above are stated from general knowledge of the ACH regulatory framework and should be verified against the current NACHA Operating Rules before final approval.
