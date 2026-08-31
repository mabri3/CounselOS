import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const settings = readFileSync(new URL("../app/settings/page.tsx", import.meta.url), "utf8");
const agents = readFileSync(new URL("../app/agents/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const types = readFileSync(new URL("../lib/types.ts", import.meta.url), "utf8");

for (const provider of ["mock", "openai_compatible", "opencode_go", "codex", "antigravity_cli"]) {
  assert.match(api, new RegExp(`MODEL_PROVIDER_IDS[^;]+["']${provider}["']`), `the catalog must include ${provider}`);
}

assert.match(types, /readiness:\s*ProviderReadiness/, "provider readiness must be typed");
assert.match(types, /readiness_detail:\s*string/, "provider readiness detail must be typed");
assert.match(types, /reasoning_efforts:\s*string\[\]/, "model reasoning efforts must match the API contract");
assert.match(settings, /settings\.model_catalog\.providers\.map/, "Settings must show every model provider");
assert.match(settings, /provider\.models\.map/, "Settings must show each returned model catalog");
assert.match(settings, /provider\.readiness_detail/, "Settings must show honest readiness detail");

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

console.log("Provider administration checks passed.");
