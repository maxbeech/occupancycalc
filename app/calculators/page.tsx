import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CALCULATORS } from "@/lib/calculators";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Building-Code Occupancy & Egress Calculators",
  description: "Free occupant load, maximum occupancy, egress width, number-of-exits and plumbing-fixture calculators based on the 2021 IBC.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndex() {
  return (
    <div>
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Calculators", path: "/calculators" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calculators</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Every OccupancyCalc tool, each built on the verbatim 2021 IBC code tables.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CALCULATORS.map((c) => (
          <Link key={c.slug} href={`/calculators/${c.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm">
            <div className="font-semibold text-slate-900">{c.h1}</div>
            <div className="mt-1 text-sm text-slate-500">{c.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
