import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study"; fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
async function navshot(path,name,scroll=false){
  const p=await b.newPage(); await p.setViewport({width:1380,height:300,deviceScaleFactor:2});
  await p.goto("http://localhost:8080"+path,{waitUntil:"networkidle2",timeout:60000});
  if(scroll){ await p.evaluate(()=>scrollTo(0,400)); await new Promise(r=>setTimeout(r,500)); }
  else await new Promise(r=>setTimeout(r,500));
  await p.screenshot({path:`${OUT}/${name}.png`,clip:{x:0,y:0,width:1380,height:120}});
  await p.close(); console.log("saved",name);
}
await navshot("/","nav-home");
await navshot("/assicurativo","nav-assic");
await navshot("/","nav-scrolled",true);
await b.close();
