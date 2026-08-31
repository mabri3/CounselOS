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

Save a working recommendation, or create a canonical draft. To revise an existing canonical draft, pass its `existing_draft_path`. Revision preserves the draft path, identity, and title and records tracked changes. A final, protected record, invalid path, or draft from another matter is rejected. Use finalization to create an immutable final.
