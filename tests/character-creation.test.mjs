import test from "node:test";
import assert from "node:assert/strict";
import {ARCHETYPES,rollCharacteristics,occupationBudget,createInvestigator,renameInvestigator} from "../engine/character-creation.mjs";
import {validateInvestigator,COC_SKILL_DEFAULTS} from "../engine/investigator.mjs";
function seeded(seed=0x10203040){
 let state=seed>>>0;
 return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
}
test("two supported original career archetypes have valid budgets",()=>{
 assert.deepEqual(Object.keys(ARCHETYPES),["Archivist","Field Investigator"]);
 assert.equal(occupationBudget({EDU:75,DEX:50},"Archivist"),300);
 assert.equal(occupationBudget({EDU:75,DEX:50},"Field Investigator"),250);
});
test("adult characteristic rolling uses source-appropriate ranges and derives Luck",()=>{
 const result=rollCharacteristics({age:27,random:seeded(5)});
 for(const k of ["STR","CON","DEX","APP","POW"]) assert.ok(result.attributes[k]>=15&&result.attributes[k]<=90);
 for(const k of ["SIZ","INT","EDU"]) assert.ok(result.attributes[k]>=40&&result.attributes[k]<=99);
 assert.ok(result.luck>=15&&result.luck<=90);
 assert.throws(()=>rollCharacteristics({age:41,random:seeded(5)}),RangeError);
});
test("generated investigators have consistent derived stats and no Mythos points",()=>{
 for(const o of Object.keys(ARCHETYPES)){
  const person=createInvestigator({name:"Ada Voss",occupation:o,age:32,random:seeded(22)});
  assert.equal(person.name,"Ada Voss");assert.equal(person.occupation,o);
  assert.equal(person.skills["Cthulhu Mythos"],0);
  assert.equal(person.hitPoints,Math.floor((person.attributes.CON+person.attributes.SIZ)/10));
  assert.equal(person.magicPoints,Math.floor(person.attributes.POW/5));
  assert.equal(person.sanity,person.attributes.POW);
  assert.ok(person.skills["Credit Rating"]>=ARCHETYPES[o].credit[0]);
  assert.ok(person.skills["Credit Rating"]<=ARCHETYPES[o].credit[1]);
  assert.equal(person.skills["Dodge"]>=Math.floor(person.attributes.DEX/2),true);
  assert.equal(person.skills["Language (Own)"]>=person.attributes.EDU,true);
  assert.doesNotThrow(()=>validateInvestigator(person));
 }
});
test("created characters differ on changing entropy, and repeat with same seed",()=>{
 const one=createInvestigator({random:seeded(100)});
 const two=createInvestigator({random:seeded(100)});
 const other=createInvestigator({random:seeded(101)});
 assert.deepEqual(one,two);
 assert.notDeepEqual(one.attributes,other.attributes);
});
test("creation rejects unsupported occupation, age and invalid name",()=>{
 assert.throws(()=>createInvestigator({occupation:"Sorcerer",random:seeded()}));
 assert.throws(()=>createInvestigator({age:80,random:seeded()}),RangeError);
 assert.throws(()=>createInvestigator({name:"  ",random:seeded()}));
});
test("name/backstory editing preserves original rolled numerical fields",()=>{
 const first=createInvestigator({random:seeded()});
 const second=renameInvestigator(first,{name:"Eleanor Marsh",backstory:"Former archivist."});
 assert.equal(second.name,"Eleanor Marsh");
 assert.equal(second.backstory,"Former archivist.");
 assert.deepEqual(second.skills,first.skills);
 assert.deepEqual(second.attributes,first.attributes);
 assert.throws(()=>renameInvestigator(first,{name:""}));
});
test("generated sample total point increase equals both budgets",()=>{
 for(let seed=1;seed<12;seed++){
  for(const occupation of Object.keys(ARCHETYPES)){
   const p=createInvestigator({occupation,random:seeded(seed)});
   const derived={...COC_SKILL_DEFAULTS,"Dodge":Math.floor(p.attributes.DEX/2),
     "Language (Own)":p.attributes.EDU};
   const total=Object.entries(p.skills).reduce((n,[key,value])=>n+value-derived[key],0);
   const expected=occupationBudget(p.attributes,occupation)+p.attributes.INT*2;
   assert.equal(total,expected,"seed "+seed+" "+occupation);
  }
 }
});
