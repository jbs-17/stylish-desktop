//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

import { 
  // randomFillSync,
  //  randomUUID 
  } from "crypto";



  //  locale
import {
  cariUsername,
  // verifikasiPasswordString,
  verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  verifikasiUsernamePasswordData,
  // cariUserDariUUID,
} from "./verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
import { hash } from "../../modules/hash.js";
// import tanggalString from "../../modules/date-string.mjs";






export default { renameUserWithVerification }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//rename user verifikasi
async function renameUserWithVerification(
  username = "",
  newusername = "",
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
      //verifikasi string
      const verifikasiNewUsername = verifikasiUsernameString(newusername);
      if (verifikasiNewUsername != true) {
        throw { status: false, message: verifikasiNewUsername };
      } else {
        const usernameSudahDipakai = await cariUsername(newusername);
        if (usernameSudahDipakai.status == true) {
          throw { status: false, message: usernameSudahDipakai.message };
        } else {
          await renameUserWithUsername(username, newusername);
          if (options.info) {
            console.log(
              `gantiNamaUserVerifikasi: berhasil ganti username dari '${username}' ke '${newusername}'`
            );
          }
          if (options.boolean) {
            return true;
          } else {
            return {
              status: true,
              message: `berhasil ganti username dari '${username}' ke '${newusername}`,
            };
          }
        }
      }
    } else {
      throw verifikasi;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `gantiNamaUserVerifikasi: gagal ganti username dari '${username}' ke '${newusername}' ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}
// console.log(gantiNamaUserVerifikasi('admin', 'adminxxx', 'admin1234'))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//gantiNamaUserPakaiUsername
async function renameUserWithUsername(
  username = "",
  newusername = "",
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
      //verifikasi string
      const verifikasiNewUsername = verifikasiUsernameString(newusername);
      if (verifikasiNewUsername != true) {
        throw { status: false, message: verifikasiNewUsername };
      } else {
        const usernameSudahDipakai = await cariUsername(newusername);
        if (usernameSudahDipakai.status == true) {
          throw { status: false, message: usernameSudahDipakai.message };
        } else {
          if (options.info) {
            console.log(
              `gantiNamaUserPakaiUsername: berhasil ganti username dari '${username}' ke '${newusername}'`
            );
          }
          const data = await readFileJSON(userdatabase);
          const user = userAda.user;
          const index = userAda.index;
          user.username = newusername;
          user.usernameHASH = hash(newusername);
          data[index] = user;
          await writeFileJSON(userdatabase, data, { spaces: 2 });
          if (options.boolean) {
            return true;
          } else {
            return {
              status: true,
              message: `berhasil ganti username dari '${username}' ke '${newusername}'`,
            };
          }
        }
      }
    } else {
      throw userAda;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `gantiNamaUserPakaiUsername: gagal ganti username dari '${username}' ke '${newusername}', ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}
// console.log(gantiNamaUserPakaiUsername('adminxxx', 'admin', {info: false, boolean: false}))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

