import 'dotenv/config';

const env = process.env;

const port = Number(env["SERVER_PORT"]);

export default {
  port
}

export {
  port
}
