//core
// import pkg from 'jsonfile';
// const { readFile, writeFile } = pkg;
// import { Buffer } from 'buffer';


// import { promisify } from "node:util";
// const readFileJSON = promisify(readFile);
// const writeFileJSON = promisify(writeFile);

// import {
//   randomFillSync,
//   randomUUID
// }
//   from "node:crypto";



// //  locale
// import {
//   // cariUsername,
//   // verifikasiPasswordString,
//   // verifikasiUsernameString,
//   // verifikasiUsernamePasswordString,
//   // verifikasiUsernamePasswordData,
//   cariUserDariUUID,
// } from "../apis/user/verifikasiUsenameDanPassword.js";
// import { userdatabase } from "../config.js";
// // import { hash } from "../modules/hash.js";
// import tanggalString from "../modules/date-string.mjs";

// export default {
//   // tambahUser,
//   // hapusUserPakaiUsername,
//   // hapusUserVerifikasi,
//   // gantiNamaUserPakaiUsername,
//   // gantiNamaUserVerifikasi,
//   // gantiPasswordUserPakaiUsername,
//   // gantiPasswordUserVerifikasi,
//   // tambahImageTemp,
//   // hapusImageTemp,
//   // tambahVideoTemp,
//   // hapusVideoTemp,
//   // tambahImage,
//   // tambahVideo,
//   // hapusImage,
//   // hapusVideo,
// };
// export {
//   // tambahUser,
//   // hapusUserPakaiUsername,
//   // hapusUserVerifikasi,
//   // gantiNamaUserPakaiUsername,
//   // gantiNamaUserVerifikasi,
//   // gantiPasswordUserPakaiUsername,
//   // gantiPasswordUserVerifikasi,
//   // tambahImageTemp,
//   // hapusImageTemp,
//   // tambahVideoTemp,
//   // hapusVideoTemp,
//   // tambahImage,
//   // tambahVideo,
//   // hapusImage,
//   // hapusVideo,
// };

// async function tes1() { console.log(await tambahUser('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await hapusUserPakaiUsername('admin', { boolean: false }))}
// async function tes1() { console.log(await hapusUserPakaiUsername('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiNamaUserVerifikasi('adminhebat', 'admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiPasswordUserPakaiUsername('admin', 'admin1234', { boolean: false }))}
// async function tes1() { console.log(await gantiPasswordUserVerifikasi('admina', 'admin1234', 'admin1234', { boolean: false }))}
// tes1()











/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES IMAGES
///


///

///

///

///


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////UPLOAD FILES VIDEO
///

///

///

///

///






// function cariInformasiFileDenganFileUID(array = [], fileUID = "") {
//   try {
//     if (array.length === 0) {
//       throw Error("cariInformasiFileDenganFileUID error");
//     }
//     let informasiFile;
//     let indexInformasiFile;
//     array.forEach((a, i) => {
//       if (a.fileUID === fileUID) {
//         informasiFile = a;
//         indexInformasiFile = i;
//       }
//     });
//     if (!informasiFile && !indexInformasiFile) {
//       throw false;
//     }
//     informasiFile.index = indexInformasiFile;
//     return {
//       status: true,
//       indexInformasiFile,
//       informasiFile,
//       index: indexInformasiFile,
//     };
//   } catch (error) {
//     return { status: false };
//   }
// }
// function cariInformasiFileDenganUserUUID(array = [], userUUID = "") {
//   try {
//     if (array.length === 0) {
//       throw Error("cariInformasiFileDenganFileUID error");
//     }
//     let informasiFile;
//     let indexInformasiFile;
//     array.forEach((a, i) => {
//       if (a.UUID === userUUID) {
//         informasiFile = a;
//         indexInformasiFile = i;
//       }
//     });
//     if (!informasiFile && !indexInformasiFile) {
//       throw false;
//     }
//     informasiFile.index = indexInformasiFile;
//     return {
//       status: true,
//       indexInformasiFile,
//       informasiFile,
//       index: indexInformasiFile,
//     };
//   } catch (error) {
//     return { status: false };
//   }
// }
// function cariInformasiInteraksiDenganInteraksiUID(
//   array = [],
//   interaksiUID = ""
// ) {
//   try {
//     if (array.length === 0) {
//       throw Error("cariInformasiFileDenganFileUID error");
//     }
//     let informasIInteraksi;
//     let indexInformasIInteraksi;
//     array.forEach((a, i) => {
//       if (a.interaksiUID === interaksiUID) {
//         informasIInteraksi = a;
//         indexInformasIInteraksi = i;
//       }
//     });
//     if (!informasIInteraksi && !indexInformasIInteraksi) {
//       throw false;
//     }
//     informasIInteraksi.index = indexInformasIInteraksi;
//     return {
//       status: true,
//       indexInformasIInteraksi,
//       informasIInteraksi,
//       index: indexInformasIInteraksi,
//     };
//   } catch (error) {
//     return { status: false };
//   }
// }




// const x = {
//   filepath:
//     "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\tmp\\o14zco2xlvbcrva2ihaga0rq4",
//   newFilename: "o14zco2xlvbcrva2ihaga0rq4",
//   originalFilename:
//     "Record_2024-10-27-16-24-16_998d3425f9e75a0428f0fabdce419960.mp4",
//   mimetype: "video/mp4",
//   size: 45426475,
//   filetype: "video",
//   ext: ".mp4",
//   UUID: "f6d2d67f-4ca2-49ab-a40e-14f457fb2c76",
//   fileUID: "fileUID-d4cb9380ac152f14",
//   newfilepath:
//     "C:\\Users\\HEWLETT-PACKARD\\Desktop\\Stylish-Desktop\\database\\temp\\videos\\video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
//   filebase:
//     "video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
//   relativeFilePath:
//     "temp\\videos\\video__fileUID-d4cb9380ac152f14__f6d2d67f-4ca2-49ab-a40e-14f457fb2c76__28-05-2025_22-08-42__.mp4",
//   tanggal: "28-05-2025_22-08-42",
//   judul: ["FF"],
//   deskripsi: ["free fire"],
//   suka: [],
//   simpan: [],
//   bagi: [],
//   laporkan: [],
//   komentar: [],
//   diarsipkan: false,
//   metadata: [],
// };

// const u = [
//   {
//     UUID: "3960a68b-b3f6-4b8c-a4c4-1999f988c855",
//     username: "kodrato",
//     password: "password",
//     usernameHASH:
//       "a7d934b5df2627a2ed86575726aa4261ab583400ed2d84a6380cfd02f7790ee9",
//     passwordHASH:
//       "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
//     name: "kodrato",
//     imageTemp: [],
//     videoTemp: [],
//     image: [],
//     video: [],
//     komentar: [],
//     suka: [],
//     simpan: [],
//     bagi: [],
//     ikuti: [],
//     diikuti: [],
//     settings: {},
//     arsip: [],
//     bio: [],
//     laporkan: [],
//     kelamin: "",
//     tempattanggallahir: "",
//     pp: "",
//     log: [],
//     email: "",
//     telp: "",
//   },
//   {
//     UUID: "ddb3d180-da45-448b-8025-86d7a43c6c1d",
//     username: "majiw",
//     password: "password",
//     usernameHASH:
//       "bcbaa9af32deeb2a58f405d01302b111e4ac1a7c71262d520b092a6c36c07cae",
//     passwordHASH:
//       "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
//     name: "majiw",
//     imageTemp: [],
//     videoTemp: [],
//     image: [],
//     video: [],
//     komentar: [],
//     suka: [],
//     simpan: [],
//     bagi: [],
//     ikuti: [],
//     diikuti: [],
//     settings: {},
//     arsip: [],
//     bio: [],
//     laporkan: [],
//     kelamin: "",
//     tempattanggallahir: "",
//     pp: "",
//     log: [],
//     email: "",
//     telp: "",
//     index: 6,
//   },
//   {
//     UUID: "b1189b54-3810-4935-abd3-4048b9ee6b97",
//     username: "njsae",
//     password: "password",
//     usernameHASH:
//       "87295cc2000ed7830b19bcb75cf81b7bc3a4e60474104ac72529194eb0080b74",
//     passwordHASH:
//       "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
//     name: "njsae",
//     imageTemp: [],
//     videoTemp: [],
//     image: [],
//     video: [],
//     komentar: [],
//     suka: [],
//     simpan: [],
//     bagi: [],
//     ikuti: [],
//     diikuti: [],
//     settings: {},
//     arsip: [],
//     bio: [],
//     laporkan: [],
//     kelamin: "",
//     tempattanggallahir: "",
//     pp: "",
//     log: [],
//     email: "",
//     telp: "",
//   },
// ];
// async function name() {
  // console.log(await tambahImageTemp(a));
  // console.log(await tambahVideoTemp(a));
  // console.log(await hapusVideoTemp(a));
  // console.log(await hapusImageTemp(a));
  // console.log(await tambahImage(a));
  // console.log(await tambahVideo(a));
  // console.log(await hapusImage(a));
  // console.log(await hapusVideo(a));
  // console.log(await sukaImage(u, a));
  // setTimeout(async()=>{console.log(await batalSukaImage(u, a));}, 3000)
  // console.log(await batalSimpanImage(u, a));
  // console.log(await bagiImage(u, a));
  // console.log(await komentarImage(u, a, 'komen'));
  // console.log(await batalKomentarImage(u, a, 'komen'));
  //
  // console.log(await sukaVideo(u, x))
  // console.log(await batalSukaVideo(u, x))
  // console.log(await simpanVideo(u[0], x))
  // console.log(await simpanVideo(u[1], x))
  // console.log(await simpanVideo(u[2], x))
  // console.log(await batalSimpanVideo(u[2], x))
  // console.log(await bagiVideo(u[0], x));
  // console.log(await laporkanVideo(u[0], x, 'ku laporin kamu'));
  // console.log(await komentarVideo(u[2], x, 'anjay'));
  // console.log(await komentarVideo(u[1], x, 'keren'));
  // console.log(await komentarVideo(u[0], x, 'widih'));\
  // console.log(await batalKomentarVideo(u[2], x, 'anjay'));
  // // console.log(await batalKomentarVideo(u[1], x, 'keren'));
  // console.log(await batalKomentarVideo(u[0], x, 'widih'));
// }
// name();
// console.log('end')

// let tes = Buffer.alloc(100000000);
// tes = randomFillSync(tes)
// console.log(tes.toString('hex'))


// const usr = {
//   "UUID": "4f2ffcb9-9837-436b-9752-90c4dd03423b",
//   "bergabung": "08-07-2025_17-51-50",
//   "username": "minum",
//   "password": "passworda",
//   "usernameHASH": "a091d99e3b9456fe6c74b0a6c8f52c30f07e1abab5dcf1328234974e218b3a41",
//   "passwordHASH": "58afbe0ade06cd24cca00eaf4370b35f6d2450df18fd198945cb4420012cb395",
//   "name": "minum",
//   "imageTemp": [],
//   "videoTemp": [],
//   "image": [
//     {
//       "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\fen81ybqavd8rdaiwops8355n",
//       "newFilename": "fen81ybqavd8rdaiwops8355n",
//       "originalFilename": "sampaj.jpg",
//       "mimetype": "image/jpeg",
//       "size": 202685,
//       "filetype": "image",
//       "ext": ".jpg",
//       "UUID": "4f2ffcb9-9837-436b-9752-90c4dd03423b",
//       "fileUID": "fileUID-d6b35d2113321b6c",
//       "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "filebase": "image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-d6b35d2113321b6c__4f2ffcb9-9837-436b-9752-90c4dd03423b__09-07-2025_10-10-54__.jpg",
//       "tanggal": "09-07-2025_10-10-54",
//       "judul": [
//         "SAMPAH"
//       ],
//       "deskripsi": [
//         "ITU SAMPAh"
//       ],
//       "suka": [],
//       "simpan": [],
//       "bagi": [],
//       "laporkan": [],
//       "komentar": [],
//       "diarsipkan": false,
//       "metadata": [],
//       "diterima": "09-07-2025_10-11-04"
//     }
//   ],
//   "video": [],
//   "komentar": [],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "ikuti": [],
//   "diikuti": [],
//   "settings": {},
//   "arsip": [],
//   "bio": [],
//   "laporkan": [],
//   "kelamin": "",
//   "tempattanggallahir": "",
//   "pp": "",
//   "log": [],
//   "email": "",
//   "telp": "",
//   "index": 2
// }

// const fil = {
//   "filepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\temp\\tmp\\y9x6fbsolbd27jp1uzoxvm85o",
//   "newFilename": "y9x6fbsolbd27jp1uzoxvm85o",
//   "originalFilename": "WhatsApp Image 2024-08-10 at 19.05.01_acb3647d.jpg",
//   "mimetype": "image/jpeg",
//   "size": 743602,
//   "filetype": "image",
//   "ext": ".jpg",
//   "UUID": "b1f43713-7117-43a6-8803-bbf331f4bcac",
//   "fileUID": "fileUID-1053cbe9ff555fe7",
//   "newfilepath": "C:\\Users\\HEWLETT-PACKARD\\Desktop\\projects\\stylish-desktop\\public\\upload\\images\\image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "filebase": "image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "relativeFilePath": "..\\public\\upload\\images\\image__fileUID-1053cbe9ff555fe7__b1f43713-7117-43a6-8803-bbf331f4bcac__09-07-2025_10-04-56__.jpg",
//   "tanggal": "09-07-2025_10-04-56",
//   "judul": [
//     "singkong"
//   ],
//   "deskripsi": [
//     "enak"
//   ],
//   "suka": [],
//   "simpan": [],
//   "bagi": [],
//   "laporkan": [],
//   "komentar": [],
//   "diarsipkan": false,
//   "metadata": [],
//   "diterima": "09-07-2025_10-09-08"
// }


// async function namex(params) {
//   try {
//     // console.log(await laporkanImage(usr, fil, 'lol'));
//   } catch (error) {
//     console.log(error);
//   }
// }
// // namex()