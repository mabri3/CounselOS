import assert from "node:assert/strict";

import {
  collectEvidence,
  conversationIdFromPath,
  findConversationPath,
  findFileByName,
  findLatestResearch,
  parseProposedPath,
  participantRoleLabel,
  recommendationSummary,
  safeMatterPath,
  stripEmphasis,
} from "../lib/matter-workspace.ts";
import type { FileNode } from "../lib/types.ts";

const tree: FileNode[] = [{
  type: "folder",
  name: "conversations",
  path: "03_Matters/example/conversations",
  children: [{ type: "file", name: "CONV-20260902-abcdef.md", path: "03_Matters/example/conversations/CONV-20260902-abcdef.md" }],
}, {
  type: "folder",
  name: "research",
  path: "03_Matters/example/research",
  children: [
    { type: "file", name: "RES-1.md", extension: ".md", path: "03_Matters/example/research/RES-1.md" },
    { type: "folder", name: "runs", path: "03_Matters/example/research/runs", children: [{ type: "file", name: "RUN-1.md", extension: ".md", path: "03_Matters/example/research/runs/RUN-1.md" }] },
  ],
}, {
  type: "file",
  name: "request.md",
  path: "03_Matters/example/request.md",
}, {
  type: "folder",
  name: "documents",
  path: "03_Matters/example/documents",
  children: [{ type: "file", name: "launch-plan.pdf", label: "Launch plan", path: "03_Matters/example/documents/launch-plan.pdf" }],
}];

assert.equal(parseProposedPath("# Recommendation\n\n**Working path:** Launch with the reviewed notice. Pending: confirm the deadline."), "Launch with the reviewed notice.");
assert.equal(parseProposedPath("No launch recommendation is saved."), "");
assert.equal(recommendationSummary("# Recommendation\n\n**Use the reviewed launch path.**"), "Use the reviewed launch path.");
assert.equal(recommendationSummary("No recommendation is saved."), "");
assert.equal(stripEmphasis("**Reviewed** _draft_"), "Reviewed draft");
assert.deepEqual(collectEvidence(tree).map((item) => item.path), [
  "03_Matters/example/research/RES-1.md",
  "03_Matters/example/request.md",
  "03_Matters/example/documents/launch-plan.pdf",
]);
assert.equal(safeMatterPath("03_Matters/example/request.md", "03_Matters/example", null), "03_Matters/example/request.md");
assert.equal(safeMatterPath("../outside.md", "03_Matters/example", "fallback.md"), "fallback.md");
assert.equal(conversationIdFromPath("03_Matters/example/conversations/CONV-20260902-abcdef.md"), "CONV-20260902-abcdef");
assert.equal(conversationIdFromPath("03_Matters/example/request.md"), null);
assert.equal(findConversationPath(tree, "CONV-20260902-abcdef"), "03_Matters/example/conversations/CONV-20260902-abcdef.md");
assert.equal(findLatestResearch(tree), "03_Matters/example/research/RES-1.md");
assert.equal(participantRoleLabel("product_owner"), "Product owner");
assert.equal(findFileByName(tree, "request.md"), "03_Matters/example/request.md");
assert.equal(findFileByName(tree, "missing.md"), null);

console.log("Matter workspace helper checks passed.");
