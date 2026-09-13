import { currentContinuityStorageKey } from "./api.ts";
import type { DraftRequest, LocalEditorSnapshot, OutputTemplate, WorkspaceView } from "./workspaceTypes";

export interface WorkspaceDraftingPreferences {
  version: 1;
  view: WorkspaceView;
  activeArtifactPath: string | null;
  selectedTemplateId: string | null;
  instruction: string;
  overrides: Record<string, string>;
  sourceActionKey: string | null;
  sourceActionFingerprint: string | null;
}

const STORAGE_PREFIX = "themis:workspace-drafting:";

export function workspaceDraftingStorageKey(matterId: string): string {
  const scoped = currentContinuityStorageKey(matterId, "view");
  if (scoped) return scoped;
  return `${STORAGE_PREFIX}${encodeURIComponent(matterId)}`;
}

export function defaultWorkspaceDraftingPreferences(): WorkspaceDraftingPreferences {
  return {
    version: 1,
    view: "understand",
    activeArtifactPath: null,
    selectedTemplateId: null,
    instruction: "",
    overrides: {},
    sourceActionKey: null,
    sourceActionFingerprint: null,
  };
}

function isWorkspaceView(value: unknown): value is WorkspaceView {
  return value === "understand" || value === "discuss" || value === "draft";
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function stringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export function normalizeWorkspaceDraftingPreferences(value: unknown): WorkspaceDraftingPreferences {
  const fallback = defaultWorkspaceDraftingPreferences();
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const saved = value as Record<string, unknown>;
  return {
    version: 1,
    view: isWorkspaceView(saved.view) ? saved.view : fallback.view,
    activeArtifactPath: stringOrNull(saved.activeArtifactPath),
    selectedTemplateId: stringOrNull(saved.selectedTemplateId),
    instruction: typeof saved.instruction === "string" ? saved.instruction : "",
    overrides: stringMap(saved.overrides),
    sourceActionKey: stringOrNull(saved.sourceActionKey),
    sourceActionFingerprint: stringOrNull(saved.sourceActionFingerprint),
  };
}

export function readWorkspaceDraftingPreferences(storage: Pick<Storage, "getItem">, matterId: string): WorkspaceDraftingPreferences {
  try {
    const raw = storage.getItem(workspaceDraftingStorageKey(matterId));
    return raw ? normalizeWorkspaceDraftingPreferences(JSON.parse(raw)) : defaultWorkspaceDraftingPreferences();
  } catch {
    return defaultWorkspaceDraftingPreferences();
  }
}

export function writeWorkspaceDraftingPreferences(
  storage: Pick<Storage, "setItem">,
  matterId: string,
  preferences: WorkspaceDraftingPreferences,
): void {
  storage.setItem(workspaceDraftingStorageKey(matterId), JSON.stringify(normalizeWorkspaceDraftingPreferences(preferences)));
}

export function newWorkspaceDraftActionKey(matterId: string, now = Date.now(), random = Math.random()): string {
  return `draft:${encodeURIComponent(matterId)}:${now.toString(36)}:${Math.floor(random * 0x100000).toString(36)}`;
}

/** A completed request may open its result only when the lawyer stayed on its frozen source. */
export function shouldOpenCompletedDraft(currentArtifactPath: string | null, submittedArtifactPath: string | null): boolean {
  return currentArtifactPath === submittedArtifactPath;
}

export function matchingLocalEditorSnapshot(
  targetPath: string | null | undefined,
  snapshot: LocalEditorSnapshot | null,
  targetDocumentId?: string | null,
): LocalEditorSnapshot | null {
  if (!snapshot?.dirty || !targetPath || snapshot.path !== targetPath) return null;
  if (targetDocumentId && snapshot.document_id !== targetDocumentId) return null;
  return snapshot;
}

export interface FrozenWorkspaceDocumentAction {
  matterId: string;
  documentId: string;
  path: string;
  revision: string;
  reviewRevision?: string | null;
}

export function freezeWorkspaceDocumentAction(
  matterId: string,
  documentId: string,
  path: string,
  revision: string,
  reviewRevision?: string | null,
): FrozenWorkspaceDocumentAction {
  return { matterId, documentId, path, revision, reviewRevision };
}

/** A completion may update only the exact document/version named at submission. */
export function isFrozenWorkspaceDocumentActionCurrent(
  frozen: FrozenWorkspaceDocumentAction,
  matterId: string,
  documentId: string | null | undefined,
  path: string | null | undefined,
  revision: string | null | undefined,
): boolean {
  return frozen.matterId === matterId
    && frozen.documentId === documentId
    && frozen.path === path
    && frozen.revision === revision;
}

/** Browser persistence starts only after the restored values have rendered for this matter. */
export function canPersistWorkspaceDraftingPreferences(hydratedMatterId: string | null, matterId: string): boolean {
  return hydratedMatterId === matterId;
}

export function restoredOutputTemplate(templates: OutputTemplate[], templateId: string | null): OutputTemplate | null {
  return templates.find((template) => template.template_id === templateId) ?? null;
}

function stableValue(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().filter((key) => record[key] !== undefined).map((key) => `${JSON.stringify(key)}:${stableValue(record[key])}`).join(",")}}`;
}

/** This is an exact, local retry identity for the frozen request, not a server record. */
export function workspaceDraftRequestFingerprint(request: Omit<DraftRequest, "source_action_key">): string {
  return stableValue(request);
}

export function reusableWorkspaceDraftActionKey(
  savedKey: string | null,
  savedFingerprint: string | null,
  requestFingerprint: string,
  makeKey: () => string,
): string {
  return savedKey && savedFingerprint === requestFingerprint ? savedKey : makeKey();
}

export interface WorkspaceDraftingActionToken { matterId: string; generation: number }

/** Keeps an awaited UI action from changing state after navigation to another matter. */
export class WorkspaceDraftingActionTracker {
  private matterId: string;
  private generation = 0;

  constructor(matterId: string) { this.matterId = matterId; }

  setMatter(matterId: string): void {
    if (this.matterId === matterId) return;
    this.matterId = matterId;
    this.generation += 1;
  }

  begin(): WorkspaceDraftingActionToken {
    this.generation += 1;
    return { matterId: this.matterId, generation: this.generation };
  }

  isCurrent(token: WorkspaceDraftingActionToken): boolean {
    return token.matterId === this.matterId && token.generation === this.generation;
  }
}
