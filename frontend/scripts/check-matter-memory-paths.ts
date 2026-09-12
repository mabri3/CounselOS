import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path:string)=>readFileSync(path,"utf8");
const controls=read("components/workspace/SolutionPaths.tsx");
for(const text of ["Current approach","Alternative","Compare these approaches","Details for","Make this our current approach","Archive this alternative","View saved working note"])assert.ok(controls.includes(text),text);
for(const file of ["components/MatterWorkspace.tsx","components/experimental/ExperimentalChat.tsx"])assert.ok(read(file).includes("<SolutionPaths"));
assert.ok(read("components/experimental/ExperimentalSkills.tsx").includes("Shared"));
console.log("Path presentation contracts passed; browser behavior is tested separately.");
