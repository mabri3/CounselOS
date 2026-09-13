import type { SettingRow, WorkspaceSettings } from "./types";
const effortLabel = (value: string) => value === "default" ? "Default" : value.charAt(0).toUpperCase() + value.slice(1);

export function alignModelRows(rows: SettingRow[], settings: WorkspaceSettings, collection = false): SettingRow[] {
  const providerKey = collection ? "research.model_fallback_provider" : "agents.provider";
  const modelKey = collection ? "research.model_fallback_model" : "agents.reasoning_model";
  const effortKey = collection ? "research.collection_reasoning_effort" : "agents.reasoning_effort";
  const providerRow = rows.find((row) => row.config_key === providerKey);
  const provider = settings.model_catalog.providers.find((entry) => entry.id === providerRow?.value)
    ?? settings.model_catalog.providers[0];
  const currentModel = rows.find((row) => row.config_key === modelKey)?.value;
  const model = provider?.models.find((entry) => entry.id === currentModel) ?? provider?.models[0];
  const currentEffort = rows.find((row) => row.config_key === effortKey)?.value;
  const effort: string = model?.reasoning_efforts.includes(currentEffort ?? "")
    ? currentEffort ?? "default"
    : model?.reasoning_efforts[0] ?? currentEffort ?? "default";
  const modelOptions = provider?.models.length
    ? provider.models
    : currentModel
      ? [{ id: currentModel, label: `${currentModel} (unavailable)`, reasoning_efforts: [] }]
      : [];

  return rows.map((row) => {
    if (row.config_key === providerKey) return { ...row, options: settings.model_catalog.providers.map(p => p.id), option_labels: Object.fromEntries(settings.model_catalog.providers.map(p => [p.id, p.label])) };
    if (row.config_key === modelKey) {
      return {
        ...row,
        value: model?.id ?? currentModel ?? "",
        options: modelOptions.map((entry) => entry.id),
        option_labels: Object.fromEntries(modelOptions.map((entry) => [entry.id, entry.label])),
      };
    }
    if (row.config_key === effortKey) {
      const efforts = model?.reasoning_efforts.length ? model.reasoning_efforts : [effort];
      return {
        ...row,
        value: effort,
        options: efforts,
        option_labels: Object.fromEntries(
          efforts.map((entry) => [entry, effortLabel(entry)]),
        ),
      };
    }
    return row;
  });
}

