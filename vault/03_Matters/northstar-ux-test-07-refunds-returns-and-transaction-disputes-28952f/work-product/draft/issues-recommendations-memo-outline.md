---
matter_id: MAT-20260830-28952f
record_type: memo_outline
stage: explore
review:
  segments:
  - kind: equal
    text: '# Issues-and-Recommendations Memo Outline — Refunds, Returns, and Transaction
      Disputes


      **Matter:** Northstar UX Test — 07 — Refunds, Returns, and Transaction Disputes

      **Stage:** Explore | **Legal owner:** Brian Harris | **Status:** Outline for
      review — no decision recorded


      ## I. Question Presented


      What refund-allocation, dispute-investigation, notice, and timeline rules should
      govern Northstar Pay''s standardized refund/dispute flow — including whether
      customers must keep paying during a pending dispute and how quickly repayment
      schedules must adjust — before Product launches ahead of retail-category expansion?


      ## II. Short Answer (to be drafted in Generate)


      Recommend the card-equivalent dispute standard across all products (Path A):
      provisional credit for unauthorized-transaction disputes, 5-day acknowledgment,
      defined investigation window, no payment obligation on the disputed amount during
      review, plus a state-law overlay and a documented refund-allocation rule. Merchant-conduct
      disputes (defective goods, non-delivery) route through network chargeback-style
      handling with continued payment obligations disclosed up front.


      ## III. Background and Facts


      - **Supplied facts (from Product request):** Merchants may issue full or partial
      refunds at different times; some do not reliably send item-level information.
      Customers may report unauthorized transactions, defective goods, or merchant
      non-delivery through support. A customer may continue to owe payments while
      a dispute is under review.

      - **Supplied facts (company profile):** Phased state rollout (CA, CO, GA, IL,
      NY, TX, WA live for pay-in-4); different bank/lending partners by product and
      state; partner map still being finalized.

      - **Assumptions (not confirmed):** First release may cover pay-in-4 and longer-term
      installments; bank/lending partner may be creditor or servicer of record; flow
      needs an idempotent refund identifier; notices delivered in-app with a backup
      channel.


      ## IV. Issue Map


      1. **Refund intake and duplicate suppression** — idempotent refund identifier;
      reconciliation across merchant, processor, and partner systems.

      2. **Refund allocation** — full vs. partial; itemized vs. non-itemized; default
      rule (recommended: apply to remaining installments, last-payment-first) documented
      in the customer agreement.

      3. **Schedule adjustment** — recalculation vs. pause; timing commitment for
      adjusted-schedule notice.

      4. **Customer notices** — refund confirmation, adjusted-schedule notice, dispute
      acknowledgment, interim status, final resolution; E-SIGN consent for electronic
      delivery.

      5. **Unauthorized-transaction disputes** — Reg Z §1026.13 applicability; CFPB
      BNPL interpretive rule (unverified lead); investigation process and timelines.

      6. **Merchant-conduct disputes** — defective goods/non-delivery are not authorization
      errors; chargeback-style process; UDAP exposure in how the process is described.

      7. **Card-network and bank-partner requirements** — chargeback timelines, refund
      pass-through, partner-of-record duties.

      8. **Merchant contract obligations** — refund notification SLAs, data format,
      liability for duplicates, escalation duties.

      9. **State-law overlay** — servicing, dispute, and notice rules in the seven
      live states (unverified lead; state-by-state verification needed).


      ## V. Decision Points for Counsel


      | # | Decision | Options | Recommendation |

      |---|----------|---------|----------------|

      | 1 | Dispute standard | (A) Card-equivalent rights across all products vs.
      (B) tiered: full rights for unauthorized transactions only | Path A — single
      experience, highest compliance margin |

      | 2 | Payment during dispute | Pause disputed amount vs. continue with disclosure
      | Pause disputed amount for unauthorized transactions; continue with clear disclosure
      for merchant-conduct disputes |

      | 3 | Refund allocation rule | Last-payment-first vs. pro rata vs. next-payment-first
      | Last-payment-first, documented in customer agreement |

      | 4 | Non-itemized partial refunds | Merchant-provided allocation vs. default
      rule | Default rule with merchant contract push for item-level data |

      | 5 | Notice channel | In-app only vs. in-app + backup | In-app with backup
      channel per product terms/law |

      | 6 | Merchant contract terms | Current terms vs. amended SLAs | Amend merchant
      agreements: refund notification SLA, data format, duplicate-refund liability
      |


      ## VI. Operational Timeline (generated analysis — subject to verification)


      | Step | Trigger | Action | Owner | Target |

      |------|---------|--------|-------|--------|

      | 1 | Merchant issues refund | Receive refund data; dedupe via idempotent identifier
      | Northstar Pay ops/system | Real time |

      | 2 | Refund received | Apply to outstanding balance per allocation rule | System
      | Same business day |

      | 3 | Balance adjusted | Recalculate future payments; generate adjusted schedule
      | System | Same business day |

      | 4 | Schedule adjusted | Notify customer in-app of refund and new schedule
      | System | Within 1 business day |

      | 5 | Customer reports dispute | Acknowledge receipt; open case | Support |
      Within 5 days (recommended) |

      | 6 | Unauthorized-transaction dispute | Investigate; provisionally credit disputed
      amount; pause collection on disputed amount | Dispute team | Investigation complete
      within 2 cycles/90 days (recommended) |

      | 7 | Merchant-conduct dispute | Route to merchant/network chargeback; disclose
      continued payment obligation | Dispute team | Per network rules (unverified
      lead) |

      | 8 | Dispute resolved | Notify customer of outcome and any schedule change
      | Dispute team | Within 5 days of resolution (recommended) |

      | 9 | Missing item-level data | Apply default allocation; flag merchant for
      escalation | Ops | Per SLA (to be defined) |


      ## VII. Missing Facts / Open Questions


      1. Which entity is creditor/servicer of record for each product and state?

      2. Are any products open-end or credit-card-like (triggering §1026.13 directly)?

      3. What do card-network and bank-partner agreements require for dispute handling
      and refund pass-through?

      4. What do current merchant contracts say about refund timing and data format?

      5. Current status of the CFPB BNPL interpretive rule (litigation/revision since
      2024)?

      6. State servicing/dispute requirements for CA, CO, GA, IL, NY, TX, WA?


      ## VIII. Provenance


      - **Verified sources:** None — external search not enabled for the research
      run.

      - **Supplied sources:** Product request; matter conversation record; company
      profile.

      - **Unverified leads:** CFPB BNPL interpretive rule status; state servicing
      rules for live states; card-network dispute rules.

      - **Assumptions:** Creditor/servicer structure; product/state scope; idempotent
      refund identifier; in-app notice channel.

      - **Generated analysis:** Issue map, decision points, operational timeline,
      and recommendations above.


      ## IX. Next Steps


      1. Counsel verifies unverified leads (last-mile review).

      2. Confirm missing facts with Product and lending partners.

      3. Draft full memo in Generate stage.

      4. No decision recorded — decision points await counsel review.

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
# Issues-and-Recommendations Memo Outline — Refunds, Returns, and Transaction Disputes

**Matter:** Northstar UX Test — 07 — Refunds, Returns, and Transaction Disputes
**Stage:** Explore | **Legal owner:** Brian Harris | **Status:** Outline for review — no decision recorded

## I. Question Presented

What refund-allocation, dispute-investigation, notice, and timeline rules should govern Northstar Pay's standardized refund/dispute flow — including whether customers must keep paying during a pending dispute and how quickly repayment schedules must adjust — before Product launches ahead of retail-category expansion?

## II. Short Answer (to be drafted in Generate)

Recommend the card-equivalent dispute standard across all products (Path A): provisional credit for unauthorized-transaction disputes, 5-day acknowledgment, defined investigation window, no payment obligation on the disputed amount during review, plus a state-law overlay and a documented refund-allocation rule. Merchant-conduct disputes (defective goods, non-delivery) route through network chargeback-style handling with continued payment obligations disclosed up front.

## III. Background and Facts

- **Supplied facts (from Product request):** Merchants may issue full or partial refunds at different times; some do not reliably send item-level information. Customers may report unauthorized transactions, defective goods, or merchant non-delivery through support. A customer may continue to owe payments while a dispute is under review.
- **Supplied facts (company profile):** Phased state rollout (CA, CO, GA, IL, NY, TX, WA live for pay-in-4); different bank/lending partners by product and state; partner map still being finalized.
- **Assumptions (not confirmed):** First release may cover pay-in-4 and longer-term installments; bank/lending partner may be creditor or servicer of record; flow needs an idempotent refund identifier; notices delivered in-app with a backup channel.

## IV. Issue Map

1. **Refund intake and duplicate suppression** — idempotent refund identifier; reconciliation across merchant, processor, and partner systems.
2. **Refund allocation** — full vs. partial; itemized vs. non-itemized; default rule (recommended: apply to remaining installments, last-payment-first) documented in the customer agreement.
3. **Schedule adjustment** — recalculation vs. pause; timing commitment for adjusted-schedule notice.
4. **Customer notices** — refund confirmation, adjusted-schedule notice, dispute acknowledgment, interim status, final resolution; E-SIGN consent for electronic delivery.
5. **Unauthorized-transaction disputes** — Reg Z §1026.13 applicability; CFPB BNPL interpretive rule (unverified lead); investigation process and timelines.
6. **Merchant-conduct disputes** — defective goods/non-delivery are not authorization errors; chargeback-style process; UDAP exposure in how the process is described.
7. **Card-network and bank-partner requirements** — chargeback timelines, refund pass-through, partner-of-record duties.
8. **Merchant contract obligations** — refund notification SLAs, data format, liability for duplicates, escalation duties.
9. **State-law overlay** — servicing, dispute, and notice rules in the seven live states (unverified lead; state-by-state verification needed).

## V. Decision Points for Counsel

| # | Decision | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Dispute standard | (A) Card-equivalent rights across all products vs. (B) tiered: full rights for unauthorized transactions only | Path A — single experience, highest compliance margin |
| 2 | Payment during dispute | Pause disputed amount vs. continue with disclosure | Pause disputed amount for unauthorized transactions; continue with clear disclosure for merchant-conduct disputes |
| 3 | Refund allocation rule | Last-payment-first vs. pro rata vs. next-payment-first | Last-payment-first, documented in customer agreement |
| 4 | Non-itemized partial refunds | Merchant-provided allocation vs. default rule | Default rule with merchant contract push for item-level data |
| 5 | Notice channel | In-app only vs. in-app + backup | In-app with backup channel per product terms/law |
| 6 | Merchant contract terms | Current terms vs. amended SLAs | Amend merchant agreements: refund notification SLA, data format, duplicate-refund liability |

## VI. Operational Timeline (generated analysis — subject to verification)

| Step | Trigger | Action | Owner | Target |
|------|---------|--------|-------|--------|
| 1 | Merchant issues refund | Receive refund data; dedupe via idempotent identifier | Northstar Pay ops/system | Real time |
| 2 | Refund received | Apply to outstanding balance per allocation rule | System | Same business day |
| 3 | Balance adjusted | Recalculate future payments; generate adjusted schedule | System | Same business day |
| 4 | Schedule adjusted | Notify customer in-app of refund and new schedule | System | Within 1 business day |
| 5 | Customer reports dispute | Acknowledge receipt; open case | Support | Within 5 days (recommended) |
| 6 | Unauthorized-transaction dispute | Investigate; provisionally credit disputed amount; pause collection on disputed amount | Dispute team | Investigation complete within 2 cycles/90 days (recommended) |
| 7 | Merchant-conduct dispute | Route to merchant/network chargeback; disclose continued payment obligation | Dispute team | Per network rules (unverified lead) |
| 8 | Dispute resolved | Notify customer of outcome and any schedule change | Dispute team | Within 5 days of resolution (recommended) |
| 9 | Missing item-level data | Apply default allocation; flag merchant for escalation | Ops | Per SLA (to be defined) |

## VII. Missing Facts / Open Questions

1. Which entity is creditor/servicer of record for each product and state?
2. Are any products open-end or credit-card-like (triggering §1026.13 directly)?
3. What do card-network and bank-partner agreements require for dispute handling and refund pass-through?
4. What do current merchant contracts say about refund timing and data format?
5. Current status of the CFPB BNPL interpretive rule (litigation/revision since 2024)?
6. State servicing/dispute requirements for CA, CO, GA, IL, NY, TX, WA?

## VIII. Provenance

- **Verified sources:** None — external search not enabled for the research run.
- **Supplied sources:** Product request; matter conversation record; company profile.
- **Unverified leads:** CFPB BNPL interpretive rule status; state servicing rules for live states; card-network dispute rules.
- **Assumptions:** Creditor/servicer structure; product/state scope; idempotent refund identifier; in-app notice channel.
- **Generated analysis:** Issue map, decision points, operational timeline, and recommendations above.

## IX. Next Steps

1. Counsel verifies unverified leads (last-mile review).
2. Confirm missing facts with Product and lending partners.
3. Draft full memo in Generate stage.
4. No decision recorded — decision points await counsel review.
