//core
import pkg from 'jsonfile';
const { readFile, writeFile } = pkg;

import { promisify } from "node:util";
const readFileJSON = promisify(readFile);
const writeFileJSON = promisify(writeFile);

import { 
  // randomFillSync,
   randomUUID } 
  from "node:crypto";



  //  locale
import {
  cariUsername,
  // verifikasiPasswordString,
  // verifikasiUsernameString,
  verifikasiUsernamePasswordString,
  // verifikasiUsernamePasswordData,
  // cariUserDariUUID,
} from "./verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
import { hash } from "../../modules/hash.js";
import tanggalString from "../../modules/date-string.mjs";




export default newUser;
export {newUser};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//add user
async function newUser(
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
    const { username: usernamev, password: passwordv } =
      verifikasiUsernamePasswordString(username, password, { boolean: false });
    const userSudahAda = await cariUsername(username);
    if (userSudahAda.ada) {
      if (options.info) {
        console.log(`tambahUser: ${userSudahAda.message}`);
      }
      if (options.boolean) {
        throw false;
      } else {
        throw { status: false, message: userSudahAda.message };
      }
    }
    if (usernamev == true && passwordv == true) {
      if (options.info) {
        console.log(
          `tambahUser: sukses menambah {username: ${username}, password: ${password} }`
        );
      }
      const data = await readFileJSON(userdatabase);
      const user = {
        UUID: randomUUID(),
        bergabung: tanggalString(),
        username: username,
        password: password,
        usernameHASH: hash(username),
        passwordHASH: hash(password),
        name: username,
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
        bio: '',
        laporkan: [],
        kelamin: "",
        tempattanggallahir: "",
        pp: "",
        log: [],
        email: "",
        telp: "",
        sembunyikansuka: false,
        sembunyikanikuti: false,
        sembunyikandiikuti: false,
        profilprivat: false,
        daftarblokir: [],
      };
      data.push(user);
      await writeFileJSON(userdatabase, data, { spaces: 2 });
      if (options.boolean) {
        return true;
      } else {
        return {
          status: true,
          message: `tambahUser: sukses menambah {username: ${username}, password: ${password} }`,
          user
        };
      }
    } else {
      throw {
        status: false,
        username: usernamev,
        password: passwordv,
        message: [usernamev, passwordv].join(" - ").replaceAll("true", ""),
      };
    }
  } catch (e) {
    if (options.info) {
      console.log(
        `tambahUser: gagal menambah {username: ${username}, password: ${password} }`
      );
    }
    if (options.boolean) {
      return false;
    } else {
      return e;
    }
  }
}
// console.log(tambahUser('rohi', 'rohicenet', { info: true }))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
