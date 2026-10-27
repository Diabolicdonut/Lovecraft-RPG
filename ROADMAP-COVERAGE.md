# Lovecraft RPG — Black Meridian — Current Approved Delivery Roadmap

**Scope reconciled:** 2026-10-27 against actual GitHub `main` `351da386aea05afb1f3155e889b59a7d62b64628`. This is the present accepted source baseline; older documents and checkpoints remain historic, not current instructions.

**Approved delivery boundary:** Bounded transition to a complete behind-the-screen Call of Cthulhu-based investigative horror engine while preserving the existing Black Meridian mystery creation experience and natural-language play.

**Immediate authorized next work:** Establish authorized Call of Cthulhu rules mapping without replacing existing functionality; then sheet, d100 skill checks, sanity/injuries and full cases.

The overall indicator is a **100-point evidence-backed planning rubric**. Each gate's weight is the share of the currently approved finite delivery roadmap, not the amount of code already written. An accepted gate earns its entire weight only after supporting source/validation; **partial and planned gates earn zero until fully accepted**. Scope additions require an explicit reviewed revision; no speculative completion forecasts are made.

| Delivery gate | Weight | Status | Acceptance / source evidence |
|---|---:|---|---|
| Existing browser mystery gameplay foundation | 12 | accepted | `index.html; audit.md` |
| Strict generated mystery schema self-test and preflight | 8 | accepted | `audit.md (v0.8.1)` |
| Player-view NPC knowledge and physical appearance gating | 8 | accepted | `audit.md (v0.8 changes)` |
| Browser save, debug report and case recovery foundations | 7 | accepted | `index.html; audit.md` |
| CoC rulebook mapping and explicit compatibility policy | 10 | planned | `ROADMAP-COVERAGE.md` |
| CoC investigator attributes, skills, occupations and customization | 11 | planned | `ROADMAP-COVERAGE.md` |
| Referee-resolved percentile skill and opposed rules with hidden math | 10 | planned | `ROADMAP-COVERAGE.md` |
| Sanity, stability, damage, healing and long-term consequences | 10 | planned | `ROADMAP-COVERAGE.md` |
| End-to-end generated CoC mysteries with evidence and rules verification | 12 | planned | `ROADMAP-COVERAGE.md` |
| Trusted secrets, hosted AI adjudication, desktop/mobile playtesting | 12 | partial | `index.html; audit.md` |

**Overall accepted:** **35/100 (35%)**. **Separately retained current-phase indicator:** 0 / 5 Call of Cthulhu rules transition. The existing old counter is not the overall completion percentage.

**Acceptance policy:** Only accepted, independently validated milestone work may change a gate to `accepted`. No claim of full B/X or CoC rules parity, complete connected AI referee, live GM secrecy, manual mobile QA or unrestricted adventure generation is made without its own evidence. The repository's authoritative source, existing acceptance tests and current checkpoint take precedence over this planning percentage whenever they conflict.

**Design guardrail:** The indicator is a static read-only status summary, not game logic. It does not advance game state, grant experience, disclose secrets or change random rolls. Rev/date must be read from the original project authority as configured in `site-progress.json`.
