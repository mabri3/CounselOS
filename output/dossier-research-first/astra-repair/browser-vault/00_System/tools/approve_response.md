---
tool_id: approve_response
handler: approve_response
description: Approve one immutable final response. Use only after an explicit approval request in the current message.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    artifact_path: {type: string}
    work_item_id: {type: string}
  required: [artifact_path]
  additionalProperties: false
---
# Tool: approve_response

Approve the selected immutable final. An optional exact approval work item completes only after approval succeeds.
