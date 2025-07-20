
async function action(dom) {
  console.log(dom);
  const ac = dom.getAttribute('action')
  if (ac === 'hapus') {
    hapusDiikuti(dom);
    return
  }
  const sudah = dom.getAttribute('sudah');
  sudah === 'true' ? batalIkuti(dom) : ikuti(dom);
}


async function hapusDiikuti(dom) {
  try {
    const c = confirm('hapus folowers?');
    if (!c) { return };
    const uuid = dom.getAttribute('uuid');
    const response = await fetch('/post/interaction/hapus-dikuti/' + uuid, {
      method: 'POST'
    });
    const data = await response.json();
    if (data.status) {
      document.querySelector(`div[uuid= ${uuid}]`).remove();
      toast('hapus folowers ' + dom.getAttribute('username'), 2345);
    } else {
      location.reload();
    }
  } catch {
    location.reload();
  }
}


async function batalIkuti(dom) {
  try {
    const response = await fetch('/post/interaction/batal-ikuti/' + dom.getAttribute('uuid'), {
      method: 'POST'
    });
    const data = await response.json();
    if (data.status) {
      dom.setAttribute('sudah', 'false');
      dom.innerHTML = 'ikuti';
      toast('batal ikuti ' + dom.getAttribute('username'), 2345);
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
      toast('mengikuti ' + dom.getAttribute('username'), 2345);
    } else {
      location.reload();
    }
  } catch {
    location.reload()
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