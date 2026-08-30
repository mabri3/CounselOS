---
{}
---
# Recommendations — Credit Reporting Pilot Launch-Readiness (Draft)

*Privileged & confidential attorney work product. First-pass analysis; citations to Reg V and CFPB guidance should be verified against current CFR/CFPB publications before external use.*

## Bottom line

A next-quarter pilot is achievable **only on a narrow, verified-data basis** (Path A). Report only accounts with complete, verified history; exclude accounts with known data gaps or open disputes; have the full dispute workflow and suppression logic live before the first furnishing. Full-population reporting relying on post-hoc corrections is not recommended given the known data-quality issues.

## Recommended path (Path A — narrow pilot)

1. **Scope.** Longer-term installment loans only (defer pay-in-4; separate analysis on whether it is reportable "credit"). Accounts with complete, verified historical data; exclude accounts with data gaps or open disputes.
2. **Furnisher of record.** Confirm with lending partners and the vendor contract who furnishes per product/state. If a partner is the furnisher, Northstar's role shifts to contract oversight — flag this before launch.
3. **Fields and timing.** Metro 2 via vendor; monthly cycle; normalize payment dates to contractual due date and actual receipt date (not processing date) to handle holidays, failed transfers, refunds, and plan changes.
4. **Notices.** Onboarding disclosure that payment data may be reported (supports awareness; not an FCRA substitute). Send the FCRA §1681s-2(a)(7) negative-information notice at least 30 days before first furnishing negative information. Verify state-specific notice rules for pilot states.
5. **Accuracy controls.** Pre-furnishing review of account records before any negative data (Reg V §1022.42(b)); documented data-quality gate; do not furnish information known or reasonably believed inaccurate.
6. **Dispute handling.** In-app/support disputes are direct disputes under Reg V §1022.43: reasonable investigation within 30 days, results to the consumer within 30 days, corrections notified to each CRA furnished. Frivolous/irrelevant rejections require reasonable basis and 5-business-day notice. If disputes also arrive via CRA (e-OSCAR/ACDV), cover that channel and its cycle.
7. **Suppression.** Suppress or flag disputed tradelines pending investigation; do not furnish new negative data on accounts with open disputes (accuracy duty + CFPB Circular 2022-07 / Bulletin 2013-07 risk).
8. **Vendor contract.** Accuracy obligations, Metro 2 compliance, dispute-transmission SLAs, audit rights, breach/incident notification, data security, retention, indemnification. Northstar remains liable for vendor-caused errors.
9. **Retention.** Documented schedule for dispute files, investigation records, and furnishing logs (align to limitations periods and vendor contract); no indefinite default.
10. **Go/no-go for next quarter.** Gate launch on: furnisher-of-record confirmation, exclusion list built, negative-information notice flow live, dispute workflow tested end-to-end, suppression logic tested, vendor contract executed.

## Separation of confirmed / assumed / missing

- **Confirmed (subject to citation verification):** FCRA §1681s-2 accuracy, correction, and dispute duties; Reg V §§1022.41–.43 dispute timelines; Metro 2 as industry standard; furnisher liability for vendor error.
- **Assumptions:** Northstar Pay is the furnisher of record; vendor is a service provider under contract; pilot is longer-term installments only.
- **Missing facts:** partner map per product/state; extent of incomplete historical data; which CRAs; whether disputes will arrive via e-OSCAR; current retention capabilities.
- **Unverified leads:** state-specific negative-information notice rules (e.g., Cal. Civ. Code §1785.26); exact CFPB bulletin/circular citations.

*This is a recommendation, not a recorded decision. A durable decision should be recorded only on explicit instruction.*
