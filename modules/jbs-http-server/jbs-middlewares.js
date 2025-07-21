import fs from "node:fs/promises";

import constants from "node:constants";
import url from 'node:url';
import path from "node:path";
import { searchFiles } from './jbs-search-file-async.js'

import Request from "./jbs-request.js";
import Response from "./jbs-response.js";

import { Buffer } from 'node:buffer';

import mime from 'mime'; // npm install mime
import { createReadStream } from "node:fs";



// eslint-disable-next-line no-unused-vars
async function urlencoded(req = Request.prototype, res = Response.prototype, next) {
  if (req.body != null) {
    return next();
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('url')) {
    return next();
  }

  try {
    const data = await new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => resolve(body));
      req.on('error', reject); // handle error stream
    });

    req.body = Object.fromEntries(new URLSearchParams(data));
    next();
  } catch (err) {
    console.error('Error parsing body:', err);
    next(err);
  }
}





// eslint-disable-next-line no-unused-vars
async function json(req = Request.prototype, res = Response.prototype, next) {
  if (req.body != null) {
    return next();
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('json')) {
    return next();
  }

  try {
    const data = await new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => resolve(body));
      req.on('error', reject); // handle error stream
    });

    req.body = JSON.parse(data);
    next();
  } catch (err) {
    console.error('Error parsing body:', err);
    next(err);
  }
}




// eslint-disable-next-line no-unused-vars
async function text(req = Request.prototype, res = Response.prototype, next) {
  if (req.body != null) {
    return next();
  }
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('text')) {
    return next();
  }
  try {
    const data = await new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => resolve(body));
      req.on('error', reject); // handle error stream
    });
    req.body = data;
    next();
  } catch (err) {
    console.error('Error parsing body:', err);
    next(err);
  }
}


// eslint-disable-next-line no-unused-vars
async function raw(req = Request.prototype, res = Response.prototype, next) {
  if (req.body != null) {
    return next();
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes(raw.options.type)) {
    return next();
  }
  try {
    const data = await new Promise((resolve, reject) => {
      const chunks = [];
      let totalBytes = 0;
      req.on('data', chunk => {
        totalBytes += chunk.length;
        chunks.push(chunk);
        if (totalBytes > raw.options.limit) {
          reject(new Error('Max payload exced!', { status: 413 }));
          req.destroy();
        }
      });
      req.on('end', () => { resolve(chunks) });
      req.on('error', reject); // handle error stream
    });

    req.body = Buffer.concat(data);
    next();
  } catch (err) {
    console.error('Error parsing body:', err);
    next(err);
  }
}

Object.defineProperty(raw, 'options', {
  value: { type: 'octet', limit: 1024 * 1024 * 5 }
});










import Cache from "./jbs-simple-caching.js";
function sss(rootDir, options = {
  searchFilesCache: true,
  readStreamFileCache: false,
}) {
  // const maxAge = options.maxAge || 1;
  const maxItemSizeinMegaByte = 1
  async function staticfilehandler(req, res, next) {
    // console.log(req.url);
    try {
      let file;
      const fileReqParse = path.parse(decodeURIComponent(req.url));
      if (!fileReqParse.ext) {
        return next();
      }
      const key = fileReqParse.base;

      if (options.searchFilesCache) {
        const searchFilesCacheItem = await sss.searchFilesCache.get(key);
        file = searchFilesCacheItem;
      }
      if (file === null || file === undefined || !file?.length) {
        file = (await searchFiles(rootDir, key, ['.html']))[0];
      }
      
      if (!file) {
        return next();
      }

      //cari file 
      let stat;
      try {
        await fs.access(file, constants.R_OK);
        stat = await fs.stat(file);
      } catch {
        await sss.searchFilesCache.del(key);
        const searchAgain = (await searchFiles(rootDir, key, ['.html']))[0];
        if (searchAgain) {
          file = searchAgain;
          stat = await fs.stat(file);
        } else {
          return next(); // File tidak ditemukan
        }
      }

      if (!stat.isFile()) {
        return next(); // Bukan file biasa
      }

      //cahing haisl pencarian file
      if (options.searchFilesCache && file !== undefined && !(await sss.searchFilesCache.isExist(key))) {
        await sss.searchFilesCache.add({ key, value: file });
      }

      /*
            const range = req.headers.range;
            console.log({range});
            // Set header content-type dan caching
            const contentType = mime.getType(file) || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', stat.size);
      */
      const contentType = mime.getType(file) || 'application/octet-stream';
      const range = req.headers.range;

      ////////////
      if (range && /^video\//.test(contentType)) {
        const fileSize = stat.size;
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
          res.writeHead(416, {
            'Content-Range': `bytes */${fileSize}`,
          });
          return res.end();
        }

        const chunkSize = (end - start) + 1;
        const stream = createReadStream(file, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType,
        });

        stream.pipe(res);
        stream.on('error', err => next(err));
        return;
      }
      /////////////


      // res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': stat.size,
        'Content-Type': contentType,
      });

      if (options.readStreamFileCache && !(sss.readStreamFileCache.isExist(key))) {
        const readStreamFileCacheItem = await sss.readStreamFileCache.get(key);
        res.write(readStreamFileCacheItem);
        res.end();
        return
      }

      // Kirim stream ke response
      const stream = createReadStream(file);
      stream.pipe(res);
      stream.on('error', err => next(err));
      //chache stream
      if (options.readStreamFileCache && stat.size < 1024 * 1024 * maxItemSizeinMegaByte) {
        const chunks = [];
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        stream.on('end', async () => {
          if (options.readStreamFileCache) {
            const completeBuffer = Buffer.concat(chunks);
            await sss.readStreamFileCache.add({ key, value: completeBuffer });
          }
        });
      }

    } catch (err) {
      next(err); // Error tak terduga
    }
  };
  //untuk identifikasi
  Object.defineProperty(staticfilehandler, 'type', {
    value: 'staticfilehandler'
  })
  return staticfilehandler
}
sss.searchFilesCache = new Cache(512, 1, (5 / 60))
sss.readStreamFileCache = new Cache(128, 1, (5 / 60));




json.JBSmiddlewares = true
urlencoded.JBSmiddlewares = true;
text.JBSmiddlewares = true;
raw.JBSmiddlewares = true;
sss.JBSmiddlewares = true;



const middlewares = {
  urlencoded, json, text, raw, static: sss
}

export { urlencoded, json, text, raw, sss }
export default middlewares


