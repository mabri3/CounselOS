import { TextNode, type EditorConfig, type LexicalNode, type NodeKey, type SerializedTextNode, type Spread } from "lexical";
import { displayReviewAuthor } from "@/lib/reviewAuthor";

export type RevisionKind = "insert" | "delete" | "comment";
export type SerializedRevisionTextNode = Spread<{ type: "revision-text"; version: 1; revisionKind: RevisionKind; authorName: string; authorColor: string; changeId: string }, SerializedTextNode>;

export class RevisionTextNode extends TextNode {
  __revisionKind: RevisionKind;
  __authorName: string;
  __authorColor: string;
  __changeId: string;

  static getType() { return "revision-text"; }
  static clone(node: RevisionTextNode) { return new RevisionTextNode(node.__text, node.__revisionKind, node.__authorName, node.__authorColor, node.__changeId, node.__key); }
  constructor(text: string, kind: RevisionKind, authorName: string, authorColor: string, changeId: string, key?: NodeKey) {
    super(text, key); this.__revisionKind = kind; this.__authorName = authorName; this.__authorColor = authorColor; this.__changeId = changeId;
  }
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    const authorName = displayReviewAuthor(this.__authorName, ["Themis", "Themis.ai"].includes(this.__authorName) ? "author-themis" : "");
    element.className = `revision-text revision-${this.__revisionKind}`;
    element.style.setProperty("--revision-color", this.__authorColor);
    element.title = `${authorName} · ${this.__revisionKind === "insert" ? "Inserted" : "Deleted"}`;
    element.dataset.author = authorName;
    element.dataset.changeId = this.__changeId;
    return element;
  }
  getTextContent(): string { return this.__revisionKind === "delete" ? "" : super.getTextContent(); }
  getRevisionKind(): RevisionKind { return this.__revisionKind; }
  getChangeId(): string { return this.__changeId; }
  getAuthorName(): string { return this.__authorName; }
  getAuthorColor(): string { return this.__authorColor; }
  updateDOM(previous: this, dom: HTMLElement, config: EditorConfig): boolean {
    const changed = super.updateDOM(previous, dom, config);
    if (previous.__revisionKind !== this.__revisionKind || previous.__authorName !== this.__authorName || previous.__authorColor !== this.__authorColor) {
      const authorName = displayReviewAuthor(this.__authorName, ["Themis", "Themis.ai"].includes(this.__authorName) ? "author-themis" : "");
      dom.className = `revision-text revision-${this.__revisionKind}`;
      dom.style.setProperty("--revision-color", this.__authorColor);
      dom.title = `${authorName} · ${this.__revisionKind === "insert" ? "Inserted" : "Deleted"}`;
      dom.dataset.author = authorName;
    }
    return changed;
  }
  exportJSON(): SerializedRevisionTextNode { return { ...super.exportJSON(), type: "revision-text", version: 1, revisionKind: this.__revisionKind, authorName: this.__authorName, authorColor: this.__authorColor, changeId: this.__changeId }; }
  static importJSON(serialized: SerializedRevisionTextNode) { return new RevisionTextNode(serialized.text, serialized.revisionKind, serialized.authorName, serialized.authorColor, serialized.changeId).updateFromJSON(serialized); }
  isTextEntity(): boolean { return this.__revisionKind === "delete"; }
}

export function $createRevisionTextNode(text: string, kind: RevisionKind, authorName: string, authorColor: string, changeId: string): RevisionTextNode {
  return new RevisionTextNode(text, kind, authorName, authorColor, changeId);
}
export function $isRevisionTextNode(node: LexicalNode | null | undefined): node is RevisionTextNode { return node instanceof RevisionTextNode; }
