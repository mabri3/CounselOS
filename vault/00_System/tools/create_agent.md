---
tool_id: create_agent
handler: create_agent
description: Create a hot-loadable Markdown agent definition.
parameters:
  type: object
  properties:
    agent_id:
      type: string
    name:
      type: string
    description:
      type: string
    instructions:
      type: string
    allowed_tools:
      type: array
      items:
        type: string
    max_steps:
      type: integer
      minimum: 1
      maximum: 20
  required:
  - agent_id
  - name
  - description
  - instructions
  additionalProperties: false
---
# Tool: create_agent

Create a hot-loadable Markdown agent definition.

This Markdown file is a declarative specification. The runtime maps `handler: create_agent` to an allow-listed Python function; it does not execute Markdown code.
