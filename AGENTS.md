# Black Meridian — Contributor / Agent Instructions

**Authoritative:** Read live GitHub `main`, [DEVELOPMENT-ROADMAP.md](DEVELOPMENT-ROADMAP.md), `site-progress.json`, `audit.md`, current `index.html` and applicable tests before editing. Treat these current artifacts as more authoritative than old chat summaries. Do not silently restore the previous generic probability rules or touch unrelated repositories.

## Fixed player/engineering contract

- **Call of Cthulhu 7th Edition** is intended core mechanics authority (supplied Keeper Rulebook primary, Investigator Handbook supplemental). Document choices and legal rights; do not mix in generic resolution in converted actions.
- **Player sees** narrative, intelligible competence/risk estimate, investigator sheet on request, known people/clues and optionally graphical position. **Player never needs to roll**; routine dice/numerical checks, secret SAN rolls, opposition and hidden math stay behind the screen. Push and optional Luck spending require an informed choice/explicitly configured policy.
- **Engine decides** random outcomes, numerical state and real rules. AI parses intent, adjudicates applicability under contracts and narrates authorized observations only. Never leak hidden Keeper truths into UI, map, audio descriptions, model narration or standard debug.
- **Preserve** premise-driven and surprise case generation, authoritative cast/location state, coherent facts, saved data, player/secret partition, Cloudflare as credential proxy.
- **Privacy and licensing:** Do not commit any official source PDFs, published scenario plots/maps/text or nonlicensed art/music. Local uploaded books are references, not public assets. Chaosium Fan Material Policy excludes apps/VTTs; distribution/license review remains pending. Never claim endorsed/official game.

## Change procedure — required with every milestone

1. Recover latest main and current accepted gate statuses; choose the next unmet acceptance item. Do not declare speculative progress.
2. State affected roadmap IDs and dependencies. Update `DEVELOPMENT-ROADMAP.md`, `site-progress.json`, `ROADMAP-COVERAGE.md`, `audit.md` in the **same feature change** (or explain an unchanged gate). New scope requires 100-point reweight with rationale.
3. Update the game version in `audit.md` only for a new shipped gameplay build. Keep roadmap revision independent. Leave the site revision/progress indicator truthful and functional.
4. Add isolated deterministic mechanics/unit tests and scenario contract/continuity tests. Run `node scripts/verify-roadmap.mjs` and applicable code checks. Run manual browser/Worker smoke checks when possible; label unrun checks.
5. Accept a gate only when its acceptance contract is fully met and independently verified, evidence documented and no regression in v0.8.1 foundations. Partial gate status earns zero weighted points.
6. Prefer atomic/reviewable commits, retain old save migrations, never put GAME_TOKEN or API keys in commits/debug exports.

**Next implementation:** COC-007 after v0.8.4: create rules-validated SAN-event authorizations from Keeper/scenario facts, bout/madness/recovery engine, complete full-occupation and specialist/era character coverage, and perform authenticated live browser/Cloudflare gameplay smoke tests. Current SAN module is isolated and MUST NOT apply random losses without an approved scene trigger. Partial gates still earn zero accepted points.
