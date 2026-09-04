"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import ChatPanel from "@/components/ChatPanel";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import DocumentPanel from "@/components/DocumentPanel";
import LinkifiedText from "@/components/LinkifiedText";
import MatterTree from "@/components/MatterTree";
import RecordDecisionModal from "@/components/RecordDecisionModal";
import RecommendationPanel from "@/components/RecommendationPanel";
import ResearchQueuePanel from "@/components/ResearchQueuePanel";
import ReviewPacketPanel from "@/components/ReviewPacketPanel";
import { addMatterParticipant, assignWorkItem, completeWorkItem, finalizeWorkProduct, getRecommendation, getResearchQueue, getSettings, moveMatter, performMatterAction, prioritizeWorkItem, resumeResearchQueue, retryResearchItem, saveWorkProductDraft, startResearchRun, stopResearchQueue, updateMatterRisk, uploadDocument } from "@/lib/api";
import { useReviewAuthor } from "@/lib/reviewAuthor";
import { shouldPollResearchQueue } from "@/lib/researchQueue";
import { dueWord, riskLabel, signalFor, stageLabel } from "@/lib/design";
import { completableCurrentWorkItemId, controlIdForCurrentWork, countUserFacingDocuments, currentWorkItemFor, matterArtifacts, openItemsFor, workItemOwnerLabel } from "@/lib/matterBrief";
import type { MatterControlId } from "@/lib/matterBrief";
import { lifecycleActionNeedsDirectMutation, matterAction, workflowStateExplanation } from "@/lib/matterActions";
import { collectEvidence, conversationIdFromPath, findConversationPath, findFileByName, isMatchingRecommendationSupplement, parseProposedPath, participantRoleLabel, recommendationIdentity, recommendationSummary, safeMatterPath, shouldApplyCanonicalRecommendation } from "@/lib/matter-workspace";
import { beginPendingAction, endPendingAction } from "@/lib/pendingActions";
import type { MatterActionView } from "@/lib/matterActions";
import type { DossierProjection, MatterDetail, RecommendationState, ResearchRun } from "@/lib/types";
import { getMatterMitigations, getReviewPackets } from "@/lib/watchApi";
import type { Mitigation, ReviewPacket } from "@/lib/watchTypes";

type MatterControl = Omit<MatterActionView, "id" | "category"> & {
  id: MatterControlId;
  category: MatterActionView["category"] | "Work item";
};

type MatterParticipant = { name: string; role: string };
/**
 * Canvas 2b — question, recommendation, evidence, decision. The copilot and
 * the file tree are collapsed behind buttons; the document sits on the right.
 */
export default function MatterWorkspace({
  detail,
  focusResearch = false,
  initialPath,
  onReload,
}: {
  detail: MatterDetail;
  focusResearch?: boolean;
  initialPath?: string | null;
  onReload: () => Promise<void>;
}) {
  const initialArtifacts = matterArtifacts(
    detail.tree,
    detail.response_approved_artifact_path,
    detail.current_work_product_draft_path,
    detail.latest_research_path,
    detail.current_work_product_final_path,
  );
  const researchPath = initialArtifacts.find((item) => item.kind === "research")?.path ?? null;
  const initialFallback = focusResearch && researchPath ? researchPath : null;
  const documentRequested = Boolean(initialPath || initialFallback);
  const [activePath, setActivePath] = useState<string | null>(() => safeMatterPath(initialPath, detail.path, initialFallback));
  const documentVisible = Boolean(activePath);
  const [treeActivePath, setTreeActivePath] = useState<string | null>(() =>
    documentRequested ? safeMatterPath(initialPath, detail.path, initialFallback) : null,
  );
  const [recommendation, setRecommendation] = useState<string>(() => detail.recommendation?.content.trim() ?? "");
  const [recommendationState, setRecommendationState] = useState<RecommendationState | null>(detail.recommendation ?? null);
  const recommendationStateRef = useRef<RecommendationState | null>(detail.recommendation ?? null);
  const recommendationIdentityRef = useRef(recommendationIdentity(detail.matter_id, detail.recommendation));
  const [participantName, setParticipantName] = useState("");
  const [participantRole, setParticipantRole] = useState("participant");
  const [visibleParticipants, setVisibleParticipants] = useState<MatterParticipant[]>(
    () => (detail as MatterDetail & { participants?: MatterParticipant[] }).participants ?? [],
  );
  const [ownerOverrides, setOwnerOverrides] = useState<Record<string, string>>({});
  const [pendingActions, setPendingActions] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState({ text: "", revision: 0 });
  const [conversationSeed, setConversationSeed] = useState({ conversationId: "", revision: 0 });
  const [middleSection, setMiddleSection] = useState<"overview" | "chat">(() =>
    detail.intake_state === "active" ? "chat" : "overview",
  );
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionNotice, setActionNotice] = useState("");
  const [dossierReviewPath, setDossierReviewPath] = useState<string | null>(null);
  const [dossierRefreshFailed, setDossierRefreshFailed] = useState(false);
  const [researchQueue, setResearchQueue] = useState<ResearchRun[]>([]);
  const [manualDeliveryConfirmation, setManualDeliveryConfirmation] = useState<MatterControl | MatterActionView | null>(null);
  const [newDraftOpen, setNewDraftOpen] = useState(false);
  const [newDraftTitle, setNewDraftTitle] = useState(`${detail.title} response`);
  const [newDraftContent, setNewDraftContent] = useState("");
  const [workItemOwnerInput, setWorkItemOwnerInput] = useState("");
  const [reviewPackets, setReviewPackets] = useState<ReviewPacket[]>([]);
  const [mitigations, setMitigations] = useState<Mitigation[]>([]);
  const [reviewSettings, setReviewSettings] = useState({ lawyer: "", defaultAuthor: "Themis.ai" });
  const reviewAuthor = useReviewAuthor(reviewSettings.defaultAuthor);
  const [collapsedPanes, setCollapsedPanes] = useState({ tree: true, overview: false, document: false });
  const [paneWeights, setPaneWeights] = useState({ tree: 0.24, overview: 1, document: 1.15 });
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
    const requested = safeMatterPath(initialPath, detail.path, initialFallback);
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
      setError(caught instanceof Error ? caught.message : "Could not read the research queue.");
    });
  }, [loadResearchQueue]);

  // The gate is a boolean, not the queue itself: depending on the array would
  // restart this effect on every poll and turn the 2s interval into a hot loop.
  const researchQueueActive = shouldPollResearchQueue(researchQueue);

  useEffect(() => {
    if (!researchQueueActive) return;
    let cancelled = false;
    let timer: number | undefined;
    const check = () => void loadResearchQueue()
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
        setError(caught instanceof Error ? caught.message : "Could not read the research status.");
        timer = window.setTimeout(check, 2000);
      });
    timer = window.setTimeout(check, 2000);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [loadResearchQueue, onReload, researchQueueActive]);

  /** Matter detail is canonical. The separate read only enriches its version history. */
  useEffect(() => {
    const canonical = detail.recommendation ?? null;
    const identity = recommendationIdentity(detail.matter_id, canonical);
    recommendationIdentityRef.current = identity;
    if (shouldApplyCanonicalRecommendation(recommendationStateRef.current, canonical, detail.matter_id)) {
      recommendationStateRef.current = canonical;
      setRecommendation(canonical?.content.trim() ?? "");
      setRecommendationState(canonical);
    }

    let cancelled = false;
    void getRecommendation(detail.matter_id)
      .then((saved) => {
        if (
          cancelled
          || recommendationIdentityRef.current !== identity
          || !isMatchingRecommendationSupplement(
            detail.matter_id,
            canonical?.current_version_id ?? null,
            saved,
          )
        ) return;
        recommendationStateRef.current = saved;
        setRecommendationState(saved);
        setRecommendation(saved.content.trim());
      })
      .catch(() => { /* Keep the canonical detail value when history cannot load. */ });
    return () => { cancelled = true; };
  }, [
    detail.matter_id,
    detail.recommendation?.content,
    detail.recommendation?.current_version_id,
    detail.recommendation?.current_version_number,
  ]);

  useEffect(() => { void getSettings().then((saved) => { const rows = saved.sections.find((item) => item.id === "document-review")?.rows ?? []; setReviewSettings({ lawyer: rows.find((item) => item.config_key === "document_review.lawyer_name")?.value?.trim() || "", defaultAuthor: rows.find((item) => item.config_key === "document_review.default_author")?.value || "Themis.ai" }); }); }, []);

  const loadAwareness = useCallback(async () => {
    try {
      const [packetData, mitigationData] = await Promise.all([getReviewPackets({ limit: 100 }), getMatterMitigations(detail.matter_id)]);
      setReviewPackets(packetData.items.filter((packet) => packet.affected_matters.includes(detail.matter_id) || packet.affected_decisions.some((id) => detail.decisions.some((decision) => decision.decision_id === id))));
      setMitigations(mitigationData.items);
    } catch { /* Keep the existing matter workspace usable if awareness data is unavailable. */ }
  }, [detail.decisions, detail.matter_id]);
  useEffect(() => { void loadAwareness(); }, [loadAwareness]);

  const evidence = useMemo(() => collectEvidence(detail.tree), [detail.tree]);
  const artifacts = useMemo(
    () => matterArtifacts(
      detail.tree,
      detail.response_approved_artifact_path,
      detail.current_work_product_draft_path,
      detail.latest_research_path,
      detail.current_work_product_final_path,
    ),
    [detail.current_work_product_draft_path, detail.current_work_product_final_path, detail.latest_research_path, detail.response_approved_artifact_path, detail.tree],
  );
  const draftPath = detail.current_work_product_draft_path
    ?? artifacts.find((item) => item.kind === "draft")?.path
    ?? null;
  const finalPath = detail.response_approved_artifact_path ?? detail.current_work_product_final_path ?? null;
  const dossierPath = useMemo(() => findFileByName(detail.tree, "dossier.md"), [detail.tree]);
  const requestPath = `${detail.path}/request.md`;
  const factsPath = findFileByName(detail.tree, "facts.md");
  const issuesPath = findFileByName(detail.tree, "issues.md");
  const recommendationPath = recommendationState?.path || detail.recommendation?.path || findFileByName(detail.tree, "recommendations.md");
  const researchTitle = artifacts.find((item) => item.kind === "research")?.label ?? "First-pass research";
  const lifecycleAction = matterAction(detail, Boolean(draftPath));
  const approvalUnavailable = lifecycleAction.id === "approve_response" && !finalPath;
  const currentWorkItem = currentWorkItemFor(
    detail.work_items,
    detail.work_state.next_work_item_id,
  );
  const currentControlId = controlIdForCurrentWork(lifecycleAction.id, currentWorkItem);
  const currentControl: MatterControl = currentControlId === lifecycleAction.id
    ? lifecycleAction
    : currentControlId === "run_research"
      ? { id: "run_research", category: "Work action", label: "Run research", detail: "Run the current research work item." }
      : { id: "open_work_item", category: "Work item", label: "Open work item", detail: "Open the saved work item and review its details." };
  const currentCompletableWorkItemId = completableCurrentWorkItemId(currentWorkItem);
  const currentWorkItemOwner = workItemOwnerLabel(currentWorkItem);
  const currentWorkItemPriority = detail.work_items.find(
    (item) => item.work_item_id === currentWorkItem?.work_item_id,
  )?.priority ?? "normal";
  const currentResearchWorkItem = detail.work_items.find(
    (item) => item.work_item_id === currentWorkItem?.work_item_id && item.item_type === "research",
  );
  const directResearchQuestion = [
    currentResearchWorkItem?.description ?? "",
    currentResearchWorkItem?.title ?? "",
    detail.orientation.decision_question,
    detail.orientation.summary,
    detail.title,
  ].map((value) => value.trim()).find(Boolean) ?? detail.title;
  useEffect(() => {
    setWorkItemOwnerInput(currentWorkItem?.owner ?? "");
  }, [currentWorkItem?.owner, currentWorkItem?.work_item_id]);
  useEffect(() => {
    setVisibleParticipants((detail as MatterDetail & { participants?: MatterParticipant[] }).participants ?? []);
    setOwnerOverrides({});
  }, [detail.matter_id, (detail as MatterDetail & { participants?: MatterParticipant[] }).participants, detail.work_items]);
  const participants = visibleParticipants;
  const configuredLawyer = reviewSettings.lawyer.trim();
  const currentQuickOwners = [...new Set([configuredLawyer, ...participants.map((participant) => participant.name)].filter(Boolean))]
    .filter((owner) => currentWorkItemOwner !== "Unassigned" || owner !== configuredLawyer);
  const signal = signalFor(detail);
  const due = dueWord(detail);

  const reload = useCallback(async () => {
    await onReload();
  }, [onReload]);

  const refreshAfterChatRun = useCallback(async () => {
    await Promise.all([reload(), loadResearchQueue()]);
  }, [loadResearchQueue, reload]);

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
      const path = typeof extracted === "string" && extracted ? extracted : result.path;
      if (typeof path === "string") openDocument(path);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not upload the file.");
    } finally {
      setUploading(false);
    }
  }

  function openDocument(path: string) {
    setActivePath(path);
    setTreeActivePath(path);
    setCollapsedPanes((current) => ({ ...current, document: false }));
  }

  function openChatWithSeed(text: string) {
    setMiddleSection("chat");
    setChatSeed((current) => ({ text, revision: current.revision + 1 }));
  }

  function togglePane(pane: keyof typeof collapsedPanes) {
    setCollapsedPanes((current) => {
      const openCount = Object.values(current).filter((collapsed) => !collapsed).length;
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
      for (const pane of Object.keys(paneRefs) as Array<keyof typeof paneWeights>) {
        if (!collapsedPanes[pane]) next[pane] = paneRefs[pane].current?.getBoundingClientRect().width ?? current[pane];
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
    dragRef.current = { left, right, startX: event.clientX, leftWidth, rightWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function continueResize(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    applyResize(drag.left, drag.right, drag.leftWidth, drag.rightWidth, event.clientX - drag.startX);
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
    applyResize(left, right, leftWidth, rightWidth, event.key === "ArrowLeft" ? -24 : 24);
  }

  function selectMatterItem(path: string) {
    const conversationId = conversationIdFromPath(path);
    setTreeActivePath(path);
    if (conversationId) {
      setMiddleSection("chat");
      setConversationSeed((current) => ({ conversationId, revision: current.revision + 1 }));
      return;
    }
    openDocument(path);
  }

  async function runControl(control: MatterControl | MatterActionView, confirmed = false, throwOnError = false) {
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
      openChatWithSeed("Draft the work product for the chosen path and save it in this matter.");
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
        const startedResearchRun = await startResearchRun(detail.matter_id, directResearchQuestion);
        try {
          await loadResearchQueue();
        } catch (caught) {
          setResearchQueue((current) => current.some((item) => item.run_id === startedResearchRun.run_id)
            ? current
            : [startedResearchRun, ...current]);
          setActionNotice("Research started in the background. Server work continues while Themis.ai reconnects to the research queue.");
          setError(caught instanceof Error ? caught.message : "The research queue could not reload yet. Another research request is blocked until it reconnects.");
          return;
        }
        setActionNotice("Research started in the background. You can continue working while it runs.");
        await reloadPersisted("The action was recorded, but the matter did not refresh. Reload the page to see current state.");
      } else if (control.id === "start_work_product") {
        await moveMatter(detail.matter_id, "generate", "Judgment complete; starting work product");
        await reloadPersisted("The matter moved to drafting, but the workspace did not refresh. Reload the page to see current state.");
      } else if (control.id !== "open_work_item" && lifecycleActionNeedsDirectMutation(control.id)) {
        const actor = reviewSettings.lawyer.trim();
        if (!actor) throw new Error("Add the lawyer name in document review settings before you record this action.");
        if (control.id === "approve_response" && !finalPath) {
          throw new Error("A current final work product is required before approval can be recorded.");
        }
        const result = await performMatterAction(detail.matter_id, {
          action: control.id,
          actor,
          artifact_path: control.id === "approve_response" ? finalPath : undefined,
          work_item_id: control.id === "approve_response" && currentWorkItem?.item_type === "approval"
            ? currentWorkItem.work_item_id
            : undefined,
        });
        const recordedNotice = {
          approve_response: "Approval recorded for the final work product.",
          mark_as_sent: "Manual delivery outside Themis.ai recorded for the approved work product.",
          close_matter: "Matter closed.",
        }[control.id];
        const alreadyRecordedNotice = {
          approve_response: "Approval was already recorded.",
          mark_as_sent: "Delivery was already recorded.",
          close_matter: "Matter was already closed.",
        }[control.id];
        setActionNotice(result.already_recorded
          ? result.changed_paths.length
            ? `${alreadyRecordedNotice} Related saved state was repaired; no duplicate record was created.`
            : `${alreadyRecordedNotice} No new save was made.`
          : result.changed_paths.length
            ? recordedNotice
            : "No saved matter state changed.");
        await reloadPersisted("The action was recorded, but the matter did not refresh. Reload the page to see current state.");
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not complete the matter action.";
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
      const actor = reviewSettings.lawyer.trim() || "Lawyer";
      const result = await completeWorkItem(detail.matter_id, workItemId, actor);
      setActionNotice(result.changed_paths.length
        ? "Work item completed."
        : "Work item was already complete. No new save was made.");
      await reloadPersisted("The work item was completed, but the matter did not refresh. Reload the page to see current state.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete the work item.");
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
      const actor = reviewSettings.lawyer.trim() || "Lawyer";
      const result = await assignWorkItem(detail.matter_id, workItemId, owner, actor);
      const saved = result.matter.work_items.find((item) => item.work_item_id === workItemId);
      setOwnerOverrides((current) => ({ ...current, [workItemId]: saved?.owner?.trim() || owner }));
      setActionNotice(result.changed_paths.length
        ? `Work item assigned to ${owner}.`
        : `Work item is already assigned to ${owner}. No new save was made.`);
      await reloadPersisted("The owner was saved, but the matter did not refresh. Reload the page to see current state.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not assign the work item.");
    } finally {
      setPendingActions((current) => endPendingAction(current, pendingKey));
    }
  }

  async function assignWorkItemTo(workItemId: string, owner: string) {
    const pendingKey = `assign_owner:${workItemId}`;
    if (!owner.trim() || pendingActions.includes(pendingKey)) return;
    setPendingActions((current) => beginPendingAction(current, pendingKey)); setError("");
    try {
      const result = await assignWorkItem(detail.matter_id, workItemId, owner.trim(), reviewSettings.lawyer.trim() || "Lawyer");
      const saved = result.matter.work_items.find((item) => item.work_item_id === workItemId);
      setOwnerOverrides((current) => ({ ...current, [workItemId]: saved?.owner?.trim() || owner.trim() }));
      setActionNotice(`Work item assigned to ${owner.trim()}.`);
      await reloadPersisted("The owner was saved, but the matter did not refresh.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not assign the work item."); }
    finally { setPendingActions((current) => endPendingAction(current, pendingKey)); }
  }

  async function changeWorkItemPriority(workItemId: string, priority: string) {
    setBusy(true); setError("");
    try {
      await prioritizeWorkItem(detail.matter_id, workItemId, priority, reviewSettings.lawyer.trim() || "Lawyer");
      setActionNotice("Work item priority updated.");
      await reloadPersisted("The priority was saved, but the matter did not refresh.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update the priority."); }
    finally { setBusy(false); }
  }

  async function finalizeCurrentDraft() {
    if (!draftPath) return;
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      const result = await finalizeWorkProduct(detail.matter_id, draftPath);
      reconcileDossierProjection(result.dossier_projection);
      setActionNotice(result.changed_paths?.length
        ? "Final work product saved. The matter is ready for approval."
        : "This final work product already exists. No new save was made.");
      await reloadPersisted("The final work product was saved, but the matter did not refresh. Reload the page to see current state.");
      openDocument(result.vault_path);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not finalize the current draft.";
      setError(message);
      if (/draft status before finalizing/i.test(message)) openDocument(draftPath);
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
      setActionNotice(result.changed_paths.length
        ? "New current draft saved."
        : "This current draft already exists. No new save was made.");
      setNewDraftContent("");
      setNewDraftOpen(false);
      await reloadPersisted("The draft was saved, but the matter did not refresh. Reload the page to see current state.");
      openDocument(result.vault_path);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the draft.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRisk(riskLevel: string) {
    setBusy(true);
    setError("");
    setActionNotice("");
    try {
      await updateMatterRisk(detail.matter_id, riskLevel || null, reviewSettings.lawyer.trim() || "Lawyer");
      setActionNotice(riskLevel ? `Risk set to ${riskLabel(riskLevel)}.` : "Risk is now unset.");
      await reloadPersisted("Risk was saved, but the matter did not refresh. Reload the page to see current state.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update risk.");
    } finally {
      setBusy(false);
    }
  }

  async function addParticipant() {
    const pendingKey = "add_participant";
    if (!participantName.trim() || pendingActions.includes(pendingKey)) return;
    setPendingActions((current) => beginPendingAction(current, pendingKey)); setError("");
    try {
      const result = await addMatterParticipant(detail.matter_id, participantName, participantRole, reviewSettings.lawyer.trim() || "Lawyer");
      setVisibleParticipants(result.data.participants);
      setParticipantName(""); setActionNotice("Participant added.");
      await reloadPersisted("The participant was saved, but the matter did not refresh.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not add the participant."); }
    finally { setPendingActions((current) => endPendingAction(current, pendingKey)); }
  }

  async function recommendationChanged(saved: RecommendationState) {
    recommendationIdentityRef.current = recommendationIdentity(detail.matter_id, saved);
    recommendationStateRef.current = saved;
    setRecommendationState(saved);
    setRecommendation(saved.content.trim());
    reconcileDossierProjection(saved.dossier_projection);
    setActionNotice("Working recommendation saved.");
    await reloadPersisted("The recommendation was saved, but the matter did not refresh.");
  }

  const proposedPath = parseProposedPath(recommendation ?? "");
  const recommendationText = proposedPath || recommendationSummary(recommendation ?? "");
  const orientationSummary = detail.orientation.summary.trim() || detail.description.trim();
  const decisionQuestion = detail.orientation.decision_question.trim();
  const currentTask = detail.status === "intake"
    ? detail.work_state.next_action.trim() || detail.orientation.headline.trim() || lifecycleAction.detail
    : lifecycleAction.id === "none"
      ? lifecycleAction.detail
      : detail.work_state.next_action.trim() || currentWorkItem?.title || lifecycleAction.detail;
  const workflowState = workflowStateExplanation(detail);
  const openItems = openItemsFor(
    detail.work_items,
    detail.orientation.open_questions,
    detail.work_state.next_work_item_id,
    currentTask,
  );
  const requiredCount = openItems.filter((item) => item.required).length;
  const optionalWorkCount = openItems.filter((item) => item.source === "work_item" && !item.required).length;
  const openQuestionCount = openItems.filter((item) => item.source === "open_question").length;
  const closedContext = detail.status === "closed"
    ? [...new Set([decisionQuestion, ...openItems.map((item) => item.text)].filter(Boolean))]
    : [];
  const requiredOpenWorkItems = detail.work_items.filter(
    (item) => Boolean(item.required) && !["done", "closed"].includes(item.status),
  );
  const otherOpenWorkItems = detail.work_items.filter(
    (item) => !["done", "closed"].includes(item.status)
      && item.work_item_id !== currentWorkItem?.work_item_id,
  );
  const otherRequiredOpenCount = otherOpenWorkItems.filter((item) => Boolean(item.required)).length;
  const otherOptionalOpenCount = otherOpenWorkItems.length - otherRequiredOpenCount;
  const recommendationSelected = Boolean(activePath && [recommendationPath, recommendationState?.path].filter(Boolean).includes(activePath));
  const visibleArtifacts = artifacts.filter((item) => item.kind !== "recommendation");
  const showCurrentControl = lifecycleAction.id !== "none"
    && currentControl.id !== "open_work_item";
  const showLifecycleAction = lifecycleAction.id !== "none"
    && lifecycleAction.id !== "review_intake"
    && lifecycleAction.id !== currentControl.id;
  const primaryActionClass = currentControl.category === "Counsel judgment" || currentControl.category === "Approval"
    ? "btn review"
    : currentControl.id === "run_research" || currentControl.id === "draft_work_product"
      ? "btn agent"
      : "btn primary";

  return (
    <div className="matter-shell">
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
              <span className="matter-status-signal" style={{ color: signal.wordColor }}>
                <span className="dot sm" style={{ background: signal.rail }} />
                {signal.word}
              </span>
            ) : null}
            <div className="matter-crumb">
              <Link href="/matters" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Matters</Link>
            </div>
          </div>
          <h1 className="matter-title"><LinkifiedText text={detail.title} /></h1>
        </div>
        <dl className="matter-facts">
          <div>
            <dt>Stage</dt>
            <dd>{stageLabel(detail.status)}</dd>
          </div>
          <div>
            <dt>Risk</dt>
            <dd>
              <label className="sr-only" htmlFor="matter-risk">Lawyer-set risk</label>
              <select
                aria-label="Lawyer-set risk"
                className="matter-risk-select"
                disabled={busy}
                id="matter-risk"
                onChange={(event) => void changeRisk(event.target.value)}
                value={detail.risk_level && detail.risk_level !== "unknown" ? detail.risk_level : ""}
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
        </dl>
      </header>

      {error ? <p className="error" role="alert" style={{ margin: "10px 34px 0" }}>{error}</p> : null}
      {actionNotice ? <p className="matter-action-notice" role="status">{actionNotice}</p> : null}

      <div
        className="matter-panes"
        style={{
          gridTemplateColumns: [
            collapsedPanes.tree ? "44px" : `minmax(210px, ${paneWeights.tree}fr)`,
            collapsedPanes.tree || collapsedPanes.overview ? "0px" : "8px",
            collapsedPanes.overview ? "44px" : `minmax(360px, ${paneWeights.overview}fr)`,
            ...(documentVisible ? [
              collapsedPanes.overview || collapsedPanes.document ? "0px" : "8px",
              collapsedPanes.document ? "44px" : `minmax(430px, ${paneWeights.document}fr)`,
            ] : []),
          ].join(" "),
        } as CSSProperties}
      >
        <aside className="matter-tree-pane" ref={treePaneRef}>
          <button
            aria-expanded={!collapsedPanes.tree}
            className="pane-rail"
            hidden={!collapsedPanes.tree}
            onClick={() => togglePane("tree")}
            title="Expand matter contents"
            type="button"
          >
            <span>›</span><span>Matter contents</span>
          </button>
          <div className="pane-content" hidden={collapsedPanes.tree}>
            <div className="matter-tree-head">
              <span>Matter contents</span>
              <span className="matter-tree-head-actions">
                <span aria-label={`${countUserFacingDocuments(detail.tree)} documents`} className="matter-tree-count">{countUserFacingDocuments(detail.tree)}</span>
                <button aria-label="Collapse matter contents" className="pane-collapse" onClick={() => togglePane("tree")} title="Collapse matter contents" type="button">‹</button>
              </span>
            </div>
            <div className="matter-tree-scroll">
              <MatterTree
                activePath={treeActivePath}
                onNewChat={() => {
                  setTreeActivePath(null);
                  setMiddleSection("chat");
                  setConversationSeed((current) => ({ conversationId: "", revision: current.revision + 1 }));
                }}
                onSelect={selectMatterItem}
                onUpload={upload}
                tree={detail.tree}
                uploading={uploading}
              />
            </div>
          </div>
        </aside>

        <div
          aria-label="Resize matter contents and matter overview"
          aria-orientation="vertical"
          className={`pane-resizer ${collapsedPanes.tree || collapsedPanes.overview ? "hidden" : ""}`}
          onKeyDown={(event) => resizeWithKeyboard(event, "tree", "overview")}
          onLostPointerCapture={() => { dragRef.current = null; }}
          onPointerCancel={() => { dragRef.current = null; }}
          onPointerDown={(event) => startResize(event, "tree", "overview")}
          onPointerMove={continueResize}
          onPointerUp={() => { dragRef.current = null; }}
          role="separator"
          tabIndex={collapsedPanes.tree || collapsedPanes.overview ? -1 : 0}
        />

        <div className="brief-pane" ref={overviewPaneRef}>
          <button
            aria-expanded={!collapsedPanes.overview}
            className="pane-rail"
            hidden={!collapsedPanes.overview}
            onClick={() => togglePane("overview")}
            title="Expand matter overview"
            type="button"
          >
            <span>›</span><span>Matter overview</span>
          </button>
          <div className="pane-content" hidden={collapsedPanes.overview}>
            <div className="pane-head">
              <span>Matter overview</span>
              <button
                aria-label="Collapse matter overview"
                className="pane-collapse"
                onClick={() => togglePane("overview")}
                title="Collapse matter overview"
                type="button"
              >‹</button>
            </div>
            <div className={`middle-section ${middleSection === "overview" ? "active" : "collapsed"}`}>
              <button
                aria-controls="matter-overview-panel"
                aria-expanded={middleSection === "overview"}
                aria-label="Show matter Overview"
                className="middle-section-toggle"
                id="matter-overview-toggle"
                onClick={() => setMiddleSection("overview")}
                type="button"
              >
                <span>Overview</span>
                <span aria-hidden="true">{middleSection === "overview" ? "−" : "+"}</span>
              </button>
              <div
                aria-labelledby="matter-overview-toggle"
                className="middle-section-panel brief-scroll"
                hidden={middleSection !== "overview"}
                id="matter-overview-panel"
                role="region"
              >
              <div className="matter-brief">
                <section className={`matter-call ${lifecycleAction.id === "none" ? "is-complete" : ""}`}>
                  <span className="matter-call-kicker">
                    {lifecycleAction.id === "none" ? "Matter status" : "Required work"}
                  </span>
                  <p className="matter-call-task"><LinkifiedText text={currentTask} /></p>
                  <p className="matter-call-detail" role="status"><LinkifiedText text={workflowState} /></p>

                  <div className="matter-orientation">
                    <div className="matter-orientation-label">Matter at a glance</div>
                    <p><LinkifiedText text={orientationSummary || "No matter summary is saved."} /></p>
                    {detail.status !== "closed" && decisionQuestion && decisionQuestion !== orientationSummary ? (
                      <>
                        <div className="matter-orientation-label matter-orientation-question">Question to resolve</div>
                        <p><LinkifiedText text={decisionQuestion} /></p>
                      </>
                    ) : null}
                  </div>

                  {detail.original_request.trim() ? (
                    <details className="matter-original-request">
                      <summary>Original request</summary>
                      <div className="matter-original-request-text">
                        <LinkifiedText text={detail.original_request} />
                      </div>
                    </details>
                  ) : null}

                  <div className="matter-orientation">
                      <div className="matter-orientation-label">Participants</div>
                      {participants.length ? <ul>
                        {participants.map((participant) => (
                          <li key={`${participant.role}:${participant.name}`}>
                            <strong>{participant.name}</strong> · {participantRoleLabel(participant.role)}
                          </li>
                        ))}
                      </ul> : <p>No participants are saved.</p>}
                      <div className="matter-inline-actions">
                        <input aria-label="Participant name" className="text-input" onChange={(event) => setParticipantName(event.target.value)} placeholder="Participant name" value={participantName} />
                        <input aria-label="Participant role" className="text-input" onChange={(event) => setParticipantRole(event.target.value)} placeholder="Role" value={participantRole} />
                        <button
                          className="btn quiet compact"
                          disabled={pendingActions.includes("add_participant") || !participantName.trim() || !participantRole.trim()}
                          onClick={() => void addParticipant()}
                          type="button"
                        >
                          {pendingActions.includes("add_participant") ? "Adding participant…" : "Add participant"}
                        </button>
                      </div>
                    </div>

                  {lifecycleAction.id === "close_matter" && (researchQueueActive || requiredOpenWorkItems.length > 0) ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Before you can close</span>
                      <ol className="matter-open-list">
                        {researchQueueActive ? <li><span className="matter-open-text">Stop or finish active research.</span><button className="btn tiny quiet" disabled={busy} onClick={() => void stopResearchQueue(detail.matter_id).then(loadResearchQueue)} type="button">Stop research</button></li> : null}
                        {requiredOpenWorkItems.map((item) => <li key={item.work_item_id}>
                          <span className="matter-open-text"><strong>{item.title}</strong> · Owner: {ownerOverrides[item.work_item_id] || item.owner?.trim() || "Unassigned"}</span>
                          {!item.owner?.trim() ? <button className="btn tiny quiet" disabled={busy} onClick={() => void assignWorkItemTo(item.work_item_id, reviewSettings.lawyer.trim() || "Lawyer")} type="button">Assign owner</button> : null}
                          <button className="btn tiny quiet" disabled={busy} onClick={() => void completeSavedWorkItem(item.work_item_id)} type="button">Complete</button>
                        </li>)}
                      </ol>
                    </div>
                  ) : null}

                  {showCurrentControl ? (
                    <div className="matter-call-do">
                      <span>{currentControl.category}</span>
                      <button
                        aria-busy={busy}
                        className={`${primaryActionClass} matter-call-button`}
                        disabled={busy || (currentControl.id === "run_research" && researchQueueActive) || (currentControl.id === "approve_response" && approvalUnavailable) || (currentControl.id === "close_matter" && (researchQueueActive || Boolean(requiredOpenWorkItems.length)))}
                        onClick={() => void runControl(currentControl)}
                        title={currentControl.detail}
                        type="button"
                      >
                        {busy ? "Working…" : currentControl.id === "mark_as_sent" ? "Record manual delivery" : currentControl.label}
                      </button>
                      {currentControl.id === "mark_as_sent" ? <button className="btn quiet compact" disabled title="Direct sending is not available in the MVP." type="button">Send directly — coming later</button> : null}
                    </div>
                  ) : null}

                  {currentWorkItem ? (
                    <div className="matter-lifecycle-action">
                      <span>Current work · Saved work item</span>
                      <p>Owner: <strong>{ownerOverrides[currentWorkItem.work_item_id] || currentWorkItemOwner}</strong></p>
                      <div className="matter-inline-actions">
                        <select aria-label={`Priority for ${currentWorkItem.title}`} className="text-input" disabled={busy} onChange={(event) => void changeWorkItemPriority(currentWorkItem.work_item_id, event.target.value)} value={currentWorkItemPriority}>
                          <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                        </select>
                        {currentWorkItemOwner === "Unassigned" ? (
                          <button className="btn quiet compact" disabled={pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`)} onClick={() => void assignWorkItemTo(currentWorkItem.work_item_id, reviewSettings.lawyer.trim() || "Lawyer")} type="button">
                            {pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`) ? "Assigning owner…" : `Assign to ${reviewSettings.lawyer.trim() || "Lawyer"}`}
                          </button>
                        ) : null}
                        {currentQuickOwners.map((owner) => (
                          <button className="btn tiny quiet" disabled={pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`)} key={owner} onClick={() => void assignWorkItemTo(currentWorkItem.work_item_id, owner)} type="button">
                            {pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`) ? "Assigning owner…" : owner}
                          </button>
                        ))}
                        <label htmlFor="current-work-item-owner">Other owner</label>
                        <input id="current-work-item-owner" className="text-input" onChange={(event) => setWorkItemOwnerInput(event.target.value)} placeholder="Owner name" value={workItemOwnerInput} />
                        <button
                          className="btn quiet compact"
                          disabled={!workItemOwnerInput.trim() || pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`)}
                          onClick={() => void assignSavedWorkItem(currentWorkItem.work_item_id)}
                          type="button"
                        >
                          {pendingActions.includes(`assign_owner:${currentWorkItem.work_item_id}`) ? "Assigning owner…" : "Assign owner"}
                        </button>
                        <button className="btn quiet compact" onClick={() => openDocument(currentWorkItem.path)} type="button">Open work item</button>
                        {currentCompletableWorkItemId ? (
                          <button
                            className="btn quiet compact"
                            disabled={busy}
                            onClick={() => void completeSavedWorkItem(currentCompletableWorkItemId)}
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
                        disabled={busy || (lifecycleAction.id === "approve_response" && approvalUnavailable) || (lifecycleAction.id === "close_matter" && (researchQueueActive || Boolean(requiredOpenWorkItems.length)))}
                        onClick={() => void runControl(lifecycleAction)}
                        type="button"
                      >
                        {lifecycleAction.id === "mark_as_sent" ? "Record manual delivery" : lifecycleAction.label}
                      </button>
                      {lifecycleAction.id === "mark_as_sent" ? <button className="btn quiet compact" disabled title="Direct sending is not available in the MVP." type="button">Send directly — coming later</button> : null}
                    </div>
                  ) : null}

                  {detail.response_approved_at && lifecycleAction.id !== "close_matter" && requiredOpenWorkItems.length ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Approved — required work remains</span>
                      <p>{requiredOpenWorkItems.length} required {requiredOpenWorkItems.length === 1 ? "item is" : "items are"} still open: {requiredOpenWorkItems.map((item) => item.title).join("; ")}</p>
                    </div>
                  ) : null}

                  {dossierReviewPath ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Dossier · Review required</span>
                      <p>The main save completed. Review the proposed dossier update before you use it.</p>
                      <button className="btn review compact" onClick={() => openDocument(dossierReviewPath)} type="button">Review dossier update</button>
                    </div>
                  ) : null}

                  {dossierRefreshFailed ? (
                    <div className="matter-lifecycle-action" role="status">
                      <span>Dossier · Refresh failed</span>
                      <p>Work saved; dossier did not refresh.</p>
                      <button className="btn quiet compact" onClick={() => void reloadPersisted("Work is saved, but the matter did not refresh.")} type="button">Reload matter</button>
                    </div>
                  ) : null}

                  {draftPath && !detail.response_approved_at ? (
                    <div className="matter-lifecycle-action work-product-action">
                      <span>Work product · Current draft</span>
                      <p>Finalize the current canonical draft. This creates the final response from the reviewed content.</p>
                      <div className="matter-inline-actions">
                        <button className="btn quiet compact" onClick={() => openDocument(draftPath)} type="button">Open current draft</button>
                        <button className="btn primary compact" disabled={busy} onClick={() => void finalizeCurrentDraft()} type="button">
                          {busy ? "Working…" : "Finalize current draft"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="matter-artifacts compact">
                    <strong>Matter artifacts</strong>
                    {factsPath ? <button className="matter-artifact-link" onClick={() => openDocument(factsPath)} type="button"><span>Facts</span><span>Facts, sources & assumptions</span></button> : null}
                    {issuesPath ? <button className="matter-artifact-link" onClick={() => openDocument(issuesPath)} type="button"><span>Issue map</span><span>Current issues and questions</span></button> : null}
                    {recommendationPath ? <button className="matter-artifact-link" onClick={() => openDocument(recommendationPath)} type="button"><span>Recommendation</span><span>Open recommendation</span></button> : null}
                    {visibleArtifacts.map((item) => (
                      <button className="matter-artifact-link" key={`${item.kind}:${item.path}`} onClick={() => openDocument(item.path)} type="button">
                        <span>{item.kind === "final"
                          ? item.path === detail.response_approved_artifact_path ? "Approved response" : "Final response"
                          : { recommendation: "Working recommendation", research: "Research packet", draft: "Current draft" }[item.kind]}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    {detail.decisions.map((decision) => (
                      <button className="matter-artifact-link" key={decision.decision_id} onClick={() => openDocument(decision.path)} type="button">
                        <span>Recorded decision</span><span>{decision.title}</span>
                      </button>
                    ))}
                    {detail.status !== "closed" ? (
                      <button className="matter-artifact-link" onClick={() => setModalOpen(true)} type="button">
                        <span>Record durable decision</span><span>Open the decision form</span>
                      </button>
                    ) : null}
                    {!researchPath ? <span className="matter-artifact-empty">No research packet is saved yet.</span> : null}
                    {!recommendationText ? <span className="matter-artifact-empty">No working recommendation is saved yet.</span> : null}
                    {!draftPath ? <span className="matter-artifact-empty">No current work-product draft is saved yet.</span> : null}
                    {!finalPath ? <span className="matter-artifact-empty">No final work product is saved yet.</span> : null}
                    {!detail.decisions.length ? <span className="matter-artifact-empty">No durable decision is recorded for this matter.</span> : null}
                    <button className="btn quiet compact matter-new-draft-toggle" onClick={() => setNewDraftOpen((open) => !open)} type="button">
                      {newDraftOpen ? "Cancel new draft" : "New draft"}
                    </button>
                    {newDraftOpen ? (
                      <div className="matter-new-draft">
                        <label htmlFor="new-draft-title">Draft title</label>
                        <input className="text-input" id="new-draft-title" onChange={(event) => setNewDraftTitle(event.target.value)} value={newDraftTitle} />
                        <label htmlFor="new-draft-content">Draft content</label>
                        <textarea className="text-input prose" id="new-draft-content" onChange={(event) => setNewDraftContent(event.target.value)} placeholder="Write or paste the deliverable here." value={newDraftContent} />
                        <button className="btn primary compact" disabled={busy || !newDraftTitle.trim() || !newDraftContent.trim()} onClick={() => void createManualDraft()} type="button">Save current draft</button>
                      </div>
                    ) : null}
                  </div>
                </section>

                {detail.status === "closed" ? (
                  closedContext.length ? <details className="matter-open" id="remaining-work">
                    <summary>Open context at closure</summary>
                    <ul className="matter-open-list">{closedContext.map((item) => <li key={item}><span className="matter-open-text"><LinkifiedText text={item} /></span></li>)}</ul>
                  </details> : null
                ) : <section className="matter-open" id="remaining-work">
                  <div className="matter-open-head">
                    <h2>{openItems.length ? "Other open items and questions" : "No other open items or questions"}</h2>
                    {openItems.length ? (
                      <span>{requiredCount} other required work · {optionalWorkCount} optional work · {openQuestionCount} open questions</span>
                    ) : null}
                  </div>
                  {openItems.length ? (
                    <ul className="matter-open-list">
                      {openItems.map((item) => (
                        <li className={item.required ? "is-required" : ""} key={item.key}>
                          <span aria-hidden="true" className="matter-open-mark" />
                          <span className="matter-open-text"><LinkifiedText text={item.text} /></span>
                          <span className="matter-open-tag">{item.source === "open_question" ? "Open question" : item.required ? "Required work" : "Optional work"}</span>
                          {item.required && item.workItemId ? (
                            <button className="btn tiny quiet" disabled={busy} onClick={() => void completeSavedWorkItem(item.workItemId!)} type="button">Complete</button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="matter-open-empty">No other open records are saved.</p>
                  )}
                </section>}

                <ResearchQueuePanel
                  items={researchQueue}
                  mode="summary"
                  busy={busy}
                  showDraftSnapshotNotice={Boolean(draftPath && activePath === draftPath)}
                  onUpdateDraftFromSavedResearch={() => openChatWithSeed(
                    `Update the active draft from the saved research packets. Propose the changes as tracked revisions in ${draftPath?.split("/").at(-1) ?? "the current draft"} so I can accept or reject each redline. Do not replace the draft automatically.`,
                  )}
                  onResume={async () => { setBusy(true); try { await resumeResearchQueue(detail.matter_id); await loadResearchQueue(); } finally { setBusy(false); } }}
                  onStop={async () => { setBusy(true); try { await stopResearchQueue(detail.matter_id); await loadResearchQueue(); } finally { setBusy(false); } }}
                  onRetry={async (runId) => { setBusy(true); try { await retryResearchItem(detail.matter_id, runId); await loadResearchQueue(); } finally { setBusy(false); } }}
                  onContinueFromPartial={(item) => openChatWithSeed(
                    `Draft the work product using the saved partial research packet for: ${item.question ?? item.questions?.[0] ?? detail.title}`,
                  )}
                />

                {detail.status !== "closed" ? <section className="matter-open" aria-label="Other saved work items">
                  <div className="matter-open-head"><h2>Other saved work items</h2><span>{otherRequiredOpenCount} required open · {otherOptionalOpenCount} optional open</span></div>
                  <div className="stack-list">
                    {otherOpenWorkItems.map((item) => (
                      <div className="matter-lifecycle-action" key={item.work_item_id}>
                        <span>
                          {Boolean(item.required) ? "Required" : "Optional"}
                          {detail.status === "closed" && !Boolean(item.required) ? " · Open after closure" : ""}
                          {item.work_item_id === detail.work_state.next_work_item_id ? " · Current next action" : " · Open work"} · {item.priority}
                        </span>
                        <p><strong>{item.title}</strong></p>
                        <p>Owner: <strong>{ownerOverrides[item.work_item_id] || item.owner?.trim() || "Unassigned"}</strong></p>
                        <div className="matter-inline-actions">
                          <select aria-label={`Priority for ${item.title}`} className="text-input" disabled={busy} onChange={(event) => void changeWorkItemPriority(item.work_item_id, event.target.value)} value={item.priority || "normal"}>
                            <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
                          </select>
                          {[...new Set([reviewSettings.lawyer, ...participants.map((participant) => participant.name)].filter(Boolean))].map((owner) => (
                            <button className="btn tiny quiet" disabled={pendingActions.includes(`assign_owner:${item.work_item_id}`)} key={owner} onClick={() => void assignWorkItemTo(item.work_item_id, owner)} type="button">
                              {pendingActions.includes(`assign_owner:${item.work_item_id}`) ? "Assigning owner…" : owner}
                            </button>
                          ))}
                          <input aria-label={`Owner for ${item.title}`} className="text-input" defaultValue={item.owner} disabled={pendingActions.includes(`assign_owner:${item.work_item_id}`)} onKeyDown={(event) => { if (event.key === "Enter") void assignWorkItemTo(item.work_item_id, event.currentTarget.value); }} placeholder="Owner name" />
                          <button className="btn tiny quiet" disabled={busy} onClick={() => void completeSavedWorkItem(item.work_item_id)} type="button">Complete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section> : null}

                <details className="matter-reference">
                  <summary>Materials, activity, and decision maintenance</summary>
                  <div className="matter-reference-body">
                    {recommendationText ? (
                      <section>
                        <h2>Saved recommendation</h2>
                        <div className="matter-recommendation">
                          <p><LinkifiedText text={recommendationText} /></p>
                          <div className="matter-record-note">
                            This saved recommendation is not a recorded decision.
                          </div>
                          {recommendationPath ? <button className="btn review compact" onClick={() => openDocument(recommendationPath)} type="button">Open recommendation</button> : null}
                        </div>
                      </section>
                    ) : null}
                    <section>
                      <h2>Matter materials</h2>
                      <div className="evidence-list">
                        {evidence.length ? evidence.map((node) => (
                          <button className="evidence-row" key={node.path} onClick={() => openDocument(node.path)} type="button">
                            <span className="evidence-kind">{node.kind}</span>
                            <span style={{ flex: 1 }}>
                              <span className="evidence-name"><LinkifiedText text={node.name} /></span>
                              <span className="evidence-note"><LinkifiedText text={node.note} /></span>
                            </span>
                          </button>
                        )) : <p>No source documents or research are attached yet.</p>}
                        {dossierPath ? (
                          <button className="matter-artifact-link" onClick={() => openDocument(dossierPath)} type="button">
                            <span>Editable dossier</span><span>Open the full matter summary</span>
                          </button>
                        ) : null}
                        {researchPath ? <button className="matter-artifact-link" onClick={() => openDocument(researchPath)} type="button"><span>{researchTitle}</span><span>Open the research packet</span></button> : null}
                      </div>
                    </section>

                    <section>
                      <h2>Recent activity</h2>
                      {detail.orientation.recent_changes.length ? (
                        <ul>{detail.orientation.recent_changes.map((change, index) => <li key={index}><LinkifiedText text={change} /></li>)}</ul>
                      ) : <p>Nothing has happened on this matter yet.</p>}
                    </section>
                    {reviewPackets.length ? <section><h2>Decision maintenance</h2>{reviewPackets.map((packet) => <ReviewPacketPanel key={packet.packet_id} packet={packet} matterId={detail.matter_id} mitigations={mitigations} onChanged={loadAwareness} />)}</section> : mitigations.length ? <section><h2>Mitigations</h2><ul>{mitigations.map((item) => <li key={item.mitigation_id}>{item.title} — {item.status}</li>)}</ul></section> : null}
                  </div>
                </details>
              </div>
            </div>
            </div>

            <div className={`middle-section ${middleSection === "chat" ? "active" : "collapsed"}`}>
              <button
                aria-controls="matter-chat-panel"
                aria-expanded={middleSection === "chat"}
                aria-label="Show matter Chat"
                className="middle-section-toggle"
                id="matter-chat-toggle"
                onClick={() => setMiddleSection("chat")}
                type="button"
              >
                <span>Chat</span>
                <span aria-hidden="true">{middleSection === "chat" ? "−" : "+"}</span>
              </button>
              <div
                aria-labelledby="matter-chat-toggle"
                className="middle-section-panel"
                hidden={middleSection !== "chat"}
                id="matter-chat-panel"
                role="region"
              >
                <ChatPanel
                  activeFile={activePath}
                  activeAgentId={detail.active_agent_id}
                  currentWorkProductDraftPath={draftPath}
                  decisionOptions={detail.orientation.options}
                  initialConversationId={detail.intake_conversation_id}
                  initialRunId={detail.intake_run_id}
                  intakeActive={detail.intake_state === "active"}
                  intakeAnswers={detail.intake_answers}
                  matterId={detail.matter_id}
                  matterTitle={detail.title}
                  onRefresh={refreshAfterChatRun}
                  onOpenDocument={openDocument}
                  conversationSeed={conversationSeed}
                  onConversationChange={(conversationId) => {
                    if (!conversationId) {
                      setTreeActivePath(null);
                      return;
                    }
                    const path = findConversationPath(detail.tree, conversationId);
                    if (path) setTreeActivePath(path);
                  }}
                  seed={chatSeed}
                  reviewAuthor={reviewAuthor.name}
                  lawyerAuthor={reviewSettings.lawyer}
                  onReviewAuthorChange={reviewAuthor.setName}
                />
              </div>
            </div>
          </div>
        </div>

        {documentVisible ? (
          <>
            <div
              aria-label="Resize matter overview and document"
              aria-orientation="vertical"
              className={`pane-resizer ${collapsedPanes.overview || collapsedPanes.document ? "hidden" : ""}`}
              onKeyDown={(event) => resizeWithKeyboard(event, "overview", "document")}
              onLostPointerCapture={() => { dragRef.current = null; }}
              onPointerCancel={() => { dragRef.current = null; }}
              onPointerDown={(event) => startResize(event, "overview", "document")}
              onPointerMove={continueResize}
              onPointerUp={() => { dragRef.current = null; }}
              role="separator"
              tabIndex={collapsedPanes.overview || collapsedPanes.document ? -1 : 0}
            />

            <div className="document-pane-shell" ref={documentPaneRef}>
              <button
                aria-expanded={!collapsedPanes.document}
                className="pane-rail"
                hidden={!collapsedPanes.document}
                onClick={() => togglePane("document")}
                title="Expand document"
                type="button"
              >
                <span>›</span><span>Document</span>
              </button>
              <div className="document-pane-content" hidden={collapsedPanes.document}>
                {recommendationSelected ? recommendationState ? <RecommendationPanel
                  disabled={busy}
                  lawyerActor={reviewSettings.lawyer}
                  matterId={detail.matter_id}
                  onChanged={recommendationChanged}
                  recommendation={recommendationState}
                /> : <div className="loading">Loading working recommendation…</div> : <DocumentPanel
                  activePath={activePath}
                  activeReviewAuthor={reviewAuthor.name}
                  lawyerAuthor={reviewSettings.lawyer}
                  onReviewAuthorChange={reviewAuthor.setName}
                  onAskAgent={() => openChatWithSeed(
                    `Propose replacement language for ${activePath?.split("/").at(-1) ?? "this document"}. Save the revision to the active file so I can accept or reject each redline.`,
                  )}
                  onClose={() => {
                    setActivePath(null);
                    setTreeActivePath(null);
                  }}
                  onCollapse={() => togglePane("document")}
                  onUpload={upload}
                />}
              </div>
            </div>
          </>
        ) : null}
      </div>

      {modalOpen ? (
        <RecordDecisionModal
          basis={evidence.map((node) => node.path)}
          basisLabels={Object.fromEntries(evidence.map((node) => [node.path, node.name]))}
          detail={detail}
          lawyerAuthor={reviewSettings.lawyer}
          onClose={() => setModalOpen(false)}
          onRecorded={reload}
          suggestion={proposedPath}
        />
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
