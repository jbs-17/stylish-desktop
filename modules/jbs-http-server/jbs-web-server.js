"use strict";

//core module
import EventEmitter from 'node:events';
import http from 'node:http';
import url from 'node:url';

//locale module
import httpStatusCodes from './http-status-codes.js';
import Request from './jbs-request.js'; //Object Request http extended
import Response from './jbs-response.js'; //Object Response http extended
import { createUID } from './jbs-utility.js'; //utilitas
import { json, raw, sss, text, urlencoded } from './jbs-middlewares.js'; //middeware bawann
import { createRouter } from './jbs-router.js'; //Router
import errorMessage from './jbs-error-message.js';
import { readdirTemplates, readTemplatesAndServe } from './jbs-html-template-engine-x-gpt.js'
import { randomUUID } from 'node:crypto';


//timpa prototipe req res denagn yang sudah di extends
// http.ServerResponse.prototype = Response.prototype;
// http.IncomingMessage.prototype = Request.prototype;
// http.IncomingMessage.prototype = Object.create(Request.prototype);
// http.ServerResponse.prototype = Object.create(Response.prototype);
// Object.setPrototypeOf(http.IncomingMessage, Request.prototype);
// Object.setPrototypeOf(http.ServerResponse, Response.prototype);
// http.IncomingMessage = Request
// http.ServerResponse = Response;



function JBS(req, res) {
  const instance = app();
  instance.app = instance;
  const isReq = req instanceof http.ClientRequest;
  const isRes = res instanceof http.ServerResponse;
  if (isReq || isRes) {
    console.log('wow');
  }
  if (req || res) {
    instance.handler(req, res);
  }
  Response.prototype.app = instance;
  return instance
}

///define properti untuk pembuat intance app
Object.defineProperty(JBS, 'http-status-codes', {
  value: httpStatusCodes,
  enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(JBS, 'http-status-codes', {
  value: httpStatusCodes,
  enumerable: false, writable: false, configurable: false,
});
Object.defineProperty(JBS, 'Request', {
  value: Request,
  enumerable: false, configurable: true, writable: true,
})
Object.defineProperty(JBS, 'Response', {
  value: Response,
  enumerable: false, configurable: true, writable: true,
})
Object.defineProperty(JBS, 'Router', {
  value: createRouter,
  configurable: false, writable: false, enumerable: false
});

//beberapa middleware bawaan 
Object.defineProperty(JBS, 'static', {
  enumerable: false, configurable: true, writable: true,
  value: sss,
})
Object.defineProperty(JBS, 'urlencoded', {
  enumerable: false, writable: false, configurable: false,
  value: function () { return urlencoded }
});
Object.defineProperty(JBS, 'json', {
  enumerable: false, writable: false, configurable: false,
  value: function () { return json }
});
Object.defineProperty(JBS, 'text', {
  enumerable: false, writable: false, configurable: false,
  value: function () { return text }
});
Object.defineProperty(JBS, 'raw', {
  enumerable: false, writable: false, configurable: false,
  value: function (options = { type: '', limit: 0 }) {
    if (typeof options === 'object') {
      if (options?.type?.length) { raw.options.type = options.type };
      if (options?.limit !== 0) { raw.options.limit = options.limit };
    }
    console.log(raw.options);
    return raw
  }
});


class MyEmitter extends EventEmitter { };
function app() {
  const chains = [];
  const middlewares = [];
  const endpoints = [];
  const params = [];

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function anonymousCallbackMd(req = Request.prototype, res = Response.prototype, next = function (error) { error }) { req; res; next() };
  function anonymousCallbackParam(req = Request.prototype, res = Response.prototype, next = function (error) { error }, value) { req; res; value; next() };
  function cb(req = Request.prototype, res = Response.prototype) { appHandler.response200(req, res) }
  cb.isCb = true;
  anonymousCallbackParam.isCb = true;
  anonymousCallbackMd.isCb = true;
  anonymousCallbackMd.isPathCb = true;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async function response200(callback = cb, res = Response.prototype) {
    try {
      if (typeof callback === 'function') {
        appHandler.response200 = callback;
        return
      }
      const req = callback;
      res.statusCode = 200;
      if (req.headers['content-type']?.includes('json') || req.headers['content-type']?.includes('url')) {
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: true, message: `${req.method} - ${req.url} - ${res.statusCode} - OK` });
        return
      }
      res.setHeader("message", `${req.method} - ${req.url} - ${res.statusCode} - OK`);
      res.write(`${req.method} - ${req.url} - ${res.statusCode} - OK`);
      res.end();
      return true;
    } catch (error) {
      res.statusCode = 500;
      res.end('ERROR', error?.stack);
    }
  }
  async function response404(callback = cb, res = Response.prototype) {
    try {
      if (typeof callback === 'function') {
        appHandler.response404 = callback;
        return
      }
      const req = callback;
      res.statusCode = 404;
      if (req.headers['content-type']?.includes('json') || req.headers['content-type']?.includes('url')) {
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: false, message: `${req.method} - ${req.url} - ${res.statusCode} - NOT FOUND` });
        return
      }
      res.setHeader("message", `${req.method} - ${req.url} - ${res.statusCode} - NOT FOUND`);
      res.write(`${req.method} - ${req.url} - ${res.statusCode} - NOT FOUND`);
      res.end();
      return true;
    } catch (error) {
      res.statusCode = 500;
      res.end('ERROR', error?.stack);
    }
  };
  async function response500(callback = cb, res = Response.prototype, error = errorMessage(new Error('internal server error'))) {
    try {
      console.error(`ERROR:\n`, error);
      if (typeof callback === 'function') {
        appHandler.response500 = callback;
        return
      }
      const req = callback;
      res.statusCode = 500;
      if (req.headers['content-type']?.includes('json') || req.headers['content-type']?.includes('url')) {
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: false, message: `${req.method} - ${req.url} - 500 - INTERNAL-SERVER-ERROR`, error: error?.stack ?? '' })
        return
      }
      res.setHeader('Content-Type', 'text/plain')
      res.setHeader("message", `${req.method} - ${req.url} - 500 - INTERNAL-SERVER-ERROR`);
      res.write(`${req.method} - ${req.url} - 500 - INTERNAL-SERVER-ERROR\n`);
      res.write(error?.stack ?? '');
      res.end();
      return true;
    } catch (error) {
      res.statusCode = 500;
      res.end('ERROR', error?.stack);
    }
  }

  const responseEvents = new MyEmitter();

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //.ROUTING BERDASAR HTTP METHOD HANDLER 
  function method(path = 'default', callback = cb, method) {
    if (typeof path !== 'string') {
      throw errorMessage(new Error('invalid argument! path argument must be a string'));
    }
    if (typeof callback !== 'function') {
      throw errorMessage(new Error('invalid argument! callback argument must be a function!'));
    }
    if (path === '' || callback?.isCb === true && appHandler.settings.strict) {
      throw errorMessage(new Error('invalid arguments! path or callback arguments cannot be empty or undefined!'))
    }
    let f = path;
    // //hapus / diakhir
    // if (f.endsWith('/')) {
    //   f = f.slice(0, f.length - 1)
    // }
    //tambahkan / diawal jika belum ada
    if (!f.startsWith('/')) {
      f = '/' + f
    }

    //jika static
    if (
      !f.includes(':') &&
      !f.includes('?') &&
      !f.includes('*')
    ) {
      const info = {
        method: method,
        f: f,
        enpoORmidware: "endpoint",
        type: "static",
        callback: callback
      }
      createChain(info);
    }
    //jika dynamic
    else {
      if (f.includes('?')) {
        true
      }
      //wildcard
      else if (f.includes('*')) {
        let wildcardCount = 0;
        for (const c of f) {
          if (c === '*') {
            wildcardCount++
          }
        }
        if (wildcardCount === 1) {
          const info = {
            method: method,
            f: f,
            enpoORmidware: "endpoint",
            type: "dynamic-single-wildcard",
            callback: callback
          }
          createChain(info);
        } else {
          const info = {
            method: method,
            f: f,
            enpoORmidware: "endpoint",
            type: "dynamic-multiple-wildcard",
            callback: callback
          }
          createChain(info);
        }
      }
      //param
      else {
        let colonCount = 0;
        for (const c of f) {
          if (c === ':') {
            colonCount++
          }
        }
        //param single
        if (colonCount > 1) {
          const info = {
            method: method,
            f: f,
            enpoORmidware: "endpoint",
            type: "dynamic-multiple-param",
            callback: callback
          }
          createChain(info);
        }
        //multiple parma
        else {
          const info = {
            method: method,
            f: f,
            enpoORmidware: "endpoint",
            type: "dynamic-single-param",
            callback: callback
          }
          createChain(info);
        }
      }
    }
    return appHandler;
  }
  function get(path = '', handler = cb) { method(path, handler, "GET"); return appHandler };
  function post(path = '', handler = cb) { method(path, handler, "POST"); return appHandler };
  function put(path = '', handler = cb) { method(path, handler, "PUT"); return appHandler };
  function delet(path = '', handler = cb) { method(path, handler, "DELETE"); return appHandler };
  function patch(path = '', handler = cb) { method(path, handler, "PATCH"); return appHandler };
  function options(path = '', handler = cb) { method(path, handler, "OPTIONS"); return appHandler };
  function all(path = '', handler = cb) {
    get(path, handler);
    post(path, handler);
    put(path, handler);
    patch(path, handler);
    delet(path, handler);
    options(path, handler);
    return appHandler;
  };
  function route(path = '') {
    if (path === '' || typeof path !== 'string') {
      throw errorMessage(new Error('invalid argument! path argument must be a string!'));
    }
    function getx(handler = cb) {
      get(path, handler);
      return route(path);
    }
    function postx(handler = cb) {
      post(path, handler);
      return route(path);
    }
    function putx(handler = cb) {
      put(path, handler);
      return route(path);
    }
    function patchx(handler = cb) {
      patch(path, handler);
      return route(path);
    }
    function deletx(handler = cb) {
      delet(path, handler);
      return route(path);
    }
    function optionsx(handler = cb) {
      options(path, handler)
      return route(path);
    }
    function allx(handler = cb) {
      all(path, handler);
      return route(path);
    }
    function usex(handler = anonymousCallbackMd) {
      use(path, handler);
      return route(path);
    }
    return {
      get: getx, post: postx, put: putx, patch: patchx, delete: deletx, options: optionsx, use: usex, all: allx
    }
  }
  //. PARAM
  function param(param = '', handler = anonymousCallbackParam) {
    if (typeof param !== 'string') { throw errorMessage(new Error('invalid argument! param argument must be a string!')) }
    if (typeof handler !== 'function') { throw errorMessage(new Error('invalid argument! handler argument must be a function!')) }
    if (param === '' || handler?.isCb === true) {
      throw errorMessage(new Error('invalid argument! param and handler argument cannot be empty or undefined!'))
    }
    handler.param = param;
    let info = {
      method: 'PARAM',
      f: param,
      enpoORmidware: "middleware",
      type: "param-middleware",
      callback: handler
    }
    createChain(info);
    return appHandler;
  }
  //. UNTUK PASANG MIDDLEWARE DAN ROUTER 
  function use(path = anonymousCallbackMd, handler = anonymousCallbackMd) {
    if (handler.JBSmiddlewares === true) {
      handler.JBSmiddlewaresID = randomUUID()
    }
    if (handler?.isRouter) {
      const prefix = path;
      const chains = handler?.chains;
      useRouter(prefix, chains, handler.uuid);
      return
    }
    if (path?.isPathCb === true) {
      throw errorMessage(new Error('invalid arguments! path or handler arguments cannot be empty or undefined!'))
    }
    if (typeof path !== 'string' && typeof path !== 'function' || path === '') {
      throw errorMessage(new Error('invalid arguments! path arguments must be string or function!'));
    }
    let info = {
      method: 'MIDDLEWARE',
      f: path,
      enpoORmidware: "middleware",
      type: "specific-middleware",
      callback: handler
    }
    if (typeof path === 'function') {
      info = {
        method: 'MIDDLEWARE',
        f: 'global',
        enpoORmidware: "middleware",
        type: "global-middleware",
        callback: path
      }
      if (path?.type === "staticfilehandler") {
        info.f = "/";
      }
    } else if (typeof path === 'string') {
      if (typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler argument must be a function or Router!'));
      }
      if (handler?.isCb === true) {
        throw errorMessage(new Error('invalid argument! handler argument must be a function!'))
      }
      info = {
        method: 'MIDDLEWARE',
        f: path,
        enpoORmidware: "middleware",
        type: "specific-middleware",
        callback: handler
      }
    }
    createChain(info);
    return appHandler;
  }
  function useRouter(prefix, routerchains, uuid) {
    if (prefix === '/') {
      prefix = ''
    }

    for (const chain of routerchains) {

      //[ 'GET', '/', undefined, 'endpoint' ]
      let [method, path, handler = null, type] = chain;
      if (path === '/') {
        path = '';
      }
      if (method !== 'MIDDLEWARE' && method !== 'PARAM' || type?.includes('specific')) {
        path = prefix + path;
      }
      if (method !== 'MIDDLEWARE' && method !== 'PARAM' && handler === null) {
        handler = response200;
      }
      // //hpaus / diakhir
      // if (path.endsWith('/')) {
      //   path = path.slice(0, path.length - 1)
      // }
      //tambahkan / diawal jika belum ada
      if (!path.startsWith('/') && method !== 'PARAM') {
        path = '/' + path
      }
      path = path.replaceAll('//', '/');
      handler.uuid = uuid;
      switch (method) {
        case 'GET':
          handler.handler = true;
          get(path, handler);
          continue;
        case 'POST':
          handler.handler = true;
          post(path, handler);
          continue;
        case 'PUT':
          handler.handler = true;
          put(path, handler);
          continue;
        case 'PATCH':
          handler.handler = true;
          patch(path, handler)
          continue;
        case 'DELETE':
          handler.handler = true;
          delet(path, handler)
          continue;
        case 'OPTIONS':
          handler.handler = true;
          options(path, handler)
          continue;
        case 'MIDDLEWARE':
          if (!type?.includes('global')) {
            use(path, handler);
          } else {
            //kasih paham crwateChains dengan beri klu nama prefix router
            handler.Router = prefix;
            use(handler);
          }
          continue;
        case 'PARAM':
          param(path, handler);
          continue;
        default:
          continue;
      }
    }
  }


  //. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
  [0] uid
  [1] method
  [2] f
  [3] endpoint(.)/middleware(,) []
  [4] 
      . static
      . dynamic-single-param
      . dynamic-multiple-param
      . dynamic-single-wildcard
      
      ,all
      ,single
      
  [5] callback
  [6] chain-execution uids
  [7] chain-execution callbacks
  [8] f s
  [9] params
  [10] jlmh slash
  */
  //.BUAT DAN DEFINISIKAN MIDDLEWARE DAN RUTE BERDASARKAN JENIS DAN KETENTUANYA
  function createChain({
    f = '', method, enpoORmidware, type, callback
  }) {
    let slashCount = 0;
    for (let i = f.length - 1; i >= 0; i--) { f[i] === '/' ? slashCount++ : '' }; //hitung jumlah /

    const uid = createUID();
    const info = [
      uid, //0
      method, //1
      f, //2
      enpoORmidware,//3
      type,//4
      callback,//5
      [uid], //6 chain-execution uids
      [callback], //7 chain-execution callbacks
      [], //8 f s
      [], //9 params
      slashCount //10
    ]

    //. ////////////PERBAIKAN DAN EVALUASI TIAP DEFINISI RUTE 
    //.static
    if (type === "static") {
      info[8].push(f);
    }

    //.dynamic-single-param dynamic-multiple-param
    if (type === "dynamic-single-param" || type === "dynamic-multiple-param") {
      const params = f.split('/').filter(s => s !== '').filter(p => p.includes(':')).map(p => p.replace(':', ''));
      const fxxs = f.split(':')
        .filter(s => s !== '')
        .map(f => { for (const p of params) { return f.startsWith(p) ? f.replace(p, '') : f } })
        .filter(f => f !== '')
        .filter(f => {
          let isParam = false;
          for (const p of params) {
            isParam = f === p;
          }
          return !isParam
        });
      //untuk param 
      info[9] = params
      // untuk fxxs
      info[8] = fxxs;
    }//.

    //.dynamic-single-wildcard
    if (type === 'dynamic-single-wildcard') {
      let fxxs = f;
      fxxs = fxxs.split('*').filter(f => f !== '');
      for (const f of fxxs) {
        info[8].push(f)
      }
    }

    //.dynamic-multiple-wildcard
    if (type === 'dynamic-multiple-wildcard') {
      let fxxs = f;
      fxxs = fxxs.split('*').filter(f => f !== '');
      for (const f of fxxs) {
        info[8].push(f)
      }
    }
    //.middleware
    if (method === 'MIDDLEWARE') {
      middlewares.push(info);
    }
    else if (method === 'PARAM') {
      params.push(info);
    }
    else {
      endpoints.push(info);
    }
    //. push ke chain
    chains.push(info);

    //. looping untuk perbaiki chains dan pasan middleware 
    for (let i = chains.length - 1; i >= 0; i--) {
      // eslint-disable-next-line no-unused-vars
      const [Euid, Emethod, Ef, EorM, Etype, Ecallback, EchainCallbacksUID, EchainCallbacks, Efxxs, Eparams, Eslash] = chains[i];

      if (params.length) {
        for (let j = params.length - 1; j >= 0; j--) {
          // eslint-disable-next-line no-unused-vars
          const [Puid, Pmethod, Pf, PorM, Ptype, Pcallback, PchainCallbacksUID, PchainCallbacks, Pfxxs, Pparams, Pslash] = params[j];
          if (Ef?.includes(`:${Pf}`) && !EchainCallbacksUID?.includes(Puid)) {
            chains[i][6]?.push(Puid);
            chains[i][7]?.push(Pcallback);
          }
        }
      }

      if (middlewares.length) {
        for (let j = middlewares.length - 1; j >= 0; j--) {
          // eslint-disable-next-line no-unused-vars
          const [Muid, Mmethod, Mf, MEorM, Mtype, Mcallback, MchainCallbacksUID, MchainCallbacks, Mfxxs, Mparams, Mslash] = middlewares[j];
          const Mindex = chains.indexOf(middlewares[j]);

          //static file handler
          if (Mcallback?.type === 'staticfilehandler') {
            const Mindex = chains.indexOf(middlewares[j]);
            chains[Mindex][1] = 'STATICFILEHANDLER';
            chains[Mindex][4] = 'staticfilehandler';
            chains[Mindex][7] = [...MchainCallbacks];
          }
          if (chains[i][1] === 'STATICFILEHANDLER' && Ef === Mf && !EchainCallbacksUID.includes(Muid)) {
            chains[i][6].push(Muid);
            chains[i][7].push(Mcallback);
          }


          //global middleware (definisi rute setelah pemanggil middlewre nya sih);
          const routerGlobalMid2 = Ecallback.uuid === Mcallback.uuid && Mindex < i;
          if (routerGlobalMid2 && !EchainCallbacksUID.includes(Muid)) {

            //cek kalau itu middleware bawaan
            const isJBSmiddlewaresID = Mcallback.JBSmiddlewaresID;
            if (isJBSmiddlewaresID !== undefined) {
              if (!EchainCallbacksUID.includes(isJBSmiddlewaresID)) {
                console.log({ isJBSmiddlewaresID, x: EchainCallbacksUID });
                chains[i][6].push(isJBSmiddlewaresID);
                chains[i][7].push(Mcallback);
              }
            }
            //kalau bukan mid baaan
            if (isJBSmiddlewaresID === undefined) {
              console.log({ isJBSmiddlewaresID, x: EchainCallbacksUID });
              chains[i][6].push(Muid);
              chains[i][7].push(Mcallback);
            }
          }
          if (Mindex < i && Mtype === 'global-middleware' && !EchainCallbacksUID.includes(Muid)) {
            const isRouterGlobalMiddleware = Mcallback?.Router;
            if (isRouterGlobalMiddleware === undefined && EorM.includes('end') && !routerGlobalMid2) {
              chains[i][6].push(Muid);
              chains[i][7].push(Mcallback);
            }
            // if (isRouterGlobalMiddleware === undefined && chains[i][1] === 'STATICFILEHANDLER' && !EchainCallbacksUID.includes(Muid) && !routerGlobalMid2) {
            //   chains[i][6].push(Muid);
            //   chains[i][7].push(Mcallback);
            // }
            // //untuk middleware global pada router 
            // if (isRouterGlobalMiddleware !== undefined && Ef?.includes(isRouterGlobalMiddleware) && Ecallback.uuid === Mcallback.uuid) {
            //   chains[i][6].unshift(Muid);
            //   chains[i][7].push(Mcallback);
            // }
          }

          //middleware spesifik
          if (Mtype === 'specific-middleware' && Ef === Mf && Mcallback?.type !== 'staticfilehandler' && !EchainCallbacksUID.includes(Muid) && !Etype?.includes('middleware')) {
            chains[i][6].push(Muid);
            chains[i][7].push(Mcallback);
          }

          //

        }
      }
    }
  }
  //. TELUSURI CHAINS UNUTK MENENTUKAN MIDDLEWARE DAN RUTE TERKAIT SESUAI REQUEST UNTUK DI RUNNING 
  async function searchChain(req, res, route) {
    let exists = false;
    let index = -1;
    let slashCount = 0;
    for (let i = route.length - 1; i >= 0; i--) { route[i] === '/' ? slashCount++ : '' };

    //!looping chains
    for (let i = 0; i < chains.length; i++) {

      // eslint-disable-next-line no-unused-vars
      const [uid, method, f, EorM, type, callback, chainCallbacksUID, chainCallbacks, fxxs, params, slash] = chains[i];

      //. dynamic-single-wildcard 
      if (type === "dynamic-single-wildcard" && method === req.method) {
        let routex = route;
        const includes = [];
        let startsWith = false;
        let endsWith = false;

        //looping
        for (let j = 0; j < fxxs.length; j++) {
          if (fxxs.length === 1) {
            startsWith = route.startsWith(fxxs[0]);
            const isIncludes = route.includes(fxxs[j]);
            if (isIncludes) {
              includes.push(true);
              routex = routex.replace(fxxs[j], '');
            }
          }
          else {
            const isIncludes = route.includes(fxxs[j]);
            startsWith = route.startsWith(fxxs[0]);
            endsWith = route.endsWith(fxxs[fxxs.length - 1]);
            if (isIncludes) {
              includes.push(true);
              routex = routex.replace(fxxs[j], '');
            }
          }
        }//looping end
        if (fxxs.length === 1 && !includes.includes(false) &&
          startsWith && !endsWith && includes.length === fxxs.length
        ) {
          req.params[0] = routex;
          runRoute(req, res, i);
          return true
        }
        if (!includes.includes(false) &&
          startsWith && endsWith && includes.length === fxxs.length
        ) {
          req.params[0] = routex;
          runRoute(req, res, i);
          return true
        }
      } //.

      //.dynamic-multiple-wildcard
      if (type === "dynamic-multiple-wildcard" && method === req.method) {
        let routex = route;
        const includes = [];
        let startsWith = false;
        let endsWith = false;

        // let single = false;
        // let param = {};
        //looping
        for (let j = 0; j < fxxs.length; j++) {

          const isIncludes = route.includes(fxxs[j]);
          if (isIncludes) {
            includes.push(true);
            routex = routex.replace(fxxs[j], '-');
          }

        }//looping end
        startsWith = route.startsWith(fxxs[0]);
        endsWith = route.endsWith(fxxs[fxxs.length - 1]);
        if (f.endsWith('*') === true) {
          endsWith = true
        }
        if (!includes.includes(false) &&
          startsWith && endsWith && includes.length === fxxs.length
        ) {
          // console.log({ f, includes, fxxs, route, endsWith, startsWith });
          routex.split('-').filter(s => s !== '').forEach((p, i) => {
            req.params[i] = p;
          });
          runRoute(req, res, i);
          return true
        }
      } //.



      //.jika method http dan jumlah /
      if (method === req.method && slash === slashCount) {
        const checKfxxs = fxxs.map(f => {
          return route.includes(f);
        });
        //jika checKfxxs nya valid
        if (checKfxxs.length && !checKfxxs.includes(false)) {
          index = i;
          //. static route 
          if (type === "static") {
            if (f === route) {
              runRoute(req, res, index);
              return true
            }
          }
          //. dynamic route single-multiple 
          else if (type === "dynamic-single-param" || type === 'dynamic-multiple-param') {
            //var untk sisa param
            const endsWithParam = params.map(p => f.endsWith(p)).includes(true);
            const includes = [];
            let routex = route;
            let startsWith = false;
            let endsWith = false;
            let paramUndefined = false;
            //replace f pakai _ pada route agar sisa param  
            for (let i = 0; i < fxxs.length; i++) {
              routex = routex.replace(fxxs[i], '_');
              includes.push(route.includes(fxxs[i]));
            }
            //pisahkan param dg _
            const searchParams = routex.split('_').filter(p => p !== '');
            //daftarkan oaram
            for (let i = params.length - 1; i >= 0; i--) {
              req.params[params[i]] = searchParams[i];
              if (searchParams[i] === undefined) {
                paramUndefined = true;
              }
            }
            if (!endsWithParam) {
              endsWith = route.endsWith(fxxs[fxxs.length - 1]);
            }
            startsWith = route.startsWith(fxxs[0]);
            //run
            //console.log({ f, route, params, endsWithParam, fxxs, includes, startsWith, endsWith });
            if (!paramUndefined) {
              if (startsWith && !endsWith && endsWithParam) {
                runRoute(req, res, index);
                return true
              }
              if (startsWith && endsWith) {
                runRoute(req, res, index);
                return true
              }
            }
            req.params = {};
          }
        }
      }//.


      //. staticfilehandler
      if (type === "staticfilehandler") {
        if (route?.startsWith(f) && route?.length !== f?.length) {
          index = i;
          req.url = req.url.replace(f, '');
          runRoute(req, res, index);
          return true
        }
      }
    }//!

    return exists
  }
  //. JALANKAN RUTE DAN MIDDLEWARE TERKAIT YANG SUDAH DITELUSURI 
  async function runRoute(req = Request.prototype, res = Response.prototype, index) {
    try {
      const myEmitter = new MyEmitter();
      const x = [...chains[index][7]];
      const endpoint = x[0];
      const middlewares = x.slice(1);
      let entries = [...middlewares, endpoint];
      // console.log({ entries1: entries });
      ///aneh
      console.log({ entries });
      // const routerM = entries.filter(m => m.Router !== undefined && m.uuid);
      // const globalM = entries.filter(m => m.Router === undefined && !m.uuid);

      //nuat apa saya lupa
      const routerM = entries.filter(m => m.Router !== undefined || m.JBSmiddlewares);
      const globalM = entries.filter(m => m.Router === undefined && m.uuid === undefined);
      if (routerM.length && globalM.length) {
        entries = [...globalM, ...routerM, endpoint];
      }
      console.log({ entries2: entries });

      myEmitter.on('next', async (error) => {
        try {
          if (error !== undefined) {
            throw error
          }
          const entry = entries.shift();
          const param = entry?.param;
          if (entry === undefined) { //kalau tidak ada middleware lain lagi
            if (res.headersSent) { return } //kalau header sudah dikirm ;
            // console.log(req.url,req.headers);
            await appHandler.response404(req, res);
            return
          }
          await entry(req, res, next, req.params[param]);
        } catch (error) {
          appHandler.response500(req, res, error);
        }
      });
      function next(error) {
        myEmitter.emit('next', error);
      }
      if (entries.length > 1) {
        const entry = entries.shift();
        const param = entry?.param;
        await entry(req, res, next, req.params[param]);
      } else {
        await endpoint(req, res, next);
      }
      return
    } catch (error) {
      console.error('run error');
      appHandler.response500(req, res, error);
    }



  }
  //. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //. HANDLER UNTUK PERMINTAAN HTTP UNTUK MEMULAI PENELUSURAN CHAINS YANG SUDAH DIDEFINISIKAN DAN DIJALANKAN 
  async function appHandler(req = Request.prototype, res = Response.prototype) {
    try {
      Object.setPrototypeOf(req, Request.prototype);
      Object.setPrototypeOf(res, Response.prototype);

      responseEvents.on('200', () => {
        appHandler.response200(req, res);
        return;
      });
      res.response200 = function () {
        responseEvents.emit('200');
      }


      responseEvents.on('404', () => {
        appHandler.response404(req, res);
        return;
      });
      res.response404 = function () {
        responseEvents.emit('404');
      }

      responseEvents.on('500', (reqx, resx, errorx = errorMessage(new Error('internal server error'))) => {
        if (reqx !== undefined && resx !== undefined && errorx !== undefined) {
          return appHandler.response500(reqx, resx, errorx);
        }
        appHandler.response500(req, res, errorx);
        return;
      });
      res.response500 = function (req, res, error) {
        responseEvents.emit('500', req, res, error);
      }



      res.on('finish', () => {
        responseEvents.removeAllListeners('200');
        responseEvents.removeAllListeners('404');
        responseEvents.removeAllListeners('500');
      });


      if (res.headersSent) {
        return;
      }
      if (appHandler.templates !== null) {
        res.render = async function (template, data) {
          res.setHeader('Content-Type', 'text/html');
          const result = await readTemplatesAndServe(appHandler.templates, template, data);
          res.write(result);
          res.end();
        }
      } else {
        res.render = function () {
          throw errorMessage(new Error('no templates was provided or setted!\n set with app.setTemplates(<dir path of templates files>) or app.templates = [<all files path templates>] \n recommend to set the templates in line before use render'))
        }
      }
      req.res = res;
      res.setHeader('x-powered-by', 'JBS')
      req.params = {} //parameter defalut {};
      const parsedUrl = url.parse(req.url, true); //parseurl;
      req.query = { ...parsedUrl.query }; //asign query
      let route = decodeURIComponent(parsedUrl.pathname); //rute untuk dicocockan
      // if (route.endsWith('/') && route !== "/") { //cegah diakhiri /
      //   route = route.slice(0, route.length - 1);
      // }
      // console.log({route});
      const method = req.method;
      if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'ALL'].includes(method)) {
        appHandler.response404(req, res);
      }
      const exists = await searchChain(req, res, route);
      if (!exists) {
        console.log('object', req.url);
        appHandler.response404(req, res);
        return
      }
    } catch (error) {
      console.error('main', req.url, error);
      appHandler.response500(req, res)
      return false;
    }
  }


  //. MEMULAI SERVER HTTP 
  function listen(port = 3000, callback = function () { }) {
    const server = http.createServer(appHandler);
    if (!Number.isInteger(port) || port === 0) {
      throw new TypeError('Port must be  Integer!');
    }
    server.listen(port);
    callback(port);
    return server;
  }

  //. KONFIGURASI
  Object.defineProperty(appHandler, 'toString', {
    value: appHandler
  });
  Object.defineProperty(appHandler, 'chains', {
    value: chains
  });


  //.BEBERAPA KONFIGURASIS HANDLER
  appHandler.get = get;
  appHandler.post = post;
  appHandler.put = put;
  appHandler.patch = patch;
  appHandler.delete = delet;
  appHandler.all = all;
  appHandler.options = options;
  appHandler.listen = listen;
  appHandler.route = route;
  appHandler.use = use;
  appHandler.middlewares = middlewares;
  appHandler.response200 = response200;
  appHandler.response500 = response500;
  appHandler.response404 = response404;
  appHandler.param = param;
  appHandler.Request = Request;
  appHandler.Response = Response;
  appHandler.appHandler = appHandler;
  appHandler.app = appHandler;
  appHandler.settings = {
    strict: false
  };

  //. VIEW HTML TEMPLATE ENGINE SEDERHANA 
  appHandler.templates = null;
  appHandler.setTemplates = async function (pathDir) {
    const templates = await readdirTemplates(pathDir);
    appHandler.templates = templates;
  }







  Object.defineProperty(appHandler, 'settings', {
    value: {
      strict: false,
    },
    enumerable: false, writable: false, configurable: false
  })

  //. RETURN SEBUAH INTANSE / APP YG BERISI PROPERTY DAN METHOD YANG BISA DIPAKAI UNTUK MEMBUAT SERVER HTTP 
  return appHandler
}


//. KONFIGURASI OBJECT 
Object.defineProperty(JBS, 'toString', {
  value: function () {
    return JBS;
  },
  writable: false,
  enumerable: false,
  configurable: true
})



























const JBackendServer = JBS;
export default JBS;
export { JBackendServer, JBS, app };
