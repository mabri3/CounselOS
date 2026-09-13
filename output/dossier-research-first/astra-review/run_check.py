from pathlib import Path
import subprocess,sys,json,time,datetime
out=Path(__file__).resolve().parent
name,cwd,*cmd=sys.argv[1:]
start=time.monotonic(); began=datetime.datetime.now(datetime.timezone.utc).isoformat()
with (out/(name+'.log')).open('w') as log:
 p=subprocess.Popen(cmd,cwd=cwd,stdout=log,stderr=subprocess.STDOUT)
 (out/(name+'.process.json')).write_text(json.dumps({'pid':p.pid,'command':cmd,'cwd':cwd,'started_at':began},indent=2))
 code=p.wait()
result={'name':name,'command':cmd,'cwd':cwd,'started_at':began,'exit_code':code,'duration_seconds':round(time.monotonic()-start,3),'baseline':'baseline.json'}
(out/(name+'.result.json')).write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result),flush=True)
sys.exit(code)
