//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "node:util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

// import { 
//   randomFillSync,
//    randomUUID } 
//    from "crypto";



//  locale
import {
  // cariUsername,
  // verifikasiPasswordString,
  // verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  // verifikasiUsernamePasswordData,
  cariUserDariUUID,
} from "../verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../../config.js";
// import { hash } from "../../modules/hash.js";
// import tanggalString from "../../modules/date-string.mjs";




// utils user
import {
  cariInformasiFileDenganFileUID,
  // cariInformasiFileDenganUserUUID,
  // cariInformasiInteraksiDenganInteraksiUID
} from '../user-utils.js';




export default { deleteImageTemp, deleteVideoTemp };
export { deleteImageTemp, deleteVideoTemp };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////TEMP FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//hapusImageTemp
async function deleteImageTemp(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      user.imageTemp,
      informasiFile.fileUID
    );
    if (cariInformasiFile.status !== true) {
      throw Error("informasiFile tidak ditemukan");
    }
    const datauserdatabase = await readFileJSON(userdatabase);
    user.imageTemp.splice(cariInformasiFile.indexInformasiFile, 1);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusImageTemp fileUID:${informasiFile.fileUID} berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`hapusVideoTemp Error:`, error)
    return {
      status: false,
      message: `hapusImageTemp fileUID:${informasiFile.fileUID}, ${error}`,
    };
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//hapusVideoTemp
async function deleteVideoTemp(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      user.videoTemp,
      informasiFile.fileUID
    );
    if (cariInformasiFile.status !== true) {
      throw Error("informasiFile tidak ditemukan");
    }
    const datauserdatabase = await readFileJSON(userdatabase);
    user.videoTemp.splice(cariInformasiFile.indexInformasiFile, 1);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusVideoTemp fileUID:${informasiFile.fileUID} berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`hapusVideoTemp Error:`, error)
    return {
      status: false,
      message: `hapusVideoTemp fileUID:${informasiFile.fileUID}, ${error}`,
    };
  }
}







const xxx = {
  "filepath": "/storage/emulated/0/nodejs/proyek/stylish-desktop/6-juni-stylish-desktop/database/temp/tmp/t81fbb90vkhx2ujgpmn0r8ifj",
  "newFilename": "apalah",
  "originalFilename": "1000261209.mp4",
  "mimetype": "video/mp4",
  "size": 870417,
  "filetype": "video",
  "ext": ".mp4",
  "UUID": "a976a2f1-c8f4-47ea-8b97-36abc863de41",
  "fileUID": "fileUID-4299193bd827e0b5",
  "newfilepath": "/storage/emulated/0/nodejs/proyek/stylish-desktop/6-juni-stylish-desktop/database/temp/videos/video__fileUID-4299193bd827e0b5__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_20-22-41__.mp4",
  "filebase": "video__fileUID-4299193bd827e0b5__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_20-22-41__.mp4",
  "relativeFilePath": "temp/videos/video__fileUID-4299193bd827e0b5__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_20-22-41__.mp4",
  "tanggal": "06-06-2025_20-22-41",
  "judul": [
    " "
  ],
  "deskripsi": [
    " "
  ],
  "suka": [],
  "simpan": [],
  "bagi": [],
  "laporkan": [],
  "komentar": [],
  "diarsipkan": false,
  "metadata": []
}
xxx.xxx = 'xxx';
async function test() {
  // console.log(await deleteImageTemp(xxx))
  // console.log(await deleteVideoTemp(xxx))
}
test()