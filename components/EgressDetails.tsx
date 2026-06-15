"use client";

import { useState } from "react";
import type { EgressResult } from "@/lib/egress";
import { exitSeparation } from "@/lib/egress";
import { NumberField } from "./ui";

// Advanced egress outputs (common path, travel distance, exit separation) for a
// computed result. Kept separate from OccupancyTool to keep each file focused.
export function EgressDetails({ e, sprinklered }: { e: EgressResult; sprinklered: boolean }) {
  const [diagonal, setDiagonal] = useState(60);
  const cp = sprinklered ? e.commonPath.sprinkler : e.commonPath.noSprinkler;
  const td = sprinklered ? e.travelDistance.sprinkler : e.travelDistance.noSprinkler;

  return (
    <details className="rounded-xl border border-slate-200 bg-white p-5">
      <summary className="cursor-pointer text-sm font-semibold text-slate-900 focus-visible:ring-2 focus-visible:ring-sky-200">
        Advanced egress limits (travel distance, common path, exit separation)
      </summary>
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Common path of egress travel</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{cp === null ? "Not permitted" : `${cp} ft`}</div>
            <div className="mt-0.5 text-xs text-slate-600">{cp === null ? "Single exit not permitted without sprinklers" : "Max for single-exit spaces (Table 1006.2.1)"}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Exit access travel distance</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{td === null ? "Not permitted" : `${td} ft`}</div>
            <div className="mt-0.5 text-xs text-slate-600">Max to an exit (Table 1017.2{sprinklered ? ", sprinklered" : ""})</div>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600">Required exit separation (§1007.1.1)</div>
          <label className="mt-2 block text-sm text-slate-700">
            Overall diagonal of the area (ft)
            <NumberField value={diagonal} min={0} max={5000} step={5} onChange={setDiagonal} ariaLabel="Overall diagonal dimension in feet" />
          </label>
          <div className="mt-2 text-sm text-slate-800">
            Two exits must be at least <strong>{exitSeparation(diagonal, sprinklered)} ft</strong> apart
            ({sprinklered ? "⅓" : "½"} of the diagonal{sprinklered ? ", sprinklered" : ""}).
          </div>
        </div>
        <p className="text-xs text-slate-600">
          Travel-distance and common-path values vary by occupancy subgroup; confirm the exact figure for your
          subgroup and any local amendments with your AHJ.
        </p>
      </div>
    </details>
  );
}
