import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const root = new URL('../', import.meta.url);
const KEY = fs.readFileSync(new URL('.freepik-key', root), 'utf8').trim();
const H = { 'x-freepik-api-key': KEY, 'Accept':'application/json' };
fs.mkdirSync(new URL('assets/_raw_video/clips/', root), { recursive:true });

const CLIPS = [
  { id:369459,  name:'boat-cruise' },     // drone follow cruising boat with tourists
  { id:466283,  name:'pov-bow' },         // POV motorboat bow cutting Adriatic Sea
  { id:6283002, name:'aerial-wake' },     // small boat wake turquoise aerial
  { id:6070110, name:'dive' },            // dive off dock into blue water
  { id:8394695, name:'oliveoil' },        // pouring olive oil on fresh bread
  { id:7973685, name:'burrata' },         // burrata tomato basil olive oil
  { id:623383,  name:'vongole' },         // linguine vongole clams
  { id:6938814, name:'shrimp-pasta' },    // spaghetti shrimp closeup
  { id:4984398, name:'cheers-boat' },     // friends toasting champagne on a boat
];

async function getJson(u){ const r=await fetch(u,{headers:H}); if(!r.ok) throw new Error(r.status); return r.json(); }
async function save(url,dest){ const r=await fetch(url); if(!r.ok) throw new Error('dl '+r.status);
  await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(dest)); return fs.statSync(dest).size; }

for(const c of CLIPS){
  try{
    const j = await getJson(`https://api.freepik.com/v1/videos/${c.id}/download`);
    const dest = new URL(`assets/_raw_video/clips/${c.name}.mp4`, root);
    const size = await save(j.data.url, dest);
    console.log(`ok ${c.name}.mp4 ${(size/1e6).toFixed(1)}MB`);
  }catch(e){ console.log(`FAIL ${c.name}: ${e.message}`); }
}
console.log('done');
