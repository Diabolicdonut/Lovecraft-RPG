# Black Meridian — Audit / Change Log

> **Whole-product roadmap R1 (2026-10-27):** Full-vision coverage is **18/100 (18%) accepted**, replacing the prior narrower 35% rubric (not a code regression). Governing source: [DEVELOPMENT-ROADMAP.md](DEVELOPMENT-ROADMAP.md). The separate Call of Cthulhu transition remains 0/5; game version now **0.8.4**, with expanded creation editor and isolated SAN calculations. Do not mark an incomplete rules gate accepted.

## v0.8.4 — COC-005/006: Custom creation editor and SAN groundwork (2026-10-28)

- **COC-005:** new `engine/creation-planner.mjs` implements age 15–89 source-matched age adjustments including a second Luck roll for younger investigators, older EDU checks and physical/APP reductions. Uses four original professions; never claims this is the entire official catalog or arbitrary 90+ character support.
- The browser now has saved, resumable character generation drafts with editable occupation and personal-interest point allocations. Skill eligibility, profession-specific Credit Rating, full expenditure, no Mythos creation points and 99 maximum are validated before finalizing. The Quick Generate route uses the same validated planner; old v0.8.3 investigators and legacy saves are preserved.
- Added original Newspaper Reporter and Laboratory Researcher archetypes to the existing Archivist and Field Investigator, with user-visible age-loss attribute selection and opportunity to assign individual skill points.
- **COC-006:** `engine/sanity.mjs` isolated SAN test framework: authorized SAN roll and dice loss, immediate INT test for shock, daily indefinite threshold, 0 SAN terminal state and Mythos-defined maximum. `tests/sanity.test.mjs` covers numerical edges. **Not wired to gameplay.** It does not deliver actual bouts, mania, recovery, injuries or SAN exposure data from case generation.
- Validation: prior 39 checks + 9 creation planner + 1 browser contract + 10 SAN tests = **59 automated Node tests passing** in the CoC GitHub Actions workflow. Roadmap validator runs separately. **No manual authenticated browser/Cloudflare-generated adventure smoke test** has been verified.
- Milestone gates `r-investigator`, `r-sanity`, `r-percentile`, `r-authority`, `r-preview` and `k-keeper` remain partial. **Whole-product 18/100; CoC transition 0/5**, as full subsystem acceptance still requires integration and other rules. Licensing review remains pending.
- **Next COC-007:** authoritative SAN events, madness/recovery state, scenario fidelity tests; expand age/occupation/specialist choices and execute hosted gameplay smoke tests.

## v0.8.3 — COC-003/004 (2026-10-28)

- Generated investigator feature implemented in `engine/character-creation.mjs`: 7e standard characteristic/Luck dice, one age 20–39 EDU improvement check, derived stats, occupation and personal-interest budgets, and original Archivist/Field Investigator career selections. Name and backstory can be edited; existing legacy and provisional character saves stay separate. Formal character creation is **not complete** without all ages/occupations and point-allocation editor.
- CoC pilot AI uses strict canonical named-skill schema; old generic classification remains confined to legacy mode. Existing case clue and time subsystem remains an explicitly temporary compatibility adapter.
- Overt failure choices implemented: accept, push once using a player-described new attempt, or optionally spend stated Luck points with consent and persistent deduction. Silent perception/stealth rolls do not trigger choice prompts. Push failure adds time/complication, not yet a rules-validated injury subsystem.
- Added `tests/character-creation.test.mjs` (7), `tests/direct-actions.test.mjs` (4), expanded `tests/browser-contract.test.mjs` (9), alongside previous `tests/coc7.test.mjs` (11) and `tests/investigator.test.mjs` (8): **39 total Node tests passing** in GitHub Actions. The temporary test contract discrepancy was fixed before accepted CI.
- Moved the overt push/Luck decision panel into the action composer with scroll-to-choice behavior; added a browser contract test for visible placement.
- No authenticated Worker scenario generation or full manual gameplay verification performed. Do not represent the app as full Chaosium 7e rules compliant. Licensing review remains pending.
- Published build is **v0.8.3**, roadmap R1, full scope **18%**, separate CoC conversion **0/5**; all relevant partial gates remain partial. No Cloudflare Worker updates.
- Next COC-005: full occupation/age/point editor, rigorous pushed-consequence authority, automated scene/role privacy and hosted end-to-end testing.

## v0.8.2 — COC-002: Provisional investigator sheet and opt-in CoC checks (2026-10-27)

- Added `engine/investigator.mjs`: strict numerical 7e pilot profile with characteristics, derived HP/MP/SAN, skill set, prototype defaults and validation; no invented conversion of prior generic stats. This is **not yet a complete rules-legal character generator**.
- Added on-demand character-sheet panel and **opt-in** CoC Pilot switch. Legacy remains the default.
- The action interpreter uses the active pilot occupation, while pilot-mode switches and sheet creation are locked during ongoing action resolution to prevent cross-mode races. Mode and profile persist with older saves migrated into an independent `coc` field; import runs the same migration.
- Added bounded CoC task interpretation for observation, research, social, stealth and technical checks, with strict skill mapping and apparent qualitative likelihood. Hidden clue difficulty affects actual checks but does not leak into the player's preview.
- Integrated pure CoC percentile kernel for pilot skill rolls, with no generic dice fallback for pilot actions; unsupported combat, Sanity, physical danger and other categories are rejected rather than secretly decided via the legacy system. Legacy clue discovery/time code is retained solely as an explicit compatibility adapter.
- Added `tests/investigator.test.mjs` (8 tests) and `tests/browser-contract.test.mjs` (6 tests). Updated CoC CI workflow to run all tests, and audit/documented missing systems. Browser script syntax and structure are validated by Node compilation checks.
- Normal pilot gameplay hides rolls and raw targets, including debug panel and narration-error fallbacks; privileged state/debug exports still contain referee information and are not cryptographically private.
- **Unimplemented:** exact occupational creation point budgets, full CoC skill catalog, fully editable sheet, push/Luck interactive transactions, combat/chase/SAN, proper opposed NPC adjudication, complete CoC mystery integration and manual Worker/browser testing.
- **Validation / acceptance:** 11 prior kernel tests + 8 investigator tests + 6 browser checks (25 tests; GitHub Actions CI); roadmap integrity must pass. Gates stay partial, score **18/100** and conversion **0/5**, because no complete gate qualifies. Current released UI now v0.8.2.
- **Next:** COC-003, complete sheet creation/editing and direct CoC skill requests, stateful push/Luck and more authoritative AI Keeper action contracts.

## 2026-10-27 — COC-001: 7th Edition percentile kernel (isolated engineering checkpoint)

- Added `engine/coc7.mjs`: independent percentile engine implementing thresholds, critical/fumble classification, bonus/penalty tens dice, opposed level ranking and explicit-consent push/optional Luck calculation. Uses secure entropy in production and injectable deterministic test RNG.
- Added `tests/coc7.test.mjs` with **11 Node tests** for edge cases, contested results, optional Luck and pushes, data validation, public-result projection and seeded statistical sanity.
- Added `docs/COC-7E-RULES-COVERAGE.md`: documented official uploaded 7e source authorities, chapter-level mechanics matrix, which rules are still missing, and licensing/republication restrictions.
- Added GitHub Actions workflow for isolated kernel tests; **11/11 tests PASS** on run [40567785355](https://github.com/Diabolicdonut/Lovecraft-RPG/actions/runs/40567785355). The roadmap validator ran in that workflow.
- Updated `r-authority` and `r-percentile` from planned to **partial**; full acceptance remains blocked on complete rules mapping, consent integrations, combined/group checks, and live AI/game migration. Score stays 18/100 and 0/5 CoC transition.
- **No gameplay version bump:** v0.8.1 is still serving old custom resolution. No modifications to `index.html`, saves, Cloudflare Worker or published scenarios. No functional browser/Worker smoke test claimed for CoC in this checkpoint.
- **Next COC-002:** 7e investigator schema and on-demand sheet, qualitative risk previews and bounded AI → deterministic engine → narrated outcome integration; regression and migrations required.

## 2026-10-27 — Whole-product scope and governance update (documentation/status only)

- Reviewed current GitHub main and preserved the previously implemented v0.8.1 browser/AI mystery foundation and public site progress widget.
- Expanded scope to 23 scored delivery gates / 100 total points. Accepted gates: browser gameplay (5), schema/coherence QA (5), hidden/public clue and NPC knowledge (4), saves/debug (4), total 18 points.
- Defined Call of Cthulhu 7e as future deterministic engine, optional investigator sheets and qualitative task previews, private hidden dice/checks, full SAN/combat/occult/advancement, AI Keeper state, persistent NPC movement/memory, adventures and campaigns, position-aware HTML scenes and optional ambient music.
- Uploaded official Keeper/Investigator source PDFs and seven scenario/campaign works recognized as **private references**; no copyrighted official material added to public GitHub.
- Established `DEVELOPMENT-ROADMAP.md`, `AGENTS.md`, `site-progress.json` gate ledger, integrity validator and CI review to keep the site status synchronized.
- Refined the published progress widget to show the separate roadmap revision (R1) beside game build and whole-project completion.
- At the roadmap establishment checkpoint, no gameplay/mechanics code had yet changed; COC-001 and COC-002 are documented above. No Cloudflare Worker changes. Old v0.8.1 custom checks remain until safe migration.
- Validation: 23 unique IDs; 100/100 weighted; accepted 18/100; 0/5 conversion; existing `index.html` includes `site-progress.js`. Further runtime smoke testing awaits an engineering rules milestone.


## Current Build

**Version:** 0.8.4  
**Mystery Engine:** v0.2  
**Architecture:** Browser-side game engine with Cloudflare used only as a protected OpenAI proxy.

---

# v0.8.1 — Structured Output Schema Hotfix

## Bug Fixed: Scenario Generation Could Not Start

The v0.8 mystery schema added these NPC properties:

- `publicRole`
- `knownAtStart`

However, the same NPC schema's `required` array still contained the old field:

- `role`

and omitted:

- `publicRole`
- `knownAtStart`

OpenAI strict Structured Outputs require every property in an object schema to appear in that object's `required` array.

As a result, the Responses API rejected the mystery schema before scenario generation began.

### Corrected NPC schema

The NPC object now requires:

- `id`
- `name`
- `publicRole`
- `knownAtStart`
- `locationId`
- `publicDescription`
- `secret`
- `motive`
- `knowledge`

The obsolete `role` requirement has been removed.

## Added: Local Structured-Schema Preflight

A new browser-side validator now checks Structured Output schemas before an OpenAI request is made.

It verifies that, for every object schema:

- every key in `properties` appears in `required`
- `required` does not contain nonexistent property names
- nested object and array schemas are recursively checked

If a future edit creates the same type of mismatch, Black Meridian will now produce a local diagnostic error before sending the invalid request to OpenAI.

## Added: Startup Schema Self-Test

On application startup the browser now validates:

- `ACTION_SCHEMA`
- `PREMISE_CONTRACT_SCHEMA`
- `PREMISE_MATCH_SCHEMA`
- `CASE_COHERENCE_SCHEMA`
- `MYSTERY_SCHEMA`

The result is recorded in the debug event stream as:

`structured_schema_self_test`

A successful build should report `passed: true`.

## Diagnostics

The exact v0.8 failure was not a model-generation failure or a Cloudflare failure.

The premise-contract request completed successfully. The subsequent mystery-generation request received HTTP 400 because the supplied JSON Schema was invalid.

No Worker changes are required.

## Validation Performed

- JavaScript syntax check: PASS
- NPC required/property consistency check: PASS
- obsolete `role` requirement regression check: PASS
- local schema-preflight implementation check: PASS
- startup schema-self-test implementation check: PASS

## Recommended Test

After replacing `index.html`:

1. Reload Black Meridian.
2. Confirm it auto-connects.
3. Generate:
   `Werewolf - survivors trapped in an isolated mansion overnight by a blizzard.`
4. If generation fails, export a Debug Report.
5. In the report, look for `structured_schema_self_test`; it should show `passed: true`.

---

# v0.8 Changes

## Mystery / Scenario Consistency

### Fixed: contradictory survivor and NPC presentation

A generated case could previously contain prose such as:

> "you and four other survivors have gathered..."

while the authoritative NPC state actually placed some of those survivors in other locations.

The browser now treats structured NPC location data as authoritative.

### Added: `publicRole`

NPCs now distinguish between:

- public identity / occupation
- hidden secret / true nature

This prevents hidden information such as "concealed werewolf" from appearing in normal player-facing role labels.

### Added: `knownAtStart`

Each generated NPC now explicitly records whether the investigator knows that person's identity when play begins.

This allows the engine to distinguish:

- known NPCs currently present
- known NPCs elsewhere
- NPCs not yet introduced to the player

### Added: Known People panel

The Case panel now lists people the investigator knows about.

Each known person is shown with:

- name
- public role
- whether they are physically present in the current scene

### Added: NPC introduction tracking

`mysteryRuntime.introducedNpcIds` now tracks which NPC identities have legitimately entered player knowledge.

NPCs may become introduced through:

- starting-case knowledge
- entering a scene where they are present
- clue discovery
- timeline events
- other authorized public information

### Added: explicit first-introduction behavior

If a clue introduces an NPC name the investigator did not previously know, that NPC is added to player knowledge and passed to the narrator as `newPeopleIntroduced`.

The narrator is instructed to introduce the person by their supplied public identity rather than assuming the player already knows them.

---

# Public Scene Authority

## Changed: location descriptions are environmental only

Generated `publicDescription` fields for locations are now instructed to describe:

- architecture
- weather
- objects
- sounds
- lighting
- visible environmental conditions

They should NOT independently:

- name NPCs
- count survivors
- state who is present
- override authoritative NPC location state

The browser assembles the actual scene population itself.

## Added: split scene population

Current scenes may now display:

- `People present`
- `Other known people not present here`

This makes the difference between identity knowledge and physical presence explicit.

## Added: safer opening hook presentation

If an opening hook claims that everyone is gathered together but NPC location data contradicts that claim, the conflicting positioning statement is filtered from player-facing presentation.

---

# Case Generation QA

## Added: coherence validation pass

After structural generation and premise validation, generated mysteries now receive an additional continuity / knowledge-boundary QA pass.

The QA system checks for:

- public prose contradicting NPC locations
- public roles leaking hidden information
- dangling NPC references
- unexplained names
- opening-scene contradictions
- public/hidden information-boundary violations
- cast-presence inconsistencies

Cases failing this QA pass are rejected and regenerated.

## Changed: structural validation is stricter

A generated mystery is no longer accepted with arbitrary structural warnings.

Any detected structural inconsistency now forces regeneration rather than silently entering play.

## Increased generation retry allowance

Explicit-premise cases may now receive up to three generation attempts.

Surprise cases may receive up to two attempts.

---

# Existing Mystery Migration

Older v0.7.x saves receive migration handling.

Migration behavior includes:

- adding `publicRole` where missing
- deriving a safe public role from old role text
- stripping obvious hidden-role suffixes such as "concealed ..."
- adding `knownAtStart`
- rebuilding `introducedNpcIds`
- rebuilding the public scene from authoritative structured state
- removing legacy public-description cast claims when possible

For clean QA testing, generating a new case after upgrading remains preferable.

---

# Debug Report Changes

## Improved storage isolation

Previous debug reports included unrelated `localStorage` data belonging to other applications hosted on the same GitHub origin.

v0.8 now includes only Black Meridian storage keys:

- Black Meridian save
- Black Meridian GAME_TOKEN presence status, with token value redacted
- Black Meridian diagnostic event log

Unrelated origin storage is not exported.

The report records only a count of unrelated keys.

## Security

Debug exports still intentionally exclude:

- actual `GAME_TOKEN`
- `OPENAI_API_KEY`
- authorization headers
- obvious credential-shaped fields

---

# Current Core Architecture

## Browser (`index.html`)

The browser currently owns:

- complete RPG state
- character state
- hidden exact character values
- action assessment
- confidence / risk / uncertainty
- local random resolution
- graded outcomes
- game time
- fatigue
- mystery generation
- hidden mystery truth
- locations
- NPC state
- clue state
- knowledge state
- timeline events
- local saves
- import / export
- debug reporting
- AI prompts

## Cloudflare Worker

The Worker should remain essentially frozen.

It owns only:

- `GAME_TOKEN` validation
- `OPENAI_API_KEY`
- generic OpenAI Responses API proxying

No game rules or persistent game state should be added to the Worker.

---

# Current Action Resolution Model

Player-facing action flow:

1. Player enters an intended action.
2. AI classifies intent and apparent difficulty.
3. Browser determines confidence.
4. Player commits.
5. Browser rolls locally.
6. Browser determines graded outcome.
7. Browser determines authorized discoveries/state changes.
8. AI narrates only the authorized result.

Current graded outcomes:

- Exceptional Success
- Strong Success
- Success
- Mixed Result
- Failure
- Severe Failure

---

# Current Knowledge Model

The browser separately tracks objective mystery truth and investigator knowledge.

Clue discovery contributes to fact knowledge.

Current broad fact progression is still preliminary:

- unknown
- supported
- confirmed

This will likely need refinement as the investigation system becomes more sophisticated.

---

# Validation Performed for v0.8

The generated `index.html` passed:

- JavaScript syntax validation with `node --check`
- static presence check for `publicRole`
- static presence check for `knownAtStart`
- Known People UI check
- coherence-QA implementation check
- legacy-role sanitizer check
- authoritative scene population check
- debug storage isolation check
- narrator NPC-introduction payload check

---

# Known Limitations / Areas Requiring Further Work

## NPC movement

NPCs currently have fixed `locationId` values unless future timeline/action logic changes them.

Dynamic NPC movement is not yet a full system.

## Conversation memory

NPC dialogue uses structured clue/knowledge handling but does not yet have a robust persistent conversational-memory model.

## Player questions vs actions

Questions such as:

> "Who is Martin?"

may still be interpreted as an action assessment instead of a free informational query.

A dedicated `Ask / Recall / Review` mode may be desirable.

## Core clues

The current clue engine still relies substantially on action/outcome matching.

The planned design rule that core clues should not be completely lost because of a bad roll should be implemented more explicitly.

## Threat behavior

Timeline events currently escalate the scenario, but antagonist/NPC autonomous behavior is still limited.

## Resolution detection

Possible resolutions are generated, but the game does not yet have a complete deterministic end-state evaluator.

## Character creation

The current investigator is still a prototype character.

Full character creation and investigator customization remain future work.

## Combat / physical danger

The present resolution engine supports combat-like action categories, but there is not yet a dedicated lethal horror-combat subsystem.

---

# Recommended Next Development Steps

The most important next milestone is to improve the playable-case loop rather than adding more infrastructure.

Suggested order:

1. **Player knowledge / cast clarity**
   - dedicated case dossier
   - known people
   - known places
   - discovered evidence
   - current theories

2. **NPC interaction engine**
   - attitude
   - trust
   - fear
   - willingness to reveal information
   - lies / evasions
   - conversation memory

3. **Dynamic NPC and threat state**
   - NPC movement
   - injuries
   - disappearance
   - death
   - changing goals
   - antagonist reactions

4. **Core-clue guarantee**
   - reasonable investigation always obtains essential clue
   - roll affects time, completeness, danger, extra context, or complication

5. **Case resolution engine**
   - detect containment / escape / rescue / failure / abandonment
   - generate aftermath
   - carry consequences into campaign state

6. **Character creation**
   - investigator identity
   - occupation
   - qualitative strengths / weaknesses
   - hidden numerical values

7. **Campaign layer**
   - recurring people / organizations
   - selected cross-case links
   - larger hidden truth
   - not every case tied to the same metaplot

---

# Development Policy Going Forward

For every future Black Meridian build:

1. provide the updated `index.html`
2. provide an updated `audit.md`
3. package both together in the ZIP
4. update this audit with:
   - version number
   - changes
   - fixes
   - migrations
   - tests / validation
   - known issues
   - recommended next steps

The Cloudflare Worker should only be changed if the generic proxy itself actually needs a security or API compatibility update.
