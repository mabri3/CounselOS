"""Narrow path operations through the existing workspace_action transport."""
from copy import deepcopy
from app.models.matter_memory import PathRead, PathExplore, PathUpdate, PathTransition, PathCompare, MemorySave, ArchiveRead
from app.services.workspace import digest

PATH_READ_ACTIONS=frozenset({'inspect_paths','compare_paths','read_matter_memory','read_conversation_archive','search_local_sources','read_local_source'})
PATH_ACTIONS=PATH_READ_ACTIONS|{'explore_path','update_path','select_working_path','promote_path','restore_path','archive_path','save_working_memory'}
SCENARIO_ACTIONS=PATH_ACTIONS|{'save_scenario','correct_fact'}


def bind_path(context,path_id):
    scenario=context.app.workspace_scenarios.get(context.matter_id,path_id)
    context.scope_state['working_path_id']=path_id
    context.frozen_context['active_path']={'path_id':path_id,'revision':scenario['revision']}
    memory=context.app.matter_memory.read(context.matter_id,path_id)
    context.frozen_context['memory_sequence']=memory['sequence']
    context.frozen_context['memory_revision']=memory['revision']
    conversation_id=context.frozen_context.get('conversation_id')
    if conversation_id:
        history=context.app.chat_history
        conv=history.get(context.matter_id,conversation_id)
        doc=context.app.vault.read_markdown(conv['path'])
        doc['metadata']['working_path_id']=path_id
        context.app.vault.write_markdown(doc['path'],doc['content'],doc['metadata'])
    if context.frozen_context.get('excluded_paths'):
        return {'path_id':path_id,'revision':scenario['revision'],'historical_material_withheld':True}
    return {'path_id':path_id,'revision':scenario['revision'],'assumptions':scenario['proposed_fact_changes'],
            'conditions':scenario['unresolved_conditions'],'memory':context.app.matter_memory.context_view(context.matter_id,path_id)}


async def path_action(context,arguments):
    from app.tools.handlers import _instruction
    action=arguments['action']; values=arguments.get('values') or {}; app=context.app; matter=context.matter_id
    if not matter: raise ValueError('Select a matter.')
    if action not in PATH_READ_ACTIONS:
        _instruction(context,arguments)
        if not context.run_id or not context.source_action_key:
            raise ValueError('A server-bound run and action key are required.')
    service=app.solution_paths
    excluded=context.frozen_context.get('excluded_paths',[])
    if action in {'search_local_sources','read_local_source'}:
        from app.services.local_source_access import LocalSourceAccess
        saved=LocalSourceAccess(context).execute(action,values)
    elif action=='read_conversation_archive':
        v=ArchiveRead.model_validate(values)
        saved={'state':'withheld'} if excluded else app.chat_history.archive_read(matter,**v.model_dump())
    elif action=='inspect_paths':
        v=PathRead.model_validate({} if values == {'inspect': {}} else values)
        saved=service.inspect(matter,offset=v.offset,limit=v.limit)
        if excluded:
            for p in saved['paths']:
                p['title']='Saved path (text withheld)';p['unresolved_conditions']=[]
    elif action=='compare_paths':
        v=PathCompare.model_validate(values)
        paths=[app.workspace_scenarios.get(matter,p) for p in v.path_ids]
        context.frozen_context['comparison_path_ids']=v.path_ids
        saved={'ordered_path_ids':v.path_ids,'paths':[{'path_id':p['scenario_id'],'revision':p['revision'],
            **({} if excluded else {'title':p['title'],'assumptions':p['proposed_fact_changes'],'conditions':p['unresolved_conditions'],
                'hypothesis_summary':p['hypothesis_summary'][:2000], 'analysis':p['analysis'][:6000],
                'analysis_truncated':len(p['analysis'])>6000, 'stale':p['stale'],
                'read_path':app.workspace_scenarios._path(matter,p['scenario_id'])})} for p in paths]}
    elif action=='read_matter_memory':
        v=PathRead.model_validate(values)
        identity=v.path_id or context.scope_state.get('working_path_id') or (context.frozen_context.get('active_path') or {}).get('path_id')
        if not identity: raise ValueError('Select a working path first.')
        saved=app.matter_memory.context_view(matter,identity,excluded_paths=excluded)
    elif action=='explore_path':
        v=PathExplore.model_validate(values)
        saved=service.explore(matter,**v.model_dump(),source_action_key=context.source_action_key)
        context.scope_state['scope']='scenario'
        saved={'path':saved,'bound_context':bind_path(context,saved['scenario_id'])}
    elif action=='select_working_path':
        v=PathRead.model_validate(values)
        if not v.path_id: raise ValueError('A stable path ID is required.')
        saved=bind_path(context,v.path_id)
    elif action in {'promote_path','restore_path'}:
        v=PathTransition.model_validate(values)
        saved=service.transition(matter,**v.model_dump(exclude={'select_for_this_conversation'}),
            source_action_key=context.source_action_key,run_id=context.run_id,message_id=context.trusted_message_id,
            instruction_quote=_instruction(context,arguments),actor=context.lawyer_author or 'user',
            conversation_id=context.frozen_context.get('conversation_id'),restore=action=='restore_path')
        if saved['state'] in {'committed','no_change'}:
            context.frozen_context['mainline_state'] = service.state(matter)
        if saved['state'] in {'committed','no_change'} and v.select_for_this_conversation:
            saved['bound_context']=bind_path(context,v.path_id)
    elif action in {'update_path','archive_path'}:
        v=PathUpdate.model_validate(values)
        if action=='archive_path': saved=service.archive(matter,v.path_id,v.expected_path_revision)
        else:
            old=app.workspace_scenarios.get(matter,v.path_id)
            saved=app.workspace_scenarios.save(matter,{**old,**v.model_dump(exclude_none=True,exclude={'path_id','expected_path_revision'})},expected_revision=v.expected_path_revision)
    elif action=='save_working_memory':
        v=MemorySave.model_validate(_memory_source_units(app,matter,values))
        path_id=context.scope_state.get('working_path_id') or (context.frozen_context.get('active_path') or {}).get('path_id')
        if not path_id: raise ValueError('Select a working path first.')
        saved=app.matter_memory.save(matter,path_id,**v.model_dump(),run_id=context.run_id,
            conversation_id=context.frozen_context.get('conversation_id'),message_id=context.trusted_message_id)
    else: raise ValueError('Unknown path action.')
    if excluded and action not in {'search_local_sources','read_local_source'}:
        saved = _identity_only(saved)
        saved['historical_material_withheld'] = True
    return {'summary':action.replace('_',' ')+': '+str(saved.get('state','saved' if action not in PATH_READ_ACTIONS else 'read')),
            'data':saved,'changed_paths':saved.get('changed_paths',[]),'refresh':['matter','tree'] if action not in PATH_READ_ACTIONS else []}


def _identity_only(value):
    """Historical prose has no complete source attribution; preserve only identity."""
    allowed={'schema_version','matter_id','revision','mainline_path_id','path_id','scenario_id','parent_path_id','parent_revision',
        'path_kind','archived_at','role','next_offset','state','operation_id','from_path_id','to_path_id','mainline_revision',
        'sequence','projection_state','actual_facts_changed','decision_recorded','path_revision','paths','ordered_path_ids',
        'changed_paths','bound_context','path','historical_material_withheld'}
    if isinstance(value,dict):return {k:_identity_only(v) for k,v in value.items() if k in allowed}
    if isinstance(value,list):return [_identity_only(v) for v in value]
    return value


def _memory_source_units(app, matter_id, values):
    """Resolve a numeric page/section only against the exact stored source version."""
    result = deepcopy(values)
    payload = result.get('payload') or {}
    for ref in app.matter_memory._references(payload | {
        key: payload.get(key, []) for key in ('findings', 'open_items', 'pending_effects')
    }):
        unit = str(ref.get('unit_id') or '')
        if ref.get('kind') != 'source' or not unit.isdecimal():
            continue
        doc = app.source_library.describe(matter_id, ref['record_id'], ref.get('source_version') or '')
        matches = [u['unit_id'] for u in doc['units']
                   if u['unit_id'][1:].isdigit() and int(u['unit_id'][1:]) == int(unit)]
        if len(matches) != 1:
            raise ValueError('Source page or section is ambiguous or absent. Read the source and use its returned unit_id.')
        ref['unit_id'] = matches[0]
    return result
