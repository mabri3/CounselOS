---
work_product_id: WP-7ed22cf5bde1
matter_id: MAT-20260903-5311e9
title: Consumer Dispute Portal — Legal Requirements and Recommended Operating Model
record_type: work_product
state: final
summary: ''
created_at: '2026-09-03T18:12:52+00:00'
updated_at: '2026-09-03T18:18:07+00:00'
immutable: true
source_action_key: chat:RUN-20260903-0d200d:tool:cd9ef75210b44f5241cc7de2
recommendation_version_id: REC-20260903-983031
recommendation_snapshot: '# Consumer Dispute Portal — Recommended Operating Model
  for Launch


  **Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications

  **Status:** Formal recommendation — **no decision recorded.**

  **Target release:** 2026-10-15 (six weeks)

  **Scope:** Consumer-only buyers; card purchases; English plus Spanish; U.S.-focused
  initial release (assumption)


  This recommendation sets out the operating model recommended for launch, built on
  the reconciled research packet. It separates **legal requirements** (fixed) from
  **customer policy choices** (owned by Payments Operations / the marketplace). The
  Tier 3 escalation default is recommended as **auto-submit with no silent lapse**,
  with the marketplace''s policy choice clearly flagged.


  ---


  ## 1. Recommended operating model at a glance


  | Element | Recommendation | Classification | Owner |

  |---------|---------------|----------------|-------|

  | Intake fields | Common + category-specific (Section 2) | Legal floor + policy
  additions | Legal sets; Payments Ops implements |

  | Notices | N1–N11 in English and Spanish (Section 3) | Legal floor | Legal sets;
  Payments Ops implements |

  | Deadlines & clocks | Configurable to verified network rules; hard launch gate
  (Section 4) | Legal (network) + policy SLA | Legal sets; Payments Ops implements
  |

  | Evidence | Collection, sharing, retention, integrity (Section 5) | Legal floor
  + policy | Legal sets; Payments Ops implements |

  | Status labels | Fixed legal set + policy wording (Section 6) | Mixed | Legal +
  Payments Ops |

  | Bilingual comms | English + Spanish, native-speaker reviewed (Section 7) | Policy
  + risk | Payments Ops |

  | Escalation | 3-tier ladder; Tier 3 default = auto-submit, no silent lapse (Section
  8) | Policy + risk (must be decided) | Marketplace + Payments Ops |

  | Owners | Owner matrix (Section 9) | — | — |


  ---


  ## 2. Exact intake fields


  ### 2.1 Common intake (all categories) — legal floor

  1. Order/transaction identifier (order number, transaction reference, or card statement
  line).

  2. Transaction date and amount.

  3. Card used (last four digits) and whether the buyer recognizes the charge.

  4. **Date the buyer first became aware of the issue** — *fixed legal field* (drives
  issuer-side Reg E/Reg Z deadlines).

  5. **Statement date** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).

  6. Whether the buyer has already contacted the seller or marketplace directly, and
  the outcome.

  7. Whether the buyer has already filed a dispute with their card issuer (and, if
  so, the issuer''s reference).

  8. Contact method and preferred language (English/Spanish) for dispute communications.


  ### 2.2 Non-receipt

  1. Was the item ever shipped? If known, provide tracking number and carrier.

  2. **What delivery date was promised at purchase?** — *fixed legal field* (MTO +
  network non-receipt reason codes).

  3. What is the current delivery status (delivered / in transit / no tracking / unknown)?

  4. If marked delivered, was the item left at the address, and is there any delivery
  photo or signature?

  5. Has the buyer requested a refund or replacement from the seller, and what was
  the response?

  6. Evidence to upload: order confirmation, tracking page, delivery photo, seller
  correspondence.


  ### 2.3 Unauthorized use

  1. Does the buyer recognize the transaction at all?

  2. Was the card or card details lost, stolen, or otherwise accessible to someone
  else?

  3. Does the buyer believe a family member, employee, or other authorized user made
  the charge?

  4. Has the buyer reported the unauthorized use to their card issuer, and has the
  issuer opened an investigation?

  5. Has the buyer filed a police report (if applicable)?

  6. Evidence to upload: card statement showing the charge, issuer correspondence,
  police report (if any).


  ### 2.4 Duplicate charges

  1. Was the buyer charged more than once for the same order?

  2. Provide the order number(s) and the duplicate transaction references/amounts.

  3. Was the buyer charged for an order they did not place, or charged twice for one
  order?

  4. Has the buyer already received a refund for one of the charges?

  5. Evidence to upload: card statement showing both charges, order confirmation(s).


  ### 2.5 Defective goods

  1. What is the defect, and when was it discovered?

  2. Was the item used or installed before the defect appeared?

  3. Has the buyer contacted the seller or manufacturer about the defect, and what
  was the response?

  4. Is the buyer seeking a refund, replacement, or repair?

  5. Evidence to upload: photos/videos of the defect, order confirmation, seller correspondence,
  any warranty documents.


  ---


  ## 3. Mandatory notices and plain-language disclosure points (English and Spanish)


  All notices must be provided in **English and Spanish** at intake and at each status
  change. Plain-language drafting is required.


  ### 3.1 Intake-time disclosures (shown before the buyer submits)

  - **N1 — What the portal does and does not do.** Collects the dispute and evidence
  and routes it to the marketplace/seller for review; not a guarantee of a refund
  and does not replace the buyer''s right to dispute with their card issuer.

  - **N2 — Card-issuer rights preserved.** Buyer may still contact their card issuer;
  using the portal does not waive that right.

  - **N3 — What happens next and expected timing.** Review process, response-time
  target, how the buyer will be updated.

  - **N4 — Evidence requirements.** What evidence is needed; incomplete evidence may
  delay/prevent resolution; do not submit sensitive data (full card numbers, SSNs).

  - **N5 — Data use and sharing.** Evidence will be shared with the marketplace, seller,
  and (as needed) card networks and issuers; reference the privacy notice.

  - **N6 — No admission of liability.** Submitting a dispute is not an admission by
  the marketplace or seller.


  ### 3.2 Status-change notices (sent at each milestone)

  - **N7 — Acknowledgment.** Received, reference number, expected next step.

  - **N8 — Evidence received / additional evidence requested.** When complete or when
  more is needed, with a deadline to respond.

  - **N9 — Under review.** Marketplace/seller is reviewing.

  - **N10 — Resolution.** Outcome (refund issued, denied, or escalated) with reason
  and next steps.

  - **N11 — Escalation.** When escalated (per Section 8) and what that means for the
  buyer.


  ### 3.3 Plain-language disclosure points

  - Short sentences, common words, no legal jargon.

  - State deadlines in plain calendar terms (e.g., "within 10 calendar days").

  - Same content in both languages; no machine translation without native-speaker
  review.

  - Make "contact your card issuer" prominent.


  ---


  ## 4. Deadlines and clock rules


  **Hard launch gate:** The clock logic and evidence checklists must **not ship**
  until the current Visa/Mastercard rules for the supported networks are pulled and
  reconciled. The values below are placeholders subject to verification.


  ### 4.1 Buyer-side deadlines

  - **Unauthorized use / fraud:** Encourage prompt reporting; issuer Reg E/Reg Z deadlines
  (typically 60 days from statement) run to the issuer, not the portal. The portal
  must not impose a shorter window that could prejudice the buyer''s issuer rights.

  - **Non-receipt / defective / duplicate:** Allow reporting within a reasonable window
  (e.g., 60–120 days from transaction or expected delivery), subject to network reason-code
  filing windows. **Verify** the applicable network filing windows.


  ### 4.2 Marketplace/seller response deadlines

  - **Network response window:** The merchant of record must respond within the network''s
  window (commonly ~10–30 days depending on network and reason code). **Verify** the
  exact window for each supported network and reason code.

  - **Portal internal SLA:** Target a response well inside the network window (e.g.,
  5–7 business days) to leave buffer. **Policy choice** owned by Payments Operations,
  subject to the hard network deadline.


  ### 4.3 Clock rules

  - **Clock start:** When the network/issuer files the chargeback or when the buyer
  submits the dispute, whichever is earlier for the merchant-of-record obligation.
  **Verify** the network''s clock-start trigger.

  - **Calendar vs. business days:** Network deadlines are typically calendar days;
  internal SLAs may be business days. Track both and display the earlier hard deadline.

  - **Time zones:** Single reference time zone for calculations; display deadlines
  in the buyer''s local time.

  - **No auto-fail on the buyer:** An internal SLA lapse must not cause the buyer''s
  dispute to be automatically denied in a way that prejudices their issuer rights.


  ---


  ## 5. Evidence collection, sharing, retention, and integrity


  ### 5.1 Collection

  - Collect only the evidence needed for the category (Section 2), in English and
  Spanish intake flows.

  - Accept common formats (PDF, JPG, PNG) with size limits; reject executable/script
  files.

  - Do not request or store full card numbers, SSNs, or other sensitive data beyond
  what is necessary; mask card data.


  ### 5.2 File sharing

  - Evidence is shared with the marketplace, the seller (per the marketplace''s terms
  and routing), and, as needed, card networks and issuers.

  - Sharing limited to what is necessary and consistent with the privacy notice (N5).

  - **Verify** network rules on what evidence may be shared and any redaction requirements.


  ### 5.3 Retention

  - Retain for the longer of: the network''s required retention period, the applicable
  statute of limitations, and Mosaic Relay''s/the marketplace''s record-retention
  policy.

  - **Verify** the network''s evidence-retention mandate and any state record-retention
  requirements.


  ### 5.4 Integrity (fixed legal requirement)

  - Preserve evidence in an immutable, timestamped record with a clear audit trail
  (who uploaded, when, and any changes).

  - Prevent tampering: store originals, log access, restrict edit/delete rights to
  authorized personnel.

  - Maintain a chain of custody for evidence that may be submitted to a network or
  used in a dispute.


  ---


  ## 6. Status labels


  Per the recorded direction, status labels are **mixed** — some fixed by legal, some
  policy.


  ### 6.1 Fixed (legal/network-mandated) labels

  - **Received** — dispute submitted and acknowledged.

  - **Under review** — marketplace/seller reviewing.

  - **Additional evidence requested** — more evidence needed from the buyer.

  - **Resolved — refund issued** / **Resolved — no refund** — final outcome.

  - **Escalated** — routed per Section 8.


  ### 6.2 Policy labels (Payments Operations may define)

  - Internal sub-statuses (e.g., "assigned to seller," "awaiting seller response,"
  "in network response").

  - Buyer-facing wording of the fixed labels (plain-language phrasing) within legal
  guardrails.

  - Seller-facing statuses and SLA indicators.


  ---


  ## 7. Bilingual communications


  - **English plus Spanish** for all buyer-facing notices, intake flows, and status
  updates (recorded requirement).

  - Bilingual support is a **policy-plus-risk** decision (no hard federal mandate),
  but it is a recorded requirement for launch and should be treated as fixed for the
  initial release.

  - **Native-speaker review and plain-language testing** of all English/Spanish notices
  before launch (tracked deliverable).

  - Seller and marketplace communications may be English-only unless the marketplace''s
  terms require otherwise (policy choice).


  ---


  ## 8. Escalation path when the marketplace or seller does not respond


  ### 8.1 Recommended escalation ladder

  1. **Tier 1 — Automated reminder.** If the marketplace/seller has not responded
  within the internal SLA (e.g., 3 business days), send an automated reminder with
  the hard network deadline.

  2. **Tier 2 — Support-agent escalation.** If still no response by a second threshold
  (e.g., 5 business days), route to Mosaic Relay support for manual handling and direct
  outreach.

  3. **Tier 3 — Network-deadline fallback.** If the marketplace/seller has not responded
  by the network deadline, the portal must **not** let the deadline lapse silently.


  ### 8.2 Tier 3 — recommended provisional operational default: **auto-submit, no
  silent lapse**


  **Recommended default:** **Auto-submit a network response on the merchant of record''s
  behalf** reflecting the buyer''s claim and available evidence, so the network deadline
  is met and the buyer''s position is preserved.


  **Why auto-submit (justification):**

  - A silent lapse converts a resolvable dispute into a **guaranteed adverse network
  outcome** (default loss) and a consumer-protection risk.

  - Auto-submitting the buyer''s claim preserves the buyer''s position and keeps the
  dispute within the network process, where it can still be defended or withdrawn.

  - It avoids the cost of a provisional refund while still meeting the deadline, and
  it keeps the decision to refund (vs. defend) with the marketplace/seller rather
  than forcing a payout.

  - It is **reversible** in the sense that the marketplace/seller can still respond
  with evidence after submission, consistent with Mosaic Relay''s operating principle
  of reversible controls.


  **What remains a marketplace policy choice (not fixed by legal):**

  - Whether the fallback is **auto-submit** (recommended) or **provisional refund
  to the buyer** (protects the buyer and avoids an adverse network outcome, but costs
  the marketplace/seller).

  - The **internal SLA thresholds** for Tier 1 and Tier 2 (e.g., 3 and 5 business
  days).

  - Whether the seller or the marketplace **bears the cost** of a chargeback or provisional
  refund (governed by seller terms — open item O3).

  - Whether **manual-only** (no auto-action) is ever acceptable — **not recommended**,
  because it risks a silent lapse.


  **Decision point:** The marketplace must choose, before launch, the Tier 3 behavior.
  The recommendation is **auto-submit with no silent lapse**. This is the single most
  important pre-launch decision because it determines chargeback liability and buyer
  outcomes.


  ---


  ## 9. Owner matrix


  | Item | Classification | Owner |

  |------|---------------|-------|

  | Merchant-of-record determination and who responds to network disputes | **Legal**
  (determines liability) | Legal + Marketplace |

  | Network chargeback deadlines and clock rules | **Legal** (network-mandated) |
  Legal sets; Payments Ops implements |

  | Required notices (N1–N11) and plain-language disclosure | **Legal** (consumer-protection
  floor) | Legal sets; Payments Ops implements |

  | English-plus-Spanish language support | **Policy + risk** (recorded requirement)
  | Payments Ops (with Legal review) |

  | Evidence collection minimums and integrity/retention | **Legal** (network + consumer-protection
  floor) | Legal sets; Payments Ops implements |

  | Status labels — fixed set | **Legal** | Legal |

  | Status labels — wording and internal sub-statuses | **Policy** | Payments Ops
  |

  | Internal response SLAs (within the network deadline) | **Policy** | Payments Ops
  |

  | Escalation Tier 3 behavior (auto-submit vs. provisional refund) | **Policy + risk**
  (must be decided) | Marketplace + Payments Ops |

  | Seller-term allocation of dispute/refund/chargeback responsibility | **Legal**
  (contract) | Legal + Marketplace |

  | Bilingual notice native-speaker review | **Policy + risk** | Payments Ops |

  | Accessibility (WCAG 2.1 AA baseline) | **Policy + risk** (research pending) |
  Payments Ops |


  ---


  ## 10. Open work items (before launch)


  | # | Work item | Owner | Needed by |

  |---|-----------|-------|-----------|

  | W1 | Confirm merchant of record / customer of record for the card transactions
  | Legal + Marketplace | Before launch |

  | W2 | Confirm which card networks and regions the initial release supports | Product
  + Marketplace | Before launch |

  | W3 | Verify current Visa/Mastercard chargeback timeframes, reason codes, and evidence
  requirements for the four categories | Legal (research in progress) | Before launch
  (hard gate) |

  | W4 | Check whether marketplace seller terms and marketplace terms allocate dispute/refund/chargeback
  responsibility; amend if silent | Legal + Marketplace | Before launch |

  | W5 | Decide Tier 3 escalation behavior (recommended: auto-submit, no silent lapse)
  | Marketplace + Payments Ops | Before launch |

  | W6 | Verify FTC MTO rule applicability to the marketplace and sellers | Legal
  | Before launch |

  | W7 | Confirm accessibility (ADA/WCAG) requirements for the portal | Legal (research
  in progress) | Before launch |

  | W8 | Draft English and Spanish notice text and plain-language disclosures | Legal
  + Payments Ops | Before launch |

  | W9 | Build configurable deadline/clock logic to verified network rules | Product/Engineering
  | Before launch |

  | W10 | Define evidence retention schedule and audit-trail controls | Payments Ops
  + Legal | Before launch |

  | W11 | Native-speaker review and plain-language testing of English/Spanish notices
  | Payments Ops | Before launch |

  | W12 | Verify network evidence-sharing/redaction rules and confirm privacy-law
  scope (U.S. vs. EU/LatAm) | Legal | Before launch |


  ---


  ## 11. What would change this


  - **Working assumption:** The marketplace is the merchant of record and Mosaic Relay
  is a service provider. If Mosaic Relay is the merchant of record or a payment facilitator
  treated as such, the entire response/liability model shifts to Mosaic Relay and
  the six-week launch is likely infeasible.

  - **Working assumption:** The initial release is U.S.-focused, Visa/Mastercard consumer
  card purchases. If Amex, Discover, or non-U.S. regions are added, additional reason
  codes, timeframes, evidence rules, and local consumer-protection law apply.

  - **Open fork:** Tier 3 escalation — auto-submit (recommended) vs. provisional refund
  vs. manual-only. The recommendation is auto-submit with no silent lapse, but the
  marketplace''s choice determines who bears missed-deadline risk and buyer outcomes.

  - **Not examined:** The current Visa/Mastercard chargeback guides were **not retrieved**
  (external research timed out). Exact reason codes, timeframes, and evidence requirements
  must be verified against current network publications before the clock logic and
  evidence checklists are finalized.

  - **Not examined:** The marketplace agreement, Mosaic Relay''s acquiring/processor
  contracts, and the marketplace''s seller terms were **not reviewed**. Merchant-of-record,
  payment-facilitator, and terms-allocation questions remain open.

  - **Not examined:** The consumer-protection-notice and accessibility research runs
  are **still running/queued** and have produced no retrievable authority. State-law
  and accessibility conclusions are generated analysis pending those runs.'
review:
  segments:
  - kind: delete
    text: '# Consumer Dispute Portal — Legal Requirements and Operating Model


      **Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications

      **Status:** Draft for review — no decision recorded

      **Target release:** 2026-10-15 (six weeks)

      **Scope:** Consumer-only buyers; card purchases; English plus Spanish; U.S.-focused
      initial release (assumption)


      ---


      ## 1. Factual record and assumptions


      ### 1.1 Confirmed facts (verified in the matter record)


      | # | Fact | Status |

      |---|------|--------|

      | F1 | A consumer-facing marketplace asks Mosaic Relay to provide a dispute
      portal for card purchases. | Verified |

      | F2 | Proposed dispute categories: non-receipt, unauthorized use, duplicate
      charges, defective goods. | Verified |

      | F3 | The portal collects statements and documents, sends automated messages,
      and routes cases to the marketplace or seller. | Verified |

      | F4 | Actors include buyers, sellers, the marketplace, Mosaic Relay, card networks,
      issuers, and support agents. | Verified |

      | F5 | Initial release target is 2026-10-15 (six weeks). | Verified |

      | F6 | Buyers using the portal are **consumers only** (not business purchasers).
      | Verified |

      | F7 | Portal and notices must support **English plus Spanish** for the initial
      release. | Verified |

      | F8 | **Payments Operations** owns the operating-model decisions (notices,
      deadlines, status labels, escalation paths) once legal sets the requirements.
      | Verified |

      | F9 | Evidence rules and status labels are **mixed** — some are fixed legal
      requirements, some are customer policy choices. | Verified |

      | F10 | Direction given to **draft with best-available assumptions** for the
      still-open items. | Verified |


      ### 1.2 Open facts (unverified — need confirmation before launch)


      | # | Open item | Current state |

      |---|-----------|---------------|

      | O1 | Merchant of record / customer of record for the card transactions | Not
      yet determined — being decided |

      | O2 | Which card networks and regions the initial release must support | Not
      yet determined |

      | O3 | Whether marketplace seller terms and marketplace terms allocate dispute/refund/chargeback
      responsibility | Not sure — need to check |

      | O4 | Escalation behavior when the marketplace or seller does not respond within
      the network deadline | Not yet decided — need a recommendation |


      ### 1.3 Working assumptions (best-available, to be confirmed)


      - **A1 — Merchant of record.** The marketplace is the merchant of record for
      the card transactions; Mosaic Relay is a payments-infrastructure service provider,
      not the merchant of record. *If wrong* (Mosaic Relay is the merchant of record),
      Mosaic Relay itself becomes the party that must respond to network disputes
      and bear chargeback liability, and the entire operating model shifts.

      - **A2 — Networks and regions.** Initial release covers U.S. consumer card purchases
      subject to Visa and Mastercard chargeback rules and U.S. consumer-protection
      law. *If wrong* (e.g., Amex, Discover, or non-U.S. regions added), deadlines,
      evidence rules, and notice obligations change materially.

      - **A3 — Seller terms.** Seller/marketplace terms do not yet allocate dispute/refund/chargeback
      responsibility; this must be checked and addressed in the draft. *If wrong*
      (terms already allocate), the portal''s routing and cost-bearer logic must conform
      to the existing allocation.

      - **A4 — Escalation.** When the marketplace or seller does not respond within
      the network deadline, the portal needs a defined fallback (recommended in Section
      8). *If wrong*, the fallback must be replaced with the marketplace''s chosen
      behavior.

      - **A5 — Reg E applicability.** Unauthorized-use disputes implicate EFTA/Reg
      E consumer protections, but Reg E obligations run to the card issuer, not to
      Mosaic Relay or the marketplace. Mosaic Relay''s role is to collect and transmit
      evidence, not to adjudicate Reg E rights. *If wrong* (Mosaic Relay or the marketplace
      is treated as the account-holding institution), additional Reg E duties would
      attach.


      ---


      ## 2. Consumer-protection and payment-network issues (from the briefing)


      This section separates **verified** legal anchors from **unverified leads**
      that require confirmation before launch. Nothing here is a final legal conclusion;
      the research runs on network timeframes, consumer-protection notices, and accessibility
      are still in progress.


      ### 2.1 Verified anchors


      - **V1 — Merchant-of-record determines who responds.** The party that must respond
      to a card-network chargeback and bear the liability is the merchant of record.
      Because Mosaic Relay is (assumed) a service provider and the marketplace is
      the merchant of record, the marketplace (and, per its terms, sellers) must respond
      to network disputes. This is the single most decision-changing fact in the matter.

      - **V2 — Card-network rules are contractual, not statutory.** Visa and Mastercard
      chargeback timeframes, evidence requirements, and reason codes are set by network
      operating rules that bind the acquirer and merchant of record. They are not
      federal statutes. The portal''s deadlines must be built to the applicable network
      rules, which vary by network, region, and reason code.

      - **V3 — Unauthorized-use disputes implicate EFTA/Reg E.** For consumer card
      accounts, unauthorized-use protections under the Electronic Fund Transfer Act
      and Regulation E (and, for credit cards, the Truth in Lending Act § 170 / Reg
      Z) run to the card issuer. The portal''s role is to collect and transmit evidence
      to support the issuer''s investigation, not to determine Reg E liability.

      - **V4 — FTC Mail/Telephone Order (MTO) rules.** Where a marketplace sells goods
      by mail, phone, or online, the FTC''s Mail, Internet, or Telephone Order Merchandise
      Rule (16 C.F.R. Part 435) requires shipment within the promised time (or 30
      days if none stated) and imposes refund obligations for non-shipment. Non-receipt
      disputes may implicate these rules for the merchant of record.

      - **V5 — Language access is a policy-plus-risk decision.** There is no general
      federal statute requiring a private marketplace to provide Spanish-language
      dispute communications. The English-plus-Spanish decision is primarily a customer-policy
      and risk choice (fairness, consumer trust, and state UDAP exposure), not a hard
      federal mandate — though state consumer-protection laws and the FTC''s "clear
      and conspicuous" standard may inform how notices are presented.


      ### 2.2 Unverified leads (need confirmation before launch)


      - **L1 — Exact Visa/Mastercard chargeback timeframes and reason codes** for
      non-receipt, unauthorized use, duplicate charges, and defective goods. *Research
      run in progress.* These are network-specific and change; the portal''s clock
      logic must be built to the verified current rules for the networks actually
      supported.

      - **L2 — Whether the marketplace''s acquiring arrangement makes Mosaic Relay
      a "facilitator" or "payment facilitator"** under network rules, which can shift
      who is treated as the merchant of record for chargeback purposes. *Needs the
      acquiring/processor contract.*

      - **L3 — State consumer-protection laws** (UDAP statutes, state-specific refund
      and notice requirements) in the states where the marketplace operates. *Not
      yet scoped.*

      - **L4 — Accessibility obligations** (ADA/WCAG) for the consumer-facing dispute
      portal. *Research run in progress.*

      - **L5 — Whether the marketplace is subject to the FTC MTO rule** (i.e., whether
      it is a "merchant" selling goods by mail/phone/internet) and whether sellers
      are separately subject to it. *Needs the marketplace''s business model and seller
      terms.*

      - **L6 — Card-network data-security and evidence-handling rules** (e.g., PCI
      DSS, network mandates on storing and sharing cardholder data and dispute evidence).
      *Needs the network agreements and the evidence-storage design.*


      ---


      ## 3. Exact intake questions by dispute category


      The portal must collect the minimum evidence needed to support a network response
      and to let the marketplace/seller evaluate the claim. Questions below are the
      **legal floor**; the marketplace may add policy questions. All intake must be
      available in English and Spanish.


      ### 3.1 Common intake (all categories)


      1. Order/transaction identifier (order number, transaction reference, or card
      statement line).

      2. Transaction date and amount.

      3. Card used (last four digits) and whether the buyer recognizes the charge.

      4. Date the buyer first became aware of the issue.

      5. Whether the buyer has already contacted the seller or marketplace directly,
      and the outcome.

      6. Whether the buyer has already filed a dispute with their card issuer (and,
      if so, the issuer''s reference).

      7. Contact method and preferred language (English/Spanish) for dispute communications.


      ### 3.2 Non-receipt


      1. Was the item ever shipped? If known, provide tracking number and carrier.

      2. What delivery date was promised at purchase?

      3. What is the current delivery status (delivered / in transit / no tracking
      / unknown)?

      4. If marked delivered, was the item left at the address, and is there any delivery
      photo or signature?

      5. Has the buyer requested a refund or replacement from the seller, and what
      was the response?

      6. Evidence to upload: order confirmation, tracking page, delivery photo, seller
      correspondence.


      ### 3.3 Unauthorized use


      1. Does the buyer recognize the transaction at all?

      2. Was the card or card details lost, stolen, or otherwise accessible to someone
      else?

      3. Does the buyer believe a family member, employee, or other authorized user
      made the charge?

      4. Has the buyer reported the unauthorized use to their card issuer, and has
      the issuer opened an investigation?

      5. Has the buyer filed a police report (if applicable)?

      6. Evidence to upload: card statement showing the charge, issuer correspondence,
      police report (if any).


      ### 3.4 Duplicate charges


      1. Was the buyer charged more than once for the same order?

      2. Provide the order number(s) and the duplicate transaction references/amounts.

      3. Was the buyer charged for an order they did not place, or charged twice for
      one order?

      4. Has the buyer already received a refund for one of the charges?

      5. Evidence to upload: card statement showing both charges, order confirmation(s).


      ### 3.5 Defective goods


      1. What is the defect, and when was it discovered?

      2. Was the item used or installed before the defect appeared?

      3. Has the buyer contacted the seller or manufacturer about the defect, and
      what was the response?

      4. Is the buyer seeking a refund, replacement, or repair?

      5. Evidence to upload: photos/videos of the defect, order confirmation, seller
      correspondence, any warranty documents.


      ---


      ## 4. Mandatory notices and plain-language disclosure points (English and Spanish)


      All notices below must be provided in **English and Spanish** at the point of
      intake and at each status change. Plain-language drafting is required; legal
      boilerplate alone is insufficient for consumer-facing communications.


      ### 4.1 Intake-time disclosures (shown before the buyer submits)


      - **N1 — What the portal does and does not do.** State that the portal collects
      the buyer''s dispute and evidence and routes it to the marketplace/seller for
      review; it is not a guarantee of a refund and does not replace the buyer''s
      right to dispute the charge with their card issuer.

      - **N2 — Card-issuer rights preserved.** Tell the buyer they may still contact
      their card issuer to dispute the charge, and that using the portal does not
      waive that right.

      - **N3 — What happens next and expected timing.** Describe the review process,
      the response-time target, and how the buyer will be updated.

      - **N4 — Evidence requirements.** Explain what evidence is needed, that incomplete
      evidence may delay or prevent resolution, and that the buyer should not submit
      sensitive information (e.g., full card numbers, SSNs) beyond what is requested.

      - **N5 — Data use and sharing.** Disclose that submitted evidence will be shared
      with the marketplace, seller, and (as needed) card networks and issuers to resolve
      the dispute, and reference the privacy notice.

      - **N6 — No admission of liability.** A statement that submitting a dispute
      does not constitute an admission by the marketplace or seller.


      ### 4.2 Status-change notices (sent at each milestone)


      - **N7 — Acknowledgment.** Confirmation that the dispute was received, with
      a reference number and the expected next step.

      - **N8 — Evidence received / additional evidence requested.** Notification when
      evidence is complete or when more is needed, with a deadline to respond.

      - **N9 — Under review.** Notice that the marketplace/seller is reviewing the
      dispute.

      - **N10 — Resolution.** Notice of the outcome (refund issued, dispute denied,
      or escalated) with the reason and any next steps.

      - **N11 — Escalation.** Notice when the dispute is escalated (per Section 8)
      and what that means for the buyer.


      ### 4.3 Plain-language disclosure points


      - Use short sentences and common words; avoid legal jargon.

      - State deadlines in plain calendar terms (e.g., "within 10 calendar days")
      rather than network code references.

      - Provide the same content in both languages; do not rely on machine translation
      without review.

      - Make the "contact your card issuer" option prominent and easy to find.


      ---


      ## 5. Deadlines and clock rules (network-rule verification needed)


      **Critical caveat:** The exact deadlines below are **subject to verification
      against the current Visa/Mastercard operating rules for the networks actually
      supported** (open item O2). The research run on network timeframes is in progress.
      The portal''s clock logic must be configurable and built to the verified rules,
      not hard-coded to the placeholder values below.


      ### 5.1 Buyer-side deadlines (when the buyer must act)


      - **Unauthorized use / fraud:** Buyers should be encouraged to report promptly;
      card-issuer Reg E/Reg Z deadlines (typically 60 days from statement) run to
      the issuer, not the portal. The portal should not impose a shorter window that
      could prejudice the buyer''s issuer rights.

      - **Non-receipt / defective / duplicate:** The portal should allow reporting
      within a reasonable window (e.g., 60–120 days from transaction or expected delivery),
      subject to network reason-code filing windows for the merchant of record. **Verify**
      the applicable network filing windows.


      ### 5.2 Marketplace/seller response deadlines


      - **Network response window:** The merchant of record must respond to a chargeback
      within the network''s response window (commonly ~10–30 days depending on network
      and reason code). **Verify** the exact window for each supported network and
      reason code.

      - **Portal internal SLA:** The portal should target a response well inside the
      network window (e.g., respond within 5–7 business days) to leave buffer for
      evidence review and network submission. This is a **policy choice** owned by
      Payments Operations, subject to the hard network deadline.


      ### 5.3 Clock rules


      - **Clock start:** The response clock starts when the network/issuer files the
      chargeback or when the buyer submits the dispute, whichever is earlier for the
      merchant-of-record obligation. **Verify** the network''s clock-start trigger.

      - **Calendar vs. business days:** Network deadlines are typically calendar days;
      internal SLAs may be business days. The portal must track both and display the
      earlier hard deadline.

      - **Time zones:** Use a single reference time zone for all deadline calculations
      and display deadlines in the buyer''s local time.

      - **No auto-fail on the buyer:** The portal must not let an internal SLA lapse
      cause the buyer''s dispute to be automatically denied in a way that prejudices
      their issuer rights.


      ---


      ## 6. Evidence collection, file sharing, retention, and integrity rules


      ### 6.1 Collection


      - Collect only the evidence needed for the category (Section 3), in English
      and Spanish intake flows.

      - Accept common formats (PDF, JPG, PNG) with size limits; reject executable
      or script files.

      - Do not request or store full card numbers, SSNs, or other sensitive data beyond
      what is necessary; mask card data.


      ### 6.2 File sharing


      - Evidence is shared with the marketplace, the seller (per the marketplace''s
      terms and routing), and, as needed, card networks and issuers to support the
      network response.

      - Sharing must be limited to what is necessary for the dispute and consistent
      with the privacy notice (N5).

      - **Verify** network rules on what evidence may be shared and any redaction
      requirements.


      ### 6.3 Retention


      - Retain dispute records and evidence for the longer of: the network''s required
      retention period, the applicable statute of limitations for consumer claims,
      and Mosaic Relay''s/ the marketplace''s record-retention policy.

      - **Verify** the network''s evidence-retention mandate and any state record-retention
      requirements.


      ### 6.4 Integrity


      - Preserve evidence in an immutable, timestamped record with a clear audit trail
      (who uploaded, when, and any changes).

      - Prevent tampering: store originals, log access, and restrict edit/delete rights
      to authorized personnel.

      - Maintain a chain of custody for evidence that may be submitted to a network
      or used in a dispute.


      ---


      ## 7. Status labels and buyer/seller/marketplace communications


      ### 7.1 Status labels (mixed legal/policy)


      Per the recorded decision, status labels are **mixed** — some are fixed by legal,
      some are policy choices owned by Payments Operations.


      **Fixed (legal/network-mandated) labels:**

      - **Received** — dispute submitted and acknowledged.

      - **Under review** — marketplace/seller reviewing.

      - **Additional evidence requested** — more evidence needed from the buyer.

      - **Resolved — refund issued** / **Resolved — no refund** — final outcome.

      - **Escalated** — routed per Section 8.


      **Policy labels (Payments Operations may define):**

      - Internal sub-statuses (e.g., "assigned to seller," "awaiting seller response,"
      "in network response").

      - Buyer-facing wording of the fixed labels (plain-language phrasing) within
      legal guardrails.

      - Seller-facing statuses and SLA indicators.


      ### 7.2 Communications


      - **Buyer:** Acknowledgment, evidence requests, status updates, resolution,
      and escalation notices (N7–N11), in English and Spanish.

      - **Seller:** Notice that a dispute was filed, evidence request, response deadline,
      and outcome. Seller communications are governed by the marketplace''s seller
      terms (open item O3).

      - **Marketplace:** Dashboard visibility into all disputes, response-time metrics,
      and escalation triggers.

      - **Support agents:** Access to the full dispute record and audit trail to assist
      buyers and sellers.


      ---


      ## 8. Escalation path when the marketplace or seller does not respond


      Open item O4. The following is the **recommended** fallback (to be confirmed
      by the marketplace and Payments Operations). No decision is recorded.


      ### 8.1 Recommended escalation ladder


      1. **Tier 1 — Automated reminder.** If the marketplace/seller has not responded
      within the internal SLA (e.g., 3 business days), send an automated reminder
      with the hard network deadline.

      2. **Tier 2 — Support-agent escalation.** If still no response by a second threshold
      (e.g., 5 business days), route to Mosaic Relay support for manual handling and
      direct outreach.

      3. **Tier 3 — Network-deadline fallback.** If the marketplace/seller has not
      responded by the network deadline, the portal must **not** let the deadline
      lapse silently. Recommended default: **auto-submit a network response on the
      merchant of record''s behalf** reflecting the buyer''s claim and available evidence,
      or **issue a provisional refund** to the buyer to avoid an adverse network outcome,
      per the marketplace''s policy. **This is the key decision point** — it must
      be resolved before launch because it determines chargeback liability and buyer
      outcomes.


      ### 8.2 Decision point


      The marketplace must choose, before launch, the Tier 3 behavior:

      - **(a) Auto-submit the buyer''s claim** to the network as the merchant-of-record
      response (preserves the buyer''s position, may result in a chargeback against
      the seller).

      - **(b) Provisional refund to the buyer** and absorb/allocate the loss (protects
      the buyer and avoids an adverse network outcome, but costs the marketplace/seller).

      - **(c) Manual-only** — no auto-action; risk of an adverse network outcome (default
      loss) if the deadline lapses.


      Recommendation: **(a) or (b)** — never (c), because a silent lapse converts
      a resolvable dispute into a guaranteed adverse network outcome and a consumer-protection
      risk. The choice between (a) and (b) is a business/risk decision for the marketplace
      and Payments Operations.


      ---


      ## 9. Legal requirements versus customer policy choices


      | Item | Classification | Owner |

      |------|---------------|-------|

      | Merchant-of-record determination and who responds to network disputes | **Legal**
      (determines liability) | Legal + Marketplace |

      | Network chargeback deadlines and clock rules | **Legal** (network-mandated)
      | Legal sets; Payments Ops implements |

      | Required notices (N1–N11) and plain-language disclosure | **Legal** (consumer-protection
      floor) | Legal sets; Payments Ops implements |

      | English-plus-Spanish language support | **Policy + risk** (no hard federal
      mandate) | Payments Ops (with Legal review) |

      | Evidence collection minimums and integrity/retention | **Legal** (network
      + consumer-protection floor) | Legal sets; Payments Ops implements |

      | Status labels — fixed set | **Legal** | Legal |

      | Status labels — wording and internal sub-statuses | **Policy** | Payments
      Ops |

      | Internal response SLAs (within the network deadline) | **Policy** | Payments
      Ops |

      | Escalation Tier 3 behavior (auto-submit vs. provisional refund) | **Policy
      + risk** (must be decided) | Marketplace + Payments Ops |

      | Seller-term allocation of dispute/refund/chargeback responsibility | **Legal**
      (contract) | Legal + Marketplace |


      ---


      ## 10. Owners and open work items


      ### 10.1 Owners


      - **Legal (Lawyer):** Sets the legal requirements — merchant-of-record determination,
      network-deadline compliance, required notices, evidence floor, fixed status
      labels, seller-term allocation.

      - **Payments Operations:** Owns the operating-model decisions — internal SLAs,
      status-label wording, buyer/seller/marketplace communications, escalation implementation,
      evidence retention operations.

      - **Marketplace (customer):** Decides the Tier 3 escalation behavior, seller-term
      allocation, and any policy choices beyond the legal floor.

      - **Risk & Fraud:** Supports evidence integrity, fraud review, and escalation
      handling.

      - **Product/Engineering:** Builds the portal to the requirements; implements
      the configurable clock logic and bilingual flows.


      ### 10.2 Open work items (before launch)


      | # | Work item | Owner | Needed by |

      |---|-----------|-------|-----------|

      | W1 | Confirm merchant of record / customer of record for the card transactions
      | Legal + Marketplace | Before launch |

      | W2 | Confirm which card networks and regions the initial release supports
      | Product + Marketplace | Before launch |

      | W3 | Verify current Visa/Mastercard chargeback timeframes, reason codes, and
      evidence requirements for the four categories | Legal (research in progress)
      | Before launch |

      | W4 | Check whether marketplace seller terms and marketplace terms allocate
      dispute/refund/chargeback responsibility; amend if silent | Legal + Marketplace
      | Before launch |

      | W5 | Decide Tier 3 escalation behavior (auto-submit vs. provisional refund
      vs. manual) | Marketplace + Payments Ops | Before launch |

      | W6 | Verify FTC MTO rule applicability to the marketplace and sellers | Legal
      | Before launch |

      | W7 | Confirm accessibility (ADA/WCAG) requirements for the portal | Legal
      (research in progress) | Before launch |

      | W8 | Draft English and Spanish notice text and plain-language disclosures
      | Legal + Payments Ops | Before launch |

      | W9 | Build configurable deadline/clock logic to verified network rules | Product/Engineering
      | Before launch |

      | W10 | Define evidence retention schedule and audit-trail controls | Payments
      Ops + Legal | Before launch |


      ---


      ## Material assumptions and missing facts


      - **Merchant of record** is assumed to be the marketplace (Mosaic Relay as service
      provider). If Mosaic Relay is the merchant of record, the entire response/liability
      model shifts to Mosaic Relay.

      - **Networks/regions** assumed U.S. Visa/Mastercard for the initial release.
      Adding Amex, Discover, or non-U.S. regions changes deadlines, evidence rules,
      and notices.

      - **Seller terms** assumed not to allocate dispute responsibility; must be checked
      and amended if silent.

      - **Escalation Tier 3** behavior is undecided and is the single most important
      pre-launch decision.

      - **Reg E/Reg Z** obligations run to the card issuer, not to Mosaic Relay or
      the marketplace; the portal''s role is evidence collection and transmission.

      - **Network timeframes, consumer-protection notices, and accessibility** are
      the subject of in-progress research runs and must be verified against current
      rules before the portal''s clock logic and notices are finalized.

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '# '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Consumer
    change_id: CHG-20260903-7b41b3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Reconciled
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Reconciled
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Dispute
    change_id: CHG-20260903-4ca8a3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Research
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Research
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Portal
    change_id: CHG-20260903-618b50
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Packet
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Packet
  - kind: insert
    text: ' — '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal
    change_id: CHG-20260903-40b155
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Consumer
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Consumer
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Requirements
    change_id: CHG-20260903-47acca
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Protection
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Protection
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Recommended
    change_id: CHG-20260903-c64d26
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Card-Network
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Card-Network
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Operating Model
    change_id: CHG-20260903-ab48f8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Questions
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Questions
  - kind: insert
    text: '


      **Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications

      **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Status:** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Draft
    change_id: CHG-20260903-25d115
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Research
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Research
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: for review
    change_id: CHG-20260903-75d7e6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: packet
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: packet
  - kind: insert
    text: ' — **no decision recorded.**

      **Target release:** 2026-10-15 (six weeks)'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-cf11c7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '.


        ---


        ## 0. Source-label key


        Every item below is tagged with one of these labels:


        - '
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '.


      ---


      ## 0. Source-label key


      Every item below is tagged with one of these labels:


      - '
  - kind: insert
    text: '**'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Scope:'
    change_id: CHG-20260903-1089bd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[VERIFIED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[VERIFIED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Consumer-only
    change_id: CHG-20260903-19371b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: buyers;
    change_id: CHG-20260903-c8a1e1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: a
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: a
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: card
    change_id: CHG-20260903-78bded
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: fact
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: fact
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: purchases;
    change_id: CHG-20260903-439820
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: confirmed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: confirmed
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: English
    change_id: CHG-20260903-e5d726
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: in
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: in
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: plus
    change_id: CHG-20260903-83adbb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Spanish;
    change_id: CHG-20260903-0a3931
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: matter
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: matter
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: U.S.-focused initial release
    change_id: CHG-20260903-a9a2ea
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: record
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: record
  - kind: insert
    text: ' ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'assumption)


      This'
    change_id: CHG-20260903-28cbc7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: supplied
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: supplied
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: draft
    change_id: CHG-20260903-d97b08
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: by
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: by
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: sets
    change_id: CHG-20260903-b2dd92
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: out
    change_id: CHG-20260903-45949b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'requester or recorded in intake).

        - **[SUPPLIED]** — a fact or direction given by the requester / recorded in
        the matter record, not independently verified.

        - **[UNVERIFIED LEAD]** — a legal or factual point that is material but not
        yet confirmed; needs a specific source or document before it can be relied
        on.

        - **[ASSUMPTION]** — a working assumption adopted to proceed; the answer changes
        if it is wrong.

        - **[GENERATED]** — analysis produced from general knowledge of'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'requester or recorded in intake).

      - **[SUPPLIED]** — a fact or direction given by the requester / recorded in
      the matter record, not independently verified.

      - **[UNVERIFIED LEAD]** — a legal or factual point that is material but not
      yet confirmed; needs a specific source or document before it can be relied on.

      - **[ASSUMPTION]** — a working assumption adopted to proceed; the answer changes
      if it is wrong.

      - **[GENERATED]** — analysis produced from general knowledge of'
  - kind: insert
    text: ' the legal'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: requirements and the recommended operating model for launch. It incorporates
      the reconciled research packet (source-labeled) and the formal recommendation.
      It separates
    change_id: CHG-20260903-c33b8a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: framework;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: framework;
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: legal
    change_id: CHG-20260903-a5db07
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: not
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: not
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: requirements
    change_id: CHG-20260903-ef31eb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: retrieved authority
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: retrieved authority
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (fixed)
    change_id: CHG-20260903-1f5efc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: from
    change_id: CHG-20260903-a6f26c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'must be verified against current primary sources.

        -'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'must be verified against current primary sources.

      -'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: customer policy choices
    change_id: CHG-20260903-77e0e8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[BRIEFING]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[BRIEFING]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (owned
    change_id: CHG-20260903-4941f8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: by
    change_id: CHG-20260903-26eea0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: drawn
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: drawn
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Payments Operations /
    change_id: CHG-20260903-328425
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: from
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: from
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: marketplace
    change_id: CHG-20260903-b1088a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'Counsel OS briefing context used to frame the matter.


        **Critical caveat on the existing research memo:** The prior research run
        (the internal record'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'Counsel OS briefing context used to frame the matter.


      **Critical caveat on the existing research memo:** The prior research run (the
      internal record'
  - kind: insert
    text: )
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '. The '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Tier
    change_id: CHG-20260903-7ebb3c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: two
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: two
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '3'
    change_id: CHG-20260903-1d7d8e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: companion
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: companion
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: escalation
    change_id: CHG-20260903-5013a2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: research
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: research
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: default
    change_id: CHG-20260903-a7ac13
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: runs
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: runs
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-964ad9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (consumer-protection
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (consumer-protection
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: recommended
    change_id: CHG-20260903-9b13da
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: notices;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: notices;
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: as
    change_id: CHG-20260903-5cb019
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: accessibility/language access) are still
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: accessibility/language access) are still
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: auto-submit with no silent lapse
    change_id: CHG-20260903-726d5f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: running/queued
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: running/queued
  - kind: insert
    text: '**'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260903-51db7c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: with
    change_id: CHG-20260903-c29806
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-33b534
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: have
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: have
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: marketplace's
    change_id: CHG-20260903-14ca7a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: not
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: not
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: policy
    change_id: CHG-20260903-300235
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: produced
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: produced
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: choice
    change_id: CHG-20260903-6cc738
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: retrievable
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: retrievable
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: clearly flagged
    change_id: CHG-20260903-83ab1f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: authority
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: authority
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '


      ---


      ## 1. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Factual record
    change_id: CHG-20260903-7e15a0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Verified
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Verified
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'assumptions


      ### 1.1 Confirmed'
    change_id: CHG-20260903-f66a2a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: supplied
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: supplied
  - kind: insert
    text: ' facts ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: verified in
    change_id: CHG-20260903-1e5747
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: from
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: from
  - kind: insert
    text: ' the matter record)


      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| # | Fact | Status |

      |'
    change_id: CHG-20260903-432e77
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '--|------|--------|

      |'
    change_id: CHG-20260903-78d809
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F1 |
    change_id: CHG-20260903-1f847b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[VERIFIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[VERIFIED]**'
  - kind: insert
    text: ' A consumer-facing marketplace asks Mosaic Relay to provide a dispute portal
      for card purchases. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-120e75
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Request)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Request)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-337552
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F2 |
    change_id: CHG-20260903-875a19
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[VERIFIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[VERIFIED]**'
  - kind: insert
    text: ' Proposed dispute categories: non-receipt, unauthorized use, duplicate
      charges, defective goods. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-c4bb98
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Request)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Request)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-5d5256
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F3 |
    change_id: CHG-20260903-f2d062
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[VERIFIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[VERIFIED]**'
  - kind: insert
    text: ' The portal collects statements and documents, sends automated messages,
      and routes cases to the marketplace or seller. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-9aa7c1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Request)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Request)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-b6112a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F4 |
    change_id: CHG-20260903-46887f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[VERIFIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[VERIFIED]**'
  - kind: insert
    text: ' Actors include buyers, sellers, the marketplace, Mosaic Relay, card networks,
      issuers, and support agents. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-cc22b6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Request)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Request)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-e6dc67
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F5 |
    change_id: CHG-20260903-23f668
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[VERIFIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[VERIFIED]**'
  - kind: insert
    text: ' Initial release target is 2026-10-15 (six weeks). '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-500fec
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Request)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Request)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-683684
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F6 |
    change_id: CHG-20260903-66d551
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Buyers using the portal are **consumers only** (not business purchasers). '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-79d0af
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Intake)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Intake)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-658771
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F7 |
    change_id: CHG-20260903-1b2d3b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Portal and notices must support **English plus Spanish** for the initial
      release. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-be9740
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Intake)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Intake)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-d3ce69
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F8 |
    change_id: CHG-20260903-f0c864
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' **Payments Operations** owns the operating-model decisions (notices, deadlines,
      status labels, escalation paths) once legal sets the requirements. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-edd747
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Intake)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Intake)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-4504ab
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F9 |
    change_id: CHG-20260903-18c6bd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Evidence rules and status labels are **mixed'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**'
    change_id: CHG-20260903-77b88c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' — some fixed legal requirements, some customer policy choices'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-30a1ad
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Intake)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Intake)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-06c938
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: F10 |
    change_id: CHG-20260903-dc1d25
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Direction given to **draft with best-available assumptions** for the still-open
      items. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Verified |'
    change_id: CHG-20260903-69dc91
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Intake)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Intake)
  - kind: insert
    text: '


      ###'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' 1.2'
    change_id: CHG-20260903-1bb56e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' Open facts ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: unverified
    change_id: CHG-20260903-533278
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: recorded,
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: recorded,
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: — need confirmation before launch
    change_id: CHG-20260903-486335
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: unresolved
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: unresolved
  - kind: insert
    text: )
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '


      | # | Open item | Current state |'
    change_id: CHG-20260903-894a57
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-9c7ec4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '--|-----------|---------------|

      |'
    change_id: CHG-20260903-388e6c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: O1 |
    change_id: CHG-20260903-030959
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Merchant of record / customer of record '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: for
    change_id: CHG-20260903-e0f631
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the card transactions | Not
    change_id: CHG-20260903-9f5e07
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**not'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**not'
  - kind: insert
    text: ' yet determined'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '— '
    change_id: CHG-20260903-26a005
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (
  - kind: insert
    text: being decided
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' |'
    change_id: CHG-20260903-a53a97
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ).
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ).
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-9ce3d1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: O2
    change_id: CHG-20260903-512c3b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Which card'
    change_id: CHG-20260903-cba5d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Card
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Card
  - kind: insert
    text: ' networks and regions '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'the initial release '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: must
    change_id: CHG-20260903-60a4d4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: support | Not
    change_id: CHG-20260903-535436
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**not'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**not'
  - kind: insert
    text: ' yet determined'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' |'
    change_id: CHG-20260903-2e8a7b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**.'
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-149022
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: O3 |
    change_id: CHG-20260903-e470da
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Whether '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'marketplace '
    change_id: CHG-20260903-c363ce
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: seller
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' terms and '
    change_id: CHG-20260903-a9f04a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: /
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: /
  - kind: insert
    text: 'marketplace terms allocate dispute/refund/chargeback responsibility '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-14f046
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Not
    change_id: CHG-20260903-318999
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**not'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**not'
  - kind: insert
    text: ' sure'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' —'
    change_id: CHG-20260903-5cb53d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ','
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ','
  - kind: insert
    text: ' need to check'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' |'
    change_id: CHG-20260903-3e8daf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**.'
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-5bc849
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '-'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '-'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: O4 |
    change_id: CHG-20260903-d589cc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**[SUPPLIED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**[SUPPLIED]**'
  - kind: insert
    text: ' Escalation'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' behavior'
    change_id: CHG-20260903-ced9f7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' when the marketplace'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' or '
    change_id: CHG-20260903-78c7a1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: /
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: /
  - kind: insert
    text: 'seller does not respond within the network deadline '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-50153f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Not
    change_id: CHG-20260903-75bb92
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**not'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**not'
  - kind: insert
    text: ' yet decided'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' — '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: recommendation provided (Section 8) |
    change_id: CHG-20260903-5ce663
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: applicability
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: applicability
  - kind: insert
    text: '


      ### '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '1.3'
    change_id: CHG-20260903-a2a3d1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: What
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: What
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Working
    change_id: CHG-20260903-bf89ab
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: assumptions
    change_id: CHG-20260903-16bfb0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'briefing and draft assume

        - **[BRIEFING][GENERATED]** The FTC Mail, Internet, or Telephone Order Merchandise
        Rule'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'briefing and draft assume

      - **[BRIEFING][GENERATED]** The FTC Mail, Internet, or Telephone Order Merchandise
      Rule'
  - kind: insert
    text: ' ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: best-available
    change_id: CHG-20260903-d19698
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 16 C.F.R. Part 435) requires a merchant selling goods by mail
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 16 C.F.R. Part 435) requires a merchant selling goods by mail
  - kind: insert
    text: ','
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' to be confirmed'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: )
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '- **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: A1
    change_id: CHG-20260903-11542d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]**'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]**'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-3df275
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Many
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Many
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Merchant
    change_id: CHG-20260903-6c497b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: states
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: states
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: of
    change_id: CHG-20260903-de24e3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: have
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: have
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: record
    change_id: CHG-20260903-e6cf49
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: unfair-and-deceptive-acts-and-practices (UDAP) statutes and state-specific
        refund/notice requirements that may impose obligations beyond federal law
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: unfair-and-deceptive-acts-and-practices (UDAP) statutes and state-specific
      refund/notice requirements that may impose obligations beyond federal law
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '** The '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'marketplace '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' the merchant of record; Mosaic Relay '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is a payments-infrastructure
    change_id: CHG-20260903-ee7de0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: as
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: as
  - kind: insert
    text: ' service provider'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260903-2b1987
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: not
    change_id: CHG-20260903-252b6c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-9bdff4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: still
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: still
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: merchant of record. *If wrong* (Mosaic Relay is the merchant of record or
      a payment facilitator treated as such), Mosaic Relay itself becomes the party
      that must respond
    change_id: CHG-20260903-7d047e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: build
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: build
  - kind: insert
    text: ' to '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: network
    change_id: CHG-20260903-a97ec9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: WCAG
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: WCAG
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: disputes and bear chargeback liability, and the entire operating model shifts
      — likely delaying the six-week launch
    change_id: CHG-20260903-5753e7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '2'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '2'
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      -'
    change_id: CHG-20260903-14d639
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '1'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '1'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**A2'
    change_id: CHG-20260903-76a263
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: AA
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: AA
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '— Networks and regions.** Initial release covers U.S. consumer card purchases
      subject to Visa and Mastercard chargeback rules and U.S. consumer-protection
      law. *If wrong* (e.g., Amex, Discover, or non-U.S. regions added), deadlines,
      evidence rules, and notice obligations change materially.

      - **A3 — Seller terms.** Seller/marketplace terms do not yet allocate dispute/refund/chargeback
      responsibility; this must be checked and addressed. *If wrong* (terms already
      allocate), the portal''s routing and cost-bearer logic must conform to the existing
      allocation.

      - **A4 — Escalation.** When the marketplace or seller does not respond within
      the network deadline, the portal needs'
    change_id: CHG-20260903-3d35d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: as
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: as
  - kind: insert
    text: ' a '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: defined
    change_id: CHG-20260903-f25353
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: baseline
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: baseline
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: fallback.
    change_id: CHG-20260903-e09f03
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: to
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: to
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Recommended: **auto-submit with no silent lapse** (Section 8). *If wrong*,
      the fallback must be replaced with'
    change_id: CHG-20260903-a7110e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: reduce
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: reduce
  - kind: insert
    text: ' the marketplace''s '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: chosen
    change_id: CHG-20260903-e49433
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: behavior
    change_id: CHG-20260903-813f02
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: its own exposure
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: its own exposure
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: A5
    change_id: CHG-20260903-313392
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Draft
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-6b84ea
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'change 2:** Re-label accessibility from an "unverified lead" to a **pre-launch
        work item owned by Payments Operations** with a WCAG 2.1 AA baseline, and
        add a state-law scoping work item (identify the states where the marketplace
        operates and screen UDAP/refund statutes). The draft''s Section 2.2 already
        lists these as leads; the packet confirms they must become tracked work items,
        not just notes.


        ---


        ## 4.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'change 2:** Re-label accessibility from an "unverified lead" to
      a **pre-launch work item owned by Payments Operations** with a WCAG 2.1 AA baseline,
      and add a state-law scoping work item (identify the states where the marketplace
      operates and screen UDAP/refund statutes). The draft''s Section 2.2 already
      lists these as leads; the packet confirms they must become tracked work items,
      not just notes.


      ---


      ## 4.'
  - kind: insert
    text: ' Reg E'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: /
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Reg Z boundary
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: .
    change_id: CHG-20260903-71ae34
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ' for unauthorized use


        ### What the briefing and draft assume

        - **[BRIEFING][GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ' for unauthorized use


      ### What the briefing and draft assume

      - **[BRIEFING][GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Unauthorized-use
    change_id: CHG-20260903-cd2921
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: For
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: For
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: disputes
    change_id: CHG-20260903-3661ee
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: unauthorized
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: unauthorized
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: implicate
    change_id: CHG-20260903-97e71f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: use,
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: use,
  - kind: insert
    text: ' EFTA/Reg E (debit) and TILA/Reg Z / FCBA (credit) consumer protections'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ', which'
    change_id: CHG-20260903-546469
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' run to the **card issuer**, not to Mosaic Relay or the marketplace. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: This
    change_id: CHG-20260903-901493
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'The portal''s role is to collect and transmit evidence, not to adjudicate
        Reg E/Reg Z rights.


        ### Reconciliation

        - **[GENERATED]** Reg E liability limits (commonly $50 within 2 business days
        of notice; $500 within 60 days of statement) and Reg Z/FCBA 60-day billing-error
        windows run to the **issuer**. The portal must not impose a shorter window
        that could prejudice the buyer''s issuer rights.

        - **[GENERATED]** The unauthorized-use intake must capture the **date the
        buyer became aware** of the unauthorized use and the **statement date**, because
        those drive the issuer-side Reg E/Reg Z deadlines.

        - **[UNVERIFIED LEAD]** Whether the card transactions are debit (Reg E) or
        credit (Reg Z/FCBA)'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'The portal''s role is to collect and transmit evidence, not to
      adjudicate Reg E/Reg Z rights.


      ### Reconciliation

      - **[GENERATED]** Reg E liability limits (commonly $50 within 2 business days
      of notice; $500 within 60 days of statement) and Reg Z/FCBA 60-day billing-error
      windows run to the **issuer**. The portal must not impose a shorter window that
      could prejudice the buyer''s issuer rights.

      - **[GENERATED]** The unauthorized-use intake must capture the **date the buyer
      became aware** of the unauthorized use and the **statement date**, because those
      drive the issuer-side Reg E/Reg Z deadlines.

      - **[UNVERIFIED LEAD]** Whether the card transactions are debit (Reg E) or credit
      (Reg Z/FCBA)'
  - kind: insert
    text: ' is **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: conditional on the merchant-of-record assumption**
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ':'
    change_id: CHG-20260903-931677
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: . Add a note that
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: . Add a note that
  - kind: insert
    text: ' if Mosaic Relay or the marketplace is ever treated as the account-holding
      institution, additional Reg E/Reg Z duties would attach. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: The
    change_id: CHG-20260903-b48739
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Add
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Add
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: portal's
    change_id: CHG-20260903-22f372
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: intake
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: intake
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: role
    change_id: CHG-20260903-9f05c9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: fields
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: fields
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-7c3397
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: for
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: for
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: to
    change_id: CHG-20260903-294bcf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '"date'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '"date'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: collect
    change_id: CHG-20260903-dfe816
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: buyer became aware"
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: buyer became aware"
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: transmit
    change_id: CHG-20260903-54584b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '"statement'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '"statement'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: evidence,
    change_id: CHG-20260903-db969c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: date"
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: date"
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'not '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: to
    change_id: CHG-20260903-795f20
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: policy),
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: policy),
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: adjudicate
    change_id: CHG-20260903-142144
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: since
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: since
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Reg
    change_id: CHG-20260903-30f623
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: they
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: they
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: E/Reg
    change_id: CHG-20260903-c1824e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: drive
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: drive
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Z
    change_id: CHG-20260903-33e064
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: issuer-side
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: issuer-side
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: rights
    change_id: CHG-20260903-e52a44
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: deadlines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: deadlines
  - kind: insert
    text: '.


      ---


      ## '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '2'
    change_id: CHG-20260903-90dfa9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '5'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '5'
  - kind: insert
    text: '. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Consumer-protection
    change_id: CHG-20260903-403c86
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Visa/Mastercard dispute timeframes
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Visa/Mastercard dispute timeframes
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: payment-network
    change_id: CHG-20260903-d2dc21
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: evidence
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: evidence
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: issues (source-labeled)
    change_id: CHG-20260903-c692c4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: rules
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: rules
  - kind: insert
    text: '


      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: This
    change_id: CHG-20260903-35bd5d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '###'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '###'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: section
    change_id: CHG-20260903-d63219
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Status
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Status
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: separates
    change_id: CHG-20260903-d0401f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: of
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: of
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**verified**'
    change_id: CHG-20260903-30d903
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: anchors
    change_id: CHG-20260903-5b486b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: existing
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: existing
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'from **unverified leads** that require confirmation before launch. Source
      labels:'
    change_id: CHG-20260903-a09878
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'research

        -'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'research

      -'
  - kind: insert
    text: ' **['
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: VERIFIED
    change_id: CHG-20260903-7bcd9e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: GENERATED
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: GENERATED
  - kind: insert
    text: ']** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: confirmed
    change_id: CHG-20260903-91464a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: The
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: The
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: in
    change_id: CHG-20260903-52c5a9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: prior
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: prior
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-d3a1d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: research
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: research
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: matter
    change_id: CHG-20260903-659520
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: memo
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: memo
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: record
    change_id: CHG-20260903-8852ff
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'lists Visa reason codes (13.1 non-receipt, 10.4/10.5 unauthorized, 12.1
        duplicate, 13.3 defective) and Mastercard reason codes (4855, 4837/4863, 4834,
        4853), with Visa ~30-day and Mastercard ~45-day merchant response windows
        and ~120-day cardholder filing windows.

        - **These figures are [GENERATED] and NOT verified.** The external research
        provider timed out'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'lists Visa reason codes (13.1 non-receipt, 10.4/10.5 unauthorized,
      12.1 duplicate, 13.3 defective) and Mastercard reason codes (4855, 4837/4863,
      4834, 4853), with Visa ~30-day and Mastercard ~45-day merchant response windows
      and ~120-day cardholder filing windows.

      - **These figures are [GENERATED] and NOT verified.** The external research
      provider timed out'
  - kind: insert
    text: ;
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' **['
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: SUPPLIED
    change_id: CHG-20260903-c17601
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: GENERATED
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: GENERATED
  - kind: insert
    text: ']** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: given
    change_id: CHG-20260903-ba8f71
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: The
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: The
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: by
    change_id: CHG-20260903-a922ef
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: portal's clock logic and evidence checklists must be built to
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: portal's clock logic and evidence checklists must be built to
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: requester;
    change_id: CHG-20260903-bbe5b9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**verified current rules for the networks actually supported** (open
        item: networks/regions not yet determined). The draft''s placeholder deadlines
        (Section 5) are correct as placeholders but must not be hard-coded.

        -'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**verified current rules for the networks actually supported**
      (open item: networks/regions not yet determined). The draft''s placeholder deadlines
      (Section 5) are correct as placeholders but must not be hard-coded.

      -'
  - kind: insert
    text: ' **[UNVERIFIED LEAD]** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: material
    change_id: CHG-20260903-332c63
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'Whether Mosaic Relay is a "payment facilitator" or "facilitator" under
        network rules — which can shift who is treated as the merchant of record for
        chargeback purposes — is **not confirmed** and depends on the acquiring/processor
        contract.

        - **[UNVERIFIED LEAD]** Visa Compelling Evidence 3.0 and Mastercard Dispute
        Resolution Initiative (DRI) updates were referenced in the prior memo'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'Whether Mosaic Relay is a "payment facilitator" or "facilitator"
      under network rules — which can shift who is treated as the merchant of record
      for chargeback purposes — is **not confirmed** and depends on the acquiring/processor
      contract.

      - **[UNVERIFIED LEAD]** Visa Compelling Evidence 3.0 and Mastercard Dispute
      Resolution Initiative (DRI) updates were referenced in the prior memo'
  - kind: insert
    text: ' but '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: unconfirmed;
    change_id: CHG-20260903-fd837c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**not verified** against current network publications.


        ### Concrete change needed in the draft

        - **Draft change 4:** Keep the draft''s "network-rule verification needed"
        caveat but make it a **hard launch gate**: the clock logic and evidence checklists
        must not ship until the current Visa/Mastercard rules for the supported networks
        are pulled and reconciled. Add a work item to retrieve the current network
        guides and map each of the four categories to the verified reason code, filing
        window, and evidence requirements.


        ---


        ## 6. Merchant-of-record / payment-facilitator implications


        ### What the briefing and draft assume

        -'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**not verified** against current network publications.


      ### Concrete change needed in the draft

      - **Draft change 4:** Keep the draft''s "network-rule verification needed" caveat
      but make it a **hard launch gate**: the clock logic and evidence checklists
      must not ship until the current Visa/Mastercard rules for the supported networks
      are pulled and reconciled. Add a work item to retrieve the current network guides
      and map each of the four categories to the verified reason code, filing window,
      and evidence requirements.


      ---


      ## 6. Merchant-of-record / payment-facilitator implications


      ### What the briefing and draft assume

      -'
  - kind: insert
    text: ' **[ASSUMPTION]** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'working assumption; **[GENERATED]** analysis from general knowledge, not
      retrieved authority; **[BRIEFING]** from the briefing context.


      **Critical caveat:** '
    change_id: CHG-20260903-da6158
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: The
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' prior research run is **model-only** — no external authority was retrieved
      (external research timed out). Its Visa/Mastercard timeframes, reason codes,
      and Reg E/EFTA figures are **[GENERATED]**, not verified current network rules.
      The consumer-protection-notice and accessibility research runs are still running/queued.
      **Nothing here should be treated as verified current law or current network
      rules.**


      ### 2.1 Verified anchors


      - **V1 — Merchant-of-record determines who responds.** The party that must respond
      to a card-network chargeback and bear the liability is the merchant of record.
      Because Mosaic Relay is (assumed) a service provider and the'
    change_id: CHG-20260903-dacc2b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' marketplace is the merchant of record'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: marketplace
    change_id: CHG-20260903-5829e4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: merchant
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: merchant
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (and
    change_id: CHG-20260903-af74d5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'of record.

        - **[ASSUMPTION]** The initial release is U.S.-focused'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'of record.

      - **[ASSUMPTION]** The initial release is U.S.-focused'
  - kind: insert
    text: ', '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: per
    change_id: CHG-20260903-ce25f0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Visa/Mastercard
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Visa/Mastercard
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: its
    change_id: CHG-20260903-6b79ca
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: consumer
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: consumer
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: terms,
    change_id: CHG-20260903-ec58c7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: card
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: card
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: sellers) must respond to network disputes
    change_id: CHG-20260903-0125ad
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: purchases
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: purchases
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: This
    change_id: CHG-20260903-fbeb91
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'Reconciliation

        - **[GENERATED]** Merchant-of-record status'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'Reconciliation

      - **[GENERATED]** Merchant-of-record status'
  - kind: insert
    text: ' is the single most decision-changing fact.'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      -'
    change_id: CHG-20260903-250401
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**V2'
    change_id: CHG-20260903-d945ee
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: It
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: It
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-0051f6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: determines
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Card-
    change_id: CHG-20260903-6a80be
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'who must respond to '
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'who must respond to '
  - kind: insert
    text: 'network '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: rules are contractual
    change_id: CHG-20260903-229b3e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: disputes
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: disputes
  - kind: insert
    text: ', '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: not
    change_id: CHG-20260903-4dfa3f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: who
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: who
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: statutory.** Visa and Mastercard
    change_id: CHG-20260903-8e47f3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: bears
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: bears
  - kind: insert
    text: ' chargeback '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: timeframes, evidence requirements
    change_id: CHG-20260903-431a92
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: liability
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: liability
  - kind: insert
    text: ', and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: reason
    change_id: CHG-20260903-ea8e40
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: who
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: who
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: codes
    change_id: CHG-20260903-6dd74a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: is
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: is
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: are set by network operating rules that bind the acquirer and merchant of
      record. The portal's deadlines must be built
    change_id: CHG-20260903-3363d1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: subject
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: subject
  - kind: insert
    text: ' to '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-d29291
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: MTO
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: MTO
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: applicable
    change_id: CHG-20260903-a22dde
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: network
    change_id: CHG-20260903-740246
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: state
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: state
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: rules
    change_id: CHG-20260903-a6fba4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: consumer obligations
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: consumer obligations
  - kind: insert
    text: '.

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: V3
    change_id: CHG-20260903-f80c5e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[UNVERIFIED'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[UNVERIFIED'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: — Unauthorized-use disputes implicate EFTA/Reg E.
    change_id: CHG-20260903-560c74
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: LEAD]
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: LEAD]
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'For consumer card accounts, unauthorized-use protections under EFTA/Reg
      E (and, for credit, TILA § 170 / Reg Z) run to the card issuer. '
    change_id: CHG-20260903-d19195
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: 'The '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: portal's
    change_id: CHG-20260903-22a290
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: marketplace
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: marketplace
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: role is to collect
    change_id: CHG-20260903-6a9768
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: agreement
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: agreement
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: transmit
    change_id: CHG-20260903-a94ff9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Mosaic
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Mosaic
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: evidence,
    change_id: CHG-20260903-306bc8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Relay's
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Relay's
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: not
    change_id: CHG-20260903-7f062b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: acquiring/processor
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: acquiring/processor
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: to
    change_id: CHG-20260903-5f094b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: contracts
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: contracts
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: determine Reg E liability.
    change_id: CHG-20260903-2ef500
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: have
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: have
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Conditional
    change_id: CHG-20260903-b951dd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: not
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: not
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'on'
    change_id: CHG-20260903-9afead
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'been reviewed**. Whether Mosaic Relay is a "payment facilitator" under
        network rules is **not confirmed**.

        - **[GENERATED]** If Mosaic Relay is the merchant of record (or a payment
        facilitator treated as such), the entire operating model shifts: Mosaic Relay
        must respond to disputes, bear liability, and hold refund authority. This
        would likely delay the six-week launch.


        ### Concrete change needed in the draft

        - **Draft change 5:** The'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'been reviewed**. Whether Mosaic Relay is a "payment facilitator"
      under network rules is **not confirmed**.

      - **[GENERATED]** If Mosaic Relay is the merchant of record (or a payment facilitator
      treated as such), the entire operating model shifts: Mosaic Relay must respond
      to disputes, bear liability, and hold refund authority. This would likely delay
      the six-week launch.


      ### Concrete change needed in the draft

      - **Draft change 5:** The'
  - kind: insert
    text: ' merchant-of-record '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'status.**

      -'
    change_id: CHG-20260903-31b9a3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: assumption must be
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: assumption must be
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: V4
    change_id: CHG-20260903-953496
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: confirmed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: confirmed
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-51861e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: before
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: before
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Language
    change_id: CHG-20260903-e3ef46
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: access
    change_id: CHG-20260903-5da04a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: operating model is finalized**. Add a work item to review the marketplace
        agreement and Mosaic Relay's acquiring/processor contracts to confirm (a)
        who is the merchant of record and (b) whether Mosaic Relay
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: operating model is finalized**. Add a work item to review the marketplace
      agreement and Mosaic Relay's acquiring/processor contracts to confirm (a) who
      is the merchant of record and (b) whether Mosaic Relay
  - kind: insert
    text: ' is a '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: policy-plus-risk
    change_id: CHG-20260903-a105be
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: payment
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: payment
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: decision
    change_id: CHG-20260903-7556d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: facilitator
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: facilitator
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '** There is no general federal statute requiring a private marketplace
      to provide Spanish-language dispute communications'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: .
    change_id: CHG-20260903-aed581
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ;
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: The
    change_id: CHG-20260903-8d5c14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' English-plus-Spanish decision is primarily a customer-policy and risk
      choice'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ', '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: though
    change_id: CHG-20260903-6041ee
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: consumer
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: consumer
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: it
    change_id: CHG-20260903-597955
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: trust,
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: trust,
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-2e5199
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: state
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: state
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: a
    change_id: CHG-20260903-982e0f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: UDAP
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: UDAP
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**recorded'
    change_id: CHG-20260903-1aaf95
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: exposure),
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: exposure),
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: requirement**
    change_id: CHG-20260903-04fa15
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: informed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: informed
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: for
    change_id: CHG-20260903-db26db
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: by
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: by
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: initial
    change_id: CHG-20260903-27bbe9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: FTC's
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: FTC's
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: release
    change_id: CHG-20260903-c80d20
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '"clear and conspicuous" standard'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '"clear and conspicuous" standard'
  - kind: insert
    text: '.


      ### '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '2.2 Unverified leads (need confirmation before launch)


      - **L1 — Exact Visa/Mastercard chargeback timeframes and reason codes** for
      the four categories. *Research run in progress.* Network-specific and change;
      the clock logic must be built to verified current rules.'
    change_id: CHG-20260903-0049b9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Reconciliation
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Reconciliation
  - kind: insert
    text: '

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: L2 — Whether Mosaic Relay is a "facilitator" or "payment facilitator"
    change_id: CHG-20260903-33c1c0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: under
    change_id: CHG-20260903-0d7192
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Bilingual
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Bilingual
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'network rules, which can shift who is treated as the merchant of record
      for chargeback purposes. *Needs the acquiring/processor contract.*

      - **L3 — State consumer-protection laws** (UDAP statutes, state-specific refund
      and notice requirements) in the states where the marketplace operates. *Not
      yet scoped.*

      - **L4 — Accessibility obligations** (ADA/WCAG) for the consumer-facing portal.
      *Research run in progress.*

      - **L5 — Whether the marketplace is subject to the FTC MTO rule** (i.e., whether
      it is a "merchant" selling goods by mail/phone/internet) and whether sellers'
    change_id: CHG-20260903-4a61c9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: notices
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: notices
  - kind: insert
    text: ' are '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'separately subject to it. *Needs the marketplace''s business model and
      seller terms.*

      -'
    change_id: CHG-20260903-b0d0dc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: a
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: a
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: L6 — Card
    change_id: CHG-20260903-09a563
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: policy
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: policy
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: network data
    change_id: CHG-20260903-1d51d3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: plus
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: plus
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: security and evidence-handling rules
    change_id: CHG-20260903-1c75b9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: risk
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: risk
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (e.g.
    change_id: CHG-20260903-8411ca
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: decision
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: decision
  - kind: insert
    text: ','
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' PCI DSS, network mandates on storing and sharing cardholder data and dispute
      evidence). *Needs the network agreements and evidence-storage design.*

      - **L7 — Network evidence-sharing/redaction rules and privacy-law scope** (GLBA,
      state privacy laws, GDPR if EU buyers are involved). *Not scoped.*


      ---


      ## 3. Exact intake fields by dispute category


      The portal must collect the minimum evidence needed to support a network response
      and to let the marketplace/seller evaluate the claim. Questions below are the
      **legal floor**; the marketplace may add policy questions. All intake must be
      available in English and Spanish.


      ### 3.1 Common intake (all categories) — legal floor

      1. Order/transaction identifier (order number, transaction reference, or card
      statement line).

      2. Transaction date and amount.

      3. Card used (last four digits) and whether the buyer recognizes the charge.

      4. **Date the buyer first became aware of the issue** — *fixed legal field*
      (drives issuer-side Reg E/Reg Z deadlines).

      5. **Statement date** — *fixed legal field* (drives issuer-side Reg E/Reg Z
      deadlines).

      6. Whether the buyer has already contacted the seller or marketplace directly,
      and the outcome.

      7. Whether the buyer has already filed a dispute with their card issuer (and,
      if so, the issuer''s reference).

      8. Contact method and preferred language (English/Spanish) for dispute communications.


      ### 3.2 Non-receipt

      1. Was the item ever shipped? If known, provide tracking number and carrier.

      2. **What delivery date was promised at purchase?** — *fixed legal field* (MTO
      + network non-receipt reason codes).

      3. What is the current delivery status (delivered / in transit / no tracking
      / unknown)?

      4. If marked delivered, was the item left at the address, and is there any delivery
      photo or signature?

      5. Has the buyer requested a refund or replacement from the seller, and what
      was the response?

      6. Evidence to upload: order confirmation, tracking page, delivery photo, seller
      correspondence.


      ### 3.3 Unauthorized use

      1. Does the buyer recognize the transaction at all?

      2. Was the card or card details lost, stolen, or otherwise accessible to someone
      else?

      3. Does the buyer believe a family member, employee, or other authorized user
      made the charge?

      4. Has the buyer reported the unauthorized use to their card issuer, and has
      the issuer opened an investigation?

      5. Has the buyer filed a police report (if applicable)?

      6. Evidence to upload: card statement showing the charge, issuer correspondence,
      police report (if any).


      ### 3.4 Duplicate charges

      1. Was the buyer charged more than once for the same order?

      2. Provide the order number(s) and the duplicate transaction references/amounts.

      3. Was the buyer charged for an order they did'
    change_id: CHG-20260903-e18c23
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' not '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'place, or charged twice for one order?

      4. Has the buyer already received '
    change_id: CHG-20260903-0ea060
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: 'a '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: refund
    change_id: CHG-20260903-f3733d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: hard
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: hard
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: for
    change_id: CHG-20260903-683f2c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: federal
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: federal
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'one of the charges?

      5'
    change_id: CHG-20260903-c50e9d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: mandate
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: mandate
  - kind: insert
    text: '. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Evidence
    change_id: CHG-20260903-8cde0e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: The
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: The
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'to upload: card statement showing both charges, order confirmation('
    change_id: CHG-20260903-e5f3d1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft'
  - kind: insert
    text: s
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ').


      ###'
    change_id: CHG-20260903-f66cd1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '3.5 Defective goods

      1. What is the defect, and when was it discovered?

      2. Was the item used or installed before the defect appeared?

      3. Has the buyer contacted the seller or manufacturer about the defect, and
      what was the response?

      4. Is the buyer seeking a refund, replacement, or repair?

      5. Evidence to upload: photos/videos of the defect, order confirmation, seller
      correspondence, any warranty documents.


      ---


      ## 4. Mandatory'
    change_id: CHG-20260903-d8cdc7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: N1–N11
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: N1–N11
  - kind: insert
    text: ' notices and plain-language disclosure points '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (
    change_id: CHG-20260903-66f30d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'should all be delivered in '
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'should all be delivered in '
  - kind: insert
    text: English and Spanish
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ')


      All notices below must be provided in **English and Spanish** at the point of
      intake and at each status change. Plain-language drafting is required; legal
      boilerplate alone is insufficient for consumer-facing communications.


      ### 4.1 Intake-time disclosures (shown before the buyer submits)

      - **N1 — What the portal does and does not do.** State that the portal collects
      the buyer''s dispute and evidence and routes it to the marketplace/seller for
      review; it is not a guarantee of a refund and does not replace the buyer''s
      right to dispute the charge with their card issuer'
    change_id: CHG-20260903-a57a7c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '.

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: N2 — Card-issuer rights preserved.
    change_id: CHG-20260903-4cdca6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Tell
    change_id: CHG-20260903-ebf8c1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Machine
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Machine
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-47b91a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: translation
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: translation
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: buyer
    change_id: CHG-20260903-501c76
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: is
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: is
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: they
    change_id: CHG-20260903-4e9c03
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: insufficient;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: insufficient;
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: may
    change_id: CHG-20260903-e2f763
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: notices
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: notices
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: still
    change_id: CHG-20260903-fd6e4d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: contact
    change_id: CHG-20260903-f049a6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: be
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: be
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: their
    change_id: CHG-20260903-e713fa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: reviewed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: reviewed
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: card
    change_id: CHG-20260903-02c3ef
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: by
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: by
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: issuer
    change_id: CHG-20260903-d830b9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: a
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: a
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: to
    change_id: CHG-20260903-7dffc9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: native
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: native
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: dispute the charge,
    change_id: CHG-20260903-d096a6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: speaker
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: speaker
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: that
    change_id: CHG-20260903-84a65e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: tested
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: tested
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: using
    change_id: CHG-20260903-eb9f8e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'for plain-language clarity.


        ### Concrete change needed in'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'for plain-language clarity.


      ### Concrete change needed in'
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: portal does not waive that right.
    change_id: CHG-20260903-bc2345
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft
  - kind: insert
    text: '

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: N3
    change_id: CHG-20260903-1cffbc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Draft
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-b8f966
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: change
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: change
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: What happens next and expected timing.
    change_id: CHG-20260903-ba8384
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '6:'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '6:'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Describe
    change_id: CHG-20260903-ec30e4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Confirm
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Confirm
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: review
    change_id: CHG-20260903-f2f987
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft's
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft's
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: process,
    change_id: CHG-20260903-bef59d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: treatment
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: treatment
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-34c944
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: of
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: of
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: response-time
    change_id: CHG-20260903-f2fb56
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: bilingual
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: bilingual
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: target,
    change_id: CHG-20260903-ebb929
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: notices as policy-plus-risk (not a hard mandate)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: notices as policy-plus-risk (not a hard mandate)
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: how
    change_id: CHG-20260903-e4d2b9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: add a work item for **native-speaker review and plain-language testing**
        of all English/Spanish notices before launch. The draft already requires this;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: add a work item for **native-speaker review and plain-language
      testing** of all English/Spanish notices before launch. The draft already requires
      this;
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: buyer
    change_id: CHG-20260903-1fca8d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: packet
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: packet
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: will
    change_id: CHG-20260903-55fb1f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: confirms
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: confirms
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: be
    change_id: CHG-20260903-e737c1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: it
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: it
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: updated
    change_id: CHG-20260903-099a17
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: as a tracked deliverable
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: as a tracked deliverable
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: N4 — Evidence requirements.
    change_id: CHG-20260903-c7c3cd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Explain what evidence
    change_id: CHG-20260903-102203
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Evidence
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Evidence
  - kind: insert
    text: ' is'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' needed, that incomplete evidence may delay or prevent resolution, and
      that the buyer should not submit sensitive information (e.g., full card numbers,
      SSNs) beyond what is requested.

      - **N5 — Data use and sharing.** Disclose that submitted evidence will be'
    change_id: CHG-20260903-e7ab5a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' shared with the marketplace, seller, and (as needed) card networks and
      issuers'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' to resolve the dispute, and reference the privacy notice.

      - **N6 — No admission of liability.** A statement that submitting a dispute
      does not constitute an admission by the marketplace or seller.


      ### 4.2 Status-change notices (sent at each milestone)

      - **N7 — Acknowledgment.** Confirmation that the dispute was received, with
      a reference number and the expected next step.

      - **N8 — Evidence received / additional evidence requested.** Notification when
      evidence is complete or when more is needed, with a deadline to respond.

      - **N9 — Under review.** Notice that the marketplace/seller is reviewing the
      dispute.

      - **N10 — Resolution.** Notice of the outcome (refund issued, dispute denied,
      or escalated) with the reason and any next steps.

      - **N11 — Escalation.** Notice when the dispute is escalated (per Section 8)
      and what that means for the buyer.


      ### 4.3 Plain-language disclosure points

      - Use short sentences and common words'
    change_id: CHG-20260903-b2ef38
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '; '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'avoid legal jargon.

      - State deadlines in plain calendar terms (e.g., "within 10 calendar days")
      rather than network code references.

      - Provide the same content in both languages; do not rely on machine translation
      without review.

      - Make the "contact your card issuer" option prominent and easy to find.


      ---


      ## 5. Deadlines and clock rules (network-rule verification needed)


      **Critical caveat:** The exact deadlines below are **subject to verification
      against the current Visa/Mastercard operating rules for the networks actually
      supported** (open item O2). The research run on network timeframes is in progress.
      The portal''s clock logic must be configurable and built to the verified rules,
      not hard-coded to the placeholder values below. **Network-rule verification
      is a hard launch gate.**


      ### 5.1 Buyer-side deadlines (when the buyer must act)

      - **Unauthorized use / fraud:** Buyers should be encouraged to report promptly;
      card-issuer Reg E/Reg Z deadlines (typically 60 days from statement) run to
      the issuer, not the portal. The portal should not impose a shorter window that
      could prejudice the buyer''s issuer rights.

      - **Non-receipt / defective / duplicate:** The portal should allow reporting
      within a reasonable window (e.g., 60–120 days from transaction or expected delivery),
      subject to network reason-code filing windows for the merchant of record. **Verify**
      the applicable network filing windows.


      ### 5.2 Marketplace/seller response deadlines

      - **Network response window:** The merchant of record must respond to a chargeback
      within the network''s response window (commonly ~10–30 days depending on network
      and reason code). **Verify** the exact window for each supported network and
      reason code.

      - **Portal internal SLA:** The portal should target a response well inside the
      network window (e.g., respond within 5–7 business days) to leave buffer for
      evidence review and network submission. This is a **policy choice** owned by
      Payments Operations, subject to the hard network deadline.


      ### 5.3 Clock rules

      - **Clock start:** The response clock starts when the network/issuer files the
      chargeback or when the buyer submits the dispute, whichever is earlier for the
      merchant-of-record obligation. **Verify** the network''s clock-start trigger.

      - **Calendar vs. business days:** Network deadlines are typically calendar days;
      internal SLAs may be business days. The portal must track both and display the
      earlier hard deadline.

      - **Time zones:** Use a single reference time zone for all deadline calculations
      and display deadlines in the buyer''s local time.

      - **No auto-fail on the buyer:** The portal must not let an internal SLA lapse
      cause the buyer''s dispute to be automatically denied in a way that prejudices
      their issuer rights.


      ---


      ## 6. Evidence collection, file '
    change_id: CHG-20260903-485f6b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: sharing
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ', retention, and integrity rules


      ### 6.1 Collection

      - Collect only the evidence needed for the category (Section 3), in English
      and Spanish intake flows.

      - Accept common formats (PDF, JPG, PNG) with size limits; reject executable
      or script files.

      - Do not request or store full card numbers, SSNs, or other sensitive data beyond
      what is necessary; mask card data.


      ### 6.2 File sharing

      - Evidence is shared with the marketplace, the seller (per the marketplace''s
      terms and routing), and, as needed, card networks and issuers to support the
      network response.

      - Sharing'
    change_id: CHG-20260903-443bd0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' must be limited to what is necessary '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'for the dispute '
    change_id: CHG-20260903-838efb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: and consistent with the privacy notice
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' (N5)'
    change_id: CHG-20260903-45f973
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '.

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Verify
    change_id: CHG-20260903-06cdd1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: network
    change_id: CHG-20260903-30faaa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Retention
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Retention
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: rules on what evidence may
    change_id: CHG-20260903-18204c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' be'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' shared and any redaction requirements.


      ### 6.3 Retention

      - Retain dispute records and evidence for'
    change_id: CHG-20260903-080dc9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' the longer of'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ':'
    change_id: CHG-20260903-e3baed
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' the network''s required retention period, the applicable statute of limitations'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' for consumer claims'
    change_id: CHG-20260903-28b3ce
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ', and Mosaic Relay''s/the marketplace''s record-retention policy.'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '

      - **Verify** the network''s evidence-retention mandate and any state record-retention
      requirements.'
    change_id: CHG-20260903-a7a1a8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '


      ### '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '6.4 Integrity (fixed legal requirement)

      - Preserve evidence in an immutable, timestamped record with a clear audit trail
      (who uploaded, when, and any changes).

      - Prevent tampering: store originals, log access, and restrict edit/delete rights
      to authorized personnel.

      - Maintain a chain of custody for evidence that may be submitted to a network
      or used in a dispute.


      ---


      ## 7. Status labels and buyer/seller/marketplace communications


      ### 7.1 Status labels (mixed legal/policy)

      Per the recorded direction, status labels are **mixed** — some fixed by legal,
      some policy choices owned by Payments Operations.


      **Fixed (legal/network-mandated) labels:**'
    change_id: CHG-20260903-a4e92e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Reconciliation
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Reconciliation
  - kind: insert
    text: '

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Received
    change_id: CHG-20260903-d012e1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[UNVERIFIED LEAD]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[UNVERIFIED LEAD]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-9e5f05
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Network
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Network
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: dispute
    change_id: CHG-20260903-7f2cae
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: rules
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: rules
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: submitted
    change_id: CHG-20260903-207860
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: on what evidence may be shared
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: on what evidence may be shared
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: acknowledged
    change_id: CHG-20260903-3f44bc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: any redaction requirements are **not verified**
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: any redaction requirements are **not verified**
  - kind: insert
    text: '.

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Under
    change_id: CHG-20260903-afea85
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[UNVERIFIED'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[UNVERIFIED'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: review
    change_id: CHG-20260903-f9df2e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: LEAD]
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: LEAD]
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-de7a26
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Privacy
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Privacy
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: marketplace/seller
    change_id: CHG-20260903-4e3ae0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: law
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: law
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: reviewing
    change_id: CHG-20260903-e47b4e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: limits on sharing (GLBA, state privacy laws, GDPR if EU buyers are involved)
        are **not scoped**. The initial release is assumed U.S.-focused, but if EU/LatAm
        buyers are later included, GDPR and local data-protection rules would apply
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: limits on sharing (GLBA, state privacy laws, GDPR if EU buyers
      are involved) are **not scoped**. The initial release is assumed U.S.-focused,
      but if EU/LatAm buyers are later included, GDPR and local data-protection rules
      would apply
  - kind: insert
    text: '.

      - **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Additional evidence requested
    change_id: CHG-20260903-ba8e2e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '[GENERATED]'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '[GENERATED]'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-992cc2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Evidence
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Evidence
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'more evidence needed from the buyer.

      - **Resolved — refund issued** / **Resolved — no refund** — final outcome.

      - **Escalated** — routed per Section 8.


      **Policy labels'
    change_id: CHG-20260903-1e5678
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: integrity
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: integrity
  - kind: insert
    text: ' ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Payments Operations may define):**

      - Internal sub-statuses (e.g.'
    change_id: CHG-20260903-2b01c6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: immutable
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: immutable
  - kind: insert
    text: ', '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '"assigned to seller'
    change_id: CHG-20260903-587365
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: timestamped
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: timestamped
  - kind: insert
    text: ','
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '"'
    change_id: CHG-20260903-6e33ee
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '"awaiting'
    change_id: CHG-20260903-eb6d06
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: audit
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: audit
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: seller response
    change_id: CHG-20260903-1ec323
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: trail
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: trail
  - kind: insert
    text: ','
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '"'
    change_id: CHG-20260903-159731
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '"in network response").

      - Buyer-facing wording'
    change_id: CHG-20260903-195825
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: chain
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: chain
  - kind: insert
    text: ' of '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the fixed labels (plain-language phrasing
    change_id: CHG-20260903-160aa2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: custody
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: custody
  - kind: insert
    text: ') '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: within
    change_id: CHG-20260903-22878c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: is
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: is
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'legal guardrails.

      - Seller-facing statuses'
    change_id: CHG-20260903-7002be
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: sound
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: sound
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: SLA
    change_id: CHG-20260903-3790c1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: indicators
    change_id: CHG-20260903-32fd62
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: be retained as a fixed legal requirement
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: be retained as a fixed legal requirement
  - kind: insert
    text: '.


      ### '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '7.2'
    change_id: CHG-20260903-4eb7fb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Concrete
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Concrete
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Communications

      -'
    change_id: CHG-20260903-30500c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: change
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: change
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**Buyer:** Acknowledgment, evidence requests, status updates, resolution,
      and escalation notices (N7–N11), in English and Spanish.

      - **Seller:** Notice that a dispute was filed, evidence request, response deadline,
      and outcome. Seller communications are governed by the marketplace''s seller
      terms (open item O3).

      - **Marketplace:** Dashboard visibility into all disputes, response-time metrics,
      and escalation triggers.

      - **Support agents:** Access to the full dispute record and audit trail to assist
      buyers and sellers.


      ---


      ## 8. Escalation path when the marketplace or seller does not respond


      Open item O4. The following is the **recommended** fallback (to be confirmed
      by the marketplace and Payments Operations). No decision is recorded.


      ### 8.1 Recommended escalation ladder

      1. **Tier 1 — Automated reminder.** If the marketplace/seller has not responded
      within the internal SLA (e.g., 3 business days), send an automated reminder
      with the hard network deadline.

      2. **Tier 2 — Support-agent escalation.** If still no response by a second threshold
      (e.g., 5 business days), route to Mosaic Relay support for manual handling and
      direct outreach.

      3. **Tier 3 — Network-deadline fallback.** If the marketplace/seller has not
      responded by the network deadline, the portal must **not** let the deadline
      lapse silently.


      ### 8.2 Tier 3 — recommended provisional operational default: **auto-submit,
      no silent lapse**


      **Recommended default:** **Auto-submit a network response on the merchant of
      record''s behalf** reflecting the buyer''s claim and available evidence, so
      the network deadline is met and the buyer''s position is preserved.


      **Why auto-submit (justification):**

      - A silent lapse converts a resolvable dispute into a **guaranteed adverse network
      outcome** (default loss) and a consumer-protection risk.

      - Auto-submitting the buyer''s claim preserves the buyer''s position and keeps
      the dispute within the network process, where it can still be defended or withdrawn.

      - It avoids the cost of a provisional refund while still meeting the deadline,
      and it keeps the decision to refund (vs. defend) with the marketplace/seller
      rather than forcing a payout.

      - It is **reversible**'
    change_id: CHG-20260903-42e755
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: needed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: needed
  - kind: insert
    text: ' in the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'sense that the marketplace/seller can still respond with evidence after
      submission, consistent with Mosaic Relay''s operating principle of reversible
      controls.


      **What remains a marketplace policy choice (not fixed by legal):**'
    change_id: CHG-20260903-7acfc4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft
  - kind: insert
    text: '

      - '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Whether the fallback is '
    change_id: CHG-20260903-a53035
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '**'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: auto-submit**
    change_id: CHG-20260903-2ebc74
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Draft
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (recommended)
    change_id: CHG-20260903-159e1d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: change
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: change
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'or **provisional refund to the buyer** (protects the buyer and avoids an
      adverse network outcome, but costs the marketplace/seller).

      - The **internal SLA thresholds** for Tier 1 and Tier 2 (e.g., 3 and 5 business
      days).

      - Whether the seller or the marketplace **bears the cost** of a chargeback or
      provisional refund (governed by seller terms — open item O3).

      - Whether **manual-only** (no auto-action) is ever acceptable — **not recommended**,
      because it risks a silent lapse.


      **Decision point'
    change_id: CHG-20260903-b841d8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '7'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '7'
  - kind: insert
    text: ':** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: The
    change_id: CHG-20260903-780d99
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Add
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Add
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: marketplace
    change_id: CHG-20260903-801472
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: a
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: a
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: must
    change_id: CHG-20260903-949625
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: choose,
    change_id: CHG-20260903-b25c73
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: item
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: item
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: before
    change_id: CHG-20260903-bdc23a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: to
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: to
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch,
    change_id: CHG-20260903-2fed04
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: verify network evidence-sharing/redaction rules and to confirm
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: verify network evidence-sharing/redaction rules and to confirm
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Tier
    change_id: CHG-20260903-31abfb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: privacy-law
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: privacy-law
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '3'
    change_id: CHG-20260903-d64f84
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: scope
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: scope
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: behavior
    change_id: CHG-20260903-5a99c8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (U.S. only vs. EU/LatAm) before finalizing the evidence-sharing and retention
        sections
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (U.S. only vs. EU/LatAm) before finalizing the evidence-sharing
      and retention sections
  - kind: insert
    text: '. The '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: recommendation
    change_id: CHG-20260903-76fc46
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft's
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft's
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-ea80ea
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: integrity
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: integrity
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**auto-submit'
    change_id: CHG-20260903-c80e92
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: requirements
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: requirements
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: with
    change_id: CHG-20260903-9d4adf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Section
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Section
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: no silent lapse**
    change_id: CHG-20260903-7752de
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '6'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '6'
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: This
    change_id: CHG-20260903-31ee8b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: is
    change_id: CHG-20260903-50d6ac
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: remain
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: remain
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the single most important pre-launch decision because it determines chargeback
      liability and buyer outcomes
    change_id: CHG-20260903-4ad088
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: fixed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: fixed
  - kind: insert
    text: '.


      ---


      ## 9. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal
    change_id: CHG-20260903-1daa6e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Open
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Open
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: requirements
    change_id: CHG-20260903-4d2488
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: questions
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: questions
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: versus
    change_id: CHG-20260903-231041
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (ranked
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (ranked
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: customer
    change_id: CHG-20260903-fd1627
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: by
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: by
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: policy
    change_id: CHG-20260903-e3d3f9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: how
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: how
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'choices


      |'
    change_id: CHG-20260903-b52c33
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: much
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: much
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Item
    change_id: CHG-20260903-ffa8da
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: they
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: they
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-e8979c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: change
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: change
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Classification
    change_id: CHG-20260903-fa0724
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-ee58eb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'answer)


        1.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'answer)


      1.'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Owner
    change_id: CHG-20260903-7ca18a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '**Who'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '**Who'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|

      |------|---------------|-------|

      |'
    change_id: CHG-20260903-f89977
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: is
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: is
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Merchant-
    change_id: CHG-20260903-a334f5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'the merchant '
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'the merchant '
  - kind: insert
    text: of
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '-'
    change_id: CHG-20260903-171e88
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ' '
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ' '
  - kind: insert
    text: 'record '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: determination
    change_id: CHG-20260903-d502de
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: /
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: /
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: and
    change_id: CHG-20260903-9f75e5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: is Mosaic Relay a payment facilitator?** — Determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: is Mosaic Relay a payment facilitator?** — Determines
  - kind: insert
    text: ' who responds'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: to
    change_id: CHG-20260903-5503c6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: who
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: who
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: network disputes | **Legal** (determines
    change_id: CHG-20260903-89fcd0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: bears
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: bears
  - kind: insert
    text: ' liability'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ') | Legal + Marketplace |

      | Network chargeback deadlines'
    change_id: CHG-20260903-e3f0dd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: ','
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: ','
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: clock
    change_id: CHG-20260903-c94f32
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: whether
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: whether
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: rules
    change_id: CHG-20260903-05049b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-44496c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'six-week launch is feasible. (Open; being decided.)

        2.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'six-week launch is feasible. (Open; being decided.)

      2.'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal**
    change_id: CHG-20260903-f88acb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Which
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Which
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (network-mandated)
    change_id: CHG-20260903-ba7760
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: card
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: card
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Legal sets; Payments Ops implements |

      | Required notices (N1–N11)'
    change_id: CHG-20260903-8ebf5c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: networks
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: networks
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: plain-language
    change_id: CHG-20260903-5b39ba
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: regions
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: regions
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: disclosure
    change_id: CHG-20260903-858fc5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: must
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: must
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-e2c272
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '**Legal'
    change_id: CHG-20260903-4c4bcd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: initial release support?
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: initial release support?
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (consumer-protection
    change_id: CHG-20260903-0ae973
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: floor)
    change_id: CHG-20260903-33fb30
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Determines
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-15235e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: which
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: which
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Legal sets; Payments Ops implements |

      | English-plus-Spanish language support | **Policy + risk** (recorded requirement)
      | Payments Ops (with Legal review) |

      | Evidence collection minimums and integrity/retention | **Legal** ('
    change_id: CHG-20260903-cef7d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: 'network '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: +
    change_id: CHG-20260903-c7dd62
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: rules, timeframes, reason codes, and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: rules, timeframes, reason codes, and
  - kind: insert
    text: ' consumer-protection '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: floor)
    change_id: CHG-20260903-173980
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: regimes
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: regimes
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-baea53
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: apply.
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: apply.
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal sets; Payments Ops implements |
    change_id: CHG-20260903-ca2892
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Open.)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Open.)
  - kind: insert
    text: '

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Status labels — fixed set |'
    change_id: CHG-20260903-ce5ff0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '3.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '3.'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal**
    change_id: CHG-20260903-762a2a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: What
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: What
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-e0a57e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: should
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: should
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal
    change_id: CHG-20260903-61df51
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|

      |'
    change_id: CHG-20260903-82cdde
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: portal
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: portal
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Status
    change_id: CHG-20260903-466b89
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: do
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: do
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: labels
    change_id: CHG-20260903-aa7a3b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: when
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: when
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-4116de
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: wording
    change_id: CHG-20260903-a8be22
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: marketplace/seller
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: marketplace/seller
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: and
    change_id: CHG-20260903-50d415
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: does
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: does
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: internal
    change_id: CHG-20260903-dc03a7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: not
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: not
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: sub-statuses
    change_id: CHG-20260903-fd39db
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: respond
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: respond
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| **Policy** | Payments Ops |

      | Internal response SLAs ('
    change_id: CHG-20260903-8d48e9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: within the network deadline
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ) | **Policy
    change_id: CHG-20260903-708cb3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '?'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '?'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-7bb5f3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Payments
    change_id: CHG-20260903-af0e73
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Determines
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Ops
    change_id: CHG-20260903-2191cd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|

      |'
    change_id: CHG-20260903-c69598
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: escalation
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: escalation
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Escalation
    change_id: CHG-20260903-06c2fa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: path
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: path
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Tier
    change_id: CHG-20260903-27a68f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '3'
    change_id: CHG-20260903-dd5336
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: who
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: who
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: behavior
    change_id: CHG-20260903-938923
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: bears
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: bears
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (auto-submit
    change_id: CHG-20260903-81e912
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: vs
    change_id: CHG-20260903-4e009b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: risk of a missed deadline
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: risk of a missed deadline
  - kind: insert
    text: '. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: provisional
    change_id: CHG-20260903-959fd0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: (Open;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: (Open;
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: refund)
    change_id: CHG-20260903-d24da8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: recommendation
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: recommendation
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-908bba
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'needed.)

        4.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'needed.)

      4.'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Policy
    change_id: CHG-20260903-344667
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Do
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Do
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: +
    change_id: CHG-20260903-44e5d6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: seller/marketplace
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: seller/marketplace
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: risk**
    change_id: CHG-20260903-b641ca
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: terms
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: terms
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '(must be decided) | Marketplace + Payments Ops |

      | Seller-term allocation of'
    change_id: CHG-20260903-f15e7f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: allocate
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: allocate
  - kind: insert
    text: ' dispute/refund/chargeback responsibility'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' | **Legal'
    change_id: CHG-20260903-2c5b94
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '?'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '?'
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (contract)
    change_id: CHG-20260903-6f82aa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-476fce
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Determines
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal
    change_id: CHG-20260903-48e6bd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: routing
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: routing
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: +
    change_id: CHG-20260903-948259
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: and
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: and
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'Marketplace |

      | Bilingual notice native'
    change_id: CHG-20260903-3283fc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: cost
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: cost
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: speaker
    change_id: CHG-20260903-615da2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: bearer
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: bearer
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: review
    change_id: CHG-20260903-9b56dd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: logic.
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: logic.
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-97ef3a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '(Open; need to check.)

        5.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '(Open; need to check.)

      5.'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Policy
    change_id: CHG-20260903-a3523d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Is
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Is
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: +
    change_id: CHG-20260903-eb5cfc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: risk
    change_id: CHG-20260903-43c544
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: marketplace a covered "merchant" under the FTC MTO rule, and are sellers
        separately covered?
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: marketplace a covered "merchant" under the FTC MTO rule, and are
      sellers separately covered?
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|'
    change_id: CHG-20260903-8d8821
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: —
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Payments
    change_id: CHG-20260903-9dc02e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Determines
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Determines
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Ops
    change_id: CHG-20260903-62eeb9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: MTO
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: MTO
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '|

      | Accessibility'
    change_id: CHG-20260903-49b627
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: applicability.
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: applicability.
  - kind: insert
    text: ' ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: WCAG 2
    change_id: CHG-20260903-90278f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Open
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Open
  - kind: insert
    text: .
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 1 AA baseline
    change_id: CHG-20260903-4ee1c4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: )
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: ' |'
    change_id: CHG-20260903-7013ac
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '

        6.'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '

      6.'
  - kind: insert
    text: ' **'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Policy
    change_id: CHG-20260903-8d30fd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Which
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Which
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: +
    change_id: CHG-20260903-e4e91c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: states
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: states
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: risk
    change_id: CHG-20260903-462f2f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: does the marketplace operate in, and what UDAP/refund statutes apply?
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: does the marketplace operate in, and what UDAP/refund statutes
      apply?
  - kind: insert
    text: '** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'research '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: pending)
    change_id: CHG-20260903-f4a187
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: run
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: run
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '| Payments Ops |'
    change_id: CHG-20260903-64955f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: pending.)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: pending.)
  - kind: insert
    text: '


      ---


      ## 10. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Owners
    change_id: CHG-20260903-ff129f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Concrete
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Concrete
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: and
    change_id: CHG-20260903-832a85
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: changes
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: changes
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: open
    change_id: CHG-20260903-98daa8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: needed
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: needed
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'work items


      ### 10.1 Owners

      - **Legal (Lawyer):** Sets'
    change_id: CHG-20260903-5f4056
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: in
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: in
  - kind: insert
    text: ' the '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'legal requirements — merchant-of-record determination, network-deadline
      compliance, required notices, evidence floor, fixed status labels, seller-term
      allocation.

      - **Payments Operations:** Owns the operating-model decisions — internal SLAs,
      status-label wording, buyer/seller/marketplace communications, escalation implementation,
      evidence retention operations.

      - **Marketplace'
    change_id: CHG-20260903-c38546
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: draft
  - kind: insert
    text: ' ('
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'customer):** Decides the Tier 3 escalation behavior, seller-term allocation,
      and any policy choices beyond the legal floor.

      - **Risk & Fraud:** Supports evidence integrity, fraud review, and escalation
      handling.

      - **Product/Engineering:** Builds the portal to the requirements; implements
      the configurable clock logic and bilingual flows.


      ### 10.2 Open work items (before launch'
    change_id: CHG-20260903-18f5a1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: summary
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: summary
  - kind: insert
    text: ')


      | # | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Work item
    change_id: CHG-20260903-173992
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Change
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Change
  - kind: insert
    text: ' | Owner | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Needed by
    change_id: CHG-20260903-432431
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Type
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Type
  - kind: insert
    text: ' |

      |---|'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '---'
    change_id: CHG-20260903-e0ca85
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '--------|-------|------'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '-----'
    change_id: CHG-20260903-4f830f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '|

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W1
    change_id: CHG-20260903-f250b7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '1'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '1'
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Confirm
    change_id: CHG-20260903-d86f55
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Re-label
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Re-label
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: merchant
    change_id: CHG-20260903-a7a11f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: FTC
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: FTC
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: of
    change_id: CHG-20260903-f4268b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: MTO
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: MTO
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: record
    change_id: CHG-20260903-89ee3c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: from
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: from
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: /
    change_id: CHG-20260903-348f11
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: verified
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: verified
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: customer
    change_id: CHG-20260903-5076ea
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: anchor
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: anchor
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: of
    change_id: CHG-20260903-26ec5d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: to
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: to
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: record
    change_id: CHG-20260903-f57429
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: unverified
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: unverified
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: for
    change_id: CHG-20260903-81659c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: lead;
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: lead;
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-53ca7d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: add
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: add
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: card
    change_id: CHG-20260903-da6429
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: MTO-applicability
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: MTO-applicability
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: transactions
    change_id: CHG-20260903-a060d0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: gate (marketplace covered? sellers covered?)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: gate (marketplace covered? sellers covered?)
  - kind: insert
    text: ' | Legal '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '+ Marketplace '
    change_id: CHG-20260903-bb4b7f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '| '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-3eeadd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Draft
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Draft
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-aee366
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: correction
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: correction
  - kind: insert
    text: ' |

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W2
    change_id: CHG-20260903-2046d7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '2'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '2'
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Confirm
    change_id: CHG-20260903-55b0c5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Add
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Add
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: which
    change_id: CHG-20260903-4cf273
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: state-law
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: state-law
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: card
    change_id: CHG-20260903-ac5a03
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: scoping
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: scoping
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: networks
    change_id: CHG-20260903-4a428a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item (identify states, screen UDAP/refund statutes)
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item (identify states, screen UDAP/refund statutes)
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: regions
    change_id: CHG-20260903-0a89c4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: WCAG
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: WCAG
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260903-ed9677
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '2.1'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '2.1'
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: initial
    change_id: CHG-20260903-2aee81
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: AA
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: AA
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: release
    change_id: CHG-20260903-45a698
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: baseline
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: baseline
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: supports
    change_id: CHG-20260903-d2cbd7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Product
    change_id: CHG-20260903-7710b8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Payments
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Payments
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: + Marketplace
    change_id: CHG-20260903-1562fc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Operations
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Operations
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-6018cd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: New
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: New
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-77a937
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item
  - kind: insert
    text: ' |

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W3
    change_id: CHG-20260903-6d1dc3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '3'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '3'
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Verify
    change_id: CHG-20260903-aa9101
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: 'Make Reg E/Reg Z boundary explicitly conditional on merchant-of-record;
        add "date became aware" and "statement date" as fixed legal intake fields
        | Legal | Draft correction |

        | 4 | Make network-rule verification a hard launch gate; add work item to
        pull'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: 'Make Reg E/Reg Z boundary explicitly conditional on merchant-of-record;
      add "date became aware" and "statement date" as fixed legal intake fields |
      Legal | Draft correction |

      | 4 | Make network-rule verification a hard launch gate; add work item to pull'
  - kind: insert
    text: ' current Visa/'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Mastercard
    change_id: CHG-20260903-cdd0d5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: MC
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: MC
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: chargeback timeframes, reason codes,
    change_id: CHG-20260903-73fc8b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: rules
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: rules
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: evidence requirements for
    change_id: CHG-20260903-033796
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: map
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: map
  - kind: insert
    text: ' the four categories | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Legal
    change_id: CHG-20260903-c2200a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Payments
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Payments
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (research in progress)
    change_id: CHG-20260903-3606bc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Operations
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Operations
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-d8e0bf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: New
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: New
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-ba7f00
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (hard
    change_id: CHG-20260903-cb83bb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: item /
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: item /
  - kind: insert
    text: ' gate'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: )
    change_id: CHG-20260903-730700
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: ' |

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W4
    change_id: CHG-20260903-f2e0c7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '5'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '5'
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Check
    change_id: CHG-20260903-4392fd
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Confirm
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Confirm
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: whether marketplace seller terms
    change_id: CHG-20260903-831792
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: merchant-of-record
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: merchant-of-record
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'marketplace terms allocate dispute/refund/chargeback responsibility; amend
      if silent | Legal + Marketplace | Before launch |

      | W5 | Decide Tier 3 escalation behavior (recommended: auto'
    change_id: CHG-20260903-7e68aa
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: payment
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: payment
  - kind: insert
    text: '-'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: submit,
    change_id: CHG-20260903-26ba55
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: facilitator
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: facilitator
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'no'
    change_id: CHG-20260903-f0e0bc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: status
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: status
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: silent
    change_id: CHG-20260903-c8a304
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: by
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: by
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'lapse) | Marketplace + Payments Ops | Before launch |

      | W6 | Verify FTC MTO rule applicability to the'
    change_id: CHG-20260903-d8a9ef
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: reviewing
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: reviewing
  - kind: insert
    text: ' marketplace '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: sellers
    change_id: CHG-20260903-669311
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: acquiring/processor contracts before finalizing operating model
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: acquiring/processor contracts before finalizing operating model
  - kind: insert
    text: ' | Legal | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-e79132
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: New
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: New
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-6359bf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item / gate
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item / gate
  - kind: insert
    text: ' |

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W7
    change_id: CHG-20260903-2fa51b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '6'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '6'
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Confirm
    change_id: CHG-20260903-968f7f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Add
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Add
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'accessibility (ADA/WCAG) requirements for the portal | Legal (research
      in progress) | Before launch |

      | W8 | Draft English and Spanish notice text and plain-language disclosures
      | Legal + Payments Ops | Before launch |

      | W9 | Build configurable deadline/clock logic to verified network rules | Product/Engineering
      | Before launch |

      | W10 | Define evidence retention schedule and audit-trail controls | Payments
      Ops + Legal | Before launch |

      | W11 | Native'
    change_id: CHG-20260903-dea0ea
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: native
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: native
  - kind: insert
    text: '-speaker review and plain-language testing of English/Spanish notices |
      Payments '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Ops
    change_id: CHG-20260903-2fd147
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Operations
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Operations
  - kind: insert
    text: ' | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-4a1f77
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: New
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: New
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-784fe9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item
  - kind: insert
    text: ' |

      | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: W12
    change_id: CHG-20260903-0c756f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: '7'
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: '7'
  - kind: insert
    text: ' | Verify network evidence-sharing/redaction rules and confirm privacy-law
      scope (U.S. vs. EU/LatAm) | Legal | '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Before
    change_id: CHG-20260903-8b26c4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: New
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: New
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: launch
    change_id: CHG-20260903-0a7f65
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: work item
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: work item
  - kind: insert
    text: ' |


      ---


      ## 11'
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '. Material assumptions and missing facts


      - **Merchant of record** is assumed to be the marketplace (Mosaic Relay as service
      provider). If Mosaic Relay is the merchant of record or a payment facilitator
      treated as such, the entire response/liability model shifts to Mosaic Relay
      and the six-week launch is likely infeasible.

      - **Networks/regions** assumed U.S. Visa/Mastercard for the initial release.
      Adding Amex, Discover, or non-U.S. regions changes deadlines, evidence rules,
      and notices.

      - **Seller terms** assumed not to allocate dispute responsibility; must be checked
      and amended if silent.

      - **Escalation Tier 3** behavior is undecided and is the single most important
      pre-launch decision. Recommended: **auto-submit with no silent lapse**.

      - **Reg E/Reg Z** obligations run to the card issuer, not to Mosaic Relay or
      the marketplace, **conditional on merchant-of-record status**; the portal''s
      role is evidence collection and transmission.

      - **Network timeframes, consumer-protection notices, and accessibility** are
      the subject of in-progress research runs and must be verified against current
      rules before the portal''s clock logic and notices are finalized. The prior
      research run was model-only (external research timed out); nothing is verified
      current law or current network rules.


      ---


      ## 12'
    change_id: CHG-20260903-0eab43
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
  - kind: insert
    text: '. What would change this


      - **Working assumption:** The marketplace is the merchant of record and Mosaic
      Relay is a service provider. If Mosaic Relay is the merchant of record or a
      payment facilitator treated as such, the entire response/liability model shifts
      to Mosaic Relay and the six-week launch is likely infeasible.

      - **Working assumption:** The initial release is U.S.-focused, Visa/Mastercard
      consumer card purchases. If Amex, Discover, or non-U.S. regions are added, additional
      reason codes, timeframes, evidence rules, and local consumer-protection law
      apply.

      - **Open fork:** '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: Tier
    change_id: CHG-20260903-262b37
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: When
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: When
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: '3'
    change_id: CHG-20260903-1197de
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: the
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: the
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: escalation
    change_id: CHG-20260903-4bd059
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: marketplace/seller
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: marketplace/seller
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: —
    change_id: CHG-20260903-5cff50
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: does not respond within the network deadline, the portal could auto-accept/refund,
        escalate to Mosaic Relay support, or
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: does not respond within the network deadline, the portal could
      auto-accept/refund, escalate to Mosaic Relay support, or
  - kind: insert
    text: ' auto-submit '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: (recommended)
    change_id: CHG-20260903-1ddcfc
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: a
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: a
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: vs
    change_id: CHG-20260903-4c48eb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: network response
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: network response
  - kind: insert
    text: '. '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: provisional
    change_id: CHG-20260903-1dc0c4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: Each
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: Each
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: refund
    change_id: CHG-20260903-ecef23
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: path
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: path
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: vs.
    change_id: CHG-20260903-d3a0e3
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: has
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: has
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: manual-only.
    change_id: CHG-20260903-563206
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: different
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: different
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: The recommendation is auto-submit with no silent lapse
    change_id: CHG-20260903-e07eee
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: legal
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: legal
  - kind: insert
    text: ', '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: but the marketplace's choice determines who bears missed-deadline risk
    change_id: CHG-20260903-a85e21
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: financial,
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: financial,
  - kind: insert
    text: ' and '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: buyer
    change_id: CHG-20260903-4acaa9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: customer-experience
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: customer-experience
  - kind: insert
    text: ' '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: outcomes
    change_id: CHG-20260903-3781c2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:18:09+00:00'
    replaced_segments:
    - kind: insert
      text: consequences; this remains undecided
      change_id: CHG-20260903-832ab7
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-03T18:15:13+00:00'
    replaced_text: consequences; this remains undecided
  - kind: insert
    text: '.

      - **Not examined:** The current Visa/Mastercard chargeback guides were **not
      retrieved** (external research timed out). Exact reason codes, timeframes, and
      evidence requirements must be verified against current network publications
      before the clock logic and evidence checklists are finalized.

      - **Not examined:** The marketplace agreement, Mosaic Relay''s acquiring/processor
      contracts, and the marketplace''s seller terms were **not reviewed**. Merchant-of-record,
      payment-facilitator, and terms-allocation questions remain open.

      - **Not examined:** The consumer-protection-notice and accessibility research
      runs are **still running/queued** and have produced no retrievable authority.
      State-law and accessibility conclusions '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  - kind: insert
    text: 'are generated analysis pending those runs.

      '
    change_id: CHG-20260903-832ab7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T18:15:13+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-03T18:18:09+00:00'
last_source_action_key: chat:RUN-20260903-57c056:tool:21b5c05951dd15b9ec9cc193
final_id: FINAL-20260903-5fdf63
finalized_at: '2026-09-03T18:23:32+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-08-consumer-dispute-intake-and-communicatio-5311e9/work-product/draft/consumer-dispute-portal-legal-requirements-and-operating-model-d-f5bde1.md
source_content_hash: af9c0a980ac7859ef50c5bd274dea1242d8927b2a0e116e319cafa3ba7522315
---
# Consumer Dispute Portal — Legal Requirements and Recommended Operating Model

**Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications
**Status:** Draft for review — **no decision recorded.**
**Target release:** 2026-10-15 (six weeks)
**Scope:** Consumer-only buyers; card purchases; English plus Spanish; U.S.-focused initial release (assumption)

This draft sets out the legal requirements and the recommended operating model for launch. It incorporates the reconciled research packet (source-labeled) and the formal recommendation. It separates **legal requirements** (fixed) from **customer policy choices** (owned by Payments Operations / the marketplace). The Tier 3 escalation default is recommended as **auto-submit with no silent lapse**, with the marketplace's policy choice clearly flagged.

---

## 1. Factual record and assumptions

### 1.1 Confirmed facts (verified in the matter record)

| # | Fact | Status |
|---|------|--------|
| F1 | A consumer-facing marketplace asks Mosaic Relay to provide a dispute portal for card purchases. | Verified |
| F2 | Proposed dispute categories: non-receipt, unauthorized use, duplicate charges, defective goods. | Verified |
| F3 | The portal collects statements and documents, sends automated messages, and routes cases to the marketplace or seller. | Verified |
| F4 | Actors include buyers, sellers, the marketplace, Mosaic Relay, card networks, issuers, and support agents. | Verified |
| F5 | Initial release target is 2026-10-15 (six weeks). | Verified |
| F6 | Buyers using the portal are **consumers only** (not business purchasers). | Verified |
| F7 | Portal and notices must support **English plus Spanish** for the initial release. | Verified |
| F8 | **Payments Operations** owns the operating-model decisions (notices, deadlines, status labels, escalation paths) once legal sets the requirements. | Verified |
| F9 | Evidence rules and status labels are **mixed** — some fixed legal requirements, some customer policy choices. | Verified |
| F10 | Direction given to **draft with best-available assumptions** for the still-open items. | Verified |

### 1.2 Open facts (unverified — need confirmation before launch)

| # | Open item | Current state |
|---|-----------|---------------|
| O1 | Merchant of record / customer of record for the card transactions | Not yet determined — being decided |
| O2 | Which card networks and regions the initial release must support | Not yet determined |
| O3 | Whether marketplace seller terms and marketplace terms allocate dispute/refund/chargeback responsibility | Not sure — need to check |
| O4 | Escalation behavior when the marketplace or seller does not respond within the network deadline | Not yet decided — recommendation provided (Section 8) |

### 1.3 Working assumptions (best-available, to be confirmed)

- **A1 — Merchant of record.** The marketplace is the merchant of record; Mosaic Relay is a payments-infrastructure service provider, not the merchant of record. *If wrong* (Mosaic Relay is the merchant of record or a payment facilitator treated as such), Mosaic Relay itself becomes the party that must respond to network disputes and bear chargeback liability, and the entire operating model shifts — likely delaying the six-week launch.
- **A2 — Networks and regions.** Initial release covers U.S. consumer card purchases subject to Visa and Mastercard chargeback rules and U.S. consumer-protection law. *If wrong* (e.g., Amex, Discover, or non-U.S. regions added), deadlines, evidence rules, and notice obligations change materially.
- **A3 — Seller terms.** Seller/marketplace terms do not yet allocate dispute/refund/chargeback responsibility; this must be checked and addressed. *If wrong* (terms already allocate), the portal's routing and cost-bearer logic must conform to the existing allocation.
- **A4 — Escalation.** When the marketplace or seller does not respond within the network deadline, the portal needs a defined fallback. Recommended: **auto-submit with no silent lapse** (Section 8). *If wrong*, the fallback must be replaced with the marketplace's chosen behavior.
- **A5 — Reg E/Reg Z boundary.** Unauthorized-use disputes implicate EFTA/Reg E (debit) and TILA/Reg Z / FCBA (credit) consumer protections, which run to the **card issuer**, not to Mosaic Relay or the marketplace. This is **conditional on the merchant-of-record assumption**: if Mosaic Relay or the marketplace is ever treated as the account-holding institution, additional Reg E/Reg Z duties would attach. The portal's role is to collect and transmit evidence, not to adjudicate Reg E/Reg Z rights.

---

## 2. Consumer-protection and payment-network issues (source-labeled)

This section separates **verified** anchors from **unverified leads** that require confirmation before launch. Source labels: **[VERIFIED]** confirmed in the matter record; **[SUPPLIED]** given by the requester; **[UNVERIFIED LEAD]** material but unconfirmed; **[ASSUMPTION]** working assumption; **[GENERATED]** analysis from general knowledge, not retrieved authority; **[BRIEFING]** from the briefing context.

**Critical caveat:** The prior research run is **model-only** — no external authority was retrieved (external research timed out). Its Visa/Mastercard timeframes, reason codes, and Reg E/EFTA figures are **[GENERATED]**, not verified current network rules. The consumer-protection-notice and accessibility research runs are still running/queued. **Nothing here should be treated as verified current law or current network rules.**

### 2.1 Verified anchors

- **V1 — Merchant-of-record determines who responds.** The party that must respond to a card-network chargeback and bear the liability is the merchant of record. Because Mosaic Relay is (assumed) a service provider and the marketplace is the merchant of record, the marketplace (and, per its terms, sellers) must respond to network disputes. This is the single most decision-changing fact.
- **V2 — Card-network rules are contractual, not statutory.** Visa and Mastercard chargeback timeframes, evidence requirements, and reason codes are set by network operating rules that bind the acquirer and merchant of record. The portal's deadlines must be built to the applicable network rules.
- **V3 — Unauthorized-use disputes implicate EFTA/Reg E.** For consumer card accounts, unauthorized-use protections under EFTA/Reg E (and, for credit, TILA § 170 / Reg Z) run to the card issuer. The portal's role is to collect and transmit evidence, not to determine Reg E liability. **Conditional on merchant-of-record status.**
- **V4 — Language access is a policy-plus-risk decision.** There is no general federal statute requiring a private marketplace to provide Spanish-language dispute communications. The English-plus-Spanish decision is primarily a customer-policy and risk choice, though it is a **recorded requirement** for the initial release.

### 2.2 Unverified leads (need confirmation before launch)

- **L1 — Exact Visa/Mastercard chargeback timeframes and reason codes** for the four categories. *Research run in progress.* Network-specific and change; the clock logic must be built to verified current rules.
- **L2 — Whether Mosaic Relay is a "facilitator" or "payment facilitator"** under network rules, which can shift who is treated as the merchant of record for chargeback purposes. *Needs the acquiring/processor contract.*
- **L3 — State consumer-protection laws** (UDAP statutes, state-specific refund and notice requirements) in the states where the marketplace operates. *Not yet scoped.*
- **L4 — Accessibility obligations** (ADA/WCAG) for the consumer-facing portal. *Research run in progress.*
- **L5 — Whether the marketplace is subject to the FTC MTO rule** (i.e., whether it is a "merchant" selling goods by mail/phone/internet) and whether sellers are separately subject to it. *Needs the marketplace's business model and seller terms.*
- **L6 — Card-network data-security and evidence-handling rules** (e.g., PCI DSS, network mandates on storing and sharing cardholder data and dispute evidence). *Needs the network agreements and evidence-storage design.*
- **L7 — Network evidence-sharing/redaction rules and privacy-law scope** (GLBA, state privacy laws, GDPR if EU buyers are involved). *Not scoped.*

---

## 3. Exact intake fields by dispute category

The portal must collect the minimum evidence needed to support a network response and to let the marketplace/seller evaluate the claim. Questions below are the **legal floor**; the marketplace may add policy questions. All intake must be available in English and Spanish.

### 3.1 Common intake (all categories) — legal floor
1. Order/transaction identifier (order number, transaction reference, or card statement line).
2. Transaction date and amount.
3. Card used (last four digits) and whether the buyer recognizes the charge.
4. **Date the buyer first became aware of the issue** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).
5. **Statement date** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).
6. Whether the buyer has already contacted the seller or marketplace directly, and the outcome.
7. Whether the buyer has already filed a dispute with their card issuer (and, if so, the issuer's reference).
8. Contact method and preferred language (English/Spanish) for dispute communications.

### 3.2 Non-receipt
1. Was the item ever shipped? If known, provide tracking number and carrier.
2. **What delivery date was promised at purchase?** — *fixed legal field* (MTO + network non-receipt reason codes).
3. What is the current delivery status (delivered / in transit / no tracking / unknown)?
4. If marked delivered, was the item left at the address, and is there any delivery photo or signature?
5. Has the buyer requested a refund or replacement from the seller, and what was the response?
6. Evidence to upload: order confirmation, tracking page, delivery photo, seller correspondence.

### 3.3 Unauthorized use
1. Does the buyer recognize the transaction at all?
2. Was the card or card details lost, stolen, or otherwise accessible to someone else?
3. Does the buyer believe a family member, employee, or other authorized user made the charge?
4. Has the buyer reported the unauthorized use to their card issuer, and has the issuer opened an investigation?
5. Has the buyer filed a police report (if applicable)?
6. Evidence to upload: card statement showing the charge, issuer correspondence, police report (if any).

### 3.4 Duplicate charges
1. Was the buyer charged more than once for the same order?
2. Provide the order number(s) and the duplicate transaction references/amounts.
3. Was the buyer charged for an order they did not place, or charged twice for one order?
4. Has the buyer already received a refund for one of the charges?
5. Evidence to upload: card statement showing both charges, order confirmation(s).

### 3.5 Defective goods
1. What is the defect, and when was it discovered?
2. Was the item used or installed before the defect appeared?
3. Has the buyer contacted the seller or manufacturer about the defect, and what was the response?
4. Is the buyer seeking a refund, replacement, or repair?
5. Evidence to upload: photos/videos of the defect, order confirmation, seller correspondence, any warranty documents.

---

## 4. Mandatory notices and plain-language disclosure points (English and Spanish)

All notices below must be provided in **English and Spanish** at the point of intake and at each status change. Plain-language drafting is required; legal boilerplate alone is insufficient for consumer-facing communications.

### 4.1 Intake-time disclosures (shown before the buyer submits)
- **N1 — What the portal does and does not do.** State that the portal collects the buyer's dispute and evidence and routes it to the marketplace/seller for review; it is not a guarantee of a refund and does not replace the buyer's right to dispute the charge with their card issuer.
- **N2 — Card-issuer rights preserved.** Tell the buyer they may still contact their card issuer to dispute the charge, and that using the portal does not waive that right.
- **N3 — What happens next and expected timing.** Describe the review process, the response-time target, and how the buyer will be updated.
- **N4 — Evidence requirements.** Explain what evidence is needed, that incomplete evidence may delay or prevent resolution, and that the buyer should not submit sensitive information (e.g., full card numbers, SSNs) beyond what is requested.
- **N5 — Data use and sharing.** Disclose that submitted evidence will be shared with the marketplace, seller, and (as needed) card networks and issuers to resolve the dispute, and reference the privacy notice.
- **N6 — No admission of liability.** A statement that submitting a dispute does not constitute an admission by the marketplace or seller.

### 4.2 Status-change notices (sent at each milestone)
- **N7 — Acknowledgment.** Confirmation that the dispute was received, with a reference number and the expected next step.
- **N8 — Evidence received / additional evidence requested.** Notification when evidence is complete or when more is needed, with a deadline to respond.
- **N9 — Under review.** Notice that the marketplace/seller is reviewing the dispute.
- **N10 — Resolution.** Notice of the outcome (refund issued, dispute denied, or escalated) with the reason and any next steps.
- **N11 — Escalation.** Notice when the dispute is escalated (per Section 8) and what that means for the buyer.

### 4.3 Plain-language disclosure points
- Use short sentences and common words; avoid legal jargon.
- State deadlines in plain calendar terms (e.g., "within 10 calendar days") rather than network code references.
- Provide the same content in both languages; do not rely on machine translation without review.
- Make the "contact your card issuer" option prominent and easy to find.

---

## 5. Deadlines and clock rules (network-rule verification needed)

**Critical caveat:** The exact deadlines below are **subject to verification against the current Visa/Mastercard operating rules for the networks actually supported** (open item O2). The research run on network timeframes is in progress. The portal's clock logic must be configurable and built to the verified rules, not hard-coded to the placeholder values below. **Network-rule verification is a hard launch gate.**

### 5.1 Buyer-side deadlines (when the buyer must act)
- **Unauthorized use / fraud:** Buyers should be encouraged to report promptly; card-issuer Reg E/Reg Z deadlines (typically 60 days from statement) run to the issuer, not the portal. The portal should not impose a shorter window that could prejudice the buyer's issuer rights.
- **Non-receipt / defective / duplicate:** The portal should allow reporting within a reasonable window (e.g., 60–120 days from transaction or expected delivery), subject to network reason-code filing windows for the merchant of record. **Verify** the applicable network filing windows.

### 5.2 Marketplace/seller response deadlines
- **Network response window:** The merchant of record must respond to a chargeback within the network's response window (commonly ~10–30 days depending on network and reason code). **Verify** the exact window for each supported network and reason code.
- **Portal internal SLA:** The portal should target a response well inside the network window (e.g., respond within 5–7 business days) to leave buffer for evidence review and network submission. This is a **policy choice** owned by Payments Operations, subject to the hard network deadline.

### 5.3 Clock rules
- **Clock start:** The response clock starts when the network/issuer files the chargeback or when the buyer submits the dispute, whichever is earlier for the merchant-of-record obligation. **Verify** the network's clock-start trigger.
- **Calendar vs. business days:** Network deadlines are typically calendar days; internal SLAs may be business days. The portal must track both and display the earlier hard deadline.
- **Time zones:** Use a single reference time zone for all deadline calculations and display deadlines in the buyer's local time.
- **No auto-fail on the buyer:** The portal must not let an internal SLA lapse cause the buyer's dispute to be automatically denied in a way that prejudices their issuer rights.

---

## 6. Evidence collection, file sharing, retention, and integrity rules

### 6.1 Collection
- Collect only the evidence needed for the category (Section 3), in English and Spanish intake flows.
- Accept common formats (PDF, JPG, PNG) with size limits; reject executable or script files.
- Do not request or store full card numbers, SSNs, or other sensitive data beyond what is necessary; mask card data.

### 6.2 File sharing
- Evidence is shared with the marketplace, the seller (per the marketplace's terms and routing), and, as needed, card networks and issuers to support the network response.
- Sharing must be limited to what is necessary for the dispute and consistent with the privacy notice (N5).
- **Verify** network rules on what evidence may be shared and any redaction requirements.

### 6.3 Retention
- Retain dispute records and evidence for the longer of: the network's required retention period, the applicable statute of limitations for consumer claims, and Mosaic Relay's/the marketplace's record-retention policy.
- **Verify** the network's evidence-retention mandate and any state record-retention requirements.

### 6.4 Integrity (fixed legal requirement)
- Preserve evidence in an immutable, timestamped record with a clear audit trail (who uploaded, when, and any changes).
- Prevent tampering: store originals, log access, and restrict edit/delete rights to authorized personnel.
- Maintain a chain of custody for evidence that may be submitted to a network or used in a dispute.

---

## 7. Status labels and buyer/seller/marketplace communications

### 7.1 Status labels (mixed legal/policy)
Per the recorded direction, status labels are **mixed** — some fixed by legal, some policy choices owned by Payments Operations.

**Fixed (legal/network-mandated) labels:**
- **Received** — dispute submitted and acknowledged.
- **Under review** — marketplace/seller reviewing.
- **Additional evidence requested** — more evidence needed from the buyer.
- **Resolved — refund issued** / **Resolved — no refund** — final outcome.
- **Escalated** — routed per Section 8.

**Policy labels (Payments Operations may define):**
- Internal sub-statuses (e.g., "assigned to seller," "awaiting seller response," "in network response").
- Buyer-facing wording of the fixed labels (plain-language phrasing) within legal guardrails.
- Seller-facing statuses and SLA indicators.

### 7.2 Communications
- **Buyer:** Acknowledgment, evidence requests, status updates, resolution, and escalation notices (N7–N11), in English and Spanish.
- **Seller:** Notice that a dispute was filed, evidence request, response deadline, and outcome. Seller communications are governed by the marketplace's seller terms (open item O3).
- **Marketplace:** Dashboard visibility into all disputes, response-time metrics, and escalation triggers.
- **Support agents:** Access to the full dispute record and audit trail to assist buyers and sellers.

---

## 8. Escalation path when the marketplace or seller does not respond

Open item O4. The following is the **recommended** fallback (to be confirmed by the marketplace and Payments Operations). No decision is recorded.

### 8.1 Recommended escalation ladder
1. **Tier 1 — Automated reminder.** If the marketplace/seller has not responded within the internal SLA (e.g., 3 business days), send an automated reminder with the hard network deadline.
2. **Tier 2 — Support-agent escalation.** If still no response by a second threshold (e.g., 5 business days), route to Mosaic Relay support for manual handling and direct outreach.
3. **Tier 3 — Network-deadline fallback.** If the marketplace/seller has not responded by the network deadline, the portal must **not** let the deadline lapse silently.

### 8.2 Tier 3 — recommended provisional operational default: **auto-submit, no silent lapse**

**Recommended default:** **Auto-submit a network response on the merchant of record's behalf** reflecting the buyer's claim and available evidence, so the network deadline is met and the buyer's position is preserved.

**Why auto-submit (justification):**
- A silent lapse converts a resolvable dispute into a **guaranteed adverse network outcome** (default loss) and a consumer-protection risk.
- Auto-submitting the buyer's claim preserves the buyer's position and keeps the dispute within the network process, where it can still be defended or withdrawn.
- It avoids the cost of a provisional refund while still meeting the deadline, and it keeps the decision to refund (vs. defend) with the marketplace/seller rather than forcing a payout.
- It is **reversible** in the sense that the marketplace/seller can still respond with evidence after submission, consistent with Mosaic Relay's operating principle of reversible controls.

**What remains a marketplace policy choice (not fixed by legal):**
- Whether the fallback is **auto-submit** (recommended) or **provisional refund to the buyer** (protects the buyer and avoids an adverse network outcome, but costs the marketplace/seller).
- The **internal SLA thresholds** for Tier 1 and Tier 2 (e.g., 3 and 5 business days).
- Whether the seller or the marketplace **bears the cost** of a chargeback or provisional refund (governed by seller terms — open item O3).
- Whether **manual-only** (no auto-action) is ever acceptable — **not recommended**, because it risks a silent lapse.

**Decision point:** The marketplace must choose, before launch, the Tier 3 behavior. The recommendation is **auto-submit with no silent lapse**. This is the single most important pre-launch decision because it determines chargeback liability and buyer outcomes.

---

## 9. Legal requirements versus customer policy choices

| Item | Classification | Owner |
|------|---------------|-------|
| Merchant-of-record determination and who responds to network disputes | **Legal** (determines liability) | Legal + Marketplace |
| Network chargeback deadlines and clock rules | **Legal** (network-mandated) | Legal sets; Payments Ops implements |
| Required notices (N1–N11) and plain-language disclosure | **Legal** (consumer-protection floor) | Legal sets; Payments Ops implements |
| English-plus-Spanish language support | **Policy + risk** (recorded requirement) | Payments Ops (with Legal review) |
| Evidence collection minimums and integrity/retention | **Legal** (network + consumer-protection floor) | Legal sets; Payments Ops implements |
| Status labels — fixed set | **Legal** | Legal |
| Status labels — wording and internal sub-statuses | **Policy** | Payments Ops |
| Internal response SLAs (within the network deadline) | **Policy** | Payments Ops |
| Escalation Tier 3 behavior (auto-submit vs. provisional refund) | **Policy + risk** (must be decided) | Marketplace + Payments Ops |
| Seller-term allocation of dispute/refund/chargeback responsibility | **Legal** (contract) | Legal + Marketplace |
| Bilingual notice native-speaker review | **Policy + risk** | Payments Ops |
| Accessibility (WCAG 2.1 AA baseline) | **Policy + risk** (research pending) | Payments Ops |

---

## 10. Owners and open work items

### 10.1 Owners
- **Legal (Lawyer):** Sets the legal requirements — merchant-of-record determination, network-deadline compliance, required notices, evidence floor, fixed status labels, seller-term allocation.
- **Payments Operations:** Owns the operating-model decisions — internal SLAs, status-label wording, buyer/seller/marketplace communications, escalation implementation, evidence retention operations.
- **Marketplace (customer):** Decides the Tier 3 escalation behavior, seller-term allocation, and any policy choices beyond the legal floor.
- **Risk & Fraud:** Supports evidence integrity, fraud review, and escalation handling.
- **Product/Engineering:** Builds the portal to the requirements; implements the configurable clock logic and bilingual flows.

### 10.2 Open work items (before launch)

| # | Work item | Owner | Needed by |
|---|-----------|-------|-----------|
| W1 | Confirm merchant of record / customer of record for the card transactions | Legal + Marketplace | Before launch |
| W2 | Confirm which card networks and regions the initial release supports | Product + Marketplace | Before launch |
| W3 | Verify current Visa/Mastercard chargeback timeframes, reason codes, and evidence requirements for the four categories | Legal (research in progress) | Before launch (hard gate) |
| W4 | Check whether marketplace seller terms and marketplace terms allocate dispute/refund/chargeback responsibility; amend if silent | Legal + Marketplace | Before launch |
| W5 | Decide Tier 3 escalation behavior (recommended: auto-submit, no silent lapse) | Marketplace + Payments Ops | Before launch |
| W6 | Verify FTC MTO rule applicability to the marketplace and sellers | Legal | Before launch |
| W7 | Confirm accessibility (ADA/WCAG) requirements for the portal | Legal (research in progress) | Before launch |
| W8 | Draft English and Spanish notice text and plain-language disclosures | Legal + Payments Ops | Before launch |
| W9 | Build configurable deadline/clock logic to verified network rules | Product/Engineering | Before launch |
| W10 | Define evidence retention schedule and audit-trail controls | Payments Ops + Legal | Before launch |
| W11 | Native-speaker review and plain-language testing of English/Spanish notices | Payments Ops | Before launch |
| W12 | Verify network evidence-sharing/redaction rules and confirm privacy-law scope (U.S. vs. EU/LatAm) | Legal | Before launch |

---

## 11. Material assumptions and missing facts

- **Merchant of record** is assumed to be the marketplace (Mosaic Relay as service provider). If Mosaic Relay is the merchant of record or a payment facilitator treated as such, the entire response/liability model shifts to Mosaic Relay and the six-week launch is likely infeasible.
- **Networks/regions** assumed U.S. Visa/Mastercard for the initial release. Adding Amex, Discover, or non-U.S. regions changes deadlines, evidence rules, and notices.
- **Seller terms** assumed not to allocate dispute responsibility; must be checked and amended if silent.
- **Escalation Tier 3** behavior is undecided and is the single most important pre-launch decision. Recommended: **auto-submit with no silent lapse**.
- **Reg E/Reg Z** obligations run to the card issuer, not to Mosaic Relay or the marketplace, **conditional on merchant-of-record status**; the portal's role is evidence collection and transmission.
- **Network timeframes, consumer-protection notices, and accessibility** are the subject of in-progress research runs and must be verified against current rules before the portal's clock logic and notices are finalized. The prior research run was model-only (external research timed out); nothing is verified current law or current network rules.

---

## 12. What would change this

- **Working assumption:** The marketplace is the merchant of record and Mosaic Relay is a service provider. If Mosaic Relay is the merchant of record or a payment facilitator treated as such, the entire response/liability model shifts to Mosaic Relay and the six-week launch is likely infeasible.
- **Working assumption:** The initial release is U.S.-focused, Visa/Mastercard consumer card purchases. If Amex, Discover, or non-U.S. regions are added, additional reason codes, timeframes, evidence rules, and local consumer-protection law apply.
- **Open fork:** Tier 3 escalation — auto-submit (recommended) vs. provisional refund vs. manual-only. The recommendation is auto-submit with no silent lapse, but the marketplace's choice determines who bears missed-deadline risk and buyer outcomes.
- **Not examined:** The current Visa/Mastercard chargeback guides were **not retrieved** (external research timed out). Exact reason codes, timeframes, and evidence requirements must be verified against current network publications before the clock logic and evidence checklists are finalized.
- **Not examined:** The marketplace agreement, Mosaic Relay's acquiring/processor contracts, and the marketplace's seller terms were **not reviewed**. Merchant-of-record, payment-facilitator, and terms-allocation questions remain open.
- **Not examined:** The consumer-protection-notice and accessibility research runs are **still running/queued** and have produced no retrievable authority. State-law and accessibility conclusions are generated analysis pending those runs.
