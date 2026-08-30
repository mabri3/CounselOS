"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDecisions, getMatters } from "@/lib/api";
import { askBriefingItem, connectBriefingItem, getBriefingConversation, getBriefingItem, getDigest, getIntelligenceSources, triageBriefingItem } from "@/lib/watchApi";
import { formatDateTime, formatShortDate } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";
import type { BriefingItem, Digest, DurableResult, WatchSource } from "@/lib/watchTypes";

type RawParams = Record<string, string | string[] | undefined>;

export default function BriefingReader({ itemId, digestId, returnQuery = {} }: { itemId?: string; digestId?: string; returnQuery?: RawParams }) {
  const [item, setItem] = useState<BriefingItem | null>(null); const [digest, setDigest] = useState<Digest | null>(null);
  const [digestItems, setDigestItems] = useState<BriefingItem[]>([]); const [catalog, setCatalog] = useState<WatchSource[]>([]);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const backHref = useMemo(() => { const params = new URLSearchParams(); for (const [key, value] of Object.entries(returnQuery)) for (const part of Array.isArray(value) ? value : value ? [value] : []) params.append(key, part); return `/briefing${params.size ? `?${params}` : ""}`; }, [returnQuery]);

  useEffect(() => { let live = true; setLoading(true); const load = digestId ? getDigest(digestId).then(async (value) => { const snapshots = await Promise.all(value.item_ids.map((id) => getBriefingItem(id).catch(() => null))); if (live) { setDigest(value); setDigestItems(snapshots.filter((entry): entry is BriefingItem => entry !== null)); } }) : getBriefingItem(itemId!).then((value) => live && setItem(value)); Promise.all([load, getIntelligenceSources().then((page) => live && setCatalog(page.items))]).catch((reason: unknown) => live && setError(message(reason))).finally(() => live && setLoading(false)); return () => { live = false; }; }, [digestId, itemId]);

  if (loading) return <main className="page"><div className="loading">Loading Briefing…</div></main>;
  if (error) return <main className="page"><div className="error" role="alert">{error}</div><Link className="btn" href={backHref}>Back to Briefing</Link></main>;
  if (digest) return <DigestReader digest={digest} items={digestItems} catalog={catalog} />;
  if (!item) return <main className="page"><div className="empty-state">This Briefing item is not available.</div></main>;
  return <ItemReader item={item} setItem={setItem} catalog={catalog} backHref={backHref} />;
}

function DigestReader({ digest, items, catalog }: { digest: Digest; items: BriefingItem[]; catalog: WatchSource[] }) {
  return <main className="page"><header className="page-header"><div><div className="eyebrow">Immutable digest · {formatDateTime(digest.created_at)}</div><h1 className="headline">{digest.title}</h1><p className="deck">{digest.summary}</p></div><Link className="btn" href="/briefing">Back to Briefing</Link></header>
    {digest.warnings.map((warning) => <div className="warning-callout" key={warning}>{warning}</div>)}
    <div className="reading-column stack-list" style={{ marginTop: 20 }}>{items.map((item) => <article className="card responsive-card" key={item.item_id} style={{ padding: 22 }}><div className="faint">{formatShortDate(item.published_at || item.created_at)} · {item.watch_id}</div><h2 style={{ font: "600 22px/1.3 var(--serif)", margin: "8px 0" }}>{item.title}</h2><p style={body}>{item.summary}</p><SourceList item={item} catalog={catalog} showEmpty={false} /><Link className="btn" href={`/briefing/${encodeURIComponent(item.item_id)}`}>Open current item</Link></article>)}</div>
    {items.some((item) => item.sources.length === 0) && <p className="faint">No cited sources</p>}
    {items.length < digest.item_ids.length && <div className="warning-callout" style={{ marginTop: 18 }}>Some current item records are unavailable. The digest record and its saved item IDs remain unchanged.</div>}
  </main>;
}

type BriefingTurn = { role: "user" | "assistant"; content: string; result?: DurableResult };
type ConnectionPicker =
  | { kind: "matter"; options: Matter[] }
  | { kind: "decision"; options: Decision[] }
  | null;

const BRIEFING_PROMPTS = [
  "Research this further",
  "Find related matters and decisions",
  "Connect this to a matter",
  "Connect this to a decision",
];

function ItemReader({ item, setItem, catalog, backHref }: { item: BriefingItem; setItem: (item: BriefingItem) => void; catalog: WatchSource[]; backHref: string }) {
  const [question, setQuestion] = useState(""); const [turns, setTurns] = useState<BriefingTurn[]>([]);
  const [picker, setPicker] = useState<ConnectionPicker>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function reloadConversation() {
    const page = await getBriefingConversation(item.item_id);
    setTurns(page.items.flatMap((result) => [
      ...(result.question ? [{ role: "user" as const, content: result.question }] : []),
      { role: "assistant" as const, content: result.text, result },
    ]));
  }
  useEffect(() => {
    let live = true;
    getBriefingConversation(item.item_id)
      .then((page) => live && setTurns(page.items.flatMap((result) => [
        ...(result.question ? [{ role: "user" as const, content: result.question }] : []),
        { role: "assistant" as const, content: result.text, result },
      ])))
      .catch((reason: unknown) => live && setError(message(reason)));
    return () => { live = false; };
  }, [item.item_id]);
  async function act<T>(action: () => Promise<T>, done: (value: T) => void) { setBusy(true); setError(""); try { done(await action()); } catch (reason) { setError(message(reason)); } finally { setBusy(false); } }
  async function ask(text: string) {
    const request = text.trim();
    if (!request || busy) return;
    const userTurn: BriefingTurn = { role: "user", content: request };
    setTurns((current) => [...current, userTurn]); setQuestion(""); setBusy(true); setError("");
    try {
      await askBriefingItem(item.item_id, { question: request });
      await reloadConversation();
    } catch (reason) {
      const failure = message(reason); setError(failure);
      setTurns((current) => [...current, { role: "assistant", content: failure }]);
    } finally { setBusy(false); }
  }
  async function usePrompt(prompt: string) {
    if (prompt === "Connect this to a matter") {
      setBusy(true); setError("");
      try {
        const { matters } = await getMatters();
        const linked = new Set(item.company_connection?.matters || []);
        setPicker({ kind: "matter", options: matters.filter((matter) => !linked.has(matter.matter_id)) });
      } catch (reason) { setError(message(reason)); } finally { setBusy(false); }
      return;
    }
    if (prompt === "Connect this to a decision") {
      setBusy(true); setError("");
      try {
        const { decisions } = await getDecisions();
        const linked = new Set(item.company_connection?.decisions || []);
        setPicker({ kind: "decision", options: decisions.filter((decision) => !linked.has(decision.decision_id)) });
      } catch (reason) { setError(message(reason)); } finally { setBusy(false); }
      return;
    }
    void ask(prompt);
  }
  async function connect(option: Matter | Decision) {
    if (busy || !picker) return;
    setBusy(true); setError("");
    try {
      const action = picker.kind === "matter"
        ? { action: "save_to_matter" as const, matter_id: (option as Matter).matter_id, expected_revision: item.revision }
        : { action: "connect_to_decision" as const, decision_id: (option as Decision).decision_id, expected_revision: item.revision };
      const updated = await connectBriefingItem(item.item_id, action);
      setItem(updated);
      await reloadConversation();
      setPicker(null);
    } catch (reason) { setError(message(reason)); } finally { setBusy(false); }
  }
  const sourceUrl = item.sources[0]?.canonical_url;
  return <main className="page"><header className="page-header"><div><div className="eyebrow">Briefing reader</div><h1 className="headline">{item.title}</h1><p className="deck">{item.summary}</p></div><Link className="btn" href={backHref}>Back to results</Link></header>
    {error && <div className="error" role="alert">{error}</div>}
    <div className="list-reader-layout">
      <article className="list-reader-list card responsive-card" style={{ padding: "24px clamp(18px, 4vw, 40px)" }}>
        <div className="btn-row" style={{ marginBottom: 20 }}><span className={item.read ? "state-label" : "state-label state-attention"}>{item.read ? "Read" : "Unread"}</span>{item.saved && <span className="state-label state-healthy">Saved</span>}<span className="state-label state-agent">Themis · Not reviewed</span></div>
        <Section title="Why this appeared"><p style={body}>{item.why_shown}</p></Section>
        <Section title="Status and timing"><dl style={facts}><dt>Legal status</dt><dd>{item.legal_status}</dd><dt>Published</dt><dd>{formatShortDate(item.published_at)}</dd><dt>Effective</dt><dd>{formatShortDate(item.effective_at)}</dd><dt>Potential impact</dt><dd>{item.potential_impact || "Not assessed"}</dd></dl></Section>
        <Section title="Company connection">{item.company_connection ? <><p style={body}>{item.company_connection.reason}</p><dl style={facts}><dt>Products</dt><dd>{join(item.company_connection.products)}</dd><dt>Matters</dt><dd>{join(item.company_connection.matters)}</dd><dt>Decisions</dt><dd>{join(item.company_connection.decisions)}</dd><dt>Mitigations</dt><dd>{join(item.company_connection.mitigations)}</dd></dl></> : <p className="faint">No stored company connection.</p>}</Section>
        <Section title="Sources"><SourceList item={item} catalog={catalog} /></Section>
        <Section title="Stored provenance"><dl style={facts}><dt>Item record</dt><dd>{item.path}</dd><dt>Development</dt><dd>{item.development_id}</dd><dt>Watch</dt><dd>{item.watch_id}</dd><dt>Created</dt><dd>{formatDateTime(item.created_at)}</dd><dt>Updated</dt><dd>{formatDateTime(item.updated_at)}</dd></dl></Section>
      </article>
      <aside className="list-reader-reader stack-list" aria-label="Briefing item actions">
        <section className="card responsive-card" style={{ padding: 18 }}><h2 style={sideHeading}>Actions</h2><div className="btn-row">{sourceUrl && <a className="btn primary" href={sourceUrl} rel="noreferrer" target="_blank">Read source</a>}<button className="btn" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, read: !item.read }), setItem)}>{item.read ? "Mark unread" : "Mark read"}</button><button className="btn" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, saved: !item.saved }), setItem)}>{item.saved ? "Remove saved" : "Save for later"}</button><button className="btn" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, usefulness: "not_useful" }), setItem)}>Not useful</button></div></section>
        <section className="card responsive-card wash-agent" style={{ padding: 18, borderStyle: "dashed" }}>
          <span className="state-label state-agent">Themis · Not reviewed</span><h2 style={sideHeading}>Ask CounselOS</h2><p className="faint">Ask for analysis, more research, or a connection. This Briefing item stays in context.</p>
          {turns.length ? <div className="thread" style={{ margin: "16px 0" }}>{turns.map((turn, index) => turn.role === "user" ? <div className="bubble-you" key={index}>{turn.content}</div> : <div className="assistant-message" key={index}><div className="agent-label">Themis · Not reviewed</div><div className="bubble-agent"><ReactMarkdown remarkPlugins={[remarkGfm]}>{turn.content}</ReactMarkdown>{turn.result?.warnings.map((warning) => <div className="warning-callout" key={warning}>{warning}</div>)}{turn.result?.sources.length ? <details><summary>Sources used ({turn.result.sources.length})</summary>{turn.result.sources.map((source) => <div key={source.canonical_url}><a href={source.canonical_url} rel="noreferrer" target="_blank">{source.title}</a></div>)}</details> : null}</div></div>)}</div> : null}
          <div className="composer-suggestions">{BRIEFING_PROMPTS.map((prompt) => <button className="suggestion" disabled={busy} key={prompt} onClick={() => void usePrompt(prompt)}>{prompt}</button>)}</div>
          {picker ? <div className="card" style={{ margin: "12px 0", padding: 12 }} aria-label={`Choose a ${picker.kind}`}>
            <div className="field-label">Choose a {picker.kind}</div>
            {picker.options.length ? <div className="stack-list" style={{ marginTop: 8 }}>{picker.options.map((option) => <button className="btn" disabled={busy} key={picker.kind === "matter" ? (option as Matter).matter_id : (option as Decision).decision_id} onClick={() => void connect(option)} style={{ textAlign: "left" }}><strong>{option.title}</strong><span className="faint" style={{ display: "block", marginTop: 3 }}>{picker.kind === "matter" ? `${(option as Matter).product_area} · ${plainState((option as Matter).status)}` : `${plainState((option as Decision).review_status)} · ${formatShortDate((option as Decision).decided_at)}`}</span></button>)}</div> : <div className="empty-state" style={{ marginTop: 8 }}>No unlinked {picker.kind === "matter" ? "matters" : "decisions"} are available.</div>}
            <button className="btn compact" disabled={busy} onClick={() => setPicker(null)} style={{ marginTop: 10 }}>Cancel</button>
          </div> : null}
          <textarea aria-label="Ask CounselOS about this Briefing item" className="text-input" onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(question); } }} placeholder="Ask a question about this Briefing item…" rows={3} value={question} />
          <button className="btn agent" disabled={busy || !question.trim()} style={{ marginTop: 10 }} onClick={() => void ask(question)}>{busy ? "Working…" : "Send"}</button>
        </section>
      </aside>
    </div>
  </main>;
}

function SourceList({ item, catalog, showEmpty = true }: { item: BriefingItem; catalog: WatchSource[]; showEmpty?: boolean }) {
  if (!item.sources.length) return showEmpty ? <p className="faint">No cited sources</p> : null;
  return <div className="stack-list">{item.sources.map((source) => { const stored = catalog.find((entry) => entry.canonical_url === source.canonical_url); return <div key={`${source.canonical_url}-${source.locator}`} style={{ padding: "13px 0", borderBottom: "1px solid var(--line-hair)" }}><a href={source.canonical_url} rel="noreferrer" target="_blank"><strong>{source.title}</strong></a><div className="faint" style={{ marginTop: 5 }}>{source.publisher} · {supportLabel(source.support_state)}{stored ? ` · ${typeLabel(stored.source_type)} · ${roleLabel(stored.role)}` : " · Source type and Watch role not stored here"}</div>{source.locator && <div className="faint">Locator: {source.locator}</div>}{source.excerpt && <p style={body}>{source.excerpt}</p>}{source.warning && <div className="warning-callout">{source.warning}</div>}</div>; })}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section style={{ marginBottom: 30 }}><h2 style={{ font: "600 21px var(--serif)", margin: "0 0 10px" }}>{title}</h2>{children}</section>; }
const body = { font: "400 16px/1.65 var(--serif)", color: "var(--ink-2)" };
const sideHeading = { font: "600 18px var(--serif)", margin: "12px 0 8px" };
const facts = { display: "grid", gridTemplateColumns: "minmax(110px, .5fr) minmax(0, 1.5fr)", gap: "8px 16px", margin: 0, font: "400 14px/1.5 var(--sans)" };
function join(values: string[]) { return values.length ? values.join(", ") : "None stored"; }
function supportLabel(value: string) { return ({ supplied: "Supplied source", retrieved: "Retrieved source", verified: "Verified source", unverified_lead: "Unverified lead" } as Record<string, string>)[value] || value; }
function typeLabel(value: string) { return value.replaceAll("_", " "); } function roleLabel(value: string) { return value.replaceAll("_", " "); }
function plainState(value: string) { return value.replaceAll("_", " "); }
function message(reason: unknown): string { return reason instanceof Error ? reason.message : "The Briefing request failed."; }
