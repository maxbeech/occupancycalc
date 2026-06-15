import { computeEgress, minExitsRequired, SINGLE_EXIT_MAX } from "../lib/egress.ts";
import { eq, ok, done } from "./_assert.mts";

// Min exits thresholds (IBC §1006.3.1).
eq(minExitsRequired(1), 2, "1 occ → 2 exits");
eq(minExitsRequired(49), 2, "49 occ → 2 exits");
eq(minExitsRequired(500), 2, "500 occ → 2 exits");
eq(minExitsRequired(501), 3, "501 occ → 3 exits");
eq(minExitsRequired(1000), 3, "1000 occ → 3 exits");
eq(minExitsRequired(1001), 4, "1001 occ → 4 exits");

// Single-exit ceilings by group (Table 1006.2.1).
eq(SINGLE_EXIT_MAX.B, 49, "B single-exit max 49");
eq(SINGLE_EXIT_MAX.S, 29, "S single-exit max 29");
eq(SINGLE_EXIT_MAX.R, 20, "R single-exit max 20");
eq(SINGLE_EXIT_MAX.I, 10, "I single-exit max 10");

// Egress width factors (§1005.3): 0.3 stair / 0.2 other base; 0.2 / 0.15 reduced.
const e = computeEgress(200, "A");
eq(e.stairWidthBase, 60, "200 occ stair base 0.3 → 60in");
eq(e.stairWidthReduced, 40, "200 occ stair reduced 0.2 → 40in");
eq(e.otherWidthBase, 40, "200 occ other base 0.2 → 40in");
eq(e.otherWidthReduced, 30, "200 occ other reduced 0.15 → 30in");
eq(e.minExits, 2, "200 occ → 2 exits");
ok(!e.canUseSingleExit, "200 occ cannot single-exit");

// At the boundary: 49 in group B can use a single exit; 50 cannot.
ok(computeEgress(49, "B").canUseSingleExit, "49 B single-exit allowed");
ok(!computeEgress(50, "B").canUseSingleExit, "50 B single-exit not allowed");

// Storage boundary: 29 ok, 30 not.
ok(computeEgress(29, "S").canUseSingleExit, "29 S single-exit allowed");
ok(!computeEgress(30, "S").canUseSingleExit, "30 S single-exit not allowed");

// Zero occupants → zero widths.
const z = computeEgress(0, "B");
eq(z.stairWidthBase, 0, "0 occ stair width 0");
eq(z.otherWidthBase, 0, "0 occ other width 0");

done("egress");
