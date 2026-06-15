import { computeOccupantLoad } from "../lib/occupant-load.ts";
import { SPACE_TYPES, getSpaceType } from "../lib/occupancy-factors.ts";
import { eq, ok, done } from "./_assert.mts";

// Worked examples checked by hand against IBC §1004.5 / §1004.2 (round up).

// 1,500 sq ft restaurant dining (15 net) → 100 occupants.
eq(computeOccupantLoad({ spaceSlug: "assembly-unconcentrated-tables-chairs", area: 1500 })!.occupantLoad, 100, "restaurant dining 1500/15 = 100");

// 9,000 sq ft office (150 gross) → 60.
eq(computeOccupantLoad({ spaceSlug: "business-areas", area: 9000 })!.occupantLoad, 60, "office 9000/150 = 60");

// Mercantile 3,000 / 60 = 50.
eq(computeOccupantLoad({ spaceSlug: "mercantile", area: 3000 })!.occupantLoad, 50, "mercantile 3000/60 = 50");

// Round-up rule: 1,510 / 15 = 100.67 → 101.
eq(computeOccupantLoad({ spaceSlug: "assembly-unconcentrated-tables-chairs", area: 1510 })!.occupantLoad, 101, "round up 1510/15 = 101");

// Standing space 5 net: 1,000 / 5 = 200.
eq(computeOccupantLoad({ spaceSlug: "assembly-standing-space", area: 1000 })!.occupantLoad, 200, "standing 1000/5 = 200");

// Classroom 20 net: 600 / 20 = 30.
eq(computeOccupantLoad({ spaceSlug: "classroom", area: 600 })!.occupantLoad, 30, "classroom 600/20 = 30");

// Warehouse 500 gross: 12,500 / 500 = 25.
eq(computeOccupantLoad({ spaceSlug: "warehouses", area: 12500 })!.occupantLoad, 25, "warehouse 12500/500 = 25");

// Concentrated chairs 7 net: 700 / 7 = 100.
eq(computeOccupantLoad({ spaceSlug: "assembly-concentrated-chairs", area: 700 })!.occupantLoad, 100, "concentrated 700/7 = 100");

// Fixed-occupants override bypasses area.
const fixed = computeOccupantLoad({ spaceSlug: "business-areas", area: 0, fixedOccupants: 250 })!;
eq(fixed.occupantLoad, 250, "fixed occupants override");
eq(fixed.derivedFrom, "fixed", "derivedFrom fixed");

// Zero area → 0 occupants.
eq(computeOccupantLoad({ spaceSlug: "business-areas", area: 0 })!.occupantLoad, 0, "zero area = 0");

// Unknown slug → null.
eq(computeOccupantLoad({ spaceSlug: "nope", area: 100 }), null, "unknown slug null");

// Egress wiring: 100 occupants in assembly → 2 exits, single-exit ok=false.
const r = computeOccupantLoad({ spaceSlug: "assembly-unconcentrated-tables-chairs", area: 1500 })!;
eq(r.egress.minExits, 2, "100 occ → 2 exits");
ok(!r.egress.canUseSingleExit, "100 occ assembly cannot use single exit");
eq(r.egress.stairWidthBase, 30, "100 occ stair width 0.3*100 = 30in");
eq(r.egress.otherWidthBase, 20, "100 occ other width 0.2*100 = 20in");

// Every space-type factor is positive and basis is gross|net.
for (const s of SPACE_TYPES) {
  ok(s.factor > 0, `${s.slug} factor > 0`);
  ok(s.basis === "gross" || s.basis === "net", `${s.slug} basis valid`);
  ok(getSpaceType(s.slug)?.slug === s.slug, `${s.slug} lookup roundtrips`);
}

// Spot-check a few verbatim factors against Table 1004.5.
eq(getSpaceType("business-areas")!.factor, 150, "business 150");
eq(getSpaceType("mercantile")!.factor, 60, "mercantile 60 (2021 consolidated)");
eq(getSpaceType("kitchens-commercial")!.factor, 200, "kitchens 200");
eq(getSpaceType("gaming-floors")!.factor, 11, "gaming 11");
eq(getSpaceType("inst-inpatient")!.factor, 240, "inpatient 240");

done("occupant-load");
