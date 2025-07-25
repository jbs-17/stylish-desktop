import JBS from "jbs-http-server";
import pkg from 'validator';
const { isUUID } = pkg;
import { cariUserDariUsername, cariUserDariUUID } from "../apis/user/verifikasiUsenameDanPassword.js";
import { verifikasiSesiLogin } from "../admin/sesidatabase.js";
import { admins } from "../config.js";
import { servelikes, serveuploads } from "./profile-me.js";
import { sudahIkuti } from '../apis/db/ikuti.js'
const profilepub = JBS.Router();


profilepub.use('/profile/pub/:userpubidentity', async (req, res, next) => {
  const { userpubidentity } = req.params;
  if (admins.includes(userpubidentity)) {
    res.html('./public/page/profile-y.html');
    return
  }
  if (!userpubidentity) {
    res.html('./public/page/profile-x.html');
    return
  }
  const cookies = req.cookies;
  const sessionId = cookies["session_id"];
  if (!sessionId) {
    res.html('./public/page/profile-x.html');
    return;
  }
  res.set('session_id', sessionId);
  const checkSesiLogin = await verifikasiSesiLogin(sessionId);
  if (!checkSesiLogin.status) {
    res.html('./public/page/profile-x.html');
    return;
  }
  const UUID = checkSesiLogin.sesi?.UUID;
  const user = await cariUserDariUUID(UUID, { info: false });
  if (!user.status) {
    res.html('./public/page/profile-x.html');
    return;
  }
  req.user = user?.user;
  //
  const userpub = isUUID(userpubidentity) ? await cariUserDariUUID(userpubidentity) : await cariUserDariUsername(userpubidentity);

  if (admins.includes(userpub.user?.username)) {
    res.html('./public/page/profile-y.html');
    return
  }
  if (userpub.user?.UUID === user.user?.UUID) {
    res.redirect('/profile/me', 302);
    return
  }
  if (!userpub.status) {
    res.html('./public/page/profile-y.html'); //404
    return
  }
  req.userpub = userpub.user;
  //
  next();
});
profilepub.get('/profile/pub/:userpubidentity', async (req, res) => {
  const { user, userpub } = req;
  const uploads = [...userpub.image, ...userpub.video];
  const ikutiBtn = await sudahIkuti(user.UUID, userpub.UUID);
  const data = {
    pp: userpub.pp || '../upload/pp/default.png',
    username: userpub.username,
    uuid: userpub.UUID,
    totalsuka: await hitungTotalSuka(uploads),
    totalikuti: userpub.ikuti.length,
    totaldiikuti: userpub.diikuti.length,
    uploads: await serveuploads(uploads, userpub.username, true),
    likes: await servelikes(userpub.suka, true, user.username),
    ikutiBtn: ikutiBtn.status ?
      `<button uuid="${userpub.UUID}" id="followbtn" onclick="action(this)" action="ikuti" sudah="true">batal ikuti</button>` :
      `<button uuid="${userpub.UUID}" id="followbtn" onclick="action(this)" action="ikuti" sudah="false">ikuti</button>`
  }
  res.render('profile-pub', data);
  return
});
profilepub.param('useridentity', async (req, res, next, useridentity) => {
  const user = isUUID(useridentity) ? await cariUserDariUUID(useridentity) : await cariUserDariUsername(useridentity);
  if (!user.status) {
    res.json({ status: false });
    return
  }
  const data = user.user;
  data.status = true;
  data.uploads = [...data.image, ...data.video]
  delete data.password; delete data.passwordHASH; delete data.usernameHASH; delete data.diarsipkan; delete data.laporkan; delete data.telp; delete data.email; delete data.tempattanggallahir; delete data.videoTemp; delete data.imageTemp; delete data.simpan;
  req.userpub = data;
  next();
});






async function hitungTotalSuka(uploads) {
  let initialValue = 0;
  return uploads.reduce((accumulator, current) =>
    accumulator + current.suka?.length, initialValue);
}








export { hitungTotalSuka }
export default profilepub;


