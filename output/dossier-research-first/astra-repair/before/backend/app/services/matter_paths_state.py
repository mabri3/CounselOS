"""One Markdown mainline pointer over the existing scenario store.

Only this pointer assigns roles. Historical snapshots never restore actual facts.
All mutations share the scenario/dossier mutation lock.
"""
from __future__ import annotations
from typing import Any
from app.services.dossier import serialized
from app.services.workspace import WorkspaceConflict, digest
from app.utils.time import iso_now


class MatterPathService:
    def __init__(self, scenarios):
        self.scenarios = scenarios
        self.vault, self.matters = scenarios.vault, scenarios.matters

    def _state_path(self, matter_id):
        return f'{self.matters.matter_path(matter_id)}/paths/state.md'

    def state(self, matter_id):
        path = self._state_path(matter_id)
        if not self.vault.exists(path):
            return {'schema_version': 1, 'matter_id': matter_id, 'revision': '', 'mainline_path_id': None, 'last_transition_id': None}
        doc = self.vault.read_markdown(path)
        data = dict(doc['metadata'])
        if data.get('matter_id') != matter_id:
            raise ValueError('Path state belongs to another matter.')
        data['revision'] = digest({'content': doc['content'], 'metadata': {k:v for k,v in data.items() if k != 'revision'}})
        return data

    def _write_state(self, matter_id, path_id, operation_id=None, conditions=None):
        data = {'schema_version':1, 'matter_id':matter_id, 'mainline_path_id':path_id,
                'last_transition_id':operation_id, 'conditions':conditions or [], 'transition_history_refs':['paths/transitions/']}
        target = self.scenarios.get(matter_id, path_id)
        self.vault.write_markdown(self._state_path(matter_id),
            f"# Current direction\n\n{target['title']}\n\nPath: {path_id}\n\nSelection does not establish its assumptions as facts.", data)
        return self.state(matter_id)

    @serialized
    def ensure_baseline(self, matter_id):
        state = self.state(matter_id)
        if state['mainline_path_id']:
            return self.scenarios.get(matter_id, state['mainline_path_id'])
        base = self.matters.matter_path(matter_id)
        baseline_id = 'SCN-' + digest(matter_id + ':baseline')[:24]
        try:
            baseline = self.scenarios.get(matter_id, baseline_id)
        except KeyError:
            recommendation = f'{base}/recommendations.md'
            content = self.vault.read_markdown(recommendation)['content'] if self.vault.exists(recommendation) else ''
            baseline = self.scenarios.save(matter_id, {
                'scenario_id':baseline_id, 'title':'Original plan',
                'path_kind':'baseline', 'analysis':content,
                'recommendation_refs':[recommendation] if content else [],
                'work_item_refs':[item['work_item_id'] for item in self.matters.index.list_work_items(matter_id=matter_id)],
            })
        snapshot = self.scenarios.snapshot(matter_id, baseline_id)
        if not baseline['actual_basis_refs']:
            baseline = self.scenarios.save(matter_id, {**baseline, 'actual_basis_refs':[snapshot]}, expected_revision=baseline['revision'])
        self._write_state(matter_id, baseline_id)
        return baseline

    @serialized
    def explore(self, matter_id, *, parent_path_id, parent_revision, title, source_action_key,
                proposed_fact_changes=None, unresolved_conditions=None, hypothesis_summary=''):
        parent = self.scenarios.get(matter_id, parent_path_id)
        target_id = 'SCN-' + digest(matter_id + ':' + source_action_key)[:24]
        if target_id == parent_path_id:
            raise ValueError('A path cannot be its own parent.')
        if parent['revision'] != parent_revision:
            raise WorkspaceConflict('The parent path changed.', parent['revision'])
        snapshot = self.scenarios.snapshot(matter_id, parent_path_id)
        state = self.state(matter_id)
        selected_conditions = state.get('conditions', []) if state['mainline_path_id'] == parent_path_id else []
        changes = {c['change_id']:c for c in parent['proposed_fact_changes']}
        changes.update({c['change_id']:c for c in (proposed_fact_changes or [])})
        return self.scenarios.save(matter_id, {
            'scenario_id':target_id, 'title':title or 'Alternative approach',
            'parent_path_id':parent_path_id, 'parent_revision':parent_revision,
            'baseline_revisions':parent['baseline_revisions'], 'actual_basis_refs':[snapshot],
            'proposed_fact_changes':list(changes.values()),
            'unresolved_conditions':list(dict.fromkeys([*parent['unresolved_conditions'], *selected_conditions, *(unresolved_conditions or [])])),
            'hypothesis_summary':hypothesis_summary, 'source_links':parent['source_links'],
        }, source_action_key=source_action_key)

    def inspect(self, matter_id, *, offset=0, limit=20, include_archived=False):
        if not 0 <= offset or not 1 <= limit <= 50:
            raise ValueError('Invalid path page.')
        state = self.state(matter_id)
        paths = [p for p in self.scenarios.list(matter_id) if include_archived or not p['archived_at']]
        items = [{k:p[k] for k in ('scenario_id','title','revision','parent_path_id','path_kind','archived_at','unresolved_conditions')} |
                 {'role':'mainline' if p['scenario_id'] == state['mainline_path_id'] else 'alternative'} for p in paths[offset:offset+limit]]
        for item in items:
            if item['role'] == 'mainline':
                item['unresolved_conditions'] = list(dict.fromkeys([*item['unresolved_conditions'], *state.get('conditions', [])]))
        projection = None
        if state.get('last_transition_id'):
            receipt = self.vault.read_markdown(self._receipt_path(matter_id,state['last_transition_id']))['metadata']
            projection = receipt.get('projection_state')
        return {'state':state, 'projection_state':projection, 'paths':items, 'next_offset':offset+limit if offset+limit<len(paths) else None}

    def _receipt_path(self, matter_id, operation_id):
        if not operation_id.startswith('PATHOP-') or not operation_id[7:].isalnum():
            raise ValueError('Invalid transition ID.')
        return f'{self.matters.matter_path(matter_id)}/paths/transitions/{operation_id}.md'

    def _save_receipt(self, matter_id, receipt):
        self.vault.write_markdown(self._receipt_path(matter_id, receipt['operation_id']),
            f"# Direction transition\n\n{receipt['from_path_id']} → {receipt['to_path_id']}\n\n{receipt.get('reason') or 'No reason supplied'}", receipt)

    @serialized
    def transition(self, matter_id, *, path_id, expected_mainline_revision, expected_path_revision,
                   source_action_key, run_id, message_id, instruction_quote, actor='user',
                   conditions=None, reason='', conversation_id=None, restore=False):
        if not all(str(v).strip() for v in (source_action_key, run_id, message_id, instruction_quote, actor)):
            raise ValueError('A current instruction and bound action identity are required.')
        operation_id = 'PATHOP-' + digest(matter_id + ':' + source_action_key)[:24]
        fingerprint = digest({'path_id':path_id,'mainline':expected_mainline_revision,'path':expected_path_revision,
            'run':run_id,'message':message_id,'quote':instruction_quote,'actor':actor,'conditions':conditions or [],
            'reason':reason,'conversation':conversation_id,'restore':restore})
        receipt_path = self._receipt_path(matter_id, operation_id)
        state = self.state(matter_id)
        if self.vault.exists(receipt_path):
            prior = self.vault.read_markdown(receipt_path)['metadata']
            if prior['fingerprint'] != fingerprint:
                raise WorkspaceConflict('Action key already used for different content.', state['revision'])
            return self.recover(matter_id, operation_id)
        target = self.scenarios.get(matter_id, path_id)
        if state['revision'] != expected_mainline_revision or target['revision'] != expected_path_revision:
            return {'state':'conflict','mainline_path_id':state['mainline_path_id'],'mainline_revision':state['revision'],
                    'path_id':path_id,'path_revision':target['revision'],'actual_facts_changed':False}
        if not state['mainline_path_id']:
            raise ValueError('Establish the baseline before selecting a direction.')
        if target['archived_at']:
            raise ValueError('An archived path must be reopened before selection.')
        receipt = {'schema_version':1,'matter_id':matter_id,'operation_id':operation_id,'fingerprint':fingerprint,
            'state':'prepared','from_path_id':state['mainline_path_id'],'to_path_id':path_id,
            'before_mainline_revision':state['revision'],'target_revision':target['revision'],
            'run_id':run_id,'message_id':message_id,'instruction_quote':instruction_quote,'actor':actor,
            'reason':reason,'conditions':list(dict.fromkeys([*target['unresolved_conditions'],*(conditions or [])])),
            'conversation_id':conversation_id,'restore':restore,'created_at':iso_now(),
            'actual_facts_changed':False,'decision_recorded':False,'projection_state':'pending',
            'dossier_expected_hash':self.matters._dossiers.content_hash(matter_id) if self.matters._dossiers else None,
            'changed_paths':[],'warnings':[]}
        if state['mainline_path_id'] == path_id:
            receipt.update(state='no_change',projection_state='not_required',mainline_revision=state['revision'])
            self._save_receipt(matter_id,receipt)
            return receipt
        self._save_receipt(matter_id,receipt)
        return self.recover(matter_id, operation_id)

    @serialized
    def recover(self, matter_id, operation_id):
        """Finish local stages only. The pointer's transition ID is the commit proof."""
        receipt = self.vault.read_markdown(self._receipt_path(matter_id,operation_id))['metadata']
        if receipt['state'] in {'no_change','conflict'}:
            return receipt
        state = self.state(matter_id)
        if receipt['state'] == 'prepared':
            if state['last_transition_id'] == operation_id:
                receipt.update(state='committed',mainline_revision=state['revision'])
            else:
                target = self.scenarios.get(matter_id,receipt['to_path_id'])
                if state['revision'] != receipt['before_mainline_revision'] or target['revision'] != receipt['target_revision']:
                    receipt.update(state='conflict',projection_state='not_required',mainline_revision=state['revision'])
                    self._save_receipt(matter_id,receipt)
                    return receipt
                receipt['preserved_path_snapshot'] = self.scenarios.snapshot(matter_id,receipt['from_path_id'])
                receipt['target_snapshot'] = self.scenarios.snapshot(matter_id,receipt['to_path_id'])
                self._save_receipt(matter_id,receipt)
                state = self._write_state(matter_id,receipt['to_path_id'],operation_id,receipt['conditions'])
                receipt.update(state='committed',mainline_revision=state['revision'],changed_paths=[self._state_path(matter_id)])
            self._save_receipt(matter_id,receipt)
        if receipt['projection_state'] == 'pending':
            try:
                if state['last_transition_id'] != operation_id:
                    receipt['projection_state'] = 'historical'
                else:
                    receipt['projection'] = self._project(matter_id,receipt)
                    receipt['projection_state'] = receipt['projection']['state']
                self._save_receipt(matter_id,receipt)
            except (OSError,ValueError,KeyError) as exc:
                receipt['warnings'] = [f'Direction saved; local projection remains pending: {type(exc).__name__}']
        return receipt

    def _project(self, matter_id, receipt):
        dossiers = self.matters._dossiers
        if not dossiers:
            return {'state':'pending'}
        doc = dossiers.get(matter_id)
        target = self.scenarios.get(matter_id,receipt['to_path_id'])
        body = (doc or {}).get('content','')
        heading = '## Current solution direction'
        import re
        body = re.sub(r'\n*## Current solution direction\n.*?(?=\n## |\Z)', '', body, flags=re.S)
        addition = f"\n\n{heading}\n\nCurrent direction: {target['title']} ({target['scenario_id']}).\n\nPrevious approach: {receipt['from_path_id']}.\n"
        if receipt['conditions']:
            addition += '\nUnresolved conditions:\n' + '\n'.join('- '+c for c in receipt['conditions'])
        return dossiers.propose_update(matter_id,body+addition,expected_hash=receipt['dossier_expected_hash'],
                                      publication_key='path:'+receipt['operation_id'])

    @serialized
    def archive(self, matter_id, path_id, expected_revision):
        if self.state(matter_id)['mainline_path_id'] == path_id:
            raise ValueError('The current direction cannot be archived.')
        path = self.scenarios.get(matter_id,path_id)
        return self.scenarios.save(matter_id,{**path,'archived_at':iso_now()},expected_revision=expected_revision)

    def transitions(self, matter_id, *, offset=0, limit=20):
        if offset < 0 or not 1 <= limit <= 50:
            raise ValueError('Invalid transition page.')
        root = self.vault.resolve(f'{self.matters.matter_path(matter_id)}/paths/transitions')
        files = sorted(root.glob('PATHOP-*.md')) if root.exists() else []
        return {'items':[self.vault.read_markdown(self.vault.relative(p))['metadata'] for p in files[offset:offset+limit]],
                'next_offset':offset+limit if offset+limit<len(files) else None}
