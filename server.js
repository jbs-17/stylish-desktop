//core
import fs from 'node:fs/promises';

//local
import JBS from 'jbs-http-server';
import { rootpath, logpath, port, exceptPath, database, userdatabase } from "./config.js";

import tanggalString from './modules/date-string.mjs'
import { cacatWaktu, error } from './modules/chalks.js'

import EventEmitter from "node:events";
import chalk from "chalk";
import routers from './routers/routers.js';
import { verifikasiSesiLogin } from './admin/sesidatabase.js';
import { cariUserDariUUID } from './apis/user/verifikasiUsenameDanPassword.js';



const loggingEmit = new EventEmitter();
loggingEmit.on('selesai', async (infoRequest = {}) => {
  console.log((`${chalk.bgRgb(255, 0, 0).rgb(0, 0, 0).bold(' ' + new Date().toLocaleString() + ' ')}${chalk.bgWhiteBright.rgb(0, 0, 0).bold(` ${infoRequest.durasi}ms `)}${chalk.bgRgb(25,25,25).rgb(255,255,255)(' '+infoRequest.method+' ')} ${infoRequest.url} `));
  console.log(chalk.bgRgb(0, 0, 0)(' '));
  logging(infoRequest);
});



const app = JBS();
app.setTemplates('./public/view')

app.use(function log(req, res, next) {
  next();
  const mulai = Date.now();
  const infoRequest = {
    stampwaktu: tanggalString(), ip: req.socket.remoteAddress, userAgent: req.headers["user-agent"],
    url: req.url, method: req.method, durasi: undefined, statuskode: undefined
  }
  res.on('finish', () => {
    try {
      const selesai = Date.now();
      const durasi = selesai - mulai;
      infoRequest.durasi = durasi;
      infoRequest.statuskode = res.statusCode;
      loggingEmit.emit('selesai', infoRequest);
    } catch (error) {
      console.log(error)
    }
  });
});
app.use(async function cookie(req, res, next) {
  const cookies = req.cookies;
  const sessionId = cookies["session_id"];
  if (!sessionId) {
    next();
    return;
  }
  res.set('session_id', sessionId);
  const checkSesiLogin = await verifikasiSesiLogin(sessionId);
  if (!checkSesiLogin.status) {
    next();
    return;
  }
  const UUID = checkSesiLogin.sesi?.UUID;
  const user = await cariUserDariUUID(UUID, { info: false });
  if (!user.status) {
    next();
    return;
  }
  req.user = user?.user;
  next();
  return;
});



app.get('/', (req, res) => {
  res.redirect('/landing');
});
app.get('/profile', req => req.res.redirect('/profile/me', 302));
app.get('/profile/', req => req.res.redirect('/profile/me', 302));
app.use('/', routers.register);
app.use('/', routers.ikuti);
app.use('/', routers.login);
app.use('/', routers.root);
app.use('/', routers.profileme);
app.use('/', routers.profilepub);
app.use('/', routers.settings);

app.use("/", routers.upload);
app.use('/media', routers.media);
app.use('/admin', routers.admin);
app.use('/post', routers.post);


app.use(JBS.static('./public/page/'));
app.use(JBS.static('./public/temp'));
app.use(JBS.static('./public/upload'));
app.use('/post', JBS.static('./public/upload'));

app.use(JBS.static('./public/page'));
app.response404((req, res) => {
  res.sendStatus(404);

  if (req.accept.startsWith('text/html')) {
    res.html('./public/page/404.html');
    return
  }
  if (req.accept.includes('image')) {
    res.set('Content-Type', 'image/png');
    res.sendFile('404.png', { root: './public' });
    return
  }
  if (req.accept.includes('json')) {
    res.json({ status: false, message: `${req.method} - ${req.url} - 404 - NOT FOUND` });
    return
  }
  res.text('404')
  return
});





// console.log(app.chains);




app.listen(port, () => {
  console.log(`app running on port ${port}...`);
})




const logfile = `./logs/log-${fullyDate()}.txt`;
try {
  await fs.access(logfile);
  console.log('File sudah ada');
} catch (err) {
  try {
    fs.mkdir('./logs').catch(e => console.log(e))
    await fs.writeFile(logfile, logfile);
    console.log('File berhasil dibuat');
  } catch (err) {
    console.error(err);
  }
}




async function logging({ stampwaktu, ip, userAgent, url, method, durasi, statuskode }) {
  try {
    const text = `${stampwaktu ?? new Date()} | ${ip} | ${userAgent} | ${method} | ${durasi ? durasi + 'ms' : '-'} | ${statuskode ?? '-'} | ${url}\n`;
    await fs.appendFile(logfile, text);

  } catch (err) {
    console.log(error(`\nlog error: ${err}`));
  }
}



function fullyDate() {
  const d = new Date();
  const date = String(d.getDate());
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  return `${days[d.getDay()]}-${date.length < 2 ? `0${date}` : date}-${months[d.getMonth()]}-${d.getFullYear()}`
};
