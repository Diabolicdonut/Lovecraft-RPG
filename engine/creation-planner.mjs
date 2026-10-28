/*
 * Black Meridian COC-005: 7e creation draft and pool-based allocation.
 * Reference: Keeper Rulebook 7e Ch.3; Investigator Handbook 7e Ch.3.
 * Original occupation templates, no reproduction of published prose.
 */
import {COC_SKILL_DEFAULTS,validateInvestigator} from "./investigator.mjs";
import {ARCHETYPES} from "./character-creation.mjs";
export const DEFAULT_AGE=27;
const AGE_TABLE=Object.freeze([
 {max:19,edu:0,physical:5,app:0,minor:true},
 {max:39,edu:1,physical:0,app:0},
 {max:49,edu:2,physical:5,app:5},
 {max:59,edu:3,physical:10,app:10},
 {max:69,edu:4,physical:20,app:15},
 {max:79,edu:4,physical:40,app:20},
 {max:89,edu:4,physical:80,app:25}
]);
export const PLANNER_OCCUPATIONS=Object.freeze(ARCHETYPES);
function int(v,name,min,max){
 if(!Number.isSafeInteger(v)||v<min||v>max)throw new RangeError(name+" must be "+min+".."+max);
 return v;
}
function rng() {
 if(!globalThis.crypto?.getRandomValues) throw Error("Secure character dice unavailable");
 const a=new Uint32Array(1);globalThis.crypto.getRandomValues(a);return a[0]/4294967296;
}
function roll(sides,random){
 const f=random();
 if(!Number.isFinite(f)||f<0||f>=1)throw RangeError("Bad random value");
 return Math.floor(f*sides)+1;
}
function rollSum(count,sides,random){
 let total=0;for(let i=0;i<count;i++)total+=roll(sides,random);return total;
}
function normalizedAge(age){
 int(age,"age",15,89);
 return AGE_TABLE.find(x=>age<=x.max);
}
function allocatePhysicalLoss(attributes,amount,primary){
 if(!["STR","CON","DEX"].includes(primary))throw RangeError("Invalid chosen aging attribute");
 const choices=[primary,...["STR","CON","DEX"].filter(x=>x!==primary)];
 let remain=amount;
 for(const key of choices){
  const taken=Math.min(attributes[key],remain);
  attributes[key]-=taken;remain-=taken;
 }
 if(remain)throw Error("Aging reduction exceeds total physical attributes");
}
export function rollCreationDraft({name="New Investigator",occupation="Archivist",age=DEFAULT_AGE,
  backstory="",agingAttribute="STR",minorLossAttribute="STR",random=rng}={}){
 const id=String(name).trim();
 if(!id||id.length>100)throw Error("Investigator name required");
 const archetype=PLANNER_OCCUPATIONS[occupation];
 if(!archetype)throw RangeError("Unsupported occupation");
 const rule=normalizedAge(age);
 const attributes={};
 for(const k of ["STR","CON","DEX","APP","POW"])attributes[k]=rollSum(3,6,random)*5;
 for(const k of ["SIZ","INT","EDU"])attributes[k]=(rollSum(2,6,random)+6)*5;
 let luck=rollSum(3,6,random)*5;
 if(rule.minor){
  if(!["STR","SIZ"].includes(minorLossAttribute))throw RangeError("Younger age reduction must use STR or SIZ");
  attributes[minorLossAttribute]-=5;
  attributes.EDU-=5;
  luck=Math.max(luck,rollSum(3,6,random)*5);
 }else{
  for(let i=0;i<rule.edu;i++){
   if(roll(100,random)>attributes.EDU) attributes.EDU=Math.min(99,attributes.EDU+roll(10,random));
  }
  allocatePhysicalLoss(attributes,rule.physical,agingAttribute);
  attributes.APP=Math.max(0,attributes.APP-rule.app);
 }
 const baseSkills={...COC_SKILL_DEFAULTS,
  "Dodge":Math.floor(attributes.DEX/2),"Language (Own)":attributes.EDU};
 const occupationBudget=archetype.formula==="EDU4" ? attributes.EDU*4 :
   attributes.EDU*2+attributes.DEX*2;
 const personalBudget=attributes.INT*2;
 const occupationPoints={};
 const personalPoints={};
 for(const k of Object.keys(baseSkills)){occupationPoints[k]=0;personalPoints[k]=0;}
 // Ensure profession Credit Rating is reached from the occupational pool.
 const minimum=Math.max(0,archetype.credit[0]-baseSkills["Credit Rating"]);
 occupationPoints["Credit Rating"]=minimum;
 return validateCreationDraft({
  schema:1,name:id,occupation,age,backstory:String(backstory),
  agingAttribute,minorLossAttribute,attributes,luck,baseSkills,
  occupationBudget,personalBudget,occupationPoints,personalPoints
 });
}
export function validateCreationDraft(draft){
 if(!draft||typeof draft!=="object"||draft.schema!==1)throw Error("Unsupported creation draft");
 const profession=PLANNER_OCCUPATIONS[draft.occupation];
 if(!profession)throw Error("Unknown creation occupation");
 normalizedAge(draft.age);
 const attributes={};
 for(const k of ["STR","CON","SIZ","DEX","APP","INT","POW","EDU"])
   attributes[k]=int(draft.attributes?.[k],k,0,99);
 const b={...COC_SKILL_DEFAULTS,"Dodge":Math.floor(attributes.DEX/2),
   "Language (Own)":attributes.EDU};
 for(const [k,v] of Object.entries(b))if(draft.baseSkills?.[k]!==v)throw Error("Draft base skill mismatch "+k);
 const occupationBudget=profession.formula==="EDU4"?attributes.EDU*4:attributes.EDU*2+attributes.DEX*2;
 if(draft.occupationBudget!==occupationBudget||draft.personalBudget!==attributes.INT*2)
   throw Error("Creation point budget mismatch");
 const allowed=new Set(profession.skills);
 let occupationSpent=0,personalSpent=0;
 const occupationPoints={},personalPoints={};
 for(const key of Object.keys(b)){
  const o=int(draft.occupationPoints?.[key],key+" occupation",0,1000);
  const p=int(draft.personalPoints?.[key],key+" interests",0,1000);
  if(o&&!allowed.has(key))throw Error("Skill is not a current occupation skill: "+key);
  if(p&&(key==="Cthulhu Mythos"||key==="Credit Rating"))
   throw Error("This skill is not part of the allowed personal-interest pool");
  const total=b[key]+o+p;
  if(total>99)throw Error("Creation skill exceeds 99: "+key);
  if(key==="Credit Rating" && total>profession.credit[1])throw Error("Credit Rating outside profession range");
  occupationPoints[key]=o;personalPoints[key]=p;
  occupationSpent+=o;personalSpent+=p;
 }
 if(occupationSpent>occupationBudget||personalSpent>draft.personalBudget)
   throw Error("Creation points overspent");
 if(b["Credit Rating"]+occupationPoints["Credit Rating"]<profession.credit[0])
   throw Error("Credit Rating below occupation minimum");
 const id=String(draft.name||"").trim();
 if(!id||id.length>100)throw Error("Invalid name");
 int(draft.luck,"Luck",0,99);
 return {
  schema:1,name:id,occupation:draft.occupation,age:draft.age,
  backstory:String(draft.backstory||"").slice(0,3000),
  agingAttribute:draft.agingAttribute,minorLossAttribute:draft.minorLossAttribute,
  attributes,luck:draft.luck,baseSkills:b,occupationBudget,personalBudget,
  occupationPoints,personalPoints,occupationSpent,personalSpent,
  occupationRemaining:occupationBudget-occupationSpent,
  personalRemaining:personalBudget-personalSpent
 };
}
export function setCreationPoints(draft,{skill,pool,points}={}){
 const d=validateCreationDraft(draft);
 if(!Object.hasOwn(d.baseSkills,skill))throw Error("Unknown skill");
 if(!["occupation","personal"].includes(pool))throw Error("Unknown spending pool");
 int(points,"allocated points",0,1000);
 const next={...d,occupationPoints:{...d.occupationPoints},personalPoints:{...d.personalPoints}};
 next[pool==="occupation"?"occupationPoints":"personalPoints"][skill]=points;
 return validateCreationDraft(next);
}
export function autoAllocateRemaining(draft){
 let d=validateCreationDraft(draft);
 const occupation=PLANNER_OCCUPATIONS[d.occupation];
 for(const [pool,keys] of [
   ["occupation",occupation.skills.filter(k=>k!=="Credit Rating")],
   ["personal",Object.keys(d.baseSkills).filter(k=>k!=="Cthulhu Mythos"&&k!=="Credit Rating")]
 ]){
  let index=0,iterations=0;
  const remainingKey=pool==="occupation"?"occupationRemaining":"personalRemaining";
  while(d[remainingKey]>0){
   const skill=keys[index++%keys.length];
   const existing=d.baseSkills[skill]+d.occupationPoints[skill]+d.personalPoints[skill];
   if(existing<99)d=setCreationPoints(d,{skill,pool,points:d[pool==="occupation"?"occupationPoints":"personalPoints"][skill]+1});
   if(++iterations>100000)throw Error("Not enough legal skills for point pool");
  }
 }
 return d;
}
export function completeCreationDraft(draft){
 const d=validateCreationDraft(draft);
 if(d.occupationRemaining!==0||d.personalRemaining!==0)
   throw Error("Allocate every occupation and personal-interest point before finishing");
 const skills={};
 for(const skill of Object.keys(d.baseSkills))
   skills[skill]=d.baseSkills[skill]+d.occupationPoints[skill]+d.personalPoints[skill];
 return validateInvestigator({
  schema:1,origin:"generated-custom-15-89",
  name:d.name,occupation:d.occupation,age:d.age,
  attributes:d.attributes,luck:d.luck,skills,
  hitPoints:Math.floor((d.attributes.CON+d.attributes.SIZ)/10),
  sanity:d.attributes.POW,magicPoints:Math.floor(d.attributes.POW/5),
  backstory:d.backstory,inventory:[]
 });
}
