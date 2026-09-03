---
work_product_id: WP-cedb2f531d31
matter_id: MAT-20260903-724266
title: US-only first-pass launch review — mobile-first marketplace seller onboarding
  flow
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T14:39:56+00:00'
updated_at: '2026-09-03T14:39:56+00:00'
immutable: false
source_action_key: chat:RUN-20260903-89d983:tool:185e95320393e01dcec71e80
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# US-only First-Pass Launch Review — Mobile-First Marketplace Seller Onboarding
      Flow


      **Matter:** Mosaic Relay UX Test — 01 — Marketplace Seller Onboarding Refresh

      **Scope:** US-only first-pass launch review. Target launch 2026-10-15.

      **Status:** Draft for legal review. All citations are **unverified leads** unless
      marked verified — no external authority was retrieved in the research run (external
      research timed out). Verify each authority before relying on it.


      ---


      ## Decision question


      What exact onboarding data, disclosures, review steps, approval rules, and responsibility
      split should legal approve before the 2026-10-15 launch of a US-only mobile-first
      marketplace seller onboarding flow that uses automatic approval for low-risk
      sellers and manual review for exceptions?


      ---


      ## 1. BSA/AML and KYC/KYB scope — which fields are necessary/proportionate


      **Analysis.** The Bank Secrecy Act (31 U.S.C. § 5311 et seq.) and FinCEN''s
      Customer Due Diligence (CDD) Rule (31 C.F.R. § 1010.230) require covered financial
      institutions to identify and verify beneficial owners of legal-entity customers
      at 25% ownership. Mosaic Relay is not a bank; whether it has AML program obligations
      depends on whether it is a money services business (MSB) or an agent of an MSB
      (AML program obligations under 31 C.F.R. § 1022.210).


      The proposed fields — legal name, business type, tax ID, ownership details,
      government ID, bank-account information, and business explanation — are generally
      consistent with CDD/KYB requirements. Necessity and proportionality of each
      field depend on the regulated actor''s risk assessment and the seller types
      served (mixed: individuals and entities).


      **Launch condition.** Collect only fields required by the applicable CDD/KYB
      standard for the seller type. For individual sellers, do not collect entity-only
      fields (ownership details, business tax ID) unless the seller is a legal entity.
      Document a field-by-field necessity rationale tied to the regulated actor''s
      risk assessment.


      **Sources (unverified leads):** 31 U.S.C. § 5311 et seq.; 31 C.F.R. § 1010.230;
      31 C.F.R. § 1022.210.


      ---


      ## 2. Money-transmission characterization — who is the regulated actor


      **Analysis.** Under FinCEN guidance (31 C.F.R. § 1010.100(ff)), money transmission
      includes accepting currency, funds, or other value and transmitting it to another
      location or person. State money-transmitter laws (e.g., California Money Transmission
      Act, New York MTL) may apply if Mosaic Relay or the marketplace holds or controls
      funds. The payout function — collecting bank-account information for seller
      payouts — triggers the money-transmission analysis.


      Three viable structures:'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '- **Path A — Mosaic Relay as service provider:** the marketplace is the
      MSB or agent of the acquiring bank; Mosaic Relay provides technology and KYC/KYB
      tools. Marketplace determines fields, provides notices, sets approval criteria,
      and owns retention.

      - **Path B — Mosaic Relay as regulated actor:** Mosaic Relay is the MSB or agent
      of the acquiring bank; it determines fields under its AML program, provides
      KYC/payments notices, sets and executes approval, and owns retention. Requires
      state money-transmitter licenses or a bank partnership.

      - **Path C — Shared (hybrid):** Mosaic Relay handles payments/KYC; the marketplace
      handles the seller relationship and non-payments compliance. Mosaic Relay collects
      KYC/KYB data and provides KYC/payments notices; the marketplace collects seller-facing
      data and provides seller-facing disclosures. Joint manual review for exceptions.


      The recorded fact is a **shared split** (Mosaic Relay handles payments/KYC;
      marketplace handles seller relationship). This aligns with Path C but the regulated-actor
      question is **not yet resolved** — it depends on which party actually holds
      or controls funds and which is the MSB/agent.


      **Launch condition.** Confirm in the marketplace agreement and acquiring-bank
      contract which party is the MSB or agent and which holds/controls funds. If
      Mosaic Relay holds or controls funds, it needs state money-transmitter licenses
      or a bank partnership before launch. Do not launch the payout function until
      the regulated actor is confirmed.


      **Sources (unverified leads):** 31 C.F.R. § 1010.100(ff); California Money Transmission
      Act; New York MTL.


      ---


      ## 3. Sanctions and adverse-media screening


      **Analysis.** OFAC regulations (31 C.F.R. Parts 500–598) prohibit dealings with
      sanctioned persons and jurisdictions. Screening sellers against OFAC lists and
      adverse media is a standard component of a risk-based AML program. The proposed
      automatic approval must include sanctions screening **before** approval; any
      hit must route to manual review.


      **Launch condition.** Sanctions and adverse-media screening must run at onboarding
      and on an ongoing basis. Any sanctions hit, adverse-media hit, or identity/ownership
      mismatch routes to trained manual review — never automatic approval. Document
      the screening responsibility split (Mosaic Relay vs. marketplace) in the agreement.


      **Sources (unverified leads):** 31 C.F.R. Parts 500–598.


      ---


      ## 4. Consumer-protection and adverse-action concerns (auto-approval vs. manual
      review)


      **Analysis.** ECOA/Reg B (12 C.F.R. § 1002) and FCRA (15 U.S.C. § 1681 et seq.)
      apply if the marketplace or Mosaic Relay is a creditor or uses consumer reports.
      Automatic approval based on proprietary risk scores may trigger adverse-action
      notice requirements if a seller is denied or receives less-favorable terms.
      State laws (e.g., California''s Unruh Act, New York fair-lending laws) may impose
      additional notice or explanation requirements.


      **Key fork:** If the flow uses third-party data or consumer reports, FCRA adverse-action
      notices are required. If it uses only proprietary data, ECOA/Reg B may still
      require specific reasons for denial or less-favorable terms.


      **Launch condition.** Define the exact "low-risk" criteria for automatic approval
      and the exception criteria for manual review, including data sources, thresholds,
      and escalation paths. Prepare an adverse-action notice process for any denial
      or less-favorable treatment. If third-party consumer reports are used, comply
      with FCRA adverse-action and permissible-purpose requirements.


      **Sources (unverified leads):** 12 C.F.R. § 1002; 15 U.S.C. § 1681 et seq.;
      California Unruh Act; New York fair-lending laws.


      ---


      ## 5. Privacy and data minimization for government ID and bank-account data


      **Analysis.** Collecting government ID and bank-account data implicates state
      privacy laws (e.g., CCPA/CPRA, Virginia CDPA, Colorado CPA) and GLBA if the
      data is nonpublic personal information. Data-minimization principles require
      collecting only what is necessary for the stated purpose, and disclosing the
      purpose, retention period, and sharing practices.


      **Launch condition.** Provide a privacy notice at or before collection. If Mosaic
      Relay is a service provider, the marketplace''s privacy policy must cover the
      collection; if Mosaic Relay is a controller, it must provide its own notice.
      Limit collection to fields necessary for the stated purpose and the seller type.


      **Sources (unverified leads):** CCPA/CPRA; Virginia CDPA; Colorado CPA; GLBA.


      ---


      ## 6. Retention periods


      **Analysis.** BSA requires retention of CDD records for five years after the
      account closes (31 C.F.R. § 1010.230(d)). State money-transmitter laws may impose
      longer periods. Privacy laws require retention only as long as necessary for
      the disclosed purpose. The recorded fact — "the regulatory minimum required
      by applicable law" — is correct but must be operationalized into a schedule.


      **Launch condition.** Build a retention schedule specifying which law applies
      to which data element (CDD records, government ID, bank-account data, business
      explanation) and who is responsible for deletion. Assign deletion responsibility
      in the agreement. Do not retain longer than the regulatory minimum unless a
      specific law requires it.


      **Sources (unverified leads):** 31 C.F.R. § 1010.230(d); applicable state money-transmitter
      and privacy laws.


      ---


      ## 7. Disclosure requirements and which party provides notices


      **Analysis.** Required notices may include: (a) KYC/KYB collection notice; (b)
      privacy notice; (c) adverse-action notice; (d) funds-flow and payout terms;
      (e) sanctions-screening consent. The recorded fact is a **shared split**: Mosaic
      Relay provides KYC/payments notices; the marketplace provides seller-facing
      disclosures.


      **Launch condition.** Document the notice allocation in the marketplace agreement
      and reflect it in the flow''s UX. If the marketplace is the regulated actor,
      it must provide the notices; if Mosaic Relay is the regulated actor, it must
      provide them. Confirm each required notice is delivered at the correct point
      in the flow (at or before collection for privacy; on denial for adverse action;
      before payout for funds-flow terms).


      **Sources (unverified leads):** as identified in sections 1–6 above.


      ---


      ## 8. Beneficial-owner (UBO) treatment at 25% FinCEN CDD threshold


      **Analysis.** The CDD Rule requires identifying each beneficial owner who owns
      25% or more of a legal-entity customer. The recorded fact is a **25% threshold
      (US FinCEN CDD standard)**. The flow collects ownership details, which is consistent.
      However, the rule applies to covered financial institutions; if Mosaic Relay
      is not covered, the marketplace or its bank may be responsible.


      **Launch condition.** Apply the 25% ownership threshold for beneficial-owner
      collection on legal-entity sellers. Also capture **control persons** (e.g.,
      CEO, CFO) even if no owner reaches 25%. Confirm which party is the covered financial
      institution responsible for CDD collection.


      **Sources (unverified leads):** 31 C.F.R. § 1010.230.


      ---


      ## 9. Marketing claims about a 25% reduction in abandonment


      **Analysis.** FTC Act § 5 (15 U.S.C. § 45) prohibits deceptive claims. A claim
      of "25% reduction in abandonment" must be substantiated by competent and reliable
      evidence. If the claim is based on a pilot or projection, it must be qualified.


      **Launch condition.** Substantiate the 25% reduction claim with competent and
      reliable evidence before use in marketing materials. If the evidence is not
      available, frame the claim as a goal or projection, not a guarantee, or remove
      it.


      **Sources (unverified leads):** 15 U.S.C. § 45.


      ---


      ## Assumptions


      - **US-only geography:** The marketplace and all sellers are US-based. This
      is a pre-launch gate — do not expand beyond the US assumption without a jurisdictional
      review. If any seller is outside the US, EU GDPR, UK MLR, and Latin American
      AML laws may apply.

      - **Shared responsibility split:** Mosaic Relay handles payments/KYC; the marketplace
      handles the seller relationship. The regulated-actor question remains unresolved.

      - **25% UBO threshold:** US FinCEN CDD standard.

      - **Regulatory-minimum retention:** operationalized per data element.

      - **Shared notice split:** Mosaic Relay provides KYC/payments notices; marketplace
      provides seller-facing disclosures.


      ## Open questions


      1. **Geography:** In which specific states do the marketplace and its sellers
      operate, and do any sellers reside outside the US? (Pre-launch gate.)

      2. **Regulated actor:** Which party is the MSB or agent for money transmission
      — Mosaic Relay, the marketplace, or the acquiring bank/processor?

      3. **Risk criteria:** What are the exact risk criteria and data sources that
      define "low-risk" for automatic approval?

      4. **Retention schedule:** Which specific retention periods apply to each data
      element under BSA, state money-transmitter laws, and privacy laws?

      5. **Notice allocation:** Which party provides each required notice (KYC, privacy,
      adverse action, funds-flow) to sellers?


      ## What would change this


      - **Working assumption:** The marketplace and all sellers are US-based. If any
      seller is outside the US, the analysis expands to include EU GDPR, UK MLR, and
      Latin American AML laws, requiring additional fields, notices, and retention
      periods.

      - **Open fork:** Whether Mosaic Relay or the marketplace is the regulated actor.
      If Mosaic Relay is the regulated actor, it must obtain state money-transmitter
      licenses or partner with a bank; if the marketplace is the regulated actor,
      it must maintain the AML program and provide notices.

      - **Not examined:** The specific state money-transmitter laws of the states
      where the marketplace and sellers operate. The analysis assumes a general US
      framework but does not review individual state requirements.

      - **Not examined:** The marketplace''s existing AML program and licenses. The
      analysis assumes the marketplace may be a regulated actor but does not verify
      its current status.

      - **Not examined:** The acquiring bank''s or processor''s requirements. The
      analysis assumes Mosaic Relay coordinates partners but does not review the specific
      contractual obligations.

      - **Not examined (authority):** No external authority was retrieved in the research
      run (external research timed out). Every citation above is an **unverified lead**
      and must be verified before it carries the final answer.


      ---


      ## Source status


      - **Verified:** None. No external authority was retrieved.

      - **Unverified leads (verify before reliance):** 31 U.S.C. § 5311 et seq.; 31
      C.F.R. § 1010.230; 31 C.F.R. § 1022.210; 31 C.F.R. § 1010.100(ff); 31 C.F.R.
      Parts 500–598; 12 C.F.R. § 1002; 15 U.S.C. § 1681 et seq.; 15 U.S.C. § 45; California
      Money Transmission Act; California Unruh Act; New York MTL; New York fair-lending
      laws; CCPA/CPRA; Virginia CDPA; Colorado CPA; GLBA.

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
# US-only First-Pass Launch Review — Mobile-First Marketplace Seller Onboarding Flow

**Matter:** Mosaic Relay UX Test — 01 — Marketplace Seller Onboarding Refresh
**Scope:** US-only first-pass launch review. Target launch 2026-10-15.
**Status:** Draft for legal review. All citations are **unverified leads** unless marked verified — no external authority was retrieved in the research run (external research timed out). Verify each authority before relying on it.

---

## Decision question

What exact onboarding data, disclosures, review steps, approval rules, and responsibility split should legal approve before the 2026-10-15 launch of a US-only mobile-first marketplace seller onboarding flow that uses automatic approval for low-risk sellers and manual review for exceptions?

---

## 1. BSA/AML and KYC/KYB scope — which fields are necessary/proportionate

**Analysis.** The Bank Secrecy Act (31 U.S.C. § 5311 et seq.) and FinCEN's Customer Due Diligence (CDD) Rule (31 C.F.R. § 1010.230) require covered financial institutions to identify and verify beneficial owners of legal-entity customers at 25% ownership. Mosaic Relay is not a bank; whether it has AML program obligations depends on whether it is a money services business (MSB) or an agent of an MSB (AML program obligations under 31 C.F.R. § 1022.210).

The proposed fields — legal name, business type, tax ID, ownership details, government ID, bank-account information, and business explanation — are generally consistent with CDD/KYB requirements. Necessity and proportionality of each field depend on the regulated actor's risk assessment and the seller types served (mixed: individuals and entities).

**Launch condition.** Collect only fields required by the applicable CDD/KYB standard for the seller type. For individual sellers, do not collect entity-only fields (ownership details, business tax ID) unless the seller is a legal entity. Document a field-by-field necessity rationale tied to the regulated actor's risk assessment.

**Sources (unverified leads):** 31 U.S.C. § 5311 et seq.; 31 C.F.R. § 1010.230; 31 C.F.R. § 1022.210.

---

## 2. Money-transmission characterization — who is the regulated actor

**Analysis.** Under FinCEN guidance (31 C.F.R. § 1010.100(ff)), money transmission includes accepting currency, funds, or other value and transmitting it to another location or person. State money-transmitter laws (e.g., California Money Transmission Act, New York MTL) may apply if Mosaic Relay or the marketplace holds or controls funds. The payout function — collecting bank-account information for seller payouts — triggers the money-transmission analysis.

Three viable structures:

- **Path A — Mosaic Relay as service provider:** the marketplace is the MSB or agent of the acquiring bank; Mosaic Relay provides technology and KYC/KYB tools. Marketplace determines fields, provides notices, sets approval criteria, and owns retention.
- **Path B — Mosaic Relay as regulated actor:** Mosaic Relay is the MSB or agent of the acquiring bank; it determines fields under its AML program, provides KYC/payments notices, sets and executes approval, and owns retention. Requires state money-transmitter licenses or a bank partnership.
- **Path C — Shared (hybrid):** Mosaic Relay handles payments/KYC; the marketplace handles the seller relationship and non-payments compliance. Mosaic Relay collects KYC/KYB data and provides KYC/payments notices; the marketplace collects seller-facing data and provides seller-facing disclosures. Joint manual review for exceptions.

The recorded fact is a **shared split** (Mosaic Relay handles payments/KYC; marketplace handles seller relationship). This aligns with Path C but the regulated-actor question is **not yet resolved** — it depends on which party actually holds or controls funds and which is the MSB/agent.

**Launch condition.** Confirm in the marketplace agreement and acquiring-bank contract which party is the MSB or agent and which holds/controls funds. If Mosaic Relay holds or controls funds, it needs state money-transmitter licenses or a bank partnership before launch. Do not launch the payout function until the regulated actor is confirmed.

**Sources (unverified leads):** 31 C.F.R. § 1010.100(ff); California Money Transmission Act; New York MTL.

---

## 3. Sanctions and adverse-media screening

**Analysis.** OFAC regulations (31 C.F.R. Parts 500–598) prohibit dealings with sanctioned persons and jurisdictions. Screening sellers against OFAC lists and adverse media is a standard component of a risk-based AML program. The proposed automatic approval must include sanctions screening **before** approval; any hit must route to manual review.

**Launch condition.** Sanctions and adverse-media screening must run at onboarding and on an ongoing basis. Any sanctions hit, adverse-media hit, or identity/ownership mismatch routes to trained manual review — never automatic approval. Document the screening responsibility split (Mosaic Relay vs. marketplace) in the agreement.

**Sources (unverified leads):** 31 C.F.R. Parts 500–598.

---

## 4. Consumer-protection and adverse-action concerns (auto-approval vs. manual review)

**Analysis.** ECOA/Reg B (12 C.F.R. § 1002) and FCRA (15 U.S.C. § 1681 et seq.) apply if the marketplace or Mosaic Relay is a creditor or uses consumer reports. Automatic approval based on proprietary risk scores may trigger adverse-action notice requirements if a seller is denied or receives less-favorable terms. State laws (e.g., California's Unruh Act, New York fair-lending laws) may impose additional notice or explanation requirements.

**Key fork:** If the flow uses third-party data or consumer reports, FCRA adverse-action notices are required. If it uses only proprietary data, ECOA/Reg B may still require specific reasons for denial or less-favorable terms.

**Launch condition.** Define the exact "low-risk" criteria for automatic approval and the exception criteria for manual review, including data sources, thresholds, and escalation paths. Prepare an adverse-action notice process for any denial or less-favorable treatment. If third-party consumer reports are used, comply with FCRA adverse-action and permissible-purpose requirements.

**Sources (unverified leads):** 12 C.F.R. § 1002; 15 U.S.C. § 1681 et seq.; California Unruh Act; New York fair-lending laws.

---

## 5. Privacy and data minimization for government ID and bank-account data

**Analysis.** Collecting government ID and bank-account data implicates state privacy laws (e.g., CCPA/CPRA, Virginia CDPA, Colorado CPA) and GLBA if the data is nonpublic personal information. Data-minimization principles require collecting only what is necessary for the stated purpose, and disclosing the purpose, retention period, and sharing practices.

**Launch condition.** Provide a privacy notice at or before collection. If Mosaic Relay is a service provider, the marketplace's privacy policy must cover the collection; if Mosaic Relay is a controller, it must provide its own notice. Limit collection to fields necessary for the stated purpose and the seller type.

**Sources (unverified leads):** CCPA/CPRA; Virginia CDPA; Colorado CPA; GLBA.

---

## 6. Retention periods

**Analysis.** BSA requires retention of CDD records for five years after the account closes (31 C.F.R. § 1010.230(d)). State money-transmitter laws may impose longer periods. Privacy laws require retention only as long as necessary for the disclosed purpose. The recorded fact — "the regulatory minimum required by applicable law" — is correct but must be operationalized into a schedule.

**Launch condition.** Build a retention schedule specifying which law applies to which data element (CDD records, government ID, bank-account data, business explanation) and who is responsible for deletion. Assign deletion responsibility in the agreement. Do not retain longer than the regulatory minimum unless a specific law requires it.

**Sources (unverified leads):** 31 C.F.R. § 1010.230(d); applicable state money-transmitter and privacy laws.

---

## 7. Disclosure requirements and which party provides notices

**Analysis.** Required notices may include: (a) KYC/KYB collection notice; (b) privacy notice; (c) adverse-action notice; (d) funds-flow and payout terms; (e) sanctions-screening consent. The recorded fact is a **shared split**: Mosaic Relay provides KYC/payments notices; the marketplace provides seller-facing disclosures.

**Launch condition.** Document the notice allocation in the marketplace agreement and reflect it in the flow's UX. If the marketplace is the regulated actor, it must provide the notices; if Mosaic Relay is the regulated actor, it must provide them. Confirm each required notice is delivered at the correct point in the flow (at or before collection for privacy; on denial for adverse action; before payout for funds-flow terms).

**Sources (unverified leads):** as identified in sections 1–6 above.

---

## 8. Beneficial-owner (UBO) treatment at 25% FinCEN CDD threshold

**Analysis.** The CDD Rule requires identifying each beneficial owner who owns 25% or more of a legal-entity customer. The recorded fact is a **25% threshold (US FinCEN CDD standard)**. The flow collects ownership details, which is consistent. However, the rule applies to covered financial institutions; if Mosaic Relay is not covered, the marketplace or its bank may be responsible.

**Launch condition.** Apply the 25% ownership threshold for beneficial-owner collection on legal-entity sellers. Also capture **control persons** (e.g., CEO, CFO) even if no owner reaches 25%. Confirm which party is the covered financial institution responsible for CDD collection.

**Sources (unverified leads):** 31 C.F.R. § 1010.230.

---

## 9. Marketing claims about a 25% reduction in abandonment

**Analysis.** FTC Act § 5 (15 U.S.C. § 45) prohibits deceptive claims. A claim of "25% reduction in abandonment" must be substantiated by competent and reliable evidence. If the claim is based on a pilot or projection, it must be qualified.

**Launch condition.** Substantiate the 25% reduction claim with competent and reliable evidence before use in marketing materials. If the evidence is not available, frame the claim as a goal or projection, not a guarantee, or remove it.

**Sources (unverified leads):** 15 U.S.C. § 45.

---

## Assumptions

- **US-only geography:** The marketplace and all sellers are US-based. This is a pre-launch gate — do not expand beyond the US assumption without a jurisdictional review. If any seller is outside the US, EU GDPR, UK MLR, and Latin American AML laws may apply.
- **Shared responsibility split:** Mosaic Relay handles payments/KYC; the marketplace handles the seller relationship. The regulated-actor question remains unresolved.
- **25% UBO threshold:** US FinCEN CDD standard.
- **Regulatory-minimum retention:** operationalized per data element.
- **Shared notice split:** Mosaic Relay provides KYC/payments notices; marketplace provides seller-facing disclosures.

## Open questions

1. **Geography:** In which specific states do the marketplace and its sellers operate, and do any sellers reside outside the US? (Pre-launch gate.)
2. **Regulated actor:** Which party is the MSB or agent for money transmission — Mosaic Relay, the marketplace, or the acquiring bank/processor?
3. **Risk criteria:** What are the exact risk criteria and data sources that define "low-risk" for automatic approval?
4. **Retention schedule:** Which specific retention periods apply to each data element under BSA, state money-transmitter laws, and privacy laws?
5. **Notice allocation:** Which party provides each required notice (KYC, privacy, adverse action, funds-flow) to sellers?

## What would change this

- **Working assumption:** The marketplace and all sellers are US-based. If any seller is outside the US, the analysis expands to include EU GDPR, UK MLR, and Latin American AML laws, requiring additional fields, notices, and retention periods.
- **Open fork:** Whether Mosaic Relay or the marketplace is the regulated actor. If Mosaic Relay is the regulated actor, it must obtain state money-transmitter licenses or partner with a bank; if the marketplace is the regulated actor, it must maintain the AML program and provide notices.
- **Not examined:** The specific state money-transmitter laws of the states where the marketplace and sellers operate. The analysis assumes a general US framework but does not review individual state requirements.
- **Not examined:** The marketplace's existing AML program and licenses. The analysis assumes the marketplace may be a regulated actor but does not verify its current status.
- **Not examined:** The acquiring bank's or processor's requirements. The analysis assumes Mosaic Relay coordinates partners but does not review the specific contractual obligations.
- **Not examined (authority):** No external authority was retrieved in the research run (external research timed out). Every citation above is an **unverified lead** and must be verified before it carries the final answer.

---

## Source status

- **Verified:** None. No external authority was retrieved.
- **Unverified leads (verify before reliance):** 31 U.S.C. § 5311 et seq.; 31 C.F.R. § 1010.230; 31 C.F.R. § 1022.210; 31 C.F.R. § 1010.100(ff); 31 C.F.R. Parts 500–598; 12 C.F.R. § 1002; 15 U.S.C. § 1681 et seq.; 15 U.S.C. § 45; California Money Transmission Act; California Unruh Act; New York MTL; New York fair-lending laws; CCPA/CPRA; Virginia CDPA; Colorado CPA; GLBA.
