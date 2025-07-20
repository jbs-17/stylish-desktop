import { uploadsdatabase, userdatabase } from '../../config.js'
import { deleteImageUser, deleteVideoUser } from "../user/upload-file/delete-image-video.js";
import searchFile from '../../modules/search-file-async.js'
import { unlink } from 'node:fs/promises';
import {
  readFileJSON, writeFileJSON,
} from './a-utils.js';

export default { deleteImageUserFile, deleteVideoUserFile };
export { deleteImageUserFile, deleteVideoUserFile };


async function deleteImageUserFile(fileinfo) {
  try {
    const deleteFromUser = await deleteImageUser(fileinfo);
    const deleteFromInteractions = await deleteInteractions(fileinfo);
    const deleteFromDB = await deleteFile(fileinfo.filebase);
    if (deleteFromUser.status && deleteFromInteractions.status && deleteFromDB) {
      return { status: true, message: deleteFromUser.message, fileinfo };
    } else {
      return { status: false, message: `gagal hapusImage fileUID:${fileinfo.fileUID}`, fileinfo }
    }
  } catch (error) {
    return {
      status: false,
      fileinfo,
      message: `gagal hapus fileUID:${fileinfo.fileUID}`,
      error
    }
  }
}

async function deleteVideoUserFile(fileinfo) {
  try {
    const deleteFromUser = await deleteVideoUser(fileinfo);
    const deleteFromInteractions = await deleteInteractions(fileinfo);
    const deleteFromDB = await deleteFile(fileinfo.filebase);
    if (deleteFromUser.status && deleteFromInteractions.status && deleteFromDB) {
      return { status: true, message: deleteFromUser.message, fileinfo };
    } else {
      return { status: false, message: `gagal hapus fileUID:${fileinfo.fileUID}`, fileinfo }
    }
  } catch (error) {
    return {
      status: false,
      fileinfo,
      message: `gagal hapus fileUID:${fileinfo.fileUID}`,
      error
    }
  }
}

async function deleteFile(filebase) {
  try {
    const path = await searchFile(uploadsdatabase, filebase, ['archive']);
    await unlink(path[0]);
    return true
  } catch {
    return false;
  }
}

async function deleteInteractions(fileinfo) {
  try {
    const { suka, simpan, komentar, bagi, laporkan } = fileinfo;
    const interaksi = [...suka, ...simpan, ...komentar, ...bagi, ...laporkan];
    const datauserdatabase = await readFileJSON(userdatabase);
    for (let i = 0; i < datauserdatabase.length; i++) { //loop i
      const user = datauserdatabase[i];
      //jika fileinfo milik user skip
      if (user.UUID === fileinfo.UUID) {
        continue;
      }

      for (let j = 0; j < interaksi.length; j++) { //loop j
        const interaksiUID = interaksi[j].interaksiUID;
        //loop sukaU
        for (let k = 0; k < user.suka.length; k++) {
          if (interaksiUID === user.suka[k].interaksiUID) {
            user.suka.splice(k, 1);
          }
        }
        //loop simpanU
        for (let k = 0; k < user.simpan.length; k++) {
          if (interaksiUID === user.simpan[k].interaksiUID) {
            user.simpan.splice(k, 1);
          }
        }
        //loop komentarU
        for (let k = 0; k < user.komentar.length; k++) {
          if (interaksiUID === user.komentar[k].interaksiUID) {
            user.komentar.splice(k, 1);
          }
        }
        //loop bagiU
        for (let k = 0; k < user.bagi.length; k++) {
          if (interaksiUID === user.bagi[k].interaksiUID) {
            user.bagi.splice(k, 1);
          }
        }
        //loop laporanU
        for (let k = 0; k < user.laporkan.length; k++) {
          if (interaksiUID === user.laporkan[k].interaksiUID) {
            user.laporkan.splice(k, 1);
          }
        }
      } //loop j
      //timpa user
      datauserdatabase[i] = user;
    } //loop i
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return { status: true, message: 'berhasil hapus interaksi terkait' };
  } catch (error) {
    return { status: false, message: 'gagal menghapus interaksi terkait', error };
  }
}


// const xxx = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\najfvrx7m3ml6gwpfcd8icoh5",
//   "newFilename": "najfvrx7m3ml6gwpfcd8icoh5",
//   "originalFilename": "papanhitam.png",
//   "mimetype": "image/png",
//   "size": 49045,
//   "filetype": "image",
//   "ext": ".png",
//   "UUID": "df290ecb-a245-4657-9dcb-bbb7e4ca29b9",
//   "fileUID": "fileUID-d23dd29cdcfc4cdb",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-d23dd29cdcfc4cdb__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-21-12__.png",
//   "filebase": "image__fileUID-d23dd29cdcfc4cdb__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-21-12__.png",
//   "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-d23dd29cdcfc4cdb__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-21-12__.png",
//   "tanggal": "08-07-2025_09-21-12",
//   "judul": [
//     "MATH"
//   ],
//   "deskripsi": [
//     "is super language"
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "08-07-2025_09-23-10"
// }
// const yyy = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\ogkaeql0v4mop3tqhbi2a69ok",
//   "newFilename": "ogkaeql0v4mop3tqhbi2a69ok",
//   "originalFilename": "WhatsApp Video 2024-02-01 at 17.32.49.mp4",
//   "mimetype": "video/mp4",
//   "size": 2885683,
//   "filetype": "video",
//   "ext": ".mp4",
//   "UUID": "df290ecb-a245-4657-9dcb-bbb7e4ca29b9",
//   "fileUID": "fileUID-84c24ab2c7db3cd7",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\videos\\video__fileUID-84c24ab2c7db3cd7__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-51-37__.mp4",
//   "filebase": "video__fileUID-84c24ab2c7db3cd7__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-51-37__.mp4",
//   "relativeFilePath": "..\\public\\upload\\videos\\video__fileUID-84c24ab2c7db3cd7__df290ecb-a245-4657-9dcb-bbb7e4ca29b9__08-07-2025_09-51-37__.mp4",
//   "tanggal": "08-07-2025_09-51-37",
//   "judul": [
//     "EKSPERIMEN GAYA LORENZ"
//   ],
//   "deskripsi": [
//     "KEREN"
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "08-07-2025_09-52-06"
// }
// console.log(await deleteImageUserFile(xxx));
// console.log(await deleteVideoUserFile(yyy));