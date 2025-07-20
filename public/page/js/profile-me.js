function action(dom) {
  const actionname = dom.getAttribute('action');
  const fileuid = dom.dataset?.fileuid;
  console.log({ actionname, fileuid });
  if (actionname.includes('lihat')) {
    viewPost(fileuid);
    return
  }
  if (actionname === 'batal-upload') {
    decx(fileuid)
    return
  }
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
async function viewFolow(dom) {
  const url = '/profile/me/' + dom.id;
  showViewer(url);
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




async function decx(fileuid) {
  try {
    const confirmation = confirm('batalkan upload?');
    if (!confirmation) {
      return
    }
    const response = await fetch('/admin/temp/decx/' + fileuid, {
      method: "PATCH"
    })
    const data = await response.json();
    if (data.status) {
      document.querySelector(`div[fileuid=${fileuid}]`).remove();
    } else {
      location.reload();
    }
  }
  catch (error) {
    console.log(error);
  }
}


