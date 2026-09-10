import { request } from "./api.ts";
import type { WorkspaceSnapshot, QuestionCommand, ProposalAction, QuestionRestore, InteractionReceipt, IssueUpdate, IssueNode, SupportingQuestionCommand, WorkspaceActionRequest, WorkspaceActionResult, ContextSelection, ChangeRecap, BusinessQuestion, Scenario, Flow, IssueDispositionCommand, IssueDispositionResult, DocumentIdentity, DocumentReferenceTarget, ResolvedDocumentReference, ScenarioAnalyzeCommand, ScenarioAdoptCommand } from "./workspaceTypes.ts";
import type { DecisionMapSnapshot } from "./decisionMapTypes.ts";
import type { ChatRun } from "./types.ts";
const base = (matterId: string) => `/matters/${encodeURIComponent(matterId)}/workspace`;
const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });
export const getWorkspace = (matterId: string) => request<WorkspaceSnapshot>(base(matterId));
export const changeBusinessQuestion = (matterId: string, command: QuestionCommand) => request<InteractionReceipt>(`${base(matterId)}/business-question`, json("PATCH", command));
export const proposeBusinessQuestion = (matterId: string, command: QuestionCommand) => request<InteractionReceipt>(`${base(matterId)}/business-question/proposals`, json("POST", command));
export const actOnQuestionProposal = (matterId: string, proposalId: string, command: ProposalAction) => request<InteractionReceipt>(`${base(matterId)}/business-question/proposals/${encodeURIComponent(proposalId)}`, json("PATCH", command));
export const restoreBusinessQuestion = (matterId: string, command: QuestionRestore) => request<InteractionReceipt>(`${base(matterId)}/business-question/restore`, json("POST", command));
export const getQuestionHistory = (matterId: string) => request<BusinessQuestion[]>(`${base(matterId)}/business-question/history`);
export const updateWorkspaceIssue = (matterId: string, issueId: string, command: IssueUpdate) => request<IssueNode[]>(`${base(matterId)}/issues/${encodeURIComponent(issueId)}`, json("PATCH", command));
export const answerWorkspaceQuestion = (matterId: string, questionId: string, command: SupportingQuestionCommand) => request<InteractionReceipt>(`${base(matterId)}/questions/${encodeURIComponent(questionId)}`, json("PATCH", command));
export const runWorkspaceAction = (matterId: string, command: WorkspaceActionRequest) => request<WorkspaceActionResult>(`${base(matterId)}/actions`, json("POST", command));
export const setWorkspaceContext = (matterId: string, selections: ContextSelection[], expectedRevision: string) => request<ContextSelection[]>(`${base(matterId)}/context`, json("PUT", { selections, expected_revision: expectedRevision }));
export const markWorkspaceSeen = (matterId: string, revision: string) => request<ChangeRecap>(`${base(matterId)}/seen`, json("POST", { expected_revision: revision }));
export const getWorkspaceScenarios = (matterId: string) => request<Scenario[]>(`${base(matterId)}/scenarios`);
export const getWorkspaceScenario = (matterId: string, scenarioId: string) => request<Scenario>(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}`);
export const getWorkspaceFlow = (matterId: string) => request<Flow>(`${base(matterId)}/flow`);
export const saveWorkspaceFlow = (matterId: string, flow: Flow, expectedRevision: string) => request<Flow>(`${base(matterId)}/flow`, json("PATCH", { flow, expected_revision: expectedRevision }));
export const recordIssueDisposition = (matterId: string, issueId: string, command: IssueDispositionCommand) => request<IssueDispositionResult>(`${base(matterId)}/issues/${encodeURIComponent(issueId)}/disposition`, json("POST", command));
export const getDecisionMap = (matterId: string, issueId?: string | null) => request<DecisionMapSnapshot>(`${base(matterId)}/decision-map${issueId ? `?issue_id=${encodeURIComponent(issueId)}` : ""}`);
export const getWorkspaceDocuments = (matterId: string) => request<DocumentIdentity[]>(`${base(matterId)}/documents`);
export function normalizeDocumentReferenceTarget(target: DocumentReferenceTarget): DocumentReferenceTarget {
  const savedOrigin = target.origin;
  const offset = savedOrigin?.scroll_offset;
  if (!savedOrigin || offset == null || Number.isInteger(offset)) return target;
  return {
    ...target,
    origin: { ...savedOrigin, scroll_offset: Math.round(offset) },
  };
}
export async function latestReferenceResult<T>(
  generation: { current: number },
  load: () => Promise<T>,
): Promise<T | null> {
  const request = ++generation.current;
  try {
    const result = await load();
    return generation.current === request ? result : null;
  } catch (cause) {
    if (generation.current !== request) return null;
    throw cause;
  }
}
export function invalidateReferenceResult(generation: { current: number }) {
  generation.current += 1;
}
export function referenceDestination(document: DocumentIdentity): "editor" | "preview" {
  return document.kind === "work_product" ? "editor" : "preview";
}
export function documentForReferenceTarget(
  documents: DocumentIdentity[],
  target: DocumentReferenceTarget,
): DocumentIdentity | null {
  const exact = documents.find(
    (document) =>
      document.document_id === target.document_id &&
      document.path === target.path &&
      (!target.revision || document.revision === target.revision),
  );
  if (exact) return exact;
  if (target.path) return null;
  return (
    documents.find((document) => document.document_id === target.document_id) ??
    null
  );
}
export function preferredConversationId(
  conversationIds: Iterable<string>,
  requested: string | null,
  intake: string | null | undefined,
): string | null {
  const saved = new Set(conversationIds);
  if (requested && saved.has(requested)) return requested;
  return intake && saved.has(intake) ? intake : null;
}
export function documentForEditorHref(
  documents: DocumentIdentity[],
  href: string,
  browserOrigin: string,
): DocumentIdentity | null {
  let decoded = href;
  try {
    decoded = decodeURIComponent(href);
  } catch {
    return null;
  }
  const relativePath = decoded.replace(/^\.\//, "").replace(/^\//, "");
  const direct = documents.find((document) => document.path === relativePath);
  if (direct) return direct;
  try {
    const rendered = new URL(href, browserOrigin);
    if (rendered.origin === browserOrigin) {
      const localPath = decodeURIComponent(rendered.pathname).replace(/^\//, "");
      return documents.find((document) => document.path === localPath) ?? null;
    }
    return (
      documents.find((document) => {
        try {
          return new URL(`https://${document.path}`).href === rendered.href;
        } catch {
          return false;
        }
      }) ?? null
    );
  } catch {
    return null;
  }
}
export const resolveWorkspaceDocument = (matterId: string, target: DocumentReferenceTarget) => request<ResolvedDocumentReference>(`${base(matterId)}/documents/resolve`, json("POST", normalizeDocumentReferenceTarget(target)));
export const saveWorkspaceScenario = (matterId: string, scenario: Scenario, title: string, expectedRevision: string, sourceActionKey: string) => request<Scenario>(`${base(matterId)}/scenarios`, json("POST", { scenario: { ...scenario, title }, expected_revision: expectedRevision, source_action_key: sourceActionKey }));
export const analyzeWorkspaceScenario = (matterId: string, scenarioId: string, command: ScenarioAnalyzeCommand) => request<ChatRun>(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}/analyze`, json("POST", command));
export const adoptWorkspaceScenario = (matterId: string, scenarioId: string, command: ScenarioAdoptCommand) => request<InteractionReceipt>(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}/adopt`, json("POST", command));

export function workspaceCommand<T>(matterId: string, path: string, method = "GET", body?: unknown): Promise<T> { return request<T>(`${base(matterId)}${path}`, body === undefined ? { method } : json(method, body)); }
export function templateCommand<T>(path = "", method = "GET", body?: unknown): Promise<T> { return request<T>(`/skills/output-templates${path}`, body === undefined ? { method } : json(method, body)); }

export const getProblemAnalysis = (matterId: string, reference: import("./problemAnalysisTypes").ProblemAnalysisReference) =>
  request<import("./problemAnalysisTypes").ProblemAnalysisStatus>(`${base(matterId)}/problem-analysis?reference=${encodeURIComponent(JSON.stringify(reference))}`);
