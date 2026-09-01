import Link from "next/link";
import LinkifiedText from "@/components/LinkifiedText";
import { decisionSignal, formatLongDate } from "@/lib/design";
import type { Decision } from "@/lib/types";
import type { ReviewPacket } from "@/lib/watchTypes";

/**
 * Canvas 1f. Recorded decisions are ink on paper: solid border, serif, a real
 * date, a named human. Recommendations never appear in this table.
 */
export default function DecisionTable({
  decisions,
  matterTitles,
  selectedDecision,
  packets = [],
}: {
  decisions: Decision[];
  matterTitles: Record<string, string>;
  selectedDecision?: string | null;
  packets?: ReviewPacket[];
}) {
  if (!decisions.length) return <div className="empty-state">No decisions match this view.</div>;

  return (
    <div className="register">
      <div className="register-grid register-head">
        <div className="record-meta">Recorded</div>
        <div className="record-meta">Decision</div>
        <div className="record-meta">Matter</div>
        <div className="record-meta">Decider</div>
        <div className="record-meta" title="The recorded reason for the decision.">Basis</div>
        <div className="record-meta" style={{ textAlign: "right" }} title="Shows when or why this decision must be checked again.">Review</div>
      </div>

      {decisions.map((decision) => {
        const review = decisionSignal(decision);
        const linkedPackets = packets.filter((packet) => packet.affected_decisions.includes(decision.decision_id));
        return (
          <div
            className="register-grid register-row"
            id={`decision-${decision.decision_id}`}
            key={decision.decision_id}
            style={{
              background: selectedDecision === decision.decision_id ? "var(--agent-tint)" : review.stale ? "#FFFBF0" : "var(--raised)",
              boxShadow: selectedDecision === decision.decision_id ? "inset 3px 0 var(--agent)" : "none",
            }}
          >
            <div className="register-date">{formatLongDate(decision.decided_at)}</div>
            <div style={{ paddingRight: 18 }}>
              <Link className="register-title" href={`/matters/${encodeURIComponent(decision.matter_id)}`}>
                {decision.chosen_path || decision.title}
              </Link>
            </div>
            <div className="register-cell">
              <LinkifiedText text={matterTitles[decision.matter_id]?.trim() || `Matter ${decision.matter_id}`} />
            </div>
            <div className="register-cell" style={{ paddingRight: 0 }}>
              {decision.decision_maker.trim() || "Not recorded"}
            </div>
            <div className="register-basis"><LinkifiedText text={decision.rationale || "No basis recorded"} /></div>
            <div className="register-review">
              {review.stale ? (
                <Link
                  className="btn review tiny"
                  href={`/matters/${encodeURIComponent(decision.matter_id)}`}
                  style={{ maxWidth: "100%", overflowWrap: "anywhere", textAlign: "left", whiteSpace: "normal" }}
                >
                  <span>
                    <strong>Needs review</strong>
                    {review.detail !== "Needs review" ? `: ${review.detail}` : ""}
                  </span>
                </Link>
              ) : (
                <span className="state-label state-quiet">Recorded</span>
              )}
            </div>
            {(decision.conditions.length || decision.not_decided.length || decision.next_review_at) ? (
              <div className="register-packets">
                {decision.conditions.length ? <span><strong>Conditions:</strong> {decision.conditions.join("; ")}</span> : null}
                {decision.not_decided.length ? <span style={{ marginLeft: 12 }}><strong>Not decided:</strong> {decision.not_decided.join("; ")}</span> : null}
                {decision.next_review_at ? <span style={{ marginLeft: 12 }}><strong>Revisit:</strong> {formatLongDate(decision.next_review_at)}</span> : null}
              </div>
            ) : null}
            {linkedPackets.length ? <div className="register-packets">{linkedPackets.map((packet) => <Link key={packet.packet_id} href={`/decisions?packet=${encodeURIComponent(packet.packet_id)}`} style={{ marginRight: 12 }}>Review packet · {packet.status === "open" ? "Needs review" : packet.status}</Link>)}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
