import JBS from 'jbs-web-server';
import { searchFileInfoUploadFull } from '../apis/db/media-search-temp.js';
import { verifikasiSesiLogin } from '../admin/sesidatabase.js';
import { cariUserDariUUID } from '../apis/user/verifikasiUsenameDanPassword.js';


import {
  bagiImage, bagiVideo,
  batalSimpanImage, batalSimpanVideo,
  batalSukaImage, batalSukaVideo,
  laporkanImage, laporkanVideo,
  simpanImage, simpanVideo,
  sukaImage, sukaVideo,
  deleteImageUserFile, deleteVideoUserFile,
  komentarImage,
  komentarVideo,
  batalKomentarImage,
  batalKomentarVideo,
  ikuti,
  batalIkuti,
  sudahIkuti
} from '../apis/db/interactions.js';

const post = JBS.Router();


function isUserViewDoInFIle(interactionArr = [], UUID) {
  for (let i = 0; i < interactionArr.length; i++) {
    if (interactionArr[i].UUID === UUID) {
      return true;
    };
  }
  return false
}

function komensayax(komentar, username, pp) {
  return /*html*/`
  <div id="my-comment" class="comment-box my-comment">
  <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto Saya" class="comment-avatar" />
  <div class="comment-content">
    <div class="comment-header">
      <span class="comment-username"><a href="/profile/me">${username}(saya)</a></span>
      <span class="comment-date">${tanggalx(komentar.tanggal)}</span>
    </div>
    <div class="comment-text">
      ${komentar.komentar}
    </div>
    <button class="delete-comment-btn" action="komentar" komentar="hapus" onclick="action(this)">Hapus</button>
  </div>
</div>
`
}
async function komenorangx(komentar = []) {
  if (!komentar.length) {
    return ''
  }
  let pemilikkomentar = (komentar.map(k => {
    return cariUserDariUUID(k.userYangKomentar);
  }));
  return (await Promise.allSettled(pemilikkomentar))
    .filter(o => o.status === 'fulfilled')
    .map(p => p.value?.user)
    .map((q, i) => { return { user: q, komentar: komentar[i] } })
    .map(r => komentarTemplate(r))
    .join('');

  function komentarTemplate({ user: { username, pp }, komentar: { komentar, tanggal } }) {
    return /*html*/`
      <div class="comment-box">
              <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto User" class="comment-avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username"><a href="/profile/pub/${username}">${username}</a></span>
                  <span class="comment-date">${tanggalx(tanggal)}</span>
                </div>
                <div class="comment-text">
                  ${komentar}
                </div>
              </div>
            </div>`;
  }
}
async function interaksi(interactions = [], name) {
  if (!interactions.length) {
    return ''
  }
  let pemilik = (interactions.map(k => {
    return cariUserDariUUID(k.UUID);
  }));
  return (await Promise.allSettled(pemilik))
    .filter(o => o.status === 'fulfilled')
    .map(p => p.value?.user)
    .map((q, i) => { return { user: q, interaction: interactions[i] } })
    .map(r => interactionsTemplate(r))
    .join('');

  function interactionsTemplate({ user: { username, pp }, interaction: { tanggal } }) {
    return /*html*/`
        <div class="comment-box">
                <img src="${pp || '../public/upload/pp/default.png'}" alt="Foto User" class="comment-avatar" />
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-username"><a href="/profile/pub/${username}">${username}</a></span>
                    <span class="comment-date">${tanggalx(tanggal)}</span>
                  </div>
                  <div class="comment-text">
                  ${(() => {
        let x = '';
        switch (name) {
          case 'suka':
            x = 'menyukai postingan!'
            break;
          case 'bagi':
            x = 'membagikan postingan!'
            break;
          case 'simpan':
            x = 'menyimpan postingan!'
            break;
        }
        return x;
      })()}
                  </div >
                </div >
              </div > `;
  }
}



function tanggalx(tanggal) {
  return tanggal
    ?.split('_')
    ?.map((x, i) => i === 0 ? x : x.replaceAll('-', ':'))
    ?.reverse().join(' ');
}


//lihat postingan me atua pub
post.use('/:fileuid', async (req, res, next) => {
  const cookies = req.cookies;
  const sessionId = cookies["session_id"];
  if (!sessionId) {
    res.render('view-post-x', {});
    return;
  }
  res.set('session_id', sessionId);
  const checkSesiLogin = await verifikasiSesiLogin(sessionId);
  if (!checkSesiLogin.status) {
    res.render('view-post-x', {});
    return;
  }
  const UUID = checkSesiLogin.sesi?.UUID;
  const user = await cariUserDariUUID(UUID, { info: false });
  if (!user.status) {
    res.render('view-post-x', {});
    return;
  }
  req.user = user?.user;
  next();
});
post.get('/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  if (!fileuid) {
    res.redirect('/notfound');
    return
  }
  const infofile = await searchFileInfoUploadFull(fileuid);
  if (!infofile.status) {
    res.render('view-post-y');
    return
  }

  const file = infofile.file;
  const userfile = infofile.user;
  const userview = req.user;

  const { filebase, judul, deskripsi, suka, simpan, komentar, bagi, mimetype, laporkan } = file;
  const sudahsuka = isUserViewDoInFIle(suka, userview.UUID);
  const sudahsimpan = isUserViewDoInFIle(simpan, userview.UUID);
  const sudahkomentar = isUserViewDoInFIle(komentar, userview.UUID);
  const sudahbagi = isUserViewDoInFIle(bagi, userview.UUID);
  const sudahlaporkan = isUserViewDoInFIle(laporkan, userview.UUID);
  const sudahikuti = (await sudahIkuti(userview.UUID, userfile.UUID)).status;
  const interactionDoneList = { sudahsuka, sudahsimpan, sudahkomentar, sudahbagi, sudahlaporkan, sudahikuti };

  let komensaya = null;
  let komenorang = komentar.filter((k, i) => {
    if (k.userYangKomentar === userview.UUID) { komensaya = i; return false }
    else { return true }
  });
  komensaya = komensaya !== null ? komensayax(komentar[komensaya], userview.username, userview.pp) : '';
  komenorang = await komenorangx(komenorang);
  const data = {
    uuid: userfile.UUID,
    username: userfile.username,
    filebase,
    judul: judul[0],
    deskripsi: deskripsi[0] ?? '(tidak ada deskripsi)',
    suka: suka.length,
    simpan: simpan.length,
    komentar: komentar.length,
    bagi: bagi.length,
    fileinfo: JSON.stringify(file),
    tanggal: tanggalx(file.tanggal),
    fileuid: file.fileUID,
    pp: userfile.pp || '../public/upload/pp/default.png',
    interaction: JSON.stringify(interactionDoneList),
    komensaya,
    komenorang,
    userview: JSON.stringify(userview),
    comments: komenorang,
    saves: await interaksi(simpan, 'simpan'),
    likes: await interaksi(suka, 'suka'),
    shares: await interaksi(bagi, 'bagi')
  }

  if (mimetype?.includes('ima')) {
    image();
    return;
  } else {
    video();
    return
  }
  ///
  async function image() {
    if (userfile.UUID === userview.UUID) {
      res.render('view-post-me-img', data);
      return
    };
    res.render('view-post-img', data);
  }
  async function video() {
    if (userfile.UUID === userview.UUID) {
      res.render('view-post-me-vid', data);
      return
    };
    res.render('view-post-vid', data);
  }

});



//hapus postingan me
post.delete('/me', async (req, res) => {
  if (!req.body) {
    res.json({ status: false, message: 'gagal hapus postingan' });
  }
  const fileinfo = req.body;
  const mimetype = fileinfo.mimetype;
  let info = { status: false, message: 'gagal hapus postingan!' };
  if (mimetype.includes('image')) {
    info = await deleteImageUserFile(fileinfo);
  } else {
    info = await deleteVideoUserFile(fileinfo);
  }
  res.json(info);
});
post.use('/me', JBS.json());






//PUB
post.post('/interaction/laporkan/:fileuid', async (req, res) => {
  const laporan = req.headers.message || 'dilaporkan!';
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await laporkanImage(user, file, laporan);
  } else {
    info = await laporkanVideo(user, file, laporan);
  }
  res.json(info);
});
//suka
post.post('/interaction/suka/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await sukaImage(user, file);
  } else {
    info = await sukaVideo(user, file);
  }
  res.json(info);
});
//batal suka
post.post('/interaction/batal-suka/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await batalSukaImage(user, file);
  } else {
    info = await batalSukaVideo(user, file);
  }
  res.json(info);
});



//simpan
post.post('/interaction/simpan/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await simpanImage(user, file);
  } else {
    info = await simpanVideo(user, file);
  }
  res.json(info);
});
//batal simpan
post.post('/interaction/batal-simpan/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await batalSimpanImage(user, file);
  } else {
    info = await batalSimpanVideo(user, file);
  }
  res.json(info);
});



///bagi
post.post('/interaction/bagi/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await bagiImage(user, file);
  } else {
    info = await bagiVideo(user, file);
  }
  res.json(info);
});


//komentar
post.post('/interaction/komentar/:fileuid', async (req, res) => {
  const komentar = req.headers.message || null;
  if (!komentar) {
    return res.json({ status: false });
  }
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await komentarImage(user, file, komentar);
  } else {
    info = await komentarVideo(user, file, komentar);
  }
  res.json(info);
});
//batal komentar
post.post('/interaction/batal-komentar/:fileuid', async (req, res) => {
  const { fileuid } = req.params;
  const infofile = await searchFileInfoUploadFull(fileuid);
  const user = req.user;
  if (!infofile.status || !user) {
    return res.json({ status: false });
  }
  const file = infofile.file;
  let info;
  if (file.mimetype?.includes('image')) {
    info = await batalKomentarImage(user, file);
  } else {
    info = await batalKomentarVideo(user, file);
  }
  res.json(info);
});



//post ikuti
post.post('/interaction/ikuti/:uuid', async (req, res) => {
  try {
    const { uuid: yangDiikuti } = req.params;
    const { UUID: yangMengikuti } = req.user;
    if (!yangMengikuti || !yangDiikuti) {
      return res.json({ status: false });
    }
    res.json(await ikuti(yangMengikuti, yangDiikuti));
  } catch (error) {
    res.json({ status: false, error })
  }
});

//batal ikuti
post.post('/interaction/batal-ikuti/:uuid', async (req, res) => {
  try {
    const { uuid: yangDiikuti } = req.params;
    const { UUID: yangMengikuti } = req.user;
    if (!yangMengikuti || !yangDiikuti) {
      return res.json({ status: false });
    }
    res.json(await batalIkuti(yangMengikuti, yangDiikuti));
  } catch (error) {
    res.json({ status: false, error })
  }
});

post.post('/interaction/hapus-dikuti/:uuid', async (req, res) => {
  try {
    const { UUID: yangDiikuti } = req.user;
    const { uuid: yangMengikuti } = req.params;
    if (!yangMengikuti || !yangDiikuti) {
      return res.json({ status: false });
    }
    res.json(await batalIkuti(yangMengikuti, yangDiikuti));
  } catch (error) {
    res.json({ status: false, error })
  }
});

export default post