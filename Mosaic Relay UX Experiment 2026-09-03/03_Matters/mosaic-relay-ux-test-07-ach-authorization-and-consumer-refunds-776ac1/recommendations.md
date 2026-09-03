---
matter_id: MAT-20260903-776ac1
record_type: recommendations
current_recommendation_version_id: REC-20260903-197d89
recommendation_versions:
- version_id: REC-20260903-197d89
  number: 1
  content: '# First-Pass Legal Response — Recurring Consumer ACH Debits


    **Matter:** Mosaic Relay UX Test — 07 — ACH Authorization and Consumer Refunds

    **Target launch:** 2026-11-05 (nine weeks from intake)

    **Status:** First-pass draft. No external authority retrieved; verify before reliance.


    ---


    ## 1. Facts


    ### Established facts

    - The merchant wants to accept recurring ACH payments from consumers for a subscription
    service.

    - The proposed checkout asks the consumer to enter bank details, agree to recurring
    debit terms, and receive an email confirmation.

    - Mosaic Relay would submit debits through its payment partners, show pending
    and returned status in the dashboard, and initiate refunds when the customer cancels.

    - The merchant''s subscriptions can renew monthly.

    - Some consumers may use the service for digital goods.

    - The customer wants to release the feature in nine weeks (target 2026-11-05).


    ### Undecided items (recorded, not yet resolved)

    - Whether the merchant will use fixed amounts, variable amounts, or both.

    - Whether Mosaic Relay''s dashboard will be the system of record for authorization
    evidence, and who retains and produces it when a consumer''s financial institution
    requests proof of authorization.

    - The cancellation and refund process (recommendation captured: clear in-product
    cancellation and stop-payment path plus support escalation, merchant responsible
    for honoring cancellations, Mosaic Relay enforcing the stop before the next debit
    when technically possible, with cutoffs, confirmation, audit trail, and refund
    to the original payment method disclosed).

    - Whether the merchant will use prenotification (prenotes) before the first debit.

    - How unauthorized-debit claims will be handled and who responds to the consumer''s
    financial institution.

    - Finalized authorization language and evidence format.


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


    - **Mosaic Relay''s NACHA role.** Mosaic Relay acts as a third-party service provider
    / ODFI agent submitting debits through payment partners, not as the originating
    bank. If Mosaic Relay is instead the Originator of record or a Third-Party Sender
    with direct NACHA registration duties, the warranty, registration, and risk-assessment
    sections expand materially.

    - **Governing framework.** The consumer-facing recurring-debit authorization is
    governed by the NACHA Operating Rules and, for consumer accounts, Regulation E
    (EFTA).

    - **U.S. scope only**, consistent with the company profile.

    - **Consumer accounts only.** All debits hit consumer accounts (Reg E applies).
    If any subscribers are small businesses using business accounts, Reg E drops out
    for those debits and NACHA-only rules (and different return codes/timelines) apply.


    ---


    ## 4. Missing facts


    - **Variable vs. fixed amounts** — determines whether a 10-day pre-debit notice
    engine (or a range election) is a launch blocker.

    - **System of record** — whether the dashboard holds authorization evidence and
    who produces it to the RDFI within NACHA timeframes.

    - **Prenotes vs. account validation method** — affects first-debit timing and
    the instant-access UX for digital goods.

    - **Unauthorized-debit claim routing** — who responds to the consumer''s financial
    institution and who bears WSOD/return-related losses.

    - **Mosaic Relay''s NACHA role** (TPSP vs. Third-Party Sender vs. ODFI agent)
    — changes registration, warranty, and risk-assessment obligations.

    - **ODFI/processor agreement terms** — evidence-production SLAs, return-rate thresholds,
    and prohibited practices are often stricter than NACHA baseline.

    - **Finalized authorization language and evidence format.**


    ---


    ## 5. Unverified leads


    - **Current NACHA Operating Rules edition** (2025/2026) — WEB debit account-validation
    standard, standing-authorization notice mechanics for variable amounts, two-year
    post-termination retention, reinitiation limits, current return-rate thresholds.
    No external authority retrieved in this pass; citations are model-generated and
    must be confirmed.

    - **Reg E §§ 1005.10(b), (c), (d) and 1005.11** — confirm text against current
    eCFR for written-authorization, stop-payment, variable-amount notice, and error-resolution
    mechanics.

    - **FTC Negative Option Rule status** — the 2024 "click-to-cancel" rule was vacated
    by the Eighth Circuit in 2025; ROSCA and state auto-renewal laws remain the operative
    framework. Verify current posture before advising the merchant.

    - **State auto-renewal laws** (e.g., California SB-313-style ARLs) — monthly consumer
    subscriptions for digital goods sit squarely in ARL territory.


    ---


    ## 6. Analysis


    ### 6.1 Authorization format (NACHA)

    - **SEC code selection.** A consumer entering bank credentials at an online checkout
    is a **WEB debit** (internet-initiated entry) under NACHA, even though it is also
    a recurring debit. WEB entries require: (a) authorization obtained via the internet
    in a manner that can be **retained and reproduced**; (b) **commercially reasonable
    fraudulent-transaction detection systems**; (c) **account validation** before
    the first debit (prenotes, micro-deposits, or instant account verification all
    qualify); and (d) commercially reasonable website security (e.g., TLS).

    - **Recurring/standing authorization.** NACHA permits a **standing authorization**
    for recurring debits at regular intervals. The authorization must be **clear and
    readily understandable**, identify the recurring nature, the timing/frequency,
    and the amount or how the amount is determined. For consumer accounts, the authorization
    must be **in writing and signed or similarly authenticated** — an electronic clickwrap
    with an auditable record satisfies this if the authentication method is defensible.

    - **Reg E overlay (§ 1005.10(b)).** Preauthorized electronic fund transfers from
    a consumer''s account must be authorized **in writing** and the consumer must
    receive a **copy** of the authorization. The email confirmation can serve as the
    copy if it contains the full authorization terms — not just a receipt.

    - **Revocation.** NACHA requires that the consumer be able to **revoke authorization
    by notifying the merchant (Originator)** in the manner specified in the authorization.
    Reg E separately gives the consumer **stop-payment** rights at their bank (§ 1005.10(c))
    — notice at least 3 business days before the scheduled debit. The checkout and
    email must disclose both paths.


    ### 6.2 Evidence retention and production

    - NACHA requires the Originator to **retain the authorization (or an accurate
    record of it) for two years after termination or revocation**, and to **provide
    proof of authorization to the ODFI upon request** — typically within a short window
    (the Rules require furnishing it within the timeframe the ODFI sets; ODFIs commonly
    demand 5–10 business days because RDFIs can request proof).

    - The record must capture: the consumer''s identity/authentication, the exact
    authorization language presented, date/time, IP/device data for WEB entries, and
    the account details authorized. If the dashboard is the system of record, Mosaic
    Relay must guarantee immutability, exportability, and a production SLA — an architecture
    decision, not just a policy.

    - Reg E error-resolution (§ 1005.11) runs on the consumer''s bank''s timeline,
    but the practical burden lands on the Originator to produce authorization evidence
    to defeat an "unauthorized" return (R10/R07).


    ### 6.3 Variable amounts and per-debit notice

    - **NACHA standing authorization with variable amounts:** the authorization must
    state how amounts are determined, and NACHA requires the Originator to provide
    the consumer **notice of the amount and date of each debit at least 10 calendar
    days before the debit** when the amount varies from the previous debit or falls
    outside a pre-authorized range — unless the consumer affirmatively elects to receive
    notice only when the amount exceeds a specified range or differs from the most
    recent debit.

    - **Reg E parallel rule (§ 1005.10(d)):** for preauthorized transfers that vary
    in amount, the payee must send **written notice of the amount and date at least
    10 days before the transfer**, or the consumer may elect notice only when the
    amount falls outside agreed limits.

    - **Practical consequence:** if the merchant will use variable amounts, the product
    must either (a) send a pre-debit notice ≥10 days before each variable debit, or
    (b) capture the consumer''s range-based election in the authorization. Option
    (b) is the common UX-friendly path but must be drafted precisely.


    ### 6.4 Cancellation, stop-payment, and refunds

    - **Revocation of authorization:** consumer must be able to revoke by notice to
    the merchant; the merchant (and Mosaic Relay operationally) must stop debits before
    the next scheduled entry. NACHA treats a debit after revocation as subject to
    return (R07 — authorization revoked).

    - **Reg E stop payment:** consumer can stop payment through their bank on 3 business
    days'' notice; the system should expect R08 (payment stopped) returns and not
    re-present them.

    - **Refunds:** NACHA does not mandate refund timing for cancellations — that is
    contract/consumer-protection law (state auto-renewal statutes, FTC Negative Option
    Rule, ROSCA for online subscriptions). Because subscriptions renew monthly and
    involve digital goods, **ROSCA and the FTC''s negative-option requirements** (clear
    disclosure, express informed consent, simple cancellation — "click to cancel")
    apply to the merchant''s checkout independent of ACH mechanics. Mosaic Relay should
    require the merchant''s cancellation path to be as easy as signup.

    - **Reinitiation limits:** NACHA caps reinitiation of returned debits (generally
    no more than two reinitiations following a return, and none after R07/R08/R10-type
    returns). The dashboard''s "returned" status must drive re-presentment logic,
    not just display.


    ### 6.5 Return and dispute handling

    - Consumer "unauthorized" claims arrive as **R10 (customer advises not authorized)**
    or R07 returns via the RDFI, backed by a **Written Statement of Unauthorized Debit
    (WSOD)**. R10 returns can occur up to 60 days from settlement (consumer''s Reg
    E window), and NACHA imposes **return-rate monitoring** — unauthorized return
    rates above 0.5% trigger scrutiny; ODFIs enforce thresholds contractually.

    - **Allocation:** the **Originator (merchant) warrants authorization validity**
    to the ODFI under NACHA; Mosaic Relay, as a **Third-Party Service Provider / Third-Party
    Sender** (depending on structure), has its own NACHA obligations — Third-Party
    Senders must register with NACHA, conduct risk assessments, and may need to warrant
    merchant conduct. Which role Mosaic Relay occupies under its ODFI agreement is
    a threshold legal question the vault does not yet answer.


    ---


    ## 7. UX limits on the proposed checkout


    - Authorization checkbox must be **separate and un-bundled** (not pre-checked,
    not buried in general terms) — NACHA "readily identifiable as an authorization"
    standard plus ROSCA express-consent practice.

    - The email confirmation must contain the **full authorization terms** (amount/range,
    frequency, revocation method, stop-payment rights) to satisfy Reg E''s copy requirement.

    - Account validation (prenote, micro-deposit, or IAV) must complete **before the
    first debit** — this affects the "instant access to digital goods" UX; a prenote
    adds ~3 banking days, so instant-access design likely requires IAV or micro-deposits
    instead.

    - Dashboard must not allow re-presentment of R07/R08/R10 returns and must surface
    revocation status to prevent post-cancellation debits.


    ---


    ## 8. Responsibilities (recommended allocation)


    - **Merchant (Originator):** warrants authorization validity; honors cancellations;
    provides a cancellation path as easy as signup; produces authorization evidence
    to Mosaic Relay/ODFI within SLA; complies with ROSCA/state auto-renewal disclosure
    and consent requirements.

    - **Mosaic Relay:** enforces stop before the next debit when technically possible;
    retains and produces authorization evidence if the dashboard is the system of
    record; drives re-presentment logic from returned status; surfaces revocation
    status; provides support escalation for cancellation and unauthorized-debit claims;
    registers/conducts risk assessment if it is a Third-Party Sender.

    - **RDFI (consumer''s bank):** processes stop-payment and error-resolution under
    Reg E; returns unauthorized debits (R10/R07) with WSOD.

    - **ODFI/processor:** sets evidence-production SLAs and return-rate thresholds;
    enforces NACHA compliance on the Originator and Mosaic Relay.


    ---


    ## 9. Recommendation


    **Recommended path: fixed-amount-only at launch with IAV, unbundled consent, full-terms
    email, and a clear cancellation path.**


    - **Restrict v1 to fixed monthly amounts; defer variable amounts.** This eliminates
    the 10-day variable-notice build and materially reduces compliance surface. Feasible
    within nine weeks if the ODFI confirms WEB-debit onboarding and evidence requirements
    promptly.

    - **Use instant account verification (IAV) or micro-deposits** rather than prenotes,
    so digital-goods consumers get near-instant access without a ~3-day prenote delay.

    - **Checkout:** unbundled authorization checkbox (not pre-checked), full authorization
    terms in the email confirmation (amount, frequency, revocation method, stop-payment
    rights).

    - **Cancellation:** clear in-product cancellation and stop-payment path plus support
    escalation; merchant honors cancellations; Mosaic Relay enforces the stop before
    the next debit when technically possible; define cutoffs, confirmation, audit
    trail, and refund to the original payment method with timing and exceptions disclosed.

    - **Decide and document before launch:** system of record for authorization evidence,
    account-validation method, unauthorized-claim routing, and cancellation cutoffs.


    **This is a recommendation only. It is not a recorded decision.** Counsel should
    confirm the unverified leads below before finalizing.


    ---


    ## 10. Next steps


    1. **Verify authority** — pull the current NACHA Operating Rules edition and current
    Reg E text (eCFR) and confirm the rule statements in Section 6.

    2. **Obtain and read the ODFI/processor agreement and ACH addendum** for Mosaic
    Relay''s role classification, evidence SLAs, and return thresholds.

    3. **Confirm FTC Negative Option Rule posture** (post-2025 vacatur) and applicable
    state auto-renewal laws for the merchant''s checkout.

    4. **Resolve the undecided items** — variable vs. fixed amounts, system of record,
    prenote vs. IAV, unauthorized-claim routing, cancellation cutoffs.

    5. **Finalize authorization language and evidence format** with the merchant.

    6. **Test operational controls** — cancellation enforcement, re-presentment logic,
    evidence production SLA, return-rate monitoring.


    ---


    ## What would change this


    - **Working assumption — Mosaic Relay''s NACHA role.** Assumed Mosaic Relay acts
    as a Third-Party Service Provider/Third-Party Sender submitting through partner
    ODFIs. If Mosaic Relay is actually the Originator of record or a Third-Party Sender
    with direct NACHA registration duties, the warranty, registration, and risk-assessment
    sections expand substantially and the launch checklist grows.

    - **Open fork — variable amounts.** If the merchant ships variable amounts at
    launch, a 10-day pre-debit notice engine (or a precisely drafted range election)
    becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d); if fixed-only,
    the nine-week timeline is comfortable. The intake answer ("both / not yet decided")
    leaves the single biggest scope question open.

    - **Open fork — system of record.** If the dashboard is not the system of record
    for authorization evidence, Mosaic Relay must contractually secure production
    of evidence from the merchant within the ODFI''s SLA; if it is, Mosaic Relay owns
    a two-year-post-termination retention and production build. The compliance architecture
    differs materially.

    - **Not examined — the ODFI/processor agreements.** The vault contains no partner
    agreements; ODFI terms on evidence turnaround, return thresholds, and WEB-debit
    onboarding could be stricter than NACHA baseline and could independently gate
    the 2026-11-05 date. This is the highest-value unread source.

    - **Not examined — current NACHA Rules text and eCFR.** No external authority
    was retrieved; every rule statement above is model-generated and unverified against
    the current NACHA edition and current Reg E text, including any 2025–2026 amendments
    to standing authorizations or return thresholds.

    - **Working assumption — consumer accounts only.** Assumed all debits hit consumer
    accounts (Reg E applies). If any subscribers are small businesses using business
    accounts, Reg E drops out for those debits and NACHA-only rules (and different
    return codes/timelines) apply — a mixed portfolio would need bifurcated flows.'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-03T09:49:33+00:00'
recommendation_updated_at: '2026-09-03T09:49:33+00:00'
recommendation_updated_by: Themis.ai
proposed_recommendation: null
---
# First-Pass Legal Response — Recurring Consumer ACH Debits

**Matter:** Mosaic Relay UX Test — 07 — ACH Authorization and Consumer Refunds
**Target launch:** 2026-11-05 (nine weeks from intake)
**Status:** First-pass draft. No external authority retrieved; verify before reliance.

---

## 1. Facts

### Established facts
- The merchant wants to accept recurring ACH payments from consumers for a subscription service.
- The proposed checkout asks the consumer to enter bank details, agree to recurring debit terms, and receive an email confirmation.
- Mosaic Relay would submit debits through its payment partners, show pending and returned status in the dashboard, and initiate refunds when the customer cancels.
- The merchant's subscriptions can renew monthly.
- Some consumers may use the service for digital goods.
- The customer wants to release the feature in nine weeks (target 2026-11-05).

### Undecided items (recorded, not yet resolved)
- Whether the merchant will use fixed amounts, variable amounts, or both.
- Whether Mosaic Relay's dashboard will be the system of record for authorization evidence, and who retains and produces it when a consumer's financial institution requests proof of authorization.
- The cancellation and refund process (recommendation captured: clear in-product cancellation and stop-payment path plus support escalation, merchant responsible for honoring cancellations, Mosaic Relay enforcing the stop before the next debit when technically possible, with cutoffs, confirmation, audit trail, and refund to the original payment method disclosed).
- Whether the merchant will use prenotification (prenotes) before the first debit.
- How unauthorized-debit claims will be handled and who responds to the consumer's financial institution.
- Finalized authorization language and evidence format.

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

- **Mosaic Relay's NACHA role.** Mosaic Relay acts as a third-party service provider / ODFI agent submitting debits through payment partners, not as the originating bank. If Mosaic Relay is instead the Originator of record or a Third-Party Sender with direct NACHA registration duties, the warranty, registration, and risk-assessment sections expand materially.
- **Governing framework.** The consumer-facing recurring-debit authorization is governed by the NACHA Operating Rules and, for consumer accounts, Regulation E (EFTA).
- **U.S. scope only**, consistent with the company profile.
- **Consumer accounts only.** All debits hit consumer accounts (Reg E applies). If any subscribers are small businesses using business accounts, Reg E drops out for those debits and NACHA-only rules (and different return codes/timelines) apply.

---

## 4. Missing facts

- **Variable vs. fixed amounts** — determines whether a 10-day pre-debit notice engine (or a range election) is a launch blocker.
- **System of record** — whether the dashboard holds authorization evidence and who produces it to the RDFI within NACHA timeframes.
- **Prenotes vs. account validation method** — affects first-debit timing and the instant-access UX for digital goods.
- **Unauthorized-debit claim routing** — who responds to the consumer's financial institution and who bears WSOD/return-related losses.
- **Mosaic Relay's NACHA role** (TPSP vs. Third-Party Sender vs. ODFI agent) — changes registration, warranty, and risk-assessment obligations.
- **ODFI/processor agreement terms** — evidence-production SLAs, return-rate thresholds, and prohibited practices are often stricter than NACHA baseline.
- **Finalized authorization language and evidence format.**

---

## 5. Unverified leads

- **Current NACHA Operating Rules edition** (2025/2026) — WEB debit account-validation standard, standing-authorization notice mechanics for variable amounts, two-year post-termination retention, reinitiation limits, current return-rate thresholds. No external authority retrieved in this pass; citations are model-generated and must be confirmed.
- **Reg E §§ 1005.10(b), (c), (d) and 1005.11** — confirm text against current eCFR for written-authorization, stop-payment, variable-amount notice, and error-resolution mechanics.
- **FTC Negative Option Rule status** — the 2024 "click-to-cancel" rule was vacated by the Eighth Circuit in 2025; ROSCA and state auto-renewal laws remain the operative framework. Verify current posture before advising the merchant.
- **State auto-renewal laws** (e.g., California SB-313-style ARLs) — monthly consumer subscriptions for digital goods sit squarely in ARL territory.

---

## 6. Analysis

### 6.1 Authorization format (NACHA)
- **SEC code selection.** A consumer entering bank credentials at an online checkout is a **WEB debit** (internet-initiated entry) under NACHA, even though it is also a recurring debit. WEB entries require: (a) authorization obtained via the internet in a manner that can be **retained and reproduced**; (b) **commercially reasonable fraudulent-transaction detection systems**; (c) **account validation** before the first debit (prenotes, micro-deposits, or instant account verification all qualify); and (d) commercially reasonable website security (e.g., TLS).
- **Recurring/standing authorization.** NACHA permits a **standing authorization** for recurring debits at regular intervals. The authorization must be **clear and readily understandable**, identify the recurring nature, the timing/frequency, and the amount or how the amount is determined. For consumer accounts, the authorization must be **in writing and signed or similarly authenticated** — an electronic clickwrap with an auditable record satisfies this if the authentication method is defensible.
- **Reg E overlay (§ 1005.10(b)).** Preauthorized electronic fund transfers from a consumer's account must be authorized **in writing** and the consumer must receive a **copy** of the authorization. The email confirmation can serve as the copy if it contains the full authorization terms — not just a receipt.
- **Revocation.** NACHA requires that the consumer be able to **revoke authorization by notifying the merchant (Originator)** in the manner specified in the authorization. Reg E separately gives the consumer **stop-payment** rights at their bank (§ 1005.10(c)) — notice at least 3 business days before the scheduled debit. The checkout and email must disclose both paths.

### 6.2 Evidence retention and production
- NACHA requires the Originator to **retain the authorization (or an accurate record of it) for two years after termination or revocation**, and to **provide proof of authorization to the ODFI upon request** — typically within a short window (the Rules require furnishing it within the timeframe the ODFI sets; ODFIs commonly demand 5–10 business days because RDFIs can request proof).
- The record must capture: the consumer's identity/authentication, the exact authorization language presented, date/time, IP/device data for WEB entries, and the account details authorized. If the dashboard is the system of record, Mosaic Relay must guarantee immutability, exportability, and a production SLA — an architecture decision, not just a policy.
- Reg E error-resolution (§ 1005.11) runs on the consumer's bank's timeline, but the practical burden lands on the Originator to produce authorization evidence to defeat an "unauthorized" return (R10/R07).

### 6.3 Variable amounts and per-debit notice
- **NACHA standing authorization with variable amounts:** the authorization must state how amounts are determined, and NACHA requires the Originator to provide the consumer **notice of the amount and date of each debit at least 10 calendar days before the debit** when the amount varies from the previous debit or falls outside a pre-authorized range — unless the consumer affirmatively elects to receive notice only when the amount exceeds a specified range or differs from the most recent debit.
- **Reg E parallel rule (§ 1005.10(d)):** for preauthorized transfers that vary in amount, the payee must send **written notice of the amount and date at least 10 days before the transfer**, or the consumer may elect notice only when the amount falls outside agreed limits.
- **Practical consequence:** if the merchant will use variable amounts, the product must either (a) send a pre-debit notice ≥10 days before each variable debit, or (b) capture the consumer's range-based election in the authorization. Option (b) is the common UX-friendly path but must be drafted precisely.

### 6.4 Cancellation, stop-payment, and refunds
- **Revocation of authorization:** consumer must be able to revoke by notice to the merchant; the merchant (and Mosaic Relay operationally) must stop debits before the next scheduled entry. NACHA treats a debit after revocation as subject to return (R07 — authorization revoked).
- **Reg E stop payment:** consumer can stop payment through their bank on 3 business days' notice; the system should expect R08 (payment stopped) returns and not re-present them.
- **Refunds:** NACHA does not mandate refund timing for cancellations — that is contract/consumer-protection law (state auto-renewal statutes, FTC Negative Option Rule, ROSCA for online subscriptions). Because subscriptions renew monthly and involve digital goods, **ROSCA and the FTC's negative-option requirements** (clear disclosure, express informed consent, simple cancellation — "click to cancel") apply to the merchant's checkout independent of ACH mechanics. Mosaic Relay should require the merchant's cancellation path to be as easy as signup.
- **Reinitiation limits:** NACHA caps reinitiation of returned debits (generally no more than two reinitiations following a return, and none after R07/R08/R10-type returns). The dashboard's "returned" status must drive re-presentment logic, not just display.

### 6.5 Return and dispute handling
- Consumer "unauthorized" claims arrive as **R10 (customer advises not authorized)** or R07 returns via the RDFI, backed by a **Written Statement of Unauthorized Debit (WSOD)**. R10 returns can occur up to 60 days from settlement (consumer's Reg E window), and NACHA imposes **return-rate monitoring** — unauthorized return rates above 0.5% trigger scrutiny; ODFIs enforce thresholds contractually.
- **Allocation:** the **Originator (merchant) warrants authorization validity** to the ODFI under NACHA; Mosaic Relay, as a **Third-Party Service Provider / Third-Party Sender** (depending on structure), has its own NACHA obligations — Third-Party Senders must register with NACHA, conduct risk assessments, and may need to warrant merchant conduct. Which role Mosaic Relay occupies under its ODFI agreement is a threshold legal question the vault does not yet answer.

---

## 7. UX limits on the proposed checkout

- Authorization checkbox must be **separate and un-bundled** (not pre-checked, not buried in general terms) — NACHA "readily identifiable as an authorization" standard plus ROSCA express-consent practice.
- The email confirmation must contain the **full authorization terms** (amount/range, frequency, revocation method, stop-payment rights) to satisfy Reg E's copy requirement.
- Account validation (prenote, micro-deposit, or IAV) must complete **before the first debit** — this affects the "instant access to digital goods" UX; a prenote adds ~3 banking days, so instant-access design likely requires IAV or micro-deposits instead.
- Dashboard must not allow re-presentment of R07/R08/R10 returns and must surface revocation status to prevent post-cancellation debits.

---

## 8. Responsibilities (recommended allocation)

- **Merchant (Originator):** warrants authorization validity; honors cancellations; provides a cancellation path as easy as signup; produces authorization evidence to Mosaic Relay/ODFI within SLA; complies with ROSCA/state auto-renewal disclosure and consent requirements.
- **Mosaic Relay:** enforces stop before the next debit when technically possible; retains and produces authorization evidence if the dashboard is the system of record; drives re-presentment logic from returned status; surfaces revocation status; provides support escalation for cancellation and unauthorized-debit claims; registers/conducts risk assessment if it is a Third-Party Sender.
- **RDFI (consumer's bank):** processes stop-payment and error-resolution under Reg E; returns unauthorized debits (R10/R07) with WSOD.
- **ODFI/processor:** sets evidence-production SLAs and return-rate thresholds; enforces NACHA compliance on the Originator and Mosaic Relay.

---

## 9. Recommendation

**Recommended path: fixed-amount-only at launch with IAV, unbundled consent, full-terms email, and a clear cancellation path.**

- **Restrict v1 to fixed monthly amounts; defer variable amounts.** This eliminates the 10-day variable-notice build and materially reduces compliance surface. Feasible within nine weeks if the ODFI confirms WEB-debit onboarding and evidence requirements promptly.
- **Use instant account verification (IAV) or micro-deposits** rather than prenotes, so digital-goods consumers get near-instant access without a ~3-day prenote delay.
- **Checkout:** unbundled authorization checkbox (not pre-checked), full authorization terms in the email confirmation (amount, frequency, revocation method, stop-payment rights).
- **Cancellation:** clear in-product cancellation and stop-payment path plus support escalation; merchant honors cancellations; Mosaic Relay enforces the stop before the next debit when technically possible; define cutoffs, confirmation, audit trail, and refund to the original payment method with timing and exceptions disclosed.
- **Decide and document before launch:** system of record for authorization evidence, account-validation method, unauthorized-claim routing, and cancellation cutoffs.

**This is a recommendation only. It is not a recorded decision.** Counsel should confirm the unverified leads below before finalizing.

---

## 10. Next steps

1. **Verify authority** — pull the current NACHA Operating Rules edition and current Reg E text (eCFR) and confirm the rule statements in Section 6.
2. **Obtain and read the ODFI/processor agreement and ACH addendum** for Mosaic Relay's role classification, evidence SLAs, and return thresholds.
3. **Confirm FTC Negative Option Rule posture** (post-2025 vacatur) and applicable state auto-renewal laws for the merchant's checkout.
4. **Resolve the undecided items** — variable vs. fixed amounts, system of record, prenote vs. IAV, unauthorized-claim routing, cancellation cutoffs.
5. **Finalize authorization language and evidence format** with the merchant.
6. **Test operational controls** — cancellation enforcement, re-presentment logic, evidence production SLA, return-rate monitoring.

---

## What would change this

- **Working assumption — Mosaic Relay's NACHA role.** Assumed Mosaic Relay acts as a Third-Party Service Provider/Third-Party Sender submitting through partner ODFIs. If Mosaic Relay is actually the Originator of record or a Third-Party Sender with direct NACHA registration duties, the warranty, registration, and risk-assessment sections expand substantially and the launch checklist grows.
- **Open fork — variable amounts.** If the merchant ships variable amounts at launch, a 10-day pre-debit notice engine (or a precisely drafted range election) becomes a hard launch blocker under both NACHA and Reg E § 1005.10(d); if fixed-only, the nine-week timeline is comfortable. The intake answer ("both / not yet decided") leaves the single biggest scope question open.
- **Open fork — system of record.** If the dashboard is not the system of record for authorization evidence, Mosaic Relay must contractually secure production of evidence from the merchant within the ODFI's SLA; if it is, Mosaic Relay owns a two-year-post-termination retention and production build. The compliance architecture differs materially.
- **Not examined — the ODFI/processor agreements.** The vault contains no partner agreements; ODFI terms on evidence turnaround, return thresholds, and WEB-debit onboarding could be stricter than NACHA baseline and could independently gate the 2026-11-05 date. This is the highest-value unread source.
- **Not examined — current NACHA Rules text and eCFR.** No external authority was retrieved; every rule statement above is model-generated and unverified against the current NACHA edition and current Reg E text, including any 2025–2026 amendments to standing authorizations or return thresholds.
- **Working assumption — consumer accounts only.** Assumed all debits hit consumer accounts (Reg E applies). If any subscribers are small businesses using business accounts, Reg E drops out for those debits and NACHA-only rules (and different return codes/timelines) apply — a mixed portfolio would need bifurcated flows.
