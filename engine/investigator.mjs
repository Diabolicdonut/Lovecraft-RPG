/*
 * Black Meridian CoC-002 — provisional numerical investigator profile.
 * This is a sample sheet, NOT complete 7e character generation or an official occupation template.
 * The original v0.8.x investigator remains untouched for legacy saves.
 */
import {thresholds} from "./coc7.mjs";

export const COC_ATTRIBUTES = Object.freeze(["STR","CON","SIZ","DEX","APP","INT","POW","EDU"]);
export const COC_SKILL_DEFAULTS = Object.freeze({
 "Accounting":5,"Anthropology":1,"Appraise":5,"Archaeology":1,"Art/Craft":5,
 "Charm":15,"Climb":20,"Credit Rating":0,"Cthulhu Mythos":0,"Disguise":5,"Dodge":20,
 "Drive Auto":20,"Electrical Repair":10,"Fast Talk":5,"Fighting (Brawl)":25,
 "Firearms (Handgun)":20,"First Aid":30,"History":5,"Intimidate":15,"Jump":20,
 "Language (Own)":40,"Law":5,"Library Use":20,"Listen":20,"Locksmith":1,
 "Mechanical Repair":10,"Medicine":1,"Natural World":10,"Navigate":10,
 "Occult":5,"Persuade":10,"Pilot":1,"Psychology":10,"Ride":5,
 "Science":1,"Sleight of Hand":10,"Spot Hidden":25,"Stealth":20,
 "Survival":10,"Swim":20,"Throw":20,"Track":10
});
const SKILL_NAMES=Object.keys(COC_SKILL_DEFAULTS);
// Temporary mapping is strict: unsupported original actions FAIL CLOSED.
// A future interpreter should choose CoC skills directly using bounded enums.
const LEGACY_TO_COC = Object.freeze({
 observation:"Spot Hidden",research:"Library Use",
 persuasion:"Persuade",deception:"Fast Talk",
 stealth:"Stealth",technical:"Mechanical Repair"
});
const RISK_MAP = Object.freeze({routine:"regular",favorable:"regular",
 uncertain:"regular",difficult:"hard",extreme:"extreme"});

export function createPrototypeInvestigator() {
 const attributes={STR:50,CON:55,SIZ:60,DEX:60,APP:55,INT:70,POW:60,EDU:75};
 const skills={...COC_SKILL_DEFAULTS,
  "Library Use":70,"Spot Hidden":65,"Listen":55,"Persuade":55,
  "Fast Talk":45,"Psychology":50,"Stealth":45,"Mechanical Repair":35,
  "History":55,"Occult":35,"Dodge":30,"Language (Own)":75};
 return validateInvestigator({
  schema:1,origin:"provisional-example",name:"Prototype Investigator",occupation:"Independent Investigator",
  age:34,attributes,skills,luck:50,hitPoints:11,sanity:60,magicPoints:12,
  backstory:"Prototype values for testing the hidden resolution engine; not a complete rules-created character.",
  inventory:[]
 });
}
function checkInt(v,name,min,max) {
 if (!Number.isSafeInteger(v)||v<min||v>max) throw new RangeError(name+" must be "+min+".."+max);
 return v;
}
export function validateInvestigator(candidate) {
 if(!candidate||typeof candidate!=="object"||Array.isArray(candidate))throw new TypeError("investigator required");
 if(candidate.schema!==1) throw new RangeError("unrecognized investigator schema");
 const name=String(candidate.name||"").trim();
 const occupation=String(candidate.occupation||"").trim();
 if(!name||name.length>100||!occupation||occupation.length>100) throw new Error("invalid investigator identity");
 checkInt(candidate.age,"age",15,120);
 const attributes={};
 for(const key of COC_ATTRIBUTES) attributes[key]=checkInt(candidate.attributes?.[key],key,1,100);
 const skills={};
 for(const key of SKILL_NAMES) skills[key]=checkInt(candidate.skills?.[key],key,0,1000);
 const maxHP=Math.floor((attributes.CON+attributes.SIZ)/10);
 const maxMP=Math.floor(attributes.POW/5);
 checkInt(candidate.hitPoints,"hitPoints",0,maxHP);
 checkInt(candidate.magicPoints,"magicPoints",0,maxMP);
 checkInt(candidate.sanity,"sanity",0,99-skills["Cthulhu Mythos"]);
 checkInt(candidate.luck,"luck",0,99);
 if(!Array.isArray(candidate.inventory)||candidate.inventory.length>100) throw Error("invalid inventory");
 return Object.freeze({
  schema:1,origin:String(candidate.origin||"custom"),name,occupation,age:candidate.age,
  attributes:Object.freeze(attributes),skills:Object.freeze(skills),luck:candidate.luck,
  hitPoints:candidate.hitPoints,maxHitPoints:maxHP,sanity:candidate.sanity,
  maxSanity:99-skills["Cthulhu Mythos"],magicPoints:candidate.magicPoints,
  maxMagicPoints:maxMP,backstory:String(candidate.backstory||"").slice(0,3000),
  inventory:Object.freeze(candidate.inventory.filter(v=>typeof v==="string").slice(0,100))
 });
}
export function cocSkillForLegacy(interp) {
 if (!interp||typeof interp!=="object")throw new TypeError("action required");
 if(!["observe","research","social","stealth","technical"].includes(interp.actionType))
   throw new Error("This action category is not supported by CoC preview mode yet");
 if(interp.targetType==="none")throw new Error("Target is not established in the public scene");
 const key=LEGACY_TO_COC[interp.skill];
 if(!key)throw new Error("No verified CoC mapping for this action");
 return key;
}
export function apparentDifficulty(interp) {
 const level=RISK_MAP[interp?.difficulty];
 if(!level)throw new Error("Unknown apparent difficulty");
 return level;
}
export function describeChances(value,difficulty) {
 const threshold=thresholds(value)[difficulty];
 if (!Number.isInteger(threshold)) throw new Error("invalid difficulty");
 const competence=value>=80?"Expert":value>=60?"Skilled":value>=40?"Practiced":value>=20?"Developing":"Untrained";
 const chance=threshold>=85?"Very likely":threshold>=65?"Likely":threshold>=40?"Uncertain":
   threshold>=20?"Unlikely":"Very unlikely";
 return Object.freeze({competence,chance,qualification:"Based on visible circumstances; hidden opposition may alter the outcome."});
}
export function previewAction(investigator,interp) {
 const actor=validateInvestigator(investigator);
 const skill=cocSkillForLegacy(interp);
 const difficulty=apparentDifficulty(interp);
 return Object.freeze({
  skill, difficulty, value:actor.skills[skill],
  ...describeChances(actor.skills[skill],difficulty)
 });
}
export function difficultyFromHiddenClues(interp,hiddenClues=[]) {
 const severity={routine:0,favorable:0,uncertain:0,difficult:1,extreme:2};
 if(!Array.isArray(hiddenClues))throw new TypeError("hidden clues must be array");
 const all=[interp.difficulty,...hiddenClues.map(c=>c.difficulty)];
 if(all.some(d=>!(d in severity)))throw new Error("Unrecognized hidden difficulty");
 const top=Math.max(...all.map(x=>severity[x]));
 return ["regular","hard","extreme"][top];
}
/** Legacy case UI adapter, NOT a replacement roll: retains clue presentation only. */
export function outcomeForLegacyDiscovery(checkResult) {
 if(checkResult.success){
  if(["critical","extreme","hard"].includes(checkResult.level))
    return checkResult.level==="critical"?"Exceptional Success":"Strong Success";
  return "Success";
 }
 return checkResult.level==="fumble"?"Severe Failure":"Failure";
}
