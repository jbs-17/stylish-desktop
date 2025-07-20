console.log('dashboard');



let all = [];
async function get(params) {
    try {
        const loader = document.getElementById('loader');
        const res = await fetch('/dashboard-get', {
            method: "GET",
        })
        const data = await res.json();
        console.log(data)
        all = [...data.foto, ...data.video];
        document.querySelectorAll('.card').forEach(c => c.remove());
        all.forEach(a => {
            
            const { filebase, judul, UUID, deskripsi, ext, UID, mimetype, diupload, relativeFilePath } = a;
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('UID', UID);
            card.innerHTML = `           
            ${mimetype.includes('image') ? `<img src="${relativeFilePath}" alt="${filebase}" />` : `<video src="${relativeFilePath}" controls></video>`}
            <div class="card-info">
            <h2>${judul}</h2>
            <p>${deskripsi}</p>
                    <small>filebase: ${filebase}</small>
                    <br>
                    <small>UUID: ${UUID}</small>
                    <br>
                    <small>UID: ${UID}</small>
                    <br>
                    <small>Diunggah: ${diupload}</small>
                    <br>
                    <small>mimetype: ${mimetype}</small>
                    <br>
                    <small>ext: ${ext}</small>
                    <br>
                    <small>relativeFilePath: ${relativeFilePath}</small>
                    <br>
                </div>
                <div class="card-actions">
                <button class="accept btn" data-uuid="98f95c20-9e50-480b-b1ab-c0e2fd657734">Accept</button>
                    <button class="decline btn" data-uuid="98f95c20-9e50-480b-b1ab-c0e2fd657734">Decline</button>
            </div>`
            // console.log(card)
            card.setAttribute('data', UID)
            loader.before(card)
        })

    } catch (error) {
        console.log(error)
    }
}


async function main() {
    try {
        await get();
        document.querySelectorAll('button.btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if ([...e.target.classList].includes('accept')) {
                    const data = all.filter(c => c.UID === e.target.parentElement.parentElement.getAttribute('data'))[0]
                    data.accepted = new Date().toLocaleString();
                    // console.log(data)
                    await acc(data);
                    e.target.parentElement.parentElement.remove();
                } else if ([...e.target.classList].includes('decline')) {
                    console.log('decline')
                    const data = all.filter(c => c.UID === e.target.parentElement.parentElement.getAttribute('data'))[0]
                    await dec(data);
                    e.target.parentElement.parentElement.remove();
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}
setTimeout(main, 1234)
setInterval(main, 3000)


async function acc(data) {
    try {
        const res = await fetch('/dashboard-acc', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const resData = await res.json()
        console.log(resData);
    } catch (error) {
        console.log(error)
    }
}

async function dec(data) {
    try {
        const res = await fetch('/dashboard-dec', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const resData = await res.json()
        console.log(resData)
    } catch (error) {
        console.log(error)
    }
}