// Confine this acceptance build to its own output directory. Preserve live dev output.
const path=require('path');
const configPath=require.resolve(path.resolve(__dirname,'../../../frontend/node_modules/next/dist/server/config'));
const config=require(configPath);
require.cache[configPath].exports={...config,__esModule:true,default:async(...args)=>{const loaded=await config.default(...args);return {...loaded,distDir:'.next-map-production'};}};
