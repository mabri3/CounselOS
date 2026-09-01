---
tool_id: mark_response_sent
handler: mark_response_sent
description: Record that the approved response was delivered outside Themis.ai. Use only after an explicit delivery request in the current message.
parameters:
  type: object
  properties:
    matter_id: {type: string}
    note: {type: string}
  additionalProperties: false
---
# Tool: mark_response_sent

Record an outside delivery. This tool does not send a response.
