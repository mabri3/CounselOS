import type { RecommendationDisposition, RecommendationState } from "./types";

export function recommendationNeedsReason(disposition: RecommendationDisposition): boolean {
  return disposition === "modified" || disposition === "not_followed";
}

export function recommendationBasis(state: RecommendationState | undefined): string[] {
  return state?.current_version_id ? [state.path] : [];
}
