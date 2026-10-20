import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study";
fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
for(const[path,name] of [["/","hero-home"],["/assicurativo","hero-assic"]]){
  const p=await b.newPage(); await p.setViewport({width:1380,height:820,deviceScaleFactor:1.5});
  await p.goto("http://localhost:8080"+path,{waitUntil:"networkidle2",timeout:60000});
  await new Promise(r=>setTimeout(r,700));
  await p.screenshot({path:`${OUT}/${name}.png`}); await p.close(); console.log("saved",name);
}
await b.close();
