---
tool_id: create_work_item
handler: create_work_item
description: Add a work item to the active matter.
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
      description: >-
        Use an explicitly named owner when the user or a supplied source names
        one. Use Themis only when the user assigns the work to the agent or an
        agent run is being created for it. Leave the owner empty when it is
        unknown; do not infer a person from the matter stage or task wording.
        Ask one owner question only when ownership is needed to move the
        matter. Otherwise create useful unassigned work and continue.
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
