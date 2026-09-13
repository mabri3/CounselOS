(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/workspace/IssueReviewDetail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analysisStateLabel",
    ()=>analysisStateLabel,
    "default",
    ()=>IssueReviewDetail,
    "dispositionChoices",
    ()=>dispositionChoices,
    "dispositionLabel",
    ()=>dispositionLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterIcon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueChoiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/IssueChoiceForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterIssue.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const reading = {
    color: "var(--ink-2)",
    font: "400 16px/1.65 var(--serif)",
    margin: "7px 0",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap"
};
const muted = {
    color: "var(--ink-3)",
    font: "400 15px/1.5 var(--sans)",
    margin: "5px 0",
    overflowWrap: "anywhere"
};
const actionStyle = {
    maxWidth: "100%",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    textAlign: "left"
};
function dispositionLabel(disposition) {
    if (disposition === "mitigation_in_progress") return "Mitigation in progress";
    if (disposition === "resolved") return "Resolved";
    if (disposition === "risk_accepted") return "Risk accepted";
    if (disposition === "not_applicable") return "Not applicable";
    return disposition === "unresolved" ? "Unresolved" : "No disposition recorded";
}
function questionLabel(question) {
    if (question.state === "answered") return "Answered";
    if (question.state === "left_open") return "Left open";
    return "Open";
}
function compactIssueTitle(title, limit = 70) {
    const clean = title.replace(/\s+/g, " ").trim();
    if (clean.length <= limit) return clean;
    const boundary = clean.lastIndexOf(" ", limit - 1);
    return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}
function lawyerStateLabel(state) {
    if (state === "explored") return "Explored";
    if (state === "set_aside") return "Set aside";
    return "Open";
}
function supportStateLabel(state) {
    if (state === "verified") return "Verified";
    if (state === "retrieved") return "Retrieved";
    if (state === "supplied") return "Supplied";
    return "Support needs review";
}
function legacyOptionStateLabel(state) {
    if (state === "selected") return "Legacy state · selected";
    if (state === "proposed") return "Agent proposal";
    return state ? `Legacy state · ${state.replaceAll("_", " ")}` : "State unknown";
}
function analysisStateLabel(state) {
    if (state === "partial") return "Partial";
    if (state === "saved") return "Saved";
    if (state === "needs_review") return "Needs review";
    if (state === "missing") return "Missing analysis";
    if (state === "historical") return "Historical";
    return "Not mapped";
}
function uniqueActionKey(prefix) {
    return `${prefix}:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}
function dispositionChoices(props) {
    const analysis = props.analysisStatus?.analysis;
    if (analysis) return analysis.options.map((option)=>({
            id: option.option_id,
            title: option.title,
            recommended: option.recommendation === "recommended",
            label: `${option.recommendation === "recommended" ? "Recommended" : "Candidate"} — ${option.title}`,
            reason: [
                option.recommendation_reason,
                option.consequence,
                option.condition_summary && `Conditions: ${option.condition_summary}`,
                option.remaining_work.length && `Still needed: ${option.remaining_work.join("; ")}`
            ].filter(Boolean).join("\n\n")
        }));
    if (props.analysisStatus?.reference || props.analysisStatus && props.analysisStatus.state !== "not_mapped") return [];
    return (props.responseOptions ?? []).map((option)=>({
            id: option.option_id,
            title: option.title,
            recommended: false,
            label: `Earlier option — ${option.title}`,
            reason: option.condition || ""
        }));
}
function IssueReviewDetail(props) {
    _s();
    const { issue, issuesRevision, questions, claims, workItems, decisions, busy = false, error } = props;
    const [issueDraft, setIssueDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [answerDrafts, setAnswerDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [initialOptionId, setInitialOptionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IssueReviewDetail.useEffect": ()=>{
            const query = new URLSearchParams(window.location.search);
            if (query.get("issue") === issue.issue_id && query.get("record_option")) {
                setInitialOptionId(query.get("record_option"));
                setDispositionFormOpen(true);
                query.delete("record_option");
                window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
            }
        }
    }["IssueReviewDetail.useEffect"], [
        issue.issue_id
    ]);
    const [dispositionFormOpen, setDispositionFormOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localBusy, setLocalBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [localError, setLocalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const actionKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const positionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const actionKey = (signature)=>{
        const saved = actionKeys.current.get(signature);
        if (saved) return saved;
        const next = uniqueActionKey(`issue:${issue.issue_id}`);
        actionKeys.current.set(signature, next);
        return next;
    };
    const unavailable = "This action will be available after the matter page finishes loading its review controls.";
    const target = {
        matter_id: props.matterId,
        issue_id: issue.issue_id
    };
    const currentDisposition = dispositionLabel(issue.disposition);
    const fullIssueTitle = issue.title || "Untitled issue";
    const titlePreview = compactIssueTitle(fullIssueTitle);
    const titleIsShortened = titlePreview !== fullIssueTitle;
    const hasCitedEvidence = claims.some((claim)=>claim.evidence.length > 0);
    const analysisStatus = props.analysisStatus;
    const analysis = analysisStatus?.analysis ?? null;
    const hasAnalysisPointer = Boolean(analysis || analysisStatus?.reference || analysisStatus && analysisStatus.state !== "not_mapped");
    const analysisWarnings = [
        ...new Set([
            ...analysisStatus?.warnings ?? [],
            ...analysis?.warnings ?? []
        ])
    ];
    const analysisNeedsUpdate = !analysis || analysisStatus?.state === "not_mapped" || analysisStatus?.state === "partial" || analysisStatus?.state === "needs_review" || analysisStatus?.state === "missing";
    function openDispositionForm() {
        setInitialOptionId(undefined);
        setDispositionFormOpen(true);
        setLocalError("");
        if (typeof requestAnimationFrame === "function") requestAnimationFrame(()=>positionRef.current?.scrollIntoView({
                block: "start",
                behavior: "smooth"
            }));
    }
    function cancelDispositionForm() {
        setDispositionFormOpen(false);
        setLocalError("");
    }
    async function saveIssue() {
        if (!issueDraft || !props.onIssueUpdate) return;
        if (issueDraft.baseRevision !== issuesRevision) {
            setLocalError("The issue changed while you were editing. Use the latest issue before you save.");
            return;
        }
        const command = {
            expected_revision: issueDraft.baseRevision,
            title: issueDraft.title.trim(),
            parent_issue_id: issueDraft.parentIssueId.trim() || null,
            why_it_matters: issueDraft.whyItMatters.trim() || null
        };
        setLocalBusy("issue");
        setLocalError("");
        try {
            await props.onIssueUpdate(issue.issue_id, command);
            setIssueDraft(null);
        } catch (cause) {
            setLocalError(cause instanceof Error ? cause.message : "The issue change was not saved. Your text is retained.");
        } finally{
            setLocalBusy("");
        }
    }
    async function answerQuestion(question, state) {
        if (!props.onQuestionAnswer) return;
        const answer = answerDrafts[question.question_id]?.trim();
        if (state === "answered" && !answer) return;
        const answerKind = question.question_kind === "legal" ? "legal_analysis" : "reported_fact";
        const signature = `question:${question.question_id}:${question.source_revision ?? ""}:${state}:${answerKind}:${answer ?? ""}`;
        setLocalBusy(`question:${question.question_id}`);
        setLocalError("");
        try {
            await props.onQuestionAnswer(question.question_id, {
                state,
                answer: state === "answered" ? answer : undefined,
                answer_kind: state === "answered" ? answerKind : undefined,
                expected_revision: question.source_revision ?? "",
                source_action_key: actionKey(signature)
            });
            setAnswerDrafts((current)=>{
                const next = {
                    ...current
                };
                delete next[question.question_id];
                return next;
            });
        } catch (cause) {
            setLocalError(cause instanceof Error ? cause.message : "The answer was not saved. Your text is retained.");
        } finally{
            setLocalBusy("");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        "aria-label": `Issue review: ${issue.title}`,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].detail,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].detailHead,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].kicker,
                                children: "What needs your judgment"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 215,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].questionTitle,
                                children: titlePreview
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 215,
                                columnNumber: 75
                            }, this),
                            titleIsShortened ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fullTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                        children: "Read full issue title"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 216,
                                        columnNumber: 67
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: fullIssueTitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 216,
                                        columnNumber: 107
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 216,
                                columnNumber: 29
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].statusRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].lawyerState,
                                        children: lawyerStateLabel(issue.lawyer_state)
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 217,
                                        columnNumber: 43
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].disposition,
                                        children: currentDisposition
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 217,
                                        columnNumber: 125
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 217,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].why,
                                children: issue.why_it_matters || "No business consequence is saved for this issue."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 218,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].nextAction,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Next action:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 219,
                                        columnNumber: 34
                                    }, this),
                                    " ",
                                    workItems.find((item)=>![
                                            "done",
                                            "closed",
                                            "complete",
                                            "completed"
                                        ].includes(item.state))?.title || (issue.disposition === "mitigation_in_progress" ? "Review completed follow-up and record your conclusion." : [
                                        "resolved",
                                        "risk_accepted",
                                        "not_applicable"
                                    ].includes(issue.disposition ?? "") ? "Return to the matter to review remaining issues and the response." : issue.next_action || "Review the saved analysis and record the next position.")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 219,
                                columnNumber: 1
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].owner,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        name: "user",
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 220,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Owner"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 220,
                                        columnNumber: 73
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: workItems.find((item)=>![
                                                "done",
                                                "closed",
                                                "complete",
                                                "completed"
                                            ].includes(item.state))?.owner || issue.action_owner || "Unassigned"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 220,
                                        columnNumber: 92
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 220,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 215,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].detailActions,
                        children: [
                            !dispositionFormOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn primary",
                                disabled: !props.onDisposition || busy || Boolean(localBusy),
                                onClick: openDispositionForm,
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        name: "check",
                                        size: 21
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 223,
                                        columnNumber: 171
                                    }, this),
                                    " Record disposition"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 223,
                                columnNumber: 33
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                disabled: !props.onOpenDecisionMap,
                                onClick: ()=>props.onOpenDecisionMap?.(issue.issue_id),
                                style: actionStyle,
                                title: !props.onOpenDecisionMap ? unavailable : undefined,
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        name: "map",
                                        size: 21
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 224,
                                        columnNumber: 220
                                    }, this),
                                    " Open decision map"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 224,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                disabled: !props.onDiscuss,
                                onClick: ()=>props.onDiscuss?.(target),
                                style: actionStyle,
                                title: !props.onDiscuss ? unavailable : undefined,
                                type: "button",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        name: "chat",
                                        size: 21
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 225,
                                        columnNumber: 188
                                    }, this),
                                    " Discuss this issue"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 225,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].details,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                        children: "Edit issue details"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 227,
                                        columnNumber: 9
                                    }, this),
                                    !props.onIssueUpdate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: muted,
                                        children: unavailable
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 228,
                                        columnNumber: 33
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 9,
                                            marginTop: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "field-label",
                                                        children: "Issue title"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 42
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "text-input",
                                                        disabled: busy || localBusy === "issue",
                                                        onChange: (event)=>setIssueDraft((current)=>({
                                                                    title: event.target.value,
                                                                    parentIssueId: current?.parentIssueId ?? issue.parent_issue_id ?? "",
                                                                    whyItMatters: current?.whyItMatters ?? issue.why_it_matters ?? "",
                                                                    baseRevision: current?.baseRevision ?? issuesRevision
                                                                })),
                                                        value: issueDraft?.title ?? issue.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 90
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 229,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "field-label",
                                                        children: "Parent issue ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 42
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "text-input",
                                                        disabled: busy || localBusy === "issue",
                                                        onChange: (event)=>setIssueDraft((current)=>({
                                                                    title: current?.title ?? issue.title,
                                                                    parentIssueId: event.target.value,
                                                                    whyItMatters: current?.whyItMatters ?? issue.why_it_matters ?? "",
                                                                    baseRevision: current?.baseRevision ?? issuesRevision
                                                                })),
                                                        value: issueDraft?.parentIssueId ?? issue.parent_issue_id ?? ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 94
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 230,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "field-label",
                                                        children: "Why this matters"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 42
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        className: "text-input prose",
                                                        disabled: busy || localBusy === "issue",
                                                        onChange: (event)=>setIssueDraft((current)=>({
                                                                    title: current?.title ?? issue.title,
                                                                    parentIssueId: current?.parentIssueId ?? issue.parent_issue_id ?? "",
                                                                    whyItMatters: event.target.value,
                                                                    baseRevision: current?.baseRevision ?? issuesRevision
                                                                })),
                                                        value: issueDraft?.whyItMatters ?? issue.why_it_matters ?? ""
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 95
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 231,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "btn-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn tiny",
                                                        disabled: !issueDraft || !issueDraft.title.trim() || issueDraft.baseRevision !== issuesRevision || busy || Boolean(localBusy),
                                                        onClick: ()=>void saveIssue(),
                                                        type: "button",
                                                        children: localBusy === "issue" ? "Saving…" : "Save issue details"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 36
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn quiet tiny",
                                                        disabled: !issueDraft || Boolean(localBusy),
                                                        onClick: ()=>setIssueDraft(null),
                                                        type: "button",
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 306
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 232,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 228,
                                        columnNumber: 70
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 226,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 222,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                lineNumber: 214,
                columnNumber: 5
            }, this),
            error || localError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "warning-callout",
                role: "status",
                children: localError || error
            }, void 0, false, {
                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                lineNumber: 238,
                columnNumber: 30
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-labelledby": `position-${issue.issue_id}`,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].recordedPosition,
                ref: positionRef,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "record-meta",
                        children: "Your recorded position"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 240,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].positionTitle,
                        id: `position-${issue.issue_id}`,
                        children: currentDisposition
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 240,
                        columnNumber: 66
                    }, this),
                    issue.disposition_reason ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: reading,
                        children: issue.disposition_reason
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 241,
                        columnNumber: 35
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: muted,
                        children: "No disposition reason is recorded."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 241,
                        columnNumber: 87
                    }, this),
                    decisions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gap: 8
                        },
                        children: decisions.map((decision)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                style: {
                                    border: "1px solid var(--line-faint)",
                                    borderRadius: "var(--radius)",
                                    padding: 11
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "state-label state-healthy",
                                        children: "Recorded"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 242,
                                        columnNumber: 227
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            font: "600 16px/1.35 var(--serif)",
                                            margin: "6px 0"
                                        },
                                        children: decision.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 242,
                                        columnNumber: 286
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: reading,
                                        children: decision.chosen_path
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 242,
                                        columnNumber: 375
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: muted,
                                        children: [
                                            decision.rationale,
                                            " · ",
                                            decision.decision_maker || "Unknown decision maker",
                                            decision.decided_at ? ` · ${decision.decided_at}` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 242,
                                        columnNumber: 420
                                    }, this)
                                ]
                            }, decision.decision_id, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 242,
                                columnNumber: 97
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 242,
                        columnNumber: 27
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: muted,
                        children: "No formal decision is linked to this issue."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 242,
                        columnNumber: 594
                    }, this),
                    !dispositionFormOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny",
                        disabled: !props.onDisposition || busy || Boolean(localBusy),
                        onClick: openDispositionForm,
                        style: {
                            ...actionStyle,
                            marginTop: 12
                        },
                        title: !props.onDisposition ? unavailable : undefined,
                        type: "button",
                        children: issue.disposition && issue.disposition !== "unresolved" ? "Change or reopen disposition" : "Record disposition"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 243,
                        columnNumber: 31
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueChoiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        initialOptionId: initialOptionId,
                        issue: issue,
                        issuesRevision: issuesRevision,
                        analysisStatus: analysisStatus,
                        workItems: workItems,
                        decisions: decisions,
                        onDisposition: props.onDisposition,
                        onAnalyzePaths: props.onAnalyzePaths,
                        onCancel: cancelDispositionForm
                    }, initialOptionId ?? "recorded-choice", false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 243,
                        columnNumber: 388
                    }, this),
                    !props.onDisposition ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: muted,
                        children: unavailable
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 244,
                        columnNumber: 31
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        style: {
                            marginTop: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                children: [
                                    "Disposition history (",
                                    issue.disposition_history?.length ?? 0,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 245,
                                columnNumber: 42
                            }, this),
                            issue.disposition_history?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                style: {
                                    ...muted,
                                    paddingLeft: 20
                                },
                                children: issue.disposition_history.map((record)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        style: {
                                            margin: "8px 0"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: record.action === "reopened" ? "Reopened" : dispositionLabel(record.disposition)
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 245,
                                                columnNumber: 305
                                            }, this),
                                            " · ",
                                            record.actor_name || "Unknown actor",
                                            " · ",
                                            record.recorded_at || "Date unavailable",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 245,
                                                columnNumber: 490
                                            }, this),
                                            record.reason
                                        ]
                                    }, record.disposition_id, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 245,
                                        columnNumber: 245
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 245,
                                columnNumber: 160
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: "No disposition history is saved."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 245,
                                columnNumber: 526
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 245,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                lineNumber: 239,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionStack,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-labelledby": `why-${issue.issue_id}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].issueSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "map",
                                    size: 25
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                    lineNumber: 249,
                                    columnNumber: 125
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 249,
                                columnNumber: 88
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Why this matters"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 249,
                                columnNumber: 167
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: `why-${issue.issue_id}`,
                                children: "Business effect"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 249,
                                columnNumber: 220
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLead,
                                children: issue.why_it_matters || "No business consequence is saved for this issue."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 249,
                                columnNumber: 305
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 249,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-labelledby": `paths-${issue.issue_id}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].issueSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "map",
                                    size: 25
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                    lineNumber: 252,
                                    columnNumber: 44
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 252,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Decision paths"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 252,
                                columnNumber: 86
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: `paths-${issue.issue_id}`,
                                children: "Saved issue analysis"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 252,
                                columnNumber: 137
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisHeading,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `state-label ${analysisStatus?.state === "saved" ? "state-agent" : "state-attention"}`,
                                        children: analysisStateLabel(analysisStatus?.state)
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 253,
                                        columnNumber: 47
                                    }, this),
                                    analysis ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "record-meta",
                                        children: [
                                            "Analysis ",
                                            analysis.analysis_revision
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 253,
                                        columnNumber: 214
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 253,
                                columnNumber: 7
                            }, this),
                            analysis ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisBody,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reading,
                                        children: analysis.explanation
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 255,
                                        columnNumber: 9
                                    }, this),
                                    analysis.business_effect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLead,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Business effect:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 256,
                                                columnNumber: 71
                                            }, this),
                                            " ",
                                            analysis.business_effect
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 256,
                                        columnNumber: 37
                                    }, this) : null,
                                    analysisWarnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "warning-callout",
                                        role: "status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Analysis warning"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 257,
                                                columnNumber: 83
                                            }, this),
                                            analysisWarnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: warning
                                                }, warning, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 151
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 257,
                                        columnNumber: 36
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisGrid,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Law or test"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 20
                                                    }, this),
                                                    analysis.tests.length ? analysis.tests.map((test)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisCard,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "state-label state-agent",
                                                                    children: "Agent analysis"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 154
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: test.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 217
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: test.summary
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 246
                                                                }, this),
                                                                test.actor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Actor:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 284
                                                                        }, this),
                                                                        " ",
                                                                        test.actor
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 281
                                                                }, this) : null,
                                                                test.jurisdiction ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Jurisdiction:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 356
                                                                        }, this),
                                                                        " ",
                                                                        test.jurisdiction
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 353
                                                                }, this) : null,
                                                                test.effective_at ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Effective:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 442
                                                                        }, this),
                                                                        " ",
                                                                        test.effective_at
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 439
                                                                }, this) : null,
                                                                test.exceptions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Exceptions:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 523
                                                                        }, this),
                                                                        " ",
                                                                        test.exceptions
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 520
                                                                }, this) : null,
                                                                test.applicability ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Applicability:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 606
                                                                        }, this),
                                                                        " ",
                                                                        test.applicability
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 603
                                                                }, this) : null,
                                                                test.claim_ids.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].testSupport,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Saved support"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 731
                                                                        }, this),
                                                                        test.claim_ids.map((claimId)=>{
                                                                            const outputRevision = analysis.source_revisions[`claim:${claimId}`] || analysis.output_revision;
                                                                            const claim = claims.find((item)=>item.claim_id === claimId && item.output_revision === outputRevision);
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "record-meta",
                                                                                        children: [
                                                                                            claimId,
                                                                                            " · output ",
                                                                                            outputRevision
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                                        lineNumber: 259,
                                                                                        columnNumber: 1027
                                                                                    }, this),
                                                                                    claim?.evidence.length ? claim.evidence.map((evidence, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            className: "btn quiet tiny",
                                                                                            disabled: !props.onOpenEvidence,
                                                                                            onClick: ()=>props.onOpenEvidence?.(evidence),
                                                                                            title: !props.onOpenEvidence ? unavailable : undefined,
                                                                                            type: "button",
                                                                                            children: [
                                                                                                supportStateLabel(evidence.support_state),
                                                                                                " · ",
                                                                                                evidence.source_label || evidence.source_id,
                                                                                                " · ",
                                                                                                evidence.locator || "Location unavailable"
                                                                                            ]
                                                                                        }, `${claimId}:${evidence.source_id}:${index}`, true, {
                                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                                            lineNumber: 259,
                                                                                            columnNumber: 1165
                                                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                                                        children: "No exact claim support is saved for this output revision."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                                        lineNumber: 259,
                                                                                        columnNumber: 1553
                                                                                    }, this)
                                                                                ]
                                                                            }, claimId, true, {
                                                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                                lineNumber: 259,
                                                                                columnNumber: 1008
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 695
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Saved support:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 1672
                                                                        }, this),
                                                                        " No claim links are saved for this test."
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 1669
                                                                }, this)
                                                            ]
                                                        }, test.test_id, true, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 94
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                        children: "No legal test is saved."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 1762
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 259,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "What changes the answer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 20
                                                    }, this),
                                                    analysis.conditions.length ? analysis.conditions.map((condition)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisCard,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `state-label ${condition.assessment === "met" || condition.assessment === "not_met" ? "state-agent" : "state-attention"}`,
                                                                    children: condition.assessment === "not_met" ? "Not met" : condition.assessment === "unknown" ? "Unknown" : condition.assessment === "conflicting" ? "Conflicting" : "Met"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 191
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: condition.question
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 500
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: condition.assessment_basis
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 537
                                                                }, this)
                                                            ]
                                                        }, condition.condition_id, true, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 121
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                        children: "No conditions are saved."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 586
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 260,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Possible paths"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 20
                                                    }, this),
                                                    analysis.options.length ? analysis.options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].analysisCard,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "state-label state-agent",
                                                                    children: option.recommendation === "recommended" ? "Recommended · Agent analysis" : "Candidate · Agent analysis"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 198
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    children: option.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 352
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: option.condition_summary || "No condition summary is saved."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 383
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Consequence:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 455
                                                                        }, this),
                                                                        " ",
                                                                        option.consequence
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 452
                                                                }, this),
                                                                option.remaining_work.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                            children: "Still needed:"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                            lineNumber: 261,
                                                                            columnNumber: 544
                                                                        }, this),
                                                                        " ",
                                                                        option.remaining_work.join("; ")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 541
                                                                }, this) : null,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: "btn quiet tiny",
                                                                    disabled: !props.onDisposition,
                                                                    onClick: ()=>{
                                                                        openDispositionForm();
                                                                        setInitialOptionId(option.option_id);
                                                                    },
                                                                    type: "button",
                                                                    children: "Record this path"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 621
                                                                }, this)
                                                            ]
                                                        }, `${option.option_id}:${option.option_revision}`, true, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 103
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                        children: "No paths are saved."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 822
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 261,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 258,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 254,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLead,
                                        children: "No saved path analysis is linked to this issue. The issue text remains available."
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 263,
                                        columnNumber: 18
                                    }, this),
                                    analysisWarnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "warning-callout",
                                        role: "status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Analysis warning"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 263,
                                                columnNumber: 211
                                            }, this),
                                            analysisWarnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: warning
                                                }, warning, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 279
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 263,
                                        columnNumber: 164
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 263,
                                columnNumber: 16
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inlineActions,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn agent",
                                        disabled: !props.onAnalyzePaths,
                                        onClick: ()=>props.onAnalyzePaths?.(issue.issue_id),
                                        title: !props.onAnalyzePaths ? unavailable : undefined,
                                        type: "button",
                                        children: analysisNeedsUpdate ? "Analyze paths" : "Update analysis"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 264,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet",
                                        disabled: !props.onOpenDecisionMap,
                                        onClick: ()=>props.onOpenDecisionMap?.(issue.issue_id),
                                        title: !props.onOpenDecisionMap ? unavailable : undefined,
                                        type: "button",
                                        children: "Open decision map"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 264,
                                        columnNumber: 301
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 264,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 251,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-labelledby": `law-${issue.issue_id}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].issueSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "scale",
                                    size: 25
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                    lineNumber: 268,
                                    columnNumber: 44
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 268,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Legal basis"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 268,
                                columnNumber: 88
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: `law-${issue.issue_id}`,
                                children: "Claims and applicability"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 268,
                                columnNumber: 136
                            }, this),
                            !claims.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionBody,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionLead,
                                        children: "No cited sources."
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 269,
                                        columnNumber: 61
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inlineActions,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn quiet",
                                            disabled: !props.onResearchLegalBasis,
                                            onClick: ()=>props.onResearchLegalBasis?.(issue.issue_id),
                                            title: !props.onResearchLegalBasis ? unavailable : undefined,
                                            type: "button",
                                            children: "Research legal basis"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                            lineNumber: 269,
                                            columnNumber: 154
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 269,
                                        columnNumber: 116
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 269,
                                columnNumber: 25
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionBody,
                                style: {
                                    display: "grid",
                                    gap: 10
                                },
                                children: [
                                    !hasCitedEvidence ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "warning-callout",
                                        role: "status",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "No cited sources."
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 270,
                                                columnNumber: 77
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: "4px 0"
                                                },
                                                children: "The saved claims remain visible. Research can add claim-level support."
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 270,
                                                columnNumber: 111
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn agent tiny",
                                                disabled: !props.onResearchLegalBasis,
                                                onClick: ()=>props.onResearchLegalBasis?.(issue.issue_id),
                                                title: !props.onResearchLegalBasis ? unavailable : undefined,
                                                type: "button",
                                                children: "Research legal basis"
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 270,
                                                columnNumber: 216
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 270,
                                        columnNumber: 30
                                    }, this) : null,
                                    claims.map((claim)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].itemCard} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].claim}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "state-label state-agent",
                                                    children: "Agent claim"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 11
                                                }, this),
                                                props.renderSupportedText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reading,
                                                    children: props.renderSupportedText({
                                                        text: claim.text,
                                                        surface: "issue_claim",
                                                        claim,
                                                        claims: [
                                                            claim
                                                        ]
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 100
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reading,
                                                    children: claim.text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 238
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                                    style: {
                                                        display: "grid",
                                                        gridTemplateColumns: "max-content minmax(0, 1fr)",
                                                        gap: "5px 10px",
                                                        fontSize: 13
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            children: "Regulated actor"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 125
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            style: {
                                                                margin: 0
                                                            },
                                                            children: claim.applicability?.regulated_actor || "Not stated"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 149
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            children: "Jurisdiction"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 234
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            style: {
                                                                margin: 0
                                                            },
                                                            children: claim.applicability?.jurisdiction || "Not stated"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 255
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            children: "Application"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 337
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            style: {
                                                                margin: 0
                                                            },
                                                            children: claim.applicability?.explanation || "Applicability is not explained."
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 357
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 11
                                                }, this),
                                                claim.applicability?.fact_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                    children: [
                                                        "Facts used: ",
                                                        claim.applicability.fact_ids.join(", ")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 52
                                                }, this) : null,
                                                claim.applicability?.assumption_ids?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                    children: [
                                                        "Assumptions used: ",
                                                        claim.applicability.assumption_ids.join(", ")
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 192
                                                }, this) : null,
                                                claim.support_gap ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "warning-callout",
                                                    role: "status",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Support gap:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 275,
                                                            columnNumber: 77
                                                        }, this),
                                                        " ",
                                                        claim.support_gap
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 32
                                                }, this) : null,
                                                claim.evidence.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "grid",
                                                        gap: 7
                                                    },
                                                    children: claim.evidence.map((evidence, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn quiet tiny",
                                                            disabled: !props.onOpenEvidence,
                                                            onClick: ()=>props.onOpenEvidence?.(evidence),
                                                            style: actionStyle,
                                                            title: !props.onOpenEvidence ? unavailable : undefined,
                                                            type: "button",
                                                            children: [
                                                                evidence.source_label || evidence.source_id,
                                                                " · ",
                                                                evidence.locator || "Location unavailable",
                                                                " · ",
                                                                evidence.support_state === "verified" ? "Verified" : evidence.support_state === "retrieved" ? "Retrieved" : evidence.support_state === "supplied" ? "Supplied" : "Support needs review"
                                                            ]
                                                        }, `${evidence.source_id}:${evidence.locator ?? "no-locator"}:${index}`, true, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 276,
                                                            columnNumber: 118
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 36
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "No claim-level evidence is saved."
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 276,
                                                            columnNumber: 728
                                                        }, this),
                                                        " This claim remains visible with its support gap."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 700
                                                }, this)
                                            ]
                                        }, `${claim.claim_id}:${claim.claim_revision ?? "legacy"}`, true, {
                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                            lineNumber: 271,
                                            columnNumber: 32
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 269,
                                columnNumber: 404
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 267,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-labelledby": `questions-${issue.issue_id}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].issueSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "search",
                                    size: 25
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                    lineNumber: 282,
                                    columnNumber: 44
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 282,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Questions that change the answer"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 282,
                                columnNumber: 89
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: `questions-${issue.issue_id}`,
                                children: "Facts and legal questions"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 282,
                                columnNumber: 158
                            }, this),
                            !questions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: "No linked questions are saved for this issue."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 283,
                                columnNumber: 28
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: 10
                                },
                                children: questions.map((question)=>{
                                    const isLegal = question.question_kind === "legal";
                                    const saving = localBusy === `question:${question.question_id}`;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: question.state === "answered" ? undefined : "wash-attention",
                                        style: {
                                            border: "1px solid var(--line-faint)",
                                            borderRadius: "var(--radius)",
                                            padding: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "btn-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `state-label ${question.state === "answered" ? "state-healthy" : "state-attention"}`,
                                                        children: questionLabel(question)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 36
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "record-meta",
                                                        children: isLegal ? "Legal question" : "Factual question"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 171
                                                    }, this),
                                                    (question.issue_ids?.length ?? 0) > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "record-meta",
                                                        children: [
                                                            "Shared with ",
                                                            question.issue_ids.length,
                                                            " issues"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 298
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 287,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: reading,
                                                children: question.text
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 288,
                                                columnNumber: 11
                                            }, this),
                                            question.consequence ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: muted,
                                                children: question.consequence
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 288,
                                                columnNumber: 73
                                            }, this) : null,
                                            question.answer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "record-meta",
                                                        children: question.answer_kind === "legal_analysis" || isLegal ? "Legal analysis" : "Reported fact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: reading,
                                                        children: question.answer
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 163
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 289,
                                                columnNumber: 30
                                            }, this) : null,
                                            question.state !== "answered" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "field-block",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "field-label",
                                                                children: isLegal ? "Legal analysis" : "Reported fact"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 116
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                className: "text-input prose",
                                                                disabled: busy || saving || !props.onQuestionAnswer,
                                                                onChange: (event)=>setAnswerDrafts((current)=>({
                                                                            ...current,
                                                                            [question.question_id]: event.target.value
                                                                        })),
                                                                placeholder: isLegal ? "Record legal analysis. This will not create a reported fact." : "Record the answer as a reported fact.",
                                                                value: answerDrafts[question.question_id] ?? ""
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 199
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 85
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "btn-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "btn tiny",
                                                                disabled: busy || saving || !props.onQuestionAnswer || !(answerDrafts[question.question_id] ?? "").trim(),
                                                                onClick: ()=>void answerQuestion(question, "answered"),
                                                                type: "button",
                                                                children: saving ? "Saving…" : isLegal ? "Save legal analysis" : "Save reported fact"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 617
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "btn quiet tiny",
                                                                disabled: busy || saving || !props.onQuestionAnswer,
                                                                onClick: ()=>void answerQuestion(question, "left_open"),
                                                                type: "button",
                                                                children: "Leave open"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 911
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 592
                                                    }, this),
                                                    !props.onQuestionAnswer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: muted,
                                                        children: unavailable
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 290,
                                                        columnNumber: 1124
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 290,
                                                columnNumber: 44
                                            }, this) : null
                                        ]
                                    }, question.question_id, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 286,
                                        columnNumber: 16
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 283,
                                columnNumber: 97
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 281,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        "aria-labelledby": `ways-${issue.issue_id}`,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].issueSection,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: "check",
                                    size: 25
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                    lineNumber: 296,
                                    columnNumber: 44
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 296,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Ways forward"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 296,
                                columnNumber: 88
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIssue$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: `ways-${issue.issue_id}`,
                                children: "Options and mitigation"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 296,
                                columnNumber: 137
                            }, this),
                            props.responseOptions?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: 8,
                                    marginBottom: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "record-meta",
                                        children: hasAnalysisPointer ? "Legacy option history" : "Legacy option fallback"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 297,
                                        columnNumber: 99
                                    }, this),
                                    props.responseOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: "wash-agent",
                                            style: {
                                                border: "1px dashed var(--agent-edge)",
                                                borderRadius: "var(--radius)",
                                                padding: 11
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "btn-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `state-label ${option.state === "proposed" ? "state-agent" : ""}`,
                                                            children: legacyOptionStateLabel(option.state)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 423
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "record-meta",
                                                            children: option.option_id
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 552
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 398
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    style: {
                                                        font: "600 16px/1.35 var(--serif)",
                                                        margin: "6px 0"
                                                    },
                                                    children: option.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 613
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: muted,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Condition:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 717
                                                        }, this),
                                                        " ",
                                                        option.condition?.trim() || "Unknown condition"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                    lineNumber: 297,
                                                    columnNumber: 700
                                                }, this)
                                            ]
                                        }, option.option_id, true, {
                                            fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                            lineNumber: 297,
                                            columnNumber: 248
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 297,
                                columnNumber: 40
                            }, this) : analysis?.options.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: "Current saved paths are shown in Saved issue analysis above."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 297,
                                columnNumber: 846
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: "No saved response options are linked to this issue."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 297,
                                columnNumber: 930
                            }, this),
                            workItems.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: 8
                                },
                                children: workItems.map((work)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        style: {
                                            border: "1px solid var(--line-faint)",
                                            borderRadius: "var(--radius)",
                                            padding: 11
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: work.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 298,
                                                columnNumber: 220
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "btn-row",
                                                style: {
                                                    marginTop: 5
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `state-label ${work.state === "done" || work.state === "complete" || work.state === "completed" ? "state-healthy" : "state-attention"}`,
                                                        children: work.state === "done" || work.state === "complete" || work.state === "completed" ? "Completed" : work.state || "State unknown"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 299
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: muted,
                                                        children: [
                                                            "Owner: ",
                                                            work.owner || "Unassigned"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 588
                                                    }, this),
                                                    work.required ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "state-label state-attention",
                                                        children: "Required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 667
                                                    }, this) : null,
                                                    ![
                                                        "done",
                                                        "closed",
                                                        "complete",
                                                        "completed"
                                                    ].includes(work.state) && props.onCompleteWork ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn tiny",
                                                        type: "button",
                                                        disabled: busy,
                                                        onClick: ()=>work.reviewRequired ? openDispositionForm() : void props.onCompleteWork?.(work.work_item_id),
                                                        children: work.reviewRequired ? "Review conclusion" : "Complete work"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 829
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                                lineNumber: 298,
                                                columnNumber: 249
                                            }, this)
                                        ]
                                    }, work.work_item_id, true, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 298,
                                        columnNumber: 93
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 298,
                                columnNumber: 27
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: "No mitigation work is linked to this issue."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 298,
                                columnNumber: 1102
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "btn-row",
                                style: {
                                    marginTop: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn tiny",
                                        disabled: !props.onCreateMitigation,
                                        onClick: ()=>props.onCreateMitigation?.(issue.issue_id),
                                        title: !props.onCreateMitigation ? unavailable : undefined,
                                        type: "button",
                                        children: "Create mitigation work"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 299,
                                        columnNumber: 58
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet tiny",
                                        disabled: !props.onRecordDecision,
                                        onClick: ()=>props.onRecordDecision?.(issue.issue_id),
                                        title: !props.onRecordDecision ? unavailable : undefined,
                                        type: "button",
                                        children: "Record formal decision"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                        lineNumber: 299,
                                        columnNumber: 288
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 299,
                                columnNumber: 7
                            }, this),
                            !props.onCreateMitigation && !props.onRecordDecision ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: muted,
                                children: unavailable
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                                lineNumber: 300,
                                columnNumber: 63
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                        lineNumber: 295,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
                lineNumber: 248,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workspace/IssueReviewDetail.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, this);
}
_s(IssueReviewDetail, "shha49zXSg6/Kk4NaROvlSQ5jjA=");
_c = IssueReviewDetail;
var _c;
__turbopack_context__.k.register(_c, "IssueReviewDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_workspace_IssueReviewDetail_tsx_0g8d06l._.js.map