"use client";

import { useEffect, useMemo, useState } from "react";
import { acceptRecommendation, updateRecommendation } from "@/lib/api";
import type { RecommendationState, RecommendationVersion } from "@/lib/types";

type Props = {
  matterId: string;
  recommendation: RecommendationState;
  lawyerActor: string;
  disabled?: boolean;
  onChanged?: (recommendation: RecommendationState) => void | Promise<void>;
};

/** The typed working-recommendation control; it never uses the generic file API. */
export default function RecommendationPanel({
  matterId,
  recommendation,
  lawyerActor,
  disabled = false,
  onChanged,
}: Props) {
  const [state, setState] = useState(recommendation);
  const [draft, setDraft] = useState(state.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const current = useMemo(
    () => state.versions?.find((version) => version.version_id === state.current_version_id),
    [state.current_version_id, state.versions],
  );
  const isLegacy = !state.current_version_id;

  useEffect(() => {
    setState(recommendation);
    setDraft(recommendation.content);
  }, [recommendation]);

  async function saveLawyerEdit() {
    if (!draft.trim()) return;
    setBusy(true);
    setError("");
    try {
      const result = await updateRecommendation(matterId, draft, lawyerActor.trim() || "Lawyer");
      setState(result.data);
      setDraft(result.data.content);
      await onChanged?.(result.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the recommendation.");
    } finally {
      setBusy(false);
    }
  }

  async function acceptProposal() {
    setBusy(true);
    setError("");
    try {
      const result = await acceptRecommendation(matterId, lawyerActor.trim() || "Lawyer");
      setState(result.data);
      setDraft(result.data.content);
      await onChanged?.(result.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not accept the recommendation update.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="matter-recommendation" aria-label="Working recommendation">
      <div className="matter-recommendation-label">
        {isLegacy ? "Legacy recommendation · version history starts when counsel saves" : versionLabel(current)}
      </div>
      <div className="matter-record-note">This saved recommendation is not a recorded decision.</div>
      <textarea
        aria-label="Working recommendation"
        className="text-input prose"
        disabled={disabled || busy}
        onChange={(event) => setDraft(event.target.value)}
        value={draft}
      />
      <button
        className="btn primary compact"
        disabled={disabled || busy || !draft.trim() || draft.trim() === state.content.trim()}
        onClick={() => void saveLawyerEdit()}
        type="button"
      >
        {busy ? "Saving…" : "Save lawyer edit"}
      </button>
      {state.proposal ? (
        <div className="matter-lifecycle-action">
          <span>{proposalLabel(state.proposal)}</span>
          <p>{state.proposal.content}</p>
          <button className="btn review compact" disabled={disabled || busy} onClick={() => void acceptProposal()} type="button">
            Accept recommendation update
          </button>
        </div>
      ) : null}
      {error ? <p className="error" role="alert">{error}</p> : null}
    </section>
  );
}

function versionLabel(version: RecommendationVersion | undefined): string {
  if (!version) return "Saved recommendation";
  return `Version ${version.number} · ${version.actor} · ${originLabel(version.origin)}`;
}

function proposalLabel(proposal: RecommendationVersion): string {
  return `Proposed · ${proposal.actor} · ${originLabel(proposal.origin)}`;
}

function originLabel(origin: RecommendationVersion["origin"]): string {
  return {
    initial_agent: "Initial agent draft",
    lawyer_edit: "Lawyer edit",
    agent_proposal: "Agent proposal",
  }[origin];
}
