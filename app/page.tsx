import Link from "next/link";
import { OccupancyTool } from "@/components/OccupancyTool";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { CALCULATORS } from "@/lib/calculators";
import { SPACE_TYPES } from "@/lib/occupancy-factors";
import { softwareAppLd, faqLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 604800; // ISR: 1 week — content is static code data

const FAQS = [
  { q: "How is occupant load calculated?", a: "Occupant load is the floor area divided by the IBC Table 1004.5 maximum floor-area-per-occupant factor for that use, rounded up to the next whole person (IBC §1004.2). A 1,500 sq ft restaurant dining area at 15 net sq ft/person holds 100 occupants." },
  { q: "What is the difference between gross and net floor area?", a: "Gross floor area is measured within the exterior walls (used for business, mercantile and storage factors); net floor area is the actual usable room area excluding accessory spaces and fixed equipment (used for the dense assembly and classroom factors)." },
  { q: "When does a space need two exits?", a: "For Groups A, B, E, F, M and U a space may use a single exit only when its occupant load is 49 or fewer (Table 1006.2.1) and the common path of travel is within the code limit. At 50 occupants a second exit is required." },
  { q: "Is OccupancyCalc based on the current code?", a: `Yes — every factor is transcribed verbatim from the ${SITE.codeEdition} (Table 1004.5, §1005.3, §1006, Table 2902.1) and cross-checked against independent reproductions. Always confirm the edition and any amendments your local jurisdiction enforces.` },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <JsonLd data={[softwareAppLd(SITE.name, SITE.description, "/"), faqLd(FAQS)]} />
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Occupant load & egress calculator
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Free building-code calculators built on the {SITE.codeEdition}. Find the maximum occupant load of any
          space, the exits and egress width it requires, and the minimum plumbing fixtures — with the exact code
          section shown for every result.
        </p>
      </section>

      <section>
        <OccupancyTool />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">All calculators</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} href={`/calculators/${c.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-sky-300 hover:shadow-sm">
              <div className="font-medium text-slate-900">{c.h1}</div>
              <div className="mt-1 text-sm text-slate-500">{c.description.slice(0, 90)}…</div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">By space type</h2>
        <p className="mt-1 text-sm text-slate-500">Jump straight to the occupant-load factor and rules for a specific use.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SPACE_TYPES.slice(0, 18).map((s) => (
            <Link key={s.slug} href={`/occupancy/${s.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-sky-300">
              {s.label.split("—")[0].trim()}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Frequently asked</h2>
        <div className="mt-4"><Faq items={FAQS} /></div>
      </section>
    </div>
  );
}
