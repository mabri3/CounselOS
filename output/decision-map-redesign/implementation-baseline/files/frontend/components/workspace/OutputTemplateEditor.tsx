"use client";

import { useEffect, useRef, useState } from "react";
import MarkdownRichEditor from "@/components/MarkdownRichEditor";
import type { DraftResult, OutputTemplateEditable, OutputTemplateEditorProps } from "@/lib/workspaceTypes";
import styles from "./MatterTools.module.css";

function editable(template: OutputTemplateEditorProps["template"]): OutputTemplateEditable {
  return { name: template.name, output_type: template.output_type, instructions: template.instructions ?? "", section_outline: template.section_outline ?? "", audience: template.audience ?? "", purpose: template.purpose ?? "", tone: template.tone ?? "", length: template.length ?? "", exclusions: template.exclusions ?? "", source_presentation: template.source_presentation ?? "", sample_wording: template.sample_wording ?? "", enabled: template.enabled !== false };
}

const runningPreviewStates = new Set(["queued", "running", "pending", "started"]);
function previewState(result: DraftResult) {
  if (result.artifact) return { label: "Editable preview", className: "state-agent", detail: "This preview is editable work product. It is not approval and does not record a decision." };
  const state = result.state.trim().toLowerCase();
  if (runningPreviewStates.has(state)) return { label: "Preparing", className: "state-agent", detail: `No preview artifact is ready. Current state: ${result.state}.` };
  const label = state === "not_saved" ? "Not saved" : state === "cancelled" || state === "canceled" ? "Cancelled" : state === "failed" ? "Failed" : "No artifact";
  return { label, className: "state-failure", detail: result.receipt?.failure_detail || `No editable preview was created. Current state: ${result.state}.` };
}

export default function OutputTemplateEditor({ template, busy = false, onSave, onCancel, onPreview, onOpenArtifact }: OutputTemplateEditorProps) {
  const [draft, setDraft] = useState<OutputTemplateEditable>(() => editable(template));
  const [baseRevision, setBaseRevision] = useState(template.revision);
  const [dirty, setDirty] = useState(false);
  const [staleRevision, setStaleRevision] = useState<string | null>(null);
  const [pending, setPending] = useState<"save" | "preview" | "">("");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<DraftResult | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeFailed, setNoticeFailed] = useState(false);
  const templateId = useRef(template.template_id);
  const sourceRevision = useRef(template.revision);
  const draftRef = useRef(draft);
  const [savedTemplate, setSavedTemplate] = useState(template);
  const renderedTemplateId = useRef(template.template_id);
  const editorGeneration = useRef(0);
  if (renderedTemplateId.current !== template.template_id) { renderedTemplateId.current = template.template_id; editorGeneration.current += 1; }

  useEffect(() => {
    if (template.template_id !== templateId.current) {
      templateId.current = template.template_id; sourceRevision.current = template.revision; setSavedTemplate(template); setDraft(editable(template)); draftRef.current = editable(template); setBaseRevision(template.revision); setDirty(false); setStaleRevision(null); setPending(""); setPreview(null); setOverrides({}); setError(""); setNotice(""); setNoticeFailed(false);
      return;
    }
    if (template.revision === baseRevision) { sourceRevision.current = template.revision; setSavedTemplate(template); return; }
    if (template.revision === sourceRevision.current) return;
    sourceRevision.current = template.revision;
    if (dirty) setStaleRevision(template.revision);
    else { const next = editable(template); setSavedTemplate(template); setDraft(next); draftRef.current = next; setBaseRevision(template.revision); setStaleRevision(null); }
  }, [baseRevision, dirty, template]);

  function patch(change: Partial<OutputTemplateEditable>) { setDraft((current) => { const next = { ...current, ...change }; draftRef.current = next; return next; }); setDirty(true); setNotice(""); setNoticeFailed(false); }
  async function save() {
    if (!draft.name.trim() || !draft.output_type.trim()) { setError("Add a template name and output type before saving."); return; }
    const submitted = draft;
    const actionTemplateId = template.template_id;
    const actionGeneration = editorGeneration.current;
    const stillEditingSubmittedTemplate = () => renderedTemplateId.current === actionTemplateId && editorGeneration.current === actionGeneration;
    setPending("save"); setError(""); setNotice(""); setNoticeFailed(false);
    try {
      const saved = await onSave(submitted, baseRevision); if (!stillEditingSubmittedTemplate()) return; setSavedTemplate(saved); setBaseRevision(saved.revision); setStaleRevision(null);
      if (draftRef.current === submitted) { const next = editable(saved); setDraft(next); draftRef.current = next; setDirty(false); setNotice(saved.enabled === false ? `Reusable template saved as version ${saved.revision}. It is disabled and is not available for future draft requests.` : `Reusable template saved as version ${saved.revision}. Future requests can use it.`); }
      else { setDirty(true); setNotice(`Version ${saved.revision} was saved. Edits made during the save are still here and are not saved.`); }
    }
    catch (caught) { if (stillEditingSubmittedTemplate()) setError(caught instanceof Error ? caught.message : "The reusable template was not saved. Your edits are retained."); }
    finally { if (stillEditingSubmittedTemplate()) setPending(""); }
  }
  async function previewMatter() {
    const actionTemplateId = template.template_id;
    const actionGeneration = editorGeneration.current;
    const stillEditingSubmittedTemplate = () => renderedTemplateId.current === actionTemplateId && editorGeneration.current === actionGeneration;
    setPending("preview"); setError(""); setNotice(""); setNoticeFailed(false);
    try {
      const result = await onPreview(savedTemplate, overrides); if (!stillEditingSubmittedTemplate()) return; setPreview(result);
      const state = previewState(result);
      setNoticeFailed(state.className === "state-failure");
      setNotice(result.artifact ? "Editable preview created from the saved template." : state.detail);
    }
    catch (caught) { if (stillEditingSubmittedTemplate()) setError(caught instanceof Error ? caught.message : "The preview failed. Your template edits and one-time instructions are retained."); }
    finally { if (stillEditingSubmittedTemplate()) setPending(""); }
  }

  return <section aria-labelledby="template-editor-title" className={`${styles.editor} template-editor`}>
    <header className="template-editor__head"><div><div className="record-meta">Output template · {template.template_id}</div><h2 id="template-editor-title">Edit {template.name}</h2><p>Version <span className="mono">{baseRevision}</span>. Saving creates a new reusable version.</p></div><span className={`state-label ${draft.enabled ? "state-healthy" : "state-failure"}`}>{draft.enabled ? "Available" : "Disabled"}</span></header>
    {staleRevision ? <div className="stale-warning" role="alert"><span className="state-label state-attention">Newer version exists</span><span>Version <span className="mono">{staleRevision}</span> arrived while you were editing. Your local text is retained. Save will check version <span className="mono">{baseRevision}</span> and report a conflict rather than replace newer content.</span></div> : null}
    <div className="template-fields"><label><span>Name</span><input className="text-input" onChange={(event) => patch({ name: event.target.value })} value={draft.name} /></label><label><span>Output type</span><input className="text-input mono" onChange={(event) => patch({ output_type: event.target.value })} value={draft.output_type} /></label></div>
    <div className="template-fields template-fields--details">{(["audience", "purpose", "tone", "length"] as const).map((field) => <label key={field}><span>{field.replace(/^./, (letter) => letter.toUpperCase())}</span><input className="text-input" onChange={(event) => patch({ [field]: event.target.value })} value={draft[field] ?? ""} /></label>)}</div>
    <section className="editor-field"><div><h3>Plain-language instructions and desired content</h3><p>State what the draft must do. These instructions are data. They cannot run code or change matter records.</p></div><MarkdownRichEditor key={`instructions:${template.template_id}:${baseRevision}`} markdown={draft.instructions ?? ""} onChange={(instructions) => patch({ instructions })} /></section>
    <section className="editor-field"><div><h3>Markdown section outline and heading order</h3><p>Put headings in the order the reader should see them.</p></div><MarkdownRichEditor key={`outline:${template.template_id}:${baseRevision}`} markdown={draft.section_outline ?? ""} onChange={(section_outline) => patch({ section_outline })} /></section>
    <div className="template-long-fields"><label><span>Exclusions</span><textarea className="text-input prose" onChange={(event) => patch({ exclusions: event.target.value })} rows={3} value={draft.exclusions ?? ""} /></label><label><span>How to present sources</span><textarea className="text-input prose" onChange={(event) => patch({ source_presentation: event.target.value })} rows={3} value={draft.source_presentation ?? ""} /></label><label><span>Optional sample wording</span><textarea className="text-input prose" onChange={(event) => patch({ sample_wording: event.target.value })} rows={4} value={draft.sample_wording ?? ""} /><small>Examples guide style only. They are not matter facts or legal authority.</small></label></div>
    <label className="checkbox-row template-enabled"><input checked={draft.enabled !== false} onChange={(event) => patch({ enabled: event.target.checked })} type="checkbox" />Available for future draft requests</label>
    <div className="save-actions"><button className="btn primary" disabled={busy || !!pending || !dirty} onClick={() => void save()} type="button">{pending === "save" ? "Saving…" : "Save reusable template"}</button><button className="btn quiet" disabled={busy || !!pending} onClick={onCancel} type="button">Cancel</button><span>{dirty ? "Edited. Not saved." : "Current saved version."}</span></div>
    <fieldset className="preview-box"><legend>Preview with this matter</legend><p>Use the real draft path. This creates a separate editable preview. It does not approve content, replace a draft, or record a decision.</p>{dirty ? <p className="preview-save-note">Save the reusable template before previewing these structure or guidance changes.</p> : null}<div className="preview-fields">{(["audience", "purpose", "tone", "length"] as const).map((field) => <label key={field}><span>One-time {field}</span><input className="text-input" onChange={(event) => setOverrides((current) => ({ ...current, [field]: event.target.value }))} value={overrides[field] ?? ""} /></label>)}</div><label><span>One-time instruction</span><textarea className="text-input prose" onChange={(event) => setOverrides((current) => ({ ...current, instruction: event.target.value }))} rows={3} value={overrides.instruction ?? ""} /></label><button className="btn agent" disabled={busy || !!pending || dirty || draft.enabled === false} onClick={() => void previewMatter()} type="button">{pending === "preview" ? "Generating preview…" : "Create editable preview"}</button></fieldset>
    {error ? <p className="error" role="alert">{error}</p> : null}{notice ? <p className={noticeFailed ? "editor-action-failure" : "editor-notice"} role="status">{notice}</p> : null}
    {preview ? (() => { const state = previewState(preview); return <div className="preview-result"><span className={`state-label ${state.className}`}>{state.label}</span><div><strong>{preview.artifact?.title || "Preview request"}</strong><p>Status: {preview.state}</p>{preview.artifact ? <><p>Version {preview.artifact.revision}</p>{onOpenArtifact ? <button className="btn quiet" onClick={() => onOpenArtifact(preview.artifact!.path)} type="button">Open editable preview</button> : null}</> : <p>{state.detail}</p>}</div></div>; })() : null}
    <details className="revision-detail"><summary>Current version record</summary><p>Active file: <span className="mono">{template.path}</span></p><p>Content hash: <span className="mono">{template.content_hash || "unavailable"}</span></p><p>Immutable revision: <span className="mono">{template.revision_path || "Created when this version is used or saved"}</span></p></details>
  </section>;
}
