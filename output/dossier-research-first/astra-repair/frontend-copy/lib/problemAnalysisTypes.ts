export interface ProblemReference {
  kind: "fact" | "source" | "question" | "issue" | "decision";
  record_id: string;
}
export interface ProblemPart {
  key: string; label: string; description: string;
  category: "activity" | "actor" | "relationship" | "flow" | "timing" | "constraint";
  status: "reported" | "assumed" | "disputed" | "unknown";
  references: ProblemReference[];
}
export interface ProblemQuestion {
  key: string; question: string; why_it_matters: string;
  kind: "business" | "fact" | "applicability" | "characterization" | "requirement" | "exception" | "consequence";
  part_keys: string[]; issue_id?: string | null; parent_key?: string | null; depends_on: string[];
  characterizations: string[]; assessment: string; counterpoint: string; answer_changing_fact: string;
  state: "open" | "conditional" | "answered" | "not_relevant";
  priority: "decision_changing" | "supporting" | "deferred";
  references: ProblemReference[];
  next_action: "ask_business" | "research" | "inspect_source" | "none"; next_action_reason: string;
}
export interface ProblemAnalysisReference {
  analysis_id: string; analysis_revision: string; source_path: string; output_revision: string; run_id: string; captured_at: string;
}
export interface SavedProblemAnalysis {
  schema_version: 1; objective: string; proposed_method: string; framing_note: string;
  parts: ProblemPart[]; questions: ProblemQuestion[];
  coverage: { topic: string; reason: string; state: "included" | "not_relevant" | "unresolved"; part_keys: string[]; question_keys: string[] }[];
  changes: { kind: "added" | "reframed" | "split" | "merged" | "retired" | "assessment_changed" | "no_material_change"; prior_question_keys: string[]; current_question_keys: string[]; reason: string; answer_effect: string; references: ProblemReference[] }[];
  alternative_paths: { title: string; proposed_change: string; benefit: string; tradeoff: string; remaining_condition: string; question_keys: string[] }[];
  integrated_answer: string; next_step: string; analysis_id: string; analysis_revision: string;
  matter_id: string; source_path: string; captured_at: string; run_id: string; output_revision: string;
  prior_reference?: ProblemAnalysisReference | null;
  resolved_references: (ProblemReference & { path?: string; text?: string; source_class?: string; availability?: string; revision?: string })[];
  warnings: string[];
}
export interface ProblemAnalysisStatus {
  state: "not_analyzed" | "saved" | "partial" | "needs_review" | "missing" | "historical";
  analysis?: SavedProblemAnalysis | null; reference?: ProblemAnalysisReference | null; warnings: string[];
}
