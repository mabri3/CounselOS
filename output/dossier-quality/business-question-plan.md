# Business-question-led dossier

## Outcome

The dossier answers the business's controlling question. Follow-up questions,
evidence and alternative paths support or challenge that answer. They do not
silently replace the question. An explicit lawyer reframe remains controlling.

## Proof

Generate from a later conversation after an older conversation raised a material
issue absent from the issue list. Supply a subsequent correction, an unadopted
hypothetical, a misleading old dossier and an unrelated recent question. The
new dossier must answer the business question, use the older material with its
source, apply the correction, and keep the hypothetical separate. Repeat the
generation without depending on the previous dossier's prose.

## Build

1. Reuse the canonical business-question field and original request. Distinguish
   them from the latest chat instruction and from a proposed reframe.
2. Capture all eligible matter conversations with message identity, date and
   scope. Include saved documents and prior work. Respect source exclusions.
3. Give the existing preparation/writing call a compact record view and one
   read-only search/read tool over that frozen snapshot. No filesystem path from
   model output is opened. Full passages remain available beyond initial excerpts.
4. Remove the prior dossier's 6,000-character opening as a primary writing input.
   Keep the complete prior document available as fallible analysis and lawyer work.
5. Update shared writing/preparation guidance: assess materiality against the
   business objective; identify missing issues; challenge unsupported premises;
   preserve corrections, hypothetical scope and recommendation/decision distinctions.
6. Keep existing asynchronous runs, five-minute execution limit, saved research,
   source identities and concurrent-edit protection. Deliver useful output if a
   read or model step fails.

## Verification

- Reproduce missing old/other-conversation content before the fix.
- Test frozen reads, paging, exclusions, no cross-matter reads, late corrections,
  question stability, failure recovery and read-only tool permissions.
- Run affected tests, backend suite, frontend typecheck/build, and relevant browser
  acceptance in an isolated vault.
- Read configured-model outputs on synthetic matters. Record quality separately
  from deterministic application checks. No blanket A claim.

## Not scheduled

No new agent, verifier, database, background memory pipeline, embedding service,
or automatic decision/issue approval workflow. Consider a different retrieval
mechanism only if the bounded saved-record reader demonstrably misses relevant
material in these tests. No Harbor-specific issue rules.

## Completion

The six build steps are implemented. The missing-history and original-request
tests failed before the change and pass now. Six configured-model generations,
an isolated browser walk, the full backend test groups and focused reruns,
frontend checks, and the code graph update are complete.

Read [the assessment](business-question-assessment.md) for exact evidence,
test-run qualifications, and remaining limits. No live matter was regenerated
for the new history checks. Its shared writing skill received the general rules.
