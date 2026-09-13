(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/workspace/UnderstandPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UnderstandPanel,
    "longAnswerPreview",
    ()=>longAnswerPreview,
    "questionAnswerKind",
    ()=>questionAnswerKind
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orientationPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/orientationPresentation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$ChangeRecap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/ChangeRecap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueNavigator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/IssueNavigator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueReviewDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/IssueReviewDetail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$OrientationSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/OrientationSummary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$ProblemBreakdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/ProblemBreakdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$WorkItemSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/WorkItemSummary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterReview.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const reading = {
    font: "400 16px/1.65 var(--serif)",
    color: "var(--ink-2)",
    margin: "8px 0"
};
const card = {
    border: "1px solid var(--line)",
    borderRadius: "var(--radius)",
    background: "var(--raised)",
    padding: 16,
    minWidth: 0
};
const muted = {
    color: "var(--ink-4)",
    font: "400 15px/1.5 var(--sans)",
    margin: "5px 0"
};
const LONG_ANSWER_CHARACTER_LIMIT = 1200;
function openingBlockPreview(answer) {
    const completeAnswer = {
        text: answer
    };
    let fence = null;
    let position = 0;
    let previewEnd = 0;
    for (const line of answer.split(/(?<=\n)/)){
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
        if (!fence && /^\s*\n$/.test(line) && position <= LONG_ANSWER_CHARACTER_LIMIT) previewEnd = position;
    }
    return previewEnd ? {
        text: answer.slice(0, previewEnd).trimEnd()
    } : completeAnswer;
}
function longAnswerPreview(answer) {
    const completeAnswer = {
        text: answer
    };
    if (answer.length <= LONG_ANSWER_CHARACTER_LIMIT) return completeAnswer;
    if (/!?\[[^\]]+\]\[[^\]]*\]|^\s*\[[^\]]+\]:/m.test(answer)) return completeAnswer;
    if (/^\s*(`{3,}|~{3,})/m.test(answer)) return openingBlockPreview(answer);
    let position = 0;
    for (const line of answer.split(/(?<=\n)/)){
        const lineStart = position;
        position += line.length;
        if (/^\s*(?:#{1,6}\s+)?Current answer\s*#*\s*$/i.test(line)) {
            const earlierText = answer.slice(0, lineStart).trim();
            return earlierText ? {
                text: answer.slice(lineStart).trimStart(),
                earlierText
            } : completeAnswer;
        }
    }
    return openingBlockPreview(answer);
}
const answerMarkdownComponents = {
    table: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tableScroll,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 71,
                columnNumber: 96
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
            lineNumber: 71,
            columnNumber: 60
        }, ("TURBOPACK compile-time value", void 0)),
    pre: ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].codeBlock,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
            lineNumber: 72,
            columnNumber: 58
        }, ("TURBOPACK compile-time value", void 0))
};
function receiptText(receipt, fallback) {
    if (receipt.state === "not_saved") {
        return (receipt.completed_parts ?? []).includes("reported_fact") ? "Fact saved. Question update not saved." : `${fallback} not saved.`;
    }
    if (receipt.state === "proposed") return "Proposed reframe saved.";
    return `${fallback} saved.`;
}
function questionState(question) {
    if (question.state === "answered") return "Answered";
    if (question.state === "left_open") return "Left open";
    return "Open question";
}
function questionAnswerKind(question) {
    return question.question_kind === "legal" ? "legal_analysis" : "reported_fact";
}
function questionAnswerLabel(question) {
    return questionAnswerKind(question) === "legal_analysis" ? "Legal analysis" : "Reported fact";
}
function receiptClass(state) {
    return state === "not_saved" ? "state-failure" : state === "proposed" || state === "working" ? "state-agent" : "state-healthy";
}
function UnderstandPanel(props) {
    _s();
    var _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
    const { snapshot, loading, error, selectedIssueId, onSelectIssue, onIssueUpdate, onQuestionChange, onProposalAction, onQuestionAnswer, onQuestionHistory, onQuestionRestore, onRefresh, onTargetChange, onAction, onOpenArtifact, onOpenEvidence } = props;
    const answerClaims = snapshot?.answer_claims ?? [];
    const [questionDraft, setQuestionDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [proposalDrafts, setProposalDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [answerDrafts, setAnswerDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [answeringIds, setAnsweringIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(props.questionHistory ?? []);
    const [historyOpen, setHistoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [noticeState, setNoticeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [actionError, setActionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [answerExpanded, setAnswerExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hiddenReviewIds, setHiddenReviewIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const answerId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const allIssuesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const actionKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const proposalInputs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const actionKey = (signature)=>{
        const existing = actionKeys.current.get(signature);
        if (existing) return existing;
        const key = `workspace:${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
        actionKeys.current.set(signature, key);
        return key;
    };
    if (!snapshot) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Matter understanding",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    margin: 0
                },
                children: loading ? "Preparing matter understanding" : "Matter understanding"
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 131,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: muted,
                children: loading ? "Loading the saved question and work." : error || "No saved matter understanding is available."
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 132,
                columnNumber: 5
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn tiny",
                onClick: onRefresh,
                type: "button",
                children: "Retry"
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 133,
                columnNumber: 14
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
        lineNumber: 130,
        columnNumber: 25
    }, this);
    const currentQuestion = snapshot.question;
    const matterId = snapshot.matter_id;
    const questions = snapshot.questions ?? (snapshot.supporting_question ? [
        snapshot.supporting_question
    ] : []);
    const proposals = snapshot.pending_reframes ?? [];
    const facts = props.materialFacts ?? [];
    const sources = props.sourceActions ?? [];
    const savedAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orientationPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orientationAnswer"])(props.orientation, snapshot.short_answer);
    const answerIsStale = snapshot.stale || savedAnswer.state === "stale";
    const hasReviewProjection = snapshot.review_items !== undefined;
    const reviewItems = (snapshot.review_items ?? []).filter((item)=>!hiddenReviewIds.includes(item.issue_id)).slice(0, 3);
    const issueById = new Map((snapshot.issues ?? []).map((issue)=>[
            issue.issue_id,
            issue
        ]));
    const selectedIssue = selectedIssueId ? issueById.get(selectedIssueId) ?? null : null;
    const effectiveQuestionLinks = (question)=>[
            ...new Set([
                question.issue_id,
                ...question.issue_ids ?? []
            ].filter((id)=>Boolean(id)))
        ];
    const selectedQuestions = selectedIssue ? questions.filter((question)=>effectiveQuestionLinks(question).includes(selectedIssue.issue_id)) : [];
    const analysisStatus = selectedIssue ? snapshot.issue_analyses?.[selectedIssue.issue_id] : undefined;
    const selectedClaims = selectedIssue ? (snapshot.claims ?? []).filter((claim)=>(selectedIssue.claim_ids ?? []).includes(claim.claim_id) && (!selectedIssue.claim_output_revisions?.[claim.claim_id] || selectedIssue.claim_output_revisions[claim.claim_id] === claim.output_revision) || Boolean(analysisStatus?.analysis?.source_revisions[`claim:${claim.claim_id}`]) && analysisStatus?.analysis?.source_revisions[`claim:${claim.claim_id}`] === claim.output_revision) : [];
    const openTarget = (target)=>{
        if (props.onOpenTarget) {
            props.onOpenTarget(target);
            return;
        }
        if (target.path) {
            onOpenArtifact(target.path);
            return;
        }
        onTargetChange({
            matter_id: target.matter_id,
            artifact_path: target.kind === "artifact" ? target.path : undefined
        });
    };
    const chooseIssue = (issueId)=>{
        onSelectIssue(issueId);
        window.requestAnimationFrame(()=>window.scrollTo({
                top: 0,
                behavior: "auto"
            }));
        onTargetChange(issueId ? {
            matter_id: snapshot.matter_id,
            business_question_id: currentQuestion.question_id,
            business_question_revision: currentQuestion.revision,
            issue_id: issueId
        } : null);
    };
    async function useReceipt(action, savedLabel, after) {
        setBusy(true);
        setActionError("");
        try {
            const receipt = await action();
            setNotice(receiptText(receipt, savedLabel));
            setNoticeState(receipt.state);
            if (receipt.state !== "not_saved") after?.();
            onRefresh();
            return receipt;
        } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : `${savedLabel} was not saved. Your text is retained.`);
            return null;
        } finally{
            setBusy(false);
        }
    }
    async function saveQuestion() {
        _s1();
        const draft = questionDraft;
        if (!draft?.text.trim()) return;
        if (draft.baseRevision !== currentQuestion.revision) {
            setActionError("The business question changed after you began editing. Rebase your edit or use the latest saved question before saving.");
            return;
        }
        const text = draft.text.trim();
        const signature = `question:${draft.baseRevision}:${text}`;
        await useReceipt({
            "UnderstandPanel.saveQuestion.useReceipt": ()=>onQuestionChange({
                    text,
                    expected_revision: draft.baseRevision,
                    source_action_key: actionKey(signature)
                })
        }["UnderstandPanel.saveQuestion.useReceipt"], "Business question", {
            "UnderstandPanel.saveQuestion.useReceipt": ()=>setQuestionDraft(null)
        }["UnderstandPanel.saveQuestion.useReceipt"]);
    }
    _s1(saveQuestion, "dUKDluOVi4gJCxEebPCrjb7b4Z8=", false, function() {
        return [
            useReceipt
        ];
    });
    async function actOnProposal(proposal, action) {
        _s2();
        const text = (proposalDrafts[proposal.proposal_id] ?? proposal.text).trim();
        const signature = `proposal:${action}:${proposal.proposal_id}:${currentQuestion.revision}:${text}`;
        await useReceipt({
            "UnderstandPanel.actOnProposal.useReceipt": ()=>onProposalAction(proposal.proposal_id, {
                    action,
                    text: action === "apply" ? text : undefined,
                    expected_revision: currentQuestion.revision,
                    source_action_key: actionKey(signature)
                })
        }["UnderstandPanel.actOnProposal.useReceipt"], action === "apply" ? "Proposed reframe" : "Proposal rejection", {
            "UnderstandPanel.actOnProposal.useReceipt": ()=>setProposalDrafts({
                    "UnderstandPanel.actOnProposal.useReceipt": (current)=>{
                        const next = {
                            ...current
                        };
                        delete next[proposal.proposal_id];
                        return next;
                    }
                }["UnderstandPanel.actOnProposal.useReceipt"])
        }["UnderstandPanel.actOnProposal.useReceipt"]);
    }
    _s2(actOnProposal, "dUKDluOVi4gJCxEebPCrjb7b4Z8=", false, function() {
        return [
            useReceipt
        ];
    });
    async function answerQuestion(question, state) {
        const answer = answerDrafts[question.question_id]?.trim();
        if (state === "answered" && !answer) return;
        const signature = `support:${state}:${question.question_id}:${question.source_revision ?? ""}:${answer ?? ""}`;
        setAnsweringIds((current)=>current.includes(question.question_id) ? current : [
                ...current,
                question.question_id
            ]);
        setActionError("");
        try {
            const receipt = await onQuestionAnswer(question.question_id, {
                state,
                answer: state === "answered" ? answer : undefined,
                answer_kind: state === "answered" ? questionAnswerKind(question) : undefined,
                expected_revision: question.source_revision ?? "",
                source_action_key: actionKey(signature)
            });
            setNotice(receiptText(receipt, state === "answered" ? "Answer" : "Question state"));
            setNoticeState(receipt.state);
            if (receipt.state !== "not_saved") setAnswerDrafts((current)=>{
                const next = {
                    ...current
                };
                delete next[question.question_id];
                return next;
            });
            onRefresh();
        } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : "Question update was not saved. Your text is retained.");
        } finally{
            setAnsweringIds((current)=>current.filter((questionId)=>questionId !== question.question_id));
        }
    }
    async function exploreQuestion(question) {
        const target = {
            matter_id: matterId,
            business_question_id: currentQuestion.question_id,
            business_question_revision: currentQuestion.revision,
            issue_id: effectiveQuestionLinks(question)[0] ?? null
        };
        onTargetChange(target);
        setBusy(true);
        setActionError("");
        try {
            await onAction({
                action: "explore_question",
                instruction: `Explore why this matters: ${question.text}`,
                target,
                source_action_key: actionKey(`explore:${question.question_id}:${currentQuestion.revision}`)
            });
            setNotice("Exploration started in the matter conversation.");
            setNoticeState("working");
        } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : "Exploration could not start. Try again.");
        } finally{
            setBusy(false);
        }
    }
    async function loadHistory() {
        if (!onQuestionHistory) {
            setHistoryOpen((open)=>!open);
            return;
        }
        setBusy(true);
        setActionError("");
        try {
            setHistory(await onQuestionHistory());
            setHistoryOpen(true);
        } catch (cause) {
            setActionError(cause instanceof Error ? cause.message : "Question history could not load.");
        } finally{
            setBusy(false);
        }
    }
    async function restore(revision) {
        _s3();
        if (!onQuestionRestore) return;
        await useReceipt({
            "UnderstandPanel.restore.useReceipt": ()=>onQuestionRestore({
                    revision,
                    expected_revision: currentQuestion.revision,
                    source_action_key: actionKey(`restore:${revision}:${currentQuestion.revision}`)
                })
        }["UnderstandPanel.restore.useReceipt"], "Earlier business question");
    }
    _s3(restore, "dUKDluOVi4gJCxEebPCrjb7b4Z8=", false, function() {
        return [
            useReceipt
        ];
    });
    const questionDetails = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "record-meta",
                children: "Current business question"
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 229,
                columnNumber: 5
            }, this),
            questionDraft === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            font: "600 24px/1.25 var(--serif)",
                            margin: "5px 0"
                        },
                        children: currentQuestion.text || "No business question is saved yet."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 230,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn tiny quiet",
                                onClick: ()=>setQuestionDraft({
                                        text: currentQuestion.text,
                                        baseRevision: currentQuestion.revision
                                    }),
                                type: "button",
                                children: "Edit question"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 193
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn tiny quiet",
                                disabled: busy,
                                onClick: ()=>void loadHistory(),
                                type: "button",
                                children: historyOpen ? "Refresh earlier questions" : "Earlier questions"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 369
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 230,
                        columnNumber: 168
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 230,
                columnNumber: 31
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gap: 9,
                    marginTop: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "field-block",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "field-label",
                                children: "Business question"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 641
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "text-input prose",
                                disabled: busy,
                                onChange: (event)=>setQuestionDraft((current)=>current ? {
                                            ...current,
                                            text: event.target.value
                                        } : current),
                                value: questionDraft.text
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 695
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 230,
                        columnNumber: 610
                    }, this),
                    questionDraft.baseRevision !== currentQuestion.revision ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "warning-callout",
                        role: "status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "The saved question changed while you were editing."
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 1007
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "btn-row",
                                style: {
                                    marginTop: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet tiny",
                                        disabled: busy,
                                        onClick: ()=>setQuestionDraft({
                                                text: currentQuestion.text,
                                                baseRevision: currentQuestion.revision
                                            }),
                                        type: "button",
                                        children: "Use latest question"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 230,
                                        columnNumber: 1124
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn tiny",
                                        disabled: busy,
                                        onClick: ()=>setQuestionDraft((current)=>current ? {
                                                    ...current,
                                                    baseRevision: currentQuestion.revision
                                                } : current),
                                        type: "button",
                                        children: "Rebase my edit"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 230,
                                        columnNumber: 1322
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 1074
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 230,
                        columnNumber: 960
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn tiny",
                                disabled: busy || questionDraft.baseRevision !== currentQuestion.revision || !questionDraft.text.trim(),
                                onClick: ()=>void saveQuestion(),
                                type: "button",
                                children: busy ? "Saving…" : "Save question"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 1571
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn tiny quiet",
                                disabled: busy,
                                onClick: ()=>setQuestionDraft(null),
                                type: "button",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 230,
                                columnNumber: 1800
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 230,
                        columnNumber: 1546
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 230,
                columnNumber: 555
            }, this),
            historyOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gap: 7,
                    marginTop: 12
                },
                children: history.map((question)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderTop: "1px solid var(--line-faint)",
                            paddingTop: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: question.revision === currentQuestion.revision ? "Current question" : "Based on an earlier question"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 231,
                                columnNumber: 200
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: reading,
                                children: question.text
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 231,
                                columnNumber: 339
                            }, this),
                            question.revision !== currentQuestion.revision && onQuestionRestore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn quiet tiny",
                                disabled: busy,
                                onClick: ()=>void restore(question.revision),
                                type: "button",
                                children: "Restore this question"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 231,
                                columnNumber: 448
                            }, this) : null
                        ]
                    }, question.revision, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 231,
                        columnNumber: 103
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 231,
                columnNumber: 20
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
        lineNumber: 228,
        columnNumber: 27
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Matter understanding",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].surface,
        "data-issue-selected": selectedIssue ? "true" : undefined,
        id: `matter-${snapshot.matter_id}-review`,
        children: [
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "state-label state-agent",
                role: "status",
                children: "Refreshing saved matter work"
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 235,
                columnNumber: 16
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "warning-callout",
                role: "status",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Workspace refresh failed."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 236,
                        columnNumber: 61
                    }, this),
                    " Saved work is still shown. ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        onClick: onRefresh,
                        type: "button",
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 236,
                        columnNumber: 131
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 236,
                columnNumber: 14
            }, this) : null,
            selectedIssue ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `btn quiet ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].backToIssues}`,
                type: "button",
                onClick: ()=>chooseIssue(null),
                children: "← All issues"
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 237,
                columnNumber: 22
            }, this) : null,
            notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `state-label ${receiptClass(noticeState)}`,
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 238,
                columnNumber: 15
            }, this) : null,
            actionError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "warning-callout",
                role: "status",
                children: actionError
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 239,
                columnNumber: 20
            }, this) : null,
            hasReviewProjection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$OrientationSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                citationState: answerClaims.some((claim)=>claim.evidence.some((evidence)=>evidence.available_excerpt && (evidence.path || evidence.url))) ? "available" : "none",
                allIssueCount: (snapshot.issues ?? []).length,
                onOpenIssue: chooseIssue,
                onShowAllIssues: ()=>allIssuesRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    }),
                qualification: snapshot.qualification ?? props.orientation?.caveats?.[0],
                question: currentQuestion,
                renderAnswer: props.renderSupportedText ? (text)=>props.renderSupportedText({
                        text,
                        surface: "current_answer",
                        claims: answerClaims
                    }) : undefined,
                reviewItems: snapshot.review_items ?? [],
                shortAnswer: snapshot.short_answer ?? savedAnswer.text
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 241,
                columnNumber: 28
            }, this) : props.orientation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$OrientationSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                compact: true,
                error: error,
                onOpenTarget: openTarget,
                onRefresh: onRefresh,
                orientation: props.orientation
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 241,
                columnNumber: 763
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$ProblemBreakdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                status: snapshot.problem_analysis,
                onDiscuss: props.onProblemDiscuss,
                onOpenSource: onOpenArtifact,
                onOpenIssue: chooseIssue
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 242,
                columnNumber: 5
            }, this),
            answerIsStale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "warning-callout",
                role: "status",
                children: [
                    "Some saved analysis is based on an earlier question or source version. It remains available while you refresh it. ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn quiet tiny",
                        onClick: onRefresh,
                        type: "button",
                        children: "Refresh matter"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 244,
                        columnNumber: 181
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 244,
                columnNumber: 22
            }, this) : null,
            !props.orientation && !hasReviewProjection ? questionDetails : null,
            hasReviewProjection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                "aria-labelledby": "needs-review-heading",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reviewBlock}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].between,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                id: "needs-review-heading",
                                children: "Needs your review"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 249,
                                columnNumber: 43
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "record-meta",
                                children: "Up to 3 items"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 249,
                                columnNumber: 127
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 249,
                        columnNumber: 7
                    }, this),
                    reviewItems.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].reviewRows,
                        children: reviewItems.map((item)=>{
                            const issue = issueById.get(item.issue_id);
                            return issue ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$WorkItemSummary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                item: item,
                                issue: issue,
                                onClosePanel: ()=>setHiddenReviewIds((current)=>current.includes(item.issue_id) ? current : [
                                            ...current,
                                            item.issue_id
                                        ]),
                                onOpenIssue: chooseIssue
                            }, item.issue_id, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 250,
                                columnNumber: 152
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "warning-callout",
                                role: "status",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Issue reference unavailable."
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 250,
                                        columnNumber: 439
                                    }, this),
                                    " Review item ",
                                    item.issue_id,
                                    " remains visible."
                                ]
                            }, item.issue_id, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 250,
                                columnNumber: 372
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 250,
                        columnNumber: 29
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].muted,
                        children: "No saved item needs your review."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 250,
                        columnNumber: 549
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 248,
                columnNumber: 28
            }, this) : null,
            hasReviewProjection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                ref: allIssuesRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueNavigator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    issues: snapshot.issues ?? [],
                    issuesRevision: snapshot.issues_revision,
                    onSelect: chooseIssue,
                    selectedIssueId: selectedIssueId
                }, void 0, false, {
                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                    lineNumber: 253,
                    columnNumber: 56
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 253,
                columnNumber: 28
            }, this) : null,
            hasReviewProjection ? props.sectionNavigation ?? null : null,
            hasReviewProjection && selectedIssue ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueReviewDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onCompleteWork: props.onCompleteWork,
                analysisStatus: analysisStatus,
                onAnalyzePaths: props.onAnalyzePaths,
                onRecordPath: props.onRecordPath,
                busy: busy,
                claims: [
                    ...new Map([
                        ...selectedClaims,
                        ...analysisStatus?.claims ?? []
                    ].map((claim)=>[
                            `${claim.claim_id}:${claim.output_revision}`,
                            claim
                        ])).values()
                ],
                decisions: props.linkedDecisions ?? [],
                error: actionError || error,
                issue: selectedIssue,
                issuesRevision: snapshot.issues_revision ?? "",
                matterId: snapshot.matter_id,
                onCreateMitigation: props.onCreateMitigation,
                onDiscuss: props.onDiscuss,
                onDisposition: props.onDisposition,
                onIssueUpdate: onIssueUpdate,
                onOpenDecisionMap: props.onOpenDecisionMap,
                onOpenDocument: props.onOpenDocument,
                onOpenEvidence: onOpenEvidence,
                onQuestionAnswer: onQuestionAnswer,
                onRecordDecision: props.onRecordDecision,
                onResearchLegalBasis: props.onResearchLegalBasis,
                questions: selectedQuestions,
                renderSupportedText: props.renderSupportedText,
                responseOptions: props.responseOptions ?? [],
                workItems: props.linkedWorkItems ?? []
            }, selectedIssue.issue_id, false, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 257,
                columnNumber: 45
            }, this) : null,
            savedAnswer.text && (!hasReviewProjection || savedAnswer.text.trim() !== (snapshot.short_answer ?? "").trim()) ? (()=>{
                const answerIsLong = savedAnswer.text.length > LONG_ANSWER_CHARACTER_LIMIT;
                const preview = answerExpanded || !answerIsLong ? {
                    text: savedAnswer.text
                } : longAnswerPreview(savedAnswer.text);
                const visibleAnswer = preview.text;
                const previewIsOneLongBlock = answerIsLong && !answerExpanded && visibleAnswer === savedAnswer.text;
                const answerCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "wash-agent",
                    style: {
                        ...card,
                        borderStyle: "dashed",
                        borderColor: "var(--agent-edge)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "record-meta",
                            children: hasReviewProjection ? "Full saved answer" : "Useful current answer"
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 135
                        }, this),
                        answerIsStale ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "state-label state-agent",
                            style: {
                                marginLeft: 8
                            },
                            children: "Based on an earlier question or source"
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 258
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: muted,
                            children: [
                                "Source: ",
                                savedAnswer.label,
                                savedAnswer.path ? ` · ${savedAnswer.path.split("/").at(-1)}` : ""
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 379
                        }, this),
                        !hasReviewProjection && props.orientation?.caveats?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "warning-callout",
                            style: {
                                margin: "8px 0",
                                paddingLeft: 24
                            },
                            children: props.orientation.caveats.map((caveat, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        components: answerMarkdownComponents,
                                        remarkPlugins: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                        ],
                                        children: caveat
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 264,
                                        columnNumber: 715
                                    }, this)
                                }, `${caveat}:${index}`, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 684
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 557
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "reading",
                            id: answerId,
                            style: {
                                maxWidth: "100%",
                                minWidth: 0,
                                overflowWrap: "anywhere",
                                ...previewIsOneLongBlock ? {
                                    maxHeight: "30rem",
                                    overflow: "hidden"
                                } : {}
                            },
                            children: props.renderSupportedText ? props.renderSupportedText({
                                text: visibleAnswer,
                                surface: "current_answer",
                                claims: answerClaims
                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                components: answerMarkdownComponents,
                                remarkPlugins: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                ],
                                children: visibleAnswer
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 264,
                                columnNumber: 1156
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 840
                        }, this),
                        !answerExpanded && preview.earlierText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            "aria-label": "Earlier text in saved answer",
                            style: {
                                borderTop: "1px solid var(--line-faint)",
                                marginTop: 16,
                                paddingTop: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "record-meta",
                                    children: "Earlier text in saved answer"
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 1452
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "reading",
                                    style: {
                                        maxWidth: "100%",
                                        minWidth: 0,
                                        overflowWrap: "anywhere"
                                    },
                                    children: props.renderSupportedText ? props.renderSupportedText({
                                        text: preview.earlierText,
                                        surface: "current_answer",
                                        claims: answerClaims
                                    }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        components: answerMarkdownComponents,
                                        remarkPlugins: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                        ],
                                        children: preview.earlierText
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 264,
                                        columnNumber: 1747
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 1517
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 1317
                        }, this) : null,
                        answerIsLong ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: muted,
                                    children: answerExpanded ? "The full saved answer is shown." : preview.earlierText ? "Showing the saved current answer first. Earlier text in the saved answer remains below." : previewIsOneLongBlock ? "This saved answer starts with one long Markdown block." : "Showing complete opening blocks from this saved answer."
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 1908
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-controls": answerId,
                                    "aria-expanded": answerExpanded,
                                    className: "btn quiet tiny",
                                    onClick: ()=>setAnswerExpanded((expanded)=>!expanded),
                                    type: "button",
                                    children: answerExpanded ? "Show less" : "Read full answer"
                                }, void 0, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 2238
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 1906
                        }, this) : null,
                        savedAnswer.path ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "btn-row",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn quiet tiny",
                                onClick: ()=>onOpenArtifact(savedAnswer.path),
                                type: "button",
                                children: "Open saved answer"
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 264,
                                columnNumber: 2518
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 2493
                        }, this) : null,
                        snapshot.answer_links?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "btn-row",
                            children: snapshot.answer_links.map((path)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn quiet tiny",
                                    onClick: ()=>onOpenArtifact(path),
                                    type: "button",
                                    children: "Open supporting work"
                                }, path, false, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 264,
                                    columnNumber: 2752
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 264,
                            columnNumber: 2690
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                    lineNumber: 264,
                    columnNumber: 26
                }, this);
                return hasReviewProjection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                            children: "Read full answer"
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 265,
                            columnNumber: 45
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 10
                            },
                            children: answerCard
                        }, void 0, false, {
                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                            lineNumber: 265,
                            columnNumber: 80
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                    lineNumber: 265,
                    columnNumber: 36
                }, this) : answerCard;
            })() : props.orientation?.answer_state === "unavailable" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                style: card,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "record-meta",
                        children: "Useful current answer"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 266,
                        columnNumber: 86
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: muted,
                        children: "No saved answer is available. Refresh the matter or open the next saved work item to recover local context."
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 266,
                        columnNumber: 144
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny",
                        onClick: onRefresh,
                        type: "button",
                        children: "Refresh matter"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 266,
                        columnNumber: 272
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 266,
                columnNumber: 64
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].details,
                id: `matter-${snapshot.matter_id}-evidence`,
                open: !hasReviewProjection,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: hasReviewProjection ? "Supporting material and history" : "Matter details"
                    }, void 0, false, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 270,
                        columnNumber: 114
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterReview$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].supporting,
                        children: [
                            props.orientation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                        children: "Question, editing and history"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 271,
                                        columnNumber: 35
                                    }, this),
                                    questionDetails
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 271,
                                columnNumber: 26
                            }, this) : null,
                            proposals.map((proposal)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "wash-agent",
                                    style: {
                                        ...card,
                                        borderStyle: "dashed",
                                        borderColor: "var(--agent-edge)"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "record-meta",
                                            children: "Proposed reframe"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 273,
                                            columnNumber: 170
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "field-block",
                                            style: {
                                                marginTop: 7
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "field-label",
                                                    children: "Suggested business question"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 279
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    className: "text-input prose",
                                                    disabled: busy,
                                                    onChange: (event)=>setProposalDrafts((current)=>({
                                                                ...current,
                                                                [proposal.proposal_id]: event.target.value
                                                            })),
                                                    ref: (node)=>{
                                                        proposalInputs.current[proposal.proposal_id] = node;
                                                    },
                                                    value: proposalDrafts[proposal.proposal_id] ?? proposal.text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 343
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 273,
                                            columnNumber: 223
                                        }, this),
                                        proposal.reason ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: muted,
                                            children: proposal.reason
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 273,
                                            columnNumber: 677
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "btn-row",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn tiny",
                                                    disabled: busy || !(proposalDrafts[proposal.proposal_id] ?? proposal.text).trim(),
                                                    onClick: ()=>void actOnProposal(proposal, "apply"),
                                                    type: "button",
                                                    children: "Apply"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 748
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn quiet tiny",
                                                    disabled: busy,
                                                    onClick: ()=>proposalInputs.current[proposal.proposal_id]?.focus(),
                                                    type: "button",
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 942
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "btn quiet tiny",
                                                    disabled: busy,
                                                    onClick: ()=>void actOnProposal(proposal, "reject"),
                                                    type: "button",
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 1090
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 273,
                                            columnNumber: 723
                                        }, this)
                                    ]
                                }, proposal.proposal_id, true, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 273,
                                    columnNumber: 34
                                }, this)),
                            props.businessContext ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                style: card,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "record-meta",
                                        children: "Business context"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 275,
                                        columnNumber: 52
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: reading,
                                        children: props.businessContext
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 275,
                                        columnNumber: 105
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 275,
                                columnNumber: 30
                            }, this) : null,
                            facts.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                style: card,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "record-meta",
                                        children: "Material facts"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 276,
                                        columnNumber: 43
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        style: {
                                            ...reading,
                                            paddingLeft: 20
                                        },
                                        children: facts.map((fact, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: [
                                                    fact.text,
                                                    fact.state ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "faint",
                                                        children: [
                                                            " · ",
                                                            fact.state
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 236
                                                    }, this) : null,
                                                    fact.source ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "faint",
                                                        children: [
                                                            " · ",
                                                            fact.source
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 305
                                                    }, this) : null
                                                ]
                                            }, fact.id ?? `${fact.text}:${index}`, true, {
                                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                lineNumber: 276,
                                                columnNumber: 166
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 276,
                                        columnNumber: 94
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 276,
                                columnNumber: 21
                            }, this) : null,
                            questions.map((question)=>{
                                const answering = answeringIds.includes(question.question_id);
                                const answerLabel = questionAnswerLabel(question);
                                const isLegal = question.question_kind === "legal";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: question.state !== "answered" ? "wash-attention" : undefined,
                                    style: card,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "baseline",
                                                justifyContent: "space-between",
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `state-label ${question.state === "left_open" ? "state-attention" : question.state === "answered" ? "state-healthy" : "state-attention"}`,
                                                    children: questionState(question)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 429
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "btn-row",
                                                    children: [
                                                        question.issue_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn quiet tiny",
                                                            onClick: ()=>chooseIssue(question.issue_id ?? null),
                                                            type: "button",
                                                            children: "View issue"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 663
                                                        }, this) : null,
                                                        !isLegal && props.onFactRequest && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orientationPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canRequestFact"])(question.state) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn quiet tiny",
                                                            onClick: ()=>props.onFactRequest?.(question.question_id),
                                                            type: "button",
                                                            children: "Request a fact"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 863
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 617
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 331
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "record-meta",
                                            children: isLegal ? "Legal question" : "Factual question"
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 1015
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: reading,
                                            children: question.text
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 1101
                                        }, this),
                                        question.consequence ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: muted,
                                            children: question.consequence
                                        }, void 0, false, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 1163
                                        }, this) : null,
                                        question.answer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "record-meta",
                                                    children: answerLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 1238
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: reading,
                                                    children: question.answer
                                                }, void 0, false, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 1288
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 1233
                                        }, this) : null,
                                        question.state !== "answered" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "field-block",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "field-label",
                                                            children: answerLabel
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 1408
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            className: "text-input prose",
                                                            disabled: answering,
                                                            onChange: (event)=>setAnswerDrafts((current)=>({
                                                                        ...current,
                                                                        [question.question_id]: event.target.value
                                                                    })),
                                                            placeholder: isLegal ? "Record legal analysis. This will not create a reported fact." : "Record the answer as a reported fact.",
                                                            value: answerDrafts[question.question_id] ?? ""
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 1458
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 1377
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "btn-row",
                                                    style: {
                                                        marginTop: 9
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn tiny",
                                                            disabled: answering || !(answerDrafts[question.question_id] ?? "").trim(),
                                                            onClick: ()=>void answerQuestion(question, "answered"),
                                                            type: "button",
                                                            children: answering ? "Saving…" : isLegal ? "Save legal analysis" : "Save reported fact"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 1869
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn agent tiny",
                                                            disabled: busy,
                                                            onClick: ()=>void exploreQuestion(question),
                                                            type: "button",
                                                            children: "Explore why"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 2134
                                                        }, this),
                                                        question.state === "open" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn quiet tiny",
                                                            disabled: answering,
                                                            onClick: ()=>void answerQuestion(question, "left_open"),
                                                            type: "button",
                                                            children: "Leave open"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 2295
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 1819
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                            lineNumber: 278,
                                            columnNumber: 1375
                                        }, this) : null
                                    ]
                                }, question.question_id, true, {
                                    fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                    lineNumber: 278,
                                    columnNumber: 209
                                }, this);
                            }),
                            !hasReviewProjection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$IssueNavigator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                issues: snapshot.issues ?? [],
                                issuesRevision: snapshot.issues_revision,
                                onIssueUpdate: onIssueUpdate,
                                onSelect: chooseIssue,
                                selectedIssueId: selectedIssueId
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 280,
                                columnNumber: 29
                            }, this) : null,
                            sources.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                style: card,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "record-meta",
                                        children: "Sources and actions"
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 281,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "btn-row",
                                        style: {
                                            marginTop: 8
                                        },
                                        children: sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "btn-row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn quiet tiny",
                                                        onClick: ()=>source.evidence ? onOpenEvidence(source.evidence) : source.path ? onOpenArtifact(source.path) : undefined,
                                                        type: "button",
                                                        children: source.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 242
                                                    }, this),
                                                    props.onCompareSources && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$orientationPresentation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCompareSuppliedSource"])(source.evidence?.support_state) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn quiet tiny",
                                                        onClick: props.onCompareSources,
                                                        type: "button",
                                                        children: "Compare"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 522
                                                    }, this) : null
                                                ]
                                            }, `${source.label}:${index}`, true, {
                                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                                lineNumber: 281,
                                                columnNumber: 183
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                        lineNumber: 281,
                                        columnNumber: 101
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 281,
                                columnNumber: 23
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$ChangeRecap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                firstVisit: props.orientation?.first_visit,
                                meaningfulChanges: props.orientation?.changes,
                                onMarkSeen: props.onMarkSeen ?? (async ()=>{
                                    throw new Error("Mark seen is not available in this view.");
                                }),
                                onOpenArtifact: onOpenArtifact,
                                onOpenTarget: props.onOpenTarget,
                                recap: snapshot.recap ?? null
                            }, void 0, false, {
                                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                                lineNumber: 282,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                        lineNumber: 270,
                        columnNumber: 209
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/workspace/UnderstandPanel.tsx",
                lineNumber: 270,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/workspace/UnderstandPanel.tsx",
        lineNumber: 234,
        columnNumber: 10
    }, this);
}
_s(UnderstandPanel, "M96JqtLOrBIjdvE72hOGvAcx+Sc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = UnderstandPanel;
var _c;
__turbopack_context__.k.register(_c, "UnderstandPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_workspace_UnderstandPanel_tsx_0ygj2ab._.js.map