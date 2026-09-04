import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { recommendationBasis, recommendationNeedsReason } from "../lib/recommendations.ts";
import { shouldApplyCanonicalRecommendation } from "../lib/matter-workspace.ts";
import type { RecommendationState } from "../lib/types.ts";

const savedRecommendation = {
  matter_id: "MAT-1", path: "03_Matters/demo/recommendations.md", content: "Ship with controls.",
  current_version_id: "REC-1", current_version_number: 1, proposal: null,
} as RecommendationState;
assert.equal(
  shouldApplyCanonicalRecommendation(savedRecommendation, null, "MAT-1"),
  false,
  "a stale empty reload must not clear a confirmed saved recommendation",
);
assert.equal(
  shouldApplyCanonicalRecommendation(savedRecommendation, null, "MAT-2"),
  true,
  "an empty canonical value for a different matter must clear the prior matter's recommendation",
);

assert.equal(recommendationNeedsReason("followed"), false);
assert.equal(recommendationNeedsReason("modified"), true);
assert.equal(recommendationNeedsReason("not_followed"), true);
assert.deepEqual(recommendationBasis({
  path: "03_Matters/demo/recommendations.md", content: "Ship with controls.",
  current_version_id: "REC-1", proposal: null,
}), ["03_Matters/demo/recommendations.md"]);
assert.deepEqual(recommendationBasis({ path: "x", content: "", current_version_id: null, proposal: null }), []);
const recommendationService = readFileSync(new URL("../../backend/app/services/recommendations.py", import.meta.url), "utf8");
const panel = readFileSync(new URL("../components/RecommendationPanel.tsx", import.meta.url), "utf8");
assert.match(recommendationService, /def is_configured_path/);
assert.match(recommendationService, /recommendations\.md/);
assert.match(panel, /Legacy recommendation/);
assert.match(panel, /Save lawyer edit/);
assert.match(panel, /Accept recommendation update/);
assert.match(panel, /updateRecommendation\(/);
assert.match(panel, /acceptRecommendation\(/);
assert.doesNotMatch(panel, /getFile\(|saveFile\(|updateDocumentReview\(/);
console.log("recommendation integrity checks passed");
