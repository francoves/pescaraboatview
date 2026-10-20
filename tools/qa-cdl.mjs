import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study";
fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
async function shot(path,name,w,h,full=true,clickBurger=false){
  const p=await b.newPage();
  await p.setViewport({width:w,height:h,deviceScaleFactor:1});
  await p.goto("http://localhost:8080"+path,{waitUntil:"networkidle2",timeout:60000});
  if(clickBurger){ await p.click("#burger"); await new Promise(r=>setTimeout(r,600)); }
  else { await p.evaluate(async()=>{await new Promise(r=>{let y=0;const t=setInterval(()=>{scrollBy(0,800);y+=800;if(y>=document.body.scrollHeight){clearInterval(t);r();}},80);});}); await new Promise(r=>setTimeout(r,700)); await p.evaluate(()=>scrollTo(0,0)); await new Promise(r=>setTimeout(r,300)); }
  await p.screenshot({path:`${OUT}/${name}.png`,fullPage:full && !clickBurger});
  await p.close(); console.log("saved",name);
}
await shot("/assicurativo","assicurativo-d",1440,900);
await shot("/finanziario","finanziario-d",1440,900);
await shot("/chi-sono","chisono-d",1440,900);
await shot("/contatti","contatti-d",1440,900);
await shot("/assicurativo","assicurativo-m",390,844);
await shot("/finanziario","finanziario-m",390,844);
await shot("/","menu-m",390,844,false,true);
await b.close();
