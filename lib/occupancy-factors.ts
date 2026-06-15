// IBC 2021 Table 1004.5 — Maximum Floor Area Allowances Per Occupant.
//
// Every factor below is transcribed VERBATIM from the published 2021 IBC and
// cross-checked against two independent authoritative reproductions (up.codes
// 2021 IBC + Washington WAC 51-54A-1004, which adopts the 2021 IBC). Nothing is
// fabricated. Washington-only amendment rows (billiard/transit platform) are
// deliberately excluded because they are not base 2021 IBC. Rows that the printed
// table resolves by cross-reference rather than a numeric factor (assembly WITH
// fixed seats §1004.6, concentrated business use §1004.8, covered/open malls
// §402.8.2) are handled separately in copy, not as a divide-by factor.
//
// Sources:
//   https://up.codes/s/areas-without-fixed-seating
//   https://codes.iccsafe.org/s/IBC2021P1/chapter-10-means-of-egress/IBC2021P1-Ch10-Sec1004.5

export type Basis = "gross" | "net";

// IBC occupancy group used for the single-exit ceiling (Table 1006.2.1) — NOT
// for the load factor. Most common groups (A,B,E,F,M,U) share a 49-occupant
// single-exit ceiling; S = 29; R/I/H groups are lower (see egress.ts).
export type OccGroup = "A" | "B" | "E" | "F" | "M" | "U" | "S" | "R" | "I" | "H";

export interface SpaceType {
  slug: string;
  label: string; // exactly as printed in Table 1004.5
  factor: number; // square feet per occupant
  basis: Basis;
  group: OccGroup; // for the single-exit-ceiling lookup
  category: string; // grouping for the UI dropdown
  examples?: string; // plain-language examples for SEO copy
}

export const SPACE_TYPES: SpaceType[] = [
  // Assembly (the highest-density, permit-critical group)
  { slug: "assembly-unconcentrated-tables-chairs", label: "Assembly, no fixed seats — unconcentrated (tables and chairs)", factor: 15, basis: "net", group: "A", category: "Assembly", examples: "Restaurants, dining rooms, banquet seating, conference rooms" },
  { slug: "assembly-concentrated-chairs", label: "Assembly, no fixed seats — concentrated (chairs only, not fixed)", factor: 7, basis: "net", group: "A", category: "Assembly", examples: "Auditoriums, lecture halls, places of worship, theaters without fixed seats" },
  { slug: "assembly-standing-space", label: "Assembly, no fixed seats — standing space", factor: 5, basis: "net", group: "A", category: "Assembly", examples: "Bars, nightclubs, dance floors, waiting/standing areas" },
  { slug: "gaming-floors", label: "Assembly — gaming floors (keno, slots, etc.)", factor: 11, basis: "gross", group: "A", category: "Assembly", examples: "Casino gaming floors" },
  { slug: "exhibit-gallery-museum", label: "Assembly — exhibit gallery and museum", factor: 30, basis: "net", group: "A", category: "Assembly", examples: "Museums, art galleries, exhibit halls" },
  { slug: "stages-platforms", label: "Stages and platforms", factor: 15, basis: "net", group: "A", category: "Assembly", examples: "Performance stages, raised platforms" },
  { slug: "bowling-centers", label: "Bowling centers (5 persons per lane incl. 15 ft of runway, plus remaining area)", factor: 7, basis: "net", group: "A", category: "Assembly", examples: "Bowling alleys" },
  { slug: "skating-rink-pool", label: "Skating rinks, swimming pools — rink and pool", factor: 50, basis: "gross", group: "A", category: "Recreation", examples: "Ice rinks, swimming pool water surface" },
  { slug: "skating-pool-decks", label: "Skating rinks, swimming pools — decks", factor: 15, basis: "gross", group: "A", category: "Recreation", examples: "Pool decks, rink decks" },
  { slug: "exercise-rooms", label: "Exercise rooms", factor: 50, basis: "gross", group: "A", category: "Recreation", examples: "Gyms, fitness studios, weight rooms" },

  // Business
  { slug: "business-areas", label: "Business areas", factor: 150, basis: "gross", group: "B", category: "Business", examples: "Offices, professional services, banks, clinics (outpatient)" },
  { slug: "concentrated-business", label: "Concentrated business use (§1004.8)", factor: 50, basis: "gross", group: "B", category: "Business", examples: "Call centers, trading floors, data-processing centers — denser than typical offices" },
  { slug: "courtrooms", label: "Courtrooms — other than fixed seating areas", factor: 40, basis: "net", group: "B", category: "Business", examples: "Courtroom well and gallery standing areas" },

  // Mercantile
  { slug: "mercantile", label: "Mercantile", factor: 60, basis: "gross", group: "M", category: "Mercantile", examples: "Retail stores, shops, showrooms, markets" },
  { slug: "mercantile-storage", label: "Mercantile — storage, stock, shipping areas", factor: 300, basis: "gross", group: "M", category: "Mercantile", examples: "Back-of-house stockrooms, shipping/receiving" },

  // Educational
  { slug: "classroom", label: "Educational — classroom area", factor: 20, basis: "net", group: "E", category: "Educational", examples: "School classrooms, training rooms" },
  { slug: "vocational-shops", label: "Educational — shops and other vocational room areas", factor: 50, basis: "net", group: "E", category: "Educational", examples: "Wood/metal shops, labs, vocational rooms" },
  { slug: "day-care", label: "Day care", factor: 35, basis: "net", group: "E", category: "Educational", examples: "Daycare centers, preschool rooms" },
  { slug: "library-reading", label: "Library — reading rooms", factor: 50, basis: "net", group: "B", category: "Educational", examples: "Library reading rooms" },
  { slug: "library-stacks", label: "Library — stack area", factor: 100, basis: "gross", group: "B", category: "Educational", examples: "Library book stacks" },

  // Institutional
  { slug: "inst-inpatient", label: "Institutional — inpatient treatment areas", factor: 240, basis: "gross", group: "I", category: "Institutional", examples: "Hospital inpatient treatment areas" },
  { slug: "inst-outpatient", label: "Institutional — outpatient areas", factor: 100, basis: "gross", group: "I", category: "Institutional", examples: "Outpatient clinic treatment areas" },
  { slug: "inst-sleeping", label: "Institutional — sleeping areas", factor: 120, basis: "gross", group: "I", category: "Institutional", examples: "Hospital/nursing-home sleeping rooms" },

  // Industrial / storage
  { slug: "industrial-areas", label: "Industrial areas", factor: 100, basis: "gross", group: "F", category: "Industrial & Storage", examples: "Factory and manufacturing floors" },
  { slug: "h5-fabrication", label: "Group H-5 fabrication and manufacturing areas", factor: 200, basis: "gross", group: "H", category: "Industrial & Storage", examples: "Semiconductor / HPM fabrication areas" },
  { slug: "kitchens-commercial", label: "Kitchens, commercial", factor: 200, basis: "gross", group: "A", category: "Industrial & Storage", examples: "Commercial / restaurant kitchens" },
  { slug: "accessory-storage-mechanical", label: "Accessory storage areas, mechanical equipment room", factor: 300, basis: "gross", group: "S", category: "Industrial & Storage", examples: "Mechanical/electrical rooms, accessory storage" },
  { slug: "warehouses", label: "Warehouses", factor: 500, basis: "gross", group: "S", category: "Industrial & Storage", examples: "Warehouse storage" },
  { slug: "aircraft-hangars", label: "Aircraft hangars", factor: 500, basis: "gross", group: "S", category: "Industrial & Storage", examples: "Aircraft storage hangars" },
  { slug: "agricultural-building", label: "Agricultural building", factor: 300, basis: "gross", group: "U", category: "Industrial & Storage", examples: "Barns, agricultural utility buildings" },
  { slug: "parking-garages", label: "Parking garages", factor: 200, basis: "gross", group: "S", category: "Industrial & Storage", examples: "Parking structures" },

  // Residential / lodging
  { slug: "residential", label: "Residential", factor: 200, basis: "gross", group: "R", category: "Residential", examples: "Apartments, dwelling units, hotel guest rooms" },
  { slug: "dormitories", label: "Dormitories", factor: 50, basis: "gross", group: "R", category: "Residential", examples: "College/institutional dormitories" },
  { slug: "locker-rooms", label: "Locker rooms", factor: 50, basis: "gross", group: "B", category: "Residential", examples: "Gym/pool/employee locker rooms" },

  // Airport
  { slug: "airport-waiting", label: "Airport terminal — waiting areas", factor: 15, basis: "gross", group: "A", category: "Airport", examples: "Gate hold rooms, waiting areas" },
  { slug: "airport-baggage-claim", label: "Airport terminal — baggage claim", factor: 20, basis: "gross", group: "A", category: "Airport", examples: "Baggage claim halls" },
  { slug: "airport-concourse", label: "Airport terminal — concourse", factor: 100, basis: "gross", group: "A", category: "Airport", examples: "Terminal concourses" },
  { slug: "airport-baggage-handling", label: "Airport terminal — baggage handling", factor: 300, basis: "gross", group: "S", category: "Airport", examples: "Baggage handling / make-up areas" },
];

export function getSpaceType(slug: string): SpaceType | undefined {
  return SPACE_TYPES.find((s) => s.slug === slug);
}

export const CATEGORIES = Array.from(new Set(SPACE_TYPES.map((s) => s.category)));

export function spaceTypesByCategory(): Record<string, SpaceType[]> {
  const out: Record<string, SpaceType[]> = {};
  for (const c of CATEGORIES) out[c] = SPACE_TYPES.filter((s) => s.category === c);
  return out;
}
