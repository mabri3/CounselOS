---
record_type: audiences
audiences:
  - audience_id: counsel
    label: Another lawyer
    prompt: >-
      The reader is a lawyer. Cite the clause and section for every position.
      Use the terms of art; do not gloss them. State the counter-argument you
      expect and why it fails. Do not explain background law they already know.
  - audience_id: executive
    label: An executive
    prompt: >-
      The reader decides and does not practise law. Lead with the recommendation
      and what it costs — money, delay, or risk carried. One paragraph of
      reasoning, no clause numbers. Name who owns the risk and by when. If there
      are two defensible paths, say which you would take.
  - audience_id: product
    label: The product team
    prompt: >-
      The reader is shipping something. Say what they may build, what they may
      not, and what has to be true first. Write the conditions as a checklist
      they can work from. No legal reasoning unless it changes what they build.
  - audience_id: partner
    label: A partner or counterparty
    prompt: >-
      The reader is outside the company and their counsel will read this after
      them. State our position and the basis for it. Concede nothing not already
      conceded in writing. Neutral, complete, no internal risk assessment and no
      speculation about our own exposure.
  - audience_id: regulator
    label: A regulator or auditor
    prompt: >-
      The reader is examining us. Be complete, dated, and precise about what was
      done, when, and by whom. Cite the record. Claim nothing that is not
      evidenced in the vault. No advocacy, no characterisation.
  - audience_id: record
    label: The record
    prompt: >-
      This is a memo to file. Neutral and complete. Label every assumption as an
      assumption and every gap as a gap. Write for a lawyer who picks this up in
      two years knowing none of the context.
---
# Audiences

Each entry seeds the "Written for" field. The lawyer edits the text after
choosing; the edited text, not the preset, is what reaches the model.
