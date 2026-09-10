from server import *
p=context.work_products.create_draft(E['matter_id'],title='Acceptance final',content='# Acceptance final\n\nImmutable fixture work product.',source_action_key='acceptance-final-fixture')
p=next(item for item in context.work_products.list_drafts(E['matter_id']) if item['title']=='Acceptance final')
result=context.work_products.finalize(E['matter_id'],p['path']);E['final']=result
(Path(__file__).parent/'environment.json').write_text(json.dumps(E,indent=2,default=str));print(json.dumps(result,default=str))
