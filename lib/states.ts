// Which edition of the IBC each U.S. state (+ DC) has adopted as its statewide
// base building code, as of June 2026. Compiled from the ICC code-adoption maps,
// the UpCodes jurisdiction list, and state building-code-agency pages. Editions
// are statewide commercial (IBC) baselines; "home-rule" states have no mandatory
// statewide commercial code (cities/counties adopt and amend locally). Several
// 2024-edition transitions are flagged `unverified` because exact effective
// dates were not confirmed at the state-agency level — these surface a "confirm
// with your AHJ" note rather than an unsupported claim. The occupant-load
// FACTORS in Table 1004.5 are stable across recent IBC editions, so the
// calculator math is the same; the adopted edition affects citations + amendments.

export interface StateLaw {
  name: string;
  abbr: string;
  slug: string;
  ibcEdition: string; // "2021", "2018", "2015", "2012", "2024", "2020", or "varies/home-rule"
  note: string;
  unverified?: boolean;
}

const RAW: Omit<StateLaw, "slug">[] = [
  { name: "Alabama", abbr: "AL", ibcEdition: "2021", note: "Adopted statewide by the Alabama Building Commission for state-owned and commercial buildings; local jurisdictions enforce." },
  { name: "Alaska", abbr: "AK", ibcEdition: "2021", note: "Adopted by the State Fire Marshal statewide; some local amendments." },
  { name: "Arizona", abbr: "AZ", ibcEdition: "varies/home-rule", note: "No statewide building code — each city/county adopts and amends its own (most use 2018 or 2021 IBC)." },
  { name: "Arkansas", abbr: "AR", ibcEdition: "2021", note: "Statewide via the Arkansas Fire Prevention Code (IBC-based)." },
  { name: "California", abbr: "CA", ibcEdition: "2024", note: "Uses the California Building Code (Title 24, Part 2). The 2025 CBC is based on the 2024 IBC, effective Jan 1 2026, with substantial state amendments." },
  { name: "Colorado", abbr: "CO", ibcEdition: "varies/home-rule", note: "No mandatory statewide commercial code; adopted locally (edition varies by jurisdiction)." },
  { name: "Connecticut", abbr: "CT", ibcEdition: "2021", note: "Connecticut State Building Code based on the 2021 IBC with amendments." },
  { name: "Delaware", abbr: "DE", ibcEdition: "2018", note: "State adopts the IBC; local enforcement." },
  { name: "Florida", abbr: "FL", ibcEdition: "2021", note: "Uses the Florida Building Code (FBC); the 8th Edition (2023) is based on the 2021 IBC with Florida amendments." },
  { name: "Georgia", abbr: "GA", ibcEdition: "2024", note: "Statewide; 2024 IBC with Georgia amendments effective Jan 1 2026." },
  { name: "Hawaii", abbr: "HI", ibcEdition: "2018", note: "State Building Code based on the 2018 IBC; counties adopt with amendments." },
  { name: "Idaho", abbr: "ID", ibcEdition: "2018", note: "Statewide via the Idaho Building Code Act." },
  { name: "Illinois", abbr: "IL", ibcEdition: "varies/home-rule", note: "No comprehensive mandatory statewide commercial code; adopted locally (Chicago has its own code)." },
  { name: "Indiana", abbr: "IN", ibcEdition: "2012", note: "Indiana Building Code based on the 2012 IBC (most recent statewide commercial adoption)." },
  { name: "Iowa", abbr: "IA", ibcEdition: "2024", note: "State Building Code recently moved toward the 2024 IBC — confirm the effective date with Iowa DPS.", unverified: true },
  { name: "Kansas", abbr: "KS", ibcEdition: "varies/home-rule", note: "No statewide commercial building code; adopted locally." },
  { name: "Kentucky", abbr: "KY", ibcEdition: "2015", note: "Kentucky Building Code based on the 2015 IBC (statewide, mandatory)." },
  { name: "Louisiana", abbr: "LA", ibcEdition: "2021", note: "Louisiana State Uniform Construction Code based on the 2021 IBC." },
  { name: "Maine", abbr: "ME", ibcEdition: "2021", note: "Maine Uniform Building and Energy Code (MUBEC) based on the 2021 IBC." },
  { name: "Maryland", abbr: "MD", ibcEdition: "2021", note: "Maryland Building Performance Standards based on the 2021 IBC; local jurisdictions adopt within a set timeframe." },
  { name: "Massachusetts", abbr: "MA", ibcEdition: "2021", note: "10th Edition Massachusetts State Building Code based on the 2021 IBC with amendments." },
  { name: "Michigan", abbr: "MI", ibcEdition: "2021", note: "Michigan Building Code based on the 2021 IBC." },
  { name: "Minnesota", abbr: "MN", ibcEdition: "2018", note: "Minnesota State Building Code based on the 2018 IBC with amendments." },
  { name: "Mississippi", abbr: "MS", ibcEdition: "2024", note: "Recently adopted the 2024 IBC — confirm the effective date.", unverified: true },
  { name: "Missouri", abbr: "MO", ibcEdition: "varies/home-rule", note: "No mandatory statewide commercial code; adopted locally." },
  { name: "Montana", abbr: "MT", ibcEdition: "2021", note: "Statewide via the Montana Building Codes Program." },
  { name: "Nebraska", abbr: "NE", ibcEdition: "2018", note: "Nebraska State Building Code based on the 2018 IBC; local jurisdictions may amend." },
  { name: "Nevada", abbr: "NV", ibcEdition: "2018", note: "No single mandatory statewide code; counties adopt (commonly 2018 IBC) — verify by jurisdiction." },
  { name: "New Hampshire", abbr: "NH", ibcEdition: "2021", note: "New Hampshire State Building Code based on the 2021 IBC." },
  { name: "New Jersey", abbr: "NJ", ibcEdition: "2021", note: "New Jersey Uniform Construction Code based on the 2021 IBC." },
  { name: "New Mexico", abbr: "NM", ibcEdition: "2021", note: "New Mexico Commercial Building Code based on the 2021 IBC." },
  { name: "New York", abbr: "NY", ibcEdition: "2020", note: "NYS Uniform Code based on the 2020 IBC. New York City has its own Construction Code (2022, 2015-IBC-based)." },
  { name: "North Carolina", abbr: "NC", ibcEdition: "2015", note: "North Carolina State Building Code based on the 2015 IBC; newer cycles phasing in — verify the current edition." },
  { name: "North Dakota", abbr: "ND", ibcEdition: "2024", note: "State Building Code recently moved toward the 2024 IBC — confirm the effective date.", unverified: true },
  { name: "Ohio", abbr: "OH", ibcEdition: "2021", note: "Ohio Building Code (commercial/non-residential) based on the 2021 IBC." },
  { name: "Oklahoma", abbr: "OK", ibcEdition: "2018", note: "Adopted statewide by the Oklahoma Uniform Building Code Commission (2018 IBC)." },
  { name: "Oregon", abbr: "OR", ibcEdition: "2024", note: "Oregon Structural Specialty Code based on the 2024 IBC (statewide, mandatory, no local amendments)." },
  { name: "Pennsylvania", abbr: "PA", ibcEdition: "2018", note: "Pennsylvania Uniform Construction Code based on the 2018 IBC." },
  { name: "Rhode Island", abbr: "RI", ibcEdition: "2021", note: "Rhode Island State Building Code based on the 2021 IBC." },
  { name: "South Carolina", abbr: "SC", ibcEdition: "2021", note: "Adopts the IBC statewide (2021 IBC)." },
  { name: "South Dakota", abbr: "SD", ibcEdition: "2021", note: "No mandatory statewide code; the state references the 2021 IBC and jurisdictions adopt locally." },
  { name: "Tennessee", abbr: "TN", ibcEdition: "2021", note: "State Fire Marshal adopts the 2021 IBC; local jurisdictions may adopt their own." },
  { name: "Texas", abbr: "TX", ibcEdition: "varies/home-rule", note: "No mandatory statewide commercial code; the statutory baseline references the 2012 IBC, but adoption/enforcement is local (major cities use 2018/2021)." },
  { name: "Utah", abbr: "UT", ibcEdition: "2021", note: "Utah State Construction Code based on the 2021 IBC." },
  { name: "Vermont", abbr: "VT", ibcEdition: "2021", note: "Vermont Fire & Building Safety Code adopts the 2021 IBC for commercial buildings." },
  { name: "Virginia", abbr: "VA", ibcEdition: "2021", note: "Virginia Uniform Statewide Building Code based on the 2021 IBC." },
  { name: "Washington", abbr: "WA", ibcEdition: "2021", note: "Washington State Building Code based on the 2021 IBC with state amendments." },
  { name: "West Virginia", abbr: "WV", ibcEdition: "2018", note: "State Building Code based on the 2018 IBC; local jurisdictions opt in/amend." },
  { name: "Wisconsin", abbr: "WI", ibcEdition: "2021", note: "Wisconsin Commercial Building Code (SPS 361–366) based on the 2021 IBC." },
  { name: "Wyoming", abbr: "WY", ibcEdition: "2024", note: "Adopts the 2024 IBC as the state-building minimum, but largely home-rule — cities/counties choose and enforce locally." },
  { name: "District of Columbia", abbr: "DC", ibcEdition: "2015", note: "DC Construction Codes (2017 edition) based on the 2015 IBC with DC amendments; a newer cycle may be pending." },
];

export const STATES: StateLaw[] = RAW.map((s) => ({
  ...s,
  slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
}));

export function getState(slug: string): StateLaw | undefined {
  return STATES.find((s) => s.slug === slug);
}
