/* eslint-disable no-useless-catch */
import {
  cariUserDariUUID, userdatabase, tanggalString,
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  // eslint-disable-next-line no-unused-vars
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';



async function komentarImage(userYangKomentar, informasiFile, komentar = "") {
  try {
    if (!komentar.length) {
      throw Error("Komentar tidak valdi!");
    }
    //pencarian
    const cariuserYangKomentar = await cariUserDariUUID(userYangKomentar.UUID);
    userYangKomentar = cariuserYangKomentar.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangKomentar.status) {
      throw Error("user gagal ditemukan");
    }
    for (const komentar of informasiFile.komentar) {
      if (komentar.UUID === userYangKomentar.UUID) {
        throw Error("sudah komentar!");
      }
    }
    //manipulasi komentar
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangKomentar = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangKomentar.UUID,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
      datenow: Date.now()
    };
    userYangKomentar.komentar.push(informasiUntukuserYangKomentar); //userYangKomentar array komentarnya dipush uid file yg dikomentari;
    informasiFile.komentar.push(informasiUntukUserInformasiFile); //informasi file array komentarnya di push UUID userYangKomentar
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangKomentar.index] = userYangKomentar;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `komentarImage: SUKSES UUID:${userYangKomentar?.UUID} komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `komentarImage: ERRROR ${error} UUID:${userYangKomentar?.UUID} gagal komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalKomentarImage(userYangKomentar, informasiFile) {
  try {
    //pencarian
    const cariuserYangKomentar = await cariUserDariUUID(userYangKomentar.UUID);
    userYangKomentar = cariuserYangKomentar.user;
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
      cariuserYangKomentar.status === true
    ) {
      try {
        const cariInteraksiKomentarPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.komentar,
          userYangKomentar.UUID
        );
        if (cariInteraksiKomentarPadaFile.status === false) {
          throw Error("gagal mencari interaksi komentar");
        }
        const cariInteraksiKomentarPadauserYangKomentar =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangKomentar.komentar,
            cariInteraksiKomentarPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiKomentarPadauserYangKomentar.status === false) {
          throw Error("gagal mencari interaksi komentar");
        }
        informasiFile.komentar.splice(cariInteraksiKomentarPadaFile.index, 1);
        userYangKomentar.komentar.splice(
          cariInteraksiKomentarPadauserYangKomentar.index,
          1
        );

        userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangKomentar.index] = userYangKomentar;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID:
            cariInteraksiKomentarPadaFile?.informasiFile.interaksiUID,
          message: `batalKomentarImage: SUKSES UUID:${userYangKomentar?.UUID} membatalkan komentar fileUID:${informasiFile?.fileUID}`,
          userYangKomentar: userYangKomentar?.UUID,
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
      message: `batalKomentarImage: ERRROR ${error} UUID:${userYangKomentar?.UUID} gagal batal komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}


async function komentarVideo(userYangKomentar, informasiFile, komentar = "") {
  try {
    if (!komentar.length) {
      throw Error("Komentar tidak valdi!");
    }
    //pencarian
    const cariuserYangKomentar = await cariUserDariUUID(userYangKomentar.UUID);
    userYangKomentar = cariuserYangKomentar.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangKomentar.status) {
      throw Error("user gagal ditemukan");
    }
    for (const komentar of informasiFile.komentar) {
      if (komentar.UUID === userYangKomentar.UUID) {
        throw Error("sudah komentar!");
      }
    }
    //manipulasi komentar
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangKomentar = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
      datenow: Date.now()
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangKomentar.UUID,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
      datenow: Date.now()
    };
    userYangKomentar.komentar.push(informasiUntukuserYangKomentar); //userYangKomentar array komentarnya dipush uid file yg dikomentari;
    informasiFile.komentar.push(informasiUntukUserInformasiFile); //informasi file array komentarnya di push UUID userYangKomentar
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangKomentar.index] = userYangKomentar;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `komentarVideo: SUKSES UUID:${userYangKomentar?.UUID} komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `komentarVideo: ERRROR ${error} UUID:${userYangKomentar?.UUID} gagal komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalKomentarVideo(userYangKomentar, informasiFile) {
  try {
    //pencarian
    const cariuserYangKomentar = await cariUserDariUUID(userYangKomentar.UUID);
    userYangKomentar = cariuserYangKomentar.user;
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
      cariuserYangKomentar.status === true
    ) {
      try {
        const cariInteraksiKomentarPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.komentar,
          userYangKomentar.UUID
        );
        if (cariInteraksiKomentarPadaFile.status === false) {
          throw Error("gagal mencari interaksi komentar");
        }
        const cariInteraksiKomentarPadauserYangKomentar =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangKomentar.komentar,
            cariInteraksiKomentarPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiKomentarPadauserYangKomentar.status === false) {
          throw Error("gagal mencari interaksi komentar");
        }
        informasiFile.komentar.splice(cariInteraksiKomentarPadaFile.index, 1);
        userYangKomentar.komentar.splice(
          cariInteraksiKomentarPadauserYangKomentar.index,
          1
        );

        userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangKomentar.index] = userYangKomentar;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID:
            cariInteraksiKomentarPadaFile?.informasiFile.interaksiUID,
          message: `batalKomentarVideo: SUKSES UUID:${userYangKomentar?.UUID} membatalkan komentar fileUID:${informasiFile?.fileUID}`,
          userYangKomentar: userYangKomentar?.UUID,
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
      message: `batalKomentarVideo: ERRROR ${error} UUID:${userYangKomentar?.UUID} gagal batal komentar fileUID:${informasiFile?.fileUID}`,
      userYangKomentar: userYangKomentar?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}


export { komentarImage, batalKomentarImage, komentarVideo, batalKomentarVideo };




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
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_15-26-01",
//   "index": 0
// }
// const vv = {
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
//   "komentar": [
//     {
//       "interaksiUID": "interaksiUID-e8ba7f1f4416262e",
//       "fileUID": "fileUID-e36804e2bd6068ed",
//       "filebase": "video__fileUID-e36804e2bd6068ed__44cc5fe5-adcc-4a1d-91ab-560155089446__09-07-2025_15-53-20__.mp4",
//       "UUID": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "tanggal": "09-07-2025_16-34-58",
//       "userYangKomentar": "3eb8867d-d1df-450b-8c64-a6c73487d2a8",
//       "komentar": "wow keren banget ygy"
//     }
//   ],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_15-54-24",
//   "index": 0
// }
// async function name() {
//   try {
//     // console.log(await komentarVideo(u, v, 'wow keren banget ygy'));
//     // console.log(await komentarImage(u, i, 'apa coba'));
//     // console.log(await batalKomentarImage(u, i));
//     // console.log(await batalKomentarVideo(u, vv));
//   } catch (error) {
//     console.log(error);
//   }
// }
// // name();