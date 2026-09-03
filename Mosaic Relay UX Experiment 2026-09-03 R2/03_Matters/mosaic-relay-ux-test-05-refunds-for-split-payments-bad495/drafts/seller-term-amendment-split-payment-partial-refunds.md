---
{}
---
# Seller Term Amendment — Split-Payment Partial Refunds

**Matter:** Mosaic Relay UX Test — 05 — Refunds for Split Payments
**Status:** Working draft for review
**Prepared by:** Legal (Themis.ai)
**Date:** 2026-09-03
**Scope:** United States only

> **Drafting note.** This amendment is a standalone, editable starting point. It is a **working draft, not a recorded decision** and not legal advice. Bracketed items `[ ]` are open points requiring a decision or verification before the amendment is effective. Assumptions and open points are labeled inline and summarized at the end.

---

## 1. Definitions

In this amendment, the following terms have the meanings set out below. Capitalized terms not defined here have the meanings given in the Seller Agreement.

- **"Seller Agreement"** means the agreement between the marketplace operator and the Seller governing the Seller's participation in the marketplace, as amended by this document.
- **"Order"** means a single purchase transaction by a Buyer that may be funded by one or more payment methods and allocated across one or more Sellers.
- **"Line Item"** means a discrete item or service within an Order attributable to a specific Seller.
- **"Split Tender"** means an Order funded by more than one payment method.
- **"Original Tender"** means the specific payment method (card or ACH) used by the Buyer to fund the portion of the Order being refunded.
- **"Allocation Snapshot"** means the versioned, immutable record of how an Order's funds were allocated across Sellers and payment methods at the time of capture, as recorded in the Order Ledger.
- **"Order Ledger"** means the append-only ledger that records Order, refund, and dispute events against versioned Allocation Snapshots.
- **"Platform Fee"** means the fee charged to the Seller in connection with the Order.
- **"Refund"** means a partial or full return of funds to the Buyer for a Line Item or portion of an Order.
- **"Payout Hold"** means the withholding of otherwise-due payouts to the Seller to recover a negative Seller balance.
- **"Dispute"** means a chargeback, reversal, or other contested-transaction claim initiated by or on behalf of the Buyer.

---

## 2. Seller Authorization for Line-Item Refunds and Prorated Fee Reversal

2.1 **Authorization.** The Seller authorizes the marketplace operator to issue Refunds for Line Items attributable to the Seller, in whole or in part, in accordance with this amendment and the marketplace's published refund policy.

2.2 **Line-Item Scope.** A Refund may be issued only for selected Line Items and may never exceed the remaining refundable amount for those Line Items as reflected in the applicable Allocation Snapshot.

2.3 **Prorated Fee Reversal.** On a partial Refund, the Platform Fee is reversed on a prorated basis in proportion to the refunded amount. The party that absorbs or is credited the reversed fee is: `[OPEN POINT — see Section 9: buyer credit vs. platform absorption vs. seller absorption]`.

2.4 **No Refund of Fees Not Earned.** The Seller is not entitled to retain a Platform Fee on any portion of an Order that is refunded, except as expressly provided in the approved fee-reversal rule.

---

## 3. Original-Tender Allocation

3.1 **Allocation Back to Original Tender.** Each Refund must be allocated back to the Original Tender used to fund the portion of the Order being refunded, as recorded in the applicable Allocation Snapshot.

3.2 **Split-Tender Orders.** Where an Order was funded by Split Tender, the Refund is applied proportionally across the Original Tenders in accordance with the Allocation Snapshot, unless the marketplace operator determines otherwise under an approved exception (see Section 8).

3.3 **Source of Truth.** The Allocation Snapshot at capture is the sole source of truth for how a Refund is allocated across Sellers and payment methods. No Refund or Dispute may be based on any record other than the applicable Allocation Snapshot.

---

## 4. Card/ACH Timing and Notice

4.1 **Issuance vs. Posting.** The marketplace operator's obligation is to **issue** a Refund within the applicable window. The time for the Buyer's bank or card network to **post** the Refund to the Buyer's account is outside the marketplace operator's control.

4.2 **Timing Language.** The marketplace operator will issue Refunds within the applicable card-network or ACH window. The specific issuance window is: `[OPEN POINT — to be validated against card-network and NACHA rules; do not promise a single uniform window until verified]`.

4.3 **Notice to Seller.** The Seller will receive notice of each Refund affecting its Line Items, including the refunded amount, the fee treatment, the expected timing, any resulting negative balance, and the effect on any Dispute.

---

## 5. Negative-Balance Recovery and Payout Holds

5.1 **Negative Balance.** A Refund may cause the Seller's balance to become negative where the refunded amount exceeds the Seller's available funds.

5.2 **Payout Hold.** Where a Seller balance is negative, the marketplace operator may hold future payouts otherwise due to the Seller until the negative balance is recovered.

5.3 **Notice and Recovery.** The Seller will be notified of any negative balance and Payout Hold, the amount to be recovered, and the recovery mechanism. Recovery will occur against future payouts in accordance with the marketplace's published recovery rule.

5.4 **Write-Off.** Any write-off of an unrecoverable negative balance requires approval as set out in the marketplace's exception policy. `[OPEN POINT — define the write-off threshold and approval authority]`.

5.5 **Contractual Right.** The Seller agrees that the marketplace operator may apply Payout Holds and recover negative balances as described in this Section 5.

---

## 6. Chargeback/Refund Coordination

6.1 **Shared Snapshot.** Refunds and Disputes both reference the same Allocation Snapshot for the affected Order.

6.2 **Refund Reduces Dispute.** A Refund reduces or closes the amount of an open Dispute, as applicable.

6.3 **No Double Recovery.** The Seller will not receive payment for any amount that has been both refunded and disputed. The aggregate of refunded and disputed amounts for an Order may never exceed the funded amount (the "double-recovery invariant").

6.4 **Dispute Adjustments.** Any adjustment to a Dispute may be made only through an approved reconciliation record referencing the Allocation Snapshot. No support edit may overwrite the original allocation.

---

## 7. Immutable Ledger and Audit Records

7.1 **Append-Only Ledger.** All Order, Refund, and Dispute events are recorded in the Order Ledger as append-only events referencing versioned Allocation Snapshots.

7.2 **Audit Trail.** Each event records the actor, timestamp, amount, Line Item, Original Tender, and any approval reference.

7.3 **Records Retention.** Order Ledger records are retained for the period required by applicable law and the marketplace's records policy. `[OPEN POINT — confirm retention period with Tax/Finance and Legal]`.

---

## 8. Support Overrides with Named Approval

8.1 **Override Allowed Only with Approval.** A customer-support or operations override of a calculated allocation is permitted only with the prior approval of a named approver (e.g., a manager or Legal).

8.2 **Override Record.** Each override must be recorded as an append-only event in the Order Ledger, including the reason, the evidence relied upon, and the identity of the approving party.

8.3 **No Overwrite.** An override may not overwrite or mutate the original Allocation Snapshot; it appends a new auditable event.

---

## 9. Tax and Records

9.1 **Tax Treatment.** The tax treatment of Refunds, fee reversals, and negative-balance recovery is `[OPEN POINT — to be confirmed by tax counsel before launch]`.

9.2 **Records.** The Order Ledger serves as the record of Refunds, fee reversals, and Disputes for tax, accounting, and dispute-resolution purposes.

---

## 10. Effective Date and Seller Notice/Consent

10.1 **Effective Date.** This amendment is effective on `[EFFECTIVE DATE]`.

10.2 **Notice/Consent Fork.** This amendment becomes effective upon either:
- **(a) Unilateral amendment** — the marketplace operator provides notice to the Seller of the amendment in accordance with the Seller Agreement's amendment provisions; or
- **(b) Seller consent** — the Seller affirmatively consents to this amendment.

The applicable path is: `[OPEN POINT — determine whether the Seller Agreement permits unilateral amendment or requires Seller consent; this affects the rollout path and timing against the one-quarter release]`.

---

## Assumptions and Open Points

### Assumptions
- **A1.** The marketplace operator, not Mosaic Relay, holds the direct buyer/seller relationship and owns refund decisions. If Mosaic Relay issues refunds directly, the disclosure and consumer-protection obligations shift.
- **A2.** Mosaic Relay is a technology/payments-infrastructure provider, not a bank, and does not hold deposits; funds flow through regulated partners. If funds flow through Mosaic Relay's own accounts, money-transmission characterization and the negative-balance design change.
- **A3.** The prorated fee-reversal formula and the double-recovery invariant are as described in the recorded facts and analysis.

### Open Points (must be resolved before the amendment is effective)
- **O1. Fee-reversal absorption** (Section 2.3): who absorbs or is credited the prorated reversed fee — buyer, platform, or seller?
- **O2. Timing language** (Section 4.2): the exact card-network and ACH issuance windows, validated against network and NACHA rules.
- **O3. Write-off threshold and authority** (Section 5.4).
- **O4. Records retention period** (Section 7.3).
- **O5. Tax treatment** (Section 9.1), to be confirmed by tax counsel.
- **O6. Notice/consent path** (Section 10.2): unilateral amendment vs. Seller consent, and the resulting rollout timing.
