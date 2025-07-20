/* eslint-disable no-unused-vars */
import {
  cariUserDariUUID, userdatabase, tanggalString,
  cariInformasiFileDenganFileUID, cariInformasiFileDenganUserUUID, cariInformasiInteraksiDenganInteraksiUID,
  readFileJSON, writeFileJSON,
  Buffer, randomFillSync, randomUUID
} from './a-utils.js';

export { sudahIkuti, ikuti, batalIkuti };

async function sudahIkuti(yangMengikuti, yangDiikuti) {
  try {
    let a = false;
    let b = false;
    const datauserdatabase = await readFileJSON(userdatabase);
    for (let i = 0; i < datauserdatabase.length; i++) {
      if (datauserdatabase[i].UUID === yangMengikuti) {
        a = datauserdatabase[i].ikuti.some(ikut => ikut.UUID === yangDiikuti);
      }
      if (datauserdatabase[i].UUID === yangDiikuti) {
        b = datauserdatabase[i].diikuti.some(pengikut => pengikut.UUID === yangMengikuti);
      }
    }
    return a && b ? { status: true } : { status: false };
  } catch (error) {
    return {
      status: false,
      error
    }
  }
}
async function ikuti(yangMengikuti, yangDiikuti) {
  try {
    if (((await sudahIkuti(yangMengikuti, yangDiikuti)).status)) {
      return { status: false }
    }
    let a = false;
    let b = false;
    const datauserdatabase = await readFileJSON(userdatabase);
    const tanggal = tanggalString();
    for (let i = 0; i < datauserdatabase.length; i++) {
      if (datauserdatabase[i].UUID === yangMengikuti) {
        datauserdatabase[i].ikuti.push({ UUID: yangDiikuti, tanggal, datenow: Date.now() });
        a = true;
      }
      if (datauserdatabase[i].UUID === yangDiikuti) {
        datauserdatabase[i].diikuti.push({ UUID: yangMengikuti, tanggal, datenow: Date.now() });
        b = true;
      }
    }
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 })
    return a && b ? { status: true } : { status: false };
  } catch (error) {
    return {
      status: false,
      error
    }
  }
}
async function batalIkuti(yangMengikuti, yangDiikuti) {
  try {
    if (!(await sudahIkuti(yangMengikuti, yangDiikuti)).status) {
      return { status: false }
    }
    const datauserdatabase = await readFileJSON(userdatabase);
    for (let i = 0; i < datauserdatabase.length; i++) {
      if (datauserdatabase[i].UUID === yangMengikuti) {
        datauserdatabase[i].ikuti = datauserdatabase[i].ikuti.filter(ikut => ikut.UUID !== yangDiikuti);
      }
      if (datauserdatabase[i].UUID === yangDiikuti) {
        datauserdatabase[i].diikuti = datauserdatabase[i].diikuti.filter(diikuti => diikuti.UUID !== yangMengikuti);
      }
    }
    await writeFileJSON(userdatabase, datauserdatabase, { spaces: 2 });
    return { status: true }
  } catch (error) {
    return {
      status: false,
      error
    }
  }
}