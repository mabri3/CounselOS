"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DraftResult, OutputTemplate, OutputTemplateLibraryProps } from "@/lib/workspaceTypes";
import styles from "./MatterTools.module.css";
import phase2 from "../TemplatesPhase2.module.css";
import type { ReactNode } from "react";

const titleCase = (value: string) => value.replaceAll("_", " ").replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const isUnavailable = (template: OutputTemplate) => template.enabled === false || ["failed", "malformed", "unavailable"].includes(template.status ?? "");
const runningPreviewStates = new Set(["queued", "running", "pending", "started"]);
function previewState(result: DraftResult) {
  if (result.artifact) return { label: "Editable preview", className: "state-agent", detail: "This preview is editable work product. It is not approval and does not record a decision." };
  const state = result.state.trim().toLowerCase();
  if (runningPreviewStates.has(state)) return { label: "Preparing", className: "state-agent", detail: `No preview artifact is ready. Current state: ${result.state}.` };
  const label = state === "not_saved" ? "Not saved" : state === "cancelled" || state === "canceled" ? "Cancelled" : state === "failed" ? "Failed" : "No artifact";
  return { label, className: "state-failure", detail: result.receipt?.failure_detail || `No editable preview was created. Current state: ${result.state}.` };
}

export default function OutputTemplateLibrary({ templates, selectedTemplateId, busy = false, onSelect, onCreate, onEdit, onDuplicate, onSetDefault, onPreview, onOpenArtifact, presentation = "matter", previewContext, previewReady = true }: OutputTemplateLibraryProps & { presentation?: "matter" | "phase2"; previewContext?: ReactNode; previewReady?: boolean }) {
  const selected = templates.find((template) => template.template_id === selectedTemplateId) ?? null;
  const outputTypes = useMemo(() => Array.from(new Set(templates.map((template) => template.output_type || "unavailable"))).sort(), [templates]);
  const [pending, setPending] = useState<"copy" | "default" | "preview" | "">("");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<DraftResult | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeFailed, setNoticeFailed] = useState(false);
  const selectedIdentity = selected ? `${selected.template_id}:${selected.revision}` : "";
  const latestSelection = useRef(selectedIdentity);
  const selectionGeneration = useRef(0);
  if (latestSelection.current !== selectedIdentity) { latestSelection.current = selectedIdentity; selectionGeneration.current += 1; }
  useEffect(() => { setPending(""); setPreview(null); setError(""); setNotice(""); setNoticeFailed(false); setOverrides({}); }, [selectedIdentity]);

  function choose(template: OutputTemplate) { onSelect(template); setPreview(null); setError(""); setNotice(""); setNoticeFailed(false); setOverrides({}); }
  async function act(action: "copy" | "default" | "preview") {
    if (!selected) return;
    const actionIdentity = `${selected.template_id}:${selected.revision}`;
    const actionGeneration = selectionGeneration.current;
    const stillSelected = () => latestSelection.current === actionIdentity && selectionGeneration.current === actionGeneration;
    setPending(action); setError(""); setNotice(""); setNoticeFailed(false);
    try {
      if (action === "copy") { const copy = await onDuplicate(selected); if (!stillSelected()) return; setNotice(`${copy.name} was created. Open it to rename or edit it.`); }
      if (action === "default") { await onSetDefault(selected); if (!stillSelected()) return; setNotice(`${selected.name} is now the default for ${titleCase(selected.output_type)}.`); }
      if (action === "preview") {
        const result = await onPreview(selected, overrides); if (!stillSelected()) return; setPreview(result);
        const state = previewState(result);
        setNoticeFailed(state.className === "state-failure");
        setNotice(result.artifact ? "Editable preview created from the current matter." : state.detail);
      }
    } catch (caught) { if (stillSelected()) setError(caught instanceof Error ? caught.message : `The ${action} action failed. Your selection and preview instructions are retained.`); }
    finally { if (stillSelected()) setPending(""); }
  }

  return <section aria-labelledby="template-library-title" className={`${styles.library} ${presentation === "phase2" ? phase2.library : ""} template-library`}>
    <header className="template-library__head"><div><h2 id="template-library-title">Output templates</h2><p>Templates set reusable structure and guidance. Instructions below apply to one preview only.</p></div><button className="btn primary" disabled={busy} onClick={onCreate} type="button">Create blank template</button></header>
    {selectedTemplateId && !selected ? <div className="template-warning" role="alert"><span className="state-label state-failure">Unavailable</span><span>The selected template <span className="mono">{selectedTemplateId}</span> is missing. Choose another template.</span></div> : null}
    {templates.length === 0 ? <div className="empty-state">No output templates are available. Create one, or restore the starter templates.</div> : <div className="template-layout">
      {presentation === "phase2" ? <div className={phase2.table}><div className={phase2.tableHead}><span>Template · {templates.length}</span><span>Version</span><span>State</span><span /></div>{templates.map((item, index) => <button type="button" className={phase2.tableRow} key={item.template_id} aria-pressed={item.template_id === selectedTemplateId} disabled={busy || !!pending} onClick={() => choose(item)}><span><strong>{index + 1}　{item.name}</strong><small>{titleCase(item.output_type)}</small></span><span>{item.revision || "Unavailable"}</span><span>{isUnavailable(item) ? titleCase(item.status || "disabled") : item.is_default ? "Default" : "Available"}</span><span aria-hidden="true">›</span></button>)}</div> : <nav aria-label="Output template list" className="template-list">{outputTypes.map((outputType) => {
        const matching = templates.filter((template) => (template.output_type || "unavailable") === outputType);
        const defaultTemplate = matching.find((template) => template.is_default);
        return <section className="template-group" key={outputType}><div className="template-group__title"><h3>{titleCase(outputType)}</h3><span>{defaultTemplate ? `Default: ${defaultTemplate.name}` : "No selected default"}</span></div>{matching.map((template) => <button aria-pressed={template.template_id === selectedTemplateId} className={`template-row ${template.template_id === selectedTemplateId ? "selected" : ""}`} disabled={busy || !!pending} key={template.template_id} onClick={() => choose(template)} type="button"><span><strong>{template.name}</strong><small>{template.template_id} · version {template.revision || "unavailable"}</small></span><span className={`state-label ${isUnavailable(template) ? "state-failure" : template.is_default ? "state-healthy" : "state-agent"}`}>{isUnavailable(template) ? titleCase(template.status || "disabled") : template.is_default ? "Default" : "Available"}</span></button>)}</section>;
      })}</nav>}
      <div className="template-detail">{selected ? <>
        <div className="template-detail__head"><div><div className="record-meta">{selected.output_type || "Output type unavailable"}</div><h3>{selected.name}</h3><p><span className="mono">{selected.template_id}</span> · version <span className="mono">{selected.revision || "unavailable"}</span></p></div><span className={`state-label ${isUnavailable(selected) ? "state-failure" : "state-healthy"}`}>{isUnavailable(selected) ? titleCase(selected.status || "unavailable") : "Available"}</span></div>
        {isUnavailable(selected) ? <p className="template-failure" role="alert">{selected.failure_detail || "This template is disabled or unavailable. Edit it before use."}</p> : null}
        <p className="reading template-summary">{selected.purpose || selected.instructions || "No purpose or instructions are saved."}</p>
        <details><summary>Current version and history</summary><p>Active file: <span className="mono">{selected.path}</span></p><p>Content hash: <span className="mono">{selected.content_hash || "unavailable"}</span></p><p>Immutable revision: <span className="mono">{selected.revision_path || "Created when this version is used or saved"}</span></p></details>
        <div className="btn-row template-actions"><button className="btn" disabled={busy} onClick={() => onEdit(selected)} type="button">Edit or rename</button><button className="btn" disabled={busy || !!pending || isUnavailable(selected)} onClick={() => void act("copy")} type="button">{pending === "copy" ? "Copying…" : "Make a copy"}</button><button className="btn" disabled={busy || !!pending || isUnavailable(selected) || selected.is_default} onClick={() => void act("default")} type="button">{pending === "default" ? "Saving default…" : selected.is_default ? "Current default" : "Set as default"}</button></div>
        <fieldset className="preview-overrides"><legend>{presentation === "phase2" ? "Preview with a matter" : "Only for this preview"}</legend><p>These values do not change the reusable template.</p>{previewContext}<div className="preview-grid">{(["audience", "purpose", "tone", "length"] as const).map((field) => <label key={field}><span>{titleCase(field)}</span><input className="text-input" onChange={(event) => setOverrides((current) => ({ ...current, [field]: event.target.value }))} value={overrides[field] ?? ""} /></label>)}</div><label><span>Extra instruction for this preview</span><textarea className="text-input prose" onChange={(event) => setOverrides((current) => ({ ...current, instruction: event.target.value }))} rows={3} value={overrides.instruction ?? ""} /></label><button className="btn agent" disabled={busy || !!pending || !previewReady || isUnavailable(selected)} onClick={() => void act("preview")} type="button">{pending === "preview" ? "Generating preview…" : "Preview with this matter"}</button></fieldset>
        {error ? <p className="error" role="alert">{error}</p> : null}{notice ? <p className={noticeFailed ? "template-action-failure" : "template-notice"} role="status">{notice}</p> : null}
        {preview ? (() => { const state = previewState(preview); return <div className="preview-result"><div><span className={`state-label ${state.className}`}>{state.label}</span><strong>{preview.artifact?.title || "Preview request"}</strong></div><p>Status: {preview.state}</p>{preview.artifact ? <><p>Version {preview.artifact.revision}</p>{onOpenArtifact ? <button className="btn quiet" onClick={() => onOpenArtifact(preview.artifact!.path)} type="button">Open editable preview</button> : null}</> : null}<p>{state.detail}</p></div>; })() : null}
      </> : <div className="empty-state">Select a template to inspect, copy, edit, set as a default, or preview.</div>}</div>
    </div>}
  </section>;
}
