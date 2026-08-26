---
tool_id: record_decision
handler: record_decision
description: Record an explicit user-directed legal or business decision in the active
  matter.
parameters:
  type: object
  properties:
    matter_id:
      type: string
    title:
      type: string
    chosen_path:
      type: string
    rationale:
      type: string
    decision_maker:
      type: string
    conditions:
      type: array
      items:
        type: string
    linked_paths:
      type: array
      items:
        type: string
    next_review_at:
      type: string
    risk_level:
      type: string
  required:
  - title
  - chosen_path
  additionalProperties: false
---
# Tool: record_decision

Record an explicit user-directed legal or business decision in the active matter.

This Markdown file is a declarative specification. The runtime maps `handler: record_decision` to an allow-listed Python function; it does not execute Markdown code.
