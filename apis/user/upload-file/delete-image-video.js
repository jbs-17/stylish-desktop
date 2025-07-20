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
} from '../user-utils.js'



export default { deleteImageUser, deleteVideoUser };
export { deleteImageUser, deleteVideoUser };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//hapusImage
async function deleteImageUser(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      user.image,
      informasiFile.fileUID
    );
    if (cariInformasiFile.status !== true) {
      throw Error("informasiFile tidak ditemukan");
    }
    const datauserdatabase = await readFileJSON(userdatabase);
    user.image.splice(cariInformasiFile.indexInformasiFile, 1);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusImage fileUID:${informasiFile.fileUID} berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`hapusImage Error:`, error)
    return {
      status: false,
      message: `hapusImage fileUID:${informasiFile.fileUID}, ${error}`,
    };
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//hapusVideo
async function deleteVideoUser(informasiFile) {
  try {
    const cariuser = await cariUserDariUUID(informasiFile.UUID);
    const user = cariuser.user;
    if (!cariuser.status) {
      throw Error("User tidak ditemukan");
    }
    const cariInformasiFile = cariInformasiFileDenganFileUID(
      user.video,
      informasiFile.fileUID
    );
    if (cariInformasiFile.status !== true) {
      throw Error("informasiFile tidak ditemukan");
    }
    const datauserdatabase = await readFileJSON(userdatabase);
    user.video.splice(cariInformasiFile.indexInformasiFile, 1);
    datauserdatabase[cariuser.index] = user;
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusVideo fileUID:${informasiFile.fileUID} berhasil`,
      informasiFile,
    };
  } catch (error) {
    // console.log(`hapusVideoTemp Error:`, error)
    return {
      status: false,
      message: `hapusVideo fileUID:${informasiFile.fileUID}, ${error}`,
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
  // console.log(await deleteImageUser(xxx))
  // console.log(await deleteVideoUser(xxx))
}

test()