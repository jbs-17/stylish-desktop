//core
import pkg from 'jsonfile';
const { readFile } = pkg;

import { promisify } from "node:util";
const readFileJSON = promisify(readFile);


import { userdatabase } from "../../config.js";

async function searchFileInfoTemp(fileUIDx) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    let user;
    let file;
    //loop file
    LOOPdatauserdatabase:
    for (let i = 0; i < datauserdatabase.length; i++) {
      const { UUID, username, name, videoTemp, imageTemp } = datauserdatabase[i];
      user = datauserdatabase[i];
      const temps = [...videoTemp, ...imageTemp];
      //loop tems
      for (let j = 0; j < temps.length; j++) {
        const { fileUID } = temps[j]
        if (fileUID === fileUIDx) {
          file = temps[j];
          break LOOPdatauserdatabase;
        }
      }
    }
    if (!file || !user) {
      throw 'file tidak ada';
    }
    const { UUID, username, name, image, video, komentar, suka, simpan, bagi, ikuti, diikuti, bio, pp } = user;
    const media = { status: true, message: `searchMediaTemp fileUID:${fileUIDx}  sukses`, ...file, user: { UUID, username, name, image, video, komentar, suka, simpan, bagi, ikuti, diikuti, bio, } };
    return media
  } catch (error) {
    return {
      status: false,
      message: `searchMediaTemp fileUID:${fileUIDx}  ERRROR ${error}`,
    };
  }
}

async function searchFileInfoUpload(fileUIDx) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    let user;
    let file;
    //loop file
    LOOPdatauserdatabase:
    for (let i = 0; i < datauserdatabase.length; i++) {
      const { UUID, username, name, video, image } = datauserdatabase[i];
      user = datauserdatabase[i];
      const uploads = [...video, ...image];

      for (let j = 0; j < uploads.length; j++) {
        const { fileUID } = uploads[j]
        if (fileUID === fileUIDx) {
          file = uploads[j];
          break LOOPdatauserdatabase;
        }
      }
    }
    if (!file || !user) {
      throw 'file tidak ada';
    }
    const { UUID, username, name, image, video, komentar, suka, simpan, bagi, ikuti, diikuti, bio, pp } = user;
    const media = { status: true, message: `searchMediaTemp fileUID:${fileUIDx}  sukses`, ...file, user: { UUID, username, name, image, video, komentar, suka, simpan, bagi, ikuti, diikuti, bio, } };
    return media
  } catch (error) {
    return {
      status: false,
      message: `searchMediaTemp fileUID:${fileUIDx}  ERRROR ${error}`,
    };
  }
}





async function searchFileInfoUploadFull(fileUIDx) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    let user;
    let file;
    //loop file
    LOOPdatauserdatabase:
    for (let i = 0; i < datauserdatabase.length; i++) {
      const { UUID, username, name, video, image } = datauserdatabase[i];
      user = datauserdatabase[i];
      const uploads = [...video, ...image];

      for (let j = 0; j < uploads.length; j++) {
        const { fileUID } = uploads[j]
        if (fileUID === fileUIDx) {
          file = uploads[j];
          break LOOPdatauserdatabase;
        }
      }
    }
    if (!file || !user) {
      throw 'file tidak ada';
    }
    const media = { status: true, message: `searchMediaTemp fileUID:${fileUIDx}  sukses`, file, user };
    return media
  } catch (error) {
    return {
      status: false,
      message: `searchMediaTemp fileUID:${fileUIDx}  ERRROR ${error}`,
    };
  }
}



export { searchFileInfoTemp, searchFileInfoUpload, searchFileInfoUploadFull }