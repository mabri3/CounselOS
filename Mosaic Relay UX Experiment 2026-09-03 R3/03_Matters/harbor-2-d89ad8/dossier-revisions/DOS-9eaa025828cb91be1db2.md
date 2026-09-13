---
publication_key: dossier-generation:DOSGEN-e1fc71ed77f9d9f1
revision_id: DOS-9eaa025828cb91be1db2
matter_id: MAT-20260909-d89ad8
record_type: dossier_revision
status: applied
base_content_hash: e4242fa79f3b92949785891f5244f2974e8cd7f13b04fe492c2bfec99c9f576f
content_hash: 6d4914a844763bdf7319b43938d045b749a6c509b5e5a32e66d165707af39d26
created_at: '2026-09-12T22:12:55+00:00'
immutable: true
dossier_generation:
  run_id: DOSGEN-e1fc71ed77f9d9f1
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
      needs.\nDo not add generic disclaimers or turn missing support into a refusal.\n\nThe
      North Star is the business's controlling question and objective, starting\nwith
      the original request and any explicit lawyer clarification or reframe.\nThe
      latest chat question is normally a supporting inquiry, not replacement\nscope.
      Answer the business question even when a later exchange is narrow.\nTest the
      premise behind the request. Explain when the evidence supports a\ndifferent
      answer, a changed route, or not proceeding. Do not force the facts\nto support
      the business's proposed solution or silently rewrite its question.\n\nAssess
      material issues from the current records and relevant history across\nall supplied
      matter conversations. The saved issue list is a starting point,\nnot a ceiling.
      Include a newly identified material issue in the Issues section,\nwith its source
      and effect on the business question. Use ordinary headings for\nissues without
      saved IDs; do not invent an ID or claim the issue list was changed.\nRead omitted
      passages through the captured-record reader when needed. Preserve\ntheir speaker,
      date, corrections and hypothetical scope. Do not claim that\navailable records
      were all read. Judge detail by its value to the business\nanswer and counsel's
      next decision, not a fixed depth-versus-breadth quota.\n\nOn a refresh, derive
      the current position again from the current records and\nsupported issue analysis.
      The prior dossier is fallible synthesis for continuity,\nnot a wording template
      or evidence that an activity is cleared. Keep useful\nreasoning, but replace
      conclusions and assumption labels that the current inputs\ndo not support. Preserve
      the recorded direction and decisions as records; explain\nseparately when this
      draft recommends a change. Retention of prior research means\nit stays accessible,
      not that its earlier conclusions must stay unchanged.\n\nWrite the general matter
      dossier, even when the conversation is exploring an\nalternative. The current
      direction stays the planning baseline. Recording a\nhypothetical in this document
      does not adopt it or change any reported fact.\n\n## Reading order\n\n1. A short
      title and **Current position**: answer the business question in a\n   short
      decision brief. Give the recommended course now, why it best serves\n   the
      objective, what can proceed, and what should wait or change. Name the\n   decisive
      conditions, not every information gap. Distinguish this draft's\n   recommendation
      from the accepted working view and any recorded decision.\n2. **Decision question**:
      reproduce the supplied controlling business question exactly. It\n   is the
      matter's scope, not a question for the model to replace.\n   If no question
      has been recorded, frame a provisional business question from\n   the original
      request; do not substitute the latest conversational subquestion.\n3. One **Issues**
      section covering EVERY supplied issue. Keep each issue's\n   stable identity
      with an invisible `<!-- issue:ISS-... -->` marker before its\n   heading. Do
      not substitute a second, different issue list.\n4. **Next actions**: a short,
      ranked work plan. For each action give the\n   deliverable, the result needed
      to proceed, the dependent decision or activity,\n   and the fallback if that
      result is not available. Order by dependencies and\n   time sensitivity, not
      merely the saved issue order. Reuse assigned work and\n   its recorded owner
      and date. When no assignment exists, suggest an owner\n   role and timing relative
      to a real milestone, clearly labeled **Proposed**.\n   Do not invent a person,
      commitment, legal deadline, or calendar date.\n   Distinguish a source-based
      deadline from a suggested working target.\n5. Brief links to available current
      work product, supporting records, and prior\n   revisions. Omit empty inventories
      and routine record housekeeping that does\n   not affect the decision. Do not
      paste the old dossier or superseded advice\n   into the body.\n\n## Each issue\n\nDefault
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
      merely that research is needed.\nMake the reasoning usable: identify the applicable
      actor, conduct, jurisdiction\nor contract, and the operative test. Apply each
      decisive condition to the known\nfacts. If a material fact is missing, explain
      the result on either side of that\nfact and recommend an interim course. A statement
      that something 'depends on\nthe terms' is incomplete unless it says which term
      matters and how it changes\nthe answer. Address a material exception or competing
      reading when it could\nchange the recommendation; do not invent one to fill
      a template.\n\nUse saved source passages to explain the rule and its material
      qualifications,\nwith the source and locator beside the proposition. A source
      title, URL, or\nopening excerpt alone is not the operative rule. Treat private
      agreements and\ncompany policies as those types of support, not public law.
      If no relevant\nauthority is saved, give the best conditional analysis and label
      that legal\npremise as unverified. State the precise research question once;
      do not repeat\n'not researched' in place of analysis or claim research happened
      in this run.\n\nConnect issues that affect the same decision. Explain what a
      proposed mitigation\nsolves, what it does not solve, and which dependency must
      be met first. Distinguish\na legal requirement from a recommended risk control
      or business preference.\nA possible way forward is not permission to proceed.
      Separating activities or\nmilestones does not establish that either is cleared;
      qualify the earlier step\nwhen its independent contractual or legal conditions
      are not established.\nThe application places full saved research in a disclosure
      under its issue;\ndo not create saved-research disclosures yourself, repeat
      old analysis, or add a\nsaved-answer appendix. Write the current synthesis;
      the application preserves\nthe original research separately.\n\n## Alternatives
      considered\n\nInclude this section when saved alternatives are supplied. Use
      one subsection\nper alternative, with its `<!-- alternative:SCN-... -->` marker
      and saved title.\nLabel it **Hypothetical — not adopted** (or archived, if the
      record says so).\nState its assumptions, how it helps or hinders the objective,
      added risks,\nissues it leaves unresolved, and the next action. Keep each alternative's\nworking
      note and attached test evidence within that alternative. Do not blend\nseparate
      proposals or treat a test assumption as an actual matter fact.\nInclude material
      dates, controls, and dependencies from the saved working note.\nLink the saved
      alternative. Do not infer acceptance or a recorded decision.\nFor each decisive
      condition, explain what the alternative changes and what still\napplies. A change
      in format, asset, actor, or channel does not itself remove a\npermission requirement
      or contractual restriction. If the saved terms do not\nsettle whether the restriction
      applies to the alternative, state that condition.\nDo not present uncertain
      exemption as the reason the fallback can proceed.\nCompare viable alternatives
      with the current direction on the factors that\nactually change the choice,
      such as timing, scope, cost, and unresolved risk.\nRecommend when to use each
      option. Do not give an unranked menu or assume that a\nfallback solves unrelated
      issues. New options proposed in this draft are not\nsaved alternatives, selected
      directions, or commitments.\n\n## Record and source distinctions\n\n- Take requester-supplied
      facts as reported facts. Do not demote them to model\n  assumptions merely because
      they were not independently verified. Flag a\n  material inconsistency when
      the records actually conflict.\n- Reconcile newer reported answers with older
      assumptions and open questions.\n  Check that material counts, dates, and totals
      agree. State the conflict and\n  its effect when they do not; do not silently
      choose a convenient value.\n  Check simple arithmetic and chronology when a
      conclusion depends on them.\n  Compare metadata with reported milestones. Put
      each material unresolved\n  inconsistency in **Record conflicts**, with the
      practical effect and the fact\n  needed to resolve it. Preserve the reported
      values; do not correct the record\n  or omit the inconsistency merely because
      the rest of the analysis can proceed.\n- Test the legal premise of an issue
      title. Name the relevant actor and explain\n  why a duty applies to that actor.
      Do not extend a rule to a different class\n  of entity without a basis, or treat
      every missing record as a breach. Where legal access to\n  sensitive records
      is restricted, distinguish permitted diligence from an\n  instruction to disclose
      or transfer the restricted material.\n- Keep model assumptions separate. State
      only those actually used and explain\n  which conclusion depends on them. Unknown
      facts remain unknown. Do not list\n  reported facts, resolved old assumptions,
      or things not assumed in this section.\n  An earlier assumption label does not
      override a later reported fact.\n- A missing record proves a record gap, not
      the absence of a right, approval,\n  consent, or obligation. Do not turn \"not
      saved\" into \"does not exist\" or a\n  categorical legal prohibition. Do not
      present an inferred business activity\n  as supplied fact. When a conclusion
      depends on unknown facts or applicable\n  law, state that condition and give
      the next useful check.\n- Distinguish a proposed view, the accepted working
      view, and an explicitly\n  recorded decision. Generating this document records
      no new decision.\n- Use the current direction's working note as fallible analysis,
      not facts.\n  Keep unresolved or stale findings qualified. Reconcile old dossier
      and research\n  assumptions against current records in the current answer; do
      not repeat a\n  superseded premise merely because preserved research still contains
      it.\n- Link support beside the claim it supports. Preserve supplied, retrieved,\n
      \ read, and verified source distinctions. Retrieval is not proof of support.\n
      \ An earlier model answer is not legal authority. Do not invent citations.\n-
      Use current support labels. Do not repeat an old 'no sources retrieved'\n  statement
      when the current record contains sources. State the actual gap.\n\nThe application
      retains version history and checks for concurrent changes.\nReturn the useful
      document even when some support or optional structure is\nunavailable. Do not
      change facts, issue status, recommendations, or decisions."
    enabled: true
    revision: e3a971907aae25fc89d3c1129bbfebf8f7fdf95b50d1b1073c18782233ac352a
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
    composition_revision: 876ca4ef35a8889c77bb67067a8cf762d764ae7eedb9064695c3674d3bf752d2
  selection:
    agent_id: counsel-copilot
    provider: opencode_go
    model: deepseek-v4.1-flash
    reasoning_effort: max
  warnings:
  - A requested saved-record read was unavailable. The writer used the material available.
  - Retained saved coverage for 6 issue(s) omitted from the writer's answer.
  basis:
    03_Matters/harbor-2-d89ad8/matter.md: cee7eb5dc33fdd5f76555a3425a8f464caedb61f8cce612576ecb4709045e0e9
    03_Matters/harbor-2-d89ad8/facts.md: 687ddce08339bd9f40be26added021fb711fcff60d7e5b4cb99556855bf79e83
    03_Matters/harbor-2-d89ad8/issues.md: 8f79fa68003e55992167e86193174a3f4558701eb90657382d90d979a2c92de7
    03_Matters/harbor-2-d89ad8/recommendations.md: 0bbfebd476e4fb421f4f5bcec368a53ea618da8bfdca2e4305d209999fb898dd
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
    03_Matters/harbor-2-d89ad8/participants.md: dd750c9f5477b812e2894a1a857aed2abb22693ea8138fdff960c560c1a7a438
    00_System/company.md: ffd2f4374ff1554f5e7281c65a940950a2656a32d61f68cc494a92075e8e3f8a
  dispatch_metrics:
  - original_bytes: 25677
    dispatched_bytes: 25677
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  - original_bytes: 34501
    dispatched_bytes: 34501
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  - original_bytes: 56128
    dispatched_bytes: 56128
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  - original_bytes: 79669
    dispatched_bytes: 79669
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  - original_bytes: 80306
    dispatched_bytes: 80306
    ceiling_bytes: 256000
    omitted_context_indices: []
    provider_usage: null
    requested_output_tokens: null
    state: completed
  record_reads:
  - status: success
    tool: read_dossier_record
    arguments:
      query: ''
    record_id: null
    start: null
    end: null
    matches: 128
  - status: success
    tool: read_dossier_record
    arguments:
      query: ''
      offset: 8
    record_id: null
    start: null
    end: null
    matches: 128
  - status: success
    tool: read_dossier_record
    arguments:
      record_id: current-records
      start: 0
      max_chars: 12000
    record_id: current-records
    start: 0
    end: 12000
    matches: null
  - status: success
    tool: read_dossier_record
    arguments:
      record_id: current-records
      start: 12000
      max_chars: 12000
    record_id: current-records
    start: 12000
    end: 24000
    matches: null
  - status: success
    tool: read_dossier_record
    arguments:
      query: ''
      offset: 16
    record_id: null
    start: null
    end: null
    matches: 128
  - status: error
    tool: read_dossier_record
    arguments:
      record_id: current-records
      start: 24000
      max_chars: 12000
    error: Saved-record evidence allowance reached. Finish from the material available.
  - status: error
    tool: read_dossier_record
    arguments:
      record_id: current-records
      start: 36000
      max_chars: 12000
    error: Saved-record evidence allowance reached. Finish from the material available.
  - status: error
    tool: read_dossier_record
    arguments:
      record_id: current-records
      start: 48000
      max_chars: 12000
    error: Saved-record evidence allowance reached. Finish from the material available.
  replayed_prepared_content: false
  raw_output: '# Harbor 2 — Harbor Pay acquisition migration (matter dossier)


    Matter MAT-20260909-d89ad8 · prepared from captured records dated Sep 9–10, 2026.
    Business question supplied by the matter record; direction unchanged.


    ## Current position


    Yes — material parts of the Harbor Pay migration need legal review before the
    Nov 15 close, and one item should be reviewed before the deal terms are settled,
    not merely before launch. This is not "just a data migration": the day-1 plan
    depends on results the records show are unconfirmed — license coverage in the
    added markets, the ability to rely on Harbor''s KYC without the underlying records,
    and a monitoring cutover with no gap.


    Three conditions decide how much of the full day-1 migration survives:


    - **Whether Mosaic can lawfully serve each added market on day 1.** The plan "use/assume
    Harbor''s licenses" is not established for an asset purchase. If approvals are
    missing, those markets are a post-close target, not day-1 access. (The number
    of added states is itself unresolved — see Record conflicts.)


    - **Whether Mosaic''s AML/CIP program and applicable rule permit reliance on Harbor''s
    prior KYC**, and whether the pre-2023 cohort with missing documents can keep full
    access without re-verification or limits.


    - **What the ~40 open alerts and the SAR history show**, and whether monitoring
    transfers without a gap. The alert/SAR review is the most decision-changing item
    because it can affect deal protections and how affected customers are handled
    at migration.


    The $50 bonus (launching close+1) and the customer-records/terms side of the data
    move do not block close on today''s record, but each must be reviewed before its
    own go-live point and each needs documents not in the readable record.


    What can proceed now: migration engineering, diligence, the compliance data pull,
    the licensing map, and standing up a controlled review protocol for the alerts/SARs.
    What should wait or change: launching the added markets on Harbor''s licenses;
    full-access onboarding of users whose verification cannot be evidenced; the monitoring
    cutover unless a tested no-gap design or a bridge exists; the bonus until its
    terms are reviewed.


    This draft recommends treating those items as pre-close gates and preparing a
    staged launch as the fallback. That is this draft''s recommendation, not a recorded
    decision. The recorded plan is unchanged: day-1 full migration, no re-verification,
    use/assume Harbor''s licenses, bonus at close+1. The only recorded lawyer decisions
    are the Sep 9 intake answers (asset purchase; compliance to confirm KYC reliance;
    alerts/SARs unreviewed; use/assume Harbor''s licenses). A complete dossier rewrite
    was submitted as a tracked revision on Sep 10 and, per the record, left the current
    dossier unchanged pending acceptance; generating this draft records no new decision.


    ## Decision question


    "Does any part of the Harbor Pay acquisition migration need legal review before
    the Nov 15 close?"


    ## Issues


    The four workstreams below are the recorded issue set from the Sep 9 initial issue
    map (MSG-20260909-efcbdd) and the lawyer''s "four issues" framing (MSG-20260909-539d02):
    licensing, KYC/AML, alerts and monitoring, and marketing. The saved issue list
    and its ISS identifiers were not inside this run''s readable material, so no issue
    IDs or markers are asserted here. A fifth issue, newly identified in this draft
    from the recorded migration plan, is included and labeled.


    Support status: no retrieved external authority appears in the readable records.
    The record shows the lawyer asked for research with sources (MSG-20260909-660683,
    MSG-20260909-406e0e), an initial "research is in progress" statement (MSG-20260909-168b9d)
    later corrected (MSG-20260909-91b5ec, MSG-20260909-b4cc1f), and a run described
    as "queued or running" with saved source choices (MSG-20260910-c27e90); no run
    output was readable here. Every legal proposition below is therefore a framework
    or lead, not verified support; named authorities carry **Needs checking**. Each
    issue gets an initial answer; any prior researched issue answers in the nine captured
    documents were not readable in this run and should be merged when available.


    ### 1. State money transmitter licensing for the added markets


    **Current answer**


    Not established for day 1. An asset purchase does not automatically carry Harbor''s
    money transmitter licenses to Mosaic, and a separate legal entity cannot simply
    "use" another company''s licenses. Until a state-by-state path exists — new license,
    transfer or change-of-control approval in the transaction, or an arrangement where
    the licensed entity performs the transmission — the added markets should be treated
    as post-close, not part of day-1 full access. Even where Mosaic holds its own
    license, the account migration may trigger state notices or filings (unverified).


    **Rule and support**


    State money transmitter statutes generally require a license, or status as an
    authorized delegate of a licensee, to transmit money for others; licenses are
    issued to a specific entity, and state approval is commonly required for a change
    of control or transfer of a licensed business [**Needs checking** — the MTL statutes
    of the specific states; the CSBS Money Transmission Modernization Act where adopted].
    Federal MSB registration (31 C.F.R. § 1022.380) is a separate requirement and
    does not substitute for state licensure [**Needs checking**]. The precise research
    question: for each state where Mosaic lacks a license and Harbor holds one, what
    route lets Mosaic lawfully serve migrated customers — new license, license transfer,
    change-of-control approval, or authorized-delegate arrangement — on what timeline,
    and what customer or regulator notices accompany the change?


    **Application**


    Recorded: asset purchase (intake answer, MSG-20260909-2e549e); Mosaic 41 licenses;
    Harbor 38; combined 44; plan "use/assume Harbor''s licenses"; full access on day
    1. Two gaps drive the answer. First, who will contract with the migrated customer
    and transmit funds after close — if it is a Mosaic entity, it needs a licensing
    footing in each required state; nothing in the record shows a license transfer
    or approval was requested or analyzed. Second, the states are unidentified and
    the counts do not reconcile (see Record conflicts), so the size of the problem
    is unknown. Because state approvals generally run longer than the time remaining
    (unverified, state-specific), the realistic interim course is to proceed with
    the closing while staging the customer onboarding by state, activating the added
    markets as approvals are obtained. Treat the "four new markets" win as a post-close
    target, not a day-1 entitlement, until the map shows otherwise. The recorded intake
    assumption that Harbor''s and Mosaic''s licenses are "transferable or can be maintained"
    remains an assumption, not a fact.


    **Next step**


    Commission the state-by-state matrix (state; Mosaic status; Harbor status; route;
    timeline; notices) and identify the entity that will serve migrated customers.
    Until it exists, keep the added markets out of the day-1 launch plan and out of
    launch commitments.


    ### 2. KYC: no re-verification, reliance on Harbor''s checks, and the pre-2023
    record gap


    **Current answer**


    Cannot be confirmed as planned. The plan — no re-verification, pass/fail flags
    only, missing underlying documents for pre-2023 users — depends on a compliance
    answer the record says is still open, and even a favorable answer may not cover
    the cohort with missing records. Working position: full day-1 access for users
    whose verification cannot be evidenced is not supported on the current record.
    Identify the cohort, then either re-verify it, document a permitted reliance with
    limits, or restrict functionality until resolved.


    **Rule and support**


    As a money services business, Mosaic must maintain an AML program (31 U.S.C. §
    5318(h); 31 C.F.R. § 1022.210) including customer identification (31 C.F.R. §
    1022.220), recordkeeping (31 C.F.R. §§ 1010.410, 1022.410), and — for the 12,000
    business accounts — customer due diligence and beneficial ownership (31 C.F.R.
    § 1010.230) [all **Needs checking**]. The banking CIP rule contains an express
    reliance-on-another-institution provision (31 C.F.R. § 1020.220(a)(6)); the MSB
    CIP rule is commonly read as not containing the same express provision, which
    is exactly why the compliance confirmation matters [**Needs checking** — the MSB
    CIP rule text and any FinCEN guidance on third-party or reliance arrangements].


    **Application**


    Recorded: compliance has not confirmed whether Mosaic''s program permits reliance;
    Harbor''s KYC vendor closed in 2024; pass/fail results exist for everyone; underlying
    documents are missing for pre-2023 users (count not recorded — material). Two
    outcomes follow. If reliance is permitted and the flags plus Harbor''s records
    suffice, the pre-2023 document gap may still be a deficiency depending on what
    must be retained — confirm what evidence is required and whether flags can substitute.
    If reliance is not permitted, or not available for the gap cohort, the plan fails
    as written for those users and the cure is re-verification or limited access.
    Either way, cohort size drives feasibility before close, and the vendor shutdown
    means Harbor cannot cure the document gap itself. Also unaddressed in the record:
    what Harbor collected for the business accounts, which the same diligence should
    cover. The recorded assumption that pass/fail results "are sufficient" remains
    unconfirmed.


    **Next step**


    Obtain a written compliance answer on reliance, plus counts and identifiers for
    the pre-2023 cohort and the business-account CDD records; then choose re-verification,
    documented reliance, or temporary access limits and build it into the launch.
    Fallback that preserves the close date: migrate all users, but hold full transacting
    for the unverified cohort until cured.


    ### 3. Unread alerts and SARs, and the monitoring cutover


    **Current answer**


    The highest-value pre-close review. Roughly 40 open alerts and "a handful" of
    recent SARs are unread; what they show could range from a routine backlog to unresolved
    suspicious activity that affects deal protections and how affected customers are
    handled at migration. Separately, the monitoring cutover (Harbor''s SaaS contract
    ends at close; the feed repoints to Mosaic''s engine on day 1) needs a tested
    no-gap plan or a bridge. Review access itself needs care: SAR information is confidential,
    so who reads what, and how, should be structured deliberately rather than by circulating
    files [unverified premise].


    **Rule and support**


    MSBs must report suspicious transactions and protect SAR confidentiality (31 C.F.R.
    § 1022.320), and effective monitoring is part of the AML program (§ 1022.210)
    [**Needs checking**]. Two research points sit underneath this issue: what Harbor
    may lawfully share with a prospective acquirer about SARs and alerts, and on what
    conditions; and how open alerts, investigations, and SAR-related records are handled
    at closing — who continues them and what transfers.


    **Application**


    Recorded: alerts and SARs unreviewed, "still in diligence" (MSG-20260909-2e549e);
    nobody has read them. The deal is therefore being priced without knowing whether
    Harbor missed filings or whether any customer being migrated is under active suspicion.
    Practical design: (a) run the review under privilege with controlled access, counsel-led,
    so SAR confidentiality and the deal record are both managed; (b) triage the open
    alerts for anything requiring action before close or account-level handling at
    migration; (c) use the findings for deal protections if needed. On monitoring,
    the record shows no test plan, and the cutover coincides with the day-1 migration
    — the moment of peak new activity. The decisive contract term is the SaaS contract''s
    termination and extension mechanics: confirm whether a short bridge or renewal
    is available; if not, plan parallel monitoring or a later repoint. Also decide
    who reviews alerts during the transition and how Harbor''s alert history carries
    into Mosaic''s engine. The recorded assumption that the repoint can be "completed
    and validated before close without a monitoring gap" is untested.


    **Next step**


    Approve a controlled review protocol and assign the review immediately (outside
    counsel leading, Mosaic compliance supporting — **Proposed**), then set a monitoring
    cutover test with a named go/no-go before migration. If the alerts review cannot
    finish before deal terms are set, convert it into a specific deal-protection item
    rather than letting it run over the close.


    ### 4. The $50 welcome bonus (launching close+1)


    **Current answer**


    Not a close blocker on the current record, but it needs review before it launches
    at close+1, and the review cannot start until the terms exist. The terms that
    decide the answer: eligibility (who gets it and who is excluded), credit mechanics
    (when and how the bonus is paid, conditions, clawbacks, expiration), the campaign
    disclosures and claims, and whether it targets any cohort whose access is limited
    by the KYC issue. If users under access limits cannot perform the qualifying transfer,
    promising them the bonus is a misleading-claim risk; if the design is clean, this
    is a contained terms-and-disclosure review.


    **Rule and support**


    Consumer-protection law on unfair or deceptive acts or practices (12 U.S.C. §§
    5531, 5536) [**Needs checking**], plus state advertising and money-transmission
    conduct rules and the campaign''s own terms [**Needs checking**].


    **Application**


    Recorded: marketing wants a $50 bonus on first transfer, launching close+1; no
    terms are in the record. The bonus interacts with three known conditions: the
    migration date itself (if day-1 access is staged by state or by verification cohort,
    the trigger may not be available to everyone), any account limits imposed for
    unverified users, and cross-marketing to customers whose data just moved (see
    Issue 5 — the customer terms and privacy commitments govern what marketing promises
    can be made). The review should confirm the campaign language matches what users
    can actually do at launch, and that conditions are disclosed where misunderstanding
    risk is highest — an incentive tied to completing a money transfer.


    **Next step**


    Obtain the marketing brief and draft terms; review and either clear or adjust
    before close+1. If the terms are not ready in time, delay the campaign — a later
    launch is cheaper than a walk-back.


    ### 5. Customer records, terms, and consent on the day-1 move (newly identified
    in this draft)


    **Current answer**


    Preliminary: the part of the plan described as "just a data migration" has legal
    dependencies of its own. The day-1 move transfers account relationships, balances,
    and personal data from Harbor''s entity to Mosaic. Whether that is permitted depends
    on clauses not in the readable record: the assignment or transfer terms in Harbor''s
    customer agreement, the data-sharing provisions in its privacy policy, and any
    notice obligations to customers or states. If notice or consent is required, that
    work runs before close, not after.


    **Rule and support**


    Customer contract rights transfer according to their terms and applicable assignment
    principles; privacy commitments run through the companies'' policies and privacy
    law (leads: GLBA, 15 U.S.C. § 6801 et seq.; FTC Safeguards Rule, 16 C.F.R. part
    314 [**Needs checking**]; state privacy statutes) and through what Harbor told
    customers about data sharing. This issue was not among the four recorded workstreams
    (licensing, KYC/AML, alerts and monitoring, marketing); it is identified here
    from the recorded migration plan itself, and flagged as such rather than as a
    saved issue.


    **Application**


    Recorded: 240,000 consumer users and 12,000 business accounts move into Mosaic''s
    app with one unified account and balance and full access — an asset purchase with
    no recorded consent or notice step. The decisive documents are Harbor''s customer
    agreement (assignment and change-of-terms clauses), its privacy policy (transfers
    to affiliates or successors; material-change notices), and any state-specific
    notice requirements for account or servicer changes [unverified]. Because the
    migration is day-1, a missing notice step is a schedule risk, not just paperwork:
    it could require sequencing the migration or a notice campaign between signing
    and close. Nothing in the readable record shows this workstream was reviewed.


    **Next step**


    Pull the customer agreement, privacy policy, and business-account terms; confirm
    transfer permissions and any notice periods; if notices are needed, start them
    before close to protect the day-1 plan.


    **Record conflicts**


    - **State counts do not reconcile.** Harbor 38 + Mosaic 41 gives an overlap of
    35 and a union of 44, so only 3 states would be new to Mosaic (and 6 new to Harbor).
    The request''s "four new markets" matches neither figure. One or more reported
    numbers is inaccurate, or "four" means something not stated. Practical effect:
    the number and identity of states needing a licensing path, and the launch scope,
    cannot be sized until a state-by-state schedule is produced. Reported values are
    preserved; none is silently corrected.


    - **Research status sequence conflicts.** Sep 9, 21:11: "Research is in progress"
    (MSG-20260909-168b9d). Sep 9, 23:14: "No research is in progress" and the tool
    was unavailable (MSG-20260909-91b5ec). Sep 9, 23:47: "No durable research run
    was started" (MSG-20260909-b4cc1f). Sep 10, 00:47: research "queued or running
    with its saved source choices" (MSG-20260910-c27e90). Practical effect: the support
    posture of any earlier memo is unclear, and this dossier cannot rely on retrieved
    authority. Resolve by locating the run''s outputs and source list.


    - **Metadata date unexplained.** The matter record carries a target date of 2026-09-11,
    which matches no milestone in the readable records (close is reported as Nov 15,
    about ten weeks from Sep 9). Practical effect: unclear; if Sep 11 is a working
    deadline for any deliverable it changes sequencing, not the analysis. Confirm
    what the date represents.


    **Assumptions used in this draft**


    - The added markets are states where Mosaic lacks its own license and would rely
    on Harbor''s; the exact state list is unknown and the reported counts disagree.
    Issue 1''s scope and the licensing action depend on this.


    - The SARs remain Harbor''s filed reports and have not been transferred to Mosaic;
    only their unreviewed existence has surfaced in diligence. Issue 3''s access protocol
    assumes this; if SAR content has already moved without controls, that becomes
    an immediate question.


    - The $50 bonus terms are not yet fixed (marketing "wants" the campaign). Issue
    4''s analysis is conditional on those terms.


    - Harbor''s customer agreements and privacy commitments are not in the readable
    record. Issue 5 is framed around the clauses that will decide it (assignment;
    data sharing or transfer; notice).


    Nothing else is assumed. Recorded assumptions in the facts file (license transferability;
    sufficiency of pass/fail KYC results; a validated no-gap monitoring repoint) are
    tested in the issues above and remain unconfirmed.


    **Alternatives considered**


    <!-- alternative:SCN-490c71c86d9c658974321c1e -->

    ### Bank holds the funds (partner-bank model) — **Hypothetical — not adopted**


    Recorded on scenario SCN-490c71c86d9c658974321c1e. The lawyer asked on Sep 10
    to consider "an alternative where the bank holds the funds" and expressly to keep
    it hypothetical (MSG-20260910-c95c1b, repeated MSG-20260910-900f63); the recorded
    response (MSG-20260910-02f34c) describes a partner bank holding customer funds
    while Mosaic supplies technology and operations. Nothing here adopts it, and the
    matter direction stays unchanged.


    **Assumptions (from the recorded exchange).** A partner bank owns or holds customer
    funds and balances; Mosaic provides technology and operations. The record does
    not specify the bank, the funds flow, or whether Mosaic controls transfers — the
    decisive missing piece.


    **How it could help.** If the bank is the entity that holds funds and controls
    transfers, and Mosaic is genuinely a technology and operations provider, the state
    money-transmission question may relax because the transmitting party is the bank
    rather than Mosaic [unverified premise]. Whether it actually helps depends on
    the roles: who contracts with the customer, who owes the balance, who initiates
    transfers, and whose name is on the account. A change in structure does not by
    itself remove a permission requirement; the bank''s own ability to serve these
    customers in the added markets must also be checked.


    **Added risks and what it does not solve.** KYC: someone — Mosaic or the bank
    — still needs a compliant identification and due-diligence position on the same
    record gaps, and moving funds to a bank may change customer agreements and disclosures.
    Alerts and SARs: Harbor''s history and the review need are unchanged, and the
    entity change shifts who keeps which records. Monitoring: the contract-termination
    and cutover problem persists unless the bank brings its own monitoring. Marketing:
    the bonus review is unchanged. New dependency: bank onboarding, allocation of
    the BSA/AML program, and customer re-papering, with an implementation timeline
    not shown to fit the ~10-week window.


    **Issues left unresolved.** The four matter workstreams remain live to the extent
    the role mapping does not move the duty: licensing (reduced only if Mosaic is
    not transmitting and does not owe balances — conditional), KYC records, alert/SAR
    review and monitoring continuity, and the bonus. The customer-terms/data issue
    follows the same mapping.


    **Next action.** Produce the funds-flow and roles map (customer contract; account
    holder; funds holder; who initiates transfers; complaint and error handling) before
    assessing this option; no external authority was retrieved for it in the record,
    and the licensing premises above are unverified. Use it only if the map shows
    the bank — not Mosaic — carrying the transmission and able to serve these customers;
    otherwise it does not change the current analysis. Compared with the current direction
    on the factors that actually differ: licensing route, time to implement (unknown,
    plausibly longer than the window — verify), added partner dependencies, and the
    unchanged KYC, alert, monitoring, and marketing work.


    ## Next actions


    No owners or deadlines for these work items are recorded; every owner and timing
    below is **Proposed**, and the only source-based date is the reported Nov 15 close
    target. Ordered by decision impact and dependency.


    1. **Alerts and SARs review — start immediately, before deal terms are set.**
    Deliverable: controlled-review protocol and a written report of what the open
    alerts and SAR history show. Needed result: whether unresolved suspicious activity
    or a missed filing changes deal protections or customer handling. Dependent decision:
    deal protections; account-level handling at migration. Fallback if unfinished:
    obtain specific deal protections and keep affected-customer handling under post-close
    review; do not broaden file circulation to close the gap. Owner (Proposed): outside
    counsel leading, Mosaic compliance supporting.


    2. **State-by-state licensing map and route — start immediately.** Deliverable:
    matrix (state; Mosaic status; Harbor status; route — new license, transfer, change-of-control,
    or delegate; timeline; notices) plus the asset-purchase transfer analysis. Needed
    result: the lawful day-1 market list. Dependent decision: launch scope and staged
    rollout; customer communications. Fallback: stage the launch to Mosaic-licensed
    states; treat added markets as post-close. Owner (Proposed): regulatory counsel,
    with product/ops confirming the serving entity.


    3. **KYC reliance confirmation, cohort data, and cure plan — scope immediately,
    complete before close.** Deliverable: compliance memo plus cohort counts (pre-2023
    users; business accounts) and a remediation plan. Needed result: whether the no-re-verification
    plan stands and what happens to the gap cohort. Dependent decision: day-1 access
    levels. Fallback: limited access or re-verification for the cohort. Owner (Proposed):
    compliance lead with the data team.


    4. **Monitoring cutover test and bridge decision — before close, with buffer.**
    Deliverable: cutover design, test results, and migration-window coverage plan
    (who reviews alerts; how history carries). Needed result: alerts continue without
    a gap. Dependent decision: day-1 feed repoint versus a bridge or parallel running.
    Fallback: extend Harbor''s vendor if the contract permits, or run parallel monitoring.
    Owner (Proposed): engineering and compliance, with legal checking the SaaS termination
    and extension terms.


    5. **Customer terms, privacy, and notices — before close, because day 1 depends
    on it.** Deliverable: assignment and data-transfer analysis plus a notice/consent
    plan with dates. Needed result: what must be sent, to whom, and when. Dependent
    decision: day-1 migration mechanics. Fallback: sequence migration behind notice
    delivery for affected records. Owner (Proposed): commercial and privacy counsel
    with servicing/marketing.


    6. **Bonus terms review — start pre-close, clear before close+1.** Deliverable:
    reviewed terms and disclosures. Needed result: campaign-ready language consistent
    with launch reality (staged markets; limited-access cohort). Dependent decision:
    launch or delay the campaign. Fallback: delay launch. Owner (Proposed): marketing
    with legal review.


    **Work product and records**


    - Original request: REQ-20260909-283892 — 03_Matters/harbor-2-d89ad8/request.md
    (Dana, PM Growth & Integration, Sep 9, 20:52; MSG-20260909-982278).

    - Known facts and recorded assumptions: 03_Matters/harbor-2-d89ad8/facts.md (including
    the Sep 9 intake answers, MSG-20260909-2e549e, and later reported answers).

    - Conversations: CONV-20260909-a8160f (request thread); CONV-20260909-5299cf (intake,
    initial issue map MSG-20260909-efcbdd, research requests, dossier-rewrite request
    MSG-20260910-3ace1b / MSG-20260910-f8e728, working summary MSG-20260910-2f255e,
    scenario messages).

    - Scenario/alternative: SCN-490c71c86d9c658974321c1e.

    - Prior revision: a complete dossier rewrite was submitted as a tracked revision
    on Sep 10, 04:36, leaving the current dossier unchanged pending acceptance. No
    current work-product draft or final path is recorded in the matter metadata.


    Coverage: the captured inventory holds 3 conversations / 114 messages and 9 documents.
    This draft was written from the current-records bundle (facts, intake answers,
    assumptions, actions, sources) and the captured messages shown above. The remaining
    messages, the saved issue list with its ISS identifiers, and the nine documents
    — including any saved research outputs or researched issue answers — were outside
    this run''s reading allowance and are not relied on. If those documents contain
    retrieved authority, the support labels here should be updated to match; none
    of the four recorded workstreams is contradicted by the material read.


    <!-- saved-issue-analysis:start -->

    ## Saved issue answers


    <!-- issue:ISS-c9d7c39f63-94e42e2b38090045 -->

    ### Money transmission licensing: whether Mosaic Relay can operate under the combined
    44-state footprint and whether Harbor''s MTLs transfer/survive the acquisition


    **Generated analysis warning.** Main-agent analysis failed. Useful available work
    was preserved.


    **No external authority retrieved**


    Now reading the OCC source body and the Fenergo licensing-requirements passage
    for their literal text.


    Research saved. 4 sources retrieved; 4 with passages read.


    Next step: Identify the four Harbor-only states and complete one matrix covering
    license authority, transaction filings, interim operation, bank custody, outstanding
    obligations, and license surrender.


    Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-6f559c.md)


    <!-- issue:ISS-c9d7c39f63-ca95e529feeb1045 -->

    ### BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
    documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML obligations


    The record does not support blanket reliance on Harbor''s prior KYC. Harbor''s
    vendor closed in 2024, pass or fail results remain, and underlying documents for
    some pre-2023 users are missing. The answer depends on Mosaic''s written AML and
    customer identification program, Harbor''s available evidence, the parties'' legal
    roles, and the requirements that apply to the migrated accounts.


    Initial answer — research not complete.


    Next step: Review Mosaic''s program and Harbor''s records. Define which customers
    can migrate without new checks, which require more review, and which must be restricted
    until the record gap is fixed.


    <!-- issue:ISS-c9d7c39f63-69af3f282d21ef38 -->

    ### SAR and alert handling: obligations to review, file, and manage Harbor''s
    ~40 open alerts and SARs, and successor liability


    **No external authority retrieved**


    External collection is not authorized for this run — noted. I''ll deliver from
    the saved library and matter records, with the federal framework clearly flagged
    as unverified. Let me confirm the exact saved fact and issue identifiers before
    composing the answer.


    No oversized model request was sent.


    Research saved. 1 sources retrieved; 1 with passages read.


    Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-22d810.md)


    <!-- issue:ISS-c9d7c39f63-4825f0af7ec75542 -->

    ### Monitoring vendor transition: continuity of transaction monitoring when the
    SaaS contract terminates at close


    **No external authority retrieved**


    I have the framework-level support from the saved model act. Before composing,
    let me confirm real record IDs for the synthesis (assumption and issue identifiers)
    from the matter''s saved records.


    No oversized model request was sent.


    Research saved. 1 sources retrieved; 1 with passages read.


    Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-182455.md)


    <!-- issue:ISS-c9d7c39f63-72810d0a43d3ce66 -->

    ### Marketing compliance: the $50 welcome bonus offer and any state money transmission
    or consumer protection implications


    Legal review is required before publication, but this issue should not control
    the close. The record gives only a $50 first-transfer bonus. The answer depends
    on eligibility, funding, transfer conditions, expiration and reversal rules, target
    states, advertising channels, and customer disclosures.


    Initial answer — research not complete.


    Next step: Obtain the final offer terms and customer journey. Limit eligibility
    to the approved launch area. Complete advertising and disclosure review before
    release.


    <!-- issue:ISS-c9d7c39f63-af341445a7af4c06 -->

    ### Customer account, contract, and data-transfer rights


    The facts establish an asset purchase and a planned day-one migration. They do
    not establish assignment rights, required customer consent or notice, privacy
    authority, data-transfer limits, or responsibility for customer funds and obligations.
    The answer depends on the purchase agreement, customer terms, privacy notices,
    asset schedules, data flows, and the identity of each contracting entity.


    Initial answer — research not complete.


    Next step: Review the purchase agreement, customer agreements, privacy notices,
    data map, and planned customer notices. Identify required consents, notices, exclusions,
    and closing conditions.

    <!-- saved-issue-analysis:end -->


    ## Alternatives considered


    <!-- alternative:SCN-0f23edfc89ec6ecaf60a13e4 -->

    ### Bank-held funds timing test


    Hypothetical — not adopted


    Compare the current Harbor migration approach with a bank-held funds option using
    only the attachment''s hypothetical facts and proposals, without changing actual
    facts or the current direction.


    Hypothetical assumptions:


    - For this hypothetical, a bank would hold the relevant funds during the Harbor
    2 transition, while Mosaic would control transfer instructions subject to contract
    completion and bank operating setup.

    - For this hypothetical, migration is planned for November 15, 2026, and bank
    integration readiness is December 3, 2026.

    - For this hypothetical, pre-2023 identity documents are missing, 40 alert cases
    remain pending, and the monitoring service ends at close.


    Saved working analysis:


    - Qualified: the option makes the November 15 migration harder on the supplied
    test dates because bank integration is not ready until December 3, 18 days later.

    - Supported by the fictional attachment: the bank would hold relevant funds, but
    Mosaic would control transfer instructions, subject to contract completion and
    bank operating setup.

    - Unresolved: bank-held funds do not, on the supplied test facts, resolve missing
    pre-2023 identity documents, 40 pending alert cases, or monitoring ending at close.


    Still to resolve:


    - Whether the bank contract and operating setup can be completed before November
    15, 2026.

    - Whether missing identity records, pending alerts, or monitoring transition requirements
    delay either option.


    [Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-0f23edfc89ec6ecaf60a13e4.md)


    <!-- alternative:SCN-406906c91ab0aba4313b54a6 -->

    ### Bank-held funds structure


    Hypothetical — not adopted


    Test whether a partner-bank custody model could reduce Mosaic Relay''s money-transmission
    exposure while preserving the current Harbor migration direction.


    Hypothetical assumptions:


    - For this hypothetical only, a partner bank holds customer funds.


    You reported an **asset purchase**. Mosaic Relay will buy Harbor Pay’s assets.


    Still to resolve:


    - Who contracts directly with users.

    - Who controls transfer instructions and settlement.

    - Who records balances and owes repayment to users.

    - How KYC, transaction monitoring, alerts, SARs, privacy, and marketing duties
    are allocated.


    [Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-406906c91ab0aba4313b54a6.md)


    '
  source_records:
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: ISS-c9d7c39f63-af341445a7af4c06
    source_label: 'Issue: Customer account, contract, and data-transfer rights'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/issues.md
    available_excerpt: Customer account, contract, and data-transfer rights
    record_revision: 1b1e2756a0358a84aa6f2fa795c6020ac0087a6105b2e220a00fb2e30947569a
    source_version: 1b1e2756a0358a84aa6f2fa795c6020ac0087a6105b2e220a00fb2e30947569a
    support_state: supplied
    captured_record:
      claim_output_revisions: {}
      issue_id: ISS-c9d7c39f63-af341445a7af4c06
      parent_issue_id: null
      title: Customer account, contract, and data-transfer rights
      why_it_matters: An asset purchase does not by itself establish that customer
        accounts, contracts, balances, or personal data can move into Mosaic's app
        on day one.
      fact_ids:
      - FACT-20260909-ed9f06
      - FACT-20260909-551367
      - FACT-20260909-4c1fd8
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
      updated_at: '2026-09-12T22:00:41+00:00'
      generated_origin: dossier_preparation
      generated_request_id: DOR-20260912-6d3df4
      generated_candidate_key: customer_account_data_transfer
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-982278
    source_label: 'Saved message: From: Dana, PM — Growth & Integration

      Subject: Harbor migration — anything here …'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-a8160f.md
    available_excerpt: 'From: Dana, PM — Growth & Integration

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
    record_revision: e847a82b62c8e0424b39f18d69bdf4564f21aad6b08303affc8f87a05f8782d1
    source_version: e847a82b62c8e0424b39f18d69bdf4564f21aad6b08303affc8f87a05f8782d1
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-982278
      role: user
      content: 'From: Dana, PM — Growth & Integration

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


        Does any of this need legal before close? It''s really just a data migration.'
      created_at: '2026-09-09T20:52:49+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-a8160f
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-a8160f.md
      message_sequence: 0
      submitted_scope: actual
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-2e549e
    source_label: 'Saved message: How is the Harbor Pay acquisition structured?

      Asset purchase (Mosaic buys Harbor…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: 'How is the Harbor Pay acquisition structured?

      Asset purchase (Mosaic buys Harbor''s assets)


      Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
      prior KYC without re-verification, or is re-verification required?

      Not sure / need to check with compliance


      What is known about Harbor''s ~40 open alerts and the SARs from the last year?

      Nothing reviewed yet — still in diligence


      For the four new markets opened by the combined footprint, does Mosaic Relay
      plan to operate under Harbor''s existing licenses or apply for its own?

      Use/assume Harbor''s licenses


      0 questions left open.


      Analyze this matter with these answers. Leave gaps unknown and show the initial
      issue map and assumptions used.'
    record_revision: caa38cc29ac26e8abbecf2f02d403fac0b4114e33e71ce007ce90798161c4af7
    source_version: caa38cc29ac26e8abbecf2f02d403fac0b4114e33e71ce007ce90798161c4af7
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-2e549e
      role: user
      content: 'How is the Harbor Pay acquisition structured?

        Asset purchase (Mosaic buys Harbor''s assets)


        Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
        prior KYC without re-verification, or is re-verification required?

        Not sure / need to check with compliance


        What is known about Harbor''s ~40 open alerts and the SARs from the last year?

        Nothing reviewed yet — still in diligence


        For the four new markets opened by the combined footprint, does Mosaic Relay
        plan to operate under Harbor''s existing licenses or apply for its own?

        Use/assume Harbor''s licenses


        0 questions left open.


        Analyze this matter with these answers. Leave gaps unknown and show the initial
        issue map and assumptions used.'
      created_at: '2026-09-09T20:56:00+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 2
      submitted_scope: actual
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-efcbdd
    source_label: 'Saved message: ## Initial issue map


      - **Licensing:** In an asset purchase, Harbor’s licenses m…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: '## Initial issue map


      - **Licensing:** In an asset purchase, Harbor’s licenses may not transfer to
      Mosaic. The four new markets need state-by-state clearance before launch.

      - **BSA/AML:** Mosaic’s policy on prior KYC is unknown. Missing records may
      require re-verification or access limits.

      - **Alerts and monitoring:** Review all open alerts and SAR history before close.
      Test monitoring continuity before migration.

      - **Marketing:** Review the $50 bonus when its terms are available.


      **No external authority retrieved.**


      ## Assumptions used


      - Mosaic will serve migrated users immediately after close.

      - Harbor’s licenses do not automatically transfer.

      - Harbor’s KYC results are not assumed sufficient.

      - The monitoring change can be tested before close.

      - The bonus structure remains unknown.


      Answer saved as a reported fact. The issue remains open.


      Question left open.'
    record_revision: f0dc7645a3978e42ac5e206af8fa0d4f452b9b598f043f308a22fe09431518a7
    source_version: f0dc7645a3978e42ac5e206af8fa0d4f452b9b598f043f308a22fe09431518a7
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-efcbdd
      role: assistant
      content: '## Initial issue map


        - **Licensing:** In an asset purchase, Harbor’s licenses may not transfer
        to Mosaic. The four new markets need state-by-state clearance before launch.

        - **BSA/AML:** Mosaic’s policy on prior KYC is unknown. Missing records may
        require re-verification or access limits.

        - **Alerts and monitoring:** Review all open alerts and SAR history before
        close. Test monitoring continuity before migration.

        - **Marketing:** Review the $50 bonus when its terms are available.


        **No external authority retrieved.**


        ## Assumptions used


        - Mosaic will serve migrated users immediately after close.

        - Harbor’s licenses do not automatically transfer.

        - Harbor’s KYC results are not assumed sufficient.

        - The monitoring change can be tested before close.

        - The bonus structure remains unknown.


        Answer saved as a reported fact. The issue remains open.


        Question left open.'
      created_at: '2026-09-09T20:58:15+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 3
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-539d02
    source_label: 'Saved message: What are the elgal issues associated with each of
      the for issues?'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: What are the elgal issues associated with each of the for issues?
    record_revision: 296564f1fdf5660025d6df78422ccf7a5b21c386473bcd59d43a322fcbf7f3e8
    source_version: 296564f1fdf5660025d6df78422ccf7a5b21c386473bcd59d43a322fcbf7f3e8
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-539d02
      role: user
      content: What are the elgal issues associated with each of the for issues?
      created_at: '2026-09-09T21:06:44+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 4
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-660683
    source_label: 'Saved message: I want you to do the research on them and get back
      to me.  Please give me source…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: I want you to do the research on them and get back to me.  Please
      give me sources
    record_revision: 4a5ad0bc1f370dea8763fb7a2da10f12cd2f68cc05e50b48fac6488705514c0c
    source_version: 4a5ad0bc1f370dea8763fb7a2da10f12cd2f68cc05e50b48fac6488705514c0c
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-660683
      role: user
      content: I want you to do the research on them and get back to me.  Please give
        me sources
      created_at: '2026-09-09T21:09:16+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 6
      submitted_scope: actual
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-168b9d
    source_label: 'Saved message: Research is in progress. The source-backed memo
      will cover:


      - State money-trans…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: 'Research is in progress. The source-backed memo will cover:


      - State money-transmitter licensing

      - KYC and AML requirements

      - Open alerts, SARs, and monitoring continuity

      - The $50 welcome bonus


      I will separate federal rules from state-specific questions. I will also identify
      missing facts and any authority that still needs verification.'
    record_revision: 4099bd88a0bdd80739799a6d4f848d7e7085ecd16c2b99f759c546b2af80dea9
    source_version: 4099bd88a0bdd80739799a6d4f848d7e7085ecd16c2b99f759c546b2af80dea9
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-168b9d
      role: assistant
      content: 'Research is in progress. The source-backed memo will cover:


        - State money-transmitter licensing

        - KYC and AML requirements

        - Open alerts, SARs, and monitoring continuity

        - The $50 welcome bonus


        I will separate federal rules from state-specific questions. I will also identify
        missing facts and any authority that still needs verification.'
      created_at: '2026-09-09T21:11:05+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 7
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-406e0e
    source_label: 'Saved message: Can you do external research the document is only
      based on the model.'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: Can you do external research the document is only based on
      the model.
    record_revision: 731fa3d1d1efecfced00cdb6e8373b9b36a4b89b3ce83f8134f674f351728f4e
    source_version: 731fa3d1d1efecfced00cdb6e8373b9b36a4b89b3ce83f8134f674f351728f4e
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-406e0e
      role: user
      content: Can you do external research the document is only based on the model.
      created_at: '2026-09-09T23:14:11+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 8
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-91b5ec
    source_label: 'Saved message: Yes. The current document contains model-generated
      analysis only. It has no retr…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: 'Yes. The current document contains model-generated analysis
      only. It has no retrieved external authority.


      I cannot start external research because the external-research tool is not available
      in this turn. No research is in progress. Please enable the external-source
      research option and resend this request.'
    record_revision: 2062b357dfc5ed3a58c5b5d378df319e5a856410e376f7e0a1595c868410e818
    source_version: 2062b357dfc5ed3a58c5b5d378df319e5a856410e376f7e0a1595c868410e818
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-91b5ec
      role: assistant
      content: 'Yes. The current document contains model-generated analysis only.
        It has no retrieved external authority.


        I cannot start external research because the external-research tool is not
        available in this turn. No research is in progress. Please enable the external-source
        research option and resend this request.'
      created_at: '2026-09-09T23:14:28+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 9
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260909-b4cc1f
    source_label: 'Saved message: Please confirm the external source choices in the
      research panel. Research start…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: 'Please confirm the external source choices in the research
      panel. Research starts after confirmation. The current model-only document remains
      unchanged.


      No durable research run was started.'
    record_revision: b4369ecb7c3c7e459e79233d25d39f8003ee6f5e647d27f0502031a9c1b54639
    source_version: b4369ecb7c3c7e459e79233d25d39f8003ee6f5e647d27f0502031a9c1b54639
    support_state: supplied
    captured_record:
      message_id: MSG-20260909-b4cc1f
      role: assistant
      content: 'Please confirm the external source choices in the research panel.
        Research starts after confirmation. The current model-only document remains
        unchanged.


        No durable research run was started.'
      created_at: '2026-09-09T23:47:23+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 11
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-c27e90
    source_label: 'Saved message: Research is queued or running with its saved source
      choices. The run will show w…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: Research is queued or running with its saved source choices.
      The run will show which sources were retrieved. Repeating this confirmation
      does not start another run.
    record_revision: 945c483c2ad74ee920dd8ad7f4e31d92ea7371c6e06a0b1eee47c7e551295fda
    source_version: 945c483c2ad74ee920dd8ad7f4e31d92ea7371c6e06a0b1eee47c7e551295fda
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-c27e90
      role: assistant
      content: Research is queued or running with its saved source choices. The run
        will show which sources were retrieved. Repeating this confirmation does not
        start another run.
      created_at: '2026-09-10T00:47:49+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 13
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-3ace1b
    source_label: 'Saved message: with everything you know, rewrite the dossier'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: with everything you know, rewrite the dossier
    record_revision: 02ec740cee39e7491566b3afe0a6f66b36520f88d3926be3b58850b9580e8a5e
    source_version: 02ec740cee39e7491566b3afe0a6f66b36520f88d3926be3b58850b9580e8a5e
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-3ace1b
      role: user
      content: with everything you know, rewrite the dossier
      created_at: '2026-09-10T04:33:35+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 14
      submitted_scope: actual
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-f8e728
    source_label: 'Saved message: The complete dossier rewrite was submitted as a
      tracked revision. It keeps the c…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: 'The complete dossier rewrite was submitted as a tracked revision.
      It keeps the current dossier unchanged until you accept the proposed changes.

      The revision adds the options, working recommendation, material unknowns, and
      source limits.'
    record_revision: 0abdfc28cfc953d53c9b8e8b7d6b9a349099d61b9c6399957edf8b40dab225cd
    source_version: 0abdfc28cfc953d53c9b8e8b7d6b9a349099d61b9c6399957edf8b40dab225cd
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-f8e728
      role: assistant
      content: 'The complete dossier rewrite was submitted as a tracked revision.
        It keeps the current dossier unchanged until you accept the proposed changes.

        The revision adds the options, working recommendation, material unknowns,
        and source limits.'
      created_at: '2026-09-10T04:36:36+00:00'
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 15
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-2f255e
    source_label: 'Saved message: **Current approach:** Treat legal and compliance
      readiness as a pre-close gate. …'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: '**Current approach:** Treat legal and compliance readiness
      as a pre-close gate. Do not assume Harbor’s licenses transfer. Consider a narrower
      launch if licensing, KYC records, alert review, or monitoring tests are incomplete.


      **Unresolved questions:** State approval in the four new markets; whether Mosaic’s
      AML/CIP program permits reliance on Harbor’s KYC; what the alerts and SAR history
      show; whether monitoring will work without a gap; and how the $50 bonus will
      operate.


      **Next step:** Obtain state-by-state licensing advice and review the alerts
      and SAR history. The available sources do not yet support a final state-specific
      conclusion.'
    record_revision: 74cfc37dae24227d14b64575fcf0531748fe76500de963a5a32fadc52b35a80f
    source_version: 74cfc37dae24227d14b64575fcf0531748fe76500de963a5a32fadc52b35a80f
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-2f255e
      role: assistant
      content: '**Current approach:** Treat legal and compliance readiness as a pre-close
        gate. Do not assume Harbor’s licenses transfer. Consider a narrower launch
        if licensing, KYC records, alert review, or monitoring tests are incomplete.


        **Unresolved questions:** State approval in the four new markets; whether
        Mosaic’s AML/CIP program permits reliance on Harbor’s KYC; what the alerts
        and SAR history show; whether monitoring will work without a gap; and how
        the $50 bonus will operate.


        **Next step:** Obtain state-by-state licensing advice and review the alerts
        and SAR history. The available sources do not yet support a final state-specific
        conclusion.'
      created_at: '2026-09-10T22:49:52+00:00'
      path_id: SCN-490c71c86d9c658974321c1e
      comparison_path_ids: []
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 17
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-c95c1b
    source_label: 'Saved message: Consider an alternative where the bank holds the
      funds. Keep this hypothetical.'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: Consider an alternative where the bank holds the funds. Keep
      this hypothetical.
    record_revision: 678b66ff4a0dd03f372c82f75841cc74ab31be74420cc884ad2e3c238b9217a5
    source_version: 678b66ff4a0dd03f372c82f75841cc74ab31be74420cc884ad2e3c238b9217a5
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-c95c1b
      role: user
      content: Consider an alternative where the bank holds the funds. Keep this hypothetical.
      created_at: '2026-09-10T23:03:27+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 18
      submitted_scope: scenario
      submitted_path_id: SCN-490c71c86d9c658974321c1e
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-02f34c
    source_label: 'Saved message: **Issue** — A partner bank could hold customer funds,
      while Mosaic supplies tech…'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: '**Issue** — A partner bank could hold customer funds, while
      Mosaic supplies technology and operations.


      **Analysis** — This could lower licensing risk if the bank owns the accounts
      and controls fund transfers. It does not automatically remove risk if Mosaic
      controls transfers, owes balances, or acts directly for users. KYC, alert, SAR,
      monitoring, and marketing questions remain.


      **Conclusion** — Map the funds flow, customer relationship, and compliance duties
      before assessing this option. The current matter position stays unchanged.


      **No external authority retrieved for this hypothetical.**'
    record_revision: 3fece5873585c7b17f7dd55ad8d8285f04bd6220f97894b36f0cdfeedbb6f2cc
    source_version: 3fece5873585c7b17f7dd55ad8d8285f04bd6220f97894b36f0cdfeedbb6f2cc
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-02f34c
      role: assistant
      content: '**Issue** — A partner bank could hold customer funds, while Mosaic
        supplies technology and operations.


        **Analysis** — This could lower licensing risk if the bank owns the accounts
        and controls fund transfers. It does not automatically remove risk if Mosaic
        controls transfers, owes balances, or acts directly for users. KYC, alert,
        SAR, monitoring, and marketing questions remain.


        **Conclusion** — Map the funds flow, customer relationship, and compliance
        duties before assessing this option. The current matter position stays unchanged.


        **No external authority retrieved for this hypothetical.**'
      created_at: '2026-09-10T23:04:43+00:00'
      path_id: SCN-490c71c86d9c658974321c1e
      comparison_path_ids: []
      action_actor: null
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 19
      submitted_scope: null
      submitted_path_id: null
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
  - source_id: MSG-20260910-900f63
    source_label: 'Saved message: Consider an alternative where the bank holds the
      funds. Keep this hypothetical.'
    source_class: saved_artifact
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    available_excerpt: Consider an alternative where the bank holds the funds. Keep
      this hypothetical.
    record_revision: 59ea4c8311afcb03a73572e9c86408f908afef4ae2aab2cbd31ccdbf63744771
    source_version: 59ea4c8311afcb03a73572e9c86408f908afef4ae2aab2cbd31ccdbf63744771
    support_state: supplied
    captured_record:
      message_id: MSG-20260910-900f63
      role: user
      content: Consider an alternative where the bank holds the funds. Keep this hypothetical.
      created_at: '2026-09-10T23:35:00+00:00'
      action_actor:
        person_id: local-lawyer
        display_name: Unattributed lawyer
        mode: single
      workspace_action: null
      conversation_id: CONV-20260909-5299cf
      path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
      message_sequence: 20
      submitted_scope: scenario
      submitted_path_id: SCN-490c71c86d9c658974321c1e
      historical_not_authority: true
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    record_revision: ddeb0f26ab859d90d82d6c6149a6cb045cc5ca0edda3a82db0cb28d68afdaefa
    source_version: ddeb0f26ab859d90d82d6c6149a6cb045cc5ca0edda3a82db0cb28d68afdaefa
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
      editable: false
      kind: markdown
    locator: null
    output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
title: Generated dossier revision
source_records:
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000014
    start: 0
    end: 1963
    page_number: 14
    section_label: null
    body_hash: 5b5d2f6c388b9bcf98252d205bb001dbdce26951229e0e6896dfecf0358be545
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000014.md
    text: "14 \n \nARTICLE V \nMoney Transmission Licenses \nSection 5.01 License
      Required. \n(a) \nA person may not engage in the business of money transmission
      or \nadvertise, solicit, or hold itself out as providing money transmission
      unless the person is licensed \nunder this [Act]; \n(b) \n[Section 5.01(a)]
      does not apply to: \n(1) \nA person that is an authorized delegate of a person
      licensed under \nthis [Act] acting within the scope of authority conferred by
      a written contract with the \nlicensee; or \n(2) \nA person that is exempt pursuant
      to [Section 3.01] and does not \nengage in money transmission outside the scope
      of such exemption. \n(c) \nA license issued under [Section 5.05] is not transferable
      or assignable. \nSection 5.02 Consistent State Licensing. \n(a) \nTo establish
      consistent licensing between [this state] and other states, the \n[Commissioner]
      is authorized and encouraged to: \n(1) \nimplement all licensing provisions
      of this [Act] in a manner that is \nconsistent with other states that have adopted
      this [Act]or multistate licensing processes; \nand \n(2) \nparticipate in nationwide
      protocols for licensing cooperation and \ncoordination among state regulators
      provided that such protocols are consistent with this \n[Act]. \n(b) \nIn order
      to fulfill the purposes of this [Act], the [Commissioner] is \nauthorized and
      encouraged to establish relationships or contracts with NMLS or other entities
      \ndesignated by NMLS to enable the [Commissioner] to: \n(1) \ncollect and maintain
      records; \n(2) \ncoordinate multistate licensing processes and supervision processes;
      \n(3) \nprocess fees; and \n(4) \nfacilitate communication between [state] and
      licensees or other \npersons subject to this [Act]. \n(c) \nThe [Commissioner]
      is authorized and encouraged to utilize NMLS for all \naspects of licensing
      in accordance with this [Act], including but not limited to, license applications,
      \napplications for acquisitions of control, surety bonds, reporting, criminal
      history background\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000014.md
  source_hash: 5b5d2f6c388b9bcf98252d205bb001dbdce26951229e0e6896dfecf0358be545
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 14, characters
    0–1963'
  unit_id: p000014
  locator: Page 14, characters 0–1963
  available_excerpt: "14 \n \nARTICLE V \nMoney Transmission Licenses \nSection 5.01
    License Required. \n(a) \nA person may not engage in the business of money transmission
    or \nadvertise, solicit, or hold itself out as providing money transmission unless
    the person is licensed \nunder this [Act]; \n(b) \n[Section 5.01(a)] does not
    apply to: \n(1) \nA person that is an authorized delegate of a person licensed
    under \nthis [Act] acting within the scope of authority conferred by a written
    contract with the \nlicensee; or \n(2) \nA person that is exempt pursuant to [Section
    3.01] and does not \nengage in money transmission outside the scope of such exemption.
    \n(c) \nA license issued under [Section 5.05] is not transferable or assignable.
    \nSection 5.02 Consistent State Licensing. \n(a) \nTo establish consistent licensing
    between [this state] and other states, the \n[Commissioner] is authorized and
    encouraged to: \n(1) \nimplement all licensing provisions of this [Act] in a manner
    that is \nconsistent with other states that have adopted this [Act]or multistate
    licensing processes; \nand \n(2) \nparticipate in nationwide protocols for licensing
    cooperation and \ncoordination among state regulators provided that such protocols
    are consistent with this \n[Act]. \n(b) \nIn order to fulfill the purposes of
    this [Act], the [Commissioner] is \nauthorized and encouraged to establish relationships
    or contracts with NMLS or other entities \ndesignated by NMLS to enable the [Commissioner]
    to: \n(1) \ncollect and maintain records; \n(2) \ncoordinate multistate licensing
    processes and supervision processes; \n(3) \nprocess fees; and \n(4) \nfacilitate
    communication between [state] and licensees or other \npersons subject to this
    [Act]. \n(c) \nThe [Commissioner] is authorized and encouraged to utilize NMLS
    for all \naspects of licensing in accordance with this [Act], including but not
    limited to, license applications, \napplications for acquisitions of control,
    surety bonds, reporting, criminal history background\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000021
    start: 0
    end: 2389
    page_number: 21
    section_label: null
    body_hash: 5638ae03ab2c6c110a80e30639b8ccd42a1c585fdc2818a38e4f2f0fc69a5e06
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000021.md
    text: "21 \n \nin a medium prescribed by the [Commissioner]. The renewal report
      must state or contain a \ndescription of each material change in information
      submitted by the licensee in its original license \napplication which has not
      been reported to the [Commissioner]. \n(c) \nThe [Commissioner] for good cause
      may grant an extension of the renewal \ndate. \n(d) \nThe [Commissioner] is
      authorized and encouraged to utilize NMLS to \nprocess license renewals provided
      that such functionality is consistent with this [Section 5.06]. \nSection 5.07
      Maintenance of License. \n(a) \nIf a licensee does not continue to meet the
      qualifications or satisfy the \nrequirements that apply to an applicant for
      a new money transmission license, the [Commissioner] \nmay suspend or revoke
      the licensee's license in accordance with the procedures established by this
      \n[Act] or other applicable state law for such suspension or revocation. \n(b)
      \nAn applicant for a money transmission license must demonstrate that it \nmeets
      or will meet, and a money transmission licensee must at all times meet, the
      requirements in \n[Sections 10.01, 10.02, and 10.03] of this [Act]. \nARTICLE
      VI \nAcquisition of Control and Change of Key Individual \nSection 6.01 Acquisition
      of Control. \n(a) \nAny person, or group of persons acting in concert, seeking
      to acquire control \nof a licensee shall obtain the written approval of the
      [Commissioner] prior to acquiring control. \nAn individual is not deemed to
      acquire control of a licensee and is not subject to these acquisition \nof control
      provisions when that individual becomes a key individual in the ordinary course
      of \nbusiness. \n(b) \nA person, or group of persons acting in concert, seeking
      to acquire control \nof a licensee shall, in cooperation with the licensee:
      \n(1) \nSubmit an application in a form and in a medium prescribed by the \n[Commissioner];
      and \n(2) \nSubmit a nonrefundable fee of [$X] with the request for approval.
      \n(c) \nUpon request, the [Commissioner] may permit a licensee or the person,
      or \ngroup of persons acting in concert, to submit some or all information required
      by the \n[Commissioner] pursuant to [Section 6.01(b)(1)] without using NMLS.
      \n(d) \nThe application required by [Section 6.01(b)(1)] shall include information
      \nrequired by [Section 5.04] for any new key individuals that have not previously
      completed the \nrequirements of [Section 5.04] for a licensee.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000021.md
  source_hash: 5638ae03ab2c6c110a80e30639b8ccd42a1c585fdc2818a38e4f2f0fc69a5e06
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 21, characters
    0–2389'
  unit_id: p000021
  locator: Page 21, characters 0–2389
  available_excerpt: "21 \n \nin a medium prescribed by the [Commissioner]. The renewal
    report must state or contain a \ndescription of each material change in information
    submitted by the licensee in its original license \napplication which has not
    been reported to the [Commissioner]. \n(c) \nThe [Commissioner] for good cause
    may grant an extension of the renewal \ndate. \n(d) \nThe [Commissioner] is authorized
    and encouraged to utilize NMLS to \nprocess license renewals provided that such
    functionality is consistent with this [Section 5.06]. \nSection 5.07 Maintenance
    of License. \n(a) \nIf a licensee does not continue to meet the qualifications
    or satisfy the \nrequirements that apply to an applicant for a new money transmission
    license, the [Commissioner] \nmay suspend or revoke the licensee's license in
    accordance with the procedures established by this \n[Act] or other applicable
    state law for such suspension or revocation. \n(b) \nAn applicant for a money
    transmission license must demonstrate that it \nmeets or will meet, and a money
    transmission licensee must at all times meet, the requirements in \n[Sections
    10.01, 10.02, and 10.03] of this [Act]. \nARTICLE VI \nAcquisition of Control
    and Change of Key Individual \nSection 6.01 Acquisition of Control. \n(a) \nAny
    person, or group of persons acting in concert, seeking to acquire control \nof
    a licensee shall obtain the written approval of the [Commissioner] prior to acquiring
    control. \nAn individual is not deemed to acquire control of a licensee and is
    not subject to these acquisition \nof control provisions when that individual
    becomes a key individual in the ordinary course of \nbusiness. \n(b) \nA person,
    or group of persons acting in concert, seeking to acquire control \nof a licensee
    shall, in cooperation with the licensee: \n(1) \nSubmit an application in a form
    and in a medium prescribed by the \n[Commissioner]; and \n(2) \nSubmit a nonrefundable
    fee of [$X] with the request for approval. \n(c) \nUpon request, the [Commissioner]
    may permit a licensee or the person, or \ngroup of persons acting in concert,
    to submit some or all information required by the \n[Commissioner] pursuant to
    [Section 6.01(b)(1)] without using NMLS. \n(d) \nThe application required by [Section
    6.01(b)(1)] shall include information \nrequired by [Section 5.04] for any new
    key individuals that have not previously completed the \nrequirements of [Section
    5.04] for a licensee.\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000022
    start: 0
    end: 2612
    page_number: 22
    section_label: null
    body_hash: 175b57e812c71a8532569030d2db7113b5adc94e61bd9922dc0fee5d833c2748
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000022.md
    text: "22 \n \n(e) \nWhen an application for acquisition of control under this
      [Section 6.01] \nappears to include all the items and address all of the matters
      that are required, the application shall \nbe considered complete and the [Commissioner]
      shall promptly notify the applicant in a record of \nthe date on which the application
      was determined to be complete and:15 \n \n(1) \nThe [Commissioner] shall approve
      or deny the application within 60 \ndays after the completion date; or \n(2)
      \nif the application is not approved or denied within 60 days after the \ncompletion
      date: \n(A) \nthe application is approved; and \n(B) \nthe person, or group
      of persons acting in concert, are not \nprohibited from acquiring control. \n(3)
      \nThe [Commissioner] may for good cause extend the application \nperiod. \n(f)
      \nA determination by the [Commissioner] that an application is complete and
      \nis accepted for processing means only that the application, on its face, appears
      to include all of the \nitems and address all of the matters that are required,
      and is not an assessment of the substance of \nthe application or of the sufficiency
      of the information provided. \n(g) \nWhen an application is filed and considered
      complete under [Section \n6.01(e)], the [Commissioner] shall investigate the
      financial condition and responsibility, financial \nand business experience,
      character, and general fitness of the person, or group of persons acting in
      \nconcert, seeking to acquire control. The [Commissioner] shall approve an acquisition
      of control \npursuant to this [Section 6.01] if the [Commissioner] finds that
      all of the following conditions have \nbeen fulfilled: \n(1) \nThe requirements
      of subsections (b) and (d) have been met, as \napplicable; and \n(2) \nthe financial
      condition and responsibility, financial and business \nexperience, competence,
      character, and general fitness of the person, or group of persons \nacting in
      concert, seeking to acquire control; and the competence, experience, character,
      \nand general fitness of the key individuals and persons that would be in control
      of the \nlicensee after the acquisition of control indicate that it is in the
      interest of the public to \npermit the person, or group of persons acting in
      concert, to control the licensee. \n(h) \nIf an applicant avails itself or is
      otherwise subject to a multistate licensing \n \n15 Commentary: NMLS will accommodate
      and streamline the process of communicating when applications are \nreceived
      and when states consider them to have been complete. The intent of this Act
      is for the application period to \nbegin on the day an application is determined
      to be complete.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000022.md
  source_hash: 175b57e812c71a8532569030d2db7113b5adc94e61bd9922dc0fee5d833c2748
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 22, characters
    0–2612'
  unit_id: p000022
  locator: Page 22, characters 0–2612
  available_excerpt: "22 \n \n(e) \nWhen an application for acquisition of control
    under this [Section 6.01] \nappears to include all the items and address all of
    the matters that are required, the application shall \nbe considered complete
    and the [Commissioner] shall promptly notify the applicant in a record of \nthe
    date on which the application was determined to be complete and:15 \n \n(1) \nThe
    [Commissioner] shall approve or deny the application within 60 \ndays after the
    completion date; or \n(2) \nif the application is not approved or denied within
    60 days after the \ncompletion date: \n(A) \nthe application is approved; and
    \n(B) \nthe person, or group of persons acting in concert, are not \nprohibited
    from acquiring control. \n(3) \nThe [Commissioner] may for good cause extend the
    application \nperiod. \n(f) \nA determination by the [Commissioner] that an application
    is complete and \nis accepted for processing means only that the application,
    on its face, appears to include all of the \nitems and address all of the matters
    that are required, and is not an assessment of the substance of \nthe application
    or of the sufficiency of the information provided. \n(g) \nWhen an application
    is filed and considered complete under [Section \n6.01(e)], the [Commissioner]
    shall investigate the financial condition and responsibility, financial \nand
    business experience, character, and general fitness of the person, or group of
    persons acting in \nconcert, seeking to acquire control. The [Commissioner] shall
    approve an acquisition of control \npursuant to this [Section 6.01] if the [Commissioner]
    finds that all of the following conditions have \nbeen fulfilled: \n(1) \nThe
    requirements of subsections (b) and (d) have been met, as \napplicable; and \n(2)
    \nthe financial condition and responsibility, financial and business \nexperience,
    competence, character, and general fitness of the person, or group of persons
    \nacting in concert, seeking to acquire control; and the competence, experience,
    character, \nand general fitness of the key individuals and persons that would
    be in control of the \nlicensee after the acquisition of control indicate that
    it is in the interest of the public to \npermit the person, or group of persons
    acting in concert, to control the licensee. \n(h) \nIf an applicant avails itself
    or is otherwise subject to a multistate licensing \n \n15 Commentary: NMLS will
    accommodate and streamline the process of communicating when applications are
    \nreceived and when states consider them to have been complete. The intent of
    this Act is for the application period to \nbegin on the day an application is
    determined to be complete.\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000023
    start: 0
    end: 2523
    page_number: 23
    section_label: null
    body_hash: 83a664c778fbc9de0b4d13270e2a918f6488b461db1a6617e3d36032163068ca
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000023.md
    text: "23 \n \nprocess: \n(1) \nthe [Commissioner] is authorized and encouraged
      to accept the \ninvestigation results of a lead investigative state for the
      purpose of [Section 6.01(g)] if the \nlead investigative state has sufficient
      staffing, expertise, and minimum standards; or \n(2) \nif [state] is a lead
      investigative state, the [Commissioner] is \nauthorized and encouraged to investigate
      the applicant pursuant to [Section 6.01(g)] and \nthe timeframes established
      by agreement through the multistate licensing process. \n(i) \nThe [Commissioner]
      shall issue a formal written notice of the denial of an \napplication to acquire
      control within thirty (30) days of the decision to deny the application. The
      \n[Commissioner] shall set forth in the notice of denial the specific reasons
      for the denial of the \napplication. An applicant whose application is denied
      by the [Commissioner] under this [Section \n6.01(i)] may appeal within thirty
      (30) days16 after receipt of the written notice of the denial \n[pursuant to
      state administrative law procedures]. \n(j) \nThe requirements of [Section 6.01(a)
      and (b)] do not apply to any of the \nfollowing: \n(1) \nA person that acts
      as a proxy for the sole purpose of voting at a \ndesignated meeting of the shareholders
      or holders of voting shares or voting interests of a \nlicensee or a person
      in control of a licensee; \n(2) \nA person that acquires control of a licensee
      by devise or descent; \n(3) \nA person that acquires control of a licensee as
      a personal \nrepresentative, custodian, guardian, conservator, or trustee, or
      as an officer appointed by a \ncourt of competent jurisdiction or by operation
      of law; \n(4) \nA person that is exempt under [Section 3.01(g)]; \n(5) \nA person
      that the [Commissioner] determines is not subject to \n[Section 6.01(a)] based
      on the public interest; \n(6) \nA public offering of securities of a licensee
      or a person in control of \na licensee; or \n(7) \nAn internal reorganization
      of a person in control of the licensee \nwhere the ultimate person in control
      of the licensee remains the same. \n(k) \nPersons in [Sections 6.01(j)(2), (3),
      (4), (6), (7)] in cooperation with the \nlicensee shall notify the [Commissioner]
      within [15] days after the acquisition of control.17 \n \n16 Commentary: Administrative
      procedures for challenging a departmental decision may be derived from other
      \naspects of state law. In such a case, this Act should be adjusted to reflect
      the relevant administrative process. \n17 Commentary: Notice is satisfied upon
      updating the licensee’s NMLS record.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000023.md
  source_hash: 83a664c778fbc9de0b4d13270e2a918f6488b461db1a6617e3d36032163068ca
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 23, characters
    0–2523'
  unit_id: p000023
  locator: Page 23, characters 0–2523
  available_excerpt: "23 \n \nprocess: \n(1) \nthe [Commissioner] is authorized and
    encouraged to accept the \ninvestigation results of a lead investigative state
    for the purpose of [Section 6.01(g)] if the \nlead investigative state has sufficient
    staffing, expertise, and minimum standards; or \n(2) \nif [state] is a lead investigative
    state, the [Commissioner] is \nauthorized and encouraged to investigate the applicant
    pursuant to [Section 6.01(g)] and \nthe timeframes established by agreement through
    the multistate licensing process. \n(i) \nThe [Commissioner] shall issue a formal
    written notice of the denial of an \napplication to acquire control within thirty
    (30) days of the decision to deny the application. The \n[Commissioner] shall
    set forth in the notice of denial the specific reasons for the denial of the \napplication.
    An applicant whose application is denied by the [Commissioner] under this [Section
    \n6.01(i)] may appeal within thirty (30) days16 after receipt of the written notice
    of the denial \n[pursuant to state administrative law procedures]. \n(j) \nThe
    requirements of [Section 6.01(a) and (b)] do not apply to any of the \nfollowing:
    \n(1) \nA person that acts as a proxy for the sole purpose of voting at a \ndesignated
    meeting of the shareholders or holders of voting shares or voting interests of
    a \nlicensee or a person in control of a licensee; \n(2) \nA person that acquires
    control of a licensee by devise or descent; \n(3) \nA person that acquires control
    of a licensee as a personal \nrepresentative, custodian, guardian, conservator,
    or trustee, or as an officer appointed by a \ncourt of competent jurisdiction
    or by operation of law; \n(4) \nA person that is exempt under [Section 3.01(g)];
    \n(5) \nA person that the [Commissioner] determines is not subject to \n[Section
    6.01(a)] based on the public interest; \n(6) \nA public offering of securities
    of a licensee or a person in control of \na licensee; or \n(7) \nAn internal reorganization
    of a person in control of the licensee \nwhere the ultimate person in control
    of the licensee remains the same. \n(k) \nPersons in [Sections 6.01(j)(2), (3),
    (4), (6), (7)] in cooperation with the \nlicensee shall notify the [Commissioner]
    within [15] days after the acquisition of control.17 \n \n16 Commentary: Administrative
    procedures for challenging a departmental decision may be derived from other \naspects
    of state law. In such a case, this Act should be adjusted to reflect the relevant
    administrative process. \n17 Commentary: Notice is satisfied upon updating the
    licensee’s NMLS record.\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000024
    start: 0
    end: 2799
    page_number: 24
    section_label: null
    body_hash: 4732d9c2b053975a4d3cb27db8e99faa4baf45f71eb350fa519e31b5890ac680
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000024.md
    text: "24 \n \n(l) \nStreamlined Acquisition of Control \n(1) \nThe requirements
      of [Section 6.01(a) and (b)] do not apply to a \nperson that has complied with
      and received approval to engage in money transmission \nunder this [Act] or
      was identified as a person in control in a prior application filed with and
      \napproved by the [Commissioner] or by an MSB accredited state pursuant to a
      multistate \nlicensing process, provided that: \n(A) \nthe person has not had
      a license revoked or suspended or \ncontrolled a licensee that has had a license
      revoked or suspended while the person \nwas in control of the licensee in the
      previous 5-years; \n(B) \nif the person is a licensee, the person is well managed
      and \nhas received at least a satisfactory rating for compliance at its most
      recent \nexamination by an MSB accredited state if such rating was given; \n(C)
      \nthe licensee to be acquired is projected to meet the \nrequirements of [Sections
      10.01, 10.02, and 10.03] of this [Act] after the acquisition \nof control is
      completed, and if the person acquiring control is a licensee, that \nlicensee
      is also projected to meet the requirements of [Sections 10.01, 10.02, and \n10.03]
      of this [Act] after the acquisition of control is completed; \n(D) \nthe licensee
      to be acquired will not implement any material \nchanges to its business plan
      as a result of the acquisition of control, and if the person \nacquiring control
      is a licensee, that licensee also will not implement any material \nchanges
      to its business plan as a result of the acquisition of control;  and \n(E) \nthe
      person provides notice of the acquisition in cooperation \nwith the licensee
      and attests to [Section 6.01(l)(1)(A), (B), (C), and (D)] in a form \nand in
      a medium prescribed by the [Commissioner]. \n(2) \nIf the notice is not disapproved
      within 30 days after the date on \nwhich the notice was determined to be complete,
      the notice is deemed approved. \n(m) \nBefore filing an application for approval
      to acquire control of a licensee a \nperson may request in writing a determination
      from the [Commissioner] as to whether the person \nwould be considered a person
      in control of a licensee upon consummation of a proposed \ntransaction. If the
      [Commissioner] determines that the person would not be a person in control of
      \na licensee, the proposed Person and transaction is not subject to the requirements
      of [Section \n6.01(a) and (b)] of this [Act]. \n(n) \nIf a multistate licensing
      process includes a determination pursuant to \n[Section 6.01(m)] and an applicant
      avails itself or is otherwise subject to the multistate licensing \nprocess:
      \n(1) \nThe [Commissioner] is authorized and encouraged to accept the \ncontrol
      determination of a lead investigative state with sufficient staffing, expertise,
      and \nminimum standards for the purpose of [Section 6.01(m)]; or\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000024.md
  source_hash: 4732d9c2b053975a4d3cb27db8e99faa4baf45f71eb350fa519e31b5890ac680
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 24, characters
    0–2799'
  unit_id: p000024
  locator: Page 24, characters 0–2799
  available_excerpt: "24 \n \n(l) \nStreamlined Acquisition of Control \n(1) \nThe
    requirements of [Section 6.01(a) and (b)] do not apply to a \nperson that has
    complied with and received approval to engage in money transmission \nunder this
    [Act] or was identified as a person in control in a prior application filed with
    and \napproved by the [Commissioner] or by an MSB accredited state pursuant to
    a multistate \nlicensing process, provided that: \n(A) \nthe person has not had
    a license revoked or suspended or \ncontrolled a licensee that has had a license
    revoked or suspended while the person \nwas in control of the licensee in the
    previous 5-years; \n(B) \nif the person is a licensee, the person is well managed
    and \nhas received at least a satisfactory rating for compliance at its most recent
    \nexamination by an MSB accredited state if such rating was given; \n(C) \nthe
    licensee to be acquired is projected to meet the \nrequirements of [Sections 10.01,
    10.02, and 10.03] of this [Act] after the acquisition \nof control is completed,
    and if the person acquiring control is a licensee, that \nlicensee is also projected
    to meet the requirements of [Sections 10.01, 10.02, and \n10.03] of this [Act]
    after the acquisition of control is completed; \n(D) \nthe licensee to be acquired
    will not implement any material \nchanges to its business plan as a result of
    the acquisition of control, and if the person \nacquiring control is a licensee,
    that licensee also will not implement any material \nchanges to its business plan
    as a result of the acquisition of control;  and \n(E) \nthe person provides notice
    of the acquisition in cooperation \nwith the licensee and attests to [Section
    6.01(l)(1)(A), (B), (C), and (D)] in a form \nand in a medium prescribed by the
    [Commissioner]. \n(2) \nIf the notice is not disapproved within 30 days after
    the date on \nwhich the notice was determined to be complete, the notice is deemed
    approved. \n(m) \nBefore filing an application for approval to acquire control
    of a licensee a \nperson may request in writing a determination from the [Commissioner]
    as to whether the person \nwould be considered a person in control of a licensee
    upon consummation of a proposed \ntransaction. If the [Commissioner] determines
    that the person would not be a person in control of \na licensee, the proposed
    Person and transaction is not subject to the requirements of [Section \n6.01(a)
    and (b)] of this [Act]. \n(n) \nIf a multistate licensing process includes a determination
    pursuant to \n[Section 6.01(m)] and an applicant avails itself or is otherwise
    subject to the multistate licensing \nprocess: \n(1) \nThe [Commissioner] is authorized
    and encouraged to accept the \ncontrol determination of a lead investigative state
    with sufficient staffing, expertise, and \nminimum standards for the purpose of
    [Section 6.01(m)]; or\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000004
    start: 298
    end: 2509
    page_number: 4
    section_label: null
    body_hash: 2245b178c49fc1f157bf15c133c59f8fcfe9abdf43f0bf94df397229a7889584
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000004.md
    text: "ly for goods or services provided by the issuer or its affiliate or franchisees
      of the issuer \nor its affiliate, except to the extent required by applicable
      law to be redeemable in cash for its cash \nvalue; \n(f) \n\"Control\" means
      \n(1) \n(A) the power to vote, directly or indirectly, at least 25 percent of
      \nthe outstanding voting shares or voting interests of a licensee or person
      in control of a \nlicensee; \n(B) \nthe power to elect or appoint a majority
      of key individuals or \nexecutive officers, managers, directors, trustees, or
      other persons exercising \nmanagerial authority of a person in control of a
      licensee; or \n(C) \nthe power to exercise, directly or indirectly, a controlling
      \ninfluence over the management or policies of a licensee or person in control
      of a \nlicensee. \n(2) \nRebuttable Presumption of Control. \n(A) \nA person
      is presumed to exercise a controlling influence \nwhen the person holds the
      power to vote, directly or indirectly, at least 10 percent \nof the outstanding
      voting shares or voting interests of a licensee or person in control \nof a
      licensee.2 \n(B) \nA person presumed to exercise a controlling influence as
      \ndefined by this [Section 2.01(f)] can rebut the presumption of control if
      the person \nis a passive investor. \n(3) \nFor purposes of determining the
      percentage of a person controlled \nby any other person, the person's interest
      shall be aggregated with the interest of any other \nimmediate family member,
      including the person's spouse, parents, children, siblings, \nmothers- and fathers-in
      law, sons- and daughters-in-law, brothers- and sisters-in-law, and \nany other
      person who shares such person's home. \n(g) \n\"Eligible rating\" shall mean
      a credit rating of any of the three highest rating \ncategories provided by
      an eligible rating service, whereby each category may include rating \n \n2
      Commentary: The obligation to rebut control rests exclusively with the person
      acquiring ≥10% of the outstanding \nvoting shares or voting interests of a licensee
      or person in control of a licensee.  It is not the responsibility of the \nlicensee
      to rebut control.  This is consistent with Section 601(a) of the Act which requires
      the person acquiring control \nto obtain prior approval.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000004.md
  source_hash: 2245b178c49fc1f157bf15c133c59f8fcfe9abdf43f0bf94df397229a7889584
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 4, characters
    298–2509'
  unit_id: p000004
  locator: Page 4, characters 298–2509
  available_excerpt: "ly for goods or services provided by the issuer or its affiliate
    or franchisees of the issuer \nor its affiliate, except to the extent required
    by applicable law to be redeemable in cash for its cash \nvalue; \n(f) \n\"Control\"
    means \n(1) \n(A) the power to vote, directly or indirectly, at least 25 percent
    of \nthe outstanding voting shares or voting interests of a licensee or person
    in control of a \nlicensee; \n(B) \nthe power to elect or appoint a majority of
    key individuals or \nexecutive officers, managers, directors, trustees, or other
    persons exercising \nmanagerial authority of a person in control of a licensee;
    or \n(C) \nthe power to exercise, directly or indirectly, a controlling \ninfluence
    over the management or policies of a licensee or person in control of a \nlicensee.
    \n(2) \nRebuttable Presumption of Control. \n(A) \nA person is presumed to exercise
    a controlling influence \nwhen the person holds the power to vote, directly or
    indirectly, at least 10 percent \nof the outstanding voting shares or voting interests
    of a licensee or person in control \nof a licensee.2 \n(B) \nA person presumed
    to exercise a controlling influence as \ndefined by this [Section 2.01(f)] can
    rebut the presumption of control if the person \nis a passive investor. \n(3)
    \nFor purposes of determining the percentage of a person controlled \nby any other
    person, the person's interest shall be aggregated with the interest of any other
    \nimmediate family member, including the person's spouse, parents, children, siblings,
    \nmothers- and fathers-in law, sons- and daughters-in-law, brothers- and sisters-in-law,
    and \nany other person who shares such person's home. \n(g) \n\"Eligible rating\"
    shall mean a credit rating of any of the three highest rating \ncategories provided
    by an eligible rating service, whereby each category may include rating \n \n2
    Commentary: The obligation to rebut control rests exclusively with the person
    acquiring ≥10% of the outstanding \nvoting shares or voting interests of a licensee
    or person in control of a licensee.  It is not the responsibility of the \nlicensee
    to rebut control.  This is consistent with Section 601(a) of the Act which requires
    the person acquiring control \nto obtain prior approval.\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000030
    start: 0
    end: 2670
    page_number: 30
    section_label: null
    body_hash: 0d032292dd6b007bb0772b41f7c3f21512a56d4557c8c7b69696774b6248c842
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000030.md
    text: "30 \n \n(1) \nappoint the person signing the contract as the licensee's
      authorized \ndelegate with the authority to conduct money transmission on behalf
      of the licensee; \n(2) \nset forth the nature and scope of the relationship
      between the \nlicensee and the authorized delegate and the respective rights
      and responsibilities of the \nparties; \n(3) \nrequire the authorized delegate
      to agree to fully comply with all \napplicable state and federal laws, rules,
      and regulations pertaining to money transmission, \nincluding this [Act] and
      regulations implementing this [Act], relevant provisions of the \nBank Secrecy
      Act and the USA PATRIOT ACT; \n(4) \nrequire the authorized delegate to remit
      and handle money and \nmonetary value in accordance with the terms of the contract
      between the licensee and the \nauthorized delegate; \n(5) \nimpose a trust on
      money and monetary value net of fees received for \nmoney transmission for the
      benefit of the licensee; \n(6) \nrequire the authorized delegate to prepare
      and maintain records as \nrequired by this [Act] or regulations implementing
      this [Act], or as reasonably requested \nby the [Commissioner]; \n(7) \nacknowledge
      that the authorized delegate consents to examination \nor investigation by the
      [Commissioner]; \n(8) \nstate that the licensee is subject to regulation by
      the [Commissioner] \nand that, as part of that regulation, the [Commissioner]
      may suspend or revoke an \nauthorized delegate designation or require the licensee
      to terminate an authorized delegate \ndesignation; and \n(9) \n(9)  acknowledge
      receipt of the written policies and procedures \nrequired under [Section 8.01(b)(1)].
      \n(e) \nIf the licensee's license is suspended, revoked, surrendered, or expired,
      the \nlicensee must, within five (5) business days, provide documentation to
      the [Commissioner] that \nthe licensee has notified all applicable authorized
      delegates of the licensee whose names are in a \nrecord filed with the [Commissioner]
      of the suspension, revocation, surrender, or expiration of a \nlicense. Upon
      suspension, revocation, surrender, or expiration of a license, applicable authorized
      \ndelegates shall immediately cease to provide money transmission as an authorized
      delegate of the \nlicensee. \n(f) \nAn authorized delegate of a licensee holds
      in trust for the benefit of the \nlicensee all money net of fees received from
      money transmission.  If any authorized delegate \ncommingles any funds received
      from money transmission with any other funds or property owned \nor controlled
      by the authorized delegate, all commingled funds and other property shall be
      \nconsidered held in trust in favor of the licensee in an amount equal to the
      amount of money net of\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000030.md
  source_hash: 0d032292dd6b007bb0772b41f7c3f21512a56d4557c8c7b69696774b6248c842
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 30, characters
    0–2670'
  unit_id: p000030
  locator: Page 30, characters 0–2670
  available_excerpt: "30 \n \n(1) \nappoint the person signing the contract as the
    licensee's authorized \ndelegate with the authority to conduct money transmission
    on behalf of the licensee; \n(2) \nset forth the nature and scope of the relationship
    between the \nlicensee and the authorized delegate and the respective rights and
    responsibilities of the \nparties; \n(3) \nrequire the authorized delegate to
    agree to fully comply with all \napplicable state and federal laws, rules, and
    regulations pertaining to money transmission, \nincluding this [Act] and regulations
    implementing this [Act], relevant provisions of the \nBank Secrecy Act and the
    USA PATRIOT ACT; \n(4) \nrequire the authorized delegate to remit and handle money
    and \nmonetary value in accordance with the terms of the contract between the
    licensee and the \nauthorized delegate; \n(5) \nimpose a trust on money and monetary
    value net of fees received for \nmoney transmission for the benefit of the licensee;
    \n(6) \nrequire the authorized delegate to prepare and maintain records as \nrequired
    by this [Act] or regulations implementing this [Act], or as reasonably requested
    \nby the [Commissioner]; \n(7) \nacknowledge that the authorized delegate consents
    to examination \nor investigation by the [Commissioner]; \n(8) \nstate that the
    licensee is subject to regulation by the [Commissioner] \nand that, as part of
    that regulation, the [Commissioner] may suspend or revoke an \nauthorized delegate
    designation or require the licensee to terminate an authorized delegate \ndesignation;
    and \n(9) \n(9)  acknowledge receipt of the written policies and procedures \nrequired
    under [Section 8.01(b)(1)]. \n(e) \nIf the licensee's license is suspended, revoked,
    surrendered, or expired, the \nlicensee must, within five (5) business days, provide
    documentation to the [Commissioner] that \nthe licensee has notified all applicable
    authorized delegates of the licensee whose names are in a \nrecord filed with
    the [Commissioner] of the suspension, revocation, surrender, or expiration of
    a \nlicense. Upon suspension, revocation, surrender, or expiration of a license,
    applicable authorized \ndelegates shall immediately cease to provide money transmission
    as an authorized delegate of the \nlicensee. \n(f) \nAn authorized delegate of
    a licensee holds in trust for the benefit of the \nlicensee all money net of fees
    received from money transmission.  If any authorized delegate \ncommingles any
    funds received from money transmission with any other funds or property owned
    \nor controlled by the authorized delegate, all commingled funds and other property
    shall be \nconsidered held in trust in favor of the licensee in an amount equal
    to the amount of money net of\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000031
    start: 0
    end: 2704
    page_number: 31
    section_label: null
    body_hash: 994d5382d8c2640923eca8c8aabbca98c8fbaeec037edafbf7675c1a3819b1e7
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000031.md
    text: "31 \n \nfees received from money transmission.22 \n(g) \nAn authorized
      delegate may not use a subdelegate to conduct money \ntransmission on behalf
      of a licensee. \nSection 8.02 Unauthorized Activities \nA person shall not engage
      in the business of money transmission on behalf of a person \nnot licensed under
      this [Act]  or not exempt pursuant to [Article III] of this [Act]. A person
      that \nengages in such activity provides money transmission to the same extent
      as if the person were a \nlicensee, and shall be jointly and severally liable
      with the unlicensed or nonexempt person. \nSection 8.03 [Optional]: Prohibited
      Authorized Delegates. \n(a) \nThe [appropriate court] in an action brought by
      a licensee shall have \njurisdiction to grant appropriate equitable or legal
      relief, including without limitation prohibiting \nthe authorized delegate from
      directly or indirectly acting as an authorized delegate for any licensee \nin
      this state and the payment of restitution, damages or other monetary relief,
      if the [appropriate \ncourt] finds that an authorized delegate failed to remit
      money in accordance with the written \ncontract required by [Section 8.01(b)]
      or as otherwise directed by the licensee or required by law. \n(b) \nIf the
      [appropriate court] issues an order prohibiting a person from acting as \nan
      authorized delegate for any licensee pursuant to [Section 8.03(a)], the licensee
      that brought the \naction shall report the order to the [Commissioner] within
      thirty (30) days and shall report the \norder through NMLS within ninety (90)
      days. \n(c) \nAn authorized delegate who holds money in trust for the benefit
      of a \nlicensee and knowingly fails to remit more than [$XXX] of such money
      is guilty of a [reference \nto state classification] felony. \n(d) \nAn authorized
      delegate who holds money in trust for the benefit of a \nlicensee and knowingly
      fails to remit no more than [$XXX] of such money is guilty of a [reference \nto
      state classification] misdemeanor. \nARTICLE IX  \nTimely Transmission, Refunds,
      and Disclosures \nSection 9.01 Timely Transmission. \n(a) \nEvery licensee shall
      forward all money received for transmission in \naccordance with the terms of
      the agreement between the licensee and the sender unless the licensee \nhas
      a reasonable belief or a reasonable basis to believe that the sender may be
      a victim of fraud or \nthat a crime or violation of law, rule, or regulation
      has occurred, is occurring, or may occur. \n(b) \nIf a licensee fails to forward
      money received for transmission in accordance \nwith this section, the licensee
      must respond to inquiries by the sender with the reason for the failure \n \n22
      Commentary: An express trust account or segregated bank account is not required.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000031.md
  source_hash: 994d5382d8c2640923eca8c8aabbca98c8fbaeec037edafbf7675c1a3819b1e7
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 31, characters
    0–2704'
  unit_id: p000031
  locator: Page 31, characters 0–2704
  available_excerpt: "31 \n \nfees received from money transmission.22 \n(g) \nAn
    authorized delegate may not use a subdelegate to conduct money \ntransmission
    on behalf of a licensee. \nSection 8.02 Unauthorized Activities \nA person shall
    not engage in the business of money transmission on behalf of a person \nnot licensed
    under this [Act]  or not exempt pursuant to [Article III] of this [Act]. A person
    that \nengages in such activity provides money transmission to the same extent
    as if the person were a \nlicensee, and shall be jointly and severally liable
    with the unlicensed or nonexempt person. \nSection 8.03 [Optional]: Prohibited
    Authorized Delegates. \n(a) \nThe [appropriate court] in an action brought by
    a licensee shall have \njurisdiction to grant appropriate equitable or legal relief,
    including without limitation prohibiting \nthe authorized delegate from directly
    or indirectly acting as an authorized delegate for any licensee \nin this state
    and the payment of restitution, damages or other monetary relief, if the [appropriate
    \ncourt] finds that an authorized delegate failed to remit money in accordance
    with the written \ncontract required by [Section 8.01(b)] or as otherwise directed
    by the licensee or required by law. \n(b) \nIf the [appropriate court] issues
    an order prohibiting a person from acting as \nan authorized delegate for any
    licensee pursuant to [Section 8.03(a)], the licensee that brought the \naction
    shall report the order to the [Commissioner] within thirty (30) days and shall
    report the \norder through NMLS within ninety (90) days. \n(c) \nAn authorized
    delegate who holds money in trust for the benefit of a \nlicensee and knowingly
    fails to remit more than [$XXX] of such money is guilty of a [reference \nto state
    classification] felony. \n(d) \nAn authorized delegate who holds money in trust
    for the benefit of a \nlicensee and knowingly fails to remit no more than [$XXX]
    of such money is guilty of a [reference \nto state classification] misdemeanor.
    \nARTICLE IX  \nTimely Transmission, Refunds, and Disclosures \nSection 9.01 Timely
    Transmission. \n(a) \nEvery licensee shall forward all money received for transmission
    in \naccordance with the terms of the agreement between the licensee and the sender
    unless the licensee \nhas a reasonable belief or a reasonable basis to believe
    that the sender may be a victim of fraud or \nthat a crime or violation of law,
    rule, or regulation has occurred, is occurring, or may occur. \n(b) \nIf a licensee
    fails to forward money received for transmission in accordance \nwith this section,
    the licensee must respond to inquiries by the sender with the reason for the failure
    \n \n22 Commentary: An express trust account or segregated bank account is not
    required.\n"
- source_id: SRC-71b20ecf65825d6522c4
  source_version: d021ece0cde82565eb83511c8122c85b
  title: Money Transmitter Licensing | Department of Financial Services
  extraction_state: complete
  selected_passages:
  - unit_id: s000001
    start: 2400
    end: 7324
    page_number: null
    section_label: Section 1
    body_hash: 3c6e0983ad889dc93334add58721659be3ac3d4bf1075f544bcd9c940396e471
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-71b20ecf65825d6522c4/d021ece0cde82565eb83511c8122c85b/sections/s000001.md
    text: 'ey Transmitter License.


      Access to NMLS


      NMLS is a secure web-based system created by state regulators to provide efficiencies
      in the processing of state licenses and improve supervision of state-regulated
      industries.


      To access NMLS for the first time, you must complete a Company Account Request
      Form and identify a Primary Account Administrator and a Secondary Account Administrator.
      This form can be submitted online through the NMLS website in the Getting Started
      section. This form needs to be submitted only once per company, regardless of
      the number of NMLS participating states in which you are licensed.


      Within three days of completing and submitting the Company Account Request Form,
      the Primary Account Administrator will receive NMLS login information. The Primary
      Account Administrator will have full rights to access the system, submit information
      to this agency and other participating state regulators, and set up other company
      users in the system. Instructions and tutorials on how to access and use the
      system are also available in the NMLS Resource Center .


      Note : If your company already has a record in NMLS, you can omit this step.


      Managing Your License on NMLS


      Each company holding a DFS Money Transmitter License who wishes to manage their
      license on NMLS must create a company record in the system. To gain access to
      NMLS, the applicant must submit a form requesting an NMLS account.


      Current New York State Money Transmitters may transition their licenses to NMLS.
      See the DFS Money Transmitter Transition Checklist for more information.


      Submitting a Complete Application


      To submit an application and ensure your application is received, acknowledged
      as complete, and processed, please follow the instructions on the DFS Money
      Transmitter Checklists . No application shall be deemed to be complete until
      the Department has received all required information, documents, and fees.


      In the process of reviewing and considering the application, DFS may request
      additional information and supporting documents.


      In the application process, an NMLS Identification Number will be assigned to
      your application. Please maintain a record of this NMLS Identification Number,
      as it will be used as your application reference number throughout the remainder
      of the application process. The applicant’s NMLS Identification Number must
      be included on every hard-copy document submitted to the Department.


      Note : If the applicant has already submitted Forms MU1 and MU2 through NMLS
      for another state, the applicant does not need to re-enter the company record
      into NMLS. However, the applicant is required to provide jurisdiction-specific
      information to support its New York State application.


      Back to Top ▲


      Next Section


      Continue


      Annual Reporting


      The Annual Report should be prepared by qualified persons and submitted within
      120 days following the close of the calendar year January 1 to December 31,
      2025.


      2025 NMLS Money Transmitter Annual Report Form


      2025 Non-NMLS Money Transmitter Annual Report Form


      Back to Top ▲


      Next Section


      Continue


      Reporting Change in Certain Individuals


      Pursuant to the following sections of the New York Banking Law (BL) and Superintendent’s
      Regulations (SR), licensees of the Department of Financial Services (DFS) are
      required to notify the Superintendent of changes in certain individuals, within
      stipulated time frames:


      Money Transmitters: BL 641, 642 and 652-a; and SR 406.11


      These requirements are for changes in certain individuals of licensees whose
      licenses are not managed on NMLS. For those managed on NMLS, visit the NMLS
      section website for New York State and navigate to Company Licenses and Amendment
      under the pertinent industry type, and look under Change in Control on the Amendment
      Checklist.


      Included Individuals


      Members of the governing board such as directors, trustees, and LLC members


      Officers (at a minimum Chief Executive Officer, President, Chief Financial Officer,
      Chief Compliance Officer, and Chief Operations Officer, and any other officers
      deemed necessary by DFS)


      Documentary requirements for Each Included Individual Being Added


      Notification on the licensee''s letterhead signed by an authorized officer containing
      the following:


      Name and title of the individual being added


      Effective date of the addition


      Name and title of the person being replaced, and his/her new title/position,
      if any


      Resolution of the governing board approving the addition


      Personal Questionnaire (PDF)


      Fingerprints


      Background Investigation Report *


      Litigation Affidavit (PDF)


      Authority to Release Information (PDF)


      Resume


      Documentary requirements for Each Included Individual Being Removed:


      Notification on the licensee''s letterhead signed by an authorized officer containing
      the following:


      Name and title of the individual being removed


      Reason of the removal


      Effective date of the removal


      New title/position, if any


      Where To Submit?'
  support_state: retrieved
  url: https://www.dfs.ny.gov/apps_and_licensing/money_transmitters
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-71b20ecf65825d6522c4-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-71b20ecf65825d6522c4/d021ece0cde82565eb83511c8122c85b/sections/s000001.md
  source_hash: 3c6e0983ad889dc93334add58721659be3ac3d4bf1075f544bcd9c940396e471
  source_label: Money Transmitter Licensing | Department of Financial Services — Section
    1, characters 2400–7324
  unit_id: s000001
  locator: Section 1, characters 2400–7324
  available_excerpt: 'ey Transmitter License.


    Access to NMLS


    NMLS is a secure web-based system created by state regulators to provide efficiencies
    in the processing of state licenses and improve supervision of state-regulated
    industries.


    To access NMLS for the first time, you must complete a Company Account Request
    Form and identify a Primary Account Administrator and a Secondary Account Administrator.
    This form can be submitted online through the NMLS website in the Getting Started
    section. This form needs to be submitted only once per company, regardless of
    the number of NMLS participating states in which you are licensed.


    Within three days of completing and submitting the Company Account Request Form,
    the Primary Account Administrator will receive NMLS login information. The Primary
    Account Administrator will have full rights to access the system, submit information
    to this agency and other participating state regulators, and set up other company
    users in the system. Instructions and tutorials on how to access and use the system
    are also available in the NMLS Resource Center .


    Note : If your company already has a record in NMLS, you can omit this step.


    Managing Your License on NMLS


    Each company holding a DFS Money Transmitter License who wishes to manage their
    license on NMLS must create a company record in the system. To gain access to
    NMLS, the applicant must submit a form requesting an NMLS account.


    Current New York State Money Transmitters may transition their licenses to NMLS.
    See the DFS Money Transmitter Transition Checklist for more information.


    Submitting a Complete Application


    To submit an application and ensure your application is received, acknowledged
    as complete, and processed, please follow the instructions on the DFS Money Transmitter
    Checklists . No application shall be deemed to be complete until the Department
    has received all required information, documents, and fees.


    In the process of reviewing and considering the application, DFS may request additional
    information and supporting documents.


    In the application process, an NMLS Identification Number will be assigned to
    your application. Please maintain a record of this NMLS Identification Number,
    as it will be used as your application reference number throughout the remainder
    of the application process. The applicant’s NMLS Identification Number must be
    included on every hard-copy document submitted to the Department.


    Note : If the applicant has already submitted Forms MU1 and MU2 through NMLS for
    another state, the applicant does not need to re-enter the company record into
    NMLS. However, the applicant is required to provide jurisdiction-specific information
    to support its New York State application.


    Back to Top ▲


    Next Section


    Continue


    Annual Reporting


    The Annual Report should be prepared by qualified persons and submitted within
    120 days following the close of the calendar year January 1 to December 31, 2025.


    2025 NMLS Money Transmitter Annual Report Form


    2025 Non-NMLS Money Transmitter Annual Report Form


    Back to Top ▲


    Next Section


    Continue


    Reporting Change in Certain Individuals


    Pursuant to the following sections of the New York Banking Law (BL) and Superintendent’s
    Regulations (SR), licensees of the Department of Financial Services (DFS) are
    required to notify the Superintendent of changes in certain individuals, within
    stipulated time frames:


    Money Transmitters: BL 641, 642 and 652-a; and SR 406.11


    These requirements are for changes in certain individuals of licensees whose licenses
    are not managed on NMLS. For those managed on NMLS, visit the NMLS section website
    for New York State and navigate to Company Licenses and Amendment under the pertinent
    industry type, and look under Change in Control on the Amendment Checklist.


    Included Individuals


    Members of the governing board such as directors, trustees, and LLC members


    Officers (at a minimum Chief Executive Officer, President, Chief Financial Officer,
    Chief Compliance Officer, and Chief Operations Officer, and any other officers
    deemed necessary by DFS)


    Documentary requirements for Each Included Individual Being Added


    Notification on the licensee''s letterhead signed by an authorized officer containing
    the following:


    Name and title of the individual being added


    Effective date of the addition


    Name and title of the person being replaced, and his/her new title/position, if
    any


    Resolution of the governing board approving the addition


    Personal Questionnaire (PDF)


    Fingerprints


    Background Investigation Report *


    Litigation Affidavit (PDF)


    Authority to Release Information (PDF)


    Resume


    Documentary requirements for Each Included Individual Being Removed:


    Notification on the licensee''s letterhead signed by an authorized officer containing
    the following:


    Name and title of the individual being removed


    Reason of the removal


    Effective date of the removal


    New title/position, if any


    Where To Submit?'
- source_id: SRC-b48d8d40f5a0cfe9a200
  source_version: 6ebc7b743e605b8e05363eb0628942c1
  title: How To Get A Money Transmitter License (MTL) in the U.S. - Fenergo
  extraction_state: complete
  selected_passages:
  - unit_id: s000002
    start: 0
    end: 3321
    page_number: null
    section_label: Section 2
    body_hash: b8cfb71cc698f4b53cce08d023441fce54bf275adbcb1164dfb05a05143f6ba9
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-b48d8d40f5a0cfe9a200/6ebc7b743e605b8e05363eb0628942c1/sections/s000002.md
    text: 'How To Get A Money Transmitter License (MTL) in the U.S.


      Published Date  January 29, 2026


      To get a Money Transmitter License (MTL), businesses must undergo a rigorous
      application process that involves dual compliance with federal (like FinCEN''s
      AML/KYC protocols) and varying state-level regulations. Key requirements across
      states include demonstrating financial viability, often requiring a surety bond
      and capital reserves, passing comprehensive background checks for key personnel,
      and establishing a robust internal compliance program. The process is complex,
      time-consuming, and mandates extensive documentation and financial disclosures
      to ensure the applicant is law-abiding and financially sound.


      Operating a money transfer service in the U.S. involves tackling a myriad of
      federal and state laws, making how to get a money transmitter license both time-consuming
      and expensive. Compliance with agencies like FinCEN is non-negotiable to prevent
      illegal activities.


      Companies can either secure their own MSB license or partner with a licensed
      entity, but legal adherence is vital in both scenarios. It''s essential to understand
      what a money transmitter license is and who needs it.


      What is a Money Transmitter License?


      A Money Transmitter License is an official authorization or money service business
      license that empowers a firm or individual to facilitate the movement of capital.
      This license enables MSBs to handle financial transactions, ranging from digital
      payments to wire transfers.


      Possessing a Money Transmitter License brings forth substantial regulatory oversight.
      Organizations must prove they have the governance structure and internal controls
      to manage and safeguard client funds. States will continually scrutinize applicants,
      denying licensure to those who fail to meet the stringent criteria.


      In the United States, the need for a Money Transmitter License is not a choice;
      it''s a requirement for virtually any business involved in the handling or transferring
      of funds. Money transmitter license requirements by state can vary, so it''s
      crucial to be aware of the respective state money transmitter regulations.


      How to Get a Money Transmitter License?


      The license application process is designed to be rigorous, ensuring that approved
      businesses are law-abiding and financially sound. Federal and state-level regulations
      diverge, with each state setting its own financial criteria and often requiring
      a minimum capital commitment.


      Applicants typically need a surety bond of at least $500,000 per state, with
      costs influenced by credit history. The duration to obtain the license varies,
      contingent on the business type and the state of operation.


      Money Transmitter License Requirements


      Acquiring a money transmitter license involves compliance with Anti-Money Laundering
      (AML) and Know Your Customer (KYC) protocols. While these regulations are federal,
      individual states often impose additional requirements, thereby necessitating
      dual compliance.


      Subsequent to application submission, state authorities undertake an investigative
      review, focusing on financial sustainability and the applicant''s background.


      Standardized Requirements Across States


      Registration: Initial registration typically occurs with the Financial Crimes
      Enforcement Network or a similar state-level body.'
  support_state: retrieved
  url: https://resources.fenergo.com/blogs/how-to-get-a-money-transmitter-license
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-b48d8d40f5a0cfe9a200-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-b48d8d40f5a0cfe9a200/6ebc7b743e605b8e05363eb0628942c1/sections/s000002.md
  source_hash: b8cfb71cc698f4b53cce08d023441fce54bf275adbcb1164dfb05a05143f6ba9
  source_label: How To Get A Money Transmitter License (MTL) in the U.S. - Fenergo
    — Section 2, characters 0–3321
  unit_id: s000002
  locator: Section 2, characters 0–3321
  available_excerpt: 'How To Get A Money Transmitter License (MTL) in the U.S.


    Published Date  January 29, 2026


    To get a Money Transmitter License (MTL), businesses must undergo a rigorous application
    process that involves dual compliance with federal (like FinCEN''s AML/KYC protocols)
    and varying state-level regulations. Key requirements across states include demonstrating
    financial viability, often requiring a surety bond and capital reserves, passing
    comprehensive background checks for key personnel, and establishing a robust internal
    compliance program. The process is complex, time-consuming, and mandates extensive
    documentation and financial disclosures to ensure the applicant is law-abiding
    and financially sound.


    Operating a money transfer service in the U.S. involves tackling a myriad of federal
    and state laws, making how to get a money transmitter license both time-consuming
    and expensive. Compliance with agencies like FinCEN is non-negotiable to prevent
    illegal activities.


    Companies can either secure their own MSB license or partner with a licensed entity,
    but legal adherence is vital in both scenarios. It''s essential to understand
    what a money transmitter license is and who needs it.


    What is a Money Transmitter License?


    A Money Transmitter License is an official authorization or money service business
    license that empowers a firm or individual to facilitate the movement of capital.
    This license enables MSBs to handle financial transactions, ranging from digital
    payments to wire transfers.


    Possessing a Money Transmitter License brings forth substantial regulatory oversight.
    Organizations must prove they have the governance structure and internal controls
    to manage and safeguard client funds. States will continually scrutinize applicants,
    denying licensure to those who fail to meet the stringent criteria.


    In the United States, the need for a Money Transmitter License is not a choice;
    it''s a requirement for virtually any business involved in the handling or transferring
    of funds. Money transmitter license requirements by state can vary, so it''s crucial
    to be aware of the respective state money transmitter regulations.


    How to Get a Money Transmitter License?


    The license application process is designed to be rigorous, ensuring that approved
    businesses are law-abiding and financially sound. Federal and state-level regulations
    diverge, with each state setting its own financial criteria and often requiring
    a minimum capital commitment.


    Applicants typically need a surety bond of at least $500,000 per state, with costs
    influenced by credit history. The duration to obtain the license varies, contingent
    on the business type and the state of operation.


    Money Transmitter License Requirements


    Acquiring a money transmitter license involves compliance with Anti-Money Laundering
    (AML) and Know Your Customer (KYC) protocols. While these regulations are federal,
    individual states often impose additional requirements, thereby necessitating
    dual compliance.


    Subsequent to application submission, state authorities undertake an investigative
    review, focusing on financial sustainability and the applicant''s background.


    Standardized Requirements Across States


    Registration: Initial registration typically occurs with the Financial Crimes
    Enforcement Network or a similar state-level body.'
- source_id: SRC-e6c1e4e85e004ccbe413
  source_version: e06621859d4ec9431f2712a7c357b112
  title: OCC Confirms National Bank Act Preempts State Money Transmitter ...
  extraction_state: complete
  selected_passages:
  - unit_id: s000001
    start: 600
    end: 4794
    page_number: null
    section_label: Section 1
    body_hash: 8ef30c0b98621db1f11c16332c16e9928ea8f237d6b055f645f7b449f18cbdfb
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-e6c1e4e85e004ccbe413/e06621859d4ec9431f2712a7c357b112/sections/s000001.md
    text: ', 2026


      Posted in Bank Regulatory


      On May 12, the Office of the Comptroller of the Currency (OCC) issued a significant
      interpretive letter confirming that Fidelity Digital Assets, National Association
      (the recently converted national trust bank formerly known as Fidelity Digital
      Assets Service, LLC) is not required to hold state money transmitter licenses
      to conduct its federally authorized activities. The OCC concluded that the National
      Bank Act preempts any state money transmitter licensing requirement as applied
      to a national bank.


      Until December 12, 2025, Fidelity Digital Assets operated as a New York-chartered
      limited liability trust company and held money transmitter licenses in numerous
      states, including Iowa. On that date, the OCC approved its conversion to an
      uninsured national trust bank under 12 U.S.C. § 27(a). Concurrent with the conversion,
      the Bank surrendered its Iowa money transmitter license.


      Iowa pushed back. Its money transmitter statute exempts banks and trust companies
      from licensing, but only if they hold federally insured deposits. Because Fidelity
      Digital Assets is an uninsured national bank, Iowa argued the exemption did
      not apply and requested a legal basis for the license surrender. Fidelity Digital
      Assets responded that the National Bank Act preempts Iowa’s requirements and
      asked the OCC to confirm that position.


      The OCC’s analysis of whether a state can require a national bank to obtain
      a state money transmitter license as a condition of engaging in federally authorized
      activities, including cryptocurrency custody, trade execution, stablecoin issuance,
      and related digital asset services, rested on two independent and well-established
      pillars of federal banking law:


      1. National Bank Act Preemption


      Federal law authorizes national banks to conduct a broad range of activities
      on a national basis. Any state law that “prevents or significantly interferes”
      with a national bank’s exercise of its federally authorized powers is preempted.


      The OCC reasoned that requiring a national bank to obtain a state money transmitter
      license, even as a threshold condition to operating, would impermissibly condition
      the Bank’s federal authority on state approval. At the extreme, a state could
      veto federal authority outright by denying or revoking a license. Both outcomes
      are squarely preempted. This conclusion applies to any state’s money transmitter
      licensing regime, including states that limit their licensing exemptions to
      a subset of national banks (such as Iowa’s insured-deposits-only carveout).


      2. Exclusive Federal Visitorial Authority


      Separately, 12 U.S.C. § 484 vests the OCC with exclusive visitorial authority
      over national banks. “No national bank shall be subject to any visitorial powers
      except as authorized by Federal law.” Iowa’s money transmitter statute grants
      the state agency robust supervisory jurisdiction over licensees, including the
      power to demand books and records, conduct periodic examinations, take enforcement
      actions, and even place a licensee into receivership. Applying that regime to
      a national bank would be “fundamentally inconsistent” with the OCC’s exclusive
      visitorial powers and is therefore impermissible on independent grounds.


      Together, these two bases lead to a clean and sweeping conclusion: a national
      bank may conduct its federally authorized activities in any state without a
      state money transmitter license, regardless of whether it qualifies for any
      state-law exemption.


      Our Take


      The OCC’s conclusion here was entirely expected. The preemption framework for
      national banks is well-settled, and the OCC’s letter largely restates principles
      the Supreme Court and federal courts have applied for decades. That said, one
      nuance in this letter deserves closer attention: state-chartered trust banks
      are in a very different position.


      Unlike national banks, state trust companies and state-chartered banks do not
      benefit from National Bank Act preemption. Their ability to avoid state money
      transmitter licensing requirements depends entirely on how each individual state
      defines “bank” or “trust company” in its money transmission statute and those
      definitions vary considerably.


      Print:'
  support_state: retrieved
  url: https://www.troutmanfinancialservices.com/2026/06/occ-confirms-national-bank-act-preempts-state-money-transmitter-licensing-for-fidelity-digital-assets/
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-e6c1e4e85e004ccbe413-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-e6c1e4e85e004ccbe413/e06621859d4ec9431f2712a7c357b112/sections/s000001.md
  source_hash: 8ef30c0b98621db1f11c16332c16e9928ea8f237d6b055f645f7b449f18cbdfb
  source_label: OCC Confirms National Bank Act Preempts State Money Transmitter ...
    — Section 1, characters 600–4794
  unit_id: s000001
  locator: Section 1, characters 600–4794
  available_excerpt: ', 2026


    Posted in Bank Regulatory


    On May 12, the Office of the Comptroller of the Currency (OCC) issued a significant
    interpretive letter confirming that Fidelity Digital Assets, National Association
    (the recently converted national trust bank formerly known as Fidelity Digital
    Assets Service, LLC) is not required to hold state money transmitter licenses
    to conduct its federally authorized activities. The OCC concluded that the National
    Bank Act preempts any state money transmitter licensing requirement as applied
    to a national bank.


    Until December 12, 2025, Fidelity Digital Assets operated as a New York-chartered
    limited liability trust company and held money transmitter licenses in numerous
    states, including Iowa. On that date, the OCC approved its conversion to an uninsured
    national trust bank under 12 U.S.C. § 27(a). Concurrent with the conversion, the
    Bank surrendered its Iowa money transmitter license.


    Iowa pushed back. Its money transmitter statute exempts banks and trust companies
    from licensing, but only if they hold federally insured deposits. Because Fidelity
    Digital Assets is an uninsured national bank, Iowa argued the exemption did not
    apply and requested a legal basis for the license surrender. Fidelity Digital
    Assets responded that the National Bank Act preempts Iowa’s requirements and asked
    the OCC to confirm that position.


    The OCC’s analysis of whether a state can require a national bank to obtain a
    state money transmitter license as a condition of engaging in federally authorized
    activities, including cryptocurrency custody, trade execution, stablecoin issuance,
    and related digital asset services, rested on two independent and well-established
    pillars of federal banking law:


    1. National Bank Act Preemption


    Federal law authorizes national banks to conduct a broad range of activities on
    a national basis. Any state law that “prevents or significantly interferes” with
    a national bank’s exercise of its federally authorized powers is preempted.


    The OCC reasoned that requiring a national bank to obtain a state money transmitter
    license, even as a threshold condition to operating, would impermissibly condition
    the Bank’s federal authority on state approval. At the extreme, a state could
    veto federal authority outright by denying or revoking a license. Both outcomes
    are squarely preempted. This conclusion applies to any state’s money transmitter
    licensing regime, including states that limit their licensing exemptions to a
    subset of national banks (such as Iowa’s insured-deposits-only carveout).


    2. Exclusive Federal Visitorial Authority


    Separately, 12 U.S.C. § 484 vests the OCC with exclusive visitorial authority
    over national banks. “No national bank shall be subject to any visitorial powers
    except as authorized by Federal law.” Iowa’s money transmitter statute grants
    the state agency robust supervisory jurisdiction over licensees, including the
    power to demand books and records, conduct periodic examinations, take enforcement
    actions, and even place a licensee into receivership. Applying that regime to
    a national bank would be “fundamentally inconsistent” with the OCC’s exclusive
    visitorial powers and is therefore impermissible on independent grounds.


    Together, these two bases lead to a clean and sweeping conclusion: a national
    bank may conduct its federally authorized activities in any state without a state
    money transmitter license, regardless of whether it qualifies for any state-law
    exemption.


    Our Take


    The OCC’s conclusion here was entirely expected. The preemption framework for
    national banks is well-settled, and the OCC’s letter largely restates principles
    the Supreme Court and federal courts have applied for decades. That said, one
    nuance in this letter deserves closer attention: state-chartered trust banks are
    in a very different position.


    Unlike national banks, state trust companies and state-chartered banks do not
    benefit from National Bank Act preemption. Their ability to avoid state money
    transmitter licensing requirements depends entirely on how each individual state
    defines “bank” or “trust company” in its money transmission statute and those
    definitions vary considerably.


    Print:'
- source_id: SRC-LOCAL-27b344a827f0cf86ced5
  source_hash: bfa5205c5c55347ff2e44736fdf58a3f8fade088059bc29b892ac7fa1e500afb
  source_version: bfa5205c5c55347ff2e44736fdf58a3f8fade088059bc29b892ac7fa1e500afb
  path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-LOCAL-27b344a827f0cf86ced5.md
  original_path: 03_Matters/harbor-2-d89ad8/issues.md
  title: issues.md
  support_state: supplied
  source_type: workspace
  available_excerpt: '# Issues and workstreams


    - Money transmission licensing: whether Mosaic Relay can operate under the combined
    44-state footprint and whether Harbor''s MTLs transfer/survive the acquisition

    - BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
    documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML obligations

    - SAR and alert handling: obligations to review, file, and manage Harbor''s ~40
    open alerts and SARs, and successor liability

    - Monitoring vendor transition: continuity of transaction monitoring when the
    SaaS contract terminates at close

    - Marketing compliance: the $50 welcome bonus offer and any state money transmission
    or consumer protection implications

    - Customer account, contract, and data-transfer rights <!-- issue:ISS-c9d7c39f63-af341445a7af4c06
    -->

    '
  selected_passages:
  - start: 0
    end: 817
    text: '# Issues and workstreams


      - Money transmission licensing: whether Mosaic Relay can operate under the combined
      44-state footprint and whether Harbor''s MTLs transfer/survive the acquisition

      - BSA/AML and KYC: whether relying on Harbor''s prior KYC (with missing underlying
      documents for pre-2023 users) satisfies Mosaic Relay''s independent CIP/AML
      obligations

      - SAR and alert handling: obligations to review, file, and manage Harbor''s
      ~40 open alerts and SARs, and successor liability

      - Monitoring vendor transition: continuity of transaction monitoring when the
      SaaS contract terminates at close

      - Marketing compliance: the $50 welcome bonus offer and any state money transmission
      or consumer protection implications

      - Customer account, contract, and data-transfer rights <!-- issue:ISS-c9d7c39f63-af341445a7af4c06
      -->

      '
  content_truncated: false
  source_label: issues.md
- source_id: SRC-LOCAL-5b01121f7bfd7357746c
  source_hash: 58b0379461c2b3d9c58807fff3ac3f7136d5aedd4f20022fc8be9eeb64cec409
  source_version: 58b0379461c2b3d9c58807fff3ac3f7136d5aedd4f20022fc8be9eeb64cec409
  path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-LOCAL-5b01121f7bfd7357746c.md
  original_path: 03_Matters/harbor-2-d89ad8/facts.md
  title: facts.md
  support_state: supplied
  source_type: workspace
  available_excerpt: '# Known Facts


    - Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).

    - Migration moves 240k consumer users and 12k business accounts into Mosaic Relay''s
    app on day 1 post-close, with one unified account and balance and full access
    to Mosaic''s product set.

    - Plan is no re-verification; Harbor users were already KYC''d by Harbor.

    - Harbor holds money transmitter licenses (MTLs) in 38 states; Mosaic Relay holds
    41; combined footprint is 44 states, opening four new markets.

    - Harbor''s KYC ran through a vendor that shut down in 2024; Mosaic has pass/fail
    results for everyone but not the underlying documents for users onboarded before
    2023.

    - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
    at close; plan is to repoint Harbor''s transaction feed at Mosaic''s engine on
    day 1.

    - Marketing wants a ''Welcome'' campaign with a $50 bonus on first transfer, launching
    close+1.

    - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last year
    at Harbor; nobody has read them yet.

    - Migration moves 240k consumer users and 12k business accounts into Mosaic Relay''s
    app on day 1 post-close, with one unified account and balance.

    - Plan is no re-verification of Harbor''s existing KYC; Harbor users were already
    KYC''d.

    - Harbor''s KYC ran through a vendor that shut down in 2024; pass/fail results
    exist for everyone but underlying documents are missing for users onboarded before
    2023.

    - Harbor''s transaction monitoring is a third-party SaaS whose contract terminates
    at close; plan is to repoint the transaction feed to Mosaic Relay''s engine on
    day 1.

    - Diligence flagged ~40 open alerts and ''a handful'' of SARs from the last year
    at Harbor; none have been read yet.

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

    - For the four new markets opened by the combined license footprint, what is the
    plan for state money transmission licensing or approval before onboarding those
    customers? — Mosaic Relay currently plans to use or assume Harbor''s licenses
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

    - [Assumption] The acquisition is structured as an asset or stock purchase, which
    affects whether Harbor''s licenses and SAR/alert obligations transfer (structure
    not yet confirmed).

    '
  selected_passages:
  - start: 0
    end: 3962
    text: '# Known Facts


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
      (structure not yet confirmed).

      '
  content_truncated: false
  source_label: facts.md
- source_id: SRC-LOCAL-843f945d0832ba97e71a
  source_hash: e4242fa79f3b92949785891f5244f2974e8cd7f13b04fe492c2bfec99c9f576f
  source_version: e4242fa79f3b92949785891f5244f2974e8cd7f13b04fe492c2bfec99c9f576f
  path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-LOCAL-843f945d0832ba97e71a.md
  original_path: 03_Matters/harbor-2-d89ad8/dossier.md
  title: dossier.md
  support_state: supplied
  source_type: workspace
  available_excerpt: '# Harbor 2 matter dossier


    ## Current position


    The Harbor Pay migration needs legal and compliance review before the planned
    Nov 15 close. This is the accepted working view. No decision has been recorded.


    This draft recommends continuing close preparation but making the day-one service
    migration conditional. Mosaic should not give all Harbor users full access until:


    1. Mosaic has documented authority for each post-close service in each affected
    state.

    2. Compliance confirms that Mosaic may rely on Harbor’s know-your-customer (KYC)
    results, or defines and completes remediation.

    3. Authorized reviewers assess Harbor’s open alerts and suspicious activity report
    (SAR) history.

    4. Mosaic tests the replacement transaction-monitoring feed and finds no material
    coverage gap.


    If a condition is not met, Mosaic should hold the affected state launch, restrict
    affected accounts, or delay full product access. The $50 welcome bonus should
    also wait for review of its structure, terms, funding, and disclosures.


    The saved material does not establish that the acquisition close itself must wait.
    However, the unread alerts and SAR history could affect deal terms, risk allocation,
    or the decision to close.


    ### Assumptions used


    - Harbor is subject to the state money-transmission and federal anti-money-laundering
    requirements discussed below. The licensing, KYC, alert, and monitoring conclusions
    depend on this unverified legal premise.

    - Mosaic will become the operating provider when Harbor users receive a unified
    Mosaic account, combined balance, and access to Mosaic products. The licensing
    analysis depends on this inference.

    - The analysis does not assume that Harbor’s licenses transfer, that Harbor’s
    KYC results satisfy Mosaic’s program, or that the monitoring transition will work
    without a gap.


    ### Record conflicts


    - Harbor reportedly has licenses in 38 states, Mosaic has licenses in 41 states,
    and the combined footprint is 44 states. A 44-state footprint is three states
    larger than Mosaic’s 41-state footprint, but the record says the acquisition opens
    four new markets. The license lists and the intended meaning of “market” are needed.
    Until then, the states requiring separate authority cannot be identified reliably.

    - Matter metadata gives a target date of `2026-09-11`. The reported close is “Nov
    15,” approximately ten weeks after the Sept. 9 intake. A saved hypothetical uses
    November 15, 2026, but that does not establish the actual closing year. The operative
    close date and year remain unresolved.


    ## Decision question


    Does any part of the Harbor Pay acquisition migration need legal review before
    the Nov 15 close?


    ## Issues


    <!-- issue:ISS-c9d7c39f63-94e42e2b38090045 -->

    ### Money transmission licensing: whether Mosaic Relay can operate under the combined
    44-state footprint and whether Harbor''s MTLs transfer/survive the acquisition


    **Current answer**


    Mosaic should not treat Harbor’s money transmitter licenses as assets that automatically
    move to Mosaic through the reported asset purchase. Mosaic should not start regulated
    services in a state unless it has documented authority for its complete post-close
    activity.


    The acquisition close and the service launch can be managed as separate milestones.
    If authority is not established, the present fallback is to hold the affected
    state launch or restrict regulated functions.


    **Rule and support**


    Saved research concludes that the answer must be determined state by state. The
    review must cover Mosaic’s authority, transaction notices or approvals, interim
    operations, outstanding customer obligations, and Harbor’s license surrender.


    Four sources were retrieved, but no operative passage was selected, read, or verified.
    They do not establish the rule in any affected state:


    - [Money transmission research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)

    - [source:SRC-37ee676da5b354ba8538]

    - [source:SRC-71b20ecf65825d6522c4]

    - [source:SRC-e6c1e4e85e004ccbe413]

    - [source:SRC-b48d8d40f5a0cfe9a200]


    The model act is not proof of any state’s adopted law. The premise that an asset
    purchase does not automatically give Mosaic Harbor’s operating authority remains
    an unverified state-law conclusion.


    **Application**


    Mosaic plans to use or assume Harbor’s licenses in the new markets. The planned
    unified Mosaic account, combined balance, and access to Mosaic products indicate
    that Mosaic may become the actual provider. If so, keeping Harbor’s entity or
    licenses active might not authorize Mosaic’s conduct.


    Harbor could remain the licensed provider during a transition only if customer
    contracts, funds flow, operating control, licenses, bonds, records, and applicable
    state rules support that result. The documents and actual operations must match.


    A partner bank holding funds would not alone resolve the issue. The analysis still
    depends on who contracts with users, controls transfers, owes repayment, records
    balances, resolves errors, and performs regulated duties.


    **Next step**


    Identify the Harbor-only jurisdictions and prepare a state matrix. For each state,
    determine Mosaic’s authority, required filings or approvals, operation while an
    application is pending, treatment of customer obligations, Harbor’s run-off duties,
    and the launch restriction needed if authority is not established.


    <!-- retained-issue:ISS-c9d7c39f63-94e42e2b38090045:start -->

    <details>

    <summary>Saved research and prior analysis</summary>


    Preserved research snapshot. Its facts and assumptions may predate later records.
    Use the current answer above for application to the current matter.


    Do not rely on transferability without an applicable state rule, approval, or
    written regulator position.


    The answer must be determined state by state and must cover more than technical
    change-of-control rules.


    This path is possible only if Harbor remains the real provider and the relevant
    states permit the arrangement. The unified Mosaic account design may conflict
    with that position.


    T'
  selected_passages:
  - start: 0
    end: 6000
    text: '# Harbor 2 matter dossier


      ## Current position


      The Harbor Pay migration needs legal and compliance review before the planned
      Nov 15 close. This is the accepted working view. No decision has been recorded.


      This draft recommends continuing close preparation but making the day-one service
      migration conditional. Mosaic should not give all Harbor users full access until:


      1. Mosaic has documented authority for each post-close service in each affected
      state.

      2. Compliance confirms that Mosaic may rely on Harbor’s know-your-customer (KYC)
      results, or defines and completes remediation.

      3. Authorized reviewers assess Harbor’s open alerts and suspicious activity
      report (SAR) history.

      4. Mosaic tests the replacement transaction-monitoring feed and finds no material
      coverage gap.


      If a condition is not met, Mosaic should hold the affected state launch, restrict
      affected accounts, or delay full product access. The $50 welcome bonus should
      also wait for review of its structure, terms, funding, and disclosures.


      The saved material does not establish that the acquisition close itself must
      wait. However, the unread alerts and SAR history could affect deal terms, risk
      allocation, or the decision to close.


      ### Assumptions used


      - Harbor is subject to the state money-transmission and federal anti-money-laundering
      requirements discussed below. The licensing, KYC, alert, and monitoring conclusions
      depend on this unverified legal premise.

      - Mosaic will become the operating provider when Harbor users receive a unified
      Mosaic account, combined balance, and access to Mosaic products. The licensing
      analysis depends on this inference.

      - The analysis does not assume that Harbor’s licenses transfer, that Harbor’s
      KYC results satisfy Mosaic’s program, or that the monitoring transition will
      work without a gap.


      ### Record conflicts


      - Harbor reportedly has licenses in 38 states, Mosaic has licenses in 41 states,
      and the combined footprint is 44 states. A 44-state footprint is three states
      larger than Mosaic’s 41-state footprint, but the record says the acquisition
      opens four new markets. The license lists and the intended meaning of “market”
      are needed. Until then, the states requiring separate authority cannot be identified
      reliably.

      - Matter metadata gives a target date of `2026-09-11`. The reported close is
      “Nov 15,” approximately ten weeks after the Sept. 9 intake. A saved hypothetical
      uses November 15, 2026, but that does not establish the actual closing year.
      The operative close date and year remain unresolved.


      ## Decision question


      Does any part of the Harbor Pay acquisition migration need legal review before
      the Nov 15 close?


      ## Issues


      <!-- issue:ISS-c9d7c39f63-94e42e2b38090045 -->

      ### Money transmission licensing: whether Mosaic Relay can operate under the
      combined 44-state footprint and whether Harbor''s MTLs transfer/survive the
      acquisition


      **Current answer**


      Mosaic should not treat Harbor’s money transmitter licenses as assets that automatically
      move to Mosaic through the reported asset purchase. Mosaic should not start
      regulated services in a state unless it has documented authority for its complete
      post-close activity.


      The acquisition close and the service launch can be managed as separate milestones.
      If authority is not established, the present fallback is to hold the affected
      state launch or restrict regulated functions.


      **Rule and support**


      Saved research concludes that the answer must be determined state by state.
      The review must cover Mosaic’s authority, transaction notices or approvals,
      interim operations, outstanding customer obligations, and Harbor’s license surrender.


      Four sources were retrieved, but no operative passage was selected, read, or
      verified. They do not establish the rule in any affected state:


      - [Money transmission research packet](03_Matters/harbor-2-d89ad8/research/RES-20260911-0a5f07.md)

      - [source:SRC-37ee676da5b354ba8538]

      - [source:SRC-71b20ecf65825d6522c4]

      - [source:SRC-e6c1e4e85e004ccbe413]

      - [source:SRC-b48d8d40f5a0cfe9a200]


      The model act is not proof of any state’s adopted law. The premise that an asset
      purchase does not automatically give Mosaic Harbor’s operating authority remains
      an unverified state-law conclusion.


      **Application**


      Mosaic plans to use or assume Harbor’s licenses in the new markets. The planned
      unified Mosaic account, combined balance, and access to Mosaic products indicate
      that Mosaic may become the actual provider. If so, keeping Harbor’s entity or
      licenses active might not authorize Mosaic’s conduct.


      Harbor could remain the licensed provider during a transition only if customer
      contracts, funds flow, operating control, licenses, bonds, records, and applicable
      state rules support that result. The documents and actual operations must match.


      A partner bank holding funds would not alone resolve the issue. The analysis
      still depends on who contracts with users, controls transfers, owes repayment,
      records balances, resolves errors, and performs regulated duties.


      **Next step**


      Identify the Harbor-only jurisdictions and prepare a state matrix. For each
      state, determine Mosaic’s authority, required filings or approvals, operation
      while an application is pending, treatment of customer obligations, Harbor’s
      run-off duties, and the launch restriction needed if authority is not established.


      <!-- retained-issue:ISS-c9d7c39f63-94e42e2b38090045:start -->

      <details>

      <summary>Saved research and prior analysis</summary>


      Preserved research snapshot. Its facts and assumptions may predate later records.
      Use the current answer above for application to the current matter.


      Do not rely on transferability without an applicable state rule, approval, or
      written regulator position.


      The answer must be determined state by state and must cover more than technical
      change-of-control rules.


      This path is possible only if Harbor remains the real provider and the relevant
      states permit the arrangement. The unified Mosaic account design may conflict
      with that position.


      T'
  content_truncated: true
  source_label: dossier.md
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000028
    start: 600
    end: 2132
    page_number: 28
    section_label: null
    body_hash: 80c098d06593529d6d6335e3b8a4fe8e8db356a8c5d82eb34a2001d27d642973
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000028.md
    text: "ignment for the benefit of its \ncreditors; or \n(3) \nthe commencement
      of a proceeding to revoke or suspend its \nlicense in a state or country in
      which the licensee engages in business or is licensed. \n(b) \nA licensee shall
      file a report with the [Commissioner] within three business \nday after the
      licensee has reason to know of the occurrence of any of the following events:
      \n(1) \na [charge or] conviction of the licensee or of a key individual \nor
      person in control of the licensee for a felony; or \n(2) \na [charge or] conviction
      of an authorized delegate for a \nfelony. \nSection 7.05 Bank Secrecy Act Reports.
      \nA licensee and an authorized delegate shall file all reports required by federal
      currency \nreporting, record keeping, and suspicious activity reporting requirements
      as set forth in the Bank \nSecrecy Act and other federal and state laws pertaining
      to money laundering. The timely filing of \na complete and accurate report required
      under this [Section 7.05] with the appropriate federal \nagency is deemed compliant
      with the requirements of this [Section 7.05]. \nSection 7.06 Records. \n(a)
      \nLicensee shall maintain the following records, for determining its \ncompliance
      with this [Act] for at least [three] years: \n(1) \na record of each outstanding
      money transmission obligation \nsold; \n(2) \na general ledger posted at least
      monthly containing all asset, \nliability, capital, income, and expense accounts;
      \n(3) \nbank statements and bank reconciliation records; \n(4) \nrecords of
      outstanding money transmission obligations;\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000028.md
  source_hash: 80c098d06593529d6d6335e3b8a4fe8e8db356a8c5d82eb34a2001d27d642973
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 28, characters
    600–2132'
  unit_id: p000028
  locator: Page 28, characters 600–2132
  available_excerpt: "ignment for the benefit of its \ncreditors; or \n(3) \nthe commencement
    of a proceeding to revoke or suspend its \nlicense in a state or country in which
    the licensee engages in business or is licensed. \n(b) \nA licensee shall file
    a report with the [Commissioner] within three business \nday after the licensee
    has reason to know of the occurrence of any of the following events: \n(1) \na
    [charge or] conviction of the licensee or of a key individual \nor person in control
    of the licensee for a felony; or \n(2) \na [charge or] conviction of an authorized
    delegate for a \nfelony. \nSection 7.05 Bank Secrecy Act Reports. \nA licensee
    and an authorized delegate shall file all reports required by federal currency
    \nreporting, record keeping, and suspicious activity reporting requirements as
    set forth in the Bank \nSecrecy Act and other federal and state laws pertaining
    to money laundering. The timely filing of \na complete and accurate report required
    under this [Section 7.05] with the appropriate federal \nagency is deemed compliant
    with the requirements of this [Section 7.05]. \nSection 7.06 Records. \n(a) \nLicensee
    shall maintain the following records, for determining its \ncompliance with this
    [Act] for at least [three] years: \n(1) \na record of each outstanding money transmission
    obligation \nsold; \n(2) \na general ledger posted at least monthly containing
    all asset, \nliability, capital, income, and expense accounts; \n(3) \nbank statements
    and bank reconciliation records; \n(4) \nrecords of outstanding money transmission
    obligations;\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000004
    start: 0
    end: 2200
    page_number: 4
    section_label: null
    body_hash: 2245b178c49fc1f157bf15c133c59f8fcfe9abdf43f0bf94df397229a7889584
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000004.md
    text: "4 \n \nJune 30, September 30, and December 31. \n(d) \n\"Bank Secrecy Act\"
      means the Bank Secrecy Act, 31 U.S.C. Section 5311, \net seq. and its implementing
      regulations, as amended and recodified from time to time. \n(e) \n\"Closed loop
      stored value\" means stored value that is redeemable by the \nissuer only for
      goods or services provided by the issuer or its affiliate or franchisees of
      the issuer \nor its affiliate, except to the extent required by applicable law
      to be redeemable in cash for its cash \nvalue; \n(f) \n\"Control\" means \n(1)
      \n(A) the power to vote, directly or indirectly, at least 25 percent of \nthe
      outstanding voting shares or voting interests of a licensee or person in control
      of a \nlicensee; \n(B) \nthe power to elect or appoint a majority of key individuals
      or \nexecutive officers, managers, directors, trustees, or other persons exercising
      \nmanagerial authority of a person in control of a licensee; or \n(C) \nthe
      power to exercise, directly or indirectly, a controlling \ninfluence over the
      management or policies of a licensee or person in control of a \nlicensee. \n(2)
      \nRebuttable Presumption of Control. \n(A) \nA person is presumed to exercise
      a controlling influence \nwhen the person holds the power to vote, directly
      or indirectly, at least 10 percent \nof the outstanding voting shares or voting
      interests of a licensee or person in control \nof a licensee.2 \n(B) \nA person
      presumed to exercise a controlling influence as \ndefined by this [Section 2.01(f)]
      can rebut the presumption of control if the person \nis a passive investor.
      \n(3) \nFor purposes of determining the percentage of a person controlled \nby
      any other person, the person's interest shall be aggregated with the interest
      of any other \nimmediate family member, including the person's spouse, parents,
      children, siblings, \nmothers- and fathers-in law, sons- and daughters-in-law,
      brothers- and sisters-in-law, and \nany other person who shares such person's
      home. \n(g) \n\"Eligible rating\" shall mean a credit rating of any of the three
      highest rating \ncategories provided by an eligible rating service, whereby
      each category may include rating \n \n2 Commentary: The obligation to rebut
      control rests exclusively with the pers"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000004.md
  source_hash: 2245b178c49fc1f157bf15c133c59f8fcfe9abdf43f0bf94df397229a7889584
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 4, characters
    0–2200'
  unit_id: p000004
  locator: Page 4, characters 0–2200
  available_excerpt: "4 \n \nJune 30, September 30, and December 31. \n(d) \n\"Bank
    Secrecy Act\" means the Bank Secrecy Act, 31 U.S.C. Section 5311, \net seq. and
    its implementing regulations, as amended and recodified from time to time. \n(e)
    \n\"Closed loop stored value\" means stored value that is redeemable by the \nissuer
    only for goods or services provided by the issuer or its affiliate or franchisees
    of the issuer \nor its affiliate, except to the extent required by applicable
    law to be redeemable in cash for its cash \nvalue; \n(f) \n\"Control\" means \n(1)
    \n(A) the power to vote, directly or indirectly, at least 25 percent of \nthe
    outstanding voting shares or voting interests of a licensee or person in control
    of a \nlicensee; \n(B) \nthe power to elect or appoint a majority of key individuals
    or \nexecutive officers, managers, directors, trustees, or other persons exercising
    \nmanagerial authority of a person in control of a licensee; or \n(C) \nthe power
    to exercise, directly or indirectly, a controlling \ninfluence over the management
    or policies of a licensee or person in control of a \nlicensee. \n(2) \nRebuttable
    Presumption of Control. \n(A) \nA person is presumed to exercise a controlling
    influence \nwhen the person holds the power to vote, directly or indirectly, at
    least 10 percent \nof the outstanding voting shares or voting interests of a licensee
    or person in control \nof a licensee.2 \n(B) \nA person presumed to exercise a
    controlling influence as \ndefined by this [Section 2.01(f)] can rebut the presumption
    of control if the person \nis a passive investor. \n(3) \nFor purposes of determining
    the percentage of a person controlled \nby any other person, the person's interest
    shall be aggregated with the interest of any other \nimmediate family member,
    including the person's spouse, parents, children, siblings, \nmothers- and fathers-in
    law, sons- and daughters-in-law, brothers- and sisters-in-law, and \nany other
    person who shares such person's home. \n(g) \n\"Eligible rating\" shall mean a
    credit rating of any of the three highest rating \ncategories provided by an eligible
    rating service, whereby each category may include rating \n \n2 Commentary: The
    obligation to rebut control rests exclusively with the pers"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000012
    start: 700
    end: 2300
    page_number: 12
    section_label: null
    body_hash: eb065076e15fd657d0f7643c2decce3eaf1414613758d251ef629d3eaa6ad5c4
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000012.md
    text: "to administer \nand enforce this [Act], regulations implementing this [Act],
      and other applicable law, including \nthe Bank Secrecy Act and the USA PATRIOT
      ACT.  The [Commissioner] may: \n(1) \nconduct an examination either on-site
      or off-site as the \n[Commissioner] may reasonably require; \n(2) \nconduct
      an examination in conjunction with an examination \nconducted by representatives
      of other state agencies or agencies of another state or of the \nfederal government;
      \n(3) \n  accept the examination report of another state agency or an agency
      \nof another state or of the federal government, or a report prepared by an
      independent \naccounting firm, which on being accepted is considered for all
      purposes as an official report \nof the [Commissioner]; and \n(4) \nsummon and
      examine under oath a key individual or employee of a \nlicensee or authorized
      delegate and require the person to produce records regarding any \nmatter related
      to the condition and business of the licensee or authorized delegate. \n(b)
      \nA licensee or authorized delegate shall provide, and the [Commissioner] \nshall
      have full and complete access to, all records the [Commissioner] may reasonably
      require to \nconduct a complete examination. The records must be provided at
      the location and in the format \nspecified by the [Commissioner], provided,
      the [Commissioner] may utilize multistate record \nproduction standards and
      examination procedures when such standards will reasonably achieve \nthe requirements
      of this [Section 4.03(b)].8 \n(c) \nUnless otherwise directed by the [Commissioner],
      a licensee shall pay all \ncosts reasonably inc"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000012.md
  source_hash: eb065076e15fd657d0f7643c2decce3eaf1414613758d251ef629d3eaa6ad5c4
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 12, characters
    700–2300'
  unit_id: p000012
  locator: Page 12, characters 700–2300
  available_excerpt: "to administer \nand enforce this [Act], regulations implementing
    this [Act], and other applicable law, including \nthe Bank Secrecy Act and the
    USA PATRIOT ACT.  The [Commissioner] may: \n(1) \nconduct an examination either
    on-site or off-site as the \n[Commissioner] may reasonably require; \n(2) \nconduct
    an examination in conjunction with an examination \nconducted by representatives
    of other state agencies or agencies of another state or of the \nfederal government;
    \n(3) \n  accept the examination report of another state agency or an agency \nof
    another state or of the federal government, or a report prepared by an independent
    \naccounting firm, which on being accepted is considered for all purposes as an
    official report \nof the [Commissioner]; and \n(4) \nsummon and examine under
    oath a key individual or employee of a \nlicensee or authorized delegate and require
    the person to produce records regarding any \nmatter related to the condition
    and business of the licensee or authorized delegate. \n(b) \nA licensee or authorized
    delegate shall provide, and the [Commissioner] \nshall have full and complete
    access to, all records the [Commissioner] may reasonably require to \nconduct
    a complete examination. The records must be provided at the location and in the
    format \nspecified by the [Commissioner], provided, the [Commissioner] may utilize
    multistate record \nproduction standards and examination procedures when such
    standards will reasonably achieve \nthe requirements of this [Section 4.03(b)].8
    \n(c) \nUnless otherwise directed by the [Commissioner], a licensee shall pay
    all \ncosts reasonably inc"
- source_id: SRC-LOCAL-98171c064736338012ae
  source_hash: e18e87283b938ab6fd18d4544e33fd12dd0bfd9a7327f8ed19477519492e6830
  source_version: e18e87283b938ab6fd18d4544e33fd12dd0bfd9a7327f8ed19477519492e6830
  path: 03_Matters/harbor-2-d89ad8/research/sources/SRC-LOCAL-98171c064736338012ae.md
  original_path: 03_Matters/harbor-2-d89ad8/research/dossier-requests/DOR-20260912-1bfef3.md
  title: DOR-20260912-1bfef3.md
  support_state: supplied
  source_type: workspace
  available_excerpt: '## Suggested dossier plan


    Review the suggested priorities below.




    > Preparation analysis did not complete (TimeoutError). The suggested priorities
    fall back to the existing issue order.

    '
  selected_passages:
  - start: 0
    end: 189
    text: '## Suggested dossier plan


      Review the suggested priorities below.




      > Preparation analysis did not complete (TimeoutError). The suggested priorities
      fall back to the existing issue order.

      '
  content_truncated: false
  source_label: DOR-20260912-1bfef3.md
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000027
    start: 0
    end: 1943
    page_number: 27
    section_label: null
    body_hash: 512d4a7a3e1afc61a66c79b53548e6795e9f434d557b21d346fd4662aaafc705
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000027.md
    text: "27 \n \n(c) \nThe audited financial statements shall include or be accompanied
      by a \ncertificate of opinion of the independent certified public accountant
      or independent public \naccountant that is satisfactory in form and content
      to the [Commissioner]. If the certificate or \nopinion is qualified, the [Commissioner]
      may order the licensee to take any action as the \n[Commissioner] may find necessary
      to enable the independent or certified public accountant or \nindependent public
      accountant to remove the qualification. \nSection 7.03 Authorized Delegate Reporting.
      \n(a) \nEach licensee shall submit a report of authorized delegates within 45
      days \nof the end of the calendar quarter.20 The [Commissioner] is authorized
      and encouraged to utilize \nNMLS for the submission of the report required by
      this [Section 7.03(a)] provided that such \nfunctionality is consistent with
      the requirements of this [Section 7.03]. \n(b) \nThe authorized delegate report
      shall include, at a minimum, each authorized \ndelegate's: \n(1) \nCompany legal
      name; \n(2) \nTaxpayer employer identification number; \n(3) \nPrincipal provider
      identifier; \n(4) \nPhysical address; \n(5) \nMailing address; \n(6) \nAny business
      conducted in other states; \n(7) \nAny fictitious or trade name; \n(8) \nContact
      person name, phone number, and email \n(9) \nStart date as licensee’s authorized
      delegate; \n(10) \nEnd date acting as licensee’s authorized delegate, if applicable;
      \ \n(11) \n[Court orders pursuant to [Section 8.03];] and \n(12) \nAny other
      information the [Commissioner] reasonably requires with \nrespect to the authorized
      delegate. \nSection 7.04 Reports of Certain Events.21 \n \n20 Commentary: This
      language is designed to implement state use of the NMLS Uniform Authorized Agent
      Reporting \n(UAAR) process. \n21 Commentary: States are encouraged to utilize
      NMLS to satisfy Section 7.04 reporting requirements if NMLS \ndevelops new functionality
      to prioritize reporting of significant events.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000027.md
  source_hash: 512d4a7a3e1afc61a66c79b53548e6795e9f434d557b21d346fd4662aaafc705
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 27, characters
    0–1943'
  unit_id: p000027
  locator: Page 27, characters 0–1943
  available_excerpt: "27 \n \n(c) \nThe audited financial statements shall include
    or be accompanied by a \ncertificate of opinion of the independent certified public
    accountant or independent public \naccountant that is satisfactory in form and
    content to the [Commissioner]. If the certificate or \nopinion is qualified, the
    [Commissioner] may order the licensee to take any action as the \n[Commissioner]
    may find necessary to enable the independent or certified public accountant or
    \nindependent public accountant to remove the qualification. \nSection 7.03 Authorized
    Delegate Reporting. \n(a) \nEach licensee shall submit a report of authorized
    delegates within 45 days \nof the end of the calendar quarter.20 The [Commissioner]
    is authorized and encouraged to utilize \nNMLS for the submission of the report
    required by this [Section 7.03(a)] provided that such \nfunctionality is consistent
    with the requirements of this [Section 7.03]. \n(b) \nThe authorized delegate
    report shall include, at a minimum, each authorized \ndelegate's: \n(1) \nCompany
    legal name; \n(2) \nTaxpayer employer identification number; \n(3) \nPrincipal
    provider identifier; \n(4) \nPhysical address; \n(5) \nMailing address; \n(6)
    \nAny business conducted in other states; \n(7) \nAny fictitious or trade name;
    \n(8) \nContact person name, phone number, and email \n(9) \nStart date as licensee’s
    authorized delegate; \n(10) \nEnd date acting as licensee’s authorized delegate,
    if applicable;  \n(11) \n[Court orders pursuant to [Section 8.03];] and \n(12)
    \nAny other information the [Commissioner] reasonably requires with \nrespect
    to the authorized delegate. \nSection 7.04 Reports of Certain Events.21 \n \n20
    Commentary: This language is designed to implement state use of the NMLS Uniform
    Authorized Agent Reporting \n(UAAR) process. \n21 Commentary: States are encouraged
    to utilize NMLS to satisfy Section 7.04 reporting requirements if NMLS \ndevelops
    new functionality to prioritize reporting of significant events.\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000028
    start: 0
    end: 2132
    page_number: 28
    section_label: null
    body_hash: 80c098d06593529d6d6335e3b8a4fe8e8db356a8c5d82eb34a2001d27d642973
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000028.md
    text: "28 \n \n(a) \nA licensee shall file a report with the [Commissioner] within
      one business \nday after the licensee has reason to know of the occurrence of
      any of the following events: \n(1) \nthe filing of a petition by or against
      the licensee under the \nUnited States Bankruptcy Code, 11 U.S.C. Section 101-110,
      as amended or recodified from \ntime to time, for bankruptcy or reorganization;
      \n(2) \nthe filing of a petition by or against the licensee for \nreceivership,
      the commencement of any other judicial or administrative proceeding for its
      \ndissolution or reorganization, or the making of a general assignment for the
      benefit of its \ncreditors; or \n(3) \nthe commencement of a proceeding to revoke
      or suspend its \nlicense in a state or country in which the licensee engages
      in business or is licensed. \n(b) \nA licensee shall file a report with the
      [Commissioner] within three business \nday after the licensee has reason to
      know of the occurrence of any of the following events: \n(1) \na [charge or]
      conviction of the licensee or of a key individual \nor person in control of
      the licensee for a felony; or \n(2) \na [charge or] conviction of an authorized
      delegate for a \nfelony. \nSection 7.05 Bank Secrecy Act Reports. \nA licensee
      and an authorized delegate shall file all reports required by federal currency
      \nreporting, record keeping, and suspicious activity reporting requirements
      as set forth in the Bank \nSecrecy Act and other federal and state laws pertaining
      to money laundering. The timely filing of \na complete and accurate report required
      under this [Section 7.05] with the appropriate federal \nagency is deemed compliant
      with the requirements of this [Section 7.05]. \nSection 7.06 Records. \n(a)
      \nLicensee shall maintain the following records, for determining its \ncompliance
      with this [Act] for at least [three] years: \n(1) \na record of each outstanding
      money transmission obligation \nsold; \n(2) \na general ledger posted at least
      monthly containing all asset, \nliability, capital, income, and expense accounts;
      \n(3) \nbank statements and bank reconciliation records; \n(4) \nrecords of
      outstanding money transmission obligations;\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000028.md
  source_hash: 80c098d06593529d6d6335e3b8a4fe8e8db356a8c5d82eb34a2001d27d642973
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 28, characters
    0–2132'
  unit_id: p000028
  locator: Page 28, characters 0–2132
  available_excerpt: "28 \n \n(a) \nA licensee shall file a report with the [Commissioner]
    within one business \nday after the licensee has reason to know of the occurrence
    of any of the following events: \n(1) \nthe filing of a petition by or against
    the licensee under the \nUnited States Bankruptcy Code, 11 U.S.C. Section 101-110,
    as amended or recodified from \ntime to time, for bankruptcy or reorganization;
    \n(2) \nthe filing of a petition by or against the licensee for \nreceivership,
    the commencement of any other judicial or administrative proceeding for its \ndissolution
    or reorganization, or the making of a general assignment for the benefit of its
    \ncreditors; or \n(3) \nthe commencement of a proceeding to revoke or suspend
    its \nlicense in a state or country in which the licensee engages in business
    or is licensed. \n(b) \nA licensee shall file a report with the [Commissioner]
    within three business \nday after the licensee has reason to know of the occurrence
    of any of the following events: \n(1) \na [charge or] conviction of the licensee
    or of a key individual \nor person in control of the licensee for a felony; or
    \n(2) \na [charge or] conviction of an authorized delegate for a \nfelony. \nSection
    7.05 Bank Secrecy Act Reports. \nA licensee and an authorized delegate shall file
    all reports required by federal currency \nreporting, record keeping, and suspicious
    activity reporting requirements as set forth in the Bank \nSecrecy Act and other
    federal and state laws pertaining to money laundering. The timely filing of \na
    complete and accurate report required under this [Section 7.05] with the appropriate
    federal \nagency is deemed compliant with the requirements of this [Section 7.05].
    \nSection 7.06 Records. \n(a) \nLicensee shall maintain the following records,
    for determining its \ncompliance with this [Act] for at least [three] years: \n(1)
    \na record of each outstanding money transmission obligation \nsold; \n(2) \na
    general ledger posted at least monthly containing all asset, \nliability, capital,
    income, and expense accounts; \n(3) \nbank statements and bank reconciliation
    records; \n(4) \nrecords of outstanding money transmission obligations;\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000029
    start: 0
    end: 1920
    page_number: 29
    section_label: null
    body_hash: 5b35638f1a8d6575d9fb47895535602e82ed0f84fca696af8c017016862d94c9
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000029.md
    text: "29 \n \n(5) \nrecords of each outstanding money transmission obligation
      \npaid within the [three]-year period; \n(6) \na list of the last known names
      and addresses of all of the \nlicensee's authorized delegates; and \n(7) \nany
      other records the [Commissioner] reasonably requires \nby rule. \n(b) \nThe
      items specified in [Section 7.06(a)] may be maintained in any form of \nrecord.
      \n(c) \nRecords specified in [Section 7.06(a)] may be maintained outside this
      state \nif they are made accessible to the [Commissioner] on [seven] business-days'
      notice that is sent in \na record. \n(d) \nAll records maintained by the licensee
      as required in [Section 7.06(a)–(c)] \nare open to inspection by the [Commissioner]
      pursuant to [Section 4.03(a)]. \n \nARTICLE VIII \nAuthorized Delegates \nSection
      8.01 Relationship Between Licensee and Authorized Delegate. \n(a) \nIn this
      [Section 8.01], \"remit\" means to make direct payments of money to \na licensee
      or its representative authorized to receive money or to deposit money in a bank
      in an \naccount specified by the licensee. \n(b) \nBefore a licensee is authorized
      to conduct business through an authorized \ndelegate or allows a person to act
      as the licensee's authorized delegate, the licensee must: \n(1) \nadopt, and
      update as necessary, written policies and procedures \nreasonably designed to
      ensure that the licensee's authorized delegates comply with \napplicable state
      and federal law; \n(2) \nenter into a written contract that complies with [Section
      8.01(d)]; \nand \n(3) \nconduct a reasonable risk-based background investigation
      sufficient \nfor the licensee to determine whether the authorized delegate has
      complied and will likely \ncomply with applicable state and federal law. \n(c)
      \nAn authorized delegate must operate in full compliance with this [Act]. \n(d)
      \nThe written contract required by [Section 8.01(b)] must be signed by the \nlicensee
      and the authorized delegate and, at a minimum, must:\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000029.md
  source_hash: 5b35638f1a8d6575d9fb47895535602e82ed0f84fca696af8c017016862d94c9
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 29, characters
    0–1920'
  unit_id: p000029
  locator: Page 29, characters 0–1920
  available_excerpt: "29 \n \n(5) \nrecords of each outstanding money transmission
    obligation \npaid within the [three]-year period; \n(6) \na list of the last known
    names and addresses of all of the \nlicensee's authorized delegates; and \n(7)
    \nany other records the [Commissioner] reasonably requires \nby rule. \n(b) \nThe
    items specified in [Section 7.06(a)] may be maintained in any form of \nrecord.
    \n(c) \nRecords specified in [Section 7.06(a)] may be maintained outside this
    state \nif they are made accessible to the [Commissioner] on [seven] business-days'
    notice that is sent in \na record. \n(d) \nAll records maintained by the licensee
    as required in [Section 7.06(a)–(c)] \nare open to inspection by the [Commissioner]
    pursuant to [Section 4.03(a)]. \n \nARTICLE VIII \nAuthorized Delegates \nSection
    8.01 Relationship Between Licensee and Authorized Delegate. \n(a) \nIn this [Section
    8.01], \"remit\" means to make direct payments of money to \na licensee or its
    representative authorized to receive money or to deposit money in a bank in an
    \naccount specified by the licensee. \n(b) \nBefore a licensee is authorized to
    conduct business through an authorized \ndelegate or allows a person to act as
    the licensee's authorized delegate, the licensee must: \n(1) \nadopt, and update
    as necessary, written policies and procedures \nreasonably designed to ensure
    that the licensee's authorized delegates comply with \napplicable state and federal
    law; \n(2) \nenter into a written contract that complies with [Section 8.01(d)];
    \nand \n(3) \nconduct a reasonable risk-based background investigation sufficient
    \nfor the licensee to determine whether the authorized delegate has complied and
    will likely \ncomply with applicable state and federal law. \n(c) \nAn authorized
    delegate must operate in full compliance with this [Act]. \n(d) \nThe written
    contract required by [Section 8.01(b)] must be signed by the \nlicensee and the
    authorized delegate and, at a minimum, must:\n"
- source_id: SRC-37ee676da5b354ba8538
  source_version: dd8e38dc121ab8ed7fe079b02c7e158a
  title: '[PDF] CSBS Money Transmission Modernization Act'
  extraction_state: complete
  selected_passages:
  - unit_id: p000012
    start: 0
    end: 2795
    page_number: 12
    section_label: null
    body_hash: eb065076e15fd657d0f7643c2decce3eaf1414613758d251ef629d3eaa6ad5c4
    path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000012.md
    text: "12 \n \n(4) \nThe terms of or a copy of any bond filed by a licensee, provided
      that \nconfidential information, including, but not limited to, prices and fees
      for such bond is \nredacted; \n(5) \nCopies of any non-confidential final orders
      of the [Department] \nrelating to any violation of this [Act] or regulations
      implementing this [Act]; and \n(e) \nImposition of an administrative fine or
      penalty under this [Act]. \nSection 4.03 Supervision. \n(a) \nThe [Commissioner]
      may conduct an examination or investigation of a \nlicensee or authorized delegate
      or otherwise take independent action authorized by this [Act] or by \na rule
      adopted or order issued under this [Act] as reasonably necessary or appropriate
      to administer \nand enforce this [Act], regulations implementing this [Act],
      and other applicable law, including \nthe Bank Secrecy Act and the USA PATRIOT
      ACT.  The [Commissioner] may: \n(1) \nconduct an examination either on-site
      or off-site as the \n[Commissioner] may reasonably require; \n(2) \nconduct
      an examination in conjunction with an examination \nconducted by representatives
      of other state agencies or agencies of another state or of the \nfederal government;
      \n(3) \n  accept the examination report of another state agency or an agency
      \nof another state or of the federal government, or a report prepared by an
      independent \naccounting firm, which on being accepted is considered for all
      purposes as an official report \nof the [Commissioner]; and \n(4) \nsummon and
      examine under oath a key individual or employee of a \nlicensee or authorized
      delegate and require the person to produce records regarding any \nmatter related
      to the condition and business of the licensee or authorized delegate. \n(b)
      \nA licensee or authorized delegate shall provide, and the [Commissioner] \nshall
      have full and complete access to, all records the [Commissioner] may reasonably
      require to \nconduct a complete examination. The records must be provided at
      the location and in the format \nspecified by the [Commissioner], provided,
      the [Commissioner] may utilize multistate record \nproduction standards and
      examination procedures when such standards will reasonably achieve \nthe requirements
      of this [Section 4.03(b)].8 \n(c) \nUnless otherwise directed by the [Commissioner],
      a licensee shall pay all \ncosts reasonably incurred in connection with an examination
      of the licensee or the licensee's \n \n8 Commentary: The [Commissioner] is encouraged
      to instruct examiners to: (1) include all examination requests in \nthe Day
      1 letter that may require the licensee to obtain records located outside of
      the U.S., including but not limited \nto evidence demonstrating when an outstanding
      money transmission obligation has been extinguished; and (2) accept \nelectronic
      bank statements as provided to the licensee by the bank.\n"
  support_state: retrieved
  url: https://www.csbs.org/sites/default/files/2023-02/CSBS%20Money%20Transmission%20Modernization%20Act.pdf
  original_path: 03_Matters/harbor-2-d89ad8/research/sources/RUN-20260911-d08e84-37ee676da5b354ba8538-fetch.md.bin
  path: 03_Matters/harbor-2-d89ad8/research/source-library/SRC-37ee676da5b354ba8538/dd8e38dc121ab8ed7fe079b02c7e158a/pages/p000012.md
  source_hash: eb065076e15fd657d0f7643c2decce3eaf1414613758d251ef629d3eaa6ad5c4
  source_label: '[PDF] CSBS Money Transmission Modernization Act — Page 12, characters
    0–2795'
  unit_id: p000012
  locator: Page 12, characters 0–2795
  available_excerpt: "12 \n \n(4) \nThe terms of or a copy of any bond filed by a
    licensee, provided that \nconfidential information, including, but not limited
    to, prices and fees for such bond is \nredacted; \n(5) \nCopies of any non-confidential
    final orders of the [Department] \nrelating to any violation of this [Act] or
    regulations implementing this [Act]; and \n(e) \nImposition of an administrative
    fine or penalty under this [Act]. \nSection 4.03 Supervision. \n(a) \nThe [Commissioner]
    may conduct an examination or investigation of a \nlicensee or authorized delegate
    or otherwise take independent action authorized by this [Act] or by \na rule adopted
    or order issued under this [Act] as reasonably necessary or appropriate to administer
    \nand enforce this [Act], regulations implementing this [Act], and other applicable
    law, including \nthe Bank Secrecy Act and the USA PATRIOT ACT.  The [Commissioner]
    may: \n(1) \nconduct an examination either on-site or off-site as the \n[Commissioner]
    may reasonably require; \n(2) \nconduct an examination in conjunction with an
    examination \nconducted by representatives of other state agencies or agencies
    of another state or of the \nfederal government; \n(3) \n  accept the examination
    report of another state agency or an agency \nof another state or of the federal
    government, or a report prepared by an independent \naccounting firm, which on
    being accepted is considered for all purposes as an official report \nof the [Commissioner];
    and \n(4) \nsummon and examine under oath a key individual or employee of a \nlicensee
    or authorized delegate and require the person to produce records regarding any
    \nmatter related to the condition and business of the licensee or authorized delegate.
    \n(b) \nA licensee or authorized delegate shall provide, and the [Commissioner]
    \nshall have full and complete access to, all records the [Commissioner] may reasonably
    require to \nconduct a complete examination. The records must be provided at the
    location and in the format \nspecified by the [Commissioner], provided, the [Commissioner]
    may utilize multistate record \nproduction standards and examination procedures
    when such standards will reasonably achieve \nthe requirements of this [Section
    4.03(b)].8 \n(c) \nUnless otherwise directed by the [Commissioner], a licensee
    shall pay all \ncosts reasonably incurred in connection with an examination of
    the licensee or the licensee's \n \n8 Commentary: The [Commissioner] is encouraged
    to instruct examiners to: (1) include all examination requests in \nthe Day 1
    letter that may require the licensee to obtain records located outside of the
    U.S., including but not limited \nto evidence demonstrating when an outstanding
    money transmission obligation has been extinguished; and (2) accept \nelectronic
    bank statements as provided to the licensee by the bank.\n"
- source_id: FACT-20260909-182bcc
  source_label: 'Reported fact: Mosaic Relay is acquiring Harbor Pay; close targeted
    Nov 15 (~10 weeks out).'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10
    weeks out).
  record_revision: 5531b52c863fcef5c5a585f539101b9a680cd335d15f1850621f54d3c4f70b2a
  source_version: 5531b52c863fcef5c5a585f539101b9a680cd335d15f1850621f54d3c4f70b2a
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-182bcc
    text: Mosaic Relay is acquiring Harbor Pay; close targeted Nov 15 (~10 weeks out).
    status: active
    material: true
    source_ids:
    - REQ-20260909-283892
    supersedes: null
    created_at: '2026-09-09T20:53:13+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
      Relay's app on day 1 post-close, with one unified account and balance and full
      access to Mosaic's product set.
    status: active
    material: true
    source_ids:
    - REQ-20260909-283892
    supersedes: null
    created_at: '2026-09-09T20:53:13+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-9a0c61
  source_label: 'Reported fact: Plan is no re-verification; Harbor users were already
    KYC''d by Harbor.'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Plan is no re-verification; Harbor users were already KYC'd by
    Harbor.
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
      results for everyone but not the underlying documents for users onboarded before
      2023.
    status: active
    material: true
    source_ids:
    - REQ-20260909-283892
    supersedes: null
    created_at: '2026-09-09T20:53:13+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-073838
  source_label: 'Reported fact: Harbor''s transaction monitoring is a third-party
    SaaS whose contract terminates …'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Harbor's transaction monitoring is a third-party SaaS whose contract
    terminates at close; plan is to repoint Harbor's transaction feed at Mosaic's
    engine on day 1.
  record_revision: 50abe200c3635fcd5e694ddff2423b099cf4c63b6ff4e2e0ce61648759871bdf
  source_version: 50abe200c3635fcd5e694ddff2423b099cf4c63b6ff4e2e0ce61648759871bdf
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-073838
    text: Harbor's transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint Harbor's transaction feed at Mosaic's engine on
      day 1.
    status: active
    material: true
    source_ids:
    - REQ-20260909-283892
    supersedes: null
    created_at: '2026-09-09T20:53:13+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-f2c49f
  source_label: 'Reported fact: Plan is no re-verification of Harbor''s existing KYC;
    Harbor users were already K…'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Plan is no re-verification of Harbor's existing KYC; Harbor users
    were already KYC'd.
  record_revision: 25b1df9df9a27c42720ccb74b468e1b95f8e54560986befeb84b6b1fd514ed1a
  source_version: 25b1df9df9a27c42720ccb74b468e1b95f8e54560986befeb84b6b1fd514ed1a
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-f2c49f
    text: Plan is no re-verification of Harbor's existing KYC; Harbor users were already
      KYC'd.
    status: active
    material: true
    source_ids:
    - MSG-20260909-9835ba
    supersedes: null
    created_at: '2026-09-09T20:53:14+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-44937b
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-78d5cd
  source_label: 'Reported fact: Harbor''s transaction monitoring is a third-party
    SaaS whose contract terminates …'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Harbor's transaction monitoring is a third-party SaaS whose contract
    terminates at close; plan is to repoint the transaction feed to Mosaic Relay's
    engine on day 1.
  record_revision: 64a9b4af04a6882c905f589023e0d8b79c6a185d883797356330e09057a4cb1a
  source_version: 64a9b4af04a6882c905f589023e0d8b79c6a185d883797356330e09057a4cb1a
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-78d5cd
    text: Harbor's transaction monitoring is a third-party SaaS whose contract terminates
      at close; plan is to repoint the transaction feed to Mosaic Relay's engine on
      day 1.
    status: active
    material: true
    source_ids:
    - MSG-20260909-9835ba
    supersedes: null
    created_at: '2026-09-09T20:53:14+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-44937b
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-ed9f06
  source_label: 'Reported fact: How is the Harbor Pay acquisition structured? — Asset
    purchase (Mosaic buys Harb…'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: How is the Harbor Pay acquisition structured? — Asset purchase
    (Mosaic buys Harbor's assets)
  record_revision: 00063124406940859918a0839256c9e522039bf6ac718fbf456955357775a3ca
  source_version: 00063124406940859918a0839256c9e522039bf6ac718fbf456955357775a3ca
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-ed9f06
    text: How is the Harbor Pay acquisition structured? — Asset purchase (Mosaic buys
      Harbor's assets)
    status: active
    material: true
    source_ids:
    - MSG-20260909-2e549e
    supersedes: null
    created_at: '2026-09-09T20:56:00+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-9497db
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-f0fb01
  source_label: 'Reported fact: For the four new markets opened by the combined footprint,
    does Mosaic Relay pla…'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: For the four new markets opened by the combined footprint, does
    Mosaic Relay plan to operate under Harbor's existing licenses or apply for its
    own? — Use/assume Harbor's licenses
  record_revision: 3b68c9ae09e5d32fc1b1fcb207299c5ab5ca81200f5207bf49fca663a3668884
  source_version: 3b68c9ae09e5d32fc1b1fcb207299c5ab5ca81200f5207bf49fca663a3668884
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-f0fb01
    text: For the four new markets opened by the combined footprint, does Mosaic Relay
      plan to operate under Harbor's existing licenses or apply for its own? — Use/assume
      Harbor's licenses
    status: active
    material: true
    source_ids:
    - MSG-20260909-2e549e
    supersedes: null
    created_at: '2026-09-09T20:56:00+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-9497db
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-620c62
  source_label: 'Reported fact: For the pre-2023 Harbor users with no underlying KYC
    documents, what is the plan…'
  source_class: reported_fact
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: For the pre-2023 Harbor users with no underlying KYC documents,
    what is the plan to satisfy Mosaic Relay's own BSA/AML customer identification
    and recordkeeping obligations? — It is not yet known whether Mosaic Relay's AML/CIP
    program permits reliance on Harbor's prior KYC; compliance must confirm.
  record_revision: c9ac129b072db5f530e4aae5417e40ba473083e4ec6807f7395e2666a3ed0e66
  source_version: c9ac129b072db5f530e4aae5417e40ba473083e4ec6807f7395e2666a3ed0e66
  support_state: supplied
  captured_record:
    fact_id: FACT-20260909-620c62
    text: For the pre-2023 Harbor users with no underlying KYC documents, what is
      the plan to satisfy Mosaic Relay's own BSA/AML customer identification and recordkeeping
      obligations? — It is not yet known whether Mosaic Relay's AML/CIP program permits
      reliance on Harbor's prior KYC; compliance must confirm.
    status: active
    material: true
    source_ids:
    - MSG-20260909-2e549e
    supersedes: null
    created_at: '2026-09-09T20:57:52+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-7091da
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-070aec
  source_label: 'Reported fact: Have the ~40 open alerts and the handful of SARs from
    the last year been reviewe…'
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
      reviewed, and what did they reveal? — The open alerts and SAR history have not
      been reviewed and remain in diligence.
    status: active
    material: true
    source_ids:
    - MSG-20260909-2e549e
    supersedes: null
    created_at: '2026-09-09T20:57:52+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-9196a6
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FACT-20260909-771ee1
  source_label: 'Reported fact: For the four new markets opened by the combined license
    footprint, what is the p…'
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
      those customers? — Mosaic Relay currently plans to use or assume Harbor's licenses
      for the four new markets.
    status: active
    material: true
    source_ids:
    - MSG-20260909-2e549e
    supersedes: null
    created_at: '2026-09-09T20:57:53+00:00'
    withdrawn_at: null
    action_id: ACT-20260909-a14129
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    text: Mosaic Relay's existing money transmission licenses and Harbor's MTLs are
      transferable or can be maintained through the acquisition without new state
      approval
    reason: Needed to continue
    material: true
    status: open
    created_at: '2026-09-09T20:53:13+00:00'
    resolved_at: null
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ASM-20260909-3c5756
  source_label: 'Assumption: The KYC pass/fail results are sufficient to satisfy Mosaic
    Relay''s own BSA/AML p…'
  source_class: generated_assumption
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: The KYC pass/fail results are sufficient to satisfy Mosaic Relay's
    own BSA/AML program obligations without the underlying documents
  record_revision: d8704a497bc488c00308423c8c4c84de72f254baf6bc4438b9a0277fdce05570
  source_version: d8704a497bc488c00308423c8c4c84de72f254baf6bc4438b9a0277fdce05570
  support_state: supplied
  captured_record:
    assumption_id: ASM-20260909-3c5756
    text: The KYC pass/fail results are sufficient to satisfy Mosaic Relay's own BSA/AML
      program obligations without the underlying documents
    reason: Needed to continue
    material: true
    status: open
    created_at: '2026-09-09T20:53:13+00:00'
    resolved_at: null
    withdrawn_at: null
    action_id: ACT-20260909-944bfb
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ASM-20260909-1a519f
  source_label: 'Assumption: The transaction monitoring repoint can be completed and
    validated before close w…'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ASM-20260909-ca7dfd
  source_label: 'Assumption: Harbor Pay is a licensed money transmitter subject to
    state MTL regimes and fede…'
  source_class: generated_assumption
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Harbor Pay is a licensed money transmitter subject to state MTL
    regimes and federal BSA/AML obligations (not yet confirmed).
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ASM-20260909-d40239
  source_label: 'Assumption: Mosaic Relay is itself a licensed money transmitter in
    41 states (per the reques…'
  source_class: generated_assumption
  path: 03_Matters/harbor-2-d89ad8/facts.md
  available_excerpt: Mosaic Relay is itself a licensed money transmitter in 41 states
    (per the request).
  record_revision: 0dceb99776c468b02213259c2c0eedb7849ce51e3431061c3ba30542e8c4c939
  source_version: 0dceb99776c468b02213259c2c0eedb7849ce51e3431061c3ba30542e8c4c939
  support_state: supplied
  captured_record:
    assumption_id: ASM-20260909-d40239
    text: Mosaic Relay is itself a licensed money transmitter in 41 states (per the
      request).
    reason: Needed to continue
    material: true
    status: open
    created_at: '2026-09-09T20:53:14+00:00'
    resolved_at: null
    withdrawn_at: null
    action_id: ACT-20260909-44937b
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ASM-20260909-57e86b
  source_label: 'Assumption: The acquisition is structured as an asset or stock purchase,
    which affects wheth…'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
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
    title: 'Money transmission licensing: whether Mosaic Relay can operate under the
      combined 44-state footprint and whether Harbor''s MTLs transfer/survive the
      acquisition'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ISS-c9d7c39f63-ca95e529feeb1045
  source_label: 'Issue: BSA/AML and KYC: whether relying on Harbor''s prior KYC (with
    missing underlying …'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ISS-c9d7c39f63-69af3f282d21ef38
  source_label: 'Issue: SAR and alert handling: obligations to review, file, and manage
    Harbor''s ~40 ope…'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ISS-c9d7c39f63-4825f0af7ec75542
  source_label: 'Issue: Monitoring vendor transition: continuity of transaction monitoring
    when the SaaS…'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ISS-c9d7c39f63-72810d0a43d3ce66
  source_label: 'Issue: Marketing compliance: the $50 welcome bonus offer and any
    state money transmissi…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/issues.md
  available_excerpt: 'Marketing compliance: the $50 welcome bonus offer and any state
    money transmission or consumer protection implications'
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
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: ISS-c9d7c39f63-af341445a7af4c06
  source_label: 'Issue: Customer account, contract, and data-transfer rights'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/issues.md
  available_excerpt: Customer account, contract, and data-transfer rights
  record_revision: 1b1e2756a0358a84aa6f2fa795c6020ac0087a6105b2e220a00fb2e30947569a
  source_version: 1b1e2756a0358a84aa6f2fa795c6020ac0087a6105b2e220a00fb2e30947569a
  support_state: supplied
  captured_record:
    claim_output_revisions: {}
    issue_id: ISS-c9d7c39f63-af341445a7af4c06
    parent_issue_id: null
    title: Customer account, contract, and data-transfer rights
    why_it_matters: An asset purchase does not by itself establish that customer accounts,
      contracts, balances, or personal data can move into Mosaic's app on day one.
    fact_ids:
    - FACT-20260909-ed9f06
    - FACT-20260909-551367
    - FACT-20260909-4c1fd8
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
    updated_at: '2026-09-12T22:00:41+00:00'
    generated_origin: dossier_preparation
    generated_request_id: DOR-20260912-6d3df4
    generated_candidate_key: customer_account_data_transfer
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-982278
  source_label: 'Saved message: From: Dana, PM — Growth & Integration

    Subject: Harbor migration — anything here …'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-a8160f.md
  available_excerpt: 'From: Dana, PM — Growth & Integration

    Subject: Harbor migration — anything here need legal?


    We''re acquiring Harbor Pay. Close is targeted Nov 15 (~10 weeks). Migration plan:


    240k consumer users, 12k business accounts move into our app on day 1 post-close.
    One unified account, one balance, full access to our product set.

    No re-verification — they were already KYC''d by Harbor.

    Harbor holds MTLs in 38 states, we hold 41. Combined that''s 44 — nice win, opens
    four new markets.

    Harbor''s KYC ran through a vendor that shut down in 2024. We have pass/fail results
    for everyone, but not the underlying documents for users onboarded before 2023.

    Harbor''s monitoring is a third-party SaaS whose contract terminates at close.
    Plan is to repoint their transaction feed at our engine on day 1.

    Marketing wants a "Welcome" campaign with a $50 bonus on first transfer, launching
    close+1.

    Diligence flagged that Harbor has ~40 open alerts and "a handful" of SARs from
    the last year. Nobody''s read them yet.


    Does any of this need legal before close? It''s really just a data migration.'
  record_revision: e847a82b62c8e0424b39f18d69bdf4564f21aad6b08303affc8f87a05f8782d1
  source_version: e847a82b62c8e0424b39f18d69bdf4564f21aad6b08303affc8f87a05f8782d1
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-982278
    role: user
    content: 'From: Dana, PM — Growth & Integration

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
    created_at: '2026-09-09T20:52:49+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-a8160f
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-a8160f.md
    message_sequence: 0
    submitted_scope: actual
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-2e549e
  source_label: 'Saved message: How is the Harbor Pay acquisition structured?

    Asset purchase (Mosaic buys Harbor…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: 'How is the Harbor Pay acquisition structured?

    Asset purchase (Mosaic buys Harbor''s assets)


    Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
    prior KYC without re-verification, or is re-verification required?

    Not sure / need to check with compliance


    What is known about Harbor''s ~40 open alerts and the SARs from the last year?

    Nothing reviewed yet — still in diligence


    For the four new markets opened by the combined footprint, does Mosaic Relay plan
    to operate under Harbor''s existing licenses or apply for its own?

    Use/assume Harbor''s licenses


    0 questions left open.


    Analyze this matter with these answers. Leave gaps unknown and show the initial
    issue map and assumptions used.'
  record_revision: caa38cc29ac26e8abbecf2f02d403fac0b4114e33e71ce007ce90798161c4af7
  source_version: caa38cc29ac26e8abbecf2f02d403fac0b4114e33e71ce007ce90798161c4af7
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-2e549e
    role: user
    content: 'How is the Harbor Pay acquisition structured?

      Asset purchase (Mosaic buys Harbor''s assets)


      Does Mosaic Relay''s AML/CIP program currently permit relying on another institution''s
      prior KYC without re-verification, or is re-verification required?

      Not sure / need to check with compliance


      What is known about Harbor''s ~40 open alerts and the SARs from the last year?

      Nothing reviewed yet — still in diligence


      For the four new markets opened by the combined footprint, does Mosaic Relay
      plan to operate under Harbor''s existing licenses or apply for its own?

      Use/assume Harbor''s licenses


      0 questions left open.


      Analyze this matter with these answers. Leave gaps unknown and show the initial
      issue map and assumptions used.'
    created_at: '2026-09-09T20:56:00+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 2
    submitted_scope: actual
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-efcbdd
  source_label: 'Saved message: ## Initial issue map


    - **Licensing:** In an asset purchase, Harbor’s licenses m…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: '## Initial issue map


    - **Licensing:** In an asset purchase, Harbor’s licenses may not transfer to Mosaic.
    The four new markets need state-by-state clearance before launch.

    - **BSA/AML:** Mosaic’s policy on prior KYC is unknown. Missing records may require
    re-verification or access limits.

    - **Alerts and monitoring:** Review all open alerts and SAR history before close.
    Test monitoring continuity before migration.

    - **Marketing:** Review the $50 bonus when its terms are available.


    **No external authority retrieved.**


    ## Assumptions used


    - Mosaic will serve migrated users immediately after close.

    - Harbor’s licenses do not automatically transfer.

    - Harbor’s KYC results are not assumed sufficient.

    - The monitoring change can be tested before close.

    - The bonus structure remains unknown.


    Answer saved as a reported fact. The issue remains open.


    Question left open.'
  record_revision: f0dc7645a3978e42ac5e206af8fa0d4f452b9b598f043f308a22fe09431518a7
  source_version: f0dc7645a3978e42ac5e206af8fa0d4f452b9b598f043f308a22fe09431518a7
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-efcbdd
    role: assistant
    content: '## Initial issue map


      - **Licensing:** In an asset purchase, Harbor’s licenses may not transfer to
      Mosaic. The four new markets need state-by-state clearance before launch.

      - **BSA/AML:** Mosaic’s policy on prior KYC is unknown. Missing records may
      require re-verification or access limits.

      - **Alerts and monitoring:** Review all open alerts and SAR history before close.
      Test monitoring continuity before migration.

      - **Marketing:** Review the $50 bonus when its terms are available.


      **No external authority retrieved.**


      ## Assumptions used


      - Mosaic will serve migrated users immediately after close.

      - Harbor’s licenses do not automatically transfer.

      - Harbor’s KYC results are not assumed sufficient.

      - The monitoring change can be tested before close.

      - The bonus structure remains unknown.


      Answer saved as a reported fact. The issue remains open.


      Question left open.'
    created_at: '2026-09-09T20:58:15+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 3
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-539d02
  source_label: 'Saved message: What are the elgal issues associated with each of
    the for issues?'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: What are the elgal issues associated with each of the for issues?
  record_revision: 296564f1fdf5660025d6df78422ccf7a5b21c386473bcd59d43a322fcbf7f3e8
  source_version: 296564f1fdf5660025d6df78422ccf7a5b21c386473bcd59d43a322fcbf7f3e8
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-539d02
    role: user
    content: What are the elgal issues associated with each of the for issues?
    created_at: '2026-09-09T21:06:44+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 4
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-660683
  source_label: 'Saved message: I want you to do the research on them and get back
    to me.  Please give me source…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: I want you to do the research on them and get back to me.  Please
    give me sources
  record_revision: 4a5ad0bc1f370dea8763fb7a2da10f12cd2f68cc05e50b48fac6488705514c0c
  source_version: 4a5ad0bc1f370dea8763fb7a2da10f12cd2f68cc05e50b48fac6488705514c0c
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-660683
    role: user
    content: I want you to do the research on them and get back to me.  Please give
      me sources
    created_at: '2026-09-09T21:09:16+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 6
    submitted_scope: actual
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-168b9d
  source_label: 'Saved message: Research is in progress. The source-backed memo will
    cover:


    - State money-trans…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: 'Research is in progress. The source-backed memo will cover:


    - State money-transmitter licensing

    - KYC and AML requirements

    - Open alerts, SARs, and monitoring continuity

    - The $50 welcome bonus


    I will separate federal rules from state-specific questions. I will also identify
    missing facts and any authority that still needs verification.'
  record_revision: 4099bd88a0bdd80739799a6d4f848d7e7085ecd16c2b99f759c546b2af80dea9
  source_version: 4099bd88a0bdd80739799a6d4f848d7e7085ecd16c2b99f759c546b2af80dea9
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-168b9d
    role: assistant
    content: 'Research is in progress. The source-backed memo will cover:


      - State money-transmitter licensing

      - KYC and AML requirements

      - Open alerts, SARs, and monitoring continuity

      - The $50 welcome bonus


      I will separate federal rules from state-specific questions. I will also identify
      missing facts and any authority that still needs verification.'
    created_at: '2026-09-09T21:11:05+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 7
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-406e0e
  source_label: 'Saved message: Can you do external research the document is only
    based on the model.'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: Can you do external research the document is only based on the
    model.
  record_revision: 731fa3d1d1efecfced00cdb6e8373b9b36a4b89b3ce83f8134f674f351728f4e
  source_version: 731fa3d1d1efecfced00cdb6e8373b9b36a4b89b3ce83f8134f674f351728f4e
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-406e0e
    role: user
    content: Can you do external research the document is only based on the model.
    created_at: '2026-09-09T23:14:11+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 8
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-91b5ec
  source_label: 'Saved message: Yes. The current document contains model-generated
    analysis only. It has no retr…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: 'Yes. The current document contains model-generated analysis
    only. It has no retrieved external authority.


    I cannot start external research because the external-research tool is not available
    in this turn. No research is in progress. Please enable the external-source research
    option and resend this request.'
  record_revision: 2062b357dfc5ed3a58c5b5d378df319e5a856410e376f7e0a1595c868410e818
  source_version: 2062b357dfc5ed3a58c5b5d378df319e5a856410e376f7e0a1595c868410e818
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-91b5ec
    role: assistant
    content: 'Yes. The current document contains model-generated analysis only. It
      has no retrieved external authority.


      I cannot start external research because the external-research tool is not available
      in this turn. No research is in progress. Please enable the external-source
      research option and resend this request.'
    created_at: '2026-09-09T23:14:28+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 9
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260909-b4cc1f
  source_label: 'Saved message: Please confirm the external source choices in the
    research panel. Research start…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: 'Please confirm the external source choices in the research panel.
    Research starts after confirmation. The current model-only document remains unchanged.


    No durable research run was started.'
  record_revision: b4369ecb7c3c7e459e79233d25d39f8003ee6f5e647d27f0502031a9c1b54639
  source_version: b4369ecb7c3c7e459e79233d25d39f8003ee6f5e647d27f0502031a9c1b54639
  support_state: supplied
  captured_record:
    message_id: MSG-20260909-b4cc1f
    role: assistant
    content: 'Please confirm the external source choices in the research panel. Research
      starts after confirmation. The current model-only document remains unchanged.


      No durable research run was started.'
    created_at: '2026-09-09T23:47:23+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 11
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-c27e90
  source_label: 'Saved message: Research is queued or running with its saved source
    choices. The run will show w…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: Research is queued or running with its saved source choices.
    The run will show which sources were retrieved. Repeating this confirmation does
    not start another run.
  record_revision: 945c483c2ad74ee920dd8ad7f4e31d92ea7371c6e06a0b1eee47c7e551295fda
  source_version: 945c483c2ad74ee920dd8ad7f4e31d92ea7371c6e06a0b1eee47c7e551295fda
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-c27e90
    role: assistant
    content: Research is queued or running with its saved source choices. The run
      will show which sources were retrieved. Repeating this confirmation does not
      start another run.
    created_at: '2026-09-10T00:47:49+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 13
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-3ace1b
  source_label: 'Saved message: with everything you know, rewrite the dossier'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: with everything you know, rewrite the dossier
  record_revision: 02ec740cee39e7491566b3afe0a6f66b36520f88d3926be3b58850b9580e8a5e
  source_version: 02ec740cee39e7491566b3afe0a6f66b36520f88d3926be3b58850b9580e8a5e
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-3ace1b
    role: user
    content: with everything you know, rewrite the dossier
    created_at: '2026-09-10T04:33:35+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 14
    submitted_scope: actual
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-f8e728
  source_label: 'Saved message: The complete dossier rewrite was submitted as a tracked
    revision. It keeps the c…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: 'The complete dossier rewrite was submitted as a tracked revision.
    It keeps the current dossier unchanged until you accept the proposed changes.

    The revision adds the options, working recommendation, material unknowns, and
    source limits.'
  record_revision: 0abdfc28cfc953d53c9b8e8b7d6b9a349099d61b9c6399957edf8b40dab225cd
  source_version: 0abdfc28cfc953d53c9b8e8b7d6b9a349099d61b9c6399957edf8b40dab225cd
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-f8e728
    role: assistant
    content: 'The complete dossier rewrite was submitted as a tracked revision. It
      keeps the current dossier unchanged until you accept the proposed changes.

      The revision adds the options, working recommendation, material unknowns, and
      source limits.'
    created_at: '2026-09-10T04:36:36+00:00'
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 15
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-2f255e
  source_label: 'Saved message: **Current approach:** Treat legal and compliance readiness
    as a pre-close gate. …'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: '**Current approach:** Treat legal and compliance readiness as
    a pre-close gate. Do not assume Harbor’s licenses transfer. Consider a narrower
    launch if licensing, KYC records, alert review, or monitoring tests are incomplete.


    **Unresolved questions:** State approval in the four new markets; whether Mosaic’s
    AML/CIP program permits reliance on Harbor’s KYC; what the alerts and SAR history
    show; whether monitoring will work without a gap; and how the $50 bonus will operate.


    **Next step:** Obtain state-by-state licensing advice and review the alerts and
    SAR history. The available sources do not yet support a final state-specific conclusion.'
  record_revision: 74cfc37dae24227d14b64575fcf0531748fe76500de963a5a32fadc52b35a80f
  source_version: 74cfc37dae24227d14b64575fcf0531748fe76500de963a5a32fadc52b35a80f
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-2f255e
    role: assistant
    content: '**Current approach:** Treat legal and compliance readiness as a pre-close
      gate. Do not assume Harbor’s licenses transfer. Consider a narrower launch if
      licensing, KYC records, alert review, or monitoring tests are incomplete.


      **Unresolved questions:** State approval in the four new markets; whether Mosaic’s
      AML/CIP program permits reliance on Harbor’s KYC; what the alerts and SAR history
      show; whether monitoring will work without a gap; and how the $50 bonus will
      operate.


      **Next step:** Obtain state-by-state licensing advice and review the alerts
      and SAR history. The available sources do not yet support a final state-specific
      conclusion.'
    created_at: '2026-09-10T22:49:52+00:00'
    path_id: SCN-490c71c86d9c658974321c1e
    comparison_path_ids: []
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 17
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-c95c1b
  source_label: 'Saved message: Consider an alternative where the bank holds the funds.
    Keep this hypothetical.'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: Consider an alternative where the bank holds the funds. Keep
    this hypothetical.
  record_revision: 678b66ff4a0dd03f372c82f75841cc74ab31be74420cc884ad2e3c238b9217a5
  source_version: 678b66ff4a0dd03f372c82f75841cc74ab31be74420cc884ad2e3c238b9217a5
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-c95c1b
    role: user
    content: Consider an alternative where the bank holds the funds. Keep this hypothetical.
    created_at: '2026-09-10T23:03:27+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 18
    submitted_scope: scenario
    submitted_path_id: SCN-490c71c86d9c658974321c1e
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-02f34c
  source_label: 'Saved message: **Issue** — A partner bank could hold customer funds,
    while Mosaic supplies tech…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: '**Issue** — A partner bank could hold customer funds, while
    Mosaic supplies technology and operations.


    **Analysis** — This could lower licensing risk if the bank owns the accounts and
    controls fund transfers. It does not automatically remove risk if Mosaic controls
    transfers, owes balances, or acts directly for users. KYC, alert, SAR, monitoring,
    and marketing questions remain.


    **Conclusion** — Map the funds flow, customer relationship, and compliance duties
    before assessing this option. The current matter position stays unchanged.


    **No external authority retrieved for this hypothetical.**'
  record_revision: 3fece5873585c7b17f7dd55ad8d8285f04bd6220f97894b36f0cdfeedbb6f2cc
  source_version: 3fece5873585c7b17f7dd55ad8d8285f04bd6220f97894b36f0cdfeedbb6f2cc
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-02f34c
    role: assistant
    content: '**Issue** — A partner bank could hold customer funds, while Mosaic supplies
      technology and operations.


      **Analysis** — This could lower licensing risk if the bank owns the accounts
      and controls fund transfers. It does not automatically remove risk if Mosaic
      controls transfers, owes balances, or acts directly for users. KYC, alert, SAR,
      monitoring, and marketing questions remain.


      **Conclusion** — Map the funds flow, customer relationship, and compliance duties
      before assessing this option. The current matter position stays unchanged.


      **No external authority retrieved for this hypothetical.**'
    created_at: '2026-09-10T23:04:43+00:00'
    path_id: SCN-490c71c86d9c658974321c1e
    comparison_path_ids: []
    action_actor: null
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 19
    submitted_scope: null
    submitted_path_id: null
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: MSG-20260910-900f63
  source_label: 'Saved message: Consider an alternative where the bank holds the funds.
    Keep this hypothetical.'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
  available_excerpt: Consider an alternative where the bank holds the funds. Keep
    this hypothetical.
  record_revision: 59ea4c8311afcb03a73572e9c86408f908afef4ae2aab2cbd31ccdbf63744771
  source_version: 59ea4c8311afcb03a73572e9c86408f908afef4ae2aab2cbd31ccdbf63744771
  support_state: supplied
  captured_record:
    message_id: MSG-20260910-900f63
    role: user
    content: Consider an alternative where the bank holds the funds. Keep this hypothetical.
    created_at: '2026-09-10T23:35:00+00:00'
    action_actor:
      person_id: local-lawyer
      display_name: Unattributed lawyer
      mode: single
    workspace_action: null
    conversation_id: CONV-20260909-5299cf
    path: 03_Matters/harbor-2-d89ad8/conversations/CONV-20260909-5299cf.md
    message_sequence: 20
    submitted_scope: scenario
    submitted_path_id: SCN-490c71c86d9c658974321c1e
    historical_not_authority: true
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
- source_id: FILE-b17b54a09cf7289a35e8
  source_label: 'request.md: # Original Request


    From: Dana, PM — Growth & Integration

    Subject: Harbor migrat…'
  source_class: saved_artifact
  path: 03_Matters/harbor-2-d89ad8/request.md
  available_excerpt: '# Original Request


    From: Dana, PM — Growth & Integration

    Subject: Harbor migration — anything here need legal?


    We''re acquiring Harbor Pay. Close is targeted Nov 15 (~10 weeks). Migration plan:


    240k consumer users, 12k business accounts move into our app on day 1 post-close.
    One unified account, one balance, full access to our product set.

    No re-verification — they were already KYC''d by Harbor.

    Harbor holds MTLs in 38 states, we hold 41. Combined that''s 44 — nice win, opens
    four new markets.

    Harbor''s KYC ran through a vendor that shut down in 2024. We have pass/fail results
    for everyone, but not the underlying documents for users onboarded before 2023.

    Harbor''s monitoring is a third-party SaaS whose contract terminates at close.
    Plan is to repoint their transaction feed at our engine on day 1.

    Marketing wants a "Welcome" campaign with a $50 bonus on first transfer, launching
    close+1.

    Diligence flagged that Harbor has ~40 open alerts and "a handful" of SARs from
    the last year. Nobody''s read them yet.


    Does any of this need legal before close? It''s really just a data migration.'
  record_revision: ddeb0f26ab859d90d82d6c6149a6cb045cc5ca0edda3a82db0cb28d68afdaefa
  source_version: ddeb0f26ab859d90d82d6c6149a6cb045cc5ca0edda3a82db0cb28d68afdaefa
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
      results for everyone, but not the underlying documents for users onboarded before
      2023.

      Harbor''s monitoring is a third-party SaaS whose contract terminates at close.
      Plan is to repoint their transaction feed at our engine on day 1.

      Marketing wants a "Welcome" campaign with a $50 bonus on first transfer, launching
      close+1.

      Diligence flagged that Harbor has ~40 open alerts and "a handful" of SARs from
      the last year. Nobody''s read them yet.


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
    editable: false
    kind: markdown
  locator: null
  output_revision: ec7ae7a4318acb2474c8223aaa0b88229abedf6b3151ac2de4ab6ae4f8830d0d
---
# Harbor 2 — Harbor Pay acquisition migration (matter dossier)

Matter MAT-20260909-d89ad8 · prepared from captured records dated Sep 9–10, 2026. Business question supplied by the matter record; direction unchanged.

## Current position

Yes — material parts of the Harbor Pay migration need legal review before the Nov 15 close, and one item should be reviewed before the deal terms are settled, not merely before launch. This is not "just a data migration": the day-1 plan depends on results the records show are unconfirmed — license coverage in the added markets, the ability to rely on Harbor's KYC without the underlying records, and a monitoring cutover with no gap.

Three conditions decide how much of the full day-1 migration survives:

- **Whether Mosaic can lawfully serve each added market on day 1.** The plan "use/assume Harbor's licenses" is not established for an asset purchase. If approvals are missing, those markets are a post-close target, not day-1 access. (The number of added states is itself unresolved — see Record conflicts.)

- **Whether Mosaic's AML/CIP program and applicable rule permit reliance on Harbor's prior KYC**, and whether the pre-2023 cohort with missing documents can keep full access without re-verification or limits.

- **What the ~40 open alerts and the SAR history show**, and whether monitoring transfers without a gap. The alert/SAR review is the most decision-changing item because it can affect deal protections and how affected customers are handled at migration.

The $50 bonus (launching close+1) and the customer-records/terms side of the data move do not block close on today's record, but each must be reviewed before its own go-live point and each needs documents not in the readable record.

What can proceed now: migration engineering, diligence, the compliance data pull, the licensing map, and standing up a controlled review protocol for the alerts/SARs. What should wait or change: launching the added markets on Harbor's licenses; full-access onboarding of users whose verification cannot be evidenced; the monitoring cutover unless a tested no-gap design or a bridge exists; the bonus until its terms are reviewed.

This draft recommends treating those items as pre-close gates and preparing a staged launch as the fallback. That is this draft's recommendation, not a recorded decision. The recorded plan is unchanged: day-1 full migration, no re-verification, use/assume Harbor's licenses, bonus at close+1. The only recorded lawyer decisions are the Sep 9 intake answers (asset purchase; compliance to confirm KYC reliance; alerts/SARs unreviewed; use/assume Harbor's licenses). A complete dossier rewrite was submitted as a tracked revision on Sep 10 and, per the record, left the current dossier unchanged pending acceptance; generating this draft records no new decision.

## Decision question

Does any part of the Harbor Pay acquisition migration need legal review before the Nov 15 close?

## Issues

The four workstreams below are the recorded issue set from the Sep 9 initial issue map ([source:MSG-20260909-efcbdd]) and the lawyer's "four issues" framing ([source:MSG-20260909-539d02]): licensing, KYC/AML, alerts and monitoring, and marketing. The saved issue list and its ISS identifiers were not inside this run's readable material, so no issue IDs or markers are asserted here. A fifth issue, newly identified in this draft from the recorded migration plan, is included and labeled.

Support status: no retrieved external authority appears in the readable records. The record shows the lawyer asked for research with sources ([source:MSG-20260909-660683], [source:MSG-20260909-406e0e]), an initial "research is in progress" statement ([source:MSG-20260909-168b9d]) later corrected ([source:MSG-20260909-91b5ec], [source:MSG-20260909-b4cc1f]), and a run described as "queued or running" with saved source choices ([source:MSG-20260910-c27e90]); no run output was readable here. Every legal proposition below is therefore a framework or lead, not verified support; named authorities carry **Needs checking**. Each issue gets an initial answer; any prior researched issue answers in the nine captured documents were not readable in this run and should be merged when available.

### 1. State money transmitter licensing for the added markets

**Current answer**

Not established for day 1. An asset purchase does not automatically carry Harbor's money transmitter licenses to Mosaic, and a separate legal entity cannot simply "use" another company's licenses. Until a state-by-state path exists — new license, transfer or change-of-control approval in the transaction, or an arrangement where the licensed entity performs the transmission — the added markets should be treated as post-close, not part of day-1 full access. Even where Mosaic holds its own license, the account migration may trigger state notices or filings (unverified).

**Rule and support**

State money transmitter statutes generally require a license, or status as an authorized delegate of a licensee, to transmit money for others; licenses are issued to a specific entity, and state approval is commonly required for a change of control or transfer of a licensed business [**Needs checking** — the MTL statutes of the specific states; the CSBS Money Transmission Modernization Act where adopted]. Federal MSB registration (31 C.F.R. § 1022.380) is a separate requirement and does not substitute for state licensure [**Needs checking**]. The precise research question: for each state where Mosaic lacks a license and Harbor holds one, what route lets Mosaic lawfully serve migrated customers — new license, license transfer, change-of-control approval, or authorized-delegate arrangement — on what timeline, and what customer or regulator notices accompany the change?

**Application**

Recorded: asset purchase (intake answer, [source:MSG-20260909-2e549e]); Mosaic 41 licenses; Harbor 38; combined 44; plan "use/assume Harbor's licenses"; full access on day 1. Two gaps drive the answer. First, who will contract with the migrated customer and transmit funds after close — if it is a Mosaic entity, it needs a licensing footing in each required state; nothing in the record shows a license transfer or approval was requested or analyzed. Second, the states are unidentified and the counts do not reconcile (see Record conflicts), so the size of the problem is unknown. Because state approvals generally run longer than the time remaining (unverified, state-specific), the realistic interim course is to proceed with the closing while staging the customer onboarding by state, activating the added markets as approvals are obtained. Treat the "four new markets" win as a post-close target, not a day-1 entitlement, until the map shows otherwise. The recorded intake assumption that Harbor's and Mosaic's licenses are "transferable or can be maintained" remains an assumption, not a fact.

**Next step**

Commission the state-by-state matrix (state; Mosaic status; Harbor status; route; timeline; notices) and identify the entity that will serve migrated customers. Until it exists, keep the added markets out of the day-1 launch plan and out of launch commitments.

### 2. KYC: no re-verification, reliance on Harbor's checks, and the pre-2023 record gap

**Current answer**

Cannot be confirmed as planned. The plan — no re-verification, pass/fail flags only, missing underlying documents for pre-2023 users — depends on a compliance answer the record says is still open, and even a favorable answer may not cover the cohort with missing records. Working position: full day-1 access for users whose verification cannot be evidenced is not supported on the current record. Identify the cohort, then either re-verify it, document a permitted reliance with limits, or restrict functionality until resolved.

**Rule and support**

As a money services business, Mosaic must maintain an AML program (31 U.S.C. § 5318(h); 31 C.F.R. § 1022.210) including customer identification (31 C.F.R. § 1022.220), recordkeeping (31 C.F.R. §§ 1010.410, 1022.410), and — for the 12,000 business accounts — customer due diligence and beneficial ownership (31 C.F.R. § 1010.230) [all **Needs checking**]. The banking CIP rule contains an express reliance-on-another-institution provision (31 C.F.R. § 1020.220(a)(6)); the MSB CIP rule is commonly read as not containing the same express provision, which is exactly why the compliance confirmation matters [**Needs checking** — the MSB CIP rule text and any FinCEN guidance on third-party or reliance arrangements].

**Application**

Recorded: compliance has not confirmed whether Mosaic's program permits reliance; Harbor's KYC vendor closed in 2024; pass/fail results exist for everyone; underlying documents are missing for pre-2023 users (count not recorded — material). Two outcomes follow. If reliance is permitted and the flags plus Harbor's records suffice, the pre-2023 document gap may still be a deficiency depending on what must be retained — confirm what evidence is required and whether flags can substitute. If reliance is not permitted, or not available for the gap cohort, the plan fails as written for those users and the cure is re-verification or limited access. Either way, cohort size drives feasibility before close, and the vendor shutdown means Harbor cannot cure the document gap itself. Also unaddressed in the record: what Harbor collected for the business accounts, which the same diligence should cover. The recorded assumption that pass/fail results "are sufficient" remains unconfirmed.

**Next step**

Obtain a written compliance answer on reliance, plus counts and identifiers for the pre-2023 cohort and the business-account CDD records; then choose re-verification, documented reliance, or temporary access limits and build it into the launch. Fallback that preserves the close date: migrate all users, but hold full transacting for the unverified cohort until cured.

### 3. Unread alerts and SARs, and the monitoring cutover

**Current answer**

The highest-value pre-close review. Roughly 40 open alerts and "a handful" of recent SARs are unread; what they show could range from a routine backlog to unresolved suspicious activity that affects deal protections and how affected customers are handled at migration. Separately, the monitoring cutover (Harbor's SaaS contract ends at close; the feed repoints to Mosaic's engine on day 1) needs a tested no-gap plan or a bridge. Review access itself needs care: SAR information is confidential, so who reads what, and how, should be structured deliberately rather than by circulating files [unverified premise].

**Rule and support**

MSBs must report suspicious transactions and protect SAR confidentiality (31 C.F.R. § 1022.320), and effective monitoring is part of the AML program (§ 1022.210) [**Needs checking**]. Two research points sit underneath this issue: what Harbor may lawfully share with a prospective acquirer about SARs and alerts, and on what conditions; and how open alerts, investigations, and SAR-related records are handled at closing — who continues them and what transfers.

**Application**

Recorded: alerts and SARs unreviewed, "still in diligence" ([source:MSG-20260909-2e549e]); nobody has read them. The deal is therefore being priced without knowing whether Harbor missed filings or whether any customer being migrated is under active suspicion. Practical design: (a) run the review under privilege with controlled access, counsel-led, so SAR confidentiality and the deal record are both managed; (b) triage the open alerts for anything requiring action before close or account-level handling at migration; (c) use the findings for deal protections if needed. On monitoring, the record shows no test plan, and the cutover coincides with the day-1 migration — the moment of peak new activity. The decisive contract term is the SaaS contract's termination and extension mechanics: confirm whether a short bridge or renewal is available; if not, plan parallel monitoring or a later repoint. Also decide who reviews alerts during the transition and how Harbor's alert history carries into Mosaic's engine. The recorded assumption that the repoint can be "completed and validated before close without a monitoring gap" is untested.

**Next step**

Approve a controlled review protocol and assign the review immediately (outside counsel leading, Mosaic compliance supporting — **Proposed**), then set a monitoring cutover test with a named go/no-go before migration. If the alerts review cannot finish before deal terms are set, convert it into a specific deal-protection item rather than letting it run over the close.

### 4. The $50 welcome bonus (launching close+1)

**Current answer**

Not a close blocker on the current record, but it needs review before it launches at close+1, and the review cannot start until the terms exist. The terms that decide the answer: eligibility (who gets it and who is excluded), credit mechanics (when and how the bonus is paid, conditions, clawbacks, expiration), the campaign disclosures and claims, and whether it targets any cohort whose access is limited by the KYC issue. If users under access limits cannot perform the qualifying transfer, promising them the bonus is a misleading-claim risk; if the design is clean, this is a contained terms-and-disclosure review.

**Rule and support**

Consumer-protection law on unfair or deceptive acts or practices (12 U.S.C. §§ 5531, 5536) [**Needs checking**], plus state advertising and money-transmission conduct rules and the campaign's own terms [**Needs checking**].

**Application**

Recorded: marketing wants a $50 bonus on first transfer, launching close+1; no terms are in the record. The bonus interacts with three known conditions: the migration date itself (if day-1 access is staged by state or by verification cohort, the trigger may not be available to everyone), any account limits imposed for unverified users, and cross-marketing to customers whose data just moved (see Issue 5 — the customer terms and privacy commitments govern what marketing promises can be made). The review should confirm the campaign language matches what users can actually do at launch, and that conditions are disclosed where misunderstanding risk is highest — an incentive tied to completing a money transfer.

**Next step**

Obtain the marketing brief and draft terms; review and either clear or adjust before close+1. If the terms are not ready in time, delay the campaign — a later launch is cheaper than a walk-back.

### 5. Customer records, terms, and consent on the day-1 move (newly identified in this draft)

**Current answer**

Preliminary: the part of the plan described as "just a data migration" has legal dependencies of its own. The day-1 move transfers account relationships, balances, and personal data from Harbor's entity to Mosaic. Whether that is permitted depends on clauses not in the readable record: the assignment or transfer terms in Harbor's customer agreement, the data-sharing provisions in its privacy policy, and any notice obligations to customers or states. If notice or consent is required, that work runs before close, not after.

**Rule and support**

Customer contract rights transfer according to their terms and applicable assignment principles; privacy commitments run through the companies' policies and privacy law (leads: GLBA, 15 U.S.C. § 6801 et seq.; FTC Safeguards Rule, 16 C.F.R. part 314 [**Needs checking**]; state privacy statutes) and through what Harbor told customers about data sharing. This issue was not among the four recorded workstreams (licensing, KYC/AML, alerts and monitoring, marketing); it is identified here from the recorded migration plan itself, and flagged as such rather than as a saved issue.

**Application**

Recorded: 240,000 consumer users and 12,000 business accounts move into Mosaic's app with one unified account and balance and full access — an asset purchase with no recorded consent or notice step. The decisive documents are Harbor's customer agreement (assignment and change-of-terms clauses), its privacy policy (transfers to affiliates or successors; material-change notices), and any state-specific notice requirements for account or servicer changes [unverified]. Because the migration is day-1, a missing notice step is a schedule risk, not just paperwork: it could require sequencing the migration or a notice campaign between signing and close. Nothing in the readable record shows this workstream was reviewed.

**Next step**

Pull the customer agreement, privacy policy, and business-account terms; confirm transfer permissions and any notice periods; if notices are needed, start them before close to protect the day-1 plan.

**Record conflicts**

- **State counts do not reconcile.** Harbor 38 + Mosaic 41 gives an overlap of 35 and a union of 44, so only 3 states would be new to Mosaic (and 6 new to Harbor). The request's "four new markets" matches neither figure. One or more reported numbers is inaccurate, or "four" means something not stated. Practical effect: the number and identity of states needing a licensing path, and the launch scope, cannot be sized until a state-by-state schedule is produced. Reported values are preserved; none is silently corrected.

- **Research status sequence conflicts.** Sep 9, 21:11: "Research is in progress" ([source:MSG-20260909-168b9d]). Sep 9, 23:14: "No research is in progress" and the tool was unavailable ([source:MSG-20260909-91b5ec]). Sep 9, 23:47: "No durable research run was started" ([source:MSG-20260909-b4cc1f]). Sep 10, 00:47: research "queued or running with its saved source choices" ([source:MSG-20260910-c27e90]). Practical effect: the support posture of any earlier memo is unclear, and this dossier cannot rely on retrieved authority. Resolve by locating the run's outputs and source list.

- **Metadata date unexplained.** The matter record carries a target date of 2026-09-11, which matches no milestone in the readable records (close is reported as Nov 15, about ten weeks from Sep 9). Practical effect: unclear; if Sep 11 is a working deadline for any deliverable it changes sequencing, not the analysis. Confirm what the date represents.

**Assumptions used in this draft**

- The added markets are states where Mosaic lacks its own license and would rely on Harbor's; the exact state list is unknown and the reported counts disagree. Issue 1's scope and the licensing action depend on this.

- The SARs remain Harbor's filed reports and have not been transferred to Mosaic; only their unreviewed existence has surfaced in diligence. Issue 3's access protocol assumes this; if SAR content has already moved without controls, that becomes an immediate question.

- The $50 bonus terms are not yet fixed (marketing "wants" the campaign). Issue 4's analysis is conditional on those terms.

- Harbor's customer agreements and privacy commitments are not in the readable record. Issue 5 is framed around the clauses that will decide it (assignment; data sharing or transfer; notice).

Nothing else is assumed. Recorded assumptions in the facts file (license transferability; sufficiency of pass/fail KYC results; a validated no-gap monitoring repoint) are tested in the issues above and remain unconfirmed.

**Alternatives considered**

<!-- alternative:SCN-490c71c86d9c658974321c1e -->
### Bank holds the funds (partner-bank model) — **Hypothetical — not adopted**

Recorded on scenario SCN-490c71c86d9c658974321c1e. The lawyer asked on Sep 10 to consider "an alternative where the bank holds the funds" and expressly to keep it hypothetical ([source:MSG-20260910-c95c1b], repeated [source:MSG-20260910-900f63]); the recorded response ([source:MSG-20260910-02f34c]) describes a partner bank holding customer funds while Mosaic supplies technology and operations. Nothing here adopts it, and the matter direction stays unchanged.

**Assumptions (from the recorded exchange).** A partner bank owns or holds customer funds and balances; Mosaic provides technology and operations. The record does not specify the bank, the funds flow, or whether Mosaic controls transfers — the decisive missing piece.

**How it could help.** If the bank is the entity that holds funds and controls transfers, and Mosaic is genuinely a technology and operations provider, the state money-transmission question may relax because the transmitting party is the bank rather than Mosaic [unverified premise]. Whether it actually helps depends on the roles: who contracts with the customer, who owes the balance, who initiates transfers, and whose name is on the account. A change in structure does not by itself remove a permission requirement; the bank's own ability to serve these customers in the added markets must also be checked.

**Added risks and what it does not solve.** KYC: someone — Mosaic or the bank — still needs a compliant identification and due-diligence position on the same record gaps, and moving funds to a bank may change customer agreements and disclosures. Alerts and SARs: Harbor's history and the review need are unchanged, and the entity change shifts who keeps which records. Monitoring: the contract-termination and cutover problem persists unless the bank brings its own monitoring. Marketing: the bonus review is unchanged. New dependency: bank onboarding, allocation of the BSA/AML program, and customer re-papering, with an implementation timeline not shown to fit the ~10-week window.

**Issues left unresolved.** The four matter workstreams remain live to the extent the role mapping does not move the duty: licensing (reduced only if Mosaic is not transmitting and does not owe balances — conditional), KYC records, alert/SAR review and monitoring continuity, and the bonus. The customer-terms/data issue follows the same mapping.

**Next action.** Produce the funds-flow and roles map (customer contract; account holder; funds holder; who initiates transfers; complaint and error handling) before assessing this option; no external authority was retrieved for it in the record, and the licensing premises above are unverified. Use it only if the map shows the bank — not Mosaic — carrying the transmission and able to serve these customers; otherwise it does not change the current analysis. Compared with the current direction on the factors that actually differ: licensing route, time to implement (unknown, plausibly longer than the window — verify), added partner dependencies, and the unchanged KYC, alert, monitoring, and marketing work.

## Next actions

No owners or deadlines for these work items are recorded; every owner and timing below is **Proposed**, and the only source-based date is the reported Nov 15 close target. Ordered by decision impact and dependency.

1. **Alerts and SARs review — start immediately, before deal terms are set.** Deliverable: controlled-review protocol and a written report of what the open alerts and SAR history show. Needed result: whether unresolved suspicious activity or a missed filing changes deal protections or customer handling. Dependent decision: deal protections; account-level handling at migration. Fallback if unfinished: obtain specific deal protections and keep affected-customer handling under post-close review; do not broaden file circulation to close the gap. Owner (Proposed): outside counsel leading, Mosaic compliance supporting.

2. **State-by-state licensing map and route — start immediately.** Deliverable: matrix (state; Mosaic status; Harbor status; route — new license, transfer, change-of-control, or delegate; timeline; notices) plus the asset-purchase transfer analysis. Needed result: the lawful day-1 market list. Dependent decision: launch scope and staged rollout; customer communications. Fallback: stage the launch to Mosaic-licensed states; treat added markets as post-close. Owner (Proposed): regulatory counsel, with product/ops confirming the serving entity.

3. **KYC reliance confirmation, cohort data, and cure plan — scope immediately, complete before close.** Deliverable: compliance memo plus cohort counts (pre-2023 users; business accounts) and a remediation plan. Needed result: whether the no-re-verification plan stands and what happens to the gap cohort. Dependent decision: day-1 access levels. Fallback: limited access or re-verification for the cohort. Owner (Proposed): compliance lead with the data team.

4. **Monitoring cutover test and bridge decision — before close, with buffer.** Deliverable: cutover design, test results, and migration-window coverage plan (who reviews alerts; how history carries). Needed result: alerts continue without a gap. Dependent decision: day-1 feed repoint versus a bridge or parallel running. Fallback: extend Harbor's vendor if the contract permits, or run parallel monitoring. Owner (Proposed): engineering and compliance, with legal checking the SaaS termination and extension terms.

5. **Customer terms, privacy, and notices — before close, because day 1 depends on it.** Deliverable: assignment and data-transfer analysis plus a notice/consent plan with dates. Needed result: what must be sent, to whom, and when. Dependent decision: day-1 migration mechanics. Fallback: sequence migration behind notice delivery for affected records. Owner (Proposed): commercial and privacy counsel with servicing/marketing.

6. **Bonus terms review — start pre-close, clear before close+1.** Deliverable: reviewed terms and disclosures. Needed result: campaign-ready language consistent with launch reality (staged markets; limited-access cohort). Dependent decision: launch or delay the campaign. Fallback: delay launch. Owner (Proposed): marketing with legal review.

**Work product and records**

- Original request: REQ-20260909-283892 — [request.md: # Original Request

From: Dana, PM — Growth & Integration
Subject: Harbor migrat…](03_Matters/harbor-2-d89ad8/request.md) (Dana, PM Growth & Integration, Sep 9, 20:52; [source:MSG-20260909-982278]).
- Known facts and recorded assumptions: 03_Matters/harbor-2-d89ad8/facts.md (including the Sep 9 intake answers, [source:MSG-20260909-2e549e], and later reported answers).
- Conversations: CONV-20260909-a8160f (request thread); CONV-20260909-5299cf (intake, initial issue map [source:MSG-20260909-efcbdd], research requests, dossier-rewrite request [source:MSG-20260910-3ace1b] / [source:MSG-20260910-f8e728], working summary [source:MSG-20260910-2f255e], scenario messages).
- Scenario/alternative: SCN-490c71c86d9c658974321c1e.
- Prior revision: a complete dossier rewrite was submitted as a tracked revision on Sep 10, 04:36, leaving the current dossier unchanged pending acceptance. No current work-product draft or final path is recorded in the matter metadata.

Coverage: the captured inventory holds 3 conversations / 114 messages and 9 documents. This draft was written from the current-records bundle (facts, intake answers, assumptions, actions, sources) and the captured messages shown above. The remaining messages, the saved issue list with its ISS identifiers, and the nine documents — including any saved research outputs or researched issue answers — were outside this run's reading allowance and are not relied on. If those documents contain retrieved authority, the support labels here should be updated to match; none of the four recorded workstreams is contradicted by the material read.

<!-- saved-issue-analysis:start -->
## Saved issue answers

<!-- issue:ISS-c9d7c39f63-94e42e2b38090045 -->
### Money transmission licensing: whether Mosaic Relay can operate under the combined 44-state footprint and whether Harbor's MTLs transfer/survive the acquisition

**Generated analysis warning.** Main-agent analysis failed. Useful available work was preserved.

**No external authority retrieved**

Now reading the OCC source body and the Fenergo licensing-requirements passage for their literal text.

Research saved. 4 sources retrieved; 4 with passages read.

Next step: Identify the four Harbor-only states and complete one matrix covering license authority, transaction filings, interim operation, bank custody, outstanding obligations, and license surrender.

Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-6f559c.md)

<!-- issue:ISS-c9d7c39f63-ca95e529feeb1045 -->
### BSA/AML and KYC: whether relying on Harbor's prior KYC (with missing underlying documents for pre-2023 users) satisfies Mosaic Relay's independent CIP/AML obligations

The record does not support blanket reliance on Harbor's prior KYC. Harbor's vendor closed in 2024, pass or fail results remain, and underlying documents for some pre-2023 users are missing. The answer depends on Mosaic's written AML and customer identification program, Harbor's available evidence, the parties' legal roles, and the requirements that apply to the migrated accounts.

Initial answer — research not complete.

Next step: Review Mosaic's program and Harbor's records. Define which customers can migrate without new checks, which require more review, and which must be restricted until the record gap is fixed.

<!-- issue:ISS-c9d7c39f63-69af3f282d21ef38 -->
### SAR and alert handling: obligations to review, file, and manage Harbor's ~40 open alerts and SARs, and successor liability

**No external authority retrieved**

External collection is not authorized for this run — noted. I'll deliver from the saved library and matter records, with the federal framework clearly flagged as unverified. Let me confirm the exact saved fact and issue identifiers before composing the answer.

No oversized model request was sent.

Research saved. 1 sources retrieved; 1 with passages read.

Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-22d810.md)

<!-- issue:ISS-c9d7c39f63-4825f0af7ec75542 -->
### Monitoring vendor transition: continuity of transaction monitoring when the SaaS contract terminates at close

**No external authority retrieved**

I have the framework-level support from the saved model act. Before composing, let me confirm real record IDs for the synthesis (assumption and issue identifiers) from the matter's saved records.

No oversized model request was sent.

Research saved. 1 sources retrieved; 1 with passages read.

Research history: [Saved research 1](03_Matters/harbor-2-d89ad8/research/RES-20260912-182455.md)

<!-- issue:ISS-c9d7c39f63-72810d0a43d3ce66 -->
### Marketing compliance: the $50 welcome bonus offer and any state money transmission or consumer protection implications

Legal review is required before publication, but this issue should not control the close. The record gives only a $50 first-transfer bonus. The answer depends on eligibility, funding, transfer conditions, expiration and reversal rules, target states, advertising channels, and customer disclosures.

Initial answer — research not complete.

Next step: Obtain the final offer terms and customer journey. Limit eligibility to the approved launch area. Complete advertising and disclosure review before release.

<!-- issue:ISS-c9d7c39f63-af341445a7af4c06 -->
### Customer account, contract, and data-transfer rights

The facts establish an asset purchase and a planned day-one migration. They do not establish assignment rights, required customer consent or notice, privacy authority, data-transfer limits, or responsibility for customer funds and obligations. The answer depends on the purchase agreement, customer terms, privacy notices, asset schedules, data flows, and the identity of each contracting entity.

Initial answer — research not complete.

Next step: Review the purchase agreement, customer agreements, privacy notices, data map, and planned customer notices. Identify required consents, notices, exclusions, and closing conditions.
<!-- saved-issue-analysis:end -->

## Alternatives considered

<!-- alternative:SCN-0f23edfc89ec6ecaf60a13e4 -->
### Bank-held funds timing test

Hypothetical — not adopted

Compare the current Harbor migration approach with a bank-held funds option using only the attachment's hypothetical facts and proposals, without changing actual facts or the current direction.

Hypothetical assumptions:

- For this hypothetical, a bank would hold the relevant funds during the Harbor 2 transition, while Mosaic would control transfer instructions subject to contract completion and bank operating setup.
- For this hypothetical, migration is planned for November 15, 2026, and bank integration readiness is December 3, 2026.
- For this hypothetical, pre-2023 identity documents are missing, 40 alert cases remain pending, and the monitoring service ends at close.

Saved working analysis:

- Qualified: the option makes the November 15 migration harder on the supplied test dates because bank integration is not ready until December 3, 18 days later.
- Supported by the fictional attachment: the bank would hold relevant funds, but Mosaic would control transfer instructions, subject to contract completion and bank operating setup.
- Unresolved: bank-held funds do not, on the supplied test facts, resolve missing pre-2023 identity documents, 40 pending alert cases, or monitoring ending at close.

Still to resolve:

- Whether the bank contract and operating setup can be completed before November 15, 2026.
- Whether missing identity records, pending alerts, or monitoring transition requirements delay either option.

[Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-0f23edfc89ec6ecaf60a13e4.md)

<!-- alternative:SCN-406906c91ab0aba4313b54a6 -->
### Bank-held funds structure

Hypothetical — not adopted

Test whether a partner-bank custody model could reduce Mosaic Relay's money-transmission exposure while preserving the current Harbor migration direction.

Hypothetical assumptions:

- For this hypothetical only, a partner bank holds customer funds.

You reported an **asset purchase**. Mosaic Relay will buy Harbor Pay’s assets.

Still to resolve:

- Who contracts directly with users.
- Who controls transfer instructions and settlement.
- Who records balances and owes repayment to users.
- How KYC, transaction monitoring, alerts, SARs, privacy, and marketing duties are allocated.

[Saved alternative](03_Matters/harbor-2-d89ad8/scenarios/SCN-406906c91ab0aba4313b54a6.md)
