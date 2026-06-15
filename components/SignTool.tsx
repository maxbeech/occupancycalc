"use client";

import { useState } from "react";
import { spaceTypesByCategory } from "@/lib/occupancy-factors";
import { computeOccupantLoad, MAX_AREA } from "@/lib/occupant-load";
import { Card, Field, NumberField, inputCls } from "./ui";

const GROUPED = spaceTypesByCategory();

// Maximum-occupancy sign generator (IBC §1004.9 requires assembly spaces to post
// the occupant load). Compute the number, then print a clean 8.5×11 sign.
export function SignTool() {
  const [fromCalc, setFromCalc] = useState(true);
  const [space, setSpace] = useState("assembly-unconcentrated-tables-chairs");
  const [area, setArea] = useState(1500);
  const [manual, setManual] = useState(100);

  const calc = computeOccupantLoad({ spaceSlug: space, area });
  const occupancy = fromCalc ? calc?.occupantLoad ?? 0 : manual;

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card className="print:hidden">
        <h2 className="text-sm font-semibold text-slate-900">Your maximum occupancy</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setFromCalc(true)} aria-pressed={fromCalc}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${fromCalc ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>Calculate from area</button>
          <button type="button" onClick={() => setFromCalc(false)} aria-pressed={!fromCalc}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${!fromCalc ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>Enter the number</button>
        </div>
        <div className="mt-4 space-y-4">
          {fromCalc ? (
            <>
              <Field label="Function of space (IBC Table 1004.5)">
                <select className={inputCls} value={space} onChange={(e) => setSpace(e.target.value)}>
                  {Object.entries(GROUPED).map(([cat, items]) => (
                    <optgroup key={cat} label={cat}>
                      {items.map((s) => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field label="Floor area (sq ft)"><NumberField value={area} min={0} max={MAX_AREA} step={50} onChange={setArea} /></Field>
            </>
          ) : (
            <Field label="Maximum occupancy"><NumberField value={manual} min={0} max={1_000_000} step={1} onChange={setManual} /></Field>
          )}
          <button onClick={() => window.print()} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800">
            Print sign (8.5 × 11)
          </button>
          <p className="text-xs text-slate-600">IBC §1004.9 requires assembly occupancies to post an approved sign showing the maximum occupant load near the main exit.</p>
        </div>
      </Card>

      <div>
        <div className="mx-auto w-full max-w-md rounded-2xl border-[6px] border-slate-900 bg-white p-8 text-center shadow-sm print:border-[8px] print:shadow-none">
          <div className="text-lg font-bold uppercase tracking-widest text-slate-900">Maximum</div>
          <div className="text-lg font-bold uppercase tracking-widest text-slate-900">Occupancy</div>
          <div className="my-4 text-7xl font-black tabular-nums text-red-700 print:text-8xl">{occupancy.toLocaleString()}</div>
          <div className="text-xs text-slate-600">Posted in accordance with IBC §1004.9</div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-600 print:hidden">Preview — click “Print sign” for a clean full-page printout.</p>
      </div>
    </div>
  );
}
