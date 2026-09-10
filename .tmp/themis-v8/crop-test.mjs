import fs from 'node:fs/promises';import {Presentation,PresentationFile} from '@oai/artifact-tool';
const p=Presentation.create({slideSize:{width:1280,height:720}});const s=p.slides.add();
const a=s.images.add({blob:new Uint8Array(await fs.readFile('output/deck/screenshots/matter-relay.png')),contentType:'image/png',fit:'cover',position:{left:64,top:200,width:862,height:357}});a.crop={left:.19,top:.166,right:.16,bottom:.57};
console.log(a.crop,a.frame);await(await PresentationFile.exportPptx(p)).save('.tmp/themis-v8/crop-test.pptx');const b=await p.export({slide:s,format:'png',scale:1});await fs.writeFile('.tmp/themis-v8/crop-test.png',new Uint8Array(await b.arrayBuffer()));
