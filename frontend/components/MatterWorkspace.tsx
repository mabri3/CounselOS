"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import ChatPanel from "@/components/ChatPanel";
import DocumentPanel from "@/components/DocumentPanel";
import LinkifiedText from "@/components/LinkifiedText";
import MatterTree from "@/components/MatterTree";
import RecordDecisionModal from "@/components/RecordDecisionModal";
import { getFile, moveMatter, performMatterAction, runResearch, uploadDocument } from "@/lib/api";
import { dueWord, role, signalFor, stageLabel } from "@/lib/design";
import { matterAction } from "@/lib/matterActions";
import type { FileNode, MatterDetail } from "@/lib/types";

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
  const [activePath, setActivePath] = useState<string | null>(() => safeMatterPath(initialPath, detail.path, initialFallback));
  const [treeActivePath, setTreeActivePath] = useState<string | null>(() => safeMatterPath(initialPath, detail.path, initialFallback));
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [panel, setPanel] = useState<"" | "trace" | "history">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState({ text: "", revision: 0 });
  const [conversationSeed, setConversationSeed] = useState({ conversationId: "", revision: 0 });
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [collapsedPanes, setCollapsedPanes] = useState({ tree: false, overview: false, document: false });

  useEffect(() => {
    const requested = safeMatterPath(initialPath, detail.path, initialFallback);
    setActivePath(requested);
    setTreeActivePath(requested);
  }, [detail.path, initialFallback, initialPath]);

  /** The agent's standing recommendation lives in the matter's own Markdown. */
  useEffect(() => {
    let cancelled = false;
    void getFile(`${detail.path}/recommendations.md`)
      .then((document) => { if (!cancelled) setRecommendation(document.content.trim()); })
      .catch(() => { if (!cancelled) setRecommendation(""); });
    return () => { cancelled = true; };
  }, [detail.path]);

  const evidence = useMemo(() => collectEvidence(detail.tree), [detail.tree]);
  const draftPath = useMemo(() => findFirstFile(detail.tree, "drafts"), [detail.tree]);
  const dossierPath = useMemo(() => findFileByName(detail.tree, "dossier.md"), [detail.tree]);
  const workProductPaths = useMemo(() => collectWorkProduct(detail.tree), [detail.tree]);
  const primaryAction = matterAction(detail, Boolean(draftPath));
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
  }

  function togglePane(pane: keyof typeof collapsedPanes) {
    setCollapsedPanes((current) => {
      const openCount = Object.values(current).filter((collapsed) => !collapsed).length;
      if (!current[pane] && openCount === 1) return current;
      return { ...current, [pane]: !current[pane] };
    });
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

  async function runPrimaryAction() {
    setError("");
    if (primaryAction.id === "review_intake") {
      openDocument(defaultPath);
      return;
    }
    if (primaryAction.id === "review_and_decide") {
      setChatSeed((current) => ({
        text: "Help me review the options and decide. Recommend a path, do not record a decision, and ask whether the material choice should become a durable decision.",
        revision: current.revision + 1,
      }));
      return;
    }
    if (primaryAction.id === "draft_work_product") {
      setChatSeed((current) => ({
        text: "Draft the work product for the chosen path and save it in this matter.",
        revision: current.revision + 1,
      }));
      return;
    }
    if (primaryAction.id === "review_draft" && draftPath) {
      openDocument(draftPath);
      return;
    }
    if (primaryAction.id === "review_remaining_work") {
      setPanel("trace");
      return;
    }

    setBusy(true);
    try {
      if (primaryAction.id === "run_research") {
        const result = await runResearch(detail.matter_id);
        await reload();
        openDocument(result.path);
      } else if (primaryAction.id === "start_work_product") {
        await moveMatter(detail.matter_id, "generate", "Judgment complete; starting work product");
        await reload();
      } else if (["approve_response", "mark_as_sent", "close_matter"].includes(primaryAction.id)) {
        await performMatterAction(
          detail.matter_id,
          primaryAction.id as "approve_response" | "mark_as_sent" | "close_matter",
        );
        await reload();
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete the matter action.");
    } finally {
      setBusy(false);
    }
  }

  const recommendationBody = stripMarkdown(
    (recommendation ?? "")
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("#"))
      .slice(0, 3)
      .join(" "),
  );

  return (
    <div className="matter-shell">
      <header className="matter-head">
        <div style={{ minWidth: 0 }}>
          <div className="matter-crumb">
            <Link href="/matters" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Matters</Link>
            {" · "}
            {stageLabel(detail.status).toLowerCase()}
            {detail.risk_level ? ` · ${detail.risk_level.toLowerCase()} risk` : ""}
            {" · "}
            <span style={{ color: due.color }}>{due.text}</span>
          </div>
          <h1 className="matter-title"><LinkifiedText text={detail.title} /></h1>
        </div>
        <div style={{ flex: "none" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ font: "400 13px var(--sans)", color: "var(--ink-4)" }}>Next action</div>
            <div style={{ font: "500 15px var(--sans)", color: "var(--ink)" }}>
              <LinkifiedText text={detail.orientation.next_action || primaryAction.detail} />
            </div>
          </div>
        </div>
      </header>

      {error ? <p className="error" style={{ margin: "10px 34px 0" }}>{error}</p> : null}

      <div
        className="matter-panes"
        style={{
          gridTemplateColumns: [
            collapsedPanes.tree ? "44px" : "minmax(210px, 0.55fr)",
            collapsedPanes.overview ? "44px" : "minmax(360px, 1fr)",
            collapsedPanes.document ? "44px" : "minmax(430px, 1.15fr)",
          ].join(" "),
        } as CSSProperties}
      >
        <aside className="matter-tree-pane">
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

        <div className="brief-pane">
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
              <button aria-label="Collapse matter overview" className="pane-collapse" onClick={() => togglePane("overview")} title="Collapse matter overview" type="button">‹</button>
            </div>
            <div className="brief-scroll">
            <div className="brief-inner">
              <div style={{ font: "600 14px var(--sans)", color: "var(--ink-4)" }}>The question</div>
              <p className="the-question"><LinkifiedText text={detail.orientation.headline || detail.description || detail.title} /></p>

              <div className="agent-note" style={{ marginTop: 26 }} title="Agent analysis is a suggested path. It is not a recorded human decision.">
                <div className="agent-label">
                  <span className="agent-mark" />
                  Agent recommendation — not a decision
                </div>
                {recommendation === null ? (
                  <p style={{ font: "400 15px var(--sans)", color: "var(--ink-3)" }}>Reading the matter…</p>
                ) : recommendationBody ? (
                  <>
                    <p style={{ font: "400 16px/1.6 var(--serif)", color: "var(--ink-2)", textWrap: "pretty" }}>
                      <LinkifiedText text={recommendationBody} />
                    </p>
                    <p style={{ font: "400 14px/1.6 var(--sans)", color: "var(--ink-3)" }}>
                      Nothing here is on the record until you record it.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ font: "400 16px/1.6 var(--serif)", color: "var(--ink-2)" }}>
                      Themis has not proposed a path yet.
                    </p>
                    <button
                      className="btn agent compact"
                      disabled={busy}
                      style={{ marginTop: 12 }}
                      onClick={async () => {
                        setBusy(true);
                        setError("");
                        try {
                          const result = await runResearch(detail.matter_id);
                          await reload();
                          openDocument(result.path);
                        } catch (caught) {
                          setError(caught instanceof Error ? caught.message : "Could not run research.");
                        } finally { setBusy(false); }
                      }}
                    >
                      {busy ? "Researching…" : "Run first-pass research"}
                    </button>
                  </>
                )}
              </div>

              <div style={{ marginTop: 28 }}>
                <div style={{ font: "600 14px var(--sans)", color: "var(--ink-4)" }}>What that rests on</div>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 1 }}>
                  {evidence.length === 0 ? (
                    <div className="faint small" style={{ padding: "11px 12px" }}>
                      No source documents attached yet. Drop one in the files panel.
                    </div>
                  ) : null}
                  {evidence.map((node) => (
                    <button className="evidence-row" key={node.path} onClick={() => openDocument(node.path)} style={{ background: "none", border: 0, cursor: "pointer", textAlign: "left" }}>
                      <span className="evidence-kind">{node.kind}</span>
                      <span style={{ flex: 1 }}>
                        <span className="evidence-name"><LinkifiedText text={node.name} /></span>
                        <span className="evidence-note"><LinkifiedText text={node.note} /></span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {dossierPath || workProductPaths.length ? (
                <div className="matter-artifacts">
                  <div className="chat-card-kicker">Matter artifacts</div>
                  {dossierPath ? (
                    <button className="matter-artifact-link" onClick={() => openDocument(dossierPath)} type="button">
                      <span>Dossier</span><span>Open the editable matter summary</span>
                    </button>
                  ) : null}
                  {workProductPaths.map((item) => (
                    <button className="matter-artifact-link" key={item.path} onClick={() => openDocument(item.path)} type="button">
                      <span>Work Product · {item.state}</span><span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="decision-call">
                <div style={{ font: "600 13.5px var(--sans)", color: "#6B4A02" }}>{primaryAction.category}</div>
                <p><LinkifiedText text={primaryAction.detail} /></p>
                {primaryAction.id !== "none" ? (
                  <button className="btn primary compact" disabled={busy} style={{ marginTop: 12 }} onClick={() => void runPrimaryAction()}>
                    {primaryAction.label}
                  </button>
                ) : null}
                {detail.durable_decision_needed ? (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(107, 74, 2, .2)" }}>
                    <div style={{ font: "600 13px var(--sans)", color: "var(--ink-3)" }}>Material choice for future reliance</div>
                    <button className="btn quiet compact" style={{ marginTop: 9 }} onClick={() => setModalOpen(true)} title="Save this choice as a dated decision that can be found and reviewed later.">
                      Record durable decision
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="btn-row" style={{ marginTop: 26 }}>
                <button className="btn quiet compact" onClick={() => setPanel((p) => (p === "trace" ? "" : "trace"))} title="Show the agent work recorded for this matter.">
                  {panel === "trace" ? "Hide what the agent did" : "What the agent did"}
                </button>
                <button className="btn quiet compact" onClick={() => setPanel((p) => (p === "history" ? "" : "history"))} title="Show changes to the matter over time.">
                  {panel === "history" ? "Hide matter history" : "Matter history"}
                </button>
                {researchPath ? (
                  <button className="btn quiet compact" onClick={() => openDocument(researchPath)} type="button">
                    Read the research
                  </button>
                ) : null}
              </div>

              {panel === "trace" ? (
                <div className="trace-list">
                  {detail.work_items.length === 0 ? (
                    <div className="trace-item">No agent work has been recorded on this matter.</div>
                  ) : null}
                  {detail.work_items.map((item) => (
                    <div className="trace-item" key={item.work_item_id}>
                      <span style={{ flex: "none", color: item.status === "done" ? role.healthy : role.attentionDeep }}>
                        {item.status === "done" ? "✓" : "•"}
                      </span>
                      <span style={{ flex: 1 }}><LinkifiedText text={item.title} /></span>
                    </div>
                  ))}
                </div>
              ) : null}

              {panel === "history" ? (
                <div className="trace-list">
                  {detail.orientation.recent_changes.length === 0 ? (
                    <div className="trace-item">Nothing has happened on this matter yet.</div>
                  ) : null}
                  {detail.orientation.recent_changes.map((change, index) => (
                    <div className="trace-item" key={index}>
                      <span style={{ flex: "none", color: "var(--ink-5)" }}>·</span>
                      <span style={{ flex: 1 }}><LinkifiedText text={change} /></span>
                    </div>
                  ))}
                </div>
              ) : null}

              {signal.word ? (
                <div className="signal" style={{ marginTop: 26, color: signal.wordColor }}>
                  <span className="dot" style={{ background: signal.rail }} />
                  {signal.word}
                </div>
              ) : null}
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
            />
          </div>
        </div>

        <div className="document-pane-shell">
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
              onAskAgent={() => setChatSeed((current) => ({
                text: `Redraft ${activePath?.split("/").at(-1) ?? "this document"}.`,
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
          suggestion={recommendationBody || detail.orientation.next_action || ""}
        />
      ) : null}
    </div>
  );
}

/** The recommendation is read out of Markdown; show it as prose, not source. */
function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|\s)[*_]([^*_]+)[*_]/g, "$1$2")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

type EvidenceNode = { path: string; name: string; kind: string; note: string };

/** Flattens the matter tree into the two things the lawyer actually cites. */
function collectEvidence(tree: FileNode[]): EvidenceNode[] {
  const out: EvidenceNode[] = [];
  const walk = (nodes: FileNode[], folder: string) => {
    for (const node of nodes) {
      if (node.type === "folder") { walk(node.children ?? [], node.name); continue; }
      if (folder === "documents") {
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
