# Answer contract — handoff progress

Plan: `docs/answer-contract.handoff-prompt.md`

Rewrite each line as `- [x] Step N: <title> — done` immediately after that step's
verification passes. If a new task-caused failure remains after focused
diagnosis, rewrite it as `- [ ] Step N: <title> — FAILED: <what happened>` and
stop. Note a verified pre-existing baseline failure and continue unless it
prevents this task from being verified.

- [x] Step 1: default contract text and AnswerContractService — done
- [x] Step 2: wire the service, inject it into build_system, and align workspace guidance — done
- [x] Step 3: add GET / PUT / reset routes and API models — done
- [x] Step 4: blank-vault manifest entry — done
- [x] Step 5: backend tests — done
- [x] Step 6: Settings panel — done
- [x] Step 7: end-to-end check — done

## Step 7 observation

The live answer used **What would change this** with five ranked, specific items.
The **Not examined** item named the missing primary-source review and made the
tested work feel more bounded. Whether an item caused the lawyer to think “I had
not considered that” still needs the lawyer's own judgment; this run cannot claim
that reaction for them. A saved test-only rule applied on the next message without
a restart. Empty and reset states worked. All four existing vaults opened, the
original Mosaic Relay vault was restored, and the browser reported no console
errors. The configured model did emit a planning preamble before its answer; that
provider-output issue is outside this prompt-only feature and was not hidden or
treated as a successful product signal.
