// Core occupant-load engine. Pure, deterministic, no fabricated numbers — every
// output traces to a transcribed IBC 2021 constant in occupancy-factors.ts /
// egress.ts. IBC §1004.5: occupant load = floor area ÷ the area-per-occupant
// factor, ROUNDED UP to the next whole number (IBC §1004.2 fractional rule).

import { getSpaceType, type SpaceType } from "./occupancy-factors";
import { computeEgress, minExitsRequired, EGRESS_WIDTH, type EgressResult } from "./egress";

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

// Whole-building / multi-space aggregation. IBC computes each space's occupant
// load separately (area ÷ its own factor, rounded up) then SUMS them for the
// floor/building total; egress for the story is sized to that total. This is the
// real permit workflow no single-room competitor offers.
export interface BuildingSpace {
  id: string;
  spaceSlug: string;
  area: number;
}
export interface BuildingRow {
  id: string;
  label: string;
  area: number;
  load: number;
}
export interface BuildingSummary {
  rows: BuildingRow[];
  total: number;
  minExits: number;
  stairWidthBase: number;
  stairWidthReduced: number;
  otherWidthBase: number;
  otherWidthReduced: number;
}

export function summarizeBuilding(spaces: BuildingSpace[]): BuildingSummary {
  const rows: BuildingRow[] = spaces.map((s) => {
    const st = getSpaceType(s.spaceSlug);
    const r = computeOccupantLoad({ spaceSlug: s.spaceSlug, area: s.area });
    return { id: s.id, label: st?.label ?? s.spaceSlug, area: clamp(s.area, 0, MAX_AREA), load: r?.occupantLoad ?? 0 };
  });
  const total = rows.reduce((a, r) => a + r.load, 0);
  return {
    rows,
    total,
    minExits: minExitsRequired(total),
    stairWidthBase: ceil1(total * EGRESS_WIDTH.stairs.base),
    stairWidthReduced: ceil1(total * EGRESS_WIDTH.stairs.reduced),
    otherWidthBase: ceil1(total * EGRESS_WIDTH.other.base),
    otherWidthReduced: ceil1(total * EGRESS_WIDTH.other.reduced),
  };
}

function ceil1(n: number): number {
  return Math.ceil(Math.round(n * 1000) / 100) / 10;
}

// IBC §1004.6 fixed-seating occupant load. For fixed seats with dividing arms,
// the load is the seat count. For bench/pew seating without dividing arms it is
// at least one person per 18 in; for booths, one person per 24 in (measured at
// the backrest). `lengthOrCount` is seat count for "seats", inches otherwise.
export type SeatingKind = "seats" | "bench" | "booth";

export function fixedSeatLoad(kind: SeatingKind, lengthOrCount: number): number {
  const v = Number.isFinite(lengthOrCount) ? Math.max(0, lengthOrCount) : 0;
  if (v === 0) return 0;
  if (kind === "seats") return Math.floor(v);
  const per = kind === "booth" ? 24 : 18;
  return Math.ceil(v / per);
}
