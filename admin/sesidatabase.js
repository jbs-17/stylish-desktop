import { promisify } from 'node:util';

import { sesidatabase, intervalCheckSesiLogin, lamaSesiLogin } from '../config.js';

import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export default {
    tambahSesiLoginBaru, verifikasiSesiLogin
}
export {
    tambahSesiLoginBaru, verifikasiSesiLogin
}

async function verifikasiSesiLogin(sessionId) {
    try {
        const datasesi = await readFileAsync(sesidatabase);
        for (const sesi of datasesi) {
            if (sesi.sessionId === sessionId) {
                return { status: true, message: "sesi terverifikasi", sesi }
            }
        }
        return { status: false, message: "sesi tidak terverifikasi" }
    } catch (error) {
        return { status: false, message: "sesi tidak terverifikasi", error }
    }
}

function kedaluarsaDetik(detik) {
    return Date.now() + detik * 1000;
}


async function tambahSesiLoginBaru({ sessionId, user: { UUID } }) {
    try {
        const datasesi = await readFileAsync(sesidatabase);
        datasesi.push({ sessionId, UUID, expired: kedaluarsaDetik(lamaSesiLogin) });
        await writeFileAsync(sesidatabase, datasesi, { spaces: 2 });
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

setInterval(chekKedaluarsaSesiLogin, intervalCheckSesiLogin * 1000);

async function chekKedaluarsaSesiLogin() {
    try {
        console.log('Check sesi');
        const datasesi = await readFileAsync(sesidatabase);
        for (let i = datasesi.length - 1; i >= 0; i--) {
            if (Date.now() >= datasesi[i].expired) {
                // console.log(`sessionId:"${datasesi[i].sessionId}" kedaluarsa.`);
                datasesi.splice(i, 1);
                await writeFileAsync(sesidatabase, datasesi, { spaces: 2 });
            }
        }
        // if (!datasesi.length) {
        //     console.log('✅ Semua sesi sudah kedaluarsa.');
        // } else {
        //     console.log(`${datasesi.length} sesi masih tersisa`)
        // }
    } catch (error) {
        console.log('Check sesi error', error)
        return
    }
}









/*

{
  status: true,
  user: {
    UUID: '7a36fe9d-96be-44fc-bf3f-3c10a3e3b841',
    username: 'user',
    password: 'password',
    usernameHASH: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb',
    passwordHASH: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    name: 'user',
    data: { simpan: [], suka: [], unggah: [], ikuti: [], metadata: [] }
  },
  message: 'data user-password sukses di verifikasi',
  sessionId: '827d67ba-013e-403a-8e03-67319dc05fc3'
}
*/














/*
let produk = [
    { nama: 'a', id: 101213, expired: kedaluarsaDetik(3) },
    { nama: 'b', id: 101009, expired: kedaluarsaDetik(6) },
    { nama: 'c', id: 102172, expired: kedaluarsaDetik(10) },
    { nama: 'd', id: 101653, expired: kedaluarsaDetik(1) },
];

console.log('Daftar produk awal:');
console.table(produk);
const interval = setInterval(() => {
    const now = Date.now();

    for (let i = produk.length - 1; i >= 0; i--) {
        if (now >= produk[i].expired) {
            console.log(`Produk "${produk[i].nama}" kedaluarsa.`);
            produk.splice(i, 1);
            console.table(produk);
        }
    }

    if (!produk.length) {
        clearInterval(interval);
        console.log('✅ Semua produk sudah kedaluarsa.');
    }
}, 1000);


*/
