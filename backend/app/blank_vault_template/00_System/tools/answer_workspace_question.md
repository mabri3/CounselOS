---
tool_id: answer_workspace_question
handler: answer_workspace_question
description: Connect an ordinary prose answer to an existing supporting question ID
  and source_revision from context. Save as a reported fact, not independent verification
  or issue resolution. For unknown/leave open set left_open and omit answer. If ambiguous
  ask one focused question. Never use for hypothetical facts.
parameters:
  type: object
  properties:
    question_id:
      type: string
    expected_revision:
      type: string
    state:
      type: string
      enum:
      - answered
      - left_open
    answer:
      type: string
    instruction_quote:
      type: string
  required:
  - question_id
  - expected_revision
  - state
  - instruction_quote
  additionalProperties: false
---
# answer_workspace_question
