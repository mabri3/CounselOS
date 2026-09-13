from concurrent.futures import ThreadPoolExecutor
import pytest
from app.services.workspace import WorkspaceConflict

M = 'MAT-DEMO-RELAY'


def test_read_is_passive_and_baseline_is_concurrent_idempotent(app_context):
    service = app_context.solution_paths
    assert service.inspect(M)['state']['mainline_path_id'] is None
    assert not app_context.vault.exists(service._state_path(M))
    before = app_context.matter_records.get(M)
    with ThreadPoolExecutor(2) as pool:
        paths = list(pool.map(lambda _:service.ensure_baseline(M), range(2)))
    assert paths[0]['scenario_id'] == paths[1]['scenario_id']
    assert len(service.inspect(M)['paths']) == 1
    assert app_context.matter_records.get(M) == before
    assert paths[0]['title']


def test_parent_inheritance_history_and_same_titles(app_context):
    s = app_context.solution_paths
    a = s.ensure_baseline(M)
    b = s.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='b',
        proposed_fact_changes=[{'change_id':'custody','text':'Bank holds the funds.'}],unresolved_conditions=['Bank has not agreed.'])
    c = s.explore(M,parent_path_id=b['scenario_id'],parent_revision=b['revision'],title='Bank',source_action_key='c')
    assert c['proposed_fact_changes'] == b['proposed_fact_changes']
    assert c['unresolved_conditions'] == ['Bank has not agreed.']
    assert c['scenario_id'] != b['scenario_id']
    doc = app_context.vault.read_markdown(c['actual_basis_refs'][0])
    assert doc['metadata']['snapshot_revision'] == b['revision']
    assert any(p.endswith('/facts.md') for p in doc['metadata']['preserved_records'])
    updated = s.scenarios.save(M,{**b,'title':'Revised bank'},expected_revision=b['revision'])
    assert app_context.vault.exists(f"{app_context.matters.matter_path(M)}/scenarios/history/{b['scenario_id']}/{b['revision']}.md")
    assert len(s.inspect(M)['paths']) == 3
    with pytest.raises(WorkspaceConflict):
        s.explore(M,parent_path_id=b['scenario_id'],parent_revision=b['revision'],title='Stale',source_action_key='stale')
    assert updated['revision'] != b['revision']


def test_legacy_scenario_load_and_ownership(app_context):
    s=app_context.workspace_scenarios
    legacy=s.save(M,{'title':'Legacy'},source_action_key='legacy')
    assert legacy['path_kind']=='alternative'
    assert legacy['parent_path_id'] is None
    with pytest.raises((KeyError,ValueError)):
        s.get('MAT-DEMO-APEX',legacy['scenario_id'])


def transition_setup(app):
    s=app.solution_paths
    a=s.ensure_baseline(M)
    b=s.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='Bank',source_action_key='bank',unresolved_conditions=['Bank agreement pending'])
    args=dict(path_id=b['scenario_id'],expected_mainline_revision=s.state(M)['revision'],expected_path_revision=b['revision'],source_action_key='choose-bank',run_id='RUN-1',message_id='MSG-1',instruction_quote='Use bank route')
    return s,a,b,args


def test_transition_restore_preserves_actual_records_and_receipts(app_context):
    s,a,b,args=transition_setup(app_context)
    facts=app_context.vault.read_text(app_context.matter_records._path(M))
    tasks=app_context.index.list_work_items(M)
    result=s.transition(M,**args)
    assert result['state']=='committed'
    assert result['conditions']==['Bank agreement pending']
    assert s.transition(M,**args)['operation_id']==result['operation_id']
    assert len(s.transitions(M)['items'])==1
    assert app_context.vault.read_text(app_context.matter_records._path(M))==facts
    assert app_context.index.list_work_items(M)==tasks
    app_context.matter_records.apply_update(M,facts=[{'text':'Actual correction after selection.'}])
    corrected=app_context.vault.read_text(app_context.matter_records._path(M))
    restored=s.transition(M,**{**args,'path_id':a['scenario_id'],'expected_mainline_revision':s.state(M)['revision'],
        'expected_path_revision':s.scenarios.get(M,a['scenario_id'])['revision'],'source_action_key':'restore-a','restore':True})
    assert restored['state']=='committed'
    assert app_context.vault.read_text(app_context.matter_records._path(M))==corrected
    assert len(s.transitions(M)['items'])==2


@pytest.mark.parametrize('boundary',['prepared','snapshot','pointer','committed','projection'])
def test_interrupted_transition_recovers_without_provider(app_context,monkeypatch,boundary):
    s,a,b,args=transition_setup(app_context)
    original_write=s.vault.write_markdown
    fired=False
    def interrupt(path,content,metadata=None):
        nonlocal fired
        metadata=metadata or {}
        hit=(boundary=='prepared' and metadata.get('state')=='prepared') or (boundary=='snapshot' and metadata.get('immutable')) or (boundary=='pointer' and str(path).endswith('/paths/state.md')) or (boundary=='committed' and metadata.get('state')=='committed') or (boundary=='projection' and '/dossier-revisions/' in str(path))
        # Baseline and child snapshots already exist; use target snapshot failure separately below.
        result=original_write(path,content,metadata)
        if hit and not fired:
            fired=True
            raise OSError('simulated interruption')
        return result
    monkeypatch.setattr(s.vault,'write_markdown',interrupt)
    if boundary=='snapshot':
        original=s.scenarios.snapshot
        def snapshot(*a,**k):
            nonlocal fired
            if not fired:
                fired=True
                raise OSError('snapshot unavailable')
            return original(*a,**k)
        monkeypatch.setattr(s.scenarios,'snapshot',snapshot)
    try:
        s.transition(M,**args)
    except OSError:
        pass
    assert fired
    monkeypatch.setattr(s.vault,'write_markdown',original_write)
    result=s.transition(M,**args)
    assert result['state']=='committed'
    assert s.state(M)['mainline_path_id']==b['scenario_id']
    assert len(s.transitions(M)['items'])==1


def test_concurrent_promotions_conflict_and_key_reuse_rejected(app_context):
    s,a,b,args=transition_setup(app_context)
    c=s.explore(M,parent_path_id=a['scenario_id'],parent_revision=a['revision'],title='C',source_action_key='c')
    second={**args,'path_id':c['scenario_id'],'expected_path_revision':c['revision'],'source_action_key':'choose-c'}
    with ThreadPoolExecutor(2) as pool:
        results=list(pool.map(lambda kw:s.transition(M,**kw),[args,second]))
    assert sorted(r['state'] for r in results)==['committed','conflict']
    winner=args if results[0]['state']=='committed' else second
    with pytest.raises(WorkspaceConflict):
        s.transition(M,**{**winner,'reason':'different'})


def test_selection_conditions_survive_pointer_reload(app_context):
    s,a,b,args=transition_setup(app_context)
    s.transition(M,**{**args,'conditions':['Regulator response remains pending.']})
    from app.services.matter_paths_state import MatterPathService
    restored=MatterPathService(app_context.workspace_scenarios)
    assert 'Regulator response remains pending.' in restored.state(M)['conditions']
    assert 'Regulator response remains pending.' in next(p for p in restored.inspect(M)['paths'] if p['role']=='mainline')['unresolved_conditions']


def test_selected_conditions_inherit_and_projection_status_survives_reload(app_context):
    s,a,b,args=transition_setup(app_context)
    result=s.transition(M,**{**args,'conditions':['Regulator response pending.']})
    child=s.explore(M,parent_path_id=b['scenario_id'],parent_revision=b['revision'],title='Later release',source_action_key='inherit-selected')
    assert 'Regulator response pending.' in child['unresolved_conditions']
    assert s.inspect(M)['projection_state']==result['projection_state']


def test_snapshot_captures_changed_actual_basis_without_overwriting_history(app_context):
    app=app_context;a=app.solution_paths.ensure_baseline(M)
    before=app.workspace_scenarios.snapshot(M,a['scenario_id'])
    original=app.vault.read_text(before)
    app.matter_records.apply_update(M,facts=[{'text':'Actual corrected settlement takes two days.'}])
    after=app.workspace_scenarios.snapshot(M,a['scenario_id'])
    assert after!=before and app.vault.read_text(before)==original
    assert 'Actual corrected settlement takes two days.' in app.vault.read_text(after)
    assert app.workspace_scenarios.snapshot(M,a['scenario_id'])==after


def test_legacy_role_title_and_rename_preserve_identity_and_direction(app_context):
    s, a, b, args = transition_setup(app_context)
    path = s.scenarios._path(M, a['scenario_id'])
    doc = s.vault.read_markdown(path)
    doc['metadata']['scenario']['title'] = 'Current approach'
    s.vault.write_markdown(path, doc['content'], doc['metadata'])
    raw = s.vault.read_text(path)
    legacy = s.scenarios.get(M, a['scenario_id'])
    assert legacy['title'] == 'Original plan'
    assert s.vault.read_text(path) == raw  # Reading old names does not rewrite history.
    assert s.transition(M, **args)['state'] == 'committed'
    pointer = s.state(M)
    renamed = s.scenarios.save(M, {**legacy, 'title': 'Direct operation'},
                               expected_revision=legacy['revision'])
    assert renamed['scenario_id'] == a['scenario_id']
    assert renamed['analysis'] == legacy['analysis']
    assert s.state(M) == pointer
    with pytest.raises(WorkspaceConflict):
        s.scenarios.save(M, {**legacy, 'title': 'Stale rename'}, expected_revision=legacy['revision'])
    restored = s.transition(M, **{**args, 'path_id':renamed['scenario_id'],
        'expected_path_revision':renamed['revision'], 'expected_mainline_revision':pointer['revision'],
        'source_action_key':'restore-renamed', 'restore':True})
    assert restored['state'] == 'committed'
    assert s.scenarios.get(M, a['scenario_id'])['title'] == 'Direct operation'
