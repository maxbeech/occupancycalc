import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Methodology & Code Sources",
  description: "Exactly which IBC code tables OccupancyCalc uses, how each value was verified, and the limits of the tool.",
  alternates: { canonical: "/methodology" },
};

const SOURCES = [
  { label: "Table 1004.5 — Maximum Floor Area Allowances Per Occupant", url: "https://up.codes/s/areas-without-fixed-seating" },
  { label: "§1005.3 — Required egress capacity (width per occupant)", url: "https://up.codes/s/required-capacity-based-on-occupant-load" },
  { label: "§1006.2.1 / §1006.3 — Exits required & single-exit ceilings", url: "https://up.codes/s/egress-based-on-occupant-load-and-common-path-of-egress-travel-distance" },
  { label: "Table 2902.1 — Minimum plumbing fixtures", url: "https://up.codes/s/minimum-number-of-fixtures" },
];

export default function Methodology() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Methodology", path: "/methodology" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Methodology</h1>
      <p className="text-slate-700">
        OccupancyCalc is built entirely on the {SITE.codeEdition}. Every factor, ratio and threshold is transcribed
        verbatim from the published code and cross-checked against at least two independent authoritative
        reproductions (UpCodes, ICC Digital Codes, and state code-agency adoptions). Nothing is fabricated or
        estimated; where a value differs between code editions, the tool flags it and points you to confirm with
        your jurisdiction.
      </p>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">How each result is computed</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li><strong>Occupant load</strong> = floor area ÷ Table 1004.5 factor, rounded up (§1004.2).</li>
          <li><strong>Exits required</strong>: 1–500 → 2, 501–1,000 → 3, &gt;1,000 → 4 (§1006.3.1); single-exit ceiling by group (Table 1006.2.1: 49 for A/B/E/F/M/U, 29 for S).</li>
          <li><strong>Egress width</strong> = load × 0.3 in (stairs) or 0.2 in (other), reduced to 0.2/0.15 with sprinklers + voice alarm (§1005.3).</li>
          <li><strong>Plumbing fixtures</strong> = load split 50/50 (§2902.2) run through the Table 2902.1 ratios.</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Sources</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {SOURCES.map((s) => (
            <li key={s.url}><a href={s.url} className="text-sky-700 hover:underline" rel="noopener noreferrer" target="_blank">{s.label}</a></li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
        This tool is general information, not engineering or code-compliance advice. Building codes vary by
        jurisdiction and edition and carry local amendments; always confirm with your authority having jurisdiction
        (AHJ) and a licensed design professional before relying on a result for permitting or construction.
      </div>
    </div>
  );
}
