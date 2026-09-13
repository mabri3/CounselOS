# Experimental chat typing fix — September 12, 2026

The typing delay came from rendering unchanged saved content on each input change.

- The real Harbor conversation had 106 messages, 323,716 displayed message characters, and eight open document tabs.
- Each keystroke rendered the conversation and every mounted document, including hidden tabs. Markdown parsing, source lookup, and document reading views ran again.
- Temporary React profiling measured 514–725 ms of rendering per keystroke and 340 Markdown renderer calls in development Strict Mode. Sequential typing timed out.
- The same page after the fix measured 4.3–5.5 ms per keystroke and zero Markdown renderer calls. All test characters appeared. These are React render times, not total input-to-paint latency. Exact samples are in `performance.json`.

The application change is in `frontend/components/experimental/ExperimentalChat.tsx`. It reuses the rendered conversation and document subtrees until their inputs change. Cached action buttons use the current request handler through a ref. Document context is copied when typing first locks it, rather than on every keystroke. Draft persistence and message submission retain their existing behavior. The temporary profiler and renderer marks were removed. `ClaimMarkdown.tsx` matches its pre-task contents.

Browser checks used the compiled production frontend on port 3204 and the existing deterministic dossier fixture on port 8204. The fixture owns `output/chat-typing-fix/browser-vault` and does not change the active-vault pointer.

- Sequential typing and Shift+Enter worked.
- A two-line unsent message survived reload.
- Selecting a second document kept the first document as the frozen request context, including after reload.
- Enter submitted the exact message once. The reply appeared and the composer cleared.
- A cached Start intake button used a document selected after that button rendered. The saved run records confirmed the current file and context selection.
- Intake-card text survived typing in the main composer.
- An editor inside a cached document panel remained interactive. Its saved update appeared in the reading view.
- The production browser reported no console warnings or errors during these checks.
- After all profiler code was removed, the production build loaded a synthetic 106-message, 321,374-character conversation with two document panels. The complete test sentence appeared in 3.95 seconds of browser-automation pacing, without a timeout or console error. This is a completion check, not a measured hardware typing speed.

Automated checks passed: frontend typecheck, production build, experimental context, dossier research, chat run recovery, Markdown disclosures, and chat section formatting. The first backend command used the system Python, which lacks FastAPI; the suite was restarted with `backend/.venv/bin/pytest -q`. The full backend suite passed: 1,717 tests and six deprecation warnings in 947.91 seconds. The AST-only Graphify update completed.

All browser test submissions and document edits were made in the isolated synthetic vault. Live Harbor profiling only changed unsent text; the latest observed draft was restored. No chat request was submitted there. Chrome loaded a synthetic 106-message, 321,374-character conversation. The native input tool could not target that large page (noWindowsAvailable), so typing in Chrome was not verified. The temporary Chrome tab was closed; the existing user tab remained open.

The temporary browser tabs and owned fixture servers were closed. The normal app still responds on port 3000. The isolated build output was removed, and generated type references use the running development build. Existing unrelated source changes were preserved.
