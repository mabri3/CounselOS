"use client";

import { useState } from "react";
import type { PracticeNotePanelProps } from "@/lib/workspaceTypes";
import styles from "./MatterExplore.module.css";

export default function PracticeNotePanel({
  links,
  busy = false,
  builder,
  onDraft,
  onApply,
  onOpen,
}: PracticeNotePanelProps) {
  const [instruction, setInstruction] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [pendingSkill, setPendingSkill] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function draft() {
    if (!instruction.trim()) return;
    setDrafting(true);
    setError("");
    setNotice("");
    try {
      await onDraft(instruction.trim());
      setShowBuilder(true);
      setNotice(
        "Draft ready. Review and edit it before you save it as reusable guidance.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The practice note draft could not be created. Your instruction is retained.",
      );
    } finally {
      setDrafting(false);
    }
  }

  async function apply(skillId: string) {
    setPendingSkill(skillId);
    setError("");
    setNotice("");
    try {
      await onApply(skillId);
      setNotice(
        "Practice note applied. The saved revision will appear after the matter refreshes.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The practice note was not applied. You can retry.",
      );
    } finally {
      setPendingSkill(null);
    }
  }

  return (
    <section
      aria-labelledby="practice-note-title"
      className={`${styles.practiceNotePanel} note-panel`}
    >
      <div className="panel-heading">
        <p className="eyebrow" id="practice-note-title">
          Practice notes
        </p>
        <span
          aria-label="Nothing is learned or applied automatically"
          className="note-help"
        >
          Draft reusable guidance for this matter. Nothing is learned or applied
          automatically.
        </span>
      </div>
      <div className="note-compose">
        <textarea
          aria-label="Practice note instruction"
          className="text-input prose"
          onChange={(event) => {
            setInstruction(event.target.value);
            setNotice("");
          }}
          placeholder="Describe the note you need"
          rows={2}
          value={instruction}
        />
        <button
          className="btn tiny"
          disabled={busy || drafting || !instruction.trim()}
          onClick={() => void draft()}
          type="button"
        >
          {drafting ? "Drafting…" : "Draft a practice note"}
        </button>
      </div>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="note-status" role="status">
          {notice}
        </p>
      ) : null}
      {showBuilder && builder ? (
        <div className="note-builder" aria-label="Editable practice note draft">
          <div className="note-builder__label">
            <span className="state-label state-agent">Editable draft</span>
            <span>Save only when the wording is ready.</span>
          </div>
          {builder}
        </div>
      ) : null}
      <div className="note-links">
        {links.length === 0 ? (
          <p className="reuse-empty">No practice note available.</p>
        ) : (
          links.map((link) => {
            const applied = !!link.applied_revision;
            return (
              <div
                className="note-link"
                key={`${link.skill_id}:${link.applied_revision ?? "available"}`}
              >
                <div>
                  <strong>{link.name || "Unnamed practice note"}</strong>
                  <p>
                    {link.applied_revision ? (
                      <>
                        Applied version{" "}
                        <span className="mono">{link.applied_revision}</span>
                      </>
                    ) : (
                      "Available. It has not been applied to this matter."
                    )}
                  </p>
                </div>
                <div className="btn-row">
                  <button
                    className="btn quiet"
                    onClick={() => onOpen(link.skill_id)}
                    type="button"
                  >
                    Open and edit
                  </button>
                  <button
                    className="btn primary"
                    disabled={busy || pendingSkill === link.skill_id || applied}
                    onClick={() => void apply(link.skill_id)}
                    type="button"
                  >
                    {pendingSkill === link.skill_id
                      ? "Applying…"
                      : applied
                        ? "Applied"
                        : "Apply to this matter"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
