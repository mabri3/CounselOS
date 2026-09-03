---
matter_id: MAT-20260902-d57fb7
record_type: recommendations
current_recommendation_version_id: REC-20260902-18be8d
recommendation_versions:
- version_id: REC-20260902-18be8d
  number: 1
  content: '# Recommendation — Instant Merchant Onboarding for Marketplace Sellers


    **Matter:** Mosaic Relay UX Test — 01 — Instant Merchant Onboarding for Marketplace
    Sellers

    **Prepared for:** Lawyer (legal owner)

    **Status:** Recommendation for lawyer decision — not a recorded decision


    ---


    ## Recommendation


    **Proceed with the limited-access model now — but only as a conditional, gated
    build, not as a launch commitment.** The model is **permissible in design** and
    is a reasonable risk-tiering approach, but its permissibility is **not yet confirmed**
    on the current facts. The recommendation is to **continue building and negotiating
    under the current assumptions**, while treating the following as hard pre-launch
    gates. Do not launch the five-minute instant tier until the conditions below are
    met.


    **Why proceed now (rather than wait):** The design is structurally defensible,
    the $10,000 cap and delayed payouts are sound risk controls, and the remaining
    blockers are confirmable dependencies (acquiring-partner requirements, flow of
    funds, state licensing path) rather than fundamental legal obstacles. Proceeding
    with the build and partner negotiations in parallel is the fastest safe path to
    launch. The alternative — waiting for full confirmation before building — would
    forfeit the timeline without reducing risk.


    **Why it must be gated (rather than unconditional):** The controlling dependency
    — the acquiring partners'' pre-activation verification requirements — is still
    under discussion, and no state licensing path has been verified. If the partners
    require full KYB before any processing, or if the flow-of-funds structure puts
    Mosaic Relay in custody of funds, the five-minute model is not permissible as
    designed. These must be confirmed before launch.


    ---


    ## Conditions that must be met before launch


    ### Hard gates (non-negotiable before any seller processes a payment)

    1. **Acquiring-partner minimum data set confirmed in writing.** The partners''
    requirements may raise the floor above Mosaic Relay''s own tiering; if they require
    full KYB before any processing, the five-minute model is not permissible as designed.
    **[Under discussion — must be resolved]**

    2. **Flow of funds / custody confirmed in writing** with engineering and the acquiring
    partners — who holds what, when, under which contract. Mosaic Relay must never
    take custody of funds, preserving the no-money-transmitter position. This is the
    single most decisive fact for the licensing trigger. **[Not yet confirmed]**

    3. **A state licensing path confirmed** via a 50-state money-transmission survey
    against the confirmed flow-of-funds diagram, testing the agent-of-payee and processor
    exemptions state by state. The $10,000 cap is a risk control, **not** a licensing
    exemption. **[Gating work item — not yet done]**

    4. **Identity and sanctions screening genuinely completed before activation**
    — not merely initiated. Sanctions screening (OFAC) must finish with no unresolved
    hit before a seller''s first payment. **[Design intent; must be enforced]**

    5. **Card-network payfac registration/underwriting confirmed** for the instant,
    low-risk tier. **[Not yet confirmed]**

    6. **CDD allocation documented** in the marketplace agreement, with a single accountable
    owner for each control (identity verification, sanctions screening, risk scoring,
    activation decision). Regulatory accountability cannot be contracted away. **[To
    be allocated]**

    7. **Adverse-action/notice process designed** for rejected sellers, compliant
    with FCRA/ECOA if the vendor data is a consumer report. **[Depends on vendor decision
    logic — open]**

    8. **FinCEN MSB registration analyzed separately** — federal MSB status is independent
    of state licensing. **[Not yet analyzed]**


    ### Minimum-before-activation floor (per seller, before first payment)

    9. Legal entity identity verified (legal name, business type, tax ID, business
    address).

    10. Beneficial owners identified and verified (25%+ owners and a control person
    for legal-entity sellers) — required under the CDD rule.

    11. Government ID verified for the controlling individual(s).

    12. Sanctions screening completed with no unresolved hit.

    13. Risk scoring completed and the seller classified low-risk for instant activation.

    14. Payout destination captured and validated.

    15. Expected monthly volume and payment methods captured.

    16. $10,000 monthly cap and delayed payouts enforced as hard limits for instant
    sellers.

    17. Retention schedule set at least to the five-year BSA floor.


    ### Recommended implementation path

    Adopt **Path C (launch-state gating) combined with Path A (agent-of-payee contract
    structuring)** from the research memo — launch instant onboarding only in states
    confirmed exempt or low-risk after the 50-state survey, keep the two-day flow
    elsewhere, and structure the marketplace–Mosaic Relay–seller agreements so payment
    to the partner satisfies the buyer''s obligation to the seller and Mosaic Relay
    never holds funds for its own account. **No state should be green-lit until the
    50-state survey and flow-of-funds confirmation are complete.** These paths are
    generated analysis, not verified law, and must be confirmed against current state
    statutes. **[GENERATED — RESEARCH MEMO]**


    ---


    ## Key assumptions and carried-forward open items

    - **Jurisdiction:** US-only sellers (assumption, pending confirmation of exact
    states).

    - **CDD ownership:** Shared / to be allocated between marketplace and Mosaic Relay.

    - **Acquiring-partner requirements:** Under discussion, not finalized.

    - **Launch date:** No fixed date; answer needed before a planned launch.

    - **Open items carried forward:** exact jurisdictions; data retention period;
    vendor decision logic; how rejected sellers receive notice; whether risk-scoring
    data is a "consumer report" under FCRA; whether Mosaic Relay operates as a payfac;
    flow-of-funds mechanics; state licensing path; FinCEN MSB status.


    ---


    ## Bottom line

    The limited-access model is **conditionally permissible** and worth proceeding
    with as a gated build. Do not launch until the eight hard gates above are satisfied
    — most critically, the acquiring partners'' written requirements, the confirmed
    flow of funds, and a verified state licensing path. The $10,000 cap and delayed
    payouts are sound risk controls but must not be represented internally as licensing
    exemptions.


    *This is a recommendation for the lawyer''s decision. It is not a recorded decision
    and not a final legal opinion. Confirm the acquiring-partner requirements, fund-flow/custody
    structure, vendor data sources, current card-network rule versions, and the state
    licensing paths before reliance.*'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-02T14:29:02+00:00'
recommendation_updated_at: '2026-09-02T14:29:02+00:00'
recommendation_updated_by: Themis.ai
proposed_recommendation: null
---
# Recommendation — Instant Merchant Onboarding for Marketplace Sellers

**Matter:** Mosaic Relay UX Test — 01 — Instant Merchant Onboarding for Marketplace Sellers
**Prepared for:** Lawyer (legal owner)
**Status:** Recommendation for lawyer decision — not a recorded decision

---

## Recommendation

**Proceed with the limited-access model now — but only as a conditional, gated build, not as a launch commitment.** The model is **permissible in design** and is a reasonable risk-tiering approach, but its permissibility is **not yet confirmed** on the current facts. The recommendation is to **continue building and negotiating under the current assumptions**, while treating the following as hard pre-launch gates. Do not launch the five-minute instant tier until the conditions below are met.

**Why proceed now (rather than wait):** The design is structurally defensible, the $10,000 cap and delayed payouts are sound risk controls, and the remaining blockers are confirmable dependencies (acquiring-partner requirements, flow of funds, state licensing path) rather than fundamental legal obstacles. Proceeding with the build and partner negotiations in parallel is the fastest safe path to launch. The alternative — waiting for full confirmation before building — would forfeit the timeline without reducing risk.

**Why it must be gated (rather than unconditional):** The controlling dependency — the acquiring partners' pre-activation verification requirements — is still under discussion, and no state licensing path has been verified. If the partners require full KYB before any processing, or if the flow-of-funds structure puts Mosaic Relay in custody of funds, the five-minute model is not permissible as designed. These must be confirmed before launch.

---

## Conditions that must be met before launch

### Hard gates (non-negotiable before any seller processes a payment)
1. **Acquiring-partner minimum data set confirmed in writing.** The partners' requirements may raise the floor above Mosaic Relay's own tiering; if they require full KYB before any processing, the five-minute model is not permissible as designed. **[Under discussion — must be resolved]**
2. **Flow of funds / custody confirmed in writing** with engineering and the acquiring partners — who holds what, when, under which contract. Mosaic Relay must never take custody of funds, preserving the no-money-transmitter position. This is the single most decisive fact for the licensing trigger. **[Not yet confirmed]**
3. **A state licensing path confirmed** via a 50-state money-transmission survey against the confirmed flow-of-funds diagram, testing the agent-of-payee and processor exemptions state by state. The $10,000 cap is a risk control, **not** a licensing exemption. **[Gating work item — not yet done]**
4. **Identity and sanctions screening genuinely completed before activation** — not merely initiated. Sanctions screening (OFAC) must finish with no unresolved hit before a seller's first payment. **[Design intent; must be enforced]**
5. **Card-network payfac registration/underwriting confirmed** for the instant, low-risk tier. **[Not yet confirmed]**
6. **CDD allocation documented** in the marketplace agreement, with a single accountable owner for each control (identity verification, sanctions screening, risk scoring, activation decision). Regulatory accountability cannot be contracted away. **[To be allocated]**
7. **Adverse-action/notice process designed** for rejected sellers, compliant with FCRA/ECOA if the vendor data is a consumer report. **[Depends on vendor decision logic — open]**
8. **FinCEN MSB registration analyzed separately** — federal MSB status is independent of state licensing. **[Not yet analyzed]**

### Minimum-before-activation floor (per seller, before first payment)
9. Legal entity identity verified (legal name, business type, tax ID, business address).
10. Beneficial owners identified and verified (25%+ owners and a control person for legal-entity sellers) — required under the CDD rule.
11. Government ID verified for the controlling individual(s).
12. Sanctions screening completed with no unresolved hit.
13. Risk scoring completed and the seller classified low-risk for instant activation.
14. Payout destination captured and validated.
15. Expected monthly volume and payment methods captured.
16. $10,000 monthly cap and delayed payouts enforced as hard limits for instant sellers.
17. Retention schedule set at least to the five-year BSA floor.

### Recommended implementation path
Adopt **Path C (launch-state gating) combined with Path A (agent-of-payee contract structuring)** from the research memo — launch instant onboarding only in states confirmed exempt or low-risk after the 50-state survey, keep the two-day flow elsewhere, and structure the marketplace–Mosaic Relay–seller agreements so payment to the partner satisfies the buyer's obligation to the seller and Mosaic Relay never holds funds for its own account. **No state should be green-lit until the 50-state survey and flow-of-funds confirmation are complete.** These paths are generated analysis, not verified law, and must be confirmed against current state statutes. **[GENERATED — RESEARCH MEMO]**

---

## Key assumptions and carried-forward open items
- **Jurisdiction:** US-only sellers (assumption, pending confirmation of exact states).
- **CDD ownership:** Shared / to be allocated between marketplace and Mosaic Relay.
- **Acquiring-partner requirements:** Under discussion, not finalized.
- **Launch date:** No fixed date; answer needed before a planned launch.
- **Open items carried forward:** exact jurisdictions; data retention period; vendor decision logic; how rejected sellers receive notice; whether risk-scoring data is a "consumer report" under FCRA; whether Mosaic Relay operates as a payfac; flow-of-funds mechanics; state licensing path; FinCEN MSB status.

---

## Bottom line
The limited-access model is **conditionally permissible** and worth proceeding with as a gated build. Do not launch until the eight hard gates above are satisfied — most critically, the acquiring partners' written requirements, the confirmed flow of funds, and a verified state licensing path. The $10,000 cap and delayed payouts are sound risk controls but must not be represented internally as licensing exemptions.

*This is a recommendation for the lawyer's decision. It is not a recorded decision and not a final legal opinion. Confirm the acquiring-partner requirements, fund-flow/custody structure, vendor data sources, current card-network rule versions, and the state licensing paths before reliance.*
