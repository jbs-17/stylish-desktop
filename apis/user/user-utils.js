









export default {
  cariInformasiFileDenganFileUID,
  cariInformasiFileDenganUserUUID,
  cariInformasiInteraksiDenganInteraksiUID
}
export {
  cariInformasiFileDenganFileUID,
  cariInformasiFileDenganUserUUID,
  cariInformasiInteraksiDenganInteraksiUID
}








function cariInformasiFileDenganFileUID(array = [], fileUID = "") {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasiFile;
    let indexInformasiFile;
    array.forEach((a, i) => {
      if (a.fileUID === fileUID) {
        informasiFile = a;
        indexInformasiFile = i;
      }
    });
    if (!informasiFile && !indexInformasiFile) {
      throw false;
    }
    informasiFile.index = indexInformasiFile;
    return {
      status: true,
      indexInformasiFile,
      informasiFile,
      index: indexInformasiFile,
    };
  } catch {
    return { status: false };
  }
}
function cariInformasiFileDenganUserUUID(array = [], userUUID = "") {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasiFile;
    let indexInformasiFile;
    array.forEach((a, i) => {
      if (a.UUID === userUUID) {
        informasiFile = a;
        indexInformasiFile = i;
      }
    });
    if (!informasiFile && !indexInformasiFile) {
      throw false;
    }
    informasiFile.index = indexInformasiFile;
    return {
      status: true,
      indexInformasiFile,
      informasiFile,
      index: indexInformasiFile,
    };
  } catch  {
    return { status: false };
  }
}

function cariInformasiInteraksiDenganInteraksiUID(
  array = [],
  interaksiUID = ""
) {
  try {
    if (array.length === 0) {
      throw Error("cariInformasiFileDenganFileUID error");
    }
    let informasIInteraksi;
    let indexInformasIInteraksi;
    array.forEach((a, i) => {
      if (a.interaksiUID === interaksiUID) {
        informasIInteraksi = a;
        indexInformasIInteraksi = i;
      }
    });
    if (!informasIInteraksi && !indexInformasIInteraksi) {
      throw false;
    }
    informasIInteraksi.index = indexInformasIInteraksi;
    return {
      status: true,
      indexInformasIInteraksi,
      informasIInteraksi,
      index: indexInformasIInteraksi,
    };
  } catch {
    return { status: false };
  }
}