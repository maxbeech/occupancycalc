import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-600">
      <JsonLd data={breadcrumbLd(trail)} />
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i < trail.length - 1
              ? <Link href={t.path} className="hover:text-slate-900">{t.name}</Link>
              : <span className="text-slate-700">{t.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
