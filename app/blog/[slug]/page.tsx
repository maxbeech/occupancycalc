import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { POSTS, getPost } from "@/lib/posts";
import { getCalculator } from "@/lib/calculators";
import { SITE } from "@/lib/site";

export const revalidate = 604800;
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/blog/${slug}` } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const cta = p.related ? getCalculator(p.related) : undefined;
  const ld = {
    "@context": "https://schema.org", "@type": "Article", headline: p.title,
    description: p.description, datePublished: p.date, author: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="mx-auto max-w-2xl">
      <JsonLd data={ld} />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }, { name: p.title, path: `/blog/${slug}` }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.title}</h1>
      <div className="prose prose-slate mt-6 max-w-none">
        {p.body.map((sec, i) => (
          <div key={i} className="mb-5">
            {sec.h && <h2 className="text-xl font-semibold text-slate-900">{sec.h}</h2>}
            <p className="mt-2 text-slate-700">{sec.p}</p>
          </div>
        ))}
      </div>
      {cta && (
        <div className="mt-8 rounded-xl border border-sky-200 bg-sky-50 p-5">
          <div className="font-medium text-slate-900">Try the {cta.h1}</div>
          <Link href={`/calculators/${cta.slug}`} className="mt-2 inline-block text-sky-700 hover:underline">Open the calculator →</Link>
        </div>
      )}
    </article>
  );
}
