import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">That page doesn&apos;t exist. Try a calculator instead.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/" className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white hover:bg-sky-800">Home</Link>
        <Link href="/calculators" className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Calculators</Link>
      </div>
    </div>
  );
}
