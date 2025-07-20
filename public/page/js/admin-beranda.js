document.querySelectorAll('section').forEach((s) => {
    s.addEventListener('click', (e) => {
        const a = e.target.id;
        const b = e.target.parentElement.id;
        if (a === 'temp' || b === 'temp') {
            location.href = '/admin/temp'
        }
        if (a === 'konten' || b === 'konten') {
            location.href = '/admin/konten'
        }
        if (a === 'laporan' || b === 'laporan') {
            location.href = '/admin/laporan'
        }
        if (a === 'users' || b === 'users') {
            location.href = '/admin/users'
        }

    })
})