import type { ConversationTarget, DocumentIdentity, LocalEditorSnapshot } from "../../lib/workspaceTypes.ts";
export type MessageDocument = Pick<DocumentIdentity, "document_id" | "title" | "path" | "revision">;
export type MessageContext = {
    documents: MessageDocument[];
    target?: ConversationTarget;
    locked: boolean;
    commentId?: string;
};
export function documentContext(matterId: string, document: DocumentIdentity, snapshot?: LocalEditorSnapshot): MessageContext {
    const basis = snapshot?.dirty ? snapshot.base_revision : document.revision;
    return { locked: false, documents: [{ document_id: document.document_id, title: document.title, path: document.path, revision: basis }],
        target: { matter_id: matterId, artifact_path: document.path, artifact_revision: basis,
            ...(snapshot?.dirty ? { local_draft_snapshot: snapshot.content, artifact_review_revision: snapshot.review_revision } : {}),
            ...(snapshot?.selected_range ? { selected_range: { ...snapshot.selected_range } } : {}) } };
}
export function followActive(current: MessageContext, next: MessageContext): MessageContext {
    return current.locked ? current : next;
}
export function freezeMessageContext(context: MessageContext): MessageContext {
    return structuredClone({ ...context, locked: true });
}
export function contextSelections(context: MessageContext) {
    return context.documents.map(document => ({ reference_id: document.document_id, path: document.path, revision: document.revision, role: "source_file", selected: true }));
}
