---
tool_id: select_conversation_scope
handler: select_conversation_scope
description: Interpret the current user turn before any matter mutation. Use scenario
  for hypothetical/what-if analysis, including unstated alternatives that are not
  actual facts. Use actual for current-matter work or an explicit instruction to adopt
  a fact. Scope is frozen for the whole run. Quote the current user instruction. For a concrete hypothetical with new assumptions, use path_intent new and supply new_path to save it now. Use existing only when saved assumptions already match. Use none for conceptual discussion or an explicit no-save request.
parameters:
  type: object
  properties:
    scope:
      type: string
      enum:
      - actual
      - scenario
    path_intent:
      type: string
      enum: [new, existing, none]
      description: New preserves changed hypothetical assumptions; existing resumes unchanged assumptions; none selects scope only.
    path_id:
      type: string
      description: Existing matching path ID, required for path_intent existing.
    new_path:
      type: object
      description: Required for path_intent new. Parent must be the saved approach being varied.
      properties:
        parent_path_id: {type: string}
        parent_revision: {type: string}
        title: {type: string}
        hypothesis_summary: {type: string}
        proposed_fact_changes:
          type: array
          items:
            type: object
            properties:
              change_id: {type: string}
              text: {type: string}
            required: [change_id, text]
            additionalProperties: false
        unresolved_conditions:
          type: array
          items: {type: string}
      required: [parent_path_id, parent_revision, title, hypothesis_summary, proposed_fact_changes, unresolved_conditions]
      additionalProperties: false
    instruction_quote:
      type: string
  required:
  - scope
  - instruction_quote
  - path_intent
  additionalProperties: false
---
# select_conversation_scope
