const path = require('path');
const fs = require('fs');
const root = path.resolve(__dirname, '../../..');
const env = JSON.parse(fs.readFileSync(path.join(__dirname, 'environment.json'), 'utf8'));
process.env.NEXT_PUBLIC_API_BASE_URL = `http://localhost:${env.backend_port}/api`;
const next = require(path.join(root, 'frontend/node_modules/next'));
const http = require('http');
const config = require(path.join(root, 'frontend/node_modules/next/dist/server/config')).default;
const {PHASE_DEVELOPMENT_SERVER} = require(path.join(root,'frontend/node_modules/next/constants'));
(async () => {
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(await config(PHASE_DEVELOPMENT_SERVER,path.join(root,'frontend'),{customConfig:{reactStrictMode:true,distDir:'.next-map-redesign'}}));
const app = next({dev:true,dir:path.join(root,'frontend'),hostname:'localhost',port:env.frontend_port,webpack:true,conf:{reactStrictMode:true,distDir:'.next-map-redesign'}});
app.prepare().then(() => http.createServer(app.getRequestHandler()).listen(env.frontend_port,'127.0.0.1'));

})();
