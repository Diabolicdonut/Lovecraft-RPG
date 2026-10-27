# Black Meridian — Call of Cthulhu 7e Rules Coverage

**Engineering checkpoint:** COC-001 · 2026-10-27 · **Governing roadmap:** R1 · **Live game:** v0.8.1 (legacy mechanics still active).

## Reference and version policy

The user supplied the *Call of Cthulhu Keeper Rulebook, Seventh Edition*, used as mechanical authority, and the *Investigator Handbook, Seventh Edition* for character construction and historical/background material. Rules citations below are chapter-level with relevant printed page ranges. This document is a newly written implementation checklist, not a transcription of proprietary rulebook text. Keeper Rulebook mechanical resolution overrides any conflicting summary/examples; optional rules require an explicit setting and consent.

**Copyright and distribution:** Source books and seven supplied adventures/campaign volumes remain private references and are NOT public repo dependencies. This public repository contains only original code and short original engineering summaries. Publication/licensing review is unresolved; no endorsement by Chaosium is asserted.

## Implemented engineering foundation, NOT yet player-facing

- 'engine/coc7.mjs': pure deterministic percentile/skill evaluator; injectable random source for fixtures; default source uses secure browser/Node crypto entropy and fails closed when absent.
- 'tests/coc7.test.mjs': runnable Node test suite for edge cases, mathematical boundaries and consent safeguards.
- All results are returned as privileged numeric objects. 'playerOutcome' gives a deliberately minimal sanitized projection; not a cryptographic protection against browser developer tools.
- **The engine is NOT imported by 'index.html'.** Players still use v0.8.1 custom action resolution. No CoC rules completion or runtime parity is claimed until migration and integration are verified.

## Rules coverage matrix

| Source (7e Keeper Rulebook, except as noted) | Subsystem | COC-001 state | Required before acceptance |
|---|---|---|---|
| Ch. 3 and Investigator Handbook Ch. 3 | Characteristics, investigator creation, derived traits, age, background, occupations | Not implemented | Stable actor schema, creation, validation, saves and visible sheet |
| Ch. 4; Investigator Handbook Chs. 3–4 | Skills, specializations, default ratings and eras | Not implemented | Canonical structured skills, occupation mapping, era options |
| Ch. 5 pp. 80–101 | Percentile checks, success tiers, critical/fumble and difficulty | Isolated code and unit tests | Invoke it in live actions, full rule-by-rule edge coverage |
| Ch. 5 bonus/penalty dice | Extra tens dice, cancellation and 00+0 interpretation | Isolated code and tests | Rules-grounded assignment by AI Keeper, no information leak |
| Ch. 5 opposed rolls | Degree comparison, skill tie breaks | General contested kernel and tests | More ties/invalid action handling; exclude combat-specific tie rules |
| Ch. 5 pushed rolls | Second attempt using a changed approach | Consent-gated mechanics only | Keeper permission, risk preview and stateful grave consequences |
| Ch. 5 optional Luck spending | Point substitution and exclusions | Consent-gated calculation only | Validity matrix, full transaction/persistence and UI preference |
| Ch. 5 combined/group skills, Know/Idea/Luck | Mixed/collective and non-skill resolution | Not implemented | Source-matched standalone routines and test vectors |
| Ch. 5 investigator development | Marking improvement, development phases | Not implemented | Skill tick, progress check, timing, persisted awards |
| Ch. 6 | Close combat, firearms, maneuvers, cover, weapon state | Not implemented | Combat engine and target/tie-specific tests |
| Ch. 7 | Pursuit/chase speed and obstacles | Not implemented | Position/time/chase state and deterministic obstacles |
| Ch. 8 | SAN checks, horror, temporary/indefinite conditions | Not implemented | SAN engine, recovery, faithful persisted effects |
| Ch. 9 | Tomes, spells, magic and special costs | Not implemented | Rules/data reference and rights review |
| Ch. 10 | Keeper adjudication, game/scenario operation | Existing non-CoC prototype | Structured authority pipeline, multi-path clue guarantees |
| Chs. 11–16 | Keeper reference material | Unmapped | Individual subsystem mapping; no protected source reprint |

## Behavioral requirements for subsequent integration

1. The generic confidence/difficulty system is legacy only. Once an action is migrated, the AI submits bounded intent plus environmental justification, and must NOT supply a chosen die result or final world mutation.
2. A human player can inspect accurate characteristics and skill numbers on a sheet while the normal turn displays **no rolls or numeric thresholds**. Skill ability and apparent risk may be explained qualitatively, subject to hidden facts.
3. The 7e engine independently decides rolled success. On a pushed attempt, the player must authorize an altered approach; optional Luck spending requires explicit consent/policy, and no silent use is allowed.
4. A roll may not be required at all for obvious routine or impossible tasks. Failing a secret roll must not automatically warn the player.
5. Ordinary opposed contests compare success levels and, when needed, higher skill. Two unsuccessful parties do not imply a completed action; combat maneuver/fight-back ties follow their own future rule code.
6. The percentile dice routine rolls units and tens independently; it interprets the double-zero/zero-unit combination as 100 before selecting a bonus/penalty outcome. Hard/Extreme limits are integer fractions of skill.
7. A secure random generator is required for production. Deterministic injected sources are exclusively for reproducible test fixtures and replays.

## Open decisions and exceptions

- **Optional Luck:** explicitly gated and disabled until player preference, category exclusions, recovery and resource writes are implemented. No roll may spend Luck merely because a model suggests it.
- **Pushed rolls:** core guard tests are preliminary. Eligibility is situation-dependent; an informed push should also include a documented escalated bad consequence. Disallow automatic repeat tries by the AI.
- **Contested ties:** mechanical skill tie-break is for general contests. Fighting back, dodging, grappling and disengagement each require separate policies.
- **Probability disclosure:** exact private odds can leak hidden threats; show qualitative likelihood based on publicly available circumstances, and signal that uncertainty remains.
- **Rules publication:** Chaosium's Fan Material Policy excludes apps and VTTs. Before externally distributing a faithful implementation as a rules product, seek appropriate licensing or pursue a differently licensed system. Existing public repository content must not include protected source/scenario passages.

## Tests and acceptance status

Execute 'node --test tests/coc7.test.mjs' and 'node scripts/verify-roadmap.mjs'. CI should run both. Fixtures cover regular/hard/extreme, fumbles and criticals, fractional thresholds, 100 treatment, two bonus/penalty dice, cancellation, opposed outcomes, no false success when both fail, pushed consent, optional Luck controls, invalid RNG values, sanitized projections and seeded distribution sanity.

The following gates are **partial**, not accepted: 'g-governance', 'r-authority', 'r-percentile'. Rule coverage is incomplete, the existing live game still runs generic resolution, and public distribution review is pending. Full-product score remains 18/100, separate transition remains 0/5.

**COC-002 proposed:** numeric investigator schema and visible sheet; risk band preview; narrow end-to-end AI intent → immutable numerical request → secret kernel → authorized narration path, alongside migration and browser smoke checks. Never switch the full live game until representative generated cases pass.
