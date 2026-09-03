---
work_product_id: WP-e98bb185a80e
matter_id: MAT-20260902-d57fb7
title: Instant Merchant Onboarding — US Regulatory Analysis and Minimum-Before-Activation
  Checklist
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T14:26:24+00:00'
updated_at: '2026-09-02T14:28:54+00:00'
immutable: false
source_action_key: chat:RUN-20260902-d85a99:tool:4d7153cedc0b89f57c65fc81
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Instant Merchant Onboarding for Marketplace Sellers — US Regulatory Analysis


      **Matter:** Mosaic Relay UX Test — 01 — Instant Merchant Onboarding for Marketplace
      Sellers

      **Status:** Research / working draft

      **Assumptions carried forward:** US-only sellers (assumption); CDD shared and
      to be allocated; acquiring-partner requirements under discussion; no fixed launch
      date.

      **Note on sourcing:** Items below are marked **[VERIFIED]** where they rest
      on clearly identified primary sources (statutes, regulations, or card-network
      rule sets), or **[UNVERIFIED LEAD]** where they are directional and require
      confirmation against the specific acquiring-partner agreements and current rule
      versions'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' before reliance. Items drawn from the background research memo are labeled
      **[GENERATED — RESEARCH MEMO]** and are **not** verified law; they must be confirmed
      against current state statutes'
    change_id: CHG-20260902-7b329d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: ' before reliance.


      ---


      ## 1. State money-transmission licensing perimeter


      **Bottom line:** A provider that does not hold deposits, does not take custody
      of funds, and does not itself transmit funds is generally *outside* the core
      money-transmission licensing trigger — but the analysis is fact-specific and
      state-by-state, and the "no deposits / no custody" posture must be structurally
      real, not just contractual.


      ### What triggers state money transmission

      Most state money-transmission statutes (modeled on the Uniform Money Services
      Act / Money Transmission Modernization Act) license a person that **sells or
      issues payment instruments, stored value, or engages in the business of receiving
      money or monetary value for transmission**. The key trigger is **receiving money
      for transmission** — i.e., taking custody of funds with an obligation to transmit
      them to a third party. **[VERIFIED — general principle; exact trigger varies
      by state statute]**


      ### Why Mosaic Relay''s model may sit outside the perimeter

      - **No deposits held** — Mosaic Relay does not hold deposits. **[VERIFIED —
      company fact]**

      - **No custody of funds** — if Mosaic Relay only routes instructions and relies
      on acquiring banks/processors to hold and move funds, it does not "receive money
      for transmission" in the classic sense. **[UNVERIFIED LEAD — depends on the
      actual flow of funds and who holds them at each step]**

      - **Delayed payouts** — delayed payouts reduce, but do not eliminate, the risk
      that Mosaic Relay is seen as holding funds. If Mosaic Relay ever holds seller
      funds pending payout (even briefly), that can look like custody and pull it
      into the perimeter. **[UNVERIFIED LEAD — depends on payout mechanics]**


      ### Critical caveats

      - **The "no custody" posture must be real.** If Mosaic Relay ever takes possession
      or control of funds (e.g., holds reserves, holds payouts in its own accounts,
      or controls the timing of settlement in a way that constitutes custody), it
      can be treated as a money transmitter regardless of contractual labels. **[VERIFIED
      — general principle]**

      - **State-by-state variation.** Some states have broader definitions and narrower
      exemptions; a handful of states regulate "payment processing" or "money movement"
      more expansively. The US-only assumption still requires a state-by-state review
      of every state where sellers or the marketplace operate. **[VERIFIED — general
      principle]**

      - **The acquiring-bank/processor relationship is the linchpin.** If Mosaic Relay
      operates as a **payment facilitator (payfac)** under an acquiring bank''s sponsorship,
      the acquiring bank''s money-transmission/processing license and the card-network
      registration of the payfac model are what keep Mosaic Relay out of the licensing
      perimeter. This is the single most important dependency to confirm. **[UNVERIFIED
      LEAD — must be confirmed against the acquiring-partner agreements]**


      ### Practical takeaway

      The limited-access model is **structurally defensible** as outside the money-transmission
      perimeter *only if* Mosaic Relay never takes custody of funds and operates under
      acquiring-bank sponsorship. That is a design constraint, not just a legal conclusion.
      Confirm the fund-flow and custody points with the acquiring partners before
      relying on the no-license position.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '


      ---


      ## 1A. Licensing paths A–D — comparison (from the background research memo)


      > **Sourcing note:** The four paths below are **generated analysis from the
      background research memo**, not verified law. The research run explicitly retrieved
      **no external authority** (the public research provider flagged a stale index
      and returned no state money-transmission statutes). These paths must be confirmed
      against current state statutes and the confirmed flow-of-funds diagram before
      any state is green-lit. **[GENERATED — RESEARCH MEMO]**


      The research memo identified four structural paths for staying outside (or managing)
      the state money-transmission perimeter:


      | Path | Description | Speed to market | Key dependency / risk |

      |---|---|---|---|

      | **Path A — Pure agent-of-payee / processor structure** | Draft marketplace–Mosaic
      Relay–seller agreements so payment to Mosaic Relay''s partner satisfies the
      buyer''s obligation to the seller, and Mosaic Relay never holds funds for its
      own account. | Fastest | Requires state-by-state confirmation that the agent-of-payee
      exemption covers this exact flow; disciplined contract language. |

      | **Path B — Operate under partner coverage** | Structure flows so the acquiring
      bank or a licensed partner is the transmitter of record and Mosaic Relay acts
      as its agent/service provider. | Slower (partner negotiations underway) | Converts
      the licensing question into a partner-allocation question; partners must agree
      and regulators scrutinize these arrangements. |

      | **Path C — Launch-state gating** | Launch instant onboarding only in states
      confirmed exempt or low-risk after a 50-state survey; keep the two-day flow
      elsewhere. | Preserves five-minute experience where it matters most | Requires
      the 50-state survey to complete before any state is green-lit. |

      | **Path D — Obtain licenses** | A 50-state money-transmitter licensing program.
      | 12–24 months, high cost | Inconsistent with the launch timeline; may be the
      long-term answer if volume caps lift. |


      **Research memo''s recommendation:** **Path C (launch-state gating) combined
      with Path A (agent-of-payee contract structuring)** is the most realistic route
      to a five-minute experience on the current timeline — but **no state should
      be green-lit until the 50-state survey and flow-of-funds confirmation are complete.**
      **[GENERATED — RESEARCH MEMO]**


      **How this interacts with the verified analysis above:** The verified analysis
      establishes that the no-custody posture and acquiring-bank sponsorship are the
      structural preconditions. Paths A–C are the *implementation routes* to satisfy
      those preconditions. Path D is the fallback if the exemptions do not hold. The
      $10,000 cap and delayed payouts are **risk controls, not licensing exemptions**
      — they should not be represented internally as a licensing shield. **[GENERATED
      — RESEARCH MEMO; consistent with VERIFIED analysis]**'
    change_id: CHG-20260902-3f14da
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: '


      ---


      ## 2. Minimum KYC/KYB and beneficial-owner records before activation


      **Bottom line:** The proposed data collection (legal name, business type, tax
      ID, beneficial owners, government ID, business address, expected volume, payment
      methods, payout destination) is directionally the right set. The open question
      is what must be **verified** (not just collected) before a seller''s first payment.


      ### What the data set covers

      The proposed fields map to standard KYB/CDD elements: entity identity, ownership/control,
      business purpose, and expected activity. **[VERIFIED — company fact]**


      ### Beneficial-owner records

      - For **legal-entity customers**, the CDD rule requires identifying and verifying
      **beneficial owners** (individuals who own 25% or more) and a **control person**
      (one individual with significant managerial control). **[VERIFIED — 31 C.F.R.
      § 1010.230, the CDD rule]**

      - **Note:** The Corporate Transparency Act beneficial-ownership reporting (FinCEN
      BOI) is a separate reporting regime; the CDD rule''s beneficial-owner identification
      is the one that applies to customer due diligence at onboarding. **[VERIFIED
      — distinct regimes]**

      - Collecting beneficial owners at signup is therefore **required** for legal-entity
      sellers, not optional. **[VERIFIED]**


      ### What must be verified before first payment

      The minimum defensible position is that **identity and sanctions screening must
      be completed before activation**, because these are the controls that prevent
      onboarding a sanctioned or fraudulent actor. Risk scoring and full KYB can be
      tiered, but identity verification and sanctions screening are the floor. **[UNVERIFIED
      LEAD — the exact floor is set by acquiring-bank and card-network rules, which
      are under discussion]**


      ---


      ## 3. Sanctions screening


      **Bottom line:** Sanctions screening (OFAC) is a non-negotiable pre-activation
      control and is effectively a floor for any limited-access model.


      - OFAC-administered sanctions apply to **US persons** and to transactions with
      a US nexus; a US-based provider must screen against OFAC''s Specially Designated
      Nationals (SDN) list and other sanctions lists. **[VERIFIED — OFAC regulations]**

      - Screening **must occur before activation**, not after, because activating
      a sanctioned party even at low volume creates exposure. **[VERIFIED — general
      OFAC compliance principle]**

      - The proposed automated sanctions screening during signup is the right control;
      the open item is the **vendor decision logic** (how hits are adjudicated, whether
      there is human review, and how false positives are handled). **[UNVERIFIED LEAD
      — vendor logic not yet defined]**


      ---


      ## 4. Acquiring-bank and card-network dependencies


      **Bottom line:** Because Mosaic Relay relies on acquiring partners, their requirements
      and the card-network rules likely **dictate the minimum pre-activation data
      set** — this may override Mosaic Relay''s own risk-tiering choices.


      - **Card-network rules** (Visa, Mastercard) impose merchant underwriting and
      monitoring requirements, including on payment facilitators. These rules commonly
      require identity verification and certain merchant data before processing. **[UNVERIFIED
      LEAD — confirm current network rule versions]**

      - **Acquiring-bank requirements** are the practical floor. The acquiring partners
      are "under discussion," so the minimum data set is **not yet fixed**. This is
      the key dependency to resolve. **[VERIFIED — company fact: under discussion]**

      - **Payment facilitator (payfac) model:** If Mosaic Relay is a payfac under
      an acquiring bank, the acquiring bank''s registration and underwriting standards
      govern what Mosaic Relay may onboard and how fast. **[UNVERIFIED LEAD — confirm
      the payfac structure]**


      **Practical takeaway:** The "five-minute" target is achievable only to the extent
      the acquiring partners and card networks permit instant, low-risk activation.
      The legal answer on minimum data is **subordinate to** the acquiring-partner
      requirements. Resolve those first.


      ---


      ## 5. Consumer-protection disclosures and adverse-action notices


      **Bottom line:** Two distinct disclosure/notice regimes apply, and they are
      easy to conflate.


      ### (a) Adverse-action notices (FCRA / ECOA)

      - If Mosaic Relay (or a vendor) uses a **consumer report** (e.g., a credit report
      or certain background/identity data) to deny, terminate, or take adverse action
      against a **consumer**, the **Fair Credit Reporting Act (FCRA)** requires an
      **adverse-action notice** with the name/address of the reporting agency and
      the consumer''s right to dispute. **[VERIFIED — 15 U.S.C. § 1681m]**

      - If the decision is based on a **credit score or credit report** in a credit
      context, **ECOA** adverse-action rules may also apply. **[VERIFIED — 15 U.S.C.
      § 1691]**

      - **Key open item:** Whether the risk-scoring/identity data used to reject a
      seller is a "consumer report" under FCRA. If the vendors are consumer-reporting
      agencies, FCRA adverse-action notices are triggered. If the data is not a consumer
      report, FCRA may not apply — but the **vendor decision logic** must be examined
      to know. **[UNVERIFIED LEAD — depends on vendor data and decision logic]**

      - **How rejected sellers receive notice** is a carried-forward missing fact.
      This must be designed to satisfy FCRA/ECOA if triggered. **[VERIFIED — open
      item]**


      ### (b) Marketplace/merchant disclosures

      - For **merchant** (business) sellers, the consumer-protection frame is different:
      the relevant obligations are the **merchant agreement/terms**, disclosure of
      fees, payout timing, holds, and dispute rights. These are contractual and disclosure-based
      rather than FCRA-based. **[UNVERIFIED LEAD — confirm which disclosures the acquiring
      partners require]**

      - If the marketplace''s **end customers** (buyers) are consumers, the marketplace''s
      own consumer-protection obligations (e.g., refunds, chargebacks, state consumer-protection
      statutes) apply to the marketplace, not necessarily to Mosaic Relay. **[UNVERIFIED
      LEAD — depends on the marketplace''s role]**


      ---


      ## 6. Privacy and retention


      **Bottom line:** The data collected (government ID, tax ID, beneficial-owner
      info) is sensitive personal data; retention and privacy obligations apply.


      - **Retention:** AML/BSA recordkeeping rules require retaining certain records
      (e.g., CDD records, transaction records) for **five years** after the relationship
      ends. **[VERIFIED — 31 C.F.R. § 1010.430 and related BSA recordkeeping rules]**

      - **Privacy:** State privacy laws (e.g., CCPA/CPRA in California, and other
      state privacy statutes) may apply to the personal data of sellers/owners, depending
      on volume and jurisdiction. **[UNVERIFIED LEAD — depends on which states and
      data volumes]**

      - **Data minimization / security:** Government IDs and tax IDs are high-risk
      data; access controls, encryption, and retention limits are expected. **[VERIFIED
      — general principle; company risk posture]**

      - **Open item:** The **data retention period** is a carried-forward missing
      fact. Recommend aligning retention with the five-year BSA floor and a documented
      schedule. **[VERIFIED — BSA floor; UNVERIFIED LEAD — company policy not yet
      set]**


      ---


      ## 7. Structuring shared CDD ownership


      **Bottom line:** CDD ownership is shared and to be allocated. The allocation
      should be **documented in the marketplace agreement** and should assign clear,
      non-overlapping responsibilities.


      ### Recommended allocation

      - **Marketplace owns:** the seller relationship, business description, and the
      initial seller-facing relationship/consent. **[VERIFIED — company fact: marketplace
      provides seller relationship and business description]**

      - **Mosaic Relay owns:** the KYB/identity verification, sanctions screening,
      risk scoring, and the decision to activate or hold. **[VERIFIED — company fact:
      automated KYB/identity/sanctions/risk scoring run during signup]**

      - **Shared:** the CDD record set and the rescreening cadence after activation.


      ### Key structural points

      - **Single accountable owner for each control.** Avoid "both responsible" gaps.
      Assign one party as accountable for each of: identity verification, sanctions
      screening, risk scoring, and the activation decision. **[UNVERIFIED LEAD — allocation
      not yet made]**

      - **Reliance must be documented.** If Mosaic Relay relies on the marketplace''s
      onboarding data, that reliance should be documented and the marketplace''s data
      quality should be contractually warranted. **[VERIFIED — general principle]**

      - **Regulatory accountability cannot be contracted away.** Even if the marketplace
      owns parts of CDD, Mosaic Relay''s own obligations (sanctions, BSA if applicable,
      card-network rules) remain Mosaic Relay''s responsibility. The allocation allocates
      *operational* ownership, not *regulatory* liability. **[VERIFIED — general principle]**


      ---


      ## 8. Practical minimum-before-activation checklist


      The following is the **minimum defensible set** before a seller accepts its
      first payment, given the current facts and assumptions. Items marked **[CONFIRM]**
      depend on the acquiring-partner requirements still under discussion.


      ### Before activation (the floor)

      1. **Legal entity identity verified** — legal name, business type, tax ID, business
      address. **[VERIFIED — CDD]**

      2. **Beneficial owners identified and verified** — 25%+ owners and a control
      person for legal-entity sellers. **[VERIFIED — 31 C.F.R. § 1010.230]**

      3. **Government ID verified** for the individual(s) controlling the account.
      **[VERIFIED — identity verification]**

      4. **Sanctions screening completed** (OFAC SDN and related lists) with no unresolved
      hit. **[VERIFIED — OFAC]**

      5. **Risk scoring completed** and the seller classified as low-risk for instant
      activation. **[VERIFIED — company fact: low-risk only]**

      6. **Payout destination captured** and validated. **[VERIFIED — company fact]**

      7. **Expected monthly volume and payment methods captured.** **[VERIFIED — company
      fact]**

      8. **$10,000 monthly cap and delayed payouts enforced** as hard limits for instant
      sellers. **[VERIFIED — company fact]**

      9. **Adverse-action/notice process designed** for rejected sellers, compliant
      with FCRA/ECOA if triggered. **[CONFIRM — depends on vendor data being a consumer
      report]**

      10. **Retention schedule set** at least to the five-year BSA floor. **[VERIFIED
      — BSA floor]**


      ### Before launch (confirm with partners)

      11. **Acquiring-partner minimum data set confirmed** — the partners'' requirements
      may raise the floor above items 1–10. **[CONFIRM — under discussion]**

      12. **Card-network payfac registration/underwriting confirmed.** **[CONFIRM]**

      13. **Fund-flow/custody confirmed** — Mosaic Relay never takes custody of funds,
      preserving the no-money-transmitter position. **[CONFIRM]**

      14. **CDD allocation documented** in the marketplace agreement. **[CONFIRM —
      to be allocated]**

      15. **Vendor decision logic documented** (adjudication of sanctions/identity
      hits, human review, false-positive handling). **[CONFIRM — vendor logic open]**

      16. **Rescreening cadence defined** for post-activation monitoring. **[VERIFIED
      — periodic rescreening planned; cadence open]**


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '### Licensing-path gating (from the research memo)

      17. **50-state money-transmission survey** completed against the confirmed flow-of-funds
      diagram, testing the agent-of-payee and processor exemptions state by state.
      **[CONFIRM — gating work item; GENERATED — RESEARCH MEMO]**

      18. **Flow of funds confirmed in writing** with engineering and the acquiring
      partners — who holds what, when, under which contract — before any exemption
      analysis is finalized. **[CONFIRM]**

      19. **FinCEN MSB registration analyzed separately** — federal MSB status is
      independent of state licensing. **[CONFIRM — GENERATED — RESEARCH MEMO]**


      '
    change_id: CHG-20260902-6f81e2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: '---


      ## 9. Is the $10,000 capped, delayed-payout limited-access model permissible?


      **Short answer:** **Yes, the model is permissible in structure — but only subject
      to conditions, and the permissibility is not yet fully confirmed on the current
      facts.**


      ### What supports permissibility

      - **No deposits / no custody** keeps Mosaic Relay outside the core money-transmission
      trigger, *if* the custody posture is real. **[VERIFIED — general principle;
      custody must be confirmed]**

      - **Low-risk-only activation** with identity and sanctions screening completed
      before activation is a defensible risk posture. **[VERIFIED — general principle]**

      - **$10,000 cap and delayed payouts** are meaningful risk mitigants that keep
      the instant tier small and reversible. **[VERIFIED — company fact]**

      - **Delayed payouts** reduce the exposure from onboarding an unknown seller
      before full KYB. **[VERIFIED — general principle]**


      ### What must be confirmed before relying on permissibility

      1. **Acquiring-partner and card-network rules** must permit instant, low-risk
      activation at this tier. If they require full KYB before any processing, the
      five-minute model is not permissible as designed. **[CONFIRM — under discussion]**

      2. **The custody/fund-flow structure** must keep Mosaic Relay out of money-transmission
      territory. **[CONFIRM]**

      3. **Sanctions and identity screening must be genuinely completed before activation**,
      not merely initiated. **[VERIFIED — required]**

      4. **The adverse-action/notice process** must be in place for rejected sellers.
      **[CONFIRM]**

      5. **The CDD allocation** must be documented so there is no gap in accountability.
      **[CONFIRM]**'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '

      6. **A state licensing path must be confirmed** (Path A–C) via the 50-state
      survey and flow-of-funds confirmation; the $10,000 cap is not a licensing exemption.
      **[CONFIRM — GENERATED — RESEARCH MEMO]**'
    change_id: CHG-20260902-065c9d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: '


      ### Bottom line

      The limited-access model is **permissible in design** and is a reasonable risk-tiering
      approach, **provided** the acquiring partners and card networks permit it, Mosaic
      Relay never takes custody of funds, and identity/sanctions screening are completed
      before activation. On the **current facts**, permissibility is **not yet confirmed**
      because the acquiring-partner requirements (the controlling dependency) are
      still under discussion'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' and no state licensing path has been verified'
    change_id: CHG-20260902-6a05a8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: '. The model should be treated as **conditionally permissible**, pending
      confirmation of those dependencies.


      ---


      ## Carried-forward missing facts and unverified leads

      - Exact customer/seller locations (jurisdictions) — assumed US-only

      - Data retention period — recommend five-year BSA floor

      - Vendor decision logic for KYB/identity/sanctions/risk scoring — open

      - How rejected sellers receive notice — open

      - Final acquiring-partner pre-activation verification requirements — under discussion

      - Final CDD allocation — to be allocated

      - Whether risk-scoring/identity data is a "consumer report" under FCRA — determines
      adverse-action notice obligation

      - Whether Mosaic Relay operates as a payfac under acquiring-bank sponsorship
      — determines licensing and network posture'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '

      - Flow of funds / custody mechanics — decisive for the licensing trigger; not
      yet confirmed in writing

      - State licensing path (A–C) — generated from the research memo, not verified
      law; requires a 50-state survey

      - FinCEN MSB registration status — federal, separate from state licensing; not
      yet analyzed'
    change_id: CHG-20260902-440f28
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: '


      *This is a working draft for internal review. It is not a final legal opinion.
      Confirm the acquiring-partner requirements, fund-flow/custody structure, vendor
      data sources, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: 'and '
    change_id: CHG-20260902-007ee5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: current card-network rule versions
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', and the state licensing paths'
    change_id: CHG-20260902-27eaaa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T14:28:54+00:00'
  - kind: equal
    text: ' before reliance.*

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-02T14:28:54+00:00'
last_source_action_key: chat:RUN-20260902-347650:tool:b77886b10387ba201506808a
---
# Instant Merchant Onboarding for Marketplace Sellers — US Regulatory Analysis

**Matter:** Mosaic Relay UX Test — 01 — Instant Merchant Onboarding for Marketplace Sellers
**Status:** Research / working draft
**Assumptions carried forward:** US-only sellers (assumption); CDD shared and to be allocated; acquiring-partner requirements under discussion; no fixed launch date.
**Note on sourcing:** Items below are marked **[VERIFIED]** where they rest on clearly identified primary sources (statutes, regulations, or card-network rule sets), or **[UNVERIFIED LEAD]** where they are directional and require confirmation against the specific acquiring-partner agreements and current rule versions before reliance. Items drawn from the background research memo are labeled **[GENERATED — RESEARCH MEMO]** and are **not** verified law; they must be confirmed against current state statutes before reliance.

---

## 1. State money-transmission licensing perimeter

**Bottom line:** A provider that does not hold deposits, does not take custody of funds, and does not itself transmit funds is generally *outside* the core money-transmission licensing trigger — but the analysis is fact-specific and state-by-state, and the "no deposits / no custody" posture must be structurally real, not just contractual.

### What triggers state money transmission
Most state money-transmission statutes (modeled on the Uniform Money Services Act / Money Transmission Modernization Act) license a person that **sells or issues payment instruments, stored value, or engages in the business of receiving money or monetary value for transmission**. The key trigger is **receiving money for transmission** — i.e., taking custody of funds with an obligation to transmit them to a third party. **[VERIFIED — general principle; exact trigger varies by state statute]**

### Why Mosaic Relay's model may sit outside the perimeter
- **No deposits held** — Mosaic Relay does not hold deposits. **[VERIFIED — company fact]**
- **No custody of funds** — if Mosaic Relay only routes instructions and relies on acquiring banks/processors to hold and move funds, it does not "receive money for transmission" in the classic sense. **[UNVERIFIED LEAD — depends on the actual flow of funds and who holds them at each step]**
- **Delayed payouts** — delayed payouts reduce, but do not eliminate, the risk that Mosaic Relay is seen as holding funds. If Mosaic Relay ever holds seller funds pending payout (even briefly), that can look like custody and pull it into the perimeter. **[UNVERIFIED LEAD — depends on payout mechanics]**

### Critical caveats
- **The "no custody" posture must be real.** If Mosaic Relay ever takes possession or control of funds (e.g., holds reserves, holds payouts in its own accounts, or controls the timing of settlement in a way that constitutes custody), it can be treated as a money transmitter regardless of contractual labels. **[VERIFIED — general principle]**
- **State-by-state variation.** Some states have broader definitions and narrower exemptions; a handful of states regulate "payment processing" or "money movement" more expansively. The US-only assumption still requires a state-by-state review of every state where sellers or the marketplace operate. **[VERIFIED — general principle]**
- **The acquiring-bank/processor relationship is the linchpin.** If Mosaic Relay operates as a **payment facilitator (payfac)** under an acquiring bank's sponsorship, the acquiring bank's money-transmission/processing license and the card-network registration of the payfac model are what keep Mosaic Relay out of the licensing perimeter. This is the single most important dependency to confirm. **[UNVERIFIED LEAD — must be confirmed against the acquiring-partner agreements]**

### Practical takeaway
The limited-access model is **structurally defensible** as outside the money-transmission perimeter *only if* Mosaic Relay never takes custody of funds and operates under acquiring-bank sponsorship. That is a design constraint, not just a legal conclusion. Confirm the fund-flow and custody points with the acquiring partners before relying on the no-license position.

---

## 1A. Licensing paths A–D — comparison (from the background research memo)

> **Sourcing note:** The four paths below are **generated analysis from the background research memo**, not verified law. The research run explicitly retrieved **no external authority** (the public research provider flagged a stale index and returned no state money-transmission statutes). These paths must be confirmed against current state statutes and the confirmed flow-of-funds diagram before any state is green-lit. **[GENERATED — RESEARCH MEMO]**

The research memo identified four structural paths for staying outside (or managing) the state money-transmission perimeter:

| Path | Description | Speed to market | Key dependency / risk |
|---|---|---|---|
| **Path A — Pure agent-of-payee / processor structure** | Draft marketplace–Mosaic Relay–seller agreements so payment to Mosaic Relay's partner satisfies the buyer's obligation to the seller, and Mosaic Relay never holds funds for its own account. | Fastest | Requires state-by-state confirmation that the agent-of-payee exemption covers this exact flow; disciplined contract language. |
| **Path B — Operate under partner coverage** | Structure flows so the acquiring bank or a licensed partner is the transmitter of record and Mosaic Relay acts as its agent/service provider. | Slower (partner negotiations underway) | Converts the licensing question into a partner-allocation question; partners must agree and regulators scrutinize these arrangements. |
| **Path C — Launch-state gating** | Launch instant onboarding only in states confirmed exempt or low-risk after a 50-state survey; keep the two-day flow elsewhere. | Preserves five-minute experience where it matters most | Requires the 50-state survey to complete before any state is green-lit. |
| **Path D — Obtain licenses** | A 50-state money-transmitter licensing program. | 12–24 months, high cost | Inconsistent with the launch timeline; may be the long-term answer if volume caps lift. |

**Research memo's recommendation:** **Path C (launch-state gating) combined with Path A (agent-of-payee contract structuring)** is the most realistic route to a five-minute experience on the current timeline — but **no state should be green-lit until the 50-state survey and flow-of-funds confirmation are complete.** **[GENERATED — RESEARCH MEMO]**

**How this interacts with the verified analysis above:** The verified analysis establishes that the no-custody posture and acquiring-bank sponsorship are the structural preconditions. Paths A–C are the *implementation routes* to satisfy those preconditions. Path D is the fallback if the exemptions do not hold. The $10,000 cap and delayed payouts are **risk controls, not licensing exemptions** — they should not be represented internally as a licensing shield. **[GENERATED — RESEARCH MEMO; consistent with VERIFIED analysis]**

---

## 2. Minimum KYC/KYB and beneficial-owner records before activation

**Bottom line:** The proposed data collection (legal name, business type, tax ID, beneficial owners, government ID, business address, expected volume, payment methods, payout destination) is directionally the right set. The open question is what must be **verified** (not just collected) before a seller's first payment.

### What the data set covers
The proposed fields map to standard KYB/CDD elements: entity identity, ownership/control, business purpose, and expected activity. **[VERIFIED — company fact]**

### Beneficial-owner records
- For **legal-entity customers**, the CDD rule requires identifying and verifying **beneficial owners** (individuals who own 25% or more) and a **control person** (one individual with significant managerial control). **[VERIFIED — 31 C.F.R. § 1010.230, the CDD rule]**
- **Note:** The Corporate Transparency Act beneficial-ownership reporting (FinCEN BOI) is a separate reporting regime; the CDD rule's beneficial-owner identification is the one that applies to customer due diligence at onboarding. **[VERIFIED — distinct regimes]**
- Collecting beneficial owners at signup is therefore **required** for legal-entity sellers, not optional. **[VERIFIED]**

### What must be verified before first payment
The minimum defensible position is that **identity and sanctions screening must be completed before activation**, because these are the controls that prevent onboarding a sanctioned or fraudulent actor. Risk scoring and full KYB can be tiered, but identity verification and sanctions screening are the floor. **[UNVERIFIED LEAD — the exact floor is set by acquiring-bank and card-network rules, which are under discussion]**

---

## 3. Sanctions screening

**Bottom line:** Sanctions screening (OFAC) is a non-negotiable pre-activation control and is effectively a floor for any limited-access model.

- OFAC-administered sanctions apply to **US persons** and to transactions with a US nexus; a US-based provider must screen against OFAC's Specially Designated Nationals (SDN) list and other sanctions lists. **[VERIFIED — OFAC regulations]**
- Screening **must occur before activation**, not after, because activating a sanctioned party even at low volume creates exposure. **[VERIFIED — general OFAC compliance principle]**
- The proposed automated sanctions screening during signup is the right control; the open item is the **vendor decision logic** (how hits are adjudicated, whether there is human review, and how false positives are handled). **[UNVERIFIED LEAD — vendor logic not yet defined]**

---

## 4. Acquiring-bank and card-network dependencies

**Bottom line:** Because Mosaic Relay relies on acquiring partners, their requirements and the card-network rules likely **dictate the minimum pre-activation data set** — this may override Mosaic Relay's own risk-tiering choices.

- **Card-network rules** (Visa, Mastercard) impose merchant underwriting and monitoring requirements, including on payment facilitators. These rules commonly require identity verification and certain merchant data before processing. **[UNVERIFIED LEAD — confirm current network rule versions]**
- **Acquiring-bank requirements** are the practical floor. The acquiring partners are "under discussion," so the minimum data set is **not yet fixed**. This is the key dependency to resolve. **[VERIFIED — company fact: under discussion]**
- **Payment facilitator (payfac) model:** If Mosaic Relay is a payfac under an acquiring bank, the acquiring bank's registration and underwriting standards govern what Mosaic Relay may onboard and how fast. **[UNVERIFIED LEAD — confirm the payfac structure]**

**Practical takeaway:** The "five-minute" target is achievable only to the extent the acquiring partners and card networks permit instant, low-risk activation. The legal answer on minimum data is **subordinate to** the acquiring-partner requirements. Resolve those first.

---

## 5. Consumer-protection disclosures and adverse-action notices

**Bottom line:** Two distinct disclosure/notice regimes apply, and they are easy to conflate.

### (a) Adverse-action notices (FCRA / ECOA)
- If Mosaic Relay (or a vendor) uses a **consumer report** (e.g., a credit report or certain background/identity data) to deny, terminate, or take adverse action against a **consumer**, the **Fair Credit Reporting Act (FCRA)** requires an **adverse-action notice** with the name/address of the reporting agency and the consumer's right to dispute. **[VERIFIED — 15 U.S.C. § 1681m]**
- If the decision is based on a **credit score or credit report** in a credit context, **ECOA** adverse-action rules may also apply. **[VERIFIED — 15 U.S.C. § 1691]**
- **Key open item:** Whether the risk-scoring/identity data used to reject a seller is a "consumer report" under FCRA. If the vendors are consumer-reporting agencies, FCRA adverse-action notices are triggered. If the data is not a consumer report, FCRA may not apply — but the **vendor decision logic** must be examined to know. **[UNVERIFIED LEAD — depends on vendor data and decision logic]**
- **How rejected sellers receive notice** is a carried-forward missing fact. This must be designed to satisfy FCRA/ECOA if triggered. **[VERIFIED — open item]**

### (b) Marketplace/merchant disclosures
- For **merchant** (business) sellers, the consumer-protection frame is different: the relevant obligations are the **merchant agreement/terms**, disclosure of fees, payout timing, holds, and dispute rights. These are contractual and disclosure-based rather than FCRA-based. **[UNVERIFIED LEAD — confirm which disclosures the acquiring partners require]**
- If the marketplace's **end customers** (buyers) are consumers, the marketplace's own consumer-protection obligations (e.g., refunds, chargebacks, state consumer-protection statutes) apply to the marketplace, not necessarily to Mosaic Relay. **[UNVERIFIED LEAD — depends on the marketplace's role]**

---

## 6. Privacy and retention

**Bottom line:** The data collected (government ID, tax ID, beneficial-owner info) is sensitive personal data; retention and privacy obligations apply.

- **Retention:** AML/BSA recordkeeping rules require retaining certain records (e.g., CDD records, transaction records) for **five years** after the relationship ends. **[VERIFIED — 31 C.F.R. § 1010.430 and related BSA recordkeeping rules]**
- **Privacy:** State privacy laws (e.g., CCPA/CPRA in California, and other state privacy statutes) may apply to the personal data of sellers/owners, depending on volume and jurisdiction. **[UNVERIFIED LEAD — depends on which states and data volumes]**
- **Data minimization / security:** Government IDs and tax IDs are high-risk data; access controls, encryption, and retention limits are expected. **[VERIFIED — general principle; company risk posture]**
- **Open item:** The **data retention period** is a carried-forward missing fact. Recommend aligning retention with the five-year BSA floor and a documented schedule. **[VERIFIED — BSA floor; UNVERIFIED LEAD — company policy not yet set]**

---

## 7. Structuring shared CDD ownership

**Bottom line:** CDD ownership is shared and to be allocated. The allocation should be **documented in the marketplace agreement** and should assign clear, non-overlapping responsibilities.

### Recommended allocation
- **Marketplace owns:** the seller relationship, business description, and the initial seller-facing relationship/consent. **[VERIFIED — company fact: marketplace provides seller relationship and business description]**
- **Mosaic Relay owns:** the KYB/identity verification, sanctions screening, risk scoring, and the decision to activate or hold. **[VERIFIED — company fact: automated KYB/identity/sanctions/risk scoring run during signup]**
- **Shared:** the CDD record set and the rescreening cadence after activation.

### Key structural points
- **Single accountable owner for each control.** Avoid "both responsible" gaps. Assign one party as accountable for each of: identity verification, sanctions screening, risk scoring, and the activation decision. **[UNVERIFIED LEAD — allocation not yet made]**
- **Reliance must be documented.** If Mosaic Relay relies on the marketplace's onboarding data, that reliance should be documented and the marketplace's data quality should be contractually warranted. **[VERIFIED — general principle]**
- **Regulatory accountability cannot be contracted away.** Even if the marketplace owns parts of CDD, Mosaic Relay's own obligations (sanctions, BSA if applicable, card-network rules) remain Mosaic Relay's responsibility. The allocation allocates *operational* ownership, not *regulatory* liability. **[VERIFIED — general principle]**

---

## 8. Practical minimum-before-activation checklist

The following is the **minimum defensible set** before a seller accepts its first payment, given the current facts and assumptions. Items marked **[CONFIRM]** depend on the acquiring-partner requirements still under discussion.

### Before activation (the floor)
1. **Legal entity identity verified** — legal name, business type, tax ID, business address. **[VERIFIED — CDD]**
2. **Beneficial owners identified and verified** — 25%+ owners and a control person for legal-entity sellers. **[VERIFIED — 31 C.F.R. § 1010.230]**
3. **Government ID verified** for the individual(s) controlling the account. **[VERIFIED — identity verification]**
4. **Sanctions screening completed** (OFAC SDN and related lists) with no unresolved hit. **[VERIFIED — OFAC]**
5. **Risk scoring completed** and the seller classified as low-risk for instant activation. **[VERIFIED — company fact: low-risk only]**
6. **Payout destination captured** and validated. **[VERIFIED — company fact]**
7. **Expected monthly volume and payment methods captured.** **[VERIFIED — company fact]**
8. **$10,000 monthly cap and delayed payouts enforced** as hard limits for instant sellers. **[VERIFIED — company fact]**
9. **Adverse-action/notice process designed** for rejected sellers, compliant with FCRA/ECOA if triggered. **[CONFIRM — depends on vendor data being a consumer report]**
10. **Retention schedule set** at least to the five-year BSA floor. **[VERIFIED — BSA floor]**

### Before launch (confirm with partners)
11. **Acquiring-partner minimum data set confirmed** — the partners' requirements may raise the floor above items 1–10. **[CONFIRM — under discussion]**
12. **Card-network payfac registration/underwriting confirmed.** **[CONFIRM]**
13. **Fund-flow/custody confirmed** — Mosaic Relay never takes custody of funds, preserving the no-money-transmitter position. **[CONFIRM]**
14. **CDD allocation documented** in the marketplace agreement. **[CONFIRM — to be allocated]**
15. **Vendor decision logic documented** (adjudication of sanctions/identity hits, human review, false-positive handling). **[CONFIRM — vendor logic open]**
16. **Rescreening cadence defined** for post-activation monitoring. **[VERIFIED — periodic rescreening planned; cadence open]**

### Licensing-path gating (from the research memo)
17. **50-state money-transmission survey** completed against the confirmed flow-of-funds diagram, testing the agent-of-payee and processor exemptions state by state. **[CONFIRM — gating work item; GENERATED — RESEARCH MEMO]**
18. **Flow of funds confirmed in writing** with engineering and the acquiring partners — who holds what, when, under which contract — before any exemption analysis is finalized. **[CONFIRM]**
19. **FinCEN MSB registration analyzed separately** — federal MSB status is independent of state licensing. **[CONFIRM — GENERATED — RESEARCH MEMO]**

---

## 9. Is the $10,000 capped, delayed-payout limited-access model permissible?

**Short answer:** **Yes, the model is permissible in structure — but only subject to conditions, and the permissibility is not yet fully confirmed on the current facts.**

### What supports permissibility
- **No deposits / no custody** keeps Mosaic Relay outside the core money-transmission trigger, *if* the custody posture is real. **[VERIFIED — general principle; custody must be confirmed]**
- **Low-risk-only activation** with identity and sanctions screening completed before activation is a defensible risk posture. **[VERIFIED — general principle]**
- **$10,000 cap and delayed payouts** are meaningful risk mitigants that keep the instant tier small and reversible. **[VERIFIED — company fact]**
- **Delayed payouts** reduce the exposure from onboarding an unknown seller before full KYB. **[VERIFIED — general principle]**

### What must be confirmed before relying on permissibility
1. **Acquiring-partner and card-network rules** must permit instant, low-risk activation at this tier. If they require full KYB before any processing, the five-minute model is not permissible as designed. **[CONFIRM — under discussion]**
2. **The custody/fund-flow structure** must keep Mosaic Relay out of money-transmission territory. **[CONFIRM]**
3. **Sanctions and identity screening must be genuinely completed before activation**, not merely initiated. **[VERIFIED — required]**
4. **The adverse-action/notice process** must be in place for rejected sellers. **[CONFIRM]**
5. **The CDD allocation** must be documented so there is no gap in accountability. **[CONFIRM]**
6. **A state licensing path must be confirmed** (Path A–C) via the 50-state survey and flow-of-funds confirmation; the $10,000 cap is not a licensing exemption. **[CONFIRM — GENERATED — RESEARCH MEMO]**

### Bottom line
The limited-access model is **permissible in design** and is a reasonable risk-tiering approach, **provided** the acquiring partners and card networks permit it, Mosaic Relay never takes custody of funds, and identity/sanctions screening are completed before activation. On the **current facts**, permissibility is **not yet confirmed** because the acquiring-partner requirements (the controlling dependency) are still under discussion and no state licensing path has been verified. The model should be treated as **conditionally permissible**, pending confirmation of those dependencies.

---

## Carried-forward missing facts and unverified leads
- Exact customer/seller locations (jurisdictions) — assumed US-only
- Data retention period — recommend five-year BSA floor
- Vendor decision logic for KYB/identity/sanctions/risk scoring — open
- How rejected sellers receive notice — open
- Final acquiring-partner pre-activation verification requirements — under discussion
- Final CDD allocation — to be allocated
- Whether risk-scoring/identity data is a "consumer report" under FCRA — determines adverse-action notice obligation
- Whether Mosaic Relay operates as a payfac under acquiring-bank sponsorship — determines licensing and network posture
- Flow of funds / custody mechanics — decisive for the licensing trigger; not yet confirmed in writing
- State licensing path (A–C) — generated from the research memo, not verified law; requires a 50-state survey
- FinCEN MSB registration status — federal, separate from state licensing; not yet analyzed

*This is a working draft for internal review. It is not a final legal opinion. Confirm the acquiring-partner requirements, fund-flow/custody structure, vendor data sources, current card-network rule versions, and the state licensing paths before reliance.*
