"use client";

import { ChangeEvent, DragEvent, useState } from "react";
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
  const [open, setOpen] = useState(depth < 2);
  if (node.type === "folder") {
    const folderLabel = treeLabel(node);
    return (
      <div>
        <div className="tree-folder-row">
          <button className="tree-row" onClick={() => setOpen((value) => !value)} type="button">
            <span className="tree-folder">{open ? "▾" : "▸"} {folderLabel}</span>
          </button>
          {node.name === "conversations" ? (
            <button aria-label="New chat" className="tree-add" onClick={onNewChat} title="New chat" type="button">+</button>
          ) : null}
        </div>
        {open && node.children ? (
          <div className="tree-indent">
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

function treeLabel(node: FileNode): string {
  if (node.name === "work-product") return "Work Product";
  if (node.name === "draft") return "Draft";
  if (node.name === "final") return "Final";
  if (node.name === "dossier.md") return "Dossier";
  if (node.name === "conversations") return "Chats";
  return node.label ?? node.name;
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
  const conversationFolder = tree.find((node) => node.type === "folder" && node.name === "conversations");
  const visibleTree: FileNode[] = conversationFolder
    ? tree
    : [{ name: "conversations", label: "Chats", path: "", type: "folder", children: [] }, ...tree];

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
