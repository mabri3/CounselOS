---
tool_id: append_memory
handler: append_memory
description: Save an instruction or lesson in workspace memory.
parameters:
  type: object
  properties:
    note:
      type: string
  required:
  - note
  additionalProperties: false
---
# Tool: append_memory

Append a durable user instruction or learning to memory.md.

This Markdown file is a declarative specification. The runtime maps `handler: append_memory` to an allow-listed Python function; it does not execute Markdown code.
