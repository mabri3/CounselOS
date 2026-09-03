---
work_product_id: WP-d5a54295207c
matter_id: MAT-20260903-63c4be
title: 'Mosaic Relay — Risk-Scoring Program: Approved Internal Response'
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T17:43:10+00:00'
updated_at: '2026-09-03T17:43:10+00:00'
immutable: false
source_action_key: chat:RUN-20260903-08a2b3:tool:82c667101153d599bd21b08e
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# Mosaic Relay — Risk-Scoring Program: Approved Internal Response


      **Matter:** the internal record — Privacy Controls for Risk Data

      **Status:** ✅ **Approved for internal use only — do not send externally**

      **Classification:** Privileged & Confidential — Internal

      **Audience:** Product, Engineering, Risk Operations, Support, Compliance, Legal,
      and vendor-facing teams


      ---


      ## 1. Decision


      **The launch as proposed is not approved.**


      Mosaic Relay may proceed with a **gated, purpose-limited** risk-scoring launch
      **only after** the conditions in Section 3 are completed and verified. This
      is a lawyer decision for this fictional internal matter. Nothing in this response
      authorizes external communication, customer notice, or vendor outreach.


      ## 2. What is approved (the gated scope)


      The combined risk-scoring program — combining onboarding information, transaction
      history, device signals, sanctions results, dispute records, and payout behavior
      into a shared model — is approved **for the four product data flows only**,
      and only for the permitted operational purposes in Section 4:


      1. **Onboarding** — risk scoring to support merchant/seller onboarding decisions.

      2. **Transaction review** — risk scoring to support transaction review and monitoring.

      3. **Payout controls** — risk scoring to support payout holds and controls.

      4. **Account deactivation** — risk scoring to support account deactivation decisions.


      No other use of the combined data is approved.


      ## 3. Conditions precedent to launch


      The gated launch may proceed **only after all of the following are completed
      and verified**:


      | # | Condition | Primary owner |

      |---|-----------|---------------|

      | 1 | **Jurisdiction mapping** — exact launch and near-term jurisdictions scoped;
      design branches for US-only and EU/UK coverage; LATAM assessed before launch
      | Legal |

      | 2 | **Documented permitted purposes** — approved purposes recorded; **no unapproved
      secondary use** of combined data | Legal |

      | 3 | **Notices and consent/opt-out** — layered notices delivered; consent or
      opt-out implemented for secondary uses per jurisdiction | Privacy |

      | 4 | **Retention schedule and deletion exceptions** — tiered retention replacing
      flat 7 years; earlier deletion for cleared sanctions and resolved disputes |
      Privacy / Engineering |

      | 5 | **Least-privilege access** — role-based access enforced, logged, reviewed,
      revocable | Engineering / Risk Ops |

      | 6 | **Rights intake and response workflows** — access, correction, deletion,
      opt-out, explanation, and appeal workflows operational | Support / Privacy |

      | 7 | **Vendor and data-source contract permissions** — confirmed that current
      contracts permit the combination; amendments executed where needed | Legal /
      Vendor Mgmt |

      | 8 | **Explainability and human review** — scores explainable to individuals
      and business customers; human review path in place | Risk Ops / Engineering
      |

      | 9 | **Automated-decision safeguards** — GDPR Art. 22 / ADM and FCRA adverse-action
      safeguards implemented where applicable | Legal / Engineering |

      | 10 | **Auditability** — audit trail of access, decisions, and model changes
      | Engineering |

      | 11 | **Model validation, monitoring, versioning** — model validated, monitored,
      and versioned | Engineering / Risk Ops |

      | 12 | **Incident rollback** — documented rollback and incident-response path
      for the model and score | Engineering / Risk Ops |


      ## 4. Permitted operational use vs. secondary use


      - **Permitted operational use (approved):** fraud and risk scoring for onboarding,
      transaction review, payout controls, and account deactivation, using the combined
      data for those four flows.

      - **Secondary use (NOT approved without separate review):** any use beyond the
      four flows — e.g., marketing, creditworthiness/consumer-reporting, tenant/employment
      screening, or sharing combined data with third parties beyond the documented
      vendor minimum-fields scope.


      ## 5. Owners


      | Role | Responsibility |

      |------|----------------|

      | **Legal** | Jurisdiction mapping, permitted-purpose documentation, FCRA/ADM
      characterization, vendor contract permissions, go/no-go verification |

      | **Privacy** | Notices, consent/opt-out, retention schedule, rights workflows,
      data minimization |

      | **Engineering** | Shared data model, raw/derived separation, access enforcement,
      retention automation, rights tooling, explainability, audit, model versioning,
      rollback |

      | **Risk Operations** | Score/reason-code use, human review path, payout-hold
      triggers, monitoring |

      | **Support** | Rights intake and response workflows, limited-status explanations
      to individuals |

      | **Vendors** | Minimum-fields data under contract; no broader access |


      ## 6. Recommendation (separate from decision)


      The recommendation supporting this decision: approve only a gated, purpose-limited
      risk-scoring launch after the conditions above are complete. This recommendation
      is recorded separately from the lawyer decision.


      ---


      **Approved for internal use only. Do not send externally.**

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
# Mosaic Relay — Risk-Scoring Program: Approved Internal Response

**Matter:** the internal record — Privacy Controls for Risk Data
**Status:** ✅ **Approved for internal use only — do not send externally**
**Classification:** Privileged & Confidential — Internal
**Audience:** Product, Engineering, Risk Operations, Support, Compliance, Legal, and vendor-facing teams

---

## 1. Decision

**The launch as proposed is not approved.**

Mosaic Relay may proceed with a **gated, purpose-limited** risk-scoring launch **only after** the conditions in Section 3 are completed and verified. This is a lawyer decision for this fictional internal matter. Nothing in this response authorizes external communication, customer notice, or vendor outreach.

## 2. What is approved (the gated scope)

The combined risk-scoring program — combining onboarding information, transaction history, device signals, sanctions results, dispute records, and payout behavior into a shared model — is approved **for the four product data flows only**, and only for the permitted operational purposes in Section 4:

1. **Onboarding** — risk scoring to support merchant/seller onboarding decisions.
2. **Transaction review** — risk scoring to support transaction review and monitoring.
3. **Payout controls** — risk scoring to support payout holds and controls.
4. **Account deactivation** — risk scoring to support account deactivation decisions.

No other use of the combined data is approved.

## 3. Conditions precedent to launch

The gated launch may proceed **only after all of the following are completed and verified**:

| # | Condition | Primary owner |
|---|-----------|---------------|
| 1 | **Jurisdiction mapping** — exact launch and near-term jurisdictions scoped; design branches for US-only and EU/UK coverage; LATAM assessed before launch | Legal |
| 2 | **Documented permitted purposes** — approved purposes recorded; **no unapproved secondary use** of combined data | Legal |
| 3 | **Notices and consent/opt-out** — layered notices delivered; consent or opt-out implemented for secondary uses per jurisdiction | Privacy |
| 4 | **Retention schedule and deletion exceptions** — tiered retention replacing flat 7 years; earlier deletion for cleared sanctions and resolved disputes | Privacy / Engineering |
| 5 | **Least-privilege access** — role-based access enforced, logged, reviewed, revocable | Engineering / Risk Ops |
| 6 | **Rights intake and response workflows** — access, correction, deletion, opt-out, explanation, and appeal workflows operational | Support / Privacy |
| 7 | **Vendor and data-source contract permissions** — confirmed that current contracts permit the combination; amendments executed where needed | Legal / Vendor Mgmt |
| 8 | **Explainability and human review** — scores explainable to individuals and business customers; human review path in place | Risk Ops / Engineering |
| 9 | **Automated-decision safeguards** — GDPR Art. 22 / ADM and FCRA adverse-action safeguards implemented where applicable | Legal / Engineering |
| 10 | **Auditability** — audit trail of access, decisions, and model changes | Engineering |
| 11 | **Model validation, monitoring, versioning** — model validated, monitored, and versioned | Engineering / Risk Ops |
| 12 | **Incident rollback** — documented rollback and incident-response path for the model and score | Engineering / Risk Ops |

## 4. Permitted operational use vs. secondary use

- **Permitted operational use (approved):** fraud and risk scoring for onboarding, transaction review, payout controls, and account deactivation, using the combined data for those four flows.
- **Secondary use (NOT approved without separate review):** any use beyond the four flows — e.g., marketing, creditworthiness/consumer-reporting, tenant/employment screening, or sharing combined data with third parties beyond the documented vendor minimum-fields scope.

## 5. Owners

| Role | Responsibility |
|------|----------------|
| **Legal** | Jurisdiction mapping, permitted-purpose documentation, FCRA/ADM characterization, vendor contract permissions, go/no-go verification |
| **Privacy** | Notices, consent/opt-out, retention schedule, rights workflows, data minimization |
| **Engineering** | Shared data model, raw/derived separation, access enforcement, retention automation, rights tooling, explainability, audit, model versioning, rollback |
| **Risk Operations** | Score/reason-code use, human review path, payout-hold triggers, monitoring |
| **Support** | Rights intake and response workflows, limited-status explanations to individuals |
| **Vendors** | Minimum-fields data under contract; no broader access |

## 6. Recommendation (separate from decision)

The recommendation supporting this decision: approve only a gated, purpose-limited risk-scoring launch after the conditions above are complete. This recommendation is recorded separately from the lawyer decision.

---

**Approved for internal use only. Do not send externally.**
