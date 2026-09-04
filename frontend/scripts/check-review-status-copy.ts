import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const component = (name: string) => readFileSync(new URL(`../components/${name}`, import.meta.url), "utf8");

const chat = component("ChatPanel.tsx");
const company = component("CompanyInterview.tsx");
const briefing = component("BriefingReader.tsx");
const packet = component("ReviewPacketPanel.tsx");

for (const [name, source] of [["matter chat", chat], ["company interview", company], ["briefing", briefing]] as const) {
  assert.doesNotMatch(source, /Themis.ai · Not reviewed/, `${name} must not use the old broad review label`);
}

assert.match(chat, /<div className="agent-label">Themis.ai<\/div>/);
assert.match(company, /generatedDraft && !draftEditedByLawyer/, "an untouched generated draft keeps generated attribution");
assert.match(company, /setDraftEditedByLawyer\(true\)/, "editing any company draft must record human involvement");
assert.match(company, /Unsaved lawyer edits to a Themis\.ai draft/, "an edited generated draft must use mixed attribution");
assert.match(company, /Unsaved lawyer edits/, "direct edits to a saved profile must use human attribution");
assert.match(company, /Company profile · Saved/, "a saved profile must have a clear saved-state label");
assert.match(company, /Saved and in use\. No unsaved changes\./, "saved company copy must say it is active");
assert.match(company, /Start replacement interview/, "replacement flow must be explicit");
assert.match(company, /Saved profile remains active\.[\s\S]{0,100}replacement will not be used until you save it/, "replacement interviews must preserve and explain the active saved profile");
assert.match(packet, /packet\.status === "open" \? "Themis.ai · Not yet reviewed by an attorney" : "Themis.ai"/);
assert.doesNotMatch(briefing, /reviewed by an attorney|Themis.ai · Not reviewed/);

console.log("Review status copy checks passed.");
