import { promisify } from "node:util";
import { promises as fs } from "node:fs";

import config, {
  templistdatabase,
  imagesdatabase,
  database,
  videosdatabase,
} from "../config.js";
import {
  addImageTemp, addVideoTemp,
} from "../apis/user/temp-file/add-image-video-temp.js";
import { deleteImageTemp, deleteVideoTemp }
  from '../apis/user/temp-file/delete-image-video-temp.js';
import { addImageUser, addVideoUser }
  from '../apis/user/upload-file/add-image-video.js';


import { normalize, relative } from "node:path";
import tanggalString from "../modules/date-string.mjs";
import fsx from "fs-extra";

import pkg from 'jsonfile';
import searchFiles from "jbs-web-server/jbs-search-file-async.js";
const { readFile, writeFile } = pkg;
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

export default {
  tambahImageTempListAndUser,
  tambahVideoTempListAndUser,
  tolakImageTempListAndUserAndFile,
  tolakVideoTempListAndUserAndFile,
  terimaImageTempListAndUserAndFile,
  terimaVideoTempListAndUserAndFile,
};
export {
  tambahImageTempListAndUser,
  tambahVideoTempListAndUser,
  tolakImageTempListAndUserAndFile,
  tolakVideoTempListAndUserAndFile,
  terimaImageTempListAndUserAndFile,
  terimaVideoTempListAndUserAndFile,
};

async function tambahImageTempListAndUser(informasiFile) {
  try {
    const tambahImageTempStatus = await addImageTemp(informasiFile);
    if (tambahImageTempStatus.status === false) {
      throw tambahImageTempStatus.message;
    }
    const datatemplistdatabase = await readFileJSON(templistdatabase);
    datatemplistdatabase.imageTemp.push(informasiFile);
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    return {
      status: true,
      message: `tambahImageTempList fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    return {
      status: false,
      message: `tambahVideoTempList fileUID:${informasiFile.fileUID}  gagal`,
      informasiFile,
      error,
    };
  }
}
async function tambahVideoTempListAndUser(informasiFile) {
  try {
    const tambahVideoTempStatus = await addVideoTemp(informasiFile);
    if (tambahVideoTempStatus.status === false) {
      throw tambahVideoTempStatus.message;
    }
    const datatemplistdatabase = await readFileJSON(templistdatabase);
    datatemplistdatabase.videoTemp.push(informasiFile);
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    return {
      status: true,
      message: `tambahVideoTempList fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    return {
      status: false,
      message: `tambahVideoTempList fileUID:${informasiFile.fileUID}  gagal`,
      informasiFile,
      error,
    };
  }
}
//file
async function tolakImageTempListAndUserAndFile(informasiFile) {
  try {
    const sumber = (await searchFiles(config.publicdb, informasiFile.filebase))[0];
    const hapusFileStatus = await hapusFile(sumber);
    if (!(hapusFileStatus === true)) {
      throw hapusFileStatus;
    }
    const hapusImageTempStatus = await deleteImageTemp(informasiFile);
    if (hapusImageTempStatus.status === false) {
      throw hapusImageTempStatus.message;
    }
    const datatemplistdatabase = await readFileJSON(templistdatabase);
    const length1 = datatemplistdatabase.imageTemp.length;
    datatemplistdatabase.imageTemp = datatemplistdatabase.imageTemp.filter(
      (image) => image.fileUID !== informasiFile.fileUID
    );
    const length2 = datatemplistdatabase.imageTemp.length;
    if (length1 === length2) {
      throw Error("hapusImageTempList gagal");
    }
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusImageTempList fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    return {
      status: false,
      message: `hapusImageTempList fileUID:${informasiFile.fileUID}  gagal err: ${error}`,
      informasiFile,
    };
  }
}
async function tolakVideoTempListAndUserAndFile(informasiFile) {
  try {
    const sumber = (await searchFiles(config.publicdb, informasiFile.filebase))[0];
    const hapusFileStatus = await hapusFile(sumber);
    if (!(hapusFileStatus === true)) {
      throw hapusFileStatus;
    }
    const hapusVideoTempStatus = await deleteVideoTemp(informasiFile);
    if (hapusVideoTempStatus.status === false) {
      throw hapusVideoTempStatus.message;
    }
    const datatemplistdatabase = await readFileJSON(templistdatabase);
    const length1 = datatemplistdatabase.videoTemp.length;
    datatemplistdatabase.videoTemp = datatemplistdatabase.videoTemp.filter(
      (video) => video.fileUID !== informasiFile.fileUID
    );
    const length2 = datatemplistdatabase.videoTemp.length;
    if (length1 === length2) {
      throw Error("hapusVideoTempList gagal");
    }
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    return {
      status: true,
      message: `hapusVideoTempList fileUID:${informasiFile.fileUID}  berhasil`,
      informasiFile,
    };
  } catch (error) {
    return {
      status: false,
      message: `hapusVideoTempList fileUID:${informasiFile.fileUID}  gagal err: ${error}`,
      informasiFile,
    };
  }
}
// untuk menerima
async function terimaImageTempListAndUserAndFile(informasiFile) {
  try {
    const tujuan = normalize(`${imagesdatabase}/${informasiFile.filebase}`);
    const tujuanRelatif = relative(database, tujuan);
    const sumber = (await searchFiles(config.publicdb, informasiFile.filebase))[0];
    informasiFile.newfilepath = tujuan;
    informasiFile.relativeFilePath = tujuanRelatif;
    informasiFile.diterima = tanggalString();
    const pindah = await pindahFile(sumber, tujuan);
    if (!pindah === true) {
      throw Error("Gagal memindahkan file");
    }
    let datatemplistdatabase = await readFileJSON(templistdatabase);
    const length1 = datatemplistdatabase.imageTemp.length;
    datatemplistdatabase.imageTemp = datatemplistdatabase.imageTemp.filter(
      (img) => {
        return img.fileUID !== informasiFile.fileUID;
      }
    );
    const length2 = datatemplistdatabase.imageTemp.length;
    if (length1 === length2) {
      throw Error(
        "terimaImageTempListAndUserAndFile gagal menghapus dari list "
      );
    }
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    const hapus = await deleteImageTemp(informasiFile);
    if (!hapus.status) {
      throw Error(
        "terimaImageTempListAndUserAndFile gagal menghapus dari user "
      );
    }
    const tambah = await addImageUser(informasiFile);
    if (!tambah.status) {
      throw Error(
        "terimaImageTempListAndUserAndFile gagal menghapus dari user "
      );
    }

    return {
      status: true,
      message: `terimaImageTempListAndUserAndFile fileUID:${informasiFile.fileUID}  berhasil`,
    };
  } catch (error) {
    return {
      status: false,
      message: `terimaImageTempListAndUserAndFile fileUID:${informasiFile.fileUID}  gagal err: ${error}`,
    };
  }
}
async function terimaVideoTempListAndUserAndFile(informasiFile) {
  try {
    const tujuan = normalize(`${videosdatabase}/${informasiFile.filebase}`);
    const tujuanRelatif = relative(database, tujuan);
    const sumber = (await searchFiles(config.publicdb, informasiFile.filebase))[0];
    informasiFile.newfilepath = tujuan;
    informasiFile.relativeFilePath = tujuanRelatif;
    informasiFile.diterima = tanggalString();
    const pindah = await pindahFile(sumber, tujuan);
    if (!pindah === true) {
      throw Error("Gagal memindahkan file");
    }
    let datatemplistdatabase = await readFileJSON(templistdatabase);
    const length1 = datatemplistdatabase.videoTemp.length;
    datatemplistdatabase.videoTemp = datatemplistdatabase.videoTemp.filter(
      (img) => {
        return img.fileUID !== informasiFile.fileUID;
      }
    );
    const length2 = datatemplistdatabase.videoTemp.length;
    if (length1 === length2) {
      throw Error(
        "terimaVideoTempListAndUserAndFile gagal menghapus dari list "
      );
    }
    await writeFileJSON(templistdatabase, datatemplistdatabase, { spaces: 2 });
    const hapus = await deleteVideoTemp(informasiFile);
    if (!hapus.status) {
      throw Error(
        "terimaVideoTempListAndUserAndFile gagal menghapus dari user "
      );
    }
    const tambah = await addVideoUser(informasiFile);
    if (!tambah.status) {
      throw Error(
        "terimaVideoTempListAndUserAndFile gagal menghapus dari user "
      );
    }

    return {
      status: true,
      message: `terimaVideoTempListAndUserAndFile fileUID:${informasiFile.fileUID}  berhasil`,
    };
  } catch (error) {
    return {
      status: false,
      message: `terimaVideoTempListAndUserAndFile fileUID:${informasiFile.fileUID}  gagal err: ${error}`,
    };
  }
}

async function hapusFile(path) {
  try {
    await fs.unlink(path);
    return true;
  } catch (error) {
    `${error}`;
    return false;
  }
}
async function pindahFile(sumber, tujuan) {
  try {
    await fsx.copyFile(sumber, tujuan);
    await fsx.unlink(sumber);
    return true;
  } catch (error) {
    `${error}`;
    return false;
  }
}

// eslint-disable-next-line no-unused-vars
async function maina(params) {
  const img = {
    filepath:
      "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\tmp\\r9uvc4faw5ilrsg4zpcr8jllt",
    newFilename: "r9uvc4faw5ilrsg4zpcr8jllt",
    originalFilename: "WhatsApp Video 2024-02-01 at 17.32.49.mp4",
    mimetype: "video/mp4",
    size: 2885683,
    filetype: "video",
    ext: ".mp4",
    UUID: "c3504a16-115d-4824-9e09-a4ec80fd0857",
    fileUID: "fileUID-c589cc822b924714",
    newfilepath:
      "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\videos\\video__fileUID-c589cc822b924714__c3504a16-115d-4824-9e09-a4ec80fd0857__30-05-2025_13-57-32__.mp4",
    filebase:
      "video__fileUID-c589cc822b924714__c3504a16-115d-4824-9e09-a4ec80fd0857__30-05-2025_13-57-32__.mp4",
    relativeFilePath:
      "temp\\videos\\video__fileUID-c589cc822b924714__c3504a16-115d-4824-9e09-a4ec80fd0857__30-05-2025_13-57-32__.mp4",
    tanggal: "30-05-2025_13-57-32",
    judul: ["lorenz"],
    deskripsi: ["oke"],
    suka: [],
    simpan: [],
    bagi: [],
    laporkan: [],
    komentar: [],
    diarsipkan: false,
    metadata: [],
  };
  // console.log(await terimaImageTempListAndUserAndFile(img));
  console.log(await terimaVideoTempListAndUserAndFile(img));
}

// maina()
