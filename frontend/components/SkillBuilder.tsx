"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createSkill,
  draftSkill,
  getSkillQuestions,
  getSkills,
  getSkillSuggestions,
  updateSkill,
} from "@/lib/api";
import type { SkillDefinition, SkillDraft, SkillQuestion, SkillSuggestion } from "@/lib/types";

type View = "home" | "goal" | "question" | "draft" | "edit" | "saved";
export default function SkillBuilder({ initialGoal }: { initialGoal: string }) {
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [questions, setQuestions] = useState<SkillQuestion[]>([]);
  const [view, setView] = useState<View>(initialGoal ? "goal" : "home");
  const [goal, setGoal] = useState(initialGoal);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [customAnswer, setCustomAnswer] = useState("");
  const [draft, setDraft] = useState<SkillDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedPath, setSavedPath] = useState("");
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [reviewNote, setReviewNote] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [findingSuggestions, setFindingSuggestions] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [{ skills: saved }, { questions: fixed }] = await Promise.all([getSkills(), getSkillQuestions()]);
      setSkills(saved);
      setQuestions(fixed);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load skills.");
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (view === "question") focusRef.current?.focus(); }, [questionIndex, view]);

  function startGuided(nextGoal = "") {
    setGoal(nextGoal); setAnswers({}); setQuestionIndex(0); setCustomAnswer("");
    setDraft(null); setEditingId(null); setSavedPath(""); setSuggestions([]); setReviewNote(""); setWarning(""); setError(""); setView("goal");
  }

  function goHome() {
    setDraft(null); setEditingId(null); setSavedPath(""); setSuggestions([]); setReviewNote(""); setWarning(""); setError(""); setView("home");
  }

  function advance(answer?: string | string[]) {
    const question = questions[questionIndex];
    if (question && answer !== undefined) setAnswers((current) => ({ ...current, [question.question_id]: answer }));
    setCustomAnswer("");
    if (questionIndex >= 4) setQuestionIndex(5);
    else setQuestionIndex((current) => current + 1);
  }

  async function build(extra?: string) {
    setBusy(true); setError("");
    const nextAnswers = extra?.trim() ? { ...answers, anything_else: extra.trim() } : answers;
    try {
      const result = await draftSkill({ goal: goal.trim(), answers: nextAnswers });
      setDraft(result.draft); setWarning(result.warning ?? ""); setEditingId(null); setView("draft");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not build the draft.");
    } finally { setBusy(false); }
  }

  async function save() {
    if (!draft) return;
    setBusy(true); setError("");
    try {
      const saved = editingId
        ? await updateSkill(editingId, draft)
        : await createSkill(draft);
      await load(); setDraft(saved); setSavedPath(saved.path); setEditingId(saved.skill_id); setView("saved");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the skill.");
    } finally { setBusy(false); }
  }

  async function findRepeatedWork() {
    setBusy(true); setFindingSuggestions(true); setError(""); setWarning(""); setReviewNote("");
    try {
      const result = await getSkillSuggestions();
      const nextSuggestions = result.suggestions.slice(0, 3);
      setSuggestions(nextSuggestions); setWarning(result.warning ?? "");
      setReviewNote(!nextSuggestions.length && !result.warning ? "No repeated work found in recent messages." : "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not review recent work.");
    } finally { setBusy(false); setFindingSuggestions(false); }
  }

  function editSkill(skill: SkillDefinition) {
    setEditingId(skill.skill_id);
    setDraft({ skill_id: skill.skill_id, name: skill.name, description: skill.description, instructions: skill.instructions });
    setSavedPath(skill.path); setSuggestions([]); setReviewNote(""); setWarning(""); setError(""); setView("edit");
  }

  const question = questions[questionIndex];
  const multiple = question?.selection_mode === "multiple";
  const selected = (answers[question?.question_id] ?? []) as string | string[];
  const selectedValues = Array.isArray(selected) ? selected : selected ? [selected] : [];
  const anythingElse = question?.question_id === "anything_else";

  return (
    <div className="admin-shell">
      <aside className="admin-rail admin-rail-wide">
        <div className="skill-rail-head">
          <span className="admin-rail-title" style={{ padding: 0 }}>Your skills</span>
          <span>{skills.length}</span>
        </div>
        <button className={`admin-rail-link ${view === "home" ? "active" : ""}`} onClick={goHome} type="button">Overview</button>
        <div className="skill-rail-list">
          {skills.length === 0 ? <p className="tree-group-help">No skill saved yet.</p> : null}
          {skills.map((skill) => (
            <button className={`agent-rail-item ${editingId === skill.skill_id ? "active" : ""}`} key={skill.skill_id} onClick={() => editSkill(skill)} type="button">
              <span className="agent-rail-name">{skill.name}</span>
              <span className="agent-rail-role">{skill.description}</span>
              <span className="mono skill-command">/{skill.skill_id}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-scroll">
          <div className="admin-body wide">
            {view === "home" ? (
              <>
                <div className="eyebrow">Reusable guidance</div>
                <h1>Skills</h1>
                <p className="skill-intro">
                  A skill is reusable guidance for one chat request. Save the way you want a recurring
                  kind of work handled once, then type its command in chat and Counsel OS follows that
                  guidance for that one message.
                </p>

                <div className="skill-start-grid">
                  <div className="skill-start-card lead">
                    <h2>Start from work you repeat</h2>
                    <p>Say what you want to make easier. Counsel OS asks five short questions, writes the guidance, and lets you edit every word before it is saved.</p>
                    <div className="btn-row"><button className="btn primary" onClick={() => startGuided()} type="button">Build a skill</button></div>
                  </div>
                  <div className="skill-start-card">
                    <h2>Let Counsel OS spot the pattern</h2>
                    <p>Counsel OS reads your recent chat messages and proposes up to three skills worth saving, each with the messages that suggested it. Nothing is created until you choose to build it.</p>
                    <div className="btn-row"><button className="btn" disabled={busy} onClick={() => void findRepeatedWork()} type="button">{findingSuggestions ? "Reviewing…" : "Find repeated work"}</button></div>
                  </div>
                </div>

                <div className="skill-example">
                  <strong>How you use one:</strong> in any chat, type <span className="mono">/product-launch-review</span> and
                  your request. The skill shapes that answer only. It never changes what Counsel OS is allowed to do.
                </div>

                <section className="skill-section">
                  <div className="skill-section-head">
                    <h2>Saved skills</h2>
                    <span>{skills.length === 1 ? "1 skill" : `${skills.length} skills`} · select one to read or edit it</span>
                  </div>
                  {skills.length === 0 ? (
                    <div className="empty-state" style={{ marginTop: 14 }}>
                      No skill yet. Build one above and it becomes a chat command you can use everywhere.
                    </div>
                  ) : (
                    <div className="skill-grid">
                      {skills.map((skill) => (
                        <button className="skill-card" key={skill.skill_id} onClick={() => editSkill(skill)} type="button">
                          <span className="skill-card-name">{skill.name}</span>
                          <span className="skill-card-purpose">{skill.description}</span>
                          <span className="skill-card-command">/{skill.skill_id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : view === "goal" ? (
              <>
                <div className="eyebrow">Step 1 of 3 · the work</div>
                <h1>What do you want to make easier?</h1>
                <p className="skill-step-help">Describe the kind of request you handle again and again. One or two sentences is enough — the next five questions fill in the detail.</p>
                <label className="field-block"><span className="field-label">The work you repeat</span>
                  <textarea autoFocus className="text-input prose" rows={4} value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="I often review product launch requests." />
                </label>
                <div className="btn-row"><button className="btn primary" disabled={!goal.trim() || questions.length === 0} onClick={() => { setQuestionIndex(0); setView("question"); }} type="button">Continue</button><button className="btn" onClick={goHome} type="button">Cancel</button></div>
              </>
            ) : view === "question" && question ? (
              <div ref={focusRef} tabIndex={-1} className="skill-question-panel">
                <div className="skill-progress">
                  <span className="skill-progress-track"><span className="skill-progress-fill" style={{ width: `${Math.min(100, ((questionIndex + 1) / 6) * 100)}%` }} /></span>
                  <span>{anythingElse ? "Last question — optional" : `Question ${questionIndex + 1} of 5`}</span>
                </div>
                <h1>{question.text}</h1>
                <p className="skill-step-help">
                  {anythingElse
                    ? "Add anything the questions missed, or build the skill as it stands. You can edit the result before saving."
                    : multiple ? "Choose as many as apply, then continue. You can skip any question." : "Choose the closest answer. You can skip any question."}
                </p>
                {anythingElse ? <textarea aria-label={question.text} autoFocus className="text-input prose" rows={5} value={customAnswer} onChange={(event) => setCustomAnswer(event.target.value)} /> : (
                  <div className="question-choices skill-choices">
                    {question.choices.map((choice) => {
                      const active = selectedValues.includes(choice);
                      return <button aria-pressed={active} className={`question-choice ${active ? "active" : ""}`} key={choice} type="button" onClick={() => {
                        if (choice === "Something else") { setAnswers((current) => ({ ...current, [question.question_id]: multiple ? (active ? selectedValues.filter((item) => item !== choice) : [...selectedValues, choice]) : choice })); return; }
                        if (multiple) setAnswers((current) => ({ ...current, [question.question_id]: active ? selectedValues.filter((item) => item !== choice) : [...selectedValues, choice] }));
                        else advance(choice);
                      }}>{choice}</button>;
                    })}
                  </div>
                )}
                {!anythingElse && selectedValues.includes("Something else") ? <input aria-label="Something else" autoFocus className="text-input" placeholder="Say it in your own words" value={customAnswer} onChange={(event) => setCustomAnswer(event.target.value)} /> : null}
                <div className="btn-row skill-question-actions">
                  {anythingElse ? <><button className="btn primary" disabled={busy || !customAnswer.trim()} onClick={() => void build(customAnswer)} type="button">{busy ? "Building…" : "Add this and build it"}</button><button className="btn" disabled={busy} onClick={() => void build()} type="button">{busy ? "Building…" : "No, build it"}</button></> : <>
                    {multiple || selectedValues.includes("Something else") ? <button className="btn primary" disabled={selectedValues.includes("Something else") && !customAnswer.trim()} onClick={() => advance(selectedValues.includes("Something else") ? [...selectedValues.filter((item) => item !== "Something else"), customAnswer.trim()] : selectedValues)} type="button">Continue</button> : null}
                    <button className="btn" onClick={() => advance()} type="button">Skip</button><button className="btn agent" onClick={() => setQuestionIndex(5)} type="button">Build it now</button>
                  </>}
                </div>
              </div>
            ) : draft ? (
              <>
                <div className="eyebrow">{view === "edit" ? "Editing a saved skill" : view === "saved" ? "Saved" : "Step 3 of 3 · read it before you save"}</div>
                <div className="skill-draft-head"><h1>{draft.name || "New skill"}</h1><span className="mono skill-card-command">/{draft.skill_id}</span></div>
                <p className="skill-step-help">
                  {view === "saved"
                    ? "This skill is saved. Type its command in any chat to apply it to one request."
                    : view === "edit"
                      ? "Change anything here, then save. Existing chats that already used this skill are unchanged."
                      : "Counsel OS wrote this from your answers. Nothing is saved until you choose Create skill."}
                </p>
                {warning ? <p className="skill-warning">{warning}</p> : null}
                {view === "saved" ? <div className="agent-note" style={{ marginTop: 18, borderStyle: "solid", background: "var(--healthy-wash)", borderColor: "var(--line)" }}>
                  <span className="state-label state-healthy">Saved</span>
                  <p style={{ margin: "10px 0 0" }}><strong>{draft.name}</strong></p>
                  <p style={{ margin: "5px 0 0" }}>{draft.description}</p>
                  <p style={{ margin: "5px 0 0" }}>Use <span className="mono">/{draft.skill_id}</span> before one chat request.</p>
                </div> : null}
                {savedPath ? <p className="skill-field-help" style={{ marginTop: 12 }}>Stored in <span className="mono">{savedPath}</span></p> : null}
                <div className="skill-form-grid">
                  <label><span className="field-label">Name</span><input className="text-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><span className="skill-field-help">What you will see in the list.</span></label>
                  <label><span className="field-label">Chat command</span><input aria-label="Skill command" className="text-input mono" disabled={!!editingId} value={draft.skill_id} onChange={(event) => setDraft({ ...draft, skill_id: event.target.value })} /><span className="skill-field-help">{editingId ? "The command cannot change once the skill is saved." : "What you type in chat, after a slash."}</span></label>
                </div>
                <label className="field-block"><span className="field-label">Purpose</span><input className="text-input" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /><span className="skill-field-help">One line saying when to reach for this skill.</span></label>
                <details className="field-block" open={view !== "saved"}>
                  <summary className="section-heading" style={{ cursor: "pointer" }}>Requested guidance (Markdown)</summary>
                  <p>This is the full guidance created from your request. It is what Counsel OS reads when you use the command. You can edit it before or after saving.</p>
                  <textarea aria-label="Requested guidance" className="text-input prose" rows={12} value={draft.instructions} onChange={(event) => setDraft({ ...draft, instructions: event.target.value })} />
                </details>
              </>
            ) : null}

            {error ? <p className="error">{error}</p> : null}
            {warning && view !== "draft" && view !== "saved" ? <p className="skill-warning">{warning}</p> : null}
            {reviewNote ? <p className="stub-note" style={{ marginTop: 16 }}>{reviewNote}</p> : null}
            {suggestions.length ? <section className="skill-section">
              <div className="skill-section-head">
                <h2>Work you seem to repeat</h2>
                <span>Drawn from your stored chat messages. Nothing is saved until you build one.</span>
              </div>
              <div className="skill-grid">{suggestions.map((suggestion) => <div className="chat-card skill-suggestion" key={`${suggestion.name}-${suggestion.goal}`}>
                <div className="chat-card-summary">{suggestion.name}</div>
                <div className="chat-card-detail">{suggestion.description}</div>
                {suggestion.evidence.map((item) => <blockquote key={item.message_id}>{item.content}</blockquote>)}
                <button className="btn compact" onClick={() => startGuided(suggestion.goal)} type="button">Build this skill</button>
              </div>)}</div>
            </section> : null}
          </div>
        </div>
        {(view === "draft" || view === "edit" || view === "saved") && draft ? <div className="admin-foot"><span className="stub-note">A skill guides one chat request. It cannot change what Counsel OS is allowed to do.</span><div className="btn-row"><button className="btn" onClick={() => startGuided()} type="button">Start over</button><button className="btn primary" disabled={busy || !draft.skill_id || !draft.name || !draft.description || !draft.instructions} onClick={() => void save()} type="button">{busy ? "Saving…" : editingId ? "Save changes" : "Create skill"}</button></div></div> : null}
      </div>
    </div>
  );
}
