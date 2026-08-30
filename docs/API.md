# API summary

Base URL: `http://localhost:8000/api`

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health, provider mode, and vault path |
| GET | `/config` | Workflow and runtime configuration |
| GET | `/matters` | List Kanban matter cards and stages |
| POST | `/matters` | Create a structured matter |
| GET | `/matters/{matter_id}` | Matter orientation, tree, work, decisions, and events |
| GET | `/matters/{matter_id}/conversations` | List saved matter conversations |
| GET | `/matters/{matter_id}/conversations/{conversation_id}` | Read one saved conversation |
| GET | `/daily-conversations` | List saved Today conversations by date |
| GET | `/daily-conversations/{day}` | Read one saved Today conversation |
| PATCH | `/matters/{matter_id}/stage` | Move the matter stage |
| POST | `/matters/{matter_id}/actions` | Approve a response, mark it as sent, or close an eligible matter |
| POST | `/matters/{matter_id}/research?question=` | Run first-pass research |
| POST | `/matters/{matter_id}/upload` | Upload and extract a supported document |
| GET | `/files/tree?path=` | List a vault subtree |
| GET | `/files?path=` | Read file metadata/content |
| PUT | `/files?path=` | Update an editable Markdown or text file |
| GET | `/files/raw?path=` | Serve a native file |
| GET | `/files/review?path=` | Read comments and tracked changes for editable Markdown |
| PUT | `/files/review?path=` | Toggle tracking or add, resolve, accept, or reject review items |
| GET | `/files/export?path=&format=docx\|pdf` | Regenerate a Word or PDF file with native review objects |
| POST | `/chat` | Run bounded agentic chat and tools; one leading `/<skill-id>` applies that skill for this turn, and the saved assistant message includes `applied_skills` |
| GET | `/skills` | List enabled Markdown skills |
| GET | `/skills/questions` | Get the six fixed guided-builder questions in priority order |
| POST | `/skills/draft` | Generate an unsaved skill draft from a goal and answers |
| POST | `/skills/suggestions` | Review recent user messages and return up to three evidence-backed suggestions without saving |
| POST | `/skills` | Create one Markdown skill; rejects duplicate or changed IDs |
| GET | `/skills/{skill_id}` | Read one enabled skill |
| PUT | `/skills/{skill_id}` | Update a skill name, description, or instructions |
| GET | `/decisions` | Global decision register |
| POST | `/decisions` | Record an explicit durable decision; does not close the matter |
| POST | `/decisions/audit` | Run deterministic staleness checks |
| GET | `/automations` | List Markdown schedules and agents |
| POST | `/automations/schedules` | Create a schedule |
| POST | `/automations/schedules/{schedule_id}/run` | Run a schedule now |
| POST | `/automations/agents` | Create a Markdown agent definition |

FastAPI also exposes interactive API documentation at `http://localhost:8000/docs` while the backend is running.

## Continuous Legal Awareness

### Providers and Watches

| Method | Path | Purpose |
|---|---|---|
| GET | `/intelligence/providers` | List key-free native and Polaris capability states |
| GET | `/intelligence/sources` | List configured Watch sources |
| GET | `/watches` | List Watches |
| POST | `/watches/drafts` | Create a disabled Watch draft |
| GET | `/watches/{watch_id}` | Read one Watch from Markdown |
| PATCH | `/watches/{watch_id}` | Update a Watch with `expected_revision` |
| POST | `/watches/{watch_id}/answers` | Save one Watch Builder answer |
| POST | `/watches/{watch_id}/scan` | Scan once without changing cadence or activation |
| POST | `/watches/{watch_id}/activate` | Create or enable the Watch schedule |
| POST | `/watches/{watch_id}/pause` | Disable the Watch schedule |
| GET | `/watches/{watch_id}/runs` | List durable scan runs |

A Watch selects `native`, `polaris`, or `both`. Its editable `public_query` is
not sent directly. The backend validates it and creates an immutable outbound
query first. Source `source_type` is objective. Source `role` is selected for
that Watch: `primary`, `secondary`, `discovery_only`, or `excluded`.

Scan mode comes from saved state: `draft` for a disabled Watch and `manual` for
an enabled Watch. Scan now does not activate a schedule. Both mode can return
HTTP 200 with `status: "partial"` when one provider failed and another returned
useful material. Warnings, source coverage, and successful results remain in
the durable run.

### Briefing

| Method | Path | Purpose |
|---|---|---|
| GET | `/briefing/items` | Query monitored items |
| GET | `/briefing/items/{item_id}` | Read one item and stored provenance |
| PATCH | `/briefing/items/{item_id}` | Set read, saved, or usefulness state |
| POST | `/briefing/items/{item_id}/ask` | Ask about an item and save useful output |
| POST | `/briefing/items/{item_id}/research` | Add research and support states |
| POST | `/briefing/items/{item_id}/connect` | Save to matter, connect to decision, or create follow-up work |
| GET | `/briefing/views` | List saved query views |
| POST | `/briefing/views` | Save a normalized query view |
| PATCH | `/briefing/views/{view_id}` | Rename or update a saved view |
| DELETE | `/briefing/views/{view_id}?expected_revision=` | Delete a saved view |
| POST | `/briefing/views/{view_id}/digest` | Create an immutable dated view snapshot |
| PUT | `/briefing/views/{view_id}/schedule` | Create or update a digest schedule |
| GET | `/briefing/digests` | List digest snapshots |
| GET | `/briefing/digests/{digest_id}` | Read one digest snapshot |

Briefing queries use `q`; repeated `watch`, `source`, `topic`, `jurisdiction`,
`source_type`, `source_role`, and `status`; and scalar `read`, `saved`,
`company_connection`, `packet`, `impact`, `legal_status`, `sort`, `group`,
`view`, `cursor`, and `limit`. Invalid values return 422. Saved views store the
normalized `resolved_query` used to build later digests.

Ask and Research return durable status, useful partial text when available,
warnings, and `supplied`, `retrieved`, `verified`, or `unverified_lead` support.
Only a stored claim-to-excerpt or locator check can produce `verified`.

### Review packets and mitigations

| Method | Path | Purpose |
|---|---|---|
| GET | `/review-packets` | List generated packets |
| GET | `/review-packets/{packet_id}` | Read one packet |
| POST | `/review-packets/{packet_id}/actions` | Record an explicit lawyer outcome |
| GET | `/matters/{matter_id}/mitigations` | List matter mitigations |
| POST | `/matters/{matter_id}/mitigations` | Record a mitigation |
| PATCH | `/matters/{matter_id}/mitigations/{mitigation_id}` | Update a mitigation with `expected_revision` |

Packet actions are `keep_current`, `revise_decision`, `create_follow_up`,
`not_relevant`, and `keep_monitoring`. Opening or cancelling writes nothing.
Keep current appends an outcome and review metadata without replacing the
original decision text. A mitigation needs an explicit record action.

Awareness list responses use `{items, next_cursor, total}` and can include
`resolved_query`. Mutable records use `revision` and `expected_revision`.
Missing records return 404, revision or active-scan conflicts return 409, and
invalid input returns 422.

## Matter work state

Each matter in `GET /matters` and the matter returned by
`GET /matters/{matter_id}` includes the same derived `work_state` object:

```json
{
  "work_state": {
    "next_action": "Confirm the data-retention period",
    "next_work_item_id": "WI-123",
    "next_owner": "Brian Harris",
    "next_actor": "named_owner",
    "due_at": "2026-09-01",
    "execution_state": "not_running",
    "active_run_id": null,
    "execution_note": "",
    "signal": {
      "kind": "waiting_on_owner",
      "label": "Waiting on Brian Harris"
    }
  }
}
```

`next_actor` is one of `themis`, `named_owner`, `unassigned`, `you`, or
`none`. `execution_state` is one of `queued`, `running`, `not_running`, or
`unknown`. The signal kind is one of `overdue`, `agent_working`,
`execution_unknown`, `blocked`, `needs_assignment`, `ready_for_themis`,
`waiting_on_owner`, `waiting_on_you`, or `none`.

The API derives this projection from Markdown on each read. It does not store a
second `work_state` record in Markdown or SQLite.
