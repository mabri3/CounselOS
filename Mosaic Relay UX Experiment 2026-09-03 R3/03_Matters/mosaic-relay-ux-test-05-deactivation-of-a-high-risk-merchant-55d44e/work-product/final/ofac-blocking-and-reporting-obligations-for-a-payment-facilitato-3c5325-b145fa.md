---
work_product_id: WP-88f6083c5325
matter_id: MAT-20260904-55d44e
title: Deactivation of a High-Risk Merchant — Integrated Working Legal Response (Sanctions
  Track + Discretionary Risk Track)
record_type: work_product
state: final
summary: ''
created_at: '2026-09-04T00:12:56+00:00'
updated_at: '2026-09-04T00:13:36+00:00'
immutable: true
source_action_key: chat:RUN-20260904-aa8d09:tool:44188a0386e9329db0666a2a
recommendation_version_id: null
recommendation_snapshot: '# Recommendations


  No recommendation has been drafted yet.'
last_source_action_key: chat:RUN-20260904-acefc0:tool:96173957ccedb431806af365
review:
  segments:
  - kind: delete
    text: '# OFAC Blocking and Reporting Obligations for a Payment Facilitator When
      a Merchant Is a Confirmed Sanctions Match


      **Matter:** Mosaic Relay — Deactivation of a High-Risk Merchant

      **Scope of this draft:** The mandatory OFAC track only — what Mosaic Relay must
      do when monitoring confirms a merchant is a sanctions match. The discretionary
      fraud/chargeback/AML track is addressed separately and is referenced here only
      to distinguish it.


      ---


      ## 1. Bottom line


      When Mosaic Relay confirms a merchant is a sanctions match, the deactivation
      process must **block** (freeze) any funds in Mosaic Relay''s possession or control
      in which the blocked person has an interest, **report** the blocked property
      to OFAC within the required timelines, and **not** return or release those funds
      without OFAC authorization. This is a mandatory federal-law obligation that
      attaches to Mosaic Relay as a US person — it does not depend on whether Mosaic
      Relay is a bank, a money transmitter, or a payment facilitator, and it cannot
      be delegated away.


      The sanctions track is structurally different from the discretionary risk track.
      A confirmed match cannot be handled as a routine "deactivate and return funds"
      closure. The process must keep the two tracks separate so that blocked funds
      are never treated as returnable and discretionary holds are never treated as
      OFAC blocks.


      ---


      ## 2. The legal basis: OFAC obligations attach to the entity, not the license
      type


      OFAC sanctions programs apply to "US persons," which includes any entity organized
      under US law. Mosaic Relay, as a US-headquartered company, is a US person subject
      to OFAC sanctions programs regardless of its regulatory status. The obligation
      attaches to the entity itself.


      Two consequences follow:


      - **Mosaic Relay cannot fully delegate the blocking obligation.** Even if Mosaic
      Relay operates under a partner bank''s licenses and the partner bank controls
      settlement accounts, Mosaic Relay remains a US person with independent OFAC
      obligations wherever it has possession or control of funds. The division of
      responsibility with the partner bank must be documented, but it does not relieve
      Mosaic Relay of its own duty.

      - **Strict liability applies.** OFAC civil penalties operate on a strict-liability
      basis. Good-faith screening, reasonable procedures, and prompt voluntary self-disclosure
      are mitigating factors but do not eliminate liability. A process failure that
      allows a blocked person''s funds to move is a potential violation regardless
      of intent.


      ---


      ## 3. Blocking vs. rejecting — the core distinction


      When a US person comes into possession or control of property (including funds)
      in which a blocked person has an interest, the obligation is generally to **block**
      those funds, not to reject or return them.


      | | **Blocking** | **Rejecting** |

      |---|---|---|

      | When it applies | Confirmed blocked person (e.g., SDN) has an interest in
      the property | Transaction is merely prohibited but the party is not a blocked
      person |

      | What happens | Funds placed in a blocked, interest-bearing account; cannot
      be released, transferred, or dealt with without OFAC authorization (a license)
      | Funds may be returned to the sender |

      | Funds status | Remain the property of the blocked person but cannot be accessed
      | Not held as blocked property |


      For a confirmed SDN match, Mosaic Relay would generally be required to **block**
      any funds in its possession or control in which the SDN has an interest. This
      includes pending payouts, reserve balances, and potentially funds in transit
      if Mosaic Relay has control over them.


      **Design implication:** The deactivation process must not treat a confirmed
      sanctions match as a routine closure where funds are returned to the merchant.
      Returning blocked funds would itself be an OFAC violation.


      ---


      ## 4. Reporting obligations (31 C.F.R. Part 501)


      OFAC''s Reporting, Procedures and Penalties Regulations require:


      - **Initial blocked-property report** — filed within **10 business days** of
      the blocking action, identifying the blocked property, the blocked person, the
      date of blocking, and related information.

      - **Annual report of blocked property** — filed by **September 30** each year,
      reporting all blocked property held as of June 30.

      - **Rejected-transaction reports** — if transactions are rejected rather than
      blocked, a report must be filed within **10 business days**.


      Reports are filed through OFAC''s online reporting system (or by the method
      OFAC specifies at the time). The process should assign clear ownership for these
      filings and calendar the deadlines.


      ---


      ## 5. Notice to the merchant — no advance notice, coordinated post-blocking
      communication


      - **No advance notice before blocking.** OFAC regulations do not require advance
      notice to the blocked person before blocking funds. In fact, advance notice
      could constitute a violation if it facilitates the blocked person''s evasion
      of sanctions. Blocking must occur immediately upon confirmation, without tipping
      off the merchant.

      - **Post-blocking communication.** After blocking, Mosaic Relay may inform the
      merchant that funds have been blocked pursuant to OFAC regulations. The SDN
      listing is public, so informing the merchant of the match itself is generally
      permissible. However, the timing and content of that communication should be
      coordinated with legal counsel and must not conflict with any ongoing law-enforcement
      investigation or constitute prohibited facilitation.


      ---


      ## 6. Merchant recourse


      A blocked merchant''s recourse is through OFAC, not through Mosaic Relay''s
      normal dispute process:


      - The merchant may apply to OFAC for a **specific license** to access blocked
      funds.

      - The merchant may petition for **removal from the SDN list**.

      - Mosaic Relay cannot release blocked funds on its own; release requires OFAC
      authorization.


      This is a key difference from the discretionary track, where the merchant has
      contractual recourse and Mosaic Relay can restore access if the risk is resolved.


      ---


      ## 7. How the sanctions track differs from the discretionary risk track


      The process must not conflate the two tracks. A confirmed SDN match cannot simply
      be "deactivated" with funds returned — that would be an OFAC violation. Conversely,
      a merchant deactivated for high chargebacks should not have funds treated as
      blocked under OFAC rules.


      | Element | Confirmed sanctions match (SDN) | Discretionary risk signal (fraud,
      chargeback, AML) |

      |---|---|---|

      | **Legal basis** | Federal law (OFAC regulations) — mandatory | Contractual
      rights under merchant agreement — discretionary |

      | **Timing** | Immediate blocking required upon confirmation | Business judgment;
      may allow brief investigation before restriction |

      | **Funds handling** | Block (freeze) — cannot return or release without OFAC
      license | Hold, return, or release per contract terms and applicable state money-transmission
      law |

      | **Notice to merchant** | No advance notice; post-blocking notice permissible
      but coordinate with counsel | Contract may require notice; tipping-off rules
      may restrict disclosure if SAR-related |

      | **Reporting** | OFAC blocked-property reports (10 business days; annual) |
      SAR filing if suspicious activity identified (FinCEN); no OFAC report unless
      sanctions nexus |

      | **Appeal / recourse** | Merchant applies to OFAC for a license or SDN-removal
      petition | Contractual dispute resolution; potential wrongful-termination claims
      |

      | **Reversibility** | Only with OFAC authorization | Business decision; can
      restore access if risk is resolved |


      ---


      ## 8. Recommended process design for the sanctions track


      The recommended structure is a **dual-track process** with a clearly separated
      sanctions track:


      1. **Trigger** — a confirmed SDN or other sanctions-list match.

      2. **Immediate block** — freeze all funds in Mosaic Relay''s possession or control
      in which the blocked person has an interest, within minutes of confirmation.
      Do not return or release funds.

      3. **Preserve records** — capture the match evidence, the funds identified,
      the date and time of blocking, and the decision-maker.

      4. **Report** — file the initial blocked-property report within 10 business
      days; calendar the annual report.

      5. **Coordinate communication** — no advance notice; post-blocking communication
      to the merchant coordinated with legal counsel.

      6. **Merchant recourse** — direct the merchant to OFAC licensing/SDN-removal
      processes; do not release funds without OFAC authorization.


      **Key risk:** reliable screening to correctly classify triggers. A false positive
      on the sanctions track creates unnecessary blocking; a false negative creates
      OFAC exposure. The sanctions gate must be immediate and reliable so funds are
      never released to a blocked person.


      ---


      ## 9. Facts that would change this analysis


      - **Whether Mosaic Relay ever has "possession or control" of funds.** OFAC blocking
      obligations attach to the person with possession or control. If all settlement
      funds flow directly through partner bank accounts and Mosaic Relay never holds
      funds, the blocking obligation may rest primarily with the partner bank. If
      Mosaic Relay controls a settlement account or holds reserves, it has direct
      blocking obligations. The funds-flow architecture must be mapped to answer this.

      - **Regulatory status.** If Mosaic Relay holds its own money-transmitter licenses
      (rather than operating as a payfac under partner licenses), it has direct BSA/AML
      obligations including SAR filing, and state-law funds-safeguarding requirements
      apply directly.

      - **Jurisdiction scope.** If the process must cover UK/EU merchants, UK OFSI
      and EU sanctions regimes impose parallel but not identical blocking and reporting
      obligations, with different lists, thresholds, and reporting timelines.

      - **Partner bank requirements.** Acquiring banks and processors may impose contractual
      obligations (e.g., specific notice periods, MATCH reporting, reserve requirements)
      that constrain the process beyond OFAC minimums.


      ---


      ## What would change this


      - **Working assumption — Mosaic Relay operates as a payfac under partner bank
      licenses, not as a directly licensed money transmitter.** This determines whether
      Mosaic Relay has direct SAR-filing obligations and direct state money-transmission
      compliance duties, and it affects how the OFAC blocking obligation is allocated
      with the partner bank. If Mosaic Relay holds its own licenses, the compliance
      obligations are broader. This was assumed in intake but not confirmed; the vault
      does not contain the licensing documentation.

      - **Open fork — Whether Mosaic Relay ever has "possession or control" of funds.**
      The entire blocking analysis turns on this. If all funds flow directly through
      partner bank accounts and Mosaic Relay never holds funds, the blocking obligation
      may rest primarily with the partner bank. If Mosaic Relay controls a settlement
      account or holds reserves, it has direct blocking obligations. The funds-flow
      architecture has not been mapped.

      - **Open fork — Jurisdiction scope.** Intake recorded "Not sure yet." If the
      process is US-only, OFAC is the primary sanctions regime and this analysis is
      largely sufficient. If UK/EU merchants are in scope, parallel UK OFSI and EU
      sanctions obligations apply with different lists, reporting timelines, and licensing
      frameworks. This is a material design fork.

      - **Not examined — Card-network (Visa/Mastercard) rules on merchant termination
      and MATCH reporting.** These rules impose specific obligations on payment facilitators
      when terminating merchants, including reporting to network databases. The specific
      network rule versions applicable to Mosaic Relay''s acquiring relationships
      were not reviewed.

      - **Not examined — The merchant agreement template.** The contractual suspension,
      termination, reserve, and notice provisions were flagged "not yet reviewed"
      in intake and have not been pulled. This matters most for the discretionary
      track, but the agreement may also allocate OFAC-related responsibilities and
      funds-holding rights that bear on the sanctions track.

      - **Not examined — Current OFAC reporting procedures.** The filing method, timelines,
      and any recent changes to 31 C.F.R. Part 501 reporting requirements were not
      verified against current OFAC guidance. The analysis above is model-generated
      from general knowledge of US sanctions law and should be verified before reliance.

      '
    change_id: CHG-20260904-2f60a7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T00:13:37+00:00'
  - kind: insert
    text: '# Deactivation of a High-Risk Merchant — Integrated Working Legal Response


      **Matter:** Mosaic Relay — Deactivation of a High-Risk Merchant

      **Status:** Working draft for review. This integrates the mandatory sanctions
      track and the discretionary risk track into one complete response.

      **Authority caveat (preserved from the saved research packet):** The research
      packet is model-generated from general knowledge of US sanctions law. **No external
      authority was retrieved** — the external research run timed out and public research
      was unavailable. The OFAC-specific statements below (31 C.F.R. Part 501 reporting
      timelines, blocking vs. rejecting, strict liability) should be verified against
      current OFAC regulations and guidance before reliance. This caveat applies to
      the entire document, not just the sanctions section.


      ---


      ## 0. How to read this response


      Mosaic Relay''s monitoring team wants a standard process to deactivate merchants
      whose activity raises sanctions, fraud, chargeback, consumer-harm, or money-laundering
      concerns. The proposed flow would place a temporary restriction on new payments
      or payouts, preserve records, contact the merchant when legally and operationally
      appropriate, and either restore access or terminate.


      The single most important structural point is that this is **two different legal
      tracks that must not be conflated**:


      1. **Sanctions track (mandatory).** A confirmed sanctions match triggers federal-law
      blocking and reporting obligations. Funds are frozen, not returned. Notice is
      restricted. Recourse runs through OFAC.

      2. **Discretionary risk track (fraud, chargeback, consumer-harm, AML).** This
      is governed primarily by contract. Mosaic Relay has latitude on timing, notice,
      and funds handling, but must act consistently and defensibly to avoid wrongful-termination
      and inconsistent-treatment exposure.


      The process should be designed as a **dual-track workflow** with a mandatory
      sanctions gate. If a confirmed sanctions match is identified at any point, the
      matter switches to the sanctions track. Otherwise, the discretionary track proceeds.


      ---


      ## PART A — SANCTIONS TRACK (MANDATORY)


      ### A1. Bottom line


      When Mosaic Relay confirms a merchant is a sanctions match, the process must
      **block** (freeze) any funds in Mosaic Relay''s possession or control in which
      the blocked person has an interest, **report** the blocked property to OFAC
      within the required timelines, and **not** return or release those funds without
      OFAC authorization. This is a mandatory federal-law obligation that attaches
      to Mosaic Relay as a US person — it does not depend on whether Mosaic Relay
      is a bank, a money transmitter, or a payment facilitator, and it cannot be delegated
      away.


      ### A2. Legal basis: OFAC obligations attach to the entity, not the license
      type


      OFAC sanctions programs apply to "US persons," which includes any entity organized
      under US law. Mosaic Relay, as a US-headquartered company, is a US person subject
      to OFAC sanctions programs regardless of its regulatory status.


      Two consequences follow:


      - **Mosaic Relay cannot fully delegate the blocking obligation.** Even if Mosaic
      Relay operates under a partner bank''s licenses and the partner bank controls
      settlement accounts, Mosaic Relay remains a US person with independent OFAC
      obligations wherever it has possession or control of funds. The division of
      responsibility with the partner bank must be documented, but it does not relieve
      Mosaic Relay of its own duty.

      - **Strict liability applies.** OFAC civil penalties operate on a strict-liability
      basis. Good-faith screening, reasonable procedures, and prompt voluntary self-disclosure
      are mitigating factors but do not eliminate liability. A process failure that
      allows a blocked person''s funds to move is a potential violation regardless
      of intent.


      ### A3. Blocking vs. rejecting — the core distinction


      When a US person comes into possession or control of property (including funds)
      in which a blocked person has an interest, the obligation is generally to **block**
      those funds, not to reject or return them.


      | | **Blocking** | **Rejecting** |

      |---|---|---|

      | When it applies | Confirmed blocked person (e.g., SDN) has an interest in
      the property | Transaction is merely prohibited but the party is not a blocked
      person |

      | What happens | Funds placed in a blocked, interest-bearing account; cannot
      be released, transferred, or dealt with without OFAC authorization (a license)
      | Funds may be returned to the sender |

      | Funds status | Remain the property of the blocked person but cannot be accessed
      | Not held as blocked property |


      For a confirmed SDN match, Mosaic Relay would generally be required to **block**
      any funds in its possession or control in which the SDN has an interest. This
      includes pending payouts, reserve balances, and potentially funds in transit
      if Mosaic Relay has control over them.


      **Design implication:** The process must not treat a confirmed sanctions match
      as a routine closure where funds are returned to the merchant. Returning blocked
      funds would itself be an OFAC violation.


      ### A4. Reporting obligations (31 C.F.R. Part 501)


      OFAC''s Reporting, Procedures and Penalties Regulations require:


      - **Initial blocked-property report** — filed within **10 business days** of
      the blocking action, identifying the blocked property, the blocked person, the
      date of blocking, and related information.

      - **Annual report of blocked property** — filed by **September 30** each year,
      reporting all blocked property held as of June 30.

      - **Rejected-transaction reports** — if transactions are rejected rather than
      blocked, a report must be filed within **10 business days**.


      Reports are filed through OFAC''s online reporting system (or by the method
      OFAC specifies at the time). The process should assign clear ownership for these
      filings and calendar the deadlines.


      ### A5. Notice to the merchant — no advance notice, coordinated post-blocking
      communication


      - **No advance notice before blocking.** OFAC regulations do not require advance
      notice to the blocked person before blocking funds. In fact, advance notice
      could constitute a violation if it facilitates the blocked person''s evasion
      of sanctions. Blocking must occur immediately upon confirmation, without tipping
      off the merchant.

      - **Post-blocking communication.** After blocking, Mosaic Relay may inform the
      merchant that funds have been blocked pursuant to OFAC regulations. The SDN
      listing is public, so informing the merchant of the match itself is generally
      permissible. However, the timing and content of that communication should be
      coordinated with legal counsel and must not conflict with any ongoing law-enforcement
      investigation or constitute prohibited facilitation.


      ### A6. Merchant recourse


      A blocked merchant''s recourse is through OFAC, not through Mosaic Relay''s
      normal dispute process:


      - The merchant may apply to OFAC for a **specific license** to access blocked
      funds.

      - The merchant may petition for **removal from the SDN list**.

      - Mosaic Relay cannot release blocked funds on its own; release requires OFAC
      authorization.


      This is a key difference from the discretionary track, where the merchant has
      contractual recourse and Mosaic Relay can restore access if the risk is resolved.


      ---


      ## PART B — DISCRETIONARY RISK TRACK (FRAUD, CHARGEBACK, CONSUMER-HARM, AML)


      ### B1. Bottom line


      For discretionary risk signals that do not involve a confirmed sanctions match,
      the legal basis is primarily **contractual**. Mosaic Relay may temporarily restrict
      a merchant''s processing or payouts, investigate, and either restore access
      or terminate — but only to the extent the merchant agreement grants those rights,
      and subject to notice, funds-handling, and consistency obligations. The discretionary
      track is where Mosaic Relay has the most latitude, and also where wrongful-closure
      and inconsistent-treatment risk is highest.


      ### B2. The contractual foundation (must be verified)


      The entire discretionary track rests on the merchant agreement. The following
      provisions must be reviewed and confirmed before the process is finalized:


      - **Suspension rights** — Does the agreement permit temporary suspension of
      processing or payouts, and under what triggers (fraud, illegal activity, breach,
      risk)?

      - **Termination rights** — Can Mosaic Relay terminate for cause and/or for convenience,
      and with what notice?

      - **Reserve and hold rights** — Can Mosaic Relay hold funds in reserve, delay
      payouts, or set off amounts owed?

      - **Notice requirements** — What notice must be given before or after suspension
      or termination?

      - **Dispute resolution / appeal** — Is there an escalation or appeal process
      for the merchant?


      **If the agreement does not clearly grant these rights, Mosaic Relay faces breach-of-contract
      and wrongful-termination exposure when it deactivates a merchant.** This is
      the single most impactful outstanding item. The merchant agreement was flagged
      "not yet reviewed" in intake and has not been pulled.


      ### B3. Temporary restriction — timing and proportionality


      A restriction may need to occur within minutes of an alert, while investigation
      and final disposition may take several days. The process should support this
      with a **two-stage design**:


      - **Stage 1 — Immediate temporary restriction.** Within minutes of a qualifying
      alert, place a temporary hold on new payments and/or payouts. This is a protective
      measure, not a final decision. It should be reversible and time-boxed.

      - **Stage 2 — Investigation and disposition.** Over the following hours to days,
      gather evidence, apply documented decision criteria, and decide to restore,
      restrict further, or terminate.


      **Proportionality principle.** The restriction should be no broader than needed
      to protect against the identified risk. A temporary hold on new payouts may
      be appropriate while a full termination is not yet justified. The process should
      define escalation thresholds so that a low-severity signal does not automatically
      trigger a permanent closure.


      **Human review for material exceptions.** Consistent with Mosaic Relay''s stated
      risk posture, material exceptions should receive human review rather than fully
      automated disposition. This reduces wrongful closures and supports defensibility.


      ### B4. Investigation and evidence-gathering


      Before a final disposition, the process should require:


      - **Documented trigger** — the specific alert or signal that initiated the restriction.

      - **Evidence review** — transaction history, chargeback data, fraud signals,
      consumer complaints, KYB/KYC records, sanctions-screening results.

      - **Decision criteria** — defined thresholds for restore vs. restrict vs. terminate,
      applied consistently.

      - **Decision-maker and rationale** — who decided, on what basis, and why.

      - **Timeline** — when the restriction began, when the investigation concluded,
      and when the disposition was made.


      ### B5. Merchant and consumer notices


      **Merchant notice.** Notice obligations on the discretionary track are governed
      primarily by the merchant agreement. The process should:


      - Follow the contract''s notice provisions (timing, method, content).

      - Where the contract is silent, provide reasonable notice of the restriction
      and the basis, subject to the tipping-off constraints in B7.

      - Not disclose a SAR (see B7) or other confidential regulatory information.


      **Consumer notice and protection.** If consumers have paid for goods or services
      that have not been delivered, Mosaic Relay may face chargeback exposure and
      consumer-protection obligations. The process should:


      - Identify consumer orders in progress at the point of restriction.

      - Coordinate with acquiring partners and processors to manage chargebacks and
      refunds.

      - Hold funds to cover potential chargebacks consistent with contract terms and
      applicable law.

      - Consider whether consumer-facing communications are needed (e.g., where the
      merchant''s failure to deliver affects buyers).


      ### B6. Funds holds and refunds


      For discretionary deactivations, funds handling is governed by:


      - **Contract terms** — pending settlements, reserves, and payout timing.

      - **State money-transmission law** — if Mosaic Relay holds funds before transmitting
      them, state money-transmitter statutes may impose permissible-investment, timing,
      and safeguarding requirements. The specific obligations depend on whether Mosaic
      Relay is licensed directly or operates under partner licenses (open assumption).

      - **Consumer-protection considerations** — holding funds to cover potential
      chargebacks is common practice but must be consistent with contract terms.

      - **Card-network rules** — Visa and Mastercard rules impose obligations on payment
      facilitators regarding merchant termination, including reporting terminated
      merchants to network databases (e.g., Mastercard MATCH system). Failure to report
      can result in network fines.


      The process should define a clear **funds-hold-and-return procedure**: what
      is held, for how long, under what authority, and how and when it is returned
      or applied to chargebacks and setoffs.


      ### B7. SAR confidentiality and tipping-off


      If the deactivation is triggered by or results in the identification of suspicious
      activity, a Suspicious Activity Report may need to be filed (by Mosaic Relay
      or its partner bank, depending on the BSA/AML program structure). Under 31 U.S.C.
      § 5318(g)(2) and implementing regulations:


      - A financial institution and its directors, officers, employees, and agents
      are prohibited from disclosing to any person involved in the transaction that
      a SAR has been or will be filed.

      - This **"tipping-off" prohibition** means that if the merchant asks why they
      were deactivated and the reason relates to a SAR filing, customer support and
      compliance staff must not confirm or deny the existence of a SAR.

      - The prohibition does **not** prevent Mosaic Relay from informing the merchant
      that their account has been terminated or restricted — it prevents disclosure
      of the SAR itself.


      **Whether Mosaic Relay itself is a "financial institution" with a direct SAR-filing
      obligation depends on its regulatory status** (money transmitter vs. payment
      facilitator operating under a partner bank''s program). This is an open assumption.
      If Mosaic Relay operates under a partner bank''s BSA/AML program, the SAR-filing
      obligation may rest with the partner bank, but Mosaic Relay would still need
      internal escalation procedures to refer suspicious activity to the partner.


      **Design implication:** Customer support and compliance scripts must be drafted
      so that staff can communicate a restriction without disclosing SAR-related information.
      This is a training and scripting requirement, not just a policy statement.


      ### B8. Sanctions screening and escalation


      Because the two tracks must not be conflated, the process needs a **mandatory
      sanctions gate**:


      - **Screen at trigger.** Every deactivation trigger should be screened against
      sanctions lists before the discretionary track proceeds.

      - **Escalate on match.** If a confirmed sanctions match is identified at any
      point, the matter switches to the sanctions track (Part A): immediate block,
      no advance notice, OFAC reporting, coordinated communication.

      - **Handle near-matches carefully.** A name that resembles but does not confirm
      a match should not be treated as a block; it should be resolved through screening
      procedures and, if warranted, escalated to compliance/legal.


      **Key risk:** reliable screening to correctly classify triggers. A false positive
      on the sanctions track creates unnecessary blocking; a false negative creates
      OFAC exposure. The sanctions gate must be immediate and reliable so funds are
      never released to a blocked person.


      ### B9. Termination and appeals


      **Termination.** Termination for cause (fraud, illegal activity, breach) should
      follow the contract''s termination provisions. The process should document the
      cause, the evidence, and the decision-maker. Where the contract permits termination
      for convenience, Mosaic Relay should still document the business rationale to
      support consistency.


      **Appeals.** The process should define a merchant appeal path:


      - **Sanctions track:** recourse runs through OFAC (specific license, SDN-removal
      petition), not Mosaic Relay''s normal dispute process.

      - **Discretionary track:** a defined internal escalation/appeal process per
      the contract, with a documented review by someone other than the original decision-maker
      where feasible.


      **Wrongful-closure risk.** Arbitrary or inconsistent treatment across merchants
      could support claims of breach of contract, tortious interference, or (in some
      jurisdictions) unfair business practices. A documented, consistent process with
      defined criteria and escalation is the primary defense.


      ### B10. Records and audit trail


      Each deactivation decision should be documented with:


      - The **trigger** (alert, signal, or match).

      - The **evidence reviewed**.

      - The **decision-maker** and **rationale**.

      - The **timeline** (restriction start, investigation, disposition).

      - The **funds handling** (what was held, returned, applied to chargebacks/setoffs).

      - Any **notices sent** and **communications** with the merchant and consumers.

      - Any **regulatory filings** (OFAC reports, SAR referrals) and their status.


      This record supports regulatory examinations, network audits, and defense against
      merchant claims. Records should be preserved for the periods required by applicable
      law and the merchant agreement, and consistent with Mosaic Relay''s data-minimization
      and retention practices.


      ---


      ## PART C — DUAL-TRACK COMPARISON AND PROCESS FLOW


      ### C1. Comparison table


      | Element | Confirmed sanctions match (SDN) | Discretionary risk signal (fraud,
      chargeback, AML) |

      |---|---|---|

      | **Legal basis** | Federal law (OFAC regulations) — mandatory | Contractual
      rights under merchant agreement — discretionary |

      | **Timing** | Immediate blocking required upon confirmation | Business judgment;
      may allow brief investigation before restriction |

      | **Funds handling** | Block (freeze) — cannot return or release without OFAC
      license | Hold, return, or release per contract terms and applicable state money-transmission
      law |

      | **Notice to merchant** | No advance notice; post-blocking notice permissible
      but coordinate with counsel | Contract may require notice; tipping-off rules
      may restrict disclosure if SAR-related |

      | **Reporting** | OFAC blocked-property reports (10 business days; annual) |
      SAR filing if suspicious activity identified (FinCEN); no OFAC report unless
      sanctions nexus |

      | **Appeal / recourse** | Merchant applies to OFAC for a license or SDN-removal
      petition | Contractual dispute resolution; potential wrongful-termination claims
      |

      | **Reversibility** | Only with OFAC authorization | Business decision; can
      restore access if risk is resolved |


      ### C2. Recommended process flow


      1. **Trigger** — an alert or signal is raised (sanctions, fraud, chargeback,
      consumer-harm, AML).

      2. **Sanctions gate** — screen against sanctions lists. If a confirmed match:
      switch to the sanctions track (immediate block, no advance notice, OFAC reporting,
      coordinated communication, merchant recourse through OFAC). If not confirmed:
      proceed to the discretionary track.

      3. **Immediate temporary restriction** (discretionary track) — place a reversible,
      time-boxed hold on new payments and/or payouts within minutes.

      4. **Investigation** — gather evidence, apply documented decision criteria,
      human review for material exceptions.

      5. **Disposition** — restore access, restrict further, or terminate, per contract
      and documented rationale.

      6. **Funds handling** — hold, return, or apply funds per contract and applicable
      law; manage consumer chargebacks.

      7. **Notices** — merchant and consumer notices per contract and law, subject
      to tipping-off constraints.

      8. **Records** — document the full decision trail; preserve per retention requirements.

      9. **Regulatory filings** — OFAC reports (sanctions track) and SAR referrals
      (discretionary track) as applicable.


      ---


      ## PART D — RECOMMENDATIONS (SEPARATE FROM ANY DURABLE DECISION)


      These are recommendations for review. They are not recorded decisions and do
      not bind Mosaic Relay.


      1. **Adopt a dual-track process** with a mandatory sanctions gate, so blocked
      funds are never treated as returnable and discretionary holds are never treated
      as OFAC blocks.

      2. **Pull and review the merchant agreement template** before finalizing the
      discretionary track — specifically suspension, termination, reserve, and notice
      provisions. This is the single most impactful outstanding item.

      3. **Map the funds-flow architecture** to determine whether Mosaic Relay ever
      has "possession or control" of funds, which determines the allocation of OFAC
      blocking and state-law funds-handling obligations.

      4. **Confirm Mosaic Relay''s regulatory status** (payfac under partner licenses
      vs. direct money-transmitter licenses) to determine direct SAR-filing and state-law
      obligations.

      5. **Confirm jurisdiction scope.** If UK/EU merchants are in scope, parallel
      UK OFSI and EU sanctions obligations apply and the process must handle multi-regime
      blocking.

      6. **Draft customer-support and compliance scripts** that communicate restrictions
      without disclosing SAR-related information (tipping-off).

      7. **Verify current OFAC reporting procedures** (filing method, timelines, recent
      changes to 31 C.F.R. Part 501) before reliance, given that external authorities
      were not retrieved.

      8. **Review card-network (Visa/Mastercard) rules** on merchant termination and
      MATCH reporting, which impose separate obligations on payment facilitators.


      ---


      ## What would change this


      - **Working assumption — Mosaic Relay operates as a payfac under partner bank
      licenses, not as a directly licensed money transmitter.** This determines whether
      Mosaic Relay has direct SAR-filing obligations and direct state money-transmission
      compliance duties, and how the OFAC blocking obligation is allocated with the
      partner bank. If Mosaic Relay holds its own licenses, the compliance obligations
      are broader. This was assumed in intake but not confirmed; the vault does not
      contain the licensing documentation.

      - **Working assumption — The merchant agreement contains adequate suspension
      and termination rights.** The entire discretionary track depends on this. If
      the agreement is silent or weak, Mosaic Relay needs to amend its terms before
      launching the process, and any deactivations in the interim carry elevated breach-of-contract
      risk. The vault does not contain the merchant agreement; it was flagged "not
      yet reviewed" in intake but has not been pulled.

      - **Open fork — Whether Mosaic Relay ever has "possession or control" of funds.**
      The entire blocking analysis turns on this. If all funds flow directly through
      partner bank accounts and Mosaic Relay never holds funds, the blocking obligation
      may rest primarily with the partner bank. If Mosaic Relay controls a settlement
      account or holds reserves, it has direct blocking obligations. The funds-flow
      architecture has not been mapped.

      - **Open fork — Jurisdiction scope.** Intake recorded "Not sure yet." If the
      process is US-only, OFAC is the primary sanctions regime and the sanctions analysis
      is largely sufficient. If UK/EU merchants are in scope, parallel UK OFSI and
      EU sanctions obligations apply with different lists, reporting timelines, and
      licensing frameworks. This is a material design fork.

      - **Not examined — Card-network (Visa/Mastercard) rules on merchant termination
      and MATCH reporting.** These rules impose specific obligations on payment facilitators
      when terminating merchants, including reporting to network databases. The specific
      network rule versions applicable to Mosaic Relay''s acquiring relationships
      were not reviewed.

      - **Not examined — State money-transmission statutes in the specific states
      where Mosaic Relay operates.** Each state''s statute has different definitions,
      exemptions, and funds-safeguarding requirements. Without knowing which states
      are in scope and whether Mosaic Relay claims any exemptions, the state-law analysis
      is necessarily general.

      - **Not examined — Current OFAC reporting procedures.** The filing method, timelines,
      and any recent changes to 31 C.F.R. Part 501 reporting requirements were not
      verified against current OFAC guidance. The analysis is model-generated from
      general knowledge of US sanctions law and should be verified before reliance.
      No external authority was retrieved (the external research run timed out).

      '
    change_id: CHG-20260904-2f60a7
    author_id: author-themis
    author_name: Themis.ai
    author_color: '#2F5597'
    created_at: '2026-09-04T00:13:37+00:00'
  comments: []
  version: 2
  tracking: true
  authors:
  - author_id: author-themis
    name: Themis.ai
    color: '#2F5597'
  comment_events: []
  last_proposed_by: Themis.ai
  last_proposed_at: '2026-09-04T00:13:37+00:00'
final_id: FINAL-20260904-b145fa
finalized_at: '2026-09-04T00:14:39+00:00'
source_draft: 03_Matters/mosaic-relay-ux-test-05-deactivation-of-a-high-risk-merchant-55d44e/work-product/draft/ofac-blocking-and-reporting-obligations-for-a-payment-facilitato-3c5325.md
source_content_hash: 0f83f57c85a59d3fb98d5116be386fd30b7ac8c556ce831461b3cd7a2fc56bea
---
# Deactivation of a High-Risk Merchant — Integrated Working Legal Response

**Matter:** Mosaic Relay — Deactivation of a High-Risk Merchant
**Status:** Working draft for review. This integrates the mandatory sanctions track and the discretionary risk track into one complete response.
**Authority caveat (preserved from the saved research packet):** The research packet is model-generated from general knowledge of US sanctions law. **No external authority was retrieved** — the external research run timed out and public research was unavailable. The OFAC-specific statements below (31 C.F.R. Part 501 reporting timelines, blocking vs. rejecting, strict liability) should be verified against current OFAC regulations and guidance before reliance. This caveat applies to the entire document, not just the sanctions section.

---

## 0. How to read this response

Mosaic Relay's monitoring team wants a standard process to deactivate merchants whose activity raises sanctions, fraud, chargeback, consumer-harm, or money-laundering concerns. The proposed flow would place a temporary restriction on new payments or payouts, preserve records, contact the merchant when legally and operationally appropriate, and either restore access or terminate.

The single most important structural point is that this is **two different legal tracks that must not be conflated**:

1. **Sanctions track (mandatory).** A confirmed sanctions match triggers federal-law blocking and reporting obligations. Funds are frozen, not returned. Notice is restricted. Recourse runs through OFAC.
2. **Discretionary risk track (fraud, chargeback, consumer-harm, AML).** This is governed primarily by contract. Mosaic Relay has latitude on timing, notice, and funds handling, but must act consistently and defensibly to avoid wrongful-termination and inconsistent-treatment exposure.

The process should be designed as a **dual-track workflow** with a mandatory sanctions gate. If a confirmed sanctions match is identified at any point, the matter switches to the sanctions track. Otherwise, the discretionary track proceeds.

---

## PART A — SANCTIONS TRACK (MANDATORY)

### A1. Bottom line

When Mosaic Relay confirms a merchant is a sanctions match, the process must **block** (freeze) any funds in Mosaic Relay's possession or control in which the blocked person has an interest, **report** the blocked property to OFAC within the required timelines, and **not** return or release those funds without OFAC authorization. This is a mandatory federal-law obligation that attaches to Mosaic Relay as a US person — it does not depend on whether Mosaic Relay is a bank, a money transmitter, or a payment facilitator, and it cannot be delegated away.

### A2. Legal basis: OFAC obligations attach to the entity, not the license type

OFAC sanctions programs apply to "US persons," which includes any entity organized under US law. Mosaic Relay, as a US-headquartered company, is a US person subject to OFAC sanctions programs regardless of its regulatory status.

Two consequences follow:

- **Mosaic Relay cannot fully delegate the blocking obligation.** Even if Mosaic Relay operates under a partner bank's licenses and the partner bank controls settlement accounts, Mosaic Relay remains a US person with independent OFAC obligations wherever it has possession or control of funds. The division of responsibility with the partner bank must be documented, but it does not relieve Mosaic Relay of its own duty.
- **Strict liability applies.** OFAC civil penalties operate on a strict-liability basis. Good-faith screening, reasonable procedures, and prompt voluntary self-disclosure are mitigating factors but do not eliminate liability. A process failure that allows a blocked person's funds to move is a potential violation regardless of intent.

### A3. Blocking vs. rejecting — the core distinction

When a US person comes into possession or control of property (including funds) in which a blocked person has an interest, the obligation is generally to **block** those funds, not to reject or return them.

| | **Blocking** | **Rejecting** |
|---|---|---|
| When it applies | Confirmed blocked person (e.g., SDN) has an interest in the property | Transaction is merely prohibited but the party is not a blocked person |
| What happens | Funds placed in a blocked, interest-bearing account; cannot be released, transferred, or dealt with without OFAC authorization (a license) | Funds may be returned to the sender |
| Funds status | Remain the property of the blocked person but cannot be accessed | Not held as blocked property |

For a confirmed SDN match, Mosaic Relay would generally be required to **block** any funds in its possession or control in which the SDN has an interest. This includes pending payouts, reserve balances, and potentially funds in transit if Mosaic Relay has control over them.

**Design implication:** The process must not treat a confirmed sanctions match as a routine closure where funds are returned to the merchant. Returning blocked funds would itself be an OFAC violation.

### A4. Reporting obligations (31 C.F.R. Part 501)

OFAC's Reporting, Procedures and Penalties Regulations require:

- **Initial blocked-property report** — filed within **10 business days** of the blocking action, identifying the blocked property, the blocked person, the date of blocking, and related information.
- **Annual report of blocked property** — filed by **September 30** each year, reporting all blocked property held as of June 30.
- **Rejected-transaction reports** — if transactions are rejected rather than blocked, a report must be filed within **10 business days**.

Reports are filed through OFAC's online reporting system (or by the method OFAC specifies at the time). The process should assign clear ownership for these filings and calendar the deadlines.

### A5. Notice to the merchant — no advance notice, coordinated post-blocking communication

- **No advance notice before blocking.** OFAC regulations do not require advance notice to the blocked person before blocking funds. In fact, advance notice could constitute a violation if it facilitates the blocked person's evasion of sanctions. Blocking must occur immediately upon confirmation, without tipping off the merchant.
- **Post-blocking communication.** After blocking, Mosaic Relay may inform the merchant that funds have been blocked pursuant to OFAC regulations. The SDN listing is public, so informing the merchant of the match itself is generally permissible. However, the timing and content of that communication should be coordinated with legal counsel and must not conflict with any ongoing law-enforcement investigation or constitute prohibited facilitation.

### A6. Merchant recourse

A blocked merchant's recourse is through OFAC, not through Mosaic Relay's normal dispute process:

- The merchant may apply to OFAC for a **specific license** to access blocked funds.
- The merchant may petition for **removal from the SDN list**.
- Mosaic Relay cannot release blocked funds on its own; release requires OFAC authorization.

This is a key difference from the discretionary track, where the merchant has contractual recourse and Mosaic Relay can restore access if the risk is resolved.

---

## PART B — DISCRETIONARY RISK TRACK (FRAUD, CHARGEBACK, CONSUMER-HARM, AML)

### B1. Bottom line

For discretionary risk signals that do not involve a confirmed sanctions match, the legal basis is primarily **contractual**. Mosaic Relay may temporarily restrict a merchant's processing or payouts, investigate, and either restore access or terminate — but only to the extent the merchant agreement grants those rights, and subject to notice, funds-handling, and consistency obligations. The discretionary track is where Mosaic Relay has the most latitude, and also where wrongful-closure and inconsistent-treatment risk is highest.

### B2. The contractual foundation (must be verified)

The entire discretionary track rests on the merchant agreement. The following provisions must be reviewed and confirmed before the process is finalized:

- **Suspension rights** — Does the agreement permit temporary suspension of processing or payouts, and under what triggers (fraud, illegal activity, breach, risk)?
- **Termination rights** — Can Mosaic Relay terminate for cause and/or for convenience, and with what notice?
- **Reserve and hold rights** — Can Mosaic Relay hold funds in reserve, delay payouts, or set off amounts owed?
- **Notice requirements** — What notice must be given before or after suspension or termination?
- **Dispute resolution / appeal** — Is there an escalation or appeal process for the merchant?

**If the agreement does not clearly grant these rights, Mosaic Relay faces breach-of-contract and wrongful-termination exposure when it deactivates a merchant.** This is the single most impactful outstanding item. The merchant agreement was flagged "not yet reviewed" in intake and has not been pulled.

### B3. Temporary restriction — timing and proportionality

A restriction may need to occur within minutes of an alert, while investigation and final disposition may take several days. The process should support this with a **two-stage design**:

- **Stage 1 — Immediate temporary restriction.** Within minutes of a qualifying alert, place a temporary hold on new payments and/or payouts. This is a protective measure, not a final decision. It should be reversible and time-boxed.
- **Stage 2 — Investigation and disposition.** Over the following hours to days, gather evidence, apply documented decision criteria, and decide to restore, restrict further, or terminate.

**Proportionality principle.** The restriction should be no broader than needed to protect against the identified risk. A temporary hold on new payouts may be appropriate while a full termination is not yet justified. The process should define escalation thresholds so that a low-severity signal does not automatically trigger a permanent closure.

**Human review for material exceptions.** Consistent with Mosaic Relay's stated risk posture, material exceptions should receive human review rather than fully automated disposition. This reduces wrongful closures and supports defensibility.

### B4. Investigation and evidence-gathering

Before a final disposition, the process should require:

- **Documented trigger** — the specific alert or signal that initiated the restriction.
- **Evidence review** — transaction history, chargeback data, fraud signals, consumer complaints, KYB/KYC records, sanctions-screening results.
- **Decision criteria** — defined thresholds for restore vs. restrict vs. terminate, applied consistently.
- **Decision-maker and rationale** — who decided, on what basis, and why.
- **Timeline** — when the restriction began, when the investigation concluded, and when the disposition was made.

### B5. Merchant and consumer notices

**Merchant notice.** Notice obligations on the discretionary track are governed primarily by the merchant agreement. The process should:

- Follow the contract's notice provisions (timing, method, content).
- Where the contract is silent, provide reasonable notice of the restriction and the basis, subject to the tipping-off constraints in B7.
- Not disclose a SAR (see B7) or other confidential regulatory information.

**Consumer notice and protection.** If consumers have paid for goods or services that have not been delivered, Mosaic Relay may face chargeback exposure and consumer-protection obligations. The process should:

- Identify consumer orders in progress at the point of restriction.
- Coordinate with acquiring partners and processors to manage chargebacks and refunds.
- Hold funds to cover potential chargebacks consistent with contract terms and applicable law.
- Consider whether consumer-facing communications are needed (e.g., where the merchant's failure to deliver affects buyers).

### B6. Funds holds and refunds

For discretionary deactivations, funds handling is governed by:

- **Contract terms** — pending settlements, reserves, and payout timing.
- **State money-transmission law** — if Mosaic Relay holds funds before transmitting them, state money-transmitter statutes may impose permissible-investment, timing, and safeguarding requirements. The specific obligations depend on whether Mosaic Relay is licensed directly or operates under partner licenses (open assumption).
- **Consumer-protection considerations** — holding funds to cover potential chargebacks is common practice but must be consistent with contract terms.
- **Card-network rules** — Visa and Mastercard rules impose obligations on payment facilitators regarding merchant termination, including reporting terminated merchants to network databases (e.g., Mastercard MATCH system). Failure to report can result in network fines.

The process should define a clear **funds-hold-and-return procedure**: what is held, for how long, under what authority, and how and when it is returned or applied to chargebacks and setoffs.

### B7. SAR confidentiality and tipping-off

If the deactivation is triggered by or results in the identification of suspicious activity, a Suspicious Activity Report may need to be filed (by Mosaic Relay or its partner bank, depending on the BSA/AML program structure). Under 31 U.S.C. § 5318(g)(2) and implementing regulations:

- A financial institution and its directors, officers, employees, and agents are prohibited from disclosing to any person involved in the transaction that a SAR has been or will be filed.
- This **"tipping-off" prohibition** means that if the merchant asks why they were deactivated and the reason relates to a SAR filing, customer support and compliance staff must not confirm or deny the existence of a SAR.
- The prohibition does **not** prevent Mosaic Relay from informing the merchant that their account has been terminated or restricted — it prevents disclosure of the SAR itself.

**Whether Mosaic Relay itself is a "financial institution" with a direct SAR-filing obligation depends on its regulatory status** (money transmitter vs. payment facilitator operating under a partner bank's program). This is an open assumption. If Mosaic Relay operates under a partner bank's BSA/AML program, the SAR-filing obligation may rest with the partner bank, but Mosaic Relay would still need internal escalation procedures to refer suspicious activity to the partner.

**Design implication:** Customer support and compliance scripts must be drafted so that staff can communicate a restriction without disclosing SAR-related information. This is a training and scripting requirement, not just a policy statement.

### B8. Sanctions screening and escalation

Because the two tracks must not be conflated, the process needs a **mandatory sanctions gate**:

- **Screen at trigger.** Every deactivation trigger should be screened against sanctions lists before the discretionary track proceeds.
- **Escalate on match.** If a confirmed sanctions match is identified at any point, the matter switches to the sanctions track (Part A): immediate block, no advance notice, OFAC reporting, coordinated communication.
- **Handle near-matches carefully.** A name that resembles but does not confirm a match should not be treated as a block; it should be resolved through screening procedures and, if warranted, escalated to compliance/legal.

**Key risk:** reliable screening to correctly classify triggers. A false positive on the sanctions track creates unnecessary blocking; a false negative creates OFAC exposure. The sanctions gate must be immediate and reliable so funds are never released to a blocked person.

### B9. Termination and appeals

**Termination.** Termination for cause (fraud, illegal activity, breach) should follow the contract's termination provisions. The process should document the cause, the evidence, and the decision-maker. Where the contract permits termination for convenience, Mosaic Relay should still document the business rationale to support consistency.

**Appeals.** The process should define a merchant appeal path:

- **Sanctions track:** recourse runs through OFAC (specific license, SDN-removal petition), not Mosaic Relay's normal dispute process.
- **Discretionary track:** a defined internal escalation/appeal process per the contract, with a documented review by someone other than the original decision-maker where feasible.

**Wrongful-closure risk.** Arbitrary or inconsistent treatment across merchants could support claims of breach of contract, tortious interference, or (in some jurisdictions) unfair business practices. A documented, consistent process with defined criteria and escalation is the primary defense.

### B10. Records and audit trail

Each deactivation decision should be documented with:

- The **trigger** (alert, signal, or match).
- The **evidence reviewed**.
- The **decision-maker** and **rationale**.
- The **timeline** (restriction start, investigation, disposition).
- The **funds handling** (what was held, returned, applied to chargebacks/setoffs).
- Any **notices sent** and **communications** with the merchant and consumers.
- Any **regulatory filings** (OFAC reports, SAR referrals) and their status.

This record supports regulatory examinations, network audits, and defense against merchant claims. Records should be preserved for the periods required by applicable law and the merchant agreement, and consistent with Mosaic Relay's data-minimization and retention practices.

---

## PART C — DUAL-TRACK COMPARISON AND PROCESS FLOW

### C1. Comparison table

| Element | Confirmed sanctions match (SDN) | Discretionary risk signal (fraud, chargeback, AML) |
|---|---|---|
| **Legal basis** | Federal law (OFAC regulations) — mandatory | Contractual rights under merchant agreement — discretionary |
| **Timing** | Immediate blocking required upon confirmation | Business judgment; may allow brief investigation before restriction |
| **Funds handling** | Block (freeze) — cannot return or release without OFAC license | Hold, return, or release per contract terms and applicable state money-transmission law |
| **Notice to merchant** | No advance notice; post-blocking notice permissible but coordinate with counsel | Contract may require notice; tipping-off rules may restrict disclosure if SAR-related |
| **Reporting** | OFAC blocked-property reports (10 business days; annual) | SAR filing if suspicious activity identified (FinCEN); no OFAC report unless sanctions nexus |
| **Appeal / recourse** | Merchant applies to OFAC for a license or SDN-removal petition | Contractual dispute resolution; potential wrongful-termination claims |
| **Reversibility** | Only with OFAC authorization | Business decision; can restore access if risk is resolved |

### C2. Recommended process flow

1. **Trigger** — an alert or signal is raised (sanctions, fraud, chargeback, consumer-harm, AML).
2. **Sanctions gate** — screen against sanctions lists. If a confirmed match: switch to the sanctions track (immediate block, no advance notice, OFAC reporting, coordinated communication, merchant recourse through OFAC). If not confirmed: proceed to the discretionary track.
3. **Immediate temporary restriction** (discretionary track) — place a reversible, time-boxed hold on new payments and/or payouts within minutes.
4. **Investigation** — gather evidence, apply documented decision criteria, human review for material exceptions.
5. **Disposition** — restore access, restrict further, or terminate, per contract and documented rationale.
6. **Funds handling** — hold, return, or apply funds per contract and applicable law; manage consumer chargebacks.
7. **Notices** — merchant and consumer notices per contract and law, subject to tipping-off constraints.
8. **Records** — document the full decision trail; preserve per retention requirements.
9. **Regulatory filings** — OFAC reports (sanctions track) and SAR referrals (discretionary track) as applicable.

---

## PART D — RECOMMENDATIONS (SEPARATE FROM ANY DURABLE DECISION)

These are recommendations for review. They are not recorded decisions and do not bind Mosaic Relay.

1. **Adopt a dual-track process** with a mandatory sanctions gate, so blocked funds are never treated as returnable and discretionary holds are never treated as OFAC blocks.
2. **Pull and review the merchant agreement template** before finalizing the discretionary track — specifically suspension, termination, reserve, and notice provisions. This is the single most impactful outstanding item.
3. **Map the funds-flow architecture** to determine whether Mosaic Relay ever has "possession or control" of funds, which determines the allocation of OFAC blocking and state-law funds-handling obligations.
4. **Confirm Mosaic Relay's regulatory status** (payfac under partner licenses vs. direct money-transmitter licenses) to determine direct SAR-filing and state-law obligations.
5. **Confirm jurisdiction scope.** If UK/EU merchants are in scope, parallel UK OFSI and EU sanctions obligations apply and the process must handle multi-regime blocking.
6. **Draft customer-support and compliance scripts** that communicate restrictions without disclosing SAR-related information (tipping-off).
7. **Verify current OFAC reporting procedures** (filing method, timelines, recent changes to 31 C.F.R. Part 501) before reliance, given that external authorities were not retrieved.
8. **Review card-network (Visa/Mastercard) rules** on merchant termination and MATCH reporting, which impose separate obligations on payment facilitators.

---

## What would change this

- **Working assumption — Mosaic Relay operates as a payfac under partner bank licenses, not as a directly licensed money transmitter.** This determines whether Mosaic Relay has direct SAR-filing obligations and direct state money-transmission compliance duties, and how the OFAC blocking obligation is allocated with the partner bank. If Mosaic Relay holds its own licenses, the compliance obligations are broader. This was assumed in intake but not confirmed; the vault does not contain the licensing documentation.
- **Working assumption — The merchant agreement contains adequate suspension and termination rights.** The entire discretionary track depends on this. If the agreement is silent or weak, Mosaic Relay needs to amend its terms before launching the process, and any deactivations in the interim carry elevated breach-of-contract risk. The vault does not contain the merchant agreement; it was flagged "not yet reviewed" in intake but has not been pulled.
- **Open fork — Whether Mosaic Relay ever has "possession or control" of funds.** The entire blocking analysis turns on this. If all funds flow directly through partner bank accounts and Mosaic Relay never holds funds, the blocking obligation may rest primarily with the partner bank. If Mosaic Relay controls a settlement account or holds reserves, it has direct blocking obligations. The funds-flow architecture has not been mapped.
- **Open fork — Jurisdiction scope.** Intake recorded "Not sure yet." If the process is US-only, OFAC is the primary sanctions regime and the sanctions analysis is largely sufficient. If UK/EU merchants are in scope, parallel UK OFSI and EU sanctions obligations apply with different lists, reporting timelines, and licensing frameworks. This is a material design fork.
- **Not examined — Card-network (Visa/Mastercard) rules on merchant termination and MATCH reporting.** These rules impose specific obligations on payment facilitators when terminating merchants, including reporting to network databases. The specific network rule versions applicable to Mosaic Relay's acquiring relationships were not reviewed.
- **Not examined — State money-transmission statutes in the specific states where Mosaic Relay operates.** Each state's statute has different definitions, exemptions, and funds-safeguarding requirements. Without knowing which states are in scope and whether Mosaic Relay claims any exemptions, the state-law analysis is necessarily general.
- **Not examined — Current OFAC reporting procedures.** The filing method, timelines, and any recent changes to 31 C.F.R. Part 501 reporting requirements were not verified against current OFAC guidance. The analysis is model-generated from general knowledge of US sanctions law and should be verified before reliance. No external authority was retrieved (the external research run timed out).
