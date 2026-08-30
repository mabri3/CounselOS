import type {
  AgentDefinition,
  AgentDetail,
  AttachmentReference,
  Audience,
  ChatResponse,
  ChatConversation,
  ChatConversationSummary,
  CompanyProfile,
  DailyConversation,
  DailyConversationSummary,
  Decision,
  DocumentReview,
  DocumentReviewAction,
  Matter,
  MatterDetail,
  ResearchNote,
  ResearchResult,
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
  WorkspaceSettings,
} from "./types";
import { DEFAULT_SETTINGS, agentDetailFrom } from "./stubs";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

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
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
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

export async function createMatter(payload: Record<string, unknown>): Promise<MatterDetail> {
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

export async function performMatterAction(
  matterId: string,
  action: "approve_response" | "mark_as_sent" | "close_matter",
): Promise<MatterDetail> {
  return request(`/matters/${encodeURIComponent(matterId)}/actions`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

export async function runResearch(matterId: string, question = ""): Promise<ResearchResult> {
  const query = question ? `?question=${encodeURIComponent(question)}` : "";
  return request(`/matters/${encodeURIComponent(matterId)}/research${query}`, { method: "POST" });
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

export async function startResearchRun(matterId: string, question = ""): Promise<ResearchRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/research-runs`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function getResearchRun(matterId: string, runId: string): Promise<ResearchRun> {
  return request(`/matters/${encodeURIComponent(matterId)}/research-runs/${encodeURIComponent(runId)}`);
}

export async function applyBatchAction(matterId: string, batchId: string, action: "preview" | "apply" | "undo"): Promise<Record<string, unknown>> {
  return request(`/matters/${encodeURIComponent(matterId)}/batches`, {
    method: "POST",
    body: JSON.stringify({ batch_id: batchId, action }),
  });
}

export async function finalizeWorkProduct(matterId: string, draftPath: string): Promise<Record<string, unknown>> {
  return request(`/matters/${encodeURIComponent(matterId)}/work-product/finalize`, {
    method: "POST",
    body: JSON.stringify({ draft_path: draftPath }),
  });
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  return request("/settings/company");
}

export async function saveCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile> {
  return request("/settings/company", { method: "PUT", body: JSON.stringify(profile) });
}

export async function getFile(path: string): Promise<VaultDocument> {
  return request(`/files?path=${encodeURIComponent(path)}`);
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
  return request(`/files/review?path=${encodeURIComponent(path)}`, {
    method: "PUT",
    body: JSON.stringify(action),
  });
}

export function exportFileUrl(path: string, format: "docx" | "pdf"): string {
  return `${API_BASE}/files/export?path=${encodeURIComponent(path)}&format=${format}`;
}

export async function sendChat(payload: Record<string, unknown>): Promise<ChatResponse> {
  return request("/chat", { method: "POST", body: JSON.stringify(payload) });
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
  const catalog = model_catalog ?? { providers: [], warning: "The model catalog is unavailable." };
  const providerValue = typeof values["agents.provider"] === "string" ? values["agents.provider"] : "mock";
  const selectedProvider = catalog.providers.find((provider) => provider.id === providerValue)
    ?? catalog.providers[0];
  const requestedModel = typeof values["agents.reasoning_model"] === "string"
    ? values["agents.reasoning_model"]
    : "";
  const selectedModel = selectedProvider?.models.find((model) => model.id === requestedModel)
    ?? selectedProvider?.models[0];
  const requestedEffort = typeof values["agents.reasoning_effort"] === "string"
    ? values["agents.reasoning_effort"]
    : "default";
  const selectedEffort = selectedModel?.efforts.includes(requestedEffort)
    ? requestedEffort
    : selectedModel?.efforts[0] ?? "default";

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
          const efforts = selectedModel?.efforts ?? ["default"];
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
          : { ...row, value: typeof stored === "string" ? stored : row.value };
      }),
    }));
  const reviewRows = sections.find((section) => section.id === "document-review")?.rows;
  if (reviewRows) {
    const lawyer = reviewRows.find((row) => row.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer";
    const defaultAuthor = reviewRows.find((row) => row.config_key === "document_review.default_author");
    if (defaultAuthor) {
      defaultAuthor.options = ["Themis", lawyer];
      if (!["Themis", lawyer].includes(defaultAuthor.value ?? "")) defaultAuthor.value = "Themis";
    }
  }
  return { model_catalog: catalog, sections };
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
    }),
  });
}

export async function getTools(): Promise<{ tools: ToolDefinition[] }> {
  return request("/automations/tools");
}

export async function getAudiences(): Promise<{ audiences: Audience[] }> {
  return request("/automations/audiences");
}
