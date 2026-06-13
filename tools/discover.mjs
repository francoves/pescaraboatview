import fs from 'node:fs';

const KEY = fs.readFileSync(new URL('../.freepik-key', import.meta.url), 'utf8').trim();
const H = { 'x-freepik-api-key': KEY, 'Accept': 'application/json' };

const PHOTO_TERMS = [
  'trabocco abruzzo', 'trabocchi coast fishing pier', 'wooden fishing pier sea italy',
  'adriatic sea turquoise cove', 'people relaxing yacht deck', 'aperitivo boat sunset',
  'seafood lunch italy table sea', 'swimming turquoise cove italy', 'family boat trip sea',
  'pescara coast italy', 'sunset cocktail boat sea', 'snorkeling clear water rocks',
];
const VIDEO_TERMS = [
  'aerial coast turquoise sea', 'drone boat sailing sea sunset', 'wooden pier sea waves',
  'people swimming clear sea', 'sunset sea boat aerial', 'mediterranean coast cliffs drone',
];

async function searchPhotos(term) {
  const u = new URL('https://api.freepik.com/v1/resources');
  u.searchParams.set('term', term);
  u.searchParams.set('page', '1');
  u.searchParams.set('limit', '6');
  u.searchParams.set('filters[content_type][photo]', '1');
  u.searchParams.set('order', 'relevance');
  const r = await fetch(u, { headers: H });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.data || []).map(d => ({
    id: d.id, t: d.title, o: d.image?.orientation,
  }));
}
async function searchVideos(term) {
  const u = new URL('https://api.freepik.com/v1/videos');
  u.searchParams.set('term', term);
  u.searchParams.set('page', '1');
  u.searchParams.set('limit', '6');
  const r = await fetch(u, { headers: H });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.data || []).map(d => ({
    id: d.id, t: d.name, ar: d.aspect_ratio, q: d.quality, dur: d.duration,
  }));
}

console.log('################ PHOTOS ################');
for (const term of PHOTO_TERMS) {
  const res = await searchPhotos(term);
  console.log(`\n=== PHOTO: ${term} ===`);
  for (const x of res) console.log(`  ${x.id}\t[${x.o}]\t${x.t}`);
}
console.log('\n\n################ VIDEOS ################');
for (const term of VIDEO_TERMS) {
  const res = await searchVideos(term);
  console.log(`\n=== VIDEO: ${term} ===`);
  for (const x of res) console.log(`  ${x.id}\t[${x.ar} ${x.q} ${x.dur}]\t${x.t}`);
}
