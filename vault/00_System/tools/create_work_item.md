---
tool_id: create_work_item
handler: create_work_item
description: Create a typed work item in the active matter.
parameters:
  type: object
  properties:
    matter_id:
      type: string
    title:
      type: string
    description:
      type: string
    item_type:
      type: string
    status:
      type: string
    priority:
      type: string
    owner:
      type: string
    due_at:
      type: string
    required:
      type: boolean
  required:
  - title
  additionalProperties: false
---
# Tool: create_work_item

Create a typed work item in the active matter.

This Markdown file is a declarative specification. The runtime maps `handler: create_work_item` to an allow-listed Python function; it does not execute Markdown code.
