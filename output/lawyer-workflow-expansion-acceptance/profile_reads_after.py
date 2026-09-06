import os,sys,json,cProfile,pstats,io,time,shutil,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[2];out=Path(__file__).parent;env=json.loads((out/'environment.json').read_text());sys.path.insert(0,str(root/'backend'))
profile_root=Path(tempfile.mkdtemp(prefix='themis-continuity-profile-'));v=profile_root/'vault';shutil.copytree(env['vault'],v)
os.environ['VAULT_PATH']=str(v);os.environ['SCHEDULER_ENABLED']='false'
from app.config import Settings
from app.runtime import AppContext
from app.routers.workspace import orientation,impact_candidates
ctx=AppContext(Settings(vault_path=str(v),scheduler_enabled=False),recover_interrupted=False)
results={}
for name,call in [('workspace',lambda:ctx.workspace.get('MAT-20260905-0a2378')),('orientation',lambda:orientation('MAT-20260905-0a2378',context=ctx,person_id='alex')),('impact_candidates',lambda:impact_candidates('MAT-20260905-0a2378',context=ctx))]:
 profiler=cProfile.Profile();start=time.monotonic();profiler.enable();value=call();profiler.disable();elapsed=time.monotonic()-start;buff=io.StringIO();pstats.Stats(profiler,stream=buff).sort_stats('cumulative').print_stats(45);(out/f'profile-{name}-after.txt').write_text(buff.getvalue());results[name]={'seconds':elapsed,'result_type':type(value).__name__};print(name,elapsed,flush=True)
(out/'profile-reads-after.json').write_text(json.dumps({'profile_root':str(profile_root),'results':results},indent=2))
