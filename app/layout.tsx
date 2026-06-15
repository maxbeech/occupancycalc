import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-700 text-sm text-white">▦</span>
          Occupancy<span className="text-sky-700">Calc</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600 sm:gap-5">
          <Link href="/calculators" className="hover:text-slate-900">Calculators</Link>
          <Link href="/occupancy" className="hidden hover:text-slate-900 sm:inline">By space</Link>
          <Link href="/states" className="hidden hover:text-slate-900 sm:inline">By state</Link>
          <Link href="/blog" className="hidden hover:text-slate-900 sm:inline">Guides</Link>
          <Link href="/pricing" className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700">Pro</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 print:hidden">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/calculators/occupant-load-calculator" className="hover:text-slate-900">Occupant load</Link>
          <Link href="/calculators/maximum-occupancy-calculator" className="hover:text-slate-900">Maximum occupancy</Link>
          <Link href="/calculators/egress-width-calculator" className="hover:text-slate-900">Egress width</Link>
          <Link href="/calculators/number-of-exits-calculator" className="hover:text-slate-900">Number of exits</Link>
          <Link href="/calculators/plumbing-fixture-calculator" className="hover:text-slate-900">Plumbing fixtures</Link>
          <Link href="/calculators/occupant-load-factor-table" className="hover:text-slate-900">Factor table</Link>
          <Link href="/occupancy" className="hover:text-slate-900">By space</Link>
          <Link href="/states" className="hover:text-slate-900">By state</Link>
          <Link href="/blog" className="hover:text-slate-900">Guides</Link>
          <Link href="/methodology" className="hover:text-slate-900">Methodology</Link>
        </div>
        <p className="mt-4 max-w-2xl text-xs text-slate-500">
          {SITE.name} provides free building-code occupancy, egress and plumbing-fixture calculators based on the
          {" "}{SITE.codeEdition}. It is general information, not engineering or code-compliance advice — building
          codes vary by jurisdiction and edition and carry local amendments, so confirm any figure with your
          authority having jurisdiction (AHJ) before relying on it. © 2026 {SITE.name}.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
