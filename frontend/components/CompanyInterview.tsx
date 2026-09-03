"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { advanceCompanyInterview, getCompanyInterview, saveCompanyProfile } from "@/lib/api";
import type {
  CompanyInterview as Interview,
  CompanyInterviewQuestion,
  CompanyInterviewTurn,
  CompanyProfile,
} from "@/lib/types";

export type CompanyProfileField = Exclude<keyof CompanyProfile, "source_id" | "version">;

export function normalizeCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

export function companyReplacementMessage(savedName: string, draftName: string): string | null {
  const saved = savedName.trim().replace(/\s+/g, " ");
  const draft = draftName.trim().replace(/\s+/g, " ");
  if (!saved || !draft || normalizeCompanyName(saved) === normalizeCompanyName(draft)) return null;
  return `Replace the company profile for ${saved} with ${draft}?`;
}

export const COMPANY_PROFILE_FIELDS: { key: CompanyProfileField; label: string; help: string }[] = [
  { key: "company_name", label: "Company name", help: "The name used in the company profile." },
  { key: "website_url", label: "Website", help: "The company website used as background context." },
  { key: "summary", label: "Company summary", help: "A short description that gives agents the right company context." },
  { key: "business_model", label: "Business model", help: "How the company makes money and who its customers are." },
  { key: "products_services", label: "Products and services", help: "The products, services, and main product areas." },
  { key: "jurisdictions", label: "Jurisdictions", help: "The countries, states, or regions where the company operates." },
  { key: "regulatory_context", label: "Regulatory context", help: "The main licenses, regulators, and legal frameworks." },
  { key: "data_practices", label: "Data practices", help: "The main types of data and how the company uses them." },
  { key: "risk_posture", label: "Risk posture", help: "The company’s practical approach to legal and business risk." },
];

type Exchange = { question: CompanyInterviewQuestion; answer: string; reply: string; websiteUsed: boolean; warning: string };
type Props = { profile: CompanyProfile; onSaved: (profile: CompanyProfile) => void };
type SaveState = "clean" | "dirty" | "saved";
type CompanyProfileWithSavedAt = CompanyProfile & { saved_at?: string };

function hasProfileContent(profile: CompanyProfile): boolean {
  return Boolean(profile.version || COMPANY_PROFILE_FIELDS.some((field) => profile[field.key].trim()));
}

function emptyReplacementDraft(profile: CompanyProfile): CompanyProfile {
  return {
    ...Object.fromEntries(COMPANY_PROFILE_FIELDS.map((field) => [field.key, ""])),
    source_id: profile.source_id,
    version: profile.version,
  } as CompanyProfile;
}

function savedAt(profile: CompanyProfile): string {
  const value = (profile as CompanyProfileWithSavedAt).saved_at;
  if (!value) return "Save time unavailable";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function CompanyInterview({ profile, onSaved }: Props) {
  const existingProfile = hasProfileContent(profile);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [question, setQuestion] = useState<CompanyInterviewQuestion | null>(null);
  const [history, setHistory] = useState<CompanyInterviewTurn[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [input, setInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [draft, setDraft] = useState<CompanyProfile>(profile);
  const [generatedDraft, setGeneratedDraft] = useState(!existingProfile);
  const [draftEditedByLawyer, setDraftEditedByLawyer] = useState(false);
  const [reviewing, setReviewing] = useState(existingProfile);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>(existingProfile ? "clean" : "dirty");
  const [error, setError] = useState("");
  const [replacementConfirmation, setReplacementConfirmation] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await getCompanyInterview();
      setInterview(next);
      setQuestion(next.question);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the company interview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadInterview(); }, [loadInterview]);

  useEffect(() => {
    if (!working) {
      setElapsedSeconds(0);
      return;
    }
    const startedAt = Date.now();
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [working]);

  async function advance(finish = false, leaveWebsiteBlank = false) {
    const websiteQuestion = question?.question_id === "website_url";
    const answer = websiteQuestion ? (leaveWebsiteBlank ? "Leave blank" : websiteInput.trim()) : input.trim();
    if (!question || working || (!finish && !answer)) return;
    setWorking(true);
    setError("");
    setWarning("");
    try {
      const result = await advanceCompanyInterview({
        message: finish ? "" : answer,
        history,
        current_profile: draft,
        question_id: question.question_id,
        finish,
        ...(!finish && websiteQuestion ? { website_url: leaveWebsiteBlank ? "" : websiteInput.trim() } : {}),
      });
      setDraft(result.draft);
      setGeneratedDraft(true);
      setDraftEditedByLawyer(false);
      setWarning(result.warning ?? "");
      if (!finish) {
        setExchanges((current) => [...current, {
          question,
          answer,
          reply: result.reply,
          websiteUsed: result.website_used,
          warning: result.warning ?? "",
        }]);
        setHistory((current) => [
          ...current,
          { role: "assistant", content: question.text },
          { role: "user", content: answer },
        ]);
      }
      setInput("");
      setWebsiteInput("");
      setQuestion(result.question ?? null);
      setReviewing(result.complete || finish);
      requestAnimationFrame(() => (websiteRef.current ?? inputRef.current)?.focus());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not continue the company interview.");
    } finally {
      setWorking(false);
    }
  }

  function startAgain() {
    if (!interview) return;
    setQuestion(interview.question);
    setHistory([]);
    setExchanges([]);
    setInput("");
    setWebsiteInput("");
    setDraft(emptyReplacementDraft(profile));
    setGeneratedDraft(true);
    setDraftEditedByLawyer(false);
    setReviewing(false);
    setWarning("");
    setError("");
    setSaveState("dirty");
    requestAnimationFrame(() => (websiteRef.current ?? inputRef.current)?.focus());
  }

  async function persistDraft(replacementMessage: string | null) {
    if (saving || saveState !== "dirty") return;
    setSaving(true);
    setError("");
    try {
      const payload = replacementMessage
        ? ({ ...draft, replacement_confirmation: replacementMessage } as CompanyProfile)
        : draft;
      const nextProfile = await saveCompanyProfile(payload);
      setDraft(nextProfile);
      setSaveState("saved");
      onSaved(nextProfile);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not save the company profile.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }

  function saveDraft() {
    if (saving || saveState !== "dirty") return;
    const replacementMessage = companyReplacementMessage(profile.company_name, draft.company_name);
    if (replacementMessage) {
      setReplacementConfirmation(replacementMessage);
      return;
    }
    void persistDraft(null).catch(() => undefined);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void advance();
    }
  }

  if (loading) return <div className="company-interview-status">Starting the company interview…</div>;
  if (!interview) return (
    <div className="company-interview-status">
      <p className="error">{error || "The company interview is not available."}</p>
      <button className="btn compact" onClick={() => void loadInterview()} type="button">Try again</button>
    </div>
  );

  return (
    <section className="company-interview" aria-label="Company profile interview">
      <div className="company-interview-thread" aria-live="polite">
        {!reviewing ? <AssistantTurn>{interview.opening}</AssistantTurn> : null}
        {exchanges.map((exchange, index) => (
          <div className="company-interview-exchange" key={`${exchange.question.question_id}-${index}`}>
            <QuestionTurn question={exchange.question} />
            <div className="bubble-you">{exchange.answer}</div>
            <AssistantTurn>{exchange.reply}</AssistantTurn>
            {exchange.websiteUsed ? <p className="company-interview-warning" role="status"><strong>Website read</strong> · Public website content was used as untrusted background.</p> : null}
            {exchange.warning ? <p className="company-interview-warning" role="status"><strong>Note:</strong> {exchange.warning}</p> : null}
          </div>
        ))}
        {question && !reviewing ? <QuestionTurn question={question} /> : null}
        {working ? <AssistantTurn>{elapsedSeconds < 5 ? "Working…" : `Still working… ${elapsedSeconds} seconds elapsed.`}</AssistantTurn> : null}
        {reviewing ? (
          <ReviewCard
            draft={draft}
            draftEditedByLawyer={draftEditedByLawyer}
            generatedDraft={generatedDraft}
            error={error}
            saveState={saveState}
            saving={saving}
            warning={warning}
            onChange={(nextDraft) => {
              setDraft(nextDraft);
              setDraftEditedByLawyer(true);
              setSaveState("dirty");
            }}
            onSave={() => void saveDraft()}
            onStartAgain={startAgain}
          />
        ) : error ? <div className="company-interview-error"><p className="error">{error}</p></div> : null}
      </div>

      {question && !reviewing ? (
        <div className="company-interview-composer">
          <label className="field-label" htmlFor={question.question_id === "website_url" ? "company-interview-website" : "company-interview-answer"}>
            {question.question_id === "website_url" ? "Public HTTPS website (optional)" : "Your answer"}
          </label>
          <div className="composer-field">
            {question.question_id === "website_url" ? (
              <input
                className="text-input"
                id="company-interview-website"
                onChange={(event) => setWebsiteInput(event.target.value)}
                placeholder="https://example.com"
                ref={websiteRef}
                type="url"
                value={websiteInput}
              />
            ) : (
              <textarea
                id="company-interview-answer"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Answer in your own words…"
                ref={inputRef}
                rows={3}
                value={input}
              />
            )}
            <button className="btn primary compact" disabled={question.question_id === "website_url" ? !websiteInput.trim() || working : !input.trim() || working} onClick={() => void advance()} type="button">Send</button>
          </div>
          <div className="company-interview-composer-foot">
            <span>{question.question_id === "website_url" ? "Only a public HTTPS address can be read. Its content is untrusted background." : "Enter sends. Shift+Enter adds a new line."}</span>
            {question.question_id === "website_url" ? <button className="btn tiny quiet" disabled={working} onClick={() => void advance(false, true)} type="button">Leave blank</button> : null}
            {exchanges.length ? <button className="btn tiny quiet" disabled={working} onClick={() => void advance(true)} type="button">Review draft now</button> : null}
          </div>
        </div>
      ) : null}
      {replacementConfirmation ? <ConfirmationDialog
        confirmLabel="Replace company profile"
        description={replacementConfirmation}
        onCancel={() => setReplacementConfirmation(null)}
        onConfirm={() => persistDraft(replacementConfirmation)}
        title="Replace company profile?"
      /> : null}
    </section>
  );
}

function AssistantTurn({ children }: { children: string }) {
  return <div className="assistant-message"><div className="agent-label">Themis.ai</div><div className="bubble-agent"><p>{children}</p></div></div>;
}

function QuestionTurn({ question }: { question: CompanyInterviewQuestion }) {
  return (
    <div className="assistant-message company-question">
      <div className="agent-label">Themis.ai</div>
      <div className="bubble-agent"><p>{question.text}</p></div>
      {question.reason ? <p className="company-question-reason">Why I ask: {question.reason}</p> : null}
    </div>
  );
}

function ReviewCard({ draft, draftEditedByLawyer, error, generatedDraft, saveState, saving, warning, onChange, onSave, onStartAgain }: {
  draft: CompanyProfile;
  draftEditedByLawyer: boolean;
  error: string;
  generatedDraft: boolean;
  saveState: SaveState;
  saving: boolean;
  warning: string;
  onChange: (profile: CompanyProfile) => void;
  onSave: () => void;
  onStartAgain: () => void;
}) {
  const unchanged = saveState !== "dirty";
  return (
    <section className={`company-review-card ${unchanged ? "saved" : ""}`} aria-label="Company profile draft">
      <div className="agent-label">{saveState === "dirty"
        ? generatedDraft && !draftEditedByLawyer
          ? "Themis.ai · Not yet reviewed by an attorney"
          : generatedDraft
            ? "Unsaved lawyer edits to a Themis.ai draft"
            : "Unsaved lawyer edits"
        : "Company profile · Saved"}</div>
      <h2>{draft.company_name || "Review the company profile"}</h2>
      <p className="company-review-state">
        {saveState === "clean"
          ? "No unsaved changes."
          : saveState === "saved"
            ? "Saved. No unsaved changes."
            : "Review and edit this profile. Nothing changes until you choose Save company profile."}
      </p>
      {draft.version ? (
        <p className="record-meta">Version {draft.version} · Saved {savedAt(draft)}</p>
      ) : null}
      <dl className="company-review-fields">
        {COMPANY_PROFILE_FIELDS.map((field) => (
          <div key={field.key}>
            <dt><label htmlFor={`company-draft-${field.key}`}>{field.label}</label></dt>
            <dd>{field.key === "company_name" || field.key === "website_url" ? (
              <input className="text-input" id={`company-draft-${field.key}`} onChange={(event) => onChange({ ...draft, [field.key]: event.target.value })} type={field.key === "website_url" ? "url" : "text"} value={draft[field.key]} />
            ) : (
              <textarea
                className="text-input"
                id={`company-draft-${field.key}`}
                onChange={(event) => onChange({ ...draft, [field.key]: event.target.value })}
                rows={field.key === "summary" || field.key === "regulatory_context" || field.key === "data_practices" ? 7 : 5}
                value={draft[field.key]}
              />
            )}</dd>
          </div>
        ))}
      </dl>
      {warning ? <p className="company-interview-warning" role="status"><strong>Note:</strong> {warning}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="company-interview-actions">
        <button className="btn primary" disabled={saving || unchanged} onClick={onSave} type="button">
          {saving ? "Saving…" : unchanged ? "No unsaved changes" : "Save company profile"}
        </button>
        <button className="btn" disabled={saving} onClick={onStartAgain} type="button">Start again</button>
      </div>
    </section>
  );
}
