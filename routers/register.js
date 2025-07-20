import { randomUUID } from "node:crypto";
import JBS from "jbs-http-server";
import { lamaSesiLogin } from "../config.js";
import { tambahSesiLoginBaru } from "../admin/sesidatabase.js";
import newUser from "../apis/user/add-new-user.js";

const register = JBS.Router();


register.route('/register')
  .post(async (req, res) => {
    try {
      //1 ambil username dan password
      const { username: username, password } = req.body;

      //2. coba addnewuser
      const { status, user, message } = await newUser(username.trim(), password.trim(), {
        boolean: false,
        info: false
      });

      if (!status) {
        res.json({ status: false, message: message });
        return;
      }

      //3. jika berhasil buat sesi login 
      const sessionId = randomUUID();
      const infoTambahSesiLoginBaru = await tambahSesiLoginBaru({ sessionId, user });
      if (!infoTambahSesiLoginBaru) {
        res.json({ status: false, message: "Internal server error ;(" });
        return
      }

      //4. jika berhasil kirim
      res.setHeader(
        `Set-Cookie`,
        // `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${lamaSesiLogin}; Path=/`
        `session_id=${sessionId}; HttpOnly; SameSite=Strict; Max-Age=${lamaSesiLogin}; Path=/`
      );
      res.setHeader('Location', '/profile/me');
      res.json({ status: true, message: "registrasi sukses! selamat bergabung!" });
      return;
    }
    catch (error) {
      console.log('error', error);
      res.sendStatus(500);
      res.json({ status: false, message: "Internal server error ;(", error: error?.stack });
      return
    }
  })
  .use(JBS.json());


export default register;



