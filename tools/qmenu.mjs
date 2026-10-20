import puppeteer from "puppeteer-core";
import fs from "node:fs";
const EXE="C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT="C:/Users/Franco/Documents/Code/christian-de-leonibus/_study"; fs.mkdirSync(OUT,{recursive:true});
const b=await puppeteer.launch({executablePath:EXE,headless:"new",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:390,height:844,deviceScaleFactor:1.6});
await p.goto("http://localhost:8080/",{waitUntil:"networkidle2",timeout:60000});
await p.click("#burger"); await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:`${OUT}/menu2.png`}); await b.close(); console.log("done");
