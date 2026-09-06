const path=require('path'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'../../..'),dir=path.join(root,'frontend');
const loadConfig=require(path.join(dir,'node_modules/next/dist/server/config')).default;
const {PHASE_PRODUCTION_BUILD}=require(path.join(dir,'node_modules/next/constants'));
(async()=>{const config=await loadConfig(PHASE_PRODUCTION_BUILD,dir,{customConfig:{reactStrictMode:true,distDir:'.next-map-production'}});const child=spawn('npm',['run','build'],{cwd:dir,stdio:'inherit',env:{...process.env,__NEXT_PRIVATE_STANDALONE_CONFIG:JSON.stringify(config)}});child.on('exit',code=>process.exit(code??1));})();
