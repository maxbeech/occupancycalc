"use client";

import { useEffect, useRef, useState } from "react";
import { spaceTypesByCategory, getSpaceType } from "@/lib/occupancy-factors";
import { computeOccupantLoad, MAX_AREA } from "@/lib/occupant-load";
import { encodeInputs, decodeInputs } from "@/lib/url";
import { Card, Field, NumberField, Stat, inputCls } from "./ui";

const GROUPED = spaceTypesByCategory();

export function OccupancyTool({ initialSpace = "assembly-unconcentrated-tables-chairs", initialArea = 1500, lockSpace = false }:
  { initialSpace?: string; initialArea?: number; lockSpace?: boolean }) {
  const [space, setSpace] = useState(initialSpace);
  const [area, setArea] = useState(initialArea);
  const [sprinklered, setSprinklered] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from the query string once on mount (keeps the page static SSG).
  useEffect(() => {
    if (hydrated.current || lockSpace) return;
    hydrated.current = true;
    const d = decodeInputs(window.location.search, { space: initialSpace, area: initialArea });
    setSpace(d.space); setArea(d.area);
  }, [initialSpace, initialArea, lockSpace]);

  const result = computeOccupantLoad({ spaceSlug: space, area });
  const st = getSpaceType(space)!;
  if (!result) return null;
  const e = result.egress;
  const stairW = sprinklered ? e.stairWidthReduced : e.stairWidthBase;
  const otherW = sprinklered ? e.otherWidthReduced : e.otherWidthBase;

  function share() {
    const qs = encodeInputs({ space, area });
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
    history.replaceState(null, "", `?${qs}`);
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="print:hidden">
        <h2 className="text-sm font-semibold text-slate-900">Your space</h2>
        <div className="mt-3 space-y-4">
          <Field label="Function of space (IBC Table 1004.5)" hint={st.examples}>
            <select className={inputCls} value={space} aria-label="Function of space"
              disabled={lockSpace}
              onChange={(ev) => setSpace(ev.target.value)}>
              {Object.entries(GROUPED).map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label={`Floor area (${st.basis} sq ft)`} hint={st.basis === "net"
            ? "Net = usable room area only (exclude accessory spaces, fixed equipment)."
            : "Gross = whole floor area inside the exterior walls."}>
            <NumberField value={area} min={0} max={MAX_AREA} step={50} onChange={setArea} ariaLabel="Floor area in square feet" />
          </Field>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={sprinklered} className="mt-0.5"
              aria-label="Sprinklered with voice alarm"
              onChange={(ev) => setSprinklered(ev.target.checked)} />
            <span>Building has sprinklers <em>and</em> an emergency voice/alarm system (reduces required egress width — §1005.3.1/.2)</span>
          </label>
          <div className="flex gap-2">
            <button onClick={share} className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800">
              {copied ? "Link copied ✓" : "Share / save link"}
            </button>
            <button onClick={() => window.print()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Print / PDF
            </button>
          </div>
          <p aria-live="polite" className="sr-only">{copied ? "Link copied to clipboard" : ""}</p>
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Occupant load" value={result.occupantLoad}
              sub={`${area.toLocaleString()} ÷ ${st.factor} ${st.basis} (rounded up, §1004.2)`} />
            <Stat label="Min. exits required" value={e.minExits}
              sub={e.minExits === 2 ? "2 for 1–500 occupants" : e.minExits === 3 ? "3 for 501–1,000" : "4 for >1,000"} />
          </div>
          <div className={`mt-3 rounded-lg p-3 text-sm ${e.canUseSingleExit ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
            {e.canUseSingleExit
              ? `A single exit is permitted: the load (${result.occupantLoad}) is at or below the ${e.singleExitMax}-occupant ceiling for Group ${st.group} (Table 1006.2.1), if the common path of egress travel is within the code limit.`
              : `Two exits are required: the load (${result.occupantLoad}) exceeds the ${e.singleExitMax}-occupant single-exit ceiling for Group ${st.group} (Table 1006.2.1).`}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Required egress capacity (§1005.3)</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Stairways" value={`${stairW} in`} sub={`${sprinklered ? "0.2" : "0.3"} in/occupant total`} />
            <Stat label="Doors / corridors" value={`${otherW} in`} sub={`${sprinklered ? "0.15" : "0.2"} in/occupant total`} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Capacity is the total across all required exits. Absolute minimums still apply: 32 in clear door width
            (§1010.1.1) and 44 in corridors serving 50+ occupants (§1020.3).
          </p>
        </Card>
      </div>
    </div>
  );
}
