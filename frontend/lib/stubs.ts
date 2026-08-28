/**
 * Presentation vocabulary and defaults that the backend does not model.
 *
 * Persisted settings, tools, audiences, and agent details come from `lib/api.ts`.
 */

import type { AgentDefinition, AgentDetail, Schedule, SettingsSection } from "./types";
import { role } from "./design";

export const DEFAULT_SETTINGS: SettingsSection[] = [
  {
    id: "general",
    label: "General",
    title: "General",
    sub: "How the workspace behaves and how it reads.",
    rows: [
      { id: "h-workspace", kind: "heading", label: "Workspace" },
      { id: "org", config_key: "general.organisation", kind: "text", label: "Organisation", help: "Shown on exports and in the record of every decision.", value: "DemoCo Financial" },
      { id: "tz", config_key: "general.time_zone", kind: "select", label: "Time zone", help: "Due dates, schedules and the daily briefing all follow this.", value: "Europe/London (BST)", options: ["Europe/London (BST)", "America/New_York (EDT)", "UTC"] },
      { id: "week", config_key: "general.working_days", kind: "select", label: "Working days", help: "Automations skip days you don't work.", value: "Monday – Friday", options: ["Monday – Friday", "Sunday – Thursday", "Every day"] },
      { id: "brief", config_key: "general.daily_briefing_time", kind: "radio", label: "Send the daily briefing", help: "When Today is emailed to you if you haven't opened it.", options: ["07:00", "08:30", "Don't email it"], value: "07:00" },
      { id: "h-reading", kind: "heading", label: "Reading" },
      { id: "density", config_key: "general.text_size", kind: "radio", label: "Text size", help: "Applies to matter records, drafts and the register.", options: ["Comfortable", "Compact"], value: "Comfortable" },
      { id: "serif", config_key: "general.serif_long_documents", kind: "toggle", label: "Set long documents in serif", help: "Sans-serif is used for controls either way.", on: true },
      { id: "counts", config_key: "general.show_workspace_metrics", kind: "toggle", label: "Show counts and metrics on the workspace", help: "Turning this off hides the quarter figures.", on: true },
    ],
  },
  {
    id: "matters",
    label: "Matters",
    title: "Matters",
    sub: "What a new matter inherits, and what each stage is called.",
    rows: [
      { id: "h-defaults", kind: "heading", label: "Defaults for a new matter" },
      { id: "owner", config_key: "matters.default_owner", kind: "select", label: "Default legal owner", help: "Used when intake can't infer one from the request.", value: "Brian Harris", options: ["Brian Harris", "Miriam Ossai"] },
      { id: "risk", config_key: "matters.default_risk", kind: "select", label: "Default risk", help: "Themis raises this on its own when the facts warrant it.", value: "Medium — until assessed", options: ["Low", "Medium — until assessed", "High"] },
      { id: "target", config_key: "matters.default_target_date", kind: "text", label: "Default target date", help: "Working days from intake.", value: "5 working days" },
      { id: "h-stages", kind: "heading", label: "Stage names" },
      { id: "s-explore", config_key: "matters.explore_stage_label", kind: "text", label: "Waiting on your judgment", help: "What the board calls the stage where research is done.", value: "Waiting on your judgment" },
      { id: "s-respond", config_key: "matters.respond_stage_label", kind: "text", label: "Ready to send", help: "The stage before closed.", value: "Ready to send" },
      { id: "stagelock", config_key: "matters.use_consistent_stage_labels", kind: "toggle", label: "Use the same words everywhere", help: "Board, matter header and chat all read from this list.", on: true },
      { id: "h-privilege", kind: "heading", label: "Privilege" },
      { id: "priv", config_key: "matters.privileged_by_default", kind: "toggle", label: "Mark every matter privileged by default", help: "Adds the header to exports and generated documents.", on: true },
      { id: "watermark", config_key: "matters.watermark_exported_drafts", kind: "toggle", label: "Watermark exported drafts", help: "“Privileged & confidential — draft” on every page.", on: false },
    ],
  },
  {
    id: "agents",
    label: "Agents & model",
    title: "Agents & model",
    sub: "Which models Themis uses, what it may spend, and what it may never do.",
    rows: [
      { id: "h-model", kind: "heading", label: "Model" },
      { id: "provider", config_key: "agents.provider", kind: "select", label: "Provider", help: "Where reasoning runs. The list comes from the providers configured in the backend.", value: "mock", options: ["mock"] },
      { id: "model", config_key: "agents.reasoning_model", kind: "select", label: "Model", help: "Used for research, drafting and the copilot. The list comes from the selected provider.", value: "mock", options: ["mock"] },
      { id: "effort", config_key: "agents.reasoning_effort", kind: "select", label: "Reasoning effort", help: "Higher effort can improve difficult answers but can take more time. Default lets the provider decide.", value: "default", options: ["default"] },
      { id: "cite", config_key: "agents.require_factual_citations", kind: "toggle", label: "Require a citation for every factual claim", help: "Uncited claims are struck from generated work product.", on: true },
      { id: "h-limits", kind: "heading", label: "Limits" },
      { id: "steps", config_key: "agents.max_tool_calls", kind: "text", label: "Maximum tool calls per answer", help: "Themis stops and asks you when it hits this.", value: "12" },
      { id: "spend", config_key: "agents.monthly_spend_ceiling", kind: "text", label: "Monthly spend ceiling", help: "Automations pause when reached; the copilot keeps working.", value: "$400" },
      { id: "h-never", kind: "heading", label: "What agents may never do" },
      { id: "decision_attribution", config_key: "agents.decision_attribution", kind: "toggle", label: "Attribute chat-recorded decisions to the chat", help: "A decision recorded from chat is filed as \"User instructed the chat\", never under your name.", on: true },
      { id: "nosend", config_key: "agents.block_counterparty_send", kind: "toggle", label: "Send anything to a counterparty", help: "Drafts stop in Ready to send.", on: true },
      { id: "nodelete", config_key: "agents.block_source_deletion", kind: "toggle", label: "Delete a source document", help: "Agents may add and annotate, never remove.", on: true },
    ],
  },
  {
    id: "data",
    label: "Data & retention",
    title: "Data & retention",
    sub: "Where the vault lives and how long things are kept.",
    rows: [
      { id: "h-vault", kind: "heading", label: "Where the vault lives" },
      { id: "store", config_key: "data.storage", kind: "select", label: "Storage", help: "Every matter is plain Markdown on disk.", value: "Local disk — ./vault", options: ["Local disk — ./vault"] },
      { id: "backup", config_key: "data.nightly_encrypted_backup", kind: "toggle", label: "Nightly encrypted backup", help: "Keeps 30 days of history.", on: true },
      { id: "h-retention", kind: "heading", label: "Retention" },
      { id: "keep", config_key: "data.closed_matter_retention", kind: "text", label: "Keep closed matters for", help: "After this they are archived, never deleted.", value: "7 years" },
      { id: "chat", config_key: "data.copilot_transcript_retention", kind: "text", label: "Keep copilot transcripts for", help: "The action trace is kept with the matter regardless.", value: "18 months" },
      { id: "h-attestations", kind: "heading", label: "Attestations" },
      { id: "no_training", config_key: "data.provider_no_training_attested", kind: "toggle", label: "Our provider contract forbids training on our content", help: "Recorded, not enforced — this asserts what your contract says. Stamped with who set it and when. The signer is the stored default matter owner because this MVP has no user accounts.", on: false },
    ],
  },
  {
    id: "people",
    label: "People & access",
    title: "People & access",
    sub: "Who can see matters, and who can record a decision.",
    rows: [
      { id: "h-who", kind: "heading", label: "Who is in this workspace" },
      { id: "gc", config_key: "people.brian_harris_role", kind: "select", label: "Brian Harris", help: "General counsel · can record decisions and change settings.", value: "Owner", options: ["Owner", "Lawyer", "Requester"] },
      { id: "mo", config_key: "people.miriam_ossai_role", kind: "select", label: "Miriam Ossai", help: "Counsel · can record decisions.", value: "Lawyer", options: ["Owner", "Lawyer", "Requester"] },
      { id: "pl", config_key: "people.dana_reeve_role", kind: "select", label: "Dana Reeve", help: "Product lead · can raise requests and read matters they raised.", value: "Requester", options: ["Owner", "Lawyer", "Requester"] },
      { id: "selfserve", config_key: "people.company_request_access", kind: "toggle", label: "Let anyone in the company raise a request", help: "They see only the matters they raised.", on: true },
      { id: "h-privlock", kind: "heading", label: "Privilege" },
      { id: "privlock", config_key: "people.lawyer_only_privileged_access", kind: "toggle", label: "Only lawyers can open privileged matters", help: "Requesters see the status, never the record.", on: true },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    title: "Integrations",
    sub: "Where requests come from and where finished work goes.",
    rows: [
      { id: "h-connected", kind: "heading", label: "Connected" },
      { id: "slack", config_key: "integrations.slack_enabled", kind: "toggle", label: "Slack", help: "Raises requests from #legal-help and posts when a matter closes.", on: true },
      { id: "mail", config_key: "integrations.legal_mailbox_enabled", kind: "toggle", label: "legal@verso.com", help: "Reconnect needed — credentials expired.", on: false },
      { id: "drive", config_key: "integrations.contract_store_enabled", kind: "toggle", label: "Contract store", help: "Reads executed agreements; never writes to them.", on: true },
      { id: "h-available", kind: "heading", label: "Available" },
      { id: "cal", config_key: "integrations.calendar_enabled", kind: "toggle", label: "Calendar", help: "Puts target dates and review dates in your calendar.", on: false },
      { id: "sign", config_key: "integrations.esignature_enabled", kind: "toggle", label: "E-signature", help: "Sends approved documents out for signature.", on: false },
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
