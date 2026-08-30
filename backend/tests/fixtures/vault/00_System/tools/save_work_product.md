---
tool_id: save_work_product
handler: save_work_product
description: Save a recommendation, draft, or response through the canonical matter path policy.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    title: {type: string}
    content: {type: string}
    kind: {type: string, enum: [recommendation, draft, response]}
  required: [title, content, kind]
  additionalProperties: false
---
# Tool: save_work_product

Save user-facing work through deterministic matter paths. This tool creates drafts only. Use finalization to create an immutable final.
