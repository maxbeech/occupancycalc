// SEO guide posts. Content is code-grounded (cites IBC sections) and written to
// rank for the occupancy/egress informational long-tail. Bodies are arrays of
// {h, p} sections rendered by the blog page. Single source for the blog index +
// sitemap.

export interface PostSection {
  h?: string;
  p: string;
}
export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  description: string;
  keyword: string;
  related?: string; // calculator slug to cross-link
  body: PostSection[];
}

export const POSTS: Post[] = [
  {
    slug: "how-to-calculate-occupant-load",
    title: "How to Calculate Occupant Load (IBC Step by Step)",
    date: "2026-06-15",
    description: "A step-by-step guide to calculating occupant load under the IBC: pick the Table 1004.5 factor, measure the right area, divide and round up.",
    keyword: "how to calculate occupant load",
    related: "occupant-load-calculator",
    body: [
      { p: "Occupant load is the number of people a building code assumes will occupy a space. It drives almost every life-safety requirement — the number of exits, the width of doors and stairs, the number of plumbing fixtures, and whether a space needs panic hardware or an emergency lighting system." },
      { h: "Step 1 — Identify the function of the space", p: "The IBC assigns a floor-area-per-occupant factor to each function of space in Table 1004.5, not to the occupancy group as a whole. A dining area, its kitchen, and its storeroom each use a different factor even though they are all part of one restaurant." },
      { h: "Step 2 — Choose the right factor (and gross vs net)", p: "Gross factors apply to the gross floor area within exterior walls; net factors apply only to the actual usable area of the room (excluding fixed equipment, thick columns, etc.). Assembly seating uses small net factors (5–15 sq ft/person); business areas use 150 gross." },
      { h: "Step 3 — Divide and round up", p: "Occupant load = floor area ÷ factor. Per IBC §1004.2, any fraction rounds UP to the next whole person. A 1,500 sq ft restaurant dining room at 15 net = 100 occupants." },
      { h: "Step 4 — Add the components together", p: "Sum the occupant loads of each space to get the floor or building total, then apply the egress and fixture rules to that number. Our calculator does each step and shows the code section behind every result." },
    ],
  },
  {
    slug: "occupant-load-factor-explained",
    title: "Occupant Load Factor: What It Means and Where to Find It",
    date: "2026-06-15",
    description: "What the occupant load factor is, why gross and net matter, and the most-used values from IBC Table 1004.5.",
    keyword: "occupancy load factor",
    related: "occupant-load-factor-table",
    body: [
      { p: "The occupant load factor is the maximum floor area the code allows per person for a given use — the bigger the number, the fewer people assumed per square foot. It is published in IBC Table 1004.5." },
      { h: "Common factors", p: "Standing space 5 net, concentrated assembly (chairs) 7 net, tables-and-chairs assembly 15 net, classroom 20 net, mercantile 60 gross, business 150 gross, kitchens 200 gross, storage/mechanical 300 gross, warehouse 500 gross." },
      { h: "Gross vs net", p: "A net factor means you measure only the usable room area; a gross factor means the whole floor area inside the exterior walls, including corridors and walls. Using the wrong basis is the most common occupant-load mistake." },
    ],
  },
  {
    slug: "how-many-exits-does-a-building-need",
    title: "How Many Exits Does a Building Need? (IBC §1006)",
    date: "2026-06-15",
    description: "The IBC rules for the minimum number of exits: when one exit is allowed, and the 2/3/4-exit thresholds by occupant load.",
    keyword: "how many exits required",
    related: "number-of-exits-calculator",
    body: [
      { p: "The minimum number of exits comes straight from the occupant load. The IBC also limits how many people a single exit may serve before a second exit becomes mandatory." },
      { h: "The thresholds", p: "1–500 occupants require 2 exits; 501–1,000 require 3; more than 1,000 require 4 (IBC §1006.3.1)." },
      { h: "When one exit is allowed", p: "A space may have a single exit only if its occupant load is at or below the Table 1006.2.1 ceiling for its occupancy group — 49 for Groups A, B, E, F, M and U; 29 for storage (S); and lower for institutional, residential and high-hazard groups — and the common path of egress travel is within the code limit." },
    ],
  },
  {
    slug: "egress-width-per-occupant",
    title: "Egress Width Per Occupant: The 0.2 and 0.3 Factors",
    date: "2026-06-15",
    description: "How to size doors, stairs and corridors from the occupant load using the IBC §1005.3 egress-width factors.",
    keyword: "egress width per occupant",
    related: "egress-width-calculator",
    body: [
      { p: "Once you know the occupant load, the IBC tells you the minimum egress capacity that load needs, measured in inches of clear width." },
      { h: "The factors", p: "Stairways need 0.3 inch per occupant; doors, ramps, corridors and other level components need 0.2 inch per occupant (IBC §1005.3). 200 occupants therefore need 60 inches of stair capacity or 40 inches of door capacity, divided among the required exits." },
      { h: "The sprinkler reduction", p: "Where a building (other than Group H and I-2) is protected throughout by an automatic sprinkler system AND an emergency voice/alarm communication system, the factors drop to 0.2 in/occupant for stairs and 0.15 in/occupant for other components — a meaningful capacity gain." },
      { h: "Minimums still apply", p: "These are capacity minimums; absolute minimums also govern — a door must give at least 32 inches clear width and a corridor serving 50+ occupants at least 44 inches, regardless of the calculation." },
    ],
  },
  {
    slug: "restaurant-occupancy-load",
    title: "Restaurant Occupancy Load: How to Find Your Legal Capacity",
    date: "2026-06-15",
    description: "How restaurants and bars calculate maximum occupancy, why dining and standing areas differ, and how it sets exits and restrooms.",
    keyword: "restaurant occupancy load",
    related: "occupant-load-calculator",
    body: [
      { p: "Restaurants and bars are Assembly Group A-2, the most scrutinised occupancy for capacity because crowds, alcohol and egress combine. Your posted maximum occupancy is the occupant load." },
      { h: "Dining vs bar vs standing", p: "Tables-and-chairs dining uses 15 net sq ft/person; a concentrated seating area uses 7 net; a standing bar or dance floor uses just 5 net — so the same room can hold very different legal capacities depending on layout." },
      { h: "What it controls", p: "The load sets the number of exits (50+ occupants need two), the door and aisle widths, and the minimum restrooms — an A-2 restaurant needs water closets at 1 per 75 per sex and lavatories at 1 per 200 (IBC Table 2902.1)." },
    ],
  },
  {
    slug: "office-occupancy-load",
    title: "Office Occupancy Load and the 150 Gross Factor",
    date: "2026-06-15",
    description: "How office and business spaces calculate occupant load with the 150 gross factor, and the exits and fixtures it triggers.",
    keyword: "office occupancy load",
    related: "occupant-load-calculator",
    body: [
      { p: "Offices are Business Group B. The IBC uses a 150 gross sq ft/occupant factor for business areas — one of the most generous in the table, reflecting low density." },
      { h: "Worked example", p: "A 9,000 sq ft office floor ÷ 150 = 60 occupants. Because that exceeds 49, the floor needs at least two exits, and the egress doors need 60 × 0.2 = 12 inches of capacity (easily met by standard doors)." },
      { h: "Concentrated business use", p: "Call centers and similar dense layouts can fall under the lower 'concentrated business use' provisions (§1004.8) — confirm with your AHJ if workstations are tightly packed." },
    ],
  },
  {
    slug: "net-vs-gross-floor-area",
    title: "Net vs Gross Floor Area in Occupant Load Calculations",
    date: "2026-06-15",
    description: "The difference between net and gross floor area in IBC Table 1004.5 and why it changes your occupant load.",
    keyword: "net vs gross floor area occupant load",
    related: "occupant-load-calculator",
    body: [
      { p: "Table 1004.5 marks every factor as either gross or net, and getting it wrong is the single most common occupant-load error." },
      { h: "Gross floor area", p: "Measured within the inside faces of the exterior walls, including corridors, columns, walls and unoccupied accessory areas. Used for business (150), mercantile (60), storage (300) and most lower-density uses." },
      { h: "Net floor area", p: "The actual occupied area of the room, excluding accessory spaces, thick columns and fixed equipment. Used for the high-density assembly and educational factors (5, 7, 15, 20 net)." },
    ],
  },
  {
    slug: "ibc-vs-nfpa-101-occupant-load",
    title: "IBC vs NFPA 101: Do the Occupant Load Numbers Differ?",
    date: "2026-06-15",
    description: "How occupant-load factors compare between the IBC and NFPA 101 Life Safety Code, and which one your jurisdiction enforces.",
    keyword: "nfpa 101 occupant load",
    related: "occupant-load-calculator",
    body: [
      { p: "Most U.S. jurisdictions enforce the IBC, but many also adopt NFPA 101, and federal/healthcare facilities often use NFPA 101 specifically. The occupant-load concept is the same; some factors differ." },
      { h: "Where they line up", p: "Both use floor area ÷ a per-occupant factor and round up. Business (150 gross), mercantile and assembly seating factors are largely aligned." },
      { h: "Where to check", p: "If your project is under NFPA 101 (e.g. a hospital under CMS), confirm the factor against NFPA 101 Table 7.3.1.2 — it can differ for some uses. This tool uses the 2021 IBC; always confirm the code your AHJ enforces." },
    ],
  },
  {
    slug: "posted-occupancy-sign-rules",
    title: "Posted Occupancy Signs: When and Where the IBC Requires Them",
    date: "2026-06-15",
    description: "When a maximum-occupancy sign is required, what it must say, and how the number on it is calculated.",
    keyword: "maximum occupancy sign requirements",
    related: "maximum-occupancy-calculator",
    body: [
      { p: "IBC §1004.9 requires every room or space used as an Assembly occupancy to have an approved, durable sign posting the maximum occupant load, kept near the main exit." },
      { h: "What number goes on it", p: "The occupant load calculated from Table 1004.5 for that space — the same number our calculator produces. The fire marshal verifies it during inspection." },
      { h: "Why it matters", p: "Operating over the posted load is a common code-enforcement and insurance issue for bars, clubs and event venues; the sign also fixes the egress and fixture design basis." },
    ],
  },
  {
    slug: "how-many-restrooms-does-a-business-need",
    title: "How Many Restrooms Does a Business Need? (IBC Table 2902.1)",
    date: "2026-06-15",
    description: "How the IBC sizes the minimum plumbing fixtures from occupant load for offices, restaurants, bars and retail.",
    keyword: "how many restrooms required",
    related: "plumbing-fixture-calculator",
    body: [
      { p: "The minimum number of plumbing fixtures is driven by the same occupant load, split 50/50 between the sexes (IBC §2902.2), then run through the ratios in Table 2902.1." },
      { h: "Examples", p: "A business/office uses 1 water closet per 25 (first 50) then 1 per 50 for men, 1 per 40 (first 80) then 1 per 80 for women. A restaurant (A-2) uses 1 water closet per 75 per sex and 1 lavatory per 200." },
      { h: "Don't forget", p: "Most occupancies also need at least one drinking fountain and one service sink. Single-user and family restrooms can count toward the totals under §2902.2 exceptions." },
    ],
  },
  {
    slug: "assembly-occupancy-explained",
    title: "What Is an Assembly Occupancy? (Group A Explained)",
    date: "2026-06-15",
    description: "The IBC Assembly occupancy groups A-1 to A-5, the density factors that apply, and why they carry the strictest egress rules.",
    keyword: "assembly occupancy",
    related: "occupant-load-calculator",
    body: [
      { p: "Assembly (Group A) covers spaces where people gather for civic, social, religious, dining, drinking, entertainment or recreation purposes — and it carries the IBC's most demanding egress and occupant-load rules because of crowd density." },
      { h: "The subgroups", p: "A-1 theaters with fixed seats; A-2 food and drink (restaurants, bars, nightclubs); A-3 worship, lecture, galleries, gyms; A-4 indoor sports with spectators; A-5 outdoor stadiums and amusement." },
      { h: "Why density matters", p: "Standing space at 5 net and concentrated seating at 7 net pack many people into a small area, so even modest rooms can exceed the 49-occupant single-exit ceiling and trigger two exits, panic hardware and posted signs." },
    ],
  },
  {
    slug: "common-path-of-egress-travel",
    title: "Common Path of Egress Travel Explained (IBC)",
    date: "2026-06-15",
    description: "What the common path of egress travel is, the IBC limits by occupancy, and how it interacts with the single-exit rule.",
    keyword: "common path of egress travel",
    related: "number-of-exits-calculator",
    body: [
      { p: "Common path of egress travel is the distance you must travel before you reach a point where two separate, independent paths to exits become available. It is one of the two conditions (with occupant load) that decide whether a space can have a single exit." },
      { h: "The limits", p: "For Groups A, E and M the common path limit is 75 ft; for Business (B) it is 100 ft where the occupant load is 30 or fewer (or the building is sprinklered) and 75 ft otherwise. Storage (S) mirrors B. Many R, I and H occupancies may not use a single exit at all without sprinklers." },
      { h: "Why it matters", p: "Even if your occupant load is below the single-exit ceiling (e.g. 49 for Group B), exceeding the common-path limit forces a second exit. Measure along the natural path of travel, not in a straight line." },
    ],
  },
  {
    slug: "exit-access-travel-distance",
    title: "Exit Access Travel Distance Limits (IBC Table 1017.2)",
    date: "2026-06-15",
    description: "The maximum exit access travel distance by occupancy under the IBC, and how sprinklers extend it.",
    keyword: "travel distance ibc",
    related: "number-of-exits-calculator",
    body: [
      { p: "Exit access travel distance is the total distance from the most remote point in a space to the nearest exit. The IBC caps it in Table 1017.2 to limit how far anyone must travel during an evacuation." },
      { h: "Typical limits", p: "Groups A, E, F-1, M, R and S-1 are limited to 200 ft (250 ft sprinklered). Business (B) is 200 ft (300 ft sprinklered). F-2, S-2 and Utility reach 300 ft (400 ft sprinklered). High-hazard (H) and most Institutional (I) groups have much shorter limits and generally require sprinklers." },
      { h: "Sprinkler credit", p: "The longer distances require an automatic sprinkler system (NFPA 13 — and NFPA 13R qualifies only for the 250 ft tier, not the 300/400 ft tiers). Confirm the exact figure for your occupancy subgroup with your AHJ." },
    ],
  },
  {
    slug: "square-footage-per-person",
    title: "Square Footage Per Person: Occupancy by Area",
    date: "2026-06-15",
    description: "How many square feet per person each occupancy uses under the IBC, and how to turn it into a maximum occupancy.",
    keyword: "square footage per person",
    related: "maximum-occupancy-calculator",
    body: [
      { p: "“Square feet per person” is just the occupant load factor flipped around — the IBC sets a maximum floor area each person is allotted, and you divide your area by it to get the maximum occupancy." },
      { h: "Common allowances", p: "Standing space allows 5 sq ft/person, concentrated seating 7, tables-and-chairs dining 15, classrooms 20, retail 60 gross, and offices 150 gross. The smaller the number, the more people the code assumes per square foot." },
      { h: "Worked example", p: "A 2,000 sq ft event space arranged with tables and chairs (15 net) holds 134 people (2,000 ÷ 15 = 133.3, rounded up). The same room as standing-only (5 net) holds 400." },
    ],
  },
  {
    slug: "do-i-need-a-second-exit",
    title: "Do I Need a Second Exit? The 49-Occupant Rule",
    date: "2026-06-15",
    description: "When the IBC forces a space to add a second exit — the 49-occupant single-exit ceiling and common-path limits.",
    keyword: "when is a second exit required",
    related: "number-of-exits-calculator",
    body: [
      { p: "The most common egress question for small commercial spaces is whether one exit is enough. The IBC answers it with an occupant-load ceiling plus a travel-distance limit." },
      { h: "The 49 rule", p: "For Groups A, B, E, F, M and U, a room or space may have a single exit only when its occupant load is 49 or fewer (Table 1006.2.1). At 50 occupants you must provide a second exit. Storage (S) is capped at 29." },
      { h: "Common path of travel", p: "Even below the ceiling, a single exit is only allowed if the common path of egress travel stays within the code limit (often 75–100 ft, more with sprinklers). Both conditions must be met." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
