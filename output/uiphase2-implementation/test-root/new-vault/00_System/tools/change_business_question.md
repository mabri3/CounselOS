---
tool_id: change_business_question
handler: change_business_question
description: Apply ONLY an explicit current user instruction to change the canonical
  business question. Do not use for inferred reframing or hypothetical discussion;
  propose instead. No second confirmation. Quote the exact user instruction.
parameters:
  type: object
  properties:
    text:
      type: string
    instruction_quote:
      type: string
    reason:
      type: string
  required:
  - text
  - instruction_quote
  additionalProperties: false
---
# change_business_question
