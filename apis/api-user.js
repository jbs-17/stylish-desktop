import { changeBio } from "./user/bio.js";
import { changePasswordWithVerification } from './user/change-password-user.js';
import { deleteUserWithVerification } from './user/delete-user.js'
import { changeEmail } from './user/email.js';
import { kelaminSetter } from './user/kelamin.js';
import { changePP } from './user/pp.js';
import { profilprivatToogle } from "./user/profile-privat.js";
import { renameUserWithVerification } from './user/rename-user.js';
import { sembunyikandiikutiToogle } from './user/sembunyikandiikuti.js';
import { sembunyikanikutiToogle } from "./user/sembunyikanikuti.js";
import { sembunyikansukaToogle } from "./user/sembunyikansuka.js";
import { changeTelp } from "./user/telp.js";
import { verifikasiUsernamePasswordData } from "./user/verifikasiUsenameDanPassword.js";

const api_user = {
  changeBio,
  changePasswordWithVerification,
  deleteUserWithVerification,
  changeEmail,
  kelaminSetter,
  changePP,
  profilprivatToogle,
  renameUserWithVerification,
  sembunyikandiikutiToogle,
  sembunyikanikutiToogle,
  sembunyikansukaToogle,
  changeTelp,
  verifikasiUsernamePasswordData
}


export default api_user;
export {
  changeBio,
  changePasswordWithVerification,
  deleteUserWithVerification,
  changeEmail,
  kelaminSetter,
  changePP,
  profilprivatToogle,
  renameUserWithVerification,
  sembunyikandiikutiToogle,
  sembunyikanikutiToogle,
  sembunyikansukaToogle,
  changeTelp,
  verifikasiUsernamePasswordData
}