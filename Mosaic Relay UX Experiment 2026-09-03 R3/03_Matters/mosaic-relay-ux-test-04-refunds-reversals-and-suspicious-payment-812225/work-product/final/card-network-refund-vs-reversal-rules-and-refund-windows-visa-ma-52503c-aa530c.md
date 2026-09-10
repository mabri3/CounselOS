---
work_product_id: WP-9b395452503c
matter_id: MAT-20260903-812225
title: Consolidated First-Pass Legal Response — Self-Service Refund Tool
record_type: work_product
state: final
summary: ''
created_at: '2026-09-04T00:02:56+00:00'
updated_at: '2026-09-04T00:04:18+00:00'
immutable: true
source_action_key: chat:RUN-20260904-c3ad4e:tool:a224c90d2167ce39de56796c
recommendation_version_id: REC-20260904-9c0204
recommendation_snapshot: 'Launch the self-service refund tool in phases — card refunds
  first (original-source-only, no destination-changing overrides), then ACH, then
  local methods — with launch gates requiring: (1) confirmation that transaction-monitoring
  covers refunds/reversals (or building that coverage), (2) review of acquiring-partner/processor
  agreements, (3) confirmation of Mosaic Relay''s legal entity/licensing status and
  funds-flow model, (4) confirmation of per-partner refund windows, and (5) drafting
  merchant and payer disclosures. Treat any refund to a destination other than the
  original funding source as a high-risk exception requiring enhanced due diligence,
  monitoring-alert generation, and post-transaction review — or prohibit it outright.
  This is a working recommendation, not a durable decision.'
last_source_action_key: chat:RUN-20260904-b1e1ed:tool:c982bb8298d32daea933f5d6
review:
  segments:
  - kind: delete
    text: '# Card Network Refund vs. Reversal Rules and Refund Windows (Visa/Mastercard)


      **Matter:** Mosaic Relay UX Test — 04 — Refunds, Reversals, and Suspicious Payment
      Activity

      **Work product type:** Draft (issue-scoped)

      **Status:** Draft for review — based on a partial research packet; no external
      authority retrieved yet


      ---


      ## Purpose and scope


      This draft addresses one workstream of the self-service refund tool: how Visa
      and Mastercard rules distinguish refunds from reversals, what refund windows
      apply, and what that means for the tool''s design and controls. It is scoped
      to card network rules only. ACH, local payment methods, AML controls, disclosures,
      and recordkeeping are separate workstreams and are flagged but not resolved
      here.


      **Important framing:** The underlying research packet is an issue-spotting scaffold.
      No external authority (Visa Core Rules, Mastercard Rules, or the applicable
      acquiring-partner/processor agreements) was retrieved. The analysis below is
      based on general industry knowledge and must be verified against the controlling
      documents before it is relied on. The specific acquiring-partner and processor
      contracts are the controlling source for refund windows, permitted destinations,
      and liability allocation.


      ---


      ## 1. Refund vs. reversal: the core distinction


      Card networks treat these as different transaction types, and the tool must
      not conflate them:


      - **Authorization reversal (void).** Cancels an authorization *before* settlement.
      Time-limited — typically within hours or days of the original authorization.
      This is the cleanest way to undo a transaction before funds move, and it does
      not create a separate credit transaction.

      - **Refund / credit.** A separate transaction that returns funds *after* settlement.
      It must reference the original transaction and, under network rules, must generally
      be returned to the **same card** used in the original purchase.


      The compliance point that matters most for this tool: **card network rules generally
      prohibit refunding to a different card or account than the one used for the
      original purchase.** This is simultaneously a network rule and an AML control.
      If the tool permits routing a refund to a different destination — even through
      a manual override — it risks violating network rules and creating money-laundering
      exposure.


      ---


      ## 2. Refund windows


      - Visa and Mastercard generally permit refunds for extended periods (often 120
      days or more from the original transaction), but the practical window depends
      on the acquiring bank''s policies and the specific card product. Some acquiring
      partners impose shorter windows.

      - The controlling windows are set by the **acquiring-partner and processor agreements**,
      not by a single public standard. These must be confirmed with each partner before
      launch.

      - **Partial refunds** are generally permitted, but each partial refund is typically
      a separate transaction that must reference the original transaction.


      ---


      ## 3. Design implications for the tool


      1. **Default to original-source-only refunds.** The tool should enforce that
      refunds return to the same card used in the original transaction. This aligns
      with network rules and is the strongest AML posture.

      2. **Treat "reversal" and "refund" as distinct flows.** The tool should route
      a pre-settlement cancellation through the authorization-reversal path and a
      post-settlement return through the refund/credit path, with different windows
      and controls for each.

      3. **Manual overrides must not change the refund destination.** The planned
      two-person approval and logging for closed-account overrides should be limited
      to processing a refund to the *original* source — not to authorizing a destination
      change. A destination change is a materially higher-risk action that should
      be treated as an exception requiring enhanced due diligence, monitoring-alert
      generation, and post-transaction review, if it is permitted at all.

      4. **Confirm windows per partner before launch.** Because windows vary by acquiring
      partner and card product, the tool should be configured against confirmed per-partner
      windows rather than a single hard-coded default.


      ---


      ## 4. What must be verified before this draft is relied on


      The following are the controlling documents and facts that this draft does not
      yet have:


      1. **Acquiring-partner and processor agreements** — the controlling source for
      refund windows, permitted destinations, liability allocation, and any restrictions
      on manual overrides. This is the most critical verification step.

      2. **Visa Core Rules and Mastercard Rules** — the specific refund and reversal
      provisions applicable to Mosaic Relay''s merchant category and transaction types.
      These are typically available to acquirers and their partners but are not fully
      public.

      3. **Mosaic Relay''s legal entity and licensing status** — whether it operates
      as a payment facilitator/technology provider under partner licenses or holds
      its own money transmitter licenses materially changes its direct obligations.

      4. **Funds-flow and settlement model** — whether Mosaic Relay touches funds
      in transit affects whether it has direct obligations or operates under partner
      licenses.

      5. **Whether the tool will allow destination changes at all** — this is the
      single most significant fork and should be decided explicitly, not by default.


      ---


      ## 5. Recommendation (draft)


      Launch the card-refund capability with a **hard default of original-source-only
      refunds**, with manual overrides limited to processing a refund to the original
      source (not changing the destination). Treat any destination change as a high-risk
      exception requiring enhanced due diligence, monitoring-alert generation, and
      post-transaction review — or prohibit it outright. Confirm per-partner refund
      windows and review the acquiring-partner/processor agreements and network rules
      before launch. Do not treat this draft as final until those documents are reviewed.


      ---


      ## What would change this


      - **Working assumption:** This analysis assumes Mosaic Relay operates as a payment
      facilitator or technology provider under partner licenses, not as a licensed
      money transmitter with direct regulatory obligations. If Mosaic Relay holds
      its own money transmitter licenses, it would have direct BSA/AML obligations
      for refund transactions, including potential SAR filing obligations for suspicious
      refund patterns, and this draft''s framing changes materially.

      - **Open fork:** Whether the tool will allow refunds to destinations other than
      the original funding source, even through manual override. If yes, the AML risk
      profile increases substantially and the tool may violate card network rules.
      If no, the tool is lower risk but may not handle all legitimate business cases.
      This decision should be made explicitly, not by default.

      - **Not examined:** The specific terms of Mosaic Relay''s acquiring-partner
      and processor contracts were not reviewed. These contracts are the controlling
      documents for refund windows, permitted destinations, and liability allocation.
      The analysis above is based on general industry knowledge, not the specific
      contractual terms that will govern this tool.

      - **Not examined:** The Visa Core Rules and Mastercard Rules were not retrieved
      (external research timed out). The specific refund and reversal provisions applicable
      to Mosaic Relay''s merchant category must be confirmed directly.

      - **Working assumption:** This analysis assumes the "manual operations overrides"
      for closed accounts are intended to process refunds to the original payer, not
      to change the refund destination. If the overrides are intended to allow destination
      changes, the risk profile is significantly higher and additional controls are
      needed.

      - **Not examined:** Whether Mosaic Relay''s existing transaction-monitoring
      system covers refunds and reversals is unknown. If it does not, the launch should
      be delayed until monitoring is in place. This is a separate workstream but is
      a launch gate for the card-refund capability.

      '
    change_id: CHG-20260904-2e408f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T00:04:18+00:00'
  - kind: insert
    text: '# Consolidated First-Pass Legal Response — Self-Service Refund Tool


      **Matter:** Mosaic Relay UX Test — 04 — Refunds, Reversals, and Suspicious Payment
      Activity

      **Work product type:** Draft (consolidated first-pass response)

      **Status:** Draft for review — based on partial research packets; **no external
      authority retrieved**


      ---


      ## How to read this document


      This is a consolidated first-pass legal response covering the full scope of
      the self-service refund tool: refund and reversal obligations for card, ACH,
      and local payment methods; AML and suspicious-activity indicators; customer
      disclosures; recordkeeping; controls against misuse; and when Mosaic Relay should
      delay, reject, or investigate a refund.


      Because the underlying research packets are issue-spotting scaffolds with **no
      external authority retrieved** (external research timed out), every substantive
      point below is labeled one of:


      - **Verified** — established by the matter facts or a confirmed internal source.

      - **Unverified lead** — general industry knowledge that must be confirmed against
      the controlling documents (network rules, acquiring-partner/processor contracts,
      statutes) before reliance.

      - **Assumption** — a fact the analysis leans on that is not established.

      - **Open question** — a question whose answer sends the matter down materially
      different paths.

      - **Recommendation** — the working recommendation, kept separate from any durable
      decision.


      No durable decision has been recorded. The working recommendation below is a
      draft for the lawyer to accept, modify, or reject.


      ---


      ## 1. Verified facts (from the matter record)


      - Mosaic Relay supports payment routing and merchant operations but **does not
      hold customer deposits**.

      - The tool would allow full or partial refunds across card, ACH, and local payment
      methods.

      - The tool would route refund funds back to the original payer **where possible**.

      - The tool would support manual operations overrides when a merchant account
      is closed.

      - Refund destination default: **original payer by default, with limited exceptions/overrides**.

      - Manual overrides (especially for closed accounts) require **two-person approval
      and are logged/audited**.

      - Operations has identified cases where a merchant may use refunds to move funds
      between unrelated cards or recipients.

      - Refund requests may arrive immediately after payment or months later.

      - Some payment methods may require separate reversal or return procedures.

      - **Not yet defined:** launch jurisdictions, refund windows by payment method,
      target launch timing, and whether existing transaction-monitoring covers refunds/reversals.


      ---


      ## 2. Refund vs. reversal obligations by payment method


      ### 2.1 Card (Visa/Mastercard) — Unverified lead (no authority retrieved)


      The core distinction the tool must not conflate:


      - **Authorization reversal (void).** Cancels an authorization *before* settlement.
      Time-limited (typically within hours or days of the original authorization).
      Does not create a separate credit transaction.

      - **Refund / credit.** A separate transaction returning funds *after* settlement.
      Must reference the original transaction and, under network rules, must generally
      return to the **same card** used in the original purchase.


      **The compliance point that matters most:** card network rules generally prohibit
      refunding to a different card or account than the one used for the original
      purchase. This is simultaneously a network rule and an AML control. If the tool
      permits routing a refund to a different destination — even through a manual
      override — it risks violating network rules and creating money-laundering exposure.


      **Refund windows.** Visa and Mastercard generally permit refunds for extended
      periods (often 120 days or more), but the practical window is set by the acquiring
      bank''s policies and card product, and ultimately by the **acquiring-partner
      and processor agreements**. These must be confirmed per partner before launch.
      Partial refunds are generally permitted, each as a separate transaction referencing
      the original.


      ### 2.2 ACH (US) — Unverified lead (no authority retrieved)


      ACH operates under Nacha rules, which distinguish three different flows the
      tool must treat separately:


      - **Reversals.** Permitted only for specific error conditions (duplicate entries,
      incorrect amount, incorrect account number) and generally must be initiated
      within **5 banking days** of settlement.

      - **Returns.** Initiated by the receiving bank (RDFI) under specific reason
      codes and timeframes. Unauthorized debit returns generally have a **60-day**
      window from settlement for consumer accounts; most other returns within **2
      banking days**.

      - **Refunds.** Not a formal Nacha concept. After the return window closes, returning
      funds generally requires a **new ACH credit entry** — a separate transaction,
      not a reversal or return.


      **Implication:** For ACH, the "refund" tool will in many cases be initiating
      new credit entries, which are effectively new payments with their own reconciliation,
      monitoring, and sanctions-screening considerations. The tool must distinguish
      true reversals (within the Nacha window), returns (RDFI-initiated), and new
      credit entries.


      ### 2.3 Local payment methods (UK/EU and others) — Unverified lead (no authority
      retrieved)


      Each local scheme has distinct rules; a one-size-fits-all refund model will
      not work:


      - **SEPA Credit Transfers:** generally irrevocable once executed; refunds require
      a new credit transfer in the opposite direction. Recalls possible within ~10
      working days for unauthorized transactions, with the beneficiary bank having
      ~15 working days to respond.

      - **SEPA Direct Debits:** consumer refund rights — ~8 weeks for authorized transactions,
      ~13 months for unauthorized.

      - **UK Faster Payments:** generally irrevocable once settled; refunds require
      a new payment.

      - **Pix (Brazil):** has specific refund mechanisms built into the system.


      **Implication:** The tool must be designed method-by-method, and the specific
      local methods supported at launch have not been identified. This is an open
      question that materially affects design and compliance.


      ---


      ## 3. AML and suspicious-activity indicators


      **Verified concern:** Operations has flagged refunds used to move funds between
      unrelated cards or recipients. This is a recognized money-laundering typology
      (refund laundering / layering).


      **Unverified lead — indicators to monitor (from research packet):**

      - Refunds to a different card or account than the original funding source.

      - High refund volume relative to transaction volume (refund ratio).

      - Refunds processed immediately after payout.

      - Refunds on closed or suspended accounts.

      - Patterns of partial refunds that aggregate to amounts just below reporting
      thresholds (structuring).

      - Refunds where the original payment was flagged for fraud or was from a high-risk
      jurisdiction.

      - Refund-after-payout scenarios, which create credit risk and potential AML
      exposure if the original payment was fraudulent.


      **Open question (launch gate):** Whether Mosaic Relay''s existing transaction-monitoring
      covers refunds and reversals is **unknown**. If it does not, refunds create
      a surveillance gap and the launch should be delayed until monitoring is in place.
      This is a factual question that must be resolved before launch, not after.


      **Assumption:** This analysis assumes Mosaic Relay operates as a payment facilitator/technology
      provider under partner licenses, not as a licensed money transmitter with direct
      BSA/AML obligations. If Mosaic Relay holds its own money transmitter licenses,
      it would have direct obligations for refund transactions, including potential
      SAR filing obligations for suspicious refund patterns.


      ---


      ## 4. Customer disclosures


      **Unverified lead (no authority retrieved):** Depending on jurisdiction, consumer
      protection laws impose refund-related requirements:

      - **US:** Regulation E (consumer ACH and debit card) and Regulation Z (credit
      card) error-resolution and dispute rights interact with refund processes; the
      FTC Act''s prohibition on unfair or deceptive practices applies to refund policies
      and disclosures.

      - **EU:** PSD2 and the Consumer Rights Directive impose refund rights and disclosure
      requirements; SEPA Direct Debit provides specific refund rights.

      - **UK:** Payment Services Regulations 2017 and Consumer Rights Act 2015 impose
      similar requirements.


      **Recommendation (draft):** Mosaic Relay should ensure merchant agreements and
      payer-facing disclosures clearly state refund policies, processing times, and
      the circumstances under which refunds may be delayed or rejected. These disclosures
      must be accurate about the tool''s capabilities and limitations.


      ---


      ## 5. Recordkeeping


      **Unverified lead (no authority retrieved):** BSA/AML recordkeeping applies
      to refund transactions. Mosaic Relay should maintain records of:

      - Original transaction details (amount, date, funding source, merchant).

      - Refund transaction details (amount, date, destination, reason).

      - Any overrides applied, including approver identities and justification.

      - Monitoring alerts generated and their disposition.

      - Communication with merchants regarding refunds.


      Card network rules also impose refund recordkeeping (often 12–24 months minimum,
      sometimes longer). BSA recordkeeping commonly requires 5-year retention for
      transactions over $3,000, including refund records. Nacha requires ACH return/reversal
      records with specific reason codes and timestamps. Local schemes vary (typically
      5–7 years in the EU).


      **Verified control already in place:** Manual overrides are logged/audited,
      which supports the recordkeeping requirement for overrides.


      ---


      ## 6. Controls against misuse


      **Verified controls already planned:** Original-payer default; two-person approval
      for overrides; overrides logged/audited.


      **Recommendation (draft) — additional controls:**

      1. **Hard original-source-only default** for card refunds, aligned with network
      rules.

      2. **Treat reversal and refund as distinct flows** with different windows and
      controls.

      3. **Manual overrides must not change the refund destination.** The planned
      two-person approval should be limited to processing a refund to the *original*
      source — not authorizing a destination change. A destination change is a materially
      higher-risk exception requiring enhanced due diligence, monitoring-alert generation,
      and post-transaction review, if permitted at all.

      4. **Refund-specific monitoring rules** distinct from payment monitoring (velocity
      limits per merchant/payer/funding source; refund-ratio alerts; mandatory delay
      for refunds to non-original sources).

      5. **Enhanced due diligence** for merchants with high refund volumes or ratios.

      6. **Confirm per-partner windows** and configure the tool against confirmed
      windows rather than a single hard-coded default.


      ---


      ## 7. When Mosaic Relay should delay, reject, or investigate a refund


      **Recommendation (draft):** Mosaic Relay should delay, reject, or investigate
      a refund when:

      - The refund destination differs from the original funding source (highest-risk
      indicator).

      - The refund is on a closed or suspended account (normal ongoing controls are
      absent).

      - The refund is requested immediately after payout.

      - The refund pattern suggests structuring (partial refunds aggregating just
      below thresholds).

      - The original payment was flagged for fraud or from a high-risk jurisdiction.

      - The refund would exceed the confirmed per-partner window for the method.


      In these cases, the refund should be held for review (e.g., 24–48 hours), escalated
      to the risk/compliance team, and processed only after investigation and, where
      applicable, dual approval. Where the pattern indicates potential money laundering,
      Mosaic Relay should consider whether a SAR is required (which depends on its
      licensing status — see assumptions).


      ---


      ## 8. Working recommendation (draft — not a durable decision)


      **Recommended path: phased launch with enhanced controls.**


      1. **Phase 1 — Card refunds only**, original-source-only, no destination-changing
      overrides. Card network rules are the clearest and original-source enforcement
      is most straightforward.

      2. **Phase 2 — ACH**, with separate monitoring rules and limited overrides with
      dual approval, after confirming Nacha windows and distinguishing reversals/returns/new
      credits.

      3. **Phase 3 — Local payment methods**, after jurisdiction-specific legal review
      and identification of the specific methods.


      **Launch gates before any phase:**

      - Confirm whether existing transaction-monitoring covers refunds/reversals;
      if not, build or procure that coverage before launch.

      - Obtain and review acquiring-partner and processor agreements (controlling
      source for windows, destinations, liability).

      - Confirm Mosaic Relay''s legal entity and licensing status and funds-flow/settlement
      model.

      - Confirm per-partner refund/return windows for each method.

      - Draft merchant-facing refund policy and payer-facing disclosures.


      **This is a working recommendation only.** It has not been accepted as a durable
      decision. The lawyer should decide the acceptable risk and the business path.


      ---


      ## What would change this (ranked)


      - **Open fork (highest impact):** Whether the tool will allow refunds to destinations
      other than the original funding source, even via manual override. If yes, the
      AML risk profile increases substantially and the tool may violate card network
      rules. If no, the tool is lower risk but may not handle all legitimate edge
      cases. This should be decided explicitly, not by default.

      - **Not examined:** The acquiring-partner and processor contracts — the controlling
      source for refund windows, permitted destinations, liability allocation, and
      any restrictions on manual overrides. These were identified as missing facts
      but not reviewed.

      - **Not examined:** The Visa Core Rules, Mastercard Rules, and Nacha rules were
      not retrieved (external research timed out). The specific provisions applicable
      to Mosaic Relay''s merchant category and transaction types must be confirmed
      directly.

      - **Working assumption:** Mosaic Relay operates as a payment facilitator/technology
      provider under partner licenses, not a licensed money transmitter. If it holds
      its own licenses, it has direct BSA/AML obligations including potential SAR
      filing, and the analysis changes materially.

      - **Open question:** Whether existing transaction-monitoring covers refunds/reversals
      is unknown. If it does not, launch should be delayed until monitoring is in
      place. This is a launch gate.

      - **Not examined:** The specific local payment methods to be supported at launch
      were not identified. Each local scheme (SEPA, Faster Payments, Pix, etc.) has
      distinct rules that materially affect design and compliance.

      - **Not examined:** Whether any state money transmitter statutes impose specific
      refund handling requirements beyond general BSA/AML obligations. The analysis
      assumed federal BSA compliance but did not verify state-by-state variations.

      '
    change_id: CHG-20260904-2e408f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T00:04:18+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-04T00:04:18+00:00'
final_id: FINAL-20260904-aa530c
finalized_at: '2026-09-04T00:05:16+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-04-refunds-reversals-and-suspicious-payment-812225/work-product/draft/card-network-refund-vs-reversal-rules-and-refund-windows-visa-ma-52503c.md
source_content_hash: 4fadb7825c539e9d36dba5a2a28b9f2b8e4cac029565a342d3b58a89e5359b64
---
# Consolidated First-Pass Legal Response — Self-Service Refund Tool

**Matter:** Mosaic Relay UX Test — 04 — Refunds, Reversals, and Suspicious Payment Activity
**Work product type:** Draft (consolidated first-pass response)
**Status:** Draft for review — based on partial research packets; **no external authority retrieved**

---

## How to read this document

This is a consolidated first-pass legal response covering the full scope of the self-service refund tool: refund and reversal obligations for card, ACH, and local payment methods; AML and suspicious-activity indicators; customer disclosures; recordkeeping; controls against misuse; and when Mosaic Relay should delay, reject, or investigate a refund.

Because the underlying research packets are issue-spotting scaffolds with **no external authority retrieved** (external research timed out), every substantive point below is labeled one of:

- **Verified** — established by the matter facts or a confirmed internal source.
- **Unverified lead** — general industry knowledge that must be confirmed against the controlling documents (network rules, acquiring-partner/processor contracts, statutes) before reliance.
- **Assumption** — a fact the analysis leans on that is not established.
- **Open question** — a question whose answer sends the matter down materially different paths.
- **Recommendation** — the working recommendation, kept separate from any durable decision.

No durable decision has been recorded. The working recommendation below is a draft for the lawyer to accept, modify, or reject.

---

## 1. Verified facts (from the matter record)

- Mosaic Relay supports payment routing and merchant operations but **does not hold customer deposits**.
- The tool would allow full or partial refunds across card, ACH, and local payment methods.
- The tool would route refund funds back to the original payer **where possible**.
- The tool would support manual operations overrides when a merchant account is closed.
- Refund destination default: **original payer by default, with limited exceptions/overrides**.
- Manual overrides (especially for closed accounts) require **two-person approval and are logged/audited**.
- Operations has identified cases where a merchant may use refunds to move funds between unrelated cards or recipients.
- Refund requests may arrive immediately after payment or months later.
- Some payment methods may require separate reversal or return procedures.
- **Not yet defined:** launch jurisdictions, refund windows by payment method, target launch timing, and whether existing transaction-monitoring covers refunds/reversals.

---

## 2. Refund vs. reversal obligations by payment method

### 2.1 Card (Visa/Mastercard) — Unverified lead (no authority retrieved)

The core distinction the tool must not conflate:

- **Authorization reversal (void).** Cancels an authorization *before* settlement. Time-limited (typically within hours or days of the original authorization). Does not create a separate credit transaction.
- **Refund / credit.** A separate transaction returning funds *after* settlement. Must reference the original transaction and, under network rules, must generally return to the **same card** used in the original purchase.

**The compliance point that matters most:** card network rules generally prohibit refunding to a different card or account than the one used for the original purchase. This is simultaneously a network rule and an AML control. If the tool permits routing a refund to a different destination — even through a manual override — it risks violating network rules and creating money-laundering exposure.

**Refund windows.** Visa and Mastercard generally permit refunds for extended periods (often 120 days or more), but the practical window is set by the acquiring bank's policies and card product, and ultimately by the **acquiring-partner and processor agreements**. These must be confirmed per partner before launch. Partial refunds are generally permitted, each as a separate transaction referencing the original.

### 2.2 ACH (US) — Unverified lead (no authority retrieved)

ACH operates under Nacha rules, which distinguish three different flows the tool must treat separately:

- **Reversals.** Permitted only for specific error conditions (duplicate entries, incorrect amount, incorrect account number) and generally must be initiated within **5 banking days** of settlement.
- **Returns.** Initiated by the receiving bank (RDFI) under specific reason codes and timeframes. Unauthorized debit returns generally have a **60-day** window from settlement for consumer accounts; most other returns within **2 banking days**.
- **Refunds.** Not a formal Nacha concept. After the return window closes, returning funds generally requires a **new ACH credit entry** — a separate transaction, not a reversal or return.

**Implication:** For ACH, the "refund" tool will in many cases be initiating new credit entries, which are effectively new payments with their own reconciliation, monitoring, and sanctions-screening considerations. The tool must distinguish true reversals (within the Nacha window), returns (RDFI-initiated), and new credit entries.

### 2.3 Local payment methods (UK/EU and others) — Unverified lead (no authority retrieved)

Each local scheme has distinct rules; a one-size-fits-all refund model will not work:

- **SEPA Credit Transfers:** generally irrevocable once executed; refunds require a new credit transfer in the opposite direction. Recalls possible within ~10 working days for unauthorized transactions, with the beneficiary bank having ~15 working days to respond.
- **SEPA Direct Debits:** consumer refund rights — ~8 weeks for authorized transactions, ~13 months for unauthorized.
- **UK Faster Payments:** generally irrevocable once settled; refunds require a new payment.
- **Pix (Brazil):** has specific refund mechanisms built into the system.

**Implication:** The tool must be designed method-by-method, and the specific local methods supported at launch have not been identified. This is an open question that materially affects design and compliance.

---

## 3. AML and suspicious-activity indicators

**Verified concern:** Operations has flagged refunds used to move funds between unrelated cards or recipients. This is a recognized money-laundering typology (refund laundering / layering).

**Unverified lead — indicators to monitor (from research packet):**
- Refunds to a different card or account than the original funding source.
- High refund volume relative to transaction volume (refund ratio).
- Refunds processed immediately after payout.
- Refunds on closed or suspended accounts.
- Patterns of partial refunds that aggregate to amounts just below reporting thresholds (structuring).
- Refunds where the original payment was flagged for fraud or was from a high-risk jurisdiction.
- Refund-after-payout scenarios, which create credit risk and potential AML exposure if the original payment was fraudulent.

**Open question (launch gate):** Whether Mosaic Relay's existing transaction-monitoring covers refunds and reversals is **unknown**. If it does not, refunds create a surveillance gap and the launch should be delayed until monitoring is in place. This is a factual question that must be resolved before launch, not after.

**Assumption:** This analysis assumes Mosaic Relay operates as a payment facilitator/technology provider under partner licenses, not as a licensed money transmitter with direct BSA/AML obligations. If Mosaic Relay holds its own money transmitter licenses, it would have direct obligations for refund transactions, including potential SAR filing obligations for suspicious refund patterns.

---

## 4. Customer disclosures

**Unverified lead (no authority retrieved):** Depending on jurisdiction, consumer protection laws impose refund-related requirements:
- **US:** Regulation E (consumer ACH and debit card) and Regulation Z (credit card) error-resolution and dispute rights interact with refund processes; the FTC Act's prohibition on unfair or deceptive practices applies to refund policies and disclosures.
- **EU:** PSD2 and the Consumer Rights Directive impose refund rights and disclosure requirements; SEPA Direct Debit provides specific refund rights.
- **UK:** Payment Services Regulations 2017 and Consumer Rights Act 2015 impose similar requirements.

**Recommendation (draft):** Mosaic Relay should ensure merchant agreements and payer-facing disclosures clearly state refund policies, processing times, and the circumstances under which refunds may be delayed or rejected. These disclosures must be accurate about the tool's capabilities and limitations.

---

## 5. Recordkeeping

**Unverified lead (no authority retrieved):** BSA/AML recordkeeping applies to refund transactions. Mosaic Relay should maintain records of:
- Original transaction details (amount, date, funding source, merchant).
- Refund transaction details (amount, date, destination, reason).
- Any overrides applied, including approver identities and justification.
- Monitoring alerts generated and their disposition.
- Communication with merchants regarding refunds.

Card network rules also impose refund recordkeeping (often 12–24 months minimum, sometimes longer). BSA recordkeeping commonly requires 5-year retention for transactions over $3,000, including refund records. Nacha requires ACH return/reversal records with specific reason codes and timestamps. Local schemes vary (typically 5–7 years in the EU).

**Verified control already in place:** Manual overrides are logged/audited, which supports the recordkeeping requirement for overrides.

---

## 6. Controls against misuse

**Verified controls already planned:** Original-payer default; two-person approval for overrides; overrides logged/audited.

**Recommendation (draft) — additional controls:**
1. **Hard original-source-only default** for card refunds, aligned with network rules.
2. **Treat reversal and refund as distinct flows** with different windows and controls.
3. **Manual overrides must not change the refund destination.** The planned two-person approval should be limited to processing a refund to the *original* source — not authorizing a destination change. A destination change is a materially higher-risk exception requiring enhanced due diligence, monitoring-alert generation, and post-transaction review, if permitted at all.
4. **Refund-specific monitoring rules** distinct from payment monitoring (velocity limits per merchant/payer/funding source; refund-ratio alerts; mandatory delay for refunds to non-original sources).
5. **Enhanced due diligence** for merchants with high refund volumes or ratios.
6. **Confirm per-partner windows** and configure the tool against confirmed windows rather than a single hard-coded default.

---

## 7. When Mosaic Relay should delay, reject, or investigate a refund

**Recommendation (draft):** Mosaic Relay should delay, reject, or investigate a refund when:
- The refund destination differs from the original funding source (highest-risk indicator).
- The refund is on a closed or suspended account (normal ongoing controls are absent).
- The refund is requested immediately after payout.
- The refund pattern suggests structuring (partial refunds aggregating just below thresholds).
- The original payment was flagged for fraud or from a high-risk jurisdiction.
- The refund would exceed the confirmed per-partner window for the method.

In these cases, the refund should be held for review (e.g., 24–48 hours), escalated to the risk/compliance team, and processed only after investigation and, where applicable, dual approval. Where the pattern indicates potential money laundering, Mosaic Relay should consider whether a SAR is required (which depends on its licensing status — see assumptions).

---

## 8. Working recommendation (draft — not a durable decision)

**Recommended path: phased launch with enhanced controls.**

1. **Phase 1 — Card refunds only**, original-source-only, no destination-changing overrides. Card network rules are the clearest and original-source enforcement is most straightforward.
2. **Phase 2 — ACH**, with separate monitoring rules and limited overrides with dual approval, after confirming Nacha windows and distinguishing reversals/returns/new credits.
3. **Phase 3 — Local payment methods**, after jurisdiction-specific legal review and identification of the specific methods.

**Launch gates before any phase:**
- Confirm whether existing transaction-monitoring covers refunds/reversals; if not, build or procure that coverage before launch.
- Obtain and review acquiring-partner and processor agreements (controlling source for windows, destinations, liability).
- Confirm Mosaic Relay's legal entity and licensing status and funds-flow/settlement model.
- Confirm per-partner refund/return windows for each method.
- Draft merchant-facing refund policy and payer-facing disclosures.

**This is a working recommendation only.** It has not been accepted as a durable decision. The lawyer should decide the acceptable risk and the business path.

---

## What would change this (ranked)

- **Open fork (highest impact):** Whether the tool will allow refunds to destinations other than the original funding source, even via manual override. If yes, the AML risk profile increases substantially and the tool may violate card network rules. If no, the tool is lower risk but may not handle all legitimate edge cases. This should be decided explicitly, not by default.
- **Not examined:** The acquiring-partner and processor contracts — the controlling source for refund windows, permitted destinations, liability allocation, and any restrictions on manual overrides. These were identified as missing facts but not reviewed.
- **Not examined:** The Visa Core Rules, Mastercard Rules, and Nacha rules were not retrieved (external research timed out). The specific provisions applicable to Mosaic Relay's merchant category and transaction types must be confirmed directly.
- **Working assumption:** Mosaic Relay operates as a payment facilitator/technology provider under partner licenses, not a licensed money transmitter. If it holds its own licenses, it has direct BSA/AML obligations including potential SAR filing, and the analysis changes materially.
- **Open question:** Whether existing transaction-monitoring covers refunds/reversals is unknown. If it does not, launch should be delayed until monitoring is in place. This is a launch gate.
- **Not examined:** The specific local payment methods to be supported at launch were not identified. Each local scheme (SEPA, Faster Payments, Pix, etc.) has distinct rules that materially affect design and compliance.
- **Not examined:** Whether any state money transmitter statutes impose specific refund handling requirements beyond general BSA/AML obligations. The analysis assumed federal BSA compliance but did not verify state-by-state variations.
