# Research fallback repair

- Research service failures or empty results now fall back to the saved main model type's native web search.
- Native discovery uses an independent ephemeral session and only the approved public query; it does not continue the lawyer's chat session.
- If the main planning call fails before any search request, recovery tries the saved public topic before answer-only synthesis.
- Fallback calls and results are checkpointed. Failed completed attempts do not repeat automatically.
- External-source authorization remains required. An unavailable native capability preserves a useful answer with a recorded retrieval gap.
- Research already runs in a separate asyncio task with its own run ID, frozen context, checkpoints and origin conversation. This is a background research task, not another visible chat in History.
- Settings removes the model-only fallback switch and labels the cheap model as the collection model. Legacy configuration keys remain compatible.

## Evidence

- Live Settings browser check passed; screenshot: fallback-settings.png.
- Frontend typecheck and production build passed.
- Live native Codex / gpt-5.6-sol / medium search completed in a separate session. Public query: state money transmitter license asset purchase transfer regulator guidance.
- It returned source URLs from CSBS, New Jersey DOBI and Washington's legislature. This smoke test verifies discovery, not legal conclusions or a new Harbor research packet.
- Fixture tests cover failed services -> main-model native retrieval, no repeated recovery, failed native attempt preservation, denied external scope, and background task responsiveness.
- Historical Harbor packets remain unchanged by this repair; no new full Harbor research run was submitted.
