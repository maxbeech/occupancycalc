"use client";

import { useState } from "react";

// Env-gated Stripe checkout. Degrades gracefully to an early-access notice when
// Stripe keys are not configured (the /api/checkout route returns 503).
export function CheckoutButton({ label = "Get the Pro report" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function go() {
    setBusy(true); setNote("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.ok) {
        const { url } = await res.json();
        if (url) { window.location.href = url; return; }
      }
      setNote("Pro reports are launching shortly — check back soon.");
    } catch {
      setNote("Pro reports are launching shortly — check back soon.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={busy}
        className="rounded-lg bg-sky-700 px-4 py-2.5 font-medium text-white hover:bg-sky-800 disabled:opacity-60">
        {busy ? "One moment…" : label}
      </button>
      {note && <p className="mt-2 text-sm text-slate-600">{note}</p>}
    </div>
  );
}
