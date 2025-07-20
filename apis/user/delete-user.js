//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

// import { 
  // randomFillSync,
  //  randomUUID } from "crypto";



  //  locale
import {
  cariUsername,
  // verifikasiPasswordString,
  // verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  verifikasiUsernamePasswordData,
  // cariUserDariUUID,
} from "./verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
// import { hash } from "./../../modules/hash.js";
// import tanggalString from "../../modules/date-string.mjs";




export default { deleteUserWithVerification, deleteUserWithUsername};
export { deleteUserWithVerification, deleteUserWithUsername }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///hapus user dengan verifikasi
async function deleteUserWithVerification(
  username = "",
  password = "",
  options = { info: false, boolean: true }
) {
  try {
    if (options.boolean == undefined) {
      options.boolean = true;
    }
    if (options.info == undefined) {
      options.info = false;
    }
    const verifikasi = await verifikasiUsernamePasswordData(
      username,
      password,
      {boolean : false}
    );
    if (verifikasi.status == true) {
      await deleteUserWithUsername(username);
      if (options.info) {
        console.log(
          `hapusUserVerifikasi: berhasil mnghapus ${username}-${password}`
        );
      }
      if (options.boolean) {
        return true;
      } else {
        return {
          status: true,
          message: `berhasil mnghapus ${username}-${password}`,
        };
      }
    } else {
      throw verifikasi;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `hapusUserVerifikasi: gagal menghapus ${username}-${password}, ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}

// (async ()=>{console.log(await hapusUserVerifikasi('rohi', 'rohicenet', {info: false, boolean: false}))})()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///hapus user hanya pakai username
async function deleteUserWithUsername(
  username = "",
  options = { info: false, boolean: true }
) {
  try {
    if (options.boolean == undefined) {
      options.boolean = true;
    }
    if (options.info == undefined) {
      options.info = false;
    }
    const userAda = await cariUsername(username);
    if (userAda.status == true) {
      if (options.info) {
        console.log(`hapusUserPakaiUsername: berhasil mnghapus ${username}`);
      }
      const data = await readFileJSON(userdatabase);
      data.splice(userAda.index, 1);
      await writeFileJSON(userdatabase, data, { spaces: 2 });
      if (options.boolean) {
        return true;
      } else {
        return { status: true, message: `berhasil mnghapus ${username}` };
      }
    } else {
      throw userAda;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `hapusUserPakaiUsername: gagal menghapus ${username}, ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}
// console.log(tambahUser('admin', '12345678'))
// console.log(hapusUserVerifikasi('admin', '12345678'))
// (async ()=>{console.log(await hapusUserPakaiUsername('rohi', 'rohicenet', {info: false, boolean: false}))})()
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
