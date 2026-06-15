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

// Theater (A-1): WC male 1/125, female 1/65. 260 occ → 130/sex.
const th = computeFixtures(getFixtureOccupancy("theater")!, 260);
eq(th.wcMale, 2, "theater ceil(130/125) = 2 WC male");
eq(th.wcFemale, 2, "theater ceil(130/65) = 2 WC female");

// A-3 worship: WC male 1/150, female 1/75, DF 1/1000.
const wor = computeFixtures(getFixtureOccupancy("worship")!, 300);
eq(wor.wcMale, 1, "worship ceil(150/150) = 1 WC male");
eq(wor.wcFemale, 2, "worship ceil(150/75) = 2 WC female");
eq(wor.drinkingFountains, 1, "worship ceil(300/1000) = 1 DF");

// Business (B) piecewise male WC: 1 per 25 first 50, then 1 per 50.
// 120 occ → 60 per sex. Male WC: ceil(50/25)=2 + ceil(10/50)=1 = 3.
const biz = computeFixtures(getFixtureOccupancy("business")!, 120);
eq(biz.perSex, 60, "120 occ → 60 per sex");
eq(biz.wcMale, 3, "business male WC piecewise = 3");
// Female WC: 1 per 40 first 80, then 1 per 80. 60 ≤ 80 → ceil(60/40)=2.
eq(biz.wcFemale, 2, "business female WC = 2");
// Lavatories (both): 1 per 100 (corrected from the piecewise bug). 60 → 1.
eq(biz.lavMale, 1, "business lav 1 per 100 → 1");
eq(biz.lavFemale, 1, "business lav female 1 per 100 → 1");

// Mercantile (M): WC male 1/500, female 1/750, lav 1/1000, DF 1/1000.
const merc = computeFixtures(getFixtureOccupancy("mercantile")!, 1500);
eq(merc.perSex, 750, "1500 occ → 750 per sex");
eq(merc.wcMale, 2, "mercantile ceil(750/500) = 2 WC male");
eq(merc.wcFemale, 1, "mercantile ceil(750/750) = 1 WC female");
eq(merc.lavMale, 1, "mercantile ceil(750/1000) = 1 lav");

// Educational (E): WC 1/50, lav 1/100. 200 occ → 100/sex.
const edu = computeFixtures(getFixtureOccupancy("educational")!, 200);
eq(edu.wcMale, 2, "educational ceil(100/50) = 2 WC");
eq(edu.lavMale, 1, "educational ceil(100/100) = 1 lav");

// Factory + storage exist.
ok(!!getFixtureOccupancy("factory"), "factory occupancy exists");
ok(!!getFixtureOccupancy("storage"), "storage occupancy exists");

// Zero occupants → all zero.
const zero = computeFixtures(rest, 0);
eq(zero.wcMale, 0, "0 occ → 0 WC");
eq(zero.drinkingFountains, 0, "0 occ → 0 DF");
eq(zero.serviceSinks, 0, "0 occ → 0 service sink");

// Every occupancy has positive ratios, a label, and monotonic WC in load.
for (const o of FIXTURE_OCCUPANCIES) {
  ok(o.drinkingFountainPer > 0, `${o.slug} DF ratio > 0`);
  ok(o.label.length > 0, `${o.slug} has label`);
  ok(computeFixtures(o, 1000).wcMale >= computeFixtures(o, 100).wcMale, `${o.slug} WC monotonic`);
}

done("fixtures");
