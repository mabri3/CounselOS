import type { AwarenessCardAction, AwarenessChatCard, AwarenessSchedule, AwarenessScheduleUpdate } from "./watchTypes";
export type * from "./watchTypes";

export type StageId = "intake" | "research" | "explore" | "generate" | "respond" | "closed";

export type Stage = {
  id: StageId;
  label: string;
  description?: string;
};

export type MatterSignalKind =
  | "overdue"
  | "agent_working"
  | "execution_unknown"
  | "blocked"
  | "needs_assignment"
  | "ready_for_themis"
  | "waiting_on_owner"
  | "waiting_on_you"
  | "none";

export type NextActor = "themis" | "named_owner" | "unassigned" | "you" | "none";
export type ExecutionState = "queued" | "running" | "not_running" | "unknown";

export type MatterWorkState = {
  next_action: string;
  next_work_item_id: string | null;
  next_owner: string | null;
  next_actor: NextActor;
  due_at: string | null;
  execution_state: ExecutionState;
  active_run_id: string | null;
  execution_note: string;
  signal: { kind: MatterSignalKind; label: string };
};

export type MatterConsistencyIssue = {
  code:
    | "final_with_pre_respond_stage"
    | "approval_without_current_final"
    | "delivery_without_approved_artifact"
    | "closed_without_required_lifecycle_fields";
  summary: string;
  repair: string;
};

export type MatterCreatePayload = {
  title: string;
  request_text: string;
  matter_type: string;
  priority: string;
  target_date: string | null;
  legal_owner: string;
  requester: string;
  description: string;
  source_action_key: string;
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
  risk_level: string | null;
  target_date?: string | null;
  next_action: string;
  durable_decision_needed?: boolean;
  response_approved_at?: string | null;
  response_approved_artifact_path?: string | null;
  response_approved_artifact_id?: string | null;
  response_approved_by?: string | null;
  response_approval_event_path?: string | null;
  response_sent_at?: string | null;
  response_sent_artifact_path?: string | null;
  response_sent_artifact_id?: string | null;
  response_sent_by?: string | null;
  response_delivery_method?: "outside_counsel_os" | null;
  response_delivery_note?: string | null;
  response_delivery_event_path?: string | null;
  closed_at?: string | null;
  closed_by?: string | null;
  closure_event_path?: string | null;
  updated_at: string;
  open_work_items?: number;
  required_work_items?: number;
  work_state: MatterWorkState;
  intake_conversation_id?: string | null;
  intake_run_id?: string | null;
  intake_state?: "active" | "complete" | null;
  active_agent_id?: string | null;
  current_work_product_draft_path?: string | null;
  current_work_product_id?: string | null;
  current_work_product_final_path?: string | null;
  latest_research_path?: string | null;
  current_work_product_final_id?: string | null;
  consistency_issues?: MatterConsistencyIssue[];
  source_action_key?: string | null;
  operation?: string;
  creation_status?: "changed" | "no_change";
  creation_summary?: string;
  operation_result?: OperationResult;
  recommendation?: RecommendationState;
  recommendation_review_needed?: boolean;
  intake_answers?: IntakeAnswer[];
};

export type IntakeAnswer = {
  question_id: string;
  question: string;
  answer: string;
  values: string[];
  status: "answered" | "skipped" | string;
};

export type RecommendationVersion = {
  version_id: string;
  number: number;
  content: string;
  actor: string;
  origin: "initial_agent" | "lawyer_edit" | "agent_proposal";
  created_at: string;
  accepted_at?: string;
  accepted_by?: string;
};

export type RecommendationState = {
  matter_id?: string;
  path: string;
  content: string;
  current_version_id: string | null;
  current_version_number?: number | null;
  versions?: RecommendationVersion[];
  proposal: RecommendationVersion | null;
  changed_paths?: string[];
  dossier_projection?: DossierProjection;
};

export type DossierProjection = {
  state: "applied" | "not_required" | "review_required" | "failed";
  path?: string;
  revision_path?: string;
  error?: string;
};

export type WorkItem = {
  work_item_id: string;
  matter_id: string;
  issue_id?: string | null;
  issue_ids?: string[];
  path: string;
  title: string;
  description: string;
  item_type: string;
  status: string;
  priority: string;
  owner: string;
  due_at?: string | null;
  required: number;
  completed_at?: string | null;
  source_action_key?: string | null;
};

export type IdentifiedOpenQuestion = {
  id: string;
  text: string;
  work_item_id: string | null;
};

export type MatterActionId = "approve_response" | "mark_as_sent" | "close_matter";

export type MatterActionRequest = {
  action: MatterActionId;
  actor: string;
  artifact_path?: string | null;
  work_item_id?: string | null;
  note?: string | null;
};

export type WorkItemCompleteRequest = {
  work_item_id: string;
  actor: string;
};

export type WorkItemAssignRequest = {
  work_item_id: string;
  owner: string;
  actor: string;
};

export type RecommendationDisposition = "followed" | "modified" | "not_followed" | "not_applicable";

export type OperationStatus = "changed" | "no_change" | "failed" | "proposed" | "confirmation_required";

export type OperationResult<TData = unknown> = {
  action: string;
  source_action_key?: string | null;
  operation: string;
  status: OperationStatus;
  summary: string;
  matter_id: string | null;
  entity_refs: Array<{ type: string; id: string; path?: string }>;
  changed_paths: string[];
  resulting_matter_state: Record<string, unknown>;
  available_next_actions: string[];
  required_user_action?: string | null;
  error?: string | null;
  recovery?: string | null;
  dossier_projection?: DossierProjection;
  data?: TData;
};

export type ResearchQueueMutationResult = OperationResult<{
  items: ResearchRun[];
  item: ResearchRun | null;
}> & {
  data: { items: ResearchRun[]; item: ResearchRun | null };
};

export type RecommendationMutationResult = OperationResult<RecommendationState> & {
  data: RecommendationState;
};

export type ParticipantMutationResult = OperationResult<{
  matter_id: string;
  participants: Array<{ name: string; role: string }>;
  changed_paths: string[];
}> & {
  data: {
    matter_id: string;
    participants: Array<{ name: string; role: string }>;
    changed_paths: string[];
  };
};

export type MatterActionResult = OperationResult & {
  matter: MatterDetail;
  event_path?: string | null;
  work_item_id?: string | null;
  already_recorded: boolean;
};

export type WorkProductLifecycleResult = OperationResult & {
  type?: "work_product";
  record_type: "work_product";
  work_product_id: string;
  title: string;
  vault_path: string;
  state: "final";
  summary: string;
  final_id: string;
};

export type WorkProductDraftResult = OperationResult & {
  type?: "work_product";
  record_type: "work_product";
  work_product_id: string;
  title: string;
  vault_path: string;
  state: "draft";
  summary: string;
  changed_paths: string[];
};

export type Decision = {
  map_basis?: import("./decisionMapTypes").DecisionMapBasis | null;
  request_fingerprint?: string;
  decision_id: string;
  matter_id: string;
  path: string;
  title: string;
  chosen_path: string;
  rationale: string;
  conditions: string[];
  not_decided: string[];
  decision_maker: string;
  decided_at?: string | null;
  next_review_at?: string | null;
  risk_level: string;
  review_status: "fresh" | "current" | "review_recommended" | "stale";
  staleness_reason: string;
  recommendation_disposition?: RecommendationDisposition;
  recommendation_disposition_reason?: string;
  recommendation_version_id?: string | null;
};

export type FileNode = {
  name: string;
  label?: string;
  path: string;
  type: "folder" | "file";
  extension?: string;
  updated_at?: number;
  record_type?: string;
  state?: "draft" | "final" | string;
  children?: FileNode[];
};

export type MatterDetail = Matter & {
  original_request: string;
  orientation: {
    headline: string;
    summary: string;
    decision_question: string;
    open_questions: string[];
    open_question_items: IdentifiedOpenQuestion[];
    why_now: string;
    next_action: string;
    attention: string[];
    recent_changes: string[];
    options?: string[];
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

export type DocumentReviewSegment = {
  kind: "equal" | "insert" | "delete";
  text: string;
  change_id: string;
  author_id: string;
  author_name: string;
  author_color: string;
  created_at: string;
  replaced_text?: string;
  replaced_segments?: DocumentReviewSegment[];
};

export type ReviewAuthor = { author_id: string; name: string; color: string };

export type DocumentReviewChange = {
  change_id: string;
  old_text: string;
  new_text: string;
  author_id: string;
  author_name: string;
  author_color: string;
  created_at: string;
};

export type DocumentCommentEntry = {
  comment_id: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export type DocumentComment = {
  thread_id: string;
  quote: string;
  anchor_start: number;
  anchor_end: number;
  resolved: boolean;
  resolved_at: string;
  resolved_by: string;
  entries: DocumentCommentEntry[];
};

export type DocumentReview = {
  revision?: string;
  artifact_revision?: string;
  path: string;
  tracking: boolean;
  authors: ReviewAuthor[];
  segments: DocumentReviewSegment[];
  changes: DocumentReviewChange[];
  comments: DocumentComment[];
  comment_events: { event_id: string; thread_id: string; action: string; actor: string; created_at: string }[];
};

export type DocumentReviewAction = {
  source_action_key?: string;
  expected_revision?: string;
  expected_review_revision?: string;
  action: "set_tracking" | "save_revision" | "save_untracked" | "set_author_color" | "add_comment" | "reply_comment" | "edit_comment" | "delete_comment_entry" | "resolve_comment" | "reopen_comment" | "delete_comment_thread" | "delete_resolved_comments" | "accept_change" | "reject_change";
  enabled?: boolean;
  content?: string;
  author_id?: string;
  author_name?: string;
  author_color?: string;
  thread_id?: string;
  body?: string;
  color?: string;
  change_id?: string;
  comment_id?: string;
  quote?: string;
  anchor_start?: number;
  anchor_end?: number;
};

export type ResearchResult = {
  summary: string;
  path: string;
  warning?: string | null;
  internal_sources: number;
  external_sources: number;
  external_authority_retrieved: boolean;
  public_research_status: "not_requested" | "retrieved" | "unavailable" | "failed";
  research_warnings: string[];
  dossier_projection?: DossierProjection;
};

export type ToolTrace = {
  tool: string;
  status: "success" | "error";
  summary: string;
  mutation_status?: "changed" | "no_change" | "failed" | null;
};

export type AppliedSkillSummary = { skill_id: string; name: string };

export type ChatChoice = { value: string; label: string; suggested?: boolean };
export type ChatCard =
  | { type: "question"; question_id: string; text: string; reason?: string | null; selection_mode: "single" | "multiple" | "free_text"; choices: ChatChoice[]; progress_current?: number | null; progress_total?: number | null; allow_skip: boolean; allow_stop: boolean; conflict: boolean; record_target?: "fact" | "jurisdiction_scope" | "product_area" | "business_team" | "matter_type" | "target_date" | "requester" | "business_owner" | "risk_level" }
  | { type: "matter_update"; action_id: string; summary: string; changed_sections: string[]; can_edit: boolean; can_undo: boolean }
  | { type: "research_status"; run_id: string; state: "queued" | "running" | "completed" | "failed" | "interrupted"; total: number; completed: number; status: string; dossier_effect: string }
  | { type: "work_product"; preview?: boolean; title: string; vault_path: string; state: "draft" | "final"; summary: string }
  | AwarenessChatCard;

export type AttachmentReference = { source_id: string; path: string; name: string; version?: string };
export type CardAnswer = { card_id: string; action: "answer" | "skip"; values: string[] };
export type CardAction = { card_id: string; action: "answer" | "answer_set" | "skip" | "stop" | "edit" | "undo" | "apply" | "preview" | AwarenessCardAction; values?: string[]; answers?: CardAnswer[] };
export type QuestionMode = "guided" | "set";

export type ChatResponse = {
  reply: string;
  conversation_id?: string | null;
  trace: ToolTrace[];
  changed_paths: string[];
  refresh: string[];
  cards: ChatCard[];
  applied_skills: AppliedSkillSummary[];
  review_author?: string | null;
  operation_results: OperationResult[];
};

export type ChatRunState = "queued" | "running" | "completed" | "failed" | "interrupted";
export type ChatRunFailureClass = "provider" | "timeout" | "output_shape" | "tool_validation" | "tool_execution" | "interrupted" | "unknown";

export type ChatRun = {
  run_id: string;
  matter_id: string;
  conversation_id?: string | null;
  state: ChatRunState;
  status: string;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  failure_detail?: string | null;
  failure_class?: ChatRunFailureClass | null;
  correlation_id?: string | null;
  milestone?: string | null;
  operation_results?: OperationResult[];
  response?: ChatResponse | null;
  path: string;
  selection?: {
    agent_id: string;
    provider: string;
    model: string;
    reasoning_effort: string;
  } | null;
};

export type ChatHistoryMessage = {
  workspace_action?: string | null;
  message_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  trace: ToolTrace[];
  cards?: ChatCard[];
  attachments?: AttachmentReference[];
  applied_skills?: AppliedSkillSummary[];
  operation_results?: OperationResult[];
};

export type SkillDefinition = {
  skill_id: string;
  name: string;
  description: string;
  instructions: string;
  enabled: boolean;
  path: string;
};

export type SkillQuestion = {
  question_id: "job" | "success" | "inputs" | "output" | "rules" | "anything_else";
  text: string;
  choices: string[];
  selection_mode: "single" | "multiple" | "free_text";
  allow_skip: boolean;
  allow_build_now: boolean;
  selected?: string | string[] | null;
};

export type SkillDraft = Pick<SkillDefinition, "skill_id" | "name" | "description" | "instructions">;
export type SkillDraftRequest = { goal: string; answers: Record<string, string | string[]> };
export type SkillDraftResponse = { draft: SkillDraft; warning?: string | null };
export type SkillEvidence = { message_id: string; content: string; created_at: string; scope: string };
export type SkillSuggestion = { name: string; description: string; goal: string; evidence: SkillEvidence[] };
export type SkillSuggestionsResponse = { suggestions: SkillSuggestion[]; warning?: string | null };
export type SkillCreate = SkillDraft;
export type SkillUpdate = Partial<Pick<SkillDefinition, "name" | "description" | "instructions">>;

export type ResearchRun = { run_id: string; matter_id: string; question_id?: string; question?: string; questions?: string[]; queue_order?: number; priority?: number; origin?: string; state: "queued" | "running" | "completed" | "failed" | "interrupted"; total: number; completed: number; status: string; dossier_effect: string; useful_support: number; human_questions_left: number; results?: ResearchResult[]; created_at?: string; queued_at?: string; started_at?: string; finished_at?: string; source_action_key?: string | null; resumed_from_restart?: boolean; stop_reason?: string | null; attempt_count?: number; selection?: { agent_id: string; provider: string; model: string; reasoning_effort: string } | null };
export type CompanyProfile = {
  source_id: string;
  version: string;
  company_name: string;
  website_url: string;
  summary: string;
  business_model: string;
  products_services: string;
  jurisdictions: string;
  regulatory_context: string;
  data_practices: string;
  risk_posture: string;
};

export type AnswerContract = {
  update_proposal?: { state: string; content: string; reason: string };
  path: string;
  content: string;
  metadata: Record<string, unknown>;
  updated_at: number;
  is_default: boolean;
  max_content_chars: number;
};

export type CompanyInterviewQuestion = {
  question_id: string;
  text: string;
  reason: string;
};

export type CompanyInterviewTurn = {
  role: "user" | "assistant";
  content: string;
};

export type CompanyInterview = {
  opening: string;
  question: CompanyInterviewQuestion;
};

export type CompanyInterviewDraft = {
  draft: CompanyProfile;
  reply: string;
  question?: CompanyInterviewQuestion | null;
  complete: boolean;
  website_used: boolean;
  warning?: string | null;
};

export type MatterFileSettingKey =
  | "matter_files.source_documents_dir"
  | "matter_files.draft_outputs_dir"
  | "matter_files.final_outputs_dir";

export type MatterFileSettings = Record<MatterFileSettingKey, string>;

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
  provider?: string | null;
  model?: string | null;
  reasoning_effort?: string | null;
  runtime_managed?: boolean;
};

export type LegacySchedule = {
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

export type Schedule = LegacySchedule | AwarenessSchedule;

export type ScheduleUpdate = { enabled: boolean } | AwarenessScheduleUpdate;

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
  reasoning_efforts: string[];
};

export type ProviderReadiness = "ready" | "missing" | "unavailable" | "development_only";

export type ModelCatalogProvider = {
  id: string;
  label: string;
  readiness: ProviderReadiness;
  readiness_detail: string;
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

export type VaultInfo = {
  name: string;
  path: string;
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
  technicalDetails: {
    providerLegs: Record<string, unknown>[];
    polarisObservability: Record<string, unknown> | null;
    correlationId: string;
  } | null;
};
