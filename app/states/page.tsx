import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { STATES } from "@/lib/states";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "IBC Adoption & Occupant Load Rules by State",
  description: "Which edition of the International Building Code each U.S. state has adopted, with an occupant-load calculator for every state.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div>
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "By state", path: "/states" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Occupant load & IBC adoption by state</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        The occupant-load factors are part of the model IBC, which states adopt by edition (with local amendments).
        Find the edition your state enforces, then calculate occupant load and egress.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((s) => (
          <Link key={s.slug} href={`/states/${s.slug}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-sky-300">
            <span className="text-slate-800">{s.name}</span>
            <span className="text-xs font-medium text-slate-500">{s.ibcEdition === "varies/home-rule" ? "home-rule" : `${s.ibcEdition} IBC`}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
