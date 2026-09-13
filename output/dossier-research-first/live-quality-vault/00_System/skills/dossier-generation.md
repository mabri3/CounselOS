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

## Reading order

1. A short title and **Current position**: what the matter concerns, the present
   view, and the most important unresolved decision or obstacle.
2. **Decision question**: reproduce the supplied current question exactly. It
   is the matter's scope, not a question for the model to replace.
3. One **Issues** section covering EVERY supplied issue. Keep each issue's
   stable identity with an invisible `<!-- issue:ISS-... -->` marker before its
   heading. Do not substitute a second, different issue list.
4. **Next actions**: ranked actions with the recorded owner, date, and evidence
   needed. Distinguish proposed actions from assigned work. Use actual dates
   when supplied. Label a calculated date as proposed and state its basis.
   Do not invent a due date or owner. Put the highest-priority action first.
5. Brief links to current work product, supporting records, and prior dossier
   revisions. Do not paste the old dossier or superseded advice into the body.

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

In a research-first dossier you compose the overview, the initial conditional
answers for issues not yet researched, the cross-issue implications, and the
overall next actions. For each researched issue, keep the full saved researcher
analysis — its operative rule, application, material conditions, tests or
checklists, remaining gaps, and proposed timing — under that issue's marker.
You may summarize research in the overview, but you must not be the only copy of
the researched analysis; do not compress a detailed multi-condition answer into a
single sentence. Reference labels stay readable (reported fact, supplied source,
retrieved source, verified authority), and proposed dates stay labeled as
proposed with their basis.

## Record and source distinctions

- Take requester-supplied facts as reported facts. Do not demote them to model
  assumptions merely because they were not independently verified. Flag a
  material inconsistency when the records actually conflict.
- Keep model assumptions separate. State only those actually used and explain
  which conclusion depends on them. Unknown facts remain unknown.
- A missing record proves a record gap, not the absence of a right, approval,
  consent, or obligation. Do not turn "not saved" into "does not exist" or a
  categorical legal prohibition. Do not present an inferred business activity
  as supplied fact. When a conclusion depends on unknown facts or applicable
  law, state that condition and give the next useful check.
- Distinguish a proposed view, the accepted working view, and an explicitly
  recorded decision. Generating this document records no new decision.
- Link support beside the claim it supports. Preserve supplied, retrieved,
  read, and verified source distinctions. Retrieval is not proof of support.
  An earlier model answer is not legal authority. Do not invent citations.
- Use current support labels. Do not repeat an old 'no sources retrieved'
  statement when the current record contains sources. State the actual gap.

The application retains version history and checks for concurrent changes.
Return the useful document even when some support or optional structure is
unavailable. Do not change facts, issue status, recommendations, or decisions.
