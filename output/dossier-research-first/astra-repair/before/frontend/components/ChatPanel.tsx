"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import AttachmentPicker from "@/components/AttachmentPicker";
import ChatCards, { WorkspaceReceiptCards } from "@/components/ChatCards";
import SkillCommandMenu from "@/components/SkillCommandMenu";
import LinkifiedText from "@/components/LinkifiedText";
import UploadIntentCard from "@/components/UploadIntentCard";
import { cancelChatRun, getChatRun, getChatRuns, getConversation, getConversations, getSkills, recoverIntakeQuestion, retryChatRun, saveWorkProductDraft, startChatRun, uploadDocuments } from "@/lib/api";
import { chatAgentId, chatDraftStorageKey, chatFailureGuidance, chatProgressLabel, chatRunStateLabel, chatRunStorageKey, chatSuggestions, conversationChatDraftStorageKey, durableChatProgress, historicalQuestionStates, intakeRecoveryKey, legacyChatDraftStorageKey, legacyChatRunStorageKey, mergeChatMessages, needsIntakeQuestionRecovery, pendingChatRunId, promoteConversationComposer, rememberChatRun, remainingComposerValue, safeChatFailureDetail, shouldCompactIntakeTurn, shouldShowChatRunStatus, storeConversationComposer } from "@/lib/chatRunLogic";
import { legacyQuestionModeStorageKey, questionModeStorageKey } from "@/lib/chatCardLogic";
import { mergeBackgroundDraft } from "@/lib/dossierRequests";
import { skillBuilderGoal } from "@/lib/skills";
import type { AppliedSkillSummary, AttachmentReference, CardAction, ChatCard, ChatRun, IntakeAnswer, OperationResult, QuestionMode, SkillDefinition, ToolTrace } from "@/lib/types";
import ChatMatterQuestions from "@/components/workspace/ChatMatterQuestions";
import { notifyMatterChanged, subscribeMatterChanges } from "@/lib/api";
import ClaimMarkdown from "@/components/workspace/ClaimMarkdown";
import type { ConversationTarget, DocumentIdentity, DocumentReferenceTarget, InteractionReceipt, WorkspaceClaim } from "@/lib/workspaceTypes";
import styles from "@/components/workspace/MatterConversation.module.css";

type ChatOperationResult = OperationResult & { proposal?: Record<string, unknown> };
type Message = { message_id?: string; run_id?: string; workspace_action?: string | null; role: "user" | "assistant"; content: string; trace?: ToolTrace[]; cards?: ChatCard[]; attachments?: AttachmentReference[]; applied_skills?: AppliedSkillSummary[]; card_action?: CardAction | null; operation_results?: ChatOperationResult[] };

function conversationTargetLabel(target: ConversationTarget | undefined, matterTitle: string): string {
  if (target?.condition_id) return "Selected numbered question";
  if (target?.scenario_id) return "Saved scenario";
  if (target?.artifact_path) return `Document: ${target.artifact_path.split("/").at(-1)}`;
  if (target?.selected_range?.text) return "Selected passage";
  if (target?.local_draft_snapshot) return "Local draft snapshot";
  if (target?.source_id) return "Selected source";
  if (target?.issue_id) return "Selected issue";
  if (target?.business_question_id) return "Business question";
  return `Matter: ${matterTitle}`;
}

function terminalRunToken(run: ChatRun): string | null {
  return ["completed", "failed", "interrupted"].includes(run.state) && run.finished_at && Number.isFinite(Date.parse(run.finished_at))
    ? JSON.stringify([run.run_id, run.state, run.finished_at]) : null;
}

function reconciliationHint(contextKey: string | undefined, matterId: string, conversationId?: string | null, value?: string | null): string | null {
  if (!contextKey) return null;
  const key = JSON.stringify(["themis.ai:chat-run-reconciled:v1", contextKey, matterId, conversationId ?? "new"]);
  try {
    if (value === null) window.localStorage.removeItem(key);
    else if (value !== undefined) window.localStorage.setItem(key, value);
    return window.localStorage.getItem(key);
  } catch { return null; } // Optional refresh hint; storage failure must not hide saved work.
}

function shouldRefreshReconnectedRun(run: ChatRun, messages: Message[], conversationId: string | null, pendingRunId: string | null, hint: string | null = null): boolean {
  const token = terminalRunToken(run);
  // A retained failed-run retry key is not new work after this exact result was reconciled.
  return !token || (Boolean(pendingRunId) && hint !== token)
    || !conversationId || (run.response?.conversation_id ?? run.conversation_id) !== conversationId
    || !run.response?.reply || !messages.some(message => message.message_id && message.role === "assistant"
      && message.run_id === run.run_id && message.content === run.response?.reply);
}

const SHOW_AGENT_TRACES = process.env.NEXT_PUBLIC_SHOW_AGENT_TRACES === "true";

/**
 * Canvas 2b — the copilot is a thread at the foot of the matter, not a pane of
 * its own. Its last line never moves: it can research, draft and move the
 * matter; it records a decision only on explicit instruction.
 */
export default function ChatPanel({
  matterId,
  contextKey,
  externalRun,
  contextSelections,
  onFilesAttached,
  onFilesRemoved,
  selectedTemplateId,
  onRunComplete,
  onBeforeSubmit,
  onRunStarted,
  target,
  onTargetChange,
  expectedQuestionRevision,
  workspaceReceipts,
  onClearTarget,
  matterTitle,
  activeFile,
  activeAgentId,
  initialConversationId,
  initialRunId,
  intakeActive = false,
  onRefresh,
  conversationSeed,
  onConversationChange,
  onOpenDocument,
  onOpenReference,
  onOpenEvidence,
  workspaceClaims = [],
  workspaceDocuments = [],
  seed,
  reviewAuthor,
  lawyerAuthor,
  onReviewAuthorChange,
  currentWorkProductDraftPath,
  decisionOptions = [],
  intakeAnswers = [],
  inquiryRail,
}: {
  matterId: string;
  contextKey?: string;
  externalRun?: ChatRun | null;
  contextSelections?: import("@/lib/workspaceTypes").ContextSelection[];
  onFilesAttached?: (files: AttachmentReference[]) => Promise<void>;
  onFilesRemoved?: (files: AttachmentReference[]) => Promise<void>;
  selectedTemplateId?: string | null;
  onRunComplete?: (run: ChatRun) => void;
  onBeforeSubmit?: () => void;
  onRunStarted?: (run: ChatRun) => void;
  target?: ConversationTarget;
  onTargetChange?: (target: ConversationTarget) => void;
  expectedQuestionRevision?: string;
  workspaceReceipts?: InteractionReceipt[];
  onClearTarget?: () => void;
  matterTitle: string;
  activeFile: string | null;
  activeAgentId?: string | null;
  initialConversationId?: string | null;
  initialRunId?: string | null;
  intakeActive?: boolean;
  onRefresh: () => Promise<void>;
  conversationSeed?: { conversationId: string; revision: number };
  onConversationChange?: (conversationId: string | null) => void;
  onOpenDocument?: (path: string) => void;
  onOpenReference?: (target: DocumentReferenceTarget) => void;
  onOpenEvidence?: (evidence: import("@/lib/workspaceTypes").ClaimEvidence) => void;
  workspaceClaims?: WorkspaceClaim[];
  workspaceDocuments?: DocumentIdentity[];
  seed?: { text: string; revision: number };
  reviewAuthor: string;
  lawyerAuthor: string;
  onReviewAuthorChange: (name: string) => void;
  currentWorkProductDraftPath?: string | null;
  decisionOptions?: string[];
  intakeAnswers?: IntakeAnswer[];
  /** Optional presentation slot for the existing Matter inquiry controls. */
  inquiryRail?: ReactNode;
}) {
  const router = useRouter();
  const [questionTarget, setQuestionTarget] = useState<ConversationTarget | null>(null);
  const targetIdentity = JSON.stringify([target?.condition_id, target?.issue_id, target?.option_id, target?.source_id, target?.scenario_id, target?.artifact_path]);
  useEffect(() => setQuestionTarget(null), [targetIdentity, matterId, contextKey]);
  const effectiveTarget = questionTarget ?? target;
  const legacyInputStorageKey = contextKey ? `${contextKey}:composer` : chatDraftStorageKey(matterId);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState("");
  const syncState = useRef({onRefresh, conversationId});
  syncState.current = {onRefresh, conversationId};
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = subscribeMatterChanges(matterId, () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          await syncState.current.onRefresh();
          const id = syncState.current.conversationId;
          if (id) {
            const saved = await getConversation(matterId, id);
            if (!cancelled && id === syncState.current.conversationId) setMessages(current => mergeChatMessages(current, saved.messages));
          }
        } catch { if (!cancelled) setHistoryError("Saved matter changes could not refresh. Your text is retained. Reload to try again."); }
      }, 200);
    });
    return () => {cancelled = true; clearTimeout(timer); unsubscribe();};
  }, [matterId, contextKey]);
  const composerValue = useRef(input); composerValue.current = input;
  const draftConversationId = conversationId ?? (loadingHistory ? initialConversationId : null);
  const inputStorageKey = conversationChatDraftStorageKey(matterId, draftConversationId);
  const activeInputStorageKey = useRef<string | null>(null);
  const activeDraftConversationId = useRef<string | null>(draftConversationId);
  const skipInputPersistence = useRef(false);
  const [preparedRequest, setPreparedRequest] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [attachments, setAttachments] = useState<AttachmentReference[]>([]);
  useEffect(() => {
    const excluded = new Set((contextSelections ?? []).filter(item => !item.selected).map(item => item.path).filter(Boolean));
    setAttachments(current => current.some(item => excluded.has(item.path)) ? current.filter(item => !excluded.has(item.path)) : current);
  }, [contextSelections]);
  const [uploading, setUploading] = useState(false);
  const [composerUploads, setComposerUploads] = useState<Array<{ id: string; file: File; state: string; detail?: string }>>([]);
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeRun, setActiveRun] = useState<ChatRun | null>(null);
  const threadElement = useRef<HTMLDivElement>(null);
  const latestAnswerElement = useRef<HTMLDivElement>(null);
  const followLatest = useRef(true);
  useEffect(() => { if (followLatest.current) { const frame = requestAnimationFrame(() => { const node = threadElement.current; if (node) node.scrollTop = node.scrollHeight; }); return () => cancelAnimationFrame(frame); } }, [messages, busy]);
  useEffect(() => { if (externalRun?.run_id) { setActiveRun(externalRun); setBusy(["queued", "running"].includes(externalRun.state)); setWaiting(["queued", "running"].includes(externalRun.state)); } }, [externalRun]);
  const [waiting, setWaiting] = useState(false);
  const [refreshingRun, setRefreshingRun] = useState(false);
  const [questionMode, setQuestionMode] = useState<QuestionMode>("guided");
  const [savingAnswerKey, setSavingAnswerKey] = useState<string | null>(null);
  const [expandedAnswerKeys, setExpandedAnswerKeys] = useState<string[]>([]);
  const [savedAnswerPaths, setSavedAnswerPaths] = useState<Record<string, string>>({});
  const [savedAnswerNotices, setSavedAnswerNotices] = useState<Record<string, string>>({});
  const [saveAnswerErrors, setSaveAnswerErrors] = useState<Record<string, string>>({});
  const [intakeRecoveryNotice, setIntakeRecoveryNotice] = useState("");
  const [intakeRecoveryRevision, setIntakeRecoveryRevision] = useState(0);
  const [pendingCardAction, setPendingCardAction] = useState<CardAction | null>(null);
  const terminalRuns = useRef(new Set<string>());
  const intakeRecoveryAttempts = useRef(new Set<string>());

  useEffect(() => {
    if (!busy) { setElapsedSeconds(0); return; }
    const parsed = Date.parse(activeRun?.started_at || activeRun?.created_at || "");
    const started = Number.isFinite(parsed) ? parsed : Date.now();
    const update = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - started) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [activeRun?.created_at, activeRun?.started_at, busy]);

  useEffect(() => { void getSkills().then(({ skills: saved }) => setSkills(saved)).catch(() => setSkills([])); }, []);

  useEffect(() => {
    let saved = window.localStorage.getItem(inputStorageKey);
    if (saved === null) {
      saved = window.localStorage.getItem(legacyInputStorageKey)
        ?? window.localStorage.getItem(legacyChatDraftStorageKey(matterId));
      if (saved !== null) {
        window.localStorage.setItem(inputStorageKey, saved);
        window.localStorage.removeItem(legacyInputStorageKey);
        window.localStorage.removeItem(legacyChatDraftStorageKey(matterId));
      }
    }
    activeInputStorageKey.current = inputStorageKey;
    activeDraftConversationId.current = draftConversationId;
    skipInputPersistence.current = true;
    setInput(saved ?? "");
  }, [draftConversationId, inputStorageKey, legacyInputStorageKey, matterId]);

  useEffect(() => {
    if (skipInputPersistence.current) {
      skipInputPersistence.current = false;
      return;
    }
    if (activeInputStorageKey.current !== inputStorageKey) return;
    if (input) window.localStorage.setItem(inputStorageKey, input);
    else window.localStorage.removeItem(inputStorageKey);
    window.localStorage.removeItem(legacyInputStorageKey);
    window.localStorage.removeItem(legacyChatDraftStorageKey(matterId));
  }, [input, matterId, inputStorageKey, legacyInputStorageKey]);

  useEffect(() => {
    const saved = window.localStorage.getItem(questionModeStorageKey(matterId))
      ?? window.localStorage.getItem(legacyQuestionModeStorageKey(matterId));
    if (saved) window.localStorage.setItem(questionModeStorageKey(matterId), saved);
    setQuestionMode(saved === "set" ? "set" : "guided");
  }, [matterId]);

  function changeQuestionMode(mode: QuestionMode) {
    setQuestionMode(mode);
    window.localStorage.setItem(questionModeStorageKey(matterId), mode);
    window.localStorage.removeItem(legacyQuestionModeStorageKey(matterId));
  }

  function saveOutgoingComposer() {
    storeConversationComposer(
      window.localStorage,
      matterId,
      activeDraftConversationId.current,
      composerValue.current,
    );
  }

  function promoteNewComposer(conversation: string, value = composerValue.current) {
    if (activeDraftConversationId.current !== null) return;
    promoteConversationComposer(
      window.localStorage,
      matterId,
      null,
      conversation,
      value,
    );
  }

  useEffect(() => {
    let cancelled = false;
    setLoadingHistory(true);
    setHistoryError("");
    void getConversations(matterId)
      .then(async ({ conversations: saved }) => {
        if (cancelled) return;
        const targetConversationId = initialConversationId || saved[0]?.conversation_id;
        if (!targetConversationId) {
          setConversationId(null);
          setMessages([]);
          return;
        }
        const conversation = await getConversation(matterId, targetConversationId);
        if (!cancelled) {
          promoteNewComposer(conversation.conversation_id);
          setConversationId(conversation.conversation_id);
          setMessages(conversation.messages);
          onConversationChange?.(conversation.conversation_id);
        }
      })
      .catch((caught) => {
        if (!cancelled) setHistoryError(caught instanceof Error ? caught.message : "Could not load saved chat.");
      })
      .finally(() => { if (!cancelled) setLoadingHistory(false); });
    return () => { cancelled = true; };
  }, [initialConversationId, matterId]);

  const finishRun = useCallback(async (run: ChatRun, refreshMatter = true) => {
    setActiveRun(run);
    setWaiting(false);
    if (terminalRuns.current.has(run.run_id)) {
      setBusy(false);
      return;
    }
    terminalRuns.current.add(run.run_id);
    setBusy(false);
    setRefreshingRun(true);
    if (run.response?.review_author) onReviewAuthorChange(run.response.review_author);
    const nextConversationId = run.response?.conversation_id ?? run.conversation_id;
    if (nextConversationId) {
      try {
        const saved = await getConversation(matterId, nextConversationId);
        promoteNewComposer(saved.conversation_id);
        setConversationId(saved.conversation_id);
        setMessages((current) => {
          const merged = mergeChatMessages(current, saved.messages);
          return run.response?.reply && !merged.some(item => item.role === "assistant" && item.content === run.response?.reply)
            ? [...merged, { role: "assistant", workspace_action: "unreconciled_run", content: run.response.reply, trace: run.response.trace, cards: run.response.cards, operation_results: run.response.operation_results }]
            : merged;
        });
        onConversationChange?.(saved.conversation_id);
      } catch {
        if (run.response) setMessages((current) => current.some((item) => item.role === "assistant" && item.content === run.response?.reply)
          ? current
          : [...current, { role: "assistant", workspace_action: "unreconciled_run", content: run.response!.reply, trace: run.response!.trace, cards: run.response!.cards, applied_skills: run.response!.applied_skills, operation_results: run.response!.operation_results }]);
      }
    } else if (run.response) {
      setMessages((current) => current.some((item) => item.role === "assistant" && item.content === run.response?.reply)
        ? current
        : [...current, { role: "assistant", workspace_action: "unreconciled_run", content: run.response!.reply, trace: run.response!.trace, cards: run.response!.cards, applied_skills: run.response!.applied_skills, operation_results: run.response!.operation_results }]);
    }
    if (["failed", "interrupted"].includes(run.state)) rememberChatRun(window.localStorage, matterId, run);
    else window.localStorage.removeItem(chatRunStorageKey(matterId, run.conversation_id));
    window.localStorage.removeItem(chatRunStorageKey(matterId));
    window.localStorage.removeItem(legacyChatRunStorageKey(matterId, run.conversation_id));
    window.localStorage.removeItem(legacyChatRunStorageKey(matterId));
    try {
      if (refreshMatter) {
        await onRefresh();
        notifyMatterChanged(matterId);
        onRunComplete?.(run);
      }
      const token = terminalRunToken(run);
      if (token) reconciliationHint(contextKey, matterId, nextConversationId, token);
    } catch {
      setHistoryError("The request finished, but the matter did not refresh. Reload the page to see current state.");
    } finally {
      setRefreshingRun(false);
      setBusy(false);
    }
  }, [matterId, contextKey, onConversationChange, onRefresh, onReviewAuthorChange]);

  useEffect(() => {
    if (!activeRun || !["queued", "running"].includes(activeRun.state)) return;
    reconciliationHint(contextKey, matterId, activeRun.conversation_id, null);
    let cancelled = false;
    const check = async () => {
      try {
        const next = await getChatRun(matterId, activeRun.run_id);
        if (cancelled) return;
        setActiveRun(next);
        if (!["queued", "running"].includes(next.state)) await finishRun(next);
      } catch {
        if (!cancelled) setHistoryError("Themis.ai could not finish this request.");
        setWaiting(false);
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), 2000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [activeRun?.run_id, activeRun?.state, contextKey, finishRun, matterId]);

  useEffect(() => {
    if (!seed?.text) return;
    const saved = window.localStorage.getItem(inputStorageKey);
    if (saved?.trim()) {
      if (saved !== seed.text) setPreparedRequest(seed.text);
      return;
    }
    if (composerValue.current.trim() && composerValue.current !== seed.text) setPreparedRequest(seed.text);
    else { setInput(seed.text); setPreparedRequest(null); }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [inputStorageKey, seed]);

  function appendPreparedRequest() {
    if (!preparedRequest) return;
    setInput(current => current.trim() ? `${current}\n\n${preparedRequest}` : preparedRequest);
    setPreparedRequest(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  useEffect(() => {
    if (conversationSeed?.revision) void openConversation(conversationSeed.conversationId);
  }, [conversationSeed]);

  useEffect(() => {
    if (loadingHistory || activeRun) return;
    const pendingRunId = pendingChatRunId(window.localStorage, matterId, conversationId);
    if (!pendingRunId && !conversationId && !initialRunId) return;
    setBusy(true);
    setWaiting(true);
    let cancelled = false;
    let timer: number | undefined;
    const readSavedRun = async () => {
      if (pendingRunId) return getChatRun(matterId, pendingRunId);
      const latest = conversationId ? (await getChatRuns(matterId, conversationId))[0] : undefined;
      if (latest) return latest;
      return initialRunId ? getChatRun(matterId, initialRunId) : null;
    };
    const reconnectSavedRun = () => void readSavedRun().then(async (run) => {
      if (cancelled) return;
      setHistoryError("");
      if (!run) { setBusy(false); setWaiting(false); return; }
      rememberChatRun(window.localStorage, matterId, run);
      setActiveRun(run);
      if (!["queued", "running"].includes(run.state)) {
        await finishRun(run, shouldRefreshReconnectedRun(run, messages, conversationId, pendingRunId, reconciliationHint(contextKey, matterId, conversationId)));
      } else reconciliationHint(contextKey, matterId, run.conversation_id, null);
    }).catch(() => {
      if (cancelled) return;
      setHistoryError("Themis.ai could not reconnect to the saved request. The server may still be working, so sending another request is blocked.");
      timer = window.setTimeout(reconnectSavedRun, 2000);
    });
    reconnectSavedRun();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [activeRun?.run_id, contextKey, conversationId, finishRun, initialRunId, loadingHistory, matterId, messages]);

  useEffect(() => {
    if (
      loadingHistory || busy || refreshingRun || !conversationId
      || (initialConversationId && conversationId !== initialConversationId)
      || !needsIntakeQuestionRecovery(intakeActive, messages)
    ) return;
    const recoveryKey = intakeRecoveryKey(conversationId, messages);
    if (!recoveryKey) return;
    if (intakeRecoveryAttempts.current.has(recoveryKey)) {
      setIntakeRecoveryNotice(
        "The next intake question could not be restored automatically. Send a message to continue.",
      );
      return;
    }
    intakeRecoveryAttempts.current.add(recoveryKey);
    setIntakeRecoveryNotice("");
    setBusy(true);
    setWaiting(true);
    setHistoryError("");
    void recoverIntakeQuestion(matterId, conversationId).then(async (run) => {
      setActiveRun(run);
      setWaiting(["queued", "running"].includes(run.state));
      rememberChatRun(window.localStorage, matterId, run);
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    }).catch(() => {
      setHistoryError("Themis.ai could not restore the next intake question.");
      setIntakeRecoveryNotice(
        "The next intake question could not be restored automatically. Send a message to continue.",
      );
      setBusy(false);
      setWaiting(false);
    });
  }, [busy, conversationId, finishRun, initialConversationId, intakeActive, intakeRecoveryRevision, loadingHistory, matterId, messages, refreshingRun]);

  function retryIntakeQuestion() {
    if (!conversationId) return;
    const recoveryKey = intakeRecoveryKey(conversationId, messages);
    if (recoveryKey) intakeRecoveryAttempts.current.delete(recoveryKey);
    setIntakeRecoveryNotice("");
    setIntakeRecoveryRevision((value) => value + 1);
  }

  async function submit(
    text: string,
    cardAction?: CardAction,
    actionAttachments: AttachmentReference[] = attachments,
    consumeInput = false,
    consumeAttachments = actionAttachments === attachments,
  ) {
    const trimmed = text.trim();
    if ((!trimmed && !cardAction && !actionAttachments.length) || busy) return;
    const builderGoal = !cardAction ? skillBuilderGoal(text) : null;
    if (builderGoal) {
      router.push(`/skills?goal=${encodeURIComponent(builderGoal)}`);
      return;
    }
    const visibleText = trimmed || cardActionText(cardAction) || `Attached ${actionAttachments.map((item) => item.name).join(", ")}`;
    const previousInput = input;
    const previousAttachments = attachments;
    setMessages((current) => [...current, { role: "user", content: visibleText, attachments: actionAttachments, card_action: cardAction }]);
    setBusy(true);
    try {
      onBeforeSubmit?.();
      const run = await startChatRun(matterId, {
        message: trimmed,
        target: effectiveTarget,
        expected_question_revision: expectedQuestionRevision,
        context_selections: contextSelections,
        template_id: selectedTemplateId,
        source_action_key: `chat:${crypto.randomUUID()}`,
        matter_id: matterId,
        active_file: activeFile,
        agent_id: chatAgentId(intakeActive, activeAgentId),
        conversation_id: conversationId,
        history: messages.slice(-8).map(({ role, content }) => ({ role, content })),
        card_action: cardAction,
        attachments: actionAttachments,
        review_author: reviewAuthor,
        lawyer_author: lawyerAuthor,
      });
      onRunStarted?.(run);
      setPendingCardAction(cardAction ?? null);
      setActiveRun(run);
      setInput((current) => remainingComposerValue(current, previousInput, consumeInput, ""));
      setAttachments((current) => remainingComposerValue(current, previousAttachments, consumeAttachments, []));
      setWaiting(["queued", "running"].includes(run.state));
      rememberChatRun(window.localStorage, matterId, run);
      if (run.conversation_id) {
        const saved = await getConversation(matterId, run.conversation_id);
        const promotedValue = remainingComposerValue(
          composerValue.current,
          previousInput,
          consumeInput,
          "",
        );
        promoteNewComposer(saved.conversation_id, promotedValue);
        setConversationId(saved.conversation_id);
        setMessages((current) => mergeChatMessages(current, saved.messages));
        onConversationChange?.(saved.conversation_id);
      }
      if (!["queued", "running"].includes(run.state)) await finishRun(run);
    } catch (caught) {
      setBusy(false);
      setWaiting(false);
      setHistoryError("Themis.ai could not finish this request.");
    }
  }

  async function handleCardAction(action: CardAction, answerText?: string) {
    await submit(answerText ?? "", action, [], false, false);
  }

  async function addFiles(files: File[]) {
    if (!files.length || uploading) return;
    setUploading(true);
    setHistoryError("");
    try {
      const result = await uploadDocuments(matterId, files);
      const refs = attachmentsFromUploadResult(result);
      const outcomes = Array.isArray(result.results) ? result.results as Array<{ state?: string; failure_detail?: string }> : [];
      setComposerUploads(current => [...current.filter(item => !files.includes(item.file)), ...files.map((file, index) => ({ id: crypto.randomUUID(), file, state: outcomes[index]?.state ?? "saved", detail: outcomes[index]?.failure_detail }))]);
      try { await onFilesAttached?.(refs); }
      catch { setHistoryError("Files are saved, but their inquiry selection could not be saved. Add them from Files & context."); return; }
      setAttachments(current => [...current, ...refs.filter(ref => !current.some(item => item.path === ref.path))]);
      try { await onRefresh(); } catch { setHistoryError("Upload results are saved. The file list could not refresh."); }
    } catch (caught) {
      setComposerUploads(current => [...current.filter(item => !files.includes(item.file)), ...files.map(file => ({ id: crypto.randomUUID(), file, state: "failed", detail: caught instanceof Error ? caught.message : "Upload did not finish." }))]);
      setHistoryError(caught instanceof Error ? caught.message : "Could not upload the selected files.");
    } finally { setUploading(false); }
  }

  async function openConversation(nextId: string) {
    saveOutgoingComposer();
    if (!nextId)
      storeConversationComposer(window.localStorage, matterId, null, "");
    setActiveRun(null);
    setWaiting(false);
    setBusy(false);
    if (!nextId) {
      setConversationId(null);
      setMessages([]);
      setInput("");
      setAttachments([]);
      setHistoryError("");
      onConversationChange?.(null);
      return;
    }
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const conversation = await getConversation(matterId, nextId);
      setConversationId(conversation.conversation_id);
      setMessages(conversation.messages);
      onConversationChange?.(conversation.conversation_id);
    } catch (caught) {
      setHistoryError(caught instanceof Error ? caught.message : "Could not load saved chat.");
    } finally {
      setLoadingHistory(false);
    }
  }

  const refreshDossierConversation = useCallback(async (originConversationId: string) => {
    if (syncState.current.conversationId !== originConversationId) return;
    const node = threadElement.current;
    const scrollTop = node?.scrollTop ?? 0;
    const wasFollowing = followLatest.current;
    const [, saved] = await Promise.all([syncState.current.onRefresh(), getConversation(matterId, originConversationId)]);
    if (syncState.current.conversationId !== originConversationId) return;
    setMessages(current => mergeChatMessages(current, saved.messages));
    if (!wasFollowing) requestAnimationFrame(() => { if (threadElement.current) threadElement.current.scrollTop = scrollTop; });
  }, [matterId]);

  const prepareDossierFollowUp = useCallback((text: string) => {
    setInput(current => mergeBackgroundDraft(current, text));
    inputRef.current?.focus();
  }, []);

  async function retryRun() {
    if (!activeRun || !["failed", "interrupted"].includes(activeRun.state)) return;
    setBusy(true); setWaiting(true); setHistoryError("");
    try {
      reconciliationHint(contextKey, matterId, activeRun.conversation_id, null);
      const next = await retryChatRun(matterId, activeRun.run_id);
      terminalRuns.current.delete(next.run_id);
      setActiveRun(next);
      setWaiting(["queued", "running"].includes(next.state));
      rememberChatRun(window.localStorage, matterId, next);
      if (!["queued", "running"].includes(next.state)) await finishRun(next);
    } catch {
      setBusy(false); setWaiting(false); setHistoryError("Themis.ai could not finish this request.");
    }
  }

  async function saveAssistantAnswer(content: string, key: string) {
    setSavingAnswerKey(key);
    setSaveAnswerErrors((current) => ({ ...current, [key]: "" }));
    try {
      const saved = await saveWorkProductDraft(matterId, `${matterTitle} response`, content, `chat-save:${matterId}:${key}`);
      setSavedAnswerPaths((current) => ({ ...current, [key]: saved.vault_path }));
      setSavedAnswerNotices((current) => ({
        ...current,
        [key]: saved.changed_paths.length
          ? "Current draft saved."
          : "This current draft already exists. No new save was made.",
      }));
      try {
        await onRefresh();
      } catch {
        setSaveAnswerErrors((current) => ({
          ...current,
          [key]: "Draft saved, but the matter did not refresh. Open the saved draft or reload the page.",
        }));
      }
      onOpenDocument?.(saved.vault_path);
    } catch (caught) {
      setSaveAnswerErrors((current) => ({
        ...current,
        [key]: caught instanceof Error ? caught.message : "Could not save this answer as work product.",
      }));
    } finally {
      setSavingAnswerKey(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input, undefined, attachments, true, true);
    }
  }

  const readingInitialRequest = Boolean(
    initialRunId
      && activeRun?.run_id === initialRunId
      && ["queued", "running"].includes(activeRun.state),
  );
  const latestOperationResults = new Map<string, ChatOperationResult>();
  for (const message of messages) {
    for (const result of message.operation_results ?? []) {
      latestOperationResults.set(result.source_action_key ?? result.action, result);
    }
  }
  const currentEligibleAssistantIndex = intakeActive
    ? -1
    : messages.reduce(
      (latest, message, index) => isEligibleWorkProductResponse(message) ? index : latest,
      -1,
    );
  const latestAssistantIndex = messages.reduce(
    (latest, message, index) => message.role === "assistant" ? index : latest,
    -1,
  );
  const latestUserIndex = messages.reduce((latest, message, index) => message.role === "user" ? index : latest, -1);
  const latestResponseLabel = activeRun && activeRun.state !== "completed"
    ? ["queued", "running"].includes(activeRun.state) ? "Research in progress — no final answer yet" : "Saved partial response — research did not finish"
    : "Latest answer";
  const latestQuestionKey = `question:${messages[latestUserIndex]?.message_id ?? latestUserIndex}`;
  const earlierMessageCount = messages.length - (latestAssistantIndex >= 0 ? 1 : 0) - (latestUserIndex >= 0 ? 1 : 0);
  const activeRunHasSavedWork = Boolean(
    activeRun?.response?.changed_paths.length
    || activeRun?.response?.operation_results.some((result) => result.status === "changed"),
  );
  const activeRunHasSavedIntakeAnswer = Boolean(activeRun?.operation_results?.some((result) => (
    ["record_intake_answer", "update_matter_intake"].includes(result.operation)
    && ["changed", "no_change"].includes(result.status)
  )));

  const renderMessage = (message: Message, index: number) => {
    const messageKey = message.message_id ?? String(index);
    const questionIds = message.cards?.flatMap((card) => card.type === "question" ? [card.question_id] : []) ?? [];
    const questionStates = historicalQuestionStates(
      messages,
      index,
      questionIds,
      intakeActive,
      intakeAnswers,
      Object.fromEntries((message.cards ?? []).filter((card) => card.type === "question").map((card) => [card.question_id, card.text])),
    );
    const currentOperationResults = message.operation_results?.filter(
      (result) => latestOperationResults.get(result.source_action_key ?? result.action) === result,
    );
    const questionCards = message.cards?.filter((card) => card.type === "question") ?? [];
    const compactIntakeTurn = message.role === "assistant" && shouldCompactIntakeTurn(
      questionCards,
      questionStates,
      message.content,
      Boolean(currentOperationResults?.some((result) => ![
        "record_intake_answer", "update_matter_intake",
      ].includes(result.operation))),
    );
    if (message.role === "user") {
      return <UserMessage
        appliedSkill={messages[index + 1]?.role === "assistant" ? messages[index + 1].applied_skills?.[0] : undefined}
        content={message.content}
        cardAction={message.card_action}
        key={messageKey}
      />;
    }
    return <div className="assistant-message" key={messageKey} ref={index === latestAssistantIndex ? latestAnswerElement : undefined}>
      {message.applied_skills?.map((skill) => <div className="applied-skill-label" key={skill.skill_id}>Applied skill: {skill.name}</div>)}
      <div className="agent-label">Themis.ai</div>
      {compactIntakeTurn ? (
        <details className="intake-turn-history">
          <summary>
            <span className="intake-history-label">Earlier intake update</span>
            {questionCards.map((card) => {
              const state = questionStates[card.question_id];
              const label = state.state === "answered" ? "Answered" : state.state === "stopped" ? "Stopped" : state.state === "superseded" ? "Superseded" : "Earlier question";
              const savedValues = state.values.map((value) => card.choices.find((choice) => choice.value === value)?.label ?? value);
              const answer = savedValues.length ? ` — ${savedValues.join(" · ")}` : state.state === "stopped" ? " — Intake stopped" : "";
              return <span key={card.question_id}>{label} · {card.text}{answer}</span>;
            })}
            <span className="text-button">Expand</span>
          </summary>
          <div className="bubble-agent">
            <div className="intake-history-context">This response shows what was known at that point. The latest turn shows the current status.</div>
            <ClaimMarkdown claims={workspaceClaims} documents={workspaceDocuments} onOpenDocument={onOpenReference} onOpenEvidence={onOpenEvidence} recordId={message.message_id} surface="conversation" text={message.content} />
            <ChatCards activeConversationId={conversationId} cards={message.cards} currentWorkProductDraftPath={currentWorkProductDraftPath} disabled matterId={matterId} onAction={handleCardAction} onConversationRefresh={refreshDossierConversation} onOpenDocument={onOpenDocument} onPrepareFollowUp={prepareDossierFollowUp} onRefresh={onRefresh} operationResults={currentOperationResults} questionStates={questionStates} questionsDisabled />
          </div>
        </details>
      ) : <div className="bubble-agent">
        <div className="answer-reading" id={`answer-reading-${messageKey}`} data-collapsed={index === latestAssistantIndex && message.content.length > 700 && !intakeActive && !expandedAnswerKeys.includes(messageKey) ? "true" : undefined}><ClaimMarkdown claims={workspaceClaims} documents={workspaceDocuments} onOpenDocument={onOpenReference} onOpenEvidence={onOpenEvidence} recordId={message.message_id} surface="conversation" text={message.content} /></div>
        {index === latestAssistantIndex && message.content.length > 700 && !intakeActive ? <button className="btn quiet" aria-controls={`answer-reading-${messageKey}`} aria-expanded={expandedAnswerKeys.includes(messageKey)} onClick={() => setExpandedAnswerKeys((keys) => keys.includes(messageKey) ? keys.filter((key) => key !== messageKey) : [...keys, messageKey])} type="button">{expandedAnswerKeys.includes(messageKey) ? "Show shorter answer" : "Read full answer"}</button> : null}
        <ChatCards activeConversationId={conversationId} cards={message.cards} currentWorkProductDraftPath={currentWorkProductDraftPath} disabled={busy} matterId={matterId} onAction={handleCardAction} onConversationRefresh={refreshDossierConversation} onOpenDocument={onOpenDocument} onPrepareFollowUp={prepareDossierFollowUp} onQuestionModeChange={changeQuestionMode} onRefresh={onRefresh} operationResults={currentOperationResults} questionMode={questionMode} questionStates={questionStates} showQuestionMode={intakeActive} />
        {SHOW_AGENT_TRACES && message.trace?.length ? <details className="chat-actions"><summary>Actions taken ({message.trace.length})</summary><div className="trace-list">{message.trace.map((item, traceIndex) => <div className="trace-item" key={traceIndex}><span style={{ flex: "none", color: item.status === "success" ? "var(--healthy)" : "var(--failure)" }}>{item.status === "success" ? "✓" : "!"}</span><span style={{ flex: 1 }}><LinkifiedText text={item.summary} /></span></div>)}</div></details> : null}
        {saveAnswerErrors[messageKey] ? <div className="error chat-card-detail" role="alert">{saveAnswerErrors[messageKey]}</div> : null}
        {savedAnswerPaths[messageKey] ? <div className="mutation-status recorded">{savedAnswerNotices[messageKey]} <button className="text-button" onClick={() => onOpenDocument?.(savedAnswerPaths[messageKey])} type="button">Open draft</button></div>
          : index === currentEligibleAssistantIndex ? <button className="btn primary compact" disabled={busy || savingAnswerKey !== null} onClick={() => void saveAssistantAnswer(message.content, messageKey)} type="button">{savingAnswerKey === messageKey ? "Saving…" : "Save current work product"}</button> : null}
      </div>}
    </div>;
  };

  return (
    <div className={`${styles.panel} chat-panel`}>
      <div className="chat-history-status">
        <span><strong>Inquiry target:</strong> {conversationTargetLabel(effectiveTarget, matterTitle)}</span>
        {target && onClearTarget ? <button className="btn tiny quiet" type="button" onClick={() => { setQuestionTarget(null); onClearTarget?.(); }}>Clear target</button> : null}
        {latestAssistantIndex >= 0 ? <button className="btn tiny quiet" type="button" onClick={() => latestAnswerElement.current?.scrollIntoView({ behavior: "auto", block: "start" })}>Jump to latest answer</button> : null}
      </div>
      <WorkspaceReceiptCards receipts={workspaceReceipts} onOpenDocument={onOpenDocument} />
      {historyError ? <p className="error chat-history-status">{historyError}</p> : null}
      {intakeRecoveryNotice ? <div className="chat-history-status" role="status">{intakeRecoveryNotice} <button className="btn tiny quiet" disabled={busy} onClick={retryIntakeQuestion} type="button">Retry intake question</button></div> : null}
      {loadingHistory ? <p className="chat-history-status">Loading saved chat…</p> : null}
      {activeRun && (shouldShowChatRunStatus(activeRun.state) || activeRun.finished_at) ? (
        <section className={`chat-card ${activeRun.state === "failed" || activeRun.state === "interrupted" ? "wash-failure" : activeRun.state === "completed" ? "wash-healthy" : "wash-agent"}`} role="status">
          <div className="chat-card-kicker">Themis.ai · {chatRunStateLabel(activeRun.state)}</div>
          {activeRun.state === "failed" || activeRun.state === "interrupted" ? (
            <>
              <div className="chat-card-summary">{activeRunHasSavedWork ? "Partial work was saved. Review it, then continue with the next matter action." : "Themis.ai could not finish this request."}</div>
              <div className="chat-card-detail">{chatFailureGuidance(activeRun.failure_class)}</div>
              {safeChatFailureDetail(activeRun.failure_detail) ? <div className="chat-card-detail">{safeChatFailureDetail(activeRun.failure_detail)}</div> : null}
              {activeRun.response?.reply ? <div className="chat-card-detail"><strong>Saved response</strong><ClaimMarkdown claims={workspaceClaims} documents={workspaceDocuments} onOpenDocument={onOpenReference} onOpenEvidence={onOpenEvidence} recordId={activeRun.run_id} surface="conversation" text={activeRun.response.reply} /></div> : null}
            </>
          ) : activeRun.state === "completed" ? <div className="chat-card-summary">{activeRun.status} Review the saved result below.</div>
            : <div className="chat-card-summary">{activeRunHasSavedIntakeAnswer ? "Answer saved · Preparing the next question" : readingInitialRequest ? "Themis.ai is reading your request…" : durableChatProgress(activeRun)}</div>}
          <div className="chat-card-actions">
            {["queued", "running"].includes(activeRun.state) ? <button className="btn tiny quiet" onClick={() => void cancelChatRun(matterId, activeRun.run_id).then(finishRun).catch(cause => setHistoryError(cause instanceof Error ? cause.message : "Could not stop this request."))} type="button">Stop and keep saved work</button> : null}
            {["failed", "interrupted"].includes(activeRun.state) ? <button className="btn tiny quiet" disabled={busy} onClick={() => void retryRun()}>Retry</button> : null}
            {waiting && ["queued", "running"].includes(activeRun.state) ? <button className="btn tiny quiet" onClick={() => setWaiting(false)} type="button">Continue in background</button> : null}
            {!waiting && ["queued", "running"].includes(activeRun.state) ? <button className="btn tiny quiet" onClick={() => setWaiting(true)} type="button">Show progress</button> : null}
          </div>
          {!waiting && ["queued", "running"].includes(activeRun.state) ? <div className="chat-card-detail">Progress is hidden on this page. Server work continues.</div> : null}
          {waiting && elapsedSeconds >= 15 && ["queued", "running"].includes(activeRun.state) ? <div className="chat-card-detail">Last durable step: {activeRunHasSavedIntakeAnswer ? "Answer saved · Preparing the next question." : durableChatProgress(activeRun)} You can leave this page. Server work continues.</div> : null}
        </section>
      ) : null}
      <div className={`conversation-layout${inquiryRail ? "" : " conversation-layout--single"}`}>
        <div className="conversation-main">
      {messages.length ? (
        <div className="thread" ref={threadElement} onScroll={() => { const node = threadElement.current; if (node) followLatest.current = node.scrollHeight - node.scrollTop - node.clientHeight < 100; }}>
          {latestAssistantIndex >= 0 ? <section className="latest-answer"><p className="latest-answer__label">{latestResponseLabel}</p>{renderMessage(messages[latestAssistantIndex], latestAssistantIndex)}</section> : null}
          {latestUserIndex >= 0 ? <section className="latest-question" data-collapsed={!expandedAnswerKeys.includes(latestQuestionKey) ? "true" : undefined}><p className="latest-answer__label">Your question</p>{renderMessage(messages[latestUserIndex], latestUserIndex)}{messages[latestUserIndex].content.length > 400 ? <button className="btn quiet" type="button" aria-expanded={expandedAnswerKeys.includes(latestQuestionKey)} onClick={() => setExpandedAnswerKeys((keys) => keys.includes(latestQuestionKey) ? keys.filter((key) => key !== latestQuestionKey) : [...keys, latestQuestionKey])}>{expandedAnswerKeys.includes(latestQuestionKey) ? "Show shorter question" : "Read full question"}</button> : null}</section> : null}
          {earlierMessageCount > 0 ? <details className="conversation-history"><summary>Earlier conversation ({earlierMessageCount} messages)</summary><div className="conversation-history__messages">{messages.map((message, index) => (index === latestAssistantIndex || index === latestUserIndex) ? null : renderMessage(message, index))}</div></details> : null}
          {busy && waiting ? (
            <div className="agent-label" role="status">
              <span className="agent-mark" style={{ width: 12, height: 12 }} />
              {readingInitialRequest ? "Themis.ai is reading your request…" : pendingCardAction ? chatProgressLabel(pendingCardAction) : durableChatProgress(activeRun ?? { state: "running", status: "Model is working." })} {elapsedSeconds}s
            </div>
          ) : null}
        </div>
      ) : null}
        </div>
        {inquiryRail ? <aside className="conversation-inquiry-rail" aria-label="Run an inquiry">{inquiryRail}</aside> : null}
      </div>

      {!intakeActive ? <ChatMatterQuestions matterId={matterId} contextKey={contextKey} target={effectiveTarget} onTarget={next => { setQuestionTarget(next); onTargetChange?.(next); }} conversationId={conversationId} onAsk={text => { if (input.trim()) setPreparedRequest(text); else setInput(text); inputRef.current?.focus(); }} chatText={input || (latestAssistantIndex >= 0 ? messages[latestAssistantIndex].content : "")} /> : null}
      <div className="composer"
        onDragOver={event => { if (Array.from(event.dataTransfer.types).includes("Files")) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; } }}
        onDrop={event => { if (event.dataTransfer.files.length) { event.preventDefault(); event.stopPropagation(); void addFiles(Array.from(event.dataTransfer.files)); } }}
      >
        {preparedRequest ? <div className="composer-note" role="status"><strong>Prepared request · Not sent.</strong><p>Your current message is unchanged.</p><p>{preparedRequest}</p><button className="btn quiet compact" type="button" onClick={appendPreparedRequest}>Append prepared request</button><button className="btn quiet compact" type="button" onClick={() => setPreparedRequest(null)}>Keep current message</button></div> : null}
        {seed?.text && input === seed.text ? (
          <div className="composer-note" role="status"><strong>Prepared request · Not sent.</strong> Review it, then select Send.</div>
        ) : null}
        {composerUploads.length ? <div className="composer-note" role="status">{composerUploads.map(item => <div key={item.id}>
          <strong>{item.file.name}</strong> · {item.state === "failed" ? "Not saved" : item.state === "partial" ? "Saved · Partial text" : "Saved"}
          {item.detail ? <span> · {item.detail}</span> : null}
          {item.state === "failed" ? <button className="btn tiny quiet" type="button" disabled={uploading} onClick={() => void addFiles([item.file])}>Retry {item.file.name}</button> : null}
        </div>)}</div> : null}
        <UploadIntentCard attachments={attachments} busy={busy} onClear={() => { const removing = attachments; setAttachments([]); void onFilesRemoved?.(removing).catch(() => setHistoryError("Files were removed from this message, but their saved context selection could not be cleared. Check Files & context.")); }} onSend={(intent) => submit(intent, undefined, attachments, false, true)} />
        <div className="composer-suggestions">
          {chatSuggestions(decisionOptions).map((suggestion) => (
            <button aria-label={`Run inquiry: ${suggestion}`} className="suggestion" disabled={busy} key={suggestion} onClick={() => void submit(suggestion)} type="button">
              Run inquiry: {suggestion}
            </button>
          ))}
        </div>
        <SkillCommandMenu input={input} skills={skills} onSelect={(skill) => { setInput(`/${skill.skill_id} `); requestAnimationFrame(() => inputRef.current?.focus()); }} />
        <div className="composer-field">
          <AttachmentPicker disabled={busy || uploading} onSelect={addFiles} />
          <textarea
            ref={inputRef}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Themis.ai about ${matterTitle}…`}
            rows={1}
            value={input}
          />
          <button className="btn primary compact" disabled={busy || !input.trim()} onClick={() => void submit(input, undefined, attachments, true, true)}>
            {uploading ? "Uploading…" : "Send"}
          </button>
        </div>
        <div className="composer-note">
          Themis.ai can research, draft and move this matter. It records a decision only when you explicitly ask it to. <Link className="build-skill-link" href="/skills">Build a skill</Link>
        </div>
      </div>
    </div>
  );
}

function isEligibleWorkProductResponse(message: Message): boolean {
  const content = message.content.trim();
  const contentWithoutHeading = content.replace(/^#{1,6}[^\S\r\n]+/u, "").trim();
  if (message.role !== "assistant" || message.cards?.length) return false;
  if (message.operation_results?.some((result) => (
    result.operation === "finish_intake" || result.operation === "record_intake_answer"
  ))) return false;
  if (/^intake is complete\b/i.test(contentWithoutHeading) || /^(?:chat|research) (?:is |was )?(?:queued|running|complete|interrupted|stopped)\b/i.test(contentWithoutHeading)) return false;
  return content.length > 180 && (/\n\s*\n/.test(content) || /^#{1,3}\s|^\s*[-*]\s/m.test(content));
}

function UserMessage({ content, appliedSkill, cardAction }: { content: string; appliedSkill?: AppliedSkillSummary; cardAction?: CardAction | null }) {
  const answer = cardAction?.action === "answer" || cardAction?.action === "answer_set" ? (
    <div className="mutation-status recorded"><strong>Answered</strong> · {(cardAction.values ?? cardAction.answers?.flatMap((item) => item.values) ?? []).join(" · ")}</div>
  ) : null;
  if (!appliedSkill || !content.trimStart().startsWith(`/${appliedSkill.skill_id}`)) {
    return <div className="bubble-you"><LinkifiedText text={content} />{answer}</div>;
  }
  const request = content.trimStart().slice(appliedSkill.skill_id.length + 1).trim();
  return (
    <div className="bubble-you skill-invocation" data-skill-id={appliedSkill.skill_id} title={`Stored command: ${content}`}>
      <span className="human-skill-label">Used {appliedSkill.name} skill</span>
      {request ? <LinkifiedText text={request} /> : null}
    </div>
  );
}

function cardActionText(action?: CardAction): string {
  if (!action) return "";
  if (action.action === "save_draft") return "Save this Watch as a draft";
  if (action.action === "scan_now") return "Scan this Watch now without starting its schedule";
  if (action.action === "scan_again") return "Scan this Watch again";
  if (action.action === "change_something") return "Change something in this Watch";
  if (action.action === "start_watch") return "Start this Watch and activate its schedule";
  if (action.action === "skip") return "Skip";
  if (action.action === "stop") return "No more questions";
  if (action.action === "undo") return "Undo that matter update";
  if (action.action === "edit") return "Edit that matter update";
  return action.values?.join(", ") ?? action.action;
}

function attachmentsFromUploadResult(result: Record<string, unknown>): AttachmentReference[] {
  if (Array.isArray(result.attachments)) return result.attachments as AttachmentReference[];
  if (Array.isArray(result.files)) {
    return result.files.filter((item): item is AttachmentReference => Boolean(item && typeof item === "object" && "path" in item && "name" in item));
  }
  throw new Error("The upload completed without attachment references.");
}
