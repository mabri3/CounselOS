# Approaches UI repair

The main view now contains compact approach choices, a Details button per choice, and Compare these approaches. Questions, assumptions, direction changes and maintenance controls no longer crowd that view. Notes display readable continuation text instead of serialized internal records.

Browser verification used an isolated synthetic matter, the real frontend and backend, and a scripted model. It exercised chat creation of an alternative, comparison submission and return to chat, opening details, discussion focus, promotion, reload, restoring the prior approach, reading a working note, and archiving an alternative. Actual facts remained byte-identical. A simulated conflict verified that details stay open, refresh, and permit a deliberate retry. No real model charges were incurred in this UI test. The previous Harbor 2 repair separately tested the exact natural-language creation and comparison with Sol Medium.

At 1050 x 1006 with a document open beside chat, the panel measured 385 x 289 pixels. Both choices and the comparison button were visible without scrolling. The screenshot was inspected visually. No browser page errors occurred. See browser-result.json and overview.png.

Testing found and fixed stale detail revisions, controls usable before a chat run finished saving, failed actions closing details, and a composer that accepted text before saved-draft recovery finished. The existing string-based presentation check was updated for the intentionally renamed controls; it is not the evidence for usability. The browser sequence is the behavioral evidence.

The live Harbor 2 panel was checked through its controls, including selecting both paths, preparing a comparison and opening the bank details. No matter action was submitted there during this UI repair. Its model-generated answer from the prior repair remains saved.

Frontend typecheck, production build and presentation check passed. Backend code is unchanged; the preceding full run passed 1,487 tests. The full historical acceptance catalog was not rerun. Graphify was updated. Test servers were stopped, and test-only Next.js configuration changes were restored.

Reproduce: from backend, run `PYTHONPATH=. .venv/bin/python ../output/approaches-ui-fix/serve.py`. Start the frontend with `PHASE2_DIST_DIR=.next-approaches NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8137/api npm run dev -- --port 3137`. Then from backend run `.venv/bin/python ../output/approaches-ui-fix/browser_test.py`. Use a fresh fixture server for each run; the test intentionally changes and archives its synthetic alternative.


## Direct comparison submission
Compare now submits immediately with readable approach titles. Stable ordered IDs travel in the request and frozen model instructions. No generated command enters the composer. Existing drafts and attachments stay saved; unsent attachments are not sent with the comparison.

Validation: 75 focused backend tests passed; frontend typecheck and production build passed. The browser flow used a scripted provider and the real frontend/backend in an isolated vault. It verified one POST per click, structured IDs, no IDs in the visible message, preserved draft, returned chat answer, promotion/restoration, conflict recovery, archive, and unchanged matter facts. This does not measure legal answer quality.
