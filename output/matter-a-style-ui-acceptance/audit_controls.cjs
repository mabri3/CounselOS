const fs=require('fs'),path=require('path');
const ts=require(path.join(__dirname,'../../frontend/node_modules/typescript'));
const base=JSON.parse(fs.readFileSync(path.join(__dirname,'baseline-owned-source.json')));
const own=JSON.parse(fs.readFileSync(path.join(__dirname,'ownership.json')));
function attrs(text){const tree=ts.createSourceFile('view.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const values=[];function visit(n){if(ts.isJsxAttribute(n)&&/^on[A-Z]/.test(n.name.getText(tree)))values.push(n.getText(tree).replace(/\s+/g,' '));ts.forEachChild(n,visit);}visit(tree);return values;}
function multiset(a){const m=new Map();for(const x of a)m.set(x,(m.get(x)||0)+1);return m;}
const report={};for(const [chunk,files]of Object.entries(own)){report[chunk]=files.filter(p=>p in base&&p.endsWith('.tsx')).map(p=>{const before=multiset(attrs(base[p])),after=multiset(attrs(fs.readFileSync(p,'utf8')));return{path:p,beforeHandlers:[...before.values()].reduce((a,b)=>a+b,0),afterHandlers:[...after.values()].reduce((a,b)=>a+b,0),removedOrChanged:[...before].flatMap(([s,n])=>Array(Math.max(0,n-(after.get(s)||0))).fill(s)),addedOrChanged:[...after].flatMap(([s,n])=>Array(Math.max(0,n-(before.get(s)||0))).fill(s))};});}
fs.writeFileSync(path.join(__dirname,'control-audit.json'),JSON.stringify(report,null,2));for(const[c,rows]of Object.entries(report))console.log(c,rows.map(r=>`${path.basename(r.path)} ${r.beforeHandlers}->${r.afterHandlers} changed:${r.removedOrChanged.length}`).join('; '));
