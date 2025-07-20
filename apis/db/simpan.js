/* eslint-disable no-useless-catch */
import {
  cariUserDariUUID, userdatabase, tanggalString,
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  // eslint-disable-next-line no-unused-vars
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';



async function simpanImage(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMenyimpan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const simpan of informasiFile.simpan) {
      if (simpan.UUID === userYangMenyimpan.UUID) {
        throw Error("sudah disimpan!");
      }
    }
    //manipulasi simpan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMenyimpan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyimpan.UUID,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
      datenow: Date.now()
    };
    userYangMenyimpan.simpan.push(informasiUntukuserYangMenyimpan); //userYangMenyimpan array simpannya dipush uid file yg disimpani;
    informasiFile.simpan.push(informasiUntukUserInformasiFile); //informasi file array simpannya di push UUID userYangMenyimpan
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `simpanImage: SUKSES UUID:${userYangMenyimpan?.UUID} menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `simpanImage: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalSimpanImage(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
    const cariUserInformasiFile = await cariUserDariUUID(informasiFile.UUID);
    const userInformasiFile = cariUserInformasiFile.user;
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      userInformasiFile.image,
      informasiFile.fileUID
    ); //untuk cari index
    if (cariInformasiFile.status === true) {
      informasiFile = cariInformasiFile.informasiFile;
    } else {
      throw Error("fileUID gagal ditemukan");
    }
    if (
      cariUserInformasiFile.status === true &&
      cariuserYangMenyimpan.status === true
    ) {
      try {
        const cariInteraksiSimpanPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.simpan,
          userYangMenyimpan.UUID
        );
        if (cariInteraksiSimpanPadaFile.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        const cariInteraksiSimpanPadauserYangMenyimpan =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyimpan.simpan,
            cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSimpanPadauserYangMenyimpan.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        informasiFile.simpan.splice(cariInteraksiSimpanPadaFile.index, 1);
        userYangMenyimpan.simpan.splice(
          cariInteraksiSimpanPadauserYangMenyimpan.index,
          1
        );

        userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID,
          message: `batalSimpanImage: SUKSES UUID:${userYangMenyimpan?.UUID} membatalkan simpan fileUID:${informasiFile?.fileUID}`,
          userYangMenyimpan: userYangMenyimpan?.UUID,
          fileUID: informasiFile?.fileUID,
        };
      } catch (error) {
        throw error;
      }
    }
    throw Error("user gagal ditemukan");
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `batalSimpanImage: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal batal simpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}





async function simpanVideo(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMenyimpan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const simpan of informasiFile.simpan) {
      if (simpan.UUID === userYangMenyimpan.UUID) {
        throw Error("sudah disimpan!");
      }
    }
    //manipulasi simpan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMenyimpan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyimpan.UUID,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
      datenow: Date.now()
    };
    userYangMenyimpan.simpan.push(informasiUntukuserYangMenyimpan); //userYangMenyimpan array simpannya dipush uid file yg disimpani;
    informasiFile.simpan.push(informasiUntukUserInformasiFile); //informasi file array simpannya di push UUID userYangMenyimpan
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `simpanVideo: SUKSES UUID:${userYangMenyimpan?.UUID} menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `simpanVideo: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalSimpanVideo(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
    const cariUserInformasiFile = await cariUserDariUUID(informasiFile.UUID);
    const userInformasiFile = cariUserInformasiFile.user;
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      userInformasiFile.video,
      informasiFile.fileUID
    ); //untuk cari index
    if (cariInformasiFile.status === true) {
      informasiFile = cariInformasiFile.informasiFile;
    } else {
      throw Error("fileUID gagal ditemukan");
    }
    if (
      cariUserInformasiFile.status === true &&
      cariuserYangMenyimpan.status === true
    ) {
      try {
        const cariInteraksiSimpanPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.simpan,
          userYangMenyimpan.UUID
        );
        if (cariInteraksiSimpanPadaFile.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        const cariInteraksiSimpanPadauserYangMenyimpan =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyimpan.simpan,
            cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSimpanPadauserYangMenyimpan.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        informasiFile.simpan.splice(cariInteraksiSimpanPadaFile.index, 1);
        userYangMenyimpan.simpan.splice(
          cariInteraksiSimpanPadauserYangMenyimpan.index,
          1
        );

        userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID,
          message: `batalSimpanVideo: SUKSES UUID:${userYangMenyimpan?.UUID} membatalkan simpan fileUID:${informasiFile?.fileUID}`,
          userYangMenyimpan: userYangMenyimpan?.UUID,
          fileUID: informasiFile?.fileUID,
        };
      } catch (error) {
        throw error;
      }
    }
    throw Error("user gagal ditemukan");
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `batalSimpanVideo: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal batal simpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}


export { simpanImage, batalSimpanImage, simpanVideo, batalSimpanVideo };



// const i = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\q4wibu3ljridz1qco5i05b7ei",
//   "newFilename": "q4wibu3ljridz1qco5i05b7ei",
//   "originalFilename": "WhatsApp.svg.webp",
//   "mimetype": "image/webp",
//   "size": 87252,
//   "filetype": "image",
//   "ext": ".webp",
//   "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//   "fileUID": "fileUID-c5616af80f70abb9",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "tanggal": "09-07-2025_15-25-16",
//   "judul": [
//     "WA"
//   ],
//   "deskripsi": [
//     ""
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [
//     {
//       "interaksiUID": "interaksiUID-abe427988f3324ce",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "tanggal": "09-07-2025_15-26-49",
//       "userYangMelaporkan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "laporan": "ini laporan saya"
//     }
//   ],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_15-26-01",
//   "index": 0
// };
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
//   "laporkan": [
//     {
//       "interaksiUID": "interaksiUID-abe427988f3324ce",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "tanggal": "09-07-2025_15-26-49",
//       "userYangMelaporkan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "laporan": "ini laporan saya"
//     }
//   ],
//   "kelamin": "",
//   "tempattanggallahir": "",
//   "pp": "",
//   "log": [],
//   "email": "",
//   "telp": "",
//   "index": 2
// }

// const ii = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\q4wibu3ljridz1qco5i05b7ei",
//   "newFilename": "q4wibu3ljridz1qco5i05b7ei",
//   "originalFilename": "WhatsApp.svg.webp",
//   "mimetype": "image/webp",
//   "size": 87252,
//   "filetype": "image",
//   "ext": ".webp",
//   "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//   "fileUID": "fileUID-c5616af80f70abb9",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//   "tanggal": "09-07-2025_15-25-16",
//   "judul": [
//     "WA"
//   ],
//   "deskripsi": [
//     ""
//   ],
//   "suka": [],
//   "simpan": [
//     {
//       "interaksiUID": "interaksiUID-500c34b6c116ecd5",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "tanggal": "09-07-2025_15-43-33",
//       "userYangMenyimpan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8"
//     }
//   ],
//   "bagi": [],
//   "laporkan": [
//     {
//       "interaksiUID": "interaksiUID-abe427988f3324ce",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "tanggal": "09-07-2025_15-26-49",
//       "userYangMelaporkan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "laporan": "ini laporan saya"
//     }
//   ],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_15-26-01",
//   "index": 0
// }

// const uu = {
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
//   "simpan": [
//     {
//       "interaksiUID": "interaksiUID-500c34b6c116ecd5",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "tanggal": "09-07-2025_15-43-33",
//       "userYangMenyimpan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8"
//     }
//   ],
//   "bagi": [],
//   "ikuti": [],
//   "diikuti": [],
//   "settings": {},
//   "arsip": [],
//   "bio": [],
//   "laporkan": [
//     {
//       "interaksiUID": "interaksiUID-abe427988f3324ce",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "tanggal": "09-07-2025_15-26-49",
//       "userYangMelaporkan": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "laporan": "ini laporan saya"
//     }
//   ],
//   "kelamin": "",
//   "tempattanggallahir": "",
//   "pp": "",
//   "log": [],
//   "email": "",
//   "telp": "",
//   "index": 2
// }
// // async function name() {
// //   try {
// //     // console.log(await simpanImage(u, i));
// //     // console.log(await batalSimpanImage(u, i));
// //     console.log(await batalSimpanImage(uu, ii));
// //   } catch (error) {
// //     console.log(error);
// //   }
// // }
// // name()