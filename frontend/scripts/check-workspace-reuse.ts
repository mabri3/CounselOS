import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [priorWork, practiceNotes, assumptionWatches, types, exploreStyles] = await Promise.all([
  readFile(new URL("../components/workspace/PriorWorkPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/PracticeNotePanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/AssumptionWatchPanel.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/workspaceTypes.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/workspace/MatterExplore.module.css", import.meta.url), "utf8"),
]);

assert.match(priorWork, /await onSearch\(query\.trim\(\)\)/, "prior work must be searched only on demand");
assert.match(priorWork, /Important differences/, "prior work must show case differences before reuse");
assert.match(priorWork, /candidate\.date[\s\S]*candidate\.status/, "prior work must show source date and status");
assert.match(priorWork, /candidate\.snippet/, "prior work must show the supplied source excerpt");
assert.match(priorWork, /Open source/, "each result must open its original source");
assert.match(priorWork, /await onInclude\(candidate\)[\s\S]*setIncludedPaths/, "prior work may appear included only after the callback succeeds");
assert.match(priorWork, /affects the next inquiry only after you include it/, "search results must not silently enter context");
assert.match(priorWork, /Your query is retained/, "a failed search must retain the query");

assert.match(practiceNotes, /Draft a practice note/, "a correction must start as an explicit draft");
assert.match(practiceNotes, /Review and edit it before you save it as reusable guidance/, "practice-note drafts must remain editable before save");
assert.match(practiceNotes, /await onApply\(skillId\)/, "applying a practice note must use an explicit durable callback");
assert.match(practiceNotes, /applied_revision/, "saved application state must come from the supplied revision");
assert.match(practiceNotes, /Nothing is learned or applied automatically/, "the panel must state the manual learning boundary");
assert.match(practiceNotes, /disabled=\{busy \|\| drafting/, "draft submission must have a local repeat-submit guard");

assert.match(assumptionWatches, /assumptions\.map/, "watch setup must offer named matter assumptions");
assert.doesNotMatch(assumptionWatches, /Assumption IDs to link|One assumption ID per line/, "lawyers must not have to type internal IDs");
assert.match(assumptionWatches, /await onDraft\(allSelected\)/, "only selected assumptions may be linked to a Watch draft");
assert.match(assumptionWatches, /Saving or scanning it does not start a schedule/, "draft and activation states must remain distinct");
assert.match(assumptionWatches, /Inspect status and impact/, "linked Watches must open for state and impact inspection");
assert.match(assumptionWatches, /decision_titles/, "linked decisions must use meaningful supplied labels");
assert.match(types, /assumptions\?: Array<\{ assumption_id: string; text: string \}>/, "the integration seam must supply named assumption choices");
assert.match(types, /date\?: string \| null; status\?: string; kind\?: string; snippet\?: string/, "prior-work source details must be part of the shared contract");

for (const source of [priorWork, practiceNotes, assumptionWatches]) {
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}/, "reuse panels must use shared semantic color tokens");
  assert.match(source, /import styles from "\.\/MatterExplore\.module\.css"/, "reuse panels must bind the shared style module");
  assert.match(exploreStyles, /prefers-reduced-motion[\s\S]*transition: none/, "reuse panels must respect reduced motion");
}

console.log("Workspace reuse checks passed.");
