import type {
  AgentDefinition,
  ChatResponse,
  Decision,
  Matter,
  MatterDetail,
  ResearchResult,
  Schedule,
  Stage,
  VaultDocument,
} from "./types";

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
