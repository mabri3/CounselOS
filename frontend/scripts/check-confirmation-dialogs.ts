import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const sources = {
  workspace: read("components/MatterWorkspace.tsx"),
  company: read("components/CompanyInterview.tsx"),
  briefing: read("components/BriefingWorkspace.tsx"),
  settings: read("app/settings/page.tsx"),
  agents: read("app/agents/page.tsx"),
  dialog: read("components/ConfirmationDialog.tsx"),
};

function productionSources(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? productionSources(path) : /\.[jt]sx?$/.test(path) ? [path] : [];
  });
}

for (const path of ["app", "components", "lib"].flatMap((directory) => productionSources(new URL(directory, root).pathname))) {
  assert.doesNotMatch(readFileSync(path, "utf8"), /window\.confirm/, `${path} must not use browser confirmation`);
}
for (const [name, source] of Object.entries(sources)) {
  assert.doesNotMatch(source, /window\.confirm/, `${name} must not use browser confirmation`);
}
for (const [name, source] of Object.entries(Object.fromEntries(Object.entries(sources).filter(([name]) => name !== "dialog")))) {
  assert.match(source, /ConfirmationDialog/, `${name} must use the shared confirmation dialog`);
}
assert.match(sources.dialog, /role="alertdialog"/);
assert.match(sources.dialog, /aria-labelledby=/);
assert.match(sources.dialog, /aria-describedby=/);
assert.match(sources.dialog, />Cancel</);
assert.match(sources.dialog, /confirmLabel/);
assert.match(sources.dialog, /disabled=\{busy\}/);
assert.match(sources.dialog, /setError\(/);
assert.match(sources.workspace, /This records delivery outside Themis\.ai\. It does not send or contact anyone\./);
assert.match(sources.workspace, /performMatterAction\(/);
assert.match(sources.workspace, /onConfirm=\{\(\) => runControl\(manualDeliveryConfirmation, true, true\)\}/);
assert.match(sources.company, /replacement_confirmation: replacementMessage/);
assert.match(sources.settings, /createVault\(/);
assert.match(sources.settings, /loadVault\(/);
assert.doesNotMatch(sources.settings, /NEXT_PUBLIC_DISABLE_VAULT_CONFIRMATION|vaultConfirmDisabled/);
assert.match(sources.settings, /function requestVaultChange\(action: "create" \| "load"\) \{\s*setVaultConfirmation\(action\);\s*\}/);
assert.match(sources.agents, /setDraft\(pendingAgent\)/);
assert.match(sources.briefing, /deleteSavedView\(/);

console.log("confirmation dialog checks passed");
