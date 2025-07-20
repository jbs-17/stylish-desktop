import JBS from "jbs-http-server";
import { cariUserDariUsername, cariUserDariUUID } from "../apis/user/verifikasiUsenameDanPassword.js";
import { sudahIkuti } from '../apis/db/ikuti.js';
import pkg from 'validator';
const { isUUID } = pkg;
const ikuti = JBS.Router();

ikuti.use(function ikutim(req, res, next) {
  const user = req.user;
  if (!user) {
    const data = {
      data: `
  <script>document.querySelector('.follower-card').remove();</script>
  <div class="follower-card" style="display: flex; justify-content: center;">
    <a href="/login" style="font-weight: 900;">LOGIN REQUIRED</a>
  </div>` }
    res.render('ikuti', data);
    return
  }
  next();
});
ikuti.get('/profile/me/ikuti', async (req, res) => {
  const user = req.user;
  const i = await buatKotakIkuti(user.ikuti, user.UUID);
  const data = {
    data: i
  };
  res.render('ikuti', data);
});
async function buatKotakIkuti(ikuti) {
  try {
    let a = ikuti.map(i => cariUserDariUUID(i.UUID));
    a = (await Promise.allSettled(a))
      .filter(a => a.status === 'fulfilled')
      .map(b => b.value.user)
      .map(c => template(c))
      .join('')
    return a
    function template({ UUID, username, pp }) {
      return /*html*/`
  <div class="follower-card" uuid="${UUID}">
    <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto Profil" class="profile-pic" />
    <div class="user-info">
      <div class="username" username="${username}"><a href="/profile/pub/${username}">${username}</a></div>
      <div class="button-group">
        <button class="follow-btn" username="${username}" uuid="${UUID}" sudah="true" action="batal-ikuti" onclick="action(this)">batal ikuti</button>
      </div>
    </div>
  </div>
      `
    }
  } catch {
    return `
  <div class="follower-card" style="display: flex; justify-content: center;">
      <a href="" style="font-weight: 900;" >INTERNAL SERVER ERROR</a >
  </div >`;
  }
}
ikuti.get('/profile/me/diikuti', async (req, res) => {
  const user = req.user;
  const i = await buatKotakDiikuti(user.diikuti, user.UUID);
  const data = {
    data: i
  };
  res.render('diikuti', data);
});
async function buatKotakDiikuti(ikuti, me) {
  try {
    let a = ikuti.map(i => cariUserDariUUID(i.UUID));
    a = (await Promise.allSettled(a))
      .filter(a => a.status === 'fulfilled')
      .map(b => b.value.user)
      .map(c => template(c));
    a = (await Promise.allSettled(a))
      .filter(a => a.status === 'fulfilled')
      .map(b => b.value).join('');
    return a
    async function template({ UUID, username, pp }) {
      const sudah = (await sudahIkuti(me, UUID)).status;
      return /*html*/`
  <div class="follower-card" uuid="${UUID}">
    <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto Profil" class="profile-pic" />
    <div class="user-info">
      <div class="username" username="${username}"><a href="/profile/pub/${username}">${username}</a></div>
      <div class="button-group">
        ${sudah ?
          `<button class="follow-btn" username="${username}" uuid="${UUID}" sudah="true" action="batal-ikuti" onclick="action(this)">batal ikuti</button>` :
          `<button class="follow-btn" username="${username}" uuid="${UUID}" sudah="false" action="ikuti" onclick="action(this)">ikuti</button>`
        }
        <button class="delete-btn" username="${username}" uuid="${UUID}" action="hapus" onclick="action(this)">Hapus</button>
      </div>
    </div>
  </div>
      `
    }
  } catch {
    return `
  <div class="follower-card" style="display: flex; justify-content: center;">
      <a href="" style="font-weight: 900;" >INTERNAL SERVER ERROR</a >
  </div >`;
  }
  cariUserDariUUID()
}


ikuti.get('/profile/pub/:userid/diikuti', async (req, res) => {
  const { userid } = req.params;
  const userview = req.user;
  const cariusertarget = isUUID(userid) ? await cariUserDariUUID(userid) : await cariUserDariUsername(userid);
  const usertarget = cariusertarget.user;
  if (!usertarget) {
    res.redirect('/404')
    return
  }
  const x = await buatKotakIkutiPub(usertarget.diikuti, userview);
  const data = {
    username: usertarget.username,
    data: x
  }
  res.render('diikuti-pub', data);
});
ikuti.get('/profile/pub/:userid/ikuti', async (req, res) => {
  const { userid } = req.params;
  const userview = req.user;
  const cariusertarget = isUUID(userid) ? await cariUserDariUUID(userid) : await cariUserDariUsername(userid);
  const usertarget = cariusertarget.user;
  if (!usertarget) {
    res.redirect('/404')
    return
  }
  const x = await buatKotakIkutiPub(usertarget.ikuti, userview);
  const data = {
    username: usertarget.username,
    data: x
  }
  res.render('ikuti-pub', data);
});


async function buatKotakIkutiPub(ikuti, userview) {
  try {
    let a = ikuti.map(i => cariUserDariUUID(i.UUID));
    a = (await Promise.allSettled(a))
      .filter(a => a.status === 'fulfilled')
      .map(b => b.value.user)
      .map(c => template(c))
    a = (await Promise.allSettled(a))
      .filter(a => a.status === 'fulfilled')
      .map(b => b.value)
      .join(' ')
    return a
    async function template({ UUID, username, pp }) {
      if (UUID === userview.UUID) {
        return /*html*/`
  <div class="follower-card" uuid="${UUID}">
    <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto Profil" class="profile-pic" />
    <div class="user-info">
      <div class="username" username="${username}"><a href="/profile/pub/me">${username} (saya)</a></div>
      <div class="button-group">
        <a href="/profile/me"><button class="follow-btn" username="${username}" uuid="${UUID}">profile</button></a>
      </div>
    </div>
  </div>
      `
      }
      const sudah = (await sudahIkuti(userview.UUID, UUID)).status;
      return /*html*/`
  <div class="follower-card" uuid="${UUID}">
    <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto Profil" class="profile-pic" />
    <div class="user-info">
      <div class="username" username="${username}"><a href="/profile/pub/${username}">${username}</a></div>
      <div class="button-group">
      ${sudah ? `<button class="follow-btn" username="${username}" uuid="${UUID}" sudah="true" action="batal-ikuti" onclick="action(this)">batal ikuti</button>` :
          `<button class="follow-btn" username="${username}" uuid="${UUID}" sudah="false" action="ikuti" onclick="action(this)">ikuti</button>`
        }
      </div>
    </div>
  </div>
      `
    }
  } catch {
    return `
  <div class="follower-card" style="display: flex; justify-content: center;">
      <a href="" style="font-weight: 900;" >INTERNAL SERVER ERROR</a >
  </div >`;
  }
}



export default ikuti;