{
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const iframe = { self: window.self, top: window.top };
  // console.log({ self: iframe.self.location.href , top: iframe.top.location.href}); //beda
  if (iframe.top !== iframe.self) {
    header.remove();
    footer.remove();
    window.addEventListener('click', (e) => {
      const href = e.target.href;
      if (href) {
        e.preventDefault();
        window.top.location = href;
      }
    })
  }
}

{
  function toggleMenu(el) {
    const menu = el.nextElementSibling;
    menu.style.display = (menu.style.display === "block") ? "none" : "block";

    // Tutup menu lain jika dibuka
    document.querySelectorAll(".post-menu").forEach(m => {
      if (m !== menu) m.style.display = "none";
    });
  }

  // Klik di luar untuk menutup menu
  window.addEventListener("click", function (e) {
    if (!e.target.closest(".post-options-container")) {
      document.querySelectorAll(".post-menu").forEach(m => m.style.display = "none");
    }
  });
}




class EventEmitter extends EventTarget {
  constructor() {
    super();
  }
}
const ev1 = new EventEmitter();
ev1.addEventListener('close', () => {
  document.querySelectorAll(".post-menu").forEach(m => m.style.display = "none");
})
function closeMenu() {
  ev1.dispatchEvent(new Event('close'));
}










////////
const errorEvent = new EventEmitter();
errorEvent.addEventListener('error', () => {
  location.reload();
});
function emitError() {
  errorEvent.dispatchEvent(new Event('error'));
}
const post = document.getElementById('post');
const fileuid = post.dataset.fileuid;
let datainteraction = JSON.parse(document.querySelector('span[data-interaction]').dataset.interaction);
let { sudahsuka, sudahsimpan, sudahkomentar, sudahbagi, sudahlaporkan, sudahikuti } = datainteraction;
console.log(datainteraction);
{
  if (sudahsuka) {
    document.querySelector('span[action=suka]').classList.toggle('post-interactions-done');
  }
  if (sudahsimpan) {
    document.querySelector('span[action=simpan]').classList.toggle('post-interactions-done');
  }
  if (sudahkomentar) {
    document.querySelector('span[action=komentar]').classList.toggle('post-interactions-done');
    document.getElementById('my-commentInput').style.display = 'none';
  }
  if (sudahbagi) {
    document.querySelector('span[action=bagi]').classList.toggle('post-interactions-done');
  }
  if (sudahikuti) {
    const x = document.querySelector('[action=ikuti]');
    x.classList.toggle('post-interactions-done');
    x.innerHTML = 'batal ikuti';
  }
}





function action(dom) {
  const name = dom.getAttribute('action');
  switch (name) {
    case 'suka':
      suka(dom);
      break;
    case 'simpan':
      simpan(dom);
      break;
    case 'bagi':
      bagi(dom);
      break;
    case 'laporkan':
      laporkan(dom);
      break;
    case 'komentar':
      komentar(dom);
      break;
    case 'ikuti':
      ikuti(dom);
      break;
    default:
      break;
  }
}

//laporkan
async function laporkan() {
  try {
    if (sudahlaporkan) {
      return alert('sudah melaporkan!');
    }
    const confirmation = confirm('laporkan?');
    if (!confirmation) { return };
    const laporan = prompt('laporan:');
    console.log({ laporan });
    if (laporan === null) { return };
    if (!laporan) {
      alert('Laporan tidak boleh kosong!');
      return;
    }
    if (laporan.length <= 10) {
      alert('laporan minimal 10 karakter!');
      return
    }
    const response = await fetch('/post/interaction/laporkan/' + fileuid, {
      method: 'POST',
      headers: {
        'message': laporan
      }
    });
    const data = await response.json();
    if (data.message?.includes('sudah')) {
      return alert('gagal dilaporkan karena sudah dilaporkan!');
    }
    if (data.status) {
      alert('berhasil dilaporkan!');
      sudahlaporkan = true;
    } else {
      alert('gagal dilaporkan!');
      emitError();
    }
  } catch (error) {
    emitError();
    console.log(error);
  } finally {
    closeMenu();
  }
}
//suka
async function suka(dom) {
  try {
    if (sudahsuka) {
      sudahsuka = false;
      const response = await fetch('/post/interaction/batal-suka/' + fileuid, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        decrementTotalInteraction(dom);
        toast('batal menyukai postingan')
        return
      }
      return emitError();
    }
    sudahsuka = true;
    const response = await fetch('/post/interaction/suka/' + fileuid, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.status) {
      incrementTotalInteraction(dom);
      toast('menyukai postingan');
      return
    }
    return emitError();
  } catch (error) {
    emitError();
    console.log(error);
  }
}
//simpan
async function simpan(dom) {
  try {
    if (sudahsimpan) {
      sudahsimpan = false;
      const response = await fetch('/post/interaction/batal-simpan/' + fileuid, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        decrementTotalInteraction(dom);
        toast('batal menyimpan postingan')
        return
      }
      return emitError();
    }
    sudahsimpan = true;
    const response = await fetch('/post/interaction/simpan/' + fileuid, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.status) {
      incrementTotalInteraction(dom);
      toast('menyimpan postingan');
      return
    }
    return emitError();
  } catch (error) {
    emitError();
    console.log(error);
  }
}
//bagi
async function bagi(dom) {
  try {
    if (!sudahbagi) {
      sudahsimpan = false;
      const response = await fetch('/post/interaction/bagi/' + fileuid, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        incrementTotalInteraction(dom);
      } else {
        return emitError();
      }
    }
    const url = location.href;
    if (navigator.share) {
      const copy = await navigator.share({ title: `Stylish Desktop - Dektop keren ${document.querySelector('.judul').innerText}`, url: url });
      toast('berhasil membagikan!', 5000);
      return
    }
    await navigator.clipboard.writeText(url);
    toast('link bagi disalin!');
  } catch {
    const txt = document.createElement('textarea');
    txt.value = location.href;
    document.body.append(txt);
    txt.select();
    document.execCommand('copy');
    txt.remove();
    toast('link bagi disalin!');
  }
}
//ikuti
const container = document.getElementById('comments-container');
let commentsOn = false;
container.style.display = 'none';
async function komentar(dom) {
  const ngapain = dom.getAttribute('komentar');
  if (ngapain === 'buka') {
    const y = container.getBoundingClientRect().top + window.innerHeight;
    if (commentsOn) {
      commentsOn = false;
      window.scrollTo({ behavior: 'smooth', top: y });
      container.style.display = 'none';
    } else {
      commentsOn = true
      container.style.display = 'flex';
      window.scrollTo({ behavior: 'smooth', top: y });
    }
    return
  }
  try {
    if (sudahkomentar) {
      if (ngapain === 'hapus') {
        const confirmation = confirm('hapus komentar?');
        if (!confirmation) { return };
        const response = await fetch('/post/interaction/batal-komentar/' + fileuid, {
          method: 'POST'
        });
        const data = await response.json();
        if (data.status) {
          sudahkomentar = false;
          decrementTotalInteraction(document.querySelector('[komentar=buka]'));
          toast('komentar dihapus!');
          document.getElementById('my-commentInput').style.display = 'flex';
          document.getElementById('my-comment').remove();
          return
        } else {
          throw data
        }
      }
      return
    }
    //
    const komentarinput = document.getElementById('commentInput');
    const komentar = komentarinput.value;
    if (komentar.length < 5) {
      return alert('komentar minimal 5 karakter!');
    }
    const response = await fetch('/post/interaction/komentar/' + fileuid, {
      method: 'POST',
      headers: {
        'message': komentar
      }
    });
    const data = await response.json();
    if (data.status) {
      sudahkomentar = true;
      komentarinput.value = '';
      document.getElementById('my-commentInput').style.display = 'none';
      incrementTotalInteraction(document.querySelector('[komentar=buka]'));
      const mycommnetLoader = document.getElementById('mycomment-loader');
      const mycomment = document.createElement('div');
      const userview = JSON.parse(document.getElementById('userview-x').value);
      mycomment.classList.add('comment-box', 'my-comment');
      mycomment.id = 'my-comment';
      mycomment.innerHTML = /*html*/`
      <img src="${userview.pp || '../public/upload/pp/default.png'}" alt="Foto Saya" class="comment-avatar" onerror="this.src = '../public/upload/pp/default.png'" />
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-username"><a href="/profile/me">${userview.username}(saya)</a></span>
          <span class="comment-date">baru saja</span>
        </div>
        <div class="comment-text">
          ${komentar}
        </div>
        <button class="delete-comment-btn" action="komentar" komentar="hapus" onclick="action(this)">Hapus</button>
      </div>
        `
      mycommnetLoader.after(mycomment);
      toast('komentar diposting!');
      return
    } else {
      throw data
    }
  } catch (error) {
    console.log('errorkomen', error);
  }
}



async function ikuti(dom) {
  if (sudahikuti) {
    const response = await fetch('/post/interaction/batal-ikuti/' + dom.getAttribute('uuid'), {
      method: 'POST'
    });
    const data = await response.json();
    if (data.status) {
      dom.innerHTML = 'ikuti';
      toast('batal ikuti ' + dom.getAttribute('username'), 2345);
      sudahikuti = false;
    } else {
      location.reload();
    }
    return;
  }
  const response = await fetch('/post/interaction/ikuti/' + dom.getAttribute('uuid'), {
    method: 'POST'
  });
  const data = await response.json();
  if (data.status) {
    dom.innerHTML = 'batal ikuti';
    toast('mengikuti ' + dom.getAttribute('username'), 2345);
    sudahikuti = true;
  } else {
    location.reload();
  }
}




function toast(message = 'some message...', time = 2000) {
  const x = document.getElementById('toast');
  if (x) { x.remove() }

  if (message.length > 25) {
    message = message.slice(0, 20) + '...';
  }
  const toast = document.createElement('div');
  const toastmessage = document.createElement('p');
  toastmessage.innerText = message;
  toast.append(toastmessage);
  toast.id = 'toast';
  setTimeout(() => { toast.remove() }, time);
  document.body.append(toast);
}
function incrementTotalInteraction(dom) {
  try {
    dom.classList.add('post-interactions-done');
    const total = dom.querySelector('span.interaction-total');
    total.innerText = String(Number(total.innerText) + 1) + ' ';
  } catch {
    dom;
  }
}
function decrementTotalInteraction(dom) {
  try {
    dom.classList.remove('post-interactions-done');
    const total = dom.querySelector('span.interaction-total');
    total.innerText = String(Number(total.innerText) - 1) + ' ';
  } catch {
    dom;
  }
}