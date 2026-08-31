import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import type { VaultDocument } from "../lib/types.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");
const cardLogic = readFileSync(new URL("../lib/chatCardLogic.ts", import.meta.url), "utf8");
const chat = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const modal = readFileSync(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
const researchSource = readFileSync(new URL("../lib/research.ts", import.meta.url), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types";\n/, "")
  .replace(/import \{ formatDateTime \} from "\.\/design";\n/, "const formatDateTime = (value: string) => value;\n");
const researchModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(researchSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as { parseMemo: (document: VaultDocument) => ReturnType<typeof import("../lib/research.ts")["parseMemo"]> };

assert.doesNotMatch(form, /legal_owner:\s*"Brian Harris"/, "new matters must not invent a legal owner");
assert.match(form, /document_review\.lawyer_name/, "new matters must use the configured document-review lawyer");
assert.match(workspace, /control\.id === "review_intake"[\s\S]{0,120}openDocument\(requestPath\)/, "Review intake must open the original request");
assert.match(workspace, /loadRecommendation/, "matter and chat refreshes must reload the recommendation record");
assert.match(cards, /detailRequired/, "single-choice clarification options must request detail");
assert.match(cards, /selectedDetail/, "single-choice clarification detail must be submitted with the selected value");
assert.match(workspace, /detail\.intake_conversation_id \|\| detail\.intake_state === "active" \? "chat" : "overview"/, "new intake matters must land with Chat open");
assert.match(workspace, /initialConversationId=\{detail\.intake_conversation_id\}/, "the workspace must open the durable intake conversation");
assert.match(workspace, /initialRunId=\{detail\.intake_run_id\}/, "the workspace must reconnect to the initial intake run");
assert.match(chat, /Themis is reading your request…/, "the initial intake run must have a clear reading state");
assert.match(chat, /agent_id:\s*chatAgentId\(intakeActive, activeAgentId\)/, "chat must route turns through the active intake or copilot agent");
assert.match(cardLogic, /:\s*"Follow-up"/, "questions without real progress must say Follow-up");
assert.doesNotMatch(cards, /progress_current=1|progress_total=3/, "question progress must not use a fixed total");
assert.match(modal, /await onRecorded\(\);\s*setRecorded\(true\)/, "success must follow both decision creation and matter reload");
assert.match(modal, /Decision recorded\. The refreshed matter/, "decision recording must expose a persisted success state");
assert.match(modal, /created \? "Retry refresh"/, "a failed reload must not create a duplicate decision on retry");

const memo = researchModule.parseMemo({
  path: "03_Matters/example/research/RES-1.md",
  name: "RES-1.md",
  kind: "markdown",
  editable: true,
  metadata: {},
  content: [
    "# Research",
    "",
    "- Internal: `03_Matters/example/request.md` — --- request_id: REQ-1 matter_id: MAT-1 original_text_preserved: true --- # Request A clean customer request.",
    "- External: [Agency guidance](https://example.com/guidance) — The agency explains the rule.",
  ].join("\n"),
} as VaultDocument);

assert.equal(memo.citations[0].name, "Original request");
assert.equal(memo.citations[0].kind, "Matter document");
assert.doesNotMatch(memo.citations[0].quote, /request_id|matter_id|---/);
assert.doesNotMatch(memo.citations[0].note, /03_Matters|Stored in the vault/);
assert.equal(memo.citations[1].name, "Agency guidance");
assert.match(memo.citations[1].kind, /https:\/\/example\.com\/guidance/);

console.log("Matter workspace UX checks passed.");
