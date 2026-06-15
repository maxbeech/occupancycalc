// Minimum plumbing fixtures — IBC 2021 Table 2902.1 (restates IPC Table 403.1).
//
// Ratios are transcribed from the 2021 IBC / IPC Table 403.1 and cross-checked
// across multiple state adoptions (Michigan/Texas/Louisiana up.codes IPC-2021).
// IBC §2902.1.1 (IPC §403.1.1) distributes the occupant load equally (50/50)
// between the sexes unless approved statistical data justifies otherwise. A
// drinking fountain is not required for an occupant load of 15 or fewer
// (IPC §410.2). Institutional (I) rows are intentionally omitted — they could
// only be confirmed to a single source. Nothing fabricated.
//
// Source: https://up.codes/s/minimum-number-of-fixtures (+ state IPC-2021 adoptions)

export interface FixtureRule {
  // returns the minimum count for a given per-sex occupant load
  fn: (perSex: number) => number;
  label: string; // e.g. "1 per 75"
}

export interface FixtureOccupancy {
  slug: string;
  label: string;
  group: string; // IBC occupancy classification, e.g. "A-2"
  examples: string;
  wcMale: FixtureRule;
  wcFemale: FixtureRule;
  lavMale: FixtureRule;
  lavFemale: FixtureRule;
  drinkingFountainPer: number; // 1 per N total occupants
  serviceSinks: number;
  verify?: boolean; // edition discrepancy on some ratios — show a verify note
}

// "1 per N" → ceil(load / N), but at least 1 fixture once any occupants exist.
function per(n: number): FixtureRule {
  return { fn: (load) => (load <= 0 ? 0 : Math.max(1, Math.ceil(load / n))), label: `1 per ${n}` };
}

// Business water-closet / lavatory: "1 per 25 for the first 50 and 1 per 50 for
// the remainder exceeding 50" (male WC), "1 per 40 for the first 80 and 1 per 80
// for the remainder exceeding 80" (female WC + both lavatories).
function piecewise(firstN: number, firstCount: number, restN: number): FixtureRule {
  return {
    fn: (load) => {
      if (load <= 0) return 0;
      if (load <= firstCount) return Math.max(1, Math.ceil(load / firstN));
      const base = Math.ceil(firstCount / firstN);
      return base + Math.ceil((load - firstCount) / restN);
    },
    label: `1 per ${firstN} (first ${firstCount}), then 1 per ${restN}`,
  };
}

export const FIXTURE_OCCUPANCIES: FixtureOccupancy[] = [
  {
    slug: "restaurant", label: "Restaurant / banquet hall / food court (A-2)", group: "A-2",
    examples: "Sit-down restaurants, cafeterias, banquet halls, food courts",
    wcMale: per(75), wcFemale: per(75), lavMale: per(200), lavFemale: per(200),
    drinkingFountainPer: 500, serviceSinks: 1,
  },
  {
    slug: "nightclub-bar", label: "Nightclub / bar / tavern / dance hall (A-2)", group: "A-2",
    examples: "Bars, nightclubs, taverns, dance halls",
    wcMale: per(40), wcFemale: per(40), lavMale: per(75), lavFemale: per(75),
    drinkingFountainPer: 500, serviceSinks: 1,
  },
  {
    slug: "theater", label: "Theater / performing arts, fixed seats (A-1)", group: "A-1",
    examples: "Movie theaters, performing-arts theaters, concert halls",
    wcMale: per(125), wcFemale: per(65), lavMale: per(200), lavFemale: per(200),
    drinkingFountainPer: 500, serviceSinks: 1,
  },
  {
    slug: "assembly-a3", label: "Auditorium, museum, library, gym, gallery (A-3)", group: "A-3",
    examples: "Auditoriums without fixed seats, museums, libraries, art galleries, gyms, exhibition halls",
    wcMale: per(125), wcFemale: per(65), lavMale: per(200), lavFemale: per(200),
    drinkingFountainPer: 500, serviceSinks: 1,
  },
  {
    slug: "worship", label: "Place of worship (A-3)", group: "A-3",
    examples: "Churches, temples, mosques, synagogues",
    wcMale: per(150), wcFemale: per(75), lavMale: per(200), lavFemale: per(200),
    drinkingFountainPer: 1000, serviceSinks: 1,
  },
  {
    slug: "business", label: "Business / office (B)", group: "B",
    examples: "Offices, professional services, banks, outpatient clinics",
    wcMale: piecewise(25, 50, 50), wcFemale: piecewise(40, 80, 80),
    lavMale: per(100), lavFemale: per(100),
    drinkingFountainPer: 100, serviceSinks: 1,
  },
  {
    slug: "educational", label: "Educational (E)", group: "E",
    examples: "Schools, classrooms (grades K–12 typical)",
    wcMale: per(50), wcFemale: per(50), lavMale: per(100), lavFemale: per(100),
    drinkingFountainPer: 100, serviceSinks: 1,
  },
  {
    slug: "mercantile", label: "Mercantile / retail (M)", group: "M",
    examples: "Retail stores, shops, markets, showrooms",
    wcMale: per(500), wcFemale: per(750), lavMale: per(1000), lavFemale: per(1000),
    drinkingFountainPer: 1000, serviceSinks: 1,
  },
  {
    slug: "factory", label: "Factory / industrial (F-1, F-2)", group: "F",
    examples: "Manufacturing, assembly, fabrication, processing plants",
    wcMale: per(100), wcFemale: per(100), lavMale: per(400), lavFemale: per(400),
    drinkingFountainPer: 400, serviceSinks: 1,
  },
  {
    slug: "storage", label: "Storage / warehouse (S-1, S-2)", group: "S",
    examples: "Warehouses, storage buildings, parking garages",
    wcMale: per(100), wcFemale: per(100), lavMale: per(1000), lavFemale: per(1000),
    drinkingFountainPer: 1000, serviceSinks: 1,
  },
];

export function getFixtureOccupancy(slug: string): FixtureOccupancy | undefined {
  return FIXTURE_OCCUPANCIES.find((o) => o.slug === slug);
}

export interface FixtureResult {
  wcMale: number; wcFemale: number;
  lavMale: number; lavFemale: number;
  drinkingFountains: number; serviceSinks: number;
  perSex: number;
}

// IBC §2902.2: split the occupant load 50/50 male/female by default.
export function computeFixtures(occ: FixtureOccupancy, occupantLoad: number): FixtureResult {
  const ol = Math.max(0, Math.floor(Number.isFinite(occupantLoad) ? occupantLoad : 0));
  const perSex = Math.ceil(ol / 2);
  return {
    wcMale: occ.wcMale.fn(perSex),
    wcFemale: occ.wcFemale.fn(perSex),
    lavMale: occ.lavMale.fn(perSex),
    lavFemale: occ.lavFemale.fn(perSex),
    drinkingFountains: ol <= 0 ? 0 : Math.max(1, Math.ceil(ol / occ.drinkingFountainPer)),
    serviceSinks: ol <= 0 ? 0 : occ.serviceSinks,
    perSex,
  };
}
