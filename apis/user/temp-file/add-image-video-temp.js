//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "node:util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

// import { 
// randomFillSync,
//  randomUUID } 
//  from "crypto";



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














export default { addImageTemp, addVideoTemp };
export { addImageTemp, addVideoTemp };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////TEMP FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//tambahImageTemp
async function addImageTemp(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    user.imageTemp.push(informasiFile);
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `tambahImageTemp fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `tambahImageTemp fileUID:${informasiFile.fileUID}  ERRROR ${error}`,
    };
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//tambahVideoTemp
async function addVideoTemp(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
      user.videoTemp.push(informasiFile);
      const datauserdatabase = await readFileJSON(userdatabase);
      datauserdatabase[cariuser.index] = user;
      await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
      return {
        status: true,
        message: `tambahVideoTemp fileUID:${informasiFile.fileUID}  berhasil`,
        informasiFile,
      };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `tambahVideoTemp fileUID:${informasiFile.fileUID}  ERRROR ${error}`,
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
  // console.log(await addImageTemp(xxx))
  // console.log(await addVideoTemp(xxx))
}
test()