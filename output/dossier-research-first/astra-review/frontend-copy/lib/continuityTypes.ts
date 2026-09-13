/** Additive continuity wire contracts. See docs/lawyer-workflow-expansion.contract.md. */
import type { ConversationTarget, InteractionReceipt, ClaimEvidence, UpdateOffer, UnderstandPanelProps, ChangeRecapProps, InquiryActionsProps } from "./workspaceTypes";

export type TeamView = "my_work" | "waiting" | "team";
export type ContinuityOpenTarget = (target: WorkTarget) => void;
/** Parent owns persistence under vault/person/matter. Values survive remount/error. */
export interface ContinuityPanelState {
  contextKey: string;
  drafts: Record<string, string>;
  onDraftChange: (field: string, value: string) => void;
  busy?: boolean;
  error?: string | null;
}
export interface OrientationSummaryProps {
  orientation: Orientation | null;
  loading?: boolean;
  error?: string | null;
  compact?: boolean;
  onOpenTarget: ContinuityOpenTarget;
  onRefresh: () => void;
}
export interface ContinuityUnderstandPanelProps extends UnderstandPanelProps {
  orientation?: Orientation | null;
  onOpenTarget?: ContinuityOpenTarget;
  onFactRequest?: (questionId: string) => void;
  onHandoff?: () => void;
  onCompareSources?: () => void;
}
export interface ContinuityChangeRecapProps extends ChangeRecapProps {
  meaningfulChanges?: MeaningfulChange[];
  firstVisit?: boolean;
  onOpenTarget?: ContinuityOpenTarget;
}
export interface ContinuityInquiryActionsProps extends InquiryActionsProps {
  onFactRequest?: () => void;
  onHandoff?: () => void;
  onCompareSources?: () => void;
}
export interface FactRequestPanelProps extends ContinuityPanelState {
  matterId: string;
  actor: ActionActor;
  question: { question_id: string; text: string; source_revision: string; business_question_revision: string } | null;
  requests: FactRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string | null) => void;
  onCreate: (command: FactRequestCommand) => Promise<FactRequestResult>;
  onEdit: (requestId: string, command: FactRequestEdit) => Promise<FactRequestResult>;
  onAction: (requestId: string, command: FactRequestAction) => Promise<FactRequestResult>;
  onSaveReply: (requestId: string, command: FactReplyCommand) => Promise<FactRequestResult>;
  onRecordReply: (requestId: string, replyId: string, command: RecordReplyCommand) => Promise<FactRequestResult>;
  onReassess: (intent: ReassessmentIntent) => Promise<ContinuityRunResult>;
  onPrepareWording?: (questionId: string, command: ContinuityRunCommand) => Promise<ContinuityRunResult>;
  onOpenTarget: ContinuityOpenTarget;
}
export interface HandoffPanelProps extends ContinuityPanelState {
  actor: ActionActor;
  people: DemoPerson[];
  scope: ScopeSnapshot | null;
  handoffs: Handoff[];
  references: ReferenceSelection[];
  onCreate: (command: HandoffCommand) => Promise<HandoffResult>;
  onAction: (handoffId: string, command: HandoffAction) => Promise<HandoffResult>;
  onPrepareBrief?: (command: ContinuityRunCommand) => Promise<ContinuityRunResult>;
  onOpenTarget: ContinuityOpenTarget;
}
export interface DemoLawyerSwitcherProps {
  roster: DemoRoster;
  actor: ActionActor;
  busy?: boolean;
  onSwitch: (personId: string) => Promise<void>;
}
export interface TeamWorkListProps {
  items: TeamWorkItem[];
  view: TeamView;
  loading?: boolean;
  error?: string | null;
  onViewChange: (view: TeamView) => void;
  onOpenTarget: ContinuityOpenTarget;
}
export interface ChangeImpactPanelProps extends ContinuityPanelState {
  updateOffers?: UpdateOffer[];
  sources: ReferenceSelection[];
  targets: ReferenceSelection[];
  comparisons: SpecComparison[];
  selectedComparisonId: string | null;
  businessQuestionRevision: string;
  onSelectComparison: (comparisonId: string | null) => void;
  onPrepare: (command: ComparisonCommand) => Promise<SpecComparison>;
  onAnalyze: (comparisonId: string, command: ContinuityRunCommand) => Promise<ContinuityRunResult>;
  onRequestUpdate: (comparisonId: string, command: ImpactUpdateCommand) => Promise<ContinuityRunResult>;
  onOfferAction: (offerId: string, action: "accept" | "decline", expectedRevision: string) => Promise<void>;
  onOpenTarget: ContinuityOpenTarget;
  onOpenEvidence: (evidence: ClaimEvidence) => void;
}

export interface DemoPerson {
  person_id: string;
  display_name: string;
  specialty?: string | null;
}

export interface ActionActor {
  person_id: string;
  display_name: string;
  mode: "single" | "demo";
}

export interface DemoRoster {
  enabled?: boolean;
  people?: Array<DemoPerson>;
  revision: string;
  vault_key: string;
}

export interface DemoRosterCommand {
  enabled: boolean;
  people?: Array<DemoPerson>;
  expected_revision: string;
  source_action_key: string;
}

export interface PersonViewState {
  person_id: string;
  revision?: string | null;
  source_revisions?: Record<string, string>;
  output_revisions?: Record<string, string>;
  seen_at?: string | null;
}

export interface WorkTarget {
  matter_id: string;
  kind: "matter" | "work_item" | "question" | "artifact" | "handoff" | "fact_request" | "impact" | "run";
  target_id: string;
  path?: string | null;
  revision?: string | null;
  view?: "understand" | "discuss" | "draft";
}

export interface NextAction {
  action_id: string;
  label: string;
  reason: string;
  state: "ready" | "waiting" | "running" | "failed" | "complete" | "unavailable";
  target: WorkTarget;
  owner_id?: string | null;
  owner_name?: string | null;
  actor_kind?: "lawyer" | "agent" | "business" | "unknown";
  required?: boolean;
  due_at?: string | null;
}

export interface MeaningfulChange {
  change_id: string;
  title: string;
  detail: string;
  basis: "saved_receipt" | "saved_versions" | "hash_only" | "first_visit";
  target?: WorkTarget | null;
  before_text?: string | null;
  after_text?: string | null;
  before_revision?: string | null;
  after_revision?: string | null;
}

export interface Orientation {
  matter_id: string;
  basis_revision: string;
  question_text: string;
  question_preview: string;
  question_is_preview?: boolean;
  answer?: string;
  answer_path?: string | null;
  answer_label?: string;
  caveats?: Array<string>;
  answer_state?: "current" | "stale" | "unavailable";
  primary_action?: NextAction | null;
  secondary_actions?: Array<NextAction>;
  changes?: Array<MeaningfulChange>;
  first_visit?: boolean;
  seen_revision?: string | null;
  current_revision: string;
  warnings?: Array<string>;
}

export interface FactRequestCommand {
  question_id: string;
  expected_question_revision: string;
  business_question_revision: string;
  wording: string;
  requested_person?: string | null;
  due_at?: string | null;
  issue_id?: string | null;
  work_item_id?: string | null;
  source_action_key: string;
}

export interface FactRequestEdit {
  expected_revision: string;
  wording: string;
  requested_person?: string | null;
  due_at?: string | null;
  source_action_key: string;
}

export interface FactRequestAction {
  action: "requested_externally" | "leave_open";
  expected_revision: string;
  source_action_key: string;
}

export interface FactReplyCommand {
  expected_revision: string;
  text: string;
  reported_speaker?: string | null;
  reported_at?: string | null;
  source_action_key: string;
}

export interface RecordReplyCommand {
  expected_revision: string;
  expected_question_revision: string;
  business_question_revision: string;
  answer_text: string;
  coverage: "full" | "partial";
  remaining_question?: string | null;
  supersedes_fact_id?: string | null;
  source_action_key: string;
}

export interface FactReply {
  reply_id: string;
  source_id: string;
  path: string;
  text: string;
  content_hash: string;
  entered_by: ActionActor;
  reported_speaker?: string | null;
  reported_at?: string | null;
  created_at: string;
  linked_fact_ids?: Array<string>;
}

export interface FactRequest {
  request_id: string;
  matter_id: string;
  question_id: string;
  question_text: string;
  question_revision: string;
  business_question_revision: string;
  wording: string;
  requested_person?: string | null;
  due_at?: string | null;
  issue_id?: string | null;
  work_item_id?: string | null;
  created_by: ActionActor;
  created_at: string;
  revision: string;
  state?: "prepared" | "requested_externally" | "reply_saved" | "answer_recorded" | "partly_answered" | "left_open";
  requested_at?: string | null;
  replies?: Array<FactReply>;
  linked_fact_ids?: Array<string>;
  remaining_question?: string | null;
  stale?: boolean;
}

export interface ReassessmentIntent {
  source_action_key: string;
  fact_ids: Array<string>;
  target: ConversationTarget;
}

export interface FactRequestResult {
  request: FactRequest;
  receipt: InteractionReceipt;
  reassessment?: ReassessmentIntent | null;
}

export interface ScopeSnapshot {
  matter_id: string;
  kind: "matter" | "work_item";
  work_item_id?: string | null;
  title: string;
  path: string;
  owner_id?: string | null;
  owner_name?: string | null;
  ownership_revision: string;
  content_revision: string;
  status: string;
}

export interface FrozenReference {
  reference_id: string;
  kind: "source" | "advice" | "recommendation" | "decision" | "draft" | "fact" | "assumption" | "question" | "work_item";
  title: string;
  path: string;
  revision: string;
  content_hash: string;
  text: string;
  snapshot_path?: string | null;
  source_id?: string | null;
  original_path?: string | null;
  original_hash?: string | null;
  extraction_state?: "complete" | "partial" | "failed" | "unavailable" | "not_applicable";
}

export interface ReferenceSelection {
  reference_id: string;
  kind: "source" | "advice" | "recommendation" | "decision" | "draft" | "fact" | "assumption" | "question" | "work_item";
  path: string;
  expected_revision: string;
  title?: string | null;
}

export interface HandoffCommand {
  scope: ScopeSnapshot;
  recipient_id: string;
  ask: string;
  current_basis?: string;
  open_questions?: Array<string>;
  references?: Array<ReferenceSelection>;
  requested_date?: string | null;
  source_action_key: string;
}

export interface HandoffAction {
  action: "accept" | "decline" | "withdraw" | "return";
  expected_revision: string;
  expected_ownership_revision: string;
  expected_content_revision: string;
  reason?: string;
  source_action_key: string;
}

export interface Handoff {
  handoff_id: string;
  matter_id: string;
  path: string;
  sender: ActionActor;
  recipient: DemoPerson;
  scope: ScopeSnapshot;
  ask: string;
  current_basis?: string;
  open_questions?: Array<string>;
  references?: Array<FrozenReference>;
  requested_date?: string | null;
  state?: "pending" | "accepted" | "declined" | "withdrawn";
  prior_handoff_id?: string | null;
  return_handoff_id?: string | null;
  accepted_ownership_revision?: string | null;
  revision: string;
  created_at: string;
  reason?: string;
  stale?: boolean;
  result_paths?: Array<string>;
}

export interface HandoffResult {
  handoff: Handoff;
  reciprocal_handoff?: Handoff | null;
  receipt: InteractionReceipt;
}

export interface TeamWorkItem {
  item_id: string;
  matter_id: string;
  matter_title: string;
  title: string;
  state: string;
  queue: "my_work" | "waiting" | "team";
  action: NextAction;
  handoff_id?: string | null;
}

export interface ComparisonCommand {
  before?: ReferenceSelection | null;
  after: ReferenceSelection;
  targets?: Array<ReferenceSelection>;
  business_question_revision: string;
  source_action_key: string;
}

export interface ChangedPassage {
  passage_id: string;
  kind: "added" | "deleted" | "changed" | "formatting";
  before_text: string;
  after_text: string;
  before_locator?: string;
  after_locator?: string;
}

export interface ImpactFinding {
  finding_id: string;
  target_id: string;
  effect: "remains_supported" | "changes" | "may_need_review" | "unknown";
  explanation: string;
  support: "linked" | "inferred" | "unavailable";
  passage_ids?: Array<string>;
  affected_section?: string | null;
}

export interface SpecComparison {
  comparison_id: string;
  matter_id: string;
  path: string;
  revision: string;
  actor: ActionActor;
  source_action_key: string;
  before?: FrozenReference | null;
  after: FrozenReference;
  targets?: Array<FrozenReference>;
  question: FrozenReference;
  basis?: Array<FrozenReference>;
  baseline_revisions: Record<string, string>;
  state?: "prepared" | "complete" | "partial" | "unavailable" | "stale";
  difference: "unchanged" | "formatting_only" | "text_changed" | "unavailable";
  passages?: Array<ChangedPassage>;
  analysis?: string;
  findings?: Array<ImpactFinding>;
  coverage_limits?: Array<string>;
  run_id?: string | null;
  created_at: string;
  offer_ids?: Array<string>;
}

export interface ImpactPublication {
  run_id: string;
  text: string;
  findings?: Array<ImpactFinding>;
  coverage_limits?: Array<string>;
}

export interface ImpactUpdateCommand {
  target_id: string;
  expected_comparison_revision: string;
  expected_artifact_revision: string;
  source_action_key: string;
}

export interface ImpactUpdateIntent {
  comparison_id: string;
  target: ConversationTarget;
  instruction: string;
  source_action_key: string;
  offer_id?: string | null;
  requires_working_copy?: boolean;
}

export interface ContinuityRunCommand {
  source_action_key: string;
  conversation_id?: string | null;
  instruction?: string;
}

export interface ContinuityRunResult {
  run_id: string;
  state: string;
  receipt?: InteractionReceipt | null;
}
