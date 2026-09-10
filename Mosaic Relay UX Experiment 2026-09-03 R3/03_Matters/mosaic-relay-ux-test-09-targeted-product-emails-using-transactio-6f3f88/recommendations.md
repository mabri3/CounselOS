---
matter_id: MAT-20260904-6f3f88
record_type: recommendations
current_recommendation_version_id: REC-20260904-2a75df
recommendation_versions:
- version_id: REC-20260904-2a75df
  number: 1
  content: '# Working Recommendation — Targeted Product Emails Using Transaction and
    Identity Data


    **Matter:** Privacy review of Mosaic Relay''s plan to send targeted product emails
    to merchants and platform administrators using service data (transaction volume,
    dispute rates, payout behavior, onboarding status, and fraud-risk indicators).

    **Status:** Working recommendation for review. This is a recommendation only —
    it does not record a decision. The decision that requires explicit approval is
    identified at the end.


    ---


    ## 1. Recommendation in brief


    Mosaic Relay **may proceed** with targeted product emails to business contacts,
    but only after building the required suppression, preference, and transparency
    controls, and only on a **legitimate-interest basis** for corporate subscribers,
    with **consent or soft opt-in** required for any sole traders. Do **not** launch
    until the jurisdiction mix is confirmed and the targeting model is audited for
    special-category data.


    ## 2. Recommended approach (Path A, with Path B fallback and Path C as target
    state)


    **Path A — Legitimate interest + corporate-subscriber exemption (primary path).**

    - Rely on GDPR/UK GDPR Art. 6(1)(f) legitimate interest for the data processing,
    documented in a legitimate interest assessment (LIA).

    - Rely on PECR''s corporate-subscriber exemption for sending to incorporated businesses
    (no prior consent needed).

    - Restrict the campaign to **corporate email addresses only** until recipient
    status is confirmed.

    - Build opt-out and suppression controls before launch.

    - Disclose the marketing use in Mosaic''s privacy notice.


    **Path B — Soft opt-in (fallback for sole traders).**

    - For any sole traders or unincorporated partnerships, rely on PECR soft opt-in
    only if an opt-out was offered at collection and in every message. Intake indicates
    no opt-out was offered at collection, so soft opt-in is likely **unavailable**
    — those recipients should be excluded or moved to Path C.


    **Path C — Consent (target state).**

    - Obtain explicit opt-in consent via a preference center or account settings for
    recipients who cannot be covered by Path A or B. Consent must be as easy to withdraw
    as to give.


    ## 3. Required controls (all paths — blocking before launch)


    - **Working unsubscribe mechanism** in every marketing email (CAN-SPAM, PECR,
    GDPR Art. 21).

    - **Suppression list** maintained so opted-out individuals are not re-contacted;
    honor opt-outs promptly (CAN-SPAM within 10 business days).

    - **Preference center** allowing topic/frequency choice.

    - **Identification** of Mosaic Relay as sender in every message.

    - **Event-triggered emails** subject to the same marketing controls if classified
    as marketing.

    - **Privacy-notice disclosure** of the marketing use and lawful basis.


    ## 4. Pre-launch blocking items


    - **Confirm recipient jurisdiction mix** (US / UK / EU / global). This determines
    which regime''s rules are strictest and whether consent is required.

    - **Audit the targeting model inputs** to confirm whether fraud-risk scores or
    any input fields constitute or proxy special-category data under GDPR Art. 9.
    If they do, legitimate interest alone cannot support the marketing use.

    - **Review customer contracts and platform terms** for restrictions on secondary
    use of merchant/admin data for Mosaic''s own marketing. If restricted, obtain
    a contract amendment or the platform''s agreement before proceeding.

    - **Segment the recipient list** by subscriber type (corporate vs. individual/sole
    trader) and by jurisdiction. Exclude or separately handle non-corporate recipients
    until their status is confirmed.

    - **Document a legitimate interest assessment (LIA)** if relying on Art. 6(1)(f).

    - **Define retention periods** for targeting-segment data and suppression-list
    entries.


    ## 5. Retention and data governance


    - Define retention for targeting-segment data (refresh/purge cadence) and suppression-list
    entries (indefinite or until re-consent).

    - Define retention for engagement data (opens, clicks) used in marketing analytics.

    - Data-minimization review of the fields used in the targeting model.


    ## 6. Ongoing obligations


    - Honor Art. 21(2) objections absolutely — no balancing test once a recipient
    objects to direct marketing.

    - Apply the primary-purpose test honestly to message classification; do not relabel
    marketing as transactional.

    - Reassess when jurisdiction, contract terms, or model inputs change.


    ---


    ## 7. Decision requiring explicit approval


    The following decision requires your explicit approval before Mosaic Relay proceeds:


    **Approve the recommended approach: proceed with targeted product emails to corporate
    business contacts on a legitimate-interest basis (Path A), with consent or soft
    opt-in required for any sole traders (Path B/C), contingent on (a) confirming
    the recipient jurisdiction mix, (b) auditing the targeting model for special-category
    data, and (c) reviewing customer contracts for secondary-use restrictions — and
    with suppression, preference, transparency, and retention controls built before
    launch.**


    This is a recommendation. It does not record a decision. If you approve, I can
    record it as a durable decision and move the matter toward a final response.'
  actor: Themis.ai
  origin: initial_agent
  created_at: '2026-09-04T01:02:00+00:00'
recommendation_updated_at: '2026-09-04T01:02:00+00:00'
recommendation_updated_by: Themis.ai
proposed_recommendation: null
---
# Working Recommendation — Targeted Product Emails Using Transaction and Identity Data

**Matter:** Privacy review of Mosaic Relay's plan to send targeted product emails to merchants and platform administrators using service data (transaction volume, dispute rates, payout behavior, onboarding status, and fraud-risk indicators).
**Status:** Working recommendation for review. This is a recommendation only — it does not record a decision. The decision that requires explicit approval is identified at the end.

---

## 1. Recommendation in brief

Mosaic Relay **may proceed** with targeted product emails to business contacts, but only after building the required suppression, preference, and transparency controls, and only on a **legitimate-interest basis** for corporate subscribers, with **consent or soft opt-in** required for any sole traders. Do **not** launch until the jurisdiction mix is confirmed and the targeting model is audited for special-category data.

## 2. Recommended approach (Path A, with Path B fallback and Path C as target state)

**Path A — Legitimate interest + corporate-subscriber exemption (primary path).**
- Rely on GDPR/UK GDPR Art. 6(1)(f) legitimate interest for the data processing, documented in a legitimate interest assessment (LIA).
- Rely on PECR's corporate-subscriber exemption for sending to incorporated businesses (no prior consent needed).
- Restrict the campaign to **corporate email addresses only** until recipient status is confirmed.
- Build opt-out and suppression controls before launch.
- Disclose the marketing use in Mosaic's privacy notice.

**Path B — Soft opt-in (fallback for sole traders).**
- For any sole traders or unincorporated partnerships, rely on PECR soft opt-in only if an opt-out was offered at collection and in every message. Intake indicates no opt-out was offered at collection, so soft opt-in is likely **unavailable** — those recipients should be excluded or moved to Path C.

**Path C — Consent (target state).**
- Obtain explicit opt-in consent via a preference center or account settings for recipients who cannot be covered by Path A or B. Consent must be as easy to withdraw as to give.

## 3. Required controls (all paths — blocking before launch)

- **Working unsubscribe mechanism** in every marketing email (CAN-SPAM, PECR, GDPR Art. 21).
- **Suppression list** maintained so opted-out individuals are not re-contacted; honor opt-outs promptly (CAN-SPAM within 10 business days).
- **Preference center** allowing topic/frequency choice.
- **Identification** of Mosaic Relay as sender in every message.
- **Event-triggered emails** subject to the same marketing controls if classified as marketing.
- **Privacy-notice disclosure** of the marketing use and lawful basis.

## 4. Pre-launch blocking items

- **Confirm recipient jurisdiction mix** (US / UK / EU / global). This determines which regime's rules are strictest and whether consent is required.
- **Audit the targeting model inputs** to confirm whether fraud-risk scores or any input fields constitute or proxy special-category data under GDPR Art. 9. If they do, legitimate interest alone cannot support the marketing use.
- **Review customer contracts and platform terms** for restrictions on secondary use of merchant/admin data for Mosaic's own marketing. If restricted, obtain a contract amendment or the platform's agreement before proceeding.
- **Segment the recipient list** by subscriber type (corporate vs. individual/sole trader) and by jurisdiction. Exclude or separately handle non-corporate recipients until their status is confirmed.
- **Document a legitimate interest assessment (LIA)** if relying on Art. 6(1)(f).
- **Define retention periods** for targeting-segment data and suppression-list entries.

## 5. Retention and data governance

- Define retention for targeting-segment data (refresh/purge cadence) and suppression-list entries (indefinite or until re-consent).
- Define retention for engagement data (opens, clicks) used in marketing analytics.
- Data-minimization review of the fields used in the targeting model.

## 6. Ongoing obligations

- Honor Art. 21(2) objections absolutely — no balancing test once a recipient objects to direct marketing.
- Apply the primary-purpose test honestly to message classification; do not relabel marketing as transactional.
- Reassess when jurisdiction, contract terms, or model inputs change.

---

## 7. Decision requiring explicit approval

The following decision requires your explicit approval before Mosaic Relay proceeds:

**Approve the recommended approach: proceed with targeted product emails to corporate business contacts on a legitimate-interest basis (Path A), with consent or soft opt-in required for any sole traders (Path B/C), contingent on (a) confirming the recipient jurisdiction mix, (b) auditing the targeting model for special-category data, and (c) reviewing customer contracts for secondary-use restrictions — and with suppression, preference, transparency, and retention controls built before launch.**

This is a recommendation. It does not record a decision. If you approve, I can record it as a durable decision and move the matter toward a final response.
