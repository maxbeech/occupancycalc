import { spaceTypesByCategory } from "@/lib/occupancy-factors";

// Renders the full IBC Table 1004.5 from the single-source data. Server component.
export function FactorTable() {
  const grouped = spaceTypesByCategory();
  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold text-slate-900">{cat}</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">Function of space</th>
                  <th className="py-2 pr-3 font-medium">Sq ft / occupant</th>
                  <th className="py-2 font-medium">Basis</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.slug} className="border-b border-slate-100">
                    <td className="py-2 pr-3 text-slate-800">{s.label}</td>
                    <td className="py-2 pr-3 font-semibold text-slate-900">{s.factor}</td>
                    <td className="py-2 text-slate-600">{s.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
