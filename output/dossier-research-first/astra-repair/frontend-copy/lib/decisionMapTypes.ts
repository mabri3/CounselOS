import type { ReactNode } from "react";
import type { ConversationTarget, DocumentReferenceTarget, WorkspaceClaim } from "./workspaceTypes";

export type DecisionMapRecordType =
  | "business_question"
  | "issue"
  | "legal_test"
  | "condition"
  | "fact"
  | "question"
  | "option"
  | "scenario"
  | "work"
  | "decision";

export type DecisionMapRelationship =
  | "depends_on"
  | "if"
  | "supports"
  | "mitigated_by"
  | "decided_by"
  | "assessed_under"
  | "requires";

export interface DecisionMapNode {
  analysis_id?: string | null;
  analysis_revision?: string | null;
  analysis_path?: string | null;
  output_revision?: string | null;
  group?: string;
  data?: Record<string, unknown>;
  node_id: string;
  record_type: DecisionMapRecordType;
  record_id: string;
  label: string;
  state: string;
  detail?: string;
  source_revision?: string | null;
  issue_ids?: string[];
  claim_ids?: string[];
  hypothetical?: boolean;
  missing_reference?: boolean;
}

export interface DecisionMapEdge {
  edge_id: string;
  from_node_id: string;
  to_node_id: string;
  relationship: DecisionMapRelationship;
  label: string;
  state?: "active" | "inactive" | "unknown" | "hypothetical" | "historical" | "missing";
}

export interface DecisionMapSnapshot {
  issue_analyses?: Record<string, IssueAnalysisStatus>;
  matter_id: string;
  revision: string;
  source_revisions?: Record<string, string>;
  nodes: DecisionMapNode[];
  edges: DecisionMapEdge[];
  selected_issue_id?: string | null;
  missing_references?: string[];
}

export interface DecisionMapLayoutNode extends DecisionMapNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DecisionMapLayout {
  nodes: DecisionMapLayoutNode[];
  edges: DecisionMapEdge[];
  width: number;
  height: number;
}

export interface ScenarioLaunchIntent {
  condition_id?: string | null;
  analysis_id?: string | null;
  analysis_revision?: string | null;
  option_id?: string | null;
  option_revision?: string | null;
  issue_id?: string | null;
  question_id?: string | null;
  fact_id?: string | null;
}

export interface DecisionMapProps {
  analyzingIssueId?: string | null;
  analysisResult?: { issueId: string; message: string; saved: boolean } | null;
  onRefresh?: () => Promise<void>;
  focusedIssueId?: string | null;
  onFocusIssue?: (issueId: string) => void;
  onAnalyzePaths?: (issueId: string) => void;
  onRecordPath?: (prefill: DecisionPathPrefill) => void;
  snapshot: DecisionMapSnapshot;
  layout: DecisionMapLayout;
  selectedNodeId: string | null;
  scope: "neighborhood" | "whole_matter";
  busy?: boolean;
  error?: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onScopeChange: (scope: "neighborhood" | "whole_matter") => void;
  onFit: () => void;
  onOpenDocument: (target: DocumentReferenceTarget) => void;
  onDiscuss: (target: ConversationTarget, prompt?: string) => void;
  onTryDifferentAssumption: (intent: ScenarioLaunchIntent) => void;
  scenarioPanel?: ReactNode;
  selectedNodeDetails?: ReactNode;
  onBackToIssue: (issueId: string) => void;
}

export interface DecisionMapOutlineProps {
  nodes: DecisionMapNode[];
  edges: DecisionMapEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onOpenDocument: (target: DocumentReferenceTarget) => void;
  onDiscuss: (target: ConversationTarget) => void;
}

export interface LegalTest {
  test_id: string; title: string; summary: string;
  kind: "law" | "regulation" | "contract" | "policy" | "legal_test";
  actor?: string; jurisdiction?: string; effective_at?: string;
  exceptions?: string; applicability?: string; claim_ids: string[]; condition_ids: string[];
}
export interface PathCondition {
  answer_choices?: Array<{ label: string; answer: string }>;
  condition_id: string; question: string;
  assessment: "met" | "not_met" | "unknown" | "conflicting";
  assessment_basis: string; fact_ids: string[]; question_ids: string[]; claim_ids: string[];
}
export interface PathEffect {
  target_option_id: string;
  trigger: "agreement" | "implementation_complete" | "condition";
  condition_id?: string | null;
  condition_state?: "met" | "not_met";
  reason: string;
}
export interface IssueOption {
  effects?: PathEffect[];
  option_id: string; option_revision: string; title: string;
  kind: "conditional_path" | "business_alternative" | "clarify";
  condition_summary: string;
  requirements: Array<{ condition_id: string; state: "met" | "not_met" }>;
  combination: "all" | "any" | null; consequence: string; trade_off?: string;
  remaining_work: string[]; recommendation: "candidate" | "recommended";
  risk_assessment?: "not_assessed" | "risk_to_review" | "not_recommended";
  recommendation_reason?: string; claim_ids: string[]; work_item_ids: string[];
}
export interface IssueAnalysis {
  connections?: Array<{ target_issue_id: string; relationship: "depends_on" | "compounds" | "may_resolve" | "shared_condition"; reason: string }> | null;
  schema_version: 1; issue_id: string; analysis_id: string; analysis_revision: string;
  source_path: string; output_revision: string; source_revisions: Record<string, string>;
  input_basis: Record<string, string>; run_id: string; display_title?: string;
  explanation: string; business_effect?: string; tests: LegalTest[];
  conditions: PathCondition[]; options: IssueOption[]; warnings: string[];
}
export interface IssueAnalysisStatus {
  /** Claims from this exact analysis file, even when another output has identical prose. */
  claims?: WorkspaceClaim[];
  issue_id: string;
  state: "not_mapped" | "partial" | "saved" | "needs_review" | "missing" | "historical";
  analysis: IssueAnalysis | null; warnings: string[]; reference?: Record<string, unknown> | null;
}
export interface DecisionMapBasis {
  issue_id: string; analysis_id: string; analysis_revision: string; analysis_path: string;
  output_revision: string; selected_option_id: string; selected_option_revision: string;
  use_historical_basis?: boolean; canonical_option?: IssueOption | null;
  input_basis?: Record<string, string>;
}
export interface DecisionPathPrefill {
  revises_decision_id?: string;
  map_basis: DecisionMapBasis; option: IssueOption; analysis: IssueAnalysis;
  state: IssueAnalysisStatus["state"]; hypothetical?: boolean;
}
