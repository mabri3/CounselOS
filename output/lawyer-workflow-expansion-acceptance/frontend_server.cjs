const path=require("node:path");
const root=path.resolve(__dirname,"../..");
process.env.NEXT_PUBLIC_API_BASE_URL="http://localhost:8117/api";
const next=require(path.join(root,"frontend/node_modules/next"));
const app=next({dev:true,dir:path.join(root,"frontend"),hostname:"localhost",port:3117,webpack:true,conf:{reactStrictMode:true,distDir:".next-continuity",typescript:{tsconfigPath:".continuity-tsconfig.json"}}});
app.prepare().then(()=>require("node:http").createServer(app.getRequestHandler()).listen(3117,"127.0.0.1"));
