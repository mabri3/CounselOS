---
tool_id: complete_work_item
handler: complete_work_item
description: Complete exactly one selected matter work item by its exact ID.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    work_item_id: {type: string}
  required: [work_item_id]
  additionalProperties: false
---
# Tool: complete_work_item

Complete only the selected work item. The current lawyer author is recorded by the runtime.
