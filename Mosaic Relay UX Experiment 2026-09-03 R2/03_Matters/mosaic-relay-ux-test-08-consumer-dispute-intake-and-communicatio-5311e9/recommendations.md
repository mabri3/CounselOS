---
matter_id: MAT-20260903-5311e9
record_type: recommendations
current_recommendation_version_id: REC-20260903-983031
recommendation_versions:
- version_id: REC-20260903-983031
  number: 1
  content: '# Consumer Dispute Portal — Recommended Operating Model for Launch


    **Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications

    **Status:** Formal recommendation — **no decision recorded.**

    **Target release:** 2026-10-15 (six weeks)

    **Scope:** Consumer-only buyers; card purchases; English plus Spanish; U.S.-focused
    initial release (assumption)


    This recommendation sets out the operating model recommended for launch, built
    on the reconciled research packet. It separates **legal requirements** (fixed)
    from **customer policy choices** (owned by Payments Operations / the marketplace).
    The Tier 3 escalation default is recommended as **auto-submit with no silent lapse**,
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

    | Status labels | Fixed legal set + policy wording (Section 6) | Mixed | Legal
    + Payments Ops |

    | Bilingual comms | English + Spanish, native-speaker reviewed (Section 7) | Policy
    + risk | Payments Ops |

    | Escalation | 3-tier ladder; Tier 3 default = auto-submit, no silent lapse (Section
    8) | Policy + risk (must be decided) | Marketplace + Payments Ops |

    | Owners | Owner matrix (Section 9) | — | — |


    ---


    ## 2. Exact intake fields


    ### 2.1 Common intake (all categories) — legal floor

    1. Order/transaction identifier (order number, transaction reference, or card
    statement line).

    2. Transaction date and amount.

    3. Card used (last four digits) and whether the buyer recognizes the charge.

    4. **Date the buyer first became aware of the issue** — *fixed legal field* (drives
    issuer-side Reg E/Reg Z deadlines).

    5. **Statement date** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).

    6. Whether the buyer has already contacted the seller or marketplace directly,
    and the outcome.

    7. Whether the buyer has already filed a dispute with their card issuer (and,
    if so, the issuer''s reference).

    8. Contact method and preferred language (English/Spanish) for dispute communications.


    ### 2.2 Non-receipt

    1. Was the item ever shipped? If known, provide tracking number and carrier.

    2. **What delivery date was promised at purchase?** — *fixed legal field* (MTO
    + network non-receipt reason codes).

    3. What is the current delivery status (delivered / in transit / no tracking /
    unknown)?

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

    3. Does the buyer believe a family member, employee, or other authorized user
    made the charge?

    4. Has the buyer reported the unauthorized use to their card issuer, and has the
    issuer opened an investigation?

    5. Has the buyer filed a police report (if applicable)?

    6. Evidence to upload: card statement showing the charge, issuer correspondence,
    police report (if any).


    ### 2.4 Duplicate charges

    1. Was the buyer charged more than once for the same order?

    2. Provide the order number(s) and the duplicate transaction references/amounts.

    3. Was the buyer charged for an order they did not place, or charged twice for
    one order?

    4. Has the buyer already received a refund for one of the charges?

    5. Evidence to upload: card statement showing both charges, order confirmation(s).


    ### 2.5 Defective goods

    1. What is the defect, and when was it discovered?

    2. Was the item used or installed before the defect appeared?

    3. Has the buyer contacted the seller or manufacturer about the defect, and what
    was the response?

    4. Is the buyer seeking a refund, replacement, or repair?

    5. Evidence to upload: photos/videos of the defect, order confirmation, seller
    correspondence, any warranty documents.


    ---


    ## 3. Mandatory notices and plain-language disclosure points (English and Spanish)


    All notices must be provided in **English and Spanish** at intake and at each
    status change. Plain-language drafting is required.


    ### 3.1 Intake-time disclosures (shown before the buyer submits)

    - **N1 — What the portal does and does not do.** Collects the dispute and evidence
    and routes it to the marketplace/seller for review; not a guarantee of a refund
    and does not replace the buyer''s right to dispute with their card issuer.

    - **N2 — Card-issuer rights preserved.** Buyer may still contact their card issuer;
    using the portal does not waive that right.

    - **N3 — What happens next and expected timing.** Review process, response-time
    target, how the buyer will be updated.

    - **N4 — Evidence requirements.** What evidence is needed; incomplete evidence
    may delay/prevent resolution; do not submit sensitive data (full card numbers,
    SSNs).

    - **N5 — Data use and sharing.** Evidence will be shared with the marketplace,
    seller, and (as needed) card networks and issuers; reference the privacy notice.

    - **N6 — No admission of liability.** Submitting a dispute is not an admission
    by the marketplace or seller.


    ### 3.2 Status-change notices (sent at each milestone)

    - **N7 — Acknowledgment.** Received, reference number, expected next step.

    - **N8 — Evidence received / additional evidence requested.** When complete or
    when more is needed, with a deadline to respond.

    - **N9 — Under review.** Marketplace/seller is reviewing.

    - **N10 — Resolution.** Outcome (refund issued, denied, or escalated) with reason
    and next steps.

    - **N11 — Escalation.** When escalated (per Section 8) and what that means for
    the buyer.


    ### 3.3 Plain-language disclosure points

    - Short sentences, common words, no legal jargon.

    - State deadlines in plain calendar terms (e.g., "within 10 calendar days").

    - Same content in both languages; no machine translation without native-speaker
    review.

    - Make "contact your card issuer" prominent.


    ---


    ## 4. Deadlines and clock rules


    **Hard launch gate:** The clock logic and evidence checklists must **not ship**
    until the current Visa/Mastercard rules for the supported networks are pulled
    and reconciled. The values below are placeholders subject to verification.


    ### 4.1 Buyer-side deadlines

    - **Unauthorized use / fraud:** Encourage prompt reporting; issuer Reg E/Reg Z
    deadlines (typically 60 days from statement) run to the issuer, not the portal.
    The portal must not impose a shorter window that could prejudice the buyer''s
    issuer rights.

    - **Non-receipt / defective / duplicate:** Allow reporting within a reasonable
    window (e.g., 60–120 days from transaction or expected delivery), subject to network
    reason-code filing windows. **Verify** the applicable network filing windows.


    ### 4.2 Marketplace/seller response deadlines

    - **Network response window:** The merchant of record must respond within the
    network''s window (commonly ~10–30 days depending on network and reason code).
    **Verify** the exact window for each supported network and reason code.

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

    - Evidence is shared with the marketplace, the seller (per the marketplace''s
    terms and routing), and, as needed, card networks and issuers.

    - Sharing limited to what is necessary and consistent with the privacy notice
    (N5).

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

    - Prevent tampering: store originals, log access, restrict edit/delete rights
    to authorized personnel.

    - Maintain a chain of custody for evidence that may be submitted to a network
    or used in a dispute.


    ---


    ## 6. Status labels


    Per the recorded direction, status labels are **mixed** — some fixed by legal,
    some policy.


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
    but it is a recorded requirement for launch and should be treated as fixed for
    the initial release.

    - **Native-speaker review and plain-language testing** of all English/Spanish
    notices before launch (tracked deliverable).

    - Seller and marketplace communications may be English-only unless the marketplace''s
    terms require otherwise (policy choice).


    ---


    ## 8. Escalation path when the marketplace or seller does not respond


    ### 8.1 Recommended escalation ladder

    1. **Tier 1 — Automated reminder.** If the marketplace/seller has not responded
    within the internal SLA (e.g., 3 business days), send an automated reminder with
    the hard network deadline.

    2. **Tier 2 — Support-agent escalation.** If still no response by a second threshold
    (e.g., 5 business days), route to Mosaic Relay support for manual handling and
    direct outreach.

    3. **Tier 3 — Network-deadline fallback.** If the marketplace/seller has not responded
    by the network deadline, the portal must **not** let the deadline lapse silently.


    ### 8.2 Tier 3 — recommended provisional operational default: **auto-submit, no
    silent lapse**


    **Recommended default:** **Auto-submit a network response on the merchant of record''s
    behalf** reflecting the buyer''s claim and available evidence, so the network
    deadline is met and the buyer''s position is preserved.


    **Why auto-submit (justification):**

    - A silent lapse converts a resolvable dispute into a **guaranteed adverse network
    outcome** (default loss) and a consumer-protection risk.

    - Auto-submitting the buyer''s claim preserves the buyer''s position and keeps
    the dispute within the network process, where it can still be defended or withdrawn.

    - It avoids the cost of a provisional refund while still meeting the deadline,
    and it keeps the decision to refund (vs. defend) with the marketplace/seller rather
    than forcing a payout.

    - It is **reversible** in the sense that the marketplace/seller can still respond
    with evidence after submission, consistent with Mosaic Relay''s operating principle
    of reversible controls.


    **What remains a marketplace policy choice (not fixed by legal):**

    - Whether the fallback is **auto-submit** (recommended) or **provisional refund
    to the buyer** (protects the buyer and avoids an adverse network outcome, but
    costs the marketplace/seller).

    - The **internal SLA thresholds** for Tier 1 and Tier 2 (e.g., 3 and 5 business
    days).

    - Whether the seller or the marketplace **bears the cost** of a chargeback or
    provisional refund (governed by seller terms — open item O3).

    - Whether **manual-only** (no auto-action) is ever acceptable — **not recommended**,
    because it risks a silent lapse.


    **Decision point:** The marketplace must choose, before launch, the Tier 3 behavior.
    The recommendation is **auto-submit with no silent lapse**. This is the single
    most important pre-launch decision because it determines chargeback liability
    and buyer outcomes.


    ---


    ## 9. Owner matrix


    | Item | Classification | Owner |

    |------|---------------|-------|

    | Merchant-of-record determination and who responds to network disputes | **Legal**
    (determines liability) | Legal + Marketplace |

    | Network chargeback deadlines and clock rules | **Legal** (network-mandated)
    | Legal sets; Payments Ops implements |

    | Required notices (N1–N11) and plain-language disclosure | **Legal** (consumer-protection
    floor) | Legal sets; Payments Ops implements |

    | English-plus-Spanish language support | **Policy + risk** (recorded requirement)
    | Payments Ops (with Legal review) |

    | Evidence collection minimums and integrity/retention | **Legal** (network +
    consumer-protection floor) | Legal sets; Payments Ops implements |

    | Status labels — fixed set | **Legal** | Legal |

    | Status labels — wording and internal sub-statuses | **Policy** | Payments Ops
    |

    | Internal response SLAs (within the network deadline) | **Policy** | Payments
    Ops |

    | Escalation Tier 3 behavior (auto-submit vs. provisional refund) | **Policy +
    risk** (must be decided) | Marketplace + Payments Ops |

    | Seller-term allocation of dispute/refund/chargeback responsibility | **Legal**
    (contract) | Legal + Marketplace |

    | Bilingual notice native-speaker review | **Policy + risk** | Payments Ops |

    | Accessibility (WCAG 2.1 AA baseline) | **Policy + risk** (research pending)
    | Payments Ops |


    ---


    ## 10. Open work items (before launch)


    | # | Work item | Owner | Needed by |

    |---|-----------|-------|-----------|

    | W1 | Confirm merchant of record / customer of record for the card transactions
    | Legal + Marketplace | Before launch |

    | W2 | Confirm which card networks and regions the initial release supports |
    Product + Marketplace | Before launch |

    | W3 | Verify current Visa/Mastercard chargeback timeframes, reason codes, and
    evidence requirements for the four categories | Legal (research in progress) |
    Before launch (hard gate) |

    | W4 | Check whether marketplace seller terms and marketplace terms allocate dispute/refund/chargeback
    responsibility; amend if silent | Legal + Marketplace | Before launch |

    | W5 | Decide Tier 3 escalation behavior (recommended: auto-submit, no silent
    lapse) | Marketplace + Payments Ops | Before launch |

    | W6 | Verify FTC MTO rule applicability to the marketplace and sellers | Legal
    | Before launch |

    | W7 | Confirm accessibility (ADA/WCAG) requirements for the portal | Legal (research
    in progress) | Before launch |

    | W8 | Draft English and Spanish notice text and plain-language disclosures |
    Legal + Payments Ops | Before launch |

    | W9 | Build configurable deadline/clock logic to verified network rules | Product/Engineering
    | Before launch |

    | W10 | Define evidence retention schedule and audit-trail controls | Payments
    Ops + Legal | Before launch |

    | W11 | Native-speaker review and plain-language testing of English/Spanish notices
    | Payments Ops | Before launch |

    | W12 | Verify network evidence-sharing/redaction rules and confirm privacy-law
    scope (U.S. vs. EU/LatAm) | Legal | Before launch |


    ---


    ## 11. What would change this


    - **Working assumption:** The marketplace is the merchant of record and Mosaic
    Relay is a service provider. If Mosaic Relay is the merchant of record or a payment
    facilitator treated as such, the entire response/liability model shifts to Mosaic
    Relay and the six-week launch is likely infeasible.

    - **Working assumption:** The initial release is U.S.-focused, Visa/Mastercard
    consumer card purchases. If Amex, Discover, or non-U.S. regions are added, additional
    reason codes, timeframes, evidence rules, and local consumer-protection law apply.

    - **Open fork:** Tier 3 escalation — auto-submit (recommended) vs. provisional
    refund vs. manual-only. The recommendation is auto-submit with no silent lapse,
    but the marketplace''s choice determines who bears missed-deadline risk and buyer
    outcomes.

    - **Not examined:** The current Visa/Mastercard chargeback guides were **not retrieved**
    (external research timed out). Exact reason codes, timeframes, and evidence requirements
    must be verified against current network publications before the clock logic and
    evidence checklists are finalized.

    - **Not examined:** The marketplace agreement, Mosaic Relay''s acquiring/processor
    contracts, and the marketplace''s seller terms were **not reviewed**. Merchant-of-record,
    payment-facilitator, and terms-allocation questions remain open.

    - **Not examined:** The consumer-protection-notice and accessibility research
    runs are **still running/queued** and have produced no retrievable authority.
    State-law and accessibility conclusions are generated analysis pending those runs.'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-03T18:17:09+00:00'
recommendation_updated_at: '2026-09-03T18:17:09+00:00'
recommendation_updated_by: Themis.ai
proposed_recommendation: null
---
# Consumer Dispute Portal — Recommended Operating Model for Launch

**Matter:** Mosaic Relay UX Test — 08 — Consumer Dispute Intake and Communications
**Status:** Formal recommendation — **no decision recorded.**
**Target release:** 2026-10-15 (six weeks)
**Scope:** Consumer-only buyers; card purchases; English plus Spanish; U.S.-focused initial release (assumption)

This recommendation sets out the operating model recommended for launch, built on the reconciled research packet. It separates **legal requirements** (fixed) from **customer policy choices** (owned by Payments Operations / the marketplace). The Tier 3 escalation default is recommended as **auto-submit with no silent lapse**, with the marketplace's policy choice clearly flagged.

---

## 1. Recommended operating model at a glance

| Element | Recommendation | Classification | Owner |
|---------|---------------|----------------|-------|
| Intake fields | Common + category-specific (Section 2) | Legal floor + policy additions | Legal sets; Payments Ops implements |
| Notices | N1–N11 in English and Spanish (Section 3) | Legal floor | Legal sets; Payments Ops implements |
| Deadlines & clocks | Configurable to verified network rules; hard launch gate (Section 4) | Legal (network) + policy SLA | Legal sets; Payments Ops implements |
| Evidence | Collection, sharing, retention, integrity (Section 5) | Legal floor + policy | Legal sets; Payments Ops implements |
| Status labels | Fixed legal set + policy wording (Section 6) | Mixed | Legal + Payments Ops |
| Bilingual comms | English + Spanish, native-speaker reviewed (Section 7) | Policy + risk | Payments Ops |
| Escalation | 3-tier ladder; Tier 3 default = auto-submit, no silent lapse (Section 8) | Policy + risk (must be decided) | Marketplace + Payments Ops |
| Owners | Owner matrix (Section 9) | — | — |

---

## 2. Exact intake fields

### 2.1 Common intake (all categories) — legal floor
1. Order/transaction identifier (order number, transaction reference, or card statement line).
2. Transaction date and amount.
3. Card used (last four digits) and whether the buyer recognizes the charge.
4. **Date the buyer first became aware of the issue** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).
5. **Statement date** — *fixed legal field* (drives issuer-side Reg E/Reg Z deadlines).
6. Whether the buyer has already contacted the seller or marketplace directly, and the outcome.
7. Whether the buyer has already filed a dispute with their card issuer (and, if so, the issuer's reference).
8. Contact method and preferred language (English/Spanish) for dispute communications.

### 2.2 Non-receipt
1. Was the item ever shipped? If known, provide tracking number and carrier.
2. **What delivery date was promised at purchase?** — *fixed legal field* (MTO + network non-receipt reason codes).
3. What is the current delivery status (delivered / in transit / no tracking / unknown)?
4. If marked delivered, was the item left at the address, and is there any delivery photo or signature?
5. Has the buyer requested a refund or replacement from the seller, and what was the response?
6. Evidence to upload: order confirmation, tracking page, delivery photo, seller correspondence.

### 2.3 Unauthorized use
1. Does the buyer recognize the transaction at all?
2. Was the card or card details lost, stolen, or otherwise accessible to someone else?
3. Does the buyer believe a family member, employee, or other authorized user made the charge?
4. Has the buyer reported the unauthorized use to their card issuer, and has the issuer opened an investigation?
5. Has the buyer filed a police report (if applicable)?
6. Evidence to upload: card statement showing the charge, issuer correspondence, police report (if any).

### 2.4 Duplicate charges
1. Was the buyer charged more than once for the same order?
2. Provide the order number(s) and the duplicate transaction references/amounts.
3. Was the buyer charged for an order they did not place, or charged twice for one order?
4. Has the buyer already received a refund for one of the charges?
5. Evidence to upload: card statement showing both charges, order confirmation(s).

### 2.5 Defective goods
1. What is the defect, and when was it discovered?
2. Was the item used or installed before the defect appeared?
3. Has the buyer contacted the seller or manufacturer about the defect, and what was the response?
4. Is the buyer seeking a refund, replacement, or repair?
5. Evidence to upload: photos/videos of the defect, order confirmation, seller correspondence, any warranty documents.

---

## 3. Mandatory notices and plain-language disclosure points (English and Spanish)

All notices must be provided in **English and Spanish** at intake and at each status change. Plain-language drafting is required.

### 3.1 Intake-time disclosures (shown before the buyer submits)
- **N1 — What the portal does and does not do.** Collects the dispute and evidence and routes it to the marketplace/seller for review; not a guarantee of a refund and does not replace the buyer's right to dispute with their card issuer.
- **N2 — Card-issuer rights preserved.** Buyer may still contact their card issuer; using the portal does not waive that right.
- **N3 — What happens next and expected timing.** Review process, response-time target, how the buyer will be updated.
- **N4 — Evidence requirements.** What evidence is needed; incomplete evidence may delay/prevent resolution; do not submit sensitive data (full card numbers, SSNs).
- **N5 — Data use and sharing.** Evidence will be shared with the marketplace, seller, and (as needed) card networks and issuers; reference the privacy notice.
- **N6 — No admission of liability.** Submitting a dispute is not an admission by the marketplace or seller.

### 3.2 Status-change notices (sent at each milestone)
- **N7 — Acknowledgment.** Received, reference number, expected next step.
- **N8 — Evidence received / additional evidence requested.** When complete or when more is needed, with a deadline to respond.
- **N9 — Under review.** Marketplace/seller is reviewing.
- **N10 — Resolution.** Outcome (refund issued, denied, or escalated) with reason and next steps.
- **N11 — Escalation.** When escalated (per Section 8) and what that means for the buyer.

### 3.3 Plain-language disclosure points
- Short sentences, common words, no legal jargon.
- State deadlines in plain calendar terms (e.g., "within 10 calendar days").
- Same content in both languages; no machine translation without native-speaker review.
- Make "contact your card issuer" prominent.

---

## 4. Deadlines and clock rules

**Hard launch gate:** The clock logic and evidence checklists must **not ship** until the current Visa/Mastercard rules for the supported networks are pulled and reconciled. The values below are placeholders subject to verification.

### 4.1 Buyer-side deadlines
- **Unauthorized use / fraud:** Encourage prompt reporting; issuer Reg E/Reg Z deadlines (typically 60 days from statement) run to the issuer, not the portal. The portal must not impose a shorter window that could prejudice the buyer's issuer rights.
- **Non-receipt / defective / duplicate:** Allow reporting within a reasonable window (e.g., 60–120 days from transaction or expected delivery), subject to network reason-code filing windows. **Verify** the applicable network filing windows.

### 4.2 Marketplace/seller response deadlines
- **Network response window:** The merchant of record must respond within the network's window (commonly ~10–30 days depending on network and reason code). **Verify** the exact window for each supported network and reason code.
- **Portal internal SLA:** Target a response well inside the network window (e.g., 5–7 business days) to leave buffer. **Policy choice** owned by Payments Operations, subject to the hard network deadline.

### 4.3 Clock rules
- **Clock start:** When the network/issuer files the chargeback or when the buyer submits the dispute, whichever is earlier for the merchant-of-record obligation. **Verify** the network's clock-start trigger.
- **Calendar vs. business days:** Network deadlines are typically calendar days; internal SLAs may be business days. Track both and display the earlier hard deadline.
- **Time zones:** Single reference time zone for calculations; display deadlines in the buyer's local time.
- **No auto-fail on the buyer:** An internal SLA lapse must not cause the buyer's dispute to be automatically denied in a way that prejudices their issuer rights.

---

## 5. Evidence collection, sharing, retention, and integrity

### 5.1 Collection
- Collect only the evidence needed for the category (Section 2), in English and Spanish intake flows.
- Accept common formats (PDF, JPG, PNG) with size limits; reject executable/script files.
- Do not request or store full card numbers, SSNs, or other sensitive data beyond what is necessary; mask card data.

### 5.2 File sharing
- Evidence is shared with the marketplace, the seller (per the marketplace's terms and routing), and, as needed, card networks and issuers.
- Sharing limited to what is necessary and consistent with the privacy notice (N5).
- **Verify** network rules on what evidence may be shared and any redaction requirements.

### 5.3 Retention
- Retain for the longer of: the network's required retention period, the applicable statute of limitations, and Mosaic Relay's/the marketplace's record-retention policy.
- **Verify** the network's evidence-retention mandate and any state record-retention requirements.

### 5.4 Integrity (fixed legal requirement)
- Preserve evidence in an immutable, timestamped record with a clear audit trail (who uploaded, when, and any changes).
- Prevent tampering: store originals, log access, restrict edit/delete rights to authorized personnel.
- Maintain a chain of custody for evidence that may be submitted to a network or used in a dispute.

---

## 6. Status labels

Per the recorded direction, status labels are **mixed** — some fixed by legal, some policy.

### 6.1 Fixed (legal/network-mandated) labels
- **Received** — dispute submitted and acknowledged.
- **Under review** — marketplace/seller reviewing.
- **Additional evidence requested** — more evidence needed from the buyer.
- **Resolved — refund issued** / **Resolved — no refund** — final outcome.
- **Escalated** — routed per Section 8.

### 6.2 Policy labels (Payments Operations may define)
- Internal sub-statuses (e.g., "assigned to seller," "awaiting seller response," "in network response").
- Buyer-facing wording of the fixed labels (plain-language phrasing) within legal guardrails.
- Seller-facing statuses and SLA indicators.

---

## 7. Bilingual communications

- **English plus Spanish** for all buyer-facing notices, intake flows, and status updates (recorded requirement).
- Bilingual support is a **policy-plus-risk** decision (no hard federal mandate), but it is a recorded requirement for launch and should be treated as fixed for the initial release.
- **Native-speaker review and plain-language testing** of all English/Spanish notices before launch (tracked deliverable).
- Seller and marketplace communications may be English-only unless the marketplace's terms require otherwise (policy choice).

---

## 8. Escalation path when the marketplace or seller does not respond

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

## 9. Owner matrix

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

## 10. Open work items (before launch)

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

## 11. What would change this

- **Working assumption:** The marketplace is the merchant of record and Mosaic Relay is a service provider. If Mosaic Relay is the merchant of record or a payment facilitator treated as such, the entire response/liability model shifts to Mosaic Relay and the six-week launch is likely infeasible.
- **Working assumption:** The initial release is U.S.-focused, Visa/Mastercard consumer card purchases. If Amex, Discover, or non-U.S. regions are added, additional reason codes, timeframes, evidence rules, and local consumer-protection law apply.
- **Open fork:** Tier 3 escalation — auto-submit (recommended) vs. provisional refund vs. manual-only. The recommendation is auto-submit with no silent lapse, but the marketplace's choice determines who bears missed-deadline risk and buyer outcomes.
- **Not examined:** The current Visa/Mastercard chargeback guides were **not retrieved** (external research timed out). Exact reason codes, timeframes, and evidence requirements must be verified against current network publications before the clock logic and evidence checklists are finalized.
- **Not examined:** The marketplace agreement, Mosaic Relay's acquiring/processor contracts, and the marketplace's seller terms were **not reviewed**. Merchant-of-record, payment-facilitator, and terms-allocation questions remain open.
- **Not examined:** The consumer-protection-notice and accessibility research runs are **still running/queued** and have produced no retrievable authority. State-law and accessibility conclusions are generated analysis pending those runs.
