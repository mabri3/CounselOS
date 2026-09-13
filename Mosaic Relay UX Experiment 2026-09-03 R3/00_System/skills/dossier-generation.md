---
skill_id: dossier-generation
name: Dossier generation
description: Generate or update the complete matter dossier from saved records.
enabled: true
---
# Dossier generation

Uses: answer

Write the actual dossier in Markdown. Do not describe how to write it, return a
plan, or replace the document with a link. These instructions govern dossier
writing only. The supporting skills remain independent. Use their relevant
reasoning and source guidance; this document's purpose and structure take
precedence over their chat-only formats, intake prompts, and stopping rules.
Do not run new research merely to refresh the dossier.

## Purpose

Give counsel an editable, current view of the whole matter across any area of
law. Use the supplied matter records and saved research. Lead with the answer
and the judgment needed. Be concise but retain the reasoning a lawyer needs.
Do not add generic disclaimers or turn missing support into a refusal.

The North Star is the business's controlling question and objective, starting
with the original request and any explicit lawyer clarification or reframe.
The latest chat question is normally a supporting inquiry, not replacement
scope. Answer the business question even when a later exchange is narrow.
Test the premise behind the request. Explain when the evidence supports a
different answer, a changed route, or not proceeding. Do not force the facts
to support the business's proposed solution or silently rewrite its question.

Assess material issues from the current records and relevant history across
all supplied matter conversations. The saved issue list is a starting point,
not a ceiling. Include a newly identified material issue in the Issues section,
with its source and effect on the business question. Use ordinary headings for
issues without saved IDs; do not invent an ID or claim the issue list was changed.
Read omitted passages through the captured-record reader when needed. Preserve
their speaker, date, corrections and hypothetical scope. Do not claim that
available records were all read. Judge detail by its value to the business
answer and counsel's next decision, not a fixed depth-versus-breadth quota.

On a refresh, derive the current position again from the current records and
supported issue analysis. The prior dossier is fallible synthesis for continuity,
not a wording template or evidence that an activity is cleared. Keep useful
reasoning, but replace conclusions and assumption labels that the current inputs
do not support. Preserve the recorded direction and decisions as records; explain
separately when this draft recommends a change. Retention of prior research means
it stays accessible, not that its earlier conclusions must stay unchanged.

Write the general matter dossier, even when the conversation is exploring an
alternative. The current direction stays the planning baseline. Recording a
hypothetical in this document does not adopt it or change any reported fact.

## Reading order

1. A short title and **Current position**: answer the business question in a
   short decision brief. Give the recommended course now, why it best serves
   the objective, what can proceed, and what should wait or change. Name the
   decisive conditions, not every information gap. Distinguish this draft's
   recommendation from the accepted working view and any recorded decision.
2. **Decision question**: reproduce the supplied controlling business question exactly. It
   is the matter's scope, not a question for the model to replace.
   If no question has been recorded, frame a provisional business question from
   the original request; do not substitute the latest conversational subquestion.
3. One **Issues** section covering EVERY supplied issue. Keep each issue's
   stable identity with an invisible `<!-- issue:ISS-... -->` marker before its
   heading. Do not substitute a second, different issue list.
4. **Next actions**: a short, ranked work plan. For each action give the
   deliverable, the result needed to proceed, the dependent decision or activity,
   and the fallback if that result is not available. Order by dependencies and
   time sensitivity, not merely the saved issue order. Reuse assigned work and
   its recorded owner and date. When no assignment exists, suggest an owner
   role and timing relative to a real milestone, clearly labeled **Proposed**.
   Do not invent a person, commitment, legal deadline, or calendar date.
   Distinguish a source-based deadline from a suggested working target.
5. Brief links to available current work product, supporting records, and prior
   revisions. Omit empty inventories and routine record housekeeping that does
   not affect the decision. Do not paste the old dossier or superseded advice
   into the body.

## Each issue

Default to a compact CRAC structure: **Current answer**, **Rule and support**,
**Application**, and **Next step**. The last part states the practical effect,
not a repetition of the opening. Use CREAC when interpreting the authority
needs a separate **Explanation**. Use IRAC only when the issue itself still
needs to be framed. Do not pad a section to meet a template.

Keep work status separate from the legal answer. Show what remains: information,
research, analysis, a decision, or implementation. A supplied answer to a fact
question does not by itself close the legal issue. Keep answered questions with
the facts they establish, rather than in the open-question list.

Retain prior analysis of issues untouched by the latest research. Say when an
issue has not been researched or when changed inputs may affect its prior view.
Depth on one issue must not make the other issues disappear.

Give each issue one useful current answer, even without completed research.
Explain the likely result, the facts or rule it depends on, and the next useful
check. Do not give only a referral to legal or say merely that research is needed.
Make the reasoning usable: identify the applicable actor, conduct, jurisdiction
or contract, and the operative test. Apply each decisive condition to the known
facts. If a material fact is missing, explain the result on either side of that
fact and recommend an interim course. A statement that something 'depends on
the terms' is incomplete unless it says which term matters and how it changes
the answer. Address a material exception or competing reading when it could
change the recommendation; do not invent one to fill a template.

Use saved source passages to explain the rule and its material qualifications,
with the source and locator beside the proposition. A source title, URL, or
opening excerpt alone is not the operative rule. Treat private agreements and
company policies as those types of support, not public law. If no relevant
authority is saved, give the best conditional analysis and label that legal
premise as unverified. State the precise research question once; do not repeat
'not researched' in place of analysis or claim research happened in this run.

Connect issues that affect the same decision. Explain what a proposed mitigation
solves, what it does not solve, and which dependency must be met first. Distinguish
a legal requirement from a recommended risk control or business preference.
A possible way forward is not permission to proceed. Separating activities or
milestones does not establish that either is cleared; qualify the earlier step
when its independent contractual or legal conditions are not established.
The application places full saved research in a disclosure under its issue;
do not create saved-research disclosures yourself, repeat old analysis, or add a
saved-answer appendix. Write the current synthesis; the application preserves
the original research separately.

## Alternatives considered

Include this section when saved alternatives are supplied. Use one subsection
per alternative, with its `<!-- alternative:SCN-... -->` marker and saved title.
Label it **Hypothetical — not adopted** (or archived, if the record says so).
State its assumptions, how it helps or hinders the objective, added risks,
issues it leaves unresolved, and the next action. Keep each alternative's
working note and attached test evidence within that alternative. Do not blend
separate proposals or treat a test assumption as an actual matter fact.
Include material dates, controls, and dependencies from the saved working note.
Link the saved alternative. Do not infer acceptance or a recorded decision.
For each decisive condition, explain what the alternative changes and what still
applies. A change in format, asset, actor, or channel does not itself remove a
permission requirement or contractual restriction. If the saved terms do not
settle whether the restriction applies to the alternative, state that condition.
Do not present uncertain exemption as the reason the fallback can proceed.
Compare viable alternatives with the current direction on the factors that
actually change the choice, such as timing, scope, cost, and unresolved risk.
Recommend when to use each option. Do not give an unranked menu or assume that a
fallback solves unrelated issues. New options proposed in this draft are not
saved alternatives, selected directions, or commitments.

## Record and source distinctions

- Take requester-supplied facts as reported facts. Do not demote them to model
  assumptions merely because they were not independently verified. Flag a
  material inconsistency when the records actually conflict.
- Reconcile newer reported answers with older assumptions and open questions.
  Check that material counts, dates, and totals agree. State the conflict and
  its effect when they do not; do not silently choose a convenient value.
  Check simple arithmetic and chronology when a conclusion depends on them.
  Compare metadata with reported milestones. Put each material unresolved
  inconsistency in **Record conflicts**, with the practical effect and the fact
  needed to resolve it. Preserve the reported values; do not correct the record
  or omit the inconsistency merely because the rest of the analysis can proceed.
- Test the legal premise of an issue title. Name the relevant actor and explain
  why a duty applies to that actor. Do not extend a rule to a different class
  of entity without a basis, or treat every missing record as a breach. Where legal access to
  sensitive records is restricted, distinguish permitted diligence from an
  instruction to disclose or transfer the restricted material.
- Keep model assumptions separate. State only those actually used and explain
  which conclusion depends on them. Unknown facts remain unknown. Do not list
  reported facts, resolved old assumptions, or things not assumed in this section.
  An earlier assumption label does not override a later reported fact.
- A missing record proves a record gap, not the absence of a right, approval,
  consent, or obligation. Do not turn "not saved" into "does not exist" or a
  categorical legal prohibition. Do not present an inferred business activity
  as supplied fact. When a conclusion depends on unknown facts or applicable
  law, state that condition and give the next useful check.
- Distinguish a proposed view, the accepted working view, and an explicitly
  recorded decision. Generating this document records no new decision.
- Use the current direction's working note as fallible analysis, not facts.
  Keep unresolved or stale findings qualified. Reconcile old dossier and research
  assumptions against current records in the current answer; do not repeat a
  superseded premise merely because preserved research still contains it.
- Link support beside the claim it supports. Preserve supplied, retrieved,
  read, and verified source distinctions. Retrieval is not proof of support.
  An earlier model answer is not legal authority. Do not invent citations.
- Use current support labels. Do not repeat an old 'no sources retrieved'
  statement when the current record contains sources. State the actual gap.

The application retains version history and checks for concurrent changes.
Return the useful document even when some support or optional structure is
unavailable. Do not change facts, issue status, recommendations, or decisions.
