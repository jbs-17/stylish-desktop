

async function serveData(temps) {
  const loader = document.querySelector('span[role="loader-pending"]');
  for (let i = 0; i < temps.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    const { fileUID } = temps[i];
    try {
      const response = await fetch(`/media/temp/${fileUID}`);
      const data = await response.json();
      let { status, user, filepath, newFilename, originalFilename, mimetype, size, filetype, ext, UUID, newfilepath, filebase, relativeFilePath, tanggal, judul, deskripsi, suka, simpan, bagi, laporkan, komentar, diarsipkan, metadata } = data;
      if (!status) {
        continue
      }
      const { pp: ppu, UUID: UUIDu, username: usernameu, name: nameu, image: imageu, video: videou, komentar: komentaru, suka: sukau, simpan: simpanu, bagi: bagiu, ikuti: ikutiu, diikuti: diikutiu, bio: biou } = user;
      card.innerHTML = /*html*/`
        <div class="card-uploader">
          <img src="${ppu}" />
          <p class="" title="uploader"><span>${usernameu}</span></p>
          <time datetime="${tanggal}">${tanggal}</time>
        </div>
        <div class="card-media">
          ${filetype === 'video' ? `<video src="${relativeFilePath}" controls></video>` : `<img src="${relativeFilePath}" alt="" />`}
        </div>
        <div class="card-info">
          <p class=""><span>${judul}</span></p>
          <p class=""><span>${deskripsi}</span></p>
        </div>
        <div class="card-stats" fileuid="${fileUID}">
          <p action="acc" class="card-action" onclick="acc(this)"><span>ACCEPT</span></p>
          <p action="dec" class="card-action" onclick="dec(this)"><span>DECLINE</span></p>
        </div>
    `
      card.setAttribute('fileUID', fileUID);
      card.setAttribute('type', mimetype);
      loader.before(card);
    }
    catch (e) {
      console.log(e);
    }
  };
}

let temps = [];


async function main() {
  const response = await fetch('/admin/temp/data', {
    method: 'GET',
    headers: {
      "Accept": "application/json"
    }
  })
  const data = await response.json();
  const { imageTemp, videoTemp } = data;
  temps = [...imageTemp, ...videoTemp]
  serveData(temps);
}


async function acc(infofile) {
  const target = infofile?.parentElement?.getAttribute('fileuid');
  const file = temps.filter(t => {
    return t?.fileUID === target
  })[0];
  if (!file) {
    return
  }
  temps.splice(temps.indexOf(file), 1);
  try {
    const response = await fetch('/admin/temp/acc', {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(file)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function dec(infofile) {
  const target = infofile?.parentElement?.getAttribute('fileuid');
  const file = temps.filter(t => {
    return t?.fileUID === target;
  })[0];
  if (!file) {
    return
  }
  temps.splice(temps.indexOf(file), 1);

  try {
    const response = await fetch('/admin/temp/dec', {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(file)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
main();