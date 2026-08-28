"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import LinkifiedText from "@/components/LinkifiedText";
import { answerAnnotation, createAnnotation, getAnnotations, getFile, getMatter } from "@/lib/api";
import { parseMemo, splitCitations } from "@/lib/research";
import type { FileNode, MatterDetail, ResearchMemo, ResearchNote } from "@/lib/types";

/**
 * Canvas 6a — reading research. Click a citation and the source opens in the
 * right pane with the passage it was drawn from; the Notes tab holds the
 * passages the lawyer questioned, with the agent's answer under each.
 *
 * Highlights are amber (yours). The memo's own claims stay iris (Themis's).
 */
export default function ResearchPage() {
  const params = useParams<{ matterId: string }>();
  const searchParams = useSearchParams();
  const matterId = params.matterId;
  const requestedFile = searchParams.get("file");

  const [detail, setDetail] = useState<MatterDetail | null>(null);
  const [memo, setMemo] = useState<ResearchMemo | null>(null);
  const [openSource, setOpenSource] = useState<string>("s1");
  const [rail, setRail] = useState<"source" | "notes">("source");
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [draftNote, setDraftNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [answeringId, setAnsweringId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      const [matter, { annotations }] = await Promise.all([
        getMatter(matterId),
        getAnnotations(matterId),
      ]);
      setDetail(matter);
      setNotes(annotations);
      const path = safeResearchPath(requestedFile, matter.path) ?? newestResearchPath(matter.tree);
      if (!path) { setMemo(null); return; }
      setMemo(parseMemo(await getFile(path)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not open the research.");
    }
  }, [matterId, requestedFile]);

  useEffect(() => { void load(); }, [load]);

  const source = useMemo(
    () => memo?.citations.find((citation) => citation.id === openSource) ?? memo?.citations[0] ?? null,
    [memo, openSource],
  );

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
      <div className="research-shell">
        <header className="research-head">
          <div style={{ minWidth: 0 }}>
            <div style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)" }}>
              <Link href={`/matters/${encodeURIComponent(matterId)}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                {detail.title}
              </Link>
              {" · research"}
            </div>
            <div style={{ font: "600 18px var(--serif)", color: "var(--ink)", marginTop: 2 }}>{memo.title}</div>
          </div>
          <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 14 }}>
            <span className="agent-label" style={{ fontWeight: 500 }}>
              <span className="agent-mark" style={{ width: 10, height: 10 }} />
              Themis wrote this · {memo.citations.length} sources · unreviewed
            </span>
            <Link className="btn compact" href={`/matters/${encodeURIComponent(matterId)}?file=${encodeURIComponent(memo.path)}`}>
              Open in the matter
            </Link>
          </div>
        </header>

        <div className="research-panes">
          <div className="memo-scroll">
            <article className="memo-sheet">
              <h1>{memo.title}</h1>
              <p className="memo-byline">{memo.byline}</p>

              <div className="memo-body reading">
                {memo.blocks.map((block, index) => {
                  const render = (text: string) =>
                    splitCitations(text).map((run, runIndex) =>
                      "citation" in run ? (
                        <Citation
                          active={openSource === `s${run.citation}`}
                          key={runIndex}
                          n={run.citation}
                          onOpen={() => { setOpenSource(`s${run.citation}`); setRail("source"); }}
                        />
                      ) : (
                        <span key={runIndex}><LinkifiedText text={run.text} /></span>
                      ),
                    );

                  if (block.kind === "h") {
                    return block.level <= 2
                      ? <h2 key={index}>{block.text}</h2>
                      : <h3 key={index}>{block.text}</h3>;
                  }
                  if (block.kind === "list") {
                    return (
                      <ul key={index}>
                        {block.items.map((item, itemIndex) => <li key={itemIndex}>{render(item)}</li>)}
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
                        onClick={() => { setOpenSource(citation.id); setRail("source"); }}
                        style={{ display: "flex", gap: 11, alignItems: "baseline", background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left" }}
                      >
                        <Citation active={openSource === citation.id} n={citation.n} onOpen={() => {}} inline={false} />
                        <span style={{ font: "400 14.5px var(--sans)", color: "var(--ink-2)" }}>{citation.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </div>

          <div className="rail-pane">
            <div className="rail-tabs">
              <button className={rail === "source" ? "active" : ""} onClick={() => setRail("source")}>Source</button>
              <button className={rail === "notes" ? "active" : ""} onClick={() => setRail("notes")}>
                Notes &amp; questions{notes.length ? ` (${notes.length})` : ""}
              </button>
            </div>

            <div className="rail-scroll">
              {rail === "source" ? (
                source ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ font: "600 11px var(--sans)", background: "var(--agent)", color: "var(--paper)", borderRadius: 4, padding: "2px 7px" }}>
                        {source.n}
                      </span>
                      <span style={{ font: "600 17px/1.3 var(--serif)", color: "var(--ink)" }}>{source.name}</span>
                    </div>
                    <div style={{ font: "400 13.5px var(--sans)", color: "var(--ink-4)", marginTop: 6, wordBreak: "break-word" }}>
                      <LinkifiedText text={source.kind} />
                    </div>
                    <div className="source-quote"><LinkifiedText text={source.quote} /></div>
                    <p style={{ margin: "14px 0 0", font: "400 14.5px/1.6 var(--sans)", color: "var(--ink-3)" }}><LinkifiedText text={source.note} /></p>
                    <div className="btn-row" style={{ marginTop: 18 }}>
                      <button
                        className="btn agent compact"
                        onClick={() => { setRail("notes"); setDraftNote(`About "${source.name}": `); }}
                      >
                        Ask about this passage
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="note-empty">This memo cites no sources.</div>
                )
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {notes.map((note) => (
                    <div className="note-card" key={note.annotation_id}>
                      <div className="note-quote">
                        <div><LinkifiedText text={note.quote} /></div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginTop: 9 }}>
                          <span style={{ font: "600 13.5px var(--sans)", color: "var(--ink)" }}>{note.who}</span>
                          <span style={{ font: "400 13px var(--sans)", color: "var(--ink-5)" }}>
                            {new Date(note.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div style={{ font: "400 15px/1.55 var(--sans)", color: "var(--ink)", marginTop: 4 }}><LinkifiedText text={note.question} /></div>
                      </div>
                      {note.answered ? (
                        <div className="note-answer">
                          <div className="agent-label" style={{ marginBottom: 6, fontSize: 13 }}>
                            <span className="agent-mark" />
                            Themis
                          </div>
                          <div className="reading"><LinkifiedText text={note.answer} /></div>
                        </div>
                      ) : (
                        <div className="note-answer">
                          {answeringId === note.annotation_id ? (
                            <span className="agent-label">
                              <span className="agent-mark" />
                              Themis is working…
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
                              Ask Themis
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="note-empty">
                    <textarea
                      className="text-input"
                      onChange={(event) => setDraftNote(event.target.value)}
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
                            const sourcePath = source?.kind.includes(" · ")
                              ? source.kind.split(" · ").slice(1).join(" · ")
                              : memo.path;
                            await createAnnotation(matterId, {
                              source_path: sourcePath,
                              citation: source?.id ?? "",
                              quote: source ? `…${source.quote.slice(0, 90)}…` : memo.title,
                              question: draftNote.trim(),
                              who: "Brian Harris",
                            });
                            setDraftNote("");
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
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Citation({
  n,
  active,
  onOpen,
  inline = true,
}: {
  n: string;
  active: boolean;
  onOpen: () => void;
  inline?: boolean;
}) {
  return (
    <button
      className="citation"
      onClick={onOpen}
      style={{
        background: active ? "var(--agent)" : "var(--agent-tint)",
        color: active ? "var(--paper)" : "var(--agent)",
        transform: inline ? "translateY(-2px)" : "none",
      }}
      type="button"
    >
      {n}
    </button>
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
