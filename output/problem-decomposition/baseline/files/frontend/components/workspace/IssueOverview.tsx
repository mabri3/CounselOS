"use client";
import type { DecisionMapProps, DecisionMapSnapshot } from '@/lib/decisionMapTypes';
import { issueOverview } from '@/lib/issueOverview';
import { outcomeProgress } from './PathOutcome';
import type { IssueOption } from '@/lib/decisionMapTypes';
import styles from './MatterMap.module.css';

export default function IssueOverview({ snapshot, focus, onOpen, onAnalyze, busy, analyzingIssueId, analysisResult }: { snapshot: DecisionMapSnapshot; focus?: string | null; onOpen: (id: string) => void; onAnalyze?: (id: string) => void; busy?: boolean; analyzingIssueId?: string | null; analysisResult?: DecisionMapProps["analysisResult"] }) {
  const { issues, connections, groups } = issueOverview(snapshot);
  const assessment = (id: string) => {
    const status = snapshot.issue_analyses?.[id];
    const assessed = Array.isArray(status?.analysis?.connections) && status?.state !== 'needs_review';
    const running = busy && analyzingIssueId === id;
    const result = analysisResult?.issueId === id ? analysisResult : null;
    return <div className={styles.issueAssessment}>
      <p>{assessed ? `${status!.analysis!.connections!.length} connections assessed` : 'Connections need assessment'}</p>
      {running ? <p className="state-label state-agent" role="status">Analyzing this issue…</p> : result ? <div className={result.saved ? styles.issueUpdateDone : 'warning-callout'} role="status"><strong>{result.message}</strong>{result.saved ? <button className="btn quiet" type="button" onClick={() => onOpen(`issue:${id}`)}>View updated map →</button> : null}</div> : null}
      {onAnalyze ? <button className="btn quiet" disabled={busy} type="button" onClick={() => onAnalyze(id)}>{running ? 'Analyzing this issue…' : 'Update this issue'}</button> : null}
      <small>Review its paths and connections to other issues.</small>
    </div>;
  };
  const focused = issues.find(n => n.record_id === focus);
  const rawLinks = focused ? connections.filter(c => c.from === focused.node_id || c.to === focused.node_id) : connections;
  const groupedLinks = new Map<string, typeof connections>();
  for (const link of rawLinks) {
    const key = [link.from, link.to].sort().join(':');
    groupedLinks.set(key, [...(groupedLinks.get(key) ?? []), link]);
  }
  const links = [...groupedLinks.values()].map(items => ({...items[0], reason: [...new Set(items.map(item => `${item.label}: ${item.reason}`))].join(' '), label: items.length > 1 ? 'Related issue' : items[0].label}));
  const resolution = (nodeId: string) => {
    const issue = issues.find(n => n.node_id === nodeId);
    const analysis = issue && snapshot.issue_analyses?.[issue.record_id]?.analysis;
    const option = snapshot.nodes.find(n => n.record_type === 'option' && n.analysis_revision === analysis?.analysis_revision && n.issue_ids?.includes(issue!.record_id) && snapshot.edges.some(e => e.from_node_id === n.node_id && e.relationship === 'decided_by' && e.state === 'active'));
    if (!option || !analysis) return {label: 'Decision needed', target: nodeId, action: 'Review linked issue'};
    const related = snapshot.nodes.filter(n => n.issue_ids?.includes(analysis.issue_id) && (n.record_type !== 'condition' || n.analysis_revision === analysis.analysis_revision));
    const progress = outcomeProgress(option.data as unknown as IssueOption, related, true);
    return {label: progress.label === 'Complete for this issue' ? 'Linked path work complete — review its effect here' : progress.label, target: option.node_id, action: 'Review agreed path and remaining work'};
  };
  const connection = (c: typeof connections[number], index: number) => <div className={styles.issueConnection} key={`${c.from}:${c.to}:${index}`}>
    <span className={styles.meta}>{c.label}</span>
    {<button type="button" onClick={() => onOpen(c.from)}>{issues.find(n => n.node_id === c.from)?.label}</button>}
    <span aria-hidden="true">{c.label.startsWith('Shared') ? '↔' : '→'}</span>
    <button type="button" onClick={() => onOpen(c.to)}>{issues.find(n => n.node_id === (c.to))?.label}</button>
    <p><strong>Effect on the connected issue: </strong>{c.reason}</p>
    {(() => { const next = resolution(focused?.node_id === c.to ? c.from : c.to); return <div className={styles.connectionNext}><strong>{next.label}</strong><button className="btn quiet" type="button" onClick={() => onOpen(next.target)}>{next.action} →</button><p>Open its path to review conditions, record agreement, or complete linked work. Then review the effect on this issue; it remains a separate decision.</p></div>; })()}
  </div>;
  if (focused) return <section className={`${styles.card} ${styles.issueOverview}`} aria-label="Connected issues"><h3>Connected issues</h3><p>Opening an issue changes the map focus. Each issue keeps its own decision.</p>{links.length ? links.map(connection) : null}{assessment(focused.record_id)}</section>;
  return <section className={`${styles.card} ${styles.issueOverview}`} aria-label="Issue overview"><h2>Matter map</h2><p>Open an issue to explore its paths. Groups show saved connections.</p>{groups.map((group, index) => <section className={styles.issueGroup} key={group[0].node_id}><h3>{group.length > 1 ? `Connected issues · Group ${index + 1}` : 'Issue'}</h3><div className={styles.issueCards}>{group.map(issue => {
    const analysis = snapshot.issue_analyses?.[issue.record_id];
    const count = analysis?.analysis?.options.length ?? 0;
    return <article className={styles.issueCard} key={issue.node_id}><span className={styles.meta}>Issue · {issue.state.replace(/_/g, ' ')}</span><strong>{analysis?.analysis?.display_title || issue.label}</strong><span>{count ? `${count} paths to explore` : 'Paths not mapped yet'}</span><button className="btn quiet" type="button" onClick={() => onOpen(issue.node_id)}>Open issue →</button>{assessment(issue.record_id)}</article>;
  })}</div>{links.filter(c => group.some(n => n.node_id === c.from)).map(connection)}</section>)}{!issues.length ? <p>No issues saved yet.</p> : null}</section>;
}
