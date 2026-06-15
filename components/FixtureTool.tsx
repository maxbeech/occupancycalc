"use client";

import { useState } from "react";
import { FIXTURE_OCCUPANCIES, getFixtureOccupancy, computeFixtures } from "@/lib/fixtures";
import { Card, Field, NumberField, Stat, inputCls } from "./ui";

export function FixtureTool({ initialOcc = "restaurant", initialLoad = 200 }:
  { initialOcc?: string; initialLoad?: number }) {
  const [occSlug, setOccSlug] = useState(initialOcc);
  const [load, setLoad] = useState(initialLoad);
  const occ = getFixtureOccupancy(occSlug)!;
  const f = computeFixtures(occ, load);

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="print:hidden">
        <h2 className="text-sm font-semibold text-slate-900">Occupancy & load</h2>
        <div className="mt-3 space-y-4">
          <Field label="Occupancy (IBC Table 2902.1)" hint={occ.examples}>
            <select className={inputCls} value={occSlug} onChange={(ev) => setOccSlug(ev.target.value)}>
              {FIXTURE_OCCUPANCIES.map((o) => <option key={o.slug} value={o.slug}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Occupant load (people)" hint="Split 50/50 male/female per IPC §403.1.1.">
            <NumberField value={load} min={0} max={1_000_000} step={10} onChange={setLoad} />
          </Field>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Ratios used: WC {occ.wcMale.label} (M) / {occ.wcFemale.label} (F); lavatories {occ.lavMale.label};
            drinking fountain 1 per {occ.drinkingFountainPer}; service sink {occ.serviceSinks}.
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Water closets (M)" value={f.wcMale} />
            <Stat label="Water closets (F)" value={f.wcFemale} />
            <Stat label="Lavatories (M)" value={f.lavMale} />
            <Stat label="Lavatories (F)" value={f.lavFemale} />
            <Stat label="Drinking fountains" value={f.drinkingFountains} />
            <Stat label="Service sinks" value={f.serviceSinks} />
          </div>
          <p className="mt-3 text-xs text-slate-600">Per-sex load: {f.perSex} (half of {load.toLocaleString()}, rounded up).</p>
        </Card>
        {occ.verify && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Note: the lavatory and drinking-fountain ratios for this occupancy changed between recent IBC
            editions. Confirm the exact values against the IBC Table 2902.1 edition adopted in your jurisdiction.
          </div>
        )}
      </div>
    </div>
  );
}
