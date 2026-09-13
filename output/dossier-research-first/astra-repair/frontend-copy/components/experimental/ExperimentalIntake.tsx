"use client";
import { useEffect, useState } from "react";
import type { CardAction, ChatCard } from "@/lib/types";
import styles from "./ExperimentalChat.module.css";

type Question = Extract<ChatCard, { type: "question" }>;
type Answer = { values: string[]; free_text: string };
const groups = [
    ["could_change_answer", "Could change the answer"],
    ["could_refine_advice", "Could refine the advice"],
    ["helpful_detail", "Helpful detail"],
    ["unranked", "Questions"],
] as const;
const empty = (): Answer => ({ values: [], free_text: "" });
export const explorationRequest = "Analyze this matter with these answers. Leave gaps unknown and show the initial issue map and assumptions used.";

export default function ExperimentalIntake({ cards, disabled, storageKey, explore = true, onSubmit }: {
    cards: Question[]; disabled: boolean; storageKey: string; explore?: boolean;
    onSubmit: (text: string, action: CardAction) => Promise<void>;
}) {
    const [answers, setAnswers] = useState<Record<string, Answer>>({});
    const [ready, setReady] = useState(false);
    useEffect(() => {
        try { setAnswers(JSON.parse(localStorage.getItem(storageKey) || "{}")); }
        catch { setAnswers({}); }
        setReady(true);
    }, [storageKey]);
    useEffect(() => {
        if (ready) try { localStorage.setItem(storageKey, JSON.stringify(answers)); } catch { /* Keep the local form usable. */ }
    }, [answers, ready, storageKey]);
    if (!cards.length) return null;
    function change(id: string, next: Answer) { setAnswers(current => ({ ...current, [id]: next })); }
    const answered = cards.filter(card => answers[card.question_id]?.values.length || answers[card.question_id]?.free_text.trim()).length;
    async function submit() {
        const action: CardAction = { card_id: cards[0].question_id, action: "answer_set", answers: cards.map(card => {
            const answer = answers[card.question_id] || empty();
            const free_text = answer.free_text.trim();
            return { card_id: card.question_id, action: answer.values.length || free_text ? "answer" : "skip", values: free_text ? [] : answer.values, ...(free_text ? { free_text } : {}) };
        }) };
        const summary = cards.filter(card => answers[card.question_id]?.values.length || answers[card.question_id]?.free_text.trim()).map(card => {
            const answer = answers[card.question_id] || empty();
            const label = answer.free_text.trim() || answer.values.map(value => card.choices.find(choice => choice.value === value)?.label || value).join(", ") || "Left unknown";
            return `${card.text}\n${label}`;
        }).join("\n\n");
        await onSubmit(`${summary}${summary ? "\n\n" : ""}${cards.length - answered} questions left open.\n\n${explore ? explorationRequest : "Use these answers to continue our discussion."}`, action);
    }
    return <form className={styles.intakeQuestions} aria-label="Intake questions" onSubmit={event => { event.preventDefault(); void submit(); }}>
        <div className={styles.intakeIntroduction}><strong>A few facts can guide the analysis</strong><p>Answer what you know. Leave the rest open, or continue in chat at any time.</p></div>
        {groups.map(([priority, label]) => {
            const questions = cards.filter(card => (card.priority || "unranked") === priority);
            return questions.length > 0 && <section key={priority} className={styles.intakePriority} aria-label={label}><h3>{label}</h3>{questions.map(card => {
                const answer = answers[card.question_id] || empty();
                return <fieldset key={card.question_id} disabled={disabled || !ready} className={styles.intakeQuestion}>
                    <legend>{card.text}</legend>
                    {card.topic && <span className={styles.intakeTopic}>{card.topic}</span>}
                    {card.reason && <p className={styles.intakeReason}>{card.reason}</p>}
                    <div className={styles.intakeOptions}>{card.choices.map(choice => <button type="button" key={choice.value} className={styles.choiceButton} aria-label={choice.label} aria-pressed={answer.values.includes(choice.value)} onClick={() => change(card.question_id, {
                        values: card.selection_mode === "multiple" ? (answer.values.includes(choice.value) ? answer.values.filter(value => value !== choice.value) : [...answer.values, choice.value]) : (answer.values.includes(choice.value) ? [] : [choice.value]), free_text: "",
                    })}>{answer.values.includes(choice.value) && <span aria-hidden="true">✓ </span>}{choice.label}</button>)}</div>
                    <label className={styles.intakeWriteIn}>{card.choices.length ? <input aria-label={`Other answer: ${card.text}`} value={answer.free_text} placeholder="Or type a different answer" onChange={event => change(card.question_id, { values: [], free_text: event.target.value })}/> : <>Your answer<textarea rows={2} value={answer.free_text} placeholder="Leave blank if unknown" onChange={event => change(card.question_id, { values: [], free_text: event.target.value })}/></>}</label>
                    {(answer.values.length > 0 || answer.free_text.length > 0) && <button type="button" className={styles.intakeClear} onClick={() => change(card.question_id, empty())}>Clear answer · leave unknown</button>}
                </fieldset>;
            })}</section>;
        })}
        <div className={styles.intakeSubmit}><span>{answered} answered · {cards.length - answered} left open</span><button type="submit" className={styles.primary} disabled={disabled || !ready}>{explore ? (answered ? "Explore with these answers" : "Continue to analysis without answering") : "Send answers"}<span aria-hidden="true"> →</span></button></div>
    </form>;
}
