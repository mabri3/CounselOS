"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { userFacingMatterTree } from "@/lib/matterBrief";
import type { FileNode } from "@/lib/types";

function TreeNode({
  node,
  activePath,
  onNewChat,
  onSelect,
  depth = 0,
}: {
  node: FileNode;
  activePath: string | null;
  onNewChat: () => void;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth === 0 && isCoreFolder(node.name));
  if (node.type === "folder") {
    const folderLabel = treeLabel(node);
    return (
      <div>
        <div className="tree-folder-row">
          <button
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${folderLabel}`}
            className="tree-row"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span className="tree-folder">{open ? "▾" : "▸"} {folderLabel}</span>
          </button>
          {node.name === "conversations" ? (
            <button aria-label="New chat" className="tree-add" onClick={onNewChat} title="New chat" type="button">+</button>
          ) : null}
        </div>
        {open && node.children ? (
          <div className="tree-indent">
            {node.name === "matter-records" ? (
              <p className="tree-group-help">Structured records captured from intake, documents, chat, lawyer edits, and system actions.</p>
            ) : null}
            {node.children.map((child) => (
              <TreeNode key={child.path} node={child} activePath={activePath} onNewChat={onNewChat} onSelect={onSelect} depth={depth + 1} />
            ))}
            {node.name === "conversations" && !node.children.length ? <div className="tree-empty">No saved chats</div> : null}
          </div>
        ) : null}
      </div>
    );
  }
  const kind = node.record_type === "chat_transcript"
    ? "conversation"
    : node.path.includes("/research/") || node.path.includes("/drafts/")
    ? "agent"
    : node.extension === ".md" ? "human" : "source";
  return (
    <button
      className={`tree-row ${activePath === node.path ? "active" : ""}`}
      onClick={() => onSelect(node.path)}
      title={node.label ?? node.name}
      type="button"
    >
      <span className={`tree-dot ${kind}`} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{treeLabel(node)}</span>
    </button>
  );
}

function isCoreFolder(name: string): boolean {
  return ["documents", "research", "work-product"].includes(name);
}

function treeLabel(node: FileNode): string {
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

const RECORD_LABELS: Record<string, string> = {
  "matter.md": "Matter details",
  "facts.md": "Facts, sources & assumptions",
  "issues.md": "Issue map",
  "participants.md": "People & roles",
  "recommendations.md": "Working recommendations",
  "work-items": "Work to do",
  "decisions": "Recorded decisions",
  "events": "Activity history",
  "dossier-revisions": "Dossier revisions",
};

const DIRECT_ORDER = ["request.md", "documents", "conversations", "research", "work-product", "dossier.md", "drafts"];

function presentMatterTree(tree: FileNode[]): FileNode[] {
  const conversations: FileNode = tree.find((node) => node.type === "folder" && node.name === "conversations")
    ?? { name: "conversations", label: "Chats", path: "", type: "folder" as const, children: [] };
  const nodes: FileNode[] = tree.includes(conversations) ? tree : [conversations, ...tree];
  const byName = new Map(nodes.map((node) => [node.name, node]));
  const direct = DIRECT_ORDER.flatMap((name) => {
    const node = byName.get(name);
    return node ? [{ ...node, label: treeLabel(node) }] : [];
  });
  const records = Object.entries(RECORD_LABELS).flatMap(([name, label]) => {
    const node = byName.get(name);
    return node ? [{ ...node, label }] : [];
  });
  const groupedNames = new Set([...DIRECT_ORDER, ...Object.keys(RECORD_LABELS)]);
  const remaining = nodes.filter((node) => !groupedNames.has(node.name));
  const matterRecords: FileNode = {
    name: "matter-records",
    label: "Matter Records",
    path: "virtual:matter-records",
    type: "folder",
    children: records,
  };
  return [...direct, matterRecords, ...remaining];
}

export default function MatterTree({
  tree,
  activePath,
  onNewChat,
  onSelect,
  onUpload,
  uploading,
}: {
  tree: FileNode[];
  activePath: string | null;
  onNewChat: () => void;
  onSelect: (path: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const visibleTree = presentMatterTree(userFacingMatterTree(tree));

  async function uploadFromInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await onUpload(file);
    event.target.value = "";
  }

  async function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) await onUpload(file);
  }

  return (
    <>
      <div className="tree">
        {visibleTree.map((node) => (
          <TreeNode key={node.path || node.name} node={node} activePath={activePath} onNewChat={onNewChat} onSelect={onSelect} />
        ))}
      </div>
      <div
        className={`drop-zone ${dragging ? "active" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        {uploading ? "Uploading and extracting…" : "Drop a PDF, Word file, Markdown or text here"}
        <div style={{ marginTop: 10 }}>
          <label className="btn compact" style={{ display: "inline-block" }}>
            Choose a file
            <input hidden type="file" onChange={uploadFromInput} accept=".md,.txt,.pdf,.docx" />
          </label>
        </div>
      </div>
    </>
  );
}
