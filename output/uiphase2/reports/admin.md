# Admin route survey — A-style raster redesign

Date: 2026-09-05  
Routes: `/agents`, `/automations`, `/settings`  
Browser: private Codex in-app browser tab at `http://localhost:3000`  
Scope: read-only UI survey. No agent, schedule, model, provider, vault, identity, or team changes were submitted.

## Route and control scope

The three routes load successfully with the local frontend and backend. The survey found:

- `/agents`: four populated built-in agents. The selected default is Themis.ai. The other populated entries are Decision Monitor, Intake Agent, and Research Agent. All four display application-managed, read-only tool access. The Research Agent is marked development-only because it uses Antigravity CLI.
- `/automations`: no saved schedules. The page shows the empty state and the full new-automation composer. The composer was opened only to inspect controls; it was not submitted.
- `/settings`: Model, Answer contract, Document review, Research, Files and outputs, Model providers, Watch providers, Company, and Vaults sections are populated. Model, research, and document-review sections expose advanced or technical disclosures. Provider status is read-only.

No masked credential, API key, sign-in token, or password was exposed in the UI or included in these captures. Provider screens state that credentials stay outside Themis.ai. The saved company profile is fictional experiment data; its text is visible in the company capture because it is the page's primary content.

## Screenshots

All captures are full-page screenshots from the same private tab. They are saved under `output/uiphase2/screenshots/admin/`.

| File | View | Notes |
| --- | --- | --- |
| `01_agents_built_in_advanced.png` | Themis.ai selected, Advanced controls open | Built-in identity, fixed rules, workspace-default model, standing instructions, effective tool access, file path, start behavior |
| `02_agents_research_advanced.png` | Research Agent selected | Populated built-in detail; development-only warning; model and read-only tool access |
| `03_automations_empty.png` | Empty automation history | No schedules; running/paused/failed counters are absent; prompt bar and New automation control |
| `04_automation_composer.png` | Composer open, hourly cadence | Instruction, name, agent, cadence, and guarded Create action |
| `05_automation_weekly_controls.png` | Composer, weekly cadence | Adds Run on weekday and Run at local time controls |
| `06_settings_model.png` | Model section collapsed | Plain-language current model summary; Advanced model options disclosure; disabled Save/Discard while clean |
| `07_settings_model_advanced.png` | Model advanced options open | Provider, model, reasoning effort controls and help text |
| `08_model_providers.png` | Model provider status | Mock, NeuralWatt, and Codex CLI show Ready; OpenCode Go shows Missing setup; Antigravity CLI shows Development only |
| `09_watch_providers.png` | Watch provider status | Themis.ai native and Polaris show Configured · Ready; provider keys are kept outside the screen |
| `10_research_settings.png` | Research section collapsed | Active route summary: Polaris first, Tavily backup |
| `11_research_advanced.png` | Research advanced controls open | Primary/backup services, model-only fallback, fallback provider/model, timeout, retry count |
| `12_files_outputs.png` | Files and outputs | Source, draft, and final relative vault folders |
| `13_document_review.png` | Document review | Lawyer name and default review author |
| `14_answer_contract.png` | Answer contract | Editable contract body, character counter, last-saved time, disabled clean Save |
| `15_company_saved_profile.png` | Saved company profile | `Company profile · Saved`, version metadata, populated editable fields, replacement-interview action |
| `16_vaults.png` | Vault status | Current vault/path, absolute-path input, disabled Create new vault and Load existing vault controls |

## Admin inventory and redesign notes

### Agents

The left rail gives the agent name, role, and request state first. The main pane then gives role and purpose before model controls. The fixed-rules callout is a good compact record of the three global constraints. Advanced controls correctly group standing Markdown instructions, audience text, tool access, and file path.

Built-in agents expose noninteractive `Available` / `Not available` rows with `Application-managed · Read-only`. The source has a separate editable checkbox branch for custom agents, but the current populated data contains no custom agent. Therefore custom-agent interaction is source-only coverage in this run; no custom screenshot exists. The selected Research Agent confirms the built-in branch and the development-only warning.

The main A-style split is already present: narrow rail plus wide editing surface. A raster redesign should preserve the rail as a stable identity index and use a stronger upper-page title block for name, role, purpose, and state. The long standing-instructions and tool lists are lower-page content and should be split into a lower or advanced image. Keep the fixed-rules callout visible near the upper fold.

### Automations

The empty state is clear and explains that nothing runs on a schedule. The composer begins with a plain-language instruction, then name, agent, and cadence. Hourly is the default. Daily adds local time; weekly adds weekday plus local time. The visible Create action is the only write control and was not used.

There is no actual populated schedule in the current vault, so failed-run history, running cards, paused cards, status words, last/next run facts, Watch/folder links, Pause schedule, Resume schedule, Run it now, and Retry now are source-only coverage for this survey. The source component groups these cards by failed, running, and paused state and provides the stable labels required by the design language. A future raster pass should use one populated fixture for each state, with failed first, and a separate lower image for history/actions.

### Settings

The settings rail provides nine destinations. The Model section leads with the current model in plain language and keeps provider, exact model, and reasoning effort under Advanced model options. Model providers and Watch providers are status pages with disabled Save/Discard controls. This separation is easy to understand.

Research leads with the active route summary and keeps technical routing under Advanced / Technical details. Files and outputs clearly state that paths are relative to each matter and remain inside the vault. Document review exposes lawyer identity and default review author. Answer contract is a long editable Markdown surface with a character count and last-saved timestamp. Company shows a saved profile state and replacement-interview action. Vaults show the current vault and guard empty-path create/load actions with disabled buttons.

The lower page repeats a Local team demonstration block across settings sections. It is clearly labelled as a local simulation and has Save and enable people / Use one lawyer controls. It belongs in a lower image or separate identity/settings slice so it does not compete with the selected settings section. Do not include a populated person-switching example unless the survey explicitly permits that mutation.

## Gaps and image-split recommendations

The current vault does not provide a schedule history example or a custom agent. These are the two largest evidence gaps. A-style raster work should use:

1. Agents upper: rail plus selected agent name, role, purpose, fixed rules, and model summary.
2. Agents lower: expanded advanced controls, standing instructions, effective tool access, and file path. Add a separate custom-agent fixture only if one is made available without mutating this survey vault.
3. Automations upper: populated failed/running/paused summary with failed card first.
4. Automations lower: one card's stable action controls and last/next run facts, plus the composer as a separate state.
5. Settings upper: rail plus current model summary and advanced model options.
6. Settings provider slice: model-provider readiness and Watch-provider readiness, with no credential content.
7. Settings technical slice: research advanced controls and files/document-review rows.
8. Settings content slice: Answer contract and saved Company profile. Keep Vaults as a separate guarded-controls image because its path is long and sensitive-looking.

The screenshots are visual evidence only. No source files, application code, API data, or external services were changed.
