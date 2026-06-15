"use client";

import { useState } from "react";

// Shared form primitives — single source for input styling and the editable
// number field used by every calculator.
export const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-slate-600">{hint}</span>}
    </label>
  );
}

// Editable number field: keeps a raw string while typing, clamps on blur.
// Resync uses the React "adjust state during render" pattern (no effect), which
// is compatible with programmatic value changes (native setter + input event).
export function NumberField({ value, min, max, step = 1, onChange, ariaLabel }:
  { value: number; min: number; max: number; step?: number; onChange: (n: number) => void; ariaLabel?: string }) {
  const [raw, setRaw] = useState(String(value));
  const [last, setLast] = useState(value);
  if (value !== last) { setLast(value); setRaw(String(value)); }
  return (
    <input type="number" inputMode="decimal" min={min} max={max} step={step} className={inputCls} value={raw}
      aria-label={ariaLabel}
      onChange={(e) => {
        setRaw(e.target.value);
        if (e.target.value === "") return;
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
      }}
      onBlur={() => {
        const n = raw === "" ? min : Math.min(max, Math.max(min, Number(raw) || min));
        setRaw(String(n)); onChange(n);
      }} />
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-600">{sub}</div>}
    </div>
  );
}
