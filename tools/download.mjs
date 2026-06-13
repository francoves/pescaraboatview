import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const root = new URL('../', import.meta.url);
const KEY = fs.readFileSync(new URL('.freepik-key', root), 'utf8').trim();
const H = { 'x-freepik-api-key': KEY, 'Accept': 'application/json' };

// Curated picks — id -> friendly filename
const VIDEOS = [
  { id: 8041236, name: 'hero-coast-italy' },        // Amalfi limestone coastline drone (HERO)
  { id: 540741,  name: 'adriatic-cliff' },          // Croatian Adriatic coastline aerial
  { id: 5531129, name: 'sunset-yacht' },            // Sunset over ocean with a yacht
  { id: 6454925, name: 'swim-inflatables' },        // tourists float with inflatables turquoise
  { id: 666005,  name: 'speedboat-sunset' },        // luxury boat coming over ocean at sunset
];
const PHOTOS = [
  { id: 23376207,  name: 'pier-beach' },            // long wooden pier on sandy beach
  { id: 94810313,  name: 'jetty-boats' },           // jetty to sea with boats
  { id: 21570514,  name: 'family-deck' },           // family on sailboat deck embracing
  { id: 21569887,  name: 'family-deck-wide' },      // family lying on yacht deck (banner)
  { id: 107374213, name: 'toast-sunset' },          // hands toasting at sea sunset
  { id: 328888921, name: 'couple-toast' },          // couple toasting sailboat sunset (vertical)
  { id: 386481687, name: 'mussels-seaview' },       // mussels outdoor restaurant water view
  { id: 354087131, name: 'pasta-seafood' },         // pasta shrimp mussels wine (vertical)
  { id: 310961073, name: 'cove-aerial' },           // aerial secluded turquoise cove
  { id: 240208339, name: 'coast-wide' },            // Mediterranean coast clear waters green hills
  { id: 385245281, name: 'snorkeler' },             // snorkeler rocky shores
  { id: 401621072, name: 'group-friends' },         // group of friends on catamaran
];

async function getJson(url) {
  const r = await fetch(url, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
async function save(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download ${r.status}`);
  await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(dest));
  return fs.statSync(dest).size;
}

for (const v of VIDEOS) {
  try {
    const j = await getJson(`https://api.freepik.com/v1/videos/${v.id}/download`);
    const dest = new URL(`assets/video/${v.name}.mp4`, root);
    const size = await save(j.data.url, dest);
    console.log(`VIDEO ok  ${v.name}.mp4  ${(size/1e6).toFixed(1)} MB`);
  } catch (e) { console.log(`VIDEO FAIL ${v.name}: ${e.message}`); }
}
for (const p of PHOTOS) {
  try {
    const j = await getJson(`https://api.freepik.com/v1/resources/${p.id}/download`);
    const ext = (j.data.filename.split('.').pop() || 'jpg').toLowerCase();
    const dest = new URL(`assets/img/${p.name}.${ext}`, root);
    const size = await save(j.data.url, dest);
    console.log(`PHOTO ok  ${p.name}.${ext}  ${(size/1e6).toFixed(1)} MB`);
  } catch (e) { console.log(`PHOTO FAIL ${p.name}: ${e.message}`); }
}
console.log('done');
