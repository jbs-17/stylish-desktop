//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "node:util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);
import { Buffer } from 'node:buffer';
import { randomFillSync, randomUUID } from 'node:crypto';

//  locale
import {
  // cariUsername,
  // verifikasiPasswordString,
  // verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  // verifikasiUsernamePasswordData,
  cariUserDariUUID,
} from "../user/verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
// import { hash } from "../modules/hash.js";
import tanggalString from "../../modules/date-string.mjs";




function cariInformasiFileDenganFileUID(array = [], fileUID = "") {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasiFile;
    let indexInformasiFile;
    array.forEach((a, i) => {
      if (a.fileUID === fileUID) {
        informasiFile = a;
        indexInformasiFile = i;
      }
    });
    if (!informasiFile && !indexInformasiFile) {
      throw false;
    }
    informasiFile.index = indexInformasiFile;
    return {
      status: true,
      indexInformasiFile,
      informasiFile,
      index: indexInformasiFile,
    };
  } catch (error) {
    return { status: false };
  }
}
function cariInformasiFileDenganUserUUID(array = [], userUUID = "") {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasiFile;
    let indexInformasiFile;
    array.forEach((a, i) => {
      if (a.UUID === userUUID) {
        informasiFile = a;
        indexInformasiFile = i;
      }
    });
    if (!informasiFile && !indexInformasiFile) {
      throw false;
    }
    informasiFile.index = indexInformasiFile;
    return {
      status: true,
      indexInformasiFile,
      informasiFile,
      index: indexInformasiFile,
    };
  } catch (error) {
    return { status: false };
  }
}
function cariInformasiInteraksiDenganInteraksiUID(
  array = [],
  interaksiUID = ""
) {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasIInteraksi;
    let indexInformasIInteraksi;
    array.forEach((a, i) => {
      if (a.interaksiUID === interaksiUID) {
        informasIInteraksi = a;
        indexInformasIInteraksi = i;
      }
    });
    if (!informasIInteraksi && !indexInformasIInteraksi) {
      throw false;
    }
    informasIInteraksi.index = indexInformasIInteraksi;
    return {
      status: true,
      indexInformasIInteraksi,
      informasIInteraksi,
      index: indexInformasIInteraksi,
    };
  } catch (error) {
    return { status: false };
  }
}


export {
  cariUserDariUUID, userdatabase, tanggalString,
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  Buffer, randomFillSync, randomUUID
};