"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import ChatPanel from "@/components/ChatPanel";
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
  ScenarioLaunchIntent,
} from "@/lib/decisionMapTypes";
import type { MatterDetail } from "@/lib/types";
import type {
  ConversationTarget,
  ClaimEvidence,
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

const selectionKey = (matterId: string) =>
  `themis:decision-map:${matterId}:selection`;

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
  const issueBackHref = matterReturnHref(requestedIssue);
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

  const load = useCallback(async () => {
    const [matter, savedWorkspace, map, savedScenarios, reuse, conversations] = await Promise.all([
      getMatter(matterId),
      getWorkspace(matterId),
      getDecisionMap(matterId),
      workspaceCommand<Scenario[]>(matterId, "/scenarios"),
      workspaceCommand<{
        records: { facts: Array<{ fact_id: string; text: string; status?: string }> };
      }>(matterId, "/reuse"),
      getConversations(matterId),
    ]);
    setDetail(matter);
    setInitialConversationId(
      preferredConversationId(
        conversations.conversations.map((item) => item.conversation_id),
        requestedConversation,
        matter.intake_conversation_id,
      ),
    );
    setWorkspace(savedWorkspace);
    setSnapshot(map);
    setScenarios(savedScenarios);
    setFacts(
      reuse.records.facts
        .filter((fact) => fact.status !== "superseded")
        .map((fact) => ({
          fact_id: fact.fact_id,
          text: fact.text,
          state: fact.status,
        })),
    );
    const savedSelection = window.sessionStorage.getItem(
      selectionKey(matterId),
    );
    const initial = requestedIssue ? `issue:${requestedIssue}` : savedSelection;
    setSelectedNodeId(
      initial && map.nodes.some((node) => node.node_id === initial)
        ? initial
        : (map.nodes[0]?.node_id ?? null),
    );
  }, [matterId, requestedConversation, requestedIssue]);

  useEffect(() => {
    void load().catch((cause) =>
      setError(
        cause instanceof Error
          ? cause.message
          : "The decision map could not load.",
      ),
    );
  }, [load]);
  useEffect(() => {
    if (selectedNodeId)
      window.sessionStorage.setItem(selectionKey(matterId), selectedNodeId);
  }, [matterId, selectedNodeId]);

  const contextKey = identity
    ? continuityKey(
        identity.roster.vault_key,
        identity.actor.person_id,
        matterId,
        "panels",
      )
    : `decision-map:${matterId}`;
  const selectedNode =
    snapshot?.nodes.find((node) => node.node_id === selectedNodeId) ?? null;
  const selectedIssue =
    workspace?.issues?.find(
      (issue) =>
        issue.issue_id ===
        (selectedNode?.record_type === "issue"
          ? selectedNode.record_id
          : selectedNode?.issue_ids?.[0]),
    ) ?? null;
  const claims = (workspace?.claims ?? []).filter(
    (claim) =>
      selectedNode?.claim_ids?.includes(claim.claim_id) &&
      (!selectedIssue?.claim_output_revisions?.[claim.claim_id] ||
        selectedIssue.claim_output_revisions[claim.claim_id] ===
          claim.output_revision),
  );
  const layout = useMemo(
    () => (snapshot ? layoutDecisionMap(snapshot) : null),
    [snapshot],
  );

  async function openReference(target: DocumentReferenceTarget) {
    invalidateReferenceResult(referenceGeneration);
    const knownDocument = documentForReferenceTarget(
      workspace?.documents ?? [],
      target,
    );
    if (knownDocument && referenceDestination(knownDocument) === "editor") {
      setReferenceTarget(null);
      setReferenceDocument(null);
      window.location.href = `/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(knownDocument.path)}`;
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
        window.location.href = `/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(result.document.path)}`;
        return;
      }
      setReferenceDocument(result.document ?? null);
      setReferenceError(result.message ?? "");
    } catch (cause) {
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
    let run = await analyzeWorkspaceScenario(matterId, scenarioId, command);
    while (["queued", "running"].includes(run.state)) {
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      run = await getChatRun(matterId, run.run_id);
    }
    const saved = await workspaceCommand<Scenario[]>(matterId, "/scenarios");
    setScenarios(saved);
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
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
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
          <span className="state-label state-agent">
            Agent analysis stays proposed
          </span>
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
        <DecisionMap
          snapshot={snapshot}
          layout={layout}
          selectedNodeId={selectedNodeId}
          scope={scope}
          onSelectNode={setSelectedNodeId}
          onScopeChange={setScope}
          onFit={() => undefined}
          onOpenDocument={(target) => void openReference(target)}
          onDiscuss={(target) => {
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
                onClose={() => { setLaunchIntent(null); requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" })); }}
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
                  setScenarios((current) => [
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
                  setScenarios((current) => [
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
          <details className={styles.conversationDisclosure} open>
            <summary>Conversation and composer</summary>
            <div className={styles.conversationBody}>
              <ChatPanel
            contextKey={contextKey}
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
      </main>
    </AppShell>
  );
}
