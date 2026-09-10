---
tool_id: propose_business_question
handler: propose_business_question
description: Save a specific inferred reframe for optional lawyer review. Does not
  change current question. Explain why it may be useful.
parameters:
  type: object
  properties:
    text:
      type: string
    reason:
      type: string
  required:
  - text
  - reason
  additionalProperties: false
---
# propose_business_question
