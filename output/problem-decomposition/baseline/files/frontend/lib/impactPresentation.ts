import type {
  ChangedPassage,
  FrozenReference,
  ImpactFinding,
  ReferenceSelection,
  SpecComparison,
} from "./continuityTypes";
import type { ClaimEvidence, UpdateOffer } from "./workspaceTypes";

export type ImpactStatePresentation = {
  word: string;
  detail: string;
  tone: "agent" | "attention" | "failure" | "healthy" | "quiet";
};

const EFFECT_LABELS: Record<ImpactFinding["effect"], string> = {
  remains_supported: "Remains supported",
  changes: "Changes earlier work",
  may_need_review: "May need review",
  unknown: "Effect unknown",
};

const SUPPORT_LABELS: Record<ImpactFinding["support"], string> = {
  linked: "Supported link",
  inferred: "Possible effect",
  unavailable: "Support unavailable",
};

export function impactState(comparison: SpecComparison): ImpactStatePresentation {
  if (comparison.state === "stale") return { word: "Stale", tone: "attention", detail: "The source, selected work, question, facts, or assumptions changed after this comparison was prepared." };
  if (comparison.state === "unavailable" || comparison.difference === "unavailable") return { word: "Comparison unavailable", tone: "quiet", detail: unavailableComparisonDetail(comparison) };
  if (comparison.state === "partial") return { word: "Partial", tone: "attention", detail: "Useful comparison work is available, but some source text, structure, or support is incomplete." };
  if (comparison.state === "complete") return { word: "Complete", tone: "healthy", detail: "The saved analysis uses the frozen source versions and selected saved work shown here." };
  return { word: "Prepared", tone: "agent", detail: "Exact source versions are frozen. Analysis has not changed earlier advice, decisions, or drafts." };
}

export function differencePresentation(difference: SpecComparison["difference"]): ImpactStatePresentation {
  if (difference === "unchanged") return { word: "Text unchanged", tone: "quiet", detail: "No textual difference was found in the available supplied text. This does not decide legal effect." };
  if (difference === "formatting_only") return { word: "Formatting only", tone: "quiet", detail: "Only whitespace differs in the available text. This does not establish legal equivalence." };
  if (difference === "text_changed") return { word: "Text changed", tone: "attention", detail: "Read the exact changed passages before you assess their effect on earlier work." };
  return { word: "Difference unavailable", tone: "quiet", detail: "One or both required source texts are unavailable. Unavailable text is not treated as a deletion." };
}

function unavailableComparisonDetail(comparison: SpecComparison): string {
  const issues: string[] = [];
  if (!comparison.before) issues.push("The earlier source was not supplied");
  else if (comparison.before.extraction_state === "partial") issues.push("The earlier source extraction is partial");
  else if (comparison.before.extraction_state === "failed" || comparison.before.extraction_state === "unavailable" || !comparison.before.text) issues.push("The earlier source text is unavailable");
  if (comparison.after.extraction_state === "partial") issues.push("The current source extraction is partial");
  else if (comparison.after.extraction_state === "failed" || comparison.after.extraction_state === "unavailable" || !comparison.after.text) issues.push("The current source text is unavailable");
  if (!issues.length) return "One or both required source texts are unavailable for an exact comparison. Unavailable text is not treated as a deletion.";
  return `${issues.join(". ")}. An exact before-and-after comparison is unavailable. Unavailable text is not treated as a deletion.`;
}

export function findingEffectLabel(effect: ImpactFinding["effect"]): string {
  return EFFECT_LABELS[effect];
}

export function findingSupportLabel(support: ImpactFinding["support"]): string {
  return SUPPORT_LABELS[support];
}

export function impactAnalysisScope(targets: readonly FrozenReference[] | null | undefined): ImpactStatePresentation {
  if (targets?.length) return { word: "Selected work", tone: "agent", detail: `Analysis covers the supplied source change and ${targets.length} selected item${targets.length === 1 ? "" : "s"} of saved work.` };
  return { word: "Source-only scope", tone: "quiet", detail: "Analysis covers the supplied source change. No earlier advice, recommendation, decision, or draft was selected." };
}

export function impactContextChanged(previousContextKey: string, nextContextKey: string): boolean {
  return previousContextKey !== nextContextKey;
}

export function targetForFinding(comparison: SpecComparison, finding: ImpactFinding): FrozenReference | null {
  return (comparison.targets ?? []).find((target) => target.reference_id === finding.target_id) ?? null;
}

export function passagesForFinding(comparison: SpecComparison, finding: ImpactFinding): ChangedPassage[] {
  const ids = new Set(finding.passage_ids ?? []);
  return (comparison.passages ?? []).filter((passage) => ids.has(passage.passage_id));
}

export function passageEvidence(comparison: SpecComparison, passage: ChangedPassage, side: "before" | "after"): ClaimEvidence {
  const source = side === "before" ? comparison.before : comparison.after;
  const excerpt = side === "before" ? passage.before_text : passage.after_text;
  const locator = side === "before" ? passage.before_locator : passage.after_locator;
  return {
    claim_id: passage.passage_id,
    source_id: source?.source_id || source?.reference_id || "source-unavailable",
    available_excerpt: excerpt || null,
    locator: locator || "Location unavailable",
    support_state: source ? "supplied" : "unknown",
    explanation: source ? `Exact ${side} passage from the frozen supplied source.` : "The earlier source was not available.",
    source_version: source?.revision ?? null,
    source_hash: source?.content_hash ?? null,
    source_label: source?.title,
    path: source?.path ?? null,
  };
}

export function findingPassageEvidence(comparison: SpecComparison, passage: ChangedPassage): ClaimEvidence {
  return passageEvidence(comparison, passage, passage.kind === "deleted" ? "before" : "after");
}

export function selectedReferenceIds(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.trim().length > 0))] : [];
  } catch {
    return [];
  }
}

export function selectedReferences(candidates: ReferenceSelection[], raw: string): ReferenceSelection[] {
  const ids = new Set(selectedReferenceIds(raw));
  return candidates.filter((candidate) => ids.has(candidate.reference_id));
}

export function impactOffer(comparison: SpecComparison, offers: UpdateOffer[] | undefined, offerId: string): UpdateOffer | null {
  if (!(comparison.offer_ids ?? []).includes(offerId)) return null;
  return offers?.find((offer) => offer.offer_id === offerId) ?? null;
}

export const impactRetryDraftKey = (slot: string): string => `__continuity.retry.v1:impact:${slot}`;

type RetryEnvelope<T> = { version: 1; intent_signature: string; command: T };

export function frozenImpactCommand<T extends { source_action_key: string }>(
  stored: string,
  intent: unknown,
  create: () => T,
): { command: T; draft: string; reused: boolean } {
  const intentSignature = JSON.stringify(intent);
  try {
    const envelope = JSON.parse(stored) as Partial<RetryEnvelope<T>>;
    if (envelope.version === 1 && envelope.intent_signature === intentSignature && envelope.command && typeof envelope.command.source_action_key === "string") {
      return { command: envelope.command, draft: stored, reused: true };
    }
  } catch {
    // Invalid parent draft data is replaced by a new frozen command.
  }
  const command = create();
  return { command, draft: JSON.stringify({ version: 1, intent_signature: intentSignature, command }), reused: false };
}
