
import chalk from 'chalk';

const pemberitahuan = chalk.white.bgBlack.bold.underline.overline
const error = chalk.bgRgb(255,0,0).bold.rgb(0, 0, 0).bold.underline.overline;
const parameter = chalk.bgRgb(15,15,15).bold.rgb(255,255,255).underline.overline.dim
const peringatan = chalk.bgRgb(255, 230, 0).rgb(0,0,0).bold.overline.underline
const verifikasi = chalk.bgRgb(0, 38, 255).rgb(255, 255, 255).bold.overline.underline
const cacatWaktu = chalk.black.bgWhite.underline.overline.bold



export default {
    pemberitahuan,
    error, 
    parameter,
    peringatan,
    verifikasi,
    cacatWaktu
}
export {
    pemberitahuan,
    error, 
    parameter,
    peringatan,
    verifikasi,
    cacatWaktu
}