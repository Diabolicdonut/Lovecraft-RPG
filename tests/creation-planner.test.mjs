import test from "node:test";
import assert from "node:assert/strict";
import {
 rollCreationDraft,validateCreationDraft,setCreationPoints,
 autoAllocateRemaining,completeCreationDraft,PLANNER_OCCUPATIONS
} from "../engine/creation-planner.mjs";
const fixed=()=>0.4;
test("creation draft supports all source age brackets 15–89",()=>{
 for(const age of [15,19,20,39,40,49,50,59,60,69,70,79,80,89]){
  const draft=rollCreationDraft({name:"Investigator",age,random:fixed});
  assert.equal(draft.age,age);
  assert.ok(draft.occupationRemaining>0);
  assert.equal(draft.personalRemaining,draft.attributes.INT*2);
  assert.deepEqual(validateCreationDraft(draft),draft);
 }
 assert.throws(()=>rollCreationDraft({age:14,random:fixed}),RangeError);
 assert.throws(()=>rollCreationDraft({age:90,random:fixed}),RangeError);
});
test("teenage age adjustment removes 5 physical and EDU, raises Luck to better of two",()=>{
 const teen=rollCreationDraft({age:19,random:fixed});
 const adult=rollCreationDraft({age:20,random:fixed});
 assert.equal(teen.attributes.STR,adult.attributes.STR-5);
 assert.equal(teen.attributes.EDU,adult.attributes.EDU-5);
 assert.equal(teen.luck,45);
});
test("senior aging applies printed EDU checks, APP and physical deductions",()=>{
 const adult=rollCreationDraft({age:20,random:fixed});
 const forties=rollCreationDraft({age:45,random:fixed});
 const eighties=rollCreationDraft({age:85,random:fixed});
 assert.equal(forties.attributes.APP,adult.attributes.APP-5);
 assert.equal(forties.attributes.STR,adult.attributes.STR-5);
 assert.equal(eighties.attributes.APP,adult.attributes.APP-25);
 assert.equal(eighties.attributes.STR+eighties.attributes.CON+eighties.attributes.DEX,
   adult.attributes.STR+adult.attributes.CON+adult.attributes.DEX-80);
});
test("occupation and personal pools remain separate, with occupation-only eligibility",()=>{
 let d=rollCreationDraft({age:27,random:fixed});
 assert.equal(d.occupationSpent,9);
 assert.throws(()=>setCreationPoints(d,{skill:"Listen",pool:"occupation",points:1}));
 d=setCreationPoints(d,{skill:"Listen",pool:"personal",points:25});
 assert.equal(d.personalSpent,25);
 assert.equal(d.occupationSpent,9);
 assert.throws(()=>setCreationPoints(d,{skill:"Cthulhu Mythos",pool:"personal",points:1}));
 assert.throws(()=>setCreationPoints(d,{skill:"Library Use",pool:"occupation",points:999}));
});
test("Credit Rating is in profession range and cannot be forged or overfunded",()=>{
 const d=rollCreationDraft({occupation:"Archivist",random:fixed});
 assert.equal(d.occupationPoints["Credit Rating"],9);
 assert.throws(()=>setCreationPoints(d,{skill:"Credit Rating",pool:"occupation",points:99}));
 const bad={...d,occupationBudget:d.occupationBudget+1};
 assert.throws(()=>validateCreationDraft(bad));
});
test("auto allocation consumes both point pools exactly without losing any points",()=>{
 for(const occupation of Object.keys(PLANNER_OCCUPATIONS)){
  const d=rollCreationDraft({occupation,random:fixed});
  const completed=autoAllocateRemaining(d);
  assert.equal(completed.occupationRemaining,0);
  assert.equal(completed.personalRemaining,0);
  const p=completeCreationDraft(completed);
  assert.equal(p.origin,"generated-custom-15-89");
  assert.equal(p.occupation,occupation);
  assert.equal(p.skills["Cthulhu Mythos"],0);
  assert.ok(p.skills["Credit Rating"]>=PLANNER_OCCUPATIONS[occupation].credit[0]);
  assert.ok(p.skills["Credit Rating"]<=PLANNER_OCCUPATIONS[occupation].credit[1]);
 }
});
test("cannot finalize unspent drafts or overallocate skill beyond 99",()=>{
 const d=rollCreationDraft({random:fixed});
 assert.throws(()=>completeCreationDraft(d),/Allocate every/);
 assert.throws(()=>setCreationPoints(d,{skill:"Library Use",pool:"personal",points:99}));
});
test("80s character can be finalized with preserved derived stats and honest sheet",()=>{
 const draft=autoAllocateRemaining(rollCreationDraft({age:85,random:fixed}));
 const actor=completeCreationDraft(draft);
 assert.equal(actor.age,85);
 assert.equal(actor.hitPoints,Math.floor((actor.attributes.CON+actor.attributes.SIZ)/10));
 assert.equal(actor.maxSanity,99);
 assert.equal(actor.skills["Dodge"]>=Math.floor(actor.attributes.DEX/2),true);
});
test("draft can survive JSON serialization without losing allocations",()=>{
 let d=rollCreationDraft({name:"Katherine Vale",random:fixed});
 d=setCreationPoints(d,{skill:"Occult",pool:"occupation",points:25});
 const restored=validateCreationDraft(JSON.parse(JSON.stringify(d)));
 assert.equal(restored.occupationPoints.Occult,25);
 assert.equal(restored.name,"Katherine Vale");
});
