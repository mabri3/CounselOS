(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/matters/[matterId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppShell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DataLoadStatus.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MatterWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MatterWorkspace.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$latestRequest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/latestRequest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workspaceApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workspaceApi.ts [app-client] (ecmascript)");
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
function MatterPage({ params }) {
    _s();
    const { matterId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const requestedView = searchParams.get("view");
    const initialView = requestedView === "understand" || requestedView === "discuss" || requestedView === "draft" ? requestedView : undefined;
    const initialPath = searchParams.get("file");
    const initialIssueId = searchParams.get("issue");
    const requestedConversationId = searchParams.get("conversation");
    const focusResearch = searchParams.get("focus") === "research";
    const [detail, setDetail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [initialConversationId, setInitialConversationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadError, setLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const loadGeneration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const latestMatterLoader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MatterPage.useMemo[latestMatterLoader]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$latestRequest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createLatestRequestLoader"])({
                "MatterPage.useMemo[latestMatterLoader]": ()=>Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMatter"])(matterId),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getConversations"])(matterId)
                    ])
            }["MatterPage.useMemo[latestMatterLoader]"], {
                "MatterPage.useMemo[latestMatterLoader]": ([saved, conversations])=>{
                    setDetail(saved);
                    setInitialConversationId((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workspaceApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["preferredConversationId"])(conversations.conversations.map({
                        "MatterPage.useMemo[latestMatterLoader]": (item)=>item.conversation_id
                    }["MatterPage.useMemo[latestMatterLoader]"]), requestedConversationId, saved.intake_conversation_id));
                    setLoadError("");
                }
            }["MatterPage.useMemo[latestMatterLoader]"], {
                "MatterPage.useMemo[latestMatterLoader]": ()=>setLoadError("This matter is unavailable because its current data could not be loaded.")
            }["MatterPage.useMemo[latestMatterLoader]"])
    }["MatterPage.useMemo[latestMatterLoader]"], [
        matterId,
        requestedConversationId
    ]);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatterPage.useCallback[load]": async ()=>{
            const generation = ++loadGeneration.current;
            setLoading(true);
            setLoadError("");
            try {
                await latestMatterLoader();
            } finally{
                if (generation === loadGeneration.current) setLoading(false);
            }
        }
    }["MatterPage.useCallback[load]"], [
        latestMatterLoader
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatterPage.useEffect": ()=>{
            setDetail(null);
            void load().catch({
                "MatterPage.useEffect": ()=>{}
            }["MatterPage.useEffect"]);
        }
    }["MatterPage.useEffect"], [
        load
    ]);
    if (!detail) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "page",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    error: loadError,
                    loading: loading,
                    loadingLabel: "Orienting to the matter…",
                    onRetry: load
                }, void 0, false, {
                    fileName: "[project]/app/matters/[matterId]/page.tsx",
                    lineNumber: 53,
                    columnNumber: 45
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/matters/[matterId]/page.tsx",
                lineNumber: 53,
                columnNumber: 22
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/matters/[matterId]/page.tsx",
            lineNumber: 53,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "0 28px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    error: loadError,
                    loading: loading,
                    loadingLabel: "Refreshing the matter…",
                    onRetry: load
                }, void 0, false, {
                    fileName: "[project]/app/matters/[matterId]/page.tsx",
                    lineNumber: 57,
                    columnNumber: 42
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/matters/[matterId]/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MatterWorkspace$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                initialView: initialView,
                detail: detail,
                focusResearch: focusResearch,
                initialConversationId: initialConversationId,
                initialIssueId: initialIssueId,
                initialPath: initialPath,
                onReload: load
            }, void 0, false, {
                fileName: "[project]/app/matters/[matterId]/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/matters/[matterId]/page.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(MatterPage, "AkUIF83h3J3c/jdS8AeJ4i0W80E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = MatterPage;
var _c;
__turbopack_context__.k.register(_c, "MatterPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_matters_%5BmatterId%5D_page_tsx_0a1hv9v._.js.map