---
work_product_id: WP-fdd16ac1bba6
matter_id: MAT-20260902-5fa39d
title: Mosaic Relay UX Test — 08 — Sanctions Screening During Recipient Payouts response
record_type: work_product
state: draft
summary: ''
created_at: '2026-09-02T16:03:13+00:00'
updated_at: '2026-09-02T16:06:14+00:00'
immutable: false
source_action_key: chat-save:MAT-20260902-5fa39d:MSG-20260902-b9bfbf
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
review:
  segments:
  - kind: delete
    text: Intake
    change_id: CHG-20260902-7208e9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '# Legal Response — Sanctions Screening During Recipient Payouts


      **Matter:** Mosaic Relay UX Test — 08 — Sanctions Screening During Recipient
      Payouts

      **Prepared for:** Product (with Compliance and Legal review)

      **Status:** Draft for review — best-effort analysis based on first-pass research.
      External authority retrieval was unavailable for this run; the analysis below'
    change_id: CHG-20260902-7208e9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' is '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: complete
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: 'model-only and must be verified against current primary sources and local
      counsel before reliance.


      ---


      ## Executive summary


      Mosaic Relay proposes to screen every payout recipient against sanctions and
      restricted-party lists at onboarding, before each payout, and when lists update;
      potential matches would queue for manual review, and confirmed matches would
      stop the payout and restrict the account. This is a sound, risk-aware design
      and is broadly consistent with how payment providers approach sanctions compliance.
      However, the legal obligations that attach to it — screening scope, blocking
      versus rejection, reporting and record retention, communications, and anti-discrimination
      controls — depend heavily on facts that are not yet defined, most importantly
      the countries and currencies served'
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260902-ee95eb
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: ' and'
      change_id: CHG-20260902-035d14
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: ' and'
  - kind: insert
    text: ' the lists used'
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ', and where the funds sit in the payment chain'
    change_id: CHG-20260902-dbdfd1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.


      This response addresses the five requested areas, flags the assumptions on which
      the analysis rests, and identifies the gaps that must be closed before launch.
      It is a legal analysis and recommendation, not a recorded decision. Nothing
      here should be treated as an approved course of action until the open questions
      are resolved and the analysis is verified.


      ---


      ## 1. Required screening scope


      **Analysis.** Whether pre-release screening of every recipient is *legally required*
      versus *best practice* depends on which sanctions regimes apply to Mosaic Relay
      and to each payout. The two regimes most likely to matter given Mosaic Relay''s
      stated footprint (North America and Europe) are U.S. OFAC and EU sanctions,
      but the analysis is jurisdiction-specific.


      - **U.S. (OFAC).** OFAC does not prescribe a single mandatory screening frequency
      or methodology for all entities. The obligation is to avoid engaging in prohibited
      transactions with blocked persons (e.g., SDNs) and to block or reject as required.
      In practice, pre-transaction screening of parties is the standard, expected
      control for payment providers, and OFAC treats the adequacy of a compliance
      program as a mitigating factor in enforcement. Screening at onboarding, before
      each payout, and on list updates is a reasonable and defensible risk-based design.

      - **EU.** EU sanctions regulations prohibit making funds or economic resources
      available, directly or indirectly, to or for the benefit of designated persons.
      Screening against the EU consolidated list is the expected control for entities
      operating in the EU or serving EU customers. The proposed cadence is consistent
      with this expectation.

      - **Other regimes.** Depending on the countries and currencies served, UK, UN,
      and local regimes may also apply and may impose their own screening expectations.'
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' If payouts reach recipients in comprehensively sanctioned jurisdictions
      (e.g., Iran, North Korea, Cuba, Syria, the Crimea region), the analysis shifts
      from list-matching to stricter country-based prohibitions.'
    change_id: CHG-20260902-db6e05
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '


      **Bottom line.** Screening every recipient before release is not merely defensible
      — it is the prudent baseline for a payment provider with a U.S./EU nexus. The
      open question is not *whether* to screen but *which lists and which jurisdictions*
      the program must cover, and how to handle payouts that touch multiple regimes
      with potentially conflicting obligations.


      **Assumptions and gaps.**

      - **Assumption:** Mosaic Relay has a U.S. and/or EU nexus (U.S. dollar or euro
      clearing, U.S./EU persons, or U.S./EU customers), making OFAC and EU regimes
      applicable. This is unverified.

      - **Gap:** Countries and currencies served are not defined. This is the single
      most important missing fact; it determines which regimes and lists apply.

      - **Gap:** The specific lists to be used (OFAC SDN, EU consolidated list, UN
      lists, sectoral lists, etc.) are not identified.


      ---


      ## 2. Blocking and rejection duties


      **Analysis.** When a match is confirmed, the required action differs by regime
      and by the nature of the transaction:


      - **Blocking (freezing).** Where the transaction involves property or an interest
      in property of a blocked person (e.g., an SDN), U.S. persons must block the
      transaction and hold the funds in a '
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: segregated
    change_id: CHG-20260902-0ec263
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: blocked
      change_id: CHG-20260902-035d14
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: blocked
  - kind: insert
    text: ', interest-bearing'
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' blocked'
    change_id: CHG-20260902-5a59f0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: ' account; the funds cannot be released without OFAC authorization. Under
      EU rules, funds and economic resources of designated persons must be frozen,
      and none may be made available to or for their benefit.

      - **Rejection.** Some transactions must be *rejected* rather than blocked —
      for example, certain sectoral-sanctions scenarios or transactions that are prohibited
      but do not involve blocked property. '
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: 'In a rejection, funds are typically returned to the sender rather than
      frozen. '
    change_id: CHG-20260902-6950b5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: The distinction matters because it changes what Mosaic Relay must do
    change_id: CHG-20260902-035d14
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' with the '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: current
    change_id: CHG-20260902-18c9c5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: funds
    change_id: CHG-20260902-18c9c5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: assumptions
    change_id: CHG-20260902-58e53a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: and what it must report
    change_id: CHG-20260902-58e53a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '.

      - **Where the funds sit is critical.** Mosaic Relay is not a bank and does not
      hold deposits. The mechanics of "blocking" therefore depend on where the funds
      sit in the payment chain — Mosaic Relay''s own settlement account, a partner
      bank''s account, or in transit. The blocking obligation may fall on the financial
      institution holding the funds, with Mosaic Relay bearing a duty to identify,
      escalate, and not facilitate the prohibited transaction. This means Mosaic Relay''s
      role may be primarily a screening-and-escalation layer, with the actual freeze
      executed by the partner bank. That allocation must be confirmed and documented
      in partner contracts'
    change_id: CHG-20260902-05e381
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.

      - **Strict liability (U.S.).** OFAC civil penalties operate on a strict-liability
      basis. Even inadvertent violations can draw enforcement, though a robust compliance
      program is a mitigating factor. EU standards generally require some degree of
      knowledge or negligence, but this varies by member state.


      **Bottom line.** Mosaic Relay needs a documented procedure that distinguishes
      *block* from *reject*'
    change_id: CHG-20260902-58e53a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ','
    change_id: CHG-20260902-2a359f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: ' and'
      change_id: CHG-20260902-58e53a
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: ' and'
  - kind: insert
    text: ' specifies what happens to funds in each case'
    change_id: CHG-20260902-58e53a
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ', and allocates responsibility between Mosaic Relay and its partner banks'
    change_id: CHG-20260902-a26378
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: equal
    text: '. The '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: saved
    change_id: CHG-20260902-ce1689
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: current
    change_id: CHG-20260902-ce1689
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: facts
    change_id: CHG-20260902-64b32b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: design (stop the payout
    change_id: CHG-20260902-64b32b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' and '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: open
    change_id: CHG-20260902-3cb69f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: restrict
    change_id: CHG-20260902-3cb69f
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: questions
    change_id: CHG-20260902-726ab6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260902-726ab6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: remain
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: 'account on a confirmed match) is directionally correct but must be paired
      with a defined funds-handling rule '
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: and a clear division of duties with the institutions that actually
    change_id: CHG-20260902-823405
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: —
      change_id: CHG-20260902-8e540e
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: —
  - kind: insert
    text: ' hold '
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: the
    change_id: CHG-20260902-20c3ae
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: in
      change_id: CHG-20260902-8e540e
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: in
  - kind: insert
    text: ' '
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: funds
    change_id: CHG-20260902-85e4f5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: a blocked account, return to sender, or hold in suspense — because that
        choice drives reporting and record-keeping
      change_id: CHG-20260902-8e540e
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: a blocked account, return to sender, or hold in suspense — because
      that choice drives reporting and record-keeping
  - kind: insert
    text: '.


      **Assumptions and gaps.**

      - **Assumption:** A confirmed match will generally involve blocked property
      requiring a freeze. This is not always true; some matches will require rejection
      instead'
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '.

      - **Assumption:** The blocking obligation may fall on partner banks rather than
      Mosaic Relay, depending on where funds sit. Unverified and fact-dependent'
    change_id: CHG-20260902-a58ef4
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.

      - **Gap:** How Mosaic Relay will handle funds while a payout is in review or
      blocked is not defined (hold in suspense, return to sender, block in place).

      - **Gap:** Escalation deadlines for manual review are not set'
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '.

      - **Gap:** The contractual allocation of blocking/reporting duties with partner
      banks is not established'
    change_id: CHG-20260902-b0e8df
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.


      ---


      ## 3. Reporting and record retention


      **Analysis.** Confirmed matches trigger reporting and record-keeping duties
      that vary by regime:


      - **U.S. (OFAC).** Blocked property must generally be reported to OFAC within
      10 business days via a blocked-property report, with annual reporting of blocked
      property. Rejected transactions must be reported in certain circumstances. Records
      related to blocked property and rejected transactions are generally retained
      for at least five years.

      - **EU.** Member-state competent authorities must be notified of frozen funds
      and of any attempts to make funds'
    change_id: CHG-20260902-8e540e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' available'
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' to designated persons. Timelines and formats vary by member state. Records
      are generally retained for at least five years, though requirements vary.'
    change_id: CHG-20260902-6b9c73
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '

      - **AML overlap.** If a match also triggers AML concerns, separate suspicious-activity/transaction
      reporting (SARs/STRs) may be required under AML frameworks, with different deadlines
      and content requirements.

      - **Cross-border complexity.** If a payout crosses borders, multiple regimes
      may impose overlapping or conflicting reporting duties. The jurisdiction where
      funds are held, the sender''s jurisdiction, the recipient''s jurisdiction, and
      Mosaic Relay''s own operating jurisdictions may all be relevant.'
    change_id: CHG-20260902-fc6015
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '


      **Bottom line.** Mosaic Relay should design the screening control to capture
      and preserve the data needed to file blocked-property and rejected-transaction
      reports and to meet retention periods. The system should timestamp matches,
      record the basis for each decision, and retain the underlying evidence'
    change_id: CHG-20260902-6b9c73
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' — including the lists checked, the match score, the data compared, the
      action taken, copies of any reports filed, and any communications'
    change_id: CHG-20260902-faa686
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '. Because reporting deadlines are short (e.g., OFAC''s 10-business-day
      blocked-property report), the control should generate the necessary data automatically
      rather than relying on manual reconstruction.


      **Assumptions and gaps.**

      - **Assumption:** OFAC and EU reporting/retention figures above (10 business
      days; five years) reflect general knowledge and must be verified against current
      regulations.

      - **Gap:** Which reporting obligations apply to Mosaic Relay''s specific regimes
      is not decided.

      - **Gap:** Retention periods and storage requirements'
    change_id: CHG-20260902-6b9c73
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' for the '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: delete
    text: dossier
    change_id: CHG-20260902-b20ca7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: specific jurisdictions served are not confirmed.
    change_id: CHG-20260902-b20ca7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '

      - **Gap:** Whether SAR/STR obligations attach to any matches is not assessed.'
    change_id: CHG-20260902-419156
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '


      ---


      ## 4. Communications to affected parties


      **Analysis.** The product team''s plan to show recipients only that "additional
      review is required" is consistent with the anti-tipping-off concern that runs
      through both OFAC'
    change_id: CHG-20260902-b20ca7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: ' and '
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: 'EU regimes: disclosing match details could tip off a designated person
      and undermine enforcement. However, the wording and timing of communications
      must be managed carefully to balance three competing interests:


      1. **Avoiding tipping off / evasion.** Do not disclose the specific list, the
      match basis, or the fact that a sanctions match occurred.'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' In some jurisdictions, disclosing that a transaction has been reported
      to a sanctions or AML authority may itself be an offense.'
    change_id: CHG-20260902-74e21c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '

      2. **Fair treatment of legitimate recipients.** A neutral "additional review
      is required" message is appropriate for *potential* matches under review, but
      a recipient who is ultimately cleared should be released promptly and, where
      appropriate, informed that the review is complete.'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' Prolonged unexplained holds can create contractual, consumer-protection,
      and reputational risk even where the sanctions analysis is correct.'
    change_id: CHG-20260902-af540c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '

      3. **Transparency to merchants.** Whether merchants can receive match explanations
      for their recipients'' payouts is a separate decision. Restricting match detail
      to Compliance is the safer default; sharing it with merchants increases tipping-off
      and confidentiality risk and'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' could facilitate evasion if a merchant is complicit. Merchant access'
    change_id: CHG-20260902-55caa9
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: ' should be permitted only where legally required or clearly safe.


      **Bottom line.** The neutral "additional review is required" message is a reasonable
      approach for the review queue, but Mosaic Relay should not treat it as a permanent
      state. Approved templates should distinguish (a) under-review, (b) cleared,
      and (c) blocked/restricted, and should never disclose match specifics. Merchant
      access to match explanations should default to restricted unless a defined exception
      applies.


      **Assumptions and gaps.**

      - **Assumption:** The "additional review is required" message is permissible
      and does not itself constitute tipping off. This is a reasonable reading but
      should be confirmed against the specific regimes and any local guidance.

      - **Gap:** Whether merchants can receive match explanations is not decided.

      - **Gap:** Approved communications templates do not yet exist.


      ---


      ## 5. Controls against discriminatory or inconsistent treatment


      **Analysis.** Screening systems generate false positives, especially with incomplete
      data and transliterated names, and the risk of inconsistent or discriminatory
      treatment of legitimate recipients is real. Controls should include:


      - **Documented, objective match criteria.** Match-scoring thresholds should
      be set and documented, balancing false positives against false negatives, and
      tuned over time.

      - **Human review before blocking.** Potential matches should be escalated to
      trained compliance staff for review before any confirmed block, rather than
      auto-blocking on a raw score.

      - **A documented appeal and correction process.** Legitimate recipients flagged
      by screening need a clear path to correct false positives, with consistent evidence
      standards'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ', defined timelines,'
    change_id: CHG-20260902-f0706d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: ' and human review.

      - **Audit logs and consistency monitoring.** Every decision and the evidence
      relied upon should be logged. Decisions should be audited periodically for consistency,
      and false-positive rates should be monitored to detect patterns that could indicate
      discriminatory treatment on the basis of nationality, ethnicity, or other protected
      characteristics'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: . Screening logic should be tested periodically for disparate impact on
      particular nationalities, ethnicities, or name patterns
    change_id: CHG-20260902-b12d1e
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.

      - **Training.** Manual reviewers should be trained on objective criteria and
      on avoiding bias.

      - **Vendor management.** If Mosaic Relay uses a third-party screening vendor,
      it remains responsible for compliance. Contracts should address list coverage,
      update frequency, match logic, data security, and audit rights.


      **Bottom line.** The proposed design already includes the right skeleton (manual-review
      queue, confirmed-match blocking). The missing piece is the governance layer:
      documented thresholds, a human-review and appeal path, audit logs, and consistency
      monitoring. These controls are what convert a screening tool into a defensible
      compliance program and reduce both sanctions risk and discrimination risk.


      **Assumptions and gaps.**

      - **Assumption:** Mosaic Relay will use a third-party screening vendor. Unverified.

      - **Gap:** Match-scoring thresholds and escalation deadlines are not set.

      - **Gap:** The false-positive correction procedure is not defined (the product
      has indicated it needs a documented appeal and correction path with human review,
      consistent evidence standards, and audit logs).


      ---


      ## Assumptions, gaps, and unverified leads


      **Material assumptions (must be confirmed before reliance):**

      1. Mosaic Relay has a U.S. and/or EU nexus making OFAC and EU regimes applicable.

      2. Screening will cover OFAC SDN and EU consolidated lists at a minimum.

      3. A confirmed match will generally involve blocked property requiring a freeze
      (rather than rejection).

      4. '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: 'The blocking obligation may fall on partner banks rather than Mosaic Relay,
      depending on where funds sit.

      5. '
    change_id: CHG-20260902-b0f33c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: 'Mosaic Relay will use a third-party screening vendor.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '6'
    change_id: CHG-20260902-a0bab0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '5'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '5'
  - kind: insert
    text: '. The "additional review is required" message is permissible and does not
      constitute tipping off.


      **Gaps that must be closed before launch:**

      1. Countries and currencies served (drives which regimes and lists apply).

      2. Specific sanctions/restricted-party lists to be used.

      3. Match-scoring thresholds and escalation deadlines.

      4. Blocked-funds handling (hold in suspense, return to sender, block in place)'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' and where funds sit in the payment chain'
    change_id: CHG-20260902-716be1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.

      5'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '. Contractual allocation of blocking/reporting duties with partner banks.

      6'
    change_id: CHG-20260902-768c23
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: . Reporting and record-retention obligations specific to each applicable
      regime
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ', including any SAR/STR overlap'
    change_id: CHG-20260902-a8914d
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '7'
    change_id: CHG-20260902-495982
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '6'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '6'
  - kind: insert
    text: '. Whether merchants can receive match explanations.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '8'
    change_id: CHG-20260902-19b4cf
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '7'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '7'
  - kind: insert
    text: '. Approved communications templates.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '9'
    change_id: CHG-20260902-f7adf0
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '8'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '8'
  - kind: insert
    text: '. Vendor contracts and partner coordination.


      **Unverified leads (research was model-only; external authority retrieval timed
      out):**

      - OFAC blocked-property reporting within 10 business days and five-year record
      retention.

      - EU member-state notification requirements and five-year retention.

      - The strict-liability standard for OFAC civil penalties and the knowledge/negligence
      standard under EU regimes.

      - Anti-tipping-off restrictions under both regimes.'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '

      - Whether blocking obligations fall on the fund-holding institution rather than
      Mosaic Relay.'
    change_id: CHG-20260902-562792
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: '


      These points are based on general knowledge and must be verified against current
      OFAC regulations'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: ' (e.g., 31 C.F.R. Chapter V)'
    change_id: CHG-20260902-078199
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: ', EU '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: Council Regulations, UK sanctions law
    change_id: CHG-20260902-127557
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: regulations
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: regulations
  - kind: insert
    text: ' and '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: OFSI
    change_id: CHG-20260902-974af5
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: member-state
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: member-state
  - kind: insert
    text: ' guidance, and local counsel before the analysis is finalized or relied
      upon.


      ---


      ## Recommendations (separate from any decision)


      The following are recommendations for counsel and the business to consider.
      They are not recorded decisions and require approval before adoption.


      1. **Confirm jurisdiction and list scope first.** Identify all countries and
      currencies the payout product will support and map each to applicable sanctions
      regimes and lists before finalizing the control.

      2. **'
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: 'Map the funds flow.** Determine where funds sit in the payment chain and
      confirm, in partner contracts, where the blocking obligation falls and who files
      required reports.

      3. **'
    change_id: CHG-20260902-26aa31
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
  - kind: insert
    text: 'Document match logic and thresholds.** Work with Compliance and the screening
      vendor to set and document match-scoring thresholds, escalation procedures,
      and false-positive correction processes; test with sample data.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '4'
    change_id: CHG-20260902-863806
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '3'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '3'
  - kind: insert
    text: '. **Define block vs. reject and funds handling.** Draft step-by-step procedures
      for confirming matches, blocking or rejecting, and handling funds, with escalation
      to counsel where needed.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '5'
    change_id: CHG-20260902-a853a6
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '4'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '4'
  - kind: insert
    text: '. **Build reporting and retention into the system.** Ensure the control
      captures the data needed for blocked-property and rejected-transaction reports
      and meets retention periods automatically.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '6'
    change_id: CHG-20260902-a4a58b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '5'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '5'
  - kind: insert
    text: '. **Adopt approved communications templates.** Use neutral language for
      the review queue, never disclose match specifics, and default merchant access
      to match explanations to restricted.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '7'
    change_id: CHG-20260902-fa9ea1
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '6'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '6'
  - kind: insert
    text: '. **Stand up the governance layer.** Implement human review, a documented
      appeal and correction path, audit logs, consistency monitoring, and reviewer
      training.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '8'
    change_id: CHG-20260902-e5d68b
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '7'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '7'
  - kind: insert
    text: '. **Coordinate with vendors and partners.** Confirm screening vendors and
      banking partners support Mosaic Relay''s obligations and address compliance
      responsibilities in contracts.

      '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: insert
    text: '9'
    change_id: CHG-20260902-264819
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:06:15+00:00'
    replaced_segments:
    - kind: insert
      text: '8'
      change_id: CHG-20260902-f0943c
      author_id: author-themis
      author_name: Themis.ai
      author_color: '#2F5597'
      created_at: '2026-09-02T16:05:42+00:00'
    replaced_text: '8'
  - kind: insert
    text: '. **Verify authority and obtain local counsel.** Confirm the OFAC/EU points
      above against current primary sources and consult local counsel in each jurisdiction
      served.


      ---


      *This draft is a best-effort legal analysis based on first-pass, model-only '
    change_id: CHG-20260902-f0943c
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: research.
    change_id: ''
    author_id: ''
    author_name: ''
    author_color: ''
    created_at: ''
  - kind: insert
    text: ' It is privileged and confidential. It should not be relied upon as final
      legal advice until the assumptions and gaps above are resolved and the underlying
      authority is verified.*'
    change_id: CHG-20260902-ca36c2
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-02T16:05:42+00:00'
  - kind: equal
    text: '

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
  last_proposed_at: '2026-09-02T16:06:15+00:00'
last_source_action_key: chat:RUN-20260902-f783e9:tool:ed98fa859c4c4c542ac62777
---
# Legal Response — Sanctions Screening During Recipient Payouts

**Matter:** Mosaic Relay UX Test — 08 — Sanctions Screening During Recipient Payouts
**Prepared for:** Product (with Compliance and Legal review)
**Status:** Draft for review — best-effort analysis based on first-pass research. External authority retrieval was unavailable for this run; the analysis below is model-only and must be verified against current primary sources and local counsel before reliance.

---

## Executive summary

Mosaic Relay proposes to screen every payout recipient against sanctions and restricted-party lists at onboarding, before each payout, and when lists update; potential matches would queue for manual review, and confirmed matches would stop the payout and restrict the account. This is a sound, risk-aware design and is broadly consistent with how payment providers approach sanctions compliance. However, the legal obligations that attach to it — screening scope, blocking versus rejection, reporting and record retention, communications, and anti-discrimination controls — depend heavily on facts that are not yet defined, most importantly the countries and currencies served, the lists used, and where the funds sit in the payment chain.

This response addresses the five requested areas, flags the assumptions on which the analysis rests, and identifies the gaps that must be closed before launch. It is a legal analysis and recommendation, not a recorded decision. Nothing here should be treated as an approved course of action until the open questions are resolved and the analysis is verified.

---

## 1. Required screening scope

**Analysis.** Whether pre-release screening of every recipient is *legally required* versus *best practice* depends on which sanctions regimes apply to Mosaic Relay and to each payout. The two regimes most likely to matter given Mosaic Relay's stated footprint (North America and Europe) are U.S. OFAC and EU sanctions, but the analysis is jurisdiction-specific.

- **U.S. (OFAC).** OFAC does not prescribe a single mandatory screening frequency or methodology for all entities. The obligation is to avoid engaging in prohibited transactions with blocked persons (e.g., SDNs) and to block or reject as required. In practice, pre-transaction screening of parties is the standard, expected control for payment providers, and OFAC treats the adequacy of a compliance program as a mitigating factor in enforcement. Screening at onboarding, before each payout, and on list updates is a reasonable and defensible risk-based design.
- **EU.** EU sanctions regulations prohibit making funds or economic resources available, directly or indirectly, to or for the benefit of designated persons. Screening against the EU consolidated list is the expected control for entities operating in the EU or serving EU customers. The proposed cadence is consistent with this expectation.
- **Other regimes.** Depending on the countries and currencies served, UK, UN, and local regimes may also apply and may impose their own screening expectations. If payouts reach recipients in comprehensively sanctioned jurisdictions (e.g., Iran, North Korea, Cuba, Syria, the Crimea region), the analysis shifts from list-matching to stricter country-based prohibitions.

**Bottom line.** Screening every recipient before release is not merely defensible — it is the prudent baseline for a payment provider with a U.S./EU nexus. The open question is not *whether* to screen but *which lists and which jurisdictions* the program must cover, and how to handle payouts that touch multiple regimes with potentially conflicting obligations.

**Assumptions and gaps.**
- **Assumption:** Mosaic Relay has a U.S. and/or EU nexus (U.S. dollar or euro clearing, U.S./EU persons, or U.S./EU customers), making OFAC and EU regimes applicable. This is unverified.
- **Gap:** Countries and currencies served are not defined. This is the single most important missing fact; it determines which regimes and lists apply.
- **Gap:** The specific lists to be used (OFAC SDN, EU consolidated list, UN lists, sectoral lists, etc.) are not identified.

---

## 2. Blocking and rejection duties

**Analysis.** When a match is confirmed, the required action differs by regime and by the nature of the transaction:

- **Blocking (freezing).** Where the transaction involves property or an interest in property of a blocked person (e.g., an SDN), U.S. persons must block the transaction and hold the funds in a segregated, interest-bearing blocked account; the funds cannot be released without OFAC authorization. Under EU rules, funds and economic resources of designated persons must be frozen, and none may be made available to or for their benefit.
- **Rejection.** Some transactions must be *rejected* rather than blocked — for example, certain sectoral-sanctions scenarios or transactions that are prohibited but do not involve blocked property. In a rejection, funds are typically returned to the sender rather than frozen. The distinction matters because it changes what Mosaic Relay must do with the funds and what it must report.
- **Where the funds sit is critical.** Mosaic Relay is not a bank and does not hold deposits. The mechanics of "blocking" therefore depend on where the funds sit in the payment chain — Mosaic Relay's own settlement account, a partner bank's account, or in transit. The blocking obligation may fall on the financial institution holding the funds, with Mosaic Relay bearing a duty to identify, escalate, and not facilitate the prohibited transaction. This means Mosaic Relay's role may be primarily a screening-and-escalation layer, with the actual freeze executed by the partner bank. That allocation must be confirmed and documented in partner contracts.
- **Strict liability (U.S.).** OFAC civil penalties operate on a strict-liability basis. Even inadvertent violations can draw enforcement, though a robust compliance program is a mitigating factor. EU standards generally require some degree of knowledge or negligence, but this varies by member state.

**Bottom line.** Mosaic Relay needs a documented procedure that distinguishes *block* from *reject*, specifies what happens to funds in each case, and allocates responsibility between Mosaic Relay and its partner banks. The current design (stop the payout and restrict the account on a confirmed match) is directionally correct but must be paired with a defined funds-handling rule and a clear division of duties with the institutions that actually hold the funds.

**Assumptions and gaps.**
- **Assumption:** A confirmed match will generally involve blocked property requiring a freeze. This is not always true; some matches will require rejection instead.
- **Assumption:** The blocking obligation may fall on partner banks rather than Mosaic Relay, depending on where funds sit. Unverified and fact-dependent.
- **Gap:** How Mosaic Relay will handle funds while a payout is in review or blocked is not defined (hold in suspense, return to sender, block in place).
- **Gap:** Escalation deadlines for manual review are not set.
- **Gap:** The contractual allocation of blocking/reporting duties with partner banks is not established.

---

## 3. Reporting and record retention

**Analysis.** Confirmed matches trigger reporting and record-keeping duties that vary by regime:

- **U.S. (OFAC).** Blocked property must generally be reported to OFAC within 10 business days via a blocked-property report, with annual reporting of blocked property. Rejected transactions must be reported in certain circumstances. Records related to blocked property and rejected transactions are generally retained for at least five years.
- **EU.** Member-state competent authorities must be notified of frozen funds and of any attempts to make funds available to designated persons. Timelines and formats vary by member state. Records are generally retained for at least five years, though requirements vary.
- **AML overlap.** If a match also triggers AML concerns, separate suspicious-activity/transaction reporting (SARs/STRs) may be required under AML frameworks, with different deadlines and content requirements.
- **Cross-border complexity.** If a payout crosses borders, multiple regimes may impose overlapping or conflicting reporting duties. The jurisdiction where funds are held, the sender's jurisdiction, the recipient's jurisdiction, and Mosaic Relay's own operating jurisdictions may all be relevant.

**Bottom line.** Mosaic Relay should design the screening control to capture and preserve the data needed to file blocked-property and rejected-transaction reports and to meet retention periods. The system should timestamp matches, record the basis for each decision, and retain the underlying evidence — including the lists checked, the match score, the data compared, the action taken, copies of any reports filed, and any communications. Because reporting deadlines are short (e.g., OFAC's 10-business-day blocked-property report), the control should generate the necessary data automatically rather than relying on manual reconstruction.

**Assumptions and gaps.**
- **Assumption:** OFAC and EU reporting/retention figures above (10 business days; five years) reflect general knowledge and must be verified against current regulations.
- **Gap:** Which reporting obligations apply to Mosaic Relay's specific regimes is not decided.
- **Gap:** Retention periods and storage requirements for the specific jurisdictions served are not confirmed.
- **Gap:** Whether SAR/STR obligations attach to any matches is not assessed.

---

## 4. Communications to affected parties

**Analysis.** The product team's plan to show recipients only that "additional review is required" is consistent with the anti-tipping-off concern that runs through both OFAC and EU regimes: disclosing match details could tip off a designated person and undermine enforcement. However, the wording and timing of communications must be managed carefully to balance three competing interests:

1. **Avoiding tipping off / evasion.** Do not disclose the specific list, the match basis, or the fact that a sanctions match occurred. In some jurisdictions, disclosing that a transaction has been reported to a sanctions or AML authority may itself be an offense.
2. **Fair treatment of legitimate recipients.** A neutral "additional review is required" message is appropriate for *potential* matches under review, but a recipient who is ultimately cleared should be released promptly and, where appropriate, informed that the review is complete. Prolonged unexplained holds can create contractual, consumer-protection, and reputational risk even where the sanctions analysis is correct.
3. **Transparency to merchants.** Whether merchants can receive match explanations for their recipients' payouts is a separate decision. Restricting match detail to Compliance is the safer default; sharing it with merchants increases tipping-off and confidentiality risk and could facilitate evasion if a merchant is complicit. Merchant access should be permitted only where legally required or clearly safe.

**Bottom line.** The neutral "additional review is required" message is a reasonable approach for the review queue, but Mosaic Relay should not treat it as a permanent state. Approved templates should distinguish (a) under-review, (b) cleared, and (c) blocked/restricted, and should never disclose match specifics. Merchant access to match explanations should default to restricted unless a defined exception applies.

**Assumptions and gaps.**
- **Assumption:** The "additional review is required" message is permissible and does not itself constitute tipping off. This is a reasonable reading but should be confirmed against the specific regimes and any local guidance.
- **Gap:** Whether merchants can receive match explanations is not decided.
- **Gap:** Approved communications templates do not yet exist.

---

## 5. Controls against discriminatory or inconsistent treatment

**Analysis.** Screening systems generate false positives, especially with incomplete data and transliterated names, and the risk of inconsistent or discriminatory treatment of legitimate recipients is real. Controls should include:

- **Documented, objective match criteria.** Match-scoring thresholds should be set and documented, balancing false positives against false negatives, and tuned over time.
- **Human review before blocking.** Potential matches should be escalated to trained compliance staff for review before any confirmed block, rather than auto-blocking on a raw score.
- **A documented appeal and correction process.** Legitimate recipients flagged by screening need a clear path to correct false positives, with consistent evidence standards, defined timelines, and human review.
- **Audit logs and consistency monitoring.** Every decision and the evidence relied upon should be logged. Decisions should be audited periodically for consistency, and false-positive rates should be monitored to detect patterns that could indicate discriminatory treatment on the basis of nationality, ethnicity, or other protected characteristics. Screening logic should be tested periodically for disparate impact on particular nationalities, ethnicities, or name patterns.
- **Training.** Manual reviewers should be trained on objective criteria and on avoiding bias.
- **Vendor management.** If Mosaic Relay uses a third-party screening vendor, it remains responsible for compliance. Contracts should address list coverage, update frequency, match logic, data security, and audit rights.

**Bottom line.** The proposed design already includes the right skeleton (manual-review queue, confirmed-match blocking). The missing piece is the governance layer: documented thresholds, a human-review and appeal path, audit logs, and consistency monitoring. These controls are what convert a screening tool into a defensible compliance program and reduce both sanctions risk and discrimination risk.

**Assumptions and gaps.**
- **Assumption:** Mosaic Relay will use a third-party screening vendor. Unverified.
- **Gap:** Match-scoring thresholds and escalation deadlines are not set.
- **Gap:** The false-positive correction procedure is not defined (the product has indicated it needs a documented appeal and correction path with human review, consistent evidence standards, and audit logs).

---

## Assumptions, gaps, and unverified leads

**Material assumptions (must be confirmed before reliance):**
1. Mosaic Relay has a U.S. and/or EU nexus making OFAC and EU regimes applicable.
2. Screening will cover OFAC SDN and EU consolidated lists at a minimum.
3. A confirmed match will generally involve blocked property requiring a freeze (rather than rejection).
4. The blocking obligation may fall on partner banks rather than Mosaic Relay, depending on where funds sit.
5. Mosaic Relay will use a third-party screening vendor.
6. The "additional review is required" message is permissible and does not constitute tipping off.

**Gaps that must be closed before launch:**
1. Countries and currencies served (drives which regimes and lists apply).
2. Specific sanctions/restricted-party lists to be used.
3. Match-scoring thresholds and escalation deadlines.
4. Blocked-funds handling (hold in suspense, return to sender, block in place) and where funds sit in the payment chain.
5. Contractual allocation of blocking/reporting duties with partner banks.
6. Reporting and record-retention obligations specific to each applicable regime, including any SAR/STR overlap.
7. Whether merchants can receive match explanations.
8. Approved communications templates.
9. Vendor contracts and partner coordination.

**Unverified leads (research was model-only; external authority retrieval timed out):**
- OFAC blocked-property reporting within 10 business days and five-year record retention.
- EU member-state notification requirements and five-year retention.
- The strict-liability standard for OFAC civil penalties and the knowledge/negligence standard under EU regimes.
- Anti-tipping-off restrictions under both regimes.
- Whether blocking obligations fall on the fund-holding institution rather than Mosaic Relay.

These points are based on general knowledge and must be verified against current OFAC regulations (e.g., 31 C.F.R. Chapter V), EU Council Regulations, UK sanctions law and OFSI guidance, and local counsel before the analysis is finalized or relied upon.

---

## Recommendations (separate from any decision)

The following are recommendations for counsel and the business to consider. They are not recorded decisions and require approval before adoption.

1. **Confirm jurisdiction and list scope first.** Identify all countries and currencies the payout product will support and map each to applicable sanctions regimes and lists before finalizing the control.
2. **Map the funds flow.** Determine where funds sit in the payment chain and confirm, in partner contracts, where the blocking obligation falls and who files required reports.
3. **Document match logic and thresholds.** Work with Compliance and the screening vendor to set and document match-scoring thresholds, escalation procedures, and false-positive correction processes; test with sample data.
4. **Define block vs. reject and funds handling.** Draft step-by-step procedures for confirming matches, blocking or rejecting, and handling funds, with escalation to counsel where needed.
5. **Build reporting and retention into the system.** Ensure the control captures the data needed for blocked-property and rejected-transaction reports and meets retention periods automatically.
6. **Adopt approved communications templates.** Use neutral language for the review queue, never disclose match specifics, and default merchant access to match explanations to restricted.
7. **Stand up the governance layer.** Implement human review, a documented appeal and correction path, audit logs, consistency monitoring, and reviewer training.
8. **Coordinate with vendors and partners.** Confirm screening vendors and banking partners support Mosaic Relay's obligations and address compliance responsibilities in contracts.
9. **Verify authority and obtain local counsel.** Confirm the OFAC/EU points above against current primary sources and consult local counsel in each jurisdiction served.

---

*This draft is a best-effort legal analysis based on first-pass, model-only research. It is privileged and confidential. It should not be relied upon as final legal advice until the assumptions and gaps above are resolved and the underlying authority is verified.*
