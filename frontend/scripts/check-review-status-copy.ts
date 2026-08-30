import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const component = (name: string) => readFileSync(new URL(`../components/${name}`, import.meta.url), "utf8");

const chat = component("ChatPanel.tsx");
const company = component("CompanyInterview.tsx");
const briefing = component("BriefingReader.tsx");
const packet = component("ReviewPacketPanel.tsx");

for (const [name, source] of [["matter chat", chat], ["company interview", company], ["briefing", briefing]] as const) {
  assert.doesNotMatch(source, /Themis · Not reviewed/, `${name} must not use the old broad review label`);
}

assert.match(chat, /<div className="agent-label">Themis<\/div>/);
assert.match(company, /saved \? "Company profile · Saved" : "Themis · Not yet reviewed by an attorney"/);
assert.match(packet, /packet\.status === "open" \? "Themis · Not yet reviewed by an attorney" : "Themis"/);
assert.doesNotMatch(briefing, /reviewed by an attorney|Themis · Not reviewed/);

console.log("Review status copy checks passed.");
