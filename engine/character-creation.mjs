/*
 * COC-003: character generation for two original 1920s investigator archetypes.
 * Rules authority: CoC 7e Keeper Ch.3 and Investigator Handbook Ch.3.
 * Narrow scope: adult age 20–39; no claim of all official occupations/ages.
 * Character creation dice are independent from later secret task rolls.
 */
import {COC_SKILL_DEFAULTS,validateInvestigator} from "./investigator.mjs";

export const ARCHETYPES=Object.freeze({
 "Archivist":Object.freeze({
   formula:"EDU4",credit:[9,35],
   skills:Object.freeze(["Credit Rating","Library Use","History","Language (Own)",
     "Spot Hidden","Appraise","Accounting","Occult"])
 }),
 "Field Investigator":Object.freeze({
   formula:"EDU2DEX2",credit:[9,30],
   skills:Object.freeze(["Credit Rating","Spot Hidden","Psychology","Library Use",
     "Stealth","Listen","Law","Persuade"])
 }),
 "Newspaper Reporter":Object.freeze({
   formula:"EDU4",credit:[9,30],
   skills:Object.freeze(["Credit Rating","History","Library Use","Language (Own)",
     "Psychology","Fast Talk","Spot Hidden","Art/Craft"])
 }),
 "Laboratory Researcher":Object.freeze({
   formula:"EDU4",credit:[9,45],
   skills:Object.freeze(["Credit Rating","Library Use","Science",
     "Electrical Repair","Mechanical Repair","Medicine","Spot Hidden","History"])
 })
});
const INTEREST_SKILLS=Object.freeze(["First Aid","Navigate","Locksmith","Track","Natural World","Charm","Drive Auto","Fighting (Brawl)"]);
function dice(sides,random){
 if(typeof random!=="function")throw new TypeError("random required");
 const n=random();
 if(!Number.isFinite(n)||n<0||n>=1)throw new RangeError("random must be in [0,1)");
 return Math.floor(n*sides)+1;
}
function rollSum(n,sides,random){let result=0;for(let i=0;i<n;i++)result+=dice(sides,random);return result;}
function secureRandom(){
 if(!globalThis.crypto?.getRandomValues)throw new Error("Secure dice unavailable");
 const a=new Uint32Array(1);globalThis.crypto.getRandomValues(a);return a[0]/4294967296;
}
function spendPool(skills,choices,pool,minimums={},random=secureRandom){
 const assigned={};
 for(const skill of choices)assigned[skill]=0;
 for(const [skill,amount] of Object.entries(minimums)){
   if(!choices.includes(skill))throw new Error("minimum outside skill pool");
   assigned[skill]+=amount;pool-=amount;
 }
 if(pool<0)throw new Error("Insufficient occupation points for required Credit Rating");
 // Round-robin seeded priority for distinct builds; cap ratings at 99.
 const priority=[...choices].sort(()=>0);
 const offset=dice(priority.length,random)-1;
 const ordered=priority.slice(offset).concat(priority.slice(0,offset));
 let pos=0;
 while(pool>0){
   const skill=ordered[pos%ordered.length];pos++;
   if((skills[skill]||0)+assigned[skill]>=99){
     if(ordered.every(key=>(skills[key]||0)+assigned[key]>=99))throw new Error("Not enough eligible skills for pool");
     continue;
   }
   assigned[skill]++;pool--;
 }
 return assigned;
}
export function rollCharacteristics({age=27,random=secureRandom}={}){
 if(!Number.isInteger(age)||age<20||age>39)throw new RangeError("This generator currently covers age 20–39");
 const a={};
 for(const skill of ["STR","CON","DEX","APP","POW"])a[skill]=rollSum(3,6,random)*5;
 for(const skill of ["SIZ","INT","EDU"])a[skill]=(rollSum(2,6,random)+6)*5;
 // 20–39: one EDU improvement check, on a failed roll increases by 1D10.
 if(dice(100,random)>a.EDU)a.EDU=Math.min(99,a.EDU+dice(10,random));
 return {attributes:a,luck:rollSum(3,6,random)*5,age};
}
export function occupationBudget(attributes,archetype){
 const t=ARCHETYPES[archetype];
 if(!t)throw new RangeError("Unknown occupation archetype");
 return t.formula==="EDU4"?attributes.EDU*4:attributes.EDU*2+attributes.DEX*2;
}
export function createInvestigator({
 name="New Investigator",occupation="Archivist",age=27,
 backstory="",random=secureRandom
}={}){
 const identity=String(name).trim();
 if(!identity||identity.length>100)throw new Error("Investigator name required");
 const t=ARCHETYPES[occupation];
 if(!t)throw new Error("Choose a supported occupation");
 const {attributes,luck}=rollCharacteristics({age,random});
 const skills={...COC_SKILL_DEFAULTS,"Dodge":Math.floor(attributes.DEX/2),
   "Language (Own)":attributes.EDU};
 const budget=occupationBudget(attributes,occupation);
 const occupationAssigned=spendPool(skills,t.skills,budget,{"Credit Rating":t.credit[0]},random);
 for(const [skill,points] of Object.entries(occupationAssigned))skills[skill]+=points;
 const interests=spendPool(skills,INTEREST_SKILLS,attributes.INT*2,{},random);
 for(const [skill,points] of Object.entries(interests))skills[skill]+=points;
 if(skills["Credit Rating"]>t.credit[1]){
   // Reassign surplus credits to other occupation skills (no points lost).
   const extra=skills["Credit Rating"]-t.credit[1];
   skills["Credit Rating"]=t.credit[1];
   const candidates=t.skills.filter(s=>s!=="Credit Rating");
   let remainder=extra;
   for(const skill of candidates){
     const move=Math.min(remainder,99-skills[skill]);skills[skill]+=move;remainder-=move;
     if(!remainder)break;
   }
   if(remainder)throw Error("Occupation point allocation failed");
 }
 const investigator=validateInvestigator({
  schema:1,origin:"generated-20-39",name:identity,occupation,age,
  attributes,skills,luck,hitPoints:Math.floor((attributes.CON+attributes.SIZ)/10),
  sanity:attributes.POW,magicPoints:Math.floor(attributes.POW/5),backstory,inventory:[]
 });
 return investigator;
}
export function renameInvestigator(actor,{name,backstory}={}){
 const valid=validateInvestigator(actor);
 const edited={...valid,name:name===undefined?valid.name:String(name).trim(),
   backstory:backstory===undefined?valid.backstory:String(backstory)};
 return validateInvestigator(edited);
}
