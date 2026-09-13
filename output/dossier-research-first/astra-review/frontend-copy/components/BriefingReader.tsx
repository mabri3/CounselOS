"use client";

import Link from "next/link";
import styles from "./BriefingPhase2.module.css";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AppShell from "@/components/AppShell";
import { getDecisions, getMatters } from "@/lib/api";
import { askBriefingItem, connectBriefingItem, getBriefingConversation, getBriefingItem, getDigest, getIntelligenceSources, getWatches, triageBriefingItem } from "@/lib/watchApi";
import { formatDateTime, formatShortDate } from "@/lib/design";
import type { Decision, Matter } from "@/lib/types";
import type { BriefingItem, Digest, DurableResult, WatchSource } from "@/lib/watchTypes";

type RawParams = Record<string, string | string[] | undefined>;

export default function BriefingReader({ itemId, digestId, returnQuery = {} }: { itemId?: string; digestId?: string; returnQuery?: RawParams }) {
  const [item, setItem] = useState<BriefingItem | null>(null); const [digest, setDigest] = useState<Digest | null>(null);
  const [digestItems, setDigestItems] = useState<BriefingItem[]>([]); const [catalog, setCatalog] = useState<WatchSource[]>([]);
  const [watchNames, setWatchNames] = useState<Record<string, string>>({});
  const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const backHref = useMemo(() => { const params = new URLSearchParams(); for (const [key, value] of Object.entries(returnQuery)) for (const part of Array.isArray(value) ? value : value ? [value] : []) params.append(key, part); return `/briefing${params.size ? `?${params}` : ""}`; }, [returnQuery]);

  useEffect(() => { let live = true; setLoading(true); const load = digestId ? getDigest(digestId).then(async (value) => { const snapshots = await Promise.all(value.item_ids.map((id) => getBriefingItem(id).catch(() => null))); if (live) { setDigest(value); setDigestItems(snapshots.filter((entry): entry is BriefingItem => entry !== null)); } }) : getBriefingItem(itemId!).then((value) => live && setItem(value)); Promise.all([load, getIntelligenceSources().then((page) => live && setCatalog(page.items)).catch(() => undefined)]).catch((reason: unknown) => live && setError(message(reason))).finally(() => live && setLoading(false)); return () => { live = false; }; }, [digestId, itemId]);

  /* Watch titles are orientation only. A failure here never blocks the record. */
  useEffect(() => {
    let live = true;
    getWatches({ limit: 100 })
      .then((page) => live && setWatchNames(Object.fromEntries(page.items.map((watch) => [watch.watch_id, watch.title]))))
      .catch(() => undefined);
    return () => { live = false; };
  }, []);

  if (loading) return <AppShell><main className="page"><div className="loading">Loading Briefing…</div></main></AppShell>;
  if (error) return <AppShell><main className="page"><div className="error" role="alert">{error}</div><Link className="btn" href={backHref}>Back to Briefing</Link></main></AppShell>;
  if (digest) return <AppShell><DigestReader digest={digest} items={digestItems} catalog={catalog} watchNames={watchNames} /></AppShell>;
  if (!item) return <AppShell><main className="page"><div className="empty-state">This Briefing item is not available.</div></main></AppShell>;
  return <AppShell><ItemReader item={item} setItem={setItem} catalog={catalog} backHref={backHref} watchNames={watchNames} /></AppShell>;
}

function DigestReader({ digest, items, catalog, watchNames }: { digest: Digest; items: BriefingItem[]; catalog: WatchSource[]; watchNames: Record<string, string> }) {
  return <main className={styles.digest}>
    <div className="reader-back"><Link href="/briefing">← Back to Briefing</Link></div>
    <header className="reader-head">
      <div className="eyebrow">Digest · frozen {formatDateTime(digest.created_at)}</div>
      <div className={styles.digestTitle}><h1 className="reader-title">{digest.title}</h1><div className={styles.savedIdentity}>Saved view<strong>{digest.view_name}</strong></div></div>
    </header>
    <p className={styles.fixedNotice}>The saved digest record is fixed. Links below open current item records.</p>
    <section className={styles.digestSummary}><div className="state-label state-agent">Agent work · Digest summary</div><p>{digest.summary}</p><span>{formatDateTime(digest.created_at)}</span></section>
    {digest.warnings.map((warning) => <div className="warning-callout" key={warning}>{warning}</div>)}
    <div className={styles.digestItems}>
      {digest.item_ids.map((id, index) => {
        const item = items.find((entry) => entry.item_id === id);
        return <article className={styles.digestItem} key={id}>
          <div className={styles.digestItemMeta}><span className={styles.sequence}>{index + 1}</span><div>{item ? formatShortDate(item.published_at || item.created_at) : "Date unavailable"}<p>{item ? watchNames[item.watch_id] ?? item.watch_id : "Current record missing"}</p></div></div>
          <div><h2>{item?.title ?? "Current item unavailable"}</h2><p>{item?.summary ?? "The saved digest still includes this item. Its current record could not be loaded."}</p>
            {item ? <><details className={styles.digestSources}><summary>Source support · {item.sources.length ? [...new Set(item.sources.map((source) => supportLabel(source.support_state)))].join(", ") : "No cited sources"}</summary><SourceList item={item} catalog={catalog} showEmpty={false} /></details><Link href={`/briefing/${encodeURIComponent(id)}`}>Open the current item →</Link></> : <span className="state-label state-attention">Unavailable</span>}
          </div>
        </article>;
      })}
    </div>
    <details className="reader-details"><summary>Digest metadata &amp; item list</summary><p>Created {formatDateTime(digest.created_at)}</p><ul>{digest.item_ids.map((id) => <li key={id}>{id}</li>)}</ul></details>
    <details className="reader-details"><summary>Saved view details</summary><p>{digest.view_name}</p></details>
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

const IMPACT_WORD: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

function ItemReader({ item, setItem, catalog, backHref, watchNames }: { item: BriefingItem; setItem: (item: BriefingItem) => void; catalog: WatchSource[]; backHref: string; watchNames: Record<string, string> }) {
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
  const needsReview = item.attention_state === "required" && Boolean(item.review_packet_id);
  const connection = item.company_connection;

  return <main className={styles.reader}>
    <div className="reader-back"><Link href={backHref}>← Back to Briefing</Link></div>

    <header className="reader-head">
      <div className="eyebrow">Briefing · {watchNames[item.watch_id] ?? item.watch_id}</div>
      <h1 className="reader-title">{item.title}</h1>
      <p className="reader-summary">{item.summary}</p>
      <div className="reader-states">
        {needsReview ? <span className="state-label state-attention">Needs your review</span> : <span className="state-label state-quiet">Reading only — no action required</span>}
        <span className={item.read ? "state-label state-quiet" : "state-label state-plain"}>{item.read ? "Read" : "Unread"}</span>
        {item.saved ? <span className="state-label state-quiet">Saved</span> : null}
      </div>
      <dl className="reader-facts">
        <div className="reader-fact"><dt>Published</dt><dd>{formatShortDate(item.published_at)}</dd></div>
        <div className="reader-fact"><dt>Takes effect</dt><dd>{item.effective_at ? formatShortDate(item.effective_at) : "No date given"}</dd></div>
        <div className="reader-fact"><dt>Potential impact</dt><dd>{item.potential_impact ? IMPACT_WORD[item.potential_impact] ?? item.potential_impact : "Not assessed"}</dd></div>
        <div className="reader-fact"><dt>Jurisdiction</dt><dd className="plain">{item.jurisdictions.length ? item.jurisdictions.join(", ") : "Not stated"}</dd></div>
        <div className="reader-fact"><dt>Legal status</dt><dd className="plain">{item.legal_status}</dd></div>
      </dl>
    </header>

    {error && <div className="error" role="alert">{error}</div>}

    <div className={styles.readerBody}>
      <article className="work-main">
        <section className="reader-section"><h2>What changed</h2><p className="reader-prose">{item.summary}</p></section>
        <section className="reader-section" aria-label="Why this appeared">
          <h2>Why this was shown</h2>
          <p className="reader-prose">{item.why_shown}</p>
        </section>

        <section className="reader-section">
          <h2>Connection to your work</h2>
          {connection ? <>
            <p className="reader-prose" style={{ marginBottom: 14 }}>{connection.reason}</p>
            <dl className="reader-grid">
              <dt>Products</dt><dd>{join(connection.products)}</dd>
              <dt>Matters</dt><dd>{join(connection.matters)}</dd>
              <dt>Recorded decisions</dt><dd>{join(connection.decisions)}</dd>
              <dt>Mitigations</dt><dd>{join(connection.mitigations)}</dd>
            </dl>
          </> : <p className="reader-prose">
            Nothing at your company is connected to this development in the record. It is here as background.
          </p>}
        </section>

        <section className="reader-section">
          <h2>Sources</h2>
          <p className="reader-section-help">
            Supplied and Retrieved mean a source was named or fetched. Only Verified means it was checked against the claim.
          </p>
          <SourceList item={item} catalog={catalog} />
        </section>

        <details className="reader-details">
          <summary>Stored provenance</summary>
          <dl className="reader-grid">
            <dt>Item record</dt><dd>{item.path}</dd>
            <dt>Development</dt><dd>{item.development_id}</dd>
            <dt>Watch</dt><dd>{item.watch_id}</dd>
            <dt>Created</dt><dd>{formatDateTime(item.created_at)}</dd>
            <dt>Updated</dt><dd>{formatDateTime(item.updated_at)}</dd>
          </dl>
        </details>
      </article>

      <aside className="work-rail" aria-label="What you can do with this item">
        <section className="rail-card">
          <h2 className="rail-card-title">What you can do</h2>
          <p className="rail-card-help">Triage is yours alone. None of this changes a matter or a recorded decision.</p>
          <div className="action-list">
            <button className="btn primary" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, read: !item.read }), setItem)}>{item.read ? "Mark as unread" : "Mark as read"}</button>
            <button className="btn" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, saved: !item.saved }), setItem)}>{item.saved ? "Remove from saved" : "Save for later"}</button>
            <button className="btn" disabled={busy} onClick={() => act(() => triageBriefingItem(item.item_id, { expected_revision: item.revision, usefulness: "not_useful" }), setItem)}>Not useful</button>
            {sourceUrl && <a className="btn" href={sourceUrl} rel="noreferrer" target="_blank">Open original ↗</a>}
          </div>
          <p className="rail-card-help" style={{ marginTop: 11 }}>
            <strong>Not useful</strong> records your judgment on this item. It does not delete it.
          </p>
        </section>

        <section className="rail-card wash-agent ask-panel">
          <span className="state-label state-agent">Themis.ai</span>
          <h2 className="rail-card-title" style={{ marginTop: 12 }}>Themis.ai conversation</h2>
          <p className="rail-card-help">Themis.ai keeps this item in context. Answers are drafts for you to judge — they are never recorded decisions.</p>
          {turns.length ? <div className="ask-thread">{turns.map((turn, index) => turn.role === "user" ? <div className="bubble-you" key={index}>{turn.content}</div> : <div className="assistant-message" key={index}><div className="agent-label">Themis.ai</div><div className="bubble-agent"><ReactMarkdown remarkPlugins={[remarkGfm]}>{turn.content}</ReactMarkdown>{turn.result?.warnings.map((warning) => <div className="warning-callout" key={warning}>{warning}</div>)}{turn.result?.sources.length ? <details><summary>Sources used ({turn.result.sources.length})</summary>{turn.result.sources.map((source) => <div key={source.canonical_url}><a href={source.canonical_url} rel="noreferrer" target="_blank">{source.title}</a></div>)}</details> : null}</div></div>)}</div> : null}
          <div className="composer-suggestions" style={{ marginTop: 13 }}>{BRIEFING_PROMPTS.map((prompt) => <button className="suggestion" disabled={busy} key={prompt} onClick={() => void usePrompt(prompt)} type="button">{prompt}</button>)}</div>
          {picker ? <div className="card" style={{ margin: "12px 0", padding: 12 }} aria-label={`Choose a ${picker.kind}`}>
            <div className="field-label">Choose a {picker.kind}</div>
            {picker.options.length ? <div className="stack-list" style={{ marginTop: 8 }}>{picker.options.map((option) => <button className="btn" disabled={busy} key={picker.kind === "matter" ? (option as Matter).matter_id : (option as Decision).decision_id} onClick={() => void connect(option)} style={{ textAlign: "left" }} type="button"><strong>{option.title}</strong><span className="faint" style={{ display: "block", marginTop: 3 }}>{picker.kind === "matter" ? `${(option as Matter).product_area} · ${plainState((option as Matter).status)}` : `${plainState((option as Decision).review_status)} · ${formatShortDate((option as Decision).decided_at)}`}</span></button>)}</div> : <div className="empty-state" style={{ marginTop: 8 }}>No unlinked {picker.kind === "matter" ? "matters" : "decisions"} are available.</div>}
            <button className="btn compact" disabled={busy} onClick={() => setPicker(null)} style={{ marginTop: 10 }} type="button">Cancel</button>
          </div> : null}
          <textarea aria-label="Ask about this Briefing item" className="text-input" onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void ask(question); } }} placeholder="Ask a question about this development…" rows={3} value={question} />
          <button className="btn agent" disabled={busy || !question.trim()} style={{ marginTop: 10, width: "100%" }} onClick={() => void ask(question)} type="button">{busy ? "Working…" : "Ask Themis.ai"}</button>
        </section>
      </aside>
    </div>
  </main>;
}

function SourceList({ item, catalog, showEmpty = true }: { item: BriefingItem; catalog: WatchSource[]; showEmpty?: boolean }) {
  if (!item.sources.length) return showEmpty ? <p className="faint">No cited sources</p> : null;
  return <div>{item.sources.map((source) => {
    const stored = catalog.find((entry) => entry.canonical_url === source.canonical_url);
    return <div className="source-entry" key={`${source.canonical_url}-${source.locator}`}>
      <a href={source.canonical_url} rel="noreferrer" target="_blank"><span className="source-entry-title">{source.title}</span></a>
      <div className="source-entry-meta">
        <span className="state-label state-quiet">{supportLabel(source.support_state)}</span>
        {source.publisher ? <span className="briefing-item-status">{source.publisher}</span> : null}
        {stored ? <span className="briefing-item-status">{typeLabel(stored.source_type)} · Watch role: {roleLabel(stored.role)}</span> : null}
      </div>
      {!stored ? <div className="source-entry-note">Source type and Watch role are not stored for this source.</div> : null}
      {source.locator && <div className="source-entry-note">Locator: {source.locator}</div>}
      {source.excerpt && <p className="source-entry-excerpt">{source.excerpt}</p>}
      {source.warning && <div className="warning-callout" style={{ marginTop: 10 }}>{source.warning}</div>}
    </div>;
  })}</div>;
}

function join(values: string[]) { return values.length ? values.join(", ") : "None recorded"; }
function supportLabel(value: string) { return ({ supplied: "Supplied source", retrieved: "Retrieved source", verified: "Verified source", unverified_lead: "Unverified lead" } as Record<string, string>)[value] || value; }
function typeLabel(value: string) { return value.replaceAll("_", " "); } function roleLabel(value: string) { return value.replaceAll("_", " "); }
function plainState(value: string) { return value.replaceAll("_", " "); }
function message(reason: unknown): string { return reason instanceof Error ? reason.message : "The Briefing request failed."; }
