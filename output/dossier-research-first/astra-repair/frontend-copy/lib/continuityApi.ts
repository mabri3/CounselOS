"use client";
import { useEffect, useState } from "react";
import { request, setContinuityTransport } from "./api";
import type { ActionActor, DemoRoster, WorkTarget } from "./continuityTypes";
export interface ContinuityIdentity { roster: DemoRoster; actor: ActionActor }
let identity: ContinuityIdentity | null = null;
let loading: Promise<ContinuityIdentity> | null = null;
const eventName = "themis-continuity-person";
export const continuityKey = (vault: string, person: string, matter: string, slot: string) => `themis.continuity.v1:${[vault, person, matter, slot].map(encodeURIComponent).join(":")}`;
export function targetUrl(target: WorkTarget): string {
  const query = new URLSearchParams({ continuity_kind: target.kind, continuity_id: target.target_id, view: target.view ?? "understand" });
  if (target.path) query.set("file", target.path);
  return `/matters/${encodeURIComponent(target.matter_id)}?${query}`;
}
function publish(next: ContinuityIdentity) {
  identity = next;
  setContinuityTransport(next.roster.vault_key, next.actor.person_id, next.actor.mode === "demo");
  window.dispatchEvent(new Event(eventName));
}
export async function loadContinuityIdentity(refresh = false): Promise<ContinuityIdentity> {
  if (identity && !refresh) return identity;
  if (loading) return loading;
  loading = request<DemoRoster & { actor: ActionActor }>("/team", { headers: { "X-Themis-Person-Id": "" } }).then(roster => {
    const stored = window.sessionStorage.getItem(`themis.continuity.v1:${encodeURIComponent(roster.vault_key)}:person`);
    const person = roster.enabled ? roster.people?.find(p => p.person_id === stored) : null;
    const actor: ActionActor = person ? { person_id: person.person_id, display_name: person.display_name, mode: "demo" } : roster.actor;
    const next = { roster, actor }; publish(next); return next;
  }).finally(() => { loading = null; });
  return loading;
}
export async function switchContinuityPerson(personId: string) {
  const current = await loadContinuityIdentity();
  const person = current.roster.people?.find(p => p.person_id === personId);
  if (!person || !current.roster.enabled) throw new Error("This person is unavailable.");
  window.sessionStorage.setItem(`themis.continuity.v1:${encodeURIComponent(current.roster.vault_key)}:person`, personId);
  publish({ roster: current.roster, actor: { person_id: personId, display_name: person.display_name, mode: "demo" } });
}
export function useContinuityIdentity() {
  const [value, setValue] = useState<ContinuityIdentity | null>(identity);
  const [error, setError] = useState("");
  useEffect(() => {
    const update = () => setValue(identity);
    window.addEventListener(eventName, update);
    void loadContinuityIdentity().then(setValue).catch(e => setError(e.message));
    return () => window.removeEventListener(eventName, update);
  }, []);
  return { identity: value, error, switchPerson: switchContinuityPerson };
}
export function continuityCommand<T>(matterId: string, path: string, method = "GET", body?: unknown, actor?: ActionActor): Promise<T> {
  return request<T>(`/matters/${encodeURIComponent(matterId)}/workspace${path}`, {
    method, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...(actor ? { headers: { "X-Themis-Person-Id": actor.mode === "demo" ? actor.person_id : "" } } : {}),
  });
}
