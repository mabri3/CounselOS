"use client";

import { useEffect, useRef, useState } from "react";
import type {
  BusinessFlowProps,
  Flow,
  FlowActor,
  FlowEdge,
  InteractionReceipt,
} from "@/lib/workspaceTypes";
import MatterIcon from "@/components/workspace/MatterIcon";
import styles from "./MatterExplore.module.css";

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const cloneFlow = (flow: Flow): Flow => ({
  ...flow,
  actors: [...(flow.actors ?? [])],
  edges: [...(flow.edges ?? [])],
});
type Notice = {
  tone: "healthy" | "agent" | "attention" | "failure";
  word: string;
  message: string;
};

function normalizeEdges(edges: FlowEdge[]) {
  return edges.map((edge, index) => ({ ...edge, order: index + 1 }));
}

function receiptNotice(receipt: InteractionReceipt): Notice {
  if (receipt.state === "applied")
    return {
      tone: "healthy",
      word: "Saved",
      message: "Selected facts were saved to the matter record.",
    };
  if (receipt.state === "proposed")
    return {
      tone: "attention",
      word: "Proposed",
      message: "It is not applied.",
    };
  return {
    tone: "failure",
    word: "Not saved",
    message: receipt.failure_detail || "The selected facts were not saved.",
  };
}

export default function BusinessFlow({
  flow,
  busy = false,
  currentRevisions = {},
  proposedFactChanges = [],
  onAcceptFactChanges,
  onSave,
  onSelectFact,
  onRefresh,
}: BusinessFlowProps) {
  const [draft, setDraft] = useState<Flow>(() => cloneFlow(flow));
  const [baseRevision, setBaseRevision] = useState(flow.revision);
  const [dirty, setDirty] = useState(false);
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"save" | "accept" | null>(null);
  const acceptanceKey = useRef({ signature: "", key: "" });
  const [conflict, setConflict] = useState(false);
  const [refreshedFlow, setRefreshedFlow] = useState<Flow | null>(null);
  const locked = busy || pending !== null;

  // A background refresh must never erase a lawyer's unsaved flow edits.
  useEffect(() => {
    if (dirty || flow.revision === baseRevision) return;
    setDraft(cloneFlow(flow));
    setBaseRevision(flow.revision);
    setSelectedChanges([]);
  }, [baseRevision, dirty, flow]);

  const update = (next: Flow) => {
    setDraft({ ...next, edges: normalizeEdges(next.edges ?? []) });
    setDirty(true);
    setConflict(false);
  };
  const actors = draft.actors ?? [];
  const edges = draft.edges ?? [];
  const actorLabels = new Map(
    actors.map((actor) => [
      actor.actor_id,
      actor.label.trim() || "Unnamed actor",
    ]),
  );

  function addActor() {
    const actor: FlowActor = { actor_id: newId("actor"), label: "New actor" };
    update({ ...draft, actors: [...actors, actor] });
  }

  function updateActor(actorId: string, label: string) {
    update({
      ...draft,
      actors: actors.map((actor) =>
        actor.actor_id === actorId ? { ...actor, label } : actor,
      ),
    });
  }

  function removeActor(actorId: string) {
    update({
      ...draft,
      actors: actors.filter((actor) => actor.actor_id !== actorId),
      edges: edges.filter(
        (edge) =>
          edge.from_actor_id !== actorId && edge.to_actor_id !== actorId,
      ),
    });
  }

  function addEdge() {
    if (actors.length < 2) {
      setError("Add at least two actors before adding a relationship.");
      return;
    }
    const edge: FlowEdge = {
      edge_id: newId("edge"),
      from_actor_id: actors[0].actor_id,
      to_actor_id: actors[1].actor_id,
      label: "New relationship",
      order: edges.length + 1,
      timing: "",
      custody: "",
      ownership: "",
      fact_ids: [],
      uncertainty: "",
    };
    update({ ...draft, edges: [...edges, edge] });
  }

  function updateEdge(edgeId: string, patch: Partial<FlowEdge>) {
    update({
      ...draft,
      edges: edges.map((edge) =>
        edge.edge_id === edgeId ? { ...edge, ...patch } : edge,
      ),
    });
  }

  function moveEdge(edgeId: string, direction: -1 | 1) {
    const from = edges.findIndex((edge) => edge.edge_id === edgeId);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= edges.length) return;
    const next = [...edges];
    [next[from], next[to]] = [next[to], next[from]];
    update({ ...draft, edges: next });
  }

  async function save() {
    const unnamedActor = actors.some((actor) => !actor.label.trim());
    const unnamedEdge = edges.some((edge) => !edge.label.trim());
    if (unnamedActor || unnamedEdge) {
      setError("Name each actor and relationship before saving.");
      return;
    }
    setPending("save");
    setError("");
    setNotice(null);
    setConflict(false);
    try {
      const saved = await onSave(
        {
          ...draft,
          revision: baseRevision,
          actors,
          edges: normalizeEdges(edges),
        },
        baseRevision,
      );
      setDraft(cloneFlow(saved));
      setBaseRevision(saved.revision);
      setDirty(false);
      setNotice({
        tone: "healthy",
        word: "Saved",
        message: "Business flow saved.",
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The flow was not saved. Your edits are retained so you can refresh or retry.",
      );
      setConflict(true);
    } finally {
      setPending(null);
    }
  }

  async function acceptSelectedFacts() {
    if (!onAcceptFactChanges) {
      setError("Flow fact acceptance is not connected yet.");
      return;
    }
    if (!selectedChanges.length) {
      setError("Choose the specific proposed facts to accept.");
      return;
    }
    setPending("accept");
    setError("");
    setNotice(null);
    const signature = `${selectedChanges.slice().sort().join(",")}:${JSON.stringify(currentRevisions)}`;
    if (acceptanceKey.current.signature !== signature)
      acceptanceKey.current = { signature, key: newId("flow-accept") };
    try {
      const receipt = await onAcceptFactChanges(
        selectedChanges,
        currentRevisions,
        acceptanceKey.current.key,
      );
      setNotice(receiptNotice(receipt));
      if (receipt.state === "applied") setSelectedChanges([]);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The selected facts were not accepted. Your selection is retained.",
      );
    } finally {
      setPending(null);
    }
  }

  async function refreshCurrentFlow() {
    if (!onRefresh) return;
    setError("");
    try {
      const latest = await onRefresh();
      setRefreshedFlow(cloneFlow(latest));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The current saved flow could not be read. Your edits are retained.",
      );
    }
  }

  function rebaseLocalEdits() {
    if (!refreshedFlow) return;
    setBaseRevision(refreshedFlow.revision);
    setConflict(false);
    setError("");
    setNotice({
      tone: "attention",
      word: "Rebased",
      message:
        "Your local flow edits are retained against the latest saved revision. Review them before saving.",
    });
  }

  async function copyLocalFlow() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ ...draft, revision: baseRevision }, null, 2),
      );
      setNotice({
        tone: "agent",
        word: "Copied",
        message: "Local flow edits copied.",
      });
    } catch {
      setError(
        "The local flow could not be copied. Your edits remain in this form.",
      );
    }
  }

  const initialUnsaved = !flow.revision && !dirty;
  const proposedChanges = proposedFactChanges.filter(
    (change) => change.state === "proposed" || !change.state,
  );

  return (
    <section
      aria-labelledby="business-flow-title"
      className={`${styles.businessFlow} business-flow`}
    >
      <header className="business-flow__header">
        <p className="eyebrow" id="business-flow-title">
          Business flow sketch
        </p>
        <div className="business-flow__state-label">
          <MatterIcon name="map" size={19} />
          <span
            className={
              dirty || initialUnsaved ? "state-attention" : "state-healthy"
            }
          >
            {dirty ? "Needs save" : initialUnsaved ? "Not saved" : "Saved"}
          </span>
        </div>
      </header>
      {notice ? (
        <p
          className={`business-flow__state business-flow__state--${notice.tone}`}
          role="status"
        >
          {notice.word}: {notice.message}
        </p>
      ) : null}
      {error ? (
        <p
          className="business-flow__state business-flow__state--failure"
          role="alert"
        >
          Failed: {error}
        </p>
      ) : null}
      <section
        className="business-flow__sketch"
        aria-label="Business flow diagram"
      >
        {edges.length ? (
          <ol className="business-flow__sketch-list">
            {edges.map((edge, index) => {
              const edgeDetails = [
                { label: "Timing", value: edge.timing?.trim() },
                { label: "Custody", value: edge.custody?.trim() },
                { label: "Ownership", value: edge.ownership?.trim() },
                { label: "Uncertainty", value: edge.uncertainty?.trim() },
              ].filter((detail): detail is { label: string; value: string } =>
                Boolean(detail.value),
              );
              return (
                <li className="business-flow__sketch-step" key={edge.edge_id}>
                  <span className="business-flow__sketch-order">
                    Step {index + 1}
                  </span>
                  <div className="business-flow__sketch-route">
                    <div className="business-flow__sketch-node">
                      <span>From</span>
                      <strong>
                        {actorLabels.get(edge.from_actor_id) ?? "Unknown actor"}
                      </strong>
                    </div>
                    <span
                      className="business-flow__sketch-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                    <div className="business-flow__sketch-node business-flow__sketch-node--relationship">
                      <span>Relationship</span>
                      <strong>
                        {edge.label.trim() || "Unnamed relationship"}
                      </strong>
                    </div>
                    <span
                      className="business-flow__sketch-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                    <div className="business-flow__sketch-node">
                      <span>To</span>
                      <strong>
                        {actorLabels.get(edge.to_actor_id) ?? "Unknown actor"}
                      </strong>
                    </div>
                  </div>
                  {edgeDetails.length ? (
                    <dl className="business-flow__sketch-details">
                      {edgeDetails.map((detail) => (
                        <div key={detail.label}>
                          <dt>{detail.label}</dt>
                          <dd>{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="small muted">
                      No timing, custody, ownership, or uncertainty recorded for
                      this step.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="business-flow__empty">No flow steps are saved yet.</p>
        )}
      </section>
      <div className="business-flow__actions">
        <button
          className="btn agent tiny"
          type="button"
          onClick={addActor}
          disabled={locked}
        >
          Add actor
        </button>
        <button
          className="btn agent tiny"
          type="button"
          onClick={addEdge}
          disabled={locked}
        >
          Add relationship
        </button>
        <button
          className="btn tiny"
          type="button"
          onClick={() => void save()}
          disabled={locked}
        >
          {pending === "save" ? "Saving flow…" : "Save flow"}
        </button>
        <span className="business-flow__fact-status">
          {proposedChanges.length
            ? `${proposedChanges.length} proposed fact${proposedChanges.length === 1 ? "" : "s"}`
            : "No proposed facts"}
        </span>
        <button
          className="btn review tiny"
          type="button"
          onClick={() => void acceptSelectedFacts()}
          disabled={locked || !selectedChanges.length}
        >
          {pending === "accept" ? "Accepting…" : "Accept selected facts"}
        </button>
      </div>
      <details className="business-flow__editor">
        <summary>Edit actors and relationships</summary>
        <div className="business-flow__actors">
          <div className="business-flow__section-heading">
            <h3>Actors</h3>
          </div>
          {actors.length ? (
            actors.map((actor) => (
              <div className="business-flow__actor" key={actor.actor_id}>
                <input
                  className="text-input"
                  aria-label="Actor name"
                  value={actor.label}
                  disabled={locked}
                  onChange={(event) =>
                    updateActor(actor.actor_id, event.target.value)
                  }
                />
                <button
                  className="btn tiny quiet"
                  type="button"
                  onClick={() => removeActor(actor.actor_id)}
                  disabled={locked}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="muted small">
              Add the people or organizations in this flow.
            </p>
          )}
        </div>
        <div className="business-flow__edges">
          <div className="business-flow__section-heading">
            <h3>Ordered relationships</h3>
          </div>
          {edges.length ? (
            edges.map((edge, index) => (
              <article className="business-flow__edge" key={edge.edge_id}>
                <div className="business-flow__edge-order">
                  <span>Step {index + 1}</span>
                  <div className="btn-row">
                    <button
                      className="btn tiny quiet"
                      type="button"
                      onClick={() => moveEdge(edge.edge_id, -1)}
                      disabled={index === 0 || locked}
                    >
                      Earlier
                    </button>
                    <button
                      className="btn tiny quiet"
                      type="button"
                      onClick={() => moveEdge(edge.edge_id, 1)}
                      disabled={index === edges.length - 1 || locked}
                    >
                      Later
                    </button>
                    <button
                      className="btn tiny quiet"
                      type="button"
                      onClick={() =>
                        update({
                          ...draft,
                          edges: edges.filter(
                            (item) => item.edge_id !== edge.edge_id,
                          ),
                        })
                      }
                      disabled={locked}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="business-flow__edge-grid">
                  <label>
                    <span>From</span>
                    <select
                      className="select-input"
                      value={edge.from_actor_id}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, {
                          from_actor_id: event.target.value,
                        })
                      }
                    >
                      {actors.map((actor) => (
                        <option key={actor.actor_id} value={actor.actor_id}>
                          {actor.label || "Unnamed actor"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>To</span>
                    <select
                      className="select-input"
                      value={edge.to_actor_id}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, {
                          to_actor_id: event.target.value,
                        })
                      }
                    >
                      {actors.map((actor) => (
                        <option key={actor.actor_id} value={actor.actor_id}>
                          {actor.label || "Unnamed actor"}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="business-flow__wide">
                    <span>Relationship</span>
                    <input
                      className="text-input"
                      value={edge.label}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, { label: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    <span>Timing</span>
                    <input
                      className="text-input"
                      value={edge.timing ?? ""}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, { timing: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    <span>Custody</span>
                    <input
                      className="text-input"
                      value={edge.custody ?? ""}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, {
                          custody: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Ownership</span>
                    <input
                      className="text-input"
                      value={edge.ownership ?? ""}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, {
                          ownership: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="business-flow__wide">
                    <span>Uncertainty</span>
                    <input
                      className="text-input"
                      value={edge.uncertainty ?? ""}
                      disabled={locked}
                      onChange={(event) =>
                        updateEdge(edge.edge_id, {
                          uncertainty: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                {edge.fact_ids?.length ? (
                  <div className="business-flow__facts">
                    <span>Linked facts</span>
                    {edge.fact_ids.map((factId) => (
                      <button
                        className="chip"
                        type="button"
                        key={factId}
                        onClick={() => onSelectFact(factId)}
                        disabled={locked}
                      >
                        {factId}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="small muted">No linked facts.</p>
                )}
              </article>
            ))
          ) : (
            <p className="muted small">
              Add an ordered relationship after you add actors.
            </p>
          )}
        </div>
      </details>
      {conflict ? (
        <div className="business-flow__conflict">
          <strong>Needs attention: flow changed while you were editing.</strong>
          <p className="small">
            Your local edits are still here. Refresh reads the current saved
            flow without replacing them. Rebase uses that current revision only
            after you choose it.
          </p>
          <div className="btn-row">
            <button
              className="btn review"
              type="button"
              onClick={() => void refreshCurrentFlow()}
              disabled={locked || !onRefresh}
            >
              Refresh current flow
            </button>
            <button
              className="btn quiet"
              type="button"
              onClick={() => void copyLocalFlow()}
              disabled={locked}
            >
              Copy local edits
            </button>
            {refreshedFlow ? (
              <button
                className="btn primary"
                type="button"
                onClick={rebaseLocalEdits}
                disabled={locked}
              >
                Rebase my edits
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {proposedChanges.length ? (
        <details className="business-flow__acceptance">
          <summary>Review proposed facts ({proposedChanges.length})</summary>
          {proposedChanges.map((change) => (
            <label className="checkbox-row" key={change.change_id}>
              <input
                type="checkbox"
                checked={selectedChanges.includes(change.change_id)}
                disabled={locked}
                onChange={() =>
                  setSelectedChanges((current) =>
                    current.includes(change.change_id)
                      ? current.filter((id) => id !== change.change_id)
                      : [...current, change.change_id],
                  )
                }
              />
              <span>{change.text}</span>
            </label>
          ))}
        </details>
      ) : null}
    </section>
  );
}
