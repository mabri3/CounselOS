module.exports = [
"[project]/components/workspace/ScenarioPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScenarioPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterScenario.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
const keyFor = (prefix)=>`${prefix}:${crypto.randomUUID()}`;
const LONG_ANALYSIS_CHARACTER_LIMIT = 1200;
function longAnalysisPreview(analysis) {
    if (analysis.length <= LONG_ANALYSIS_CHARACTER_LIMIT) return analysis;
    if (/!?\[[^\]]+\]\[[^\]]*\]|^\s*\[[^\]]+\]:/m.test(analysis)) return analysis;
    let fence = null;
    let position = 0;
    let previewEnd = 0;
    for (const line of analysis.split(/(?<=\n)/)){
        position += line.length;
        const marker = line.match(/^\s*(`{3,}|~{3,})/);
        if (marker) {
            const nextFence = marker[1];
            if (!fence) fence = {
                character: nextFence[0],
                length: nextFence.length
            };
            else if (fence.character === nextFence[0] && nextFence.length >= fence.length) fence = null;
        }
        if (!fence && /^\s*\n$/.test(line) && position <= LONG_ANALYSIS_CHARACTER_LIMIT) previewEnd = position;
    }
    return previewEnd ? analysis.slice(0, previewEnd).trimEnd() : analysis;
}
const analysisMarkdownComponents = {
    table: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scenario-analysis__table",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 34,
                columnNumber: 96
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
            lineNumber: 34,
            columnNumber: 54
        }, ("TURBOPACK compile-time value", void 0)),
    pre: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
            className: "scenario-analysis__code",
            children: children
        }, void 0, false, {
            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
            lineNumber: 35,
            columnNumber: 52
        }, ("TURBOPACK compile-time value", void 0))
};
function hasScenarioCitations(claimIds, claims) {
    return claimIds.some((id)=>{
        const matches = claims.filter((claim)=>claim.claim_id === id);
        return matches.length === 1 && matches[0].evidence.some((item)=>Boolean(item.available_excerpt && item.source_id && (item.path || item.url)));
    });
}
function staleDetails(scenario, current) {
    const paths = new Set([
        ...Object.keys(scenario.baseline_revisions),
        ...Object.keys(current)
    ]);
    return [
        ...paths
    ].filter((path)=>scenario.baseline_revisions[path] !== current[path]);
}
function receiptNotice(receipt, saved) {
    if (receipt.state === "applied") return {
        tone: "healthy",
        word: "Saved",
        message: saved
    };
    if (receipt.state === "proposed") return {
        tone: "attention",
        word: "Proposed",
        message: "It is not applied."
    };
    return {
        tone: "failure",
        word: "Not saved",
        message: receipt.failure_detail || "The change was not saved."
    };
}
function actionNotice(state, saved) {
    if (state === "saved") return {
        tone: "healthy",
        word: "Saved",
        message: saved
    };
    if (state === "proposed") return {
        tone: "attention",
        word: "Proposed",
        message: "It is not applied."
    };
    if (state === "failed" || state === "not_saved") return {
        tone: "failure",
        word: "Not saved",
        message: `Analysis ${state}.`
    };
    return {
        tone: "agent",
        word: state === "queued" ? "Queued" : "Working",
        message: `Analysis ${state}.`
    };
}
function hasCompleteBaseline(scenario, current) {
    return Object.keys(scenario.baseline_revisions).length > 0 && staleDetails(scenario, current).length === 0;
}
function sourceLabel(path) {
    try {
        const url = new URL(path);
        return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
    } catch  {
        return path.split("/").at(-1)?.replaceAll("_", " ") || path;
    }
}
function isExternalSource(path) {
    return /^https?:\/\//i.test(path);
}
function isInternalSource(path) {
    return Boolean(path.trim()) && !/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.includes("\\") && !path.split("/").includes("..");
}
function scenarioFactChanges(changesText, hypotheticalFactId, sourceKey) {
    return changesText.split("\n").map((text)=>text.trim()).filter(Boolean).map((text, index)=>({
            change_id: `change-${index + 1}-${sourceKey}`,
            fact_id: hypotheticalFactId || null,
            text
        }));
}
async function runScenarioAnalysis(input) {
    let target = input.createNew ? null : input.selected;
    if (!target) {
        const createSourceKey = input.getCreateSourceKey();
        const factLabel = input.facts.find((fact)=>fact.fact_id === input.hypotheticalFactId)?.text;
        target = await input.onCreate({
            title: `Working scenario — ${(factLabel || input.changesText.trim().split("\n")[0]).slice(0, 80)}`,
            baseline_revisions: input.currentRevisions,
            issue_ids: input.initialIssueId ? [
                input.initialIssueId
            ] : [],
            proposed_fact_changes: scenarioFactChanges(input.changesText, input.hypotheticalFactId, createSourceKey),
            source_action_key: createSourceKey
        });
        input.onSelect(target.scenario_id);
    }
    const sourceActionKey = input.getAnalysisSourceKey(target);
    const command = {
        instruction: input.instruction,
        expected_scenario_revision: target.revision ?? "",
        baseline_revisions: {
            ...target.baseline_revisions
        },
        source_action_key: sourceActionKey
    };
    // Legacy seam: onAnalyze(selected.scenario_id, analysisInstruction.trim(), sourceActionKey).
    const result = input.onAnalyze.length >= 3 ? await input.onAnalyze(target.scenario_id, command.instruction, command.source_action_key) : await input.onAnalyze(target.scenario_id, command);
    return {
        target,
        result
    };
}
function ScenarioPanel({ scenarios, selectedScenarioId, currentRevisions, busy = false, error, onSelect, onCreate, onAnalyze, onAdopt, onCorrectFact, onOpenArtifact, onClose, onOpenClaim, facts = [], claims = [], initialIssueId, initialFactId, onSaveScenario }) {
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [changesText, setChangesText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [hypotheticalFactId, setHypotheticalFactId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialFactId ?? "");
    const [analysisInstruction, setAnalysisInstruction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [expandedAnalysisId, setExpandedAnalysisId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedChanges, setSelectedChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [correctionFactId, setCorrectionFactId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [correctionText, setCorrectionText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [localError, setLocalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const createKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        signature: "",
        key: ""
    });
    const analysisKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        signature: "",
        key: ""
    });
    const adoptionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        signature: "",
        key: ""
    });
    const correctionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        signature: "",
        key: ""
    });
    const saveNameKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        signature: "",
        key: ""
    });
    const analysisGeneration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [correctionRevisions, setCorrectionRevisions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const selected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>scenarios.find((scenario)=>scenario.scenario_id === selectedScenarioId) ?? null, [
        scenarios,
        selectedScenarioId
    ]);
    const selectedStale = selected ? staleDetails(selected, currentRevisions) : [];
    const savedAnalysis = selected?.analysis ?? "";
    const analysisExpanded = selected?.scenario_id === expandedAnalysisId;
    const analysisIsLong = savedAnalysis.length > LONG_ANALYSIS_CHARACTER_LIMIT;
    const visibleAnalysis = analysisExpanded || !analysisIsLong ? savedAnalysis : longAnalysisPreview(savedAnalysis);
    const previewIsOneLongBlock = analysisIsLong && !analysisExpanded && visibleAnalysis === savedAnalysis;
    const savedAnalysisId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const correctionStale = correctionRevisions && JSON.stringify(correctionRevisions) !== JSON.stringify(currentRevisions);
    const locked = busy || pending !== null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialFactId === undefined) return;
        analysisGeneration.current += 1;
        setCreating(true);
        setHypotheticalFactId(initialFactId ?? "");
        setSelectedChanges([]);
        setExpandedAnalysisId(null);
        onSelect(null);
    }, [
        initialFactId,
        initialIssueId,
        onSelect
    ]);
    const makeStableKey = (ref, prefix, signature)=>{
        if (ref.current.signature !== signature) ref.current = {
            signature,
            key: keyFor(prefix)
        };
        return ref.current.key;
    };
    function toggleNewScenario() {
        if (creating) {
            setCreating(false);
            return;
        }
        analysisGeneration.current += 1;
        setSelectedChanges([]);
        setExpandedAnalysisId(null);
        setLocalError("");
        onSelect(null);
        setCreating(true);
    }
    async function analyzeScenario() {
        if (!analysisInstruction.trim()) {
            setLocalError("Describe the question to explore before analysis starts.");
            return;
        }
        const selectedForAnalysis = creating ? null : selected;
        if (!selectedForAnalysis && !changesText.trim()) {
            setLocalError("Enter at least one hypothetical fact before analysis starts.");
            return;
        }
        setPending("analyze");
        setLocalError("");
        setNotice(null);
        const generation = ++analysisGeneration.current;
        try {
            const { result } = await runScenarioAnalysis({
                selected: selectedForAnalysis,
                createNew: creating,
                changesText,
                hypotheticalFactId,
                currentRevisions,
                facts,
                initialIssueId,
                instruction: analysisInstruction.trim(),
                getCreateSourceKey: ()=>{
                    const signature = `baseline:${hypotheticalFactId}:${changesText.trim()}:${JSON.stringify(currentRevisions)}`;
                    return makeStableKey(createKey, "scenario-baseline", signature);
                },
                getAnalysisSourceKey: (target)=>{
                    const signature = `${target.scenario_id}:${target.revision ?? ""}:${analysisInstruction.trim()}:${JSON.stringify(target.baseline_revisions)}`;
                    return makeStableKey(analysisKey, "scenario-analysis", signature);
                },
                onCreate,
                onAnalyze,
                onSelect
            });
            if (generation === analysisGeneration.current) setNotice(actionNotice(result.state, "Scenario analysis saved against its original baseline."));
        } catch (cause) {
            if (generation === analysisGeneration.current) setLocalError(cause instanceof Error ? cause.message : "Analysis did not complete. Your question is retained for retry.");
        } finally{
            if (generation === analysisGeneration.current) setPending(null);
        }
    }
    async function adoptSelected() {
        if (!selected || !selectedChanges.length) {
            setLocalError("Choose the specific scenario facts to adopt.");
            return;
        }
        setPending("adopt");
        setLocalError("");
        setNotice(null);
        const signature = `${selected.scenario_id}:${selectedChanges.slice().sort().join(",")}:${JSON.stringify(currentRevisions)}`;
        try {
            const command = {
                change_ids: selectedChanges,
                expected_revisions: {
                    ...currentRevisions
                },
                source_action_key: makeStableKey(adoptionKey, "scenario-adopt", signature)
            };
            // Legacy seam: onAdopt(selected.scenario_id, selectedChanges, currentRevisions, sourceActionKey).
            const receipt = onAdopt.length >= 4 ? await onAdopt(selected.scenario_id, command.change_ids, command.expected_revisions, command.source_action_key) : await onAdopt(selected.scenario_id, command);
            const nextNotice = receiptNotice(receipt, "Selected facts were applied. The saved scenario remains historical.");
            setNotice(nextNotice);
            if (receipt.state === "applied") setSelectedChanges([]);
        } catch (cause) {
            setLocalError(cause instanceof Error ? cause.message : "The selected facts were not adopted. Your selection is retained.");
        } finally{
            setPending(null);
        }
    }
    async function saveScenarioName() {
        if (!selected || !title.trim()) {
            setLocalError("Add a name for this scenario.");
            return;
        }
        if (!onSaveScenario) {
            setLocalError("Saving a name is not connected yet. The analyzed baseline is still available.");
            return;
        }
        setPending("create");
        setLocalError("");
        setNotice(null);
        const signature = `${selected.scenario_id}:${selected.revision ?? ""}:${title.trim()}`;
        try {
            const saved = await onSaveScenario(selected, title.trim(), selected.revision ?? "", makeStableKey(saveNameKey, "scenario-name", signature));
            onSelect(saved.scenario_id);
            setTitle("");
            setNotice({
                tone: "healthy",
                word: "Saved",
                message: "Named scenario saved. Actual matter facts and decisions are unchanged."
            });
        } catch (cause) {
            setLocalError(cause instanceof Error ? cause.message : "The scenario name was not saved. Your name is retained.");
        } finally{
            setPending(null);
        }
    }
    async function correctFact() {
        if (!onCorrectFact) {
            setLocalError("Fact correction is not connected yet.");
            return;
        }
        if (!correctionText.trim()) {
            setLocalError("Enter the corrected fact.");
            return;
        }
        setPending("correct");
        setLocalError("");
        setNotice(null);
        const expectedRevisions = correctionRevisions ?? currentRevisions;
        const signature = `${correctionFactId}:${correctionText.trim()}:${JSON.stringify(expectedRevisions)}`;
        try {
            const receipt = await onCorrectFact({
                factId: correctionFactId.trim() || null,
                replacement: correctionText.trim(),
                expectedRevisions,
                sourceActionKey: makeStableKey(correctionKey, "fact-correction", signature)
            });
            setNotice(receiptNotice(receipt, "Fact corrected. This did not change a saved scenario or draft."));
            if (receipt.state === "applied") {
                setCorrectionFactId("");
                setCorrectionText("");
                setCorrectionRevisions(null);
            }
        } catch (cause) {
            setLocalError(cause instanceof Error ? cause.message : "The fact was not corrected. Your text is retained.");
        } finally{
            setPending(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-labelledby": "scenario-title",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scenarioPanel,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "Hypothetical analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 328,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                                id: "scenario-title",
                                children: "Try a different assumption"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 328,
                                columnNumber: 62
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerActions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                children: "Hypothetical · Agent work"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 329,
                                columnNumber: 47
                            }, this),
                            onClose ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn quiet",
                                onClick: onClose,
                                type: "button",
                                children: "← Back to map"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 329,
                                columnNumber: 119
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].intro,
                children: "Explore how a changed assumption affects the analysis. Actual facts, decisions, and drafts stay unchanged."
            }, void 0, false, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this),
            !creating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `btn agent ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].launch}`,
                type: "button",
                onClick: toggleNewScenario,
                "aria-expanded": creating,
                disabled: locked,
                children: "Try a different assumption"
            }, void 0, false, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 332,
                columnNumber: 20
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].state,
                role: "status",
                children: [
                    "Failed: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 333,
                columnNumber: 16
            }, this) : null,
            notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].state,
                role: "status",
                children: [
                    notice.word,
                    ": ",
                    notice.message
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 334,
                columnNumber: 17
            }, this) : null,
            localError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].state,
                role: "alert",
                children: [
                    "Failed: ",
                    localError
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 335,
                columnNumber: 21
            }, this) : null,
            creating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                htmlFor: "scenario-fact",
                                children: "Current reported fact"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 338,
                                columnNumber: 41
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "select-input",
                                        id: "scenario-fact",
                                        value: hypotheticalFactId,
                                        onChange: (event)=>setHypotheticalFactId(event.target.value),
                                        disabled: locked,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "No linked fact"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                lineNumber: 338,
                                                columnNumber: 292
                                            }, this),
                                            facts.map((fact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: fact.fact_id,
                                                    children: fact.text
                                                }, fact.fact_id, false, {
                                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 353
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 338,
                                        columnNumber: 131
                                    }, this),
                                    hypotheticalFactId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "small muted",
                                        children: [
                                            "Current: ",
                                            facts.find((fact)=>fact.fact_id === hypotheticalFactId)?.text
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 338,
                                        columnNumber: 454
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 338,
                                columnNumber: 126
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                htmlFor: "scenario-changes",
                                children: "Hypothetical value"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 339,
                                columnNumber: 41
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "text-input prose",
                                id: "scenario-changes",
                                value: changesText,
                                onChange: (event)=>setChangesText(event.target.value),
                                placeholder: "Enter one changed fact per line",
                                disabled: locked
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 339,
                                columnNumber: 126
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                htmlFor: "new-scenario-analysis",
                                children: "Question for analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 340,
                                columnNumber: 41
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "text-input",
                                id: "new-scenario-analysis",
                                value: analysisInstruction,
                                onChange: (event)=>setAnalysisInstruction(event.target.value),
                                placeholder: "How would this change the current analysis?",
                                disabled: locked
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 340,
                                columnNumber: 134
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formActions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `btn ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primary}`,
                                type: "button",
                                onClick: ()=>void analyzeScenario(),
                                disabled: locked,
                                children: pending === "analyze" ? "Analyzing…" : "Analyze scenario"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 341,
                                columnNumber: 45
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn quiet",
                                type: "button",
                                onClick: ()=>{
                                    if (onClose) onClose();
                                    else setCreating(false);
                                },
                                disabled: locked,
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 341,
                                columnNumber: 228
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 337,
                columnNumber: 19
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scenarioList,
                "aria-label": "Saved scenarios",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].savedTitle,
                        children: "Saved scenarios"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    scenarios.length ? scenarios.map((scenario)=>{
                        const stale = staleDetails(scenario, currentRevisions);
                        const active = scenario.scenario_id === selectedScenarioId;
                        const complete = hasCompleteBaseline(scenario, currentRevisions);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scenarioItem,
                            type: "button",
                            "aria-pressed": active,
                            disabled: locked,
                            onClick: ()=>{
                                analysisGeneration.current += 1;
                                setSelectedChanges([]);
                                setExpandedAnalysisId(null);
                                onSelect(active ? null : scenario.scenario_id);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: scenario.title
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 351,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                    className: scenario.analysis_state === "failed" ? "state-failure" : complete && !scenario.stale?.is_stale ? "state-healthy" : "state-attention",
                                    children: scenario.analysis_state === "failed" ? "Analysis failed" : scenario.stale?.is_stale || stale.length ? "Earlier baseline" : complete ? "Baseline complete" : "Baseline unavailable"
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 351,
                                    columnNumber: 44
                                }, this)
                            ]
                        }, scenario.scenario_id, true, {
                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                            lineNumber: 350,
                            columnNumber: 20
                        }, this);
                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].savedEmpty,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "No saved scenarios"
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 353,
                                    columnNumber: 56
                                }, this),
                                "Select a saved scenario to compare it with the current matter."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                            lineNumber: 353,
                            columnNumber: 51
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 353,
                        columnNumber: 16
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this),
            selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detail,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                children: selected.title
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 356,
                                columnNumber: 42
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: hasCompleteBaseline(selected, currentRevisions) ? "state-healthy" : "state-attention",
                                children: hasCompleteBaseline(selected, currentRevisions) ? "Baseline complete" : selectedStale.length ? "Baseline needs review" : "Baseline unavailable"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 356,
                                columnNumber: 67
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "small muted",
                        children: [
                            "Saved ",
                            selected.created_at,
                            ". ",
                            selectedStale.length ? `${selectedStale.length} source or fact revision${selectedStale.length === 1 ? " has" : "s have"} changed.` : hasCompleteBaseline(selected, currentRevisions) ? "The saved baseline matches the current matter." : "This scenario has no complete saved baseline."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this),
                    selected.analysis_run_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "record-meta",
                        children: [
                            "Run ",
                            selected.analysis_run_id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 358,
                        columnNumber: 39
                    }, this) : null,
                    selected.analysis_state ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `exploration-state exploration-state--${selected.analysis_state === "failed" ? "failure" : selected.analysis_state === "completed" ? "healthy" : "agent"}`,
                        children: [
                            selected.analysis_state === "failed" ? "Failed" : selected.analysis_state === "completed" ? "Completed" : selected.analysis_state === "not_started" ? "Not analyzed" : selected.analysis_state === "queued" ? "Queued" : "Running",
                            ": Hypothetical analysis",
                            selected.failure_detail ? ` · ${selected.failure_detail}` : ""
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 359,
                        columnNumber: 38
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                children: "Baseline revisions"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 360,
                                columnNumber: 20
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: Object.entries(selected.baseline_revisions).map(([path, revision])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: path
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                lineNumber: 360,
                                                columnNumber: 176
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: revision === currentRevisions[path] ? "Current" : "Changed"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                lineNumber: 360,
                                                columnNumber: 195
                                            }, this)
                                        ]
                                    }, path, true, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 360,
                                        columnNumber: 161
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 360,
                                columnNumber: 57
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 360,
                        columnNumber: 11
                    }, this),
                    selected.analysis_baseline_revisions && Object.keys(selected.analysis_baseline_revisions).length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                children: "Analysis baseline"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 361,
                                columnNumber: 120
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: Object.entries(selected.analysis_baseline_revisions).map(([path, revision])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: path
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                lineNumber: 361,
                                                columnNumber: 284
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: revision === currentRevisions[path] ? "Current" : "Earlier version"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                                lineNumber: 361,
                                                columnNumber: 303
                                            }, this)
                                        ]
                                    }, path, true, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 361,
                                        columnNumber: 269
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 361,
                                columnNumber: 156
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 361,
                        columnNumber: 111
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: "Current baseline facts"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 362,
                        columnNumber: 11
                    }, this),
                    facts.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "exploration-list",
                        children: facts.map((fact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: fact.text
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 363,
                                        columnNumber: 104
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        children: fact.fact_id
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 363,
                                        columnNumber: 128
                                    }, this)
                                ]
                            }, fact.fact_id, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 363,
                                columnNumber: 81
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 363,
                        columnNumber: 27
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted small",
                        children: "No current facts are available in this view."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 363,
                        columnNumber: 170
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        children: "Changed assumptions"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 364,
                        columnNumber: 11
                    }, this),
                    selected.proposed_fact_changes?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scenario-facts",
                        children: selected.proposed_fact_changes.map((change)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "checkbox-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: selectedChanges.includes(change.change_id),
                                        disabled: locked,
                                        onChange: ()=>setSelectedChanges((current)=>current.includes(change.change_id) ? current.filter((id)=>id !== change.change_id) : [
                                                    ...current,
                                                    change.change_id
                                                ])
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 365,
                                        columnNumber: 188
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: change.text
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 365,
                                        columnNumber: 452
                                    }, this)
                                ]
                            }, change.change_id, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 365,
                                columnNumber: 133
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 365,
                        columnNumber: 53
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted small",
                        children: "No changed assumptions were saved."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 365,
                        columnNumber: 497
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                        htmlFor: "scenario-analysis",
                                        children: "Explore this scenario"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 366,
                                        columnNumber: 72
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "text-input",
                                        id: "scenario-analysis",
                                        value: analysisInstruction,
                                        onChange: (event)=>setAnalysisInstruction(event.target.value),
                                        placeholder: "How would this affect the current answer?",
                                        disabled: locked
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 366,
                                        columnNumber: 161
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 366,
                                columnNumber: 40
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formActions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `btn ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primary}`,
                                        type: "button",
                                        onClick: ()=>void analyzeScenario(),
                                        disabled: locked,
                                        children: pending === "analyze" ? "Analyzing…" : "Analyze scenario"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 366,
                                        columnNumber: 428
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn review",
                                        type: "button",
                                        onClick: ()=>void adoptSelected(),
                                        disabled: locked || !selectedChanges.length,
                                        children: pending === "adopt" ? "Adopting…" : "Adopt selected facts"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 366,
                                        columnNumber: 611
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 366,
                                columnNumber: 392
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 366,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                        htmlFor: "scenario-name",
                                        children: "Scenario name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 367,
                                        columnNumber: 72
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "text-input",
                                        id: "scenario-name",
                                        value: title,
                                        onChange: (event)=>setTitle(event.target.value),
                                        placeholder: "Two-day funds hold",
                                        disabled: locked
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 367,
                                        columnNumber: 149
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 367,
                                columnNumber: 40
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formActions,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `btn ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].primary}`,
                                    type: "button",
                                    onClick: ()=>void saveScenarioName(),
                                    disabled: locked || !title.trim(),
                                    children: pending === "create" ? "Saving scenario…" : "Save scenario"
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 367,
                                    columnNumber: 358
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 367,
                                columnNumber: 322
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 367,
                        columnNumber: 11
                    }, this),
                    selected.analysis ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scenario-analysis",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Hypothetical · Agent analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 368,
                                columnNumber: 67
                            }, this),
                            selected.stale?.is_stale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "exploration-state exploration-state--attention",
                                children: "Earlier facts: This result stays attached to its original baseline."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 368,
                                columnNumber: 133
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "reading scenario-analysis__content",
                                id: savedAnalysisId,
                                style: previewIsOneLongBlock ? {
                                    maxHeight: "30rem",
                                    overflow: "hidden"
                                } : undefined,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                    components: analysisMarkdownComponents,
                                    remarkPlugins: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
                                    ],
                                    children: visibleAnalysis
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 368,
                                    columnNumber: 434
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 368,
                                columnNumber: 274
                            }, this),
                            analysisIsLong ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted small",
                                        children: analysisExpanded ? "The full saved analysis is shown." : previewIsOneLongBlock ? "This saved analysis starts with one long Markdown block." : "Showing complete opening blocks from this saved analysis."
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 368,
                                        columnNumber: 576
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-controls": savedAnalysisId,
                                        "aria-expanded": analysisExpanded,
                                        className: "btn quiet tiny",
                                        onClick: ()=>setExpandedAnalysisId(analysisExpanded ? null : selected.scenario_id),
                                        type: "button",
                                        children: analysisExpanded ? "Show less" : "Read full analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 368,
                                        columnNumber: 810
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 368,
                                columnNumber: 574
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 368,
                        columnNumber: 32
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "muted small",
                        children: "No saved analysis yet. A failed attempt does not remove an earlier result."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 368,
                        columnNumber: 1094
                    }, this),
                    selected.affected_issue_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Affected issues"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 369,
                                columnNumber: 52
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.affected_issue_ids.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: id
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 369,
                                            columnNumber: 163
                                        }, this)
                                    }, id, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 369,
                                        columnNumber: 150
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 369,
                                columnNumber: 76
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 369,
                        columnNumber: 50
                    }, this) : null,
                    selected.affected_branch_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Affected branches"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 370,
                                columnNumber: 53
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.affected_branch_ids.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: id
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 370,
                                            columnNumber: 167
                                        }, this)
                                    }, id, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 370,
                                        columnNumber: 154
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 370,
                                columnNumber: 79
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 370,
                        columnNumber: 51
                    }, this) : null,
                    selected.analysis && !hasScenarioCitations(selected.claim_ids ?? [], claims) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "exploration-state exploration-state--attention",
                        role: "status",
                        children: "No claim-level citations saved. The analysis remains available; source links alone do not establish that its conclusions apply."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 371,
                        columnNumber: 91
                    }, this) : null,
                    selected.claim_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Supporting claims"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 372,
                                columnNumber: 43
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.claim_ids.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: onOpenClaim ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "quiet-link",
                                            type: "button",
                                            onClick: ()=>onOpenClaim(id),
                                            children: id
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 372,
                                            columnNumber: 162
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: id
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 372,
                                            columnNumber: 255
                                        }, this)
                                    }, id, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 372,
                                        columnNumber: 134
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 372,
                                columnNumber: 69
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 372,
                        columnNumber: 41
                    }, this) : null,
                    selected.proposed_outcomes?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Proposed outcomes"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 373,
                                columnNumber: 51
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.proposed_outcomes.map((outcome)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                outcome.label,
                                                outcome.condition ? ` · ${outcome.condition}` : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 373,
                                            columnNumber: 184
                                        }, this)
                                    }, outcome.outcome_id, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 373,
                                        columnNumber: 155
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 373,
                                columnNumber: 77
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 373,
                        columnNumber: 49
                    }, this) : null,
                    selected.unresolved_conditions?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Still uncertain"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 374,
                                columnNumber: 55
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.unresolved_conditions.map((condition)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: condition
                                    }, condition, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 374,
                                        columnNumber: 163
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 374,
                                columnNumber: 79
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 374,
                        columnNumber: 53
                    }, this) : null,
                    selected.source_links?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                children: "Source links"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 375,
                                columnNumber: 46
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "exploration-list",
                                children: selected.source_links.map((path)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: isExternalSource(path) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "quiet-link",
                                            href: path,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            children: sourceLabel(path)
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 375,
                                            columnNumber: 178
                                        }, this) : isInternalSource(path) && onOpenArtifact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "quiet-link",
                                            type: "button",
                                            onClick: ()=>onOpenArtifact(path),
                                            children: sourceLabel(path)
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 375,
                                            columnNumber: 318
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            children: sourceLabel(path)
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                            lineNumber: 375,
                                            columnNumber: 431
                                        }, this)
                                    }, path, false, {
                                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                        lineNumber: 375,
                                        columnNumber: 137
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 375,
                                columnNumber: 67
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 375,
                        columnNumber: 44
                    }, this) : null,
                    selected.adopted_fact_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "exploration-state exploration-state--healthy",
                        children: [
                            "Saved: ",
                            selected.adopted_fact_ids.length,
                            " selected fact",
                            selected.adopted_fact_ids.length === 1 ? "" : "s",
                            " adopted. This scenario remains historical."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 376,
                        columnNumber: 48
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 355,
                columnNumber: 21
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].correction,
                open: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: "Correct a fact"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 51
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "small muted",
                        children: "Real-record editing. Use this to correct what is actually in the matter."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 84
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "label",
                        htmlFor: "correct-fact-id",
                        children: "Fact to replace"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 187
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "select-input",
                        id: "correct-fact-id",
                        value: correctionFactId,
                        disabled: locked,
                        onChange: (event)=>{
                            if (!correctionRevisions) setCorrectionRevisions({
                                ...currentRevisions
                            });
                            setCorrectionFactId(event.target.value);
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Add a new reported fact"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 379,
                                columnNumber: 500
                            }, this),
                            facts.map((fact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: fact.fact_id,
                                    children: fact.text
                                }, fact.fact_id, false, {
                                    fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                    lineNumber: 379,
                                    columnNumber: 570
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 261
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "label",
                        htmlFor: "correct-fact-text",
                        children: "Corrected fact"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 649
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        className: "text-input prose",
                        id: "correct-fact-text",
                        value: correctionText,
                        disabled: locked,
                        onChange: (event)=>{
                            if (!correctionRevisions) setCorrectionRevisions({
                                ...currentRevisions
                            });
                            setCorrectionText(event.target.value);
                        },
                        placeholder: "Enter the corrected fact"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 724
                    }, this),
                    correctionStale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterScenario$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].state,
                        children: [
                            "Needs attention: Matter facts changed. Your correction text is retained. ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "quiet-link",
                                type: "button",
                                onClick: ()=>setCorrectionRevisions({
                                        ...currentRevisions
                                    }),
                                disabled: locked,
                                children: "Use latest matter facts"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                                lineNumber: 379,
                                columnNumber: 1130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 1027
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn review",
                        type: "button",
                        onClick: ()=>void correctFact(),
                        disabled: locked,
                        children: pending === "correct" ? "Correcting fact…" : "Correct a fact"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                        lineNumber: 379,
                        columnNumber: 1303
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/ScenarioPanel.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workspace/ScenarioPanel.tsx",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=components_workspace_ScenarioPanel_tsx_1j5bc2h._.js.map