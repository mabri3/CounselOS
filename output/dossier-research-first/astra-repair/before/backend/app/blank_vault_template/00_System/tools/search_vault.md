---
tool_id: search_vault
handler: search_vault
description: >-
  Search indexed .md and .txt contents, including Markdown metadata, in the allowed
  vault scope. Split query on whitespace; terms of one character are ignored.
  Each remaining term matches a case-insensitive substring, not a whole word.
  ANY term can match. Results rank by summed occurrence counts, then path, with
  at most 10 results before excluded-file filtering. There is no phrase, Boolean,
  regex, stemming, or semantic-search syntax; quotes and punctuation are literal
  parts of terms, and AND/OR are ordinary search terms. Use a few distinctive
  terms, not a long question. Narrow path to a known document/folder when unrelated
  records dominate. Snippets collapse whitespace and cover at most 480 source
  characters around the first match; they are not complete passages or offsets
  for reading. Empty results mean no visible indexed match for this query/scope,
  not that authority is absent. Simplify/rephrase the query or list/read a known
  file. Read the needed source text before attributing support.
parameters:
  type: object
  properties:
    query:
      type: string
      description: Nonempty whitespace-separated terms; case-insensitive substring matching with ANY-term results. One-character terms are ignored. No operators or phrase syntax.
    path:
      type: string
      description: Optional vault-relative file or folder. Defaults to the current matter when present. Scope and excluded-file permissions still apply; not a URL or source ID.
  required:
  - query
  additionalProperties: false
---
# Tool: search_vault

Use the query and scope rules in the model-visible description above. Search hits
are relevance previews. A no-match does not prove that a legal rule is absent.

This Markdown file is a declarative specification. The runtime maps `handler: search_vault` to an allow-listed Python function; it does not execute Markdown code.
