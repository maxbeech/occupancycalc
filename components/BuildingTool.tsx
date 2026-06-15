"use client";

import { useRef, useState } from "react";
import { spaceTypesByCategory } from "@/lib/occupancy-factors";
import { summarizeBuilding, type BuildingSpace } from "@/lib/occupant-load";
import { Card, Stat, inputCls } from "./ui";

const GROUPED = spaceTypesByCategory();

// Whole-building / multi-space aggregator — add a row per space, get the summed
// occupant load and the egress sized to that total. The professional permit
// workflow that single-room competitors don't offer.
export function BuildingTool() {
  const idc = useRef(3);
  const [spaces, setSpaces] = useState<BuildingSpace[]>([
    { id: "1", spaceSlug: "assembly-unconcentrated-tables-chairs", area: 1500 },
    { id: "2", spaceSlug: "kitchens-commercial", area: 400 },
  ]);
  const [sprinklered, setSprinklered] = useState(false);

  const summary = summarizeBuilding(spaces);
  const stairW = sprinklered ? summary.stairWidthReduced : summary.stairWidthBase;
  const otherW = sprinklered ? summary.otherWidthReduced : summary.otherWidthBase;

  const update = (id: string, patch: Partial<BuildingSpace>) =>
    setSpaces((xs) => xs.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const addRow = () => setSpaces((xs) => [...xs, { id: String(idc.current++), spaceSlug: "business-areas", area: 1000 }]);
  const removeRow = (id: string) => setSpaces((xs) => (xs.length > 1 ? xs.filter((s) => s.id !== id) : xs));

  return (
    <div className="space-y-5">
      <Card className="print:shadow-none">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Spaces in the building / floor</h2>
          <button onClick={addRow} className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-800 print:hidden">+ Add space</button>
        </div>
        <div className="mt-4 space-y-3">
          {summary.rows.map((row, i) => (
            <div key={row.id} className="grid grid-cols-[1fr_auto_auto] items-end gap-2 sm:grid-cols-[1fr_7rem_4rem_2rem]">
              <label className="block">
                <span className="block text-xs font-medium text-slate-600">Space {i + 1}</span>
                <select className={inputCls} value={spaces[i].spaceSlug}
                  onChange={(e) => update(row.id, { spaceSlug: e.target.value })}>
                  {Object.entries(GROUPED).map(([cat, items]) => (
                    <optgroup key={cat} label={cat}>
                      {items.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-slate-600">Area (sq ft)</span>
                <input type="number" inputMode="numeric" min={0} className={inputCls}
                  value={spaces[i].area}
                  onChange={(e) => update(row.id, { area: Math.max(0, Number(e.target.value) || 0) })} />
              </label>
              <div className="rounded-lg bg-slate-50 px-2 py-2 text-center">
                <div className="text-xs text-slate-600">Load</div>
                <div className="font-bold text-slate-900">{row.load}</div>
              </div>
              <button onClick={() => removeRow(row.id)} aria-label={`Remove space ${i + 1}`}
                className="h-9 rounded-lg border border-slate-300 px-2 text-slate-500 hover:bg-slate-50 print:hidden">×</button>
            </div>
          ))}
        </div>
        <label className="mt-4 flex items-start gap-2 text-sm text-slate-700 print:hidden">
          <input type="checkbox" checked={sprinklered} className="mt-0.5" onChange={(e) => setSprinklered(e.target.checked)} />
          <span>Building has sprinklers <em>and</em> an emergency voice/alarm system (reduces egress width)</span>
        </label>
      </Card>

      <Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total occupant load" value={summary.total} sub="Sum of all spaces (§1004.5)" />
          <Stat label="Min. exits required" value={summary.minExits} sub={summary.total === 0 ? "—" : summary.minExits === 2 ? "2 for 1–500" : summary.minExits === 3 ? "3 for 501–1,000" : "4 for >1,000"} />
          <Stat label="Stair width (total)" value={`${stairW} in`} sub={`${sprinklered ? "0.2" : "0.3"} in/occ`} />
          <Stat label="Door/corridor width" value={`${otherW} in`} sub={`${sprinklered ? "0.15" : "0.2"} in/occ`} />
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Each space&apos;s occupant load is computed from its own Table 1004.5 factor and rounded up, then summed
          for the floor/building total. The minimum number of exits and egress width are sized to that total
          (§1006.3, §1005.3). Mixed-occupancy buildings also have per-space single-exit and separation rules —
          confirm with your AHJ.
        </p>
      </Card>
    </div>
  );
}
