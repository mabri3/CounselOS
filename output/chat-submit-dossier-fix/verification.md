# Dossier and Submit delay repair — September 12, 2026

The affected matter was Harbor 2 (`MAT-20260909-d89ad8`), conversation `CONV-20260909-5299cf`.

## Findings and changes

- The latest run, `RUN-20260912-93c20e`, reached the five-minute model limit during dossier planning. It completed with a fallback setup request, `DOR-20260912-1bfef3`. Research had not started. Seven saved-record reads were recorded. The underlying model timeout remains a possible execution outcome; this change does not promise that every model call will finish.
- The conversation was attached to an alternative approach. The scenario-card filter discarded the dossier setup card. Both the saved run and the transcript had empty card lists despite a successful preparation receipt. The filter now retains dossier setup/progress cards. Conversation reads also recover missing cards from saved receipts, only when the request belongs to that conversation. Reads do not rewrite historical evidence or repeat model work.
- The saved conversation file was 34,524,853 bytes. This exceeded the 32 MiB Markdown cache limit. Submit read and decoded it repeatedly. The existing bounded cache now has a 64 MiB allowance. File-change validation, independent returned data, vault isolation, and cache bounds remain intact.
- Submit now shows “Sending…” immediately. Saved Markdown is memoized separately from busy controls, so changing the controls does not re-render all old replies.
- Background and normal chat polling now apply the saved run state before refreshing conversation/workspace data. Dossier publication callbacks also use the lighter conversation refresh. Read-only chat-run routes use FastAPI's normal synchronous worker path instead of blocking the event loop with file scans.
- Preparation now retains the last useful planner text and record-read warnings when the final answer attempt fails. The existing answer-only retry and fallback issue order remain available.

## Timing evidence

These measurements used an owned local copy of the affected vault, with model execution canceled before it could start. They measure submission preparation and persistence, not model response time. Other validation work was running on the same computer.

| Measurement | Before | After |
| --- | ---: | ---: |
| Unprofiled submission work | 30.111 s | 5.777 s |
| Submission work with Python profiling | 49.803 s | 11.581 s |

The unprofiled sample improved by about 81%. The copy of the live vault was removed after measurement. Timing logs and profiles remain in this folder.

## Validation

- All 1,719 backend tests passed; six existing dependency warnings. Full run: 884.77 seconds.
- The 21 focused dossier recovery, background-work, and vault tests passed.
- Frontend type checking and the production build passed.
- Experimental context, dossier research, and chat-run recovery script checks passed.
- In the browser, a synthetic 106-message conversation accepted typing and displayed “Sending…” while its POST response was deliberately held. The server observed one submitted request.
- After acceptance, the browser showed the dossier planning state and allowed a new draft. After planning completed, the setup controls and “Plan prepared” state appeared while both workspace refresh requests were still deliberately held. The draft survived.
- The normal-chat bug was reproduced with a completed server run still displayed as queued while the workspace response was held. With the fix, the reply appeared and chat/dossier controls became available while the workspace response remained held.
- Reloading the real Harbor 2 chat with the final code showed both previously missing dossier setup cards and no page error. No live model run or research was started for verification.
- An additional saved-material dossier run completed through the isolated fixture API. Its dossier revision and conversation receipt were saved, with no writer error. See `saved-dossier-check.json`.
- The extra browser save check could not continue after the delayed-request fixture stopped reconnecting in the test browser. The fixture API remained healthy; the save was verified through that API instead. The real application reload and the earlier targeted browser delay checks passed.

Temporary browser tabs, test servers, build output, and copied live-vault data were removed. The real development servers and saved user work remain available. The code graph was updated after the final application changes.
