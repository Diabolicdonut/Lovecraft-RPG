# Black Meridian — Audit / Change Log

## Current Build

**Version:** 0.8.1  
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
