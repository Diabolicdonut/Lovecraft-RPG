# Black Meridian — Call of Cthulhu 7e Rules Coverage

**Engineering checkpoint:** COC-002 · 2026-10-27 · **Governing roadmap:** R1 · **Live game:** v0.8.2 (legacy default, opt-in limited CoC investigation pilot).

## Reference and version policy

The user supplied the *Call of Cthulhu Keeper Rulebook, Seventh Edition*, used as mechanical authority, and the *Investigator Handbook, Seventh Edition* for character construction and historical/background material. Rules citations below are chapter-level with relevant printed page ranges. This document is a newly written implementation checklist, not a transcription of proprietary rulebook text. Keeper Rulebook mechanical resolution overrides any conflicting summary/examples; optional rules require an explicit setting and consent.

**Copyright and distribution:** Source books and seven supplied adventures/campaign volumes remain private references and are NOT public repo dependencies. This public repository contains only original code and short original engineering summaries. Publication/licensing review is unresolved; no endorsement by Chaosium is asserted.

## Implemented engineering foundation and opt-in pilot

- 'engine/coc7.mjs': pure deterministic percentile/skill evaluator; injectable random source for fixtures; default source uses secure browser/Node crypto entropy and fails closed when absent.
- 'tests/coc7.test.mjs': runnable Node test suite for edge cases, mathematical boundaries and consent safeguards.
- All results are returned as privileged numeric objects. 'playerOutcome' gives a deliberately minimal sanitized projection; not a cryptographic protection against browser developer tools.
- **In v0.8.2, index.html dynamically imports the kernel in opt-in CoC pilot mode.** Default gameplay still uses legacy actions, and full 7e rules completion is not claimed.

## Rules coverage matrix

| Source (7e Keeper Rulebook, except as noted) | Subsystem | COC-001 state | Required before acceptance |
|---|---|---|---|
| Ch. 3 and Investigator Handbook Ch. 3 | Characteristics, investigator creation, derived traits, age, background, occupations | Partial: provisional validated profile, separate save, visible sheet | Complete occupation creation, exact skill catalog, character editor and legal rules parity |
| Ch. 4; Investigator Handbook Chs. 3–4 | Skills, specializations, default ratings and eras | Partial: bounded pilot skill map | Complete 7e skill catalog, specialization, occupation and era rules |
| Ch. 5 pp. 80–101 | Percentile checks, success tiers, critical/fumble and difficulty | Isolated code, unit tests and limited opt-in live investigative path | Full rule-by-rule edge coverage and all action types |
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

## COC-002 integration contract and safety limits

- `engine/investigator.mjs` has a **provisional, hand-authored example** with eight characteristics and bounded skills; derived HP/MP/SAN checks and strict save-time profile validation. No assertion that it was created using formal 7e occupation point distribution. Older saves are migrated without changing the legacy investigator; the new record is separate and opt-in.
- The existing ACTION_SCHEMA still classifies generic skill names. Only `observe`, `research`, `social`, `stealth` and `technical` with supported mapped skills may execute a CoC skill check in the pilot. Movement to verified scene exits remains a deterministic no-roll action. Other actions intentionally fail closed, notably combat, Sanity, chases, medical and spells.
- A **visible** preview uses publicly perceived difficulty, but the **actual** difficulty uses the most demanding compatible hidden clue. No secret is passed to the preview, even when an unrevealed obstacle makes success less likely.
- The bridge maps CoC outcomes to old case clue-discovery prose categories *after* a genuine CoC check; it never invokes the old generic random number generator in pilot mode. Existing time/fatigue and clue progression algorithms remain provisional and cannot be asserted to be CoC 7e.
- The result, difficulty and numeric roll are explicitly excluded from routine pilot player messages and developer on-screen diagnostics; a developer export still contains privileged secrets by design. Player narrative cannot become secure against deliberate browser inspection while Keeper state is client-side.
- The 7e pilot remains **partial**; no new weighted points until full milestone acceptance. Before calling it a full rules game, add a true character creator, Sanity, combat and opposed adjudication, player push/Luck choices, end-to-end mystery verification and distribution rights review.

**Manual testing still required:** complete a real hosted generated mystery with an authentic game token; check migration and profile state, a successful and failed pilot action, no hidden result display, and the ability to return to legacy. Automated Node tests cannot replace this.
