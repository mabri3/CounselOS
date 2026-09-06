import type {
  AgentDefinition,
  AgentDetail,
  AnswerContract,
  AttachmentReference,
  Audience,
  ChatResponse,
  ChatRun,
  ChatConversation,
  ChatConversationSummary,
  CompanyInterview,
  CompanyInterviewDraft,
  CompanyInterviewTurn,
  CompanyProfile,
  DailyConversation,
  DailyConversationSummary,
  Decision,
  DocumentReview,
  DocumentReviewAction,
  Matter,
  MatterCreatePayload,
  MatterActionRequest,
  MatterActionResult,
  MatterDetail,
  ModelCatalog,
  ModelCatalogModel,
  ModelCatalogProvider,
  ResearchNote,
  ResearchQueueMutationResult,
  ResearchRun,
  Schedule,
  ScheduleUpdate,
  SettingsPayload,
  SkillCreate,
  SkillDefinition,
  SkillDraftRequest,
  SkillDraftResponse,
  SkillQuestion,
  SkillSuggestionsResponse,
  SkillUpdate,
  Stage,
  ToolDefinition,
  VaultDocument,
  VaultInfo,
  WorkspaceSettings,
  WorkItem,
  WorkProductDraftResult,
  WorkProductLifecycleResult,
} from "./types.ts";
import { DEFAULT_SETTINGS, agentDetailFrom } from "./stubs.ts";

let continuityTransport = { vault: "", person: "", demo: false };
export function setContinuityTransport(vault: string, person: string, demo: boolean) { continuityTransport = { vault, person, demo }; }
export function currentContinuityStorageKey(matter: string, slot: string) {
  const { vault, person } = continuityTransport;
  return vault ? `themis.continuity.v1:${[vault, person, matter, slot].map(encodeURIComponent).join(":")}` : null;
}
export function continuityPersonHeaders(): Record<string, string> {
  return continuityTransport.demo ? { "X-Themis-Person-Id": continuityTransport.person } : {};
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export const MODEL_PROVIDER_IDS = ["mock", "openai_compatible", "opencode_go", "codex", "antigravity_cli"] as const;

const MODEL_PROVIDER_LABELS: Record<(typeof MODEL_PROVIDER_IDS)[number], string> = {
  mock: "Mock (offline)",
  openai_compatible: "OpenAI-compatible",
  opencode_go: "OpenCode Go",
  codex: "Codex CLI",
  antigravity_cli: "Antigravity CLI",
};

export function effortLabel(effort: string): string {
  return {
    default: "Default",
    none: "None",
    minimal: "Minimal",
    low: "Low",
    medium: "Medium",
    high: "High",
    xhigh: "Extra high",
    max: "Maximum",
  }[effort] ?? effort;
}

function formatErrorDetail(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail || fallback;
  if (detail && typeof detail === "object" && "message" in detail && typeof detail.message === "string") return detail.message;

  const entries = Array.isArray(detail) ? detail : [detail];
  const messages = entries.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const validation = entry as { loc?: unknown; msg?: unknown };
    if (typeof validation.msg !== "string" || !validation.msg) return [];
    const path = Array.isArray(validation.loc)
      ? validation.loc.filter((part) => typeof part === "string" || typeof part === "number").join(".")
      : "";
    return [path ? `${path}: ${validation.msg}` : validation.msg];
  });
  return messages.length ? messages.join("; ") : fallback;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = globalThis.setTimeout(() => { timedOut = true; controller.abort(); }, 15_000);
  const abortFromCaller = () => controller.abort();
  if (init?.signal?.aborted) controller.abort();
  else init?.signal?.addEventListener("abort", abortFromCaller, { once: true });
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...continuityPersonHeaders(), ...init?.headers },
      cache: "no-store",
    });
  } catch (error) {
    if (timedOut && error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The request timed out. The save may have completed. Reload to check the saved result, or retry the same action.");
    }
    if (error instanceof TypeError || (error instanceof DOMException && error.name === "AbortError")) {
      throw new Error("Counsel OS cannot reach the local service. Check that it is running, then retry.");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
    init?.signal?.removeEventListener("abort", abortFromCaller);
  }
  if (!response.ok) {
    const payload: { detail?: unknown } = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(formatErrorDetail(payload.detail, `Request failed: ${response.status}`));
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getMatters(): Promise<{ matters: Matter[]; stages: Stage[] }> {
  return request("/matters");
}

/** Read the browser's submitted date, which is authoritative over a delayed React state update. */
export function matterTargetDateFromForm(formData: Pick<FormData, "get">): string | null {
  const value = formData.get("target_date");
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function createMatter(payload: MatterCreatePayload): Promise<MatterDetail> {
  return request("/matters", { method: "POST", body: JSON.stringify(payload) });
}

export async function getMatter(matterId: string): Promise<MatterDetail> {
  return request(`/matters/${encodeURIComponent(matterId)}`);
}

export async function moveMatter(matterId: string, stage: string, reason = ""): Promise<MatterDetail> {
  return request(`/matters/${encodeURIComponent(matterId)}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage, reason }),
  });
}

export async function updateMatterRisk(
  matterId: string,
  riskLevel: string | null,
  actor: string,
): Promise<MatterDetail> {
  return request(`/matters/${encodeURIComponent(matterId)}/risk`, {
    method: "PATCH",
    body: JSON.stringify({ risk_level: riskLevel, actor }),
  });
}

export async function performMatterAction(
  matterId: string,
  payload: MatterActionRequest,
): Promise<MatterActionResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function completeWorkItem(
  matterId: string,
  workItemId: string,
  actor: string,
): Promise<MatterActionResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-items/complete`, {
    method: "POST",
    body: JSON.stringify({ work_item_id: workItemId, actor }),
  });
}

export async function createMatterWorkItem(
  matterId: string,
  payload: {
    title: string;
    description: string;
    item_type: string;
    status: string;
    priority: string;
    owner: string;
    due_at?: string | null;
    required: boolean;
    issue_id: string;
    source_action_key: string;
  },
): Promise<WorkItem> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-items`, {
    method: "POST",
    body: JSON.stringify({ matter_id: matterId, ...payload }),
  });
}

export async function assignWorkItem(
  matterId: string,
  workItemId: string,
  owner: string,
  actor: string,
): Promise<MatterActionResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-items/assign`, {
    method: "POST",
    body: JSON.stringify({ work_item_id: workItemId, owner, actor }),
  });
}

export async function prioritizeWorkItem(
  matterId: string, workItemId: string, priority: string, actor: string,
): Promise<MatterActionResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-items/priority`, {
    method: "POST", body: JSON.stringify({ work_item_id: workItemId, priority, actor }),
  });
}

export async function addMatterParticipant(
  matterId: string, name: string, role: string, actor: string,
): Promise<import("./types").ParticipantMutationResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/participants`, {
    method: "POST", body: JSON.stringify({ name, role, actor }),
  });
}

export async function repairMatterConsistency(
  matterId: string,
  actor: string,
): Promise<MatterActionResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/consistency/repair`, {
    method: "POST",
    body: JSON.stringify({ actor }),
  });
}

export async function getAnnotations(matterId: string): Promise<{ annotations: ResearchNote[] }> {
  return request(`/matters/${encodeURIComponent(matterId)}/annotations`);
}

export async function createAnnotation(
  matterId: string,
  payload: Pick<ResearchNote, "source_path" | "citation" | "quote" | "question" | "who">,
): Promise<ResearchNote> {
  return request(`/matters/${encodeURIComponent(matterId)}/annotations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function answerAnnotation(matterId: string, annotationId: string): Promise<ResearchNote> {
  return request(
    `/matters/${encodeURIComponent(matterId)}/annotations/${encodeURIComponent(annotationId)}/answer`,
    { method: "POST" },
  );
}

export async function uploadDocument(matterId: string, file: File): Promise<Record<string, unknown>> {
  const body = new FormData();
  body.append("file", file);
  return request(`/matters/${encodeURIComponent(matterId)}/upload`, { method: "POST", body });
}

export async function uploadDocuments(matterId: string, files: File[]): Promise<Record<string, unknown>> {
  const body = new FormData();
  files.forEach((file) => body.append("files", file));
  return request(`/matters/${encodeURIComponent(matterId)}/uploads`, { method: "POST", body });
}

export async function uploadWorkspaceDocuments(files: File[]): Promise<{ attachments: AttachmentReference[] }> {
  const body = new FormData();
  files.forEach((file) => body.append("files", file));
  return request("/daily-uploads", { method: "POST", body });
}

export async function startIntake(matterId: string): Promise<ChatResponse> {
  return request(`/matters/${encodeURIComponent(matterId)}/intake`, { method: "POST" });
}

export async function startResearchRun(
  matterId: string,
  question = "",
  sourceActionKey?: string,
): Promise<ResearchRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/research-runs`, {
    method: "POST",
    body: JSON.stringify({ question, source_action_key: sourceActionKey }),
  });
}

export async function getResearchRun(matterId: string, runId: string): Promise<ResearchRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/research-runs/${encodeURIComponent(runId)}`);
}

export async function getResearchQueue(matterId: string): Promise<{ items: ResearchRun[] }> {
  return request(`/settings/research-queue/${encodeURIComponent(matterId)}`);
}

export async function reorderResearchQueue(matterId: string, runIds: string[]): Promise<ResearchQueueMutationResult> {
  return request(`/settings/research-queue/${encodeURIComponent(matterId)}/reorder`, {
    method: "POST", body: JSON.stringify({ run_ids: runIds }),
  });
}

export async function resumeResearchQueue(matterId: string): Promise<ResearchQueueMutationResult> {
  return request(`/settings/research-queue/${encodeURIComponent(matterId)}/resume`, { method: "POST" });
}

export async function stopResearchQueue(matterId: string): Promise<ResearchQueueMutationResult> {
  return request(`/settings/research-queue/${encodeURIComponent(matterId)}/stop`, { method: "POST" });
}

export async function retryResearchItem(matterId: string, runId: string): Promise<ResearchQueueMutationResult> {
  return request(`/settings/research-queue/${encodeURIComponent(matterId)}/${encodeURIComponent(runId)}/retry`, { method: "POST" });
}

export async function applyBatchAction(matterId: string, batchId: string, action: "preview" | "apply" | "undo"): Promise<Record<string, unknown>> {
  return request(`/matters/${encodeURIComponent(matterId)}/batches`, {
    method: "POST",
    body: JSON.stringify({ batch_id: batchId, action }),
  });
}

export async function finalizeWorkProduct(matterId: string, draftPath: string): Promise<WorkProductLifecycleResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-product/finalize`, {
    method: "POST",
    body: JSON.stringify({ draft_path: draftPath }),
  });
}

export async function saveWorkProductDraft(
  matterId: string,
  title: string,
  content: string,
  sourceActionKey?: string,
  recommendation?: string,
): Promise<WorkProductDraftResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-product/draft`, {
    method: "POST",
    body: JSON.stringify({ title, content, source_action_key: sourceActionKey, recommendation }),
  });
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  return request("/settings/company");
}

export async function saveCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  return request("/settings/company", { method: "PUT", body: JSON.stringify(profile) });
}

export async function getAnswerContract(): Promise<AnswerContract> {
  return request("/settings/answer-contract");
}

export async function saveAnswerContract(content: string): Promise<AnswerContract> {
  return request("/settings/answer-contract", {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function resetAnswerContract(): Promise<AnswerContract> {
  return request("/settings/answer-contract/reset", { method: "POST" });
}

export async function getCompanyInterview(): Promise<CompanyInterview> {
  return request("/settings/company/interview");
}

export async function advanceCompanyInterview(payload: {
  message: string;
  website_url?: string | null;
  history: CompanyInterviewTurn[];
  current_profile: CompanyProfile;
  question_id: string;
  finish?: boolean;
}): Promise<CompanyInterviewDraft> {
  return request("/settings/company/interview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getFile(path: string): Promise<VaultDocument> {
  return request(`/files?path=${encodeURIComponent(path)}`);
}

export async function getRecommendation(matterId: string): Promise<import("./types").RecommendationState> {
  return request(`/matters/${encodeURIComponent(matterId)}/recommendation`);
}

export async function updateRecommendation(matterId: string, content: string, actor: string): Promise<import("./types").RecommendationMutationResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/recommendation`, {
    method: "PUT", body: JSON.stringify({ content, actor }),
  });
}

export async function proposeRecommendation(matterId: string, content: string, actor: string): Promise<import("./types").RecommendationMutationResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/recommendation/proposals`, {
    method: "POST", body: JSON.stringify({ content, actor }),
  });
}

export async function acceptRecommendation(matterId: string, actor: string): Promise<import("./types").RecommendationMutationResult> {
  return request(`/matters/${encodeURIComponent(matterId)}/recommendation/accept`, {
    method: "POST", body: JSON.stringify({ actor }),
  });
}

export async function saveFile(document: VaultDocument): Promise<{ status: string; path: string }> {
  return request(`/files?path=${encodeURIComponent(document.path)}`, {
    method: "PUT",
    body: JSON.stringify({ content: document.content, metadata: document.metadata }),
  });
}

export async function getDocumentReview(path: string): Promise<DocumentReview> {
  return request(`/files/review?path=${encodeURIComponent(path)}`);
}

export async function updateDocumentReview(path: string, action: DocumentReviewAction): Promise<DocumentReview> {
  const storageKey = currentContinuityStorageKey("review", path);
  const signature = JSON.stringify({ path, ...action });
  let body = { source_action_key: `review:${globalThis.crypto.randomUUID()}`, ...action };
  if (storageKey && typeof window !== "undefined") {
    try { const prior = JSON.parse(localStorage.getItem(storageKey) || "null"); if (prior?.signature === signature) body = prior.command; } catch { /* Start a new explicit action. */ }
    localStorage.setItem(storageKey, JSON.stringify({ signature, command: body }));
  }
  const headers = continuityPersonHeaders();
  const result = await request<DocumentReview>(`/files/review?path=${encodeURIComponent(path)}`, { method: "PUT", headers, body: JSON.stringify(body) });
  if (storageKey && typeof window !== "undefined") {
    try { const current = JSON.parse(localStorage.getItem(storageKey) || "null"); if (current?.command.source_action_key === body.source_action_key) localStorage.removeItem(storageKey); } catch { /* Leave newer drafts alone. */ }
  }
  return result;
}

export function exportFileUrl(path: string, format: "docx" | "pdf", options?: { mode: "markup" | "accepted_text"; expected_revision?: string; expected_review_revision?: string }): string {
  const query = new URLSearchParams({ path, format, ...options });
  return `${API_BASE}/files/export?${query}`;
}

export async function sendChat(payload: Record<string, unknown>): Promise<ChatResponse> {
  return request("/chat", { method: "POST", body: JSON.stringify(payload) });
}

export async function startChatRun(matterId: string, payload: Record<string, unknown>): Promise<ChatRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/chat-runs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function recoverIntakeQuestion(matterId: string, conversationId: string): Promise<ChatRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/intake-question-recovery`, {
    method: "POST",
    body: JSON.stringify({ conversation_id: conversationId }),
  });
}

export async function getChatRuns(matterId: string, conversationId: string): Promise<ChatRun[]> {
  return request(`/matters/${encodeURIComponent(matterId)}/chat-runs?conversation_id=${encodeURIComponent(conversationId)}`);
}

export async function getChatRun(matterId: string, runId: string): Promise<ChatRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/chat-runs/${encodeURIComponent(runId)}`);
}

export async function retryChatRun(matterId: string, runId: string): Promise<ChatRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/chat-runs/${encodeURIComponent(runId)}/retry`, {
    method: "POST",
  });
}

export async function getSkills(): Promise<{ skills: SkillDefinition[] }> {
  return request("/skills");
}

export async function getSkillQuestions(): Promise<{ questions: SkillQuestion[] }> {
  return request("/skills/questions");
}

export async function draftSkill(payload: SkillDraftRequest): Promise<SkillDraftResponse> {
  return request("/skills/draft", { method: "POST", body: JSON.stringify(payload) });
}

export async function getSkillSuggestions(): Promise<SkillSuggestionsResponse> {
  return request("/skills/suggestions", { method: "POST" });
}

export async function createSkill(payload: SkillCreate): Promise<SkillDefinition> {
  return request("/skills", { method: "POST", body: JSON.stringify(payload) });
}

export async function getSkill(skillId: string): Promise<SkillDefinition> {
  return request(`/skills/${encodeURIComponent(skillId)}`);
}

export async function updateSkill(skillId: string, payload: SkillUpdate): Promise<SkillDefinition> {
  return request(`/skills/${encodeURIComponent(skillId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getConversations(matterId: string): Promise<{ conversations: ChatConversationSummary[] }> {
  return request(`/matters/${encodeURIComponent(matterId)}/conversations`);
}

export async function getConversation(matterId: string, conversationId: string): Promise<ChatConversation> {
  return request(
    `/matters/${encodeURIComponent(matterId)}/conversations/${encodeURIComponent(conversationId)}`,
  );
}

export async function getDailyConversations(): Promise<{ conversations: DailyConversationSummary[] }> {
  return request("/daily-conversations");
}

export async function getDailyConversation(day: string): Promise<DailyConversation> {
  return request(`/daily-conversations/${encodeURIComponent(day)}`);
}

export async function getDecisions(status?: string): Promise<{ decisions: Decision[] }> {
  return request(`/decisions${status ? `?status=${encodeURIComponent(status)}` : ""}`);
}

export async function createDecision(payload: Record<string, unknown>): Promise<Decision> {
  return request("/decisions", { method: "POST", body: JSON.stringify(payload) });
}

export async function auditDecisions(): Promise<Record<string, unknown>> {
  return request("/decisions/audit", { method: "POST" });
}

export async function getAutomations(): Promise<{ schedules: Schedule[]; agents: AgentDefinition[] }> {
  return request("/automations");
}

export async function runSchedule(scheduleId: string): Promise<Record<string, unknown>> {
  return request(`/automations/schedules/${encodeURIComponent(scheduleId)}/run`, { method: "POST" });
}

export async function updateSchedule(scheduleId: string, payload: ScheduleUpdate): Promise<Schedule> {
  return request(`/automations/schedules/${encodeURIComponent(scheduleId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createSchedule(payload: Record<string, unknown>): Promise<Schedule> {
  return request("/automations/schedules", { method: "POST", body: JSON.stringify(payload) });
}

export function rawFileUrl(path: string): string {
  return `${API_BASE}/files/raw?path=${encodeURIComponent(path)}`;
}

/* ── Settings and agent administration ───────────────────────────────── */

export async function getSettings(): Promise<WorkspaceSettings> {
  const { values, model_catalog } = await request<SettingsPayload>("/settings");
  const catalog = normalizeModelCatalog(model_catalog);
  const providerValue = typeof values["agents.provider"] === "string" ? values["agents.provider"] : "mock";
  const selectedProvider = catalog.providers.find((provider) => provider.id === providerValue)
    ?? unavailableProvider(providerValue, providerValue, "The saved provider is not in the current catalog.");
  if (!catalog.providers.some((provider) => provider.id === selectedProvider.id)) {
    catalog.providers.push(selectedProvider);
  }
  const requestedModel = typeof values["agents.reasoning_model"] === "string"
    ? values["agents.reasoning_model"]
    : "";
  let selectedModel = selectedProvider.models.find((model) => model.id === requestedModel);
  if (!selectedModel && requestedModel) {
    selectedModel = { id: requestedModel, label: `${requestedModel} (unavailable)`, reasoning_efforts: [] };
    selectedProvider.models.push(selectedModel);
  }
  selectedModel ??= selectedProvider.models[0];
  const requestedEffort = typeof values["agents.reasoning_effort"] === "string"
    ? values["agents.reasoning_effort"]
    : "default";
  const selectedEffort = selectedModel?.reasoning_efforts.includes(requestedEffort)
    ? requestedEffort
    : selectedModel?.reasoning_efforts[0] ?? requestedEffort;

  const sections = DEFAULT_SETTINGS.map((section) => ({
      ...section,
      rows: section.rows.map((row) => {
        if (row.config_key === "agents.provider") {
          return {
            ...row,
            value: selectedProvider?.id ?? "mock",
            options: catalog.providers.map((provider) => provider.id),
            option_labels: Object.fromEntries(
              catalog.providers.map((provider) => [provider.id, provider.label]),
            ),
          };
        }
        if (row.config_key === "agents.reasoning_model") {
          return {
            ...row,
            value: selectedModel?.id ?? "mock",
            options: selectedProvider?.models.map((model) => model.id) ?? ["mock"],
            option_labels: Object.fromEntries(
              selectedProvider?.models.map((model) => [model.id, model.label]) ?? [],
            ),
          };
        }
        if (row.config_key === "agents.reasoning_effort") {
          const efforts = selectedModel?.reasoning_efforts.length
            ? selectedModel.reasoning_efforts
            : [selectedEffort];
          return {
            ...row,
            value: selectedEffort,
            options: efforts,
            option_labels: Object.fromEntries(
              efforts.map((effort) => [effort, effortLabel(effort)]),
            ),
          };
        }
        if (!row.config_key || !(row.config_key in values)) return { ...row };
        const stored = values[row.config_key];
        return row.kind === "toggle"
          ? { ...row, on: typeof stored === "boolean" ? stored : row.on }
          : { ...row, value: typeof stored === "string" || typeof stored === "number" ? String(stored) : row.value };
      }),
    }));
  const reviewRows = sections.find((section) => section.id === "document-review")?.rows;
  if (reviewRows) {
    const lawyer = reviewRows.find((row) => row.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer";
    const defaultAuthor = reviewRows.find((row) => row.config_key === "document_review.default_author");
    if (defaultAuthor) {
      defaultAuthor.options = ["Themis.ai", lawyer];
      if (defaultAuthor.value === "Themis") defaultAuthor.value = "Themis.ai";
      if (!["Themis.ai", lawyer].includes(defaultAuthor.value ?? "")) defaultAuthor.value = "Themis.ai";
    }
  }
  return { model_catalog: catalog, sections };
}

type RawModelCatalogModel = Omit<ModelCatalogModel, "reasoning_efforts"> & {
  reasoning_efforts?: string[];
  efforts?: string[];
};

type RawModelCatalogProvider = Omit<ModelCatalogProvider, "models" | "readiness" | "readiness_detail"> & {
  readiness?: ModelCatalogProvider["readiness"];
  readiness_detail?: string;
  models?: RawModelCatalogModel[];
};

function unavailableProvider(id: string, label: string, detail: string): ModelCatalogProvider {
  return { id, label, readiness: "unavailable", readiness_detail: detail, models: [] };
}

function normalizeModelCatalog(catalog?: ModelCatalog | null): ModelCatalog {
  const rawProviders = (catalog?.providers ?? []) as RawModelCatalogProvider[];
  const providers = MODEL_PROVIDER_IDS.map((id) => {
    const raw = rawProviders.find((provider) => provider.id === id);
    if (!raw) return unavailableProvider(id, MODEL_PROVIDER_LABELS[id], "The provider was not returned by the model catalog.");
    return {
      id: raw.id,
      label: raw.label || MODEL_PROVIDER_LABELS[id],
      readiness: raw.readiness ?? (raw.models?.length ? "ready" : "missing"),
      readiness_detail: raw.readiness_detail ?? (raw.models?.length ? "Model catalog loaded." : "No models are available."),
      models: (raw.models ?? []).map((model) => ({
        id: model.id,
        label: model.label,
        reasoning_efforts: model.reasoning_efforts ?? model.efforts ?? [],
      })),
    } satisfies ModelCatalogProvider;
  });
  return {
    providers,
    warning: catalog?.warning ?? (catalog ? null : "The model catalog is unavailable."),
  };
}

export async function saveSettings(settings: WorkspaceSettings): Promise<SettingsPayload> {
  const values = Object.fromEntries(
    settings.sections.flatMap((section) =>
      section.rows
        .filter((row) => row.kind !== "heading" && row.config_key)
        .map((row) => [row.config_key!, row.kind === "toggle" ? !!row.on : row.value ?? ""]),
    ),
  );
  return request("/settings", { method: "PUT", body: JSON.stringify({ values }) });
}

export async function getActiveVault(): Promise<VaultInfo> {
  return request("/settings/vault");
}

export async function createVault(path: string): Promise<VaultInfo> {
  return request("/settings/vault/create", { method: "POST", body: JSON.stringify({ path }) });
}

export async function loadVault(path: string): Promise<VaultInfo> {
  return request("/settings/vault/load", { method: "POST", body: JSON.stringify({ path }) });
}

export async function getAgentDetail(agentId: string): Promise<AgentDetail> {
  const [definition, { schedules }] = await Promise.all([
    request<AgentDefinition>(`/automations/agents/${encodeURIComponent(agentId)}`),
    getAutomations(),
  ]);
  return agentDetailFrom(definition, schedules);
}

export async function saveAgentDetail(agent: AgentDetail): Promise<AgentDefinition> {
  return request(`/automations/agents/${encodeURIComponent(agent.agent_id)}`, {
    method: "PUT",
    body: JSON.stringify({
      name: agent.name,
      description: agent.description,
      instructions: agent.instructions,
      allowed_tools: agent.allowed_tools,
      max_steps: agent.max_steps,
      audience_id: agent.audience_id,
      audience_prompt: agent.audience_prompt,
      provider: agent.provider ?? "",
      model: agent.model ?? "",
      reasoning_effort: agent.reasoning_effort ?? "",
    }),
  });
}

export async function getTools(): Promise<{ tools: ToolDefinition[] }> {
  return request("/automations/tools");
}

export async function getAudiences(): Promise<{ audiences: Audience[] }> {
  return request("/automations/audiences");
}

export async function cancelChatRun(matterId: string, runId: string): Promise<ChatRun> {
  return request<ChatRun>(`/matters/${matterId}/chat-runs/${runId}/cancel`, { method: "POST" });
}
