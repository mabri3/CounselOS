"use client";

import {
  useContinuityIdentity,
  continuityKey,
  continuityCommand,
} from "@/lib/continuityApi";
import type { ContinuityIdentity } from "@/lib/continuityApi";
import type {
  Orientation,
  FactRequest,
  FactRequestCommand,
  FactRequestResult,
  Handoff,
  HandoffResult,
  ScopeSnapshot,
  ReferenceSelection,
  SpecComparison,
  WorkTarget,
  ContinuityRunResult,
  ReassessmentIntent,
} from "@/lib/continuityTypes";
import FactRequestPanel from "@/components/workspace/FactRequestPanel";
import HandoffPanel from "@/components/workspace/HandoffPanel";
import ChangeImpactPanel from "@/components/workspace/ChangeImpactPanel";
import OrientationSummary from "@/components/workspace/OrientationSummary";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import {
  getWorkspace,
  changeBusinessQuestion,
  actOnQuestionProposal,
  getQuestionHistory,
  restoreBusinessQuestion,
  answerWorkspaceQuestion,
  recordIssueDisposition,
  resolveWorkspaceDocument,
  saveWorkspaceScenario,
  getDecisionMap,
  documentForReferenceTarget,
  invalidateReferenceResult,
  latestReferenceResult,
  referenceDestination,
} from "@/lib/workspaceApi";
import type { DecisionMapSnapshot } from "@/lib/decisionMapTypes";
import type {
  WorkspaceSnapshot,
  BusinessQuestion,
  InteractionReceipt,
  ConversationTarget,
} from "@/lib/workspaceTypes";
import {
  workspaceCommand,
  templateCommand,
  updateWorkspaceIssue,
  markWorkspaceSeen,
  runWorkspaceAction,
} from "@/lib/workspaceApi";
import type {
  WorkspaceView,
  LocalEditorSnapshot,
  OutputTemplate,
  DraftRequest,
  DraftResult,
  WorkProductReference,
  Scenario,
  Flow,
  MatterFileEntry,
  ContextSelection,
  RunContextManifest,
  ClaimEvidence,
  PriorWorkCandidate,
  PracticeNoteLink,
  AssumptionWatchLink,
  FileUploadBatch,
  OutsideCounselPacket,
  OutgoingAttachment,
  DocumentIdentity,
  DocumentReferenceTarget,
  ReferenceOrigin,
} from "@/lib/workspaceTypes";
import type { ChatRun, AttachmentReference } from "@/lib/types";
import {
  request,
  startChatRun,
  getChatRun,
  retryChatRun,
  getFile,
  uploadDocuments,
  rawFileUrl,
} from "@/lib/api";
import SkillBuilder from "@/components/SkillBuilder";
import WatchBuilder from "@/components/WatchBuilder";
import type { SkillDraft, SkillDefinition } from "@/lib/types";
import { readWorkspaceDraftingPreferences } from "@/lib/workspaceDrafting";
import DraftWorkspace from "@/components/workspace/DraftWorkspace";
import MatterSectionNav from "@/components/workspace/MatterSectionNav";
import matterStyles from "@/components/workspace/MatterA.module.css";
import ConversationDock from "@/components/workspace/ConversationDock";
import UnderstandPanel from "@/components/workspace/UnderstandPanel";
import ScenarioPanel from "@/components/workspace/ScenarioPanel";
import InquiryActions from "@/components/workspace/InquiryActions";
import BusinessFlow from "@/components/workspace/BusinessFlow";
import MatterIcon from "@/components/workspace/MatterIcon";
import MatterFilesPanel from "@/components/workspace/MatterFilesPanel";
import EvidenceDrawer from "@/components/workspace/EvidenceDrawer";
import DocumentNavigator from "@/components/workspace/DocumentNavigator";
import DocumentTabs from "@/components/workspace/DocumentTabs";
import ReferencePreview from "@/components/workspace/ReferencePreview";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import PriorWorkPanel from "@/components/workspace/PriorWorkPanel";
import PracticeNotePanel from "@/components/workspace/PracticeNotePanel";
import AssumptionWatchPanel from "@/components/workspace/AssumptionWatchPanel";
import OutputTemplateLibrary from "@/components/workspace/OutputTemplateLibrary";
import OutputTemplateEditor from "@/components/workspace/OutputTemplateEditor";
import ChatPanel from "@/components/ChatPanel";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DocumentPanel from "@/components/DocumentPanel";
import LinkifiedText from "@/components/LinkifiedText";
import MatterTree from "@/components/MatterTree";
import RecordDecisionModal from "@/components/RecordDecisionModal";
import RecommendationPanel from "@/components/RecommendationPanel";
import ResearchQueuePanel from "@/components/ResearchQueuePanel";
import ReviewPacketPanel from "@/components/ReviewPacketPanel";
import {
  addMatterParticipant,
  createMatterWorkItem,
  getRecommendation,
  getResearchQueue,
  getSettings,
  moveMatter,
  resumeResearchQueue,
  retryResearchItem,
  saveWorkProductDraft,
  startResearchRun,
  stopResearchQueue,
  updateMatterRisk,
  uploadDocument,
} from "@/lib/api";
import { useReviewAuthor } from "@/lib/reviewAuthor";
import {
  researchQueueAggregate,
  shouldPollResearchQueue,
} from "@/lib/researchQueue";
import { dueWord, riskLabel, signalFor, stageLabel } from "@/lib/design";
import {
  completableCurrentWorkItemId,
  controlIdForCurrentWork,
  countUserFacingDocuments,
  currentWorkItemFor,
  matterArtifacts,
  openItemsFor,
  workItemOwnerLabel,
} from "@/lib/matterBrief";
import type { MatterControlId } from "@/lib/matterBrief";
import {
  lifecycleActionNeedsDirectMutation,
  matterAction,
  workflowStateExplanation,
} from "@/lib/matterActions";
import {
  collectEvidence,
  conversationIdFromPath,
  findConversationPath,
  findFileByName,
  isMatchingRecommendationSupplement,
  parseProposedPath,
  participantRoleLabel,
  recommendationIdentity,
  recommendationSummary,
  safeMatterPath,
  shouldApplyCanonicalRecommendation,
} from "@/lib/matter-workspace";
import { beginPendingAction, endPendingAction } from "@/lib/pendingActions";
import type { MatterActionView } from "@/lib/matterActions";
import type {
  DossierProjection,
  MatterDetail,
  RecommendationState,
  ResearchRun,
} from "@/lib/types";
import {
  getMatterMitigations,
  getReviewPackets,
} from "@/lib/watchApi";
import type { Mitigation, ReviewPacket } from "@/lib/watchTypes";
import {
  discardLocalEditorSnapshot,
  readLocalEditorSnapshot,
  recoverableLocalEditorSnapshot,
  resolveDocumentReference,
  writeLocalEditorSnapshot,
} from "@/lib/documentNavigation";

type MatterControl = Omit<MatterActionView, "id" | "category"> & {
  id: MatterControlId;
  category: MatterActionView["category"] | "Work item";
};

type Packet = OutsideCounselPacket & {
  export_results?: Array<{
    path: string;
    output_path?: string;
    export_state: string;
    failure_detail?: string;
  }>;
};
type WorkspaceFact = {
  fact_id: string;
  text: string;
  status?: string;
  source_ids?: string[];
};
type WorkspaceFlow = Flow & {
  source_revisions?: Record<string, string>;
  proposed_fact_changes?: Array<{
    change_id: string;
    text: string;
    edge_id?: string;
    state?: string;
  }>;
};
type WorkspaceReuse = {
  practice_notes: PracticeNoteLink[];
  applied_notes: PracticeNoteLink[];
  watches: Array<{
    watch: { title: string; enabled: boolean };
    link: AssumptionWatchLink;
  }>;
  records: {
    facts: WorkspaceFact[];
    assumptions: Array<{ assumption_id: string; text: string }>;
  };
};
type MatterParticipant = { name: string; role: string };
/**
 * Canvas 2b — question, recommendation, evidence, decision. The copilot and
 * the file tree are collapsed behind buttons; the document sits on the right.
 */
type MatterWorkspaceInput = {
  detail: MatterDetail;
  focusResearch?: boolean;
  initialPath?: string | null;
  initialIssueId?: string | null;
  initialView?: WorkspaceView;
  initialConversationId?: string | null;
  onReload: () => Promise<void>;
};
export default function MatterWorkspace(props: MatterWorkspaceInput) {
  const { identity, error } = useContinuityIdentity();
  if (!identity && !error) return <p role="status">Loading the workspace…</p>;
  const current = identity ?? {
    roster: { vault_key: "unavailable", revision: "", enabled: false },
    actor: {
      person_id: "local-lawyer",
      display_name: "Unattributed lawyer",
      mode: "single" as const,
    },
  };
  const contextKey = continuityKey(
    current.roster.vault_key,
    current.actor.person_id,
    props.detail.matter_id,
    "panels",
  );
  return (
    <MatterWorkspaceContent
      {...props}
      key={contextKey}
      continuityIdentity={current}
      contextKey={contextKey}
    />
  );
}
function MatterWorkspaceContent({
  detail,
  continuityIdentity,
  contextKey,
  focusResearch = false,
  initialPath,
  initialIssueId,
  initialView,
  initialConversationId,
  onReload,
}: {
  detail: MatterDetail;
  continuityIdentity: ContinuityIdentity;
  contextKey: string;
  focusResearch?: boolean;
  initialPath?: string | null;
  initialIssueId?: string | null;
  initialView?: WorkspaceView;
  initialConversationId?: string | null;
  onReload: () => Promise<void>;
}) {
  const initialArtifacts = matterArtifacts(
    detail.tree,
    detail.response_approved_artifact_path,
    detail.current_work_product_draft_path,
    detail.latest_research_path,
    detail.current_work_product_final_path,
  );
  const researchPath =
    initialArtifacts.find((item) => item.kind === "research")?.path ?? null;
  const initialFallback = focusResearch && researchPath ? researchPath : null;
  const documentRequested = Boolean(initialPath || initialFallback);
  const [activePath, setActivePath] = useState<string | null>(() =>
    safeMatterPath(initialPath, detail.path, initialFallback),
  );
  const documentVisible = Boolean(activePath);
  const [treeActivePath, setTreeActivePath] = useState<string | null>(() =>
    documentRequested
      ? safeMatterPath(initialPath, detail.path, initialFallback)
      : null,
  );
  const [recommendation, setRecommendation] = useState<string>(
    () => detail.recommendation?.content.trim() ?? "",
  );
  const [recommendationState, setRecommendationState] =
    useState<RecommendationState | null>(detail.recommendation ?? null);
  const recommendationStateRef = useRef<RecommendationState | null>(
    detail.recommendation ?? null,
  );
  const recommendationIdentityRef = useRef(
    recommendationIdentity(detail.matter_id, detail.recommendation),
  );
  const [participantName, setParticipantName] = useState("");
  const [participantRole, setParticipantRole] = useState("participant");
  const [visibleParticipants, setVisibleParticipants] = useState<
    MatterParticipant[]
  >(
    () =>
      (detail as MatterDetail & { participants?: MatterParticipant[] })
        .participants ?? [],
  );
  const [ownerOverrides, setOwnerOverrides] = useState<Record<string, string>>(
    {},
  );
  const [pendingActions, setPendingActions] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState({ text: "", revision: 0 });
  const [conversationSeed, setConversationSeed] = useState({
    conversationId: "",
    revision: 0,
  });
  const [middleSection, setMiddleSection] = useState<"overview" | "chat">(() =>
    detail.intake_state === "active" ? "chat" : "overview",
  );
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionNotice, setActionNotice] = useState("");
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
  const [questionEdit, setQuestionEdit] = useState<string | null>(null);
  const [questionBase, setQuestionBase] = useState("");
  const [questionHistory, setQuestionHistory] = useState<BusinessQuestion[]>(
    [],
  );
  const [workspaceNotice, setWorkspaceNotice] = useState("");
  const [businessQuestionDraft, setBusinessQuestionDraft] = useState<{
    matterId: string;
    text: string;
  } | null>(null);
  const [workspaceBusy, setWorkspaceBusy] = useState(false);
  const questionAction = useRef({ signature: "", key: "" });
  const [conversationTarget, setConversationTarget] =
    useState<ConversationTarget | null>(null);
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>(
    initialView ?? (detail.intake_state === "active" ? "discuss" : "understand"),
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    initialIssueId ?? null,
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );
  const [editorSnapshot, setEditorSnapshot] =
    useState<LocalEditorSnapshot | null>(null);
  const [editorRefresh, setEditorRefresh] = useState(0);
  const [templates, setTemplates] = useState<OutputTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [packet, setPacket] = useState<Packet | null>(null);
  const [outgoing, setOutgoing] = useState<OutgoingAttachment[]>([]);
  const [packetReviewed, setPacketReviewed] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<OutputTemplate | null>(
    null,
  );
  const [activeEvidence, setActiveEvidence] = useState<ClaimEvidence | null>(
    null,
  );
  const [openDocuments, setOpenDocuments] = useState<DocumentIdentity[]>([]);
  const [localEdits, setLocalEdits] = useState<
    Record<string, LocalEditorSnapshot>
  >({});
  const [referenceTarget, setReferenceTarget] =
    useState<DocumentReferenceTarget | null>(null);
  const [referenceDocument, setReferenceDocument] =
    useState<DocumentIdentity | null>(null);
  const [referenceError, setReferenceError] = useState("");
  const referenceGeneration = useRef(0);
  const referenceReturnView = useRef<WorkspaceView | null>(null);
  const initialIssueFocusDone = useRef(false);
  const [mitigationIssueId, setMitigationIssueId] = useState<string | null>(
    null,
  );
  const [mitigationDraft, setMitigationDraft] = useState({
    title: "",
    description: "",
    owner: "",
  });
  const mitigationActionKey = useRef<string | null>(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [files, setFiles] = useState<MatterFileEntry[]>([]);
  const [selections, setSelections] = useState<ContextSelection[]>([]);
  const [selectionRevision, setSelectionRevision] = useState("");
  const [manifest, setManifest] = useState<RunContextManifest | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [matchingScenarios, setMatchingScenarios] = useState<
    Array<{
      scenario: Scenario;
      differences: string[];
      stale_sources: { is_stale?: boolean };
    }>
  >([]);
  const [flow, setFlow] = useState<WorkspaceFlow>({
    matter_id: detail.matter_id,
    revision: "",
    actors: [],
    edges: [],
  });
  const [decisionMap, setDecisionMap] = useState<DecisionMapSnapshot | null>(
    null,
  );
  const [workspaceFacts, setWorkspaceFacts] = useState<WorkspaceFact[]>([]);
  const [assumptions, setAssumptions] = useState<
    Array<{ assumption_id: string; text: string }>
  >([]);
  const [practiceDraft, setPracticeDraft] = useState<SkillDraft | null>(null);
  const [watchDraftId, setWatchDraftId] = useState<string | null>(null);
  const [practiceNotes, setPracticeNotes] = useState<PracticeNoteLink[]>([]);
  const [assumptionWatches, setAssumptionWatches] = useState<
    AssumptionWatchLink[]
  >([]);
  const [priorWork, setPriorWork] = useState<PriorWorkCandidate[]>([]);
  const [externalRun, setExternalRun] = useState<ChatRun | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const actor = continuityIdentity.actor;
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [factRequests, setFactRequests] = useState<FactRequest[]>([]);
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [handoffScope, setHandoffScope] = useState<ScopeSnapshot | null>(null);
  const [handoffReferences, setHandoffReferences] = useState<
    ReferenceSelection[]
  >([]);
  const [impactCandidates, setImpactCandidates] = useState<{
    sources: ReferenceSelection[];
    targets: ReferenceSelection[];
  }>({ sources: [], targets: [] });
  const [comparisons, setComparisons] = useState<SpecComparison[]>([]);
  const continuityRead = useRef(0);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [panelDrafts, setPanelDrafts] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(contextKey) || "{}");
    } catch {
      return {};
    }
  });
  const panelActive = useRef(true);
  useEffect(() => {
    panelActive.current = true;
    return () => {
      panelActive.current = false;
    };
  }, []);
  function persistPanelDrafts(
    update: (drafts: Record<string, string>) => Record<string, string>,
  ) {
    let current: Record<string, string> = {};
    try {
      current = JSON.parse(localStorage.getItem(contextKey) || "{}");
    } catch {
      /* Start with an empty local draft. */
    }
    localStorage.setItem(contextKey, JSON.stringify(update(current)));
    window.dispatchEvent(
      new CustomEvent("continuity-drafts-changed", { detail: { contextKey } }),
    );
  }
  useEffect(() => {
    const reload = (event: Event) => {
      if (
        (event as CustomEvent<{ contextKey: string }>).detail.contextKey !==
        contextKey
      )
        return;
      try {
        setPanelDrafts(JSON.parse(localStorage.getItem(contextKey) || "{}"));
      } catch {
        /* Keep the visible draft. */
      }
    };
    window.addEventListener("continuity-drafts-changed", reload);
    return () =>
      window.removeEventListener("continuity-drafts-changed", reload);
  }, [contextKey]);
  const changePanelDraft = useCallback(
    (field: string, value: string) => {
      if (!panelActive.current) return;
      persistPanelDrafts((previous) => ({
        ...previous,
        [field]: value,
        ...(["request.wording", "handoff.basis"].includes(field)
          ? { "__communication.notice": "" }
          : {}),
      }));
    },
    [contextKey],
  );
  const continuityPanel = (panelDrafts["__panel"] || null) as
    "facts" | "handoff" | "impact" | null;
  const setContinuityPanel = (value: "facts" | "handoff" | "impact" | null) =>
    changePanelDraft("__panel", value || "");
  const selectedRequestId = panelDrafts["__request"] || null;
  const setSelectedRequestId = (value: string | null) => {
    changePanelDraft("__request", value || "");
    const request = factRequests.find((item) => item.request_id === value);
    if (request) changePanelDraft("__question", request.question_id);
  };
  const selectedQuestionId = panelDrafts["__question"] || null;
  const setSelectedQuestionId = (value: string | null) =>
    changePanelDraft("__question", value || "");
  const selectedComparisonId = panelDrafts["__comparison"] || null;
  const setSelectedComparisonId = (value: string | null) =>
    changePanelDraft("__comparison", value || "");
  useEffect(() => {
    const request = factRequests.find(
      (item) => item.request_id === selectedRequestId,
    );
    if (request && request.question_id !== selectedQuestionId)
      changePanelDraft("__question", request.question_id);
  }, [factRequests, selectedRequestId, selectedQuestionId, changePanelDraft]);
  const selectedScopeId = panelDrafts["__scope"] || "";
  const scopeRead = useRef(0);
  const pendingHandoffTarget = useRef<string | null>(null);
  const selectHandoffScope = (value: string) => {
    if (pendingHandoffTarget.current)
      changePanelDraft("__handoff_link", pendingHandoffTarget.current);
    pendingHandoffTarget.current = null;
    setHandoffScope(null);
    changePanelDraft("__scope", value);
  };
  useEffect(() => {
    const version = ++scopeRead.current;
    setHandoffScope(null);
    void continuityCommand<ScopeSnapshot>(
      detail.matter_id,
      `/scope${selectedScopeId ? `?work_item_id=${encodeURIComponent(selectedScopeId)}` : ""}`,
      "GET",
      undefined,
      actor,
    )
      .then((scope) => {
        if (panelActive.current && version === scopeRead.current)
          setHandoffScope(scope);
      })
      .catch((error) => {
        if (panelActive.current && version === scopeRead.current)
          setWorkspaceNotice(error.message);
      });
  }, [detail, actor, selectedScopeId]);
  const loadContinuity = useCallback(async () => {
    const readId = ++continuityRead.current;
    const matterId = detail.matter_id;
    const submittedActor = { ...actor };
    const active = () =>
      panelActive.current && continuityRead.current === readId;
    const reads: Array<[string, (value: unknown) => void]> = [
      ["/orientation", (value) => setOrientation(value as Orientation)],
      ["/fact-requests", (value) => setFactRequests(value as FactRequest[])],
      ["/handoffs", (value) => setHandoffs(value as Handoff[])],
    ];
    const catalogReads: typeof reads =
      (continuityPanel === "handoff" || continuityPanel === "facts")
        ? [
            [
              "/handoff-references",
              (value) => setHandoffReferences(value as ReferenceSelection[]),
            ],
          ]
        : continuityPanel === "impact"
          ? [
              [
                "/impact-candidates",
                (value) =>
                  setImpactCandidates(
                    value as {
                      sources: ReferenceSelection[];
                      targets: ReferenceSelection[];
                    },
                  ),
              ],
              [
                "/impacts",
                (value) => setComparisons(value as SpecComparison[]),
              ],
            ]
          : [];
    let pendingCatalogs = catalogReads.length;
    setCatalogLoading(pendingCatalogs > 0);
    await Promise.allSettled(
      [...reads, ...catalogReads].map(async ([path, apply]) => {
        try {
          const value = await continuityCommand<unknown>(
            matterId,
            path,
            "GET",
            undefined,
            submittedActor,
          );
          if (active()) apply(value);
        } catch (cause) {
          if (active())
            setWorkspaceNotice(
              cause instanceof Error
                ? cause.message
                : "Some saved context is unavailable. Existing work is retained.",
            );
        } finally {
          if (
            catalogReads.some(([catalogPath]) => catalogPath === path) &&
            --pendingCatalogs === 0 &&
            active()
          )
            setCatalogLoading(false);
        }
      }),
    );
  }, [detail.matter_id, actor, continuityPanel]);
  const currentContinuityLoader = useRef(loadContinuity);
  currentContinuityLoader.current = loadContinuity;
  useEffect(() => {
    void loadContinuity();
  }, [loadContinuity, detail]);
  async function continuitySave<T>(
    path: string,
    command: unknown,
    method = "POST",
  ): Promise<T> {
    const saved = await continuityCommand<T>(
      detail.matter_id,
      path,
      method,
      command,
      actor,
    );
    if (panelActive.current) {
      const refreshes: Promise<unknown>[] = [
        currentContinuityLoader.current(),
        refreshWorkspace(),
      ];
      if (path.startsWith("/handoffs/") && path.endsWith("/actions")) {
        // The scope and header depend on canonical matter/work-item props,
        // which the workspace snapshot and packet list do not refresh.
        scopeRead.current += 1;
        setHandoffScope(null);
        refreshes.push(onReload());
      }
      const results = await Promise.allSettled(refreshes);
      if (
        panelActive.current &&
        results.some((result) => result.status === "rejected")
      ) {
        setWorkspaceNotice(
          "The action finished. Some current details could not refresh. Reload the view to see the latest records.",
        );
      }
    }
    return saved;
  }
  async function createFactRequest(
    command: FactRequestCommand,
  ): Promise<FactRequestResult> {
    const priorRequest = panelDrafts["__request"] || "";
    const priorWording = panelDrafts["request.wording"] || "";
    const saved = await continuitySave<FactRequestResult>(
      "/fact-requests",
      command,
    );
    if (saved.receipt.state === "applied")
      persistPanelDrafts((current) => {
        const next = { ...current };
        if (
          (current["__request"] || "") === priorRequest &&
          current["__question"] === command.question_id &&
          (current["request.wording"] || "") === priorWording
        ) {
          next["__request"] = saved.request.request_id;
          next["__question"] = saved.request.question_id;
          next["__communication.notice"] = "";
        }
        const slot = "__continuity.retry.v1:fact-request:request-create";
        try {
          if (
            JSON.parse(next[slot]).command.source_action_key ===
            command.source_action_key
          )
            next[slot] = "";
        } catch {
          /* Retain other pending commands. */
        }
        return next;
      });
    return saved;
  }
  async function continuityRun(
    path: string,
    command: unknown,
  ): Promise<ContinuityRunResult> {
    const retrySlot = `__continuity.retry.v1:run:${(command as { source_action_key: string }).source_action_key}`;
    let frozenBody = {
      ...(command as object),
      conversation_id: currentConversationId,
    };
    try {
      const prior = JSON.parse(localStorage.getItem(contextKey) || "{}")[
        retrySlot
      ];
      if (prior) frozenBody = JSON.parse(prior).command;
    } catch {
      /* No recoverable command yet. */
    }
    changePanelDraft(
      retrySlot,
      JSON.stringify({
        version: 1,
        intent_signature: path,
        command: frozenBody,
      }),
    );
    let run = await continuityCommand<ChatRun>(
      detail.matter_id,
      path,
      "POST",
      frozenBody,
      actor,
    );
    if (["failed", "interrupted"].includes(run.state))
      run = await retryChatRun(detail.matter_id, run.run_id);
    if (panelActive.current) setExternalRun(run);
    while (["queued", "running"].includes(run.state)) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await getChatRun(detail.matter_id, run.run_id);
    }
    if (panelActive.current) {
      await currentContinuityLoader.current();
      await refreshWorkspace();
      setEditorRefresh((value) => value + 1);
    }
    if (run.state !== "completed")
      throw new Error(
        run.failure_detail || "The run did not finish. Saved work is retained.",
      );
    persistPanelDrafts((current) => ({ ...current, [retrySlot]: "" }));
    return { run_id: run.run_id, state: run.state };
  }
  async function prepareCommunication(
    kind: "request" | "handoff",
    command: { source_action_key: string; instruction?: string },
    questionId?: string,
  ): Promise<ContinuityRunResult> {
    const field = kind === "request" ? "request.wording" : "handoff.basis";
    const before = panelDrafts[field] || "";
    const targetField = kind === "request" ? "__question" : "__scope";
    const selectedTarget = panelDrafts[targetField] || "";
    const selectedRequest = panelDrafts["__request"] || "";
    persistPanelDrafts((current) => ({
      ...current,
      "__communication.notice": "",
    }));
    const result = await continuityRun("/prepare-communication", {
      ...command,
      kind,
      ...(kind === "request"
        ? {
            question: workspace?.questions?.find(
              (q) => q.question_id === questionId,
            ),
            existing_wording: before,
          }
        : {
            scope: handoffScope,
            ask: panelDrafts["handoff.ask"] || "",
            current_basis: before,
          }),
    });
    const saved = await getChatRun(detail.matter_id, result.run_id);
    if (saved.response?.reply)
      persistPanelDrafts((current) => {
        const matches =
          (current[field] || "") === before &&
          (current[targetField] || "") === selectedTarget &&
          (kind !== "request" ||
            (current["__request"] || "") === selectedRequest);
        const next = {
          ...current,
          [`__communication.result:${command.source_action_key}`]:
            JSON.stringify({
              run_id: result.run_id,
              text: saved.response!.reply,
              field,
              target: selectedTarget,
            }),
          "__communication.notice": `${kind === "request" ? "Request wording" : "Handoff brief"} is ready${matches ? " to edit" : " in the conversation; your changed draft is retained"}. Nothing was sent and ownership did not change.`,
        };
        if (matches) next[field] = saved.response!.reply;
        // Only clear the panel envelope that launched this run. A later edit may
        // already have put another command in the same retry slot.
        for (const key of Object.keys(next)) {
          if (
            !key.startsWith(
              `__continuity.retry.v1:${kind === "request" ? "fact-request" : "handoff"}:prepare-`,
            )
          )
            continue;
          try {
            if (
              JSON.parse(next[key]).command.source_action_key ===
              command.source_action_key
            )
              next[key] = "";
          } catch {
            /* Keep other envelopes. */
          }
        }
        return next;
      });
    return result;
  }
  function resolveHandoffTarget() {
    const item = handoffs.find(
      (item) => item.handoff_id === pendingHandoffTarget.current,
    );
    if (item) selectHandoffScope(item.scope.work_item_id || "");
  }
  useEffect(() => {
    resolveHandoffTarget();
  }, [handoffs]);
  function openContinuityTarget(target: WorkTarget, fromDeepLink = false) {
    if (target.kind === "fact_request" || target.kind === "question") {
      setSelectedRequestId(
        target.kind === "fact_request" ? target.target_id : null,
      );
      if (target.kind === "question") setSelectedQuestionId(target.target_id);
      setContinuityPanel("facts");
    } else if (target.kind === "handoff") {
      if (fromDeepLink && panelDrafts["__handoff_link"] === target.target_id)
        return;
      pendingHandoffTarget.current = target.target_id;
      resolveHandoffTarget();
      setContinuityPanel("handoff");
    } else if (target.kind === "work_item") {
      const item = detail.work_items.find(
        (item) => item.work_item_id === target.target_id,
      );
      if (item) {
        openDocument(item.path);
        changePanelDraft("__work_item", item.work_item_id);
        setContinuityPanel(null);
      }
    } else if (target.kind === "impact") {
      setSelectedComparisonId(target.target_id);
      setContinuityPanel("impact");
    } else if (target.path) openDocument(target.path);
    setWorkspaceView(target.view ?? "understand");
  }
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const kind = query.get("continuity_kind");
    const id = query.get("continuity_id");
    if (kind && id)
      openContinuityTarget(
        {
          matter_id: detail.matter_id,
          kind: kind as WorkTarget["kind"],
          target_id: id,
          path: query.get("file"),
          view: (query.get("view") || "understand") as WorkspaceView,
        },
        true,
      );
  }, []);
  const editorSnapshotRef = useRef(editorSnapshot);
  editorSnapshotRef.current = editorSnapshot;
  const activePathRef = useRef(activePath);
  activePathRef.current = activePath;
  const currentMatterRef = useRef(detail.matter_id);
  currentMatterRef.current = detail.matter_id;
  const effectiveTarget: ConversationTarget | null =
    conversationTarget ??
    (editorSnapshot &&
    (editorSnapshot.path === activePath ||
      editorSnapshot.path === `${activePath}.extracted.md`)
      ? {
          matter_id: detail.matter_id,
          business_question_revision: workspace?.question.revision,
          artifact_path: editorSnapshot.path,
          artifact_revision: editorSnapshot.base_revision,
          artifact_review_revision: editorSnapshot.review_revision,
          selected_range: editorSnapshot.selected_range,
          local_draft_snapshot: editorSnapshot.dirty
            ? editorSnapshot.content
            : null,
        }
      : workspace
        ? {
            matter_id: detail.matter_id,
            business_question_id: workspace.question.question_id,
            business_question_revision: workspace.question.revision,
          }
        : null);
  const latestScene = useRef({
    view: workspaceView,
    path: activePath,
    target: JSON.stringify(effectiveTarget),
  });
  latestScene.current = {
    view: workspaceView,
    path: activePath,
    target: JSON.stringify(effectiveTarget),
  };
  const chatSubmission = useRef<{
    matter: string;
    runId: string | null;
    scene: typeof latestScene.current;
  } | null>(null);
  const featureRead = useRef(0);
  const workspaceRead = useRef(0);
  const loadWorkspaceFeatures = useCallback(async () => {
    const readId = ++featureRead.current;
    const workspaceReadId = ++workspaceRead.current;
    const matterId = detail.matter_id;
    const isCurrentRead = () =>
      currentMatterRef.current === matterId && featureRead.current === readId;
    const isCurrentWorkspaceRead = () =>
      currentMatterRef.current === matterId &&
      workspaceRead.current === workspaceReadId;
    const commitResponse = <T,>(
      request: Promise<T>,
      commit: (value: T) => void,
    ) => {
      void request
        .then((value) => {
          if (isCurrentRead()) commit(value);
        })
        .catch(() => {
          if (isCurrentRead())
            setWorkspaceNotice((current) =>
              current ||
              "Workspace loaded. Some supporting details could not refresh.",
            );
        });
    };
    commitResponse(
      workspaceCommand<MatterFileEntry[]>(matterId, "/files"),
      setFiles,
    );
    let baseline: WorkspaceSnapshot;
    try {
      baseline = await getWorkspace(matterId);
    } catch (cause) {
      if (isCurrentWorkspaceRead()) throw cause;
      return;
    }
    if (!isCurrentWorkspaceRead()) return;
    setWorkspace(baseline);
    setWorkspaceNotice((current) =>
      current ===
        "Workspace could not refresh. Saved text is still available." ||
      current ===
        "Workspace loaded. Some supporting details could not refresh."
        ? ""
        : current,
    );

    commitResponse(templateCommand<OutputTemplate[]>(), setTemplates);
    commitResponse(
      workspaceCommand<{ selections: ContextSelection[]; revision: string }>(
        matterId,
        "/context",
      ),
      (context) => {
        setSelections(context.selections);
        setSelectionRevision(context.revision);
      },
    );
    commitResponse(
      workspaceCommand<Scenario[]>(matterId, "/scenarios"),
      setScenarios,
    );
    commitResponse(
      workspaceCommand<WorkspaceFlow>(matterId, "/flow"),
      (flow) =>
        setFlow({ ...flow, source_revisions: baseline.source_revisions }),
    );
    commitResponse(
      workspaceCommand<WorkspaceReuse>(matterId, "/reuse"),
      (reuse) => {
        setWorkspaceFacts(
          reuse.records.facts.filter((item) => item.status === "active"),
        );
        setAssumptions(reuse.records.assumptions);
        setPracticeNotes(
          reuse.practice_notes.map((note) => ({
            ...note,
            matter_id: matterId,
          })),
        );
        setAssumptionWatches(
          reuse.watches.map((item) => ({
            ...item.link,
            title: item.watch.title,
            state: item.watch.enabled ? "Active" : "Draft",
            assumption_labels: reuse.records.assumptions
              .filter((assumption) =>
                item.link.assumption_ids?.includes(assumption.assumption_id),
              )
              .map((assumption) => assumption.text),
          })),
        );
      },
    );
    commitResponse(getDecisionMap(matterId), setDecisionMap);
  }, [detail.matter_id]);
  useEffect(() => {
    void loadWorkspaceFeatures().catch(() =>
      setWorkspaceNotice(
        "Workspace could not refresh. Saved text is still available.",
      ),
    );
  }, [loadWorkspaceFeatures]);
  useEffect(() => {
    if (
      initialIssueFocusDone.current ||
      !initialIssueId ||
      !workspace?.issues?.some((issue) => issue.issue_id === initialIssueId)
    )
      return;
    initialIssueFocusDone.current = true;
    if (!initialView) setWorkspaceView("understand");
    setSelectedIssueId(initialIssueId);
    if (initialView && initialView !== "understand") return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const detail = document.querySelector<HTMLElement>(
          'article[aria-label^="Issue review:"]',
        );
        detail?.scrollIntoView({ behavior: "smooth", block: "start" });
        detail?.querySelector<HTMLButtonElement>("button")?.focus();
      }),
    );
  }, [initialIssueId, initialView, workspace?.issues]);
  useEffect(() => {
    let live = true;
    setPacket(null);
    setOutgoing([]);
    setPacketReviewed(false);
    if (activePath)
      void workspaceCommand<Packet>(
        detail.matter_id,
        `/outside-counsel-packet?path=${encodeURIComponent(activePath)}`,
      )
        .then((saved) => {
          if (live) {
            setPacket(saved);
            setOutgoing(saved.attachments ?? []);
          }
        })
        .catch(() => {});
    return () => {
      live = false;
    };
  }, [activePath, detail.matter_id, editorRefresh]);
  async function exportPacket() {
    if (!packet?.cover_email || !packetReviewed) return;
    try {
      const result = await workspaceCommand<Packet>(
        detail.matter_id,
        "/outside-counsel-packet/export",
        "POST",
        {
          brief_path: packet.brief.path,
          reviewed_brief_revision: packet.brief.review_revision,
          reviewed_cover_revision: packet.cover_email.review_revision,
          attachments: outgoing.map((item) => ({
            ...item,
            reviewed_revision: item.revision,
          })),
          output_format: "docx",
          mode: "markup",
        },
      );
      setPacket(result);
      setWorkspaceNotice("Files prepared for download. Nothing was sent.");
    } catch (cause) {
      setWorkspaceNotice(
        cause instanceof Error
          ? cause.message
          : "Packet export failed. Drafts are retained.",
      );
    }
  }
  async function changeContext(next: ContextSelection[]) {
    const saved = await workspaceCommand<{
      selections: ContextSelection[];
      revision: string;
    }>(detail.matter_id, "/context", "PUT", {
      selections: next,
      expected_revision: selectionRevision,
    });
    setSelections(saved.selections);
    setSelectionRevision(saved.revision);
  }
  function openEvidence(evidence: ClaimEvidence) {
    setActiveEvidence(evidence);
  }
  async function setComposerFileSelection(
    refs: AttachmentReference[],
    selected: boolean,
  ) {
    if (!refs.length) return;
    const current = await workspaceCommand<{
      selections: ContextSelection[];
      revision: string;
    }>(detail.matter_id, "/context");
    const paths = new Set(refs.map((item) => item.path));
    const next = current.selections.map((item) =>
      paths.has(item.path ?? "") ? { ...item, selected } : item,
    );
    for (const ref of refs)
      if (!next.some((item) => item.path === ref.path))
        next.push({
          reference_id: ref.source_id,
          path: ref.path,
          role: "source_file",
          selected,
          revision: ref.version,
        });
    const saved = await workspaceCommand<{
      selections: ContextSelection[];
      revision: string;
    }>(detail.matter_id, "/context", "PUT", {
      selections: next,
      expected_revision: current.revision,
    });
    setSelections(saved.selections);
    setSelectionRevision(saved.revision);
  }
  function refreshSavedWorkspace(
    matterId: string,
    savedLabel: string,
    refresh: () => Promise<unknown> = loadWorkspaceFeatures,
  ) {
    if (currentMatterRef.current !== matterId) return;
    void refresh().catch(() => {
      if (currentMatterRef.current === matterId)
        setWorkspaceNotice(
          `${savedLabel} Some workspace details could not refresh. Reload the view to see the latest records.`,
        );
    });
  }
  async function saveWorkspaceReceipt(
    action: () => Promise<InteractionReceipt>,
  ) {
    const matterId = detail.matter_id;
    const saved = await action();
    refreshSavedWorkspace(
      matterId,
      saved.state === "applied"
        ? "The change was saved."
        : "The action finished.",
      refreshWorkspace,
    );
    return saved;
  }
  async function refreshFlow() {
    const matterId = detail.matter_id;
    const readId = ++featureRead.current;
    const [saved, baseline] = await Promise.all([
      workspaceCommand<WorkspaceFlow>(matterId, "/flow"),
      getWorkspace(matterId),
    ]);
    const current = { ...saved, source_revisions: baseline.source_revisions };
    if (currentMatterRef.current === matterId && featureRead.current === readId)
      setFlow(current);
    return current;
  }
  async function saveFlow(next: Flow, expected_revision: string) {
    const matterId = detail.matter_id;
    const saved = await workspaceCommand<WorkspaceFlow>(
      matterId,
      "/flow",
      "PATCH",
      { flow: next, expected_revision },
    );
    if (currentMatterRef.current === matterId) {
      // The PATCH returns the saved sketch. Acceptance choices arrive only
      // with the authoritative source map from the paired refresh.
      ++featureRead.current;
      setFlow(saved);
      refreshSavedWorkspace(
        matterId,
        "The business flow was saved.",
        refreshFlow,
      );
    }
    return saved;
  }
  async function recordFactAction(
    path: string,
    body: Record<string, unknown>,
  ): Promise<InteractionReceipt> {
    const matterId = detail.matter_id;
    const saved = await workspaceCommand<{
      state: InteractionReceipt["state"];
      fact_ids?: string[];
      adopted_fact_ids?: string[];
      accepted_change_ids?: string[];
      run?: ChatRun;
      receipt?: InteractionReceipt;
      matching_scenarios?: typeof matchingScenarios;
    }>(matterId, path, "POST", {
      ...body,
      conversation_id: currentConversationId,
      target: effectiveTarget,
    });
    if (currentMatterRef.current === matterId) {
      setMatchingScenarios(saved.matching_scenarios ?? []);
      if (saved.run) setExternalRun(saved.run);
      if (saved.state === "applied" && path === "/flow/accept-facts") {
        const acceptedIds = new Set(saved.accepted_change_ids ?? []);
        setFlow((current) => ({
          ...current,
          proposed_fact_changes: current.proposed_fact_changes?.filter(
            (change) => !acceptedIds.has(change.change_id),
          ),
        }));
      }
      // The POST receipt is final. A later read failure must not turn a saved
      // fact into a failed save or keep the acceptance control waiting.
      refreshSavedWorkspace(
        matterId,
        saved.state === "applied"
          ? "The facts were saved."
          : "The fact action finished.",
        refreshAfterChatRun,
      );
    }
    if (saved.receipt) return saved.receipt;
    return {
      receipt_id: String(body.source_action_key),
      source_action_key: String(body.source_action_key),
      operation: "correct_fact",
      target: { matter_id: detail.matter_id },
      state: saved.state,
      before_revision: "",
      after_revision: "",
      changed_links: [`${detail.path}/facts.md`],
      completed_parts: ["reported_fact"],
      created_at: new Date().toISOString(),
    };
  }
  async function startInquiry(
    request: Parameters<typeof runWorkspaceAction>[1],
  ) {
    const run = await runWorkspaceAction(detail.matter_id, {
      ...request,
      conversation_id: currentConversationId,
    });
    const current = await getChatRun(detail.matter_id, run.run_id);
    if (currentMatterRef.current === current.matter_id) setExternalRun(current);
    return current;
  }
  async function runWorkspaceShortcut(
    request: Parameters<typeof runWorkspaceAction>[1],
  ) {
    const matterId = detail.matter_id;
    let run = await startInquiry(request);
    while (["queued", "running"].includes(run.state)) {
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      run = await getChatRun(matterId, run.run_id);
    }
    if (currentMatterRef.current === matterId) {
      if (request.action === "ask_business" && run.response?.reply)
        setBusinessQuestionDraft({ matterId, text: run.response.reply });
      refreshSavedWorkspace(
        matterId,
        "The inquiry run finished.",
        refreshWorkspace,
      );
    }
    return {
      run_id: run.run_id,
      state: run.state === "completed" ? "saved" : "not_saved",
    };
  }
  async function showRunContext(run: ChatRun) {
    const matterId = run.matter_id;
    try {
      const saved = await workspaceCommand<RunContextManifest>(
        matterId,
        `/context/${run.run_id}`,
      );
      if (currentMatterRef.current === matterId) setManifest(saved);
    } catch {
      if (currentMatterRef.current === matterId)
        setWorkspaceNotice(
          "The saved answer remains available. Historical context for this run is unavailable.",
        );
    }
    const submitted = chatSubmission.current;
    if (
      !submitted ||
      submitted.runId !== run.run_id ||
      run.state !== "completed"
    )
      return;
    const products = await workspaceCommand<WorkProductReference[]>(
      matterId,
      "/drafts",
    );
    const artifact = products.find((item) => item.source_run_id === run.run_id);
    if (
      artifact &&
      currentMatterRef.current === matterId &&
      submitted.matter === matterId &&
      JSON.stringify(latestScene.current) === JSON.stringify(submitted.scene) &&
      !editorSnapshotRef.current?.dirty
    )
      openDocument(artifact.path);
  }
  async function submitDraft(
    request: DraftRequest,
    updateOfferId?: string,
  ): Promise<DraftResult> {
    const matterId = detail.matter_id;
    const submittedPath = activePathRef.current;
    let run = await startChatRun(matterId, {
      message: request.instruction,
      target: request.target,
      source_action_key: request.source_action_key,
      expected_question_revision: request.business_question_revision,
      output_type: request.output_type,
      template_id: request.template_use?.template_id,
      template_overrides:
        request.template_use?.overrides ?? request.output_preferences,
      preview: request.preview,
      workspace_action: "draft",
      update_offer_id: updateOfferId,
      context_selections: selections,
      conversation_id: currentConversationId,
      review_author: reviewAuthor.name,
      lawyer_author: reviewSettings.lawyer,
    });
    setExternalRun(run);
    while (["queued", "running"].includes(run.state)) {
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      run = await getChatRun(matterId, run.run_id);
    }
    const products = await workspaceCommand<WorkProductReference[]>(
      matterId,
      "/drafts",
    );
    const operations = run.response?.operation_results ?? [];
    const changedTarget =
      run.state === "completed" &&
      operations.some(
        (item) =>
          ["changed", "proposed"].includes(item.status) &&
          item.changed_paths?.includes(request.target.artifact_path ?? ""),
      );
    const artifact =
      products.find((item) => item.source_run_id === run.run_id) ??
      (changedTarget
        ? products.find((item) => item.path === request.target.artifact_path)
        : undefined);
    const conflict = operations
      .map(
        (item) =>
          (item as typeof item & { conflict?: { proposal_path?: string } })
            .conflict,
      )
      .find(Boolean);
    if (currentMatterRef.current === matterId) {
      refreshSavedWorkspace(
        matterId,
        "The draft run finished.",
        refreshAfterChatRun,
      );
      if (
        artifact &&
        activePathRef.current === submittedPath &&
        !editorSnapshotRef.current?.dirty
      )
        openDocument(artifact.path);
    }
    return {
      run_id: run.run_id,
      state: artifact ? run.state : "not_saved",
      artifact: artifact ?? null,
      proposal_path: conflict?.proposal_path ?? null,
    };
  }
  function previewTemplate(
    template: OutputTemplate,
    overrides: Record<string, string>,
  ): Promise<DraftResult> {
    return submitDraft({
      instruction: `Create an editable preview using the ${template.name} template with this matter.`,
      target: {
        matter_id: detail.matter_id,
        business_question_revision: workspace?.question.revision,
      },
      source_action_key: `preview:${crypto.randomUUID()}`,
      business_question_revision: workspace?.question.revision ?? "",
      output_type: template.output_type,
      template_use: {
        template_id: template.template_id,
        output_type: template.output_type,
        revision: template.revision,
        content_hash: template.content_hash,
        instructions_snapshot: template.instructions ?? "",
        overrides,
      },
      preview: true,
    });
  }
  async function createOutputTemplate() {
    const template = await templateCommand<OutputTemplate>("", "POST", {
      template_id: `custom-output-${crypto.randomUUID().slice(0, 8)}`,
      name: "New output template",
      output_type: "general",
      instructions: "Give a useful first draft for the selected matter.",
      section_outline: "## Short answer\n## Analysis\n## Next steps",
    });
    setEditingTemplate(template);
    refreshSavedWorkspace(detail.matter_id, "The template was created.");
  }
  const availableContextSelections = useMemo(
    () => [
      ...selections,
      ...files
        .filter(
          (file) =>
            !selections.some(
              (item) =>
                item.reference_id === file.reference_id ||
                item.path === file.path,
            ),
        )
        .map((file) => ({
          reference_id: file.reference_id,
          path: file.path,
          role:
            file.kind === "work_product" ? "generated_output" : "source_file",
          selected: false,
          revision: file.revision,
        })),
    ],
    [files, selections],
  );
  async function retryFilePreview(referenceId: string) {
    const file = files.find((item) => item.reference_id === referenceId);
    if (!file?.original_path)
      throw new Error(
        "The original file is unavailable. Choose the file to upload it again.",
      );
    const response = await fetch(rawFileUrl(file.original_path));
    if (!response.ok)
      throw new Error("Could not read the saved original. Try again.");
    const original = new File([await response.blob()], file.name);
    const batch = await uploadWorkspaceFiles([original], "library");
    if (batch.outcomes[0]?.state === "failed")
      throw new Error(
        batch.outcomes[0].failure_detail || "Preview retry failed.",
      );
  }
  async function uploadWorkspaceFiles(
    incoming: File[],
    destination: "library" | "inquiry",
  ): Promise<FileUploadBatch> {
    const result = await uploadDocuments(detail.matter_id, incoming);
    const nextFiles = await workspaceCommand<MatterFileEntry[]>(
      detail.matter_id,
      "/files",
    );
    setFiles(nextFiles);
    const raw = (result.results ?? []) as Array<{
      name?: string;
      state?: string;
      path?: string;
      source_id?: string;
      failure_detail?: string;
    }>;
    const outcomes: FileUploadBatch["outcomes"] = raw.map((item, index) => {
      const file = nextFiles.find(
        (file) =>
          file.path === item.path ||
          Boolean(item.source_id && file.source_id === item.source_id),
      );
      return {
        name: item.name ?? incoming[index]?.name ?? "File",
        state:
          item.state === "saved"
            ? "saved"
            : item.state === "partial"
              ? "partial"
              : "failed",
        file,
        failure_detail: item.failure_detail,
        retry_key:
          file?.source_id ??
          `${result.batch_id}:${index}:${incoming[index]?.name}`,
      };
    });
    if (destination === "inquiry")
      await setComposerFileSelection(
        outcomes.flatMap((item) =>
          item.file
            ? [
                {
                  source_id: item.file.source_id ?? item.file.reference_id,
                  name: item.file.name,
                  path: item.file.path,
                  version: item.file.revision ?? undefined,
                },
              ]
            : [],
        ),
        true,
      );
    refreshSavedWorkspace(detail.matter_id, "The upload finished.", onReload);
    return { destination, outcomes };
  }
  const refreshWorkspace = useCallback(async () => {
    const matterId = detail.matter_id;
    const readId = ++workspaceRead.current;
    const saved = await getWorkspace(matterId);
    if (
      currentMatterRef.current === matterId &&
      workspaceRead.current === readId
    )
      setWorkspace(saved);
    return saved;
  }, [detail.matter_id]);
  useEffect(() => {
    const documents = workspace?.documents ?? [];
    if (!documents.length) return;
    const recovered: Record<string, LocalEditorSnapshot> = {};
    for (const document of documents) {
      const snapshot = readLocalEditorSnapshot(
        window.localStorage,
        detail.matter_id,
        document.document_id,
      );
      if (snapshot?.dirty) recovered[document.document_id] = snapshot;
    }
    setLocalEdits(recovered);
    const selected = documents.find((item) => item.path === activePath);
    if (selected)
      setOpenDocuments((current) =>
        current.some((item) => item.document_id === selected.document_id)
          ? current
          : [...current, selected],
      );
  }, [workspace?.documents, detail.matter_id, activePath]);
  async function workspaceAction(action: () => Promise<InteractionReceipt>) {
    setWorkspaceBusy(true);
    try {
      const receipt = await action();
      const partial = receipt.state === "not_saved";
      setWorkspaceNotice(
        partial
          ? (receipt.completed_parts ?? []).includes("reported_fact")
            ? "Fact saved. Question update not saved."
            : "Question change not saved."
          : receipt.state === "proposed"
            ? "Question reframe proposed."
            : "Saved.",
      );
      if (!partial) {
        setQuestionEdit(null);
        setQuestionHistory([]);
      }
      refreshSavedWorkspace(
        detail.matter_id,
        partial ? "The action finished." : "The change was saved.",
        refreshWorkspace,
      );
    } catch (cause) {
      setWorkspaceNotice(
        cause instanceof Error
          ? cause.message
          : "Change not saved. Your text is retained.",
      );
    } finally {
      setWorkspaceBusy(false);
    }
  }
  function actionKey(signature: string) {
    if (questionAction.current.signature !== signature)
      questionAction.current = {
        signature,
        key: `workspace:${crypto.randomUUID()}`,
      };
    return questionAction.current.key;
  }
  const [dossierReviewPath, setDossierReviewPath] = useState<string | null>(
    null,
  );
  const [dossierRefreshFailed, setDossierRefreshFailed] = useState(false);
  const [researchQueue, setResearchQueue] = useState<ResearchRun[]>([]);
  const [researchIssueTitle, setResearchIssueTitle] = useState("");
  const [manualDeliveryConfirmation, setManualDeliveryConfirmation] = useState<
    MatterControl | MatterActionView | null
  >(null);
  const [newDraftOpen, setNewDraftOpen] = useState(false);
  const [newDraftTitle, setNewDraftTitle] = useState(
    `${detail.title} response`,
  );
  const [newDraftContent, setNewDraftContent] = useState("");
  const [workItemOwnerInput, setWorkItemOwnerInput] = useState("");
  const [reviewPackets, setReviewPackets] = useState<ReviewPacket[]>([]);
  const [mitigations, setMitigations] = useState<Mitigation[]>([]);
  const [reviewSettings, setReviewSettings] = useState({
    lawyer: "",
    defaultAuthor: "Themis.ai",
  });
  const reviewAuthor = useReviewAuthor(reviewSettings.defaultAuthor);
  const [collapsedPanes, setCollapsedPanes] = useState({
    tree: true,
    overview: false,
    document: false,
  });
  const [paneWeights, setPaneWeights] = useState({
    tree: 0.24,
    overview: 1,
    document: 1.15,
  });
  const treePaneRef = useRef<HTMLElement>(null);
  const overviewPaneRef = useRef<HTMLDivElement>(null);
  const documentPaneRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    left: keyof typeof paneWeights;
    right: keyof typeof paneWeights;
    startX: number;
    leftWidth: number;
    rightWidth: number;
  } | null>(null);

  useEffect(() => {
    const savedPath = readWorkspaceDraftingPreferences(
      window.localStorage,
      detail.matter_id,
    ).activeArtifactPath;
    const requested = safeMatterPath(
      initialPath,
      detail.path,
      initialFallback || savedPath,
    );
    setActivePath(requested);
    setTreeActivePath(documentRequested ? requested : null);
    setCollapsedPanes((current) => ({ ...current, document: false }));
  }, [detail.path, documentRequested, initialFallback, initialPath]);

  const loadResearchQueue = useCallback(async () => {
    const queue = await getResearchQueue(detail.matter_id);
    setResearchQueue(queue.items);
    return queue.items;
  }, [detail.matter_id]);

  useEffect(() => {
    void loadResearchQueue().catch((caught) => {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not read the research queue.",
      );
    });
  }, [loadResearchQueue]);

  // The gate is a boolean, not the queue itself: depending on the array would
  // restart this effect on every poll and turn the 2s interval into a hot loop.
  const researchQueueActive = shouldPollResearchQueue(researchQueue);

  useEffect(() => {
    if (!researchQueueActive) return;
    let cancelled = false;
    let timer: number | undefined;
    const check = () =>
      void loadResearchQueue()
        .then(async (next) => {
          if (cancelled) return;
          if (shouldPollResearchQueue(next)) {
            timer = window.setTimeout(check, 2000);
            return;
          }
          setActionNotice("Research queue updated.");
          await onReload();
        })
        .catch((caught) => {
          if (cancelled) return;
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not read the research status.",
          );
          timer = window.setTimeout(check, 2000);
        });
    timer = window.setTimeout(check, 2000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [loadResearchQueue, onReload, researchQueueActive]);

  /** Matter detail is canonical. The separate read only enriches its version history. */
  useEffect(() => {
    const canonical = detail.recommendation ?? null;
    const identity = recommendationIdentity(detail.matter_id, canonical);
    recommendationIdentityRef.current = identity;
    if (
      shouldApplyCanonicalRecommendation(
        recommendationStateRef.current,
        canonical,
        detail.matter_id,
      )
    ) {
      recommendationStateRef.current = canonical;
      setRecommendation(canonical?.content.trim() ?? "");
      setRecommendationState(canonical);
    }

    let cancelled = false;
    void getRecommendation(detail.matter_id)
      .then((saved) => {
        if (
          cancelled ||
          recommendationIdentityRef.current !== identity ||
          !isMatchingRecommendationSupplement(
            detail.matter_id,
            canonical?.current_version_id ?? null,
            saved,
          )
        )
          return;
        recommendationStateRef.current = saved;
        setRecommendationState(saved);
        setRecommendation(saved.content.trim());
      })
      .catch(() => {
        /* Keep the canonical detail value when history cannot load. */
      });
    return () => {
      cancelled = true;
    };
  }, [
    detail.matter_id,
    detail.recommendation?.content,
    detail.recommendation?.current_version_id,
    detail.recommendation?.current_version_number,
  ]);

  useEffect(() => {
    void getSettings().then((saved) => {
      const rows =
        saved.sections.find((item) => item.id === "document-review")?.rows ??
        [];
      setReviewSettings({
        lawyer:
          rows
            .find((item) => item.config_key === "document_review.lawyer_name")
            ?.value?.trim() || "",
        defaultAuthor:
          rows.find(
            (item) => item.config_key === "document_review.default_author",
          )?.value || "Themis.ai",
      });
    });
  }, []);

  const loadAwareness = useCallback(async () => {
    try {
      const [packetData, mitigationData] = await Promise.all([
        getReviewPackets({ limit: 100 }),
        getMatterMitigations(detail.matter_id),
      ]);
      setReviewPackets(
        packetData.items.filter(
          (packet) =>
            packet.affected_matters.includes(detail.matter_id) ||
            packet.affected_decisions.some((id) =>
              detail.decisions.some((decision) => decision.decision_id === id),
            ),
        ),
      );
      setMitigations(mitigationData.items);
    } catch {
      /* Keep the existing matter workspace usable if awareness data is unavailable. */
    }
  }, [detail.decisions, detail.matter_id]);
  useEffect(() => {
    void loadAwareness();
  }, [loadAwareness]);

  const evidence = useMemo(() => collectEvidence(detail.tree), [detail.tree]);
  const artifacts = useMemo(
    () =>
      matterArtifacts(
        detail.tree,
        detail.response_approved_artifact_path,
        detail.current_work_product_draft_path,
        detail.latest_research_path,
        detail.current_work_product_final_path,
      ),
    [
      detail.current_work_product_draft_path,
      detail.current_work_product_final_path,
      detail.latest_research_path,
      detail.response_approved_artifact_path,
      detail.tree,
    ],
  );
  const draftPath =
    detail.current_work_product_draft_path ??
    artifacts.find((item) => item.kind === "draft")?.path ??
    null;
  const selectedSavedDraft = workspace?.work_products?.find(
    (item) => item.path === activePath,
  );
  const activeDocument =
    workspace?.documents?.find((item) => item.path === activePath) ?? null;
  const selectedIssue =
    workspace?.issues?.find((item) => item.issue_id === selectedIssueId) ??
    null;
  const linkedWorkItems = detail.work_items
    .filter((item) =>
      Boolean(
        selectedIssue &&
          (selectedIssue.linked_work_item_ids?.includes(item.work_item_id) ||
            item.issue_id === selectedIssue.issue_id ||
            item.issue_ids?.includes(selectedIssue.issue_id)),
      ),
    )
    .map((item) => ({
      work_item_id: item.work_item_id,
      title: item.title,
      state: item.status,
      owner: item.owner,
      required: Boolean(item.required),
    }));
  const linkedDecisions = detail.decisions.filter((item) =>
    selectedIssue?.linked_decision_ids?.includes(item.decision_id),
  );
  const responseOptions = (decisionMap?.nodes ?? [])
    .filter(
      (node) =>
        node.record_type === "option" &&
        (!selectedIssueId || node.issue_ids?.includes(selectedIssueId)),
    )
    .map((node) => ({
      option_id: node.record_id,
      title: node.label,
      condition:
        node.detail ||
        decisionMap?.edges.find(
          (edge) =>
            edge.relationship === "if" &&
            (edge.from_node_id === node.node_id ||
              edge.to_node_id === node.node_id),
        )?.label,
      state: node.state,
    }));
  const savedResearch = researchQueueAggregate(researchQueue);
  const finalPath =
    detail.response_approved_artifact_path ??
    detail.current_work_product_final_path ??
    null;
  const dossierPath = useMemo(
    () => findFileByName(detail.tree, "dossier.md"),
    [detail.tree],
  );
  const requestPath = `${detail.path}/request.md`;
  const factsPath = findFileByName(detail.tree, "facts.md");
  const issuesPath = findFileByName(detail.tree, "issues.md");
  const recommendationPath =
    recommendationState?.path ||
    detail.recommendation?.path ||
    findFileByName(detail.tree, "recommendations.md");
  const researchTitle =
    artifacts.find((item) => item.kind === "research")?.label ??
    "First-pass research";
  const lifecycleAction = matterAction(detail, Boolean(draftPath));
  const approvalUnavailable =
    lifecycleAction.id === "approve_response" && !finalPath;
  const currentWorkItem = currentWorkItemFor(
    detail.work_items,
    detail.work_state.next_work_item_id,
  );
  const currentControlId = controlIdForCurrentWork(
    lifecycleAction.id,
    currentWorkItem,
  );
  const currentControl: MatterControl =
    currentControlId === lifecycleAction.id
      ? lifecycleAction
      : currentControlId === "run_research"
        ? {
            id: "run_research",
            category: "Work action",
            label: "Run research",
            detail: "Run the current research work item.",
          }
        : {
            id: "open_work_item",
            category: "Work item",
            label: "Open work item",
            detail: "Open the saved work item and review its details.",
          };
  const currentCompletableWorkItemId =
    completableCurrentWorkItemId(currentWorkItem);
  const currentWorkItemOwner = workItemOwnerLabel(currentWorkItem);
  const currentWorkItemPriority =
    detail.work_items.find(
      (item) => item.work_item_id === currentWorkItem?.work_item_id,
    )?.priority ?? "normal";
  const currentResearchWorkItem = detail.work_items.find(
    (item) =>
      item.work_item_id === currentWorkItem?.work_item_id &&
      item.item_type === "research",
  );
  const directResearchQuestion =
    [
      currentResearchWorkItem?.description ?? "",
      currentResearchWorkItem?.title ?? "",
      detail.orientation.decision_question,
      detail.orientation.summary,
      detail.title,
    ]
      .map((value) => value.trim())
      .find(Boolean) ?? detail.title;
  useEffect(() => {
    setWorkItemOwnerInput(currentWorkItem?.owner ?? "");
  }, [currentWorkItem?.owner, currentWorkItem?.work_item_id]);
  useEffect(() => {
    setVisibleParticipants(
      (detail as MatterDetail & { participants?: MatterParticipant[] })
        .participants ?? [],
    );
    setOwnerOverrides({});
  }, [
    detail.matter_id,
    (detail as MatterDetail & { participants?: MatterParticipant[] })
      .participants,
    detail.work_items,
  ]);
  const participants = visibleParticipants;
  const configuredLawyer = actor.display_name.trim();
  const currentQuickOwners = [
    ...new Set(
      [
        configuredLawyer,
        ...participants.map((participant) => participant.name),
      ].filter(Boolean),
    ),
  ].filter(
    (owner) =>
      currentWorkItemOwner !== "Unassigned" || owner !== configuredLawyer,
  );
  const signal = signalFor(detail);
  const due = dueWord(detail);

  const reload = useCallback(async () => {
    await onReload();
  }, [onReload]);

  const refreshAfterChatRun = useCallback(async () => {
    await Promise.all([
      reload(),
      loadResearchQueue(),
      loadWorkspaceFeatures(),
    ]);
    setEditorRefresh((value) => value + 1);
  }, [loadResearchQueue, reload, loadWorkspaceFeatures]);

  async function reloadPersisted(refreshError: string) {
    try {
      await reload();
    } catch {
      setError(refreshError);
    }
  }

  function reconcileDossierProjection(projection?: DossierProjection) {
    if (!projection) return;
    if (projection.state === "review_required" && projection.revision_path) {
      setDossierReviewPath(projection.revision_path);
      setDossierRefreshFailed(false);
      return;
    }
    setDossierReviewPath(null);
    setDossierRefreshFailed(projection.state === "failed");
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const result = await uploadDocument(detail.matter_id, file);
      await reload();
      const extracted = result.extracted_path;
      const path =
        typeof extracted === "string" && extracted ? extracted : result.path;
      if (typeof path === "string") openDocument(path);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not upload the file.",
      );
    } finally {
      setUploading(false);
    }
  }

  function openDocument(path: string, reveal = true) {
    const identity = workspace?.documents?.find((item) => item.path === path);
    if (
      reveal &&
      identity &&
      referenceDestination(identity) === "preview"
    ) {
      void openReference({
        document_id: identity.document_id,
        path: identity.path,
        revision: identity.revision,
        exact_passage_available: false,
        origin: {
          surface: "draft",
          focus_id:
            document.activeElement instanceof HTMLElement
              ? document.activeElement.id || null
              : null,
          scroll_offset: window.scrollY,
        },
      });
      return;
    }
    invalidateReferenceResult(referenceGeneration);
    setReferenceTarget(null);
    setReferenceDocument(null);
    setReferenceError("");
    setFilesOpen(false);
    if (reveal) { setTemplatesOpen(false); setContinuityPanel(null); setActiveSection(null); setWorkspaceView("draft"); }
    setConversationTarget(null);
    setActivePath(path);
    setTreeActivePath(path);
    setCollapsedPanes((current) => ({ ...current, document: false }));
    if (identity)
      setOpenDocuments((current) => [
        ...current.filter((item) => item.document_id !== identity.document_id),
        identity,
      ]);
  }

  function openDocumentIdentity(document: DocumentIdentity, reveal = true) {
    if (reveal && referenceDestination(document) === "preview") {
      openDocument(document.path, reveal);
      return;
    }
    setOpenDocuments((current) => [
      ...current.filter((item) => item.document_id !== document.document_id),
      document,
    ]);
    openDocument(document.path, reveal);
  }

  async function openReference(target: DocumentReferenceTarget) {
    invalidateReferenceResult(referenceGeneration);
    setFilesOpen(false);
    setTemplatesOpen(false);
    setContinuityPanel(null);
    setActiveSection(null);
    setActiveEvidence(null);
    const returnView = target.origin?.workspace_view ?? workspaceView;
    referenceReturnView.current = returnView;
    setWorkspaceView("draft");
    const contextualTarget: DocumentReferenceTarget = {
      ...target,
      origin: {
        ...(target.origin ?? { surface: "document" as const }),
        workspace_view: returnView,
        focus_id:
          target.origin?.focus_id ??
          (document.activeElement instanceof HTMLElement
            ? document.activeElement.id || null
            : null),
        scroll_offset: target.origin?.scroll_offset ?? window.scrollY,
      },
    };
    const knownDocument = documentForReferenceTarget(
      workspace?.documents ?? [],
      contextualTarget,
    );
    if (knownDocument && referenceDestination(knownDocument) === "editor") {
      setReferenceTarget(null);
      setReferenceDocument(null);
      setReferenceError("");
      openDocumentIdentity(knownDocument);
      return;
    }
    setReferenceTarget(contextualTarget);
    setReferenceDocument(null);
    setReferenceError("");
    try {
      const resolved = await latestReferenceResult(
        referenceGeneration,
        () => resolveWorkspaceDocument(detail.matter_id, contextualTarget),
      );
      if (!resolved) return;
      if (
        resolved.document &&
        referenceDestination(resolved.document) === "editor"
      ) {
        setReferenceTarget(null);
        setReferenceDocument(null);
        setReferenceError("");
        openDocumentIdentity(resolved.document);
        return;
      }
      setReferenceDocument(resolved.document ?? null);
      setReferenceError(resolved.message ?? "");
    } catch (cause) {
      const local = resolveDocumentReference(
        workspace?.documents ?? [],
        contextualTarget,
      );
      if (
        local.document &&
        referenceDestination(local.document) === "editor"
      ) {
        setReferenceTarget(null);
        setReferenceDocument(null);
        setReferenceError("");
        openDocumentIdentity(local.document);
        return;
      }
      setReferenceDocument(local.document ?? null);
      setReferenceError(
        cause instanceof Error
          ? cause.message
          : (local.message ?? "The reference is unavailable."),
      );
    }
  }

  function returnFromReference(origin: ReferenceOrigin) {
    invalidateReferenceResult(referenceGeneration);
    setReferenceTarget(null);
    setReferenceDocument(null);
    setReferenceError("");
    const returnView = origin.workspace_view ?? referenceReturnView.current;
    referenceReturnView.current = null;
    if (returnView) setWorkspaceView(returnView);
    else if (origin.surface === "issue") setWorkspaceView("understand");
    if (origin.surface === "issue" && origin.record_id) {
      setSelectedIssueId(origin.record_id);
    }
    if (origin.document_id) {
      const document = workspace?.documents?.find(
        (item) => item.document_id === origin.document_id,
      );
      if (document) openDocumentIdentity(document);
    }
    requestAnimationFrame(() => {
      if (origin.scroll_offset != null)
        window.scrollTo({ top: origin.scroll_offset });
      if (origin.focus_id) document.getElementById(origin.focus_id)?.focus();
      else if (returnView === "understand")
        document
          .querySelector<HTMLElement>('article[aria-label^="Issue review:"] button')
          ?.focus();
    });
  }

  async function createWorkingCopy(document: DocumentIdentity) {
    try {
      const source = await getFile(document.path);
      const saved = await saveWorkProductDraft(
        detail.matter_id,
        `${document.title} working copy`,
        source.content,
        `working-copy:${document.document_id}:${document.revision}:${crypto.randomUUID()}`,
      );
      await Promise.all([refreshWorkspace(), onReload()]);
      openDocument(saved.vault_path);
      setWorkspaceNotice(
        `Working copy created from ${document.title}. The source remains read-only.`,
      );
    } catch (cause) {
      setWorkspaceNotice(
        cause instanceof Error
          ? cause.message
          : "The working copy could not be created.",
      );
    }
  }

  function openChatWithSeed(text: string) {
    setWorkspaceView("discuss");
    setMiddleSection("chat");
    setChatSeed((current) => ({ text, revision: current.revision + 1 }));
  }

  function prepareResearchDraftUpdate() {
    if (!selectedSavedDraft) return;
    const snapshot =
      editorSnapshotRef.current?.path === selectedSavedDraft.path
        ? editorSnapshotRef.current
        : null;
    setConversationTarget({
      matter_id: detail.matter_id,
      artifact_path: selectedSavedDraft.path,
      artifact_revision: snapshot?.base_revision ?? selectedSavedDraft.revision,
      artifact_review_revision:
        snapshot?.review_revision ?? selectedSavedDraft.review_revision,
      local_draft_snapshot: snapshot?.dirty ? snapshot.content : null,
    });
    openChatWithSeed(
      `Update the selected draft ${selectedSavedDraft.title} from the saved research packets. Propose the changes as tracked revisions so I can accept or reject each redline. Preserve my edits and the prior text. Research still running is not part of the saved snapshot.`,
    );
  }

  function togglePane(pane: keyof typeof collapsedPanes) {
    setCollapsedPanes((current) => {
      const openCount = Object.values(current).filter(
        (collapsed) => !collapsed,
      ).length;
      if (!current[pane] && openCount === 1) return current;
      return { ...current, [pane]: !current[pane] };
    });
  }

  const paneRefs = {
    tree: treePaneRef,
    overview: overviewPaneRef,
    document: documentPaneRef,
  };
  const paneMinimums = { tree: 210, overview: 360, document: 430 };

  function applyResize(
    left: keyof typeof paneWeights,
    right: keyof typeof paneWeights,
    leftWidth: number,
    rightWidth: number,
    requestedDelta: number,
  ) {
    const delta = Math.max(
      paneMinimums[left] - leftWidth,
      Math.min(requestedDelta, rightWidth - paneMinimums[right]),
    );
    setPaneWeights((current) => {
      const next = { ...current };
      for (const pane of Object.keys(paneRefs) as Array<
        keyof typeof paneWeights
      >) {
        if (!collapsedPanes[pane])
          next[pane] =
            paneRefs[pane].current?.getBoundingClientRect().width ??
            current[pane];
      }
      next[left] = leftWidth + delta;
      next[right] = rightWidth - delta;
      return next;
    });
  }

  function startResize(
    event: PointerEvent<HTMLDivElement>,
    left: keyof typeof paneWeights,
    right: keyof typeof paneWeights,
  ) {
    const leftWidth = paneRefs[left].current?.getBoundingClientRect().width;
    const rightWidth = paneRefs[right].current?.getBoundingClientRect().width;
    if (!leftWidth || !rightWidth) return;
    dragRef.current = {
      left,
      right,
      startX: event.clientX,
      leftWidth,
      rightWidth,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function continueResize(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    applyResize(
      drag.left,
      drag.right,
      drag.leftWidth,
      drag.rightWidth,
      event.clientX - drag.startX,
    );
  }

  function resizeWithKeyboard(
    event: KeyboardEvent<HTMLDivElement>,
    left: keyof typeof paneWeights,
    right: keyof typeof paneWeights,
  ) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const leftWidth = paneRefs[left].current?.getBoundingClientRect().width;
    const rightWidth = paneRefs[right].current?.getBoundingClientRect().width;
    if (!leftWidth || !rightWidth) return;
    applyResize(
      left,
      right,
      leftWidth,
      rightWidth,
      event.key === "ArrowLeft" ? -24 : 24,
    );
  }

  function selectMatterItem(path: string) {
    const conversationId = conversationIdFromPath(path);
    setTreeActivePath(path);
    if (conversationId) {
      setMiddleSection("chat");
      setConversationSeed((current) => ({
        conversationId,
        revision: current.revision + 1,
      }));
      return;
    }
    openDocument(path);
  }

  function lifecycleCommand<T>(
    path: string,
    payload: Record<string, unknown>,
  ): Promise<T> {
    const submittedActor = { ...actor };
    if (!submittedActor.person_id || !submittedActor.display_name.trim())
      throw new Error(
        "Select an available person before recording this action.",
      );
    return request<T>(
      `/matters/${encodeURIComponent(detail.matter_id)}${path}`,
      {
        method: "POST",
        headers: {
          "X-Themis-Person-Id":
            submittedActor.mode === "demo" ? submittedActor.person_id : "",
        },
        body: JSON.stringify({
          ...payload,
          actor: submittedActor.display_name,
        }),
      },
    );
  }

  async function runControl(
    control: MatterControl | MatterActionView,
    confirmed = false,
    throwOnError = false,
  ) {
    if (control.id === "mark_as_sent" && !confirmed) {
      setManualDeliveryConfirmation(control);
      return;
    }
    setError("");
    setActionNotice("");
    if (control.id === "review_intake") {
      openDocument(requestPath);
      return;
    }
    if (control.id === "open_work_item" && currentWorkItem) {
      openDocument(currentWorkItem.path);
      return;
    }
    if (control.id === "review_and_decide") {
      setModalOpen(true);
      return;
    }
    if (control.id === "draft_work_product") {
      openChatWithSeed(
        "Draft the work product for the chosen path and save it in this matter.",
      );
      return;
    }
    if (control.id === "review_draft" && draftPath) {
      openDocument(draftPath);
      return;
    }
    if (control.id === "review_remaining_work") {
      const remainingWork = document.getElementById("remaining-work");
      remainingWork?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setBusy(true);
    try {
      if (control.id === "run_research") {
        const startedResearchRun = await startResearchRun(
          detail.matter_id,
          directResearchQuestion,
        );
        try {
          await loadResearchQueue();
        } catch (caught) {
          setResearchQueue((current) =>
            current.some((item) => item.run_id === startedResearchRun.run_id)
              ? current
              : [startedResearchRun, ...current],
          );
          setActionNotice(
            "Research started in the background. Server work continues while Themis.ai reconnects to the research queue.",
          );
          setError(
            caught instanceof Error
              ? caught.message
              : "The research queue could not reload yet. Another research request is blocked until it reconnects.",
          );
          return;
        }
        setActionNotice(
          "Research started in the background. You can continue working while it runs.",
        );
        await reloadPersisted(
          "The action was recorded, but the matter did not refresh. Reload the page to see current state.",
        );
      } else if (control.id === "start_work_product") {
        await moveMatter(
          detail.matter_id,
          "generate",
          "Judgment complete; starting work product",
        );
        await reloadPersisted(
          "The matter moved to drafting, but the workspace did not refresh. Reload the page to see current state.",
        );
      } else if (
        control.id !== "open_work_item" &&
        lifecycleActionNeedsDirectMutation(control.id)
      ) {
        if (control.id === "approve_response" && !finalPath) {
          throw new Error(
            "A current final work product is required before approval can be recorded.",
          );
        }
        const result = await lifecycleCommand<
          import("@/lib/types").MatterActionResult
        >("/actions", {
          action: control.id,
          artifact_path:
            control.id === "approve_response" ? finalPath : undefined,
          work_item_id:
            control.id === "approve_response" &&
            currentWorkItem?.item_type === "approval"
              ? currentWorkItem.work_item_id
              : undefined,
        });
        const recordedNotice = {
          approve_response: "Approval recorded for the final work product.",
          mark_as_sent:
            "Manual delivery outside Themis.ai recorded for the approved work product.",
          close_matter: "Matter closed.",
        }[control.id];
        const alreadyRecordedNotice = {
          approve_response: "Approval was already recorded.",
          mark_as_sent: "Delivery was already recorded.",
          close_matter: "Matter was already closed.",
        }[control.id];
        setActionNotice(
          result.already_recorded
            ? result.changed_paths.length
              ? `${alreadyRecordedNotice} Related saved state was repaired; no duplicate record was created.`
              : `${alreadyRecordedNotice} No new save was made.`
            : result.changed_paths.length
              ? recordedNotice
              : "No saved matter state changed.",
        );
        await reloadPersisted(
          "The action was recorded, but the matter did not refresh. Reload the page to see current state.",
        );
      }
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not complete the matter action.";
      setError(message);
      if (throwOnError) throw new Error(message);
    } finally {
      setBusy(false);
    }
  }

  async function completeSavedWorkItem(workItemId: string) {
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      const result = await lifecycleCommand<
        import("@/lib/types").MatterActionResult
      >("/work-items/complete", { work_item_id: workItemId });
      setActionNotice(
        result.changed_paths.length
          ? "Work item completed."
          : "Work item was already complete. No new save was made.",
      );
      await reloadPersisted(
        "The work item was completed, but the matter did not refresh. Reload the page to see current state.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not complete the work item.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function assignSavedWorkItem(workItemId: string) {
    const owner = workItemOwnerInput.trim();
    const pendingKey = `assign_owner:${workItemId}`;
    if (!owner || pendingActions.includes(pendingKey)) return;
    setPendingActions((current) => beginPendingAction(current, pendingKey));
    setError("");
    setActionNotice("");
    try {
      const result = await lifecycleCommand<
        import("@/lib/types").MatterActionResult
      >("/work-items/assign", { work_item_id: workItemId, owner });
      const saved = result.matter.work_items.find(
        (item) => item.work_item_id === workItemId,
      );
      setOwnerOverrides((current) => ({
        ...current,
        [workItemId]: saved?.owner?.trim() || owner,
      }));
      setActionNotice(
        result.changed_paths.length
          ? `Work item assigned to ${owner}.`
          : `Work item is already assigned to ${owner}. No new save was made.`,
      );
      await reloadPersisted(
        "The owner was saved, but the matter did not refresh. Reload the page to see current state.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not assign the work item.",
      );
    } finally {
      setPendingActions((current) => endPendingAction(current, pendingKey));
    }
  }

  async function assignWorkItemTo(workItemId: string, owner: string) {
    const pendingKey = `assign_owner:${workItemId}`;
    if (!owner.trim() || pendingActions.includes(pendingKey)) return;
    setPendingActions((current) => beginPendingAction(current, pendingKey));
    setError("");
    try {
      const result = await lifecycleCommand<
        import("@/lib/types").MatterActionResult
      >("/work-items/assign", {
        work_item_id: workItemId,
        owner: owner.trim(),
      });
      const saved = result.matter.work_items.find(
        (item) => item.work_item_id === workItemId,
      );
      setOwnerOverrides((current) => ({
        ...current,
        [workItemId]: saved?.owner?.trim() || owner.trim(),
      }));
      setActionNotice(`Work item assigned to ${owner.trim()}.`);
      await reloadPersisted(
        "The owner was saved, but the matter did not refresh.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not assign the work item.",
      );
    } finally {
      setPendingActions((current) => endPendingAction(current, pendingKey));
    }
  }

  async function changeWorkItemPriority(workItemId: string, priority: string) {
    setBusy(true);
    setError("");
    try {
      await lifecycleCommand("/work-items/priority", {
        work_item_id: workItemId,
        priority,
      });
      setActionNotice("Work item priority updated.");
      await reloadPersisted(
        "The priority was saved, but the matter did not refresh.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not update the priority.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function finalizeCurrentDraft() {
    if (!draftPath) return;
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      const result = await lifecycleCommand<
        import("@/lib/types").WorkProductLifecycleResult
      >("/work-product/finalize", { draft_path: draftPath });
      reconcileDossierProjection(result.dossier_projection);
      setActionNotice(
        result.changed_paths?.length
          ? "Final work product saved. The matter is ready for approval."
          : "This final work product already exists. No new save was made.",
      );
      await reloadPersisted(
        "The final work product was saved, but the matter did not refresh. Reload the page to see current state.",
      );
      openDocument(result.vault_path);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not finalize the current draft.";
      setError(message);
      if (/draft status before finalizing/i.test(message))
        openDocument(draftPath);
    } finally {
      setBusy(false);
    }
  }

  async function createManualDraft() {
    if (!newDraftTitle.trim() || !newDraftContent.trim()) return;
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      const result = await saveWorkProductDraft(
        detail.matter_id,
        newDraftTitle.trim(),
        newDraftContent,
      );
      reconcileDossierProjection(result.dossier_projection);
      setActionNotice(
        result.changed_paths.length
          ? "New current draft saved."
          : "This current draft already exists. No new save was made.",
      );
      setNewDraftContent("");
      setNewDraftOpen(false);
      await reloadPersisted(
        "The draft was saved, but the matter did not refresh. Reload the page to see current state.",
      );
      openDocument(result.vault_path);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not create the draft.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function changeRisk(riskLevel: string) {
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      await updateMatterRisk(
        detail.matter_id,
        riskLevel || null,
        reviewSettings.lawyer.trim() || "Lawyer",
      );
      setActionNotice(
        riskLevel
          ? `Risk set to ${riskLabel(riskLevel)}.`
          : "Risk is now unset.",
      );
      await reloadPersisted(
        "Risk was saved, but the matter did not refresh. Reload the page to see current state.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not update risk.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function addParticipant() {
    const pendingKey = "add_participant";
    if (!participantName.trim() || pendingActions.includes(pendingKey)) return;
    setPendingActions((current) => beginPendingAction(current, pendingKey));
    setError("");
    try {
      const result = await addMatterParticipant(
        detail.matter_id,
        participantName,
        participantRole,
        reviewSettings.lawyer.trim() || "Lawyer",
      );
      setVisibleParticipants(result.data.participants);
      setParticipantName("");
      setActionNotice("Participant added.");
      await reloadPersisted(
        "The participant was saved, but the matter did not refresh.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not add the participant.",
      );
    } finally {
      setPendingActions((current) => endPendingAction(current, pendingKey));
    }
  }

  async function saveMitigation() {
    if (
      !mitigationIssueId ||
      !mitigationDraft.title.trim() ||
      !mitigationDraft.description.trim() ||
      !mitigationDraft.owner.trim()
    )
      return;
    setBusy(true);
    setError("");
    try {
      const sourceActionKey =
        mitigationActionKey.current ??
        `issue-mitigation:${mitigationIssueId}:${crypto.randomUUID()}`;
      mitigationActionKey.current = sourceActionKey;
      await createMatterWorkItem(detail.matter_id, {
        title: mitigationDraft.title.trim(),
        description: mitigationDraft.description.trim(),
        item_type: "mitigation",
        status: "open",
        priority: "normal",
        owner: mitigationDraft.owner.trim(),
        due_at: null,
        required: true,
        issue_id: mitigationIssueId,
        source_action_key: sourceActionKey,
      });
      mitigationActionKey.current = null;
      setMitigationIssueId(null);
      setMitigationDraft({ title: "", description: "", owner: "" });
      await Promise.all([refreshWorkspace(), reload()]);
      setActionNotice(
        "Mitigation work saved. The issue disposition did not change.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save mitigation work.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function recommendationChanged(saved: RecommendationState) {
    recommendationIdentityRef.current = recommendationIdentity(
      detail.matter_id,
      saved,
    );
    recommendationStateRef.current = saved;
    setRecommendationState(saved);
    setRecommendation(saved.content.trim());
    reconcileDossierProjection(saved.dossier_projection);
    setActionNotice("Working recommendation saved.");
    await reloadPersisted(
      "The recommendation was saved, but the matter did not refresh.",
    );
  }

  const handleEditorSnapshot = useCallback(
    (snapshot: LocalEditorSnapshot) => {
      setEditorSnapshot(snapshot);
      if (!snapshot.document_id) return;
      setLocalEdits((current) => ({
        ...current,
        [snapshot.document_id!]: snapshot,
      }));
      writeLocalEditorSnapshot(
        window.localStorage,
        detail.matter_id,
        snapshot,
      );
    },
    [detail.matter_id],
  );

  const proposedPath = parseProposedPath(recommendation ?? "");
  const recommendationText =
    proposedPath || recommendationSummary(recommendation ?? "");
  const orientationSummary =
    detail.orientation.summary.trim() || detail.description.trim();
  const decisionQuestion = (
    workspace?.question.text ?? detail.orientation.decision_question
  ).trim();
  const currentTask =
    detail.status === "intake"
      ? detail.work_state.next_action.trim() ||
        detail.orientation.headline.trim() ||
        lifecycleAction.detail
      : lifecycleAction.id === "none"
        ? lifecycleAction.detail
        : detail.work_state.next_action.trim() ||
          currentWorkItem?.title ||
          lifecycleAction.detail;
  const workflowState = workflowStateExplanation(detail);
  const openItems = openItemsFor(
    detail.work_items,
    detail.orientation.open_questions,
    detail.work_state.next_work_item_id,
    currentTask,
  );
  const requiredCount = openItems.filter((item) => item.required).length;
  const optionalWorkCount = openItems.filter(
    (item) => item.source === "work_item" && !item.required,
  ).length;
  const openQuestionCount = openItems.filter(
    (item) => item.source === "open_question",
  ).length;
  const closedContext =
    detail.status === "closed"
      ? [
          ...new Set(
            [decisionQuestion, ...openItems.map((item) => item.text)].filter(
              Boolean,
            ),
          ),
        ]
      : [];
  const requiredOpenWorkItems = detail.work_items.filter(
    (item) =>
      Boolean(item.required) && !["done", "closed"].includes(item.status),
  );
  const otherOpenWorkItems = detail.work_items.filter(
    (item) =>
      !["done", "closed"].includes(item.status) &&
      item.work_item_id !== currentWorkItem?.work_item_id,
  );
  const otherRequiredOpenCount = otherOpenWorkItems.filter((item) =>
    Boolean(item.required),
  ).length;
  const otherOptionalOpenCount =
    otherOpenWorkItems.length - otherRequiredOpenCount;
  const recommendationSelected = Boolean(
    activePath &&
    [recommendationPath, recommendationState?.path]
      .filter(Boolean)
      .includes(activePath),
  );
  const visibleArtifacts = artifacts.filter(
    (item) => item.kind !== "recommendation",
  );
  const showCurrentControl =
    lifecycleAction.id !== "none" && currentControl.id !== "open_work_item";
  const showLifecycleAction =
    lifecycleAction.id !== "none" &&
    lifecycleAction.id !== "review_intake" &&
    lifecycleAction.id !== currentControl.id;
  const primaryActionClass =
    currentControl.category === "Counsel judgment" ||
    currentControl.category === "Approval"
      ? "btn review"
      : currentControl.id === "run_research" ||
          currentControl.id === "draft_work_product"
        ? "btn agent"
        : "btn primary";
  const sectionEntries = useMemo(
    () => [
      { id: `matter-${detail.matter_id}-evidence`, label: "Evidence & question history" },
      { id: `matter-${detail.matter_id}-explore`, label: "Explore & business flow" },
      { id: `matter-${detail.matter_id}-reuse`, label: "Prior work & watches" },
      { id: `matter-${detail.matter_id}-work`, label: "Research & work" },
      { id: `matter-${detail.matter_id}-materials`, label: "Materials & activity" },
    ],
    [detail.matter_id],
  );
  const revealMatterSection = useCallback((id: string) => {
    const root = document.getElementById(`matter-${detail.matter_id}`);
    const target = document.getElementById(id);
    if (!root || !target || !root.contains(target)) return;
    setActiveSection(id.split("-").at(-1) ?? null);
    let ancestor: HTMLElement | null = target.parentElement;
    while (ancestor && ancestor !== root) {
      if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    if (target instanceof HTMLDetailsElement) target.open = true;
    if (id === `matter-${detail.matter_id}-explore`)
      Array.from(target.children).forEach((child) => {
        if (child instanceof HTMLDetailsElement) child.open = true;
      });
    window.requestAnimationFrame(() => {
      const focusTarget = target.querySelector<HTMLElement>("summary, h2, h3, [tabindex]") ?? target;
      if (focusTarget.tagName !== "SUMMARY" && !focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [detail.matter_id]);

  const toolsVisible = filesOpen || templatesOpen || Boolean(continuityPanel);
  const showMatterTool = (tool: "files" | "templates" | "facts" | "handoff" | "impact" | null) => {
    setFilesOpen(tool === "files");
    setTemplatesOpen(tool === "templates");
    setContinuityPanel(tool === "facts" || tool === "handoff" || tool === "impact" ? tool : null);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className={`${matterStyles.workspace} matter-shell`} data-section={activeSection ?? undefined} data-tool={continuityPanel ?? undefined} id={`matter-${detail.matter_id}`}>
      <header
        className="matter-head"
        style={{
          background: signal.bg,
          borderLeft: `5px solid ${signal.rail}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div className="matter-head-context">
            {signal.word ? (
              <span
                className="matter-status-signal"
                style={{ color: signal.wordColor, background: signal.bg, borderColor: signal.rail }}
              >
                <span className="dot sm" style={{ background: signal.rail }} />
                {signal.word}
              </span>
            ) : null}
            <div className="matter-crumb">
              <Link
                href="/matters"
                style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                Matters
              </Link>
            </div>
          </div>
          <h1 className="matter-title">
            <LinkifiedText text={detail.title} />
          </h1>
        </div>
        <details className={matterStyles.matterMetadata}><summary>Matter details</summary><dl className="matter-facts">
          <div>
            <dt>Stage</dt>
            <dd>{stageLabel(detail.status)}</dd>
          </div>
          <div>
            <dt>Risk</dt>
            <dd>
              <label className="sr-only" htmlFor="matter-risk">
                Lawyer-set risk
              </label>
              <select
                aria-label="Lawyer-set risk"
                className="matter-risk-select"
                disabled={busy}
                id="matter-risk"
                onChange={(event) => void changeRisk(event.target.value)}
                value={
                  detail.risk_level && detail.risk_level !== "unknown"
                    ? detail.risk_level
                    : ""
                }
              >
                <option value="">Set risk</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd style={{ color: due.color }}>{due.text}</dd>
          </div>
        </dl></details>
        <button className="btn matter-tools-toggle" type="button" aria-expanded={toolsVisible} onClick={() => showMatterTool(toolsVisible ? null : "files")}><MatterIcon name="history" />Tools and history</button>
      </header>

      {error ? (
        <p className="error" role="alert" style={{ margin: "10px 34px 0" }}>
          {error}
        </p>
      ) : null}
      {actionNotice ? (
        <p className="matter-action-notice" role="status">
          {actionNotice}
        </p>
      ) : null}

      {panelDrafts["__work_item"]
        ? (() => {
            const item = detail.work_items.find(
              (item) => item.work_item_id === panelDrafts["__work_item"],
            );
            return item ? (
              <section className="continuity-surface workspace-work-strip">
                <strong>{item.title}</strong>
                <span>
                  {item.status} · {item.owner || "Unassigned"}
                </span>
                <button
                  className="btn quiet compact"
                  onClick={() => openDocument(item.path)}
                >
                  Open saved work
                </button>
                {!["completed", "cancelled", "done", "closed"].includes(
                  item.status,
                ) ? (
                  <button
                    className="btn compact"
                    disabled={busy}
                    onClick={() =>
                      void completeSavedWorkItem(item.work_item_id)
                    }
                  >
                    Complete work
                  </button>
                ) : null}
                <button
                  className="btn quiet tiny"
                  onClick={() => changePanelDraft("__work_item", "")}
                >
                      Hide work banner
                </button>
              </section>
            ) : null;
          })()
        : null}
      {toolsVisible ? <div className={matterStyles.toolsHeading}><button className="btn quiet" onClick={() => showMatterTool(continuityPanel ? "files" : null)} type="button">{continuityPanel ? "← Back to Tools & history" : "← Back to matter"}</button><h1>{continuityPanel === "facts" ? "Business replies" : continuityPanel === "handoff" ? "Hand off work" : continuityPanel === "impact" ? "Read changes before revising advice" : "Tools & history"}</h1>{!continuityPanel ? <p>Access files, templates, replies and research outputs for this matter.</p> : null}</div> : null}
      {toolsVisible && continuityPanel ? <nav className={matterStyles.toolViews} aria-label="Matter views"><div>{(["understand", "discuss", "draft"] as const).map((view) => <button className="btn quiet" key={view} type="button" onClick={() => { showMatterTool(null); setActiveSection(null); setWorkspaceView(view); }}><MatterIcon name={view === "understand" ? "book" : view === "discuss" ? "chat" : "file"} size={21} />{view[0].toUpperCase() + view.slice(1)}</button>)}</div><button className="btn" type="button" onClick={() => { window.location.href = `/matters/${encodeURIComponent(detail.matter_id)}/decision-map?back=${encodeURIComponent(`/matters/${detail.matter_id}`)}${selectedIssueId ? `&issue=${encodeURIComponent(selectedIssueId)}` : ""}${currentConversationId ? `&conversation=${encodeURIComponent(currentConversationId)}` : ""}`; }}><MatterIcon name="map" size={21} />Decision map</button></nav> : null}
      <div className={matterStyles.toolsLayout} hidden={!toolsVisible}>
        <nav aria-label="Tools and history sections" className={matterStyles.toolsNav}>
          <button className={filesOpen ? matterStyles.toolSelected : ""} onClick={() => showMatterTool("files")} type="button"><MatterIcon name="folder" /><span>Files &amp; context<small>Manage matter files and inquiry context.</small></span><MatterIcon name="chevron" size={16} /></button>
          <button className={templatesOpen ? matterStyles.toolSelected : ""} onClick={() => showMatterTool("templates")} type="button"><MatterIcon name="file" /><span>Output templates<small>Reuse saved research output templates.</small></span><MatterIcon name="chevron" size={16} /></button>
          <button className={continuityPanel === "facts" ? matterStyles.toolSelected : ""} onClick={() => showMatterTool("facts")} type="button"><MatterIcon name="chat" /><span>Business replies<small>Prepare requests and record business replies.</small></span><MatterIcon name="chevron" size={16} /></button>
          <button className={continuityPanel === "handoff" ? matterStyles.toolSelected : ""} onClick={() => showMatterTool("handoff")} type="button"><MatterIcon name="user" /><span>Hand off work<small>Share work and transfer responsibility.</small></span><MatterIcon name="chevron" size={16} /></button>
          <button className={continuityPanel === "impact" ? matterStyles.toolSelected : ""} onClick={() => showMatterTool("impact")} type="button"><MatterIcon name="scale" /><span>Compare supplied versions<small>Compare supplied documents and earlier advice.</small></span><MatterIcon name="chevron" size={16} /></button>
        </nav>
        <div className={matterStyles.toolsContent}>
      <MatterFilesPanel
        embedded
        open={filesOpen}
        files={files}
        selections={availableContextSelections}
        manifest={manifest}
        onClose={() => setFilesOpen(false)}
        onChange={changeContext}
        onUpload={uploadWorkspaceFiles}
        onOpenArtifact={openDocument}
        onOpenReference={(target) => void openReference(target)}
        onRetryFile={retryFilePreview}
        folderView={
          <MatterTree
            activePath={treeActivePath}
            tree={detail.tree}
            onNewChat={() => {
              setWorkspaceView("discuss");
              setConversationSeed((current) => ({
                conversationId: "",
                revision: current.revision + 1,
              }));
            }}
            onSelect={selectMatterItem}
            onUpload={upload}
            uploading={uploading}
          />
        }
      />
      {continuityPanel ? (
        <section className="continuity-surface">
          {catalogLoading ? (
            <p className="chat-history-status" role="status">
              Loading saved{" "}
              {continuityPanel === "handoff" || continuityPanel === "facts"
                ? "handoff references"
                : "comparison sources and packets"}
              …
            </p>
          ) : null}
          <button
            className="btn quiet tiny"
            type="button"
            onClick={() => setContinuityPanel(null)}
          >
            Close
          </button>
          {continuityPanel === "facts" ? (
            <>

              {panelDrafts["__communication.notice"] ? (
                <p className="fact-request__notice" role="status">
                  <strong>Ready:</strong>{" "}
                  {panelDrafts["__communication.notice"]}
                </p>
              ) : null}
              <FactRequestPanel
                supportingQuestion={<label className="field-block">
                Supporting question
                <select
                  className="text-input"
                  value={selectedQuestionId || ""}
                  onChange={(e) => {
                    setSelectedQuestionId(e.target.value);
                    setSelectedRequestId(null);
                  }}
                >
                  <option value="">Choose a saved question</option>
                  {workspace?.questions?.map((q) => (
                    <option key={q.question_id} value={q.question_id}>
                      {q.text}
                    </option>
                  ))}
                </select>
              </label>}
                contextKey={contextKey}
                drafts={panelDrafts}
                onDraftChange={changePanelDraft}
                matterId={detail.matter_id}
                actor={actor}
                question={
                  workspace?.questions?.find(
                    (q) => q.question_id === selectedQuestionId,
                  )
                    ? {
                        ...workspace?.questions?.find(
                          (q) => q.question_id === selectedQuestionId,
                        )!,
                        source_revision:
                          workspace?.questions?.find(
                            (q) => q.question_id === selectedQuestionId,
                          )!?.source_revision || "",
                      }
                    : null
                }
                requests={factRequests}
                selectedRequestId={selectedRequestId}
                onSelectRequest={setSelectedRequestId}
                onCreate={createFactRequest}
                onEdit={(id, command) =>
                  continuitySave(`/fact-requests/${id}`, command, "PATCH")
                }
                onAction={(id, command) =>
                  continuitySave(`/fact-requests/${id}/actions`, command)
                }
                onSaveReply={(id, command) =>
                  continuitySave(`/fact-requests/${id}/replies`, command)
                }
                onRecordReply={(id, reply, command) =>
                  continuitySave(
                    `/fact-requests/${id}/replies/${reply}/record`,
                    command,
                  )
                }
                onReassess={(intent) =>
                  continuityRun("/fact-requests/reassess", intent)
                }
                onPrepareWording={(id, command) =>
                  prepareCommunication("request", command, id)
                }
                onOpenTarget={openContinuityTarget}
              />
            </>
          ) : null}
          {continuityPanel === "handoff" || continuityPanel === "facts" ? (
            <>

              {panelDrafts["__communication.notice"] ? (
                <p className="matter-action-notice" role="status">
                  <strong>Ready:</strong>{" "}
                  {panelDrafts["__communication.notice"]}
                </p>
              ) : null}
              <HandoffPanel
                scopeSelector={<label className="field-block">
                Work to hand off
                <select
                  className="text-input"
                  value={selectedScopeId}
                  onChange={(e) => selectHandoffScope(e.target.value)}
                >
                  <option value="">Whole matter</option>
                  {detail.work_items.map((item) => (
                    <option key={item.work_item_id} value={item.work_item_id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>}
                busy={busy || catalogLoading}
                contextKey={contextKey}
                drafts={panelDrafts}
                onDraftChange={changePanelDraft}
                actor={actor}
                people={continuityIdentity.roster.people || []}
                scope={handoffScope}
                handoffs={handoffs}
                references={handoffReferences.filter(
                  (ref) => ref.path === activePath,
                )}
                onPrepareBrief={(command) =>
                  prepareCommunication("handoff", command)
                }
                onCreate={(command) =>
                  continuitySave<HandoffResult>("/handoffs", command)
                }
                onAction={(id, command) =>
                  continuitySave(`/handoffs/${id}/actions`, command)
                }
                onOpenTarget={openContinuityTarget}
              />
            </>
          ) : null}
          {continuityPanel === "impact" ? (
            <ChangeImpactPanel
              busy={busy || catalogLoading}
              contextKey={contextKey}
              drafts={panelDrafts}
              onDraftChange={changePanelDraft}
              sources={impactCandidates.sources}
              targets={impactCandidates.targets}
              comparisons={comparisons}
              selectedComparisonId={selectedComparisonId}
              businessQuestionRevision={workspace?.question.revision || ""}
              updateOffers={workspace?.update_offers || []}
              onSelectComparison={setSelectedComparisonId}
              onPrepare={(command) =>
                continuitySave<SpecComparison>("/impacts", command)
              }
              onAnalyze={(id, command) =>
                continuityRun(`/impacts/${id}/analyze`, command)
              }
              onRequestUpdate={(id, command) =>
                continuityRun(`/impacts/${id}/update-draft`, command)
              }
              onOfferAction={async (id, action, revision) => {
                if (action === "decline")
                  await continuitySave(`/update-offers/${id}/decline`, {
                    base_revision: revision,
                  });
                else {
                  const offer = workspace?.update_offers?.find(
                    (o) => o.offer_id === id,
                  );
                  const artifact = workspace?.work_products?.find(
                    (a) => a.path === offer?.artifact_path,
                  );
                  if (!artifact || !offer)
                    throw new Error("Current draft unavailable.");
                  await submitDraft(
                    {
                      instruction: `Propose the saved update: ${offer.reason}`,
                      target: {
                        matter_id: detail.matter_id,
                        artifact_path: artifact.path,
                        artifact_revision: artifact.revision,
                        artifact_review_revision: artifact.review_revision,
                      },
                      business_question_revision:
                        workspace?.question.revision || "",
                      source_action_key: `offer:${id}`,
                    },
                    id,
                  );
                }
              }}
              onOpenTarget={openContinuityTarget}
              onOpenEvidence={(evidence) => void openEvidence(evidence)}
            />
          ) : null}
        </section>
      ) : null}
      {workspaceNotice ? <p role="status">{workspaceNotice}</p> : null}
      {templatesOpen ? (
        <section className="workspace-template-surface">
          <button
            className="btn quiet"
            type="button"
            onClick={() => {
              setTemplatesOpen(false);
              setEditingTemplate(null);
            }}
          >
            Close output templates
          </button>
          {editingTemplate ? (
            <OutputTemplateEditor
              template={editingTemplate}
              onOpenArtifact={openDocument}
              onCancel={() => setEditingTemplate(null)}
              onPreview={previewTemplate}
              onSave={async (changes, expected_revision) => {
                const saved = await templateCommand<OutputTemplate>(
                  `/${editingTemplate.template_id}`,
                  "PUT",
                  { ...changes, expected_revision },
                );
                setEditingTemplate(saved);
                refreshSavedWorkspace(
                  detail.matter_id,
                  "The template was saved.",
                );
                return saved;
              }}
            />
          ) : (
            <OutputTemplateLibrary
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onSelect={(template) => {
                setSelectedTemplateId(template.template_id);
              }}
              onCreate={() => void createOutputTemplate()}
              onEdit={setEditingTemplate}
              onDuplicate={async (template) => {
                const copy = await templateCommand<OutputTemplate>(
                  `/${template.template_id}/duplicate`,
                  "POST",
                  {
                    new_template_id: `${template.template_id}-copy-${crypto.randomUUID().slice(0, 8)}`,
                    name: `${template.name} copy`,
                  },
                );
                setEditingTemplate(copy);
                refreshSavedWorkspace(
                  detail.matter_id,
                  "The template copy was saved.",
                );
                return copy;
              }}
              onSetDefault={async (template) => {
                await templateCommand("/default", "POST", {
                  output_type: template.output_type,
                  template_id: template.template_id,
                });
                refreshSavedWorkspace(
                  detail.matter_id,
                  "The default template was saved.",
                );
              }}
              onPreview={previewTemplate}
              onOpenArtifact={openDocument}
            />
          )}
        </section>
      ) : null}
        </div>
      </div>
      {packet ? (
        <details className="workspace-packet" open>
          <summary>Outside counsel packet · Review before export</summary>
          <p>
            Review the saved brief and cover email. Select outgoing files
            separately from internal context.
          </p>
          <div className="btn-row">
            <button
              className="btn quiet"
              type="button"
              onClick={() => openDocument(packet.brief.path)}
            >
              Open brief
            </button>
            <button
              className="btn quiet"
              type="button"
              onClick={() =>
                packet.cover_email && openDocument(packet.cover_email.path)
              }
            >
              Open cover email
            </button>
          </div>
          {files
            .filter((file) => file.kind === "source" && file.revision)
            .map((file) => {
              const selected = outgoing.find((item) => item.path === file.path);
              return (
                <div key={file.path}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(selected?.selected)}
                      onChange={(event) => {
                        setPacketReviewed(false);
                        setOutgoing((items) => [
                          ...items.filter((item) => item.path !== file.path),
                          {
                            path: file.path,
                            title: file.name,
                            revision: file.revision!,
                            relevance: selected?.relevance ?? "",
                            selected: event.target.checked,
                          },
                        ]);
                      }}
                    />
                    {file.name}
                  </label>
                  {selected?.selected ? (
                    <label>
                      Why counsel needs this file
                      <input
                        value={selected.relevance}
                        onChange={(event) => {
                          setPacketReviewed(false);
                          setOutgoing((items) =>
                            items.map((item) =>
                              item.path === file.path
                                ? { ...item, relevance: event.target.value }
                                : item,
                            ),
                          );
                        }}
                      />
                    </label>
                  ) : null}
                </div>
              );
            })}
          <label>
            <input
              type="checkbox"
              checked={packetReviewed}
              onChange={(event) => setPacketReviewed(event.target.checked)}
            />
            I reviewed these saved versions and the selected attachment list.
          </label>
          <button
            className="btn"
            type="button"
            disabled={
              !packetReviewed ||
              outgoing.some((item) => item.selected && !item.relevance.trim())
            }
            onClick={() => void exportPacket()}
          >
            Prepare reviewed files for download
          </button>
          {packet.export_results?.map((item) => (
            <p key={item.path}>
              {item.export_state === "exported" && item.output_path ? (
                <a href={rawFileUrl(item.output_path)} download>
                  Download {item.path.split("/").at(-1)}
                </a>
              ) : (
                (item.failure_detail ?? item.export_state)
              )}
            </p>
          ))}
          {packet.attachments
            ?.filter((item) => item.export_state)
            .map((item) => {
              const exported = item as typeof item & { output_path?: string };
              return (
                <p key={item.path}>
                  {exported.output_path ? (
                    <a href={rawFileUrl(exported.output_path)} download>
                      Download {item.title}
                    </a>
                  ) : (
                    (item.failure_detail ??
                    `${item.title}: ${item.export_state}`)
                  )}
                </p>
              );
            })}
        </details>
      ) : null}
      <div hidden={toolsVisible}>
      {workspaceView === "discuss" && !activeSection ? <div className={matterStyles.sectionHeading}><span className="record-meta">Matter</span><h1>{detail.title}</h1></div> : null}
      {activeSection ? <div className={matterStyles.sectionHeading}><button className="btn quiet" type="button" onClick={() => { setActiveSection(null); window.scrollTo({ top: 0, behavior: "auto" }); }}>← Back to Understand</button><span className="record-meta">{sectionEntries.find((entry) => entry.id.endsWith(`-${activeSection}`))?.label}</span><h1>{activeSection === "reuse" ? "Explore & reuse" : activeSection === "explore" ? "Explore a different assumption" : detail.title}</h1></div> : null}
      <DraftWorkspace
        initialView={initialView}
        matterId={detail.matter_id}
        onOpenDecisionMap={() => { window.location.href = `/matters/${encodeURIComponent(detail.matter_id)}/decision-map?back=${encodeURIComponent(`/matters/${detail.matter_id}`)}${selectedIssueId ? `&issue=${encodeURIComponent(selectedIssueId)}` : ""}${currentConversationId ? `&conversation=${encodeURIComponent(currentConversationId)}` : ""}`; }}
        view={workspaceView}
        onViewChange={(view) => { setActiveSection(null); setWorkspaceView(view); }}
        target={effectiveTarget}
        businessQuestionRevision={workspace?.question.revision}
        artifacts={workspace?.work_products ?? []}
        activeArtifactPath={activePath}
        onSelectArtifact={(path) => openDocument(path, false)}
        editorSnapshot={editorSnapshot}
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={(template) =>
          setSelectedTemplateId(template.template_id)
        }
        onOpenTemplates={() => setTemplatesOpen(true)}
        onDraft={submitDraft}
        onPreviewTemplate={previewTemplate}
        onKeepPreview={async (artifact) => {
          await workspaceCommand(detail.matter_id, "/drafts/keep", "POST", {
            path: artifact.path,
            expected_revision: artifact.revision,
          });
          refreshSavedWorkspace(
            detail.matter_id,
            "The preview was kept.",
            refreshAfterChatRun,
          );
        }}
        onUpdateOfferAction={async (artifact, action) => {
          const offer = artifact.update_offer;
          if (!offer)
            throw new Error("This draft has no current update offer.");
          if (action === "decline") {
            await workspaceCommand(
              detail.matter_id,
              `/update-offers/${offer.offer_id}/decline`,
              "POST",
              { base_revision: offer.base_revision },
            );
            refreshSavedWorkspace(
              detail.matter_id,
              "The update offer was declined.",
              refreshAfterChatRun,
            );
          } else
            await submitDraft(
              {
                instruction: `Apply this accepted draft update: ${offer.reason}`,
                target: {
                  matter_id: detail.matter_id,
                  artifact_path: artifact.path,
                  artifact_revision: artifact.revision,
                  artifact_review_revision: artifact.review_revision,
                },
                business_question_revision: workspace?.question.revision ?? "",
                source_action_key: `offer:${offer.offer_id}`,
                output_type: artifact.output_type,
              },
              offer.offer_id,
            );
        }}
        onResolveDraftConflict={async (choice, artifact) => {
          if (choice === "retain_copy") {
            const path = artifact.proposal_paths?.at(-1);
            if (!path) throw new Error("No saved proposal is available.");
            openDocument(path);
          } else if (choice === "open_current") {
            openDocument(artifact.path);
            setEditorRefresh((value) => value + 1);
          } else {
            openChatWithSeed(
              `Rebase the saved proposal for ${artifact.title} onto my selected current draft. Preserve my edits.`,
            );
          }
        }}
        understand={
          <>
            <UnderstandPanel
              orientation={orientation}
              sectionNavigation={<><MatterSectionNav entries={sectionEntries} onReveal={revealMatterSection} /><div className={matterStyles.overviewFacts}><section><span className={matterStyles.overviewIcon}><MatterIcon name="file" /></span><div><span className="record-meta">Sources</span><strong>{files.filter((file) => file.kind === "source").length}</strong><button className="btn quiet" onClick={() => showMatterTool("files")} type="button">View sources <MatterIcon name="chevron" size={16} /></button></div></section><section><span className={matterStyles.overviewIcon}><MatterIcon name="scale" /></span><div><span className="record-meta">Decision</span><strong>{linkedDecisions.length ? `${linkedDecisions.length} recorded` : "Not recorded"}</strong><button className="btn quiet" onClick={() => setModalOpen(true)} type="button">Record decision <MatterIcon name="chevron" size={16} /></button></div></section></div></>}
              onOpenTarget={openContinuityTarget}
              onFactRequest={(id) => {
                setSelectedQuestionId(id);
                setContinuityPanel("facts");
              }}
              onHandoff={() => setContinuityPanel("handoff")}
              onCompareSources={() => setContinuityPanel("impact")}
              snapshot={workspace}
              selectedIssueId={selectedIssueId}
              onSelectIssue={(issueId) => {
                setSelectedIssueId(issueId);
                setConversationTarget(
                  issueId
                    ? {
                        matter_id: detail.matter_id,
                        issue_id: issueId,
                        business_question_revision:
                          workspace?.question.revision,
                      }
                    : null,
                );
              }}
              onTargetChange={(target) =>
                setConversationTarget(
                  target ?? {
                    matter_id: detail.matter_id,
                    business_question_revision: workspace?.question.revision,
                  },
                )
              }
              onAction={startInquiry}
              onOpenArtifact={openDocument}
              onOpenEvidence={(evidence) => void openEvidence(evidence)}
              onIssueUpdate={async (id, command) => {
                const saved = await updateWorkspaceIssue(
                  detail.matter_id,
                  id,
                  command,
                );
                refreshSavedWorkspace(
                  detail.matter_id,
                  "The issue update was saved.",
                  refreshWorkspace,
                );
                return saved;
              }}
              onMarkSeen={async (revision) => {
                await markWorkspaceSeen(detail.matter_id, revision);
                refreshSavedWorkspace(
                  detail.matter_id,
                  "The review was recorded.",
                  refreshWorkspace,
                );
              }}
              questionHistory={questionHistory}
              onQuestionHistory={async () => {
                const history = await getQuestionHistory(detail.matter_id);
                setQuestionHistory(history);
                return history;
              }}
              onQuestionRestore={(command) =>
                saveWorkspaceReceipt(() =>
                  restoreBusinessQuestion(detail.matter_id, command),
                )
              }
              onDisposition={async (issueId, command) => {
                const saved = await recordIssueDisposition(
                  detail.matter_id,
                  issueId,
                  command,
                );
                await Promise.all([refreshWorkspace(), onReload()]);
                return saved;
              }}
              onOpenDocument={(target) => void openReference(target)}
              onResearchLegalBasis={(issueId) => {
                const issue = workspace?.issues?.find(
                  (item) => item.issue_id === issueId,
                );
                setConversationTarget({
                  matter_id: detail.matter_id,
                  issue_id: issueId,
                  business_question_revision: workspace?.question.revision,
                });
                setWorkspaceView("discuss");
                setResearchIssueTitle(issue?.title ?? issueId);
                setActionNotice(
                  `Research started for ${issue?.title ?? issueId}. Its live status is shown with the conversation.`,
                );
                void startResearchRun(
                  detail.matter_id,
                  `Research the legal basis for this saved issue: ${issue?.title ?? issueId}. Keep useful analysis even if a source cannot be confirmed.`,
                  `issue-research:${issueId}:${crypto.randomUUID()}`,
                )
                  .then(loadResearchQueue)
                  .catch((cause) =>
                    setWorkspaceNotice(
                      cause instanceof Error
                        ? cause.message
                        : "Research could not start.",
                    ),
                  );
              }}
              onCreateMitigation={(issueId) => {
                const issue = workspace?.issues?.find(
                  (item) => item.issue_id === issueId,
                );
                setMitigationIssueId(issueId);
                mitigationActionKey.current = null;
                setMitigationDraft({
                  title: issue ? `Mitigate: ${issue.title}` : "New mitigation",
                  description: "",
                  owner: actor.display_name,
                });
              }}
              onRecordDecision={(issueId) => {
                setSelectedIssueId(issueId);
                setModalOpen(true);
              }}
              onDiscuss={(target) => {
                setConversationTarget(target);
                setWorkspaceView("discuss");
              }}
              onOpenDecisionMap={(issueId) => {
                const conversation = currentConversationId
                  ? `&conversation=${encodeURIComponent(currentConversationId)}`
                  : "";
                window.location.href = `/matters/${encodeURIComponent(detail.matter_id)}/decision-map?issue=${encodeURIComponent(issueId)}&back=${encodeURIComponent(`/matters/${detail.matter_id}`)}${conversation}`;
              }}
              linkedWorkItems={linkedWorkItems}
              linkedDecisions={linkedDecisions}
              responseOptions={responseOptions}
              renderSupportedText={({ text, claim, claims, surface }) => (
                <ClaimMarkdown
                  text={text}
                  claims={claim ? [claim] : claims}
                  documents={workspace?.documents ?? []}
                  surface="issue"
                  recordId={selectedIssueId}
                  onOpenEvidence={(evidence) => void openEvidence(evidence)}
                  onOpenDocument={(target) => void openReference(target)}
                  className={`claim-markdown claim-markdown--${surface}`}
                />
              )}
              materialFacts={workspaceFacts.map((fact) => ({
                id: fact.fact_id,
                text: fact.text,
                state: fact.status,
                source: fact.source_ids?.join(", "),
              }))}
              businessContext={detail.orientation.summary}
              sourceActions={[
                ...(workspace?.claims ?? []).flatMap((claim) =>
                  claim.evidence.map((evidence) => ({
                    label: `Support: ${evidence.source_label || claim.text}`,
                    evidence,
                  })),
                ),
                ...files.map((file) => ({
                  label: file.name,
                  path: file.extracted_path || file.path,
                  evidence: {
                    claim_id: `source:${file.reference_id}`,
                    source_id: file.source_id || file.reference_id,
                    source_label: file.name,
                    path: file.extracted_path || file.path,
                    source_hash: file.revision,
                    support_state:
                      file.kind === "source"
                        ? ("supplied" as const)
                        : ("unknown" as const),
                    explanation:
                      file.kind === "source"
                        ? "Saved source supplied to this matter. Selecting it for an inquiry does not verify its claims."
                        : "Generated work product. Open it to inspect its supporting material.",
                  },
                })),
              ]}
              onQuestionChange={(command) =>
                saveWorkspaceReceipt(() =>
                  changeBusinessQuestion(detail.matter_id, command),
                )
              }
              onProposalAction={(id, command) =>
                saveWorkspaceReceipt(() =>
                  actOnQuestionProposal(detail.matter_id, id, command),
                )
              }
              onQuestionAnswer={(id, command) =>
                saveWorkspaceReceipt(() =>
                  answerWorkspaceQuestion(detail.matter_id, id, command),
                )
              }
              onRefresh={() => void refreshAfterChatRun()}
            />
            <section id={`matter-${detail.matter_id}-explore`}>
            <details className="workspace-exploration">
              <summary>Explain, stress-test or ask the business</summary>
              <InquiryActions
                target={effectiveTarget ?? { matter_id: detail.matter_id }}
                onAction={runWorkspaceShortcut}
              />
              {businessQuestionDraft?.matterId === detail.matter_id ? (
                <section aria-label="Draft question for the business">
                  <h3>Draft question for the business</h3>
                  <p>Edit or copy this draft. It has not been sent.</p>
                  <textarea
                    className="text-input prose"
                    aria-label="Business question draft"
                    rows={6}
                    value={businessQuestionDraft.text}
                    onChange={(event) =>
                      setBusinessQuestionDraft({
                        matterId: detail.matter_id,
                        text: event.target.value,
                      })
                    }
                  />
                  <button
                    className="btn quiet"
                    type="button"
                    onClick={() =>
                      void navigator.clipboard
                        .writeText(businessQuestionDraft.text)
                        .then(() =>
                          setWorkspaceNotice("Business question copied."),
                        )
                        .catch(() =>
                          setWorkspaceNotice(
                            "The draft could not be copied. Select its text and copy it manually.",
                          ),
                        )
                    }
                  >
                    Copy draft question
                  </button>
                </section>
              ) : null}
            </details>
            <details className="workspace-exploration">
              <summary>Scenarios and business flow</summary>
              {matchingScenarios.length ? (
                <section aria-label="Related earlier scenarios">
                  <h3>Related earlier scenarios</h3>
                  <p>
                    These are historical comparisons. Actual facts were not
                    adopted from them.
                  </p>
                  {matchingScenarios.map((match) => (
                    <article key={match.scenario.scenario_id}>
                      <button
                        className="btn quiet"
                        onClick={() => {
                          setSelectedScenarioId(match.scenario.scenario_id);
                          setConversationTarget({
                            matter_id: detail.matter_id,
                            scenario_id: match.scenario.scenario_id,
                          });
                        }}
                        type="button"
                      >
                        {match.scenario.title}
                      </button>
                      <span className="state-label state-agent">
                        {match.stale_sources.is_stale
                          ? "Earlier source versions"
                          : "Historical analysis"}
                      </span>
                      {match.differences.map((difference, index) => (
                        <p key={index}>Difference: {difference}</p>
                      ))}
                    </article>
                  ))}
                </section>
              ) : null}
              <ScenarioPanel
                claims={workspace?.claims ?? []}
                matterId={detail.matter_id}
                scenarios={scenarios}
                selectedScenarioId={selectedScenarioId}
                currentRevisions={workspace?.source_revisions ?? {}}
                facts={workspaceFacts}
                onOpenArtifact={openDocument}
                initialIssueId={selectedIssueId}
                onSelect={(id) => {
                  setSelectedScenarioId(id);
                  setConversationTarget(
                    id
                      ? {
                          matter_id: detail.matter_id,
                          scenario_id: id,
                          business_question_revision:
                            workspace?.question.revision,
                        }
                      : null,
                  );
                }}
                onCreate={async (input) => {
                  const saved = await workspaceCommand<Scenario>(
                    detail.matter_id,
                    "/scenarios",
                    "POST",
                    {
                      scenario: input,
                      source_action_key: input.source_action_key,
                    },
                  );
                  if (currentMatterRef.current === saved.matter_id)
                    setScenarios((current) => [
                      ...current.filter(
                        (item) => item.scenario_id !== saved.scenario_id,
                      ),
                      saved,
                    ]);
                  refreshSavedWorkspace(
                    detail.matter_id,
                    "The scenario was saved.",
                  );
                  return saved;
                }}
                onAnalyze={async (id, instruction, source_action_key) => {
                  const matterId = detail.matter_id;
                  let run = await workspaceCommand<ChatRun>(
                    matterId,
                    `/scenarios/${id}/analyze`,
                    "POST",
                    {
                      instruction,
                      source_action_key,
                      conversation_id: currentConversationId,
                    },
                  );
                  setExternalRun(run);
                  while (["queued", "running"].includes(run.state)) {
                    await new Promise((resolve) =>
                      window.setTimeout(resolve, 1000),
                    );
                    run = await getChatRun(matterId, run.run_id);
                  }
                  refreshSavedWorkspace(matterId, "The analysis run finished.");
                  return {
                    run_id: run.run_id,
                    state: run.response?.operation_results.some(
                      (item) =>
                        item.operation === "save_scenario_analysis" &&
                        item.status === "changed",
                    )
                      ? ("saved" as const)
                      : ("not_saved" as const),
                  };
                }}
                onAdopt={(
                  id,
                  change_ids,
                  expected_revisions,
                  source_action_key,
                ) =>
                  recordFactAction(`/scenarios/${id}/adopt`, {
                    change_ids,
                    expected_revisions,
                    source_action_key,
                  })
                }
                onSaveScenario={async (
                  scenario,
                  title,
                  expectedRevision,
                  sourceActionKey,
                ) => {
                  const saved = await saveWorkspaceScenario(
                    detail.matter_id,
                    scenario,
                    title,
                    expectedRevision,
                    sourceActionKey,
                  );
                  setScenarios((current) => [
                    ...current.filter(
                      (item) => item.scenario_id !== saved.scenario_id,
                    ),
                    saved,
                  ]);
                  return saved;
                }}
                onOpenClaim={(claimId) => {
                  const matches = (workspace?.claims ?? []).filter(
                    (claim) => claim.claim_id === claimId,
                  );
                  if (matches.length === 1 && matches[0].evidence.length)
                    void openEvidence(matches[0].evidence[0]);
                  else
                    setWorkspaceNotice(
                      matches.length > 1
                        ? "Choose the claim from its issue so the saved revision stays clear."
                        : "This scenario claim has no saved passage to open.",
                    );
                }}
                onCorrectFact={(input) =>
                  recordFactAction("/fact-corrections", {
                    fact_id: input.factId,
                    replacement: input.replacement,
                    expected_revisions: input.expectedRevisions,
                    source_action_key: input.sourceActionKey,
                  })
                }
              />

            </details>
            </section>
            <details className="workspace-reuse" id={`matter-${detail.matter_id}-reuse`}>
              <summary>
                Prior work, practice notes and assumption watches
              </summary>
              <section className={matterStyles.reuseQuestion} aria-label="Business question for reuse">
                <span className="record-meta">Business question</span>
                <div><p>{(decisionQuestion || "No business question saved.").length > 130 ? `${decisionQuestion.slice(0, 130)}…` : decisionQuestion || "No business question saved."}</p><div className="btn-row"><button className="btn" type="button" onClick={() => revealMatterSection(`matter-${detail.matter_id}-evidence`)}><MatterIcon name="book" size={20} />Read full question</button><button className="btn" type="button" onClick={() => revealMatterSection(`matter-${detail.matter_id}-evidence`)}>Edit question</button><button className="btn" type="button" onClick={() => revealMatterSection(`matter-${detail.matter_id}-evidence`)}><MatterIcon name="history" size={20} />Earlier questions</button></div></div>
              </section>
              <BusinessFlow
                flow={flow}
                currentRevisions={
                  flow.source_revisions ?? workspace?.source_revisions ?? {}
                }
                proposedFactChanges={flow.proposed_fact_changes}
                onRefresh={refreshFlow}
                onSave={saveFlow}
                onSelectFact={(id) => {
                  setConversationTarget({
                    matter_id: detail.matter_id,
                    source_id: id,
                  });
                }}
                onAcceptFactChanges={(
                  change_ids,
                  expected_revisions,
                  source_action_key,
                ) =>
                  recordFactAction("/flow/accept-facts", {
                    change_ids,
                    expected_revisions,
                    source_action_key,
                  })
                }
              />
              <PriorWorkPanel
                candidates={priorWork}
                onSearch={async (query) =>
                  setPriorWork(
                    await workspaceCommand<PriorWorkCandidate[]>(
                      detail.matter_id,
                      `/prior-work?query=${encodeURIComponent(query)}`,
                    ),
                  )
                }
                onOpenArtifact={openDocument}
                onInclude={async (candidate) => {
                  await changeContext([
                    ...selections.filter(
                      (item) => item.path !== candidate.path,
                    ),
                    {
                      reference_id: candidate.path,
                      path: candidate.path,
                      role: "prior_work",
                      selected: true,
                    },
                  ]);
                }}
              />
              <PracticeNotePanel
                links={practiceNotes}
                builder={
                  practiceDraft ? (
                    <SkillBuilder
                      key={practiceDraft.skill_id}
                      initialGoal=""
                      initialDraft={practiceDraft}
                      onSaveDraft={async (draft) => {
                        const saved = await workspaceCommand<SkillDefinition>(
                          detail.matter_id,
                          "/practice-notes",
                          "POST",
                          draft,
                        );
                        refreshSavedWorkspace(
                          detail.matter_id,
                          "The practice note was saved.",
                        );
                        return saved;
                      }}
                    />
                  ) : undefined
                }
                onDraft={async (instruction) => {
                  setPracticeDraft(
                    await workspaceCommand<SkillDraft>(
                      detail.matter_id,
                      "/practice-note-drafts",
                      "POST",
                      { goal: instruction, correction: instruction },
                    ),
                  );
                }}
                onApply={async (id) => {
                  await workspaceCommand(
                    detail.matter_id,
                    `/practice-notes/${id}/apply`,
                    "POST",
                  );
                  refreshSavedWorkspace(
                    detail.matter_id,
                    "The practice note was applied.",
                  );
                }}
                onOpen={(id) => openDocument(`00_System/skills/${id}.md`)}
              />
              <AssumptionWatchPanel
                links={assumptionWatches}
                assumptions={assumptions}
                builder={
                  watchDraftId ? (
                    <WatchBuilder key={watchDraftId} watchId={watchDraftId} />
                  ) : undefined
                }
                onDraft={async (ids) => {
                  const labels = assumptions
                    .filter((item) => ids.includes(item.assumption_id))
                    .map((item) => item.text);
                  const title =
                    `Assumption review: ${labels[0] ?? detail.title}`.slice(
                      0,
                      160,
                    );
                  const created = await workspaceCommand<{
                    watch: { watch_id: string };
                  }>(detail.matter_id, "/assumption-watches", "POST", {
                    assumption_ids: ids,
                    request: {
                      title,
                      standing_question: labels.join("; "),
                      public_query: {
                        standing_question:
                          "Which public legal developments affect the selected assumption?",
                      },
                      purposes: ["decision_maintenance"],
                    },
                  });
                  setWatchDraftId(created.watch.watch_id);
                  refreshSavedWorkspace(
                    detail.matter_id,
                    "The watch draft was saved.",
                  );
                }}
                onOpen={(id) => {
                  window.location.href = `/watches/${encodeURIComponent(id)}`;
                }}
              />
              <section className={matterStyles.reuseAccess} aria-label="Explore access"><span className="record-meta">Access</span><button type="button" onClick={() => { setActiveSection(null); setWorkspaceView("discuss"); window.scrollTo({top:0,behavior:"auto"}); }}><span className={matterStyles.overviewIcon}><MatterIcon name="scale" /></span><span>Explain / Stress-test inquiry<small>Explore how this answer might change under different scenarios.</small></span><MatterIcon name="chevron" /></button><button type="button" onClick={() => revealMatterSection(`matter-${detail.matter_id}-explore`)}><span className={matterStyles.overviewIcon}><MatterIcon name="book" /></span><span>Saved scenarios<small>View and reuse your saved scenarios.</small></span><MatterIcon name="chevron" /></button></section>
            </details>
            <details className="workspace-existing-controls" id={`matter-${detail.matter_id}-work`}>
              <summary>
                Research, work items, decisions and matter records
              </summary>{" "}
                <ResearchQueuePanel
                  items={researchQueue}
                  mode="summary"
                  busy={busy}
                  showDraftSnapshotNotice={Boolean(
                    draftPath && activePath === draftPath,
                  )}
                  onUpdateDraftFromSavedResearch={prepareResearchDraftUpdate}
                  onResume={async () => {
                    setBusy(true);
                    try {
                      await resumeResearchQueue(detail.matter_id);
                      await loadResearchQueue();
                    } finally {
                      setBusy(false);
                    }
                  }}
                  onStop={async () => {
                    setBusy(true);
                    try {
                      await stopResearchQueue(detail.matter_id);
                      await loadResearchQueue();
                    } finally {
                      setBusy(false);
                    }
                  }}
                  onRetry={async (runId) => {
                    setBusy(true);
                    try {
                      await retryResearchItem(detail.matter_id, runId);
                      await loadResearchQueue();
                    } finally {
                      setBusy(false);
                    }
                  }}
                  onContinueFromPartial={(item) =>
                    openChatWithSeed(
                      `Draft the work product using the saved partial research packet for: ${item.question ?? item.questions?.[0] ?? detail.title}`,
                    )
                  }
                />
              <div className="matter-brief">
                <section
                  className={`matter-call ${lifecycleAction.id === "none" ? "is-complete" : ""}`}
                >
                  <span className="matter-call-kicker">
                    {lifecycleAction.id === "none"
                      ? "Matter status"
                      : "Required work"}
                  </span>
                  <p className="matter-call-task">
                    <LinkifiedText text={currentTask} />
                  </p>
                  <p className="matter-call-detail" role="status">
                    <LinkifiedText text={workflowState} />
                  </p>

                  <details className="matter-work-context"><summary>Business question and original request</summary>
                  <div className="matter-orientation">
                    <div className="matter-orientation-label">
                      Matter at a glance
                    </div>
                    <p>
                      <LinkifiedText
                        text={
                          orientationSummary || "No matter summary is saved."
                        }
                      />
                    </p>
                    <section aria-label="Business question">
                      <div className="matter-orientation-label matter-orientation-question">
                        Business question
                      </div>
                      <p>
                        <LinkifiedText
                          text={
                            decisionQuestion || "No business question saved."
                          }
                        />
                      </p>
                      {workspace ? (
                        <>
                          <div className="matter-inline-actions">
                            <button
                              className="btn tiny quiet"
                              type="button"
                              onClick={() => {
                                setQuestionEdit(workspace.question.text);
                                setQuestionBase(workspace.question.revision);
                              }}
                            >
                              Edit question
                            </button>
                            <button
                              className="btn tiny quiet"
                              type="button"
                              onClick={() =>
                                void getQuestionHistory(detail.matter_id)
                                  .then(setQuestionHistory)
                                  .catch(() =>
                                    setWorkspaceNotice(
                                      "History could not load.",
                                    ),
                                  )
                              }
                            >
                              Question history
                            </button>
                          </div>
                          {questionEdit !== null ? (
                            <div>
                              <label>
                                Business question
                                <textarea
                                  className="text-input"
                                  value={questionEdit}
                                  onChange={(event) =>
                                    setQuestionEdit(event.target.value)
                                  }
                                />
                              </label>
                              <button
                                className="btn tiny"
                                disabled={workspaceBusy || !questionEdit.trim()}
                                type="button"
                                onClick={() =>
                                  void workspaceAction(() =>
                                    changeBusinessQuestion(detail.matter_id, {
                                      text: questionEdit,
                                      expected_revision: questionBase,
                                      source_action_key: actionKey(
                                        `edit:${questionBase}:${questionEdit}`,
                                      ),
                                    }),
                                  )
                                }
                              >
                                Save question
                              </button>
                              <button
                                className="btn tiny quiet"
                                type="button"
                                onClick={() => setQuestionEdit(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : null}
                          {(workspace.pending_reframes ?? []).map(
                            (proposal) => (
                              <div
                                className="chat-card wash-agent"
                                key={proposal.proposal_id}
                              >
                                <strong>Proposed question</strong>
                                <p>{proposal.text}</p>
                                <p>{proposal.reason}</p>
                                {(["apply", "reject"] as const).map(
                                  (action) => (
                                    <button
                                      className="btn tiny quiet"
                                      disabled={workspaceBusy}
                                      key={action}
                                      type="button"
                                      onClick={() =>
                                        void workspaceAction(() =>
                                          actOnQuestionProposal(
                                            detail.matter_id,
                                            proposal.proposal_id,
                                            {
                                              action,
                                              expected_revision:
                                                workspace.question.revision,
                                              source_action_key: actionKey(
                                                `${action}:${proposal.proposal_id}:${workspace.question.revision}`,
                                              ),
                                            },
                                          ),
                                        )
                                      }
                                    >
                                      {action === "apply" ? "Apply" : "Reject"}
                                    </button>
                                  ),
                                )}
                              </div>
                            ),
                          )}
                          {questionHistory.map((question) => (
                            <div key={question.revision}>
                              <p>{question.text}</p>
                              {question.revision !==
                              workspace.question.revision ? (
                                <button
                                  className="btn tiny quiet"
                                  disabled={workspaceBusy}
                                  type="button"
                                  onClick={() =>
                                    void workspaceAction(() =>
                                      restoreBusinessQuestion(
                                        detail.matter_id,
                                        {
                                          revision: question.revision,
                                          expected_revision:
                                            workspace.question.revision,
                                          source_action_key: actionKey(
                                            `restore:${question.revision}:${workspace.question.revision}`,
                                          ),
                                        },
                                      ),
                                    )
                                  }
                                >
                                  Restore this question
                                </button>
                              ) : (
                                <span>Current question</span>
                              )}
                            </div>
                          ))}
                          {(workspace.questions ?? []).map((question) => (
                            <div
                              className="chat-card wash-attention"
                              key={question.question_id}
                            >
                              <strong>
                                {question.state === "answered"
                                  ? "Answered · Reported fact"
                                  : question.state === "left_open"
                                    ? "Left open"
                                    : "Open question"}
                              </strong>
                              <p>{question.text}</p>
                              {question.answer ? (
                                <p>{question.answer}</p>
                              ) : null}
                              <button
                                className="btn tiny quiet"
                                type="button"
                                onClick={() => {
                                  setConversationTarget({
                                    matter_id: detail.matter_id,
                                    business_question_id:
                                      workspace.question.question_id,
                                    business_question_revision:
                                      workspace.question.revision,
                                    issue_id: question.issue_id,
                                  });
                                  openChatWithSeed(
                                    `Regarding “${question.text}”: `,
                                  );
                                }}
                              >
                                Answer in chat
                              </button>
                              {question.state === "open" ? (
                                <button
                                  className="btn tiny quiet"
                                  disabled={workspaceBusy}
                                  type="button"
                                  onClick={() =>
                                    void workspaceAction(() =>
                                      answerWorkspaceQuestion(
                                        detail.matter_id,
                                        question.question_id,
                                        {
                                          state: "left_open",
                                          expected_revision:
                                            question.source_revision ?? "",
                                          source_action_key: actionKey(
                                            `leave:${question.question_id}:${question.source_revision}`,
                                          ),
                                        },
                                      ),
                                    )
                                  }
                                >
                                  Leave open
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </>
                      ) : null}
                      {workspaceNotice ? (
                        <p role="status">{workspaceNotice}</p>
                      ) : null}
                    </section>
                  </div>

                  {detail.original_request.trim() ? (
                    <details className="matter-original-request">
                      <summary>Original request</summary>
                      <div className="matter-original-request-text">
                        <LinkifiedText text={detail.original_request} />
                      </div>
                    </details>
                  ) : null}
                  </details>

                  <div className="matter-orientation">
                    <div className="matter-orientation-label">Participants</div>
                    {participants.length ? (
                      <ul>
                        {participants.map((participant) => (
                          <li key={`${participant.role}:${participant.name}`}>
                            <strong>{participant.name}</strong> ·{" "}
                            {participantRoleLabel(participant.role)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No participants are saved.</p>
                    )}
                    <div className="matter-inline-actions">
                      <input
                        aria-label="Participant name"
                        className="text-input"
                        onChange={(event) =>
                          setParticipantName(event.target.value)
                        }
                        placeholder="Participant name"
                        value={participantName}
                      />
                      <input
                        aria-label="Participant role"
                        className="text-input"
                        onChange={(event) =>
                          setParticipantRole(event.target.value)
                        }
                        placeholder="Role"
                        value={participantRole}
                      />
                      <button
                        className="btn quiet compact"
                        disabled={
                          pendingActions.includes("add_participant") ||
                          !participantName.trim() ||
                          !participantRole.trim()
                        }
                        onClick={() => void addParticipant()}
                        type="button"
                      >
                        {pendingActions.includes("add_participant")
                          ? "Adding participant…"
                          : "Add participant"}
                      </button>
                    </div>
                  </div>

                  {lifecycleAction.id === "close_matter" &&
                  (researchQueueActive || requiredOpenWorkItems.length > 0) ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Before you can close</span>
                      <ol className="matter-open-list">
                        {researchQueueActive ? (
                          <li>
                            <span className="matter-open-text">
                              Stop or finish active research.
                            </span>
                            <button
                              className="btn tiny quiet"
                              disabled={busy}
                              onClick={() =>
                                void stopResearchQueue(detail.matter_id).then(
                                  loadResearchQueue,
                                )
                              }
                              type="button"
                            >
                              Stop research
                            </button>
                          </li>
                        ) : null}
                        {requiredOpenWorkItems.map((item) => (
                          <li key={item.work_item_id}>
                            <span className="matter-open-text">
                              <strong>{item.title}</strong> · Owner:{" "}
                              {ownerOverrides[item.work_item_id] ||
                                item.owner?.trim() ||
                                "Unassigned"}
                            </span>
                            {!item.owner?.trim() ? (
                              <button
                                className="btn tiny quiet"
                                disabled={busy}
                                onClick={() =>
                                  void assignWorkItemTo(
                                    item.work_item_id,
                                    actor.display_name,
                                  )
                                }
                                type="button"
                              >
                                Assign owner
                              </button>
                            ) : null}
                            <button
                              className="btn tiny quiet"
                              disabled={busy}
                              onClick={() =>
                                void completeSavedWorkItem(item.work_item_id)
                              }
                              type="button"
                            >
                              Complete
                            </button>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  {showCurrentControl ? (
                    <div className="matter-call-do">
                      <span>{currentControl.category}</span>
                      <button
                        aria-busy={busy}
                        className={`${primaryActionClass} matter-call-button`}
                        disabled={
                          busy ||
                          (currentControl.id === "run_research" &&
                            researchQueueActive) ||
                          (currentControl.id === "approve_response" &&
                            approvalUnavailable) ||
                          (currentControl.id === "close_matter" &&
                            (researchQueueActive ||
                              Boolean(requiredOpenWorkItems.length)))
                        }
                        onClick={() => void runControl(currentControl)}
                        title={currentControl.detail}
                        type="button"
                      >
                        {busy
                          ? "Working…"
                          : currentControl.id === "mark_as_sent"
                            ? "Record manual delivery"
                            : currentControl.label}
                      </button>
                      {currentControl.id === "mark_as_sent" ? (
                        <button
                          className="btn quiet compact"
                          disabled
                          title="Direct sending is not available in the MVP."
                          type="button"
                        >
                          Send directly — coming later
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {currentWorkItem ? (
                    <div className="matter-lifecycle-action">
                      <span>Current work · Saved work item</span>
                      <p>
                        Owner:{" "}
                        <strong>
                          {ownerOverrides[currentWorkItem.work_item_id] ||
                            currentWorkItemOwner}
                        </strong>
                      </p>
                      <div className="matter-inline-actions">
                        <select
                          aria-label={`Priority for ${currentWorkItem.title}`}
                          className="text-input"
                          disabled={busy}
                          onChange={(event) =>
                            void changeWorkItemPriority(
                              currentWorkItem.work_item_id,
                              event.target.value,
                            )
                          }
                          value={currentWorkItemPriority}
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        {currentWorkItemOwner === "Unassigned" ? (
                          <button
                            className="btn quiet compact"
                            disabled={pendingActions.includes(
                              `assign_owner:${currentWorkItem.work_item_id}`,
                            )}
                            onClick={() =>
                              void assignWorkItemTo(
                                currentWorkItem.work_item_id,
                                actor.display_name,
                              )
                            }
                            type="button"
                          >
                            {pendingActions.includes(
                              `assign_owner:${currentWorkItem.work_item_id}`,
                            )
                              ? "Assigning owner…"
                              : `Assign to ${actor.display_name}`}
                          </button>
                        ) : null}
                        {currentQuickOwners.map((owner) => (
                          <button
                            className="btn tiny quiet"
                            disabled={pendingActions.includes(
                              `assign_owner:${currentWorkItem.work_item_id}`,
                            )}
                            key={owner}
                            onClick={() =>
                              void assignWorkItemTo(
                                currentWorkItem.work_item_id,
                                owner,
                              )
                            }
                            type="button"
                          >
                            {pendingActions.includes(
                              `assign_owner:${currentWorkItem.work_item_id}`,
                            )
                              ? "Assigning owner…"
                              : owner}
                          </button>
                        ))}
                        <label htmlFor="current-work-item-owner">
                          Other owner
                        </label>
                        <input
                          id="current-work-item-owner"
                          className="text-input"
                          onChange={(event) =>
                            setWorkItemOwnerInput(event.target.value)
                          }
                          placeholder="Owner name"
                          value={workItemOwnerInput}
                        />
                        <button
                          className="btn quiet compact"
                          disabled={
                            !workItemOwnerInput.trim() ||
                            pendingActions.includes(
                              `assign_owner:${currentWorkItem.work_item_id}`,
                            )
                          }
                          onClick={() =>
                            void assignSavedWorkItem(
                              currentWorkItem.work_item_id,
                            )
                          }
                          type="button"
                        >
                          {pendingActions.includes(
                            `assign_owner:${currentWorkItem.work_item_id}`,
                          )
                            ? "Assigning owner…"
                            : "Assign owner"}
                        </button>
                        <button
                          className="btn quiet compact"
                          onClick={() => openDocument(currentWorkItem.path)}
                          type="button"
                        >
                          Open work item
                        </button>
                        {currentCompletableWorkItemId ? (
                          <button
                            className="btn quiet compact"
                            disabled={busy}
                            onClick={() =>
                              void completeSavedWorkItem(
                                currentCompletableWorkItemId,
                              )
                            }
                            type="button"
                          >
                            Complete this work item
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {showLifecycleAction ? (
                    <div className="matter-lifecycle-action">
                      <span>{lifecycleAction.category} · Stage action</span>
                      <p>{lifecycleAction.detail}</p>
                      <button
                        className={`${lifecycleAction.category === "Approval" || lifecycleAction.category === "Counsel judgment" ? "btn review" : "btn quiet"} compact`}
                        disabled={
                          busy ||
                          (lifecycleAction.id === "approve_response" &&
                            approvalUnavailable) ||
                          (lifecycleAction.id === "close_matter" &&
                            (researchQueueActive ||
                              Boolean(requiredOpenWorkItems.length)))
                        }
                        onClick={() => void runControl(lifecycleAction)}
                        type="button"
                      >
                        {lifecycleAction.id === "mark_as_sent"
                          ? "Record manual delivery"
                          : lifecycleAction.label}
                      </button>
                      {lifecycleAction.id === "mark_as_sent" ? (
                        <button
                          className="btn quiet compact"
                          disabled
                          title="Direct sending is not available in the MVP."
                          type="button"
                        >
                          Send directly — coming later
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {detail.response_approved_at &&
                  lifecycleAction.id !== "close_matter" &&
                  requiredOpenWorkItems.length ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Approved — required work remains</span>
                      <p>
                        {requiredOpenWorkItems.length} required{" "}
                        {requiredOpenWorkItems.length === 1
                          ? "item is"
                          : "items are"}{" "}
                        still open:{" "}
                        {requiredOpenWorkItems
                          .map((item) => item.title)
                          .join("; ")}
                      </p>
                    </div>
                  ) : null}

                  {dossierReviewPath ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Dossier · Review required</span>
                      <p>
                        The main save completed. Review the proposed dossier
                        update before you use it.
                      </p>
                      <button
                        className="btn review compact"
                        onClick={() => openDocument(dossierReviewPath)}
                        type="button"
                      >
                        Review dossier update
                      </button>
                    </div>
                  ) : null}

                  {dossierRefreshFailed ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Dossier · Refresh failed</span>
                      <p>Work saved; dossier did not refresh.</p>
                      <button
                        className="btn quiet compact"
                        onClick={() =>
                          void reloadPersisted(
                            "Work is saved, but the matter did not refresh.",
                          )
                        }
                        type="button"
                      >
                        Reload matter
                      </button>
                    </div>
                  ) : null}

                  {draftPath && !detail.response_approved_at ? (
                    <div className="matter-lifecycle-action work-product-action">
                      <span>Work product · Current draft</span>
                      <p>
                        Finalize the current canonical draft. This creates the
                        final response from the reviewed content.
                      </p>
                      <div className="matter-inline-actions">
                        <button
                          className="btn quiet compact"
                          onClick={() => openDocument(draftPath)}
                          type="button"
                        >
                          Open current draft
                        </button>
                        <button
                          className="btn primary compact"
                          disabled={busy}
                          onClick={() => void finalizeCurrentDraft()}
                          type="button"
                        >
                          {busy ? "Working…" : "Finalize current draft"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="matter-artifacts compact">
                    <strong>Matter artifacts</strong>
                    {factsPath ? (
                      <button
                        className="matter-artifact-link"
                        onClick={() => openDocument(factsPath)}
                        type="button"
                      >
                        <span>Facts</span>
                        <span>Facts, sources & assumptions</span>
                      </button>
                    ) : null}
                    {issuesPath ? (
                      <button
                        className="matter-artifact-link"
                        onClick={() => openDocument(issuesPath)}
                        type="button"
                      >
                        <span>Issue map</span>
                        <span>Current issues and questions</span>
                      </button>
                    ) : null}
                    {recommendationPath ? (
                      <button
                        className="matter-artifact-link"
                        onClick={() => openDocument(recommendationPath)}
                        type="button"
                      >
                        <span>Recommendation</span>
                        <span>Open recommendation</span>
                      </button>
                    ) : null}
                    {visibleArtifacts.map((item) => (
                      <button
                        className="matter-artifact-link"
                        key={`${item.kind}:${item.path}`}
                        onClick={() => openDocument(item.path)}
                        type="button"
                      >
                        <span>
                          {item.kind === "final"
                            ? item.path ===
                              detail.response_approved_artifact_path
                              ? "Approved response"
                              : "Final response"
                            : {
                                recommendation: "Working recommendation",
                                research: "Research packet",
                                draft: "Current draft",
                              }[item.kind]}
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    {detail.decisions.map((decision) => (
                      <button
                        className="matter-artifact-link"
                        key={decision.decision_id}
                        onClick={() => openDocument(decision.path)}
                        type="button"
                      >
                        <span>Recorded decision</span>
                        <span>{decision.title}</span>
                      </button>
                    ))}
                    {detail.status !== "closed" ? (
                      <button
                        className="matter-artifact-link"
                        onClick={() => setModalOpen(true)}
                        type="button"
                      >
                        <span>Record durable decision</span>
                        <span>Open the decision form</span>
                      </button>
                    ) : null}
                    {!researchPath ? (
                      <span className="matter-artifact-empty">
                        No research packet is saved yet.
                      </span>
                    ) : null}
                    {!recommendationText ? (
                      <span className="matter-artifact-empty">
                        No working recommendation is saved yet.
                      </span>
                    ) : null}
                    {!draftPath ? (
                      <span className="matter-artifact-empty">
                        No current work-product draft is saved yet.
                      </span>
                    ) : null}
                    {!finalPath ? (
                      <span className="matter-artifact-empty">
                        No final work product is saved yet.
                      </span>
                    ) : null}
                    {!detail.decisions.length ? (
                      <span className="matter-artifact-empty">
                        No durable decision is recorded for this matter.
                      </span>
                    ) : null}
                    <button
                      className="btn quiet compact matter-new-draft-toggle"
                      onClick={() => setNewDraftOpen((open) => !open)}
                      type="button"
                    >
                      {newDraftOpen ? "Cancel new draft" : "New draft"}
                    </button>
                    {newDraftOpen ? (
                      <div className="matter-new-draft">
                        <label htmlFor="new-draft-title">Draft title</label>
                        <input
                          className="text-input"
                          id="new-draft-title"
                          onChange={(event) =>
                            setNewDraftTitle(event.target.value)
                          }
                          value={newDraftTitle}
                        />
                        <label htmlFor="new-draft-content">Draft content</label>
                        <textarea
                          className="text-input prose"
                          id="new-draft-content"
                          onChange={(event) =>
                            setNewDraftContent(event.target.value)
                          }
                          placeholder="Write or paste the deliverable here."
                          value={newDraftContent}
                        />
                        <button
                          className="btn primary compact"
                          disabled={
                            busy ||
                            !newDraftTitle.trim() ||
                            !newDraftContent.trim()
                          }
                          onClick={() => void createManualDraft()}
                          type="button"
                        >
                          Save current draft
                        </button>
                      </div>
                    ) : null}
                  </div>
                </section>

                {detail.status === "closed" ? (
                  closedContext.length ? (
                    <details className="matter-open" id="remaining-work">
                      <summary>Open context at closure</summary>
                      <ul className="matter-open-list">
                        {closedContext.map((item) => (
                          <li key={item}>
                            <span className="matter-open-text">
                              <LinkifiedText text={item} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null
                ) : (
                  <section className="matter-open" id="remaining-work">
                    <div className="matter-open-head">
                      <h2>
                        {openItems.length
                          ? "Other open items and questions"
                          : "No other open items or questions"}
                      </h2>
                      {openItems.length ? (
                        <span>
                          {requiredCount} other required work ·{" "}
                          {optionalWorkCount} optional work ·{" "}
                          {openQuestionCount} open questions
                        </span>
                      ) : null}
                    </div>
                    {openItems.length ? (
                      <ul className="matter-open-list">
                        {openItems.map((item) => (
                          <li
                            className={item.required ? "is-required" : ""}
                            key={item.key}
                          >
                            <span
                              aria-hidden="true"
                              className="matter-open-mark"
                            />
                            <span className="matter-open-text">
                              <LinkifiedText text={item.text} />
                            </span>
                            <span className="matter-open-tag">
                              {item.source === "open_question"
                                ? "Open question"
                                : item.required
                                  ? "Required work"
                                  : "Optional work"}
                            </span>
                            {item.required && item.workItemId ? (
                              <button
                                className="btn tiny quiet"
                                disabled={busy}
                                onClick={() =>
                                  void completeSavedWorkItem(item.workItemId!)
                                }
                                type="button"
                              >
                                Complete
                              </button>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="matter-open-empty">
                        No other open records are saved.
                      </p>
                    )}
                  </section>
                )}



                {detail.status !== "closed" ? (
                  <section
                    className="matter-open"
                    aria-label="Other saved work items"
                  >
                    <div className="matter-open-head">
                      <h2>Other saved work items</h2>
                      <span>
                        {otherRequiredOpenCount} required open ·{" "}
                        {otherOptionalOpenCount} optional open
                      </span>
                    </div>
                    <div className="stack-list">
                      {otherOpenWorkItems.map((item) => (
                        <div
                          className="matter-lifecycle-action"
                          key={item.work_item_id}
                        >
                          <span>
                            {Boolean(item.required) ? "Required" : "Optional"}
                            {detail.status === "closed" &&
                            !Boolean(item.required)
                              ? " · Open after closure"
                              : ""}
                            {item.work_item_id ===
                            detail.work_state.next_work_item_id
                              ? " · Current next action"
                              : " · Open work"}{" "}
                            · {item.priority}
                          </span>
                          <p>
                            <strong>{item.title}</strong>
                          </p>
                          <p>
                            Owner:{" "}
                            <strong>
                              {ownerOverrides[item.work_item_id] ||
                                item.owner?.trim() ||
                                "Unassigned"}
                            </strong>
                          </p>
                          <div className="matter-inline-actions">
                            <select
                              aria-label={`Priority for ${item.title}`}
                              className="text-input"
                              disabled={busy}
                              onChange={(event) =>
                                void changeWorkItemPriority(
                                  item.work_item_id,
                                  event.target.value,
                                )
                              }
                              value={item.priority || "normal"}
                            >
                              <option value="low">Low</option>
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                            {[
                              ...new Set(
                                [
                                  actor.display_name,
                                  ...participants.map(
                                    (participant) => participant.name,
                                  ),
                                ].filter(Boolean),
                              ),
                            ].map((owner) => (
                              <button
                                className="btn tiny quiet"
                                disabled={pendingActions.includes(
                                  `assign_owner:${item.work_item_id}`,
                                )}
                                key={owner}
                                onClick={() =>
                                  void assignWorkItemTo(
                                    item.work_item_id,
                                    owner,
                                  )
                                }
                                type="button"
                              >
                                {pendingActions.includes(
                                  `assign_owner:${item.work_item_id}`,
                                )
                                  ? "Assigning owner…"
                                  : owner}
                              </button>
                            ))}
                            <input
                              aria-label={`Owner for ${item.title}`}
                              className="text-input"
                              defaultValue={item.owner}
                              disabled={pendingActions.includes(
                                `assign_owner:${item.work_item_id}`,
                              )}
                              onKeyDown={(event) => {
                                if (event.key === "Enter")
                                  void assignWorkItemTo(
                                    item.work_item_id,
                                    event.currentTarget.value,
                                  );
                              }}
                              placeholder="Owner name"
                            />
                            <button
                              className="btn tiny quiet"
                              disabled={busy}
                              onClick={() =>
                                void completeSavedWorkItem(item.work_item_id)
                              }
                              type="button"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <details className="matter-reference" id={`matter-${detail.matter_id}-materials`}>
                  <summary>
                    Materials, activity, and decision maintenance
                  </summary>
                  <div className="matter-reference-body">
                    {recommendationText ? (
                      <section>
                        <h2>Saved recommendation</h2>
                        <div className="matter-recommendation">
                          <p>
                            <LinkifiedText text={recommendationText} />
                          </p>
                          <div className="matter-record-note">
                            This saved recommendation is not a recorded
                            decision.
                          </div>
                          {recommendationPath ? (
                            <button
                              className="btn review compact"
                              onClick={() => openDocument(recommendationPath)}
                              type="button"
                            >
                              Open recommendation
                            </button>
                          ) : null}
                        </div>
                      </section>
                    ) : null}
                    <section>
                      <h2>Matter materials</h2>
                      <div className="evidence-list">
                        {evidence.length ? (
                          evidence.map((node) => (
                            <button
                              className="evidence-row"
                              key={node.path}
                              onClick={() => openDocument(node.path)}
                              type="button"
                            >
                              <span className="evidence-kind">{node.kind}</span>
                              <span style={{ flex: 1 }}>
                                <span className="evidence-name">
                                  <LinkifiedText text={node.name} />
                                </span>
                                <span className="evidence-note">
                                  <LinkifiedText text={node.note} />
                                </span>
                              </span>
                            </button>
                          ))
                        ) : (
                          <p>
                            No source documents or research are attached yet.
                          </p>
                        )}
                        {dossierPath ? (
                          <button
                            className="matter-artifact-link"
                            onClick={() => openDocument(dossierPath)}
                            type="button"
                          >
                            <span>Editable dossier</span>
                            <span>Open the full matter summary</span>
                          </button>
                        ) : null}
                        {researchPath ? (
                          <button
                            className="matter-artifact-link"
                            onClick={() => openDocument(researchPath)}
                            type="button"
                          >
                            <span>{researchTitle}</span>
                            <span>Open the research packet</span>
                          </button>
                        ) : null}
                      </div>
                    </section>

                    <section>
                      <h2>Recent activity</h2>
                      {detail.orientation.recent_changes.length ? (
                        <ul>
                          {detail.orientation.recent_changes.map(
                            (change, index) => (
                              <li key={index}>
                                <LinkifiedText text={change} />
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p>Nothing has happened on this matter yet.</p>
                      )}
                    </section>
                    {reviewPackets.length ? (
                      <section>
                        <h2>Decision maintenance</h2>
                        {reviewPackets.map((packet) => (
                          <ReviewPacketPanel
                            key={packet.packet_id}
                            packet={packet}
                            matterId={detail.matter_id}
                            mitigations={mitigations}
                            onChanged={loadAwareness}
                          />
                        ))}
                      </section>
                    ) : mitigations.length ? (
                      <section>
                        <h2>Mitigations</h2>
                        <ul>
                          {mitigations.map((item) => (
                            <li key={item.mitigation_id}>
                              {item.title} — {item.status}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                  </div>
                </details>
              </div>
            </details>
          </>
        }
        conversation={
          <ConversationDock
            matterId={detail.matter_id}
            target={effectiveTarget}
            onTargetChange={(target) =>
              setConversationTarget(
                target ?? {
                  matter_id: detail.matter_id,
                  business_question_revision: workspace?.question.revision,
                },
              )
            }
            receipts={workspace?.receipts ?? []}
            onOpenArtifact={openDocument}
          >
            {researchIssueTitle ? (
              <div>
                <p className="matter-action-notice" role="status">
                  Research for {researchIssueTitle} is {researchQueueActive ? "running" : savedResearch.savedPacketCount ? "saved" : "starting"}.
                </p>
                <ResearchQueuePanel items={researchQueue} mode="summary" />
              </div>
            ) : null}
            <ChatPanel
              inquiryRail={<><InquiryActions target={effectiveTarget ?? { matter_id: detail.matter_id }} onAction={runWorkspaceShortcut} /><section className={matterStyles.inquiryTools}><span className="record-meta">Tools &amp; history</span><button className="btn quiet" onClick={() => showMatterTool("facts")} type="button"><MatterIcon name="chat" />Business replies</button><button className="btn quiet" onClick={() => showMatterTool("handoff")} type="button"><MatterIcon name="user" />Hand off work</button><button className="btn quiet" onClick={() => showMatterTool("impact")} type="button"><MatterIcon name="file" />Compare supplied versions</button></section></>}
              contextKey={contextKey}
              matterId={detail.matter_id}
              matterTitle={detail.title}
              activeFile={activePath}
              activeAgentId={detail.active_agent_id}
              currentWorkProductDraftPath={draftPath}
              decisionOptions={detail.orientation.options}
              initialConversationId={initialConversationId ?? detail.intake_conversation_id}
              initialRunId={detail.intake_run_id}
              intakeActive={detail.intake_state === "active"}
              intakeAnswers={detail.intake_answers}
              target={effectiveTarget ?? undefined}
              expectedQuestionRevision={workspace?.question.revision}
              contextSelections={selections}
              onFilesAttached={(refs) => setComposerFileSelection(refs, true)}
              onFilesRemoved={(refs) => setComposerFileSelection(refs, false)}
              selectedTemplateId={selectedTemplateId}
              externalRun={externalRun}
              onBeforeSubmit={() => {
                chatSubmission.current = {
                  matter: detail.matter_id,
                  runId: null,
                  scene: { ...latestScene.current },
                };
              }}
              onRunStarted={(run) => {
                if (chatSubmission.current)
                  chatSubmission.current.runId = run.run_id;
              }}
              onRunComplete={(run) => {
                void showRunContext(run);
              }}
              onClearTarget={() =>
                setConversationTarget({
                  matter_id: detail.matter_id,
                  business_question_revision: workspace?.question.revision,
                })
              }
              onRefresh={refreshAfterChatRun}
              onOpenDocument={openDocument}
              onOpenReference={(target) => void openReference(target)}
              onOpenEvidence={(evidence) => void openEvidence(evidence)}
              workspaceClaims={workspace?.claims ?? []}
              workspaceDocuments={workspace?.documents ?? []}
              conversationSeed={conversationSeed}
              onConversationChange={setCurrentConversationId}
              seed={chatSeed}
              reviewAuthor={reviewAuthor.name}
              lawyerAuthor={actor.display_name}
              onReviewAuthorChange={reviewAuthor.setName}
            />
          </ConversationDock>
        }
        editor={
          <div className={`document-workspace${referenceTarget ? " reading-reference" : ""}`}>
            <DocumentNavigator
              documents={workspace?.documents ?? []}
              activeDocumentId={activeDocument?.document_id ?? null}
              activeDocumentPath={activeDocument?.path ?? null}
              activeDocumentRevision={activeDocument?.revision ?? null}
              onOpen={openDocumentIdentity}
              onCreateWorkingCopy={(document) =>
                void createWorkingCopy(document)
              }
            />
            <DocumentTabs
              documents={openDocuments}
              activeDocumentId={activeDocument?.document_id ?? null}
              localEdits={localEdits}
              onSelect={(documentId) => {
                const document = openDocuments.find(
                  (item) => item.document_id === documentId,
                );
                if (document) openDocumentIdentity(document, false);
              }}
              onClose={(documentId) => {
                const snapshot = localEdits[documentId];
                if (snapshot?.dirty) {
                  const recoverable = recoverableLocalEditorSnapshot(snapshot);
                  writeLocalEditorSnapshot(
                    window.localStorage,
                    detail.matter_id,
                    recoverable,
                  );
                  setLocalEdits((current) => ({
                    ...current,
                    [documentId]: recoverable,
                  }));
                }
                setOpenDocuments((current) =>
                  current.filter((item) => item.document_id !== documentId),
                );
                if (activeDocument?.document_id === documentId)
                  setActivePath(null);
              }}
              onDiscardLocalEdit={(documentId) => {
                discardLocalEditorSnapshot(
                  window.localStorage,
                  detail.matter_id,
                  documentId,
                );
                setLocalEdits((current) => {
                  const next = { ...current };
                  delete next[documentId];
                  return next;
                });
              }}
            />
            <div className={`document-editor-reference${referenceTarget ? " has-reference" : ""}`}>
              {referenceTarget && activeDocument ? <div className="document-editor-reference__editing-sticky" role="status"><span>Editing:</span><strong>{activeDocument.title}</strong>{localEdits[activeDocument.document_id]?.dirty ? <span className="state-label state-attention">Unsaved changes</span> : <span className="state-label state-healthy">Saved</span>}<details><summary>Document details</summary><p>Version {activeDocument.revision}</p><p>{activeDocument.path}</p></details></div> : null}
              <div className="document-editor-reference__draft">
              <>
                {!recommendationSelected &&
                selectedSavedDraft &&
                researchQueue.length > 0 ? (
                  <section
                    className="agent-note"
                    aria-label="Saved research snapshot"
                    style={{ marginBottom: 12, padding: 14 }}
                  >
                    <strong>This draft is a saved snapshot</strong>
                    <p>
                      New research does not change this draft automatically.{" "}
                      {savedResearch.activeCount > 0
                        ? "Research is running. "
                        : ""}
                      {savedResearch.savedPacketCount} saved{" "}
                      {savedResearch.savedPacketCount === 1
                        ? "packet is"
                        : "packets are"}{" "}
                      available.
                    </p>
                    <button
                      className="btn quiet compact"
                      disabled={
                        busy ||
                        savedResearch.savedPacketCount === 0 ||
                        !selectedSavedDraft.review_revision
                      }
                      onClick={prepareResearchDraftUpdate}
                      type="button"
                    >
                      Update draft from saved research
                    </button>
                  </section>
                ) : null}
                {recommendationSelected ? (
                  recommendationState ? (
                    <RecommendationPanel
                      disabled={busy}
                      lawyerActor={reviewSettings.lawyer}
                      matterId={detail.matter_id}
                      onChanged={recommendationChanged}
                      recommendation={recommendationState}
                    />
                  ) : (
                    <p className="chat-history-status">
                      Loading the saved recommendation…
                    </p>
                  )
                ) : (
                  <DocumentPanel
                    humanActor={actor}
                    contextKey={contextKey}
                    activeDocument={activeDocument}
                    activePath={activePath}
                    localEdit={
                      activeDocument
                        ? (localEdits[activeDocument.document_id] ?? null)
                        : null
                    }
                    actionTargetDocumentId={activeDocument?.document_id ?? null}
                    documents={workspace?.documents ?? []}
                    refreshSignal={editorRefresh}
                    onSnapshot={handleEditorSnapshot}
                    onSaved={() => void refreshWorkspace()}
                    activeReviewAuthor={reviewAuthor.name}
                    lawyerAuthor={actor.display_name}
                    onReviewAuthorChange={reviewAuthor.setName}
                    onOpenReference={(target) => void openReference(target)}
                    onAskAgent={(targetId) => {
                      const target = workspace?.documents?.find(
                        (item) => item.document_id === targetId,
                      );
                      setConversationTarget({
                        matter_id: detail.matter_id,
                        business_question_revision:
                          workspace?.question.revision,
                        artifact_path: target?.path,
                        artifact_revision: target?.revision,
                      });
                      openChatWithSeed(
                        `Propose revised wording for ${target?.title ?? "the selected document"}. Preserve my edits.`,
                      );
                    }}
                    onClose={() => {
                      const id = activeDocument?.document_id;
                      if (id) {
                        const snapshot = localEdits[id];
                        if (snapshot?.dirty)
                          writeLocalEditorSnapshot(
                            window.localStorage,
                            detail.matter_id,
                            recoverableLocalEditorSnapshot(snapshot),
                          );
                        setOpenDocuments((current) =>
                          current.filter((item) => item.document_id !== id),
                        );
                      }
                      setActivePath(null);
                    }}
                    onUpload={upload}
                  />
                )}
              </>
              </div>
              {referenceTarget ? (
                <ReferencePreview
                  target={referenceTarget}
                  document={referenceDocument}
                  error={referenceError}
                  onBack={returnFromReference}
                  onOpenOriginal={(document) =>
                    window.open(
                      rawFileUrl(document.original_path || document.path),
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  onUseInRequest={(document) =>
                    void changeContext([
                      ...selections.filter(
                        (item) => item.reference_id !== document.document_id,
                      ),
                      {
                        reference_id: document.document_id,
                        path: document.path,
                        role: "source_file",
                        selected: true,
                        revision: document.revision,
                      },
                    ])
                  }
                  onCreateWorkingCopy={(document) =>
                    void createWorkingCopy(document)
                  }
                />
              ) : null}
            </div>
          </div>
        }
      />
      </div>
      <EvidenceDrawer
        evidence={activeEvidence}
        open={Boolean(activeEvidence)}
        onClose={() => {
          setActiveEvidence(null);
        }}
        onOpenArtifact={() => {
          if (!activeEvidence?.path) return;
          const document = (workspace?.documents ?? []).find(
            (item) =>
              item.path === activeEvidence.path ||
              item.document_id === activeEvidence.source_id,
          );
          if (document)
            void openReference({
              document_id: document.document_id,
              path: activeEvidence.path!,
              revision: activeEvidence.source_version ?? document.revision,
              locator: activeEvidence.locator,
              available_excerpt: activeEvidence.available_excerpt,
              exact_passage_available: Boolean(
                activeEvidence.available_excerpt || activeEvidence.locator,
              ),
              origin: {
                surface: "evidence",
                record_id: activeEvidence.claim_id,
                scroll_offset: window.scrollY,
              },
            });
          else openDocument(activeEvidence.path!);
        }}
      />

      {modalOpen ? (
        <RecordDecisionModal
          basis={evidence.map((node) => node.path)}
          basisLabels={Object.fromEntries(
            evidence.map((node) => [node.path, node.name]),
          )}
          detail={detail}
          lawyerAuthor={actor.display_name}
          onClose={() => setModalOpen(false)}
          onRecorded={reload}
          suggestion={proposedPath}
        />
      ) : null}
      {mitigationIssueId ? (
        <div className="modal-scrim">
          <form
            className="modal"
            onSubmit={(event) => {
              event.preventDefault();
              void saveMitigation();
            }}
          >
            <div className="modal-head">
              <div>
                <span className="record-meta">Issue {mitigationIssueId}</span>
                <h3>Create mitigation work</h3>
              </div>
              <button
                className="btn quiet tiny"
                onClick={() => {
                  mitigationActionKey.current = null;
                  setMitigationIssueId(null);
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
            <label className="field-block">
              <span className="field-label">Title</span>
              <input
                className="text-input"
                value={mitigationDraft.title}
                onChange={(event) => {
                  mitigationActionKey.current = null;
                  setMitigationDraft((current) => ({
                    ...current,
                    title: event.target.value,
                  }));
                }}
              />
            </label>
            <label className="field-block">
              <span className="field-label">What must be done</span>
              <textarea
                className="text-input prose"
                value={mitigationDraft.description}
                onChange={(event) => {
                  mitigationActionKey.current = null;
                  setMitigationDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }));
                }}
              />
            </label>
            <label className="field-block">
              <span className="field-label">Owner</span>
              <input
                className="text-input"
                value={mitigationDraft.owner}
                onChange={(event) => {
                  mitigationActionKey.current = null;
                  setMitigationDraft((current) => ({
                    ...current,
                    owner: event.target.value,
                  }));
                }}
              />
            </label>
            <p className="muted">
              Saving this work does not resolve the issue or record a decision.
            </p>
            <button
              className="btn primary"
              disabled={
                busy ||
                !mitigationDraft.title.trim() ||
                !mitigationDraft.description.trim() ||
                !mitigationDraft.owner.trim()
              }
              type="submit"
            >
              {busy ? "Saving…" : "Save mitigation work"}
            </button>
          </form>
        </div>
      ) : null}
      {manualDeliveryConfirmation ? (
        <ConfirmationDialog
          confirmLabel="Record manual delivery"
          description="This records delivery outside Themis.ai. It does not send or contact anyone."
          onCancel={() => setManualDeliveryConfirmation(null)}
          onConfirm={() => runControl(manualDeliveryConfirmation, true, true)}
          title="Record manual delivery?"
        />
      ) : null}
    </div>
  );
}
