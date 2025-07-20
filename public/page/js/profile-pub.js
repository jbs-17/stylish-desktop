function action(dom) {
  const actionname = dom.getAttribute('action');
  const fileuid = dom.dataset?.fileuid;

  if (actionname.includes('ikuti')) {
    acikuti(dom);
    return
  }
  if (actionname.includes('lihat')) {
    viewPost(fileuid);
    return
  }
  if (actionname === 'batal-upload') {
    decx(fileuid)
    return
  }
}

async function acikuti(dom) {
  const sudah = dom.getAttribute('sudah');
  if (sudah === 'true') {
    batalIkuti(dom);
    return
  }
  ikuti(dom);
  return
  async function batalIkuti(dom) {
    try {
      const response = await fetch('/post/interaction/batal-ikuti/' + dom.getAttribute('uuid'), {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        dom.setAttribute('sudah', 'false');
        dom.innerHTML = 'ikuti';
      } else {
        location.reload();
      }
    } catch {
      location.reload();
    }
  }

  async function ikuti(dom) {
    try {
      const response = await fetch('/post/interaction/ikuti/' + dom.getAttribute('uuid'), {
        method: 'POST'
      });
      const data = await response.json();
      if (data.status) {
        dom.setAttribute('sudah', 'true');
        dom.innerHTML = 'batal ikuti';
      } else {
        location.reload();
      }
    } catch {
      location.reload()
    }
  }
}




async function viewFolow(dom) {
  const url = location.href.replace(location.search, '').replace(location.hash, '') + '/' + dom.id;
  showViewer(url);
}


async function viewPost(fileuid) {
  try {
    const url = '/post/' + fileuid;
    console.log(url);
    showViewer(url);
  } catch (error) {
    console.log(error);
  }
}

const overlay = document.getElementById('iframe-overlay');
const viewer = document.getElementById('post-viewer');
function showViewer(url) {
  overlay.classList.remove('iframe-overlay-hidden');
  viewer.src = url;
}
function closeViewer() {
  viewer.src = ""; // kosongkan iframe agar tidak berat
  overlay.classList.add('iframe-overlay-hidden');
}

// Menerima pesan dari iframe untuk menutup viewer
window.addEventListener('message', (event) => {
  if (event.data === 'close-iframe') {
    closeViewer();
    location.reload();
  }
});