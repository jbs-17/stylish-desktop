//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

// import { 
//   randomFillSync,
//    randomUUID } 
//    from "crypto";



  //  locale
import {
  cariUsername,
  verifikasiPasswordString,
  // verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  verifikasiUsernamePasswordData,
  // cariUserDariUUID,
} from "./verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
import { hash } from "../../modules/hash.js";
// import tanggalString from "../../modules/date-string.mjs";


export default {changePasswordWithVerification, changePasswordWithUsername};
export {changePasswordWithUsername, changePasswordWithVerification};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ganti password verifikasi
async function changePasswordWithVerification(
  username = "",
  password = "",
  newpassword = "",
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
      const verifikasiNewPassword = verifikasiPasswordString(newpassword);
      if (verifikasiNewPassword != true) {
        throw { status: false, message: verifikasiNewPassword };
      } else {
        await changePasswordWithUsername(username, newpassword);
        if (options.info) {
          console.log(
            `gantiPasswordUserVerifikasi: user '${username}' berhasil ganti password dari '${password}' ke '${newpassword}'`
          );
        }
        if (options.boolean) {
          return true;
        } else {
          return {
            status: true,
            message: `user '${username}' berhasil ganti password dari '${password}' ke '${newpassword}`,
          };
        }
      }
    } else {
      throw verifikasi;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `gantiPasswordUserVerifikasi: user ${username} gagal ganti password dari '${password}' ke '${newpassword}' ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}
// console.log(gantiPasswordUserVerifikasi('admin', 'admin1234', '12345678', { info: false, boolean: false }))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//gantiPasswordUserPakaiUsername
async function changePasswordWithUsername(
  username = "",
  newpassword = "",
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
      const verifikasiNewPassword = verifikasiPasswordString(newpassword);
      if (verifikasiNewPassword != true) {
        throw { status: false, message: verifikasiNewPassword };
      } else {
        if (options.info) {
          console.log(
            `gantiPasswordUserPakaiUsername: user '${username}' berhasil ganti password ke '${newpassword}'`
          );
        }
        const data = await readFileJSON(userdatabase);
        const user = userAda.user;
        const index = userAda.index;
        user.password = newpassword;
        user.passwordHASH = hash(newpassword);
        data[index] = user;
        await writeFileJSON(userdatabase, data, { spaces: 2 });
        if (options.boolean) {
          return true;
        } else {
          return {
            status: true,
            message: `user '${username}' berhasil ganti password ke '${newpassword}'`,
          };
        }
      }
    } else {
      throw userAda;
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `gantiPasswordUserPakaiUsername: user '${username}' gagal ganti password ke '${newpassword}' ${e.message}`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return { status: e.status, message: e.message };
    }
  }
}
// console.log(gantiPasswordUserPakaiUsername('admin', '12345678'))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////