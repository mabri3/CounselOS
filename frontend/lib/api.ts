import type {
  AgentDefinition,
  AgentDetail,
  Audience,
  ChatResponse,
  Decision,
  Matter,
  MatterDetail,
  ResearchNote,
  ResearchResult,
  Schedule,
  SettingsPayload,
  Stage,
  ToolDefinition,
  VaultDocument,
  WorkspaceSettings,
} from "./types";
import { DEFAULT_SETTINGS, agentDetailFrom } from "./stubs";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(payload.detail ?? `Request failed: ${response.status}`);
  }
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

export async function getFile(path: string): Promise<VaultDocument> {
  return request(`/files?path=${encodeURIComponent(path)}`);
}

export async function saveFile(document: VaultDocument): Promise<{ status: string; path: string }> {
  return request(`/files?path=${encodeURIComponent(document.path)}`, {
    method: "PUT",
    body: JSON.stringify({ content: document.content, metadata: document.metadata }),
  });
}

export async function sendChat(payload: Record<string, unknown>): Promise<ChatResponse> {
  return request("/chat", { method: "POST", body: JSON.stringify(payload) });
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

export async function createSchedule(payload: Record<string, unknown>): Promise<Schedule> {
  return request("/automations/schedules", { method: "POST", body: JSON.stringify(payload) });
}

export function rawFileUrl(path: string): string {
  return `${API_BASE}/files/raw?path=${encodeURIComponent(path)}`;
}

/* ── Stubs ────────────────────────────────────────────────────────────────
 *
 * The redesign introduces three surfaces the backend cannot answer yet.
 * Each is stubbed here rather than faked in the UI, so the seam is obvious
 * and a later backend change has one place to land.
 */

export async function getSettings(): Promise<WorkspaceSettings> {
  const { values } = await request<SettingsPayload>("/settings");
  return {
    sections: DEFAULT_SETTINGS.map((section) => ({
      ...section,
      rows: section.rows.map((row) => {
        if (!row.config_key || !(row.config_key in values)) return { ...row };
        const stored = values[row.config_key];
        return row.kind === "toggle"
          ? { ...row, on: typeof stored === "boolean" ? stored : row.on }
          : { ...row, value: typeof stored === "string" ? stored : row.value };
      }),
    })),
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
      schedule_text: agent.schedule_text,
    }),
  });
}

export async function getTools(): Promise<{ tools: ToolDefinition[] }> {
  return request("/automations/tools");
}

export async function getAudiences(): Promise<{ audiences: Audience[] }> {
  return request("/automations/audiences");
}
