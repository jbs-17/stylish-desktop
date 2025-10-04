import http from 'node:http';
import querystring from 'node:querystring';
import url from 'node:url';

import Response from './jbs-response.js';


class Request extends http.IncomingMessage {
  query = url.parse(this.url, true).query;
  res = Response.prototype;
  get urlParsed() {
    return url.parse(this.url);
  }
  get auth() {
    return this.urlParsed?.auth;
  }
  get protocol() {
    return this.urlParsed?.protocol ?? '';
  }
  get hash() {
    return this.urlParsed?.hash ?? '';
  }
  get href() {
    return this.urlParsed?.href ?? '';
  }
  get path() {
    return this.urlParsed?.path ?? '';
  }
  get pathname() {
    return this.urlParsed?.pathname ?? ''
  }
  get port() {
    return this.urlParsed?.port ?? ''
  }
  get search() {
    return this.urlParsed?.search ?? ''
  }
  get slashes() {
    return this.urlParsed?.slashes ?? ''
  }
  get querystring() {
    return this?.urlParsed?.query ?? '';
  }
  get queryParsed() {
    return querystring.parse(this?.querystring ?? '') ?? '';
  }
  get cookies() {
    let cookie = this?.headers?.cookie;
    if (cookie === undefined) {
      return {}
    } else {
      return Object.fromEntries(
        (cookie || '').split(';').map(c => c.trim().split('=')));
    }
  }
  get host() {
    return this?.headers?.host ?? '';
  }
  get hostname() {
    return this?.urlParsed?.hostname ?? '';
  }
  get ip() {
    return this?.socket?.remoteAddress ?? '';
  }
  get originalUrl() {
    return this.url;
  }
  get contentType() {
    return this.headers['content-type'];
  }
  get accept() {
    return this.headers?.accept ?? '';
  }
  get acceptRanges() {
    return this.headers['accept-ranges']
  }
  get acceptPatch() {
    return this.headers['accept-patch']
  }
  get referer() {
    return this.headers?.referer ?? '';
  }
  get date() {
    return this.headers?.date ?? Date();
  }
  get(key = '') {
    key = key.toLocaleLowerCase();
    return this?.headers[key] ?? '';
  }
  is(contentType = '') {
    contentType = contentType.toLocaleLowerCase();
    return this?.headers?.accept?.includes(contentType) ?? false;
  }
  async urlencoded() {
    return new Promise((resolve, reject) => {
      if (this.body !== null) { resolve({}) };
      const contentType = this.headers['content-type'] || '';
      if (!contentType?.includes('url')) {
        resolve({});
      } else {
        let data = '';
        this.on('data', chunk => data += chunk);
        this.on('end', () => {
          resolve(Object.fromEntries(new URLSearchParams(data)));
        });
        this.on('error', reject);
      }
    })
  }
  async json() {
    return new Promise((resolve, reject) => {
      if (this.body !== null) { resolve({}) };
      const contentType = this.headers['content-type'] || '';
      if (!contentType?.includes('json')) {
        resolve({});
      } else {
        let data = '';
        this.on('data', chunk => data += chunk);
        this.on('end', () => {
          resolve(JSON.stringify(data));
        });
        this.on('error', reject);
      }
    })
  }
  async text() {
    return new Promise((resolve, reject) => {
      if (this.body !== null) { resolve('') };
      const contentType = this.headers['content-type'] || '';
      if (!contentType?.includes('text')) {
        resolve('');
      } else {
        let data = '';
        this.on('data', chunk => data += chunk);
        this.on('end', () => {
          resolve(data);
        });
        this.on('error', reject);
      }
    })
  }
}
Request.prototype.params = {};
Request.prototype.body = null;




export default Request;
export { Request };

