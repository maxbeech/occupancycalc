import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { POSTS } from "@/lib/posts";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Occupancy & Egress Code Guides",
  description: "Plain-language guides to occupant load, egress, exits and plumbing fixtures under the IBC.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Guides", path: "/blog" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Code guides</h1>
      <p className="mt-2 max-w-2xl text-slate-600">Practical, code-cited explanations of occupant load, egress and fixtures.</p>
      <div className="mt-6 space-y-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-sky-300 hover:shadow-sm">
            <div className="font-semibold text-slate-900">{p.title}</div>
            <div className="mt-1 text-sm text-slate-500">{p.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
