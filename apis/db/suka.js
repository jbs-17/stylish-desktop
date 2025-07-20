/* eslint-disable no-useless-catch */
import {
  cariUserDariUUID, userdatabase, tanggalString,
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  // eslint-disable-next-line no-unused-vars
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';



async function sukaImage(userYangMenyukai, informasiFile) {
  try {
    //pencarian
    const cariUserYangMenyukai = await cariUserDariUUID(userYangMenyukai.UUID);
    userYangMenyukai = cariUserYangMenyukai.user;
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
    if (!cariUserInformasiFile.status && !cariUserYangMenyukai.status) {
      throw Error("user gagal ditemukan");
    }
    for (const suka of informasiFile.suka) {
      if (suka.UUID === userYangMenyukai.UUID) {
        throw Error("sudah disukai!");
      }
    }
    //manipulasi suka
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukUserYangMenyukai = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyukai.UUID,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
      datenow: Date.now()
    };
    userYangMenyukai.suka.push(informasiUntukUserYangMenyukai); //userYangMenyukai array sukanya dipush uid file yg disukai;
    informasiFile.suka.push(informasiUntukUserInformasiFile); //informasi file array sukanya di push UUID userYangMenyukai
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyukai.index] = userYangMenyukai;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `sukaImage: SUKSES UUID:${userYangMenyukai?.UUID} menyukai fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `sukaImage: ERRROR ${error} UUID:${userYangMenyukai?.UUID} gagal menyukai fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
};

async function batalSukaImage(userYangMenyukai, informasiFile) {
  try {
    //pencarian
    const cariUserYangMenyukai = await cariUserDariUUID(userYangMenyukai.UUID);
    userYangMenyukai = cariUserYangMenyukai.user;
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
      cariUserYangMenyukai.status === true
    ) {
      try {
        const cariInteraksiSukaPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.suka,
          userYangMenyukai.UUID
        );
        if (cariInteraksiSukaPadaFile.status === false) {
          throw Error("gagal mencari interaksi suka");
        }
        const cariInteraksiSukaPadaUserYangMenyukai =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyukai.suka,
            cariInteraksiSukaPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSukaPadaUserYangMenyukai.status === false) {
          throw Error("gagal mencari interaksi suka");
        }
        informasiFile.suka.splice(cariInteraksiSukaPadaFile.index, 1);
        userYangMenyukai.suka.splice(
          cariInteraksiSukaPadaUserYangMenyukai.index,
          1
        );

        userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyukai.index] = userYangMenyukai;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSukaPadaFile?.informasiFile.interaksiUID,
          message: `batalSukaImage: SUKSES UUID:${userYangMenyukai?.UUID} membatalkan suka fileUID:${informasiFile?.fileUID}`,
          userYangMenyukai: userYangMenyukai?.UUID,
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
      message: `batalSukaImage: ERRROR ${error} UUID:${userYangMenyukai?.UUID} gagal batal suka fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}

async function sukaVideo(userYangMenyukai, informasiFile) {
  try {
    //pencarian
    const cariUserYangMenyukai = await cariUserDariUUID(userYangMenyukai.UUID);
    userYangMenyukai = cariUserYangMenyukai.user;
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
    if (!cariUserInformasiFile.status && !cariUserYangMenyukai.status) {
      throw Error("user gagal ditemukan");
    }
    for (const suka of informasiFile.suka) {
      if (suka.UUID === userYangMenyukai.UUID) {
        throw Error("sudah disukai!");
      }
    }
    //manipulasi suka
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukUserYangMenyukai = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyukai.UUID,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
      datenow: Date.now()
    };
    userYangMenyukai.suka.push(informasiUntukUserYangMenyukai); //userYangMenyukai array sukanya dipush uid file yg disukai;
    informasiFile.suka.push(informasiUntukUserInformasiFile); //informasi file array sukanya di push UUID userYangMenyukai
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyukai.index] = userYangMenyukai;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `sukaVideo: SUKSES UUID:${userYangMenyukai?.UUID} menyukai fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `sukaVideo: ERRROR ${error} UUID:${userYangMenyukai?.UUID} gagal menyukai fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalSukaVideo(userYangMenyukai, informasiFile) {
  try {
    //pencarian
    const cariUserYangMenyukai = await cariUserDariUUID(userYangMenyukai.UUID);
    userYangMenyukai = cariUserYangMenyukai.user;
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
      cariUserYangMenyukai.status === true
    ) {
      try {
        const cariInteraksiSukaPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.suka,
          userYangMenyukai.UUID
        );
        if (cariInteraksiSukaPadaFile.status === false) {
          throw Error("gagal mencari interaksi suka");
        }
        const cariInteraksiSukaPadaUserYangMenyukai =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyukai.suka,
            cariInteraksiSukaPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSukaPadaUserYangMenyukai.status === false) {
          throw Error("gagal mencari interaksi suka");
        }
        informasiFile.suka.splice(cariInteraksiSukaPadaFile.index, 1);
        userYangMenyukai.suka.splice(
          cariInteraksiSukaPadaUserYangMenyukai.index,
          1
        );

        userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyukai.index] = userYangMenyukai;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSukaPadaFile?.informasiFile.interaksiUID,
          message: `batalSukaVideo: SUKSES UUID:${userYangMenyukai?.UUID} membatalkan suka fileUID:${informasiFile?.fileUID}`,
          userYangMenyukai: userYangMenyukai?.UUID,
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
      message: `batalSukaVideo: ERRROR ${error} UUID:${userYangMenyukai?.UUID} gagal batal suka fileUID:${informasiFile?.fileUID}`,
      userYangMenyukai: userYangMenyukai?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}

export { sukaImage, batalSukaImage, sukaVideo, batalSukaVideo };


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
//   "suka": [
//     {
//       "interaksiUID": "interaksiUID-be125028a9ef8236",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "44cc5fe5-adcc-4a1d-91ab-560155089446",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "tanggal": "09-07-2025_15-31-09",
//       "userYangMenyukai": "3eb8867d-d1df-450b-8c64-a6c73487d2a8"
//     }
//   ],
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
//   "suka": [
//     {
//       "interaksiUID": "interaksiUID-be125028a9ef8236",
//       "fileUID": "fileUID-c5616af80f70abb9",
//       "filebase": "image__fileUID-c5616af80f70abb9__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-25-16__.webp",
//       "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "tanggal": "09-07-2025_15-31-09",
//       "userYangMenyukai": "3eb8867d-d1df-450b-8c64-a6c73487d2a8"
//     }
//   ],
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
// }
// // async function name() {
// //   try {
// //     // console.log(await sukaImage(u, i));
// //     // console.log(await batalSukaImage(uu, ii));
// //   } catch (error) {
// //     console.log(error);
// //   }
// // }
// // name()