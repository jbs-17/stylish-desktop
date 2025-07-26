import {
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
} from '../apis/api-user.js';
import JBS from 'jbs-http-server';
import config from '../config.js';
import formidable from 'formidable';

import fs from 'node:fs/promises';
import path from 'node:path';

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
    [fields, files] = (await form.parse(req));
  } catch (error) {
    res.statusCode = 500;
    data = { status: false, message: 'internal server error', data: null, error };
  }
  const pp = files['field-a'][0];
  const {
    lastModifiedDate,
    filepath,
    newFilename,
    originalFilename,
    mimetype,
    size,
  } = pp;
  let destination;
  try {
    const ext = originalFilename.split('.').pop();
    destination = path.join(config.uploadsppdatabase, `${user.UUID}.${ext}`);
    await fs.copyFile(filepath, destination);
    await fs.unlink(filepath);
  } catch (error) {
    res.statusCode = 500;
    return res.json({status: false, error, message: 'internal server error'});
  }
  destination = path.relative(config.publicdb, destination);
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
    case 'password':
      data = await changePasswordWithVerification(user.username, fields['field-a'][0].trim(), fields['field-b'][0].trim(), { boolean: false });
      break;
    case 'sembunyikanikuti':
      data = await sembunyikanikutiToogle(user.UUID);
      break;
    case 'sembunyikandiikuti':
      data = await sembunyikandiikutiToogle(user.UUID);
      break;
    case 'sembunyikansuka':
      data = await sembunyikansukaToogle(user.UUID);
      break;
    case 'profilprivat':
      data = await profilprivatToogle(user.UUID);
      break;
    case 'pp':
      data = await changePP(user.UUID, destination);
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