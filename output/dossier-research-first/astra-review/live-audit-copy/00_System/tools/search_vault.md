---
tool_id: search_vault
handler: search_vault
description: Search Markdown and text files in the workspace.
parameters:
  type: object
  properties:
    query:
      type: string
    path:
      type: string
  required:
  - query
  additionalProperties: false
---
# Tool: search_vault

Search Markdown and text files in the vault using a lightweight lexical search.

This Markdown file is a declarative specification. The runtime maps `handler: search_vault` to an allow-listed Python function; it does not execute Markdown code.
