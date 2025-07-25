import JBS from 'jbs-http-server';
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
export default settings;


function hidePassword(password = '') {
  return password.slice(0, 1) + '*'.repeat((password.length - 2)) + password.slice(-1);
}