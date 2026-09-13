---
tool_id: read_file
handler: read_file
description: Read a workspace file.
parameters:
  type: object
  properties:
    path:
      type: string
      description: Vault-relative path.
  required:
  - path
  additionalProperties: false
---
# Tool: read_file

Read a vault file and return its content and metadata.

This Markdown file is a declarative specification. The runtime maps `handler: read_file` to an allow-listed Python function; it does not execute Markdown code.
