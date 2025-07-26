import JBS from 'jbs-http-server';
import { cariUserDariUUID } from '../apis/user/verifikasiUsenameDanPassword.js';
import { admins, templistdatabase } from '../config.js';
import { verifikasiSesiLogin } from '../admin/sesidatabase.js';
import {
  tolakImageTempListAndUserAndFile, tolakVideoTempListAndUserAndFile,
  terimaImageTempListAndUserAndFile, terimaVideoTempListAndUserAndFile
} from '../admin/kelolatemp.js'
import { searchFileInfoTemp, searchFileInfoUploadFull } from '../apis/db/media-search-temp.js';

const admin = JBS.Router();


admin.patch('/temp/decx/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const fileinfo = (await searchFileInfoTemp(fileuid));
  if (!fileinfo.status) {
    res.json({ status: false })
    return
  }
  const { mimetype } = fileinfo;
  let dec = null;
  if (mimetype?.includes('image')) {
    dec = await tolakImageTempListAndUserAndFile(fileinfo);
  } else {
    dec = await tolakVideoTempListAndUserAndFile(fileinfo);
  }
  if (dec === null) {
    res.json({ status: false });
    return;
  }
  res.json(dec);
});




admin.use(async function admin(req, res, next) {
  const cookie = req.cookies;
  const sessionId = cookie["session_id"];
  const verify = await verifikasiSesiLogin(sessionId);
  if (!verify.status) {
    res.html('./public/page/404.html');
    return
  }
  const user = await cariUserDariUUID(verify?.sesi?.UUID);
  if (!user?.status) {
    res.html('./public/page/404.html');
    return
  }
  const isAdmin = admins.includes(user?.user?.username);
  // console.log({ isAdmin });
  if (!isAdmin) {
    res.html('./public/page/404.html');
    return
  }
  next();
})
admin.get('/', async (req, res) => {
  res.html('./public/page/admin-beranda.html');
});
admin.get('/temp', (req, res) => {
  res.html('./public/page/admin-temp.html')
})
admin.get('/temp/data', (req, res) => {
  res.json(templistdatabase);
});
admin.patch('/temp/acc', async (req, res) => {
  const body = req.body;
  if (!body) {
    console.log('object');
    res.json({ status: false });
    return;
  }
  const { mimetype } = body;
  let acc = null;
  if (mimetype?.includes('image')) {
    acc = await terimaImageTempListAndUserAndFile(body)
  } else {
    acc = await terimaVideoTempListAndUserAndFile(body)
  }
  if (acc === null) {
    res.json({ status: false });
    return;
  }
  res.json(acc);
  return;
});
admin.use('/temp/acc', JBS.json());




admin.patch('/temp/dec', async (req, res) => {
  const body = req.body;
  if (!body) {
    res.json({ status: false });
    return;
  }
  const { mimetype } = body;
  let dec = null;
  if (mimetype?.includes('image')) {
    dec = await tolakImageTempListAndUserAndFile(body)
  } else {
    dec = await tolakVideoTempListAndUserAndFile(body)
  }
  if (dec === null) {
    res.json({ status: false });
    return;
  }
  res.json(dec);
});
admin.use('/temp/dec', JBS.json());



export default admin;