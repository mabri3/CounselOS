# Experimental answer quality repair

## Findings

The actual Harbor 2 runs on September 10–11 returned 95, 85, 48, 84 and 73 words for the summary, hypothetical and comparison turns. The most recent comparison's raw provider output matches the saved visible reply. Its run completed without a timeout or failure. There is no evidence of display truncation in this sample.

The frozen experimental guidance prescribed a 60–100-word ceiling, 30-second reading target, short sections, at most three bullets, and a separate document for substantial explanation. These conflicting instructions compressed substance despite other prompts asking for full legal reasoning. Operational confirmations can appropriately remain brief; the defect concerns requested explanations and comparisons.

The compare_paths result supplied names, assumptions and conditions, but omitted saved analysis and summaries. The baseline appeared as Current approach with empty assumptions and conditions. A model could thus substitute its own view of what that label means.

## Changes

- Removed blanket word, sentence and reading-time ceilings. Retained plain language, useful structure and concise confirmations.
- Keep requested explanation in chat. Documents are for requested deliverables.
- Comparison guidance describes each option, compares the same dimensions, distinguishes assumptions and explains the basis for claimed advantages or a recommendation.
- compare_paths includes saved summaries, bounded analysis, staleness information and a path for a full read. Existing source exclusions still withhold historical prose.
- Step six's former Use as direction action is now Make this our current approach under Approaches → Details. It is above the long saved description and conditions. The guide identifies the renamed control.
- Chat tables have readable column widths, horizontal scrolling, a visible scroll hint and keyboard focus.

## Model check

One read-only Sol Medium replay used the recorded Harbor comparison context with the revised guidance and richer comparison result. No matter tools were executed and no historical answers were replaced. Visible prose grew from 73 to 313 words, excluding optional structured metadata. It described each structure, compared five shared dimensions, stated the open conditions and source limits, and gave a working view. This is a qualitative check of one response, not a legal-accuracy benchmark or proof of every future answer. The final wording also prefers paragraphs for explanation-heavy comparisons.

The model call completed and the result was saved. The local replay script initially raised a cleanup error because provider.close is synchronous. The cleanup call was corrected without repeating the model call.

## Browser check

The real frontend and backend ran with a scripted provider and isolated vault. The recorded model prose was used as a rendering fixture. Checks passed for direct comparison submission, preserved unsent draft, readable table widths, horizontal access to the other option, visible direction action, promotion/restoration, conflict recovery, saved note, archive, and unchanged actual facts. This browser fixture verifies plumbing and rendering; it does not generate a new model answer.

Automated and build results are in answer-quality-full-tests.log and answer-quality-build.log. All earlier verification artifacts remain available. The live backend reports the updated dialogue and answer guidance. Refresh the page for updated controls; send a new comparison to see a new answer.

Final results: 1,492 backend tests passed (6 existing warnings, 700.04 seconds). Frontend typecheck and production build passed. The final browser flow passed with no page errors.
