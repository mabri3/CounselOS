(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE",
    ()=>API_BASE,
    "MODEL_PROVIDER_IDS",
    ()=>MODEL_PROVIDER_IDS,
    "acceptRecommendation",
    ()=>acceptRecommendation,
    "addMatterParticipant",
    ()=>addMatterParticipant,
    "advanceCompanyInterview",
    ()=>advanceCompanyInterview,
    "answerAnnotation",
    ()=>answerAnnotation,
    "applyBatchAction",
    ()=>applyBatchAction,
    "assignWorkItem",
    ()=>assignWorkItem,
    "auditDecisions",
    ()=>auditDecisions,
    "cancelChatRun",
    ()=>cancelChatRun,
    "changeMatterStorage",
    ()=>changeMatterStorage,
    "completeWorkItem",
    ()=>completeWorkItem,
    "continuityPersonHeaders",
    ()=>continuityPersonHeaders,
    "createAnnotation",
    ()=>createAnnotation,
    "createDecision",
    ()=>createDecision,
    "createMatter",
    ()=>createMatter,
    "createMatterWorkItem",
    ()=>createMatterWorkItem,
    "createSchedule",
    ()=>createSchedule,
    "createSkill",
    ()=>createSkill,
    "createVault",
    ()=>createVault,
    "currentContinuityStorageKey",
    ()=>currentContinuityStorageKey,
    "draftSkill",
    ()=>draftSkill,
    "effortLabel",
    ()=>effortLabel,
    "exportFileUrl",
    ()=>exportFileUrl,
    "finalizeWorkProduct",
    ()=>finalizeWorkProduct,
    "getActiveVault",
    ()=>getActiveVault,
    "getAgentDetail",
    ()=>getAgentDetail,
    "getAnnotations",
    ()=>getAnnotations,
    "getAnswerContract",
    ()=>getAnswerContract,
    "getAudiences",
    ()=>getAudiences,
    "getAutomations",
    ()=>getAutomations,
    "getChatRun",
    ()=>getChatRun,
    "getChatRuns",
    ()=>getChatRuns,
    "getCompanyInterview",
    ()=>getCompanyInterview,
    "getCompanyProfile",
    ()=>getCompanyProfile,
    "getConversation",
    ()=>getConversation,
    "getConversations",
    ()=>getConversations,
    "getDailyConversation",
    ()=>getDailyConversation,
    "getDailyConversations",
    ()=>getDailyConversations,
    "getDecisions",
    ()=>getDecisions,
    "getDocumentReview",
    ()=>getDocumentReview,
    "getDossierRequest",
    ()=>getDossierRequest,
    "getFile",
    ()=>getFile,
    "getMatter",
    ()=>getMatter,
    "getMatters",
    ()=>getMatters,
    "getRecommendation",
    ()=>getRecommendation,
    "getResearchOptions",
    ()=>getResearchOptions,
    "getResearchQueue",
    ()=>getResearchQueue,
    "getResearchRun",
    ()=>getResearchRun,
    "getSettings",
    ()=>getSettings,
    "getSkill",
    ()=>getSkill,
    "getSkillQuestions",
    ()=>getSkillQuestions,
    "getSkillSuggestions",
    ()=>getSkillSuggestions,
    "getSkills",
    ()=>getSkills,
    "getStoredMatters",
    ()=>getStoredMatters,
    "getTools",
    ()=>getTools,
    "loadVault",
    ()=>loadVault,
    "matterTargetDateFromForm",
    ()=>matterTargetDateFromForm,
    "moveMatter",
    ()=>moveMatter,
    "notifyMatterChanged",
    ()=>notifyMatterChanged,
    "performMatterAction",
    ()=>performMatterAction,
    "prioritizeWorkItem",
    ()=>prioritizeWorkItem,
    "proposeRecommendation",
    ()=>proposeRecommendation,
    "rawFileUrl",
    ()=>rawFileUrl,
    "recoverIntakeQuestion",
    ()=>recoverIntakeQuestion,
    "reorderResearchQueue",
    ()=>reorderResearchQueue,
    "repairMatterConsistency",
    ()=>repairMatterConsistency,
    "request",
    ()=>request,
    "resetAnswerContract",
    ()=>resetAnswerContract,
    "resumeDossierRequest",
    ()=>resumeDossierRequest,
    "resumeResearchQueue",
    ()=>resumeResearchQueue,
    "retryChatRun",
    ()=>retryChatRun,
    "retryResearchItem",
    ()=>retryResearchItem,
    "revisePathDecision",
    ()=>revisePathDecision,
    "runSchedule",
    ()=>runSchedule,
    "saveAgentDetail",
    ()=>saveAgentDetail,
    "saveAnswerContract",
    ()=>saveAnswerContract,
    "saveCompanyProfile",
    ()=>saveCompanyProfile,
    "saveFile",
    ()=>saveFile,
    "saveSettings",
    ()=>saveSettings,
    "saveWorkProductDraft",
    ()=>saveWorkProductDraft,
    "sendChat",
    ()=>sendChat,
    "setContinuityTransport",
    ()=>setContinuityTransport,
    "startChatRun",
    ()=>startChatRun,
    "startDossierRequest",
    ()=>startDossierRequest,
    "startIntake",
    ()=>startIntake,
    "startResearchRun",
    ()=>startResearchRun,
    "stopDossierRequest",
    ()=>stopDossierRequest,
    "stopResearchQueue",
    ()=>stopResearchQueue,
    "subscribeMatterChanges",
    ()=>subscribeMatterChanges,
    "updateDocumentReview",
    ()=>updateDocumentReview,
    "updateMatterRisk",
    ()=>updateMatterRisk,
    "updateRecommendation",
    ()=>updateRecommendation,
    "updateSchedule",
    ()=>updateSchedule,
    "updateSkill",
    ()=>updateSkill,
    "uploadDocument",
    ()=>uploadDocument,
    "uploadDocuments",
    ()=>uploadDocuments,
    "uploadWorkspaceDocuments",
    ()=>uploadWorkspaceDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modelSettingsRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modelSettingsRows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stubs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stubs.ts [app-client] (ecmascript)");
;
;
let continuityTransport = {
    vault: "",
    person: "",
    demo: false
};
const matterChangeEvent = "themis-matter-records-changed";
function notifyMatterChanged(matterId) {
    if (("TURBOPACK compile-time value", "object") === "undefined" || typeof window.dispatchEvent !== "function") return;
    const detail = {
        matterId,
        vault: continuityTransport.vault
    };
    window.dispatchEvent(new CustomEvent(matterChangeEvent, {
        detail
    }));
    try {
        if (typeof BroadcastChannel !== "undefined") {
            const channel = new BroadcastChannel(matterChangeEvent);
            channel.postMessage(detail);
            channel.close();
        }
    } catch  {}
}
function subscribeMatterChanges(matterId, refresh) {
    const receive = (data)=>{
        if ((data.matterId === matterId || data.matterId === "*") && data.vault === continuityTransport.vault) refresh();
    };
    const local = (event)=>receive(event.detail);
    window.addEventListener(matterChangeEvent, local);
    window.addEventListener("focus", refresh);
    let channel = null;
    try {
        channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(matterChangeEvent) : null;
    } catch  {}
    if (channel) channel.onmessage = (event)=>receive(event.data ?? {});
    return ()=>{
        window.removeEventListener(matterChangeEvent, local);
        window.removeEventListener("focus", refresh);
        channel?.close();
    };
}
function setContinuityTransport(vault, person, demo) {
    continuityTransport = {
        vault,
        person,
        demo
    };
}
function currentContinuityStorageKey(matter, slot) {
    const { vault, person } = continuityTransport;
    return vault ? `themis.continuity.v1:${[
        vault,
        person,
        matter,
        slot
    ].map(encodeURIComponent).join(":")}` : null;
}
function continuityPersonHeaders() {
    return continuityTransport.demo ? {
        "X-Themis-Person-Id": continuityTransport.person
    } : {};
}
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8207/api") ?? "http://localhost:8000/api";
const MODEL_PROVIDER_IDS = [
    "mock",
    "openai_compatible",
    "opencode_go",
    "codex",
    "antigravity_cli"
];
const MODEL_PROVIDER_LABELS = {
    mock: "Mock (offline)",
    openai_compatible: "OpenAI-compatible",
    opencode_go: "OpenCode Go",
    codex: "Codex CLI",
    antigravity_cli: "Antigravity CLI"
};
function effortLabel(effort) {
    return ({
        default: "Default",
        none: "None",
        minimal: "Minimal",
        low: "Low",
        medium: "Medium",
        high: "High",
        xhigh: "Extra high",
        max: "Maximum"
    })[effort] ?? effort;
}
function formatErrorDetail(detail, fallback) {
    if (typeof detail === "string") return detail || fallback;
    if (detail && typeof detail === "object" && "message" in detail && typeof detail.message === "string") return detail.message;
    const entries = Array.isArray(detail) ? detail : [
        detail
    ];
    const messages = entries.flatMap((entry)=>{
        if (!entry || typeof entry !== "object") return [];
        const validation = entry;
        if (typeof validation.msg !== "string" || !validation.msg) return [];
        const path = Array.isArray(validation.loc) ? validation.loc.filter((part)=>typeof part === "string" || typeof part === "number").join(".") : "";
        return [
            path ? `${path}: ${validation.msg}` : validation.msg
        ];
    });
    return messages.length ? messages.join("; ") : fallback;
}
async function request(path, init) {
    const controller = new AbortController();
    let timedOut = false;
    const timeout = globalThis.setTimeout(()=>{
        timedOut = true;
        controller.abort();
    }, 15_000);
    const abortFromCaller = ()=>controller.abort();
    if (init?.signal?.aborted) controller.abort();
    else init?.signal?.addEventListener("abort", abortFromCaller, {
        once: true
    });
    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...init,
            signal: controller.signal,
            headers: {
                ...init?.body instanceof FormData ? {} : {
                    "Content-Type": "application/json"
                },
                ...continuityPersonHeaders(),
                ...init?.headers
            },
            cache: "no-store"
        });
    } catch (error) {
        if (timedOut && error instanceof DOMException && error.name === "AbortError") {
            throw new Error("The request timed out. The save may have completed. Reload to check the saved result, or retry the same action.");
        }
        if (error instanceof TypeError || error instanceof DOMException && error.name === "AbortError") {
            throw new Error("Counsel OS cannot reach the local service. Check that it is running, then retry.");
        }
        throw error;
    } finally{
        globalThis.clearTimeout(timeout);
        init?.signal?.removeEventListener("abort", abortFromCaller);
    }
    if (!response.ok) {
        const payload = await response.json().catch(()=>({
                detail: response.statusText
            }));
        throw Object.assign(new Error(formatErrorDetail(payload.detail, `Request failed: ${response.status}`)), {
            status: response.status,
            detail: payload.detail
        });
    }
    let changedMatter = path.match(/^\/matters\/([^/?]+)/)?.[1];
    if (!changedMatter && typeof init?.body === "string") {
        try {
            changedMatter = JSON.parse(init.body).matter_id;
        } catch  {}
    }
    if (!changedMatter && path.startsWith("/files")) changedMatter = "*";
    if (changedMatter && init?.method && ![
        "GET",
        "HEAD"
    ].includes(init.method.toUpperCase()) && !path.endsWith("/seen")) notifyMatterChanged(decodeURIComponent(changedMatter));
    if (response.status === 204) return undefined;
    return response.json();
}
function getStoredMatters(view) {
    return request(`/matters/storage?view=${view}`);
}
function changeMatterStorage(matterId, action) {
    return request(`/matters/${encodeURIComponent(matterId)}/storage`, {
        method: "POST",
        body: JSON.stringify({
            action
        })
    });
}
async function getMatters() {
    return request("/matters");
}
function matterTargetDateFromForm(formData) {
    const value = formData.get("target_date");
    return typeof value === "string" && value.trim() ? value.trim() : null;
}
async function createMatter(payload) {
    return request("/matters", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function getMatter(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}`);
}
async function moveMatter(matterId, stage, reason = "") {
    return request(`/matters/${encodeURIComponent(matterId)}/stage`, {
        method: "PATCH",
        body: JSON.stringify({
            stage,
            reason
        })
    });
}
async function updateMatterRisk(matterId, riskLevel, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/risk`, {
        method: "PATCH",
        body: JSON.stringify({
            risk_level: riskLevel,
            actor
        })
    });
}
async function performMatterAction(matterId, payload) {
    return request(`/matters/${encodeURIComponent(matterId)}/actions`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function completeWorkItem(matterId, workItemId, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-items/complete`, {
        method: "POST",
        body: JSON.stringify({
            work_item_id: workItemId,
            actor
        })
    });
}
async function createMatterWorkItem(matterId, payload) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-items`, {
        method: "POST",
        body: JSON.stringify({
            matter_id: matterId,
            ...payload
        })
    });
}
async function assignWorkItem(matterId, workItemId, owner, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-items/assign`, {
        method: "POST",
        body: JSON.stringify({
            work_item_id: workItemId,
            owner,
            actor
        })
    });
}
async function prioritizeWorkItem(matterId, workItemId, priority, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-items/priority`, {
        method: "POST",
        body: JSON.stringify({
            work_item_id: workItemId,
            priority,
            actor
        })
    });
}
async function addMatterParticipant(matterId, name, role, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/participants`, {
        method: "POST",
        body: JSON.stringify({
            name,
            role,
            actor
        })
    });
}
async function repairMatterConsistency(matterId, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/consistency/repair`, {
        method: "POST",
        body: JSON.stringify({
            actor
        })
    });
}
async function getAnnotations(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}/annotations`);
}
async function createAnnotation(matterId, payload) {
    return request(`/matters/${encodeURIComponent(matterId)}/annotations`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function answerAnnotation(matterId, annotationId) {
    return request(`/matters/${encodeURIComponent(matterId)}/annotations/${encodeURIComponent(annotationId)}/answer`, {
        method: "POST"
    });
}
async function uploadDocument(matterId, file) {
    const body = new FormData();
    body.append("file", file);
    return request(`/matters/${encodeURIComponent(matterId)}/upload`, {
        method: "POST",
        body
    });
}
async function uploadDocuments(matterId, files) {
    const body = new FormData();
    files.forEach((file)=>body.append("files", file));
    return request(`/matters/${encodeURIComponent(matterId)}/uploads`, {
        method: "POST",
        body
    });
}
async function uploadWorkspaceDocuments(files) {
    const body = new FormData();
    files.forEach((file)=>body.append("files", file));
    return request("/daily-uploads", {
        method: "POST",
        body
    });
}
async function startIntake(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}/intake`, {
        method: "POST"
    });
}
async function getResearchOptions(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}/research-options`);
}
async function startResearchRun(matterId, question = "", sourceActionKey, issueId, searchScope) {
    return request(`/matters/${encodeURIComponent(matterId)}/research-runs`, {
        method: "POST",
        body: JSON.stringify({
            question,
            source_action_key: sourceActionKey,
            issue_id: issueId,
            search_scope: searchScope
        })
    });
}
async function getResearchRun(matterId, runId) {
    return request(`/matters/${encodeURIComponent(matterId)}/research-runs/${encodeURIComponent(runId)}`);
}
async function getResearchQueue(matterId) {
    return request(`/settings/research-queue/${encodeURIComponent(matterId)}`);
}
async function reorderResearchQueue(matterId, runIds) {
    return request(`/settings/research-queue/${encodeURIComponent(matterId)}/reorder`, {
        method: "POST",
        body: JSON.stringify({
            run_ids: runIds
        })
    });
}
async function resumeResearchQueue(matterId) {
    return request(`/settings/research-queue/${encodeURIComponent(matterId)}/resume`, {
        method: "POST"
    });
}
async function stopResearchQueue(matterId) {
    return request(`/settings/research-queue/${encodeURIComponent(matterId)}/stop`, {
        method: "POST"
    });
}
async function retryResearchItem(matterId, runId) {
    return request(`/settings/research-queue/${encodeURIComponent(matterId)}/${encodeURIComponent(runId)}/retry`, {
        method: "POST"
    });
}
async function applyBatchAction(matterId, batchId, action) {
    return request(`/matters/${encodeURIComponent(matterId)}/batches`, {
        method: "POST",
        body: JSON.stringify({
            batch_id: batchId,
            action
        })
    });
}
async function finalizeWorkProduct(matterId, draftPath) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-product/finalize`, {
        method: "POST",
        body: JSON.stringify({
            draft_path: draftPath
        })
    });
}
async function saveWorkProductDraft(matterId, title, content, sourceActionKey, recommendation) {
    return request(`/matters/${encodeURIComponent(matterId)}/work-product/draft`, {
        method: "POST",
        body: JSON.stringify({
            title,
            content,
            source_action_key: sourceActionKey,
            recommendation
        })
    });
}
async function getCompanyProfile() {
    return request("/settings/company");
}
async function saveCompanyProfile(profile) {
    return request("/settings/company", {
        method: "PUT",
        body: JSON.stringify(profile)
    });
}
async function getAnswerContract() {
    return request("/settings/answer-contract");
}
async function saveAnswerContract(content) {
    return request("/settings/answer-contract", {
        method: "PUT",
        body: JSON.stringify({
            content
        })
    });
}
async function resetAnswerContract() {
    return request("/settings/answer-contract/reset", {
        method: "POST"
    });
}
async function getCompanyInterview() {
    return request("/settings/company/interview");
}
async function advanceCompanyInterview(payload) {
    return request("/settings/company/interview", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function getFile(path) {
    return request(`/files?path=${encodeURIComponent(path)}`);
}
async function getRecommendation(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}/recommendation`);
}
async function updateRecommendation(matterId, content, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/recommendation`, {
        method: "PUT",
        body: JSON.stringify({
            content,
            actor
        })
    });
}
async function proposeRecommendation(matterId, content, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/recommendation/proposals`, {
        method: "POST",
        body: JSON.stringify({
            content,
            actor
        })
    });
}
async function acceptRecommendation(matterId, actor) {
    return request(`/matters/${encodeURIComponent(matterId)}/recommendation/accept`, {
        method: "POST",
        body: JSON.stringify({
            actor
        })
    });
}
async function saveFile(document) {
    return request(`/files?path=${encodeURIComponent(document.path)}`, {
        method: "PUT",
        body: JSON.stringify({
            content: document.content,
            metadata: document.metadata
        })
    });
}
async function getDocumentReview(path) {
    return request(`/files/review?path=${encodeURIComponent(path)}`);
}
async function updateDocumentReview(path, action) {
    const storageKey = currentContinuityStorageKey("review", path);
    const signature = JSON.stringify({
        path,
        ...action
    });
    let body = {
        source_action_key: `review:${globalThis.crypto.randomUUID()}`,
        ...action
    };
    if (storageKey && ("TURBOPACK compile-time value", "object") !== "undefined") {
        try {
            const prior = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (prior?.signature === signature) body = prior.command;
        } catch  {}
        localStorage.setItem(storageKey, JSON.stringify({
            signature,
            command: body
        }));
    }
    const headers = continuityPersonHeaders();
    const result = await request(`/files/review?path=${encodeURIComponent(path)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
    });
    if (storageKey && ("TURBOPACK compile-time value", "object") !== "undefined") {
        try {
            const current = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (current?.command.source_action_key === body.source_action_key) localStorage.removeItem(storageKey);
        } catch  {}
    }
    return result;
}
function exportFileUrl(path, format, options) {
    const query = new URLSearchParams({
        path,
        format,
        ...options
    });
    return `${API_BASE}/files/export?${query}`;
}
async function sendChat(payload) {
    return request("/chat", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function startChatRun(matterId, payload) {
    return request(`/matters/${encodeURIComponent(matterId)}/chat-runs`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function recoverIntakeQuestion(matterId, conversationId) {
    return request(`/matters/${encodeURIComponent(matterId)}/intake-question-recovery`, {
        method: "POST",
        body: JSON.stringify({
            conversation_id: conversationId
        })
    });
}
async function getChatRuns(matterId, conversationId) {
    return request(`/matters/${encodeURIComponent(matterId)}/chat-runs?conversation_id=${encodeURIComponent(conversationId)}`);
}
async function getChatRun(matterId, runId) {
    return request(`/matters/${encodeURIComponent(matterId)}/chat-runs/${encodeURIComponent(runId)}`);
}
async function retryChatRun(matterId, runId) {
    return request(`/matters/${encodeURIComponent(matterId)}/chat-runs/${encodeURIComponent(runId)}/retry`, {
        method: "POST"
    });
}
async function getSkills() {
    return request("/skills");
}
async function getSkillQuestions() {
    return request("/skills/questions");
}
async function draftSkill(payload) {
    return request("/skills/draft", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function getSkillSuggestions() {
    return request("/skills/suggestions", {
        method: "POST"
    });
}
async function createSkill(payload) {
    return request("/skills", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function getSkill(skillId) {
    return request(`/skills/${encodeURIComponent(skillId)}`);
}
async function updateSkill(skillId, payload) {
    return request(`/skills/${encodeURIComponent(skillId)}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}
async function getConversations(matterId) {
    return request(`/matters/${encodeURIComponent(matterId)}/conversations`);
}
async function getConversation(matterId, conversationId) {
    return request(`/matters/${encodeURIComponent(matterId)}/conversations/${encodeURIComponent(conversationId)}`);
}
async function getDossierRequest(matterId, requestId, signal) {
    return request(`/matters/${encodeURIComponent(matterId)}/dossier-requests/${encodeURIComponent(requestId)}`, {
        signal
    });
}
async function startDossierRequest(matterId, requestId, payload) {
    return request(`/matters/${encodeURIComponent(matterId)}/dossier-requests/${encodeURIComponent(requestId)}/start`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function stopDossierRequest(matterId, requestId, expectedSequence) {
    return request(`/matters/${encodeURIComponent(matterId)}/dossier-requests/${encodeURIComponent(requestId)}/stop`, {
        method: "POST",
        body: JSON.stringify({
            expected_sequence: expectedSequence
        })
    });
}
async function resumeDossierRequest(matterId, requestId, expectedSequence, retryIssueIds) {
    return request(`/matters/${encodeURIComponent(matterId)}/dossier-requests/${encodeURIComponent(requestId)}/resume`, {
        method: "POST",
        body: JSON.stringify({
            expected_sequence: expectedSequence,
            retry_unknown: false,
            retry_issue_ids: retryIssueIds
        })
    });
}
async function getDailyConversations() {
    return request("/daily-conversations");
}
async function getDailyConversation(day) {
    return request(`/daily-conversations/${encodeURIComponent(day)}`);
}
async function getDecisions(status) {
    return request(`/decisions${status ? `?status=${encodeURIComponent(status)}` : ""}`);
}
async function createDecision(payload) {
    return request("/decisions", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
async function auditDecisions() {
    return request("/decisions/audit", {
        method: "POST"
    });
}
async function getAutomations() {
    return request("/automations");
}
async function runSchedule(scheduleId) {
    return request(`/automations/schedules/${encodeURIComponent(scheduleId)}/run`, {
        method: "POST"
    });
}
async function updateSchedule(scheduleId, payload) {
    return request(`/automations/schedules/${encodeURIComponent(scheduleId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}
async function createSchedule(payload) {
    return request("/automations/schedules", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function rawFileUrl(path) {
    return `${API_BASE}/files/raw?path=${encodeURIComponent(path)}`;
}
async function getSettings({ includeModelCatalog = true } = {}) {
    const { values, model_catalog } = await request(includeModelCatalog ? "/settings" : "/settings?include_model_catalog=false");
    const catalog = normalizeModelCatalog(model_catalog);
    const providerValue = typeof values["agents.provider"] === "string" ? values["agents.provider"] : "mock";
    const selectedProvider = catalog.providers.find((provider)=>provider.id === providerValue) ?? unavailableProvider(providerValue, providerValue, "The saved provider is not in the current catalog.");
    if (!catalog.providers.some((provider)=>provider.id === selectedProvider.id)) {
        catalog.providers.push(selectedProvider);
    }
    const requestedModel = typeof values["agents.reasoning_model"] === "string" ? values["agents.reasoning_model"] : "";
    let selectedModel = selectedProvider.models.find((model)=>model.id === requestedModel);
    if (!selectedModel && requestedModel) {
        selectedModel = {
            id: requestedModel,
            label: `${requestedModel} (unavailable)`,
            reasoning_efforts: []
        };
        selectedProvider.models.push(selectedModel);
    }
    selectedModel ??= selectedProvider.models[0];
    const requestedEffort = typeof values["agents.reasoning_effort"] === "string" ? values["agents.reasoning_effort"] : "default";
    const selectedEffort = selectedModel?.reasoning_efforts.includes(requestedEffort) ? requestedEffort : selectedModel?.reasoning_efforts[0] ?? requestedEffort;
    const sections = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stubs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_SETTINGS"].map((section)=>({
            ...section,
            rows: section.rows.map((row)=>{
                if (row.config_key === "agents.provider") {
                    return {
                        ...row,
                        value: selectedProvider?.id ?? "mock",
                        options: catalog.providers.map((provider)=>provider.id),
                        option_labels: Object.fromEntries(catalog.providers.map((provider)=>[
                                provider.id,
                                provider.label
                            ]))
                    };
                }
                if (row.config_key === "agents.reasoning_model") {
                    return {
                        ...row,
                        value: selectedModel?.id ?? "mock",
                        options: selectedProvider?.models.map((model)=>model.id) ?? [
                            "mock"
                        ],
                        option_labels: Object.fromEntries(selectedProvider?.models.map((model)=>[
                                model.id,
                                model.label
                            ]) ?? [])
                    };
                }
                if (row.config_key === "agents.reasoning_effort") {
                    const efforts = selectedModel?.reasoning_efforts.length ? selectedModel.reasoning_efforts : [
                        selectedEffort
                    ];
                    return {
                        ...row,
                        value: selectedEffort,
                        options: efforts,
                        option_labels: Object.fromEntries(efforts.map((effort)=>[
                                effort,
                                effortLabel(effort)
                            ]))
                    };
                }
                if (!row.config_key || !(row.config_key in values)) return {
                    ...row
                };
                const stored = values[row.config_key];
                return row.kind === "toggle" ? {
                    ...row,
                    on: typeof stored === "boolean" ? stored : row.on
                } : {
                    ...row,
                    value: typeof stored === "string" || typeof stored === "number" ? String(stored) : row.value
                };
            })
        }));
    const reviewRows = sections.find((section)=>section.id === "document-review")?.rows;
    if (reviewRows) {
        const lawyer = reviewRows.find((row)=>row.config_key === "document_review.lawyer_name")?.value?.trim() || "Lawyer";
        const defaultAuthor = reviewRows.find((row)=>row.config_key === "document_review.default_author");
        if (defaultAuthor) {
            defaultAuthor.options = [
                "Themis.ai",
                lawyer
            ];
            if (defaultAuthor.value === "Themis") defaultAuthor.value = "Themis.ai";
            if (![
                "Themis.ai",
                lawyer
            ].includes(defaultAuthor.value ?? "")) defaultAuthor.value = "Themis.ai";
        }
    }
    const research = sections.find((section)=>section.id === "research");
    if (research) research.rows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modelSettingsRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["alignModelRows"])(research.rows, {
        model_catalog: catalog,
        sections
    }, true);
    return {
        model_catalog: catalog,
        sections
    };
}
function unavailableProvider(id, label, detail) {
    return {
        id,
        label,
        readiness: "unavailable",
        readiness_detail: detail,
        models: []
    };
}
function normalizeModelCatalog(catalog) {
    const rawProviders = catalog?.providers ?? [];
    const providers = MODEL_PROVIDER_IDS.map((id)=>{
        const raw = rawProviders.find((provider)=>provider.id === id);
        if (!raw) return unavailableProvider(id, MODEL_PROVIDER_LABELS[id], "The provider was not returned by the model catalog.");
        return {
            id: raw.id,
            label: raw.label || MODEL_PROVIDER_LABELS[id],
            readiness: raw.readiness ?? (raw.models?.length ? "ready" : "missing"),
            readiness_detail: raw.readiness_detail ?? (raw.models?.length ? "Model catalog loaded." : "No models are available."),
            models: (raw.models ?? []).map((model)=>({
                    id: model.id,
                    label: model.label,
                    reasoning_efforts: model.reasoning_efforts ?? model.efforts ?? []
                }))
        };
    });
    return {
        providers,
        warning: catalog?.warning ?? (catalog ? null : "The model catalog is unavailable.")
    };
}
async function saveSettings(settings) {
    const values = Object.fromEntries(settings.sections.flatMap((section)=>section.rows.filter((row)=>row.kind !== "heading" && row.config_key).map((row)=>[
                row.config_key,
                row.kind === "toggle" ? !!row.on : row.value ?? ""
            ])));
    return request("/settings", {
        method: "PUT",
        body: JSON.stringify({
            values
        })
    });
}
async function getActiveVault() {
    return request("/settings/vault");
}
async function createVault(path) {
    return request("/settings/vault/create", {
        method: "POST",
        body: JSON.stringify({
            path
        })
    });
}
async function loadVault(path) {
    return request("/settings/vault/load", {
        method: "POST",
        body: JSON.stringify({
            path
        })
    });
}
async function getAgentDetail(agentId) {
    const [definition, { schedules }] = await Promise.all([
        request(`/automations/agents/${encodeURIComponent(agentId)}`),
        getAutomations()
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stubs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["agentDetailFrom"])(definition, schedules);
}
async function saveAgentDetail(agent) {
    return request(`/automations/agents/${encodeURIComponent(agent.agent_id)}`, {
        method: "PUT",
        body: JSON.stringify({
            name: agent.name,
            description: agent.description,
            instructions: agent.instructions,
            allowed_tools: agent.allowed_tools,
            max_steps: agent.max_steps,
            audience_id: agent.audience_id,
            audience_prompt: agent.audience_prompt,
            provider: agent.provider ?? "",
            model: agent.model ?? "",
            reasoning_effort: agent.reasoning_effort ?? ""
        })
    });
}
async function getTools() {
    return request("/automations/tools");
}
async function getAudiences() {
    return request("/automations/audiences");
}
async function cancelChatRun(matterId, runId) {
    return request(`/matters/${matterId}/chat-runs/${runId}/cancel`, {
        method: "POST"
    });
}
async function revisePathDecision(id, payload) {
    return request(`/decisions/${encodeURIComponent(id)}/revisions`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/chatCardLogic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "choiceNeedsDetail",
    ()=>choiceNeedsDetail,
    "effectiveQuestionMode",
    ()=>effectiveQuestionMode,
    "groupedAnswerText",
    ()=>groupedAnswerText,
    "legacyQuestionModeStorageKey",
    ()=>legacyQuestionModeStorageKey,
    "questionModeStorageKey",
    ()=>questionModeStorageKey,
    "questionProgressLabel",
    ()=>questionProgressLabel
]);
function questionProgressLabel(current, total) {
    return typeof current === "number" && typeof total === "number" && Number.isInteger(current) && Number.isInteger(total) && current >= 1 && total >= current ? `${current} of ${total}` : "Follow-up";
}
function effectiveQuestionMode(selectionMode, choiceCount) {
    return selectionMode !== "free_text" && choiceCount === 0 ? "free_text" : selectionMode;
}
function choiceNeedsDetail(value, label) {
    const normalizedValue = value.trim().toLowerCase();
    const normalizedLabel = label.trim().toLowerCase();
    return [
        "partly",
        "other",
        "change"
    ].includes(normalizedValue) || /^(?:partly|something else|other)\b/.test(normalizedLabel);
}
function questionModeStorageKey(matterId) {
    return `themis.ai:question-mode:${matterId}`;
}
function legacyQuestionModeStorageKey(matterId) {
    return `counsel-os:question-mode:${matterId}`;
}
function groupedAnswerText(questions, answers, stopAfterAnswers = false) {
    const lines = questions.map((question)=>{
        const answer = answers[question.question_id];
        if (!answer || answer.action === "skip") return `- ${question.text}\n  Skipped`;
        const labels = answer.values.map((value)=>question.choices.find((choice)=>choice.value === value)?.label ?? value);
        return `- ${question.text}\n  ${answer.text || labels.join(", ")}`;
    });
    const instruction = stopAfterAnswers ? "Use these answers together, update the matter, and complete intake without asking more questions." : "Use these answers together, update the matter, and reprioritize any questions that remain.";
    return `Answers to the prioritized intake questions:\n${lines.join("\n")}\n\n${instruction}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/chatMarkdown.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Separate standalone bold section labels in chat without rewriting stored prose. */ __turbopack_context__.s([
    "separateChatSections",
    ()=>separateChatSections
]);
function separateChatSections(text) {
    let fence = null;
    return text.split('\n').map((line)=>{
        const boundary = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (boundary) {
            if (!fence) fence = {
                marker: boundary[1][0],
                length: boundary[1].length
            };
            else if (boundary[1][0] === fence.marker && boundary[1].length >= fence.length && !boundary[2].trim()) fence = null;
            return line;
        }
        if (!fence && /^\*\*[^*\n]+\*\*[ \t]*$/.test(line)) return `\n${line}\n`;
        return line;
    }).join('\n');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/chatRunLogic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatAgentId",
    ()=>chatAgentId,
    "chatDraftStorageKey",
    ()=>chatDraftStorageKey,
    "chatFailureGuidance",
    ()=>chatFailureGuidance,
    "chatProgressLabel",
    ()=>chatProgressLabel,
    "chatRunStateLabel",
    ()=>chatRunStateLabel,
    "chatRunStorageKey",
    ()=>chatRunStorageKey,
    "chatSuggestions",
    ()=>chatSuggestions,
    "conversationChatDraftStorageKey",
    ()=>conversationChatDraftStorageKey,
    "durableChatProgress",
    ()=>durableChatProgress,
    "historicalQuestionStates",
    ()=>historicalQuestionStates,
    "intakeRecoveryKey",
    ()=>intakeRecoveryKey,
    "legacyChatDraftStorageKey",
    ()=>legacyChatDraftStorageKey,
    "legacyChatRunStorageKey",
    ()=>legacyChatRunStorageKey,
    "mergeChatMessages",
    ()=>mergeChatMessages,
    "needsIntakeQuestionRecovery",
    ()=>needsIntakeQuestionRecovery,
    "operationChangeLinks",
    ()=>operationChangeLinks,
    "pendingChatRunId",
    ()=>pendingChatRunId,
    "promoteConversationComposer",
    ()=>promoteConversationComposer,
    "remainingComposerValue",
    ()=>remainingComposerValue,
    "rememberChatRun",
    ()=>rememberChatRun,
    "safeChatFailureDetail",
    ()=>safeChatFailureDetail,
    "shouldCompactIntakeTurn",
    ()=>shouldCompactIntakeTurn,
    "shouldShowChatRunStatus",
    ()=>shouldShowChatRunStatus,
    "storeConversationComposer",
    ()=>storeConversationComposer,
    "visibleOperationResults",
    ()=>visibleOperationResults
]);
const chatRunStorageKey = (matterId, conversationId)=>`themis.ai:chat-run:${matterId}:${conversationId || "new"}`;
const legacyChatRunStorageKey = (matterId, conversationId)=>`counsel-os:chat-run:${matterId}:${conversationId || "new"}`;
const chatDraftStorageKey = (matterId)=>`themis.ai:chat-draft:${matterId}`;
const legacyChatDraftStorageKey = (matterId)=>`counsel-os:chat-draft:${matterId}`;
const conversationChatDraftStorageKey = (matterId, conversationId)=>`themis.ai:chat-draft:v2:${encodeURIComponent(matterId)}:${encodeURIComponent(conversationId || "new")}`;
function storeConversationComposer(storage, matterId, conversationId, value) {
    const key = conversationChatDraftStorageKey(matterId, conversationId);
    if (value) storage.setItem(key, value);
    else storage.removeItem(key);
}
function promoteConversationComposer(storage, matterId, fromConversationId, toConversationId, value) {
    const fromKey = conversationChatDraftStorageKey(matterId, fromConversationId);
    const toKey = conversationChatDraftStorageKey(matterId, toConversationId);
    if (fromKey === toKey) {
        storeConversationComposer(storage, matterId, toConversationId, value);
        return;
    }
    storeConversationComposer(storage, matterId, toConversationId, value);
    storage.removeItem(fromKey);
}
function remainingComposerValue(current, submittedSnapshot, consumedBySubmission, emptyValue) {
    return consumedBySubmission && current === submittedSnapshot ? emptyValue : current;
}
function mergeChatMessages(local, saved) {
    const keys = new Set(saved.flatMap((item)=>[
            item.message_id,
            `${item.role}:${item.content}`
        ]).filter(Boolean));
    const savedHasUser = saved.some((item)=>item.role === "user");
    return [
        ...saved,
        ...local.filter((item)=>!keys.has(item.message_id) && !keys.has(`${item.role}:${item.content}`) && !(savedHasUser && item.role === "user" && !item.message_id))
    ];
}
function pendingChatRunId(storage, matterId, conversationId) {
    return storage.getItem(chatRunStorageKey(matterId, conversationId)) ?? storage.getItem(chatRunStorageKey(matterId)) ?? storage.getItem(legacyChatRunStorageKey(matterId, conversationId)) ?? storage.getItem(legacyChatRunStorageKey(matterId));
}
function rememberChatRun(storage, matterId, run) {
    const pendingKey = chatRunStorageKey(matterId);
    const conversationKey = chatRunStorageKey(matterId, run.conversation_id);
    storage.setItem(conversationKey, run.run_id);
    storage.removeItem(legacyChatRunStorageKey(matterId, run.conversation_id));
    storage.removeItem(legacyChatRunStorageKey(matterId));
    if (run.conversation_id) storage.removeItem(pendingKey);
    else storage.setItem(pendingKey, run.run_id);
}
function chatRunStateLabel(state) {
    return ({
        queued: "Queued",
        running: "Working",
        completed: "Completed",
        failed: "Failed",
        interrupted: "Interrupted"
    })[state];
}
function shouldShowChatRunStatus(state) {
    return state !== "completed";
}
function safeChatFailureDetail(detail) {
    if (!detail || /failed to fetch/i.test(detail) || /https?:\/\//i.test(detail) || detail.length > 240) return "";
    return detail;
}
function chatFailureGuidance(failureClass) {
    return ({
        provider: "The model service did not finish. Review saved work, then retry once or continue manually.",
        timeout: "The model service reached its time limit. Review saved work, then retry once or continue manually.",
        output_shape: "The response could not be turned into the required action. Use the direct control or send a narrower request.",
        tool_validation: "The requested action needs corrected input. Review the saved draft, then correct the request.",
        tool_execution: "The workspace action did not complete. Use the direct control or address the stated prerequisite.",
        interrupted: "The application stopped before the request finished. Review saved work, then retry or continue manually.",
        unknown: "The request stopped before completion. Review saved output, then retry or continue manually."
    })[failureClass ?? "unknown"];
}
function durableChatProgress(run) {
    if (run.milestone) return run.milestone;
    return run.state === "queued" ? "Queued." : run.state === "running" ? "Model is working." : run.status;
}
function chatProgressLabel(cardAction) {
    return cardAction && [
        "answer",
        "answer_set",
        "skip",
        "stop"
    ].includes(cardAction.action) ? "Answer saved · Reassessing intake" : "Working…";
}
function chatSuggestions(options = []) {
    const namedOptions = options.map((option)=>option.trim()).filter(Boolean);
    return [
        ...namedOptions.length === 2 ? [
            "Compare both paths"
        ] : [],
        "Which other matters does this touch?",
        "What would change your view?"
    ];
}
function visibleOperationResults(results) {
    const savedWorkProduct = results.some((result)=>result.operation === "save_work_product" && result.status === "changed");
    const updatedIntake = results.some((result)=>result.operation === "update_matter_intake" && result.status === "changed");
    return results.filter((result)=>!(result.status === "no_change" && !result.required_user_action && !result.recovery) && !(savedWorkProduct && result.operation === "write_markdown" && result.status === "failed") && !(updatedIntake && result.operation === "record_intake_answer" && result.status === "changed"));
}
function operationChangeLinks(paths = []) {
    const links = [];
    const seen = new Set();
    for (const path of paths){
        const name = path.split("/").at(-1) ?? path;
        const label = name === "facts.md" ? "Facts, sources & assumptions" : name === "issues.md" ? "Issue map" : name === "matter.md" ? "Matter details" : name === "participants.md" ? "People & roles" : name === "recommendations.md" ? "Working recommendations" : name === "request.md" ? "Original request" : path.includes("/dossier-revisions/") || name === "dossier.md" ? "Dossier" : path.includes("/work-items/") ? "Work item" : path.includes("/decisions/") ? "Recorded decision" : path.includes("/events/") ? "Activity history" : name.replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
        if (!label || seen.has(label)) continue;
        seen.add(label);
        links.push({
            label,
            path
        });
    }
    return links;
}
function chatAgentId(intakeActive, activeAgentId) {
    if (intakeActive) return "intake-agent";
    return activeAgentId || "counsel-copilot";
}
function needsIntakeQuestionRecovery(intakeActive, messages) {
    if (!intakeActive) return false;
    const latest = messages.at(-1);
    return Boolean(latest?.role === "assistant" && !latest.workspace_action && !latest.cards?.some((card)=>card.type === "question"));
}
function intakeRecoveryKey(conversationId, messages) {
    const latestSavedUser = [
        ...messages
    ].reverse().find((message)=>message.role === "user" && Boolean(message.message_id));
    return latestSavedUser?.message_id ? `${conversationId}:${latestSavedUser.message_id}` : null;
}
function historicalQuestionStates(messages, messageIndex, questionIds, intakeActive, durableAnswers = [], questionTexts = {}) {
    const states = Object.fromEntries(questionIds.map((id)=>[
            id,
            {
                state: "active",
                values: []
            }
        ]));
    const laterSavedMessages = messages.slice(messageIndex + 1).filter((message)=>message.message_id);
    let stopped = false;
    for (const id of questionIds){
        const exact = durableAnswers.filter((answer)=>answer.question_id === id);
        const normalizedText = normalizeIntakeQuestion(questionTexts[id] ?? "");
        const textMatches = normalizedText ? durableAnswers.filter((answer)=>normalizeIntakeQuestion(answer.question) === normalizedText) : [];
        const durable = exact.length === 1 ? exact[0] : exact.length === 0 && textMatches.length === 1 ? textMatches[0] : null;
        if (!durable) continue;
        states[id] = durable.status === "skipped" ? {
            state: "superseded",
            values: []
        } : {
            state: "answered",
            values: durable.values?.length ? durable.values : durable.answer ? [
                durable.answer
            ] : []
        };
    }
    for (const message of laterSavedMessages){
        if (message.role !== "user" || !message.card_action) continue;
        const action = message.card_action;
        if (action.action === "answer" && states[action.card_id]?.state === "active") {
            states[action.card_id] = {
                state: "answered",
                values: action.values ?? []
            };
        } else if (action.action === "skip" && states[action.card_id]?.state === "active") {
            states[action.card_id] = {
                state: "superseded",
                values: []
            };
        } else if (action.action === "answer_set") {
            for (const answer of action.answers ?? []){
                if (!states[answer.card_id] || states[answer.card_id].state !== "active") continue;
                states[answer.card_id] = answer.action === "answer" ? {
                    state: "answered",
                    values: answer.values ?? []
                } : {
                    state: "superseded",
                    values: []
                };
            }
        } else if (action.action === "stop" && states[action.card_id]) {
            stopped = true;
        }
    }
    for (const id of questionIds){
        if (states[id].state !== "active") continue;
        if (stopped) states[id] = {
            state: "stopped",
            values: []
        };
        else if (!intakeActive || laterSavedMessages.length > 0) {
            states[id] = {
                state: "earlier",
                values: []
            };
        }
    }
    return states;
}
function normalizeIntakeQuestion(value) {
    return value.normalize("NFKC").trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function shouldCompactIntakeTurn(cards, states, content, hasVisibleOperationResult) {
    const questions = cards.filter((card)=>card.type === "question" && card.question_id);
    return questions.length > 0 && !hasVisibleOperationResult && !/\b(?:material )?assumption\b/i.test(content) && questions.every((card)=>!card.conflict && states[card.question_id]?.state !== "active");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/continuityApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "continuityCommand",
    ()=>continuityCommand,
    "continuityKey",
    ()=>continuityKey,
    "loadContinuityIdentity",
    ()=>loadContinuityIdentity,
    "switchContinuityPerson",
    ()=>switchContinuityPerson,
    "targetUrl",
    ()=>targetUrl,
    "useContinuityIdentity",
    ()=>useContinuityIdentity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
let identity = null;
let loading = null;
const eventName = "themis-continuity-person";
const continuityKey = (vault, person, matter, slot)=>`themis.continuity.v1:${[
        vault,
        person,
        matter,
        slot
    ].map(encodeURIComponent).join(":")}`;
function targetUrl(target) {
    const query = new URLSearchParams({
        continuity_kind: target.kind,
        continuity_id: target.target_id,
        view: target.view ?? "understand"
    });
    if (target.path) query.set("file", target.path);
    return `/matters/${encodeURIComponent(target.matter_id)}?${query}`;
}
function publish(next) {
    identity = next;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setContinuityTransport"])(next.roster.vault_key, next.actor.person_id, next.actor.mode === "demo");
    window.dispatchEvent(new Event(eventName));
}
async function loadContinuityIdentity(refresh = false) {
    if (identity && !refresh) return identity;
    if (loading) return loading;
    loading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/team", {
        headers: {
            "X-Themis-Person-Id": ""
        }
    }).then((roster)=>{
        const stored = window.sessionStorage.getItem(`themis.continuity.v1:${encodeURIComponent(roster.vault_key)}:person`);
        const person = roster.enabled ? roster.people?.find((p)=>p.person_id === stored) : null;
        const actor = person ? {
            person_id: person.person_id,
            display_name: person.display_name,
            mode: "demo"
        } : roster.actor;
        const next = {
            roster,
            actor
        };
        publish(next);
        return next;
    }).finally(()=>{
        loading = null;
    });
    return loading;
}
async function switchContinuityPerson(personId) {
    const current = await loadContinuityIdentity();
    const person = current.roster.people?.find((p)=>p.person_id === personId);
    if (!person || !current.roster.enabled) throw new Error("This person is unavailable.");
    window.sessionStorage.setItem(`themis.continuity.v1:${encodeURIComponent(current.roster.vault_key)}:person`, personId);
    publish({
        roster: current.roster,
        actor: {
            person_id: personId,
            display_name: person.display_name,
            mode: "demo"
        }
    });
}
function useContinuityIdentity() {
    _s();
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(identity);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useContinuityIdentity.useEffect": ()=>{
            const update = {
                "useContinuityIdentity.useEffect.update": ()=>setValue(identity)
            }["useContinuityIdentity.useEffect.update"];
            window.addEventListener(eventName, update);
            void loadContinuityIdentity().then(setValue).catch({
                "useContinuityIdentity.useEffect": (e)=>setError(e.message)
            }["useContinuityIdentity.useEffect"]);
            return ({
                "useContinuityIdentity.useEffect": ()=>window.removeEventListener(eventName, update)
            })["useContinuityIdentity.useEffect"];
        }
    }["useContinuityIdentity.useEffect"], []);
    return {
        identity: value,
        error,
        switchPerson: switchContinuityPerson
    };
}
_s(useContinuityIdentity, "Ju48N3WNMIJMlTVAghRt/5H1Gq4=");
function continuityCommand(matterId, path, method = "GET", body, actor) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/matters/${encodeURIComponent(matterId)}/workspace${path}`, {
        method,
        ...body === undefined ? {} : {
            body: JSON.stringify(body)
        },
        ...actor ? {
            headers: {
                "X-Themis-Person-Id": actor.mode === "demo" ? actor.person_id : ""
            }
        } : {}
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/design.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared design vocabulary — see docs/DESIGN_LANGUAGE.md.
 *
 * Colour carries meaning, never decoration, and always travels with a word.
 * Nothing in the UI should hard-code these hexes; import the role instead.
 */ __turbopack_context__.s([
    "RISK_DEFINITION",
    ()=>RISK_DEFINITION,
    "STAGES",
    ()=>STAGES,
    "cadence",
    ()=>cadence,
    "consistencyIssueIsSafelyRepairable",
    ()=>consistencyIssueIsSafelyRepairable,
    "consistencyIssueLabel",
    ()=>consistencyIssueLabel,
    "daysLate",
    ()=>daysLate,
    "decisionNeedsReview",
    ()=>decisionNeedsReview,
    "decisionSignal",
    ()=>decisionSignal,
    "dueWord",
    ()=>dueWord,
    "formatDateTime",
    ()=>formatDateTime,
    "formatDay",
    ()=>formatDay,
    "formatLongDate",
    ()=>formatLongDate,
    "formatLongDay",
    ()=>formatLongDay,
    "formatShortDate",
    ()=>formatShortDate,
    "formatTime",
    ()=>formatTime,
    "initials",
    ()=>initials,
    "isOverdue",
    ()=>isOverdue,
    "isWaitingSignal",
    ()=>isWaitingSignal,
    "matterAwaitsJudgment",
    ()=>matterAwaitsJudgment,
    "matterIsAgentWorking",
    ()=>matterIsAgentWorking,
    "matterNeedsAttention",
    ()=>matterNeedsAttention,
    "matterNextAction",
    ()=>matterNextAction,
    "matterNextOwner",
    ()=>matterNextOwner,
    "parseDisplayDate",
    ()=>parseDisplayDate,
    "reviewAuthorPalette",
    ()=>reviewAuthorPalette,
    "riskLabel",
    ()=>riskLabel,
    "riskRole",
    ()=>riskRole,
    "role",
    ()=>role,
    "scheduleIsFailing",
    ()=>scheduleIsFailing,
    "scheduleIsPaused",
    ()=>scheduleIsPaused,
    "shortName",
    ()=>shortName,
    "signalCellTint",
    ()=>signalCellTint,
    "signalFor",
    ()=>signalFor,
    "stageLabel",
    ()=>stageLabel,
    "statusRole",
    ()=>statusRole
]);
const role = {
    attention: "#F97316",
    attentionTint: "#FFF1DC",
    attentionWash: "#FFFAF3",
    attentionDeep: "#C94800",
    healthy: "#146B54",
    healthyTint: "#E0EFE9",
    healthyWash: "#F8FCFA",
    failure: "#B33A20",
    failureTint: "#F8E3DC",
    failureWash: "#FFFAF8",
    agent: "#4922FF",
    agentTint: "#EEE9FF",
    agentWash: "#FAF8FF",
    ink: "#071421",
    quiet: "#596477",
    quietTint: "#f5f5f7",
    quietWash: "#FBFAF7",
    hairline: "#e6e2d9"
};
const statusRole = {
    attention: {
        label: "Needs attention",
        color: role.attentionDeep,
        tint: role.attentionTint,
        wash: role.attentionWash
    },
    healthy: {
        label: "Healthy",
        color: role.healthy,
        tint: role.healthyTint,
        wash: role.healthyWash
    },
    failure: {
        label: "Failed",
        color: role.failure,
        tint: role.failureTint,
        wash: role.failureWash
    },
    agent: {
        label: "Agent work",
        color: role.agent,
        tint: role.agentTint,
        wash: role.agentWash
    }
};
const CONSISTENCY_LABELS = {
    final_with_pre_respond_stage: "Current final is before Respond",
    approval_without_current_final: "Approval is not tied to the current final",
    delivery_without_approved_artifact: "Delivery has no approved artifact",
    closed_without_required_lifecycle_fields: "Closed lifecycle record is incomplete"
};
function consistencyIssueLabel(issue) {
    return CONSISTENCY_LABELS[issue.code];
}
function consistencyIssueIsSafelyRepairable(issue) {
    return issue.code === "final_with_pre_respond_stage";
}
const reviewAuthorPalette = [
    "#2F5597",
    "#7030A0",
    "#008272",
    "#A64B00",
    "#C0006F",
    "#5B6573",
    "#7A3E00",
    "#006B8F"
];
const STAGES = [
    {
        id: "intake",
        label: "Just came in",
        sub: "Not yet triaged"
    },
    {
        id: "research",
        label: "Being researched",
        sub: "An agent is gathering the facts"
    },
    {
        id: "explore",
        label: "Waiting on your judgment",
        sub: "Research is done; a path must be chosen"
    },
    {
        id: "generate",
        label: "Being drafted",
        sub: "Work product is being written"
    },
    {
        id: "respond",
        label: "Respond",
        sub: "Review, approve, and deliver"
    },
    {
        id: "closed",
        label: "Closed",
        sub: "Delivered or otherwise resolved"
    }
];
function stageLabel(stage) {
    return STAGES.find((entry)=>entry.id === stage)?.label ?? stage;
}
function matterAwaitsJudgment(matter) {
    return matter.status === "explore";
}
function matterIsAgentWorking(matter) {
    return matter.work_state.execution_state === "queued" || matter.work_state.execution_state === "running";
}
function matterNeedsAttention(matter) {
    const kind = matter.work_state.signal.kind;
    return kind === "overdue" || kind === "needs_assignment" || isWaitingSignal(kind);
}
function isWaitingSignal(kind) {
    return [
        "waiting_on_owner",
        "waiting_on_you",
        "blocked",
        "execution_unknown"
    ].includes(kind);
}
function signalCellTint(kind) {
    if (kind === "overdue") return role.failureWash;
    if (isWaitingSignal(kind) || kind === "needs_assignment") return role.attentionWash;
    if (kind === "agent_working" || kind === "ready_for_themis") return role.agentWash;
    return "transparent";
}
function matterNextAction(matter) {
    if (matter.status === "closed") return "Closed";
    return matter.work_state?.next_action || matter.next_action;
}
function matterNextOwner(matter) {
    if (matter.work_state.next_owner) return matter.work_state.next_owner;
    if (matter.work_state.next_actor === "unassigned") return "Unassigned";
    if (matter.work_state.next_actor === "you") return "You";
    return "—";
}
function isOverdue(matter) {
    return matter.work_state.signal.kind === "overdue";
}
function daysLate(matter) {
    if (!matter.work_state.due_at) return 0;
    const target = parseDisplayDate(matter.work_state.due_at);
    if (Number.isNaN(target.getTime())) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((today.getTime() - target.getTime()) / 86_400_000));
}
function signalFor(matter) {
    const { kind, label } = matter.work_state.signal;
    if (matter.status === "closed") {
        return {
            kind,
            rail: "transparent",
            bg: "#fbfaf7",
            word: "Closed",
            wordColor: role.quiet
        };
    }
    if (kind === "overdue") return {
        kind,
        rail: role.failure,
        bg: role.failureWash,
        word: label,
        wordColor: role.failure
    };
    if (isWaitingSignal(kind) || kind === "needs_assignment") {
        return {
            kind,
            rail: role.attention,
            bg: role.attentionWash,
            word: label,
            wordColor: role.attentionDeep
        };
    }
    if (kind === "agent_working" || kind === "ready_for_themis") {
        return {
            kind,
            rail: role.agent,
            bg: role.agentWash,
            word: label,
            wordColor: role.agent
        };
    }
    return {
        kind,
        rail: role.hairline,
        bg: "#ffffff",
        word: "No action needed",
        wordColor: role.quiet
    };
}
function dueWord(matter) {
    if (isOverdue(matter)) {
        const late = daysLate(matter);
        return {
            text: late === 1 ? "1 day late" : `${late} days late`,
            color: role.failure
        };
    }
    if (!matter.work_state.due_at) return {
        text: "No date",
        color: role.quiet
    };
    return {
        text: formatDay(matter.work_state.due_at),
        color: role.quiet
    };
}
function formatShortDate(value) {
    if (!value) return "—";
    const date = parseDisplayDate(String(value));
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}
function formatLongDate(value) {
    if (!value) return "—";
    const date = parseDisplayDate(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}
function formatDateTime(value) {
    if (!value) return "—";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}
function formatTime(value) {
    if (!value) return "—";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
}
const formatDay = formatShortDate;
const formatLongDay = formatLongDate;
const RISK_DEFINITION = "Risk is the recorded level of legal or business impact.";
function riskLabel(value) {
    const clean = value?.trim() ?? "";
    return !clean || clean.toLowerCase() === "unknown" ? "Not assessed" : clean;
}
function riskRole(value) {
    const label = riskLabel(value);
    if (label === "Not assessed") return null;
    return {
        label,
        color: role.quiet,
        wash: role.quietWash
    };
}
function parseDisplayDate(value) {
    const raw = String(value);
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(raw);
}
function decisionSignal(decision) {
    if (!decisionNeedsReview(decision)) {
        return {
            stale: false,
            label: decision.next_review_at ? formatDay(decision.next_review_at) : "—",
            detail: "Current"
        };
    }
    const detail = decision.staleness_reason || "Needs review";
    return {
        stale: true,
        label: shorten(detail),
        detail
    };
}
function decisionNeedsReview(decision) {
    return decision.review_status !== "fresh" && decision.review_status !== "current";
}
/** The register column is narrow; the full reason stays in the tooltip. */ function shorten(reason) {
    const clean = reason.replace(/\.$/, "");
    if (clean.length <= 18) return clean;
    const words = [];
    for (const word of clean.split(/\s+/)){
        if ([
            ...words,
            word
        ].join(" ").length > 18) break;
        words.push(word);
    }
    return `${words.join(" ") || clean.slice(0, 18)}…`;
}
function scheduleIsFailing(schedule) {
    return schedule.last_status === "error" || schedule.last_status === "failed";
}
function scheduleIsPaused(schedule) {
    return schedule.enabled === false || schedule.enabled === 0;
}
function initials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "—";
    return (parts[0][0] + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}
function shortName(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return name || "Unassigned";
    return `${parts[0][0]}. ${parts.at(-1)}`;
}
function cadence(seconds) {
    if (seconds < 90) return "every minute";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `every ${minutes} minutes`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return hours === 1 ? "hourly" : `every ${hours} hours`;
    const days = Math.round(hours / 24);
    if (days === 1) return "daily";
    if (days === 7) return "weekly";
    if (days < 7) return `every ${days} days`;
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "weekly" : `every ${weeks} weeks`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/documentNavigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "discardLocalEditorSnapshot",
    ()=>discardLocalEditorSnapshot,
    "documentVersionKey",
    ()=>documentVersionKey,
    "exactPassageRange",
    ()=>exactPassageRange,
    "freezeDocumentTarget",
    ()=>freezeDocumentTarget,
    "isSafeDocumentPath",
    ()=>isSafeDocumentPath,
    "localEditorSnapshotStorageKey",
    ()=>localEditorSnapshotStorageKey,
    "mutationBasisForSnapshot",
    ()=>mutationBasisForSnapshot,
    "normalizeLocalEditorSnapshot",
    ()=>normalizeLocalEditorSnapshot,
    "readLocalEditorSnapshot",
    ()=>readLocalEditorSnapshot,
    "recoverableLocalEditorSnapshot",
    ()=>recoverableLocalEditorSnapshot,
    "referenceOpenMode",
    ()=>referenceOpenMode,
    "resolveDocumentReference",
    ()=>resolveDocumentReference,
    "returnReferenceOrigin",
    ()=>returnReferenceOrigin,
    "sameDocumentTarget",
    ()=>sameDocumentTarget,
    "snapshotForDocument",
    ()=>snapshotForDocument,
    "writeLocalEditorSnapshot",
    ()=>writeLocalEditorSnapshot
]);
const SNAPSHOT_PREFIX = "themis:document-edit:";
function documentVersionKey(document) {
    return JSON.stringify([
        document.document_id,
        document.path,
        document.revision
    ]);
}
function localEditorSnapshotStorageKey(matterId, documentId) {
    return `${SNAPSHOT_PREFIX}${encodeURIComponent(matterId)}:${encodeURIComponent(documentId)}`;
}
function selectedRange(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const range = value;
    if (typeof range.start !== "number" || typeof range.end !== "number" || typeof range.text !== "string") return null;
    return {
        start: range.start,
        end: range.end,
        text: range.text
    };
}
function normalizeLocalEditorSnapshot(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const saved = value;
    if (typeof saved.document_id !== "string" || !saved.document_id.trim()) return null;
    if (typeof saved.path !== "string" || !saved.path.trim() || typeof saved.content !== "string") return null;
    return {
        document_id: saved.document_id,
        path: saved.path,
        content: saved.content,
        base_revision: typeof saved.base_revision === "string" ? saved.base_revision : "",
        review_revision: typeof saved.review_revision === "string" ? saved.review_revision : null,
        dirty: saved.dirty === true,
        selected_range: selectedRange(saved.selected_range),
        recoverable: saved.recoverable === true,
        updated_at: typeof saved.updated_at === "string" ? saved.updated_at : null
    };
}
function readLocalEditorSnapshot(storage, matterId, documentId) {
    try {
        const raw = storage.getItem(localEditorSnapshotStorageKey(matterId, documentId));
        return raw ? normalizeLocalEditorSnapshot(JSON.parse(raw)) : null;
    } catch  {
        return null;
    }
}
function writeLocalEditorSnapshot(storage, matterId, snapshot) {
    const normalized = normalizeLocalEditorSnapshot(snapshot);
    if (!normalized?.document_id) return;
    storage.setItem(localEditorSnapshotStorageKey(matterId, normalized.document_id), JSON.stringify(normalized));
}
function discardLocalEditorSnapshot(storage, matterId, documentId) {
    storage.removeItem(localEditorSnapshotStorageKey(matterId, documentId));
}
function recoverableLocalEditorSnapshot(snapshot, now = new Date().toISOString()) {
    return {
        ...snapshot,
        dirty: true,
        recoverable: true,
        updated_at: now
    };
}
function mutationBasisForSnapshot(snapshot) {
    return {
        expected_revision: snapshot.base_revision,
        expected_review_revision: snapshot.review_revision ?? undefined
    };
}
function snapshotForDocument(document, snapshot) {
    if (!document || !snapshot?.dirty) return null;
    return snapshot.document_id === document.document_id && snapshot.path === document.path ? snapshot : null;
}
function freezeDocumentTarget(document) {
    return {
        document_id: document.document_id,
        path: document.path,
        revision: document.revision
    };
}
function sameDocumentTarget(left, right) {
    return Boolean(left && right && left.document_id === right.document_id && left.path === right.path && left.revision === right.revision);
}
function isSafeDocumentPath(path) {
    return Boolean(path) && !path.startsWith("/") && !path.startsWith("\\") && !path.includes("\\") && path.split("/").every((part)=>Boolean(part) && part !== "." && part !== "..");
}
function resolveDocumentReference(documents, target) {
    if (!isSafeDocumentPath(target.path)) {
        return {
            target,
            document: null,
            passage_state: "missing",
            message: "Unsafe reference path blocked."
        };
    }
    const document = documents.find((candidate)=>candidate.document_id === target.document_id && candidate.path === target.path && (!target.revision || candidate.revision === target.revision));
    if (!document) {
        return {
            target,
            document: null,
            passage_state: "missing",
            message: "Referenced document or version is unavailable."
        };
    }
    return {
        target,
        document,
        passage_state: target.exact_passage_available ? "exact" : "document_only",
        message: target.exact_passage_available ? undefined : "Exact passage unavailable"
    };
}
function referenceOpenMode(document, drafting) {
    return drafting && document.kind === "source" ? "preview" : "tab";
}
function exactPassageRange(content, target) {
    if (!target.exact_passage_available) return null;
    const candidate = target.available_excerpt?.trim() || target.locator?.trim();
    if (!candidate) return null;
    const start = content.indexOf(candidate);
    if (start < 0 || content.indexOf(candidate, start + candidate.length) >= 0) return null;
    return {
        start,
        end: start + candidate.length
    };
}
function returnReferenceOrigin(origin) {
    return origin ?? {
        surface: "document",
        focus_id: null,
        scroll_offset: null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/documentSave.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeSavedMarkdown",
    ()=>normalizeSavedMarkdown,
    "savedMarkdownMatches",
    ()=>savedMarkdownMatches
]);
function normalizeSavedMarkdown(content) {
    return content.replace(/\r?\n$/, "");
}
function savedMarkdownMatches(submitted, canonical) {
    return normalizeSavedMarkdown(submitted) === normalizeSavedMarkdown(canonical);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/dossierRequests.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dossierCompletionStage",
    ()=>dossierCompletionStage,
    "dossierControls",
    ()=>dossierControls,
    "dossierStateWord",
    ()=>dossierStateWord,
    "followUpText",
    ()=>followUpText,
    "issueProgressLabel",
    ()=>issueProgressLabel,
    "mergeBackgroundDraft",
    ()=>mergeBackgroundDraft,
    "normalizeDossierStatus",
    ()=>normalizeDossierStatus,
    "pollingScopeMatches",
    ()=>pollingScopeMatches,
    "publicationToken",
    ()=>publicationToken,
    "setIssueAt",
    ()=>setIssueAt,
    "shouldPollDossier",
    ()=>shouldPollDossier,
    "startPayload",
    ()=>startPayload,
    "uniqueIssueOrder",
    ()=>uniqueIssueOrder
]);
const ACTIVE = new Set([
    "running"
]);
const RESUMABLE = new Set([
    "interrupted",
    "stopped"
]);
function record(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function strings(value) {
    return Array.isArray(value) ? value.filter((item)=>typeof item === "string" && !!item) : [];
}
function number(value) {
    return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}
function normalizeDossierStatus(value, fallback) {
    const raw = record(value);
    const issues = Array.isArray(raw.issues) ? raw.issues.map((item, index)=>{
        const issue = record(item);
        return {
            issue_id: String(issue.issue_id || `issue-${index + 1}`),
            title: String(issue.title || issue.issue_id || `Issue ${index + 1}`),
            state: String(issue.state || "not_selected"),
            planned_order: typeof issue.planned_order === "number" ? issue.planned_order : null,
            selected_first: issue.selected_first === true,
            sources_read: number(issue.sources_read),
            sources_retrieved: number(issue.sources_retrieved),
            support: typeof issue.support === "string" ? issue.support : null,
            packet_path: typeof issue.packet_path === "string" ? issue.packet_path : null,
            answer_path: typeof issue.answer_path === "string" ? issue.answer_path : null,
            last_error: typeof issue.last_error === "string" ? issue.last_error : null,
            run_id: typeof issue.run_id === "string" ? issue.run_id : null
        };
    }) : [];
    const priorities = Array.isArray(raw.priorities) ? raw.priorities.slice(0, 3).map((item, index)=>{
        const priority = record(item);
        return {
            key: String(priority.key || `p${index + 1}`),
            text: String(priority.text || `Priority ${index + 1}`),
            why: String(priority.why || ""),
            issue_ids: strings(priority.issue_ids),
            changed: priority.changed === true
        };
    }) : [];
    const publications = Array.isArray(raw.publications) ? raw.publications.filter((item)=>item && typeof item === "object") : [];
    const countsRaw = record(raw.counts);
    const counts = {};
    for (const [key, value] of Object.entries(countsRaw))counts[key] = number(value);
    return {
        request_id: typeof raw.request_id === "string" ? raw.request_id : fallback.requestId,
        matter_id: typeof raw.matter_id === "string" ? raw.matter_id : fallback.matterId,
        state: typeof raw.state === "string" ? raw.state : fallback.state || "awaiting_choices",
        phase: typeof raw.phase === "string" ? raw.phase : fallback.phase || "setup",
        sequence: number(raw.sequence),
        plan_revision: typeof raw.plan_revision === "string" ? raw.plan_revision : "legacy",
        execution_mode: raw.execution_mode === "research" || raw.execution_mode === "saved_only" ? raw.execution_mode : null,
        scope: raw.scope === "top_three" || raw.scope === "all" ? raw.scope : null,
        stop_requested: raw.stop_requested === true,
        origin: record(raw.origin),
        priorities,
        first_issue_ids: strings(raw.first_issue_ids),
        planned_issue_ids: strings(raw.planned_issue_ids),
        new_issue_candidates: Array.isArray(raw.new_issue_candidates) ? raw.new_issue_candidates.map(record) : [],
        counts,
        issues,
        publications,
        latest_publication: record(raw.latest_publication),
        first_pass_ready_at: typeof raw.first_pass_ready_at === "string" ? raw.first_pass_ready_at : null,
        finished_at: typeof raw.finished_at === "string" ? raw.finished_at : null,
        last_error: typeof raw.last_error === "string" ? raw.last_error : null,
        source_scope: record(raw.source_scope),
        model_selections: record(raw.model_selections),
        preparation: typeof raw.preparation === "string" ? raw.preparation : ""
    };
}
function uniqueIssueOrder(values, available, limit = 3) {
    const valid = new Set(available);
    return values.filter((value, index)=>valid.has(value) && values.indexOf(value) === index).slice(0, limit);
}
function setIssueAt(values, position, issueId, available) {
    const next = [
        ...values
    ];
    const prior = next.indexOf(issueId);
    if (prior >= 0 && prior !== position) next[prior] = next[position] || "";
    next[position] = issueId;
    return uniqueIssueOrder(next, available);
}
function startPayload(status, mode, priorities, firstIssueIds, scope, sourceChoice, actionKey) {
    const candidateKeys = status.new_issue_candidates.map((item)=>String(item.candidate_key || "")).filter(Boolean);
    const available = [
        ...status.issues.map((issue)=>issue.issue_id),
        ...candidateKeys
    ];
    const selected = uniqueIssueOrder(firstIssueIds, available);
    const priorityRows = priorities.slice(0, 3).map((item, index)=>({
            ...item,
            issue_ids: strings(item.issue_ids).filter((id)=>available.includes(id)),
            changed: item.changed === true || item.text !== status.priorities[index]?.text || item.why !== status.priorities[index]?.why
        }));
    const accepted = new Set([
        ...selected,
        ...priorityRows.flatMap((item)=>item.issue_ids)
    ].filter((id)=>candidateKeys.includes(id)));
    return {
        execution_mode: mode,
        expected_sequence: status.sequence,
        plan_revision: status.plan_revision,
        priorities: priorityRows,
        first_issue_ids: selected,
        scope: mode === "research" ? scope : null,
        source_choice: {
            ...sourceChoice,
            provider_ids: strings(sourceChoice.provider_ids),
            collection_enabled: Boolean(sourceChoice.external || sourceChoice.other_matters)
        },
        accepted_candidate_keys: [
            ...accepted
        ],
        source_action_key: actionKey
    };
}
function shouldPollDossier(status) {
    return ACTIVE.has(status.state);
}
function dossierControls(status) {
    return {
        stop: ACTIVE.has(status.state),
        resume: RESUMABLE.has(status.state),
        retry: status.state === "failed" || status.issues.some((issue)=>issue.state === "failed")
    };
}
function publicationToken(status) {
    return JSON.stringify(status.publications.map((item)=>[
            item.key,
            item.state,
            item.revision_path,
            record(item.receipts).conversation
        ]));
}
function pollingScopeMatches(expectedMatter, expectedConversation, actualMatter, actualConversation) {
    return expectedMatter === actualMatter && (expectedConversation || null) === (actualConversation || null);
}
function mergeBackgroundDraft(current, followUp) {
    return current.trim() ? `${current}\n\n${followUp}` : followUp;
}
function issueProgressLabel(status) {
    const total = status.planned_issue_ids.length || status.counts.total || status.issues.length;
    const active = status.issues.filter((issue)=>issue.state !== "not_selected").length;
    return `Researching ${Math.min(active, total)} of ${total} issues`;
}
function dossierCompletionStage(status) {
    if (status.state === "awaiting_choices" || status.phase === "setup") return "setup";
    if (status.state === "completed") return status.issues.some((issue)=>[
            "partial",
            "failed",
            "interrupted"
        ].includes(issue.state)) ? "partial" : "complete";
    if (status.first_pass_ready_at || status.publications.length > 0) return "first_pass";
    return status.state === "partial" || status.state === "failed" ? "partial" : "working";
}
function dossierStateWord(state) {
    return ({
        awaiting_choices: "Needs your choices",
        planning: "Planning",
        not_selected: "Unselected",
        queued: "Queued",
        running: "Running",
        saved: "Complete",
        completed: "Complete",
        stopped: "Stopped",
        partial: "Partial",
        failed: "Failed",
        interrupted: "Interrupted",
        newly_identified: "New"
    })[state] || "Unknown";
}
function followUpText(status) {
    const names = status.new_issue_candidates.map((item)=>String(item.title || item.candidate_key || "New issue"));
    const priorities = status.priorities.map((item)=>item.text).filter(Boolean);
    return `Review these newly found dossier issues through the normal research flow: ${names.join("; ")}. Keep these prior priorities in view: ${priorities.join("; ")}.`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/editorSelection.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isModifiedDocumentEnd",
    ()=>isModifiedDocumentEnd,
    "moveSelectionToDocumentEnd",
    ()=>moveSelectionToDocumentEnd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lexical/dist/Lexical.dev.mjs [app-client] (ecmascript)");
;
function isModifiedDocumentEnd(event) {
    return event.key === "End" && !event.altKey && (event.ctrlKey || event.metaKey);
}
function moveSelectionToDocumentEnd() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["$getRoot"])().selectEnd();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/impactPresentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "differencePresentation",
    ()=>differencePresentation,
    "findingEffectLabel",
    ()=>findingEffectLabel,
    "findingPassageEvidence",
    ()=>findingPassageEvidence,
    "findingSupportLabel",
    ()=>findingSupportLabel,
    "frozenImpactCommand",
    ()=>frozenImpactCommand,
    "impactAnalysisScope",
    ()=>impactAnalysisScope,
    "impactContextChanged",
    ()=>impactContextChanged,
    "impactOffer",
    ()=>impactOffer,
    "impactRetryDraftKey",
    ()=>impactRetryDraftKey,
    "impactState",
    ()=>impactState,
    "passageEvidence",
    ()=>passageEvidence,
    "passagesForFinding",
    ()=>passagesForFinding,
    "selectedReferenceIds",
    ()=>selectedReferenceIds,
    "selectedReferences",
    ()=>selectedReferences,
    "targetForFinding",
    ()=>targetForFinding
]);
const EFFECT_LABELS = {
    remains_supported: "Remains supported",
    changes: "Changes earlier work",
    may_need_review: "May need review",
    unknown: "Effect unknown"
};
const SUPPORT_LABELS = {
    linked: "Supported link",
    inferred: "Possible effect",
    unavailable: "Support unavailable"
};
function impactState(comparison) {
    if (comparison.state === "stale") return {
        word: "Stale",
        tone: "attention",
        detail: "The source, selected work, question, facts, or assumptions changed after this comparison was prepared."
    };
    if (comparison.state === "unavailable" || comparison.difference === "unavailable") return {
        word: "Comparison unavailable",
        tone: "quiet",
        detail: unavailableComparisonDetail(comparison)
    };
    if (comparison.state === "partial") return {
        word: "Partial",
        tone: "attention",
        detail: "Useful comparison work is available, but some source text, structure, or support is incomplete."
    };
    if (comparison.state === "complete") return {
        word: "Complete",
        tone: "healthy",
        detail: "The saved analysis uses the frozen source versions and selected saved work shown here."
    };
    return {
        word: "Prepared",
        tone: "agent",
        detail: "Exact source versions are frozen. Analysis has not changed earlier advice, decisions, or drafts."
    };
}
function differencePresentation(difference) {
    if (difference === "unchanged") return {
        word: "Text unchanged",
        tone: "quiet",
        detail: "No textual difference was found in the available supplied text. This does not decide legal effect."
    };
    if (difference === "formatting_only") return {
        word: "Formatting only",
        tone: "quiet",
        detail: "Only whitespace differs in the available text. This does not establish legal equivalence."
    };
    if (difference === "text_changed") return {
        word: "Text changed",
        tone: "attention",
        detail: "Read the exact changed passages before you assess their effect on earlier work."
    };
    return {
        word: "Difference unavailable",
        tone: "quiet",
        detail: "One or both required source texts are unavailable. Unavailable text is not treated as a deletion."
    };
}
function unavailableComparisonDetail(comparison) {
    const issues = [];
    if (!comparison.before) issues.push("The earlier source was not supplied");
    else if (comparison.before.extraction_state === "partial") issues.push("The earlier source extraction is partial");
    else if (comparison.before.extraction_state === "failed" || comparison.before.extraction_state === "unavailable" || !comparison.before.text) issues.push("The earlier source text is unavailable");
    if (comparison.after.extraction_state === "partial") issues.push("The current source extraction is partial");
    else if (comparison.after.extraction_state === "failed" || comparison.after.extraction_state === "unavailable" || !comparison.after.text) issues.push("The current source text is unavailable");
    if (!issues.length) return "One or both required source texts are unavailable for an exact comparison. Unavailable text is not treated as a deletion.";
    return `${issues.join(". ")}. An exact before-and-after comparison is unavailable. Unavailable text is not treated as a deletion.`;
}
function findingEffectLabel(effect) {
    return EFFECT_LABELS[effect];
}
function findingSupportLabel(support) {
    return SUPPORT_LABELS[support];
}
function impactAnalysisScope(targets) {
    if (targets?.length) return {
        word: "Selected work",
        tone: "agent",
        detail: `Analysis covers the supplied source change and ${targets.length} selected item${targets.length === 1 ? "" : "s"} of saved work.`
    };
    return {
        word: "Source-only scope",
        tone: "quiet",
        detail: "Analysis covers the supplied source change. No earlier advice, recommendation, decision, or draft was selected."
    };
}
function impactContextChanged(previousContextKey, nextContextKey) {
    return previousContextKey !== nextContextKey;
}
function targetForFinding(comparison, finding) {
    return (comparison.targets ?? []).find((target)=>target.reference_id === finding.target_id) ?? null;
}
function passagesForFinding(comparison, finding) {
    const ids = new Set(finding.passage_ids ?? []);
    return (comparison.passages ?? []).filter((passage)=>ids.has(passage.passage_id));
}
function passageEvidence(comparison, passage, side) {
    const source = side === "before" ? comparison.before : comparison.after;
    const excerpt = side === "before" ? passage.before_text : passage.after_text;
    const locator = side === "before" ? passage.before_locator : passage.after_locator;
    return {
        claim_id: passage.passage_id,
        source_id: source?.source_id || source?.reference_id || "source-unavailable",
        available_excerpt: excerpt || null,
        locator: locator || "Location unavailable",
        support_state: source ? "supplied" : "unknown",
        explanation: source ? `Exact ${side} passage from the frozen supplied source.` : "The earlier source was not available.",
        source_version: source?.revision ?? null,
        source_hash: source?.content_hash ?? null,
        source_label: source?.title,
        path: source?.path ?? null
    };
}
function findingPassageEvidence(comparison, passage) {
    return passageEvidence(comparison, passage, passage.kind === "deleted" ? "before" : "after");
}
function selectedReferenceIds(raw) {
    try {
        const value = JSON.parse(raw || "[]");
        return Array.isArray(value) ? [
            ...new Set(value.filter((item)=>typeof item === "string" && item.trim().length > 0))
        ] : [];
    } catch  {
        return [];
    }
}
function selectedReferences(candidates, raw) {
    const ids = new Set(selectedReferenceIds(raw));
    return candidates.filter((candidate)=>ids.has(candidate.reference_id));
}
function impactOffer(comparison, offers, offerId) {
    if (!(comparison.offer_ids ?? []).includes(offerId)) return null;
    return offers?.find((offer)=>offer.offer_id === offerId) ?? null;
}
const impactRetryDraftKey = (slot)=>`__continuity.retry.v1:impact:${slot}`;
function frozenImpactCommand(stored, intent, create) {
    const intentSignature = JSON.stringify(intent);
    try {
        const envelope = JSON.parse(stored);
        if (envelope.version === 1 && envelope.intent_signature === intentSignature && envelope.command && typeof envelope.command.source_action_key === "string") {
            return {
                command: envelope.command,
                draft: stored,
                reused: true
            };
        }
    } catch  {
    // Invalid parent draft data is replaced by a new frozen command.
    }
    const command = create();
    return {
        command,
        draft: JSON.stringify({
            version: 1,
            intent_signature: intentSignature,
            command
        }),
        reused: false
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/latestRequest.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLatestRequestLoader",
    ()=>createLatestRequestLoader
]);
function createLatestRequestLoader(read, apply, fail) {
    let generation = 0;
    return async function loadLatest() {
        const requestGeneration = ++generation;
        try {
            const value = await read();
            if (requestGeneration === generation) apply(value);
            return value;
        } catch (error) {
            if (requestGeneration !== generation) return undefined;
            fail(error);
            throw error;
        }
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/markdownDisclosures.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markdownDisclosures",
    ()=>markdownDisclosures
]);
function markdownDisclosures(text) {
    const lines = text.split('\n');
    const sections = [];
    let start = 0;
    let opening = -1;
    let depth = 0;
    let summary = '';
    let fence = null;
    for(let index = 0; index < lines.length; index++){
        const line = lines[index];
        const boundary = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (boundary) {
            if (!fence) fence = {
                marker: boundary[1][0],
                length: boundary[1].length
            };
            else if (boundary[1][0] === fence.marker && boundary[1].length >= fence.length && !boundary[2].trim()) fence = null;
            continue;
        }
        if (fence) continue;
        if (line === '<details>') {
            if (depth) {
                depth++;
                continue;
            }
            const label = lines[index + 1]?.match(/^<summary>([^\n]*)<\/summary>$/);
            if (!label) continue;
            opening = index;
            summary = label[1].replace(/&(amp|lt|gt|quot|#x27);/g, (_, entity)=>({
                    amp: '&',
                    lt: '<',
                    gt: '>',
                    quot: '"',
                    '#x27': "'"
                })[entity] || '');
            depth = 1;
            index++;
        } else if (line === '</details>' && depth) {
            depth--;
            if (depth) continue;
            if (opening > start) sections.push({
                text: lines.slice(start, opening).join('\n')
            });
            sections.push({
                summary,
                text: lines.slice(opening + 2, index).join('\n')
            });
            start = index + 1;
            opening = -1;
        }
    }
    if (start < lines.length) sections.push({
        text: lines.slice(start).join('\n')
    });
    return sections;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/matter-workspace.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "collectEvidence",
    ()=>collectEvidence,
    "conversationIdFromPath",
    ()=>conversationIdFromPath,
    "findConversationPath",
    ()=>findConversationPath,
    "findFileByName",
    ()=>findFileByName,
    "findLatestResearch",
    ()=>findLatestResearch,
    "isMatchingRecommendationSupplement",
    ()=>isMatchingRecommendationSupplement,
    "parseProposedPath",
    ()=>parseProposedPath,
    "participantRoleLabel",
    ()=>participantRoleLabel,
    "recommendationIdentity",
    ()=>recommendationIdentity,
    "recommendationSummary",
    ()=>recommendationSummary,
    "safeMatterPath",
    ()=>safeMatterPath,
    "shouldApplyCanonicalRecommendation",
    ()=>shouldApplyCanonicalRecommendation,
    "stripEmphasis",
    ()=>stripEmphasis
]);
function recommendationIdentity(matterId, recommendation) {
    return `${matterId}:${recommendation?.current_version_id ?? "absent"}`;
}
function isMatchingRecommendationSupplement(matterId, currentVersionId, saved) {
    return saved.matter_id === matterId && saved.current_version_id === currentVersionId;
}
function shouldApplyCanonicalRecommendation(current, incoming, matterId) {
    if (current && matterId && current.matter_id !== matterId) return true;
    if (!current) return true;
    if (!incoming) return false;
    if (incoming.current_version_id === current.current_version_id) return true;
    const currentNumber = current.current_version_number;
    const incomingNumber = incoming.current_version_number;
    if (currentNumber != null && incomingNumber != null) return incomingNumber >= currentNumber;
    return true;
}
function parseProposedPath(markdown) {
    const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
    const paragraphs = body.split(/\n\s*\n/).map((paragraph)=>paragraph.trim()).filter(Boolean);
    const firstSubstantive = paragraphs.find((paragraph)=>!paragraph.startsWith("#"));
    const firstForMatching = stripEmphasis(firstSubstantive ?? "");
    if (/^No (?:launch )?recommendation\b/i.test(firstForMatching)) return "";
    for (const rawLine of body.split("\n")){
        const matchLine = stripEmphasis(rawLine.trim());
        const match = matchLine.match(/^(?:Working path|Recommended path):\s*(.+)$/i);
        if (!match) continue;
        return match[1].split(/(?<=[.!?])\s+/).filter((sentence)=>!/^(?:Counsel must confirm|Confirm|Pending|Open question)\b/i.test(sentence.trim())).join(" ").trim();
    }
    return "";
}
function recommendationSummary(markdown) {
    const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
    const paragraph = body.split(/\n\s*\n/).map((value)=>value.trim()).find((value)=>value && !value.startsWith("#"));
    const normalized = stripEmphasis(paragraph ?? "");
    return /^No (?:launch )?recommendation\b/i.test(normalized) ? "" : normalized;
}
function stripEmphasis(value) {
    return value.replace(/\*\*|__|(?<!\*)\*(?!\*)|(?<!_)_(?!_)/g, "").trim();
}
function collectEvidence(tree) {
    const out = [];
    const matterRecordLabels = {
        "request.md": {
            name: "Original request",
            kind: "Matter record",
            note: "The request that started this matter"
        },
        "facts.md": {
            name: "Facts, sources & assumptions",
            kind: "Matter record",
            note: "The current factual record"
        },
        "issues.md": {
            name: "Issue map",
            kind: "Matter record",
            note: "The legal and operational questions"
        },
        "recommendations.md": {
            name: "Working recommendation",
            kind: "Matter record",
            note: "Saved recommendation; source and review status are not recorded"
        }
    };
    const walk = (nodes, folder)=>{
        for (const node of nodes){
            if (node.type === "folder") {
                walk(node.children ?? [], node.name);
                continue;
            }
            const matterRecord = matterRecordLabels[node.name];
            if (matterRecord) {
                out.push({
                    path: node.path,
                    ...matterRecord
                });
            } else if (folder === "documents") {
                out.push({
                    path: node.path,
                    name: node.label ?? node.name,
                    kind: "Source document",
                    note: "Attached to the matter"
                });
            } else if (folder === "research" && !node.path.includes("/research/runs/")) {
                out.push({
                    path: node.path,
                    name: node.label ?? node.name,
                    kind: "First-pass research",
                    note: "Saved research packet"
                });
            }
        }
    };
    walk(tree, "");
    return out.slice(0, 6);
}
function safeMatterPath(requested, matterPath, fallback) {
    if (!requested || requested.includes("\\") || requested.split("/").includes("..")) return fallback;
    return requested.startsWith(`${matterPath}/`) ? requested : fallback;
}
function conversationIdFromPath(path) {
    if (!path.includes("/conversations/")) return null;
    const match = path.split("/").at(-1)?.match(/^(CONV-\d{8}-[a-f0-9]{6})\.md$/);
    return match?.[1] ?? null;
}
function findConversationPath(tree, conversationId) {
    const folder = tree.find((node)=>node.type === "folder" && node.name === "conversations");
    return (folder?.children ?? []).find((node)=>node.path.endsWith(`/${conversationId}.md`))?.path ?? null;
}
function findLatestResearch(tree) {
    const folder = tree.find((node)=>node.type === "folder" && node.name === "research");
    const files = (folder?.children ?? []).filter((node)=>node.type === "file" && node.extension === ".md" && node.name !== "annotations.md");
    return files.length ? files[files.length - 1].path : null;
}
function participantRoleLabel(role) {
    return role.replaceAll("_", " ").replace(/^./, (letter)=>letter.toUpperCase());
}
function findFileByName(tree, name) {
    for (const node of tree){
        if (node.type === "file" && node.name === name) return node.path;
        if (node.type === "folder") {
            const found = findFileByName(node.children ?? [], name);
            if (found) return found;
        }
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/matterActions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lifecycleActionNeedsDirectMutation",
    ()=>lifecycleActionNeedsDirectMutation,
    "matterAction",
    ()=>matterAction,
    "workflowStateExplanation",
    ()=>workflowStateExplanation
]);
function matterAction(detail, hasDraft) {
    if (detail.status === "intake") {
        return {
            id: "review_intake",
            category: "Work action",
            label: "Review intake",
            detail: "Confirm the request and missing facts."
        };
    }
    if (detail.status === "research") {
        return {
            id: "run_research",
            category: "Work action",
            label: "Run research",
            detail: "Gather the inputs needed to assess the matter."
        };
    }
    if (detail.status === "explore") {
        if (!detail.durable_decision_needed && detail.decisions.length > 0) {
            return {
                id: "start_work_product",
                category: "Work action",
                label: "Start work product",
                detail: "Use the chosen path to prepare the output."
            };
        }
        return {
            id: "review_and_decide",
            category: "Counsel judgment",
            label: "Record decision",
            detail: "Review the proposed path and record the decision."
        };
    }
    if (detail.status === "generate") {
        return hasDraft ? {
            id: "review_draft",
            category: "Work action",
            label: "Review draft",
            detail: "Check the work product before it is approved or sent."
        } : {
            id: "draft_work_product",
            category: "Work action",
            label: "Draft work product",
            detail: "Create the output for the chosen path."
        };
    }
    if (detail.status === "respond") {
        if (!detail.current_work_product_final_path) {
            return {
                id: "review_draft",
                category: "Work action",
                label: "Review draft",
                detail: "Finalize the current draft before approval is available."
            };
        }
        if (!detail.response_approved_at) {
            return {
                id: "approve_response",
                category: "Approval",
                label: "Approve response",
                detail: "Give permission to use or send this work product."
            };
        }
        if (!detail.response_sent_at) {
            return {
                id: "mark_as_sent",
                category: "Delivery",
                label: "Record manual delivery",
                detail: "Record delivery outside Themis.ai. This does not send or contact anyone."
            };
        }
        const requiredOpen = detail.work_items.some((item)=>Boolean(item.required) && ![
                "done",
                "closed"
            ].includes(item.status));
        return {
            id: "close_matter",
            category: "Matter closure",
            label: "Close matter",
            detail: requiredOpen ? "Required work remains and will block closure until it is complete." : "Delivery is complete and no required work remains."
        };
    }
    return {
        id: "none",
        category: "Matter closure",
        label: "Matter closed",
        detail: "The work was delivered or otherwise resolved."
    };
}
function lifecycleActionNeedsDirectMutation(action) {
    return action === "approve_response" || action === "mark_as_sent" || action === "close_matter";
}
function workflowStateExplanation(detail) {
    const stage = {
        intake: "Just came in",
        research: "Being researched",
        explore: "Waiting on your judgment",
        generate: "Being drafted",
        respond: "Respond",
        closed: "Closed"
    }[detail.status];
    const workItem = detail.work_items.find((item)=>item.work_item_id === detail.work_state.next_work_item_id);
    if (detail.status === "closed") {
        return "Stage: Closed. No action required.";
    }
    const requiredWorkRemains = detail.work_items.some((item)=>Boolean(item.required) && ![
            "done",
            "closed"
        ].includes(item.status));
    if (detail.status === "respond" && detail.response_sent_at && requiredWorkRemains) {
        return "Stage: Respond. Manual delivery recorded. Required work remains before closure.";
    }
    if ([
        "queued",
        "running"
    ].includes(detail.work_state.execution_state)) {
        return `${stage} · Research still running in the background.`;
    }
    if (detail.work_state.next_actor === "unassigned") {
        const subject = workItem?.title ? ` for “${workItem.title}”` : "";
        return `Stage: ${stage}. Assign an owner${subject}.`;
    }
    if (detail.work_state.next_actor === "named_owner") {
        return `Stage: ${stage}. Waiting on ${detail.work_state.next_owner || "the assigned owner"}.`;
    }
    if (detail.work_state.next_actor === "themis") {
        return `Stage: ${stage}. Ready for Themis.ai.`;
    }
    if (detail.work_state.next_actor === "you") {
        return `Stage: ${stage}. Waiting on you.`;
    }
    return `Stage: ${stage}.`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/matterBrief.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completableCurrentWorkItemId",
    ()=>completableCurrentWorkItemId,
    "controlIdForCurrentWork",
    ()=>controlIdForCurrentWork,
    "countUserFacingDocuments",
    ()=>countUserFacingDocuments,
    "currentWorkItemFor",
    ()=>currentWorkItemFor,
    "isKnownMatterArtifactPath",
    ()=>isKnownMatterArtifactPath,
    "matterArtifacts",
    ()=>matterArtifacts,
    "mutationFailureMessages",
    ()=>mutationFailureMessages,
    "mutationOutcome",
    ()=>mutationOutcome,
    "openItemsFor",
    ()=>openItemsFor,
    "userFacingMatterTree",
    ()=>userFacingMatterTree,
    "workItemOwnerLabel",
    ()=>workItemOwnerLabel
]);
function currentWorkItemFor(workItems, nextWorkItemId) {
    return workItems.find((item)=>item.work_item_id === nextWorkItemId);
}
function completableCurrentWorkItemId(currentWorkItem) {
    if (!currentWorkItem || !currentWorkItem.required || [
        "done",
        "closed"
    ].includes(currentWorkItem.status)) return null;
    return currentWorkItem.work_item_id;
}
function workItemOwnerLabel(workItem) {
    return workItem?.owner?.trim() || "Unassigned";
}
function controlIdForCurrentWork(stageActionId, currentWorkItem) {
    // Approval and delivery are explicit lawyer actions. A stale or older API
    // response must not let an unrelated required item replace either control.
    if (stageActionId === "approve_response" || stageActionId === "mark_as_sent") return stageActionId;
    if (!currentWorkItem) return stageActionId;
    if (currentWorkItem.item_type === "research") return "run_research";
    return "open_work_item";
}
function openItemsFor(workItems, openQuestions, nextWorkItemId, nextAction) {
    const openWorkItems = workItems.filter((item)=>![
            "done",
            "closed"
        ].includes(item.status));
    const workTitleKeys = new Set(openWorkItems.map((item)=>normalizeQuestion(item.title)));
    const items = openWorkItems.filter((item)=>item.work_item_id !== nextWorkItemId).map((item)=>({
            key: `work:${item.work_item_id}`,
            text: item.title,
            required: Boolean(item.required),
            source: "work_item",
            workItemId: item.work_item_id
        }));
    const seenQuestionKeys = new Set();
    const currentActionKey = normalizeQuestion(nextAction);
    for (const question of openQuestions){
        const key = normalizeQuestion(question);
        if (!key || key === currentActionKey || workTitleKeys.has(key) || seenQuestionKeys.has(key)) continue;
        seenQuestionKeys.add(key);
        items.push({
            key: `question:${key}`,
            text: question,
            required: false,
            source: "open_question",
            workItemId: null
        });
    }
    return items;
}
function normalizeQuestion(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();
}
function matterArtifacts(tree, approvedArtifactPath, currentDraftPath, latestResearchPath, currentFinalPath) {
    const files = [];
    const walk = (nodes)=>{
        for (const node of nodes)node.type === "folder" ? walk(node.children ?? []) : files.push(node);
    };
    walk(tree);
    const markdown = files.filter((node)=>node.extension === ".md" || node.name.endsWith(".md"));
    const recommendation = markdown.find((node)=>node.name === "recommendations.md");
    const researchCandidates = markdown.filter((node)=>!node.path.includes("/research/runs/") && (node.record_type === "research" || node.path.includes("/research/") && node.name !== "annotations.md"));
    const research = latestResearchPath ? researchCandidates.find((node)=>node.path === latestResearchPath) : researchCandidates.reduce((latest, node)=>!latest || (node.updated_at ?? 0) >= (latest.updated_at ?? 0) ? node : latest, undefined);
    const workProducts = markdown.filter((node)=>node.record_type === "work_product");
    const legacyDrafts = markdown.filter((node)=>node.path.includes("/work-product/draft/") || node.path.includes("/drafts/"));
    const draftCandidates = [
        ...workProducts.filter((node)=>node.state === "draft"),
        ...legacyDrafts.filter((node)=>!workProducts.includes(node))
    ];
    const canonicalDraft = currentDraftPath ? draftCandidates.find((node)=>node.path === currentDraftPath) : undefined;
    const draft = canonicalDraft ?? draftCandidates.at(-1);
    const metadataFinals = workProducts.filter((node)=>node.state === "final");
    const newestMetadataFinal = metadataFinals.reduce((latest, node)=>{
        if (!latest) return node;
        const nodeUpdated = node.updated_at ?? 0;
        const latestUpdated = latest.updated_at ?? 0;
        return nodeUpdated >= latestUpdated ? node : latest;
    }, undefined);
    const approvedFinal = approvedArtifactPath ? metadataFinals.find((node)=>node.path === approvedArtifactPath) : undefined;
    const currentFinal = currentFinalPath ? metadataFinals.find((node)=>node.path === currentFinalPath) : undefined;
    const final = approvedFinal ?? currentFinal ?? (currentDraftPath ? undefined : newestMetadataFinal);
    return [
        recommendation && {
            kind: "recommendation",
            path: recommendation.path,
            label: recommendation.label ?? recommendation.name
        },
        research && {
            kind: "research",
            path: research.path,
            label: research.label ?? "First-pass research"
        },
        draft && {
            kind: "draft",
            path: draft.path,
            label: draft.label ?? draft.name
        },
        final && {
            kind: "final",
            path: final.path,
            label: final.label ?? final.name
        }
    ].filter((item)=>Boolean(item));
}
const OPERATIONAL_PATH_PARTS = [
    "/events/",
    "/research/runs/",
    "/documents/batches/",
    "/dossier-revisions/"
];
function userFacingMatterTree(tree) {
    return tree.flatMap((node)=>{
        const normalizedPath = `/${node.path.replace(/^\/+|\/+$/g, "")}/`;
        if (OPERATIONAL_PATH_PARTS.some((part)=>normalizedPath.includes(part))) return [];
        if (node.type === "file") return [
            node
        ];
        return [
            {
                ...node,
                children: userFacingMatterTree(node.children ?? [])
            }
        ];
    });
}
function countUserFacingDocuments(tree) {
    let total = 0;
    const walk = (nodes)=>{
        for (const node of nodes){
            if (node.type === "folder") walk(node.children ?? []);
            else total += 1;
        }
    };
    walk(userFacingMatterTree(tree));
    return total;
}
function isKnownMatterArtifactPath(path, artifacts, cards = []) {
    if (!path || !path.endsWith(".md")) return false;
    if (artifacts.some((item)=>item.path === path)) return true;
    return cards.some((card)=>card.type === "work_product" && card.vault_path === path);
}
function mutationOutcome(trace = [], cards = []) {
    const structuredSuccess = trace.some((item)=>item.mutation_status === "changed") || cards.some((card)=>card.type === "matter_update" || card.type === "work_product");
    if (structuredSuccess) return "recorded";
    if (trace.some((item)=>item.mutation_status === "failed" || item.mutation_status === "no_change")) return "no_change";
    return "none";
}
function mutationFailureMessages(trace = []) {
    return [
        ...new Set(trace.filter((item)=>item.mutation_status === "failed").map((item)=>item.summary.trim()).filter(Boolean))
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/modelSettingsRows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alignModelRows",
    ()=>alignModelRows
]);
const effortLabel = (value)=>value === "default" ? "Default" : value.charAt(0).toUpperCase() + value.slice(1);
function alignModelRows(rows, settings, collection = false) {
    const providerKey = collection ? "research.model_fallback_provider" : "agents.provider";
    const modelKey = collection ? "research.model_fallback_model" : "agents.reasoning_model";
    const effortKey = collection ? "research.collection_reasoning_effort" : "agents.reasoning_effort";
    const providerRow = rows.find((row)=>row.config_key === providerKey);
    const provider = settings.model_catalog.providers.find((entry)=>entry.id === providerRow?.value) ?? settings.model_catalog.providers[0];
    const currentModel = rows.find((row)=>row.config_key === modelKey)?.value;
    const model = provider?.models.find((entry)=>entry.id === currentModel) ?? provider?.models[0];
    const currentEffort = rows.find((row)=>row.config_key === effortKey)?.value;
    const effort = model?.reasoning_efforts.includes(currentEffort ?? "") ? currentEffort ?? "default" : model?.reasoning_efforts[0] ?? currentEffort ?? "default";
    const modelOptions = provider?.models.length ? provider.models : currentModel ? [
        {
            id: currentModel,
            label: `${currentModel} (unavailable)`,
            reasoning_efforts: []
        }
    ] : [];
    return rows.map((row)=>{
        if (row.config_key === providerKey) return {
            ...row,
            options: settings.model_catalog.providers.map((p)=>p.id),
            option_labels: Object.fromEntries(settings.model_catalog.providers.map((p)=>[
                    p.id,
                    p.label
                ]))
        };
        if (row.config_key === modelKey) {
            return {
                ...row,
                value: model?.id ?? currentModel ?? "",
                options: modelOptions.map((entry)=>entry.id),
                option_labels: Object.fromEntries(modelOptions.map((entry)=>[
                        entry.id,
                        entry.label
                    ]))
            };
        }
        if (row.config_key === effortKey) {
            const efforts = model?.reasoning_efforts.length ? model.reasoning_efforts : [
                effort
            ];
            return {
                ...row,
                value: effort,
                options: efforts,
                option_labels: Object.fromEntries(efforts.map((entry)=>[
                        entry,
                        effortLabel(entry)
                    ]))
            };
        }
        return row;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/orientationPresentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actionOwnerText",
    ()=>actionOwnerText,
    "actionStateWord",
    ()=>actionStateWord,
    "canCompareSuppliedSource",
    ()=>canCompareSuppliedSource,
    "canRequestFact",
    ()=>canRequestFact,
    "isOpenableWorkTarget",
    ()=>isOpenableWorkTarget,
    "orientationAnswer",
    ()=>orientationAnswer,
    "previewOrientationQuestion",
    ()=>previewOrientationQuestion,
    "visibleOrientationActions",
    ()=>visibleOrientationActions,
    "visibleRecapChanges",
    ()=>visibleRecapChanges
]);
const QUESTION_PREVIEW_LIMIT = 220;
function previewOrientationQuestion(question, limit = QUESTION_PREVIEW_LIMIT) {
    const clean = question.replace(/\s+/g, " ").trim();
    if (clean.length <= limit) return clean;
    const boundary = clean.lastIndexOf(" ", limit - 1);
    return `${clean.slice(0, boundary > 0 ? boundary : limit).trimEnd()}…`;
}
function orientationAnswer(orientation, fallback = "") {
    const answer = orientation?.answer?.trim() || fallback.trim();
    if (!answer) return {
        text: "",
        label: orientation?.answer_label || "No saved answer is available",
        path: orientation?.answer_path ?? null,
        state: orientation?.answer_state ?? "unavailable"
    };
    return {
        text: answer,
        label: orientation?.answer_label || "Saved matter answer",
        path: orientation?.answer_path ?? null,
        state: orientation?.answer_state ?? "current"
    };
}
function visibleOrientationActions(orientation) {
    return {
        primary: orientation?.primary_action ?? null,
        secondary: (orientation?.secondary_actions ?? []).slice(0, 2)
    };
}
function visibleRecapChanges(changes, expanded) {
    return expanded ? [
        ...changes ?? []
    ] : (changes ?? []).slice(0, 3);
}
function actionStateWord(action) {
    if (action.state === "ready") return "Ready";
    if (action.state === "waiting") return "Waiting";
    if (action.state === "running") return "Agent work";
    if (action.state === "failed") return "Failed";
    if (action.state === "complete") return "Complete";
    return "Unavailable";
}
function actionOwnerText(action) {
    if (action.owner_name) return `For ${action.owner_name}`;
    if (action.actor_kind === "business") return "Waiting on the business";
    if (action.actor_kind === "agent") return "Themis.ai is working";
    return null;
}
const WORK_TARGET_KINDS = new Set([
    "matter",
    "work_item",
    "question",
    "artifact",
    "handoff",
    "fact_request",
    "impact",
    "run"
]);
function isOpenableWorkTarget(target) {
    if (!target || typeof target !== "object") return false;
    const value = target;
    return typeof value.matter_id === "string" && value.matter_id.trim().length > 0 && typeof value.kind === "string" && WORK_TARGET_KINDS.has(value.kind) && (typeof value.target_id === "string" && value.target_id.trim().length > 0 || typeof value.path === "string" && value.path.trim().length > 0);
}
function canRequestFact(questionState) {
    return questionState === "open" || questionState === "left_open";
}
function canCompareSuppliedSource(supportState) {
    return supportState === "supplied";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/pendingActions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "beginPendingAction",
    ()=>beginPendingAction,
    "endPendingAction",
    ()=>endPendingAction
]);
function beginPendingAction(current, key) {
    return current.includes(key) ? current : [
        ...current,
        key
    ];
}
function endPendingAction(current, key) {
    return current.filter((item)=>item !== key);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/recommendations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "recommendationBasis",
    ()=>recommendationBasis,
    "recommendationNeedsReason",
    ()=>recommendationNeedsReason
]);
function recommendationNeedsReason(disposition) {
    return disposition === "modified" || disposition === "not_followed";
}
function recommendationBasis(state) {
    return state?.current_version_id ? [
        state.path
    ] : [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/research.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Parse saved research without inventing source text or source status. */ __turbopack_context__.s([
    "isSafeSourceUrl",
    ()=>isSafeSourceUrl,
    "isSafeVaultPath",
    ()=>isSafeVaultPath,
    "parseMemo",
    ()=>parseMemo,
    "splitCitations",
    ()=>splitCitations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design.ts [app-client] (ecmascript)");
;
const SOURCE_LINE = /^(?:[-*]|\d{1,3}[.)])\s+([^:]+):\s*(.*)$/;
const LIST_ITEM = /^(?:[-*]|\d{1,3}[.)])\s+(.+)$/;
const BACKTICK_PATH = /`([^`]+)`/;
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/;
const SOURCE_ID = /\[source:([^\]]+)\]/i;
function parseMemo(document) {
    const lines = document.content.split("\n");
    const citations = [];
    const bodyLines = [];
    let inSources = false;
    let sourceOrdinal = 0;
    for(let index = 0; index < lines.length; index += 1){
        const line = lines[index];
        const heading = line.trim().match(/^#{1,6}\s+(.+)$/);
        if (heading) inSources = /\bsources?\b/i.test(heading[1]);
        const match = line.trim().match(SOURCE_LINE);
        const listItem = line.trim().match(LIST_ITEM);
        const parsedLabel = match ? sourceLabelState(match[1]) : null;
        const sourceCandidate = Boolean(parsedLabel || inSources && listItem);
        if (!sourceCandidate) {
            bodyLines.push(line);
            continue;
        }
        // Count every source-list row. A malformed or unknown row must not make a
        // later source take its numeric citation marker.
        sourceOrdinal += 1;
        if (!match || !parsedLabel) {
            const ignoredExcerpt = readExcerpt(lines, index + 1);
            if (ignoredExcerpt.consumed) index += ignoredExcerpt.consumed;
            continue;
        }
        const rest = match[2];
        const sourceId = rest.match(SOURCE_ID)?.[1]?.trim();
        const withoutId = rest.replace(SOURCE_ID, "").trim();
        const [nameRaw, inlineExcerpt] = splitOnDash(withoutId);
        const rawPath = nameRaw.match(BACKTICK_PATH)?.[1];
        const path = rawPath && isSafeVaultPath(rawPath) ? rawPath : undefined;
        const link = nameRaw.match(MARKDOWN_LINK);
        const url = link && isSafeSourceUrl(link[2]) ? link[2] : undefined;
        const captured = readExcerpt(lines, index + 1);
        if (captured.consumed) index += captured.consumed;
        const exactExcerpt = captured.found ? captured.text : cleanLegacyInlineExcerpt(inlineExcerpt);
        const statusText = sourceStatusText(parsedLabel.status);
        citations.push({
            id: sourceId || `s${sourceOrdinal}`,
            n: String(sourceOrdinal),
            name: link ? stripMarks(link[1]) : path ? displaySourceLabel(path) : stripMarks(nameRaw) || "Unknown source",
            kind: url ? `${parsedLabel.kind} · ${url}` : parsedLabel.kind,
            quote: exactExcerpt,
            note: `${statusText}${exactExcerpt ? "" : " · No exact passage is available."}${rawPath && !path ? " The saved path is unsafe and was blocked." : ""}`
        });
    }
    const savedTitle = lines.find((line)=>line.startsWith("# "))?.slice(2).trim();
    const title = !savedTitle || /^First-Pass Research Packet$/i.test(savedTitle) ? String(document.metadata.title ?? document.metadata.question ?? document.name) : savedTitle;
    const author = String(document.metadata.author ?? document.metadata.agent_id ?? "Themis.ai");
    const created = String(document.metadata.created_at ?? document.metadata.updated_at ?? "");
    const providerLegs = Array.isArray(document.metadata.provider_legs) ? document.metadata.provider_legs.filter(isRecord) : [];
    const polarisObservability = isRecord(document.metadata.polaris_observability) ? document.metadata.polaris_observability : null;
    const correlationId = typeof document.metadata.correlation_id === "string" ? document.metadata.correlation_id : "";
    return {
        path: document.path,
        title,
        byline: [
            author,
            created ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTime"])(created) : null,
            citations.length ? `${citations.length} source${citations.length === 1 ? "" : "s"} cited` : "no sources cited"
        ].filter(Boolean).join(" · "),
        blocks: toBlocks(bodyLines),
        citations,
        technicalDetails: providerLegs.length || polarisObservability || correlationId ? {
            providerLegs,
            polarisObservability,
            correlationId
        } : null,
        publicResearchStatus: isPublicResearchStatus(document.metadata.public_research_status) ? document.metadata.public_research_status : undefined
    };
}
function sourceLabelState(label) {
    const value = label.trim().toLowerCase().replace(/\s+/g, " ");
    if (/^internal(?:(?: matter)? support)?$/.test(value)) return {
        status: "supplied",
        kind: "Internal matter support"
    };
    if (/^supplied(?: public)? source$/.test(value)) return {
        status: "supplied",
        kind: "Supplied public source"
    };
    if (/^retrieved(?: external authority)?$/.test(value)) return {
        status: "retrieved",
        kind: "Retrieved external authority"
    };
    if (/^verified(?: external authority)?$/.test(value)) return {
        status: "verified_label",
        kind: "External authority · Legacy label: Verified"
    };
    if (/^unverified(?: external lead)?$/.test(value)) return {
        status: "unverified",
        kind: "Unverified external lead"
    };
    if (/^external(?: authority)?$/.test(value)) return {
        status: "unknown",
        kind: "External authority · Status unknown"
    };
    if (/^source$/.test(value)) return {
        status: "unknown",
        kind: "Source · Status unknown"
    };
    return null;
}
function sourceStatusText(status) {
    return ({
        supplied: "Supplied",
        retrieved: "Retrieved",
        verified_label: "Legacy label: Verified · Stored verification event not available",
        unverified: "Unverified lead",
        unknown: "Status unknown"
    })[status];
}
function readExcerpt(lines, start) {
    let cursor = start;
    while(cursor < lines.length && !lines[cursor].trim())cursor += 1;
    if (!/^\s+Available excerpt:\s*$/i.test(lines[cursor] ?? "")) {
        if (/^\s+No source excerpt available\.\s*$/i.test(lines[cursor] ?? "")) return {
            found: true,
            text: "",
            consumed: cursor - start + 1
        };
        return {
            found: false,
            text: "",
            consumed: 0
        };
    }
    const passage = [];
    cursor += 1;
    while(cursor < lines.length){
        const quoted = lines[cursor].match(/^\s*> ?(.*)$/);
        if (!quoted) break;
        passage.push(quoted[1]);
        cursor += 1;
    }
    return {
        found: true,
        text: passage.join("\n"),
        consumed: cursor - start
    };
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isPublicResearchStatus(value) {
    return [
        "not_requested",
        "retrieved",
        "unavailable",
        "failed"
    ].includes(String(value));
}
function toBlocks(lines) {
    const blocks = [];
    let paragraph = [];
    let list = [];
    const flushParagraph = ()=>{
        if (paragraph.length) blocks.push({
            kind: "p",
            text: paragraph.join(" ").trim()
        });
        paragraph = [];
    };
    const flushList = ()=>{
        if (list.length) blocks.push({
            kind: "list",
            items: [
                ...list
            ]
        });
        list = [];
    };
    for (const raw of lines){
        const line = raw.trim();
        if (!line) {
            flushParagraph();
            flushList();
            continue;
        }
        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            flushParagraph();
            flushList();
            if (heading[1].length > 1) blocks.push({
                kind: "h",
                level: heading[1].length,
                text: heading[2].trim()
            });
            continue;
        }
        const item = line.match(/^(?:[-*]|\d{1,3}[.)])\s+(.*)$/);
        if (item) {
            flushParagraph();
            list.push(item[1].trim());
            continue;
        }
        if (line.startsWith(">")) {
            flushParagraph();
            flushList();
            blocks.push({
                kind: "quote",
                text: line.replace(/^>\s?/, "")
            });
            continue;
        }
        flushList();
        paragraph.push(line);
    }
    flushParagraph();
    flushList();
    return blocks;
}
function splitCitations(paragraph) {
    const runs = [];
    let cursor = 0;
    const pattern = /\[(?:source:([^\]]+)|(\d{1,3}))\]/gi;
    let match;
    while((match = pattern.exec(paragraph)) !== null){
        if (match.index > cursor) runs.push({
            text: paragraph.slice(cursor, match.index)
        });
        runs.push({
            citation: (match[1] || match[2]).trim()
        });
        cursor = match.index + match[0].length;
    }
    if (cursor < paragraph.length) runs.push({
        text: paragraph.slice(cursor)
    });
    return runs;
}
function splitOnDash(value) {
    const index = value.indexOf(" — ");
    if (index !== -1) return [
        value.slice(0, index).trim(),
        value.slice(index + 3).trim()
    ];
    const dash = value.indexOf(" - ");
    return dash === -1 ? [
        value.trim(),
        ""
    ] : [
        value.slice(0, dash).trim(),
        value.slice(dash + 3).trim()
    ];
}
function stripMarks(value) {
    return value.replace(/[`*_]/g, "").trim();
}
function cleanLegacyInlineExcerpt(value) {
    const excerpt = stripMarks(value).replace(/\s+/g, " ").trim();
    // Older packets flattened a whole Markdown record into this description.
    // That text is not a captured passage, so leave the quotation empty.
    if (/^---(?:\s|$)/.test(excerpt) || /\b(?:matter_id|record_type|created_at|updated_at|source_revision):\s/.test(excerpt)) return "";
    return excerpt;
}
function isSafeSourceUrl(value) {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch  {
        return false;
    }
}
function isSafeVaultPath(value) {
    if (!value || value.startsWith("/") || value.startsWith("\\") || value.includes("\\")) return false;
    return value.split("/").every((part)=>Boolean(part) && part !== "." && part !== "..");
}
function displaySourceLabel(path) {
    const name = path.split("/").at(-1) ?? path;
    const fixed = {
        "matter.md": "Matter details",
        "request.md": "Original request",
        "facts.md": "Facts, sources & assumptions",
        "issues.md": "Issue map",
        "participants.md": "People & roles",
        "recommendations.md": "Working recommendation",
        "dossier.md": "Matter dossier"
    };
    if (fixed[name]) return fixed[name];
    if (/^CONV-/i.test(name)) return "Matter conversation";
    if (/^RES-/i.test(name)) return "Research packet";
    if (/^RUN-/i.test(name)) return "Research run";
    if (/^DOS-/i.test(name)) return "Dossier revision";
    if (/^WI-/i.test(name)) return "Work item";
    if (/^(?:EVT-|\d{4}-\d{2}-\d{2}-EVT-)/i.test(name)) return "Matter activity";
    return name.replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter)=>letter.toUpperCase());
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/researchQueue.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "movePending",
    ()=>movePending,
    "researchQuestion",
    ()=>researchQuestion,
    "researchQueueAggregate",
    ()=>researchQueueAggregate,
    "researchSupportLabel",
    ()=>researchSupportLabel,
    "savedSupportCount",
    ()=>savedSupportCount,
    "shouldPollResearchQueue",
    ()=>shouldPollResearchQueue
]);
function shouldPollResearchQueue(items) {
    return items.some((item)=>item.state === "queued" || item.state === "running");
}
function researchQuestion(selected, entered, matterTitle) {
    return selected.trim() || entered.trim() || matterTitle.trim();
}
function movePending(items, runId, direction) {
    const pending = items.filter((item)=>item.state === "queued");
    const index = pending.findIndex((item)=>item.run_id === runId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= pending.length) return pending.map((item)=>item.run_id);
    [pending[index], pending[target]] = [
        pending[target],
        pending[index]
    ];
    return pending.map((item)=>item.run_id);
}
function researchQueueAggregate(items) {
    return items.reduce((aggregate, item)=>{
        const results = item.results ?? [];
        return {
            runCount: aggregate.runCount + 1,
            activeCount: aggregate.activeCount + Number(item.state === "queued" || item.state === "running"),
            savedPacketCount: aggregate.savedPacketCount + results.filter((result)=>Boolean(result.path)).length,
            supportCount: aggregate.supportCount + savedSupportCount(item)
        };
    }, {
        runCount: 0,
        activeCount: 0,
        savedPacketCount: 0,
        supportCount: 0
    });
}
function savedSupportCount(item) {
    const countedResults = (item.results ?? []).reduce((total, result)=>total + Number(result.internal_sources || 0) + Number(result.external_sources || 0), 0);
    return Math.max(Number(item.useful_support || 0), countedResults);
}
function researchSupportLabel(item) {
    const supportCount = savedSupportCount(item);
    if (supportCount) return `${supportCount} saved support ${supportCount === 1 ? "source" : "sources"}`;
    if (item.results?.some((result)=>Boolean(result.path))) return "Saved packet · No counted support sources";
    return item.state === "queued" || item.state === "running" ? "No saved support yet" : "No saved support";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/reviewAuthor.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GENERATED_REVIEW_AUTHOR",
    ()=>GENERATED_REVIEW_AUTHOR,
    "REVIEW_AUTHOR_PALETTE",
    ()=>REVIEW_AUTHOR_PALETTE,
    "authorId",
    ()=>authorId,
    "displayReviewAuthor",
    ()=>displayReviewAuthor,
    "useReviewAuthor",
    ()=>useReviewAuthor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const REVIEW_AUTHOR_PALETTE = [
    "#2F5597",
    "#7030A0",
    "#008272",
    "#A64B00",
    "#C0006F",
    "#5B6573",
    "#7A3E00",
    "#006B8F"
];
const GENERATED_REVIEW_AUTHOR = "Themis.ai";
const KEY = "themis.ai.review-author";
const LEGACY_KEY = "counsel-os.review-author";
function currentAuthorName(name) {
    return name === "Themis" ? GENERATED_REVIEW_AUTHOR : name;
}
function authorId(name) {
    return [
        "Themis",
        GENERATED_REVIEW_AUTHOR
    ].includes(name) ? "author-themis" : `author-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
function displayReviewAuthor(name, id = "") {
    return id === "author-themis" ? GENERATED_REVIEW_AUTHOR : currentAuthorName(name);
}
function useReviewAuthor(defaultName = "Themis.ai") {
    _s();
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentContinuityStorageKey"])("workspace", "review-author") || KEY;
    const fallback = currentAuthorName(defaultName.trim()) || GENERATED_REVIEW_AUTHOR;
    const [name, setNameState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(fallback);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useReviewAuthor.useEffect": ()=>{
            const stored = sessionStorage.getItem(key)?.trim() || (key === KEY ? sessionStorage.getItem(LEGACY_KEY)?.trim() : "");
            const current = currentAuthorName(stored || fallback);
            sessionStorage.setItem(key, current);
            setNameState(current);
        }
    }["useReviewAuthor.useEffect"], [
        fallback,
        key
    ]);
    const setName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReviewAuthor.useCallback[setName]": (next)=>{
            const clean = next.trim() || fallback;
            sessionStorage.setItem(key, clean);
            setNameState(clean);
        }
    }["useReviewAuthor.useCallback[setName]"], [
        fallback,
        key
    ]);
    const asAuthor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useReviewAuthor.useCallback[asAuthor]": (authors = [])=>{
            const id = authorId(name);
            return authors.find({
                "useReviewAuthor.useCallback[asAuthor]": (item)=>item.author_id === id
            }["useReviewAuthor.useCallback[asAuthor]"]) ?? {
                author_id: id,
                name,
                color: REVIEW_AUTHOR_PALETTE[authors.length % REVIEW_AUTHOR_PALETTE.length]
            };
        }
    }["useReviewAuthor.useCallback[asAuthor]"], [
        name
    ]);
    return {
        name,
        setName,
        asAuthor
    };
}
_s(useReviewAuthor, "3RObWXTAIrzbJwW5H28qs/6Ki8o=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/skills.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "skillBuilderGoal",
    ()=>skillBuilderGoal,
    "skillCommandMatches",
    ()=>skillCommandMatches
]);
function skillCommandMatches(input, skills) {
    const value = input.trimStart();
    if (!value.startsWith("/") || /\s/.test(value)) return [];
    const query = value.slice(1).toLowerCase();
    return skills.filter((skill)=>skill.skill_id.startsWith(query) || skill.name.toLowerCase().includes(query));
}
function skillBuilderGoal(input) {
    const value = input.trim();
    const explicitPhrase = /^(?:help me (?:make|create|build) a skill|turn this process into a skill)(?:\b|[.!?])/i;
    return explicitPhrase.test(value) ? input : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/stubs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Presentation vocabulary and defaults that the backend does not model.
 *
 * Persisted settings, tools, audiences, and agent details come from `lib/api.ts`.
 */ __turbopack_context__.s([
    "DEFAULT_SETTINGS",
    ()=>DEFAULT_SETTINGS,
    "FIXED_AGENT_RULES",
    ()=>FIXED_AGENT_RULES,
    "agentDetailFrom",
    ()=>agentDetailFrom,
    "agentStateColor",
    ()=>agentStateColor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design.ts [app-client] (ecmascript)");
;
const DEFAULT_SETTINGS = [
    {
        id: "agents",
        label: "Model",
        title: "Model",
        sub: "Choose the provider and model that Themis.ai uses.",
        rows: [
            {
                id: "h-advanced",
                kind: "heading",
                label: "Advanced model options"
            },
            {
                id: "provider",
                config_key: "agents.provider",
                kind: "select",
                label: "Provider",
                help: "Where reasoning runs. The list comes from the providers configured in the backend.",
                value: "mock",
                options: [
                    "mock"
                ]
            },
            {
                id: "model",
                config_key: "agents.reasoning_model",
                kind: "select",
                label: "Model",
                help: "Used for research, drafting and the copilot. The list comes from the selected provider.",
                value: "mock",
                options: [
                    "mock"
                ]
            },
            {
                id: "effort",
                config_key: "agents.reasoning_effort",
                kind: "select",
                label: "Reasoning effort",
                help: "Higher effort can improve difficult answers but can take more time. Default lets the provider decide.",
                value: "default",
                options: [
                    "default"
                ]
            }
        ]
    },
    {
        id: "answer-contract",
        label: "Answer contract",
        title: "Answer contract",
        sub: "The required shape of a finished answer. Changes apply to the next message.",
        rows: []
    },
    {
        id: "document-review",
        label: "Document review",
        title: "Document review",
        sub: "Choose the lawyer identity and the author used when a browser session starts.",
        rows: [
            {
                id: "lawyer-name",
                config_key: "document_review.lawyer_name",
                kind: "text",
                label: "Lawyer name",
                help: "Used for your comments, replies, and review decisions.",
                value: "Lawyer"
            },
            {
                id: "default-review-author",
                config_key: "document_review.default_author",
                kind: "select",
                label: "Default review author",
                help: "New browser sessions start with Themis.ai or the configured lawyer. A custom author is session-only.",
                value: "Themis.ai",
                options: [
                    "Themis.ai",
                    "Lawyer"
                ]
            }
        ]
    },
    {
        id: "research",
        label: "Research",
        title: "Research",
        sub: "Research runs in the background. If research services fail, the main model type searches the web in a separate session.",
        rows: [
            {
                id: "h-research-technical",
                kind: "heading",
                label: "Advanced / Technical details"
            },
            {
                id: "research-primary",
                config_key: "research.primary_external_provider",
                kind: "select",
                label: "Primary research service",
                value: "polaris",
                options: [
                    "polaris",
                    "tavily",
                    "firecrawl",
                    "none"
                ],
                option_labels: {
                    polaris: "Polaris legal research",
                    tavily: "Tavily web research",
                    firecrawl: "Firecrawl web research",
                    none: "No external research service"
                }
            },
            {
                id: "research-fallback",
                config_key: "research.fallback_external_provider",
                kind: "select",
                label: "Backup research service",
                value: "tavily",
                options: [
                    "polaris",
                    "tavily",
                    "firecrawl",
                    "none"
                ],
                option_labels: {
                    polaris: "Polaris legal research",
                    tavily: "Tavily web research",
                    firecrawl: "Firecrawl web research",
                    none: "No external research service"
                }
            },
            {
                id: "research-collection-enabled",
                config_key: "research.collection_enabled",
                kind: "toggle",
                label: "Use collection agent",
                help: "Use a separate model to retrieve the evidence requested by the main model. When off, use research services directly.",
                on: false
            },
            {
                id: "research-model-provider",
                config_key: "research.model_fallback_provider",
                kind: "select",
                label: "Collection model provider",
                value: "openai_compatible",
                options: [
                    "openai_compatible"
                ],
                option_labels: {
                    openai_compatible: "OpenAI-compatible model service"
                }
            },
            {
                id: "research-model",
                config_key: "research.model_fallback_model",
                kind: "select",
                label: "Collection model",
                value: "kimi-k3-fast",
                options: [
                    "kimi-k3-fast"
                ]
            },
            {
                id: "research-effort",
                config_key: "research.collection_reasoning_effort",
                kind: "select",
                label: "Collection reasoning effort",
                value: "default",
                options: [
                    "default"
                ]
            },
            {
                id: "research-timeout",
                config_key: "research.external_timeout_seconds",
                kind: "text",
                label: "External timeout (seconds)",
                value: "90"
            },
            {
                id: "research-retries",
                config_key: "research.external_retry_count",
                kind: "text",
                label: "External retry count",
                value: "2"
            }
        ]
    },
    {
        id: "matter-files",
        label: "Files and outputs",
        title: "Files and outputs",
        sub: "Set where source files, drafts, and final work are stored. Each path is relative to its matter and stays inside the vault.",
        rows: [
            {
                id: "source-documents-dir",
                config_key: "matter_files.source_documents_dir",
                kind: "text",
                label: "Source documents",
                help: "The folder for files supplied with a matter. This path is relative to each matter and stays inside the vault.",
                value: "documents"
            },
            {
                id: "draft-outputs-dir",
                config_key: "matter_files.draft_outputs_dir",
                kind: "text",
                label: "Draft outputs",
                help: "The folder for draft work product. This path is relative to each matter and stays inside the vault.",
                value: "work-product/draft"
            },
            {
                id: "final-outputs-dir",
                config_key: "matter_files.final_outputs_dir",
                kind: "text",
                label: "Final outputs",
                help: "The folder for final work product. This path is relative to each matter and stays inside the vault.",
                value: "work-product/final"
            }
        ]
    }
];
const FIXED_AGENT_RULES = [
    "It records a decision only when you explicitly instruct it to do so.",
    "It can draft a reply. It can never send one to a counterparty.",
    "Everything it writes is labelled as agent-authored work."
];
function agentDetailFrom(definition, schedules) {
    const mine = schedules.filter((schedule)=>schedule.agent_id === definition.agent_id);
    const failing = mine.some((schedule)=>schedule.last_status === "error" || schedule.last_status === "failed");
    const automated = mine.some((schedule)=>schedule.enabled === 1);
    const starts = {
        "counsel-copilot": "Starts when you send a message in Today or inside a matter.",
        "intake-agent": "Used when new material enters Intake.",
        "research-agent": "Starts when you run research or ask a research question in a matter.",
        "decision-monitor": "Starts when you run a decision review."
    };
    const automationNote = mine.length === 0 ? "No automation is assigned." : `${mine.length === 1 ? "One automation is" : `${mine.length} automations are`} assigned. Manage timing in Automations.`;
    return {
        ...definition,
        start_description: `${starts[definition.agent_id] ?? "Starts when selected for work."} ${automationNote}`,
        state: failing ? "Failing" : automated ? "Automated" : "On request"
    };
}
function agentStateColor(state) {
    if (state === "Failing") return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["role"].failure;
    if (state === "Automated") return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["role"].agent;
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["role"].healthy;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/teamPresentation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RETRY_DRAFT_PREFIX",
    ()=>RETRY_DRAFT_PREFIX,
    "TEAM_VIEW_LABELS",
    ()=>TEAM_VIEW_LABELS,
    "factRequestStateLabel",
    ()=>factRequestStateLabel,
    "handoffActions",
    ()=>handoffActions,
    "handoffStateLabel",
    ()=>handoffStateLabel,
    "newActionKey",
    ()=>newActionKey,
    "preparationNotice",
    ()=>preparationNotice,
    "receiptNotice",
    ()=>receiptNotice,
    "recoverRetryCommand",
    ()=>recoverRetryCommand,
    "retryDraftKey",
    ()=>retryDraftKey,
    "splitOpenQuestions",
    ()=>splitOpenQuestions
]);
const RETRY_DRAFT_PREFIX = "__continuity.retry.v1";
function retryDraftKey(panel, slot) {
    return `${RETRY_DRAFT_PREFIX}:${panel}:${slot}`;
}
function recoverRetryCommand(stored, intent, base, createKey) {
    const intentSignature = JSON.stringify(intent);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.version === 1 && parsed.intent_signature === intentSignature && parsed.command && typeof parsed.command.source_action_key === "string") {
                return {
                    command: parsed.command,
                    serialized: stored,
                    reused: true
                };
            }
        } catch  {
        // A malformed reserved value is replaced on the next explicit submission.
        }
    }
    const command = {
        ...base,
        source_action_key: createKey()
    };
    return {
        command,
        serialized: JSON.stringify({
            version: 1,
            intent_signature: intentSignature,
            command
        }),
        reused: false
    };
}
const REQUEST_LABELS = {
    prepared: "Prepared",
    requested_externally: "Requested externally",
    reply_saved: "Reply saved",
    answer_recorded: "Answer recorded",
    partly_answered: "Partly answered",
    left_open: "Left open"
};
const HANDOFF_LABELS = {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    withdrawn: "Withdrawn"
};
const TEAM_VIEW_LABELS = {
    my_work: "My work",
    waiting: "Waiting on others",
    team: "Team"
};
function factRequestStateLabel(state) {
    return state ? REQUEST_LABELS[state] : "Prepared";
}
function handoffStateLabel(state) {
    return state ? HANDOFF_LABELS[state] : "Pending";
}
function receiptNotice(receipt, success) {
    if (receipt.state === "applied") return {
        tone: "healthy",
        word: "Saved",
        detail: success
    };
    if (receipt.state === "proposed") return {
        tone: "attention",
        word: "Proposed",
        detail: "No recorded fact or ownership changed."
    };
    const labels = {
        reported_fact: "reported fact",
        supplied_reply: "exact reply",
        question_link: "question link",
        request_record: "request record",
        ownership: "ownership change",
        handoff_record: "handoff record"
    };
    const completed = receipt.completed_parts ?? [];
    const saved = completed.length ? ` Saved: ${completed.map((part)=>labels[part] ?? part.replaceAll("_", " ")).join(", ")}.` : "";
    return {
        tone: "failure",
        word: completed.length ? "Partly saved" : "Not saved",
        detail: `${receipt.failure_detail || "The action did not finish."}${saved} Your input is retained for retry.`
    };
}
function preparationNotice(state, subject, unchanged) {
    if (state === "completed") return {
        tone: "agent",
        word: "Ready",
        detail: `${subject} is ready to edit. ${unchanged}`
    };
    if (state === "queued") return {
        tone: "agent",
        word: "Queued",
        detail: `${subject} is queued. ${unchanged}`
    };
    if (state === "running") return {
        tone: "agent",
        word: "Working",
        detail: `${subject} is being prepared. ${unchanged}`
    };
    if (state === "failed") return {
        tone: "failure",
        word: "Failed",
        detail: `${subject} was not prepared. The saved action is retained for retry. ${unchanged}`
    };
    if (state === "interrupted") return {
        tone: "failure",
        word: "Interrupted",
        detail: `${subject} preparation was interrupted. The saved action is retained for retry. ${unchanged}`
    };
    return {
        tone: "attention",
        word: "Pending",
        detail: `${subject} has status “${state}”. ${unchanged}`
    };
}
function handoffActions(handoff, actorId) {
    const state = handoff.state ?? "pending";
    if (state === "pending" && handoff.recipient.person_id === actorId) return [
        "accept",
        "decline"
    ];
    if (state === "pending" && handoff.sender.person_id === actorId) return [
        "withdraw"
    ];
    if (state === "accepted" && handoff.recipient.person_id === actorId && !handoff.return_handoff_id) return [
        "return"
    ];
    return [];
}
function splitOpenQuestions(value) {
    return value.split("\n").map((item)=>item.trim()).filter(Boolean);
}
function newActionKey(prefix) {
    return `${prefix}:${crypto.randomUUID()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/watchApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actOnReviewPacket",
    ()=>actOnReviewPacket,
    "activateWatch",
    ()=>activateWatch,
    "answerWatch",
    ()=>answerWatch,
    "askBriefingItem",
    ()=>askBriefingItem,
    "connectBriefingItem",
    ()=>connectBriefingItem,
    "createDigest",
    ()=>createDigest,
    "createMatterMitigation",
    ()=>createMatterMitigation,
    "createSavedView",
    ()=>createSavedView,
    "createSavedViewDigest",
    ()=>createSavedViewDigest,
    "createWatchDraft",
    ()=>createWatchDraft,
    "deleteSavedView",
    ()=>deleteSavedView,
    "getBriefingConversation",
    ()=>getBriefingConversation,
    "getBriefingItem",
    ()=>getBriefingItem,
    "getBriefingItems",
    ()=>getBriefingItems,
    "getDigest",
    ()=>getDigest,
    "getDigests",
    ()=>getDigests,
    "getIntelligenceSources",
    ()=>getIntelligenceSources,
    "getMatterMitigations",
    ()=>getMatterMitigations,
    "getProviderCapabilities",
    ()=>getProviderCapabilities,
    "getReviewPacket",
    ()=>getReviewPacket,
    "getReviewPackets",
    ()=>getReviewPackets,
    "getSavedViews",
    ()=>getSavedViews,
    "getWatch",
    ()=>getWatch,
    "getWatchRuns",
    ()=>getWatchRuns,
    "getWatches",
    ()=>getWatches,
    "listBriefingItems",
    ()=>listBriefingItems,
    "listDigests",
    ()=>listDigests,
    "listMatterMitigations",
    ()=>listMatterMitigations,
    "listReviewPackets",
    ()=>listReviewPackets,
    "listSavedViews",
    ()=>listSavedViews,
    "listWatchRuns",
    ()=>listWatchRuns,
    "listWatches",
    ()=>listWatches,
    "patchBriefingItem",
    ()=>patchBriefingItem,
    "pauseWatch",
    ()=>pauseWatch,
    "recordReviewAction",
    ()=>recordReviewAction,
    "researchBriefingItem",
    ()=>researchBriefingItem,
    "scanWatch",
    ()=>scanWatch,
    "scheduleDigest",
    ()=>scheduleDigest,
    "scheduleSavedViewDigest",
    ()=>scheduleSavedViewDigest,
    "triageBriefingItem",
    ()=>triageBriefingItem,
    "updateMatterMitigation",
    ()=>updateMatterMitigation,
    "updateSavedView",
    ()=>updateSavedView,
    "updateWatch",
    ()=>updateWatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
function withQuery(path, values) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)){
        if (value === undefined || value === null || value === "") continue;
        if (Array.isArray(value)) {
            for (const item of value)params.append(key, String(item));
        } else {
            params.set(key, String(value));
        }
    }
    const query = params.toString();
    return query ? `${path}?${query}` : path;
}
function briefingPath(query) {
    return withQuery("/briefing/items", {
        ...query
    });
}
function getProviderCapabilities() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/intelligence/providers");
}
function getIntelligenceSources() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/intelligence/sources");
}
function getWatches(options = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery("/watches", options));
}
function createWatchDraft(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/watches/drafts", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function getWatch(watchId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}`);
}
function updateWatch(watchId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}
function answerWatch(watchId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}/answers`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function scanWatch(watchId, payload = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}/scan`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function activateWatch(watchId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}/activate`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function pauseWatch(watchId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/watches/${encodeURIComponent(watchId)}/pause`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function getWatchRuns(watchId, options = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery(`/watches/${encodeURIComponent(watchId)}/runs`, options));
}
function getBriefingItems(query = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(briefingPath(query));
}
function getBriefingItem(itemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}`);
}
function getBriefingConversation(itemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}/conversation`);
}
function triageBriefingItem(itemId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}
function askBriefingItem(itemId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}/ask`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function researchBriefingItem(itemId, payload = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}/research`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function connectBriefingItem(itemId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/items/${encodeURIComponent(itemId)}/connect`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function getSavedViews(options = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery("/briefing/views", options));
}
function createSavedView(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])("/briefing/views", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function updateSavedView(viewId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/views/${encodeURIComponent(viewId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}
function deleteSavedView(viewId, expectedRevision) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery(`/briefing/views/${encodeURIComponent(viewId)}`, {
        expected_revision: expectedRevision
    }), {
        method: "DELETE"
    });
}
function createSavedViewDigest(viewId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/views/${encodeURIComponent(viewId)}/digest`, {
        method: "POST"
    });
}
function scheduleSavedViewDigest(viewId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/views/${encodeURIComponent(viewId)}/schedule`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}
function getDigests(options = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery("/briefing/digests", options));
}
function getDigest(digestId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/briefing/digests/${encodeURIComponent(digestId)}`);
}
function getReviewPackets(options = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(withQuery("/review-packets", options));
}
function getReviewPacket(packetId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/review-packets/${encodeURIComponent(packetId)}`);
}
function actOnReviewPacket(packetId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/review-packets/${encodeURIComponent(packetId)}/actions`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function getMatterMitigations(matterId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/matters/${encodeURIComponent(matterId)}/mitigations`);
}
function createMatterMitigation(matterId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/matters/${encodeURIComponent(matterId)}/mitigations`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
function updateMatterMitigation(matterId, mitigationId, payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/matters/${encodeURIComponent(matterId)}/mitigations/${encodeURIComponent(mitigationId)}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
}
const listWatches = getWatches;
const listWatchRuns = getWatchRuns;
const listBriefingItems = getBriefingItems;
const patchBriefingItem = triageBriefingItem;
const listSavedViews = getSavedViews;
const createDigest = createSavedViewDigest;
const scheduleDigest = scheduleSavedViewDigest;
const listDigests = getDigests;
const listReviewPackets = getReviewPackets;
const recordReviewAction = actOnReviewPacket;
const listMatterMitigations = getMatterMitigations;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/workspaceApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actOnQuestionProposal",
    ()=>actOnQuestionProposal,
    "actOnSolutionPath",
    ()=>actOnSolutionPath,
    "adoptWorkspaceScenario",
    ()=>adoptWorkspaceScenario,
    "analyzeWorkspaceScenario",
    ()=>analyzeWorkspaceScenario,
    "answerWorkspaceQuestion",
    ()=>answerWorkspaceQuestion,
    "changeBusinessQuestion",
    ()=>changeBusinessQuestion,
    "documentForEditorHref",
    ()=>documentForEditorHref,
    "documentForReferenceTarget",
    ()=>documentForReferenceTarget,
    "getDecisionMap",
    ()=>getDecisionMap,
    "getProblemAnalysis",
    ()=>getProblemAnalysis,
    "getQuestionHistory",
    ()=>getQuestionHistory,
    "getSolutionPaths",
    ()=>getSolutionPaths,
    "getWorkspace",
    ()=>getWorkspace,
    "getWorkspaceDocuments",
    ()=>getWorkspaceDocuments,
    "getWorkspaceFlow",
    ()=>getWorkspaceFlow,
    "getWorkspaceScenario",
    ()=>getWorkspaceScenario,
    "getWorkspaceScenarios",
    ()=>getWorkspaceScenarios,
    "invalidateReferenceResult",
    ()=>invalidateReferenceResult,
    "latestReferenceResult",
    ()=>latestReferenceResult,
    "markWorkspaceSeen",
    ()=>markWorkspaceSeen,
    "normalizeDocumentReferenceTarget",
    ()=>normalizeDocumentReferenceTarget,
    "preferredConversationId",
    ()=>preferredConversationId,
    "proposeBusinessQuestion",
    ()=>proposeBusinessQuestion,
    "recordIssueDisposition",
    ()=>recordIssueDisposition,
    "referenceDestination",
    ()=>referenceDestination,
    "resolveWorkspaceDocument",
    ()=>resolveWorkspaceDocument,
    "restoreBusinessQuestion",
    ()=>restoreBusinessQuestion,
    "runWorkspaceAction",
    ()=>runWorkspaceAction,
    "saveWorkspaceFlow",
    ()=>saveWorkspaceFlow,
    "saveWorkspaceScenario",
    ()=>saveWorkspaceScenario,
    "setWorkspaceContext",
    ()=>setWorkspaceContext,
    "templateCommand",
    ()=>templateCommand,
    "updateWorkspaceIssue",
    ()=>updateWorkspaceIssue,
    "workspaceCommand",
    ()=>workspaceCommand
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
const base = (matterId)=>`/matters/${encodeURIComponent(matterId)}/workspace`;
const json = (method, body)=>({
        method,
        body: JSON.stringify(body)
    });
const getWorkspace = (matterId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(base(matterId));
const changeBusinessQuestion = (matterId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/business-question`, json("PATCH", command));
const proposeBusinessQuestion = (matterId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/business-question/proposals`, json("POST", command));
const actOnQuestionProposal = (matterId, proposalId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/business-question/proposals/${encodeURIComponent(proposalId)}`, json("PATCH", command));
const restoreBusinessQuestion = (matterId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/business-question/restore`, json("POST", command));
const getQuestionHistory = (matterId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/business-question/history`);
const updateWorkspaceIssue = (matterId, issueId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/issues/${encodeURIComponent(issueId)}`, json("PATCH", command));
const answerWorkspaceQuestion = (matterId, questionId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/questions/${encodeURIComponent(questionId)}`, json("PATCH", command));
const runWorkspaceAction = (matterId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/actions`, json("POST", command));
const setWorkspaceContext = (matterId, selections, expectedRevision)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/context`, json("PUT", {
        selections,
        expected_revision: expectedRevision
    }));
const markWorkspaceSeen = (matterId, revision)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/seen`, json("POST", {
        expected_revision: revision
    }));
const getWorkspaceScenarios = (matterId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/scenarios`);
const getWorkspaceScenario = (matterId, scenarioId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}`);
const getWorkspaceFlow = (matterId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/flow`);
const saveWorkspaceFlow = (matterId, flow, expectedRevision)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/flow`, json("PATCH", {
        flow,
        expected_revision: expectedRevision
    }));
const recordIssueDisposition = (matterId, issueId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/issues/${encodeURIComponent(issueId)}/disposition`, json("POST", command));
const getDecisionMap = (matterId, issueId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/decision-map${issueId ? `?issue_id=${encodeURIComponent(issueId)}` : ""}`);
const getWorkspaceDocuments = (matterId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/documents`);
function normalizeDocumentReferenceTarget(target) {
    const savedOrigin = target.origin;
    const offset = savedOrigin?.scroll_offset;
    if (!savedOrigin || offset == null || Number.isInteger(offset)) return target;
    return {
        ...target,
        origin: {
            ...savedOrigin,
            scroll_offset: Math.round(offset)
        }
    };
}
async function latestReferenceResult(generation, load) {
    const request = ++generation.current;
    try {
        const result = await load();
        return generation.current === request ? result : null;
    } catch (cause) {
        if (generation.current !== request) return null;
        throw cause;
    }
}
function invalidateReferenceResult(generation) {
    generation.current += 1;
}
function referenceDestination(document) {
    return document.kind === "work_product" ? "editor" : "preview";
}
function documentForReferenceTarget(documents, target) {
    const exact = documents.find((document)=>document.document_id === target.document_id && document.path === target.path && (!target.revision || document.revision === target.revision));
    if (exact) return exact;
    if (target.path) return null;
    return documents.find((document)=>document.document_id === target.document_id) ?? null;
}
function preferredConversationId(conversationIds, requested, intake) {
    const saved = new Set(conversationIds);
    if (requested && saved.has(requested)) return requested;
    return intake && saved.has(intake) ? intake : null;
}
function documentForEditorHref(documents, href, browserOrigin) {
    let decoded = href;
    try {
        decoded = decodeURIComponent(href);
    } catch  {
        return null;
    }
    const relativePath = decoded.replace(/^\.\//, "").replace(/^\//, "");
    const direct = documents.find((document)=>document.path === relativePath);
    if (direct) return direct;
    try {
        const rendered = new URL(href, browserOrigin);
        if (rendered.origin === browserOrigin) {
            const localPath = decodeURIComponent(rendered.pathname).replace(/^\//, "");
            return documents.find((document)=>document.path === localPath) ?? null;
        }
        return documents.find((document)=>{
            try {
                return new URL(`https://${document.path}`).href === rendered.href;
            } catch  {
                return false;
            }
        }) ?? null;
    } catch  {
        return null;
    }
}
const resolveWorkspaceDocument = (matterId, target)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/documents/resolve`, json("POST", normalizeDocumentReferenceTarget(target)));
const saveWorkspaceScenario = (matterId, scenario, title, expectedRevision, sourceActionKey)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/scenarios`, json("POST", {
        scenario: {
            ...scenario,
            title
        },
        expected_revision: expectedRevision,
        source_action_key: sourceActionKey
    }));
const analyzeWorkspaceScenario = (matterId, scenarioId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}/analyze`, json("POST", command));
const adoptWorkspaceScenario = (matterId, scenarioId, command)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/scenarios/${encodeURIComponent(scenarioId)}/adopt`, json("POST", command));
function workspaceCommand(matterId, path, method = "GET", body) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}${path}`, body === undefined ? {
        method
    } : json(method, body));
}
function templateCommand(path = "", method = "GET", body) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`/skills/output-templates${path}`, body === undefined ? {
        method
    } : json(method, body));
}
const getProblemAnalysis = (matterId, reference)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/problem-analysis?reference=${encodeURIComponent(JSON.stringify(reference))}`);
const getSolutionPaths = (matterId, conversationId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/paths${conversationId ? `?conversation_id=${encodeURIComponent(conversationId)}` : ""}`);
const actOnSolutionPath = (matterId, action, values, conversationId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["request"])(`${base(matterId)}/paths/actions`, json("POST", {
        action,
        values,
        conversation_id: conversationId,
        source_action_key: `path:${crypto.randomUUID()}`
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/workspaceDrafting.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceDraftingActionTracker",
    ()=>WorkspaceDraftingActionTracker,
    "canPersistWorkspaceDraftingPreferences",
    ()=>canPersistWorkspaceDraftingPreferences,
    "defaultWorkspaceDraftingPreferences",
    ()=>defaultWorkspaceDraftingPreferences,
    "freezeWorkspaceDocumentAction",
    ()=>freezeWorkspaceDocumentAction,
    "isFrozenWorkspaceDocumentActionCurrent",
    ()=>isFrozenWorkspaceDocumentActionCurrent,
    "matchingLocalEditorSnapshot",
    ()=>matchingLocalEditorSnapshot,
    "newWorkspaceDraftActionKey",
    ()=>newWorkspaceDraftActionKey,
    "normalizeWorkspaceDraftingPreferences",
    ()=>normalizeWorkspaceDraftingPreferences,
    "readWorkspaceDraftingPreferences",
    ()=>readWorkspaceDraftingPreferences,
    "restoredOutputTemplate",
    ()=>restoredOutputTemplate,
    "reusableWorkspaceDraftActionKey",
    ()=>reusableWorkspaceDraftActionKey,
    "shouldOpenCompletedDraft",
    ()=>shouldOpenCompletedDraft,
    "workspaceDraftRequestFingerprint",
    ()=>workspaceDraftRequestFingerprint,
    "workspaceDraftingStorageKey",
    ()=>workspaceDraftingStorageKey,
    "writeWorkspaceDraftingPreferences",
    ()=>writeWorkspaceDraftingPreferences
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
const STORAGE_PREFIX = "themis:workspace-drafting:";
function workspaceDraftingStorageKey(matterId) {
    const scoped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentContinuityStorageKey"])(matterId, "view");
    if (scoped) return scoped;
    return `${STORAGE_PREFIX}${encodeURIComponent(matterId)}`;
}
function defaultWorkspaceDraftingPreferences() {
    return {
        version: 1,
        view: "understand",
        activeArtifactPath: null,
        selectedTemplateId: null,
        instruction: "",
        overrides: {},
        sourceActionKey: null,
        sourceActionFingerprint: null
    };
}
function isWorkspaceView(value) {
    return value === "understand" || value === "discuss" || value === "draft";
}
function stringOrNull(value) {
    return typeof value === "string" && value.trim() ? value : null;
}
function stringMap(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter((entry)=>typeof entry[1] === "string"));
}
function normalizeWorkspaceDraftingPreferences(value) {
    const fallback = defaultWorkspaceDraftingPreferences();
    if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
    const saved = value;
    return {
        version: 1,
        view: isWorkspaceView(saved.view) ? saved.view : fallback.view,
        activeArtifactPath: stringOrNull(saved.activeArtifactPath),
        selectedTemplateId: stringOrNull(saved.selectedTemplateId),
        instruction: typeof saved.instruction === "string" ? saved.instruction : "",
        overrides: stringMap(saved.overrides),
        sourceActionKey: stringOrNull(saved.sourceActionKey),
        sourceActionFingerprint: stringOrNull(saved.sourceActionFingerprint)
    };
}
function readWorkspaceDraftingPreferences(storage, matterId) {
    try {
        const raw = storage.getItem(workspaceDraftingStorageKey(matterId));
        return raw ? normalizeWorkspaceDraftingPreferences(JSON.parse(raw)) : defaultWorkspaceDraftingPreferences();
    } catch  {
        return defaultWorkspaceDraftingPreferences();
    }
}
function writeWorkspaceDraftingPreferences(storage, matterId, preferences) {
    storage.setItem(workspaceDraftingStorageKey(matterId), JSON.stringify(normalizeWorkspaceDraftingPreferences(preferences)));
}
function newWorkspaceDraftActionKey(matterId, now = Date.now(), random = Math.random()) {
    return `draft:${encodeURIComponent(matterId)}:${now.toString(36)}:${Math.floor(random * 0x100000).toString(36)}`;
}
function shouldOpenCompletedDraft(currentArtifactPath, submittedArtifactPath) {
    return currentArtifactPath === submittedArtifactPath;
}
function matchingLocalEditorSnapshot(targetPath, snapshot, targetDocumentId) {
    if (!snapshot?.dirty || !targetPath || snapshot.path !== targetPath) return null;
    if (targetDocumentId && snapshot.document_id !== targetDocumentId) return null;
    return snapshot;
}
function freezeWorkspaceDocumentAction(matterId, documentId, path, revision, reviewRevision) {
    return {
        matterId,
        documentId,
        path,
        revision,
        reviewRevision
    };
}
function isFrozenWorkspaceDocumentActionCurrent(frozen, matterId, documentId, path, revision) {
    return frozen.matterId === matterId && frozen.documentId === documentId && frozen.path === path && frozen.revision === revision;
}
function canPersistWorkspaceDraftingPreferences(hydratedMatterId, matterId) {
    return hydratedMatterId === matterId;
}
function restoredOutputTemplate(templates, templateId) {
    return templates.find((template)=>template.template_id === templateId) ?? null;
}
function stableValue(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
    const record = value;
    return `{${Object.keys(record).sort().filter((key)=>record[key] !== undefined).map((key)=>`${JSON.stringify(key)}:${stableValue(record[key])}`).join(",")}}`;
}
function workspaceDraftRequestFingerprint(request) {
    return stableValue(request);
}
function reusableWorkspaceDraftActionKey(savedKey, savedFingerprint, requestFingerprint, makeKey) {
    return savedKey && savedFingerprint === requestFingerprint ? savedKey : makeKey();
}
class WorkspaceDraftingActionTracker {
    matterId;
    generation = 0;
    constructor(matterId){
        this.matterId = matterId;
    }
    setMatter(matterId) {
        if (this.matterId === matterId) return;
        this.matterId = matterId;
        this.generation += 1;
    }
    begin() {
        this.generation += 1;
        return {
            matterId: this.matterId,
            generation: this.generation
        };
    }
    isCurrent(token) {
        return token.matterId === this.matterId && token.generation === this.generation;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_0xjv625._.js.map