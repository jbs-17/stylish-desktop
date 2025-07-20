// Menunggu DOM siap
document.addEventListener("DOMContentLoaded", function () {
});






const loginBtn = document.getElementById('submit')
const password = document.getElementById("password");
const username = document.getElementById("username");
const errorMessage = document.getElementById("message");

function buatErrorMessage(pesan = '', waktu = 5000) {
    errorMessage.innerText = pesan
    errorMessage.style.color = "red";
    setTimeout(() => {
        errorMessage.innerText = ''
        errorMessage.style.color = 'white'
    }, waktu)
}

function buatSuksesMessage(pesan = '', waktu = 5500) {
    errorMessage.innerText = pesan
    errorMessage.style.color = "green";
    setTimeout(() => {
        errorMessage.innerText = ''
        errorMessage.style.color = 'white'
    }, waktu)
}


function formRegistrasiCheck() {
    if (password.value == '' || username.value == '') {
        buatErrorMessage('semua input mesti diisi!')
        return false
    } else {
        return true
    }
}



function disableRegisterBtn() {
    loginBtn.setAttribute('disabled', '');
    loginBtn.style.filter = 'opacity(.5)';
    loginBtn.style.cursor = 'not-allowed'
}
function enableRegisterBtn() {
    loginBtn.removeAttribute('disabled');
    loginBtn.style.filter = 'opacity(1)';
    loginBtn.style.cursor = 'pointer'
}

loginBtn.onclick = register;

async function register() {
    try {
        if (!formRegistrasiCheck()) { return }
        disableRegisterBtn();
        const data = {
            username: username.value,  // Data yang ingin dikirim
            password: password.value
        };
        // Mengirim permintaan POST dengan fetch
        const response = await fetch('/login', {
            method: 'POST', // Metode POST
            headers: {
                'Content-Type': 'application/json', // Tentukan tipe konten yang dikirimkan
            },
            body: JSON.stringify(data) // Mengubah data menjadi format JSON
        });

        const result = await response.json();
        if(result.status){
            buatSuksesMessage(result.message + ' akan dialihkan', 2500);
            setTimeout(() => {
                location.href = '/profile/me';
            }, 1086);
        }
        else{
            buatErrorMessage(result.message, 2500)
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        setTimeout(enableRegisterBtn, 2500)
    }
}

