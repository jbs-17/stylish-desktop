const mimeTypes = {
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".cjs": "application/javascript",
  ".ts": "application/typescript",
  ".tsx": "application/typescript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".csv": "text/csv",
  ".md": "text/markdown",
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  // Audio
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".m4a": "audio/mp4",
  // Video
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  // Fonts
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  // Documents
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // Archives
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".7z": "application/x-7z-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  // Executables / packages
  ".apk": "application/vnd.android.package-archive",
  ".exe": "application/vnd.microsoft.portable-executable",
  ".msi": "application/x-msdownload",
  // Misc
  ".eot": "application/vnd.ms-fontobject",
  ".swf": "application/x-shockwave-flash",
};

// module.exports = {
//   mimeTypes,
//   mimeTypesofExt
// }

export { mimeTypesofExt };
export default mimeTypesofExt;
function mimeTypesofExt(ext = "") {
  try {
    const hasil = Object.entries(mimeTypes).filter((mimeType) => {
      if (mimeType[0].includes(ext)) {
        return { mimeType };
      }
    });
    return hasil[0][1];
  } catch (e) {
    return e;
  }
}
