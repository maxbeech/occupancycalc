import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OccupancyTool } from "@/components/OccupancyTool";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { STATES, getState } from "@/lib/states";
import { softwareAppLd } from "@/lib/seo";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  return {
    title: `${s.name} Occupant Load Calculator & IBC Edition`,
    description: `Calculate occupant load and egress for ${s.name}. ${s.name} is on the ${s.ibcEdition === "varies/home-rule" ? "locally-adopted (home-rule)" : `${s.ibcEdition} IBC`}. ${s.note}`,
    alternates: { canonical: `/states/${slug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();
  const homeRule = s.ibcEdition === "varies/home-rule";

  return (
    <div className="space-y-8">
      <JsonLd data={softwareAppLd(`${s.name} occupant load calculator`, `Occupant load and egress for ${s.name}.`, `/states/${slug}`)} />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "By state", path: "/states" }, { name: s.name, path: `/states/${slug}` }]} />
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{s.name} occupant load calculator</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {homeRule
            ? `${s.name} has no single mandatory statewide commercial building code — cities and counties adopt and amend the IBC locally, so the enforced edition varies.`
            : `${s.name} enforces the ${s.ibcEdition} IBC as its statewide base building code.`}
          {" "}{s.note}
        </p>
        {(homeRule || s.unverified) && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            Always confirm the exact code edition and any local amendments with your authority having jurisdiction (AHJ)
            before relying on a result.
          </p>
        )}
      </header>

      <OccupancyTool />

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p>
          Occupant-load factors (IBC Table 1004.5) are stable across recent IBC editions, so the calculation above
          applies whether your jurisdiction is on the 2015, 2018, 2021 or 2024 IBC. The edition mainly affects
          cross-referenced provisions and amendments — verify specifics with {s.name}&apos;s building department.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Other states</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATES.filter((o) => o.slug !== s.slug).slice(0, 16).map((o) => (
            <Link key={o.slug} href={`/states/${o.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-sky-300">
              {o.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
