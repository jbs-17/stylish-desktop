import JBS from "jbs-web-server";
import util from "node:util";
const MIMEType = util.MIMEType;
import { parse, resolve, normalize, relative } from "node:path";
import { randomFillSync } from "node:crypto";
import {
  tempdatabase,
  tempimagesdatabase,
  tempvideosdatabase,
  database,
  maxFileSize,
} from "../config.js";
import mimeTypesofExt from "../modules/content-type.js";
import readFilePage from "../modules/read-file-page.js";
import {
  tambahImageTempListAndUser,
  tambahVideoTempListAndUser,
} from "../admin/kelolatemp.js";
import tanggalString from "../modules/date-string.mjs";
import { IncomingForm } from "formidable";
import fsx from "fs-extra";


const maxFieldsSize = 1 * 1024 * 1024;
const maxFields = 5;
const maxFiles = 1;
// const maxFileSize = 20 * 1024 * 1024
const minFileSize = 0.001 * 1024 * 1024;
const upload = JBS.Router();
upload.post('/upload', (req, res) => {
  try {
    const user = req.user;
    //check apakah user login
    if (!req.user) {
      res.json({ status: false, message: "gagal upload! mohon login untuk upload!", });
      return;
    }
    //pengaturan file yang diupload
    const form = new IncomingForm({
      maxFields: maxFields,
      maxFieldsSize: maxFieldsSize,
      maxFiles: maxFiles,
      minFileSize: minFileSize,
      maxFileSize: maxFileSize,
      maxTotalFileSize: maxFileSize,
      uploadDir: tempdatabase,
      createDirsFromUploads: false,
      filename: user.username,
      defaultInvalidName: user.username,
    });
    form.uploaddir = tempdatabase;
    form.parse(req, async (err, fields, files) => {
      console.log("file datang");
      if (err) {
        const pesan = { status: false, message: `gagal upload: ${err}` };
        res.end(JSON.stringify(pesan));
        return;
      }
      //
      const file = Array.from(files["file"])[0];
      const { UUID } = req.user;
      const { filepath, newFilename, originalFilename, mimetype, size } = file;
      const { ext } = parse(originalFilename); //.pdf .jpg .mp4
      const filetype = new MIMEType(mimetype).type; //video || image
      // eslint-disable-next-line no-undef
      const fileUID = `fileUID-${randomFillSync(Buffer.alloc(8), 0).toString(
        "hex"
      )}`;
      //buat fileinfo
      const informasiFile = {
        filepath,
        newFilename,
        originalFilename,
        mimetype,
        size,
        filetype,
        ext,
        UUID,
        fileUID,
      };
      const { newfilepath, filebase, relativeFilePath, tanggal } =
        buatInformasiFile(informasiFile);
      informasiFile.newfilepath = newfilepath;
      informasiFile.filebase = filebase;
      informasiFile.relativeFilePath = relativeFilePath;
      informasiFile.tanggal = tanggal;
      informasiFile.diajukan = tanggal;
      informasiFile.judul = fields.title;
      informasiFile.deskripsi = fields.description;
      informasiFile.suka = [];
      informasiFile.simpan = [];
      informasiFile.bagi = [];
      informasiFile.laporkan = [];
      informasiFile.komentar = [];
      informasiFile.diarsipkan = false;
      informasiFile.metadata = [];
      informasiFile.datenow = Date.now();
      informasiFile.privat = false;
      informasiFile.izinkomentar = true;

      ///simpan file
      const statusMenyimpan = await simpanFile(informasiFile);
      let pesan;
      if (statusMenyimpan !== true) {
        throw statusMenyimpan;
      }

      //cek tipe file
      if (filetype === "video") {
        const tambahVideoTempListAndUserInfo = await tambahVideoTempListAndUser(
          informasiFile
        );
        if (tambahVideoTempListAndUserInfo.status === false) {
          throw tambahVideoTempListAndUserInfo.message;
        }
        pesan = {
          status: true,
          message: `berhasil upload video: ${JSON.stringify(informasiFile)}`,
        };
      } else if (filetype === "image") {
        const tambahImageTempListAndUserInfo = await tambahImageTempListAndUser(
          informasiFile
        );
        if (tambahImageTempListAndUserInfo.status === false) {
          throw tambahImageTempListAndUserInfo.message;
        }
        pesan = {
          status: true,
          message: `berhasil upload image: ${JSON.stringify(informasiFile)}`,
        };
      } else {
        pesan = {
          status: false,
          message: `gagal upload: file bukan foto atau video!!!`,
        };
      }
      res.json(pesan);
      return;
    });
  } catch (e) {
    const pesan = { status: false, message: `gagal upload: ${e}` };
    res.json(pesan);
  }
})

export { upload };
export default upload;




function buatInformasiFile({ originalFilename, filetype, ext, UUID, fileUID }) {
  try {
    //"filetype__UUID__fileUID__tanggal__.ext"
    const tanggal = tanggalString();
    const filebase = `${filetype}__${fileUID}__${UUID}__${tanggal}__${ext}`;
    let newfilepath = "";
    if (filetype == "image") {
      newfilepath = resolve(`${tempimagesdatabase}/${filebase}`);
    } else if (filetype == "video") {
      newfilepath = resolve(`${tempvideosdatabase}/${filebase}`);
    } else {
      newfilepath = resolve(
        `${tempdatabase}/${filetype}__${fileUID}__${UUID}__${tanggal}__${originalFilename}`
      );
    }
    const relativeFilePath = normalize(
      relative(database, newfilepath).replaceAll("\\", "/")
    );
    return { newfilepath, filebase, relativeFilePath, tanggal };
  } catch (e) {
    console.log("buatInformasiFile error:", e);
    return e;
  }
}
async function simpanFile({ filepath, newfilepath }) {
  try {
    await fsx.rename(filepath, newfilepath);
    return true;
  } catch (error) {
    console.log("simpanfile error:", error);
    return error;
  }
}
