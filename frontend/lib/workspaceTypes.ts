import type { IssueAnalysisStatus, DecisionPathPrefill } from "./decisionMapTypes";
// Shared workspace projections. Keep aligned with backend/app/models/workspace.py.
import type { ReactNode } from "react";

export interface BusinessQuestion {
  question_id: string;
  text: string;
  revision: string;
  dossier_revision?: string | null;
  origin?: 'provisional_agent' | 'explicit_lawyer' | 'accepted_proposal' | 'legacy_unknown';
  source_message_id?: string | null;
  source_action_key?: string | null;
  updated_at?: string | null;
}

export interface QuestionCommand {
  text: string;
  expected_revision: string;
  source_action_key: string;
  expected_dossier_revision?: string | null;
  source_message_id?: string | null;
  run_id?: string | null;
  reason?: string;
}

export interface QuestionChange {
  proposal_id: string;
  question_id: string;
  expected_revision: string;
  expected_dossier_revision?: string | null;
  text: string;
  reason?: string;
  source_message_id?: string | null;
  source_action_key: string;
  state?: 'proposed' | 'applied' | 'rejected' | 'superseded' | 'failed';
  revision_path?: string | null;
  created_at?: string | null;
}

export interface ProposalAction {
  action: 'apply' | 'reject';
  expected_revision: string;
  source_action_key: string;
  text?: string | null;
  source_message_id?: string | null;
}

export interface QuestionRestore {
  revision: string;
  expected_revision: string;
  source_action_key: string;
  source_message_id?: string | null;
}

export interface SelectedRange {
  start: number;
  end: number;
  text: string;
  prefix?: string;
  suffix?: string;
}

export interface ConversationTarget {
  condition_id?: string | null;
  analysis_id?: string | null;
  analysis_revision?: string | null;
  option_id?: string | null;
  option_revision?: string | null;
  matter_id: string;
  business_question_id?: string | null;
  business_question_revision?: string | null;
  issue_id?: string | null;
  source_id?: string | null;
  scenario_id?: string | null;
  artifact_path?: string | null;
  artifact_revision?: string | null;
  artifact_review_revision?: string | null;
  selected_range?: SelectedRange | null;
  local_draft_snapshot?: string | null;
}

export interface InteractionReceipt {
  receipt_id: string;
  source_action_key: string;
  operation: string;
  target: ConversationTarget;
  state: 'applied' | 'proposed' | 'not_saved';
  before_revision?: string | null;
  after_revision?: string | null;
  source_message_id?: string | null;
  run_id?: string | null;
  changed_links?: Array<string>;
  completed_parts?: Array<string>;
  failure_detail?: string | null;
  created_at?: string | null;
}

export type IssueDispositionState = 'unresolved' | 'mitigation_in_progress' | 'resolved' | 'risk_accepted' | 'not_applicable';
export interface IssueDispositionRecord {
  disposition_id: string;
  disposition: IssueDispositionState;
  reason: string;
  actor_id: string;
  actor_name: string;
  recorded_at: string;
  source_action_key: string;
  issue_revision: string;
  action?: 'recorded' | 'reopened';
  linked_work_item_ids?: string[];
  linked_decision_ids?: string[];
  supersedes_disposition_id?: string | null;
}

export interface IssueNode {
  issue_id: string;
  parent_issue_id?: string | null;
  title: string;
  why_it_matters?: string;
  fact_ids?: Array<string>;
  assumption_ids?: Array<string>;
  claim_ids?: Array<string>;
  claim_output_revisions?: Record<string, string>;
  lawyer_state?: 'open' | 'explored' | 'set_aside';
  disposition?: IssueDispositionState | null;
  disposition_reason?: string;
  disposition_history?: IssueDispositionRecord[];
  linked_work_item_ids?: string[];
  linked_decision_ids?: string[];
  priority_reason?: string;
  next_action?: string;
  action_owner?: string;
  updated_at?: string | null;
}

export interface IssueUpdate {
  expected_revision: string;
  title?: string | null;
  parent_issue_id?: string | null;
  lawyer_state?: 'open' | 'explored' | 'set_aside' | null;
  why_it_matters?: string | null;
}

export interface IssueDispositionCommand {
  workflow?: boolean;
  chosen_path?: string;
  conditions?: string[];
  map_basis?: import('./decisionMapTypes').DecisionMapBasis | null;
  follow_up?: Array<{ title: string; owner: string; due_at?: string | null; required: boolean }>;
  revises_decision_id?: string | null;
  disposition: IssueDispositionState;
  reason: string;
  expected_revision: string;
  source_action_key: string;
  linked_work_item_ids?: string[];
  linked_decision_ids?: string[];
}

export interface IssueDispositionResult {
  issue: IssueNode;
  receipt: InteractionReceipt;
}

export interface WorkspaceQuestion {
  question_id: string;
  business_question_id: string;
  business_question_revision: string;
  issue_id?: string | null;
  issue_ids?: string[];
  question_kind?: 'factual' | 'legal';
  linked_fact_ids?: Array<string>;
  answer_origin?: string | null;
  source_message_id?: string | null;
  source_action_key?: string | null;
  source_revision?: string;
  text: string;
  consequence?: string;
  state?: 'open' | 'answered' | 'left_open';
  answer?: string | null;
  answer_kind?: 'reported_fact' | 'legal_analysis' | null;
  answer_source_ids?: string[];
  answer_claim_ids?: string[];
  updated_at?: string | null;
}

export interface SupportingQuestionCommand {
  expected_revision: string;
  source_action_key: string;
  state: 'answered' | 'left_open';
  answer?: string | null;
  answer_kind?: 'reported_fact' | 'legal_analysis' | null;
  answer_source_ids?: string[];
  answer_claim_ids?: string[];
  source_message_id?: string | null;
  run_id?: string | null;
}

export interface ClaimEvidence {
  claim_id: string;
  source_id: string;
  available_excerpt?: string | null;
  locator?: string;
  support_state?: 'supplied' | 'retrieved' | 'verified' | 'unverified_lead' | 'unknown';
  explanation?: string;
  retrieved_at?: string | null;
  source_version?: string | null;
  source_hash?: string | null;
  source_label?: string;
  url?: string | null;
  path?: string | null;
  claim_revision?: string | null;
  output_revision?: string | null;
}

export interface ClaimApplicability {
  regulated_actor?: string;
  jurisdiction?: string;
  fact_ids?: string[];
  assumption_ids?: string[];
  explanation?: string;
}

export interface WorkspaceClaim {
  claim_id: string;
  text: string;
  claim_revision?: string;
  output_revision?: string;
  applicability?: ClaimApplicability;
  evidence: ClaimEvidence[];
  support_gap?: string;
}

export type DocumentKind = 'work_product' | 'source' | 'matter_record';
export type DocumentLifecycleState = 'editing_draft' | 'reading_source' | 'final' | 'approved' | 'matter_record';
export interface DocumentIdentity {
  document_id: string;
  path: string;
  title: string;
  kind: DocumentKind;
  revision: string;
  version_id?: string | null;
  work_product_id?: string | null;
  lifecycle_state: DocumentLifecycleState;
  editable: boolean;
  immutable: boolean;
  original_path?: string | null;
  extracted_path?: string | null;
  source_url?: string | null;
}

export interface ReferenceOrigin {
  surface: 'issue' | 'conversation' | 'decision_map' | 'draft' | 'evidence' | 'document';
  workspace_view?: 'understand' | 'discuss' | 'draft';
  record_id?: string | null;
  document_id?: string | null;
  focus_id?: string | null;
  scroll_offset?: number | null;
}

export interface DocumentReferenceTarget {
  document_id: string;
  path: string;
  revision?: string | null;
  locator?: string;
  available_excerpt?: string | null;
  exact_passage_available?: boolean;
  origin?: ReferenceOrigin | null;
}

export interface ResolvedDocumentReference {
  target: DocumentReferenceTarget;
  document?: DocumentIdentity | null;
  passage_state: 'exact' | 'document_only' | 'missing';
  message?: string;
}

export interface ContextSelection {
  reference_id: string;
  path?: string | null;
  role: string;
  selected?: boolean;
  mandatory?: boolean;
  revision?: string | null;
}

export interface ContextManifestEntry {
  reference_id: string;
  path?: string | null;
  role: string;
  selected?: boolean;
  mandatory?: boolean;
  revision?: string | null;
  state: 'included' | 'truncated' | 'omitted' | 'unavailable';
  reason?: string;
  tool_read_evidence?: Array<string>;
}

export interface RunContextManifest {
  run_id: string;
  matter_id: string;
  entries?: Array<ContextManifestEntry>;
  source_revisions?: Record<string, string>;
  created_at: string;
}

export interface OutputTemplate {
  status?: string;
  failure_detail?: string | null;
  template_id: string;
  skill_id: string;
  kind?: 'output_template';
  name: string;
  output_type: string;
  instructions?: string;
  section_outline?: string;
  audience?: string;
  purpose?: string;
  tone?: string;
  length?: string;
  exclusions?: string;
  source_presentation?: string;
  sample_wording?: string;
  revision: string;
  content_hash: string;
  path: string;
  revision_path?: string | null;
  is_default?: boolean;
  enabled?: boolean;
}

export interface TemplateUse {
  template_id: string;
  output_type: string;
  revision: string;
  content_hash: string;
  revision_path?: string | null;
  instructions_snapshot: string;
  section_outline_snapshot?: string;
  defaults_snapshot?: Record<string, string>;
  overrides?: Record<string, string>;
  state?: 'applied' | 'unavailable' | 'failed';
  failure_detail?: string | null;
}

export interface VersionChange {
  reason: string;
  before_revision?: string | null;
  after_revision?: string | null;
  trigger_fact_ids?: Array<string>;
  trigger_source_ids?: Array<string>;
  instruction?: string;
  affected_analysis?: Array<string>;
}

export interface UpdateOffer {
  offer_id: string;
  artifact_path: string;
  base_revision: string;
  reason: string;
  state?: 'offered' | 'accepted' | 'declined' | 'stale';
  change?: VersionChange | null;
}

export interface WorkProductReference {
  decision_review_required?: boolean;
  work_product_id: string;
  path: string;
  title: string;
  output_type?: string;
  revision: string;
  pending_review?: boolean;
  review_id?: string | null;
  review_revision?: string | null;
  source_run_id?: string | null;
  claim_ids?: Array<string>;
  export_state?: string;
  update_offer?: UpdateOffer | null;
  version_changes?: Array<VersionChange>;
  template_use?: TemplateUse | null;
  preview?: boolean;
  proposal_paths?: string[];
}

export interface DraftRequest {
  instruction: string;
  target: ConversationTarget;
  source_action_key: string;
  business_question_revision: string;
  output_type?: string;
  template_use?: TemplateUse | null;
  audience?: string;
  purpose?: string;
  output_preferences?: Record<string, string>;
  base_revision?: string | null;
  preview?: boolean;
}

export interface DraftResult {
  run_id: string;
  state: string;
  artifact?: WorkProductReference | null;
  proposal_path?: string | null;
  receipt?: InteractionReceipt | null;
}

export interface OutgoingAttachment {
  path: string;
  title: string;
  revision: string;
  relevance: string;
  selected?: boolean;
  reviewed_revision?: string | null;
  export_state?: 'not_exported' | 'exported' | 'failed';
  failure_detail?: string | null;
}

export interface OutsideCounselPacket {
  cover_email?: WorkProductReference | null;
  brief: WorkProductReference;
  attachments?: Array<OutgoingAttachment>;
}

export interface ScenarioFactChange {
  change_id: string;
  fact_id?: string | null;
  text: string;
}

export interface ScenarioOutcome {
  outcome_id: string;
  label: string;
  condition?: string;
  issue_ids?: string[];
  claim_ids?: string[];
  work_item_ids?: string[];
}

export interface ScenarioStaleness {
  is_stale?: boolean;
  changed_revisions?: Record<string, { before?: string | null; after?: string | null }>;
}

export interface Scenario {
  scenario_id: string;
  matter_id: string;
  title: string;
  baseline_revisions: Record<string, string>;
  issue_ids?: Array<string>;
  proposed_fact_changes?: Array<ScenarioFactChange>;
  unresolved_conditions?: Array<string>;
  analysis?: string;
  source_links?: Array<string>;
  created_at: string;
  adopted_fact_ids?: Array<string>;
  related_analysis?: Array<string>;
  analysis_state?: 'not_started' | 'queued' | 'running' | 'completed' | 'failed';
  analysis_run_id?: string | null;
  analysis_source_action_key?: string | null;
  analysis_baseline_revisions?: Record<string, string>;
  affected_issue_ids?: string[];
  affected_branch_ids?: string[];
  claim_ids?: string[];
  proposed_outcomes?: ScenarioOutcome[];
  failure_detail?: string | null;
  stale?: ScenarioStaleness;
  updated_at?: string | null;
  revision?: string;
}

export interface ScenarioCreateCommand {
  title: string;
  baseline_revisions: Record<string, string>;
  issue_ids?: string[];
  proposed_fact_changes?: ScenarioFactChange[];
  source_action_key: string;
}

export interface ScenarioAnalyzeCommand {
  instruction: string;
  expected_scenario_revision: string;
  baseline_revisions: Record<string, string>;
  source_action_key: string;
}

export interface ScenarioAdoptCommand {
  change_ids: string[];
  expected_revisions: Record<string, string>;
  source_action_key: string;
  source_message_id?: string | null;
}

export interface FlowActor {
  actor_id: string;
  label: string;
}

export interface FlowEdge {
  edge_id: string;
  from_actor_id: string;
  to_actor_id: string;
  label: string;
  order: number;
  timing?: string;
  custody?: string;
  ownership?: string;
  fact_ids?: Array<string>;
  uncertainty?: string;
}

export interface Flow {
  matter_id: string;
  revision: string;
  actors?: Array<FlowActor>;
  edges?: Array<FlowEdge>;
}

export interface OutputReadFailure {
  path: string;
  state?: "unavailable";
  message: string;
}

export interface ChangeRecap {
  previous_seen_revision?: string | null;
  current_revision: string;
  changes?: Array<Record<string, unknown>>;
  new_outputs?: Array<string>;
  output_read_failures?: Array<OutputReadFailure>;
}

export interface PracticeNoteLink {
  name?: string;
  skill_id: string;
  matter_id: string;
  applied_revision?: string | null;
}

export interface AssumptionWatchLink {
  title?: string;
  state?: string;
  assumption_labels?: string[];
  decision_titles?: string[];
  watch_id: string;
  matter_id: string;
  assumption_ids?: Array<string>;
  decision_ids?: Array<string>;
}

export interface WorkspaceSnapshot {
  issue_analyses?: Record<string, IssueAnalysisStatus>;
  update_offers?: UpdateOffer[];
  claims?: WorkspaceClaim[];
  answer_claims?: WorkspaceClaim[];
  documents?: DocumentIdentity[];
  matter_id: string;
  revision: string;
  source_revisions?: Record<string, string>;
  question: BusinessQuestion;
  short_answer?: string;
  qualification?: string;
  issues?: Array<IssueNode>;
  review_items?: IssueReviewItem[];
  supporting_question?: WorkspaceQuestion | null;
  questions?: Array<WorkspaceQuestion>;
  pending_reframes?: Array<QuestionChange>;
  question_changes?: Array<QuestionChange>;
  issues_revision?: string;
  receipts?: Array<InteractionReceipt>;
  answer_links?: Array<string>;
  work_products?: Array<WorkProductReference>;
  context_selection?: Array<ContextSelection>;
  run_id?: string | null;
  generated_at?: string | null;
  recap?: ChangeRecap | null;
  stale?: boolean;
}

export type WorkspaceView = "understand" | "discuss" | "draft";
export type WorkspaceAction = "explain" | "stress_test" | "ask_business" | "explore_question";
export interface WorkspaceActionRequest {
  conversation_id?: string | null;
  action: WorkspaceAction;
  instruction: string;
  target: ConversationTarget;
  source_action_key: string;
  context_selection?: ContextSelection[];
}
export interface WorkspaceActionResult { run_id: string; state: string; receipt?: InteractionReceipt | null }
export interface WorkspaceError { code: string; message: string; current_revision?: string; recoverable: boolean }
export interface LocalEditorSnapshot {
  document_id?: string;
  path: string;
  content: string;
  base_revision: string;
  review_revision?: string | null;
  dirty: boolean;
  selected_range: SelectedRange | null;
  recoverable?: boolean;
  updated_at?: string | null;
}
export interface WorkspaceEditorBridge {
  activePath: string | null;
  refreshSignal: number;
  onSnapshot: (snapshot: LocalEditorSnapshot) => void;
  onSaved: (artifact: WorkProductReference) => void;
  onOpenArtifact: (path: string) => void;
}
export interface WorkspaceActions {
  onTargetChange: (target: ConversationTarget | null) => void;
  onAction: (request: WorkspaceActionRequest) => Promise<WorkspaceActionResult>;
  onOpenArtifact: (path: string) => void;
  onOpenEvidence: (evidence: ClaimEvidence) => void;
}
export type IssueUpdateCallback = (issueId: string, command: IssueUpdate) => Promise<IssueNode[]>;
export interface IssueReviewItem {
  issue_id: string;
  reason: string;
  actor: string;
  action_label: string;
  state: 'needs_attention' | 'agent_work' | 'complete' | 'failed' | 'overdue';
  saved_order: number;
  due_at?: string | null;
}
export interface LinkedIssueWork {
  reviewRequired?: boolean;
  work_item_id: string;
  title: string;
  state: string;
  owner: string;
  required?: boolean;
}
export interface LinkedIssueDecision {
  revises_decision_id?: string | null;
  map_basis?: import('./decisionMapTypes').DecisionMapBasis | null;
  conditions?: string[];
  decision_id: string;
  title: string;
  chosen_path: string;
  rationale: string;
  decision_maker: string;
  decided_at?: string | null;
}
export interface WorkItemSummaryProps {
  item: IssueReviewItem;
  issue: IssueNode;
  onOpenIssue: (issueId: string) => void;
  onClosePanel: () => void;
}
export interface ReviewOrientationProps {
  question: BusinessQuestion;
  shortAnswer: string;
  qualification?: string | null;
  reviewItems: IssueReviewItem[];
  allIssueCount: number;
  onOpenIssue: (issueId: string) => void;
  onShowAllIssues: () => void;
}
export interface UnderstandPanelProps extends WorkspaceActions {
  snapshot: WorkspaceSnapshot | null;
  loading?: boolean;
  error?: string | null;
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string | null) => void;
  onIssueUpdate?: IssueUpdateCallback;
  onMarkSeen?: (revision: string) => Promise<void>;
  questionHistory?: BusinessQuestion[];
  onQuestionHistory?: () => Promise<BusinessQuestion[]>;
  onQuestionRestore?: (command: QuestionRestore) => Promise<InteractionReceipt>;
  materialFacts?: Array<{ id?: string; text: string; state?: string; source?: string }>;
  businessContext?: string | null;
  sourceActions?: Array<{ label: string; path?: string; evidence?: ClaimEvidence }>;
  onQuestionChange: (command: QuestionCommand) => Promise<InteractionReceipt>;
  onProposalAction: (proposalId: string, command: ProposalAction) => Promise<InteractionReceipt>;
  onQuestionAnswer: (questionId: string, command: SupportingQuestionCommand) => Promise<InteractionReceipt>;
  onRefresh: () => void;
}
export interface IssueNavigatorProps {
  issues: IssueNode[];
  issuesRevision?: string;
  selectedIssueId: string | null;
  onSelect: (issueId: string | null) => void;
  onIssueUpdate?: IssueUpdateCallback;
}
export interface IssueReviewDetailProps {
  onCompleteWork?: (workItemId: string) => Promise<void>;
  analysisStatus?: IssueAnalysisStatus | null;
  onAnalyzePaths?: (issueId: string, recordedPosition?: string) => void;
  onRecordPath?: (prefill: DecisionPathPrefill) => void;
  matterId: string;
  issue: IssueNode;
  issuesRevision: string;
  questions: WorkspaceQuestion[];
  claims: WorkspaceClaim[];
  workItems: LinkedIssueWork[];
  decisions: LinkedIssueDecision[];
  busy?: boolean;
  error?: string | null;
  onIssueUpdate: IssueUpdateCallback;
  onQuestionAnswer: (questionId: string, command: SupportingQuestionCommand) => Promise<InteractionReceipt>;
  onDisposition: (issueId: string, command: IssueDispositionCommand) => Promise<IssueDispositionResult>;
  onOpenEvidence: (evidence: ClaimEvidence) => void;
  onOpenDocument: (target: DocumentReferenceTarget) => void;
  onResearchLegalBasis: (issueId: string) => void;
  onCreateMitigation: (issueId: string) => void;
  onRecordDecision: (issueId: string) => void;
  onDiscuss: (target: ConversationTarget) => void;
  onOpenDecisionMap: (issueId: string) => void;
}
export interface ChangeRecapProps { recap: ChangeRecap | null; onOpenArtifact: (path: string) => void; onMarkSeen: (revision: string) => Promise<void> }
export interface ScenarioPanelProps {
  claims?: WorkspaceClaim[];
  matterId: string; scenarios: Scenario[]; selectedScenarioId: string | null;
  currentRevisions: Record<string, string>; busy?: boolean; error?: string | null;
  onSelect: (scenarioId: string | null) => void;
  onOpenArtifact?: (path: string) => void;
  facts?: Array<{ fact_id: string; text: string; state?: string }>;
  onCorrectFact?: (input: { factId: string | null; replacement: string; expectedRevisions: Record<string, string>; sourceActionKey: string }) => Promise<InteractionReceipt>;
  onCreate: (input: { title: string; baseline_revisions: Record<string, string>; issue_ids: string[]; proposed_fact_changes: ScenarioFactChange[]; source_action_key: string }) => Promise<Scenario>;
  onAnalyze: (scenarioId: string, instruction: string, sourceActionKey: string) => Promise<WorkspaceActionResult>;
  onAdopt: (scenarioId: string, changeIds: string[], expectedRevisions: Record<string, string>, sourceActionKey: string) => Promise<InteractionReceipt>;
}
export interface ScenarioInteractionProps {
  matterId: string;
  scenarios: Scenario[];
  selectedScenarioId: string | null;
  currentRevisions: Record<string, string>;
  initialIssueId?: string | null;
  initialFactId?: string | null;
  onSelect: (scenarioId: string | null) => void;
  onCreate: (command: ScenarioCreateCommand) => Promise<Scenario>;
  onAnalyze: (scenarioId: string, command: ScenarioAnalyzeCommand) => Promise<WorkspaceActionResult>;
  onAdopt: (scenarioId: string, command: ScenarioAdoptCommand) => Promise<InteractionReceipt>;
  onOpenClaim: (claimId: string) => void;
  onOpenDocument: (target: DocumentReferenceTarget) => void;
}
export interface BusinessFlowProps {
  flow: Flow; busy?: boolean;
  onRefresh?: () => Promise<Flow>;
  currentRevisions?: Record<string, string>;
  proposedFactChanges?: Array<{ change_id: string; text: string; edge_id?: string; state?: string }>;
  onAcceptFactChanges?: (changeIds: string[], expectedRevisions: Record<string, string>, sourceActionKey: string) => Promise<InteractionReceipt>;
  onSave: (flow: Flow, expectedRevision: string) => Promise<Flow>;
  onSelectFact: (factId: string) => void;
}
export interface InquiryActionsProps { target: ConversationTarget; busy?: boolean; onAction: WorkspaceActions["onAction"] }
export interface EvidenceDrawerProps { evidence: ClaimEvidence | null; open: boolean; onClose: () => void; onOpenArtifact: (path: string) => void }
export interface ContextTrayProps { selections: ContextSelection[]; manifest: RunContextManifest | null; onChange: (selections: ContextSelection[]) => Promise<void>; busy?: boolean }
export interface MatterFileEntry {
  reference_id: string; path: string; name: string; kind: string; source_id?: string | null;
  original_path?: string | null; extracted_path?: string | null; saved_at?: string | null;
  extraction_state: "pending" | "complete" | "partial" | "failed" | "unsupported" | "not_applicable";
  failure_detail?: string | null; selected: boolean; revision?: string | null;
}
export interface MatterFilesPanelProps extends ContextTrayProps {
  open: boolean; files: MatterFileEntry[]; onClose: () => void;
  onUpload: (files: File[], destination: "library" | "inquiry") => Promise<FileUploadBatch | void>;
  onOpenArtifact: (path: string) => void; onRetryFile: (referenceId: string) => Promise<void>;
  folderView?: ReactNode;
}
export interface DocumentNavigatorProps {
  documents: DocumentIdentity[];
  activeDocumentId: string | null;
  activeDocumentPath?: string | null;
  activeDocumentRevision?: string | null;
  matterRecordsExpanded?: boolean;
  onOpen: (document: DocumentIdentity) => void;
  onCreateWorkingCopy: (document: DocumentIdentity) => void;
}
export interface DocumentTabsProps {
  documents: DocumentIdentity[];
  activeDocumentId: string | null;
  localEdits: Record<string, LocalEditorSnapshot>;
  onSelect: (documentId: string) => void;
  onClose: (documentId: string) => void;
  onDiscardLocalEdit: (documentId: string) => void;
}
export interface ReferencePreviewProps {
  target: DocumentReferenceTarget | null;
  document: DocumentIdentity | null;
  loading?: boolean;
  error?: string | null;
  onBack: (origin: ReferenceOrigin) => void;
  onOpenOriginal: (document: DocumentIdentity) => void;
  onUseInRequest: (document: DocumentIdentity) => void;
  onCreateWorkingCopy: (document: DocumentIdentity) => void;
}
export interface DocumentPanelProps {
  activeDocument?: DocumentIdentity | null;
  activePath: string | null;
  contextKey?: string;
  humanActor?: { person_id: string; display_name: string };
  refreshSignal?: number;
  localEdit?: LocalEditorSnapshot | null;
  actionTargetDocumentId?: string | null;
  referenceTarget?: DocumentReferenceTarget | null;
  onSnapshot?: (snapshot: LocalEditorSnapshot) => void;
  onSaved?: (document?: DocumentIdentity) => void;
  onUpload: (file: File) => Promise<void>;
  onAskAgent?: (targetDocumentId?: string) => void;
  onOpenReference?: (target: DocumentReferenceTarget) => void;
  onClose?: () => void;
  onCollapse?: () => void;
  activeReviewAuthor: string;
  lawyerAuthor: string;
  onReviewAuthorChange: (name: string) => void;
}
export interface PriorWorkCandidate { date?: string | null; status?: string; kind?: string; snippet?: string; matter_id: string; title: string; path: string; relevance: string; differences: string[]; revision: string }
export interface PriorWorkPanelProps { candidates: PriorWorkCandidate[]; busy?: boolean; onSearch: (query: string) => Promise<void>; onInclude: (candidate: PriorWorkCandidate) => Promise<void>; onOpenArtifact: (path: string) => void }
export interface PracticeNotePanelProps { links: PracticeNoteLink[]; busy?: boolean; builder?: ReactNode; onDraft: (instruction: string) => Promise<void>; onApply: (skillId: string) => Promise<void>; onOpen: (skillId: string) => void }
export interface AssumptionWatchPanelProps { assumptions?: Array<{ assumption_id: string; text: string }>; links: AssumptionWatchLink[]; busy?: boolean; builder?: ReactNode; onDraft: (assumptionIds: string[]) => Promise<void>; onOpen: (watchId: string) => void }
export type TemplatePreviewCallback = (template: OutputTemplate, overrides: Record<string, string>) => Promise<DraftResult>;
export interface OutputTemplateLibraryProps {
  onOpenArtifact?: (path: string) => void;
  templates: OutputTemplate[]; selectedTemplateId: string | null; busy?: boolean;
  onSelect: (template: OutputTemplate) => void; onCreate: () => void;
  onEdit: (template: OutputTemplate) => void; onDuplicate: (template: OutputTemplate) => Promise<OutputTemplate>;
  onSetDefault: (template: OutputTemplate) => Promise<void>;
  onPreview: TemplatePreviewCallback;
}
export type OutputTemplateEditable = Pick<OutputTemplate, "name" | "output_type" | "instructions" | "section_outline" | "audience" | "purpose" | "tone" | "length" | "exclusions" | "source_presentation" | "sample_wording" | "enabled">;
export interface OutputTemplateEditorProps { onOpenArtifact?: (path: string) => void; template: OutputTemplate; busy?: boolean; onSave: (changes: OutputTemplateEditable, expectedRevision: string) => Promise<OutputTemplate>; onCancel: () => void; onPreview: TemplatePreviewCallback }
export interface ConversationDockProps {
  matterId: string; target: ConversationTarget | null; onTargetChange: WorkspaceActions["onTargetChange"];
  receipts: InteractionReceipt[]; children: ReactNode; busy?: boolean;
  onOpenArtifact: (path: string) => void;
}
export interface DraftWorkspaceProps {
  target?: ConversationTarget | null;
  businessQuestionRevision?: string | null;
  onKeepPreview?: (artifact: WorkProductReference) => Promise<void>;
  onUpdateOfferAction?: (artifact: WorkProductReference, action: "accept" | "decline") => Promise<void>;
  onResolveDraftConflict?: (choice: "retain_copy" | "open_current" | "rebase", artifact: WorkProductReference) => Promise<void>;
  matterId: string; view: WorkspaceView; onViewChange: (view: WorkspaceView) => void;
  understand: ReactNode; conversation: ReactNode; editor: ReactNode;
  artifacts: WorkProductReference[]; activeArtifactPath: string | null;
  onSelectArtifact: (path: string) => void; editorSnapshot: LocalEditorSnapshot | null;
  templates: OutputTemplate[]; selectedTemplateId: string | null;
  onSelectTemplate: (template: OutputTemplate) => void; onOpenTemplates: () => void;
  onPreviewTemplate: TemplatePreviewCallback; onDraft: (request: DraftRequest) => Promise<DraftResult>;
}
export interface FileUploadOutcome { name: string; state: "saved" | "partial" | "failed"; file?: MatterFileEntry | null; failure_detail?: string | null; retry_key: string }
export interface FileUploadBatch { outcomes: FileUploadOutcome[]; destination: "library" | "inquiry" }
