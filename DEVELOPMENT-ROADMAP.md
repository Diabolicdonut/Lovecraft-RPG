# BLACK MERIDIAN — DEVELOPMENT ROADMAP

**Roadmap revision:** R1 (2026-10-27) · **Game build:** v0.8.2 (CoC pilot opt-in) · **Repository:** `Diabolicdonut/Lovecraft-RPG` · **Authoritative branch:** `main`

> This is the governing **entire-product scope and milestone acceptance contract**. `site-progress.json` is its machine-readable progress ledger; `ROADMAP-COVERAGE.md` is a compact derived summary. No old generic probability mechanism is a target architecture. Older audit entries are historical, not an alternative specification.

## 1. End-state vision

Black Meridian is a browser-based, primarily single-player, investigator-led Lovecraftian horror RPG. A virtual Keeper generates, runs and remembers coherent adventures and campaigns while an independently tested rules engine uses **Chaosium Call of Cthulhu 7th Edition** as the intended reference. Users act in normal language; gameplay is immersive and mostly diegetic. The Keeper chooses when rules apply, but does **not** choose favorable die results or rewrite the resolved state. Investigators, inventory, clues and consequences persist.

The player may inspect a **full, accurate investigator sheet** at any time and may understand how capable the investigator is, the apparent likelihood of an action, known danger and the stakes of pushing. **All dice, targets, opposed calculations, damage math and hidden Keeper checks stay behind the screen during ordinary play.** An appropriate task preview may say \"likely\" or \"risky\" and why; it must not reveal hidden enemies, discoveries or exact secret thresholds. No routine button-press to roll. Pushed attempts, dangerous commitments and Luck spending follow explicit or previously selected player consent rules.

Narrative text and optional HTML graphics are views of *one* authoritative world model: scenes, map zones, positions, routes, time, weather, NPCs and access/knowledge. The map is an aid, not a mandatory tactical game. Optional ambient music and effects may be added later; silence and plain-text play remain first-class. Mystery pacing alternates investigation, unease, danger, discovery and consequences rather than constant combat or predetermined jump scares.

## 2. Scope and boundaries

- **Preserve:** current title/feel, connection flow, user-provided or surprise premises, schema preflight and coherence QA, fixed secret truth, player/keeper knowledge partition, clue list, NPC public identity/locations, dialogue, state save/export and debug isolation, AI narration, Cloudflare token/API proxy.
- **Replace, not hybridize:** generic capability ratings, custom confidence dice/math, old six-tier resolution and prototype hidden-only character numbers. CoC 7e checks, skills and damage become authoritative. Legacy fields remain only in versioned migrations, never silently mixed with live outcomes.
- **CoC authority:** supplied **Call of Cthulhu 7th Edition Keeper Rulebook** first; supplied **Investigator Handbook** for investigator/era expansion; record source section references and optional/house-rule decisions in a rules-coverage matrix. Resolve discrepancies explicitly; do not assume all source documents are identical editions.
- **Existing uploaded private scenario references:** *The Lightless Beacon*, *Doors to Darkness*, *Mansions of Madness Vol. 1*, *Adventures in Arkham Country*, *The Children of Fear*, *Horror on the Orient Express*, *Beyond the Mountains of Madness*. Use them to study adventure format, spatial/temporal structure, clue flow, handouts and campaign pacing; local adaptation only with appropriate use rights.
- **Secrets boundary:** localStorage/debug reports can be inspected by the owner; \"behind the screen\" is the ordinary player-experience guarantee, not cryptographic secrecy against a developer opening browser tools. Consider server-held Keeper state before public multiplayer or spoiler-resistant sharing; do not store API credentials in a repo or debug export.
- **Release rights:** the repo is public. Do not check in full commercial rulebooks, scenario PDFs, maps, art, handouts, substantial protected text or a wholesale published scenario conversion. Chaosium excludes games/apps/VTTs from its Fan Material Policy. Decide on distribution/license before publishing protected implementations; full CoC fidelity is the private development target, not a claim of approved public licensing. Official policy: https://www.chaosium.com/fan-material-policy/
- **Initial platform:** responsive browser/GitHub Pages and existing Cloudflare proxy, simple 2D visual surfaces, no native app, no 3D engine, no always-on online multiplayer. These could be later scoped as explicit new milestones rather than quietly inflating this plan.

## 3. Governing interaction contract

1. **View:** text case file, environment, discovered people, optional map, conditions, optional full numeric sheet; no normal turn shows dice or arithmetic.
2. **Describe:** player writes freely or clicks a grounded scene choice. Non-risky actions may auto-resolve without a roll.
3. **Assess:** Keeper identifies skills, difficulty, materials and stakes using real rules; show a qualitative competency/probability band when uncertainty is meaningful, not exact secret information. A preview cannot promise guaranteed outcomes under hidden opposition.
4. **Commit:** player accepts stakes or chooses alternate tactic; pushes and optional Luck policy cannot be auto-spent without authorization.
5. **Resolve:** deterministic local CoC engine rolls privately, evaluates difficulty/opposed tests and consequences, writes versioned state. AI can propose **intent**, not authority; never let a narration model fabricate result fields.
6. **Narrate:** render only what the investigator could know. Off-screen actions and unsuccessful silent checks must not reveal their own failures. Debug/replay may store privileged records separately with spoiler warning.
7. **Persist:** game time, locations, cast, clue knowledge, resources, SAN/HP, injuries, relationships, threats, events, inventory and scenario seed survive save/load. Different characters can eventually occupy different positions.
8. **Investigative fairness:** clues can be missed or delayed; however, every *essential* revelation should have several discoverable paths or resilient fallback actions, not a secretly forced successful roll. No single random failure permanently dead-ends a whole adventure.

## 4. Whole-product weighted delivery ledger

**Current independently accepted = 18/100 (18%).** The old **35%** evaluated a narrower approved delivery boundary and **is not comparable**; the lower figure reflects expanded scope, not a regression in accepted code. A gate earns its weight only when all its acceptance tests and evidence are accepted. Planned and partial gates get 0 in the headline. No fabricated fractional confidence or time estimates. Weights express relative delivery scope, not hours. At scope change, revise both this document and `site-progress.json`, record why in `audit.md`, and rerun validator before updating display.

| ID | Gate | Weight | Status |
|---|---|---:|---|
| `f-browser` | Playable browser mystery and natural-language interface | 5 | accepted |
| `f-generation` | Structured premise, scenario and coherence preflight | 5 | accepted |
| `f-knowledge` | Mystery truth, clue knowledge and NPC public-identity boundaries | 4 | accepted |
| `f-persistence` | Save, import/export and sanitized debug foundations | 4 | accepted |
| `g-governance` | Versioned roadmap, rule provenance and distribution policy | 3 | partial |
| `r-authority` | 7th Edition rules coverage and compatibility matrix | 4 | partial |
| `r-investigator` | Full optional investigator sheets and creation | 6 | partial |
| `r-percentile` | Deterministic secret d100 rules and opposed resolution | 7 | partial |
| `r-preview` | Intelligible competence and risk previews without dice | 4 | partial |
| `r-combat` | Combat, weapons, pursuit and environmental hazards | 5 | planned |
| `r-sanity` | Sanity, injury, major wounds, dying and recovery | 5 | planned |
| `r-occult` | Occult threats, tomes, rituals and Mythos magic | 3 | planned |
| `r-advancement` | Experience, improvement, downtime and campaign economy | 3 | planned |
| `k-keeper` | Structured AI Keeper authority and narration | 5 | partial |
| `k-npcs` | Persistent NPCs, relationships, plans and off-screen events | 4 | partial |
| `k-investigation` | Clue network, player theories and fair investigation | 4 | partial |
| `s-procedural` | Unlimited coherent procedural scenario compiler | 6 | partial |
| `s-published` | User-supplied published scenario adapter and scenario testing | 3 | planned |
| `s-campaign` | Long-form campaign continuity, factions and resolutions | 4 | planned |
| `v-space` | HTML 2D scenes, exploration maps and character positioning | 6 | planned |
| `v-audio` | Optional licensed ambient music and effects | 2 | planned |
| `v-access` | Player settings, readable sheet, accessibility and mobile UX | 3 | partial |
| `q-release` | Rules parity, security, regression, migrations and deployment | 5 | partial |
| **TOTAL** | **Full approved vision** | **100** | **18 accepted** |

### Current phase

**Phase: Call of Cthulhu conversion, 0 of 5 audited transition outcomes.** These outcomes are (1) rules mapping; (2) visible investigators/skills; (3) hidden percentile adjudication with informed stakes; (4) SAN/injury/combat; (5) validated end-to-end CoC case. The whole-product completion is a separate, broader figure.


### COC-001 test checkpoint · 2026-10-27

Isolated rule kernel and tests are in GitHub; [rules coverage and missing sections](docs/COC-7E-RULES-COVERAGE.md). The live browser engine remains unchanged. The 11-test mechanical suite and roadmap integrity checks passed in CI. **No full-gate points awarded** because live conversion, several rule categories and licensing review remain incomplete.

### COC-002 · 2026-10-27 — Opt-in investigator and investigation pilot

- **Working experimental UI:** `index.html` v0.8.2 can create/view a **provisional** numeric CoC investigator, retain it in a versioned separate save field, and switch between legacy mechanics and a controlled pilot. The sheet is not yet a rules-legal character builder or complete skill catalog.
- **Action preview:** new `engine/investigator.mjs` maps a bounded subset of legacy interpreter intents to appropriate CoC skills, calculates apparent Regular/Hard/Extreme success likelihood internally, and displays a competence / risk band without roll mathematics. Concealed clue difficulty is applied only during resolution, never leaked in preview.
- **Action resolution:** opt-in investigative attempts call `engine/coc7.mjs`, with privileged numeric result held in debug/history, and public narration seeing only the authorized coarse result. Existing clue discovery/time machinery is an explicitly identified **compatibility adapter**, not an assertion of full CoC runtime parity. Unmapped actions (including combat, Sanity, chases and medical mechanics) are blocked in pilot mode. No silent return to the generic dice engine.
- **Validation:** isolated kernel + new profile tests + static/compilation browser contract checks; GitHub Actions checks. Manual Cloudflare/browser end-to-end gameplay still pending. `r-investigator`, `r-percentile`, `r-preview`, `k-keeper` remain **partial**. **Full-product score stays 18/100; transition 0/5**.

**Next COC-003:** full source-matched 7e investigator creation, an editable persistent sheet, direct CoC skill selection (instead of strict generic capability adapter), safer Keeper authorization for secret/contested checks, player-managed pushed/Luck decisions, and manual scenario smoke testing; preserve older saves.

## 5. Detailed milestones and acceptance conditions

## 0 · Preserved foundation

### f-browser — Playable browser mystery and natural-language interface (5 points; accepted)

**Scope:** Existing title, scene transcript, player commands, connection and basic scenario loop remain operable.

**Acceptance:** Preserve app launch, input, case generation and narration across conversion; smoke-test after every engine change.

**Evidence today:** index.html; audit.md v0.8.1

### f-generation — Structured premise, scenario and coherence preflight (5 points; accepted)

**Scope:** Strict schemas, premise contract, QA, schema self-test, consistent opening scenes and retry handling.

**Acceptance:** Keep schema validation, explicit-premise guarantees, identity/location coherence and safe failure reporting.

**Evidence today:** index.html; audit.md v0.8 / v0.8.1

### f-knowledge — Mystery truth, clue knowledge and NPC public-identity boundaries (4 points; accepted)

**Scope:** Structured true/known data, NPC public roles and introduced IDs, known-people list and visible physical presence.

**Acceptance:** Existing known-person and hidden-information behavior remains intact; no unrevealed entity appears by mistake.

**Evidence today:** index.html; audit.md v0.8

### f-persistence — Save, import/export and sanitized debug foundations (4 points; accepted)

**Scope:** Browser save/recovery, migration baseline, isolated debug export and token-redaction features.

**Acceptance:** Save/load and export continue to work; new fields have versioned migrations; debug contains no credentials.

**Evidence today:** index.html; audit.md v0.8.1

## 1 · Authority and governance

### g-governance — Versioned roadmap, rule provenance and distribution policy (3 points; partial)

**Scope:** Enforce roadmap-as-authority, chapter-level rules traceability, clear allowed source handling and stable score accounting.

**Acceptance:** Rules coverage matrix cites licensed local reference chapter/section without reproducing protected prose; distribution review signed off; validator and release evidence green.

**Evidence today:** DEVELOPMENT-ROADMAP.md; AGENTS.md; site-progress.json (governance only; licensing review pending)

## 2 · Call of Cthulhu engine

### r-authority — 7th Edition rules coverage and compatibility matrix (4 points; partial)

**Scope:** Keeper Rulebook primary, Investigator Handbook complementary; conflicts, optional rules, errata and boundary cases documented.

**Acceptance:** Coverage tests or explicit exceptions for core chapters; no generic probability engine silently handles CoC actions.

**Evidence today:** docs/COC-7E-RULES-COVERAGE.md (COC-001 chapter mapping; many systems not yet implemented, full acceptance blocked)

### r-investigator — Full optional investigator sheets and creation (6 points; partial)

**Scope:** Characteristics, derived statistics, full skills, occupations, credit rating, age effects, backstory, belongings, era, creation and import.

**Acceptance:** Create/edit/save multiple example investigators; on-demand player-facing sheet presents accurate values while routine turns stay narrative-first.

**Evidence today:** engine/investigator.mjs and optional numeric prototype sheet in index.html v0.8.2, tests/investigator.test.mjs (full rule-legal creation and editing pending)

### r-percentile — Deterministic secret d100 rules and opposed resolution (7 points; partial)

**Scope:** Regular/Hard/Extreme, critical/fumble, bonus/penalty dice, opposed tests, combined/group checks, push eligibility and luck rules.

**Acceptance:** Table-driven and statistical parity tests pass; AI cannot override result or generate rolls; rolls never appear in normal narrative.

**Evidence today:** engine/coc7.mjs; tests/coc7.test.mjs; pilot opt-in in index.html v0.8.2; tests/browser-contract.test.mjs (partial live investigative integration, no combat/SAN)

### r-preview — Intelligible competence and risk previews without dice (4 points; partial)

**Scope:** Show novice/proficient/expert labels, likely success bands, costs and stakes for proposed actions; support push/Luck consent policy.

**Acceptance:** Calibrated CoC probabilities produce honest plain-language bands before commitment; avoid spoiler leaks and deny false precision under hidden opposition.

**Evidence today:** engine/investigator.mjs previewAction; tests/investigator.test.mjs; index.html v0.8.2 pilot (apparent qualitative likelihood, hidden difficulty is not disclosed; calibration incomplete)

### r-combat — Combat, weapons, pursuit and environmental hazards (5 points; planned)

**Scope:** Initiative/DEX, fight back/dodge, firearms, ranges, ammo, cover, build, damage bonus, chases, obstacles and hazards.

**Acceptance:** Deterministic adversarial tests cover fight/flight/chases and linked scene positions; no generic narration substitutes for outcomes.

**Evidence today:** Pending combat/chase engine and tests

### r-sanity — Sanity, injury, major wounds, dying and recovery (5 points; planned)

**Scope:** Sanity loss, temporary/indefinite effects, bouts, underlying disorders, hit points, major wounds, healing and treatment.

**Acceptance:** Rules-conformant ongoing state, persistent consequences, privacy-aware narration, recovery and tests of edge cases.

**Evidence today:** Pending conditions and SAN subsystems

### r-occult — Occult threats, tomes, rituals and Mythos magic (3 points; planned)

**Scope:** Tome study, spell casting, Magic Points, POW, Mythos encounters, creature mechanics, psychologically credible unknown threats.

**Acceptance:** Rules tests for MP and SAN costs, spell effects and creature attacks; original data and no unauthorized reproduced protected text.

**Evidence today:** Pending creature/spell mapping and content rights review

### r-advancement — Experience, improvement, downtime and campaign economy (3 points; planned)

**Scope:** Development-phase skill improvement, injuries, profession/resources, Luck changes and time passing.

**Acceptance:** Legal improvement checks, long-term resources and recovery persist without manual dice handling.

**Evidence today:** Pending validated advancement engine

## 3 · Digital Keeper

### k-keeper — Structured AI Keeper authority and narration (5 points; partial)

**Scope:** Intent→mechanical request→local adjudication→world-state mutation→spoiler-filtered narrator; automatic no-roll decisions.

**Acceptance:** Adversarial tests prove AI cannot invent rolls, override state, reveal Keeper-only facts or silently change character stats.

**Evidence today:** Existing AI narration and browser resolution; CoC authority boundary pending

### k-npcs — Persistent NPCs, relationships, plans and off-screen events (4 points; partial)

**Scope:** NPC goals, fear, trust, secrets, knowledge, memory, travel, injuries, lies, reactions and off-screen clocks.

**Acceptance:** NPCs retain identities and knowledge over sessions, move according to time/space constraints and behave without contradiction.

**Evidence today:** Fixed NPC locations and event timelines exist; autonomous behavior missing

### k-investigation — Clue network, player theories and fair investigation (4 points; partial)

**Scope:** Case journal, clues and inference, multiple essential-clue routes, conversations, searches, misdirection and distinct true/believed facts.

**Acceptance:** A failed optional roll has real costs but never permanently soft-locks the case; no unconditional success cheating; multiple solutions tested.

**Evidence today:** Current fact/evidence lists exist; clue dependency design incomplete

## 4 · Adventures and campaigns

### s-procedural — Unlimited coherent procedural scenario compiler (6 points; partial)

**Scope:** Era/setting prompts, secret truth, cast, places, timelines, clue dependencies, evidence, threats, escalation, pacing, outcomes and seeded variation.

**Acceptance:** Generates repeatably novel, playable CoC-compatible cases; invariant/solvability checks pass and new playthroughs differ in meaningful ways.

**Evidence today:** Prototype generator and coherence QA present; complete CoC scenario compiler missing

### s-published — User-supplied published scenario adapter and scenario testing (3 points; planned)

**Scope:** Reference examples: The Lightless Beacon; Doors to Darkness; Mansions of Madness Vol. 1; Adventures in Arkham Country; longer Children of Fear, Horror on the Orient Express and Beyond the Mountains of Madness.

**Acceptance:** Local user-supplied modules map locations/NPCs/clues to engine with rights review; no PDFs, maps, boxed text or copyrighted scenario plots republished in this public repo.

**Evidence today:** Uploaded official scenario PDFs available for private research; no public module implementation

### s-campaign — Long-form campaign continuity, factions and resolutions (4 points; planned)

**Scope:** Scenario chains, travel/time, aging, contacts, repercussions, injury/SAN persistence, branching finales and independent stand-alone play.

**Acceptance:** Multi-case save/reload test proves coherent knowledge, persistent NPCs, resource changes and earned aftermath across sessions.

**Evidence today:** Pending cross-scenario engine and tests

## 5 · Presentation and atmosphere

### v-space — HTML 2D scenes, exploration maps and character positioning (6 points; planned)

**Scope:** Progressive HTML/CSS/SVG/Canvas scene backgrounds, grounded zone/room coordinates, investigator and NPC markers, fog of knowledge, interactive movement and text alternative.

**Acceptance:** Player positions match authoritative state and travel times; unknown NPCs cannot leak; accessible non-graphical gameplay remains fully playable.

**Evidence today:** Pending map/scene representation and visual state tests

### v-audio — Optional licensed ambient music and effects (2 points; planned)

**Scope:** Context-aware ambience, weather/room transitions, optional music/sound, mute/volume, autoplay-compliant opt-in and reduced sensory intensity.

**Acceptance:** No audio without opt-in; correct location-cue transitions, functional controls, licensing record and full mute test.

**Evidence today:** Pending audio subsystem and cleared assets

### v-access — Player settings, readable sheet, accessibility and mobile UX (3 points; partial)

**Scope:** Always-on natural-language focus; sheet on demand, readable action risks, mobile layout, keyboard/screen-reader flow, visual/text modes and content settings.

**Acceptance:** Desktop/mobile and keyboard smoke suite passes; no requirement to reveal dice; optional map/audio never blocks gameplay.

**Evidence today:** Existing responsive layout and basic UI; planned controls missing

## 6 · QA and release

### q-release — Rules parity, security, regression, migrations and deployment (5 points; partial)

**Scope:** Mechanics golden tests, AI contract fuzzing, scenario QA, rights review, backup, schema migrations, hosted launch, performance, accessibility and secret isolation.

**Acceptance:** Published build tested end-to-end on desktop/mobile; CI green; deterministic rule fixtures, replay/debug safety and documented legal review accepted.

**Evidence today:** Earlier syntax/static checks, progress widget and token redaction exist; full QA missing

## 6. Implementation sequence and dependency plan

**COC-001 implemented (isolated):** produced `docs/COC-7E-RULES-COVERAGE.md`, `engine/coc7.mjs` and `tests/coc7.test.mjs`; successful GitHub Actions test on 2026-10-27. This is preparatory work, not a live conversion or accepted full gate.

**COC-002 shipped as opt-in pilot (v0.8.2):** bounded investigator sheet and investigative CoC checks; legacy play remains the default. **Next COC-003:** complete rule-legal investigator builder, direct CoC skill classification and stateful pushed/Luck choices, plus browser/Worker acceptance testing; do not yet claim full rules conversion.

**Milestone A — mechanical spine:** g-governance → r-authority → r-percentile → r-investigator → r-preview. Implement sheet view and natural-language action pipeline together so the player immediately has meaningful agency without visible rolls.

**Milestone B — mortal danger:** r-sanity, r-combat, r-occult, r-advancement. These may develop in parallel against stable actor/scene state contracts. Integrate status effects, recovery and combat before generated modules can require them.

**Milestone C — Keeper simulation:** k-keeper, k-npcs, k-investigation, including conversational memory, movement clocks, clue graphs and a defensible solution/aftermath evaluator.

**Milestone D — adventures/campaigns:** s-procedural (complete compiler with QA and multi-path cases), s-published (local/private scenario adapters, licensing gate), s-campaign. Keep official source material out of the public repository.

**Milestone E — atmosphere:** v-space first with a simple top-down/zone visual, markers and time-aware movement, then v-audio optional and v-access. Graphics must be generated from world state; no new facts invented by scene artwork.

**Milestone F — hardening:** q-release and cross-cutting regression/security/legal review. Do not mark complete based on static syntax checks alone.

There is no hard coupling that prevents starting the graphical scene model before all CoC spells exist; however **position, scene and action contracts must be stable** before visuals become authoritative. Optional audio is deliberately late and lightly weighted.

## 7. Progress and version control policy (mandatory for every future change)

- **Recovery first:** inspect latest `main`, `DEVELOPMENT-ROADMAP.md`, `site-progress.json`, `audit.md` and relevant tests; use accepted main over recollection, and never roll back newer verified changes.
- **Single scoreboard:** `site-progress.json` contains IDs, weights, statuses and evidence; `site-progress.js` calculates 100-point accepted progress and shows **game revision** parsed from `audit.md` plus **roadmap revision**. Human roadmap repeats IDs and acceptance definitions. `ROADMAP-COVERAGE.md` is an index, not a rival authority.
- **Acceptance means proof:** each accepted gate requires implementation and independently verified test evidence. Partial work can be logged without changing percentage. Explicitly show *not started / partial / accepted* and distinguish milestone percentage from total project percentage.
- **Versioning:** change game `audit.md` version when shipped gameplay changes; change roadmap revision for material scope/weight/criteria changes; document both with current date and commit. Never label a docs-only change as a tested rules upgrade.
- **Release checklist:** update roadmap, progress JSON, audit, acceptance evidence, tests and visible website; run `node scripts/verify-roadmap.mjs`; smoke-test scenario generation and character state; update docs before or in same atomic commit as feature. If a test cannot be run, say so and do not accept the gate.
- **Scope discipline:** new major requirement gets ID, weight, dependencies, test and relative priority; denominator stays at exactly 100 after reviewed reweighting. Do not silently set 100% against a reduced denominator. Reassess accepted items if a replacement invalidates them.
- **Safe information flow:** no raw Keeper truths in a player-view component, audio metadata, map label or ordinary model prompt; privileged debug explicitly marked spoiler-bearing and token-sanitized.

## 8. Known gaps / unimplemented as of R1

Full CoC investigator creation and visible numeric sheet; CoC d100/opposed/push/Luck mechanics; calibrated task previews; combat/chases; Sanity and injuries; Mythos magic; advancement; autonomous NPCs and memories; validated multi-path case solution graph; legal scenario import; cross-scenario campaign continuity; graphical rooms/maps, position-aware travel, animation and optional ambient audio; full test suite, mobile validation and licensing decision. Existing default mode still uses the earlier generic engine; v0.8.2 offers a clearly labeled, limited CoC investigative pilot and blocks unsupported CoC actions.

## 9. Supporting documents

- `audit.md`: running history, version, regressions and release evidence.
- `site-progress.json`: website ledger, scope and accepted weights.
- `site-progress.js`: already deployed public revision/roadmap widget (read-only).
- `ROADMAP-COVERAGE.md`: quick synopsis of this authoritative roadmap.
- `AGENTS.md`: mandatory contributor/recovery rules.
- `scripts/verify-roadmap.mjs` and `.github/workflows/roadmap-integrity.yml`: structural governance checks.
- Uploaded Keeper Rulebook, Investigator Handbook, and official scenarios: **private research materials, not repository dependencies or assets**.
