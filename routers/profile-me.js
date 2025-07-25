import JBS from "jbs-http-server";
import { verifikasiSesiLogin } from "../admin/sesidatabase.js";
import { cariUserDariUUID } from "../apis/user/verifikasiUsenameDanPassword.js";
import { searchFileInfoUploadFull } from "../apis/db/media-search-temp.js";
import { hitungTotalSuka } from "./profile-pub.js";


const profileme = JBS.Router();
profileme.get('/profile/me', async (req, res) => {
  const user = req.user;
  const { username, image, video, imageTemp, videoTemp, suka, simpan, UUID, ikuti, diikuti } = user;
  const uploads = [...image, ...video]; //
  const pendings = [...imageTemp, ...videoTemp];


  // const uploadsxxx = uploads.sort((a, b) => a.datenow - b.datenow); //lama terbaru
  const data = {
    bio: user.bio || ' ',
    pp: user.pp || '../upload/pp/default.png',
    uploads: await serveuploads(uploads, username),
    pendings: await servependings(pendings, username),
    likes: await servelikes(suka),
    saves: await servesaves(simpan),
    username,
    uuid: UUID,
    totalikuti: ikuti.length,
    totaldiikuti: diikuti.length,
    totalsuka: await hitungTotalSuka(uploads)
  }
  res.render('profile-me', data);
});
profileme.use('/profile/me', async (req, res, next) => {
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
  next();
});




async function serveuploads(uploads = [], username, pub = false) {
  const a = uploads.map(u => template(u, username));
  const b = (await Promise.allSettled(a));
  const c = b.filter(p => p.status === 'fulfilled');
  const d = c.map(a => a.value).map(b => b).join('');
  return d


  async function template({ fileUID, mimetype, relativeFilePath, judul, deskripsi, suka, bagi, komentar, simpan, tanggal }, username, pp = "../public/upload/pp/default.png") {
    return /*html*/`
  <div class="post"  data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}" action="lihat-upload" onclick="action(this)">
  <div class="post-header">
    <div class="post-user">
      <img src="${pp}" alt="Profil">
      <div class="post-user-info">
        <div class="username-row">
          <strong>
            <a href="/profile/${!pub ? 'me' : 'pub/' + username}">
              ${username}${!pub ? '(saya)' : ''}
            </a>
          </strong>
        </div>

      </div>
    </div>

    <!-- menu tiga -->
    <div class="post-options-container">
      <div fileuid="" class="post-options">⋯</div>
      <div class="post-menu">
        <div class="post-menu-item" action="hapus"></div>
      </div>
    </div>
  </div>

  <div class="post-media">
  ${(() => {
        return mimetype.includes('ima') ?
          `<img src="${relativeFilePath}" alt="Postingan">` : `
    <video src="${relativeFilePath}" alt="Postingan" controls></video>
    `
      })()}
  </div>

  <div class="post-body">
    <div class="judul">
      ${judul}
    </div>
    <div class="deskripsi">
      ${deskripsi}
    </div>
  </div>

  <div class="post-actions">
    <span class="post-interactions">
      <span class="icon">❤️</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
          ${suka.length}
        </span><span>Suka</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">💬</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${komentar.length}
        </span><span>Komentar</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">🔖</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${simpan.length}
        </span><span>Simpan</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">📤</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${bagi.length}
        </span><span>Bagi</span>
      </span>
    </span>
  </div>

  <div class="post-footer">
    Diposting pada: ${tanggalx(tanggal)}
  </div>
</div>
  `
  }
}

async function servependings(pendings = [], username) {
  const a = pendings.map(u => template(u, username));
  const b = (await Promise.allSettled(a));
  const c = b.filter(p => p.status === 'fulfilled');
  const d = c.map(a => a.value).map(b => b).join('');
  return d


  async function template({ fileUID, mimetype, relativeFilePath, judul, deskripsi, tanggal }, username, pp = '../public/upload/pp/default.png') {
    return /*html*/`
  <div class="post"  data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}"  id="post">
  <div class="post-header">
    <div class="post-user">
      <img src="${pp}" alt="Profil">
      <div class="post-user-info">
        <div class="username-row">
          <strong>
            <a href="/profile/me">
              ${username}(saya)
            </a>
          </strong>
        </div>

      </div>
    </div>

    <!-- menu tiga -->
    <div class="post-options-container">
      <div fileuid="" class="post-options">⋯</div>
      <div class="post-menu">
        <div class="post-menu-item"></div>
      </div>
    </div>
  </div>

  <div class="post-media">
  ${(() => {
        return mimetype.includes('ima') ?
          `<img src="${relativeFilePath}" alt="Postingan">` : `
      <video src="${relativeFilePath}" alt="Postingan" controls></video>
      `
      })()}
  </div>

  <div class="post-body">
    <div class="judul">
      ${judul}
    </div>
    <div class="deskripsi">
      ${deskripsi}
    </div>
  </div>

 
  <div class="post-actions">
  <span class="post-interactions"  data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}"  action="batal-upload" onclick="action(this)">
    <span class="icon"></span>
    <span class="post-interactions-name">
      <span class="interaction-total">
      </span><span>Batalkan</span>
    </span>
  </span>
</div>

  <div class="post-footer">
    Diajukan pada: ${tanggalx(tanggal)}
  </div>
</div>
  `
  }
}

async function servelikes(likes = [], pub = false, usernameLihat) {
  const a = likes.map(suka => searchFileInfoUploadFull(suka.fileUID));
  const b = (await Promise.allSettled(a))
    .filter(a => a.status === 'fulfilled')
    .map(b => b.value)
    .filter(c => c.status)
    .map(d => template({ file: d.file, user: d.user }))
  const c = (await Promise.allSettled(b))
    .filter(a => a.status === 'fulfilled')
    .map(b => b.value)
    .join('')
  return c


  async function template({ file: { fileUID, relativeFilePath, judul, deskripsi, suka, bagi, komentar, simpan, tanggal, mimetype }, user: { username, pp } }) {
    return /*html*/`
  <div class="post" data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}" action="lihat-suka" onclick="action(this)">
  <div class="post-header">
    <div class="post-user">
      <img src="${pp || '../public/upload/pp/default.png'}" alt="Profil">
      <div class="post-user-info">
        <div class="username-row">
          <strong>
          <a href="${usernameLihat === username ? '/profile/me' : `/profile/pub/${username}`}">
          ${username}${usernameLihat === username ? '(saya)' : ''}
        </a>
          </strong>
        </div>

      </div>
    </div>

    <!-- menu tiga -->
    <div class="post-options-container">
      <div fileuid="" class="post-options">⋯</div>
      <div class="post-menu">
        <div class="post-menu-item"></div>
      </div>
    </div>
  </div>

  <div class="post-media">
  ${(() => {
        return mimetype.includes('ima') ?
          `<img src="${relativeFilePath}" alt="Postingan">` : `
    <video src="${relativeFilePath}" alt="Postingan" controls></video>
    `
      })()}
  </div>

  <div class="post-body">
    <div class="judul">
      ${judul}
    </div>
    <div class="deskripsi">
      ${deskripsi}
    </div>
  </div>

 
  <div class="post-actions">
    <span class="post-interactions">
      <span class="icon">❤️</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
          ${suka.length}
        </span><span>Suka</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">💬</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${komentar.length}
        </span><span>Komentar</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">🔖</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${simpan.length}
        </span><span>Simpan</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">📤</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${bagi.length}
        </span><span>Bagi</span>
      </span>
    </span>
  </div>


  <div class="post-footer">
    Diajukan pada: ${tanggalx(tanggal)}
  </div>
</div>
  `
  }
}

async function servesaves(saves = []) {
  const a = saves.map(suka => searchFileInfoUploadFull(suka.fileUID));
  const b = (await Promise.allSettled(a))
    .filter(a => a.status === 'fulfilled')
    .map(b => b.value)
    .filter(c => c.status)
    .map(d => template({ file: d.file, user: d.user }))
  const c = (await Promise.allSettled(b))
    .filter(a => a.status === 'fulfilled')
    .map(b => b.value)
    .join('')
  return c


  async function template({ file: { mimetype, fileUID, relativeFilePath, judul, deskripsi, suka, bagi, komentar, simpan, tanggal }, user: { username, pp = '../public/upload/pp/default.png' } }) {
    return /*html*/`
  <div class="post"  data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}"  action="lihat-simpan" onclick="action(this)">
  <div class="post-header">
    <div class="post-user">
      <img src="${pp || '../public/upload/pp/default.png'}" alt="Profil">
      <div class="post-user-info">
        <div class="username-row">
          <strong>
            <a href="/profile/pub/${username}">
              ${username}
            </a>
          </strong>
        </div>

      </div>
    </div>

    <!-- menu tiga -->
    <div class="post-options-container">
      <div fileuid="" class="post-options">⋯</div>
      <div class="post-menu">
        <div class="post-menu-item"></div>
      </div>
    </div>
  </div>

  <div class="post-media">
  ${(() => {
        return mimetype.includes('ima') ?
          `<img src="${relativeFilePath}" alt="Postingan">` : `
    <video src="${relativeFilePath}" alt="Postingan" controls></video>
    `
      })()}
  </div>

  <div class="post-body">
    <div class="judul">
      ${judul}
    </div>
    <div class="deskripsi">
      ${deskripsi}
    </div>
  </div>

 
  <div class="post-actions">
    <span class="post-interactions">
      <span class="icon">❤️</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
          ${suka.length}
        </span><span>Suka</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">💬</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${komentar.length}
        </span><span>Komentar</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">🔖</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${simpan.length}
        </span><span>Simpan</span>
      </span>
    </span>
    <span class="post-interactions">
      <span class="icon">📤</span>
      <span class="post-interactions-name">
        <span class="interaction-total">
        ${bagi.length}
        </span><span>Bagi</span>
      </span>
    </span>
  </div>


  <div class="post-footer">
    Diajukan pada: ${tanggalx(tanggal)}
  </div>
</div>
  `
  }
}



function tanggalx(tanggal) {
  return tanggal
    ?.split('_')
    ?.map((x, i) => i === 0 ? x : x.replaceAll('-', ':'))
    ?.reverse().join(' ');
}

export { servelikes, serveuploads }

export default profileme;