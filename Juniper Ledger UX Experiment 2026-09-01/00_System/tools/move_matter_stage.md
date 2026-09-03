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
      - closed
    reason:
      type: string
  required:
  - new_stage
  additionalProperties: false
---
# Tool: move_matter_stage

Move the active matter to a legal-workflow stage.

This Markdown file is a declarative specification. The runtime maps `handler: move_matter_stage` to an allow-listed Python function; it does not execute Markdown code.
