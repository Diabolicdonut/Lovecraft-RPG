/*
 * Black Meridian COC-006: isolated 7e Sanity-event arithmetic and state flags.
 * Authority: Keeper Rulebook 7e, Chapter 8 (Sanity).
 * NOT connected to live mystery events. Consequences, bouts, treatment
 * and fiction-specific sanity exposures require separate Keeper systems.
 */
import {check} from "./coc7.mjs";
function int(v,label,min,max){
 if(!Number.isSafeInteger(v)||v<min||v>max)throw RangeError(label+" must be "+min+".."+max);
 return v;
}
function secureRandom(){
 if(!globalThis.crypto?.getRandomValues)throw Error("Secure Sanity dice unavailable");
 const values=new Uint32Array(1);globalThis.crypto.getRandomValues(values);
 return values[0]/4294967296;
}
const DAMAGE_DICE=new Set([3,4,6,8,10,20]);
export function sanityLossAmount(spec,random=secureRandom){
 if(typeof spec==="number")return int(spec,"sanity points",0,100);
 if(typeof spec!=="string")throw TypeError("Sanity loss must be a static value or simple die");
 const match=/^([1-9])D(3|4|6|8|10|20)$/.exec(spec.toUpperCase());
 if(!match)throw RangeError("Unsupported Sanity loss dice");
 const count=int(Number(match[1]),"die count",1,9);
 const faces=Number(match[2]);
 if(!DAMAGE_DICE.has(faces))throw RangeError("Unsupported die type");
 let total=0;
 for(let i=0;i<count;i++){
  const n=random();
  if(!Number.isFinite(n)||n<0||n>=1)throw RangeError("Invalid random value");
  total+=Math.floor(n*faces)+1;
 }
 return total;
}
/**
 * An event must have a *preauthorized* source and its own pass/fail loss.
 * dailyStartSan must be the real SAN when the investigator began that day,
 * not the current SAN; priorDailyLoss is already recorded during the day.
 */
export function resolveSanityExposure({
 sanity, intelligence, mythosSkill=0, dailyStartSan, priorDailyLoss=0,
 lossOnSuccess=0,lossOnFailure="1D6"
}={},random=secureRandom){
 int(mythosSkill,"mythosSkill",0,99);
 const maxSanity=99-mythosSkill;
 int(sanity,"sanity",0,maxSanity);
 int(intelligence,"intelligence",0,100);
 int(dailyStartSan,"dailyStartSan",0,99);
 int(priorDailyLoss,"priorDailyLoss",0,999);
 if(dailyStartSan<sanity)throw RangeError("Daily starting Sanity cannot be below current value");
 // Validate specs before consuming any random dice.
 const isValidLoss=spec=>Number.isSafeInteger(spec)?spec>=0&&spec<=100:
  typeof spec==="string"&&/^([1-9])D(3|4|6|8|10|20)$/i.test(spec);
 if(!isValidLoss(lossOnSuccess)||!isValidLoss(lossOnFailure))throw RangeError("Invalid Sanity loss specification");
 const sanCheck=check({value:sanity},random);
 const amount=Math.min(sanity,sanityLossAmount(sanCheck.success?lossOnSuccess:lossOnFailure,random));
 const remaining=sanity-amount;
 const dailyLoss=priorDailyLoss+amount;
 let intCheck=null,temporary=false;
 if(amount>=5 && remaining>0){
  intCheck=check({value:intelligence},random);
  temporary=intCheck.success;
 }
 const indefinite=dailyStartSan>0 && dailyLoss>=Math.ceil(dailyStartSan/5);
 const status=remaining===0?"permanent":indefinite?"indefinite":temporary?"temporary":"stable";
 return Object.freeze({
  sanityBefore:sanity, sanityAfter:remaining,maxSanity,
  lost:amount,dailyStartSan,priorDailyLoss,dailyLoss,
  sanityRoll:sanCheck,intelligenceRoll:intCheck,status,
  temporaryTriggered:temporary,indefiniteTriggered:indefinite
 });
}
export function sanityPublicProjection(result) {
 if(!result||!["stable","temporary","indefinite","permanent"].includes(result.status))
  throw TypeError("Resolved Sanity event required");
 const terms={
  stable:"The investigator remains in control, though the experience may leave its mark.",
  temporary:"The investigator is briefly overcome and needs Keeper adjudication.",
  indefinite:"The investigator is overwhelmed; extended Keeper adjudication is required.",
  permanent:"The investigator can no longer continue as a playable investigator."
 };
 return Object.freeze({condition:result.status,narrative:terms[result.status]});
}
