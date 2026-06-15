import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OccupancyTool } from "@/components/OccupancyTool";
import { FixtureTool } from "@/components/FixtureTool";
import { FactorTable } from "@/components/FactorTable";
import { BuildingTool } from "@/components/BuildingTool";
import { SignTool } from "@/components/SignTool";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { CALCULATORS, getCalculator } from "@/lib/calculators";
import { POSTS } from "@/lib/posts";
import { softwareAppLd } from "@/lib/seo";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) return {};
  return { title: c.title, description: c.description, alternates: { canonical: `/calculators/${slug}` } };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCalculator(slug);
  if (!c) notFound();

  const related = POSTS.filter((p) => p.related === c.slug).slice(0, 3);

  return (
    <div className="space-y-8">
      <JsonLd data={softwareAppLd(c.h1, c.description, `/calculators/${c.slug}`)} />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Calculators", path: "/calculators" }, { name: c.h1, path: `/calculators/${c.slug}` }]} />
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{c.h1}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{c.blurb}</p>
      </header>

      <section>
        {c.focus === "fixtures" ? <FixtureTool />
          : c.focus === "table" ? <FactorTable />
          : c.focus === "building" ? <BuildingTool />
          : c.focus === "sign" ? <SignTool />
          : <OccupancyTool focus={c.focus} />}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {CALCULATORS.filter((o) => o.slug !== c.slug).map((o) => (
          <Link key={o.slug} href={`/calculators/${o.slug}`}
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm hover:border-sky-300">
            <span className="font-medium text-slate-800">{o.h1}</span>
          </Link>
        ))}
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Related guides</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {related.map((p) => (
              <li key={p.slug}><Link href={`/blog/${p.slug}`} className="text-sky-700 hover:underline">{p.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
