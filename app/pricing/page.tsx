import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckoutButton } from "@/components/CheckoutButton";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Pricing — Free Calculators & Pro Code Reports",
  description: "OccupancyCalc is free. Pro generates a permit-ready occupant-load & egress report PDF with the code citations.",
  alternates: { canonical: "/pricing" },
};

export default function Pricing() {
  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium uppercase tracking-wide text-slate-500">Free</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$0</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>✓ Every occupant-load, egress & fixture calculator</li>
            <li>✓ All space types, states and code references</li>
            <li>✓ Shareable links + print/PDF of any result</li>
          </ul>
        </div>
        <div className="rounded-xl border border-sky-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-medium uppercase tracking-wide text-sky-700">Pro report</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">$29<span className="text-base font-normal text-slate-500"> one-off</span></div>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>✓ Permit-ready occupant-load & egress report (PDF)</li>
            <li>✓ Per-space breakdown with code citations</li>
            <li>✓ Plumbing-fixture schedule</li>
          </ul>
          <div className="mt-5"><CheckoutButton /></div>
        </div>
      </div>
    </div>
  );
}
