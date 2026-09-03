---
tool_id: create_schedule
handler: create_schedule
description: Set recurring work for an agent.
parameters:
  type: object
  properties:
    title:
      type: string
    agent_id:
      type: string
    instructions:
      type: string
    kind:
      type: string
      enum:
      - agent_prompt
      - inbox_watch
      - decision_audit
    interval_seconds:
      type: integer
      minimum: 10
    watch_path:
      type:
      - string
      - 'null'
    matter_id:
      type:
      - string
      - 'null'
    enabled:
      type: boolean
  required:
  - title
  - agent_id
  - instructions
  additionalProperties: false
---
# Tool: create_schedule

Create a recurring automation assigned to an agent.

This Markdown file is a declarative specification. The runtime maps `handler: create_schedule` to an allow-listed Python function; it does not execute Markdown code.
