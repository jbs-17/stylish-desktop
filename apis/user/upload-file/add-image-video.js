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









export default { addImageUser, addVideoUser };
export { addImageUser, addVideoUser };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function addImageUser(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    user.image.push(informasiFile);
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `tambahImage fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `tambahImage fileUID:${informasiFile.fileUID}  ERRROR ${error}`,
    };
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//tambahVideo
async function addVideoUser(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    user.video.push(informasiFile);
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `tambahVideo fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `tambahVideo fileUID:${informasiFile.fileUID}  ERRROR ${error}`,
    };
  }
}





var xxx = {
  "filepath": "/storage/emulated/0/nodejs/proyek/stylish-desktop/6-juni-stylish-desktop/database/temp/tmp/b77l3gnm0m98156sc42xjjzzs",
  "newFilename": "b77l3gnm0m98156sc42xjjzzs",
  "originalFilename": "whitesetup.jpg",
  "mimetype": "image/jpeg",
  "size": 77334,
  "filetype": "image",
  "ext": ".jpg",
  "UUID": "a976a2f1-c8f4-47ea-8b97-36abc863de41",
  "fileUID": "fileUID-875771d49157aa79z",
  "newfilepath": "/storage/emulated/0/nodejs/proyek/stylish-desktop/6-juni-stylish-desktop/database/temp/images/image__fileUID-875771d49157aa79__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_19-17-19__.jpg",
  "filebase": "image__fileUID-875771d49157aa79__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_19-17-19__.jpg",
  "relativeFilePath": "temp/images/image__fileUID-875771d49157aa79__a976a2f1-c8f4-47ea-8b97-36abc863de41__06-06-2025_19-17-19__.jpg",
  "tanggal": "06-06-2025_19-17-19",
  "judul": [
    "White Setup Elegant and Stylish "
  ],
  "deskripsi": [
    "Who love bright white color?"
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
  // console.log(await addImageUser(xxx))
  // console.log(await addVideoUser(xxx))
}

test()