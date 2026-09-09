"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import ChatPanel from "@/components/ChatPanel";
import RecordDecisionModal from "@/components/RecordDecisionModal";
import DecisionMap from "@/components/workspace/DecisionMap";
import ScenarioPanel from "@/components/workspace/ScenarioPanel";
import MatterIcon from "@/components/workspace/MatterIcon";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import EvidenceDrawer from "@/components/workspace/EvidenceDrawer";
import ReferencePreview from "@/components/workspace/ReferencePreview";
import styles from "@/components/workspace/MatterMap.module.css";
import { useContinuityIdentity, continuityKey } from "@/lib/continuityApi";
import {
  getFile,
  getConversations,
  getMatter,
  getChatRun,
  rawFileUrl,
  saveWorkProductDraft,
} from "@/lib/api";
import {
  runWorkspaceAction,
  adoptWorkspaceScenario,
  analyzeWorkspaceScenario,
  getDecisionMap,
  getWorkspace,
  documentForReferenceTarget,
  invalidateReferenceResult,
  latestReferenceResult,
  preferredConversationId,
  referenceDestination,
  resolveWorkspaceDocument,
  saveWorkspaceScenario,
  workspaceCommand,
} from "@/lib/workspaceApi";
import { layoutDecisionMap } from "@/lib/decisionMapLayout";
import type {
  DecisionMapSnapshot,
  DecisionPathPrefill,
  ScenarioLaunchIntent,
} from "@/lib/decisionMapTypes";
import type { ChatRun, MatterDetail } from "@/lib/types";
import type {
  ConversationTarget,
  ClaimEvidence,
  WorkspaceClaim,
  ContextSelection,
  DocumentIdentity,
  DocumentReferenceTarget,
  ReferenceOrigin,
  Scenario,
  ScenarioAdoptCommand,
  ScenarioAnalyzeCommand,
  WorkspaceActionResult,
  WorkspaceSnapshot,
} from "@/lib/workspaceTypes";



export default function MatterDecisionMapPage() {
  const { matterId } = useParams<{ matterId: string }>();
  const query = useSearchParams();
  const { identity } = useContinuityIdentity();
  const requestedIssue = query.get("issue");
  const requestedConversation = query.get("conversation");
  const backHref =
    query.get("back") || `/matters/${encodeURIComponent(matterId)}`;
  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
  const [snapshot, setSnapshot] = useState<DecisionMapSnapshot | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [facts, setFacts] = useState<Array<{ fact_id: string; text: string; state?: string }>>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    null,
  );
  const [focusedIssueId, setFocusedIssueId] = useState<string | null>(null);
  const [pathPrefill, setPathPrefill] = useState<DecisionPathPrefill | null>(null);
  const [analyzingIssueId, setAnalyzingIssueId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{issueId: string; message: string; saved: boolean} | null>(null);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [analysisNotice, setAnalysisNotice] = useState("");
  const [externalRun, setExternalRun] = useState<ChatRun | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [scope, setScope] = useState<"neighborhood" | "whole_matter">(
    "neighborhood",
  );
  const [conversationTarget, setConversationTarget] =
    useState<ConversationTarget | null>(null);
  const [initialConversationId, setInitialConversationId] = useState<
    string | null
  >(null);
  const matterReturnHref = (issueId?: string | null) => {
    let href = backHref;
    for (const [key, value] of [
      ["issue", issueId],
      ["conversation", initialConversationId],
    ] as const) {
      if (!value) continue;
      href += `${href.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
    }
    return href;
  };
  const issueBackHref = matterReturnHref(focusedIssueId ?? requestedIssue);
  const previousRequestedIssue = useRef(requestedIssue);
  useEffect(() => {
    if (previousRequestedIssue.current !== requestedIssue && requestedIssue) { setFocusedIssueId(requestedIssue); setSelectedNodeId(`issue:${requestedIssue}`); setScope("neighborhood"); }
    previousRequestedIssue.current = requestedIssue;
  }, [requestedIssue]);
  const [referenceTarget, setReferenceTarget] =
    useState<DocumentReferenceTarget | null>(null);
  const [referenceDocument, setReferenceDocument] =
    useState<DocumentIdentity | null>(null);
  const [referenceError, setReferenceError] = useState("");
  const [activeEvidence, setActiveEvidence] = useState<ClaimEvidence | null>(null);
  const [launchIntent, setLaunchIntent] = useState<ScenarioLaunchIntent | null>(
    null,
  );
  const [chatSeed, setChatSeed] = useState({ text: "", revision: 0 });
  const [scenarioLaunchKey, setScenarioLaunchKey] = useState(0);
  const [error, setError] = useState("");
  const referenceGeneration = useRef(0);

  const contextKey = identity
    ? continuityKey(identity.roster.vault_key, identity.actor.person_id, matterId, "panels")
    : `decision-map:${matterId}`;
  const selectionKey = `${contextKey}:decision-map-selection`;
  const activeContext = useRef(contextKey);
  activeContext.current = contextKey;
  const loadedContext = useRef<string | null>(null);
  const loadGeneration = useRef(0);
  const selection = useRef({ focusedIssueId, selectedNodeId });
  selection.current = { focusedIssueId, selectedNodeId };
  const conversation = useRef(initialConversationId);
  conversation.current = initialConversationId;
  const scenarioBasis = useRef("");
  const scenarioOrigin = useRef({ selectedNodeId: null as string | null, scroll: 0 });

  const load = useCallback(async () => {
    if (!identity || activeContext.current !== contextKey) return;
    const generation = ++loadGeneration.current;
    const current = () => generation === loadGeneration.current && activeContext.current === contextKey;
    const optional = Promise.allSettled([
      workspaceCommand<Scenario[]>(matterId, "/scenarios"),
      workspaceCommand<{ records: { facts: Array<{ fact_id: string; text: string; status?: string }> } }>(matterId, "/reuse"),
      getConversations(matterId),
    ]);
    const [matter, savedWorkspace, map] = await Promise.all([getMatter(matterId), getWorkspace(matterId), getDecisionMap(matterId)]);
    if (!current()) return;
    const firstLoad = loadedContext.current !== contextKey;
    let saved: { focusedIssueId?: string | null; selectedNodeId?: string | null } = {};
    if (firstLoad) {
      try { saved = JSON.parse(window.sessionStorage.getItem(selectionKey) || "{}"); } catch { /* Invalid local state is disposable. */ }
    }
    const requestedFocus = firstLoad ? requestedIssue ?? saved.focusedIssueId : selection.current.focusedIssueId;
    const focus = map.nodes.some((node) => node.record_type === "issue" && node.record_id === requestedFocus)
      ? requestedFocus ?? null : map.nodes.find((node) => node.record_type === "issue")?.record_id ?? null;
    const requestedSelection = firstLoad
      ? requestedIssue && requestedIssue !== saved.focusedIssueId ? `issue:${requestedIssue}` : saved.selectedNodeId === undefined ? focus ? `issue:${focus}` : null : saved.selectedNodeId
      : selection.current.selectedNodeId;
    const selected = requestedSelection === null ? null : map.nodes.some((node) => node.node_id === requestedSelection)
      ? requestedSelection ?? null : focus ? `issue:${focus}` : null;
    loadedContext.current = contextKey;
    setDetail(matter); setWorkspace(savedWorkspace); setSnapshot(map);
    setFocusedIssueId(focus); setSelectedNodeId(selected); setError("");
    const extras = await optional;
    if (!current()) return;
    if (extras[0].status === "fulfilled") setScenarios(extras[0].value);
    if (extras[1].status === "fulfilled") setFacts(extras[1].value.records.facts.filter((fact) => fact.status !== "superseded").map((fact) => ({ fact_id: fact.fact_id, text: fact.text, state: fact.status })));
    if (extras[2].status === "fulfilled" && (firstLoad || !conversation.current)) {
      setInitialConversationId(preferredConversationId(extras[2].value.conversations.map((item) => item.conversation_id), requestedConversation, matter.intake_conversation_id));
    }
    if (extras.some((result) => result.status === "rejected")) setError("The saved map is available. Some scenario, fact, or conversation details could not load. Refresh to try again.");
  }, [matterId, contextKey, identity, requestedConversation, requestedIssue, selectionKey]);

  useEffect(() => {
    loadedContext.current = null;
    setDetail(null); setWorkspace(null); setSnapshot(null); setScenarios([]); setFacts([]);
    setFocusedIssueId(null); setSelectedNodeId(null); setInitialConversationId(null);
    setConversationTarget(null); setPathPrefill(null); setLaunchIntent(null); setExternalRun(null);
    setReferenceTarget(null); setReferenceDocument(null); invalidateReferenceResult(referenceGeneration);
    setAnalysisBusy(false); setAnalyzingIssueId(null); setAnalysisResult(null); setAnalysisNotice("");
    return () => { loadGeneration.current += 1; };
  }, [contextKey]);
  useEffect(() => {
    const key = contextKey;
    void load().catch((cause) => { if (activeContext.current === key) setError(cause instanceof Error ? cause.message : "The decision map could not load."); });
  }, [load, contextKey]);
  useEffect(() => {
    if (loadedContext.current === contextKey) window.sessionStorage.setItem(selectionKey, JSON.stringify({ focusedIssueId, selectedNodeId }));
  }, [contextKey, selectionKey, focusedIssueId, selectedNodeId]);

  const attemptedAnalyses = useRef(new Set<string>());
  useEffect(() => {
    if (!snapshot || !focusedIssueId || analysisBusy) return;
    const status = snapshot.issue_analyses?.[focusedIssueId];
    const attemptKey = `${contextKey}:${focusedIssueId}`;
    if ((!status || status.state === "not_mapped") && !attemptedAnalyses.current.has(attemptKey)) {
      attemptedAnalyses.current.add(attemptKey);
      void analyzePaths(focusedIssueId);
    }
  }, [snapshot, focusedIssueId, analysisBusy, contextKey]);

  async function analyzePaths(issueId: string) {
    if (analysisBusy) return;
    const key = contextKey;
    setAnalyzingIssueId(issueId); setAnalysisResult(null); setAnalysisBusy(true); setAnalysisNotice("Analyzing paths…");
    try {
      const started = await runWorkspaceAction(matterId, {
        action: "explain", target: { matter_id: matterId, issue_id: issueId }, conversation_id: initialConversationId,
        source_action_key: `analyze-paths:${crypto.randomUUID()}`,
        instruction: "Assess connections to all other saved issues in this matter as well as the paths. Include connections in the decision-paths issue analysis: an array of target_issue_id (exact saved issue ID), relationship (depends_on, compounds, may_resolve, shared_condition), and reason. Describe any implementation or conditions needed in the reason; a potential connection does not close an issue. Return an empty connections array only after assessing the other issues and finding none. Other saved issues: " + JSON.stringify(workspace?.issues ?? []) + ". Analyze the possible paths for this actual saved issue. Name each choice as an action the business can take. For each choice, explain the facts and conditions it depends on, the next consequence, material negative outcomes or risks, trade-offs, and remaining work. Distinguish known facts from unknown facts and possible risks from expected consequences. Explain the applicable test, actor, exceptions, conditional routes and business alternatives. Return useful prose and the optional decision-paths structure. In that structure, include supported effects on other options: effects entries with target_option_id, trigger (agreement, implementation_complete, or condition), and reason; condition triggers also need condition_id and condition_state. In particular, distinguish agreeing to a redesign from implementing it: an existing route remains possible until the replacement is implemented. Do not invent exclusion for options that can coexist. Do not call tools to save recommendations or work products; the inquiry publisher saves this answer automatically.",
      });
      if (activeContext.current !== key) return;
      let run = await getChatRun(matterId, started.run_id);
      if (activeContext.current !== key) return;
      setExternalRun(run);
      while (["queued", "running"].includes(run.state)) {
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        if (activeContext.current !== key) return;
        run = await getChatRun(matterId, run.run_id);
      }
      if (activeContext.current !== key) return;
      setExternalRun(run); await load();
      const refreshed = await getDecisionMap(matterId);
      if (activeContext.current !== key) return;
      const updated = refreshed.issue_analyses?.[issueId]?.analysis;
      const changed = !!updated && updated.analysis_revision !== snapshot?.issue_analyses?.[issueId]?.analysis?.analysis_revision;
      setAnalysisResult({issueId, saved: changed, message: changed ? `Analysis updated. ${updated.options.length} paths; ${Array.isArray(updated.connections) ? `${updated.connections.length} connections found` : 'connections still need assessment'}.` : 'No new map was saved. The previous analysis is still shown.'});
      if (activeContext.current === key) setAnalysisNotice(run.state === "completed" ? "Analysis finished. The saved map is shown. Any incomplete structure remains labelled." : "The inquiry stopped. Available saved analysis remains shown.");
    } catch (cause) {
      if (activeContext.current === key) setAnalysisResult({issueId, saved: false, message: "Update could not be confirmed. The saved map is still shown. Reload to check before retrying."});
      if (activeContext.current === key) setAnalysisNotice(cause instanceof Error ? cause.message : "Analysis could not finish. Saved work remains available.");
    } finally { if (activeContext.current === key) { setAnalysisBusy(false); setAnalyzingIssueId(null); } }
  }
  const selectedNode =
    snapshot?.nodes.find((node) => node.node_id === selectedNodeId) ?? null;
  const selectedIssue = workspace?.issues?.find((issue) => issue.issue_id === focusedIssueId) ?? null;
  const exactClaims = selectedNode?.data?.claim_support;
  const analysis = focusedIssueId ? snapshot?.issue_analyses?.[focusedIssueId]?.analysis : null;
  const claims = Array.isArray(exactClaims) ? exactClaims as WorkspaceClaim[] : (workspace?.claims ?? []).filter((claim) =>
    selectedNode?.claim_ids?.includes(claim.claim_id) &&
    (analysis?.source_revisions[`claim:${claim.claim_id}`] ?? selectedIssue?.claim_output_revisions?.[claim.claim_id]) === claim.output_revision);
  const layout = useMemo(
    () => (snapshot ? layoutDecisionMap(snapshot) : null),
    [snapshot],
  );

  async function openReference(target: DocumentReferenceTarget) {
    const key = contextKey;
    target = { ...target, origin: { ...target.origin, surface: target.origin?.surface ?? "decision_map", record_id: target.origin?.record_id ?? selectedNodeId, scroll_offset: target.origin?.scroll_offset ?? window.scrollY } };
    invalidateReferenceResult(referenceGeneration);
    const knownDocument = documentForReferenceTarget(
      workspace?.documents ?? [],
      target,
    );
    if (knownDocument && referenceDestination(knownDocument) === "editor") {
      setReferenceTarget(null);
      setReferenceDocument(null);
      window.location.href = `${matterReturnHref(focusedIssueId)}&file=${encodeURIComponent(knownDocument.path)}`;
      return;
    }
    setReferenceTarget(target);
    setReferenceDocument(null);
    setReferenceError("");
    try {
      const result = await latestReferenceResult(
        referenceGeneration,
        () => resolveWorkspaceDocument(matterId, target),
      );
      if (!result) return;
      if (result.document && referenceDestination(result.document) === "editor") {
        setReferenceTarget(null);
        setReferenceDocument(null);
        window.location.href = `${matterReturnHref(focusedIssueId)}&file=${encodeURIComponent(result.document.path)}`;
        return;
      }
      setReferenceDocument(result.document ?? null);
      setReferenceError(result.message ?? "");
    } catch (cause) {
      if (activeContext.current !== key) return;
      setReferenceDocument(null);
      setReferenceError(
        cause instanceof Error
          ? cause.message
          : "The reference is unavailable.",
      );
    }
  }

  async function useInRequest(document: DocumentIdentity) {
    const current = await workspaceCommand<{
      selections: ContextSelection[];
      revision: string;
    }>(matterId, "/context");
    await workspaceCommand(matterId, "/context", "PUT", {
      selections: [
        ...current.selections.filter(
          (item) => item.reference_id !== document.document_id,
        ),
        {
          reference_id: document.document_id,
          path: document.path,
          role: "source_file",
          selected: true,
          revision: document.revision,
        },
      ],
      expected_revision: current.revision,
    });
    setError("");
  }

  async function createWorkingCopy(document: DocumentIdentity) {
    const source = await getFile(document.path);
    const saved = await saveWorkProductDraft(
      matterId,
      `${document.title} working copy`,
      source.content,
      `map-working-copy:${document.document_id}:${document.revision}:${crypto.randomUUID()}`,
    );
    window.location.href = `/matters/${encodeURIComponent(matterId)}?view=draft&file=${encodeURIComponent(saved.vault_path)}`;
  }

  async function analyzeScenario(
    scenarioId: string,
    command: ScenarioAnalyzeCommand,
  ): Promise<WorkspaceActionResult> {
    const key = contextKey;
    let run = await analyzeWorkspaceScenario(matterId, scenarioId, { ...command, instruction: `${command.instruction || ""}${scenarioBasis.current ? `\n\nFrozen decision path context (hypothetical only):\n${scenarioBasis.current}` : ""}` });
    while (["queued", "running"].includes(run.state)) {
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      run = await getChatRun(matterId, run.run_id);
    }
    const saved = await workspaceCommand<Scenario[]>(matterId, "/scenarios");
    if (activeContext.current === key) setScenarios(saved);
    return {
      run_id: run.run_id,
      state: run.response?.operation_results.some(
        (item) =>
          item.operation === "save_scenario_analysis" &&
          item.status === "changed",
      )
        ? "saved"
        : "not_saved",
    };
  }

  function returnFromReference(origin: ReferenceOrigin) {
    invalidateReferenceResult(referenceGeneration);
    setReferenceTarget(null);
    setReferenceDocument(null);
    setReferenceError("");
    if (
      origin.record_id &&
      snapshot?.nodes.some((node) => node.node_id === origin.record_id)
    )
      setSelectedNodeId(origin.record_id);
    requestAnimationFrame(() => {
      if (origin.scroll_offset != null)
        window.scrollTo({ top: origin.scroll_offset });
      if (origin.focus_id) document.getElementById(origin.focus_id)?.focus();
    });
  }

  function tryAssumption(intent: ScenarioLaunchIntent) {
    scenarioOrigin.current = { selectedNodeId, scroll: window.scrollY };
    scenarioBasis.current = JSON.stringify({ target: intent, selected_record: selectedNode, analysis: analysis && analysis.analysis_revision === intent.analysis_revision ? analysis : null });
    const node = snapshot?.nodes.find(
      (item) =>
        item.record_id === intent.question_id ||
        item.record_id === intent.fact_id ||
        item.record_id === intent.issue_id,
    );
    const adjacentFactIds = snapshot
      ? snapshot.edges
          .filter(
            (edge) =>
              edge.from_node_id === node?.node_id ||
              edge.to_node_id === node?.node_id,
          )
          .map((edge) =>
            edge.from_node_id === node?.node_id
              ? edge.to_node_id
              : edge.from_node_id,
          )
          .map((nodeId) => snapshot.nodes.find((item) => item.node_id === nodeId))
          .filter((item) => item?.record_type === "fact")
          .map((item) => item!.record_id)
      : [];
    const linkedFactId =
      intent.fact_id ||
      (adjacentFactIds.length === 1 ? adjacentFactIds[0] : null);
    setSelectedScenarioId(null);
    setScenarioLaunchKey((current) => current + 1);
    setLaunchIntent({ ...intent, fact_id: linkedFactId });
    const linkedIssue = intent.issue_id || node?.issue_ids?.[0] || null;
    setConversationTarget({
      matter_id: matterId,
      issue_id: linkedIssue,
      business_question_revision: workspace?.question.revision,
    });
    if (intent.question_id)
      setChatSeed((current) => ({
        text: `Explore a different assumption for this saved question (${intent.question_id}): ${node?.label ?? "selected question"}. ${linkedFactId ? `Use its linked reported fact ${linkedFactId}.` : "No single linked reported fact is known; keep that uncertainty visible."} Keep its linked issue context.`,
        revision: current.revision + 1,
      }));
    requestAnimationFrame(() => document.querySelector('[aria-label="Try a different assumption"]')?.scrollIntoView({ block: "start" }));
  }

  if (!detail || !workspace || !snapshot || !layout)
    return (
      <AppShell>
        <main className="page">
          <p role="status">{error || "Loading the saved decision map…"}</p>
        </main>
      </AppShell>
    );

  return (
    <AppShell>
      <main className={`page ${styles.page}`}>
        <header className={styles.routeHeader}>
          <div className={styles.routeContext}><Link href="/matters">Matters</Link><span>{detail.title}</span></div>
          <Link className={styles.routeBack} href={issueBackHref}>Back to matter</Link>
        </header>
        <header className={styles.pageHeader} hidden={Boolean(launchIntent)}>
          <div>
            <span className={styles.pageKicker}>Matter</span>
            <h1 className={styles.pageTitle}>{detail.title}</h1>
            <details className={styles.questionDisclosure}>
              <summary>Read full business question</summary>
              <p className={styles.questionText}>{workspace.question.text}</p>
            </details>
          </div>
          <nav aria-label="Matter views" className={styles.viewNav}><Link href={issueBackHref}><MatterIcon name="book" size={21} />Understand</Link><Link href={`${issueBackHref}${issueBackHref.includes("?") ? "&" : "?"}view=discuss`}><MatterIcon name="chat" size={21} />Discuss</Link><Link href={`${issueBackHref}${issueBackHref.includes("?") ? "&" : "?"}view=draft`}><MatterIcon name="file" size={21} />Draft</Link><span aria-current="page"><MatterIcon name="map" size={21} />Decision map</span></nav>
        </header>
        {error ? (
          <p className="warning-callout" role="status">
            {error}
          </p>
        ) : null}
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
              void useInRequest(document).catch((cause) =>
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "The source could not be added.",
                ),
              )
            }
            onCreateWorkingCopy={(document) =>
              void createWorkingCopy(document).catch((cause) =>
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "The working copy could not be created.",
                ),
              )
            }
          />
        ) : null}
        <EvidenceDrawer
          evidence={activeEvidence}
          open={Boolean(activeEvidence)}
          onClose={() => setActiveEvidence(null)}
          onOpenArtifact={(path) => {
            const document = workspace.documents?.find(
              (item) => item.path === path,
            );
            if (document) {
              setActiveEvidence(null);
              void openReference({
                document_id: document.document_id,
                path: document.path,
                revision: document.revision,
                locator: activeEvidence?.locator,
                available_excerpt: activeEvidence?.available_excerpt,
                exact_passage_available: Boolean(
                  activeEvidence?.available_excerpt || activeEvidence?.locator,
                ),
                origin: {
                  surface: "decision_map",
                  record_id: selectedNodeId,
                  scroll_offset: window.scrollY,
                },
              });
            } else if (/^https?:\/\//i.test(path)) {
              window.open(path, "_blank", "noopener,noreferrer");
            }
          }}
        />
        {analysisNotice ? <p role="status" className="state-label state-agent">{analysisNotice}</p> : null}
        <DecisionMap
          onRefresh={load}
          snapshot={snapshot}
          layout={layout}
          focusedIssueId={focusedIssueId}
          selectedNodeId={selectedNodeId}
          analyzingIssueId={analyzingIssueId}
          analysisResult={analysisResult}
          busy={analysisBusy}
          onFocusIssue={(issueId) => { setFocusedIssueId(issueId); setSelectedNodeId(`issue:${issueId}`); }}
          onAnalyzePaths={(issueId) => void analyzePaths(issueId)}
          onRecordPath={(prefill) => {
            const query = new URLSearchParams({ issue: prefill.map_basis.issue_id, record_option: prefill.map_basis.selected_option_id });
            const conversation = new URLSearchParams(window.location.search).get("conversation");
            if (conversation) query.set("conversation", conversation);
            window.location.href = `/matters/${encodeURIComponent(snapshot.matter_id)}?${query}`;
          }}
          scope={scope}
          onSelectNode={(nodeId) => {
            const node = snapshot.nodes.find((item) => item.node_id === nodeId);
            if (node?.record_type === "issue") { setFocusedIssueId(node.record_id); setScope("neighborhood"); }
            setSelectedNodeId(nodeId);
          }}
          onScopeChange={setScope}
          onFit={() => undefined}
          onOpenDocument={(target) => void openReference(target)}
          onDiscuss={(target, prompt) => {
            if (prompt) setChatSeed(current => ({ text: prompt, revision: current.revision + 1 }));
            setConversationTarget({
              ...target,
              business_question_revision: workspace.question.revision,
            });
            requestAnimationFrame(() => {
              const section = document.getElementById("decision-map-discussion");
              section?.querySelector("details")?.setAttribute("open", "");
              section?.scrollIntoView({ behavior: "smooth", block: "start" });
              section?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
            });
          }}
          onTryDifferentAssumption={tryAssumption}
          onBackToIssue={(issueId) => {
            window.location.href = matterReturnHref(issueId);
          }}
          selectedNodeDetails={
            claims.length ? (
              <div className={styles.claims}>
                {claims.map((claim) => (
                  <article key={`${claim.claim_id}:${claim.output_revision}`}>
                    <ClaimMarkdown
                      text={claim.text}
                      claims={[claim]}
                      documents={workspace.documents ?? []}
                      surface="decision_map"
                      recordId={selectedNodeId}
                      onOpenEvidence={setActiveEvidence}
                      onOpenDocument={(target) => void openReference(target)}
                    />
                    {claim.applicability ? (
                      <p className="record-meta">
                        Applies to {claim.applicability.regulated_actor || "the saved actor"}
                        {claim.applicability.jurisdiction
                          ? ` in ${claim.applicability.jurisdiction}`
                          : ""}
                        {claim.applicability.explanation
                          ? `. ${claim.applicability.explanation}`
                          : ""}
                      </p>
                    ) : null}
                    <div className="inline-actions">
                      {claim.evidence.map((evidence) => (
                        <button
                          className="secondary"
                          key={`${evidence.source_id}:${evidence.locator ?? "source"}`}
                          onClick={() => setActiveEvidence(evidence)}
                          type="button"
                        >
                          Review {evidence.source_label || evidence.source_id}
                          {evidence.locator ? ` · ${evidence.locator}` : ""}
                        </button>
                      ))}
                      {!claim.evidence.length ? (
                        <span className="state-label state-attention">No saved support</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : undefined
          }
          scenarioPanel={
            launchIntent ? (
              <ScenarioPanel
                claims={workspace?.claims ?? []}
                key={scenarioLaunchKey}
                matterId={matterId}
                scenarios={scenarios}
                selectedScenarioId={selectedScenarioId}
                currentRevisions={workspace.source_revisions ?? {}}
                facts={facts}
                initialIssueId={
                  launchIntent.issue_id || selectedNode?.issue_ids?.[0]
                }
                initialFactId={launchIntent.fact_id}
                onClose={() => { setLaunchIntent(null); setSelectedNodeId(scenarioOrigin.current.selectedNodeId); requestAnimationFrame(() => window.scrollTo({ top: scenarioOrigin.current.scroll, behavior: "auto" })); }}
                onSelect={setSelectedScenarioId}
                onCreate={async (command) => {
                  const saved = await workspaceCommand<Scenario>(
                    matterId,
                    "/scenarios",
                    "POST",
                    {
                      scenario: command,
                      source_action_key: command.source_action_key,
                    },
                  );
                  if (activeContext.current === contextKey) setScenarios((current) => [
                    ...current.filter(
                      (item) => item.scenario_id !== saved.scenario_id,
                    ),
                    saved,
                  ]);
                  return saved;
                }}
                onAnalyze={analyzeScenario}
                onAdopt={async (
                  scenarioId: string,
                  command: ScenarioAdoptCommand,
                ) => {
                  const receipt = await adoptWorkspaceScenario(
                    matterId,
                    scenarioId,
                    command,
                  );
                  await load();
                  return receipt;
                }}
                onSaveScenario={async (scenario, title, revision, key) => {
                  const saved = await saveWorkspaceScenario(
                    matterId,
                    scenario,
                    title,
                    revision,
                    key,
                  );
                  if (activeContext.current === contextKey) setScenarios((current) => [
                    ...current.filter(
                      (item) => item.scenario_id !== saved.scenario_id,
                    ),
                    saved,
                  ]);
                  return saved;
                }}
                onOpenClaim={(claimId) =>
                  setSelectedNodeId(
                    snapshot.nodes.find((node) =>
                      node.claim_ids?.includes(claimId),
                    )?.node_id ?? selectedNodeId,
                  )
                }
                onOpenArtifact={(path) => {
                  const document = workspace.documents?.find(
                    (item) => item.path === path,
                  );
                  if (document)
                    void openReference({
                      document_id: document.document_id,
                      path: document.path,
                      revision: document.revision,
                      origin: {
                        surface: "decision_map",
                        record_id: selectedNodeId,
                      },
                    });
                }}
              />
            ) : undefined
          }
        />
        <section className={styles.discussion} id="decision-map-discussion" hidden={Boolean(launchIntent)}>
          <h2 className={styles.discussionHeading}>Discuss the selected path</h2>
          <details className={styles.conversationDisclosure}>
            <summary>Conversation and composer</summary>
            <div className={styles.conversationBody}>
              <ChatPanel
            contextKey={contextKey}
            externalRun={externalRun}
            matterId={matterId}
            matterTitle={detail.title}
            activeFile={null}
            activeAgentId={detail.active_agent_id}
            initialConversationId={initialConversationId}
            onConversationChange={(conversationId) => {
              if (conversationId) setInitialConversationId(conversationId);
            }}
            target={
              conversationTarget ?? {
                matter_id: matterId,
                issue_id: selectedIssue?.issue_id,
                business_question_revision: workspace.question.revision,
              }
            }
            expectedQuestionRevision={workspace.question.revision}
            onTargetChange={setConversationTarget}
            workspaceClaims={workspace.claims ?? []}
            workspaceDocuments={workspace.documents ?? []}
            onOpenReference={(target) => void openReference(target)}
            onOpenEvidence={(evidence) =>
              evidence.path &&
              void openReference({
                document_id: evidence.source_id,
                path: evidence.path,
                revision: evidence.source_version,
                locator: evidence.locator,
                available_excerpt: evidence.available_excerpt,
                exact_passage_available: Boolean(
                  evidence.available_excerpt || evidence.locator,
                ),
                origin: { surface: "conversation", record_id: selectedNodeId },
              })
            }
            onRefresh={load}
            onOpenDocument={(path) => {
              const document = workspace.documents?.find(
                (item) => item.path === path,
              );
              if (document)
                void openReference({
                  document_id: document.document_id,
                  path,
                  revision: document.revision,
                  origin: {
                    surface: "conversation",
                    record_id: selectedNodeId,
                  },
                });
            }}
            seed={chatSeed}
            reviewAuthor="Themis.ai"
            lawyerAuthor={identity?.actor.display_name ?? "Lawyer"}
            onReviewAuthorChange={() => undefined}
              />
            </div>
          </details>
        </section>
        {pathPrefill ? <RecordDecisionModal detail={detail} pathPrefill={pathPrefill} basis={[pathPrefill.analysis.source_path]} suggestion={pathPrefill.option.title} lawyerAuthor={identity?.actor.display_name ?? "Lawyer"} onClose={() => setPathPrefill(null)} onRecorded={load} /> : null}
      </main>
    </AppShell>
  );
}
