import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

function createUID() {
  const buf = new Buffer.alloc(4);
  return crypto.randomFillSync(buf).toString('hex');
}
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

var ex = {
  createUID,
  isNumber
}
export {createUID, isNumber};
export default ex;



/*
res.set = res.setHeader;
    res.header = res.setHeader;
    res.type = (ext) => {
      const type = mime.getType(ext);
      //console.log({ext,type})
      if (!type) {
        throw new Error(`res.type "${ext}" null`);
      }
      res.set("Content-Type", type);
    }
    res.json = async (obj) => {
      try {
        if (typeof (obj) === 'object' && obj !== null && obj !== undefined) {
          const json = JSON.stringify(obj);
          const contentLength = Buffer.byteLength(json);
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Content-Length", contentLength);
          res.end(json);
        }
        else if (typeof (obj) === 'string' && obj.endsWith('.json')) {
          const json = JSON.stringify(await readFileJSON(obj));
          const contentLength = Buffer.byteLength(json);
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Content-Length", contentLength);
          res.end(json);
        } else {
          throw new TypeError('Invalid arguments! Arguments must be object or path to .json file');
        }
      } catch (error) {
        console.error(error);
        response500Default(req, res, error);
        return error;
      }
    }
    res.text = async (string) => {
      try {
        if (string === true || string === false) {
          string = String(string);
        }
        if (isNumber(string)) {
          string = String(string);
        }
        const ok = typeof (string) === 'string';
        if (!ok) {
          throw new TypeError('Invalid arguments! Arguments must be string or path to .txt file');
        }
        if (string.endsWith('.txt')) {
          const text = await fsp.readFile(string, 'utf8');
          const contentLength = Buffer.byteLength(text);
          res.setHeader('Content-Type', "text/plain");
          res.setHeader("Content-Length", contentLength);
          res.end(text);
        } else {
          const contentLength = Buffer.byteLength(string);
          res.setHeader('Content-Type', "text/plain");
          res.setHeader("Content-Length", contentLength);
          res.end(string);
        }
      } catch (error) {
        console.error(error);
        response500Default(req, res, error);
        return error
      }
    }
    res.html = async (html) => {
      try {
        const ok = typeof (html) === 'string';
        if (!ok) {
          throw new TypeError('Invalid arguments! Arguments must be string or path to .html file');
        }
        if (html.endsWith('.html')) {
          const text = await fsp.readFile(html, 'utf8');
          const contentLength = Buffer.byteLength(text);
          res.setHeader("Content-Type", 'text/html');
          res.setHeader("Content-Length", contentLength);
          res.end(text);
        } else {
          const contentLength = Buffer.byteLength(html);
          res.setHeader("Content-Type", 'text/html');
          res.setHeader("Content-Length", contentLength);
          res.end(html);
        }
      } catch (error) {
        console.error(error);
        response500Default(req, res, error);
        return error
      }
    }
    res.send = async (data) => {
      try {
        if (data === null || data === undefined) {
          throw new TypeError('Invalid arguments! Allowed Arguments are Buffer, String, Number, Boolean, Array, Object ');
        }
        const headers = { ...res.getHeaders() };
        const contentType = headers["content-type"];
        const isBuffer = Buffer.isBuffer(data);
        if (isBuffer) {
          if (!contentType) {
            res.set('Content-Type', 'application/octet-stream')
          }
          const contentLength = Buffer.byteLength(data);
          res.setHeader("Content-Length", contentLength);
          res.end(data);
        } else {
          if (isNaN(data) && !Array.isArray(data) && !(data instanceof Object) && typeof data !== 'boolean' && typeof data !== "string" && typeof data !== 'symbol' && typeof data !== 'function' && typeof data !== 'bigint') {
            data = String(data);
          }
          if (data === true || data === false) {
            data = String(data);
          }
          if (isNumber(data)) {
            data = String(data);
          };
          const dataType = typeof (data);
          if (!contentType) {
            dataType === 'string'
              ?
              res.set('Content-Type', 'text/html')
              :
              res.set('Content-Type', 'application/json')
          }
          if (dataType === "string") {
            const contentLength = Buffer.byteLength(data);
            res.setHeader("Content-Length", contentLength);
            res.end(data);
          } else {
            data = JSON.stringify(data);
            const contentLength = Buffer.byteLength(data);
            res.setHeader("Content-Length", contentLength);
            res.end(data);
          }
        }
      } catch (error) {
        console.error(error);
        response500Default(req, res, error);
        return error
      }
    }
    res.redirect = async (statusCode, location) => {
      if (res.statusCode < 300) {
        res.statusCode = 302
      };
      res.setHeader("Location", location);
      res.end();
    }
    
    
    */