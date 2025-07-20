//core
import fs from 'fs/promises';
import http from 'http';




//locale
import JBS from '../jbs-web-server.js';
import env from '../config/env.js';
import { error } from 'console';
import { randomUUID } from 'crypto';
import router1 from './test/router1.mjs';
console.log(Function);


const favicon = await fs.readFile('./public/uc.jpg');
const app = JBS();
http.createServer(JBS).listen(50000);

app.listen(env.port, (port) => {
  console.log(port);
});

app.useMiddlewareAfters(logging);
app.response404((_req, res) => {
  res.end('404');
})
app.response500((_req, res) => {
  res.status(500)
  res.end('server error ')
})
app.response200((_req, res) => {
  res.end('oke')
})
/*
app.get("/favicon.ico", (req, res) => {
  const mulai = Date.now();
  res.setHeader("Cache-Control", "public, max-age=3600")
  res.end(favicon);
  res.on('finish', () => {
    const selesai = Date.now();
    console.log(`${req.url} ${selesai - mulai}ms`);
  })
});


 app.get('/:p', (req, res)=>{
    res.send([req.params.p])
   res.send({...req.headers});
    console.log();
 });
 app.get('/p/:p', (req, res)=>{
   res.send([req.params.p])
 });
 app.get('/', (req, res)=>{
   res.send('oke')
 });
 app.get('/*', (req, res)=>{
   res.json([0,8,1,2])
 })

/*
app.useMiddleware('/all', (req, res, next) => {
  const xauth = req.headers["x-auth"];
  console.log(req.headers);
  if (xauth !== 'jbswebserver') {
    res.status(400);
    res.json({ message: "NOT AUTORIZED" })
  } else {
    next();
  }
})

app.all('/all', (req, res) => {
  res.json({ message: 'oke' })
});
app.get('/:id', (req, res) => {
  console.log(req.params);
  res.send(`User ID: ${req.params.id}`);
});
app.get('/:id/settings/', (req, res) => {
  console.log(req.params);
  res.send(`User ${req.params.id} settings`);
});
app.get('/u/:u/', (req, res) => {
  res.send(req.params)
})

app.get('/user/:user/post/:postId/report/')
/*
app.get('/main/', function main(_req, res) {
  res.json(['endpoint static /main']);
});
app.get('/main/about', function main(_req, res) {
  res.end('endpoint static /main');
})

app.get('/user/profile/')
app.get('/user/profile/1', (req,res)=>{
  res.end('1 pertama')
})
app.get('/user/profile/1', (req,res)=>{
  res.end('1 kedua')
})
app.get('/user/profile/:id/', function users(req, res) {
  try{
    const { id } = req.params;
  res.end(`endpoint dynamic ${id}`)
  }catch{
    res.end('params error')
  }
})
app.get('/user/profile/2', (req,res)=>{
  res.end('2')
});
app.get('/user/profile/:id/post/:postId', function users(req, res) {
  const { id, postId } = req.params;
  res.json({
    user: id,
    post: postId
  });
})
app.get('/api/:p1/:p2', (req, res)=>{
  const {p1, p2}=req.params
  res.json({
    p1,p2
  })
})
app.get('/api/:p1/user/id/:p2', (req, res)=>{
/http:127.0.0.1:50001/api/XXXX/user/id/YYYY
  const {p1, p2}=req.params
  res.json({
    p1,p2
  })
})
app.get('/public/*', (req, res) => {
  res.send({ public: req.params[0] });
});
app.get('/img*', (req, res)=>{
  res.send({img: req.params[0]});
});
*/

app.get('/file/*/download', (req, res) => {
  res.send({
    url: '/file/*/download',
    file: req.params[0]
  })
});

app.get('/video*/view', (req, res) => {
  res.json({
    video: req.params[0],
    url: req.url
  })
})
app.get('*/view', (req, res) => {
  res.json([req.params[0]]);
});
app.get('*edit', (req, res) => {
  res.json([req.params[0]]);
});
app.get('*/type/*', (req, res) => {
  res.send({
    0: req.params[0],
    1: req.params[1],
    2: req.params[3]
  });
})
app.get('/video/*/x/*/downlad', (req, res) => {
  res.send({ req: req.url, 0: req.params[0], 1: req.params[1] });
})
app.get('/file/*/img/*/upload/*/finish', (req, res) => {
  res.end('wildcard-multiple');
  res.json({
    params: req.params
  })
})
app.get('/satu/:a/dua/:b', (req, res) => {
  console.log(req.params);
  res.send(req.params)
})



const sessionContainer = [];
setInterval(() => {
  if (sessionContainer.length) {
    const expired = sessionContainer.shift();
    console.log(`expirted: ${expired}`);
  }
  console.log({ sessionContainer });
}, 1000 * 66);
app.get('/login', (req, res) => {
  res.html('./public/page/login.html');
});
app.useMiddleware('/login/submit', (req, res, next) => {
  const { action, check } = req.headers;
  console.log({ action, check });
  if (action !== 'login' || check !== 'on') {
    res.status(400)
    res.json({ message: 'login gagal, pastikan checkbox sudah di centang' });
    return
  }
  next();
})
app.post('/login/submit', (req, res) => {
  const sessionId = randomUUID();
  console.log(`new session: ${sessionId}`);
  sessionContainer.push(sessionId);
  res.setHeader('Set-Cookie', `login=${sessionId};Path=/;Max-Age=120`);
  res.send({ message: 'login sukses' });
});
app.get('/login/check', (req, res) => {
  res.send(checkSession(req));
  return
})
app.delet('/login/delete', (req, res) => {
  const sessionId = req.headers.cookie.split('=').filter(c => c !== '')[1];
  sessionContainer.splice(sessionContainer.indexOf(sessionId), 1);
  console.log(sessionId, sessionContainer);
  res.send(true);
  return
})
const imgServer = await imgServerF();
app.useMiddleware('/image/:img', (req, res, next) => {
  if (!checkSession(req)) {
    res.redirect( '/not-logged-in');
    return
  }
  next();
})
app.get('/not-logged-in', (req, res) => {
  res.html('./public/page/not-logged-in.html');
})
app.get('/image/:img', imgServer);

function checkSession(req) {
  if (!req.headers.cookie) { return false }
  const sessionId = req.headers.cookie.split('=').filter(c => c !== '')[1];
  const check = sessionContainer.includes(sessionId);
  return check;
}




async function imgServerF() {
  try {
    const imgDir = "./public/img/";
    const imgs = (await fs.readdir(imgDir));
    const image404 = await fs.readFile('./public/404.png');
    return async function (req, res) {
      try {
        const { img: i } = req.params;
        const img = imgs.filter((img) => {
          return img.includes(i);
        })[0];
        if (img === undefined || isNaN(Number(i))) {
          res.status(404);
          res.send('gambar tidak ada');
          res.type('.png');
          res.send(image404);
          return
        };
        const imgPath = imgDir + img;
        const buffer = await fs.readFile(imgPath);
        res.status(200);
        res.type(imgPath)
        res.send(buffer);
      } catch (error) {
        console.error('error', error);
        res.error(error);
      }
    }
  } catch {
    console.log(error);
  }
}



/*
res.setHeader("Cache-Control", "public, max-age=3600")
res.setHeader("Access-Control-Allow-Origin", "*")
res.status(200);
 app.getChains()
*/


const img = await fs.readFile('./public/uc.jpg');

app.get('/favicon.ico', (req, res) => {
  res.type('jpg')
  res.send(img)
});

app.get('/', async (req, res) => {
  res.apa()
  res.type('taxt')
  res.json('./public/data.js')
    (await res.text('./ublic/data.al'))
    (await res.html('<h1>Hello World</h1>')).finish();
  res.html(null);
  res.type('mp3')
  res.send()
  res.redirect('/favicon.ico',)
  res.redirect('/favicon.ico')
  console.log(req.urlParsed);
  console.log(req.querystring);
  console.log(req.queryParsed);
  res.end('ok');
});

app.get('/tes', (req, res) => {
  console.log(req.urlParse);
  console.log(req.querystring);
  console.log(req.queryParsed);
  res.end('ok');
});

app.serverErrorResponse((req, res) => {
  res.end('abcd')
});


export { ff, logging, middleware1, middleware2, }


async function ff(_req, res, next) {
  res.setHeader('ff-token', 'ini pesan dari middleware ff');
  res.write('middleware ff \n\n');
  console.log('middleware afters executed...')
  next()
}
function logging(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const finish = Date.now()
    if (req.url !== '/favicon.ico') {
      console.log(start, finish)
      console.log('Response dikirim dengan status kode', res.statusCode, [req.url], [finish - start, "ms"].join(''));
    }
  })
  next();
}
function middleware1(_req, res, next) {
  res.setHeader('middleware1', 'ini pesan dari middleware 1');
  res.write('middleware 1 \n\n');
  console.log("exetuce middleware1...");
  next()
}
function middleware2(_req, res, next) {
  res.setHeader('middleware2', 'ini pesan dari middleware 2');
  res.write('middleware 2 \n\n');
  console.log("exetuce middleware2...");
  next()
}


