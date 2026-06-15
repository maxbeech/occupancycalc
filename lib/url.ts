// Encode/decode occupant-load calculator inputs to the query string so results
// are shareable and bookmarkable. Pages stay statically rendered (SSG); the
// client reads the query string on mount.

import { SPACE_TYPES } from "./occupancy-factors";

export interface ShareInputs {
  space: string; // slug
  area: number;
}

export function encodeInputs(inp: ShareInputs): string {
  const p = new URLSearchParams();
  p.set("type", inp.space);
  p.set("area", String(inp.area));
  return p.toString();
}

function num(v: string | null, fallback: number): number {
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function decodeInputs(search: string, seed: ShareInputs): ShareInputs {
  const p = new URLSearchParams(search);
  const t = p.get("type");
  const space = t && SPACE_TYPES.some((s) => s.slug === t) ? t : seed.space;
  return { space, area: num(p.get("area"), seed.area) };
}
