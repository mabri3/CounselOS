"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import ResearchQueuePanel from "@/components/ResearchQueuePanel";
import styles from "@/components/ResearchPhase2.module.css";
import { answerAnnotation, createAnnotation, getAnnotations, getFile, getMatter, getResearchQueue, reorderResearchQueue, resumeResearchQueue, retryResearchItem, startResearchRun, stopResearchQueue } from "@/lib/api";
import { formatDateTime } from "@/lib/design";
import { parseMemo, splitCitations } from "@/lib/research";
import type { Citation as ResearchCitation, FileNode, MatterDetail, ResearchMemo, ResearchNote, ResearchRun } from "@/lib/types";
import { movePending, researchQuestion, shouldPollResearchQueue } from "@/lib/researchQueue";

type DisplayResearchMemo = ResearchMemo & {
  publicResearchStatus?: "not_requested" | "retrieved" | "unavailable" | "failed";
};

/**
 * Canvas 6a — reading research. Click a citation and the source opens in the
 * right pane with the passage it was drawn from; the Notes tab holds the
 * passages the lawyer questioned, with the agent's answer under each.
 *
 * Highlights are amber (yours). The memo's own claims stay iris (Themis.ai's).
 */
export default function ResearchPage() {
  const params = useParams<{ matterId: string }>();
  const searchParams = useSearchParams();
  const matterId = params.matterId;
  const requestedFile = searchParams.get("file");

  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [memo, setMemo] = useState<DisplayResearchMemo | null>(null);
  const [openSource, setOpenSource] = useState<string>("");
  const [rail, setRail] = useState<"source" | "notes">("source");
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [draftNote, setDraftNote] = useState("");
  const [noteTarget, setNoteTarget] = useState<{ source: ResearchCitation | null; path: string } | null>(null);
  const [addingNote, setAddingNote] = useState(false);
  const [answeringId, setAnsweringId] = useState("");
  const [error, setError] = useState("");
  const [queue, setQueue] = useState<ResearchRun[]>([]);
  const [enteredQuestion, setEnteredQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [queueBusy, setQueueBusy] = useState(false);
  const [returnClaim, setReturnClaim] = useState("research-claims");
  const loadSequence = useRef(0);
  const openCitation = (id: string, claim = "research-claims") => {
    setOpenSource(id);
    setRail("source");
    setReturnClaim(claim);
    if (window.innerWidth <= 800) requestAnimationFrame(() => document.getElementById("research-details")?.scrollIntoView({ block: "start" }));
  };

  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    try {
      setError("");
      const [matter, { annotations }, queueResult] = await Promise.all([
        getMatter(matterId),
        getAnnotations(matterId),
        getResearchQueue(matterId),
      ]);
      if (sequence !== loadSequence.current) return;
      setDetail(matter);
      setNotes(annotations);
      setQueue(queueResult.items);
      const path = safeResearchPath(requestedFile, matter.path) ?? newestResearchPath(matter.tree);
      if (!path) { setMemo(null); return; }
      const nextMemo = parseMemo(await getFile(path));
      if (sequence === loadSequence.current) setMemo(nextMemo);
    } catch (caught) {
      if (sequence === loadSequence.current) setError(caught instanceof Error ? caught.message : "Could not open the research.");
    }
  }, [matterId, requestedFile]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!shouldPollResearchQueue(queue)) return;
    const timer = window.setInterval(() => { void load(); }, 1800);
    return () => window.clearInterval(timer);
  }, [load, queue]);

  const queuePanel = detail ? (
    <ResearchQueuePanel
      presentation="phase2"
      busy={queueBusy}
      enteredQuestion={enteredQuestion}
      items={queue}
      savedQuestions={detail.orientation.open_question_items ?? []}
      onEnteredQuestion={setEnteredQuestion}
      onMove={async (runId, direction) => {
        setQueueBusy(true);
        try { setQueue((await reorderResearchQueue(matterId, movePending(queue, runId, direction))).data.items); }
        catch (caught) { setError(caught instanceof Error ? caught.message : "Could not reorder research."); }
        finally { setQueueBusy(false); }
      }}
      onResume={async () => { setQueueBusy(true); try { await resumeResearchQueue(matterId); await load(); } finally { setQueueBusy(false); } }}
      onStop={async () => { setQueueBusy(true); try { await stopResearchQueue(matterId); await load(); } finally { setQueueBusy(false); } }}
      onRetry={async (runId) => { setQueueBusy(true); try { await retryResearchItem(matterId, runId); await load(); } finally { setQueueBusy(false); } }}
      onRun={async () => {
        const question = researchQuestion(selectedQuestion, enteredQuestion, detail.title);
        setQueueBusy(true);
        try {
          await startResearchRun(matterId, question, `research-ui:${Date.now()}`);
          setEnteredQuestion(""); setSelectedQuestion(""); await load();
        } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not queue research."); }
        finally { setQueueBusy(false); }
      }}
      onSelectedQuestion={setSelectedQuestion}
      selectedQuestion={selectedQuestion}
    />
  ) : null;

  const source = useMemo(
    () => (openSource ? memo?.citations.find((citation) => citation.id === openSource) : memo?.citations[0]) ?? null,
    [memo, openSource],
  );
  const memoByline = memo?.citations.length
    ? memo.byline
    : memo?.byline.replace(/ · no sources cited$/i, "");

  if (error && (!detail || !memo)) return <AppShell><main className="page"><p className="error">{error}</p></main></AppShell>;
  if (!detail || !memo) {
    return (
      <AppShell>
        <main className="page">
          {detail && !memo ? (
            <div className="empty-state">
              No research has been written for this matter yet.{" "}
              <Link href={`/matters/${encodeURIComponent(matterId)}`} style={{ textDecoration: "underline" }}>
                Open the matter
              </Link>{" "}
              and run first-pass research.
              {queuePanel}
            </div>
          ) : (
            <div className="loading">Opening the research…</div>
          )}
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className={styles.page}>
        <Link className={styles.back} href={`/matters/${encodeURIComponent(matterId)}`}>‹ Back to matter</Link>
        <header className={styles.header}>
          <div>
            <div className={styles.eyebrow}>Business question · {detail.title}</div>
            <h1 className={styles.title}>{memo.title}</h1>
            <p className={styles.byline}>{memoByline}</p>
          </div>
          <Link className="btn compact" href={`/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(memo.path)}`}>
            Open in the matter ↗
          </Link>
        </header>
        <section className={styles.summary} aria-label="Generated research summary">
          <div className={styles.eyebrow}>Agent work · {memo.citations.length} cited {memo.citations.length === 1 ? "source" : "sources"}</div>
          <p>Themis.ai prepared this working analysis to help you assess next steps.</p>
          {memo.publicResearchStatus && memo.publicResearchStatus !== "retrieved" ? (
            <div className="setting-help">
              Public research {memo.publicResearchStatus === "not_requested" ? "was not requested" : memo.publicResearchStatus === "failed" ? "failed" : "is unavailable"}. The saved analysis remains available.
            </div>
          ) : null}
        </section>
        {error ? <p className="error" role="alert">{error}</p> : null}
        {queuePanel}

        <div className={styles.layout}>
          <div>
            <article className={styles.memo} id="research-claims" tabIndex={-1} aria-label="Research analysis">
              {memo.technicalDetails ? (
                <details style={{ margin: "12px 0 20px" }}>
                  <summary className="setting-help" style={{ cursor: "pointer", fontWeight: 600 }}>Technical details</summary>
                  <pre style={{ marginTop: 10, overflowX: "auto", whiteSpace: "pre-wrap", fontSize: 12 }}>
                    {JSON.stringify(memo.technicalDetails, null, 2)}
                  </pre>
                </details>
              ) : null}

              <div className={styles.memoBody}>
                {memo.blocks.map((block, index) => {
                  const render = (text: string, itemKey = "text") =>
                    splitCitations(text).map((run, runIndex) => {
                      if (!("citation" in run)) return <span key={runIndex}><LinkifiedText text={run.text} /></span>;
                      const citation = memo.citations.find((item) => item.id === run.citation || item.n === run.citation);
                      const target = citation?.id ?? `missing:${run.citation}`;
                      return <Citation active={source?.id === target} key={runIndex} n={citation?.n ?? run.citation} id={`claim-${index}-${itemKey}-${runIndex}`}
                        onOpen={() => openCitation(target, `claim-${index}-${itemKey}-${runIndex}`)} />;
                    });

                  if (block.kind === "h") {
                    return block.level <= 2
                      ? <h2 key={index}>{block.text}</h2>
                      : <h3 key={index}>{block.text}</h3>;
                  }
                  if (block.kind === "list") {
                    return (
                      <ul key={index}>
                        {block.items.map((item, itemIndex) => <li key={itemIndex}>{render(item, String(itemIndex))}</li>)}
                      </ul>
                    );
                  }
                  if (block.kind === "quote") {
                    return <blockquote key={index}>{render(block.text)}</blockquote>;
                  }
                  return <p key={index}>{render(block.text)}</p>;
                })}
              </div>

              {memo.citations.length ? (
                <div style={{ marginTop: 26, paddingTop: 18, borderTop: "1px solid var(--line-faint)" }}>
                  <div style={{ font: "600 14px var(--sans)", color: "var(--ink-4)", marginBottom: 10 }}>Sources</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {memo.citations.map((citation) => (
                      <button
                        key={citation.id}
                        onClick={() => openCitation(citation.id)}
                        style={{ display: "flex", gap: 11, alignItems: "baseline", background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left" }}
                      >
                        <span className={styles.citation}>[{citation.n}]</span>
                        <span style={{ font: "400 14.5px var(--sans)", color: "var(--ink-2)" }}>
                          {humanSourceLabel(citation.name, citation.kind)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </div>

          <aside className={styles.rail} id="research-details" aria-label="Sources and notes">
            <div className={styles.tabs} aria-label="Research details">
              <button aria-pressed={rail === "source"} onClick={() => setRail("source")}>Source</button>
              <button aria-pressed={rail === "notes"} onClick={() => setRail("notes")}>
                Notes &amp; questions{notes.length ? ` (${notes.length})` : ""}
              </button>
            </div>

            <div className={styles.railBody}>
              {rail === "source" ? (
                source ? (
                  <div>
                    <div className={styles.sourcePosition}>
                      <span>Source {memo.citations.indexOf(source) + 1} of {memo.citations.length}</span>
                      <div>
                        <button aria-label="Previous source" disabled={memo.citations.indexOf(source) === 0} onClick={() => setOpenSource(memo.citations[memo.citations.indexOf(source) - 1].id)}>‹</button>
                        <button aria-label="Next source" disabled={memo.citations.indexOf(source) === memo.citations.length - 1} onClick={() => setOpenSource(memo.citations[memo.citations.indexOf(source) + 1].id)}>›</button>
                      </div>
                    </div>
                    <h2 className={styles.sourceTitle}>{humanSourceLabel(source.name, source.kind)}</h2>
                    <SourceDetails kind={source.kind} />
                    <div className={styles.sourceQuote}>
                      <div>{source.quote ? "Saved passage" : "No exact passage available"}</div>
                      {source.quote ? <blockquote><LinkifiedText text={source.quote} /></blockquote> : null}
                    </div>
                    <div className={styles.support}>
                      <h3>Applicability &amp; support</h3>
                      <p><LinkifiedText text={source.note} /></p>
                      {/^(Internal matter support|Supplied)/.test(source.kind) ? <p>Supplied material supports the described facts. It does not by itself establish a legal rule.</p> : null}
                    </div>
                    <button className="btn compact" onClick={() => {
                      setRail("notes");
                      if (!draftNote.trim()) {
                        setNoteTarget({ source, path: memo.path });
                        setDraftNote(`About "${humanSourceLabel(source.name, source.kind)}": `);
                      }
                    }}>Ask about this passage</button>
                  </div>
                ) : (
                  <div className={styles.noteInput}>{openSource ? "This citation has no saved source. No passage is available." : "No sources are cited in this research."} Select Notes &amp; questions to add a question.</div>
                )
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {notes.map((note) => (
                    <div className={styles.noteCard} key={note.annotation_id}>
                      <div className={styles.noteQuote}>
                        <div><LinkifiedText text={note.quote} /></div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 9 }}>
                          <span style={{ font: "600 13.5px var(--sans)", color: "var(--ink)" }}>{note.who}</span>
                          <span style={{ font: "400 13px var(--sans)", color: "var(--ink-5)" }}>
                            {formatDateTime(note.created_at)}
                          </span>
                        </div>
                        <div style={{ font: "400 15px/1.55 var(--sans)", color: "var(--ink)", marginTop: 4 }}><LinkifiedText text={note.question} /></div>
                      </div>
                      {note.answered ? (
                        <div className={styles.noteAnswer}>
                          <div className="agent-label" style={{ marginBottom: 6, fontSize: 13 }}>
                            <span className="agent-mark" />
                            Themis.ai
                          </div>
                          <div className="reading">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.answer}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.noteAnswer}>
                          {answeringId === note.annotation_id ? (
                            <span className="agent-label">
                              <span className="agent-mark" />
                              Themis.ai is working…
                            </span>
                          ) : (
                            <button
                              className="btn agent compact"
                              disabled={!!answeringId}
                              onClick={async () => {
                                setAnsweringId(note.annotation_id);
                                setError("");
                                try {
                                  await answerAnnotation(matterId, note.annotation_id);
                                  await load();
                                } catch (caught) {
                                  setError(caught instanceof Error ? caught.message : "Could not answer the note.");
                                } finally {
                                  setAnsweringId("");
                                }
                              }}
                            >
                              Ask Themis.ai
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className={styles.noteInput}>
                    {noteTarget && draftNote ? <p className="setting-help">About: {noteTarget.source ? humanSourceLabel(noteTarget.source.name, noteTarget.source.kind) : "Research memo"}</p> : null}
                    <textarea
                      className="text-input"
                      onChange={(event) => {
                        if (!draftNote) setNoteTarget({ source, path: memo.path });
                        setDraftNote(event.target.value);
                      }}
                      disabled={addingNote}
                      aria-label="Note or question"
                      placeholder="Question a passage — what would change this analysis?"
                      style={{ minHeight: 72 }}
                      value={draftNote}
                    />
                    <div className="btn-row" style={{ marginTop: 10, justifyContent: "flex-end" }}>
                      <button
                        className="btn compact"
                        disabled={!draftNote.trim() || addingNote}
                        onClick={async () => {
                          setAddingNote(true);
                          setError("");
                          try {
                            const target = noteTarget ?? { source, path: memo.path };
                            const sourcePath = target.source?.kind.startsWith("Vault document · ")
                              ? target.source.kind.split(" · ").slice(1).join(" · ")
                              : target.path;
                            await createAnnotation(matterId, {
                              source_path: sourcePath,
                              citation: target.source?.id ?? "",
                              quote: target.source?.quote ?? "",
                              question: draftNote.trim(),
                              who: "Brian Harris",
                            });
                            setDraftNote("");
                            setNoteTarget(null);
                            await load();
                          } catch (caught) {
                            setError(caught instanceof Error ? caught.message : "Could not add the note.");
                          } finally {
                            setAddingNote(false);
                          }
                        }}
                      >
                        {addingNote ? "Adding…" : "Add the note"}
                      </button>
                    </div>
                    <div className="stub-note" style={{ marginTop: 8 }}>
                      {notes.length} {notes.length === 1 ? "note" : "notes"} on this research.
                    </div>
                    {error ? <div className="error" style={{ marginTop: 8 }}>{error}</div> : null}
                  </div>
                </div>
              )}
              <a className={styles.return} href={`#${returnClaim}`}>Return to the analysis ↑</a>
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}

function Citation({ n, active, onOpen, id }: { n: string; active: boolean; onOpen: () => void; id: string }) {
  return <button id={id} className={styles.citation} aria-label={`Open source ${n}`} aria-pressed={active} onClick={onOpen} type="button">[{n}]</button>;
}

function humanSourceLabel(value: string, kind: string): string {
  if (!kind.startsWith("Vault document")) return value;
  const fileName = value.split(/[\\/]/).at(-1) ?? value;
  const withoutExtension = fileName.replace(/\.[a-z0-9]{1,8}$/i, "");
  return withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SourceDetails({ kind }: { kind: string }) {
  const [label, ...rawParts] = kind.split(" · ");
  const raw = rawParts.join(" · ");
  if (!raw) {
    return <div style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)", marginTop: 6 }}>{label}</div>;
  }
  return (
    <details style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)", marginTop: 6 }}>
      <summary>{label} details</summary>
      <div style={{ marginTop: 5, wordBreak: "break-word" }}><LinkifiedText text={raw} /></div>
    </details>
  );
}

/** The newest thing under `research/` is what "read the memo" means. */
function newestResearchPath(tree: FileNode[]): string | null {
  const folder = tree.find((node) => node.type === "folder" && node.name === "research");
  const files = (folder?.children ?? []).filter((node) => node.type === "file" && node.extension === ".md");
  return files.length ? files[files.length - 1].path : null;
}

function safeResearchPath(requested: string | null, matterPath: string): string | null {
  if (!requested || requested.includes("\\") || requested.split("/").includes("..")) return null;
  if (!requested.startsWith(`${matterPath}/research/`) || !requested.endsWith(".md")) return null;
  return requested.endsWith("/annotations.md") ? null : requested;
}
