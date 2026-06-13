import fs from 'node:fs';
const KEY = fs.readFileSync(new URL('../.freepik-key', import.meta.url), 'utf8').trim();
const H = { 'x-freepik-api-key': KEY, 'Accept': 'application/json' };

const TERMS = [
  // boat life (modern boat, not yacht)
  'friends on motorboat cruising sea summer',
  'people relaxing motorboat deck sea',
  'boat sailing pov bow sea wake',
  // dives / jumps
  'man jumping off boat into sea',
  'people jumping into sea summer fun',
  'diving into blue sea from boat',
  // food close ups
  'pouring olive oil on bread closeup',
  'caprese tomato mozzarella fresh',
  'spaghetti clams vongole pasta',
  'seafood pasta plate closeup',
  // party / aperitivo
  'friends party boat drinks celebrate',
  'cheers toast glasses summer boat',
  // views
  'aerial boat wake blue sea drone',
];

async function searchVideos(term){
  const u = new URL('https://api.freepik.com/v1/videos');
  u.searchParams.set('term', term);
  u.searchParams.set('page','1');
  u.searchParams.set('limit','6');
  const r = await fetch(u,{headers:H});
  if(!r.ok) return [];
  const j = await r.json();
  return (j.data||[]).map(d=>({id:d.id,t:d.name,ar:d.aspect_ratio,q:d.quality,dur:d.duration}));
}

for(const term of TERMS){
  const res = await searchVideos(term);
  console.log(`\n=== ${term} ===`);
  for(const x of res) console.log(`  ${x.id}\t[${x.ar} ${x.q} ${x.dur}]\t${x.t}`);
}
