import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { spaceTypesByCategory } from "@/lib/occupancy-factors";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Occupant Load by Space Type (IBC Table 1004.5)",
  description: "Occupant-load factors and capacity rules for every function of space in the 2021 IBC — restaurants, offices, retail, assembly, classrooms, warehouses and more.",
  alternates: { canonical: "/occupancy" },
};

export default function OccupancyIndex() {
  const grouped = spaceTypesByCategory();
  return (
    <div>
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "By space", path: "/occupancy" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Occupant load by space type</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Pick a function of space for its IBC Table 1004.5 factor, a worked example, and a calculator pre-set to that use.</p>
      <div className="mt-6 space-y-6">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{cat}</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <Link key={s.slug} href={`/occupancy/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-sky-300">
                  <span className="text-slate-800">{s.label.split("—")[0].trim()}</span>
                  <span className="font-semibold text-slate-900">{s.factor} {s.basis}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
