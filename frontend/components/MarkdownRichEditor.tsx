"use client";

import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { ListItemNode, ListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  HEADING,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  type Transformer,
  UNORDERED_LIST,
} from "@lexical/markdown";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "lexical";

const MARKDOWN_TRANSFORMERS: Transformer[] = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
];

function ToolbarButton({
  label,
  title,
  onClick,
}: {
  label: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button className="rich-toolbar-button" type="button" aria-label={title} title={title} onClick={onClick}>
      {label}
    </button>
  );
}

function EditorToolbar() {
  const [editor] = useLexicalComposerContext();

  function formatText(format: TextFormatType) {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }

  function formatBlock(kind: "paragraph" | "heading" | "quote") {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (kind === "heading") $setBlocksType(selection, () => $createHeadingNode("h2"));
      if (kind === "quote") $setBlocksType(selection, () => $createQuoteNode());
      if (kind === "paragraph") $setBlocksType(selection, () => $createParagraphNode());
    });
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (url === null) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim() || null);
  }

  return (
    <div className="rich-toolbar" role="toolbar" aria-label="Document formatting">
      <ToolbarButton label="Text" title="Paragraph" onClick={() => formatBlock("paragraph")} />
      <ToolbarButton label="H2" title="Heading" onClick={() => formatBlock("heading")} />
      <span className="rich-toolbar-separator" />
      <ToolbarButton label="B" title="Bold" onClick={() => formatText("bold")} />
      <ToolbarButton label="I" title="Italic" onClick={() => formatText("italic")} />
      <ToolbarButton label="Link" title="Add or remove link" onClick={addLink} />
      <span className="rich-toolbar-separator" />
      <ToolbarButton label="Quote" title="Quote" onClick={() => formatBlock("quote")} />
      <ToolbarButton label="Bullets" title="Bullet list" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} />
      <ToolbarButton label="1. List" title="Numbered list" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} />
    </div>
  );
}

export default function MarkdownRichEditor({
  markdown,
  onChange,
  readOnly = false,
}: {
  markdown: string;
  onChange?: (markdown: string) => void;
  readOnly?: boolean;
}) {
  const initialConfig = {
    namespace: "CounselOsMarkdownEditor",
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
    theme: {
      heading: {
        h1: "rich-heading rich-heading-h1",
        h2: "rich-heading rich-heading-h2",
        h3: "rich-heading rich-heading-h3",
      },
      link: "rich-link",
      list: { listitem: "rich-list-item", nested: { listitem: "rich-list-item-nested" }, ol: "rich-list-ordered", ul: "rich-list-unordered" },
      paragraph: "rich-paragraph",
      quote: "rich-quote",
      text: { bold: "rich-bold", italic: "rich-italic" },
    },
    editorState: () => $convertFromMarkdownString(markdown, MARKDOWN_TRANSFORMERS),
    editable: !readOnly,
    onError(error: Error) {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rich-editor-shell">
        {readOnly ? null : <EditorToolbar />}
        <div className="rich-editor-surface">
          <RichTextPlugin
            contentEditable={<ContentEditable className="rich-content" />}
            placeholder={<div className="rich-placeholder">Start drafting…</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      {readOnly ? null : (
        <>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
          <OnChangePlugin
            ignoreSelectionChange
            onChange={(editorState) => editorState.read(() => onChange?.($convertToMarkdownString(MARKDOWN_TRANSFORMERS)))}
          />
        </>
      )}
    </LexicalComposer>
  );
}
