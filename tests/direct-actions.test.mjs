import test from "node:test";
import assert from "node:assert/strict";
import {createInvestigator} from "../engine/character-creation.mjs";
import {cocSkillForLegacy,previewAction,difficultyFromHiddenClues} from "../engine/investigator.mjs";
import {check,push,spendLuck} from "../engine/coc7.mjs";
const seq=(...digits)=>{const nums=[...digits];return ()=>nums.shift()/10+0.01;};
test("direct 7e skill inputs are accepted only in bounded noncombat categories",()=>{
 assert.equal(cocSkillForLegacy({actionType:"observe",targetType:"scene",skill:"Listen"}),"Listen");
 assert.equal(cocSkillForLegacy({actionType:"research",targetType:"object",skill:"History"}),"History");
 assert.equal(cocSkillForLegacy({actionType:"technical",targetType:"object",skill:"Locksmith"}),"Locksmith");
 assert.throws(()=>cocSkillForLegacy({actionType:"combat",targetType:"npc",skill:"Fighting (Brawl)"}));
 assert.throws(()=>cocSkillForLegacy({actionType:"observe",targetType:"none",skill:"Spot Hidden"}));
 assert.throws(()=>cocSkillForLegacy({actionType:"social",targetType:"npc",skill:"Cthulhu Mythos"}));
});
test("direct skill preview can differ from secret real difficulty without exposing it",()=>{
 const investigator=createInvestigator({random:()=>0.42});
 const interp={actionType:"research",targetType:"scene",skill:"Library Use",difficulty:"uncertain"};
 const publicView=previewAction(investigator,interp);
 assert.equal(publicView.skill,"Library Use");
 assert.equal(publicView.difficulty,"regular");
 assert.equal(difficultyFromHiddenClues(interp,[{difficulty:"extreme"}]),"extreme");
 assert.equal("hiddenTruth" in publicView,false);
});
test("after a visible failed roll, Luck updates numeric total only with explicit consent",()=>{
 const initial=check({value:60,difficulty:"hard"},seq(5,3)); // 35, needs 5 points
 assert.equal(initial.success,false);
 assert.throws(()=>spendLuck({initial,available:10,consent:false}));
 const paid=spendLuck({initial,available:10,consent:true});
 assert.equal(paid.success,true);
 assert.equal(paid.luckRemaining,5);
 assert.equal(paid.usedLuck,true);
});
test("pushed failure stays failure and cannot be retried",()=>{
 const initial=check({value:50},seq(0,9)); // 90 fail
 const second=push({initial,authorized:true,changedApproach:"Study the lock in better light"},seq(0,8));
 assert.equal(second.success,false);
 assert.equal(second.pushed,true);
 assert.throws(()=>push({initial:second,authorized:true,changedApproach:"Try again"}));
 assert.throws(()=>spendLuck({initial:second,available:99,consent:true}));
});
