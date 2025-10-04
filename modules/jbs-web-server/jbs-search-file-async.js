import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export { searchFiles };

export default async function searchFiles(rootPathDir, klu = "", excepts = []) {
  try {
    //klu kecualikan
    if (!Array.isArray(excepts)) {
      Error("negative harus array");
      throw Error("negative harus array");
    }
    // console.log(excepts);
    
    // Pastikan path menjadi absolute
    rootPathDir = path.resolve(rootPathDir);
    klu = path.normalize(klu);
    // cek rootPathDir apakah direktori
    const rootPathDirDirIsDirectory = (await stat(rootPathDir)).isDirectory();
    if (!rootPathDirDirIsDirectory) {
      throw Error(`${rootPathDir} is not a directory`);
    }

    // stack direktori yang akan diperiksa
    const dirs = [rootPathDir];

    // tampung file yang ditemukan
    const files = [];

    // Loop selama masih ada direktori yang perlu diperiksa
    while (dirs.length > 0) {
      // Ambil satu direktori dari stack
      const dirx = dirs.pop();

      // Baca semua entri (file/direktori) dalam direktori itu
      const entries = (await readdir(dirx))
      .filter((entry) => {return !excepts.some((exc) => entry.includes(exc));});

      // Buat path lengkap untuk semua entri
      const paths = entries
        .map((entry) => path.resolve(dirx, entry))
        .filter((entry) => !entry.includes("node_module"));

      // Ambil stat untuk semua path secara paralel (Promise.all supaya cepat)
      const stats = await Promise.all(paths.map((p) => stat(p)));

      // Periksa hasil stat satu per satu
      for (let i = 0; i < stats.length; i++) {
        //?cek apakak direktori
        if (stats[i].isDirectory()) {
          // Kalau ketemu direktori, tambahkan ke stack untuk diproses nanti
          dirs.push(paths[i]);
        } else {
          //? berarti file
          // Cek apakah nama file mengandung kata kunci (klu)
          if (paths[i].includes(klu)) {
            // Jika cocok, tambahkan ke daftar files
            files.push(paths[i]);
          }
        }
      }
    }
    // Setelah semua direktori diperiksa, kembalikan hasilnya
    return files.sort((a, b) => { return a.length - b.length });
  } catch (err) {
    console.log({ err });
    // Kalau terjadi error (misal path tidak valid), kembalikan error
    return err;
  }
}

