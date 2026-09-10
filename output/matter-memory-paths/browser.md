# Browser evidence — isolated fixture

Date: 2026-09-10. UI control: Codex browser tools. Frontend: port 3137. Backend: port 8137. The fixture uses synthetic records, a scripted provider and disabled public research. These checks prove UI and storage behavior. They do not prove model understanding.

## Reproduce

From `backend`, start `.venv/bin/python -m tests.manual.serve_matter_paths`. It prints the temporary vault path. From `frontend`, start `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8137/api npm run dev -- --port 3137`.

Open `/matters/MAT-DEMO-BEACON`, choose Discuss. Open `/experimental/chat?matter=MAT-DEMO-BEACON` for the second view. Fixture commands are `Explore bank custody.`, `Explore timing from the bank option.`, `Compare A, B and C.`, `Correct the actual report: settlement takes two days.`, and `Read late saved evidence.`. These are scripted test commands, not an intent parser shipped in the product.

Use Solution paths to select, compare, promote, restore and read working notes. For an exact comparison in the experimental view, select checkboxes and send the generated message. Stable IDs preserve the selected order. Repeat promotion/restore in each view. Reload with `?conversation=<saved ID>` to inspect a particular regular conversation; the default view opens the most recent conversation.

## Observations

- Regular chat created Bank and Timing alternatives. Timing inherited bank custody and pending agreement. Bank became the current direction. Current approach remained available.
- Regular direct comparison displayed three ordered paths, assumptions and pending conditions. A conversational comparison was also saved.
- An explicit actual correction saved settlement as two days. Restoring Current approach retained that correction.
- The first conversation retained Current approach while the experimental conversation retained Timing. Both showed the same matter direction after reload. The first ID was `CONV-20260910-a18399`; the second was `CONV-20260910-a8ef99`.
- Experimental chat created another Bank/Timing pair, compared it with Current approach, promoted Bank and later restored Current approach. Duplicate titles show a stable short ID to distinguish them.
- Working-note details displayed valid sequence, current task, pending agreement and next action. A note failure never replaced the useful answer in deterministic tests.
- Both views read dense PDF page 99 and continued to page 100. The latter states that the bank must have signed. Both views read OCR page 20. The retained image visibly says “SCAN 20: BANK AGREEMENT IS PENDING.” The image was inspected in a browser tab. Screenshots of the experimental result, the layout defect, and the source image were displayed in the task.
- The source picker distinguishes immutable versions. The earlier scan version had no text on page 20. The resumed version exposed OCR text and an image link.
- Shared matter-paths instructions were edited and saved in the experimental Skills menu. Two later runs captured the new revision. Nine earlier runs retained the original revision. Existing frozen-replay tests cover replay without re-reading the edited skill.
- A synthetic concurrent dossier edit was injected after the transition captured its expected revision. Restoration committed; the dossier remained protected. The UI showed “Dossier: review needed” after restart. The lawyer's sentence remained in the saved dossier.
- Keyboard Enter activated a path-selection button.
- Eleven saved runs produced 33 dispatches. No run has more than one saved assistant answer. Four unique committed transitions remain; three applied the dossier update and one requires review.

## Restart and index rebuild

Stopped only the fixture server. Removed only its `.counsel_os_cache.db*` files. Restarted with `--resume-fixture <printed vault>`. All 65 captured Markdown files had identical hashes before and after rebuilding SQLite. Late-page and OCR reads remained available. Evidence: `browser-pre-rebuild.json`, `browser-post-rebuild.json`, and `recovery.json`.

For the conflict check, the fixture accepts `--projection-conflict-once`. It writes one synthetic lawyer sentence at the projection boundary. It is never enabled in the application.

## Defects found and repaired

1. The fixture's first provider route used the generic mock. Corrected the fixture routing; repeated the actual workflow.
2. Appending a chat message erased conversation working-path metadata. Preserve existing metadata; regression test and browser reload passed.
3. Nested experimental details panels covered other controls. Restrict floating-panel CSS to direct children; reopened Skills and saved its shared revision successfully.
4. Duplicate source versions and path titles looked identical. Added version/ID labels.
5. Dossier status was only a temporary notification. Read the saved transition status on reload and show plain state words.
6. Mainline selection incorrectly used a hypothetical-only UI target. The UI now keeps current-direction work in ordinary matter scope; alternatives retain their explicit path target.

## Limits

Documents were uploaded through the fixture's real ingestion API. Native browser file-input upload was not exercised. Opening target-blank page images did not open a second tab through this browser controller; the exact observed link was opened in a new browser tab and rendered successfully. No live model, live public research, or real-vault behavior was tested. The full 1,000-page and ten 200-page corpus was tested through backend ingestion/search/read; the browser fixture used a dense 100-page document plus 24 mixed/OCR pages.

Both created fixture servers were stopped after verification. The synthetic temporary vault was retained for local review.
