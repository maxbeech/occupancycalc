// Registry of calculator pages. Each targets a specific search cluster and sets
// a `focus` that foregrounds the relevant section of the unified tool. Single
// source for nav, sitemap and the /calculators index.

export type Focus = "occupant-load" | "egress" | "exits" | "fixtures" | "table" | "building" | "sign";

export interface Calculator {
  slug: string;
  title: string; // <title>
  h1: string;
  description: string; // meta description
  blurb: string; // intro paragraph on the page
  focus: Focus;
  keyword: string;
}

export const CALCULATORS: Calculator[] = [
  {
    slug: "building-occupant-load-calculator",
    title: "Whole-Building Occupant Load Calculator (Multi-Room)",
    h1: "Whole-Building Occupant Load Calculator",
    description:
      "Add every space in your building or floor and get the total occupant load, the minimum number of exits and the egress width required — the multi-room IBC calculation used for permit sets. Free.",
    blurb:
      "Real occupant-load calculations sum many spaces. Add a row for each space (dining, kitchen, office, storage…), and OccupancyCalc computes each one from its own IBC Table 1004.5 factor, sums them for the floor/building total, and sizes the exits and egress width to that total.",
    focus: "building",
    keyword: "building occupant load calculator",
  },
  {
    slug: "occupant-load-calculator",
    title: "Occupant Load Calculator (IBC Table 1004.5)",
    h1: "Occupant Load Calculator",
    description:
      "Free occupant load calculator using the 2021 IBC Table 1004.5 floor-area factors. Enter your space type and area to get the maximum occupant load, then the exits and egress width required — with the code section cited.",
    blurb:
      "Calculate the occupant load of any space directly from the 2021 IBC Table 1004.5 maximum floor-area allowances. Pick the function of the space, enter the floor area, and OccupancyCalc divides by the code factor (rounding up per §1004.2) and shows the egress requirements that follow.",
    focus: "occupant-load",
    keyword: "occupant load calculator",
  },
  {
    slug: "maximum-occupancy-calculator",
    title: "Maximum Occupancy Calculator — Room & Building Capacity",
    h1: "Maximum Occupancy Calculator",
    description:
      "Work out the maximum occupancy of a room or building from its square footage using the IBC occupant-load factors. Find the legal capacity for restaurants, bars, offices, assembly rooms and more.",
    blurb:
      "The maximum occupancy of a room is its occupant load — the floor area divided by the IBC Table 1004.5 factor for that use. Enter the area and use below to find the code capacity used for assembly permits and posted occupant-load signs.",
    focus: "occupant-load",
    keyword: "maximum occupancy calculator",
  },
  {
    slug: "egress-width-calculator",
    title: "Egress Width Calculator (IBC §1005.3)",
    h1: "Egress Width Calculator",
    description:
      "Calculate the minimum required egress width from the occupant load using the 2021 IBC §1005.3 factors (0.3 in/occupant stairways, 0.2 in/occupant other components; reduced with sprinklers + voice alarm).",
    blurb:
      "Required egress capacity is the occupant load multiplied by the §1005.3 width-per-occupant factor: 0.3 in/occupant for stairways and 0.2 in/occupant for doors, ramps and corridors — reduced to 0.2 / 0.15 where the building has both sprinklers and an emergency voice/alarm system.",
    focus: "egress",
    keyword: "egress width calculator",
  },
  {
    slug: "number-of-exits-calculator",
    title: "Number of Exits Required Calculator (IBC §1006)",
    h1: "Number of Exits Required Calculator",
    description:
      "Find how many exits a space or story needs from its occupant load: 1–500 occupants → 2 exits, 501–1,000 → 3, over 1,000 → 4 (IBC §1006.3), plus the single-exit ceiling by occupancy group (Table 1006.2.1).",
    blurb:
      "The IBC sets the minimum number of exits by occupant load (§1006.3.1) and the maximum load a single exit may serve by occupancy group (Table 1006.2.1). Enter your load and group to see both.",
    focus: "exits",
    keyword: "number of exits required",
  },
  {
    slug: "plumbing-fixture-calculator",
    title: "Plumbing Fixture Calculator (IBC Table 2902.1)",
    h1: "Plumbing Fixture Calculator",
    description:
      "Calculate the minimum number of plumbing fixtures — water closets, lavatories, drinking fountains, service sinks — required by occupant load using IBC Table 2902.1 / IPC Table 403.1 for restaurants, bars, offices and retail.",
    blurb:
      "IBC Table 2902.1 sets the minimum plumbing fixtures from the occupant load, split 50/50 between the sexes (§2902.2). Choose the occupancy and enter the load to size water closets, lavatories, drinking fountains and service sinks.",
    focus: "fixtures",
    keyword: "plumbing fixture calculator",
  },
  {
    slug: "maximum-occupancy-sign",
    title: "Maximum Occupancy Sign Generator (Free Printable)",
    h1: "Maximum Occupancy Sign Generator",
    description:
      "Free printable maximum-occupancy sign. Calculate your space's occupant load (or enter it), then print a clean 8.5×11 maximum-occupancy sign to post per IBC §1004.9.",
    blurb:
      "Assembly occupancies must post an approved maximum-occupancy sign near the main exit (IBC §1004.9). Calculate the number from your space's area, or type it in, then print a clean full-page sign — free, no signup.",
    focus: "sign",
    keyword: "maximum occupancy sign",
  },
  {
    slug: "occupant-load-factor-table",
    title: "IBC Occupant Load Factor Table 1004.5 (2021)",
    h1: "IBC Occupant Load Factor Table (1004.5)",
    description:
      "The full 2021 IBC Table 1004.5 occupant-load factors (maximum floor area per occupant) for every function of space — assembly, business, mercantile, educational, institutional and more — transcribed verbatim with gross/net noted.",
    blurb:
      "The complete 2021 IBC Table 1004.5 — maximum floor area allowances per occupant — for every function of space, with the gross/net basis shown. Use it as a reference or jump straight into the calculator.",
    focus: "table",
    keyword: "occupant load factor table",
  },
];

export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
