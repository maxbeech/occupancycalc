import { computeFixtures, getFixtureOccupancy, FIXTURE_OCCUPANCIES } from "../lib/fixtures.ts";
import { eq, ok, done } from "./_assert.mts";

// Restaurant (A-2): WC 1 per 75/sex, lav 1 per 200/sex. 300 occupants → 150/sex.
const rest = getFixtureOccupancy("restaurant")!;
const r = computeFixtures(rest, 300);
eq(r.perSex, 150, "300 occ → 150 per sex");
eq(r.wcMale, 2, "restaurant 150/75 = 2 WC male");
eq(r.wcFemale, 2, "restaurant 150/75 = 2 WC female");
eq(r.lavMale, 1, "restaurant ceil(150/200) = 1 lav male");
eq(r.serviceSinks, 1, "restaurant 1 service sink");
eq(r.drinkingFountains, 1, "restaurant ceil(300/500) = 1 DF");

// Nightclub/bar (A-2): WC 1 per 40/sex, lav 1 per 75/sex. 200 occ → 100/sex.
const bar = computeFixtures(getFixtureOccupancy("nightclub-bar")!, 200);
eq(bar.wcMale, 3, "bar ceil(100/40) = 3 WC");
eq(bar.lavMale, 2, "bar ceil(100/75) = 2 lav");

// Business (B) piecewise male WC: 1 per 25 first 50, then 1 per 50.
// 120 occ → 60 per sex. Male WC: ceil(50/25)=2 + ceil(10/50)=1 = 3.
const biz = computeFixtures(getFixtureOccupancy("business")!, 120);
eq(biz.perSex, 60, "120 occ → 60 per sex");
eq(biz.wcMale, 3, "business male WC piecewise = 3");
// Female WC: 1 per 40 first 80, then 1 per 80. 60 ≤ 80 → ceil(60/40)=2.
eq(biz.wcFemale, 2, "business female WC = 2");
// Lavatories (both): 1 per 40 first 80 then 1 per 80. 60 → 2.
eq(biz.lavMale, 2, "business lav = 2");

// Business small office: 30 occ → 15/sex. Male WC ceil(15/25)=1.
const small = computeFixtures(getFixtureOccupancy("business")!, 30);
eq(small.wcMale, 1, "small office male WC = 1");
eq(small.wcFemale, 1, "small office female WC = 1");

// Zero occupants → all zero.
const zero = computeFixtures(rest, 0);
eq(zero.wcMale, 0, "0 occ → 0 WC");
eq(zero.drinkingFountains, 0, "0 occ → 0 DF");
eq(zero.serviceSinks, 0, "0 occ → 0 service sink");

// Every occupancy has positive ratios and a label.
for (const o of FIXTURE_OCCUPANCIES) {
  ok(o.drinkingFountainPer > 0, `${o.slug} DF ratio > 0`);
  ok(o.label.length > 0, `${o.slug} has label`);
  // Monotonic: more occupants never decreases fixtures.
  const a = computeFixtures(o, 100).wcMale;
  const b = computeFixtures(o, 1000).wcMale;
  ok(b >= a, `${o.slug} WC monotonic in load`);
}

done("fixtures");
