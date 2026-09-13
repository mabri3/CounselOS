# Optional collection agent and OpenCode repair

Implemented a Use collection agent switch in Research settings. Provider, model and reasoning controls share the Model screen's catalog alignment. The switch is off by default; when off, search services and main-model native fallback still run. New research freezes the switch in its saved scope.

When enabled, the selected worker gets only the main agent's public query and a typed search tool. The application executes that tool against configured research services and saves real source results. Worker failures continue through service search and main-model native fallback. The worker does not receive private matter context, determine the legal conclusion or reuse the foreground chat session.

OpenCode fixes: recognize deepseek-v4.1-flash, reuse the CLI's opencode-go credential without copying it into the vault, send a truthful CounselOS User-Agent and stable per-conversation/per-research session headers. The live service returned MissingSessionID before the header fix. Reference: https://opencode.ai/docs/go/#where-can-i-use-it

Checks:
- 71 focused backend tests passed.
- Frontend typecheck and build passed.
- Live browser enabled collection, chose OpenCode Go / deepseek-v4.1-flash / max, saved, reloaded, verified all values, and verified off hides model controls. Prior settings restored afterwards.
- Live direct OpenCode call requested the supplied search tool.
- Live two-call OpenCode round trip consumed a synthetic tool result and returned its exact document title.
- No full Harbor research run was started or old research packet rewritten.
- graphify update and git diff --check passed.

Screenshot: collection-picker.png
