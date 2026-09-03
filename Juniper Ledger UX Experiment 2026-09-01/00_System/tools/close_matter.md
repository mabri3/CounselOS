---
tool_id: close_matter
handler: close_matter
description: Close a delivered matter with no open required work. Use only after an explicit closure request in the current message.
parameters:
  type: object
  properties:
    matter_id: {type: string}
  additionalProperties: false
---
# Tool: close_matter

Close the matter only after delivery and required work checks succeed.
