---
publication_key: dossier-generation:RUN-20260912-9f12a0
revision_id: DOS-dc2adc8aaff5906e6734
matter_id: MAT-20260909-d89ad8
record_type: dossier_revision
status: applied
base_content_hash: 50c7ad96d5569eea861823ae378729722c6d86c194d8db60f0491037d383da2f
content_hash: 5bf3ef6f187fa8de6a14e20601ba9ceaf52742438de09725af2b1f015ffc09e4
created_at: '2026-09-12T09:53:41+00:00'
immutable: true
dossier_generation:
  run_id: RUN-20260912-9f12a0
  skill:
    skill_id: dossier-generation
    name: Dossier generation
    path: 00_System/skills/dossier-generation.md
    instructions: "Uses: answer\n\nWrite the actual dossier in Markdown. Do not describe
      how to write it, return a\nplan, or replace the document with a link. These
      instructions govern dossier\nwriting only. The supporting skills remain independent.
      Use their relevant\nreasoning and source guidance; this document's purpose and
      structure take\nprecedence over their chat-only formats, intake prompts, and
      stopping rules.\nDo not run new research merely to refresh the dossier.\n\n##
      Purpose\n\nGive counsel an editable, current view of the whole matter across
      any area of\nlaw. Use the supplied matter records and saved research. Lead with
      the answer\nand the judgment needed. Be concise but retain the reasoning a lawyer
      needs.\nDo not add generic disclaimers or turn missing support into a refusal.\n\nWrite
      the general matter dossier, even when the conversation is exploring an\nalternative.
      The current direction stays the planning baseline. Recording a\nhypothetical
      in this document does not adopt it or change any reported fact.\n\n## Reading
      order\n\n1. A short title and **Current position**: what the matter concerns,
      the present\n   view, and the most important unresolved decision or obstacle.\n2.
      **Decision question**: reproduce the supplied current question exactly. It\n
      \  is the matter's scope, not a question for the model to replace.\n3. One **Issues**
      section covering EVERY supplied issue. Keep each issue's\n   stable identity
      with an invisible `<!-- issue:ISS-... -->` marker before its\n   heading. Do
      not substitute a second, different issue list.\n4. **Next actions**: ranked
      actions with the recorded owner, date, and evidence\n   needed. Distinguish
      proposed actions from assigned work. Use actual dates\n   when supplied. Label
      a calculated date as proposed and state its basis.\n   Do not invent a due date
      or owner. Put the highest-priority action first.\n5. Brief links to current
      work product, supporting records, and prior dossier\n   revisions. Do not paste
      the old dossier or superseded advice into the body.\n\n## Each issue\n\nDefault
      to a compact CRAC structure: **Current answer**, **Rule and support**,\n**Application**,
      and **Next step**. The last part states the practical effect,\nnot a repetition
      of the opening. Use CREAC when interpreting the authority\nneeds a separate
      **Explanation**. Use IRAC only when the issue itself still\nneeds to be framed.
      Do not pad a section to meet a template.\n\nKeep work status separate from the
      legal answer. Show what remains: information,\nresearch, analysis, a decision,
      or implementation. A supplied answer to a fact\nquestion does not by itself
      close the legal issue. Keep answered questions with\nthe facts they establish,
      rather than in the open-question list.\n\nRetain prior analysis of issues untouched
      by the latest research. Say when an\nissue has not been researched or when changed
      inputs may affect its prior view.\nDepth on one issue must not make the other
      issues disappear.\n\nGive each issue one useful current answer, even without
      completed research.\nExplain the likely result, the facts or rule it depends
      on, and the next useful\ncheck. Do not give only a referral to legal or say
      merely that research is needed.\nThe application places full saved research
      in a disclosure under its issue;\ndo not repeat that material in a second issue
      list or a saved-answer appendix.\n\n## Alternatives considered\n\nInclude this
      section when saved alternatives are supplied. Use one subsection\nper alternative,
      with its `<!-- alternative:SCN-... -->` marker and saved title.\nLabel it **Hypothetical
      — not adopted** (or archived, if the record says so).\nState its assumptions,
      how it helps or hinders the objective, added risks,\nissues it leaves unresolved,
      and the next action. Keep each alternative's\nworking note and attached test
      evidence within that alternative. Do not blend\ntwo different bank proposals
      or treat a test date as the actual closing date.\nInclude material dates, controls,
      and dependencies from the saved working note.\nLink the saved alternative. Do
      not infer acceptance or a recorded decision.\n\n## Record and source distinctions\n\n-
      Take requester-supplied facts as reported facts. Do not demote them to model\n
      \ assumptions merely because they were not independently verified. Flag a\n
      \ material inconsistency when the records actually conflict.\n- Reconcile newer
      reported answers with older assumptions and open questions.\n  Check that material
      counts, dates, and totals agree. State the conflict and\n  its effect when they
      do not; do not silently choose a convenient value.\n  Specifically compare an
      existing footprint, a combined total, and a stated\n  number of additional markets:
      show the subtraction if those figures disagree.\n  Compare dated metadata with
      reported closing dates. Put each unresolved\n  inconsistency in **Record conflicts**,
      with the practical effect and the fact\n  needed to resolve it. Preserve the
      reported values; do not correct the record\n  or omit the inconsistency merely
      because the rest of the analysis can proceed.\n- Test the legal premise of an
      issue title. Name the relevant actor and explain\n  why a duty applies to that
      actor. Do not copy bank-specific requirements onto\n  a nonbank, or treat every
      missing record as a breach. Where legal access to\n  sensitive records is restricted,
      distinguish permitted diligence from an\n  instruction to disclose or transfer
      the restricted material.\n- Keep model assumptions separate. State only those
      actually used and explain\n  which conclusion depends on them. Unknown facts
      remain unknown.\n- A missing record proves a record gap, not the absence of
      a right, approval,\n  consent, or obligation. Do not turn \"not saved\" into
      \"does not exist\" or a\n  categorical legal prohibition. Do not present an
      inferred business activity\n  as supplied fact. When a conclusion depends on
      unknown facts or applicable\n  law, state that condition and give the next useful
      check.\n- Distinguish a proposed view, the accepted working view, and an explicitly\n
      \ recorded decision. Generating this document records no new decision.\n- Link
      support beside the claim it supports. Preserve supplied, retrieved,\n  read,
      and verified source distinctions. Retrieval is not proof of support.\n  An earlier
      model answer is not legal authority. Do not invent citations.\n- Use current
      support labels. Do not repeat an old 'no sources retrieved'\n  statement when
      the current record contains sources. State the actual gap.\n\nThe application
      retains version history and checks for concurrent changes.\nReturn the useful
      document even when some support or optional structure is\nunavailable. Do not
      change facts, issue status, recommendations, or decisions."
    enabled: true
    revision: 3d7b0d4546dd19e7658f31e4eef08c4588134e49118452814fe7e10e04c5e43f
    supporting_skills:
    - skill_id: answer
      path: 00_System/experimental-chat/answer.md
      instructions: 'For substantive legal answers, use a visible legal reasoning
        structure. Choose it from the dialogue; never ask the lawyer to select a writing
        format.


        Default to IRAC when the lawyer is exploring, asks to understand more, has
        not chosen a path, or may not yet know the legal question. Frame the question
        for the lawyer rather than assuming legal knowledge. Use these exact bold
        labels, each starting a separate short paragraph:


        **Issue** — State the legal question in plain language and why it matters
        to this matter.


        **Rule** — Explain the relevant rule. Link support beside the proposition
        it supports. If you can reliably name a relevant authority that has not been
        retrieved or verified, show its name or citation beside the proposition with
        **Needs checking**, following the research skill. State what remains unverified;
        do not substitute a generic absence-of-sources notice for a known source lead.


        **Analysis** — Connect the specific facts to the rule. Explain the material
        competing interpretation or missing fact if there is one. This must be reasoning,
        not a repeated rule or bare conclusion.


        **Conclusion** — Give the provisional view and the next useful point to explore.
        A recommendation is optional; understanding comes first.


        Switch to CRAC once the lawyer has chosen a path or requests a focused answer
        to a clear question. Use **Conclusion**, **Rule**, **Analysis**, and **Conclusion
        / next step**, in that order. The last section gives the practical implication
        or next step rather than repeating the opening. A request for a quick answer
        does not by itself establish that the issue is clear; keep IRAC if framing
        is still needed. If the lawyer returns to exploring or is confused, return
        to IRAC.


        For a focused answer that needs interpretation of authorities, use CREAC:
        **Conclusion**, **Rule**, **Explanation**, **Analysis**, **Conclusion / next
        step**. Explanation describes how supported authorities interpret the rule;
        Analysis applies that interpretation to this matter. Do not invent examples,
        cases, or support to fill a section.


        For a single legal question, make these reasoning labels visible. Let the
        explanation determine section length; use the dialogue skill’s flexible reading-time
        guide without reducing analysis to unexplained labels. Cover the question
        asked, including material alternatives and support limits. For a comparison,
        use the comparison format below instead of repeating a legal-answer template
        for each option. Simple acknowledgments, intake questions, document-type questions,
        and operational updates do not need a legal-answer structure. Preserve the
        initial map format below and existing document templates.


        Distinguish the model''s inference from what a source states. Never invent
        a citation or treat an unsupported preliminary view as settled law. Briefly
        identify when new information changes a prior view and dependent work. Keep
        the explanation the lawyer requested in chat. Create a separate draft when
        the lawyer asks for a document or reusable deliverable; length alone is not
        a reason to move the answer out of the conversation. A decision tree is generated
        only when requested; unknown conditions remain unknown.



        After the lawyer submits intake answers or asks to explore with gaps left
        open, give an initial issue map immediately. Keep it provisional and concise.
        Use a short Markdown section titled "Initial issue map" with a few issue bullets.
        For each, name the likely relevant law or legal framework, explain its connection
        to these facts, and link available supporting authority next to the claim.
        Distinguish verified authority from supplied sources or unverified leads;
        never invent a citation. Briefly identify unknown facts that could change
        the map. Do not treat an unsupported preliminary view as settled law.


        Immediately below the map, include a separate visible section titled "Assumptions
        used". List only the material assumptions used in this analysis, separate
        from facts supplied by the lawyer. For each assumption, briefly say which
        issue, research direction, or conclusion depends on it; put those with the
        greatest effect first. If none are needed, say "No additional assumptions
        used." Keep unknown facts unknown. Do not promote an assumption to a confirmed
        fact, infer its opposite from its removal, or treat acceptance for exploration
        as factual confirmation. Preserve hypothetical scope. These sections are ordinary
        visible prose, not hidden metadata, an editable form, or a mandatory approval
        step.


        After the initial map and assumptions, stop. The chat interface presents three
        next-step controls: Get a quick answer with support, Explore the affected
        laws, and Create a document. Do not duplicate these choices in prose or ask
        the lawyer to manage tools or research runs. Do not create clickable map items
        or assumption controls. For later exploration, answer the selected issue directly
        and update the map or assumptions only when something material changes; do
        not repeat the entire map each turn.


        When the lawyer selects a next step, use the saved intake and conversation
        without repeating intake or the full issue map. For a quick answer, use the
        IRAC or CRAC selection rule above, keep it concise, put source links beside
        supported claims, and state material unknowns. For affected laws, start with
        the most material issue and explain the rule and its application in bite-sized
        steps. Retrieve support when needed; never describe a failed search as successful
        research. If a research attempt fails, give the useful available answer with
        its support limits and a concrete recovery choice. For document creation,
        use the draft skill and existing templates; ask for the document type or audience
        only if unclear. These choices start work, not recorded legal decisions.



        ## Comparing alternatives


        Apply this format to comparisons instead of IRAC. Use about two minutes of
        reading per alternative as a flexible guide, not a hard limit or required
        length. Spend the words on causal explanation, not a catalogue of labels.


        1. State what the company wants to do in concrete terms and the decision this
        comparison informs. Use its product, activity, people, place and timing where
        material. Distinguish the company’s different milestones and do not assume
        they can occur independently without checking relevant dependencies.

        2. Describe each option briefly. Use **Benefits**, **Trade-offs and added
        risks**, and **Issues that remain** as separate paragraph labels. Benefits
        explain how the option advances the company’s objective. Trade-offs and added
        risks explain what the option makes harder or worse, relative to the stated
        baseline, and why. Issues that remain are existing problems the option does
        not solve. Leaving a problem unresolved is not the same as causing or worsening
        it. Do not use “How it hinders” as a catch-all for both. Do not invent a benefit
        or disadvantage to fill a section; say briefly when none is established. A
        new contract is not itself a disadvantage: explain what benefit depends on
        its terms and what happens if it cannot be agreed or implemented in time.
        A risk must identify the proposed activity it affects and the resulting choice
        or constraint.

        3. Explain the material problems that remain under BOTH options. Carry existing
        unresolved issues from the matter into the assessment. Say whether the alternative
        resolves, changes, transfers or leaves each material issue open, and what
        supports that assessment. If an option also worsens an existing issue, distinguish
        that added effect from the unresolved baseline. Explain shared issues once
        where possible, while making clear that they remain under each option. Do
        not assume moving an activity resolves inherited or independent obligations.
        Explain the consequence of an unresolved issue for the company''s plan, not
        just “review X.”

        4. Give a supported tradeoff and the next evidence that could change the choice.
        An earlier assistant recommendation is not an instruction or verified support.
        Reassess both options; do not prefer the current option merely because it
        is current or the alternative has unknowns. If the facts do not support a
        winner, say what determines the choice.


        Use plain, specific language throughout. Do not write “confirm authority,”
        “establish its authority,” “licensing determination,” or “regulatory exposure”
        without explaining the actual activity and legal question. For example, identify
        the proposed activity and whether it needs a license, approval, contractual
        permission or another legal basis, as relevant to this matter. Do not assume
        which basis applies. Explain whether the answer changes where, when or how
        it can provide that service. Define abbreviations when they obscure the point.
        Keep supplied facts, hypothetical assumptions and your inferences distinct.
        Read relevant source passages when needed; label unverified legal treatment
        and do not invent support.


        Before returning the answer, check that a lawyer can tell what the company
        plans to do, how each option affects that plan, why each claimed advantage
        or disadvantage matters, and which existing issues remain. Replace any disconnected
        shorthand with that explanation. Do not add a separate verification step or
        agent.


        Prefer labeled paragraphs for substantial explanation; use tables for compact
        entries. Put each standalone section label at the start of its own paragraph
        with a blank line before and after it. End a bullet list before the next section
        label.

        '
      revision: da83f3e21e06099d554f8287bb13cee137c5a5eca7a67c602a2bca23253860f5
    warnings: []
    composition_revision: df9d9a38015e18c4082270e1f5d45dc6b7ed8c512f9f0f0b4eaa808865a50650
  selection:
    agent_id: counsel-copilot
    provider: codex
    model: gpt-5.6-sol
    reasoning_effort: medium
  warnings: []
  basis:
    03_Matters/harbor-2-d89ad8/matter.md: cee7eb5dc33fdd5f76555a3425a8f464caedb61f8cce612576ecb4709045e0e9
    03_Matters/harbor-2-d89ad8/facts.md: 687ddce08339bd9f40be26added021fb711fcff60d7e5b4cb99556855bf79e83
    03_Matters/harbor-2-d89ad8/issues.md: 6fea2651105b717cfe453d7dacf34a78f4c967840c924ba5f953ad062011247b
    03_Matters/harbor-2-d89ad8/recommendations.md: 0f5bed815fb423ec8c40ce3ba521243444d71b13323bc5e10005bfb6ab1968b3
    03_Matters/harbor-2-d89ad8/request.md: 0ef0514950d98a1d80a10ec793b28fd26dae95b54a535214904d1fe851738d0e
    03_Matters/harbor-2-d89ad8/documents/harbor-bank-option-test.md.extracted.md: 09be1aa969a6c7b8f75f436aca1fabdb0f9d713c36f10151fe6416a3cc377ad7
    03_Matters/harbor-2-d89ad8/documents/harbor-bank-option-test.md: e0e73a92a0b73932ea6d71f05536901c2eb10a41476c2309f04629ce41f7fe3c
    business_question: legacy:6abf4a45ae87313af8db04b89d546e0e1a1c6137341b3d3c0d159c66cf64d54c
    03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md: c2a2970a8a7a2a6cb28113dbf0aefdcbd32749351bcdc51b594be53dc72c7935
    03_Matters/harbor-2-d89ad8/paths/state.md: 8d1d2d8cc921ff4d44d4d0246bf6ec966457c01fe6c2c3508f4bd7c7506545c5
    03_Matters/harbor-2-d89ad8/paths/transitions/PATHOP-822dc5381bd4f8bbf5d3dd19.md: bace0ed7ae3a8722c0ad0ce39649b2bf54c486f639bfc27917e04559725d989e
    03_Matters/harbor-2-d89ad8/paths/transitions/PATHOP-2f8a7f56a655e5b82f9d1b6b.md: 1f520415d7f1c5100d0e23d39a6a68a20b62bb9037d1d22b2db4699b796448ec
    03_Matters/harbor-2-d89ad8/paths/transitions/PATHOP-d60b66df2e961dc5be6544c4.md: 5199823e0b812e50a3fb42cd44fa7b2d19179087756d7a34a00da1a8d963b470
    03_Matters/harbor-2-d89ad8/paths/transitions/PATHOP-637fa8836f017ccf0889e3db.md: 130c3ddad175e8f643c0dfe37ec1ce9e7ded138243b6a1bb813bccea61f4e072
    03_Matters/harbor-2-d89ad8/scenarios/SCN-406906c91ab0aba4313b54a6.md: 3a1f383e0eb610cd8c4ea39531e5a5a107c335d377ba0f7dd166cab0c2abf47a
    03_Matters/harbor-2-d89ad8/scenarios/SCN-490c71c86d9c658974321c1e.md: 5dc15da22de3508be6dd62909c46b67ddfa70b02eb7e9d9a550c247e115520dd
    03_Matters/harbor-2-d89ad8/scenarios/SCN-0f23edfc89ec6ecaf60a13e4.md: 8cd35bac25980bd74f653f9235728cc7b12a2ffe5cc14d8595f6d98c9d018416
    03_Matters/harbor-2-d89ad8/scenarios/revisions/SCN-406906c91ab0aba4313b54a6-bea3d8396fd84053194f.md: e3008f3817cac61c457bd1908ac56f4432e1bddd912a8ea78945a2cca1c5d0f9
    03_Matters/harbor-2-d89ad8/memory/SCN-0f23edfc89ec6ecaf60a13e4/working.md: 0b73c4769b238529facc082fdbebb734594200fb62b479a2b266aba5f5514fbf
  dispatch_metrics:
  - original_bytes: 85541
    dispatched_bytes: 85541
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  replayed_prepared_content: false
  raw_output: "# Harbor 2 matter dossier\n\n## Current position\n\nThe Harbor Pay
    migration needs legal and compliance review before the planned Nov 15 close. This
    is the accepted working view. It is not a recorded decision.\n\nMosaic Relay plans
    an asset purchase. It then plans to move 240,000 consumer users and 12,000 business
    accounts into a unified Mosaic account on day one after close. Users would receive
    full access to Mosaic products.\n\nThe main obstacle is whether Mosaic has authority
    to provide each post-close service in every affected state. Mosaic should not
    assume that Harbor’s money transmitter licenses transfer with the purchased assets.\n\nThe
    other material obstacles are:\n\n- Mosaic has not confirmed whether its anti-money-laundering
    and customer identification program permits reliance on Harbor’s prior know-your-customer
    results.\n- Underlying identity documents are missing for users onboarded before
    2023.\n- Harbor’s approximately 40 open alerts and recent suspicious activity
    report history have not been reviewed.\n- Harbor’s monitoring service ends at
    close. The replacement feed has not been validated.\n- The terms and operating
    structure of the planned $50 welcome bonus are unknown.\n\nThe full day-one migration
    remains the planning baseline. State launch holds, account restrictions, or delayed
    product access remain possible safeguards if the open conditions are not resolved.
    No decisions are recorded.\n\n### Assumptions used\n\n- Harbor is a licensed money
    transmitter subject to applicable state and federal anti-money-laundering requirements.
    This assumption affects the licensing, customer identification, alert, and monitoring
    analysis.\n- Mosaic will become the operating provider immediately after close.
    This affects whether Harbor can remain the licensed provider during a transition.\n-
    The analysis does not assume that Harbor’s licenses transfer, that its prior identity
    checks satisfy Mosaic’s requirements, or that monitoring can continue without
    a gap.\n- Mosaic’s reported 41-state license footprint is treated as a reported
    fact.\n- The acquisition structure is no longer assumed to be unknown. The reported
    structure is an asset purchase.\n\n### Record conflicts\n\n- Mosaic reportedly
    has licenses in 41 states, and the combined footprint is 44 states. `44 − 41 =
    3`, but the record says the acquisition opens four new markets. This affects which
    jurisdictions require new authority or launch restrictions. The license lists
    and the intended meaning of “market” are needed.\n- Matter metadata gives a target
    date of `2026-09-11`. The reported close is “Nov 15,” approximately ten weeks
    after the Sept. 9 intake. A saved hypothetical uses November 15, 2026, but that
    does not establish the actual closing year. The operative close date and year
    remain unresolved.\n\n## Decision question\n\nDoes any part of the Harbor Pay
    acquisition migration need legal review before the Nov 15 close?\n\n## Issues\n\n<!--
    issue:ISS-c9d7c39f63-94e42e2b38090045 -->\n### Money transmission licensing: whether
    Mosaic Relay can operate under the combined 44-state footprint and whether Harbor's
    MTLs transfer/survive the acquisition\n\n**Current answer**\n\nMosaic should not
    treat Harbor’s money transmitter licenses as assets that automatically move to
    Mosaic in the asset purchase.\n\nThe acquisition may close separately from the
    service launch. Mosaic should not start regulated services in a state unless it
    has documented authority for the complete post-close activity.\n\n**Rule and support**\n\nThe
    saved research concludes that the answer must be determined state by state. Review
    must cover Mosaic’s operating authority, transaction notices and approvals, interim
    operation, outstanding obligations, and Harbor’s license surrender.\n\nFour sources
    were retrieved, but no relevant passages were read or verified. They do not establish
    an operative state rule:\n\n- [Research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)\n-
    [CSBS Money Transmission Modernization Act — retrieved, but relevant passage not
    reviewed](03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md)\n-
    [New York Department of Financial Services licensing page — retrieved, but relevant
    passage not reviewed](03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md)\n\nThe
    model act is not proof of the law in any specific state.\n\n**Application**\n\nHarbor
    reportedly has licenses in 38 states. Mosaic reportedly has licenses in 41 states.
    Their combined footprint is reported as 44 states. Mosaic currently plans to use
    or assume Harbor’s licenses in the new markets.\n\nThe unified Mosaic account,
    combined balance, and access to Mosaic products suggest that Mosaic may become
    the actual service provider. If so, keeping Harbor’s entity or licenses active
    might not give Mosaic authority.\n\nA transition in which Harbor remains the licensed
    provider is possible only if the customer contracts, funds flow, operating control,
    licenses, bonds, records, and applicable state rules support that result.\n\nA
    partner bank holding funds would not, by itself, establish Mosaic’s authority.
    The answer depends on who contracts with users, controls transfers, owes repayment,
    maintains balances, resolves errors, and carries the regulated duties.\n\n**Next
    step**\n\nIdentify the Harbor-only jurisdictions and prepare one state matrix
    covering:\n\n- Mosaic’s authority for each post-close activity;\n- notices, filings,
    approvals, and deadlines;\n- operation while an application is pending;\n- transfer
    of customer agreements and outstanding obligations;\n- bank custody and control;\n-
    Harbor’s run-off duties, bonds, and license surrender; and\n- the launch restriction
    needed if authority is not established.\n\n<!-- retained-issue:ISS-c9d7c39f63-94e42e2b38090045:start
    -->\n<details>\n<summary>Saved research and prior analysis</summary>\n\nDo not
    rely on transferability without an applicable state rule, approval, or written
    regulator position.\n\nThe answer must be determined state by state and must cover
    more than technical change-of-control rules.\n\nThis path is possible only if
    Harbor remains the real provider and the relevant states permit the arrangement.
    The unified Mosaic account design may conflict with that position.\n\nThe result
    depends on the contracts and actual funds flow. Custody alone should not be treated
    as a licensing exemption or transfer mechanism.\n\nResearch saved. 4 sources retrieved;
    0 with passages read.\n\nNext step: Identify the four Harbor-only states and complete
    one matrix covering license authority, transaction filings, interim operation,
    bank custody, outstanding obligations, and license surrender.\n\n<details>\n<summary>Detailed
    analysis</summary>\n\n**Practical answer**\n\n**Do not treat Harbor’s money transmitter
    licenses as assets that move to Mosaic in the asset purchase.** Use this closing
    rule:\n\n> **No confirmed authority means no regulated launch by Mosaic in that
    state.**\n\nThe asset purchase can still close. However, Mosaic should not activate
    regulated services in the four Harbor-only states unless one of these conditions
    is met:\n\n1. Mosaic obtains its own license.\n2. The state approves a transfer
    or other license change.\n3. The regulator confirms a lawful interim structure.\n4.
    Harbor remains the real licensed provider under a valid transition plan.\n5. Mosaic
    blocks regulated functions in that state.\n\nThe planned unified Mosaic account
    is important. It suggests that Mosaic, not Harbor, will become the service provider.
    If that is correct, keeping Harbor’s legal entity and licenses alive might not
    give Mosaic authority to operate.\n\n**No verified operative authority retrieved.**
    The collection found the CSBS Model Money Transmission Modernization Act and a
    New York regulator licensing page. However, no exact provision about an asset
    sale, license transfer, interim operation, or custody was available for review.
    Also, a model act is not proof of the law adopted in a specific state. The state-specific
    conclusions below remain conditional.\n\n**Work needed before launch**\n\n| Work
    | Why | Proposed owner | Needed by | Evidence to proceed | Fallback |\n|---|---|---|---|---|---|\n|
    Identify the four Harbor-only states | These states have the clearest authority
    gap | Licensing team | Now | Confirmed license list and covered activities | Block
    regulated functions in those states |\n| Build a matrix for every affected state
    | Transfer, notice, approval, and surrender rules can differ | State regulatory
    counsel | Before the closing conditions are final | Applicable rule, filing deadline,
    regulator response, and license status | Delay migration in the affected state
    |\n| Confirm the post-close service provider | The licensed entity must match
    the actual operating model | Product and deal counsel | Before customer notices
    and account design are final | Contracts, user interface, funds-flow diagram,
    and operating roles | Keep Harbor as the actual provider where permitted |\n|
    Review notices and approvals | An asset sale can create separate seller and buyer
    requirements | Licensing team | Before each state deadline | Filing receipts and
    required approvals or non-objections | Make approval a state launch condition
    |\n| Confirm interim operating authority | A pending application should not be
    assumed to permit operation | State regulatory counsel | Before close | Applicable
    rule or written regulator confirmation | Keep Harbor customers segregated or restrict
    transactions |\n| Review partner-bank arrangements | Bank custody does not, by
    itself, establish Mosaic’s licensing position | Payments counsel and bank relationship
    owner | Before balances move | Bank agreements, account titles, control rights,
    reconciliation design, and bank consent | Keep funds and obligations in the existing
    structure |\n| Prepare license run-off and surrender plans | Harbor may retain
    duties for balances, claims, records, and reports | Harbor compliance and deal
    counsel | Before surrender or operational shutdown | Regulator-approved plan and
    continued bonds and financial coverage | Keep Harbor licensed and operational
    longer |\n\n**State notice and approval**\n\nDo not search only for a rule called
    “license transfer.” Review each state for:\n\n- sale of substantially all assets;\n-
    change of control;\n- change in business plan;\n- change in licensed activities;\n-
    assignment of outstanding payment obligations;\n- change in responsible persons,
    locations, or agents;\n- license surrender or termination;\n- customer agreement
    assignment; and\n- movement of stored balances or customer funds.\n\nAn asset
    purchase might fall outside a technical “change of control” rule because Harbor’s
    ownership does not change. That does not resolve the issue. Harbor might still
    need a notice or surrender approval. Mosaic might separately need authority before
    it starts the regulated activity.\n\nThe state matrix should distinguish:\n\n-
    notice only;\n- approval before closing;\n- approval before customer migration;\n-
    new license required;\n- operation permitted while an application is pending;\n-
    regulator-approved transition available; and\n- no supported interim path.\n\n**Interim
    operation**\n\nHarbor could remain the licensed provider for a transition period.
    However, the structure must be real, not only contractual language.\n\nA supportable
    structure would normally need to show that:\n\n- Harbor remains responsible to
    customers.\n- Customer terms name Harbor as the provider.\n- Harbor controls the
    regulated activity as required.\n- Harbor’s licenses, bonds, and financial coverage
    remain active.\n- Customer funds and outstanding obligations remain covered.\n-
    Harbor can complete reports, refunds, complaints, and examinations.\n- Required
    records remain available.\n- Mosaic’s operational role is permitted.\n- The partner
    bank accepts the structure.\n- Each relevant regulator permits or accepts the
    structure.\n\nThe present plan creates tension with this approach. A single Mosaic
    account, one combined balance, and full access to Mosaic products make it harder
    to show that Harbor remains the true provider.\n\n**Partner-bank custody**\n\nA
    partner bank account is not automatically a substitute for a money transmitter
    license. The key questions concern the complete activity and obligation flow.\n\nFor
    each customer balance and transfer, document:\n\n1. Who receives the customer’s
    instruction?\n2. Who accepts the obligation to transmit or return the funds?\n3.
    In whose name is the bank account held?\n4. Is it a custodial or “for benefit
    of” account?\n5. Who can direct withdrawals?\n6. Who owns the ledger and resolves
    errors?\n7. Who bears loss if a transfer fails?\n8. Which entity owes the customer
    a refund?\n9. Which entity’s license, bond, and permissible investments cover
    the obligation?\n10. Does the bank agreement permit assignment, migration, or
    a change in the program manager?\n11. Is bank consent required before closing
    or migration?\n12. What happens to funds if Harbor, Mosaic, or the bank relationship
    ends?\n\nA bank-led model might provide a different licensing analysis if the
    bank is the actual provider and Mosaic performs only permitted services. A bank
    account that merely holds funds for Mosaic or Harbor is different. The legal documents,
    customer terms, control rights, and actual operations must all support the claimed
    model.\n\nAlso review:\n\n- account segregation;\n- daily reconciliation;\n- shortfalls
    and reserve funding;\n- bank setoff rights;\n- liens and security interests;\n-
    continuity if the account is frozen;\n- treatment of pending transfers;\n- return
    and chargeback duties;\n- insolvency treatment;\n- customer disclosures; and\n-
    whether any deposit-insurance statement is accurate for the actual account structure.\n\n**Recommended
    closing position**\n\nKeep the acquisition closing separate from the regulated-service
    launch.\n\nFor the four Harbor-only states, use a state launch hold unless Mosaic
    has documented authority. For overlapping states, confirm that Mosaic’s existing
    licenses cover the complete post-close product set and funds flow.\n\nDo not surrender
    Harbor’s licenses or release its bonds until the applicable regulators permit
    it and all outstanding obligations have been assigned, completed, or placed into
    an approved run-off structure.\n\nThis investigation does not change the current
    recommendation. It adds one material point: **partner-bank custody is part of
    the licensing analysis, but custody alone does not cure an authority gap.**\n\n</details>\n\nResearch
    history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)\n\n</details>\n<!--
    retained-issue:ISS-c9d7c39f63-94e42e2b38090045:end -->\n\n<!-- issue:ISS-c9d7c39f63-ca95e529feeb1045
    -->\n### BSA/AML and KYC: whether relying on Harbor's prior KYC (with missing
    underlying documents for pre-2023 users) satisfies Mosaic Relay's independent
    CIP/AML obligations\n\n**Current answer**\n\nThe current plan for no re-verification
    is not yet supported. Mosaic’s compliance team has not confirmed whether Mosaic’s
    anti-money-laundering and customer identification program permits reliance on
    Harbor’s prior checks.\n\nMissing underlying documents prove a record gap. They
    do not by themselves prove that Harbor’s checks were invalid or that every affected
    user must be re-verified.\n\n**Rule and support**\n\nThis issue has not been researched.
    The applicable duties depend on Mosaic’s regulated status, its written program,
    the legal basis for any reliance, and the records that Mosaic must retain or access.\n\nThe
    saved record does not establish that Mosaic may satisfy its own duties using only
    Harbor’s pass/fail results.\n\n**Application**\n\nMosaic has pass/fail results
    for all Harbor users. It lacks underlying identity documents for users onboarded
    before 2023 because Harbor’s vendor closed in 2024.\n\nThe day-one plan would
    give migrated users a unified Mosaic account and full product access. If Mosaic’s
    program requires more evidence, the present data may not support unrestricted
    access for affected users.\n\nA proportionate response could include targeted
    re-verification, limits on affected accounts, or delayed access. The correct response
    depends on Mosaic’s program and the applicable legal requirements.\n\n**Next step**\n\nCompliance
    should document:\n\n- whether reliance on Harbor’s checks is permitted;\n- what
    evidence supports that reliance;\n- which records Mosaic must hold or be able
    to retrieve;\n- how many users lack required evidence;\n- whether risk-based remediation
    is allowed; and\n- what account limits apply until remediation is complete.\n\n<!--
    retained-issue:ISS-c9d7c39f63-ca95e529feeb1045:start -->\nInitial analysis — no
    completed research is saved for this issue.\n<!-- retained-issue:ISS-c9d7c39f63-ca95e529feeb1045:end
    -->\n\n<!-- issue:ISS-c9d7c39f63-69af3f282d21ef38 -->\n### SAR and alert handling:
    obligations to review, file, and manage Harbor's ~40 open alerts and SARs, and
    successor liability\n\n**Current answer**\n\nThe approximately 40 open alerts
    and recent suspicious activity report history should be reviewed through permitted
    diligence before Mosaic accepts unrestricted day-one operation.\n\nTheir unread
    status is a material information gap. It does not by itself prove a violation
    or establish that Mosaic inherits every Harbor obligation.\n\n**Rule and support**\n\nThis
    issue has not been researched. Responsibility may depend on which entity detected
    the activity, when any reporting deadline arose, whether Harbor remains in operation,
    the asset-purchase terms, and Mosaic’s post-close handling of the accounts.\n\nAccess
    to suspicious activity reports and related material must follow applicable confidentiality
    and access rules. Diligence should not be treated as an instruction to disclose
    or transfer restricted material to an unauthorized person.\n\n**Application**\n\nNo
    one has reviewed the alerts or the reported “handful” of suspicious activity reports
    from the last year. The record therefore does not show:\n\n- the age or type of
    each alert;\n- whether an investigation is complete;\n- whether a filing deadline
    is pending;\n- whether the same users will move to Mosaic;\n- whether any issue
    changes the deal risk; or\n- which entity will own each open case after close.\n\nMoving
    the accounts without resolving these points could separate active cases from the
    data, staff, and systems needed to complete them.\n\n**Next step**\n\nConduct
    a controlled review of the open cases and a permitted review of the filing history.
    Produce a case inventory that records status, deadlines, affected accounts, responsible
    entity, required records, and post-close ownership. Escalate any case that could
    affect migration eligibility or the transaction.\n\n<!-- retained-issue:ISS-c9d7c39f63-69af3f282d21ef38:start
    -->\nInitial analysis — no completed research is saved for this issue.\n<!-- retained-issue:ISS-c9d7c39f63-69af3f282d21ef38:end
    -->\n\n<!-- issue:ISS-c9d7c39f63-4825f0af7ec75542 -->\n### Monitoring vendor transition:
    continuity of transaction monitoring when the SaaS contract terminates at close\n\n**Current
    answer**\n\nThe transaction feed should be tested and validated before migrated
    users receive full access. The saved record does not establish that repointing
    the feed on day one will prevent a monitoring gap.\n\n**Rule and support**\n\nThis
    issue has not been researched. The legal requirement depends on the anti-money-laundering
    duties that apply to the operating entity and on its risk-based monitoring program.\n\nOperational
    evidence is needed to show that transactions remain visible, complete, timely,
    and subject to the correct rules and case process.\n\n**Application**\n\nHarbor’s
    monitoring contract ends at close. Mosaic plans to repoint Harbor’s transaction
    feed to Mosaic’s engine on day one.\n\nThis creates a single transition point
    with no saved evidence of:\n\n- end-to-end testing;\n- transaction and field reconciliation;\n-
    rule coverage;\n- alert creation and routing;\n- handling of late or duplicate
    events;\n- retention of historical data;\n- ownership of cases across the cutoff;
    or\n- a rollback or temporary monitoring plan.\n\nThe open Harbor alerts make
    continuity more important because historical cases may depend on data from both
    systems.\n\n**Next step**\n\nComplete an end-to-end test and retain evidence of
    transaction completeness, rule execution, alert routing, reconciliation, historical-data
    access, case ownership, and fallback operation. If the test fails, restrict or
    delay activity that cannot be monitored.\n\n<!-- retained-issue:ISS-c9d7c39f63-4825f0af7ec75542:start
    -->\nInitial analysis — no completed research is saved for this issue.\n<!-- retained-issue:ISS-c9d7c39f63-4825f0af7ec75542:end
    -->\n\n<!-- issue:ISS-c9d7c39f63-72810d0a43d3ce66 -->\n### Marketing compliance:
    the $50 welcome bonus offer and any state money transmission or consumer protection
    implications\n\n**Current answer**\n\nThe proposed $50 bonus needs review before
    its planned close-plus-one launch. The present record does not contain enough
    information to determine the required terms or disclosures.\n\nThe bonus is not
    shown to be a deposit, interest payment, or prohibited offer merely because it
    provides $50.\n\n**Rule and support**\n\nThis issue has not been researched. The
    applicable rules depend on the actual offer, including eligibility, funding, transfer
    conditions, expiration, reversals, disclosures, and the states where it is offered.\n\nThe
    offer must also match the services Mosaic is authorized and operationally ready
    to provide.\n\n**Application**\n\nMarketing plans to offer $50 on a customer’s
    first transfer. The record does not state:\n\n- who qualifies;\n- who funds the
    payment;\n- the required transfer amount or type;\n- when the bonus becomes available;\n-
    whether it can be reversed;\n- whether users must remain active;\n- how limitations
    will be disclosed; or\n- whether the campaign will run in states subject to a
    launch hold.\n\nLaunching the offer before these points are settled could promise
    access or benefits that Mosaic cannot provide in an affected state.\n\n**Next
    step**\n\nObtain the complete offer terms, customer-facing copy, funding flow,
    eligibility rules, state scope, timing, reversal rules, and complaint process.
    Review them against the approved launch footprint and actual product availability.\n\n<!--
    retained-issue:ISS-c9d7c39f63-72810d0a43d3ce66:start -->\nInitial analysis — no
    completed research is saved for this issue.\n<!-- retained-issue:ISS-c9d7c39f63-72810d0a43d3ce66:end
    -->\n\n## Alternatives considered\n\n<!-- alternative:SCN-0f23edfc89ec6ecaf60a13e4
    -->\n### Bank-held funds timing test — **Hypothetical — not adopted**\n\n[Saved
    alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-0f23edfc89ec6ecaf60a13e4.md)\n\n**Assumptions**\n\nFor
    this test only:\n\n- A bank would hold the relevant funds.\n- Mosaic would control
    transfer instructions.\n- The structure depends on completion of the bank contract
    and operating setup.\n- Migration would occur on November 15, 2026.\n- Bank integration
    would be ready on December 3, 2026.\n- Pre-2023 identity documents would remain
    missing.\n- Forty alert cases would remain pending.\n- Harbor’s monitoring service
    would end at close.\n\n**How it helps or hinders the objective**\n\nBank custody
    could change part of the funds-flow analysis. It does not establish that Mosaic
    can provide the regulated service.\n\nOn the test dates, this option makes the
    November 15 migration harder. December 3 readiness is 18 days after the hypothetical
    migration date.\n\n**Added risks**\n\nThe option adds contract, bank approval,
    technical integration, and operating-setup dependencies. Failure to complete them
    on time would prevent use of the tested structure for the November 15 date.\n\n**Issues
    left unresolved**\n\nThe option does not resolve the missing identity documents,
    pending alerts, monitoring transition, or the question of who is the actual regulated
    provider.\n\n**Next action**\n\nThe saved working note proposes that Mara Chen
    obtain a dated bank readiness plan and confirm whether the bank can support November
    15. The plan should also assign resolution of the identity-record gap, 40 pending
    alerts, and replacement monitoring. This is proposed work, not an assigned action.\n\n<!--
    alternative:SCN-406906c91ab0aba4313b54a6 -->\n### Bank-held funds structure —
    **Hypothetical — not adopted**\n\n[Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-406906c91ab0aba4313b54a6.md)\n\n**Assumptions**\n\nFor
    this test only, a partner bank holds customer funds.\n\n**How it helps or hinders
    the objective**\n\nBank custody could support a different analysis if the bank
    is the actual provider and Mosaic performs only permitted services. Custody alone
    does not transfer Harbor’s licenses or remove Mosaic’s possible licensing duties.\n\n**Added
    risks**\n\nThe legal position would depend on customer contracts, control of transfer
    instructions, settlement, account titles, ledger control, repayment duties, bank
    consent, and actual operations. A structure that exists only in contract language
    would not resolve the operating-authority question.\n\n**Issues left unresolved**\n\nThis
    option leaves open:\n\n- who contracts with users;\n- who controls transfers and
    settlement;\n- who records balances and owes repayment;\n- how customer identification
    duties are allocated;\n- who monitors transactions;\n- who manages alerts and
    suspicious activity reports;\n- how privacy duties apply; and\n- which entity
    is responsible for the bonus campaign.\n\n**Next action**\n\nPrepare the proposed
    bank agreements, customer terms, funds-flow diagram, control model, and duty allocation.
    Then compare the actual structure with the licensing matrix. No owner or due date
    is recorded.\n\n## Next actions\n\nAll open actions below are proposed. No owner
    or due date has been assigned unless stated.\n\n1. **Review Harbor’s open alerts
    and permitted suspicious activity report history.**  \n   **Owner:** Not assigned.
    \ \n   **Date:** Not assigned.  \n   **Evidence needed:** Case inventory, age,
    status, deadlines, affected accounts, responsible entity, and migration effect.\n\n2.
    **Resolve the license footprint and authority for each affected state.**  \n   **Owner:**
    Not assigned. The saved licensing analysis proposes the licensing team and state
    regulatory counsel.  \n   **Date:** Not assigned.  \n   **Evidence needed:** Confirmed
    license lists, covered activities, operative state rules, filing receipts, approvals
    or non-objections, and any written regulator position.\n\n3. **Confirm whether
    Mosaic’s program permits reliance on Harbor’s prior customer checks.**  \n   **Owner:**
    Not assigned. Compliance confirmation is required.  \n   **Date:** Not assigned.
    \ \n   **Evidence needed:** Written program requirements, reliance basis, record
    requirements, affected-user count, and approved remediation or account limits.\n\n4.
    **Validate transaction-monitoring continuity.**  \n   **Owner:** Not assigned.
    \ \n   **Date:** Not assigned.  \n   **Evidence needed:** End-to-end test results,
    reconciliation, rule coverage, alert routing, historical-data access, case ownership,
    and fallback results.\n\n5. **Confirm the post-close service provider and funds
    flow.**  \n   **Owner:** Not assigned. The saved licensing analysis proposes product
    and deal counsel.  \n   **Date:** Not assigned.  \n   **Evidence needed:** Customer
    contracts, user interface, account titles, funds-flow diagram, control rights,
    repayment duties, bank agreement, and bank consent.\n\n6. **Review the complete
    $50 bonus proposal.**  \n   **Owner:** Not assigned.  \n   **Date:** Not assigned.
    \ \n   **Evidence needed:** Offer terms, copy, eligibility, funding, state scope,
    timing, reversals, disclosures, and complaint handling.\n\n7. **Confirm the operative
    closing date and year.**  \n   **Owner:** Not assigned.  \n   **Date:** Not assigned.
    \ \n   **Evidence needed:** Current transaction timetable or executed deal document
    showing the close date.\n\nThe only recorded work item, [Orient to the request](03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md),
    is complete. It was owned by Lawyer and had no due date.\n\n## Current work product
    and supporting records\n\n- No current draft or final work-product path is saved.\n-
    [Known facts](03_Matters/harbor-2-d89ad8/facts.md)\n- [Original request](03_Matters/harbor-2-d89ad8/request.md)\n-
    [Licensing research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)\n-
    [Prior dossier revision](03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-a339a10414a6329eff9f.md)"
  source_records: &id001
  - source_id: FACT-20260909-182bcc
    source_label: 'Reported fact: Mosaic Relay is acquiring Harbor Pay; close targeted
      Nov 15 (~10 weeks out).'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15
      (~10 weeks out).
    record_revision: 5531b52c863fcef5c5a585f539101b9a680cd335d15f1850621f54d3c4f70b2a
    source_version: 5531b52c863fcef5c5a585f539101b9a680cd335d15f1850621f54d3c4f70b2a
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-182bcc
      text: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks
        out).
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-551367
    source_label: 'Reported fact: Migration moves 240k consumer users and 12k business
      accounts into Mosaic Relay''…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Migration moves 240k consumer users and 12k business accounts
      into Mosaic Relay's app on day 1 post-close, with one unified account and balance
      and full access to Mosaic's product set.
    record_revision: 057458c82b8420bcbcd202947e72d64e12f8d0116af53a56839264758ca2f0c3
    source_version: 057458c82b8420bcbcd202947e72d64e12f8d0116af53a56839264758ca2f0c3
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-551367
      text: Migration moves 240k consumer users and 12k business accounts into Mosaic
        Relay's app on day 1 post-close, with one unified account and balance and
        full access to Mosaic's product set.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-9a0c61
    source_label: 'Reported fact: Plan is no re-verification; Harbor users were already
      KYC''d by Harbor.'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Plan is no re-verification; Harbor users were already KYC'd
      by Harbor.
    record_revision: 2d65a96a89fc999cf0830ecb330c26a445cb2ae9a523a4fbf126a9db70fa67ab
    source_version: 2d65a96a89fc999cf0830ecb330c26a445cb2ae9a523a4fbf126a9db70fa67ab
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-9a0c61
      text: Plan is no re-verification; Harbor users were already KYC'd by Harbor.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-33293c
    source_label: 'Reported fact: Harbor holds money transmitter licenses (MTLs) in
      38 states; Mosaic Relay holds …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor holds money transmitter licenses (MTLs) in 38 states;
      Mosaic Relay holds 41; combined footprint is 44 states, opening four new markets.
    record_revision: 9ec188b7036a2c6014d0174df0053e59b09c94543b0ab03bf5e19dfa08e14656
    source_version: 9ec188b7036a2c6014d0174df0053e59b09c94543b0ab03bf5e19dfa08e14656
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-33293c
      text: Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay
        holds 41; combined footprint is 44 states, opening four new markets.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-aea8ec
    source_label: 'Reported fact: Harbor''s KYC ran through a vendor that shut down
      in 2024; Mosaic has pass/fail r…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic
      has pass/fail results for everyone but not the underlying documents for users
      onboarded before 2023.
    record_revision: ec16a97ef3f363657b239df9c30ceed68d008e6b65da83d2f66e48665e3dd2b6
    source_version: ec16a97ef3f363657b239df9c30ceed68d008e6b65da83d2f66e48665e3dd2b6
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-aea8ec
      text: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
        results for everyone but not the underlying documents for users onboarded
        before 2023.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-073838
    source_label: 'Reported fact: Harbor''s transaction monitoring is a third-party
      SaaS whose contract terminates …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor's transaction monitoring is a third-party SaaS whose
      contract terminates at close; plan is to repoint Harbor's transaction feed at
      Mosaic's engine on day 1.
    record_revision: 50abe200c3635fcd5e694ddff2423b099cf4c63b6ff4e2e0ce61648759871bdf
    source_version: 50abe200c3635fcd5e694ddff2423b099cf4c63b6ff4e2e0ce61648759871bdf
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-073838
      text: Harbor's transaction monitoring is a third-party SaaS whose contract terminates
        at close; plan is to repoint Harbor's transaction feed at Mosaic's engine
        on day 1.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-19aebc
    source_label: 'Reported fact: Marketing wants a ''Welcome'' campaign with a $50
      bonus on first transfer, launchi…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Marketing wants a 'Welcome' campaign with a $50 bonus on first
      transfer, launching close+1.
    record_revision: eb4df200d70f9f86c5b157445e41ff5767e693f92b648693685a9d7d283ee564
    source_version: eb4df200d70f9f86c5b157445e41ff5767e693f92b648693685a9d7d283ee564
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-19aebc
      text: Marketing wants a 'Welcome' campaign with a $50 bonus on first transfer,
        launching close+1.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-adf2cb
    source_label: 'Reported fact: Diligence flagged ~40 open alerts and ''a handful''
      of SARs from the last year at …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Diligence flagged ~40 open alerts and 'a handful' of SARs from
      the last year at Harbor; nobody has read them yet.
    record_revision: 57d13524d2b571c676001327d60c00c28239dc522c7b5f53a91cca3a9de908b1
    source_version: 57d13524d2b571c676001327d60c00c28239dc522c7b5f53a91cca3a9de908b1
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-adf2cb
      text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the last
        year at Harbor; nobody has read them yet.
      status: active
      material: true
      source_ids:
      - REQ-20260909-283892
      supersedes: null
      created_at: '2026-09-09T20:53:13+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-4c1fd8
    source_label: 'Reported fact: Migration moves 240k consumer users and 12k business
      accounts into Mosaic Relay''…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Migration moves 240k consumer users and 12k business accounts
      into Mosaic Relay's app on day 1 post-close, with one unified account and balance.
    record_revision: cd47a492f212ef4006b592b71fd47bad201d679fe2c8288f5531937b252df1e6
    source_version: cd47a492f212ef4006b592b71fd47bad201d679fe2c8288f5531937b252df1e6
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-4c1fd8
      text: Migration moves 240k consumer users and 12k business accounts into Mosaic
        Relay's app on day 1 post-close, with one unified account and balance.
      status: active
      material: true
      source_ids:
      - MSG-20260909-9835ba
      supersedes: null
      created_at: '2026-09-09T20:53:14+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-f2c49f
    source_label: 'Reported fact: Plan is no re-verification of Harbor''s existing
      KYC; Harbor users were already K…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Plan is no re-verification of Harbor's existing KYC; Harbor
      users were already KYC'd.
    record_revision: 25b1df9df9a27c42720ccb74b468e1b95f8e54560986befeb84b6b1fd514ed1a
    source_version: 25b1df9df9a27c42720ccb74b468e1b95f8e54560986befeb84b6b1fd514ed1a
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-f2c49f
      text: Plan is no re-verification of Harbor's existing KYC; Harbor users were
        already KYC'd.
      status: active
      material: true
      source_ids:
      - MSG-20260909-9835ba
      supersedes: null
      created_at: '2026-09-09T20:53:14+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-13d4c1
    source_label: 'Reported fact: Harbor''s KYC ran through a vendor that shut down
      in 2024; pass/fail results exis…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail
      results exist for everyone but underlying documents are missing for users onboarded
      before 2023.
    record_revision: fc68b87d51f6237c124b898df6c0702e519b833937a3d075baa441f2f3b95630
    source_version: fc68b87d51f6237c124b898df6c0702e519b833937a3d075baa441f2f3b95630
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-13d4c1
      text: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail results
        exist for everyone but underlying documents are missing for users onboarded
        before 2023.
      status: active
      material: true
      source_ids:
      - MSG-20260909-9835ba
      supersedes: null
      created_at: '2026-09-09T20:53:14+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-78d5cd
    source_label: 'Reported fact: Harbor''s transaction monitoring is a third-party
      SaaS whose contract terminates …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor's transaction monitoring is a third-party SaaS whose
      contract terminates at close; plan is to repoint the transaction feed to Mosaic
      Relay's engine on day 1.
    record_revision: 64a9b4af04a6882c905f589023e0d8b79c6a185d883797356330e09057a4cb1a
    source_version: 64a9b4af04a6882c905f589023e0d8b79c6a185d883797356330e09057a4cb1a
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-78d5cd
      text: Harbor's transaction monitoring is a third-party SaaS whose contract terminates
        at close; plan is to repoint the transaction feed to Mosaic Relay's engine
        on day 1.
      status: active
      material: true
      source_ids:
      - MSG-20260909-9835ba
      supersedes: null
      created_at: '2026-09-09T20:53:14+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-9f7bde
    source_label: 'Reported fact: Diligence flagged ~40 open alerts and ''a handful''
      of SARs from the last year at …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Diligence flagged ~40 open alerts and 'a handful' of SARs from
      the last year at Harbor; none have been read yet.
    record_revision: 947fe1611f82a6f4db5a20a993d7761dceedf8eebe8a5ee812fbc85171dc3afd
    source_version: 947fe1611f82a6f4db5a20a993d7761dceedf8eebe8a5ee812fbc85171dc3afd
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-9f7bde
      text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the last
        year at Harbor; none have been read yet.
      status: active
      material: true
      source_ids:
      - MSG-20260909-9835ba
      supersedes: null
      created_at: '2026-09-09T20:53:14+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-ed9f06
    source_label: 'Reported fact: How is the Harbor Pay acquisition structured? —
      Asset purchase (Mosaic buys Harb…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: How is the Harbor Pay acquisition structured? — Asset purchase
      (Mosaic buys Harbor's assets)
    record_revision: 00063124406940859918a0839256c9e522039bf6ac718fbf456955357775a3ca
    source_version: 00063124406940859918a0839256c9e522039bf6ac718fbf456955357775a3ca
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-ed9f06
      text: How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic
        buys Harbor's assets)
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:56:00+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-9497db
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-b5e71e
    source_label: 'Reported fact: Does Mosaic Relay''s AML/CIP program currently permit
      relying on another institut…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Does Mosaic Relay's AML/CIP program currently permit relying
      on another institution's prior KYC without re-verification, or is re-verification
      required? — Not sure / need to check with compliance
    record_revision: c76d18d55cb408c07328383f38d4415a487ecfef8018436044dc375f08efcc01
    source_version: c76d18d55cb408c07328383f38d4415a487ecfef8018436044dc375f08efcc01
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-b5e71e
      text: Does Mosaic Relay's AML/CIP program currently permit relying on another
        institution's prior KYC without re-verification, or is re-verification required?
        — Not sure / need to check with compliance
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:56:00+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-9497db
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-849b00
    source_label: 'Reported fact: What is known about Harbor''s ~40 open alerts and
      the SARs from the last year? — …'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: What is known about Harbor's ~40 open alerts and the SARs from
      the last year? — Nothing reviewed yet — still in diligence
    record_revision: ef42000ec8b5f305cabbd8e1c9a553f23cd486a03177f3f1a16c89766f3e196f
    source_version: ef42000ec8b5f305cabbd8e1c9a553f23cd486a03177f3f1a16c89766f3e196f
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-849b00
      text: What is known about Harbor's ~40 open alerts and the SARs from the last
        year? — Nothing reviewed yet — still in diligence
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:56:00+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-9497db
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-f0fb01
    source_label: 'Reported fact: For the four new markets opened by the combined
      footprint, does Mosaic Relay pla…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: For the four new markets opened by the combined footprint,
      does Mosaic Relay plan to operate under Harbor's existing licenses or apply
      for its own? — Use/assume Harbor's licenses
    record_revision: 3b68c9ae09e5d32fc1b1fcb207299c5ab5ca81200f5207bf49fca663a3668884
    source_version: 3b68c9ae09e5d32fc1b1fcb207299c5ab5ca81200f5207bf49fca663a3668884
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-f0fb01
      text: For the four new markets opened by the combined footprint, does Mosaic
        Relay plan to operate under Harbor's existing licenses or apply for its own?
        — Use/assume Harbor's licenses
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:56:00+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-9497db
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-620c62
    source_label: 'Reported fact: For the pre-2023 Harbor users with no underlying
      KYC documents, what is the plan…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: For the pre-2023 Harbor users with no underlying KYC documents,
      what is the plan to satisfy Mosaic Relay's own BSA/AML customer identification
      and recordkeeping obligations? — It is not yet known whether Mosaic Relay's
      AML/CIP program permits reliance on Harbor's prior KYC; compliance must confirm.
    record_revision: c9ac129b072db5f530e4aae5417e40ba473083e4ec6807f7395e2666a3ed0e66
    source_version: c9ac129b072db5f530e4aae5417e40ba473083e4ec6807f7395e2666a3ed0e66
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-620c62
      text: For the pre-2023 Harbor users with no underlying KYC documents, what is
        the plan to satisfy Mosaic Relay's own BSA/AML customer identification and
        recordkeeping obligations? — It is not yet known whether Mosaic Relay's AML/CIP
        program permits reliance on Harbor's prior KYC; compliance must confirm.
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:57:52+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-7091da
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-070aec
    source_label: 'Reported fact: Have the ~40 open alerts and the handful of SARs
      from the last year been reviewe…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Have the ~40 open alerts and the handful of SARs from the last
      year been reviewed, and what did they reveal? — The open alerts and SAR history
      have not been reviewed and remain in diligence.
    record_revision: 0e4e055251eb80fcde7c1ad29d6ee0a0c552c341309581a836b91784bd8480b5
    source_version: 0e4e055251eb80fcde7c1ad29d6ee0a0c552c341309581a836b91784bd8480b5
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-070aec
      text: Have the ~40 open alerts and the handful of SARs from the last year been
        reviewed, and what did they reveal? — The open alerts and SAR history have
        not been reviewed and remain in diligence.
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:57:52+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-9196a6
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FACT-20260909-771ee1
    source_label: 'Reported fact: For the four new markets opened by the combined
      license footprint, what is the p…'
    source_class: reported_fact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: For the four new markets opened by the combined license footprint,
      what is the plan for state money transmission licensing or approval before onboarding
      those customers? — Mosaic Relay currently plans to use or assume Harbor's licenses
      for the four new markets.
    record_revision: e6406a3bd1f50e639bd2a80b90b8b8418fab5328796be348ebd9294b10a1aa36
    source_version: e6406a3bd1f50e639bd2a80b90b8b8418fab5328796be348ebd9294b10a1aa36
    support_state: supplied
    captured_record:
      fact_id: FACT-20260909-771ee1
      text: For the four new markets opened by the combined license footprint, what
        is the plan for state money transmission licensing or approval before onboarding
        those customers? — Mosaic Relay currently plans to use or assume Harbor's
        licenses for the four new markets.
      status: active
      material: true
      source_ids:
      - MSG-20260909-2e549e
      supersedes: null
      created_at: '2026-09-09T20:57:53+00:00'
      withdrawn_at: null
      action_id: ACT-20260909-a14129
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-29b823
    source_label: 'Assumption: Mosaic Relay''s existing money transmission licenses
      and Harbor''s MTLs are transf…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Mosaic Relay's existing money transmission licenses and Harbor's
      MTLs are transferable or can be maintained through the acquisition without new
      state approval
    record_revision: 6bbf08f9a29cb834f99d02b36d2f1a533c2c1f052af498c1f911328168198173
    source_version: 6bbf08f9a29cb834f99d02b36d2f1a533c2c1f052af498c1f911328168198173
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-29b823
      text: Mosaic Relay's existing money transmission licenses and Harbor's MTLs
        are transferable or can be maintained through the acquisition without new
        state approval
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:13+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-3c5756
    source_label: 'Assumption: The KYC pass/fail results are sufficient to satisfy
      Mosaic Relay''s own BSA/AML p…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: The KYC pass/fail results are sufficient to satisfy Mosaic
      Relay's own BSA/AML program obligations without the underlying documents
    record_revision: d8704a497bc488c00308423c8c4c84de72f254baf6bc4438b9a0277fdce05570
    source_version: d8704a497bc488c00308423c8c4c84de72f254baf6bc4438b9a0277fdce05570
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-3c5756
      text: The KYC pass/fail results are sufficient to satisfy Mosaic Relay's own
        BSA/AML program obligations without the underlying documents
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:13+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-1a519f
    source_label: 'Assumption: The transaction monitoring repoint can be completed
      and validated before close w…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: The transaction monitoring repoint can be completed and validated
      before close without a monitoring gap
    record_revision: 5284e24004ed96d9cb62560c984de23c2d79cf3f3101959154f716be314aec9e
    source_version: 5284e24004ed96d9cb62560c984de23c2d79cf3f3101959154f716be314aec9e
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-1a519f
      text: The transaction monitoring repoint can be completed and validated before
        close without a monitoring gap
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:13+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-944bfb
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-ca7dfd
    source_label: 'Assumption: Harbor Pay is a licensed money transmitter subject
      to state MTL regimes and fede…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Harbor Pay is a licensed money transmitter subject to state
      MTL regimes and federal BSA/AML obligations (not yet confirmed).
    record_revision: f00799f59f5f463b3a747591c42456afd45fe79ba0e351b24c0cd8133e24f7d8
    source_version: f00799f59f5f463b3a747591c42456afd45fe79ba0e351b24c0cd8133e24f7d8
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-ca7dfd
      text: Harbor Pay is a licensed money transmitter subject to state MTL regimes
        and federal BSA/AML obligations (not yet confirmed).
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:14+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-d40239
    source_label: 'Assumption: Mosaic Relay is itself a licensed money transmitter
      in 41 states (per the reques…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: Mosaic Relay is itself a licensed money transmitter in 41 states
      (per the request).
    record_revision: 0dceb99776c468b02213259c2c0eedb7849ce51e3431061c3ba30542e8c4c939
    source_version: 0dceb99776c468b02213259c2c0eedb7849ce51e3431061c3ba30542e8c4c939
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-d40239
      text: Mosaic Relay is itself a licensed money transmitter in 41 states (per
        the request).
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:14+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ASM-20260909-57e86b
    source_label: 'Assumption: The acquisition is structured as an asset or stock
      purchase, which affects wheth…'
    source_class: generated_assumption
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: The acquisition is structured as an asset or stock purchase,
      which affects whether Harbor's licenses and SAR/alert obligations transfer (structure
      not yet confirmed).
    record_revision: da8f5deb9971a73a6ec38a12c82da0eb810487512a4180c48d63f44c898034f1
    source_version: da8f5deb9971a73a6ec38a12c82da0eb810487512a4180c48d63f44c898034f1
    support_state: supplied
    captured_record:
      assumption_id: ASM-20260909-57e86b
      text: The acquisition is structured as an asset or stock purchase, which affects
        whether Harbor's licenses and SAR/alert obligations transfer (structure not
        yet confirmed).
      reason: Needed to continue
      material: true
      status: open
      created_at: '2026-09-09T20:53:14+00:00'
      resolved_at: null
      withdrawn_at: null
      action_id: ACT-20260909-44937b
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ISS-c9d7c39f63-94e42e2b38090045
    source_label: 'Issue: Money transmission licensing: whether Mosaic Relay can operate
      under the combine…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: 'Money transmission licensing: whether Mosaic Relay can operate
      under the combined 44-state footprint and whether Harbor''s MTLs transfer/survive
      the acquisition'
    record_revision: e3c75265de56e31904c904d669fcef240d5f97f29fde7a20c29e141a5dc0ff24
    source_version: e3c75265de56e31904c904d669fcef240d5f97f29fde7a20c29e141a5dc0ff24
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-94e42e2b38090045
      parent_issue_id: null
      title: 'Money transmission licensing: whether Mosaic Relay can operate under
        the combined 44-state footprint and whether Harbor''s MTLs transfer/survive
        the acquisition'
      why_it_matters: ''
      fact_ids: []
      assumption_ids: []
      claim_ids: []
      lawyer_state: open
      disposition: null
      disposition_reason: ''
      disposition_history: []
      linked_work_item_ids: []
      linked_decision_ids: []
      priority_reason: ''
      next_action: ''
      action_owner: ''
      updated_at: null
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ISS-c9d7c39f63-ca95e529feeb1045
    source_label: 'Issue: BSA/AML and KYC: whether relying on Harbor''s prior KYC
      (with missing underlying …'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: 'BSA/AML and KYC: whether relying on Harbor''s prior KYC (with
      missing underlying documents for pre-2023 users) satisfies Mosaic Relay''s independent
      CIP/AML obligations'
    record_revision: 14a3a2f29a2d53ff9fe295e73ac576372d9d042ff533a921dcece117c51f4fd2
    source_version: 14a3a2f29a2d53ff9fe295e73ac576372d9d042ff533a921dcece117c51f4fd2
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-ca95e529feeb1045
      parent_issue_id: null
      title: 'BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing
        underlying documents for pre-2023 users) satisfies Mosaic Relay''s independent
        CIP/AML obligations'
      why_it_matters: ''
      fact_ids: []
      assumption_ids: []
      claim_ids: []
      lawyer_state: open
      disposition: null
      disposition_reason: ''
      disposition_history: []
      linked_work_item_ids: []
      linked_decision_ids: []
      priority_reason: ''
      next_action: ''
      action_owner: ''
      updated_at: null
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ISS-c9d7c39f63-69af3f282d21ef38
    source_label: 'Issue: SAR and alert handling: obligations to review, file, and
      manage Harbor''s ~40 ope…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: 'SAR and alert handling: obligations to review, file, and manage
      Harbor''s ~40 open alerts and SARs, and successor liability'
    record_revision: 1c4a3c2d384a3c4031a6736884b4ff69f24a5bc26028ed3f623d9db0b1994a5b
    source_version: 1c4a3c2d384a3c4031a6736884b4ff69f24a5bc26028ed3f623d9db0b1994a5b
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-69af3f282d21ef38
      parent_issue_id: null
      title: 'SAR and alert handling: obligations to review, file, and manage Harbor''s
        ~40 open alerts and SARs, and successor liability'
      why_it_matters: ''
      fact_ids: []
      assumption_ids: []
      claim_ids: []
      lawyer_state: open
      disposition: null
      disposition_reason: ''
      disposition_history: []
      linked_work_item_ids: []
      linked_decision_ids: []
      priority_reason: ''
      next_action: ''
      action_owner: ''
      updated_at: null
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ISS-c9d7c39f63-4825f0af7ec75542
    source_label: 'Issue: Monitoring vendor transition: continuity of transaction
      monitoring when the SaaS…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: 'Monitoring vendor transition: continuity of transaction monitoring
      when the SaaS contract terminates at close'
    record_revision: da7c0564749468277ce3f5d768fb599fa406e29fad479da6b6b7b47414a1613c
    source_version: da7c0564749468277ce3f5d768fb599fa406e29fad479da6b6b7b47414a1613c
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-4825f0af7ec75542
      parent_issue_id: null
      title: 'Monitoring vendor transition: continuity of transaction monitoring when
        the SaaS contract terminates at close'
      why_it_matters: ''
      fact_ids: []
      assumption_ids: []
      claim_ids: []
      lawyer_state: open
      disposition: null
      disposition_reason: ''
      disposition_history: []
      linked_work_item_ids: []
      linked_decision_ids: []
      priority_reason: ''
      next_action: ''
      action_owner: ''
      updated_at: null
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: ISS-c9d7c39f63-72810d0a43d3ce66
    source_label: 'Issue: Marketing compliance: the $50 welcome bonus offer and any
      state money transmissi…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: 'Marketing compliance: the $50 welcome bonus offer and any
      state money transmission or consumer protection implications'
    record_revision: 78a87e666b50738d77c27d8f7212a76c8f76e40222ada23f78d752299ce957de
    source_version: 78a87e666b50738d77c27d8f7212a76c8f76e40222ada23f78d752299ce957de
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-72810d0a43d3ce66
      parent_issue_id: null
      title: 'Marketing compliance: the $50 welcome bonus offer and any state money
        transmission or consumer protection implications'
      why_it_matters: ''
      fact_ids: []
      assumption_ids: []
      claim_ids: []
      lawyer_state: open
      disposition: null
      disposition_reason: ''
      disposition_history: []
      linked_work_item_ids: []
      linked_decision_ids: []
      priority_reason: ''
      next_action: ''
      action_owner: ''
      updated_at: null
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: WI-20260909-dc797b
    source_label: 'Work item: Orient to the request'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md
    available_excerpt: Orient to the request
    record_revision: 72e56d0c3480dc436ef53a7b9450fc607d840e50ab6824d272b5ffdc3f3ea980
    source_version: 72e56d0c3480dc436ef53a7b9450fc607d840e50ab6824d272b5ffdc3f3ea980
    support_state: supplied
    captured_record:
      work_item_id: WI-20260909-dc797b
      matter_id: MAT-20260909-d89ad8
      path: 03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md
      title: Orient to the request
      description: Confirm the business objective, timing, and facts needed to frame
        the legal work.
      item_type: question
      status: done
      priority: normal
      owner: Lawyer
      due_at: null
      required: 1
      issue_id: null
      created_at: '2026-09-09T20:52:45+00:00'
      completed_at: '2026-09-09T20:56:35+00:00'
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FILE-000357e0a9c6a0ad233f
    source_label: 'facts.md: # Known Facts


      - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~1…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/facts.md
    available_excerpt: '# Known Facts


      - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).

      - Migration moves 240k consumer users and 12k business accounts into Mosaic
      Relay''s app on day 1 post-close, with one unified account and balance and full
      access to Mosaic''s product set.

      - Plan is no re-verification; Harbor users were already KYC''d by Harbor.

      - Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay
      holds 41; combined footprint is 44 states, opening four new markets.

      - Harbor''s KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
      results for everyone but not the underlying documents for users onboarded before
      2023.

      - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint Harbor''s transaction feed at Mosaic''s engine
      on day 1.

      - Marketing wants a ''Welcome'' campaign with a $50 bonus on first transfer,
      launching close+1.

      - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
      year at Harbor; nobody has read them yet.

      - Migration moves 240k consumer users and 12k business accounts into Mosaic
      Relay''s app on day 1 post-close, with one unified account and balance.

      - Plan is no re-verification of Harbor''s existing KYC; Harbor users were already
      KYC''d.

      - Harbor''s KYC ran through a vendor that shut down in 2024; pass/fail results
      exist for everyone but underlying documents are missing for users onboarded
      before 2023.

      - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint the transaction feed to Mosaic Relay''s engine
      on day 1.

      - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
      year at Harbor; none have been read yet.

      - How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic buys
      Harbor''s assets)

      - Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
      prior KYC without re-verification, or is re-verification required? — Not sure
      / need to check with compliance

      - What is known about Harbor''s ~40 open alerts and the SARs from the last year?
      — Nothing reviewed yet — still in diligence

      - For the four new markets opened by the combined footprint, does Mosaic Relay
      plan to operate under Harbor''s existing licenses or apply for its own? — Use/assume
      Harbor''s licenses

      - For the pre-2023 Harbor users with no underlying KYC documents, what is the
      plan to satisfy Mosaic Relay''s own BSA/AML customer identification and recordkeeping
      obligations? — It is not yet known whether Mosaic Relay''s AML/CIP program permits
      reliance on Harbor''s prior KYC; compliance must confirm.

      - Have the ~40 open alerts and the handful of SARs from the last year been reviewed,
      and what did they reveal? — The open alerts and SAR history have not been reviewed
      and remain in diligence.

      - For the four new markets opened by the combined license footprint, what is
      the plan for state money transmission licensing or approval before onboarding
      those customers? — Mosaic Relay currently plans to use or assume Harbor''s licenses
      for the four new markets.


      ## Assumptions


      - [Assumption] Mosaic Relay''s existing money transmission licenses and Harbor''s
      MTLs are transferable or can be maintained through the acquisition without new
      state approval

      - [Assumption] The KYC pass/fail results are sufficient to satisfy Mosaic Relay''s
      own BSA/AML program obligations without the underlying documents

      - [Assumption] The transaction monitoring repoint can be completed and validated
      before close without a monitoring gap

      - [Assumption] Harbor Pay is a licensed money transmitter subject to state MTL
      regimes and federal BSA/AML obligations (not yet confirmed).

      - [Assumption] Mosaic Relay is itself a licensed money transmitter in 41 states
      (per the request).

      - [Assumption] The acquisition is structured as an asset or stock purchase,
      which affects whether Harbor''s licenses and SAR/alert obligations transfer
      (structure not yet confirmed).'
    record_revision: 3a02d2d003cd1a3ad638ac726d9299596bd252c3e3d1d4c3bd3a45b06da29045
    source_version: 3a02d2d003cd1a3ad638ac726d9299596bd252c3e3d1d4c3bd3a45b06da29045
    support_state: supplied
    captured_record:
      path: 03_Matters/harbor-2-d89ad8/facts.md
      name: facts.md
      content: '# Known Facts


        - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).

        - Migration moves 240k consumer users and 12k business accounts into Mosaic
        Relay''s app on day 1 post-close, with one unified account and balance and
        full access to Mosaic''s product set.

        - Plan is no re-verification; Harbor users were already KYC''d by Harbor.

        - Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay
        holds 41; combined footprint is 44 states, opening four new markets.

        - Harbor''s KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
        results for everyone but not the underlying documents for users onboarded
        before 2023.

        - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
        at close; plan is to repoint Harbor''s transaction feed at Mosaic''s engine
        on day 1.

        - Marketing wants a ''Welcome'' campaign with a $50 bonus on first transfer,
        launching close+1.

        - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
        year at Harbor; nobody has read them yet.

        - Migration moves 240k consumer users and 12k business accounts into Mosaic
        Relay''s app on day 1 post-close, with one unified account and balance.

        - Plan is no re-verification of Harbor''s existing KYC; Harbor users were
        already KYC''d.

        - Harbor''s KYC ran through a vendor that shut down in 2024; pass/fail results
        exist for everyone but underlying documents are missing for users onboarded
        before 2023.

        - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
        at close; plan is to repoint the transaction feed to Mosaic Relay''s engine
        on day 1.

        - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last
        year at Harbor; none have been read yet.

        - How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic buys
        Harbor''s assets)

        - Does Mosaic Relay''s AML/CIP program currently permit relying on another
        institution''s prior KYC without re-verification, or is re-verification required?
        — Not sure / need to check with compliance

        - What is known about Harbor''s ~40 open alerts and the SARs from the last
        year? — Nothing reviewed yet — still in diligence

        - For the four new markets opened by the combined footprint, does Mosaic Relay
        plan to operate under Harbor''s existing licenses or apply for its own? —
        Use/assume Harbor''s licenses

        - For the pre-2023 Harbor users with no underlying KYC documents, what is
        the plan to satisfy Mosaic Relay''s own BSA/AML customer identification and
        recordkeeping obligations? — It is not yet known whether Mosaic Relay''s AML/CIP
        program permits reliance on Harbor''s prior KYC; compliance must confirm.

        - Have the ~40 open alerts and the handful of SARs from the last year been
        reviewed, and what did they reveal? — The open alerts and SAR history have
        not been reviewed and remain in diligence.

        - For the four new markets opened by the combined license footprint, what
        is the plan for state money transmission licensing or approval before onboarding
        those customers? — Mosaic Relay currently plans to use or assume Harbor''s
        licenses for the four new markets.


        ## Assumptions


        - [Assumption] Mosaic Relay''s existing money transmission licenses and Harbor''s
        MTLs are transferable or can be maintained through the acquisition without
        new state approval

        - [Assumption] The KYC pass/fail results are sufficient to satisfy Mosaic
        Relay''s own BSA/AML program obligations without the underlying documents

        - [Assumption] The transaction monitoring repoint can be completed and validated
        before close without a monitoring gap

        - [Assumption] Harbor Pay is a licensed money transmitter subject to state
        MTL regimes and federal BSA/AML obligations (not yet confirmed).

        - [Assumption] Mosaic Relay is itself a licensed money transmitter in 41 states
        (per the request).

        - [Assumption] The acquisition is structured as an asset or stock purchase,
        which affects whether Harbor''s licenses and SAR/alert obligations transfer
        (structure not yet confirmed).

        '
      metadata:
        matter_id: MAT-20260909-d89ad8
        record_type: facts
        facts:
        - fact_id: FACT-20260909-182bcc
          text: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks
            out).
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-551367
          text: Migration moves 240k consumer users and 12k business accounts into
            Mosaic Relay's app on day 1 post-close, with one unified account and balance
            and full access to Mosaic's product set.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-9a0c61
          text: Plan is no re-verification; Harbor users were already KYC'd by Harbor.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-33293c
          text: Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic
            Relay holds 41; combined footprint is 44 states, opening four new markets.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-aea8ec
          text: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic has
            pass/fail results for everyone but not the underlying documents for users
            onboarded before 2023.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-073838
          text: Harbor's transaction monitoring is a third-party SaaS whose contract
            terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's
            engine on day 1.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-19aebc
          text: Marketing wants a 'Welcome' campaign with a $50 bonus on first transfer,
            launching close+1.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-adf2cb
          text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the
            last year at Harbor; nobody has read them yet.
          status: active
          material: true
          source_ids:
          - REQ-20260909-283892
          supersedes: null
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - fact_id: FACT-20260909-4c1fd8
          text: Migration moves 240k consumer users and 12k business accounts into
            Mosaic Relay's app on day 1 post-close, with one unified account and balance.
          status: active
          material: true
          source_ids:
          - MSG-20260909-9835ba
          supersedes: null
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - fact_id: FACT-20260909-f2c49f
          text: Plan is no re-verification of Harbor's existing KYC; Harbor users
            were already KYC'd.
          status: active
          material: true
          source_ids:
          - MSG-20260909-9835ba
          supersedes: null
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - fact_id: FACT-20260909-13d4c1
          text: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail
            results exist for everyone but underlying documents are missing for users
            onboarded before 2023.
          status: active
          material: true
          source_ids:
          - MSG-20260909-9835ba
          supersedes: null
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - fact_id: FACT-20260909-78d5cd
          text: Harbor's transaction monitoring is a third-party SaaS whose contract
            terminates at close; plan is to repoint the transaction feed to Mosaic
            Relay's engine on day 1.
          status: active
          material: true
          source_ids:
          - MSG-20260909-9835ba
          supersedes: null
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - fact_id: FACT-20260909-9f7bde
          text: Diligence flagged ~40 open alerts and 'a handful' of SARs from the
            last year at Harbor; none have been read yet.
          status: active
          material: true
          source_ids:
          - MSG-20260909-9835ba
          supersedes: null
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - fact_id: FACT-20260909-ed9f06
          text: How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic
            buys Harbor's assets)
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:56:00+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9497db
        - fact_id: FACT-20260909-b5e71e
          text: Does Mosaic Relay's AML/CIP program currently permit relying on another
            institution's prior KYC without re-verification, or is re-verification
            required? — Not sure / need to check with compliance
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:56:00+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9497db
        - fact_id: FACT-20260909-849b00
          text: What is known about Harbor's ~40 open alerts and the SARs from the
            last year? — Nothing reviewed yet — still in diligence
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:56:00+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9497db
        - fact_id: FACT-20260909-f0fb01
          text: For the four new markets opened by the combined footprint, does Mosaic
            Relay plan to operate under Harbor's existing licenses or apply for its
            own? — Use/assume Harbor's licenses
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:56:00+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9497db
        - fact_id: FACT-20260909-620c62
          text: For the pre-2023 Harbor users with no underlying KYC documents, what
            is the plan to satisfy Mosaic Relay's own BSA/AML customer identification
            and recordkeeping obligations? — It is not yet known whether Mosaic Relay's
            AML/CIP program permits reliance on Harbor's prior KYC; compliance must
            confirm.
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:57:52+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-7091da
        - fact_id: FACT-20260909-070aec
          text: Have the ~40 open alerts and the handful of SARs from the last year
            been reviewed, and what did they reveal? — The open alerts and SAR history
            have not been reviewed and remain in diligence.
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:57:52+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9196a6
        - fact_id: FACT-20260909-771ee1
          text: For the four new markets opened by the combined license footprint,
            what is the plan for state money transmission licensing or approval before
            onboarding those customers? — Mosaic Relay currently plans to use or assume
            Harbor's licenses for the four new markets.
          status: active
          material: true
          source_ids:
          - MSG-20260909-2e549e
          supersedes: null
          created_at: '2026-09-09T20:57:53+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-a14129
        sources:
        - source_id: REQ-20260909-283892
          kind: immutable_request
          label: Original request
          path: 03_Matters/harbor-2-d89ad8/request.md
          version: ''
          location: ''
          created_at: '2026-09-09T20:52:49+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-754cca
        - source_id: MSG-20260909-9835ba
          kind: conversation_message
          label: Matter intake response
          path: null
          version: ''
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-20855c
        - source_id: MSG-20260909-2e549e
          kind: conversation_message
          label: Matter intake response
          path: null
          version: ''
          location: ''
          created_at: '2026-09-09T20:56:00+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-c347a2
        - source_id: MSG-20260909-2e549e
          kind: conversation
          label: Reported answer
          path: null
          version: ''
          location: MSG-20260909-2e549e
          created_at: '2026-09-09T20:57:52+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-7091da
        - source_id: MSG-20260909-2e549e
          kind: conversation
          label: Reported answer
          path: null
          version: ''
          location: MSG-20260909-2e549e
          created_at: '2026-09-09T20:57:52+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-9196a6
        - source_id: MSG-20260909-2e549e
          kind: conversation
          label: Reported answer
          path: null
          version: ''
          location: MSG-20260909-2e549e
          created_at: '2026-09-09T20:57:53+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-a14129
        support:
        - support_id: SUP-20260909-f1b4e2
          fact_id: FACT-20260909-182bcc
          source_id: REQ-20260909-283892
          relationship: support
          statement: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10
            weeks out).
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-08cb52
          fact_id: FACT-20260909-551367
          source_id: REQ-20260909-283892
          relationship: support
          statement: Migration moves 240k consumer users and 12k business accounts
            into Mosaic Relay's app on day 1 post-close, with one unified account
            and balance and full access to Mosaic's product set.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-0d90cf
          fact_id: FACT-20260909-9a0c61
          source_id: REQ-20260909-283892
          relationship: support
          statement: Plan is no re-verification; Harbor users were already KYC'd by
            Harbor.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-e10882
          fact_id: FACT-20260909-33293c
          source_id: REQ-20260909-283892
          relationship: support
          statement: Harbor holds money transmitter licenses (MTLs) in 38 states;
            Mosaic Relay holds 41; combined footprint is 44 states, opening four new
            markets.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-eea757
          fact_id: FACT-20260909-aea8ec
          source_id: REQ-20260909-283892
          relationship: support
          statement: Harbor's KYC ran through a vendor that shut down in 2024; Mosaic
            has pass/fail results for everyone but not the underlying documents for
            users onboarded before 2023.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-443d01
          fact_id: FACT-20260909-073838
          source_id: REQ-20260909-283892
          relationship: support
          statement: Harbor's transaction monitoring is a third-party SaaS whose contract
            terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's
            engine on day 1.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-7cc15f
          fact_id: FACT-20260909-19aebc
          source_id: REQ-20260909-283892
          relationship: support
          statement: Marketing wants a 'Welcome' campaign with a $50 bonus on first
            transfer, launching close+1.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-3ec21f
          fact_id: FACT-20260909-adf2cb
          source_id: REQ-20260909-283892
          relationship: support
          statement: Diligence flagged ~40 open alerts and 'a handful' of SARs from
            the last year at Harbor; nobody has read them yet.
          location: ''
          created_at: '2026-09-09T20:53:13+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - support_id: SUP-20260909-ce35f6
          fact_id: FACT-20260909-182bcc
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10
            weeks out).
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-68355c
          fact_id: FACT-20260909-4c1fd8
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Migration moves 240k consumer users and 12k business accounts
            into Mosaic Relay's app on day 1 post-close, with one unified account
            and balance.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-a1f8ea
          fact_id: FACT-20260909-f2c49f
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Plan is no re-verification of Harbor's existing KYC; Harbor users
            were already KYC'd.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-5a5eab
          fact_id: FACT-20260909-33293c
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Harbor holds money transmitter licenses (MTLs) in 38 states;
            Mosaic Relay holds 41; combined footprint is 44 states, opening four new
            markets.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-ccd85e
          fact_id: FACT-20260909-13d4c1
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Harbor's KYC ran through a vendor that shut down in 2024; pass/fail
            results exist for everyone but underlying documents are missing for users
            onboarded before 2023.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-e29698
          fact_id: FACT-20260909-78d5cd
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Harbor's transaction monitoring is a third-party SaaS whose contract
            terminates at close; plan is to repoint the transaction feed to Mosaic
            Relay's engine on day 1.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-6ff656
          fact_id: FACT-20260909-19aebc
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Marketing wants a 'Welcome' campaign with a $50 bonus on first
            transfer, launching close+1.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - support_id: SUP-20260909-2770d9
          fact_id: FACT-20260909-9f7bde
          source_id: MSG-20260909-9835ba
          relationship: support
          statement: Diligence flagged ~40 open alerts and 'a handful' of SARs from
            the last year at Harbor; none have been read yet.
          location: ''
          created_at: '2026-09-09T20:53:14+00:00'
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        assumptions:
        - assumption_id: ASM-20260909-29b823
          text: Mosaic Relay's existing money transmission licenses and Harbor's MTLs
            are transferable or can be maintained through the acquisition without
            new state approval
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:13+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - assumption_id: ASM-20260909-3c5756
          text: The KYC pass/fail results are sufficient to satisfy Mosaic Relay's
            own BSA/AML program obligations without the underlying documents
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:13+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - assumption_id: ASM-20260909-1a519f
          text: The transaction monitoring repoint can be completed and validated
            before close without a monitoring gap
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:13+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-944bfb
        - assumption_id: ASM-20260909-ca7dfd
          text: Harbor Pay is a licensed money transmitter subject to state MTL regimes
            and federal BSA/AML obligations (not yet confirmed).
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:14+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - assumption_id: ASM-20260909-d40239
          text: Mosaic Relay is itself a licensed money transmitter in 41 states (per
            the request).
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:14+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        - assumption_id: ASM-20260909-57e86b
          text: The acquisition is structured as an asset or stock purchase, which
            affects whether Harbor's licenses and SAR/alert obligations transfer (structure
            not yet confirmed).
          reason: Needed to continue
          material: true
          status: open
          created_at: '2026-09-09T20:53:14+00:00'
          resolved_at: null
          withdrawn_at: null
          action_id: ACT-20260909-44937b
        conflicts: []
        actions:
        - action_id: ACT-20260909-754cca
          summary: Linked Original request
          actor: system
          created_at: '2026-09-09T20:52:49+00:00'
          status: applied
          created:
            facts: []
            sources:
            - REQ-20260909-283892
            support: []
            assumptions: []
          source_action_key: null
        - action_id: ACT-20260909-944bfb
          summary: Applied an Intake Agent turn
          actor: assistant
          created_at: '2026-09-09T20:53:13+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-182bcc
            - FACT-20260909-551367
            - FACT-20260909-9a0c61
            - FACT-20260909-33293c
            - FACT-20260909-aea8ec
            - FACT-20260909-073838
            - FACT-20260909-19aebc
            - FACT-20260909-adf2cb
            sources: []
            support:
            - SUP-20260909-f1b4e2
            - SUP-20260909-08cb52
            - SUP-20260909-0d90cf
            - SUP-20260909-e10882
            - SUP-20260909-eea757
            - SUP-20260909-443d01
            - SUP-20260909-7cc15f
            - SUP-20260909-3ec21f
            assumptions:
            - ASM-20260909-29b823
            - ASM-20260909-3c5756
            - ASM-20260909-1a519f
          source_action_key: chat:RUN-20260909-adcddd:tool:81a64318c8ddfceeba36a911
        - action_id: ACT-20260909-20855c
          summary: Linked Matter intake response
          actor: system
          created_at: '2026-09-09T20:53:14+00:00'
          status: applied
          created:
            facts: []
            sources:
            - MSG-20260909-9835ba
            support: []
            assumptions: []
          source_action_key: null
        - action_id: ACT-20260909-44937b
          summary: Applied an Intake Agent turn
          actor: assistant
          created_at: '2026-09-09T20:53:14+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-4c1fd8
            - FACT-20260909-f2c49f
            - FACT-20260909-13d4c1
            - FACT-20260909-78d5cd
            - FACT-20260909-9f7bde
            sources: []
            support:
            - SUP-20260909-ce35f6
            - SUP-20260909-68355c
            - SUP-20260909-a1f8ea
            - SUP-20260909-5a5eab
            - SUP-20260909-ccd85e
            - SUP-20260909-e29698
            - SUP-20260909-6ff656
            - SUP-20260909-2770d9
            assumptions:
            - ASM-20260909-ca7dfd
            - ASM-20260909-d40239
            - ASM-20260909-57e86b
          source_action_key: experimental:902c1082-8933-4f35-be7c-163433bd0a08:tool:c311bec76624632dd2efd032
        - action_id: ACT-20260909-c347a2
          summary: Linked Matter intake response
          actor: system
          created_at: '2026-09-09T20:56:00+00:00'
          status: applied
          created:
            facts: []
            sources:
            - MSG-20260909-2e549e
            support: []
            assumptions: []
          source_action_key: null
        - action_id: ACT-20260909-9497db
          summary: Recorded intake question answers
          actor: user
          created_at: '2026-09-09T20:56:00+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-ed9f06
            - FACT-20260909-b5e71e
            - FACT-20260909-849b00
            - FACT-20260909-f0fb01
            sources: []
            support: []
            assumptions: []
          source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf:answers
        - action_id: ACT-20260909-7091da
          summary: Reported answer to supporting question
          actor: user
          created_at: '2026-09-09T20:57:52+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-620c62
            sources:
            - MSG-20260909-2e549e
            support: []
            assumptions: []
          source_action_key: workspace:workspace:d26fe7118afd55388fb9f7efc30995e5ecdf14973b4b36937e1ed50b21b2222e:answer
        - action_id: ACT-20260909-9196a6
          summary: Reported answer to supporting question
          actor: user
          created_at: '2026-09-09T20:57:52+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-070aec
            sources:
            - MSG-20260909-2e549e
            support: []
            assumptions: []
          source_action_key: workspace:workspace:f5233f9517feca0323f8898b818808c22023079e659354cf126a4701feb2d5c9:answer
        - action_id: ACT-20260909-a14129
          summary: Reported answer to supporting question
          actor: user
          created_at: '2026-09-09T20:57:53+00:00'
          status: applied
          created:
            facts:
            - FACT-20260909-771ee1
            sources:
            - MSG-20260909-2e549e
            support: []
            assumptions: []
          source_action_key: workspace:workspace:696cd84283dc3a90b6fc1cbcf9d74a3be5d4cdb402afd6660f167ad60079b3f0:answer
        working_ask: Does the Harbor Pay acquisition migration require legal review
          before the Nov 15 close, and what legal workstreams must be addressed pre-close
          (money transmission licensing, KYC/BSA-AML, SAR/alerts handling, monitoring
          vendor transition, and the welcome bonus campaign)?
        issues:
        - 'Money transmission licensing: whether Mosaic Relay can operate under the
          combined 44-state footprint and whether Harbor''s MTLs transfer/survive
          the acquisition'
        - 'BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
          documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML
          obligations'
        - 'SAR and alert handling: obligations to review, file, and manage Harbor''s
          ~40 open alerts and SARs, and successor liability'
        - 'Monitoring vendor transition: continuity of transaction monitoring when
          the SaaS contract terminates at close'
        - 'Marketing compliance: the $50 welcome bonus offer and any state money transmission
          or consumer protection implications'
        open_questions:
        - Acquisition structure (asset vs. stock purchase) — determines whether Harbor's
          MTLs and regulatory obligations transfer to Mosaic Relay
        - Whether Harbor's state MTLs can be assumed/transferred or must be re-applied
          for in the four new markets
        - Whether Mosaic Relay's own AML program and CIP can lawfully rely on Harbor's
          prior KYC without re-verification
        - Details of the ~40 open alerts and SARs (nature, age, whether any are unresolved
          or reportable)
        - Whether the $50 welcome bonus is a deposit/interest-like offer implicating
          state money transmission or consumer protection rules
        public_research_questions:
        - State money transmitter license transfer/assumption requirements in an acquisition
          context
        - BSA/AML CIP obligations when relying on a prior financial institution's
          KYC in a merger/acquisition
        - Successor obligations for open SARs and alerts in an acquisition
        intake_answers:
        - answer_id: ANS-20260909-20ba3f
          question_id: Q-ACQ-STRUCTURE
          question: How is the Harbor Pay acquisition structured?
          answer: Asset purchase (Mosaic buys Harbor's assets)
          values:
          - asset_purchase
          status: answered
          record_target: fact
          source_id: MSG-20260909-2e549e
          source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
          answered_at: '2026-09-09T20:56:00+00:00'
          answer_fact_id: FACT-20260909-ed9f06
        - answer_id: ANS-20260909-da570f
          question_id: Q-KYC-RELY
          question: Does Mosaic Relay's AML/CIP program currently permit relying on
            another institution's prior KYC without re-verification, or is re-verification
            required?
          answer: Not sure / need to check with compliance
          values:
          - unknown
          status: answered
          record_target: fact
          source_id: MSG-20260909-2e549e
          source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
          answered_at: '2026-09-09T20:56:00+00:00'
          answer_fact_id: FACT-20260909-b5e71e
        - answer_id: ANS-20260909-9e7b7a
          question_id: Q-SAR-ALERTS
          question: What is known about Harbor's ~40 open alerts and the SARs from
            the last year?
          answer: Nothing reviewed yet — still in diligence
          values:
          - unreviewed
          status: answered
          record_target: fact
          source_id: MSG-20260909-2e549e
          source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
          answered_at: '2026-09-09T20:56:00+00:00'
          answer_fact_id: FACT-20260909-849b00
        - answer_id: ANS-20260909-1833c6
          question_id: Q-MTL-NEW-MARKETS
          question: For the four new markets opened by the combined footprint, does
            Mosaic Relay plan to operate under Harbor's existing licenses or apply
            for its own?
          answer: Use/assume Harbor's licenses
          values:
          - use_harbor_licenses
          status: answered
          record_target: fact
          source_id: MSG-20260909-2e549e
          source_action_key: experimental:a983e094-d247-45c1-955b-7cb3d672dbbf
          answered_at: '2026-09-09T20:56:00+00:00'
          answer_fact_id: FACT-20260909-f0fb01
        intake_state: complete
      updated_at: 1788987473.1044135
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: FILE-b17b54a09cf7289a35e8
    source_label: 'request.md: # Original Request


      From: Dana, PM — Growth & Integration

      Subject: Harbor migrat…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/request.md
    available_excerpt: '# Original Request


      From: Dana, PM — Growth & Integration

      Subject: Harbor migration — anything here need legal?


      We''re acquiring Harbor Pay. Close is targeted Nov 15 (~10 weeks). Migration
      plan:


      240k consumer users, 12k business accounts move into our app on day 1 post-close.
      One unified account, one balance, full access to our product set.

      No re-verification — they were already KYC''d by Harbor.

      Harbor holds MTLs in 38 states, we hold 41. Combined that''s 44 — nice win,
      opens four new markets.

      Harbor''s KYC ran through a vendor that shut down in 2024. We have pass/fail
      results for everyone, but not the underlying documents for users onboarded before
      2023.

      Harbor''s monitoring is a third-party SaaS whose contract terminates at close.
      Plan is to repoint their transaction feed at our engine on day 1.

      Marketing wants a "Welcome" campaign with a $50 bonus on first transfer, launching
      close+1.

      Diligence flagged that Harbor has ~40 open alerts and "a handful" of SARs from
      the last year. Nobody''s read them yet.


      Does any of this need legal before close? It''s really just a data migration.'
    record_revision: efffedcfa464ce1d116020dc7a5cc0c7ac257a5a13b0624e00f6ee8431259b78
    source_version: efffedcfa464ce1d116020dc7a5cc0c7ac257a5a13b0624e00f6ee8431259b78
    support_state: supplied
    captured_record:
      path: 03_Matters/harbor-2-d89ad8/request.md
      name: request.md
      content: '# Original Request


        From: Dana, PM — Growth & Integration

        Subject: Harbor migration — anything here need legal?


        We''re acquiring Harbor Pay. Close is targeted Nov 15 (~10 weeks). Migration
        plan:


        240k consumer users, 12k business accounts move into our app on day 1 post-close.
        One unified account, one balance, full access to our product set.

        No re-verification — they were already KYC''d by Harbor.

        Harbor holds MTLs in 38 states, we hold 41. Combined that''s 44 — nice win,
        opens four new markets.

        Harbor''s KYC ran through a vendor that shut down in 2024. We have pass/fail
        results for everyone, but not the underlying documents for users onboarded
        before 2023.

        Harbor''s monitoring is a third-party SaaS whose contract terminates at close.
        Plan is to repoint their transaction feed at our engine on day 1.

        Marketing wants a "Welcome" campaign with a $50 bonus on first transfer, launching
        close+1.

        Diligence flagged that Harbor has ~40 open alerts and "a handful" of SARs
        from the last year. Nobody''s read them yet.


        Does any of this need legal before close? It''s really just a data migration.

        '
      metadata:
        request_id: REQ-20260909-283892
        matter_id: MAT-20260909-d89ad8
        original_text_preserved: true
        immutable: true
        received_at: '2026-09-09T20:52:45+00:00'
        requester: Product
        business_objective: 'From: Dana, PM — Growth & Integration

          Subject: Harbor migration — anything here need legal?


          We''re acquiring Harbor Pay. Close is targeted Nov 15 (~10 weeks). Migration
          plan:


          240k consumer users, 12k business accounts m'
        requested_launch_date: '2026-09-11'
        urgency: normal
      updated_at: 1788987165.87061
    locator: null
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: SRC-37ee676da5b354ba8538
    source_version: 157583424427122470563f33ed38821b0b88597ae4bbab82e613e532750d12bf
    source_hash: 157583424427122470563f33ed38821b0b88597ae4bbab82e613e532750d12bf
    path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md
    url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
    title: '[PDF] CSBS Money Transmission Modernization Act'
    retrieved_at: '2026-09-11T16:49:12.824842+00:00'
    retrieval_method: document_extraction
    content_truncated: true
    source_type: unknown
    pages:
    - page: 1
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 0
      end: 4100
    - page: 2
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 4100
      end: 8281
    - page: 3
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 8281
      end: 10370
    - page: 4
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 10370
      end: 12901
    - page: 5
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 12901
      end: 16244
    - page: 6
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 16244
      end: 18674
    - page: 7
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 18674
      end: 21388
    - page: 8
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 21388
      end: 24060
    - page: 9
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 24060
      end: 26729
    - page: 10
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 26729
      end: 29142
    - page: 11
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 29142
      end: 32192
    - page: 12
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 32192
      end: 35010
    - page: 13
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 35010
      end: 37424
    - page: 14
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 37424
      end: 39410
    - page: 15
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 39410
      end: 42268
    - page: 16
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 42268
      end: 44651
    - page: 17
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 44651
      end: 47042
    - page: 18
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 47042
      end: 49531
    - page: 19
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 49531
      end: 51930
    - page: 20
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 51930
      end: 54687
    - page: 21
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 54687
      end: 57099
    - page: 22
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 57099
      end: 59734
    - page: 23
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 59734
      end: 62280
    - page: 24
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 62280
      end: 65102
    - page: 25
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 65102
      end: 67624
    - page: 26
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 67624
      end: 69633
    - page: 27
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 69633
      end: 71599
    - page: 28
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 71599
      end: 73754
    - page: 29
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 73754
      end: 75697
    - page: 30
      method: pdf_text
      image_path: null
      content_truncated: false
      warning: ''
      start: 75697
      end: 78390
    extraction_warnings: []
    original_file_path: 03_Matters/harbor-2-d89ad8/research/sources/8c13e0a468bd4a9bb31fc9b85afd9ba1e233a90d7aa515f1615d37865e9e007d/source.bin
    final_url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
    links: null
    support_state: retrieved
    available_excerpt: "Page 1 (pdf_text)\n \n1 \n \nCSBS MODEL MONEY TRANSMISSION
      MODERNIZATION ACT \nTABLE OF CONTENTS \nPage \nARTICLE I SHORT TITLE & PURPOSE
      .....................................................................................3
      \nSection 1.01 Short Title ....................................................................................................3
      \nSection 1.02 Purpose .........................................................................................................3
      \nARTICLE II DEFINITIONS ...........................................................................................................3
      \nSection 2.01 Definitions....................................................................................................3
      \nARTICLE III EXEMPTIONS .........................................................................................................8
      \nSection 3.01 Exemptions ..................................................................................................8
      \nSection 3.02 Authority to Require Demonstration of Exemption...................................10
      \nARTICLE IV IMPLEMENTATION, CONFIDENTIALITY, SUPERVISION & \nRELATIONSHIP TO
      FEDERAL LAW ......................"
    excerpt_notice: Opening excerpt for relevance only; select a literal passage before
      citing support.
    library_source_id: SRC-37ee676da5b354ba8538
    library_source_version: dd8e38dc121ab8ed7fe079b02c7e158a
    library_extraction_state: complete
    source_label: '[PDF] CSBS Money Transmission Modernization Act'
    locator: ''
    explanation: ''
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
  - source_id: SRC-71b20ecf65825d6522c4
    source_version: fa80c95c5393f45e8db00c170d35088f747cdbd51d194da43cdbb6e342cdfea0
    source_hash: fa80c95c5393f45e8db00c170d35088f747cdbd51d194da43cdbb6e342cdfea0
    path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md
    url: https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
    title: Money Transmitter Licensing | Department of Financial Services
    retrieved_at: '2026-09-11T16:49:13.970612+00:00'
    retrieval_method: direct_fetch
    content_truncated: false
    source_type: unknown
    pages: null
    extraction_warnings: null
    original_file_path: null
    final_url: null
    links:
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#main-content
    - https://www.dfs.ny.gov/
    - https://www.dfs.ny.gov/consumers
    - https://www.dfs.ny.gov/consumers/auto_insurance/Auto_resource_center
    - https://www.dfs.ny.gov/consumers/banking_money
    - https://www.dfs.ny.gov/consumers/disaster_flood
    - https://www.dfs.ny.gov/consumers/health_insurance/pharmacy-benefits-drug-prices
    - https://www.dfs.ny.gov/consumers/fraud_cyber_protection
    - https://www.dfs.ny.gov/consumers/health_insurance
    - https://www.dfs.ny.gov/consumers/help_for_homeowners
    - https://www.dfs.ny.gov/consumers/small_businesses
    - https://www.dfs.ny.gov/consumers/student_protection
    - https://www.dfs.ny.gov/apps_and_licensing
    - https://www.dfs.ny.gov/apps_and_licensing/annual_assessment_charges
    - https://www.dfs.ny.gov/apps_and_licensing/pharmacy_benefit_managers
    - https://www.dfs.ny.gov/apps_and_licensing/banks_and_trusts/home
    - https://www.dfs.ny.gov/apps_and_licensing/agents_and_brokers/home
    - https://www.dfs.ny.gov/apps_and_licensing/insurance_companies
    - https://www.dfs.ny.gov/apps_and_licensing/mortgage_companies
    - https://www.dfs.ny.gov/apps_and_licensing/virtual_currency_businesses
    - https://www.dfs.ny.gov/industry_guidance
    - https://www.dfs.ny.gov/cybersecurity
    - https://www.dfs.ny.gov/industry_guidance/climate_change
    - https://www.dfs.ny.gov/industry_guidance/diversity
    - https://www.dfs.ny.gov/industry_guidance/innovation
    - https://www.dfs.ny.gov/apps-and-licensing/health-insurers/health-equity-filing
    - https://www.dfs.ny.gov/industry_guidance/enforcement_actions
    - https://www.dfs.ny.gov/industry_guidance/circular_letters
    - https://www.dfs.ny.gov/industry_guidance/industry_letters
    - https://www.dfs.ny.gov/industry_guidance/regulations
    - https://www.dfs.ny.gov/reports_and_publications
    - https://www.dfs.ny.gov/Newsroom
    - https://www.dfs.ny.gov/reports_and_publications/exam_reports
    - https://www.dfs.ny.gov/reports_and_publications/DFS_annual_reports
    - https://www.dfs.ny.gov/reports_and_publications/other_reports
    - https://www.dfs.ny.gov/reports_and_publications/public_hearings
    - https://www.dfs.ny.gov/reports-and-publications/weekly-bulletins
    - https://www.dfs.ny.gov/About_Us
    - https://www.dfs.ny.gov/contact
    - https://www.dfs.ny.gov/complaint
    - https://www.dfs.ny.gov/contact_us/careers_with_dfs
    - https://www.dfs.ny.gov/procurement
    - https://myportal.dfs.ny.gov
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#top
    - https://www.dfs.ny.gov/cdn-cgi/l/email-protection#b58ae6c0d7dfd0d6c188f1d0c5d4c7c1d8d0dbc195dad395f3dcdbd4dbd6dcd4d995e6d0c7c3dcd6d0c68f95f8dadbd0cc95e1c7d4dbc6d8dcc1c1d0c795f9dcd6d0dbc6dcdbd293f7dad1cc88ddc1c1c5c68f9a9ac2c2c29bd1d3c69bdbcc9bd2dac39ad4c5c5c6ead4dbd1ead9dcd6d0dbc6dcdbd29ad8dadbd0cceac1c7d4dbc6d8dcc1c1d0c7c6
    - https://www.facebook.com/share.php?u=https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
    - https://twitter.com/intent/tweet?text=Money Transmitter Licensing&url=https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
    - https://www.dfs.ny.gov/apps_and_licensing/application_fee_schedule
    - https://www.dfs.ny.gov/apps_and_licensing/fingerprinting_procedure
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters#toc-sidebar
    - https://mortgage.nationwidelicensingsystem.org/SitePages/default.aspx
    - https://mortgage.nationwidelicensingsystem.org/slr/resources/sitepages/GettingStartedStateCo.aspx
    - https://mortgage.nationwidelicensingsystem.org/slr/PublishedStateDocuments/NY_Money_Transmitter-Company-Transition-Checklist.pdf
    - https://mortgage.nationwidelicensingsystem.org/slr/sitepages/DynamicLicenses.aspx?StateID=ny
    - https://www.dfs.ny.gov/apps_and_licensing/mt/annual_reports/nmls
    - https://www.dfs.ny.gov/apps_and_licensing/mt/annual_reports/non_nmls
    - https://mortgage.nationwidelicensingsystem.org/slr/Pages/DynamicLicenses.aspx?StateID=ny
    - https://www.dfs.ny.gov/apps_and_licensing/personal_questionnaire
    - https://www.dfs.ny.gov/apps_and_licensing/Instructions_on_background_inv_reports
    - https://www.dfs.ny.gov/apps_and_licensing/litigation_affidavit
    - https://www.dfs.ny.gov/apps_and_licensing/authority_release_info
    - https://www.dfs.ny.gov/cdn-cgi/l/email-protection#a7d1ced5d3d2c6cbc4d2d5d5c2c9c4dee7c3c1d489c9de89c0c8d1
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/bonds_ny_instruments
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/bonds_ny_traveler_checks
    - https://www.dfs.ny.gov/apps_and_licensing/money_transmitters/deposit_agreement
    - https://www.dfs.ny.gov/apps_and_licensing/financial_statement
    - https://www.dfs.ny.gov/apps_and_licensing/licensee_contact_update
    - https://www.dfs.ny.gov/apps_and_licensing/lost_license_affidavit
    - https://www.dfs.ny.gov/contact-us/check_our_faqs
    - https://www.dfs.ny.gov/contact_us/main
    - https://www.dfs.ny.gov/who_we_supervise
    - https://www.dfs.ny.gov/about_us/advisoryboards
    - https://govt.westlaw.com/nycrr/Index?bhcp=1&transitionType=Default&contextData=(sc.Default)
    - 'http://public.leginfo.state.ny.us/lawssrch.cgi?NVLWO:'
    - https://www.nysenate.gov/legislation
    - https://www.dfs.ny.gov/Accessibility
    - https://www.dfs.ny.gov/disclaimer
    - https://www.dfs.ny.gov/privacy
    - https://www.dfs.ny.gov/sitemap
    - https://www.dfs.ny.gov/language_assistance
    - https://www.linkedin.com/company/nydfs/
    - https://twitter.com/NYDFS
    - https://www.youtube.com/user/nysdfs
    - https://www.facebook.com/NYDFS/
    - https://www.instagram.com/nydfs/
    support_state: retrieved
    available_excerpt: Money Transmitter Licensing | Department of Financial Services
      Skip to main content DFS Global Navigation Header Department of Financial Services
      Consumer Information Consumer Information Auto Insurance Banking and Sending
      Money Disaster and Flood Resources Drug Prices and PBMs Fraud and Cyber Protection
      Healthcare Homeowners & Tenants Small Business Resources Student Loan Resources
      and Relief More... Applications & Filings Applications & Filings Application
      Fees & Assessments Pharmacy Benefit Managers Banks and Trusts Insurance Agents
      & Brokers Insurance Companies Mortgage Companies Virtual Currency Businesses
      More... Industry Guidance Industry Guidance Cybersecurity Resource Center Climate
      Change Diversity, Equity and Inclusion Innovation Health Equity Enforcement
      & Discipline Circular Letters Industry Letters Regulatory & Legislative Activities
      Reports & Publications Reports & Publications Newsroom Examinations & Exam Reports
      DFS Annual Reports Other Reports Hearings Weekly Bulletins About Us About Us
      Contact Us File a Complaint or Appeal Careers With DFS Newsroom Procurement
      Search Submit search DFS Portal Money Transmitter Licensing TOP Money Transmitter
      Licensing SHARE Sectio
    excerpt_notice: Opening excerpt for relevance only; select a literal passage before
      citing support.
    library_source_id: SRC-71b20ecf65825d6522c4
    library_source_version: d021ece0cde82565eb83511c8122c85b
    library_extraction_state: complete
    source_label: Money Transmitter Licensing | Department of Financial Services
    locator: ''
    explanation: ''
    output_revision: 6c682de9ecbe5beb8093f854c4b87778fabaef6e3487555bcb278808b92e5361
title: Generated dossier revision
source_records: *id001
---
# Harbor 2 matter dossier

## Current position

The Harbor Pay migration needs legal and compliance review before the planned Nov 15 close. This is the accepted working view. It is not a recorded decision.

Mosaic Relay plans an asset purchase. It then plans to move 240,000 consumer users and 12,000 business accounts into a unified Mosaic account on day one after close. Users would receive full access to Mosaic products.

The main obstacle is whether Mosaic has authority to provide each post-close service in every affected state. Mosaic should not assume that Harbor’s money transmitter licenses transfer with the purchased assets.

The other material obstacles are:

- Mosaic has not confirmed whether its anti-money-laundering and customer identification program permits reliance on Harbor’s prior know-your-customer results.
- Underlying identity documents are missing for users onboarded before 2023.
- Harbor’s approximately 40 open alerts and recent suspicious activity report history have not been reviewed.
- Harbor’s monitoring service ends at close. The replacement feed has not been validated.
- The terms and operating structure of the planned $50 welcome bonus are unknown.

The full day-one migration remains the planning baseline. State launch holds, account restrictions, or delayed product access remain possible safeguards if the open conditions are not resolved. No decisions are recorded.

### Assumptions used

- Harbor is a licensed money transmitter subject to applicable state and federal anti-money-laundering requirements. This assumption affects the licensing, customer identification, alert, and monitoring analysis.
- Mosaic will become the operating provider immediately after close. This affects whether Harbor can remain the licensed provider during a transition.
- The analysis does not assume that Harbor’s licenses transfer, that its prior identity checks satisfy Mosaic’s requirements, or that monitoring can continue without a gap.
- Mosaic’s reported 41-state license footprint is treated as a reported fact.
- The acquisition structure is no longer assumed to be unknown. The reported structure is an asset purchase.

### Record conflicts

- Mosaic reportedly has licenses in 41 states, and the combined footprint is 44 states. `44 − 41 = 3`, but the record says the acquisition opens four new markets. This affects which jurisdictions require new authority or launch restrictions. The license lists and the intended meaning of “market” are needed.
- Matter metadata gives a target date of `2026-09-11`. The reported close is “Nov 15,” approximately ten weeks after the Sept. 9 intake. A saved hypothetical uses November 15, 2026, but that does not establish the actual closing year. The operative close date and year remain unresolved.

## Decision question

Does any part of the Harbor Pay acquisition migration need legal review before the Nov 15 close?

## Issues

<!-- issue:ISS-c9d7c39f63-94e42e2b38090045 -->
### Money transmission licensing: whether Mosaic Relay can operate under the combined 44-state footprint and whether Harbor's MTLs transfer/survive the acquisition

**Current answer**

Mosaic should not treat Harbor’s money transmitter licenses as assets that automatically move to Mosaic in the asset purchase.

The acquisition may close separately from the service launch. Mosaic should not start regulated services in a state unless it has documented authority for the complete post-close activity.

**Rule and support**

The saved research concludes that the answer must be determined state by state. Review must cover Mosaic’s operating authority, transaction notices and approvals, interim operation, outstanding obligations, and Harbor’s license surrender.

Four sources were retrieved, but no relevant passages were read or verified. They do not establish an operative state rule:

- [Research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
- [CSBS Money Transmission Modernization Act — retrieved, but relevant passage not reviewed](03_Matters/harbor-2-d89ad8/research/sources/SRC-37ee676da5b354ba8538-157583424427.md)
- [New York Department of Financial Services licensing page — retrieved, but relevant passage not reviewed](03_Matters/harbor-2-d89ad8/research/sources/SRC-71b20ecf65825d6522c4-fa80c95c5393.md)

The model act is not proof of the law in any specific state.

**Application**

Harbor reportedly has licenses in 38 states. Mosaic reportedly has licenses in 41 states. Their combined footprint is reported as 44 states. Mosaic currently plans to use or assume Harbor’s licenses in the new markets.

The unified Mosaic account, combined balance, and access to Mosaic products suggest that Mosaic may become the actual service provider. If so, keeping Harbor’s entity or licenses active might not give Mosaic authority.

A transition in which Harbor remains the licensed provider is possible only if the customer contracts, funds flow, operating control, licenses, bonds, records, and applicable state rules support that result.

A partner bank holding funds would not, by itself, establish Mosaic’s authority. The answer depends on who contracts with users, controls transfers, owes repayment, maintains balances, resolves errors, and carries the regulated duties.

**Next step**

Identify the Harbor-only jurisdictions and prepare one state matrix covering:

- Mosaic’s authority for each post-close activity;
- notices, filings, approvals, and deadlines;
- operation while an application is pending;
- transfer of customer agreements and outstanding obligations;
- bank custody and control;
- Harbor’s run-off duties, bonds, and license surrender; and
- the launch restriction needed if authority is not established.

<!-- retained-issue:ISS-c9d7c39f63-94e42e2b38090045:start -->
<details>
<summary>Saved research and prior analysis</summary>

Do not rely on transferability without an applicable state rule, approval, or written regulator position.

The answer must be determined state by state and must cover more than technical change-of-control rules.

This path is possible only if Harbor remains the real provider and the relevant states permit the arrangement. The unified Mosaic account design may conflict with that position.

The result depends on the contracts and actual funds flow. Custody alone should not be treated as a licensing exemption or transfer mechanism.

Research saved. 4 sources retrieved; 0 with passages read.

Next step: Identify the four Harbor-only states and complete one matrix covering license authority, transaction filings, interim operation, bank custody, outstanding obligations, and license surrender.

<details>
<summary>Detailed analysis</summary>

**Practical answer**

**Do not treat Harbor’s money transmitter licenses as assets that move to Mosaic in the asset purchase.** Use this closing rule:

> **No confirmed authority means no regulated launch by Mosaic in that state.**

The asset purchase can still close. However, Mosaic should not activate regulated services in the four Harbor-only states unless one of these conditions is met:

1. Mosaic obtains its own license.
2. The state approves a transfer or other license change.
3. The regulator confirms a lawful interim structure.
4. Harbor remains the real licensed provider under a valid transition plan.
5. Mosaic blocks regulated functions in that state.

The planned unified Mosaic account is important. It suggests that Mosaic, not Harbor, will become the service provider. If that is correct, keeping Harbor’s legal entity and licenses alive might not give Mosaic authority to operate.

**No verified operative authority retrieved.** The collection found the CSBS Model Money Transmission Modernization Act and a New York regulator licensing page. However, no exact provision about an asset sale, license transfer, interim operation, or custody was available for review. Also, a model act is not proof of the law adopted in a specific state. The state-specific conclusions below remain conditional.

**Work needed before launch**

| Work | Why | Proposed owner | Needed by | Evidence to proceed | Fallback |
|---|---|---|---|---|---|
| Identify the four Harbor-only states | These states have the clearest authority gap | Licensing team | Now | Confirmed license list and covered activities | Block regulated functions in those states |
| Build a matrix for every affected state | Transfer, notice, approval, and surrender rules can differ | State regulatory counsel | Before the closing conditions are final | Applicable rule, filing deadline, regulator response, and license status | Delay migration in the affected state |
| Confirm the post-close service provider | The licensed entity must match the actual operating model | Product and deal counsel | Before customer notices and account design are final | Contracts, user interface, funds-flow diagram, and operating roles | Keep Harbor as the actual provider where permitted |
| Review notices and approvals | An asset sale can create separate seller and buyer requirements | Licensing team | Before each state deadline | Filing receipts and required approvals or non-objections | Make approval a state launch condition |
| Confirm interim operating authority | A pending application should not be assumed to permit operation | State regulatory counsel | Before close | Applicable rule or written regulator confirmation | Keep Harbor customers segregated or restrict transactions |
| Review partner-bank arrangements | Bank custody does not, by itself, establish Mosaic’s licensing position | Payments counsel and bank relationship owner | Before balances move | Bank agreements, account titles, control rights, reconciliation design, and bank consent | Keep funds and obligations in the existing structure |
| Prepare license run-off and surrender plans | Harbor may retain duties for balances, claims, records, and reports | Harbor compliance and deal counsel | Before surrender or operational shutdown | Regulator-approved plan and continued bonds and financial coverage | Keep Harbor licensed and operational longer |

**State notice and approval**

Do not search only for a rule called “license transfer.” Review each state for:

- sale of substantially all assets;
- change of control;
- change in business plan;
- change in licensed activities;
- assignment of outstanding payment obligations;
- change in responsible persons, locations, or agents;
- license surrender or termination;
- customer agreement assignment; and
- movement of stored balances or customer funds.

An asset purchase might fall outside a technical “change of control” rule because Harbor’s ownership does not change. That does not resolve the issue. Harbor might still need a notice or surrender approval. Mosaic might separately need authority before it starts the regulated activity.

The state matrix should distinguish:

- notice only;
- approval before closing;
- approval before customer migration;
- new license required;
- operation permitted while an application is pending;
- regulator-approved transition available; and
- no supported interim path.

**Interim operation**

Harbor could remain the licensed provider for a transition period. However, the structure must be real, not only contractual language.

A supportable structure would normally need to show that:

- Harbor remains responsible to customers.
- Customer terms name Harbor as the provider.
- Harbor controls the regulated activity as required.
- Harbor’s licenses, bonds, and financial coverage remain active.
- Customer funds and outstanding obligations remain covered.
- Harbor can complete reports, refunds, complaints, and examinations.
- Required records remain available.
- Mosaic’s operational role is permitted.
- The partner bank accepts the structure.
- Each relevant regulator permits or accepts the structure.

The present plan creates tension with this approach. A single Mosaic account, one combined balance, and full access to Mosaic products make it harder to show that Harbor remains the true provider.

**Partner-bank custody**

A partner bank account is not automatically a substitute for a money transmitter license. The key questions concern the complete activity and obligation flow.

For each customer balance and transfer, document:

1. Who receives the customer’s instruction?
2. Who accepts the obligation to transmit or return the funds?
3. In whose name is the bank account held?
4. Is it a custodial or “for benefit of” account?
5. Who can direct withdrawals?
6. Who owns the ledger and resolves errors?
7. Who bears loss if a transfer fails?
8. Which entity owes the customer a refund?
9. Which entity’s license, bond, and permissible investments cover the obligation?
10. Does the bank agreement permit assignment, migration, or a change in the program manager?
11. Is bank consent required before closing or migration?
12. What happens to funds if Harbor, Mosaic, or the bank relationship ends?

A bank-led model might provide a different licensing analysis if the bank is the actual provider and Mosaic performs only permitted services. A bank account that merely holds funds for Mosaic or Harbor is different. The legal documents, customer terms, control rights, and actual operations must all support the claimed model.

Also review:

- account segregation;
- daily reconciliation;
- shortfalls and reserve funding;
- bank setoff rights;
- liens and security interests;
- continuity if the account is frozen;
- treatment of pending transfers;
- return and chargeback duties;
- insolvency treatment;
- customer disclosures; and
- whether any deposit-insurance statement is accurate for the actual account structure.

**Recommended closing position**

Keep the acquisition closing separate from the regulated-service launch.

For the four Harbor-only states, use a state launch hold unless Mosaic has documented authority. For overlapping states, confirm that Mosaic’s existing licenses cover the complete post-close product set and funds flow.

Do not surrender Harbor’s licenses or release its bonds until the applicable regulators permit it and all outstanding obligations have been assigned, completed, or placed into an approved run-off structure.

This investigation does not change the current recommendation. It adds one material point: **partner-bank custody is part of the licensing analysis, but custody alone does not cure an authority gap.**

</details>

Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)

</details>
<!-- retained-issue:ISS-c9d7c39f63-94e42e2b38090045:end -->

<!-- issue:ISS-c9d7c39f63-ca95e529feeb1045 -->
### BSA/AML and KYC: whether relying on Harbor's prior KYC (with missing underlying documents for pre-2023 users) satisfies Mosaic Relay's independent CIP/AML obligations

**Current answer**

The current plan for no re-verification is not yet supported. Mosaic’s compliance team has not confirmed whether Mosaic’s anti-money-laundering and customer identification program permits reliance on Harbor’s prior checks.

Missing underlying documents prove a record gap. They do not by themselves prove that Harbor’s checks were invalid or that every affected user must be re-verified.

**Rule and support**

This issue has not been researched. The applicable duties depend on Mosaic’s regulated status, its written program, the legal basis for any reliance, and the records that Mosaic must retain or access.

The saved record does not establish that Mosaic may satisfy its own duties using only Harbor’s pass/fail results.

**Application**

Mosaic has pass/fail results for all Harbor users. It lacks underlying identity documents for users onboarded before 2023 because Harbor’s vendor closed in 2024.

The day-one plan would give migrated users a unified Mosaic account and full product access. If Mosaic’s program requires more evidence, the present data may not support unrestricted access for affected users.

A proportionate response could include targeted re-verification, limits on affected accounts, or delayed access. The correct response depends on Mosaic’s program and the applicable legal requirements.

**Next step**

Compliance should document:

- whether reliance on Harbor’s checks is permitted;
- what evidence supports that reliance;
- which records Mosaic must hold or be able to retrieve;
- how many users lack required evidence;
- whether risk-based remediation is allowed; and
- what account limits apply until remediation is complete.

<!-- retained-issue:ISS-c9d7c39f63-ca95e529feeb1045:start -->
Initial analysis — no completed research is saved for this issue.
<!-- retained-issue:ISS-c9d7c39f63-ca95e529feeb1045:end -->

<!-- issue:ISS-c9d7c39f63-69af3f282d21ef38 -->
### SAR and alert handling: obligations to review, file, and manage Harbor's ~40 open alerts and SARs, and successor liability

**Current answer**

The approximately 40 open alerts and recent suspicious activity report history should be reviewed through permitted diligence before Mosaic accepts unrestricted day-one operation.

Their unread status is a material information gap. It does not by itself prove a violation or establish that Mosaic inherits every Harbor obligation.

**Rule and support**

This issue has not been researched. Responsibility may depend on which entity detected the activity, when any reporting deadline arose, whether Harbor remains in operation, the asset-purchase terms, and Mosaic’s post-close handling of the accounts.

Access to suspicious activity reports and related material must follow applicable confidentiality and access rules. Diligence should not be treated as an instruction to disclose or transfer restricted material to an unauthorized person.

**Application**

No one has reviewed the alerts or the reported “handful” of suspicious activity reports from the last year. The record therefore does not show:

- the age or type of each alert;
- whether an investigation is complete;
- whether a filing deadline is pending;
- whether the same users will move to Mosaic;
- whether any issue changes the deal risk; or
- which entity will own each open case after close.

Moving the accounts without resolving these points could separate active cases from the data, staff, and systems needed to complete them.

**Next step**

Conduct a controlled review of the open cases and a permitted review of the filing history. Produce a case inventory that records status, deadlines, affected accounts, responsible entity, required records, and post-close ownership. Escalate any case that could affect migration eligibility or the transaction.

<!-- retained-issue:ISS-c9d7c39f63-69af3f282d21ef38:start -->
Initial analysis — no completed research is saved for this issue.
<!-- retained-issue:ISS-c9d7c39f63-69af3f282d21ef38:end -->

<!-- issue:ISS-c9d7c39f63-4825f0af7ec75542 -->
### Monitoring vendor transition: continuity of transaction monitoring when the SaaS contract terminates at close

**Current answer**

The transaction feed should be tested and validated before migrated users receive full access. The saved record does not establish that repointing the feed on day one will prevent a monitoring gap.

**Rule and support**

This issue has not been researched. The legal requirement depends on the anti-money-laundering duties that apply to the operating entity and on its risk-based monitoring program.

Operational evidence is needed to show that transactions remain visible, complete, timely, and subject to the correct rules and case process.

**Application**

Harbor’s monitoring contract ends at close. Mosaic plans to repoint Harbor’s transaction feed to Mosaic’s engine on day one.

This creates a single transition point with no saved evidence of:

- end-to-end testing;
- transaction and field reconciliation;
- rule coverage;
- alert creation and routing;
- handling of late or duplicate events;
- retention of historical data;
- ownership of cases across the cutoff; or
- a rollback or temporary monitoring plan.

The open Harbor alerts make continuity more important because historical cases may depend on data from both systems.

**Next step**

Complete an end-to-end test and retain evidence of transaction completeness, rule execution, alert routing, reconciliation, historical-data access, case ownership, and fallback operation. If the test fails, restrict or delay activity that cannot be monitored.

<!-- retained-issue:ISS-c9d7c39f63-4825f0af7ec75542:start -->
Initial analysis — no completed research is saved for this issue.
<!-- retained-issue:ISS-c9d7c39f63-4825f0af7ec75542:end -->

<!-- issue:ISS-c9d7c39f63-72810d0a43d3ce66 -->
### Marketing compliance: the $50 welcome bonus offer and any state money transmission or consumer protection implications

**Current answer**

The proposed $50 bonus needs review before its planned close-plus-one launch. The present record does not contain enough information to determine the required terms or disclosures.

The bonus is not shown to be a deposit, interest payment, or prohibited offer merely because it provides $50.

**Rule and support**

This issue has not been researched. The applicable rules depend on the actual offer, including eligibility, funding, transfer conditions, expiration, reversals, disclosures, and the states where it is offered.

The offer must also match the services Mosaic is authorized and operationally ready to provide.

**Application**

Marketing plans to offer $50 on a customer’s first transfer. The record does not state:

- who qualifies;
- who funds the payment;
- the required transfer amount or type;
- when the bonus becomes available;
- whether it can be reversed;
- whether users must remain active;
- how limitations will be disclosed; or
- whether the campaign will run in states subject to a launch hold.

Launching the offer before these points are settled could promise access or benefits that Mosaic cannot provide in an affected state.

**Next step**

Obtain the complete offer terms, customer-facing copy, funding flow, eligibility rules, state scope, timing, reversal rules, and complaint process. Review them against the approved launch footprint and actual product availability.

<!-- retained-issue:ISS-c9d7c39f63-72810d0a43d3ce66:start -->
Initial analysis — no completed research is saved for this issue.
<!-- retained-issue:ISS-c9d7c39f63-72810d0a43d3ce66:end -->

## Alternatives considered

<!-- alternative:SCN-0f23edfc89ec6ecaf60a13e4 -->
### Bank-held funds timing test — **Hypothetical — not adopted**

[Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-0f23edfc89ec6ecaf60a13e4.md)

**Assumptions**

For this test only:

- A bank would hold the relevant funds.
- Mosaic would control transfer instructions.
- The structure depends on completion of the bank contract and operating setup.
- Migration would occur on November 15, 2026.
- Bank integration would be ready on December 3, 2026.
- Pre-2023 identity documents would remain missing.
- Forty alert cases would remain pending.
- Harbor’s monitoring service would end at close.

**How it helps or hinders the objective**

Bank custody could change part of the funds-flow analysis. It does not establish that Mosaic can provide the regulated service.

On the test dates, this option makes the November 15 migration harder. December 3 readiness is 18 days after the hypothetical migration date.

**Added risks**

The option adds contract, bank approval, technical integration, and operating-setup dependencies. Failure to complete them on time would prevent use of the tested structure for the November 15 date.

**Issues left unresolved**

The option does not resolve the missing identity documents, pending alerts, monitoring transition, or the question of who is the actual regulated provider.

**Next action**

The saved working note proposes that Mara Chen obtain a dated bank readiness plan and confirm whether the bank can support November 15. The plan should also assign resolution of the identity-record gap, 40 pending alerts, and replacement monitoring. This is proposed work, not an assigned action.

<!-- alternative:SCN-406906c91ab0aba4313b54a6 -->
### Bank-held funds structure — **Hypothetical — not adopted**

[Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-406906c91ab0aba4313b54a6.md)

**Assumptions**

For this test only, a partner bank holds customer funds.

**How it helps or hinders the objective**

Bank custody could support a different analysis if the bank is the actual provider and Mosaic performs only permitted services. Custody alone does not transfer Harbor’s licenses or remove Mosaic’s possible licensing duties.

**Added risks**

The legal position would depend on customer contracts, control of transfer instructions, settlement, account titles, ledger control, repayment duties, bank consent, and actual operations. A structure that exists only in contract language would not resolve the operating-authority question.

**Issues left unresolved**

This option leaves open:

- who contracts with users;
- who controls transfers and settlement;
- who records balances and owes repayment;
- how customer identification duties are allocated;
- who monitors transactions;
- who manages alerts and suspicious activity reports;
- how privacy duties apply; and
- which entity is responsible for the bonus campaign.

**Next action**

Prepare the proposed bank agreements, customer terms, funds-flow diagram, control model, and duty allocation. Then compare the actual structure with the licensing matrix. No owner or due date is recorded.

## Next actions

All open actions below are proposed. No owner or due date has been assigned unless stated.

1. **Review Harbor’s open alerts and permitted suspicious activity report history.**  
   **Owner:** Not assigned.  
   **Date:** Not assigned.  
   **Evidence needed:** Case inventory, age, status, deadlines, affected accounts, responsible entity, and migration effect.

2. **Resolve the license footprint and authority for each affected state.**  
   **Owner:** Not assigned. The saved licensing analysis proposes the licensing team and state regulatory counsel.  
   **Date:** Not assigned.  
   **Evidence needed:** Confirmed license lists, covered activities, operative state rules, filing receipts, approvals or non-objections, and any written regulator position.

3. **Confirm whether Mosaic’s program permits reliance on Harbor’s prior customer checks.**  
   **Owner:** Not assigned. Compliance confirmation is required.  
   **Date:** Not assigned.  
   **Evidence needed:** Written program requirements, reliance basis, record requirements, affected-user count, and approved remediation or account limits.

4. **Validate transaction-monitoring continuity.**  
   **Owner:** Not assigned.  
   **Date:** Not assigned.  
   **Evidence needed:** End-to-end test results, reconciliation, rule coverage, alert routing, historical-data access, case ownership, and fallback results.

5. **Confirm the post-close service provider and funds flow.**  
   **Owner:** Not assigned. The saved licensing analysis proposes product and deal counsel.  
   **Date:** Not assigned.  
   **Evidence needed:** Customer contracts, user interface, account titles, funds-flow diagram, control rights, repayment duties, bank agreement, and bank consent.

6. **Review the complete $50 bonus proposal.**  
   **Owner:** Not assigned.  
   **Date:** Not assigned.  
   **Evidence needed:** Offer terms, copy, eligibility, funding, state scope, timing, reversals, disclosures, and complaint handling.

7. **Confirm the operative closing date and year.**  
   **Owner:** Not assigned.  
   **Date:** Not assigned.  
   **Evidence needed:** Current transaction timetable or executed deal document showing the close date.

The only recorded work item, [Orient to the request](03_Matters/harbor-2-d89ad8/work-items/WI-20260909-dc797b.md), is complete. It was owned by Lawyer and had no due date.

## Current work product and supporting records

- No current draft or final work-product path is saved.
- [Known facts](03_Matters/harbor-2-d89ad8/facts.md)
- [Original request](03_Matters/harbor-2-d89ad8/request.md)
- [Licensing research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)
- [Prior dossier revision](03_Matters/harbor-2-d89ad8/dossier-revisions/DOS-a339a10414a6329eff9f.md)
