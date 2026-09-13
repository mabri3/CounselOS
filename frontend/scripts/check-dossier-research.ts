import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { canResumeDossierIssue, dossierCompletionStage, dossierControls, dossierStateWord, mergeBackgroundDraft, normalizeDossierStatus, pollingScopeMatches, publicationToken, setIssueAt, startPayload } from "../lib/dossierRequests.ts";

const fallback = { requestId: "DOR-1", matterId: "MAT-1" };
const legacy = normalizeDossierStatus(undefined, fallback);
assert.equal(legacy.request_id, "DOR-1");
assert.deepEqual(legacy.issues, []);
assert.deepEqual(legacy.publications, []);

const malformed = normalizeDossierStatus({ issues: "bad", publications: { bad: true }, priorities: [null], source_scope: ["bad"], counts: { total: "five" } }, fallback);
assert.deepEqual(malformed.issues, []);
assert.deepEqual(malformed.publications, []);
assert.equal(malformed.counts.total, 0);

const base = normalizeDossierStatus({
  request_id: "DOR-1", matter_id: "MAT-1", state: "running", phase: "first_batch", sequence: 2, plan_revision: "plan-2",
  priorities: [{ key: "p1", text: "Priority one", why: "Material", issue_ids: ["I-1"] }],
  first_issue_ids: ["I-1", "I-2", "I-3"], planned_issue_ids: ["I-1", "I-2", "I-3", "I-4"], counts: { total: 4 },
  issues: [
    { issue_id: "I-1", title: "One", state: "saved", sources_read: 4, sources_retrieved: 5 },
    { issue_id: "I-2", title: "Two", state: "partial", sources_read: 2, sources_retrieved: 3 },
    { issue_id: "I-3", title: "Three", state: "running", sources_read: 1, sources_retrieved: 1 },
    { issue_id: "I-4", title: "Four", state: "not_selected", sources_read: 0, sources_retrieved: 0 },
  ], publications: [],
}, fallback);
const reordered = setIssueAt(base.first_issue_ids, 0, "I-2", base.issues.map(issue => issue.issue_id));
assert.deepEqual(reordered, ["I-2", "I-1", "I-3"], "selection order stays unique");
const payload = startPayload(base, "research", base.priorities, reordered, "all", { external: true, other_matters: false, public_query: "public topic", provider_ids: ["one", "one"] }, "action-1");
assert.deepEqual(payload.first_issue_ids, ["I-2", "I-1", "I-3"]);
assert.deepEqual(payload.source_choice.provider_ids, ["one", "one"], "provider order is transmitted without inventing providers");
assert.equal(payload.scope, "all");
assert.equal(base.issues[0].sources_read, 4, "counts come from saved status");
assert.equal(base.issues[1].sources_retrieved, 3);
assert.equal(dossierStateWord("partial"), "Partial");
assert.deepEqual(dossierControls(base), { stop: true, resume: false, retry: false });
assert.deepEqual(dossierControls({ ...base, state: "stopped" }), { stop: false, resume: true, retry: false });
assert.deepEqual(dossierControls({ ...base, state: "failed" }), { stop: false, resume: false, retry: true });
const researching = { ...base, execution_mode: "research" as const };
assert.equal(canResumeDossierIssue(researching, base.issues[1]), true, "An unfinished issue can resume while siblings run.");
assert.equal(canResumeDossierIssue({ ...researching, state: "completed" }, base.issues[1]), true, "Legacy complete parents do not hide unfinished work.");
assert.equal(canResumeDossierIssue(researching, base.issues[0]), false, "A complete issue is not repeated.");
assert.equal(canResumeDossierIssue(researching, base.issues[2]), false, "A running issue cannot get a duplicate worker.");
assert.equal(canResumeDossierIssue({ ...researching, stop_requested: true }, base.issues[1]), false);
assert.equal(dossierCompletionStage(base), "working");
const firstPass = { ...base, first_pass_ready_at: "2026-09-11T00:00:00Z", publications: [{ key: "first", state: "applied", revision_path: "dossier-revisions/one.md" }] };
assert.equal(dossierCompletionStage(firstPass), "first_pass");
assert.equal(dossierCompletionStage({ ...firstPass, state: "completed", issues: base.issues.map(issue => ({ ...issue, state: "saved" })) }), "complete");
assert.equal(dossierCompletionStage({ ...firstPass, state: "completed" }), "partial");
assert.notEqual(publicationToken(base), publicationToken(firstPass));
assert.equal(pollingScopeMatches("MAT-1", "CON-1", "MAT-1", "CON-2"), false, "a stale result is ignored after conversation change");
assert.equal(mergeBackgroundDraft("My unsent question", "Review new issue"), "My unsent question\n\nReview new issue", "background updates retain the draft");

const card = readFileSync(new URL("../components/DossierResearchCard.tsx", import.meta.url), "utf8");
const cards = readFileSync(new URL("../components/ChatCards.tsx", import.meta.url), "utf8");
const standard = readFileSync(new URL("../components/ChatPanel.tsx", import.meta.url), "utf8");
const experimental = readFileSync(new URL("../components/experimental/ExperimentalChat.tsx", import.meta.url), "utf8");
for (const text of ["Prepare your dossier", "Start dossier research", "Use saved material now", "First dossier ready", "Update ready for review", "Stop", "Resume", "Open saved answer"]) assert.match(card, new RegExp(text));
assert.match(card, /setTimeout\(poll, 2000\)/, "active request polling is near two seconds");
assert.match(card, /next\.sequence >= current\.sequence/, "saved cards hydrate current request state without regressing newer progress");
assert.match(card, /ResearchScopeFields/, "setup reuses the normal source fields");
assert.match(cards, /DossierResearchCard/, "the shared card renderer is wired");
assert.match(standard, /refreshDossierConversation/);
assert.match(standard, /mergeBackgroundDraft/);
assert.match(experimental, /themis-dossier-follow-up/);
assert.match(experimental, /preserveResearchScroll/);
console.log("dossier research checks passed");
