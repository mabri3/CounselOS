"use client";

import { useEffect, useRef, useState } from "react";
import { canPersistWorkspaceDraftingPreferences, matchingLocalEditorSnapshot, newWorkspaceDraftActionKey, readWorkspaceDraftingPreferences, restoredOutputTemplate, reusableWorkspaceDraftActionKey, shouldOpenCompletedDraft, WorkspaceDraftingActionTracker, workspaceDraftRequestFingerprint, writeWorkspaceDraftingPreferences } from "@/lib/workspaceDrafting";
import type { DraftRequest, DraftResult, DraftWorkspaceProps, OutputTemplate, TemplateUse, WorkProductReference, WorkspaceView } from "@/lib/workspaceTypes";
import MatterIcon from "./MatterIcon";
import styles from "./MatterA.module.css";

const VIEWS: Array<{ id: WorkspaceView; label: string; help: string }> = [
  { id: "understand", label: "Understand", help: "Read the current matter" },
  { id: "discuss", label: "Discuss", help: "Continue one matter conversation" },
  { id: "draft", label: "Draft", help: "Review and prepare work product" },
];

function fileName(path: string): string { return path.split("/").filter(Boolean).at(-1) || "saved file"; }
function stateClass(state: string | undefined): string { return state === "failed" || state === "interrupted" || state === "not_saved" ? "state-failure" : state === "completed" || state === "saved" ? "state-healthy" : "state-agent"; }
function previewStateLabel(result: DraftResult): string {
  if (result.artifact) return result.artifact.preview ? "Preview · Not kept" : "Saved work product";
  if (result.state === "failed" || result.state === "interrupted") return "Preview failed";
  if (result.state === "not_saved") return "Preview not saved";
  return result.state === "queued" || result.state === "running" ? "Preview preparing" : "Preview request";
}

function templateUse(template: OutputTemplate, overrides: Record<string, string>): TemplateUse {
  return {
    template_id: template.template_id,
    output_type: template.output_type,
    revision: template.revision,
    content_hash: template.content_hash,
    revision_path: template.revision_path,
    instructions_snapshot: template.instructions ?? "",
    section_outline_snapshot: template.section_outline,
    defaults_snapshot: Object.fromEntries(Object.entries({ audience: template.audience, purpose: template.purpose, tone: template.tone, length: template.length }).filter((entry): entry is [string, string] => Boolean(entry[1]))),
    overrides,
    state: template.enabled === false ? "unavailable" : "applied",
  };
}

function ArtifactState({ artifact }: { artifact: WorkProductReference }) {
  if (artifact.decision_review_required) return <span className="state-label state-attention">Recorded choice changed · Review draft</span>;
  if (artifact.pending_review) return <span className="state-label state-attention">Pending attorney review</span>;
  if (artifact.preview) return <span className="state-label state-agent">Preview · Not kept</span>;
  return <span className="state-label state-healthy">Saved work product</span>;
}

export default function DraftWorkspace(props: DraftWorkspaceProps & { onOpenDecisionMap?: () => void; initialView?: WorkspaceView }) {
  const selectedTemplate = props.templates.find((template) => template.template_id === props.selectedTemplateId) ?? null;
  const [instruction, setInstruction] = useState("");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [actionFingerprint, setActionFingerprint] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState<DraftResult | null>(null);
  const [previewResult, setPreviewResult] = useState<DraftResult | null>(null);
  const [pending, setPending] = useState<"draft" | "preview" | "keep" | "accept" | "decline" | "retain_copy" | "open_current" | "rebase" | "">("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [hydratedMatterId, setHydratedMatterId] = useState<string | null>(null);
  const [restoredView, setRestoredView] = useState<WorkspaceView | null>(null);
  const [restoredArtifactPath, setRestoredArtifactPath] = useState<string | null>(null);
  const [restoredTemplateId, setRestoredTemplateId] = useState<string | null>(null);
  const [conversationExpanded, setConversationExpanded] = useState(false);
  const submittedTarget = useRef<string | null>(null);
  const submittedArtifact = useRef<WorkProductReference | null>(null);
  const latestActiveArtifactPath = useRef(props.activeArtifactPath);
  const actionTracker = useRef(new WorkspaceDraftingActionTracker(props.matterId));
  actionTracker.current.setMatter(props.matterId);
  latestActiveArtifactPath.current = props.activeArtifactPath;

  useEffect(() => {
    if (hydratedMatterId === props.matterId) return;
    const next = readWorkspaceDraftingPreferences(window.localStorage, props.matterId);
    setDraftResult(null); setPreviewResult(null); setNotice(""); setError(""); setPending("");
    setInstruction(next.instruction); setOverrides(next.overrides); setActionKey(next.sourceActionKey); setActionFingerprint(next.sourceActionFingerprint);
    const startingView = props.initialView ?? next.view;
    setRestoredView(startingView); setRestoredArtifactPath(next.activeArtifactPath); setRestoredTemplateId(next.selectedTemplateId); setHydratedMatterId(props.matterId);
    if (startingView !== props.view) props.onViewChange(startingView);
    if (next.activeArtifactPath && next.activeArtifactPath !== props.activeArtifactPath) props.onSelectArtifact(next.activeArtifactPath);
  }, [hydratedMatterId, props.activeArtifactPath, props.initialView, props.matterId, props.onSelectArtifact, props.onViewChange, props.view]);

  useEffect(() => {
    if (!canPersistWorkspaceDraftingPreferences(hydratedMatterId, props.matterId)) return;
    const template = restoredOutputTemplate(props.templates, restoredTemplateId);
    if (!template) return;
    if (template.template_id !== props.selectedTemplateId) props.onSelectTemplate(template);
    setRestoredTemplateId(null);
  }, [hydratedMatterId, props.matterId, props.onSelectTemplate, props.selectedTemplateId, props.templates, restoredTemplateId]);

  useEffect(() => {
    if (!canPersistWorkspaceDraftingPreferences(hydratedMatterId, props.matterId)) return;
    if (restoredView && props.view === restoredView) setRestoredView(null);
    if (restoredArtifactPath && props.activeArtifactPath === restoredArtifactPath) setRestoredArtifactPath(null);
  }, [hydratedMatterId, props.activeArtifactPath, props.matterId, props.view, restoredArtifactPath, restoredView]);

  useEffect(() => {
    if (!canPersistWorkspaceDraftingPreferences(hydratedMatterId, props.matterId)) return;
    writeWorkspaceDraftingPreferences(window.localStorage, props.matterId, {
      version: 1,
      view: restoredView ?? props.view,
      activeArtifactPath: restoredArtifactPath ?? props.activeArtifactPath,
      selectedTemplateId: restoredTemplateId ?? props.selectedTemplateId,
      instruction,
      overrides,
      sourceActionKey: actionKey,
      sourceActionFingerprint: actionFingerprint,
    });
  }, [actionFingerprint, actionKey, hydratedMatterId, instruction, overrides, props.activeArtifactPath, props.matterId, props.selectedTemplateId, props.view, restoredArtifactPath, restoredTemplateId, restoredView]);

  useEffect(() => {
    if (!previewResult?.artifact) return;
    const refreshed = props.artifacts.find((artifact) => artifact.path === previewResult.artifact?.path);
    if (refreshed && !refreshed.preview && previewResult.artifact.preview) {
      setPreviewResult((current) => current?.artifact?.path === refreshed.path ? { ...current, artifact: refreshed } : current);
    }
  }, [previewResult, props.artifacts]);

  useEffect(() => {
    setConversationExpanded(props.view === "discuss");
  }, [props.view]);

  const localSnapshot = matchingLocalEditorSnapshot(props.target?.artifact_path, props.editorSnapshot ?? null);
  const hasScope = Boolean(props.target && props.businessQuestionRevision);
  const targetLabel = props.target?.artifact_path ? fileName(props.target.artifact_path) : "the current matter";
  const isDraftableTemplate = !selectedTemplate || selectedTemplate.enabled !== false;

  function changeInstruction(value: string) {
    setInstruction(value);
    setActionKey(null); setActionFingerprint(null);
    setDraftResult(null);
  }

  function beginAction() {
    return actionTracker.current.begin();
  }

  function isCurrentAction(token: ReturnType<WorkspaceDraftingActionTracker["begin"]>) {
    return actionTracker.current.isCurrent(token);
  }

  async function requestDraft() {
    if (!props.target || !props.businessQuestionRevision) { setError("Choose a saved conversation scope before requesting a draft."); return; }
    if (!instruction.trim()) { setError("Describe the work product you need."); return; }
    if (!isDraftableTemplate) { setError("Choose an available output template before requesting a draft."); return; }
    const frozenTarget = {
      ...props.target,
      artifact_path: localSnapshot?.path ?? props.target.artifact_path,
      artifact_revision: localSnapshot?.base_revision ?? props.target.artifact_revision,
      artifact_review_revision: localSnapshot?.review_revision ?? props.target.artifact_review_revision,
      selected_range: localSnapshot?.selected_range ?? props.target.selected_range,
      local_draft_snapshot: localSnapshot?.content ?? props.target.local_draft_snapshot,
    };
    const requestBase: Omit<DraftRequest, "source_action_key"> = {
      instruction: instruction.trim(), target: frozenTarget,
      business_question_revision: props.businessQuestionRevision,
      output_type: selectedTemplate?.output_type,
      template_use: selectedTemplate ? templateUse(selectedTemplate, overrides) : null,
      audience: overrides.audience || undefined, purpose: overrides.purpose || undefined,
      output_preferences: Object.keys(overrides).length ? overrides : undefined,
    };
    const fingerprint = workspaceDraftRequestFingerprint(requestBase);
    const key = reusableWorkspaceDraftActionKey(actionKey, actionFingerprint, fingerprint, () => newWorkspaceDraftActionKey(props.matterId));
    const request: DraftRequest = { ...requestBase, source_action_key: key };
    const token = beginAction();
    setActionKey(key); setActionFingerprint(fingerprint); setPending("draft"); setError(""); setNotice("");
    submittedTarget.current = frozenTarget.artifact_path ?? null;
    submittedArtifact.current = props.artifacts.find((artifact) => artifact.path === frozenTarget.artifact_path) ?? null;
    try {
      const result = await props.onDraft(request);
      if (!isCurrentAction(token)) return;
      setDraftResult(result);
      if (result.artifact && shouldOpenCompletedDraft(latestActiveArtifactPath.current, submittedTarget.current)) {
        props.onSelectArtifact(result.artifact.path);
        setNotice(`Draft ready: ${result.artifact.title}.`);
      } else if (result.artifact) setNotice(`Draft ready for ${targetLabel}. Open it when you are ready.`);
      else setNotice(`Draft request ${result.state}.`);
    } catch (caught) { if (isCurrentAction(token)) setError(caught instanceof Error ? caught.message : "The draft request did not finish. Your instruction is retained for retry."); }
    finally { if (isCurrentAction(token)) setPending(""); }
  }

  async function previewTemplate() {
    if (!selectedTemplate) { setError("Choose an output template before creating a preview."); return; }
    const token = beginAction();
    setPending("preview"); setError(""); setNotice("");
    try { const result = await props.onPreviewTemplate(selectedTemplate, overrides); if (!isCurrentAction(token)) return; setPreviewResult(result); setNotice(result.artifact ? "Separate editable preview created. It does not replace an existing draft." : `Preview request ${result.state}.`); }
    catch (caught) { if (isCurrentAction(token)) setError(caught instanceof Error ? caught.message : "The preview did not finish. Your template choices are retained."); }
    finally { if (isCurrentAction(token)) setPending(""); }
  }

  async function actOnArtifact(artifact: WorkProductReference, action: "keep" | "accept" | "decline" | "retain_copy" | "open_current" | "rebase") {
    const callback = action === "keep" ? props.onKeepPreview : action === "accept" || action === "decline" ? props.onUpdateOfferAction : props.onResolveDraftConflict;
    if (!callback) { setError("This recovery action is not available yet."); return; }
    const token = beginAction();
    setPending(action); setError("");
    try {
      if (action === "keep") await props.onKeepPreview?.(artifact);
      else if (action === "accept" || action === "decline") await props.onUpdateOfferAction?.(artifact, action);
      else await props.onResolveDraftConflict?.(action, artifact);
      if (isCurrentAction(token)) {
        if (action === "keep") setPreviewResult((current) => current?.artifact?.path === artifact.path ? { ...current, artifact: { ...current.artifact, preview: false } } : current);
        setNotice(action === "keep" ? "Preview kept as work product." : action === "accept" ? "Update offer accepted." : action === "decline" ? "Update offer declined." : "Draft recovery action completed.");
      }
    } catch (caught) { if (isCurrentAction(token)) setError(caught instanceof Error ? caught.message : "The action did not finish. Your current editor text is retained."); }
    finally { if (isCurrentAction(token)) setPending(""); }
  }

  const viewName = `workspace-view-${props.matterId}`;
  const conversationVisible = props.view === "discuss" || conversationExpanded;
  return <section aria-label="Matter workspace" className={`${styles.draftWorkspace} draft-workspace draft-workspace--${props.view}${conversationVisible ? "" : " draft-workspace--conversation-collapsed"}`}>
    <header className="draft-workspace__head">
      <fieldset className="segmented"><legend className="sr-only">Matter workspace view</legend>{VIEWS.map((item) => <span className="segmented-option" key={item.id}><input checked={props.view === item.id} className="segmented-input" id={`${viewName}-${item.id}`} name={viewName} onChange={() => props.onViewChange(item.id)} type="radio" value={item.id} /><label htmlFor={`${viewName}-${item.id}`} title={item.help}><MatterIcon name={item.id === "understand" ? "book" : item.id === "discuss" ? "chat" : "file"} />{item.label}</label></span>)}</fieldset>
      {props.onOpenDecisionMap ? <button className="btn quiet" onClick={props.onOpenDecisionMap} type="button"><MatterIcon name="map" />Decision map</button> : null}
    </header>

    <div className="draft-workspace__layout">
      <div aria-hidden={props.view !== "understand"} className="draft-workspace__understand" hidden={props.view !== "understand"}>{props.understand}</div>
      <div aria-hidden={props.view !== "draft"} className="draft-workspace__editor" hidden={props.view !== "draft"}>{props.editor}</div>
      <div aria-hidden={!conversationVisible} className="draft-workspace__conversation" hidden={!conversationVisible}>{props.conversation}</div>
    </div>
    <div className="draft-workspace__conversation-control">
      <details className="draft-workspace__conversation-help"><summary>Discussion help</summary><p>One matter conversation stays available while you read and draft.</p></details>
      {props.view !== "discuss" ? <button aria-expanded={conversationVisible} className="btn quiet tiny" onClick={() => setConversationExpanded((current) => !current)} type="button">{conversationVisible ? "Hide discussion" : "Show discussion"}</button> : null}
    </div>

    <section className="draft-tools" aria-labelledby="draft-tools-title" hidden={props.view !== "draft"}>
      <div className="draft-tools__head"><div><span className="record-meta">Work product</span><h2 id="draft-tools-title">Draft controls</h2></div>{localSnapshot ? <span className="state-label state-attention">Local draft snapshot · Not saved</span> : null}</div>
      {localSnapshot ? <p className="draft-tools__snapshot">Changes from {fileName(localSnapshot.path)} are included only if you submit this request. Content revision: {localSnapshot.base_revision}. Review state: {localSnapshot.review_revision ?? "not available"}.{localSnapshot.selected_range ? " The selected passage is included." : ""}</p> : null}
      <div className="draft-tools__grid"><label><span>Request</span><textarea className="text-input prose" onChange={(event) => changeInstruction(event.target.value)} placeholder="For example: Draft a concise business memo for the current question." rows={3} value={instruction} /></label><div className="draft-template"><span className="field-label">Output template</span><strong>{selectedTemplate?.name ?? "No template selected"}</strong>{selectedTemplate ? <span>Version {selectedTemplate.revision}</span> : <span>A template is optional for a direct request.</span>}<div className="btn-row"><button className="btn quiet tiny" onClick={props.onOpenTemplates} type="button">Output templates</button>{selectedTemplate ? <button className="btn quiet tiny" onClick={() => props.onSelectTemplate(selectedTemplate)} type="button">Current template</button> : null}</div></div></div>
      {selectedTemplate ? <div className="draft-overrides"><span className="field-label">Only for this request</span><div>{(["audience", "purpose", "tone", "length"] as const).map((field) => <label key={field}><span>{field[0].toUpperCase() + field.slice(1)}</span><input className="text-input" onChange={(event) => { setOverrides((current) => ({ ...current, [field]: event.target.value })); setActionKey(null); }} value={overrides[field] ?? ""} /></label>)}</div><div className="btn-row"><button className="btn agent" disabled={pending !== "" || selectedTemplate.enabled === false} onClick={() => void previewTemplate()} type="button">{pending === "preview" ? "Preparing preview…" : "Preview with this matter"}</button><span>Creates a separate editable preview. It does not replace a draft, record a decision, or send work.</span></div></div> : null}
      <div className="btn-row draft-tools__actions"><button className="btn primary" disabled={pending !== "" || !hasScope || !instruction.trim() || !isDraftableTemplate} onClick={() => void requestDraft()} type="button">{pending === "draft" ? "Preparing draft…" : "Request draft"}</button>{!hasScope ? <span className="draft-tools__help">Choose a saved scope before requesting a draft.</span> : null}</div>
      {error ? <p className="error" role="alert">{error}</p> : null}{notice ? <p className="draft-tools__notice" role="status">{notice}</p> : null}
      {previewResult ? <div className="draft-result"><span className={`state-label ${stateClass(previewResult.state)}`}>{previewStateLabel(previewResult)}</span>{previewResult.artifact ? <><strong>{previewResult.artifact.title}</strong><div className="btn-row"><button className="btn quiet tiny" onClick={() => props.onSelectArtifact(previewResult.artifact!.path)} type="button">Open preview</button>{previewResult.artifact.preview ? <button className="btn tiny" disabled={pending !== "" || !props.onKeepPreview} onClick={() => void actOnArtifact(previewResult.artifact!, "keep")} type="button">{pending === "keep" ? "Keeping…" : "Keep preview"}</button> : null}</div></> : <span>State: {previewResult.state}</span>}</div> : null}
      {draftResult ? <div className="draft-result"><span className={`state-label ${stateClass(draftResult.state)}`}>{draftResult.artifact ? "Draft ready" : "Draft request"}</span>{draftResult.artifact ? <><strong>{draftResult.artifact.title}</strong><button className="btn quiet tiny" onClick={() => props.onSelectArtifact(draftResult.artifact!.path)} type="button">Open draft</button></> : null}{draftResult.proposal_path ? <><button className="btn quiet tiny" onClick={() => props.onSelectArtifact(draftResult.proposal_path!)} type="button">Open saved proposal</button>{submittedArtifact.current ? <span className="artifact-recovery"><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(submittedArtifact.current!, "retain_copy")} type="button">Retain copy</button><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(submittedArtifact.current!, "open_current")} type="button">Open current</button><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(submittedArtifact.current!, "rebase")} type="button">Rebase draft</button></span> : null}</> : null}</div> : null}
    </section>

    <aside aria-label="Available work product" className="artifact-list" hidden={props.view !== "draft"}><h2>Available work product</h2>{props.artifacts.length ? props.artifacts.map((artifact) => {
      const previewKeptHere = previewResult?.artifact?.path === artifact.path && previewResult.artifact.preview === false;
      const displayedArtifact = previewKeptHere ? { ...artifact, preview: false } : artifact;
      const offerState = artifact.update_offer?.state ?? "offered";
      return <article className={artifact.path === props.activeArtifactPath ? "artifact-row selected" : "artifact-row"} key={artifact.path}><div><strong>{artifact.title}</strong><p>{artifact.output_type ?? "Work product"} · version {artifact.revision}</p><ArtifactState artifact={displayedArtifact} /></div><div className="btn-row"><button className="btn tiny quiet" onClick={() => props.onSelectArtifact(artifact.path)} type="button">{artifact.path === props.activeArtifactPath ? "Open" : "Open work"}</button>{artifact.preview && !previewKeptHere ? <button className="btn tiny" disabled={pending !== "" || !props.onKeepPreview} onClick={() => void actOnArtifact(artifact, "keep")} type="button">{pending === "keep" ? "Keeping…" : "Keep preview"}</button> : null}{artifact.update_offer ? offerState === "declined" ? <><span className="state-label state-agent">Earlier facts · Draft retained</span><span className="artifact-earlier-facts">Ask in the conversation to request an update.</span></> : <><span className={`state-label ${offerState === "stale" ? "state-attention" : "state-agent"}`}>Update offer · {offerState}</span><button className="btn tiny" disabled={pending !== "" || !props.onUpdateOfferAction} onClick={() => void actOnArtifact(artifact, "accept")} type="button">Accept update</button><button className="btn tiny quiet" disabled={pending !== "" || !props.onUpdateOfferAction} onClick={() => void actOnArtifact(artifact, "decline")} type="button">Decline update</button></> : null}{artifact.proposal_paths?.map((path) => <button className="btn tiny quiet" key={path} onClick={() => props.onSelectArtifact(path)} type="button">Open saved proposal</button>)}{artifact.proposal_paths?.length ? <span className="artifact-recovery"><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(artifact, "retain_copy")} type="button">Retain copy</button><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(artifact, "open_current")} type="button">Open current</button><button className="btn tiny quiet" disabled={pending !== "" || !props.onResolveDraftConflict} onClick={() => void actOnArtifact(artifact, "rebase")} type="button">Rebase draft</button></span> : null}</div>{artifact.version_changes?.length ? <details><summary>Why this version changed</summary>{artifact.version_changes.map((change, index) => <p key={`${change.reason}:${index}`}>{change.reason}</p>)}</details> : null}</article>;
    }) : <p>No saved work product is available yet.</p>}</aside>
  </section>;
}
