# Archive and trash

Open **Archive & trash** from the chat sidebar or Matters page.

- **Archive** hides a matter and its tasks from active lists. Its folder, stage,
  decisions, files, and history stay in place. Archived knowledge remains searchable.
- **Move to trash** moves the whole folder to `99_Trash/<matter_id>/` in the
  current vault. Trash is excluded from matter lists and text search.
- **Restore** returns a trashed folder to its original path and makes the
  matter active. Restoring an archived matter makes it active without moving it.
- Nothing is permanently deleted. Restore never overwrites an occupied folder.
- Running work in the vault must finish or stop before Archive or Move to
  trash. This includes intake startup and scheduled work. Queued chat or
  research on this matter also blocks these changes.
- Schedules that target an archived or trashed matter skip execution. Restore
  makes those schedules eligible again; their definitions are not changed.

`matter.md` stores `archived_at`, `trashed_at`, and `trashed_from`. SQLite is
rebuilt after a change. Child files are not rewritten, so their original links
and history still work after restoration. A failed move or index rebuild rolls
back the folder and root record.

## Verification

`backend/tests/test_matter_storage.py` covers storage states, file preservation,
search exclusion, repeated actions, active runs, path validation, restore
collisions, rollback, schedules, and HTTP routes.

Browser check uses `output/matter-storage/serve_fixture.py`, which copies the
committed fixture vault to a temporary directory. It never uses the active
vault pointer. A separate frontend on port 3118 targets that server on 8118.
The checked flow is Active → Archive → Archived → Move to trash → Trash →
Restore → Active. The restored fixture returns to its original folder.
