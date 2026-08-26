---
tool_id: write_markdown
handler: write_markdown
description: Create or update a Markdown work product inside the vault. Immutable
  originals cannot be overwritten.
parameters:
  type: object
  properties:
    path:
      type: string
    title:
      type: string
    content:
      type: string
    metadata:
      type: object
      additionalProperties: true
  required:
  - content
  additionalProperties: false
---
# Tool: write_markdown

Create or update a Markdown work product inside the vault. Immutable originals cannot be overwritten.

This Markdown file is a declarative specification. The runtime maps `handler: write_markdown` to an allow-listed Python function; it does not execute Markdown code.
