# OccupancyCalc

Free building-code occupancy, egress and plumbing-fixture calculators built on the **2021 International Building Code (IBC)**.

- **Occupant load** — floor area ÷ Table 1004.5 factor, rounded up (§1004.2); also dimensions (L×W) and fixed-seat (§1004.6) input
- **Whole-building aggregator** — add every space, sum the load, size exits + egress to the total (the permit workflow)
- **Egress** — minimum exits (§1006.3), single-exit ceilings (Table 1006.2.1), required width (§1005.3), common path, travel distance (Table 1017.2), exit separation (§1007.1.1)
- **Plumbing fixtures** — minimum water closets/lavatories/fountains (Table 2902.1) across 10 occupancies
- **Maximum-occupancy sign** — compute the number and print a clean §1004.9 sign

Every code value is transcribed verbatim and cross-checked against independent authoritative reproductions — nothing is fabricated. See `/methodology` for sources.

## Stack
Next.js 16 (App Router, fully static SSG + 1-week ISR) · React 19 · Tailwind CSS 4. The calculation engine is pure client-side TypeScript in `lib/` (zero server cost). Free calculators need no database; the optional $29 Pro report uses an env-gated Stripe checkout that degrades gracefully.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine unit + fuzz tests (zero deps)
npm run build
```

## Data sources
- IBC Table 1004.5 occupant load factors
- IBC §1005.3 egress capacity, §1006 exits required, Table 1006.2.1 single-exit ceilings
- IBC Table 2902.1 / IPC Table 403.1 plumbing fixtures
- State IBC adoption editions (ICC adoption maps + state agencies)

General information, not engineering or code-compliance advice. Confirm with your AHJ.
