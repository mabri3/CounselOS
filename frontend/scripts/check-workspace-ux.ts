import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import type { VaultDocument } from "../lib/types.ts";
import { createLatestRequestLoader } from "../lib/latestRequest.ts";
import { beginPendingAction, endPendingAction } from "../lib/pendingActions.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");
const cardLogic = readFileSync(new URL("../lib/chatCardLogic.ts", import.meta.url), "utf8");
const chat = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const matterActions = readFileSync(new URL("../lib/matterActions.ts", import.meta.url), "utf8");
const design = readFileSync(new URL("../lib/design.ts", import.meta.url), "utf8");
const board = readFileSync(new URL("../components/StageBoard.tsx", import.meta.url), "utf8");
const mattersTable = readFileSync(new URL("../components/MattersTable.tsx", import.meta.url), "utf8");
const mattersPage = readFileSync(new URL("../app/matters/page.tsx", import.meta.url), "utf8");
const matterPage = readFileSync(new URL("../app/matters/[matterId]/page.tsx", import.meta.url), "utf8");
const companyInterview = readFileSync(new URL("../components/CompanyInterview.tsx", import.meta.url), "utf8");
const modal = readFileSync(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
const matterWorkspaceSource = readFileSync(new URL("../lib/matter-workspace.ts", import.meta.url), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types";\n/, "");
const matterWorkspaceModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(matterWorkspaceSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as typeof import("../lib/matter-workspace.ts");
const researchSource = readFileSync(new URL("../lib/research.ts", import.meta.url), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types";\n/, "")
  .replace(/import \{ formatDateTime \} from "\.\/design(?:\.ts)?";\n/, "const formatDateTime = (value: string) => value;\n");
const researchModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(researchSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as { parseMemo: (document: VaultDocument) => ReturnType<typeof import("../lib/research.ts")["parseMemo"]> };

assert.doesNotMatch(form, /legal_owner:\s*"Brian Harris"/, "new matters must not invent a legal owner");
assert.match(form, /document_review\.lawyer_name/, "new matters must use the configured document-review lawyer");
assert.match(form, /Create matter and open Chat/, "matter creation must say what it creates and where it opens");
assert.match(board, /Consistency issue:/, "the board must name deterministic consistency issues");
assert.match(board, /Review matter/, "the board must link each consistency issue to review");
assert.match(board, /Repair safe stage mismatch/, "the board must expose the explicit safe repair control");
assert.match(mattersTable, /Consistency issue:/, "the matter table must name deterministic consistency issues");
assert.match(mattersTable, /Review matter/, "the matter table must link each consistency issue to review");
assert.match(mattersPage, /Repair safe stage mismatch/, "the grouped matter view must expose the safe repair control");
assert.match(design, /final_with_pre_respond_stage:\s*"Current final is before Ready to send"/, "consistency codes must have stable lawyer-facing labels");
assert.match(design, /approval_without_current_final:\s*"Approval is not tied to the current final"/, "approval conflicts must have a stable label");
assert.match(design, /delivery_without_approved_artifact:\s*"Delivery has no approved artifact"/, "delivery conflicts must have a stable label");
assert.match(design, /closed_without_required_lifecycle_fields:\s*"Closed lifecycle record is incomplete"/, "closure conflicts must have a stable label");
assert.match(design, /issue\.code === "final_with_pre_respond_stage"/, "only the derived stage mismatch may be repaired from list surfaces");
assert.match(mattersTable, /background:\s*role\.attentionTint,\s*color:\s*role\.attentionDeep/, "consistency warnings must use shared attention colours with a state word");
assert.match(workspace, /control\.id === "review_intake"[\s\S]{0,120}openDocument\(requestPath\)/, "Review intake must open the original request");
assert.match(workspace, /saveWorkProductDraft/, "manual drafts must use the canonical typed API");
assert.match(workspace, /finalizeWorkProduct/, "Overview must expose direct finalization");
assert.match(workspace, /completeWorkItem/, "Overview must complete an identified work item directly");
assert.match(workspace, /updateMatterRisk/, "risk changes must persist directly");
assert.match(workspace, /startResearchRun\(detail\.matter_id,\s*directResearchQuestion\)/, "matter research action must send a non-empty question to the background run");
assert.match(workspace, /const directResearchQuestion = \[[\s\S]{0,400}detail\.title[\s\S]{0,160}\.find\(Boolean\) \?\? detail\.title/, "matter research must fall back through saved context and finally the non-empty matter title");
assert.doesNotMatch(workspace, /startResearchRun\(detail\.matter_id\s*\)/, "the visible research action must not use the obsolete empty one-argument call");
assert.match(workspace, /getResearchQueue\(detail\.matter_id\)/, "matter research must load the full durable queue");
assert.match(workspace, /shouldPollResearchQueue\(researchQueue\)/, "matter research must poll queued or running work");
assert.match(workspace, /<ResearchQueuePanel\s+items=\{researchQueue\}\s+mode="summary"/, "the overview must show the research queue summary");
assert.match(workspace, /required open · \{optionalOpenWorkItems\.length\} optional open/, "the queue count must split required and optional work items");
assert.doesNotMatch(cards, /Finalize saved draft/, "chat work-product cards must not repeat the overview finalization action");
assert.doesNotMatch(
  workspace,
  /\}, \[[^\]]*\bresearchQueue\b[^\]]*\]\);/,
  "the research poll must be gated on a boolean, not on the queue array, or every poll restarts the effect",
);
assert.match(
  workspace,
  /const researchQueueActive = shouldPollResearchQueue\(researchQueue\);/,
  "the research poll gate must be a stable boolean",
);
assert.match(
  workspace,
  /\.catch\(\(caught\) => \{[\s\S]{0,240}window\.setTimeout\(check, 2000\);[\s\S]{0,80}\}\);/,
  "a temporary queue-read failure must schedule another bounded poll",
);
assert.match(workspace, /try \{\s*await loadResearchQueue\(\);[\s\S]{0,700}Research started in the background\. You can continue working while it runs\./, "starting research must reload the full queue before showing the normal background notice");
assert.match(workspace, /const startedResearchRun = await startResearchRun/, "a started durable research run must remain available when queue refresh fails");
assert.match(workspace, /Research started in the background\. Server work continues/, "a queue-read failure after a successful start must state that work continues");
assert.match(workspace, /setResearchQueue\(\(current\) => current\.some\(\(item\) => item\.run_id === startedResearchRun\.run_id\)/, "a queue-read failure must retain the durable active run for the next queue poll");
assert.match(workspace, /currentControl\.id === "run_research" && researchQueueActive/, "a durable active research run must block duplicate starts");
assert.match(workspace, /RecommendationPanel/, "recommendation paths must use the typed recommendation panel");
assert.match(workspace, /const recommendationSelected = Boolean\(activePath && \[recommendationPath, recommendationState\?\.path\]/, "the active recommendation path must route separately");
assert.match(workspace, /recommendationSelected \? recommendationState \? <RecommendationPanel[\s\S]{0,500}: <DocumentPanel/, "the recommendation route must not render DocumentPanel");
assert.match(workspace, /Open recommendation/, "the overview must link directly to the recommendation");
assert.match(workspace, /Dossier · Review required/, "a dossier projection conflict must keep the main save successful and show its state");
assert.match(workspace, /Review dossier update/, "a dossier projection conflict must have a direct review link");
assert.match(workspace, /Work saved; dossier did not refresh\./, "a projection exception must show a refresh failure without claiming a revision exists");
assert.match(workspace, /projection\.state === "review_required" && projection\.revision_path/, "only a real dossier revision may show the review link");
assert.match(workspace, /Approved — required work remains/, "approved matters must name required open work without blocking delivery");
assert.match(workspace, /Closure blocked · Required work remains/, "closure controls must list all required blockers before Close");
assert.match(workspace, /required open · \{optionalOpenWorkItems\.length\} optional open/, "the open queue must split required and optional counts");
assert.match(workspace, /\{item\.required \? "Required" : "Optional"\}/, "each consideration row must have a text requirement label");
assert.match(workspace, /Optional"\}\s*\{detail\.status === "closed"[\s\S]{0,100}Open after closure/, "optional work must remain visibly open after closure");
assert.match(workspace, /Adding participant…/, "participant feedback must identify its exact pending action");
assert.match(workspace, /Assigning owner…/, "owner feedback must identify its exact pending action");
assert.match(workspace, /setVisibleParticipants\(result\.data\.participants\)/, "participant rows must update from the mutation result before reload");
assert.match(workspace, /result\.matter\.work_items\.find/, "owner rows must update from the mutation result before reload");
assert.match(matterPage, /createLatestRequestLoader/, "matter refreshes must use latest-request-wins ordering");
assert.match(matterPage, /if \(error && !detail\)/, "a refresh failure must not hide the existing matter detail");
assert.match(matterPage, /await latestMatterLoader\(\)/, "refresh failures must reject back to the workspace action");

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

const staleMatter = deferred<{ recommendation: string | null; participants: string[]; owner: string }>();
const currentMatter = deferred<{ recommendation: string | null; participants: string[]; owner: string }>();
const matterReads = [staleMatter.promise, currentMatter.promise];
const appliedMatters: Array<{ recommendation: string | null; participants: string[]; owner: string }> = [];
const refreshErrors: unknown[] = [];
const loadLatestMatter = createLatestRequestLoader(
  () => matterReads.shift()!,
  (value) => appliedMatters.push(value),
  (error) => refreshErrors.push(error),
);
const staleLoad = loadLatestMatter();
const currentLoad = loadLatestMatter();
currentMatter.resolve({ recommendation: "REC-NEW", participants: ["Counsel", "Marketing"], owner: "Marketing" });
await currentLoad;
staleMatter.resolve({ recommendation: null, participants: ["Counsel"], owner: "" });
await staleLoad;
assert.deepEqual(appliedMatters, [
  { recommendation: "REC-NEW", participants: ["Counsel", "Marketing"], owner: "Marketing" },
], "an older null recommendation or partial mutation response must not replace the latest matter");

let pending = beginPendingAction([], "add_participant");
pending = beginPendingAction(pending, "assign_owner:WI-1");
assert.deepEqual(pending, ["add_participant", "assign_owner:WI-1"], "parallel participant and owner saves need independent pending keys");
pending = endPendingAction(pending, "assign_owner:WI-1");
assert.deepEqual(pending, ["add_participant"], "finishing one save must not clear another pending save");
pending = endPendingAction(pending, "add_participant");
assert.deepEqual(pending, []);

const failedRefresh = deferred<{ recommendation: string | null; participants: string[]; owner: string }>();
const loadFailedMatter = createLatestRequestLoader(
  () => failedRefresh.promise,
  (value) => appliedMatters.push(value),
  (error) => refreshErrors.push(error),
);
const rejectedLoad = loadFailedMatter();
failedRefresh.reject(new Error("refresh offline"));
await assert.rejects(rejectedLoad, /refresh offline/);
assert.equal(appliedMatters.length, 1, "a failed refresh must preserve the current detail");
assert.equal(refreshErrors.length, 1, "the current refresh failure must reach the caller");

const staleFailedRefresh = deferred<{ recommendation: string | null }>();
const newerSuccessfulRefresh = deferred<{ recommendation: string | null }>();
const orderedReads = [staleFailedRefresh.promise, newerSuccessfulRefresh.promise];
const orderedApplied: Array<{ recommendation: string | null }> = [];
const orderedErrors: unknown[] = [];
const loadOrderedMatter = createLatestRequestLoader(
  () => orderedReads.shift()!,
  (value) => orderedApplied.push(value),
  (error) => orderedErrors.push(error),
);
const staleFailedLoad = loadOrderedMatter();
const newerSuccessfulLoad = loadOrderedMatter();
newerSuccessfulRefresh.resolve({ recommendation: "REC-CURRENT" });
await newerSuccessfulLoad;
staleFailedRefresh.reject(new Error("old offline"));
assert.equal(await staleFailedLoad, undefined, "a stale failed reload must settle without a false action error");
assert.deepEqual(orderedApplied, [{ recommendation: "REC-CURRENT" }]);
assert.deepEqual(orderedErrors, [], "only the latest refresh failure may reach the workspace");
assert.doesNotMatch(workspace, /await runResearch\(detail\.matter_id\)/, "matter research action must not block on synchronous research");
assert.match(chat, /saveWorkProductDraft/, "Save as work product must call the canonical typed API directly");
assert.doesNotMatch(chat, /submit\(`Save this as work product:/, "Save as work product must not prepare another chat turn");
assert.match(workspace, /Matter detail is canonical/, "matter and chat refreshes must reconcile the canonical recommendation record");
assert.match(workspace, /detail\.recommendation\?\.content\.trim\(\) \?\? ""/, "the overview must seed recommendation content from canonical matter detail");
assert.doesNotMatch(workspace, /\.catch\(\(\) => \{ if \(!cancelled\) setRecommendation\(""\)/, "a supplemental recommendation read failure must not clear canonical content");
assert.equal(matterWorkspaceModule.isMatchingRecommendationSupplement("MAT-1", "REC-2", {
  matter_id: "MAT-1", path: "recommendations.md", content: "Current", current_version_id: "REC-2", proposal: null,
}), true);
assert.equal(matterWorkspaceModule.isMatchingRecommendationSupplement("MAT-1", "REC-2", {
  matter_id: "MAT-OLD", path: "recommendations.md", content: "Stale", current_version_id: "REC-2", proposal: null,
}), false, "a response for an old matter must be ignored");
assert.equal(matterWorkspaceModule.isMatchingRecommendationSupplement("MAT-1", "REC-2", {
  matter_id: "MAT-1", path: "recommendations.md", content: "Stale", current_version_id: "REC-1", proposal: null,
}), false, "a response for an old version must be ignored");
assert.equal(matterWorkspaceModule.shouldApplyCanonicalRecommendation(
  { path: "recommendations.md", content: "Saved", current_version_id: "REC-3", current_version_number: 3, proposal: null },
  { path: "recommendations.md", content: "Old reload", current_version_id: "REC-2", current_version_number: 2, proposal: null },
), false, "a slow reload must not overwrite a direct save");
assert.equal(matterWorkspaceModule.shouldApplyCanonicalRecommendation(
  { path: "recommendations.md", content: "Saved", current_version_id: "REC-3", current_version_number: 3, proposal: null },
  null,
), true, "confirmed canonical absence must clear the overview");
assert.match(workspace, /workflowStateExplanation/, "the workspace must present one combined stage, actor, and next-action explanation");
assert.match(matterActions, /export function workflowStateExplanation/, "the combined workflow explanation must derive from the durable work-state projection");
assert.match(matterActions, /detail\.work_state\.next_actor/, "stage and actor wording must use the persisted next actor");
assert.match(workspace, /onContinueFromPartial/, "partial research must let the lawyer continue to a safe drafting action");
assert.match(workspace, /const refreshAfterChatRun = useCallback\(async \(\) => \{[\s\S]{0,100}reload\(\), loadResearchQueue\(\)/, "a terminal chat run must refresh both the durable matter and research queue");
assert.match(workspace, /onRefresh=\{refreshAfterChatRun\}/, "chat terminal refresh must use the complete durable workspace refresh");
assert.match(cards, /detailRequired/, "single-choice clarification options must request detail");
assert.match(cards, /selectedDetail/, "single-choice clarification detail must be submitted with the selected value");
assert.doesNotMatch(cards, /result\.status !== "failed" \|\| Boolean\(result\.required_user_action\)/, "failed durable operation results must remain visible with their saved recovery details");
assert.match(cards, /result\.summary/, "failed durable operation cards must show their durable summary");
assert.match(cards, /result\.recovery/, "failed durable operation cards must show their durable recovery action");
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
assert.match(workspace, /detail\.status !== "closed"[\s\S]{0,240}Record durable decision/, "all non-closed matters must expose the durable decision form in artifacts");
assert.match(workspace, /Record durable decision[\s\S]{0,160}Open the decision form/, "Generate and Respond matter artifacts must name the direct decision action");

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
