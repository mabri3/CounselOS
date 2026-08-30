---
matter_id: MAT-20260830-dfe958
record_type: work_product
status: draft_for_review
review:
  segments:
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '# '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '## Alex Morgan lawyer review edits


      # I reviewed this draft against the intake facts. The draft must not imply that
      the creditor, report user, or notice issuer is known. The bracketed fields are
      mandatory launch inputs, not optional copy edits. I also changed the operational
      posture: the real-time message is an interim customer explanation, and the written
      notice is the control record unless Legal confirms otherwise for a specific
      flow.


      # Before approval, Product must provide one completed row for each product,
      state, decision-maker, report user, and outcome. Legal must approve the reason-code
      mapping and verify the current Regulation B, FCRA, ESIGN, and state requirements.
      Operations must prove that the notice is generated even when the customer abandons
      after a decision, and that support sees the same approved reason family.


      # The recommendation remains separate from any recorded decision. It is acceptable
      to proceed to limited implementation planning with placeholders. It is not acceptable
      to enable a customer-facing decline path with a missing issuer, missing principal
      reason, unproven electronic-consent basis, or an unresolved counteroffer classification.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: Notice and Customer-Communication Package — Real-Time Decision Flow
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '


      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '**Status: Draft for legal review — privileged and confidential**

      **Basis:** Product request, edited facts, and first-pass research memo. Legal
      points are unverified leads until checked against current authoritative text
      and confirmed product facts. No missing product facts have been invented; placeholders
      are marked '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BRACKETED]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.


      ---


      ## 1. Per-Flow Notice Matrix


      Build one row per flow (product × state × creditor × decline type) before launch.
      The matrix below is the required schema with the known structure and placeholders
      for unconfirmed facts.


      | Field | Flow A — Northstar-made decline | Flow B — Partner-made decline |

      |---|---|---|

      | Creditor / Reg B notice issuer | Northstar Pay '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: which products/flows Northstar Pay is the creditor]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` | Lending partner '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PARTNER NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` |

      | Decision-maker | Northstar Pay (credit, identity, fraud, or model decline)
      | Partner (credit decision) |

      | Consumer-report user (FCRA §615(a)) | Northstar Pay if it pulled/used a report '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: which entity pulls the report per flow]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` | Partner if it pulled the report; Northstar Pay may **also** be a report
      user if its fraud/identity screen relied on a report it obtained — dual-notice
      risk |

      | Reg B notice | Northstar Pay issues, within 30 days of completed application '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[UNVERIFIED LEAD: exact Reg B timing rule]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` | Partner issues; contract should require partner issuance and evidence
      |

      | FCRA notice | Northstar Pay issues if report-based | Partner issues for its
      report use; Northstar Pay issues separately for its own report use, if any |

      | Reason source | Northstar Pay approved reason mapping (§3) | Partner supplies
      principal reasons; Northstar Pay relays only approved wording |

      | Channel | In-app interim message + written notice (email if ESIGN consent
      valid, else postal) | Same |

      | Records / disputes | Northstar Pay | Per contract '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: allocation]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` |


      **Rule:** creditor, decision-maker, report user, and notice issuer are separate
      fields. Do not collapse them until facts prove they are the same.


      ---


      ## 2. Application Status Classification


      | Status | Classification | Notice duty |

      |---|---|---|

      | Decline | Adverse action | Reg B notice + FCRA §615(a) notice if report-based
      |

      | Conditional approval — changed material terms | Counteroffer '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: product design]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` | If counteroffer not accepted (incl. silence), counteroffer notice duties
      apply, including notice of right to original terms where applicable '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[UNVERIFIED LEAD: Reg B counteroffer rule]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` |

      | Conditional approval — final approval on modified terms | Not adverse action
      if applicant accepts; classify before launch | No adverse-action notice if accepted;
      document the classification decision |

      | Incomplete application | Incomplete, not declined | Incomplete-application
      notice handling '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[UNVERIFIED LEAD: Reg B incomplete-application rule]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` |

      | Abandoned before decision | Incomplete/withdrawn per product design | Classify
      and apply the corresponding rule; do not auto-decline without notice analysis
      |

      | Abandoned after decision | Decision already made | Notice duty is **not**
      avoided by abandonment. Log decision, reason codes, notice deadline, channel,
      and issuer at decision time |


      ---


      ## 3. Principal-Reason Handling


      Legal must approve a versioned mapping from model/rules output to customer-facing
      reasons, recording: controlling input/output, reason priority when multiple
      factors apply, effective date, approving owner, and customer wording. Fraud-control
      protection does **not** justify a vague catch-all or an invented reason.


      | Decision driver | Candidate customer-facing reason | Notes |

      |---|---|---|

      | Thin/no credit file | "Insufficient credit history" | Use only when accurate
      for that decision |

      | High existing obligations | "Your existing debt obligations are too high"
      | Same |

      | Identity verification failure | "We were unable to verify your identity" |
      Accurate; does not reveal verification method |

      | Fraud signal | "We were unable to verify the information in your application"
      | Use only if accurate — must reflect the actual principal reason; never disclose
      thresholds, vendor scores, or detection rules |

      | Model composite | Map to the top contributing principal reason(s) | '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: model reason codes and priority rules]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` |


      Support scripts must use the same approved reason family and must not speculate
      beyond the notice.


      ---


      ## 4. FCRA Report-User Fields (written notice, when a consumer report is used)


      Include in every FCRA adverse-action notice '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[UNVERIFIED LEAD: exact §615(a) content elements — verify against current
      text]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`:


      - Name, address, and toll-free number of the consumer-reporting agency: '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU ADDRESS]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU TOLL-FREE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`

      - Statement that the agency did not make the decision and cannot explain the
      reasons

      - Right to a free copy of the report within the permitted period '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: current period]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`

      - Right to dispute the accuracy or completeness of the report

      - The principal reasons for the adverse action


      ---


      ## 5. Exact Customer Language (placeholders marked)


      ### 5.1 In-app decline screen (interim/courtesy message — not assumed to satisfy
      written-notice requirements)


      > **We can''t approve your application right now.**

      > We''re sorry — your application for '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PRODUCT NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` wasn''t approved. Principal reason(s): '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[APPROVED REASON(S) FROM §3]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.

      > We''ll send you a written notice with details, including information about
      your rights, to '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[EMAIL/ADDRESS ON FILE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` by '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.

      > Questions? Contact support at '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[SUPPORT CONTACT]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.


      ### 5.2 Email written notice (only where valid ESIGN consent and access procedures
      are on file '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: consent evidence]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`; otherwise use 5.3)


      > **Subject: Important information about your '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PRODUCT NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` application**

      >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      > Dear '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CUSTOMER NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`,

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > Thank you for applying for '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PRODUCT NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` on '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[APPLICATION DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`. After reviewing your application, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` is unable to approve your application.

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > **Principal reason(s) for this decision:** '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[APPROVED REASON(S)]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[IF CONSUMER REPORT USED — include all §4 fields:]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` Our decision was based in whole or in part on information obtained in
      a report from the consumer-reporting agency listed below. The agency did not
      make this decision and cannot explain the reasons for it. You have the right
      to obtain a free copy of your report from the agency within '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PERIOD]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` and to dispute the accuracy or completeness of any information in it.

      > '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU ADDRESS]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU TOLL-FREE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[IF ECOA NOTICE APPLICABLE:]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` You have the right to a statement of the specific reasons for this action.
      To request it, contact '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR CONTACT]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` within '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PERIOD]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.

      >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      > '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR ADDRESS]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR CONTACT]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`

      > Date of notice: '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`


      ### 5.3 Postal notice


      Same content as 5.2, printed and mailed to '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[ADDRESS ON FILE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, with proof of mailing retained. '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: whether any launch state requires postal regardless of consent]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`


      ### 5.4 Conditional approval (counteroffer path — pending classification)


      > **Subject: Your '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PRODUCT NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` application — updated offer**

      >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: ' >'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '

      > Dear '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CUSTOMER NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`,

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > Based on your application dated '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[APPLICATION DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CREDITOR NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` can offer you '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PRODUCT NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` on these terms: '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[AMOUNT]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[NUMBER]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` payments of '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[PAYMENT AMOUNT]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, beginning '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[FIRST DUE DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[FEES/APR]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.

      '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '> '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '>

      > These terms differ from the terms you originally requested. If you do not
      accept this offer by '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[EXPIRATION DATE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[COUNTEROFFER NOTICE LANGUAGE — including right to original-terms notice
      if applicable; UNVERIFIED LEAD pending counteroffer classification]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.


      ### 5.5 Support script (decline calls)


      > "I''m sorry we couldn''t approve your application. The notice we sent lists
      the principal reason(s): '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[APPROVED REASON(S)]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`. I''m not able to share more detail about our decision process. If you
      believe the information used in your application or report is inaccurate, you
      can dispute it with '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU NAME]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '` at '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[BUREAU TOLL-FREE]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`, or I can help you with that. Would you like me to resend your written
      notice?"


      Support must not speculate, reveal fraud controls, or promise reconsideration
      outside the documented process.


      ---


      ## 6. Launch Gates (recommendation — not a recorded decision)


      Do not enable the decline paths until:


      1. Per-flow matrix (§1) is confirmed by Product and each lending partner.

      2. Legal approves the versioned reason mapping (§3).

      3. Counteroffer vs. final-approval classification is decided and documented
      (§2).

      4. ESIGN consent evidence is confirmed for email delivery, or postal is the
      default.

      5. State notice overlays for the launch list are verified '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`[CONFIRM: state list]'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: \
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: equal
    text: '`.

      6. Notice generation, delivery, and retention evidence is tested in Operations.


      **Recommendation:** adopt the dual-track design — accurate principal reasons
      in-app plus a full written notice by email (ESIGN-permitted) or postal mail
      — with the per-flow matrix as the control document. This is a recommendation
      only; no durable decision has been recorded. Say the word if you want it recorded
      as one.

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
# ## Alex Morgan lawyer review edits

# I reviewed this draft against the intake facts. The draft must not imply that the creditor, report user, or notice issuer is known. The bracketed fields are mandatory launch inputs, not optional copy edits. I also changed the operational posture: the real-time message is an interim customer explanation, and the written notice is the control record unless Legal confirms otherwise for a specific flow.

# Before approval, Product must provide one completed row for each product, state, decision-maker, report user, and outcome. Legal must approve the reason-code mapping and verify the current Regulation B, FCRA, ESIGN, and state requirements. Operations must prove that the notice is generated even when the customer abandons after a decision, and that support sees the same approved reason family.

# The recommendation remains separate from any recorded decision. It is acceptable to proceed to limited implementation planning with placeholders. It is not acceptable to enable a customer-facing decline path with a missing issuer, missing principal reason, unproven electronic-consent basis, or an unresolved counteroffer classification.Notice and Customer-Communication Package — Real-Time Decision Flow

**Status: Draft for legal review — privileged and confidential**
**Basis:** Product request, edited facts, and first-pass research memo. Legal points are unverified leads until checked against current authoritative text and confirmed product facts. No missing product facts have been invented; placeholders are marked \`[BRACKETED]\`.

---

## 1. Per-Flow Notice Matrix

Build one row per flow (product × state × creditor × decline type) before launch. The matrix below is the required schema with the known structure and placeholders for unconfirmed facts.

| Field | Flow A — Northstar-made decline | Flow B — Partner-made decline |
|---|---|---|
| Creditor / Reg B notice issuer | Northstar Pay \`[CONFIRM: which products/flows Northstar Pay is the creditor]\` | Lending partner \`[PARTNER NAME]\` |
| Decision-maker | Northstar Pay (credit, identity, fraud, or model decline) | Partner (credit decision) |
| Consumer-report user (FCRA §615(a)) | Northstar Pay if it pulled/used a report \`[CONFIRM: which entity pulls the report per flow]\` | Partner if it pulled the report; Northstar Pay may **also** be a report user if its fraud/identity screen relied on a report it obtained — dual-notice risk |
| Reg B notice | Northstar Pay issues, within 30 days of completed application \`[UNVERIFIED LEAD: exact Reg B timing rule]\` | Partner issues; contract should require partner issuance and evidence |
| FCRA notice | Northstar Pay issues if report-based | Partner issues for its report use; Northstar Pay issues separately for its own report use, if any |
| Reason source | Northstar Pay approved reason mapping (§3) | Partner supplies principal reasons; Northstar Pay relays only approved wording |
| Channel | In-app interim message + written notice (email if ESIGN consent valid, else postal) | Same |
| Records / disputes | Northstar Pay | Per contract \`[CONFIRM: allocation]\` |

**Rule:** creditor, decision-maker, report user, and notice issuer are separate fields. Do not collapse them until facts prove they are the same.

---

## 2. Application Status Classification

| Status | Classification | Notice duty |
|---|---|---|
| Decline | Adverse action | Reg B notice + FCRA §615(a) notice if report-based |
| Conditional approval — changed material terms | Counteroffer \`[CONFIRM: product design]\` | If counteroffer not accepted (incl. silence), counteroffer notice duties apply, including notice of right to original terms where applicable \`[UNVERIFIED LEAD: Reg B counteroffer rule]\` |
| Conditional approval — final approval on modified terms | Not adverse action if applicant accepts; classify before launch | No adverse-action notice if accepted; document the classification decision |
| Incomplete application | Incomplete, not declined | Incomplete-application notice handling \`[UNVERIFIED LEAD: Reg B incomplete-application rule]\` |
| Abandoned before decision | Incomplete/withdrawn per product design | Classify and apply the corresponding rule; do not auto-decline without notice analysis |
| Abandoned after decision | Decision already made | Notice duty is **not** avoided by abandonment. Log decision, reason codes, notice deadline, channel, and issuer at decision time |

---

## 3. Principal-Reason Handling

Legal must approve a versioned mapping from model/rules output to customer-facing reasons, recording: controlling input/output, reason priority when multiple factors apply, effective date, approving owner, and customer wording. Fraud-control protection does **not** justify a vague catch-all or an invented reason.

| Decision driver | Candidate customer-facing reason | Notes |
|---|---|---|
| Thin/no credit file | "Insufficient credit history" | Use only when accurate for that decision |
| High existing obligations | "Your existing debt obligations are too high" | Same |
| Identity verification failure | "We were unable to verify your identity" | Accurate; does not reveal verification method |
| Fraud signal | "We were unable to verify the information in your application" | Use only if accurate — must reflect the actual principal reason; never disclose thresholds, vendor scores, or detection rules |
| Model composite | Map to the top contributing principal reason(s) | \`[CONFIRM: model reason codes and priority rules]\` |

Support scripts must use the same approved reason family and must not speculate beyond the notice.

---

## 4. FCRA Report-User Fields (written notice, when a consumer report is used)

Include in every FCRA adverse-action notice \`[UNVERIFIED LEAD: exact §615(a) content elements — verify against current text]\`:

- Name, address, and toll-free number of the consumer-reporting agency: \`[BUREAU NAME]\`, \`[BUREAU ADDRESS]\`, \`[BUREAU TOLL-FREE]\`
- Statement that the agency did not make the decision and cannot explain the reasons
- Right to a free copy of the report within the permitted period \`[CONFIRM: current period]\`
- Right to dispute the accuracy or completeness of the report
- The principal reasons for the adverse action

---

## 5. Exact Customer Language (placeholders marked)

### 5.1 In-app decline screen (interim/courtesy message — not assumed to satisfy written-notice requirements)

> **We can't approve your application right now.**
> We're sorry — your application for \`[PRODUCT NAME]\` wasn't approved. Principal reason(s): \`[APPROVED REASON(S) FROM §3]\`.
> We'll send you a written notice with details, including information about your rights, to \`[EMAIL/ADDRESS ON FILE]\` by \`[DATE]\`.
> Questions? Contact support at \`[SUPPORT CONTACT]\`.

### 5.2 Email written notice (only where valid ESIGN consent and access procedures are on file \`[CONFIRM: consent evidence]\`; otherwise use 5.3)

> **Subject: Important information about your \`[PRODUCT NAME]\` application**
> >
> Dear \`[CUSTOMER NAME]\`,
> >
> Thank you for applying for \`[PRODUCT NAME]\` on \`[APPLICATION DATE]\`. After reviewing your application, \`[CREDITOR NAME]\` is unable to approve your application.
> >
> **Principal reason(s) for this decision:** \`[APPROVED REASON(S)]\`
> >
> \`[IF CONSUMER REPORT USED — include all §4 fields:]\` Our decision was based in whole or in part on information obtained in a report from the consumer-reporting agency listed below. The agency did not make this decision and cannot explain the reasons for it. You have the right to obtain a free copy of your report from the agency within \`[PERIOD]\` and to dispute the accuracy or completeness of any information in it.
> \`[BUREAU NAME]\`, \`[BUREAU ADDRESS]\`, \`[BUREAU TOLL-FREE]\`
> >
> \`[IF ECOA NOTICE APPLICABLE:]\` You have the right to a statement of the specific reasons for this action. To request it, contact \`[CREDITOR CONTACT]\` within \`[PERIOD]\`.
> >
> \`[CREDITOR NAME]\`, \`[CREDITOR ADDRESS]\`, \`[CREDITOR CONTACT]\`
> Date of notice: \`[DATE]\`

### 5.3 Postal notice

Same content as 5.2, printed and mailed to \`[ADDRESS ON FILE]\`, with proof of mailing retained. \`[CONFIRM: whether any launch state requires postal regardless of consent]\`

### 5.4 Conditional approval (counteroffer path — pending classification)

> **Subject: Your \`[PRODUCT NAME]\` application — updated offer**
> >
> Dear \`[CUSTOMER NAME]\`,
> >
> Based on your application dated \`[APPLICATION DATE]\`, \`[CREDITOR NAME]\` can offer you \`[PRODUCT NAME]\` on these terms: \`[AMOUNT]\`, \`[NUMBER]\` payments of \`[PAYMENT AMOUNT]\`, beginning \`[FIRST DUE DATE]\`, \`[FEES/APR]\`.
> >
> These terms differ from the terms you originally requested. If you do not accept this offer by \`[EXPIRATION DATE]\`, \`[COUNTEROFFER NOTICE LANGUAGE — including right to original-terms notice if applicable; UNVERIFIED LEAD pending counteroffer classification]\`.

### 5.5 Support script (decline calls)

> "I'm sorry we couldn't approve your application. The notice we sent lists the principal reason(s): \`[APPROVED REASON(S)]\`. I'm not able to share more detail about our decision process. If you believe the information used in your application or report is inaccurate, you can dispute it with \`[BUREAU NAME]\` at \`[BUREAU TOLL-FREE]\`, or I can help you with that. Would you like me to resend your written notice?"

Support must not speculate, reveal fraud controls, or promise reconsideration outside the documented process.

---

## 6. Launch Gates (recommendation — not a recorded decision)

Do not enable the decline paths until:

1. Per-flow matrix (§1) is confirmed by Product and each lending partner.
2. Legal approves the versioned reason mapping (§3).
3. Counteroffer vs. final-approval classification is decided and documented (§2).
4. ESIGN consent evidence is confirmed for email delivery, or postal is the default.
5. State notice overlays for the launch list are verified \`[CONFIRM: state list]\`.
6. Notice generation, delivery, and retention evidence is tested in Operations.

**Recommendation:** adopt the dual-track design — accurate principal reasons in-app plus a full written notice by email (ESIGN-permitted) or postal mail — with the per-flow matrix as the control document. This is a recommendation only; no durable decision has been recorded. Say the word if you want it recorded as one.
