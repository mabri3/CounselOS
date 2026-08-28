export type StageId = "intake" | "research" | "explore" | "generate" | "respond" | "closed";

export type Stage = {
  id: StageId;
  label: string;
  description?: string;
};

export type Matter = {
  matter_id: string;
  path: string;
  title: string;
  description: string;
  matter_type: string;
  product_area: string;
  business_team: string;
  requester: string;
  legal_owner: string;
  business_owner: string;
  status: StageId;
  priority: string;
  risk_level: string;
  target_date?: string | null;
  next_action: string;
  durable_decision_needed?: boolean;
  response_approved_at?: string | null;
  response_sent_at?: string | null;
  closed_at?: string | null;
  updated_at: string;
  open_work_items?: number;
  required_work_items?: number;
};

export type WorkItem = {
  work_item_id: string;
  matter_id: string;
  path: string;
  title: string;
  description: string;
  item_type: string;
  status: string;
  priority: string;
  owner: string;
  due_at?: string | null;
  required: number;
};

export type Decision = {
  decision_id: string;
  matter_id: string;
  path: string;
  title: string;
  chosen_path: string;
  rationale: string;
  decision_maker: string;
  decided_at?: string | null;
  next_review_at?: string | null;
  risk_level: string;
  review_status: "fresh" | "review_recommended" | "stale";
  staleness_reason: string;
};

export type FileNode = {
  name: string;
  label?: string;
  path: string;
  type: "folder" | "file";
  extension?: string;
  record_type?: string;
  children?: FileNode[];
};

export type MatterDetail = Matter & {
  orientation: {
    headline: string;
    why_now: string;
    next_action: string;
    attention: string[];
    recent_changes: string[];
  };
  work_items: WorkItem[];
  decisions: Decision[];
  tree: FileNode[];
  events: Record<string, unknown>[];
};

export type VaultDocument = {
  path: string;
  name: string;
  content: string;
  metadata: Record<string, unknown>;
  editable: boolean;
  kind: string;
};

export type ResearchResult = {
  summary: string;
  path: string;
  warning?: string | null;
  internal_sources: number;
  external_sources: number;
};

export type ToolTrace = {
  tool: string;
  status: "success" | "error";
  summary: string;
};

export type ChatChoice = { value: string; label: string; suggested?: boolean };
export type ChatCard =
  | { type: "question"; question_id: string; text: string; reason?: string | null; selection_mode: "single" | "multiple" | "free_text"; choices: ChatChoice[]; progress_current?: number | null; progress_total?: number | null; allow_skip: boolean; allow_stop: boolean; conflict: boolean }
  | { type: "matter_update"; action_id: string; summary: string; changed_sections: string[]; can_edit: boolean; can_undo: boolean }
  | { type: "research_status"; run_id: string; state: "queued" | "running" | "completed" | "failed" | "interrupted"; total: number; completed: number; status: string; dossier_effect: string }
  | { type: "work_product"; title: string; vault_path: string; state: "draft" | "final"; summary: string };

export type AttachmentReference = { source_id: string; path: string; name: string; version?: string };
export type CardAction = { card_id: string; action: "answer" | "skip" | "stop" | "edit" | "undo" | "apply" | "preview"; values?: string[] };

export type ChatResponse = {
  reply: string;
  conversation_id?: string | null;
  trace: ToolTrace[];
  changed_paths: string[];
  refresh: string[];
  cards: ChatCard[];
};

export type ChatHistoryMessage = {
  message_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  trace: ToolTrace[];
  cards?: ChatCard[];
  attachments?: AttachmentReference[];
};

export type ResearchRun = { run_id: string; matter_id: string; state: "queued" | "running" | "completed" | "failed" | "interrupted"; total: number; completed: number; status: string; dossier_effect: string; useful_support: number; human_questions_left: number };
export type CompanyProfile = { source_id: string; version: string; summary: string; business_model: string; products_services: string; jurisdictions: string; regulatory_context: string; data_practices: string; risk_posture: string };

export type ChatConversationSummary = {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
};

export type ChatConversation = ChatConversationSummary & {
  path: string;
  messages: ChatHistoryMessage[];
};

export type DailyConversationSummary = {
  day: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
};

export type DailyConversation = DailyConversationSummary & {
  path: string;
  messages: ChatHistoryMessage[];
};

export type AgentDefinition = {
  agent_id: string;
  name: string;
  description: string;
  instructions: string;
  allowed_tools: string[];
  max_steps: number;
  path: string;
  audience_id: string;
  audience_prompt: string;
};

export type Schedule = {
  schedule_id: string;
  path: string;
  title: string;
  agent_id: string;
  kind: string;
  instructions: string;
  interval_seconds: number;
  watch_path?: string | null;
  enabled: number;
  last_run_at?: string | null;
  next_run_at?: string | null;
  last_status: string;
};

/* ── Redesign additions (canvas 4a / 4b / 6a) ─────────────────────────── */

export type SettingKind = "heading" | "toggle" | "select" | "text" | "radio";

export type SettingRow = {
  id: string;
  config_key?: string;
  kind: SettingKind;
  label: string;
  help?: string;
  value?: string;
  options?: string[];
  option_labels?: Record<string, string>;
  on?: boolean;
};

export type ModelCatalogModel = {
  id: string;
  label: string;
  efforts: string[];
};

export type ModelCatalogProvider = {
  id: string;
  label: string;
  models: ModelCatalogModel[];
};

export type ModelCatalog = {
  providers: ModelCatalogProvider[];
  warning?: string | null;
};

export type SettingsSection = {
  id: string;
  label: string;
  title: string;
  sub: string;
  rows: SettingRow[];
};

export type WorkspaceSettings = {
  sections: SettingsSection[];
  model_catalog: ModelCatalog;
};

export type SettingsPayload = {
  values: Record<string, unknown>;
  model_catalog?: ModelCatalog;
};

export type AgentDetail = AgentDefinition & {
  start_description: string;
  state: string;
};

export type Audience = { audience_id: string; label: string; prompt: string };

export type ToolDefinition = { tool_id: string; description: string; path: string };

export type Citation = {
  id: string;
  n: string;
  name: string;
  kind: string;
  quote: string;
  note: string;
};

export type ResearchNote = {
  annotation_id: string;
  source_path: string;
  citation: string;
  who: string;
  created_at: string;
  quote: string;
  question: string;
  answer: string;
  answered: boolean;
};

/** A memo body block. `[n]` citation markers are left inline in the text. */
export type MemoBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; level: number; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string };

export type ResearchMemo = {
  path: string;
  title: string;
  byline: string;
  blocks: MemoBlock[];
  citations: Citation[];
};
