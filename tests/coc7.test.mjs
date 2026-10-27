import test from "node:test";
import assert from "node:assert/strict";
import {thresholds,classify,rollPercentile,check,opposed,push,spendLuck,playerOutcome} from "../engine/coc7.mjs";
const seq=(...values)=>{const q=[...values];return ()=>{if(!q.length) throw Error("RNG exhausted");return q.shift()/10+0.01;}};
test("thresholds floor half/fifth, advanced ratings and invalid inputs",()=>{
  assert.deepEqual(thresholds(75),{regular:75,hard:37,extreme:15});
  assert.deepEqual(thresholds(101),{regular:101,hard:50,extreme:20});
  assert.throws(()=>thresholds(-1),RangeError);assert.throws(()=>thresholds(42.5),RangeError);
});
test("success tiers are correctly ordered, 01 is critical and 100 fumbles",()=>{
  for(const [r,level] of [[1,"critical"],[12,"extreme"],[35,"hard"],[55,"regular"],[80,"failure"],[100,"fumble"]])
    assert.equal(classify({value:75,roll:r}).level,level);
  assert.equal(classify({value:75,roll:55,difficulty:"hard"}).success,false);
  assert.equal(classify({value:75,roll:35,difficulty:"hard"}).success,true);
  assert.equal(classify({value:75,roll:12,difficulty:"extreme"}).success,true);
  assert.equal(classify({value:75,roll:35,difficulty:"extreme"}).success,false);
  assert.equal(classify({value:0,roll:1}).level,"critical");
});
test("fumble threshold uses the required difficulty, not the base value",()=>{
  assert.equal(classify({value:75,roll:96,difficulty:"regular"}).level,"failure");
  assert.equal(classify({value:75,roll:96,difficulty:"hard"}).level,"fumble");
  assert.equal(classify({value:50,roll:96}).level,"failure");
  assert.equal(classify({value:49,roll:96}).level,"fumble");
  assert.equal(classify({value:120,roll:100}).level,"fumble");
});
test("percentile 00 and 0 means 100; 00 and 5 means 5",()=>{
  assert.equal(rollPercentile({},seq(0,0)).roll,100);
  assert.equal(rollPercentile({},seq(5,0)).roll,5);
});
test("bonus and penalty choose complete percentile result, then cancel",()=>{
  assert.equal(rollPercentile({bonusDice:1},seq(0,0,1)).roll,10);
  assert.equal(rollPercentile({penaltyDice:1},seq(0,0,1)).roll,100);
  assert.equal(rollPercentile({bonusDice:2},seq(6,8,3,0)).roll,6);
  assert.equal(rollPercentile({penaltyDice:2},seq(6,8,3,0)).roll,86);
  assert.equal(rollPercentile({bonusDice:1,penaltyDice:1},seq(3,2)).roll,23);
  assert.throws(()=>rollPercentile({bonusDice:3}),RangeError);
});
test("reject faulty random source or invalid difficulty",()=>{
  assert.throws(()=>rollPercentile({},()=>1),RangeError);
  assert.throws(()=>rollPercentile({},()=>-0.01),RangeError);
  assert.throws(()=>check({value:50,difficulty:"trivial"}),RangeError);
});
test("opposition: degree then value, never turn two failures into success",()=>{
  const a=opposed({actor:{value:80},opponent:{value:90}},seq(5,5,5,6));
  assert.equal(a.winner,"opponent");assert.equal(a.winningActionSucceeds,true);
  const b=opposed({actor:{value:80},opponent:{value:90}},seq(0,3,0,6));
  assert.equal(b.winner,"actor");
  const c=opposed({actor:{value:30},opponent:{value:40}},seq(0,9,0,9));
  assert.equal(c.winner,"opponent");assert.equal(c.winningActionSucceeds,false);
  const d=opposed({actor:{value:70},opponent:{value:70}},seq(5,2,5,2));
  assert.equal(d.winner,"tie");
});
test("push requires failed first attempt, new approach, player consent and noncombat",()=>{
  const initial=check({value:35},seq(0,8));
  assert.equal(initial.success,false);
  assert.throws(()=>push({initial,authorized:false,changedApproach:"Take extra time"}));
  const result=push({initial,authorized:true,changedApproach:"Spend more time checking the lock"},seq(5,1));
  assert.equal(result.pushed,true);assert.equal(result.success,true);
  assert.throws(()=>push({initial:result,authorized:true,changedApproach:"Again"},seq(1,1)));
  assert.throws(()=>push({initial,authorized:true,changedApproach:"Try",context:"combat"},seq(1,1)));
});
test("Luck adjustment is opt-in, exact-shortfall, and blocked on forbidden rolls",()=>{
  const initial=check({value:60,difficulty:"hard"},seq(5,3));
  assert.equal(initial.required,30);
  assert.throws(()=>spendLuck({initial,available:80,consent:false}));
  const changed=spendLuck({initial,available:10,consent:true});
  assert.equal(changed.luckSpent,5);assert.equal(changed.luckRemaining,5);assert.equal(changed.success,true);
  assert.throws(()=>spendLuck({initial,available:4,consent:true}));
  assert.throws(()=>spendLuck({initial,available:10,consent:true,rollKind:"sanity"}));
  const fumble=check({value:20},seq(0,0));
  assert.throws(()=>spendLuck({initial:fumble,available:100,consent:true}));
});
test("player outcome excludes secret die, skill value and target",()=>{
  assert.deepEqual(playerOutcome(check({value:55},seq(5,4))),{outcome:"achieved"});
});
test("seeded statistical smoke check preserves 25% < 75% probabilities",()=>{
  let state=0xdecafbad;
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const sample=value=>Array.from({length:10000},()=>check({value},random).success).filter(Boolean).length;
  const low=sample(25),high=sample(75);
  assert.ok(low>1800&&low<3200,"25% sample "+low);
  assert.ok(high>6800&&high<8200,"75% sample "+high);
});
