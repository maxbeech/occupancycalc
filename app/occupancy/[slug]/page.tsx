import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OccupancyTool } from "@/components/OccupancyTool";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SPACE_TYPES, getSpaceType } from "@/lib/occupancy-factors";
import { SINGLE_EXIT_MAX } from "@/lib/egress";
import { softwareAppLd } from "@/lib/seo";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return SPACE_TYPES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSpaceType(slug);
  if (!s) return {};
  const name = s.label.split("—")[0].trim();
  return {
    title: `${name} Occupant Load (${s.factor} ${s.basis} — IBC)`,
    description: `Calculate the occupant load and capacity of ${name.toLowerCase()} space: IBC Table 1004.5 uses ${s.factor} ${s.basis} sq ft per occupant. Includes exits and egress width required.`,
    alternates: { canonical: `/occupancy/${slug}` },
  };
}

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSpaceType(slug);
  if (!s) notFound();
  const name = s.label.split("—")[0].trim();
  // Example: 3,000 sq ft.
  const exampleArea = 3000;
  const exampleLoad = Math.ceil(exampleArea / s.factor);

  return (
    <div className="space-y-8">
      <JsonLd data={softwareAppLd(`${name} occupant load`, `Occupant load for ${name} — ${s.factor} ${s.basis} sq ft/occupant.`, `/occupancy/${slug}`)} />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "By space", path: "/occupancy" }, { name, path: `/occupancy/${slug}` }]} />
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{name} occupant load</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The {s.label} factor in IBC Table 1004.5 is <strong>{s.factor} {s.basis} square feet per occupant</strong>.
          {" "}{s.examples ? `Typical spaces: ${s.examples}.` : ""} For example, a {exampleArea.toLocaleString()} {s.basis} sq ft
          space holds {exampleLoad} occupants ({exampleArea.toLocaleString()} ÷ {s.factor}, rounded up).
        </p>
      </header>

      <OccupancyTool initialSpace={s.slug} initialArea={exampleArea} lockSpace />

      <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h2 className="text-base font-semibold text-slate-900">What this means for egress</h2>
        <p className="mt-2">
          A single exit is allowed for {name.toLowerCase()} (Group {s.group}) only up to {SINGLE_EXIT_MAX[s.group]} occupants
          (IBC Table 1006.2.1); above that, two exits are required. Required egress width is 0.3 in/occupant for
          stairways and 0.2 in/occupant for doors and corridors (§1005.3).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Other space types</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPACE_TYPES.filter((o) => o.category === s.category && o.slug !== s.slug).map((o) => (
            <Link key={o.slug} href={`/occupancy/${o.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-sky-300">
              {o.label.split("—")[0].trim()}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
