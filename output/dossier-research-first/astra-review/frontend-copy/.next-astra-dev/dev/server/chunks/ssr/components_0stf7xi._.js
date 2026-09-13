module.exports = [
"[project]/components/AppShell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalNavigationMenu",
    ()=>GlobalNavigationMenu,
    "default",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$continuityApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/continuityApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$DemoLawyerSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/DemoLawyerSwitcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/Phase2Shell.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Phase2Icon.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const primaryLinks = [
    {
        href: "/",
        label: "Today"
    },
    {
        href: "/briefing",
        label: "Briefing"
    },
    {
        href: "/workspace",
        label: "Workspace"
    },
    {
        href: "/matters",
        label: "Matters"
    },
    {
        href: "/decisions",
        label: "Decisions"
    },
    {
        href: "/skills",
        label: "Skills"
    },
    {
        href: "/experimental/chat",
        label: "Experimental chat"
    },
    {
        href: "/automations",
        label: "Automations"
    }
];
const adminLinks = [
    {
        href: "/agents",
        label: "Agents"
    },
    {
        href: "/settings",
        label: "Settings"
    }
];
function linkIsActive(href, pathname) {
    if (href === "/") return pathname === "/";
    if (href === "/briefing") return pathname.startsWith("/briefing") || pathname.startsWith("/watches");
    return pathname.startsWith(href);
}
function NavLinks({ links, pathname, phase2 = false }) {
    return links.map((link)=>{
        const active = linkIsActive(link.href, pathname);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            "aria-current": active ? "page" : undefined,
            className: phase2 ? `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].link} ${active ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}` : `nav-link ${active ? "active" : ""}`,
            href: link.href,
            children: [
                phase2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Icon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    name: link.label
                }, void 0, false, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 37,
                    columnNumber: 19
                }, this) : null,
                link.label
            ]
        }, link.href, true, {
            fileName: "[project]/components/AppShell.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, this);
    });
}
function GlobalNavigationMenu({ children, className, pathname }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
        className: `matter-a-global-nav${className ? ` ${className}` : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                children: [
                    "themis.ai",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: "⌄"
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 47,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppShell.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Main navigation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavLinks, {
                        links: [
                            ...primaryLinks,
                            ...adminLinks
                        ],
                        pathname: pathname
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppShell.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppShell.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
function AppShell({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { identity, switchPerson } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$continuityApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContinuityIdentity"])();
    const isResearch = /^\/matters\/[^/]+\/research\/?$/.test(pathname);
    const isMatter = /^\/matters\/[^/]+/.test(pathname) && !isResearch && pathname !== "/matters/storage";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `app-shell${isMatter ? " app-shell--matter-a" : ` ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].root}`}`,
        children: [
            isMatter ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "matter-a-brandbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobalNavigationMenu, {
                    pathname: pathname,
                    children: identity?.roster.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$DemoLawyerSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        roster: identity.roster,
                        actor: identity.actor,
                        onSwitch: switchPerson
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 63,
                        columnNumber: 127
                    }, this) : null
                }, void 0, false, {
                    fileName: "[project]/components/AppShell.tsx",
                    lineNumber: 63,
                    columnNumber: 57
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AppShell.tsx",
                lineNumber: 63,
                columnNumber: 19
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brand,
                        href: "/",
                        children: "themis.ai"
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        "aria-label": "Main navigation",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NavLinks, {
                            links: [
                                ...primaryLinks,
                                ...adminLinks
                            ],
                            pathname: pathname,
                            phase2: true
                        }, void 0, false, {
                            fileName: "[project]/components/AppShell.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    identity?.roster.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Phase2Shell$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].identity,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                children: "View as"
                            }, void 0, false, {
                                fileName: "[project]/components/AppShell.tsx",
                                lineNumber: 68,
                                columnNumber: 74
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$DemoLawyerSwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    roster: identity.roster,
                                    actor: identity.actor,
                                    onSwitch: switchPerson
                                }, void 0, false, {
                                    fileName: "[project]/components/AppShell.tsx",
                                    lineNumber: 68,
                                    columnNumber: 105
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/AppShell.tsx",
                                lineNumber: 68,
                                columnNumber: 100
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 68,
                        columnNumber: 37
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "avatar",
                        children: identity?.actor.display_name.slice(0, 2) || ""
                    }, void 0, false, {
                        fileName: "[project]/components/AppShell.tsx",
                        lineNumber: 68,
                        columnNumber: 218
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppShell.tsx",
                lineNumber: 63,
                columnNumber: 264
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppShell.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/AttachmentPicker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AttachmentPicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AttachmentPicker({ disabled, onSelect }) {
    const fileInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    function selected(event) {
        const files = Array.from(event.target.files ?? []);
        if (files.length) void onSelect(files);
        event.target.value = "";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "attachment-picker",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "aria-label": "Add files",
                className: "composer-plus",
                disabled: disabled,
                onClick: (event)=>{
                    fileInput.current?.click();
                },
                title: "Add files",
                type: "button",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/components/AttachmentPicker.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                accept: ".md,.txt,.pdf,.docx",
                hidden: true,
                multiple: true,
                onChange: selected,
                ref: fileInput,
                type: "file"
            }, void 0, false, {
                fileName: "[project]/components/AttachmentPicker.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AttachmentPicker.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ChatCards.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceReceiptCards",
    ()=>WorkspaceReceiptCards,
    "default",
    ()=>ChatCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ResearchScopeChoice.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DossierResearchCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatCardLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chatCardLogic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatRunLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chatRunLogic.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ChatCards({ cards = [], matterId, disabled, questionsDisabled, questionStates, questionMode = "guided", showQuestionMode = false, onQuestionModeChange, onAction, onOpenDocument, onRefresh, currentWorkProductDraftPath, showResearchDocuments = false, operationResults = [], activeConversationId, onConversationRefresh, onPrepareFollowUp }) {
    const questions = cards.filter((card)=>card.type === "question");
    const activeQuestions = questions.filter((card)=>(questionStates?.[card.question_id]?.state ?? "active") === "active");
    const historicalQuestions = questions.filter((card)=>(questionStates?.[card.question_id]?.state ?? "active") !== "active");
    const otherCards = cards.filter((card)=>card.type !== "question" && !(card.type === "matter_update" && card.action_id.startsWith("intake-") && card.summary === "Matter updated"));
    const visibleOperationResults = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatRunLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["visibleOperationResults"])(operationResults);
    return cards.length || visibleOperationResults.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "chat-cards",
        children: [
            visibleOperationResults.map((result, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OperationResultCard, {
                    disabled: disabled,
                    onAction: onAction,
                    onOpenDocument: onOpenDocument,
                    result: result
                }, `${result.action}-${result.operation}-${index}`, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 49,
                    columnNumber: 55
                }, this)),
            historicalQuestions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "chat-card question-card intake-audit-history",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: [
                            "Intake audit history (",
                            historicalQuestions.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 50,
                        columnNumber: 103
                    }, this),
                    historicalQuestions.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionHistoryCard, {
                            card: card,
                            status: questionStates[card.question_id]
                        }, card.question_id, false, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 50,
                            columnNumber: 208
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 50,
                columnNumber: 37
            }, this) : null,
            activeQuestions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionSequence, {
                cards: activeQuestions,
                disabled: disabled || questionsDisabled,
                mode: showQuestionMode ? questionMode : "guided",
                onAction: onAction,
                onModeChange: showQuestionMode ? onQuestionModeChange : undefined,
                showModeControl: showQuestionMode && !questionsDisabled
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 51,
                columnNumber: 33
            }, this) : null,
            otherCards.map((card, index)=>{
                const key = card.type === "matter_update" ? card.action_id : card.type === "research_status" ? card.run_id : card.type === "dossier_research" ? card.request_id : "vault_path" in card ? `${card.vault_path}-${index}` : `card-${index}`;
                if (card.type === "matter_update") return null;
                if (card.type === "research_status") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ResearchCard, {
                    card: card,
                    matterId: matterId,
                    onRefresh: onRefresh,
                    onOpenDocument: showResearchDocuments ? onOpenDocument : undefined
                }, key, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 58,
                    columnNumber: 53
                }, this);
                if (card.type === "dossier_research") {
                    const origin = card.status && typeof card.status === "object" && !Array.isArray(card.status) ? card.status.origin?.conversation_id : undefined;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        activeConversationId: activeConversationId ?? origin,
                        card: card,
                        disabled: disabled,
                        onConversationRefresh: onConversationRefresh ?? (async ()=>{
                            await onRefresh?.();
                        }),
                        onOpenDocument: onOpenDocument,
                        onPrepareFollowUp: onPrepareFollowUp ?? ((text)=>window.dispatchEvent(new CustomEvent("themis-dossier-follow-up", {
                                detail: {
                                    matterId: card.matter_id,
                                    conversationId: origin,
                                    text
                                }
                            })))
                    }, key, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 61,
                        columnNumber: 18
                    }, this);
                }
                if (card.type === "watch_draft") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WatchCard, {
                    card: card,
                    disabled: disabled,
                    onAction: onAction
                }, key, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 63,
                    columnNumber: 49
                }, this);
                if (card.type === "watch_scan") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WatchCard, {
                    card: card,
                    disabled: disabled,
                    onAction: onAction
                }, key, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 64,
                    columnNumber: 48
                }, this);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkProductCard, {
                    card: card,
                    currentWorkProductDraftPath: currentWorkProductDraftPath,
                    onOpenDocument: onOpenDocument
                }, key, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 65,
                    columnNumber: 16
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this) : null;
}
function OperationResultCard({ disabled, onAction, onOpenDocument, result }) {
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [disposition, setDisposition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [researchScope, setResearchScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        external: result.proposal?.external === true,
        other_matters: result.proposal?.other_matters === true,
        public_query: String(result.proposal?.public_query ?? ""),
        provider_ids: Array.isArray(result.proposal?.provider_ids) ? result.proposal.provider_ids.map(String) : [],
        native: result.proposal?.native === true,
        allow_firecrawl: false,
        allow_followup_queries: result.proposal?.allow_followup_queries === true
    });
    const researchConfirmation = result.operation === "run_research";
    const recorded = result.status === "changed";
    const needsConfirmation = result.status === "confirmation_required" || result.status === "proposed";
    const failed = result.status === "failed";
    const protectedWriteFailure = failed && result.operation === "write_markdown" && /protected|typed tool/i.test(result.error ?? "");
    const decisionConfirmation = needsConfirmation && result.operation === "record_decision";
    const reasonRequired = disposition === "modified" || disposition === "not_followed";
    const changedRecords = recorded ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatRunLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["operationChangeLinks"])(result.changed_paths) : [];
    async function confirm() {
        if (!needsConfirmation || decisionConfirmation && (!disposition || reasonRequired && !reason.trim())) return;
        setBusy(true);
        setError("");
        try {
            await onAction({
                card_id: `operation-result:${result.action}`,
                action: "apply",
                values: researchConfirmation ? [
                    researchScope.external ? "yes" : "no",
                    researchScope.other_matters ? "yes" : "no",
                    researchScope.public_query,
                    researchScope.native ? "yes" : "no",
                    researchScope.allow_firecrawl ? "yes" : "no",
                    researchScope.allow_followup_queries ? "yes" : "no"
                ] : decisionConfirmation ? [
                    disposition,
                    reason.trim()
                ] : []
            }, decisionConfirmation ? "Record this decision with the selected recommendation disposition." : operationActionLabel(result.operation));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The workspace action did not complete.");
        } finally{
            setBusy(false);
        }
    }
    const label = recorded ? "Recorded" : needsConfirmation ? "Confirmation required" : failed ? "Failed" : "No change";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `chat-card ${failed ? "wash-failure" : needsConfirmation ? "wash-attention" : recorded ? "wash-healthy" : ""}`,
        children: [
            !(researchConfirmation && needsConfirmation) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-kicker",
                children: [
                    "Workspace action · ",
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 124,
                columnNumber: 56
            }, this),
            !(researchConfirmation && needsConfirmation) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-summary",
                children: protectedWriteFailure ? "Use the matching workspace action for this record." : result.status === "no_change" ? "No workspace change recorded" : result.summary
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 125,
                columnNumber: 56
            }, this),
            changedRecords.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: [
                    "Updated records: ",
                    changedRecords.map((record)=>record.label).join(" · ")
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 126,
                columnNumber: 32
            }, this) : null,
            result.required_user_action && !(researchConfirmation && needsConfirmation) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: result.required_user_action
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 127,
                columnNumber: 86
            }, this) : null,
            protectedWriteFailure ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: "Use Save work product, Run research, Stop research, or the matching direct control."
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 128,
                columnNumber: 32
            }, this) : result.recovery && (failed || result.status === "no_change") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: result.recovery
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 128,
                columnNumber: 221
            }, this) : null,
            failed && result.error && !protectedWriteFailure ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: result.error
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 129,
                columnNumber: 59
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error chat-card-detail",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 130,
                columnNumber: 16
            }, this) : null,
            researchConfirmation && needsConfirmation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResearchScopeFields"], {
                    compact: true,
                    value: researchScope,
                    onChange: setResearchScope,
                    disabled: disabled || busy,
                    options: {
                        provider_ids: researchScope.provider_ids,
                        native_available: result.proposal?.native_available === true,
                        firecrawl_available: result.proposal?.firecrawl_available === true,
                        model_selection: result.proposal?.collector_model_selection ?? result.proposal?.model_selection,
                        main_model_selection: result.proposal?.main_model_selection,
                        allow_followup_queries: typeof result.proposal?.allow_followup_queries === "boolean" ? result.proposal.allow_followup_queries : undefined,
                        cost_notice: String(result.proposal?.cost_notice ?? "External search may incur provider charges. No price estimate is available."),
                        sensitivity_notice: String(result.proposal?.sensitivity_notice ?? "Other matters may contain sensitive information.")
                    }
                }, void 0, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 131,
                columnNumber: 53
            }, this),
            decisionConfirmation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Recommendation disposition",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                disabled: disabled || busy,
                                onChange: (event)=>setDisposition(event.target.value),
                                value: disposition,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select one"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "followed",
                                        children: "Followed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "modified",
                                        children: "Modified"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "not_followed",
                                        children: "Not followed"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "not_applicable",
                                        children: "Not applicable"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    reasonRequired ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Short reason",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                disabled: disabled || busy,
                                onChange: (event)=>setReason(event.target.value),
                                value: reason
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 153,
                        columnNumber: 27
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 143,
                columnNumber: 31
            }, this) : null,
            needsConfirmation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-actions",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn primary compact",
                    disabled: disabled || busy || researchConfirmation && researchScope.external && !researchScope.public_query.trim() || decisionConfirmation && (!disposition || reasonRequired && !reason.trim()),
                    onClick: ()=>void confirm(),
                    type: "button",
                    children: busy ? researchConfirmation ? "Starting…" : "Recording…" : operationActionLabel(result.operation)
                }, void 0, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 157,
                    columnNumber: 63
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 157,
                columnNumber: 28
            }, this) : null,
            recorded && onOpenDocument && changedRecords.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-actions",
                children: changedRecords.map((record)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        onClick: ()=>onOpenDocument(record.path),
                        type: "button",
                        children: [
                            "Open ",
                            record.label
                        ]
                    }, record.path, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 159,
                        columnNumber: 41
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 158,
                columnNumber: 62
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
function operationActionLabel(operation) {
    const labels = {
        run_research: "Continue",
        approve_response: "Approve response",
        mark_response_sent: "Record manual delivery",
        mark_as_sent: "Record manual delivery",
        close_matter: "Close matter",
        record_decision: "Record decision"
    };
    return labels[operation] ?? "Confirm action";
}
function WatchCard({ card, disabled, onAction }) {
    const [activeAction, setActiveAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const pending = card.status === "pending" || activeAction !== null;
    const status = activeAction ? watchActionPendingLabel(activeAction) : watchStatusLabel(card.status);
    async function runAction(action) {
        setActiveAction(action);
        try {
            await onAction({
                card_id: card.card_id,
                action,
                values: [
                    card.watch_id
                ]
            });
        } finally{
            setActiveAction(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `chat-card ${card.status === "partial" ? "wash-attention" : pending ? "wash-agent" : card.status === "failed" ? "wash-failure" : ""}`,
        "aria-busy": pending,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-kicker",
                children: [
                    card.type === "watch_draft" ? "Watch draft" : "Scan now",
                    " · ",
                    status
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-summary",
                children: card.title
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            card.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: card.summary
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 199,
                columnNumber: 23
            }, this) : null,
            card.status === "partial" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Partial result."
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 200,
                        columnNumber: 70
                    }, this),
                    " Useful results are available, but part of the scan did not complete."
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 200,
                columnNumber: 36
            }, this) : null,
            card.warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                role: "status",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: card.warnings.length === 1 ? "Warning" : "Warnings"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: card.warnings.map((warning, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: warning
                            }, `${card.card_id}-warning-${index}`, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 205,
                                columnNumber: 52
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 202,
                columnNumber: 9
            }, this) : null,
            card.type === "watch_draft" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: "This Watch is a draft. Scan now runs it once. Only Start Watch activates its schedule."
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 210,
                columnNumber: 9
            }, this) : null,
            card.allowed_actions.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-actions",
                children: card.allowed_actions.map((action)=>{
                    if (action === "open_watch" || action === "open_scan") {
                        const href = action === "open_scan" && card.type === "watch_scan" ? card.scan_url : card.watch_url;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            className: "btn tiny quiet",
                            href: href,
                            children: watchActionLabel(action)
                        }, action, false, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 219,
                            columnNumber: 22
                        }, this);
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `btn ${action === "start_watch" ? "primary compact" : "tiny quiet"}`,
                        disabled: disabled || pending,
                        onClick: ()=>void runAction(action),
                        children: activeAction === action ? watchActionPendingLabel(action) : watchActionLabel(action)
                    }, action, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 222,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
function watchActionLabel(action) {
    const labels = {
        save_draft: "Save draft",
        scan_now: "Scan now",
        change_something: "Change something",
        start_watch: "Start Watch",
        open_watch: "Open Watch",
        open_scan: "Open scan",
        scan_again: "Scan again"
    };
    return labels[action] ?? action;
}
function watchStatusLabel(status) {
    return ({
        pending: "Pending",
        partial: "Partial",
        success: "Ready",
        failed: "Failed"
    })[status];
}
function watchActionPendingLabel(action) {
    if (action === "scan_now" || action === "scan_again") return "Scanning…";
    if (action === "start_watch") return "Starting…";
    if (action === "save_draft") return "Saving…";
    return "Updating…";
}
function WorkProductCard({ card, onOpenDocument, currentWorkProductDraftPath }) {
    const targetPath = card.vault_path;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "chat-card work-product-card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-kicker",
                children: [
                    "Work Product · ",
                    card.preview ? "Preview · Not kept" : card.state === "final" ? "Final" : "Draft"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-summary",
                children: card.title
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            card.summary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: card.summary
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 273,
                columnNumber: 23
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-actions",
                children: onOpenDocument ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn tiny quiet",
                    onClick: ()=>onOpenDocument(targetPath),
                    type: "button",
                    children: "Open artifact"
                }, void 0, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 275,
                    columnNumber: 27
                }, this) : null
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 270,
        columnNumber: 5
    }, this);
}
const EMPTY_DRAFT = {
    selected: [],
    freeText: "",
    selectedDetail: ""
};
function QuestionHistoryCard({ card, status }) {
    const labels = status.values.map((value)=>card.choices.find((choice)=>choice.value === value)?.label ?? value).filter((value, index, values)=>value && values.indexOf(value) === index);
    const stateLabel = status.state === "answered" ? "Answered" : status.state === "stopped" ? "Stopped" : status.state === "superseded" ? "Superseded" : "Earlier question";
    const detail = status.state === "answered" ? labels.join(" · ") || "Answer saved" : status.state === "stopped" ? "Intake stopped before this question was answered." : status.state === "superseded" ? "This question was skipped or replaced by later intake work." : "This question is part of the earlier intake history.";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "chat-card question-card",
        "aria-label": `${stateLabel}: ${card.text}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-meta",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: stateLabel
                }, void 0, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 302,
                    columnNumber: 38
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-summary",
                children: card.text
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-detail",
                children: detail
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 301,
        columnNumber: 5
    }, this);
}
function QuestionSequence({ cards, disabled, mode, onModeChange, onAction, showModeControl }) {
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [drafts, setDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const current = cards[Math.min(currentIndex, cards.length - 1)];
    const draft = drafts[current.question_id] ?? EMPTY_DRAFT;
    function updateDraft(next) {
        setDrafts((saved)=>({
                ...saved,
                [current.question_id]: next
            }));
    }
    async function submitSet(nextAnswers, stopAfterAnswers = false) {
        const answeredQuestions = cards.filter((question)=>nextAnswers[question.question_id]);
        if (!answeredQuestions.length) {
            await onAction({
                card_id: current.question_id,
                action: stopAfterAnswers ? "stop" : "skip"
            });
            return;
        }
        await onAction({
            card_id: `intake-set:${answeredQuestions.map((question)=>question.question_id).join(":")}`,
            action: "answer_set",
            answers: answeredQuestions.map((question)=>({
                    card_id: question.question_id,
                    action: nextAnswers[question.question_id].action,
                    values: nextAnswers[question.question_id].values
                }))
        }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatCardLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["groupedAnswerText"])(answeredQuestions, nextAnswers, stopAfterAnswers));
    }
    async function handleQuestionAction(action, answerText) {
        if (action.action === "stop") {
            if (mode === "set" && Object.keys(answers).length) await submitSet(answers, true);
            else await onAction(action, answerText);
            return;
        }
        if (action.action !== "answer" && action.action !== "skip") return;
        const savedAnswer = {
            action: action.action,
            values: action.values ?? [],
            text: answerText ?? ""
        };
        const nextAnswers = {
            ...answers,
            [current.question_id]: savedAnswer
        };
        if (mode === "guided") {
            if (Object.keys(answers).length) await submitSet(nextAnswers);
            else await onAction(action, answerText);
            return;
        }
        setAnswers(nextAnswers);
        if (currentIndex < cards.length - 1) setCurrentIndex((index)=>index + 1);
        else await submitSet(nextAnswers);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "question-sequence",
        children: [
            showModeControl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-mode-control",
                children: [
                    cards.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Answer one question at a time, or choose Answer a set to send this prioritized group together."
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 372,
                        columnNumber: 29
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Question style"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: mode === "guided" ? "Discuss each answer before the next question." : `Answer this prioritized set of ${cards.length}, then send it together.`
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 373,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "question-mode-options",
                        role: "group",
                        "aria-label": "Question style",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-pressed": mode === "guided",
                                className: mode === "guided" ? "active" : "",
                                disabled: disabled,
                                onClick: ()=>onModeChange?.("guided"),
                                type: "button",
                                children: "Guided"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-pressed": mode === "set",
                                className: mode === "set" ? "active" : "",
                                disabled: disabled,
                                onClick: ()=>onModeChange?.("set"),
                                type: "button",
                                children: "Answer a set"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 371,
                columnNumber: 26
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionCard, {
                card: current,
                current: mode === "set" ? currentIndex + 1 : undefined,
                disabled: disabled,
                draft: draft,
                onAction: handleQuestionAction,
                onBack: mode === "set" && currentIndex > 0 ? ()=>setCurrentIndex((index)=>index - 1) : undefined,
                onDraftChange: updateDraft,
                primaryLabel: mode === "set" ? currentIndex === cards.length - 1 ? "Send answers" : "Next" : "Send answer",
                total: mode === "set" ? cards.length : undefined
            }, current.question_id, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 382,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 370,
        columnNumber: 5
    }, this);
}
function QuestionCard({ card, current, disabled, draft, onAction, onBack, onDraftChange, primaryLabel, total }) {
    const { selected, freeText, selectedDetail } = draft;
    const progress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatCardLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["questionProgressLabel"])(card.progress_current, card.progress_total);
    const mode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatCardLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectiveQuestionMode"])(card.selection_mode, card.choices.length);
    function answer(values, text) {
        const cleanValues = values.map((value)=>value.trim()).filter(Boolean);
        if (!cleanValues.length || disabled) return;
        void onAction({
            card_id: card.question_id,
            action: "answer",
            values: cleanValues
        }, text);
    }
    function freeTextKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            answer([
                freeText.trim()
            ], freeText.trim());
        }
    }
    const selectedChoices = card.choices.filter((choice)=>selected.includes(choice.value));
    const selectedChoice = selectedChoices[0];
    const detailRequired = selectedChoices.some((choice)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatCardLogic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["choiceNeedsDetail"])(choice.value, choice.label));
    function submitSelection() {
        if (!selectedChoice || detailRequired && !selectedDetail.trim()) return;
        const detail = selectedDetail.trim();
        answer(detail ? [
            selectedChoice.value,
            detail
        ] : [
            selectedChoice.value
        ], detail ? `${selectedChoice.label}: ${detail}` : selectedChoice.label);
    }
    function submitMultiple() {
        if (!selected.length || detailRequired && !selectedDetail.trim()) return;
        const detail = selectedDetail.trim();
        const labels = selectedChoices.map((choice)=>choice.label);
        answer(detail ? [
            ...selected,
            detail
        ] : selected, detail ? `${labels.join(", ")}: ${detail}` : labels.join(", "));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `chat-card question-card ${card.conflict ? "conflict" : ""}`,
        "aria-labelledby": `question-${card.question_id}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-meta",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: current && total ? `${current} of ${total} · Priority order` : progress === "Follow-up" ? "Follow-up question" : progress
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 451,
                        columnNumber: 38
                    }, this),
                    card.conflict ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Factual conflict"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 451,
                        columnNumber: 191
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-title-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-card-summary",
                        id: `question-${card.question_id}`,
                        children: card.text
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 453,
                        columnNumber: 9
                    }, this),
                    card.reason ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                        className: "reason-control",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                "aria-label": "Why this question is useful",
                                children: "i"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 456,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                role: "note",
                                children: card.reason
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 457,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 455,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, this),
            mode === "free_text" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-free-text",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        "aria-label": "Answer",
                        className: "text-input",
                        disabled: disabled,
                        onChange: (event)=>onDraftChange({
                                ...draft,
                                freeText: event.target.value
                            }),
                        onKeyDown: freeTextKeyDown,
                        value: freeText
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 464,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: disabled || !freeText.trim(),
                        onClick: ()=>answer([
                                freeText.trim()
                            ], freeText.trim()),
                        children: primaryLabel
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 465,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 463,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                className: "question-choices",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                        className: "sr-only",
                        children: card.text
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 469,
                        columnNumber: 11
                    }, this),
                    card.choices.map((choice)=>{
                        const active = selected.includes(choice.value);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: `question-choice ${active ? "active" : ""}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    checked: active,
                                    disabled: disabled,
                                    name: `question-${card.question_id}`,
                                    onChange: ()=>{
                                        if (mode === "single") onDraftChange({
                                            ...draft,
                                            selected: [
                                                choice.value
                                            ],
                                            selectedDetail: ""
                                        });
                                        else onDraftChange({
                                            ...draft,
                                            selected: active ? selected.filter((value)=>value !== choice.value) : [
                                                ...selected,
                                                choice.value
                                            ]
                                        });
                                    },
                                    type: mode === "single" ? "radio" : "checkbox",
                                    value: choice.value
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatCards.tsx",
                                    lineNumber: 474,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: choice.label
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatCards.tsx",
                                    lineNumber: 485,
                                    columnNumber: 17
                                }, this),
                                choice.suggested ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "suggested-label",
                                    children: "Suggested"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatCards.tsx",
                                    lineNumber: 485,
                                    columnNumber: 64
                                }, this) : null
                            ]
                        }, choice.value, true, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 473,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 468,
                columnNumber: 9
            }, this),
            mode !== "free_text" && detailRequired ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-free-text",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    "aria-label": `Add detail for ${selectedChoice?.label ?? "this choice"}`,
                    autoFocus: true,
                    className: "text-input",
                    disabled: disabled,
                    onChange: (event)=>onDraftChange({
                            ...draft,
                            selectedDetail: event.target.value
                        }),
                    onKeyDown: (event)=>{
                        if (event.key === "Enter" && !event.shiftKey && selectedDetail.trim()) {
                            event.preventDefault();
                            if (mode === "multiple") submitMultiple();
                            else submitSelection();
                        }
                    },
                    placeholder: "Add a short clarification",
                    value: selectedDetail
                }, void 0, false, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 494,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 493,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-actions",
                children: [
                    onBack ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled,
                        onClick: onBack,
                        children: "Back"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 514,
                        columnNumber: 19
                    }, this) : null,
                    mode === "single" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: disabled || !selected.length || detailRequired && !selectedDetail.trim(),
                        onClick: submitSelection,
                        children: primaryLabel
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 515,
                        columnNumber: 30
                    }, this) : null,
                    mode === "multiple" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: disabled || !selected.length || detailRequired && !selectedDetail.trim(),
                        onClick: submitMultiple,
                        children: primaryLabel
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 516,
                        columnNumber: 32
                    }, this) : null,
                    card.allow_skip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled,
                        onClick: ()=>void onAction({
                                card_id: card.question_id,
                                action: "skip"
                            }),
                        children: "Skip"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 517,
                        columnNumber: 28
                    }, this) : null,
                    card.allow_stop ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled,
                        onClick: ()=>void onAction({
                                card_id: card.question_id,
                                action: "stop"
                            }),
                        children: "Finish intake"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 518,
                        columnNumber: 28
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 513,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 450,
        columnNumber: 5
    }, this);
}
function ResearchCard({ card, matterId, onRefresh, onOpenDocument }) {
    const [run, setRun] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(card);
    const refreshedRunId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const onRefreshRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onRefresh);
    onRefreshRef.current = onRefresh;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!matterId) return;
        let cancelled = false;
        let timer;
        const check = ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResearchRun"])(matterId, card.run_id).then(async (next)=>{
                if (cancelled) return;
                setRun(next);
                if ([
                    "queued",
                    "running"
                ].includes(next.state)) {
                    timer = window.setTimeout(check, 2000);
                } else if (refreshedRunId.current !== `${next.run_id}:${next.state}:${next.publication?.state ?? "legacy"}`) {
                    refreshedRunId.current = `${next.run_id}:${next.state}:${next.publication?.state ?? "legacy"}`;
                    await onRefreshRef.current?.();
                }
            }).catch(()=>undefined);
        check();
        return ()=>{
            cancelled = true;
            window.clearInterval(timer);
        };
    }, [
        card.run_id,
        matterId
    ]);
    const active = run.state === "queued" || run.state === "running";
    const partial = run.publication?.state === "partial" || run.state === "completed" && /^Partial\b/i.test(run.status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "chat-card research-card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `research-indicator ${active ? "active" : ""}`,
                                style: partial ? {
                                    background: "var(--attention)"
                                } : run.state === "failed" ? {
                                    background: "var(--failure)"
                                } : undefined,
                                "aria-hidden": "true"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 552,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "chat-card-kicker",
                                        children: [
                                            "First-pass research · ",
                                            partial ? "Partial" : ({
                                                queued: "Queued",
                                                running: "Working",
                                                completed: "Completed",
                                                failed: "Failed",
                                                interrupted: "Interrupted"
                                            })[run.state]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 553,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "chat-card-summary",
                                        children: run.status
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 553,
                                        columnNumber: 224
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 553,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "research-progress",
                                children: [
                                    run.completed,
                                    "/",
                                    run.total
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatCards.tsx",
                                lineNumber: 554,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 551,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "chat-card-detail",
                        children: run.dossier_effect || "No dossier change is recorded yet."
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 556,
                        columnNumber: 7
                    }, this),
                    run.main_selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Main analysis: ",
                            run.main_selection.provider,
                            " · ",
                            run.main_selection.model
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 557,
                        columnNumber: 30
                    }, this),
                    run.collector_selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Collection: ",
                            run.collector_selection.provider,
                            " · ",
                            run.collector_selection.model
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 558,
                        columnNumber: 35
                    }, this),
                    run.publication && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Answer publication: ",
                            run.publication.state,
                            ". ",
                            run.publication.warnings?.join(" ")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 559,
                        columnNumber: 27
                    }, this),
                    run.state === "interrupted" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "An unfinished provider call may be charged again on explicit retry. Completed calls are reused."
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 560,
                        columnNumber: 39
                    }, this),
                    !run.main_selection && run.selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Legacy research model: ",
                            run.selection.provider,
                            " · ",
                            run.selection.model,
                            " · ",
                            run.selection.reasoning_effort || "default",
                            " effort"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 561,
                        columnNumber: 48
                    }, this),
                    "results" in run && run.results?.map((result, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                result.research_warnings?.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: warning
                                    }, warning, false, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 563,
                                        columnNumber: 51
                                    }, this)),
                                result.provider_legs?.map((leg, legIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            leg.provider,
                                            ": ",
                                            leg.status,
                                            leg.url ? ` · ${leg.url}` : ""
                                        ]
                                    }, legIndex, true, {
                                        fileName: "[project]/components/ChatCards.tsx",
                                        lineNumber: 564,
                                        columnNumber: 55
                                    }, this))
                            ]
                        }, index, true, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 562,
                            columnNumber: 64
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 550,
                columnNumber: 5
            }, this),
            onOpenDocument && "results" in run && run.results?.filter((result)=>result.path).map((result, index, results)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "btn small",
                    type: "button",
                    onClick: ()=>onOpenDocument(result.path),
                    children: [
                        "Open research",
                        results.length > 1 ? ` ${index + 1}` : "",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            "aria-hidden": "true",
                            children: "→"
                        }, void 0, false, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 569,
                            columnNumber: 66
                        }, this)
                    ]
                }, result.path, true, {
                    fileName: "[project]/components/ChatCards.tsx",
                    lineNumber: 568,
                    columnNumber: 7
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 549,
        columnNumber: 5
    }, this);
}
function WorkspaceReceiptCards({ receipts = [], onOpenDocument }) {
    const direct = receipts.filter((receipt)=>!receipt.source_message_id);
    if (!direct.length) return null;
    const labels = {
        change_business_question: "Business question saved",
        propose_business_question: "Question reframe proposed",
        apply_question_proposal: "Question proposal applied",
        reject_question_proposal: "Question proposal rejected",
        restore_business_question: "Previous question restored as a new version",
        answer_question: "Supporting question updated"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        "aria-label": "Saved workspace activity",
        children: direct.map((receipt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `chat-card ${receipt.state === "not_saved" ? "wash-failure" : receipt.state === "proposed" ? "wash-agent" : "wash-healthy"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: receipt.state === "not_saved" ? (receipt.completed_parts ?? []).includes("reported_fact") ? "Fact saved. Question update not saved." : "Change not saved" : labels[receipt.operation] ?? "Workspace change saved"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 591,
                        columnNumber: 7
                    }, this),
                    receipt.created_at ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: new Date(receipt.created_at).toLocaleString()
                    }, void 0, false, {
                        fileName: "[project]/components/ChatCards.tsx",
                        lineNumber: 592,
                        columnNumber: 29
                    }, this) : null,
                    (receipt.changed_links ?? []).slice(0, 1).map((path)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn tiny quiet",
                            type: "button",
                            onClick: ()=>onOpenDocument?.(path),
                            children: "Open saved record"
                        }, path, false, {
                            fileName: "[project]/components/ChatCards.tsx",
                            lineNumber: 593,
                            columnNumber: 62
                        }, this))
                ]
            }, receipt.receipt_id, true, {
                fileName: "[project]/components/ChatCards.tsx",
                lineNumber: 590,
                columnNumber: 28
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/ChatCards.tsx",
        lineNumber: 589,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/CommentRail.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommentRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function CommentRail({ comments, lawyerAuthorId, busy, onAction, onCollapse, onOpenThread }) {
    const [replyTo, setReplyTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editBody, setEditBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const confirmRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const confirmTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pendingDelete, setPendingDelete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (replyTo) inputRef.current?.focus();
    }, [
        replyTo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pendingDelete) confirmRef.current?.focus();
    }, [
        pendingDelete
    ]);
    const resolved = comments.filter((thread)=>thread.resolved);
    const open = comments.filter((thread)=>!thread.resolved);
    function canEdit(authorId) {
        return authorId === lawyerAuthorId && authorId !== "author-themis" && !authorId.startsWith("author-imported");
    }
    function requestDelete(pending, trigger) {
        confirmTriggerRef.current = trigger;
        setPendingDelete(pending);
    }
    function closeDelete() {
        setPendingDelete(null);
        const trigger = confirmTriggerRef.current;
        confirmTriggerRef.current = null;
        requestAnimationFrame(()=>trigger?.focus());
    }
    async function confirmDelete() {
        if (!pendingDelete) return;
        const action = pendingDelete.kind === "thread" ? {
            action: "delete_comment_thread",
            thread_id: pendingDelete.threadId
        } : {
            action: "delete_resolved_comments"
        };
        await onAction(action);
        closeDelete();
    }
    function renderThread(thread) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
            className: `comment-thread ${thread.resolved ? "resolved" : ""}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "comment-anchor-button",
                    onClick: (event)=>onOpenThread(thread.thread_id, event.currentTarget),
                    type: "button",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                        children: thread.quote
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 25,
                        columnNumber: 136
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/CommentRail.tsx",
                    lineNumber: 25,
                    columnNumber: 7
                }, this),
                thread.entries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comment-entry",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: entry.author_name
                            }, void 0, false, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 27,
                                columnNumber: 9
                            }, this),
                            editing === entry.comment_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "comment-reply",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        autoFocus: true,
                                        "aria-label": "Edit comment",
                                        className: "text-input",
                                        onChange: (event)=>setEditBody(event.target.value),
                                        onKeyDown: (event)=>{
                                            if (event.key === "Escape") {
                                                setEditing(null);
                                                setEditBody("");
                                            }
                                        },
                                        value: editBody
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommentRail.tsx",
                                        lineNumber: 27,
                                        columnNumber: 108
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn primary tiny",
                                        disabled: !editBody.trim() || busy,
                                        onClick: async ()=>{
                                            await onAction({
                                                action: "edit_comment",
                                                thread_id: thread.thread_id,
                                                comment_id: entry.comment_id,
                                                body: editBody.trim()
                                            });
                                            setEditing(null);
                                            setEditBody("");
                                        },
                                        type: "button",
                                        children: "Save"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommentRail.tsx",
                                        lineNumber: 27,
                                        columnNumber: 340
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 27,
                                columnNumber: 77
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: entry.body
                            }, void 0, false, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 27,
                                columnNumber: 636
                            }, this),
                            canEdit(entry.author_id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "btn-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet tiny",
                                        disabled: busy,
                                        onClick: ()=>{
                                            setEditing(entry.comment_id);
                                            setEditBody(entry.body);
                                        },
                                        type: "button",
                                        children: "Edit"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommentRail.tsx",
                                        lineNumber: 28,
                                        columnNumber: 62
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet tiny",
                                        disabled: busy,
                                        onClick: ()=>void onAction({
                                                action: "delete_comment_entry",
                                                thread_id: thread.thread_id,
                                                comment_id: entry.comment_id
                                            }),
                                        type: "button",
                                        children: "Delete"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CommentRail.tsx",
                                        lineNumber: 28,
                                        columnNumber: 215
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 28,
                                columnNumber: 37
                            }, this) : null
                        ]
                    }, entry.comment_id, true, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 26,
                        columnNumber: 38
                    }, this)),
                replyTo === thread.thread_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "comment-reply",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: inputRef,
                            "aria-label": "Reply",
                            className: "text-input",
                            onKeyDown: (event)=>{
                                if (event.key === "Escape") {
                                    setReplyTo(null);
                                    setBody("");
                                }
                            },
                            onChange: (event)=>setBody(event.target.value),
                            value: body
                        }, void 0, false, {
                            fileName: "[project]/components/CommentRail.tsx",
                            lineNumber: 30,
                            columnNumber: 70
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn primary tiny",
                            disabled: !body.trim() || busy,
                            onClick: async ()=>{
                                await onAction({
                                    action: "reply_comment",
                                    thread_id: thread.thread_id,
                                    body: body.trim()
                                });
                                setReplyTo(null);
                                setBody("");
                            },
                            type: "button",
                            children: "Reply"
                        }, void 0, false, {
                            fileName: "[project]/components/CommentRail.tsx",
                            lineNumber: 30,
                            columnNumber: 289
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CommentRail.tsx",
                    lineNumber: 30,
                    columnNumber: 39
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "comment-thread-actions",
                    children: [
                        !thread.resolved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn tiny",
                                    onClick: ()=>setReplyTo(thread.thread_id),
                                    type: "button",
                                    children: "Reply"
                                }, void 0, false, {
                                    fileName: "[project]/components/CommentRail.tsx",
                                    lineNumber: 31,
                                    columnNumber: 69
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn tiny",
                                    disabled: busy,
                                    onClick: ()=>void onAction({
                                            action: "resolve_comment",
                                            thread_id: thread.thread_id
                                        }),
                                    type: "button",
                                    children: "Resolve thread"
                                }, void 0, false, {
                                    fileName: "[project]/components/CommentRail.tsx",
                                    lineNumber: 31,
                                    columnNumber: 171
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CommentRail.tsx",
                            lineNumber: 31,
                            columnNumber: 67
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn tiny",
                            disabled: busy,
                            onClick: ()=>void onAction({
                                    action: "reopen_comment",
                                    thread_id: thread.thread_id
                                }),
                            type: "button",
                            children: "Reopen thread"
                        }, void 0, false, {
                            fileName: "[project]/components/CommentRail.tsx",
                            lineNumber: 31,
                            columnNumber: 349
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn quiet tiny",
                            disabled: busy,
                            onClick: (event)=>requestDelete({
                                    kind: "thread",
                                    threadId: thread.thread_id
                                }, event.currentTarget),
                            type: "button",
                            children: "Delete thread permanently…"
                        }, void 0, false, {
                            fileName: "[project]/components/CommentRail.tsx",
                            lineNumber: 31,
                            columnNumber: 520
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CommentRail.tsx",
                    lineNumber: 31,
                    columnNumber: 7
                }, this),
                thread.resolved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "comment-note",
                    children: "Comment resolved. It remains available under Resolved comments."
                }, void 0, false, {
                    fileName: "[project]/components/CommentRail.tsx",
                    lineNumber: 32,
                    columnNumber: 26
                }, this) : null
            ]
        }, thread.thread_id, true, {
            fileName: "[project]/components/CommentRail.tsx",
            lineNumber: 24,
            columnNumber: 5
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "comment-rail",
        "aria-label": "Document comments",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "comment-rail-head",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Comments"
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 37,
                        columnNumber: 42
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            comments.filter((item)=>!item.resolved).length,
                            " open"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 37,
                        columnNumber: 67
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": "Hide comments",
                        className: "pane-collapse",
                        onClick: onCollapse,
                        title: "Hide comments",
                        type: "button",
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 37,
                        columnNumber: 135
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommentRail.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            open.map(renderThread),
            resolved.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                className: "resolved-comments",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: [
                            "Resolved comments (",
                            resolved.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 39,
                        columnNumber: 65
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Resolved comments remain with this document until you delete them."
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 39,
                        columnNumber: 121
                    }, this),
                    resolved.map(renderThread),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn quiet tiny",
                        disabled: busy,
                        onClick: (event)=>requestDelete({
                                kind: "resolved"
                            }, event.currentTarget),
                        type: "button",
                        children: "Delete all resolved threads…"
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 39,
                        columnNumber: 222
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommentRail.tsx",
                lineNumber: 39,
                columnNumber: 26
            }, this) : null,
            pendingDelete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-describedby": "comment-delete-description",
                "aria-labelledby": "comment-delete-title",
                className: "comment-popover",
                onKeyDown: (event)=>{
                    if (event.key === "Escape") {
                        event.preventDefault();
                        closeDelete();
                    }
                },
                role: "alertdialog",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        id: "comment-delete-title",
                        children: "Confirm permanent deletion"
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        id: "comment-delete-description",
                        children: pendingDelete.kind === "thread" ? "Delete this comment thread permanently? Its content cannot be recovered." : "Delete all resolved comment threads permanently? Their content cannot be recovered."
                    }, void 0, false, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                disabled: busy,
                                onClick: closeDelete,
                                type: "button",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 43,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn primary",
                                disabled: busy,
                                onClick: ()=>void confirmDelete(),
                                ref: confirmRef,
                                type: "button",
                                children: pendingDelete.kind === "thread" ? "Delete thread permanently" : "Delete all resolved threads"
                            }, void 0, false, {
                                fileName: "[project]/components/CommentRail.tsx",
                                lineNumber: 43,
                                columnNumber: 125
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CommentRail.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CommentRail.tsx",
                lineNumber: 40,
                columnNumber: 24
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/CommentRail.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ConfirmationDialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConfirmationDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function ConfirmationDialog({ title, description, confirmLabel, onCancel, onConfirm }) {
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const titleId = "confirmation-dialog-title";
    const descriptionId = "confirmation-dialog-description";
    async function confirm() {
        if (busy) return;
        setBusy(true);
        setError("");
        try {
            await onConfirm();
            onCancel();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not complete this action. Try again.");
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-scrim",
        onClick: (event)=>{
            if (!busy && event.target === event.currentTarget) onCancel();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "aria-describedby": descriptionId,
            "aria-labelledby": titleId,
            "aria-modal": "true",
            className: "modal",
            onKeyDown: (event)=>{
                if (!busy && event.key === "Escape") onCancel();
            },
            role: "alertdialog",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            id: titleId,
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationDialog.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            id: descriptionId,
                            children: description
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationDialog.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmationDialog.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-foot",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "error",
                                role: "alert",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/components/ConfirmationDialog.tsx",
                                lineNumber: 55,
                                columnNumber: 26
                            }, this) : null
                        }, void 0, false, {
                            fileName: "[project]/components/ConfirmationDialog.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "btn-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn",
                                    disabled: busy,
                                    onClick: onCancel,
                                    type: "button",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationDialog.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    autoFocus: true,
                                    className: "btn primary",
                                    disabled: busy,
                                    onClick: ()=>void confirm(),
                                    type: "button",
                                    children: busy ? "Working…" : confirmLabel
                                }, void 0, false, {
                                    fileName: "[project]/components/ConfirmationDialog.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ConfirmationDialog.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ConfirmationDialog.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ConfirmationDialog.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ConfirmationDialog.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/DataLoadStatus.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DataLoadStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function DataLoadStatus({ error, loading, loadingLabel, onRetry, retryingLabel = "Retrying…" }) {
    const [retrying, setRetrying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const busy = loading || retrying;
    if (!busy && !error) return null;
    async function retry() {
        setRetrying(true);
        try {
            await onRetry();
        } catch  {
        // The parent owns and announces the request error.
        } finally{
            setRetrying(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-atomic": "true",
        "aria-busy": busy,
        "aria-live": "polite",
        className: error && !busy ? "error data-load-status" : "loading data-load-status",
        role: "status",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: retrying ? retryingLabel : loading ? loadingLabel : error
            }, void 0, false, {
                fileName: "[project]/components/DataLoadStatus.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            error && !busy ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn tiny quiet",
                onClick: ()=>void retry(),
                type: "button",
                children: "Retry"
            }, void 0, false, {
                fileName: "[project]/components/DataLoadStatus.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/DataLoadStatus.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/DecisionsPhase2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "choice": "DecisionsPhase2-module__7FSYgq__choice",
  "columns": "DecisionsPhase2-module__7FSYgq__columns",
  "controls": "DecisionsPhase2-module__7FSYgq__controls",
  "errorMessage": "DecisionsPhase2-module__7FSYgq__errorMessage",
  "footnote": "DecisionsPhase2-module__7FSYgq__footnote",
  "formActions": "DecisionsPhase2-module__7FSYgq__formActions",
  "header": "DecisionsPhase2-module__7FSYgq__header",
  "mitigation": "DecisionsPhase2-module__7FSYgq__mitigation",
  "packet": "DecisionsPhase2-module__7FSYgq__packet",
  "packetActions": "DecisionsPhase2-module__7FSYgq__packetActions",
  "packetAgentLabel": "DecisionsPhase2-module__7FSYgq__packetAgentLabel",
  "packetEmpty": "DecisionsPhase2-module__7FSYgq__packetEmpty",
  "packetForm": "DecisionsPhase2-module__7FSYgq__packetForm",
  "packetHeader": "DecisionsPhase2-module__7FSYgq__packetHeader",
  "packetList": "DecisionsPhase2-module__7FSYgq__packetList",
  "packetMeta": "DecisionsPhase2-module__7FSYgq__packetMeta",
  "packetReading": "DecisionsPhase2-module__7FSYgq__packetReading",
  "packetSection": "DecisionsPhase2-module__7FSYgq__packetSection",
  "packetSectionLabel": "DecisionsPhase2-module__7FSYgq__packetSectionLabel",
  "packets": "DecisionsPhase2-module__7FSYgq__packets",
  "page": "DecisionsPhase2-module__7FSYgq__page",
  "recommendations": "DecisionsPhase2-module__7FSYgq__recommendations",
  "register": "DecisionsPhase2-module__7FSYgq__register",
  "sources": "DecisionsPhase2-module__7FSYgq__sources",
  "successMessage": "DecisionsPhase2-module__7FSYgq__successMessage",
});
}),
"[project]/components/DocumentPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DocumentPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DocumentReview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DocumentReview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LinkifiedText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MarkdownRichEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/MarkdownRichEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/documentNavigation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$research$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/research.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reviewAuthor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/documentSave.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterDocuments$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterDocuments.module.css [app-ssr] (css module)");
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
function DocumentPanel({ autoSave = false, activeDocument, activePath, contextKey, humanActor, refreshSignal = 0, localEdit, actionTargetDocumentId, referenceTarget, documents = [], onSnapshot, onSaved, onUpload, onAskAgent, onOpenReference, onClose, onCollapse, activeReviewAuthor, lawyerAuthor, onReviewAuthorChange }) {
    const [document, setDocument] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [review, setReview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("editing");
    const [exportMode, setExportMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("markup");
    const [dirty, setDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveState, setSaveState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("clean");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editorVersion, setEditorVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const cachedEdits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const mutationBases = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const loadVersion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const reviewRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    reviewRef.current = review;
    const [savedChangesAvailable, setSavedChangesAvailable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRange, setSelectedRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const defaultedHumanAuthor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const documentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    documentRef.current = document;
    const activeIdentity = activeDocument ?? (activePath ? {
        document_id: activePath,
        path: activePath,
        title: activePath.split("/").at(-1) || activePath,
        kind: "work_product",
        revision: "",
        lifecycle_state: "editing_draft",
        editable: true,
        immutable: false
    } : null);
    const activeIdentityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(activeIdentity);
    activeIdentityRef.current = activeIdentity;
    const editingAuthorId = humanActor?.person_id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorId"])(activeReviewAuthor);
    const editingAuthorName = humanActor?.display_name ?? activeReviewAuthor;
    const lawyerAuthorId = humanActor?.person_id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorId"])(lawyerAuthor);
    function basisFor(identity, savedReview) {
        return mutationBases.current.get((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentVersionKey"])(identity)) ?? {
            base_revision: savedReview?.artifact_revision || identity.revision,
            review_revision: savedReview?.revision ?? undefined
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const lawyer = lawyerAuthor.trim();
        if (defaultedHumanAuthor.current || !lawyer) return;
        defaultedHumanAuthor.current = true;
        if (!activeReviewAuthor.trim() || [
            "Themis",
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GENERATED_REVIEW_AUTHOR"]
        ].includes(activeReviewAuthor)) {
            onReviewAuthorChange(lawyer);
        }
    }, [
        activeReviewAuthor,
        lawyerAuthor,
        onReviewAuthorChange
    ]);
    function rememberDocument(savedDocument, savedReview, isDirty, range, recoverable = false, frozenIdentity = activeIdentityRef.current) {
        const identity = frozenIdentity;
        const cacheKey = identity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentVersionKey"])(identity) : savedDocument.path;
        cachedEdits.current.set(cacheKey, {
            document: savedDocument,
            review: savedReview,
            dirty: isDirty,
            range
        });
        if (identity && !isDirty) mutationBases.current.set(cacheKey, {
            base_revision: savedReview?.artifact_revision || identity.revision,
            review_revision: savedReview?.revision ?? undefined
        });
        if (!contextKey || !identity || identity.path !== savedDocument.path) return;
        const basis = basisFor(identity, savedReview);
        const snapshot = {
            document_id: identity.document_id,
            path: identity.path,
            content: savedDocument.content,
            base_revision: basis.base_revision,
            review_revision: basis.review_revision,
            dirty: isDirty,
            selected_range: range,
            recoverable,
            updated_at: new Date().toISOString()
        };
        if (isDirty) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writeLocalEditorSnapshot"])(localStorage, contextKey, snapshot);
        else {
            const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readLocalEditorSnapshot"])(localStorage, contextKey, identity.document_id);
            if (stored?.path === identity.path) (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["discardLocalEditorSnapshot"])(localStorage, contextKey, identity.document_id);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!document) return;
        const identity = activeIdentityRef.current;
        if (!identity || identity.path !== document.path) return;
        rememberDocument(document, review, dirty, selectedRange);
        const basis = basisFor(identity, review);
        onSnapshot?.({
            document_id: identity.document_id,
            path: identity.path,
            content: document.content,
            base_revision: basis.base_revision,
            review_revision: basis.review_revision,
            dirty,
            selected_range: selectedRange,
            recoverable: false,
            updated_at: new Date().toISOString()
        });
    }, [
        document,
        review,
        dirty,
        selectedRange,
        onSnapshot,
        activeDocument?.document_id,
        activeDocument?.path,
        activeDocument?.revision
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let current = true;
        const version = ++loadVersion.current;
        setSavedChangesAvailable(false);
        if (!activePath) {
            setDocument(null);
            return;
        }
        const identity = activeIdentityRef.current;
        const cacheKey = identity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentVersionKey"])(identity) : activePath;
        const recoveredSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapshotForDocument"])(identity, localEdit) ?? (contextKey && identity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapshotForDocument"])(identity, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readLocalEditorSnapshot"])(localStorage, contextKey, identity.document_id)) : null);
        const cached = cachedEdits.current.get(cacheKey);
        if (cached?.dirty) {
            setDocument(cached.document);
            setReview(cached.review);
            setDirty(true);
            setSelectedRange(cached.range);
        }
        if (!cached?.dirty && recoveredSnapshot) {
            setDocument(null);
            setDirty(true);
            setSelectedRange(recoveredSnapshot.selected_range);
        }
        if (!cached?.dirty) {
            setDocument(null);
            setReview(null);
            setBusy(true);
        }
        setError("");
        void loadDocument(activePath).then(({ result, reviewState })=>{
            if (!current || version !== loadVersion.current) return;
            const latestIdentity = activeIdentityRef.current;
            const newer = cachedEdits.current.get(cacheKey) || cached;
            if (newer?.dirty) {
                const localBasis = latestIdentity ? basisFor(latestIdentity, newer.review) : {
                    base_revision: newer.review?.artifact_revision ?? "",
                    review_revision: newer.review?.revision
                };
                setSavedChangesAvailable(localBasis.base_revision !== (reviewState?.artifact_revision || latestIdentity?.revision || "") || localBasis.review_revision !== reviewState?.revision);
                return;
            }
            const restored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapshotForDocument"])(latestIdentity, recoveredSnapshot);
            if (restored) {
                const localDocument = {
                    ...result,
                    content: restored.content
                };
                const restoredBasis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mutationBasisForSnapshot"])(restored);
                mutationBases.current.set(cacheKey, {
                    base_revision: restoredBasis.expected_revision,
                    review_revision: restoredBasis.expected_review_revision
                });
                cachedEdits.current.set(cacheKey, {
                    document: localDocument,
                    review: reviewState,
                    dirty: true,
                    range: restored.selected_range
                });
                setDocument(localDocument);
                setReview(reviewState);
                setDirty(true);
                setSelectedRange(restored.selected_range);
                setSavedChangesAvailable(Boolean(restored.base_revision && restored.base_revision !== (reviewState?.artifact_revision || latestIdentity?.revision)) || Boolean(restored.review_revision && restored.review_revision !== reviewState?.revision));
                setSaveState("clean");
                setMode("editing");
                setEditorVersion((value)=>value + 1);
                return;
            }
            rememberDocument(result, reviewState, false, null);
            setDocument(result);
            setReview(reviewState);
            setDirty(false);
            setSelectedRange(null);
            setSaveState("clean");
            setMode("editing");
            setEditorVersion((value)=>value + 1);
        }).catch((cause)=>{
            if (current && version === loadVersion.current) setError(cause instanceof Error ? cause.message : "Could not load the file.");
        }).finally(()=>{
            if (current && version === loadVersion.current) setBusy(false);
        });
        return ()=>{
            current = false;
            ++loadVersion.current;
        };
    }, [
        activePath,
        activeDocument?.document_id,
        activeDocument?.path,
        activeDocument?.revision,
        refreshSignal,
        contextKey,
        localEdit?.document_id,
        localEdit?.path
    ]);
    async function loadDocument(path) {
        let result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFile"])(path);
        if (result.kind !== "markdown" || path.includes("/documents/") && result.metadata.record_type !== "work_product" && !path.endsWith(".extracted.md")) {
            try {
                const companion = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFile"])(`${path}.extracted.md`);
                const reviewState = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocumentReview"])(companion.path);
                return {
                    result: {
                        ...result,
                        editable: false
                    },
                    reviewState
                };
            } catch  {
            // Original bytes stay visible even when no editable companion is available.
            }
        }
        const reviewState = result.kind === "markdown" && result.editable ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocumentReview"])(result.path) : null;
        if (reviewState && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savedMarkdownMatches"])(result.content, reviewState.segments.filter((segment)=>segment.kind !== "delete").map((segment)=>segment.text).join(""))) {
            throw new Error("The saved file changed while it loaded. Reload to get its latest text and review together.");
        }
        return {
            result,
            reviewState
        };
    }
    async function save() {
        const submittedIdentity = activeIdentityRef.current;
        if (!document || !document.editable || submittedIdentity?.immutable || submittedIdentity?.editable === false) return false;
        const frozenTarget = submittedIdentity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freezeDocumentTarget"])(submittedIdentity) : null;
        const targetIsActive = ()=>frozenTarget ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sameDocumentTarget"])(frozenTarget, activeIdentityRef.current) : documentRef.current?.path === document.path;
        const submitted = {
            ...document,
            metadata: {
                ...document.metadata
            }
        };
        const frozenBasis = submittedIdentity ? basisFor(submittedIdentity, review) : {
            base_revision: review?.artifact_revision ?? "",
            review_revision: review?.revision
        };
        const latestBaseRevision = review?.artifact_revision || submittedIdentity?.revision || "";
        if (frozenBasis.base_revision !== latestBaseRevision || frozenBasis.review_revision !== review?.revision) {
            setSaveState("conflict");
            setDirty(true);
            setError("The saved file changed after this local edit began. Your local text is still here. Reload the saved file only when you are ready to discard or reapply it.");
            return false;
        }
        const basis = {
            expected_revision: frozenBasis.base_revision,
            expected_review_revision: frozenBasis.review_revision
        };
        ++loadVersion.current;
        setBusy(true);
        setSaveState("saving");
        setError("");
        try {
            let nextReview = null;
            if (review?.tracking) {
                const existing = review.authors.find((item)=>item.author_id === editingAuthorId);
                nextReview = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDocumentReview"])(submitted.path, {
                    ...basis,
                    action: "save_revision",
                    content: submitted.content,
                    author_id: editingAuthorId,
                    author_name: editingAuthorName,
                    author_color: existing?.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"][review.authors.length % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"].length]
                });
            } else if (review) nextReview = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDocumentReview"])(submitted.path, {
                ...basis,
                action: "save_untracked",
                content: submitted.content
            });
            else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveFile"])(submitted);
            let canonical;
            try {
                canonical = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFile"])(submitted.path);
            } catch  {
                if (targetIsActive()) {
                    setSaveState("conflict");
                    setDirty(true);
                    setError("The save response returned, but Themis.ai could not verify the saved file. Your local text is still here.");
                }
                return false;
            }
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savedMarkdownMatches"])(submitted.content, canonical.content)) {
                if (targetIsActive()) {
                    setSaveState("conflict");
                    setDirty(true);
                    setError("The saved file differs from this edit. Your local text is still here.");
                }
                return false;
            }
            const current = documentRef.current;
            if (!current || current.path !== submitted.path) {
                const cacheKey = submittedIdentity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentVersionKey"])(submittedIdentity) : submitted.path;
                const cached = cachedEdits.current.get(cacheKey);
                if (cached?.document.content === submitted.content) rememberDocument(canonical, nextReview, false, null, false, submittedIdentity);
                return false;
            }
            if (current?.path === submitted.path && nextReview) {
                reviewRef.current = nextReview;
                setReview(nextReview);
            }
            if (current.content !== submitted.content) {
                if (current?.path === submitted.path) rememberDocument(current, nextReview, true, selectedRange, false, submittedIdentity);
                setSaveState("clean");
                setDirty(true);
                return false;
            }
            rememberDocument(canonical, nextReview, false, null, false, submittedIdentity);
            documentRef.current = canonical;
            setDocument(canonical);
            setDirty(false);
            setSelectedRange(null);
            setSavedChangesAvailable(false);
            setSaveState("clean");
            if (canonical.kind === "markdown" && nextReview) setReview(nextReview);
            setEditorVersion((current)=>current + 1);
            const savedRevision = nextReview?.artifact_revision || (typeof canonical.metadata.revision === "string" ? canonical.metadata.revision : submittedIdentity?.revision);
            if (submittedIdentity && savedRevision && savedRevision !== submittedIdentity.revision) onSaved?.({
                ...submittedIdentity,
                revision: savedRevision
            });
            else onSaved?.();
            return true;
        } catch (caught) {
            if (targetIsActive()) {
                setSaveState("error");
                setDirty(true);
                setError(caught instanceof Error ? caught.message : "Could not save the file.");
            }
            return false;
        } finally{
            setBusy(false);
        }
    }
    // The experimental surface opts in; existing document pages keep manual save.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!autoSave || !dirty || busy || saveState !== "clean" || savedChangesAvailable || !document?.editable) return;
        const timer = window.setTimeout(()=>{
            void save();
        }, 1200);
        return ()=>window.clearTimeout(timer);
    }, [
        autoSave,
        dirty,
        busy,
        saveState,
        savedChangesAvailable,
        document?.content,
        activePath
    ]);
    async function reloadCanonical() {
        if (!document) return;
        if (dirty && !window.confirm("Discard your local changes and load the latest saved file? Copy any text you want to keep before you continue.")) return;
        const submitted = documentRef.current;
        const version = ++loadVersion.current;
        setBusy(true);
        setError("");
        try {
            const loaded = await loadDocument(document.path);
            if (version !== loadVersion.current) return;
            if (documentRef.current !== submitted) {
                setError("Your local text changed while the saved file loaded. It is still here. Reload again when you are ready.");
                return;
            }
            rememberDocument(loaded.result, loaded.reviewState, false, null);
            documentRef.current = loaded.result;
            reviewRef.current = loaded.reviewState;
            setSavedChangesAvailable(false);
            setSelectedRange(null);
            setMode("editing");
            setDocument(loaded.result);
            setReview(loaded.reviewState);
            setDirty(false);
            setSaveState("clean");
            setEditorVersion((current)=>current + 1);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not reload the saved file.");
        } finally{
            setBusy(false);
        }
    }
    function requestClose() {
        if (!onClose) return;
        if (dirty) {
            const identity = activeIdentityRef.current;
            if (document && identity) {
                rememberDocument(document, review, true, selectedRange, true, identity);
                const basis = basisFor(identity, review);
                onSnapshot?.((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recoverableLocalEditorSnapshot"])({
                    document_id: identity.document_id,
                    path: identity.path,
                    content: document.content,
                    base_revision: basis.base_revision,
                    review_revision: basis.review_revision,
                    dirty: true,
                    selected_range: selectedRange
                }));
            }
            setDocument(null);
            onClose();
            return;
        }
        onClose();
    }
    async function reviewAction(action) {
        if (!document) return;
        const requestedDocument = documentRef.current;
        const requestedIdentity = activeIdentityRef.current;
        if (dirty && !await save()) return;
        const submitted = documentRef.current?.path === requestedDocument?.path ? documentRef.current : null;
        const submittedIdentity = requestedIdentity;
        const frozenTarget = submittedIdentity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["freezeDocumentTarget"])(submittedIdentity) : null;
        if (!submitted) return;
        ++loadVersion.current;
        setBusy(true);
        setError("");
        try {
            const actorName = [
                "edit_comment",
                "delete_comment_entry",
                "resolve_comment",
                "reopen_comment",
                "delete_comment_thread",
                "delete_resolved_comments"
            ].includes(action.action) ? lawyerAuthor : activeReviewAuthor;
            const actorId = humanActor?.person_id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorId"])(actorName);
            const actor = review?.authors.find((item)=>item.author_id === actorId);
            const frozenBasis = submittedIdentity ? basisFor(submittedIdentity, reviewRef.current) : {
                base_revision: reviewRef.current?.artifact_revision ?? "",
                review_revision: reviewRef.current?.revision
            };
            const basis = reviewRef.current;
            const nextReview = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDocumentReview"])(submitted.path, {
                ...action,
                expected_revision: frozenBasis.base_revision,
                expected_review_revision: frozenBasis.review_revision,
                author_id: action.author_id ?? actorId,
                author_name: humanActor?.display_name ?? action.author_name ?? actorName,
                author_color: action.author_color ?? actor?.color ?? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"][(review?.authors.length ?? 0) % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"].length]
            });
            const nextDocument = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFile"])(submitted.path);
            const current = documentRef.current;
            if (!current || current.path !== submitted.path) return;
            if (current.content !== submitted.content) {
                // These edits started against the prior review. Keep that base so a
                // later save cannot silently overwrite the completed review action.
                const cacheKey = submittedIdentity ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentVersionKey"])(submittedIdentity) : current.path;
                rememberDocument(current, basis, true, cachedEdits.current.get(cacheKey)?.range ?? null, false, submittedIdentity);
                setDirty(true);
                setSavedChangesAvailable(true);
                setError("Your review action was saved. Your newer local text is still here. Reload the saved file when you are ready to review it.");
                return;
            }
            rememberDocument(nextDocument, nextReview, false, null, false, submittedIdentity);
            documentRef.current = nextDocument;
            reviewRef.current = nextReview;
            setSavedChangesAvailable(false);
            setSelectedRange(null);
            setDocument(nextDocument);
            setReview(nextReview);
            setDirty(false);
            setEditorVersion((current)=>current + 1);
        } catch (caught) {
            if (!frozenTarget || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentNavigation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sameDocumentTarget"])(frozenTarget, activeIdentityRef.current)) {
                setError(caught instanceof Error ? caught.message : "Could not update document review.");
            }
        } finally{
            setBusy(false);
        }
    }
    async function exportDocument(format) {
        if (!document) return;
        const submitted = {
            path: document.path,
            document_id: activeIdentityRef.current?.document_id
        };
        if (dirty && !await save()) return;
        const link = window.document.createElement("a");
        const savedReview = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocumentReview"])(submitted.path);
        link.href = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportFileUrl"])(submitted.path, format, {
            mode: exportMode,
            expected_revision: savedReview.artifact_revision,
            expected_review_revision: savedReview.revision
        });
        link.download = "";
        window.document.body.appendChild(link);
        link.click();
        link.remove();
    }
    async function drop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (!file) return;
        if (document?.editable && activeIdentityRef.current?.editable !== false && !activeIdentityRef.current?.immutable && /\.(md|txt)$/i.test(file.name)) {
            const text = await file.text();
            setDocument({
                ...document,
                content: `${document.content.trimEnd()}\n\n${text}\n`
            });
            setDirty(true);
            return;
        }
        await onUpload(file);
    }
    if (!activePath) return null;
    if (busy && !document) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `doc-pane ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterDocuments$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].panel}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "loading",
            children: "Loading document…"
        }, void 0, false, {
            fileName: "[project]/components/DocumentPanel.tsx",
            lineNumber: 408,
            columnNumber: 77
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/DocumentPanel.tsx",
        lineNumber: 408,
        columnNumber: 33
    }, this);
    if (error && !document) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `doc-pane ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterDocuments$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].panel}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "doc-scroll",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "error",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 409,
                columnNumber: 106
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/DocumentPanel.tsx",
            lineNumber: 409,
            columnNumber: 78
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/DocumentPanel.tsx",
        lineNumber: 409,
        columnNumber: 34
    }, this);
    if (!document) return null;
    const isMarkdown = document.kind === "markdown" || /\.md$/i.test(document.name);
    const canEdit = document.editable && activeIdentity?.editable !== false && !activeIdentity?.immutable;
    const isResearch = isMarkdown && document.path.includes("/research/") && document.name !== "annotations.md";
    const citations = isResearch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$research$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseMemo"])(document).citations : [];
    const agentWritten = /^(research|drafts)\//.test(document.path.split("/").slice(2).join("/")) || String(document.metadata.author ?? "").toLowerCase().includes("agent");
    const sourcePath = typeof document.metadata.source_path === "string" ? document.metadata.source_path : null;
    const saveLabel = saveState === "saving" ? "Saving…" : saveState === "conflict" ? "Save conflict — review" : dirty ? "Unsaved changes" : "Saved";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `doc-pane ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterDocuments$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].panel}`,
        onDragOver: (event)=>event.preventDefault(),
        onDrop: drop,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "doc-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "doc-name",
                                children: [
                                    canEdit ? "Editing: " : "Reading: ",
                                    activeIdentity?.title || document.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 430,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `doc-status ${agentWritten ? "agent" : ""}`,
                                children: activeIdentity?.lifecycle_state === "reading_source" ? "Reading source · Read-only" : activeIdentity?.lifecycle_state === "approved" ? "Approved · Read-only" : activeIdentity?.lifecycle_state === "final" ? "Final · Read-only" : agentWritten ? `Editing draft · Agent work · ${saveLabel.toLowerCase()}` : canEdit ? `Editing draft · ${saveLabel.toLowerCase()}` : saveLabel
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 429,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "doc-mode",
                        children: [
                            isMarkdown && canEdit ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: mode === "editing" ? "active" : "",
                                        onClick: ()=>setMode("editing"),
                                        title: "Edit the document with formatting controls.",
                                        children: "Editing"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: mode === "markdown" ? "active" : "",
                                        onClick: ()=>setMode("markdown"),
                                        title: "Edit the Markdown source text directly.",
                                        children: "Markdown"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 443,
                                        columnNumber: 15
                                    }, this),
                                    isResearch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: mode === "sources" ? "active" : "",
                                        onClick: ()=>setMode("sources"),
                                        title: "Review the sources cited in this research document.",
                                        children: "Sources"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 445,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 441,
                                columnNumber: 13
                            }, this) : null,
                            onClose ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-label": "Close document",
                                className: "pane-close",
                                onClick: requestClose,
                                title: "Close document",
                                type: "button",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 449,
                                columnNumber: 22
                            }, this) : null,
                            onCollapse ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-label": "Collapse document",
                                className: "pane-collapse",
                                onClick: onCollapse,
                                title: "Collapse document",
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 450,
                                columnNumber: 25
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 428,
                columnNumber: 7
            }, this),
            !isMarkdown && review ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "chat-history-status",
                children: "Original supplied file. Drafting uses its saved extracted text. The original remains unchanged."
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 454,
                columnNumber: 32
            }, this) : null,
            referenceTarget && onOpenReference ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-history-status",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn quiet tiny",
                        type: "button",
                        onClick: ()=>onOpenReference(referenceTarget),
                        children: "Open referenced passage"
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 455,
                        columnNumber: 82
                    }, this),
                    " The source opens separately and does not change this document's action target."
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 455,
                columnNumber: 45
            }, this) : null,
            isResearch && mode === "sources" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "doc-scroll research-sources",
                children: citations.length ? citations.map((citation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "research-source-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "research-source-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: citation.n
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 461,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: citation.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 460,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "research-source-kind",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    text: citation.kind
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentPanel.tsx",
                                    lineNumber: 464,
                                    columnNumber: 53
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 464,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "source-quote",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    text: citation.quote
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentPanel.tsx",
                                    lineNumber: 465,
                                    columnNumber: 45
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 465,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    text: citation.note
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentPanel.tsx",
                                    lineNumber: 466,
                                    columnNumber: 18
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 466,
                                columnNumber: 15
                            }, this)
                        ]
                    }, citation.id, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 459,
                        columnNumber: 13
                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-state",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "No sources are cited in this research yet."
                        }, void 0, false, {
                            fileName: "[project]/components/DocumentPanel.tsx",
                            lineNumber: 470,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            children: "The research remains editable. Add citations before relying on it as sourced analysis."
                        }, void 0, false, {
                            fileName: "[project]/components/DocumentPanel.tsx",
                            lineNumber: 471,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DocumentPanel.tsx",
                    lineNumber: 469,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 457,
                columnNumber: 9
            }, this) : isMarkdown && (mode === "editing" || !document.editable) ? review ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DocumentReview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                author: review.authors.find((item)=>item.author_id === editingAuthorId) ?? {
                    author_id: editingAuthorId,
                    name: editingAuthorName,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"][review.authors.length % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"].length]
                },
                busy: busy,
                lawyerAuthor: lawyerAuthor,
                lawyerAuthorId: lawyerAuthorId,
                onAction: reviewAction,
                onAuthorChange: onReviewAuthorChange,
                readOnly: !canEdit,
                review: review,
                children: ({ mode: reviewMode, reviewers, onAddComment, onOpenThread, onSelectionContext })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MarkdownRichEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        markdown: document.content,
                        onAddComment: onAddComment,
                        onAskAgent: canEdit && onAskAgent ? ()=>onAskAgent(actionTargetDocumentId ?? activeIdentity?.document_id) : undefined,
                        onOpenCommentThread: onOpenThread,
                        onSelectionContext: (selection)=>{
                            onSelectionContext(selection);
                            if (selection.anchorStart !== undefined && selection.anchorEnd !== undefined) {
                                const start = Array.from(document.content.slice(0, selection.anchorStart)).length;
                                const end = Array.from(document.content.slice(0, selection.anchorEnd)).length;
                                setSelectedRange({
                                    start,
                                    end,
                                    text: document.content.slice(selection.anchorStart, selection.anchorEnd)
                                });
                            } else setSelectedRange(null);
                        },
                        documents: documents,
                        onOpenDocument: onOpenReference,
                        readOnly: !canEdit,
                        reviewComments: review.comments,
                        reviewMode: reviewMode,
                        reviewReviewers: reviewers,
                        reviewSegments: review.segments,
                        reviewTracking: review.tracking,
                        reviewAuthor: review.authors.find((item)=>item.author_id === editingAuthorId) ?? {
                            author_id: editingAuthorId,
                            name: editingAuthorName,
                            color: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"][review.authors.length % __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"].length]
                        },
                        onChange: (content)=>{
                            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$documentSave$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savedMarkdownMatches"])(content, document.content)) return;
                            setDocument((current)=>current ? {
                                    ...current,
                                    content
                                } : current);
                            setDirty(true);
                        }
                    }, `${document.path}-${editorVersion}`, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 486,
                        columnNumber: 96
                    }, this)
            }, document.path, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 476,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$MarkdownRichEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                markdown: document.content,
                readOnly: true,
                documents: documents,
                onOpenDocument: onOpenReference
            }, document.path, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 515,
                columnNumber: 11
            }, this) : isMarkdown || document.editable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "doc-scroll",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    "aria-label": "Raw Markdown",
                    className: "markdown-source",
                    onChange: (event)=>{
                        setDocument({
                            ...document,
                            content: event.target.value
                        });
                        setDirty(true);
                    },
                    readOnly: !canEdit,
                    spellCheck: true,
                    value: document.content
                }, void 0, false, {
                    fileName: "[project]/components/DocumentPanel.tsx",
                    lineNumber: 518,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 517,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "doc-scroll",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "empty-state",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: document.name
                        }, void 0, false, {
                            fileName: "[project]/components/DocumentPanel.tsx",
                            lineNumber: 530,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "muted",
                            style: {
                                maxWidth: "48ch",
                                margin: "8px auto 14px"
                            },
                            children: "The original file is read-only. Open it directly, or select its extracted Markdown companion."
                        }, void 0, false, {
                            fileName: "[project]/components/DocumentPanel.tsx",
                            lineNumber: 531,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            className: "btn",
                            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rawFileUrl"])(document.path),
                            target: "_blank",
                            rel: "noreferrer",
                            children: "Open the original"
                        }, void 0, false, {
                            fileName: "[project]/components/DocumentPanel.tsx",
                            lineNumber: 534,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DocumentPanel.tsx",
                    lineNumber: 529,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 528,
                columnNumber: 9
            }, this),
            savedChangesAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "notice-card wash-attention",
                style: {
                    margin: "0 34px 12px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "New saved version available"
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 541,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Your local text is still here. Copy any edits you want to keep, then reload the saved file to review its latest changes."
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 542,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 540,
                columnNumber: 9
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "error",
                style: {
                    margin: "0 34px 12px"
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 545,
                columnNumber: 16
            }, this) : null,
            saveState === "conflict" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "notice-card wash-attention",
                style: {
                    margin: "0 34px 12px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Save conflict — review"
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 548,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Your local text is still available. Check the saved file before you retry."
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 549,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn compact",
                                disabled: busy,
                                onClick: ()=>void save(),
                                type: "button",
                                children: "Retry save"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 551,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn compact",
                                disabled: busy,
                                onClick: ()=>void reloadCanonical(),
                                type: "button",
                                children: "Reload saved file"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 552,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 550,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 547,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "doc-bar document-actions",
                style: {
                    position: "static",
                    borderBottom: 0,
                    borderTop: "1px solid var(--line-soft)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "review-footer-status",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: saveLabel
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this),
                            isMarkdown && review ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "track-toggle",
                                children: [
                                    "Redline ",
                                    review.tracking ? "on" : "off"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 561,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 558,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            isMarkdown ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    sourcePath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        className: "btn compact",
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rawFileUrl"])(sourcePath),
                                        rel: "noreferrer",
                                        target: "_blank",
                                        children: "Original"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 567,
                                        columnNumber: 29
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn compact",
                                        disabled: busy,
                                        onClick: ()=>void exportDocument("docx"),
                                        type: "button",
                                        children: "Word"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 568,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn compact",
                                        disabled: busy,
                                        onClick: ()=>void exportDocument("pdf"),
                                        type: "button",
                                        children: "PDF"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 569,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 566,
                                columnNumber: 13
                            }, this) : null,
                            saveState !== "conflict" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn compact",
                                disabled: busy,
                                onClick: ()=>void reloadCanonical(),
                                type: "button",
                                children: "Reload saved file"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 572,
                                columnNumber: 39
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn primary compact",
                                disabled: !dirty || busy || !canEdit,
                                onClick: ()=>void save(),
                                children: busy ? "Saving…" : dirty && review?.tracking ? "Save redline" : "Save"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 573,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "workspace-export-mode",
                                children: [
                                    "Export version ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: exportMode,
                                        onChange: (event)=>setExportMode(event.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "markup",
                                                children: "Saved changes as markup"
                                            }, void 0, false, {
                                                fileName: "[project]/components/DocumentPanel.tsx",
                                                lineNumber: 576,
                                                columnNumber: 174
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "accepted_text",
                                                children: "Accepted text only"
                                            }, void 0, false, {
                                                fileName: "[project]/components/DocumentPanel.tsx",
                                                lineNumber: 576,
                                                columnNumber: 229
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DocumentPanel.tsx",
                                        lineNumber: 576,
                                        columnNumber: 63
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentPanel.tsx",
                                lineNumber: 576,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentPanel.tsx",
                        lineNumber: 564,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentPanel.tsx",
                lineNumber: 557,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DocumentPanel.tsx",
        lineNumber: 426,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/DocumentReview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DocumentReview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CommentRail$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CommentRail.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reviewAuthor.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function DocumentReview({ review, author, lawyerAuthor, lawyerAuthorId, busy, readOnly, onAuthorChange, onAction, children }) {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("current");
    const [reviewers, setReviewers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [selection, setSelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [commentQuote, setCommentQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [comment, setComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [openThread, setOpenThread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customOpen, setCustomOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customName, setCustomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [commentsOpen, setCommentsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reviewingChanges, setReviewingChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const returnFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reviewButton = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const knownChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set(review.changes.map((item)=>item.change_id)));
    const visibleChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>review.changes.filter((item)=>reviewers.size === 0 || reviewers.has(item.author_id)), [
        review.changes,
        reviewers
    ]);
    const authorOptions = [
        ...new Set([
            lawyerAuthor.trim(),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GENERATED_REVIEW_AUTHOR"],
            ...review.authors.map((item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(item.name, item.author_id))
        ])
    ].filter(Boolean);
    const selectedAuthor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(author.name, author.author_id);
    const closePopover = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setCommentQuote("");
        setComment("");
        setOpenThread(null);
        const target = returnFocus.current;
        returnFocus.current = null;
        requestAnimationFrame(()=>target?.focus());
    }, []);
    const popupStyle = selection?.rect ? {
        position: "fixed",
        left: Math.min(selection.rect.left, window.innerWidth - 450),
        top: Math.min(selection.rect.bottom + 8, window.innerHeight - 260)
    } : undefined;
    function decide(action, changeId, next) {
        void onAction({
            action,
            change_id: changeId
        }).then(()=>{
            if (!next) return;
            const index = visibleChanges.findIndex((item)=>item.change_id === changeId);
            const nextId = visibleChanges[index + 1]?.change_id;
            if (nextId) requestAnimationFrame(()=>document.querySelector(`[data-review-change="${nextId}"]`)?.focus());
        });
    }
    function closeReview() {
        setReviewingChanges(false);
        requestAnimationFrame(()=>reviewButton.current?.focus());
    }
    function openComposer(context) {
        const exact = context.anchorStart !== undefined ? context : selection?.quote === context.quote ? {
            ...context,
            anchorStart: selection.anchorStart,
            anchorEnd: selection.anchorEnd
        } : context;
        setSelection(exact);
        returnFocus.current = exact.returnFocus;
        setCommentQuote(exact.quote);
        setOpenThread(null);
    }
    function openExisting(threadId, focus) {
        returnFocus.current = focus;
        setCommentsOpen(true);
        setOpenThread(threadId);
        setCommentQuote("");
    }
    const contextualThread = review.comments.find((item)=>item.thread_id === openThread);
    const openCommentCount = review.comments.filter((item)=>!item.resolved).length;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const current = new Set(review.changes.map((item)=>item.change_id));
        if (review.changes.some((item)=>!knownChanges.current.has(item.change_id))) setMode("markup");
        knownChanges.current = current;
    }, [
        review.changes
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (visibleChanges.length === 0) setReviewingChanges(false);
    }, [
        visibleChanges.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (reviewingChanges) requestAnimationFrame(()=>document.querySelector("[data-review-change]")?.focus());
    }, [
        reviewingChanges
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `review-workspace ${commentsOpen || reviewingChanges ? "" : "comments-hidden"} ${reviewingChanges ? "changes-open" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "review-main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "review-toolbar",
                        role: "toolbar",
                        "aria-label": "Document review",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "review-modes",
                                children: [
                                    [
                                        'markup',
                                        'All Markup'
                                    ],
                                    [
                                        'current',
                                        'No Markup'
                                    ],
                                    [
                                        'original',
                                        'Original'
                                    ]
                                ].map(([value, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: mode === value ? "active" : "",
                                        onClick: ()=>setMode(value),
                                        type: "button",
                                        children: label
                                    }, value, false, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 57,
                                        columnNumber: 154
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentReview.tsx",
                                lineNumber: 57,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "review-toolbar-actions",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-pressed": review.tracking,
                                        className: `btn tiny redline-toggle ${review.tracking ? "active" : ""}`,
                                        disabled: busy || readOnly,
                                        onClick: ()=>{
                                            if (!review.tracking) setMode("markup");
                                            void onAction({
                                                action: "set_tracking",
                                                enabled: !review.tracking
                                            });
                                        },
                                        title: review.tracking ? "Stop recording new edits as redlines." : "Record new edits as redlines.",
                                        type: "button",
                                        children: [
                                            "Redline ",
                                            review.tracking ? "on" : "off"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 59,
                                        columnNumber: 11
                                    }, this),
                                    visibleChanges.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-expanded": reviewingChanges,
                                        className: `btn tiny ${reviewingChanges ? "quiet" : "review"}`,
                                        ref: reviewButton,
                                        onClick: ()=>{
                                            setMode("markup");
                                            if (reviewingChanges) closeReview();
                                            else setReviewingChanges(true);
                                        },
                                        type: "button",
                                        children: reviewingChanges ? "Continue editing" : `Review ${visibleChanges.length} ${visibleChanges.length === 1 ? "change" : "changes"}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 70,
                                        columnNumber: 36
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "review-toolbar-secondary",
                                        children: [
                                            review.authors.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                                className: "reviewer-menu",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                        children: [
                                                            "Reviewers (",
                                                            review.authors.length,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 71
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "reviewer-filters",
                                                        "aria-label": "Reviewer filters",
                                                        children: review.authors.map((item)=>{
                                                            const count = review.changes.filter((change)=>change.author_id === item.author_id).length;
                                                            const selected = reviewers.size === 0 || reviewers.has(item.author_id);
                                                            const displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(item.name, item.author_id);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        checked: selected,
                                                                        onChange: ()=>setReviewers((current)=>{
                                                                                const next = new Set(current.size === 0 ? review.authors.map((entry)=>entry.author_id) : current);
                                                                                if (next.has(item.author_id)) next.delete(item.author_id);
                                                                                else next.add(item.author_id);
                                                                                return next.size === review.authors.length ? new Set() : next;
                                                                            }),
                                                                        type: "checkbox"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                                        lineNumber: 82,
                                                                        columnNumber: 489
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "author-swatch",
                                                                        style: {
                                                                            background: item.color
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                                        lineNumber: 82,
                                                                        columnNumber: 834
                                                                    }, this),
                                                                    displayName,
                                                                    " (",
                                                                    count,
                                                                    ")",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        "aria-label": `Color for ${displayName}`,
                                                                        onChange: (event)=>void onAction({
                                                                                action: "set_author_color",
                                                                                author_id: item.author_id,
                                                                                color: event.target.value
                                                                            }),
                                                                        value: item.color,
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_AUTHOR_PALETTE"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: color,
                                                                                children: color
                                                                            }, color, false, {
                                                                                fileName: "[project]/components/DocumentReview.tsx",
                                                                                lineNumber: 82,
                                                                                columnNumber: 1152
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                                        lineNumber: 82,
                                                                        columnNumber: 925
                                                                    }, this)
                                                                ]
                                                            }, item.author_id, true, {
                                                                fileName: "[project]/components/DocumentReview.tsx",
                                                                lineNumber: 82,
                                                                columnNumber: 461
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 125
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 82,
                                                columnNumber: 36
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "aria-pressed": commentsOpen,
                                                className: "btn quiet tiny",
                                                onClick: ()=>setCommentsOpen((current)=>!current),
                                                type: "button",
                                                children: [
                                                    "Comments ",
                                                    commentsOpen ? "on" : "off",
                                                    " (",
                                                    openCommentCount,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 83,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                children: [
                                                    "Author ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        "aria-label": "Active review author",
                                                        className: "select-input",
                                                        onChange: (event)=>{
                                                            if (event.target.value === "__custom") {
                                                                setCustomName("");
                                                                setCustomOpen(true);
                                                            } else onAuthorChange(event.target.value);
                                                        },
                                                        value: selectedAuthor,
                                                        children: [
                                                            authorOptions.map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: name
                                                                }, name, false, {
                                                                    fileName: "[project]/components/DocumentReview.tsx",
                                                                    lineNumber: 84,
                                                                    columnNumber: 294
                                                                }, this)),
                                                            !authorOptions.includes(selectedAuthor) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: selectedAuthor
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/DocumentReview.tsx",
                                                                lineNumber: 84,
                                                                columnNumber: 373
                                                            }, this) : null,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "__custom",
                                                                children: "Custom name…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/DocumentReview.tsx",
                                                                lineNumber: 84,
                                                                columnNumber: 414
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 84,
                                                columnNumber: 11
                                            }, this),
                                            customOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "author-popover",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        autoFocus: true,
                                                        "aria-label": "Custom author name",
                                                        className: "text-input",
                                                        onChange: (event)=>setCustomName(event.target.value),
                                                        onKeyDown: (event)=>{
                                                            if (event.key === "Escape") setCustomOpen(false);
                                                        },
                                                        value: customName
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "btn primary tiny",
                                                        disabled: !customName.trim(),
                                                        onClick: ()=>{
                                                            onAuthorChange(customName);
                                                            setCustomOpen(false);
                                                        },
                                                        type: "button",
                                                        children: "Use author"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/DocumentReview.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 282
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 85,
                                                columnNumber: 25
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 81,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentReview.tsx",
                                lineNumber: 58,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentReview.tsx",
                        lineNumber: 56,
                        columnNumber: 7
                    }, this),
                    children({
                        mode,
                        reviewers,
                        onAddComment: openComposer,
                        onOpenThread: openExisting,
                        onSelectionContext: setSelection
                    }),
                    commentQuote || contextualThread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "comment-popover",
                        onKeyDown: (event)=>{
                            if (event.key === "Escape") closePopover();
                        },
                        role: "dialog",
                        "aria-label": commentQuote ? "Add comment" : "Comment thread",
                        style: popupStyle,
                        children: commentQuote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: [
                                        "Comment on “",
                                        commentQuote,
                                        "”"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 261
                                }, this),
                                selection?.anchorStart === undefined || selection.anchorEnd === undefined ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "comment-note",
                                    children: "Select text within one paragraph or list item to add a comment."
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 382
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    autoFocus: true,
                                    className: "text-input",
                                    onChange: (event)=>setComment(event.target.value),
                                    value: comment
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 480
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "btn-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn",
                                            onClick: closePopover,
                                            type: "button",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 90,
                                            columnNumber: 619
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn primary",
                                            disabled: !comment.trim() || busy || selection?.anchorStart === undefined || selection.anchorEnd === undefined,
                                            onClick: async ()=>{
                                                await onAction({
                                                    action: "add_comment",
                                                    quote: commentQuote,
                                                    body: comment.trim(),
                                                    anchor_start: selection?.anchorStart,
                                                    anchor_end: selection?.anchorEnd
                                                });
                                                setCommentsOpen(true);
                                                closePopover();
                                            },
                                            type: "button",
                                            children: "Add comment"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 90,
                                            columnNumber: 695
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 594
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DocumentReview.tsx",
                            lineNumber: 90,
                            columnNumber: 259
                        }, this) : contextualThread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                    children: contextualThread.quote
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 1129
                                }, this),
                                contextualThread.entries.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(entry.author_name, entry.author_id)
                                            }, void 0, false, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 90,
                                                columnNumber: 1245
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/DocumentReview.tsx",
                                                lineNumber: 90,
                                                columnNumber: 1319
                                            }, this),
                                            entry.body
                                        ]
                                    }, entry.comment_id, true, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 90,
                                        columnNumber: 1219
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn tiny",
                                    onClick: closePopover,
                                    type: "button",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 90,
                                    columnNumber: 1342
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DocumentReview.tsx",
                            lineNumber: 90,
                            columnNumber: 1127
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/components/DocumentReview.tsx",
                        lineNumber: 90,
                        columnNumber: 45
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentReview.tsx",
                lineNumber: 55,
                columnNumber: 5
            }, this),
            reviewingChanges && visibleChanges.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Tracked changes",
                className: "review-list",
                onKeyDown: (event)=>{
                    if (event.key === "Escape") closeReview();
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "review-list-head",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        children: "Review tracked changes"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 92,
                                        columnNumber: 221
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            visibleChanges.length,
                                            " ",
                                            visibleChanges.length === 1 ? "change" : "changes",
                                            " remaining"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/DocumentReview.tsx",
                                        lineNumber: 92,
                                        columnNumber: 252
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DocumentReview.tsx",
                                lineNumber: 92,
                                columnNumber: 216
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn quiet tiny",
                                onClick: closeReview,
                                type: "button",
                                children: "Continue editing"
                            }, void 0, false, {
                                fileName: "[project]/components/DocumentReview.tsx",
                                lineNumber: 92,
                                columnNumber: 351
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DocumentReview.tsx",
                        lineNumber: 92,
                        columnNumber: 182
                    }, this),
                    visibleChanges.map((change)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "review-card",
                            "data-review-change": change.change_id,
                            tabIndex: -1,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            style: {
                                                color: change.author_color
                                            },
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(change.author_name, change.author_id)
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 598
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "review-change-text",
                                            children: [
                                                change.old_text ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("del", {
                                                    style: {
                                                        color: change.author_color
                                                    },
                                                    children: change.old_text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/DocumentReview.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 768
                                                }, this) : null,
                                                change.new_text ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ins", {
                                                    style: {
                                                        color: change.author_color
                                                    },
                                                    children: change.new_text
                                                }, void 0, false, {
                                                    fileName: "[project]/components/DocumentReview.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 862
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 713
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 92,
                                    columnNumber: 593
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "btn-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn tiny",
                                            disabled: busy,
                                            onClick: ()=>decide("reject_change", change.change_id, false),
                                            type: "button",
                                            children: "Reject"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 974
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn tiny",
                                            disabled: busy,
                                            onClick: ()=>decide("reject_change", change.change_id, true),
                                            type: "button",
                                            children: "Reject and next"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 1113
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn tiny",
                                            disabled: busy,
                                            onClick: ()=>decide("accept_change", change.change_id, false),
                                            type: "button",
                                            children: "Accept"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 1260
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn primary tiny",
                                            disabled: busy,
                                            onClick: ()=>decide("accept_change", change.change_id, true),
                                            type: "button",
                                            children: "Accept and next"
                                        }, void 0, false, {
                                            fileName: "[project]/components/DocumentReview.tsx",
                                            lineNumber: 92,
                                            columnNumber: 1399
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DocumentReview.tsx",
                                    lineNumber: 92,
                                    columnNumber: 949
                                }, this)
                            ]
                        }, change.change_id, true, {
                            fileName: "[project]/components/DocumentReview.tsx",
                            lineNumber: 92,
                            columnNumber: 485
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/DocumentReview.tsx",
                lineNumber: 92,
                columnNumber: 50
            }, this) : commentsOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CommentRail$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                busy: busy,
                comments: review.comments,
                lawyerAuthorId: lawyerAuthorId,
                onAction: onAction,
                onCollapse: ()=>setCommentsOpen(false),
                onOpenThread: openExisting
            }, void 0, false, {
                fileName: "[project]/components/DocumentReview.tsx",
                lineNumber: 92,
                columnNumber: 1600
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/DocumentReview.tsx",
        lineNumber: 54,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/DossierResearchCard.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "DossierResearchCard-module__wgxboq__actions",
  "attention": "DossierResearchCard-module__wgxboq__attention",
  "card": "DossierResearchCard-module__wgxboq__card",
  "error": "DossierResearchCard-module__wgxboq__error",
  "issueRows": "DossierResearchCard-module__wgxboq__issueRows",
  "issues": "DossierResearchCard-module__wgxboq__issues",
  "kicker": "DossierResearchCard-module__wgxboq__kicker",
  "newIssues": "DossierResearchCard-module__wgxboq__newIssues",
  "priorities": "DossierResearchCard-module__wgxboq__priorities",
  "revision": "DossierResearchCard-module__wgxboq__revision",
  "scope": "DossierResearchCard-module__wgxboq__scope",
  "state": "DossierResearchCard-module__wgxboq__state",
  "state_failed": "DossierResearchCard-module__wgxboq__state_failed",
  "state_interrupted": "DossierResearchCard-module__wgxboq__state_interrupted",
  "state_newly_identified": "DossierResearchCard-module__wgxboq__state_newly_identified",
  "state_partial": "DossierResearchCard-module__wgxboq__state_partial",
  "state_queued": "DossierResearchCard-module__wgxboq__state_queued",
  "state_running": "DossierResearchCard-module__wgxboq__state_running",
  "state_saved": "DossierResearchCard-module__wgxboq__state_saved",
});
}),
"[project]/components/DossierResearchCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DossierResearchCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dossierRequests.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ResearchScopeChoice.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DossierResearchCard.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
function DossierResearchCard({ card, activeConversationId, disabled, onConversationRefresh, onOpenDocument, onPrepareFollowUp }) {
    const initial = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(card.status, {
            requestId: card.request_id,
            matterId: card.matter_id,
            state: card.state,
            phase: card.phase
        }), [
        card
    ]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initial);
    const [priorities, setPriorities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initial.priorities);
    const selectableIssues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            ...initial.issues.map((issue)=>({
                    issue_id: issue.issue_id,
                    title: issue.title
                })),
            ...initial.new_issue_candidates.map((item, index)=>({
                    issue_id: String(item.candidate_key || `candidate-${index + 1}`),
                    title: String(item.title || `New issue ${index + 1}`)
                }))
        ], [
        initial
    ]);
    const availableIds = selectableIssues.map((issue)=>issue.issue_id);
    const [firstIssueIds, setFirstIssueIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uniqueIssueOrder"])(initial.first_issue_ids.length ? initial.first_issue_ids : availableIds, availableIds));
    const [scope, setScope] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("top_three");
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        external: false,
        other_matters: false,
        public_query: "",
        provider_ids: []
    });
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        provider_ids: [],
        cost_notice: "External search may incur provider charges.",
        sensitivity_notice: "Other matters may contain sensitive information."
    });
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const actionKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const publication = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicationToken"])(initial));
    const liveScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        matterId: card.matter_id,
        conversationId: activeConversationId
    });
    liveScope.current = {
        matterId: card.matter_id,
        conversationId: activeConversationId
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setStatus((current)=>{
            if (initial.sequence < current.sequence) return current;
            publication.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicationToken"])(initial);
            return initial;
        });
    }, [
        initial
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!card.request_id || !card.matter_id) return;
        const expected = {
            matterId: card.matter_id,
            conversationId: activeConversationId
        };
        const controller = new AbortController();
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDossierRequest"])(card.matter_id, card.request_id, controller.signal).then((value)=>{
            if (controller.signal.aborted || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pollingScopeMatches"])(expected.matterId, expected.conversationId, liveScope.current.matterId, liveScope.current.conversationId)) return;
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(value, {
                requestId: card.request_id,
                matterId: card.matter_id
            });
            setError("");
            setStatus((current)=>next.sequence >= current.sequence ? next : current);
            publication.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicationToken"])(next);
        }).catch((caught)=>{
            if (!(caught instanceof DOMException && caught.name === "AbortError")) setError(caught instanceof Error ? caught.message : "Dossier progress could not refresh.");
        });
        return ()=>controller.abort();
    }, [
        activeConversationId,
        card.matter_id,
        card.request_id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (status.phase !== "setup") return;
        let cancelled = false;
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResearchOptions"])(card.matter_id).then((value)=>{
            if (cancelled) return;
            setOptions(value);
            setSource((current)=>({
                    ...current,
                    provider_ids: value.provider_ids,
                    native: value.native_available === true,
                    allow_firecrawl: false,
                    allow_followup_queries: value.allow_followup_queries === true,
                    model_selection: value.model_selection,
                    main_model_selection: value.main_model_selection,
                    collector_model_selection: value.collector_model_selection
                }));
        }).catch(()=>{
            if (!cancelled) setNotice("Source options could not refresh. Saved-material use is still available.");
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        card.matter_id,
        status.phase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldPollDossier"])(status)) return;
        const expected = {
            matterId: card.matter_id,
            conversationId: activeConversationId
        };
        let stopped = false;
        let timer;
        let controller = null;
        const poll = async ()=>{
            controller = new AbortController();
            try {
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDossierRequest"])(card.matter_id, card.request_id, controller.signal), {
                    requestId: card.request_id,
                    matterId: card.matter_id
                });
                if (stopped || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pollingScopeMatches"])(expected.matterId, expected.conversationId, liveScope.current.matterId, liveScope.current.conversationId)) return;
                const nextToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicationToken"])(next);
                setStatus(next);
                if (nextToken !== publication.current) {
                    publication.current = nextToken;
                    const origin = next.origin?.conversation_id;
                    if (origin && origin === liveScope.current.conversationId) await onConversationRefresh?.(origin);
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldPollDossier"])(next)) timer = setTimeout(poll, 2000);
            } catch (caught) {
                if (!stopped && !(caught instanceof DOMException && caught.name === "AbortError")) {
                    setError(caught instanceof Error ? caught.message : "Dossier progress could not refresh.");
                    timer = setTimeout(poll, 4000);
                }
            }
        };
        timer = setTimeout(poll, 2000);
        return ()=>{
            stopped = true;
            clearTimeout(timer);
            controller?.abort();
        };
    }, [
        activeConversationId,
        card.matter_id,
        card.request_id,
        onConversationRefresh,
        status.state
    ]);
    function key(action) {
        return actionKeys.current[action] ||= `dossier-ui:${action}:${crypto.randomUUID()}`;
    }
    async function start(mode) {
        if (mode === "research" && firstIssueIds.length !== Math.min(3, selectableIssues.length)) {
            setError("Choose three different issues before research starts.");
            return;
        }
        setBusy(true);
        setError("");
        setNotice("");
        try {
            const next = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startDossierRequest"])(card.matter_id, card.request_id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startPayload"])(status, mode, priorities, firstIssueIds, scope, source, key(mode)));
            setStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(next, {
                requestId: card.request_id,
                matterId: card.matter_id
            }));
            setNotice(mode === "research" ? "Research started. You can continue this conversation." : "The saved material is being composed.");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The dossier request could not start.");
        } finally{
            setBusy(false);
        }
    }
    async function stop() {
        setBusy(true);
        setError("");
        try {
            setStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stopDossierRequest"])(card.matter_id, card.request_id, status.sequence), {
                requestId: card.request_id,
                matterId: card.matter_id
            }));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Research could not stop.");
        } finally{
            setBusy(false);
        }
    }
    async function resume(retryIssueIds) {
        setBusy(true);
        setError("");
        try {
            setStatus((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeDossierStatus"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resumeDossierRequest"])(card.matter_id, card.request_id, status.sequence, retryIssueIds), {
                requestId: card.request_id,
                matterId: card.matter_id
            }));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Research could not resume.");
        } finally{
            setBusy(false);
        }
    }
    if (status.phase === "setup" || status.state === "awaiting_choices") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].setup}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].kicker,
                children: "Dossier research · Needs your choices"
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 112,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: "Prepare your dossier"
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 112,
                columnNumber: 79
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].priorities,
                children: priorities.map((priority, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                children: [
                                    "Priority ",
                                    index + 1
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 113,
                                columnNumber: 106
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Priority",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        disabled: disabled || busy,
                                        value: priority.text,
                                        onChange: (event)=>setPriorities((items)=>items.map((item, itemIndex)=>itemIndex === index ? {
                                                        ...item,
                                                        text: event.target.value,
                                                        changed: true
                                                    } : item))
                                    }, void 0, false, {
                                        fileName: "[project]/components/DossierResearchCard.tsx",
                                        lineNumber: 113,
                                        columnNumber: 158
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 113,
                                columnNumber: 143
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Why it matters",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        disabled: disabled || busy,
                                        value: priority.why,
                                        onChange: (event)=>setPriorities((items)=>items.map((item, itemIndex)=>itemIndex === index ? {
                                                        ...item,
                                                        why: event.target.value,
                                                        changed: true
                                                    } : item))
                                    }, void 0, false, {
                                        fileName: "[project]/components/DossierResearchCard.tsx",
                                        lineNumber: 113,
                                        columnNumber: 404
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 113,
                                columnNumber: 383
                            }, this)
                        ]
                    }, priority.key, true, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 113,
                        columnNumber: 77
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 113,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].issues,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                        children: "First issues to research"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 114,
                        columnNumber: 41
                    }, this),
                    [
                        0,
                        1,
                        2
                    ].slice(0, Math.min(3, selectableIssues.length)).map((position)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            children: [
                                "Issue ",
                                position + 1,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    disabled: disabled || busy,
                                    value: firstIssueIds[position] || "",
                                    onChange: (event)=>setFirstIssueIds((current)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIssueAt"])(current, position, event.target.value, availableIds)),
                                    children: selectableIssues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: issue.issue_id,
                                            children: issue.title
                                        }, issue.issue_id, false, {
                                            fileName: "[project]/components/DossierResearchCard.tsx",
                                            lineNumber: 114,
                                            columnNumber: 416
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/DossierResearchCard.tsx",
                                    lineNumber: 114,
                                    columnNumber: 198
                                }, this)
                            ]
                        }, position, true, {
                            fileName: "[project]/components/DossierResearchCard.tsx",
                            lineNumber: 114,
                            columnNumber: 156
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 114,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scope,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                        children: "Research scope"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 115,
                        columnNumber: 40
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: `dossier-scope-${status.request_id}`,
                                checked: scope === "top_three",
                                onChange: ()=>setScope("top_three")
                            }, void 0, false, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 115,
                                columnNumber: 78
                            }, this),
                            " Research the top three"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 115,
                        columnNumber: 71
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: `dossier-scope-${status.request_id}`,
                                checked: scope === "all",
                                onChange: ()=>setScope("all")
                            }, void 0, false, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 115,
                                columnNumber: 253
                            }, this),
                            " Research all ",
                            selectableIssues.length,
                            " identified issues"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 115,
                        columnNumber: 246
                    }, this),
                    scope === "all" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "We will deliver the first dossier after the first three issues. The remaining issues will be researched in the background. This takes longer."
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 115,
                        columnNumber: 463
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 115,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResearchScopeFields"], {
                value: source,
                onChange: setSource,
                options: options,
                disabled: disabled || busy
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 116,
                columnNumber: 5
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 117,
                columnNumber: 15
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 117,
                columnNumber: 79
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: disabled || busy || source.external && !source.public_query.trim(),
                        onClick: ()=>void start("research"),
                        type: "button",
                        children: busy ? "Starting…" : "Start dossier research"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 118,
                        columnNumber: 37
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn compact",
                        disabled: disabled || busy,
                        onClick: ()=>void start("saved_only"),
                        type: "button",
                        children: "Use saved material now"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 118,
                        columnNumber: 266
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled || busy,
                        onClick: ()=>{
                            setPriorities(status.priorities);
                            setNotice("Suggested priorities kept. No research started.");
                        },
                        type: "button",
                        children: "Skip priority changes"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 118,
                        columnNumber: 412
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled || busy,
                        onClick: ()=>{
                            setPriorities(status.priorities);
                            setFirstIssueIds((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uniqueIssueOrder"])(status.first_issue_ids, availableIds));
                            setNotice("Setup kept. No research started.");
                        },
                        type: "button",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 118,
                        columnNumber: 635
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 118,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DossierResearchCard.tsx",
        lineNumber: 111,
        columnNumber: 79
    }, this);
    const controls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dossierControls"])(status);
    const failedIds = status.issues.filter((issue)=>issue.state === "failed").map((issue)=>issue.issue_id);
    const firstPublication = status.publications[0];
    const latest = status.latest_publication && Object.keys(status.latest_publication).length ? status.latest_publication : status.publications.at(-1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card} ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progress}`,
        "aria-busy": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldPollDossier"])(status),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].kicker,
                children: [
                    "Dossier research · ",
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dossierStateWord"])(status.state)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 122,
                columnNumber: 105
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["issueProgressLabel"])(status)
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 122,
                columnNumber: 193
            }, this),
            status.first_pass_ready_at && firstPublication?.revision_path ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].revision,
                onClick: ()=>onOpenDocument?.(firstPublication.revision_path),
                type: "button",
                children: "First dossier ready · Open exact revision"
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 123,
                columnNumber: 70
            }, this) : null,
            status.publications.length > 1 && latest?.revision_path && latest.revision_path !== firstPublication?.revision_path ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].revision,
                onClick: ()=>onOpenDocument?.(latest.revision_path),
                type: "button",
                children: "Latest dossier update · Open exact revision"
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 124,
                columnNumber: 124
            }, this) : null,
            latest?.state === "review_required" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].attention,
                role: "status",
                children: "Update ready for review"
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 125,
                columnNumber: 45
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].issueRows,
                children: status.issues.map((issue)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][`state_${issue.state}`] || "",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: issue.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/DossierResearchCard.tsx",
                                        lineNumber: 126,
                                        columnNumber: 145
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].state,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dossierStateWord"])(issue.state)
                                    }, void 0, false, {
                                        fileName: "[project]/components/DossierResearchCard.tsx",
                                        lineNumber: 126,
                                        columnNumber: 175
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 126,
                                columnNumber: 140
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    issue.sources_read,
                                    " sources read · ",
                                    issue.sources_retrieved,
                                    " sources retrieved",
                                    issue.support ? ` · ${issue.support}` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 126,
                                columnNumber: 250
                            }, this),
                            issue.answer_path && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "text-button",
                                onClick: ()=>onOpenDocument?.(issue.answer_path),
                                type: "button",
                                children: "Open saved answer"
                            }, void 0, false, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 126,
                                columnNumber: 402
                            }, this),
                            issue.last_error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                                children: issue.last_error
                            }, void 0, false, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 126,
                                columnNumber: 549
                            }, this)
                        ]
                    }, issue.issue_id, true, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 126,
                        columnNumber: 66
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 126,
                columnNumber: 5
            }, this),
            status.new_issue_candidates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].newIssues,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "New issues found"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 127,
                        columnNumber: 82
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: status.new_issue_candidates.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: String(item.title || "New issue")
                            }, String(item.candidate_key || index), false, {
                                fileName: "[project]/components/DossierResearchCard.tsx",
                                lineNumber: 127,
                                columnNumber: 169
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 127,
                        columnNumber: 115
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        onClick: ()=>onPrepareFollowUp?.((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dossierRequests$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["followUpText"])(status)),
                        type: "button",
                        children: "Prepare follow-up question"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 127,
                        columnNumber: 262
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 127,
                columnNumber: 48
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 128,
                columnNumber: 15
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 128,
                columnNumber: 79
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DossierResearchCard$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
                children: [
                    controls.stop && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled || busy,
                        onClick: ()=>void stop(),
                        type: "button",
                        children: "Stop"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 129,
                        columnNumber: 55
                    }, this),
                    controls.resume && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: disabled || busy,
                        onClick: ()=>void resume(),
                        type: "button",
                        children: "Resume"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 129,
                        columnNumber: 194
                    }, this),
                    controls.retry && failedIds.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn tiny quiet",
                        disabled: disabled || busy,
                        onClick: ()=>void resume(failedIds),
                        type: "button",
                        children: [
                            "Retry failed ",
                            failedIds.length === 1 ? "issue" : "issues"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 129,
                        columnNumber: 365
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 129,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: "Diagnostic details"
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 130,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        children: status.request_id
                    }, void 0, false, {
                        fileName: "[project]/components/DossierResearchCard.tsx",
                        lineNumber: 130,
                        columnNumber: 51
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/DossierResearchCard.tsx",
                lineNumber: 130,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/DossierResearchCard.tsx",
        lineNumber: 122,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/LinkifiedText.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LinkifiedText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/link/dist/LexicalLink.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
function LinkifiedText({ text }) {
    const parts = [];
    let remaining = text;
    while(remaining){
        const match = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autoLinkUrlMatcher"])(remaining);
        if (!match) {
            parts.push({
                text: remaining
            });
            break;
        }
        if (match.index > 0) parts.push({
            text: remaining.slice(0, match.index)
        });
        parts.push({
            text: match.text,
            url: match.url
        });
        remaining = remaining.slice(match.index + match.length);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: parts.map((part, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: part.url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    className: "auto-link",
                    href: part.url,
                    onClick: (event)=>event.stopPropagation(),
                    rel: "noreferrer",
                    target: "_blank",
                    children: part.text
                }, void 0, false, {
                    fileName: "[project]/components/LinkifiedText.tsx",
                    lineNumber: 25,
                    columnNumber: 13
                }, this) : part.text
            }, index, false, {
                fileName: "[project]/components/LinkifiedText.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/LinkifiedText.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/MarkdownRichEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MarkdownRichEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/link/dist/LexicalLink.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/list/dist/LexicalList.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/markdown/dist/LexicalMarkdown.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@lexical/selection/dist/LexicalSelection.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@lexical/rich-text/dist/LexicalRichText.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposer$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalComposer.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalAutoLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalAutoLinkPlugin.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalClickableLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalClickableLinkPlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalContentEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalContentEditable.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalErrorBoundary$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalErrorBoundary.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalHistoryPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalHistoryPlugin.dev.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalLinkPlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalListPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalListPlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalMarkdownShortcutPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalMarkdownShortcutPlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalOnChangePlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalOnChangePlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalRichTextPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalRichTextPlugin.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RevisionTextNode.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionPlugin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RevisionPlugin.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$editorSelection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/editorSelection.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workspaceApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/workspaceApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
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
;
;
const MARKDOWN_TRANSFORMERS = [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HEADING"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QUOTE"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UNORDERED_LIST"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ORDERED_LIST"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOLD_ITALIC_STAR"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOLD_STAR"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BOLD_UNDERSCORE"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ITALIC_STAR"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ITALIC_UNDERSCORE"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINK"]
];
const AUTO_LINK_MATCHERS = [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autoLinkUrlMatcher"]
];
function DocumentEndShortcut() {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_DOWN_COMMAND"], (event)=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$editorSelection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isModifiedDocumentEnd"])(event)) return false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$editorSelection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moveSelectionToDocumentEnd"])();
            event.preventDefault();
            return true;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_HIGH"]), [
        editor
    ]);
    return null;
}
function SavedDocumentLinkKeyboardAccess({ documents }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let disposed = false;
        let frame = null;
        const markLinks = ()=>{
            if (frame != null) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(()=>{
                frame = null;
                if (disposed) return;
                const root = editor.getRootElement();
                if (!root) return;
                for (const anchor of root.querySelectorAll("a[href]")){
                    const href = anchor.getAttribute("href") ?? "";
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workspaceApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentForEditorHref"])(documents, href, window.location.origin)) {
                        anchor.tabIndex = 0;
                        anchor.dataset.savedDocumentLink = "true";
                    } else if (anchor.dataset.savedDocumentLink === "true") {
                        anchor.removeAttribute("tabindex");
                        delete anchor.dataset.savedDocumentLink;
                    }
                }
            });
        };
        const unregisterRoot = editor.registerRootListener(markLinks);
        const unregisterUpdate = editor.registerUpdateListener(markLinks);
        markLinks();
        return ()=>{
            disposed = true;
            if (frame != null) cancelAnimationFrame(frame);
            unregisterRoot();
            unregisterUpdate();
        };
    }, [
        documents,
        editor
    ]);
    return null;
}
function ToolbarButton({ label, title, glyph, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `rich-toolbar-button ${glyph ? `glyph ${glyph}` : ""}`,
        type: "button",
        "aria-label": title,
        title: title,
        onClick: onClick,
        children: label
    }, void 0, false, {
        fileName: "[project]/components/MarkdownRichEditor.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
/** Canvas 4c — a real editor bar: block style, marks, lists, and one agent action. */ function EditorToolbar({ onAskAgent, onAddComment }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    function formatText(format) {
        editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FORMAT_TEXT_COMMAND"], format);
    }
    function formatBlock(kind) {
        editor.update(()=>{
            const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) return;
            if (kind === "heading") (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$setBlocksType"])(selection, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$createHeadingNode"])("h2"));
            if (kind === "quote") (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$setBlocksType"])(selection, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$createQuoteNode"])());
            if (kind === "paragraph") (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$selection$2f$dist$2f$LexicalSelection$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["$setBlocksType"])(selection, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createParagraphNode"])());
        });
    }
    function addLink() {
        const url = window.prompt("Link URL");
        if (url === null) return;
        editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TOGGLE_LINK_COMMAND"], url.trim() || null);
    }
    function addComment() {
        let quote = "";
        editor.getEditorState().read(()=>{
            const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) quote = selection.getTextContent().trim();
        });
        if (!quote) {
            window.alert("Select the text that the comment applies to.");
            return;
        }
        const native = window.getSelection();
        onAddComment?.({
            quote,
            returnFocus: editor.getRootElement(),
            rect: native?.rangeCount ? native.getRangeAt(0).getBoundingClientRect() : null
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rich-toolbar",
        role: "toolbar",
        "aria-label": "Document formatting",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                "aria-label": "Block style",
                className: "select-input",
                onChange: (event)=>{
                    formatBlock(event.target.value);
                },
                style: {
                    width: 132,
                    padding: "5px 10px",
                    fontSize: 14,
                    borderRadius: 6
                },
                value: "paragraph",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "paragraph",
                        children: "Body text"
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "heading",
                        children: "Heading"
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "quote",
                        children: "Quote"
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "rich-toolbar-separator"
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                glyph: "b",
                label: "B",
                title: "Bold",
                onClick: ()=>formatText("bold")
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                glyph: "i",
                label: "I",
                title: "Italic",
                onClick: ()=>formatText("italic")
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                glyph: "u",
                label: "U",
                title: "Underline",
                onClick: ()=>formatText("underline")
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "rich-toolbar-separator"
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                label: "List",
                title: "Bullet list",
                onClick: ()=>editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_UNORDERED_LIST_COMMAND"], undefined)
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                label: "Numbered",
                title: "Numbered list",
                onClick: ()=>editor.dispatchCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INSERT_ORDERED_LIST_COMMAND"], undefined)
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                label: "Quote",
                title: "Quote",
                onClick: ()=>formatBlock("quote")
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                label: "Link",
                title: "Add or remove link",
                onClick: addLink
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            onAddComment ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolbarButton, {
                label: "Comment",
                title: "Add a comment to the selected text",
                onClick: addComment
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 208,
                columnNumber: 23
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "rich-toolbar-spacer"
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            onAskAgent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn agent tiny",
                type: "button",
                onClick: onAskAgent,
                children: "Ask Themis.ai to redraft"
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 211,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/MarkdownRichEditor.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
function MarkdownRichEditor({ markdown, onChange, onAskAgent, onAddComment, readOnly = false, reviewSegments, reviewComments = [], reviewMode = "current", reviewReviewers = new Set(), reviewTracking = false, reviewAuthor, onOpenCommentThread, onSelectionContext, documents = [], onOpenDocument }) {
    const initialConfig = {
        namespace: "ThemisAiMarkdownEditor",
        nodes: [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HeadingNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$rich$2d$text$2f$dist$2f$LexicalRichText$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["QuoteNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$list$2f$dist$2f$LexicalList$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListItemNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LinkNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$link$2f$dist$2f$LexicalLink$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AutoLinkNode"],
            __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RevisionTextNode"]
        ],
        theme: {
            heading: {
                h1: "rich-heading rich-heading-h1",
                h2: "rich-heading rich-heading-h2",
                h3: "rich-heading rich-heading-h3"
            },
            link: "rich-link",
            list: {
                listitem: "rich-list-item",
                nested: {
                    listitem: "rich-list-item-nested"
                },
                ol: "rich-list-ordered",
                ul: "rich-list-unordered"
            },
            paragraph: "rich-paragraph",
            quote: "rich-quote",
            text: {
                bold: "rich-bold",
                italic: "rich-italic",
                underline: "rich-underline"
            }
        },
        editorState: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$convertFromMarkdownString"])(markdown, MARKDOWN_TRANSFORMERS),
        editable: !readOnly,
        onError (error) {
            throw error;
        }
    };
    function openSavedDocumentLink(event) {
        const direct = event.target.closest("a");
        const focused = document.activeElement instanceof HTMLElement ? document.activeElement.closest("a") : null;
        const anchor = direct ?? focused;
        const href = anchor?.getAttribute("href");
        if (!href) return;
        const target = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$workspaceApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["documentForEditorHref"])(documents, href, window.location.origin);
        if (!target || !onOpenDocument) return;
        event.preventDefault();
        event.stopPropagation();
        onOpenDocument({
            document_id: target.document_id,
            path: target.path,
            revision: target.revision,
            origin: {
                surface: "draft",
                focus_id: anchor?.id || null,
                scroll_offset: window.scrollY
            }
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposer$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LexicalComposer"], {
        initialConfig: initialConfig,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rich-editor-shell",
                onClickCapture: openSavedDocumentLink,
                onKeyDownCapture: (event)=>{
                    if (event.key === "Enter") openSavedDocumentLink(event);
                },
                children: [
                    readOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EditorToolbar, {
                        onAddComment: onAddComment,
                        onAskAgent: onAskAgent
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 296,
                        columnNumber: 28
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rich-editor-surface",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalRichTextPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RichTextPlugin"], {
                            contentEditable: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalContentEditable$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ContentEditable"], {
                                className: "rich-content"
                            }, void 0, false, {
                                fileName: "[project]/components/MarkdownRichEditor.tsx",
                                lineNumber: 299,
                                columnNumber: 30
                            }, this),
                            placeholder: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rich-placeholder",
                                children: "Start drafting…"
                            }, void 0, false, {
                                fileName: "[project]/components/MarkdownRichEditor.tsx",
                                lineNumber: 300,
                                columnNumber: 26
                            }, this),
                            ErrorBoundary: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalErrorBoundary$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LexicalErrorBoundary"]
                        }, void 0, false, {
                            fileName: "[project]/components/MarkdownRichEditor.tsx",
                            lineNumber: 298,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalAutoLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["AutoLinkPlugin"], {
                matchers: AUTO_LINK_MATCHERS
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SavedDocumentLinkKeyboardAccess, {
                documents: documents
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            readOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentEndShortcut, {}, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 307,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalClickableLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClickableLinkPlugin"], {}, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 308,
                columnNumber: 7
            }, this),
            reviewSegments && reviewAuthor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionPlugin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                comments: reviewComments,
                markdown: markdown,
                mode: reviewMode,
                onOpenThread: onOpenCommentThread ?? (()=>undefined),
                onSelectionContext: onSelectionContext ?? (()=>undefined),
                readOnly: readOnly,
                reviewers: reviewReviewers,
                segments: reviewSegments,
                tracking: reviewTracking,
                trackingAuthor: reviewAuthor
            }, void 0, false, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 309,
                columnNumber: 41
            }, this) : null,
            readOnly ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalHistoryPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HistoryPlugin"], {}, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalListPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListPlugin"], {}, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalLinkPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LinkPlugin"], {}, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalMarkdownShortcutPlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MarkdownShortcutPlugin"], {
                        transformers: MARKDOWN_TRANSFORMERS
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalOnChangePlugin$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OnChangePlugin"], {
                        ignoreSelectionChange: true,
                        onChange: (editorState, _editor, tags)=>{
                            if (!tags.has(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionPlugin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVIEW_SYNC_TAG"])) editorState.read(()=>onChange?.((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$markdown$2f$dist$2f$LexicalMarkdown$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$convertToMarkdownString"])(MARKDOWN_TRANSFORMERS).replaceAll(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionPlugin$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REVISION_BOUNDARY"], "")));
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/MarkdownRichEditor.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MarkdownRichEditor.tsx",
                lineNumber: 311,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MarkdownRichEditor.tsx",
        lineNumber: 288,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/MatterTree.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatterTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$matterBrief$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/matterBrief.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function TreeNode({ node, activePath, onNewChat, onSelect, depth = 0 }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(depth === 0 && isCoreFolder(node.name));
    if (node.type === "folder") {
        const folderLabel = treeLabel(node);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "tree-folder-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "aria-expanded": open,
                            "aria-label": `${open ? "Collapse" : "Expand"} ${folderLabel}`,
                            className: "tree-row",
                            onClick: ()=>setOpen((value)=>!value),
                            type: "button",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "tree-folder",
                                children: [
                                    open ? "▾" : "▸",
                                    " ",
                                    folderLabel
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/MatterTree.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/MatterTree.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        node.name === "conversations" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "aria-label": "New chat",
                            className: "tree-add",
                            onClick: onNewChat,
                            title: "New chat",
                            type: "button",
                            children: "+"
                        }, void 0, false, {
                            fileName: "[project]/components/MatterTree.tsx",
                            lineNumber: 36,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MatterTree.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                open && node.children ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "tree-indent",
                    children: [
                        node.name === "matter-records" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "tree-group-help",
                            children: "Structured records captured from intake, documents, chat, lawyer edits, and system actions."
                        }, void 0, false, {
                            fileName: "[project]/components/MatterTree.tsx",
                            lineNumber: 42,
                            columnNumber: 15
                        }, this) : null,
                        node.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeNode, {
                                node: child,
                                activePath: activePath,
                                onNewChat: onNewChat,
                                onSelect: onSelect,
                                depth: depth + 1
                            }, child.path, false, {
                                fileName: "[project]/components/MatterTree.tsx",
                                lineNumber: 45,
                                columnNumber: 15
                            }, this)),
                        node.name === "conversations" && !node.children.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "tree-empty",
                            children: "No saved chats"
                        }, void 0, false, {
                            fileName: "[project]/components/MatterTree.tsx",
                            lineNumber: 47,
                            columnNumber: 71
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/MatterTree.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/components/MatterTree.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this);
    }
    const kind = node.record_type === "chat_transcript" ? "conversation" : node.path.includes("/research/") || node.path.includes("/drafts/") ? "agent" : node.extension === ".md" ? "human" : "source";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `tree-row ${activePath === node.path ? "active" : ""}`,
        onClick: ()=>onSelect(node.path),
        title: node.label ?? node.name,
        type: "button",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `tree-dot ${kind}`
            }, void 0, false, {
                fileName: "[project]/components/MatterTree.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                },
                children: treeLabel(node)
            }, void 0, false, {
                fileName: "[project]/components/MatterTree.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MatterTree.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
function isCoreFolder(name) {
    return [
        "documents",
        "research",
        "work-product"
    ].includes(name);
}
function treeLabel(node) {
    if (node.name === "request.md") return "Original request";
    if (node.name === "documents") return "Documents";
    if (node.name === "research") return "Research";
    if (node.name === "work-product") return "Work product";
    if (node.name === "drafts") return "Legacy Drafts";
    if (node.name === "draft") return "Draft";
    if (node.name === "final") return "Final";
    if (node.name === "dossier.md") return "Dossier";
    if (node.name === "conversations") return "Chats";
    if (node.name === "matter-records") return "Matter Records";
    return node.label ?? node.name;
}
const RECORD_LABELS = {
    "matter.md": "Matter details",
    "facts.md": "Facts, sources & assumptions",
    "issues.md": "Issue map",
    "participants.md": "People & roles",
    "recommendations.md": "Working recommendations",
    "work-items": "Work to do",
    "decisions": "Recorded decisions",
    "events": "Activity history",
    "dossier-revisions": "Dossier revisions"
};
const DIRECT_ORDER = [
    "request.md",
    "documents",
    "conversations",
    "research",
    "work-product",
    "dossier.md",
    "drafts"
];
function presentMatterTree(tree) {
    const conversations = tree.find((node)=>node.type === "folder" && node.name === "conversations") ?? {
        name: "conversations",
        label: "Chats",
        path: "",
        type: "folder",
        children: []
    };
    const nodes = tree.includes(conversations) ? tree : [
        conversations,
        ...tree
    ];
    const byName = new Map(nodes.map((node)=>[
            node.name,
            node
        ]));
    const direct = DIRECT_ORDER.flatMap((name)=>{
        const node = byName.get(name);
        return node ? [
            {
                ...node,
                label: treeLabel(node)
            }
        ] : [];
    });
    const records = Object.entries(RECORD_LABELS).flatMap(([name, label])=>{
        const node = byName.get(name);
        return node ? [
            {
                ...node,
                label
            }
        ] : [];
    });
    const groupedNames = new Set([
        ...DIRECT_ORDER,
        ...Object.keys(RECORD_LABELS)
    ]);
    const remaining = nodes.filter((node)=>!groupedNames.has(node.name));
    const matterRecords = {
        name: "matter-records",
        label: "Matter Records",
        path: "virtual:matter-records",
        type: "folder",
        children: records
    };
    return [
        ...direct,
        matterRecords,
        ...remaining
    ];
}
function MatterTree({ tree, activePath, onNewChat, onSelect, onUpload, uploading }) {
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const visibleTree = presentMatterTree((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$matterBrief$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["userFacingMatterTree"])(tree));
    async function uploadFromInput(event) {
        const file = event.target.files?.[0];
        if (file) await onUpload(file);
        event.target.value = "";
    }
    async function drop(event) {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) await onUpload(file);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "tree",
                children: visibleTree.map((node)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeNode, {
                        node: node,
                        activePath: activePath,
                        onNewChat: onNewChat,
                        onSelect: onSelect
                    }, node.path || node.name, false, {
                        fileName: "[project]/components/MatterTree.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/MatterTree.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `drop-zone ${dragging ? "active" : ""}`,
                onDragEnter: (event)=>{
                    event.preventDefault();
                    setDragging(true);
                },
                onDragOver: (event)=>event.preventDefault(),
                onDragLeave: ()=>setDragging(false),
                onDrop: drop,
                children: [
                    uploading ? "Uploading and extracting…" : "Drop a PDF, Word file, Markdown or text here",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 10
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "btn compact",
                            style: {
                                display: "inline-block"
                            },
                            children: [
                                "Choose a file",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    hidden: true,
                                    type: "file",
                                    onChange: uploadFromInput,
                                    accept: ".md,.txt,.pdf,.docx"
                                }, void 0, false, {
                                    fileName: "[project]/components/MatterTree.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/MatterTree.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/MatterTree.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/MatterTree.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/MatterTree.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Phase2Icon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Phase2Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const paths = {
    Today: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
    Briefing: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7",
    Workspace: "M3 7h7l2-3h9v16H3z",
    Matters: "M3 6h7l2 3h9v11H3z",
    Decisions: "M12 3v18M7 21h10M4 7h16M6 7l-4 8h8zM18 7l-4 8h8z",
    Skills: "m2 8 10-5 10 5-10 5zM6 10v7l6 3 6-3v-7M22 8v8",
    "Experimental chat": "M4 5h16v11H7l-3 3zM8 9h8M8 12h5",
    Automations: "m13 2-9 12h7l-1 8 10-13h-7z",
    Agents: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3",
    Settings: "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
};
function Phase2Icon({ name, size = 21 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        "aria-hidden": "true",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: paths[name] ?? paths.Briefing
        }, void 0, false, {
            fileName: "[project]/components/Phase2Icon.tsx",
            lineNumber: 14,
            columnNumber: 178
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Phase2Icon.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/Phase2Shell.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Phase2Shell-module__kwQYFG__active",
  "brand": "Phase2Shell-module__kwQYFG__brand",
  "header": "Phase2Shell-module__kwQYFG__header",
  "identity": "Phase2Shell-module__kwQYFG__identity",
  "link": "Phase2Shell-module__kwQYFG__link",
  "nav": "Phase2Shell-module__kwQYFG__nav",
  "root": "Phase2Shell-module__kwQYFG__root",
});
}),
"[project]/components/RecommendationPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecommendationPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterIcon.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterWork.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
function RecommendationPanel({ matterId, recommendation, lawyerActor, disabled = false, onChanged }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(recommendation);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(state.content);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>state.versions?.find((version)=>version.version_id === state.current_version_id), [
        state.current_version_id,
        state.versions
    ]);
    const isLegacy = !state.current_version_id;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setState(recommendation);
        setDraft(recommendation.content);
    }, [
        recommendation
    ]);
    async function saveLawyerEdit() {
        if (!draft.trim()) return;
        setBusy(true);
        setError("");
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateRecommendation"])(matterId, draft, lawyerActor.trim() || "Lawyer");
            setState(result.data);
            setDraft(result.data.content);
            await onChanged?.(result.data);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not save the recommendation.");
        } finally{
            setBusy(false);
        }
    }
    async function acceptProposal() {
        setBusy(true);
        setError("");
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["acceptRecommendation"])(matterId, lawyerActor.trim() || "Lawyer");
            setState(result.data);
            setDraft(result.data.content);
            await onChanged?.(result.data);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not accept the recommendation update.");
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: `matter-recommendation ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendation}`,
        "aria-label": "Working recommendation",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendationHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `matter-recommendation-label ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendationLabel}`,
                                children: "Working recommendation"
                            }, void 0, false, {
                                fileName: "[project]/components/RecommendationPanel.tsx",
                                lineNumber: 73,
                                columnNumber: 60
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendationVersion,
                                children: isLegacy ? "Legacy recommendation · version history starts when counsel saves" : versionLabel(current)
                            }, void 0, false, {
                                fileName: "[project]/components/RecommendationPanel.tsx",
                                lineNumber: 73,
                                columnNumber: 165
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RecommendationPanel.tsx",
                        lineNumber: 73,
                        columnNumber: 55
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        name: "sparkles",
                        size: 23
                    }, void 0, false, {
                        fileName: "[project]/components/RecommendationPanel.tsx",
                        lineNumber: 73,
                        columnNumber: 327
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `matter-record-note ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recordNote}`,
                children: "This saved recommendation is not a recorded decision."
            }, void 0, false, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                "aria-label": "Working recommendation",
                className: `text-input prose ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendationEditor}`,
                disabled: disabled || busy,
                onChange: (event)=>setDraft(event.target.value),
                value: draft
            }, void 0, false, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: `btn primary compact ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recommendationAction}`,
                disabled: disabled || busy || !draft.trim() || draft.trim() === state.content.trim(),
                onClick: ()=>void saveLawyerEdit(),
                type: "button",
                children: busy ? "Saving…" : "Save lawyer edit"
            }, void 0, false, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            state.proposal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `matter-lifecycle-action ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].proposal}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: proposalLabel(state.proposal)
                    }, void 0, false, {
                        fileName: "[project]/components/RecommendationPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: state.proposal.content
                    }, void 0, false, {
                        fileName: "[project]/components/RecommendationPanel.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn review compact",
                        disabled: disabled || busy,
                        onClick: ()=>void acceptProposal(),
                        type: "button",
                        children: "Accept recommendation update"
                    }, void 0, false, {
                        fileName: "[project]/components/RecommendationPanel.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 91,
                columnNumber: 9
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `error ${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].errorMessage}`,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/RecommendationPanel.tsx",
                lineNumber: 99,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/RecommendationPanel.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
function versionLabel(version) {
    if (!version) return "Saved recommendation";
    return `Version ${version.number} · ${version.actor} · ${originLabel(version.origin)}`;
}
function proposalLabel(proposal) {
    return `Proposed · ${proposal.actor} · ${originLabel(proposal.origin)}`;
}
function originLabel(origin) {
    return ({
        initial_agent: "Initial agent draft",
        lawyer_edit: "Lawyer edit",
        agent_proposal: "Agent proposal"
    })[origin];
}
}),
"[project]/components/RecordDecisionModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RecordDecisionModal,
    "pathConditions",
    ()=>pathConditions,
    "submittedMapBasis",
    ()=>submittedMapBasis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/recommendations.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function RecordDecisionModal({ detail, suggestion, basis, basisLabels = {}, lawyerAuthor, pathPrefill, onClose, onRecorded }) {
    const initialDecision = pathPrefill?.option.title.trim() || suggestion.trim();
    const [chosenPath, setChosenPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialDecision);
    const [rationale, setRationale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [disposition, setDisposition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(detail.recommendation?.current_version_id ? "followed" : "not_applicable");
    const [dispositionReason, setDispositionReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [conditions, setConditions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>pathPrefill ? pathConditions(pathPrefill) : "");
    const [notDecided, setNotDecided] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [linkedBasis, setLinkedBasis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(basis);
    const [failedPublicResearch, setFailedPublicResearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [decider, setDecider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(lawyerAuthor?.trim() || detail.legal_owner || "");
    const [reviewAt, setReviewAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultReview());
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [created, setCreated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [createdId, setCreatedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [recorded, setRecorded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [historicalBasisAccepted, setHistoricalBasisAccepted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [basisConflict, setBasisConflict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uncertainSave, setUncertainSave] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const sourceActionKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingSubmission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const historicalBasisRequired = Boolean(pathPrefill && (basisConflict || pathPrefill.state === "needs_review" || pathPrefill.state === "historical"));
    const formLocked = busy || created || recorded || uncertainSave;
    function edit(update) {
        if (uncertainSave) return;
        pendingSubmission.current = null;
        sourceActionKey.current = null;
        setError("");
        update();
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        void Promise.all(basis.filter((path)=>path.includes("/research/")).map(async (path)=>{
            try {
                const document = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFile"])(path);
                const status = document.metadata.public_research_status;
                return status === "failed" || status === "unavailable" ? path : null;
            } catch  {
                return null;
            }
        })).then((paths)=>{
            if (active) setFailedPublicResearch(paths.filter((path)=>Boolean(path)));
        });
        return ()=>{
            active = false;
        };
    }, [
        basis
    ]);
    async function record() {
        if (!chosenPath.trim()) {
            setError("Say what was decided.");
            return;
        }
        if (!decider.trim()) {
            setError("Enter who made the decision.");
            return;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recommendationNeedsReason"])(disposition) && !dispositionReason.trim()) {
            setError("Give a short reason for modifying or not following the recommendation.");
            return;
        }
        let decisionCreated = created;
        let decisionId = createdId;
        setBusy(true);
        setError("");
        try {
            if (!created) {
                const submission = pendingSubmission.current ?? (()=>{
                    sourceActionKey.current ||= `decision:ui:${crypto.randomUUID()}`;
                    const payload = {
                        matter_id: detail.matter_id,
                        title: detail.title,
                        chosen_path: chosenPath.trim(),
                        rationale: rationale.trim(),
                        decision_maker: decider.trim(),
                        risk_level: detail.risk_level,
                        next_review_at: reviewAt || null,
                        conditions: lines(conditions),
                        not_decided: lines(notDecided),
                        linked_paths: linkedBasis,
                        source_action_key: sourceActionKey.current,
                        recommendation_disposition: disposition,
                        recommendation_disposition_reason: dispositionReason.trim(),
                        recommendation_version_id: detail.recommendation?.current_version_id ?? null,
                        ...pathPrefill ? {
                            map_basis: submittedMapBasis(pathPrefill.map_basis, historicalBasisAccepted)
                        } : {}
                    };
                    return {
                        payload,
                        sourceActionKey: sourceActionKey.current
                    };
                })();
                pendingSubmission.current = submission;
                const saved = await (pathPrefill?.revises_decision_id ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["revisePathDecision"])(pathPrefill.revises_decision_id, submission.payload) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDecision"])(submission.payload));
                decisionCreated = true;
                decisionId = saved.decision_id;
                setCreated(true);
                setCreatedId(saved.decision_id);
                setUncertainSave(false);
            }
            const register = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDecisions"])();
            if (!decisionId || !register.decisions.some((decision)=>decision.decision_id === decisionId)) {
                throw new Error("The decision file was saved, but it is not yet visible in the decision register. Retry confirmation.");
            }
            await onRecorded();
            setRecorded(true);
            setBusy(false);
        } catch (caught) {
            const message = errorMessage(caught, decisionCreated ? "The decision was saved, but the matter did not refresh." : "Could not record the decision.");
            const status = errorStatus(caught);
            const code = errorCode(caught);
            if (!decisionCreated && status === 409 && code !== "action_key_conflict") {
                pendingSubmission.current = null;
                sourceActionKey.current = null;
                setBasisConflict(Boolean(pathPrefill));
                setUncertainSave(false);
            } else if (!decisionCreated && (status === 400 || status === 404 || status === 422)) {
                pendingSubmission.current = null;
                sourceActionKey.current = null;
                setUncertainSave(false);
            } else if (!decisionCreated) {
                setUncertainSave(true);
            }
            setError(message);
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-scrim",
        onClick: (event)=>{
            if (!busy && !uncertainSave && event.target === event.currentTarget) onClose();
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "modal",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "Record durable decision",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-head",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            children: "Record a durable decision"
                        }, void 0, false, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Use this for a material position, recurring risk, future advice, or a condition that must be monitored."
                        }, void 0, false, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RecordDecisionModal.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-body",
                    children: [
                        recorded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mutation-status recorded",
                            role: "status",
                            children: "Decision recorded. The refreshed matter and decision register now include it."
                        }, void 0, false, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 161,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-label",
                                    children: [
                                        "Decision ",
                                        initialDecision && chosenPath === initialDecision ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "field-source",
                                            children: "Themis.ai draft"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 166,
                                            columnNumber: 104
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    "aria-label": "Decision",
                                    autoFocus: true,
                                    className: "text-input prose",
                                    disabled: formLocked,
                                    onChange: (event)=>edit(()=>setChosenPath(event.target.value)),
                                    style: {
                                        minHeight: 96
                                    },
                                    value: chosenPath
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, this),
                                pathPrefill && chosenPath.trim() !== pathPrefill.option.title.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-help",
                                    children: "Your wording differs from the saved path. The exact saved path remains linked as the decision map basis."
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 176,
                                    columnNumber: 85
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this),
                        pathPrefill ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "warning-callout",
                            role: "status",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "btn-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Decision map basis"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 181,
                                            columnNumber: 40
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `state-label ${historicalBasisRequired || pathPrefill.hypothetical ? "state-attention" : "state-agent"}`,
                                            children: pathPrefill.hypothetical ? "Hypothetical" : historicalBasisRequired ? pathPrefill.state === "historical" ? "Historical" : "Needs review" : "Saved"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 181,
                                            columnNumber: 75
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 181,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        margin: "7px 0 0"
                                    },
                                    children: [
                                        pathPrefill.analysis.display_title || pathPrefill.option.title,
                                        " · analysis ",
                                        pathPrefill.analysis.analysis_revision
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 182,
                                    columnNumber: 15
                                }, this),
                                historicalBasisRequired ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: "flex",
                                        gap: 8,
                                        marginTop: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            checked: historicalBasisAccepted,
                                            disabled: formLocked,
                                            onChange: (event)=>edit(()=>setHistoricalBasisAccepted(event.target.checked)),
                                            type: "checkbox"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 183,
                                            columnNumber: 100
                                        }, this),
                                        " Use this saved historical basis even though newer analysis may be needed."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 183,
                                    columnNumber: 42
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-label",
                                    children: "Recommendation disposition"
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    "aria-label": "Recommendation disposition",
                                    className: "text-input",
                                    disabled: formLocked,
                                    onChange: (event)=>edit(()=>setDisposition(event.target.value)),
                                    value: disposition,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "followed",
                                            children: "Followed"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 190,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "modified",
                                            children: "Modified"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "not_followed",
                                            children: "Not followed"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "not_applicable",
                                            children: "Not applicable"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 193,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recommendationNeedsReason"])(disposition) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "aria-label": "Reason for recommendation disposition",
                                    className: "text-input",
                                    disabled: formLocked,
                                    onChange: (event)=>edit(()=>setDispositionReason(event.target.value)),
                                    placeholder: "Short reason",
                                    value: dispositionReason
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 196,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-label",
                                    children: "Rationale"
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    "aria-label": "Rationale",
                                    className: "text-input prose",
                                    disabled: formLocked,
                                    onChange: (event)=>edit(()=>setRationale(event.target.value)),
                                    style: {
                                        minHeight: 88
                                    },
                                    value: rationale
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-help",
                                    children: "Optional. Explain why this decision was made."
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 200,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 14
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-label",
                                            children: "Conditions"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            "aria-label": "Conditions",
                                            className: "text-input prose",
                                            disabled: formLocked,
                                            onChange: (event)=>edit(()=>setConditions(event.target.value)),
                                            placeholder: "One condition per line",
                                            value: conditions
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-label",
                                            children: "Issues this decision does not resolve"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            "aria-label": "Issues this decision does not resolve",
                                            className: "text-input prose",
                                            disabled: formLocked,
                                            onChange: (event)=>edit(()=>setNotDecided(event.target.value)),
                                            placeholder: "One open point per line",
                                            value: notDecided
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 220,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-help",
                                            children: "Optional. List issues that remain open after this decision."
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 221,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 14
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-label",
                                            children: "Decided by"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 227,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            "aria-label": "Decided by",
                                            className: "text-input",
                                            disabled: formLocked,
                                            onChange: (event)=>edit(()=>setDecider(event.target.value)),
                                            value: decider
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 228,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "field-label",
                                            children: "Revisit on"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 231,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            "aria-label": "Revisit on",
                                            className: "text-input",
                                            disabled: formLocked,
                                            onChange: (event)=>edit(()=>setReviewAt(event.target.value)),
                                            type: "date",
                                            value: reviewAt
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 232,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 6,
                                                font: "400 13px var(--sans)",
                                                color: "var(--ink-5)"
                                            },
                                            children: reviewAt ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatLongDay"])(reviewAt) : "No review date"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 233,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "field-label",
                                    children: "What it rests on"
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 7
                                    },
                                    children: [
                                        linkedBasis.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "faint small",
                                            children: "Nothing linked yet."
                                        }, void 0, false, {
                                            fileName: "[project]/components/RecordDecisionModal.tsx",
                                            lineNumber: 243,
                                            columnNumber: 17
                                        }, this) : null,
                                        linkedBasis.map((path)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "basis-tag",
                                                title: path,
                                                children: [
                                                    basisLabel(path, basisLabels),
                                                    failedPublicResearch.includes(path) ? " · Public research failed" : "",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        "aria-label": `Remove ${basisLabel(path, basisLabels)}`,
                                                        disabled: formLocked,
                                                        onClick: ()=>edit(()=>setLinkedBasis((current)=>current.filter((item)=>item !== path))),
                                                        type: "button",
                                                        children: "×"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/RecordDecisionModal.tsx",
                                                        lineNumber: 249,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, path, true, {
                                                fileName: "[project]/components/RecordDecisionModal.tsx",
                                                lineNumber: 246,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this),
                        error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "error",
                            style: {
                                margin: 0
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 255,
                            columnNumber: 20
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RecordDecisionModal.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-foot",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                font: "400 13.5px var(--sans)",
                                color: "var(--ink-4)"
                            },
                            children: recorded ? "Saved and confirmed after the matter reloaded." : created ? "Decision saved. Refresh confirmation is still needed." : uncertainSave ? "The save result is uncertain. Retry uses the same request and action key." : "Recorded against this matter and the decision register."
                        }, void 0, false, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "btn-row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: recorded ? "btn primary" : "btn",
                                    disabled: busy || uncertainSave,
                                    onClick: onClose,
                                    children: created ? "Close" : "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                recorded ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn primary",
                                    disabled: busy || !chosenPath.trim() || !decider.trim() || historicalBasisRequired && !historicalBasisAccepted || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$recommendations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recommendationNeedsReason"])(disposition) && !dispositionReason.trim(),
                                    onClick: ()=>void record(),
                                    children: busy ? created ? "Refreshing…" : "Recording and refreshing…" : created ? "Retry refresh" : uncertainSave ? "Retry recording" : "Record durable decision"
                                }, void 0, false, {
                                    fileName: "[project]/components/RecordDecisionModal.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RecordDecisionModal.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RecordDecisionModal.tsx",
                    lineNumber: 258,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/RecordDecisionModal.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/RecordDecisionModal.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
function defaultReview() {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function lines(value) {
    return value.split("\n").map((item)=>item.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
}
function submittedMapBasis(basis, useHistoricalBasis) {
    const { canonical_option: _canonicalOption, input_basis: _inputBasis, use_historical_basis: _historical, ...identifiers } = basis;
    return useHistoricalBasis ? {
        ...identifiers,
        use_historical_basis: true
    } : identifiers;
}
function pathConditions(prefill) {
    const rows = [
        prefill.option.condition_summary.trim()
    ];
    for (const requirement of prefill.option.requirements){
        const condition = prefill.analysis.conditions.find((item)=>item.condition_id === requirement.condition_id);
        rows.push(`${condition?.question || requirement.condition_id} — must be ${requirement.state === "met" ? "met" : "not met"}`);
    }
    return [
        ...new Set(rows.filter(Boolean))
    ].join("\n");
}
function errorMessage(caught, fallback) {
    if (caught && typeof caught === "object" && "message" in caught && typeof caught.message === "string") return caught.message;
    return fallback;
}
function errorStatus(caught) {
    if (!caught || typeof caught !== "object" || !("status" in caught) || typeof caught.status !== "number") return null;
    return caught.status;
}
function errorCode(caught) {
    if (!caught || typeof caught !== "object" || !("detail" in caught) || !caught.detail || typeof caught.detail !== "object" || !("code" in caught.detail) || typeof caught.detail.code !== "string") return null;
    return caught.detail.code;
}
function basisLabel(path, labels) {
    if (labels[path]?.trim()) return labels[path].trim();
    const name = path.split("/").at(-1) || path;
    return name.replace(/\.(?:md|pdf|docx)$/i, "").replace(/[-_]+/g, " ");
}
}),
"[project]/components/ResearchPhase2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "back": "ResearchPhase2-module__MIvzcW__back",
  "byline": "ResearchPhase2-module__MIvzcW__byline",
  "citation": "ResearchPhase2-module__MIvzcW__citation",
  "eyebrow": "ResearchPhase2-module__MIvzcW__eyebrow",
  "header": "ResearchPhase2-module__MIvzcW__header",
  "layout": "ResearchPhase2-module__MIvzcW__layout",
  "memo": "ResearchPhase2-module__MIvzcW__memo",
  "memoBody": "ResearchPhase2-module__MIvzcW__memoBody",
  "noteAnswer": "ResearchPhase2-module__MIvzcW__noteAnswer",
  "noteCard": "ResearchPhase2-module__MIvzcW__noteCard",
  "noteInput": "ResearchPhase2-module__MIvzcW__noteInput",
  "noteQuote": "ResearchPhase2-module__MIvzcW__noteQuote",
  "page": "ResearchPhase2-module__MIvzcW__page",
  "panelLabel": "ResearchPhase2-module__MIvzcW__panelLabel",
  "queueControls": "ResearchPhase2-module__MIvzcW__queueControls",
  "queueHeader": "ResearchPhase2-module__MIvzcW__queueHeader",
  "queueIcon": "ResearchPhase2-module__MIvzcW__queueIcon",
  "queueItem": "ResearchPhase2-module__MIvzcW__queueItem",
  "queueItemActions": "ResearchPhase2-module__MIvzcW__queueItemActions",
  "queueItemTitle": "ResearchPhase2-module__MIvzcW__queueItemTitle",
  "queueItems": "ResearchPhase2-module__MIvzcW__queueItems",
  "queueMetadata": "ResearchPhase2-module__MIvzcW__queueMetadata",
  "queueNotice": "ResearchPhase2-module__MIvzcW__queueNotice",
  "queueState": "ResearchPhase2-module__MIvzcW__queueState",
  "queueSummary": "ResearchPhase2-module__MIvzcW__queueSummary",
  "queueSupportCount": "ResearchPhase2-module__MIvzcW__queueSupportCount",
  "rail": "ResearchPhase2-module__MIvzcW__rail",
  "railBody": "ResearchPhase2-module__MIvzcW__railBody",
  "researchQueue": "ResearchPhase2-module__MIvzcW__researchQueue",
  "return": "ResearchPhase2-module__MIvzcW__return",
  "snapshotNotice": "ResearchPhase2-module__MIvzcW__snapshotNotice",
  "sourcePosition": "ResearchPhase2-module__MIvzcW__sourcePosition",
  "sourceQuote": "ResearchPhase2-module__MIvzcW__sourceQuote",
  "sourceTitle": "ResearchPhase2-module__MIvzcW__sourceTitle",
  "summary": "ResearchPhase2-module__MIvzcW__summary",
  "support": "ResearchPhase2-module__MIvzcW__support",
  "tabs": "ResearchPhase2-module__MIvzcW__tabs",
  "title": "ResearchPhase2-module__MIvzcW__title",
});
}),
"[project]/components/ResearchQueuePanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ResearchQueuePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$researchQueue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/researchQueue.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterIcon.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterWork.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/ResearchPhase2.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
function ResearchQueuePanel({ items, mode = "controls", presentation = "matter", busy = false, enteredQuestion = "", savedQuestions = [], selectedQuestion = "", packetHref = (path)=>`?file=${encodeURIComponent(path)}`, onEnteredQuestion, onMove, onResume, onStop, onRetry, onRun, onContinueFromPartial, onUpdateDraftFromSavedResearch, onSelectedQuestion, showDraftSnapshotNotice = false }) {
    const styles = presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"];
    const pending = items.filter((item)=>item.state === "queued");
    const interrupted = items.some((item)=>item.state === "interrupted");
    const active = items.some((item)=>item.state === "queued" || item.state === "running");
    const canControl = mode === "controls";
    const aggregate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$researchQueue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchQueueAggregate"])(items);
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Date.now());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!items.some((item)=>item.state === "running")) return;
        const timer = window.setInterval(()=>setNow(Date.now()), 1000);
        return ()=>window.clearInterval(timer);
    }, [
        items
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: styles.researchQueue,
        "aria-label": "Research queue",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: styles.queueHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `field-label ${styles.panelLabel}`,
                                children: "Research queue"
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 67,
                                columnNumber: 49
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `setting-help ${styles.queueSummary}`,
                                role: "status",
                                children: [
                                    aggregate.runCount,
                                    " ",
                                    aggregate.runCount === 1 ? "run" : "runs",
                                    " · ",
                                    aggregate.activeCount,
                                    " active · ",
                                    aggregate.savedPacketCount,
                                    " saved ",
                                    aggregate.savedPacketCount === 1 ? "packet" : "packets"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 67,
                                columnNumber: 121
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 67,
                        columnNumber: 44
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: styles.queueSupportCount,
                        children: [
                            aggregate.supportCount,
                            " saved ",
                            aggregate.supportCount === 1 ? "source" : "sources"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 67,
                        columnNumber: 390
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchQueuePanel.tsx",
                lineNumber: 67,
                columnNumber: 5
            }, this),
            showDraftSnapshotNotice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `matter-lifecycle-action ${styles.snapshotNotice}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "This draft is a saved snapshot"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 69,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "New research does not change this draft automatically."
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 70,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn quiet compact",
                        disabled: busy || !onUpdateDraftFromSavedResearch || aggregate.savedPacketCount === 0,
                        onClick: onUpdateDraftFromSavedResearch,
                        type: "button",
                        children: "Update draft from saved research"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 71,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchQueuePanel.tsx",
                lineNumber: 68,
                columnNumber: 32
            }, this) : null,
            canControl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `btn-row ${styles.queueControls}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "select-input",
                        onChange: (event)=>onSelectedQuestion?.(event.target.value),
                        value: selectedQuestion,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select a saved question"
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 75,
                                columnNumber: 9
                            }, this),
                            savedQuestions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.text,
                                    children: item.text
                                }, item.id, false, {
                                    fileName: "[project]/components/ResearchQueuePanel.tsx",
                                    lineNumber: 76,
                                    columnNumber: 39
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 74,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "text-input",
                        onChange: (event)=>onEnteredQuestion?.(event.target.value),
                        placeholder: "Or enter a research question",
                        value: enteredQuestion
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 78,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn agent compact",
                        disabled: busy || !onRun,
                        onClick: ()=>void onRun?.(),
                        children: "Run research"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 79,
                        columnNumber: 7
                    }, this),
                    interrupted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn compact",
                        disabled: busy || !onResume,
                        onClick: ()=>void onResume?.(),
                        children: "Resume research"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 80,
                        columnNumber: 22
                    }, this) : null,
                    active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn quiet compact",
                        disabled: busy || !onStop,
                        onClick: ()=>void onStop?.(),
                        children: "Stop research"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 81,
                        columnNumber: 17
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchQueuePanel.tsx",
                lineNumber: 73,
                columnNumber: 19
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: styles.queueItems,
                children: items.map((item)=>{
                    const packetPath = item.results?.[0]?.path;
                    const partial = item.state === "completed" && item.status.startsWith("Partial");
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `setting-help ${styles.queueItem}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: styles.queueIcon,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    name: partial ? "sparkles" : item.state === "completed" ? "book" : item.state === "failed" ? "history" : "search",
                                    size: 22
                                }, void 0, false, {
                                    fileName: "[project]/components/ResearchQueuePanel.tsx",
                                    lineNumber: 88,
                                    columnNumber: 46
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.queueItemTitle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.question ?? item.questions?.[0] ?? "Research question"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 88,
                                        columnNumber: 231
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: styles.queueMetadata,
                                        children: [
                                            "Queue order ",
                                            item.queue_order ?? item.priority ?? "—",
                                            " · ",
                                            item.run_id,
                                            " · Support: ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$researchQueue$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchSupportLabel"])(item)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 88,
                                        columnNumber: 305
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 88,
                                columnNumber: 192
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: styles.queueState,
                                "data-state": partial ? "partial" : item.state,
                                children: researchQueueStateWord(item)
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: styles.queueItemActions,
                                children: [
                                    item.state === "running" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: styles.queueNotice,
                                        children: [
                                            researchElapsed(item, now),
                                            " elapsed",
                                            packetPath ? " · saved packet available" : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 90,
                                        columnNumber: 80
                                    }, this) : null,
                                    partial ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: styles.queueNotice,
                                        children: "Partial research is saved"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 91,
                                        columnNumber: 22
                                    }, this) : null,
                                    canControl && item.state === "queued" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn compact",
                                                disabled: busy || !onMove || pending[0]?.run_id === item.run_id,
                                                onClick: ()=>void onMove?.(item.run_id, -1),
                                                children: "Up"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                                lineNumber: 93,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "btn compact",
                                                disabled: busy || !onMove || pending.at(-1)?.run_id === item.run_id,
                                                onClick: ()=>void onMove?.(item.run_id, 1),
                                                children: "Down"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                                lineNumber: 94,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 52
                                    }, this) : null,
                                    packetPath ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: packetHref(packetPath),
                                        children: "Open packet"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 96,
                                        columnNumber: 25
                                    }, this) : null,
                                    item.state === "failed" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet compact",
                                        disabled: busy || !onRetry,
                                        onClick: ()=>void onRetry?.(item.run_id),
                                        type: "button",
                                        children: "Retry"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 97,
                                        columnNumber: 38
                                    }, this) : null,
                                    partial && onContinueFromPartial ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "btn quiet compact",
                                        onClick: ()=>onContinueFromPartial(item),
                                        type: "button",
                                        children: "Continue from saved research"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                                        lineNumber: 98,
                                        columnNumber: 47
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchQueuePanel.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, item.run_id, true, {
                        fileName: "[project]/components/ResearchQueuePanel.tsx",
                        lineNumber: 87,
                        columnNumber: 16
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/ResearchQueuePanel.tsx",
                lineNumber: 83,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ResearchQueuePanel.tsx",
        lineNumber: 66,
        columnNumber: 10
    }, this);
}
function researchElapsed(item, now) {
    const started = Date.parse(item.started_at || item.created_at || "");
    const seconds = Number.isFinite(started) ? Math.max(0, Math.floor((now - started) / 1000)) : 0;
    const minutes = Math.floor(seconds / 60);
    return minutes ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
function researchQueueStateWord(item) {
    if (item.state === "completed") return item.status.startsWith("Partial") ? "Partial" : "Complete";
    return ({
        queued: "Queued",
        running: "Running",
        failed: "Failed",
        interrupted: "Stopped"
    })[item.state];
}
}),
"[project]/components/ResearchScopeChoice.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "ResearchScopeChoice-module__PNZS0a__actions",
  "check": "ResearchScopeChoice-module__PNZS0a__check",
  "compact": "ResearchScopeChoice-module__PNZS0a__compact",
  "dialog": "ResearchScopeChoice-module__PNZS0a__dialog",
  "fields": "ResearchScopeChoice-module__PNZS0a__fields",
  "query": "ResearchScopeChoice-module__PNZS0a__query",
});
}),
"[project]/components/ResearchScopeChoice.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResearchScopeFields",
    ()=>ResearchScopeFields,
    "useResearchScope",
    ()=>useResearchScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/ResearchScopeChoice.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
function ResearchScopeFields({ value, onChange, options, disabled, compact = false }) {
    if (compact) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
        disabled: disabled,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].compact,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                children: "What sources should I use?"
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 13,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: value.external,
                        disabled: !options.provider_ids.length && !options.native_available && !options.firecrawl_available,
                        onChange: (event)=>onChange({
                                ...value,
                                external: event.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 14,
                        columnNumber: 37
                    }, this),
                    " External sources"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 14,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: value.other_matters,
                        onChange: (event)=>onChange({
                                ...value,
                                other_matters: event.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 15,
                        columnNumber: 37
                    }, this),
                    " Other matters"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 15,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Leave both unchecked to review only this matter."
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 16,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ResearchScopeChoice.tsx",
        lineNumber: 12,
        columnNumber: 23
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
        disabled: disabled,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fields,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                children: "Where should I look?"
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 20,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "This matter is always included. Choose extra sources for this request only."
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: value.external,
                        disabled: !options.provider_ids.length && !options.native_available && !options.firecrawl_available,
                        onChange: (event)=>onChange({
                                ...value,
                                external: event.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 22,
                        columnNumber: 37
                    }, this),
                    " External sources"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: value.other_matters,
                        onChange: (event)=>onChange({
                                ...value,
                                other_matters: event.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 23,
                        columnNumber: 37
                    }, this),
                    " Search other active matters"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 23,
                columnNumber: 5
            }, this),
            value.external && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: value.allow_followup_queries ? "Themis will turn your question into focused searches, compare relevant sources, and follow important gaps." : "Themis will plan focused searches from your question. Follow-up searches are off in Research options."
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 24,
                columnNumber: 24
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                        children: "Research options"
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 25,
                        columnNumber: 14
                    }, this),
                    value.external && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].query,
                        children: [
                            "Public research topic",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: value.public_query,
                                maxLength: 2000,
                                onChange: (event)=>onChange({
                                        ...value,
                                        public_query: event.target.value
                                    }),
                                placeholder: "Legal topic and jurisdiction. Do not include private names or facts."
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 27,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    value.allow_followup_queries ? "Themis will use this topic to plan distinct searches, compare relevant sources, and follow important gaps. This is not a limit of one search." : "This topic guides the initial research. Follow-up searches are off; you can enable them in Research options.",
                                    " Private matter details stay with the analysis model."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 28,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 26,
                        columnNumber: 24
                    }, this),
                    options.main_model_selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Main analysis: ",
                            options.main_model_selection.provider,
                            " · ",
                            options.main_model_selection.model,
                            ". Saved for this run."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 31,
                        columnNumber: 38
                    }, this),
                    options.model_selection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Collection model: ",
                            options.model_selection.provider,
                            " · ",
                            options.model_selection.model,
                            " · ",
                            options.model_selection.reasoning_effort || "default",
                            " effort. This selection is saved for this run."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 32,
                        columnNumber: 33
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: options.cost_notice
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 33,
                        columnNumber: 5
                    }, this),
                    options.model_selection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                children: [
                                    "Search method",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: value.native ? "native" : "configured",
                                        onChange: (event)=>onChange({
                                                ...value,
                                                native: event.target.value === "native"
                                            }),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "native",
                                                children: "Native search first"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                                lineNumber: 36,
                                                columnNumber: 9
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "configured",
                                                children: "Configured search services"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                                lineNumber: 36,
                                                columnNumber: 60
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                                        lineNumber: 35,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 35,
                                columnNumber: 7
                            }, this),
                            value.native ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: options.native_available ? "Use the selected provider's web search. Read pages directly, then use Playwright when needed." : "Native search is not supported for this provider. Enable Firecrawl fallback to search externally."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                                        lineNumber: 39,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: value.allow_firecrawl === true,
                                                disabled: !options.firecrawl_available,
                                                onChange: (event)=>onChange({
                                                        ...value,
                                                        allow_firecrawl: event.target.checked
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                                lineNumber: 40,
                                                columnNumber: 41
                                            }, this),
                                            "Allow Firecrawl fallback — may incur charges"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                                        lineNumber: 40,
                                        columnNumber: 9
                                    }, this),
                                    !options.firecrawl_available && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Firecrawl is not configured."
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                                        lineNumber: 41,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 38,
                                columnNumber: 23
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Providers: ",
                                    options.provider_ids.join(" → ") || "None configured",
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 42,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 34,
                        columnNumber: 32
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "Providers: ",
                            options.provider_ids.join(" → ") || "None configured",
                            ". A fallback is used if the first provider does not retrieve sources."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, this),
                    options.allow_followup_queries !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: value.allow_followup_queries === true,
                                        onChange: (event)=>onChange({
                                                ...value,
                                                allow_followup_queries: event.target.checked
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                                        lineNumber: 44,
                                        columnNumber: 88
                                    }, this),
                                    " Include focused follow-up searches for this question"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 44,
                                columnNumber: 56
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Up to 3 batches, 4 requests per batch, 16 source fetches, and 10 active minutes. Fetched PDFs are read up to 30 pages, and OCR to 6 pages per attempt. Sources already saved to this matter are extracted to their full length and searched separately. Coverage gaps remain visible."
                            }, void 0, false, {
                                fileName: "[project]/components/ResearchScopeChoice.tsx",
                                lineNumber: 44,
                                columnNumber: 308
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 44,
                        columnNumber: 54
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: options.sensitivity_notice
                    }, void 0, false, {
                        fileName: "[project]/components/ResearchScopeChoice.tsx",
                        lineNumber: 45,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 25,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Neither selected means this matter only. Normal model usage can still have costs."
            }, void 0, false, {
                fileName: "[project]/components/ResearchScopeChoice.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ResearchScopeChoice.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
function useResearchScope(ownerMatterId) {
    const [pending, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        external: false,
        other_matters: false,
        public_query: "",
        provider_ids: []
    });
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const resolve = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const owner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(ownerMatterId);
    owner.current = ownerMatterId;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pending) dialog.current?.showModal();
    }, [
        pending
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setPending(null);
        return ()=>{
            resolve.current?.(null);
            resolve.current = null;
        };
    }, [
        ownerMatterId
    ]);
    async function startScopedResearch(matterId, question = "", key, issueId) {
        const options = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResearchOptions"])(matterId);
        if (owner.current !== matterId) return null;
        setValue({
            external: false,
            other_matters: false,
            public_query: "",
            provider_ids: options.provider_ids,
            native: options.native_available === true,
            allow_firecrawl: false,
            model_selection: options.model_selection,
            main_model_selection: options.main_model_selection,
            collector_model_selection: options.collector_model_selection,
            allow_followup_queries: options.allow_followup_queries === true
        });
        setError("");
        return new Promise((done)=>{
            resolve.current?.(null);
            resolve.current = done;
            setPending({
                matterId,
                question,
                key: key ?? `research-ui:${crypto.randomUUID()}`,
                issueId,
                options
            });
        });
    }
    function finish(run) {
        resolve.current?.(run);
        resolve.current = null;
        setPending(null);
    }
    const researchScopeDialog = pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dialog", {
        "aria-labelledby": "research-source-heading",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dialog,
        ref: dialog,
        onCancel: (event)=>{
            event.preventDefault();
            if (!busy) finish(null);
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: async (event)=>{
                event.preventDefault();
                setBusy(true);
                setError("");
                try {
                    finish(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startResearchRun"])(pending.matterId, pending.question, pending.key, pending.issueId, value));
                } catch (caught) {
                    setError(caught instanceof Error ? caught.message : "Research could not start.");
                } finally{
                    setBusy(false);
                }
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    id: "research-source-heading",
                    children: "Choose research sources"
                }, void 0, false, {
                    fileName: "[project]/components/ResearchScopeChoice.tsx",
                    lineNumber: 89,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: pending.question
                }, void 0, false, {
                    fileName: "[project]/components/ResearchScopeChoice.tsx",
                    lineNumber: 89,
                    columnNumber: 68
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ResearchScopeFields, {
                    value: value,
                    onChange: setValue,
                    options: pending.options,
                    disabled: busy
                }, void 0, false, {
                    fileName: "[project]/components/ResearchScopeChoice.tsx",
                    lineNumber: 90,
                    columnNumber: 7
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    role: "alert",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/ResearchScopeChoice.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ResearchScopeChoice$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "btn",
                            disabled: busy,
                            onClick: ()=>finish(null),
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/ResearchScopeChoice.tsx",
                            lineNumber: 92,
                            columnNumber: 39
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "btn primary",
                            disabled: busy || value.external && !value.public_query.trim(),
                            children: busy ? "Starting…" : "Start research"
                        }, void 0, false, {
                            fileName: "[project]/components/ResearchScopeChoice.tsx",
                            lineNumber: 93,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ResearchScopeChoice.tsx",
                    lineNumber: 92,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ResearchScopeChoice.tsx",
            lineNumber: 83,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ResearchScopeChoice.tsx",
        lineNumber: 82,
        columnNumber: 41
    }, this) : null;
    return {
        startScopedResearch,
        researchScopeDialog
    };
}
}),
"[project]/components/ReviewPacketPanel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewPacketPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LinkifiedText.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/watchApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterIcon.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/DecisionsPhase2.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/workspace/MatterWork.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
const ACTIONS = [
    {
        value: "keep_current",
        label: "Keep current"
    },
    {
        value: "revise_decision",
        label: "Revise decision"
    },
    {
        value: "create_follow_up",
        label: "Create follow-up work"
    },
    {
        value: "not_relevant",
        label: "Not relevant"
    },
    {
        value: "keep_monitoring",
        label: "Keep monitoring"
    }
];
function ReviewPacketPanel({ packet: initialPacket, matterId, mitigations = [], onChanged, presentation = "matter" }) {
    const isPhase2 = presentation === "phase2";
    const styles = isPhase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"];
    const [packet, setPacket] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialPacket);
    const [action, setAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [note, setNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [decisionId, setDecisionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(packet.affected_decisions[0] ?? "");
    const [targetMatterId, setTargetMatterId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(matterId ?? packet.affected_matters[0] ?? "");
    const [workTitle, setWorkTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(`Review ${packet.what_happened}`);
    const [nextReviewAt, setNextReviewAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [mitigationOpen, setMitigationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mitigationTitle, setMitigationTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [mitigationDescription, setMitigationDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    function cancel() {
        setAction(null);
        setMitigationOpen(false);
        setError("");
    }
    async function submitOutcome() {
        if (!action) return;
        setBusy(true);
        setError("");
        try {
            let payload;
            if (action === "keep_current") payload = {
                action,
                expected_revision: packet.revision,
                payload: {
                    note,
                    next_review_at: nextReviewAt || null
                }
            };
            else if (action === "revise_decision") payload = {
                action,
                expected_revision: packet.revision,
                payload: {
                    decision_id: decisionId,
                    matter_id: targetMatterId || null,
                    work_item_title: workTitle
                }
            };
            else if (action === "create_follow_up") payload = {
                action,
                expected_revision: packet.revision,
                payload: {
                    matter_id: targetMatterId,
                    title: workTitle,
                    due_at: null
                }
            };
            else payload = {
                action,
                expected_revision: packet.revision,
                payload: {
                    reason: note
                }
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["actOnReviewPacket"])(packet.packet_id, payload);
            setPacket((current)=>({
                    ...current,
                    status: action === "keep_monitoring" ? "monitoring" : "resolved",
                    attention_state: action === "keep_monitoring" ? "monitor" : "briefing_only",
                    revision: current.revision + 1
                }));
            setMessage(`${ACTIONS.find((item)=>item.value === action)?.label} was recorded.`);
            setAction(null);
            await onChanged?.();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not record the review outcome.");
        } finally{
            setBusy(false);
        }
    }
    async function submitMitigation() {
        if (!targetMatterId || !mitigationTitle.trim() || !mitigationDescription.trim()) return;
        setBusy(true);
        setError("");
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMatterMitigation"])(targetMatterId, {
                title: mitigationTitle.trim(),
                description: mitigationDescription.trim(),
                status: "active",
                decision_ids: decisionId ? [
                    decisionId
                ] : [],
                owner: "Lawyer",
                review_at: null
            });
            setMessage("The mitigation was recorded. The review packet outcome is still open.");
            setMitigationOpen(false);
            await onChanged?.();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not record the mitigation.");
        } finally{
            setBusy(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: isPhase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].packet : `agent-note ${styles.reviewPacket}`,
        "aria-labelledby": `packet-${packet.packet_id}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: styles.packetHeader,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `agent-label ${styles.packetAgentLabel}`,
                                children: packet.status === "open" ? "Themis.ai · Not yet reviewed by an attorney" : "Themis.ai"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 63,
                                columnNumber: 50
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: styles.packetTitle,
                                id: `packet-${packet.packet_id}`,
                                children: isPhase2 ? "Review a change to the recorded basis" : "Review packet"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 63,
                                columnNumber: 202
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 63,
                        columnNumber: 45
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        name: "history",
                        size: 23
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 63,
                        columnNumber: 352
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 63,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: styles.packetMeta,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: packet.status === "open" ? "Needs review" : packet.status === "monitoring" ? "Monitoring" : "Resolved"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 64,
                        columnNumber: 38
                    }, this),
                    " · ",
                    packet.review_priority.replace("_", " "),
                    " · ",
                    packet.potential_impact,
                    " potential impact"
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 64,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: isPhase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].columns : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: styles.packetReading,
                        children: [
                            isPhase2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "What happened"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 53
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                text: packet.what_happened
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 91
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: styles.packetReading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Why it appeared:"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 176
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                text: packet.why_surfaced
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 66,
                                columnNumber: 210
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 140
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Prior decision basis",
                        values: [
                            packet.prior_decision_basis
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 67,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Existing mitigations",
                        values: packet.existing_mitigations,
                        empty: "No linked mitigation is recorded."
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 68,
                        columnNumber: 5
                    }, this),
                    mitigations.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Matter mitigations",
                        values: mitigations.map((item)=>`${item.title} — ${item.status}`)
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 69,
                        columnNumber: 27
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Possible tension",
                        values: [
                            packet.possible_tension
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 70,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Timing",
                        values: [
                            packet.timing,
                            ...packet.effective_dates
                        ]
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 70,
                        columnNumber: 110
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 65,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: isPhase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sources : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: styles.packetSectionLabel,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Sources"
                        }, void 0, false, {
                            fileName: "[project]/components/ReviewPacketPanel.tsx",
                            lineNumber: 73,
                            columnNumber: 48
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 73,
                        columnNumber: 5
                    }, this),
                    packet.sources.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: styles.packetList,
                        children: packet.sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: source.canonical_url,
                                        rel: "noreferrer",
                                        target: "_blank",
                                        children: source.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                                        lineNumber: 74,
                                        columnNumber: 148
                                    }, this),
                                    " · ",
                                    source.support_state.replaceAll("_", " "),
                                    source.warning ? ` · ${source.warning}` : ""
                                ]
                            }, `${source.canonical_url}-${index}`, true, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 74,
                                columnNumber: 103
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 74,
                        columnNumber: 30
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: styles.packetEmpty,
                        children: "No cited sources"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 74,
                        columnNumber: 337
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PacketSection, {
                        presentation: presentation,
                        label: "Warnings",
                        values: packet.warnings,
                        empty: "No warnings."
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 75,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 72,
                columnNumber: 5
            }, this),
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: styles.successMessage,
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 77,
                columnNumber: 16
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `error ${styles.errorMessage}`,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 77,
                columnNumber: 97
            }, this) : null,
            isPhase2 && packet.status === "open" && !mitigationOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].packetActions,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                        children: "How would you like to proceed?"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 107
                    }, this),
                    ACTIONS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].choice,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "radio",
                                    name: `outcome-${packet.packet_id}`,
                                    checked: action === item.value,
                                    disabled: busy,
                                    onChange: ()=>{
                                        setMessage("");
                                        setAction(item.value);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/ReviewPacketPanel.tsx",
                                    lineNumber: 78,
                                    columnNumber: 227
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        item.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: {
                                                keep_current: "Keep the existing decision as recorded.",
                                                revise_decision: "Open work to revise this decision.",
                                                create_follow_up: "Create work to research or monitor this change.",
                                                not_relevant: "This change does not affect the decision.",
                                                keep_monitoring: "Continue monitoring this source for changes."
                                            }[item.value]
                                        }, void 0, false, {
                                            fileName: "[project]/components/ReviewPacketPanel.tsx",
                                            lineNumber: 78,
                                            columnNumber: 412
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ReviewPacketPanel.tsx",
                                    lineNumber: 78,
                                    columnNumber: 394
                                }, this)
                            ]
                        }, item.value, true, {
                            fileName: "[project]/components/ReviewPacketPanel.tsx",
                            lineNumber: 78,
                            columnNumber: 177
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 78,
                columnNumber: 64
            }, this) : null,
            !isPhase2 && packet.status === "open" && !action && !mitigationOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `btn-row ${styles.packetActions}`,
                "aria-label": "Review packet actions",
                children: [
                    ACTIONS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn review compact",
                            onClick: ()=>{
                                setMessage("");
                                setAction(item.value);
                            },
                            type: "button",
                            children: item.label
                        }, item.value, false, {
                            fileName: "[project]/components/ReviewPacketPanel.tsx",
                            lineNumber: 79,
                            columnNumber: 185
                        }, this)),
                    matterId || packet.affected_matters.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn agent compact",
                        onClick: ()=>{
                            setMessage("");
                            setMitigationOpen(true);
                        },
                        type: "button",
                        children: "Record mitigation"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 383
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 79,
                columnNumber: 76
            }, this) : null,
            action ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `card ${styles.packetForm}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: ACTIONS.find((item)=>item.value === action)?.label
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 80,
                        columnNumber: 60
                    }, this),
                    action === "revise_decision" || action === "create_follow_up" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Work item title",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: workTitle,
                                onChange: (event)=>setWorkTitle(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 81,
                                columnNumber: 96
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 81,
                        columnNumber: 74
                    }, this) : null,
                    action === "revise_decision" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Decision ID",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: true,
                                value: decisionId,
                                onChange: (event)=>setDecisionId(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 82,
                                columnNumber: 57
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 82,
                        columnNumber: 39
                    }, this) : null,
                    action === "revise_decision" || action === "create_follow_up" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Matter ID",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                required: action === "create_follow_up",
                                value: targetMatterId,
                                onChange: (event)=>setTargetMatterId(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 83,
                                columnNumber: 90
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 83,
                        columnNumber: 74
                    }, this) : null,
                    action === "keep_current" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Next review date",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: nextReviewAt,
                                onChange: (event)=>setNextReviewAt(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 84,
                                columnNumber: 59
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 84,
                        columnNumber: 36
                    }, this) : null,
                    action !== "revise_decision" && action !== "create_follow_up" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            action === "keep_current" ? "Note" : "Reason",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                required: action !== "keep_current",
                                value: note,
                                onChange: (event)=>setNote(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 85,
                                columnNumber: 126
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 85,
                        columnNumber: 72
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `btn-row ${styles.formActions}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn primary",
                                disabled: busy || action === "revise_decision" && (!decisionId || !workTitle) || action === "create_follow_up" && (!targetMatterId || !workTitle) || (action === "not_relevant" || action === "keep_monitoring") && !note.trim(),
                                onClick: submitOutcome,
                                type: "button",
                                children: busy ? "Recording…" : "Submit outcome"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 56
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                disabled: busy,
                                onClick: cancel,
                                type: "button",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 86,
                                columnNumber: 407
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 86,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 80,
                columnNumber: 15
            }, this) : null,
            isPhase2 && packet.status === "open" && !mitigationOpen && (matterId || packet.affected_matters.length) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mitigation,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn",
                        type: "button",
                        disabled: busy,
                        onClick: ()=>{
                            setMessage("");
                            setAction(null);
                            setMitigationOpen(true);
                        },
                        children: "Record mitigation"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 88,
                        columnNumber: 147
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Creates a mitigation; leaves the review outcome open."
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 88,
                        columnNumber: 305
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 88,
                columnNumber: 112
            }, this) : null,
            mitigationOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `card ${styles.packetForm}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Record a separate mitigation"
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 68
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "This does not record a review outcome."
                    }, void 0, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 113
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Title",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: mitigationTitle,
                                onChange: (event)=>setMitigationTitle(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 170
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 158
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Description",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: mitigationDescription,
                                onChange: (event)=>setMitigationDescription(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 290
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 272
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        children: [
                            "Matter ID",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: targetMatterId,
                                onChange: (event)=>setTargetMatterId(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 423
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 407
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `btn-row ${styles.formActions}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn primary",
                                disabled: busy || !targetMatterId || !mitigationTitle.trim() || !mitigationDescription.trim(),
                                onClick: submitMitigation,
                                type: "button",
                                children: busy ? "Recording…" : "Record mitigation"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 572
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn",
                                disabled: busy,
                                onClick: cancel,
                                type: "button",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/components/ReviewPacketPanel.tsx",
                                lineNumber: 89,
                                columnNumber: 792
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 523
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 89,
                columnNumber: 23
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ReviewPacketPanel.tsx",
        lineNumber: 62,
        columnNumber: 10
    }, this);
}
function PacketSection({ label, values, empty, presentation }) {
    const styles = presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DecisionsPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"] : __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$workspace$2f$MatterWork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"];
    const present = values.filter((value)=>value?.trim());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: styles.packetSection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 93,
                columnNumber: 323
            }, this),
            present.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: styles.packetList,
                children: present.map((value, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LinkifiedText$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            text: value
                        }, void 0, false, {
                            fileName: "[project]/components/ReviewPacketPanel.tsx",
                            lineNumber: 93,
                            columnNumber: 460
                        }, this)
                    }, `${value}-${index}`, false, {
                        fileName: "[project]/components/ReviewPacketPanel.tsx",
                        lineNumber: 93,
                        columnNumber: 430
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 93,
                columnNumber: 365
            }, this) : empty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: styles.packetEmpty,
                children: empty
            }, void 0, false, {
                fileName: "[project]/components/ReviewPacketPanel.tsx",
                lineNumber: 93,
                columnNumber: 513
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/ReviewPacketPanel.tsx",
        lineNumber: 93,
        columnNumber: 285
    }, this);
}
}),
"[project]/components/RevisionPlugin.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REVIEW_SYNC_TAG",
    ()=>REVIEW_SYNC_TAG,
    "REVISION_BOUNDARY",
    ()=>REVISION_BOUNDARY,
    "default",
    ()=>RevisionPlugin,
    "markdownOffsetMap",
    ()=>markdownOffsetMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@lexical/react/dist/LexicalComposerContext.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RevisionTextNode.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const REVIEW_SYNC_TAG = "review-sync";
const REVISION_BOUNDARY = "\u200A";
function RevisionPlugin({ segments, comments, markdown, mode, reviewers, readOnly, tracking, trackingAuthor, onOpenThread, onSelectionContext }) {
    const [editor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$lexical$2f$react$2f$dist$2f$LexicalComposerContext$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLexicalComposerContext"])();
    const reviewStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        segments,
        comments,
        markdown,
        mode,
        reviewers,
        readOnly,
        tracking,
        trackingAuthor
    });
    const previewVisibleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const previewTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    reviewStateRef.current = {
        segments,
        comments,
        markdown,
        mode,
        reviewers,
        readOnly,
        tracking,
        trackingAuthor
    };
    const syncReview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((showLocalPreview)=>{
        const state = reviewStateRef.current;
        editor.setEditable(!state.readOnly && state.mode !== "original");
        editor.update(()=>{
            if (showLocalPreview) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$setSelection"])(null);
            normalizeReviewNodes();
            const visibleSegments = state.tracking && showLocalPreview ? composeLocalRevision(state.segments, state.markdown, state.trackingAuthor) : state.segments;
            const marks = buildMarks(visibleSegments, state.comments, state.markdown, state.mode, state.reviewers);
            for (const mark of [
                ...marks
            ].sort((a, b)=>b.start - a.start || b.end - a.end))applyMark(mark);
            if (!state.readOnly && state.mode !== "original") ensureEditableBoundaries();
        }, {
            tag: REVIEW_SYNC_TAG
        });
    }, [
        editor
    ]);
    const scheduleSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((showLocalPreview)=>{
        previewVisibleRef.current = showLocalPreview;
        if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
        previewTimerRef.current = window.setTimeout(()=>{
            previewTimerRef.current = null;
            syncReview(showLocalPreview);
        }, 0);
    }, [
        syncReview
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        syncReview(previewVisibleRef.current);
    }, [
        comments,
        mode,
        readOnly,
        reviewers,
        segments,
        syncReview,
        tracking,
        trackingAuthor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unregisterFocus = editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FOCUS_COMMAND"], ()=>{
            if (previewVisibleRef.current) scheduleSync(false);
            return false;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_LOW"]);
        const unregisterBlur = editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BLUR_COMMAND"], ()=>{
            const state = reviewStateRef.current;
            if (state.tracking && hasLocalRevision(state.segments, state.markdown)) scheduleSync(true);
            return false;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_LOW"]);
        const unregisterPaste = editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PASTE_COMMAND"], ()=>{
            if (reviewStateRef.current.tracking) scheduleSync(true);
            return false;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_LOW"]);
        return ()=>{
            unregisterFocus();
            unregisterBlur();
            unregisterPaste();
            if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
        };
    }, [
        editor,
        scheduleSync
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLICK_COMMAND"], (event)=>{
            const target = event.target;
            if (!(target instanceof HTMLElement)) return false;
            const threadId = target.closest(".revision-comment")?.dataset.changeId;
            if (!threadId) return false;
            onOpenThread(threadId, editor.getRootElement());
            return true;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_LOW"]), [
        editor,
        onOpenThread
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>editor.registerCommand(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEY_DOWN_COMMAND"], (event)=>{
            if (![
                "Home",
                "End"
            ].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return false;
            const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) return false;
            const block = selection.focus.getNode().getTopLevelElementOrThrow();
            const textNodes = block.getAllTextNodes().filter((node)=>(!(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRevisionTextNode"])(node) || node.getRevisionKind() !== "delete") && node.getTextContent().replaceAll(REVISION_BOUNDARY, "").length > 0);
            const target = event.key === "Home" ? textNodes[0] : textNodes.at(-1);
            if (!target) return false;
            const offset = event.key === "Home" ? 0 : target.getTextContentSize();
            if (!event.shiftKey) selection.anchor.set(target.getKey(), offset, "text");
            selection.focus.set(target.getKey(), offset, "text");
            event.preventDefault();
            return true;
        }, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMAND_PRIORITY_HIGH"]), [
        editor
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>editor.registerUpdateListener(({ editorState, tags })=>{
            if (tags.has(REVIEW_SYNC_TAG)) return;
            editorState.read(()=>{
                const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection) || selection.isCollapsed()) return;
                const selectedText = selection.getTextContent();
                const quote = selectedText.trim();
                if (!quote) return;
                const plainRange = selectionOffsets();
                if (!plainRange) return;
                const crossesBlocks = selection.anchor.getNode().getTopLevelElementOrThrow().getKey() !== selection.focus.getNode().getTopLevelElementOrThrow().getKey();
                const leading = selectedText.length - selectedText.trimStart().length;
                const trailing = selectedText.length - selectedText.trimEnd().length;
                const offsets = markdownOffsetMap(markdown);
                const projectedStart = offsets.plainToRaw(plainRange.start + leading);
                const projectedEnd = offsets.plainEndToRaw(plainRange.end - trailing);
                const exactRawSlice = markdown.slice(projectedStart, projectedEnd) === quote;
                const native = window.getSelection();
                onSelectionContext({
                    quote,
                    anchorStart: crossesBlocks || !exactRawSlice ? undefined : projectedStart,
                    anchorEnd: crossesBlocks || !exactRawSlice ? undefined : projectedEnd,
                    returnFocus: editor.getRootElement(),
                    rect: native?.rangeCount ? native.getRangeAt(0).getBoundingClientRect() : null
                });
            });
        }), [
        editor,
        markdown,
        onSelectionContext
    ]);
    return null;
}
function composeLocalRevision(segments, content, author) {
    const old = segments.filter((item)=>item.kind !== "delete").map((item)=>item.text).join("");
    if (old.endsWith("\n") && !content.endsWith("\n")) content += "\n";
    if (old === content) return segments;
    const oldTokens = tokenize(old), newTokens = tokenize(content);
    const offsets = [];
    let cursor = 0;
    for (const segment of segments){
        if (segment.kind === "delete") continue;
        const end = cursor + segment.text.length;
        offsets.push({
            start: cursor,
            end,
            segment
        });
        cursor = end;
    }
    function pieces(start, end) {
        const result = [];
        for (const item of offsets){
            if (item.end <= start || item.start >= end) continue;
            const text = item.segment.text.slice(Math.max(start, item.start) - item.start, Math.min(end, item.end) - item.start);
            if (text) result.push({
                ...item.segment,
                text
            });
        }
        return result;
    }
    const tokenOffsets = [
        0
    ];
    for (const token of oldTokens)tokenOffsets.push(tokenOffsets.at(-1) + token.length);
    const hidden = new Map();
    cursor = 0;
    for (const segment of segments){
        if (segment.kind === "delete") hidden.set(cursor, [
            ...hidden.get(cursor) ?? [],
            {
                ...segment
            }
        ]);
        else cursor += segment.text.length;
    }
    const output = [];
    for (const [index, opcode] of diffOpcodes(oldTokens, newTokens).entries()){
        const start = tokenOffsets[opcode.oldStart], end = tokenOffsets[opcode.oldEnd];
        output.push(...hidden.get(start) ?? []);
        hidden.delete(start);
        if (opcode.kind === "equal") {
            let pieceStart = start;
            for (const position of [
                ...hidden.keys()
            ].filter((value)=>start < value && value < end).sort((left, right)=>left - right)){
                output.push(...pieces(pieceStart, position), ...hidden.get(position) ?? []);
                hidden.delete(position);
                pieceStart = position;
            }
            output.push(...pieces(pieceStart, end));
            continue;
        }
        const prior = pieces(start, end);
        for (const position of [
            ...hidden.keys()
        ].filter((value)=>start < value && value <= end).sort((left, right)=>left - right)){
            output.push(...hidden.get(position) ?? []);
            hidden.delete(position);
        }
        const changeId = `local-review-${opcode.oldStart}-${opcode.newStart}-${index}`;
        const createdAt = "";
        const replaced = prior.filter((item)=>item.kind === "insert");
        for (const item of prior)if (item.kind === "equal") output.push(localSegment("delete", item.text, changeId, author, createdAt));
        const text = newTokens.slice(opcode.newStart, opcode.newEnd).join("");
        if (text) output.push({
            ...localSegment("insert", text, changeId, author, createdAt),
            ...replaced.length ? {
                replaced_segments: replaced,
                replaced_text: replaced.map((item)=>item.text).join("")
            } : {}
        });
    }
    for (const position of [
        ...hidden.keys()
    ].sort((left, right)=>left - right))output.push(...hidden.get(position) ?? []);
    return output;
}
function localSegment(kind, text, changeId, author, createdAt) {
    return {
        kind,
        text,
        change_id: changeId,
        author_id: author.author_id,
        author_name: author.name,
        author_color: author.color,
        created_at: createdAt
    };
}
function tokenize(value) {
    return value.match(/\s+|[\p{L}\p{N}_]+|[^\p{L}\p{N}_\s]/gu) ?? [];
}
function diffOpcodes(oldTokens, newTokens) {
    const rows = oldTokens.length + 1, columns = newTokens.length + 1;
    if (oldTokens.length * newTokens.length > 2_000_000) return coarseOpcodes(oldTokens, newTokens);
    const table = new Uint32Array(rows * columns);
    for(let oldIndex = oldTokens.length - 1; oldIndex >= 0; oldIndex--){
        for(let newIndex = newTokens.length - 1; newIndex >= 0; newIndex--){
            const offset = oldIndex * columns + newIndex;
            table[offset] = oldTokens[oldIndex] === newTokens[newIndex] ? table[(oldIndex + 1) * columns + newIndex + 1] + 1 : Math.max(table[(oldIndex + 1) * columns + newIndex], table[offset + 1]);
        }
    }
    const operations = [];
    let oldIndex = 0, newIndex = 0;
    while(oldIndex < oldTokens.length || newIndex < newTokens.length){
        if (oldIndex < oldTokens.length && newIndex < newTokens.length && oldTokens[oldIndex] === newTokens[newIndex]) {
            operations.push("equal");
            oldIndex++;
            newIndex++;
        } else if (newIndex < newTokens.length && (oldIndex === oldTokens.length || table[oldIndex * columns + newIndex + 1] >= table[(oldIndex + 1) * columns + newIndex])) {
            operations.push("insert");
            newIndex++;
        } else {
            operations.push("delete");
            oldIndex++;
        }
    }
    const result = [];
    oldIndex = 0;
    newIndex = 0;
    for(let operationIndex = 0; operationIndex < operations.length;){
        const equal = operations[operationIndex] === "equal";
        const oldStart = oldIndex, newStart = newIndex;
        while(operationIndex < operations.length && operations[operationIndex] === "equal" === equal){
            if (operations[operationIndex] !== "insert") oldIndex++;
            if (operations[operationIndex] !== "delete") newIndex++;
            operationIndex++;
        }
        result.push({
            kind: equal ? "equal" : "change",
            oldStart,
            oldEnd: oldIndex,
            newStart,
            newEnd: newIndex
        });
    }
    return result;
}
function coarseOpcodes(oldTokens, newTokens) {
    let prefix = 0;
    while(prefix < oldTokens.length && prefix < newTokens.length && oldTokens[prefix] === newTokens[prefix])prefix++;
    let suffix = 0;
    while(suffix < oldTokens.length - prefix && suffix < newTokens.length - prefix && oldTokens[oldTokens.length - suffix - 1] === newTokens[newTokens.length - suffix - 1])suffix++;
    const result = [];
    if (prefix) result.push({
        kind: "equal",
        oldStart: 0,
        oldEnd: prefix,
        newStart: 0,
        newEnd: prefix
    });
    result.push({
        kind: "change",
        oldStart: prefix,
        oldEnd: oldTokens.length - suffix,
        newStart: prefix,
        newEnd: newTokens.length - suffix
    });
    if (suffix) result.push({
        kind: "equal",
        oldStart: oldTokens.length - suffix,
        oldEnd: oldTokens.length,
        newStart: newTokens.length - suffix,
        newEnd: newTokens.length
    });
    return result;
}
function normalizeReviewNodes() {
    for (const node of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])().getAllTextNodes()){
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRevisionTextNode"])(node)) {
            if (node.getRevisionKind() === "delete") {
                node.remove();
                continue;
            }
            const plain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createTextNode"])(node.__text).setFormat(node.getFormat()).setStyle(node.getStyle());
            plain.setDetail(node.getDetail()).setMode(node.getMode());
            node.replace(plain);
            continue;
        }
        if (!node.getTextContent().includes(REVISION_BOUNDARY)) continue;
        const text = node.getTextContent().replaceAll(REVISION_BOUNDARY, "");
        if (text) node.setTextContent(text);
        else node.remove();
    }
}
function ensureEditableBoundaries() {
    const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])().getAllTextNodes();
    const first = nodes[0];
    const last = nodes.at(-1);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRevisionTextNode"])(first)) first.insertBefore((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createTextNode"])(REVISION_BOUNDARY));
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRevisionTextNode"])(last)) last.insertAfter((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createTextNode"])(REVISION_BOUNDARY));
}
function hasLocalRevision(segments, markdown) {
    const current = segments.filter((item)=>item.kind !== "delete").map((item)=>item.text).join("");
    const normalizedMarkdown = current.endsWith("\n") && !markdown.endsWith("\n") ? `${markdown}\n` : markdown;
    return current !== normalizedMarkdown;
}
function buildMarks(segments, comments, markdown, mode, reviewers) {
    const marks = [];
    const offsets = markdownOffsetMap(markdown);
    let rawCursor = 0;
    for (const segment of segments){
        const text = markdownText(segment.text);
        const selected = reviewers.size === 0 || reviewers.has(segment.author_id);
        const start = offsets.rawToPlain(Math.min(rawCursor, markdown.length));
        if (segment.kind === "delete") {
            if (mode === "markup" && selected || mode === "original") marks.push({
                start,
                end: start,
                kind: "delete",
                text,
                authorName: segment.author_name,
                authorColor: segment.author_color,
                id: segment.change_id
            });
            continue;
        }
        rawCursor += segment.text.length;
        const end = offsets.rawToPlain(Math.min(rawCursor, markdown.length));
        if (segment.kind === "insert") {
            if (mode === "original") marks.push({
                start,
                end,
                kind: "insert",
                text,
                authorName: "__hidden__",
                authorColor: segment.author_color,
                id: segment.change_id
            });
            else if (mode === "markup" && selected) marks.push({
                start,
                end,
                kind: "insert",
                text,
                authorName: segment.author_name,
                authorColor: segment.author_color,
                id: segment.change_id
            });
        }
    }
    if (mode !== "original") for (const thread of comments.filter((item)=>!item.resolved)){
        const quote = markdownText(thread.quote);
        const validStoredRange = Number.isInteger(thread.anchor_start) && Number.isInteger(thread.anchor_end) && thread.anchor_start >= 0 && thread.anchor_end > thread.anchor_start && thread.anchor_end <= markdown.length && markdown.slice(thread.anchor_start, thread.anchor_end) === thread.quote;
        const legacyRawStart = validStoredRange ? -1 : markdown.indexOf(thread.quote);
        const start = validStoredRange ? offsets.rawToPlain(thread.anchor_start) : legacyRawStart >= 0 ? offsets.rawToPlain(legacyRawStart) : -1;
        const end = validStoredRange ? offsets.rawToPlain(thread.anchor_end) : start + quote.length;
        if (start >= 0 && end > start) marks.push({
            start,
            end,
            kind: "comment",
            text: quote,
            authorName: "Comment",
            authorColor: "var(--attention)",
            id: thread.thread_id
        });
    }
    return marks;
}
function markdownText(value) {
    return markdownOffsetMap(value).plain;
}
function markdownOffsetMap(markdown) {
    const skipped = new Uint8Array(markdown.length);
    function skip(start, end) {
        for(let index = Math.max(0, start); index < Math.min(markdown.length, end); index++)skipped[index] = 1;
    }
    for (const match of markdown.matchAll(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+/gm))skip(match.index, match.index + match[0].length);
    for (const match of markdown.matchAll(/!?\[([^\]]+)\]\(([^)]*)\)/g)){
        const full = match[0], label = match[1], labelAt = match.index + full.indexOf(label);
        skip(match.index, labelAt);
        skip(labelAt + label.length, match.index + full.length);
    }
    for (const expression of [
        /(\*\*\*)(?=\S)([\s\S]*?\S)\1/g,
        /(\*\*)(?=\S)([\s\S]*?\S)\1/g,
        /(?<![\w_])(__)(?=\S)([\s\S]*?\S)\1(?![\w_])/g,
        /(?<!\*)(\*)(?!\*)(?=\S)([\s\S]*?\S)\1(?!\*)/g,
        /(?<![\w_])(_)(?!_)(?=\S)([\s\S]*?\S)\1(?![\w_])/g
    ]){
        for (const match of markdown.matchAll(expression)){
            const marker = match[1]?.length ?? 1;
            skip(match.index, match.index + marker);
            skip(match.index + match[0].length - marker, match.index + match[0].length);
        }
    }
    for(let index = 0; index < markdown.length; index++)if (markdown[index] === "\n" || markdown[index] === "\r") skipped[index] = 1;
    const rawByPlain = [];
    let plain = "";
    for(let raw = 0; raw < markdown.length; raw++)if (!skipped[raw]) {
        rawByPlain.push(raw);
        plain += markdown[raw];
    }
    return {
        plain,
        rawToPlain (rawOffset) {
            let low = 0, high = rawByPlain.length;
            while(low < high){
                const middle = low + high >> 1;
                if (rawByPlain[middle] < rawOffset) low = middle + 1;
                else high = middle;
            }
            return low;
        },
        plainToRaw (plainOffset) {
            if (plainOffset <= 0) return rawByPlain[0] ?? 0;
            if (plainOffset >= rawByPlain.length) return markdown.length;
            return rawByPlain[plainOffset];
        },
        plainEndToRaw (plainOffset) {
            if (plainOffset <= 0) return rawByPlain[0] ?? 0;
            return (rawByPlain[Math.min(plainOffset, rawByPlain.length) - 1] ?? markdown.length - 1) + 1;
        }
    };
}
function selectionOffsets() {
    const selection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getSelection"])();
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRangeSelection"])(selection)) return null;
    const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])().getAllTextNodes();
    let cursor = 0, anchor = null, focus = null;
    for (const node of nodes){
        const size = node.getTextContentSize();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(selection.anchor.getNode()) && node.getKey() === selection.anchor.key) anchor = cursor + selection.anchor.offset;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isTextNode"])(selection.focus.getNode()) && node.getKey() === selection.focus.key) focus = cursor + selection.focus.offset;
        cursor += size;
    }
    return anchor === null || focus === null ? null : {
        start: Math.min(anchor, focus),
        end: Math.max(anchor, focus)
    };
}
function applyMark(mark) {
    const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$getRoot"])().getAllTextNodes().filter((node)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$isRevisionTextNode"])(node));
    if (mark.kind === "delete") {
        const location = locate(nodes, mark.start);
        if (!location) return;
        const revision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createRevisionTextNode"])(mark.text, "delete", mark.authorName, mark.authorColor, mark.id);
        if (location.offset === 0) location.node.insertBefore(revision);
        else if (location.offset >= location.node.getTextContentSize()) location.node.insertAfter(revision);
        else {
            const [, after] = location.node.splitText(location.offset);
            after.insertBefore(revision);
        }
        return;
    }
    let cursor = 0;
    for (const node of nodes){
        const text = node.getTextContent();
        const left = cursor;
        const right = cursor + text.length;
        cursor = right;
        const from = Math.max(mark.start, left);
        const to = Math.min(mark.end, right);
        if (from >= to) continue;
        replaceSlice(node, from - left, to - left, mark);
    }
}
function replaceSlice(node, start, end, mark) {
    let selected;
    if (start === 0 && end === node.getTextContentSize()) selected = node;
    else if (start === 0) [selected] = node.splitText(end);
    else [, selected] = node.splitText(start, end);
    const revision = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RevisionTextNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["$createRevisionTextNode"])(selected.getTextContent(), mark.kind, mark.authorName, mark.authorColor, mark.id).setFormat(selected.getFormat()).setStyle(selected.getStyle());
    revision.setDetail(selected.getDetail()).setMode(selected.getMode());
    selected.replace(revision);
}
function locate(nodes, position) {
    let cursor = 0;
    for (const node of nodes){
        const end = cursor + node.getTextContentSize();
        if (position <= end) return {
            node,
            offset: position - cursor
        };
        cursor = end;
    }
    const last = nodes.at(-1);
    return last ? {
        node: last,
        offset: last.getTextContentSize()
    } : null;
}
}),
"[project]/components/RevisionTextNode.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "$createRevisionTextNode",
    ()=>$createRevisionTextNode,
    "$isRevisionTextNode",
    ()=>$isRevisionTextNode,
    "RevisionTextNode",
    ()=>RevisionTextNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lexical/dist/Lexical.dev.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/reviewAuthor.ts [app-ssr] (ecmascript)");
;
;
class RevisionTextNode extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lexical$2f$dist$2f$Lexical$2e$dev$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextNode"] {
    __revisionKind;
    __authorName;
    __authorColor;
    __changeId;
    static getType() {
        return "revision-text";
    }
    static clone(node) {
        return new RevisionTextNode(node.__text, node.__revisionKind, node.__authorName, node.__authorColor, node.__changeId, node.__key);
    }
    constructor(text, kind, authorName, authorColor, changeId, key){
        super(text, key);
        this.__revisionKind = kind;
        this.__authorName = authorName;
        this.__authorColor = authorColor;
        this.__changeId = changeId;
    }
    createDOM(config) {
        const element = super.createDOM(config);
        const authorName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(this.__authorName, [
            "Themis",
            "Themis.ai"
        ].includes(this.__authorName) ? "author-themis" : "");
        element.className = `revision-text revision-${this.__revisionKind}`;
        element.style.setProperty("--revision-color", this.__authorColor);
        element.title = `${authorName} · ${this.__revisionKind === "insert" ? "Inserted" : "Deleted"}`;
        element.dataset.author = authorName;
        element.dataset.changeId = this.__changeId;
        return element;
    }
    getTextContent() {
        return this.__revisionKind === "delete" ? "" : super.getTextContent();
    }
    getRevisionKind() {
        return this.__revisionKind;
    }
    getChangeId() {
        return this.__changeId;
    }
    getAuthorName() {
        return this.__authorName;
    }
    getAuthorColor() {
        return this.__authorColor;
    }
    updateDOM(previous, dom, config) {
        const changed = super.updateDOM(previous, dom, config);
        if (previous.__revisionKind !== this.__revisionKind || previous.__authorName !== this.__authorName || previous.__authorColor !== this.__authorColor) {
            const authorName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$reviewAuthor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["displayReviewAuthor"])(this.__authorName, [
                "Themis",
                "Themis.ai"
            ].includes(this.__authorName) ? "author-themis" : "");
            dom.className = `revision-text revision-${this.__revisionKind}`;
            dom.style.setProperty("--revision-color", this.__authorColor);
            dom.title = `${authorName} · ${this.__revisionKind === "insert" ? "Inserted" : "Deleted"}`;
            dom.dataset.author = authorName;
        }
        return changed;
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            type: "revision-text",
            version: 1,
            revisionKind: this.__revisionKind,
            authorName: this.__authorName,
            authorColor: this.__authorColor,
            changeId: this.__changeId
        };
    }
    static importJSON(serialized) {
        return new RevisionTextNode(serialized.text, serialized.revisionKind, serialized.authorName, serialized.authorColor, serialized.changeId).updateFromJSON(serialized);
    }
    isTextEntity() {
        return this.__revisionKind === "delete";
    }
}
function $createRevisionTextNode(text, kind, authorName, authorColor, changeId) {
    return new RevisionTextNode(text, kind, authorName, authorColor, changeId);
}
function $isRevisionTextNode(node) {
    return node instanceof RevisionTextNode;
}
}),
"[project]/components/SkillCommandMenu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SkillCommandMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$skills$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/skills.ts [app-ssr] (ecmascript)");
"use client";
;
;
function SkillCommandMenu({ input, skills, onSelect }) {
    const matches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$skills$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["skillCommandMatches"])(input, skills);
    if (!matches.length) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-label": "Skill commands",
        className: "skill-command-menu",
        role: "listbox",
        children: matches.map((skill)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onSelect(skill),
                role: "option",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mono",
                        children: [
                            "/",
                            skill.skill_id
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SkillCommandMenu.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                children: skill.name
                            }, void 0, false, {
                                fileName: "[project]/components/SkillCommandMenu.tsx",
                                lineNumber: 22,
                                columnNumber: 17
                            }, this),
                            skill.description
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SkillCommandMenu.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this)
                ]
            }, skill.skill_id, true, {
                fileName: "[project]/components/SkillCommandMenu.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/SkillCommandMenu.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/SkillsPhase2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "flowHeader": "SkillsPhase2-module__h8wW8a__flowHeader",
  "generated": "SkillsPhase2-module__h8wW8a__generated",
  "guided": "SkillsPhase2-module__h8wW8a__guided",
  "new": "SkillsPhase2-module__h8wW8a__new",
  "shell": "SkillsPhase2-module__h8wW8a__shell",
  "steps": "SkillsPhase2-module__h8wW8a__steps",
});
}),
"[project]/components/SourceRoleEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SourceRoleEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/WatchesPhase2.module.css [app-ssr] (css module)");
;
;
const roles = [
    "primary",
    "secondary",
    "discovery_only",
    "excluded"
];
const types = [
    "case",
    "statute",
    "regulation",
    "regulator_material",
    "government_publication",
    "secondary_legal_analysis",
    "periodical",
    "industry_reporting",
    "company_statement",
    "market_signal",
    "other"
];
const authority = [
    "binding",
    "persuasive",
    "proposed",
    "official_nonbinding",
    "none",
    "unknown"
];
const label = (value)=>value.replaceAll("_", " ").replace(/^./, (letter)=>letter.toUpperCase());
function SourceRoleEditor({ onChange, sources, presentation = "matter" }) {
    function patch(index, change) {
        onChange(sources.map((source, itemIndex)=>itemIndex === index ? {
                ...source,
                ...change
            } : source));
    }
    function add() {
        onChange([
            ...sources,
            {
                source_id: `source-${Date.now()}`,
                name: "",
                canonical_url: "https://",
                publisher: "",
                jurisdiction: "",
                source_type: "other",
                role: "discovery_only",
                authority_status: "unknown",
                coverage_status: "configured"
            }
        ]);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `stack-list ${presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sources : ""}`,
        children: [
            sources.map((source, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card card-pad responsive-card",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sourceGrid : undefined,
                            style: presentation === "phase2" ? undefined : {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Source name",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "text-input",
                                            onChange: (event)=>patch(index, {
                                                    name: event.target.value
                                                }),
                                            value: source.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 17,
                                            columnNumber: 51
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 17,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Public URL",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "text-input",
                                            onChange: (event)=>patch(index, {
                                                    canonical_url: event.target.value
                                                }),
                                            type: "url",
                                            value: source.canonical_url
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 18,
                                            columnNumber: 50
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 18,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Publisher",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "text-input",
                                            onChange: (event)=>patch(index, {
                                                    publisher: event.target.value
                                                }),
                                            value: source.publisher
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 19,
                                            columnNumber: 49
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 19,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Jurisdiction",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "text-input",
                                            onChange: (event)=>patch(index, {
                                                    jurisdiction: event.target.value
                                                }),
                                            value: source.jurisdiction
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 20,
                                            columnNumber: 52
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 20,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Source type",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "select-input",
                                            onChange: (event)=>patch(index, {
                                                    source_type: event.target.value
                                                }),
                                            value: source.source_type,
                                            children: types.map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: value,
                                                    children: label(value)
                                                }, value, false, {
                                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                                    lineNumber: 21,
                                                    columnNumber: 219
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 21,
                                            columnNumber: 51
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 21,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Role for this Watch",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "select-input",
                                            onChange: (event)=>patch(index, {
                                                    role: event.target.value
                                                }),
                                            value: source.role,
                                            children: roles.map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: value,
                                                    children: label(value)
                                                }, value, false, {
                                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                                    lineNumber: 22,
                                                    columnNumber: 213
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 22,
                                            columnNumber: 59
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 22,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "field-label",
                                    children: [
                                        "Legal authority",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "select-input",
                                            onChange: (event)=>patch(index, {
                                                    authority_status: event.target.value
                                                }),
                                            value: source.authority_status,
                                            children: authority.map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: value,
                                                    children: label(value)
                                                }, value, false, {
                                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                                    lineNumber: 23,
                                                    columnNumber: 242
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/SourceRoleEditor.tsx",
                                            lineNumber: 23,
                                            columnNumber: 55
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/SourceRoleEditor.tsx",
                                    lineNumber: 23,
                                    columnNumber: 9
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SourceRoleEditor.tsx",
                            lineNumber: 16,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn quiet compact",
                            onClick: ()=>onChange(sources.filter((_, itemIndex)=>itemIndex !== index)),
                            style: {
                                marginTop: 12
                            },
                            type: "button",
                            children: "Remove source"
                        }, void 0, false, {
                            fileName: "[project]/components/SourceRoleEditor.tsx",
                            lineNumber: 25,
                            columnNumber: 7
                        }, this)
                    ]
                }, source.source_id, true, {
                    fileName: "[project]/components/SourceRoleEditor.tsx",
                    lineNumber: 15,
                    columnNumber: 37
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn agent",
                onClick: add,
                type: "button",
                children: "Add named source"
            }, void 0, false, {
                fileName: "[project]/components/SourceRoleEditor.tsx",
                lineNumber: 27,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SourceRoleEditor.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/TemplatesPhase2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "back": "TemplatesPhase2-module__PwEBSG__back",
  "editor": "TemplatesPhase2-module__PwEBSG__editor",
  "editorColumns": "TemplatesPhase2-module__PwEBSG__editorColumns",
  "heading": "TemplatesPhase2-module__PwEBSG__heading",
  "lede": "TemplatesPhase2-module__PwEBSG__lede",
  "library": "TemplatesPhase2-module__PwEBSG__library",
  "matter": "TemplatesPhase2-module__PwEBSG__matter",
  "outline": "TemplatesPhase2-module__PwEBSG__outline",
  "page": "TemplatesPhase2-module__PwEBSG__page",
  "table": "TemplatesPhase2-module__PwEBSG__table",
  "tableHead": "TemplatesPhase2-module__PwEBSG__tableHead",
  "tableRow": "TemplatesPhase2-module__PwEBSG__tableRow",
  "tabs": "TemplatesPhase2-module__PwEBSG__tabs",
});
}),
"[project]/components/UploadIntentCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UploadIntentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function UploadIntentCard({ attachments, busy, onSend, onClear }) {
    const [intent, setIntent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    if (!attachments.length) return null;
    const count = attachments.length;
    const title = count === 1 ? `Added ${attachments[0].name}` : count <= 3 ? `Added ${count} files` : `Added a set of ${count} files`;
    const prompt = count === 1 ? "What should Themis.ai do with this file?" : "What should Themis.ai do with this set?";
    function submit() {
        if (intent.trim() && !busy) void onSend(intent.trim());
    }
    function keyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submit();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "upload-intent-card",
        "aria-label": "Uploaded file intent",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-kicker",
                children: "Sources added"
            }, void 0, false, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "chat-card-summary",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "upload-file-list",
                children: [
                    attachments.slice(0, 3).map((item)=>item.name).join(" · "),
                    count > 3 ? ` · +${count - 3} more` : ""
                ]
            }, void 0, true, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                htmlFor: "upload-intent",
                children: prompt
            }, void 0, false, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "question-free-text",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        className: "text-input",
                        disabled: busy,
                        id: "upload-intent",
                        onChange: (event)=>setIntent(event.target.value),
                        onKeyDown: keyDown,
                        placeholder: "For example, summarize the key issues",
                        value: intent
                    }, void 0, false, {
                        fileName: "[project]/components/UploadIntentCard.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary compact",
                        disabled: busy || !intent.trim(),
                        onClick: submit,
                        children: "Send"
                    }, void 0, false, {
                        fileName: "[project]/components/UploadIntentCard.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "btn tiny quiet",
                disabled: busy,
                onClick: onClear,
                children: "Remove from this message"
            }, void 0, false, {
                fileName: "[project]/components/UploadIntentCard.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/UploadIntentCard.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/WatchBuilder.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WatchBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/WatchesPhase2.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DataLoadStatus.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SourceRoleEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SourceRoleEditor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchScanPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/WatchScanPreview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/design.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/watchApi.ts [app-ssr] (ecmascript)");
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
const purposes = [
    {
        id: "awareness",
        label: "Awareness"
    },
    {
        id: "company_impact",
        label: "Company impact"
    },
    {
        id: "decision_maintenance",
        label: "Decision maintenance"
    }
];
const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];
const empty = {
    title: "",
    standing_question: "",
    purposes: [
        "awareness"
    ],
    provider: "native",
    sources: [],
    public_query: {
        standing_question: "",
        keywords: [],
        topics: [],
        jurisdictions: [],
        regulators: [],
        courts: [],
        industries: [],
        public_source_urls: [],
        public_entities: []
    },
    internal_scope: {
        product_ids: [],
        company_paths: [],
        matter_ids: [],
        decision_ids: [],
        mitigation_ids: [],
        lookback_days: 90
    },
    recurrence: {
        kind: "daily",
        interval_seconds: null,
        local_time: "08:00",
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        weekdays: []
    },
    briefing: {
        create_items: true,
        create_digest: false,
        saved_view_id: null
    },
    review: {
        enabled: true,
        default_attention: "monitor"
    }
};
const split = (value)=>value.split(/[,\n]/).map((item)=>item.trim()).filter(Boolean);
const join = (value)=>value.join(", ");
const titleCase = (value)=>value.replaceAll("_", " ").replace(/^./, (letter)=>letter.toUpperCase());
function editableWatch(watch) {
    return {
        title: watch.title,
        standing_question: watch.standing_question,
        public_query: watch.public_query,
        purposes: watch.purposes,
        sources: watch.sources,
        internal_scope: watch.internal_scope,
        provider: watch.provider,
        recurrence: watch.recurrence,
        briefing: watch.briefing,
        review: watch.review
    };
}
function WatchBuilder({ watchId, presentation = "matter" }) {
    const phase2 = presentation === "phase2";
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [record, setRecord] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(empty);
    const [runs, setRuns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [providers, setProviders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadError, setLoadError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        setLoadError("");
        try {
            const [capabilities, watch, history] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProviderCapabilities"])(),
                watchId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWatch"])(watchId) : Promise.resolve(null),
                watchId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWatchRuns"])(watchId, {
                    limit: 20
                }) : Promise.resolve({
                    items: [],
                    next_cursor: null,
                    total: 0
                })
            ]);
            setProviders(capabilities.items);
            if (watch) {
                setRecord(watch);
                setDraft(editableWatch(watch));
                setRuns(history.items);
            }
            setLoaded(true);
        } catch  {
            setLoadError("This Watch is unavailable because its current data could not be loaded.");
        } finally{
            setLoading(false);
        }
    }, [
        watchId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void load();
    }, [
        load
    ]);
    function patch(change) {
        setDraft((current)=>({
                ...current,
                ...change
            }));
        setNotice("");
    }
    function patchQuery(key, value) {
        patch({
            public_query: {
                ...draft.public_query,
                [key]: value
            }
        });
    }
    function patchScope(key, value) {
        patch({
            internal_scope: {
                ...draft.internal_scope,
                [key]: value
            }
        });
    }
    function normalized() {
        const standing = draft.standing_question.trim();
        return {
            title: draft.title.trim(),
            standing_question: standing,
            public_query: {
                ...draft.public_query,
                standing_question: draft.public_query.standing_question.trim() || standing,
                public_source_urls: draft.sources.filter((source)=>source.role !== "excluded").map((source)=>source.canonical_url).filter((url)=>/^https:\/\//.test(url))
            },
            purposes: draft.purposes,
            sources: draft.sources,
            internal_scope: draft.internal_scope,
            provider: draft.provider,
            recurrence: draft.recurrence,
            briefing: draft.briefing,
            review: draft.review
        };
    }
    async function save() {
        const payload = normalized();
        if (!payload.title || !payload.standing_question || !payload.public_query.standing_question) throw new Error("Add a title, standing question, and public query before saving.");
        if (!payload.purposes.length) throw new Error("Select at least one purpose.");
        if (payload.sources.some((source)=>!source.name.trim() || !/^https:\/\//.test(source.canonical_url))) throw new Error("Each named source needs a name and a public HTTPS URL.");
        if (!record) {
            const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWatchDraft"])({
                title: payload.title,
                standing_question: payload.standing_question,
                public_query: payload.public_query,
                purposes: payload.purposes,
                provider: payload.provider
            });
            const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateWatch"])(created.watch_id, {
                expected_revision: created.revision,
                sources: payload.sources,
                internal_scope: payload.internal_scope,
                recurrence: payload.recurrence,
                briefing: payload.briefing,
                review: payload.review
            });
            setRecord(updated);
            setDraft(editableWatch(updated));
            return updated;
        }
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateWatch"])(record.watch_id, {
            expected_revision: record.revision,
            ...payload
        });
        setRecord(updated);
        setDraft(editableWatch(updated));
        return updated;
    }
    async function act(action) {
        setBusy(action);
        setError("");
        setNotice("");
        try {
            const saved = await save();
            if (action === "save") {
                setNotice(saved.enabled ? "Watch saved. Its schedule remains active." : "Draft saved. The Watch remains disabled.");
                if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`);
                return;
            }
            if (action === "scan") {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["scanWatch"])(saved.watch_id, {
                    mode: saved.enabled ? "manual" : "draft"
                });
                const refreshed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWatch"])(saved.watch_id);
                setRecord(refreshed);
                setDraft(editableWatch(refreshed));
                setRuns((current)=>[
                        result.scan,
                        ...current.filter((run)=>run.scan_id !== result.scan.scan_id)
                    ]);
                setNotice("Scan saved. The schedule state did not change.");
                if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`);
                return;
            }
            if (action === "start") {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["activateWatch"])(saved.watch_id, {
                    expected_revision: saved.revision
                });
                setRecord(result.watch);
                setDraft(editableWatch(result.watch));
                setNotice("Watch started. Its schedule is active.");
                if (!watchId) router.push(`/watches/${encodeURIComponent(saved.watch_id)}`);
                return;
            }
            const paused = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$watchApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pauseWatch"])(saved.watch_id, {
                expected_revision: saved.revision
            });
            setRecord(paused);
            setDraft(editableWatch(paused));
            setNotice("Watch paused. Saved settings are unchanged.");
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "The Watch action failed.");
        } finally{
            setBusy("");
        }
    }
    if (!loaded) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        error: loadError,
        loading: loading,
        loadingLabel: "Loading Watch…",
        onRetry: load
    }, void 0, false, {
        fileName: "[project]/components/WatchBuilder.tsx",
        lineNumber: 122,
        columnNumber: 23
    }, this);
    const status = record?.status ?? "draft";
    const statusClass = status === "failed" ? "state-failure" : status === "healthy" ? "state-healthy" : status === "draft" || status === "scanning" ? "state-agent" : "state-attention";
    const actions = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions : "card card-pad",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "btn-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn",
                        disabled: !!busy,
                        onClick: ()=>void act("save"),
                        type: "button",
                        children: busy === "save" ? "Saving…" : "Save draft"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 126,
                        columnNumber: 103
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn agent",
                        disabled: !!busy,
                        onClick: ()=>void act("scan"),
                        type: "button",
                        children: busy === "scan" ? "Scanning…" : "Scan now"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 126,
                        columnNumber: 245
                    }, this),
                    record?.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn review",
                        disabled: !!busy,
                        onClick: ()=>void act("pause"),
                        type: "button",
                        children: busy === "pause" ? "Pausing…" : "Pause schedule"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 126,
                        columnNumber: 412
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "btn primary",
                        disabled: !!busy,
                        onClick: ()=>void act("start"),
                        type: "button",
                        children: busy === "start" ? "Starting…" : "Start Watch"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 126,
                        columnNumber: 571
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 126,
                columnNumber: 78
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "small muted",
                style: {
                    margin: "12px 0 0"
                },
                children: "Start Watch is the only action that enables a schedule. Scan now saves first and does not activate one."
            }, void 0, false, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 126,
                columnNumber: 733
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WatchBuilder.tsx",
        lineNumber: 126,
        columnNumber: 19
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: phase2 ? `${__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].builder} ${record ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detail : ""}` : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DataLoadStatus$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                error: loadError,
                loading: loading,
                loadingLabel: "Refreshing Watch…",
                onRetry: load
            }, void 0, false, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 129,
                columnNumber: 5
            }, this),
            phase2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].back,
                        href: "/watches",
                        children: "‹ All Watches"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 131,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].heading,
                                        children: record ? draft.title || "Edit Watch" : "Watch Builder"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 132,
                                        columnNumber: 43
                                    }, this),
                                    !record ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lede,
                                        children: "Define the question to monitor, then choose its sources and schedule."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 132,
                                        columnNumber: 146
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 132,
                                columnNumber: 38
                            }, this),
                            record ? actions : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `state-label ${statusClass}`,
                                children: titleCase(status)
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 132,
                                columnNumber: 280
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 132,
                        columnNumber: 7
                    }, this),
                    record ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].meta,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `state-label ${statusClass}`,
                                children: titleCase(status)
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 133,
                                columnNumber: 46
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Schedule: ",
                                    record.enabled ? "Active" : "Disabled"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 133,
                                columnNumber: 119
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Provider: ",
                                    draft.provider === "both" ? "Both" : titleCase(draft.provider)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 133,
                                columnNumber: 182
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    titleCase(draft.recurrence.kind),
                                    draft.recurrence.local_time ? ` at ${draft.recurrence.local_time} ${draft.recurrence.time_zone || ""}` : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 133,
                                columnNumber: 269
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        "aria-label": "Watch sections",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav,
                        children: [
                            record ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-expanded": editing,
                                onClick: ()=>setEditing(!editing),
                                type: "button",
                                children: editing ? "Hide settings" : "Change something"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 134,
                                columnNumber: 73
                            }, this) : null,
                            [
                                [
                                    "assignment",
                                    "Assignment"
                                ],
                                [
                                    "sources",
                                    "Sources"
                                ],
                                [
                                    "internal",
                                    "Internal scope"
                                ],
                                [
                                    "schedule",
                                    "Schedule & output"
                                ]
                            ].map(([id, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `#watch-${id}`,
                                    onClick: ()=>setEditing(true),
                                    children: label
                                }, id, false, {
                                    fileName: "[project]/components/WatchBuilder.tsx",
                                    lineNumber: 134,
                                    columnNumber: 365
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 134,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 130,
                columnNumber: 15
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "record-meta",
                                children: "Briefing · Watch Builder"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 135,
                                columnNumber: 45
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: record ? draft.title || "Edit Watch" : "New Watch"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 135,
                                columnNumber: 104
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Define one public monitoring assignment. You can save or scan it without starting a schedule."
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 135,
                                columnNumber: 165
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 135,
                        columnNumber: 40
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `state-label ${statusClass}`,
                                children: titleCase(status)
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 135,
                                columnNumber: 296
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                className: "btn quiet",
                                href: "/watches",
                                children: "All Watches"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 135,
                                columnNumber: 369
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 135,
                        columnNumber: 271
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 135,
                columnNumber: 11
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 136,
                columnNumber: 14
            }, this) : null,
            notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "warning-callout",
                role: "status",
                style: {
                    marginTop: 16
                },
                children: notice
            }, void 0, false, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 136,
                columnNumber: 77
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].flow : "stack-list",
                style: {
                    marginTop: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fields : "stack-list",
                        hidden: phase2 && !!record && !editing,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "watch-assignment",
                                className: `card card-pad ${phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].assignment : ""}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Assignment"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 139,
                                        columnNumber: 101
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "State what to watch and why it matters."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 139,
                                        columnNumber: 120
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gap: 14
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-label",
                                                children: [
                                                    "Watch title",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        autoFocus: !watchId,
                                                        className: "text-input",
                                                        onChange: (event)=>patch({
                                                                title: event.target.value
                                                            }),
                                                        value: draft.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 141,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-label",
                                                children: [
                                                    "Standing question",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        className: "text-input watch-question-input",
                                                        onChange: (event)=>{
                                                            patch({
                                                                standing_question: event.target.value
                                                            });
                                                            if (!draft.public_query.standing_question || draft.public_query.standing_question === draft.standing_question) patchQuery("standing_question", event.target.value);
                                                        },
                                                        placeholder: "The internal goal: what should this Watch answer, and why does it matter to your company?",
                                                        rows: 3,
                                                        value: draft.standing_question
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 145,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-label",
                                                children: [
                                                    "Public query",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        className: "text-input watch-question-input",
                                                        onChange: (event)=>patchQuery("standing_question", event.target.value),
                                                        placeholder: "The public-only question sent to the provider. Do not include private company or matter details.",
                                                        rows: 3,
                                                        value: draft.public_query.standing_question
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "small muted",
                                                        children: "Only public collection terms and public entities belong here."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 155,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 140,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                        style: {
                                            border: 0,
                                            padding: 0,
                                            margin: "18px 0 0"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                                className: "field-label",
                                                children: "Purpose"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 167,
                                                columnNumber: 73
                                            }, this),
                                            purposes.map((purpose)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "checkbox-row",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            checked: draft.purposes.includes(purpose.id),
                                                            onChange: ()=>patch({
                                                                    purposes: draft.purposes.includes(purpose.id) ? draft.purposes.filter((item)=>item !== purpose.id) : [
                                                                        ...draft.purposes,
                                                                        purpose.id
                                                                    ]
                                                                }),
                                                            type: "checkbox"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/WatchBuilder.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 197
                                                        }, this),
                                                        purpose.label
                                                    ]
                                                }, purpose.id, true, {
                                                    fileName: "[project]/components/WatchBuilder.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 148
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 167,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 139,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "card card-pad",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Public topics and scope"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 169,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "Use commas to separate values."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 169,
                                        columnNumber: 74
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].scope : undefined,
                                        style: phase2 ? undefined : {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                                            gap: 14
                                        },
                                        children: [
                                            "keywords",
                                            "topics",
                                            "jurisdictions",
                                            "regulators",
                                            "courts",
                                            "industries"
                                        ].map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-label",
                                                children: [
                                                    titleCase(key),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "text-input",
                                                        onChange: (event)=>patchQuery(key, split(event.target.value)),
                                                        value: join(draft.public_query[key])
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 459
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 169,
                                                columnNumber: 402
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 169,
                                        columnNumber: 129
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 169,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "watch-sources",
                                className: "card card-pad",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Named sources and roles"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 170,
                                        columnNumber: 61
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "Source type states what a source is. Role states how this Watch uses it."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 170,
                                        columnNumber: 93
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SourceRoleEditor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        presentation: presentation,
                                        onChange: (sources)=>patch({
                                                sources
                                            }),
                                        sources: draft.sources
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 170,
                                        columnNumber: 190
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 170,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "card card-pad",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Provider"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 171,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "The choice is saved on this Watch. A provider failure does not change it."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 171,
                                        columnNumber: 59
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "btn-row",
                                        children: [
                                            "native",
                                            "polaris",
                                            "both"
                                        ].map((provider)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "aria-pressed": draft.provider === provider,
                                                className: `btn ${draft.provider === provider ? "primary" : ""}`,
                                                onClick: ()=>patch({
                                                        provider
                                                    }),
                                                type: "button",
                                                children: provider === "native" ? "Themis.ai native" : titleCase(provider)
                                            }, provider, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 171,
                                                columnNumber: 256
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 171,
                                        columnNumber: 157
                                    }, this),
                                    providers.filter((provider)=>!provider.available || provider.warning).map((provider)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "warning-callout",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: [
                                                        provider.label,
                                                        ":"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/WatchBuilder.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 670
                                                }, this),
                                                " ",
                                                provider.warning || "Not available."
                                            ]
                                        }, provider.provider_id, true, {
                                            fileName: "[project]/components/WatchBuilder.tsx",
                                            lineNumber: 171,
                                            columnNumber: 612
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 171,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                id: "watch-internal",
                                className: "card card-pad",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Internal matching scope"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 172,
                                        columnNumber: 62
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "muted",
                                        children: "This private scope stays inside Themis.ai. Use commas to separate record IDs or paths."
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 172,
                                        columnNumber: 94
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].internal : undefined,
                                        style: phase2 ? undefined : {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                                            gap: 14
                                        },
                                        children: [
                                            [
                                                "product_ids",
                                                "company_paths",
                                                "matter_ids",
                                                "decision_ids",
                                                "mitigation_ids"
                                            ].map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "field-label",
                                                    children: [
                                                        titleCase(key),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "text-input",
                                                            onChange: (event)=>patchScope(key, split(event.target.value)),
                                                            value: join(draft.internal_scope[key])
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/WatchBuilder.tsx",
                                                            lineNumber: 172,
                                                            columnNumber: 541
                                                        }, this)
                                                    ]
                                                }, key, true, {
                                                    fileName: "[project]/components/WatchBuilder.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 484
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field-label",
                                                children: [
                                                    "Lookback days",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "text-input",
                                                        min: 1,
                                                        onChange: (event)=>patchScope("lookback_days", Number(event.target.value)),
                                                        type: "number",
                                                        value: draft.internal_scope.lookback_days
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 732
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 172,
                                                columnNumber: 688
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 172,
                                        columnNumber: 205
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 172,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScheduleSection, {
                                draft: draft,
                                patch: patch
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 173,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "card card-pad",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Briefing and review behavior"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 174,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "checkbox-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                checked: draft.briefing.create_items,
                                                onChange: (event)=>patch({
                                                        briefing: {
                                                            ...draft.briefing,
                                                            create_items: event.target.checked
                                                        }
                                                    }),
                                                type: "checkbox"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 174,
                                                columnNumber: 111
                                            }, this),
                                            "Create Briefing items"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 174,
                                        columnNumber: 79
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "checkbox-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                checked: draft.briefing.create_digest,
                                                onChange: (event)=>patch({
                                                        briefing: {
                                                            ...draft.briefing,
                                                            create_digest: event.target.checked
                                                        }
                                                    }),
                                                type: "checkbox"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 174,
                                                columnNumber: 336
                                            }, this),
                                            "Create a digest"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 174,
                                        columnNumber: 304
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "checkbox-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                checked: draft.review.enabled,
                                                onChange: (event)=>patch({
                                                        review: {
                                                            ...draft.review,
                                                            enabled: event.target.checked
                                                        }
                                                    }),
                                                type: "checkbox"
                                            }, void 0, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 174,
                                                columnNumber: 557
                                            }, this),
                                            "Create review connections when company work may be affected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 174,
                                        columnNumber: 525
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field-label",
                                        style: {
                                            marginTop: 12
                                        },
                                        children: [
                                            "Default attention",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                className: "select-input",
                                                disabled: !draft.review.enabled,
                                                onChange: (event)=>patch({
                                                        review: {
                                                            ...draft.review,
                                                            default_attention: event.target.value
                                                        }
                                                    }),
                                                value: draft.review.default_attention,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "briefing_only",
                                                        children: "Briefing only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 1069
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "monitor",
                                                        children: "Monitor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 1121
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "this_week",
                                                        children: "This week"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 1161
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "required",
                                                        children: "Required"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 174,
                                                        columnNumber: 1205
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 174,
                                                columnNumber: 846
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 174,
                                        columnNumber: 772
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 174,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 138,
                        columnNumber: 7
                    }, this),
                    !(phase2 && record) ? actions : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchScanPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        presentation: presentation,
                        scan: runs[0] ?? null
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 177,
                        columnNumber: 7
                    }, this),
                    record || phase2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: phase2 ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].history : "card card-pad",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Run history"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 178,
                                columnNumber: 90
                            }, this),
                            runs.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "row-list",
                                style: {
                                    margin: "12px -20px -18px"
                                },
                                children: runs.map((run)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            titleCase(run.mode),
                                                            " scan"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 273
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "record-meta",
                                                        style: {
                                                            marginTop: 6
                                                        },
                                                        children: [
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$design$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTime"])(run.started_at),
                                                            " · ",
                                                            run.scan_id
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/WatchBuilder.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 316
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 178,
                                                columnNumber: 248
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `state-label ${run.status === "success" ? "state-healthy" : run.status === "failed" ? "state-failure" : run.status === "running" ? "state-agent" : "state-attention"}`,
                                                children: titleCase(run.status)
                                            }, void 0, false, {
                                                fileName: "[project]/components/WatchBuilder.tsx",
                                                lineNumber: 178,
                                                columnNumber: 430
                                            }, this)
                                        ]
                                    }, run.scan_id, true, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 178,
                                        columnNumber: 209
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 178,
                                columnNumber: 125
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "muted",
                                children: "No scans yet."
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 178,
                                columnNumber: 662
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 178,
                        columnNumber: 27
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 137,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WatchBuilder.tsx",
        lineNumber: 128,
        columnNumber: 10
    }, this);
}
function ScheduleSection({ draft, patch }) {
    const recurrence = draft.recurrence;
    function set(change) {
        patch({
            recurrence: {
                ...recurrence,
                ...change
            }
        });
    }
    function kind(value) {
        if (value === "manual") set({
            kind: value,
            interval_seconds: null,
            local_time: null,
            time_zone: null,
            weekdays: []
        });
        else if (value === "interval") set({
            kind: value,
            interval_seconds: recurrence.interval_seconds || 86400,
            local_time: null,
            time_zone: null,
            weekdays: []
        });
        else set({
            kind: value,
            interval_seconds: null,
            local_time: recurrence.local_time || "08:00",
            time_zone: recurrence.time_zone || "UTC",
            weekdays: value === "weekday" ? recurrence.weekdays.length ? recurrence.weekdays : [
                "monday"
            ] : []
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "watch-schedule",
        className: "card card-pad",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Cadence and time zone"
            }, void 0, false, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 191,
                columnNumber: 65
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "field-label",
                        children: [
                            "Cadence",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "select-input",
                                onChange: (event)=>kind(event.target.value),
                                value: recurrence.kind,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "manual",
                                        children: "Manual only"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 370
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "interval",
                                        children: "Interval"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 413
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "daily",
                                        children: "Daily"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 455
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "weekday",
                                        children: "Selected weekdays"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 491
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 236
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 191,
                        columnNumber: 198
                    }, this),
                    recurrence.kind === "interval" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "field-label",
                        children: [
                            "Every (hours)",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "text-input",
                                min: 1,
                                onChange: (event)=>set({
                                        interval_seconds: Number(event.target.value) * 3600
                                    }),
                                type: "number",
                                value: (recurrence.interval_seconds || 3600) / 3600
                            }, void 0, false, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 636
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 191,
                        columnNumber: 592
                    }, this) : null,
                    recurrence.kind === "daily" || recurrence.kind === "weekday" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "field-label",
                                children: [
                                    "Local time",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "text-input",
                                        onChange: (event)=>set({
                                                local_time: event.target.value
                                            }),
                                        type: "time",
                                        value: recurrence.local_time || "08:00"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 949
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 908
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "field-label",
                                children: [
                                    "IANA time zone",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "text-input",
                                        onChange: (event)=>set({
                                                time_zone: event.target.value
                                            }),
                                        value: recurrence.time_zone || "UTC"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 1149
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 1104
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 191,
                        columnNumber: 906
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 191,
                columnNumber: 95
            }, this),
            recurrence.kind === "weekday" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                style: {
                    border: 0,
                    padding: 0,
                    margin: "16px 0 0"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                        className: "field-label",
                        children: "Run on"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 191,
                        columnNumber: 1402
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "btn-row",
                        children: weekdays.map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "checkbox-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        checked: recurrence.weekdays.includes(day),
                                        onChange: ()=>set({
                                                weekdays: recurrence.weekdays.includes(day) ? recurrence.weekdays.filter((item)=>item !== day) : [
                                                    ...recurrence.weekdays,
                                                    day
                                                ]
                                            }),
                                        type: "checkbox"
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchBuilder.tsx",
                                        lineNumber: 191,
                                        columnNumber: 1539
                                    }, this),
                                    titleCase(day)
                                ]
                            }, day, true, {
                                fileName: "[project]/components/WatchBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 1497
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/WatchBuilder.tsx",
                        lineNumber: 191,
                        columnNumber: 1449
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchBuilder.tsx",
                lineNumber: 191,
                columnNumber: 1338
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/WatchBuilder.tsx",
        lineNumber: 191,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/WatchScanPreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WatchScanPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/components/WatchesPhase2.module.css [app-ssr] (css module)");
;
;
const label = (value)=>value.replaceAll("_", " ").replace(/^./, (letter)=>letter.toUpperCase());
const state = (value)=>value === "failed" ? "state-failure" : value === "success" ? "state-healthy" : value === "running" ? "state-agent" : "state-attention";
function count(total, noun) {
    return `${total} ${noun}${total === 1 ? "" : "s"}`;
}
function WatchScanPreview({ scan, presentation = "matter" }) {
    if (!scan) return presentation === "phase2" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Scan preview"
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 10,
                columnNumber: 85
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "Scan preview is unavailable before the first scan."
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 10,
                columnNumber: 106
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WatchScanPreview.tsx",
        lineNumber: 10,
        columnNumber: 49
    }, this) : null;
    const samples = scan.provider_results.flatMap((result)=>result.candidates.map((candidate)=>({
                ...candidate,
                provider: result.provider_id
            })));
    const retainedProviders = scan.provider_results.filter((result)=>result.candidates.length > 0 || result.bounded_excerpt.trim()).map((result)=>label(result.provider_id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview : "agent-note",
        "aria-labelledby": "scan-preview-heading",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "agent-label",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "agent-mark"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 14,
                        columnNumber: 34
                    }, this),
                    "Durable scan preview"
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 14,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "scan-preview-heading",
                        children: "Scan results"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 15,
                        columnNumber: 102
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `state-label ${state(scan.status)}`,
                        children: label(scan.status)
                    }, void 0, false, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 15,
                        columnNumber: 149
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 15,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                style: {
                    margin: "8px 0 0"
                },
                children: [
                    count(scan.development_count, "development"),
                    " · ",
                    count(scan.briefing_item_count, "Briefing item"),
                    " · ",
                    count(scan.review_packet_count, "review connection")
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 16,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    marginTop: 20
                },
                children: "Provider outcomes"
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 17,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stack-list",
                style: {
                    marginTop: 10
                },
                children: scan.provider_results.map((result)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card card-pad",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: label(result.provider_id)
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchScanPreview.tsx",
                                        lineNumber: 19,
                                        columnNumber: 82
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `state-label ${state(result.status)}`,
                                        children: label(result.status)
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchScanPreview.tsx",
                                        lineNumber: 19,
                                        columnNumber: 126
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 19,
                                columnNumber: 7
                            }, this),
                            result.bounded_excerpt.trim() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: presentation === "phase2" ? __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].generated : undefined,
                                style: presentation === "matter" ? {
                                    marginTop: 14
                                } : undefined,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "record-meta",
                                        children: [
                                            label(result.provider_id),
                                            " provider excerpt"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/WatchScanPreview.tsx",
                                        lineNumber: 20,
                                        columnNumber: 180
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            whiteSpace: "pre-wrap",
                                            overflowWrap: "anywhere",
                                            margin: "8px 0 0"
                                        },
                                        children: result.bounded_excerpt
                                    }, void 0, false, {
                                        fileName: "[project]/components/WatchScanPreview.tsx",
                                        lineNumber: 20,
                                        columnNumber: 259
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 20,
                                columnNumber: 40
                            }, this) : null,
                            result.warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                children: result.warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: warning
                                    }, warning, false, {
                                        fileName: "[project]/components/WatchScanPreview.tsx",
                                        lineNumber: 21,
                                        columnNumber: 71
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 21,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "small muted",
                                style: {
                                    margin: "8px 0 0"
                                },
                                children: "No provider warnings."
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 21,
                                columnNumber: 113
                            }, this)
                        ]
                    }, result.provider_id, true, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 18,
                        columnNumber: 98
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 18,
                columnNumber: 5
            }, this),
            presentation === "phase2" && scan.provider_results.some((result)=>result.status === "failed") && retainedProviders.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WatchesPhase2$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].generated,
                children: [
                    "Useful results are retained from ",
                    retainedProviders.join(" and "),
                    ". The selected providers have not changed."
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 23,
                columnNumber: 136
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    marginTop: 20
                },
                children: "Source coverage"
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 24,
                columnNumber: 5
            }, this),
            scan.source_coverage.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                children: scan.source_coverage.map((coverage, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: [
                                    label(coverage.status),
                                    ":"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 25,
                                columnNumber: 146
                            }, this),
                            " ",
                            coverage.message || coverage.url || coverage.source_id
                        ]
                    }, `${coverage.source_id ?? coverage.url}-${index}`, true, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 25,
                        columnNumber: 87
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 25,
                columnNumber: 36
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "No source coverage was reported."
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 25,
                columnNumber: 260
            }, this),
            scan.warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "warning-callout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Warnings"
                    }, void 0, false, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 26,
                        columnNumber: 62
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        children: scan.warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: warning
                            }, warning, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 26,
                                columnNumber: 123
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 26,
                        columnNumber: 87
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 26,
                columnNumber: 29
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    marginTop: 20
                },
                children: "Sample items"
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 27,
                columnNumber: 5
            }, this),
            samples.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "stack-list",
                style: {
                    marginTop: 10
                },
                children: samples.slice(0, 5).map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "card card-pad",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "record-meta",
                                children: label(item.provider)
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 28,
                                columnNumber: 210
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 28,
                                columnNumber: 267
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "muted",
                                style: {
                                    margin: "6px 0 0"
                                },
                                children: item.summary
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 28,
                                columnNumber: 296
                            }, this),
                            item.canonical_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                className: "auto-link",
                                href: item.canonical_url,
                                rel: "noreferrer",
                                target: "_blank",
                                children: "Read source"
                            }, void 0, false, {
                                fileName: "[project]/components/WatchScanPreview.tsx",
                                lineNumber: 28,
                                columnNumber: 387
                            }, this) : null
                        ]
                    }, `${item.provider}-${item.canonical_url}-${index}`, true, {
                        fileName: "[project]/components/WatchScanPreview.tsx",
                        lineNumber: 28,
                        columnNumber: 119
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 28,
                columnNumber: 23
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "muted",
                children: "No sample items were returned."
            }, void 0, false, {
                fileName: "[project]/components/WatchScanPreview.tsx",
                lineNumber: 28,
                columnNumber: 515
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/WatchScanPreview.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
}),
"[project]/components/WatchesPhase2.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "WatchesPhase2-module___XJKtG__actions",
  "assignment": "WatchesPhase2-module___XJKtG__assignment",
  "back": "WatchesPhase2-module___XJKtG__back",
  "builder": "WatchesPhase2-module___XJKtG__builder",
  "detail": "WatchesPhase2-module___XJKtG__detail",
  "empty": "WatchesPhase2-module___XJKtG__empty",
  "emptyIcon": "WatchesPhase2-module___XJKtG__emptyIcon",
  "explanation": "WatchesPhase2-module___XJKtG__explanation",
  "fields": "WatchesPhase2-module___XJKtG__fields",
  "flow": "WatchesPhase2-module___XJKtG__flow",
  "generated": "WatchesPhase2-module___XJKtG__generated",
  "header": "WatchesPhase2-module___XJKtG__header",
  "heading": "WatchesPhase2-module___XJKtG__heading",
  "history": "WatchesPhase2-module___XJKtG__history",
  "index": "WatchesPhase2-module___XJKtG__index",
  "internal": "WatchesPhase2-module___XJKtG__internal",
  "lede": "WatchesPhase2-module___XJKtG__lede",
  "meta": "WatchesPhase2-module___XJKtG__meta",
  "nav": "WatchesPhase2-module___XJKtG__nav",
  "page": "WatchesPhase2-module___XJKtG__page",
  "preview": "WatchesPhase2-module___XJKtG__preview",
  "providerButtons": "WatchesPhase2-module___XJKtG__providerButtons",
  "scope": "WatchesPhase2-module___XJKtG__scope",
  "sourceGrid": "WatchesPhase2-module___XJKtG__sourceGrid",
  "sources": "WatchesPhase2-module___XJKtG__sources",
  "table": "WatchesPhase2-module___XJKtG__table",
  "tableWrap": "WatchesPhase2-module___XJKtG__tableWrap",
});
}),
];

//# sourceMappingURL=components_0stf7xi._.js.map