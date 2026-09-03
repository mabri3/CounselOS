---
work_product_id: WP-af5df875df6b
matter_id: MAT-20260903-e03847
title: FCRA Adverse-Action Notice Requirements for Consumer-Report Users
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-03T16:20:46+00:00'
updated_at: '2026-09-03T16:23:29+00:00'
immutable: false
source_action_key: chat:RUN-20260903-40caf5:tool:b459de1dc5795c530dd333f4
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: equal
    text: '# FCRA Adverse-Action Notice Requirements for Consumer-Report Users


      **Matter:** Mosaic Relay UX Test — 02 — Contractor Background-Check Integration

      **Draft type:** Work product (regulatory analysis)

      **Status:** Draft for review — grounded in the saved partial research packet
      (first-pass, model-only; no external authority retrieved)


      ---


      ## 1. Purpose and scope


      This draft addresses the FCRA adverse-action notice obligations that attach
      when a consumer report is used to make an engagement or payout decision'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', and the overlapping EEOC disparate-impact / individualized-assessment
      obligations that apply to criminal-history screening'
    change_id: CHG-20260903-3d679c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '. It is written for the proposed flow in which a software platform screens
      delivery contractors (identity, criminal history, sanctions, work eligibility)
      through a background-check vendor and receives a "clear," "review," or "fail"
      result, while Mosaic Relay processes identity data and payout instructions.


      The controlling '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: question
    change_id: CHG-20260903-b463a8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: questions
    change_id: CHG-20260903-b463a8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: is
    change_id: CHG-20260903-5803b5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: are
    change_id: CHG-20260903-5803b5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ': **who is the FCRA "user" of the consumer report,'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: ' and'
    change_id: CHG-20260903-5992f2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' what must that user do before and after taking adverse action based on
      the report'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', and how does the criminal-history screen avoid disparate-impact liability'
    change_id: CHG-20260903-0c8a66
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '?**


      ---


      ## 2. Threshold: is this an FCRA consumer report, and who is the user?


      The FCRA adverse-action architecture only applies if the vendor''s output is
      a **consumer report** and the party acting on it is a **user** taking adverse
      action based **in whole or in part** on that report.


      - A **consumer report** is any written, oral, or other communication of information
      bearing on a consumer''s creditworthiness, character, general reputation, personal
      characteristics, or mode of living that is used or expected to be used for a
      permissible purpose (15 U.S.C. § 1681a(d)). Criminal-history, identity, and
      work-eligibility screening assembled by a third party for an engagement decision
      can fall within this definition.

      - A **consumer reporting agency (CRA)** is a person that, on a regular basis,
      assembles or evaluates consumer credit or other information for the purpose
      of furnishing consumer reports to third parties (15 U.S.C. § 1681a(f)). Whether
      the vendor is a CRA for these searches is a fact to confirm in writing with
      the vendor.

      - The **user** is the party that obtains the report for a permissible purpose
      and uses it to make a decision. In this flow, the platform is the natural user
      and decision-maker; Mosaic Relay should not become a co-user by operationalizing
      a denial.


      **Material open fact:** whether the reports are consumer reports and whether
      the vendor is a CRA. If they are not, the federal adverse-action burden narrows,
      though state law'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', privacy,'
    change_id: CHG-20260903-d85ed7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' and '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: privacy
    change_id: CHG-20260903-245497
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: disparate-impact
    change_id: CHG-20260903-245497
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: " obligations remain.\n\n---\n\n## 3. Pre-adverse-action obligations (before\
      \ the decision)\n\nIf the platform is the user, it must, **before** taking any\
      \ adverse action based in whole or in part on the report:\n\n1. **Provide a\
      \ clear and conspicuous standalone disclosure** that a consumer report may be\
      \ obtained for engagement/contracting purposes, in a document consisting solely\
      \ of that disclosure (15 U.S.C. § 1681b(b)(2)(A)(i)).\n2. **Obtain written authorization**\
      \ from the contractor before procuring the report (15 U.S.C. § 1681b(b)(2)(A)(ii)).\n\
      3. **Certify permissible purpose** to the CRA (15 U.S.C. § 1681b(f)).\n4. **Send\
      \ a pre-adverse-action notice** before any final denial, suspension, or material\
      \ payout restriction based on the report, including:\n   - a copy of the consumer\
      \ report, and\n   - the CFPB \"Summary of Your Rights Under the FCRA\" (15 U.S.C.\
      \ § 1681b(b)(3)(A)).\n5. **Allow a reasonable period** for the contractor to\
      \ dispute the report before final action (the FTC/CFPB guidance contemplates\
      \ a reasonable waiting period; state law may impose a specific minimum).\n\n\
      ---\n\n## 4. Adverse-action notice (after the decision)\n\nAfter the platform\
      \ takes adverse action based in whole or in part on the report, it must provide\
      \ a final **adverse-action notice** that includes:\n\n- the name, address, and\
      \ phone number of the CRA that furnished the report;\n- a statement that the\
      \ CRA did not make the decision and cannot give the reasons for it;\n- notice\
      \ of the right to obtain a free copy of the report within 60 days; and\n- notice\
      \ of the right to dispute the accuracy or completeness of the report with the\
      \ CRA (15 U.S.C. § 1681b(b)(3)(B)).\n\n"
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '**Definitional caution.** '
    change_id: CHG-20260903-1a0bf6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '"Adverse action" '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: in
    change_id: CHG-20260903-2e462e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: under
    change_id: CHG-20260903-2e462e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: this
    change_id: CHG-20260903-4feb6c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: FCRA
    change_id: CHG-20260903-4feb6c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: context
    change_id: CHG-20260903-a4e0e7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: expressly
    change_id: CHG-20260903-a4e0e7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' includes'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: ' a denial or cancellation of, or an increase in the charge for, credit
      or insurance, and'
    change_id: CHG-20260903-69d15c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ', for employment purposes, a denial of employment or any other decision
      for employment purposes that adversely affects any current or prospective employee
      (15 U.S.C. § 1681a(k)(1)(B)). Whether a payout hold or block for an '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '**'
    change_id: CHG-20260903-fb013a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: independent contractor
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '**'
    change_id: CHG-20260903-b7ca91
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' constitutes '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '"'
    change_id: CHG-20260903-1a5ad8
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: adverse action
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '"'
    change_id: CHG-20260903-e97c8d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' is a fact-specific question that depends on how the decision is framed
      and who makes it'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: . Do not assume the FCRA adverse-action label attaches to every payout hold;
      conversely, do not assume it never attaches. The safer posture is to treat a
      screening-linked denial, suspension, or material payout restriction as adverse
      action and run the full notice and dispute workflow, because the cost of over-noticing
      is low and the cost of under-noticing (statutory damages, class exposure) is
      high
    change_id: CHG-20260903-683f98
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.


      ---


      ## 5. Dispute and reinvestigation rights


      The contractor has the right to dispute the accuracy or completeness of the
      report with the CRA. The CRA must conduct a reasonable reinvestigation, generally
      within 30 days (with limited extension), and correct or delete inaccurate or
      unverifiable information (15 U.S.C. § 1681i). The product must therefore:


      - provide a visible contractor-facing dispute path;

      - pause final adverse action while a timely dispute is under reinvestigation;

      - require the vendor to reinvestigate and correct errors within defined SLAs;

      - provide an escalation path for mixed files, identity mismatches, expunged/sealed
      records, and incorrect sanctions matches; and

      - deliver a final written outcome after reinvestigation.


      ---


      ## 6. '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'EEOC disparate-impact and individualized-assessment overlay (criminal history)


      FCRA governs the *procedure* of using a consumer report; it does not answer
      whether the underlying criminal-history screen is lawful. That is governed separately
      by Title VII disparate-impact principles (EEOC 2012 Enforcement Guidance on
      Consideration of Arrest and Conviction Records) and, where applicable, state
      fair-chance law. The two regimes run in parallel and both must be satisfied.


      **Core principles:**

      - A neutral criminal-history policy that disproportionately screens out a protected
      group is unlawful unless it is **job-related and consistent with business necessity**.

      - **Arrests vs. convictions:** an arrest alone does not establish criminal conduct
      and should not be the basis for exclusion; a conviction is more reliable but
      still requires analysis. If the vendor''s "fail" result can be triggered by
      an arrest record only, the screen is very difficult to defend and should be
      reconfigured before launch.

      - **Blanket exclusions are disfavored.** Excluding all persons with any criminal
      record, or broad offense categories, is the highest-risk pattern.

      - Business necessity can be shown either by a **validation study** (rarely practical
      at launch) or by a **targeted screen plus individualized assessment** that considers
      at least (a) the nature and gravity of the offense, (b) the time elapsed since
      the offense or completion of sentence, and (c) the nature of the job/contract
      work — with notice and an opportunity for the screened-out individual to respond.


      **Application here:**

      - The **platform** is the likely "employer" equivalent: it selects and onboards
      contractors, sets the screening criteria, and receives the clear/review/fail
      result. It bears the primary disparate-impact risk and must run individualized
      assessment for every "review" and "fail" exclusion.

      - **Delivery work** (access to customers'' homes, vehicles, and goods) supports
      a stronger business-necessity argument for some screening than remote work,
      but it does not justify blanket exclusions. The screen must be targeted to offenses
      that actually predict delivery risk (e.g., violent offenses, theft, DUI for
      driving roles).

      - Treating "fail" as automatic exclusion without individualized assessment is
      the highest-risk pattern. If "review" triggers a human look but "fail" does
      not, the process is still vulnerable.

      - **Mosaic Relay''s exposure is secondary but real.** If Mosaic Relay receives
      full criminal-history data or makes payout decisions based on screening results,
      it could be characterized as a joint decision-maker or as using consumer reports
      for an impermissible purpose. The current design — Mosaic Relay receives only
      status codes — is the right risk posture.


      ---


      ## 7. '
    change_id: CHG-20260903-fe3e1a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: 'Role allocation: keeping Mosaic Relay out of the decision chain


      The safest structure is that the **platform is the sole decision-maker** and
      owns the disclosure, authorization, pre-adverse and adverse-action notices'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', individualized assessment'
    change_id: CHG-20260903-731ddb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ', and disputes. Mosaic Relay should:


      - receive only the minimum status code and decision metadata needed for payout
      operations;

      - not receive full criminal, identity, sanctions-detail, or work-eligibility
      report content absent documented legal review;

      - not auto-convert "review" to denial — "review" must route to a human or platform-controlled
      workflow;

      - apply any payout hold only under a documented, reversible, time-bound, logged
      rule tied to a documented trigger; and

      - include a kill switch to disable screening-linked payout holds by state, customer,
      or report type.


      If Mosaic Relay''s system automatically denies payout on "fail," its role risk
      rises sharply and it may be treated as participating in an adverse decision
      without the required notices'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: ' and'
    change_id: CHG-20260903-ee74ed
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260903-ee74ed
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' dispute pause'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', or individualized assessment'
    change_id: CHG-20260903-540ca6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.


      ---


      ## '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: '7'
    change_id: CHG-20260903-1e2f7e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: '8'
    change_id: CHG-20260903-1e2f7e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '. State-law overlay (launch dependency)


      State and local law can impose additional or stricter requirements, including:


      - ban-the-box and fair-chance rules restricting when criminal history may be
      requested'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' (some, e.g., New York City''s and California''s Fair Chance Acts, explicitly
      cover independent contractors)'
    change_id: CHG-20260903-6d1ff0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ';

      - individualized-assessment requirements;

      - longer notice and waiting periods;

      - restrictions on permissible report contents'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' and lookback periods'
    change_id: CHG-20260903-480477
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ';

      - dispute and reinvestigation SLAs;

      - language and accessibility requirements; and

      - pay-to-screen restrictions.


      Because launch states are unknown, the state matrix is a **launch dependency**,
      not a nice-to-have. Product must block screening or payout in any launch state
      where the required notices, waiting periods, or state configuration are missing.


      ---


      ## '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: '8'
    change_id: CHG-20260903-aceb4a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: '9'
    change_id: CHG-20260903-aceb4a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '. Recommended requirements for launch


      ### Product behavior

      - Mosaic Relay receives only the minimum status code and decision metadata needed
      for payout operations.

      - No full report content flows to Mosaic Relay absent documented legal review.

      - "Review" cannot auto-convert to denial; it routes to a human or platform-controlled
      workflow.

      - Any payout hold is reversible, time-bound, logged, and tied to a documented
      trigger.

      - Block screening or payout in any launch state where required configuration
      is missing.

      - Include a kill switch for screening-linked payout holds.

      - Distinguish identity verification, sanctions screening, criminal-history screening,
      and work-eligibility screening in contractor-facing UX'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '.

      - Do not let a "fail" result based on arrest records alone drive exclusion;
      reconfigure the screen to convictions or targeted offense categories before
      launch'
    change_id: CHG-20260903-6f2a10
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.


      ### Consent language

      - Clear, standalone contractor disclosure that a consumer report may be obtained
      for engagement/contracting purposes.

      - Separate written authorization before the report is obtained.

      - Identify the platform as requester and decision-maker; name the screening
      vendor where required; explain categories of checks in plain language.

      - Do not bury consent in general terms of service.

      - Insert state-specific text where required (investigative consumer reports,
      criminal-history checks).


      ### Notices

      - Pre-adverse-action notice before any final denial, suspension, or material
      payout restriction.

      - Pre-adverse package includes the report and the FCRA rights summary.

      - Reasonable waiting period before final action, with state-specific timing
      where stricter.

      - Final adverse-action notice with CRA contact details, the statement that the
      CRA did not make the decision, the right to a free report within 60 days, and
      the right to dispute.

      - Contractor-facing notice explaining whether payout is delayed, released, or
      blocked, and whom to contact.'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '

      - Individualized-assessment notice to any contractor screened out on criminal
      history, with an opportunity to respond with evidence of rehabilitation, mitigating
      circumstances, or inaccuracy before a final decision.'
    change_id: CHG-20260903-a6ab6f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '


      ### Dispute rights

      - Visible contractor dispute path.

      - Pause on final adverse action during a timely reinvestigation.

      - Vendor obligation to reinvestigate and correct errors within defined SLAs.

      - Escalation path for mixed files, identity mismatches, expunged/sealed records,
      and incorrect sanctions matches.

      - Final written outcome after reinvestigation.


      ### Access controls

      - Least-privilege access to screening data.

      - Field-level separation between report content and payout operations.

      - No Mosaic Relay access to full reports by default.

      - Audit logs for every access, status change, hold, release, and override.

      - Encryption in transit and at rest.

      - Tenant isolation between platform customers.

      - Defined retention and deletion schedule.

      - Incident-response playbook for vendor data exposure or incorrect report transmission.


      ### Customer contract terms

      - Platform is the sole decision-maker for contractor eligibility and any adverse
      action.

      - Platform certifies permissible purpose and FCRA compliance.

      - Platform owns disclosure, authorization, pre-adverse and adverse-action notices, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'individualized assessment, '
    change_id: CHG-20260903-550af6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: 'and disputes unless expressly shifted in writing.

      - Vendor flow-downs requiring CRA compliance, reinvestigation duties, security
      controls, deletion, audit rights, and incident notice.

      - No secondary use of contractor data by Mosaic Relay or the vendor.

      - Indemnity and insurance allocation for screening errors, unlawful use, and
      data breaches.

      - Regulatory cooperation and audit rights.

      - Clear suspension/termination rights for compliance failures.


      ---


      ## '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: '9'
    change_id: CHG-20260903-aadf19
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: insert
    text: '10'
    change_id: CHG-20260903-aadf19
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '. Last-mile verification before launch


      - Obtain the vendor API schema and report catalog (each report, data source,
      match logic, sanctions list, work-eligibility source, retention period, geographic
      coverage).

      - Confirm in writing whether the vendor is a CRA and whether each report is
      a consumer report.

      - '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'Confirm what criminal-history data the vendor returns (arrests vs. convictions,
      lookback period, offense categories) and whether the vendor offers an individualized-assessment
      module.

      - '
    change_id: CHG-20260903-38b8df
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: 'Fix the launch-state list and build the state-by-state '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'fair-chance '
    change_id: CHG-20260903-751cc6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: matrix
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' covering independent contractors'
    change_id: CHG-20260903-f396ad
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.

      - Confirm the exact payout behavior for "review" and "fail," including whether
      any automated rule delays or blocks funds'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '.

      - Require the platform to document its screening criteria (which offenses, which
      lookbacks, how they map to delivery-contractor risk) and to certify individualized
      assessment for all exclusions'
    change_id: CHG-20260903-fc169c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.

      - Review the platform agreement, vendor agreement, DPA, security exhibit, and
      contractor-facing consent/notice package.


      ---


      ## What would change this


      - **Working assumption:** I assumed the vendor''s criminal-history and related
      background checks are likely FCRA consumer reports and that the platform is
      the likely user/decision-maker. If the vendor is not a CRA or the platform is
      not the user, the federal notice architecture changes materially.

      - **Open fork:** If Mosaic Relay only passes through a status code versus if
      it applies its own payout-denial rule, the answer splits. In the first case
      Mosaic Relay can stay mostly operational; in the second it may become entangled
      in adverse-action'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ', consumer-report-use,'
    change_id: CHG-20260903-98b6e2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ' and discrimination exposure.

      - **Open fork:** If launch states include strict fair-chance jurisdictions'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' that explicitly cover independent contractors (e.g., New York City, California)'
    change_id: CHG-20260903-803ecb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: ', the product may need delayed screening, individualized assessment, and
      longer waiting periods; if launch is limited to lighter-touch states, the workflow
      may be simpler'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: '.

      - **Open fork:** Whether the vendor''s "fail" result is based on convictions
      only or includes arrests. If arrests are included, the screen is very difficult
      to defend under EEOC guidance and should be reconfigured before launch'
    change_id: CHG-20260903-b098e9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: '.

      - **Not examined:** I did not review the vendor agreement, API schema, sample
      report, contractor consent flow, platform terms, DPA, or any state-specific
      launch matrix because none were in the vault materials provided.

      - **Not examined:** I did not verify current FCRA statute text, CFPB model forms,
      FTC guidance, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'EEOC guidance, '
    change_id: CHG-20260903-84fb85
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: 'or state statutes from external sources in this turn; no external authority
      was retrieved (the research run timed out on external search).

      - **Working assumption:** I assumed the contractors remain independent contractors
      in all launch states. If any are treated as employees, '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'Title VII applies directly and '
    change_id: CHG-20260903-acd382
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-03T16:23:30+00:00'
  - kind: equal
    text: 'the employment-law and discrimination analysis becomes more direct and
      may add jurisdiction-specific hiring-screen rules.

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
  last_proposed_at: '2026-09-03T16:23:30+00:00'
last_source_action_key: chat:RUN-20260903-4dd7c1:tool:efe6c5216dd81b090d15a421
---
# FCRA Adverse-Action Notice Requirements for Consumer-Report Users

**Matter:** Mosaic Relay UX Test — 02 — Contractor Background-Check Integration
**Draft type:** Work product (regulatory analysis)
**Status:** Draft for review — grounded in the saved partial research packet (first-pass, model-only; no external authority retrieved)

---

## 1. Purpose and scope

This draft addresses the FCRA adverse-action notice obligations that attach when a consumer report is used to make an engagement or payout decision, and the overlapping EEOC disparate-impact / individualized-assessment obligations that apply to criminal-history screening. It is written for the proposed flow in which a software platform screens delivery contractors (identity, criminal history, sanctions, work eligibility) through a background-check vendor and receives a "clear," "review," or "fail" result, while Mosaic Relay processes identity data and payout instructions.

The controlling questions are: **who is the FCRA "user" of the consumer report, what must that user do before and after taking adverse action based on the report, and how does the criminal-history screen avoid disparate-impact liability?**

---

## 2. Threshold: is this an FCRA consumer report, and who is the user?

The FCRA adverse-action architecture only applies if the vendor's output is a **consumer report** and the party acting on it is a **user** taking adverse action based **in whole or in part** on that report.

- A **consumer report** is any written, oral, or other communication of information bearing on a consumer's creditworthiness, character, general reputation, personal characteristics, or mode of living that is used or expected to be used for a permissible purpose (15 U.S.C. § 1681a(d)). Criminal-history, identity, and work-eligibility screening assembled by a third party for an engagement decision can fall within this definition.
- A **consumer reporting agency (CRA)** is a person that, on a regular basis, assembles or evaluates consumer credit or other information for the purpose of furnishing consumer reports to third parties (15 U.S.C. § 1681a(f)). Whether the vendor is a CRA for these searches is a fact to confirm in writing with the vendor.
- The **user** is the party that obtains the report for a permissible purpose and uses it to make a decision. In this flow, the platform is the natural user and decision-maker; Mosaic Relay should not become a co-user by operationalizing a denial.

**Material open fact:** whether the reports are consumer reports and whether the vendor is a CRA. If they are not, the federal adverse-action burden narrows, though state law, privacy, and disparate-impact obligations remain.

---

## 3. Pre-adverse-action obligations (before the decision)

If the platform is the user, it must, **before** taking any adverse action based in whole or in part on the report:

1. **Provide a clear and conspicuous standalone disclosure** that a consumer report may be obtained for engagement/contracting purposes, in a document consisting solely of that disclosure (15 U.S.C. § 1681b(b)(2)(A)(i)).
2. **Obtain written authorization** from the contractor before procuring the report (15 U.S.C. § 1681b(b)(2)(A)(ii)).
3. **Certify permissible purpose** to the CRA (15 U.S.C. § 1681b(f)).
4. **Send a pre-adverse-action notice** before any final denial, suspension, or material payout restriction based on the report, including:
   - a copy of the consumer report, and
   - the CFPB "Summary of Your Rights Under the FCRA" (15 U.S.C. § 1681b(b)(3)(A)).
5. **Allow a reasonable period** for the contractor to dispute the report before final action (the FTC/CFPB guidance contemplates a reasonable waiting period; state law may impose a specific minimum).

---

## 4. Adverse-action notice (after the decision)

After the platform takes adverse action based in whole or in part on the report, it must provide a final **adverse-action notice** that includes:

- the name, address, and phone number of the CRA that furnished the report;
- a statement that the CRA did not make the decision and cannot give the reasons for it;
- notice of the right to obtain a free copy of the report within 60 days; and
- notice of the right to dispute the accuracy or completeness of the report with the CRA (15 U.S.C. § 1681b(b)(3)(B)).

**Definitional caution.** "Adverse action" under FCRA expressly includes, for employment purposes, a denial of employment or any other decision for employment purposes that adversely affects any current or prospective employee (15 U.S.C. § 1681a(k)(1)(B)). Whether a payout hold or block for an **independent contractor** constitutes "adverse action" is a fact-specific question that depends on how the decision is framed and who makes it. Do not assume the FCRA adverse-action label attaches to every payout hold; conversely, do not assume it never attaches. The safer posture is to treat a screening-linked denial, suspension, or material payout restriction as adverse action and run the full notice and dispute workflow, because the cost of over-noticing is low and the cost of under-noticing (statutory damages, class exposure) is high.

---

## 5. Dispute and reinvestigation rights

The contractor has the right to dispute the accuracy or completeness of the report with the CRA. The CRA must conduct a reasonable reinvestigation, generally within 30 days (with limited extension), and correct or delete inaccurate or unverifiable information (15 U.S.C. § 1681i). The product must therefore:

- provide a visible contractor-facing dispute path;
- pause final adverse action while a timely dispute is under reinvestigation;
- require the vendor to reinvestigate and correct errors within defined SLAs;
- provide an escalation path for mixed files, identity mismatches, expunged/sealed records, and incorrect sanctions matches; and
- deliver a final written outcome after reinvestigation.

---

## 6. EEOC disparate-impact and individualized-assessment overlay (criminal history)

FCRA governs the *procedure* of using a consumer report; it does not answer whether the underlying criminal-history screen is lawful. That is governed separately by Title VII disparate-impact principles (EEOC 2012 Enforcement Guidance on Consideration of Arrest and Conviction Records) and, where applicable, state fair-chance law. The two regimes run in parallel and both must be satisfied.

**Core principles:**
- A neutral criminal-history policy that disproportionately screens out a protected group is unlawful unless it is **job-related and consistent with business necessity**.
- **Arrests vs. convictions:** an arrest alone does not establish criminal conduct and should not be the basis for exclusion; a conviction is more reliable but still requires analysis. If the vendor's "fail" result can be triggered by an arrest record only, the screen is very difficult to defend and should be reconfigured before launch.
- **Blanket exclusions are disfavored.** Excluding all persons with any criminal record, or broad offense categories, is the highest-risk pattern.
- Business necessity can be shown either by a **validation study** (rarely practical at launch) or by a **targeted screen plus individualized assessment** that considers at least (a) the nature and gravity of the offense, (b) the time elapsed since the offense or completion of sentence, and (c) the nature of the job/contract work — with notice and an opportunity for the screened-out individual to respond.

**Application here:**
- The **platform** is the likely "employer" equivalent: it selects and onboards contractors, sets the screening criteria, and receives the clear/review/fail result. It bears the primary disparate-impact risk and must run individualized assessment for every "review" and "fail" exclusion.
- **Delivery work** (access to customers' homes, vehicles, and goods) supports a stronger business-necessity argument for some screening than remote work, but it does not justify blanket exclusions. The screen must be targeted to offenses that actually predict delivery risk (e.g., violent offenses, theft, DUI for driving roles).
- Treating "fail" as automatic exclusion without individualized assessment is the highest-risk pattern. If "review" triggers a human look but "fail" does not, the process is still vulnerable.
- **Mosaic Relay's exposure is secondary but real.** If Mosaic Relay receives full criminal-history data or makes payout decisions based on screening results, it could be characterized as a joint decision-maker or as using consumer reports for an impermissible purpose. The current design — Mosaic Relay receives only status codes — is the right risk posture.

---

## 7. Role allocation: keeping Mosaic Relay out of the decision chain

The safest structure is that the **platform is the sole decision-maker** and owns the disclosure, authorization, pre-adverse and adverse-action notices, individualized assessment, and disputes. Mosaic Relay should:

- receive only the minimum status code and decision metadata needed for payout operations;
- not receive full criminal, identity, sanctions-detail, or work-eligibility report content absent documented legal review;
- not auto-convert "review" to denial — "review" must route to a human or platform-controlled workflow;
- apply any payout hold only under a documented, reversible, time-bound, logged rule tied to a documented trigger; and
- include a kill switch to disable screening-linked payout holds by state, customer, or report type.

If Mosaic Relay's system automatically denies payout on "fail," its role risk rises sharply and it may be treated as participating in an adverse decision without the required notices, dispute pause, or individualized assessment.

---

## 8. State-law overlay (launch dependency)

State and local law can impose additional or stricter requirements, including:

- ban-the-box and fair-chance rules restricting when criminal history may be requested (some, e.g., New York City's and California's Fair Chance Acts, explicitly cover independent contractors);
- individualized-assessment requirements;
- longer notice and waiting periods;
- restrictions on permissible report contents and lookback periods;
- dispute and reinvestigation SLAs;
- language and accessibility requirements; and
- pay-to-screen restrictions.

Because launch states are unknown, the state matrix is a **launch dependency**, not a nice-to-have. Product must block screening or payout in any launch state where the required notices, waiting periods, or state configuration are missing.

---

## 9. Recommended requirements for launch

### Product behavior
- Mosaic Relay receives only the minimum status code and decision metadata needed for payout operations.
- No full report content flows to Mosaic Relay absent documented legal review.
- "Review" cannot auto-convert to denial; it routes to a human or platform-controlled workflow.
- Any payout hold is reversible, time-bound, logged, and tied to a documented trigger.
- Block screening or payout in any launch state where required configuration is missing.
- Include a kill switch for screening-linked payout holds.
- Distinguish identity verification, sanctions screening, criminal-history screening, and work-eligibility screening in contractor-facing UX.
- Do not let a "fail" result based on arrest records alone drive exclusion; reconfigure the screen to convictions or targeted offense categories before launch.

### Consent language
- Clear, standalone contractor disclosure that a consumer report may be obtained for engagement/contracting purposes.
- Separate written authorization before the report is obtained.
- Identify the platform as requester and decision-maker; name the screening vendor where required; explain categories of checks in plain language.
- Do not bury consent in general terms of service.
- Insert state-specific text where required (investigative consumer reports, criminal-history checks).

### Notices
- Pre-adverse-action notice before any final denial, suspension, or material payout restriction.
- Pre-adverse package includes the report and the FCRA rights summary.
- Reasonable waiting period before final action, with state-specific timing where stricter.
- Final adverse-action notice with CRA contact details, the statement that the CRA did not make the decision, the right to a free report within 60 days, and the right to dispute.
- Contractor-facing notice explaining whether payout is delayed, released, or blocked, and whom to contact.
- Individualized-assessment notice to any contractor screened out on criminal history, with an opportunity to respond with evidence of rehabilitation, mitigating circumstances, or inaccuracy before a final decision.

### Dispute rights
- Visible contractor dispute path.
- Pause on final adverse action during a timely reinvestigation.
- Vendor obligation to reinvestigate and correct errors within defined SLAs.
- Escalation path for mixed files, identity mismatches, expunged/sealed records, and incorrect sanctions matches.
- Final written outcome after reinvestigation.

### Access controls
- Least-privilege access to screening data.
- Field-level separation between report content and payout operations.
- No Mosaic Relay access to full reports by default.
- Audit logs for every access, status change, hold, release, and override.
- Encryption in transit and at rest.
- Tenant isolation between platform customers.
- Defined retention and deletion schedule.
- Incident-response playbook for vendor data exposure or incorrect report transmission.

### Customer contract terms
- Platform is the sole decision-maker for contractor eligibility and any adverse action.
- Platform certifies permissible purpose and FCRA compliance.
- Platform owns disclosure, authorization, pre-adverse and adverse-action notices, individualized assessment, and disputes unless expressly shifted in writing.
- Vendor flow-downs requiring CRA compliance, reinvestigation duties, security controls, deletion, audit rights, and incident notice.
- No secondary use of contractor data by Mosaic Relay or the vendor.
- Indemnity and insurance allocation for screening errors, unlawful use, and data breaches.
- Regulatory cooperation and audit rights.
- Clear suspension/termination rights for compliance failures.

---

## 10. Last-mile verification before launch

- Obtain the vendor API schema and report catalog (each report, data source, match logic, sanctions list, work-eligibility source, retention period, geographic coverage).
- Confirm in writing whether the vendor is a CRA and whether each report is a consumer report.
- Confirm what criminal-history data the vendor returns (arrests vs. convictions, lookback period, offense categories) and whether the vendor offers an individualized-assessment module.
- Fix the launch-state list and build the state-by-state fair-chance matrix covering independent contractors.
- Confirm the exact payout behavior for "review" and "fail," including whether any automated rule delays or blocks funds.
- Require the platform to document its screening criteria (which offenses, which lookbacks, how they map to delivery-contractor risk) and to certify individualized assessment for all exclusions.
- Review the platform agreement, vendor agreement, DPA, security exhibit, and contractor-facing consent/notice package.

---

## What would change this

- **Working assumption:** I assumed the vendor's criminal-history and related background checks are likely FCRA consumer reports and that the platform is the likely user/decision-maker. If the vendor is not a CRA or the platform is not the user, the federal notice architecture changes materially.
- **Open fork:** If Mosaic Relay only passes through a status code versus if it applies its own payout-denial rule, the answer splits. In the first case Mosaic Relay can stay mostly operational; in the second it may become entangled in adverse-action, consumer-report-use, and discrimination exposure.
- **Open fork:** If launch states include strict fair-chance jurisdictions that explicitly cover independent contractors (e.g., New York City, California), the product may need delayed screening, individualized assessment, and longer waiting periods; if launch is limited to lighter-touch states, the workflow may be simpler.
- **Open fork:** Whether the vendor's "fail" result is based on convictions only or includes arrests. If arrests are included, the screen is very difficult to defend under EEOC guidance and should be reconfigured before launch.
- **Not examined:** I did not review the vendor agreement, API schema, sample report, contractor consent flow, platform terms, DPA, or any state-specific launch matrix because none were in the vault materials provided.
- **Not examined:** I did not verify current FCRA statute text, CFPB model forms, FTC guidance, EEOC guidance, or state statutes from external sources in this turn; no external authority was retrieved (the research run timed out on external search).
- **Working assumption:** I assumed the contractors remain independent contractors in all launch states. If any are treated as employees, Title VII applies directly and the employment-law and discrimination analysis becomes more direct and may add jurisdiction-specific hiring-screen rules.
