---
tool_id: move_matter_stage
handler: move_matter_stage
description: Move the active matter to another stage.
parameters:
  type: object
  properties:
    matter_id:
      type: string
    new_stage:
      type: string
      enum:
      - intake
      - research
      - explore
      - generate
      - respond
    reason:
      type: string
  required:
  - new_stage
  additionalProperties: false
---
# Tool: move_matter_stage

Move the active matter to a legal-workflow stage.

Closure is a separate guarded action. Use `close_matter` when the lawyer
explicitly asks to close a matter.

This Markdown file is a declarative specification. The runtime maps `handler: move_matter_stage` to an allow-listed Python function; it does not execute Markdown code.
