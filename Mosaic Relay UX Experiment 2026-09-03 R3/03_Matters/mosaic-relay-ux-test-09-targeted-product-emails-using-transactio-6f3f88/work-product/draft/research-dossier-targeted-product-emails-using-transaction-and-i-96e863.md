---
work_product_id: WP-9ebdaa96e863
matter_id: MAT-20260904-6f3f88
title: Research Dossier — Targeted Product Emails Using Transaction and Identity Data
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-04T01:01:14+00:00'
updated_at: '2026-09-04T01:01:14+00:00'
immutable: false
source_action_key: chat:RUN-20260904-8477f3:tool:220bd1192342e225ae25041a
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Research Dossier — Targeted Product Emails Using Transaction and Identity
      Data


      **Matter:** Privacy review of Mosaic Relay''s plan to send targeted product
      emails to merchants and platform administrators using service data (transaction
      volume, dispute rates, payout behavior, onboarding status, and fraud-risk indicators).

      **Status:** First-pass research (in progress). This dossier reflects the completed
      GDPR/UK GDPR and PECR thread; US CAN-SPAM and special-category/Art. 22 threads
      are running in the background'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: .
    change_id: CHG-20260904-8be51e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T16:39:00+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Later results
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' will be '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: saved
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: as
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: separate
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: packets. This dossier will change only after the lawyer requests and accepts
      a tracked revision
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '.

      **Assumptions in effect (per intake):** Recipients are business contacts (merchants/platform
      admins), not consumers. Mosaic Relay is the data controller for its own marketing
      emails. Risk/fraud scores do not themselves constitute special-category data
      unless they reveal sensitive attributes. Recipient jurisdiction is undetermined
      (US/UK/EU possible). No opt-out or preference controls exist. No retention policy
      exists.


      ---


      ## 1. Decision question


      May Mosaic Relay use service data — including fraud-risk scores — to send targeted
      product emails to business contacts at merchants and platforms, and if so, under
      what legal basis (consent vs. legitimate interest), with what profiling, unsubscribe,
      suppression, and retention controls, given that recipients'' jurisdictions are
      undetermined and no opt-out mechanism currently exists?


      ## 2. The core tension


      The data was collected to **provide services** (payment acceptance, onboarding,
      identity verification, risk, operations). Reusing it to **select recipients
      for marketing emails** is a secondary purpose. That triggers purpose-limitation
      analysis, a legal-basis decision, and — because the targeting uses risk/fraud
      scores — profiling and sensitive-data scrutiny. The rules differ materially
      by jurisdiction, which is why jurisdiction is the single biggest open fork.


      ## 3. Confirmed facts (from intake)


      - Recipients are **business contacts only** (merchants/platform admins), not
      consumers.

      - Targeting uses **risk/fraud scores** derived from service data.

      - **No opt-out/unsubscribe or preference controls** exist today.

      - **No retention policy** for targeting data or suppression lists.

      - Messages would be sent **weekly**, plus **event-triggered** emails after a
      transaction or account review.

      - Customer contract terms, legal basis, and recipient jurisdiction: **undetermined**.


      ---


      ## 4. Legal analysis by thread


      ### 4.1 Purpose limitation (GDPR/UK GDPR Art. 6(4))


      Mosaic collected transaction, onboarding, identity, risk, and operations data
      to provide its payment services. Using that same data to select marketing recipients
      is a **secondary purpose**. Under Art. 6(4), Mosaic must assess whether the
      secondary use is **compatible** with the original collection purpose, considering:
      the link between the purposes, the context of collection, the nature of the
      data, possible consequences for data subjects, and the existence of safeguards.


      **Practical read:**

      - Recommending dispute tools to a merchant with rising chargebacks is closely
      related to the service Mosaic already provides — arguably within the merchant''s
      reasonable expectations.

      - Promoting faster onboarding to businesses that have not completed verification
      is also service-adjacent.

      - Using **fraud-risk scores** — which the merchant may not know exist — to target
      marketing is further from the original purpose and carries higher incompatibility
      risk.


      ### 4.2 Legal basis: consent vs. legitimate interest (GDPR/UK GDPR Art. 6)


      - **Legitimate interest (Art. 6(1)(f))** is the most realistic basis for B2B
      marketing to existing business contacts. Mosaic must document a **legitimate
      interest assessment (LIA)** balancing its commercial interest against recipients''
      rights. The ICO has acknowledged B2B marketing can rely on legitimate interest,
      particularly for corporate subscribers.

      - **Consent (Art. 6(1)(a))** is safer but operationally heavier. Consent must
      be freely given, specific, informed, and unambiguous — a pre-ticked box or a
      buried clause in platform terms will not suffice.


      ### 4.3 PECR rules on B2B marketing email (UK)


      PECR (Privacy and Electronic Communications Regulations 2003) governs unsolicited
      electronic marketing in the UK. The key distinction:

      - **Corporate subscribers** (limited companies, LLPs, government bodies): PECR
      does **not** require prior consent for marketing emails. Mosaic can send B2B
      marketing to corporate email addresses without opt-in consent, provided it identifies
      itself and provides a valid opt-out.

      - **Individual subscribers** (sole traders, some partnerships): PECR treats
      them like consumers. Prior consent is required unless the **soft opt-in** exception
      applies (email obtained during a sale or negotiation, marketing relates to similar
      products/services, and opt-out was offered at collection and in every message).


      **Practical read:** If all recipients are employees or administrators at incorporated
      businesses, the corporate-subscriber exemption applies and no prior consent
      is needed for the emails themselves. But if any recipients are sole traders
      — common among smaller merchants and marketplace sellers — Mosaic needs either
      consent or a valid soft opt-in for those individuals. Intake indicates no opt-out
      was offered at collection, which would make soft opt-in unavailable.


      ### 4.4 Profiling and automated-decision restrictions (GDPR/UK GDPR Arts. 4(4),
      21, 22)


      **Profiling** (Art. 4(4)) is automated processing to evaluate or predict aspects
      of an individual''s behavior, performance, or preferences. Using transaction
      volume, dispute rates, and fraud-risk scores to select email recipients **is
      profiling**.


      - **Art. 22** restricts solely automated decisions producing **legal or similarly
      significant effects**. Sending a marketing email is unlikely to be a "significant
      effect" on its own. But if the targeting model''s output also feeds account
      decisions (e.g., restricting payouts, flagging accounts), Art. 22 could be triggered
      by the broader processing chain.

      - **Art. 21(2)** gives data subjects an **absolute right to object** to processing
      for direct marketing, including profiling to the extent it relates to direct
      marketing. Once someone objects, Mosaic must stop — no balancing test applies.

      - **Art. 9 special-category data:** Fraud-risk scores are not inherently special-category,
      but if the scoring model uses or proxies health data, racial/ethnic origin,
      political opinions, or other Art. 9 categories, processing requires an Art.
      9 condition in addition to an Art. 6 basis. This is a material risk because
      fraud models can inadvertently proxy protected characteristics.


      ### 4.5 Message classification: transactional vs. marketing


      The distinction matters because **transactional/service messages** (e.g., "your
      payout has been processed") are generally exempt from marketing consent requirements,
      while **marketing messages** (e.g., "try our new dispute tool") are not.


      **Risk area:** The proposed emails sit in a gray zone. "We noticed your chargebacks
      are rising — here''s a tool that can help" is arguably both service-relevant
      and promotional. Regulators (ICO, FTC) look at the **primary purpose** of the
      message. If the primary purpose is to drive feature adoption (a commercial goal),
      the message is likely marketing, even if it references the recipient''s account
      activity.


      **Practical read:** Classify these as marketing messages and apply marketing
      rules (opt-out, identification, lawful basis). Trying to characterize them as
      transactional to avoid marketing obligations is a common enforcement trigger.


      ### 4.6 Controller vs. processor allocation


      Mosaic processes merchant and platform data to provide payment services — in
      that role it may act as a **processor** (or joint controller) for its platform
      customers. When Mosaic uses that same data for **its own marketing purposes**,
      it acts as a **controller** for that processing.


      **Key issue:** If Mosaic''s customer contracts restrict secondary use of platform
      data, or if the platform''s privacy notice does not disclose that Mosaic may
      contact merchants for marketing, Mosaic cannot rely on the platform''s consent
      or notice. Mosaic needs its own lawful basis and its own transparency (privacy-notice
      disclosure) for the marketing use.


      ### 4.7 Suppression, unsubscribe, and preference management


      No opt-out or preference controls currently exist. At minimum:

      - **Every marketing email must include a functioning unsubscribe mechanism**
      (CAN-SPAM, PECR, GDPR Art. 21).

      - **Suppression lists** must be maintained so opted-out individuals are not
      re-contacted. Suppression data must be retained as long as needed to honor the
      opt-out — which may be indefinite.

      - **Preference management** (topic or frequency choice) is a best practice that
      reduces full opt-outs and demonstrates accountability.

      - **Event-triggered emails** need the same controls as batch emails if they
      are marketing in nature.


      ### 4.8 Retention


      No retention policy exists. GDPR storage-limitation (Art. 5(1)(e)) requires
      personal data be kept no longer than necessary. Mosaic should define:

      - How long targeting-segment data is retained (e.g., segment membership refreshed
      monthly, old segments purged).

      - How long suppression-list entries are kept (indefinitely, or until the individual
      re-consents).

      - How long engagement data (opens, clicks) is retained for marketing analytics.


      ---


      ## 5. Viable paths


      ### Path A — Legitimate interest + corporate-subscriber exemption (fastest,
      moderate risk)

      Rely on Art. 6(1)(f) legitimate interest for the data processing and PECR''s
      corporate-subscriber exemption for sending. Document an LIA. Build opt-out and
      suppression controls before launch. Restrict targeting to corporate email addresses
      only. Disclose the marketing use in Mosaic''s privacy notice.

      - **Pros:** No consent flow needed; faster to launch; well-suited to B2B.

      - **Cons:** Requires confidence all recipients are corporate subscribers; legitimate
      interest must be documented and defensible; fraud-risk-score targeting is harder
      to justify under a balancing test; does not work for sole traders.


      ### Path B — Soft opt-in for existing customers (safer for mixed audiences)

      Rely on PECR''s soft opt-in for recipients whose email was obtained during a
      service relationship, provided marketing relates to similar services and opt-out
      was offered at collection and in every message. Combine with legitimate interest
      as the GDPR lawful basis.

      - **Pros:** Covers sole traders and individual subscribers; aligns with the
      existing customer relationship.

      - **Cons:** Only works if opt-out was offered at collection — intake suggests
      it was not, so soft opt-in may be unavailable; requires marketed products to
      be "similar" to what the customer already uses.


      ### Path C — Consent-based (highest compliance, slowest)

      Obtain explicit opt-in consent before sending any marketing emails, via a preference
      center, account settings, or a one-time re-permission campaign.

      - **Pros:** Strongest legal position; future-proof; works for all recipient
      types.

      - **Cons:** Lower reach; slower; consent must be as easy to withdraw as to give.


      ### Recommended approach

      **Path A for corporate subscribers, with Path B as a fallback for any sole traders,
      and Path C as the target state.** Build suppression and preference infrastructure
      now (required under all paths), document the LIA, update the privacy notice,
      and segment out any non-corporate recipients until their status is confirmed.


      ---


      ## 6. Practical control checklist


      ### Before launch (blocking)

      - [ ] **Confirm recipient jurisdiction mix** (US / UK / EU / global). This determines
      which regime''s rules are strictest and whether consent is required. *Highest-priority
      open item.*

      - [ ] **Audit the targeting model inputs** to confirm whether fraud-risk scores
      or any input fields constitute or proxy special-category data under GDPR Art.
      9. If they do, legitimate interest alone cannot support the marketing use.

      - [ ] **Review customer contracts and platform terms** for restrictions on secondary
      use of merchant/admin data for Mosaic''s own marketing. If restricted, obtain
      a contract amendment or the platform''s agreement before proceeding.

      - [ ] **Segment the recipient list** by subscriber type (corporate vs. individual/sole
      trader) and by jurisdiction. Exclude or separately handle non-corporate recipients
      until their status is confirmed.

      - [ ] **Document a legitimate interest assessment (LIA)** if relying on Art.
      6(1)(f), including the balancing test and safeguards.

      - [ ] **Update the privacy notice** to disclose the marketing use of service
      data and the lawful basis.


      ### Required controls (all paths)

      - [ ] **Working unsubscribe mechanism** in every marketing email (CAN-SPAM,
      PECR, GDPR Art. 21).

      - [ ] **Suppression list** maintained so opted-out individuals are not re-contacted;
      honor opt-outs promptly (CAN-SPAM requires within 10 business days).

      - [ ] **Preference center** allowing topic/frequency choice (best practice;
      reduces full opt-outs).

      - [ ] **Identification** of Mosaic Relay as sender in every message (CAN-SPAM
      requires accurate header and subject-line info).

      - [ ] **Event-triggered emails** subject to the same marketing controls if classified
      as marketing.


      ### Retention and data governance

      - [ ] **Define retention periods** for targeting-segment data (refresh/purge
      cadence) and suppression-list entries (indefinite or until re-consent).

      - [ ] **Define retention for engagement data** (opens, clicks) used in marketing
      analytics.

      - [ ] **Data-minimization review** of the fields used in the targeting model
      — use only what is necessary for the stated purpose.


      ### Ongoing

      - [ ] **Honor Art. 21(2) objections** absolutely — no balancing test once a
      recipient objects to direct marketing.

      - [ ] **Monitor message classification** — apply the primary-purpose test honestly;
      do not relabel marketing as transactional.

      - [ ] **Reassess** when jurisdiction, contract terms, or model inputs change.


      ---


      ## 7. Facts that would change the answer


      - **If any recipients are sole traders or unincorporated partnerships**, PECR''s
      corporate-subscriber exemption does not apply, and consent or soft opt-in is
      required for those individuals.

      - **If the fraud-risk scores proxy special-category data** (health, ethnicity,
      financial vulnerability), GDPR Art. 9 is triggered and the analysis changes
      materially — likely blocking fraud-score-based marketing targeting or requiring
      a different basis and safeguards.

      - **If Mosaic''s customer contracts prohibit using platform data for Mosaic''s
      own marketing**, Mosaic cannot proceed without a contract amendment or the platform''s
      agreement, regardless of what privacy law permits.

      - **If recipients are in the EU (not just the UK)**, ePrivacy Directive implementations
      vary — some member states (e.g., Germany) require opt-in consent even for B2B
      marketing email, pushing toward Path C.

      - **If the event-triggered emails are genuinely transactional**, they may be
      exempt from marketing rules — but this classification must be defensible and
      the primary-purpose test applied honestly.


      ---


      ## 8. Authorities referenced (to be verified)


      The completed GDPR/PECR thread is **model-only analysis** — no external statutory
      text or regulator guidance was retrieved in that run. The following authorities
      are referenced and must be verified against current text before reliance:

      - GDPR Art. 5(1)(e) (storage limitation)

      - GDPR Art. 6(1)(a) and (f) (consent; legitimate interest)

      - GDPR Art. 6(4) (compatibility of further processing)

      - GDPR Art. 9 (special categories)

      - GDPR Art. 21(2) (right to object to direct marketing)

      - GDPR Art. 22 (automated individual decision-making)

      - GDPR Art. 4(4) (profiling definition)

      - UK PECR 2003 (unsolicited electronic marketing; corporate vs. individual subscriber
      distinction; soft opt-in)

      - US CAN-SPAM Act (commercial email; opt-out; 10-business-day honor requirement)
      — *thread pending*

      - ICO direct-marketing and legitimate-interest guidance — *to be retrieved*


      **Verification note:** The US CAN-SPAM and special-category/Art. 22 research
      threads are running in the background'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: .
    change_id: CHG-20260904-2ee711
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T16:39:00+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Later results
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' will be '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: saved
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: as
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: separate packets. This
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' dossier '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: will
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: change only after the lawyer requests and accepts a tracked revision
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '. The GDPR/PECR analysis above should be checked against current statutory
      text and ICO guidance before it carries the final answer.


      ---


      ## 9. What would change this (ranked)


      - **Open fork — Jurisdiction determines the strictness of the rules.** UK-only
      → PECR corporate-subscriber exemption and relatively permissive ICO B2B guidance.
      EU → several member states (notably Germany) require opt-in consent even for
      B2B email, pushing the whole campaign to Path C. US-only → CAN-SPAM requires
      only opt-out (no prior consent), making the analysis much simpler. The answer
      changes materially depending on which regime governs.

      - **Not examined — Mosaic Relay''s customer contracts and platform terms.**
      The vault does not contain these documents. If they restrict secondary use of
      platform data for Mosaic''s own marketing, or if the platform''s privacy notice
      does not disclose this use, Mosaic may be contractually barred regardless of
      what privacy law permits. This is the single most likely source of an unwelcome
      surprise.

      - **Working assumption — All recipients are corporate subscribers.** The PECR
      B2B exemption and the legitimate-interest path depend on this. If even a small
      percentage are sole traders (common among marketplace sellers and smaller merchants),
      Mosaic needs consent or soft opt-in for those individuals — and soft opt-in
      is only available if an opt-out was offered at collection, which intake says
      it was not. This would push a segment into Path C or require excluding those
      recipients.

      - **Open fork — Whether fraud-risk scores proxy special-category data.** If
      the scoring model uses or correlates with health data, ethnicity, financial
      vulnerability, or other Art. 9 categories, the processing requires an Art. 9
      condition (which legitimate interest alone cannot satisfy for marketing), and
      Art. 22 restrictions are more likely to apply. This could block fraud-score-based
      marketing targeting entirely.

      - **Not examined — ePrivacy Directive implementations in specific EU member
      states.** If recipients are in the EU, each member state''s transposition governs
      marketing email rules and varies significantly. Germany''s UWG effectively requires
      opt-in for B2B email marketing. No member-state analysis was performed.

      - **Working assumption — The event-triggered emails are marketing, not transactional.**
      If any triggered messages are genuinely transactional (e.g., "your account review
      is complete — no action needed"), they fall outside marketing rules. But if
      the primary purpose is to promote a feature or drive adoption, they are marketing
      regardless of the trigger. Misclassification is a common enforcement trigger
      and should be resolved deliberately.

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-04T16:39:00+00:00'
---
# Research Dossier — Targeted Product Emails Using Transaction and Identity Data

**Matter:** Privacy review of Mosaic Relay's plan to send targeted product emails to merchants and platform administrators using service data (transaction volume, dispute rates, payout behavior, onboarding status, and fraud-risk indicators).
**Status:** First-pass research (in progress). This dossier reflects the completed GDPR/UK GDPR and PECR thread; US CAN-SPAM and special-category/Art. 22 threads are running in the background. Later results will be saved as separate packets. This dossier will change only after the lawyer requests and accepts a tracked revision.
**Assumptions in effect (per intake):** Recipients are business contacts (merchants/platform admins), not consumers. Mosaic Relay is the data controller for its own marketing emails. Risk/fraud scores do not themselves constitute special-category data unless they reveal sensitive attributes. Recipient jurisdiction is undetermined (US/UK/EU possible). No opt-out or preference controls exist. No retention policy exists.

---

## 1. Decision question

May Mosaic Relay use service data — including fraud-risk scores — to send targeted product emails to business contacts at merchants and platforms, and if so, under what legal basis (consent vs. legitimate interest), with what profiling, unsubscribe, suppression, and retention controls, given that recipients' jurisdictions are undetermined and no opt-out mechanism currently exists?

## 2. The core tension

The data was collected to **provide services** (payment acceptance, onboarding, identity verification, risk, operations). Reusing it to **select recipients for marketing emails** is a secondary purpose. That triggers purpose-limitation analysis, a legal-basis decision, and — because the targeting uses risk/fraud scores — profiling and sensitive-data scrutiny. The rules differ materially by jurisdiction, which is why jurisdiction is the single biggest open fork.

## 3. Confirmed facts (from intake)

- Recipients are **business contacts only** (merchants/platform admins), not consumers.
- Targeting uses **risk/fraud scores** derived from service data.
- **No opt-out/unsubscribe or preference controls** exist today.
- **No retention policy** for targeting data or suppression lists.
- Messages would be sent **weekly**, plus **event-triggered** emails after a transaction or account review.
- Customer contract terms, legal basis, and recipient jurisdiction: **undetermined**.

---

## 4. Legal analysis by thread

### 4.1 Purpose limitation (GDPR/UK GDPR Art. 6(4))

Mosaic collected transaction, onboarding, identity, risk, and operations data to provide its payment services. Using that same data to select marketing recipients is a **secondary purpose**. Under Art. 6(4), Mosaic must assess whether the secondary use is **compatible** with the original collection purpose, considering: the link between the purposes, the context of collection, the nature of the data, possible consequences for data subjects, and the existence of safeguards.

**Practical read:**
- Recommending dispute tools to a merchant with rising chargebacks is closely related to the service Mosaic already provides — arguably within the merchant's reasonable expectations.
- Promoting faster onboarding to businesses that have not completed verification is also service-adjacent.
- Using **fraud-risk scores** — which the merchant may not know exist — to target marketing is further from the original purpose and carries higher incompatibility risk.

### 4.2 Legal basis: consent vs. legitimate interest (GDPR/UK GDPR Art. 6)

- **Legitimate interest (Art. 6(1)(f))** is the most realistic basis for B2B marketing to existing business contacts. Mosaic must document a **legitimate interest assessment (LIA)** balancing its commercial interest against recipients' rights. The ICO has acknowledged B2B marketing can rely on legitimate interest, particularly for corporate subscribers.
- **Consent (Art. 6(1)(a))** is safer but operationally heavier. Consent must be freely given, specific, informed, and unambiguous — a pre-ticked box or a buried clause in platform terms will not suffice.

### 4.3 PECR rules on B2B marketing email (UK)

PECR (Privacy and Electronic Communications Regulations 2003) governs unsolicited electronic marketing in the UK. The key distinction:
- **Corporate subscribers** (limited companies, LLPs, government bodies): PECR does **not** require prior consent for marketing emails. Mosaic can send B2B marketing to corporate email addresses without opt-in consent, provided it identifies itself and provides a valid opt-out.
- **Individual subscribers** (sole traders, some partnerships): PECR treats them like consumers. Prior consent is required unless the **soft opt-in** exception applies (email obtained during a sale or negotiation, marketing relates to similar products/services, and opt-out was offered at collection and in every message).

**Practical read:** If all recipients are employees or administrators at incorporated businesses, the corporate-subscriber exemption applies and no prior consent is needed for the emails themselves. But if any recipients are sole traders — common among smaller merchants and marketplace sellers — Mosaic needs either consent or a valid soft opt-in for those individuals. Intake indicates no opt-out was offered at collection, which would make soft opt-in unavailable.

### 4.4 Profiling and automated-decision restrictions (GDPR/UK GDPR Arts. 4(4), 21, 22)

**Profiling** (Art. 4(4)) is automated processing to evaluate or predict aspects of an individual's behavior, performance, or preferences. Using transaction volume, dispute rates, and fraud-risk scores to select email recipients **is profiling**.

- **Art. 22** restricts solely automated decisions producing **legal or similarly significant effects**. Sending a marketing email is unlikely to be a "significant effect" on its own. But if the targeting model's output also feeds account decisions (e.g., restricting payouts, flagging accounts), Art. 22 could be triggered by the broader processing chain.
- **Art. 21(2)** gives data subjects an **absolute right to object** to processing for direct marketing, including profiling to the extent it relates to direct marketing. Once someone objects, Mosaic must stop — no balancing test applies.
- **Art. 9 special-category data:** Fraud-risk scores are not inherently special-category, but if the scoring model uses or proxies health data, racial/ethnic origin, political opinions, or other Art. 9 categories, processing requires an Art. 9 condition in addition to an Art. 6 basis. This is a material risk because fraud models can inadvertently proxy protected characteristics.

### 4.5 Message classification: transactional vs. marketing

The distinction matters because **transactional/service messages** (e.g., "your payout has been processed") are generally exempt from marketing consent requirements, while **marketing messages** (e.g., "try our new dispute tool") are not.

**Risk area:** The proposed emails sit in a gray zone. "We noticed your chargebacks are rising — here's a tool that can help" is arguably both service-relevant and promotional. Regulators (ICO, FTC) look at the **primary purpose** of the message. If the primary purpose is to drive feature adoption (a commercial goal), the message is likely marketing, even if it references the recipient's account activity.

**Practical read:** Classify these as marketing messages and apply marketing rules (opt-out, identification, lawful basis). Trying to characterize them as transactional to avoid marketing obligations is a common enforcement trigger.

### 4.6 Controller vs. processor allocation

Mosaic processes merchant and platform data to provide payment services — in that role it may act as a **processor** (or joint controller) for its platform customers. When Mosaic uses that same data for **its own marketing purposes**, it acts as a **controller** for that processing.

**Key issue:** If Mosaic's customer contracts restrict secondary use of platform data, or if the platform's privacy notice does not disclose that Mosaic may contact merchants for marketing, Mosaic cannot rely on the platform's consent or notice. Mosaic needs its own lawful basis and its own transparency (privacy-notice disclosure) for the marketing use.

### 4.7 Suppression, unsubscribe, and preference management

No opt-out or preference controls currently exist. At minimum:
- **Every marketing email must include a functioning unsubscribe mechanism** (CAN-SPAM, PECR, GDPR Art. 21).
- **Suppression lists** must be maintained so opted-out individuals are not re-contacted. Suppression data must be retained as long as needed to honor the opt-out — which may be indefinite.
- **Preference management** (topic or frequency choice) is a best practice that reduces full opt-outs and demonstrates accountability.
- **Event-triggered emails** need the same controls as batch emails if they are marketing in nature.

### 4.8 Retention

No retention policy exists. GDPR storage-limitation (Art. 5(1)(e)) requires personal data be kept no longer than necessary. Mosaic should define:
- How long targeting-segment data is retained (e.g., segment membership refreshed monthly, old segments purged).
- How long suppression-list entries are kept (indefinitely, or until the individual re-consents).
- How long engagement data (opens, clicks) is retained for marketing analytics.

---

## 5. Viable paths

### Path A — Legitimate interest + corporate-subscriber exemption (fastest, moderate risk)
Rely on Art. 6(1)(f) legitimate interest for the data processing and PECR's corporate-subscriber exemption for sending. Document an LIA. Build opt-out and suppression controls before launch. Restrict targeting to corporate email addresses only. Disclose the marketing use in Mosaic's privacy notice.
- **Pros:** No consent flow needed; faster to launch; well-suited to B2B.
- **Cons:** Requires confidence all recipients are corporate subscribers; legitimate interest must be documented and defensible; fraud-risk-score targeting is harder to justify under a balancing test; does not work for sole traders.

### Path B — Soft opt-in for existing customers (safer for mixed audiences)
Rely on PECR's soft opt-in for recipients whose email was obtained during a service relationship, provided marketing relates to similar services and opt-out was offered at collection and in every message. Combine with legitimate interest as the GDPR lawful basis.
- **Pros:** Covers sole traders and individual subscribers; aligns with the existing customer relationship.
- **Cons:** Only works if opt-out was offered at collection — intake suggests it was not, so soft opt-in may be unavailable; requires marketed products to be "similar" to what the customer already uses.

### Path C — Consent-based (highest compliance, slowest)
Obtain explicit opt-in consent before sending any marketing emails, via a preference center, account settings, or a one-time re-permission campaign.
- **Pros:** Strongest legal position; future-proof; works for all recipient types.
- **Cons:** Lower reach; slower; consent must be as easy to withdraw as to give.

### Recommended approach
**Path A for corporate subscribers, with Path B as a fallback for any sole traders, and Path C as the target state.** Build suppression and preference infrastructure now (required under all paths), document the LIA, update the privacy notice, and segment out any non-corporate recipients until their status is confirmed.

---

## 6. Practical control checklist

### Before launch (blocking)
- [ ] **Confirm recipient jurisdiction mix** (US / UK / EU / global). This determines which regime's rules are strictest and whether consent is required. *Highest-priority open item.*
- [ ] **Audit the targeting model inputs** to confirm whether fraud-risk scores or any input fields constitute or proxy special-category data under GDPR Art. 9. If they do, legitimate interest alone cannot support the marketing use.
- [ ] **Review customer contracts and platform terms** for restrictions on secondary use of merchant/admin data for Mosaic's own marketing. If restricted, obtain a contract amendment or the platform's agreement before proceeding.
- [ ] **Segment the recipient list** by subscriber type (corporate vs. individual/sole trader) and by jurisdiction. Exclude or separately handle non-corporate recipients until their status is confirmed.
- [ ] **Document a legitimate interest assessment (LIA)** if relying on Art. 6(1)(f), including the balancing test and safeguards.
- [ ] **Update the privacy notice** to disclose the marketing use of service data and the lawful basis.

### Required controls (all paths)
- [ ] **Working unsubscribe mechanism** in every marketing email (CAN-SPAM, PECR, GDPR Art. 21).
- [ ] **Suppression list** maintained so opted-out individuals are not re-contacted; honor opt-outs promptly (CAN-SPAM requires within 10 business days).
- [ ] **Preference center** allowing topic/frequency choice (best practice; reduces full opt-outs).
- [ ] **Identification** of Mosaic Relay as sender in every message (CAN-SPAM requires accurate header and subject-line info).
- [ ] **Event-triggered emails** subject to the same marketing controls if classified as marketing.

### Retention and data governance
- [ ] **Define retention periods** for targeting-segment data (refresh/purge cadence) and suppression-list entries (indefinite or until re-consent).
- [ ] **Define retention for engagement data** (opens, clicks) used in marketing analytics.
- [ ] **Data-minimization review** of the fields used in the targeting model — use only what is necessary for the stated purpose.

### Ongoing
- [ ] **Honor Art. 21(2) objections** absolutely — no balancing test once a recipient objects to direct marketing.
- [ ] **Monitor message classification** — apply the primary-purpose test honestly; do not relabel marketing as transactional.
- [ ] **Reassess** when jurisdiction, contract terms, or model inputs change.

---

## 7. Facts that would change the answer

- **If any recipients are sole traders or unincorporated partnerships**, PECR's corporate-subscriber exemption does not apply, and consent or soft opt-in is required for those individuals.
- **If the fraud-risk scores proxy special-category data** (health, ethnicity, financial vulnerability), GDPR Art. 9 is triggered and the analysis changes materially — likely blocking fraud-score-based marketing targeting or requiring a different basis and safeguards.
- **If Mosaic's customer contracts prohibit using platform data for Mosaic's own marketing**, Mosaic cannot proceed without a contract amendment or the platform's agreement, regardless of what privacy law permits.
- **If recipients are in the EU (not just the UK)**, ePrivacy Directive implementations vary — some member states (e.g., Germany) require opt-in consent even for B2B marketing email, pushing toward Path C.
- **If the event-triggered emails are genuinely transactional**, they may be exempt from marketing rules — but this classification must be defensible and the primary-purpose test applied honestly.

---

## 8. Authorities referenced (to be verified)

The completed GDPR/PECR thread is **model-only analysis** — no external statutory text or regulator guidance was retrieved in that run. The following authorities are referenced and must be verified against current text before reliance:
- GDPR Art. 5(1)(e) (storage limitation)
- GDPR Art. 6(1)(a) and (f) (consent; legitimate interest)
- GDPR Art. 6(4) (compatibility of further processing)
- GDPR Art. 9 (special categories)
- GDPR Art. 21(2) (right to object to direct marketing)
- GDPR Art. 22 (automated individual decision-making)
- GDPR Art. 4(4) (profiling definition)
- UK PECR 2003 (unsolicited electronic marketing; corporate vs. individual subscriber distinction; soft opt-in)
- US CAN-SPAM Act (commercial email; opt-out; 10-business-day honor requirement) — *thread pending*
- ICO direct-marketing and legitimate-interest guidance — *to be retrieved*

**Verification note:** The US CAN-SPAM and special-category/Art. 22 research threads are running in the background. Later results will be saved as separate packets. This dossier will change only after the lawyer requests and accepts a tracked revision. The GDPR/PECR analysis above should be checked against current statutory text and ICO guidance before it carries the final answer.

---

## 9. What would change this (ranked)

- **Open fork — Jurisdiction determines the strictness of the rules.** UK-only → PECR corporate-subscriber exemption and relatively permissive ICO B2B guidance. EU → several member states (notably Germany) require opt-in consent even for B2B email, pushing the whole campaign to Path C. US-only → CAN-SPAM requires only opt-out (no prior consent), making the analysis much simpler. The answer changes materially depending on which regime governs.
- **Not examined — Mosaic Relay's customer contracts and platform terms.** The vault does not contain these documents. If they restrict secondary use of platform data for Mosaic's own marketing, or if the platform's privacy notice does not disclose this use, Mosaic may be contractually barred regardless of what privacy law permits. This is the single most likely source of an unwelcome surprise.
- **Working assumption — All recipients are corporate subscribers.** The PECR B2B exemption and the legitimate-interest path depend on this. If even a small percentage are sole traders (common among marketplace sellers and smaller merchants), Mosaic needs consent or soft opt-in for those individuals — and soft opt-in is only available if an opt-out was offered at collection, which intake says it was not. This would push a segment into Path C or require excluding those recipients.
- **Open fork — Whether fraud-risk scores proxy special-category data.** If the scoring model uses or correlates with health data, ethnicity, financial vulnerability, or other Art. 9 categories, the processing requires an Art. 9 condition (which legitimate interest alone cannot satisfy for marketing), and Art. 22 restrictions are more likely to apply. This could block fraud-score-based marketing targeting entirely.
- **Not examined — ePrivacy Directive implementations in specific EU member states.** If recipients are in the EU, each member state's transposition governs marketing email rules and varies significantly. Germany's UWG effectively requires opt-in for B2B email marketing. No member-state analysis was performed.
- **Working assumption — The event-triggered emails are marketing, not transactional.** If any triggered messages are genuinely transactional (e.g., "your account review is complete — no action needed"), they fall outside marketing rules. But if the primary purpose is to promote a feature or drive adoption, they are marketing regardless of the trigger. Misclassification is a common enforcement trigger and should be resolved deliberately.
