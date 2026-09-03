import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { movePending, researchQuestion, shouldPollResearchQueue } from "../lib/researchQueue.ts";
import type { ResearchRun } from "../lib/types.ts";

assert.equal(researchQuestion(" Saved ", "Entered", "Matter"), "Saved");
assert.equal(researchQuestion("", " Entered ", "Matter"), "Entered");
assert.equal(researchQuestion("", "", " Matter "), "Matter");
const items = [
  { run_id: "active", state: "running" },
  { run_id: "a", state: "queued" },
  { run_id: "b", state: "queued" },
  { run_id: "c", state: "queued" },
] as ResearchRun[];
assert.deepEqual(movePending(items, "b", -1), ["b", "a", "c"]);
assert.equal(items[0].state, "running");
assert.deepEqual(items.map((item) => item.run_id), ["active", "a", "b", "c"]);
assert.deepEqual(movePending(items, "a", -1), ["a", "b", "c"]);
assert.deepEqual(movePending(items, "c", 1), ["a", "b", "c"]);

assert.equal(shouldPollResearchQueue(items), true);
assert.equal(shouldPollResearchQueue([
  { run_id: "first", state: "completed" },
  { run_id: "next", state: "queued" },
  { run_id: "last", state: "running" },
] as ResearchRun[]), true);
assert.equal(shouldPollResearchQueue([
  { run_id: "partial", state: "completed", status: "Partial research is saved." },
  { run_id: "failed", state: "failed" },
  { run_id: "interrupted", state: "interrupted" },
] as ResearchRun[]), false);

const researchPage = readFileSync(new URL("../app/matters/[matterId]/research/page.tsx", import.meta.url), "utf8");
const queuePanel = readFileSync(new URL("../components/ResearchQueuePanel.tsx", import.meta.url), "utf8");
assert.match(researchPage, /ResearchQueuePanel/);
assert.match(researchPage, /shouldPollResearchQueue\(queue\)/);
assert.match(queuePanel, /mode\?: "controls" \| "summary"/);
assert.match(queuePanel, /order \{item\.queue_order/);
assert.match(queuePanel, /item\.run_id/);
assert.match(queuePanel, /Open packet/);
assert.match(queuePanel, /Continue from saved research/, "partial research must offer the safe drafting action");
assert.match(queuePanel, /Partial research is saved/, "partial research must state that its packet is usable");
assert.match(queuePanel, /onContinueFromPartial/, "the queue must expose the safe next action without inventing queue state");
assert.match(queuePanel, /Stop research/, "active research must have a normal stop control");
assert.match(queuePanel, /Resume research/, "interrupted research must have a normal resume control");
assert.match(queuePanel, />Retry</, "failed research must have a retry control");
assert.match(queuePanel, /elapsed/, "running research must show elapsed time");
assert.match(researchPage, /stopResearchQueue/, "the research page must wire the stop API");
assert.match(researchPage, /retryResearchItem/, "the research page must wire the retry API");
for (const stateWord of ["Queued", "Running", "Partial", "Failed", "Interrupted", "Complete"]) {
  assert.match(queuePanel, new RegExp(stateWord));
}
console.log("research queue checks passed");
