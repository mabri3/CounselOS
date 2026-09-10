export type ProviderSelection = "native" | "polaris" | "both";
export type ProviderId = "native" | "polaris";
export type WatchPurpose = "awareness" | "company_impact" | "decision_maintenance";
export type SourceType = "case" | "statute" | "regulation" | "regulator_material" | "government_publication" | "secondary_legal_analysis" | "periodical" | "industry_reporting" | "company_statement" | "market_signal" | "other";
export type SourceRole = "primary" | "secondary" | "discovery_only" | "excluded";
export type AuthorityStatus = "binding" | "persuasive" | "proposed" | "official_nonbinding" | "none" | "unknown";
export type CoverageStatus = "configured" | "checked" | "changed" | "unchanged" | "unavailable" | "failed";
export type ScanStatus = "running" | "success" | "partial" | "failed" | "interrupted";
export type ScheduleStatus = "never_run" | ScanStatus | "skipped";
export type AttentionState = "briefing_only" | "monitor" | "this_week" | "required";
export type SourceSupportState = "supplied" | "retrieved" | "verified" | "unverified_lead";
export type PotentialImpact = "low" | "medium" | "high";
export type ReviewPriority = "today" | "this_week" | "monitor";

export type DateWindow = { start?: string | null; end?: string | null };
export type PublicEntity = { name: string; entity_type: "company" | "organization" | "person" | "product" | "other"; explicitly_public: true };
export type WatchSource = { source_id: string; name: string; canonical_url: string; publisher: string; jurisdiction: string; source_type: SourceType; role: SourceRole; authority_status: AuthorityStatus; coverage_status: CoverageStatus };
export type PublicWatchQuery = { standing_question: string; keywords: string[]; topics: string[]; jurisdictions: string[]; regulators: string[]; courts: string[]; industries: string[]; date_window?: DateWindow | null; public_source_urls: string[]; public_entities: PublicEntity[] };
/** Provider-safe shape after local policy validation. It cannot contain internal scope. */
export type OutboundWatchQuery = Readonly<{ standing_question: string; keywords: readonly string[]; topics: readonly string[]; jurisdictions: readonly string[]; regulators: readonly string[]; courts: readonly string[]; industries: readonly string[]; date_window?: Readonly<DateWindow> | null; public_source_urls: readonly string[]; public_entities: readonly Readonly<PublicEntity>[] }>;
export type InternalScope = { product_ids: string[]; company_paths: string[]; matter_ids: string[]; decision_ids: string[]; mitigation_ids: string[]; lookback_days: number };
export type ProviderCheckpoint = { provider_id: ProviderId; cursor?: string | null; last_observed_at?: string | null; state: Record<string, string | number | boolean | null> };
export type ScheduleRecurrence = { kind: "manual" | "interval" | "daily" | "weekday"; interval_seconds?: number | null; local_time?: string | null; time_zone?: string | null; weekdays: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[] };

export type Watch = { watch_id: string; path: string; title: string; standing_question: string; public_query: PublicWatchQuery; purposes: WatchPurpose[]; sources: WatchSource[]; internal_scope: InternalScope; provider: ProviderSelection; recurrence: ScheduleRecurrence; enabled: boolean; schedule_id?: string | null; briefing: { create_items: boolean; create_digest: boolean; saved_view_id?: string | null }; review: { enabled: boolean; default_attention: AttentionState }; checkpoints: Partial<Record<ProviderId, ProviderCheckpoint>>; last_successful_scan_at?: string | null; status: "draft" | "scanning" | "healthy" | "paused" | "failed" | "needs_review"; revision: number; created_at: string; updated_at: string };
export type WatchDraftCreate = Pick<Watch, "title" | "standing_question" | "public_query" | "purposes" | "provider">;
export type WatchPatch = { expected_revision: number } & Partial<Pick<Watch, "title" | "standing_question" | "public_query" | "purposes" | "sources" | "internal_scope" | "provider" | "recurrence" | "briefing" | "review">>;
export type WatchAnswer = { question_id: string; answer: string | string[]; expected_revision: number };
export type WatchScanRequest = { mode?: "draft" | "manual" };
export type WatchStateRequest = { expected_revision: number };
export type SourceRoleEdit = { source_id: string; role: SourceRole; expected_revision: number };
export type SourceReference = { title: string; canonical_url: string; publisher: string; published_at?: string | null; effective_at?: string | null; locator: string; excerpt: string; support_state: SourceSupportState; warning?: string | null };
export type DevelopmentCandidate = { title: string; canonical_url?: string | null; official_identifier?: string | null; content_hash?: string | null; summary: string; occurred_at?: string | null; sources: SourceReference[]; provider_observation: string };
export type SourceCoverage = { source_id?: string | null; url?: string | null; status: CoverageStatus; message: string };
export type ProviderScanResult = { provider_id: ProviderId; status: ScanStatus; next_checkpoint?: ProviderCheckpoint | null; source_coverage: SourceCoverage[]; candidates: DevelopmentCandidate[]; raw_answer_reference?: string | null; bounded_excerpt: string; warnings: string[] };
export type Scan = { scan_id: string; path: string; watch_id: string; mode: "draft" | "manual" | "scheduled"; status: ScanStatus; watch_revision: number; outbound_query?: OutboundWatchQuery | null; input_checkpoints: Partial<Record<ProviderId, ProviderCheckpoint>>; output_checkpoints: Partial<Record<ProviderId, ProviderCheckpoint>>; provider_results: ProviderScanResult[]; source_coverage: SourceCoverage[]; development_count: number; briefing_item_count: number; review_packet_count: number; warnings: string[]; created_paths: string[]; started_at: string; completed_at?: string | null };
export type ProviderObservation = { provider_id: ProviderId; observed_at: string; content_hash?: string | null; text: string; sources: SourceReference[]; warnings: string[] };
export type Development = { development_id: string; path: string; title: string; canonical_url?: string | null; official_identifier?: string | null; current_content_hash?: string | null; summary: string; legal_status: string; occurred_at?: string | null; supersedes_development_id?: string | null; observations: ProviderObservation[]; created_at: string; updated_at: string };
export type CompanyConnection = { products: string[]; policies: string[]; matters: string[]; decisions: string[]; mitigations: string[]; reason: string };
export type BriefingItem = { item_id: string; path: string; development_id: string; watch_id: string; title: string; summary: string; why_shown: string; topics: string[]; jurisdictions: string[]; sources: SourceReference[]; published_at?: string | null; effective_at?: string | null; read: boolean; saved: boolean; usefulness?: "useful" | "not_useful" | null; company_connection?: CompanyConnection | null; review_packet_id?: string | null; attention_state: AttentionState; potential_impact?: PotentialImpact | null; legal_status: string; revision: number; created_at: string; updated_at: string };

export type BriefingSort = "newest" | "relevance" | "potential_impact" | "primary_sources" | "effective_date" | "unread" | "connected_decisions";
export type BriefingGroup = "none" | "watch" | "topic" | "source" | "jurisdiction" | "date" | "product" | "affected_decision";
export type BriefingQuery = { q: string; watch: string[]; source: string[]; topic: string[]; jurisdiction: string[]; source_type: SourceType[]; source_role: SourceRole[]; status: AttentionState[]; read: "any" | "yes" | "no"; saved: "any" | "yes" | "no"; company_connection: "any" | "yes" | "no"; packet: "any" | "none" | "connected" | "required"; impact?: PotentialImpact | null; legal_status?: string | null; sort: BriefingSort; group: BriefingGroup; view?: string | null; cursor?: string | null; limit: number };
export const BRIEFING_QUERY_KEYS = ["q", "watch", "source", "topic", "jurisdiction", "source_type", "source_role", "status", "read", "saved", "company_connection", "packet", "impact", "legal_status", "sort", "group", "view", "cursor", "limit"] as const;
export type BriefingQueryKey = (typeof BRIEFING_QUERY_KEYS)[number];
export type SavedView = { view_id: string; path: string; name: string; query: BriefingQuery; display: Record<string, string | number | boolean>; revision: number; created_at: string; updated_at: string };
export type SavedViewCreate = Pick<SavedView, "name" | "query" | "display">;
export type SavedViewPatch = { expected_revision: number } & Partial<Pick<SavedView, "name" | "query" | "display">>;
export type Digest = { digest_id: string; path: string; view_id: string; view_name: string; resolved_query: BriefingQuery; item_ids: string[]; title: string; summary: string; warnings: string[]; created_at: string };
export type DigestSchedulePut = { recurrence: ScheduleRecurrence; enabled: boolean; expected_revision: number };
export type ReviewPacket = { packet_id: string; path: string; development_ids: string[]; briefing_item_ids: string[]; potential_impact: PotentialImpact; review_priority: ReviewPriority; attention_state: AttentionState; what_happened: string; legal_status: string; why_surfaced: string; affected_products: string[]; affected_policies: string[]; affected_matters: string[]; affected_decisions: string[]; affected_mitigations: string[]; prior_decision_basis: string; existing_mitigations: string[]; possible_tension: string; timing: string; effective_dates: string[]; sources: SourceReference[]; warnings: string[]; status: "open" | "resolved" | "monitoring"; revision: number; created_at: string; updated_at: string };
export type Mitigation = { mitigation_id: string; matter_id: string; path: string; title: string; description: string; status: "proposed" | "active" | "complete" | "retired"; decision_ids: string[]; owner: string; review_at?: string | null; revision: number; created_at: string; updated_at: string };
export type MitigationCreate = Pick<Mitigation, "title" | "description" | "status" | "decision_ids" | "owner" | "review_at">;
export type MitigationPatch = { expected_revision: number } & Partial<MitigationCreate>;
export type BriefingAskRequest = { question: string };
export type BriefingResearchRequest = { question?: string };

export type BriefingConnectAction =
  | { action: "save_to_matter"; matter_id: string; expected_revision: number }
  | { action: "connect_to_decision"; decision_id: string; expected_revision: number }
  | { action: "create_follow_up"; matter_id: string; title: string; due_at?: string | null; expected_revision: number };
export type ReviewAction =
  | { action: "keep_current"; expected_revision: number; payload: { next_review_at?: string | null; note: string } }
  | { action: "revise_decision"; expected_revision: number; payload: { decision_id: string; matter_id?: string | null; work_item_title: string } }
  | { action: "create_follow_up"; expected_revision: number; payload: { matter_id: string; title: string; due_at?: string | null } }
  | { action: "not_relevant"; expected_revision: number; payload: { reason: string } }
  | { action: "keep_monitoring"; expected_revision: number; payload: { reason: string } };
export type ReviewOutcome = { outcome_id: string; packet_id: string; action: ReviewAction["action"]; payload: Record<string, unknown>; recorded_at: string };
export type DurableResult = { result_id: string; path: string; status: "pending" | "partial" | "success" | "failed"; text: string; warnings: string[]; sources: SourceReference[]; briefing_item_id?: string | null; question?: string; kind?: "research" | "connection"; created_at?: string | null };
export type ProviderCapability = { provider_id: ProviderId; label: string; configured: boolean; available: boolean; warning?: string | null; supported_modes: "watch_scan"[] };

export type WatchDraftCard = { type: "watch_draft"; card_id: string; watch_id: string; status: "pending" | "partial" | "success" | "failed"; title: string; summary: string; warnings: string[]; watch_path?: string | null; vault_path: string; state: "draft"; watch_url: string; allowed_actions: ("save_draft" | "scan_now" | "change_something" | "start_watch")[] };
export type WatchScanCard = { type: "watch_scan"; card_id: string; watch_id: string; scan_id: string; status: "pending" | "partial" | "success" | "failed"; title: string; summary: string; warnings: string[]; vault_path: string; state: "final"; watch_url: string; scan_url: string; allowed_actions: ("open_watch" | "open_scan" | "scan_again")[] };
export type AwarenessChatCard = WatchDraftCard | WatchScanCard;
export type AwarenessCardAction = "save_draft" | "scan_now" | "change_something" | "start_watch" | "open_watch" | "open_scan" | "scan_again";
export type AwarenessSchedule = { schedule_id: string; path: string; title: string; kind: "watch_scan" | "briefing_digest"; agent_id: string; instructions: string; interval_seconds: number; watch_path?: string | null; target_watch_id?: string | null; target_view_id?: string | null; recurrence: ScheduleRecurrence; enabled: boolean; revision: number; last_run_at?: string | null; next_run_at?: string | null; last_status: ScheduleStatus; last_message: string };
export type AwarenessScheduleUpdate = { enabled?: boolean; target_watch_id?: string | null; target_view_id?: string | null; recurrence?: ScheduleRecurrence | null; expected_revision: number };
export type ListResponse<T> = { items: T[]; next_cursor: string | null; total: number; resolved_query?: BriefingQuery | null };
export const AWARENESS_ERROR_STATUS = { not_found: 404, revision_conflict: 409, active_scan_conflict: 409, invalid_provider: 422, invalid_query: 422, invalid_source_role: 422, invalid_url: 422, invalid_recurrence: 422, invalid_time_zone: 422 } as const;
