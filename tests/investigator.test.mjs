import test from "node:test";
import assert from "node:assert/strict";
import {
 COC_ATTRIBUTES,COC_SKILL_DEFAULTS,createPrototypeInvestigator,validateInvestigator,
 cocSkillForLegacy,apparentDifficulty,describeChances,previewAction,
 difficultyFromHiddenClues,outcomeForLegacyDiscovery
} from "../engine/investigator.mjs";
import {classify} from "../engine/coc7.mjs";

test("provisional sheet has complete characteristic and skill values, correct derived stats",()=>{
 const a=createPrototypeInvestigator();
 assert.equal(a.schema,1);assert.equal(a.origin,"provisional-example");
 assert.equal(a.maxHitPoints,11);assert.equal(a.maxMagicPoints,12);
 assert.equal(a.maxSanity,99);
 assert.equal(Object.keys(a.attributes).length,COC_ATTRIBUTES.length);
 assert.deepEqual(Object.keys(a.skills).sort(),Object.keys(COC_SKILL_DEFAULTS).sort());
});
test("schema excludes invalid, missing and incompatible values",()=>{
 const a=createPrototypeInvestigator();
 assert.throws(()=>validateInvestigator({...a,attributes:{...a.attributes,STR:-1}}),RangeError);
 assert.throws(()=>validateInvestigator({...a,skills:{...a.skills,"Spot Hidden":1001}}),RangeError);
 assert.throws(()=>validateInvestigator({...a,sanity:100}),RangeError);
 assert.throws(()=>validateInvestigator({...a,hitPoints:100}),RangeError);
 assert.throws(()=>validateInvestigator({...a,schema:9}),RangeError);
});
test("old legacy sheet never silently populates a CoC schema",()=>{
 assert.throws(()=>validateInvestigator({name:"Old",skills:{observation:72}}));
 assert.equal(createPrototypeInvestigator().occupation,"Independent Investigator");
});
test("strictly map only supported noncombat actions",()=>{
 const p={actionType:"observe",targetType:"scene",skill:"observation",difficulty:"uncertain"};
 assert.equal(cocSkillForLegacy(p),"Spot Hidden");
 assert.equal(apparentDifficulty(p),"regular");
 assert.throws(()=>cocSkillForLegacy({...p,actionType:"combat"}));
 assert.throws(()=>cocSkillForLegacy({...p,skill:"firearms"}));
 assert.throws(()=>cocSkillForLegacy({...p,targetType:"none"}));
 assert.throws(()=>apparentDifficulty({...p,difficulty:"unknown"}));
});
test("qualitative preview derives from actual skill/threshold, no percentages in returned wording",()=>{
 const p={actionType:"observe",targetType:"scene",skill:"observation",difficulty:"difficult"};
 const view=previewAction(createPrototypeInvestigator(),p);
 assert.equal(view.skill,"Spot Hidden");assert.equal(view.value,65);
 assert.equal(view.difficulty,"hard");assert.equal(view.chance,"Unlikely");
 assert.ok(view.qualification.includes("hidden opposition"));
 assert.equal(describeChances(85,"regular").chance,"Very likely");
 assert.equal(describeChances(12,"extreme").chance,"Very unlikely");
});
test("hidden clue difficulty cannot leak into public task preview",()=>{
 const interp={actionType:"research",targetType:"scene",skill:"research",difficulty:"uncertain"};
 const actor=createPrototypeInvestigator();
 const before=previewAction(actor,interp);
 const actual=difficultyFromHiddenClues(interp,[{difficulty:"extreme",hiddenTruth:"not for player"}]);
 assert.equal(before.difficulty,"regular");assert.equal(actual,"extreme");
 assert.equal(JSON.stringify(before).includes("hiddenTruth"),false);
});
test("higher hidden difficulty never becomes easier",()=>{
 assert.equal(difficultyFromHiddenClues({difficulty:"extreme"},[{difficulty:"routine"}]),"extreme");
 assert.equal(difficultyFromHiddenClues({difficulty:"difficult"},[{difficulty:"uncertain"}]),"hard");
 assert.throws(()=>difficultyFromHiddenClues({difficulty:"uncertain"},[{difficulty:"??? "}])); 
});
test("legacy clue presentation only maps CoC result; never changes die result",()=>{
 const get=(roll)=>classify({value:80,roll});
 assert.equal(outcomeForLegacyDiscovery(get(1)),"Exceptional Success");
 assert.equal(outcomeForLegacyDiscovery(get(10)),"Strong Success");
 assert.equal(outcomeForLegacyDiscovery(get(40)),"Strong Success");
 assert.equal(outcomeForLegacyDiscovery(get(72)),"Success");
 assert.equal(outcomeForLegacyDiscovery(get(90)),"Failure");
 assert.equal(outcomeForLegacyDiscovery(get(100)),"Severe Failure");
});
