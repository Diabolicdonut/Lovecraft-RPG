import test from "node:test";
import assert from "node:assert/strict";
import {sanityLossAmount,resolveSanityExposure,sanityPublicProjection} from "../engine/sanity.mjs";
const seq=(...v)=>{const d=[...v];return ()=>{if(!d.length)throw Error("RNG exhausted");return d.shift()/10+0.01;}};
test("Sanity loss accepts authorized constant and simple dice only",()=>{
 assert.equal(sanityLossAmount(0),0);
 assert.equal(sanityLossAmount("1D6",seq(0)),1);
 assert.equal(sanityLossAmount("1D6",seq(9)),6);
 assert.equal(sanityLossAmount("2D3",seq(0,9)),4);
 assert.throws(()=>sanityLossAmount("eval(1)"));
 assert.throws(()=>sanityLossAmount(-1));
});
test("successful SAN check applies lesser pre-authorized shock value",()=>{
 const result=resolveSanityExposure({sanity:60,intelligence:70,dailyStartSan:60,
  lossOnSuccess:0,lossOnFailure:"1D6"},seq(0,1));
 assert.equal(result.sanityRoll.success,true);
 assert.equal(result.sanityAfter,60);assert.equal(result.lost,0);
 assert.equal(result.status,"stable");
});
test("failed SAN check applies dice and daily accumulation",()=>{
 const result=resolveSanityExposure({sanity:60,intelligence:70,dailyStartSan:70,
  priorDailyLoss:10,lossOnFailure:"1D6"},seq(0,9,9,0,1));
 assert.equal(result.sanityRoll.success,false);
 assert.equal(result.lost,6);
 assert.equal(result.dailyLoss,16);
 assert.equal(result.sanityAfter,54);
 assert.equal(result.status,"indefinite");
});
test("shock of five or more tests Intelligence to trigger temporary condition",()=>{
 // SAN 60, roll 90; loss 6. INT70, roll 10 = insight & temporary condition
 const event=resolveSanityExposure({sanity:60,intelligence:70,dailyStartSan:60,
  lossOnFailure:"1D6"},seq(0,9,9,0,1));
 assert.equal(event.lost,6);
 assert.equal(event.temporaryTriggered,true);
 assert.equal(event.status,"temporary");
 assert.equal(event.intelligenceRoll.success,true);
});
test("failed Intelligence can protect from immediate temporary insanity",()=>{
 const event=resolveSanityExposure({sanity:60,intelligence:40,dailyStartSan:60,
  lossOnFailure:"1D6"},seq(0,9,9,0,9));
 assert.equal(event.temporaryTriggered,false);
 assert.equal(event.status,"stable");
});
test("indefinite threshold is at least one fifth of starting daily sanity",()=>{
 const before=resolveSanityExposure({sanity:50,intelligence:50,dailyStartSan:60,
  priorDailyLoss:10,lossOnFailure:1},seq(0,9));
 assert.equal(before.dailyLoss,11);
 assert.equal(before.indefiniteTriggered,false);
 const after=resolveSanityExposure({sanity:50,intelligence:50,dailyStartSan:60,
  priorDailyLoss:11,lossOnFailure:1},seq(0,9));
 assert.equal(after.dailyLoss,12);
 assert.equal(after.indefiniteTriggered,true);
});
test("zero SAN ends playable character and loss clamps to available SAN",()=>{
 const event=resolveSanityExposure({sanity:3,intelligence:80,dailyStartSan:3,
  lossOnFailure:10},seq(0,9));
 assert.equal(event.sanityAfter,0);
 assert.equal(event.lost,3);
 assert.equal(event.status,"permanent");
});
test("Mythos skill caps maximum SAN",()=>{
 assert.throws(()=>resolveSanityExposure({sanity:95,intelligence:65,mythosSkill:10,dailyStartSan:95}));
 const event=resolveSanityExposure({sanity:89,intelligence:65,mythosSkill:10,dailyStartSan:89,
  lossOnSuccess:0},seq(0,1));
 assert.equal(event.maxSanity,89);
});
test("normal player projection omits raw dice, values and hidden checks",()=>{
 const event=resolveSanityExposure({sanity:60,intelligence:60,dailyStartSan:60,
  lossOnSuccess:0},seq(0,1));
 const view=sanityPublicProjection(event);
 assert.ok(view.narrative.includes("investigator"));
 assert.equal(JSON.stringify(view).includes("sanityRoll"),false);
 assert.equal(JSON.stringify(view).includes("roll"),false);
});
test("reject malformed SAN events without rolling",()=>{
 assert.throws(()=>resolveSanityExposure({sanity:50,intelligence:60,dailyStartSan:50,lossOnFailure:"7d100"}));
 assert.throws(()=>resolveSanityExposure({sanity:50,intelligence:60,dailyStartSan:10}));
 assert.throws(()=>resolveSanityExposure({sanity:50,intelligence:60,dailyStartSan:50,priorDailyLoss:-5}));
});
