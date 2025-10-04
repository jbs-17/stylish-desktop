"use strict";




//core
import http from 'node:http';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';

//locale
const fsp = fs.promises;
import { isNumber } from './jbs-utility.js';
import errorMessage from './jbs-error-message.js';


//third party
import mime from 'mime';
import jsonfile from 'jsonfile';
const readFileJSON = util.promisify(jsonfile.readFile);
import httpxcode from './http-status-codes.js';





class ResponseError extends Error {
  constructor(message = 'error', cause = 'error', fields = {}, ...params) {
    super(message);
    this.name = 'ResponseError';
    this.cause = cause
    this.fields = fields;
    this.params = params;
  }
}



class Response extends http.ServerResponse {
};



Response.prototype.locals = {};



//.set status kode
Response.prototype.sendStatus = function sendStatus(statusCode = 200) {
  try {
    if (!(statusCode in httpxcode)) {
      throw new ResponseError(`Invalid status code: ${statusCode}`, { statusCode });
    }
    this.statusCode = statusCode;
    return this;
  } catch (error) {
    console.error(error);
    this.response500(this.req, this, error);
    return this
  }
}
//.set status kode
Response.prototype.status = function status(statusCode = 200) {
  try {
    if (!(statusCode in httpxcode)) {
      throw new ResponseError(`Invalid status code: ${statusCode}`, { statusCode })
    }
    this.statusCode = statusCode;
    return this;
  } catch (error) {
    const e = new ResponseError(error.message, error);
    console.error(e);
    this.serverErrorResponse(this.req, this, e);
    return this
  }
}
Object.defineProperty(Response.prototype.status, 'toString', {
  value: function status() {
    return this;
  }
})

//.atur satu header
Response.prototype.set = Response.prototype.setHeader;

//.atur satu header
Response.prototype.header = Response.prototype.setHeader;

//.atur semua header dan status kode
Response.prototype.headers = Response.prototype.setHeaders;

//.atur konten type lewat ekstensi file atau path file
Response.prototype.type = function type(ext) {
  try {
    const type = mime.getType(ext);
    if (!type) {
      throw errorMessage(new Error(`content type of "${ext}" is not valid`, ext));
    }
    this.setHeader("Content-Type", type);
    return this;
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this
  }
}

//.kirim response json
Response.prototype.json = async function json(obj) {
  try {
    if (typeof (obj) === 'object' && obj !== null && obj !== undefined) {
      const json = JSON.stringify(obj);
      const contentLength = Buffer.byteLength(json);
      this.setHeader("Content-Type", "application/json");
      this.setHeader("Content-Length", contentLength);
      this.end(json);
      return this;
    }
    else if (typeof (obj) === 'string' && obj.endsWith('.json')) {
      const json = JSON.stringify(await readFileJSON(obj));
      const contentLength = Buffer.byteLength(json);
      this.setHeader("Content-Type", "application/json");
      this.setHeader("Content-Length", contentLength);
      this.end(json);
      return this;
    } else {
      throw new ResponseError('Invalid arguments! Arguments must be object or path to .json file',);
    }
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this
  }
}

//.kirim response text plain
Response.prototype.text = async function (string) {
  try {
    if (typeof string === 'number') {
      string = [string].toString();
    }
    if (typeof string === 'object') {
      string = JSON.stringify(string);
    }
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
      this.setHeader('Content-Type', "text/plain");
      this.setHeader("Content-Length", contentLength);
      this.end(text);
    } else {
      const contentLength = Buffer.byteLength(string);
      this.setHeader('Content-Type', "text/plain");
      this.setHeader("Content-Length", contentLength);
      this.end(string);
    }
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this
  }
}

//.kirim response text html
Response.prototype.html = async function html(html) {
  try {
    this.setHeader("Content-Type", 'text/html');
    const ok = typeof (html) === 'string';
    if (!ok) {
      throw new TypeError('Invalid arguments! Arguments must be string or path to .html file');
    }
    if (html.endsWith('.html')) {
      const text = await fsp.readFile(html, 'utf8');
      const contentLength = Buffer.byteLength(text);
      this.setHeader("Content-Length", contentLength);
      this.end(text);
      return this;
    } else {
      const contentLength = Buffer.byteLength(html);
      this.setHeader("Content-Length", contentLength);
      this.end(html);
      return this;
    }
  } catch (error) {
    const e = new errorMessage(error);
    console.error(e);
    this.response500(this.req, this, e);
    return this
  }
}

//.kirim response apa saja (str, number, buffer, json)
Response.prototype.send = async function send(body) {
  try {
    let data = body;
    if (data === null || data === undefined) {
      throw new TypeError('Invalid arguments! Allowed Arguments are Buffer, String, Number, Boolean, Array, Object ');
    }
    const headers = { ...this.getHeaders() };
    const contentType = headers["content-type"];
    const isBuffer = Buffer.isBuffer(data);
    if (isBuffer) {
      if (!contentType) {
        this.set('Content-Type', 'application/octet-stream')
      }
      const contentLength = Buffer.byteLength(data);
      this.setHeader("Content-Length", contentLength);
      this.end(data);
      return this;
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
          this.set('Content-Type', 'text/html')
          :
          this.set('Content-Type', 'application/json')
      }
      if (dataType === "string") {
        const contentLength = Buffer.byteLength(data);
        this.setHeader("Content-Length", contentLength);
        this.end(data);
        return this;
      } else {
        data = JSON.stringify(data);
        const contentLength = Buffer.byteLength(data);
        this.setHeader("Content-Length", contentLength);
        this.end(data);
        return this;
      }
    }
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this
  }
}
//.redirect
Response.prototype.redirect = function redirect(location = '/', statusCode = 302) {
  try {
    if (typeof location !== 'string' || typeof statusCode !== 'number' && statusCode) {
      throw TypeError('location or status code invalid')
    }
    if (this.statusCode < 300 || this.statusCode > 399) {
      this.statusCode = 302
    };
    this.setHeader("Location", location);
    this.end();
    return this;
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this
  }
}
//. set heder location
Response.prototype.location = function setLocation(path) {
  try {
    this.setHeader('Location', path);
    return this;
  } catch (error) {
    const e = errorMessage(error);
    this.response500(this.req, this, e);
    console.log(e);
    return this;
  }
}
//.
/**
 * Custom res.sendFile seperti Express
 * @param {string} filePath - filepathnya
 * @param {object} [options]
 * @param {string} [options.root]
 * @param {object} [options.headers]
 * @param {function} [callback]
 */
Response.prototype.sendFile = function (filePath, options = {}, callback = () => { }) {
  let absolutePath = filePath;

  // Jika path relatif dan ada root, gabungkan
  if (!path.isAbsolute(filePath)) {
    if (options.root) {
      absolutePath = path.resolve(options.root, filePath);
    } else {
      absolutePath = path.resolve(import.meta.dirname, filePath);
    }
  }

  fs.stat(absolutePath, (err, stat) => {
    if (err || !stat.isFile()) {
      this.writeHead(404, { 'Content-Type': 'text/plain' });
      this.end('File not found');
      return callback(err || errorMessage(new Error('File not found')));
    }
    let contentType = 'application/octet-stream';
    const getContentType = this.getHeader('content-type');
    if (!getContentType) {
      contentType = mime.getType(filePath) ?? 'application/octet-stream'
    } else {
      contentType = getContentType;
    }
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'X-Sent': new Date().toISOString(),
      ...(options.headers || {})
    };

    this.writeHead(200, headers);

    const stream = fs.createReadStream(absolutePath);
    stream.pipe(this);
    stream.on('error', (streamErr) => {
      this.writeHead(500, { 'Content-Type': 'text/plain' });
      this.end('Internal Server Error');
      return callback(streamErr);
    });
    stream.on('end', () => callback(null));
  });
};


Response.prototype.download = function (filePath, filename = null, options = {}, callback = () => { }) {
  let absolutePath = filePath;

  if (!path.isAbsolute(filePath)) {
    if (options.root) {
      absolutePath = path.resolve(options.root, filePath);
    } else {
      absolutePath = path.resolve(import.meta.dirname, filePath);
    }
  }

  fs.stat(absolutePath, (err, stat) => {
    if (err || !stat.isFile()) {
      this.writeHead(404, { 'Content-Type': 'text/plain' });
      this.end('File not found');
      return callback(err || errorMessage(new Error('File not found')));
    }

    let contentType = 'application/octet-stream';
    const getContentType = this.getHeader('content-type');
    if (!getContentType) {
      contentType = mime.getType(filePath) ?? 'application/octet-stream'
    } else {
      contentType = getContentType;
    }
    const baseName = filename || path.basename(absolutePath);
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${baseName}"`,
      'X-Download': new Date().toISOString(),
      ...(options.headers || {})
    };

    this.writeHead(200, headers);

    const stream = fs.createReadStream(absolutePath);
    stream.pipe(this);
    stream.on('error', (streamErr) => {
      this.writeHead(500, { 'Content-Type': 'text/plain' });
      this.end('Download failed');
      return callback(streamErr);
    });
    stream.on('end', () => callback(null));
  });
};

/**
 * @param {string} [filename] - Nama file unduhan
 */
Response.prototype.attachment = function (filename) {
  let disposition = 'attachment';
  if (filename) {
    disposition += `; filename="${path.basename(filename)}"`;
  }
  this.setHeader('Content-Disposition', disposition);
};


/**
 * Set cookie
 * @param {string} name
 * @param {string} value
 * @param {object} [options]
 * - maxAge: number (ms)
 * - expires : Date	new Date(Date.now() + 3600000)
 * - path : string	'/', '/user'
 * - domain : string	'example.com', 'sub.domain.com'
 * - secure : boolean	true
 * - httpOnly : boolean	true
 * - sameSite : string	'Strict', 'Lax', 'None'
 */
Response.prototype.cookie = function (name, value, options = {
  maxAge: '', expires: '', path: '', domain: '', secure: '', httpOnly: '', sameSite: ''
}) {
  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.maxAge) cookieStr += `; Max-Age=${Math.floor(options.maxAge / 1000)}`;
  if (options.expires) cookieStr += `; Expires=${options.expires.toUTCString()}`;
  if (options.path) cookieStr += `; Path=${options.path}`;
  if (options.domain) cookieStr += `; Domain=${options.domain}`;
  if (options.secure) cookieStr += `; Secure`;
  if (options.httpOnly) cookieStr += `; HttpOnly`;
  if (options.sameSite) cookieStr += `; SameSite=${options.sameSite}`;

  // Tambahkan ke header Set-Cookie
  const current = this.getHeader('Set-Cookie');
  if (Array.isArray(current)) {
    this.setHeader('Set-Cookie', [...current, cookieStr]);
  } else if (current) {
    this.setHeader('Set-Cookie', [current, cookieStr]);
  } else {
    this.setHeader('Set-Cookie', cookieStr);
  }
};


/**
 * @param {string} name
 * @param {object} [options]
 */
Response.prototype.clearCookie = function (name, options = {}) {
  options.expires = new Date(1); // 1970
  options.maxAge = 0;
  this.cookie(name, '', options);
};







// eslint-disable-next-line no-unused-vars
Response.prototype.render = function render(template = '', data = {}) {

}




Response.prototype.response200 = function (req, res) {
  this.status = 200;
  this.end('200 - OK');
}

Response.prototype.response404 = function (req, res) {
  this.end('404 - NOT FOUND');
  return;
}

Response.prototype.response500 = function (req, res, error) {
  this.status = 500;
  this.end('500 - INTERNAL SERVER ERROR');
}








export default Response;
export { Response };

