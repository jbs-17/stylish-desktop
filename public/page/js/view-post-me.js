{
  const header = document.querySelector("header");
  const navbar = document.querySelector(".bottom-nav");
  const footer = document.querySelector("footer");
  const iframe = { self: window.self, top: window.top };
  // console.log({ self: iframe.self.location.href , top: iframe.top.location.href}); //beda
  if (iframe.top !== iframe.self) {
    header.remove();
    footer.remove();
    navbar.remove();
    window.addEventListener("click", (e) => {
      const href = e.target.href;
      if (href) {
        e.preventDefault();
        window.top.location = href;
      }
    });
  }
}

{
  function toggleMenu(el) {
    const menu = el.nextElementSibling;
    menu.style.display = menu.style.display === "block" ? "none" : "block";

    // Tutup menu lain jika dibuka
    document.querySelectorAll(".post-menu").forEach((m) => {
      if (m !== menu) m.style.display = "none";
    });
  }

  // Klik di luar untuk menutup menu
  window.addEventListener("click", function (e) {
    if (!e.target.closest(".post-options-container")) {
      document
        .querySelectorAll(".post-menu")
        .forEach((m) => (m.style.display = "none"));
    }
  });
}

let fileinfo;
try {
  fileinfo = JSON.parse(document.getElementById("fileinfo").value);
} catch (error) {
  // location.href = '/404';
  console.log(error);
}

function errorX() {
  location.reload();
}

function action(dom) {
  const name = dom.getAttribute("action");
  switch (name) {
    case "hapus":
      hapus(dom);
      break;
    case "suka":
      suka(dom);
      break;
    case "simpan":
      simpan(dom);
      break;
    case "bagi":
      bagi(dom);
      break;
    case "bagikan":
      bagikan(dom);
      break;
    case "komentar":
      komentar(dom);
      break;
    default:
      break;
  }
}

async function hapus() {
  try {
    const confirmation = confirm("hapus postingan?");
    if (!confirmation) {
      return;
    }
    const response = await fetch("/post/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileinfo),
    });
    const data = await response.json();
    console.log(data);
    if (!data.status) {
      alert("Gagal hapus!");
      return;
    }
    alert("berhasil hapus!");
    window.parent.postMessage("close-iframe", "*");
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    alert("gagal menghapus postingan!");
    console.log(error);
  }
}

async function bagikan() {
  try {
    const url = location.href;
    if (navigator.share) {
       await navigator.share({
        title: `Stylish Desktop - Dektop keren ${
          document.querySelector(".judul").innerText
        }`,
        url: url,
      });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast('share link disalin ke klip board!')
  } catch {
    const txt = document.createElement("textarea");
    txt.value = location.href;
    document.body.append(txt);
    txt.select();
    document.execCommand("copy");
    toast('share link disalin ke klip board!')
    txt.remove();
  }
}

async function suka(dom) {
  simpan.on = false;
  bagi.on = false;
  komentar.on = false;
  if (suka.on === true) {
    suka.on = false;
    return (document.getElementById("likes-container").style.display = "none");
  }
  suka.on = true;
  document.querySelectorAll(".interactions-container").forEach((a) => {
    a.style.display = a.id !== "likes-container" ? "none" : "flex";
  });
}
suka.on = false;

async function simpan(dom) {
  suka.on = false;
  bagi.on = false;
  komentar.on = false;
  if (simpan.on === true) {
    simpan.on = false;
    return (document.getElementById("saves-container").style.display = "none");
  }
  simpan.on = true;
  document.querySelectorAll(".interactions-container").forEach((a) => {
    a.style.display = a.id !== "saves-container" ? "none" : "flex";
  });
}
simpan.on = false;

async function bagi(dom) {
  suka.on = false;
  simpan.on = false;
  komentar.on = false;
  if (bagi.on === true) {
    bagi.on = false;
    return (document.getElementById("shares-container").style.display = "none");
  }
  bagi.on = true;
  document.querySelectorAll(".interactions-container").forEach((a) => {
    a.style.display = a.id !== "shares-container" ? "none" : "flex";
  });
}
bagi.on = false;

async function komentar(dom) {
  suka.on = false;
  simpan.on = false;
  bagi.on = false;
  if (komentar.on === true) {
    komentar.on = false;
    return (document.getElementById("comments-container").style.display =
      "none");
  }
  komentar.on = true;
  document.querySelectorAll(".interactions-container").forEach((a) => {
    a.style.display = a.id !== "comments-container" ? "none" : "flex";
  });
}
komentar.on = false;





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