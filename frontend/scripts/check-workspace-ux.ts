import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import type { VaultDocument } from "../lib/types.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");
const cardLogic = readFileSync(new URL("../lib/chatCardLogic.ts", import.meta.url), "utf8");
const chat = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const design = readFileSync(new URL("../lib/design.ts", import.meta.url), "utf8");
const companyInterview = readFileSync(new URL("../components/CompanyInterview.tsx", import.meta.url), "utf8");
const modal = readFileSync(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
const researchSource = readFileSync(new URL("../lib/research.ts", import.meta.url), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types";\n/, "")
  .replace(/import \{ formatDateTime \} from "\.\/design";\n/, "const formatDateTime = (value: string) => value;\n");
const researchModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(researchSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as { parseMemo: (document: VaultDocument) => ReturnType<typeof import("../lib/research.ts")["parseMemo"]> };

assert.doesNotMatch(form, /legal_owner:\s*"Brian Harris"/, "new matters must not invent a legal owner");
assert.match(form, /document_review\.lawyer_name/, "new matters must use the configured document-review lawyer");
assert.match(form, /Create matter and open Chat/, "matter creation must say what it creates and where it opens");
assert.match(workspace, /control\.id === "review_intake"[\s\S]{0,120}openDocument\(requestPath\)/, "Review intake must open the original request");
assert.match(workspace, /saveWorkProductDraft/, "manual drafts must use the canonical typed API");
assert.match(workspace, /finalizeWorkProduct/, "Overview must expose direct finalization");
assert.match(workspace, /completeWorkItem/, "Overview must complete an identified work item directly");
assert.match(workspace, /updateMatterRisk/, "risk changes must persist directly");
assert.match(workspace, /startResearchRun\(detail\.matter_id\)/, "matter research action must start a background run");
assert.match(workspace, /getResearchRun\(detail\.matter_id, researchRun\.run_id\)/, "matter research action must follow the durable run signal");
assert.doesNotMatch(workspace, /await runResearch\(detail\.matter_id\)/, "matter research action must not block on synchronous research");
assert.match(chat, /saveWorkProductDraft/, "Save as work product must call the canonical typed API directly");
assert.doesNotMatch(chat, /submit\(`Save this as work product:/, "Save as work product must not prepare another chat turn");
assert.match(workspace, /loadRecommendation/, "matter and chat refreshes must reload the recommendation record");
assert.match(cards, /detailRequired/, "single-choice clarification options must request detail");
assert.match(cards, /selectedDetail/, "single-choice clarification detail must be submitted with the selected value");
assert.match(workspace, /detail\.intake_conversation_id \|\| detail\.intake_state === "active" \? "chat" : "overview"/, "new intake matters must land with Chat open");
assert.match(workspace, /initialConversationId=\{detail\.intake_conversation_id\}/, "the workspace must open the durable intake conversation");
assert.match(workspace, /initialRunId=\{detail\.intake_run_id\}/, "the workspace must reconnect to the initial intake run");
assert.match(chat, /Themis.ai is reading your request…/, "the initial intake run must have a clear reading state");
assert.match(chat, /agent_id:\s*chatAgentId\(intakeActive, activeAgentId\)/, "chat must route turns through the active intake or copilot agent");
assert.match(design, /matterAwaitsJudgment\([\s\S]{0,160}matter\.status === "explore"/, "judgment counts must include overdue matters in the Explore stage");
assert.match(companyInterview, /generatedDraft && !draftEditedByLawyer[\s\S]{0,180}"Themis\.ai · Not yet reviewed by an attorney"/, "an untouched generated company draft must keep generated attribution");
assert.match(companyInterview, /setDraftEditedByLawyer\(true\)[\s\S]{0,150}setSaveState\("dirty"\)/, "editing a generated review draft must record lawyer involvement");
assert.match(companyInterview, /Unsaved lawyer edits to a Themis\.ai draft/, "an edited generated company draft must use mixed attribution");
assert.match(cardLogic, /:\s*"Follow-up"/, "questions without real progress must say Follow-up");
assert.doesNotMatch(cards, /progress_current=1|progress_total=3/, "question progress must not use a fixed total");
assert.match(modal, /await onRecorded\(\);\s*setRecorded\(true\)/, "success must follow both decision creation and matter reload");
assert.match(modal, /Decision recorded\. The refreshed matter/, "decision recording must expose a persisted success state");
assert.match(modal, /created \? "Retry refresh"/, "a failed reload must not create a duplicate decision on retry");
assert.match(workspace, /basisLabels=\{Object\.fromEntries\(evidence\.map/, "decision evidence must receive saved matter titles");
assert.match(modal, /basisLabel\(path, basisLabels\)/, "decision evidence must display supplied saved titles");

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
assert.equal(memo.citations[0].kind, "Internal matter support");
assert.doesNotMatch(memo.citations[0].quote, /request_id|matter_id|---/);
assert.doesNotMatch(memo.citations[0].note, /03_Matters|Stored in the vault/);
assert.equal(memo.citations[1].name, "Agency guidance");
assert.match(memo.citations[1].kind, /https:\/\/example\.com\/guidance/);

console.log("Matter workspace UX checks passed.");
