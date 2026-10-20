import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study"; fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:1200,height:820,deviceScaleFactor:1.4});
await p.goto("https://christian-de-leonibus.vercel.app/gate",{waitUntil:"networkidle2",timeout:60000});
await new Promise(r=>setTimeout(r,900));
await p.screenshot({path:`${OUT}/gate.png`}); await b.close(); console.log("done");
