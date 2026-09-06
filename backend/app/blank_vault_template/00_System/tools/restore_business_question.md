---
tool_id: restore_business_question
handler: restore_business_question
description: Restore the prior question selected by the user as a new version. For
  undo, use the prior revision from question history. Does not undo documents or decisions.
parameters:
  type: object
  properties:
    revision:
      type: string
    instruction_quote:
      type: string
  required:
  - revision
  - instruction_quote
  additionalProperties: false
---
# restore_business_question
