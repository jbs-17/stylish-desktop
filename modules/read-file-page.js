import fsx from "fs-extra";
import searchFiles from "./search-file-async.js";
import Cache from "./cache.js";
import config, { useCache } from "../config.js";
const cache1 = new Cache(5000);


export { readFilePage };
// eslint-disable-next-line no-unused-vars
export default async function readFilePage(fileName, req = {}, res) {
  try {
    if (useCache) {
      const getCache = await cache1.get(fileName);
      // console.log(`[CACHE ${getCache ? "Y" : "N"}] ${fileName}`);
      if (getCache !== null) {
        return getCache;
      }
    } else {
      // console.log(`[CACHE N] ${fileName}`);
    }

    //*non cache
    const filePath = (await searchFiles(config.pagesdatabase, fileName))[0];
    if (!filePath) {
      throw Error("tidak ada fileyg dimaksud di database");
    }
    let data = await fsx.readFile(filePath, { encoding: "utf-8" });
//     data += /*html*/ `
//     <script> 
// const head = document.querySelector('head');
// const metaRefresh = document.createElement('meta');
// metaRefresh.setAttribute('http-equiv', 'refresh');
// metaRefresh.setAttribute('content', '3660');
// head.append(metaRefresh);
//     </script>
//     `;
    if (useCache) {
      cache1.add({ key: fileName, value: data });
    }
    return data;
  } catch {
    return false;
  }
}
