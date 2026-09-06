import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const settings = readFileSync(new URL("../app/settings/page.tsx", import.meta.url), "utf8");
const agents = readFileSync(new URL("../app/agents/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const stubs = readFileSync(new URL("../lib/stubs.ts", import.meta.url), "utf8");
const types = readFileSync(new URL("../lib/types.ts", import.meta.url), "utf8");

for (const provider of ["mock", "openai_compatible", "opencode_go", "codex", "antigravity_cli"]) {
  assert.match(api, new RegExp(`MODEL_PROVIDER_IDS[^;]+["']${provider}["']`), `the catalog must include ${provider}`);
}
assert.doesNotMatch(api, /MODEL_PROVIDER_IDS[^;]+["']polaris["']/, "Polaris must not appear as an agent model provider");
assert.match(stubs, /research\.primary_external_provider[^\n]+["']polaris["']/, "Polaris must remain available for public research");
assert.match(settings, /provider\.provider_id === ["']polaris["']/, "Watch provider status must still identify Polaris");

assert.match(types, /readiness:\s*ProviderReadiness/, "provider readiness must be typed");
assert.match(types, /readiness_detail:\s*string/, "provider readiness detail must be typed");
assert.match(types, /reasoning_efforts:\s*string\[\]/, "model reasoning efforts must match the API contract");
assert.match(settings, /settings\.model_catalog\.providers\.map/, "Settings must show every model provider");
assert.match(settings, /provider\.models\.map/, "Settings must show each returned model catalog");
assert.match(settings, /provider\.readiness_detail/, "Settings must show honest readiness detail");
assert.match(stubs, /Polaris legal research/, "research services must have plain-language labels");
assert.match(stubs, /Tavily web research/, "the backup service must have a plain-language label");
assert.match(stubs, /OpenAI-compatible model service/, "the model fallback provider must have a human label");
assert.match(settings, /Active research route/, "Research settings must start with a concise active-route summary");
assert.match(stubs, /Advanced \/ Technical details/, "technical research controls must be collapsed by default");
assert.match(settings, /<summary className="setting-help"[^>]*>Technical details<\/summary>/, "raw model IDs and reasoning modes must be collapsed");

const warning = "Development only — do not use confidential matter data.";
assert.match(settings, new RegExp(warning), "Settings must show the Antigravity warning");
assert.match(agents, new RegExp(warning), "Agent editing must show the Antigravity warning");

const modelSection = agents.indexOf('<div className="section-heading">Model</div>');
const advancedSection = agents.indexOf("Advanced controls");
assert.ok(modelSection >= 0 && modelSection < advancedSection, "the Model section must appear before Advanced controls");
assert.match(agents, /<option value="">Use workspace default<\/option>/, "agents must offer workspace-default inheritance");
assert.match(agents, /patch\(\{ provider: "", model: "", reasoning_effort: "" \}\)/, "workspace default must clear all overrides");
assert.match(api, /provider:\s*agent\.provider\s*\?\?\s*""/, "agent saves must include provider selection");
assert.match(api, /model:\s*agent\.model\s*\?\?\s*""/, "agent saves must include model selection");
assert.match(api, /reasoning_effort:\s*agent\.reasoning_effort\s*\?\?\s*""/, "agent saves must include effort selection");
assert.match(agents, /\(unavailable\)/, "saved unavailable selections must remain visible");
assert.match(agents, /draft\.runtime_managed \? "Effective tool access" : "Tool permissions"/, "built-in agents must show effective access instead of editable permissions");
assert.match(agents, /Application-managed · Read-only/, "built-in tool access must be visibly read-only");
assert.match(agents, /checked \? "Available" : "Not available"/, "each built-in tool must show its effective state");
assert.doesNotMatch(agents, /<input checked=\{checked\} disabled=\{draft\.runtime_managed\}/, "custom-agent checkboxes must remain the only tool inputs");
assert.match(agents, /<input checked=\{checked\} onChange=\{\(\) => toggleTool\(tool\.tool_id\)\} type="checkbox" \/>/, "custom agents must retain editable tool checkboxes");

console.log("Provider administration checks passed.");
