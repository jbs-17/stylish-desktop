import JBS from "jbs-web-server";
const logout = JBS.Router();


logout.route('/logout')
  .delete(async (req, res) => {
    try {
      res.setHeader(
        `Set-Cookie`,
        // `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${lamaSesiLogin}; Path=/`
        `session_id=loggedout; HttpOnly; SameSite=Strict; Max-Age=${0}; Path=/`
      );
      res.setHeader('Location', '/login');
      res.json({ status: true, message: "log out sukses! keluar dari akun!" });
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


export default logout;



