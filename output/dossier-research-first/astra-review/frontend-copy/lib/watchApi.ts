import { request } from "./api";
import type {
  AwarenessSchedule,
  BriefingAskRequest,
  BriefingConnectAction,
  BriefingItem,
  BriefingQuery,
  BriefingResearchRequest,
  Digest,
  DigestSchedulePut,
  DurableResult,
  ListResponse,
  Mitigation,
  MitigationCreate,
  MitigationPatch,
  ProviderCapability,
  ReviewAction,
  ReviewOutcome,
  ReviewPacket,
  SavedView,
  SavedViewCreate,
  SavedViewPatch,
  Scan,
  Watch,
  WatchAnswer,
  WatchDraftCreate,
  WatchPatch,
  WatchScanRequest,
  WatchSource,
  WatchStateRequest,
} from "./watchTypes";

type PageOptions = { cursor?: string | null; limit?: number };

export type WatchScanResult = {
  scan: Scan;
  preview_items: BriefingItem[];
  preview_packets: ReviewPacket[];
};

export type WatchAnswerResult = {
  watch: Watch;
  next_question: null;
};

export type WatchActivationResult = {
  watch: Watch;
  schedule: AwarenessSchedule | null;
};

function withQuery(path: string, values: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function briefingPath(query: Partial<BriefingQuery>): string {
  return withQuery("/briefing/items", { ...query });
}

export function getProviderCapabilities(): Promise<ListResponse<ProviderCapability>> {
  return request("/intelligence/providers");
}

export function getIntelligenceSources(): Promise<ListResponse<WatchSource>> {
  return request("/intelligence/sources");
}

export function getWatches(options: PageOptions = {}): Promise<ListResponse<Watch>> {
  return request(withQuery("/watches", options));
}

export function createWatchDraft(payload: WatchDraftCreate): Promise<Watch> {
  return request("/watches/drafts", { method: "POST", body: JSON.stringify(payload) });
}

export function getWatch(watchId: string): Promise<Watch> {
  return request(`/watches/${encodeURIComponent(watchId)}`);
}

export function updateWatch(watchId: string, payload: WatchPatch): Promise<Watch> {
  return request(`/watches/${encodeURIComponent(watchId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function answerWatch(watchId: string, payload: WatchAnswer): Promise<WatchAnswerResult> {
  return request(`/watches/${encodeURIComponent(watchId)}/answers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function scanWatch(watchId: string, payload: WatchScanRequest = {}): Promise<WatchScanResult> {
  return request(`/watches/${encodeURIComponent(watchId)}/scan`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function activateWatch(watchId: string, payload: WatchStateRequest): Promise<WatchActivationResult> {
  return request(`/watches/${encodeURIComponent(watchId)}/activate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function pauseWatch(watchId: string, payload: WatchStateRequest): Promise<Watch> {
  return request(`/watches/${encodeURIComponent(watchId)}/pause`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getWatchRuns(watchId: string, options: PageOptions = {}): Promise<ListResponse<Scan>> {
  return request(withQuery(`/watches/${encodeURIComponent(watchId)}/runs`, options));
}

export function getBriefingItems(query: Partial<BriefingQuery> = {}): Promise<ListResponse<BriefingItem>> {
  return request(briefingPath(query));
}

export function getBriefingItem(itemId: string): Promise<BriefingItem> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}`);
}

export function getBriefingConversation(itemId: string): Promise<ListResponse<DurableResult>> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}/conversation`);
}

export function triageBriefingItem(
  itemId: string,
  payload: { expected_revision: number; read?: boolean; saved?: boolean; usefulness?: "useful" | "not_useful" | null },
): Promise<BriefingItem> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function askBriefingItem(itemId: string, payload: BriefingAskRequest): Promise<DurableResult> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}/ask`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function researchBriefingItem(itemId: string, payload: BriefingResearchRequest = {}): Promise<DurableResult> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}/research`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function connectBriefingItem(itemId: string, payload: BriefingConnectAction): Promise<BriefingItem> {
  return request(`/briefing/items/${encodeURIComponent(itemId)}/connect`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSavedViews(options: PageOptions = {}): Promise<ListResponse<SavedView>> {
  return request(withQuery("/briefing/views", options));
}

export function createSavedView(payload: SavedViewCreate): Promise<SavedView> {
  return request("/briefing/views", { method: "POST", body: JSON.stringify(payload) });
}

export function updateSavedView(viewId: string, payload: SavedViewPatch): Promise<SavedView> {
  return request(`/briefing/views/${encodeURIComponent(viewId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteSavedView(viewId: string, expectedRevision: number): Promise<void> {
  return request(withQuery(`/briefing/views/${encodeURIComponent(viewId)}`, {
    expected_revision: expectedRevision,
  }), { method: "DELETE" });
}

export function createSavedViewDigest(viewId: string): Promise<Digest> {
  return request(`/briefing/views/${encodeURIComponent(viewId)}/digest`, { method: "POST" });
}

export function scheduleSavedViewDigest(viewId: string, payload: DigestSchedulePut): Promise<AwarenessSchedule> {
  return request(`/briefing/views/${encodeURIComponent(viewId)}/schedule`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getDigests(options: PageOptions = {}): Promise<ListResponse<Digest>> {
  return request(withQuery("/briefing/digests", options));
}

export function getDigest(digestId: string): Promise<Digest> {
  return request(`/briefing/digests/${encodeURIComponent(digestId)}`);
}

export function getReviewPackets(options: PageOptions = {}): Promise<ListResponse<ReviewPacket>> {
  return request(withQuery("/review-packets", options));
}

export function getReviewPacket(packetId: string): Promise<ReviewPacket> {
  return request(`/review-packets/${encodeURIComponent(packetId)}`);
}

export function actOnReviewPacket(packetId: string, payload: ReviewAction): Promise<ReviewOutcome> {
  return request(`/review-packets/${encodeURIComponent(packetId)}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMatterMitigations(matterId: string): Promise<{ items: Mitigation[] }> {
  return request(`/matters/${encodeURIComponent(matterId)}/mitigations`);
}

export function createMatterMitigation(matterId: string, payload: MitigationCreate): Promise<Mitigation> {
  return request(`/matters/${encodeURIComponent(matterId)}/mitigations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMatterMitigation(
  matterId: string,
  mitigationId: string,
  payload: MitigationPatch,
): Promise<Mitigation> {
  return request(
    `/matters/${encodeURIComponent(matterId)}/mitigations/${encodeURIComponent(mitigationId)}`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export const listWatches = getWatches;
export const listWatchRuns = getWatchRuns;
export const listBriefingItems = getBriefingItems;
export const patchBriefingItem = triageBriefingItem;
export const listSavedViews = getSavedViews;
export const createDigest = createSavedViewDigest;
export const scheduleDigest = scheduleSavedViewDigest;
export const listDigests = getDigests;
export const listReviewPackets = getReviewPackets;
export const recordReviewAction = actOnReviewPacket;
export const listMatterMitigations = getMatterMitigations;
