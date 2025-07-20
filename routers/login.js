import { randomUUID } from "node:crypto";
import JBS from "jbs-http-server";
import { verifikasiUsernamePasswordData } from "../apis/user/verifikasiUsenameDanPassword.js";
import { tambahSesiLoginBaru } from "../admin/sesidatabase.js";
import { lamaSesiLogin } from "../config.js";

const login = JBS.Router();


login.route('/login')
  .post(async (req, res) => {
    try {
      //1 ambil username dan password
      const { username: username, password } = req.body;

      //2. verifikasi
      let { status, message, user } = await verifikasiUsernamePasswordData(
        username.trim(),
        password.trim(),
        { boolean: false }
      );

      //2.a jika status false
      if (!status) {
        res.json({ status: false, message: "login gagal! silahkan cek kembali username dan password!" });
        return;
      }

      //3. buat sesi login 
      const sessionId = randomUUID();
      const infoTambahSesiLoginBaru = await tambahSesiLoginBaru({ sessionId, user });
      if (!infoTambahSesiLoginBaru) {
        res.json({ status: false, message: "Internal server error ;(" });
        return
      }

      //4. jika berhasil 
      res.setHeader(
        `Set-Cookie`,
        // `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${lamaSesiLogin}; Path=/`
        `session_id=${sessionId}; HttpOnly; SameSite=Strict; Max-Age=${lamaSesiLogin}; Path=/`
      );
      res.setHeader('Location', '/profile/me');
      res.json({ status: true, message: "login sukses! silahkan masuk!" });
      return;
    }
    catch (error) {
      console.log(error);
      res.sendStatus(500);
      res.json({ status: false, message: "Internal server error ;(", error: error?.stack });
      return
    }
  })
  .use(JBS.json());


export default login;



