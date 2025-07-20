// Menunggu DOM siap

const form = document.getElementById("register-login-form");
const confirmPassword = document.getElementById("confirm-password");
const message = document.getElementById("error-message");
const registerBtn = document.getElementById('submit');
const username = document.getElementById("username");
const password = document.getElementById("password");


form.addEventListener("submit", function (event) {
  // Jika password dan konfirmasi password tidak cocok
  if (password.value !== confirmPassword.value) {
    event.preventDefault(); // Mencegah form disubmit
    message.textContent = "Password dan Konfirmasi Password tidak cocok."; // Menampilkan pesan error
    message.style.color = "red";
  }
});






function buatErrorMessage(pesan = '', waktu = 5000) {
  message.innerText = pesan
  message.style.color = "red";
  setTimeout(() => {
    message.innerText = ''
    message.style.color = 'white'
  }, waktu)
}

function buatSuksesMessage(pesan = '', waktu = 5000) {
  message.innerText = pesan
  message.style.color = "green";
  setTimeout(() => {
    message.innerText = ''
    message.style.color = 'white'
  }, waktu)
}


function formRegistrasiCheck() {
  if (password.value == '' || confirmPassword.value == '' || username.value == '') {
    buatErrorMessage('semua input harus diisi')
    return false
  } else {
    return true
  }
}


function konfirmasiPasswordCheck() {
  if (password.value !== confirmPassword.value) {
    buatErrorMessage("Password dan Konfirmasi Password tidak cocok.")
    enableRegisterBtn()
    return false
  } else { return true }
}


function disableRegisterBtn() {
  registerBtn.setAttribute('disabled', '');
  registerBtn.style.filter = 'opacity(.5)';
  registerBtn.style.cursor = 'not-allowed'
}
function enableRegisterBtn() {
  registerBtn.removeAttribute('disabled');
  registerBtn.style.filter = 'opacity(1)';
  registerBtn.style.cursor = 'pointer'
}


async function register() {
  try {
    if (!formRegistrasiCheck()) { return }
    if (!konfirmasiPasswordCheck()) { return }
    disableRegisterBtn();

    const data = {
      username: username.value,  // Data yang ingin dikirim
      password: password.value
    };

    // Mengirim permintaan POST dengan fetch
    const response = await fetch("/register", {
      method: 'POST', // Metode POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.status) {
      buatSuksesMessage(result.message);
      setTimeout(() => {
        location.href = '/profile/me';
      }, 1379);
      return
    }
    return buatErrorMessage(result.message.replaceAll('-', ''));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setTimeout(() => {
      enableRegisterBtn();
    }, 2000)
  }
}

registerBtn.onclick = register
