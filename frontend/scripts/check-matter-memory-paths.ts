import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(path:string)=>readFileSync(path,"utf8");
const controls=read("components/workspace/SolutionPaths.tsx");
for(const text of ["Current direction:","Working on:","Use as direction","Restore this direction","Archive alternative","Working note details"])assert.ok(controls.includes(text),text);
for(const file of ["components/MatterWorkspace.tsx","components/experimental/ExperimentalChat.tsx"])assert.ok(read(file).includes("<SolutionPaths"));
assert.ok(read("components/experimental/ExperimentalSkills.tsx").includes("Shared"));
console.log("Path presentation contracts passed; browser behavior is tested separately.");
