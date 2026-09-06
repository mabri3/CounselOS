# Phase 2 A-style raster awareness survey

Date: 2026-09-05
Route base: `http://localhost:3000`
Scope: read-only UI survey. No records, schedules, providers, forms, or controls were submitted.

## Coverage result

The live app is in an empty awareness state:

- `/briefing` loaded successfully. It shows 0 developments, 0 items needing review, 0 unread, and 0 saved.
- `/watches` loaded successfully. It shows “No Watches yet.”
- `/watches/new` loaded successfully. The blank builder is safe to open because its effect performs only provider-capability GETs; it creates a record only from `Save draft`, `Scan now`, or `Start Watch`.
- `/briefing/[itemId]` and `/briefing/digests/[digestId]` were source-covered only. No actual item or digest links were present in the live Briefing list, so no identifier was guessed.
- `/watches/[watchId]` was source-covered only. The Watches list had no actual detail link and no watch ID was guessed.

The protected matter `MAT-20260904-abf788` was not opened or changed. No API mutation, scan, save, start, pause, mark, record, generate, provider change, or form submission was performed.

## Screenshot inventory

Screenshots were captured in the owned in-app browser tab during the survey. The CUA runtime exposed screenshot bytes and inline display but no file-write API, so this environment could not persist PNG bytes into `output/uiphase2/screenshots/awareness/`. The captures were:

1. Briefing top: header, explanation, count chips, search, filters, and Apply.
2. Briefing lower: empty development state, Saved views, Digests, and Where this comes from cards.
3. Watches list: empty state and New Watch CTA.
4. New Watch builder top: assignment, public query, purpose, and start of public scope.
5. New Watch builder lower: cadence, briefing/review behavior, and the three distinct actions.
6. New Watch cadence control focused with Daily selected.
7. New Watch Default attention control focused with Monitor selected.

Follow-up persistence retry: the CUA browser surface was unavailable after the tab was closed (`getState()` returned no browser surfaces), so the earlier inline captures could not be reopened and written as PNG files in this turn.

## Control inventory

### Briefing

Navigation: Today, Briefing, Workspace, Matters, Decisions, Skills, Automations, Agents, Settings.

Read-only controls: Search these developments; Show (Everything, Unread only, Already read); Saved (Everything, Saved only, Not saved); Order by (Newest first, Best match, Biggest potential impact, Primary sources first, Soonest effective date, Unread first, Connected to a decision); Group by (Don't group, Watch, Topic, Source, Jurisdiction, Date, Product, Affected decision); Apply; Narrow this further disclosure.

Write-capable controls visible despite the empty state: Save this view. The side rail also documents future write actions for saved views and digests: Make a digest now, Digest daily at 8 AM, Rename, Delete. None were invoked.

### Watches list

Read-only navigation: New Watch. Empty state text explains that a Watch is a standing question re-asked of public sources on a schedule and that results arrive in Briefing.

### New Watch builder

Assignment: Watch title, Standing question, Public query, and Purpose checkboxes (Awareness selected by default; Company impact; Decision maintenance).

Public topics and scope: Keywords, Topics, Jurisdictions, Regulators, Courts, Industries.

Named sources and roles: Add named source. Source type and Watch role are presented as separate concepts in the UI help text. Source roles in source/design language are Primary, Secondary, Discovery only, and Excluded.

Provider: Themis.ai native, Polaris, Both. These are state-changing form controls and were not changed.

Internal matching scope: Product ids, Company paths, Matter ids, Decision ids, Mitigation ids, Lookback days (90).

Cadence and time zone: Manual only, Interval, Daily, Selected weekdays; Local time (08:00); IANA time zone (America/Los_Angeles). The cadence menu was opened only to inspect its options; no option was selected.

Briefing and review behavior: Create Briefing items (checked), Create a digest (unchecked), Create review connections when company work may be affected (checked), Default attention (Monitor). The attention menu was opened only to inspect its options; no option was selected.

Action row: Save draft, Scan now, Start Watch. The help text correctly states that Start Watch alone enables a schedule and Scan now saves first without activating one. These were not invoked.

## Read/write behavior from source

`frontend/components/BriefingReader.tsx` loads an item or digest with GET calls. Opening an item does not mark it read. Mark as read/unread, Save for later, Not useful, Ask Themis.ai, connect, and research each have explicit PATCH or POST actions. Digest loading fetches the digest and each referenced item with GET calls. The item and digest pages therefore appear safe to open if an actual link exists.

`frontend/components/WatchBuilder.tsx` loads provider capabilities, an existing watch, and run history with GET calls. New builder opening does not create a draft. `Save draft` creates or updates, `Scan now` saves and scans, `Start Watch` activates, and `Pause schedule` pauses. Existing detail opening is read-only at load time, but no live watch ID was available.

## Suggested screen splits for A-style raster designs

1. Briefing overview: header plus count chips and filter bar.
2. Briefing empty/side rail: empty result state with Saved views, Digests, and source explanation.
3. Briefing populated list: one required packet, one unread briefing-only item, and one saved item.
4. Briefing item reader: state chips, facts, why shown, connection, provenance disclosure, and action rail.
5. Digest reader: fixed-date banner, digest summary, multiple item cards, and missing-item warning state.
6. Watches index: populated Watch rows with status word, provider, cadence, latest run, and attention.
7. Watch Builder assignment: title, internal question, public query, purpose.
8. Watch Builder sources/provider: named source editor, source type/role, provider warnings.
9. Watch Builder scope/cadence: private matching scope, lookback, cadence, time zone.
10. Watch Builder review/actions: briefing behavior, default attention, distinct Save/Scan/Start actions, and scan preview.
11. Watch detail healthy/active: saved record, active schedule, run history, and Pause schedule.
12. Watch detail partial/failure: provider warning, Partial scan result, source coverage, and retained useful output.

## Missing populated states

The live data does not expose a Briefing item, required review packet, saved view, digest, Watch, scan preview, run history, provider warning, Partial result, source-role row, or active/paused watch detail. These must be supplied by a safe fixture or a resettable test dataset before visual evaluation of populated A-style screens. The empty states are real and were captured.
