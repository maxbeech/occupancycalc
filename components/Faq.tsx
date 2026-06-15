export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((i) => (
        <details key={i.q} className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900 focus-visible:ring-2 focus-visible:ring-sky-200">
            {i.q}
            <span aria-hidden className="ml-3 text-slate-400 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-2 text-sm text-slate-600">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
