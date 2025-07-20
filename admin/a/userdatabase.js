//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;
import { Buffer } from 'buffer';


import { promisify } from "node:util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

import {
  randomFillSync,
  randomUUID
}
  from "node:crypto";



//  locale
import {
  // cariUsername,
  // verifikasiPasswordString,
  // verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  // verifikasiUsernamePasswordData,
  cariUserDariUUID,
} from "../apis/user/verifikasiUsenameDanPassword.js";
import { userdatabase } from "../config.js";
// import { hash } from "../modules/hash.js";
import tanggalString from "../modules/date-string.mjs";

export default {
  // tambahUser,
  // hapusUserPakaiUsername,
  // hapusUserVerifikasi,
  // gantiNamaUserPakaiUsername,
  // gantiNamaUserVerifikasi,
  // gantiPasswordUserPakaiUsername,
  // gantiPasswordUserVerifikasi,
  // tambahImageTemp,
  // hapusImageTemp,
  // tambahVideoTemp,
  // hapusVideoTemp,
  // tambahImage,
  // tambahVideo,
  // hapusImage,
  // hapusVideo,
};
export {
  // tambahUser,
  // hapusUserPakaiUsername,
  // hapusUserVerifikasi,
  // gantiNamaUserPakaiUsername,
  // gantiNamaUserVerifikasi,
  // gantiPasswordUserPakaiUsername,
  // gantiPasswordUserVerifikasi,
  // tambahImageTemp,
  // hapusImageTemp,
  // tambahVideoTemp,
  // hapusVideoTemp,
  // tambahImage,
  // tambahVideo,
  // hapusImage,
  // hapusVideo,
};

// async function tes1() { console.log(await tambahUser('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await hapusUserPakaiUsername('admin', { boolean: false }))}
// async function tes1() { console.log(await hapusUserPakaiUsername('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiNamaUserVerifikasi('adminhebat', 'admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiPasswordUserPakaiUsername('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiPasswordUserVerifikasi('admina', 'admin1234', 'admin1234', { boolean: false }))}
// tes1()











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES IMAGES
///
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
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyukai.UUID,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
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
}
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
///
async function simpanImage(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMenyimpan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const simpan of informasiFile.simpan) {
      if (simpan.UUID === userYangMenyimpan.UUID) {
        throw Error("sudah disimpan!");
      }
    }
    //manipulasi simpan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMenyimpan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyimpan.UUID,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
    };
    userYangMenyimpan.simpan.push(informasiUntukuserYangMenyimpan); //userYangMenyimpan array simpannya dipush uid file yg disimpani;
    informasiFile.simpan.push(informasiUntukUserInformasiFile); //informasi file array simpannya di push UUID userYangMenyimpan
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `simpanImage: SUKSES UUID:${userYangMenyimpan?.UUID} menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `simpanImage: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalSimpanImage(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
      cariuserYangMenyimpan.status === true
    ) {
      try {
        const cariInteraksiSimpanPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.simpan,
          userYangMenyimpan.UUID
        );
        if (cariInteraksiSimpanPadaFile.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        const cariInteraksiSimpanPadauserYangMenyimpan =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyimpan.simpan,
            cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSimpanPadauserYangMenyimpan.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        informasiFile.simpan.splice(cariInteraksiSimpanPadaFile.index, 1);
        userYangMenyimpan.simpan.splice(
          cariInteraksiSimpanPadauserYangMenyimpan.index,
          1
        );

        userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID,
          message: `batalSimpanImage: SUKSES UUID:${userYangMenyimpan?.UUID} membatalkan simpan fileUID:${informasiFile?.fileUID}`,
          userYangMenyimpan: userYangMenyimpan?.UUID,
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
      message: `batalSimpanImage: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal batal simpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
async function bagiImage(userYangMembagi, informasiFile) {
  try {
    //pencarian
    const cariuserYangMembagi = await cariUserDariUUID(userYangMembagi.UUID);
    userYangMembagi = cariuserYangMembagi.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMembagi.status) {
      throw Error("user gagal ditemukan");
    }
    for (const bagi of informasiFile.bagi) {
      if (bagi.UUID === userYangMembagi.UUID) {
        throw Error("sudah dibagi!");
      }
    }
    //manipulasi bagi
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMembagi = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMembagi.UUID,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
    };
    userYangMembagi.bagi.push(informasiUntukuserYangMembagi); //userYangMembagi array baginya dipush uid file yg dibagii;
    informasiFile.bagi.push(informasiUntukUserInformasiFile); //informasi file array baginya di push UUID userYangMembagi
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMembagi.index] = userYangMembagi;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `bagiImage: SUKSES UUID:${userYangMembagi?.UUID} membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `bagiImage: ERRROR ${error} UUID:${userYangMembagi?.UUID} gagal membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
async function laporkanImage(userYangMelaporkan, informasiFile, laporan = "") {
  try {
    if (!laporan.length) {
      throw Error("Laporan tidak valdi!");
    }
    //pencarian
    const cariuserYangMelaporkan = await cariUserDariUUID(
      userYangMelaporkan.UUID
    );
    userYangMelaporkan = cariuserYangMelaporkan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMelaporkan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const laporkan of informasiFile.laporkan) {
      if (laporkan.UUID === userYangMelaporkan.UUID) {
        throw Error("sudah dilaporkan!");
      }
    }
    //manipulasi laporkan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMelaporkan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMelaporkan.UUID,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
    };
    userYangMelaporkan.laporkan.push(informasiUntukuserYangMelaporkan); //userYangMelaporkan array laporkannya dipush uid file yg dilaporkani;
    informasiFile.laporkan.push(informasiUntukUserInformasiFile); //informasi file array laporkannya di push UUID userYangMelaporkan
    userInformasiFile.image[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMelaporkan.index] = userYangMelaporkan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `laporkanImage: SUKSES UUID:${userYangMelaporkan?.UUID} melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahImageTemp Error:`, error)
    return {
      status: false,
      message: `laporkanImage: ERRROR ${error} UUID:${userYangMelaporkan?.UUID} gagal melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
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
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangKomentar.UUID,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES VIDEO
///
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
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyukai.UUID,
      tanggal: tanggalString(),
      userYangMenyukai: userYangMenyukai?.UUID,
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
///
async function simpanVideo(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMenyimpan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const simpan of informasiFile.simpan) {
      if (simpan.UUID === userYangMenyimpan.UUID) {
        throw Error("sudah disimpan!");
      }
    }
    //manipulasi simpan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMenyimpan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMenyimpan.UUID,
      tanggal: tanggalString(),
      userYangMenyimpan: userYangMenyimpan?.UUID,
    };
    userYangMenyimpan.simpan.push(informasiUntukuserYangMenyimpan); //userYangMenyimpan array simpannya dipush uid file yg disimpani;
    informasiFile.simpan.push(informasiUntukUserInformasiFile); //informasi file array simpannya di push UUID userYangMenyimpan
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `simpanVideo: SUKSES UUID:${userYangMenyimpan?.UUID} menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `simpanVideo: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal menyimpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
async function batalSimpanVideo(userYangMenyimpan, informasiFile) {
  try {
    //pencarian
    const cariuserYangMenyimpan = await cariUserDariUUID(
      userYangMenyimpan.UUID
    );
    userYangMenyimpan = cariuserYangMenyimpan.user;
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
      cariuserYangMenyimpan.status === true
    ) {
      try {
        const cariInteraksiSimpanPadaFile = cariInformasiFileDenganUserUUID(
          informasiFile.simpan,
          userYangMenyimpan.UUID
        );
        if (cariInteraksiSimpanPadaFile.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        const cariInteraksiSimpanPadauserYangMenyimpan =
          cariInformasiInteraksiDenganInteraksiUID(
            userYangMenyimpan.simpan,
            cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID
          );
        if (cariInteraksiSimpanPadauserYangMenyimpan.status === false) {
          throw Error("gagal mencari interaksi simpan");
        }
        informasiFile.simpan.splice(cariInteraksiSimpanPadaFile.index, 1);
        userYangMenyimpan.simpan.splice(
          cariInteraksiSimpanPadauserYangMenyimpan.index,
          1
        );

        userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
        //manipulasi database utama
        const datauserdatabase = await readFileJSON(userdatabase);
        datauserdatabase[userInformasiFile.index] = userInformasiFile;
        datauserdatabase[userYangMenyimpan.index] = userYangMenyimpan;
        ///
        await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
        return {
          status: true,
          interaksiUID: cariInteraksiSimpanPadaFile?.informasiFile.interaksiUID,
          message: `batalSimpanVideo: SUKSES UUID:${userYangMenyimpan?.UUID} membatalkan simpan fileUID:${informasiFile?.fileUID}`,
          userYangMenyimpan: userYangMenyimpan?.UUID,
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
      message: `batalSimpanVideo: ERRROR ${error} UUID:${userYangMenyimpan?.UUID} gagal batal simpan fileUID:${informasiFile?.fileUID}`,
      userYangMenyimpan: userYangMenyimpan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
async function bagiVideo(userYangMembagi, informasiFile) {
  try {
    //pencarian
    const cariuserYangMembagi = await cariUserDariUUID(userYangMembagi.UUID);
    userYangMembagi = cariuserYangMembagi.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMembagi.status) {
      throw Error("user gagal ditemukan");
    }
    for (const bagi of informasiFile.bagi) {
      if (bagi.UUID === userYangMembagi.UUID) {
        throw Error("sudah dibagi!");
      }
    }
    //manipulasi bagi
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMembagi = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMembagi.UUID,
      tanggal: tanggalString(),
      userYangMembagi: userYangMembagi?.UUID,
    };
    userYangMembagi.bagi.push(informasiUntukuserYangMembagi); //userYangMembagi array baginya dipush uid file yg dibagii;
    informasiFile.bagi.push(informasiUntukUserInformasiFile); //informasi file array baginya di push UUID userYangMembagi
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMembagi.index] = userYangMembagi;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `bagiVideo: SUKSES UUID:${userYangMembagi?.UUID} membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `bagiVideo: ERRROR ${error} UUID:${userYangMembagi?.UUID} gagal membagikan fileUID:${informasiFile?.fileUID}`,
      userYangMembagi: userYangMembagi?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
async function laporkanVideo(userYangMelaporkan, informasiFile, laporan = "") {
  try {
    if (!laporan.length) {
      throw Error("Laporan tidak valdi!");
    }
    //pencarian
    const cariuserYangMelaporkan = await cariUserDariUUID(
      userYangMelaporkan.UUID
    );
    userYangMelaporkan = cariuserYangMelaporkan.user;
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
    if (!cariUserInformasiFile.status && !cariuserYangMelaporkan.status) {
      throw Error("user gagal ditemukan");
    }
    for (const laporkan of informasiFile.laporkan) {
      if (laporkan.UUID === userYangMelaporkan.UUID) {
        throw Error("sudah dilaporkan!");
      }
    }
    //manipulasi laporkan
    const interaksiUID = `interaksiUID-${randomFillSync(
      Buffer.alloc(8),
      0
    ).toString("hex")}`;
    const informasiUntukuserYangMelaporkan = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userInformasiFile.UUID,
      relativeFilePath: informasiFile.relativeFilePath,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangMelaporkan.UUID,
      tanggal: tanggalString(),
      userYangMelaporkan: userYangMelaporkan?.UUID,
      laporan,
    };
    userYangMelaporkan.laporkan.push(informasiUntukuserYangMelaporkan); //userYangMelaporkan array laporkannya dipush uid file yg dilaporkani;
    informasiFile.laporkan.push(informasiUntukUserInformasiFile); //informasi file array laporkannya di push UUID userYangMelaporkan
    userInformasiFile.video[informasiFile.index] = informasiFile; //timpa informasiFile lama userInformasiFile
    //manipulasi database utama
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase[userInformasiFile.index] = userInformasiFile;
    datauserdatabase[userYangMelaporkan.index] = userYangMelaporkan;
    ///
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return {
      status: true,
      interaksiUID,
      message: `laporkanVideo: SUKSES UUID:${userYangMelaporkan?.UUID} melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  } catch (error) {
    // console.log(`tambahVideoTemp Error:`, error)
    return {
      status: false,
      message: `laporkanVideo: ERRROR ${error} UUID:${userYangMelaporkan?.UUID} gagal melaporkan fileUID:${informasiFile?.fileUID}`,
      userYangMelaporkan: userYangMelaporkan?.UUID,
      fileUID: informasiFile?.fileUID,
    };
  }
}
///
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
    };
    const informasiUntukUserInformasiFile = {
      interaksiUID,
      fileUID: informasiFile.fileUID,
      filebase: informasiFile.filebase,
      UUID: userYangKomentar.UUID,
      tanggal: tanggalString(),
      userYangKomentar: userYangKomentar?.UUID,
      komentar,
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

const x = {
  filepath:
    "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\tmp\\o14zco2xlvbcrva2ihaga0rq4",
  newFilename: "o14zco2xlvbcrva2ihaga0rq4",
  originalFilename:
    "Record_2024-10-27-16-24-16_998d3425f9e75a0428f0fabdce419960.mp4",
  mimetype: "video/mp4",
  size: 45426475,
  filetype: "video",
  ext: ".mp4",
  UUID: "f6d2d67f-4ca2-49ab-a40e-14f457fb2c76",
  fileUID: "fileUID-d4cb9380ac152f14",
  newfilepath:
    "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\videos\\video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
  filebase:
    "video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
  relativeFilePath:
    "temp\\videos\\video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
  tanggal: "28-05-2025_22-08-42",
  judul: ["FF"],
  deskripsi: ["free fire"],
  suka: [],
  simpan: [],
  bagi: [],
  laporkan: [],
  komentar: [],
  diarsipkan: false,
  metadata: [],
};

const u = [
  {
    UUID: "3960a68b-b3f6-4b8c-a4c4-1999f988c855",
    username: "kodrato",
    password: "password",
    usernameHASH:
      "a7d934b5df2627a2ed86575726aa4261ab583400ed2d84a6380cfd02f7790ee9",
    passwordHASH:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    name: "kodrato",
    imageTemp: [],
    videoTemp: [],
    image: [],
    video: [],
    komentar: [],
    suka: [],
    simpan: [],
    bagi: [],
    ikuti: [],
    diikuti: [],
    settings: {},
    arsip: [],
    bio: [],
    laporkan: [],
    kelamin: "",
    tempattanggallahir: "",
    pp: "",
    log: [],
    email: "",
    telp: "",
  },
  {
    UUID: "ddb3d180-da45-448b-8025-86d7a43c6c1d",
    username: "majiw",
    password: "password",
    usernameHASH:
      "bcbaa9af32deeb2a58f405d01302b111e4ac1a7c71262d520b092a6c36c07cae",
    passwordHASH:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    name: "majiw",
    imageTemp: [],
    videoTemp: [],
    image: [],
    video: [],
    komentar: [],
    suka: [],
    simpan: [],
    bagi: [],
    ikuti: [],
    diikuti: [],
    settings: {},
    arsip: [],
    bio: [],
    laporkan: [],
    kelamin: "",
    tempattanggallahir: "",
    pp: "",
    log: [],
    email: "",
    telp: "",
    index: 6,
  },
  {
    UUID: "b1189b54-3810-4935-abd3-4048b9ee6b97",
    username: "njsae",
    password: "password",
    usernameHASH:
      "87295cc2000ed7830b19bcb75cf81b7bc3a4e60474104ac72529194eb0080b74",
    passwordHASH:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    name: "njsae",
    imageTemp: [],
    videoTemp: [],
    image: [],
    video: [],
    komentar: [],
    suka: [],
    simpan: [],
    bagi: [],
    ikuti: [],
    diikuti: [],
    settings: {},
    arsip: [],
    bio: [],
    laporkan: [],
    kelamin: "",
    tempattanggallahir: "",
    pp: "",
    log: [],
    email: "",
    telp: "",
  },
];
async function name() {
  // console.log(await tambahImageTemp(a));
  // console.log(await tambahVideoTemp(a));
  // console.log(await hapusVideoTemp(a));
  // console.log(await hapusImageTemp(a));
  // console.log(await tambahImage(a));
  // console.log(await tambahVideo(a));
  // console.log(await hapusImage(a));
  // console.log(await hapusVideo(a));
  // console.log(await sukaImage(u, a));
  // setTimeout(async()=>{console.log(await batalSukaImage(u, a));}, 3000)
  // console.log(await batalSimpanImage(u, a));
  // console.log(await bagiImage(u, a));
  // console.log(await komentarImage(u, a, 'komen'));
  // console.log(await batalKomentarImage(u, a, 'komen'));
  //
  // console.log(await sukaVideo(u, x))
  // console.log(await batalSukaVideo(u, x))
  // console.log(await simpanVideo(u[0], x))
  // console.log(await simpanVideo(u[1], x))
  // console.log(await simpanVideo(u[2], x))
  // console.log(await batalSimpanVideo(u[2], x))
  // console.log(await bagiVideo(u[0], x));
  // console.log(await laporkanVideo(u[0], x, 'ku laporin kamu'));
  // console.log(await komentarVideo(u[2], x, 'anjay'));
  // console.log(await komentarVideo(u[1], x, 'keren'));
  // console.log(await komentarVideo(u[0], x, 'widih'));\
  // console.log(await batalKomentarVideo(u[2], x, 'anjay'));
  // // console.log(await batalKomentarVideo(u[1], x, 'keren'));
  // console.log(await batalKomentarVideo(u[0], x, 'widih'));
}
name();
// console.log('end')

// let tes = Buffer.alloc(100000000);
// tes = randomFillSync(tes)
// console.log(tes.toString('hex'))


