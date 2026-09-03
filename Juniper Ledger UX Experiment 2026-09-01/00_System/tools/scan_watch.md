---
tool_id: scan_watch
handler: scan_watch
description: Save when needed and run one Watch draft scan without activation or scheduling.
parameters:
  type: object
  properties:
    watch_id: {type: string}
    title: {type: string}
    standing_question: {type: string}
    public_query: {type: object}
    purposes: {type: array, items: {type: string}}
    provider: {type: string, enum: [native, polaris, both]}
  additionalProperties: true
---
# Tool: scan_watch

Run one real scan and return checked sources, visible failures, sample Briefing items, and possible review connections. This declarative file does not execute code.
