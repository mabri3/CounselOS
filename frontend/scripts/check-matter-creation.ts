import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createMatter, matterTargetDateFromForm } from "../lib/api.ts";

const form = readFileSync(new URL("../components/NewMatterForm.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");

assert.match(form, /submitLocked\.current/, "the form must lock before asynchronous work starts");
assert.match(form, /sourceActionKey\.current \?\?=/, "a retry must reuse one creation action key");
assert.match(form, /source_action_key:\s*sourceActionKey\.current/, "the creation request must carry its action key");
assert.match(
  form,
  /setCreated\(true\);[\s\S]{0,220}setOpen\(false\)/,
  "a successful durable response must set created state before the form collapses",
);
assert.match(
  form,
  /if \(!open\) \{[\s\S]{0,500}\{created \? \([\s\S]{0,240}<p role="status"[\s\S]{0,180}Matter created\. Intake is starting\./,
  "the post-submit collapsed view must render the durable intake-pending status",
);
assert.match(form, /name="target_date"/, "the date input must be part of native form submission");
assert.match(form, /new FormData\(event\.currentTarget\)/, "submit must capture the actual form controls before asynchronous work");
assert.match(form, /target_date:\s*submittedTargetDate/, "the request must use the submitted DOM date instead of delayed component state");
assert.match(api, /createMatter\(payload: MatterCreatePayload\)[\s\S]+JSON\.stringify\(payload\)/, "the API client must send the typed creation payload unchanged");

const submittedForm = new FormData();
submittedForm.set("target_date", "2026-09-15");
assert.equal(
  matterTargetDateFromForm(submittedForm),
  "2026-09-15",
  "the payload helper must capture the DOM date even when React state is stale",
);
submittedForm.set("target_date", "");
assert.equal(matterTargetDateFromForm(submittedForm), null, "an empty DOM date must remain null");

let sentBody = "";
globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
  sentBody = String(init?.body ?? "");
  return new Response(JSON.stringify({ matter_id: "MAT-1" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}) as typeof fetch;

await createMatter({
  title: "Date transport",
  request_text: "Review the launch.",
  matter_type: "product_launch",
  priority: "normal",
  target_date: "2026-09-15",
  legal_owner: "Lawyer",
  requester: "Product",
  description: "Review the launch.",
  source_action_key: "matter-create:form:test",
});

assert.equal(JSON.parse(sentBody).target_date, "2026-09-15", "createMatter must preserve the date in the HTTP request body");
assert.equal(JSON.parse(sentBody).source_action_key, "matter-create:form:test", "createMatter must preserve the duplicate-prevention key");

console.log("Matter creation checks passed.");
