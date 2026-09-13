"""Matter-local bounded working notes. Records remain the source of factual truth."""
from __future__ import annotations
import json
from copy import deepcopy
from app.models.matter_memory import WorkingPayload
from app.services.dossier import serialized
from app.services.workspace import digest, WorkspaceConflict
from app.utils.time import iso_now


class MatterMemoryService:
    def __init__(self, app):
        self.app, self.vault = app, app.vault

    def _path(self,matter_id,path_id):
        self.app.workspace_scenarios.get(matter_id,path_id)
        return f'{self.app.matters.matter_path(matter_id)}/memory/{path_id}/working.md'

    @staticmethod
    def _body(payload):
        return '# Working note — generated guidance, not actual facts\n\n' + json.dumps(payload,ensure_ascii=False,indent=2)

    def _load(self,path):
        doc=self.vault.read_markdown(path)
        payload=WorkingPayload.model_validate(doc['metadata']['payload']).model_dump(mode='json')
        if doc['content'].strip()!=self._body(payload).strip():
            # The readable body is authoritative for a manual edit. Validate it independently.
            raw=doc['content'].split('\n\n',1)[1]
            payload=WorkingPayload.model_validate(json.loads(raw)).model_dump(mode='json')
            doc['metadata']['user_edited']=True
        result={**doc['metadata'],'payload':payload,'revision':digest({'body':doc['content'],'metadata':doc['metadata']})}
        return result

    def read(self,matter_id,path_id):
        path=self._path(matter_id,path_id)
        if not self.vault.exists(path):
            return {'state':'empty','sequence':0,'revision':'','payload':None,'warning':None}
        try:
            return {'state':'available',**self._load(path)}
        except (ValueError,KeyError,TypeError,IndexError):
            directory=self.vault.resolve(path).parent/'history'
            for candidate in sorted(directory.glob('*.md'),reverse=True):
                try:
                    return {'state':'previous_valid',**self._load(self.vault.relative(candidate)),
                            'warning':'The current note is invalid. Showing the previous valid revision.'}
                except (ValueError,KeyError,TypeError,IndexError):
                    continue
            return {'state':'unavailable','sequence':0,'revision':'','payload':None,'warning':'The working note is invalid.'}

    def _resolve(self,matter_id,ref):
        kind,identity=ref['kind'],ref['record_id']
        if kind=='source':
            if not ref.get('source_version'):
                raise ValueError('A source reference needs its immutable version.')
            doc=self.app.source_library.describe(matter_id,identity,ref['source_version'])
            if ref.get('unit_id') and not any(u['unit_id']==ref['unit_id'] for u in doc['units']):
                raise ValueError('Source unit not found.')
            return {'revision':ref['source_version'],'path':doc['original_path']}
        if kind=='scenario':
            item=self.app.workspace_scenarios.get(matter_id,identity)
            return {'revision':item['revision'],'path':self.app.workspace_scenarios._path(matter_id,identity)}
        if kind=='message':
            conversation=self.app.chat_history.get(matter_id,ref.get('conversation_id') or '')
            item=next((m for m in conversation['messages'] if m['message_id']==identity),None)
            if not item: raise ValueError('Message not found in this matter.')
            return {'revision':digest(item),'path':conversation['path']}
        if kind=='fact':
            items=self.app.matter_records.get(matter_id)['facts']; key='fact_id'
        elif kind=='question':
            items=self.app.workspace.questions(matter_id); key='question_id'
        elif kind=='objective':
            items=[self.app.workspace.business_question(matter_id)]; key='question_id'
        elif kind=='work_item':
            items=self.app.index.list_work_items(matter_id); key='work_item_id'
        elif kind=='recommendation':
            from app.services.recommendations import RecommendationService
            items=RecommendationService(self.vault,self.app.matters).get(matter_id)['versions']; key='version_id'
        else:
            # Resolve only actual indexed matter documents, never a model-supplied path.
            items=[]
            base=self.app.matters.matter_path(matter_id)
            for path in self.vault.iter_files(base,{'.md'}):
                if any(x in path.parts for x in ('memory','scenarios','paths')): continue
                doc=self.vault.read_markdown(self.vault.relative(path)); meta=doc['metadata']
                if identity in (meta.get('output_id'),meta.get('decision_id'),meta.get('analysis_id')):
                    return {'revision':digest(doc['content']),'path':doc['path']}
            raise ValueError('Record reference not found in this matter.')
        item=next((i for i in items if i.get(key)==identity),None)
        if not item: raise ValueError('Record reference not found in this matter.')
        return {'revision':item.get('revision') or digest(item),'path':item.get('path',''),
                'inactive':item.get('status') in {'superseded','withdrawn'} or bool(item.get('withdrawn_at'))}

    @staticmethod
    def _references(payload):
        if payload.get('objective_ref'): yield payload['objective_ref']
        for field in ('findings','open_items','pending_effects'):
            for item in payload[field]:
                yield from item.get('references',[])
                yield from item.get('depends_on',[])

    @serialized
    def save(self,matter_id,path_id,payload,*,expected_sequence,expected_revision=None,run_id,conversation_id,message_id,receipt_ids=()):
        path=self._path(matter_id,path_id)
        if not run_id or not message_id or not conversation_id:
            raise ValueError('Server-bound run, conversation and message provenance are required.')
        conversation=self.app.chat_history.get(matter_id,conversation_id)
        if not any(m['message_id']==message_id and m['role']=='user' for m in conversation['messages']):
            raise ValueError('The originating user message is not in this conversation.')
        proposed=WorkingPayload.model_validate(payload).model_dump(mode='json')
        current=self.read(matter_id,path_id)
        if current['sequence']!=expected_sequence or (expected_revision is not None and current['revision']!=expected_revision):
            raise WorkspaceConflict('Working note changed; read it before saving.',current['revision'])
        if current.get('user_edited') and expected_revision is None:
            raise WorkspaceConflict('The working note was edited; supply its current revision.',current['revision'])
        lineage=[]
        for ref in self._references(proposed):
            resolved=self._resolve(matter_id,ref)
            lineage.append({'reference':ref,**resolved})
        now=iso_now()
        metadata={'schema_version':1,'matter_id':matter_id,'path_id':path_id,'sequence':current['sequence']+1,
            'writer_run_id':run_id,'conversation_id':conversation_id,'source_message_ids':[message_id],
            'created_at':current.get('created_at',now),'updated_at':now,'payload':proposed,'lineage':lineage,
            'basis_revisions':self.app.workspace.source_revisions(matter_id),'covered_through_message_id':message_id,
            'publication_receipt_ids':list(receipt_ids),'user_edited':False}
        body=self._body(proposed)
        # Stage and validate before touching the last valid note. Failed stages are harmless.
        staging=path.removesuffix('working.md')+'pending.md'
        self.vault.write_markdown(staging,body,metadata)
        self._load(staging)
        if current.get('payload'):
            history=path.removesuffix('working.md')+f"history/{current['sequence']:08d}-{current['revision']}.md"
            if not self.vault.exists(history):
                self.vault.write_markdown(history,self._body(current['payload']),{k:v for k,v in current.items() if k not in {'state','warning','revision'}})
        self.vault.write_markdown(path,body,metadata)
        result=self.read(matter_id,path_id)
        scenario=self.app.workspace_scenarios.get(matter_id,path_id)
        if scenario['memory_ref']!=path:
            self.app.workspace_scenarios.save(matter_id,{**scenario,'memory_ref':path},expected_revision=scenario['revision'])
        return result

    def context_view(self,matter_id,path_id,*,excluded_paths=()):
        note=self.read(matter_id,path_id)
        if not note.get('payload'): return note
        # Unattributed task/next-action text cannot be safely separated from excluded evidence.
        if excluded_paths:
            return {'state':'withheld','sequence':note['sequence'],'warning':'Working guidance withheld under source exclusions.'}
        stale=[]
        for link in note.get('lineage',[]):
            try:
                now=self._resolve(matter_id,link['reference'])
                if now['revision']!=link['revision'] or now.get('inactive'): stale.append(link['reference']['record_id'])
            except (ValueError,KeyError,FileNotFoundError):
                stale.append(link['reference']['record_id'])
        payload=deepcopy(note['payload'])
        for finding in payload['findings']:
            if any(r['record_id'] in stale for r in [*finding['references'],*finding['depends_on']]):
                finding['status']='unresolved'
        result={'state':note['state'],'path_id':path_id,'sequence':note['sequence'],'revision':note['revision'],
                'payload':payload,'stale_dependencies':list(dict.fromkeys(stale)),
                'warning':note.get('warning'),'generated_guidance_not_facts':True}
        if len(json.dumps(result,ensure_ascii=False))>6000:
            return {'state':'withheld','sequence':note['sequence'],'warning':'Note projection exceeds 6000 characters; read bounded entries.'}
        return result
