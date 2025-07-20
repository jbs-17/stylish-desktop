

import {
  cariUserDariUUID, userdatabase, tanggalString,
  // eslint-disable-next-line no-unused-vars
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  // eslint-disable-next-line no-unused-vars
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';






async function laporkanImage(userYangMelaporkan, informasiFile, laporan = "") {
  try {
    if (!laporan.length) {
      throw Error("Laporan tidak valdi!");
    }
    //pencarian
    const cariuserYangMelaporkan = await cariUserDariUUID(
      userYangMelaporkan.UUID
    );
    userYangMelaporkan = cariuserYangMelaporkan.user;
    const cariUserInformasiFile = await cariUserDariUUID(informasiFile.UUID);
    const userInformasiFile = cariUserInformasiFile.user;
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      userInformasiFile.image,
      informasiFile.fileUID
    ); //untuk cari index
    if (!cariInformasiFile.status) {
      throw Error("fileUID gagal ditemukan");
    }
    informasiFile = cariInformasiFile.informasiFile;
    if (!cariUserInformasiFile.status && !cariuserYangMelaporkan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const laporkan of informasiFile.laporkan) {
      if (laporkan.UUID === userYangMelaporkan.UUID) {
        throw Error("sudah dilaporkan!");
      }
    }
    //manipulasi laporkan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMelaporkan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMelaporkan.UUID,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
      datenow: Date.now()
    };
    userYangMelaporkan.laporkan.push(informasiUntukuserYangMelaporkan); //userYangMelaporkan array laporkannya dipush uid file yg dilaporkani;
    informasiFile.laporkan.push(informasiUntukUserInformasiFile); //informasi file array laporkannya di push UUID userYangMelaporkan
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMelaporkan.index] = userYangMelaporkan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `laporkanImage: SUKSES UUID:${userYangMelaporkan?.UUID} melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `laporkanImage: ERRROR ${error} UUID:${userYangMelaporkan?.UUID} gagal melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function laporkanVideo(userYangMelaporkan, informasiFile, laporan = "") {
  try {
    if (!laporan.length) {
      throw Error("Laporan tidak valdi!");
    }
    //pencarian
    const cariuserYangMelaporkan = await cariUserDariUUID(
      userYangMelaporkan.UUID
    );
    userYangMelaporkan = cariuserYangMelaporkan.user;
    const cariUserInformasiFile = await cariUserDariUUID(informasiFile.UUID);
    const userInformasiFile = cariUserInformasiFile.user;
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      userInformasiFile.video,
      informasiFile.fileUID
    ); //untuk cari index
    if (!cariInformasiFile.status) {
      throw Error("fileUID gagal ditemukan");
    }
    informasiFile = cariInformasiFile.informasiFile;
    if (!cariUserInformasiFile.status && !cariuserYangMelaporkan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const laporkan of informasiFile.laporkan) {
      if (laporkan.UUID === userYangMelaporkan.UUID) {
        throw Error("sudah dilaporkan!");
      }
    }
    //manipulasi laporkan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMelaporkan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMelaporkan.UUID,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
      datenow: Date.now()
    };
    userYangMelaporkan.laporkan.push(informasiUntukuserYangMelaporkan); //userYangMelaporkan array laporkannya dipush uid file yg dilaporkani;
    informasiFile.laporkan.push(informasiUntukUserInformasiFile); //informasi file array laporkannya di push UUID userYangMelaporkan
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMelaporkan.index] = userYangMelaporkan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `laporkanVideo: SUKSES UUID:${userYangMelaporkan?.UUID} melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `laporkanVideo: ERRROR ${error} UUID:${userYangMelaporkan?.UUID} gagal melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}

export { laporkanImage, laporkanVideo };




// const usr = {
//   "UUID": "4f2ffcb9-9837-436b-9752-90c4dd03423b",
//   "bergabung": "08-07-2025_17-51-50",
//   "username": "minum",
//   "password": "passworda",
//   "usernameHASH": "a091d99e3b9456fe6c74b0a6c8f52c30f07e1abab5dcf1328234974e218b3a41",
//   "passwordHASH": "58afbe0ade06cd24cca00eaf4370b35f6d2450df18fd198945cb4420012cb395",
//   "name": "minum",
//   "imageTemp": [],
//   "videoTemp": [],
//   "image": [
//     {
//       "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\fen81ybqavd8rdaiwops8355n",
//       "newFilename": "fen81ybqavd8rdaiwops8355n",
//       "originalFilename": "sampaj.jpg",
//       "mimetype": "image/jpeg",
//       "size": 202685,
//       "filetype": "image",
//       "ext": ".jpg",
//       "UUID": "4f2ffcb9-9837-436b-9752-90c4dd03423b",
//       "fileUID": "fileUID-d6b35d2113321b6c",
//       "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "filebase": "image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "tanggal": "09-07-2025_10-10-54",
//       "judul": [
//         "SAMPAH"
//       ],
//       "deskripsi": [
//         "ITU SAMPAh"
//       ],
//       "suka": [],
//       "simpan": [],
//       "bagi": [],
//       "laporkan": [],
//       "komentar": [],
//       "diarsipkan": false,
//       "metadata": [],
//       "diterima": "09-07-2025_10-11-04"
//     }
//   ],
//   "video": [],
//   "komentar": [],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "ikuti": [],
//   "diikuti": [],
//   "settings": {},
//   "arsip": [],
//   "bio": [],
//   "laporkan": [],
//   "kelamin": "",
//   "tempattanggallahir": "",
//   "pp": "",
//   "log": [],
//   "email": "",
//   "telp": "",
//   "index": 2
// }

// const fil = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\y9x6fbsolbd27jp1uzoxvm85o",
//   "newFilename": "y9x6fbsolbd27jp1uzoxvm85o",
//   "originalFilename": "WhatsApp Image 2024-08-10 at 19.05.01_acb3647d.jpg",
//   "mimetype": "image/jpeg",
//   "size": 743602,
//   "filetype": "image",
//   "ext": ".jpg",
//   "UUID": "b1f43713-7117-43a6-8803-bbf331f4bcac",
//   "fileUID": "fileUID-1053cbe9ff555fe7",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "filebase": "image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "tanggal": "09-07-2025_10-04-56",
//   "judul": [
//     "singkong"
//   ],
//   "deskripsi": [
//     "enak"
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_10-09-08"
// }


// async function namex() {
//   try {
//     console.log(await laporkanImage(usr, fil, 'lol'));
//   } catch (error) {
//     console.log(error);
//   }
// }