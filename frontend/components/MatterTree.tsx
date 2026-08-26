"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import type { FileNode } from "@/lib/types";

function TreeNode({
  node,
  activePath,
  onSelect,
  depth = 0,
}: {
  node: FileNode;
  activePath: string | null;
  onSelect: (path: string) => void;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  if (node.type === "folder") {
    return (
      <div>
        <div className="tree-row" onClick={() => setOpen((value) => !value)}>
          <span>{open ? "⌄" : "›"}</span>
          <span>▱</span>
          <span>{node.name}</span>
        </div>
        {open && node.children ? (
          <div className="tree-indent">
            {node.children.map((child) => (
              <TreeNode key={child.path} node={child} activePath={activePath} onSelect={onSelect} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div className={`tree-row ${activePath === node.path ? "active" : ""}`} onClick={() => onSelect(node.path)}>
      <span>{node.extension === ".md" ? "◇" : "□"}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.name}</span>
    </div>
  );
}

export default function MatterTree({
  tree,
  activePath,
  onSelect,
  onUpload,
  uploading,
}: {
  tree: FileNode[];
  activePath: string | null;
  onSelect: (path: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  const [dragging, setDragging] = useState(false);

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
        {tree.map((node) => (
          <TreeNode key={node.path} node={node} activePath={activePath} onSelect={onSelect} />
        ))}
      </div>
      <div
        className={`drop-zone ${dragging ? "active" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
      >
        {uploading ? "Uploading and extracting…" : "Drop PDF, Word, Markdown, or text here"}
        <div style={{ marginTop: 8 }}>
          <label className="button compact" style={{ display: "inline-block", textTransform: "none", letterSpacing: 0, color: "var(--text)" }}>
            Choose file
            <input hidden type="file" onChange={uploadFromInput} accept=".md,.txt,.pdf,.docx,.csv,.json" />
          </label>
        </div>
      </div>
    </>
  );
}
