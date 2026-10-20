import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study";
fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
for(const[n,w,h] of [["home2-d",1440,900],["home2-m",390,844]]){
  const p=await b.newPage(); await p.setViewport({width:w,height:h,deviceScaleFactor:1});
  await p.goto("http://localhost:8080/",{waitUntil:"networkidle2",timeout:60000});
  await p.evaluate(async()=>{await new Promise(r=>{let y=0;const t=setInterval(()=>{scrollBy(0,800);y+=800;if(y>=document.body.scrollHeight){clearInterval(t);r();}},70);});});
  await new Promise(r=>setTimeout(r,700)); await p.evaluate(()=>scrollTo(0,0)); await new Promise(r=>setTimeout(r,300));
  await p.screenshot({path:`${OUT}/${n}.png`,fullPage:true}); await p.close(); console.log("saved",n);
}
await b.close();
