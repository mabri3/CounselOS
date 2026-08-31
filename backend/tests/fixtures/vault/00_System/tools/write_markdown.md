---
tool_id: write_markdown
handler: write_markdown
description: Create or update a general Markdown note inside the active matter. Typed records and work products are protected.
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
  - path
  - content
  additionalProperties: false
---
# Tool: write_markdown

Create or update a general Markdown note inside the active matter. The path must be a relative `.md` path inside that matter. Matter records, research, decisions, work items, events, conversations, document batches, and configured work-product folders are protected. Use the matching typed tool for those records.

This Markdown file is a declarative specification. The runtime maps `handler: write_markdown` to an allow-listed Python function; it does not execute Markdown code.
