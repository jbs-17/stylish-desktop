import { existsSync, writeFileSync, readFileSync } from "node:fs";
import "dotenv/config.js";
import process from "node:process";
import fs from "node:fs";
import path from "node:path";

const rootpath = import.meta.dirname;
const database = path.resolve(`${rootpath}/database`);
const userdatabase = path.resolve(`${rootpath}/database/userdatabase.json`);
const sesidatabase = path.resolve(`${rootpath}/database/sesidatabase.json`);
const publicdb = path.resolve(`${rootpath}/public`);
const pagesdatabase = path.resolve(`${rootpath}/public/page`);
const imagesdatabase = path.resolve(`${rootpath}/public/upload/images`);
const videosdatabase = path.resolve(`${rootpath}/public/upload/videos`);
const uploadsdatabase = path.resolve(`${rootpath}/public/upload`);
const uploadsppdatabase = path.resolve(`${rootpath}/public/upload/pp`);
const tempdatabase = path.resolve(`${rootpath}/public/temp/tmp`);
const tempimagesdatabase = path.resolve(`${rootpath}/public/temp/images`);
const tempvideosdatabase = path.resolve(`${rootpath}/public/temp/videos`);
const templistdatabase = path.resolve(
  `${rootpath}/database/templistdatabase.json`
);

// const exceptPath = ["route", "admin", "module", "routers"]
const exceptPath = ["route"];

const logpath = path.resolve(`${rootpath}/log.txt`);
const maxFileSize = 1024 * 1024 * 20; //mb
const maxFileSizePP = 1024 * 1024 * 10; //mb
const intervalCheckSesiLogin = 60 * 60; //detik
const lamaSesiLogin = 60 * 60; //detik
const admins = ["admin", "jbs"];



//dir
for (const p of [
  database,
  publicdb,
  imagesdatabase,
  videosdatabase,
  uploadsdatabase,
  uploadsppdatabase,
  tempdatabase,
  tempimagesdatabase,
  tempvideosdatabase,
  templistdatabase,
]) {
  
    fs.stat(p, (err) => {
    if(err){
      fs.mkdir(p, {recursive: true}, (err, path)=>{
        console.log(`dir ${path} di buat`);
      })
    };
  });
}

if (!existsSync(userdatabase)) {
  writeFileSync(userdatabase, "[]");
  console.log(`userdatabase dipulihkan`);
}
const isiuserdatabase = readFileSync(userdatabase, "utf8");
if (!isiuserdatabase.startsWith("[") && !isiuserdatabase.endsWith("]")) {
  writeFileSync(userdatabase, "[]");
}

const port = Number(process.env.SERVER_PORT) || 3000;
const useCache = process.env.CACHE === "0" ? false : true;
console.log({useCache});

export {
  port,
  pagesdatabase,
  rootpath,
  database,
  userdatabase,
  imagesdatabase,
  videosdatabase,
  sesidatabase,
  tempimagesdatabase,
  tempvideosdatabase,
  tempdatabase,
  templistdatabase,
  intervalCheckSesiLogin,
  lamaSesiLogin,
  admins,
  logpath,
  maxFileSize,
  exceptPath,
  useCache,
  uploadsdatabase,
  maxFileSizePP,
  uploadsppdatabase,
  publicdb,
};
export default {
  port,
  pagesdatabase,
  rootpath,
  database,
  userdatabase,
  imagesdatabase,
  videosdatabase,
  sesidatabase,
  tempimagesdatabase,
  tempvideosdatabase,
  tempdatabase,
  templistdatabase,
  uploadsdatabase,

  intervalCheckSesiLogin,
  lamaSesiLogin,

  admins,
  publicdb,
  logpath,
  maxFileSize,
  maxFileSizePP,
  uploadsppdatabase,
};
// console.dir(config);
// console.log(module.exports)
