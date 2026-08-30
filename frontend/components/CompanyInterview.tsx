"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { advanceCompanyInterview, getCompanyInterview, saveCompanyProfile } from "@/lib/api";
import type {
  CompanyInterview as Interview,
  CompanyInterviewQuestion,
  CompanyInterviewTurn,
  CompanyProfile,
} from "@/lib/types";

export type CompanyProfileField = Exclude<keyof CompanyProfile, "source_id" | "version">;

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

export default function CompanyInterview({ profile, onSaved }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [question, setQuestion] = useState<CompanyInterviewQuestion | null>(null);
  const [history, setHistory] = useState<CompanyInterviewTurn[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [input, setInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [draft, setDraft] = useState<CompanyProfile>(profile);
  const [reviewing, setReviewing] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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
    setDraft(profile);
    setReviewing(false);
    setWarning("");
    setError("");
    setSaved(false);
    requestAnimationFrame(() => (websiteRef.current ?? inputRef.current)?.focus());
  }

  async function saveDraft() {
    if (saving || saved) return;
    setSaving(true);
    setError("");
    try {
      const nextProfile = await saveCompanyProfile(draft);
      setDraft(nextProfile);
      setSaved(true);
      onSaved(nextProfile);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the company profile.");
    } finally {
      setSaving(false);
    }
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
        <AssistantTurn>{interview.opening}</AssistantTurn>
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
            error={error}
            saved={saved}
            saving={saving}
            warning={warning}
            onChange={setDraft}
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
    </section>
  );
}

function AssistantTurn({ children }: { children: string }) {
  return <div className="assistant-message"><div className="agent-label">Themis · Not reviewed</div><div className="bubble-agent"><p>{children}</p></div></div>;
}

function QuestionTurn({ question }: { question: CompanyInterviewQuestion }) {
  return (
    <div className="assistant-message company-question">
      <div className="agent-label">Themis · Not reviewed</div>
      <div className="bubble-agent"><p>{question.text}</p></div>
      {question.reason ? <p className="company-question-reason">Why I ask: {question.reason}</p> : null}
    </div>
  );
}

function ReviewCard({ draft, error, saved, saving, warning, onChange, onSave, onStartAgain }: {
  draft: CompanyProfile;
  error: string;
  saved: boolean;
  saving: boolean;
  warning: string;
  onChange: (profile: CompanyProfile) => void;
  onSave: () => void;
  onStartAgain: () => void;
}) {
  return (
    <section className={`company-review-card ${saved ? "saved" : ""}`} aria-label="Company profile draft">
      <div className="agent-label">{saved ? "Company profile · Saved" : "Themis · Not reviewed"}</div>
      <h2>{saved ? "Company profile saved" : "Review the company profile"}</h2>
      <p className="company-review-state">{saved ? "This profile is saved in company.md." : "Edit this draft if needed. Nothing is saved until you choose Save."}</p>
      <dl className="company-review-fields">
        {COMPANY_PROFILE_FIELDS.map((field) => (
          <div key={field.key}>
            <dt>{saved ? field.label : <label htmlFor={`company-draft-${field.key}`}>{field.label}</label>}</dt>
            <dd>{saved ? (draft[field.key] || "—") : field.key === "company_name" || field.key === "website_url" ? (
              <input className="text-input" id={`company-draft-${field.key}`} onChange={(event) => onChange({ ...draft, [field.key]: event.target.value })} type={field.key === "website_url" ? "url" : "text"} value={draft[field.key]} />
            ) : (
              <textarea className="text-input" id={`company-draft-${field.key}`} onChange={(event) => onChange({ ...draft, [field.key]: event.target.value })} rows={3} value={draft[field.key]} />
            )}</dd>
          </div>
        ))}
      </dl>
      {warning ? <p className="company-interview-warning" role="status"><strong>Note:</strong> {warning}</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="company-interview-actions">
        {!saved ? <button className="btn primary" disabled={saving} onClick={onSave} type="button">{saving ? "Saving…" : "Save company profile"}</button> : null}
        <button className="btn" disabled={saving} onClick={onStartAgain} type="button">Start again</button>
      </div>
    </section>
  );
}
