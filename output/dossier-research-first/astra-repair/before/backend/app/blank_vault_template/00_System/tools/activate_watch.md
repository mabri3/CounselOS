---
tool_id: activate_watch
handler: activate_watch
description: Explicitly start a saved Watch by creating its schedule and then enabling it.
parameters:
  type: object
  properties:
    watch_id: {type: string}
    schedule_title: {type: string}
    recurrence: {type: object}
  required: [watch_id]
  additionalProperties: false
---
# Tool: activate_watch

Start an existing saved Watch. If schedule creation fails, the handler leaves the Watch disabled. This declarative file does not execute code.
