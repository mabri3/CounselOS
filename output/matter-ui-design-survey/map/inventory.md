# Decision map live survey

Root Astra inspected the in-app browser on 2026-09-05. Separate tab; no native browser or viewport change. No saved writes, analysis, chat, or fact correction submitted.

## Observed controls and states

- Header: Back to matter (same conversation query), full business question, Agent analysis stays proposed.
- Local neighborhood: seven records around business question. Whole matter: 34 records. Separate native controls; switch inspected.
- Zoom out/in, Fit map, Reset view; Fit inspected. Whole-matter fit reaches 10%, making labels unreadable; outline is essential. Local label truncation retains full accessible names/details.
- Clickable visual record selects details. Selected issue has full title, Open, Clear selection, Discuss this path, Try a different assumption, Back to issue.
- Hypothetical panel opens inline, with Current reported fact selector (12 supplied/answered entries plus No linked fact), one-change-per-line value, analysis question, Analyze scenario, Cancel. Empty saved scenario list. No analysis run. The panel explicitly separates actual facts from hypotheses.
- Correct a fact disclosure opens actual-fact selector, corrected text, explicit Correct a fact submit. Opened only; never submitted.
- Whole map outline is collapsed as Map outline (34 records). Expanded and scrolled. Full record titles, types, states, Discuss this path per row, Visible relationships with labels and Active status.
- Entire shared conversation follows map/outline; original intake, answered history, action cards with record links, latest answer. Bottom contains Save current work product, two suggested questions, Add files, composer, disabled empty Send, Build a skill. No action submitted.
- Back to issue clicked from selected beneficial-owner issue. Follow-up capture records resulting matter state.
- Console error log empty at inspection.

## Design consequences

Use A-style compact rows and clear section navigation. Keep visual map, outline, selected detail, scenario panel, and conversation accessible as distinct reading areas. Full 34-record overview needs grouping or outline-first navigation; fitting a very tall two-column graph gives unusably small labels. Keep the hypothetical form visually separate from real fact correction. Do not display a sample recommendation as a recorded decision. Existing legal analysis was not verified and must not be repeated as an authoritative conclusion.

## Evidence

Screenshots 01 through 12 in this directory capture overview, map, scenario form, fact-correction disclosure, fit, outline, bottom composer, and return. `local-dom.txt`, `whole-dom.txt`, `hypothetical-dom.txt` retain complete visible control inventories. No saved scenarios or claim-support records were available here; populated designs must be labeled sample content or supported by prior isolated-fixture evidence. Pan, every zoom increment, analysis submit, adoption, saving scenarios, real correction, sending, and document saving were not exercised in this read-only survey.
