import { promisify } from "node:util";

import pkg from 'jsonfile';
const { readFile } = pkg;

const readFileJSON = promisify(readFile);

import { userdatabase } from "../../config.js";
import { hash } from "../../modules/hash.js";

const allowedCharacters =
  ` 1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+:?><,./;[]}{}=-`.split(
    ""
  );
const allowedCharacters1 =
  ` 1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`.split("");

// async function tes() {
//   // console.log(await cariUsername('ilhamdaa'))
//   // console.log(await verifikasiUsernamePasswordData('ilham', 'ilhamudin', { info: true, boolean: false }));
//   // console.log(await cariUserDariUUID('7a36fe9d-96be-44fc-bf3f-3c10a3e3b841', { info: true }))
//   // console.log(await verifikasiUsernamePasswordData('ilham', 'ilhmda', {boolean: false}));
//   // console.log(await verifikasiUsernameHASHPasswordHASHData('d81dd013479ea81c7567f3a084f1ced5d7abc64506c554e00a4ec4183d410072', 'c38dfc68a5127d3ced48f10ed582b71d83b62abfc3bc66674f4304d5bd237062', {boolean: false}));
//   // console.log(await verifikasiUsernamePasswordDataToHASH('ilham', 'ilhamudin', {boolean: false}));
//   // console.log(await verifikasiUsernamePasswordHASHData('ilham', '917757eab2491a80fee4a154ec7f1341f43184ecc9c623909d868e90e53e1a5e'))
//   // console.log(await cariUserDariUUID('7a36fe9d-96be-44fc-bf3f-3c10a3e3b841', { info: false }))
// }

export default {
  verifikasiPasswordString,
  verifikasiUsernameString,
  verifikasiUsernamePasswordString,
  cariUsername,
  verifikasiUsernamePasswordData,
  verifikasiUsernameHASHPasswordHASHData,
  verifikasiUsernamePasswordDataToHASH,
  verifikasiUsernamePasswordHASHData,
  cariUserDariUUID,
  cariUserDariUsername,
};
export {
  verifikasiPasswordString,
  verifikasiUsernameString,
  verifikasiUsernamePasswordString,
  cariUsername,
  verifikasiUsernamePasswordData,
  verifikasiUsernameHASHPasswordHASHData,
  verifikasiUsernamePasswordDataToHASH,
  verifikasiUsernamePasswordHASHData,
  cariUserDariUUID,
  cariUserDariUsername,
};

/// verify usernameString
function verifikasiUsernameString(username = "") {
  try {
    if (username === "") {
      return `username undefined`;
    }
    if (username.length < 4) {
      return `username terlalu pendek, minimal 4 `;
    }
    if (username.length > 17) {
      return `username terlalu panjang, maximal 17 `;
    }
    let disallowedCharacters = username
      .split("")
      .filter((c) => !allowedCharacters1.includes(c));
    if (disallowedCharacters.length) {
      return `username mengandung charakter terlarang [${disallowedCharacters.join(
        ", "
      )}] , username harus hanya huruf dan angka`;
    }
    return true;
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false;
  }
}

/// verify passwordString
function verifikasiPasswordString(password = "") {
  try {
    if (password === "") {
      return `password undefined`;
    }
    if (password.length <= 7) {
      return `password terlalu pendek, minimal 8`;
    }
    if (password.length > 21) {
      return `password terlalu panjang, maximal 20`;
    }
    let disallowedCharacters = password
      .split("")
      .filter((c) => !allowedCharacters.includes(c));
    if (disallowedCharacters.length) {
      return `password mengandung charakter terlarang [${disallowedCharacters.join(
        ", "
      )}]`;
    }
    return true;
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false;
  }
}

//verifikasi username dan password String
function verifikasiUsernamePasswordString(
  username = "",
  password = "",
  options = { boolean: false }
) {
  try {
    const verifikasi = {
      username: verifikasiUsernameString(username),
      password: verifikasiPasswordString(password),
    };
    if (options.boolean) {
      if (verifikasi.username == true && verifikasi.password == true) {
        return true;
      } else {
        return false;
      }
    }
    if (verifikasi.username == true && verifikasi.password == true) {
      verifikasi.status = true;
    } else {
      verifikasi.status = false;
    }
    return verifikasi;
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    if (options.boolean) {
      console.log(`verifikasiUsernamePasswordString error`);
    }
    return false;
  }
}

////////////////////////////////////////////////data
//check username telah ada
async function cariUsername(username = "", options = { info: false }) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase.forEach((user, index) => {
      if (user.username == username) {
        throw {
          ada: true,
          status: true,
          message: `username '${username}' sudah ada`,
          index: index,
          user: user,
        };
      }
    });
    if (options.info) {
      console.log(`username ${username} tidak ada`);
    }
    return {
      ada: false,
      message: `username '${username}' tidak ada`,
      status: false,
    };
  } catch (e) {
    if (options.info) {
      console.log(`username '${username}' sudah ada`);
    }
    return e;
  }
}

//verifikasi data username dan password
async function verifikasiUsernamePasswordData(
  username = "",
  password = "",
  options = { info: false, boolean: true }
) {
  try {
    if (options.info == undefined) {
      options.info = false;
    }
    if (options.boolean == undefined) {
      options.boolean = true;
    }

    //verifikasi string
    const stringVerification = verifikasiUsernamePasswordString(
      username,
      password,
      { boolean: false }
    );
    if (
      stringVerification.username == true &&
      stringVerification.password == true
    ) {
      //jika string benar
      //cari user
      const cariUser = await cariUsername(username);
      if (cariUser.ada == false) {
        const e = { status: false, message: cariUser.message };
        throw e;
      }
      const user = cariUser.user;
      //verifikasi password
      if (user.password == password) {
        if (options.info) {
          console.log(
            `verifikasiUsernamePasswordData: data ${username}-${password} sukses di verifikasi`
          );
        }
        if (options.boolean) {
          return true;
        } else {
          return {
            status: true,
            user: user,
            message: `data ${username}-${password} sukses di verifikasi`,
          };
        }
      } else {
        if (options.info) {
          console.log(
            `verifikasiUsernamePasswordData: data ${username}-${password} gagal di verifikasi`
          );
        }
        if (options.boolean) {
          return false;
        } else {
          return {
            status: false,
            message: `data ${username}-${password} password salah`,
          };
        }
      }
    } else {
      //jika string salah
      const e = {
        status: false,
        username: stringVerification.username,
        password: stringVerification.password,
        stringVerification: stringVerification,
      };
      if (stringVerification.status == false) {
        e.message = (
          stringVerification.username +
          "- " +
          stringVerification.password
        ).replaceAll("true", "");
      } else if (stringVerification.password == true) {
        e.message = stringVerification.username;
      } else {
        e.message = stringVerification.password;
      }
      throw e;
    }
  } catch (e) {
    if (options.info) {
      console.log(`data ${username}-${password} gagal di verifikasi`);
    }
    if (options.boolean) {
      return false;
    } else {
      return e;
    }
  }
}

//cari usernameHASH
async function cariUsernameHash(usernameHASH = "", options = { info: false }) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase.forEach((user, index) => {
      if (user.usernameHASH == usernameHASH) {
        throw {
          ada: true,
          status: true,
          message: `usernameHASH '${usernameHASH}' ada`,
          index: index,
          user: user,
        };
      }
    });
    if (options.info) {
      console.log(`usernameHASH ${usernameHASH} tidak ada`);
    }
    return {
      ada: false,
      message: `usernameHASH '${usernameHASH}' tidak ada`,
      status: false,
    };
  } catch (e) {
    if (options.info) {
      console.log(`usernameHASH '${usernameHASH}' ada`);
    }
    return e;
  }
}

//verifikasi data usernameHASH dan passwordHASH
async function verifikasiUsernameHASHPasswordHASHData(
  usernameHASH = "",
  passwordHASH = "",
  options = { info: false, boolean: true }
) {
  try {
    if (options.info == undefined) {
      options.info = false;
    }
    if (options.boolean == undefined) {
      options.boolean = true;
    }

    //cari user
    const cariUser = await cariUsernameHash(usernameHASH);
    if (cariUser.ada == false) {
      const e = { status: false, message: cariUser.message };
      throw e;
    }
    const user = cariUser.user;
    //verifikasi password
    if (user.passwordHASH == passwordHASH) {
      if (options.info) {
        console.log(
          `verifikasiUsernamePasswordData: data ${usernameHASH}-${passwordHASH} sukses di verifikasi`
        );
      }
      if (options.boolean) {
        return true;
      } else {
        return {
          status: true,
          user,
          message: `data ${usernameHASH}-${passwordHASH} sukses di verifikasi`,
        };
      }
    } else {
      if (options.info) {
        console.log(
          `verifikasiUsernamePasswordData: data ${usernameHASH}-${passwordHASH} gagal di verifikasi`
        );
      }
      if (options.boolean) {
        return false;
      } else {
        return {
          status: false,
          message: `data ${usernameHASH}-${passwordHASH} password salah`,
        };
      }
    }
  } catch (e) {
    if (options.info) {
      console.log(`data ${usernameHASH}-${passwordHASH} gagal di verifikasi`);
    }
    if (options.boolean) {
      return false;
    } else {
      return e;
    }
  }
}

//vverifikasiUsernamePasswordDatatoHASH
async function verifikasiUsernamePasswordDataToHASH(
  username,
  password,
  options = { info: false, boolean: true }
) {
  try {
    if (options.info == undefined) {
      options.info = false;
    }
    if (options.boolean == undefined) {
      options.boolean = true;
    }
    const [usernameHASH, passwordHASH] = [hash(username), hash(password)];
    const hasil = await verifikasiUsernameHASHPasswordHASHData(
      usernameHASH,
      passwordHASH,
      { boolean: options.boolean, info: options.info }
    );
    if (hasil == false || hasil.status == false) {
      if (options.boolean) {
        throw false;
      } else {
        throw {
          status: hasil.status,
          message: `gagal verifikasi hash ${username}-${password}`,
        };
      }
    } else {
      hasil.message = `sukses verifikasi hash ${username}-${password}`;
      return hasil;
    }
  } catch (e) {
    return e;
  }
}

//verifikasiUsernamePasswordHASH
async function verifikasiUsernamePasswordHASHData(
  username = "",
  passwordHASH = "",
  options = { info: false, boolean: true }
) {
  try {
    if (options.info == undefined) {
      options.info = false;
    }
    if (options.boolean == undefined) {
      options.boolean = true;
    }

    //cari user
    const cariUser = await cariUsername(username);
    if (cariUser.ada == false) {
      const e = { status: false, message: cariUser.message };
      throw e;
    }
    const user = cariUser.user;
    //verifikasi password
    if (user.passwordHASH == passwordHASH) {
      if (options.info) {
        console.log(
          `verifikasiUsernamePasswordData: data ${username}-${passwordHASH} sukses di verifikasi`
        );
      }
      if (options.boolean) {
        return true;
      } else {
        return {
          status: true,
          user: user,
          message: `data ${username}-${passwordHASH} sukses di verifikasi`,
        };
      }
    } else {
      if (options.info) {
        console.log(
          `verifikasiUsernamePasswordData: data ${username}-${passwordHASH} gagal di verifikasi`
        );
      }
      if (options.boolean) {
        return false;
      } else {
        return {
          status: false,
          message: `data ${username}-${passwordHASH} passwordHASH salah`,
        };
      }
    }
  } catch (e) {
    if (options.info) {
      console.log(`data ${username}-${passwordHASH} gagal di verifikasi`);
    }
    if (options.boolean) {
      return false;
    } else {
      return e;
    }
  }
}

//cariUserDariUUID
async function cariUserDariUUID(UUID = "", options = { info: false }) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase.forEach((user, index) => {
      if (user.UUID == UUID) {
        user.index = index;
        throw {
          ada: true,
          status: true,
          message: `UUID '${UUID}' ada`,
          index: index,
          user: user,
        };
      }
    });
    if (options.info) {
      console.log(`UUID ${UUID} tidak ada`);
    }
    return { ada: false, message: `UUID '${UUID}' tidak ada`, status: false };
  } catch (e) {
    if (options.info) {
      console.log(`UUID '${UUID}' ada`);
    }
    return e;
  }
}

//cariUserDarUsername
async function cariUserDariUsername(username = "", options = { info: false }) {
  try {
    const datauserdatabase = await readFileJSON(userdatabase);
    datauserdatabase.forEach((user, index) => {
      if (user.username == username) {
        user.index = index;
        throw {
          ada: true,
          status: true,
          message: `username '${username}' ada`,
          index: index,
          user: user,
        };
      }
    });
    if (options.info) {
      console.log(`username ${username} tidak ada`);
    }
    return {
      ada: false,
      message: `username '${username}' tidak ada`,
      status: false,
    };
  } catch (e) {
    if (options.info) {
      console.log(`username '${username}' ada`);
    }
    return e;
  }
}
