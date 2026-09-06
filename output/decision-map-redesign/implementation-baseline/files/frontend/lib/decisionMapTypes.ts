import type { ReactNode } from "react";
import type { ConversationTarget, DocumentReferenceTarget } from "./workspaceTypes";

export type DecisionMapRecordType =
  | "business_question"
  | "issue"
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
  | "decided_by";

export interface DecisionMapNode {
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
  state?: "active" | "unknown" | "hypothetical" | "historical" | "missing";
}

export interface DecisionMapSnapshot {
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
  issue_id?: string | null;
  question_id?: string | null;
  fact_id?: string | null;
}

export interface DecisionMapProps {
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
  onDiscuss: (target: ConversationTarget) => void;
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
