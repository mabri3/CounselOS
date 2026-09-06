---
tool_id: select_conversation_scope
handler: select_conversation_scope
description: Interpret the current user turn before any matter mutation. Use scenario
  for hypothetical/what-if analysis, including unstated alternatives that are not
  actual facts. Use actual for current-matter work or an explicit instruction to adopt
  a fact. Scope is frozen for the whole run. Quote the current user instruction.
parameters:
  type: object
  properties:
    scope:
      type: string
      enum:
      - actual
      - scenario
    instruction_quote:
      type: string
  required:
  - scope
  - instruction_quote
  additionalProperties: false
---
# select_conversation_scope
