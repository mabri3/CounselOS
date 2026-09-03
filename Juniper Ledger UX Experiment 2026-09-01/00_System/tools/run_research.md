---
tool_id: run_research
handler: run_research
description: Start first-pass research in the background and save a reviewable memo when it finishes.
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

Start the first-pass research workflow as a background run. Return its run status immediately. The saved run record signals completion and links to each inspectable packet.

This Markdown file is a declarative specification. The runtime maps `handler: run_research` to an allow-listed Python function; it does not execute Markdown code.
