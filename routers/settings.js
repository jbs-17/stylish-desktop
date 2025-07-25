import {
  changeBio,
  changePasswordWithVerification,
  deleteUserWithVerification,
  changeEmail,
  kelaminSetter,
  changePP,
  renameUserWithVerification,
  sembunyikandiikutiToogle,
  sembunyikanikutiToogle,
  sembunyikansukaToogle,
  changeTelp,
  verifikasiUsernamePasswordData
} from '../apis/api-user.js';
import JBS from 'jbs-http-server';
import config from '../config.js';
import formidable from 'formidable';


const settings = JBS.Router();

settings.use((req, res, next) => {
  if (!req.user) {
    return res.redirect('/profile/me');
  }
  next();
})
settings.get('/profile/me/settings', (req, res) => {
  const user = req.user;
  const data = {};
  data.bio = user.bio;
  data.pp = user.pp || '/pp/default.png';
  data.password = hidePassword(user.password);
  data.telp = user.telp;
  data.email = user.email;
  data.kelamin = user.kelamin === 'L' ? `<option value="L">Laki-laki</option><option value="P">Perempuan</option>` : `<option value="P">Perempuan</option><option value="L">Laki-laki</option>`;
  data.sembunyikansuka = user.sembunyikansuka ? 'checked' : '';
  data.sembunyikanikuti = user.sembunyikanikuti ? 'checked' : '';
  data.sembunyikandiikuti = user.sembunyikandiikuti ? 'checked' : '';
  data.profilprivat = user.profilprivat ? 'checked' : '';
  res.render('settings', { data: JSON.stringify(data), ...data });
});


settings.put('/profile/me/settings/change/:option', async (req, res) => {
  const user = req.user;
  const form = formidable({
    maxFileSize: config.maxFileSizePP,
    filename: user.UUID,
    uploadDir: config.uploadsppdatabase
  });
  const { option } = req.params;

  let data = null;
  let files;
  let fields;
  try {
    [fields, files] = await form.parse(req);
  } catch (error) {
    res.statusCode = 500;
    data = { status: false, message: 'internal server error', data: null, error };
  }
  console.log({ fields });
  switch (option) {
    case 'bio':
      data = await changeBio(user.UUID, fields['field-a'][0]);
      break;
    case 'telp':
      data = await changeTelp(user.UUID, fields['field-a'][0]);
      break;
    case 'email':
      data = await changeEmail(user.UUID, fields['field-a'][0]);
      break;
    case 'gender':
      data = await kelaminSetter(user.UUID, fields['field-a'][0]);
      break;
    default:
      data = { status: false, message: 'unkown option', data: null };
      break;
  }
  res.json(data);
})



export default settings;


function hidePassword(password = '') {
  return password.slice(0, 1) + '*'.repeat((password.length - 2)) + password.slice(-1);
}