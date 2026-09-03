---
tool_id: create_watch_draft
handler: create_watch_draft
description: Save an editable disabled Watch draft without creating a schedule.
parameters:
  type: object
  properties:
    title: {type: string}
    standing_question: {type: string}
    public_query: {type: object}
    purposes:
      type: array
      items: {type: string, enum: [awareness, company_impact, decision_maintenance]}
    provider: {type: string, enum: [native, polaris, both]}
    sources: {type: array, items: {type: object}}
    internal_scope: {type: object}
    recurrence: {type: object}
    briefing: {type: object}
    review: {type: object}
  required: [standing_question]
  additionalProperties: false
---
# Tool: create_watch_draft

Persist a disabled Watch draft. This declarative file does not execute code.
