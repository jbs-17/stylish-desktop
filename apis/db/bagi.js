import {
  cariUserDariUUID, userdatabase, tanggalString,
  // eslint-disable-next-line no-unused-vars
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  // eslint-disable-next-line no-unused-vars
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';



async function bagiImage(userYangMembagi, informasiFile) {
  try {
    //pencarian
    const cariuserYangMembagi = await cariUserDariUUID(userYangMembagi.UUID);
    userYangMembagi = cariuserYangMembagi.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMembagi.status) {
      throw Error("user gagal ditemukan");
    }
    for (const bagi of informasiFile.bagi) {
      if (bagi.UUID === userYangMembagi.UUID) {
        throw Error("sudah dibagi!");
      }
    }
    //manipulasi bagi
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMembagi = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMembagi.UUID,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
      datenow: Date.now()
    };
    userYangMembagi.bagi.push(informasiUntukuserYangMembagi); //userYangMembagi array baginya dipush uid file yg dibagii;
    informasiFile.bagi.push(informasiUntukUserInformasiFile); //informasi file array baginya di push UUID userYangMembagi
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMembagi.index] = userYangMembagi;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `bagiImage: SUKSES UUID:${userYangMembagi?.UUID} membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `bagiImage: ERRROR ${error} UUID:${userYangMembagi?.UUID} gagal membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function bagiVideo(userYangMembagi, informasiFile) {
  try {
    //pencarian
    const cariuserYangMembagi = await cariUserDariUUID(userYangMembagi.UUID);
    userYangMembagi = cariuserYangMembagi.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMembagi.status) {
      throw Error("user gagal ditemukan");
    }
    for (const bagi of informasiFile.bagi) {
      if (bagi.UUID === userYangMembagi.UUID) {
        throw Error("sudah dibagi!");
      }
    }
    //manipulasi bagi
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMembagi = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMembagi.UUID,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
      datenow: Date.now()
    };
    userYangMembagi.bagi.push(informasiUntukuserYangMembagi); //userYangMembagi array baginya dipush uid file yg dibagii;
    informasiFile.bagi.push(informasiUntukUserInformasiFile); //informasi file array baginya di push UUID userYangMembagi
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMembagi.index] = userYangMembagi;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `bagiVideo: SUKSES UUID:${userYangMembagi?.UUID} membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `bagiVideo: ERRROR ${error} UUID:${userYangMembagi?.UUID} gagal membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}

export { bagiImage, bagiVideo };



// const v = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\bvv0kqdekp64ee01ehzaxe869",
//   "newFilename": "bvv0kqdekp64ee01ehzaxe869",
//   "originalFilename": "WhatsApp Video 2024-02-01 at 17.32.49.mp4",
//   "mimetype": "video/mp4",
//   "size": 2885683,
//   "filetype": "video",
//   "ext": ".mp4",
//   "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//   "fileUID": "fileUID-e36804e2bd6068ed",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\videos\\video__fileUID-e36804e2bd6068ed__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-53-20__.mp4",
//   "filebase": "video__fileUID-e36804e2bd6068ed__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-53-20__.mp4",
//   "relativeFilePath": "..\\public\\upload\\videos\\video__fileUID-e36804e2bd6068ed__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-53-20__.mp4",
//   "tanggal": "09-07-2025_15-53-20",
//   "judul": [
//     "ABC"
//   ],
//   "deskripsi": [
//     "D"
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_15-54-24"
// }
// const u = {
//   "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//   "bergabung": "09-07-2025_15-25-32",
//   "username": "minum",
//   "password": "passworda",
//   "usernameHASH": "a091d99e3b9456fe6c74b0a6c8f52c30f07e1abab5dcf1328234974e218b3a41",
//   "passwordHASH": "58afbe0ade06cd24cca00eaf4370b35f6d2450df18fd198945cb4420012cb395",
//   "name": "minum",
//   "imageTemp": [],
//   "videoTemp": [],
//   "image": [],
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
// async function name() {
//   try {
//     // console.log(await bagiVideo(u, v));
//   } catch (error) {
//     console.log(error);
//   }
// }
// name()