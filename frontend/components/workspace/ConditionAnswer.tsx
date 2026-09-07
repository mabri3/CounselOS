"use client";
import { useState } from 'react';
import { workspaceCommand } from '@/lib/workspaceApi';
import { createMatterWorkItem } from '@/lib/api';
import styles from './MatterMap.module.css';

export default function ConditionAnswer({matterId, issueId, conditionId, revision, question, savedAnswer, onRefresh, onAnalyze}: {
  matterId: string; issueId: string; conditionId: string; revision: string; question: string; savedAnswer: string;
  onRefresh?: () => Promise<void>; onAnalyze?: () => void;
}) {
  const [answer, setAnswer] = useState(savedAnswer);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [key, setKey] = useState(() => crypto.randomUUID());
  const save = async () => {
    setBusy(true); setNotice('');
    try {
      await workspaceCommand(matterId, `/issues/${issueId}/conditions/${conditionId}/answer`, 'POST', {analysis_revision:revision, answer, source_action_key:key});
      setNotice('Answer saved as a reported fact. Updating the analysis will assess its effect on these choices.');
      await onRefresh?.();
    } catch(e) {setNotice(e instanceof Error ? e.message : 'Could not confirm the save.');}
    finally {setBusy(false);}
  };
  const track = async () => {
    setBusy(true);
    try { await createMatterWorkItem(matterId, {title:question, description:'Obtain the facts needed for this decision path.', item_type:'mitigation', status:'open', priority:'normal', owner:'Lawyer', required:true, issue_id:issueId, source_action_key:`condition-question:${conditionId}`}); setNotice('Work item created to obtain this answer.'); await onRefresh?.(); }
    catch(e) {setNotice(e instanceof Error ? e.message : 'Could not create work item.');}
    finally {setBusy(false);}
  };
  return <div className={styles.conditionAnswer}><label>Your answer<textarea rows={3} value={answer} disabled={busy} placeholder="Describe what actually happens, or what you know so far." onChange={e => {setAnswer(e.target.value); setKey(crypto.randomUUID());}} /></label><div><button className="btn primary" disabled={busy || !answer.trim()} onClick={() => void save()}>{busy ? 'Saving…' : 'Save answer'}</button><button className="btn quiet" disabled={busy} onClick={() => void track()}>I need to find out</button></div>{notice ? <p role="status">{notice}</p> : null}{(savedAnswer || notice.startsWith('Answer saved')) && onAnalyze ? <button className="btn quiet" disabled={busy} onClick={onAnalyze}>Update analysis with saved facts</button> : null}</div>;
}
