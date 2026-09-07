import type { DecisionMapSnapshot } from './decisionMapTypes';

/** Group only on saved relationships, never on title similarity. */
export function issueOverview(snapshot: DecisionMapSnapshot) {
  const issues = snapshot.nodes.filter(n => n.record_type === 'issue' && n.group !== 'historical');
  const ids = new Set(issues.map(n => n.node_id));
  const connections: Array<{ from: string; to: string; label: string; reason: string }> = [];
  for (const edge of snapshot.edges) {
    if (edge.state === 'historical' || edge.state === 'inactive' || edge.state === 'missing') continue;
    if (ids.has(edge.from_node_id) && ids.has(edge.to_node_id)) connections.push({ from: edge.from_node_id, to: edge.to_node_id, label: edge.label || 'Depends on', reason: 'Saved issue relationship' });
  }
  for (const node of snapshot.nodes) {
    if (!['fact', 'condition', 'question', 'work'].includes(node.record_type) || node.group === 'historical' || node.hypothetical) continue;
    const linked = new Set((node.issue_ids ?? []).map(id => `issue:${id}`).filter(id => ids.has(id)));
    for (const edge of snapshot.edges) {
      if (['historical', 'inactive', 'missing'].includes(edge.state ?? '')) continue;
      if (edge.from_node_id === node.node_id && ids.has(edge.to_node_id)) linked.add(edge.to_node_id);
      if (edge.to_node_id === node.node_id && ids.has(edge.from_node_id)) linked.add(edge.from_node_id);
    }
    const members = [...linked];
    members.forEach((from, i) => members.slice(i + 1).forEach(to => {
      connections.push({ from, to, label: `Shared ${node.record_type === 'question' ? 'open question' : node.record_type === 'work' ? 'work item' : node.record_type}`, reason: node.label });
    }));
  }
  // Analysis conditions can refer to the same saved fact without a direct issue edge.
  const factIssues = new Map<string, Set<string>>();
  for (const issue of issues) {
    for (const condition of snapshot.issue_analyses?.[issue.record_id]?.analysis?.conditions ?? []) {
      for (const id of condition.fact_ids) {
        if (!factIssues.has(id)) factIssues.set(id, new Set());
        factIssues.get(id)!.add(issue.node_id);
      }
    }
  }
  for (const [id, linked] of factIssues) {
    const fact = snapshot.nodes.find(n => n.record_type === 'fact' && n.record_id === id);
    if (!fact) continue;
    const members = [...linked];
    members.forEach((from, i) => members.slice(i + 1).forEach(to => {
      if (!connections.some(c => c.from === from && c.to === to && c.reason === fact.label))
        connections.push({ from, to, label: 'Shared fact', reason: fact.label });
    }));
  }
  const labels = { depends_on: 'Depends on', compounds: 'Makes the risk worse', may_resolve: 'May resolve — conditions apply', shared_condition: 'Shared condition' };
  for (const issue of issues) {
    for (const link of snapshot.issue_analyses?.[issue.record_id]?.analysis?.connections ?? []) {
      const to = `issue:${link.target_issue_id}`;
      if (ids.has(to) && to !== issue.node_id) connections.push({from: issue.node_id, to, label: labels[link.relationship], reason: link.reason});
    }
  }
  const remaining = new Set(ids);
  const groups: typeof issues[] = [];
  while (remaining.size) {
    const pending = [remaining.values().next().value as string];
    const members = new Set<string>();
    while (pending.length) {
      const id = pending.pop()!;
      if (!remaining.delete(id)) continue;
      members.add(id);
      connections.forEach(c => { if (c.from === id) pending.push(c.to); if (c.to === id) pending.push(c.from); });
    }
    groups.push(issues.filter(n => members.has(n.node_id)));
  }
  return { issues, connections, groups };
}
