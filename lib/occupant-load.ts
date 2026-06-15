// Core occupant-load engine. Pure, deterministic, no fabricated numbers — every
// output traces to a transcribed IBC 2021 constant in occupancy-factors.ts /
// egress.ts. IBC §1004.5: occupant load = floor area ÷ the area-per-occupant
// factor, ROUNDED UP to the next whole number (IBC §1004.2 fractional rule).

import { getSpaceType, type SpaceType } from "./occupancy-factors";
import { computeEgress, type EgressResult } from "./egress";

export interface OccupantLoadInput {
  spaceSlug: string;
  // Floor area in square feet. For "net" factors this is the net (usable) area;
  // for "gross" factors it is the gross floor area. The UI explains which.
  area: number;
  // Optional: directly specify occupant load (e.g. fixed-seat count) to bypass
  // the area calculation but still get egress/fixture outputs.
  fixedOccupants?: number;
}

export interface OccupantLoadResult {
  space: SpaceType;
  area: number;
  occupantLoad: number;
  basis: "gross" | "net";
  factor: number;
  egress: EgressResult;
  // The IBC area unit the occupant load was derived from.
  derivedFrom: "area" | "fixed";
}

export const MAX_AREA = 10_000_000; // sq ft — generous ceiling, clamps garbage
export const MAX_FIXED = 1_000_000;

export function computeOccupantLoad(input: OccupantLoadInput): OccupantLoadResult | null {
  const space = getSpaceType(input.spaceSlug);
  if (!space) return null;

  let occupantLoad: number;
  let derivedFrom: "area" | "fixed";
  const area = clamp(input.area, 0, MAX_AREA);

  if (input.fixedOccupants != null && Number.isFinite(input.fixedOccupants)) {
    occupantLoad = Math.max(0, Math.floor(clamp(input.fixedOccupants, 0, MAX_FIXED)));
    derivedFrom = "fixed";
  } else {
    // IBC §1004.2: where the calculation results in a fraction, round UP.
    occupantLoad = area > 0 ? Math.ceil(area / space.factor) : 0;
    derivedFrom = "area";
  }

  return {
    space,
    area,
    occupantLoad,
    basis: space.basis,
    factor: space.factor,
    egress: computeEgress(occupantLoad, space.group),
    derivedFrom,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}
