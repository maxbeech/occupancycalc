import { encodeInputs, decodeInputs } from "../lib/url.ts";
import { eq, done } from "./_assert.mts";

const seed = { space: "business-areas", area: 1000, sprinklered: false };

// Round-trip.
const enc = encodeInputs({ space: "mercantile", area: 3000, sprinklered: true });
const dec = decodeInputs(enc, seed);
eq(dec.space, "mercantile", "space round-trips");
eq(dec.area, 3000, "area round-trips");
eq(dec.sprinklered, true, "sprinklered round-trips");

// Unknown space falls back to seed.
eq(decodeInputs("type=bogus&area=500", seed).space, "business-areas", "bad space → seed");
eq(decodeInputs("type=bogus&area=500", seed).area, 500, "area still parsed");

// Empty query → seed.
eq(decodeInputs("", seed).space, "business-areas", "empty → seed space");
eq(decodeInputs("", seed).area, 1000, "empty → seed area");

// Non-numeric area → seed.
eq(decodeInputs("type=mercantile&area=abc", seed).area, 1000, "bad area → seed");

done("url");
