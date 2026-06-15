import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";
import { SPACE_TYPES } from "@/lib/occupancy-factors";
import { STATES } from "@/lib/states";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(SITE.updated);
  const urls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: updated, priority: 1 },
    { url: `${SITE.url}/calculators`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/occupancy`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/states`, lastModified: updated, priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: updated, priority: 0.7 },
    { url: `${SITE.url}/pricing`, lastModified: updated, priority: 0.5 },
    { url: `${SITE.url}/methodology`, lastModified: updated, priority: 0.5 },
  ];
  for (const c of CALCULATORS) urls.push({ url: `${SITE.url}/calculators/${c.slug}`, lastModified: updated, priority: 0.9 });
  for (const s of SPACE_TYPES) urls.push({ url: `${SITE.url}/occupancy/${s.slug}`, lastModified: updated, priority: 0.7 });
  for (const s of STATES) urls.push({ url: `${SITE.url}/states/${s.slug}`, lastModified: updated, priority: 0.6 });
  for (const p of POSTS) urls.push({ url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 });
  return urls;
}
