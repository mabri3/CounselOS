"use client";
import SolutionPaths from "../workspace/SolutionPaths";
import ProblemBreakdown from "../workspace/ProblemBreakdown";

import ExperimentalNextSteps from "./ExperimentalNextSteps";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cancelChatRun, createMatter, getChatRun, getChatRuns, getConversation, getConversations, getMatter, getMatters, request, retryChatRun, startChatRun, uploadDocuments } from "@/lib/api";
import { continuityKey, useContinuityIdentity } from "@/lib/continuityApi";
import { getWorkspace } from "@/lib/workspaceApi";
import { isSafeVaultPath } from "@/lib/research";
import type { ActionActor } from "@/lib/continuityTypes";
import type { AttachmentReference, CardAction, ChatConversation, ChatConversationSummary, ChatHistoryMessage, ChatRun, Matter, MatterDetail } from "@/lib/types";
import type { ConversationTarget, DocumentIdentity, LocalEditorSnapshot, WorkspaceSnapshot } from "@/lib/workspaceTypes";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import ChatCards from "@/components/ChatCards";
import NewMatterForm from "@/components/NewMatterForm";
import ExperimentalDocument from "./ExperimentalDocument";
import ExperimentalIntake from "./ExperimentalIntake";
import ExperimentalSkills from "./ExperimentalSkills";
import ExperimentalModelPicker, { type ChatModelSelection } from "./ExperimentalModelPicker";
import { GlobalNavigationMenu } from "@/components/AppShell";
import { contextSelections, documentContext, followActive, freezeMessageContext, type MessageContext } from "./messageContext";
import styles from "./ExperimentalChat.module.css";
import { proseWithoutRepeatedQuestion } from "./questionPresentation";
import { mergeBackgroundDraft } from "@/lib/dossierRequests";
type Conversation = ChatConversationSummary & {
    conversation_kind?: string;
};
type Message = ChatHistoryMessage & {
    workspace_submission?: {
        target?: ConversationTarget;
        context_selections?: {
            path?: string;
            revision?: string;
        }[];
    };
};
type Origin = {
    path: string;
    commentId?: string;
    scroll: number;
};
const emptyContext = (): MessageContext => ({ documents: [], locked: false });
const running = (run: ChatRun | null) => !!run && ["queued", "running"].includes(run.state);
export default function ExperimentalChat() {
    const { identity, error: identityError } = useContinuityIdentity();
    const [matters, setMatters] = useState<Matter[]>([]);
    const [matterId, setMatterId] = useState("");
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);
    const [intakeMatterId, setIntakeMatterId] = useState<string | null>(null);
    const intakeDialog = useRef<HTMLDialogElement>(null);
    const [matterSearch, setMatterSearch] = useState("");
    const [navigationOpen, setNavigationOpen] = useState(true);
    useEffect(() => { if (window.matchMedia("(max-width: 850px)").matches) setNavigationOpen(false); }, []);
    useEffect(() => { if (!identity)
        return; void getMatters().then(value => { setMatters(value.matters); const requested = new URLSearchParams(location.search).get("matter"); if (requested && value.matters.some(m => m.matter_id === requested))
        setMatterId(requested); }).catch(e => setError(e.message)); }, [identity]);
    return <div className={`${styles.root} ${!navigationOpen ? styles.navigationClosed : ""}`} onPointerDown={event => { event.currentTarget.querySelectorAll<HTMLDetailsElement>("details[name=experimental-tools][open]").forEach(menu => { if (!menu.contains(event.target as Node)) menu.open = false; }); }}><dialog ref={intakeDialog} className={styles.intakeDialog} aria-label="Create a new matter" onCancel={event => { if (creating) event.preventDefault(); }}><NewMatterForm onClose={() => intakeDialog.current?.close()} busy={creating} onCreate={async (payload) => { setCreating(true); try {
        const saved = await createMatter(payload);
        setMatters(current => [saved, ...current]);
        setIntakeMatterId(saved.matter_id);
        setMatterId(saved.matter_id);
        intakeDialog.current?.close();
        if (window.matchMedia("(max-width: 850px)").matches) setNavigationOpen(false);
        history.replaceState(null, "", `?matter=${encodeURIComponent(saved.matter_id)}`);
    }
    finally {
        setCreating(false);
    } }}/></dialog><header className={styles.topbar}><div className={styles.row}><button className={styles.navigationToggle} aria-label="Toggle matter navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(value => !value)}>☰</button><GlobalNavigationMenu className={styles.globalNav} pathname="/experimental/chat"/><span className={styles.experimentBadge}>Experimental chat</span></div><Link href="/matters">Back to workspace <span aria-hidden="true">↗</span></Link></header>{(error || identityError) && <p role="alert" className={styles.error}>{error || identityError}</p>}<div className={styles.layout}><aside className={styles.sidebar} hidden={!navigationOpen}><div className={styles.sidebarHeading}><strong>Your matters</strong><span>{matters.length}</span></div><input className={styles.search} type="search" aria-label="Find a matter" placeholder="Find a matter…" value={matterSearch} onChange={event => setMatterSearch(event.target.value)}/><nav className={styles.matterList} aria-label="Matters">{matters.filter(matter => matter.title.toLowerCase().includes(matterSearch.toLowerCase())).map(matter => <button key={matter.matter_id} aria-pressed={matterId === matter.matter_id} onClick={() => { if (window.matchMedia("(max-width: 850px)").matches) setNavigationOpen(false); setMatterId(matter.matter_id); history.replaceState(null, "", `?matter=${encodeURIComponent(matter.matter_id)}`); }}>{matter.title}</button>)}</nav><Link className={styles.newMatterButton} href="/matters/storage">Archive &amp; trash</Link><button className={styles.newMatterButton} onClick={() => intakeDialog.current?.showModal()}><span aria-hidden="true">＋</span> New matter</button></aside><main className={styles.main}>{identity && matterId ? <MatterChat key={`${identity.roster.vault_key}:${identity.actor.person_id}:${matterId}`} matterId={matterId} knownMatters={matters} startIntake={intakeMatterId === matterId} onIntakeStarted={() => setIntakeMatterId(null)} actor={identity.actor} storageKey={continuityKey(identity.roster.vault_key, identity.actor.person_id, matterId, "experimental-chat")}/> : <div className={styles.landing}><span className={styles.eyebrow}>A clearer way through the work</span><h1>Let’s work through it.</h1><p>Choose a matter to ask a question, explore an issue, or shape a draft.</p>{!identity && <p>Loading workspace…</p>}</div>}</main></div></div>;
}
function MatterChat({ matterId, knownMatters, actor, storageKey, startIntake, onIntakeStarted }: {
    knownMatters: Matter[];
    startIntake: boolean;
    onIntakeStarted: () => void;
    matterId: string;
    actor: ActionActor;
    storageKey: string;
}) {
    const [modelSelection, setModelSelection] = useState<ChatModelSelection | null>(null);
    useEffect(() => { try { setModelSelection(JSON.parse(localStorage.getItem(`${storageKey}:model`) || "null")); } catch { setModelSelection(null); } }, [storageKey]);
    function chooseModel(value: ChatModelSelection | null) {
        setModelSelection(value);
        try { localStorage.setItem(`${storageKey}:model`, JSON.stringify(value)); } catch { setError("Model selected for this page. It could not be saved for reload."); }
    }
    const [detail, setDetail] = useState<MatterDetail | null>(null);
    const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const activeConversation = useRef(conversationId);
    activeConversation.current = conversationId;
    const preserveResearchScroll = useRef(false);
    const [intakeState, setIntakeState] = useState<"active" | "complete" | null>(null);
    function showConversation(saved: ChatConversation | null) {
        setMessages(saved?.messages ?? []);
        setIntakeState(saved?.intake_state ?? null);
    }
    const [input, setInput] = useState("");
    useEffect(() => {
        const receive = (event: Event) => {
            const detail = (event as CustomEvent<{ matterId?: string; conversationId?: string; text?: string }>).detail;
            if (detail?.matterId !== matterId || detail.conversationId !== activeConversation.current || !detail.text) return;
            setInput(current => mergeBackgroundDraft(current, detail.text!));
            inputRef.current?.focus();
        };
        window.addEventListener("themis-dossier-follow-up", receive);
        return () => window.removeEventListener("themis-dossier-follow-up", receive);
    }, [matterId]);
    const [context, setContext] = useState<MessageContext>(emptyContext);
    const [openDocs, setOpenDocs] = useState<DocumentIdentity[]>([]);
    const [activePath, setActivePath] = useState<string | null>(null);
    const [origins, setOrigins] = useState<Record<string, Origin>>({});
    const [run, setRun] = useState<ChatRun | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState<AttachmentReference[]>([]);
    const [uploading, setUploading] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [pollAttempt, setPollAttempt] = useState(0);
    const snapshots = useRef<Record<string, LocalEditorSnapshot>>({});
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const conversationScroll = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (preserveResearchScroll.current) { preserveResearchScroll.current = false; return; }
        const scroll = conversationScroll.current;
        if (!scroll) return;
        const latest = messages.at(-1);
        if (latest?.role === "assistant" && latest.cards?.some(card => card.type === "question")) {
            scroll.querySelector("article:last-child")?.scrollIntoView({ block: "start", behavior: "smooth" });
        } else scroll.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" });
    }, [messages.length]);
    const mounted = useRef(true);
    const busyRef = useRef(false);
    const operation = useRef(0);
    const pendingOrigin = useRef<Origin | null>(null);
    const pendingCommand = useRef<{
        signature: string;
        key: string;
    } | null>(null);
    const busy = submitting || running(run);
    const documents = workspace?.documents ?? [];
    const active = documents.find(doc => doc.path === activePath) ?? openDocs.find(doc => doc.path === activePath);
    const draftKey = `${storageKey}:draft:${conversationId ?? "new"}`;
    useEffect(()=>{if(active)setContext(current=>followActive(current,documentContext(matterId,active,snapshots.current[active.document_id])));},[active?.path,active?.revision,matterId]);
    const initialized = useRef(false);
    const sceneReady = useRef(false);
    const [draftReady, setDraftReady] = useState<string | null>(null);
    const loadWorkspace = useCallback(async () => { const [matter, next, list] = await Promise.all([getMatter(matterId), getWorkspace(matterId), getConversations(matterId)]); if (!mounted.current)
        return; setDetail(matter); setWorkspace(next); setConversations((list.conversations as Conversation[]).filter(c => c.conversation_kind === "experimental")); setRefresh(x => x + 1); if (!sceneReady.current) {
        sceneReady.current = true;
        try {
            const scene = JSON.parse(localStorage.getItem(`${storageKey}:documents`) || "null");
            if (scene) {
                setOpenDocs((next.documents ?? []).filter(doc => scene.paths?.includes(doc.path)));
                setActivePath((next.documents ?? []).some(doc => doc.path === scene.activePath) ? scene.activePath : null);
                setOrigins(scene.origins ?? {});
            }
        }
        catch {
            setError("The previous document layout could not be restored.");
        }
    } return next; }, [matterId, storageKey]);
    useEffect(() => { let cancelled = false; mounted.current = true; void (async () => { try {
        await loadWorkspace();
        if (cancelled) return;
        const savedId = localStorage.getItem(`${storageKey}:conversation`);
        if (savedId) {
            const saved = await getConversation(matterId, savedId);
            if (cancelled || !mounted.current)
                return;
            setConversationId(savedId);
            showConversation(saved);
            const runs = await getChatRuns(matterId, savedId);
            if (!cancelled && mounted.current) {
                const activeRun = runs.find(r => running(r)) ?? null;
                try {
                    const savedOrigin = JSON.parse(localStorage.getItem(`${storageKey}:run-origin`) || "null");
                    if (activeRun && savedOrigin?.runId === activeRun.run_id) pendingOrigin.current = savedOrigin.origin;
                } catch { /* Saved work remains recoverable without a local return point. */ }
                setRun(activeRun);
            }
        }
    }
    catch (e) {
        if (!cancelled && mounted.current)
            setError(e instanceof Error ? e.message : "Could not load matter.");
    }
    finally {
        if (!cancelled && mounted.current)
            setLoading(false);
    } })(); return () => { cancelled = true; mounted.current = false; operation.current++; }; }, [loadWorkspace, matterId, storageKey]);
    useEffect(() => { if (loading)
        return; try {
        const saved = JSON.parse(localStorage.getItem(draftKey) || "null");
        setInput(saved?.input ?? "");
        setContext(saved?.context ?? emptyContext());
        setAttachments(saved?.attachments ?? []);
    }
    catch {
        setError("The saved local message could not be restored.");
    } initialized.current = true; setDraftReady(draftKey); }, [loading, draftKey]);
    useEffect(() => { if (!initialized.current || loading || draftReady !== draftKey)
        return; try {
        localStorage.setItem(draftKey, JSON.stringify({ input, context, attachments }));
    }
    catch {
        setError("Local message recovery could not save. Keep this page open until you send.");
    } }, [input, context, attachments, draftKey, loading, draftReady]);
    useEffect(() => { if (!sceneReady.current)
        return; try {
        localStorage.setItem(`${storageKey}:documents`, JSON.stringify({ paths: openDocs.map(doc => doc.path), activePath, origins }));
    }
    catch {
        setError("The document layout could not be saved locally.");
    } }, [openDocs, activePath, origins, storageKey]);
    function openDocument(path: string, available = documents, origin?: Origin) { const doc = available.find(item => item.path === path); if (!doc) {
        const sourceMatter = isSafeVaultPath(path) ? knownMatters.find(item => item.matter_id !== matterId && path.startsWith(`${item.path}/`)) : undefined;
        if (sourceMatter) {
            window.open(`/matters/${encodeURIComponent(sourceMatter.matter_id)}?view=draft&file=${encodeURIComponent(path)}`, "_blank", "noopener,noreferrer");
            return;
        }
        setError("The linked document is unavailable. Refresh the matter to try again.");
        return;
    } setOpenDocs(current => current.some(item => item.path === path) ? current : [...current, doc]); setActivePath(path); setContext(current => followActive(current, documentContext(matterId, doc, snapshots.current[doc.document_id]))); if (origin && origin.path !== path)
        setOrigins(current => ({ ...current, [path]: origin })); }
    const openRef = useRef(openDocument);
    openRef.current = openDocument;
    const loadRef = useRef(loadWorkspace);
    loadRef.current = loadWorkspace;
    useEffect(() => { if (!run || !running(run))
        return; let cancelled = false; let timer: ReturnType<typeof setTimeout>; const runId = run.run_id; async function poll() { try {
        const next = await getChatRun(matterId, runId);
        if (cancelled)
            return;
        if (next.conversation_id) {
            const history = await getConversation(matterId, next.conversation_id);
            if (cancelled)
                return;
            showConversation(history);
        }
        if (!running(next)) {
            const latest = await loadRef.current();
            if (cancelled)
                return;
            const path = next.response?.cards.find(card => card.type === "work_product")?.vault_path;
            if (path && latest)
                openRef.current(path, latest.documents, pendingOrigin.current ?? undefined);
            pendingOrigin.current = null;
            setRun(next);
            return;
        }
        setRun(next);
        timer = setTimeout(poll, 1200);
    }
    catch (e) {
        if (!cancelled) {
            setError(e instanceof Error ? e.message : "Run status could not refresh. Saved work is retained.");
            timer = setTimeout(poll, 4000);
        }
    } } timer = setTimeout(poll, 600); return () => { cancelled = true; clearTimeout(timer); }; }, [run?.run_id, matterId, pollAttempt]);
    async function changeConversation(id: string | null) { if (busy)
        return; const token = ++operation.current; initialized.current = false; setLoading(true); setError(""); try {
        const saved = id ? await getConversation(matterId, id) : null;
        if (!mounted.current || token !== operation.current)
            return;
        setConversationId(id);
        showConversation(saved);
        setRun(null);
        if (id)
            localStorage.setItem(`${storageKey}:conversation`, id);
        else
            localStorage.removeItem(`${storageKey}:conversation`);
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Could not open conversation.");
    }
    finally {
        if (mounted.current && token === operation.current)
            setLoading(false);
    } }
    async function send(text = input, cardAction?: CardAction, intake = false, explore = false, preserveDraft = false, comparisonPathIds?: string[]) {
        if (busyRef.current || busy || loading || uploading || (!text.trim() && !attachments.length)) return;
        busyRef.current = true; setSubmitting(true); setError("");
        const submitted = freezeMessageContext(context);
        pendingOrigin.current = submitted.target?.artifact_path ? {path:submitted.target.artifact_path, commentId:submitted.commentId, scroll:window.scrollY} : null;
        const requestBody = {message:text, comparison_path_ids:comparisonPathIds, model_selection:modelSelection, experimental_chat:true, experimental_intake:intake, experimental_explore:explore, experimental_comment_id:submitted.commentId, matter_id:matterId, agent_id:"counsel-copilot", conversation_id:conversationId, target:submitted.target, active_file:submitted.documents[0]?.path ?? null, context_selections:contextSelections(submitted), attachments:comparisonPathIds ? [] : attachments, card_action:cardAction, review_author:"Themis.ai", lawyer_author:actor.display_name};
        const signature = JSON.stringify(requestBody);
        try {
            const prior = JSON.parse(localStorage.getItem(`${storageKey}:pending-command`) || "null");
            if (prior?.signature === signature) pendingCommand.current = prior;
        } catch { /* The in-memory retry key still protects this open page. */ }
        if (pendingCommand.current?.signature !== signature) pendingCommand.current = {signature,key:`experimental:${crypto.randomUUID()}`};
        try { localStorage.setItem(`${storageKey}:pending-command`,JSON.stringify(pendingCommand.current)); } catch { /* Keep the request key in memory. */ }
        try {
            const next = await startChatRun(matterId,{...requestBody,source_action_key:pendingCommand.current.key});
            if (!mounted.current) return;
            setRun(next);
            initialized.current = false;
            if (!preserveDraft) { setInput(""); setAttachments([]); setContext(emptyContext()); }
            if(next.conversation_id) setConversationId(next.conversation_id);
            try {
                localStorage.setItem(`${storageKey}:run-origin`, JSON.stringify({runId: next.run_id, origin: pendingOrigin.current}));
                if (!preserveDraft) localStorage.removeItem(draftKey);
                localStorage.removeItem(`${storageKey}:pending-command`);
                if(next.conversation_id){
                    localStorage.setItem(`${storageKey}:conversation`,next.conversation_id);
                    localStorage.setItem(`${storageKey}:draft:${next.conversation_id}`,JSON.stringify(preserveDraft ? {input,context,attachments} : {input:"",context:emptyContext(),attachments:[]}));
                }
            } catch { setError("Request accepted. Local recovery could not save; keep this page open."); }
            pendingCommand.current = null;
            initialized.current = true;
            try {
                if(next.conversation_id){const saved=await getConversation(matterId,next.conversation_id);if(mounted.current)showConversation(saved);}
                if(!running(next)) {
                    const latest = await loadWorkspace();
                    const path = next.response?.cards.find(card => card.type === "work_product")?.vault_path;
                    if (mounted.current && path && latest) openRef.current(path, latest.documents, pendingOrigin.current ?? undefined);
                    pendingOrigin.current = null;
                }
            } catch { if(mounted.current)setError("Request accepted. Its saved conversation could not refresh yet."); }
        } catch(e) { if(mounted.current)setError(e instanceof Error?e.message:"Could not submit. Your message is retained."); }
        finally {busyRef.current=false;if(mounted.current)setSubmitting(false);}
    }
    const intakeStarted = useRef(false);
    function beginIntake() {
        const text = "Start intake for this matter.";
        setInput(text);
        void send(text, undefined, true);
    }
    useEffect(() => {
        if (!startIntake || intakeStarted.current || loading || draftReady !== draftKey || !detail || error || busy) return;
        intakeStarted.current = true;
        onIntakeStarted();
        if (!messages.length && !conversationId) beginIntake();
    }, [startIntake, loading, draftReady, draftKey, detail, error, busy, messages.length, conversationId]);
    const onSnapshot = useCallback((snapshot: LocalEditorSnapshot) => { if (snapshot.document_id)
        snapshots.current[snapshot.document_id] = snapshot; }, []);
    const confirmedResearchActions = new Set(messages.flatMap(message => (message.operation_results ?? [])
        .filter(result => result.operation === "run_research" && result.status === "changed")
        .map(result => result.source_action_key ?? result.action)));
    function askDocument(text: string, target: ConversationTarget, commentId?: string) { const doc = documents.find(item => item.path === target.artifact_path); if (!doc)
        return; setContext({ ...documentContext(matterId, doc, snapshots.current[doc.document_id]), target, commentId, locked: true }); setInput(current => current ? `${current}\n\n${text}` : text); pendingOrigin.current = { path: doc.path, commentId, scroll: window.scrollY }; inputRef.current?.focus(); }
    return <><header className={styles.header}><div className={styles.matterTitle}><span className={styles.eyebrow}>Matter conversation</span><h1>{detail?.title ?? "Loading matter…"}</h1></div><div className={styles.row}>{messages.length > 0 && intakeState !== "complete" && <button disabled={busy || loading} onClick={beginIntake}>Continue intake</button>}<button disabled={busy} onClick={() => void changeConversation(null)}><span aria-hidden="true">＋ </span>New conversation</button><button className={styles.refreshButton} title="Refresh matter" aria-label="Refresh matter" onClick={() => void loadWorkspace().catch(e => setError(e.message))}>↻</button><Link href={`/matters/${encodeURIComponent(matterId)}`}>Matter record</Link></div></header><div className={`${styles.work} ${active ? styles.withDocument : ""}`}><section className={styles.chat} aria-label="Experimental conversation"><div className={styles.chatTools} onKeyDown={event => { if(event.key === "Escape") { const menu = (event.target as HTMLElement).closest("details[open]"); menu?.removeAttribute("open"); menu?.querySelector("summary")?.focus(); } }}><details name="experimental-tools" className={styles.toolMenu}><summary>History <span>{conversations.length}</span></summary>{conversations.map(item => <button key={item.conversation_id} disabled={busy} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); void changeConversation(item.conversation_id); }}>{item.title}</button>)}{!conversations.length && <p>No saved conversations yet.</p>}</details><details name="experimental-tools" className={styles.toolMenu}><summary>Files <span>{documents.length}</span></summary>{documents.map(doc => <button key={doc.path} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); openDocument(doc.path); }}>{doc.title}</button>)}</details><ExperimentalSkills /><SolutionPaths disabled={busy || loading || uploading || draftReady !== draftKey} refresh={refresh} matterId={matterId} conversationId={conversationId} workingPathId={context.target?.scenario_id} onSelect={(id,isMainline) => setContext(current => ({...current,target:{matter_id:matterId,...(!isMainline ? {scenario_id:id} : {})},locked:true}))} onCompare={(ids,titles)=>void send(`Compare these approaches against our objective: ${titles.map(title=>`“${title}”`).join(" and ")}. Explain the benefits, trade-offs and added risks, and issues that remain. Distinguish problems each approach creates or worsens from existing problems it leaves unresolved.`,undefined,false,false,true,ids)} />{workspace && !loading && draftReady === draftKey && <ProblemBreakdown disclosureName="experimental-tools" status={workspace?.problem_analysis} onOpenIssue={issueId => { window.open(`/matters/${encodeURIComponent(matterId)}/decision-map?issue=${encodeURIComponent(issueId)}`, "_blank", "noopener,noreferrer"); }} onOpenSource={path => { if (documents.some(doc => doc.path === path)) openDocument(path); else if (isSafeVaultPath(path)) window.open(`/matters/${encodeURIComponent(matterId)}?view=draft&file=${encodeURIComponent(path)}`, "_blank", "noopener,noreferrer"); }} onDiscuss={text => { setInput(current => current.trim() ? `${current}\n\n${text}` : text); inputRef.current?.focus(); }} />}</div><div ref={conversationScroll} className={styles.conversationScroll}>{error && <p role="alert" className={styles.error}>{error}</p>}{loading ? <p>Loading saved conversation…</p> : <div className={styles.thread}>{messages.length === 0 && <div className={styles.welcome}><div className={styles.welcomeMark} aria-hidden="true">T.</div><span className={styles.eyebrow}>Your matter. A fresh perspective.</span><h2>Where shall we begin?</h2><p>Ask a question, test an argument, or work through the main issues. Themis can draw on this matter’s saved records.</p><button disabled={busy} onClick={beginIntake}>Start intake <span aria-hidden="true">→</span></button></div>}{messages.map((message, index) => <article className={message.role === "user" ? styles.user : styles.assistant} key={message.message_id}><small className={message.role === "assistant" ? styles.who : undefined}>{message.role === "assistant" ? "Themis.ai" : "You"}</small>{message.workspace_submission?.context_selections?.length ? <details><summary>Document context at submission</summary>{message.workspace_submission.context_selections.filter(item => item.path).map(item => <div key={item.path}><button onClick={() => openDocument(item.path!)}>{item.path?.split("/").at(-1)}</button><small> · Submitted version {item.revision?.slice(0, 8) || "recorded in run"}</small></div>)}</details> : null}<ClaimMarkdown separateParagraphLines={message.role === "assistant"} className={styles.reply} text={message.role === "assistant" ? proseWithoutRepeatedQuestion(message.content, message.cards?.filter(card => card.type === "question") ?? []) : message.content} claims={workspace?.claims ?? []} documents={documents} surface="conversation" recordId={message.message_id} onOpenDocument={ref => openDocument(ref.path)} onOpenEvidence={evidence => { if (evidence.path)
        openDocument(evidence.path);
    else if (evidence.url)
        window.open(evidence.url, "_blank", "noopener,noreferrer");
    else
        setError("No exact source passage is available for this claim."); }}/>{message.role === "assistant" && <><div className={styles.row}>{message.cards?.filter(card=>card.type==="work_product").map(card=><button key={card.vault_path} onClick={()=>openDocument(card.vault_path)}>{card.title} · Open document</button>)}</div><ExperimentalIntake key={message.message_id} cards={message.cards?.filter(card=>card.type==="question") ?? []} disabled={busy||loading||uploading||index!==messages.length-1} storageKey={`${storageKey}:intake:${conversationId}:${message.message_id}`} explore={intakeState !== "complete"} onSubmit={(text, action) => send(text, action, false, intakeState !== "complete")}/><ChatCards showResearchDocuments cards={message.cards?.filter(card=>card.type!=="work_product"&&card.type!=="question")} matterId={matterId} disabled={busy} questionsDisabled={index !== messages.length - 1} onAction={async (action, text) => send(text || "Use this answer.", action)} onOpenDocument={path => openDocument(path)} operationResults={message.operation_results?.filter(result=>["confirmation_required","proposed"].includes(result.status) && !(result.operation === "run_research" && confirmedResearchActions.has(result.source_action_key ?? result.action)))} onRefresh={async () => { const selected = activeConversation.current; const currentOperation = operation.current; const [, saved] = await Promise.all([loadWorkspace(), selected ? getConversation(matterId, selected) : Promise.resolve(null)]); if (mounted.current && saved && activeConversation.current === selected && currentOperation === operation.current && !busyRef.current) { preserveResearchScroll.current = true; showConversation(saved); } }}/></>}</article>)}{intakeState === "complete" && messages.length > 0 && <ExperimentalNextSteps matter={detail} workspace={workspace} disabled={busy || loading || uploading} onChoose={text => send(text, undefined, false, false, true)}/>}</div>}
      {run && run.state !== "completed" && <div className={running(run) ? styles.notice : styles.runStatus} role="status"><p>{run.state} · {run.status}</p>{run.failure_detail && <p>{run.failure_detail}</p>}{running(run) ? <button onClick={() => void cancelChatRun(matterId, run.run_id).then(setRun).catch(e => setError(e.message))}>Stop work</button> : ["failed", "interrupted"].includes(run.state) ? <button onClick={() => void retryChatRun(matterId, run.run_id).then(next => { setRun(next); setPollAttempt(x => x + 1); }).catch(e => setError(e.message))}>Retry</button> : null}</div>}
      </div><div className={styles.composer}><div className={styles.contextBar}><small>Context</small><div className={styles.row}>{context.documents.length ? context.documents.map(doc => <button key={doc.path} aria-label={`Remove ${doc.title} from message`} onClick={() => setContext(current => ({ documents: current.documents.filter(item => item.path !== doc.path), target: current.target?.artifact_path === doc.path ? undefined : current.target, commentId: current.target?.artifact_path === doc.path ? undefined : current.commentId, locked: true }))}>{doc.title} <span aria-hidden="true">×</span></button>) : <span className={styles.contextDefault}>This matter</span>}</div></div>{context.target?.selected_range && <p className={styles.quote}>{context.target.selected_range.text}</p>}{context.documents.length > 0 && <small className={styles.contextHelp}>{context.locked ? "Context fixed. Switching tabs will not change this message." : "This document is included. Context stays fixed once you type."}</small>}<details className={styles.includeMenu}><summary>Include a document</summary>{documents.map(doc => <button key={doc.path} disabled={context.documents.some(item => item.path === doc.path)} onClick={event => { event.currentTarget.closest("details")?.removeAttribute("open"); setContext(current => freezeMessageContext({ ...current, documents: [...current.documents, { document_id: doc.document_id, path: doc.path, title: doc.title, revision: doc.revision }] })); }}>{doc.title}</button>)}</details><label className={styles.srOnly} htmlFor="experimental-message">Message Themis</label><textarea id="experimental-message" ref={inputRef} rows={3} disabled={submitting || loading || draftReady !== draftKey} value={input} onChange={e => { setInput(e.target.value); setContext(current => freezeMessageContext(!current.locked && active ? documentContext(matterId, active, snapshots.current[active.document_id]) : current)); }} placeholder="Ask Themis about this matter…" onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }}/>{attachments.map(ref => <small key={ref.path}>{ref.name} · Attached </small>)}<div className={styles.composerActions}><label className={styles.attach}><span aria-hidden="true">＋</span> Attach files<input type="file" multiple disabled={uploading || busy} onChange={async (e) => { const files = Array.from(e.target.files ?? []); if (!files.length)
        return; setUploading(true); try {
        const result = await uploadDocuments(matterId, files);
        const refs = (result.attachments ?? []) as AttachmentReference[];
        setAttachments(current => [...current, ...refs]);
        await loadWorkspace();
        if (!refs.length)
            setError("Files were processed. Open Files to inspect the results before including them.");
    }
    catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
    }
    finally {
        setUploading(false);
    } }}/></label><ExperimentalModelPicker value={modelSelection} onChange={chooseModel} disabled={busy}/><button className={styles.primary} disabled={busy || loading || draftReady !== draftKey || uploading || !input.trim() && !attachments.length} onClick={() => void send()}>Send <span aria-hidden="true">↑</span></button></div></div>
      
    </section>{openDocs.length > 0 && <section hidden={!active} className={styles.documents} aria-label="Open documents"><nav className={styles.tabs} aria-label="Document tabs">{openDocs.map(doc => <button aria-pressed={activePath === doc.path} key={doc.path} onClick={() => openDocument(doc.path)}>{doc.title}</button>)}<button onClick={() => { setActivePath(null); setContext(current => current.locked ? current : emptyContext()); }}>Hide documents</button></nav>{active && origins[active.path] && <button onClick={() => { const origin = origins[active.path]; openDocument(origin.path); requestAnimationFrame(() => { window.scrollTo({ top: origin.scroll }); if (origin.commentId)
        window.document.getElementById(`experimental-comment-${origin.commentId}`)?.scrollIntoView({ block: "center" }); }); }}>← Back to {origins[active.path].commentId ? "comment in " : ""}{documents.find(doc => doc.path === origins[active.path].path)?.title ?? "original document"}</button>}{openDocs.map(doc => <div key={doc.path} hidden={activePath !== doc.path}><ExperimentalDocument document={documents.find(item => item.path === doc.path) ?? doc} documents={documents} matterId={matterId} actor={actor} contextKey={storageKey} refresh={refresh} onSnapshot={onSnapshot} onAsk={askDocument} onOpen={(path,commentId) => openDocument(path, documents, { path: doc.path, commentId, scroll: window.scrollY })} onSaved={() => void loadWorkspace().catch(e => setError(e.message))}/></div>)}</section>}</div></>;
}
