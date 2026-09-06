import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import type { VaultDocument } from "../lib/types.ts";
import { createLatestRequestLoader } from "../lib/latestRequest.ts";
import { beginPendingAction, endPendingAction } from "../lib/pendingActions.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const workspace = readFileSync(new URL("../components/MatterWorkspace.tsx", import.meta.url), "utf8");
const documentReview = readFileSync(new URL("../components/DocumentReview.tsx", import.meta.url), "utf8");
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
const todayChat = readFileSync(new URL("../components/TodayChat.tsx", import.meta.url), "utf8");
const automationPanel = readFileSync(new URL("../components/AutomationPanel.tsx", import.meta.url), "utf8");
const briefingSource = readFileSync(new URL("../lib/briefing.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const designLanguage = readFileSync(new URL("../../docs/DESIGN_LANGUAGE.md", import.meta.url), "utf8");
const modal = readFileSync(new URL("../components/RecordDecisionModal.tsx", import.meta.url), "utf8");
const decisionsPage = readFileSync(new URL("../app/decisions/page.tsx", import.meta.url), "utf8");
const agentsPage = readFileSync(new URL("../app/agents/page.tsx", import.meta.url), "utf8");
const decisionFiltersSource = readFileSync(new URL("../lib/decisionFilters.ts", import.meta.url), "utf8")
  .replace(/import type \{[^;]+\} from "\.\/types";\n/, "");
const decisionFiltersModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(decisionFiltersSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as typeof import("../lib/decisionFilters.ts");
const matterActionsSource = matterActions.replace(/import type \{[^;]+\} from "\.\/types";\n/, "");
const matterActionsModule = await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(matterActionsSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString("base64")}`) as typeof import("../lib/matterActions.ts");
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
assert.match(mattersPage, /setMatters\(\(await getMatters\(\)\)\.matters\);\s*setLoaded\(true\);/, "matters must become loaded only after the first successful response");
assert.doesNotMatch(mattersPage, /finally\s*\{\s*setLoaded\(true\)/, "an initial matters error must not become a loaded zero-count state");
assert.match(mattersPage, /\{loaded \? <p>\{inFlight\} in flight, \{closed\} closed\.<\/p> : null\}/, "matter totals must stay hidden until the first successful load");
assert.match(mattersPage, /\{loaded \? \(\s*<>\s*<div className="stat-chips"/, "matter filters must stay hidden until the first successful load");
assert.match(mattersPage, /!loaded && !error \? <div className="loading">Loading matters…<\/div>/, "matters must show a neutral initial loading state");
assert.match(mattersPage, /<fieldset className="segmented">\s*<legend className="sr-only">Matter view<\/legend>/, "the matter view switch must be a labelled native radio group");
assert.equal([...mattersPage.matchAll(/name="matter-view"/g)].length, 2, "both matter view options must share one radio name");
assert.equal([...mattersPage.matchAll(/type="radio"/g)].length, 2, "both matter view options must be native radios");
assert.match(design, /final_with_pre_respond_stage:\s*"Current final is before Respond"/, "consistency codes must have stable lawyer-facing labels");
assert.match(design, /id: "respond", label: "Respond"/, "the shared Respond stage must use its stable stage name");
assert.match(designLanguage, /\| `respond` \| Respond \|/, "the design language must use the shared Respond stage name");
assert.match(design, /approval_without_current_final:\s*"Approval is not tied to the current final"/, "approval conflicts must have a stable label");
assert.match(design, /delivery_without_approved_artifact:\s*"Delivery has no approved artifact"/, "delivery conflicts must have a stable label");
assert.match(design, /closed_without_required_lifecycle_fields:\s*"Closed lifecycle record is incomplete"/, "closure conflicts must have a stable label");
assert.match(design, /issue\.code === "final_with_pre_respond_stage"/, "only the derived stage mismatch may be repaired from list surfaces");
assert.match(mattersTable, /background:\s*role\.attentionTint,\s*color:\s*role\.attentionDeep/, "consistency warnings must use shared attention colours with a state word");
assert.match(workspace, /control\.id === "review_intake"[\s\S]{0,120}openDocument\(requestPath\)/, "Review intake must open the original request");
assert.match(workspace, /saveWorkProductDraft/, "manual drafts must use the canonical typed API");
assert.match(workspace, /lifecycleCommand[\s\S]{0,120}\("\/work-product\/finalize"/, "Overview must expose direct finalization");
assert.match(workspace, /lifecycleCommand[\s\S]{0,120}\("\/work-items\/complete"/, "Overview must complete an identified work item directly");
assert.match(workspace, /updateMatterRisk/, "risk changes must persist directly");
assert.match(workspace, /startResearchRun\(\s*detail\.matter_id,\s*directResearchQuestion,?\s*\)/, "matter research action must send a non-empty question to the background run");
assert.match(workspace, /const directResearchQuestion\s*=\s*\[[\s\S]{0,400}detail\.title[\s\S]{0,160}\.find\(Boolean\) \?\? detail\.title/, "matter research must fall back through saved context and finally the non-empty matter title");
assert.doesNotMatch(workspace, /startResearchRun\(detail\.matter_id\s*\)/, "the visible research action must not use the obsolete empty one-argument call");
assert.match(workspace, /getResearchQueue\(detail\.matter_id\)/, "matter research must load the full durable queue");
assert.match(workspace, /shouldPollResearchQueue\(researchQueue\)/, "matter research must poll queued or running work");
assert.match(workspace, /<ResearchQueuePanel\s+items=\{researchQueue\}\s+mode="summary"/, "the overview must show the research queue summary");
assert.match(workspace, /otherRequiredOpenCount\}[\s\S]{0,40}required open ·[\s\S]{0,40}\{otherOptionalOpenCount\} optional open/, "the queue count must split other required and optional work items");
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
assert.match(workspace, /setResearchQueue\(\(current\) =>\s*current\.some\(\(item\) => item\.run_id === startedResearchRun\.run_id\)/, "a queue-read failure must retain the durable active run for the next queue poll");
assert.match(workspace, /currentControl\.id === "run_research"\s*&&\s*researchQueueActive/, "a durable active research run must block duplicate starts");
assert.match(documentReview, /useState<ReviewDisplayMode>\("current"\)/, "documents must open in No Markup without discarding saved redlines");
assert.match(documentReview, /setMode\("markup"\)/, "explicit redline and tracked-change actions must still open All Markup");
assert.match(workspace, /RecommendationPanel/, "recommendation paths must use the typed recommendation panel");
assert.match(workspace, /const recommendationSelected\s*=\s*Boolean\(\s*activePath\s*&&\s*\[recommendationPath, recommendationState\?\.path\]/, "the active recommendation path must route separately");
assert.match(workspace, /recommendationSelected\s*\?[\s\S]{0,80}recommendationState\s*\?[\s\S]{0,80}<RecommendationPanel[\s\S]{0,700}:\s*\([\s\S]{0,80}<DocumentPanel/, "the recommendation route must not render DocumentPanel");
assert.match(workspace, /Open recommendation/, "the overview must link directly to the recommendation");
assert.match(workspace, /Dossier · Review required/, "a dossier projection conflict must keep the main save successful and show its state");
assert.match(workspace, /Review dossier update/, "a dossier projection conflict must have a direct review link");
assert.match(workspace, /Work saved; dossier did not refresh\./, "a projection exception must show a refresh failure without claiming a revision exists");
assert.match(workspace, /projection\.state === "review_required" && projection\.revision_path/, "only a real dossier revision may show the review link");
assert.match(workspace, /Approved — required work remains/, "approved matters must name required open work without blocking delivery");
assert.match(workspace, /Before you can close/, "closure controls must list all required blockers before Close");
assert.match(workspace, /Stop or finish active research/, "closure blockers must put active research first");
assert.match(workspace, /Assign owner[\s\S]{0,500}Complete/, "each required closure blocker must expose assign and complete controls");
assert.match(workspace, /Other saved work items/, "the lower list must identify non-current saved work");
assert.match(workspace, /item\.source === "open_question"\s*\?\s*"Open question"\s*:\s*item\.required\s*\?\s*"Required work"\s*:\s*"Optional work"/, "each secondary row must name whether it is work or a question");
assert.match(workspace, /Open context at closure/, "closed matters must keep optional history under a past-tense disclosure");
assert.match(workspace, /Other open items and questions/, "the secondary list must state that Current work is excluded");
assert.match(workspace, /other required work[\s\S]{0,120}optional work[\s\S]{0,120}open questions/, "secondary counts must distinguish work from questions");
assert.match(workspace, /const otherOpenWorkItems = detail\.work_items\.filter\([\s\S]{0,180}item\.work_item_id !== currentWorkItem\?\.work_item_id/, "the lower list must exclude the current work item");
assert.match(workspace, /Assign to \$\{actor\.display_name\}/, "unassigned current work must offer the selected person");
assert.match(workspace, /htmlFor="current-work-item-owner">\s*Other owner/, "custom assignment must remain available with a clear label");
assert.match(workspace, /detail\.status !== "closed"\s*\?\s*\(\s*<section[\s\S]{0,100}className="matter-open"[\s\S]{0,100}aria-label="Other saved work items"/, "closed matters must not present old optional work as an active queue");
assert.match(workspace, /Adding participant…/, "participant feedback must identify its exact pending action");
assert.match(workspace, /Assigning owner…/, "owner feedback must identify its exact pending action");
assert.match(workspace, /setVisibleParticipants\(result\.data\.participants\)/, "participant rows must update from the mutation result before reload");
assert.match(workspace, /result\.matter\.work_items\.find/, "owner rows must update from the mutation result before reload");
assert.match(matterPage, /createLatestRequestLoader/, "matter refreshes must use latest-request-wins ordering");
assert.match(matterPage, /if \(!detail\)[\s\S]*error=\{loadError\}/, "a refresh failure must not hide the existing matter detail");
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
  undefined,
), false, "a stale canonical absence must not clear a confirmed saved recommendation");
assert.match(workspace, /workflowStateExplanation/, "the workspace must present the durable stage and actor state");
assert.match(matterActions, /export function workflowStateExplanation/, "the workflow explanation must derive from the durable work-state projection");
assert.match(matterActions, /detail\.work_state\.next_actor/, "stage and actor wording must use the persisted next actor");
assert.doesNotMatch(matterActions, /const nextAction = detail\.work_state\.next_action/, "the state explanation must not repeat the current task");
const closedState = {
  status: "closed",
  work_items: [],
  work_state: { execution_state: "running", next_actor: "named_owner", next_owner: "Stale owner", next_work_item_id: null },
};
assert.equal(
  matterActionsModule.workflowStateExplanation(closedState as never),
  "Stage: Closed. No action required.",
  "closed matters must ignore stale actor and execution projections",
);
const deliveredWithRequiredWork = {
  status: "respond",
  response_sent_at: "2026-09-04T12:00:00+00:00",
  work_items: [{ work_item_id: "WI-1", title: "Confirm funds flow", status: "open", required: 1 }],
  work_state: { execution_state: "idle", next_actor: "unassigned", next_owner: null, next_work_item_id: "WI-1" },
};
const deliveredWithRequiredWorkState = matterActionsModule.workflowStateExplanation(deliveredWithRequiredWork as never);
assert.equal(
  deliveredWithRequiredWorkState,
  "Stage: Respond. Manual delivery recorded. Required work remains before closure.",
  "a delivered Respond matter must describe the recorded delivery and remaining closure work",
);
assert.doesNotMatch(deliveredWithRequiredWorkState, /Ready to send/, "a delivered matter must not claim it is waiting to be sent");
assert.doesNotMatch(workspace, /<p>\{currentWorkItem\.title\}<\/p>/, "the current work controls must not repeat the current task title");
assert.match(workspace, /Priority for \$\{currentWorkItem\.title\}[\s\S]{0,500}changeWorkItemPriority\(\s*currentWorkItem\.work_item_id/, "current saved work must retain its priority control");
assert.match(workspace, /onContinueFromPartial/, "partial research must let the lawyer continue to a safe drafting action");
assert.match(workspace, /const refreshAfterChatRun = useCallback\(async \(\) => \{[\s\S]{0,100}reload\(\),\s*loadResearchQueue\(\)/, "a terminal chat run must refresh both the durable matter and research queue");
assert.match(workspace, /onRefresh=\{refreshAfterChatRun\}/, "chat terminal refresh must use the complete durable workspace refresh");
assert.match(cards, /detailRequired/, "single-choice clarification options must request detail");
assert.match(cards, /selectedDetail/, "single-choice clarification detail must be submitted with the selected value");
assert.doesNotMatch(cards, /result\.status !== "failed" \|\| Boolean\(result\.required_user_action\)/, "failed durable operation results must remain visible with their saved recovery details");
assert.match(cards, /result\.summary/, "failed durable operation cards must show their durable summary");
assert.match(cards, /result\.recovery/, "failed durable operation cards must show their durable recovery action");
assert.match(workspace, /detail\.intake_state === "active" \? "chat" : "overview"/, "only active intake matters must land with Chat open");
assert.match(workspace, /initialConversationId=\{initialConversationId \?\? detail\.intake_conversation_id\}/, "the workspace must open the durable intake conversation");
assert.match(workspace, /initialRunId=\{detail\.intake_run_id\}/, "the workspace must reconnect to the initial intake run");
assert.match(chat, /Themis.ai is reading your request…/, "the initial intake run must have a clear reading state");
assert.match(chat, /agent_id:\s*chatAgentId\(intakeActive, activeAgentId\)/, "chat must route turns through the active intake or copilot agent");
assert.match(design, /matterAwaitsJudgment\([\s\S]{0,160}matter\.status === "explore"/, "judgment counts must include overdue matters in the Explore stage");
assert.match(companyInterview, /generatedDraft && !draftEditedByLawyer[\s\S]{0,220}"Company profile draft · Themis\.ai · Not yet reviewed by an attorney"/, "an untouched generated company draft must keep generated attribution");
assert.match(companyInterview, /setDraftEditedByLawyer\(true\)[\s\S]{0,150}setSaveState\("dirty"\)/, "editing a generated review draft must record lawyer involvement");
assert.match(companyInterview, /Unsaved lawyer edits to a Themis\.ai draft/, "an edited generated company draft must use mixed attribution");
assert.match(todayChat, /Saved replies reflect the workspace when written\. The attention list above is current\./, "saved Today replies must be separated from the current attention list");
assert.match(todayChat, /Saved reply · \$\{parsed\.toLocaleTimeString/, "valid saved replies must show local time");
assert.match(todayChat, /if \(Number\.isNaN\(parsed\.getTime\(\)\)\) return "Saved reply"/, "invalid timestamps must not invent a time");
assert.match(todayChat, /<summary>Saved conversation · \{messages\.length\} messages<\/summary>/, "saved Today history must have one collapsed summary");
assert.match(todayChat, /setHistoryOpen\(day !== today\)/, "past daily conversations must open their history");
assert.match(todayChat, /setHistoryOpen\(true\)[\s\S]{0,180}setMessages/, "a newly submitted message must open the current history");
assert.doesNotMatch(briefingSource, /TITLE_MAX|clampText/, "Today titles must not be clipped in data");
assert.doesNotMatch(styles, /\.brief-title\s*\{\s*-webkit-line-clamp/, "Today titles must not be line-clamped");
assert.match(automationPanel, /<label className="sr-only" htmlFor="automation-prompt">Automation instructions<\/label>/, "automation prompt must be a labelled native field");
assert.match(automationPanel, /value=\{instructions\}/, "opening the automation form must preserve typed instructions");
assert.match(automationPanel, /event\.key === "Enter"[\s\S]{0,100}setOpen\(true\)/, "Enter must open the final automation form without submitting it");
assert.match(cardLogic, /:\s*"Follow-up"/, "questions without real progress must say Follow-up");
assert.doesNotMatch(cards, /progress_current=1|progress_total=3/, "question progress must not use a fixed total");
assert.match(modal, /await onRecorded\(\);\s*setRecorded\(true\)/, "success must follow both decision creation and matter reload");
assert.match(modal, /Decision recorded\. The refreshed matter/, "decision recording must expose a persisted success state");
assert.match(modal, /created \? "Retry refresh"/, "a failed reload must not create a duplicate decision on retry");
assert.match(modal, /Issues this decision does not resolve/, "the decision form must name unresolved issues clearly");
assert.match(modal, /Optional\. List issues that remain open after this decision\./, "the unresolved-issues field must explain that it is optional");
assert.match(styles, /\.btn\.primary:disabled\s*\{[^}]*var\(--sunken\)[^}]*var\(--line\)[^}]*var\(--ink-6\)/, "disabled primary buttons must use the shared disabled tokens");
assert.match(decisionsPage, /const \[loaded, setLoaded\] = useState\(false\)/, "decisions must track initial loading separately from an empty register");
assert.match(decisionsPage, /<DataLoadStatus[^>]+loadingLabel=/, "decisions must show neutral feedback while its first read runs");
assert.match(decisionsPage, /\{loaded \? \(\s*<DecisionTable/, "decisions must not flash an empty register before loading finishes");
assert.match(decisionsPage, /Mine \(configured lawyer\)/, "the personal decision filter must identify its configured source");
assert.match(decisionsPage, /<fieldset className="segmented">\s*<legend className="sr-only">Decision filter<\/legend>/, "decision filters must be a labelled native radio group");
assert.equal([...decisionsPage.matchAll(/name="decision-filter"/g)].length, 1, "the mapped decision radios must use one shared name");
assert.match(decisionsPage, /type="radio"/, "decision filters must use native radios");
assert.doesNotMatch(decisionsPage, /includes\(["']harris["']\)/i, "the personal decision filter must not contain a hard-coded person");
assert.equal(decisionFiltersModule.isDecisionByConfiguredLawyer("  ALEX LAWYER ", "Alex Lawyer"), true);
assert.equal(decisionFiltersModule.isDecisionByConfiguredLawyer("Alex Lawyer Jr.", "Alex Lawyer"), false, "the personal filter must use an exact normalized name");
assert.equal(decisionFiltersModule.isDecisionByConfiguredLawyer("Alex Lawyer", "   "), false, "an empty configured lawyer must not match decisions");
assert.equal(decisionFiltersModule.configuredLawyerName({ model_catalog: { providers: [] }, sections: [{
  id: "document-review", label: "", title: "", sub: "", rows: [{
    id: "lawyer", kind: "text", config_key: "document_review.lawyer_name", value: "  Alex Lawyer  ",
  }],
}] }), "Alex Lawyer", "the personal filter must read and trim the configured document-review lawyer");
assert.match(agentsPage, /const \[loaded, setLoaded\] = useState\(false\)/, "agents must track initial loading separately from an empty registry");
assert.match(agentsPage, /loaded \? \([\s\S]{0,100}No agents are defined/, "agents must not show an empty state before loading finishes");
assert.doesNotMatch(agentsPage, /<span className="agent-mark" \/>\s*Fixed for every agent/, "the fixed-rules heading must not look like a checkbox");
assert.match(agentsPage, /Effective tool access/, "built-in agents must name their effective tool access");
assert.match(agentsPage, /Application-managed · Read-only/, "built-in tool access must identify its owner and read-only state");
assert.match(agentsPage, /checked \? "Available" : "Not available"/, "built-in tools must show an explicit availability state");
assert.match(workspace, /basisLabels=\{Object\.fromEntries\(\s*evidence\.map/, "decision evidence must receive saved matter titles");
assert.match(modal, /basisLabel\(path, basisLabels\)/, "decision evidence must display supplied saved titles");
assert.match(workspace, /detail\.status !== "closed"[\s\S]{0,400}Record durable decision/, "all non-closed matters must expose the durable decision form in artifacts");
assert.match(workspace, /Record durable decision[\s\S]{0,160}Open the decision form/, "Generate and Respond matter artifacts must name the direct decision action");
assert.match(workspace, /research: "Research packet"[\s\S]{0,160}<span>\{item\.label\}<\/span>/, "research artifacts must show the artifact role and saved title once each");
assert.match(workspace, /item\.path\s*===\s*detail\.response_approved_artifact_path\s*\?\s*"Approved response"\s*:\s*"Final response"/, "only the exact approved artifact may use the approved response caption");
assert.doesNotMatch(workspace, /Approved \/ final response/, "final and approved artifact captions must stay distinct");
assert.match(designLanguage, /label it \*\*Approved response\*\* only when its exact path is the recorded\s+approved artifact path/, "the design language must preserve the exact approved-artifact caption rule");
assert.match(styles, /\.segmented-input:focus-visible \+ label/, "segmented radio labels must show visible keyboard focus");

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
