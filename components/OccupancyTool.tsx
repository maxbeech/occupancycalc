"use client";

import { useEffect, useRef, useState } from "react";
import { spaceTypesByCategory, getSpaceType } from "@/lib/occupancy-factors";
import { computeOccupantLoad, fixedSeatLoad, MAX_AREA, type SeatingKind } from "@/lib/occupant-load";
import { encodeInputs, decodeInputs } from "@/lib/url";
import { Card, Field, NumberField, Stat, inputCls } from "./ui";
import { EgressDetails } from "./EgressDetails";

const GROUPED = spaceTypesByCategory();
type Focus = "occupant-load" | "egress" | "exits";
type Mode = "area" | "dims" | "seats";

export function OccupancyTool({ initialSpace = "assembly-unconcentrated-tables-chairs", initialArea = 1500, lockSpace = false, focus = "occupant-load" }:
  { initialSpace?: string; initialArea?: number; lockSpace?: boolean; focus?: Focus }) {
  const [space, setSpace] = useState(initialSpace);
  const [mode, setMode] = useState<Mode>("area");
  const [area, setArea] = useState(initialArea);
  const [length, setLength] = useState(50);
  const [width, setWidth] = useState(30);
  const [seatKind, setSeatKind] = useState<SeatingKind>("seats");
  const [seatVal, setSeatVal] = useState(100);
  const [sprinklered, setSprinklered] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || lockSpace) return;
    hydrated.current = true;
    const d = decodeInputs(window.location.search, { space: initialSpace, area: initialArea, sprinklered: false });
    setSpace(d.space); setArea(d.area); setSprinklered(d.sprinklered);
  }, [initialSpace, initialArea, lockSpace]);

  const st = getSpaceType(space)!;
  const effArea = mode === "dims" ? length * width : area;
  const fixedOccupants = mode === "seats" ? fixedSeatLoad(seatKind, seatVal) : undefined;
  const result = computeOccupantLoad({ spaceSlug: space, area: effArea, fixedOccupants });
  if (!result) return null;
  const e = result.egress;
  const stairW = sprinklered ? e.stairWidthReduced : e.stairWidthBase;
  const otherW = sprinklered ? e.otherWidthReduced : e.otherWidthBase;
  const perExit = e.minExits > 0 ? Math.ceil((otherW / e.minExits) * 10) / 10 : 0;

  function share() {
    const qs = encodeInputs({ space, area: effArea, sprinklered, fixedOccupants });
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
    history.replaceState(null, "", `?${qs}`);
  }

  const MODES: { m: Mode; label: string }[] = [
    { m: "area", label: "Total area" },
    { m: "dims", label: "Length × width" },
    { m: "seats", label: "Fixed seats" },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="print:hidden">
        <h2 className="text-sm font-semibold text-slate-900">Your space</h2>
        <div className="mt-3 space-y-4">
          <Field label="Function of space (IBC Table 1004.5)" hint={st.examples}>
            <select className={inputCls} value={space} disabled={lockSpace} onChange={(ev) => setSpace(ev.target.value)}>
              {Object.entries(GROUPED).map(([cat, items]) => (
                <optgroup key={cat} label={cat}>
                  {items.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="How to enter the size">
            {MODES.map(({ m, label }) => (
              <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${mode === m ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === "area" && (
            <Field label={`Floor area (${st.basis} sq ft)`} hint={st.basis === "net"
              ? "Net = usable room area only (exclude accessory spaces, fixed equipment)."
              : "Gross = whole floor area inside the exterior walls."}>
              <NumberField value={area} min={0} max={MAX_AREA} step={50} onChange={setArea} />
            </Field>
          )}
          {mode === "dims" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Length (ft)"><NumberField value={length} min={0} max={10000} step={1} onChange={setLength} /></Field>
              <Field label="Width (ft)"><NumberField value={width} min={0} max={10000} step={1} onChange={setWidth} /></Field>
              <p className="col-span-2 text-xs text-slate-600">Area = {(length * width).toLocaleString()} {st.basis} sq ft.</p>
            </div>
          )}
          {mode === "seats" && (
            <div className="space-y-3">
              <Field label="Fixed seating type (§1004.6)">
                <select className={inputCls} value={seatKind} onChange={(ev) => setSeatKind(ev.target.value as SeatingKind)}>
                  <option value="seats">Individual fixed seats (count)</option>
                  <option value="bench">Bench / pew length (inches)</option>
                  <option value="booth">Booth seat length (inches)</option>
                </select>
              </Field>
              <Field label={seatKind === "seats" ? "Number of fixed seats" : "Total seating length (inches)"}
                hint={seatKind === "bench" ? "1 person per 18 in" : seatKind === "booth" ? "1 person per 24 in (at the backrest)" : undefined}>
                <NumberField value={seatVal} min={0} max={1_000_000} step={1} onChange={setSeatVal} />
              </Field>
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={sprinklered} className="mt-0.5" onChange={(ev) => setSprinklered(ev.target.checked)} />
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
              sub={result.derivedFrom === "fixed" ? "From fixed seating (§1004.6)" : `${effArea.toLocaleString()} ÷ ${st.factor} ${st.basis} (rounded up, §1004.2)`} />
            <Stat label="Min. exits required" value={e.minExits}
              sub={result.occupantLoad === 0 ? "—" : e.minExits === 2 ? "2 for 1–500 occupants" : e.minExits === 3 ? "3 for 501–1,000" : "4 for >1,000"} />
          </div>
          {result.occupantLoad > 0 && (
            <div className={`mt-3 rounded-lg p-3 text-sm ${e.canUseSingleExit ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
              {e.canUseSingleExit
                ? `A single exit is permitted: the load (${result.occupantLoad}) is at or below the ${e.singleExitMax}-occupant ceiling for Group ${st.group} (Table 1006.2.1), if the common path of egress travel is within the code limit.`
                : `Two exits are required: the load (${result.occupantLoad}) exceeds the ${e.singleExitMax}-occupant single-exit ceiling for Group ${st.group} (Table 1006.2.1).`}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-slate-900">Required egress capacity (§1005.3)</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Stairways (total)" value={`${stairW} in`} sub={`${sprinklered ? "0.2" : "0.3"} in/occupant`} />
            <Stat label="Doors / corridors (total)" value={`${otherW} in`} sub={`${sprinklered ? "0.15" : "0.2"} in/occupant`} />
          </div>
          {result.occupantLoad > 0 && (
            <p className="mt-3 text-xs text-slate-600">
              Split across {e.minExits} required exits, that is about <strong>{perExit} in</strong> per exit door — but each
              door must still give at least 32 in clear width (§1010.1.1) and corridors serving 50+ occupants at least 44 in (§1020.3).
            </p>
          )}
        </Card>

        {(focus === "egress" || focus === "exits") && result.occupantLoad > 0 && (
          <EgressDetails e={e} sprinklered={sprinklered} />
        )}
      </div>
    </div>
  );
}
