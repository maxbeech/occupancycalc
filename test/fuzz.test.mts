import { computeOccupantLoad } from "../lib/occupant-load.ts";
import { computeEgress } from "../lib/egress.ts";
import { computeFixtures, FIXTURE_OCCUPANCIES } from "../lib/fixtures.ts";
import { SPACE_TYPES, type OccGroup } from "../lib/occupancy-factors.ts";
import { ok, done } from "./_assert.mts";

// Sweep every space type across a wide range of areas (incl. garbage) and assert
// invariants: never NaN/negative, occupant load is a non-negative integer,
// egress widths non-negative, exits in {2,3,4}, single-exit only at/below ceiling.
const AREAS = [-100, -1, 0, 0.4, 1, 7, 15, 49, 50, 99, 100, 499, 500, 1000, 4999, 5000, 50000, 1e7, 1e9, NaN, Infinity, -Infinity];
let cases = 0;

for (const s of SPACE_TYPES) {
  for (const a of AREAS) {
    const r = computeOccupantLoad({ spaceSlug: s.slug, area: a });
    cases++;
    ok(r !== null, `result for ${s.slug} @ ${a}`);
    if (!r) continue;
    const ol = r.occupantLoad;
    ok(Number.isInteger(ol) && ol >= 0, `${s.slug}@${a}: OL integer ≥ 0 (got ${ol})`);
    ok(Number.isFinite(r.egress.stairWidthBase) && r.egress.stairWidthBase >= 0, `${s.slug}@${a}: stair width finite ≥0`);
    ok(Number.isFinite(r.egress.otherWidthBase) && r.egress.otherWidthBase >= 0, `${s.slug}@${a}: other width finite ≥0`);
    ok([0, 2, 3, 4].includes(r.egress.minExits), `${s.slug}@${a}: exits in {0,2,3,4}`);
    ok(r.egress.canUseSingleExit === (ol > 0 && ol <= r.egress.singleExitMax), `${s.slug}@${a}: single-exit consistent`);
  }
}

// Fixtures fuzz: every occupancy across loads incl. garbage.
const LOADS = [-50, 0, 1, 49, 50, 75, 200, 1000, 1e6, NaN, Infinity];
for (const o of FIXTURE_OCCUPANCIES) {
  for (const l of LOADS) {
    const f = computeFixtures(o, l);
    cases++;
    for (const [k, v] of Object.entries(f)) {
      ok(Number.isFinite(v) && (v as number) >= 0, `${o.slug}@${l}: ${k} finite ≥0 (got ${v})`);
    }
  }
}

// Egress fuzz across groups + loads.
const GROUPS: OccGroup[] = ["A", "B", "E", "F", "M", "U", "S", "R", "I", "H"];
for (const g of GROUPS) {
  for (const l of [-10, 0, 49, 500, 1001, NaN, Infinity]) {
    const e = computeEgress(l, g);
    cases++;
    ok(Number.isFinite(e.stairWidthBase) && e.stairWidthBase >= 0, `egress ${g}@${l} stair finite ≥0`);
    ok([0, 2, 3, 4].includes(e.minExits), `egress ${g}@${l} exits valid`);
  }
}

console.log(`  fuzz swept ${cases} cases`);
done("fuzz");
