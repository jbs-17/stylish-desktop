import JBS from "jbs-web-server";
import Cache from "jbs-web-server/jbs-simple-caching.js";
import { searchUser, searchUserUpload } from "../apis/db/search.js";
import {buatKotakIkutiPub} from './ikuti.js';
import {cariUserDariUUID} from '../apis/user/verifikasiUsenameDanPassword.js'

const search = JBS.Router();

const searchCache = new Cache(10, 5, 5);

search.route("/search").get(async function (req, res) {
  let { q } = req.query;

  if (q == undefined) {
    return res.render("search.html", { q: "what" });
  }
  q = q.replaceAll(">", "&gt;").replaceAll("<", "&lt;");

  if (await searchCache.isExist(q)) {
    const {
      users: renderedUsers,
      uploads: renderedUploads,
      uploadsLength,
      usersLength,
      totalLength,
    } = await searchCache.get(q);
    return await res.render("search.html", {
      q,
      users: renderedUsers,
      uploads: renderedUploads,
      uploadsLength,
      usersLength,
      totalLength,
    });
  }

  const me = req.user ?? {},
    users = await searchUser(q),
    uploads = await searchUserUpload(q),
    uploadsLength = uploads.length,
    usersLength = users.length,
    totalLength = uploadsLength + usersLength,
    renderedUsers = await renderUsers(users, me),
    renderedUploads = await renderUploads(uploads, me);
  await searchCache.add({
    key: q,
    value: {
      users: renderedUsers,
      uploads: renderedUploads,
      uploadsLength,
      usersLength,
      totalLength,
    },
  });
  return res.render("search.html", {
    q,
    users: renderedUsers,
    uploads: renderedUploads,
    uploadsLength,
    usersLength,
    totalLength,
  });
});

export default search;

async function renderUsers(users, me) {
  return await buatKotakIkutiPub(users, me)
  
}

async function renderUploads(uploads, me) {
  return uploads.reduce(async (previous, current) => {
    return (await previous).concat(await template(current));
  }, "");

  async function template(
    {
      UUID,
      fileUID,
      mimetype,
      relativeFilePath,
      judul,
      deskripsi,
      suka,
      bagi,
      komentar,
      simpan,
      tanggal,
      pub = true,
      user: { username },
    }
  ) {
    
    const user = await cariUserDariUUID(UUID)
  let {pp = "../public/upload/pp/default.png"} = user.user;
    return /*html*/ `
  <div class="post"  data-fileuid="${fileUID}" fileuid="${fileUID}" id="${fileUID}" action="lihat-upload" onclick="action(this)">
  <div class="post-header">
    <div class="post-user">
      <img src="${pp}" alt="Profil">
      <div class="post-user-info">
        <div class="username-row">
          <strong>
            <a href="/profile/${!pub ? "me" : "pub/" + username}">
              ${username}${username === me?.username ? "(saya)" : ""}
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
    return mimetype.includes("ima")
      ? `<img src="${relativeFilePath}" alt="Postingan">`
      : `
    <video src="${relativeFilePath}" alt="Postingan" controls></video>
    `;
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
  `;
  }
}

function tanggalx(tanggal) {
  return tanggal
    ?.split("_")
    ?.map((x, i) => (i === 0 ? x : x.replaceAll("-", ":")))
    ?.reverse()
    .join(" ");
}
