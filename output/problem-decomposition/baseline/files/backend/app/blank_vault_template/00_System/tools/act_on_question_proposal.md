---
tool_id: act_on_question_proposal
handler: act_on_question_proposal
description: Apply or reject an identified proposal ONLY when the current user requests
  that action. Use proposal ID from context. Optional text edits just the question.
parameters:
  type: object
  properties:
    proposal_id:
      type: string
    action:
      type: string
      enum:
      - apply
      - reject
    text:
      type: string
    instruction_quote:
      type: string
  required:
  - proposal_id
  - action
  - instruction_quote
  additionalProperties: false
---
# act_on_question_proposal
