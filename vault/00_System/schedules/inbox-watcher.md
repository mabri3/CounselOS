---
schedule_id: SCH-DEMO-INBOX
title: Incoming Legal Work Watcher
agent_id: intake-agent
kind: inbox_watch
instructions: Check the intake folder for new files and turn each item into a new
  matter.
interval_seconds: 30
watch_path: 04_Inbox
enabled: true
last_run_at: '2026-08-30T07:55:33+00:00'
next_run_at: '2026-08-30T07:56:00+00:00'
last_status: success
last_message: ''
---
# Incoming Legal Work Watcher

This MVP automation watches `04_Inbox`, creates a matter, preserves the incoming document, and places the matter in Intake.
