---
tool_id: read_file
handler: read_file
description: >-
  Read one exact vault-relative path from list/search/context; no URL, source ID,
  offset, page, or length arguments. Markdown returns body and separate metadata;
  txt/csv/json/yaml/yml return text. Other formats return empty content and file
  metadata, not extracted text: use an available extracted text companion.
  In an authorized research investigation, returns at most the first 6000
  characters (less if the evidence budget is low) plus source_id for the saved
  full scope-filtered text. Use read_research_source with that ID to obtain an
  explicit start/end passage, then continue at each returned end. Outside
  an investigation, a serialized result over 60000 characters has nested metadata
  removed; if its content also exceeds 40000 characters, only the first and last
  20000 characters are shown with a middle-omitted notice. There is no offset
  continuation on read_file. If that missing text matters, use the authorized
  research flow and source reader; otherwise state the gap. Never treat empty,
  omitted, or excluded text as reviewed or proof that a provision is absent.
parameters:
  type: object
  properties:
    path:
      type: string
      description: Exact vault-relative file path. Use returned paths, not guessed titles, public URLs, or source IDs. Excluded-file and other-matter permissions still apply.
  required:
  - path
  additionalProperties: false
---
# Tool: read_file

Read a vault file and return its content and metadata. Follow the model-visible
description for format limits, investigation snapshots, and omitted content.

This Markdown file is a declarative specification. The runtime maps `handler: read_file` to an allow-listed Python function; it does not execute Markdown code.
