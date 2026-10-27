/*
 * Black Meridian: isolated Call of Cthulhu 7e percentile mechanics, checkpoint COC-001.
 * This module is not connected to the legacy v0.8.1 game.
 * See docs/COC-7E-RULES-COVERAGE.md for authority, scope and remaining gaps.
 */
const LEVEL = Object.freeze({fumble:0, failure:1, regular:2, hard:3, extreme:4, critical:5});
const DIFFICULTY = new Set(["regular","hard","extreme"]);
function int(value,label,min,max) {
  if (!Number.isSafeInteger(value) || value<min || value>max)
    throw new RangeError(label+" must be an integer "+min+".."+max);
  return value;
}
function secureFraction() {
  if (!globalThis.crypto?.getRandomValues) throw new Error("Secure randomness unavailable; no weak fallback");
  const values=new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0]/4294967296;
}
function die(sides,random) {
  if (typeof random!=="function") throw new TypeError("random source required");
  const n=random();
  if (!Number.isFinite(n)||n<0||n>=1) throw new RangeError("random must return [0,1)");
  return Math.floor(n*sides);
}
export function thresholds(value) {
  int(value,"value",0,1000);
  return Object.freeze({regular:value,hard:Math.floor(value/2),extreme:Math.floor(value/5)});
}
export function classify({value,roll,difficulty="regular"}) {
  const all=thresholds(value);
  int(roll,"roll",1,100);
  if (!DIFFICULTY.has(difficulty)) throw new RangeError("unsupported difficulty");
  const required=all[difficulty];
  let level;
  if (roll===100 || (required<50 && roll>=96)) level="fumble";
  else if (roll===1) level="critical";
  else if (roll>value) level="failure";
  else if (roll<=all.extreme) level="extreme";
  else if (roll<=all.hard) level="hard";
  else level="regular";
  const success=level==="critical" || LEVEL[level]>=LEVEL[difficulty];
  return Object.freeze({value,roll,difficulty,required,thresholds:all,level,rank:LEVEL[level],success});
}
export function rollPercentile({bonusDice=0,penaltyDice=0}={},random=secureFraction) {
  int(bonusDice,"bonusDice",0,2);
  int(penaltyDice,"penaltyDice",0,2);
  const net=bonusDice-penaltyDice;
  const units=die(10,random);
  const tens=Array.from({length:1+Math.abs(net)},()=>die(10,random)*10);
  const candidates=tens.map(t=>t+units || 100);
  const roll=net>0?Math.min(...candidates):net<0?Math.max(...candidates):candidates[0];
  return Object.freeze({roll,bonusDice,penaltyDice,units,tens:Object.freeze(tens),candidates:Object.freeze(candidates)});
}
export function check({value,difficulty="regular",bonusDice=0,penaltyDice=0}={},random=secureFraction) {
  thresholds(value);
  if (!DIFFICULTY.has(difficulty)) throw new RangeError("unsupported difficulty");
  int(bonusDice,"bonusDice",0,2);
  int(penaltyDice,"penaltyDice",0,2);
  const dice=rollPercentile({bonusDice,penaltyDice},random);
  return Object.freeze({...classify({value,roll:dice.roll,difficulty}),dice,pushed:false,usedLuck:false});
}
/** General opposed checks, not combat tie-breaking rules. */
export function opposed({actor,opponent}={},random=secureFraction) {
  if (!actor||!opponent) throw new TypeError("actor/opponent required");
  const a=check({...actor,difficulty:"regular"},random);
  const b=check({...opponent,difficulty:"regular"},random);
  let winner="tie";
  if (a.rank>b.rank) winner="actor";
  else if (b.rank>a.rank) winner="opponent";
  else if (a.value>b.value) winner="actor";
  else if (b.value>a.value) winner="opponent";
  return Object.freeze({actor:a,opponent:b,winner,
    winningActionSucceeds:winner!=="tie"&&(winner==="actor"?a.success:b.success)});
}
/** New approach, noncombat context and explicit permission required. */
export function push({initial,changedApproach,authorized,context="noncombat"}={},random=secureFraction) {
  if (!initial||typeof initial!=="object") throw new TypeError("initial result required");
  if (initial.success||initial.pushed||initial.usedLuck||context!=="noncombat")
    throw new Error("Roll cannot be pushed");
  if (authorized!==true||typeof changedApproach!=="string"||changedApproach.trim().length<3)
    throw new Error("Informed player choice required");
  const later=check({value:initial.value,difficulty:initial.difficulty,
    bonusDice:initial.dice.bonusDice,penaltyDice:initial.dice.penaltyDice},random);
  return Object.freeze({...later,pushed:true,previous:initial});
}
/** Optional Luck adjustment; caller must transactionally deduct points after consent. */
export function spendLuck({initial,available,consent,rollKind="skill"}={}) {
  if (!initial||typeof initial!=="object") throw new TypeError("initial result required");
  int(available,"available",0,1000);
  if (consent!==true) throw new Error("Player permission required");
  if (!["skill","characteristic"].includes(rollKind)) throw new Error("Luck barred on this kind of roll");
  if (initial.pushed||initial.usedLuck||initial.level==="critical"||initial.level==="fumble")
    throw new Error("Luck barred on this result");
  if (initial.success) throw new Error("Roll already successful");
  const cost=initial.roll-initial.required;
  if (cost<1||cost>available) throw new Error("Insufficient Luck");
  const adjusted=classify({value:initial.value,roll:initial.required,difficulty:initial.difficulty});
  if (!adjusted.success) throw new Error("Invalid Luck adjustment");
  return Object.freeze({...adjusted,usedLuck:true,luckSpent:cost,luckRemaining:available-cost,
    originalRoll:initial.roll,pushed:false});
}
/** Only sanitized facts flow to the normal player-facing narration layer. */
export function playerOutcome(result,{knownConsequence=""}={}) {
  if (!result||typeof result.success!=="boolean") throw new TypeError("resolved check required");
  const view={outcome:result.success?"achieved":"not-achieved"};
  if (knownConsequence) view.consequence=String(knownConsequence);
  return Object.freeze(view);
}
