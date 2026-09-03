---
work_product_id: WP-c0f53a068e2d
matter_id: MAT-20260903-776ac1
title: NACHA Rules Requirements for Recurring (Standing Authorization) ACH Debits
  — Authorization Format, Evidence Retention, and Variable-Amount Notification
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T09:47:26+00:00'
updated_at: '2026-09-03T09:48:32+00:00'
immutable: false
source_action_key: chat:RUN-20260903-ecbcc1:tool:a764690f9e4ce994ba1d34b8
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
last_source_action_key: chat:RUN-20260903-6397d6:tool:f181e3990663ee6687448352
review:
  segments:
  - kind: delete
    text: '# NACHA Rules Requirements for Recurring (Standing Authorization) ACH Debits


      **Matter:** Mosaic Relay UX Test — 07 — ACH Authorization and Consumer Refunds

      **Prepared for:** Jordan Lee, Senior Product Counsel

      **Status:** Draft for review — model-generated analysis based on the saved research
      packet; no external authority retrieved. Verify against the current NACHA Operating
      Rules edition and Mosaic Relay''s ODFI/processor agreements before reliance.


      ---


      ## 1. Scope and framing


      A Mosaic Relay customer (the merchant) wants to launch a subscription checkout
      that debits consumers'' bank accounts via recurring ACH. Mosaic Relay would
      submit debits through its payment partners, show pending and returned status
      in its dashboard, and initiate refunds on cancellation. Target launch is **2026-11-05**
      (nine weeks from intake).


      Recurring consumer ACH debits are governed by the **NACHA Operating Rules**
      and, for consumer accounts, **Regulation E (EFTA, 12 C.F.R. Part 1005)**. These
      impose specific authorization, disclosure, evidence-retention, and error-resolution
      requirements. Key design elements — authorization language, variable vs. fixed
      amounts, prenotification, cancellation flow, and unauthorized-debit handling
      — are not yet finalized.


      **Important caveat:** This draft is model-generated from the NACHA framework
      and Reg E as commonly applied. No external authority was retrieved in the research
      pass. Every rule statement below must be confirmed against the current NACHA
      Rules edition and current Reg E text (including any 2025–2026 amendments) and
      against Mosaic Relay''s ODFI partner agreements before reliance.


      ---


      ## 2. Authorization format


      ### 2.1 SEC code selection — WEB debit

      A consumer entering bank credentials at an online checkout is a **WEB debit**
      (internet-initiated entry) under NACHA, even though it is also a recurring debit.
      WEB entries carry specific requirements:

      - **(a) Authorization** must be obtained via the internet or wireless network
      in a manner that can be **retained and reproduced**;

      - **(b) Commercially reasonable fraudulent-transaction detection systems** must
      be in place;

      - **(c) Account validation** must be performed before the first debit (NACHA''s
      WEB debit account-validation rule, effective 2021, treats validation as part
      of a commercially reasonable security procedure — prenotes, micro-deposits,
      or instant account verification (IAV) all qualify); and

      - **(d)** The website must have commercially reasonable security (e.g., TLS).


      ### 2.2 Recurring / standing authorization

      NACHA permits a **standing authorization** for recurring debits at regular intervals.
      The authorization must be **clear and readily understandable**, identify the
      recurring nature, the timing/frequency, and the amount or how the amount is
      determined. For consumer accounts, the authorization must be **in writing and
      signed or similarly authenticated** — an electronic clickwrap with an auditable
      record satisfies this if the authentication method is defensible.


      ### 2.3 Reg E overlay (12 C.F.R. § 1005.10(b))

      Preauthorized electronic fund transfers from a consumer''s account must be authorized
      **in writing**, and the consumer must receive a **copy** of the authorization.
      The email confirmation in the proposed flow can serve as the copy **if it contains
      the full authorization terms** — not just a receipt.


      ### 2.4 Revocation

      NACHA requires that the consumer be able to **revoke authorization by notifying
      the merchant (Originator)** in the manner specified in the authorization. Reg
      E separately gives the consumer **stop-payment** rights at their bank (§ 1005.10(c))
      — notice at least 3 business days before the scheduled debit. The checkout and
      email must disclose both paths.


      ---


      ## 3. Evidence retention and production


      - NACHA requires the Originator to **retain the authorization (or an accurate
      record of it) for two years after termination or revocation** of the authorization,
      and to **provide proof of authorization to the ODFI upon request** — typically
      within a short window (the Rules require furnishing it within the timeframe
      the ODFI sets; ODFIs commonly demand 5–10 business days because RDFIs can request
      proof).

      - The record must capture: the consumer''s identity/authentication, the exact
      authorization language presented, date/time, IP/device data for WEB entries,
      and the account details authorized. If the dashboard is the system of record,
      Mosaic Relay must guarantee immutability, exportability, and a production SLA
      — this is an architecture decision, not just a policy.

      - Reg E error-resolution (§ 1005.11) runs on the consumer''s bank''s timeline,
      but the practical burden lands on the Originator to produce authorization evidence
      to defeat an "unauthorized" return (R10/R07).


      ---


      ## 4. Variable amounts and per-debit notification


      - **NACHA standing authorization with variable amounts:** the authorization
      must state how amounts are determined, and NACHA requires the Originator to
      provide the consumer **notice of the amount and date of each debit at least
      10 calendar days before the debit** when the amount varies from the previous
      debit or falls outside a pre-authorized range — unless the consumer affirmatively
      elects to receive notice only when the amount exceeds a specified range or differs
      from the most recent debit. (This is the long-standing "10-day notice" construct
      for variable recurring debits; the 2021 standing-authorization modernization
      clarified that notice can be provided per-debit or via a disclosed range.)

      - **Reg E parallel rule (§ 1005.10(d)):** for preauthorized transfers that vary
      in amount, the payee must send **written notice of the amount and date at least
      10 days before the transfer**, or the consumer may elect notice only when the
      amount falls outside agreed limits.

      - **Practical consequence:** if the merchant will use variable amounts (intake
      answer: "both / not yet decided"), the product must either (a) send a pre-debit
      notice ≥10 days before each variable debit, or (b) capture the consumer''s range-based
      election in the authorization. Option (b) is the common UX-friendly path but
      must be drafted precisely.


      ---


      ## 5. Cancellation, stop-payment, and refunds


      - **Revocation of authorization:** the consumer must be able to revoke by notice
      to the merchant; the merchant (and Mosaic Relay operationally) must stop debits
      before the next scheduled entry. NACHA treats a debit after revocation as subject
      to return (R07 — authorization revoked).

      - **Reg E stop payment:** the consumer can stop payment through their bank on
      3 business days'' notice; the system should expect R08 (payment stopped) returns
      and not re-present them.

      - **Refunds:** NACHA does not mandate refund timing for cancellations — that
      is contract/consumer-protection law (state auto-renewal statutes, FTC Negative
      Option Rule, ROSCA for online subscriptions). Because subscriptions renew monthly
      and involve digital goods, **ROSCA and the FTC''s negative-option requirements**
      (clear disclosure, express informed consent, simple cancellation — "click to
      cancel") apply to the merchant''s checkout independent of ACH mechanics. Mosaic
      Relay should require the merchant''s cancellation path to be as easy as signup.

      - **Reinitiation limits:** NACHA caps reinitiation of returned debits (generally
      no more than two reinitiations following a return, and none after R07/R08/R10-type
      returns). The dashboard''s "returned" status must drive re-presentment logic,
      not just display.


      ---


      ## 6. Return and dispute handling


      - Consumer "unauthorized" claims arrive as **R10 (customer advises not authorized)**
      or R07 returns via the RDFI, backed by a **Written Statement of Unauthorized
      Debit (WSOD)**. R10 returns can occur up to 60 days from settlement (the consumer''s
      Reg E window), and NACHA imposes **return-rate monitoring** — unauthorized return
      rates above 0.5% trigger scrutiny; ODFIs enforce thresholds contractually.

      - **Allocation:** the **Originator (merchant) warrants authorization validity**
      to the ODFI under NACHA; Mosaic Relay, as a **Third-Party Service Provider /
      Third-Party Sender** (depending on structure), has its own NACHA obligations
      — Third-Party Senders must register with NACHA, conduct risk assessments, and
      may need to warrant merchant conduct. Which role Mosaic Relay occupies under
      its ODFI agreement is a threshold legal question the vault does not yet answer.


      ---


      ## 7. Limits on the proposed checkout UX


      - The authorization checkbox must be **separate and un-bundled** (not pre-checked,
      not buried in general terms) — NACHA''s "readily identifiable as an authorization"
      standard plus ROSCA express-consent practice.

      - The email confirmation must contain the **full authorization terms** (amount/range,
      frequency, revocation method, stop-payment rights) to satisfy Reg E''s copy
      requirement.

      - Account validation (prenote, micro-deposit, or IAV) must complete **before
      the first debit** — this affects the "instant access to digital goods" UX; a
      prenote adds ~3 banking days, so instant-access design likely requires IAV or
      micro-deposits instead.

      - The dashboard must not allow re-presentment of R07/R08/R10 returns and must
      surface revocation status to prevent post-cancellation debits.


      ---


      ## 8. Viable paths


      1. **Fixed-amount only at launch (fastest, lowest risk).** Restrict v1 to fixed
      monthly amounts; defer variable amounts. Eliminates the 10-day variable-notice
      build. Checkout: unbundled authorization checkbox + full-terms email + IAV for
      instant validation. Feasible within nine weeks if the ODFI confirms WEB-debit
      onboarding and evidence requirements promptly.

      2. **Fixed + variable with range election.** Launch both, with the authorization
      stating a disclosed range and the consumer electing notice only outside the
      range. Requires careful drafting and a notice engine; still feasible in nine
      weeks but adds compliance surface.

      3. **Prenote-first launch.** Use prenotes for account validation. Cheapest technically
      but delays first debit ~3 days — likely unacceptable for digital-goods instant
      access; viable only if the merchant accepts delayed activation.


      ---


      ## 9. Facts that could change the answer


      - **Mosaic Relay''s NACHA role** (TPSP vs. Third-Party Sender vs. ODFI agent)
      — changes registration, warranty, and risk-assessment obligations materially.

      - **ODFI partner terms** — evidence-production SLAs, return-rate thresholds,
      and prohibited practices are often stricter than NACHA baseline and control
      the real launch checklist.

      - **Variable vs. fixed amounts** — determines whether the 10-day notice engine
      is a launch blocker.

      - **System-of-record decision** — if the merchant''s own system holds authorization
      evidence, Mosaic Relay''s retention build shrinks but its production SLA to
      the ODFI must be contractually backstopped by the merchant.

      - **State auto-renewal laws** (e.g., California SB-313-style ARLs) — monthly
      consumer subscriptions for digital goods sit squarely in ARL territory; merchant-side
      compliance is a gating item even though it is the merchant''s obligation.


      ---


      ## 10. Recommended last-mile verification


      - Pull the **current NACHA Operating Rules** edition (2025/2026) and confirm:
      WEB debit account-validation standard, standing-authorization notice mechanics
      for variable amounts, two-year post-termination retention, reinitiation limits,
      and current return-rate thresholds. (No external authority retrieved in this
      pass — these citations are from model knowledge and must be confirmed.)

      - Obtain and read the **ODFI/processor agreement and ACH addendum** for Mosaic
      Relay''s role classification, evidence SLAs, and return thresholds.

      - Confirm **Reg E §§ 1005.10(b), (c), (d) and 1005.11** text against the current
      eCFR for the written-authorization, stop-payment, variable-amount notice, and
      error-resolution mechanics.

      - Check the **FTC Negative Option Rule** status (the 2024 "click-to-cancel"
      rule was vacated by the Eighth Circuit in 2025; ROSCA and state ARLs remain
      the operative framework — verify current posture before advising the merchant).

      - Decide and document: system of record, prenote vs. IAV, unauthorized-claim
      routing, and cancellation cutoffs — these are business decisions counsel should
      frame, not make.


      ---


      ## What would change this


      - **Working assumption — Mosaic Relay''s NACHA role.** This analysis assumes
      Mosaic Relay acts as a Third-Party Service Provider/Third-Party Sender submitting
      through partner ODFIs (per the internal record). If Mosaic Relay is actually
      the Originator of record or a Third-Party Sender with direct NACHA registration
      duties, the warranty, registration, and risk-assessment sections expand substantially
      and the launch checklist grows.

      - **Open fork — variable amounts.** If the merchant ships variable amounts at
      launch, a 10-day pre-debit notice engine (or a precisely drafted range election)
      becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d); if fixed-only,
      the nine-week timeline is comfortable. The intake answer ("both / not yet decided")
      leaves the single biggest scope question open.

      - **Open fork — system of record.** If the dashboard is not the system of record
      for authorization evidence, Mosaic Relay must contractually secure production
      of evidence from the merchant within the ODFI''s SLA; if it is, Mosaic Relay
      owns a two-year-post-termination retention and production build. The compliance
      architecture differs materially.

      - **Not examined — the ODFI/processor agreements.** The vault contains no partner
      agreements; ODFI terms on evidence turnaround, return thresholds, and WEB-debit
      onboarding could be stricter than NACHA baseline and could independently gate
      the 2026-11-05 date. This is the highest-value unread source.

      - **Not examined — current NACHA Rules text and eCFR.** No external authority
      was retrieved; every rule statement above is model-generated and unverified
      against the current NACHA edition and current Reg E text, including any 2025–2026
      amendments to standing authorizations or return thresholds.

      - **Working assumption — consumer accounts only.** This analysis assumes all
      debits hit consumer accounts (Reg E applies). If any subscribers are small businesses
      using business accounts, Reg E drops out for those debits and NACHA-only rules
      (and different return codes/timelines) apply — a mixed portfolio would need
      bifurcated flows.

      '
    change_id: CHG-20260903-2df896
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T09:48:33+00:00'
  - kind: insert
    text: '# First-Pass Legal Response — Recurring Consumer ACH Debits


      **Matter:** Mosaic Relay UX Test — 07 — ACH Authorization and Consumer Refunds

      **Target launch:** 2026-11-05 (nine weeks from intake)

      **Status:** First-pass draft. No external authority has been retrieved; every
      rule statement below is model-generated from the NACHA Operating Rules framework
      and Regulation E as commonly applied and must be verified against the current
      NACHA Rules edition, current Reg E text, and Mosaic Relay''s ODFI/processor
      agreements before reliance.


      ---


      ## 1. Facts


      The merchant wants to accept recurring ACH payments from consumers for a subscription
      service. The proposed checkout asks the consumer to enter bank details, agree
      to recurring debit terms, and receive an email confirmation. Mosaic Relay would
      submit debits through its payment partners, show pending and returned status
      in its dashboard, and initiate refunds when the customer cancels.


      Established facts:

      - Subscriptions can renew monthly.

      - Some consumers may use the service for digital goods.

      - Target release is 2026-11-05 (nine weeks from intake).

      - Mosaic Relay submits debits through payment partners (not as the originating
      bank).


      Undecided / not yet finalized:

      - Authorization language and evidence format.

      - Cancellation process and refund mechanics.

      - Prenotification (prenote) practice before the first debit.

      - Return handling and debit timing.

      - Consumer support responsibilities.

      - Variable vs. fixed recurring amounts (intake: "both / not yet decided").

      - Whether Mosaic Relay''s dashboard is the system of record for authorization
      evidence (intake: "not yet decided").

      - How unauthorized-debit claims are handled and who responds to the consumer''s
      financial institution (intake: "not yet decided").


      ---


      ## 2. Issues


      1. ACH authorization and recordkeeping requirements (NACHA Rules, Reg E).

      2. Recurring-debit disclosures to consumers.

      3. Cancellation and refund obligations.

      4. Return and dispute handling (unauthorized-debit claims, return codes).

      5. Allocation of responsibilities between Mosaic Relay and the merchant.

      6. Limits on the proposed checkout user experience.


      ---


      ## 3. Assumptions


      - **Mosaic Relay''s NACHA role.** Mosaic Relay acts as a third-party service
      provider / ODFI agent submitting debits through payment partners, not as the
      originating bank. If it is instead the Originator of record or a Third-Party
      Sender with direct NACHA registration duties, the warranty, registration, and
      risk-assessment obligations expand materially.

      - **Governing law.** Consumer-facing recurring-debit authorization is governed
      by the NACHA Operating Rules and, for consumer accounts, Regulation E (EFTA).

      - **U.S. scope only**, consistent with the company profile.

      - **Consumer accounts only.** Reg E applies to all debits. If any subscribers
      use business accounts, Reg E drops out for those debits and NACHA-only rules
      (and different return codes/timelines) apply.


      ---


      ## 4. Missing facts (material, not yet established)


      - Variable vs. fixed recurring amounts.

      - System of record for authorization evidence and who produces it to the RDFI.

      - Prenote vs. instant account validation before the first debit.

      - Unauthorized-debit claim routing and who responds to the consumer''s financial
      institution.

      - Mosaic Relay''s exact NACHA role under its ODFI agreement (TPSP vs. Third-Party
      Sender vs. ODFI agent).

      - ODFI/processor agreement terms (evidence SLAs, return-rate thresholds, prohibited
      practices).

      - Finalized authorization language and evidence format.


      ---


      ## 5. Unverified leads (must be confirmed before reliance)


      - Current NACHA Operating Rules edition (2025/2026): WEB debit account-validation
      standard, standing-authorization notice mechanics for variable amounts, two-year
      post-termination retention, reinitiation limits, current return-rate thresholds.

      - Reg E §§ 1005.10(b), (c), (d) and 1005.11 text against the current eCFR.

      - FTC Negative Option Rule status (the 2024 "click-to-cancel" rule was vacated
      by the Eighth Circuit in 2025; ROSCA and state auto-renewal laws remain the
      operative framework — verify current posture).

      - State auto-renewal laws (e.g., California-style ARLs) for monthly consumer
      subscriptions.


      ---


      ## 6. Analysis


      ### 6.1 Authorization format (NACHA + Reg E)


      A consumer entering bank credentials at an online checkout is a **WEB debit**
      (internet-initiated entry) under NACHA, even where it is also recurring. WEB
      entries require: (a) authorization obtained via the internet in a manner that
      can be retained and reproduced; (b) commercially reasonable fraudulent-transaction
      detection systems; (c) account validation before the first debit (prenote, micro-deposit,
      or instant account verification); and (d) commercially reasonable website security
      (e.g., TLS).


      NACHA permits a **standing authorization** for recurring debits at regular intervals.
      The authorization must be clear and readily understandable, identify the recurring
      nature, the timing/frequency, and the amount or how the amount is determined.
      For consumer accounts, the authorization must be in writing and signed or similarly
      authenticated — an electronic clickwrap with an auditable record satisfies this
      if the authentication method is defensible.


      Reg E § 1005.10(b) requires preauthorized EFTs from a consumer''s account to
      be authorized in writing, with the consumer receiving a copy. The email confirmation
      can serve as the copy if it contains the full authorization terms — not just
      a receipt.


      ### 6.2 Evidence retention and production


      NACHA requires the Originator to retain the authorization (or an accurate record)
      for **two years after termination or revocation**, and to provide proof of authorization
      to the ODFI on request (ODFIs commonly demand production within 5–10 business
      days because RDFIs can request proof). The record must capture the consumer''s
      identity/authentication, the exact authorization language presented, date/time,
      IP/device data for WEB entries, and the account details authorized. If the dashboard
      is the system of record, Mosaic Relay must guarantee immutability, exportability,
      and a production SLA.


      ### 6.3 Variable amounts and per-debit notification


      For variable recurring debits, NACHA requires the Originator to provide notice
      of the amount and date of each debit **at least 10 calendar days before the
      debit** when the amount varies from the previous debit or falls outside a pre-authorized
      range — unless the consumer affirmatively elects to receive notice only when
      the amount exceeds a specified range or differs from the most recent debit.
      Reg E § 1005.10(d) parallels this: written notice of amount and date at least
      10 days before the transfer, or a consumer election for notice only outside
      agreed limits.


      If the merchant ships variable amounts, the product must either send a pre-debit
      notice ≥10 days before each variable debit, or capture a range-based election
      in the authorization. The range-election path is the common UX-friendly route
      but must be drafted precisely.


      ### 6.4 Cancellation, stop-payment, and refunds


      The consumer must be able to revoke authorization by notifying the merchant
      in the manner specified in the authorization; the merchant (and Mosaic Relay
      operationally) must stop debits before the next scheduled entry. A debit after
      revocation is subject to return (R07 — authorization revoked). Reg E § 1005.10(c)
      gives the consumer stop-payment rights at their bank on 3 business days'' notice;
      the system should expect R08 (payment stopped) returns and not re-present them.


      NACHA does not mandate refund timing for cancellations — that is contract and
      consumer-protection law. Because subscriptions renew monthly and involve digital
      goods, **ROSCA and the FTC negative-option requirements** (clear disclosure,
      express informed consent, simple cancellation) apply to the merchant''s checkout
      independent of ACH mechanics. State auto-renewal laws also apply. NACHA caps
      reinitiation of returned debits (generally no more than two reinitiations following
      a return, and none after R07/R08/R10-type returns).


      ### 6.5 Return and dispute handling


      Consumer "unauthorized" claims arrive as **R10 (customer advises not authorized)**
      or R07 returns via the RDFI, backed by a **Written Statement of Unauthorized
      Debit (WSOD)**. R10 returns can occur up to 60 days from settlement (the consumer''s
      Reg E window). NACHA imposes return-rate monitoring — unauthorized return rates
      above 0.5% trigger scrutiny; ODFIs enforce thresholds contractually.


      Allocation: the **Originator (merchant) warrants authorization validity** to
      the ODFI under NACHA. Mosaic Relay, as a Third-Party Service Provider / Third-Party
      Sender (depending on structure), has its own NACHA obligations — Third-Party
      Senders must register with NACHA, conduct risk assessments, and may need to
      warrant merchant conduct. Which role Mosaic Relay occupies under its ODFI agreement
      is a threshold legal question not yet answered.


      ### 6.6 UX limits on the proposed checkout


      - The authorization checkbox must be **separate and un-bundled** (not pre-checked,
      not buried in general terms) — NACHA "readily identifiable as an authorization"
      standard plus ROSCA express-consent practice.

      - The email confirmation must contain the **full authorization terms** (amount/range,
      frequency, revocation method, stop-payment rights) to satisfy Reg E''s copy
      requirement.

      - Account validation must complete **before the first debit** — this affects
      "instant access to digital goods" UX; a prenote adds ~3 banking days, so instant-access
      design likely requires IAV or micro-deposits.

      - The dashboard must not allow re-presentment of R07/R08/R10 returns and must
      surface revocation status to prevent post-cancellation debits.


      ---


      ## 7. UX limits (summary)


      The proposed checkout is workable but must be adjusted: unbundled authorization
      consent, full-terms email confirmation, account validation before the first
      debit, a clear in-product cancellation/stop-payment path, and dashboard logic
      that prevents re-presentment of certain returns and surfaces revocation status.
      Instant-access digital goods likely require instant account verification rather
      than prenotes.


      ---


      ## 8. Allocation of responsibilities (recommended baseline)


      - **Merchant (Originator):** warrants authorization validity; honors cancellations;
      provides refunds to the original payment method; complies with ROSCA/negative-option
      and state auto-renewal laws; produces authorization evidence when required.

      - **Mosaic Relay:** submits debits through partners; enforces stop before the
      next debit when technically possible; retains/produces authorization evidence
      if the dashboard is the system of record; enforces reinitiation limits; surfaces
      return and revocation status; provides consumer support escalation.

      - **Consumer''s financial institution (RDFI):** processes returns, stop payments,
      and Reg E error resolution on its own timeline.

      - **ODFI/processor:** sets evidence SLAs, return-rate thresholds, and WEB-debit
      onboarding requirements (terms not yet in the vault).


      ---


      ## 9. Recommendation (separate from any recorded decision)


      **Recommended path: fixed-amount-only at launch, with instant account verification,
      an unbundled authorization checkbox, a full-terms email confirmation, and a
      clear in-product cancellation/stop-payment path.** This is the fastest, lowest-risk
      path within the nine-week window: it eliminates the 10-day variable-notice build
      and the range-election drafting, and it keeps the compliance surface smallest.
      Defer variable amounts to a later release.


      If variable amounts are required at launch, the merchant must either build a
      10-day pre-debit notice engine or capture a precisely drafted range election
      in the authorization — this becomes a hard launch blocker under both NACHA and
      Reg E § 1005.10(d).


      Before launch, confirm: Mosaic Relay''s NACHA role under the ODFI agreement;
      ODFI evidence SLAs and return thresholds; system of record for authorization
      evidence; prenote vs. IAV; unauthorized-claim routing; and finalized authorization
      language. These are business decisions counsel should frame, not make.


      ---


      ## 10. Next steps


      1. Verify the current NACHA Rules edition and Reg E text (no external authority
      retrieved in this pass).

      2. Obtain and read the ODFI/processor agreement and ACH addendum for role classification,
      evidence SLAs, and return thresholds.

      3. Confirm FTC Negative Option Rule / ROSCA and state auto-renewal posture.

      4. Decide and document: system of record, prenote vs. IAV, unauthorized-claim
      routing, cancellation cutoffs, and variable vs. fixed amounts.

      5. Draft the authorization language and email confirmation template.

      6. Confirm the merchant''s cancellation and refund process meets ROSCA/negative-option
      and state ARL requirements.


      ---


      ## What would change this


      - **Working assumption — Mosaic Relay''s NACHA role.** I assumed Mosaic Relay
      acts as a Third-Party Service Provider/Third-Party Sender submitting through
      partner ODFIs. If it is actually the Originator of record or a Third-Party Sender
      with direct NACHA registration duties, the warranty, registration, and risk-assessment
      sections expand substantially and the launch checklist grows.

      - **Open fork — variable amounts.** If the merchant ships variable amounts at
      launch, a 10-day pre-debit notice engine (or a precisely drafted range election)
      becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d); if fixed-only,
      the nine-week timeline is comfortable. The intake answer ("both / not yet decided")
      leaves the single biggest scope question open.

      - **Open fork — system of record.** If the dashboard is not the system of record
      for authorization evidence, Mosaic Relay must contractually secure production
      of evidence from the merchant within the ODFI''s SLA; if it is, Mosaic Relay
      owns a two-year-post-termination retention and production build. The compliance
      architecture differs materially.

      - **Not examined — the ODFI/processor agreements.** The vault contains no partner
      agreements; ODFI terms on evidence turnaround, return thresholds, and WEB-debit
      onboarding could be stricter than NACHA baseline and could independently gate
      the 2026-11-05 date. This is the highest-value unread source.

      - **Not examined — current NACHA Rules text and eCFR.** No external authority
      was retrieved; every rule statement above is model-generated and unverified
      against the current NACHA edition and current Reg E text, including any 2025–2026
      amendments to standing authorizations or return thresholds.

      - **Working assumption — consumer accounts only.** I assumed all debits hit
      consumer accounts (Reg E applies). If any subscribers are small businesses using
      business accounts, Reg E drops out for those debits and NACHA-only rules (and
      different return codes/timelines) apply — a mixed portfolio would need bifurcated
      flows.

      '
    change_id: CHG-20260903-2df896
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T09:48:33+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T09:48:33+00:00'
---
# First-Pass Legal Response — Recurring Consumer ACH Debits

**Matter:** Mosaic Relay UX Test — 07 — ACH Authorization and Consumer Refunds
**Target launch:** 2026-11-05 (nine weeks from intake)
**Status:** First-pass draft. No external authority has been retrieved; every rule statement below is model-generated from the NACHA Operating Rules framework and Regulation E as commonly applied and must be verified against the current NACHA Rules edition, current Reg E text, and Mosaic Relay's ODFI/processor agreements before reliance.

---

## 1. Facts

The merchant wants to accept recurring ACH payments from consumers for a subscription service. The proposed checkout asks the consumer to enter bank details, agree to recurring debit terms, and receive an email confirmation. Mosaic Relay would submit debits through its payment partners, show pending and returned status in its dashboard, and initiate refunds when the customer cancels.

Established facts:
- Subscriptions can renew monthly.
- Some consumers may use the service for digital goods.
- Target release is 2026-11-05 (nine weeks from intake).
- Mosaic Relay submits debits through payment partners (not as the originating bank).

Undecided / not yet finalized:
- Authorization language and evidence format.
- Cancellation process and refund mechanics.
- Prenotification (prenote) practice before the first debit.
- Return handling and debit timing.
- Consumer support responsibilities.
- Variable vs. fixed recurring amounts (intake: "both / not yet decided").
- Whether Mosaic Relay's dashboard is the system of record for authorization evidence (intake: "not yet decided").
- How unauthorized-debit claims are handled and who responds to the consumer's financial institution (intake: "not yet decided").

---

## 2. Issues

1. ACH authorization and recordkeeping requirements (NACHA Rules, Reg E).
2. Recurring-debit disclosures to consumers.
3. Cancellation and refund obligations.
4. Return and dispute handling (unauthorized-debit claims, return codes).
5. Allocation of responsibilities between Mosaic Relay and the merchant.
6. Limits on the proposed checkout user experience.

---

## 3. Assumptions

- **Mosaic Relay's NACHA role.** Mosaic Relay acts as a third-party service provider / ODFI agent submitting debits through payment partners, not as the originating bank. If it is instead the Originator of record or a Third-Party Sender with direct NACHA registration duties, the warranty, registration, and risk-assessment obligations expand materially.
- **Governing law.** Consumer-facing recurring-debit authorization is governed by the NACHA Operating Rules and, for consumer accounts, Regulation E (EFTA).
- **U.S. scope only**, consistent with the company profile.
- **Consumer accounts only.** Reg E applies to all debits. If any subscribers use business accounts, Reg E drops out for those debits and NACHA-only rules (and different return codes/timelines) apply.

---

## 4. Missing facts (material, not yet established)

- Variable vs. fixed recurring amounts.
- System of record for authorization evidence and who produces it to the RDFI.
- Prenote vs. instant account validation before the first debit.
- Unauthorized-debit claim routing and who responds to the consumer's financial institution.
- Mosaic Relay's exact NACHA role under its ODFI agreement (TPSP vs. Third-Party Sender vs. ODFI agent).
- ODFI/processor agreement terms (evidence SLAs, return-rate thresholds, prohibited practices).
- Finalized authorization language and evidence format.

---

## 5. Unverified leads (must be confirmed before reliance)

- Current NACHA Operating Rules edition (2025/2026): WEB debit account-validation standard, standing-authorization notice mechanics for variable amounts, two-year post-termination retention, reinitiation limits, current return-rate thresholds.
- Reg E §§ 1005.10(b), (c), (d) and 1005.11 text against the current eCFR.
- FTC Negative Option Rule status (the 2024 "click-to-cancel" rule was vacated by the Eighth Circuit in 2025; ROSCA and state auto-renewal laws remain the operative framework — verify current posture).
- State auto-renewal laws (e.g., California-style ARLs) for monthly consumer subscriptions.

---

## 6. Analysis

### 6.1 Authorization format (NACHA + Reg E)

A consumer entering bank credentials at an online checkout is a **WEB debit** (internet-initiated entry) under NACHA, even where it is also recurring. WEB entries require: (a) authorization obtained via the internet in a manner that can be retained and reproduced; (b) commercially reasonable fraudulent-transaction detection systems; (c) account validation before the first debit (prenote, micro-deposit, or instant account verification); and (d) commercially reasonable website security (e.g., TLS).

NACHA permits a **standing authorization** for recurring debits at regular intervals. The authorization must be clear and readily understandable, identify the recurring nature, the timing/frequency, and the amount or how the amount is determined. For consumer accounts, the authorization must be in writing and signed or similarly authenticated — an electronic clickwrap with an auditable record satisfies this if the authentication method is defensible.

Reg E § 1005.10(b) requires preauthorized EFTs from a consumer's account to be authorized in writing, with the consumer receiving a copy. The email confirmation can serve as the copy if it contains the full authorization terms — not just a receipt.

### 6.2 Evidence retention and production

NACHA requires the Originator to retain the authorization (or an accurate record) for **two years after termination or revocation**, and to provide proof of authorization to the ODFI on request (ODFIs commonly demand production within 5–10 business days because RDFIs can request proof). The record must capture the consumer's identity/authentication, the exact authorization language presented, date/time, IP/device data for WEB entries, and the account details authorized. If the dashboard is the system of record, Mosaic Relay must guarantee immutability, exportability, and a production SLA.

### 6.3 Variable amounts and per-debit notification

For variable recurring debits, NACHA requires the Originator to provide notice of the amount and date of each debit **at least 10 calendar days before the debit** when the amount varies from the previous debit or falls outside a pre-authorized range — unless the consumer affirmatively elects to receive notice only when the amount exceeds a specified range or differs from the most recent debit. Reg E § 1005.10(d) parallels this: written notice of amount and date at least 10 days before the transfer, or a consumer election for notice only outside agreed limits.

If the merchant ships variable amounts, the product must either send a pre-debit notice ≥10 days before each variable debit, or capture a range-based election in the authorization. The range-election path is the common UX-friendly route but must be drafted precisely.

### 6.4 Cancellation, stop-payment, and refunds

The consumer must be able to revoke authorization by notifying the merchant in the manner specified in the authorization; the merchant (and Mosaic Relay operationally) must stop debits before the next scheduled entry. A debit after revocation is subject to return (R07 — authorization revoked). Reg E § 1005.10(c) gives the consumer stop-payment rights at their bank on 3 business days' notice; the system should expect R08 (payment stopped) returns and not re-present them.

NACHA does not mandate refund timing for cancellations — that is contract and consumer-protection law. Because subscriptions renew monthly and involve digital goods, **ROSCA and the FTC negative-option requirements** (clear disclosure, express informed consent, simple cancellation) apply to the merchant's checkout independent of ACH mechanics. State auto-renewal laws also apply. NACHA caps reinitiation of returned debits (generally no more than two reinitiations following a return, and none after R07/R08/R10-type returns).

### 6.5 Return and dispute handling

Consumer "unauthorized" claims arrive as **R10 (customer advises not authorized)** or R07 returns via the RDFI, backed by a **Written Statement of Unauthorized Debit (WSOD)**. R10 returns can occur up to 60 days from settlement (the consumer's Reg E window). NACHA imposes return-rate monitoring — unauthorized return rates above 0.5% trigger scrutiny; ODFIs enforce thresholds contractually.

Allocation: the **Originator (merchant) warrants authorization validity** to the ODFI under NACHA. Mosaic Relay, as a Third-Party Service Provider / Third-Party Sender (depending on structure), has its own NACHA obligations — Third-Party Senders must register with NACHA, conduct risk assessments, and may need to warrant merchant conduct. Which role Mosaic Relay occupies under its ODFI agreement is a threshold legal question not yet answered.

### 6.6 UX limits on the proposed checkout

- The authorization checkbox must be **separate and un-bundled** (not pre-checked, not buried in general terms) — NACHA "readily identifiable as an authorization" standard plus ROSCA express-consent practice.
- The email confirmation must contain the **full authorization terms** (amount/range, frequency, revocation method, stop-payment rights) to satisfy Reg E's copy requirement.
- Account validation must complete **before the first debit** — this affects "instant access to digital goods" UX; a prenote adds ~3 banking days, so instant-access design likely requires IAV or micro-deposits.
- The dashboard must not allow re-presentment of R07/R08/R10 returns and must surface revocation status to prevent post-cancellation debits.

---

## 7. UX limits (summary)

The proposed checkout is workable but must be adjusted: unbundled authorization consent, full-terms email confirmation, account validation before the first debit, a clear in-product cancellation/stop-payment path, and dashboard logic that prevents re-presentment of certain returns and surfaces revocation status. Instant-access digital goods likely require instant account verification rather than prenotes.

---

## 8. Allocation of responsibilities (recommended baseline)

- **Merchant (Originator):** warrants authorization validity; honors cancellations; provides refunds to the original payment method; complies with ROSCA/negative-option and state auto-renewal laws; produces authorization evidence when required.
- **Mosaic Relay:** submits debits through partners; enforces stop before the next debit when technically possible; retains/produces authorization evidence if the dashboard is the system of record; enforces reinitiation limits; surfaces return and revocation status; provides consumer support escalation.
- **Consumer's financial institution (RDFI):** processes returns, stop payments, and Reg E error resolution on its own timeline.
- **ODFI/processor:** sets evidence SLAs, return-rate thresholds, and WEB-debit onboarding requirements (terms not yet in the vault).

---

## 9. Recommendation (separate from any recorded decision)

**Recommended path: fixed-amount-only at launch, with instant account verification, an unbundled authorization checkbox, a full-terms email confirmation, and a clear in-product cancellation/stop-payment path.** This is the fastest, lowest-risk path within the nine-week window: it eliminates the 10-day variable-notice build and the range-election drafting, and it keeps the compliance surface smallest. Defer variable amounts to a later release.

If variable amounts are required at launch, the merchant must either build a 10-day pre-debit notice engine or capture a precisely drafted range election in the authorization — this becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d).

Before launch, confirm: Mosaic Relay's NACHA role under the ODFI agreement; ODFI evidence SLAs and return thresholds; system of record for authorization evidence; prenote vs. IAV; unauthorized-claim routing; and finalized authorization language. These are business decisions counsel should frame, not make.

---

## 10. Next steps

1. Verify the current NACHA Rules edition and Reg E text (no external authority retrieved in this pass).
2. Obtain and read the ODFI/processor agreement and ACH addendum for role classification, evidence SLAs, and return thresholds.
3. Confirm FTC Negative Option Rule / ROSCA and state auto-renewal posture.
4. Decide and document: system of record, prenote vs. IAV, unauthorized-claim routing, cancellation cutoffs, and variable vs. fixed amounts.
5. Draft the authorization language and email confirmation template.
6. Confirm the merchant's cancellation and refund process meets ROSCA/negative-option and state ARL requirements.

---

## What would change this

- **Working assumption — Mosaic Relay's NACHA role.** I assumed Mosaic Relay acts as a Third-Party Service Provider/Third-Party Sender submitting through partner ODFIs. If it is actually the Originator of record or a Third-Party Sender with direct NACHA registration duties, the warranty, registration, and risk-assessment sections expand substantially and the launch checklist grows.
- **Open fork — variable amounts.** If the merchant ships variable amounts at launch, a 10-day pre-debit notice engine (or a precisely drafted range election) becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d); if fixed-only, the nine-week timeline is comfortable. The intake answer ("both / not yet decided") leaves the single biggest scope question open.
- **Open fork — system of record.** If the dashboard is not the system of record for authorization evidence, Mosaic Relay must contractually secure production of evidence from the merchant within the ODFI's SLA; if it is, Mosaic Relay owns a two-year-post-termination retention and production build. The compliance architecture differs materially.
- **Not examined — the ODFI/processor agreements.** The vault contains no partner agreements; ODFI terms on evidence turnaround, return thresholds, and WEB-debit onboarding could be stricter than NACHA baseline and could independently gate the 2026-11-05 date. This is the highest-value unread source.
- **Not examined — current NACHA Rules text and eCFR.** No external authority was retrieved; every rule statement above is model-generated and unverified against the current NACHA edition and current Reg E text, including any 2025–2026 amendments to standing authorizations or return thresholds.
- **Working assumption — consumer accounts only.** I assumed all debits hit consumer accounts (Reg E applies). If any subscribers are small businesses using business accounts, Reg E drops out for those debits and NACHA-only rules (and different return codes/timelines) apply — a mixed portfolio would need bifurcated flows.
