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
  path: string;
  type: "folder" | "file";
  extension?: string;
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

export type ChatResponse = {
  reply: string;
  trace: ToolTrace[];
  changed_paths: string[];
  refresh: string[];
};

export type AgentDefinition = {
  agent_id: string;
  name: string;
  description: string;
  allowed_tools: string[];
  path: string;
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
