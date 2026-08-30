---
{}
---
# Minimum Pilot Process and Legal Work Product — Credit-Reporting Pilot (Draft)

*Privileged & confidential attorney work product. First-pass analysis; all statutory, regulatory, CFPB, CRA, and state-law citations are unverified leads requiring confirmation against current sources before external use.*

## 1. Confirmed requirements (subject to citation verification)

The framework for the pilot rests on the FCRA's furnisher duties and their implementing regulation (Regulation V), which the first-pass research identified as covering: the duty to furnish accurate information and to establish reasonable procedures for accuracy; the duty to correct and update information previously furnished; the duty to respond to direct disputes from consumers with a reasonable investigation, results within the statutory window, and notification of corrections to each consumer reporting agency (CRA) previously furnished; and the negative-information notice requirement before first furnishing delinquency or other negative information. Industry practice is Metro 2 format furnished on a monthly cycle through a reporting vendor. The furnisher remains responsible for vendor-caused errors; delegation of transmission does not delegate legal duty. These are treated as confirmed for planning purposes only — each citation (FCRA §1681s-2; Reg V §§1022.41–.43; 12 C.F.R. Part 1022) must be verified against the current CFR before the memo is finalized.

## 2. Assumptions

- Northstar Pay is the furnisher of record for the pilot population. **This assumption matters most:** if a bank or lending partner is the furnisher for a product/state, Northstar's role shifts from direct furnisher to contract oversight and the entire control set changes. Confirm against the partner map and vendor contract.
- The reporting vendor acts as a service provider/intermediary under contract, not as a reseller or consumer reporting agency.
- The pilot covers longer-term installment loans only; pay-in-4 is deferred pending a separate analysis of whether it constitutes reportable "credit."
- Disputes will arrive both directly (in-app/customer support) and potentially via CRA e-OSCAR/ACDV channels.

## 3. Missing facts

- Partner map: which entity furnishes per product and state.
- Extent and distribution of incomplete historical data (how many accounts, which fields).
- Which CRAs will be furnished to (one vs. all three bureaus).
- Whether the vendor contract is executed and its current terms.
- Current retention capabilities and dispute-tracking tooling.
- Pilot state list and any state-specific notice or reporting rules.

## 4. Unverified research leads (flag for verification)

- Exact Reg V section numbering and current text (12 C.F.R. Part 1022, Subpart E).
- CFPB Circular 2022-07 and Bulletin 2013-07 (furnishing disputed-but-unverified negative data) — confirm current status and citation.
- State-specific negative-information notice rules, e.g., Cal. Civ. Code §1785.26 — verify for each pilot state.
- CRA-specific Metro 2 reporting guides and e-OSCAR/ACDV response timelines — confirm with each CRA and the vendor.
- Whether pay-in-4 obligations are reportable "credit" under FCRA/Reg V — separate analysis needed.

## 5. Product and customer eligibility

Limit the pilot to longer-term installment loans in approved states. Eligibility gate: account has complete, verified historical data across all fields to be furnished (open date, balance, scheduled payments, actual payment history, status); no open dispute; no known data-quality flag; customer onboarded after the new disclosure flow is live. Build an automated exclusion list before first furnishing and re-run it each cycle. Accounts with incomplete history are excluded, not back-filled with estimated data — furnishing estimated or reconstructed payment history is an accuracy risk, not a gap-filler.

## 6. Furnisher-of-record and vendor responsibilities

Before launch, obtain written confirmation from each lending partner and the vendor contract of who furnishes per product/state. If Northstar furnishes: Northstar owns accuracy procedures, dispute investigation, correction, and CRA notification. If a partner furnishes: Northstar's obligations shift to contract oversight — the partner agreement must impose equivalent accuracy, dispute, notice, and audit duties, with breach notice and audit rights. Vendor contract must include: Metro 2 compliance, accuracy obligations, dispute-transmission SLAs (both directions), audit rights, breach/incident notification, data security, retention, indemnification, and clear allocation that Northstar remains liable to regulators and consumers for vendor error. Servicing agents handling disputes need training, scripts, and a documented escalation path to the legal/compliance owner.

## 7. Field-level accuracy and payment-date normalization

Furnish only fields with verified source data. Normalize payment dates to two distinct, correct values: the contractual due date and the actual date of receipt (not the processing or settlement date). Specific rules to implement:

- **Bank holidays:** payment received on a non-business day is treated as received the next business day only if the contract so provides; otherwise use actual receipt date. Do not report a delinquency where the due date fell on a non-business day and payment arrived the next business day.
- **Failed transfers:** a payment attempt initiated on time but failing for bank-side reasons should not be reported as delinquent until the failure is confirmed and the customer has a reasonable cure window; document the rule.
- **Refunds:** a refunded or reversed payment must be re-reported as never late — correction to each CRA previously furnished.
- **Plan changes:** when a payment plan is modified, restate the schedule prospectively; do not report the customer delinquent against the superseded schedule.
- **Pre-furnishing review:** before any negative tradeline is furnished, run a documented review of the account record against the accuracy procedures; suppress if any field is unverified.

## 8. Onboarding and negative-information notices

The onboarding disclosure ("payment data may be reported") supports customer awareness but is not a substitute for the FCRA negative-information notice. Implement the statutory negative-information notice (late payments, missed payments, or other defaults may be reported) at least 30 days before the first furnishing of negative information — deliver it at onboarding or via a separate flow, and log delivery. Verify state-specific notice requirements for each pilot state before launch. Retain evidence of notice delivery per account.

## 9. Direct disputes and CRA/e-OSCAR intake

Treat in-app and customer-support disputes as direct disputes under Reg V: acknowledge, investigate within the statutory window (30 days absent extension), report results to the consumer, and notify each CRA previously furnished of any correction. If disputes also arrive via CRA e-OSCAR/ACDV, that channel needs a named owner, its own SLA tracking, and integration with the same investigation workflow so both channels converge on one case record. Frivolous or irrelevant rejections require a reasonable basis and notice to the consumer within 5 business days — route any such determination through legal review before sending.

## 10. Reasonable investigation, correction, suppression, and escalation

Investigation must be reasonable in the circumstances: review account records, payment history, and any customer-provided documentation; contact the servicing vendor or partner where the record is unclear. On finding an error: correct the record, notify each CRA previously furnished, and notify the consumer of the result. **Suppression rule:** while a dispute or billing issue is unresolved, suppress or flag the disputed tradeline and do not furnish new negative data on that account — this is the accuracy-duty-driven position supported by CFPB guidance (Circular 2022-07 / Bulletin 2013-07, both unverified leads). Escalation: any dispute involving potential systemic error, regulator or CRA complaint, or litigation hold routes immediately to the legal owner (Brian Harris / Alex Morgan per matter ownership).

## 11. Retention and audit trails

Documented retention schedule (not indefinite default) for: dispute files and investigation records; furnishing logs (what was furnished, to which CRA, when); correction and suppression logs; notice-delivery evidence; vendor communications; and accuracy-procedure documentation. Align retention periods to limitations periods, the vendor contract, credit-reporting dispute needs, and litigation holds. Account closure triggers a retention review. Maintain audit trails linking each furnished tradeline to its source record and each dispute outcome to its investigation file.

## 12. Launch gates (go/no-go)

1. Written furnisher-of-record confirmation per product/state.
2. Exclusion list built and tested against the eligible population.
3. Payment-date normalization rules implemented and tested (holidays, failed transfers, refunds, plan changes).
4. Negative-information notice flow live with delivery logging.
5. Dispute workflow tested end-to-end, including e-OSCAR channel if applicable.
6. Suppression logic tested.
7. Vendor contract executed with required terms.
8. Retention schedule documented and implemented.
9. Servicing-agent training completed.
10. Legal sign-off on the pilot scope memo.

## 13. Owners

- Legal owner: Brian Harris (matter owner); Alex Morgan for material judgment calls and any partner-map changes.
- Product owner: to be assigned (business owner not yet named).
- Operations: servicing/dispute team lead — to be assigned.
- Vendor management: to be assigned.
- Data/engineering: exclusion list and normalization rules — to be assigned.

## 14. Evidence to retain

Notice-delivery logs per account; exclusion-list snapshots per cycle; pre-furnishing review records for negative tradelines; dispute case files with investigation notes and outcome; correction notifications to CRAs; suppression logs; vendor contract and SLA reports; training records; accuracy-procedures documentation; furnishing logs per CRA per cycle.

## 15. 30/60/90-day implementation sequence

**Days 1–30:** Confirm furnisher of record with partners and vendor contract; finalize pilot state and product scope; build exclusion-list criteria; draft negative-information notice and state-law verification; draft vendor contract terms; assign owners.

**Days 31–60:** Implement payment-date normalization rules and pre-furnishing review gate; build dispute workflow (direct + e-OSCAR) with suppression logic; implement notice delivery with logging; document retention schedule; begin servicing-agent training.

**Days 61–90:** End-to-end testing of furnishing, dispute, correction, and suppression flows; dry-run furnishing cycle with the vendor; legal review of test results; go/no-go decision against the launch gates; if go, first live furnishing with monitored first cycle and a post-cycle accuracy audit.

*This is a recommendation, not a recorded decision. A durable decision should be recorded only on explicit instruction.*
