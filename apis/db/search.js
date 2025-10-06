import { promisify } from "node:util";
import jsonfile from "jsonfile";
import { userdatabase, admins } from "../../config.js";

const readFileJSON = promisify(jsonfile.readFile);
async function readUserDatabase() {
  try {
    return (await readFileJSON(userdatabase)).filter((user) => {
      return !admins.some((admin) => admin === user.username);
    });
  } catch {
    return [];
  }
}
export async function searchUser(username = " ") {
  return (await readUserDatabase()).filter((user) => {
    return includes(user.username, username);
  });
}

export async function searchUserUpload(clue = "") {
  const hasil = [];
  for (const user of await readUserDatabase()) {
    const { image, video } = user;
    [...image, ...video].forEach(up => {
      if(includes(up.judul[0], clue)) return hasil.unshift({...up, user});
      if(includes(up.deskripsi[0], clue)) hasil.push({...up, user});
    })
  }

  return hasil;
}






function includes(str = '', what = ''){
  return str.toLowerCase().includes(what.toLowerCase());
}