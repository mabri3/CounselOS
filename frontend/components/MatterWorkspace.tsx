"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import ChatPanel from "@/components/ChatPanel";
import DocumentPanel from "@/components/DocumentPanel";
import LinkifiedText from "@/components/LinkifiedText";
import MatterTree from "@/components/MatterTree";
import RecordDecisionModal from "@/components/RecordDecisionModal";
import ReviewPacketPanel from "@/components/ReviewPacketPanel";
import { getFile, getSettings, moveMatter, performMatterAction, runResearch, uploadDocument } from "@/lib/api";
import { useReviewAuthor } from "@/lib/reviewAuthor";
import { dueWord, riskLabel, signalFor, stageLabel } from "@/lib/design";
import { controlIdForCurrentWork, currentWorkItemFor, openItemsFor } from "@/lib/matterBrief";
import type { MatterControlId } from "@/lib/matterBrief";
import { matterAction } from "@/lib/matterActions";
import type { MatterActionView } from "@/lib/matterActions";
import type { FileNode, MatterDetail } from "@/lib/types";
import { getMatterMitigations, getReviewPackets } from "@/lib/watchApi";
import type { Mitigation, ReviewPacket } from "@/lib/watchTypes";

type MatterControl = Omit<MatterActionView, "id" | "category"> & {
  id: MatterControlId;
  category: MatterActionView["category"] | "Work item";
};

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
  const defaultPath = `${detail.path}/matter.md`;
  const researchPath = findLatestResearch(detail.tree);
  const initialFallback = focusResearch && researchPath ? researchPath : defaultPath;
  const documentRequested = Boolean(initialPath || (focusResearch && researchPath));
  const [activePath, setActivePath] = useState<string | null>(() => safeMatterPath(initialPath, detail.path, initialFallback));
  const [treeActivePath, setTreeActivePath] = useState<string | null>(() =>
    documentRequested ? safeMatterPath(initialPath, detail.path, initialFallback) : null,
  );
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState({ text: "", revision: 0 });
  const [conversationSeed, setConversationSeed] = useState({ conversationId: "", revision: 0 });
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reviewPackets, setReviewPackets] = useState<ReviewPacket[]>([]);
  const [mitigations, setMitigations] = useState<Mitigation[]>([]);
  const [reviewSettings, setReviewSettings] = useState({ lawyer: "Lawyer", defaultAuthor: "Themis" });
  const reviewAuthor = useReviewAuthor(reviewSettings.defaultAuthor);
  const [collapsedPanes, setCollapsedPanes] = useState({ tree: true, overview: false, document: !documentRequested });
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
    setCollapsedPanes((current) => ({ ...current, document: !documentRequested }));
  }, [detail.path, documentRequested, initialFallback, initialPath]);

  /** The agent's standing recommendation lives in the matter's own Markdown. */
  useEffect(() => {
    let cancelled = false;
    void getFile(`${detail.path}/recommendations.md`)
      .then((document) => { if (!cancelled) setRecommendation(document.content.trim()); })
      .catch(() => { if (!cancelled) setRecommendation(""); });
    return () => { cancelled = true; };
  }, [detail.path]);

  useEffect(() => { void getSettings().then((saved) => { const rows = saved.sections.find((item) => item.id === "document-review")?.rows ?? []; setReviewSettings({ lawyer: rows.find((item) => item.config_key === "document_review.lawyer_name")?.value || "Lawyer", defaultAuthor: rows.find((item) => item.config_key === "document_review.default_author")?.value || "Themis" }); }); }, []);

  const loadAwareness = useCallback(async () => {
    try {
      const [packetData, mitigationData] = await Promise.all([getReviewPackets({ limit: 100 }), getMatterMitigations(detail.matter_id)]);
      setReviewPackets(packetData.items.filter((packet) => packet.affected_matters.includes(detail.matter_id) || packet.affected_decisions.some((id) => detail.decisions.some((decision) => decision.decision_id === id))));
      setMitigations(mitigationData.items);
    } catch { /* Keep the existing matter workspace usable if awareness data is unavailable. */ }
  }, [detail.decisions, detail.matter_id]);
  useEffect(() => { void loadAwareness(); }, [loadAwareness]);

  const evidence = useMemo(() => collectEvidence(detail.tree), [detail.tree]);
  const draftPath = useMemo(() => findFirstFile(detail.tree, "drafts"), [detail.tree]);
  const dossierPath = useMemo(() => findFileByName(detail.tree, "dossier.md"), [detail.tree]);
  const workProductPaths = useMemo(() => collectWorkProduct(detail.tree), [detail.tree]);
  const primaryAction = matterAction(detail, Boolean(draftPath));
  const currentWorkItem = currentWorkItemFor(
    detail.work_items,
    detail.work_state.next_work_item_id,
  );
  const currentControlId = controlIdForCurrentWork(primaryAction.id, currentWorkItem);
  const currentControl: MatterControl = currentControlId === primaryAction.id
    ? primaryAction
    : currentControlId === "run_research"
      ? { id: "run_research", category: "Work action", label: "Run research", detail: "Run the current research work item." }
      : { id: "open_work_item", category: "Work item", label: "Open work item", detail: "Open the saved work item and review its details." };
  const signal = signalFor(detail);
  const due = dueWord(detail);

  const reload = useCallback(async () => { await onReload(); }, [onReload]);

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
      setConversationSeed((current) => ({ conversationId, revision: current.revision + 1 }));
      return;
    }
    setActivePath(path);
  }

  async function runCurrentControl() {
    setError("");
    if (currentControl.id === "open_work_item" && currentWorkItem) {
      openDocument(currentWorkItem.path);
      return;
    }
    if (currentControl.id === "review_intake") {
      openDocument(defaultPath);
      return;
    }
    if (currentControl.id === "review_and_decide") {
      setModalOpen(true);
      return;
    }
    if (currentControl.id === "draft_work_product") {
      setChatSeed((current) => ({
        text: "Draft the work product for the chosen path and save it in this matter.",
        revision: current.revision + 1,
      }));
      return;
    }
    if (currentControl.id === "review_draft" && draftPath) {
      openDocument(draftPath);
      return;
    }
    if (currentControl.id === "review_remaining_work") {
      const remainingWork = document.getElementById("remaining-work");
      remainingWork?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setBusy(true);
    try {
      if (currentControl.id === "run_research") {
        const result = await runResearch(detail.matter_id);
        await reload();
        openDocument(result.path);
      } else if (currentControl.id === "start_work_product") {
        await moveMatter(detail.matter_id, "generate", "Judgment complete; starting work product");
        await reload();
      } else if (["approve_response", "mark_as_sent", "close_matter"].includes(currentControl.id)) {
        await performMatterAction(
          detail.matter_id,
          currentControl.id as "approve_response" | "mark_as_sent" | "close_matter",
        );
        await reload();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete the matter action.");
    } finally {
      setBusy(false);
    }
  }

  const proposedPath = parseProposedPath(recommendation ?? "");
  const recommendationText = proposedPath || recommendationSummary(recommendation ?? "");
  const openItems = openItemsFor(
    detail.work_items,
    detail.orientation.open_questions,
    detail.work_state.next_work_item_id,
    detail.work_state.next_action,
  );
  const requiredCount = openItems.filter((item) => item.required).length;
  const currentTask = primaryAction.id === "none"
    ? primaryAction.detail
    : detail.work_state.next_action.trim() || currentWorkItem?.title || primaryAction.detail;
  const primaryActionClass = currentControl.category === "Counsel judgment" || currentControl.category === "Approval"
    ? "btn review"
    : currentControl.id === "run_research" || currentControl.id === "draft_work_product"
      ? "btn agent"
      : "btn primary";

  function focusConversation() {
    setCollapsedPanes({ tree: true, overview: false, document: true });
  }

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
            <dd>{riskLabel(detail.risk_level)}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd style={{ color: due.color }}>{due.text}</dd>
          </div>
        </dl>
      </header>

      {error ? <p className="error" style={{ margin: "10px 34px 0" }}>{error}</p> : null}

      <div
        className="matter-panes"
        style={{
          gridTemplateColumns: [
            collapsedPanes.tree ? "44px" : `minmax(210px, ${paneWeights.tree}fr)`,
            collapsedPanes.tree || collapsedPanes.overview ? "0px" : "8px",
            collapsedPanes.overview ? "44px" : `minmax(360px, ${paneWeights.overview}fr)`,
            collapsedPanes.overview || collapsedPanes.document ? "0px" : "8px",
            collapsedPanes.document ? "44px" : `minmax(430px, ${paneWeights.document}fr)`,
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
                <span className="matter-tree-count">{countFiles(detail.tree)}</span>
                <button aria-label="Collapse matter contents" className="pane-collapse" onClick={() => togglePane("tree")} title="Collapse matter contents" type="button">‹</button>
              </span>
            </div>
            <div className="matter-tree-scroll">
              <MatterTree
                activePath={treeActivePath}
                onNewChat={() => {
                  setTreeActivePath(null);
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
              <div className="btn-row">
                {!collapsedPanes.tree || !collapsedPanes.document ? (
                  <button className="btn quiet compact" onClick={focusConversation} type="button">Focus conversation</button>
                ) : null}
                <button
                  aria-label="Collapse matter overview"
                  className="pane-collapse"
                  onClick={() => togglePane("overview")}
                  title="Collapse matter overview"
                  type="button"
                >‹</button>
              </div>
            </div>
            <div className="brief-scroll">
              <div className="matter-brief">
                <section className={`matter-call ${primaryAction.id === "none" ? "is-complete" : ""}`}>
                  <span className="matter-call-kicker">
                    {primaryAction.id === "none" ? "Matter status" : "Next action"}
                  </span>
                  <p className="matter-call-task"><LinkifiedText text={currentTask} /></p>

                  {primaryAction.id !== "none" ? (
                    <div className="matter-recommendation">
                      <div className="matter-recommendation-label">
                        Working recommendation · Source and review status not recorded
                      </div>
                    {recommendation === null ? (
                        <p>Reading the saved recommendation…</p>
                    ) : recommendationText ? (
                      <>
                        <p><LinkifiedText text={recommendationText} /></p>
                          <div className="matter-record-note">
                            This is a working recommendation. It is not an approval or recorded decision.
                          </div>
                      </>
                    ) : (
                        <p>No working recommendation is saved.</p>
                    )}
                    </div>
                  ) : null}

                  {primaryAction.id !== "none" ? (
                    <div className="matter-call-do">
                      <span>{currentControl.category}</span>
                      <button
                        aria-busy={busy}
                        className={`${primaryActionClass} matter-call-button`}
                        disabled={busy}
                        onClick={() => void runCurrentControl()}
                        title={currentControl.detail}
                        type="button"
                      >
                        {busy ? "Working…" : currentControl.label}
                      </button>
                    </div>
                  ) : null}
                </section>

                <section className="matter-open" id="remaining-work">
                  <div className="matter-open-head">
                    <h2>{openItems.length ? "Also open on this matter" : "Nothing else is open"}</h2>
                    {openItems.length ? (
                      <span>{requiredCount} required · {openItems.length - requiredCount} optional</span>
                    ) : null}
                  </div>
                  {openItems.length ? (
                    <ul className="matter-open-list">
                      {openItems.map((item) => (
                        <li className={item.required ? "is-required" : ""} key={item.key}>
                          <span aria-hidden="true" className="matter-open-mark" />
                          <span className="matter-open-text"><LinkifiedText text={item.text} /></span>
                          {item.required ? <span className="matter-open-tag">Required</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="matter-open-empty">No other open records are saved.</p>
                  )}
                </section>

                <details className="matter-reference">
                  <summary>Materials, activity, and decision maintenance</summary>
                  <div className="matter-reference-body">
                    {primaryAction.id === "none" && recommendationText ? (
                      <section>
                        <h2>Saved recommendation</h2>
                        <div className="matter-recommendation">
                          <div className="matter-recommendation-label">
                            Source and review status not recorded
                          </div>
                          <p><LinkifiedText text={recommendationText} /></p>
                          <div className="matter-record-note">
                            This saved recommendation is not a recorded decision.
                          </div>
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
                        {researchPath ? <button className="matter-artifact-link" onClick={() => openDocument(researchPath)} type="button"><span>Latest research</span><span>Open the research packet</span></button> : null}
                        {workProductPaths.map((item) => (
                          <button className="matter-artifact-link" key={item.path} onClick={() => openDocument(item.path)} type="button">
                            <span>{item.state} work product</span><span>{item.label}</span>
                          </button>
                        ))}
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

            <ChatPanel
              activeFile={activePath}
              matterId={detail.matter_id}
              matterTitle={detail.title}
              onRefresh={reload}
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
            <DocumentPanel
              activePath={activePath}
              activeReviewAuthor={reviewAuthor.name}
              lawyerAuthor={reviewSettings.lawyer}
              onReviewAuthorChange={reviewAuthor.setName}
              onAskAgent={() => setChatSeed((current) => ({
                text: `Propose replacement language for ${activePath?.split("/").at(-1) ?? "this document"}. Save the revision to the active file so I can accept or reject each redline.`,
                revision: current.revision + 1,
              }))}
              onCollapse={() => togglePane("document")}
              onUpload={upload}
            />
          </div>
        </div>
      </div>

      {modalOpen ? (
        <RecordDecisionModal
          basis={evidence.map((node) => node.path)}
          detail={detail}
          onClose={() => setModalOpen(false)}
          onRecorded={reload}
          suggestion={proposedPath}
        />
      ) : null}
    </div>
  );
}

/** A proposal exists only when the recommendation record labels it on one line. */
function parseProposedPath(markdown: string): string {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const paragraphs = body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const firstSubstantive = paragraphs.find((paragraph) => !paragraph.startsWith("#"));
  const firstForMatching = stripEmphasis(firstSubstantive ?? "");
  if (/^No (?:launch )?recommendation\b/i.test(firstForMatching)) return "";

  for (const rawLine of body.split("\n")) {
    const matchLine = stripEmphasis(rawLine.trim());
    const match = matchLine.match(/^(?:Working path|Recommended path):\s*(.+)$/i);
    if (!match) continue;
    return match[1]
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !/^(?:Counsel must confirm|Confirm|Pending|Open question)\b/i.test(sentence.trim()))
      .join(" ")
      .trim();
  }
  return "";
}

/** Falls back to the first recommendation paragraph when older records lack a path label. */
function recommendationSummary(markdown: string): string {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
  const paragraph = body
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith("#"));
  const normalized = stripEmphasis(paragraph ?? "");
  return /^No (?:launch )?recommendation\b/i.test(normalized) ? "" : normalized;
}

function stripEmphasis(value: string): string {
  return value.replace(/\*\*|__|(?<!\*)\*(?!\*)|(?<!_)_(?!_)/g, "").trim();
}

type EvidenceNode = { path: string; name: string; kind: string; note: string };

/** Flattens the matter tree into the two things the lawyer actually cites. */
function collectEvidence(tree: FileNode[]): EvidenceNode[] {
  const out: EvidenceNode[] = [];
  const matterRecordLabels: Record<string, { name: string; kind: string; note: string }> = {
    "request.md": { name: "Original request", kind: "Matter record", note: "The request that started this matter" },
    "facts.md": { name: "Facts, sources & assumptions", kind: "Matter record", note: "The current factual record" },
    "issues.md": { name: "Issue map", kind: "Matter record", note: "The legal and operational questions" },
    "recommendations.md": {
      name: "Working recommendation",
      kind: "Matter record",
      note: "Saved recommendation; source and review status are not recorded",
    },
  };
  const walk = (nodes: FileNode[], folder: string) => {
    for (const node of nodes) {
      if (node.type === "folder") { walk(node.children ?? [], node.name); continue; }
      const matterRecord = matterRecordLabels[node.name];
      if (matterRecord) {
        out.push({ path: node.path, ...matterRecord });
      } else if (folder === "documents") {
        out.push({ path: node.path, name: node.label ?? node.name, kind: "Source document", note: "Attached to the matter" });
      } else if (folder === "research") {
        out.push({ path: node.path, name: node.label ?? node.name, kind: "Agent research", note: "Written by Themis, unreviewed" });
      }
    }
  };
  walk(tree, "");
  return out.slice(0, 6);
}

function countFiles(tree: FileNode[]): number {
  let total = 0;
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === "folder") walk(node.children ?? []);
      else total += 1;
    }
  };
  walk(tree);
  return total;
}

function safeMatterPath(requested: string | null | undefined, matterPath: string, fallback: string): string {
  if (!requested || requested.includes("\\") || requested.split("/").includes("..")) return fallback;
  return requested.startsWith(`${matterPath}/`) ? requested : fallback;
}

function conversationIdFromPath(path: string): string | null {
  if (!path.includes("/conversations/")) return null;
  const match = path.split("/").at(-1)?.match(/^(CONV-\d{8}-[a-f0-9]{6})\.md$/);
  return match?.[1] ?? null;
}

function findConversationPath(tree: FileNode[], conversationId: string): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === "conversations");
  return (folder?.children ?? []).find((node) => node.path.endsWith(`/${conversationId}.md`))?.path ?? null;
}

function findFirstFile(tree: FileNode[], folderName: string): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === folderName);
  return (folder?.children ?? []).find((node) => node.type === "file")?.path ?? null;
}

function findLatestResearch(tree: FileNode[]): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === "research");
  const files = (folder?.children ?? []).filter(
    (node) => node.type === "file" && node.extension === ".md" && node.name !== "annotations.md",
  );
  return files.length ? files[files.length - 1].path : null;
}

function findFileByName(tree: FileNode[], name: string): string | null {
  for (const node of tree) {
    if (node.type === "file" && node.name === name) return node.path;
    if (node.type === "folder") {
      const found = findFileByName(node.children ?? [], name);
      if (found) return found;
    }
  }
  return null;
}

function collectWorkProduct(tree: FileNode[]): { path: string; label: string; state: "Draft" | "Final" }[] {
  const items: { path: string; label: string; state: "Draft" | "Final" }[] = [];
  const walk = (nodes: FileNode[]) => {
    for (const node of nodes) {
      if (node.type === "folder") walk(node.children ?? []);
      else if (node.path.includes("/work-product/draft/")) items.push({ path: node.path, label: node.label ?? node.name, state: "Draft" });
      else if (node.path.includes("/work-product/final/")) items.push({ path: node.path, label: node.label ?? node.name, state: "Final" });
    }
  };
  walk(tree);
  return items.slice(0, 4);
}
