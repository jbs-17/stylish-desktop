import Request from "./jbs-request.js";
import Response from "./jbs-response.js";
import { errorMessage } from "./jbs-error-message.js";
import { randomUUID } from "node:crypto";




class Router {
  get isRouter(){
    return true
  }
  chains = [];

  // eslint-disable-next-line no-unused-vars
  #handler = (req = Request.prototype, res = Response.prototype) => { res.end('OK'); };
  // eslint-disable-next-line no-unused-vars
  #middlewareHandler = (req = Request.prototype, res = Response.prototype, next) => { next(); };
  // eslint-disable-next-line no-unused-vars
  #paramHandler = (req = Request.prototype, res = Response.prototype, next, param) => { res.writeHead('param', param ?? 'param'); next(); };

  constructor(strict) {
    if (strict) {
      this.#handler.isHandler = true;
      this.#middlewareHandler.isHandler = true;
      this.#paramHandler.isHandler = true;
    } else {
      this.#handler.isHandler = null;
      this.#middlewareHandler.isHandler = null;
      this.#paramHandler.isHandler = null;
    }
  }

  #methods = (m) => {
    return (path = '', handler = this.#handler) => {
      if (typeof path !== 'string' || path === '') {
        throw errorMessage(new Error('invalid arguments! path must be a string! Or cannot be empty or undefined!'));
      }
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler argument must be a function! Or cannot be empty or undefined!'))
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push([m, path, handler, 'endpoint']);
      return this;
    }
  }

  get = this.#methods('GET');
  post = this.#methods('POST');
  put = this.#methods('PUT');
  patch = this.#methods('PATCH');
  delete = this.#methods('DELETE');
  options = this.#methods('OPTIONS');

  use = (path = this.#middlewareHandler, handler = this.#middlewareHandler) => {
    const typepath = typeof path;
    if (typepath === 'function') {
      if (path?.isHandler === true) {
        throw errorMessage(new Error('invalid argument! handler argument must be a function! Or cannot be empty or undefined!'))
      }
      if (path?.isHandler === true) {
        path = undefined;
      }
      this.chains.push(['MIDDLEWARE', 'global', path, 'global-middleware']);
    }
    else if (typepath === 'string') {
      if (path === '') {
        throw errorMessage(new Error('invalid argument! path argument must be a string! Or cannot be empty or undefined!'))
      }
      if (handler?.isHandler === true) {
        throw errorMessage(new Error('invalid argument! handler argument must be a function! Or cannot be empty or undefined!'))
      }
      if (handler?.isHandler === true) {
        throw errorMessage(new Error('invalid argument! handler argument must be a function! Or cannot be empty or undefined!'))
      }
      if (handler?.isHandler === true) {
        handler = undefined;
      }
      this.chains.push(['MIDDLEWARE', path, handler, 'specific-middleware']);
    }
    else {
      throw errorMessage(new Error('invalid arguments! path or handler!'));
    }
    return this
  }


  param = (param = '', handler = this.#paramHandler) => {
    if (typeof param !== 'string' || param === '') {
      throw errorMessage(new Error('invalid argument! param must be a string or cannot be undefined!'));
    }
    if (typeof handler !== 'function' || handler?.isHandler === true) {
      throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
    }
    this.chains.push(['PARAM', param, handler, 'param']);
    return this
  }


  route(path = '') {
    if (typeof path !== 'string' || path === '') {
      throw errorMessage(new Error('invalid argument! path must be a string or cannot be undefined!'));
    }
    if(!path.startsWith('/')){
      path = '/' + path;
    }
    const get = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['GET', path, handler, 'endpoint']); return factory
    };
    const post = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['POST', path, handler, 'endpoint']); return factory
    };
    const put = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['PUT', path, handler, 'endpoint']); return factory
    };
    const patch = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['PATCH', path, handler, 'endpoint']); return factory
    };
    const delet = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['DELETE', path, handler, 'endpoint']); return factory
    };
    const options = (handler = this.#handler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['OPTIONS', path, handler, 'endpoint']); return factory
    };
    const use = (handler = this.#middlewareHandler) => {
      if (handler?.isHandler === true || typeof handler !== 'function') {
        throw errorMessage(new Error('invalid argument! handler must be a function or cannot be undefined!'));
      }
      if (handler?.isHandler === null) {
        handler = undefined;
      }
      this.chains.push(['MIDDLEWARE', path, handler, 'specific-middleware']);
      return factory
    }
    const factory = {
      get, post, put, patch, delete: delet, use, options
    }
    return factory
  }
}

function createRouter(settings = { strict: false }) {
  let router;
  if (settings.strict === true) {
    router = new Router(true);
  } else {
    router = new Router();
  }
  Router.Routers.push(router);
  router.uuid = randomUUID();
  return router
}
Object.defineProperty(Router, 'Routers', {
  value: [],
  writable: false, configurable: false
})

const r2 = createRouter('/r2');
r2.get('/get', function get() { })
  .post('/post', function post() { })
  .put('/put', function put() { })
  .patch('/pacth', function pacth() { })
  .delete('/delet', function delet() { })
  .param('pr', function param() { })
  .use('/global', function global() { })
  .use('/get', function md() { })
  .route('/sate')
  .get(function getSate() { })
  .post(function postSate() { })
  .put(function putSate() { })
  .delete(function delet() { })
  .use(function mdSate() { });
// console.log(r2);


export { createRouter };
export default createRouter;