import fs from 'node:fs/promises';
import {FileBlob,PresentationFile} from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('/Users/bharris/Downloads/BDV - Lean Canvas (template 08142025).pptx'));
console.log((await p.inspect({kind:'slide,textbox,shape,layout',maxChars:30000})).ndjson);
await fs.writeFile('.tmp/themis-lean-canvas/layout.json',await (await p.slides.items[0].export({format:'layout'})).text());
