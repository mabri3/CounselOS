/**
 * Presentation vocabulary and defaults that the backend does not model.
 *
 * Persisted settings, tools, audiences, and agent details come from `lib/api.ts`.
 */

import type { AgentDefinition, AgentDetail, Schedule, SettingsSection } from "./types.ts";
import { role } from "./design.ts";

export const DEFAULT_SETTINGS: SettingsSection[] = [
  {
    id: "agents",
    label: "Model",
    title: "Model",
    sub: "Choose the provider and model that Themis.ai uses.",
    rows: [
      { id: "h-advanced", kind: "heading", label: "Advanced model options" },
      { id: "provider", config_key: "agents.provider", kind: "select", label: "Provider", help: "Where reasoning runs. The list comes from the providers configured in the backend.", value: "mock", options: ["mock"] },
      { id: "model", config_key: "agents.reasoning_model", kind: "select", label: "Model", help: "Used for research, drafting and the copilot. The list comes from the selected provider.", value: "mock", options: ["mock"] },
      { id: "effort", config_key: "agents.reasoning_effort", kind: "select", label: "Reasoning effort", help: "Higher effort can improve difficult answers but can take more time. Default lets the provider decide.", value: "default", options: ["default"] },
    ],
  },
  {
    id: "answer-contract",
    label: "Answer contract",
    title: "Answer contract",
    sub: "The required shape of a finished answer. Changes apply to the next message.",
    rows: [],
  },
  {
    id: "document-review",
    label: "Document review",
    title: "Document review",
    sub: "Choose the lawyer identity and the author used when a browser session starts.",
    rows: [
      { id: "lawyer-name", config_key: "document_review.lawyer_name", kind: "text", label: "Lawyer name", help: "Used for your comments, replies, and review decisions.", value: "Lawyer" },
      { id: "default-review-author", config_key: "document_review.default_author", kind: "select", label: "Default review author", help: "New browser sessions start with Themis.ai or the configured lawyer. A custom author is session-only.", value: "Themis.ai", options: ["Themis.ai", "Lawyer"] },
    ],
  },
  {
    id: "research",
    label: "Research",
    title: "Research fallback",
    sub: "Choose the app-wide public research chain. Credentials and base URLs stay in the environment.",
    rows: [
      { id: "research-primary", config_key: "research.primary_external_provider", kind: "select", label: "Primary external provider", value: "polaris", options: ["polaris", "tavily", "none"] },
      { id: "research-fallback", config_key: "research.fallback_external_provider", kind: "select", label: "External fallback provider", value: "tavily", options: ["polaris", "tavily", "none"] },
      { id: "research-model-enabled", config_key: "research.model_fallback_enabled", kind: "toggle", label: "Use model-only fallback", help: "Preserve useful analysis when no external authority is retrieved.", on: true },
      { id: "research-model-provider", config_key: "research.model_fallback_provider", kind: "select", label: "Model fallback provider", value: "openai_compatible", options: ["openai_compatible"] },
      { id: "research-model", config_key: "research.model_fallback_model", kind: "select", label: "Model fallback model", value: "kimi-k3-fast", options: ["kimi-k3-fast"] },
      { id: "research-timeout", config_key: "research.external_timeout_seconds", kind: "text", label: "External timeout (seconds)", value: "90" },
      { id: "research-retries", config_key: "research.external_retry_count", kind: "text", label: "External retry count", value: "2" },
    ],
  },
  {
    id: "matter-files",
    label: "Files and outputs",
    title: "Files and outputs",
    sub: "Set where source files, drafts, and final work are stored. Each path is relative to its matter and stays inside the vault.",
    rows: [
      { id: "source-documents-dir", config_key: "matter_files.source_documents_dir", kind: "text", label: "Source documents", help: "The folder for files supplied with a matter. This path is relative to each matter and stays inside the vault.", value: "documents" },
      { id: "draft-outputs-dir", config_key: "matter_files.draft_outputs_dir", kind: "text", label: "Draft outputs", help: "The folder for draft work product. This path is relative to each matter and stays inside the vault.", value: "work-product/draft" },
      { id: "final-outputs-dir", config_key: "matter_files.final_outputs_dir", kind: "text", label: "Final outputs", help: "The folder for final work product. This path is relative to each matter and stays inside the vault.", value: "work-product/final" },
    ],
  },
];

/** These three hold for every agent, whatever the tool ticks say. */
export const FIXED_AGENT_RULES = [
  "It records a decision only when you explicitly instruct it to do so.",
  "It can draft a reply. It can never send one to a counterparty.",
  "Everything it writes is labelled as agent-authored work.",
];

export function agentDetailFrom(definition: AgentDefinition, schedules: Schedule[]): AgentDetail {
  const mine = schedules.filter((schedule) => schedule.agent_id === definition.agent_id);
  const failing = mine.some((schedule) => schedule.last_status === "error" || schedule.last_status === "failed");
  const automated = mine.some((schedule) => schedule.enabled === 1);
  const starts: Record<string, string> = {
    "counsel-copilot": "Starts when you send a message in Today or inside a matter.",
    "intake-agent": "Used when new material enters Intake.",
    "research-agent": "Starts when you run research or ask a research question in a matter.",
    "decision-monitor": "Starts when you run a decision review.",
  };
  const automationNote = mine.length === 0
    ? "No automation is assigned."
    : `${mine.length === 1 ? "One automation is" : `${mine.length} automations are`} assigned. Manage timing in Automations.`;
  return {
    ...definition,
    start_description: `${starts[definition.agent_id] ?? "Starts when selected for work."} ${automationNote}`,
    state: failing ? "Failing" : automated ? "Automated" : "On request",
  };
}

export function agentStateColor(state: string): string {
  if (state === "Failing") return role.failure;
  if (state === "Automated") return role.agent;
  return role.healthy;
}
