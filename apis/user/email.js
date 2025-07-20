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
  // eslint-disable-next-line no-unused-vars
  cariUsername,
  // verifikasiPasswordString,
  // eslint-disable-next-line no-unused-vars
  verifikasiUsernameString,
  // verifikasiUsernamePasswordString,
  // eslint-disable-next-line no-unused-vars
  verifikasiUsernamePasswordData,
  cariUserDariUUID,
} from "./verifikasiUsenameDanPassword.js";
import { userdatabase } from "../../config.js";
// eslint-disable-next-line no-unused-vars
import { hash } from "../../modules/hash.js";
import isEmail from 'validator/lib/isEmail.js';
// import tanggalString from "../../modules/date-string.mjs";






export default { changeEmail }
export { changeEmail }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//rename user verifikasi
// console.log(gantiNamaUserVerifikasi('admin', 'adminxxx', 'admin1234'))
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//gantiNamaUserPakaiUsername
async function changeEmail(UUID = "", email = '') {
  try {
    if (!isEmail(email)) { throw Error('invalid email!') };
    const user = (await cariUserDariUUID(UUID)).user;
    const database = await readFileJSON(userdatabase);
    if (!user) { throw Error('user tidak ada!') };
    user.email = email;
    database[user.index] = user;
    await writeFileJSON(userdatabase, database, { spaces: 2 })
    return { status: true, message: "sukses ganti email" }
  } catch (error) {
    return { status: false, message: "gagal ganti email", error }
  }
}

async function main() {
  try {
    console.log(await changeEmail('7838a342-05b1-447a-8c5d-5ec109461067', 'apalah@gmail.com'));
  } catch (error) {
    console.log(error);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

