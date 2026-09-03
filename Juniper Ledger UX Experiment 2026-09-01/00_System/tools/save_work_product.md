---
tool_id: save_work_product
handler: save_work_product
description: Save a recommendation or create or revise a canonical work-product draft.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    title: {type: string}
    content: {type: string}
    kind: {type: string, enum: [recommendation, draft, response]}
    existing_draft_path: {type: string}
  required: [title, content, kind]
  additionalProperties: false
---
# Tool: save_work_product

Save a working recommendation, or create or revise the current canonical draft. Put the full deliverable body in `content`; do not put a description or summary there. When a current canonical draft exists, omitting `existing_draft_path` revises that draft. Passing `existing_draft_path` must name that same current draft. Revision preserves the draft path, identity, and title and records tracked changes. A legacy root work product is read-only. A final, protected record, invalid path, or draft from another matter is rejected. Use finalization to create an immutable final.
