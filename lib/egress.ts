// IBC 2021 egress constants — verbatim, cross-confirmed (up.codes + ICC).
//
//   §1005.3.1 Stairways: 0.3 in/occupant; 0.2 in/occupant where sprinklered
//             (903.3.1.1/.2) AND emergency voice/alarm (907.5.2.2).
//   §1005.3.2 Other egress components (doors, ramps, corridors, level): 0.2
//             in/occupant; 0.15 in/occupant under the same sprinkler+alarm case.
//   §1006.2.1.1 / §1006.3: 1–500 occupants → 2 exits; 501–1,000 → 3; >1,000 → 4.
//   Table 1006.2.1: maximum occupant load with ONE exit/exit-access doorway,
//             by occupancy group (the load-bearing thresholds, cross-confirmed).
//   §1010.1.1 doors: 32 in min clear width. §1020.3 corridors: 44 in (36 in if
//             serving < 50 occupants).
//
// Sources: https://up.codes/s/required-capacity-based-on-occupant-load
//          https://up.codes/s/egress-based-on-occupant-load-and-common-path-of-egress-travel-distance
//          https://codes.iccsafe.org/s/IFC2021P1/chapter-10-means-of-egress/IFC2021P1-Pt03-Ch10-Sec1005.3.1

import type { OccGroup } from "./occupancy-factors";

export const EGRESS_WIDTH = {
  // inches of egress capacity required per occupant served
  stairs: { base: 0.3, reduced: 0.2 },
  other: { base: 0.2, reduced: 0.15 }, // doors, ramps, corridors, level components
};

export const MIN_DOOR_CLEAR_WIDTH_IN = 32; // §1010.1.1
export const MIN_CORRIDOR_WIDTH_IN = 44; // §1020.3 (50+ occupants)
export const MIN_CORRIDOR_WIDTH_LOW_IN = 36; // §1020.3 exception (< 50 occupants)

// §1006.2.1.1 / §1006.3 — minimum number of exits / exit access doorways.
export function minExitsRequired(occupantLoad: number): number {
  if (occupantLoad <= 500) return 2;
  if (occupantLoad <= 1000) return 3;
  return 4;
}

// Table 1006.2.1 — maximum occupant load served by a SINGLE exit or exit access
// doorway, by occupancy group (the occupant-load column, cross-confirmed). A
// space at or below this load MAY use one exit (subject also to common-path
// limits); above it, two exits are required.
export const SINGLE_EXIT_MAX: Record<OccGroup, number> = {
  A: 49,
  B: 49,
  E: 49,
  F: 49,
  M: 49,
  U: 49,
  S: 29,
  R: 20, // R-2/3/4 (R-1 is 10 — we use the common multifamily/lodging value)
  I: 10,
  H: 10, // H-4/5 (H-1/2/3 is 3 — we use the higher, more common subgroup)
};

export interface EgressResult {
  minExits: number;
  singleExitMax: number;
  canUseSingleExit: boolean;
  // egress width (inches) required across ALL exits combined
  stairWidthBase: number;
  stairWidthReduced: number;
  otherWidthBase: number;
  otherWidthReduced: number;
}

export function computeEgress(occupantLoad: number, group: OccGroup): EgressResult {
  const ol = Number.isFinite(occupantLoad) ? Math.max(0, Math.floor(occupantLoad)) : 0;
  const singleExitMax = SINGLE_EXIT_MAX[group];
  return {
    minExits: minExitsRequired(ol),
    singleExitMax,
    canUseSingleExit: ol <= singleExitMax,
    stairWidthBase: round1(ol * EGRESS_WIDTH.stairs.base),
    stairWidthReduced: round1(ol * EGRESS_WIDTH.stairs.reduced),
    otherWidthBase: round1(ol * EGRESS_WIDTH.other.base),
    otherWidthReduced: round1(ol * EGRESS_WIDTH.other.reduced),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
