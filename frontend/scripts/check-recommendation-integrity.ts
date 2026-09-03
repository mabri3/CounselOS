import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { recommendationBasis, recommendationNeedsReason } from "../lib/recommendations.ts";

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
