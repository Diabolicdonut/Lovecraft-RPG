import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const original=html.match(/<script>([\s\S]*?)<\/script>/);
test("entire browser application inline script compiles on Node V8",()=>{
 assert.ok(original,"inline game script");
 assert.doesNotThrow(()=>new vm.Script(original[1],{filename:"index.html"}));
});
test("version, status widget and scenario generation retained",()=>{
 assert.match(html,/const APP_VERSION = "0\.8\.4";/);
 assert.match(html,/site-progress\.js/);
 assert.match(html,/async function createPremiseContract/);
 assert.match(html,/const MYSTERY_SCHEMA =/);
 assert.match(html,/function renderCaseSummary/);
});
test("CoC demo sheet is on-demand and never silently derived from legacy stats",()=>{
 assert.match(html,/id="cocSheetButton"/);
 assert.match(html,/id="cocSheetDetails"/);
 assert.match(html,/createPrototypeInvestigator\(\)/);
 assert.match(html,/validateInvestigator\(game\.coc\.investigator\)/);
 assert.match(html,/state\.coc=\{mode:"legacy",investigator:null\}/);
 assert.match(html,/game = migrateGameState\(parsed\)/);
});
test("opt-in mode is explicit and gates unsupported CoC actions",()=>{
 assert.match(html,/id="cocModeButton"/);
 assert.match(html,/hasCocMode\(\)/);
 assert.match(html,/modules\.investigator\.previewAction/);
 assert.match(html,/modules\.kernel\.check/);
 assert.match(html,/outcomeForLegacyDiscovery\(cocResolution\)/);
});
test("CoC pilot does not use legacy raw percentile resolution",()=>{
 assert.match(html,/const roll=deterministicMove\|\|hasCocMode\(\)\?null:cryptoD100\(\)/);
 assert.match(html,/if\(hasCocMode\(\) && !deterministicMove\)/);
 assert.match(html,/if\(hasCocMode\(\)!==Boolean\(currentAssessment\.pilot\)/);
});
test("CoC action UI obscures dice and does not use generic success labels",()=>{
 assert.match(html,/hasCocMode\(\) \? "CoC result recorded privately/);
 assert.match(html,/addEntry\("narrator", "Keeper", narration\)/);
 assert.match(html,/item\.cocPilot \? "Keeper" : item\.outcome/);
 assert.match(html,/Action resolved ·/);
});

test("COC-003: generated character form, direct CoC schema and overt consent are present",()=>{
 assert.match(html,/id="cocGenerateButton"/);
 assert.match(html,/id="cocOccupationInput"/);
 assert.match(html,/id="cocAgeInput"/);
 assert.match(html,/character-creation\.mjs/);
 assert.match(html,/const actionSchema=pilotSchema/);
 assert.match(html,/enum:Object\.keys\(pilotModules\.investigator\.COC_SKILL_DEFAULTS\)/);
 assert.match(html,/requestOvertCocDecision/);
 assert.match(html,/modules\.kernel\.spendLuck/);
 assert.match(html,/modules\.kernel\.push/);
 assert.match(html,/cocResolution\.level!=="fumble"/);
 assert.match(html,/optionalLuck/);
});
test("CoC resolution locks import, reset, creation and mode switches while awaiting choice",()=>{
 assert.match(html,/cocGenerateButton","cocEditButton","cocLuckOptional","resetButton","importButton"/);
 assert.match(html,/if\(cocChoice==="push" && !cocResolution.success\)/);
 assert.match(html,/The second attempt failed/);
});

test("overt push and Luck chooser is visible beside action composer",()=>{
 const composer=html.indexOf('id="playerInput"');
 const chooser=html.indexOf('id="cocDecisionPanel"');
 const commit=html.indexOf('id="commitButton"');
 assert.ok(composer>=0&&chooser>composer&&commit>chooser);
 assert.match(html,/panel\.scrollIntoView/);
});

test("COC-005 custom creation is accessible and retains serialized point ledger",()=>{
 assert.match(html,/id="cocCustomizeButton"/);
 assert.match(html,/id="cocDraftDetails"/);
 assert.match(html,/id="cocDraftEditor"/);
 assert.match(html,/id="cocAutoPointsButton"/);
 assert.match(html,/id="cocFinalizeButton"/);
 assert.match(html,/engine\/creation-planner\.mjs/);
 assert.match(html,/createCocActorSafely\(\)\.creationDraft=draft/);
 assert.match(html,/setCreationPoints\(game\.coc\.creationDraft/);
 assert.match(html,/completeCreationDraft\(game\.coc\.creationDraft\)/);
 assert.match(html,/cocModeButton"\)\.disabled/);
});
