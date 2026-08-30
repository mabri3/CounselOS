---
matter_id: MAT-20260830-dfe958
record_type: work_product
status: final_for_review
privilege: privileged_and_confidential
review:
  segments:
  - kind: equal
    text: '# Launch-Readiness Response — Adverse Action Notices for Declined Applications


      **To:** Alex Morgan, Northstar Pay

      **From:** Legal (prepared by Counsel Copilot for review)

      **Status:** Ready for review — privileged and confidential — NOT for external
      distribution

      **Basis:** Product request, edited facts, issue map, first-pass research memo,
      and the edited notice and customer-communication package. Legal points are unverified
      leads until checked against current authoritative text and confirmed product
      facts. No missing product facts have been invented; placeholders are marked
      `[BRACKETED]`.


      ---


      ## 1. Legal Summary


      Northstar Pay can launch the real-time approval / conditional approval / decline
      experience before the holiday season, but only on a dual-track design with a
      per-flow control matrix, and only after the launch gates in §7 are cleared.


      **Recommended design:** show a clear real-time in-app result with accurate,
      approved principal reason(s), then send the complete written notice by email
      (only where valid ESIGN consent and access procedures are on file) or postal
      mail. Treat the in-app message as an interim customer explanation, not the legally
      required written notice, unless Legal confirms otherwise for a specific flow.
      The written notice is the control record.


      **Core structural point:** creditor, decision-maker, consumer-report user, and
      notice issuer are separate fields. Some declines are made by Northstar Pay and
      some by a lending partner; duties must be mapped per flow, not assumed to be
      uniform. The principal risk in the bank-partner model is dual or missing notices
      when both entities act on the application — for example, when a partner makes
      the credit decision but Northstar Pay''s own fraud or identity screen relied
      on a consumer report it obtained.


      **Fraud-control protection does not justify a vague catch-all or an invented
      reason.** The design preserves fraud controls by mapping internal reason codes
      to truthful, non-revealing principal reasons — never by substituting "does not
      meet our requirements."


      ## 2. Federal and State Requirements


      ### Federal (unverified leads — verify against current text)


      - **ECOA / Regulation B:** adverse action notice duties attach to the creditor
      — specific principal reasons, timing (working lead: within 30 days of a completed
      application), counteroffer rules (notice of right to original terms if the counteroffer
      is not accepted, including silence), and incomplete-application handling. `[UNVERIFIED
      LEAD: §§1002.2, 1002.9, 1002.10, 1002.13]`

      - **FCRA §615(a):** when a consumer report contributes to the decision, the
      report user owes an adverse-action notice containing the principal reasons,
      bureau name/address/toll-free number, a statement that the agency did not make
      the decision, the free-report right, and the dispute right. `[UNVERIFIED LEAD:
      exact content elements and timing]`

      - **ESIGN / UETA:** email delivery of the written notice requires valid consent
      and access/retention procedures; otherwise postal mail. `[CONFIRM: consent evidence]`


      ### State overlays


      Current pay-in-4 states (CA, CO, GA, IL, NY, TX, WA) and the longer-term installment
      state list may impose denial-notice requirements beyond federal, and some states
      may require postal delivery regardless of consent. `[CONFIRM: state list and
      state-specific denial-notice rules]`


      ## 3. Model-Reason Documentation


      Legal must approve a **versioned mapping** from each model or rule output to
      the customer-facing principal reason that actually drove the decision. Each
      record should capture: product and state, model/rule version, controlling input
      or output, reason priority when multiple factors apply, effective date, approving
      owner, customer wording, support wording, and whether a consumer report was
      used.


      Candidate mappings (placeholders only — use only when accurate for that decision):


      | Decision driver | Candidate customer-facing reason |

      |---|---|

      | Thin/no credit file | "Insufficient credit history" |

      | High existing obligations | "Your existing debt obligations are too high"
      |

      | Identity verification failure | "We were unable to verify your identity" |

      | Fraud signal | "We were unable to verify the information in your application"
      — only if that is the truthful principal reason |

      | Model composite | Top contributing principal reason(s) `[CONFIRM: model reason
      codes and priority rules]` |


      Never disclose thresholds, scores, vendor names, or detection rules. Support
      scripts must use the same approved reason family and must not speculate beyond
      the notice.


      ## 4. Vendor and Partner Responsibilities


      - **Lending partners:** where the partner is the creditor, the partner generally
      issues the Regulation B notice; contracts should require partner issuance, evidence,
      and record retention. Northstar Pay relays only approved wording for partner-supplied
      reasons.

      - **Dual-notice risk:** if Northstar Pay independently uses a consumer report
      for a fraud or identity decision, it may owe its own FCRA §615(a) notice even
      when the partner issues the creditor''s Regulation B notice.

      - **Credit-reporting vendors:** supply bureau contact details and reason codes;
      accuracy obligations.

      - **Support/servicing:** consistent reason explanations; dispute routing (FCRA
      §611/§623 duties if a furnisher).

      - **Contract allocation:** `[CONFIRM: who issues, who retains records, who handles
      bureau disputes, per contract]`


      ## 5. Exact Customer Communications


      Full text with all placeholders is in the notice and customer-communication
      package (§§5.1–5.5 of that document). Summary:


      - **In-app decline screen (interim):** "We can''t approve your application right
      now… Principal reason(s): `[APPROVED REASON(S)]`… We''ll send you a written
      notice with details… to `[EMAIL/ADDRESS ON FILE]` by `[DATE]`."

      - **Email written notice** (only with valid ESIGN consent `[CONFIRM]`): decline
      statement from `[CREDITOR NAME]`, principal reasons, FCRA report-user block
      (`[BUREAU NAME/ADDRESS/TOLL-FREE]`, free-report and dispute rights) when a report
      was used, ECOA statement-of-reasons right, creditor contact block, notice date.

      - **Postal notice:** same content, mailed to `[ADDRESS ON FILE]` with proof
      of mailing retained. `[CONFIRM: whether any launch state requires postal regardless
      of consent]`

      - **Conditional approval (pending classification):** updated-offer message with
      `[AMOUNT]`, `[NUMBER]` payments of `[PAYMENT AMOUNT]`, beginning `[FIRST DUE
      DATE]`, `[FEES/APR]`, expiration date, and `[COUNTEROFFER NOTICE LANGUAGE —
      pending classification]`.

      - **Support script:** reads the approved reason(s) from the notice, does not
      speculate or reveal fraud controls, offers bureau dispute help and notice resend.


      ## 6. Status Classification


      | Status | Treatment |

      |---|---|

      | Decline | Adverse action — Reg B notice + FCRA §615(a) if report-based |

      | Conditional approval (changed material terms) | Counteroffer `[CONFIRM: product
      design]` — counteroffer notice duties if not accepted, including silence |

      | Conditional approval (final approval on modified terms) | Not adverse action
      if accepted — classify and document before launch |

      | Incomplete application | Incomplete-application notice handling `[UNVERIFIED
      LEAD: Reg B rule]` |

      | Abandoned before decision | Classify as incomplete/withdrawn per product design;
      no auto-decline without notice analysis |

      | Abandoned after decision | Notice duty is **not** avoided — log decision,
      reasons, deadline, channel, and issuer at decision time |


      ## 7. Launch Blockers (gates — recommendation, not a recorded decision)


      Do not enable a customer-facing decline path until:


      1. The per-flow matrix (creditor, decision-maker, report user, notice issuer,
      reason source, channel, records/disputes owner) is confirmed by Product and
      each lending partner for every product × state × outcome.

      2. Legal approves the versioned reason-code mapping.

      3. Counteroffer vs. final-approval classification is decided and documented.

      4. ESIGN consent evidence is confirmed for email delivery, or postal is the
      default.

      5. State notice overlays for the launch list are verified `[CONFIRM: state list]`.

      6. Operations proves notice generation, delivery, retention, and post-decision
      abandonment handling — including that support sees the same approved reason
      family.


      It is acceptable to proceed now with limited implementation planning using the
      marked placeholders. It is not acceptable to launch with a missing issuer, missing
      principal reason, unproven electronic-consent basis, or unresolved counteroffer
      classification.


      ## 8. Assumptions and Unverified Leads


      **Assumptions (flagged, not verified):**

      1. Consumer-credit product covered by ECOA/Regulation B.

      2. FCRA adverse-action duties apply when consumer-report information contributes
      to the decision.

      3. Creditor identity may differ by flow (Northstar Pay vs. lending partner).

      4. Electronic delivery requires ESIGN/UETA compliance; otherwise postal mail.

      5. The real-time in-app message is an interim message, not the required written
      notice, unless confirmed otherwise.


      **Unverified legal leads:** Regulation B adverse-action definition, timing,
      counteroffer, and incomplete-application rules; FCRA §615(a) content elements
      and timing; ESIGN delivery requirements; state denial-notice overlays for launch
      states and installment products. All must be checked against current authoritative
      text before launch.


      **Missing product facts (placeholders, not invented):** creditor per flow; report
      user per flow; partner names; bureau details; state launch list; ESIGN consent
      evidence; model inputs, reason codes, and priority rules; counteroffer classification;
      vendor contract allocations; notice dates and contacts.


      ---


      **Decision status:** This response is a recommendation for review. No durable
      decision has been recorded; approval, delivery, and any decision record remain
      separate actions.

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
# Launch-Readiness Response — Adverse Action Notices for Declined Applications

**To:** Alex Morgan, Northstar Pay
**From:** Legal (prepared by Counsel Copilot for review)
**Status:** Ready for review — privileged and confidential — NOT for external distribution
**Basis:** Product request, edited facts, issue map, first-pass research memo, and the edited notice and customer-communication package. Legal points are unverified leads until checked against current authoritative text and confirmed product facts. No missing product facts have been invented; placeholders are marked `[BRACKETED]`.

---

## 1. Legal Summary

Northstar Pay can launch the real-time approval / conditional approval / decline experience before the holiday season, but only on a dual-track design with a per-flow control matrix, and only after the launch gates in §7 are cleared.

**Recommended design:** show a clear real-time in-app result with accurate, approved principal reason(s), then send the complete written notice by email (only where valid ESIGN consent and access procedures are on file) or postal mail. Treat the in-app message as an interim customer explanation, not the legally required written notice, unless Legal confirms otherwise for a specific flow. The written notice is the control record.

**Core structural point:** creditor, decision-maker, consumer-report user, and notice issuer are separate fields. Some declines are made by Northstar Pay and some by a lending partner; duties must be mapped per flow, not assumed to be uniform. The principal risk in the bank-partner model is dual or missing notices when both entities act on the application — for example, when a partner makes the credit decision but Northstar Pay's own fraud or identity screen relied on a consumer report it obtained.

**Fraud-control protection does not justify a vague catch-all or an invented reason.** The design preserves fraud controls by mapping internal reason codes to truthful, non-revealing principal reasons — never by substituting "does not meet our requirements."

## 2. Federal and State Requirements

### Federal (unverified leads — verify against current text)

- **ECOA / Regulation B:** adverse action notice duties attach to the creditor — specific principal reasons, timing (working lead: within 30 days of a completed application), counteroffer rules (notice of right to original terms if the counteroffer is not accepted, including silence), and incomplete-application handling. `[UNVERIFIED LEAD: §§1002.2, 1002.9, 1002.10, 1002.13]`
- **FCRA §615(a):** when a consumer report contributes to the decision, the report user owes an adverse-action notice containing the principal reasons, bureau name/address/toll-free number, a statement that the agency did not make the decision, the free-report right, and the dispute right. `[UNVERIFIED LEAD: exact content elements and timing]`
- **ESIGN / UETA:** email delivery of the written notice requires valid consent and access/retention procedures; otherwise postal mail. `[CONFIRM: consent evidence]`

### State overlays

Current pay-in-4 states (CA, CO, GA, IL, NY, TX, WA) and the longer-term installment state list may impose denial-notice requirements beyond federal, and some states may require postal delivery regardless of consent. `[CONFIRM: state list and state-specific denial-notice rules]`

## 3. Model-Reason Documentation

Legal must approve a **versioned mapping** from each model or rule output to the customer-facing principal reason that actually drove the decision. Each record should capture: product and state, model/rule version, controlling input or output, reason priority when multiple factors apply, effective date, approving owner, customer wording, support wording, and whether a consumer report was used.

Candidate mappings (placeholders only — use only when accurate for that decision):

| Decision driver | Candidate customer-facing reason |
|---|---|
| Thin/no credit file | "Insufficient credit history" |
| High existing obligations | "Your existing debt obligations are too high" |
| Identity verification failure | "We were unable to verify your identity" |
| Fraud signal | "We were unable to verify the information in your application" — only if that is the truthful principal reason |
| Model composite | Top contributing principal reason(s) `[CONFIRM: model reason codes and priority rules]` |

Never disclose thresholds, scores, vendor names, or detection rules. Support scripts must use the same approved reason family and must not speculate beyond the notice.

## 4. Vendor and Partner Responsibilities

- **Lending partners:** where the partner is the creditor, the partner generally issues the Regulation B notice; contracts should require partner issuance, evidence, and record retention. Northstar Pay relays only approved wording for partner-supplied reasons.
- **Dual-notice risk:** if Northstar Pay independently uses a consumer report for a fraud or identity decision, it may owe its own FCRA §615(a) notice even when the partner issues the creditor's Regulation B notice.
- **Credit-reporting vendors:** supply bureau contact details and reason codes; accuracy obligations.
- **Support/servicing:** consistent reason explanations; dispute routing (FCRA §611/§623 duties if a furnisher).
- **Contract allocation:** `[CONFIRM: who issues, who retains records, who handles bureau disputes, per contract]`

## 5. Exact Customer Communications

Full text with all placeholders is in the notice and customer-communication package (§§5.1–5.5 of that document). Summary:

- **In-app decline screen (interim):** "We can't approve your application right now… Principal reason(s): `[APPROVED REASON(S)]`… We'll send you a written notice with details… to `[EMAIL/ADDRESS ON FILE]` by `[DATE]`."
- **Email written notice** (only with valid ESIGN consent `[CONFIRM]`): decline statement from `[CREDITOR NAME]`, principal reasons, FCRA report-user block (`[BUREAU NAME/ADDRESS/TOLL-FREE]`, free-report and dispute rights) when a report was used, ECOA statement-of-reasons right, creditor contact block, notice date.
- **Postal notice:** same content, mailed to `[ADDRESS ON FILE]` with proof of mailing retained. `[CONFIRM: whether any launch state requires postal regardless of consent]`
- **Conditional approval (pending classification):** updated-offer message with `[AMOUNT]`, `[NUMBER]` payments of `[PAYMENT AMOUNT]`, beginning `[FIRST DUE DATE]`, `[FEES/APR]`, expiration date, and `[COUNTEROFFER NOTICE LANGUAGE — pending classification]`.
- **Support script:** reads the approved reason(s) from the notice, does not speculate or reveal fraud controls, offers bureau dispute help and notice resend.

## 6. Status Classification

| Status | Treatment |
|---|---|
| Decline | Adverse action — Reg B notice + FCRA §615(a) if report-based |
| Conditional approval (changed material terms) | Counteroffer `[CONFIRM: product design]` — counteroffer notice duties if not accepted, including silence |
| Conditional approval (final approval on modified terms) | Not adverse action if accepted — classify and document before launch |
| Incomplete application | Incomplete-application notice handling `[UNVERIFIED LEAD: Reg B rule]` |
| Abandoned before decision | Classify as incomplete/withdrawn per product design; no auto-decline without notice analysis |
| Abandoned after decision | Notice duty is **not** avoided — log decision, reasons, deadline, channel, and issuer at decision time |

## 7. Launch Blockers (gates — recommendation, not a recorded decision)

Do not enable a customer-facing decline path until:

1. The per-flow matrix (creditor, decision-maker, report user, notice issuer, reason source, channel, records/disputes owner) is confirmed by Product and each lending partner for every product × state × outcome.
2. Legal approves the versioned reason-code mapping.
3. Counteroffer vs. final-approval classification is decided and documented.
4. ESIGN consent evidence is confirmed for email delivery, or postal is the default.
5. State notice overlays for the launch list are verified `[CONFIRM: state list]`.
6. Operations proves notice generation, delivery, retention, and post-decision abandonment handling — including that support sees the same approved reason family.

It is acceptable to proceed now with limited implementation planning using the marked placeholders. It is not acceptable to launch with a missing issuer, missing principal reason, unproven electronic-consent basis, or unresolved counteroffer classification.

## 8. Assumptions and Unverified Leads

**Assumptions (flagged, not verified):**
1. Consumer-credit product covered by ECOA/Regulation B.
2. FCRA adverse-action duties apply when consumer-report information contributes to the decision.
3. Creditor identity may differ by flow (Northstar Pay vs. lending partner).
4. Electronic delivery requires ESIGN/UETA compliance; otherwise postal mail.
5. The real-time in-app message is an interim message, not the required written notice, unless confirmed otherwise.

**Unverified legal leads:** Regulation B adverse-action definition, timing, counteroffer, and incomplete-application rules; FCRA §615(a) content elements and timing; ESIGN delivery requirements; state denial-notice overlays for launch states and installment products. All must be checked against current authoritative text before launch.

**Missing product facts (placeholders, not invented):** creditor per flow; report user per flow; partner names; bureau details; state launch list; ESIGN consent evidence; model inputs, reason codes, and priority rules; counteroffer classification; vendor contract allocations; notice dates and contacts.

---

**Decision status:** This response is a recommendation for review. No durable decision has been recorded; approval, delivery, and any decision record remain separate actions.
