---
tool_id: run_research
handler: run_research
description: Run first-pass research and save a reviewable memo.
parameters:
  type: object
  properties:
    matter_id:
      type: string
    question:
      type: string
  required: []
  additionalProperties: false
---
# Tool: run_research

Run the first-pass research workflow and write an inspectable packet.

This Markdown file is a declarative specification. The runtime maps `handler: run_research` to an allow-listed Python function; it does not execute Markdown code.
