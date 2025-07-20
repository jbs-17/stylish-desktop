{
  const iframe = { self: window.self, top: window.top };
  if (iframe.top !== iframe.self) {
    window.addEventListener('click', (e) => {
      const href = e.target.href;

      if (href) {
        e.preventDefault();
        window.top.location = href;
      }
      const t2 = e.target.parentElement;
      const href2 = t2?.href;
      if (href2) {
        window.top.location = href2;
      }
    })
  }
}


async function action(dom) {
  const sudah = dom.getAttribute('sudah');
  sudah === 'true' ? batalIkuti(dom) : ikuti(dom);
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