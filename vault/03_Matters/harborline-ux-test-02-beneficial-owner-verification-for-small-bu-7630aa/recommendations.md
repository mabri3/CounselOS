---
matter_id: MAT-20260830-7630aa
record_type: recommendations
---
# Recommendation — Staged Activation for Small-Business Accounts (First Pass)

## Bottom line
Product's proposed flow (fund + credentials after control-person verification, with a beneficial owner still pending) is **not acceptable as proposed**. The defensible version is **restricted activation**: after the control person is verified and the applicant signs the ownership certification, the account may **receive incoming funds only**; outbound payments and payment credentials are gated until all ≥25% beneficial owners complete verification, or the partner bank approves a documented exception. Escalate the exception-handling question to the partner bank in writing now — it gates any more aggressive staging.

## Why
- **CDD rule (31 CFR 101.230).** The bank must identify and verify each ≥25% beneficial owner and one control person "in connection with the opening of a new account." The rule has no express provision allowing an account to transact with a pending owner verification; whether to permit it is a **partner-bank CDD program decision**, not something Harborline can set unilaterally.
- **Certification.** The individual opening the account on behalf of the entity (the applicant/authorized representative) completes the Appendix A-style certification — owners do not certify; they are the subjects of verification. The bank verifies each named individual's identity but does not verify ownership percentages (that is the certifier's responsibility).
- **CTA/BOI does not help.** FinCEN's 2025 interim final rule removed BOI reporting for U.S. domestic entities, and banks never got registry access for CDD. The bank must still collect and verify ownership directly. Monitor FinCEN's pending CDD-rule revisions, but nothing final changes the Q1 analysis.

## Recommended design (Path A)
1. Control person verified + signed certification → account opens in **incoming-only** state (deposits can land immediately — preserves most of the speed benefit).
2. Outbound payments and credential issuance gated on completion of all beneficial-owner verifications.
3. **Hard 30-day clock** with automatic escalation to restriction/closure if an owner remains unverified.
4. Any deviation (Path B: full activation with a pending owner) only under the partner bank's written exception procedure with risk caps (single pending owner, transaction limits, low-risk entity) and documented bank approval — currently unconfirmed.

## Entity-type treatment (release 1)
- **In scope:** single-member LLCs, small corporations (U.S.-formed, ≤5 owners).
- **Simplified flow:** sole proprietors and nonprofits (not "legal entity customers" — no BO certification; control-person/CIP only).
- **Exclude or manual review:** trusts, layered ownership (direct-owner entry can't capture look-through), non-U.S.-resident owners (sanctions/W-8/EDD issues).

## Evidence to retain (5 years post-closure)
Signed certification; identity-verification results per owner with method and outcome; timestamps; invitation/reminder logs; exception approvals. Confirm with the bank which records Harborline holds under the BaaS arrangement.

## Refresh
No fixed statutory interval — risk-based, per the bank's program (commonly 1–3 years by risk tier) plus trigger events (reported ownership change, suspicious activity, transaction anomalies). Build an in-product ownership-change attestation and event-driven refresh.

## Owner non-cooperation / disputes / screening failures after funding
- **Ignores invitation:** reminders, then the 30-day clock → restrict outbound → close/return funds per the bank's procedures.
- **Disputes submitted information:** freeze changes, re-certification required, manual review; do not rely on the disputed data.
- **Fails screening after funds received:** restrict outbound immediately, escalate to the bank, consider SAR filing implications and confidential handling; do not disclose screening reasons to the customer.

## Open items gating the final answer
- Partner bank's written position on exception handling without manual approval.
- Whether product accepts incoming-only staging as sufficient speed.
- Identity vendor output sufficiency for the bank's verification records.
- Confirm current CTA/BOI and CDD-rule status as of the advice date (this area moved repeatedly in 2024–2025).

*First-pass analysis; verify citations (31 CFR 101.230, FinCEN CDD FAQs, FinCEN 2025 BOI interim final rule) before final advice.*
