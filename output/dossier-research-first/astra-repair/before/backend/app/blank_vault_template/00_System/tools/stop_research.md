---
tool_id: stop_research
handler: stop_research
description: Stop queued or running research for the active matter while keeping saved packets.
parameters:
  type: object
  properties: {}
  additionalProperties: false
---
# Tool: stop_research

Stop only the active matter's queued or running research. Keep every saved packet and return the durable queue state.

This Markdown file is a declarative specification. The runtime maps `handler: stop_research` to an allow-listed Python function; it does not execute Markdown code.
